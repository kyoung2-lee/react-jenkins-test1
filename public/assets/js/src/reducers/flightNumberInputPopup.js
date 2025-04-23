"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeFlightNumberInputPopup = exports.openFlightNumberInputPopup = exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    isOpen: false,
    currentFlightNumber: "",
    formName: "",
    fieldName: "",
    executeSubmit: true,
    onEnter: () => { },
    canOnlyAlCd: false,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "flightNumberInputPopup",
    initialState,
    reducers: {
        openFlightNumberInputPopup: (state, action) => {
            state.isOpen = true;
            state.currentFlightNumber = action.payload.currentFlightNumber;
            state.formName = action.payload.formName;
            state.fieldName = action.payload.fieldName;
            state.executeSubmit = action.payload.executeSubmit;
            state.onEnter = action.payload.onEnter;
            state.canOnlyAlCd = action.payload.canOnlyAlCd;
        },
        closeFlightNumberInputPopup: (state) => {
            state.isOpen = false;
        },
    },
});
_a = exports.slice.actions, exports.openFlightNumberInputPopup = _a.openFlightNumberInputPopup, exports.closeFlightNumberInputPopup = _a.closeFlightNumberInputPopup;
exports.default = exports.slice.reducer;
//# sourceMappingURL=flightNumberInputPopup.js.map