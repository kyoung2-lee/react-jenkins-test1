/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OalFuelApi {
  export namespace Get {
    /** S10100WE_着発関連便区間情報-取得API リクエスト */
    export interface Request {
      orgDateLcl: string;
      alCd: string;
      fltNo: string;
      casFltNo: string;
      skdDepApoCd: string;
      skdArrApoCd: string;
      skdLegSno: number;
      onlineDbExpDays: number;
    }

    /** S10100WE_着発関連便区間情報-取得API レスポンス */
    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      flightDetailHeader: FlightDetailHeader;
      rampFuelWt: number | null;
      rampFuelCat: string;
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
      rampFuelWt: number | null;
      rampFuelCat: string;
    }

    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      messageFormatVersion: string;
      dataCount: number;
      apiVersion: string;
    }
  }
}
