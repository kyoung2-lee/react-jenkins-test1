"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletinBoardPC = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const MessagePane_1 = require("./MessagePane");
const ThreadPane_1 = require("./ThreadPane");
const BulletinBoardPC = (props) => (react_1.default.createElement(Container, null,
    react_1.default.createElement(ThreadPane_1.ThreadPane, { filtering: props.filtering, onChangeFilterString: props.onChangeFilterString, onOpenFilterModal: props.onOpenFilterModal, onSubmitFilter: props.onSubmitFilter, searchStringParam: props.searchStringParam, threads: props.threads, currentThreadId: props.currentThreadId, onSelectThread: props.onSelectThread, editing: props.editing, jstFlg: !!props.thread && props.thread.jstFlg }),
    react_1.default.createElement(MessagePane_1.MessagePane, { archiveFlg: props.threads ? props.threads.archiveFlg : false, timeLcl: props.timeLcl, timeDiffUtc: props.timeDiffUtc, onDownloadThreadFile: props.onDownloadThreadFile, onDeleteRes: props.onDeleteRes, onDeleteThread: props.onDeleteThread, onDeleteComment: props.onDeleteComment, onChangeComment: props.onChangeComment, onSubmitComment: props.onSubmitComment, onUnselectComment: props.onUnselectComment, onSelectComment: props.onSelectComment, selectedComment: props.selectedComment, editCommentText: props.editCommentText, thread: props.thread, onReload: props.onReload, myApoCd: props.myApoCd, editing: props.editing, messageAreaRef: props.messageAreaRef, threadRef: props.threadRef, commentSubmitable: props.commentSubmitable, clearCommentStorage: props.clearCommentStorage })));
exports.BulletinBoardPC = BulletinBoardPC;
const Container = styled_components_1.default.div `
  display: flex;
  flex: 1;
  height: 100%;
  max-width: 1366px;
  margin: auto;
`;
//# sourceMappingURL=BulletinBoardPC.js.map