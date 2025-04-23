import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { change } from "redux-form";
import { WebApi } from "../lib/webApi";
import { terminalFuncCheck, funcAuthCheck } from "../lib/commonUtil";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { Const } from "../lib/commonConst";
import { storage } from "../lib/storage";
import { storageOfUser } from "../lib/StorageOfUser";
import { AppDispatch } from "../store/storeType";

export interface AccountState {
  profile: Profile;
  jobAuth: JobAuth;
  master: Master;
  isFetching: boolean;
  isError: boolean;
  isDarkMode: boolean;
  zoomFis: number;
  zoomBarChart: number;
  retry: () => void;
}

export interface Profile {
  user: ProfileApi.ProfileUser;
}

export interface NtfInfo {
  ntf: MasterApi.Ntf[];
  soalaEvt: MasterApi.SoalaEvt[];
  airportNtfList: { value: string; label: string }[];
  flightNoNtfList: { value: string; label: string }[];
  legNtfList: { value: string; label: string }[];
}

export interface JobAuth {
  info: JobAuthApi.Info;
  user: JobAuthApi.User;
  jobAuth: JobAuthApi.JobAuth[];
}

export interface Master {
  airlines: MasterApi.Airline[];
  airports: MasterApi.Airport[];
  ntfInfo: NtfInfo;
  cdCtrlDtls: MasterApi.CdCtrlDtl[];
  jobs: MasterApi.Job[];
  grps: MasterApi.Grp[];
  commGrps: MasterApi.CommGrp[];
  adGrps: MasterApi.AdGrp[];
  ships: MasterApi.Ship[];
  spclCareGrps: MasterApi.SpclCareGrp[];
  ssrs: MasterApi.Ssr[];
  spclLoads: MasterApi.SpclLoad[];
  dlyRsns: MasterApi.DlyRsn[];
  mvtMsgRmks: MasterApi.MvtMsgRmk[];
  onlineDbExpDays: number;
  oalOnlineDbExpDays: number;
  mvtDateRangeLimit: number;
}

const initialState: AccountState = {
  profile: {
    user: {
      familyName: "",
      firstName: "",
      companyCd: "",
      deptCd: "",
      profileImg: "",
    },
  },
  jobAuth: {
    info: { token: "" },
    user: {
      userId: "",
      jobCd: "",
      jobName: "",
      mailAddr: "",
      ttyAddr: "",
      grpId: 0,
      grpCd: "",
      grpName: "",
      myApoCd: "",
      familyName: "",
      firstName: "",
      companyCd: "",
      deptCd: "",
      profileImg: "",
      bbAdminFlg: false,
      commonSiteFlg: false,
    },
    jobAuth: [],
  },
  master: {
    airlines: [],
    airports: [],
    ntfInfo: {
      ntf: [],
      soalaEvt: [],
      airportNtfList: [],
      flightNoNtfList: [],
      legNtfList: [],
    },
    cdCtrlDtls: [],
    jobs: [],
    grps: [],
    commGrps: [],
    adGrps: [],
    ships: [],
    spclCareGrps: [],
    ssrs: [],
    spclLoads: [],
    dlyRsns: [],
    mvtMsgRmks: [],
    onlineDbExpDays: 0,
    oalOnlineDbExpDays: 0,
    mvtDateRangeLimit: 0,
  },
  isFetching: false,
  isError: false,
  isDarkMode: true,
  zoomFis: 100,
  zoomBarChart: 100,
  retry: () => null,
};

// 新規タブで開いている場合、親タブのセッションストレージをローカルストレージ経由でコピーする
if (!sessionStorage.length) {
  const sessionData = localStorage.getItem("sessionStorage"); // 親タブからローカルストレージに一時的に格納される
  if (sessionData) {
    const data = JSON.parse(sessionData) as Record<string, string>;
    Object.keys(data).forEach((key) => {
      if (
        key === storage.storageKey.jobAuthResponse ||
        key === storage.storageKey.masterResponse ||
        key === storage.storageKey.token ||
        key === storage.storageKey.terminalCat ||
        key === storage.storageKey.loginStamp ||
        key === storage.storageKey.cognitoLoginType ||
        key === storage.storageKey.cognitoToken ||
        key.indexOf(storage.storageKey.cognitoIdentityServiceProvider) === 0
      ) {
        sessionStorage.setItem(key, data[key]);
      }
    });
  }
  storage.pageStamp = Date.now();
}

localStorage.removeItem("sessionStorage"); // 最後に削除する

//  Storageにデータがある場合は初期値に設定
if (storage.jobAuthResponse) {
  const jobAuthResponse: JobAuthApi.Response = JSON.parse(storage.jobAuthResponse) as JobAuthApi.Response;
  initialState.jobAuth = {
    info: jobAuthResponse.info,
    user: jobAuthResponse.user,
    jobAuth: jobAuthResponse.jobAuth,
  };
  storageOfUser.init({
    userId: jobAuthResponse.user.userId,
  });
}

//  Storageにデータがある場合は初期値に設定
if (storage.masterResponse) {
  const masterResponse: Master = JSON.parse(storage.masterResponse) as Master;
  initialState.master = {
    ...masterResponse,
  };
}

//  Storageにデータがある場合は初期値に設定
if (storage.displayMode) {
  initialState.isDarkMode = storage.displayMode === "darkMode";
}

//  Storageにデータがある場合は初期値に設定
if (storage.zoomFis) {
  initialState.zoomFis = storage.zoomFis;
}

//  Storageにデータがある場合は初期値に設定
if (storage.zoomBarChart) {
  initialState.zoomBarChart = storage.zoomBarChart;
}

export const getProfile = createAsyncThunk<void, void, { dispatch: AppDispatch }>("account/getProfile", async (_arg, thunkAPI) => {
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.fetchProfile());
  try {
    const response = await WebApi.getJobProfile(dispatch);
    const { data } = response;
    dispatch(slice.actions.fetchProfileSuccess({ data }));
  } catch (err) {
    dispatch(slice.actions.fetchProfileFailure({ error: err as Error, retry: () => getProfile() }));
  }
});

export const jobAuth = createAsyncThunk<
  void,
  {
    jobCd: string;
    jobAuthCd: string;
    deviceName: string;
    terminalCat: string;
    historyPush: () => void;
  },
  { dispatch: AppDispatch }
>("account/jobAuth", async (arg, thunkAPI) => {
  const { jobCd, jobAuthCd, deviceName, terminalCat, historyPush } = arg;
  const { dispatch } = thunkAPI;
  dispatch(slice.actions.postJobAuth());
  NotificationCreator.removeAll({ dispatch });
  console.log("jobAuth", { arg });
  try {
    // Job認証
    const responseJobAuth = await WebApi.postJobAuth(dispatch, { jobCd, jobAuthCd, deviceName });

    // storageOfUserの初期化
    const { userId } = responseJobAuth.data.user;
    storageOfUser.init({ userId });

    // ストレージに保存
    storage.jobAuthResponse = JSON.stringify(responseJobAuth.data);
    storage.token = responseJobAuth.data.info.token;
    storage.terminalCat = terminalCat as Const.TerminalCat;
    const timeStamp = Date.now();
    storage.loginStamp = timeStamp;
    storageOfUser.saveLoginStamp({ timeStamp });
    storageOfUser.initPushCounter();

    // iOSアプリにJob認証情報を保存する
    if (window.webkit && window.webkit.messageHandlers.saveJobAuthInfo) {
      window.webkit.messageHandlers.saveJobAuthInfo.postMessage({ jobCd, jobAuthCd });
    }

    // Master取得
    const master: Master = await getMasterFromApi(dispatch, responseJobAuth.data.user);

    // 通知設定をPinpointに登録
    if (
      terminalFuncCheck(Const.FUNC_ID.openNotificationList) && // 端末の使用制限チェック
      funcAuthCheck(Const.FUNC_ID.openNotificationList, responseJobAuth.data.jobAuth) // 権限のチェック
    ) {
      // 通知設定取得
      const responseNotify = await WebApi.getNotificationSetting(dispatch);
      // Pinpointに登録
      setPinpointNotification(responseNotify.data);
    } else {
      // 権限がない場合は、通知は無視する
      setPinpointNotification(null);
    }

    dispatch(slice.actions.postJobAuthSuccess({ jobAuthData: responseJobAuth.data, masterData: master }));
    historyPush(); // 画面遷移
  } catch (err) {
    dispatch(change("jobAuth", "jobAuthCd", ""));
    dispatch(slice.actions.postJobAuthFailure());
  }
});

// マスターを再取得する
export const reloadMaster = createAsyncThunk<
  void,
  {
    user: JobAuthApi.User;
    masterGetType?: number;
  },
  { dispatch: AppDispatch }
>("account/reloadMaster", async (arg, thunkAPI) => {
  const { user, masterGetType = 0 } = arg;
  const { dispatch } = thunkAPI;
  try {
    // Master取得
    const master: Master = await getMasterFromApi(dispatch, user, masterGetType);
    dispatch(slice.actions.fetchMasterSuccess({ masterData: master }));
  } catch (err) {
    // empty
  }
});

export const updateProfilePicture = createAsyncThunk<
  void,
  {
    profile: ProfilePictureApi.Request;
    closeEditImageModal: () => void;
  },
  { dispatch: AppDispatch }
>("account/updateProfilePicture", async (arg, thunkAPI) => {
  const { profile, closeEditImageModal } = arg;
  const { dispatch } = thunkAPI;
  try {
    const response = await WebApi.postProfilePicture(dispatch, profile);
    dispatch(fetchUpdateProfilePictureSuccess({ profileImg: response.data.profile }));

    if (storage.jobAuthResponse) {
      const jobAuthResponse: JobAuthApi.Response = JSON.parse(storage.jobAuthResponse) as JobAuthApi.Response;
      jobAuthResponse.user.profileImg = response.data.profile;
      storage.jobAuthResponse = JSON.stringify(jobAuthResponse);
    }
    closeEditImageModal();
  } catch (err) {
    // empty
  }
});

// pinpointに通知設定を行う
export function setPinpointNotification(notifyList: NotificationSettingApi.Response | null): void {
  if (window.webkit) window.webkit.messageHandlers.registNotification.postMessage(notifyList ? JSON.stringify(notifyList) : "");
}

export const slice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchProfile: (state) => {
      state.isFetching = true;
    },
    fetchProfileSuccess: (
      state,
      action: PayloadAction<{
        data: ProfileApi.Response;
      }>
    ) => {
      const { data } = action.payload;
      state.profile = {
        user: data.user,
      };
      state.isFetching = false;
      state.isError = false;
      state.retry = () => null;
    },
    fetchProfileFailure: (
      state,
      _action: PayloadAction<{
        error: Error;
        retry: () => void;
      }>
    ) => {
      state.isFetching = false;
    },
    fetchMasterSuccess: (
      state,
      action: PayloadAction<{
        masterData: Master;
      }>
    ) => {
      const { masterData } = action.payload;
      state.master = masterData;
    },
    postJobAuth: (state) => {
      state.isFetching = true;
    },
    postJobAuthSuccess: (
      state,
      action: PayloadAction<{
        jobAuthData: JobAuthApi.Response;
        masterData: Master;
      }>
    ) => {
      const { jobAuthData, masterData } = action.payload;
      state.jobAuth = {
        info: jobAuthData.info,
        user: jobAuthData.user,
        jobAuth: jobAuthData.jobAuth,
      };
      state.master = masterData;
      state.isFetching = false;
    },
    postJobAuthFailure: (state) => {
      state.isFetching = false;
    },
    fetchUpdateProfilePictureSuccess: (
      state,
      action: PayloadAction<{
        profileImg: string;
      }>
    ) => {
      const { profileImg } = action.payload;
      state.jobAuth = {
        ...state.jobAuth,
        user: {
          ...state.jobAuth.user,
          profileImg,
        },
      };
    },
    setDisplayMode: (
      state,
      action: PayloadAction<{
        displayMode: "lightMode" | "darkMode" | null;
      }>
    ) => {
      const { displayMode } = action.payload;
      storage.displayMode = displayMode;
      state.isDarkMode = displayMode === "darkMode";
    },
    setZoomFis: (
      state,
      action: PayloadAction<{
        zoom: number;
      }>
    ) => {
      const { zoom } = action.payload;
      storage.zoomFis = zoom;
      state.zoomFis = zoom;
    },
    setZoomBarChart: (
      state,
      action: PayloadAction<{
        zoom: number;
      }>
    ) => {
      const { zoom } = action.payload;
      storage.zoomBarChart = zoom;
      state.zoomBarChart = zoom;
    },
  },
});

async function getMasterFromApi(dispatch: AppDispatch, user: JobAuthApi.User, masterGetType = 0): Promise<Master> {
  // Master取得
  const responseMaster = await WebApi.getMaster(dispatch, { masterGetType });

  // 被マージ対象の既存マスタの取得
  let master: Master = { ...initialState.master };
  if (storage.masterResponse) {
    try {
      master = JSON.parse(storage.masterResponse) as Master;
    } catch (e) {
      // empty
    }
  }

  master = { ...master, ...convertMasterResponseToMaster(responseMaster.data, user) };

  // 通知を取得する
  if (responseMaster.data.ntfInfo && responseMaster.data.ntfInfo.ntf) {
    const airportNtfList: { value: string; label: string }[] = [];
    const flightNoNtfList: { value: string; label: string }[] = [];
    const legNtfList: { value: string; label: string }[] = [];
    responseMaster.data.ntfInfo.ntf
      .filter((ntf) => ntf.ntfTypeCd === "APO")
      .forEach((data) => {
        airportNtfList.push({ value: data.ntfCd, label: data.dispName });
      });
    responseMaster.data.ntfInfo.ntf
      .filter((ntf) => ntf.ntfTypeCd === "FLT")
      .forEach((data) => {
        flightNoNtfList.push({ value: data.ntfCd, label: data.dispName });
      });
    responseMaster.data.ntfInfo.ntf
      .filter((ntf) => ntf.ntfTypeCd === "LEG")
      .forEach((data) => {
        legNtfList.push({ value: data.ntfCd, label: data.dispName });
      });
    master = {
      ...master,
      ntfInfo: {
        ntf: responseMaster.data.ntfInfo.ntf,
        soalaEvt: responseMaster.data.ntfInfo.soalaEvt || master.ntfInfo.soalaEvt,
        airportNtfList,
        flightNoNtfList,
        legNtfList,
      },
    };
  }

  if (responseMaster.data.cdCtrlDtl) {
    // オンラインDB有効期限日数を取得する(自社便)
    const Code011 = responseMaster.data.cdCtrlDtl.find((cd) => cd.cdCls === "011" && cd.cdCat1 === "ONLINE_DB_EXP_DAYS");
    if (Code011) {
      master.onlineDbExpDays = Code011.num1;
    } else {
      console.error("Could not get onlineDbExpDays(Code:011).");
      const id = "getMasterFromApi";
      NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50021C() });
    }
    // オンラインDB有効期限日数を取得する(他社便)
    const Code033 = responseMaster.data.cdCtrlDtl.find((cd) => cd.cdCls === "033" && cd.cdCat1 === "ONLINE_DB_EXP_DAYS");
    if (Code033) {
      master.oalOnlineDbExpDays = Code033.num1;
    } else {
      console.error("Could not get onlineDbExpDays(Code:033).");
      const id = "getMasterFromApi";
      NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50021C() });
    }

    const Code050 = responseMaster.data.cdCtrlDtl.find((cd) => cd.cdCls === "050" && cd.cdCat1 === "MvtSearch");
    if (Code050) {
      master.mvtDateRangeLimit = Code050.num1;
    } else {
      console.error("Could not get onlineDbExpDays(Code:050).");
      const id = "getMasterFromApi";
      NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50021C() });
    }
  }

  storage.masterResponse = JSON.stringify(master);
  return master;
}

// 所属空港を空港リストの１行目に配置する
function editAirports(airports: MasterApi.Airport[], myApoCd: string | null | undefined): MasterApi.Airport[] {
  if (myApoCd) {
    const newAirports = [{ apoCd: myApoCd, dispSeq: 0 }].concat(airports);
    const index = newAirports.findIndex((a, x) => x !== 0 && a.apoCd === myApoCd);
    if (index >= 0) {
      newAirports.splice(index, 1);
    }
    return newAirports;
  }
  return airports;
}

// MasterApi.Response を、Partial<Master> オブジェクトに変換する
function convertMasterResponseToMaster(masterResponse: MasterApi.Response, user: JobAuthApi.User): Partial<Master> {
  return {
    ...(masterResponse.airline !== undefined ? { airlines: masterResponse.airline } : {}),
    ...(masterResponse.airport !== undefined ? { airports: editAirports(masterResponse.airport, user.myApoCd) } : {}),
    ...(masterResponse.cdCtrlDtl !== undefined ? { cdCtrlDtls: masterResponse.cdCtrlDtl } : {}),
    ...(masterResponse.job !== undefined ? { jobs: masterResponse.job } : {}),
    ...(masterResponse.grp !== undefined ? { grps: masterResponse.grp } : {}),
    ...(masterResponse.commGrp !== undefined ? { commGrps: masterResponse.commGrp } : {}),
    ...(masterResponse.adGrp !== undefined ? { adGrps: masterResponse.adGrp } : {}),
    ...(masterResponse.ship !== undefined ? { ships: masterResponse.ship } : {}),
    ...(masterResponse.spclCareGrp !== undefined ? { spclCareGrps: masterResponse.spclCareGrp } : {}),
    ...(masterResponse.ssr !== undefined ? { ssrs: masterResponse.ssr } : {}),
    ...(masterResponse.spclLoad !== undefined ? { spclLoads: masterResponse.spclLoad } : {}),
    ...(masterResponse.dlyRsn !== undefined ? { dlyRsns: masterResponse.dlyRsn } : {}),
    ...(masterResponse.mvtMsgRmks !== undefined ? { mvtMsgRmks: masterResponse.mvtMsgRmks } : {}),
  };
}

export const { fetchUpdateProfilePictureSuccess, setDisplayMode, setZoomFis, setZoomBarChart } = slice.actions;

export default slice.reducer;
