"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeBulletinBoardResponseModal = exports.openBulletinBoardResponseModal = exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    opened: false,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "bulletinBoardResponseEditorModal",
    initialState,
    reducers: {
        openBulletinBoardResponseModal: (state, action) => {
            const { bbId, response } = action.payload;
            state.opened = true;
            state.bbId = bbId;
            state.response = response;
        },
        closeBulletinBoardResponseModal: (state) => {
            state.opened = false;
            state.bbId = undefined;
            state.response = undefined;
        },
    },
});
_a = exports.slice.actions, exports.openBulletinBoardResponseModal = _a.openBulletinBoardResponseModal, exports.closeBulletinBoardResponseModal = _a.closeBulletinBoardResponseModal;
exports.default = exports.slice.reducer;
//# sourceMappingURL=bulletinBoardResponseEditorModal.js.map