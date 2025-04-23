"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeMailAddressDetailModal = exports.openMailAddressDetailModal = exports.slice = exports.sendEmail = exports.updateEmailTemplate = exports.storeEmailTemplate = exports.fetchEmailTemplate = void 0;
/* tslint:disable:no-console */
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const initialState = {
    fetching: false,
    template: {},
    isOpenMailAddressDetailModal: false,
    creatingTemplate: false,
    updatingTemplate: false,
    sending: false,
};
exports.fetchEmailTemplate = (0, toolkit_1.createAsyncThunk)("broadcastEmail/fetchEmailTemplate", async (arg, thunkAPI) => {
    const { templateId } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestFetchTemplate());
    try {
        const response = await webApi_1.WebApi.getBroadcastEmailTemplate(dispatch, { templateId });
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
exports.storeEmailTemplate = (0, toolkit_1.createAsyncThunk)("broadcastEmail/storeEmailTemplate", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestStoreTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastEmailTemplate(dispatch, arg);
        dispatch(exports.slice.actions.successStoreTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureStoreTemplate());
        return null;
    }
});
exports.updateEmailTemplate = (0, toolkit_1.createAsyncThunk)("broadcastEmail/updateEmailTemplate", async (arg, thunkAPI) => {
    const { params, callbacks } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestUpdateTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastEmailTemplateUpdate(dispatch, params, callbacks);
        dispatch(exports.slice.actions.successUpdateTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureUpdateTemplate());
        return null;
    }
});
exports.sendEmail = (0, toolkit_1.createAsyncThunk)("broadcastEmail/sendEmail", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestSend());
    try {
        const response = await webApi_1.WebApi.postBroadcastEmail(dispatch, arg);
        dispatch(exports.slice.actions.successSend());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureSend());
        return null;
    }
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "broadcastEmail",
    initialState,
    reducers: {
        openMailAddressDetailModal: (state) => {
            state.isOpenMailAddressDetailModal = true;
        },
        closeMailAddressDetailModal: (state) => {
            state.isOpenMailAddressDetailModal = false;
        },
        requestFetchTemplate: (state) => {
            state.fetching = true;
        },
        successFetchTemplate: (state, action) => {
            const { ...rest } = action.payload.data;
            state.template = rest;
            state.fetching = false;
        },
        failureFetchTemplate: (state) => {
            state.template = {};
            state.fetching = false;
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
    },
});
_a = exports.slice.actions, exports.openMailAddressDetailModal = _a.openMailAddressDetailModal, exports.closeMailAddressDetailModal = _a.closeMailAddressDetailModal;
exports.default = exports.slice.reducer;
//# sourceMappingURL=broadcastEmail.js.map