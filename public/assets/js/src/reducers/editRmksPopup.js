"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFlightRmksFailure = exports.updateFlightRmksSuccess = exports.fetchRmksFailure = exports.fetchRmksSuccess = exports.fetchRmks = exports.closeEditRmksPopup = exports.slice = exports.showConfirmation = exports.showNotificationNoChange = exports.updateFlightRmks = exports.openEditRmksPopup = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const webApi_1 = require("../lib/webApi");
exports.openEditRmksPopup = (0, toolkit_1.createAsyncThunk)("editRmksPopup/openEditrmksPopup", async (arg, thunkAPI) => {
    const { flightDetailKey, mode, position } = arg;
    const { dispatch, getState } = thunkAPI;
    const onlineDbExpDays = flightDetailKey.oalTblFlg
        ? getState().account.master.oalOnlineDbExpDays
        : getState().account.master.onlineDbExpDays;
    const params = {
        myApoCd: flightDetailKey.myApoCd,
        orgDateLcl: flightDetailKey.orgDateLcl,
        alCd: flightDetailKey.alCd,
        fltNo: flightDetailKey.fltNo,
        casFltNo: flightDetailKey.casFltNo || "",
        skdDepApoCd: flightDetailKey.skdDepApoCd,
        skdArrApoCd: flightDetailKey.skdArrApoCd,
        skdLegSno: flightDetailKey.skdLegSno,
        oalTblFlg: flightDetailKey.oalTblFlg,
        onlineDbExpDays,
    };
    dispatch((0, exports.fetchRmks)({ mode, position }));
    try {
        // 便リマークスは、便詳細APIで取得している
        const response = await webApi_1.WebApi.getFlightDetail(dispatch, params);
        dispatch((0, exports.fetchRmksSuccess)({ response: response.data, params, mode, position }));
    }
    catch (err) {
        dispatch((0, exports.fetchRmksFailure)({ error: err }));
    }
});
exports.updateFlightRmks = (0, toolkit_1.createAsyncThunk)("editRmksPopup/updateFlightRmks", async (arg, thunkAPI) => {
    const params = arg;
    const { dispatch } = thunkAPI;
    try {
        const callbacks = {
            onNotFoundRecord: () => dispatch((0, exports.closeEditRmksPopup)()),
        };
        const response = await webApi_1.WebApi.postFlightRemarks(dispatch, params, callbacks);
        dispatch((0, exports.updateFlightRmksSuccess)({ response: response.data, params }));
        dispatch((0, exports.closeEditRmksPopup)());
    }
    catch (err) {
        dispatch((0, exports.updateFlightRmksFailure)({ error: err }));
    }
});
exports.showNotificationNoChange = (0, toolkit_1.createAsyncThunk)("editRmksPopup/showNotificationNoChange", (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    return notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40002C({}) });
});
exports.showConfirmation = (0, toolkit_1.createAsyncThunk)("editRmksPopup/showConfirmation", (arg, thunkAPI) => {
    const { onClickYes } = arg;
    const { dispatch } = thunkAPI;
    return notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: onClickYes }) });
});
const initialState = {
    key: null,
    isOpen: false,
    mode: "DEP",
    position: {
        width: 0,
        top: 0,
        left: 0,
    },
    rmksText: "",
    orgDateLcl: "",
    alCd: "",
    fltNo: "",
    casFltNo: "",
    lstDepApoCd: "",
    lstArrApoCd: "",
    placeholder: "",
    isEnabled: true,
    isFetching: false,
    isError: false,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "editRmksPopup",
    initialState,
    reducers: {
        closeEditRmksPopup: (state) => {
            Object.assign(state, initialState);
        },
        fetchRmks: (state, action) => {
            const { mode, position } = action.payload;
            state.isOpen = true; // ここでOPENしないと、なぜかiPadはTextにカーソルが当たらない
            state.mode = mode;
            state.position = position;
            state.isFetching = true;
        },
        fetchRmksSuccess: (state, action) => {
            const { response, params, mode, position } = action.payload;
            const apoCd = mode === "DEP" ? response.dep.lstDepApoCd : response.arr.lstArrApoCd;
            state.key = params;
            state.isOpen = true;
            state.mode = mode;
            state.position = position;
            state.rmksText = mode === "DEP" ? response.dep.depRmksText : response.arr.arrRmksText;
            state.orgDateLcl = response.flight.orgDateLcl;
            state.alCd = response.flight.alCd;
            state.fltNo = response.flight.fltNo;
            state.casFltNo = response.flight.casFltNo;
            state.lstDepApoCd = response.dep.lstDepApoCd;
            state.lstArrApoCd = response.arr.lstArrApoCd;
            state.placeholder = mode === "DEP" ? "DEP Flight Remarks" : "ARR Flight Remarks";
            state.isEnabled = (response.connectDbCat === "O" && params.myApoCd === apoCd) || false;
            state.isFetching = false;
            state.isError = false;
        },
        fetchRmksFailure: (state, _action) => {
            Object.assign(state, initialState);
        },
        updateFlightRmksSuccess: (state, _action) => {
            state.isError = false;
        },
        updateFlightRmksFailure: (_state, _action) => { },
    },
});
_a = exports.slice.actions, exports.closeEditRmksPopup = _a.closeEditRmksPopup, exports.fetchRmks = _a.fetchRmks, exports.fetchRmksSuccess = _a.fetchRmksSuccess, exports.fetchRmksFailure = _a.fetchRmksFailure, exports.updateFlightRmksSuccess = _a.updateFlightRmksSuccess, exports.updateFlightRmksFailure = _a.updateFlightRmksFailure;
exports.default = exports.slice.reducer;
//# sourceMappingURL=editRmksPopup.js.map