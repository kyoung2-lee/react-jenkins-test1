/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardAddResponse {
  export interface Request {
    bbId: number;
    resTitle: string;
    resText: string;
    posLat: string | null;
    posLon: string | null;
  }

  export interface Response {
    resId: number;
  }
}
