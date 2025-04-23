"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slice = exports.fetchAllMailAddressList = exports.fetchAllTtyAddressList = exports.fetchAllJobCodeAddressList = exports.initialState = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
exports.initialState = {
    fetchingAllJobCodeAddress: false,
    jobList: [],
    fetchingAllTtyAddress: false,
    ttyAddrList: [],
    fetchingAllMailAddress: false,
    mailAddrList: [],
};
exports.fetchAllJobCodeAddressList = (0, toolkit_1.createAsyncThunk)("address/fetchAllJobCodeAddressList", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestJobCodeAddressList());
    try {
        const response = await webApi_1.WebApi.postAddressJob(dispatch, arg);
        const { data } = response;
        dispatch(exports.slice.actions.successJobCodeAddressList({ data }));
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureJobCodeAddressList());
        return null;
    }
});
exports.fetchAllTtyAddressList = (0, toolkit_1.createAsyncThunk)("address/fetchAllTtyAddressList", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestTtyAddressList());
    try {
        const response = await webApi_1.WebApi.postAddressTty(dispatch, arg);
        const { data } = response;
        dispatch(exports.slice.actions.successTtyAddressList({ data }));
        return response.data;
    }
    catch (error) {
        dispatch(exports.slice.actions.failureTtyAddressList());
        return null;
    }
});
exports.fetchAllMailAddressList = (0, toolkit_1.createAsyncThunk)("address/fetchAllMailAddressList", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.requestMailAddressList());
    try {
        const response = await webApi_1.WebApi.postAddressMail(dispatch, arg);
        const { data } = response;
        dispatch(exports.slice.actions.successMailAddressList({ data }));
        return response.data;
    }
    catch (e) {
        dispatch(exports.slice.actions.failureMailAddressList());
        return null;
    }
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "address",
    initialState: exports.initialState,
    reducers: {
        requestMailAddressList: (state) => {
            state.fetchingAllMailAddress = true;
        },
        successMailAddressList: (state, action) => {
            const { mailAddrList } = action.payload.data;
            state.fetchingAllMailAddress = false;
            state.mailAddrList = mailAddrList;
        },
        failureMailAddressList: (state) => {
            state.fetchingAllMailAddress = false;
        },
        requestTtyAddressList: (state) => {
            state.fetchingAllTtyAddress = true;
        },
        successTtyAddressList: (state, action) => {
            state.fetchingAllTtyAddress = false;
            state.ttyAddrList = action.payload.data.ttyAddrList;
        },
        failureTtyAddressList: (state) => {
            state.fetchingAllTtyAddress = false;
        },
        requestJobCodeAddressList: (state) => {
            state.fetchingAllJobCodeAddress = true;
        },
        successJobCodeAddressList: (state, action) => {
            state.fetchingAllJobCodeAddress = false;
            state.jobList = action.payload.data.jobList;
        },
        failureJobCodeAddressList: (state) => {
            state.fetchingAllJobCodeAddress = false;
        },
    },
});
exports.default = exports.slice.reducer;
//# sourceMappingURL=address.js.map