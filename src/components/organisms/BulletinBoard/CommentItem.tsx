import dayjs from "dayjs";
import React, { useCallback, useMemo, MouseEvent, TouchEvent } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { MessagePostedAt } from "./MessagePostedAt";
import { PostUser } from "./PostUser";
import { ActionMenu } from "./ActionMenu";
import { ReactionRegisterList } from "./ReactionRegisterList";
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/storeType";
import * as accountActions from "../../../reducers/account";
import HyperLinkedText from "../../atoms/HyperLinkedText";
import CommentHornSvg from "../../../assets/images/comment-horn.svg";
import { ReactionButtonList } from "./ReactionButtonList";
import { storage } from "../../../lib/storage";

interface Props {
  jobAuth: accountActions.JobAuth;
  bbId: number;
  thread: BulletinBoardThreadApi.Response;
  comment: Required<RootState["bulletinBoard"]>["thread"]["thread"]["bbCmtList"][0];
  selecting?: boolean;
  onSelect: (bbId: number, bbCmt: BulletinBoardThreadApi.BbCmt) => void;
  onDelete: (bbCmtId: number) => void;
  onClickThreadReactionButton: (params: BulletinBoardThreadReactionApi.Request) => void;
  onClickResponseReactionButton: (params: BulletinBoardResponseReactionApi.Request) => void;
  onClickCommentReactionButton: (params: BulletinBoardCommentReactionApi.Request) => void;
  editing: boolean;
  archiveFlg: boolean;
  clearCommentStorage: () => void;
  toggleActionMenu: () => void;
  jstFlg: boolean;
  isVisibleReactionDetailPopup: boolean;
  setIsVisibleReactionDetailPopup: (isVisible: boolean) => void;
  isVisibleReactionRegisterPopup: boolean;
}

const Component: React.FC<Props> = ({
  bbId,
  comment,
  onSelect,
  onDelete,
  onClickThreadReactionButton,
  onClickResponseReactionButton,
  onClickCommentReactionButton,
  selecting,
  jobAuth,
  editing,
  archiveFlg,
  clearCommentStorage,
  toggleActionMenu,
  jstFlg,
  isVisibleReactionDetailPopup,
  setIsVisibleReactionDetailPopup,
  isVisibleReactionRegisterPopup,
  thread,
}) => {
  // B.B. 画面から開いているか、便カテゴリの小ウィンドウから開いているかを判別するために使う
  // どちらか一方からのみ掲示板画面を開いているという想定のため、両方から開いている場合には別の対処をする必要がある
  const flightContents = useAppSelector((state) => state.flightContents.contents);

  const { postUser } = comment;

  const isBBMiniScreen = useMemo(() => {
    if (storage.isIphone) {
      return true;
    }
    return flightContents.some((item) => item.bulletinBoard?.thread?.thread);
  }, [flightContents]);

  const deleteComment = () => {
    onDelete(comment.cmtId);
  };

  const selectComment = () => {
    const bbCmt: BulletinBoardThreadApi.BbCmt = {
      ...comment,
      updateTime: `${dayjs(comment.updateTime).format("YYYY/MM/DD HH:mm")}${jstFlg ? "" : "L"}`,
    };
    onSelect(bbId, bbCmt);
  };

  const handleClickReaction = useCallback(
    (racType: string) => {
      const isAlreadyReactioned = comment.bbCmtRacList.some((bbCmtRacItem) => {
        if (bbCmtRacItem.racType !== racType) {
          return false;
        }
        return bbCmtRacItem.racUser.some((racUserItem) => racUserItem.userId === jobAuth.user.userId);
      });
      onClickCommentReactionButton({
        cmtId: comment.cmtId,
        funcType: isAlreadyReactioned ? 2 : 1,
        racType,
      });
    },
    [comment, jobAuth, onClickCommentReactionButton]
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

  const me = () => jobAuth.user.jobCd === postUser.jobCd;

  const editable = () => !archiveFlg && me();

  const actions = [
    ...(editable()
      ? [
          { title: "Edit", onClick: selectComment },
          { title: "Delete", onClick: deleteComment },
        ]
      : []),
  ];

  const ReactionButtonListContainer = (
    <MetaContainerReactionButtonList isBBMiniScreen={isBBMiniScreen}>
      <ReactionButtonList
        popupTargetType={me() ? "commentMine" : "commentOthers"}
        reactionList={comment.bbCmtRacList}
        onClickReaction={handleClickReaction}
        isButtonActive={!archiveFlg}
        isVisibleReactionDetailPopup={isVisibleReactionDetailPopup}
        setIsVisibleReactionDetailPopup={setIsVisibleReactionDetailPopup}
      />
    </MetaContainerReactionButtonList>
  );

  return (
    <Container selecting={selecting} me={me()}>
      <Header>
        <StyledPostUser
          userId={postUser.userId}
          appleId={postUser.appleId}
          avatar={postUser.profileTmbImg}
          group={postUser.jobCd}
          usernameWithNumber={`${postUser.userId} ${postUser.firstName} ${postUser.familyName}`}
          // eslint-disable-next-line react/no-unstable-nested-components
          actionMenu={() =>
            actions.length > 0 && (
              <ActionMenu
                actions={actions}
                editing={editing}
                clearCommentStorage={clearCommentStorage}
                toggleActionMenu={toggleActionMenu}
              />
            )
          }
        />
      </Header>
      <ContentContainer>
        <Content>
          <HyperLinkedText>{comment.cmtText}</HyperLinkedText>
        </Content>
        <ReactionRegisterPopupCommentWrapper
          isIphone={storage.isIphone}
          isVisible={isVisibleReactionRegisterPopup}
          onClick={clickStopPropagationHandler}
          onTouchStart={touchStopPropagationHandler}
          onTouchEnd={touchStopPropagationHandler}
        >
          <ReactionRegisterList
            thread={thread}
            onClickThreadReactionButton={onClickThreadReactionButton}
            onClickResponseReactionButton={onClickResponseReactionButton}
            onClickCommentReactionButton={onClickCommentReactionButton}
          />
        </ReactionRegisterPopupCommentWrapper>
      </ContentContainer>
      <MetaContainer isBBMiniScreen={isBBMiniScreen}>
        <MetaContainerRight>
          {comment.editFlg && <EditLabel>*Edited*</EditLabel>}
          <PostedAt value={comment.updateTime} jstFlg={jstFlg} />
        </MetaContainerRight>
      </MetaContainer>
      {ReactionButtonListContainer}
    </Container>
  );
};

export const CommentItem = connect((state: RootState) => ({ jobAuth: state.account.jobAuth }))(Component);

const Container = styled.div<{ selecting?: boolean; me?: boolean }>`
  padding: 8px 10% 24px 15px;
  width: auto;
  ${(props) =>
    props.selecting &&
    `
    background-color: #BBC6FA;
    border: 2px solid #8D90FC;
    `};
  ${(props) => props.me && "padding: 8px 15px 24px 10%"};
`;

const MetaContainer = styled.div<{ isBBMiniScreen: boolean }>`
  ${({ isBBMiniScreen }) => (isBBMiniScreen ? "" : "height: 16px;")}
  position: relative;
`;
const MetaContainerReactionButtonList = styled.div<{ isBBMiniScreen: boolean }>`
  justify-content: flex-start;
  padding-top: 8px;
  padding-bottom: 8px;
`;
const MetaContainerRight = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: 8px;
`;

const StyledPostUser = styled(PostUser)`
  margin-bottom: 0;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
`;

const EditLabel = styled.div`
  font-size: 12px;
  margin-right: 8px;
`;

const PostedAt = styled(MessagePostedAt)`
  margin-right: 0px;
`;

const ContentContainer = styled.div`
  position: relative;
`;

const Content = styled.p`
  margin: 0 0 1px;
  border: 1px solid #222222;
  padding: 17px 14px 17px 8px;
  border-radius: 10px;
  position: relative;
  background-color: #fff;
  line-height: 22px;
  white-space: pre-wrap;

  &:before {
    content: "";
    position: absolute;
    top: -1px;
    left: 13px;
    width: 5px;
    height: 2px;
    background-color: #fff;
  }

  &:after {
    content: url("${() => CommentHornSvg}");
    position: absolute;
    top: -16px;
    left: 12px;
  }
`;

const ReactionRegisterPopupCommentWrapper = styled.div<{ isVisible: boolean; isIphone: boolean }>`
  position: absolute;
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  transition: visibility 0.1s, opacity 0.1s;
  z-index: 1;
  right: -4px;
  bottom: -32px;
`;
