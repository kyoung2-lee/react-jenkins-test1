import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BoardState {
  isFetchingThreads: boolean;
  isFetchingThread: boolean;
  threads?: BulletinBoardThreadFlightApi.Response;
  thread?: BulletinBoardThreadApi.Response;
}

export interface FlightBulletinBoardState {
  boardMap: {
    [key: string]: BoardState;
  };
}

const initialState: FlightBulletinBoardState = {
  boardMap: {},
};

export const slice = createSlice({
  name: "flightBulletinBoard",
  initialState,
  reducers: {
    fetchThreadsRequest: (
      state,
      action: PayloadAction<{
        mapId: string;
      }>
    ) => {
      state.boardMap = {
        ...state.boardMap,
        [action.payload.mapId]: { ...state.boardMap[action.payload.mapId], isFetchingThreads: true },
      };
    },
    fetchThreadsSuccess: (
      state,
      action: PayloadAction<{
        mapId: string;
        threads: BulletinBoardThreadFlightApi.Response;
      }>
    ) => {
      state.boardMap = {
        ...state.boardMap,
        [action.payload.mapId]: {
          ...state.boardMap[action.payload.mapId],
          isFetchingThreads: false,
          threads: action.payload.threads,
        },
      };
    },
    fetchThreadRequest: (
      state,
      action: PayloadAction<{
        mapId: string;
      }>
    ) => {
      state.boardMap = {
        ...state.boardMap,
        [action.payload.mapId]: { ...state.boardMap[action.payload.mapId], isFetchingThread: true },
      };
    },
    fetchThreadSuccess: (
      state,
      action: PayloadAction<{
        mapId: string;
        thread: BulletinBoardThreadApi.Response;
      }>
    ) => {
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

export default slice.reducer;
