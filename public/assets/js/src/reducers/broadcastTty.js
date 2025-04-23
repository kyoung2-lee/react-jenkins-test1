"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeTtyAddressDetailModal = exports.openTtyAddressDetailModal = exports.slice = exports.sendTty = exports.updateTtyTemplate = exports.storeTtyTemplate = exports.fetchTtyTemplate = void 0;
/* tslint:disable:no-console */
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const commonUtil_1 = require("../lib/commonUtil");
const initialState = {
    fetching: false,
    template: {},
    isOpenTtyAddressDetailModal: false,
    sending: false,
    updatingTemplate: false,
    creatingTemplate: false,
};
exports.fetchTtyTemplate = (0, toolkit_1.createAsyncThunk)("broadcastTty/fetchTtyTemplate", async (arg, thunkAPI) => {
    const { templateId } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestFetchTemplate());
    try {
        const response = await webApi_1.WebApi.getBroadcastTtyTemplate(dispatch, { templateId });
        const { data } = response;
        dispatch(exports.slice.actions.successFetchTemplate({ data }));
        const { ...rest } = response.data;
        return rest;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureFetchTemplate());
        return null;
    }
});
exports.storeTtyTemplate = (0, toolkit_1.createAsyncThunk)("broadcastTty/storeTtyTemplate", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestStoreTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastTtyTemplate(dispatch, arg);
        dispatch(exports.slice.actions.successStoreTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureStoreTemplate());
        return null;
    }
});
exports.updateTtyTemplate = (0, toolkit_1.createAsyncThunk)("broadcastTty/updateTtyTemplate", async (arg, thunkAPI) => {
    const { params, callbacks } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestUpdateTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastTtyTemplateUpdate(dispatch, params, callbacks);
        dispatch(exports.slice.actions.successUpdateTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureUpdateTemplate());
        return null;
    }
});
exports.sendTty = (0, toolkit_1.createAsyncThunk)("broadcastTty/sendTty", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestSend());
    try {
        const response = await webApi_1.WebApi.postBroadcastTty(dispatch, arg);
        dispatch(exports.slice.actions.successSend());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureSend());
        return null;
    }
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "broadcastTty",
    initialState,
    reducers: {
        openTtyAddressDetailModal: (state) => {
            state.isOpenTtyAddressDetailModal = true;
        },
        closeTtyAddressDetailModal: (state) => {
            state.isOpenTtyAddressDetailModal = false;
        },
        requestFetchTemplate: (state) => {
            state.fetching = true;
        },
        successFetchTemplate: (state, action) => {
            const { ...rest } = action.payload.data;
            state.template = {
                ...rest,
                // DB上のTTY_TEXTの保存は、CRLF形式であることへの対応
                ttyText: (0, commonUtil_1.convertCRLFCodeToLineFeed)(action.payload.data.ttyText),
            };
            state.fetching = false;
        },
        failureFetchTemplate: (state) => {
            state.template = {};
            state.fetching = false;
        },
        requestStoreTemplate: (state) => {
            state.creatingTemplate = true;
        },
        successStoreTemplate: (state) => {
            state.creatingTemplate = false;
        },
        failureStoreTemplate: (state) => {
            state.creatingTemplate = false;
        },
        requestUpdateTemplate: (state) => {
            state.updatingTemplate = true;
        },
        successUpdateTemplate: (state) => {
            state.updatingTemplate = false;
        },
        failureUpdateTemplate: (state) => {
            state.updatingTemplate = false;
        },
        requestSend: (state) => {
            state.sending = true;
        },
        successSend: (state) => {
            state.sending = false;
        },
        failureSend: (state) => {
            state.sending = false;
        },
    },
});
_a = exports.slice.actions, exports.openTtyAddressDetailModal = _a.openTtyAddressDetailModal, exports.closeTtyAddressDetailModal = _a.closeTtyAddressDetailModal;
exports.default = exports.slice.reducer;
//# sourceMappingURL=broadcastTty.js.map