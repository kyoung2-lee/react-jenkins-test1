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
exports.BulletinBoardCommentInput = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const CommentInput_1 = require("../organisms/BulletinBoard/CommentInput");
const storage_1 = require("../../lib/storage");
const icon_close_svg_1 = __importDefault(require("../../assets/images/icon/icon-close.svg"));
const hooks_1 = require("../../store/hooks");
const BulletinBoardCommentInput = (props) => {
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const textAreaRef = (0, react_1.useRef)(null);
    const profileImg = (0, react_1.useRef)(props.selectedComment
        ? `data:image/png;base64,${props.selectedComment.postUser.profileTmbImg}`
        : jobAuth.user.profileImg
            ? `data:image/png;base64,${jobAuth.user.profileImg}`
            : "");
    const clear = () => {
        const onNoButton = () => {
            var _a;
            (_a = textAreaRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        };
        props.onUnselectComment(props.bbId, onNoButton);
    };
    const isEdit = () => props.selectedComment && props.selectedComment.updateTime;
    const { isIphone } = storage_1.storage;
    return (react_1.default.createElement(Container, { isMini: props.isMini },
        isEdit() && (react_1.default.createElement(EditActionContainer, null,
            react_1.default.createElement(CloseIcon, { onClick: clear }))),
        react_1.default.createElement(Content, { isMini: props.isMini, isIphone: isIphone },
            react_1.default.createElement(ContentWrapper, null,
                react_1.default.createElement(CommentInput_1.CommentInput
                // eslint-disable-next-line no-return-assign
                , { 
                    // eslint-disable-next-line no-return-assign
                    setTextAreaRef: (e) => (textAreaRef.current = e), bbId: props.bbId, selectedBBCmtId: props.selectedComment ? props.selectedComment.cmtId : undefined, onSubmit: props.onSubmitComment, onChangeText: props.onChangeComment, text: props.editCommentText || "", updateTime: props.selectedComment ? props.selectedComment.updateTime : "", submitable: props.commentSubmitable, disabled: props.disabled, profileImg: profileImg.current }),
                isEdit() && (react_1.default.createElement(MetaContainer, null,
                    props.selectedComment && props.selectedComment.editFlg && react_1.default.createElement(EditLabel, null, "*Edited*"),
                    props.selectedComment ? react_1.default.createElement(UpdateTime, null, props.selectedComment.updateTime) : null)))),
        props.renderMesssageAreaFloatingContent && props.renderMesssageAreaFloatingContent()));
};
exports.BulletinBoardCommentInput = BulletinBoardCommentInput;
const Container = styled_components_1.default.div `
  ${(props) => props.isMini && "margin: 0 -6px; background: #fff;"};
  padding: 12px;
  min-height: 60px;
  border: 1px solid #c9d3d0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.22);
`;
const ContentWrapper = styled_components_1.default.div `
  width: 100%;
`;
const Content = styled_components_1.default.div `
  display: flex;
  width: 100%;
  flex: 1;
  padding: ${(props) => (props.isMini || props.isIphone ? "0" : "0 3px")};
  align-items: center;
  max-width: 613px;
  justify-content: center;
`;
const MetaContainer = styled_components_1.default.div `
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  margin-right: 35px;
`;
const EditLabel = styled_components_1.default.div `
  font-size: 12px;
  margin-right: 8px;
`;
const UpdateTime = styled_components_1.default.div `
  font-size: 13px;
`;
const CloseIcon = styled_components_1.default.img.attrs({ src: icon_close_svg_1.default }) `
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
const EditActionContainer = styled_components_1.default.div `
  padding-bottom: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
//# sourceMappingURL=BulletinBoardCommentInput.js.map