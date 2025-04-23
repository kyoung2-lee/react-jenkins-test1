/* eslint-disable @typescript-eslint/no-unused-vars */
namespace AddressJobApi {
  export interface Request {
    commGrpIdList: number[];
    jobGrpIdList: number[];
    jobIdList: number[];
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    jobList: Job[];
  }

  interface Job {
    jobId: number;
    jobCd: string;
  }
}

namespace AddressTtyApi {
  export interface Request {
    ttyAddrGrpIdList: number[];
    ttyAddrList: string[];
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    ttyAddrList: string[];
  }
}

namespace AddressMailApi {
  export interface Request {
    mailAddrGrpIdList: number[];
    mailAddrList: string[];
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    mailAddrList: string[];
  }
}
