import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SpotNumberRestrictionPopupState {
  isOpen: boolean;
  legInfo: SpotNumberRestrictionCheckApi.ResponseLegInfo[];
  onYesButton: () => void;
  onNoButton: () => void;
}

const initialState: SpotNumberRestrictionPopupState = {
  isOpen: false,
  legInfo: [],
  onYesButton: () => {},
  onNoButton: () => {},
};

export const slice = createSlice({
  name: "spotNumberRestrictionPopup",
  initialState,
  reducers: {
    openSpotNumberRestrictionPopup: (
      state,
      action: PayloadAction<{
        legInfo: SpotNumberRestrictionCheckApi.ResponseLegInfo[];
        onYesButton: () => void;
        onNoButton: () => void;
      }>
    ) => {
      state.isOpen = true;
      state.legInfo = action.payload.legInfo;
      state.onYesButton = action.payload.onYesButton;
      state.onNoButton = action.payload.onNoButton;
    },
    closeSpotNumberRestrictionPopup: (state) => {
      // ここでStateを初期化するとアニメーション前にポップアップの内容が変化してしまう
      state.isOpen = false;
    },
    closeSpotNumberRestrictionPopupSuccess: (state) => {
      // ポップアップのアニメーション完了後にStateを初期化する
      Object.assign(state, initialState);
    },
  },
});

export const { openSpotNumberRestrictionPopup, closeSpotNumberRestrictionPopup, closeSpotNumberRestrictionPopupSuccess } = slice.actions;

export default slice.reducer;
