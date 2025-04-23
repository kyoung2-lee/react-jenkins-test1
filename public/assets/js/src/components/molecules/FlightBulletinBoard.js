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
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const webApi_1 = require("../../lib/webApi");
const notifications_1 = require("../../lib/notifications");
const soalaMessages_1 = require("../../lib/soalaMessages");
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const BulletinBoardThreadMini_1 = require("./BulletinBoardThreadMini");
const ThreadListHorizontal_1 = __importDefault(require("./ThreadListHorizontal"));
// import { fetchFlightThread, fetchFlightThreads } from "../../reducers/flightBulletinBoard";
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const RoundButtonReload_1 = __importDefault(require("../atoms/RoundButtonReload"));
const BulletinBoardResourceOperator_1 = require("../../lib/BulletinBoardResourceOperator");
const ResponseEditorModal_1 = require("../organisms/BulletinBoard/ResponseEditorModal");
const FlightBulletinBoard = (props) => {
    const { dispatch } = props;
    const messageAreaRef = (0, react_1.useRef)(null);
    const threadRef = (0, react_1.useRef)(null);
    const [threadStorage, setThreadStorage] = (0, react_1.useState)({});
    const resourceOperator = new BulletinBoardResourceOperator_1.BulletinBoardResourceOperator({ dispatch });
    const prevBulletinBoard = (0, hooks_1.usePrevious)(props.bulletinBoard);
    const editing = (0, react_1.useCallback)(() => {
        const { currentBbId } = props.bulletinBoard;
        if (!currentBbId || !threadStorage[currentBbId]) {
            return false;
        }
        const { selectedComment } = threadStorage[currentBbId];
        let initialComment = selectedComment ? selectedComment.cmtText : undefined;
        if (initialComment === undefined) {
            initialComment = "";
        }
        return threadStorage[currentBbId].comment !== initialComment;
    }, [props.bulletinBoard, threadStorage]);
    (0, react_1.useEffect)(() => {
        // リロード時のスクロール処理
        if (props.bulletinBoard.isNeedScroll &&
            prevBulletinBoard &&
            prevBulletinBoard.fetchedTimeStamp !== props.bulletinBoard.fetchedTimeStamp &&
            prevBulletinBoard.thread &&
            props.bulletinBoard.thread &&
            prevBulletinBoard.thread.thread.bbId === props.bulletinBoard.thread.thread.bbId) {
            if (threadRef.current && messageAreaRef.current) {
                (0, commonUtil_1.smoothScroll)(messageAreaRef.current, threadRef.current.offsetHeight - messageAreaRef.current.clientHeight / 2, 30);
            }
        }
    }, [props.bulletinBoard, prevBulletinBoard]);
    (0, react_1.useEffect)(() => {
        if (props.setBbEditing && props.isBbEditing !== editing()) {
            props.setBbEditing(editing());
        }
    }, [props, editing]);
    const onStart = () => {
        if (props.bulletinBoard.threads) {
            void dispatch(props.startThread({
                flightKey: props.flightKey,
                flight: props.bulletinBoard.threads.flight,
            }));
        }
    };
    const selectThread = (bbId) => {
        if (!props.bulletinBoard.threads) {
            return;
        }
        const onSelect = () => {
            if (!props.bulletinBoard.threads) {
                return;
            }
            clearCommentStorage();
            void dispatch(props.fetchFlightThread({
                flightKey: props.flightKey,
                bbId,
                connectDbCat: props.bulletinBoard.threads.connectDbCat,
            }));
        };
        if (editing()) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40012C({ onYesButton: onSelect }) });
        }
        else {
            onSelect();
        }
    };
    const fetchThreadFileUrl = async (bbFileId) => {
        const { bulletinBoard: { threads }, } = props;
        if (!threads || !threads.connectDbCat) {
            return undefined;
        }
        try {
            const params = {
                fileId: bbFileId,
                connectDbCat: threads.connectDbCat,
            };
            const response = await webApi_1.WebApi.getBulletinBoardTheadFile(dispatch, params, {
                onForbidden: () => reloadThreadsOnError(),
            });
            return response.data.file;
        }
        catch (err) {
            return undefined;
        }
        return undefined;
    };
    const fetchFlightThread = (bbId, isNeedScroll) => {
        const { flightKey, bulletinBoard: { threads }, } = props;
        if (threads) {
            void dispatch(props.fetchFlightThread({ flightKey, bbId, connectDbCat: threads.connectDbCat, isNeedScroll }));
        }
    };
    const fetchCurrentFlightThread = (isNeedScroll) => {
        const { bulletinBoard: { currentBbId }, } = props;
        if (currentBbId !== null && currentBbId !== undefined) {
            fetchFlightThread(currentBbId, isNeedScroll);
        }
    };
    const reloadThreadsOnError = () => {
        const { flightKey, bulletinBoard: { currentBbId }, fetchFlightThreadsDetailless, closeBulletinBoardResponseModal, } = props;
        if (currentBbId !== null && currentBbId !== undefined) {
            unselectComment(currentBbId);
        }
        dispatch(closeBulletinBoardResponseModal());
        void dispatch(fetchFlightThreadsDetailless({ flightKey }));
    };
    const deleteComment = async (cmtId) => {
        const { bulletinBoard: { currentBbId }, } = props;
        const reloadThreadByDeleteComment = () => {
            if (currentBbId !== null && currentBbId !== undefined && !!threadStorage[currentBbId]) {
                const { selectedComment } = threadStorage[currentBbId];
                if (selectedComment && selectedComment.cmtId === cmtId) {
                    unselectComment(currentBbId);
                }
            }
            fetchCurrentFlightThread(false);
        };
        try {
            await resourceOperator.deleteComment(cmtId, {
                onForbidden: () => reloadThreadsOnError(),
                onNotFoundThread: () => reloadThreadsOnError(),
                onNotFoundComment: () => reloadThreadByDeleteComment(),
            });
            reloadThreadByDeleteComment();
        }
        catch (err) {
            //
        }
    };
    const deleteThread = async (bbId) => {
        const { flightKey, fetchFlightThreadsDetailless } = props;
        try {
            await resourceOperator.deleteThread(bbId, {
                onNotFoundThread: () => reloadThreadsOnError(),
            });
            void dispatch(fetchFlightThreadsDetailless({ flightKey }));
        }
        catch (err) {
            // err
        }
    };
    const deleteRes = async (resId) => {
        try {
            await resourceOperator.deleteRes(resId, {
                onNotFoundThread: () => reloadThreadsOnError(),
                onNotFoundRes: () => fetchCurrentFlightThread(false),
            });
            fetchCurrentFlightThread(false);
        }
        catch (err) {
            //
        }
    };
    const createResponse = async (params) => {
        try {
            await resourceOperator.createResponse(params, {
                onForbidden: () => reloadThreadsOnError(),
                onNotFoundThread: () => reloadThreadsOnError(),
            });
            dispatch(props.closeBulletinBoardResponseModal());
            fetchCurrentFlightThread(true);
        }
        catch (err) {
            // err
        }
    };
    const updateResponse = async (params) => {
        const reloadThreadByUpdateRes = () => {
            dispatch(props.closeBulletinBoardResponseModal());
            fetchCurrentFlightThread(false);
        };
        try {
            await resourceOperator.updateResponse(params, {
                onNotFoundThread: () => reloadThreadsOnError(),
                onNotFoundRes: () => reloadThreadByUpdateRes(),
            });
            reloadThreadByUpdateRes();
        }
        catch (err) {
            // err
        }
    };
    const submitComment = async (bbId) => {
        if (!threadStorage[bbId])
            return;
        const { comment, selectedComment } = threadStorage[bbId];
        const selectedBBCmtId = selectedComment ? selectedComment.cmtId : undefined;
        if (!(comment && comment.length > 0))
            return;
        if (selectedBBCmtId) {
            await resourceOperator.updateComment({ bbId, cmtId: selectedBBCmtId, cmtText: comment }, {
                onForbidden: () => reloadThreadsOnError(),
                onNotFoundThread: () => reloadThreadsOnError(),
                onNotFoundComment: () => {
                    unselectComment(bbId);
                    fetchFlightThread(bbId, false);
                },
            });
        }
        else {
            await resourceOperator.createComment({ bbId, cmtText: comment }, {
                onForbidden: () => reloadThreadsOnError(),
                onNotFoundThread: () => reloadThreadsOnError(),
            });
        }
        unselectComment(bbId);
        fetchFlightThread(bbId, !selectedBBCmtId);
    };
    const selectComment = (bbId, bbCmt) => {
        setThreadStorage((prevThreadStorage) => ({
            ...prevThreadStorage,
            [bbId]: {
                ...prevThreadStorage[bbId],
                selectedComment: bbCmt,
                comment: bbCmt.cmtText,
            },
        }));
    };
    const unselectComment = (bbId) => {
        setThreadStorage((prevThreadStorage) => ({
            ...prevThreadStorage,
            [bbId]: {
                ...prevThreadStorage[bbId],
                selectedComment: undefined,
                comment: "",
            },
        }));
    };
    const changeComment = (bbId, comment) => {
        setThreadStorage((prevThreadStorage) => ({
            ...prevThreadStorage,
            [bbId]: {
                ...prevThreadStorage[bbId],
                comment,
            },
        }));
    };
    const handleUnselectComment = (bbId, onNoButton) => {
        if (editing()) {
            notifications_1.NotificationCreator.create({
                dispatch,
                message: soalaMessages_1.SoalaMessage.M40001C({
                    onYesButton: () => unselectComment(bbId),
                    onNoButton,
                }),
            });
        }
        else {
            unselectComment(bbId);
        }
    };
    const commentStorage = () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!threadStorage[props.bulletinBoard.currentBbId])
            return {};
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return threadStorage[props.bulletinBoard.currentBbId];
    };
    const commentProps = () => {
        const storage = commentStorage();
        return { selectedComment: storage.selectedComment, editCommentText: storage.comment };
    };
    const canThreadStart = () => (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateBulletinBoard, props.jobAuth.jobAuth);
    const containingMyBbId = () => {
        const { bulletinBoard: { threads }, jobAuth, } = props;
        return threads && threads.threads.some((thread) => thread.orgnGrpCd === jobAuth.user.grpCd);
    };
    const commentSubmitable = () => {
        const { selectedComment, comment } = commentStorage();
        if (!comment || comment.trim().length === 0)
            return false;
        return !selectedComment || comment !== selectedComment.cmtText;
    };
    const clearCommentStorage = () => setThreadStorage({});
    const handleClickReload = () => {
        const reload = () => {
            clearCommentStorage();
            props.onReload();
        };
        if (editing()) {
            notifications_1.NotificationCreator.create({
                dispatch,
                message: soalaMessages_1.SoalaMessage.M40011C({
                    onYesButton: reload,
                }),
            });
        }
        else {
            reload();
        }
    };
    const { threads, thread, currentBbId } = props.bulletinBoard;
    const { flightKey, isFetching } = props;
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(ResponseEditorModal_1.ResponseEditorModal, { onCreateResponse: (params) => {
                void createResponse(params);
            }, onUpdateResponse: (params) => {
                void updateResponse(params);
            } }),
        threads && react_1.default.createElement(ThreadListHorizontal_1.default, { currentThreadId: currentBbId || undefined, onSelectThread: selectThread, threads: threads }),
        react_1.default.createElement(ThreadContainer, null, canThreadStart() && !currentBbId && !containingMyBbId() ? (react_1.default.createElement(StartContainer, null,
            react_1.default.createElement(StartButton, { text: "Start", onClick: onStart }))) : (thread && (react_1.default.createElement(BulletinBoardThreadMini_1.BulletinBoardThreadMini, { ...commentProps(), flightKey: flightKey, onSelectComment: selectComment, onUnselectComment: handleUnselectComment, onDownloadThreadFile: fetchThreadFileUrl, onSubmitComment: (bbId) => {
                void submitComment(bbId);
            }, onChangeComment: changeComment, onDeleteRes: (resId) => {
                void deleteRes(resId);
            }, onDeleteThread: (bbId) => {
                void deleteThread(bbId);
            }, onDeleteComment: (cmtId) => {
                void deleteComment(cmtId);
            }, thread: thread, archiveFlg: threads ? threads.connectDbCat === "P" : false, editing: editing(), renderMesssageAreaFloatingContent: () => (react_1.default.createElement(ModalReloadButtonContainer, null,
                react_1.default.createElement(RoundButtonReload_1.default, { isFetching: isFetching, disabled: false, onClick: handleClickReload }))), messageAreaRef: messageAreaRef, threadRef: threadRef, handleCloseModal: props.handleCloseModal, commentSubmitable: commentSubmitable(), clearCommentStorage: clearCommentStorage }))))));
};
const Container = styled_components_1.default.div `
  background-color: #abb3bb;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 3px 6px -3px rgba(0, 0, 0, 0.28) inset;
`;
const ThreadContainer = styled_components_1.default.div `
  background-color: #f9f9f9;
  border: 1px solid black;
  border-bottom: none;
  display: flex;
  flex: 1;
  margin: 0 5px;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.28);
  flex-direction: column;
  word-break: break-word;
`;
const StartContainer = styled_components_1.default.div `
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;
const StartButton = (0, styled_components_1.default)(PrimaryButton_1.default) `
  width: auto;
  padding: 4px 24px;
`;
const ModalReloadButtonContainer = styled_components_1.default.div `
  position: absolute;
  right: 10px;
  top: -70px;
  z-index: 1;
`;
exports.default = FlightBulletinBoard;
//# sourceMappingURL=FlightBulletinBoard.js.map