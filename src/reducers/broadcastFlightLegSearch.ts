import { reset, setSubmitFailed, submit } from "redux-form";
import { createAsyncThunk } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import { FORM_NAME } from "../components/organisms/Broadcast/FlightLegSearchModal";
import { AppDispatch } from "../store/storeType";

export const flightLegSubmitFailedField = createAsyncThunk<void, { fields: string[] }, { dispatch: AppDispatch }>(
  "broadcastFlightLegSearch/flightLegSubmitFailedField",
  (arg, thunkAPI) => {
    const { fields } = arg;
    const { dispatch } = thunkAPI;
    dispatch(setSubmitFailed(FORM_NAME, ...fields));
  }
);

export const resetFlightLegForm = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  "broadcastFlightLegSearch/resetFlightLegForm",
  (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(reset(FORM_NAME));
  }
);

export const submitFlightLegForm = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  "broadcastFlightLegSearch/submitFlightLegForm",
  (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(submit(FORM_NAME));
  }
);
