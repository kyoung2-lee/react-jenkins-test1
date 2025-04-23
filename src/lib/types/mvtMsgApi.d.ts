/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace MvtMsgApi {
  export interface LegKey {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
  }

  export interface DepDlyInfo {
    depDlyTime: number;
    depDlyRsnCd: string;
  }

  export interface ArrDlyInfo {
    arrDlyTime: number;
    arrDlyRsnCd: string;
  }

  export namespace Get {
    export interface Request extends LegKey {
      funcId: "S10603C";
      onlineDbExpDays: number;
      reCalcInstructionFlg: boolean;
    }

    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      legKey: LegKey;
      legCreRsnCd: string;
      intDomCat: string;
      csCnt: number;
      shipNo: string;
      seatConfCd: string;
      trAlCd: string;
      omAlCd: string;
      ccCnt: number;
      caCnt: number;
      dhCcCnt: number;
      dhCaCnt: number;
      actPaxTtl: number;

      lstDepApoCd: string;
      lstDepApoTimeDiffUtc: number;
      depMvtMsgFlg: boolean;
      stdUtc: string;
      atdUtc: string;
      actToUtc: string;
      eft: number;
      depDlyInfo: DepDlyInfo[];
      takeOffFuel: number;
      lstArrApoCd: string;
      lstArrApoTimeDiffUtc: number;

      arrMvtMsgFlg: boolean;
      staUtc: string;
      actLdUtc: string;
      ataUtc: string;
      fuelRemain: number;
      arrDlyInfo: ArrDlyInfo[];
      prevMvtDepApoCd: string;
      prevTaxiingTimeMin: number | null;
      taxiingTimeMin: number | null;
      windFactor: string;
      orgAtdUtc: string;
      orgToUtc: string;
      orgStdUtc: string;
      orgLstDepApoCd: string;

      irrSts: IrrStsType;
      tentativeEstLdUtc: string;
      estLdUtc: string;

      depMvtTtyAddrList: string[];
      arrMvtTtyAddrList: string[];
    }
  }

  export namespace Post {
    export interface Request {
      funcId: "S10603C";
      legKey: LegKey;
      actionCd: string;
      cnlFlg: boolean;
      seatConfCd: string | null;
      ccCnt: number | null;
      caCnt: number | null;
      dhCcCnt: number | null;
      dhCaCnt: number | null;
      actPaxTtl: number | null;
      atdUtc: string | null;
      actToUtc: string | null;
      depDlyInfo: DepDlyInfo[];
      eft: number | null;
      takeOffFuel: number | null;
      actLdUtc: string | null;
      ataUtc: string | null;
      arrDlyInfo: ArrDlyInfo[];
      windFactor: string | null;
      prevMvtDepApoCd: string | null;
      taxiingTimeMin: number | null;
      fuelRemain: number | null;
      estLdUtc: string | null;
      lstArrApoCd: string | null;
      ttyPriorityCd: string | null;
      dtg: string | null;
      originator: string | null;
      remarks: string | null;
      ttyAddrList?: string[] | null;
    }

    export interface Response {
      messages: string[];
    }

    export interface ErrorResponse {
      errors: {
        errorItems: string[];
        errorMessages: string[];
      }[];
    }
  }
}
