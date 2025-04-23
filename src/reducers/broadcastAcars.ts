/* tslint:disable:no-console */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WebApi } from "../lib/webApi";
import { convertCRLFCodeToLineFeed } from "../lib/commonUtil";
import { AppDispatch } from "../store/storeType";

export interface AcarsState {
  fetching: boolean;
  template: Broadcast.Acars.Template[] | Record<string, unknown>;
  creatingTemplate: boolean;
  updatingTemplate: boolean;
  sending: boolean;
}

const initialState: AcarsState = {
  fetching: false,
  template: {},
  creatingTemplate: false,
  updatingTemplate: false,
  sending: false,
};

export const fetchAcarsTemplate = createAsyncThunk<
  Broadcast.Acars.FetchTemplateResponse | null,
  {
    templateId: number;
  },
  { dispatch: AppDispatch }
>("broadcastAcars/fetchAcarsTemplate", async (arg, thunkAPI) => {
  const { templateId } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestFetchTemplate());
  try {
    const response = await WebApi.getBroadcastAcarsTemplate(dispatch, { templateId });
    const { data } = response;

    dispatch(slice.actions.successFetchTemplate({ data }));
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureFetchTemplate());
    return null;
  }
});

export const storeAcarsTemplate = createAsyncThunk<
  Broadcast.Acars.StoreTemplateResponse | null,
  Broadcast.Acars.StoreTemplateRequest,
  { dispatch: AppDispatch }
>("broadcastAcars/storeAcarsTemplate", async (arg, thunkAPI) => {
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestStoreTemplate());
  try {
    const response = await WebApi.postBroadcastAcarsTemplate(dispatch, arg);
    dispatch(slice.actions.successStoreTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureStoreTemplate());
    return null;
  }
});

export const updateAcarsTemplate = createAsyncThunk<
  Broadcast.Acars.UpdateTemplateResponse | null,
  {
    params: Broadcast.Acars.UpdateTemplateRequest;
    callbacks: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("broadcastAcars/updateAcarsTemplate", async (arg, thunkAPI) => {
  const { params, callbacks } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestUpdateTemplate());
  try {
    const response = await WebApi.postBroadcastAcarsTemplateUpdate(dispatch, params, callbacks);
    dispatch(slice.actions.successUpdateTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureUpdateTemplate());
    return null;
  }
});

export const sendAcars = createAsyncThunk<void, Broadcast.Acars.SendRequest, { dispatch: AppDispatch }>(
  "broadcastAcars/sendAcars",
  async (arg, thunkAPI) => {
    const params = arg;
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.requestSend());
    try {
      await WebApi.postBroadcastAcars(dispatch, params);
      dispatch(slice.actions.successSend());
    } catch (error) {
      dispatch(slice.actions.failureSend());
    }
  }
);

export const slice = createSlice({
  name: "broadcastAcars",
  initialState,
  reducers: {
    requestFetchTemplate: (state) => {
      state.fetching = true;
    },
    successFetchTemplate: (
      state,
      action: PayloadAction<{
        data: Broadcast.Acars.FetchTemplateResponse;
      }>
    ) => {
      state.fetching = false;
      state.template = {
        ...action.payload.data,
        // DB上のUPLINK_TEXTの保存は、CRLF形式であることへの対応
        uplinkText: convertCRLFCodeToLineFeed(action.payload.data.uplinkText),
      };
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

export default slice.reducer;
