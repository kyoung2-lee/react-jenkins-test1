"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCommentReaction = exports.toggleResponseReaction = exports.toggleThreadReaction = exports.startThread = exports.fetchFlightThread = exports.fetchFlightThreadsDetailless = exports.fetchFlightThreadsAll = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const dayjs_1 = __importDefault(require("dayjs"));
const webApi_1 = require("../lib/webApi");
const flightModals_1 = require("./flightModals");
const commonUtil_1 = require("../lib/commonUtil");
const flightContents_1 = require("./flightContents");
exports.fetchFlightThreadsAll = (0, toolkit_1.createAsyncThunk)("flightContentsBulletinBoard/fetchFlightThreadsAll", async (arg, thunkAPI) => {
    const { flightKey, bbId, isReload, isNeedScroll = false, messages } = arg;
    const { dispatch, getState } = thunkAPI;
    const accountState = getState().account;
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    let bulletinBoard = {
        isNeedScroll,
        fetchedTimeStamp: Date.now(),
    };
    let errFlg = false;
    try {
        // 掲示板一覧の取得
        const paramsThreadFlight = {
            legInfoCd: flightKey.oalTblFlg ? "OA2" : "JAL",
            orgDateLcl: flightKey.orgDateLcl,
            alCd: flightKey.alCd,
            fltNo: flightKey.fltNo,
            casFltNo: flightKey.casFltNo || "",
            skdDepApoCd: flightKey.skdDepApoCd,
            skdArrApoCd: flightKey.skdArrApoCd,
            skdLegSno: flightKey.skdLegSno,
            onlineDbExpDays: flightKey.oalTblFlg ? accountState.master.oalOnlineDbExpDays : accountState.master.onlineDbExpDays,
        };
        // スレッド一覧を検索
        const resThreadFlight = await webApi_1.WebApi.getBulletinBoardTheadsFlight(dispatch, paramsThreadFlight, messages);
        bulletinBoard = {
            ...bulletinBoard,
            threads: resThreadFlight.data,
            thread: null,
            currentBbId: null,
        };
        // 自グループ作成のスレッドを検索
        const findedThread = resThreadFlight.data.threads.find((thread) => thread.orgnGrpCd === accountState.jobAuth.user.grpCd);
        // カレントは初回読み込み時のみ設定
        if (findedThread && !isReload && !bbId) {
            bulletinBoard.currentBbId = findedThread.bbId;
        }
        // bbIdを指定されている場合
        if (bbId) {
            const findedThreadBbId = resThreadFlight.data.threads.find((thread) => thread.bbId === bbId);
            if (findedThreadBbId) {
                bulletinBoard.currentBbId = findedThreadBbId.bbId;
            }
        }
    }
    catch (err) {
        errFlg = true;
    }
    if (bulletinBoard.threads && bulletinBoard.currentBbId) {
        try {
            const paramsThread = {
                bbId: bulletinBoard.currentBbId,
                connectDbCat: bulletinBoard.threads.connectDbCat,
            };
            const onNotFoundOrForbidden = () => {
                if (bulletinBoard.currentBbId) {
                    dispatch((0, flightContents_1.applyBulletinBoardRemoveThread)({ flightKey, bbId: bulletinBoard.currentBbId }));
                }
            };
            const resThread = await webApi_1.WebApi.getBulletinBoardThead(dispatch, paramsThread, {
                onNotFoundThread: onNotFoundOrForbidden,
                onForbidden: onNotFoundOrForbidden,
            });
            bulletinBoard.thread = resThread.data;
        }
        catch (err) {
            // 何もしない
        }
    }
    if (!errFlg) {
        dispatch((0, flightContents_1.applyBulletinBoard)({ flightKey, bulletinBoard }));
    }
    else {
        if (!isReload) {
            // 表示に失敗した場合、便詳細履歴画面を閉じる
            dispatch((0, flightModals_1.closeFlightModalAction)({ identifier }));
            dispatch((0, flightContents_1.removeFlightContent)({ identifier }));
        }
        dispatch((0, flightContents_1.failureFetching)({ identifier }));
    }
});
exports.fetchFlightThreadsDetailless = (0, toolkit_1.createAsyncThunk)("flightContentsBulletinBoard/fetchFlightThreadsDetailless", async ({ flightKey }, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const accountState = getState().account;
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    let bulletinBoard = {
        thread: null,
        currentBbId: null,
        isNeedScroll: false,
        fetchedTimeStamp: Date.now(),
    };
    let errFlg = false;
    try {
        // 掲示板一覧の取得
        const paramsThreadFlight = {
            legInfoCd: flightKey.oalTblFlg ? "OA2" : "JAL",
            orgDateLcl: flightKey.orgDateLcl,
            alCd: flightKey.alCd,
            fltNo: flightKey.fltNo,
            casFltNo: flightKey.casFltNo || "",
            skdDepApoCd: flightKey.skdDepApoCd,
            skdArrApoCd: flightKey.skdArrApoCd,
            skdLegSno: flightKey.skdLegSno,
            onlineDbExpDays: flightKey.oalTblFlg ? accountState.master.oalOnlineDbExpDays : accountState.master.onlineDbExpDays,
        };
        // スレッド一覧を検索
        const resThreadFlight = await webApi_1.WebApi.getBulletinBoardTheadsFlight(dispatch, paramsThreadFlight);
        bulletinBoard = { ...bulletinBoard, threads: resThreadFlight.data };
    }
    catch (err) {
        errFlg = true;
    }
    if (!errFlg) {
        dispatch((0, flightContents_1.applyBulletinBoard)({ flightKey, bulletinBoard }));
    }
    else {
        dispatch((0, flightContents_1.failureFetching)({ identifier }));
    }
});
exports.fetchFlightThread = (0, toolkit_1.createAsyncThunk)("flightContentsBulletinBoard/fetchFlightThread", async (arg, thunkAPI) => {
    const { flightKey, bbId, connectDbCat, isNeedScroll = false } = arg;
    const { dispatch } = thunkAPI;
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    try {
        const onNotFoundOrForbidden = () => {
            dispatch((0, flightContents_1.applyBulletinBoardRemoveThread)({ flightKey, bbId }));
        };
        // 特定の掲示板の取得
        const resThread = await webApi_1.WebApi.getBulletinBoardThead(dispatch, { bbId, connectDbCat }, {
            onNotFoundThread: onNotFoundOrForbidden,
            onForbidden: onNotFoundOrForbidden,
        });
        const bulletinBoard = {
            thread: resThread.data,
            currentBbId: bbId,
            isNeedScroll,
            fetchedTimeStamp: Date.now(),
        };
        dispatch((0, flightContents_1.applyBulletinBoard)({ flightKey, bulletinBoard }));
    }
    catch (err) {
        dispatch((0, flightContents_1.failureFetching)({ identifier }));
    }
});
exports.startThread = (0, toolkit_1.createAsyncThunk)("flightContentsBulletinBoard/startThread", (arg, thunkAPI) => {
    const { flightKey, flight } = arg;
    const { dispatch, getState } = thunkAPI;
    const onlineDbExpDays = flightKey.oalTblFlg ? getState().account.master.oalOnlineDbExpDays : getState().account.master.onlineDbExpDays;
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    // ロケーションを取得し実行する
    (0, commonUtil_1.execWithLocationInfo)(({ posLat, posLon }) => {
        const execute = async () => {
            try {
                const fltNo = flightKey.casFltNo ? flightKey.casFltNo : flight.alCd + (0, commonUtil_1.formatFltNo)(flight.fltNo);
                // 特定の掲示板の取得
                const params = {
                    bbTitle: `${fltNo}/${(0, dayjs_1.default)(flight.orgDateLcl).format("DDMMM").toUpperCase()} ${flight.lstDepApoCd}-${flight.lstArrApoCd}`,
                    legInfoCd: flightKey.oalTblFlg ? "OA2" : "JAL",
                    orgDateLcl: flightKey.orgDateLcl,
                    alCd: flightKey.alCd,
                    fltNo: flightKey.fltNo,
                    casFltNo: flightKey.oalTblFlg ? flightKey.casFltNo || "" : "",
                    skdDepApoCd: flightKey.skdDepApoCd,
                    skdArrApoCd: flightKey.skdArrApoCd,
                    skdLegSno: flightKey.skdLegSno,
                    onlineDbExpDays,
                    posLat,
                    posLon,
                };
                const response = await webApi_1.WebApi.postBroadcastFlightStart(dispatch, params);
                await dispatch((0, exports.fetchFlightThreadsAll)({
                    flightKey,
                    bbId: response.data.bbId,
                    isReload: true,
                }));
                return;
            }
            catch (err) {
                dispatch((0, flightContents_1.failureFetching)({ identifier }));
            }
        };
        void execute();
    });
});
exports.toggleThreadReaction = (0, toolkit_1.createAsyncThunk)("bulletinBoard/toggleThreadReaction", async (arg, { dispatch, getState }) => {
    const { flightKey, params } = arg;
    const { user } = getState().account.jobAuth;
    if (!params.bbId)
        return;
    // API 呼び出し中はボタン押下後の状態を反映させるため、前もってリアクション数を変更しておく
    if (params.funcType === 1) {
        dispatch((0, flightContents_1.applyBulletinBoardAddThreadReaction)({ flightKey, bbId: params.bbId, racType: params.racType, user }));
    }
    else if (params.funcType === 2) {
        dispatch((0, flightContents_1.applyBulletinBoardDeleteThreadReaction)({ flightKey, bbId: params.bbId, racType: params.racType, user }));
    }
    try {
        await webApi_1.WebApi.postBulletinBoardThreadReaction(dispatch, params);
    }
    catch (error) {
        // スレッドリアクション更新 API 呼び出し失敗、変更したリアクション数を元に戻す
        if (params.funcType === 1) {
            dispatch((0, flightContents_1.applyBulletinBoardDeleteThreadReaction)({ flightKey, bbId: params.bbId, racType: params.racType, user }));
        }
        else if (params.funcType === 2) {
            dispatch((0, flightContents_1.applyBulletinBoardAddThreadReaction)({ flightKey, bbId: params.bbId, racType: params.racType, user }));
        }
    }
});
exports.toggleResponseReaction = (0, toolkit_1.createAsyncThunk)("bulletinBoard/toggleResponseReaction", async (arg, { dispatch, getState }) => {
    const { flightKey, params } = arg;
    const { user } = getState().account.jobAuth;
    if (!params.resId)
        return;
    if (params.funcType === 1) {
        dispatch((0, flightContents_1.applyBulletinBoardAddResponseReaction)({ flightKey, resId: params.resId, racType: params.racType, user }));
    }
    else if (params.funcType === 2) {
        dispatch((0, flightContents_1.applyBulletinBoardDeleteResponseReaction)({ flightKey, resId: params.resId, racType: params.racType, user }));
    }
    try {
        await webApi_1.WebApi.postBulletinBoardResponseReaction(dispatch, params);
    }
    catch (error) {
        if (params.funcType === 1) {
            dispatch((0, flightContents_1.applyBulletinBoardDeleteResponseReaction)({ flightKey, resId: params.resId, racType: params.racType, user }));
        }
        else if (params.funcType === 2) {
            dispatch((0, flightContents_1.applyBulletinBoardAddResponseReaction)({ flightKey, resId: params.resId, racType: params.racType, user }));
        }
    }
});
exports.toggleCommentReaction = (0, toolkit_1.createAsyncThunk)("bulletinBoard/toggleCommentReaction", async (arg, { dispatch, getState }) => {
    const { flightKey, params } = arg;
    const { user } = getState().account.jobAuth;
    if (!params.cmtId)
        return;
    if (params.funcType === 1) {
        dispatch((0, flightContents_1.applyBulletinBoardAddCommentReaction)({ flightKey, cmtId: params.cmtId, racType: params.racType, user }));
    }
    else if (params.funcType === 2) {
        dispatch((0, flightContents_1.applyBulletinBoardDeleteCommentReaction)({ flightKey, cmtId: params.cmtId, racType: params.racType, user }));
    }
    try {
        await webApi_1.WebApi.postBulletinBoardCommentReaction(dispatch, params);
    }
    catch (error) {
        if (params.funcType === 1) {
            dispatch((0, flightContents_1.applyBulletinBoardDeleteCommentReaction)({ flightKey, cmtId: params.cmtId, racType: params.racType, user }));
        }
        else if (params.funcType === 2) {
            dispatch((0, flightContents_1.applyBulletinBoardAddCommentReaction)({ flightKey, cmtId: params.cmtId, racType: params.racType, user }));
        }
    }
});
//# sourceMappingURL=flightContentsBulletinBoard.js.map