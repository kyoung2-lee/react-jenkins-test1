import { once } from "events";
import { AsyncThunk } from "@reduxjs/toolkit";
import { toUtf8 } from "@smithy/util-utf8";
import { iot, mqtt5 } from "aws-iot-device-sdk-v2";
import AWS, { CognitoIdentityCredentials } from "aws-sdk";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { cognitoToken } from "../Cognito/CognitoToken";
import { ServerConfig } from "../../../config/config";
import { AppDispatch } from "../../store/storeType";
import { NotificationCreator } from "../notifications";
import { SoalaMessage } from "../soalaMessages";
import { attachPolicyToIdentityId } from "./attachPolicy";
import { storage } from "../storage";
import { isAuthExpired, isCurrentPath } from "../commonUtil";
import { Const } from "../commonConst";
import AWSCognitoCredentialsProvider from "./AWSCognitoCredentialsProvider";

type AppAsyncThunk = AsyncThunk<void, void, any> | null;
type AppAsyncThunkPayload = AsyncThunk<void, { payload: string }, any>;
type AppAsyncThunkUser = AsyncThunk<void, { user: JobAuthApi.User }, any>;

type ConnectOptions = {
  dispatch: AppDispatch;
  user: JobAuthApi.User;
  callbacksOnMessageArrived: {
    fis: AppAsyncThunkPayload;
    headerInfo: AppAsyncThunkPayload;
    spotRemarks: AppAsyncThunkPayload;
    acarsStatus: AppAsyncThunkPayload;
    master: AppAsyncThunkUser;
    daily: AppAsyncThunk;
  };
  callbackOnConnectionStart?: () => void;
  callbackOnConnected?: () => void;
  callbackOnNotConnected?: () => void;
  callbackOnReconnected?: () => void;
  callbackOnDisconnected?: () => void;
};

class Mqtt {
  private client: mqtt5.Mqtt5Client | null = null;
  private clientId = "";

  private userId = "";
  private user: JobAuthApi.User | undefined;
  private dispatch: AppDispatch | undefined;
  private mqttPubsubVersion = "";
  private connected = false;
  private onMessageArrivedAsFis?: AppAsyncThunkPayload;
  private onMessageArrivedAsHeaderInfo?: AppAsyncThunkPayload;
  private onMessageArrivedAsSpotRemarks?: AppAsyncThunkPayload;
  private onMessageArrivedAsAcarsStatus?: AppAsyncThunkPayload;
  private onMessageArrivedAsMaster?: AppAsyncThunkUser;
  private onMessageArrivedAsDaily?: AppAsyncThunk;
  private onConnectionStart: () => void = () => {};
  private onConnected: () => void = () => {};
  private onNotConnected: () => void = () => {};
  private onReconnected: () => void = () => {};
  private onDisconnected: () => void = () => {};
  private fltTopic = "";
  private apoTopic = "";
  private sptTopic = "";
  private astTopic = "";
  private controlTopic = "";
  private controlOneTopic = "";
  private functionKillTimestamp = "";

  private timeoutId: NodeJS.Timeout | undefined;

  notify({ expletiveId, message }: { expletiveId: string; message: NotificationCreator.Message }) {
    if (this.dispatch) {
      NotificationCreator.create({
        dispatch: this.dispatch,
        id: `MqttErrorMessageId${expletiveId}`,
        message,
      });
    }
  }

  scheduleReconnectionStop = (delayMs: number) => {
    if (this.timeoutId) {
      return;
    }
    this.timeoutId = setTimeout(() => {
      void (async () => {
        console.log("setTimeout", { date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
        await this.disconnect();
        this.timeoutId = undefined;
      })();
    }, delayMs * 1000);
    console.log("scheduleReconnectionStop", { timeoutId: this.timeoutId, delayMs, date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
  };

  clearReconnectionStop = () => {
    console.log("clearReconnectionStop", { timeoutId: this.timeoutId, date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  };

  createClient = (provider: AWSCognitoCredentialsProvider) =>
    new Promise<void>((resolve, reject) => {
      const wsConfig: iot.WebsocketSigv4Config = {
        credentialsProvider: provider,
        region: ServerConfig.AWS_REGION,
      };

      this.clientId = `${ServerConfig.IOT_CLIENT_ID_PREFIX}-${uuid()}`;

      const builder: iot.AwsIotMqtt5ClientConfigBuilder = iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
        ServerConfig.IOT_ENDPOINT,
        wsConfig
      )
        .withConnectProperties({
          keepAliveIntervalSeconds: ServerConfig.MQTT_KEEP_ALIVE,
          clientId: this.clientId,
          sessionExpiryIntervalSeconds: ServerConfig.MQTT_SESSION_EXPIRY,
        })
        .withSessionBehavior(mqtt5.ClientSessionBehavior.RejoinAlways)
        .withRetryJitterMode(mqtt5.RetryJitterType.Default);

      this.client = new mqtt5.Mqtt5Client(builder.build());
      this.client.on("error", (error) => {
        console.error({ error });
        reject(error);
      });

      this.client.on("messageReceived", (eventData: mqtt5.MessageReceivedEvent): void => {
        console.log("Message Received event", { eventData, date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
        if (eventData.message.qos === mqtt5.QoS.AtLeastOnce) {
          this.onMessageArrived(eventData);
        }
      });

      this.client.on("attemptingConnect", (eventData: mqtt5.AttemptingConnectEvent) => {
        console.log("Attempting Connect event", { eventData, date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
      });

      this.client.on("connectionSuccess", (eventData: mqtt5.ConnectionSuccessEvent) => {
        console.log("Connection Success event", { eventData, date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
        this.connected = true;
        this.onReconnected();
        this.clearReconnectionStop();
        if (this.client && !eventData.connack.sessionPresent) {
          const topics = this.getSubscribedTopics();
          if (topics.length) {
            this.client
              .subscribe({
                subscriptions: topics.map((qos1Topic) => ({ qos: mqtt5.QoS.AtLeastOnce, topicFilter: qos1Topic })),
              })
              .then((suback) => {
                console.log({ suback });
              })
              .catch((err) => console.error(err));
          }
        }
      });

      this.client.on("connectionFailure", (eventData: mqtt5.ConnectionFailureEvent) => {
        console.log("Connection failure event", { eventData, date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
        this.onFailure(eventData);
      });

      this.client.on("disconnection", (eventData: mqtt5.DisconnectionEvent) => {
        console.log("Disconnection event", { eventData, date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
        this.fltTopic = "";
        this.apoTopic = "";
        this.sptTopic = "";
        this.astTopic = "";
        this.controlTopic = "";
        this.controlOneTopic = "";
        // this.onNotConnected();
        this.connected = false;
        // keepAlive後再接続無効化
        this.scheduleReconnectionStop(ServerConfig.MQTT_SESSION_EXPIRY);
      });

      this.client.on("stopped", (eventData: mqtt5.StoppedEvent) => {
        console.log("Stopped event", { eventData, date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
        this.connected = false;
      });

      this.mqttPubsubVersion = ServerConfig.MQTT_PUBSUB_VERSION || "";

      resolve();
    });

  getSubscribedTopics = (): string[] =>
    [this.fltTopic, this.apoTopic, this.sptTopic, this.astTopic, this.controlTopic, this.controlOneTopic].filter((topic) => !!topic);

  // 接続失敗時のコールバック
  onFailure = (eventData: mqtt5.ConnectionFailureEvent) => {
    if (eventData.connack?.reasonCode !== 0) {
      console.log(
        `MQTT func connect Failure ${this.clientId} ${eventData.connack?.reasonCode ?? ""} ${eventData.connack?.reasonString ?? ""}`
      );
    } else {
      console.log(`MQTT func connect Failure ${this.clientId}`);
    }
    this.onNotConnected();
  };

  // メッセージ受け取り時のコールバック
  onMessageArrived = (eventData: mqtt5.MessageReceivedEvent) => {
    const {
      message: { payload, topicName },
    } = eventData;
    const message = payload ? toUtf8(payload as Buffer) : "";
    console.log(`MQTT MessageArrived destinationName:${topicName}`);

    const ctlBase = `CTL/ALL/${storage.terminalCat || ""}`;
    const ctlBaseOne = `CTL/ONE/${storage.terminalCat || ""}/${this.userId}`;
    const version: string = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";

    switch (true) {
      case new RegExp(`^BIZ${version}/[A-Za-z0-9]+/FLT/*`).test(topicName): {
        // FISに反映
        console.log("MQTT MessageArrived Doing BIZ/FLT");
        if (this.dispatch && this.onMessageArrivedAsFis) {
          void this.dispatch(this.onMessageArrivedAsFis({ payload: message }));
        }
        break;
      }
      case new RegExp(`^BIZ${version}/[A-Za-z0-9]+/APO/*`).test(topicName): {
        // 空港発令
        console.log("MQTT MessageArrived Doing BIZ/APO");
        if (this.dispatch && this.onMessageArrivedAsHeaderInfo) {
          void this.dispatch(this.onMessageArrivedAsHeaderInfo({ payload: message }));
        }
        break;
      }
      case new RegExp(`^BIZ${version}/[A-Za-z0-9]+/SPT/*`).test(topicName): {
        // 空港SPOT情報
        console.log("MQTT MessageArrived Doing BIZ/SPT");
        if (this.dispatch && this.onMessageArrivedAsSpotRemarks) {
          void this.dispatch(this.onMessageArrivedAsSpotRemarks({ payload: message }));
        }
        break;
      }
      case new RegExp(`^BIZ${version}/[A-Za-z0-9]+/AST/*`).test(topicName): {
        // ACARSステータス情報
        console.log("MQTT MessageArrived Doing BIZ/AST");
        if (this.dispatch && this.onMessageArrivedAsAcarsStatus) {
          void this.dispatch(this.onMessageArrivedAsAcarsStatus({ payload: message }));
        }
        break;
      }
      case topicName === `${ctlBase}/DAILY` || topicName === `${ctlBaseOne}/DAILY`: {
        // 日替わり処理実施
        console.log("MQTT MessageArrived Doing DAILY");
        if (this.dispatch && this.onMessageArrivedAsDaily) {
          void this.dispatch(this.onMessageArrivedAsDaily());
        }
        break;
      }
      case topicName === `${ctlBase}/CLOSE` || topicName === `${ctlBaseOne}/CLOSE`: {
        // クライアントアプリケーションの強制終了
        console.log("MQTT MessageArrived Doing CLOSE");
        void this.disconnect();
        this.onNotConnected();
        if (isCurrentPath(Const.PATH_NAME.fis) || isCurrentPath(Const.PATH_NAME.barChart)) {
          // FIS、バーチャートのみ
          window.close();
        }
        break;
      }
      case topicName === `${ctlBase}/RELOAD` || topicName === `${ctlBaseOne}/RELOAD`: {
        // クライアントアプリケーションの再起動（リロード）
        console.log("MQTT MessageArrived Doing RELOAD");
        if (isCurrentPath(Const.PATH_NAME.fis) || isCurrentPath(Const.PATH_NAME.barChart)) {
          // FIS、バーチャートのみ
          const onOkButton = () => {
            void (async () => {
              try {
                // 切断
                await this.disconnect();
                // MQTTサーバー情報取得
                await this.startConnect({
                  onError: () => {
                    this.onNotConnected();
                    this.notify({ expletiveId: "", message: SoalaMessage.M50022C() });
                  },
                });
              } catch (err) {
                if (err instanceof Error) {
                  console.log(err.message);
                }
              }
            })();
          };
          this.notify({ expletiveId: "Reload", message: SoalaMessage.M40009C({ onOkButton }) });
        }
        break;
      }
      case /^CTL\/LOGUPLOAD\/.+/.test(topicName): {
        // ※未実装
        // クライアントログアップロード要求（送信電文に対象端末を指定）
        console.log("MQTT MessageArrived Doing LOGUPLOAD");
        break;
      }
      // マスター再取得
      case topicName === `${ctlBase}/RELOAD/MASTER` || topicName === `${ctlBaseOne}/RELOAD/MASTER`: {
        // マスターデータ再読込指示
        console.log("MQTT MessageArrived Doing MASTER");
        const onOkButton = () => {
          if (this.dispatch && this.onMessageArrivedAsMaster && this.user) {
            // マスター再読み込み
            void this.dispatch(this.onMessageArrivedAsMaster({ user: this.user }));
          }
        };
        this.notify({ expletiveId: "Master", message: SoalaMessage.M40010C({ onOkButton }) });
        break;
      }
      case topicName === `${ctlBase}/KILL` || topicName === `${ctlBaseOne}/KILL`: {
        const kbn = message.substr(0, 1);
        const timeStamp = message.substr(1);
        // 認証切れPUSH画面の終了処理
        if (timeStamp !== this.functionKillTimestamp) {
          // タイムスタンプが一致しないもの
          // FIS、バーチャートのみ
          if ((kbn === "F" || kbn === "B") && (isCurrentPath(Const.PATH_NAME.fis) || isCurrentPath(Const.PATH_NAME.barChart))) {
            console.log("MQTT MessageArrived Doing KILL");
            if (isAuthExpired()) {
              void this.disconnect();
              this.onNotConnected();
              const onOkButton = () => window.close();
              this.notify({ expletiveId: "Kill", message: SoalaMessage.M40025C({ onOkButton }) });
            }
          }
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  connect = async ({
    dispatch,
    user,
    callbacksOnMessageArrived,
    callbackOnConnectionStart,
    callbackOnConnected,
    callbackOnNotConnected,
    callbackOnReconnected,
    callbackOnDisconnected,
  }: ConnectOptions) => {
    this.dispatch = dispatch;
    this.userId = user.userId;
    this.user = user;
    this.onMessageArrivedAsFis = callbacksOnMessageArrived.fis;
    this.onMessageArrivedAsHeaderInfo = callbacksOnMessageArrived.headerInfo;
    this.onMessageArrivedAsSpotRemarks = callbacksOnMessageArrived.spotRemarks;
    this.onMessageArrivedAsAcarsStatus = callbacksOnMessageArrived.acarsStatus;
    this.onMessageArrivedAsMaster = callbacksOnMessageArrived.master;
    this.onMessageArrivedAsDaily = callbacksOnMessageArrived.daily;
    if (callbackOnConnectionStart) {
      this.onConnectionStart = callbackOnConnectionStart;
    }
    if (callbackOnConnected) {
      this.onConnected = callbackOnConnected;
    }
    if (callbackOnNotConnected) {
      this.onNotConnected = callbackOnNotConnected;
    }
    if (callbackOnReconnected) {
      this.onReconnected = callbackOnReconnected;
    }
    if (callbackOnDisconnected) {
      this.onDisconnected = callbackOnDisconnected;
    }
    await this.startConnect({
      onError: () => {
        if (this.client) {
          this.client.stop();
          this.clearCredentialsCache();
        }
        this.onNotConnected();
        this.notify({ expletiveId: "", message: SoalaMessage.M50022C() });
      },
    });
  };

  private startConnect = async ({ onError }: { onError?: () => void }) => {
    this.onConnectionStart();
    try {
      const token = await cognitoToken.getToken();
      const idToken = token?.idToken;
      if (!idToken) {
        console.error("Cognitoでの認証が必要です。");
        if (onError) {
          onError();
        }
        return;
      }

      const isAttached = await attachPolicyToIdentityId(idToken);
      if (!isAttached) {
        if (onError) {
          onError();
        }
        return;
      }
      /** Set up the credentialsProvider */
      const provider = new AWSCognitoCredentialsProvider(
        {
          IdentityPoolId: ServerConfig.COGNITO_IDENTITY_POOL_ID,
          Region: ServerConfig.AWS_REGION,
        },
        300,
        onError
      );

      /** Make sure the credential provider fetched before setup the connection */
      await provider.refreshCredentials();

      await this.createClient(provider);

      if (this.client) {
        const attemptingConnect = once(this.client, "attemptingConnect");
        const connectionSuccess = once(this.client, "connectionSuccess");

        this.client.start();

        await attemptingConnect;
        await connectionSuccess;

        // 他のタブをKill
        await this.sendKillMessage();
        // 制御をサブスクライブ
        void this.controlSubscribe();
        // 接続時の処理
        this.onConnected();
      }
    } catch (err) {
      console.error({ err });
      if (onError) {
        onError();
      }
    }
  };

  subscribe = async (topics: string[]) => {
    if (this.client && topics.length) {
      console.log(`MQTT func subscribe Start ${topics.join(",")}`);
      const suback = await this.client.subscribe({
        subscriptions: topics.map((qos1Topic) => ({ qos: mqtt5.QoS.AtLeastOnce, topicFilter: qos1Topic })),
      });
      console.log({ suback, topics });
    }
  };

  private clearCredentialsCache = () => {
    if (AWS.config.credentials && (AWS.config.credentials as CognitoIdentityCredentials).clearCachedId) {
      (AWS.config.credentials as CognitoIdentityCredentials).clearCachedId();
    }
  };

  /**
   * アンサブスクライブ
   */
  private async unSubscribe(topics: string[]): Promise<void> {
    if (this.client && topics.length) {
      const unsubackPacket = await this.client.unsubscribe({
        topicFilters: topics,
      });
      console.log("MQTT func unSubscribe", { topics, unsubackPacket });
      if (unsubackPacket) {
        unsubackPacket.reasonCodes.forEach((reasonCode) => {
          if (!mqtt5.isSuccessfulUnsubackReasonCode(reasonCode)) {
            throw new Error(`MQTT func unSubscribe Failure ${this.clientId} ${reasonCode} ${unsubackPacket.reasonString ?? ""}`);
          }
        });
      }
    }
  }

  /**
   * SPT（空港SPOT情報単位）アンサブスクライブ
   */
  async sptUnSubscribe() {
    try {
      await this.unSubscribe([this.sptTopic]);
      this.sptTopic = "";
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * AST（ACARSステータス情報単位）サブスクライブ
   */
  async astSubscribe(): Promise<void> {
    try {
      await this.unSubscribe([this.astTopic]); // 一旦アンサブスクライブ
      const version: string = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
      this.astTopic = `BIZ${version}/+/AST/#`;
      await this.subscribe([this.astTopic]);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * AST（ACARSステータス情報単位）アンサブスクライブ
   */
  async astUnSubscribe() {
    try {
      await this.unSubscribe([this.astTopic]);
      this.astTopic = "";
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * 制御サブスクライブ
   */
  private async controlSubscribe(): Promise<void> {
    try {
      // 全体用
      await this.unSubscribe([this.controlTopic]); // 一旦アンサブスクライブ
      this.controlTopic = `CTL/ALL/${storage.terminalCat || ""}/#`;
      await this.subscribe([this.controlTopic]);
      // 個別用
      await this.unSubscribe([this.controlOneTopic]); // 一旦アンサブスクライブ
      this.controlOneTopic = `CTL/ONE/${storage.terminalCat || ""}/${this.userId}/#`;
      await this.subscribe([this.controlOneTopic]);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * 制御アンサブスクライブ
   */
  private async controlUnSubscribe() {
    try {
      await this.unSubscribe([this.controlTopic]);
      this.controlTopic = "";
      await this.unSubscribe([this.controlOneTopic]);
      this.controlOneTopic = "";
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * FLT（便情報単位）サブスクライブ
   */
  async fltSubscribe(apo: string): Promise<void> {
    try {
      await this.unSubscribe([this.fltTopic]); // 一旦アンサブスクライブ
      const version: string = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
      this.fltTopic = `BIZ${version}/${apo}/FLT/#`;
      await this.subscribe([this.fltTopic]);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * FLT（便情報単位）アンサブスクライブ
   */
  async fltUnSubscribe() {
    try {
      await this.unSubscribe([this.fltTopic]);
      this.fltTopic = "";
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * APO（空港情報単位）サブスクライブ
   */
  async apoSubscribe(apo: string): Promise<void> {
    try {
      await this.unSubscribe([this.apoTopic]); // 一旦アンサブスクライブ
      const version: string = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
      this.apoTopic = `BIZ${version}/${apo}/APO/#`;
      await this.subscribe([this.apoTopic]);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * APO（空港情報単位）アンサブスクライブ
   */
  async apoUnSubscribe() {
    try {
      await this.unSubscribe([this.apoTopic]);
      this.apoTopic = "";
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * SPT（空港SPOT情報単位）サブスクライブ
   */
  async sptSubscribe(apo: string): Promise<void> {
    try {
      await this.unSubscribe([this.sptTopic]); // 一旦アンサブスクライブ
      const version: string = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
      this.sptTopic = `BIZ${version}/${apo}/SPT/#`;
      await this.subscribe([this.sptTopic]);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * 他のタブを閉じるメッセージを送信する
   */
  sendKillMessage = async () => {
    if (this.connected && this.client) {
      // メッセージにUTCタイムスタンプを含める
      this.functionKillTimestamp = Date.now().toString();
      let kbn = " ";
      if (isCurrentPath(Const.PATH_NAME.fis)) {
        kbn = "F";
      } else {
        kbn = "B";
      }
      const message = kbn + this.functionKillTimestamp;
      const ctlBaseOne = `CTL/ONE/${storage.terminalCat || ""}/${this.userId}`;
      const topicName = `${ctlBaseOne}/KILL`;
      try {
        console.log("MQTT Sending kill message");
        const publishResult = await this.client.publish({
          qos: mqtt5.QoS.AtLeastOnce,
          topicName,
          payload: message,
        });
        console.log({ publishResult });
      } catch (err) {
        console.log("MQTT Sending kill message failed");
      }
    }
  };

  disconnect = async () => {
    console.log("disconnect", { client: this.client, date: dayjs().format("YYYY-MM-DD HH:mm:ss") });
    this.onNotConnected();
    if (this.client) {
      await this.fltUnSubscribe();
      await this.apoUnSubscribe();
      await this.sptUnSubscribe();
      await this.astUnSubscribe();
      await this.controlUnSubscribe();

      this.connected = false;

      const disconnection = once(this.client, "disconnection");
      const stopped = once(this.client, "stopped");
      this.client.stop();
      await disconnection;
      await stopped;
      this.client.close();
      this.onDisconnected();
      this.clearReconnectionStop();
      this.clearCredentialsCache();
      this.client = null;
      console.log("MQTT func Disconnect End");
    }
  };
}

export const mqtt = new Mqtt();
