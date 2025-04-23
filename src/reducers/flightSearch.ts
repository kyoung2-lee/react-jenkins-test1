import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uniq } from "lodash";
import { RootState, AppDispatch } from "../store/storeType";
import { ApiError, WebApi } from "../lib/webApi";
import { funcAuthCheck } from "../lib/commonUtil";
import { Const } from "../lib/commonConst";
import { storage } from "../lib/storage";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { FlightKey, addFlightContent, getIdentifier } from "./flightContents";
import { fetchFlightDetail } from "./flightContentsFlightDetail";
import { openFlightModal } from "./flightModals";

export const searchFlight = createAsyncThunk<
  void,
  {
    searchParams: SearchParams;
    myApoCd: string;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightSearch/searchFlight", async (arg, thunkAPI) => {
  const { searchParams, myApoCd } = arg;
  const { dispatch, getState } = thunkAPI;
  const { date, searchType, flt, mvtType } = searchParams;
  const { onlineDbExpDays } = getState().account.master;
  const onlineDbExpDaysPh2 = getState().account.master.oalOnlineDbExpDays;
  const requestParams: FlightsApi.Request = {
    searchType,
    date,
    dateFrom: searchType === "MVT" ? searchParams.dateFrom : undefined,
    dateTo: searchType === "MVT" ? searchParams.dateTo : undefined,
    alCd: searchType === "FLT" && !searchParams.casFltFlg ? flt.slice(0, 2) : undefined,
    fltNo: searchType === "FLT" && !searchParams.casFltFlg ? flt.slice(2) : undefined,
    casFltNo: searchType === "FLT" && searchParams.casFltFlg ? flt : undefined,
    depApoCd: searchType === "LEG" || searchType === "AL" || searchType === "MVT" ? searchParams.depApoCd : undefined,
    arrApoCd: searchType === "LEG" || searchType === "AL" || searchType === "MVT" ? searchParams.arrApoCd : undefined,
    jalGrpFlg: searchType === "LEG" && searchParams.jalGrpFlg !== "ALL" ? searchParams.jalGrpFlg : undefined,
    intDomCat: (searchType === "LEG" || searchType === "MVT") && searchParams.intDomCat !== "D/I" ? searchParams.intDomCat : undefined,
    ship: searchType === "SHIP" ? searchParams.ship : undefined,
    casFltFlg: searchType === "FLT" ? searchParams.casFltFlg : undefined,
    alCdList: searchType === "AL" ? searchParams.alCdList : undefined,
    trCdList: searchType === "MVT" ? searchParams.trCdList : undefined,
    onlineDbExpDays,
    onlineDbExpDaysPh2,
    depMvtChkFlg: searchType === "MVT" ? !!(mvtType === "BOTH" || mvtType === "DEP") : undefined,
    arrMvtChkFlg: searchType === "MVT" ? !!(mvtType === "BOTH" || mvtType === "ARR") : undefined,
  };
  dispatch(clearFlightSearch()); // 初期化処理
  dispatch(fetchFlight(requestParams));
  NotificationCreator.removeAll({ dispatch });

  try {
    const response = await WebApi.getFlightList(dispatch, requestParams);
    const { jobAuth } = getState().account.jobAuth;
    if (funcAuthCheck(Const.FUNC_ID.openFlightDetail, jobAuth)) {
      await dispatch(autoGetFlightDetail({ eLegList: response.data.eLegList, myApoCd }));
    }
    dispatch(fetchFlightSuccess(response.data));
  } catch (err) {
    let fetchValidationErrors: string[] = [];
    if (err instanceof ApiError && err.response) {
      if (err.response.status === 422) {
        const data = (err.response.data as { errors: { errorItems: string[]; errorMessages: string[] }[] }) || null;
        if (data && data.errors) {
          data.errors.forEach((error) => {
            fetchValidationErrors = fetchValidationErrors.concat(error.errorItems);
            // メッセージを表示
            error.errorMessages.forEach((errorText) => {
              NotificationCreator.create({ dispatch, message: SoalaMessage.M50029C({ title: "Input Error", errorText }) });
            });
          });
          fetchValidationErrors = uniq(fetchValidationErrors);
        }
      }
    }
    dispatch(fetchFlightFailure({ fetchValidationErrors }));
  }
});

export const reloadFlightSearch = createAsyncThunk<void, undefined, { dispatch: AppDispatch; state: RootState }>(
  "flightSearch/reload",
  async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { requestParams } = getState().flightSearch;
    const { myApoCd } = getState().account.jobAuth.user;
    if (!requestParams) return;
    dispatch(fetchFlight(requestParams));
    NotificationCreator.removeAll({ dispatch });
    try {
      const response = await WebApi.getFlightList(dispatch, requestParams);
      const { jobAuth } = getState().account.jobAuth;
      if (funcAuthCheck(Const.FUNC_ID.openFlightDetail, jobAuth)) {
        await dispatch(autoGetFlightDetail({ eLegList: response.data.eLegList, myApoCd }));
      }
      dispatch(fetchFlightSuccess(response.data));
    } catch (err) {
      let fetchValidationErrors: string[] = [];
      if (err instanceof ApiError && err.response) {
        if (err.response.status === 422) {
          const data = (err.response.data as { errors: { errorItems: string[]; errorMessages: string[] }[] }) || null;
          if (data && data.errors) {
            data.errors.forEach((error) => {
              fetchValidationErrors = fetchValidationErrors.concat(error.errorItems);
              // メッセージを表示
              error.errorMessages.forEach((errorText) => {
                NotificationCreator.create({ dispatch, message: SoalaMessage.M50029C({ title: "Input Error", errorText }) });
              });
            });
            fetchValidationErrors = uniq(fetchValidationErrors);
          }
        }
      }
      dispatch(fetchFlightFailure({ fetchValidationErrors }));
    }
  }
);

export const autoGetFlightDetail = createAsyncThunk<
  void,
  {
    eLegList: FlightsApi.ELegList[];
    myApoCd: string;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightSearch/autoGetFlightDetail", async (arg, thunkAPI) => {
  const { eLegList, myApoCd } = arg;
  const { dispatch } = thunkAPI;
  if (eLegList.length !== 1) return;

  const eLeg = eLegList[0];

  const flightKey: FlightKey = {
    myApoCd,
    orgDateLcl: eLeg.orgDateLcl,
    alCd: eLeg.alCd,
    fltNo: eLeg.fltNo,
    casFltNo: eLeg.casFltNo,
    skdDepApoCd: eLeg.skdDepApoCd,
    skdArrApoCd: eLeg.skdArrApoCd,
    skdLegSno: eLeg.skdLegSno,
    oalTblFlg: eLeg.oalTblFlg,
  };

  const tabName = "Detail";
  const isReload = true;
  const selectedFlightIdentifier = getIdentifier(flightKey);
  dispatch(openFlightDetail({ selectedFlightIdentifier }));
  if (storage.isIphone) {
    const posRight = false;
    void dispatch(openFlightModal({ flightKey, posRight, tabName }));
  } else {
    dispatch(addFlightContent({ flightKey, tabName, removeAll: true }));
  }
  await dispatch(fetchFlightDetail({ flightKey, isReload }));
});

export const showConfirmation = createAsyncThunk<void, { onClickYes: () => void }, { dispatch: AppDispatch; state: RootState }>(
  "flightSearch/showConfirmation",
  (arg, { dispatch }) => {
    const { onClickYes } = arg;
    NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: onClickYes }) });
  }
);

export interface SearchParams {
  searchType: "FLT" | "LEG" | "SHIP" | "AL" | "MVT";
  date: string;
  dateFrom: string;
  dateTo: string;
  flt: string;
  depApoCd: string;
  arrApoCd: string;
  jalGrpFlg: boolean | "ALL";
  intDomCat: "D" | "I" | "D/I";
  ship: string;
  casFltFlg: boolean;
  alCdList: string[];
  trCdList: string[];
  mvtType: "BOTH" | "DEP" | "ARR";
}

export const showNotificationFlightRmksNoChange = createAsyncThunk<void, undefined, { dispatch: AppDispatch; state: RootState }>(
  "flightSearch/showNotificationFlightRmksNoChange",
  (_, { dispatch }) => {
    NotificationCreator.create({ dispatch, message: SoalaMessage.M40002C({}) });
  }
);

export interface FlightSearchState {
  eLegList: FlightsApi.ELegList[];
  requestParams: FlightsApi.Request | null;
  isSearched: boolean;
  isFlightDetailOpen: boolean;
  selectedFlightIdentifier: string;
  isFetching: boolean;
  isFetchingDetail: boolean;
  isError: boolean;
  fetchValidationErrors: string[];
}

const initialState: FlightSearchState = {
  eLegList: [],
  requestParams: null,
  isSearched: false,
  isFlightDetailOpen: false,
  selectedFlightIdentifier: "",
  isFetching: false,
  isFetchingDetail: false,
  isError: false,
  fetchValidationErrors: [],
};

export const slice = createSlice({
  name: "flightSearch",
  initialState,
  reducers: {
    clearFlightSearch: (state) => {
      Object.assign(state, initialState);
    },
    fetchFlight: (state, action: PayloadAction<FlightsApi.Request>) => {
      const requestParams = action.payload;
      state.requestParams = requestParams;
      state.isFetching = true;
      state.isFlightDetailOpen = false;
    },
    fetchFlightSuccess: (state, action: PayloadAction<FlightsApi.Response>) => {
      const eLegList = action.payload.eLegList.map((e) => {
        const newELeg = e;
        if (e.specialSts) {
          try {
            newELeg.specialStses = JSON.parse(e.specialSts) as FlightsApi.ELegList["specialStses"]; // 特別ステータスのstringをJsonに変換
            newELeg.specialSts = "";
          } catch (err) {
            console.log(err);
            console.log(e.specialSts);
          }
        }
        return e;
      });
      state.isSearched = true;
      state.isFetching = false;
      state.eLegList = eLegList;
      state.isError = false;
    },
    fetchFlightFailure: (state, action: PayloadAction<{ fetchValidationErrors: string[] }>) => {
      const { fetchValidationErrors } = action.payload;

      state.isFetching = false;
      state.fetchValidationErrors = fetchValidationErrors;
    },
    openFlightDetail: (state, action: PayloadAction<{ selectedFlightIdentifier: string }>) => {
      const { selectedFlightIdentifier } = action.payload;
      state.isFlightDetailOpen = true;
      state.selectedFlightIdentifier = selectedFlightIdentifier;
    },
  },
});

export const { clearFlightSearch, fetchFlight, fetchFlightSuccess, fetchFlightFailure, openFlightDetail } = slice.actions;

export default slice.reducer;
