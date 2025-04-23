import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FlightNumberInputPopupState {
  isOpen: boolean;
  currentFlightNumber: string;
  formName: string;
  fieldName: string;
  executeSubmit: boolean;
  onEnter: () => void;
  canOnlyAlCd: boolean;
}

const initialState: FlightNumberInputPopupState = {
  isOpen: false,
  currentFlightNumber: "",
  formName: "",
  fieldName: "",
  executeSubmit: true,
  onEnter: () => {},
  canOnlyAlCd: false,
};

export const slice = createSlice({
  name: "flightNumberInputPopup",
  initialState,
  reducers: {
    openFlightNumberInputPopup: (
      state,
      action: PayloadAction<{
        currentFlightNumber: string;
        formName: string;
        fieldName: string;
        executeSubmit: boolean;
        onEnter: () => void;
        canOnlyAlCd: boolean;
      }>
    ) => {
      state.isOpen = true;
      state.currentFlightNumber = action.payload.currentFlightNumber;
      state.formName = action.payload.formName;
      state.fieldName = action.payload.fieldName;
      state.executeSubmit = action.payload.executeSubmit;
      state.onEnter = action.payload.onEnter;
      state.canOnlyAlCd = action.payload.canOnlyAlCd;
    },
    closeFlightNumberInputPopup: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openFlightNumberInputPopup, closeFlightNumberInputPopup } = slice.actions;

export default slice.reducer;
