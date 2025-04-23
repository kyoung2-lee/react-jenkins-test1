"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFlightListFailure = exports.fetchFlightListSuccess = exports.fetchFlightList = exports.focusFlightListModal = exports.closeFlightListModal = exports.clearFlightListModals = exports.slice = exports.getFlightList = exports.openFlightListModal = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const storage_1 = require("../lib/storage");
const commonConst_1 = require("../lib/commonConst");
const notifications_1 = require("../lib/notifications");
// eslint-disable-next-line import/no-cycle
const common_1 = require("./common");
const initialState = {
    modals: [],
    isError: false,
    retry: () => null,
};
function getKey(keys) {
    const { terminalCat } = storage_1.storage;
    if (terminalCat === commonConst_1.Const.TerminalCat.iPad || terminalCat === commonConst_1.Const.TerminalCat.iPhone) {
        return "1"; // モバイルの場合、開く画面は１つだけ
    }
    return `${keys.date}/${keys.ship}`;
}
exports.openFlightListModal = (0, toolkit_1.createAsyncThunk)("flightListModals/openFlightListModal", (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPad || storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone) {
        void dispatch((0, common_1.closeAllDraggableModals)());
    }
    else if (getState().flightModals.modals.filter((modal) => modal.opened).length +
        getState().flightListModals.modals.filter((modal) => modal.opened).length <=
        0) {
        dispatch((0, common_1.initDate)());
    }
    dispatch(exports.slice.actions.openFlightListModalAction(arg));
});
exports.getFlightList = (0, toolkit_1.createAsyncThunk)("flightListModals/getFlightList", async (flightListKeys, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    dispatch((0, exports.fetchFlightList)(flightListKeys));
    notifications_1.NotificationCreator.removeAll({ dispatch });
    const { onlineDbExpDays } = getState().account.master;
    const onlineDbExpDaysPh2 = getState().account.master.oalOnlineDbExpDays;
    const params = {
        searchType: "SHIP",
        date: flightListKeys.date,
        dateFrom: flightListKeys.dateFrom,
        ship: flightListKeys.ship,
        onlineDbExpDays,
        onlineDbExpDaysPh2,
    };
    try {
        const response = await webApi_1.WebApi.getFlightList(dispatch, params);
        dispatch((0, exports.fetchFlightListSuccess)({ response: response.data, flightListKeys }));
    }
    catch (err) {
        dispatch((0, exports.fetchFlightListFailure)({ flightListKeys }));
    }
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "flightListModals",
    initialState,
    reducers: {
        clearFlightListModals: (state) => {
            state.modals = [];
        },
        openFlightListModalAction: (state, action) => {
            const newKey = getKey(action.payload.flightListKeys);
            const existIndex = state.modals.findIndex((modal) => modal.key === newKey);
            const newModal = {
                flightListKeys: { ...action.payload.flightListKeys },
                focusedAt: new Date(),
                opened: true,
                key: newKey,
                lists: undefined,
                isFetching: false,
                posRight: action.payload.posRight,
            };
            if (existIndex >= 0) {
                state.modals.splice(existIndex, 1);
                state.modals.push(newModal);
            }
            else if (state.modals.length < commonConst_1.Const.MODAL_LIMIT_COUNT) {
                state.modals.push(newModal);
            }
            else {
                const removedElementIndex = state.modals.findIndex((e) => !e.opened);
                if (removedElementIndex >= 0) {
                    state.modals.splice(removedElementIndex, 1);
                    state.modals.push(newModal);
                }
            }
        },
        closeFlightListModal: (state, action) => {
            const existIndex = state.modals.findIndex((modal) => modal.key === action.payload.key);
            if (existIndex < 0) {
                return;
            }
            state.modals.splice(existIndex, 1);
        },
        focusFlightListModal: (state, action) => {
            const existIndex = state.modals.findIndex((modal) => modal.key === action.payload.key);
            if (existIndex < 0) {
                return;
            }
            state.modals.splice(existIndex, 1);
            state.modals.push({ ...action.payload, focusedAt: new Date(), opened: true });
        },
        fetchFlightList: (state, action) => {
            const keys = action.payload;
            const keyStr = getKey(keys);
            const newModals = state.modals.map((modal) => (modal.key === keyStr ? { ...modal, isFetching: true } : modal));
            state.modals = newModals;
        },
        fetchFlightListSuccess: (state, action) => {
            const { response, flightListKeys } = action.payload;
            const key = getKey(flightListKeys);
            const eLegList = response.eLegList.map((e) => {
                const eLeg = e;
                if (eLeg.specialSts) {
                    try {
                        eLeg.specialStses = JSON.parse(eLeg.specialSts); // 特別ステータスのstringをJsonに変換
                        eLeg.specialSts = "";
                    }
                    catch (err) {
                        console.log(err);
                        console.log(e.specialSts);
                    }
                }
                return eLeg;
            });
            const newModals = state.modals.map((modal) => {
                if (modal.key === key) {
                    return {
                        ...modal,
                        lists: { eLegList },
                        isFetching: false,
                    };
                }
                return modal;
            });
            state.modals = newModals;
            state.isError = false;
            state.retry = () => null;
        },
        fetchFlightListFailure: (state, action) => {
            const key = getKey(action.payload.flightListKeys);
            const existIndex = state.modals.findIndex((modal) => modal.key === key);
            if (existIndex < 0) {
                state.modals = state.modals.map((modal) => ({ ...modal, isFetching: false }));
            }
            else {
                state.modals = state.modals.map((modal) => (modal.key === key ? null : modal)).filter((m) => !!m);
            }
        },
    },
});
_a = exports.slice.actions, exports.clearFlightListModals = _a.clearFlightListModals, exports.closeFlightListModal = _a.closeFlightListModal, exports.focusFlightListModal = _a.focusFlightListModal, exports.fetchFlightList = _a.fetchFlightList, exports.fetchFlightListSuccess = _a.fetchFlightListSuccess, exports.fetchFlightListFailure = _a.fetchFlightListFailure;
exports.default = exports.slice.reducer;
//# sourceMappingURL=flightListModals.js.map