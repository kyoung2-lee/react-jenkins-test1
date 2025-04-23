/* eslint-disable @typescript-eslint/no-unused-vars */
namespace FlightRmksApi {
  interface Request {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    oalTblFlg: boolean;
    rmksTypeCd: "ARR" | "DEP";
    rmksText?: string;
  }

  interface Response {
    commonHeader: CommonApi.CommonHeader;
    rmksText: string;
  }
}
