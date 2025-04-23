"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showConfirmation = exports.updateFlightRmks = exports.showNotificationFlightRmksNoChange = exports.fetchFlightDetail = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const webApi_1 = require("../lib/webApi");
const flightModals_1 = require("./flightModals");
const flightContents_1 = require("./flightContents");
exports.fetchFlightDetail = (0, toolkit_1.createAsyncThunk)("flightContentsFlightDetail/fetchFlightDetail", async (arg, thunkAPI) => {
    const { flightKey, isReload, openRmksPopup, closeRmksPopup, messages } = arg;
    const { dispatch, getState } = thunkAPI;
    const onlineDbExpDays = flightKey.oalTblFlg ? getState().account.master.oalOnlineDbExpDays : getState().account.master.onlineDbExpDays;
    const params = {
        ...flightKey,
        casFltNo: flightKey.casFltNo || "",
        onlineDbExpDays,
    };
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    try {
        const response = await webApi_1.WebApi.getFlightDetail(dispatch, params, messages);
        dispatch((0, flightContents_1.applyFlightDetail)({ flightKey: params, flightDetail: response.data }));
        if (openRmksPopup) {
            openRmksPopup();
        }
    }
    catch (err) {
        if (err instanceof webApi_1.ApiError && err.response) {
            const statusCode = err.response.status;
            if (!isReload) {
                // 便詳細表示に失敗した場合、便詳細を閉じる
                dispatch((0, flightModals_1.closeFlightModalAction)({ identifier }));
                dispatch((0, flightContents_1.removeFlightContent)({ identifier }));
            }
            else if (closeRmksPopup &&
                statusCode !== 400 && // 強制画面しない場合のみ
                statusCode !== 401 &&
                statusCode !== 403 &&
                statusCode !== 404 &&
                statusCode !== 405) {
                // 便詳リマークス表示時、便詳細表示に失敗した場合、便リマークスポップアップを閉じる
                closeRmksPopup();
            }
            dispatch((0, flightContents_1.failureFetching)({ identifier }));
        }
    }
});
exports.showNotificationFlightRmksNoChange = (0, toolkit_1.createAsyncThunk)("flightContentsFlightDetail/showNotificationFlightRmksNoChange", (_, { dispatch }) => {
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40002C({}) });
});
exports.updateFlightRmks = (0, toolkit_1.createAsyncThunk)("flightContentsFlightDetail/updateFlightRmks", async (arg, thunkAPI) => {
    const { flightKey, rmksTypeCd, rmksText, closeRmksPopup } = arg;
    const { dispatch } = thunkAPI;
    const params = {
        orgDateLcl: flightKey.orgDateLcl,
        alCd: flightKey.alCd,
        fltNo: flightKey.fltNo,
        casFltNo: flightKey.casFltNo || "",
        skdDepApoCd: flightKey.skdDepApoCd,
        skdArrApoCd: flightKey.skdArrApoCd,
        skdLegSno: flightKey.skdLegSno,
        oalTblFlg: flightKey.oalTblFlg,
        rmksTypeCd,
        rmksText,
    };
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    try {
        const response = await webApi_1.WebApi.postFlightRemarks(dispatch, params);
        dispatch((0, flightContents_1.applyFlightRmks)({ identifier, response: response.data, params }));
        closeRmksPopup();
    }
    catch (err) {
        dispatch((0, flightContents_1.failureFetching)({ identifier }));
    }
});
exports.showConfirmation = (0, toolkit_1.createAsyncThunk)("flightContentsFlightDetail/showConfirmation", ({ onClickYes }, { dispatch }) => {
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: onClickYes }) });
});
//# sourceMappingURL=flightContentsFlightDetail.js.map