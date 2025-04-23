"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyFlightRmks = exports.toggleUtcMode = exports.saveScroll = exports.applyFlightPaxTo = exports.applyFlightPaxFrom = exports.applyFlightChangeHistory = exports.applyFlightSpecialCare = exports.applyStationOperationTask = exports.applyBulletinBoardDeleteCommentReaction = exports.applyBulletinBoardAddCommentReaction = exports.applyBulletinBoardDeleteResponseReaction = exports.applyBulletinBoardAddResponseReaction = exports.applyBulletinBoardDeleteThreadReaction = exports.applyBulletinBoardAddThreadReaction = exports.applyBulletinBoardRemoveThread = exports.applyBulletinBoard = exports.applyFlightDetail = exports.selectTab = exports.failureFetching = exports.startFetching = exports.removeFlightContent = exports.addFlightContent = exports.clearFlightContents = exports.slice = exports.getIdentifier = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const commonConst_1 = require("../lib/commonConst");
const initialState = {
    contents: [],
};
const initialFlightKey = {
    myApoCd: "",
    orgDateLcl: "",
    alCd: "",
    fltNo: "",
    casFltNo: null,
    skdDepApoCd: "",
    skdArrApoCd: "",
    skdLegSno: 0,
    oalTblFlg: false,
};
const initialContent = {
    identifier: "",
    currentTabName: "Detail",
    isFetching: false,
    isUtc: false,
    flightKey: initialFlightKey,
    flightHeader: null,
    flightDetail: null,
    bulletinBoard: null,
    stationOperationTask: null,
    flightSpecialCare: null,
    flightChangeHistory: null,
    flightPaxFrom: null,
    flightPaxTo: null,
    connectDbCat: undefined,
    scrollTop: 0,
};
function getIdentifier(key) {
    const casFltNo = key.casFltNo !== undefined && key.casFltNo !== null ? key.casFltNo : "";
    return `${key.orgDateLcl}/${key.alCd}/${key.fltNo}/${casFltNo}/${key.skdArrApoCd}/${key.skdDepApoCd}/${key.skdLegSno}`;
}
exports.getIdentifier = getIdentifier;
exports.slice = (0, toolkit_1.createSlice)({
    name: "flightContents",
    initialState,
    reducers: {
        clearFlightContents: (state) => {
            Object.assign(state, initialState);
        },
        addFlightContent: (state, action) => {
            const identifier = getIdentifier(action.payload.flightKey);
            const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
            const newElement = {
                ...initialContent,
                identifier,
                currentTabName: action.payload.tabName,
                flightKey: action.payload.flightKey,
            };
            if (contentIndex >= 0) {
                if (action.payload.removeAll) {
                    state.contents = [newElement];
                }
                else {
                    state.contents.splice(contentIndex, 1);
                    state.contents.push(newElement);
                }
            }
            else if (state.contents.length < commonConst_1.Const.MODAL_LIMIT_COUNT) {
                state.contents.push(newElement);
            }
        },
        removeFlightContent: (state, action) => {
            const contentIndex = state.contents.findIndex((c) => c.identifier === action.payload.identifier);
            if (contentIndex >= 0) {
                state.contents.splice(contentIndex, 1);
            }
            else if (action.payload.identifier == null) {
                Object.assign(state, initialState);
            }
        },
        startFetching: (state, action) => {
            const contentIndex = state.contents.findIndex((c) => c.identifier === action.payload.identifier);
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    isFetching: true,
                });
            }
        },
        failureFetching: (state, action) => {
            const contentIndex = state.contents.findIndex((c) => c.identifier === action.payload.identifier);
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    isFetching: false,
                });
            }
        },
        selectTab: (state, action) => {
            const contentIndex = state.contents.findIndex((c) => c.identifier === action.payload.identifier);
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    currentTabName: action.payload.tabName,
                });
            }
        },
        applyFlightDetail: (state, action) => {
            const identifier = getIdentifier(action.payload.flightKey);
            const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
            const { flightDetail } = action.payload;
            const currentTabName = "Detail";
            const flightDetailHeader = {
                alCd: flightDetail.flight.alCd,
                fltNo: flightDetail.flight.fltNo,
                casFltNo: flightDetail.flight.casFltNo,
                openSuffixUtc: flightDetail.flight.opeSuffixUtc,
                csCnt: flightDetail.flight.csCnt,
                orgDateLcl: flightDetail.flight.orgDateLcl,
                orgDateUtc: flightDetail.flight.orgDateUtc,
                legCnlRsnIataCd: flightDetail.flight.legCnlRsnIataCd,
                fisFltSts: flightDetail.flight.fisFltSts,
            };
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    currentTabName,
                    isFetching: false,
                    flightHeader: flightDetailHeader,
                    flightDetail,
                    connectDbCat: flightDetail.connectDbCat,
                });
            }
            else {
                state.contents.push({
                    ...initialContent,
                    identifier,
                    currentTabName,
                    flightKey: action.payload.flightKey,
                    flightHeader: flightDetailHeader,
                    flightDetail,
                    connectDbCat: flightDetail.connectDbCat,
                });
            }
        },
        applyBulletinBoard: (state, action) => {
            const identifier = getIdentifier(action.payload.flightKey);
            const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
            const currentTabName = "B.B.";
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                const bulletinBoard = {
                    ...content.bulletinBoard,
                    ...action.payload.bulletinBoard,
                };
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    currentTabName,
                    isFetching: false,
                    flightHeader: bulletinBoard.threads ? bulletinBoard.threads.flight : content.flightHeader,
                    bulletinBoard,
                    connectDbCat: bulletinBoard.threads ? bulletinBoard.threads.connectDbCat : content.connectDbCat,
                });
            }
            else {
                const bulletinBoard = {
                    ...action.payload.bulletinBoard,
                };
                state.contents.push({
                    ...initialContent,
                    identifier,
                    currentTabName,
                    flightKey: {
                        ...initialFlightKey,
                        ...action.payload.flightKey,
                    },
                    flightHeader: bulletinBoard.threads ? bulletinBoard.threads.flight : null,
                    bulletinBoard,
                    connectDbCat: bulletinBoard.threads ? bulletinBoard.threads.connectDbCat : undefined,
                });
            }
        },
        applyBulletinBoardRemoveThread: (state, action) => {
            const identifier = getIdentifier(action.payload.flightKey);
            const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
            const { bbId } = action.payload;
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                if (content.bulletinBoard) {
                    // 対象のスレッドをリストから削除する
                    const bulletinBoard = {
                        ...content.bulletinBoard,
                        threads: content.bulletinBoard.threads
                            ? {
                                ...content.bulletinBoard.threads,
                                threads: content.bulletinBoard.threads.threads.filter((thread) => thread.bbId !== bbId),
                            }
                            : content.bulletinBoard.threads,
                        currentBbId: null,
                        thread: null,
                    };
                    state.contents.splice(contentIndex, 1);
                    state.contents.push({
                        ...content,
                        isFetching: false,
                        flightHeader: bulletinBoard.threads ? bulletinBoard.threads.flight : content.flightHeader,
                        bulletinBoard,
                        connectDbCat: bulletinBoard.threads ? bulletinBoard.threads.connectDbCat : content.connectDbCat,
                    });
                }
            }
        },
        applyBulletinBoardAddThreadReaction: (state, action) => {
            var _a;
            const identifier = getIdentifier(action.payload.flightKey);
            const content = state.contents.find((c) => c.identifier === identifier);
            const thread = (_a = content === null || content === void 0 ? void 0 : content.bulletinBoard) === null || _a === void 0 ? void 0 : _a.thread;
            if (!thread) {
                return;
            }
            const isExistingMyReaction = thread.thread.bbRacList.some((item) => {
                if (item.racType !== action.payload.racType) {
                    return false;
                }
                return item.racUser.some((racUserItem) => racUserItem.userId === action.payload.user.userId);
            });
            if (isExistingMyReaction) {
                return;
            }
            const isExistingReaction = thread.thread.bbRacList.some((item) => item.racType === action.payload.racType);
            if (!isExistingReaction) {
                thread.thread.bbRacList = thread.thread.bbRacList.concat({
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
            thread.thread.bbRacList = thread.thread.bbRacList.map((item) => {
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
        applyBulletinBoardDeleteThreadReaction: (state, action) => {
            var _a;
            const identifier = getIdentifier(action.payload.flightKey);
            const content = state.contents.find((c) => c.identifier === identifier);
            const thread = (_a = content === null || content === void 0 ? void 0 : content.bulletinBoard) === null || _a === void 0 ? void 0 : _a.thread;
            if (!thread) {
                return;
            }
            const isExistingMyReaction = thread.thread.bbRacList.some((item) => {
                if (item.racType !== action.payload.racType) {
                    return false;
                }
                return item.racUser.some((racUserItem) => racUserItem.userId === action.payload.user.userId);
            });
            if (!isExistingMyReaction) {
                return;
            }
            const bbRacListAfterDecreased = thread.thread.bbRacList.map((item) => {
                if (item.racType !== action.payload.racType) {
                    return item;
                }
                return {
                    ...item,
                    racCount: item.racCount - 1,
                    racUser: item.racUser.filter((racUserItem) => racUserItem.userId !== action.payload.user.userId),
                };
            });
            thread.thread.bbRacList = bbRacListAfterDecreased.filter((item) => item.racCount > 0 && !(0, lodash_isempty_1.default)(item.racUser));
        },
        applyBulletinBoardAddResponseReaction: (state, action) => {
            var _a;
            const identifier = getIdentifier(action.payload.flightKey);
            const content = state.contents.find((c) => c.identifier === identifier);
            const thread = (_a = content === null || content === void 0 ? void 0 : content.bulletinBoard) === null || _a === void 0 ? void 0 : _a.thread;
            if (!thread) {
                return;
            }
            const isExistingMyReaction = thread.thread.bbResList.some((item) => {
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
            const isExistingReaction = thread.thread.bbResList.some((item) => {
                if (item.resId !== action.payload.resId) {
                    return false;
                }
                return item.bbResRacList.some((bbResRacItem) => bbResRacItem.racType === action.payload.racType);
            });
            if (!isExistingReaction) {
                thread.thread.bbResList = thread.thread.bbResList.map((item) => {
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
            thread.thread.bbResList = thread.thread.bbResList.map((item) => {
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
        applyBulletinBoardDeleteResponseReaction: (state, action) => {
            var _a;
            const identifier = getIdentifier(action.payload.flightKey);
            const content = state.contents.find((c) => c.identifier === identifier);
            const thread = (_a = content === null || content === void 0 ? void 0 : content.bulletinBoard) === null || _a === void 0 ? void 0 : _a.thread;
            if (!thread) {
                return;
            }
            const isExistingMyReaction = thread.thread.bbResList.some((item) => {
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
            thread.thread.bbResList = thread.thread.bbResList.map((item) => {
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
        applyBulletinBoardAddCommentReaction: (state, action) => {
            var _a;
            const identifier = getIdentifier(action.payload.flightKey);
            const content = state.contents.find((c) => c.identifier === identifier);
            const thread = (_a = content === null || content === void 0 ? void 0 : content.bulletinBoard) === null || _a === void 0 ? void 0 : _a.thread;
            if (!thread) {
                return;
            }
            const isExistingMyReaction = thread.thread.bbCmtList.some((item) => {
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
            const isExistingReaction = thread.thread.bbCmtList.some((item) => {
                if (item.cmtId !== action.payload.cmtId) {
                    return false;
                }
                return item.bbCmtRacList.some((bbCmtRacItem) => bbCmtRacItem.racType === action.payload.racType);
            });
            if (!isExistingReaction) {
                thread.thread.bbCmtList = thread.thread.bbCmtList.map((item) => {
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
            thread.thread.bbCmtList = thread.thread.bbCmtList.map((item) => {
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
        applyBulletinBoardDeleteCommentReaction: (state, action) => {
            var _a;
            const identifier = getIdentifier(action.payload.flightKey);
            const content = state.contents.find((c) => c.identifier === identifier);
            const thread = (_a = content === null || content === void 0 ? void 0 : content.bulletinBoard) === null || _a === void 0 ? void 0 : _a.thread;
            if (!thread) {
                return;
            }
            const isExistingMyReaction = thread.thread.bbCmtList.some((item) => {
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
            thread.thread.bbCmtList = thread.thread.bbCmtList.map((item) => {
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
        applyStationOperationTask: (state, action) => {
            const identifier = getIdentifier(action.payload.flightKey);
            const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
            const { stationOperationTask } = action.payload;
            const currentTabName = "Task";
            const flightHeader = stationOperationTask && stationOperationTask.flight
                ? {
                    ...stationOperationTask.flight,
                }
                : null;
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    currentTabName,
                    isFetching: false,
                    flightHeader,
                    stationOperationTask,
                    connectDbCat: stationOperationTask.connectDbCat,
                });
            }
            else {
                state.contents.push({
                    ...initialContent,
                    identifier,
                    currentTabName,
                    flightKey: {
                        ...initialFlightKey,
                        ...action.payload.flightKey,
                    },
                    flightHeader,
                    stationOperationTask,
                    connectDbCat: stationOperationTask.connectDbCat,
                });
            }
        },
        applyFlightSpecialCare: (state, action) => {
            const identifier = getIdentifier(action.payload.flightKey);
            const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
            const { flightSpecialCare } = action.payload;
            const currentTabName = "Care";
            const flightHeader = flightSpecialCare && flightSpecialCare.flight
                ? {
                    ...flightSpecialCare.flight,
                }
                : null;
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    currentTabName,
                    isFetching: false,
                    flightHeader,
                    flightSpecialCare,
                    connectDbCat: flightSpecialCare.connectDbCat,
                });
            }
            else {
                state.contents.push({
                    ...initialContent,
                    identifier,
                    currentTabName,
                    flightKey: {
                        ...initialFlightKey,
                        ...action.payload.flightKey,
                    },
                    flightHeader,
                    flightSpecialCare,
                    connectDbCat: flightSpecialCare.connectDbCat,
                });
            }
        },
        applyFlightChangeHistory: (state, action) => {
            const identifier = getIdentifier(action.payload.flightKey);
            const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
            const { flightChangeHistory } = action.payload;
            const currentTabName = "History";
            const flightHeader = flightChangeHistory && flightChangeHistory.flight
                ? {
                    ...flightChangeHistory.flight,
                }
                : null;
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    currentTabName,
                    isFetching: false,
                    flightHeader,
                    flightChangeHistory,
                    connectDbCat: flightChangeHistory.connectDbCat,
                });
            }
            else {
                state.contents.push({
                    ...initialContent,
                    identifier,
                    currentTabName,
                    flightKey: {
                        ...initialFlightKey,
                        ...action.payload.flightKey,
                    },
                    flightHeader,
                    flightChangeHistory,
                    connectDbCat: flightChangeHistory.connectDbCat,
                });
            }
        },
        applyFlightPaxFrom: (state, action) => {
            const identifier = getIdentifier(action.payload.flightKey);
            const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
            const { flightPaxFrom } = action.payload;
            const currentTabName = "PaxFrom";
            const flightHeader = flightPaxFrom && flightPaxFrom.flight
                ? {
                    ...flightPaxFrom.flight,
                }
                : null;
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    currentTabName,
                    isFetching: false,
                    flightHeader,
                    flightPaxFrom,
                    connectDbCat: flightPaxFrom.connectDbCat,
                });
            }
            else {
                state.contents.push({
                    ...initialContent,
                    identifier,
                    currentTabName,
                    flightKey: {
                        ...initialFlightKey,
                        ...action.payload.flightKey,
                    },
                    flightHeader,
                    flightPaxFrom,
                    connectDbCat: flightPaxFrom.connectDbCat,
                });
            }
        },
        applyFlightPaxTo: (state, action) => {
            const identifier = getIdentifier(action.payload.flightKey);
            const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
            const { flightPaxTo } = action.payload;
            const currentTabName = "PaxTo";
            const flightHeader = flightPaxTo && flightPaxTo.flight
                ? {
                    ...flightPaxTo.flight,
                }
                : null;
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    currentTabName,
                    isFetching: false,
                    flightHeader,
                    flightPaxTo,
                    connectDbCat: flightPaxTo.connectDbCat,
                });
            }
            else {
                state.contents.push({
                    ...initialContent,
                    identifier,
                    currentTabName,
                    flightKey: {
                        ...initialFlightKey,
                        ...action.payload.flightKey,
                    },
                    flightHeader,
                    flightPaxTo,
                    connectDbCat: flightPaxTo.connectDbCat,
                });
            }
        },
        saveScroll: (state, action) => {
            const contentIndex = state.contents.findIndex((c) => c.identifier === action.payload.identifier);
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    scrollTop: action.payload.scrollTop,
                });
            }
        },
        toggleUtcMode: (state, action) => {
            const contentIndex = state.contents.findIndex((c) => c.identifier === action.payload.identifier);
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                state.contents.splice(contentIndex, 1);
                state.contents.push({
                    ...content,
                    isUtc: action.payload.isUtc,
                });
            }
        },
        applyFlightRmks: (state, action) => {
            const { identifier, response, params } = action.payload;
            const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
            if (contentIndex >= 0) {
                const content = state.contents[contentIndex];
                if (content.flightDetail) {
                    const flightDetail = params.rmksTypeCd === "ARR"
                        ? {
                            ...content.flightDetail,
                            arr: {
                                ...content.flightDetail.arr,
                                arrRmksText: response.rmksText,
                            },
                        }
                        : {
                            ...content.flightDetail,
                            dep: {
                                ...content.flightDetail.dep,
                                depRmksText: response.rmksText,
                            },
                        };
                    state.contents.splice(contentIndex, 1);
                    state.contents.push({
                        ...content,
                        flightDetail,
                        isFetching: false,
                    });
                }
            }
        },
    },
});
_a = exports.slice.actions, exports.clearFlightContents = _a.clearFlightContents, exports.addFlightContent = _a.addFlightContent, exports.removeFlightContent = _a.removeFlightContent, exports.startFetching = _a.startFetching, exports.failureFetching = _a.failureFetching, exports.selectTab = _a.selectTab, exports.applyFlightDetail = _a.applyFlightDetail, exports.applyBulletinBoard = _a.applyBulletinBoard, exports.applyBulletinBoardRemoveThread = _a.applyBulletinBoardRemoveThread, exports.applyBulletinBoardAddThreadReaction = _a.applyBulletinBoardAddThreadReaction, exports.applyBulletinBoardDeleteThreadReaction = _a.applyBulletinBoardDeleteThreadReaction, exports.applyBulletinBoardAddResponseReaction = _a.applyBulletinBoardAddResponseReaction, exports.applyBulletinBoardDeleteResponseReaction = _a.applyBulletinBoardDeleteResponseReaction, exports.applyBulletinBoardAddCommentReaction = _a.applyBulletinBoardAddCommentReaction, exports.applyBulletinBoardDeleteCommentReaction = _a.applyBulletinBoardDeleteCommentReaction, exports.applyStationOperationTask = _a.applyStationOperationTask, exports.applyFlightSpecialCare = _a.applyFlightSpecialCare, exports.applyFlightChangeHistory = _a.applyFlightChangeHistory, exports.applyFlightPaxFrom = _a.applyFlightPaxFrom, exports.applyFlightPaxTo = _a.applyFlightPaxTo, exports.saveScroll = _a.saveScroll, exports.toggleUtcMode = _a.toggleUtcMode, exports.applyFlightRmks = _a.applyFlightRmks;
exports.default = exports.slice.reducer;
//# sourceMappingURL=flightContents.js.map