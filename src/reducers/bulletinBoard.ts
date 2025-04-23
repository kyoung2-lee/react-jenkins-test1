import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import isEmpty from "lodash.isempty";

import { WebApi } from "../lib/webApi";
import { AppDispatch, RootState } from "../store/storeType";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";

export type SimpleThread = BulletinBoardThreadsApi.Response["threadList"][0];
export type Thread = BulletinBoardThreadApi.Response["thread"];

export interface BulletinBoardState {
  isFetchingThreads: boolean;
  isFetchingThread: boolean;
  fetchThreadsError?: Error;
  threads?: BulletinBoardThreadsApi.Response;
  thread?: BulletinBoardThreadApi.Response;
}

const initialState: BulletinBoardState = {
  isFetchingThreads: false,
  isFetchingThread: false,
};

export const fetchThreads = createAsyncThunk<
  BulletinBoardThreadsApi.Response | null,
  BulletinBoardThreadsApi.Request,
  { dispatch: AppDispatch }
>("bulletinBoard/fetchThreads", async (arg, thunkAPI) => {
  const { dispatch } = thunkAPI;
  dispatch(fetchThreadsRequest());
  try {
    const resp = await WebApi.getBulletinBoardTheads(dispatch, arg);
    const threads = resp.data;

    if (threads && threads.threadList.length === 0) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M30003C() });
    }

    dispatch(fetchThreadsSuccess({ threads }));
    return threads;
  } catch (error) {
    dispatch(fetchThreadsFailure({ error: error as Error }));
    return null;
  }
});

export const fetchThread = createAsyncThunk<
  void,
  {
    params: BulletinBoardThreadApi.Request;
    callbacks: WebApi.Callbacks;
  },
  { dispatch: AppDispatch }
>("bulletinBoard/fetchThread", async (arg, thunkAPI) => {
  const { params, callbacks } = arg;
  const { dispatch } = thunkAPI;
  if (!params.bbId) return;
  dispatch(fetchThreadRequest());
  try {
    const resp = await WebApi.getBulletinBoardThead(dispatch, params, callbacks);
    const thread = resp.data;

    dispatch(fetchThreadSuccess({ thread }));
  } catch (error) {
    dispatch(fetchThreadFailure({ error: error as Error }));
  }
});

export const toggleThreadReaction = createAsyncThunk<
  void,
  { params: BulletinBoardThreadReactionApi.Request },
  { dispatch: AppDispatch; state: RootState }
>("bulletinBoard/toggleThreadReaction", async (arg, { dispatch, getState }) => {
  const { params } = arg;
  const { user } = getState().account.jobAuth;
  if (!params.bbId) return;

  // API 呼び出し中はボタン押下後の状態を反映させるため、前もってリアクション数を変更しておく
  if (params.funcType === 1) {
    dispatch(addThreadReaction({ bbId: params.bbId, racType: params.racType, user }));
  } else if (params.funcType === 2) {
    dispatch(deleteThreadReaction({ bbId: params.bbId, racType: params.racType, user }));
  }

  try {
    await WebApi.postBulletinBoardThreadReaction(dispatch, params);
  } catch (error) {
    // スレッドリアクション更新 API 呼び出し失敗、変更したリアクション数を元に戻す
    if (params.funcType === 1) {
      dispatch(deleteThreadReaction({ bbId: params.bbId, racType: params.racType, user }));
    } else if (params.funcType === 2) {
      dispatch(addThreadReaction({ bbId: params.bbId, racType: params.racType, user }));
    }
  }
});

export const toggleResponseReaction = createAsyncThunk<
  void,
  { params: BulletinBoardResponseReactionApi.Request },
  { dispatch: AppDispatch; state: RootState }
>("bulletinBoard/toggleResponseReaction", async (arg, { dispatch, getState }) => {
  const { params } = arg;
  const { user } = getState().account.jobAuth;
  if (!params.resId) return;

  if (params.funcType === 1) {
    dispatch(addResponseReaction({ resId: params.resId, racType: params.racType, user }));
  } else if (params.funcType === 2) {
    dispatch(deleteResponseReaction({ resId: params.resId, racType: params.racType, user }));
  }

  try {
    await WebApi.postBulletinBoardResponseReaction(dispatch, params);
  } catch (error) {
    if (params.funcType === 1) {
      dispatch(deleteResponseReaction({ resId: params.resId, racType: params.racType, user }));
    } else if (params.funcType === 2) {
      dispatch(addResponseReaction({ resId: params.resId, racType: params.racType, user }));
    }
  }
});

export const toggleCommentReaction = createAsyncThunk<
  void,
  { params: BulletinBoardCommentReactionApi.Request },
  { dispatch: AppDispatch; state: RootState }
>("bulletinBoard/toggleCommentReaction", async (arg, { dispatch, getState }) => {
  const { params } = arg;
  const { user } = getState().account.jobAuth;
  if (!params.cmtId) return;

  if (params.funcType === 1) {
    dispatch(addCommentReaction({ cmtId: params.cmtId, racType: params.racType, user }));
  } else if (params.funcType === 2) {
    dispatch(deleteCommentReaction({ cmtId: params.cmtId, racType: params.racType, user }));
  }

  try {
    await WebApi.postBulletinBoardCommentReaction(dispatch, params);
  } catch (error) {
    if (params.funcType === 1) {
      dispatch(deleteCommentReaction({ cmtId: params.cmtId, racType: params.racType, user }));
    } else if (params.funcType === 2) {
      dispatch(addCommentReaction({ cmtId: params.cmtId, racType: params.racType, user }));
    }
  }
});

export const showMessage = createAsyncThunk<
  void,
  {
    message: NotificationCreator.Message;
  },
  { dispatch: AppDispatch }
>("bulletinBoard/showMessage", (arg, thunkAPI) => {
  const { message } = arg;
  const { dispatch } = thunkAPI;
  NotificationCreator.create({ dispatch, message });
});

export const slice = createSlice({
  name: "bulletinBoard",
  initialState,
  reducers: {
    clearThread: (state) => {
      state.thread = undefined;
    },
    fetchThreadsRequest: (state) => {
      state.isFetchingThreads = true;
    },
    fetchThreadsSuccess: (
      state,
      action: PayloadAction<{
        threads: BulletinBoardThreadsApi.Response;
      }>
    ) => {
      state.isFetchingThreads = false;
      state.threads = action.payload.threads;
    },
    fetchThreadsFailure: (
      state,
      action: PayloadAction<{
        error: Error;
      }>
    ) => {
      state.isFetchingThreads = false;
      state.threads = initialState.threads;
      state.fetchThreadsError = action.payload.error;
    },
    fetchThreadRequest: (state) => {
      state.isFetchingThread = true;
    },
    fetchThreadSuccess: (
      state,
      action: PayloadAction<{
        thread: BulletinBoardThreadApi.Response;
      }>
    ) => {
      state.isFetchingThread = false;
      state.thread = action.payload.thread;
    },
    fetchThreadFailure: (
      state,
      action: PayloadAction<{
        error: Error;
      }>
    ) => {
      state.isFetchingThread = false;
      state.fetchThreadsError = action.payload.error;
    },

    addThreadReaction: (
      state,
      action: PayloadAction<{
        bbId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      if (!state.thread) {
        return;
      }
      const isExistingMyReaction = state.thread.thread.bbRacList.some((item) => {
        if (item.racType !== action.payload.racType) {
          return false;
        }
        return item.racUser.some((racUserItem) => racUserItem.userId === action.payload.user.userId);
      });
      if (isExistingMyReaction) {
        return;
      }

      const isExistingReaction = state.thread.thread.bbRacList.some((item) => item.racType === action.payload.racType);
      if (!isExistingReaction) {
        state.thread.thread.bbRacList = state.thread.thread.bbRacList.concat({
          racType: action.payload.racType,
          racCount: 1,
          racUser: [
            {
              userId: action.payload.user.userId,
              firstName: action.payload.user.firstName,
              familyName: action.payload.user.familyName,
            },
          ],
        });
        return;
      }

      state.thread.thread.bbRacList = state.thread.thread.bbRacList.map((item) => {
        if (item.racType !== action.payload.racType) {
          return item;
        }
        return {
          ...item,
          racCount: item.racCount + 1,
          racUser: [
            {
              userId: action.payload.user.userId,
              firstName: action.payload.user.firstName,
              familyName: action.payload.user.familyName,
            },
          ].concat(item.racUser),
        };
      });
    },
    deleteThreadReaction: (
      state,
      action: PayloadAction<{
        bbId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      if (!state.thread) {
        return;
      }
      const isExistingMyReaction = state.thread.thread.bbRacList.some((item) => {
        if (item.racType !== action.payload.racType) {
          return false;
        }
        return item.racUser.some((racUserItem) => racUserItem.userId === action.payload.user.userId);
      });
      if (!isExistingMyReaction) {
        return;
      }

      const bbRacListAfterDecreased = state.thread.thread.bbRacList.map((item) => {
        if (item.racType !== action.payload.racType) {
          return item;
        }
        return {
          ...item,
          racCount: item.racCount - 1,
          racUser: item.racUser.filter((racUserItem) => racUserItem.userId !== action.payload.user.userId),
        };
      });

      state.thread.thread.bbRacList = bbRacListAfterDecreased.filter((item) => item.racCount > 0 && !isEmpty(item.racUser));
    },

    addResponseReaction: (
      state,
      action: PayloadAction<{
        resId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      if (!state.thread) {
        return;
      }
      const isExistingMyReaction = state.thread.thread.bbResList.some((item) => {
        if (item.resId !== action.payload.resId) {
          return false;
        }
        return item.bbResRacList.some((bbResRacItem) => {
          if (bbResRacItem.racType !== action.payload.racType) {
            return false;
          }
          return bbResRacItem.racUser.some((racUserItem) => racUserItem.userId === action.payload.user.userId);
        });
      });
      if (isExistingMyReaction) {
        return;
      }

      const isExistingReaction = state.thread.thread.bbResList.some((item) => {
        if (item.resId !== action.payload.resId) {
          return false;
        }
        return item.bbResRacList.some((bbResRacItem) => bbResRacItem.racType === action.payload.racType);
      });
      if (!isExistingReaction) {
        state.thread.thread.bbResList = state.thread.thread.bbResList.map((item) => {
          if (item.resId !== action.payload.resId) {
            return item;
          }
          return {
            ...item,
            bbResRacList: item.bbResRacList.concat({
              racType: action.payload.racType,
              racCount: 1,
              racUser: [
                {
                  userId: action.payload.user.userId,
                  firstName: action.payload.user.firstName,
                  familyName: action.payload.user.familyName,
                },
              ],
            }),
          };
        });
        return;
      }

      state.thread.thread.bbResList = state.thread.thread.bbResList.map((item) => {
        if (item.resId !== action.payload.resId) {
          return item;
        }
        return {
          ...item,
          bbResRacList: item.bbResRacList.map((bbResRacItem) => {
            if (bbResRacItem.racType !== action.payload.racType) {
              return bbResRacItem;
            }
            return {
              ...bbResRacItem,
              racCount: bbResRacItem.racCount + 1,
              racUser: [
                {
                  userId: action.payload.user.userId,
                  firstName: action.payload.user.firstName,
                  familyName: action.payload.user.familyName,
                },
              ].concat(bbResRacItem.racUser),
            };
          }),
        };
      });
    },
    deleteResponseReaction: (
      state,
      action: PayloadAction<{
        resId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      if (!state.thread) {
        return;
      }
      const isExistingMyReaction = state.thread.thread.bbResList.some((item) => {
        if (item.resId !== action.payload.resId) {
          return false;
        }
        return item.bbResRacList.some((bbResRacItem) => {
          if (bbResRacItem.racType !== action.payload.racType) {
            return false;
          }
          return bbResRacItem.racUser.some((racUserItem) => racUserItem.userId === action.payload.user.userId);
        });
      });
      if (!isExistingMyReaction) {
        return;
      }

      state.thread.thread.bbResList = state.thread.thread.bbResList.map((item) => {
        if (item.resId !== action.payload.resId) {
          return item;
        }

        const bbResRacListAfterDecreased = item.bbResRacList.map((bbResRacItem) => {
          if (bbResRacItem.racType !== action.payload.racType) {
            return bbResRacItem;
          }
          return {
            ...bbResRacItem,
            racCount: bbResRacItem.racCount - 1,
            racUser: bbResRacItem.racUser.filter((racUserItem) => racUserItem.userId !== action.payload.user.userId),
          };
        });
        return {
          ...item,
          bbResRacList: bbResRacListAfterDecreased.filter((bbResRacItem) => bbResRacItem.racCount > 0 && !isEmpty(bbResRacItem.racUser)),
        };
      });
    },

    addCommentReaction: (
      state,
      action: PayloadAction<{
        cmtId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      if (!state.thread) {
        return;
      }
      const isExistingMyReaction = state.thread.thread.bbCmtList.some((item) => {
        if (item.cmtId !== action.payload.cmtId) {
          return false;
        }
        return item.bbCmtRacList.some((bbCmtRacItem) => {
          if (bbCmtRacItem.racType !== action.payload.racType) {
            return false;
          }
          return bbCmtRacItem.racUser.some((racUserItem) => racUserItem.userId === action.payload.user.userId);
        });
      });
      if (isExistingMyReaction) {
        return;
      }

      const isExistingReaction = state.thread.thread.bbCmtList.some((item) => {
        if (item.cmtId !== action.payload.cmtId) {
          return false;
        }
        return item.bbCmtRacList.some((bbCmtRacItem) => bbCmtRacItem.racType === action.payload.racType);
      });
      if (!isExistingReaction) {
        state.thread.thread.bbCmtList = state.thread.thread.bbCmtList.map((item) => {
          if (item.cmtId !== action.payload.cmtId) {
            return item;
          }
          return {
            ...item,
            bbCmtRacList: item.bbCmtRacList.concat({
              racType: action.payload.racType,
              racCount: 1,
              racUser: [
                {
                  userId: action.payload.user.userId,
                  firstName: action.payload.user.firstName,
                  familyName: action.payload.user.familyName,
                },
              ],
            }),
          };
        });
        return;
      }

      state.thread.thread.bbCmtList = state.thread.thread.bbCmtList.map((item) => {
        if (item.cmtId !== action.payload.cmtId) {
          return item;
        }
        return {
          ...item,
          bbCmtRacList: item.bbCmtRacList.map((bbCmtRacItem) => {
            if (bbCmtRacItem.racType !== action.payload.racType) {
              return bbCmtRacItem;
            }
            return {
              ...bbCmtRacItem,
              racCount: bbCmtRacItem.racCount + 1,
              racUser: [
                {
                  userId: action.payload.user.userId,
                  firstName: action.payload.user.firstName,
                  familyName: action.payload.user.familyName,
                },
              ].concat(bbCmtRacItem.racUser),
            };
          }),
        };
      });
    },
    deleteCommentReaction: (
      state,
      action: PayloadAction<{
        cmtId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      if (!state.thread) {
        return;
      }
      const isExistingMyReaction = state.thread.thread.bbCmtList.some((item) => {
        if (item.cmtId !== action.payload.cmtId) {
          return false;
        }
        return item.bbCmtRacList.some((bbCmtRacItem) => {
          if (bbCmtRacItem.racType !== action.payload.racType) {
            return false;
          }
          return bbCmtRacItem.racUser.some((racUserItem) => racUserItem.userId === action.payload.user.userId);
        });
      });
      if (!isExistingMyReaction) {
        return;
      }

      state.thread.thread.bbCmtList = state.thread.thread.bbCmtList.map((item) => {
        if (item.cmtId !== action.payload.cmtId) {
          return item;
        }

        const bbCmtRacListAfterDecreased = item.bbCmtRacList.map((bbCmtRacItem) => {
          if (bbCmtRacItem.racType !== action.payload.racType) {
            return bbCmtRacItem;
          }
          return {
            ...bbCmtRacItem,
            racCount: bbCmtRacItem.racCount - 1,
            racUser: bbCmtRacItem.racUser.filter((racUserItem) => racUserItem.userId !== action.payload.user.userId),
          };
        });
        return {
          ...item,
          bbCmtRacList: bbCmtRacListAfterDecreased.filter((bbCmtRacItem) => bbCmtRacItem.racCount > 0 && !isEmpty(bbCmtRacItem.racUser)),
        };
      });
    },
  },
});

export const {
  clearThread,
  fetchThreadsRequest,
  fetchThreadsSuccess,
  fetchThreadsFailure,
  fetchThreadRequest,
  fetchThreadSuccess,
  fetchThreadFailure,
  addThreadReaction,
  deleteThreadReaction,
  addResponseReaction,
  deleteResponseReaction,
  addCommentReaction,
  deleteCommentReaction,
} = slice.actions;

export default slice.reducer;
