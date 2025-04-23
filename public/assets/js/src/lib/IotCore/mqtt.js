"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqtt = void 0;
const events_1 = require("events");
const util_utf8_1 = require("@smithy/util-utf8");
const aws_iot_device_sdk_v2_1 = require("aws-iot-device-sdk-v2");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const dayjs_1 = __importDefault(require("dayjs"));
const CognitoToken_1 = require("../Cognito/CognitoToken");
const config_1 = require("../../../config/config");
const notifications_1 = require("../notifications");
const soalaMessages_1 = require("../soalaMessages");
const attachPolicy_1 = require("./attachPolicy");
const storage_1 = require("../storage");
const commonUtil_1 = require("../commonUtil");
const commonConst_1 = require("../commonConst");
const AWSCognitoCredentialsProvider_1 = __importDefault(require("./AWSCognitoCredentialsProvider"));
class Mqtt {
    constructor() {
        this.client = null;
        this.clientId = "";
        this.userId = "";
        this.mqttPubsubVersion = "";
        this.connected = false;
        this.onConnectionStart = () => { };
        this.onConnected = () => { };
        this.onNotConnected = () => { };
        this.onReconnected = () => { };
        this.onDisconnected = () => { };
        this.fltTopic = "";
        this.apoTopic = "";
        this.sptTopic = "";
        this.astTopic = "";
        this.controlTopic = "";
        this.controlOneTopic = "";
        this.functionKillTimestamp = "";
        this.scheduleReconnectionStop = (delayMs) => {
            if (this.timeoutId) {
                return;
            }
            this.timeoutId = setTimeout(() => {
                void (async () => {
                    console.log("setTimeout", { date: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") });
                    await this.disconnect();
                    this.timeoutId = undefined;
                })();
            }, delayMs * 1000);
            console.log("scheduleReconnectionStop", { timeoutId: this.timeoutId, delayMs, date: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") });
        };
        this.clearReconnectionStop = () => {
            console.log("clearReconnectionStop", { timeoutId: this.timeoutId, date: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") });
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = undefined;
            }
        };
        this.createClient = (provider) => new Promise((resolve, reject) => {
            const wsConfig = {
                credentialsProvider: provider,
                region: config_1.ServerConfig.AWS_REGION,
            };
            this.clientId = `${config_1.ServerConfig.IOT_CLIENT_ID_PREFIX}-${(0, uuid_1.v4)()}`;
            const builder = aws_iot_device_sdk_v2_1.iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(config_1.ServerConfig.IOT_ENDPOINT, wsConfig)
                .withConnectProperties({
                keepAliveIntervalSeconds: config_1.ServerConfig.MQTT_KEEP_ALIVE,
                clientId: this.clientId,
                sessionExpiryIntervalSeconds: config_1.ServerConfig.MQTT_SESSION_EXPIRY,
            })
                .withSessionBehavior(aws_iot_device_sdk_v2_1.mqtt5.ClientSessionBehavior.RejoinAlways)
                .withRetryJitterMode(aws_iot_device_sdk_v2_1.mqtt5.RetryJitterType.Default);
            this.client = new aws_iot_device_sdk_v2_1.mqtt5.Mqtt5Client(builder.build());
            this.client.on("error", (error) => {
                console.error({ error });
                reject(error);
            });
            this.client.on("messageReceived", (eventData) => {
                console.log("Message Received event", { eventData, date: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") });
                if (eventData.message.qos === aws_iot_device_sdk_v2_1.mqtt5.QoS.AtLeastOnce) {
                    this.onMessageArrived(eventData);
                }
            });
            this.client.on("attemptingConnect", (eventData) => {
                console.log("Attempting Connect event", { eventData, date: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") });
            });
            this.client.on("connectionSuccess", (eventData) => {
                console.log("Connection Success event", { eventData, date: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") });
                this.connected = true;
                this.onReconnected();
                this.clearReconnectionStop();
                if (this.client && !eventData.connack.sessionPresent) {
                    const topics = this.getSubscribedTopics();
                    if (topics.length) {
                        this.client
                            .subscribe({
                            subscriptions: topics.map((qos1Topic) => ({ qos: aws_iot_device_sdk_v2_1.mqtt5.QoS.AtLeastOnce, topicFilter: qos1Topic })),
                        })
                            .then((suback) => {
                            console.log({ suback });
                        })
                            .catch((err) => console.error(err));
                    }
                }
            });
            this.client.on("connectionFailure", (eventData) => {
                console.log("Connection failure event", { eventData, date: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") });
                this.onFailure(eventData);
            });
            this.client.on("disconnection", (eventData) => {
                console.log("Disconnection event", { eventData, date: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") });
                this.fltTopic = "";
                this.apoTopic = "";
                this.sptTopic = "";
                this.astTopic = "";
                this.controlTopic = "";
                this.controlOneTopic = "";
                // this.onNotConnected();
                this.connected = false;
                // keepAlive後再接続無効化
                this.scheduleReconnectionStop(config_1.ServerConfig.MQTT_SESSION_EXPIRY);
            });
            this.client.on("stopped", (eventData) => {
                console.log("Stopped event", { eventData, date: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") });
                this.connected = false;
            });
            this.mqttPubsubVersion = config_1.ServerConfig.MQTT_PUBSUB_VERSION || "";
            resolve();
        });
        this.getSubscribedTopics = () => [this.fltTopic, this.apoTopic, this.sptTopic, this.astTopic, this.controlTopic, this.controlOneTopic].filter((topic) => !!topic);
        // 接続失敗時のコールバック
        this.onFailure = (eventData) => {
            var _a, _b, _c, _d, _e;
            if (((_a = eventData.connack) === null || _a === void 0 ? void 0 : _a.reasonCode) !== 0) {
                console.log(`MQTT func connect Failure ${this.clientId} ${(_c = (_b = eventData.connack) === null || _b === void 0 ? void 0 : _b.reasonCode) !== null && _c !== void 0 ? _c : ""} ${(_e = (_d = eventData.connack) === null || _d === void 0 ? void 0 : _d.reasonString) !== null && _e !== void 0 ? _e : ""}`);
            }
            else {
                console.log(`MQTT func connect Failure ${this.clientId}`);
            }
            this.onNotConnected();
        };
        // メッセージ受け取り時のコールバック
        this.onMessageArrived = (eventData) => {
            const { message: { payload, topicName }, } = eventData;
            const message = payload ? (0, util_utf8_1.toUtf8)(payload) : "";
            console.log(`MQTT MessageArrived destinationName:${topicName}`);
            const ctlBase = `CTL/ALL/${storage_1.storage.terminalCat || ""}`;
            const ctlBaseOne = `CTL/ONE/${storage_1.storage.terminalCat || ""}/${this.userId}`;
            const version = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
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
                    if ((0, commonUtil_1.isCurrentPath)(commonConst_1.Const.PATH_NAME.fis) || (0, commonUtil_1.isCurrentPath)(commonConst_1.Const.PATH_NAME.barChart)) {
                        // FIS、バーチャートのみ
                        window.close();
                    }
                    break;
                }
                case topicName === `${ctlBase}/RELOAD` || topicName === `${ctlBaseOne}/RELOAD`: {
                    // クライアントアプリケーションの再起動（リロード）
                    console.log("MQTT MessageArrived Doing RELOAD");
                    if ((0, commonUtil_1.isCurrentPath)(commonConst_1.Const.PATH_NAME.fis) || (0, commonUtil_1.isCurrentPath)(commonConst_1.Const.PATH_NAME.barChart)) {
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
                                            this.notify({ expletiveId: "", message: soalaMessages_1.SoalaMessage.M50022C() });
                                        },
                                    });
                                }
                                catch (err) {
                                    if (err instanceof Error) {
                                        console.log(err.message);
                                    }
                                }
                            })();
                        };
                        this.notify({ expletiveId: "Reload", message: soalaMessages_1.SoalaMessage.M40009C({ onOkButton }) });
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
                    this.notify({ expletiveId: "Master", message: soalaMessages_1.SoalaMessage.M40010C({ onOkButton }) });
                    break;
                }
                case topicName === `${ctlBase}/KILL` || topicName === `${ctlBaseOne}/KILL`: {
                    const kbn = message.substr(0, 1);
                    const timeStamp = message.substr(1);
                    // 認証切れPUSH画面の終了処理
                    if (timeStamp !== this.functionKillTimestamp) {
                        // タイムスタンプが一致しないもの
                        // FIS、バーチャートのみ
                        if ((kbn === "F" || kbn === "B") && ((0, commonUtil_1.isCurrentPath)(commonConst_1.Const.PATH_NAME.fis) || (0, commonUtil_1.isCurrentPath)(commonConst_1.Const.PATH_NAME.barChart))) {
                            console.log("MQTT MessageArrived Doing KILL");
                            if ((0, commonUtil_1.isAuthExpired)()) {
                                void this.disconnect();
                                this.onNotConnected();
                                const onOkButton = () => window.close();
                                this.notify({ expletiveId: "Kill", message: soalaMessages_1.SoalaMessage.M40025C({ onOkButton }) });
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
        this.connect = async ({ dispatch, user, callbacksOnMessageArrived, callbackOnConnectionStart, callbackOnConnected, callbackOnNotConnected, callbackOnReconnected, callbackOnDisconnected, }) => {
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
                    this.notify({ expletiveId: "", message: soalaMessages_1.SoalaMessage.M50022C() });
                },
            });
        };
        this.startConnect = async ({ onError }) => {
            this.onConnectionStart();
            try {
                const token = await CognitoToken_1.cognitoToken.getToken();
                const idToken = token === null || token === void 0 ? void 0 : token.idToken;
                if (!idToken) {
                    console.error("Cognitoでの認証が必要です。");
                    if (onError) {
                        onError();
                    }
                    return;
                }
                const isAttached = await (0, attachPolicy_1.attachPolicyToIdentityId)(idToken);
                if (!isAttached) {
                    if (onError) {
                        onError();
                    }
                    return;
                }
                /** Set up the credentialsProvider */
                const provider = new AWSCognitoCredentialsProvider_1.default({
                    IdentityPoolId: config_1.ServerConfig.COGNITO_IDENTITY_POOL_ID,
                    Region: config_1.ServerConfig.AWS_REGION,
                }, 300, onError);
                /** Make sure the credential provider fetched before setup the connection */
                await provider.refreshCredentials();
                await this.createClient(provider);
                if (this.client) {
                    const attemptingConnect = (0, events_1.once)(this.client, "attemptingConnect");
                    const connectionSuccess = (0, events_1.once)(this.client, "connectionSuccess");
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
            }
            catch (err) {
                console.error({ err });
                if (onError) {
                    onError();
                }
            }
        };
        this.subscribe = async (topics) => {
            if (this.client && topics.length) {
                console.log(`MQTT func subscribe Start ${topics.join(",")}`);
                const suback = await this.client.subscribe({
                    subscriptions: topics.map((qos1Topic) => ({ qos: aws_iot_device_sdk_v2_1.mqtt5.QoS.AtLeastOnce, topicFilter: qos1Topic })),
                });
                console.log({ suback, topics });
            }
        };
        this.clearCredentialsCache = () => {
            if (aws_sdk_1.default.config.credentials && aws_sdk_1.default.config.credentials.clearCachedId) {
                aws_sdk_1.default.config.credentials.clearCachedId();
            }
        };
        /**
         * 他のタブを閉じるメッセージを送信する
         */
        this.sendKillMessage = async () => {
            if (this.connected && this.client) {
                // メッセージにUTCタイムスタンプを含める
                this.functionKillTimestamp = Date.now().toString();
                let kbn = " ";
                if ((0, commonUtil_1.isCurrentPath)(commonConst_1.Const.PATH_NAME.fis)) {
                    kbn = "F";
                }
                else {
                    kbn = "B";
                }
                const message = kbn + this.functionKillTimestamp;
                const ctlBaseOne = `CTL/ONE/${storage_1.storage.terminalCat || ""}/${this.userId}`;
                const topicName = `${ctlBaseOne}/KILL`;
                try {
                    console.log("MQTT Sending kill message");
                    const publishResult = await this.client.publish({
                        qos: aws_iot_device_sdk_v2_1.mqtt5.QoS.AtLeastOnce,
                        topicName,
                        payload: message,
                    });
                    console.log({ publishResult });
                }
                catch (err) {
                    console.log("MQTT Sending kill message failed");
                }
            }
        };
        this.disconnect = async () => {
            console.log("disconnect", { client: this.client, date: (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") });
            this.onNotConnected();
            if (this.client) {
                await this.fltUnSubscribe();
                await this.apoUnSubscribe();
                await this.sptUnSubscribe();
                await this.astUnSubscribe();
                await this.controlUnSubscribe();
                this.connected = false;
                const disconnection = (0, events_1.once)(this.client, "disconnection");
                const stopped = (0, events_1.once)(this.client, "stopped");
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
    notify({ expletiveId, message }) {
        if (this.dispatch) {
            notifications_1.NotificationCreator.create({
                dispatch: this.dispatch,
                id: `MqttErrorMessageId${expletiveId}`,
                message,
            });
        }
    }
    /**
     * アンサブスクライブ
     */
    async unSubscribe(topics) {
        if (this.client && topics.length) {
            const unsubackPacket = await this.client.unsubscribe({
                topicFilters: topics,
            });
            console.log("MQTT func unSubscribe", { topics, unsubackPacket });
            if (unsubackPacket) {
                unsubackPacket.reasonCodes.forEach((reasonCode) => {
                    var _a;
                    if (!aws_iot_device_sdk_v2_1.mqtt5.isSuccessfulUnsubackReasonCode(reasonCode)) {
                        throw new Error(`MQTT func unSubscribe Failure ${this.clientId} ${reasonCode} ${(_a = unsubackPacket.reasonString) !== null && _a !== void 0 ? _a : ""}`);
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
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }
    /**
     * AST（ACARSステータス情報単位）サブスクライブ
     */
    async astSubscribe() {
        try {
            await this.unSubscribe([this.astTopic]); // 一旦アンサブスクライブ
            const version = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
            this.astTopic = `BIZ${version}/+/AST/#`;
            await this.subscribe([this.astTopic]);
        }
        catch (err) {
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
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }
    /**
     * 制御サブスクライブ
     */
    async controlSubscribe() {
        try {
            // 全体用
            await this.unSubscribe([this.controlTopic]); // 一旦アンサブスクライブ
            this.controlTopic = `CTL/ALL/${storage_1.storage.terminalCat || ""}/#`;
            await this.subscribe([this.controlTopic]);
            // 個別用
            await this.unSubscribe([this.controlOneTopic]); // 一旦アンサブスクライブ
            this.controlOneTopic = `CTL/ONE/${storage_1.storage.terminalCat || ""}/${this.userId}/#`;
            await this.subscribe([this.controlOneTopic]);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }
    /**
     * 制御アンサブスクライブ
     */
    async controlUnSubscribe() {
        try {
            await this.unSubscribe([this.controlTopic]);
            this.controlTopic = "";
            await this.unSubscribe([this.controlOneTopic]);
            this.controlOneTopic = "";
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }
    /**
     * FLT（便情報単位）サブスクライブ
     */
    async fltSubscribe(apo) {
        try {
            await this.unSubscribe([this.fltTopic]); // 一旦アンサブスクライブ
            const version = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
            this.fltTopic = `BIZ${version}/${apo}/FLT/#`;
            await this.subscribe([this.fltTopic]);
        }
        catch (err) {
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
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }
    /**
     * APO（空港情報単位）サブスクライブ
     */
    async apoSubscribe(apo) {
        try {
            await this.unSubscribe([this.apoTopic]); // 一旦アンサブスクライブ
            const version = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
            this.apoTopic = `BIZ${version}/${apo}/APO/#`;
            await this.subscribe([this.apoTopic]);
        }
        catch (err) {
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
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }
    /**
     * SPT（空港SPOT情報単位）サブスクライブ
     */
    async sptSubscribe(apo) {
        try {
            await this.unSubscribe([this.sptTopic]); // 一旦アンサブスクライブ
            const version = this.mqttPubsubVersion ? `/${this.mqttPubsubVersion}` : "";
            this.sptTopic = `BIZ${version}/${apo}/SPT/#`;
            await this.subscribe([this.sptTopic]);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
        }
    }
}
exports.mqtt = new Mqtt();
//# sourceMappingURL=mqtt.js.map