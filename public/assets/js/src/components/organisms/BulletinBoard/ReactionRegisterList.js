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
exports.ReactionRegisterList = void 0;
const react_1 = __importStar(require("react"));
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const storage_1 = require("../../../lib/storage");
const ReactionRegisterList = (props) => {
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const cdCtrlDtls = (0, hooks_1.useAppSelector)((state) => state.account.master.cdCtrlDtls);
    const popupStatus = (0, hooks_1.useAppSelector)((state) => state.bulletinBoardReactionRegistPopup);
    const { thread, onClickThreadReactionButton, onClickResponseReactionButton, onClickCommentReactionButton } = props;
    const buttonList = (0, react_1.useMemo)(() => cdCtrlDtls
        .filter((item) => item.cdCls === "048")
        .filter((item) => {
        if (!thread) {
            return false;
        }
        if (popupStatus.popupTargetType === "thread") {
            const foundItem = thread.thread.bbRacList.find((bbRacItem) => bbRacItem.racType === item.cdCat1);
            if (!foundItem) {
                return true;
            }
            return foundItem.racUser.every((racUserItem) => racUserItem.userId !== jobAuth.user.userId);
        }
        if (popupStatus.popupTargetType === "response") {
            const foundResponseItem = thread.thread.bbResList.find((bbResItem) => bbResItem.resId === popupStatus.popupTargetId);
            if (!foundResponseItem) {
                return false;
            }
            const foundReactionItem = foundResponseItem === null || foundResponseItem === void 0 ? void 0 : foundResponseItem.bbResRacList.find((bbResRacItem) => bbResRacItem.racType === item.cdCat1);
            if (!foundReactionItem) {
                return true;
            }
            return foundReactionItem.racUser.every((racUserItem) => racUserItem.userId !== jobAuth.user.userId);
        }
        if (popupStatus.popupTargetType === "comment") {
            const foundCommentItem = thread.thread.bbCmtList.find((bbCmtItem) => bbCmtItem.cmtId === popupStatus.popupTargetId);
            if (!foundCommentItem) {
                return false;
            }
            const foundReactionItem = foundCommentItem === null || foundCommentItem === void 0 ? void 0 : foundCommentItem.bbCmtRacList.find((bbCmtRacItem) => bbCmtRacItem.racType === item.cdCat1);
            if (!foundReactionItem) {
                return true;
            }
            return foundReactionItem.racUser.every((racUserItem) => racUserItem.userId !== jobAuth.user.userId);
        }
        return false;
    })
        .map((item) => ({ racType: item.cdCat1, iconURL: item.txt6 })), [jobAuth, thread, cdCtrlDtls, popupStatus]);
    const addReaction = (0, react_1.useCallback)((racType) => {
        const { popupTargetType, popupTargetId } = popupStatus;
        const requestCommonParams = { funcType: 1, racType };
        if (popupTargetType === "thread") {
            onClickThreadReactionButton({
                ...requestCommonParams,
                bbId: popupTargetId,
            });
        }
        else if (popupTargetType === "response") {
            onClickResponseReactionButton({
                ...requestCommonParams,
                resId: popupTargetId,
            });
        }
        else if (popupTargetType === "comment") {
            onClickCommentReactionButton({
                ...requestCommonParams,
                cmtId: popupTargetId,
            });
        }
    }, [popupStatus, onClickThreadReactionButton, onClickResponseReactionButton, onClickCommentReactionButton]);
    const handleClickButton = (0, react_1.useCallback)((racType, event) => {
        if (!storage_1.storage.isPc) {
            return;
        }
        addReaction(racType);
        event.stopPropagation();
    }, [addReaction]);
    const handleTouchButton = (0, react_1.useCallback)((racType, event) => {
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        addReaction(racType);
        event.stopPropagation();
    }, [addReaction]);
    return !(0, lodash_isempty_1.default)(buttonList) ? (react_1.default.createElement(Container, null, buttonList.map((item) => (react_1.default.createElement(ReactionRegisterButton, { key: `reactionRegisterButton_${item.racType}`, onClickCapture: (event) => handleClickButton(item.racType, event), onTouchEndCapture: (event) => handleTouchButton(item.racType, event) },
        react_1.default.createElement("img", { src: item.iconURL, height: 24, alt: "" })))))) : null;
};
exports.ReactionRegisterList = ReactionRegisterList;
const Container = styled_components_1.default.div `
  display: flex;
  padding: 0 16px;
  align-items: center;
  background-color: rgb(230 230 230 / 80%);
  border: solid 1px #346181;
  border-radius: 4px;
  box-shadow: 3px 3px 6px rgb(0 0 0 /35%);
  height: 48px;
`;
const ReactionRegisterButton = styled_components_1.default.button `
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 0);
  padding: 4px;
  border: none;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:not(:nth-last-child(1)) {
    margin-right: 32px;
  }

  &:hover {
    background: rgb(192 202 208);
  }
`;
//# sourceMappingURL=ReactionRegisterList.js.map