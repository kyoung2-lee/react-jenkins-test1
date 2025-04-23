import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import isEqual from "lodash.isequal";
import { AppDispatch, RootState } from "../store/storeType";
// eslint-disable-next-line import/no-cycle
import { closeAllDraggableModals } from "./common";
import { Const } from "../lib/commonConst";
import { storage } from "../lib/storage";

// Action Creator
export const openShipTransitListModal = createAsyncThunk<void, ShipTransitListModal, { dispatch: AppDispatch; state: RootState }>(
  "shipTransitListModals/openShipTransitListModal",
  (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    if (storage.terminalCat === Const.TerminalCat.iPad || storage.terminalCat === Const.TerminalCat.iPhone) {
      void dispatch(closeAllDraggableModals());
    }
    dispatch(slice.actions.openShipTransitListModal(arg));
  }
);

export interface ShipTransitListModal {
  alCd: string;
  fltNo: string;
  focusedAt: Date;
}

// state
export type ShipTransitListModalsState = {
  modals: ShipTransitListModal[];
};

const initialState: ShipTransitListModalsState = {
  modals: [],
};

export const slice = createSlice({
  name: "shipTransitListModals",
  initialState,
  reducers: {
    clearShipTransitListModals: (state) => {
      state.modals = [];
    },
    openShipTransitListModal: (state, action: PayloadAction<ShipTransitListModal>) => {
      const exist = state.modals.find((val) => val.alCd === action.payload.alCd && val.fltNo === action.payload.fltNo);
      // 既に同一の値がstateに入っていたら、stateをそのまま返す。
      if (exist) {
        return;
      }
      state.modals.push(action.payload);
    },
    closeShipTransitListModal: (state, action: PayloadAction<ShipTransitListModal>) => {
      const existIndex = state.modals.findIndex((val) => isEqual(val, action.payload));
      if (existIndex >= 0) {
        state.modals.splice(existIndex, 1);
      }
    },
    focusShipTransitListModal: (state, action: PayloadAction<ShipTransitListModal>) => {
      const existIndex = state.modals.findIndex((val) => isEqual(val, action.payload));
      if (existIndex >= 0) {
        state.modals.splice(existIndex, 1);
        state.modals.push({ ...action.payload, focusedAt: new Date() });
      }
    },
  },
});

export const { clearShipTransitListModals, closeShipTransitListModal, focusShipTransitListModal } = slice.actions;

export default slice.reducer;
