/* eslint-disable @typescript-eslint/no-unused-vars */
namespace AcarsStatus {
  export interface Request {
    shipNo: string | null;
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    acars: AcarsSts[];
  }

  export interface AcarsSts {
    trxId: string;
    shipNo: string;
    acarsSts: string;
    updateTime: string;
  }
}
