"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentReaction = exports.addCommentReaction = exports.deleteResponseReaction = exports.addResponseReaction = exports.deleteThreadReaction = exports.addThreadReaction = exports.fetchThreadFailure = exports.fetchThreadSuccess = exports.fetchThreadRequest = exports.fetchThreadsFailure = exports.fetchThreadsSuccess = exports.fetchThreadsRequest = exports.clearThread = exports.slice = exports.showMessage = exports.toggleCommentReaction = exports.toggleResponseReaction = exports.toggleThreadReaction = exports.fetchThread = exports.fetchThreads = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const webApi_1 = require("../lib/webApi");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const initialState = {
    isFetchingThreads: false,
    isFetchingThread: false,
};
exports.fetchThreads = (0, toolkit_1.createAsyncThunk)("bulletinBoard/fetchThreads", async (arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch((0, exports.fetchThreadsRequest)());
    try {
        const resp = await webApi_1.WebApi.getBulletinBoardTheads(dispatch, arg);
        const threads = resp.data;
        if (threads && threads.threadList.length === 0) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30003C() });
        }
        dispatch((0, exports.fetchThreadsSuccess)({ threads }));
        return threads;
    }
    catch (error) {
        dispatch((0, exports.fetchThreadsFailure)({ error: error }));
        return null;
    }
});
exports.fetchThread = (0, toolkit_1.createAsyncThunk)("bulletinBoard/fetchThread", async (arg, thunkAPI) => {
    const { params, callbacks } = arg;
    const { dispatch } = thunkAPI;
    if (!params.bbId)
        return;
    dispatch((0, exports.fetchThreadRequest)());
    try {
        const resp = await webApi_1.WebApi.getBulletinBoardThead(dispatch, params, callbacks);
        const thread = resp.data;
        dispatch((0, exports.fetchThreadSuccess)({ thread }));
    }
    catch (error) {
        dispatch((0, exports.fetchThreadFailure)({ error: error }));
    }
});
exports.toggleThreadReaction = (0, toolkit_1.createAsyncThunk)("bulletinBoard/toggleThreadReaction", async (arg, { dispatch, getState }) => {
    const { params } = arg;
    const { user } = getState().account.jobAuth;
    if (!params.bbId)
        return;
    // API 呼び出し中はボタン押下後の状態を反映させるため、前もってリアクション数を変更しておく
    if (params.funcType === 1) {
        dispatch((0, exports.addThreadReaction)({ bbId: params.bbId, racType: params.racType, user }));
    }
    else if (params.funcType === 2) {
        dispatch((0, exports.deleteThreadReaction)({ bbId: params.bbId, racType: params.racType, user }));
    }
    try {
        await webApi_1.WebApi.postBulletinBoardThreadReaction(dispatch, params);
    }
    catch (error) {
        // スレッドリアクション更新 API 呼び出し失敗、変更したリアクション数を元に戻す
        if (params.funcType === 1) {
            dispatch((0, exports.deleteThreadReaction)({ bbId: params.bbId, racType: params.racType, user }));
        }
        else if (params.funcType === 2) {
            dispatch((0, exports.addThreadReaction)({ bbId: params.bbId, racType: params.racType, user }));
        }
    }
});
exports.toggleResponseReaction = (0, toolkit_1.createAsyncThunk)("bulletinBoard/toggleResponseReaction", async (arg, { dispatch, getState }) => {
    const { params } = arg;
    const { user } = getState().account.jobAuth;
    if (!params.resId)
        return;
    if (params.funcType === 1) {
        dispatch((0, exports.addResponseReaction)({ resId: params.resId, racType: params.racType, user }));
    }
    else if (params.funcType === 2) {
        dispatch((0, exports.deleteResponseReaction)({ resId: params.resId, racType: params.racType, user }));
    }
    try {
        await webApi_1.WebApi.postBulletinBoardResponseReaction(dispatch, params);
    }
    catch (error) {
        if (params.funcType === 1) {
            dispatch((0, exports.deleteResponseReaction)({ resId: params.resId, racType: params.racType, user }));
        }
        else if (params.funcType === 2) {
            dispatch((0, exports.addResponseReaction)({ resId: params.resId, racType: params.racType, user }));
        }
    }
});
exports.toggleCommentReaction = (0, toolkit_1.createAsyncThunk)("bulletinBoard/toggleCommentReaction", async (arg, { dispatch, getState }) => {
    const { params } = arg;
    const { user } = getState().account.jobAuth;
    if (!params.cmtId)
        return;
    if (params.funcType === 1) {
        dispatch((0, exports.addCommentReaction)({ cmtId: params.cmtId, racType: params.racType, user }));
    }
    else if (params.funcType === 2) {
        dispatch((0, exports.deleteCommentReaction)({ cmtId: params.cmtId, racType: params.racType, user }));
    }
    try {
        await webApi_1.WebApi.postBulletinBoardCommentReaction(dispatch, params);
    }
    catch (error) {
        if (params.funcType === 1) {
            dispatch((0, exports.deleteCommentReaction)({ cmtId: params.cmtId, racType: params.racType, user }));
        }
        else if (params.funcType === 2) {
            dispatch((0, exports.addCommentReaction)({ cmtId: params.cmtId, racType: params.racType, user }));
        }
    }
});
exports.showMessage = (0, toolkit_1.createAsyncThunk)("bulletinBoard/showMessage", (arg, thunkAPI) => {
    const { message } = arg;
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message });
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "bulletinBoard",
    initialState,
    reducers: {
        clearThread: (state) => {
            state.thread = undefined;
        },
        fetchThreadsRequest: (state) => {
            state.isFetchingThreads = true;
        },
        fetchThreadsSuccess: (state, action) => {
            state.isFetchingThreads = false;
            state.threads = action.payload.threads;
        },
        fetchThreadsFailure: (state, action) => {
            state.isFetchingThreads = false;
            state.threads = initialState.threads;
            state.fetchThreadsError = action.payload.error;
        },
        fetchThreadRequest: (state) => {
            state.isFetchingThread = true;
        },
        fetchThreadSuccess: (state, action) => {
            state.isFetchingThread = false;
            state.thread = action.payload.thread;
        },
        fetchThreadFailure: (state, action) => {
            state.isFetchingThread = false;
            state.fetchThreadsError = action.payload.error;
        },
        addThreadReaction: (state, action) => {
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
        deleteThreadReaction: (state, action) => {
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
            state.thread.thread.bbRacList = bbRacListAfterDecreased.filter((item) => item.racCount > 0 && !(0, lodash_isempty_1.default)(item.racUser));
        },
        addResponseReaction: (state, action) => {
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
        deleteResponseReaction: (state, action) => {
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
                    bbResRacList: bbResRacListAfterDecreased.filter((bbResRacItem) => bbResRacItem.racCount > 0 && !(0, lodash_isempty_1.default)(bbResRacItem.racUser)),
                };
            });
        },
        addCommentReaction: (state, action) => {
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
        deleteCommentReaction: (state, action) => {
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
                    bbCmtRacList: bbCmtRacListAfterDecreased.filter((bbCmtRacItem) => bbCmtRacItem.racCount > 0 && !(0, lodash_isempty_1.default)(bbCmtRacItem.racUser)),
                };
            });
        },
    },
});
_a = exports.slice.actions, exports.clearThread = _a.clearThread, exports.fetchThreadsRequest = _a.fetchThreadsRequest, exports.fetchThreadsSuccess = _a.fetchThreadsSuccess, exports.fetchThreadsFailure = _a.fetchThreadsFailure, exports.fetchThreadRequest = _a.fetchThreadRequest, exports.fetchThreadSuccess = _a.fetchThreadSuccess, exports.fetchThreadFailure = _a.fetchThreadFailure, exports.addThreadReaction = _a.addThreadReaction, exports.deleteThreadReaction = _a.deleteThreadReaction, exports.addResponseReaction = _a.addResponseReaction, exports.deleteResponseReaction = _a.deleteResponseReaction, exports.addCommentReaction = _a.addCommentReaction, exports.deleteCommentReaction = _a.deleteCommentReaction;
exports.default = exports.slice.reducer;
//# sourceMappingURL=bulletinBoard.js.map