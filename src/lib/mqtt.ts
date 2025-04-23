/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { AsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/storeType";
import { WebApi } from "./webApi";
import { NotificationCreator } from "./notifications";
import { SoalaMessage } from "./soalaMessages";
import { Const } from "./commonConst";
import { isAuthExpired, isCurrentPath } from "./commonUtil";
import { storage } from "./storage";
import { Master } from "../reducers/account";
import { ServerConfig } from "../../config/config";

type AppAsyncThunk = AsyncThunk<void, void, any> | null;
type AppAsyncThunkPayload = AsyncThunk<void, { payload: string }, any>;
type AppAsyncThunkUser = AsyncThunk<void, { user: JobAuthApi.User }, any>;

export class Mqtt {
  private userId = "";
  private user: JobAuthApi.User | undefined;
  private dispatch: AppDispatch | undefined;
  private settingRetryTimes = 0;
  private settingRetryInterval = 5;
  private mqttPubsubVersion = "";
  private currentServer = 0; // 直近に接続していたサーバー
  private client: any;
  private connected = false;
  private forceDisconnectFlg = false; // 接続終了のフラグ
  private onMessageArrivedAsFis?: AppAsyncThunkPayload;
  private onMessageArrivedAsHeaderInfo?: AppAsyncThunkPayload;
  private onMessageArrivedAsSpotRemarks?: AppAsyncThunkPayload;
  private onMessageArrivedAsAcarsStatus?: AppAsyncThunkPayload;
  private onMessageArrivedAsMaster?: AppAsyncThunkUser;
  private onMessageArrivedAsDaily?: AppAsyncThunk;
  private onConnectionStart: () => void = () => {};
  private onConnected: () => void = () => {};
  private onNotConnected: () => void = () => {};
  private fltTopic = "";
  private apoTopic = "";
  private sptTopic = "";
  private astTopic = "";
  private controlTopic = "";
  private controlOneTopic = "";
  private functionKillTimestamp = "";

  private servers: {
    host: string;
    port: number;
    useSsl: boolean;
  }[] = [];

  notify({ expletiveId, message }: { expletiveId: string; message: NotificationCreator.Message }) {
    if (this.dispatch) {
      NotificationCreator.create({
        dispatch: this.dispatch,
        id: `MqttErrorMessageId${expletiveId}`,
        message,
      });
    }
  }

  /**
   * MQサーバーに接続する
   */
  async connect({
    dispatch,
    user,
    callbacksOnMessageArrived,
    callbackOnConnectionStart,
    callbackOnConnected,
    callbackOnNotConnected,
  }: {
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
  }): Promise<void> {
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
    try {
      // MQTTサーバー情報取得
      await this.getMqttServers();
      // MQTT設定取得
      this.getMqttSettings();
      // TOPICのバージョン取得
      this.mqttPubsubVersion = ServerConfig.MQTT_PUBSUB_VERSION || "";
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      this.notify({ expletiveId: "", message: SoalaMessage.M50022C() });
      return;
    }
    // すでに接続されていれば切断する
    await this.disconnect();
    // MQTT接続
    await this.connnectRetrying({
      retryTimes: this.settingRetryTimes,
      retryInterval: this.settingRetryInterval,
      startServer: 0,
    }).catch(() => {
      this.onNotConnected();
      this.notify({ expletiveId: "", message: SoalaMessage.M50022C() });
    });
  }

  /**
   * MQTT接続サーバーを取得する
   * （エラーを返すので必ずTry,Catchする）
   */
  async getMqttServers() {
    // サーバー情報の取得
    if (!this.dispatch) {
      return;
    }
    const response = await WebApi.getMqttServer(this.dispatch);
    this.servers = response.data.mqttServerList
      .filter((s) => {
        if (s.url === null) return false;
        if (s.portNo === null) return false;
        if (s.serverActFlg === null) return false;
        if (s.mqttConnectCnt === null) return false;
        if (!s.serverActFlg) return false;
        return true;
      })
      .sort((a, b) => {
        // 接続数の少ない順にソート
        const cnt1 = a.mqttConnectCnt ? a.mqttConnectCnt : 0;
        const cnt2 = b.mqttConnectCnt ? b.mqttConnectCnt : 0;
        return cnt1 - cnt2;
      })
      .map((s) => ({
        host: s.url ? s.url : "",
        port: s.portNo ? s.portNo : 0,
        useSsl: s.httpsFlg ? s.httpsFlg : false,
      }));
  }

  /**
   * MQTT設定情報（Webストレージのコードテーブル）を取得する
   * （parse()関数がエラーを返すので必ずTry,Catchする）
   */
  getMqttSettings() {
    // ストレージのマスタ情報を取得
    if (storage.masterResponse) {
      const master: Master = JSON.parse(storage.masterResponse) as Master;
      // 設定を取得（リトライ回数）
      const retryTimes = master.cdCtrlDtls
        .filter((c) => c.cdCls === "015" && c.cdCat1 === "RETRY_TIMES")
        .map((c) => c.num1)
        .shift();
      if (retryTimes) {
        this.settingRetryTimes = retryTimes;
      } else {
        console.log("MQTT Failed to get retryTimes");
      }
      // 設定を取得（リトライ間隔）
      const retryInterval = master.cdCtrlDtls
        .filter((c) => c.cdCls === "015" && c.cdCat1 === "RETRY_INTERVAL")
        .map((c) => c.num1)
        .shift();
      if (retryInterval) {
        this.settingRetryInterval = retryInterval;
      } else {
        console.log("MQTT Failed to get retryInterval");
      }
    } else {
      console.log("MQTT Can not get MQTT settings");
    }
  }

  /**
   * MQTTサーバーから切断する
   */
  async disconnect() {
    try {
      if (this.connected && this.client) {
        await this.fltUnSubscribe();
        await this.apoUnSubscribe();
        await this.sptUnSubscribe();
        await this.astUnSubscribe();
        await this.controlUnSubscribe();
        this.connected = false;
        this.forceDisconnectFlg = true;
        await this.client.disconnect();
        this.fltTopic = "";
        this.apoTopic = "";
        this.sptTopic = "";
        this.astTopic = "";
        this.controlTopic = "";
        this.controlOneTopic = "";
        console.log("MQTT func Disconnect End");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * 他のタブを閉じるメッセージを送信する
   */
  sendKillMessage() {
    if (this.connected && this.client) {
      // メッセージにUTCタイムスタンプを含める
      this.functionKillTimestamp = Date.now().toString();
      let kbn = " ";
      if (isCurrentPath(Const.PATH_NAME.fis)) {
        kbn = "F";
      } else {
        kbn = "B";
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const message = new Messaging.Message(kbn + this.functionKillTimestamp);
      const ctlBaseOne = `CTL/ONE/${storage.terminalCat || ""}/${this.userId}`;

      message.destinationName = `${ctlBaseOne}/KILL`;
      try {
        console.log("MQTT Sending kill message");
        this.client.send(message);
      } catch (err) {
        console.log("MQTT Sending kill message failed");
      }
    }
  }

  // eslint-disable-next-line no-promise-executor-return
  private sleepByPromise = (milSec: number) => new Promise((resolve) => setTimeout(resolve, milSec));

  /**
   * 複数のMQTTサーバーへリトライしながら接続する
   */
  private connnectRetrying = ({
    retryTimes,
    retryInterval,
    startServer,
    serverRetryCnt,
  }: {
    retryTimes: number;
    retryInterval: number;
    startServer: number /* サーバー数を超えててもOK */;
    serverRetryCnt?: number;
  }): Promise<void> => {
    this.onConnectionStart(); // 接続処理開始

    return new Promise((resolve, reject) => {
      void (async () => {
        if (!this.servers.length) {
          console.log("MQTT Can not connect (There is no server to connect)");
          return reject();
        }
        let cnt = 0; // 処理数
        let curServer = startServer % this.servers.length; // 現在の接続サーバー
        const maxCnt = serverRetryCnt || this.servers.length; // 接続を試すサーバー数（デフォルトはMQTTのサーバー数）
        console.log(`MQTT func connnectRetrying START startServer:${curServer} retryTimes:${retryTimes}`);
        for (;;) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await this.connnectToServer({ retryTimes, retryInterval, curServer });
            return resolve(); // 接続成功
          } catch (err) {
            cnt += 1;
            if (cnt >= maxCnt) {
              break;
            }
            curServer += 1;
            if (this.servers.length <= curServer) {
              curServer = 0;
            }
          }
        }
        // 接続失敗
        console.log("MQTT Can not connect");
        return reject();
      })();
    });
  };

  /**
   * MQTTサーバーへ接続する
   */
  private connnectToServer = ({
    retryTimes,
    retryInterval,
    curServer,
  }: {
    retryTimes: number;
    retryInterval: number;
    curServer: number;
  }): Promise<void> =>
    new Promise((resolve, reject) => {
      void (async () => {
        if (this.servers.length > 0) {
          let cnt = -1; // ( retryTimes + 1 ) 回試行する
          this.currentServer = 0;
          for (;;) {
            cnt += 1;
            if (cnt > 0) {
              // eslint-disable-next-line no-await-in-loop
              await this.sleepByPromise(retryInterval * 1000);
            }
            try {
              const server = this.servers[curServer];
              console.log(`MQTT connecting to Server:${curServer}`);
              // eslint-disable-next-line no-await-in-loop
              await this.connectPromise(server.host, server.port, server.useSsl);
              this.currentServer = curServer;
              return resolve();
            } catch (err) {
              if (cnt >= retryTimes) {
                console.log(`MQTT Retring to Server:${curServer} failed`);
                break;
              }
            }
          }
          return reject();
        }
        this.currentServer = 0;
        return reject();
      })();
    });

  private connectPromise = (host: string, port: number, useSsl: boolean): Promise<void> =>
    new Promise((resolve, reject) => {
      // 接続時のコールバック
      const onSuccess = () => {
        this.connected = true;
        this.forceDisconnectFlg = false;
        console.log(`MQTT func connect Success ${this.client.clientId}`);
        // 他のタブをKill
        this.sendKillMessage();
        // 制御をサブスクライブ
        void this.controlSubscribe();
        // 接続時の処理
        this.onConnected();
        return resolve();
      };
      // 切断時のコールバック
      const onConnectionLost = async (responseObject: any) => {
        if (responseObject.errorCode !== 0) {
          console.log(`MQTT ConnectionLost ${this.client.clientId} ${responseObject.errorCode} ${responseObject.errorMessage}`);
        }
        this.connected = false;
        this.fltTopic = "";
        this.apoTopic = "";
        this.sptTopic = "";
        this.astTopic = "";
        this.controlTopic = "";
        this.controlOneTopic = "";

        // 再接続
        if (!this.forceDisconnectFlg) {
          if (isCurrentPath(Const.PATH_NAME.fis) || isCurrentPath(Const.PATH_NAME.barChart)) {
            // FIS、バーチャートのみ

            const curServer = this.currentServer;
            // 再接続処理（現在のサーバーのみにリトライ接続）
            await this.connnectRetrying({
              retryTimes: this.settingRetryTimes,
              retryInterval: this.settingRetryInterval,
              startServer: curServer,
              serverRetryCnt: 1,
            }).catch(() => {
              // 現在のサーバーの接続に失敗した場合、残りのサーバーに接続する
              this.onNotConnected(); // 自動更新をOFFにする
              // 自動更新を再スタートするかの確認メッセージを表示する
              const onYesButton = () => {
                void (async () => {
                  try {
                    // MQTT設定取得（マスタが更新されているかもしれないので）
                    this.getMqttSettings();
                    // 再接続処理
                    await this.connnectRetrying({
                      retryTimes: this.settingRetryTimes,
                      retryInterval: this.settingRetryInterval,
                      startServer: curServer + 1,
                      serverRetryCnt: this.servers.length ? this.servers.length - 1 : 0,
                    }).catch(() => {
                      this.onNotConnected();
                      this.notify({ expletiveId: "", message: SoalaMessage.M50022C() });
                    });
                  } catch (err) {
                    if (err instanceof Error) {
                      console.log(err.message);
                    }
                  }
                })();
              };
              this.notify({ expletiveId: "Restart", message: SoalaMessage.M40007C({ onYesButton }) });
            });
          }
        }
      };
      // 接続失敗時のコールバック
      const onFailure = (responseObject: any) => {
        if (responseObject.errorCode !== 0) {
          console.log(`MQTT func connect Failure ${this.client.clientId} ${responseObject.errorCode} ${responseObject.errorMessage}`);
        } else {
          console.log(`MQTT func connect Failure ${this.client.clientId}`);
        }
        return reject();
      };
      // メッセージ受け取り時のコールバック
      const onMessageArrived = (message: any) => {
        console.log(`MQTT MessageArrived destinationName:${message.destinationName}`);

        const topic: string = message.destinationName;
        const ctlBase = `CTL/ALL/${storage.terminalCat || ""}`;
        const ctlBaseOne = `CTL/ONE/${storage.terminalCat || ""}/${this.userId}`;
        const version: string = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";

        switch (true) {
          case new RegExp(`^BIZ${version}/[A-Za-z0-9]+/FLT/*`).test(topic): {
            // FISに反映
            console.log("MQTT MessageArrived Doing BIZ/FLT");
            if (this.dispatch && this.onMessageArrivedAsFis) {
              void this.dispatch(this.onMessageArrivedAsFis({ payload: message.payloadString }));
            }
            break;
          }
          case new RegExp(`^BIZ${version}/[A-Za-z0-9]+/APO/*`).test(topic): {
            // 空港発令
            console.log("MQTT MessageArrived Doing BIZ/APO");
            if (this.dispatch && this.onMessageArrivedAsHeaderInfo) {
              void this.dispatch(this.onMessageArrivedAsHeaderInfo({ payload: message.payloadString }));
            }
            break;
          }
          case new RegExp(`^BIZ${version}/[A-Za-z0-9]+/SPT/*`).test(topic): {
            // 空港SPOT情報
            console.log("MQTT MessageArrived Doing BIZ/SPT");
            if (this.dispatch && this.onMessageArrivedAsSpotRemarks) {
              void this.dispatch(this.onMessageArrivedAsSpotRemarks({ payload: message.payloadString }));
            }
            break;
          }
          case new RegExp(`^BIZ${version}/[A-Za-z0-9]+/AST/*`).test(topic): {
            // ACARSステータス情報
            console.log("MQTT MessageArrived Doing BIZ/AST");
            if (this.dispatch && this.onMessageArrivedAsAcarsStatus) {
              void this.dispatch(this.onMessageArrivedAsAcarsStatus({ payload: message.payloadString }));
            }
            break;
          }
          case topic === `${ctlBase}/DAILY` || topic === `${ctlBaseOne}/DAILY`: {
            // 日替わり処理実施
            console.log("MQTT MessageArrived Doing DAILY");
            if (this.dispatch && this.onMessageArrivedAsDaily) {
              void this.dispatch(this.onMessageArrivedAsDaily());
            }
            break;
          }
          case topic === `${ctlBase}/CLOSE` || topic === `${ctlBaseOne}/CLOSE`: {
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
          case topic === `${ctlBase}/RELOAD` || topic === `${ctlBaseOne}/RELOAD`: {
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
                    await this.getMqttServers();
                    // MQTT設定取得
                    this.getMqttSettings();
                    // 再接続処理
                    await this.connnectRetrying({
                      retryTimes: this.settingRetryTimes,
                      retryInterval: this.settingRetryInterval,
                      startServer: 0,
                    }).catch(() => {
                      this.onNotConnected();
                      this.notify({ expletiveId: "", message: SoalaMessage.M50022C() });
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
          case /^CTL\/LOGUPLOAD\/.+/.test(topic): {
            // ※未実装
            // クライアントログアップロード要求（送信電文に対象端末を指定）
            console.log("MQTT MessageArrived Doing LOGUPLOAD");
            break;
          }
          // マスター再取得
          case topic === `${ctlBase}/RELOAD/MASTER` || topic === `${ctlBaseOne}/RELOAD/MASTER`: {
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
          // MQTTサーバー接続先変更
          case topic === `${ctlBase}/CONNECT` || topic === `${ctlBaseOne}/CONNECT`: {
            console.log("MQTT MessageArrived Doing CONNECT");
            // 切断
            void this.disconnect();
            if (isCurrentPath(Const.PATH_NAME.fis) || isCurrentPath(Const.PATH_NAME.barChart)) {
              // FIS、バーチャートのみ
              // 自動更新を再スタートするかの確認メッセージを表示する
              const onYesButton = () => {
                void (async () => {
                  if (this.onMessageArrivedAsMaster && this.user) {
                    try {
                      // MQTTサーバー情報取得
                      await this.getMqttServers();
                      // MQTT設定取得
                      this.getMqttSettings();
                      // 再接続処理
                      await this.connnectRetrying({
                        retryTimes: this.settingRetryTimes,
                        retryInterval: this.settingRetryInterval,
                        startServer: 0,
                      }).catch(() => {
                        this.onNotConnected();
                        this.notify({ expletiveId: "", message: SoalaMessage.M50022C() });
                      });
                    } catch (err) {
                      if (err instanceof Error) {
                        console.log(err.message);
                        this.notify({ expletiveId: "", message: SoalaMessage.M50022C() });
                      }
                    }
                  }
                })();
              };
              const onNoButton = () => {};
              this.notify({ expletiveId: "Connect", message: SoalaMessage.M40008C({ onYesButton, onNoButton }) });
            }
            break;
          }
          case topic === `${ctlBase}/KILL` || topic === `${ctlBaseOne}/KILL`: {
            const kbn = message.payloadString.substr(0, 1);
            const timeStamp = message.payloadString.substr(1);
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
        return resolve();
      };

      // クライアントIDの生成
      let timeStamp = Date.now().toString();
      if (timeStamp.length > 10) {
        timeStamp = timeStamp.slice(timeStamp.length - 10);
      }
      const clientId = `${this.userId.replace(/@/g, "_")}_${storage.terminalCat}_${timeStamp}`; // 社員番号＋端末区分＋タイムスタンプ（最大１０桁）

      // MQTT接続設定
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.client = new Messaging.Client(host, port, clientId);
      this.client.onConnectionLost = (responseObject: unknown) => {
        onConnectionLost(responseObject).catch(() => {});
      };
      this.client.onMessageArrived = onMessageArrived;
      // MQTT接続
      this.client.connect({
        userName: this.userId,
        password: storage.token,
        onSuccess,
        onFailure,
        cleanSession: true,
        useSSL: useSsl,
      });
    });

  /**
   * サブスクライブ
   */
  private async subscribe(topic: string): Promise<void> {
    console.log(`MQTT func subscribe Start ${topic}`);
    // 接続先の確認
    if (!this.servers.length) {
      console.log("MQTT Can not connect ( not exist server setting )");
      return;
    }
    // 接続が切れていたら再接続（リトライなし）
    if (!this.connected) {
      try {
        await this.connnectRetrying({
          retryTimes: this.settingRetryTimes,
          retryInterval: this.settingRetryInterval,
          startServer: this.currentServer,
          serverRetryCnt: 1,
        }).catch(() => {
          this.onNotConnected();
          this.notify({ expletiveId: "", message: SoalaMessage.M50022C() });
        });
      } catch (err) {
        throw new Error();
      }
    }
    // サブスクライブの処理
    try {
      await this.subscribePromise(topic);
    } catch (err) {
      throw new Error();
    }
  }

  private subscribePromise = (topic: string): Promise<void> =>
    new Promise((resolve, reject) => {
      if (this.connected) {
        // 成功時のコールバック
        const onSuccess = () => {
          console.log(`MQTT func subscribe Success ${topic}`);
          resolve();
        };
        // 失敗時のコールバック
        const onFailure = (responseObject: any) => {
          if (responseObject.errorCode !== 0) {
            console.log(`MQTT func subscribe Failure ${this.client.clientId} ${responseObject.errorCode} ${responseObject.errorMessage}`);
          } else {
            console.log(`MQTT func subscribe Failure ${this.client.clientId}`);
          }
          reject();
        };
        // 信頼度 Qos=2 でサブスクライブ
        this.client.subscribe(topic, { qos: 2, onSuccess, onFailure });
        resolve();
      }
      console.log(`MQTT func subscribe not connected ${topic}`);
      resolve();
    });

  /**
   * アンサブスクライブ
   */
  private async unSubscribe(topic: string): Promise<void> {
    if (topic) {
      try {
        await this.unSubscribePromise(topic);
      } catch (err) {
        throw new Error();
      }
    }
  }

  private unSubscribePromise = (topic: string): Promise<void> =>
    new Promise((resolve, reject) => {
      if (this.connected && topic) {
        console.log(`MQTT func unSubscribe Start ${topic}`);
        // 成功時のコールバック
        const onSuccess = () => {
          console.log("MQTT func unSubscribe Success");
          resolve();
        };
        // 失敗時のコールバック
        const onFailure = (responseObject: any) => {
          if (responseObject.errorCode !== 0) {
            console.log(`MQTT func unSubscribe Failure ${this.client.clientId} ${responseObject.errorCode} ${responseObject.errorMessage}`);
          } else {
            console.log(`MQTT func unSubscribe Failure ${this.client.clientId}`);
          }
          reject();
        };
        this.client.unsubscribe(topic, { onSuccess, onFailure });
        resolve();
      }
      resolve();
    });

  /**
   * 制御サブスクライブ
   */
  private async controlSubscribe(): Promise<void> {
    try {
      // 全体用
      await this.unSubscribe(this.controlTopic); // 一旦アンサブスクライブ
      this.controlTopic = `CTL/ALL/${storage.terminalCat || ""}/#`;
      await this.subscribe(this.controlTopic);
      // 個別用
      await this.unSubscribe(this.controlOneTopic); // 一旦アンサブスクライブ
      this.controlOneTopic = `CTL/ONE/${storage.terminalCat || ""}/${this.userId}/#`;
      await this.subscribe(this.controlOneTopic);
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
      await this.unSubscribe(this.controlTopic);
      this.controlTopic = "";
      await this.unSubscribe(this.controlOneTopic);
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
      await this.unSubscribe(this.fltTopic); // 一旦アンサブスクライブ
      const version: string = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
      this.fltTopic = `BIZ${version}/${apo}/FLT/#`;
      await this.subscribe(this.fltTopic);
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
      await this.unSubscribe(this.fltTopic);
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
      await this.unSubscribe(this.apoTopic); // 一旦アンサブスクライブ
      const version: string = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
      this.apoTopic = `BIZ${version}/${apo}/APO/#`;
      await this.subscribe(this.apoTopic);
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
      await this.unSubscribe(this.apoTopic);
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
      await this.unSubscribe(this.sptTopic); // 一旦アンサブスクライブ
      const version: string = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
      this.sptTopic = `BIZ${version}/${apo}/SPT/#`;
      await this.subscribe(this.sptTopic);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }

  /**
   * SPT（空港SPOT情報単位）アンサブスクライブ
   */
  async sptUnSubscribe() {
    try {
      await this.unSubscribe(this.sptTopic);
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
      await this.unSubscribe(this.astTopic); // 一旦アンサブスクライブ
      const version: string = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
      this.astTopic = `BIZ${version}/+/AST/#`;
      await this.subscribe(this.astTopic);
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
      await this.unSubscribe(this.astTopic);
      this.astTopic = "";
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  }
}

export const mqtt = new Mqtt();
