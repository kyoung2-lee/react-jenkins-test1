/* eslint-disable @typescript-eslint/no-unused-vars */
namespace FisApi {
  export interface Request {
    apoCd: string;
    date: string | null;
    autoReload: boolean;
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    timeLcl: string;
    apoCd: string;
    apoDetail?: apoDetail; // PUSHでは渡って来ない
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
    depDlyInfo: DepDlyInfo[];
  }

  interface WorkStep {
    trxId: string;
    workStepCd: string;
    updateTime: string;
    workStepShortName: string;
    workStepName: string;
    workEndFlg: boolean;
  }

  interface DepDlyInfo {
    depDlyTime?: number | null;
    depDlyRsnCd?: string | null;
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
    arrDlyInfo: ArrDlyInfo[];
  }

  interface ArrDlyInfo {
    arrDlyTime?: number | null;
    arrDlyRsnCd?: string | null;
  }
}
