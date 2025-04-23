"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceFiltered = exports.checkedFisRowsLength = exports.closeFlightSearchModal = exports.openFlightSearchModal = exports.clearFisFilterModal = exports.slice = exports.showInfoNoData = exports.showInfoNoAirport = exports.searchFis = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
exports.searchFis = (0, toolkit_1.createAsyncThunk)("fisFilterModal/searchFis", (arg, thunkAPI) => {
    const searchParams = arg;
    const { dispatch } = thunkAPI;
    let isFiltered = false;
    if ((searchParams.airLineCode && searchParams.airLineCode.length) ||
        searchParams.airLineCodeJALGRP ||
        searchParams.airLineCodeOALAll ||
        (searchParams.airLineCodeOAL && searchParams.airLineCodeOAL.length) ||
        searchParams.flightNo ||
        searchParams.airport ||
        searchParams.ship ||
        (searchParams.spot && searchParams.spot.length) ||
        searchParams.dateTimeRadio ||
        searchParams.dateTimeFrom ||
        searchParams.dateTimeTo ||
        searchParams.domOrInt ||
        searchParams.skdOrNsk ||
        searchParams.cnlHideFlg) {
        isFiltered = true;
    }
    notifications_1.NotificationCreator.removeAll({ dispatch });
    dispatch(exports.slice.actions.searchSubmit({ searchParams, isFiltered }));
});
exports.showInfoNoAirport = (0, toolkit_1.createAsyncThunk)("fisFilterModal/showInfoNoAirport", (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30007C() });
});
exports.showInfoNoData = (0, toolkit_1.createAsyncThunk)("fisFilterModal/showInfoNoData", (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30003C() });
});
const initialState = {
    modalIsOpen: false,
    isFiltered: false,
    isSubmit: false,
    isForceFilter: false,
    searchParams: {
        airLineCode: [],
        airLineCodeJALGRP: false,
        airLineCodeOALAll: false,
        airLineCodeOAL: [],
        flightNo: "",
        airport: "",
        ship: "",
        spot: [],
        dateTimeRadio: "",
        dateTimeFrom: "",
        dateTimeTo: "",
        domOrInt: "",
        skdOrNsk: "",
        casualFlg: false,
        cnlHideFlg: false,
    },
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "fisFilterModal",
    initialState,
    reducers: {
        clearFisFilterModal: (state) => {
            Object.assign(state, initialState);
        },
        openFlightSearchModal: (state) => {
            state.modalIsOpen = true;
        },
        closeFlightSearchModal: (state) => {
            state.modalIsOpen = false;
        },
        searchSubmit: (state, action) => {
            const { searchParams, isFiltered } = action.payload;
            state.isSubmit = true;
            state.searchParams = { ...searchParams };
            state.isFiltered = isFiltered;
            state.isForceFilter = !isFiltered;
        },
        checkedFisRowsLength: (state) => {
            state.isSubmit = false;
        },
        forceFiltered: (state) => {
            state.isForceFilter = false;
        },
    },
});
_a = exports.slice.actions, exports.clearFisFilterModal = _a.clearFisFilterModal, exports.openFlightSearchModal = _a.openFlightSearchModal, exports.closeFlightSearchModal = _a.closeFlightSearchModal, exports.checkedFisRowsLength = _a.checkedFisRowsLength, exports.forceFiltered = _a.forceFiltered;
exports.default = exports.slice.reducer;
//# sourceMappingURL=fisFilterModal.js.map