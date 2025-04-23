import React, { RefObject } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Modal from "react-modal";
import { useAppDispatch } from "../../../store/hooks";
import { SoalaMessage } from "../../../lib/soalaMessages";
import { showMessage } from "../../../reducers/bulletinBoard";
import layoutStyle from "../../../styles/layoutStyle";
import { BulletinBoardThread } from "../../molecules/BulletinBoardThread";
import { RootState } from "../../../store/storeType";
import CloseButton from "../../atoms/CloseButton";
import RoundButtonReload from "../../atoms/RoundButtonReload";

interface Props {
  reloading: boolean;
  thread: RootState["bulletinBoard"]["thread"];
  archiveFlg: boolean;
  onReload: () => void;
  onUnSetCurrentThread: () => void;
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
  editing: boolean;
  messageAreaRef: RefObject<HTMLDivElement>;
  threadRef: RefObject<HTMLDivElement>;
  commentSubmitable: boolean;
  clearCommentStorage: () => void;
  showMessage: typeof showMessage;
}

const Component: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  const close = () =>
    props.editing
      ? dispatch(
          props.showMessage({
            message: SoalaMessage.M40012C({
              onYesButton: props.onUnSetCurrentThread,
            }),
          })
        )
      : props.onUnSetCurrentThread();

  const {
    thread,
    archiveFlg,
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
    onReload,
    reloading,
    editing,
    messageAreaRef,
    threadRef,
    commentSubmitable,
    clearCommentStorage,
  } = props;

  return (
    <Container
      isOpen={!!thread}
      style={{
        overlay: {
          bottom: `calc(${layoutStyle.footer.mobile} + ${layoutStyle.header.statusBar})`,
          background: "transparent",
        },
      }}
      closeTimeoutMS={300}
    >
      <Inner>
        <Header>
          <Title>{thread && thread.thread.bbTitle}</Title>
          <StyledCloseButton
            onClick={() => {
              void close();
            }}
          />
        </Header>
        <Content>
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
              renderMesssageAreaFloatingContent={() => <ReloadButton onClick={onReload} isFetching={reloading} disabled={false} />}
              commentSubmitable={commentSubmitable}
              clearCommentStorage={clearCommentStorage}
            />
          )}
        </Content>
      </Inner>
    </Container>
  );
};

export const MobileMessageModal = connect((state: RootState) => ({
  reloading: state.bulletinBoard.isFetchingThreads || state.bulletinBoard.isFetchingThread,
}))(Component);

const Container = styled(Modal)`
  opacity: 0;
  position: absolute;
  top: 100vh;
  height: 100%;
  z-index: 100;
  transition: all 300ms;
  width: 100%;
  box-shadow: 0 -5px 8px rgba(0, 0, 0, 0.2);

  &.ReactModal__Content--after-open {
    opacity: 1;
    top: ${(props) => props.theme.layout.header.statusBar};
  }

  &.ReactModal__Content--before-close {
    opacity: 0;
    top: 100vh;
  }
`;

const ReloadButton = styled(RoundButtonReload)`
  position: absolute;
  right: 15px;
  top: -60px;
`;

const Inner = styled.article`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  background-color: #f6f6f6;
  display: flex;
  padding: 8px;
`;

const Header = styled.header`
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  height: 40px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.color.WHITE};
  margin: 0;
  font-size: 20px;
  font-weight: normal;
  line-height: 31px;
  white-space: nowrap;
  padding: 0 60px 0 40px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledCloseButton = styled(CloseButton)`
  width: 25px;
  height: 25px;
  padding: 0;
  top: auto;
  right: 15px;
`;
