/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardUpdateResponse {
  export interface Request {
    resId: number;
    resTitle: string;
    resText: string;
    posLat: string | null;
    posLon: string | null;
  }

  export interface Response {
    resId: number;
  }
}
