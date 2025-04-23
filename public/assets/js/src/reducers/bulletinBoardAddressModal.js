"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeBulletinBoardAddressModal = exports.openBulletinBoardAddressModal = exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    isOpen: false,
    jobCodes: [],
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "bulletinBoardAddressModal",
    initialState,
    reducers: {
        openBulletinBoardAddressModal: (state, action) => {
            state.isOpen = true;
            state.jobCodes = action.payload.jobCodes;
        },
        closeBulletinBoardAddressModal: (state) => {
            state.isOpen = false;
        },
    },
});
_a = exports.slice.actions, exports.openBulletinBoardAddressModal = _a.openBulletinBoardAddressModal, exports.closeBulletinBoardAddressModal = _a.closeBulletinBoardAddressModal;
exports.default = exports.slice.reducer;
//# sourceMappingURL=bulletinBoardAddressModal.js.map