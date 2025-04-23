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
exports.BulletinBoard = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const redux_form_1 = require("redux-form");
const query_string_1 = __importDefault(require("query-string"));
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("../../store/hooks");
const webApi_1 = require("../../lib/webApi");
const soalaMessages_1 = require("../../lib/soalaMessages");
const common_1 = require("../../reducers/common");
const BulletinBoardPC_1 = require("../organisms/BulletinBoard/BulletinBoardPC");
const BulletinBoardMobile_1 = require("../organisms/BulletinBoard/BulletinBoardMobile");
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const SearchParamConverter_1 = require("../../lib/AdvanceSearch/SearchParamConverter");
const SearchParamMapper_1 = require("../../lib/AdvanceSearch/SearchParamMapper");
const ThreadFilterModal_1 = require("../organisms/BulletinBoard/ThreadFilterModal");
const ResponseEditorModal_1 = require("../organisms/BulletinBoard/ResponseEditorModal");
const bulletinBoard_1 = require("../../reducers/bulletinBoard");
const bulletinBoardResponseEditorModal_1 = require("../../reducers/bulletinBoardResponseEditorModal");
const BulletinBoardResourceOperator_1 = require("../../lib/BulletinBoardResourceOperator");
const Header_1 = __importDefault(require("./Header"));
const BulletinBoard = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const filterFormValues = (0, hooks_1.useAppSelector)((state) => (state.form.bulletinBoardThreadFilterModal && state.form.bulletinBoardThreadFilterModal.values) || {});
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const thread = (0, hooks_1.useAppSelector)((state) => state.bulletinBoard.thread);
    const threads = (0, hooks_1.useAppSelector)((state) => state.bulletinBoard.threads);
    const timeLcl = (0, hooks_1.useAppSelector)((state) => state.common.headerInfo.apoTimeLcl);
    const timeDiffUtc = (0, hooks_1.useAppSelector)((state) => state.common.headerInfo.apoTimeDiffUtc);
    const loading = (0, hooks_1.useAppSelector)((state) => state.bulletinBoard.isFetchingThreads || state.bulletinBoard.isFetchingThread);
    const cdCtrlDtls = (0, hooks_1.useAppSelector)((state) => state.account.master.cdCtrlDtls);
    const location = (0, react_router_dom_1.useLocation)();
    const messageAreaRef = (0, react_1.useRef)(null);
    const threadRef = (0, react_1.useRef)(null);
    const resourceOperator = (0, react_1.useRef)(new BulletinBoardResourceOperator_1.BulletinBoardResourceOperator({ dispatch }));
    const searchParamConverter = (0, react_1.useRef)(new SearchParamConverter_1.SearchParamConverter({ mapper: SearchParamMapper_1.SearchParamMapper.getBulletinBoardMapper(cdCtrlDtls) }));
    const [currentThreadId, setCurrentThreadId] = (0, react_1.useState)(undefined);
    const [searchStringParam, setSearchStringParam] = (0, react_1.useState)("");
    // 検索文字列を変更してSubmitするまでは検索条件に含めないためのフラグ
    const [searchParamEdited, setSearchParamEdited] = (0, react_1.useState)(false);
    const [openedFilterModal, setOpenedFilterModal] = (0, react_1.useState)(false);
    const [threadStorage, setThreadStorage] = (0, react_1.useState)({});
    const [filtering, setFiltering] = (0, react_1.useState)(false);
    const latestThreads = (0, hooks_1.useLatest)(threads);
    const latestFilterFormValues = (0, hooks_1.useLatest)(filterFormValues);
    (0, react_1.useEffect)(() => {
        document.title = "B.B.";
        props.setReloadBb(() => {
            void reload();
        });
        void (async () => {
            await fetchThreadList(searchParamConverter.current.getRequestParam());
            onChangeCategoryTab((latestThreads.current && latestThreads.current.threadList) || []);
            if (!location.search)
                return;
            const qs = query_string_1.default.parse(location.search);
            if (qs.bbId) {
                void selectThread(parseInt(qs.bbId, 10));
            }
        })();
        return () => {
            dispatch((0, bulletinBoard_1.clearThread)());
            props.setReloadBb(undefined);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, hooks_1.useDidUpdateEffect)(() => {
        if (!loading) {
            const apoCd = jobAuth.user.myApoCd;
            void dispatch((0, common_1.getHeaderInfo)({ apoCd }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);
    const superReloadAll = async () => {
        unSetCurrentThread();
        await reloadAll();
    };
    const reloadThreadsOnError = async () => {
        unSetCurrentThread();
        await fetchThreadList(searchParamConverter.current.getRequestParam());
    };
    const reloadAll = async () => {
        if (editing()) {
            const onYesButton = async () => {
                await reload();
                scrollToCurrent();
            };
            void dispatch((0, bulletinBoard_1.showMessage)({
                message: soalaMessages_1.SoalaMessage.M40011C({
                    onYesButton: () => {
                        void onYesButton();
                    },
                }),
            }));
        }
        else {
            await reload();
            void scrollToCurrent();
        }
    };
    const reload = async () => {
        const fetchThreadResponse = await fetchThreadList(searchParamConverter.current.getRequestParam());
        void reloadThreadDetail(fetchThreadResponse);
    };
    // eslint-disable-next-line @typescript-eslint/require-await
    const reloadThreadDetail = async (fetchThreadResponse) => {
        if (!currentThreadId) {
            return;
        }
        if (!fetchThreadResponse) {
            unSetCurrentThread();
            return;
        }
        void selectThread(currentThreadId, { needShowMessage: false, needReloadThreadsOnError: false });
    };
    const reloadThread = async () => {
        if (!currentThreadId)
            return;
        await fetchThread({
            bbId: currentThreadId,
            connectDbCat: !!latestThreads.current && latestThreads.current.archiveFlg ? "P" : "O",
        }, true);
    };
    const scrollToCurrent = () => {
        if (currentThreadId && threadRef.current && messageAreaRef.current) {
            const position = threadRef.current.offsetHeight - messageAreaRef.current.clientHeight / 2;
            if (position > 0) {
                (0, commonUtil_1.smoothScroll)(messageAreaRef.current, position, 30);
            }
        }
    };
    // eslint-disable-next-line @typescript-eslint/ban-types
    const fetchThreadList = async (params) => {
        const threadsParams = {
            keyword: "",
            catCdList: [],
            from: "",
            to: "",
            archiveDateLcl: "",
            ...params,
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const res = await dispatch((0, bulletinBoard_1.fetchThreads)(threadsParams)).unwrap();
        setFiltering(Object.keys(params).length > 0);
        return res;
    };
    const fetchThread = async (params, needReloadThreadsOnError) => dispatch((0, bulletinBoard_1.fetchThread)({
        params,
        callbacks: {
            onForbidden: needReloadThreadsOnError ? superReloadAll : unSetCurrentThread,
            onNotFoundThread: needReloadThreadsOnError ? superReloadAll : unSetCurrentThread,
        },
    }));
    const selectThread = async (bbId, options) => {
        if (!latestThreads.current)
            return;
        let needShowMessage = true;
        if (!!options && options.needShowMessage !== undefined) {
            needShowMessage = options.needShowMessage;
        }
        let needReloadThreadsOnError = true;
        if (!!options && options.needReloadThreadsOnError !== undefined) {
            needReloadThreadsOnError = options.needReloadThreadsOnError;
        }
        const onSelectThread = async () => {
            clearCommentStorage();
            setCurrentThreadId(bbId);
            await fetchThread({
                bbId,
                connectDbCat: !!latestThreads.current && latestThreads.current.archiveFlg ? "P" : "O",
            }, needReloadThreadsOnError);
        };
        if (needShowMessage && editing()) {
            void dispatch((0, bulletinBoard_1.showMessage)({
                message: soalaMessages_1.SoalaMessage.M40012C({
                    onYesButton: () => {
                        void onSelectThread();
                    },
                }),
            }));
        }
        else {
            await onSelectThread();
        }
    };
    const fetchThreadFileUrl = async (bbFileId) => {
        try {
            const params = {
                fileId: bbFileId,
                connectDbCat: latestThreads.current && latestThreads.current.archiveFlg ? "P" : "O",
            };
            const response = await webApi_1.WebApi.getBulletinBoardTheadFile(dispatch, params, {
                onForbidden: () => {
                    void reloadThreadsOnError();
                },
            });
            return response.data.file;
        }
        catch (err) {
            // 何もしない
        }
        return undefined;
    };
    const openFilterModal = (_stringParam) => {
        // this.searchParamConverter.applyStringParam(stringParam); ※適用されているフィルタを表示するのが正しそうなので削除
        const formParam = searchParamConverter.current.getFormParam(true);
        (0, commonUtil_1.keys)(formParam).forEach((k) => {
            dispatch((0, redux_form_1.change)("bulletinBoardThreadFilterModal", String(k), formParam[k]));
        });
        setOpenedFilterModal(true);
    };
    const handleSubmitFilter = async (stringParam, onSubmitCallback) => {
        if (editing()) {
            const onYesButton = async () => {
                await submitFilter(stringParam);
                if (onSubmitCallback) {
                    onSubmitCallback();
                }
            };
            void dispatch((0, bulletinBoard_1.showMessage)({
                message: soalaMessages_1.SoalaMessage.M40012C({
                    onYesButton: () => {
                        void onYesButton();
                    },
                }),
            }));
        }
        else {
            await submitFilter(stringParam);
            if (onSubmitCallback) {
                onSubmitCallback();
            }
        }
    };
    const submitFilter = async (stringParam) => {
        const errorMessages = searchParamConverter.current.applyStringParam(stringParam);
        if (errorMessages.length) {
            void dispatch((0, bulletinBoard_1.showMessage)({ message: errorMessages[0] }));
            setSearchStringParam(stringParam);
            return;
        }
        setSearchStringParam(searchParamConverter.current.getStringParam());
        const fetchThreadResponse = await fetchThreadList(searchParamConverter.current.getRequestParam());
        void reloadThreadDetail(fetchThreadResponse);
        setOpenedFilterModal(false);
        setSearchParamEdited(false);
    };
    const closeFilterModal = () => setOpenedFilterModal(false);
    const handleSubmitFilterModal = async () => {
        if (editing()) {
            void dispatch((0, bulletinBoard_1.showMessage)({
                message: soalaMessages_1.SoalaMessage.M40012C({
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onYesButton: async () => {
                        await submitFilterModal();
                    },
                }),
            }));
        }
        else {
            await submitFilterModal();
        }
    };
    const submitFilterModal = async () => {
        searchParamConverter.current.applyFormParam(latestFilterFormValues.current);
        const fetchThreadResponse = await fetchThreadList(searchParamConverter.current.getRequestParam());
        await reloadThreadDetail(fetchThreadResponse);
        closeFilterModal();
        setSearchStringParam(searchParamConverter.current.getStringParam());
        setSearchParamEdited(false);
    };
    const unSetCurrentThread = () => {
        clearCommentStorage();
        setCurrentThreadId(undefined);
        dispatch((0, bulletinBoard_1.clearThread)());
        dispatch((0, bulletinBoardResponseEditorModal_1.closeBulletinBoardResponseModal)());
    };
    const selectComment = (bbId, bbCmt) => {
        setThreadStorage({
            ...threadStorage,
            [bbId]: {
                ...threadStorage[bbId],
                selectedComment: bbCmt,
                comment: bbCmt.cmtText,
            },
        });
    };
    const unselectComment = (bbId) => {
        setThreadStorage({
            ...threadStorage,
            [bbId]: {
                ...threadStorage[bbId],
                selectedComment: undefined,
                comment: "",
            },
        });
    };
    const changeComment = (bbId, comment) => {
        setThreadStorage({
            ...threadStorage,
            [bbId]: {
                ...threadStorage[bbId],
                comment,
            },
        });
    };
    const handleUnselectComment = (bbId, onNoButton) => {
        if (editing()) {
            void dispatch((0, bulletinBoard_1.showMessage)({
                message: soalaMessages_1.SoalaMessage.M40001C({
                    onYesButton: () => unselectComment(bbId),
                    onNoButton,
                }),
            }));
        }
        else {
            unselectComment(bbId);
        }
    };
    const clearCommentStorage = () => setThreadStorage({});
    const submitComment = async (bbId) => {
        if (!threadStorage[bbId])
            return;
        const { comment, selectedComment } = threadStorage[bbId];
        const selectedBBCmtId = selectedComment ? selectedComment.cmtId : undefined;
        if (!(comment && comment.length > 0))
            return;
        if (selectedBBCmtId) {
            await resourceOperator.current.updateComment({ bbId, cmtId: selectedBBCmtId, cmtText: comment }, {
                onForbidden: () => {
                    void reloadThreadsOnError();
                },
                onNotFoundThread: () => {
                    void reloadThreadsOnError();
                },
                onNotFoundComment: () => {
                    unselectComment(bbId);
                    void reloadThread();
                },
            });
        }
        else {
            await resourceOperator.current.createComment({ bbId, cmtText: comment }, {
                onForbidden: () => {
                    void reloadThreadsOnError();
                },
                onNotFoundThread: () => {
                    void reloadThreadsOnError();
                },
            });
        }
        unselectComment(bbId);
        await reloadThread();
        if (!selectedBBCmtId) {
            scrollToCurrent();
        }
    };
    const deleteComment = async (cmtId) => {
        const reloadThreadByDeleteComment = async () => {
            if (currentThreadId !== undefined && !!threadStorage[currentThreadId]) {
                const { selectedComment } = threadStorage[currentThreadId];
                if (selectedComment && selectedComment.cmtId === cmtId) {
                    unselectComment(currentThreadId);
                }
            }
            await reloadThread();
        };
        await resourceOperator.current.deleteComment(cmtId, {
            onForbidden: () => {
                void reloadThreadsOnError();
            },
            onNotFoundThread: () => {
                void reloadThreadsOnError();
            },
            onNotFoundComment: () => {
                void reloadThreadByDeleteComment();
            },
        });
        await reloadThreadByDeleteComment();
    };
    const deleteThread = async (bbId) => {
        await resourceOperator.current.deleteThread(bbId, {
            onNotFoundThread: () => {
                void reloadThreadsOnError();
            },
        });
        unSetCurrentThread();
        await fetchThreadList(searchParamConverter.current.getRequestParam());
    };
    const deleteRes = async (resId) => {
        await resourceOperator.current.deleteRes(resId, {
            onNotFoundThread: () => {
                void reloadThreadsOnError();
            },
            onNotFoundRes: () => {
                void reloadThread();
            },
        });
        await reloadThread();
    };
    const createResponse = async (params) => {
        await resourceOperator.current.createResponse(params, {
            onForbidden: () => {
                void reloadThreadsOnError(); // レスUPDATE時の403を想定
            },
            onNotFoundThread: () => {
                void reloadThreadsOnError();
            },
        });
        dispatch((0, bulletinBoardResponseEditorModal_1.closeBulletinBoardResponseModal)());
        await reloadThread();
        scrollToCurrent();
    };
    const updateResponse = async (params) => {
        const reloadThreadByUpdateRes = async () => {
            dispatch((0, bulletinBoardResponseEditorModal_1.closeBulletinBoardResponseModal)());
            await reloadThread();
        };
        await resourceOperator.current.updateResponse(params, {
            onNotFoundThread: () => {
                void reloadThreadsOnError();
            },
            onNotFoundRes: () => {
                void reloadThreadByUpdateRes();
            },
        });
        await reloadThreadByUpdateRes();
    };
    const commentStorage = () => {
        if (currentThreadId === undefined || !threadStorage[currentThreadId])
            return {};
        return threadStorage[currentThreadId];
    };
    const commentProps = () => {
        const { selectedComment, comment: editCommentText } = commentStorage();
        return { selectedComment, editCommentText };
    };
    const onChangeCategoryTab = (activeThreads) => {
        if (activeThreads.length !== 1)
            return;
        void selectThread(activeThreads[0].bbId);
    };
    const handleChangeFilterString = (_filterString, onAccept) => {
        if (editing() && filtering) {
            void dispatch((0, bulletinBoard_1.showMessage)({
                message: soalaMessages_1.SoalaMessage.M40012C({
                    onYesButton: () => {
                        if (currentThreadId !== undefined) {
                            changeComment(currentThreadId, "");
                        }
                        changeFilterString();
                        if (onAccept) {
                            onAccept();
                        }
                    },
                }),
            }));
        }
        else {
            changeFilterString();
            if (onAccept) {
                onAccept();
            }
        }
    };
    const changeFilterString = () => {
        if (!searchParamEdited) {
            searchParamConverter.current.applyStringParam("");
            setSearchParamEdited(true);
            // searchParamsDirtyのstateの更新が直前になるので、1frame遅延させてます。
            // tslint:disable-next-line:no-unused-expression
            if (filtering) {
                setTimeout(() => {
                    void reloadAll();
                }, 0);
            }
        }
    };
    const editing = () => {
        if (!currentThreadId || !threadStorage[currentThreadId]) {
            return false;
        }
        const { selectedComment } = threadStorage[currentThreadId];
        let initialComment = selectedComment ? selectedComment.cmtText : undefined;
        if (initialComment === undefined) {
            initialComment = "";
        }
        return threadStorage[currentThreadId].comment !== initialComment;
    };
    const commentSubmitable = () => {
        const { selectedComment, comment } = commentStorage();
        if (!comment || comment.trim().length === 0)
            return false;
        return !selectedComment || comment !== selectedComment.cmtText;
    };
    const states = {
        currentThreadId,
        searchStringParam,
        searchParamEdited,
        openedFilterModal,
        threadStorage,
        filtering,
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Header_1.default, null),
        react_1.default.createElement(Container, null,
            react_1.default.createElement(ResponseEditorModal_1.ResponseEditorModal, { onCreateResponse: (params) => {
                    void createResponse(params);
                }, onUpdateResponse: (params) => {
                    void updateResponse(params);
                } }),
            react_1.default.createElement(ThreadFilterModal_1.ThreadFilterModal, { isOpen: openedFilterModal, onRequestClose: closeFilterModal, onSubmit: handleSubmitFilterModal }),
            storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone ? (react_1.default.createElement(BulletinBoardMobile_1.BulletinBoardMobile, { ...commentProps(), threads: latestThreads.current, thread: thread, onUnSetCurrentThread: unSetCurrentThread, onReload: () => {
                    void reloadAll();
                }, onDeleteRes: (resId) => {
                    void deleteRes(resId);
                }, onDeleteThread: (bbId) => {
                    void deleteThread(bbId);
                }, onDeleteComment: (bbCmtId) => {
                    void deleteComment(bbCmtId);
                }, onOpenFilterModal: openFilterModal, onSubmitFilter: (stringParam, onSubmitCallback) => {
                    void handleSubmitFilter(stringParam, onSubmitCallback);
                }, onSelectThread: (bbId) => {
                    void selectThread(bbId);
                }, onDownloadThreadFile: fetchThreadFileUrl, onChangeComment: changeComment, onUnselectComment: handleUnselectComment, onSelectComment: selectComment, onSubmitComment: (bbId) => {
                    void submitComment(bbId);
                }, onChangeFilterString: handleChangeFilterString, editing: editing(), messageAreaRef: messageAreaRef, threadRef: threadRef, commentSubmitable: commentSubmitable(), clearCommentStorage: clearCommentStorage, showMessage: bulletinBoard_1.showMessage, ...states })) : (react_1.default.createElement(BulletinBoardPC_1.BulletinBoardPC, { ...commentProps(), threads: latestThreads.current, thread: thread, timeLcl: timeLcl, timeDiffUtc: timeDiffUtc, onReload: () => {
                    void reloadAll();
                }, onDeleteRes: (resId) => {
                    void deleteRes(resId);
                }, onDeleteThread: (bbId) => {
                    void deleteThread(bbId);
                }, onDeleteComment: (bbCmtId) => {
                    void deleteComment(bbCmtId);
                }, onOpenFilterModal: openFilterModal, onSubmitFilter: (stringParam, onSubmitCallback) => {
                    void handleSubmitFilter(stringParam, onSubmitCallback);
                }, onSelectThread: (bbId) => {
                    void selectThread(bbId);
                }, onDownloadThreadFile: fetchThreadFileUrl, onChangeComment: changeComment, onUnselectComment: handleUnselectComment, onSelectComment: selectComment, onSubmitComment: (bbId) => {
                    void submitComment(bbId);
                }, myApoCd: jobAuth.user.myApoCd, onChangeFilterString: handleChangeFilterString, editing: editing(), messageAreaRef: messageAreaRef, threadRef: threadRef, commentSubmitable: commentSubmitable(), clearCommentStorage: clearCommentStorage, ...states })))));
};
exports.BulletinBoard = BulletinBoard;
const Container = styled_components_1.default.div `
  flex: 1;
`;
//# sourceMappingURL=BulletinBoard.js.map