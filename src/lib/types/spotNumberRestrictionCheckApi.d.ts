/* eslint-disable @typescript-eslint/no-unused-vars */
namespace SpotNumberRestrictionCheckApi {
  export interface Request {
    funcId: "S10702C";
    legInfo: RequestLegInfo[];
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    legInfo: ResponseLegInfo[];
  }

  export interface RequestLegInfo {
    arr: RequestLegInfoArrDep | null;
    dep: RequestLegInfoArrDep | null;
  }

  export interface RequestLegInfoArrDep extends CommonFlightInfo.Legkey {
    oalTblFlg: boolean;
    spotNo: string;
  }

  export interface ResponseLegInfo {
    arr: ResponseLegInfoArrDep | null;
    dep: ResponseLegInfoArrDep | null;
  }

  export interface ResponseLegInfoArrDep extends CommonFlightInfo.Legkey {
    oalTblFlg: boolean;
    spotNo: string;
    status: string;
    lstDepApoCd: string;
    lstArrApoCd: string;
    spotRstShipTypeInfo: string | null;
    spotCombRstShipTypeInfo: SpotCombRstShipTypeInfo[] | null;
    spotRstTimeInfo: SpotRstTimeInfo[] | null;
  }

  export interface SpotCombRstShipTypeInfo {
    rstSpotNo: string;
    rstShipTypeIataCd: string;
    rstShipTypeDiaCd: string;
  }

  export interface SpotRstTimeInfo {
    rstRsnDispInfo: string;
  }
}
