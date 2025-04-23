"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slice = exports.sendAftn = exports.updateAftnTemplate = exports.storeAftnTemplate = exports.fetchAftnTemplate = void 0;
/* tslint:disable:no-console */
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const commonUtil_1 = require("../lib/commonUtil");
const initialState = {
    fetching: false,
    template: {},
    isOpenAftnAddressDetailModal: false,
    sending: false,
    updatingTemplate: false,
    creatingTemplate: false,
};
exports.fetchAftnTemplate = (0, toolkit_1.createAsyncThunk)("broadcastAftn/fetchAftnTemplate", async (arg, thunkAPI) => {
    const { templateId } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestFetchTemplate());
    try {
        const response = await webApi_1.WebApi.getBroadcastAftnTemplate(dispatch, { templateId });
        const { data } = response;
        dispatch(exports.slice.actions.successFetchTemplate({ data }));
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureFetchTemplate());
        return null;
    }
});
exports.storeAftnTemplate = (0, toolkit_1.createAsyncThunk)("broadcastAftn/storeAftnTemplate", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestStoreTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastAftnTemplate(dispatch, arg);
        dispatch(exports.slice.actions.successStoreTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureStoreTemplate());
        return null;
    }
});
exports.updateAftnTemplate = (0, toolkit_1.createAsyncThunk)("broadcastAftn/updateAftnTemplate", async (arg, thunkAPI) => {
    const { params, callbacks } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestUpdateTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastAftnTemplateUpdate(dispatch, params, callbacks);
        dispatch(exports.slice.actions.successUpdateTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureUpdateTemplate());
        return null;
    }
});
exports.sendAftn = (0, toolkit_1.createAsyncThunk)("broadcastAftn/sendAftn", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestSend());
    try {
        await webApi_1.WebApi.postBroadcastAftn(dispatch, arg, false);
    }
    catch (error) {
        dispatch(exports.slice.actions.failureSend());
        return;
    }
    try {
        const ttyArg = {
            ttyAddrList: [arg.originator],
            ttyPriorityCd: arg.priority,
            orgnTtyAddr: arg.originator,
            ttyText: arg.aftnText,
            templateId: null,
        };
        await webApi_1.WebApi.postBroadcastTty(dispatch, ttyArg, true, false);
        dispatch(exports.slice.actions.successSend());
    }
    catch (error) {
        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40024C({}) });
        dispatch(exports.slice.actions.failureSend());
    }
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "broadcastAftn",
    initialState,
    reducers: {
        openAddressDetailModal: (state) => {
            state.isOpenAftnAddressDetailModal = true;
        },
        closeAddressDetailModal: (state) => {
            state.isOpenAftnAddressDetailModal = false;
        },
        requestFetchTemplate: (state) => {
            state.fetching = true;
        },
        successFetchTemplate: (state, action) => {
            state.fetching = false;
            state.template = {
                ...action.payload.data,
                // DB上のAFTN_TEXTの保存は、CRLF形式であることへの対応
                aftnText: (0, commonUtil_1.convertCRLFCodeToLineFeed)(action.payload.data.aftnText),
            };
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
exports.default = exports.slice.reducer;
//# sourceMappingURL=broadcastAftn.js.map