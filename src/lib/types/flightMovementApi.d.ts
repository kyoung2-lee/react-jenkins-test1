/* eslint-disable @typescript-eslint/no-unused-vars */
namespace FlightMovementApi {
  namespace Get {
    interface Request extends CommonFlightInfo.Legkey {
      funcId: "S10601C" | "S10604C";
      onlineDbExpDays: number;
    }
    interface Response {
      commonHeader: CommonApi.CommonHeader;
      legkey: CommonFlightInfo.Legkey;
      csCnt: number;
      fisFltSts: FisStsType;
      irrSts: IrrStsType;
      legCnlFlg: boolean;
      depInfo: CommonFlightInfo.Response.DepInfo;
      arrInfo: CommonFlightInfo.Response.ArrInfo;
      connectDbCat: ConnectDbCat;
    }
  }
  namespace Post {
    interface Request {
      funcId: "S10601P1" | "S10604C";
      legkey: CommonFlightInfo.Legkey;
      fisFltSts: FisStsType;
      depInfo: CommonFlightInfo.Request.DepInfo | null;
      arrInfo: CommonFlightInfo.Request.ArrInfo | null;
      dataOwnerCd: "SOALA";
    }
    interface RequestSpotNo {
      funcId: "S10702C";
      legkey: CommonFlightInfo.Legkey;
      depInfo: CommonFlightInfo.Request.DepInfoSpotNo | null;
      arrInfo: CommonFlightInfo.Request.ArrInfoSpotNo | null;
      dataOwnerCd: "SOALA";
    }
    interface Response extends Get.Response {
      skippedFlg: boolean;
    }
    interface ErrorResponse {
      errors: {
        errorItems: string[];
        errorMessages: string[];
      }[];
    }
  }
}
