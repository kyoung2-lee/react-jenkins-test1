import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store/storeType";
import { WebApi, ApiError } from "../lib/webApi";

export const openOalFuelModal = createAsyncThunk<void, FlightKey, { dispatch: AppDispatch; state: RootState }>(
  "oalFuel/openOalFuelModal",
  async (arg, thunkAPI) => {
    const flightKey = arg;
    const { dispatch, getState } = thunkAPI;
    const onlineDbExpDays = getState().account.master.oalOnlineDbExpDays;
    dispatch(slice.actions.fetchOalFuel({ flightKey }));
    try {
      const callbacks: WebApi.Callbacks = {
        onNotFoundRecord: () => dispatch(closeOalFuel()),
        onConflict: () => dispatch(closeOalFuel()),
      };
      const response = await WebApi.getOalFuel(dispatch, { ...flightKey, onlineDbExpDays }, callbacks);
      dispatch(slice.actions.fetchOalFuelSuccess({ data: response.data }));
      return;
    } catch (error) {
      const statusCode = error instanceof ApiError && error.response ? error.response.status : null;
      dispatch(slice.actions.fetchOalFuelFailure());
      if (statusCode !== 404 && statusCode !== 409) {
        // 404, 409は、メッセージのボタンで閉じるため対象外
        dispatch(closeOalFuel());
      }
    }
  }
);

function makeUpdateParams(flightKey: FlightKey, formValue: OalFuelFormParams): OalFuelApi.Post.Request {
  return {
    ...flightKey,
    rampFuelWt: formValue.rampFuelWt ? Number(formValue.rampFuelWt) : null,
    rampFuelCat: formValue.rampFuelCat,
  };
}

export const updateOalFuel = createAsyncThunk<void, OalFuelFormParams, { dispatch: AppDispatch; state: RootState }>(
  "oalFuel/updateOalFuel",
  async (arg, thunkAPI) => {
    const formValue = arg;
    const { dispatch, getState } = thunkAPI;
    const { flightKey } = getState().oalFuel;
    if (!flightKey) return;
    try {
      const callbacks: WebApi.Callbacks = {
        onNotFoundRecord: () => dispatch(closeOalFuel()),
      };
      await WebApi.postOalFuel(dispatch, makeUpdateParams(flightKey, formValue), callbacks);
      dispatch(closeOalFuel());
    } catch (error) {
      // 何もしない
    }
  }
);

export interface OalFuelState extends OalFuelFormParams {
  isOpen: boolean;
  flightKey: FlightKey | null;
  fetching: boolean;
  flightDetailHeader: OalFuelApi.Get.FlightDetailHeader | null;
}

export interface OalFuelFormParams {
  rampFuelWt: string;
  rampFuelCat: string;
}

export interface FlightKey {
  orgDateLcl: string;
  alCd: string;
  fltNo: string;
  casFltNo: string;
  skdDepApoCd: string;
  skdArrApoCd: string;
  skdLegSno: number;
}

const initialState: OalFuelState = {
  isOpen: false,
  flightKey: null,
  fetching: false,
  flightDetailHeader: null,
  rampFuelWt: "",
  rampFuelCat: "",
};

export const slice = createSlice({
  name: "oalFuel",
  initialState,
  reducers: {
    closeOalFuel: (_state) => initialState,
    fetchOalFuel: (state, action: PayloadAction<{ flightKey: FlightKey }>) => {
      state.isOpen = true;
      state.flightKey = action.payload.flightKey;
      state.fetching = true;
      state.rampFuelWt = "";
      state.rampFuelCat = "";
    },
    fetchOalFuelSuccess: (state, action: PayloadAction<{ data: OalFuelApi.Get.Response }>) => {
      state.fetching = false;
      state.flightDetailHeader = action.payload.data.flightDetailHeader;
      state.rampFuelWt =
        action.payload.data.rampFuelWt || action.payload.data.rampFuelWt === 0 ? action.payload.data.rampFuelWt.toString() : "";
      state.rampFuelCat = action.payload.data.rampFuelCat;
    },
    fetchOalFuelFailure: (state) => {
      state.fetching = false;
      state.flightDetailHeader = null;
      state.rampFuelWt = "";
      state.rampFuelCat = "";
    },
  },
});

export const { closeOalFuel } = slice.actions;

export default slice.reducer;
