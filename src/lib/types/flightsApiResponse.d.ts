/* eslint-disable @typescript-eslint/no-unused-vars */
namespace FlightsApi {
  export interface Request {
    searchType: "FLT" | "LEG" | "SHIP" | "AL" | "MVT";
    date: string;
    dateFrom?: string;
    dateTo?: string;
    alCd?: string;
    fltNo?: string;
    casFltNo?: string;
    depApoCd?: string;
    arrApoCd?: string;
    jalGrpFlg?: boolean;
    intDomCat?: string;
    ship?: string;
    casFltFlg?: boolean;
    alCdList?: string[];
    trCdList?: string[];
    onlineDbExpDays: number;
    onlineDbExpDaysPh2: number;
    depMvtChkFlg?: boolean;
    arrMvtChkFlg?: boolean;
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    eLegList: ELegList[];
  }

  interface ELegList {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string | null;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    fisFltSts: string;
    lstArrApoCd: string;
    stdLcl: string;
    etdLcl: string;
    atdLcl: string;
    tentativeEtdCd: string;
    tentativeEtdLcl: string;
    actToLcl: string;
    staLcl: string;
    etaLcl: string;
    estLdLcl: string;
    actLdLcl: string;
    ataLcl: string;
    tentativeEtaCd: string;
    tentativeEtaLcl: string;
    tentativeEstLdCd: string;
    tentativeEstLdLcl: string;
    csCount: number;
    lstWorkStepShortName: string;
    divFlg: boolean;
    atbFlg: boolean;
    jalGrpFlg: boolean;
    oalTblFlg: boolean;
    specialSts: string;
    specialStses: SpecialStses;
    connectDbCat: ConnectDbCat;
    depMvtSentFlg: boolean;
    arrMvtSentFlg: boolean;
  }

  export interface SpecialStses {
    specialSts: SpecialSts[];
  }

  export interface SpecialSts {
    level: string;
    status: string;
    eventStatusFlg: boolean;
    delStatusAtdSetFlg: boolean;
    ntfArrDepCd: string;
    updateTimeUtc: string | null;
  }
}
