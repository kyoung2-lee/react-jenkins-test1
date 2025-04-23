/* tslint:disable:no-console */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import orderBy from "lodash.orderby";
import { combineReducers } from "redux";
import { setSubmitFailed, stopSubmit } from "redux-form";
// eslint-disable-next-line import/no-cycle
import { FORM_NAME } from "../components/organisms/Broadcast/Broadcast";
import { funcAuthCheck as commonFuncAuthCheck } from "../lib/commonUtil";
import { Const } from "../lib/commonConst";
import { storage } from "../lib/storage";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { WebApi } from "../lib/webApi";
import AcarsReducer, { AcarsState } from "./broadcastAcars";
import BulletinBoardReducer, { BulletinBoardState } from "./broadcastBulletinBoard";
import EmailReducer, { EmailState } from "./broadcastEmail";
import NotificationReducer, { NotificationState } from "./broadcastNotification";
import TtyReducer, { TtyState } from "./broadcastTty";
import AftnReducer, { AftnState } from "./broadcastAftn";
import Template = Broadcast.Template;
import { AppDispatch } from "../store/storeType";

interface BroadcastState {
  canManageBb: boolean;
  canManageEmail: boolean;
  canManageTty: boolean;
  canManageAftn: boolean;
  canManageNotification: boolean;
  canManageAcars: boolean;
  fetchingAll: boolean;
  templates: Broadcast.Template[];
  isTemplateFiltered: boolean;
  isOpenSaveAsModal: boolean;
  isOpenSearchFlightLegModal: boolean;
  isOpenSearchFilterModal: boolean;
  isOpenTemplateNameEditModal: boolean;
}

const initialState: BroadcastState = {
  canManageBb: false,
  canManageEmail: false,
  canManageTty: false,
  canManageAftn: false,
  canManageNotification: false,
  canManageAcars: false,
  fetchingAll: false,
  templates: [],
  isTemplateFiltered: false,
  isOpenSaveAsModal: false,
  isOpenSearchFlightLegModal: false,
  isOpenSearchFilterModal: false,
  isOpenTemplateNameEditModal: false,
};

export interface RemoveAll {
  type: string;
}

function getSortedTemplates(
  templates: Broadcast.Template[],
  sortKey: Broadcast.TemplateSortKey,
  order: Broadcast.TemplateOrder
): Template[] {
  if (sortKey === "recentlyTime") {
    return orderBy(templates, ["recentlyTime"], [order]);
  }
  if (order === "asc") {
    return Object.assign([] as Template[], templates).sort((a, b) => a.templateName.localeCompare(b.templateName));
  }
  return Object.assign([] as Template[], templates).sort((a, b) => b.templateName.localeCompare(a.templateName));
}

export const showMessage = createAsyncThunk<void, NotificationCreator.Message, { dispatch: AppDispatch }>(
  "broadcast/showMessage",
  (message, { dispatch }) => {
    NotificationCreator.removeAll({ dispatch });
    NotificationCreator.create({ dispatch, message });
  }
);

export const submitFailedField = createAsyncThunk<void, string[], { dispatch: AppDispatch }>(
  "broadcast/submitFailedField",
  (fields, { dispatch }) => {
    dispatch(setSubmitFailed(FORM_NAME, ...fields));
  }
);

export const clearSubmitFailedFields = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  "broadcast/clearSubmitFailedFields",
  (_arg, { dispatch }) => {
    dispatch(stopSubmit(FORM_NAME));
  }
);

export const fetchAllTemplate = createAsyncThunk<
  Broadcast.FetchAllTemplateResponse | null,
  {
    params: Broadcast.FetchAllTemplateRequest;
    sort: Broadcast.FetchAllTemplateSort;
  },
  { dispatch: AppDispatch }
>("broadcast/fetchAllTemplate", async (arg, { dispatch }) => {
  const { params, sort } = arg;
  dispatch(slice.actions.requestFetchAllTemplate());
  try {
    const requestParam = {
      keyword: "",
      sendBy: "",
      ...params,
    };
    const response = await WebApi.getBroadcastTemplates(dispatch, requestParam);
    dispatch(slice.actions.successFetchAllTemplate({ data: response.data, sortKey: sort.sortKey, order: sort.order }));
    if ((requestParam.keyword || requestParam.sendBy) && response.data.templateList.length === 0) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M30003C() });
    }
    return response.data;
  } catch (error) {
    dispatch(slice.actions.failureFetchAllTemplate());
    return null;
  }
});

export const updateTemplateName = createAsyncThunk<
  Broadcast.UpdateTemplateNameResponse | null,
  {
    params: Broadcast.UpdateTemplateNameRequest;
    callbacks: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("broadcast/updateTemplateName", async (updateTemplateNameParams, { dispatch }) => {
  const { params, callbacks } = updateTemplateNameParams;
  try {
    const response = await WebApi.postBroadcastTemplateName(dispatch, params, callbacks);
    return response.data;
  } catch (error) {
    return null;
  }
});

export const destroyTemplate = createAsyncThunk<
  boolean | null,
  {
    params: Broadcast.DeleteTemplateRequest;
    callbacks: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("broadcast/destroyTemplate", async (destroyTemplateParams, { dispatch }) => {
  const { params, callbacks } = destroyTemplateParams;
  try {
    await WebApi.postBroadcastTemplateDelete(dispatch, params, callbacks);
    dispatch(slice.actions.successDestroyTemplate({ templateId: params.templateId }));
    return true;
  } catch (error) {
    return null;
  }
});

export const slice = createSlice({
  name: "broadcast",
  initialState,
  reducers: {
    funcAuthCheck: (
      state,
      action: PayloadAction<{
        jobAuth: JobAuthApi.JobAuth[];
      }>
    ) => {
      state.canManageBb = commonFuncAuthCheck(Const.FUNC_ID.updateBulletinBoard, action.payload.jobAuth) && !storage.isIphone;
      state.canManageEmail = commonFuncAuthCheck(Const.FUNC_ID.openBroadcastEmail, action.payload.jobAuth);
      state.canManageTty = commonFuncAuthCheck(Const.FUNC_ID.openBroadcastTty, action.payload.jobAuth);
      state.canManageAftn = commonFuncAuthCheck(Const.FUNC_ID.openBroadcastAftn, action.payload.jobAuth);
      state.canManageNotification = commonFuncAuthCheck(Const.FUNC_ID.openBroadcastNotification, action.payload.jobAuth);
      state.canManageAcars = commonFuncAuthCheck(Const.FUNC_ID.openBroadcastAcars, action.payload.jobAuth);
    },
    openSearchFilterModal: (state) => {
      state.isOpenSearchFilterModal = true;
    },
    closeSearchFilterModal: (state) => {
      state.isOpenSearchFilterModal = false;
    },
    openSaveAsModal: (state) => {
      state.isOpenSaveAsModal = true;
    },
    closeSaveAsModal: (state) => {
      state.isOpenSaveAsModal = false;
    },
    openTemplateNameEditModal: (state) => {
      state.isOpenTemplateNameEditModal = true;
    },
    closeTemplateNameEditModal: (state) => {
      state.isOpenTemplateNameEditModal = false;
    },
    requestFetchAllTemplate: (state) => {
      state.fetchingAll = true;
    },
    successFetchAllTemplate: (
      state,
      action: PayloadAction<{
        data: Broadcast.FetchAllTemplateResponse;
        sortKey: Broadcast.TemplateSortKey;
        order: Broadcast.TemplateOrder;
      }>
    ) => {
      const { data, sortKey, order } = action.payload;
      state.templates = getSortedTemplates(data.templateList, sortKey, order);
      state.fetchingAll = false;
    },
    failureFetchAllTemplate: (state) => {
      state.templates = [];
      state.fetchingAll = false;
    },
    successDestroyTemplate: (
      state,
      action: PayloadAction<{
        templateId: number;
      }>
    ) => {
      state.templates = state.templates.filter((template: { templateId: number }) => template.templateId !== action.payload.templateId);
    },
    applyTemplateFilter: (state) => {
      state.isTemplateFiltered = true;
    },
    clearTemplateFilter: (state) => {
      state.isTemplateFiltered = false;
    },
    sortTemplates: (
      state,
      action: PayloadAction<{
        templates: Broadcast.Template[];
        sortKey: Broadcast.TemplateSortKey;
        order: Broadcast.TemplateOrder;
      }>
    ) => {
      const { templates, sortKey, order } = action.payload;
      state.templates = getSortedTemplates(templates, sortKey, order);
    },
  },
});

export const {
  funcAuthCheck,
  openSearchFilterModal,
  closeSearchFilterModal,
  openSaveAsModal,
  closeSaveAsModal,
  openTemplateNameEditModal,
  closeTemplateNameEditModal,
  requestFetchAllTemplate,
  successFetchAllTemplate,
  failureFetchAllTemplate,
  applyTemplateFilter,
  clearTemplateFilter,
  sortTemplates,
} = slice.actions;

export interface BroadcastRootState {
  Broadcast: BroadcastState;
  BulletinBoard: BulletinBoardState;
  Email: EmailState;
  Tty: TtyState;
  Aftn: AftnState;
  Notification: NotificationState;
  Acars: AcarsState;
}

export default combineReducers<BroadcastRootState>({
  Broadcast: slice.reducer,
  BulletinBoard: BulletinBoardReducer,
  Email: EmailReducer,
  Tty: TtyReducer,
  Aftn: AftnReducer,
  Notification: NotificationReducer,
  Acars: AcarsReducer,
});
