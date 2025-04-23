/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardResponseReactionApi {
  export interface Request {
    resId: number;
    funcType: BbRacFuncType;
    racType: string;
  }

  export interface Response {
    resId: number;
  }
}
