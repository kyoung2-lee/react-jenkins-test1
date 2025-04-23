"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStationOperationTask = exports.fetchStationOperationTask = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const flightModals_1 = require("./flightModals");
const flightContents_1 = require("./flightContents");
exports.fetchStationOperationTask = (0, toolkit_1.createAsyncThunk)("flightContentsStationOperationTask/fetchStationOperationTask", async (arg, thunkAPI) => {
    const { flightKey, isReload } = arg;
    const { dispatch, getState } = thunkAPI;
    const onlineDbExpDays = flightKey.oalTblFlg ? getState().account.master.oalOnlineDbExpDays : getState().account.master.onlineDbExpDays;
    const params = {
        orgDateLcl: flightKey.orgDateLcl,
        alCd: flightKey.alCd,
        fltNo: flightKey.fltNo,
        casFltNo: flightKey.casFltNo || "",
        skdDepApoCd: flightKey.skdDepApoCd,
        skdArrApoCd: flightKey.skdArrApoCd,
        skdLegSno: flightKey.skdLegSno,
        oalTblFlg: flightKey.oalTblFlg,
        onlineDbExpDays,
    };
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    try {
        const response = await webApi_1.WebApi.getWorkStep(dispatch, params);
        dispatch((0, flightContents_1.applyStationOperationTask)({ flightKey, stationOperationTask: response.data }));
    }
    catch (err) {
        if (!isReload) {
            // 発着工程表示に失敗した場合、発着工程表示を閉じる
            dispatch((0, flightModals_1.closeFlightModalAction)({ identifier }));
            dispatch((0, flightContents_1.removeFlightContent)({ identifier }));
        }
        dispatch((0, flightContents_1.failureFetching)({ identifier }));
    }
});
exports.updateStationOperationTask = (0, toolkit_1.createAsyncThunk)("flightContentsStationOperationTask/updateStationOperationTask", async (arg, thunkAPI) => {
    const { flightKey, postStationOperationTask } = arg;
    const { dispatch } = thunkAPI;
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    try {
        const response = await webApi_1.WebApi.postWorkStep(dispatch, postStationOperationTask);
        dispatch((0, flightContents_1.applyStationOperationTask)({ flightKey, stationOperationTask: response.data }));
    }
    catch (err) {
        const error = err;
        if (error && error.response && error.response.status === 591) {
            // 591の場合は、SOALA内部の更新は正常に行えているため画面の表示更新を行う
            dispatch((0, flightContents_1.applyStationOperationTask)({ flightKey, stationOperationTask: error.response.data }));
        }
        else {
            dispatch((0, flightContents_1.failureFetching)({ identifier }));
        }
    }
});
//# sourceMappingURL=flightContentsStationOperationTask.js.map