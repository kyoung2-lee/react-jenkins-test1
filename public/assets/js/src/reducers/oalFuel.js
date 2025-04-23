"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeOalFuel = exports.slice = exports.updateOalFuel = exports.openOalFuelModal = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
exports.openOalFuelModal = (0, toolkit_1.createAsyncThunk)("oalFuel/openOalFuelModal", async (arg, thunkAPI) => {
    const flightKey = arg;
    const { dispatch, getState } = thunkAPI;
    const onlineDbExpDays = getState().account.master.oalOnlineDbExpDays;
    dispatch(exports.slice.actions.fetchOalFuel({ flightKey }));
    try {
        const callbacks = {
            onNotFoundRecord: () => dispatch((0, exports.closeOalFuel)()),
            onConflict: () => dispatch((0, exports.closeOalFuel)()),
        };
        const response = await webApi_1.WebApi.getOalFuel(dispatch, { ...flightKey, onlineDbExpDays }, callbacks);
        dispatch(exports.slice.actions.fetchOalFuelSuccess({ data: response.data }));
        return;
    }
    catch (error) {
        const statusCode = error instanceof webApi_1.ApiError && error.response ? error.response.status : null;
        dispatch(exports.slice.actions.fetchOalFuelFailure());
        if (statusCode !== 404 && statusCode !== 409) {
            // 404, 409は、メッセージのボタンで閉じるため対象外
            dispatch((0, exports.closeOalFuel)());
        }
    }
});
function makeUpdateParams(flightKey, formValue) {
    return {
        ...flightKey,
        rampFuelWt: formValue.rampFuelWt ? Number(formValue.rampFuelWt) : null,
        rampFuelCat: formValue.rampFuelCat,
    };
}
exports.updateOalFuel = (0, toolkit_1.createAsyncThunk)("oalFuel/updateOalFuel", async (arg, thunkAPI) => {
    const formValue = arg;
    const { dispatch, getState } = thunkAPI;
    const { flightKey } = getState().oalFuel;
    if (!flightKey)
        return;
    try {
        const callbacks = {
            onNotFoundRecord: () => dispatch((0, exports.closeOalFuel)()),
        };
        await webApi_1.WebApi.postOalFuel(dispatch, makeUpdateParams(flightKey, formValue), callbacks);
        dispatch((0, exports.closeOalFuel)());
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
    rampFuelWt: "",
    rampFuelCat: "",
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "oalFuel",
    initialState,
    reducers: {
        closeOalFuel: (_state) => initialState,
        fetchOalFuel: (state, action) => {
            state.isOpen = true;
            state.flightKey = action.payload.flightKey;
            state.fetching = true;
            state.rampFuelWt = "";
            state.rampFuelCat = "";
        },
        fetchOalFuelSuccess: (state, action) => {
            state.fetching = false;
            state.flightDetailHeader = action.payload.data.flightDetailHeader;
            state.rampFuelWt =
                action.payload.data.rampFuelWt || action.payload.data.rampFuelWt === 0 ? action.payload.data.rampFuelWt.toString() : "";
            state.rampFuelCat = action.payload.data.rampFuelCat;
        },
        fetchOalFuelFailure: (state) => {
            state.fetching = false;
            state.flightDetailHeader = null;
            state.rampFuelWt = "";
            state.rampFuelCat = "";
        },
    },
});
exports.closeOalFuel = exports.slice.actions.closeOalFuel;
exports.default = exports.slice.reducer;
//# sourceMappingURL=oalFuel.js.map