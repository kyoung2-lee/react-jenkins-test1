import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store/storeType";

import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { WebApi } from "../lib/webApi";

export const openEditRmksPopup = createAsyncThunk<
  void,
  {
    flightDetailKey: FlightDetailKey;
    mode: "DEP" | "ARR";
    position: Position;
  },
  { dispatch: AppDispatch; state: RootState }
>("editRmksPopup/openEditrmksPopup", async (arg, thunkAPI) => {
  const { flightDetailKey, mode, position } = arg;
  const { dispatch, getState } = thunkAPI;
  const onlineDbExpDays = flightDetailKey.oalTblFlg
    ? getState().account.master.oalOnlineDbExpDays
    : getState().account.master.onlineDbExpDays;
  const params = {
    myApoCd: flightDetailKey.myApoCd,
    orgDateLcl: flightDetailKey.orgDateLcl,
    alCd: flightDetailKey.alCd,
    fltNo: flightDetailKey.fltNo,
    casFltNo: flightDetailKey.casFltNo || "",
    skdDepApoCd: flightDetailKey.skdDepApoCd,
    skdArrApoCd: flightDetailKey.skdArrApoCd,
    skdLegSno: flightDetailKey.skdLegSno,
    oalTblFlg: flightDetailKey.oalTblFlg,
    onlineDbExpDays,
  };

  dispatch(fetchRmks({ mode, position }));
  try {
    // 便リマークスは、便詳細APIで取得している
    const response = await WebApi.getFlightDetail(dispatch, params);
    dispatch(fetchRmksSuccess({ response: response.data, params, mode, position }));
  } catch (err) {
    dispatch(fetchRmksFailure({ error: err as Error }));
  }
});

export const updateFlightRmks = createAsyncThunk<void, FlightRmksApi.Request, { dispatch: AppDispatch; state: RootState }>(
  "editRmksPopup/updateFlightRmks",
  async (arg, thunkAPI) => {
    const params = arg;
    const { dispatch } = thunkAPI;
    try {
      const callbacks: WebApi.Callbacks = {
        onNotFoundRecord: () => dispatch(closeEditRmksPopup()),
      };
      const response = await WebApi.postFlightRemarks(dispatch, params, callbacks);
      dispatch(updateFlightRmksSuccess({ response: response.data, params }));
      dispatch(closeEditRmksPopup());
    } catch (err) {
      dispatch(updateFlightRmksFailure({ error: err as Error }));
    }
  }
);

export const showNotificationNoChange = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "editRmksPopup/showNotificationNoChange",
  (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    return NotificationCreator.create({ dispatch, message: SoalaMessage.M40002C({}) });
  }
);

export const showConfirmation = createAsyncThunk<void, { onClickYes: () => void }, { dispatch: AppDispatch; state: RootState }>(
  "editRmksPopup/showConfirmation",
  (arg, thunkAPI) => {
    const { onClickYes } = arg;
    const { dispatch } = thunkAPI;
    return NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: onClickYes }) });
  }
);

export interface FlightDetailKey {
  myApoCd: string;
  orgDateLcl: string;
  alCd: string;
  fltNo: string;
  casFltNo: string | null;
  skdDepApoCd: string;
  skdArrApoCd: string;
  skdLegSno: number;
  oalTblFlg: boolean;
}

export interface Position {
  width: number;
  top: number;
  left: number;
}

export interface EditRmksPopupState {
  key: FlightDetailKey | null;
  isOpen: boolean;
  mode: "DEP" | "ARR";
  position: Position;
  rmksText: string;
  orgDateLcl: string;
  alCd: string;
  fltNo: string;
  casFltNo: string;
  lstDepApoCd: string;
  lstArrApoCd: string;
  placeholder: string;
  isEnabled: boolean;
  isFetching: boolean;
  isError: boolean;
}

const initialState: EditRmksPopupState = {
  key: null,
  isOpen: false,
  mode: "DEP",
  position: {
    width: 0,
    top: 0,
    left: 0,
  },
  rmksText: "",
  orgDateLcl: "",
  alCd: "",
  fltNo: "",
  casFltNo: "",
  lstDepApoCd: "",
  lstArrApoCd: "",
  placeholder: "",
  isEnabled: true,
  isFetching: false,
  isError: false,
};

export const slice = createSlice({
  name: "editRmksPopup",
  initialState,
  reducers: {
    closeEditRmksPopup: (state) => {
      Object.assign(state, initialState);
    },
    fetchRmks: (
      state,
      action: PayloadAction<{
        mode: "DEP" | "ARR";
        position: Position;
      }>
    ) => {
      const { mode, position } = action.payload;
      state.isOpen = true; // ここでOPENしないと、なぜかiPadはTextにカーソルが当たらない
      state.mode = mode;
      state.position = position;
      state.isFetching = true;
    },
    fetchRmksSuccess: (
      state,
      action: PayloadAction<{
        response: FlightDetailApi.Response;
        params: FlightDetailKey;
        mode: "DEP" | "ARR";
        position: Position;
      }>
    ) => {
      const { response, params, mode, position } = action.payload;
      const apoCd = mode === "DEP" ? response.dep.lstDepApoCd : response.arr.lstArrApoCd;

      state.key = params;
      state.isOpen = true;
      state.mode = mode;
      state.position = position;
      state.rmksText = mode === "DEP" ? response.dep.depRmksText : response.arr.arrRmksText;
      state.orgDateLcl = response.flight.orgDateLcl;
      state.alCd = response.flight.alCd;
      state.fltNo = response.flight.fltNo;
      state.casFltNo = response.flight.casFltNo;
      state.lstDepApoCd = response.dep.lstDepApoCd;
      state.lstArrApoCd = response.arr.lstArrApoCd;
      state.placeholder = mode === "DEP" ? "DEP Flight Remarks" : "ARR Flight Remarks";
      state.isEnabled = (response.connectDbCat === "O" && params.myApoCd === apoCd) || false;
      state.isFetching = false;
      state.isError = false;
    },
    fetchRmksFailure: (
      state,
      _action: PayloadAction<{
        error: Error;
      }>
    ) => {
      Object.assign(state, initialState);
    },
    updateFlightRmksSuccess: (
      state,
      _action: PayloadAction<{
        response: FlightRmksApi.Response;
        params: FlightRmksApi.Request;
      }>
    ) => {
      state.isError = false;
    },
    updateFlightRmksFailure: (
      _state,
      _action: PayloadAction<{
        error: Error;
      }>
    ) => {},
  },
});

export const { closeEditRmksPopup, fetchRmks, fetchRmksSuccess, fetchRmksFailure, updateFlightRmksSuccess, updateFlightRmksFailure } =
  slice.actions;

export default slice.reducer;
