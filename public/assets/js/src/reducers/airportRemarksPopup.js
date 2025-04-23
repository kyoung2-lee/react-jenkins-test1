"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAirportRemarksPopup = exports.openAirportRemarksPopup = exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    isOpen: false,
    airportRemarks: "",
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "airportRemarksPopup",
    initialState,
    reducers: {
        openAirportRemarksPopup: (state) => {
            state.isOpen = true;
        },
        closeAirportRemarksPopup: (state) => {
            state.isOpen = false;
        },
    },
});
_a = exports.slice.actions, exports.openAirportRemarksPopup = _a.openAirportRemarksPopup, exports.closeAirportRemarksPopup = _a.closeAirportRemarksPopup;
exports.default = exports.slice.reducer;
//# sourceMappingURL=airportRemarksPopup.js.map