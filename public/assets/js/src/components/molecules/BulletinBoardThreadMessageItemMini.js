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
exports.BulletinBoardThreadMessageItemMini = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const ThreadTag_1 = require("../organisms/BulletinBoard/ThreadTag");
const MessagePostedAt_1 = require("../organisms/BulletinBoard/MessagePostedAt");
const PostUser_1 = require("../organisms/BulletinBoard/PostUser");
const Attachment_1 = require("../organisms/BulletinBoard/Attachment");
const Content_1 = require("../organisms/BulletinBoard/Content");
const ThreadActionMenu_1 = require("../organisms/BulletinBoard/ThreadActionMenu");
const ReactionButtonList_1 = require("../organisms/BulletinBoard/ReactionButtonList");
const bulletinBoardAddressModal_1 = require("../../reducers/bulletinBoardAddressModal");
const HyperLinkedText_1 = __importDefault(require("../atoms/HyperLinkedText"));
const hooks_1 = require("../../store/hooks");
const Component = ({ thread, onDelete, onDownloadThreadFile, onClickThreadReactionButton, archiveFlg, 
// eslint-disable-next-line @typescript-eslint/no-shadow
openBulletinBoardAddressModal, editing, handleCloseModal, clearCommentStorage, toggleActionMenu, isVisibleReactionDetailPopup, setIsVisibleReactionDetailPopup, }) => {
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const { thread: item } = thread;
    const { postUser } = item;
    const handleClickReaction = (0, react_1.useCallback)((racType) => {
        const isAlreadyReactioned = item.bbRacList.some((bbRacItem) => {
            if (bbRacItem.racType !== racType) {
                return false;
            }
            return bbRacItem.racUser.some((racUserItem) => racUserItem.userId === jobAuth.user.userId);
        });
        onClickThreadReactionButton({
            bbId: item.bbId,
            funcType: isAlreadyReactioned ? 2 : 1,
            racType,
        });
    }, [item, jobAuth, onClickThreadReactionButton]);
    const openAddressModal = () => {
        openBulletinBoardAddressModal({ jobCodes: item.jobCdList });
    };
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(Header, null,
            react_1.default.createElement(HeaderSpace, null),
            item.editFlg && react_1.default.createElement(EditLabel, null, "*Edited*"),
            react_1.default.createElement(MessagePostedAt_1.MessagePostedAt, { value: item.updateTime, jstFlg: thread.jstFlg }),
            react_1.default.createElement(ThreadActionMenu_1.ThreadActionMenu, { bbId: item.bbId, postUserJobCd: postUser.jobCd, onDelete: onDelete, editing: editing, archiveFlg: archiveFlg, handleCloseModal: handleCloseModal, canEditOrShare: false, clearCommentStorage: clearCommentStorage, toggleActionMenu: toggleActionMenu })),
        react_1.default.createElement(PostUser_1.PostUser, { userId: postUser.userId, appleId: postUser.appleId, avatar: postUser.profileTmbImg, onAddressClick: openAddressModal, group: postUser.jobCd, usernameWithNumber: `${postUser.userId} ${postUser.firstName} ${postUser.familyName}` }),
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
exports.BulletinBoardThreadMessageItemMini = (0, react_redux_1.connect)(null, (dispatch) => (0, redux_1.bindActionCreators)({ openBulletinBoardAddressModal: bulletinBoardAddressModal_1.openBulletinBoardAddressModal }, dispatch))(Component);
const Container = styled_components_1.default.div `
  padding: 31px 10px 0;
`;
const Header = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const EditLabel = styled_components_1.default.div `
  font-size: 13px;
  margin-right: 8px;
`;
const Body = styled_components_1.default.div `
  margin-left: 10px;
`;
const ThreadTitle = styled_components_1.default.div `
  flex: 1;
  font-weight: bold;
  margin: 0 0 10px;
  font-size: 17px;
`;
const HeaderSpace = styled_components_1.default.div `
  flex: 1;
`;
const TagContainer = styled_components_1.default.div `
  display: flex;
  margin: 0 -2px 10px;
`;
const TagCol = styled_components_1.default.div `
  padding: 0 2px;
`;
const ReactionButtonListWrapper = styled_components_1.default.div `
  padding-top: 100px;
  padding-bottom: 34px;
`;
//# sourceMappingURL=BulletinBoardThreadMessageItemMini.js.map