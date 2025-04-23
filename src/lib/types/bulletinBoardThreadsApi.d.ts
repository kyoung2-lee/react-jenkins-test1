/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardThreadsApi {
  interface Request {
    // パラメータを何も渡さないとAPIでエラーになるので必ず渡す
    keyword: string;
    catCdList: string[];
    from: string;
    to: string;
    archiveDateLcl?: string;
  }

  interface Response {
    commonHeader: CommonApi.CommonHeader;
    jstFlg: boolean;
    archiveFlg: boolean;
    threadList: Thread[];
  }

  export interface Thread {
    bbId: number;
    catCdList: string[];
    updateTime: string; // yyyy-MM-ddThh:mm:ss形式 jstFlgがtrueの場合はJST時刻が、そうでない場合は空港LOCAL時刻が格納される。
    jobCd: string;
    bbTitle: string;
  }
}
