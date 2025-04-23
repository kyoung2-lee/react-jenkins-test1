"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTemplates = exports.clearTemplateFilter = exports.applyTemplateFilter = exports.failureFetchAllTemplate = exports.successFetchAllTemplate = exports.requestFetchAllTemplate = exports.closeTemplateNameEditModal = exports.openTemplateNameEditModal = exports.closeSaveAsModal = exports.openSaveAsModal = exports.closeSearchFilterModal = exports.openSearchFilterModal = exports.funcAuthCheck = exports.slice = exports.destroyTemplate = exports.updateTemplateName = exports.fetchAllTemplate = exports.clearSubmitFailedFields = exports.submitFailedField = exports.showMessage = void 0;
/* tslint:disable:no-console */
const toolkit_1 = require("@reduxjs/toolkit");
const lodash_orderby_1 = __importDefault(require("lodash.orderby"));
const redux_1 = require("redux");
const redux_form_1 = require("redux-form");
// eslint-disable-next-line import/no-cycle
const Broadcast_1 = require("../components/organisms/Broadcast/Broadcast");
const commonUtil_1 = require("../lib/commonUtil");
const commonConst_1 = require("../lib/commonConst");
const storage_1 = require("../lib/storage");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const webApi_1 = require("../lib/webApi");
const broadcastAcars_1 = __importDefault(require("./broadcastAcars"));
const broadcastBulletinBoard_1 = __importDefault(require("./broadcastBulletinBoard"));
const broadcastEmail_1 = __importDefault(require("./broadcastEmail"));
const broadcastNotification_1 = __importDefault(require("./broadcastNotification"));
const broadcastTty_1 = __importDefault(require("./broadcastTty"));
const broadcastAftn_1 = __importDefault(require("./broadcastAftn"));
const initialState = {
    canManageBb: false,
    canManageEmail: false,
    canManageTty: false,
    canManageAftn: false,
    canManageNotification: false,
    canManageAcars: false,
    fetchingAll: false,
    templates: [],
    isTemplateFiltered: false,
    isOpenSaveAsModal: false,
    isOpenSearchFlightLegModal: false,
    isOpenSearchFilterModal: false,
    isOpenTemplateNameEditModal: false,
};
function getSortedTemplates(templates, sortKey, order) {
    if (sortKey === "recentlyTime") {
        return (0, lodash_orderby_1.default)(templates, ["recentlyTime"], [order]);
    }
    if (order === "asc") {
        return Object.assign([], templates).sort((a, b) => a.templateName.localeCompare(b.templateName));
    }
    return Object.assign([], templates).sort((a, b) => b.templateName.localeCompare(a.templateName));
}
exports.showMessage = (0, toolkit_1.createAsyncThunk)("broadcast/showMessage", (message, { dispatch }) => {
    notifications_1.NotificationCreator.removeAll({ dispatch });
    notifications_1.NotificationCreator.create({ dispatch, message });
});
exports.submitFailedField = (0, toolkit_1.createAsyncThunk)("broadcast/submitFailedField", (fields, { dispatch }) => {
    dispatch((0, redux_form_1.setSubmitFailed)(Broadcast_1.FORM_NAME, ...fields));
});
exports.clearSubmitFailedFields = (0, toolkit_1.createAsyncThunk)("broadcast/clearSubmitFailedFields", (_arg, { dispatch }) => {
    dispatch((0, redux_form_1.stopSubmit)(Broadcast_1.FORM_NAME));
});
exports.fetchAllTemplate = (0, toolkit_1.createAsyncThunk)("broadcast/fetchAllTemplate", async (arg, { dispatch }) => {
    const { params, sort } = arg;
    dispatch(exports.slice.actions.requestFetchAllTemplate());
    try {
        const requestParam = {
            keyword: "",
            sendBy: "",
            ...params,
        };
        const response = await webApi_1.WebApi.getBroadcastTemplates(dispatch, requestParam);
        dispatch(exports.slice.actions.successFetchAllTemplate({ data: response.data, sortKey: sort.sortKey, order: sort.order }));
        if ((requestParam.keyword || requestParam.sendBy) && response.data.templateList.length === 0) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30003C() });
        }
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureFetchAllTemplate());
        return null;
    }
});
exports.updateTemplateName = (0, toolkit_1.createAsyncThunk)("broadcast/updateTemplateName", async (updateTemplateNameParams, { dispatch }) => {
    const { params, callbacks } = updateTemplateNameParams;
    try {
        const response = await webApi_1.WebApi.postBroadcastTemplateName(dispatch, params, callbacks);
        return response.data;
    }
    catch (error) {
        return null;
    }
});
exports.destroyTemplate = (0, toolkit_1.createAsyncThunk)("broadcast/destroyTemplate", async (destroyTemplateParams, { dispatch }) => {
    const { params, callbacks } = destroyTemplateParams;
    try {
        await webApi_1.WebApi.postBroadcastTemplateDelete(dispatch, params, callbacks);
        dispatch(exports.slice.actions.successDestroyTemplate({ templateId: params.templateId }));
        return true;
    }
    catch (error) {
        return null;
    }
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "broadcast",
    initialState,
    reducers: {
        funcAuthCheck: (state, action) => {
            state.canManageBb = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateBulletinBoard, action.payload.jobAuth) && !storage_1.storage.isIphone;
            state.canManageEmail = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openBroadcastEmail, action.payload.jobAuth);
            state.canManageTty = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openBroadcastTty, action.payload.jobAuth);
            state.canManageAftn = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openBroadcastAftn, action.payload.jobAuth);
            state.canManageNotification = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openBroadcastNotification, action.payload.jobAuth);
            state.canManageAcars = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openBroadcastAcars, action.payload.jobAuth);
        },
        openSearchFilterModal: (state) => {
            state.isOpenSearchFilterModal = true;
        },
        closeSearchFilterModal: (state) => {
            state.isOpenSearchFilterModal = false;
        },
        openSaveAsModal: (state) => {
            state.isOpenSaveAsModal = true;
        },
        closeSaveAsModal: (state) => {
            state.isOpenSaveAsModal = false;
        },
        openTemplateNameEditModal: (state) => {
            state.isOpenTemplateNameEditModal = true;
        },
        closeTemplateNameEditModal: (state) => {
            state.isOpenTemplateNameEditModal = false;
        },
        requestFetchAllTemplate: (state) => {
            state.fetchingAll = true;
        },
        successFetchAllTemplate: (state, action) => {
            const { data, sortKey, order } = action.payload;
            state.templates = getSortedTemplates(data.templateList, sortKey, order);
            state.fetchingAll = false;
        },
        failureFetchAllTemplate: (state) => {
            state.templates = [];
            state.fetchingAll = false;
        },
        successDestroyTemplate: (state, action) => {
            state.templates = state.templates.filter((template) => template.templateId !== action.payload.templateId);
        },
        applyTemplateFilter: (state) => {
            state.isTemplateFiltered = true;
        },
        clearTemplateFilter: (state) => {
            state.isTemplateFiltered = false;
        },
        sortTemplates: (state, action) => {
            const { templates, sortKey, order } = action.payload;
            state.templates = getSortedTemplates(templates, sortKey, order);
        },
    },
});
_a = exports.slice.actions, exports.funcAuthCheck = _a.funcAuthCheck, exports.openSearchFilterModal = _a.openSearchFilterModal, exports.closeSearchFilterModal = _a.closeSearchFilterModal, exports.openSaveAsModal = _a.openSaveAsModal, exports.closeSaveAsModal = _a.closeSaveAsModal, exports.openTemplateNameEditModal = _a.openTemplateNameEditModal, exports.closeTemplateNameEditModal = _a.closeTemplateNameEditModal, exports.requestFetchAllTemplate = _a.requestFetchAllTemplate, exports.successFetchAllTemplate = _a.successFetchAllTemplate, exports.failureFetchAllTemplate = _a.failureFetchAllTemplate, exports.applyTemplateFilter = _a.applyTemplateFilter, exports.clearTemplateFilter = _a.clearTemplateFilter, exports.sortTemplates = _a.sortTemplates;
exports.default = (0, redux_1.combineReducers)({
    Broadcast: exports.slice.reducer,
    BulletinBoard: broadcastBulletinBoard_1.default,
    Email: broadcastEmail_1.default,
    Tty: broadcastTty_1.default,
    Aftn: broadcastAftn_1.default,
    Notification: broadcastNotification_1.default,
    Acars: broadcastAcars_1.default,
});
//# sourceMappingURL=broadcast.js.map