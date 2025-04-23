import { createAsyncThunk } from "@reduxjs/toolkit";
import { WebApi } from "../lib/webApi";
import { RootState, AppDispatch } from "../store/storeType";
import { closeFlightModalAction } from "./flightModals";
import { getIdentifier, FlightKey, removeFlightContent, startFetching, failureFetching, applyFlightSpecialCare } from "./flightContents";

export const fetchFlightSpecialCare = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    isReload?: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsFlightSpecialCare/fetchFlightSpecialCare", async (arg, thunkAPI) => {
  const { flightKey, isReload } = arg;
  const { dispatch, getState } = thunkAPI;
  const { onlineDbExpDays } = getState().account.master;
  const params = {
    orgDateLcl: flightKey.orgDateLcl,
    alCd: flightKey.alCd,
    fltNo: flightKey.fltNo,
    skdDepApoCd: flightKey.skdDepApoCd,
    skdArrApoCd: flightKey.skdArrApoCd,
    skdLegSno: flightKey.skdLegSno,
    onlineDbExpDays,
  };
  const identifier = getIdentifier(flightKey);
  dispatch(startFetching({ identifier }));

  try {
    const response = await WebApi.getFlightSpecialCare(dispatch, params);
    dispatch(applyFlightSpecialCare({ flightKey, flightSpecialCare: response.data }));
  } catch (err) {
    if (!isReload) {
      // 便詳細SpecialCare画面表示に失敗した場合、便詳細SpecialCare画面を閉じる
      dispatch(closeFlightModalAction({ identifier }));
      dispatch(removeFlightContent({ identifier }));
    }
    dispatch(failureFetching({ identifier }));
  }
});
