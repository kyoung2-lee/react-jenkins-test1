"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFlightSpecialCare = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const flightModals_1 = require("./flightModals");
const flightContents_1 = require("./flightContents");
exports.fetchFlightSpecialCare = (0, toolkit_1.createAsyncThunk)("flightContentsFlightSpecialCare/fetchFlightSpecialCare", async (arg, thunkAPI) => {
    const { flightKey, isReload } = arg;
    const { dispatch, getState } = thunkAPI;
    const { onlineDbExpDays } = getState().account.master;
    const params = {
        orgDateLcl: flightKey.orgDateLcl,
        alCd: flightKey.alCd,
        fltNo: flightKey.fltNo,
        skdDepApoCd: flightKey.skdDepApoCd,
        skdArrApoCd: flightKey.skdArrApoCd,
        skdLegSno: flightKey.skdLegSno,
        onlineDbExpDays,
    };
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    try {
        const response = await webApi_1.WebApi.getFlightSpecialCare(dispatch, params);
        dispatch((0, flightContents_1.applyFlightSpecialCare)({ flightKey, flightSpecialCare: response.data }));
    }
    catch (err) {
        if (!isReload) {
            // 便詳細SpecialCare画面表示に失敗した場合、便詳細SpecialCare画面を閉じる
            dispatch((0, flightModals_1.closeFlightModalAction)({ identifier }));
            dispatch((0, flightContents_1.removeFlightContent)({ identifier }));
        }
        dispatch((0, flightContents_1.failureFetching)({ identifier }));
    }
});
//# sourceMappingURL=flightContentsFlightSpecialCare.js.map