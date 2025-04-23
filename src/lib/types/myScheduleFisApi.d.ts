/**
 * MySchedule画面-FIS情報取得API
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace MyScheduleFisApi {
  export interface Request {
    apoCd: string;
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    autoReload: false;
    depArrType: "D" | "A" | "";
  }
  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    timeLcl: string;
    apoCd: string;
    apoDetail: apoDetail;
    fis: Fis[];
  }

  interface apoDetail {
    targetArea: string;
    dispRangeFrom: number;
    dispRangeTo: number;
    fisDataRangeFrom: number;
    legDataRangeFrom: number;
    getFromTimeLcl: string;
    getToTimeLcl: string;
  }

  interface Fis {
    arrDepCtrl: CommonApi.ArrDepCtrl;
    arr?: Arr;
    dep?: Dep;
  }

  interface Dep {
    trxId: string;
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string | null;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    depInfoCd: string;
    legPhySno: number;
    updateTime: string;
    fisFltSts: string;
    csCnt: number;
    intDomCat: string;
    skdlNonskdlCat: string;
    omAlCd: string;
    lstLasApoCd: string;
    lstDepApoCd: string;
    lstArrApoCd: string;
    stdLcl: string;
    etdLcl: string;
    atdLcl: string;
    actToLcl: string;
    ataLcl: string;
    tentativeEtdLcl: string;
    tentativeEtdCd: string;
    refPaxTtlCnt: number;
    specialSts: string;
    legCnlFlg: boolean;
    equipment: string;
    seatConfCd: string;
    wingletFlg: boolean;
    rampFuelLbsWt: string;
    fuelOrderFlg: boolean;
    lsFlg: boolean;
    acceptanceSts: string;
    boardingSts: string;
    depGateNo: string;
    shipfromOrgDateLcl: string;
    shipfromAlCd: string;
    shipfromFltNo: string;
    shipfromCasFltNo: string;
    rmksText: string;
    fisHideFlg: boolean;
    workStep: WorkStep[];
  }

  interface WorkStep {
    trxId: string;
    workStepCd: string;
    updateTime: string;
    workStepShortName: string;
    workStepName: string;
    workEndFlg: boolean;
  }

  interface Arr {
    trxId: string;
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string | null;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    arrInfoCd: string;
    legPhySno: number;
    updateTime: string;
    fisFltSts: string;
    csCnt: number;
    intDomCat: string;
    skdlNonskdlCat: string;
    omAlCd: string;
    lstOrgApoCd: string;
    lstDepApoCd: string;
    lstArrApoCd: string;
    actToLcl: string;
    staLcl: string;
    etaLcl: string;
    ataLcl: string;
    estLdLcl: string;
    actLdLcl: string;
    tentativeEtaLcl: string;
    tentativeEtaCd: string;
    tentativeEstLdLcl: string;
    tentativeEstLdCd: string;
    refPaxTtlCnt: number;
    specialSts: string;
    legCnlFlg: boolean;
    equipment: string;
    seatConfCd: string;
    wingletFlg: boolean;
    shipNextOrgDateLcl: string;
    shipNextAlCd: string;
    shipNextFltNo: string;
    shipNextCasFltNo: string;
    rmksText: string;
    fisHideFlg: boolean;
    divFlg: boolean;
    atbFlg: boolean;
    workStep: WorkStep[];
  }
}
