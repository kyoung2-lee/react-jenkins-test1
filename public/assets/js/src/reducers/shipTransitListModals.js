"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.focusShipTransitListModal = exports.closeShipTransitListModal = exports.clearShipTransitListModals = exports.slice = exports.openShipTransitListModal = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
// eslint-disable-next-line import/no-cycle
const common_1 = require("./common");
const commonConst_1 = require("../lib/commonConst");
const storage_1 = require("../lib/storage");
// Action Creator
exports.openShipTransitListModal = (0, toolkit_1.createAsyncThunk)("shipTransitListModals/openShipTransitListModal", (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPad || storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone) {
        void dispatch((0, common_1.closeAllDraggableModals)());
    }
    dispatch(exports.slice.actions.openShipTransitListModal(arg));
});
const initialState = {
    modals: [],
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "shipTransitListModals",
    initialState,
    reducers: {
        clearShipTransitListModals: (state) => {
            state.modals = [];
        },
        openShipTransitListModal: (state, action) => {
            const exist = state.modals.find((val) => val.alCd === action.payload.alCd && val.fltNo === action.payload.fltNo);
            // 既に同一の値がstateに入っていたら、stateをそのまま返す。
            if (exist) {
                return;
            }
            state.modals.push(action.payload);
        },
        closeShipTransitListModal: (state, action) => {
            const existIndex = state.modals.findIndex((val) => (0, lodash_isequal_1.default)(val, action.payload));
            if (existIndex >= 0) {
                state.modals.splice(existIndex, 1);
            }
        },
        focusShipTransitListModal: (state, action) => {
            const existIndex = state.modals.findIndex((val) => (0, lodash_isequal_1.default)(val, action.payload));
            if (existIndex >= 0) {
                state.modals.splice(existIndex, 1);
                state.modals.push({ ...action.payload, focusedAt: new Date() });
            }
        },
    },
});
_a = exports.slice.actions, exports.clearShipTransitListModals = _a.clearShipTransitListModals, exports.closeShipTransitListModal = _a.closeShipTransitListModal, exports.focusShipTransitListModal = _a.focusShipTransitListModal;
exports.default = exports.slice.reducer;
//# sourceMappingURL=shipTransitListModals.js.map