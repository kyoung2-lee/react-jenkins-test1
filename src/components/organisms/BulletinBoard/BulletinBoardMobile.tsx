import React, { RefObject } from "react";
import styled from "styled-components";
import { showMessage } from "../../../reducers/bulletinBoard";
import { MobileThreadPane } from "./MobileThreadPane";
import { MobileMessageModal } from "./MobileMessageModal";

interface Props {
  currentThreadId?: number;
  threads?: BulletinBoardThreadsApi.Response;
  thread?: BulletinBoardThreadApi.Response;
  filtering: boolean;
  searchStringParam: string;
  onSelectThread: (bbId: number) => void;
  onDownloadThreadFile: (bbFileId: number) => Promise<BulletinBoardDownloadFileApi.File | undefined>;
  onOpenFilterModal: (stringParam: string) => void;
  onSubmitFilter: (stringParam: string, onSubmitCallback?: () => void) => void;
  onReload: () => void;
  onUnSetCurrentThread: () => void;
  onChangeComment: (bbId: number, text: string) => void;
  onSubmitComment: (bbId: number) => void;
  onUnselectComment: (bbId: number, onNoButton?: () => void) => void;
  onSelectComment: (bbId: number, bbCmt: BulletinBoardThreadApi.BbCmt) => void;
  onDeleteComment: (bbCmtId: number) => void;
  onDeleteThread: (bbId: number) => void;
  onDeleteRes: (resId: number) => void;
  selectedComment?: BulletinBoardThreadApi.BbCmt;
  editCommentText?: string;
  onChangeFilterString: (filterString: string, onAccept: () => void) => void;
  editing: boolean;
  messageAreaRef: RefObject<HTMLDivElement>;
  threadRef: RefObject<HTMLDivElement>;
  commentSubmitable: boolean;
  clearCommentStorage: () => void;
  showMessage: typeof showMessage;
}

export const BulletinBoardMobile: React.FC<Props> = (props) => (
  <Container>
    <MobileThreadPane
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
    <MobileMessageModal
      archiveFlg={props.threads ? props.threads.archiveFlg : false} // threadsを先に取得するので、:falseの条件には入らないはず
      onReload={props.onReload}
      thread={props.thread}
      onUnSetCurrentThread={props.onUnSetCurrentThread}
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
      editing={props.editing}
      messageAreaRef={props.messageAreaRef}
      threadRef={props.threadRef}
      commentSubmitable={props.commentSubmitable}
      clearCommentStorage={props.clearCommentStorage}
      showMessage={props.showMessage}
    />
  </Container>
);

const Container = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`;
