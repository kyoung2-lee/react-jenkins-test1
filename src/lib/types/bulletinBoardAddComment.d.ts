/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardAddComment {
  export interface Request {
    bbId: number;
    cmtText: string;
    posLat: string | null;
    posLon: string | null;
  }

  export interface Response {
    cmtId: number;
  }
}
