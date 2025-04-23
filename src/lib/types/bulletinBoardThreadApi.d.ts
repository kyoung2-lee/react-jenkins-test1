/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardThreadApi {
  interface Request {
    bbId: number;
    connectDbCat: ConnectDbCat;
  }

  interface Response {
    jstFlg: boolean;
    thread: Thread;
  }

  interface Thread {
    bbId: number;
    updateTime: string;
    bbTitle: string;
    bbText: string;
    editFlg: boolean;
    catCdList: string[];
    jobCdList: string[];
    postUser: PostUser;
    bbFileList: BbFile[];
    bbRacList: Reaction[];
    bbResList: BbRes[];
    bbCmtList: BbCmt[];
  }

  interface BbRes {
    resId: number;
    resNumber: number;
    updateTime: string;
    resTitle: string;
    resText: string;
    editFlg: boolean;
    postUser: PostUser;
    bbResRacList: Reaction[];
  }

  interface PostUser {
    userId: string;
    profileTmbImg: string;
    familyName: string;
    firstName: string;
    jobCd: string;
    appleId: string;
  }

  interface BbCmt {
    cmtId: number;
    updateTime: string;
    cmtText: string;
    editFlg: boolean;
    postUser: PostUser;
    bbCmtRacList: Reaction[];
  }

  interface BbFile {
    fileId: number;
    fileName: string;
    fileTmb: string; // Data URI Scheme形式文字列を返却する。
    fileType: "image" | "video" | "pdf";
  }

  interface Reaction {
    racType: string;
    racCount: number;
    racUser: BbRacUser[];
  }

  interface BbRacUser {
    userId: string;
    familyName: string;
    firstName: string;
  }
}
