/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NotificationSettingApi {
  interface Response {
    commonHeader: CommonApi.CommonHeader;
    notifyList: NotifyList[];
  }

  interface NotifyList {
    key: string;
    value: string;
  }
}
