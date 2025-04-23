"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletinBoardMobile = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const MobileThreadPane_1 = require("./MobileThreadPane");
const MobileMessageModal_1 = require("./MobileMessageModal");
const BulletinBoardMobile = (props) => (react_1.default.createElement(Container, null,
    react_1.default.createElement(MobileThreadPane_1.MobileThreadPane, { filtering: props.filtering, onChangeFilterString: props.onChangeFilterString, onOpenFilterModal: props.onOpenFilterModal, onSubmitFilter: props.onSubmitFilter, searchStringParam: props.searchStringParam, threads: props.threads, currentThreadId: props.currentThreadId, onSelectThread: props.onSelectThread, editing: props.editing, jstFlg: !!props.thread && props.thread.jstFlg }),
    react_1.default.createElement(MobileMessageModal_1.MobileMessageModal, { archiveFlg: props.threads ? props.threads.archiveFlg : false, onReload: props.onReload, thread: props.thread, onUnSetCurrentThread: props.onUnSetCurrentThread, onDownloadThreadFile: props.onDownloadThreadFile, onDeleteRes: props.onDeleteRes, onDeleteThread: props.onDeleteThread, onDeleteComment: props.onDeleteComment, onChangeComment: props.onChangeComment, onSubmitComment: props.onSubmitComment, onUnselectComment: props.onUnselectComment, onSelectComment: props.onSelectComment, selectedComment: props.selectedComment, editCommentText: props.editCommentText, editing: props.editing, messageAreaRef: props.messageAreaRef, threadRef: props.threadRef, commentSubmitable: props.commentSubmitable, clearCommentStorage: props.clearCommentStorage, showMessage: props.showMessage })));
exports.BulletinBoardMobile = BulletinBoardMobile;
const Container = styled_components_1.default.div `
  display: flex;
  flex: 1;
  height: 100%;
`;
//# sourceMappingURL=BulletinBoardMobile.js.map