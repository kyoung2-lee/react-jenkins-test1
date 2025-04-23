/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OalPaxStatusApi {
  export namespace Get {
    export interface Request extends FlightKey {
      onlineDbExpDays: number;
    }

    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      flightDetailHeader: FlightDetailHeader;
      acceptanceSts: string;
      boardingSts: string;
      depGateNo: string;
    }

    export interface FlightDetailHeader {
      orgDateLcl: string;
      alCd: string;
      fltNo: string;
      casFltNo: string;
      lstDepApoCd: string;
      lstArrApoCd: string;
      csFlg: boolean;
    }

    export interface FlightKey {
      orgDateLcl: string;
      alCd: string;
      fltNo: string;
      casFltNo: string;
      skdDepApoCd: string;
      skdArrApoCd: string;
      skdLegSno: number;
    }
  }

  export namespace Post {
    export interface Request extends Get.Request, OalPaxStatusFormParams {}

    export interface OalPaxStatusFormParams {
      acceptanceSts: string;
      boardingSts: string;
      depGateNo: string;
    }

    export interface Response {
      commonHeader: CommonApi.CommonHeader;
    }
  }
}
