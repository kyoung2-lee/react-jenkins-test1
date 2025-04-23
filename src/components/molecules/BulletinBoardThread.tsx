import React, { createRef, MouseEvent, RefObject, TouchEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import { ThreadMessageItem } from "../organisms/BulletinBoard/ThreadMessageItem";
import { TheadMessageResponseItem } from "../organisms/BulletinBoard/TheadMessageResponseItem";
import { CommentItem } from "../organisms/BulletinBoard/CommentItem";
import { BulletinBoardCommentInput } from "./BulletinBoardCommentInput";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ReactionRegisterList } from "../organisms/BulletinBoard/ReactionRegisterList";
import { setReactionRegistPopupStatus } from "../../reducers/bulletinBoardReactionRegistPopup";
import { toggleThreadReaction, toggleResponseReaction, toggleCommentReaction } from "../../reducers/bulletinBoard";

interface Props {
  onDownloadThreadFile: (bbFileId: number) => Promise<BulletinBoardDownloadFileApi.File | undefined>;
  onChangeComment: (bbId: number, text: string) => void;
  onSubmitComment: (bbId: number) => void;
  onUnselectComment: (bbId: number, onNoButton?: () => void) => void;
  onSelectComment: (bbId: number, bbCmt: BulletinBoardThreadApi.BbCmt) => void;
  archiveFlg: boolean;
  selectedComment?: BulletinBoardThreadApi.BbCmt;
  editCommentText?: string;
  onDeleteComment: (bbCmtId: number) => void;
  onDeleteThread: (bbId: number) => void;
  onDeleteRes: (resId: number) => void;
  editing: boolean;
  messageAreaRef: RefObject<HTMLDivElement>;
  threadRef: RefObject<HTMLDivElement>;
  renderMesssageAreaFloatingContent?: () => React.ReactNode;
  commentSubmitable: boolean;
  clearCommentStorage: () => void;
}

export const BulletinBoardThread: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const thread = useAppSelector((state) => state.bulletinBoard.thread) as BulletinBoardThreadApi.Response;
  const registPopupStatus = useAppSelector((state) => state.bulletinBoardReactionRegistPopup);

  const containerRef = createRef<HTMLDivElement>();
  const threadMessageRef = createRef<HTMLDivElement>();
  const threadResponseRefList = useRef<HTMLDivElement[]>([]);
  const threadCommentRefList = useRef<HTMLDivElement[]>([]);
  const timeoutLongTapThreadMessage = useRef<NodeJS.Timeout | null>(null);
  const timeoutLongTapThreadResponse = useRef<NodeJS.Timeout | null>(null);
  const timeoutLongTapComment = useRef<NodeJS.Timeout | null>(null);

  const [isOpenActionMenu, setIsOpenActionMenu] = useState(false);
  const [, setLongTapTriggered] = useState(false);

  // スレッド表示部分の上端がスクロール部分からはみ出している場合、スクロール部分の最上部にポップアップを表示する制御のために使用する
  const [isVisibleScreenRegisterPopup, setIsVisibleScreenRegisterPopup] = useState(false);

  // スレッド表示部分の上端がスクロール部分の上端より下にある場合、スレッド表示部分の最上部にポップアップを表示する制御のために使用する
  // （スレッド表示部分の上端は通常スクロール部分の上端より上に来るため、この値は通常では使われない）
  const [isVisibleThreadRegisterPopup, setIsVisibleThreadRegisterPopup] = useState(false);
  const [isVisibleResponseRegisterPopupMap, setIsVisibleResponseRegisterPopupMap] = useState<{ [responseIndex: number]: boolean }>({});
  const [isVisibleCommentRegisterPopupMap, setIsVisibleCommentRegisterPopupMap] = useState<{ [commentIndex: number]: boolean }>({});

  const [isVisibleThreadDetailPopup, setIsVisibleThreadDetailPopup] = useState(false);
  const [isVisibleResponseDetailPopupMap, setIsVisibleResponseDetailPopupMap] = useState<{ [responseIndex: number]: boolean }>({});
  const [isVisibleCommentDetailPopupMap, setIsVisibleCommentDetailPopupMap] = useState<{ [commentIndex: number]: boolean }>({});

  // スマホ・タブレットでのスクロール量を取得するために使用する
  const [prevScrollTop, setPrevScrollTop] = useState(0);
  const [totalScroll, setTotalScroll] = useState(0);

  const reactionRegisterPopupScreenStyle = useMemo(() => {
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
  }, [registPopupStatus.popupTargetType]);

  const setIsVisibleResponseDetailPopup = useCallback(
    (responseIndex: number, isVisible: boolean) => {
      setIsVisibleResponseDetailPopupMap((originalMap) =>
        Array.from({ length: thread.thread.bbResList.length }, (_, i) => i).reduce<{ [responseIndex: number]: boolean }>(
          (acc, item) => ({
            ...acc,
            [item]: item === responseIndex ? isVisible : originalMap[item] ?? false,
          }),
          {}
        )
      );
    },
    [thread.thread.bbResList.length]
  );
  const setIsVisibleCommentDetailPopup = useCallback(
    (commentIndex: number, isVisible: boolean) => {
      setIsVisibleCommentDetailPopupMap((originalMap) =>
        Array.from({ length: thread.thread.bbCmtList.length }, (_, i) => i).reduce<{ [commentIndex: number]: boolean }>(
          (acc, item) => ({
            ...acc,
            [item]: item === commentIndex ? isVisible : originalMap[item] ?? false,
          }),
          {}
        )
      );
    },
    [thread.thread.bbCmtList.length]
  );

  // 別スレッドを読み込んだ際、スクロール位置をそのスレッドの一番上に合わせる
  useEffect(() => {
    const { messageAreaRef } = props;
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTo({ top: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread.thread.bbId]);

  const closeAllReactionRegisterPopup = useCallback(() => {
    setIsVisibleScreenRegisterPopup(false);
    setIsVisibleThreadRegisterPopup(false);
    setIsVisibleResponseRegisterPopupMap((originalMap) =>
      Object.entries(originalMap).reduce((acc, [key]) => ({ ...acc, [Number(key)]: false }), {})
    );
    setIsVisibleCommentRegisterPopupMap((originalMap) =>
      Object.entries(originalMap).reduce((acc, [key]) => ({ ...acc, [Number(key)]: false }), {})
    );
    setIsVisibleThreadDetailPopup(false);
    setIsVisibleResponseDetailPopupMap((originalMap) =>
      Object.entries(originalMap).reduce((acc, [key]) => ({ ...acc, [Number(key)]: false }), {})
    );
    setIsVisibleCommentDetailPopupMap((originalMap) =>
      Object.entries(originalMap).reduce((acc, [key]) => ({ ...acc, [Number(key)]: false }), {})
    );
  }, []);

  const displayThreadMessageRegisterPopup = useCallback(() => {
    const scrollComponentTop = props.messageAreaRef.current?.getBoundingClientRect().top ?? 0;
    const threadMessageTop = threadMessageRef.current?.getBoundingClientRect().top ?? 0;

    dispatch(
      setReactionRegistPopupStatus({
        popupTargetType: "thread",
        popupTargetId: thread.thread.bbId,
      })
    );
    if (Math.floor(threadMessageTop) > Math.floor(scrollComponentTop) + 12) {
      setIsVisibleThreadRegisterPopup(true);
      setIsVisibleScreenRegisterPopup(false);
    } else {
      setIsVisibleScreenRegisterPopup(true);
      setIsVisibleThreadRegisterPopup(false);
    }
  }, [thread, threadMessageRef, dispatch, props.messageAreaRef]);

  const handleMouseOverThreadMessage = useCallback(() => {
    if (!storage.isPc || !!props.archiveFlg) {
      return;
    }
    displayThreadMessageRegisterPopup();
  }, [props.archiveFlg, displayThreadMessageRegisterPopup]);

  const handleLongTapThreadMessage = useCallback(() => {
    if ((!storage.isIpad && !storage.isIphone) || !!props.archiveFlg) {
      return;
    }
    displayThreadMessageRegisterPopup();
  }, [props.archiveFlg, displayThreadMessageRegisterPopup]);

  const handleMouseOutThreadMessage = useCallback(() => {
    if (!storage.isPc || !!props.archiveFlg) {
      return;
    }
    setIsVisibleScreenRegisterPopup(false);
    setIsVisibleThreadRegisterPopup(false);
  }, [props.archiveFlg]);

  const handleTouchStartThreadMessage = useCallback(
    (event: TouchEvent) => {
      if (!storage.isIpad && !storage.isIphone) {
        return;
      }
      setPrevScrollTop(props.messageAreaRef.current?.scrollTop ?? 0);
      setTotalScroll(0);
      timeoutLongTapThreadMessage.current = setTimeout(() => {
        closeAllReactionRegisterPopup();
        handleLongTapThreadMessage();
        setLongTapTriggered(true);
      }, 600);
      event.stopPropagation();
    },
    [closeAllReactionRegisterPopup, handleLongTapThreadMessage, props.messageAreaRef]
  );

  const handleTouchEndThreadMessage = useCallback(
    (event: TouchEvent) => {
      if (!storage.isIpad && !storage.isIphone) {
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
    },
    [closeAllReactionRegisterPopup]
  );

  const displayThreadResponseRegisterPopup = useCallback(
    (responseIndex: number) => {
      const scrollComponentTop = props.messageAreaRef.current?.getBoundingClientRect().top ?? 0;
      const threadResponseTop = threadResponseRefList.current[responseIndex].getBoundingClientRect().top ?? 0;

      dispatch(
        setReactionRegistPopupStatus({
          popupTargetType: "response",
          popupTargetId: thread.thread.bbResList[responseIndex].resId,
        })
      );
      if (Math.floor(threadResponseTop) > Math.floor(scrollComponentTop) + 12) {
        setIsVisibleResponseRegisterPopupMap({ [responseIndex]: true });
        setIsVisibleScreenRegisterPopup(false);
      } else {
        setIsVisibleScreenRegisterPopup(true);
        setIsVisibleResponseRegisterPopupMap({ [responseIndex]: false });
      }
    },
    [thread, threadResponseRefList, dispatch, props.messageAreaRef]
  );

  const handleMouseOverThreadResponse = useCallback(
    (responseIndex: number) => {
      if (!storage.isPc || !!props.archiveFlg) {
        return;
      }
      displayThreadResponseRegisterPopup(responseIndex);
    },
    [props.archiveFlg, displayThreadResponseRegisterPopup]
  );

  const handleLongTapThreadResponse = useCallback(
    (responseIndex: number) => {
      if ((!storage.isIpad && !storage.isIphone) || !!props.archiveFlg) {
        return;
      }
      displayThreadResponseRegisterPopup(responseIndex);
    },
    [props.archiveFlg, displayThreadResponseRegisterPopup]
  );

  const handleMouseOutThreadResponse = useCallback(
    (responseIndex: number) => {
      if (!storage.isPc || !!props.archiveFlg) {
        return;
      }
      setIsVisibleScreenRegisterPopup(false);
      setIsVisibleResponseRegisterPopupMap({ [responseIndex]: false });
    },
    [props.archiveFlg]
  );

  const handleTouchStartThreadResponse = useCallback(
    (responseIndex: number, event: TouchEvent) => {
      if (!storage.isIpad && !storage.isIphone) {
        return;
      }
      setPrevScrollTop(props.messageAreaRef.current?.scrollTop ?? 0);
      setTotalScroll(0);
      timeoutLongTapThreadResponse.current = setTimeout(() => {
        closeAllReactionRegisterPopup();
        handleLongTapThreadResponse(responseIndex);
        setLongTapTriggered(true);
      }, 600);
      event.stopPropagation();
    },
    [closeAllReactionRegisterPopup, handleLongTapThreadResponse, props.messageAreaRef]
  );

  const handleTouchEndThreadResponse = useCallback(
    (event: TouchEvent) => {
      if (!storage.isIpad && !storage.isIphone) {
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
    },
    [closeAllReactionRegisterPopup]
  );

  const displayCommentRegisterPopup = useCallback(
    (commentIndex: number) => {
      const scrollComponentTop = props.messageAreaRef.current?.getBoundingClientRect().top ?? 0;
      const threadCommentTop = threadCommentRefList.current[commentIndex].getBoundingClientRect().top ?? 0;

      dispatch(
        setReactionRegistPopupStatus({
          popupTargetType: "comment",
          popupTargetId: thread.thread.bbCmtList[commentIndex].cmtId,
        })
      );
      if (Math.floor(threadCommentTop) > Math.floor(scrollComponentTop) - 5) {
        setIsVisibleCommentRegisterPopupMap({ [commentIndex]: true });
        setIsVisibleScreenRegisterPopup(false);
      } else {
        setIsVisibleScreenRegisterPopup(true);
        setIsVisibleCommentRegisterPopupMap({ [commentIndex]: false });
      }
    },
    [thread, threadCommentRefList, dispatch, props.messageAreaRef]
  );

  const handleMouseOverComment = useCallback(
    (commentIndex: number) => {
      if (!storage.isPc || !!props.archiveFlg) {
        return;
      }
      displayCommentRegisterPopup(commentIndex);
    },
    [props.archiveFlg, displayCommentRegisterPopup]
  );

  const handleLongTapComment = useCallback(
    (commentIndex: number) => {
      if ((!storage.isIpad && !storage.isIphone) || !!props.archiveFlg) {
        return;
      }
      displayCommentRegisterPopup(commentIndex);
    },
    [props.archiveFlg, displayCommentRegisterPopup]
  );

  const handleMouseOutComment = useCallback(
    (commentIndex: number) => {
      if (!storage.isPc || !!props.archiveFlg) {
        return;
      }
      setIsVisibleScreenRegisterPopup(false);
      setIsVisibleCommentRegisterPopupMap({ [commentIndex]: false });
    },
    [props.archiveFlg]
  );

  const handleTouchStartComment = useCallback(
    (commentIndex: number, event: TouchEvent) => {
      if (!storage.isIpad && !storage.isIphone) {
        return;
      }
      setPrevScrollTop(props.messageAreaRef.current?.scrollTop ?? 0);
      setTotalScroll(0);
      timeoutLongTapComment.current = setTimeout(() => {
        closeAllReactionRegisterPopup();
        handleLongTapComment(commentIndex);
        setLongTapTriggered(true);
      }, 600);
      event.stopPropagation();
    },
    [closeAllReactionRegisterPopup, handleLongTapComment, props.messageAreaRef]
  );

  const handleTouchEndComment = useCallback(
    (event: TouchEvent) => {
      if (!storage.isIpad && !storage.isIphone) {
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
    },
    [closeAllReactionRegisterPopup]
  );

  const handleMouseOverScreenPopup = useCallback(() => {
    if (props.archiveFlg) {
      return;
    }
    setIsVisibleScreenRegisterPopup(true);
    setIsVisibleThreadRegisterPopup(false);
  }, [props.archiveFlg]);

  const handleMouseOutScreenPopup = useCallback(() => {
    if (props.archiveFlg) {
      return;
    }
    setIsVisibleScreenRegisterPopup(false);
  }, [props.archiveFlg]);

  const handleTouchContainer = useCallback(() => {
    if (!storage.isIpad && !storage.isIphone) {
      return;
    }
    closeAllReactionRegisterPopup();
  }, [closeAllReactionRegisterPopup]);

  const handleScroll = useCallback(() => {
    if (!storage.isIpad && !storage.isIphone) {
      return;
    }
    const currentScroll = props.messageAreaRef.current?.scrollTop ?? 0;
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

  const handleClickOutside = useCallback(
    (event: Event) => {
      const isInsideClick = containerRef.current?.contains(event.target as Node);
      if (isInsideClick) {
        return;
      }
      closeAllReactionRegisterPopup();
    },
    [containerRef, closeAllReactionRegisterPopup]
  );

  const clickStopPropagationHandler = useCallback((event: MouseEvent) => {
    if (!storage.isPc) {
      return;
    }
    event.stopPropagation();
  }, []);
  const touchStopPropagationHandler = useCallback((event: TouchEvent) => {
    if (!storage.isIpad && !storage.isIphone) {
      return;
    }
    event.stopPropagation();
  }, []);

  const handleClickThreadReactionButton = useCallback(
    (params: BulletinBoardThreadReactionApi.Request) => {
      void dispatch(toggleThreadReaction({ params }));
    },
    [dispatch]
  );

  const handleClickResponseReactionButton = useCallback(
    (params: BulletinBoardResponseReactionApi.Request) => {
      void dispatch(toggleResponseReaction({ params }));
    },
    [dispatch]
  );

  const handleClickCommentReactionButton = useCallback(
    (params: BulletinBoardCommentReactionApi.Request) => {
      void dispatch(toggleCommentReaction({ params }));
    },
    [dispatch]
  );

  const toggleActionMenu = () => setIsOpenActionMenu((prevIsOpenActionMenu) => !prevIsOpenActionMenu);

  const selectedBBCmtId = () => (props.selectedComment ? props.selectedComment.cmtId : undefined);

  React.useEffect(() => {
    document.addEventListener(storage.terminalCat === Const.TerminalCat.pc ? "click" : "touchstart", handleClickOutside);
    return () => {
      document.removeEventListener(storage.terminalCat === Const.TerminalCat.pc ? "click" : "touchstart", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container ref={containerRef} onTouchStart={handleTouchContainer}>
      <MessageArea ref={props.messageAreaRef} isOpenActionMenu={isOpenActionMenu} onScroll={handleScroll}>
        <Thread ref={props.threadRef}>
          <MouseFloatingWrapper
            ref={threadMessageRef}
            onMouseOver={handleMouseOverThreadMessage}
            onMouseOut={handleMouseOutThreadMessage}
            onTouchStart={handleTouchStartThreadMessage}
            onTouchEnd={handleTouchEndThreadMessage}
          >
            <ThreadMessageItem
              thread={thread}
              archiveFlg={props.archiveFlg}
              onDownloadThreadFile={props.onDownloadThreadFile}
              onDelete={props.onDeleteThread}
              onClickThreadReactionButton={handleClickThreadReactionButton}
              editing={props.editing}
              clearCommentStorage={props.clearCommentStorage}
              toggleActionMenu={toggleActionMenu}
              isVisibleReactionDetailPopup={isVisibleThreadDetailPopup}
              setIsVisibleReactionDetailPopup={setIsVisibleThreadDetailPopup}
            />
            <ReactionRegisterPopupThreadWrapper
              isVisible={isVisibleThreadRegisterPopup}
              onClick={clickStopPropagationHandler}
              onTouchStart={touchStopPropagationHandler}
              onTouchEnd={touchStopPropagationHandler}
            >
              <ReactionRegisterList
                thread={thread}
                onClickThreadReactionButton={handleClickThreadReactionButton}
                onClickResponseReactionButton={handleClickResponseReactionButton}
                onClickCommentReactionButton={handleClickCommentReactionButton}
              />
            </ReactionRegisterPopupThreadWrapper>
          </MouseFloatingWrapper>
          {thread.thread.bbResList.map((response, responseIndex) => (
            <MouseFloatingWrapper
              key={`response_${response.resId}`}
              ref={(node: HTMLDivElement) => {
                threadResponseRefList.current[responseIndex] = node;
              }}
              onMouseOver={() => handleMouseOverThreadResponse(responseIndex)}
              onMouseOut={() => handleMouseOutThreadResponse(responseIndex)}
              onTouchStart={(event) => handleTouchStartThreadResponse(responseIndex, event)}
              onTouchEnd={handleTouchEndThreadResponse}
            >
              <TheadMessageResponseItem
                onDelete={props.onDeleteRes}
                onClickResponseReactionButton={handleClickResponseReactionButton}
                bbId={thread.thread.bbId}
                response={response}
                editing={props.editing}
                archiveFlg={props.archiveFlg}
                clearCommentStorage={props.clearCommentStorage}
                toggleActionMenu={toggleActionMenu}
                jstFlg={thread.jstFlg}
                isVisibleReactionDetailPopup={isVisibleResponseDetailPopupMap[responseIndex]}
                setIsVisibleReactionDetailPopup={(isVisible) => setIsVisibleResponseDetailPopup(responseIndex, isVisible)}
              />
              <ReactionRegisterPopupResponseWrapper
                isIphone={storage.isIphone}
                isVisible={isVisibleResponseRegisterPopupMap[responseIndex]}
                onClick={clickStopPropagationHandler}
                onTouchStart={touchStopPropagationHandler}
                onTouchEnd={touchStopPropagationHandler}
              >
                <ReactionRegisterList
                  thread={thread}
                  onClickThreadReactionButton={handleClickThreadReactionButton}
                  onClickResponseReactionButton={handleClickResponseReactionButton}
                  onClickCommentReactionButton={handleClickCommentReactionButton}
                />
              </ReactionRegisterPopupResponseWrapper>
            </MouseFloatingWrapper>
          ))}
        </Thread>
        <Comment>
          <CommentTitle>Comments</CommentTitle>
          {thread.thread.bbCmtList.map((comment, commentIndex) => (
            <MouseFloatingWrapper
              key={`comment_${comment.cmtId}`}
              ref={(node: HTMLDivElement) => {
                threadCommentRefList.current[commentIndex] = node;
              }}
              onMouseOver={() => handleMouseOverComment(commentIndex)}
              onMouseOut={() => handleMouseOutComment(commentIndex)}
              onTouchStart={(event) => handleTouchStartComment(commentIndex, event)}
              onTouchEnd={handleTouchEndComment}
            >
              <CommentItem
                bbId={thread.thread.bbId}
                selecting={comment.cmtId === selectedBBCmtId()}
                onDelete={props.onDeleteComment}
                onSelect={props.onSelectComment}
                onClickThreadReactionButton={handleClickThreadReactionButton}
                onClickResponseReactionButton={handleClickResponseReactionButton}
                onClickCommentReactionButton={handleClickCommentReactionButton}
                thread={thread}
                comment={comment}
                editing={props.editing}
                archiveFlg={props.archiveFlg}
                clearCommentStorage={props.clearCommentStorage}
                toggleActionMenu={toggleActionMenu}
                jstFlg={thread.jstFlg}
                isVisibleReactionDetailPopup={isVisibleCommentDetailPopupMap[commentIndex]}
                setIsVisibleReactionDetailPopup={(isVisible) => setIsVisibleCommentDetailPopup(commentIndex, isVisible)}
                isVisibleReactionRegisterPopup={isVisibleCommentRegisterPopupMap[commentIndex]}
              />
            </MouseFloatingWrapper>
          ))}
        </Comment>
        {storage.isIphone ? <BlankContent /> : null}
      </MessageArea>
      <BulletinBoardCommentInput
        bbId={thread.thread.bbId}
        onSubmitComment={props.onSubmitComment}
        onChangeComment={props.onChangeComment}
        selectedComment={props.selectedComment}
        editCommentText={props.editCommentText}
        renderMesssageAreaFloatingContent={props.renderMesssageAreaFloatingContent}
        commentSubmitable={props.commentSubmitable}
        onUnselectComment={props.onUnselectComment}
        disabled={props.archiveFlg}
      />
      <ReactionRegisterPopupScreenWrapper
        isVisible={isVisibleScreenRegisterPopup}
        onMouseOver={handleMouseOverScreenPopup}
        onMouseOut={handleMouseOutScreenPopup}
        onTouchStart={touchStopPropagationHandler}
        onTouchEnd={touchStopPropagationHandler}
        style={reactionRegisterPopupScreenStyle}
      >
        <ReactionRegisterList
          onClickThreadReactionButton={handleClickThreadReactionButton}
          onClickResponseReactionButton={handleClickResponseReactionButton}
          onClickCommentReactionButton={handleClickCommentReactionButton}
          thread={thread}
        />
      </ReactionRegisterPopupScreenWrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  background-color: #f9f9f9;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.22);
`;

const MessageArea = styled.div<{ isMenuActive?: boolean; isOpenActionMenu: boolean }>`
  flex: 1;
  flex-basis: 0;
  overflow-y: scroll;
  ${(props) => (props.isOpenActionMenu ? "" : "-webkit-overflow-scrolling: touch;")}
  ::-webkit-scrollbar {
    display: none;
  }
  word-break: break-word;
`;

const Thread = styled.div`
  border-bottom: 1px solid #abb3bb;
  padding: 0 5px 25px;
`;

const Comment = styled.div`
  padding: 25px 0 10px 0;
`;

const MouseFloatingWrapper = styled.div`
  position: relative;
`;

const ReactionRegisterPopupWrapper = styled.div<{ isVisible: boolean }>`
  position: absolute;
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  transition: visibility 0.1s, opacity 0.1s;
  z-index: 1;
`;
const ReactionRegisterPopupScreenWrapper = styled(ReactionRegisterPopupWrapper)``;
const ReactionRegisterPopupThreadWrapper = styled(ReactionRegisterPopupWrapper)`
  top: -4px;
  left: 5px;
`;
const ReactionRegisterPopupResponseWrapper = styled(ReactionRegisterPopupWrapper)<{ isIphone: boolean }>`
  top: -30px;
  left: 5px;
`;

const CommentTitle = styled.p`
  margin: 0 0 5px 0;
  padding: 0 15px;
  font-size: 18px;
  color: #2fadbd;
`;

const BlankContent = styled.div`
  height: 60px;
`;
