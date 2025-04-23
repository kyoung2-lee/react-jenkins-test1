import React, { useCallback } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { MessagePostedAt } from "./MessagePostedAt";
import { PostUser } from "./PostUser";
import { Content } from "./Content";
import { ActionMenu } from "./ActionMenu";
import { RootState } from "../../../store/storeType";
import { useAppDispatch } from "../../../store/hooks";
import { openBulletinBoardResponseModal } from "../../../reducers/bulletinBoardResponseEditorModal";
import { funcAuthCheck } from "../../../lib/commonUtil";
import { Const } from "../../../lib/commonConst";
import HyperLinkedText from "../../atoms/HyperLinkedText";
import { ReactionButtonList } from "./ReactionButtonList";

interface Props {
  bbId: number;
  response: Required<RootState["bulletinBoard"]>["thread"]["thread"]["bbResList"][0];
  jobAuth: RootState["account"]["jobAuth"];
  onDelete: (resId: number) => void;
  onClickResponseReactionButton: (params: BulletinBoardResponseReactionApi.Request) => void;
  editing: boolean;
  archiveFlg: boolean;
  clearCommentStorage: () => void;
  toggleActionMenu: () => void;
  jstFlg: boolean;
  isVisibleReactionDetailPopup: boolean;
  setIsVisibleReactionDetailPopup: (isVisible: boolean) => void;
}

export const Component: React.FC<Props> = ({
  bbId,
  response,
  jobAuth,
  onDelete,
  onClickResponseReactionButton: onClickReactionButton,
  archiveFlg,
  editing,
  clearCommentStorage,
  toggleActionMenu,
  jstFlg,
  isVisibleReactionDetailPopup,
  setIsVisibleReactionDetailPopup,
}) => {
  const dispatch = useAppDispatch();
  const { postUser } = response;

  const edit = () => {
    dispatch(
      openBulletinBoardResponseModal({
        bbId,
        response: {
          id: response.resId,
          title: response.resTitle,
          text: response.resText,
        },
      })
    );
  };

  const deleteRes = () => {
    onDelete(response.resId);
  };

  const editable = () =>
    funcAuthCheck(Const.FUNC_ID.updateBulletinBoardRes, jobAuth.jobAuth) && response.postUser.jobCd === jobAuth.user.jobCd && !archiveFlg;

  const actions = [
    ...(editable()
      ? [
          { title: "Edit", onClick: edit },
          { title: "Delete", onClick: deleteRes },
        ]
      : []),
  ];

  const handleClickReaction = useCallback(
    (racType: string) => {
      const isAlreadyReactioned = response.bbResRacList.some((bbResRacItem) => {
        if (bbResRacItem.racType !== racType) {
          return false;
        }
        return bbResRacItem.racUser.some((racUserItem) => racUserItem.userId === jobAuth.user.userId);
      });
      onClickReactionButton({
        resId: response.resId,
        funcType: isAlreadyReactioned ? 2 : 1,
        racType,
      });
    },
    [response, jobAuth, onClickReactionButton]
  );

  return (
    <Container>
      <Header>
        <ThreadTitle>Res. #{response.resNumber}</ThreadTitle>
        {response.editFlg && <EditLabel>*Edited*</EditLabel>}
        <MessagePostedAt value={response.updateTime} jstFlg={jstFlg} />
        {actions.length > 0 && (
          <ActionMenu actions={actions} editing={editing} clearCommentStorage={clearCommentStorage} toggleActionMenu={toggleActionMenu} />
        )}
      </Header>
      <PostUser
        userId={postUser.userId}
        appleId={postUser.appleId}
        avatar={postUser.profileTmbImg}
        group={postUser.jobCd}
        usernameWithNumber={`${postUser.userId} ${postUser.firstName} ${postUser.familyName}`}
      />
      <Body>
        <AdditionalSubject>{response.resTitle}</AdditionalSubject>
        <Content>
          <HyperLinkedText>{response.resText}</HyperLinkedText>
        </Content>
      </Body>
      <ReactionButtonListContainer>
        <ReactionButtonList
          popupTargetType="response"
          reactionList={response.bbResRacList}
          onClickReaction={handleClickReaction}
          isButtonActive={!archiveFlg}
          isVisibleReactionDetailPopup={isVisibleReactionDetailPopup}
          setIsVisibleReactionDetailPopup={setIsVisibleReactionDetailPopup}
        />
      </ReactionButtonListContainer>
    </Container>
  );
};

export const TheadMessageResponseItem = connect((state: RootState) => ({
  jobAuth: state.account.jobAuth,
}))(Component);

const Container = styled.div`
  padding: 20px 10px;
  background-color: #f0f1f3;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ThreadTitle = styled.div`
  flex: 1;
  font-size: 14px;
`;

const AdditionalSubject = styled.p`
  padding-right: 10px;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 17px;
`;

const EditLabel = styled.div`
  font-size: 13px;
  margin-right: 8px;
`;

const Body = styled.div`
  margin-left: 10px;
`;

const ReactionButtonListContainer = styled.div`
  padding-top: 8px;
`;
