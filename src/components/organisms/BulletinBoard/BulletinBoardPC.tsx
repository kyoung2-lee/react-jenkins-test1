import React, { RefObject } from "react";
import styled from "styled-components";
import { MessagePane } from "./MessagePane";
import { ThreadPane } from "./ThreadPane";

interface Props {
  timeLcl: string;
  timeDiffUtc: number | null;
  currentThreadId?: number;
  threads?: BulletinBoardThreadsApi.Response;
  thread?: BulletinBoardThreadApi.Response;
  filtering: boolean;
  onSelectThread: (bbId: number) => void;
  onDownloadThreadFile: (bbFileId: number) => Promise<BulletinBoardDownloadFileApi.File | undefined>;
  searchStringParam: string;
  onOpenFilterModal: (stringParam: string) => void;
  onSubmitFilter: (stringParam: string, onSubmitCallback?: () => void) => void;
  onReload: () => void;
  onChangeComment: (bbId: number, text: string) => void;
  onSubmitComment: (bbId: number) => void;
  onUnselectComment: (bbId: number, onNoButton?: () => void) => void;
  onSelectComment: (bbId: number, bbCmt: BulletinBoardThreadApi.BbCmt) => void;
  onDeleteComment: (bbCmtId: number) => void;
  onDeleteThread: (bbId: number) => void;
  onDeleteRes: (resId: number) => void;
  selectedComment?: BulletinBoardThreadApi.BbCmt;
  editCommentText?: string;
  myApoCd: string;
  onChangeFilterString: (filterString: string, onAccept: () => void) => void;
  editing: boolean;
  messageAreaRef: RefObject<HTMLDivElement>;
  threadRef: RefObject<HTMLDivElement>;
  commentSubmitable: boolean;
  clearCommentStorage: () => void;
}

export const BulletinBoardPC = (props: Props) => (
  <Container>
    <ThreadPane
      filtering={props.filtering}
      onChangeFilterString={props.onChangeFilterString}
      onOpenFilterModal={props.onOpenFilterModal}
      onSubmitFilter={props.onSubmitFilter}
      searchStringParam={props.searchStringParam}
      threads={props.threads}
      currentThreadId={props.currentThreadId}
      onSelectThread={props.onSelectThread}
      editing={props.editing}
      jstFlg={!!props.thread && props.thread.jstFlg}
    />
    <MessagePane
      archiveFlg={props.threads ? props.threads.archiveFlg : false} // threadsを先に取得するので、:falseの条件には入らないはず
      timeLcl={props.timeLcl}
      timeDiffUtc={props.timeDiffUtc}
      onDownloadThreadFile={props.onDownloadThreadFile}
      onDeleteRes={props.onDeleteRes}
      onDeleteThread={props.onDeleteThread}
      onDeleteComment={props.onDeleteComment}
      onChangeComment={props.onChangeComment}
      onSubmitComment={props.onSubmitComment}
      onUnselectComment={props.onUnselectComment}
      onSelectComment={props.onSelectComment}
      selectedComment={props.selectedComment}
      editCommentText={props.editCommentText}
      thread={props.thread}
      onReload={props.onReload}
      myApoCd={props.myApoCd}
      editing={props.editing}
      messageAreaRef={props.messageAreaRef}
      threadRef={props.threadRef}
      commentSubmitable={props.commentSubmitable}
      clearCommentStorage={props.clearCommentStorage}
    />
  </Container>
);

const Container = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  max-width: 1366px;
  margin: auto;
`;
