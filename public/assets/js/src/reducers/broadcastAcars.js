"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slice = exports.sendAcars = exports.updateAcarsTemplate = exports.storeAcarsTemplate = exports.fetchAcarsTemplate = void 0;
/* tslint:disable:no-console */
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const commonUtil_1 = require("../lib/commonUtil");
const initialState = {
    fetching: false,
    template: {},
    creatingTemplate: false,
    updatingTemplate: false,
    sending: false,
};
exports.fetchAcarsTemplate = (0, toolkit_1.createAsyncThunk)("broadcastAcars/fetchAcarsTemplate", async (arg, thunkAPI) => {
    const { templateId } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestFetchTemplate());
    try {
        const response = await webApi_1.WebApi.getBroadcastAcarsTemplate(dispatch, { templateId });
        const { data } = response;
        dispatch(exports.slice.actions.successFetchTemplate({ data }));
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureFetchTemplate());
        return null;
    }
});
exports.storeAcarsTemplate = (0, toolkit_1.createAsyncThunk)("broadcastAcars/storeAcarsTemplate", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestStoreTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastAcarsTemplate(dispatch, arg);
        dispatch(exports.slice.actions.successStoreTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureStoreTemplate());
        return null;
    }
});
exports.updateAcarsTemplate = (0, toolkit_1.createAsyncThunk)("broadcastAcars/updateAcarsTemplate", async (arg, thunkAPI) => {
    const { params, callbacks } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestUpdateTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastAcarsTemplateUpdate(dispatch, params, callbacks);
        dispatch(exports.slice.actions.successUpdateTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureUpdateTemplate());
        return null;
    }
});
exports.sendAcars = (0, toolkit_1.createAsyncThunk)("broadcastAcars/sendAcars", async (arg, thunkAPI) => {
    const params = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestSend());
    try {
        await webApi_1.WebApi.postBroadcastAcars(dispatch, params);
        dispatch(exports.slice.actions.successSend());
    }
    catch (error) {
        dispatch(exports.slice.actions.failureSend());
    }
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "broadcastAcars",
    initialState,
    reducers: {
        requestFetchTemplate: (state) => {
            state.fetching = true;
        },
        successFetchTemplate: (state, action) => {
            state.fetching = false;
            state.template = {
                ...action.payload.data,
                // DB上のUPLINK_TEXTの保存は、CRLF形式であることへの対応
                uplinkText: (0, commonUtil_1.convertCRLFCodeToLineFeed)(action.payload.data.uplinkText),
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
//# sourceMappingURL=broadcastAcars.js.map