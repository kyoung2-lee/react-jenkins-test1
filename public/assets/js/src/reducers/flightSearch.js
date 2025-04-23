"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.openFlightDetail = exports.fetchFlightFailure = exports.fetchFlightSuccess = exports.fetchFlight = exports.clearFlightSearch = exports.slice = exports.showNotificationFlightRmksNoChange = exports.showConfirmation = exports.autoGetFlightDetail = exports.reloadFlightSearch = exports.searchFlight = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const lodash_1 = require("lodash");
const webApi_1 = require("../lib/webApi");
const commonUtil_1 = require("../lib/commonUtil");
const commonConst_1 = require("../lib/commonConst");
const storage_1 = require("../lib/storage");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const flightContents_1 = require("./flightContents");
const flightContentsFlightDetail_1 = require("./flightContentsFlightDetail");
const flightModals_1 = require("./flightModals");
exports.searchFlight = (0, toolkit_1.createAsyncThunk)("flightSearch/searchFlight", async (arg, thunkAPI) => {
    const { searchParams, myApoCd } = arg;
    const { dispatch, getState } = thunkAPI;
    const { date, searchType, flt, mvtType } = searchParams;
    const { onlineDbExpDays } = getState().account.master;
    const onlineDbExpDaysPh2 = getState().account.master.oalOnlineDbExpDays;
    const requestParams = {
        searchType,
        date,
        dateFrom: searchType === "MVT" ? searchParams.dateFrom : undefined,
        dateTo: searchType === "MVT" ? searchParams.dateTo : undefined,
        alCd: searchType === "FLT" && !searchParams.casFltFlg ? flt.slice(0, 2) : undefined,
        fltNo: searchType === "FLT" && !searchParams.casFltFlg ? flt.slice(2) : undefined,
        casFltNo: searchType === "FLT" && searchParams.casFltFlg ? flt : undefined,
        depApoCd: searchType === "LEG" || searchType === "AL" || searchType === "MVT" ? searchParams.depApoCd : undefined,
        arrApoCd: searchType === "LEG" || searchType === "AL" || searchType === "MVT" ? searchParams.arrApoCd : undefined,
        jalGrpFlg: searchType === "LEG" && searchParams.jalGrpFlg !== "ALL" ? searchParams.jalGrpFlg : undefined,
        intDomCat: (searchType === "LEG" || searchType === "MVT") && searchParams.intDomCat !== "D/I" ? searchParams.intDomCat : undefined,
        ship: searchType === "SHIP" ? searchParams.ship : undefined,
        casFltFlg: searchType === "FLT" ? searchParams.casFltFlg : undefined,
        alCdList: searchType === "AL" ? searchParams.alCdList : undefined,
        trCdList: searchType === "MVT" ? searchParams.trCdList : undefined,
        onlineDbExpDays,
        onlineDbExpDaysPh2,
        depMvtChkFlg: searchType === "MVT" ? !!(mvtType === "BOTH" || mvtType === "DEP") : undefined,
        arrMvtChkFlg: searchType === "MVT" ? !!(mvtType === "BOTH" || mvtType === "ARR") : undefined,
    };
    dispatch((0, exports.clearFlightSearch)()); // 初期化処理
    dispatch((0, exports.fetchFlight)(requestParams));
    notifications_1.NotificationCreator.removeAll({ dispatch });
    try {
        const response = await webApi_1.WebApi.getFlightList(dispatch, requestParams);
        const { jobAuth } = getState().account.jobAuth;
        if ((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, jobAuth)) {
            await dispatch((0, exports.autoGetFlightDetail)({ eLegList: response.data.eLegList, myApoCd }));
        }
        dispatch((0, exports.fetchFlightSuccess)(response.data));
    }
    catch (err) {
        let fetchValidationErrors = [];
        if (err instanceof webApi_1.ApiError && err.response) {
            if (err.response.status === 422) {
                const data = err.response.data || null;
                if (data && data.errors) {
                    data.errors.forEach((error) => {
                        fetchValidationErrors = fetchValidationErrors.concat(error.errorItems);
                        // メッセージを表示
                        error.errorMessages.forEach((errorText) => {
                            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50029C({ title: "Input Error", errorText }) });
                        });
                    });
                    fetchValidationErrors = (0, lodash_1.uniq)(fetchValidationErrors);
                }
            }
        }
        dispatch((0, exports.fetchFlightFailure)({ fetchValidationErrors }));
    }
});
exports.reloadFlightSearch = (0, toolkit_1.createAsyncThunk)("flightSearch/reload", async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { requestParams } = getState().flightSearch;
    const { myApoCd } = getState().account.jobAuth.user;
    if (!requestParams)
        return;
    dispatch((0, exports.fetchFlight)(requestParams));
    notifications_1.NotificationCreator.removeAll({ dispatch });
    try {
        const response = await webApi_1.WebApi.getFlightList(dispatch, requestParams);
        const { jobAuth } = getState().account.jobAuth;
        if ((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, jobAuth)) {
            await dispatch((0, exports.autoGetFlightDetail)({ eLegList: response.data.eLegList, myApoCd }));
        }
        dispatch((0, exports.fetchFlightSuccess)(response.data));
    }
    catch (err) {
        let fetchValidationErrors = [];
        if (err instanceof webApi_1.ApiError && err.response) {
            if (err.response.status === 422) {
                const data = err.response.data || null;
                if (data && data.errors) {
                    data.errors.forEach((error) => {
                        fetchValidationErrors = fetchValidationErrors.concat(error.errorItems);
                        // メッセージを表示
                        error.errorMessages.forEach((errorText) => {
                            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50029C({ title: "Input Error", errorText }) });
                        });
                    });
                    fetchValidationErrors = (0, lodash_1.uniq)(fetchValidationErrors);
                }
            }
        }
        dispatch((0, exports.fetchFlightFailure)({ fetchValidationErrors }));
    }
});
exports.autoGetFlightDetail = (0, toolkit_1.createAsyncThunk)("flightSearch/autoGetFlightDetail", async (arg, thunkAPI) => {
    const { eLegList, myApoCd } = arg;
    const { dispatch } = thunkAPI;
    if (eLegList.length !== 1)
        return;
    const eLeg = eLegList[0];
    const flightKey = {
        myApoCd,
        orgDateLcl: eLeg.orgDateLcl,
        alCd: eLeg.alCd,
        fltNo: eLeg.fltNo,
        casFltNo: eLeg.casFltNo,
        skdDepApoCd: eLeg.skdDepApoCd,
        skdArrApoCd: eLeg.skdArrApoCd,
        skdLegSno: eLeg.skdLegSno,
        oalTblFlg: eLeg.oalTblFlg,
    };
    const tabName = "Detail";
    const isReload = true;
    const selectedFlightIdentifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, exports.openFlightDetail)({ selectedFlightIdentifier }));
    if (storage_1.storage.isIphone) {
        const posRight = false;
        void dispatch((0, flightModals_1.openFlightModal)({ flightKey, posRight, tabName }));
    }
    else {
        dispatch((0, flightContents_1.addFlightContent)({ flightKey, tabName, removeAll: true }));
    }
    await dispatch((0, flightContentsFlightDetail_1.fetchFlightDetail)({ flightKey, isReload }));
});
exports.showConfirmation = (0, toolkit_1.createAsyncThunk)("flightSearch/showConfirmation", (arg, { dispatch }) => {
    const { onClickYes } = arg;
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: onClickYes }) });
});
exports.showNotificationFlightRmksNoChange = (0, toolkit_1.createAsyncThunk)("flightSearch/showNotificationFlightRmksNoChange", (_, { dispatch }) => {
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40002C({}) });
});
const initialState = {
    eLegList: [],
    requestParams: null,
    isSearched: false,
    isFlightDetailOpen: false,
    selectedFlightIdentifier: "",
    isFetching: false,
    isFetchingDetail: false,
    isError: false,
    fetchValidationErrors: [],
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "flightSearch",
    initialState,
    reducers: {
        clearFlightSearch: (state) => {
            Object.assign(state, initialState);
        },
        fetchFlight: (state, action) => {
            const requestParams = action.payload;
            state.requestParams = requestParams;
            state.isFetching = true;
            state.isFlightDetailOpen = false;
        },
        fetchFlightSuccess: (state, action) => {
            const eLegList = action.payload.eLegList.map((e) => {
                const newELeg = e;
                if (e.specialSts) {
                    try {
                        newELeg.specialStses = JSON.parse(e.specialSts); // 特別ステータスのstringをJsonに変換
                        newELeg.specialSts = "";
                    }
                    catch (err) {
                        console.log(err);
                        console.log(e.specialSts);
                    }
                }
                return e;
            });
            state.isSearched = true;
            state.isFetching = false;
            state.eLegList = eLegList;
            state.isError = false;
        },
        fetchFlightFailure: (state, action) => {
            const { fetchValidationErrors } = action.payload;
            state.isFetching = false;
            state.fetchValidationErrors = fetchValidationErrors;
        },
        openFlightDetail: (state, action) => {
            const { selectedFlightIdentifier } = action.payload;
            state.isFlightDetailOpen = true;
            state.selectedFlightIdentifier = selectedFlightIdentifier;
        },
    },
});
_a = exports.slice.actions, exports.clearFlightSearch = _a.clearFlightSearch, exports.fetchFlight = _a.fetchFlight, exports.fetchFlightSuccess = _a.fetchFlightSuccess, exports.fetchFlightFailure = _a.fetchFlightFailure, exports.openFlightDetail = _a.openFlightDetail;
exports.default = exports.slice.reducer;
//# sourceMappingURL=flightSearch.js.map