import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Media {
  type: "image" | "video";
  url: string;
}

// state
export interface State {
  isOpen: boolean;
  media?: Media;
}

const initialState: State = { isOpen: false };

export const slice = createSlice({
  name: "lightbox",
  initialState,
  reducers: {
    openLightbox: (state, action: PayloadAction<{ media: Media }>) => {
      const { media } = action.payload;
      state.isOpen = true;
      state.media = media;
    },
    closeLightbox: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openLightbox, closeLightbox } = slice.actions;

export default slice.reducer;
