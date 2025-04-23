import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface State {
  isOpen: boolean;
  jobCodes: string[];
}

const initialState: State = {
  isOpen: false,
  jobCodes: [],
};

export const slice = createSlice({
  name: "bulletinBoardAddressModal",
  initialState,
  reducers: {
    openBulletinBoardAddressModal: (state, action: PayloadAction<{ jobCodes: string[] }>) => {
      state.isOpen = true;
      state.jobCodes = action.payload.jobCodes;
    },
    closeBulletinBoardAddressModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openBulletinBoardAddressModal, closeBulletinBoardAddressModal } = slice.actions;

export default slice.reducer;
