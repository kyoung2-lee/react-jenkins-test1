/* eslint-disable @typescript-eslint/no-unused-vars */
namespace FlightDetailApi {
  interface Request {
    myApoCd: string;
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    oalTblFlg: boolean;
    onlineDbExpDays: number;
  }

  interface Response {
    commonHeader: CommonApi.CommonHeader;
    timeUtc: string;
    timeLcl: string;
    flight: Flight;
    dep: Dep;
    arr: Arr;
    pax: Pax;
    crew: Crew;
    connectDbCat: ConnectDbCat; // "O" or "P" (Pは過去DB)
  }

  interface Flight {
    alCd: string;
    fltNo: string;
    casFltNo: string;
    opeSuffixUtc: string;
    csCnt: number;
    orgDateUtc: string;
    orgDateLcl: string;
    fisFltSts: string;
    shipNo: string;
    seatConfCd: string;
    wingletFlg: bool;
    equipment: string;
    estEdctUtc: string;
    estEdctLcl: string;
    actEdctUtc: string;
    actEdctLcl: string;
    estEobtUtc: string;
    estEobtLcl: string;
    actEobtUtc: string;
    actEobtLcl: string;
    mayrtnFlg: bool;
    maydivFlg: bool;
    maydivApoCd?: string[];
    intDomCat: string;
    paxCgoCat: string;
    skdlNonskdlCat: string;
    svcTypeDiaCd: string;
    divFlg: bool;
    atbFlg: bool;
    gtbFlg: bool;
    legCnlRsnIataCd: string;
    ccEmprAlCd: string;
    caEmprAlCd: string;
    omAlCd: string;
    trAlCd: string;
    cs?: Cs[];
  }

  interface Cs {
    csAlCd: string;
    csFltNo: string;
  }

  interface Dep {
    lstDepApoCd: string;
    depApoSpotNo: string;
    acceptanceSts: string;
    boardingSts: string;
    depGateNo: string;
    rampFuelLbsWt: number;
    fuelOrderFlg: boolean;
    lsFlg: boolean;
    stdUtc: string;
    stdLcl: string;
    etdUtc: string;
    etdLcl: string;
    atdUtc: string;
    atdLcl: string;
    actToUtc: string;
    actToLcl: string;
    tentativeEtdUtc: string;
    tentativeEtdLcl: string;
    tentativeEtdCd: string;
    depDlyRsnCd?: string[];
    depDlyTime?: number[];
    eftMin: number;
    depRmksText: string;
    workStep?: WorkStep[];
    sumEstEdctUtcAndEftMin: string | null;
    sumEstEdctLclAndEftMin: string | null;
    sumActEdctUtcAndEftMin: string | null;
    sumActEdctLclAndEftMin: string | null;
  }

  interface WorkStep {
    workStepCd: string;
    workStepName: string;
    fisDispFlg: boolean;
    workEndFlg: boolean;
    workAutoEndFlg: boolean;
    planWorkEndTimeUtc: string;
    planWorkEndTimeLcl: string;
    actWorkEndTimeUtc: string;
    actWorkEndTimeLcl: string;
    workStepSeq: number;
  }

  interface Arr {
    lstArrApoCd: string;
    arrApoSpotNo: string;
    skdArrApoCd: string;
    staUtc: string;
    staLcl: string;
    etaUtc: string;
    etaLcl: string;
    ataUtc: string;
    ataLcl: string;
    actLdUtc: string;
    actLdLcl: string;
    tentativeEtaUtc: string;
    tentativeEtaLcl: string;
    tentativeEtaCd: string;
    tentativeEstLdUtc: string;
    tentativeEstLdLcl: string;
    tentativeEstLdCd: string;
    estLdUtc: string;
    estLdLcl: string;
    arrDlyRsnCd?: string[];
    arrDlyTime?: number[];
    arrRmksText: string;
  }

  interface Pax {
    salable: Salable;
    booked: Booked;
    actual: Actual;
  }

  interface Salable {
    total: number;
    fCls: number;
    cCls: number;
    jCls: number;
    yCls: number;
  }

  type Booked = Salable;

  interface Actual extends Salable {
    inft: number;
  }

  interface Crew {
    ccCnt: number;
    dhCcCnt: number;
    asCrewTtlCnt: number;
    asPaxTtlCnt: number;
    caCnt: number;
    dhCaCnt: number;
    fltWqCd: string;
    pic: Pic;
    cf: Cf;
    other?: Other[];
  }

  interface Pic {
    familyName: string;
    initialName: string;
    fltDutyCd: string;
    crewfromOrgDateLcl: string;
    crewfromAlCd: string;
    crewfromFltNo: string;
    crewnextOrgDateLcl: string;
    crewnextAlCd: string;
    crewnextFltNo: string;
  }

  type Cf = Pic;

  interface Other {
    otherCrewCat: string;
    otherCrewCnt: number;
    otherCrewInfo: string;
  }
}
