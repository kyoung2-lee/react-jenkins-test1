/* eslint-disable @typescript-eslint/no-unused-vars */
namespace UpdateAirportRemarksApi {
  interface Request {
    apoCd: string;
    apoRmksInfo: string;
  }

  interface Response {
    commonHeader: CommonApi.CommonHeader;
    apoCd: string;
    apoRmksInfo: string;
  }
}
