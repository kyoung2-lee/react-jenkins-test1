import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store/storeType";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";

export const showConfirmation = createAsyncThunk<void, { onClickYes: () => void }, { dispatch: AppDispatch; state: RootState }>(
  "SpotFilterModal/showConfirmation",
  (arg, thunkAPI) => {
    const { onClickYes } = arg;
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: onClickYes }) });
  }
);

// state
export interface SpotFilterModalState {
  isOpen: boolean;
  spotNoList: string[];
}

const initialState: SpotFilterModalState = { isOpen: false, spotNoList: [] };

export const slice = createSlice({
  name: "spotFilterModal",
  initialState,
  reducers: {
    openSpotFilterModal: (state, action: PayloadAction<{ spotNoList: string[] }>) => {
      const { spotNoList } = action.payload;
      state.isOpen = true;
      state.spotNoList = spotNoList;
    },
    closeSpotFilterModal: (state) => {
      Object.assign(state, initialState);
    },
    enterSpotFilterModal: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { openSpotFilterModal, closeSpotFilterModal, enterSpotFilterModal } = slice.actions;

export default slice.reducer;
