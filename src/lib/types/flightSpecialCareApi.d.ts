/* eslint-disable @typescript-eslint/no-unused-vars */
namespace FlightSpecialCareApi {
  export interface Request {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    onlineDbExpDays: number;
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    flight: CommonApi.Flight;
    spclPaxRcvDateTime: string;
    spclPaxGrp: SpclPaxGrp[];
    spclLoadRcvDateTime: string;
    spclLoadGrp: SpclLoadGrp[];
    connectDbCat: ConnectDbCat;
  }

  interface SpclPaxGrp {
    spclCareGrpId: number;
    spclPax: SpclPax[];
  }

  interface SpclPax {
    ssrCode: string;
    peopleNumber: number;
  }

  interface SpclLoadGrp {
    spclCareGrpId: number;
    spclLoad: SpclLoad[];
  }

  interface SpclLoad {
    spclLoadCode: string;
    totalLoad: string;
  }
}
