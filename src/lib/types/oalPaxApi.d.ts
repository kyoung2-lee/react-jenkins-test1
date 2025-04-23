/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OalPaxApi {
  export interface OalPaxFormParams {
    salableFCnt: string;
    salableCCnt: string;
    salableWCnt: string;
    salableYCnt: string;
    bookedFCnt: string;
    bookedCCnt: string;
    bookedWCnt: string;
    bookedYCnt: string;
    actualFCnt: string;
    actualCCnt: string;
    actualWCnt: string;
    actualYCnt: string;
  }

  export interface OalLegPax {
    dataCd: "Salable" | "Booked" | "Actual";
    paxClsCd: "F" | "C" | "W" | "Y";
    cnt: null | number;
  }
  export namespace Get {
    /** S11302W1_他社便区間旅客人数Ph2-取得API リクエスト */
    export interface Request extends FlightKey {
      onlineDbExpDays: number;
    }

    /** S11302W1_他社便区間旅客人数Ph2-取得API レスポンス */
    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      flightDetailHeader: FlightDetailHeader;
      oalLegPaxList: OalLegPax[];
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
    export interface Request {
      orgDateLcl: string;
      alCd: string;
      fltNo: string;
      casFltNo: string;
      skdDepApoCd: string;
      skdArrApoCd: string;
      skdLegSno: number;
      oalLegPaxList: OalLegPax[];
    }

    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      messageFormatVersion: string;
      dataCount: number;
      apiVersion: string;
    }
  }
}
