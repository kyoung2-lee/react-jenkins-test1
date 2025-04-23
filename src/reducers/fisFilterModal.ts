import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store/storeType";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";

export const searchFis = createAsyncThunk<void, SearchParams, { dispatch: AppDispatch; state: RootState }>(
  "fisFilterModal/searchFis",
  (arg, thunkAPI) => {
    const searchParams = arg;
    const { dispatch } = thunkAPI;
    let isFiltered = false;
    if (
      (searchParams.airLineCode && searchParams.airLineCode.length) ||
      searchParams.airLineCodeJALGRP ||
      searchParams.airLineCodeOALAll ||
      (searchParams.airLineCodeOAL && searchParams.airLineCodeOAL.length) ||
      searchParams.flightNo ||
      searchParams.airport ||
      searchParams.ship ||
      (searchParams.spot && searchParams.spot.length) ||
      searchParams.dateTimeRadio ||
      searchParams.dateTimeFrom ||
      searchParams.dateTimeTo ||
      searchParams.domOrInt ||
      searchParams.skdOrNsk ||
      searchParams.cnlHideFlg
    ) {
      isFiltered = true;
    }
    NotificationCreator.removeAll({ dispatch });
    dispatch(slice.actions.searchSubmit({ searchParams, isFiltered }));
  }
);

export const showInfoNoAirport = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "fisFilterModal/showInfoNoAirport",
  (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message: SoalaMessage.M30007C() });
  }
);

export const showInfoNoData = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "fisFilterModal/showInfoNoData",
  (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message: SoalaMessage.M30003C() });
  }
);

export interface SearchParams {
  airLineCode: string[];
  airLineCodeJALGRP: boolean;
  airLineCodeOALAll: boolean;
  airLineCodeOAL: string[];
  flightNo: string;
  airport: string;
  ship: string;
  spot: string[];
  dateTimeRadio: DateTimeRadio;
  dateTimeFrom: string;
  dateTimeTo: string;
  domOrInt: string;
  skdOrNsk: string;
  casualFlg: boolean;
  cnlHideFlg: boolean;
}

export type DateTimeRadio = "" | "DEP" | "ARR";

export interface FisFilterModalState {
  modalIsOpen: boolean;
  isFiltered: boolean;
  isSubmit: boolean;
  isForceFilter: boolean;
  searchParams: SearchParams;
}

const initialState: FisFilterModalState = {
  modalIsOpen: false,
  isFiltered: false,
  isSubmit: false,
  isForceFilter: false,
  searchParams: {
    airLineCode: [],
    airLineCodeJALGRP: false,
    airLineCodeOALAll: false,
    airLineCodeOAL: [],
    flightNo: "",
    airport: "",
    ship: "",
    spot: [],
    dateTimeRadio: "",
    dateTimeFrom: "",
    dateTimeTo: "",
    domOrInt: "",
    skdOrNsk: "",
    casualFlg: false,
    cnlHideFlg: false,
  },
};

export const slice = createSlice({
  name: "fisFilterModal",
  initialState,
  reducers: {
    clearFisFilterModal: (state) => {
      Object.assign(state, initialState);
    },
    openFlightSearchModal: (state) => {
      state.modalIsOpen = true;
    },
    closeFlightSearchModal: (state) => {
      state.modalIsOpen = false;
    },
    searchSubmit: (
      state,
      action: PayloadAction<{
        searchParams: SearchParams;
        isFiltered: boolean;
      }>
    ) => {
      const { searchParams, isFiltered } = action.payload;
      state.isSubmit = true;
      state.searchParams = { ...searchParams };
      state.isFiltered = isFiltered;
      state.isForceFilter = !isFiltered;
    },
    checkedFisRowsLength: (state) => {
      state.isSubmit = false;
    },
    forceFiltered: (state) => {
      state.isForceFilter = false;
    },
  },
});

export const { clearFisFilterModal, openFlightSearchModal, closeFlightSearchModal, checkedFisRowsLength, forceFiltered } = slice.actions;

export default slice.reducer;
