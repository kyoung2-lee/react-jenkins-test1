"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeBbAddressDetailModal = exports.openBbAddressDetailModal = exports.closeFlightLegSearchModal = exports.openFlightLegSearchModal = exports.disableFlight = exports.enableFlight = exports.slice = exports.sendBulletinBoard = exports.updateBulletinBoard = exports.updateBulletinBoardTemplate = exports.storeBulletinBoardTemplate = exports.fetchAllBulletinBoardFlightLeg = exports.fetchBulletinBoard = exports.fetchBulletinBoardTemplate = void 0;
/* tslint:disable:no-console */
const toolkit_1 = require("@reduxjs/toolkit");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const webApi_1 = require("../lib/webApi");
const commonUtil_1 = require("../lib/commonUtil");
const initialState = {
    fetching: false,
    isFlightLegEnabled: false,
    fetchingAllFlightLeg: false,
    isOpenFlightLegSearchModal: false,
    isOpenBbAddressDetailModal: false,
    template: {},
    flightLegs: [],
    fetchingBb: false,
    detail: {},
    sending: false,
    creatingTemplate: false,
    updating: false,
    updatingTemplate: false,
    newBbId: null,
};
exports.fetchBulletinBoardTemplate = (0, toolkit_1.createAsyncThunk)("broadcastBulletinBoard/fetchBulletinBoardTemplate", async (arg, thunkAPI) => {
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
        const response = await webApi_1.WebApi.getBroadcastBbTemplate(dispatch, { templateId });
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
exports.fetchBulletinBoard = (0, toolkit_1.createAsyncThunk)("broadcastBulletinBoard/fetchBulletinBoard", async (arg, thunkAPI) => {
    const { bbId, archiveFlg, callbacks } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestFetch());
    try {
        const params = {
            bbId,
            connectDbCat: (archiveFlg ? "P" : "O"),
        };
        const response = await webApi_1.WebApi.getBroadcastBb(dispatch, params, callbacks);
        const { data } = response;
        dispatch(exports.slice.actions.successFetch({ data }));
    }
    catch (error) {
        dispatch(exports.slice.actions.failureFetch());
    }
});
exports.fetchAllBulletinBoardFlightLeg = (0, toolkit_1.createAsyncThunk)("broadcastBulletinBoard/fetchAllBulletinBoardFlightLeg", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestFetchAllFlightLeg());
    try {
        const response = await webApi_1.WebApi.getBroadcastFlightLeg(dispatch, arg);
        const { data } = response;
        dispatch(exports.slice.actions.successFetchAllFlightLeg({ data }));
        if (response.data.flightLegList.length === 0) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30003C() });
        }
    }
    catch (error) {
        dispatch(exports.slice.actions.failureFetchAllFlightLeg());
    }
});
exports.storeBulletinBoardTemplate = (0, toolkit_1.createAsyncThunk)("broadcastBulletinBoard/storeBulletinBoardTemplate", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestStoreTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastBbTemplate(dispatch, arg);
        dispatch(exports.slice.actions.successStoreTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureStoreTemplate());
        return null;
    }
});
exports.updateBulletinBoardTemplate = (0, toolkit_1.createAsyncThunk)("broadcastBulletinBoard/updateBulletinBoardTemplate", async (arg, thunkAPI) => {
    const { params, callbacks } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestUpdateTemplate());
    try {
        const response = await webApi_1.WebApi.postBroadcastBbTemplateUpdate(dispatch, params, callbacks);
        dispatch(exports.slice.actions.successUpdateTemplate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureUpdateTemplate());
        return null;
    }
});
exports.updateBulletinBoard = (0, toolkit_1.createAsyncThunk)("broadcastBulletinBoard/updateBulletinBoard", async (arg, thunkAPI) => {
    const { params, callbacks } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestUpdate());
    try {
        const response = await webApi_1.WebApi.postBroadcastBbUpdate(dispatch, params, callbacks);
        dispatch(exports.slice.actions.successUpdate());
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureUpdate());
        return null;
    }
});
exports.sendBulletinBoard = (0, toolkit_1.createAsyncThunk)("broadcastBulletinBoard/sendBulletinBoard", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestSend());
    try {
        const response = await webApi_1.WebApi.postBroadcastBb(dispatch, arg);
        const { data } = response;
        dispatch(exports.slice.actions.successSend({ data }));
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureSend());
        return null;
    }
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "broadcastBulletinBoard",
    initialState,
    reducers: {
        enableFlight: (state) => {
            state.isFlightLegEnabled = true;
        },
        disableFlight: (state) => {
            state.isFlightLegEnabled = false;
        },
        openFlightLegSearchModal: (state) => {
            state.isOpenFlightLegSearchModal = true;
        },
        closeFlightLegSearchModal: (state) => {
            state.isOpenFlightLegSearchModal = false;
            state.flightLegs = [];
        },
        openBbAddressDetailModal: (state) => {
            state.isOpenBbAddressDetailModal = true;
        },
        closeBbAddressDetailModal: (state) => {
            state.isOpenBbAddressDetailModal = false;
        },
        requestFetch: (state) => {
            state.fetchingBb = true;
        },
        successFetch: (state, action) => {
            state.fetchingBb = false;
            state.detail = action.payload.data;
        },
        failureFetch: (state) => {
            state.fetchingBb = false;
            state.detail = {};
        },
        requestFetchTemplate: (state) => {
            state.fetching = true;
        },
        successFetchTemplate: (state, action) => {
            state.fetching = false;
            state.template = action.payload.data;
        },
        failureFetchTemplate: (state) => {
            state.fetching = false;
            state.template = {};
        },
        requestFetchAllFlightLeg: (state) => {
            state.fetchingAllFlightLeg = true;
        },
        successFetchAllFlightLeg: (state, action) => {
            state.fetchingAllFlightLeg = false;
            state.flightLegs = action.payload.data.flightLegList;
        },
        failureFetchAllFlightLeg: (state) => {
            state.fetchingAllFlightLeg = false;
            state.flightLegs = [];
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
        requestUpdate: (state) => {
            state.updating = false;
        },
        successUpdate: (state) => {
            state.updating = true;
        },
        failureUpdate: (state) => {
            state.updating = true;
        },
        requestSend: (state) => {
            state.sending = true;
            state.newBbId = null;
        },
        successSend: (state, action) => {
            state.newBbId = action.payload.data.bbId;
        },
        failureSend: (state) => {
            state.sending = false;
            state.newBbId = null;
        },
    },
});
_a = exports.slice.actions, exports.enableFlight = _a.enableFlight, exports.disableFlight = _a.disableFlight, exports.openFlightLegSearchModal = _a.openFlightLegSearchModal, exports.closeFlightLegSearchModal = _a.closeFlightLegSearchModal, exports.openBbAddressDetailModal = _a.openBbAddressDetailModal, exports.closeBbAddressDetailModal = _a.closeBbAddressDetailModal;
exports.default = exports.slice.reducer;
//# sourceMappingURL=broadcastBulletinBoard.js.map