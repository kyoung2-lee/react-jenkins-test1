/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardCommentReactionApi {
  export interface Request {
    cmtId: number;
    funcType: BbRacFuncType;
    racType: string;
  }

  export interface Response {
    cmtId: number;
  }
}
