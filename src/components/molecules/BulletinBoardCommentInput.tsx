import React, { useRef } from "react";
import styled from "styled-components";
import { CommentInput } from "../organisms/BulletinBoard/CommentInput";
import { storage } from "../../lib/storage";
import closeIconSvg from "../../assets/images/icon/icon-close.svg";
import { useAppSelector } from "../../store/hooks";

interface Props {
  onChangeComment: (bbId: number, text: string) => void;
  onSubmitComment: (bbId: number) => void;
  selectedComment?: BulletinBoardThreadApi.BbCmt;
  editCommentText?: string;
  bbId: number;
  renderMesssageAreaFloatingContent?(): React.ReactNode;
  isMini?: boolean;
  commentSubmitable: boolean;
  onUnselectComment(bbId: number, onNoButton?: () => void): void;
  disabled: boolean;
}

export const BulletinBoardCommentInput: React.FC<Props> = (props) => {
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const profileImg = useRef<string>(
    props.selectedComment
      ? `data:image/png;base64,${props.selectedComment.postUser.profileTmbImg}`
      : jobAuth.user.profileImg
      ? `data:image/png;base64,${jobAuth.user.profileImg}`
      : ""
  );

  const clear = () => {
    const onNoButton = () => {
      textAreaRef.current?.focus();
    };
    props.onUnselectComment(props.bbId, onNoButton);
  };

  const isEdit = () => props.selectedComment && props.selectedComment.updateTime;

  const { isIphone } = storage;

  return (
    <Container isMini={props.isMini}>
      {isEdit() && (
        <EditActionContainer>
          <CloseIcon onClick={clear} />
        </EditActionContainer>
      )}
      <Content isMini={props.isMini} isIphone={isIphone}>
        <ContentWrapper>
          <CommentInput
            // eslint-disable-next-line no-return-assign
            setTextAreaRef={(e) => (textAreaRef.current = e)}
            bbId={props.bbId}
            selectedBBCmtId={props.selectedComment ? props.selectedComment.cmtId : undefined}
            onSubmit={props.onSubmitComment}
            onChangeText={props.onChangeComment}
            text={props.editCommentText || ""}
            updateTime={props.selectedComment ? props.selectedComment.updateTime : ""}
            submitable={props.commentSubmitable}
            disabled={props.disabled}
            profileImg={profileImg.current}
          />
          {isEdit() && (
            <MetaContainer>
              {props.selectedComment && props.selectedComment.editFlg && <EditLabel>*Edited*</EditLabel>}
              {props.selectedComment ? <UpdateTime>{props.selectedComment.updateTime}</UpdateTime> : null}
            </MetaContainer>
          )}
        </ContentWrapper>
      </Content>
      {props.renderMesssageAreaFloatingContent && props.renderMesssageAreaFloatingContent()}
    </Container>
  );
};

const Container = styled.div<{ isMini?: boolean }>`
  ${(props) => props.isMini && "margin: 0 -6px; background: #fff;"};
  padding: 12px;
  min-height: 60px;
  border: 1px solid #c9d3d0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.22);
`;

const ContentWrapper = styled.div`
  width: 100%;
`;

const Content = styled.div<{ isMini?: boolean; isIphone: boolean }>`
  display: flex;
  width: 100%;
  flex: 1;
  padding: ${(props) => (props.isMini || props.isIphone ? "0" : "0 3px")};
  align-items: center;
  max-width: 613px;
  justify-content: center;
`;

const MetaContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  margin-right: 35px;
`;

const EditLabel = styled.div`
  font-size: 12px;
  margin-right: 8px;
`;

const UpdateTime = styled.div`
  font-size: 13px;
`;

const CloseIcon = styled.img.attrs({ src: closeIconSvg })`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const EditActionContainer = styled.div`
  padding-bottom: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
