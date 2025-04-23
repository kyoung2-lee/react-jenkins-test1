"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpotChangeMode = exports.resetFocusDupChart = exports.focusDupChart = exports.slice = exports.showMessage = exports.updateSpotRemarks = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const notifications_1 = require("../lib/notifications");
const initialState = {
    focusArrDepCtrlSeq: -1,
    isSpotChangeMode: false,
    isError: false,
};
exports.updateSpotRemarks = (0, toolkit_1.createAsyncThunk)("barChart/updateSpotRemarks", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
        const response = await webApi_1.WebApi.postSpotRemarks(dispatch, arg);
        dispatch(exports.slice.actions.fetchUpdateSpotRemarksSuccess(response));
        arg.closeSpotRemarksModal();
    }
    catch (error) {
        dispatch(exports.slice.actions.fetchUpdateSpotRemarksFailure({ error: error, retry: () => (0, exports.updateSpotRemarks)(arg) }));
    }
});
exports.showMessage = (0, toolkit_1.createAsyncThunk)("broadcast/showMessage", (message, { dispatch }) => {
    notifications_1.NotificationCreator.create({ dispatch, message });
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "barChart",
    initialState,
    reducers: {
        focusDupChart: (state, action) => {
            const { focusArrDepCtrlSeq } = action.payload;
            state.focusArrDepCtrlSeq = focusArrDepCtrlSeq;
        },
        resetFocusDupChart: (state) => {
            state.focusArrDepCtrlSeq = initialState.focusArrDepCtrlSeq;
        },
        updateSpotChangeMode: (state, action) => {
            state.isSpotChangeMode = action.payload;
        },
        fetchUpdateSpotRemarksSuccess: (state, _action) => {
            state.isError = false;
        },
        fetchUpdateSpotRemarksFailure: (state, _action) => {
            state.isError = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(exports.updateSpotRemarks.fulfilled, () => { });
    },
});
_a = exports.slice.actions, exports.focusDupChart = _a.focusDupChart, exports.resetFocusDupChart = _a.resetFocusDupChart, exports.updateSpotChangeMode = _a.updateSpotChangeMode;
exports.default = exports.slice.reducer;
//# sourceMappingURL=barChart.js.map