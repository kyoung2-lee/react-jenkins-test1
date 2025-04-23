import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store/storeType";
import { WebApi } from "../lib/webApi";
import { closeFlightModalAction } from "./flightModals";
import { getIdentifier, FlightKey, removeFlightContent, startFetching, failureFetching, applyFlightChangeHistory } from "./flightContents";

export const fetchFlightChangeHistory = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    isReload?: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsFlightChangeHistory/fetchFlightChangeHistory", async (arg, thunkAPI) => {
  const { flightKey, isReload } = arg;
  const { dispatch, getState } = thunkAPI;
  const { master } = getState().account;
  const params = {
    orgDateLcl: flightKey.orgDateLcl,
    alCd: flightKey.alCd,
    fltNo: flightKey.fltNo,
    casFltNo: flightKey.casFltNo || "",
    skdDepApoCd: flightKey.skdDepApoCd,
    skdArrApoCd: flightKey.skdArrApoCd,
    skdLegSno: flightKey.skdLegSno,
    oalTblFlg: flightKey.oalTblFlg,
    onlineDbExpDays: flightKey.oalTblFlg ? master.oalOnlineDbExpDays : master.onlineDbExpDays,
  };
  const identifier = getIdentifier(flightKey);
  dispatch(startFetching({ identifier }));

  try {
    const response = await WebApi.getFlightHistory(dispatch, params);
    dispatch(applyFlightChangeHistory({ flightKey, flightChangeHistory: response.data }));
  } catch (err) {
    if (!isReload) {
      // 便詳細履歴画面表示に失敗した場合、便詳細履歴画面を閉じる
      dispatch(closeFlightModalAction({ identifier }));
      dispatch(removeFlightContent({ identifier }));
    }
    dispatch(failureFetching({ identifier }));
  }
});
