/* tslint:disable:no-console */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WebApi } from "../lib/webApi";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { convertCRLFCodeToLineFeed } from "../lib/commonUtil";
import { AppDispatch } from "../store/storeType";

export interface AftnState {
  fetching: boolean;
  template: Broadcast.Aftn.Template | Record<string, unknown>;
  isOpenAftnAddressDetailModal: boolean;
  sending: boolean;
  updatingTemplate: boolean;
  creatingTemplate: boolean;
}

const initialState: AftnState = {
  fetching: false,
  template: {},
  isOpenAftnAddressDetailModal: false,
  sending: false,
  updatingTemplate: false,
  creatingTemplate: false,
};

export const fetchAftnTemplate = createAsyncThunk<
  Broadcast.Aftn.FetchTemplateResponse | null,
  {
    templateId: number;
  },
  { dispatch: AppDispatch }
>("broadcastAftn/fetchAftnTemplate", async (arg, thunkAPI) => {
  const { templateId } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestFetchTemplate());
  try {
    const response = await WebApi.getBroadcastAftnTemplate(dispatch, { templateId });
    const { data } = response;
    dispatch(slice.actions.successFetchTemplate({ data }));
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureFetchTemplate());
    return null;
  }
});

export const storeAftnTemplate = createAsyncThunk<
  Broadcast.Aftn.StoreTemplateResponse | null,
  Broadcast.Aftn.StoreTemplateRequest,
  { dispatch: AppDispatch }
>("broadcastAftn/storeAftnTemplate", async (arg, thunkAPI) => {
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestStoreTemplate());
  try {
    const response = await WebApi.postBroadcastAftnTemplate(dispatch, arg);
    dispatch(slice.actions.successStoreTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureStoreTemplate());
    return null;
  }
});

export const updateAftnTemplate = createAsyncThunk<
  Broadcast.Aftn.UpdateTemplateResponse | null,
  {
    params: Broadcast.Aftn.UpdateTemplateRequest;
    callbacks: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("broadcastAftn/updateAftnTemplate", async (arg, thunkAPI) => {
  const { params, callbacks } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestUpdateTemplate());
  try {
    const response = await WebApi.postBroadcastAftnTemplateUpdate(dispatch, params, callbacks);
    dispatch(slice.actions.successUpdateTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureUpdateTemplate());
    return null;
  }
});

export const sendAftn = createAsyncThunk<void, Broadcast.Aftn.SendRequest, { dispatch: AppDispatch }>(
  "broadcastAftn/sendAftn",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.requestSend());
    try {
      await WebApi.postBroadcastAftn(dispatch, arg, false);
    } catch (error) {
      dispatch(slice.actions.failureSend());
      return;
    }
    try {
      const ttyArg: Broadcast.Tty.SendRequest = {
        ttyAddrList: [arg.originator],
        ttyPriorityCd: arg.priority,
        orgnTtyAddr: arg.originator,
        ttyText: arg.aftnText,
        templateId: null,
      };
      await WebApi.postBroadcastTty(dispatch, ttyArg, true, false);
      dispatch(slice.actions.successSend());
    } catch (error) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40024C({}) });
      dispatch(slice.actions.failureSend());
    }
  }
);

export const slice = createSlice({
  name: "broadcastAftn",
  initialState,
  reducers: {
    openAddressDetailModal: (state) => {
      state.isOpenAftnAddressDetailModal = true;
    },
    closeAddressDetailModal: (state) => {
      state.isOpenAftnAddressDetailModal = false;
    },
    requestFetchTemplate: (state) => {
      state.fetching = true;
    },
    successFetchTemplate: (
      state,
      action: PayloadAction<{
        data: Broadcast.Aftn.FetchTemplateResponse;
      }>
    ) => {
      state.fetching = false;
      state.template = {
        ...action.payload.data,
        // DB上のAFTN_TEXTの保存は、CRLF形式であることへの対応
        aftnText: convertCRLFCodeToLineFeed(action.payload.data.aftnText),
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
