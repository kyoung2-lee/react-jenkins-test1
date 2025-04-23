/* eslint-disable @typescript-eslint/no-unused-vars */
namespace HeaderInfoApi {
  interface Request {
    apoCd: string;
  }

  interface Response {
    commonHeader: CommonApi.CommonHeader;
    timeLcl: string;
    usingRwy: UsingRwy[];
    issu: Issu[];
    airportDtl: AirportDtl[] | AirportDtl;
    curfew: Curfew[];
  }

  interface UsingRwy {
    trxId: string;
    apoCd: string;
    rwyToLdCat: string;
    rwyNo: string;
    updateTime: string;
  }

  interface Issu {
    trxId: string;
    apoCd: string;
    issuCd: string;
    issuDtlCd: string;
    issuTime: string;
    updateTime: string;
  }

  interface AirportDtl {
    trxId: string;
    apoCd: string;
    apoRmksInfo: string;
  }

  interface Curfew {
    trxId: string;
    apoCd: string;
    curfewTimeStartLcl: string;
    curfewTimeEndLcl: string;
  }
}
