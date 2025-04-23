import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { change, reset } from "redux-form";
import { AppDispatch, RootState } from "../store/storeType";
import { WebApi } from "../lib/webApi";
import { setPinpointNotification } from "./account";
import { NotificationCreator } from "../lib/notifications";
import { terminalFuncCheck, funcAuthCheck as funcAuthCheckCommonUtil } from "../lib/commonUtil";
import { Const } from "../lib/commonConst";
// eslint-disable-next-line import/no-cycle
import { FORM_NAME, UserSettingFormParams } from "../components/organisms/UserSetting";

export const getUserSetting = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "userSettings/getUserSetting",
  async (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.fetchUserSetting());

    try {
      // ユーザー設定取得
      const response = await WebApi.getUserNotification(dispatch);
      setFrom(response.data, dispatch);
      dispatch(slice.actions.fetchUserSettingSuccess(response.data));
    } catch (err) {
      dispatch(slice.actions.fetchUserSettingFailure({ error: err as Error }));
    }
  }
);

export const updateUserSetting = createAsyncThunk<void, UserSettingFormParams, { dispatch: AppDispatch; state: RootState }>(
  "userSetting/updateUserSetting",
  async (arg, thunkAPI) => {
    const userSettingWithForm = arg;
    const { dispatch, getState } = thunkAPI;
    const { jobAuth } = getState().account;
    // 同一行の入力値で必須の項目に値が入っている行をリクエストパラメータに追加する
    const apoNtfList: { apoCode: string; eventCode: string; apoNtfOrder: number }[] = [];
    if (userSettingWithForm.apoNtfList) {
      userSettingWithForm.apoNtfList.forEach(({ apoCode, eventCode }) => {
        if (apoCode && eventCode) {
          apoNtfList.push({
            apoCode,
            eventCode,
            apoNtfOrder: apoNtfList.length,
          });
        }
      });
    }

    // 同一行の入力値で必須の項目に値が入っている行をリクエストパラメータに追加する
    const fltNtfList: { type: string; trigger: string; eventCode: string; fltNtfOrder: number }[] = [];
    if (userSettingWithForm.fltNtfList) {
      userSettingWithForm.fltNtfList.forEach(({ type, triggerDep = "", triggerArr = "", fltEventCode, legEventCode, trigger }) => {
        if ((type === "FLT" || type === "CAS") && trigger && fltEventCode) {
          fltNtfList.push({
            type,
            trigger,
            eventCode: fltEventCode,
            fltNtfOrder: fltNtfList.length,
          });
        } else if (type === "LEG" && (triggerDep || triggerArr) && legEventCode) {
          fltNtfList.push({
            type,
            trigger: `${triggerDep}-${triggerArr}`,
            eventCode: legEventCode,
            fltNtfOrder: fltNtfList.length,
          });
        }
      });
    }

    const params = {
      grpNtfFlg: true,
      apoNtfFlg: userSettingWithForm.apoNtfFlg,
      apoNtfList,
      fltNtfFlg: userSettingWithForm.fltNtfFlg,
      fltNtfList,
      bbNtfFlg: userSettingWithForm.bbNtfFlg,
      cmtNtfFlg: userSettingWithForm.cmtNtfFlg,
      myskdlNtfFlg: userSettingWithForm.myskdlNtfFlg,
    };

    NotificationCreator.removeAll({ dispatch });
    dispatch(slice.actions.fetchUserSetting());

    try {
      // ユーザー設定登録
      const response = await WebApi.postUserNotification(dispatch, params);
      // fromの初期化(submit後、バリデーションエラー表示しないため)
      dispatch(reset(FORM_NAME));
      // 登録後、取得した値をformに適応
      setFrom(response.data, dispatch);

      // 通知設定をPinpointに登録
      if (
        terminalFuncCheck(Const.FUNC_ID.openNotificationList) && // 端末の使用制限チェック
        funcAuthCheckCommonUtil(Const.FUNC_ID.openNotificationList, jobAuth.jobAuth) // 権限のチェック
      ) {
        // 通知設定取得
        const responseNotify = await WebApi.getNotificationSetting(dispatch);
        setPinpointNotification(responseNotify.data);
      } else {
        // 権限がない場合は、通知は無視する
        setPinpointNotification(null);
      }

      dispatch(slice.actions.fetchUserSettingSuccess(response.data));
    } catch (err) {
      dispatch(slice.actions.fetchUserSettingFailure({ error: err as Error }));
    }
  }
);

function setFrom(userSetting: UserSetting, dispatch: AppDispatch) {
  if (userSetting) {
    dispatch(change(FORM_NAME, "apoNtfFlg", userSetting.apoNtfFlg));
    dispatch(change(FORM_NAME, "grpNtfFlg", userSetting.grpNtfFlg));
    dispatch(change(FORM_NAME, "fltNtfFlg", userSetting.fltNtfFlg));
    dispatch(change(FORM_NAME, "bbNtfFlg", userSetting.bbNtfFlg));
    dispatch(change(FORM_NAME, "cmtNtfFlg", userSetting.cmtNtfFlg));
    dispatch(change(FORM_NAME, "myskdlNtfFlg", userSetting.myskdlNtfFlg));

    if (userSetting.apoNtfList) {
      setApoNtfFrom(userSetting.apoNtfList, dispatch);
    }
    if (userSetting.fltNtfList) {
      setFltNtfFrom(userSetting.fltNtfList, dispatch);
    }
  }
}

export function setApoNtfFrom(apoNtfList: UserSettingApi.ApoNtfList[], dispatch: AppDispatch) {
  apoNtfList.forEach((apoNtf, index) => {
    dispatch(change(FORM_NAME, `apoNtfList[][${index}][apoCode]`, apoNtf.apoCode));
    dispatch(change(FORM_NAME, `apoNtfList[][${index}][eventCode]`, apoNtf.eventCode));
  });
}

export function setFltNtfFrom(fltNtfList: UserSettingApi.FltNtfList[], dispatch: AppDispatch) {
  fltNtfList.forEach((fltNtf, index) => {
    dispatch(change(FORM_NAME, `fltNtfList[][${index}][type]`, fltNtf.type));
    if (fltNtf.type === "FLT" || fltNtf.type === "CAS") {
      dispatch(change(FORM_NAME, `fltNtfList[][${index}][trigger]`, fltNtf.trigger));
      dispatch(change(FORM_NAME, `fltNtfList[][${index}][fltEventCode]`, fltNtf.eventCode));
    } else if (fltNtf.type === "LEG" && fltNtf.trigger) {
      dispatch(change(FORM_NAME, `fltNtfList[][${index}][triggerDep]`, fltNtf.trigger.split("-")[0]));
      dispatch(change(FORM_NAME, `fltNtfList[][${index}][triggerArr]`, fltNtf.trigger.split("-")[1]));
      dispatch(change(FORM_NAME, `fltNtfList[][${index}][legEventCode]`, fltNtf.eventCode));
    }
  });
}

export const showMessage = createAsyncThunk<void, { message: NotificationCreator.Message }, { dispatch: AppDispatch }>(
  "userSetting/showMessage",
  (arg, thunkAPI) => {
    const { message } = arg;
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message });
  }
);

export const checkUserSettingFuncAuth = createAsyncThunk<void, { jobAuth: JobAuthApi.JobAuth[] }, { dispatch: AppDispatch }>(
  "userSetting/checkUserSettingFuncAuth",
  (arg, thunkAPI) => {
    const { jobAuth } = arg;
    const { dispatch } = thunkAPI;
    dispatch(slice.actions.userSettingFuncAuthCheck({ jobAuth }));
  }
);

// state
// export type UserSettingState = UserSettingApi.Response & {
//   isFetching: boolean;
// };
export interface UserSettingState extends UserSetting {
  isFetching: boolean;
  isError: boolean;
  isCleared: boolean;
  checkHasDifference: () => boolean;
  canNotifyBulletinBoard: boolean;
  canNotifyMySchedule: boolean;
}
export interface UserSetting {
  grpNtfFlg: boolean;
  apoNtfFlg: boolean;
  apoNtfList: UserSettingApi.ApoNtfList[];
  fltNtfFlg: boolean;
  fltNtfList: UserSettingApi.FltNtfList[];
  bbNtfFlg: boolean;
  cmtNtfFlg: boolean;
  myskdlNtfFlg: boolean;
}

const initialState: UserSettingState = {
  isFetching: false,
  grpNtfFlg: false,
  apoNtfFlg: false,
  apoNtfList: [],
  fltNtfFlg: false,
  fltNtfList: [],
  bbNtfFlg: true,
  cmtNtfFlg: true,
  myskdlNtfFlg: false,
  isError: false,
  isCleared: false,
  checkHasDifference: () => false,
  canNotifyBulletinBoard: false,
  canNotifyMySchedule: false,
};

export const slice = createSlice({
  name: "userSetting",
  initialState,
  reducers: {
    clearUserSetting: (state) => {
      Object.assign(state, initialState, { isCleared: true });
    },
    fetchUserSetting: (state) => {
      state.isFetching = true;
      state.isCleared = false;
    },
    fetchUserSettingSuccess: (state, action: PayloadAction<UserSettingApi.Response>) => {
      const { grpNtfFlg, apoNtfFlg, apoNtfList = [], fltNtfFlg, fltNtfList = [], bbNtfFlg, cmtNtfFlg, myskdlNtfFlg } = action.payload;
      state.grpNtfFlg = grpNtfFlg;
      state.apoNtfFlg = apoNtfFlg;
      state.apoNtfList = apoNtfList;
      state.fltNtfFlg = fltNtfFlg;
      state.fltNtfList = fltNtfList;
      state.bbNtfFlg = bbNtfFlg;
      state.cmtNtfFlg = cmtNtfFlg;
      state.myskdlNtfFlg = myskdlNtfFlg;
      state.isFetching = false;
      state.isError = false;
    },
    fetchUserSettingFailure: (state, _action: PayloadAction<{ error: Error }>) => {
      state.isFetching = false;
      state.isError = true;
    },
    setCheckHasDifference: (state, action: PayloadAction<() => boolean>) => {
      state.checkHasDifference = action.payload;
    },
    userSettingFuncAuthCheck: (state, action: PayloadAction<{ jobAuth: JobAuthApi.JobAuth[] }>) => {
      state.canNotifyBulletinBoard = funcAuthCheckCommonUtil(Const.FUNC_ID.notifyBulletinBoard, action.payload.jobAuth);
      state.canNotifyMySchedule = funcAuthCheckCommonUtil(Const.FUNC_ID.mySchedule, action.payload.jobAuth);
    },
  },
});

export const { clearUserSetting, setCheckHasDifference } = slice.actions;

export default slice.reducer;
