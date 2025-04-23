/* eslint-disable @typescript-eslint/no-unused-vars */
namespace SpotRemarksApi {
  export namespace Get {
    export interface Request {
      apoCd: string;
      spotNo: string | null;
    }

    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      timeLcl: string;
      spotRmksList: SpotRmks[];
    }

    export interface SpotRmks {
      trxId: string;
      apoCd: string;
      spotNo: string;
      dispSeq: number;
      hideFlg: boolean;
      spotRmks: string;
      updateTime: string;
    }
  }

  export namespace Post {
    /** S10701W2_バーチャートSPOTリマークス更新 リクエスト */
    export interface Request {
      apoCd: string;
      spotNo: string;
      spotRmks: string;
    }

    /** S10701W2_バーチャートSPOTリマークス更新 レスポンス */
    export interface Response {
      commonHeader: CommonApi.CommonHeader;
    }
  }
}
