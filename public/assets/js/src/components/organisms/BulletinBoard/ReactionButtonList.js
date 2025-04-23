"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionButtonList = void 0;
const react_1 = __importStar(require("react"));
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const storage_1 = require("../../../lib/storage");
const ReactionButtonList = ({ popupTargetType, reactionList, onClickReaction, isButtonActive, isVisibleReactionDetailPopup, setIsVisibleReactionDetailPopup, }) => {
    var _a;
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const cdCtrlDtls = (0, hooks_1.useAppSelector)((state) => state.account.master.cdCtrlDtls);
    // B.B. 画面から開いているか、便カテゴリの小ウィンドウから開いているかを判別するために使う
    // どちらか一方からのみ掲示板画面を開いているという想定のため、両方から開いている場合には別の対処をする必要がある
    const bulletinBoardThread = (0, hooks_1.useAppSelector)((state) => { var _a; return (_a = state.bulletinBoard.thread) === null || _a === void 0 ? void 0 : _a.thread; });
    const flightContents = (0, hooks_1.useAppSelector)((state) => state.flightContents.contents);
    const timeoutLongTapReactionButton = (0, react_1.useRef)(null);
    const [showingRacType, setShowingRacType] = (0, react_1.useState)(null);
    const [, setLongTapTriggered] = (0, react_1.useState)(false);
    const reactionListDisplaying = (0, react_1.useMemo)(() => {
        const reactionCodeList = cdCtrlDtls.filter((item) => item.cdCls === "048").map((item) => item.cdCat1);
        return reactionList
            .concat()
            .sort((a, b) => {
            const leftCodeFoundIndex = reactionCodeList.indexOf(a.racType);
            const rightCodeFoundIndex = reactionCodeList.indexOf(b.racType);
            return leftCodeFoundIndex > rightCodeFoundIndex ? 1 : -1;
        })
            .filter((item) => item.racCount > 0 && !(0, lodash_isempty_1.default)(item.racUser));
    }, [cdCtrlDtls, reactionList]);
    const currentReactionDetailData = (0, react_1.useMemo)(() => reactionList.find((item) => item.racType === showingRacType), [reactionList, showingRacType]);
    const currentReactedByUserListString = (0, react_1.useMemo)(() => {
        if (!currentReactionDetailData) {
            return "";
        }
        const top10UserList = currentReactionDetailData.racUser.filter((_, index) => index < 10);
        const top10UserListString = top10UserList
            .map((item) => (item.userId === jobAuth.user.userId ? "YOU" : `${item.firstName} ${item.familyName}`))
            .join(", ");
        return currentReactionDetailData.racCount > 10
            ? `${top10UserListString} and ${currentReactionDetailData.racCount - 10} others.`
            : top10UserListString;
    }, [currentReactionDetailData, jobAuth]);
    const screenOpeningFrom = (0, react_1.useMemo)(() => {
        if (bulletinBoardThread) {
            return "B.B.Screen";
        }
        if (flightContents.find((item) => { var _a, _b; return (_b = (_a = item.bulletinBoard) === null || _a === void 0 ? void 0 : _a.thread) === null || _b === void 0 ? void 0 : _b.thread; })) {
            return "B.B.MiniScreen";
        }
        return "";
    }, [bulletinBoardThread, flightContents]);
    const reactionDetailLeftOffset = (0, react_1.useMemo)(() => {
        if (screenOpeningFrom === "B.B.Screen" && !storage_1.storage.isIphone) {
            return 0;
        }
        if (popupTargetType === "thread") {
            return screenOpeningFrom === "B.B.Screen" ? -28 : -19;
        }
        if (popupTargetType === "response" || popupTargetType === "commentOthers") {
            return screenOpeningFrom === "B.B.Screen" ? -11 : -9;
        }
        if (popupTargetType === "commentMine") {
            return screenOpeningFrom === "B.B.Screen" ? -33 : -31;
        }
        return 0;
    }, [popupTargetType, screenOpeningFrom]);
    const fetchIconDataURL = (0, react_1.useCallback)((racType) => { var _a, _b; return (_b = (_a = cdCtrlDtls.find((item) => item.cdCls === "048" && item.cdCat1 === racType)) === null || _a === void 0 ? void 0 : _a.txt6) !== null && _b !== void 0 ? _b : ""; }, [cdCtrlDtls]);
    const checkReactioningByMe = (0, react_1.useCallback)((racType) => {
        const reactionData = reactionList.find((item) => item.racType === racType);
        if (!reactionData) {
            return false;
        }
        return reactionData.racUser.some((item) => item.userId === jobAuth.user.userId);
    }, [jobAuth, reactionList]);
    const preventDefaultOnTouch = (0, react_1.useCallback)((event) => {
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        if (event instanceof TouchEvent && event.touches.length < 2) {
            event.preventDefault();
        }
    }, []);
    const handleClickReactionButton = (0, react_1.useCallback)((racType, event) => {
        if (!storage_1.storage.isPc || !isButtonActive) {
            return;
        }
        void onClickReaction(racType);
        event.stopPropagation();
    }, [isButtonActive, onClickReaction]);
    const handleLongTapReactionButton = (0, react_1.useCallback)((racType) => {
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        setShowingRacType(racType);
        setIsVisibleReactionDetailPopup(true);
    }, [setIsVisibleReactionDetailPopup]);
    const handleTouchReactionButton = (0, react_1.useCallback)((racType, event) => {
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        event.target.addEventListener("touchend", preventDefaultOnTouch, { passive: false });
        timeoutLongTapReactionButton.current = setTimeout(() => {
            handleLongTapReactionButton(racType);
            setLongTapTriggered(true);
        }, 600);
        event.stopPropagation();
    }, [handleLongTapReactionButton, preventDefaultOnTouch]);
    const handleTouchEndReactionButton = (0, react_1.useCallback)((racType, event) => {
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        if (timeoutLongTapReactionButton.current) {
            clearTimeout(timeoutLongTapReactionButton.current);
        }
        setLongTapTriggered((longTapTriggered) => {
            if (!longTapTriggered && isButtonActive) {
                void onClickReaction(racType);
            }
            return false;
        });
        event.target.removeEventListener("touchend", preventDefaultOnTouch);
        event.stopPropagation();
    }, [isButtonActive, onClickReaction, preventDefaultOnTouch]);
    const handleMouseOverReactionButton = (0, react_1.useCallback)((racType) => {
        if (!storage_1.storage.isPc) {
            return;
        }
        if (racType) {
            setShowingRacType(racType);
        }
        setIsVisibleReactionDetailPopup(true);
    }, [setIsVisibleReactionDetailPopup]);
    const handleMouseOutReactionButton = (0, react_1.useCallback)(() => {
        if (!storage_1.storage.isPc) {
            return;
        }
        setIsVisibleReactionDetailPopup(false);
    }, [setIsVisibleReactionDetailPopup]);
    const clickStopPropagationHandler = (0, react_1.useCallback)((event) => {
        if (!storage_1.storage.isPc) {
            return;
        }
        event.stopPropagation();
    }, []);
    const touchStopPropagationHandler = (0, react_1.useCallback)((event) => {
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        event.stopPropagation();
    }, []);
    return (0, lodash_isempty_1.default)(reactionListDisplaying) ? (react_1.default.createElement("div", null)) : (react_1.default.createElement(Container, null,
        react_1.default.createElement(ListContainer, null, reactionListDisplaying.map((item) => (react_1.default.createElement(ReactionButton, { key: `ReactionButton_${item.racType}`, disabled: !isButtonActive, reactioningByMe: checkReactioningByMe(item.racType), isButtonActive: isButtonActive, onClickCapture: (event) => handleClickReactionButton(item.racType, event), onTouchStart: (event) => handleTouchReactionButton(item.racType, event), onTouchEnd: (event) => handleTouchEndReactionButton(item.racType, event), onMouseOver: () => handleMouseOverReactionButton(item.racType), onMouseOut: handleMouseOutReactionButton },
            react_1.default.createElement("img", { src: fetchIconDataURL(item.racType), height: 24, alt: "" }),
            react_1.default.createElement(ReactionCounter, null, item.racCount))))),
        react_1.default.createElement(ReactionDetailContainer, { isVisible: isVisibleReactionDetailPopup, onMouseOver: () => handleMouseOverReactionButton(), onMouseOut: handleMouseOutReactionButton, onTouchStart: touchStopPropagationHandler, onTouchEnd: touchStopPropagationHandler, onClick: clickStopPropagationHandler, style: { left: reactionDetailLeftOffset } },
            react_1.default.createElement(ReactionDetailHeader, null,
                react_1.default.createElement("img", { src: fetchIconDataURL((_a = currentReactionDetailData === null || currentReactionDetailData === void 0 ? void 0 : currentReactionDetailData.racType) !== null && _a !== void 0 ? _a : ""), height: 28, alt: "" }),
                react_1.default.createElement(ReactionDetailReactedByString, null, "Reacted by")),
            react_1.default.createElement(ReactionDetailUserList, null, currentReactedByUserListString))));
};
exports.ReactionButtonList = ReactionButtonList;
const Container = styled_components_1.default.div `
  position: relative;
`;
const ListContainer = styled_components_1.default.div `
  display: inline-flex;
  flex-wrap: wrap;
  margin-bottom: -8px;
`;
const ReactionButton = styled_components_1.default.button `
  position: relative;
  display: flex;
  border: solid 1px ${({ isButtonActive }) => (isButtonActive ? "#346181" : "#222222")};
  background-color: ${({ reactioningByMe }) => (reactioningByMe ? "#CBF3F2" : "#E4F3F2")};
  border-radius: 4px;
  align-items: center;
  height: 40px;
  padding: 0 8px;
  white-space: nowrap;
  margin-bottom: 8px;

  color: #000000;

  &:not(:nth-last-child(1)) {
    margin-right: 8px;
  }
  & > :not(:nth-last-child(1)) {
    margin-right: 4px;
  }

  ${({ isButtonActive }) => isButtonActive
    ? `
  &:hover,
  &:active {
    cursor: pointer;
  }
`
    : ""}

  &:hover {
    &:after {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  ${({ isButtonActive }) => isButtonActive
    ? `
  &:active {
    &:after {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
`
    : ""}
`;
const ReactionCounter = styled_components_1.default.div `
  font-size: 20px;
`;
const ReactionDetailContainer = styled_components_1.default.div `
  position: absolute;
  bottom: 40px;
  padding: 12px 16px 20px 16px;
  margin-bottom: 28px;
  background-color: #ffffff;
  border: solid 1px #333333;
  border-radius: 4px;
  box-shadow: 1px 1px 4px 0px #999999;
  width: 352px;
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  transition: visibility 0.1s, opacity 0.1s;
  z-index: 2;
`;
const ReactionDetailHeader = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: start;

  & > :not(:nth-last-child(1)) {
    margin-right: 8px;
  }
`;
const ReactionDetailReactedByString = styled_components_1.default.div `
  font-size: 16px;
`;
const ReactionDetailUserList = styled_components_1.default.div `
  margin-top: 4px;
  font-size: 16px;
  line-height: 21px;
`;
//# sourceMappingURL=ReactionButtonList.js.map