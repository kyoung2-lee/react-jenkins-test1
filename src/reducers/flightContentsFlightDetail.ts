import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store/storeType";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { WebApi, Messages, ApiError } from "../lib/webApi";
import { closeFlightModalAction } from "./flightModals";
import {
  getIdentifier,
  FlightKey,
  removeFlightContent,
  startFetching,
  failureFetching,
  applyFlightDetail,
  applyFlightRmks,
} from "./flightContents";

export const fetchFlightDetail = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    isReload?: boolean;
    openRmksPopup?: () => void;
    closeRmksPopup?: () => void;
    messages?: Messages;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsFlightDetail/fetchFlightDetail", async (arg, thunkAPI) => {
  const { flightKey, isReload, openRmksPopup, closeRmksPopup, messages } = arg;
  const { dispatch, getState } = thunkAPI;
  const onlineDbExpDays = flightKey.oalTblFlg ? getState().account.master.oalOnlineDbExpDays : getState().account.master.onlineDbExpDays;
  const params = {
    ...flightKey,
    casFltNo: flightKey.casFltNo || "",
    onlineDbExpDays,
  };
  const identifier = getIdentifier(flightKey);
  dispatch(startFetching({ identifier }));
  try {
    const response = await WebApi.getFlightDetail(dispatch, params, messages);
    dispatch(applyFlightDetail({ flightKey: params, flightDetail: response.data }));
    if (openRmksPopup) {
      openRmksPopup();
    }
  } catch (err) {
    if (err instanceof ApiError && err.response) {
      const statusCode = err.response.status;
      if (!isReload) {
        // 便詳細表示に失敗した場合、便詳細を閉じる
        dispatch(closeFlightModalAction({ identifier }));
        dispatch(removeFlightContent({ identifier }));
      } else if (
        closeRmksPopup &&
        statusCode !== 400 && // 強制画面しない場合のみ
        statusCode !== 401 &&
        statusCode !== 403 &&
        statusCode !== 404 &&
        statusCode !== 405
      ) {
        // 便詳リマークス表示時、便詳細表示に失敗した場合、便リマークスポップアップを閉じる
        closeRmksPopup();
      }
      dispatch(failureFetching({ identifier }));
    }
  }
});

export const showNotificationFlightRmksNoChange = createAsyncThunk<void, undefined, { dispatch: AppDispatch; state: RootState }>(
  "flightContentsFlightDetail/showNotificationFlightRmksNoChange",
  (_, { dispatch }) => {
    NotificationCreator.create({ dispatch, message: SoalaMessage.M40002C({}) });
  }
);

export const updateFlightRmks = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    rmksTypeCd: "ARR" | "DEP";
    rmksText?: string;
    closeRmksPopup: () => void;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsFlightDetail/updateFlightRmks", async (arg, thunkAPI) => {
  const { flightKey, rmksTypeCd, rmksText, closeRmksPopup } = arg;
  const { dispatch } = thunkAPI;
  const params: FlightRmksApi.Request = {
    orgDateLcl: flightKey.orgDateLcl,
    alCd: flightKey.alCd,
    fltNo: flightKey.fltNo,
    casFltNo: flightKey.casFltNo || "",
    skdDepApoCd: flightKey.skdDepApoCd,
    skdArrApoCd: flightKey.skdArrApoCd,
    skdLegSno: flightKey.skdLegSno,
    oalTblFlg: flightKey.oalTblFlg,
    rmksTypeCd,
    rmksText,
  };
  const identifier = getIdentifier(flightKey);
  dispatch(startFetching({ identifier }));

  try {
    const response = await WebApi.postFlightRemarks(dispatch, params);
    dispatch(applyFlightRmks({ identifier, response: response.data, params }));
    closeRmksPopup();
  } catch (err) {
    dispatch(failureFetching({ identifier }));
  }
});

export const showConfirmation = createAsyncThunk<void, { onClickYes: () => void }, { dispatch: AppDispatch; state: RootState }>(
  "flightContentsFlightDetail/showConfirmation",
  ({ onClickYes }, { dispatch }) => {
    NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: onClickYes }) });
  }
);
