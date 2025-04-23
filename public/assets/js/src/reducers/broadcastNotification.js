"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeNotificationAddressDetailModal = exports.openNotificationAddressDetailModal = exports.slice = exports.sendNotification = exports.updateNotificationTemplate = exports.storeNotificationTemplate = exports.fetchNotificationTemplate = void 0;
/* tslint:disable:no-console */
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const commonUtil_1 = require("../lib/commonUtil");
const initialState = {
    fetching: false,
    template: {},
    isOpenNotificationAddressDetailModal: false,
    notificationAddressDetail: [],
    creatingTemplate: false,
    updatingTemplate: false,
    sending: false,
};
exports.fetchNotificationTemplate = (0, toolkit_1.createAsyncThunk)("broadcastNotification/fetchNotificationTemplate", async (arg, thunkAPI) => {
    const { templateId, templateJobId, userJobId } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestFetchTemplate());
    try {
        if (templateJobId === null) {
            throw Error("invalid templateJobId");
        }
        if (userJobId === null) {
            throw Error("invalid userJobId");
        }
        const response = await webApi_1.WebApi.getBroadcastNtfTemplate(dispatch, { templateId });
        const { data } = response;
        data.jobIdList = (0, commonUtil_1.arrangeTemplatesJobIdList)(data.jobIdList, userJobId, templateJobId);
        dispatch(exports.slice.actions.successFetchTemplate({ data }));
        const { ...rest } = response.data;
        return rest;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureFetchTemplate());
        return null;
    }
});
exports.storeNotificationTemplate = (0, toolkit_1.createAsyncThunk)("broadcastNotification/storeNotificationTemplate", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestStoreTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastNtfTemplate(dispatch, arg);
        dispatch(exports.slice.actions.successStoreTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureStoreTemplate());
        return null;
    }
});
exports.updateNotificationTemplate = (0, toolkit_1.createAsyncThunk)("broadcastNotification/updateNotificationTemplate", async (arg, thunkAPI) => {
    const { params, callbacks } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestUpdateTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastNtfTemplateUpdate(dispatch, params, callbacks);
        dispatch(exports.slice.actions.successUpdateTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureUpdateTemplate());
        return null;
    }
});
exports.sendNotification = (0, toolkit_1.createAsyncThunk)("broadcastNotification/sendNotification", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestSend());
    try {
        const response = await webApi_1.WebApi.postBroadcastNtf(dispatch, arg);
        dispatch(exports.slice.actions.successSend());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureSend());
        return null;
    }
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "broadcastNotification",
    initialState,
    reducers: {
        openNotificationAddressDetailModal: (state) => {
            state.isOpenNotificationAddressDetailModal = true;
        },
        closeNotificationAddressDetailModal: (state) => {
            state.isOpenNotificationAddressDetailModal = false;
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
_a = exports.slice.actions, exports.openNotificationAddressDetailModal = _a.openNotificationAddressDetailModal, exports.closeNotificationAddressDetailModal = _a.closeNotificationAddressDetailModal;
exports.default = exports.slice.reducer;
//# sourceMappingURL=broadcastNotification.js.map