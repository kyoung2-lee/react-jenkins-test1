/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OalFlightMovementApi {
  namespace Get {
    interface Request extends NonNullable<CommonFlightInfo.Legkey> {
      funcId: "S10601C" | "S10604C";
      onlineDbExpDays: number;
    }
    interface Response extends Omit<FlightMovementApi.Get.Response, "legkey"> {
      oal2Legkey: CommonFlightInfo.Legkey;
    }
  }
  namespace Post {
    interface Request {
      funcId: "S10601P1" | "S10604C";
      oal2Legkey: CommonFlightInfo.Legkey;
      fisFltSts: FisStsType;
      depInfo: CommonFlightInfo.Request.DepInfo | null;
      arrInfo: CommonFlightInfo.Request.ArrInfo | null;
      dataOwnerCd: "SOALA";
    }
    interface RequestSpotNo {
      funcId: "S10702C";
      oal2Legkey: CommonFlightInfo.Legkey;
      depInfo: CommonFlightInfo.Request.DepInfoSpotNo | null;
      arrInfo: CommonFlightInfo.Request.ArrInfoSpotNo | null;
      dataOwnerCd: "SOALA";
    }
    interface RequestOalAircraft {
      funcId: "S11303C";
      oal2Legkey: CommonFlightInfo.Legkey;
      shipNo: string;
      shipTypeIataCd: string;
      depInfo: null;
      arrInfo: null;
      dataOwnerCd: "SOALA";
    }
    interface Response extends Get.Response {
      skippedFlg: boolean;
    }
  }
}
