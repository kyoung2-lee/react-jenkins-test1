import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store/storeType";
import { storage } from "../lib/storage";
import { Const } from "../lib/commonConst";
// eslint-disable-next-line import/no-cycle
import { closeAllDraggableModals, initDate } from "./common";
import { FlightModalTabName, addFlightContent, removeFlightContent, FlightKey, getIdentifier } from "./flightContents";

export interface FlightModal {
  focusedAt: Date;
  opened: boolean;
  posRight: boolean;
  key: string;
  identifier: string;
  isFetching: boolean;
}

export interface FlightModalsState {
  modals: FlightModal[];
  isError: boolean;
  retry: () => void;
}

const initialState: FlightModalsState = {
  modals: [],
  isError: false,
  retry: () => null,
};

function getKey({ identifier, posRight }: { identifier: string; posRight: boolean }): string {
  switch (true) {
    case storage.isIpad:
      return posRight ? "ARR" : "DEP";
    case storage.isIphone:
      return "1";
    default:
      return identifier;
  }
}

export const openFlightModal = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    posRight: boolean;
    tabName: FlightModalTabName;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightModals/openFlightModal", (arg, thunkAPI) => {
  const { flightKey, posRight, tabName } = arg;
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
  const identifier = getIdentifier(flightKey);
  dispatch(slice.actions.openFlightModalAction({ identifier, posRight }));
  dispatch(addFlightContent({ flightKey, tabName }));
});

export const closeFlightModal = createAsyncThunk<
  void,
  {
    identifier: string;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightModals/closeFlightModal", (arg, thunkAPI) => {
  const { identifier } = arg;
  const { dispatch } = thunkAPI;
  dispatch(closeFlightModalAction({ identifier }));
  dispatch(removeFlightContent({ identifier }));
});

export const slice = createSlice({
  name: "flightModals",
  initialState,
  reducers: {
    clearFlightModals: (state) => {
      state.modals = [];
    },
    openFlightModalAction: (
      state,
      action: PayloadAction<{
        identifier: string;
        posRight: boolean;
      }>
    ) => {
      const { identifier, posRight } = action.payload;
      const key = getKey({ identifier, posRight });
      const existedModalIndex = state.modals.findIndex((modal) => modal.key === key);
      const newModal = {
        opened: true,
        focusedAt: new Date(),
        posRight,
        key,
        identifier,
        isFetching: false,
      };

      if (existedModalIndex >= 0) {
        state.modals.splice(existedModalIndex, 1);
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
    closeFlightModalAction: (
      state,
      action: PayloadAction<{
        identifier: string;
      }>
    ) => {
      const existedModalIndex = state.modals.findIndex((m) => m.identifier === action.payload.identifier);
      if (existedModalIndex >= 0) {
        const existedModal = state.modals[existedModalIndex];
        state.modals.splice(existedModalIndex, 1);
        state.modals.push({
          ...existedModal,
          opened: false,
        });
      }
    },
    focusFlightModalAction: (
      state,
      action: PayloadAction<{
        identifier: string;
      }>
    ) => {
      const existedModalIndex = state.modals.findIndex((m) => m.identifier === action.payload.identifier);
      if (existedModalIndex >= 0) {
        const existedModal = state.modals[existedModalIndex];
        state.modals.splice(existedModalIndex, 1);
        state.modals.push({
          ...existedModal,
          focusedAt: new Date(),
        });
      }
    },
  },
});

export const { clearFlightModals, closeFlightModalAction, focusFlightModalAction } = slice.actions;

export default slice.reducer;
