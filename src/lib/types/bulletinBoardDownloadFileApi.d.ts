/* eslint-disable @typescript-eslint/no-unused-vars */
namespace BulletinBoardDownloadFileApi {
  export interface Request {
    fileId: number;
    connectDbCat: ConnectDbCat;
  }

  export interface Response {
    file: File;
  }

  interface File {
    name: string;
    type: string;
    url: string;
  }
}
