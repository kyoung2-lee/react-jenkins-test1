/* eslint-disable @typescript-eslint/no-unused-vars */
namespace MqttServerApi {
  interface Response {
    commonHeader: CommonApi.CommonHeader;
    mqttServerList: MqttServerList[];
  }

  interface MqttServerList {
    serverName: string;
    url: ?string;
    portNo: ?number;
    httpsFlg: ?boolean;
    serverActFlg: ?boolean;
    mqttConnectCnt: ?number;
  }
}
