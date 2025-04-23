"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeSpotNumberRestrictionPopupSuccess = exports.closeSpotNumberRestrictionPopup = exports.openSpotNumberRestrictionPopup = exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    isOpen: false,
    legInfo: [],
    onYesButton: () => { },
    onNoButton: () => { },
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "spotNumberRestrictionPopup",
    initialState,
    reducers: {
        openSpotNumberRestrictionPopup: (state, action) => {
            state.isOpen = true;
            state.legInfo = action.payload.legInfo;
            state.onYesButton = action.payload.onYesButton;
            state.onNoButton = action.payload.onNoButton;
        },
        closeSpotNumberRestrictionPopup: (state) => {
            // ここでStateを初期化するとアニメーション前にポップアップの内容が変化してしまう
            state.isOpen = false;
        },
        closeSpotNumberRestrictionPopupSuccess: (state) => {
            // ポップアップのアニメーション完了後にStateを初期化する
            Object.assign(state, initialState);
        },
    },
});
_a = exports.slice.actions, exports.openSpotNumberRestrictionPopup = _a.openSpotNumberRestrictionPopup, exports.closeSpotNumberRestrictionPopup = _a.closeSpotNumberRestrictionPopup, exports.closeSpotNumberRestrictionPopupSuccess = _a.closeSpotNumberRestrictionPopupSuccess;
exports.default = exports.slice.reducer;
//# sourceMappingURL=spotNumberRestrictionPopup.js.map