/* tslint:disable:no-console */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WebApi } from "../lib/webApi";
import { AppDispatch } from "../store/storeType";

export interface EmailState {
  fetching: boolean;
  template: Broadcast.Email.Template | Record<string, unknown>;
  isOpenMailAddressDetailModal: boolean;
  creatingTemplate: boolean;
  updatingTemplate: boolean;
  sending: boolean;
}

const initialState: EmailState = {
  fetching: false,
  template: {},
  isOpenMailAddressDetailModal: false,
  creatingTemplate: false,
  updatingTemplate: false,
  sending: false,
};

export const fetchEmailTemplate = createAsyncThunk<
  Broadcast.Email.FetchTemplateResponse | null,
  {
    templateId: number;
  },
  { dispatch: AppDispatch }
>("broadcastEmail/fetchEmailTemplate", async (arg, thunkAPI) => {
  const { templateId } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestFetchTemplate());
  try {
    const response = await WebApi.getBroadcastEmailTemplate(dispatch, { templateId });
    const { data } = response;
    dispatch(slice.actions.successFetchTemplate({ data }));
    const { ...rest } = response.data;
    return rest;
  } catch (error) {
    dispatch(slice.actions.failureFetchTemplate());
    return null;
  }
});

export const storeEmailTemplate = createAsyncThunk<
  Broadcast.Email.StoreTemplateResponse | null,
  Broadcast.Email.StoreTemplateRequest,
  { dispatch: AppDispatch }
>("broadcastEmail/storeEmailTemplate", async (arg, thunkAPI) => {
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestStoreTemplate());
  try {
    const response = await WebApi.postBroadcastEmailTemplate(dispatch, arg);
    dispatch(slice.actions.successStoreTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureStoreTemplate());
    return null;
  }
});

export const updateEmailTemplate = createAsyncThunk<
  Broadcast.Email.UpdateTemplateResponse | null,
  {
    params: Broadcast.Email.UpdateTemplateRequest;
    callbacks: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("broadcastEmail/updateEmailTemplate", async (arg, thunkAPI) => {
  const { params, callbacks } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestUpdateTemplate());
  try {
    const response = await WebApi.postBroadcastEmailTemplateUpdate(dispatch, params, callbacks);
    dispatch(slice.actions.successUpdateTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureUpdateTemplate());
    return null;
  }
});

export const sendEmail = createAsyncThunk<Broadcast.Email.SendResponse | null, Broadcast.Email.SendRequest, { dispatch: AppDispatch }>(
  "broadcastEmail/sendEmail",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.requestSend());
    try {
      const response = await WebApi.postBroadcastEmail(dispatch, arg);
      dispatch(slice.actions.successSend());
      return response.data;
    } catch (error) {
      dispatch(slice.actions.failureSend());
      return null;
    }
  }
);

export const slice = createSlice({
  name: "broadcastEmail",
  initialState,
  reducers: {
    openMailAddressDetailModal: (state) => {
      state.isOpenMailAddressDetailModal = true;
    },
    closeMailAddressDetailModal: (state) => {
      state.isOpenMailAddressDetailModal = false;
    },
    requestFetchTemplate: (state) => {
      state.fetching = true;
    },
    successFetchTemplate: (
      state,
      action: PayloadAction<{
        data: Broadcast.Email.FetchTemplateResponse;
      }>
    ) => {
      const { ...rest } = action.payload.data;
      state.template = rest;
      state.fetching = false;
    },
    failureFetchTemplate: (state) => {
      state.template = {};
      state.fetching = false;
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
  },
});

export const { openMailAddressDetailModal, closeMailAddressDetailModal } = slice.actions;

export default slice.reducer;
