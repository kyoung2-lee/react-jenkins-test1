/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OalFlightScheduleApi {
  export namespace Get {
    export interface Request {
      funcId: "S11301C";
      searchType: "FLT" | "LEG" | "ALAPO";
      dateFrom: string;
      dateTo?: string;
      alCd?: string;
      fltNo?: string;
      casFltNo?: string;
      casFltFlg?: boolean;
      csSearchFlg?: boolean;
      cnxSearchFlg?: boolean;
      depApoCd?: string;
      arrApoCd?: string;
      cwAlCd?: string;
      cwAirport?: string;
      onlineDbExpDays: number;
    }

    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      fltScheduleList: FltScheduleList[];
    }

    export interface FltScheduleList extends FltScheduleListBase {
      legList: LegList[];
    }

    export interface FltScheduleListBase {
      orgDateLcl: string;
      alCd: string;
      fltNo: string;
      casFltNo: string | null;
      casFltFlg: boolean;
    }

    export interface LegList {
      intDomCat: string;
      skdlNonskdlCat: string;
      paxCgoCat: string;
      dispStatus: string;
      skdLegSno: number;
      rcvFltOrgLegPhySno: number | null;
      legPhySno: number;
      delFlg: boolean;
      cnlFlg: boolean;
      depApoCd: string;
      arrApoCd: string;
      stdLcl: string;
      stdUtc: string;
      etdLcl: string;
      etdUtc: string;
      xtdLcl: string;
      xtdUtc: string;
      staLcl: string;
      staUtc: string;
      etaLcl: string;
      etaUtc: string;
      xtaLcl: string;
      xtaUtc: string;
      shipTypeIataCd: string;
      shipNo: string;
      svcTypeDiaCd: string;
      onwardOrgDateLcl: string;
      onwardAlCd: string;
      onwardFltNo: string;
      depFisHideFlg: boolean;
      arrFisHideFlg: boolean;
      legSeq: number;
      legDelFlg: boolean;
      legCnlFlg: boolean;
      legCreRsnCd: string;
      legChgRsnCd: string;
      legFixFlg: boolean;
      legFltRemarks: string;
      csList: CsList[];
      rowStatus: RowStatus;
    }

    // "Edited"は画面側でのみ設定
    export type RowStatus = "" | "Edited" | "Updated" | "Skipped" | "Failed" | "Error";

    export interface CsList {
      csAlCd: string;
      csFltNo: string;
      csSeq: number | null;
      dispSeq: number | null;
    }
  }

  export namespace Post {
    export interface Request {
      funcId: "S11301C";
      fltScheduleList: FltScheduleList[];
      prevInfo: {
        fltScheduleList: FltScheduleList[];
      };
      dataOwnerCd: "SOALA";
      onlineDbExpDays: number;
    }

    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      fltScheduleList: Get.FltScheduleList[];
    }

    export interface ErrorResponse {
      errors: {
        errorLog: string | null;
        rowNo: number;
        rowStatus: Get.RowStatus;
        errorItems: string[];
        errorMessages: string[];
      }[];
    }

    export interface FltScheduleList {
      orgDateLcl: string;
      alCd: string;
      fltNo: string;
      casFltNo: string | null;
      casFltFlg: boolean;
      utcFlg: boolean;
      legList: LegList[];
    }

    export interface LegList {
      chgType: string;
      intDomCat: string;
      paxCgoCat: string;
      skdlNonskdlCat: string;
      skdLegSno: number;
      rcvFltOrgLegPhySno: number | null;
      legPhySno: number;
      delFlg: boolean;
      cnlFlg: boolean;
      depApoCd: string;
      arrApoCd: string;
      std: string | null;
      etd: string | null;
      sta: string | null;
      eta: string | null;
      shipTypeIataCd: string;
      shipNo: string;
      svcTypeDiaCd: string;
      onwardOrgDateLcl: string | null;
      onwardAlCd: string | null;
      onwardFltNo: string | null;
      depFisHideFlg: boolean;
      arrFisHideFlg: boolean;
      legSeq: number;
      legDelFlg: boolean;
      legCnlFlg: boolean;
      legFixFlg: boolean;
      csList: CsList[];
      rowNo: number;
    }

    export interface CsList {
      csAlCd: string;
      csFltNo: string;
      csSeq: number | null;
      dispSeq: number | null;
    }
  }
}
