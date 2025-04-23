"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletinBoardResourceOperator = void 0;
const notifications_1 = require("./notifications");
const soalaMessages_1 = require("./soalaMessages");
const webApi_1 = require("./webApi");
const commonUtil_1 = require("./commonUtil");
class BulletinBoardResourceOperator {
    constructor(params) {
        this.dispatch = params.dispatch;
    }
    async createComment(params, callbacks) {
        return new Promise((resolve, reject) => {
            // TODO 正常に動くか検査する → PCは問題なし
            // ロケーションを取得し実行する
            (0, commonUtil_1.execWithLocationInfo)(({ posLat, posLon }) => {
                (async () => {
                    try {
                        const response = await webApi_1.WebApi.postBulletinBoardComment(this.dispatch, {
                            bbId: params.bbId,
                            cmtText: params.cmtText,
                            posLat,
                            posLon,
                        }, callbacks);
                        return response;
                    }
                    catch (err) {
                        console.error(err);
                        throw err;
                    }
                })()
                    .then((response) => resolve(response))
                    .catch((err) => reject(err));
            });
        });
    }
    async updateComment(params, callbacks) {
        return new Promise((resolve, reject) => {
            // ロケーションを取得し実行する
            (0, commonUtil_1.execWithLocationInfo)(({ posLat, posLon }) => {
                (async () => {
                    try {
                        const response = await webApi_1.WebApi.postBulletinBoardCommentUpdate(this.dispatch, {
                            cmtId: params.cmtId,
                            cmtText: params.cmtText,
                            posLat,
                            posLon,
                        }, callbacks);
                        return response;
                    }
                    catch (err) {
                        console.error(err);
                        throw err;
                    }
                })()
                    .then((response) => resolve(response))
                    .catch((err) => reject(err));
            });
        });
    }
    async deleteComment(cmtId, callbacks) {
        return new Promise((resolve, reject) => {
            notifications_1.NotificationCreator.create({
                dispatch: this.dispatch,
                message: soalaMessages_1.SoalaMessage.M40014C({
                    item: "comment",
                    onYesButton: () => {
                        (async () => {
                            try {
                                await webApi_1.WebApi.postBulletinBoardCommentDelete(this.dispatch, { cmtId }, callbacks);
                                return;
                            }
                            catch (err) {
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
    async deleteThread(bbId, callbacks) {
        return new Promise((resolve, reject) => {
            notifications_1.NotificationCreator.create({
                dispatch: this.dispatch,
                message: soalaMessages_1.SoalaMessage.M40014C({
                    item: "thread",
                    onYesButton: () => {
                        (async () => {
                            try {
                                await webApi_1.WebApi.postBulletinBoardThreadDelete(this.dispatch, { bbId }, callbacks);
                                return;
                            }
                            catch (err) {
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
    async deleteRes(resId, callbacks) {
        return new Promise((resolve, reject) => {
            notifications_1.NotificationCreator.create({
                dispatch: this.dispatch,
                message: soalaMessages_1.SoalaMessage.M40014C({
                    item: "res",
                    onYesButton: () => {
                        (async () => {
                            try {
                                await webApi_1.WebApi.postBulletinBoardResponseDelete(this.dispatch, { resId }, callbacks);
                                return;
                            }
                            catch (err) {
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
    async createResponse(params, callbacks) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    await webApi_1.WebApi.postBulletinBoardResponse(this.dispatch, params, callbacks);
                    return;
                }
                catch (err) {
                    console.error(err);
                    throw err;
                }
            })()
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }
    async updateResponse(params, callbacks) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    await webApi_1.WebApi.postBulletinBoardResponseUpdate(this.dispatch, params, callbacks);
                    return;
                }
                catch (err) {
                    console.error(err);
                    throw err;
                }
            })()
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }
}
exports.BulletinBoardResourceOperator = BulletinBoardResourceOperator;
//# sourceMappingURL=BulletinBoardResourceOperator.js.map