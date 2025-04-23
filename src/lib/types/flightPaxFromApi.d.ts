/* eslint-disable @typescript-eslint/no-unused-vars */
namespace FlightPaxFromApi {
  export interface Request {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    onlineDbExpDays: number;
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    timeLcl: string;
    flight: CommonApi.Flight;
    paxFromHeader: PaxFromHeader;
    intoData: Line[];
    connectDbCat: ConnectDbCat;
  }

  interface PaxFromHeader {
    depGateNo: string;
    xtdLcl: string;
  }

  interface Line {
    skdDateYmd: string;
    casualFltKbn: string;
    airlineCd: string;
    fltSerNo: string;
    nonRevSer: string;
    depAptCd: string;
    arrAptCd: string;
    fltLegSer: string;
    incrDepDateYmd: string;
    incrAirlineCd: string;
    incrFltSerNo: string;
    incrSegDepAptCd: string;
    incrMktAirlineCd: string;
    incrMktFltSerNo: string;
    bordAdltCnt: string;
    bordChldCnt: string;
    bordInftCnt: string;
    cockpitCrewDhCntJpi: string;
    cabinCrewDhCntJpi: string;
    domIntKbn: string;
    cnlId: string;
    fisFltStsCd: string;
    staUtcTs: string;
    etaUtcTs: string;
    ataUtcTs: string;
    ldUtcTs: string;
    xtaUtcTs: string;
    staLocalTs: string;
    etaLocalTs: string;
    ataLocalTs: string;
    ldLocalTs: string;
    xtaLocalTs: string;
    arrGate: string;
    actArrSpot: string;
  }
}
