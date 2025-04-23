import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UpdatableResponse {
  id: number;
  title: string;
  text: string;
}

export interface BulletinBoardResponseEditorModalState {
  opened: boolean;
  bbId?: number;
  response?: UpdatableResponse;
}

const initialState: BulletinBoardResponseEditorModalState = {
  opened: false,
};

export const slice = createSlice({
  name: "bulletinBoardResponseEditorModal",
  initialState,
  reducers: {
    openBulletinBoardResponseModal: (
      state,
      action: PayloadAction<{
        bbId: number;
        response?: UpdatableResponse;
      }>
    ) => {
      const { bbId, response } = action.payload;
      state.opened = true;
      state.bbId = bbId;
      state.response = response;
    },
    closeBulletinBoardResponseModal: (state) => {
      state.opened = false;
      state.bbId = undefined;
      state.response = undefined;
    },
  },
});

export const { openBulletinBoardResponseModal, closeBulletinBoardResponseModal } = slice.actions;

export default slice.reducer;
