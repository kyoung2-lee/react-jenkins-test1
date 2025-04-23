"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagePane = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const commonUtil_1 = require("../../../lib/commonUtil");
const RoundButtonReload_1 = __importDefault(require("../../atoms/RoundButtonReload"));
const BulletinBoardThread_1 = require("../../molecules/BulletinBoardThread");
const Component = (props) => {
    const { thread, onReload, reloading, onDownloadThreadFile, onChangeComment, onSubmitComment, onUnselectComment, onSelectComment, selectedComment, editCommentText, onDeleteComment, onDeleteThread, onDeleteRes, timeLcl, timeDiffUtc, archiveFlg, myApoCd, editing, messageAreaRef, threadRef, commentSubmitable, clearCommentStorage, } = props;
    const parsedTimeLcl = (0, commonUtil_1.parseTimeLcl)({ timeLcl, timeDiffUtc, isLocal: !!myApoCd });
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(PrimaryActionField, null,
            react_1.default.createElement(PrimaryActionFieldCol, null, timeLcl && (react_1.default.createElement(CurrentTime, null,
                parsedTimeLcl.date,
                react_1.default.createElement("br", null),
                parsedTimeLcl.time))),
            react_1.default.createElement(PrimaryActionFieldCol, null,
                react_1.default.createElement(RoundButtonReload_1.default, { scale: 0.8, onClick: onReload, isFetching: reloading, disabled: false }))),
        thread && (react_1.default.createElement(BulletinBoardThread_1.BulletinBoardThread, { archiveFlg: archiveFlg, onDownloadThreadFile: onDownloadThreadFile, onDeleteRes: onDeleteRes, onDeleteThread: onDeleteThread, onDeleteComment: onDeleteComment, onChangeComment: onChangeComment, onSubmitComment: onSubmitComment, onUnselectComment: onUnselectComment, onSelectComment: onSelectComment, selectedComment: selectedComment, editCommentText: editCommentText, editing: editing, messageAreaRef: messageAreaRef, threadRef: threadRef, commentSubmitable: commentSubmitable, clearCommentStorage: clearCommentStorage }))));
};
exports.MessagePane = (0, react_redux_1.connect)((state) => ({
    reloading: state.bulletinBoard.isFetchingThreads || state.bulletinBoard.isFetchingThread,
}))(Component);
const Container = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0px 10px 10px 0px;
  max-width: 975px;
`;
const PrimaryActionField = styled_components_1.default.div `
  display: flex;
  height: 60px;
  padding: 5px 10px;
  align-items: center;
  justify-content: flex-end;
`;
const PrimaryActionFieldCol = styled_components_1.default.div ``;
const CurrentTime = styled_components_1.default.div `
  margin-right: 8px;
  font-size: 14px;
`;
//# sourceMappingURL=MessagePane.js.map