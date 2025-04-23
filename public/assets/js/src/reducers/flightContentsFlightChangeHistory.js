"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFlightChangeHistory = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const flightModals_1 = require("./flightModals");
const flightContents_1 = require("./flightContents");
exports.fetchFlightChangeHistory = (0, toolkit_1.createAsyncThunk)("flightContentsFlightChangeHistory/fetchFlightChangeHistory", async (arg, thunkAPI) => {
    const { flightKey, isReload } = arg;
    const { dispatch, getState } = thunkAPI;
    const { master } = getState().account;
    const params = {
        orgDateLcl: flightKey.orgDateLcl,
        alCd: flightKey.alCd,
        fltNo: flightKey.fltNo,
        casFltNo: flightKey.casFltNo || "",
        skdDepApoCd: flightKey.skdDepApoCd,
        skdArrApoCd: flightKey.skdArrApoCd,
        skdLegSno: flightKey.skdLegSno,
        oalTblFlg: flightKey.oalTblFlg,
        onlineDbExpDays: flightKey.oalTblFlg ? master.oalOnlineDbExpDays : master.onlineDbExpDays,
    };
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    try {
        const response = await webApi_1.WebApi.getFlightHistory(dispatch, params);
        dispatch((0, flightContents_1.applyFlightChangeHistory)({ flightKey, flightChangeHistory: response.data }));
    }
    catch (err) {
        if (!isReload) {
            // 便詳細履歴画面表示に失敗した場合、便詳細履歴画面を閉じる
            dispatch((0, flightModals_1.closeFlightModalAction)({ identifier }));
            dispatch((0, flightContents_1.removeFlightContent)({ identifier }));
        }
        dispatch((0, flightContents_1.failureFetching)({ identifier }));
    }
});
//# sourceMappingURL=flightContentsFlightChangeHistory.js.map