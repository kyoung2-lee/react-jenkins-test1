import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import cloneDeep from "lodash.clonedeep";
import { RootState, AppDispatch } from "../store/storeType";
// eslint-disable-next-line import/no-cycle
import { WebApi, ApiError } from "../lib/webApi";
import { b64DecodeUnicode, getTimeDateString, getTimeDiffUtc } from "../lib/commonUtil";
import { storage } from "../lib/storage";
import { storageOfUser } from "../lib/StorageOfUser";
// eslint-disable-next-line import/no-cycle
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { queue } from "../lib/queuing";
import { ServerConfig } from "../../config/config";
import { clearBarChartSearch } from "./barChartSearch";
import { clearFisFilterModal } from "./fisFilterModal";
import { clearFlightContents } from "./flightContents";
// eslint-disable-next-line import/no-cycle
import { clearFlightListModals } from "./flightListModals";
// eslint-disable-next-line import/no-cycle
import { clearFlightModals } from "./flightModals";
import { clearFlightSearch } from "./flightSearch";
// eslint-disable-next-line import/no-cycle
import { clearShipTransitListModals } from "./shipTransitListModals";
// eslint-disable-next-line import/no-cycle
import { clearOalFlightSchedule } from "./oalFlightSchedule";
// eslint-disable-next-line import/no-cycle
import { clearMultipleFlightMovement } from "./multipleFlightMovementModals";
import { closeBbAddressDetailModal } from "./broadcastBulletinBoard";
import { closeMailAddressDetailModal } from "./broadcastEmail";
import { closeTtyAddressDetailModal } from "./broadcastTty";
import { closeNotificationAddressDetailModal } from "./broadcastNotification";
import { mqtt } from "../lib/IotCore/mqtt";

export const screenTransition = createAsyncThunk<
  void,
  {
    from: string;
    to: string;
  },
  { dispatch: AppDispatch; state: RootState }
>("common/screenTransition", async (arg, thunkAPI) => {
  const { from, to } = arg;
  const { dispatch, getState } = thunkAPI;
  await dispatch(closeAllDraggableModals());
  dispatch(slice.actions.screenTransition({ from, to }));
  dispatch(clearBarChartSearch());
  dispatch(clearFisFilterModal());
  dispatch(clearFlightSearch());
  dispatch(clearOalFlightSchedule());
  dispatch(clearMultipleFlightMovement());
  const { notifications = [] } = getState();
  if (notifications.length) {
    NotificationCreator.removeAll({ dispatch });
  }
});

export const closeAllDraggableModals = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "common/closeAllDraggableModals",
  (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(clearFlightContents());
    dispatch(clearFlightListModals());
    dispatch(clearFlightModals());
    dispatch(clearShipTransitListModals());
  }
);

export const closeDetailModal = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "common/closeDetailModal",
  (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(closeBbAddressDetailModal());
    dispatch(closeMailAddressDetailModal());
    dispatch(closeTtyAddressDetailModal());
    dispatch(closeNotificationAddressDetailModal());
  }
);

export const logout = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "common/logout",
  async (_arg, _thunkAPI) => {
    await mqtt.disconnect();
    WebApi.postLogout().finally(() => {
      storage.clear();
      storageOfUser.clearLoginStamp();
      storageOfUser.initPushCounter();
      // iOSのログイン状態をクリア
      if (window.webkit) window.webkit.messageHandlers.clearLogin.postMessage("");
      // ログイン画面に遷移
      window.open(ServerConfig.USER_LOGIN_URL, "_self");
    });
  }
);

// iOSからログアウトされた場合に呼び出される
window.iLogout = () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  WebApi.postLogout(); // 応答を待たない
  storage.clear();
};

export const getHeaderInfo = createAsyncThunk<
  void,
  {
    apoCd: string | null;
    openRmksPopup?: () => void;
    closeRmksPopup?: () => void;
  },
  { dispatch: AppDispatch; state: RootState }
>("common/getHeaderInfo", async (arg, thunkAPI) => {
  const { openRmksPopup, closeRmksPopup } = arg;
  let { apoCd } = arg;
  const { dispatch } = thunkAPI;
  apoCd = apoCd || "";
  dispatch(fetchHeaderInfo({ apoCd }));
  try {
    const response = await WebApi.getHeader(dispatch, { apoCd });
    dispatch(fetchHeaderInfoSuccess({ data: response.data, apoCd }));
    if (openRmksPopup) {
      openRmksPopup();
    }
  } catch (err) {
    if (err instanceof ApiError && err.response) {
      const statusCode = err.response.status;
      if (
        closeRmksPopup &&
        statusCode !== 400 && // 強制画面しない場合のみ
        statusCode !== 401 &&
        statusCode !== 403 &&
        statusCode !== 405
      ) {
        // 空港リマークス表示時、空港細表示に失敗した場合、便リマークスポップアップを閉じる
        closeRmksPopup();
      }
      dispatch(
        fetchHeaderInfoFailure({
          error: err,
          retry: () => getHeaderInfo({ apoCd, openRmksPopup, closeRmksPopup }),
        })
      );
    }
  }
});

export const updateAirportRemarks = createAsyncThunk<
  void,
  {
    apoCd: string;
    apoRmksInfo: string;
    closeAirportRemarksPopup: () => void;
  },
  { dispatch: AppDispatch; state: RootState }
>("common/updateAirportRemarks", async (arg, thunkAPI) => {
  const { apoCd, apoRmksInfo, closeAirportRemarksPopup } = arg;
  const { dispatch } = thunkAPI;
  dispatch(fetchUpdateAirportRemarks());

  try {
    const response = await WebApi.postAirportRemarks(dispatch, { apoCd, apoRmksInfo });
    dispatch(fetchUpdateAirportRemarksSuccess({ data: response.data, apoCd }));
    await dispatch(getHeaderInfo({ apoCd }));
    closeAirportRemarksPopup();
  } catch (err) {
    dispatch(
      fetchUpdateAirportRemarksFailure({
        error: err as Error,
        retry: () => updateAirportRemarks({ apoCd, apoRmksInfo, closeAirportRemarksPopup }),
      })
    );
  }
});

// PUSH通知のメッセージをiOSから受け取る
export const addNotificationMessages = createAsyncThunk<void, { messagesJson: string }, { dispatch: AppDispatch; state: RootState }>(
  "common/addNotificationMessages",
  (arg, thunkAPI) => {
    const { messagesJson } = arg;
    const { dispatch } = thunkAPI;
    //  messagesJson = "WwogIHsKICAgICJsZWdLZXkiIDogewogICAgICAiZmx0Tm8iIDogIjMxMDEiLAogICAgICAic2tkTGVnU25vIiA6IDMxLAogICAgICAiZnJlZUZsdFNubyIgOiAiIiwKICAgICAgImNhc0ZsdENhdCIgOiAiIiwKICAgICAgImxlZ0luZm9DZCIgOiAiSkFMIiwKICAgICAgInNrZEFyckFwb0NkIiA6ICJITkQiLAogICAgICAic2tkRGVwQXBvQ2QiIDogIlNJTiIsCiAgICAgICJhbENkIiA6ICJKTCIsCiAgICAgICJvcmdEYXRlTGNsIiA6ICIyMDE5LTA0LTA5IgogICAgfSwKICAgICJzb2FsYUV2ZW50Q29kZSIgOiAiRElWIiwKICAgICJ0aXRsZSIgOiAiUm91dGUgY2hhZ2UiLAogICAgImRhdGUiIDogIjIwMTktMTEtMjEgMTc6NTE6MzguNTgzIiwKICAgICJiYktleSIgOiB7CiAgICAgICJpZCIgOiAxMjM0CiAgICB9LAogICAgInR5cGUiIDogImZsaWdodCIsCiAgICAiYm9keSIgOiAiSkwxMTExXC8yNERFQ1xyXG4y4oaQOWJiYiIsCiAgICAic2VxIiA6IDAKICB9Cl0=";
    try {
      const messages = JSON.parse(b64DecodeUnicode(messagesJson)) as PushNotificationMessage[];
      // console.dir(messages);
      dispatch(addNotificationMessagesSuccess({ messages }));
    } catch (err) {
      if (err instanceof Error) {
        const id = "addNotificationMessages";
        NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50021C() });
        // tslint:disable-next-line:no-console
        console.log(`[${err.name}] ${err.message}`);
      }
      dispatch(addNotificationMessagesFailure());
    }
  }
);

export const showNotificationAirportRmksNoChange = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "common/showNotificationAirportRmksNoChange",
  (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message: SoalaMessage.M40002C({}) });
  }
);

export const showConfirmation = createAsyncThunk<void, { onClickYes: () => void }, { dispatch: AppDispatch; state: RootState }>(
  "common/showConfirmation",
  (arg, thunkAPI) => {
    const { onClickYes } = arg;
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: onClickYes }) });
  }
);

export const showIllegalFileFormatError = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "common/showIllegalFileFormatError",
  (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message: SoalaMessage.M50026C() });
  }
);

export const removeAllNotification = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "common/removeAllNotification",
  (_arg, { dispatch }) => {
    NotificationCreator.removeAll({ dispatch });
  }
);

// MQTTのPUSHメッセージをHeaderInfoに反映する
export const reflectHeaderInfoFromPush = createAsyncThunk<void, { payload: string }, { dispatch: AppDispatch; state: RootState }>(
  "common/reflectHeaderInfoFromPush",
  (arg, thunkAPI) => {
    const { payload } = arg;
    const { dispatch } = thunkAPI;
    try {
      const pushData = JSON.parse(payload) as HeaderInfoApi.Response;
      queue.add(() => dispatch(fetchHeaderInfoFromPushSuccess(pushData)));
      if (!storage.switchingAutoReloadOn) {
        queue.runAll(); // 自動更新スイッチ中でない場合は即実行する
      }
    } catch (err) {
      if (err instanceof Error) {
        const id = "reflectHeaderInfoFromPush";
        NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50021C() });
        // tslint:disable-next-line:no-console
        console.log(`[${err.name}] ${err.message}`);
      }
    }
  }
);

function updateHeaderInfo(newHeaderInfo: HeaderInfoApi.Response, orgHeaderInfo: HeaderInfo): HeaderInfo {
  // 返却するオブジェクトを用意
  const returnHeaderInfo = {
    ...orgHeaderInfo,
    usingRwy: orgHeaderInfo.usingRwy.concat(),
    issu: orgHeaderInfo.issu.concat(),
  };

  const applyData = makeApplyHeader(orgHeaderInfo.buffer, newHeaderInfo);

  // 更新日時を更新
  returnHeaderInfo.apoTimeLcl = getTimeDateString(applyData.timeLcl, "YYYY-MM-DD[T]HH:mm:ss");
  returnHeaderInfo.apoTimeDiffUtc = getTimeDiffUtc(applyData.timeLcl);

  // USING RUNWAY
  if (applyData.usingRwy.length > 0) {
    const reducerRwy = (list: HeaderInfoApi.UsingRwy[], currentRwy: HeaderInfoApi.UsingRwy) => {
      const { trxId } = currentRwy;
      const index = list.findIndex(
        (rwy) => rwy.apoCd === currentRwy.apoCd && rwy.rwyToLdCat === currentRwy.rwyToLdCat && rwy.rwyNo === currentRwy.rwyNo
      );

      // 更新日時を比較して新しければ反映する
      if (index >= 0 && list[index].updateTime <= currentRwy.updateTime) {
        if (trxId === "D") {
          list.splice(index, 1);
          return list;
        }
        Object.assign(list[index], currentRwy);
        return list; // 元のIssuにマージする
      }
      if (index < 0 && (trxId === "A" || trxId === "U")) {
        // 新規追加
        list.push(currentRwy);
        return list;
      }
      return list;
    };
    returnHeaderInfo.usingRwy = applyData.usingRwy.reduce(reducerRwy, returnHeaderInfo.usingRwy);
  }

  // 空港発令
  if (applyData.issu.length > 0) {
    const reducerIssu = (list: HeaderInfoApi.Issu[], currentIssu: HeaderInfoApi.Issu) => {
      const { trxId } = currentIssu;
      const index = list.findIndex((issu) => issu.apoCd === currentIssu.apoCd && issu.issuCd === currentIssu.issuCd);

      // 更新日時を比較して新しければ反映する
      if (index >= 0 && list[index].updateTime <= currentIssu.updateTime) {
        if (trxId === "D") {
          list.splice(index, 1);
          return list;
        }
        Object.assign(list[index], currentIssu);
        return list; // 元のIssuにマージする
      }
      if (index < 0 && (trxId === "A" || trxId === "U")) {
        // 新規追加
        list.push(currentIssu);
        return list;
      }
      return list;
    };
    returnHeaderInfo.issu = applyData.issu.reduce(reducerIssu, returnHeaderInfo.issu);
  }

  // 空港リマークス
  let airportDtl;
  const airportDtlRaw = applyData.airportDtl;
  if (airportDtlRaw != null) {
    airportDtl = isAirportDtlObj(airportDtlRaw) ? airportDtlRaw : airportDtlRaw.find((e) => e.apoCd === orgHeaderInfo.apoCd);
  }
  if (airportDtl) {
    if (airportDtl.apoCd === orgHeaderInfo.apoCd && airportDtl.apoRmksInfo !== undefined) {
      if (airportDtl.trxId && airportDtl.trxId === "D") {
        returnHeaderInfo.apoRmksInfo = "";
        returnHeaderInfo.edittingAirportRemark = "";
      } else {
        returnHeaderInfo.apoRmksInfo = airportDtl.apoRmksInfo;
        returnHeaderInfo.edittingAirportRemark = airportDtl.apoRmksInfo;
      }
    }
  }

  // Curfew
  if (applyData.curfew.length > 0) {
    const curfew = applyData.curfew.find((e) => e.apoCd === orgHeaderInfo.apoCd);
    if (curfew) {
      if (curfew.trxId && curfew.trxId === "D") {
        returnHeaderInfo.curfewTimeStartLcl = "";
        returnHeaderInfo.curfewTimeEndLcl = "";
      } else {
        returnHeaderInfo.curfewTimeStartLcl = curfew.curfewTimeStartLcl;
        returnHeaderInfo.curfewTimeEndLcl = curfew.curfewTimeEndLcl;
      }
    }
  }

  // バッファを作成
  returnHeaderInfo.buffer = makeBuffer(orgHeaderInfo.buffer, newHeaderInfo);

  return returnHeaderInfo;
}

function isAirportDtlObj(airportDtl: HeaderInfoApi.AirportDtl | HeaderInfoApi.AirportDtl[]): airportDtl is HeaderInfoApi.AirportDtl {
  return toString.call(airportDtl) === toString.call({});
}

/**
 * 画面に反映するデータを作成する
 * @param {HeaderInfoApi.Response[]} buffer
 * @param {HeaderInfoApi.Response} newHeaderInfo
 *
 * @returns {Omit<HeaderInfoApi.Response, "commonHeader">} fis
 */
function makeApplyHeader(
  buffer: HeaderInfoApi.Response[],
  newHeaderInfo: HeaderInfoApi.Response
): Omit<HeaderInfoApi.Response, "commonHeader"> {
  // 今回画面に反映するデータを作成
  const creationTime = dayjs(newHeaderInfo.commonHeader.messageReference.creatorReference.creationTime);
  // バッファデータのうち、受信したデータのcreationTimeよりも後のものを取得する
  // さらに受信したデータを結合しcreationTimeの昇順でソートする
  const sortedHeaders = cloneDeep(buffer)
    .filter((buf) => dayjs(buf.commonHeader.messageReference.creatorReference.creationTime).isSameOrAfter(creationTime))
    .concat(newHeaderInfo)
    .sort(sortCreationTime);
  // timeLclは上で作成したデータのうち最新の日付を返却
  // 他はネストされた配列をフラットにして返却
  return {
    timeLcl: sortedHeaders.reduce((prev, current) => {
      const timeLclPrev = dayjs(prev.timeLcl);
      const timeLclCurrent = dayjs(current.timeLcl);
      return timeLclCurrent.isAfter(timeLclPrev) ? current : prev;
    }).timeLcl,
    usingRwy: sortedHeaders.map((headers) => headers.usingRwy).flat(),
    issu: sortedHeaders.map((headers) => headers.issu).flat(),
    airportDtl: sortedHeaders.map((headers) => headers.airportDtl).flat(),
    curfew: sortedHeaders.map((headers) => headers.curfew).flat(),
  };
}

/**
 * updateTimeの昇順に並び替える
 * @param a
 * @param b
 * @returns
 */
const sortCreationTime = (a: HeaderInfoApi.Response, b: HeaderInfoApi.Response) => {
  const creationTimeA = dayjs(a.commonHeader.messageReference.creatorReference.creationTime);
  const creationTimeB = dayjs(b.commonHeader.messageReference.creatorReference.creationTime);
  return creationTimeA.isSame(creationTimeB) ? 0 : creationTimeA.isBefore(creationTimeB) ? -1 : 1;
};

/**
 * バッファを作成する。期限切れのものは削除する。
 * @param {HeaderInfoApi.Response[]} buffer
 * @param {HeaderInfoApi.Response} currentData
 *
 * @returns {HeaderInfoApi.Response[]} nextBuffer
 */
function makeBuffer(buffer: HeaderInfoApi.Response[], currentData: HeaderInfoApi.Response): HeaderInfoApi.Response[] {
  if (!buffer.length) {
    return [currentData];
  }
  // バッファ内の最新のcreationTimeを取得
  const latestCreationTime = dayjs(
    buffer.concat(currentData).reduce((prev, current) => {
      const creationTimePrev = dayjs(prev.commonHeader.messageReference.creatorReference.creationTime);
      const creationTimeCurrent = dayjs(current.commonHeader.messageReference.creatorReference.creationTime);
      return creationTimeCurrent.isAfter(creationTimePrev) ? current : prev;
    }).commonHeader.messageReference.creatorReference.creationTime
  );
  // バッファ内の最新のcreationTimeから規定秒以内の過去データをバッファする
  return buffer
    .concat(currentData)
    .filter((buf) => {
      const creationTimeBuffer = dayjs(buf.commonHeader.messageReference.creatorReference.creationTime);
      return creationTimeBuffer.isSameOrAfter(
        latestCreationTime.subtract(
          ServerConfig.MQTT_KEEP_ALIVE + ServerConfig.MQTT_SESSION_EXPIRY + ServerConfig.BUFFER_INTERVAL,
          "second"
        )
      );
    })
    .sort(sortCreationTime);
}

// state
export interface CommonState {
  displayMaskNumber: number; // 0: マスク非表示、 !0: マスク表示
  isFetching: boolean;
  isShowMenuModal: boolean;
  isForceGoToError: boolean;
  forceGoToPath: string;
  forceGoToErrorPath: string;
  pushNotificationMessages: PushNotificationMessage[];
  badgeNumber: number;
  headerInfo: HeaderInfo;
  fetchHeaderInfoResult: Reducer.AsyncResult;
  updateAirportRemarksResult: Reducer.AsyncResult;
  initDate: Date;
}

export interface HeaderInfo {
  apoCd: string;
  targetDate: string;
  isToday: boolean;
  apoTimeLcl: string;
  apoTimeDiffUtc: number | null;
  apoRmksInfo: string;
  usingRwy: HeaderInfoApi.UsingRwy[];
  issu: HeaderInfoApi.Issu[];
  edittingAirportRemark: string;
  terminalUtcDate: dayjs.Dayjs | null;
  curfewTimeStartLcl: string;
  curfewTimeEndLcl: string;
  buffer: HeaderInfoApi.Response[];
}

export interface PushNotificationMessage {
  seq: number;
  date: string;
  title: string;
  body: string;
  type: string;
  soalaEventCode?: string;
  legKey?: LegKey | null;
  bbKey?: BbKey | null;
}

export interface LegKey {
  legInfoCd: string;
  orgDateLcl: string;
  alCd: string;
  fltNo: string;
  casFltNo: string;
  skdDepApoCd: string;
  skdArrApoCd: string;
  skdLegSno: number;
}

export interface BbKey {
  id: number;
}

const initialState: CommonState = {
  displayMaskNumber: 0,
  isFetching: false,
  isShowMenuModal: false,
  isForceGoToError: false,
  forceGoToPath: "",
  forceGoToErrorPath: "",
  pushNotificationMessages: [],
  badgeNumber: 0,
  headerInfo: {
    apoCd: "",
    targetDate: "",
    isToday: true,
    apoTimeLcl: "",
    apoTimeDiffUtc: null,
    apoRmksInfo: "",
    usingRwy: [],
    issu: [],
    edittingAirportRemark: "",
    terminalUtcDate: null,
    curfewTimeStartLcl: "",
    curfewTimeEndLcl: "",
    buffer: [],
  },
  fetchHeaderInfoResult: {
    isError: false,
    retry: () => null,
  },
  updateAirportRemarksResult: {
    isError: false,
    retry: () => null,
  },
  initDate: new Date(),
};

function sortUsingRwy(usingRwy: HeaderInfoApi.UsingRwy[]) {
  usingRwy.sort((a, b) => {
    if (a.rwyToLdCat < b.rwyToLdCat || a.rwyNo < b.rwyNo) {
      return -1;
    }
    return 1;
  });
}

function sortIssu(issu: HeaderInfoApi.Issu[]) {
  const issuSort: { [key: string]: number } = { SEC: 1, SWW: 2, TSW: 3, DIC: 4, RCL: 5, SSP: 6 };
  issu.sort((a, b) => issuSort[a.issuCd] - issuSort[b.issuCd]);
}

export const slice = createSlice({
  name: "common",
  initialState,
  reducers: {
    showMask: (state) => {
      state.displayMaskNumber += 1;
    },
    hideMask: (state) => {
      const displayMaskNumber = state.displayMaskNumber > 0 ? state.displayMaskNumber - 1 : 0;
      state.displayMaskNumber = displayMaskNumber;
    },
    fetchHeaderInfo: (
      state,
      action: PayloadAction<{
        apoCd: string;
      }>
    ) => {
      const { apoCd } = action.payload;
      const headerInfo = {
        ...state.headerInfo,
        apoCd,
      };
      state.isFetching = true;
      state.headerInfo = headerInfo;
    },
    fetchHeaderInfoSuccess: (
      state,
      action: PayloadAction<{
        data: HeaderInfoApi.Response;
        apoCd: string;
      }>
    ) => {
      const { data, apoCd } = action.payload;

      // 空港リマークス
      let apoRmksInfo = "";
      if (data.airportDtl) {
        if (isAirportDtlObj(data.airportDtl)) {
          apoRmksInfo = data.airportDtl.apoRmksInfo || "";
        } else if (data.airportDtl.length > 0) {
          const airportDtl = data.airportDtl.find((e) => e.apoCd === apoCd);
          apoRmksInfo = airportDtl != null ? airportDtl.apoRmksInfo : "";
        }
      }
      // Curfew
      let curfewTimeStartLcl = "";
      let curfewTimeEndLcl = "";
      if (data.curfew && data.curfew.length > 0) {
        const curfew = data.curfew.find((e) => e.apoCd === apoCd);
        if (curfew) {
          curfewTimeStartLcl = curfew.curfewTimeStartLcl;
          curfewTimeEndLcl = curfew.curfewTimeEndLcl;
        }
      }

      sortUsingRwy(data.usingRwy);
      sortIssu(data.issu);

      const apoTimeLcl = getTimeDateString(data.timeLcl, "YYYY-MM-DD[T]HH:mm:ss");
      const apoTimeDiffUtc = getTimeDiffUtc(data.timeLcl);

      state.isFetching = false;
      state.headerInfo = {
        ...state.headerInfo,
        apoCd: apoCd || "",
        apoTimeLcl,
        apoTimeDiffUtc,
        apoRmksInfo,
        usingRwy: data.usingRwy,
        issu: data.issu,
        edittingAirportRemark: apoRmksInfo,
        terminalUtcDate: dayjs.utc(),
        curfewTimeStartLcl,
        curfewTimeEndLcl,
      };
      state.fetchHeaderInfoResult = { isError: false, retry: () => null };
    },
    fetchHeaderInfoFailure: (
      state,
      _action: PayloadAction<{
        error: Error;
        retry: () => void;
      }>
    ) => {
      state.isFetching = false;
      state.fetchHeaderInfoResult = { isError: false, retry: () => null };
    },
    fetchHeaderInfoClear: (state) => {
      state.headerInfo = initialState.headerInfo;
    },
    updateHeaderInfoDate: (
      state,
      action: PayloadAction<{
        targetDate: string;
        isToday: boolean;
      }>
    ) => {
      const { targetDate, isToday } = action.payload;
      state.headerInfo = {
        ...state.headerInfo,
        targetDate,
        isToday,
      };
    },
    fetchHeaderInfoFromPushSuccess: (state, action: PayloadAction<HeaderInfoApi.Response>) => {
      const headerInfo = updateHeaderInfo(action.payload, state.headerInfo);

      sortUsingRwy(headerInfo.usingRwy);
      sortIssu(headerInfo.issu);
      headerInfo.terminalUtcDate = dayjs.utc();

      state.headerInfo = headerInfo;
    },
    updateHeaderInfoTerminalUtcDate: (state) => {
      state.headerInfo = {
        ...state.headerInfo,
        terminalUtcDate: dayjs.utc(),
      };
    },
    fetchUpdateAirportRemarks: (state) => {
      state.isFetching = true;
    },
    fetchUpdateAirportRemarksSuccess: (
      state,
      action: PayloadAction<{
        data: UpdateAirportRemarksApi.Response;
        apoCd: string;
      }>
    ) => {
      const { data, apoCd } = action.payload;
      state.isFetching = false;
      state.headerInfo = {
        ...state.headerInfo,
        apoCd,
        apoRmksInfo: data.apoRmksInfo,
        edittingAirportRemark: data.apoRmksInfo,
      };
      state.updateAirportRemarksResult = { isError: false, retry: () => null };
    },
    fetchUpdateAirportRemarksFailure: (
      state,
      action: PayloadAction<{
        error: Error;
        retry: () => void;
      }>
    ) => {
      const { retry } = action.payload;
      state.isFetching = false;
      state.updateAirportRemarksResult = { isError: true, retry };
    },
    setAirportRemarks: (state, action: PayloadAction<string>) => {
      state.headerInfo = {
        ...state.headerInfo,
        edittingAirportRemark: action.payload,
      };
    },
    addNotificationMessagesSuccess: (
      state,
      action: PayloadAction<{
        messages: PushNotificationMessage[];
      }>
    ) => {
      // 既存に存在しないメッセージだけを抽出
      const newMessages = action.payload.messages.filter((newMsg) => !state.pushNotificationMessages.find((msg) => msg.seq === newMsg.seq));
      const badgeNumber = 0;

      // PUSH通知メッセージの取り込みが完了したらiOSに伝える
      if (window.webkit) window.webkit.messageHandlers.addNotificationListCompleted.postMessage("");

      // 端末のローカル日付を表示
      const terminalLclDate = dayjs();
      // 新規メッセージを追加し３日未満でフィルタリング
      const pushNotificationMessages = state.pushNotificationMessages
        .concat(newMessages)
        .filter((msg) => terminalLclDate.diff(dayjs(msg.date), "day") < 3);

      state.pushNotificationMessages = pushNotificationMessages;
      state.badgeNumber = badgeNumber;
    },
    addNotificationMessagesFailure: (_state) => {},
    setBadgeNumber: (state, action: PayloadAction<number>) => {
      state.badgeNumber = action.payload;
    },
    forceGoToError: (
      state,
      action: PayloadAction<{
        forceGoToErrorPath: string;
      }>
    ) => {
      const { forceGoToErrorPath } = action.payload;
      state.isForceGoToError = true;
      state.forceGoToErrorPath = forceGoToErrorPath;
    },
    forceGoTo: (
      state,
      action: PayloadAction<{
        path: string;
      }>
    ) => {
      const { path } = action.payload;
      state.forceGoToPath = path;
    },
    screenTransitionError: (state) => {
      state.isForceGoToError = false;
    },
    screenTransition: (
      state,
      _action: PayloadAction<{
        from: string;
        to: string;
      }>
    ) => {
      state.forceGoToPath = "";
      state.forceGoToErrorPath = "";
    },
    showMenuModal: (state) => {
      state.isShowMenuModal = true;
    },
    hideMenuModal: (state) => {
      state.isShowMenuModal = false;
    },
    initDate: (state) => {
      state.initDate = new Date();
    },
  },
});

export const {
  showMask,
  hideMask,
  fetchHeaderInfo,
  fetchHeaderInfoSuccess,
  updateHeaderInfoDate,
  updateHeaderInfoTerminalUtcDate,
  fetchHeaderInfoFailure,
  fetchHeaderInfoClear,
  fetchHeaderInfoFromPushSuccess,
  fetchUpdateAirportRemarks,
  fetchUpdateAirportRemarksSuccess,
  fetchUpdateAirportRemarksFailure,
  setAirportRemarks,
  addNotificationMessagesSuccess,
  addNotificationMessagesFailure,
  setBadgeNumber,
  forceGoToError,
  forceGoTo,
  screenTransitionError,
  showMenuModal,
  hideMenuModal,
  initDate,
} = slice.actions;

export default slice.reducer;
