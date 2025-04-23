/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardThreadReactionApi {
  export interface Request {
    bbId: number;
    funcType: BbRacFuncType;
    racType: string;
  }

  export interface Response {
    bbId: number;
  }
}
