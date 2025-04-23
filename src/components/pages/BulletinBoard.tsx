import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { change } from "redux-form";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector, useLatest, useDidUpdateEffect } from "../../store/hooks";
import { WebApi } from "../../lib/webApi";
import { SoalaMessage } from "../../lib/soalaMessages";
import { getHeaderInfo } from "../../reducers/common";
import { BulletinBoardPC } from "../organisms/BulletinBoard/BulletinBoardPC";
import { BulletinBoardMobile } from "../organisms/BulletinBoard/BulletinBoardMobile";
import { keys, smoothScroll } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import { SearchParamConverter } from "../../lib/AdvanceSearch/SearchParamConverter";
import { SearchParamMapper } from "../../lib/AdvanceSearch/SearchParamMapper";
import { ThreadFilterModal, FormParams } from "../organisms/BulletinBoard/ThreadFilterModal";
import { ResponseEditorModal } from "../organisms/BulletinBoard/ResponseEditorModal";
import { fetchThread as fetchThreadThunk, fetchThreads, clearThread, showMessage } from "../../reducers/bulletinBoard";
import { closeBulletinBoardResponseModal } from "../../reducers/bulletinBoardResponseEditorModal";
import { BulletinBoardResourceOperator } from "../../lib/BulletinBoardResourceOperator";
import Header from "./Header";

interface Props {
  setReloadBb: (func: (() => void) | undefined) => void;
}

type SelectThreadOptions = {
  needShowMessage?: boolean;
  needReloadThreadsOnError?: boolean;
};

export const BulletinBoard: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const filterFormValues = useAppSelector(
    (state) => (state.form.bulletinBoardThreadFilterModal && (state.form.bulletinBoardThreadFilterModal.values as FormParams)) || {}
  );
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const thread = useAppSelector((state) => state.bulletinBoard.thread);
  const threads = useAppSelector((state) => state.bulletinBoard.threads);
  const timeLcl = useAppSelector((state) => state.common.headerInfo.apoTimeLcl);
  const timeDiffUtc = useAppSelector((state) => state.common.headerInfo.apoTimeDiffUtc);
  const loading = useAppSelector((state) => state.bulletinBoard.isFetchingThreads || state.bulletinBoard.isFetchingThread);
  const cdCtrlDtls = useAppSelector((state) => state.account.master.cdCtrlDtls);
  const location = useLocation();
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const resourceOperator = useRef(new BulletinBoardResourceOperator({ dispatch }));
  const searchParamConverter = useRef(new SearchParamConverter({ mapper: SearchParamMapper.getBulletinBoardMapper(cdCtrlDtls) }));

  const [currentThreadId, setCurrentThreadId] = useState<number | undefined>(undefined);
  const [searchStringParam, setSearchStringParam] = useState("");
  // 検索文字列を変更してSubmitするまでは検索条件に含めないためのフラグ
  const [searchParamEdited, setSearchParamEdited] = useState(false);
  const [openedFilterModal, setOpenedFilterModal] = useState(false);
  const [threadStorage, setThreadStorage] = useState<{
    [key: string]: {
      comment?: string;
      selectedComment?: BulletinBoardThreadApi.BbCmt;
    };
  }>({});
  const [filtering, setFiltering] = useState<boolean>(false);
  const latestThreads = useLatest(threads);
  const latestFilterFormValues = useLatest(filterFormValues);

  useEffect(() => {
    document.title = "B.B.";
    props.setReloadBb(() => {
      void reload();
    });
    void (async () => {
      await fetchThreadList(searchParamConverter.current.getRequestParam());
      onChangeCategoryTab((latestThreads.current && latestThreads.current.threadList) || []);

      if (!location.search) return;
      const qs = queryString.parse(location.search);
      if (qs.bbId) {
        void selectThread(parseInt(qs.bbId as string, 10));
      }
    })();

    return () => {
      dispatch(clearThread());
      props.setReloadBb(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDidUpdateEffect(() => {
    if (!loading) {
      const apoCd = jobAuth.user.myApoCd;
      void dispatch(getHeaderInfo({ apoCd }));
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
      void dispatch(
        showMessage({
          message: SoalaMessage.M40011C({
            onYesButton: () => {
              void onYesButton();
            },
          }),
        })
      );
    } else {
      await reload();
      void scrollToCurrent();
    }
  };

  const reload = async () => {
    const fetchThreadResponse = await fetchThreadList(searchParamConverter.current.getRequestParam());
    void reloadThreadDetail(fetchThreadResponse);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const reloadThreadDetail = async (fetchThreadResponse: BulletinBoardThreadsApi.Response | null) => {
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
    if (!currentThreadId) return;
    await fetchThread(
      {
        bbId: currentThreadId,
        connectDbCat: !!latestThreads.current && latestThreads.current.archiveFlg ? "P" : "O",
      },
      true
    );
  };

  const scrollToCurrent = () => {
    if (currentThreadId && threadRef.current && messageAreaRef.current) {
      const position = threadRef.current.offsetHeight - messageAreaRef.current.clientHeight / 2;
      if (position > 0) {
        smoothScroll(messageAreaRef.current, position, 30);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  const fetchThreadList = async (params: BulletinBoardThreadsApi.Request | {}) => {
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
    const res = await dispatch(fetchThreads(threadsParams)).unwrap();

    setFiltering(Object.keys(params).length > 0);
    return res;
  };

  const fetchThread = async (params: BulletinBoardThreadApi.Request, needReloadThreadsOnError: boolean) =>
    dispatch(
      fetchThreadThunk({
        params,
        callbacks: {
          onForbidden: needReloadThreadsOnError ? superReloadAll : unSetCurrentThread,
          onNotFoundThread: needReloadThreadsOnError ? superReloadAll : unSetCurrentThread,
        },
      })
    );

  const selectThread = async (bbId: number, options?: SelectThreadOptions) => {
    if (!latestThreads.current) return;
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
      await fetchThread(
        {
          bbId,
          connectDbCat: !!latestThreads.current && latestThreads.current.archiveFlg ? "P" : "O",
        },
        needReloadThreadsOnError
      );
    };
    if (needShowMessage && editing()) {
      void dispatch(
        showMessage({
          message: SoalaMessage.M40012C({
            onYesButton: () => {
              void onSelectThread();
            },
          }),
        })
      );
    } else {
      await onSelectThread();
    }
  };

  const fetchThreadFileUrl = async (bbFileId: number): Promise<BulletinBoardDownloadFileApi.File | undefined> => {
    try {
      const params: BulletinBoardDownloadFileApi.Request = {
        fileId: bbFileId,
        connectDbCat: latestThreads.current && latestThreads.current.archiveFlg ? "P" : "O",
      };
      const response = await WebApi.getBulletinBoardTheadFile(dispatch, params, {
        onForbidden: () => {
          void reloadThreadsOnError();
        },
      });
      return response.data.file;
    } catch (err) {
      // 何もしない
    }
    return undefined;
  };

  const openFilterModal = (_stringParam: string) => {
    // this.searchParamConverter.applyStringParam(stringParam); ※適用されているフィルタを表示するのが正しそうなので削除
    const formParam = searchParamConverter.current.getFormParam(true);
    keys(formParam).forEach((k) => {
      dispatch(change("bulletinBoardThreadFilterModal", String(k), formParam[k] as string));
    });
    setOpenedFilterModal(true);
  };

  const handleSubmitFilter = async (stringParam: string, onSubmitCallback?: () => void) => {
    if (editing()) {
      const onYesButton = async () => {
        await submitFilter(stringParam);
        if (onSubmitCallback) {
          onSubmitCallback();
        }
      };
      void dispatch(
        showMessage({
          message: SoalaMessage.M40012C({
            onYesButton: () => {
              void onYesButton();
            },
          }),
        })
      );
    } else {
      await submitFilter(stringParam);
      if (onSubmitCallback) {
        onSubmitCallback();
      }
    }
  };

  const submitFilter = async (stringParam: string) => {
    const errorMessages = searchParamConverter.current.applyStringParam(stringParam);
    if (errorMessages.length) {
      void dispatch(showMessage({ message: errorMessages[0] }));
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
      void dispatch(
        showMessage({
          message: SoalaMessage.M40012C({
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onYesButton: async () => {
              await submitFilterModal();
            },
          }),
        })
      );
    } else {
      await submitFilterModal();
    }
  };

  const submitFilterModal = async () => {
    searchParamConverter.current.applyFormParam(
      latestFilterFormValues.current as Record<keyof typeof latestFilterFormValues.current, unknown>
    );

    const fetchThreadResponse = await fetchThreadList(searchParamConverter.current.getRequestParam());
    await reloadThreadDetail(fetchThreadResponse);
    closeFilterModal();
    setSearchStringParam(searchParamConverter.current.getStringParam());
    setSearchParamEdited(false);
  };

  const unSetCurrentThread = () => {
    clearCommentStorage();
    setCurrentThreadId(undefined);
    dispatch(clearThread());
    dispatch(closeBulletinBoardResponseModal());
  };

  const selectComment = (bbId: number, bbCmt: BulletinBoardThreadApi.BbCmt) => {
    setThreadStorage({
      ...threadStorage,
      [bbId]: {
        ...threadStorage[bbId],
        selectedComment: bbCmt,
        comment: bbCmt.cmtText,
      },
    });
  };

  const unselectComment = (bbId: number) => {
    setThreadStorage({
      ...threadStorage,
      [bbId]: {
        ...threadStorage[bbId],
        selectedComment: undefined,
        comment: "",
      },
    });
  };

  const changeComment = (bbId: number, comment: string) => {
    setThreadStorage({
      ...threadStorage,
      [bbId]: {
        ...threadStorage[bbId],
        comment,
      },
    });
  };

  const handleUnselectComment = (bbId: number, onNoButton?: () => void) => {
    if (editing()) {
      void dispatch(
        showMessage({
          message: SoalaMessage.M40001C({
            onYesButton: () => unselectComment(bbId),
            onNoButton,
          }),
        })
      );
    } else {
      unselectComment(bbId);
    }
  };

  const clearCommentStorage = () => setThreadStorage({});

  const submitComment = async (bbId: number) => {
    if (!threadStorage[bbId]) return;

    const { comment, selectedComment } = threadStorage[bbId];
    const selectedBBCmtId = selectedComment ? selectedComment.cmtId : undefined;

    if (!(comment && comment.length > 0)) return;

    if (selectedBBCmtId) {
      await resourceOperator.current.updateComment(
        { bbId, cmtId: selectedBBCmtId, cmtText: comment },
        {
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
        }
      );
    } else {
      await resourceOperator.current.createComment(
        { bbId, cmtText: comment },
        {
          onForbidden: () => {
            void reloadThreadsOnError();
          },
          onNotFoundThread: () => {
            void reloadThreadsOnError();
          },
        }
      );
    }

    unselectComment(bbId);
    await reloadThread();
    if (!selectedBBCmtId) {
      scrollToCurrent();
    }
  };

  const deleteComment = async (cmtId: number) => {
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

  const deleteThread = async (bbId: number) => {
    await resourceOperator.current.deleteThread(bbId, {
      onNotFoundThread: () => {
        void reloadThreadsOnError();
      },
    });
    unSetCurrentThread();
    await fetchThreadList(searchParamConverter.current.getRequestParam());
  };

  const deleteRes = async (resId: number) => {
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

  const createResponse = async (params: BulletinBoardAddResponse.Request) => {
    await resourceOperator.current.createResponse(params, {
      onForbidden: () => {
        void reloadThreadsOnError(); // レスUPDATE時の403を想定
      },
      onNotFoundThread: () => {
        void reloadThreadsOnError();
      },
    });
    dispatch(closeBulletinBoardResponseModal());
    await reloadThread();
    scrollToCurrent();
  };

  const updateResponse = async (params: BulletinBoardUpdateResponse.Request) => {
    const reloadThreadByUpdateRes = async () => {
      dispatch(closeBulletinBoardResponseModal());
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
    if (currentThreadId === undefined || !threadStorage[currentThreadId]) return {};
    return threadStorage[currentThreadId];
  };

  const commentProps = () => {
    const { selectedComment, comment: editCommentText } = commentStorage();
    return { selectedComment, editCommentText };
  };

  const onChangeCategoryTab = (activeThreads: BulletinBoardThreadsApi.Thread[]) => {
    if (activeThreads.length !== 1) return;
    void selectThread(activeThreads[0].bbId);
  };

  const handleChangeFilterString = (_filterString: string, onAccept?: () => void) => {
    if (editing() && filtering) {
      void dispatch(
        showMessage({
          message: SoalaMessage.M40012C({
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
        })
      );
    } else {
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

  const editing = (): boolean => {
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

  const commentSubmitable = (): boolean => {
    const { selectedComment, comment } = commentStorage();
    if (!comment || comment.trim().length === 0) return false;
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

  return (
    <>
      <Header />
      <Container>
        <ResponseEditorModal
          onCreateResponse={(params) => {
            void createResponse(params);
          }}
          onUpdateResponse={(params) => {
            void updateResponse(params);
          }}
        />
        <ThreadFilterModal isOpen={openedFilterModal} onRequestClose={closeFilterModal} onSubmit={handleSubmitFilterModal} />
        {storage.terminalCat === Const.TerminalCat.iPhone ? (
          <BulletinBoardMobile
            {...commentProps()}
            threads={latestThreads.current}
            thread={thread}
            onUnSetCurrentThread={unSetCurrentThread}
            onReload={() => {
              void reloadAll();
            }}
            onDeleteRes={(resId) => {
              void deleteRes(resId);
            }}
            onDeleteThread={(bbId) => {
              void deleteThread(bbId);
            }}
            onDeleteComment={(bbCmtId) => {
              void deleteComment(bbCmtId);
            }}
            onOpenFilterModal={openFilterModal}
            onSubmitFilter={(stringParam, onSubmitCallback) => {
              void handleSubmitFilter(stringParam, onSubmitCallback);
            }}
            onSelectThread={(bbId) => {
              void selectThread(bbId);
            }}
            onDownloadThreadFile={fetchThreadFileUrl}
            onChangeComment={changeComment}
            onUnselectComment={handleUnselectComment}
            onSelectComment={selectComment}
            onSubmitComment={(bbId) => {
              void submitComment(bbId);
            }}
            onChangeFilterString={handleChangeFilterString}
            editing={editing()}
            messageAreaRef={messageAreaRef}
            threadRef={threadRef}
            commentSubmitable={commentSubmitable()}
            clearCommentStorage={clearCommentStorage}
            showMessage={showMessage}
            {...states}
          />
        ) : (
          <BulletinBoardPC
            {...commentProps()}
            threads={latestThreads.current}
            thread={thread}
            timeLcl={timeLcl}
            timeDiffUtc={timeDiffUtc}
            onReload={() => {
              void reloadAll();
            }}
            onDeleteRes={(resId) => {
              void deleteRes(resId);
            }}
            onDeleteThread={(bbId) => {
              void deleteThread(bbId);
            }}
            onDeleteComment={(bbCmtId) => {
              void deleteComment(bbCmtId);
            }}
            onOpenFilterModal={openFilterModal}
            onSubmitFilter={(stringParam, onSubmitCallback) => {
              void handleSubmitFilter(stringParam, onSubmitCallback);
            }}
            onSelectThread={(bbId) => {
              void selectThread(bbId);
            }}
            onDownloadThreadFile={fetchThreadFileUrl}
            onChangeComment={changeComment}
            onUnselectComment={handleUnselectComment}
            onSelectComment={selectComment}
            onSubmitComment={(bbId) => {
              void submitComment(bbId);
            }}
            myApoCd={jobAuth.user.myApoCd}
            onChangeFilterString={handleChangeFilterString}
            editing={editing()}
            messageAreaRef={messageAreaRef}
            threadRef={threadRef}
            commentSubmitable={commentSubmitable()}
            clearCommentStorage={clearCommentStorage}
            {...states}
          />
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  flex: 1;
`;
