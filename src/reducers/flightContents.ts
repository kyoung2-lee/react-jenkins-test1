import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import isEmpty from "lodash.isempty";
import { Const } from "../lib/commonConst";
// eslint-disable-next-line import/no-cycle
import { FlightPaxFromListState } from "./flightContentsFlightPaxFrom";
// eslint-disable-next-line import/no-cycle
import { FlightPaxToListState } from "./flightContentsFlightPaxTo";

export type FlightModalTabName = "PaxFrom" | "B.B." | "Task" | "Detail" | "Care" | "History" | "PaxTo";
export interface FlightContentsState {
  contents: Content[];
}

export interface Content {
  identifier: string;
  currentTabName: FlightModalTabName;
  isFetching: boolean;
  isUtc: boolean;
  flightKey: FlightKey;
  flightHeader: FlightHeader | FlightDetailHeader | null;
  flightDetail: FlightDetail | null;
  bulletinBoard: BulletinBoard | null;
  stationOperationTask: StationOperationTask | null;
  flightSpecialCare: FlightSpecialCare | null;
  flightChangeHistory: FlightChangeHistory | null;
  flightPaxFrom: FlightPaxFromListState | null;
  flightPaxTo: FlightPaxToListState | null;
  connectDbCat?: ConnectDbCat;
  scrollTop: number;
}

export interface FlightHeader {
  orgDateLcl: string;
  alCd: string;
  fltNo: string;
  casFltNo: string;
  lstDepApoCd: string;
  lstArrApoCd: string;
  csFlg: boolean;
}

export interface FlightDetailHeader {
  alCd: string;
  fltNo: string;
  casFltNo: string;
  openSuffixUtc: string;
  csCnt: number;
  orgDateLcl: string;
  orgDateUtc: string;
  legCnlRsnIataCd: string;
  fisFltSts: string;
}

export interface FlightKey {
  myApoCd: string;
  orgDateLcl: string;
  alCd: string;
  fltNo: string;
  casFltNo: string | null;
  skdDepApoCd: string;
  skdArrApoCd: string;
  skdLegSno: number;
  oalTblFlg: boolean;
}

export interface FlightDetail {
  timeUtc: string;
  timeLcl: string;
  flight: FlightDetailApi.Flight;
  dep: FlightDetailApi.Dep;
  arr: FlightDetailApi.Arr;
  pax: FlightDetailApi.Pax;
  crew: FlightDetailApi.Crew;
  connectDbCat: ConnectDbCat;
}

export interface BulletinBoard {
  threads?: BulletinBoardThreadFlightApi.Response;
  thread?: BulletinBoardThreadApi.Response | null;
  currentBbId?: number | null;
  isNeedScroll: boolean;
  fetchedTimeStamp: number;
}

export interface StationOperationTask {
  flight: CommonApi.Flight;
  workUserList: StationOperationTaskApi.WorkUserList[];
  workStepList: StationOperationTaskApi.WorkStepList[];
  connectDbCat: ConnectDbCat;
}

export interface FlightSpecialCare {
  flight: CommonApi.Flight;
  spclPaxRcvDateTime: FlightSpecialCareApi.Response["spclPaxRcvDateTime"];
  spclPaxGrp: FlightSpecialCareApi.Response["spclPaxGrp"];
  spclLoadRcvDateTime: FlightSpecialCareApi.Response["spclLoadRcvDateTime"];
  spclLoadGrp: FlightSpecialCareApi.Response["spclLoadGrp"];
  connectDbCat: ConnectDbCat;
}

export interface FlightChangeHistory {
  flight: CommonApi.Flight;
  history: FlightChangeHistoryApi.Response["history"];
  connectDbCat: ConnectDbCat;
}

export interface FlightPaxFrom {
  timeLcl: FlightPaxFromApi.Response["timeLcl"];
  flight: CommonApi.Flight;
  paxFromHeader: FlightPaxFromApi.PaxFromHeader;
  intoData: FlightPaxFromApi.Response["intoData"];
  connectDbCat: ConnectDbCat;
}

export interface FlightPaxTo {
  timeLcl: FlightPaxToApi.Response["timeLcl"];
  flight: CommonApi.Flight;
  paxToHeader: FlightPaxToApi.PaxToHeader;
  ontoData: FlightPaxToApi.Response["ontoData"];
  connectDbCat: ConnectDbCat;
}

const initialState: FlightContentsState = {
  contents: [],
};

const initialFlightKey: FlightKey = {
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

const initialContent: Content = {
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

export function getIdentifier(key: FlightKey): string {
  const casFltNo = key.casFltNo !== undefined && key.casFltNo !== null ? key.casFltNo : "";
  return `${key.orgDateLcl}/${key.alCd}/${key.fltNo}/${casFltNo}/${key.skdArrApoCd}/${key.skdDepApoCd}/${key.skdLegSno}`;
}

export const slice = createSlice({
  name: "flightContents",
  initialState,
  reducers: {
    clearFlightContents: (state) => {
      Object.assign(state, initialState);
    },
    addFlightContent: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        tabName: FlightModalTabName;
        removeAll?: boolean;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
      const newElement: Content = {
        ...initialContent,
        identifier,
        currentTabName: action.payload.tabName,
        flightKey: action.payload.flightKey,
      };

      if (contentIndex >= 0) {
        if (action.payload.removeAll) {
          state.contents = [newElement];
        } else {
          state.contents.splice(contentIndex, 1);
          state.contents.push(newElement);
        }
      } else if (state.contents.length < Const.MODAL_LIMIT_COUNT) {
        state.contents.push(newElement);
      }
    },
    removeFlightContent: (
      state,
      action: PayloadAction<{
        identifier: string | null /* nullは全て削除 */;
      }>
    ) => {
      const contentIndex = state.contents.findIndex((c) => c.identifier === action.payload.identifier);
      if (contentIndex >= 0) {
        state.contents.splice(contentIndex, 1);
      } else if (action.payload.identifier == null) {
        Object.assign(state, initialState);
      }
    },
    startFetching: (
      state,
      action: PayloadAction<{
        identifier: string;
      }>
    ) => {
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
    failureFetching: (
      state,
      action: PayloadAction<{
        identifier: string;
      }>
    ) => {
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
    selectTab: (
      state,
      action: PayloadAction<{
        identifier: string;
        tabName: FlightModalTabName;
      }>
    ) => {
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
    applyFlightDetail: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        flightDetail: FlightDetail;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
      const { flightDetail } = action.payload;
      const currentTabName: FlightModalTabName = "Detail";
      const flightDetailHeader: FlightDetailHeader = {
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
      } else {
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
    applyBulletinBoard: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        bulletinBoard: BulletinBoard;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
      const currentTabName: FlightModalTabName = "B.B.";
      if (contentIndex >= 0) {
        const content = state.contents[contentIndex];
        const bulletinBoard: BulletinBoard = {
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
      } else {
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
    applyBulletinBoardRemoveThread: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        bbId: number;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
      const { bbId } = action.payload;

      if (contentIndex >= 0) {
        const content = state.contents[contentIndex];
        if (content.bulletinBoard) {
          // 対象のスレッドをリストから削除する
          const bulletinBoard: BulletinBoard = {
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
    applyBulletinBoardAddThreadReaction: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        bbId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const content = state.contents.find((c) => c.identifier === identifier);
      const thread = content?.bulletinBoard?.thread;
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
    applyBulletinBoardDeleteThreadReaction: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        bbId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const content = state.contents.find((c) => c.identifier === identifier);
      const thread = content?.bulletinBoard?.thread;
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

      thread.thread.bbRacList = bbRacListAfterDecreased.filter((item) => item.racCount > 0 && !isEmpty(item.racUser));
    },
    applyBulletinBoardAddResponseReaction: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        resId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const content = state.contents.find((c) => c.identifier === identifier);
      const thread = content?.bulletinBoard?.thread;
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
    applyBulletinBoardDeleteResponseReaction: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        resId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const content = state.contents.find((c) => c.identifier === identifier);
      const thread = content?.bulletinBoard?.thread;
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
          bbResRacList: bbResRacListAfterDecreased.filter((bbResRacItem) => bbResRacItem.racCount > 0 && !isEmpty(bbResRacItem.racUser)),
        };
      });
    },

    applyBulletinBoardAddCommentReaction: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        cmtId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const content = state.contents.find((c) => c.identifier === identifier);
      const thread = content?.bulletinBoard?.thread;
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
    applyBulletinBoardDeleteCommentReaction: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        cmtId: number;
        racType: string;
        user: JobAuthApi.User;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const content = state.contents.find((c) => c.identifier === identifier);
      const thread = content?.bulletinBoard?.thread;
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
          bbCmtRacList: bbCmtRacListAfterDecreased.filter((bbCmtRacItem) => bbCmtRacItem.racCount > 0 && !isEmpty(bbCmtRacItem.racUser)),
        };
      });
    },
    applyStationOperationTask: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        stationOperationTask: StationOperationTask;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
      const { stationOperationTask } = action.payload;
      const currentTabName: FlightModalTabName = "Task";
      const flightHeader =
        stationOperationTask && stationOperationTask.flight
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
      } else {
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
    applyFlightSpecialCare: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        flightSpecialCare: FlightSpecialCare;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
      const { flightSpecialCare } = action.payload;
      const currentTabName: FlightModalTabName = "Care";
      const flightHeader =
        flightSpecialCare && flightSpecialCare.flight
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
      } else {
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
    applyFlightChangeHistory: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        flightChangeHistory: FlightChangeHistory;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
      const { flightChangeHistory } = action.payload;
      const currentTabName: FlightModalTabName = "History";
      const flightHeader =
        flightChangeHistory && flightChangeHistory.flight
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
      } else {
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
    applyFlightPaxFrom: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        flightPaxFrom: FlightPaxFromListState;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
      const { flightPaxFrom } = action.payload;
      const currentTabName: FlightModalTabName = "PaxFrom";
      const flightHeader =
        flightPaxFrom && flightPaxFrom.flight
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
      } else {
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
    applyFlightPaxTo: (
      state,
      action: PayloadAction<{
        flightKey: FlightKey;
        flightPaxTo: FlightPaxToListState;
      }>
    ) => {
      const identifier = getIdentifier(action.payload.flightKey);
      const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);
      const { flightPaxTo } = action.payload;
      const currentTabName: FlightModalTabName = "PaxTo";
      const flightHeader =
        flightPaxTo && flightPaxTo.flight
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
      } else {
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
    saveScroll: (
      state,
      action: PayloadAction<{
        identifier: string;
        scrollTop: number;
      }>
    ) => {
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
    toggleUtcMode: (
      state,
      action: PayloadAction<{
        identifier: string;
        isUtc: boolean;
      }>
    ) => {
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
    applyFlightRmks: (
      state,
      action: PayloadAction<{
        identifier: string;
        response: FlightRmksApi.Response;
        params: FlightRmksApi.Request;
      }>
    ) => {
      const { identifier, response, params } = action.payload;
      const contentIndex = state.contents.findIndex((c) => c.identifier === identifier);

      if (contentIndex >= 0) {
        const content = state.contents[contentIndex];
        if (content.flightDetail) {
          const flightDetail: FlightDetail =
            params.rmksTypeCd === "ARR"
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

export const {
  clearFlightContents,
  addFlightContent,
  removeFlightContent,
  startFetching,
  failureFetching,
  selectTab,
  applyFlightDetail,
  applyBulletinBoard,
  applyBulletinBoardRemoveThread,
  applyBulletinBoardAddThreadReaction,
  applyBulletinBoardDeleteThreadReaction,
  applyBulletinBoardAddResponseReaction,
  applyBulletinBoardDeleteResponseReaction,
  applyBulletinBoardAddCommentReaction,
  applyBulletinBoardDeleteCommentReaction,
  applyStationOperationTask,
  applyFlightSpecialCare,
  applyFlightChangeHistory,
  applyFlightPaxFrom,
  applyFlightPaxTo,
  saveScroll,
  toggleUtcMode,
  applyFlightRmks,
} = slice.actions;

export default slice.reducer;
