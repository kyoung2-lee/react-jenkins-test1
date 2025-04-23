"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.focusFlightModalAction = exports.closeFlightModalAction = exports.clearFlightModals = exports.slice = exports.closeFlightModal = exports.openFlightModal = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const storage_1 = require("../lib/storage");
const commonConst_1 = require("../lib/commonConst");
// eslint-disable-next-line import/no-cycle
const common_1 = require("./common");
const flightContents_1 = require("./flightContents");
const initialState = {
    modals: [],
    isError: false,
    retry: () => null,
};
function getKey({ identifier, posRight }) {
    switch (true) {
        case storage_1.storage.isIpad:
            return posRight ? "ARR" : "DEP";
        case storage_1.storage.isIphone:
            return "1";
        default:
            return identifier;
    }
}
exports.openFlightModal = (0, toolkit_1.createAsyncThunk)("flightModals/openFlightModal", (arg, thunkAPI) => {
    const { flightKey, posRight, tabName } = arg;
    const { dispatch, getState } = thunkAPI;
    if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPad || storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone) {
        void dispatch((0, common_1.closeAllDraggableModals)());
    }
    else if (getState().flightModals.modals.filter((modal) => modal.opened).length +
        getState().flightListModals.modals.filter((modal) => modal.opened).length <=
        0) {
        dispatch((0, common_1.initDate)());
    }
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch(exports.slice.actions.openFlightModalAction({ identifier, posRight }));
    dispatch((0, flightContents_1.addFlightContent)({ flightKey, tabName }));
});
exports.closeFlightModal = (0, toolkit_1.createAsyncThunk)("flightModals/closeFlightModal", (arg, thunkAPI) => {
    const { identifier } = arg;
    const { dispatch } = thunkAPI;
    dispatch((0, exports.closeFlightModalAction)({ identifier }));
    dispatch((0, flightContents_1.removeFlightContent)({ identifier }));
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "flightModals",
    initialState,
    reducers: {
        clearFlightModals: (state) => {
            state.modals = [];
        },
        openFlightModalAction: (state, action) => {
            const { identifier, posRight } = action.payload;
            const key = getKey({ identifier, posRight });
            const existedModalIndex = state.modals.findIndex((modal) => modal.key === key);
            const newModal = {
                opened: true,
                focusedAt: new Date(),
                posRight,
                key,
                identifier,
                isFetching: false,
            };
            if (existedModalIndex >= 0) {
                state.modals.splice(existedModalIndex, 1);
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
        closeFlightModalAction: (state, action) => {
            const existedModalIndex = state.modals.findIndex((m) => m.identifier === action.payload.identifier);
            if (existedModalIndex >= 0) {
                const existedModal = state.modals[existedModalIndex];
                state.modals.splice(existedModalIndex, 1);
                state.modals.push({
                    ...existedModal,
                    opened: false,
                });
            }
        },
        focusFlightModalAction: (state, action) => {
            const existedModalIndex = state.modals.findIndex((m) => m.identifier === action.payload.identifier);
            if (existedModalIndex >= 0) {
                const existedModal = state.modals[existedModalIndex];
                state.modals.splice(existedModalIndex, 1);
                state.modals.push({
                    ...existedModal,
                    focusedAt: new Date(),
                });
            }
        },
    },
});
_a = exports.slice.actions, exports.clearFlightModals = _a.clearFlightModals, exports.closeFlightModalAction = _a.closeFlightModalAction, exports.focusFlightModalAction = _a.focusFlightModalAction;
exports.default = exports.slice.reducer;
//# sourceMappingURL=flightModals.js.map