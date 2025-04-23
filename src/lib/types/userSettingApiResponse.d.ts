/* eslint-disable @typescript-eslint/no-unused-vars */
namespace UserSettingApi {
  interface Request {
    grpNtfFlg: boolean;
    apoNtfFlg: boolean;
    apoNtfList: ApoNtfList[];
    fltNtfFlg: boolean;
    fltNtfList: FltNtfList[];
    bbNtfFlg: boolean;
    cmtNtfFlg: boolean;
    myskdlNtfFlg: boolean;
  }

  interface Response {
    commonHeader: CommonApi.CommonHeader;
    grpNtfFlg: boolean;
    apoNtfFlg: boolean;
    apoNtfList: ApoNtfList[];
    fltNtfFlg: boolean;
    fltNtfList: FltNtfList[];
    bbNtfFlg: boolean;
    cmtNtfFlg: boolean;
    myskdlNtfFlg: boolean;
  }

  interface ApoNtfList {
    apoCode: string;
    eventCode: string;
    apoNtfOrder: number;
  }

  interface FltNtfList {
    type: string;
    trigger: string;
    eventCode: string;
    fltNtfOrder: number;
  }
}
