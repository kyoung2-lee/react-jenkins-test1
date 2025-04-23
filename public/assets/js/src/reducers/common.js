"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDate = exports.hideMenuModal = exports.showMenuModal = exports.screenTransitionError = exports.forceGoTo = exports.forceGoToError = exports.setBadgeNumber = exports.addNotificationMessagesFailure = exports.addNotificationMessagesSuccess = exports.setAirportRemarks = exports.fetchUpdateAirportRemarksFailure = exports.fetchUpdateAirportRemarksSuccess = exports.fetchUpdateAirportRemarks = exports.fetchHeaderInfoFromPushSuccess = exports.fetchHeaderInfoClear = exports.fetchHeaderInfoFailure = exports.updateHeaderInfoTerminalUtcDate = exports.updateHeaderInfoDate = exports.fetchHeaderInfoSuccess = exports.fetchHeaderInfo = exports.hideMask = exports.showMask = exports.slice = exports.reflectHeaderInfoFromPush = exports.removeAllNotification = exports.showIllegalFileFormatError = exports.showConfirmation = exports.showNotificationAirportRmksNoChange = exports.addNotificationMessages = exports.updateAirportRemarks = exports.getHeaderInfo = exports.logout = exports.closeDetailModal = exports.closeAllDraggableModals = exports.screenTransition = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
// eslint-disable-next-line import/no-cycle
const webApi_1 = require("../lib/webApi");
const commonUtil_1 = require("../lib/commonUtil");
const storage_1 = require("../lib/storage");
const StorageOfUser_1 = require("../lib/StorageOfUser");
// eslint-disable-next-line import/no-cycle
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const queuing_1 = require("../lib/queuing");
const config_1 = require("../../config/config");
const barChartSearch_1 = require("./barChartSearch");
const fisFilterModal_1 = require("./fisFilterModal");
const flightContents_1 = require("./flightContents");
// eslint-disable-next-line import/no-cycle
const flightListModals_1 = require("./flightListModals");
// eslint-disable-next-line import/no-cycle
const flightModals_1 = require("./flightModals");
const flightSearch_1 = require("./flightSearch");
// eslint-disable-next-line import/no-cycle
const shipTransitListModals_1 = require("./shipTransitListModals");
// eslint-disable-next-line import/no-cycle
const oalFlightSchedule_1 = require("./oalFlightSchedule");
// eslint-disable-next-line import/no-cycle
const multipleFlightMovementModals_1 = require("./multipleFlightMovementModals");
const broadcastBulletinBoard_1 = require("./broadcastBulletinBoard");
const broadcastEmail_1 = require("./broadcastEmail");
const broadcastTty_1 = require("./broadcastTty");
const broadcastNotification_1 = require("./broadcastNotification");
const mqtt_1 = require("../lib/IotCore/mqtt");
exports.screenTransition = (0, toolkit_1.createAsyncThunk)("common/screenTransition", async (arg, thunkAPI) => {
    const { from, to } = arg;
    const { dispatch, getState } = thunkAPI;
    await dispatch((0, exports.closeAllDraggableModals)());
    dispatch(exports.slice.actions.screenTransition({ from, to }));
    dispatch((0, barChartSearch_1.clearBarChartSearch)());
    dispatch((0, fisFilterModal_1.clearFisFilterModal)());
    dispatch((0, flightSearch_1.clearFlightSearch)());
    dispatch((0, oalFlightSchedule_1.clearOalFlightSchedule)());
    dispatch((0, multipleFlightMovementModals_1.clearMultipleFlightMovement)());
    const { notifications = [] } = getState();
    if (notifications.length) {
        notifications_1.NotificationCreator.removeAll({ dispatch });
    }
});
exports.closeAllDraggableModals = (0, toolkit_1.createAsyncThunk)("common/closeAllDraggableModals", (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch((0, flightContents_1.clearFlightContents)());
    dispatch((0, flightListModals_1.clearFlightListModals)());
    dispatch((0, flightModals_1.clearFlightModals)());
    dispatch((0, shipTransitListModals_1.clearShipTransitListModals)());
});
exports.closeDetailModal = (0, toolkit_1.createAsyncThunk)("common/closeDetailModal", (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch((0, broadcastBulletinBoard_1.closeBbAddressDetailModal)());
    dispatch((0, broadcastEmail_1.closeMailAddressDetailModal)());
    dispatch((0, broadcastTty_1.closeTtyAddressDetailModal)());
    dispatch((0, broadcastNotification_1.closeNotificationAddressDetailModal)());
});
exports.logout = (0, toolkit_1.createAsyncThunk)("common/logout", async (_arg, _thunkAPI) => {
    await mqtt_1.mqtt.disconnect();
    webApi_1.WebApi.postLogout().finally(() => {
        storage_1.storage.clear();
        StorageOfUser_1.storageOfUser.clearLoginStamp();
        StorageOfUser_1.storageOfUser.initPushCounter();
        // iOSのログイン状態をクリア
        if (window.webkit)
            window.webkit.messageHandlers.clearLogin.postMessage("");
        // ログイン画面に遷移
        window.open(config_1.ServerConfig.USER_LOGIN_URL, "_self");
    });
});
// iOSからログアウトされた場合に呼び出される
window.iLogout = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    webApi_1.WebApi.postLogout(); // 応答を待たない
    storage_1.storage.clear();
};
exports.getHeaderInfo = (0, toolkit_1.createAsyncThunk)("common/getHeaderInfo", async (arg, thunkAPI) => {
    const { openRmksPopup, closeRmksPopup } = arg;
    let { apoCd } = arg;
    const { dispatch } = thunkAPI;
    apoCd = apoCd || "";
    dispatch((0, exports.fetchHeaderInfo)({ apoCd }));
    try {
        const response = await webApi_1.WebApi.getHeader(dispatch, { apoCd });
        dispatch((0, exports.fetchHeaderInfoSuccess)({ data: response.data, apoCd }));
        if (openRmksPopup) {
            openRmksPopup();
        }
    }
    catch (err) {
        if (err instanceof webApi_1.ApiError && err.response) {
            const statusCode = err.response.status;
            if (closeRmksPopup &&
                statusCode !== 400 && // 強制画面しない場合のみ
                statusCode !== 401 &&
                statusCode !== 403 &&
                statusCode !== 405) {
                // 空港リマークス表示時、空港細表示に失敗した場合、便リマークスポップアップを閉じる
                closeRmksPopup();
            }
            dispatch((0, exports.fetchHeaderInfoFailure)({
                error: err,
                retry: () => (0, exports.getHeaderInfo)({ apoCd, openRmksPopup, closeRmksPopup }),
            }));
        }
    }
});
exports.updateAirportRemarks = (0, toolkit_1.createAsyncThunk)("common/updateAirportRemarks", async (arg, thunkAPI) => {
    const { apoCd, apoRmksInfo, closeAirportRemarksPopup } = arg;
    const { dispatch } = thunkAPI;
    dispatch((0, exports.fetchUpdateAirportRemarks)());
    try {
        const response = await webApi_1.WebApi.postAirportRemarks(dispatch, { apoCd, apoRmksInfo });
        dispatch((0, exports.fetchUpdateAirportRemarksSuccess)({ data: response.data, apoCd }));
        await dispatch((0, exports.getHeaderInfo)({ apoCd }));
        closeAirportRemarksPopup();
    }
    catch (err) {
        dispatch((0, exports.fetchUpdateAirportRemarksFailure)({
            error: err,
            retry: () => (0, exports.updateAirportRemarks)({ apoCd, apoRmksInfo, closeAirportRemarksPopup }),
        }));
    }
});
// PUSH通知のメッセージをiOSから受け取る
exports.addNotificationMessages = (0, toolkit_1.createAsyncThunk)("common/addNotificationMessages", (arg, thunkAPI) => {
    const { messagesJson } = arg;
    const { dispatch } = thunkAPI;
    //  messagesJson = "WwogIHsKICAgICJsZWdLZXkiIDogewogICAgICAiZmx0Tm8iIDogIjMxMDEiLAogICAgICAic2tkTGVnU25vIiA6IDMxLAogICAgICAiZnJlZUZsdFNubyIgOiAiIiwKICAgICAgImNhc0ZsdENhdCIgOiAiIiwKICAgICAgImxlZ0luZm9DZCIgOiAiSkFMIiwKICAgICAgInNrZEFyckFwb0NkIiA6ICJITkQiLAogICAgICAic2tkRGVwQXBvQ2QiIDogIlNJTiIsCiAgICAgICJhbENkIiA6ICJKTCIsCiAgICAgICJvcmdEYXRlTGNsIiA6ICIyMDE5LTA0LTA5IgogICAgfSwKICAgICJzb2FsYUV2ZW50Q29kZSIgOiAiRElWIiwKICAgICJ0aXRsZSIgOiAiUm91dGUgY2hhZ2UiLAogICAgImRhdGUiIDogIjIwMTktMTEtMjEgMTc6NTE6MzguNTgzIiwKICAgICJiYktleSIgOiB7CiAgICAgICJpZCIgOiAxMjM0CiAgICB9LAogICAgInR5cGUiIDogImZsaWdodCIsCiAgICAiYm9keSIgOiAiSkwxMTExXC8yNERFQ1xyXG4y4oaQOWJiYiIsCiAgICAic2VxIiA6IDAKICB9Cl0=";
    try {
        const messages = JSON.parse((0, commonUtil_1.b64DecodeUnicode)(messagesJson));
        // console.dir(messages);
        dispatch((0, exports.addNotificationMessagesSuccess)({ messages }));
    }
    catch (err) {
        if (err instanceof Error) {
            const id = "addNotificationMessages";
            notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M50021C() });
            // tslint:disable-next-line:no-console
            console.log(`[${err.name}] ${err.message}`);
        }
        dispatch((0, exports.addNotificationMessagesFailure)());
    }
});
exports.showNotificationAirportRmksNoChange = (0, toolkit_1.createAsyncThunk)("common/showNotificationAirportRmksNoChange", (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40002C({}) });
});
exports.showConfirmation = (0, toolkit_1.createAsyncThunk)("common/showConfirmation", (arg, thunkAPI) => {
    const { onClickYes } = arg;
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: onClickYes }) });
});
exports.showIllegalFileFormatError = (0, toolkit_1.createAsyncThunk)("common/showIllegalFileFormatError", (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50026C() });
});
exports.removeAllNotification = (0, toolkit_1.createAsyncThunk)("common/removeAllNotification", (_arg, { dispatch }) => {
    notifications_1.NotificationCreator.removeAll({ dispatch });
});
// MQTTのPUSHメッセージをHeaderInfoに反映する
exports.reflectHeaderInfoFromPush = (0, toolkit_1.createAsyncThunk)("common/reflectHeaderInfoFromPush", (arg, thunkAPI) => {
    const { payload } = arg;
    const { dispatch } = thunkAPI;
    try {
        const pushData = JSON.parse(payload);
        queuing_1.queue.add(() => dispatch((0, exports.fetchHeaderInfoFromPushSuccess)(pushData)));
        if (!storage_1.storage.switchingAutoReloadOn) {
            queuing_1.queue.runAll(); // 自動更新スイッチ中でない場合は即実行する
        }
    }
    catch (err) {
        if (err instanceof Error) {
            const id = "reflectHeaderInfoFromPush";
            notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M50021C() });
            // tslint:disable-next-line:no-console
            console.log(`[${err.name}] ${err.message}`);
        }
    }
});
function updateHeaderInfo(newHeaderInfo, orgHeaderInfo) {
    // 返却するオブジェクトを用意
    const returnHeaderInfo = {
        ...orgHeaderInfo,
        usingRwy: orgHeaderInfo.usingRwy.concat(),
        issu: orgHeaderInfo.issu.concat(),
    };
    const applyData = makeApplyHeader(orgHeaderInfo.buffer, newHeaderInfo);
    // 更新日時を更新
    returnHeaderInfo.apoTimeLcl = (0, commonUtil_1.getTimeDateString)(applyData.timeLcl, "YYYY-MM-DD[T]HH:mm:ss");
    returnHeaderInfo.apoTimeDiffUtc = (0, commonUtil_1.getTimeDiffUtc)(applyData.timeLcl);
    // USING RUNWAY
    if (applyData.usingRwy.length > 0) {
        const reducerRwy = (list, currentRwy) => {
            const { trxId } = currentRwy;
            const index = list.findIndex((rwy) => rwy.apoCd === currentRwy.apoCd && rwy.rwyToLdCat === currentRwy.rwyToLdCat && rwy.rwyNo === currentRwy.rwyNo);
            // 更新日時を比較して新しければ反映する
            if (index >= 0 && list[index].updateTime <= currentRwy.updateTime) {
                if (trxId === "D") {
                    list.splice(index, 1);
                    return list;
                }
                Object.assign(list[index], currentRwy);
                return list; // 元のIssuにマージする
            }
            if (index < 0 && (trxId === "A" || trxId === "U")) {
                // 新規追加
                list.push(currentRwy);
                return list;
            }
            return list;
        };
        returnHeaderInfo.usingRwy = applyData.usingRwy.reduce(reducerRwy, returnHeaderInfo.usingRwy);
    }
    // 空港発令
    if (applyData.issu.length > 0) {
        const reducerIssu = (list, currentIssu) => {
            const { trxId } = currentIssu;
            const index = list.findIndex((issu) => issu.apoCd === currentIssu.apoCd && issu.issuCd === currentIssu.issuCd);
            // 更新日時を比較して新しければ反映する
            if (index >= 0 && list[index].updateTime <= currentIssu.updateTime) {
                if (trxId === "D") {
                    list.splice(index, 1);
                    return list;
                }
                Object.assign(list[index], currentIssu);
                return list; // 元のIssuにマージする
            }
            if (index < 0 && (trxId === "A" || trxId === "U")) {
                // 新規追加
                list.push(currentIssu);
                return list;
            }
            return list;
        };
        returnHeaderInfo.issu = applyData.issu.reduce(reducerIssu, returnHeaderInfo.issu);
    }
    // 空港リマークス
    let airportDtl;
    const airportDtlRaw = applyData.airportDtl;
    if (airportDtlRaw != null) {
        airportDtl = isAirportDtlObj(airportDtlRaw) ? airportDtlRaw : airportDtlRaw.find((e) => e.apoCd === orgHeaderInfo.apoCd);
    }
    if (airportDtl) {
        if (airportDtl.apoCd === orgHeaderInfo.apoCd && airportDtl.apoRmksInfo !== undefined) {
            if (airportDtl.trxId && airportDtl.trxId === "D") {
                returnHeaderInfo.apoRmksInfo = "";
                returnHeaderInfo.edittingAirportRemark = "";
            }
            else {
                returnHeaderInfo.apoRmksInfo = airportDtl.apoRmksInfo;
                returnHeaderInfo.edittingAirportRemark = airportDtl.apoRmksInfo;
            }
        }
    }
    // Curfew
    if (applyData.curfew.length > 0) {
        const curfew = applyData.curfew.find((e) => e.apoCd === orgHeaderInfo.apoCd);
        if (curfew) {
            if (curfew.trxId && curfew.trxId === "D") {
                returnHeaderInfo.curfewTimeStartLcl = "";
                returnHeaderInfo.curfewTimeEndLcl = "";
            }
            else {
                returnHeaderInfo.curfewTimeStartLcl = curfew.curfewTimeStartLcl;
                returnHeaderInfo.curfewTimeEndLcl = curfew.curfewTimeEndLcl;
            }
        }
    }
    // バッファを作成
    returnHeaderInfo.buffer = makeBuffer(orgHeaderInfo.buffer, newHeaderInfo);
    return returnHeaderInfo;
}
function isAirportDtlObj(airportDtl) {
    return toString.call(airportDtl) === toString.call({});
}
/**
 * 画面に反映するデータを作成する
 * @param {HeaderInfoApi.Response[]} buffer
 * @param {HeaderInfoApi.Response} newHeaderInfo
 *
 * @returns {Omit<HeaderInfoApi.Response, "commonHeader">} fis
 */
function makeApplyHeader(buffer, newHeaderInfo) {
    // 今回画面に反映するデータを作成
    const creationTime = (0, dayjs_1.default)(newHeaderInfo.commonHeader.messageReference.creatorReference.creationTime);
    // バッファデータのうち、受信したデータのcreationTimeよりも後のものを取得する
    // さらに受信したデータを結合しcreationTimeの昇順でソートする
    const sortedHeaders = (0, lodash_clonedeep_1.default)(buffer)
        .filter((buf) => (0, dayjs_1.default)(buf.commonHeader.messageReference.creatorReference.creationTime).isSameOrAfter(creationTime))
        .concat(newHeaderInfo)
        .sort(sortCreationTime);
    // timeLclは上で作成したデータのうち最新の日付を返却
    // 他はネストされた配列をフラットにして返却
    return {
        timeLcl: sortedHeaders.reduce((prev, current) => {
            const timeLclPrev = (0, dayjs_1.default)(prev.timeLcl);
            const timeLclCurrent = (0, dayjs_1.default)(current.timeLcl);
            return timeLclCurrent.isAfter(timeLclPrev) ? current : prev;
        }).timeLcl,
        usingRwy: sortedHeaders.map((headers) => headers.usingRwy).flat(),
        issu: sortedHeaders.map((headers) => headers.issu).flat(),
        airportDtl: sortedHeaders.map((headers) => headers.airportDtl).flat(),
        curfew: sortedHeaders.map((headers) => headers.curfew).flat(),
    };
}
/**
 * updateTimeの昇順に並び替える
 * @param a
 * @param b
 * @returns
 */
const sortCreationTime = (a, b) => {
    const creationTimeA = (0, dayjs_1.default)(a.commonHeader.messageReference.creatorReference.creationTime);
    const creationTimeB = (0, dayjs_1.default)(b.commonHeader.messageReference.creatorReference.creationTime);
    return creationTimeA.isSame(creationTimeB) ? 0 : creationTimeA.isBefore(creationTimeB) ? -1 : 1;
};
/**
 * バッファを作成する。期限切れのものは削除する。
 * @param {HeaderInfoApi.Response[]} buffer
 * @param {HeaderInfoApi.Response} currentData
 *
 * @returns {HeaderInfoApi.Response[]} nextBuffer
 */
function makeBuffer(buffer, currentData) {
    if (!buffer.length) {
        return [currentData];
    }
    // バッファ内の最新のcreationTimeを取得
    const latestCreationTime = (0, dayjs_1.default)(buffer.concat(currentData).reduce((prev, current) => {
        const creationTimePrev = (0, dayjs_1.default)(prev.commonHeader.messageReference.creatorReference.creationTime);
        const creationTimeCurrent = (0, dayjs_1.default)(current.commonHeader.messageReference.creatorReference.creationTime);
        return creationTimeCurrent.isAfter(creationTimePrev) ? current : prev;
    }).commonHeader.messageReference.creatorReference.creationTime);
    // バッファ内の最新のcreationTimeから規定秒以内の過去データをバッファする
    return buffer
        .concat(currentData)
        .filter((buf) => {
        const creationTimeBuffer = (0, dayjs_1.default)(buf.commonHeader.messageReference.creatorReference.creationTime);
        return creationTimeBuffer.isSameOrAfter(latestCreationTime.subtract(config_1.ServerConfig.MQTT_KEEP_ALIVE + config_1.ServerConfig.MQTT_SESSION_EXPIRY + config_1.ServerConfig.BUFFER_INTERVAL, "second"));
    })
        .sort(sortCreationTime);
}
const initialState = {
    displayMaskNumber: 0,
    isFetching: false,
    isShowMenuModal: false,
    isForceGoToError: false,
    forceGoToPath: "",
    forceGoToErrorPath: "",
    pushNotificationMessages: [],
    badgeNumber: 0,
    headerInfo: {
        apoCd: "",
        targetDate: "",
        isToday: true,
        apoTimeLcl: "",
        apoTimeDiffUtc: null,
        apoRmksInfo: "",
        usingRwy: [],
        issu: [],
        edittingAirportRemark: "",
        terminalUtcDate: null,
        curfewTimeStartLcl: "",
        curfewTimeEndLcl: "",
        buffer: [],
    },
    fetchHeaderInfoResult: {
        isError: false,
        retry: () => null,
    },
    updateAirportRemarksResult: {
        isError: false,
        retry: () => null,
    },
    initDate: new Date(),
};
function sortUsingRwy(usingRwy) {
    usingRwy.sort((a, b) => {
        if (a.rwyToLdCat < b.rwyToLdCat || a.rwyNo < b.rwyNo) {
            return -1;
        }
        return 1;
    });
}
function sortIssu(issu) {
    const issuSort = { SEC: 1, SWW: 2, TSW: 3, DIC: 4, RCL: 5, SSP: 6 };
    issu.sort((a, b) => issuSort[a.issuCd] - issuSort[b.issuCd]);
}
exports.slice = (0, toolkit_1.createSlice)({
    name: "common",
    initialState,
    reducers: {
        showMask: (state) => {
            state.displayMaskNumber += 1;
        },
        hideMask: (state) => {
            const displayMaskNumber = state.displayMaskNumber > 0 ? state.displayMaskNumber - 1 : 0;
            state.displayMaskNumber = displayMaskNumber;
        },
        fetchHeaderInfo: (state, action) => {
            const { apoCd } = action.payload;
            const headerInfo = {
                ...state.headerInfo,
                apoCd,
            };
            state.isFetching = true;
            state.headerInfo = headerInfo;
        },
        fetchHeaderInfoSuccess: (state, action) => {
            const { data, apoCd } = action.payload;
            // 空港リマークス
            let apoRmksInfo = "";
            if (data.airportDtl) {
                if (isAirportDtlObj(data.airportDtl)) {
                    apoRmksInfo = data.airportDtl.apoRmksInfo || "";
                }
                else if (data.airportDtl.length > 0) {
                    const airportDtl = data.airportDtl.find((e) => e.apoCd === apoCd);
                    apoRmksInfo = airportDtl != null ? airportDtl.apoRmksInfo : "";
                }
            }
            // Curfew
            let curfewTimeStartLcl = "";
            let curfewTimeEndLcl = "";
            if (data.curfew && data.curfew.length > 0) {
                const curfew = data.curfew.find((e) => e.apoCd === apoCd);
                if (curfew) {
                    curfewTimeStartLcl = curfew.curfewTimeStartLcl;
                    curfewTimeEndLcl = curfew.curfewTimeEndLcl;
                }
            }
            sortUsingRwy(data.usingRwy);
            sortIssu(data.issu);
            const apoTimeLcl = (0, commonUtil_1.getTimeDateString)(data.timeLcl, "YYYY-MM-DD[T]HH:mm:ss");
            const apoTimeDiffUtc = (0, commonUtil_1.getTimeDiffUtc)(data.timeLcl);
            state.isFetching = false;
            state.headerInfo = {
                ...state.headerInfo,
                apoCd: apoCd || "",
                apoTimeLcl,
                apoTimeDiffUtc,
                apoRmksInfo,
                usingRwy: data.usingRwy,
                issu: data.issu,
                edittingAirportRemark: apoRmksInfo,
                terminalUtcDate: dayjs_1.default.utc(),
                curfewTimeStartLcl,
                curfewTimeEndLcl,
            };
            state.fetchHeaderInfoResult = { isError: false, retry: () => null };
        },
        fetchHeaderInfoFailure: (state, _action) => {
            state.isFetching = false;
            state.fetchHeaderInfoResult = { isError: false, retry: () => null };
        },
        fetchHeaderInfoClear: (state) => {
            state.headerInfo = initialState.headerInfo;
        },
        updateHeaderInfoDate: (state, action) => {
            const { targetDate, isToday } = action.payload;
            state.headerInfo = {
                ...state.headerInfo,
                targetDate,
                isToday,
            };
        },
        fetchHeaderInfoFromPushSuccess: (state, action) => {
            const headerInfo = updateHeaderInfo(action.payload, state.headerInfo);
            sortUsingRwy(headerInfo.usingRwy);
            sortIssu(headerInfo.issu);
            headerInfo.terminalUtcDate = dayjs_1.default.utc();
            state.headerInfo = headerInfo;
        },
        updateHeaderInfoTerminalUtcDate: (state) => {
            state.headerInfo = {
                ...state.headerInfo,
                terminalUtcDate: dayjs_1.default.utc(),
            };
        },
        fetchUpdateAirportRemarks: (state) => {
            state.isFetching = true;
        },
        fetchUpdateAirportRemarksSuccess: (state, action) => {
            const { data, apoCd } = action.payload;
            state.isFetching = false;
            state.headerInfo = {
                ...state.headerInfo,
                apoCd,
                apoRmksInfo: data.apoRmksInfo,
                edittingAirportRemark: data.apoRmksInfo,
            };
            state.updateAirportRemarksResult = { isError: false, retry: () => null };
        },
        fetchUpdateAirportRemarksFailure: (state, action) => {
            const { retry } = action.payload;
            state.isFetching = false;
            state.updateAirportRemarksResult = { isError: true, retry };
        },
        setAirportRemarks: (state, action) => {
            state.headerInfo = {
                ...state.headerInfo,
                edittingAirportRemark: action.payload,
            };
        },
        addNotificationMessagesSuccess: (state, action) => {
            // 既存に存在しないメッセージだけを抽出
            const newMessages = action.payload.messages.filter((newMsg) => !state.pushNotificationMessages.find((msg) => msg.seq === newMsg.seq));
            const badgeNumber = 0;
            // PUSH通知メッセージの取り込みが完了したらiOSに伝える
            if (window.webkit)
                window.webkit.messageHandlers.addNotificationListCompleted.postMessage("");
            // 端末のローカル日付を表示
            const terminalLclDate = (0, dayjs_1.default)();
            // 新規メッセージを追加し３日未満でフィルタリング
            const pushNotificationMessages = state.pushNotificationMessages
                .concat(newMessages)
                .filter((msg) => terminalLclDate.diff((0, dayjs_1.default)(msg.date), "day") < 3);
            state.pushNotificationMessages = pushNotificationMessages;
            state.badgeNumber = badgeNumber;
        },
        addNotificationMessagesFailure: (_state) => { },
        setBadgeNumber: (state, action) => {
            state.badgeNumber = action.payload;
        },
        forceGoToError: (state, action) => {
            const { forceGoToErrorPath } = action.payload;
            state.isForceGoToError = true;
            state.forceGoToErrorPath = forceGoToErrorPath;
        },
        forceGoTo: (state, action) => {
            const { path } = action.payload;
            state.forceGoToPath = path;
        },
        screenTransitionError: (state) => {
            state.isForceGoToError = false;
        },
        screenTransition: (state, _action) => {
            state.forceGoToPath = "";
            state.forceGoToErrorPath = "";
        },
        showMenuModal: (state) => {
            state.isShowMenuModal = true;
        },
        hideMenuModal: (state) => {
            state.isShowMenuModal = false;
        },
        initDate: (state) => {
            state.initDate = new Date();
        },
    },
});
_a = exports.slice.actions, exports.showMask = _a.showMask, exports.hideMask = _a.hideMask, exports.fetchHeaderInfo = _a.fetchHeaderInfo, exports.fetchHeaderInfoSuccess = _a.fetchHeaderInfoSuccess, exports.updateHeaderInfoDate = _a.updateHeaderInfoDate, exports.updateHeaderInfoTerminalUtcDate = _a.updateHeaderInfoTerminalUtcDate, exports.fetchHeaderInfoFailure = _a.fetchHeaderInfoFailure, exports.fetchHeaderInfoClear = _a.fetchHeaderInfoClear, exports.fetchHeaderInfoFromPushSuccess = _a.fetchHeaderInfoFromPushSuccess, exports.fetchUpdateAirportRemarks = _a.fetchUpdateAirportRemarks, exports.fetchUpdateAirportRemarksSuccess = _a.fetchUpdateAirportRemarksSuccess, exports.fetchUpdateAirportRemarksFailure = _a.fetchUpdateAirportRemarksFailure, exports.setAirportRemarks = _a.setAirportRemarks, exports.addNotificationMessagesSuccess = _a.addNotificationMessagesSuccess, exports.addNotificationMessagesFailure = _a.addNotificationMessagesFailure, exports.setBadgeNumber = _a.setBadgeNumber, exports.forceGoToError = _a.forceGoToError, exports.forceGoTo = _a.forceGoTo, exports.screenTransitionError = _a.screenTransitionError, exports.showMenuModal = _a.showMenuModal, exports.hideMenuModal = _a.hideMenuModal, exports.initDate = _a.initDate;
exports.default = exports.slice.reducer;
//# sourceMappingURL=common.js.map