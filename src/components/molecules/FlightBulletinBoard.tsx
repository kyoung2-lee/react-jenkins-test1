import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { AppDispatch } from "../../store/storeType";
import { usePrevious } from "../../store/hooks";
import { WebApi } from "../../lib/webApi";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import { JobAuth } from "../../reducers/account";
import { funcAuthCheck, smoothScroll } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { BulletinBoardThreadMini } from "./BulletinBoardThreadMini";
import ThreadListHorizontal from "./ThreadListHorizontal";
// import { fetchFlightThread, fetchFlightThreads } from "../../reducers/flightBulletinBoard";
import PrimaryButton from "../atoms/PrimaryButton";
import RoundButtonReload from "../atoms/RoundButtonReload";
import { BulletinBoardResourceOperator } from "../../lib/BulletinBoardResourceOperator";
import { type closeBulletinBoardResponseModal } from "../../reducers/bulletinBoardResponseEditorModal";
import { ResponseEditorModal } from "../organisms/BulletinBoard/ResponseEditorModal";
import { FlightKey, BulletinBoard as BulletinBoardState } from "../../reducers/flightContents";
import type {
  fetchFlightThreadsAll,
  fetchFlightThreadsDetailless,
  fetchFlightThread,
  startThread,
} from "../../reducers/flightContentsBulletinBoard";

interface Props {
  flightKey: FlightKey;
  bulletinBoard: BulletinBoardState;
  fetchFlightThreadsAll: typeof fetchFlightThreadsAll;
  fetchFlightThreadsDetailless: typeof fetchFlightThreadsDetailless;
  fetchFlightThread: typeof fetchFlightThread;
  startThread: typeof startThread;
  jobAuth: JobAuth;
  closeBulletinBoardResponseModal: typeof closeBulletinBoardResponseModal;
  isFetching: boolean;
  onReload: () => void;
  dispatch: AppDispatch;
  handleCloseModal?: () => void;
  setBbEditing?: (isBbEditing: boolean) => void;
  isBbEditing?: boolean;
  handleCloseAll?: () => void;
}

interface ThreadStorage {
  [key: string]: {
    comment?: string;
    selectedComment?: BulletinBoardThreadApi.BbCmt;
  };
}

const FlightBulletinBoard: React.FC<Props> = (props) => {
  const { dispatch } = props;
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const [threadStorage, setThreadStorage] = useState<ThreadStorage>({});
  const resourceOperator = new BulletinBoardResourceOperator({ dispatch });
  const prevBulletinBoard = usePrevious(props.bulletinBoard);

  const editing = useCallback(() => {
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

  useEffect(() => {
    // リロード時のスクロール処理
    if (
      props.bulletinBoard.isNeedScroll &&
      prevBulletinBoard &&
      prevBulletinBoard.fetchedTimeStamp !== props.bulletinBoard.fetchedTimeStamp &&
      prevBulletinBoard.thread &&
      props.bulletinBoard.thread &&
      prevBulletinBoard.thread.thread.bbId === props.bulletinBoard.thread.thread.bbId
    ) {
      if (threadRef.current && messageAreaRef.current) {
        smoothScroll(messageAreaRef.current, threadRef.current.offsetHeight - messageAreaRef.current.clientHeight / 2, 30);
      }
    }
  }, [props.bulletinBoard, prevBulletinBoard]);

  useEffect(() => {
    if (props.setBbEditing && props.isBbEditing !== editing()) {
      props.setBbEditing(editing());
    }
  }, [props, editing]);

  const onStart = () => {
    if (props.bulletinBoard.threads) {
      void dispatch(
        props.startThread({
          flightKey: props.flightKey,
          flight: props.bulletinBoard.threads.flight,
        })
      );
    }
  };

  const selectThread = (bbId: number) => {
    if (!props.bulletinBoard.threads) {
      return;
    }
    const onSelect = () => {
      if (!props.bulletinBoard.threads) {
        return;
      }
      clearCommentStorage();
      void dispatch(
        props.fetchFlightThread({
          flightKey: props.flightKey,
          bbId,
          connectDbCat: props.bulletinBoard.threads.connectDbCat,
        })
      );
    };
    if (editing()) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40012C({ onYesButton: onSelect }) });
    } else {
      onSelect();
    }
  };

  const fetchThreadFileUrl = async (bbFileId: number): Promise<BulletinBoardDownloadFileApi.File | undefined> => {
    const {
      bulletinBoard: { threads },
    } = props;
    if (!threads || !threads.connectDbCat) {
      return undefined;
    }
    try {
      const params: BulletinBoardDownloadFileApi.Request = {
        fileId: bbFileId,
        connectDbCat: threads.connectDbCat,
      };
      const response = await WebApi.getBulletinBoardTheadFile(dispatch, params, {
        onForbidden: () => reloadThreadsOnError(),
      });
      return response.data.file;
    } catch (err) {
      return undefined;
    }
    return undefined;
  };

  const fetchFlightThread = (bbId: number, isNeedScroll: boolean) => {
    const {
      flightKey,
      bulletinBoard: { threads },
    } = props;
    if (threads) {
      void dispatch(props.fetchFlightThread({ flightKey, bbId, connectDbCat: threads.connectDbCat, isNeedScroll }));
    }
  };

  const fetchCurrentFlightThread = (isNeedScroll: boolean) => {
    const {
      bulletinBoard: { currentBbId },
    } = props;
    if (currentBbId !== null && currentBbId !== undefined) {
      fetchFlightThread(currentBbId, isNeedScroll);
    }
  };

  const reloadThreadsOnError = () => {
    const {
      flightKey,
      bulletinBoard: { currentBbId },
      fetchFlightThreadsDetailless,
      closeBulletinBoardResponseModal,
    } = props;
    if (currentBbId !== null && currentBbId !== undefined) {
      unselectComment(currentBbId);
    }
    dispatch(closeBulletinBoardResponseModal());
    void dispatch(fetchFlightThreadsDetailless({ flightKey }));
  };

  const deleteComment = async (cmtId: number) => {
    const {
      bulletinBoard: { currentBbId },
    } = props;
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
    } catch (err) {
      //
    }
  };

  const deleteThread = async (bbId: number) => {
    const { flightKey, fetchFlightThreadsDetailless } = props;
    try {
      await resourceOperator.deleteThread(bbId, {
        onNotFoundThread: () => reloadThreadsOnError(),
      });
      void dispatch(fetchFlightThreadsDetailless({ flightKey }));
    } catch (err) {
      // err
    }
  };

  const deleteRes = async (resId: number) => {
    try {
      await resourceOperator.deleteRes(resId, {
        onNotFoundThread: () => reloadThreadsOnError(),
        onNotFoundRes: () => fetchCurrentFlightThread(false),
      });
      fetchCurrentFlightThread(false);
    } catch (err) {
      //
    }
  };

  const createResponse = async (params: BulletinBoardAddResponse.Request) => {
    try {
      await resourceOperator.createResponse(params, {
        onForbidden: () => reloadThreadsOnError(), // レスUPDATE時の403を想定
        onNotFoundThread: () => reloadThreadsOnError(),
      });
      dispatch(props.closeBulletinBoardResponseModal());
      fetchCurrentFlightThread(true);
    } catch (err) {
      // err
    }
  };

  const updateResponse = async (params: BulletinBoardUpdateResponse.Request) => {
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
    } catch (err) {
      // err
    }
  };

  const submitComment = async (bbId: number) => {
    if (!threadStorage[bbId]) return;

    const { comment, selectedComment } = threadStorage[bbId];
    const selectedBBCmtId = selectedComment ? selectedComment.cmtId : undefined;

    if (!(comment && comment.length > 0)) return;

    if (selectedBBCmtId) {
      await resourceOperator.updateComment(
        { bbId, cmtId: selectedBBCmtId, cmtText: comment },
        {
          onForbidden: () => reloadThreadsOnError(),
          onNotFoundThread: () => reloadThreadsOnError(),
          onNotFoundComment: () => {
            unselectComment(bbId);
            fetchFlightThread(bbId, false);
          },
        }
      );
    } else {
      await resourceOperator.createComment(
        { bbId, cmtText: comment },
        {
          onForbidden: () => reloadThreadsOnError(),
          onNotFoundThread: () => reloadThreadsOnError(),
        }
      );
    }

    unselectComment(bbId);
    fetchFlightThread(bbId, !selectedBBCmtId);
  };

  const selectComment = (bbId: number, bbCmt: BulletinBoardThreadApi.BbCmt) => {
    setThreadStorage((prevThreadStorage) => ({
      ...prevThreadStorage,
      [bbId]: {
        ...prevThreadStorage[bbId],
        selectedComment: bbCmt,
        comment: bbCmt.cmtText,
      },
    }));
  };

  const unselectComment = (bbId: number) => {
    setThreadStorage((prevThreadStorage) => ({
      ...prevThreadStorage,
      [bbId]: {
        ...prevThreadStorage[bbId],
        selectedComment: undefined,
        comment: "",
      },
    }));
  };

  const changeComment = (bbId: number, comment: string) => {
    setThreadStorage((prevThreadStorage) => ({
      ...prevThreadStorage,
      [bbId]: {
        ...prevThreadStorage[bbId],
        comment,
      },
    }));
  };

  const handleUnselectComment = (bbId: number, onNoButton?: () => void) => {
    if (editing()) {
      NotificationCreator.create({
        dispatch,
        message: SoalaMessage.M40001C({
          onYesButton: () => unselectComment(bbId),
          onNoButton,
        }),
      });
    } else {
      unselectComment(bbId);
    }
  };

  const commentStorage = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!threadStorage[props.bulletinBoard.currentBbId!]) return {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return threadStorage[props.bulletinBoard.currentBbId!];
  };

  const commentProps = () => {
    const storage = commentStorage();
    return { selectedComment: storage.selectedComment, editCommentText: storage.comment };
  };

  const canThreadStart = () => funcAuthCheck(Const.FUNC_ID.updateBulletinBoard, props.jobAuth.jobAuth);

  const containingMyBbId = () => {
    const {
      bulletinBoard: { threads },
      jobAuth,
    } = props;
    return threads && threads.threads.some((thread) => thread.orgnGrpCd === jobAuth.user.grpCd);
  };

  const commentSubmitable = (): boolean => {
    const { selectedComment, comment } = commentStorage();
    if (!comment || comment.trim().length === 0) return false;
    return !selectedComment || comment !== selectedComment.cmtText;
  };

  const clearCommentStorage = () => setThreadStorage({});

  const handleClickReload = () => {
    const reload = () => {
      clearCommentStorage();
      props.onReload();
    };
    if (editing()) {
      NotificationCreator.create({
        dispatch,
        message: SoalaMessage.M40011C({
          onYesButton: reload,
        }),
      });
    } else {
      reload();
    }
  };

  const { threads, thread, currentBbId } = props.bulletinBoard;
  const { flightKey, isFetching } = props;
  return (
    <Container>
      <ResponseEditorModal
        onCreateResponse={(params) => {
          void createResponse(params);
        }}
        onUpdateResponse={(params) => {
          void updateResponse(params);
        }}
      />
      {threads && <ThreadListHorizontal currentThreadId={currentBbId || undefined} onSelectThread={selectThread} threads={threads} />}
      <ThreadContainer>
        {canThreadStart() && !currentBbId && !containingMyBbId() ? (
          <StartContainer>
            <StartButton text="Start" onClick={onStart} />
          </StartContainer>
        ) : (
          thread && (
            <BulletinBoardThreadMini
              {...commentProps()}
              flightKey={flightKey}
              onSelectComment={selectComment}
              onUnselectComment={handleUnselectComment}
              onDownloadThreadFile={fetchThreadFileUrl}
              onSubmitComment={(bbId) => {
                void submitComment(bbId);
              }}
              onChangeComment={changeComment}
              onDeleteRes={(resId) => {
                void deleteRes(resId);
              }}
              onDeleteThread={(bbId) => {
                void deleteThread(bbId);
              }}
              onDeleteComment={(cmtId) => {
                void deleteComment(cmtId);
              }}
              thread={thread}
              archiveFlg={threads ? threads.connectDbCat === "P" : false} // threadsを先に取得するので、:falseの条件には入らないはず
              editing={editing()}
              renderMesssageAreaFloatingContent={() => (
                <ModalReloadButtonContainer>
                  <RoundButtonReload isFetching={isFetching} disabled={false} onClick={handleClickReload} />
                </ModalReloadButtonContainer>
              )}
              messageAreaRef={messageAreaRef}
              threadRef={threadRef}
              handleCloseModal={props.handleCloseModal}
              commentSubmitable={commentSubmitable()}
              clearCommentStorage={clearCommentStorage}
            />
          )
        )}
      </ThreadContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: #abb3bb;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 3px 6px -3px rgba(0, 0, 0, 0.28) inset;
`;

const ThreadContainer = styled.div`
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

const StartContainer = styled.div`
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const StartButton = styled(PrimaryButton)`
  width: auto;
  padding: 4px 24px;
`;

const ModalReloadButtonContainer = styled.div`
  position: absolute;
  right: 10px;
  top: -70px;
  z-index: 1;
`;

export default FlightBulletinBoard;
