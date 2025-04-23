import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DateTimeInputPopupState {
  isOpen: boolean;
  param: DateTimeInputPopupParam;
}

const initialState: DateTimeInputPopupState = {
  isOpen: false,
  param: {
    valueFormat: "YYYY-MM-DD[T]HH:mm:ss",
    currentValue: "",
  },
};

export interface DateTimeInputPopupParam {
  valueFormat: "YYYY-MM-DD[T]HH:mm:ss" | "YYYY-MM-DD" | "DDHHmm";
  currentValue: string; // 現在の値
  defaultSetting?: { value: string } | { timeDiffUtc: number } | "DeviceDate";
  onEnter?: (value: string) => void;
  onUpdate?: (value: string) => void;
  customUpdateButtonName?: string;
  unableDelete?: boolean;
  doTypoCheck?: boolean; // タイプミスのチェック（YYYY-MM-DD[T]HH:mm:ss形式の場合のみ）
  customValidate?: (dateTime: string) => boolean;
  minDate?: Date; // カレンダー入力時の最小値
  maxDate?: Date; // カレンダー入力時の最大値
}

export const slice = createSlice({
  name: "dateTimeInputPopup",
  initialState,
  reducers: {
    openDateTimeInputPopup: (state, action: PayloadAction<DateTimeInputPopupParam>) => {
      state.isOpen = true;
      state.param = action.payload;
    },
    closeDateTimeInputPopup: (state) => {
      state.isOpen = false;
      state.param = initialState.param;
    },
  },
});

export const { openDateTimeInputPopup, closeDateTimeInputPopup } = slice.actions;

export default slice.reducer;
