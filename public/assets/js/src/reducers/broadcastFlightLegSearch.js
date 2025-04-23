"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitFlightLegForm = exports.resetFlightLegForm = exports.flightLegSubmitFailedField = void 0;
const redux_form_1 = require("redux-form");
const toolkit_1 = require("@reduxjs/toolkit");
// eslint-disable-next-line import/no-cycle
const FlightLegSearchModal_1 = require("../components/organisms/Broadcast/FlightLegSearchModal");
exports.flightLegSubmitFailedField = (0, toolkit_1.createAsyncThunk)("broadcastFlightLegSearch/flightLegSubmitFailedField", (arg, thunkAPI) => {
    const { fields } = arg;
    const { dispatch } = thunkAPI;
    dispatch((0, redux_form_1.setSubmitFailed)(FlightLegSearchModal_1.FORM_NAME, ...fields));
});
exports.resetFlightLegForm = (0, toolkit_1.createAsyncThunk)("broadcastFlightLegSearch/resetFlightLegForm", (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch((0, redux_form_1.reset)(FlightLegSearchModal_1.FORM_NAME));
});
exports.submitFlightLegForm = (0, toolkit_1.createAsyncThunk)("broadcastFlightLegSearch/submitFlightLegForm", (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch((0, redux_form_1.submit)(FlightLegSearchModal_1.FORM_NAME));
});
//# sourceMappingURL=broadcastFlightLegSearch.js.map