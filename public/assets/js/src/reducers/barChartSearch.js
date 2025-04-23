"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBarChartSearchDialog = exports.clearSearchBarChart = exports.searchBarChartDefault = exports.searchBarChartPrev = exports.searchBarChartNext = exports.searchBarChart = exports.clearBarChartSearch = exports.showInfoNoData = exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const initialState = {
    dialogIsVisible: false,
    filterlingRowColumns: [],
    currentFilterlingIndex: 0,
    scrollToRow: undefined,
    scrollToColumn: undefined,
    scrollToScheduleSeq: 0,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "barChartSearch",
    initialState,
    reducers: {
        clearBarChartSearch: (state) => {
            Object.assign(state, initialState);
        },
        searchBarChart: (state, action) => {
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
            }
            else {
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
            }
            else {
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
exports.showInfoNoData = (0, toolkit_1.createAsyncThunk)("barChartSearch/showInfoNoData", (_, { dispatch }) => {
    notifications_1.NotificationCreator.removeAll({ dispatch });
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30003C() });
});
_a = exports.slice.actions, exports.clearBarChartSearch = _a.clearBarChartSearch, exports.searchBarChart = _a.searchBarChart, exports.searchBarChartNext = _a.searchBarChartNext, exports.searchBarChartPrev = _a.searchBarChartPrev, exports.searchBarChartDefault = _a.searchBarChartDefault, exports.clearSearchBarChart = _a.clearSearchBarChart, exports.toggleBarChartSearchDialog = _a.toggleBarChartSearchDialog;
exports.default = exports.slice.reducer;
//# sourceMappingURL=barChartSearch.js.map