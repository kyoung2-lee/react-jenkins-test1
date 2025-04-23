/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardThreadFlightApi {
  interface Request {
    legInfoCd: "JAL" | "OA2";
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    onlineDbExpDays: number;
  }

  interface Response {
    commonHeader: CommonApi.CommonHeader;
    flight: CommonApi.Flight;
    threads: Thread[];
    connectDbCat: ConnectDbCat;
  }

  interface Thread {
    bbId: number;
    profileTmbImg?: string;
    bbTitle: string;
    orgnGrpCd: string;
  }
}
