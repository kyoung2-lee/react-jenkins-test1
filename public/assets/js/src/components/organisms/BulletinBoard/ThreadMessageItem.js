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
exports.ThreadMessageItem = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const hooks_1 = require("../../../store/hooks");
const ThreadTag_1 = require("./ThreadTag");
const MessagePostedAt_1 = require("./MessagePostedAt");
const PostUser_1 = require("./PostUser");
const Attachment_1 = require("./Attachment");
const Content_1 = require("./Content");
const bulletinBoardAddressModal_1 = require("../../../reducers/bulletinBoardAddressModal");
const ThreadActionMenu_1 = require("./ThreadActionMenu");
const HyperLinkedText_1 = __importDefault(require("../../atoms/HyperLinkedText"));
const ReactionButtonList_1 = require("./ReactionButtonList");
const Component = ({ thread, archiveFlg, onDownloadThreadFile, onDelete, onClickThreadReactionButton: onClickReactionButton, editing, clearCommentStorage, toggleActionMenu, isVisibleReactionDetailPopup, setIsVisibleReactionDetailPopup, }) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const { thread: item, jstFlg } = thread;
    const { postUser } = item;
    const handleClickReaction = (0, react_1.useCallback)((racType) => {
        const isAlreadyReactioned = item.bbRacList.some((bbRacItem) => {
            if (bbRacItem.racType !== racType) {
                return false;
            }
            return bbRacItem.racUser.some((racUserItem) => racUserItem.userId === jobAuth.user.userId);
        });
        onClickReactionButton({
            bbId: item.bbId,
            funcType: isAlreadyReactioned ? 2 : 1,
            racType,
        });
    }, [item, jobAuth, onClickReactionButton]);
    const openAddressModal = () => {
        dispatch((0, bulletinBoardAddressModal_1.openBulletinBoardAddressModal)({ jobCodes: item.jobCdList }));
    };
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(Header, null,
            item.editFlg && react_1.default.createElement(EditLabel, null, "*Edited*"),
            react_1.default.createElement(MessagePostedAt_1.MessagePostedAt, { value: item.updateTime, jstFlg: jstFlg }),
            react_1.default.createElement(ThreadActionMenu_1.ThreadActionMenu, { bbId: item.bbId, postUserJobCd: postUser.jobCd, onDelete: onDelete, editing: editing, archiveFlg: archiveFlg, canEditOrShare: true, clearCommentStorage: clearCommentStorage, toggleActionMenu: toggleActionMenu })),
        react_1.default.createElement(PostUser_1.PostUser, { userId: postUser.userId, appleId: postUser.appleId, onAddressClick: openAddressModal, avatar: postUser.profileTmbImg, group: postUser.jobCd, usernameWithNumber: `${postUser.userId} ${postUser.firstName} ${postUser.familyName}` }),
        react_1.default.createElement(Body, null,
            react_1.default.createElement(ThreadTitle, null, item.bbTitle),
            react_1.default.createElement(TagContainer, null, item.catCdList.map((tag, i) => (
            // eslint-disable-next-line react/no-array-index-key
            react_1.default.createElement(TagCol, { key: `${tag}-${i}` },
                react_1.default.createElement(ThreadTag_1.ThreadTag, { text: tag }))))),
            react_1.default.createElement(Content_1.Content, null,
                react_1.default.createElement(HyperLinkedText_1.default, null, item.bbText)),
            react_1.default.createElement(Attachment_1.Attachment, { items: item.bbFileList, onDownloadThreadFile: onDownloadThreadFile }),
            react_1.default.createElement(ReactionButtonListWrapper, null,
                react_1.default.createElement(ReactionButtonList_1.ReactionButtonList, { popupTargetType: "thread", reactionList: item.bbRacList, onClickReaction: handleClickReaction, isButtonActive: !archiveFlg, isVisibleReactionDetailPopup: isVisibleReactionDetailPopup, setIsVisibleReactionDetailPopup: setIsVisibleReactionDetailPopup })))));
};
exports.ThreadMessageItem = (0, react_redux_1.connect)(null)(Component);
const Container = styled_components_1.default.div `
  padding: 34px 17px 14px;
`;
const Header = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 3px;
`;
const ThreadTitle = styled_components_1.default.div `
  flex: 1;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 17px;
`;
const TagContainer = styled_components_1.default.div `
  display: flex;
  margin: 0 -2px 8px;
`;
const TagCol = styled_components_1.default.div `
  padding: 0 2px;
`;
const EditLabel = styled_components_1.default.div `
  font-size: 13px;
  margin-right: 8px;
`;
const Body = styled_components_1.default.div `
  margin-left: 10px;
`;
const ReactionButtonListWrapper = styled_components_1.default.div `
  padding-top: 100px;
  padding-bottom: 34px;
`;
//# sourceMappingURL=ThreadMessageItem.js.map