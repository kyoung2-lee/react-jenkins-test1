"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    boardMap: {},
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "flightBulletinBoard",
    initialState,
    reducers: {
        fetchThreadsRequest: (state, action) => {
            state.boardMap = {
                ...state.boardMap,
                [action.payload.mapId]: { ...state.boardMap[action.payload.mapId], isFetchingThreads: true },
            };
        },
        fetchThreadsSuccess: (state, action) => {
            state.boardMap = {
                ...state.boardMap,
                [action.payload.mapId]: {
                    ...state.boardMap[action.payload.mapId],
                    isFetchingThreads: false,
                    threads: action.payload.threads,
                },
            };
        },
        fetchThreadRequest: (state, action) => {
            state.boardMap = {
                ...state.boardMap,
                [action.payload.mapId]: { ...state.boardMap[action.payload.mapId], isFetchingThread: true },
            };
        },
        fetchThreadSuccess: (state, action) => {
            state.boardMap = {
                ...state.boardMap,
                [action.payload.mapId]: {
                    ...state.boardMap[action.payload.mapId],
                    isFetchingThread: false,
                    thread: action.payload.thread,
                },
            };
        },
    },
});
exports.default = exports.slice.reducer;
//# sourceMappingURL=flightBulletinBoard.js.map