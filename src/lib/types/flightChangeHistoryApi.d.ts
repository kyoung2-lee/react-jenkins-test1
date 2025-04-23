/* eslint-disable @typescript-eslint/no-unused-vars */
namespace FlightChangeHistoryApi {
  export interface Request {
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

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    flight: CommonApi.Flight;
    history: History[];
    connectDbCat: ConnectDbCat; // "O" or "P" (Pは過去DB)
  }

  interface History {
    changeTime: string | null;
    changeBy: string | null;
    changeItemDispName: string | null;
    changeValueBef: string | null;
    changeValueAfr: string | null;
  }
}
