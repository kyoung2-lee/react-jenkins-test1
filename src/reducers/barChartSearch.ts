import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../store/storeType";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";

export interface BarChartSearchState {
  dialogIsVisible: boolean;
  filterlingRowColumns: Array<{ row: number; column: number; scheduleSeq: number }>;
  currentFilterlingIndex: number;
  scrollToRow: number | undefined;
  scrollToColumn: number | undefined;
  scrollToScheduleSeq: number;
}

const initialState: BarChartSearchState = {
  dialogIsVisible: false,
  filterlingRowColumns: [],
  currentFilterlingIndex: 0,
  scrollToRow: undefined,
  scrollToColumn: undefined,
  scrollToScheduleSeq: 0,
};

export const slice = createSlice({
  name: "barChartSearch",
  initialState,
  reducers: {
    clearBarChartSearch: (state) => {
      Object.assign(state, initialState);
    },
    searchBarChart: (
      state,
      action: PayloadAction<{
        filterlingRowColumns: Array<{ row: number; column: number; scheduleSeq: number }>;
        currentFilterlingIndex: number;
        scrollToRow: number;
        scrollToColumn: number;
        scrollToScheduleSeq: number;
      }>
    ) => {
      const { filterlingRowColumns, currentFilterlingIndex, scrollToRow, scrollToColumn, scrollToScheduleSeq } = action.payload;
      state.filterlingRowColumns = filterlingRowColumns;
      state.currentFilterlingIndex = currentFilterlingIndex;
      state.scrollToRow = scrollToRow;
      state.scrollToColumn = scrollToColumn;
      state.scrollToScheduleSeq = scrollToScheduleSeq;
    },
    searchBarChartNext: (state) => {
      const { filterlingRowColumns, currentFilterlingIndex } = state;
      if (state.filterlingRowColumns.length === 0) {
        return;
      }
      const result = filterlingRowColumns[state.currentFilterlingIndex + 1];

      // 最後まで表示して次の検索結果がない場合は最初に戻す
      if (!result) {
        state.currentFilterlingIndex = 0;
        state.scrollToRow = filterlingRowColumns[0].row;
        state.scrollToColumn = filterlingRowColumns[0].column;
        state.scrollToScheduleSeq = filterlingRowColumns[0].scheduleSeq;
      } else {
        state.currentFilterlingIndex = currentFilterlingIndex + 1;
        state.scrollToRow = result.row;
        state.scrollToColumn = result.column;
        state.scrollToScheduleSeq = result.scheduleSeq;
      }
    },
    searchBarChartPrev: (state) => {
      const { filterlingRowColumns, currentFilterlingIndex } = state;
      if (state.filterlingRowColumns.length === 0) {
        return;
      }
      const result = filterlingRowColumns[state.currentFilterlingIndex - 1];

      // これ以上前の検索結果がない場合は最後に戻す
      if (!result) {
        const lastIndex = filterlingRowColumns.length - 1;
        state.currentFilterlingIndex = lastIndex;
        state.scrollToRow = filterlingRowColumns[lastIndex].row;
        state.scrollToColumn = filterlingRowColumns[lastIndex].column;
        state.scrollToScheduleSeq = filterlingRowColumns[lastIndex].scheduleSeq;
      } else {
        state.currentFilterlingIndex = currentFilterlingIndex - 1;
        state.scrollToRow = result.row;
        state.scrollToColumn = result.column;
        state.scrollToScheduleSeq = result.scheduleSeq;
      }
    },
    searchBarChartDefault: (state) => {
      state.scrollToRow = undefined;
      state.scrollToColumn = undefined;
    },
    clearSearchBarChart: (state) => {
      state.scrollToRow = undefined;
      state.scrollToColumn = undefined;
      state.filterlingRowColumns = [];
      state.scrollToScheduleSeq = 0;
    },
    toggleBarChartSearchDialog: (state) => {
      state.dialogIsVisible = !state.dialogIsVisible;
    },
  },
});

export const showInfoNoData = createAsyncThunk<void, undefined, { dispatch: AppDispatch }>(
  "barChartSearch/showInfoNoData",
  (_, { dispatch }) => {
    NotificationCreator.removeAll({ dispatch });
    NotificationCreator.create({ dispatch, message: SoalaMessage.M30003C() });
  }
);

export const {
  clearBarChartSearch,
  searchBarChart,
  searchBarChartNext,
  searchBarChartPrev,
  searchBarChartDefault,
  clearSearchBarChart,
  toggleBarChartSearchDialog,
} = slice.actions;

export default slice.reducer;
