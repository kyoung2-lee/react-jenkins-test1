"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setReactionRegistPopupStatus = exports.closeReactionRegistPopup = exports.openReactionRegistPopup = exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    isOpen: false,
    popupTargetType: "",
    popupTargetId: 0,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "bulletinBoardReactionRegistPopup",
    initialState,
    reducers: {
        openReactionRegistPopup: (state) => {
            state.isOpen = true;
        },
        closeReactionRegistPopup: (state) => {
            state.isOpen = false;
        },
        setReactionRegistPopupStatus: (state, action) => {
            state.popupTargetType = action.payload.popupTargetType;
            state.popupTargetId = action.payload.popupTargetId;
        },
    },
});
_a = exports.slice.actions, exports.openReactionRegistPopup = _a.openReactionRegistPopup, exports.closeReactionRegistPopup = _a.closeReactionRegistPopup, exports.setReactionRegistPopupStatus = _a.setReactionRegistPopupStatus;
exports.default = exports.slice.reducer;
//# sourceMappingURL=bulletinBoardReactionRegistPopup.js.map