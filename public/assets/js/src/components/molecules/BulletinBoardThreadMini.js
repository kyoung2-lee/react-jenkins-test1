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
exports.BulletinBoardThreadMini = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const BulletinBoardThreadMessageItemMini_1 = require("./BulletinBoardThreadMessageItemMini");
const ReactionRegisterList_1 = require("../organisms/BulletinBoard/ReactionRegisterList");
const TheadMessageResponseItem_1 = require("../organisms/BulletinBoard/TheadMessageResponseItem");
const CommentItem_1 = require("../organisms/BulletinBoard/CommentItem");
const BulletinBoardCommentInput_1 = require("./BulletinBoardCommentInput");
const hooks_1 = require("../../store/hooks");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const bulletinBoardReactionRegistPopup_1 = require("../../reducers/bulletinBoardReactionRegistPopup");
const flightContentsBulletinBoard_1 = require("../../reducers/flightContentsBulletinBoard");
const BulletinBoardThreadMini = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const registPopupStatus = (0, hooks_1.useAppSelector)((state) => state.bulletinBoardReactionRegistPopup);
    const { flightKey, thread } = props;
    const containerRef = (0, react_1.createRef)();
    const threadMessageRef = (0, react_1.createRef)();
    const threadResponseRefList = (0, react_1.useRef)([]);
    const threadCommentRefList = (0, react_1.useRef)([]);
    const timeoutLongTapThreadMessage = (0, react_1.useRef)(null);
    const timeoutLongTapThreadResponse = (0, react_1.useRef)(null);
    const timeoutLongTapComment = (0, react_1.useRef)(null);
    const [isOpenActionMenu, setIsOpenActionMenu] = (0, react_1.useState)(false);
    const [, setLongTapTriggered] = (0, react_1.useState)(false);
    // スレッド表示部分の上端がスクロール部分からはみ出している場合、スクロール部分の最上部にポップアップを表示する制御のために使用する
    const [isVisibleScreenRegisterPopup, setIsVisibleScreenRegisterPopup] = (0, react_1.useState)(false);
    // スレッド表示部分の上端がスクロール部分の上端より下にある場合、スレッド表示部分の最上部にポップアップを表示する制御のために使用する
    // （スレッド表示部分の上端は通常スクロール部分の上端より上に来るため、この値は通常では使われない）
    const [isVisibleThreadRegisterPopup, setIsVisibleThreadRegisterPopup] = (0, react_1.useState)(false);
    const [isVisibleResponseRegisterPopupMap, setIsVisibleResponseRegisterPopupMap] = (0, react_1.useState)({});
    const [isVisibleCommentRegisterPopupMap, setIsVisibleCommentRegisterPopupMap] = (0, react_1.useState)({});
    const [isVisibleThreadDetailPopup, setIsVisibleThreadDetailPopup] = (0, react_1.useState)(false);
    const [isVisibleResponseDetailPopupMap, setIsVisibleResponseDetailPopupMap] = (0, react_1.useState)({});
    const [isVisibleCommentDetailPopupMap, setIsVisibleCommentDetailPopupMap] = (0, react_1.useState)({});
    // スマホ・タブレットでのスクロール量を取得するために使用する
    const [prevScrollTop, setPrevScrollTop] = (0, react_1.useState)(0);
    const [totalScroll, setTotalScroll] = (0, react_1.useState)(0);
    const reactionRegisterPopupScreenStyle = (0, react_1.useMemo)(() => {
        if (registPopupStatus.popupTargetType === "thread") {
            return { top: -4, left: 10, right: "unset" };
        }
        if (registPopupStatus.popupTargetType === "response") {
            return { top: -30, left: 10, right: "unset" };
        }
        if (registPopupStatus.popupTargetType === "comment") {
            return { top: -95, left: "unset", right: 6 };
        }
        return {};
    }, [registPopupStatus]);
    const setIsVisibleResponseDetailPopup = (0, react_1.useCallback)((responseIndex, isVisible) => {
        setIsVisibleResponseDetailPopupMap((originalMap) => Array.from({ length: thread.thread.bbResList.length }, (_, i) => i).reduce((acc, item) => {
            var _a;
            return ({
                ...acc,
                [item]: item === responseIndex ? isVisible : (_a = originalMap[item]) !== null && _a !== void 0 ? _a : false,
            });
        }, {}));
    }, [thread.thread.bbResList.length]);
    const setIsVisibleCommentDetailPopup = (0, react_1.useCallback)((commentIndex, isVisible) => {
        setIsVisibleCommentDetailPopupMap((originalMap) => Array.from({ length: thread.thread.bbCmtList.length }, (_, i) => i).reduce((acc, item) => {
            var _a;
            return ({
                ...acc,
                [item]: item === commentIndex ? isVisible : (_a = originalMap[item]) !== null && _a !== void 0 ? _a : false,
            });
        }, {}));
    }, [thread.thread.bbCmtList.length]);
    // 別スレッドを読み込んだ際、スクロール位置をそのスレッドの一番上に合わせる
    (0, react_1.useEffect)(() => {
        const { messageAreaRef } = props;
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTo({ top: 0 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thread.thread.bbId]);
    const closeAllReactionRegisterPopup = (0, react_1.useCallback)(() => {
        setIsVisibleScreenRegisterPopup(false);
        setIsVisibleThreadRegisterPopup(false);
        setIsVisibleResponseRegisterPopupMap((originalMap) => Object.entries(originalMap).reduce((acc, [key]) => ({ ...acc, [Number(key)]: false }), {}));
        setIsVisibleCommentRegisterPopupMap((originalMap) => Object.entries(originalMap).reduce((acc, [key]) => ({ ...acc, [Number(key)]: false }), {}));
        setIsVisibleThreadDetailPopup(false);
        setIsVisibleResponseDetailPopupMap((originalMap) => Object.entries(originalMap).reduce((acc, [key]) => ({ ...acc, [Number(key)]: false }), {}));
        setIsVisibleCommentDetailPopupMap((originalMap) => Object.entries(originalMap).reduce((acc, [key]) => ({ ...acc, [Number(key)]: false }), {}));
    }, []);
    const displayThreadMessageRegisterPopup = (0, react_1.useCallback)(() => {
        var _a, _b, _c, _d;
        const scrollComponentTop = (_b = (_a = props.messageAreaRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().top) !== null && _b !== void 0 ? _b : 0;
        const threadMessageTop = (_d = (_c = threadMessageRef.current) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect().top) !== null && _d !== void 0 ? _d : 0;
        dispatch((0, bulletinBoardReactionRegistPopup_1.setReactionRegistPopupStatus)({
            popupTargetType: "thread",
            popupTargetId: thread.thread.bbId,
        }));
        if (Math.floor(threadMessageTop) > Math.floor(scrollComponentTop) + 12) {
            setIsVisibleThreadRegisterPopup(true);
            setIsVisibleScreenRegisterPopup(false);
        }
        else {
            setIsVisibleScreenRegisterPopup(true);
            setIsVisibleThreadRegisterPopup(false);
        }
    }, [thread, threadMessageRef, dispatch, props.messageAreaRef]);
    const handleMouseOverThreadMessage = (0, react_1.useCallback)(() => {
        if (!storage_1.storage.isPc || !!props.archiveFlg) {
            return;
        }
        displayThreadMessageRegisterPopup();
    }, [props.archiveFlg, displayThreadMessageRegisterPopup]);
    const handleLongTapThreadMessage = (0, react_1.useCallback)(() => {
        if ((!storage_1.storage.isIpad && !storage_1.storage.isIphone) || !!props.archiveFlg) {
            return;
        }
        displayThreadMessageRegisterPopup();
    }, [props.archiveFlg, displayThreadMessageRegisterPopup]);
    const handleMouseOutThreadMessage = (0, react_1.useCallback)(() => {
        if (!storage_1.storage.isPc || !!props.archiveFlg) {
            return;
        }
        setIsVisibleScreenRegisterPopup(false);
        setIsVisibleThreadRegisterPopup(false);
    }, [props.archiveFlg]);
    const handleTouchStartThreadMessage = (0, react_1.useCallback)((event) => {
        var _a, _b;
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        setPrevScrollTop((_b = (_a = props.messageAreaRef.current) === null || _a === void 0 ? void 0 : _a.scrollTop) !== null && _b !== void 0 ? _b : 0);
        setTotalScroll(0);
        timeoutLongTapThreadMessage.current = setTimeout(() => {
            closeAllReactionRegisterPopup();
            handleLongTapThreadMessage();
            setLongTapTriggered(true);
        }, 600);
        event.stopPropagation();
    }, [closeAllReactionRegisterPopup, handleLongTapThreadMessage, props.messageAreaRef]);
    const handleTouchEndThreadMessage = (0, react_1.useCallback)((event) => {
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        if (timeoutLongTapThreadMessage.current) {
            clearTimeout(timeoutLongTapThreadMessage.current);
        }
        setLongTapTriggered((longTapTriggered) => {
            if (!longTapTriggered) {
                closeAllReactionRegisterPopup();
            }
            return false;
        });
        event.stopPropagation();
    }, [closeAllReactionRegisterPopup]);
    const displayThreadResponseRegisterPopup = (0, react_1.useCallback)((responseIndex) => {
        dispatch((0, bulletinBoardReactionRegistPopup_1.setReactionRegistPopupStatus)({
            popupTargetType: "response",
            popupTargetId: thread.thread.bbResList[responseIndex].resId,
        }));
        setIsVisibleResponseRegisterPopupMap({ [responseIndex]: true });
        setIsVisibleScreenRegisterPopup(false);
    }, [thread, dispatch]);
    const handleMouseOverThreadResponse = (0, react_1.useCallback)((responseIndex) => {
        if (!storage_1.storage.isPc || !!props.archiveFlg) {
            return;
        }
        displayThreadResponseRegisterPopup(responseIndex);
    }, [props.archiveFlg, displayThreadResponseRegisterPopup]);
    const handleLongTapThreadResponse = (0, react_1.useCallback)((responseIndex) => {
        if ((!storage_1.storage.isIpad && !storage_1.storage.isIphone) || !!props.archiveFlg) {
            return;
        }
        displayThreadResponseRegisterPopup(responseIndex);
    }, [props.archiveFlg, displayThreadResponseRegisterPopup]);
    const handleMouseOutThreadResponse = (0, react_1.useCallback)((responseIndex) => {
        if (!storage_1.storage.isPc || !!props.archiveFlg) {
            return;
        }
        setIsVisibleScreenRegisterPopup(false);
        setIsVisibleResponseRegisterPopupMap({ [responseIndex]: false });
    }, [props.archiveFlg]);
    const handleTouchStartThreadResponse = (0, react_1.useCallback)((responseIndex, event) => {
        var _a, _b;
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        setPrevScrollTop((_b = (_a = props.messageAreaRef.current) === null || _a === void 0 ? void 0 : _a.scrollTop) !== null && _b !== void 0 ? _b : 0);
        setTotalScroll(0);
        timeoutLongTapThreadResponse.current = setTimeout(() => {
            closeAllReactionRegisterPopup();
            handleLongTapThreadResponse(responseIndex);
            setLongTapTriggered(true);
        }, 600);
        event.stopPropagation();
    }, [closeAllReactionRegisterPopup, handleLongTapThreadResponse, props.messageAreaRef]);
    const handleTouchEndThreadResponse = (0, react_1.useCallback)((event) => {
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        if (timeoutLongTapThreadResponse.current) {
            clearTimeout(timeoutLongTapThreadResponse.current);
        }
        setLongTapTriggered((longTapTriggered) => {
            if (!longTapTriggered) {
                closeAllReactionRegisterPopup();
            }
            return false;
        });
        event.stopPropagation();
    }, [closeAllReactionRegisterPopup]);
    const displayCommentRegisterPopup = (0, react_1.useCallback)((commentIndex) => {
        dispatch((0, bulletinBoardReactionRegistPopup_1.setReactionRegistPopupStatus)({
            popupTargetType: "comment",
            popupTargetId: thread.thread.bbCmtList[commentIndex].cmtId,
        }));
        setIsVisibleCommentRegisterPopupMap({ [commentIndex]: true });
        setIsVisibleScreenRegisterPopup(false);
    }, [thread, dispatch]);
    const handleMouseOverComment = (0, react_1.useCallback)((commentIndex) => {
        if (!storage_1.storage.isPc || !!props.archiveFlg) {
            return;
        }
        displayCommentRegisterPopup(commentIndex);
    }, [props.archiveFlg, displayCommentRegisterPopup]);
    const handleLongTapComment = (0, react_1.useCallback)((commentIndex) => {
        if ((!storage_1.storage.isIpad && !storage_1.storage.isIphone) || !!props.archiveFlg) {
            return;
        }
        displayCommentRegisterPopup(commentIndex);
    }, [props.archiveFlg, displayCommentRegisterPopup]);
    const handleMouseOutComment = (0, react_1.useCallback)((commentIndex) => {
        if (!storage_1.storage.isPc || !!props.archiveFlg) {
            return;
        }
        setIsVisibleScreenRegisterPopup(false);
        setIsVisibleCommentRegisterPopupMap({ [commentIndex]: false });
    }, [props.archiveFlg]);
    const handleTouchStartComment = (0, react_1.useCallback)((commentIndex, event) => {
        var _a, _b;
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        setPrevScrollTop((_b = (_a = props.messageAreaRef.current) === null || _a === void 0 ? void 0 : _a.scrollTop) !== null && _b !== void 0 ? _b : 0);
        setTotalScroll(0);
        timeoutLongTapComment.current = setTimeout(() => {
            closeAllReactionRegisterPopup();
            handleLongTapComment(commentIndex);
            setLongTapTriggered(true);
        }, 600);
        event.stopPropagation();
    }, [closeAllReactionRegisterPopup, handleLongTapComment, props.messageAreaRef]);
    const handleTouchEndComment = (0, react_1.useCallback)((event) => {
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        if (timeoutLongTapComment.current) {
            clearTimeout(timeoutLongTapComment.current);
        }
        setLongTapTriggered((longTapTriggered) => {
            if (!longTapTriggered) {
                closeAllReactionRegisterPopup();
            }
            return false;
        });
        event.stopPropagation();
    }, [closeAllReactionRegisterPopup]);
    const handleMouseOverScreenPopup = (0, react_1.useCallback)(() => {
        if (props.archiveFlg) {
            return;
        }
        setIsVisibleScreenRegisterPopup(true);
        setIsVisibleThreadRegisterPopup(false);
    }, [props.archiveFlg]);
    const handleMouseOutScreenPopup = (0, react_1.useCallback)(() => {
        if (props.archiveFlg) {
            return;
        }
        setIsVisibleScreenRegisterPopup(false);
    }, [props.archiveFlg]);
    const handleTouchContainer = (0, react_1.useCallback)(() => {
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        closeAllReactionRegisterPopup();
    }, [closeAllReactionRegisterPopup]);
    const handleClickOutside = (0, react_1.useCallback)((event) => {
        var _a;
        const isInsideClick = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target);
        if (isInsideClick) {
            return;
        }
        closeAllReactionRegisterPopup();
    }, [containerRef, closeAllReactionRegisterPopup]);
    const handleScroll = (0, react_1.useCallback)(() => {
        var _a, _b;
        if (!storage_1.storage.isIpad && !storage_1.storage.isIphone) {
            return;
        }
        const currentScroll = (_b = (_a = props.messageAreaRef.current) === null || _a === void 0 ? void 0 : _a.scrollTop) !== null && _b !== void 0 ? _b : 0;
        const scrollSum = totalScroll + Math.abs(currentScroll - prevScrollTop);
        setPrevScrollTop(currentScroll);
        setTotalScroll(scrollSum);
        if (scrollSum > 20) {
            if (timeoutLongTapThreadMessage.current) {
                clearTimeout(timeoutLongTapThreadMessage.current);
            }
            if (timeoutLongTapThreadResponse.current) {
                clearTimeout(timeoutLongTapThreadResponse.current);
            }
            if (timeoutLongTapComment.current) {
                clearTimeout(timeoutLongTapComment.current);
            }
            closeAllReactionRegisterPopup();
        }
    }, [closeAllReactionRegisterPopup, prevScrollTop, totalScroll, props.messageAreaRef]);
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
    const handleClickThreadReactionButton = (0, react_1.useCallback)((params) => {
        void dispatch((0, flightContentsBulletinBoard_1.toggleThreadReaction)({ flightKey, params }));
    }, [dispatch, flightKey]);
    const handleClickResponseReactionButton = (0, react_1.useCallback)((params) => {
        void dispatch((0, flightContentsBulletinBoard_1.toggleResponseReaction)({ flightKey, params }));
    }, [dispatch, flightKey]);
    const handleClickCommentReactionButton = (0, react_1.useCallback)((params) => {
        void dispatch((0, flightContentsBulletinBoard_1.toggleCommentReaction)({ flightKey, params }));
    }, [dispatch, flightKey]);
    const toggleActionMenu = () => setIsOpenActionMenu((prevIsOpenActionMenu) => !prevIsOpenActionMenu);
    const selectedBBCmtId = () => (props.selectedComment ? props.selectedComment.cmtId : undefined);
    react_1.default.useEffect(() => {
        document.addEventListener(storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc ? "click" : "touchstart", handleClickOutside);
        return () => {
            document.removeEventListener(storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc ? "click" : "touchstart", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (react_1.default.createElement(Container, { ref: containerRef, onTouchStart: handleTouchContainer },
        react_1.default.createElement(MessageArea, { ref: props.messageAreaRef, isOpenActionMenu: isOpenActionMenu, onScroll: handleScroll },
            react_1.default.createElement(Thread, { ref: props.threadRef },
                react_1.default.createElement(MouseFloatingWrapper, { ref: threadMessageRef, onMouseOver: handleMouseOverThreadMessage, onMouseOut: handleMouseOutThreadMessage, onTouchStart: handleTouchStartThreadMessage, onTouchEnd: handleTouchEndThreadMessage },
                    react_1.default.createElement(BulletinBoardThreadMessageItemMini_1.BulletinBoardThreadMessageItemMini, { archiveFlg: props.archiveFlg, thread: thread, onDownloadThreadFile: props.onDownloadThreadFile, onDelete: props.onDeleteThread, onClickThreadReactionButton: handleClickThreadReactionButton, editing: props.editing, handleCloseModal: props.handleCloseModal, clearCommentStorage: props.clearCommentStorage, toggleActionMenu: toggleActionMenu, isVisibleReactionDetailPopup: isVisibleThreadDetailPopup, setIsVisibleReactionDetailPopup: setIsVisibleThreadDetailPopup }),
                    react_1.default.createElement(ReactionRegisterPopupThreadWrapper, { isVisible: isVisibleThreadRegisterPopup, onClick: clickStopPropagationHandler, onTouchStart: touchStopPropagationHandler, onTouchEnd: touchStopPropagationHandler },
                        react_1.default.createElement(ReactionRegisterList_1.ReactionRegisterList, { thread: thread, onClickThreadReactionButton: handleClickThreadReactionButton, onClickResponseReactionButton: handleClickResponseReactionButton, onClickCommentReactionButton: handleClickCommentReactionButton }))),
                thread.thread.bbResList.map((response, responseIndex) => (react_1.default.createElement(MouseFloatingWrapper, { key: `response_${response.resId}`, ref: (node) => {
                        threadResponseRefList.current[responseIndex] = node;
                    }, onMouseOver: () => handleMouseOverThreadResponse(responseIndex), onMouseOut: () => handleMouseOutThreadResponse(responseIndex), onTouchStart: (event) => handleTouchStartThreadResponse(responseIndex, event), onTouchEnd: handleTouchEndThreadResponse },
                    react_1.default.createElement(TheadMessageResponseItem_1.TheadMessageResponseItem, { archiveFlg: props.archiveFlg, onDelete: props.onDeleteRes, onClickResponseReactionButton: handleClickResponseReactionButton, bbId: thread.thread.bbId, key: `response_${response.resId}`, response: response, editing: props.editing, clearCommentStorage: props.clearCommentStorage, toggleActionMenu: toggleActionMenu, jstFlg: thread.jstFlg, isVisibleReactionDetailPopup: isVisibleResponseDetailPopupMap[responseIndex], setIsVisibleReactionDetailPopup: (isVisible) => setIsVisibleResponseDetailPopup(responseIndex, isVisible) }),
                    react_1.default.createElement(ReactionRegisterPopupResponseWrapper, { isVisible: isVisibleResponseRegisterPopupMap[responseIndex], onClick: clickStopPropagationHandler, onTouchStart: touchStopPropagationHandler, onTouchEnd: touchStopPropagationHandler },
                        react_1.default.createElement(ReactionRegisterList_1.ReactionRegisterList, { thread: thread, onClickThreadReactionButton: handleClickThreadReactionButton, onClickResponseReactionButton: handleClickResponseReactionButton, onClickCommentReactionButton: handleClickCommentReactionButton })))))),
            react_1.default.createElement(Comment, null,
                react_1.default.createElement(CommentTitle, null, "Comments"),
                thread.thread.bbCmtList.map((comment, commentIndex) => (react_1.default.createElement(MouseFloatingWrapper, { key: `comment_${comment.cmtId}`, ref: (node) => {
                        threadCommentRefList.current[commentIndex] = node;
                    }, onMouseOver: () => handleMouseOverComment(commentIndex), onMouseOut: () => handleMouseOutComment(commentIndex), onTouchStart: (event) => handleTouchStartComment(commentIndex, event), onTouchEnd: handleTouchEndComment },
                    react_1.default.createElement(CommentItem_1.CommentItem, { bbId: thread.thread.bbId, archiveFlg: props.archiveFlg, key: `comment_${comment.cmtId}`, onDelete: props.onDeleteComment, onClickThreadReactionButton: handleClickThreadReactionButton, onClickResponseReactionButton: handleClickResponseReactionButton, onClickCommentReactionButton: handleClickCommentReactionButton, selecting: comment.cmtId === selectedBBCmtId(), onSelect: props.onSelectComment, thread: thread, comment: comment, editing: props.editing, clearCommentStorage: props.clearCommentStorage, toggleActionMenu: toggleActionMenu, jstFlg: thread.jstFlg, isVisibleReactionDetailPopup: isVisibleCommentDetailPopupMap[commentIndex], setIsVisibleReactionDetailPopup: (isVisible) => setIsVisibleCommentDetailPopup(commentIndex, isVisible), isVisibleReactionRegisterPopup: isVisibleCommentRegisterPopupMap[commentIndex] }))))),
            react_1.default.createElement(BlankContent, null)),
        react_1.default.createElement(BulletinBoardCommentInput_1.BulletinBoardCommentInput, { bbId: thread.thread.bbId, onSubmitComment: props.onSubmitComment, onChangeComment: props.onChangeComment, selectedComment: props.selectedComment, editCommentText: props.editCommentText, renderMesssageAreaFloatingContent: props.renderMesssageAreaFloatingContent, isMini: true, commentSubmitable: props.commentSubmitable, onUnselectComment: props.onUnselectComment, disabled: props.archiveFlg }),
        react_1.default.createElement(ReactionRegisterPopupScreenWrapper, { isVisible: isVisibleScreenRegisterPopup, onMouseOver: handleMouseOverScreenPopup, onMouseOut: handleMouseOutScreenPopup, onTouchStart: touchStopPropagationHandler, onTouchEnd: touchStopPropagationHandler, style: reactionRegisterPopupScreenStyle },
            react_1.default.createElement(ReactionRegisterList_1.ReactionRegisterList, { thread: thread, onClickThreadReactionButton: handleClickThreadReactionButton, onClickResponseReactionButton: handleClickResponseReactionButton, onClickCommentReactionButton: handleClickCommentReactionButton }))));
};
exports.BulletinBoardThreadMini = BulletinBoardThreadMini;
const Container = styled_components_1.default.div `
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.22);
`;
const MessageArea = styled_components_1.default.div `
  position: relative;
  flex: 1;
  flex-basis: 0;
  overflow-y: scroll;
  ${(props) => (props.isOpenActionMenu ? "" : "-webkit-overflow-scrolling: touch;")}
  ::-webkit-scrollbar {
    display: none;
  }
`;
const Thread = styled_components_1.default.div `
  border-bottom: 2px solid #abb3bb;
  padding: 0 5px 10px;
`;
const Comment = styled_components_1.default.div `
  padding: 25px 0 10px 0;
`;
const MouseFloatingWrapper = styled_components_1.default.div `
  position: relative;
`;
const ReactionRegisterPopupWrapper = styled_components_1.default.div `
  position: absolute;
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  transition: visibility 0.1s, opacity 0.1s;
  z-index: 1;
`;
const ReactionRegisterPopupScreenWrapper = (0, styled_components_1.default)(ReactionRegisterPopupWrapper) ``;
const ReactionRegisterPopupThreadWrapper = (0, styled_components_1.default)(ReactionRegisterPopupWrapper) `
  top: -4px;
  left: 10px;
`;
const ReactionRegisterPopupResponseWrapper = (0, styled_components_1.default)(ReactionRegisterPopupWrapper) `
  top: -30px;
  left: 10px;
`;
const CommentTitle = styled_components_1.default.p `
  margin: 0 0 8px 0;
  padding: 0 15px;
  font-size: 19px;
  color: #2fadbd;
`;
const BlankContent = styled_components_1.default.div `
  height: 60px;
`;
//# sourceMappingURL=BulletinBoardThreadMini.js.map