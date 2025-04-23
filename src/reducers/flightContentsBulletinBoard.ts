import { createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { RootState, AppDispatch } from "../store/storeType";
import { WebApi, Messages } from "../lib/webApi";
import { closeFlightModalAction } from "./flightModals";
import { formatFltNo, execWithLocationInfo } from "../lib/commonUtil";
import {
  getIdentifier,
  FlightKey,
  removeFlightContent,
  startFetching,
  failureFetching,
  applyBulletinBoard,
  applyBulletinBoardRemoveThread,
  applyBulletinBoardAddThreadReaction,
  applyBulletinBoardDeleteThreadReaction,
  applyBulletinBoardAddResponseReaction,
  applyBulletinBoardDeleteResponseReaction,
  applyBulletinBoardAddCommentReaction,
  applyBulletinBoardDeleteCommentReaction,
  BulletinBoard,
} from "./flightContents";

export const fetchFlightThreadsAll = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    bbId: number | null;
    isReload?: boolean;
    isNeedScroll?: boolean;
    messages?: Messages;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsBulletinBoard/fetchFlightThreadsAll", async (arg, thunkAPI) => {
  const { flightKey, bbId, isReload, isNeedScroll = false, messages } = arg;
  const { dispatch, getState } = thunkAPI;
  const accountState = getState().account;
  const identifier = getIdentifier(flightKey);
  dispatch(startFetching({ identifier }));
  let bulletinBoard: BulletinBoard = {
    isNeedScroll,
    fetchedTimeStamp: Date.now(),
  };
  let errFlg = false;
  try {
    // 掲示板一覧の取得
    const paramsThreadFlight: BulletinBoardThreadFlightApi.Request = {
      legInfoCd: flightKey.oalTblFlg ? "OA2" : "JAL",
      orgDateLcl: flightKey.orgDateLcl,
      alCd: flightKey.alCd,
      fltNo: flightKey.fltNo,
      casFltNo: flightKey.casFltNo || "",
      skdDepApoCd: flightKey.skdDepApoCd,
      skdArrApoCd: flightKey.skdArrApoCd,
      skdLegSno: flightKey.skdLegSno,
      onlineDbExpDays: flightKey.oalTblFlg ? accountState.master.oalOnlineDbExpDays : accountState.master.onlineDbExpDays,
    };

    // スレッド一覧を検索
    const resThreadFlight = await WebApi.getBulletinBoardTheadsFlight(dispatch, paramsThreadFlight, messages);

    bulletinBoard = {
      ...bulletinBoard,
      threads: resThreadFlight.data,
      thread: null,
      currentBbId: null,
    };

    // 自グループ作成のスレッドを検索
    const findedThread = resThreadFlight.data.threads.find((thread) => thread.orgnGrpCd === accountState.jobAuth.user.grpCd);
    // カレントは初回読み込み時のみ設定
    if (findedThread && !isReload && !bbId) {
      bulletinBoard.currentBbId = findedThread.bbId;
    }

    // bbIdを指定されている場合
    if (bbId) {
      const findedThreadBbId = resThreadFlight.data.threads.find((thread) => thread.bbId === bbId);
      if (findedThreadBbId) {
        bulletinBoard.currentBbId = findedThreadBbId.bbId;
      }
    }
  } catch (err) {
    errFlg = true;
  }

  if (bulletinBoard.threads && bulletinBoard.currentBbId) {
    try {
      const paramsThread = {
        bbId: bulletinBoard.currentBbId,
        connectDbCat: bulletinBoard.threads.connectDbCat,
      };
      const onNotFoundOrForbidden = () => {
        if (bulletinBoard.currentBbId) {
          dispatch(applyBulletinBoardRemoveThread({ flightKey, bbId: bulletinBoard.currentBbId }));
        }
      };
      const resThread = await WebApi.getBulletinBoardThead(dispatch, paramsThread, {
        onNotFoundThread: onNotFoundOrForbidden,
        onForbidden: onNotFoundOrForbidden,
      });
      bulletinBoard.thread = resThread.data;
    } catch (err) {
      // 何もしない
    }
  }
  if (!errFlg) {
    dispatch(applyBulletinBoard({ flightKey, bulletinBoard }));
  } else {
    if (!isReload) {
      // 表示に失敗した場合、便詳細履歴画面を閉じる
      dispatch(closeFlightModalAction({ identifier }));
      dispatch(removeFlightContent({ identifier }));
    }
    dispatch(failureFetching({ identifier }));
  }
});

export const fetchFlightThreadsDetailless = createAsyncThunk<void, { flightKey: FlightKey }, { dispatch: AppDispatch; state: RootState }>(
  "flightContentsBulletinBoard/fetchFlightThreadsDetailless",
  async ({ flightKey }, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const accountState = getState().account;
    const identifier = getIdentifier(flightKey);
    dispatch(startFetching({ identifier }));
    let bulletinBoard: BulletinBoard = {
      thread: null,
      currentBbId: null,
      isNeedScroll: false,
      fetchedTimeStamp: Date.now(),
    };
    let errFlg = false;
    try {
      // 掲示板一覧の取得
      const paramsThreadFlight: BulletinBoardThreadFlightApi.Request = {
        legInfoCd: flightKey.oalTblFlg ? "OA2" : "JAL",
        orgDateLcl: flightKey.orgDateLcl,
        alCd: flightKey.alCd,
        fltNo: flightKey.fltNo,
        casFltNo: flightKey.casFltNo || "",
        skdDepApoCd: flightKey.skdDepApoCd,
        skdArrApoCd: flightKey.skdArrApoCd,
        skdLegSno: flightKey.skdLegSno,
        onlineDbExpDays: flightKey.oalTblFlg ? accountState.master.oalOnlineDbExpDays : accountState.master.onlineDbExpDays,
      };

      // スレッド一覧を検索
      const resThreadFlight = await WebApi.getBulletinBoardTheadsFlight(dispatch, paramsThreadFlight);

      bulletinBoard = { ...bulletinBoard, threads: resThreadFlight.data };
    } catch (err) {
      errFlg = true;
    }

    if (!errFlg) {
      dispatch(applyBulletinBoard({ flightKey, bulletinBoard }));
    } else {
      dispatch(failureFetching({ identifier }));
    }
  }
);

export const fetchFlightThread = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    bbId: number;
    connectDbCat: ConnectDbCat;
    isNeedScroll?: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsBulletinBoard/fetchFlightThread", async (arg, thunkAPI) => {
  const { flightKey, bbId, connectDbCat, isNeedScroll = false } = arg;
  const { dispatch } = thunkAPI;
  const identifier = getIdentifier(flightKey);
  dispatch(startFetching({ identifier }));
  try {
    const onNotFoundOrForbidden = () => {
      dispatch(applyBulletinBoardRemoveThread({ flightKey, bbId }));
    };
    // 特定の掲示板の取得
    const resThread = await WebApi.getBulletinBoardThead(
      dispatch,
      { bbId, connectDbCat },
      {
        onNotFoundThread: onNotFoundOrForbidden,
        onForbidden: onNotFoundOrForbidden,
      }
    );

    const bulletinBoard: BulletinBoard = {
      thread: resThread.data,
      currentBbId: bbId,
      isNeedScroll,
      fetchedTimeStamp: Date.now(),
    };
    dispatch(applyBulletinBoard({ flightKey, bulletinBoard }));
  } catch (err) {
    dispatch(failureFetching({ identifier }));
  }
});

export const startThread = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    flight: CommonApi.Flight;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsBulletinBoard/startThread", (arg, thunkAPI) => {
  const { flightKey, flight } = arg;
  const { dispatch, getState } = thunkAPI;
  const onlineDbExpDays = flightKey.oalTblFlg ? getState().account.master.oalOnlineDbExpDays : getState().account.master.onlineDbExpDays;
  const identifier = getIdentifier(flightKey);
  dispatch(startFetching({ identifier }));

  // ロケーションを取得し実行する
  execWithLocationInfo(({ posLat, posLon }) => {
    const execute = async () => {
      try {
        const fltNo = flightKey.casFltNo ? flightKey.casFltNo : flight.alCd + formatFltNo(flight.fltNo);
        // 特定の掲示板の取得
        const params = {
          bbTitle: `${fltNo}/${dayjs(flight.orgDateLcl).format("DDMMM").toUpperCase()} ${flight.lstDepApoCd}-${flight.lstArrApoCd}`,
          legInfoCd: flightKey.oalTblFlg ? "OA2" : "JAL",
          orgDateLcl: flightKey.orgDateLcl,
          alCd: flightKey.alCd,
          fltNo: flightKey.fltNo,
          casFltNo: flightKey.oalTblFlg ? flightKey.casFltNo || "" : "",
          skdDepApoCd: flightKey.skdDepApoCd,
          skdArrApoCd: flightKey.skdArrApoCd,
          skdLegSno: flightKey.skdLegSno,
          onlineDbExpDays,
          posLat,
          posLon,
        };
        const response = await WebApi.postBroadcastFlightStart(dispatch, params);

        await dispatch(
          fetchFlightThreadsAll({
            flightKey,
            bbId: response.data.bbId,
            isReload: true,
          })
        );
        return;
      } catch (err) {
        dispatch(failureFetching({ identifier }));
      }
    };
    void execute();
  });
});

export const toggleThreadReaction = createAsyncThunk<
  void,
  { flightKey: FlightKey; params: BulletinBoardThreadReactionApi.Request },
  { dispatch: AppDispatch; state: RootState }
>("bulletinBoard/toggleThreadReaction", async (arg, { dispatch, getState }) => {
  const { flightKey, params } = arg;
  const { user } = getState().account.jobAuth;
  if (!params.bbId) return;

  // API 呼び出し中はボタン押下後の状態を反映させるため、前もってリアクション数を変更しておく
  if (params.funcType === 1) {
    dispatch(applyBulletinBoardAddThreadReaction({ flightKey, bbId: params.bbId, racType: params.racType, user }));
  } else if (params.funcType === 2) {
    dispatch(applyBulletinBoardDeleteThreadReaction({ flightKey, bbId: params.bbId, racType: params.racType, user }));
  }

  try {
    await WebApi.postBulletinBoardThreadReaction(dispatch, params);
  } catch (error) {
    // スレッドリアクション更新 API 呼び出し失敗、変更したリアクション数を元に戻す
    if (params.funcType === 1) {
      dispatch(applyBulletinBoardDeleteThreadReaction({ flightKey, bbId: params.bbId, racType: params.racType, user }));
    } else if (params.funcType === 2) {
      dispatch(applyBulletinBoardAddThreadReaction({ flightKey, bbId: params.bbId, racType: params.racType, user }));
    }
  }
});

export const toggleResponseReaction = createAsyncThunk<
  void,
  { flightKey: FlightKey; params: BulletinBoardResponseReactionApi.Request },
  { dispatch: AppDispatch; state: RootState }
>("bulletinBoard/toggleResponseReaction", async (arg, { dispatch, getState }) => {
  const { flightKey, params } = arg;
  const { user } = getState().account.jobAuth;
  if (!params.resId) return;

  if (params.funcType === 1) {
    dispatch(applyBulletinBoardAddResponseReaction({ flightKey, resId: params.resId, racType: params.racType, user }));
  } else if (params.funcType === 2) {
    dispatch(applyBulletinBoardDeleteResponseReaction({ flightKey, resId: params.resId, racType: params.racType, user }));
  }

  try {
    await WebApi.postBulletinBoardResponseReaction(dispatch, params);
  } catch (error) {
    if (params.funcType === 1) {
      dispatch(applyBulletinBoardDeleteResponseReaction({ flightKey, resId: params.resId, racType: params.racType, user }));
    } else if (params.funcType === 2) {
      dispatch(applyBulletinBoardAddResponseReaction({ flightKey, resId: params.resId, racType: params.racType, user }));
    }
  }
});

export const toggleCommentReaction = createAsyncThunk<
  void,
  { flightKey: FlightKey; params: BulletinBoardCommentReactionApi.Request },
  { dispatch: AppDispatch; state: RootState }
>("bulletinBoard/toggleCommentReaction", async (arg, { dispatch, getState }) => {
  const { flightKey, params } = arg;
  const { user } = getState().account.jobAuth;
  if (!params.cmtId) return;

  if (params.funcType === 1) {
    dispatch(applyBulletinBoardAddCommentReaction({ flightKey, cmtId: params.cmtId, racType: params.racType, user }));
  } else if (params.funcType === 2) {
    dispatch(applyBulletinBoardDeleteCommentReaction({ flightKey, cmtId: params.cmtId, racType: params.racType, user }));
  }

  try {
    await WebApi.postBulletinBoardCommentReaction(dispatch, params);
  } catch (error) {
    if (params.funcType === 1) {
      dispatch(applyBulletinBoardDeleteCommentReaction({ flightKey, cmtId: params.cmtId, racType: params.racType, user }));
    } else if (params.funcType === 2) {
      dispatch(applyBulletinBoardAddCommentReaction({ flightKey, cmtId: params.cmtId, racType: params.racType, user }));
    }
  }
});
