"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCheckHasDifference = exports.setLastUpdateSendAirportIssueRequest = exports.fetchTtyAddressFailure = exports.fetchTtyAddressSucsess = exports.fetchMailAddressFailure = exports.fetchMailAddressSucsess = exports.fetchAirportIssueFailure = exports.fetchAirportIssueSucsess = exports.fetchAirportIssue = exports.hideTtyModal = exports.showTtyModal = exports.hideEmailModal = exports.showEmailModal = exports.slice = exports.submitFailedField = exports.getTtyAddress = exports.getMailAddress = exports.saveTemplate = exports.updateSendAirportIssue = exports.getAirportIssue = exports.showMessage = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const redux_form_1 = require("redux-form");
const webApi_1 = require("../lib/webApi");
const notifications_1 = require("../lib/notifications");
const common_1 = require("./common");
exports.showMessage = (0, toolkit_1.createAsyncThunk)("issueSecurity/showMessage", (arg, thunkAPI) => {
    const { message } = arg;
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message });
});
exports.getAirportIssue = (0, toolkit_1.createAsyncThunk)("issueSecurity/getAirportIssue", async (arg, thunkAPI) => {
    const { apoCd } = arg;
    const { dispatch } = thunkAPI;
    dispatch((0, exports.fetchAirportIssue)());
    try {
        const response = await webApi_1.WebApi.getAirportIssue(dispatch, { apoCd });
        dispatch((0, exports.fetchAirportIssueSucsess)(response.data));
    }
    catch (err) {
        dispatch((0, exports.fetchAirportIssueFailure)());
    }
});
exports.updateSendAirportIssue = (0, toolkit_1.createAsyncThunk)("issueSecurity/updateSendAirportIssue", async (arg, thunkAPI) => {
    const { params, apoCd } = arg;
    const { dispatch } = thunkAPI;
    try {
        await webApi_1.WebApi.postAirportIssue(dispatch, params);
        dispatch((0, exports.setLastUpdateSendAirportIssueRequest)(params));
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dispatch((0, common_1.getHeaderInfo)({ apoCd }));
    }
    catch (err) {
        // 何もしない
    }
});
exports.saveTemplate = (0, toolkit_1.createAsyncThunk)("issueSecurity/saveTemplate", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
        await webApi_1.WebApi.postAirportIssueTemplate(dispatch, arg);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dispatch((0, exports.getAirportIssue)({ apoCd: arg.apoCd }));
    }
    catch (err) {
        // 何もしない
    }
});
exports.getMailAddress = (0, toolkit_1.createAsyncThunk)("issueSecurity/getMailAddress", async (arg, thunkAPI) => {
    const { params, showModal = true } = arg;
    const { dispatch } = thunkAPI;
    if (showModal) {
        dispatch((0, exports.showEmailModal)());
    }
    try {
        const response = await webApi_1.WebApi.postAddressMail(dispatch, params);
        dispatch((0, exports.fetchMailAddressSucsess)(response.data));
        return response.data;
    }
    catch (err) {
        dispatch((0, exports.fetchMailAddressFailure)());
        return undefined;
    }
});
exports.getTtyAddress = (0, toolkit_1.createAsyncThunk)("issueSecurity/getTtyAddress", async (arg, thunkAPI) => {
    const { params, showModal = true } = arg;
    const { dispatch } = thunkAPI;
    if (showModal) {
        dispatch((0, exports.showTtyModal)());
    }
    try {
        const response = await webApi_1.WebApi.postAddressTty(dispatch, params);
        dispatch((0, exports.fetchTtyAddressSucsess)(response.data));
        return response.data;
    }
    catch (err) {
        dispatch((0, exports.fetchTtyAddressFailure)());
        return undefined;
    }
});
exports.submitFailedField = (0, toolkit_1.createAsyncThunk)("issueSecurity/submitfailedField", ({ fields }, { dispatch }) => {
    dispatch((0, redux_form_1.setSubmitFailed)("issueSecurity", ...fields));
});
const initialState = {
    isFetching: false,
    isEmailModalActive: false,
    isTtyModalActive: false,
    airportIssue: {
        now: "",
        mailAddrGrpList: [],
        ttyAddrGrpList: [],
        issuTemplateList: [],
    },
    mailAddrList: [],
    ttyAddrList: [],
    lastUpdateSendAirportIssueRequest: undefined,
    checkHasDifference: () => false,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "issueSecurity",
    initialState,
    reducers: {
        showEmailModal: (state) => {
            state.isEmailModalActive = true;
        },
        hideEmailModal: (state) => {
            state.isEmailModalActive = false;
            state.mailAddrList = [];
        },
        showTtyModal: (state) => {
            state.isTtyModalActive = true;
        },
        hideTtyModal: (state) => {
            state.isTtyModalActive = false;
            state.ttyAddrList = [];
        },
        fetchAirportIssue: (state) => {
            state.isFetching = true;
        },
        fetchAirportIssueSucsess: (state, action) => {
            const { now, mailAddrGrpList = [], ttyAddrGrpList = [], issuTemplateList = [] } = action.payload;
            state.airportIssue = {
                now,
                mailAddrGrpList: mailAddrGrpList
                    ? mailAddrGrpList
                        .sort((a, b) => a.addrGrpDispSeq - b.addrGrpDispSeq)
                        .map((ttyAddrGrp) => ({ label: `${ttyAddrGrp.addrGrpCd}`, value: `${ttyAddrGrp.addrGrpId}` }))
                    : [],
                ttyAddrGrpList: ttyAddrGrpList
                    ? ttyAddrGrpList
                        .sort((a, b) => a.addrGrpDispSeq - b.addrGrpDispSeq)
                        .map((ttyAddrGrp) => ({ label: `${ttyAddrGrp.addrGrpCd}`, value: `${ttyAddrGrp.addrGrpId}` }))
                    : [],
                issuTemplateList,
            };
            state.isFetching = false;
        },
        fetchAirportIssueFailure: (state) => {
            state.isFetching = false;
        },
        fetchMailAddressSucsess: (state, action) => {
            const { mailAddrList } = action.payload;
            state.mailAddrList = mailAddrList;
        },
        fetchMailAddressFailure: (_state) => { },
        fetchTtyAddressSucsess: (state, action) => {
            const { ttyAddrList } = action.payload;
            state.ttyAddrList = ttyAddrList;
        },
        fetchTtyAddressFailure: (_state) => { },
        setLastUpdateSendAirportIssueRequest: (state, action) => {
            state.lastUpdateSendAirportIssueRequest = action.payload;
        },
        setCheckHasDifference: (state, action) => {
            const { data } = action.payload;
            state.checkHasDifference = data;
        },
    },
});
_a = exports.slice.actions, exports.showEmailModal = _a.showEmailModal, exports.hideEmailModal = _a.hideEmailModal, exports.showTtyModal = _a.showTtyModal, exports.hideTtyModal = _a.hideTtyModal, exports.fetchAirportIssue = _a.fetchAirportIssue, exports.fetchAirportIssueSucsess = _a.fetchAirportIssueSucsess, exports.fetchAirportIssueFailure = _a.fetchAirportIssueFailure, exports.fetchMailAddressSucsess = _a.fetchMailAddressSucsess, exports.fetchMailAddressFailure = _a.fetchMailAddressFailure, exports.fetchTtyAddressSucsess = _a.fetchTtyAddressSucsess, exports.fetchTtyAddressFailure = _a.fetchTtyAddressFailure, exports.setLastUpdateSendAirportIssueRequest = _a.setLastUpdateSendAirportIssueRequest, exports.setCheckHasDifference = _a.setCheckHasDifference;
exports.default = exports.slice.reducer;
//# sourceMappingURL=issueSecurity.js.map