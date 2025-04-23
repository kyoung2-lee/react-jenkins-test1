import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store/storeType";
import { WebApi, ApiError } from "../lib/webApi";

// Action Creator
export const openOalPaxModal = createAsyncThunk<void, OalPaxApi.Get.FlightKey, { dispatch: AppDispatch; state: RootState }>(
  "oalPax/openOalPaxModal",
  async (arg, thunkAPI) => {
    const flightKey = arg;
    const { dispatch, getState } = thunkAPI;
    const { oalOnlineDbExpDays } = getState().account.master;
    dispatch(slice.actions.fetchOalPax({ ...flightKey, onlineDbExpDays: oalOnlineDbExpDays }));
    try {
      const callbacks: WebApi.Callbacks = {
        onNotFoundRecord: () => dispatch(closeOalPax()),
        onConflict: () => dispatch(closeOalPax()),
      };
      const response = await WebApi.getOalPax(dispatch, { ...flightKey, onlineDbExpDays: oalOnlineDbExpDays }, callbacks);
      dispatch(slice.actions.fetchOalPaxSuccess(response.data));
    } catch (error) {
      const statusCode = error instanceof ApiError && error.response ? error.response.status : null;
      dispatch(slice.actions.fetchOalPaxFailure());
      if (statusCode !== 404 && statusCode !== 409) {
        // 404, 409は、メッセージのボタンで閉じるため対象外
        dispatch(closeOalPax());
      }
    }
  }
);

function makeUpdateParams(flightKey: OalPaxApi.Get.Request, formValue: OalPaxApi.OalPaxFormParams): OalPaxApi.Post.Request {
  const { orgDateLcl, alCd, fltNo, casFltNo, skdDepApoCd, skdArrApoCd, skdLegSno } = flightKey;
  return {
    orgDateLcl,
    alCd,
    fltNo,
    casFltNo,
    skdDepApoCd,
    skdArrApoCd,
    skdLegSno,
    oalLegPaxList: [
      { dataCd: "Salable", paxClsCd: "F", cnt: formatCnt(formValue.salableFCnt) },
      { dataCd: "Salable", paxClsCd: "C", cnt: formatCnt(formValue.salableCCnt) },
      { dataCd: "Salable", paxClsCd: "W", cnt: formatCnt(formValue.salableWCnt) },
      { dataCd: "Salable", paxClsCd: "Y", cnt: formatCnt(formValue.salableYCnt) },
      { dataCd: "Booked", paxClsCd: "F", cnt: formatCnt(formValue.bookedFCnt) },
      { dataCd: "Booked", paxClsCd: "C", cnt: formatCnt(formValue.bookedCCnt) },
      { dataCd: "Booked", paxClsCd: "W", cnt: formatCnt(formValue.bookedWCnt) },
      { dataCd: "Booked", paxClsCd: "Y", cnt: formatCnt(formValue.bookedYCnt) },
      { dataCd: "Actual", paxClsCd: "F", cnt: formatCnt(formValue.actualFCnt) },
      { dataCd: "Actual", paxClsCd: "C", cnt: formatCnt(formValue.actualCCnt) },
      { dataCd: "Actual", paxClsCd: "W", cnt: formatCnt(formValue.actualWCnt) },
      { dataCd: "Actual", paxClsCd: "Y", cnt: formatCnt(formValue.actualYCnt) },
    ] as OalPaxApi.OalLegPax[],
  };
}

function formatCnt(cnt: string) {
  return cnt ? Number(cnt) : null;
}

export const updateOalPax = createAsyncThunk<void, OalPaxApi.OalPaxFormParams, { dispatch: AppDispatch; state: RootState }>(
  "oalPax/updateOalPax",
  async (arg, thunkAPI) => {
    const formValue = arg;
    const { dispatch, getState } = thunkAPI;
    const { flightKey } = getState().oalPax;
    if (!flightKey) return;
    try {
      const callbacks: WebApi.Callbacks = {
        onNotFoundRecord: () => dispatch(closeOalPax()),
      };
      await WebApi.postOalPax(dispatch, makeUpdateParams(flightKey, formValue), callbacks);
      dispatch(closeOalPax());
    } catch (error) {
      // 何もしない
    }
  }
);

export interface OalPaxState {
  isOpen: boolean;
  flightKey: OalPaxApi.Get.Request | null;
  fetching: boolean;
  flightDetailHeader: OalPaxApi.Get.FlightDetailHeader | null;
  oalPaxList: OalPaxApi.OalLegPax[];
}

const initialState: OalPaxState = {
  isOpen: false,
  flightKey: null,
  fetching: false,
  flightDetailHeader: null,
  oalPaxList: [],
};

export const slice = createSlice({
  name: "oalPax",
  initialState,
  reducers: {
    closeOalPax: (state) => {
      Object.assign(state, initialState);
    },
    fetchOalPax: (state, action: PayloadAction<OalPaxApi.Get.Request>) => {
      state.isOpen = true;
      state.flightKey = action.payload;
      state.fetching = true;
    },
    fetchOalPaxSuccess: (state, action: PayloadAction<OalPaxApi.Get.Response>) => {
      state.fetching = false;
      state.flightDetailHeader = action.payload.flightDetailHeader;
      state.oalPaxList = action.payload.oalLegPaxList;
    },
    fetchOalPaxFailure: (state) => {
      state.fetching = false;
      state.flightDetailHeader = null;
      state.oalPaxList = [];
    },
  },
});

export const { closeOalPax } = slice.actions;

export default slice.reducer;
