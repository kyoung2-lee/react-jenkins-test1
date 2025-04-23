import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store/storeType";
import { WebApi } from "../lib/webApi";
import { storage } from "../lib/storage";
import { Const } from "../lib/commonConst";
import { NotificationCreator } from "../lib/notifications";
// eslint-disable-next-line import/no-cycle
import { closeAllDraggableModals, initDate } from "./common";

export interface FlightListKeys {
  selectedApoCd: string;
  date: string;
  dateFrom?: string;
  ship: string;
}

export interface FlightListModal {
  flightListKeys: FlightListKeys;
  focusedAt: Date;
  opened: boolean;
  key: string;
  lists: FlightList | undefined;
  isFetching: boolean;
  posRight?: boolean;
}

export interface FlightList {
  eLegList: FlightsApi.ELegList[];
}

// state
export interface FlightListModalsState {
  modals: FlightListModal[];
  isError: boolean;
  retry: () => void;
}

const initialState: FlightListModalsState = {
  modals: [],
  isError: false,
  retry: () => null,
};

function getKey(keys: FlightListKeys): string {
  const { terminalCat } = storage;
  if (terminalCat === Const.TerminalCat.iPad || terminalCat === Const.TerminalCat.iPhone) {
    return "1"; // モバイルの場合、開く画面は１つだけ
  }
  return `${keys.date}/${keys.ship}`;
}

export const openFlightListModal = createAsyncThunk<
  void,
  {
    flightListKeys: FlightListKeys;
    posRight?: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightListModals/openFlightListModal", (arg, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  if (storage.terminalCat === Const.TerminalCat.iPad || storage.terminalCat === Const.TerminalCat.iPhone) {
    void dispatch(closeAllDraggableModals());
  } else if (
    getState().flightModals.modals.filter((modal) => modal.opened).length +
      getState().flightListModals.modals.filter((modal) => modal.opened).length <=
    0
  ) {
    dispatch(initDate());
  }
  dispatch(slice.actions.openFlightListModalAction(arg));
});

export const getFlightList = createAsyncThunk<void, FlightListKeys, { dispatch: AppDispatch; state: RootState }>(
  "flightListModals/getFlightList",
  async (flightListKeys, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    dispatch(fetchFlightList(flightListKeys));
    NotificationCreator.removeAll({ dispatch });

    const { onlineDbExpDays } = getState().account.master;
    const onlineDbExpDaysPh2 = getState().account.master.oalOnlineDbExpDays;
    const params: FlightsApi.Request = {
      searchType: "SHIP",
      date: flightListKeys.date,
      dateFrom: flightListKeys.dateFrom,
      ship: flightListKeys.ship,
      onlineDbExpDays,
      onlineDbExpDaysPh2,
    };

    try {
      const response = await WebApi.getFlightList(dispatch, params);
      dispatch(fetchFlightListSuccess({ response: response.data, flightListKeys }));
    } catch (err) {
      dispatch(fetchFlightListFailure({ flightListKeys }));
    }
  }
);

export const slice = createSlice({
  name: "flightListModals",
  initialState,
  reducers: {
    clearFlightListModals: (state) => {
      state.modals = [];
    },
    openFlightListModalAction: (
      state,
      action: PayloadAction<{
        flightListKeys: FlightListKeys;
        posRight?: boolean;
      }>
    ) => {
      const newKey = getKey(action.payload.flightListKeys);
      const existIndex = state.modals.findIndex((modal) => modal.key === newKey);
      const newModal: FlightListModal = {
        flightListKeys: { ...action.payload.flightListKeys },
        focusedAt: new Date(),
        opened: true,
        key: newKey,
        lists: undefined,
        isFetching: false,
        posRight: action.payload.posRight,
      };

      if (existIndex >= 0) {
        state.modals.splice(existIndex, 1);
        state.modals.push(newModal);
      } else if (state.modals.length < Const.MODAL_LIMIT_COUNT) {
        state.modals.push(newModal);
      } else {
        const removedElementIndex = state.modals.findIndex((e) => !e.opened);
        if (removedElementIndex >= 0) {
          state.modals.splice(removedElementIndex, 1);
          state.modals.push(newModal);
        }
      }
    },
    closeFlightListModal: (state, action: PayloadAction<FlightListModal>) => {
      const existIndex = state.modals.findIndex((modal) => modal.key === action.payload.key);
      if (existIndex < 0) {
        return;
      }
      state.modals.splice(existIndex, 1);
    },
    focusFlightListModal: (state, action: PayloadAction<FlightListModal>) => {
      const existIndex = state.modals.findIndex((modal) => modal.key === action.payload.key);
      if (existIndex < 0) {
        return;
      }
      state.modals.splice(existIndex, 1);
      state.modals.push({ ...action.payload, focusedAt: new Date(), opened: true });
    },
    fetchFlightList: (state, action: PayloadAction<FlightListKeys>) => {
      const keys = action.payload;
      const keyStr = getKey(keys);
      const newModals = state.modals.map((modal) => (modal.key === keyStr ? { ...modal, isFetching: true } : modal));
      state.modals = newModals;
    },
    fetchFlightListSuccess: (
      state,
      action: PayloadAction<{
        response: FlightsApi.Response;
        flightListKeys: FlightListKeys;
      }>
    ) => {
      const { response, flightListKeys } = action.payload;
      const key = getKey(flightListKeys);

      const eLegList = response.eLegList.map((e) => {
        const eLeg = e;
        if (eLeg.specialSts) {
          try {
            eLeg.specialStses = JSON.parse(eLeg.specialSts) as FlightsApi.SpecialStses; // 特別ステータスのstringをJsonに変換
            eLeg.specialSts = "";
          } catch (err) {
            console.log(err);
            console.log(e.specialSts);
          }
        }
        return eLeg;
      });

      const newModals = state.modals.map((modal) => {
        if (modal.key === key) {
          return {
            ...modal,
            lists: { eLegList },
            isFetching: false,
          };
        }
        return modal;
      });
      state.modals = newModals;
      state.isError = false;
      state.retry = () => null;
    },
    fetchFlightListFailure: (
      state,
      action: PayloadAction<{
        flightListKeys: FlightListKeys;
      }>
    ) => {
      const key = getKey(action.payload.flightListKeys);
      const existIndex = state.modals.findIndex((modal) => modal.key === key);
      if (existIndex < 0) {
        state.modals = state.modals.map((modal) => ({ ...modal, isFetching: false }));
      } else {
        state.modals = state.modals.map((modal) => (modal.key === key ? null : modal)).filter((m): m is FlightListModal => !!m);
      }
    },
  },
});

export const {
  clearFlightListModals,
  closeFlightListModal,
  focusFlightListModal,
  fetchFlightList,
  fetchFlightListSuccess,
  fetchFlightListFailure,
} = slice.actions;

export default slice.reducer;
