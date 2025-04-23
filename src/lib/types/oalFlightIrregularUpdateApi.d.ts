/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OalFlightIrregularUpdateApi {
  namespace Post {
    interface Request {
      funcId: "S10602C";
      oal2Legkey: CommonFlightInfo.Legkey;
      irrSts: IrrStsType;
      arrInfo: {
        estLdLcl: string | null;
        lstArrApoCd: string | null;
      };
      dataOwnerCd: "SOALA";
    }

    interface Response {
      commonHeader: CommonApi.CommonHeader;
      oal2Legkey: CommonFlightInfo.Legkey;
      csCnt: number;
      fisFltSts: FisStsType;
      irrSts: IrrStsType;
      legCnlFlg: boolean;
      depInfo: CommonFlightInfo.Response.DepInfo;
      arrInfo: CommonFlightInfo.Response.ArrInfo;
    }
    interface ErrorResponse {
      errors: {
        errorItems: string[];
        errorMessages: string[];
      }[];
    }
  }
}
