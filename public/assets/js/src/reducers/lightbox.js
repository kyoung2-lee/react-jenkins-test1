"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeLightbox = exports.openLightbox = exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = { isOpen: false };
exports.slice = (0, toolkit_1.createSlice)({
    name: "lightbox",
    initialState,
    reducers: {
        openLightbox: (state, action) => {
            const { media } = action.payload;
            state.isOpen = true;
            state.media = media;
        },
        closeLightbox: (state) => {
            state.isOpen = false;
        },
    },
});
_a = exports.slice.actions, exports.openLightbox = _a.openLightbox, exports.closeLightbox = _a.closeLightbox;
exports.default = exports.slice.reducer;
//# sourceMappingURL=lightbox.js.map