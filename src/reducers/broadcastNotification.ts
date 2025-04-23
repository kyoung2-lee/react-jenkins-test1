/* tslint:disable:no-console */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { WebApi } from "../lib/webApi";
import { AppDispatch } from "../store/storeType";
import { arrangeTemplatesJobIdList } from "../lib/commonUtil";

export interface NotificationState {
  fetching: boolean;
  template: Broadcast.Ntf.Template | Record<string, unknown>;
  isOpenNotificationAddressDetailModal: boolean;
  notificationAddressDetail: string[];
  creatingTemplate: boolean;
  updatingTemplate: boolean;
  sending: boolean;
}

const initialState: NotificationState = {
  fetching: false,
  template: {},
  isOpenNotificationAddressDetailModal: false,
  notificationAddressDetail: [],
  creatingTemplate: false,
  updatingTemplate: false,
  sending: false,
};

export const fetchNotificationTemplate = createAsyncThunk<
  Broadcast.Ntf.FetchTemplateResponse | null,
  {
    templateId: number;
    templateJobId: number | null;
    userJobId: number | null;
  },
  { dispatch: AppDispatch }
>("broadcastNotification/fetchNotificationTemplate", async (arg, thunkAPI) => {
  const { templateId, templateJobId, userJobId } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestFetchTemplate());
  try {
    if (templateJobId === null) {
      throw Error("invalid templateJobId");
    }
    if (userJobId === null) {
      throw Error("invalid userJobId");
    }
    const response = await WebApi.getBroadcastNtfTemplate(dispatch, { templateId });
    const { data } = response;
    data.jobIdList = arrangeTemplatesJobIdList(data.jobIdList, userJobId, templateJobId);
    dispatch(slice.actions.successFetchTemplate({ data }));
    const { ...rest } = response.data;
    return rest;
  } catch (error) {
    dispatch(slice.actions.failureFetchTemplate());
    return null;
  }
});

export const storeNotificationTemplate = createAsyncThunk<
  Broadcast.Ntf.StoreTemplateResponse | null,
  Broadcast.Ntf.StoreTemplateRequest,
  { dispatch: AppDispatch }
>("broadcastNotification/storeNotificationTemplate", async (arg, thunkAPI) => {
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestStoreTemplate());
  try {
    const response = await WebApi.postBroadcastNtfTemplate(dispatch, arg);
    dispatch(slice.actions.successStoreTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureStoreTemplate());
    return null;
  }
});

export const updateNotificationTemplate = createAsyncThunk<
  Broadcast.Ntf.UpdateTemplateResponse | null,
  {
    params: Broadcast.Ntf.UpdateTemplateRequest;
    callbacks: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("broadcastNotification/updateNotificationTemplate", async (arg, thunkAPI) => {
  const { params, callbacks } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestUpdateTemplate());
  try {
    const response = await WebApi.postBroadcastNtfTemplateUpdate(dispatch, params, callbacks);
    dispatch(slice.actions.successUpdateTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureUpdateTemplate());
    return null;
  }
});

export const sendNotification = createAsyncThunk<Broadcast.Ntf.SendResponse | null, Broadcast.Ntf.SendRequest, { dispatch: AppDispatch }>(
  "broadcastNotification/sendNotification",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.requestSend());
    try {
      const response = await WebApi.postBroadcastNtf(dispatch, arg);
      dispatch(slice.actions.successSend());
      return response.data;
    } catch (error) {
      dispatch(slice.actions.failureSend());
      return null;
    }
  }
);

export const slice = createSlice({
  name: "broadcastNotification",
  initialState,
  reducers: {
    openNotificationAddressDetailModal: (state) => {
      state.isOpenNotificationAddressDetailModal = true;
    },
    closeNotificationAddressDetailModal: (state) => {
      state.isOpenNotificationAddressDetailModal = false;
    },
    requestFetchTemplate: (state) => {
      state.fetching = true;
    },
    successFetchTemplate: (
      state,
      action: PayloadAction<{
        data: Broadcast.Ntf.FetchTemplateResponse;
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

export const { openNotificationAddressDetailModal, closeNotificationAddressDetailModal } = slice.actions;

export default slice.reducer;
