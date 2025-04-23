"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDateTimeInputPopup = exports.openDateTimeInputPopup = exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    isOpen: false,
    param: {
        valueFormat: "YYYY-MM-DD[T]HH:mm:ss",
        currentValue: "",
    },
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "dateTimeInputPopup",
    initialState,
    reducers: {
        openDateTimeInputPopup: (state, action) => {
            state.isOpen = true;
            state.param = action.payload;
        },
        closeDateTimeInputPopup: (state) => {
            state.isOpen = false;
            state.param = initialState.param;
        },
    },
});
_a = exports.slice.actions, exports.openDateTimeInputPopup = _a.openDateTimeInputPopup, exports.closeDateTimeInputPopup = _a.closeDateTimeInputPopup;
exports.default = exports.slice.reducer;
//# sourceMappingURL=dateTimeInputPopup.js.map