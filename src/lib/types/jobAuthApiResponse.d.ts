/* eslint-disable @typescript-eslint/no-unused-vars */
namespace JobAuthApi {
  interface Request {
    jobCd: string;
    jobAuthCd: string;
    deviceName: string;
  }

  interface Response {
    commonHeader: CommonApi.CommonHeader;
    info: Info;
    user: User;
    jobAuth: JobAuth[];
  }

  interface Info {
    token: string;
  }
  interface User {
    userId: string;
    jobCd: string;
    jobName: string;
    mailAddr: string;
    ttyAddr: string;
    grpId: number;
    grpCd: string;
    grpName: string;
    myApoCd: string;
    familyName: string;
    firstName: string;
    companyCd: string;
    deptCd: string;
    profileImg: string;
    bbAdminFlg: boolean;
    commonSiteFlg: boolean;
  }

  interface JobAuth {
    funcId: string;
    authLevel: string;
    funcName: string;
    funcDtl: string;
    funcCat: string;
    funcIcon: string;
    dispFlg: boolean;
    dispSeq: number;
  }
}
