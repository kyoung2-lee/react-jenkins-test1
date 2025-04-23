import React, { useCallback } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { ThreadTag } from "./ThreadTag";
import { MessagePostedAt } from "./MessagePostedAt";
import { PostUser } from "./PostUser";
import { Attachment } from "./Attachment";
import { Content } from "./Content";
import { RootState } from "../../../store/storeType";
import { openBulletinBoardAddressModal } from "../../../reducers/bulletinBoardAddressModal";
import { ThreadActionMenu } from "./ThreadActionMenu";
import HyperLinkedText from "../../atoms/HyperLinkedText";
import { ReactionButtonList } from "./ReactionButtonList";

interface Props {
  archiveFlg: boolean;
  thread: Required<RootState["bulletinBoard"]>["thread"];
  onDownloadThreadFile: (bbFileId: number) => Promise<BulletinBoardDownloadFileApi.File | undefined>;
  onDelete: (bbId: number) => void;
  onClickThreadReactionButton: (params: BulletinBoardThreadReactionApi.Request) => void;
  editing: boolean;
  clearCommentStorage: () => void;
  toggleActionMenu: () => void;
  isVisibleReactionDetailPopup: boolean;
  setIsVisibleReactionDetailPopup: (isVisible: boolean) => void;
}

const Component: React.FC<Props> = ({
  thread,
  archiveFlg,
  onDownloadThreadFile,
  onDelete,
  onClickThreadReactionButton: onClickReactionButton,
  editing,
  clearCommentStorage,
  toggleActionMenu,
  isVisibleReactionDetailPopup,
  setIsVisibleReactionDetailPopup,
}) => {
  const dispatch = useAppDispatch();
  const jobAuth = useAppSelector((state) => state.account.jobAuth);

  const { thread: item, jstFlg } = thread;
  const { postUser } = item;

  const handleClickReaction = useCallback(
    (racType: string) => {
      const isAlreadyReactioned = item.bbRacList.some((bbRacItem) => {
        if (bbRacItem.racType !== racType) {
          return false;
        }
        return bbRacItem.racUser.some((racUserItem) => racUserItem.userId === jobAuth.user.userId);
      });
      onClickReactionButton({
        bbId: item.bbId,
        funcType: isAlreadyReactioned ? 2 : 1,
        racType,
      });
    },
    [item, jobAuth, onClickReactionButton]
  );

  const openAddressModal = () => {
    dispatch(openBulletinBoardAddressModal({ jobCodes: item.jobCdList }));
  };

  return (
    <Container>
      <Header>
        {item.editFlg && <EditLabel>*Edited*</EditLabel>}
        <MessagePostedAt value={item.updateTime} jstFlg={jstFlg} />
        <ThreadActionMenu
          bbId={item.bbId}
          postUserJobCd={postUser.jobCd}
          onDelete={onDelete}
          editing={editing}
          archiveFlg={archiveFlg}
          canEditOrShare
          clearCommentStorage={clearCommentStorage}
          toggleActionMenu={toggleActionMenu}
        />
      </Header>
      <PostUser
        userId={postUser.userId}
        appleId={postUser.appleId}
        onAddressClick={openAddressModal}
        avatar={postUser.profileTmbImg}
        group={postUser.jobCd}
        usernameWithNumber={`${postUser.userId} ${postUser.firstName} ${postUser.familyName}`}
      />
      <Body>
        <ThreadTitle>{item.bbTitle}</ThreadTitle>
        <TagContainer>
          {item.catCdList.map((tag, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TagCol key={`${tag}-${i}`}>
              <ThreadTag text={tag} />
            </TagCol>
          ))}
        </TagContainer>
        <Content>
          <HyperLinkedText>{item.bbText}</HyperLinkedText>
        </Content>
        <Attachment items={item.bbFileList} onDownloadThreadFile={onDownloadThreadFile} />
        <ReactionButtonListWrapper>
          <ReactionButtonList
            popupTargetType="thread"
            reactionList={item.bbRacList}
            onClickReaction={handleClickReaction}
            isButtonActive={!archiveFlg}
            isVisibleReactionDetailPopup={isVisibleReactionDetailPopup}
            setIsVisibleReactionDetailPopup={setIsVisibleReactionDetailPopup}
          />
        </ReactionButtonListWrapper>
      </Body>
    </Container>
  );
};

export const ThreadMessageItem = connect(null)(Component);

const Container = styled.div`
  padding: 34px 17px 14px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 3px;
`;

const ThreadTitle = styled.div`
  flex: 1;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 17px;
`;

const TagContainer = styled.div`
  display: flex;
  margin: 0 -2px 8px;
`;

const TagCol = styled.div`
  padding: 0 2px;
`;

const EditLabel = styled.div`
  font-size: 13px;
  margin-right: 8px;
`;

const Body = styled.div`
  margin-left: 10px;
`;

const ReactionButtonListWrapper = styled.div`
  padding-top: 100px;
  padding-bottom: 34px;
`;
