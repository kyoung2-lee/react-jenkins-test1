import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { storageOfUser } from "../lib/StorageOfUser";

export interface StorageOfUserState {
  hiddenSpotNoList: string[];
}

const initialState: StorageOfUserState = {
  hiddenSpotNoList: [],
};

export const slice = createSlice({
  name: "storageOfUser",
  initialState,
  reducers: {
    getHiddenSpotNoList: (state, action: PayloadAction<{ apoCd: string }>) => {
      const { apoCd } = action.payload;
      state.hiddenSpotNoList = storageOfUser.getHiddenSpotNoList({ apoCd });
    },
    saveHiddenSpotNo: (state, action: PayloadAction<{ apoCd: string; hiddenSpotNo: string[] }>) => {
      const { apoCd, hiddenSpotNo } = action.payload;
      storageOfUser.saveFilterSpotNo({ apoCd, hiddenSpotNo });
      state.hiddenSpotNoList = storageOfUser.getHiddenSpotNoList({ apoCd });
    },
  },
});

export const { getHiddenSpotNoList, saveHiddenSpotNo } = slice.actions;

export default slice.reducer;
