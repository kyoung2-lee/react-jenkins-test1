import { Dispatch } from "redux";
import { NotificationCreator } from "./notifications";
import { SoalaMessage } from "./soalaMessages";
import { WebApi } from "./webApi";
import { execWithLocationInfo } from "./commonUtil";

interface Props {
  dispatch: Dispatch;
}

export class BulletinBoardResourceOperator {
  private readonly dispatch: Dispatch;

  constructor(params: Props) {
    this.dispatch = params.dispatch;
  }

  async createComment(params: { bbId: number; cmtText: string }, callbacks: WebApi.Callbacks) {
    return new Promise((resolve, reject) => {
      // TODO 正常に動くか検査する → PCは問題なし
      // ロケーションを取得し実行する
      execWithLocationInfo(({ posLat, posLon }) => {
        (async () => {
          try {
            const response = await WebApi.postBulletinBoardComment(
              this.dispatch,
              {
                bbId: params.bbId,
                cmtText: params.cmtText,
                posLat,
                posLon,
              },
              callbacks
            );
            return response;
          } catch (err) {
            console.error(err);
            throw err;
          }
        })()
          .then((response) => resolve(response))
          .catch((err) => reject(err));
      });
    });
  }

  async updateComment(params: { bbId: number; cmtId: number; cmtText: string }, callbacks: WebApi.Callbacks) {
    return new Promise((resolve, reject) => {
      // ロケーションを取得し実行する
      execWithLocationInfo(({ posLat, posLon }) => {
        (async () => {
          try {
            const response = await WebApi.postBulletinBoardCommentUpdate(
              this.dispatch,
              {
                cmtId: params.cmtId,
                cmtText: params.cmtText,
                posLat,
                posLon,
              },
              callbacks
            );
            return response;
          } catch (err) {
            console.error(err);
            throw err;
          }
        })()
          .then((response) => resolve(response))
          .catch((err) => reject(err));
      });
    });
  }

  async deleteComment(cmtId: number, callbacks: WebApi.Callbacks) {
    return new Promise<void>((resolve, reject) => {
      NotificationCreator.create({
        dispatch: this.dispatch,
        message: SoalaMessage.M40014C({
          item: "comment",
          onYesButton: () => {
            (async () => {
              try {
                await WebApi.postBulletinBoardCommentDelete(this.dispatch, { cmtId }, callbacks);
                return;
              } catch (err) {
                console.error(err);
                throw err;
              }
            })()
              .then(() => resolve())
              .catch((err) => reject(err));
          },
        }),
      });
    });
  }

  async deleteThread(bbId: number, callbacks?: WebApi.Callbacks) {
    return new Promise<void>((resolve, reject) => {
      NotificationCreator.create({
        dispatch: this.dispatch,
        message: SoalaMessage.M40014C({
          item: "thread",
          onYesButton: () => {
            (async () => {
              try {
                await WebApi.postBulletinBoardThreadDelete(this.dispatch, { bbId }, callbacks);
                return;
              } catch (err) {
                console.error(err);
                throw err;
              }
            })()
              .then(() => resolve())
              .catch((err) => reject(err));
          },
        }),
      });
    });
  }

  async deleteRes(resId: number, callbacks: WebApi.Callbacks) {
    return new Promise<void>((resolve, reject) => {
      NotificationCreator.create({
        dispatch: this.dispatch,
        message: SoalaMessage.M40014C({
          item: "res",
          onYesButton: () => {
            (async () => {
              try {
                await WebApi.postBulletinBoardResponseDelete(this.dispatch, { resId }, callbacks);
                return;
              } catch (err) {
                console.error(err);
                throw err;
              }
            })()
              .then(() => resolve())
              .catch((err) => reject(err));
          },
        }),
      });
    });
  }

  async createResponse(params: BulletinBoardAddResponse.Request, callbacks: WebApi.Callbacks) {
    return new Promise<void>((resolve, reject) => {
      (async () => {
        try {
          await WebApi.postBulletinBoardResponse(this.dispatch, params, callbacks);
          return;
        } catch (err) {
          console.error(err);
          throw err;
        }
      })()
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  async updateResponse(params: BulletinBoardUpdateResponse.Request, callbacks: WebApi.Callbacks) {
    return new Promise<void>((resolve, reject) => {
      (async () => {
        try {
          await WebApi.postBulletinBoardResponseUpdate(this.dispatch, params, callbacks);
          return;
        } catch (err) {
          console.error(err);
          throw err;
        }
      })()
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }
}
