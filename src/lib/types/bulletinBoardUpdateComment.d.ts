/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardUpdateComment {
  export interface Request {
    cmtId: number;
    cmtText: string;
    posLat: string | null;
    posLon: string | null;
  }

  export interface Response {
    cmtId: number;
  }
}
