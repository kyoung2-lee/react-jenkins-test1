import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WebApi } from "../lib/webApi";
import { NotificationCreator } from "../lib/notifications";
import { AppDispatch } from "../store/storeType";

export interface BarChartState {
  focusArrDepCtrlSeq: number;
  isSpotChangeMode: boolean;
  isError: boolean;
}

const initialState: BarChartState = {
  focusArrDepCtrlSeq: -1,
  isSpotChangeMode: false,
  isError: false,
};

export const updateSpotRemarks = createAsyncThunk<
  void,
  {
    apoCd: string;
    spotNo: string;
    spotRmks: string;
    closeSpotRemarksModal: () => void;
  },
  { dispatch: AppDispatch }
>("barChart/updateSpotRemarks", async (arg, thunkAPI) => {
  const { dispatch } = thunkAPI;
  try {
    const response = await WebApi.postSpotRemarks(dispatch, arg);
    dispatch(slice.actions.fetchUpdateSpotRemarksSuccess(response));
    arg.closeSpotRemarksModal();
  } catch (error) {
    dispatch(slice.actions.fetchUpdateSpotRemarksFailure({ error: error as Error, retry: () => updateSpotRemarks(arg) }));
  }
});

export const showMessage = createAsyncThunk<void, NotificationCreator.Message, { dispatch: AppDispatch }>(
  "broadcast/showMessage",
  (message, { dispatch }) => {
    NotificationCreator.create({ dispatch, message });
  }
);

export const slice = createSlice({
  name: "barChart",
  initialState,
  reducers: {
    focusDupChart: (state, action: PayloadAction<{ focusArrDepCtrlSeq: number }>) => {
      const { focusArrDepCtrlSeq } = action.payload;
      state.focusArrDepCtrlSeq = focusArrDepCtrlSeq;
    },
    resetFocusDupChart: (state) => {
      state.focusArrDepCtrlSeq = initialState.focusArrDepCtrlSeq;
    },
    updateSpotChangeMode: (state, action: PayloadAction<boolean>) => {
      state.isSpotChangeMode = action.payload;
    },
    fetchUpdateSpotRemarksSuccess: (state, _action: PayloadAction<{ data: SpotRemarksApi.Post.Response }>) => {
      state.isError = false;
    },
    fetchUpdateSpotRemarksFailure: (state, _action: PayloadAction<{ error: Error; retry: () => void }>) => {
      state.isError = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateSpotRemarks.fulfilled, () => {});
  },
});

export const { focusDupChart, resetFocusDupChart, updateSpotChangeMode } = slice.actions;

export default slice.reducer;
