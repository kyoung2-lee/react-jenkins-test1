import React, { RefObject } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { parseTimeLcl } from "../../../lib/commonUtil";
import RoundButtonReload from "../../atoms/RoundButtonReload";
import { RootState } from "../../../store/storeType";
import { BulletinBoardThread } from "../../molecules/BulletinBoardThread";

interface Props {
  timeLcl: string;
  timeDiffUtc: number | null;
  reloading: boolean;
  onReload: () => void;
  thread: RootState["bulletinBoard"]["thread"];
  archiveFlg: boolean;
  onDownloadThreadFile: (bbFileId: number) => Promise<BulletinBoardDownloadFileApi.File | undefined>;
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
  editing: boolean;
  messageAreaRef: RefObject<HTMLDivElement>;
  threadRef: RefObject<HTMLDivElement>;
  commentSubmitable: boolean;
  clearCommentStorage: () => void;
}

const Component: React.FC<Props> = (props) => {
  const {
    thread,
    onReload,
    reloading,
    onDownloadThreadFile,
    onChangeComment,
    onSubmitComment,
    onUnselectComment,
    onSelectComment,
    selectedComment,
    editCommentText,
    onDeleteComment,
    onDeleteThread,
    onDeleteRes,
    timeLcl,
    timeDiffUtc,
    archiveFlg,
    myApoCd,
    editing,
    messageAreaRef,
    threadRef,
    commentSubmitable,
    clearCommentStorage,
  } = props;
  const parsedTimeLcl = parseTimeLcl({ timeLcl, timeDiffUtc, isLocal: !!myApoCd });

  return (
    <Container>
      <PrimaryActionField>
        <PrimaryActionFieldCol>
          {timeLcl && (
            <CurrentTime>
              {parsedTimeLcl.date}
              <br />
              {parsedTimeLcl.time}
            </CurrentTime>
          )}
        </PrimaryActionFieldCol>
        <PrimaryActionFieldCol>
          <RoundButtonReload scale={0.8} onClick={onReload} isFetching={reloading} disabled={false} />
        </PrimaryActionFieldCol>
      </PrimaryActionField>
      {thread && (
        <BulletinBoardThread
          archiveFlg={archiveFlg}
          onDownloadThreadFile={onDownloadThreadFile}
          onDeleteRes={onDeleteRes}
          onDeleteThread={onDeleteThread}
          onDeleteComment={onDeleteComment}
          onChangeComment={onChangeComment}
          onSubmitComment={onSubmitComment}
          onUnselectComment={onUnselectComment}
          onSelectComment={onSelectComment}
          selectedComment={selectedComment}
          editCommentText={editCommentText}
          editing={editing}
          messageAreaRef={messageAreaRef}
          threadRef={threadRef}
          commentSubmitable={commentSubmitable}
          clearCommentStorage={clearCommentStorage}
        />
      )}
    </Container>
  );
};

export const MessagePane = connect((state: RootState) => ({
  reloading: state.bulletinBoard.isFetchingThreads || state.bulletinBoard.isFetchingThread,
}))(Component);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0px 10px 10px 0px;
  max-width: 975px;
`;

const PrimaryActionField = styled.div`
  display: flex;
  height: 60px;
  padding: 5px 10px;
  align-items: center;
  justify-content: flex-end;
`;

const PrimaryActionFieldCol = styled.div``;

const CurrentTime = styled.div`
  margin-right: 8px;
  font-size: 14px;
`;
