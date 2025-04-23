/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BroadcastBbFlightApi {
  /** S11102W8_情報発信-便カテゴリスタートAPI リクエスト */
  export interface Request {
    bbTitle: string;
    legInfoCd: string;
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    posLat: string | null;
    posLon: string | null;
    onlineDbExpDays: number;
  }
  /** S11102W8_情報発信-便カテゴリスタートAPI レスポンス */
  export interface Response {
    bbId: number;
  }
}
