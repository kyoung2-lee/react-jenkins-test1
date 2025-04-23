import { createSlice } from "@reduxjs/toolkit";

export interface AirportRemarksPopupState {
  isOpen: boolean;
  airportRemarks: string;
}

const initialState: AirportRemarksPopupState = {
  isOpen: false,
  airportRemarks: "",
};

export const slice = createSlice({
  name: "airportRemarksPopup",
  initialState,
  reducers: {
    openAirportRemarksPopup: (state) => {
      state.isOpen = true;
    },
    closeAirportRemarksPopup: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openAirportRemarksPopup, closeAirportRemarksPopup } = slice.actions;

export default slice.reducer;
