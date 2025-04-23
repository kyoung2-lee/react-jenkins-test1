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
exports.CommentItem = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const MessagePostedAt_1 = require("./MessagePostedAt");
const PostUser_1 = require("./PostUser");
const ActionMenu_1 = require("./ActionMenu");
const ReactionRegisterList_1 = require("./ReactionRegisterList");
const hooks_1 = require("../../../store/hooks");
const HyperLinkedText_1 = __importDefault(require("../../atoms/HyperLinkedText"));
const comment_horn_svg_1 = __importDefault(require("../../../assets/images/comment-horn.svg"));
const ReactionButtonList_1 = require("./ReactionButtonList");
const storage_1 = require("../../../lib/storage");
const Component = ({ bbId, comment, onSelect, onDelete, onClickThreadReactionButton, onClickResponseReactionButton, onClickCommentReactionButton, selecting, jobAuth, editing, archiveFlg, clearCommentStorage, toggleActionMenu, jstFlg, isVisibleReactionDetailPopup, setIsVisibleReactionDetailPopup, isVisibleReactionRegisterPopup, thread, }) => {
    // B.B. 画面から開いているか、便カテゴリの小ウィンドウから開いているかを判別するために使う
    // どちらか一方からのみ掲示板画面を開いているという想定のため、両方から開いている場合には別の対処をする必要がある
    const flightContents = (0, hooks_1.useAppSelector)((state) => state.flightContents.contents);
    const { postUser } = comment;
    const isBBMiniScreen = (0, react_1.useMemo)(() => {
        if (storage_1.storage.isIphone) {
            return true;
        }
        return flightContents.some((item) => { var _a, _b; return (_b = (_a = item.bulletinBoard) === null || _a === void 0 ? void 0 : _a.thread) === null || _b === void 0 ? void 0 : _b.thread; });
    }, [flightContents]);
    const deleteComment = () => {
        onDelete(comment.cmtId);
    };
    const selectComment = () => {
        const bbCmt = {
            ...comment,
            updateTime: `${(0, dayjs_1.default)(comment.updateTime).format("YYYY/MM/DD HH:mm")}${jstFlg ? "" : "L"}`,
        };
        onSelect(bbId, bbCmt);
    };
    const handleClickReaction = (0, react_1.useCallback)((racType) => {
        const isAlreadyReactioned = comment.bbCmtRacList.some((bbCmtRacItem) => {
            if (bbCmtRacItem.racType !== racType) {
                return false;
            }
            return bbCmtRacItem.racUser.some((racUserItem) => racUserItem.userId === jobAuth.user.userId);
        });
        onClickCommentReactionButton({
            cmtId: comment.cmtId,
            funcType: isAlreadyReactioned ? 2 : 1,
            racType,
        });
    }, [comment, jobAuth, onClickCommentReactionButton]);
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
    const me = () => jobAuth.user.jobCd === postUser.jobCd;
    const editable = () => !archiveFlg && me();
    const actions = [
        ...(editable()
            ? [
                { title: "Edit", onClick: selectComment },
                { title: "Delete", onClick: deleteComment },
            ]
            : []),
    ];
    const ReactionButtonListContainer = (react_1.default.createElement(MetaContainerReactionButtonList, { isBBMiniScreen: isBBMiniScreen },
        react_1.default.createElement(ReactionButtonList_1.ReactionButtonList, { popupTargetType: me() ? "commentMine" : "commentOthers", reactionList: comment.bbCmtRacList, onClickReaction: handleClickReaction, isButtonActive: !archiveFlg, isVisibleReactionDetailPopup: isVisibleReactionDetailPopup, setIsVisibleReactionDetailPopup: setIsVisibleReactionDetailPopup })));
    return (react_1.default.createElement(Container, { selecting: selecting, me: me() },
        react_1.default.createElement(Header, null,
            react_1.default.createElement(StyledPostUser, { userId: postUser.userId, appleId: postUser.appleId, avatar: postUser.profileTmbImg, group: postUser.jobCd, usernameWithNumber: `${postUser.userId} ${postUser.firstName} ${postUser.familyName}`, 
                // eslint-disable-next-line react/no-unstable-nested-components
                actionMenu: () => actions.length > 0 && (react_1.default.createElement(ActionMenu_1.ActionMenu, { actions: actions, editing: editing, clearCommentStorage: clearCommentStorage, toggleActionMenu: toggleActionMenu })) })),
        react_1.default.createElement(ContentContainer, null,
            react_1.default.createElement(Content, null,
                react_1.default.createElement(HyperLinkedText_1.default, null, comment.cmtText)),
            react_1.default.createElement(ReactionRegisterPopupCommentWrapper, { isIphone: storage_1.storage.isIphone, isVisible: isVisibleReactionRegisterPopup, onClick: clickStopPropagationHandler, onTouchStart: touchStopPropagationHandler, onTouchEnd: touchStopPropagationHandler },
                react_1.default.createElement(ReactionRegisterList_1.ReactionRegisterList, { thread: thread, onClickThreadReactionButton: onClickThreadReactionButton, onClickResponseReactionButton: onClickResponseReactionButton, onClickCommentReactionButton: onClickCommentReactionButton }))),
        react_1.default.createElement(MetaContainer, { isBBMiniScreen: isBBMiniScreen },
            react_1.default.createElement(MetaContainerRight, null,
                comment.editFlg && react_1.default.createElement(EditLabel, null, "*Edited*"),
                react_1.default.createElement(PostedAt, { value: comment.updateTime, jstFlg: jstFlg }))),
        ReactionButtonListContainer));
};
exports.CommentItem = (0, react_redux_1.connect)((state) => ({ jobAuth: state.account.jobAuth }))(Component);
const Container = styled_components_1.default.div `
  padding: 8px 10% 24px 15px;
  width: auto;
  ${(props) => props.selecting &&
    `
    background-color: #BBC6FA;
    border: 2px solid #8D90FC;
    `};
  ${(props) => props.me && "padding: 8px 15px 24px 10%"};
`;
const MetaContainer = styled_components_1.default.div `
  ${({ isBBMiniScreen }) => (isBBMiniScreen ? "" : "height: 16px;")}
  position: relative;
`;
const MetaContainerReactionButtonList = styled_components_1.default.div `
  justify-content: flex-start;
  padding-top: 8px;
  padding-bottom: 8px;
`;
const MetaContainerRight = styled_components_1.default.div `
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: 8px;
`;
const StyledPostUser = (0, styled_components_1.default)(PostUser_1.PostUser) `
  margin-bottom: 0;
  flex: 1;
`;
const Header = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
`;
const EditLabel = styled_components_1.default.div `
  font-size: 12px;
  margin-right: 8px;
`;
const PostedAt = (0, styled_components_1.default)(MessagePostedAt_1.MessagePostedAt) `
  margin-right: 0px;
`;
const ContentContainer = styled_components_1.default.div `
  position: relative;
`;
const Content = styled_components_1.default.p `
  margin: 0 0 1px;
  border: 1px solid #222222;
  padding: 17px 14px 17px 8px;
  border-radius: 10px;
  position: relative;
  background-color: #fff;
  line-height: 22px;
  white-space: pre-wrap;

  &:before {
    content: "";
    position: absolute;
    top: -1px;
    left: 13px;
    width: 5px;
    height: 2px;
    background-color: #fff;
  }

  &:after {
    content: url("${() => comment_horn_svg_1.default}");
    position: absolute;
    top: -16px;
    left: 12px;
  }
`;
const ReactionRegisterPopupCommentWrapper = styled_components_1.default.div `
  position: absolute;
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  transition: visibility 0.1s, opacity 0.1s;
  z-index: 1;
  right: -4px;
  bottom: -32px;
`;
//# sourceMappingURL=CommentItem.js.map