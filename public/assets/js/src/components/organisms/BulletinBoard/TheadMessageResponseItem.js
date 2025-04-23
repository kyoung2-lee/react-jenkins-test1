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
exports.TheadMessageResponseItem = exports.Component = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const MessagePostedAt_1 = require("./MessagePostedAt");
const PostUser_1 = require("./PostUser");
const Content_1 = require("./Content");
const ActionMenu_1 = require("./ActionMenu");
const hooks_1 = require("../../../store/hooks");
const bulletinBoardResponseEditorModal_1 = require("../../../reducers/bulletinBoardResponseEditorModal");
const commonUtil_1 = require("../../../lib/commonUtil");
const commonConst_1 = require("../../../lib/commonConst");
const HyperLinkedText_1 = __importDefault(require("../../atoms/HyperLinkedText"));
const ReactionButtonList_1 = require("./ReactionButtonList");
const Component = ({ bbId, response, jobAuth, onDelete, onClickResponseReactionButton: onClickReactionButton, archiveFlg, editing, clearCommentStorage, toggleActionMenu, jstFlg, isVisibleReactionDetailPopup, setIsVisibleReactionDetailPopup, }) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const { postUser } = response;
    const edit = () => {
        dispatch((0, bulletinBoardResponseEditorModal_1.openBulletinBoardResponseModal)({
            bbId,
            response: {
                id: response.resId,
                title: response.resTitle,
                text: response.resText,
            },
        }));
    };
    const deleteRes = () => {
        onDelete(response.resId);
    };
    const editable = () => (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateBulletinBoardRes, jobAuth.jobAuth) && response.postUser.jobCd === jobAuth.user.jobCd && !archiveFlg;
    const actions = [
        ...(editable()
            ? [
                { title: "Edit", onClick: edit },
                { title: "Delete", onClick: deleteRes },
            ]
            : []),
    ];
    const handleClickReaction = (0, react_1.useCallback)((racType) => {
        const isAlreadyReactioned = response.bbResRacList.some((bbResRacItem) => {
            if (bbResRacItem.racType !== racType) {
                return false;
            }
            return bbResRacItem.racUser.some((racUserItem) => racUserItem.userId === jobAuth.user.userId);
        });
        onClickReactionButton({
            resId: response.resId,
            funcType: isAlreadyReactioned ? 2 : 1,
            racType,
        });
    }, [response, jobAuth, onClickReactionButton]);
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(Header, null,
            react_1.default.createElement(ThreadTitle, null,
                "Res. #",
                response.resNumber),
            response.editFlg && react_1.default.createElement(EditLabel, null, "*Edited*"),
            react_1.default.createElement(MessagePostedAt_1.MessagePostedAt, { value: response.updateTime, jstFlg: jstFlg }),
            actions.length > 0 && (react_1.default.createElement(ActionMenu_1.ActionMenu, { actions: actions, editing: editing, clearCommentStorage: clearCommentStorage, toggleActionMenu: toggleActionMenu }))),
        react_1.default.createElement(PostUser_1.PostUser, { userId: postUser.userId, appleId: postUser.appleId, avatar: postUser.profileTmbImg, group: postUser.jobCd, usernameWithNumber: `${postUser.userId} ${postUser.firstName} ${postUser.familyName}` }),
        react_1.default.createElement(Body, null,
            react_1.default.createElement(AdditionalSubject, null, response.resTitle),
            react_1.default.createElement(Content_1.Content, null,
                react_1.default.createElement(HyperLinkedText_1.default, null, response.resText))),
        react_1.default.createElement(ReactionButtonListContainer, null,
            react_1.default.createElement(ReactionButtonList_1.ReactionButtonList, { popupTargetType: "response", reactionList: response.bbResRacList, onClickReaction: handleClickReaction, isButtonActive: !archiveFlg, isVisibleReactionDetailPopup: isVisibleReactionDetailPopup, setIsVisibleReactionDetailPopup: setIsVisibleReactionDetailPopup }))));
};
exports.Component = Component;
exports.TheadMessageResponseItem = (0, react_redux_1.connect)((state) => ({
    jobAuth: state.account.jobAuth,
}))(exports.Component);
const Container = styled_components_1.default.div `
  padding: 20px 10px;
  background-color: #f0f1f3;
`;
const Header = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const ThreadTitle = styled_components_1.default.div `
  flex: 1;
  font-size: 14px;
`;
const AdditionalSubject = styled_components_1.default.p `
  padding-right: 10px;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 17px;
`;
const EditLabel = styled_components_1.default.div `
  font-size: 13px;
  margin-right: 8px;
`;
const Body = styled_components_1.default.div `
  margin-left: 10px;
`;
const ReactionButtonListContainer = styled_components_1.default.div `
  padding-top: 8px;
`;
//# sourceMappingURL=TheadMessageResponseItem.js.map