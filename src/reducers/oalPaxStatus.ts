import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WebApi, ApiError } from "../lib/webApi";
import { AppDispatch, RootState } from "../store/storeType";

export const openOalPaxStatusModal = createAsyncThunk<
  void,
  { forcusInputName: ForcusInputName; flightKey: OalPaxStatusApi.Get.FlightKey },
  { dispatch: AppDispatch; state: RootState }
>("oalPaxStatus/openOalPaxStatusModal", async (arg, thunkAPI) => {
  const { forcusInputName, flightKey } = arg;
  const { dispatch, getState } = thunkAPI;
  const onlineDbExpDays = getState().account.master.oalOnlineDbExpDays;
  dispatch(slice.actions.fetchOalPaxStatus({ forcusInputName, flightKey: { ...flightKey, onlineDbExpDays } }));
  try {
    const callbacks = {
      onNotFoundRecord: () => dispatch(closeOalPaxStatusModal()),
      onConflict: () => dispatch(closeOalPaxStatusModal()),
    };
    const response = await WebApi.getOalPaxStatus(dispatch, { ...flightKey, onlineDbExpDays }, callbacks);
    dispatch(slice.actions.fetchOalPaxStatusSuccess(response.data));
    return;
  } catch (error) {
    const statusCode = error instanceof ApiError && error.response ? error.response.status : null;
    dispatch(slice.actions.fetchOalPaxStatusFailure());
    if (statusCode !== 404 && statusCode !== 409) {
      // 404, 409は、メッセージのボタンで閉じるため対象外
      dispatch(closeOalPaxStatusModal());
    }
  }
});

export const updateOalPaxStatus = createAsyncThunk<
  void,
  OalPaxStatusApi.Post.OalPaxStatusFormParams,
  { dispatch: AppDispatch; state: RootState }
>("oalPaxStatus/updateOalPaxStatus", async (arg, thunkAPI) => {
  const formValue = arg;
  const { dispatch, getState } = thunkAPI;
  const { flightKey } = getState().oalPaxStatus;
  if (!flightKey) return;
  try {
    const callbacks = {
      onNotFoundRecord: () => dispatch(closeOalPaxStatusModal()),
    };
    await WebApi.postOalPaxStatus(dispatch, { ...flightKey, ...formValue }, callbacks);
    dispatch(closeOalPaxStatusModal());
  } catch (error) {
    // 何もしない
  }
});

export interface OalPaxStatusState {
  isOpen: boolean;
  forcusInputName: ForcusInputName | null;
  flightKey: OalPaxStatusApi.Get.Request | null;
  fetching: boolean;
  flightDetailHeader: OalPaxStatusApi.Get.FlightDetailHeader | null;
  acceptanceSts: string | null;
  boardingSts: string | null;
  depGateNo: string | null;
}

export type ForcusInputName = "depGateNo" | "acceptanceSts" | "boardingSts";

const initialState: OalPaxStatusState = {
  isOpen: false,
  forcusInputName: null,
  flightKey: null,
  fetching: false,
  flightDetailHeader: null,
  acceptanceSts: null,
  boardingSts: null,
  depGateNo: null,
};

export const slice = createSlice({
  name: "oalPaxStatus",
  initialState,
  reducers: {
    closeOalPaxStatusModal: (state) => {
      state.isOpen = false;
      state.forcusInputName = null;
      state.flightKey = null;
      state.flightDetailHeader = null;
      state.acceptanceSts = null;
      state.boardingSts = null;
      state.depGateNo = null;
    },
    fetchOalPaxStatus: (state, action: PayloadAction<{ forcusInputName: ForcusInputName; flightKey: OalPaxStatusApi.Get.Request }>) => {
      const { forcusInputName, flightKey } = action.payload;
      state.isOpen = true;
      state.fetching = true;
      state.forcusInputName = forcusInputName;
      state.flightKey = flightKey;
    },
    fetchOalPaxStatusSuccess: (state, action: PayloadAction<OalPaxStatusApi.Get.Response>) => {
      const { flightDetailHeader, acceptanceSts, boardingSts, depGateNo } = action.payload;
      state.fetching = false;
      state.flightDetailHeader = flightDetailHeader;
      state.acceptanceSts = acceptanceSts;
      state.boardingSts = boardingSts;
      state.depGateNo = depGateNo;
    },
    fetchOalPaxStatusFailure: (state) => {
      state.fetching = false;
      state.flightDetailHeader = null;
      state.acceptanceSts = null;
      state.boardingSts = null;
      state.depGateNo = null;
    },
  },
});

export const { closeOalPaxStatusModal } = slice.actions;

export default slice.reducer;
