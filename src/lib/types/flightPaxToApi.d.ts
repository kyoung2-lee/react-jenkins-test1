/* eslint-disable @typescript-eslint/no-unused-vars */
namespace FlightPaxToApi {
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
    paxToHeader: PaxToHeader;
    ontoData: Line[];
    connectDbCat: ConnectDbCat;
  }

  interface PaxToHeader {
    arrApoSpotNo: string;
    xtaLcl: string;
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
    oncr1DepDateYmd: string;
    oncr1AirlineCd: string;
    oncr1FltSerNo: string;
    oncr1MktAirlineCd: string;
    oncr1MktFltSerNo: string;
    bordAdltCnt: string;
    bordChldCnt: string;
    bordInftCnt: string;
    domIntKbn: string;
    cnlId: string;
    fisFltStsCd: string;
    stdUtcTs: string;
    etdUtcTs: string;
    atdUtcTs: string;
    toUtcTs: string;
    xtdUtcTs: string;
    stdLocalTs: string;
    etdLocalTs: string;
    atdLocalTs: string;
    toLocalTs: string;
    xtdLocalTs: string;
    depGate: string;
    actDepSpot: string;
  }
}
