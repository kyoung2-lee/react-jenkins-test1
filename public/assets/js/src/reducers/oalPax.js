"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeOalPax = exports.slice = exports.updateOalPax = exports.openOalPaxModal = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
// Action Creator
exports.openOalPaxModal = (0, toolkit_1.createAsyncThunk)("oalPax/openOalPaxModal", async (arg, thunkAPI) => {
    const flightKey = arg;
    const { dispatch, getState } = thunkAPI;
    const { oalOnlineDbExpDays } = getState().account.master;
    dispatch(exports.slice.actions.fetchOalPax({ ...flightKey, onlineDbExpDays: oalOnlineDbExpDays }));
    try {
        const callbacks = {
            onNotFoundRecord: () => dispatch((0, exports.closeOalPax)()),
            onConflict: () => dispatch((0, exports.closeOalPax)()),
        };
        const response = await webApi_1.WebApi.getOalPax(dispatch, { ...flightKey, onlineDbExpDays: oalOnlineDbExpDays }, callbacks);
        dispatch(exports.slice.actions.fetchOalPaxSuccess(response.data));
    }
    catch (error) {
        const statusCode = error instanceof webApi_1.ApiError && error.response ? error.response.status : null;
        dispatch(exports.slice.actions.fetchOalPaxFailure());
        if (statusCode !== 404 && statusCode !== 409) {
            // 404, 409は、メッセージのボタンで閉じるため対象外
            dispatch((0, exports.closeOalPax)());
        }
    }
});
function makeUpdateParams(flightKey, formValue) {
    const { orgDateLcl, alCd, fltNo, casFltNo, skdDepApoCd, skdArrApoCd, skdLegSno } = flightKey;
    return {
        orgDateLcl,
        alCd,
        fltNo,
        casFltNo,
        skdDepApoCd,
        skdArrApoCd,
        skdLegSno,
        oalLegPaxList: [
            { dataCd: "Salable", paxClsCd: "F", cnt: formatCnt(formValue.salableFCnt) },
            { dataCd: "Salable", paxClsCd: "C", cnt: formatCnt(formValue.salableCCnt) },
            { dataCd: "Salable", paxClsCd: "W", cnt: formatCnt(formValue.salableWCnt) },
            { dataCd: "Salable", paxClsCd: "Y", cnt: formatCnt(formValue.salableYCnt) },
            { dataCd: "Booked", paxClsCd: "F", cnt: formatCnt(formValue.bookedFCnt) },
            { dataCd: "Booked", paxClsCd: "C", cnt: formatCnt(formValue.bookedCCnt) },
            { dataCd: "Booked", paxClsCd: "W", cnt: formatCnt(formValue.bookedWCnt) },
            { dataCd: "Booked", paxClsCd: "Y", cnt: formatCnt(formValue.bookedYCnt) },
            { dataCd: "Actual", paxClsCd: "F", cnt: formatCnt(formValue.actualFCnt) },
            { dataCd: "Actual", paxClsCd: "C", cnt: formatCnt(formValue.actualCCnt) },
            { dataCd: "Actual", paxClsCd: "W", cnt: formatCnt(formValue.actualWCnt) },
            { dataCd: "Actual", paxClsCd: "Y", cnt: formatCnt(formValue.actualYCnt) },
        ],
    };
}
function formatCnt(cnt) {
    return cnt ? Number(cnt) : null;
}
exports.updateOalPax = (0, toolkit_1.createAsyncThunk)("oalPax/updateOalPax", async (arg, thunkAPI) => {
    const formValue = arg;
    const { dispatch, getState } = thunkAPI;
    const { flightKey } = getState().oalPax;
    if (!flightKey)
        return;
    try {
        const callbacks = {
            onNotFoundRecord: () => dispatch((0, exports.closeOalPax)()),
        };
        await webApi_1.WebApi.postOalPax(dispatch, makeUpdateParams(flightKey, formValue), callbacks);
        dispatch((0, exports.closeOalPax)());
    }
    catch (error) {
        // 何もしない
    }
});
const initialState = {
    isOpen: false,
    flightKey: null,
    fetching: false,
    flightDetailHeader: null,
    oalPaxList: [],
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "oalPax",
    initialState,
    reducers: {
        closeOalPax: (state) => {
            Object.assign(state, initialState);
        },
        fetchOalPax: (state, action) => {
            state.isOpen = true;
            state.flightKey = action.payload;
            state.fetching = true;
        },
        fetchOalPaxSuccess: (state, action) => {
            state.fetching = false;
            state.flightDetailHeader = action.payload.flightDetailHeader;
            state.oalPaxList = action.payload.oalLegPaxList;
        },
        fetchOalPaxFailure: (state) => {
            state.fetching = false;
            state.flightDetailHeader = null;
            state.oalPaxList = [];
        },
    },
});
exports.closeOalPax = exports.slice.actions.closeOalPax;
exports.default = exports.slice.reducer;
//# sourceMappingURL=oalPax.js.map