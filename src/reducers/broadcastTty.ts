/* tslint:disable:no-console */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WebApi } from "../lib/webApi";
import { AppDispatch } from "../store/storeType";
import { convertCRLFCodeToLineFeed } from "../lib/commonUtil";

export interface TtyState {
  fetching: boolean;
  template: Broadcast.Tty.Template | Record<string, unknown>;
  isOpenTtyAddressDetailModal: boolean;
  sending: boolean;
  updatingTemplate: boolean;
  creatingTemplate: boolean;
}

const initialState = {
  fetching: false,
  template: {},
  isOpenTtyAddressDetailModal: false,
  sending: false,
  updatingTemplate: false,
  creatingTemplate: false,
};

export const fetchTtyTemplate = createAsyncThunk<
  Broadcast.Tty.FetchTemplateResponse | null,
  {
    templateId: number;
  },
  { dispatch: AppDispatch }
>("broadcastTty/fetchTtyTemplate", async (arg, thunkAPI) => {
  const { templateId } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestFetchTemplate());
  try {
    const response = await WebApi.getBroadcastTtyTemplate(dispatch, { templateId });
    const { data } = response;
    dispatch(slice.actions.successFetchTemplate({ data }));
    const { ...rest } = response.data;
    return rest;
  } catch (error) {
    dispatch(slice.actions.failureFetchTemplate());
    return null;
  }
});

export const storeTtyTemplate = createAsyncThunk<
  Broadcast.Tty.StoreTemplateResponse | null,
  Broadcast.Tty.StoreTemplateRequest,
  { dispatch: AppDispatch }
>("broadcastTty/storeTtyTemplate", async (arg, thunkAPI) => {
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestStoreTemplate());
  try {
    const response = await WebApi.postBroadcastTtyTemplate(dispatch, arg);
    dispatch(slice.actions.successStoreTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureStoreTemplate());
    return null;
  }
});

export const updateTtyTemplate = createAsyncThunk<
  Broadcast.Tty.UpdateTemplateResponse | null,
  {
    params: Broadcast.Tty.UpdateTemplateRequest;
    callbacks: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("broadcastTty/updateTtyTemplate", async (arg, thunkAPI) => {
  const { params, callbacks } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestUpdateTemplate());
  try {
    const response = await WebApi.postBroadcastTtyTemplateUpdate(dispatch, params, callbacks);
    dispatch(slice.actions.successUpdateTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureUpdateTemplate());
    return null;
  }
});

export const sendTty = createAsyncThunk<Broadcast.Tty.SendResponse | null, Broadcast.Tty.SendRequest, { dispatch: AppDispatch }>(
  "broadcastTty/sendTty",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.requestSend());
    try {
      const response = await WebApi.postBroadcastTty(dispatch, arg);
      dispatch(slice.actions.successSend());
      return response.data;
    } catch (error) {
      dispatch(slice.actions.failureSend());
      return null;
    }
  }
);

export const slice = createSlice({
  name: "broadcastTty",
  initialState,
  reducers: {
    openTtyAddressDetailModal: (state) => {
      state.isOpenTtyAddressDetailModal = true;
    },
    closeTtyAddressDetailModal: (state) => {
      state.isOpenTtyAddressDetailModal = false;
    },
    requestFetchTemplate: (state) => {
      state.fetching = true;
    },
    successFetchTemplate: (
      state,
      action: PayloadAction<{
        data: Broadcast.Tty.FetchTemplateResponse;
      }>
    ) => {
      const { ...rest } = action.payload.data;
      state.template = {
        ...rest,
        // DB上のTTY_TEXTの保存は、CRLF形式であることへの対応
        ttyText: convertCRLFCodeToLineFeed(action.payload.data.ttyText),
      };
      state.fetching = false;
    },
    failureFetchTemplate: (state) => {
      state.template = {};
      state.fetching = false;
    },
    requestStoreTemplate: (state) => {
      state.creatingTemplate = true;
    },
    successStoreTemplate: (state) => {
      state.creatingTemplate = false;
    },
    failureStoreTemplate: (state) => {
      state.creatingTemplate = false;
    },
    requestUpdateTemplate: (state) => {
      state.updatingTemplate = true;
    },
    successUpdateTemplate: (state) => {
      state.updatingTemplate = false;
    },
    failureUpdateTemplate: (state) => {
      state.updatingTemplate = false;
    },
    requestSend: (state) => {
      state.sending = true;
    },
    successSend: (state) => {
      state.sending = false;
    },
    failureSend: (state) => {
      state.sending = false;
    },
  },
});

export const { openTtyAddressDetailModal, closeTtyAddressDetailModal } = slice.actions;

export default slice.reducer;
