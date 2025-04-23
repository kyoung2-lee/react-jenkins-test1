"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileMessageModal = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const react_modal_1 = __importDefault(require("react-modal"));
const hooks_1 = require("../../../store/hooks");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const layoutStyle_1 = __importDefault(require("../../../styles/layoutStyle"));
const BulletinBoardThread_1 = require("../../molecules/BulletinBoardThread");
const CloseButton_1 = __importDefault(require("../../atoms/CloseButton"));
const RoundButtonReload_1 = __importDefault(require("../../atoms/RoundButtonReload"));
const Component = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const close = () => props.editing
        ? dispatch(props.showMessage({
            message: soalaMessages_1.SoalaMessage.M40012C({
                onYesButton: props.onUnSetCurrentThread,
            }),
        }))
        : props.onUnSetCurrentThread();
    const { thread, archiveFlg, onDownloadThreadFile, onChangeComment, onSubmitComment, onUnselectComment, onSelectComment, selectedComment, editCommentText, onDeleteComment, onDeleteThread, onDeleteRes, onReload, reloading, editing, messageAreaRef, threadRef, commentSubmitable, clearCommentStorage, } = props;
    return (react_1.default.createElement(Container, { isOpen: !!thread, style: {
            overlay: {
                bottom: `calc(${layoutStyle_1.default.footer.mobile} + ${layoutStyle_1.default.header.statusBar})`,
                background: "transparent",
            },
        }, closeTimeoutMS: 300 },
        react_1.default.createElement(Inner, null,
            react_1.default.createElement(Header, null,
                react_1.default.createElement(Title, null, thread && thread.thread.bbTitle),
                react_1.default.createElement(StyledCloseButton, { onClick: () => {
                        void close();
                    } })),
            react_1.default.createElement(Content, null, thread && (react_1.default.createElement(BulletinBoardThread_1.BulletinBoardThread, { archiveFlg: archiveFlg, onDownloadThreadFile: onDownloadThreadFile, onDeleteRes: onDeleteRes, onDeleteThread: onDeleteThread, onDeleteComment: onDeleteComment, onChangeComment: onChangeComment, onSubmitComment: onSubmitComment, onUnselectComment: onUnselectComment, onSelectComment: onSelectComment, selectedComment: selectedComment, editCommentText: editCommentText, editing: editing, messageAreaRef: messageAreaRef, threadRef: threadRef, renderMesssageAreaFloatingContent: () => react_1.default.createElement(ReloadButton, { onClick: onReload, isFetching: reloading, disabled: false }), commentSubmitable: commentSubmitable, clearCommentStorage: clearCommentStorage }))))));
};
exports.MobileMessageModal = (0, react_redux_1.connect)((state) => ({
    reloading: state.bulletinBoard.isFetchingThreads || state.bulletinBoard.isFetchingThread,
}))(Component);
const Container = (0, styled_components_1.default)(react_modal_1.default) `
  opacity: 0;
  position: absolute;
  top: 100vh;
  height: 100%;
  z-index: 100;
  transition: all 300ms;
  width: 100%;
  box-shadow: 0 -5px 8px rgba(0, 0, 0, 0.2);

  &.ReactModal__Content--after-open {
    opacity: 1;
    top: ${(props) => props.theme.layout.header.statusBar};
  }

  &.ReactModal__Content--before-close {
    opacity: 0;
    top: 100vh;
  }
`;
const ReloadButton = (0, styled_components_1.default)(RoundButtonReload_1.default) `
  position: absolute;
  right: 15px;
  top: -60px;
`;
const Inner = styled_components_1.default.article `
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Content = styled_components_1.default.div `
  flex: 1;
  background-color: #f6f6f6;
  display: flex;
  padding: 8px;
`;
const Header = styled_components_1.default.header `
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  height: 40px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled_components_1.default.h1 `
  color: ${(props) => props.theme.color.WHITE};
  margin: 0;
  font-size: 20px;
  font-weight: normal;
  line-height: 31px;
  white-space: nowrap;
  padding: 0 60px 0 40px;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const StyledCloseButton = (0, styled_components_1.default)(CloseButton_1.default) `
  width: 25px;
  height: 25px;
  padding: 0;
  top: auto;
  right: 15px;
`;
//# sourceMappingURL=MobileMessageModal.js.map