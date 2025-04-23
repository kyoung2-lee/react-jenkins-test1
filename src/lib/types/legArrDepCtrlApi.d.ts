/* eslint-disable @typescript-eslint/no-unused-vars */
namespace LegArrDepCtrlApi {
  /** S10100WE_着発関連便区間情報-取得API リクエスト */
  export interface Request {
    seq: number;
  }

  /** S10100WE_着発関連便区間情報-取得API レスポンス */
  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    arr: ?Arr;
    dep: ?Dep;
  }

  export interface ArrDep {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    lstDepApoCd: string;
    lstArrApoCd: string;
    csFlg: boolean;
    spotNo: string;
    shipNo: string | null;
    shipTypeIataCd: string;
  }

  export interface Arr extends ArrDep {
    staLcl: ?string;
    etaLcl: ?string;
    ataLcl: ?string;
    estLdLcl: ?string;
    actLdLcl: ?string;
    tentativeEtaLcl: ?string;
    tentativeEstLdLcl: ?string;
  }

  export interface Dep extends ArrDep {
    stdLcl: ?string;
    etdLcl: ?string;
    atdLcl: ?string;
    tentativeEtdLcl: ?string;
  }
}
