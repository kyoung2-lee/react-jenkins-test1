"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeOalPaxStatusModal = exports.slice = exports.updateOalPaxStatus = exports.openOalPaxStatusModal = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
exports.openOalPaxStatusModal = (0, toolkit_1.createAsyncThunk)("oalPaxStatus/openOalPaxStatusModal", async (arg, thunkAPI) => {
    const { forcusInputName, flightKey } = arg;
    const { dispatch, getState } = thunkAPI;
    const onlineDbExpDays = getState().account.master.oalOnlineDbExpDays;
    dispatch(exports.slice.actions.fetchOalPaxStatus({ forcusInputName, flightKey: { ...flightKey, onlineDbExpDays } }));
    try {
        const callbacks = {
            onNotFoundRecord: () => dispatch((0, exports.closeOalPaxStatusModal)()),
            onConflict: () => dispatch((0, exports.closeOalPaxStatusModal)()),
        };
        const response = await webApi_1.WebApi.getOalPaxStatus(dispatch, { ...flightKey, onlineDbExpDays }, callbacks);
        dispatch(exports.slice.actions.fetchOalPaxStatusSuccess(response.data));
        return;
    }
    catch (error) {
        const statusCode = error instanceof webApi_1.ApiError && error.response ? error.response.status : null;
        dispatch(exports.slice.actions.fetchOalPaxStatusFailure());
        if (statusCode !== 404 && statusCode !== 409) {
            // 404, 409は、メッセージのボタンで閉じるため対象外
            dispatch((0, exports.closeOalPaxStatusModal)());
        }
    }
});
exports.updateOalPaxStatus = (0, toolkit_1.createAsyncThunk)("oalPaxStatus/updateOalPaxStatus", async (arg, thunkAPI) => {
    const formValue = arg;
    const { dispatch, getState } = thunkAPI;
    const { flightKey } = getState().oalPaxStatus;
    if (!flightKey)
        return;
    try {
        const callbacks = {
            onNotFoundRecord: () => dispatch((0, exports.closeOalPaxStatusModal)()),
        };
        await webApi_1.WebApi.postOalPaxStatus(dispatch, { ...flightKey, ...formValue }, callbacks);
        dispatch((0, exports.closeOalPaxStatusModal)());
    }
    catch (error) {
        // 何もしない
    }
});
const initialState = {
    isOpen: false,
    forcusInputName: null,
    flightKey: null,
    fetching: false,
    flightDetailHeader: null,
    acceptanceSts: null,
    boardingSts: null,
    depGateNo: null,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "oalPaxStatus",
    initialState,
    reducers: {
        closeOalPaxStatusModal: (state) => {
            state.isOpen = false;
            state.forcusInputName = null;
            state.flightKey = null;
            state.flightDetailHeader = null;
            state.acceptanceSts = null;
            state.boardingSts = null;
            state.depGateNo = null;
        },
        fetchOalPaxStatus: (state, action) => {
            const { forcusInputName, flightKey } = action.payload;
            state.isOpen = true;
            state.fetching = true;
            state.forcusInputName = forcusInputName;
            state.flightKey = flightKey;
        },
        fetchOalPaxStatusSuccess: (state, action) => {
            const { flightDetailHeader, acceptanceSts, boardingSts, depGateNo } = action.payload;
            state.fetching = false;
            state.flightDetailHeader = flightDetailHeader;
            state.acceptanceSts = acceptanceSts;
            state.boardingSts = boardingSts;
            state.depGateNo = depGateNo;
        },
        fetchOalPaxStatusFailure: (state) => {
            state.fetching = false;
            state.flightDetailHeader = null;
            state.acceptanceSts = null;
            state.boardingSts = null;
            state.depGateNo = null;
        },
    },
});
exports.closeOalPaxStatusModal = exports.slice.actions.closeOalPaxStatusModal;
exports.default = exports.slice.reducer;
//# sourceMappingURL=oalPaxStatus.js.map