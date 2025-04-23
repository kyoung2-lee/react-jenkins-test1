import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { WebApi } from "../lib/webApi";
import { RootState, AppDispatch } from "../store/storeType";
import { closeFlightModalAction } from "./flightModals";
import {
  getIdentifier,
  FlightKey,
  removeFlightContent,
  startFetching,
  failureFetching,
  applyStationOperationTask,
  StationOperationTask,
} from "./flightContents";

export const fetchStationOperationTask = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    isReload?: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsStationOperationTask/fetchStationOperationTask", async (arg, thunkAPI) => {
  const { flightKey, isReload } = arg;
  const { dispatch, getState } = thunkAPI;
  const onlineDbExpDays = flightKey.oalTblFlg ? getState().account.master.oalOnlineDbExpDays : getState().account.master.onlineDbExpDays;
  const params = {
    orgDateLcl: flightKey.orgDateLcl,
    alCd: flightKey.alCd,
    fltNo: flightKey.fltNo,
    casFltNo: flightKey.casFltNo || "",
    skdDepApoCd: flightKey.skdDepApoCd,
    skdArrApoCd: flightKey.skdArrApoCd,
    skdLegSno: flightKey.skdLegSno,
    oalTblFlg: flightKey.oalTblFlg,
    onlineDbExpDays,
  };
  const identifier = getIdentifier(flightKey);
  dispatch(startFetching({ identifier }));

  try {
    const response = await WebApi.getWorkStep(dispatch, params);
    dispatch(applyStationOperationTask({ flightKey, stationOperationTask: response.data }));
  } catch (err) {
    if (!isReload) {
      // 発着工程表示に失敗した場合、発着工程表示を閉じる
      dispatch(closeFlightModalAction({ identifier }));
      dispatch(removeFlightContent({ identifier }));
    }
    dispatch(failureFetching({ identifier }));
  }
});

export const updateStationOperationTask = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    postStationOperationTask: StationOperationTaskApi.RequestPost;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsStationOperationTask/updateStationOperationTask", async (arg, thunkAPI) => {
  const { flightKey, postStationOperationTask } = arg;
  const { dispatch } = thunkAPI;
  const identifier = getIdentifier(flightKey);
  dispatch(startFetching({ identifier }));

  try {
    const response = await WebApi.postWorkStep(dispatch, postStationOperationTask);
    dispatch(applyStationOperationTask({ flightKey, stationOperationTask: response.data }));
  } catch (err) {
    const error = err as AxiosError;
    if (error && error.response && error.response.status === 591) {
      // 591の場合は、SOALA内部の更新は正常に行えているため画面の表示更新を行う
      dispatch(applyStationOperationTask({ flightKey, stationOperationTask: error.response.data as StationOperationTask }));
    } else {
      dispatch(failureFetching({ identifier }));
    }
  }
});
