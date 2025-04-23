/* eslint-disable @typescript-eslint/no-unused-vars */
namespace StationOperationTaskApi {
  export interface Request {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    oalTblFlg: boolean;
    onlineDbExpDays: number;
  }

  export interface RequestPost {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    planUpdateFlg: boolean;
    oalTblFlg: boolean;
    workStepCd: string;
    planWorkEndTimeLcl?: string;
    actWorkEndTimeLcl?: string;
    posLat: string | null;
    posLon: string | null;
    actButtonFlg: string;
    arrDepCd: string;
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    flight: CommonApi.Flight;
    workUserList: WorkUserList[];
    workStepList: WorkStepList[];
    connectDbCat: ConnectDbCat;
  }

  interface WorkStepList {
    workStepCd: string;
    workStepName: string;
    arrDepCd: string;
    workStepType: string;
    workStepSeq: number;
    workEndFlg: boolean;
    workAutoEndFlg: boolean;
    planWorkEndTimeLcl: string;
    actWorkEndTimeLcl: string;
    profileImg: string;
    userId: string;
  }

  interface WorkUserList {
    profileImg: string;
    familyName: string;
    firstName: string;
    empNo: string;
    grpCd: string;
    jobCd: string;
    appleId: string;
  }

  interface MessageReference {
    creatorReference: CreatorReference;
  }

  interface CreatorReference {
    creationTime: string;
    receiverSystem: string;
    senderSystem: string;
  }
}
