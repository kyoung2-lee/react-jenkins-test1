import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PopupTargetType = "thread" | "response" | "comment" | "";

export interface BulletinBoardReactionRegistPopupState {
  isOpen: boolean;
  popupTargetType: PopupTargetType;
  popupTargetId: number;
}

const initialState: BulletinBoardReactionRegistPopupState = {
  isOpen: false,
  popupTargetType: "",
  popupTargetId: 0,
};

export const slice = createSlice({
  name: "bulletinBoardReactionRegistPopup",
  initialState,
  reducers: {
    openReactionRegistPopup: (state) => {
      state.isOpen = true;
    },
    closeReactionRegistPopup: (state) => {
      state.isOpen = false;
    },
    setReactionRegistPopupStatus: (
      state,
      action: PayloadAction<{
        popupTargetType: PopupTargetType;
        popupTargetId: number;
      }>
    ) => {
      state.popupTargetType = action.payload.popupTargetType;
      state.popupTargetId = action.payload.popupTargetId;
    },
  },
});

export const { openReactionRegistPopup, closeReactionRegistPopup, setReactionRegistPopupStatus } = slice.actions;

export default slice.reducer;
