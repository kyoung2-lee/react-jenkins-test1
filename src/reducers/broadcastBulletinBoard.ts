/* tslint:disable:no-console */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { WebApi } from "../lib/webApi";
import { AppDispatch } from "../store/storeType";
import { arrangeTemplatesJobIdList } from "../lib/commonUtil";

export interface BulletinBoardState {
  fetching: boolean;
  fetchingAllFlightLeg: boolean;
  template: Broadcast.Bb.Template | Record<string, unknown>;
  flightLegs: Broadcast.Bb.FlightLeg[];
  isFlightLegEnabled: boolean;
  isOpenFlightLegSearchModal: boolean;
  isOpenBbAddressDetailModal: boolean;
  fetchingBb: boolean;
  detail: Broadcast.Bb.BulletinBoard | Record<string, unknown>;
  sending: boolean;
  creatingTemplate: boolean;
  updating: boolean;
  updatingTemplate: boolean;
  newBbId: number | null;
}

const initialState: BulletinBoardState = {
  fetching: false,
  isFlightLegEnabled: false,
  fetchingAllFlightLeg: false,
  isOpenFlightLegSearchModal: false,
  isOpenBbAddressDetailModal: false,
  template: {},
  flightLegs: [],
  fetchingBb: false,
  detail: {},
  sending: false,
  creatingTemplate: false,
  updating: false,
  updatingTemplate: false,
  newBbId: null,
};

export const fetchBulletinBoardTemplate = createAsyncThunk<
  {
    commonHeader: CommonApi.CommonHeader;
    templateId: number;
    catCdList: string[];
    commGrpIdList: number[];
    jobGrpIdList: number[];
    jobIdList: number[];
    bbTitle: string;
    bbText: string;
  } | null,
  {
    templateId: number;
    templateJobId: number | null;
    userJobId: number | null;
  },
  { dispatch: AppDispatch }
>("broadcastBulletinBoard/fetchBulletinBoardTemplate", async (arg, thunkAPI) => {
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
    const response = await WebApi.getBroadcastBbTemplate(dispatch, { templateId });
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

export const fetchBulletinBoard = createAsyncThunk<
  void,
  {
    bbId: number;
    archiveFlg: boolean;
    callbacks?: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("broadcastBulletinBoard/fetchBulletinBoard", async (arg, thunkAPI) => {
  const { bbId, archiveFlg, callbacks } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestFetch());
  try {
    const params = {
      bbId,
      connectDbCat: (archiveFlg ? "P" : "O") as ConnectDbCat,
    };
    const response = await WebApi.getBroadcastBb(dispatch, params, callbacks);
    const { data } = response;
    dispatch(slice.actions.successFetch({ data }));
  } catch (error) {
    dispatch(slice.actions.failureFetch());
  }
});

export const fetchAllBulletinBoardFlightLeg = createAsyncThunk<void, Broadcast.Bb.FetchAllFlightLegRequest, { dispatch: AppDispatch }>(
  "broadcastBulletinBoard/fetchAllBulletinBoardFlightLeg",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.requestFetchAllFlightLeg());
    try {
      const response = await WebApi.getBroadcastFlightLeg(dispatch, arg);
      const { data } = response;
      dispatch(slice.actions.successFetchAllFlightLeg({ data }));
      if (response.data.flightLegList.length === 0) {
        NotificationCreator.create({ dispatch, message: SoalaMessage.M30003C() });
      }
    } catch (error) {
      dispatch(slice.actions.failureFetchAllFlightLeg());
    }
  }
);

export const storeBulletinBoardTemplate = createAsyncThunk<
  Broadcast.Bb.StoreTemplateResponse | null,
  Broadcast.Bb.StoreTemplateRequest,
  { dispatch: AppDispatch }
>("broadcastBulletinBoard/storeBulletinBoardTemplate", async (arg, thunkAPI) => {
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestStoreTemplate());
  try {
    const response = await WebApi.postBroadcastBbTemplate(dispatch, arg);
    dispatch(slice.actions.successStoreTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureStoreTemplate());
    return null;
  }
});

export const updateBulletinBoardTemplate = createAsyncThunk<
  Broadcast.Bb.UpdateTemplateResponse | null,
  {
    params: Broadcast.Bb.UpdateTemplateRequest;
    callbacks: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("broadcastBulletinBoard/updateBulletinBoardTemplate", async (arg, thunkAPI) => {
  const { params, callbacks } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestUpdateTemplate());
  try {
    const response = await WebApi.postBroadcastBbTemplateUpdate(dispatch, params, callbacks);
    dispatch(slice.actions.successUpdateTemplate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureUpdateTemplate());
    return null;
  }
});

export const updateBulletinBoard = createAsyncThunk<
  Broadcast.Bb.UpdateResponse | null,
  {
    params: Broadcast.Bb.UpdateRequest;
    callbacks: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("broadcastBulletinBoard/updateBulletinBoard", async (arg, thunkAPI) => {
  const { params, callbacks } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.requestUpdate());
  try {
    const response = await WebApi.postBroadcastBbUpdate(dispatch, params, callbacks);
    dispatch(slice.actions.successUpdate());
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureUpdate());
    return null;
  }
});

export const sendBulletinBoard = createAsyncThunk<Broadcast.Bb.SendResponse | null, Broadcast.Bb.SendRequest, { dispatch: AppDispatch }>(
  "broadcastBulletinBoard/sendBulletinBoard",
  async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.requestSend());
    try {
      const response = await WebApi.postBroadcastBb(dispatch, arg);
      const { data } = response;
      dispatch(slice.actions.successSend({ data }));
      return response.data;
    } catch (error) {
      dispatch(slice.actions.failureSend());
      return null;
    }
  }
);

export const slice = createSlice({
  name: "broadcastBulletinBoard",
  initialState,
  reducers: {
    enableFlight: (state) => {
      state.isFlightLegEnabled = true;
    },
    disableFlight: (state) => {
      state.isFlightLegEnabled = false;
    },
    openFlightLegSearchModal: (state) => {
      state.isOpenFlightLegSearchModal = true;
    },
    closeFlightLegSearchModal: (state) => {
      state.isOpenFlightLegSearchModal = false;
      state.flightLegs = [];
    },
    openBbAddressDetailModal: (state) => {
      state.isOpenBbAddressDetailModal = true;
    },
    closeBbAddressDetailModal: (state) => {
      state.isOpenBbAddressDetailModal = false;
    },
    requestFetch: (state) => {
      state.fetchingBb = true;
    },
    successFetch: (
      state,
      action: PayloadAction<{
        data: Broadcast.Bb.FetchResponse;
      }>
    ) => {
      state.fetchingBb = false;
      state.detail = action.payload.data;
    },
    failureFetch: (state) => {
      state.fetchingBb = false;
      state.detail = {};
    },
    requestFetchTemplate: (state) => {
      state.fetching = true;
    },
    successFetchTemplate: (
      state,
      action: PayloadAction<{
        data: Broadcast.Bb.FetchTemplateResponse;
      }>
    ) => {
      state.fetching = false;
      state.template = action.payload.data;
    },
    failureFetchTemplate: (state) => {
      state.fetching = false;
      state.template = {};
    },
    requestFetchAllFlightLeg: (state) => {
      state.fetchingAllFlightLeg = true;
    },
    successFetchAllFlightLeg: (
      state,
      action: PayloadAction<{
        data: Broadcast.Bb.FetchAllFlightLegResponse;
      }>
    ) => {
      state.fetchingAllFlightLeg = false;
      state.flightLegs = action.payload.data.flightLegList;
    },
    failureFetchAllFlightLeg: (state) => {
      state.fetchingAllFlightLeg = false;
      state.flightLegs = [];
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
    requestUpdate: (state) => {
      state.updating = false;
    },
    successUpdate: (state) => {
      state.updating = true;
    },
    failureUpdate: (state) => {
      state.updating = true;
    },
    requestSend: (state) => {
      state.sending = true;
      state.newBbId = null;
    },
    successSend: (
      state,
      action: PayloadAction<{
        data: Broadcast.Bb.SendResponse;
      }>
    ) => {
      state.newBbId = action.payload.data.bbId;
    },
    failureSend: (state) => {
      state.sending = false;
      state.newBbId = null;
    },
  },
});

export const {
  enableFlight,
  disableFlight,
  openFlightLegSearchModal,
  closeFlightLegSearchModal,
  openBbAddressDetailModal,
  closeBbAddressDetailModal,
} = slice.actions;

export default slice.reducer;
