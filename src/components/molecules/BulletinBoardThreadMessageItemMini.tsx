import React, { useCallback } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ThreadTag } from "../organisms/BulletinBoard/ThreadTag";
import { MessagePostedAt } from "../organisms/BulletinBoard/MessagePostedAt";
import { PostUser } from "../organisms/BulletinBoard/PostUser";
import { Attachment } from "../organisms/BulletinBoard/Attachment";
import { Content } from "../organisms/BulletinBoard/Content";
import { ThreadActionMenu } from "../organisms/BulletinBoard/ThreadActionMenu";
import { ReactionButtonList } from "../organisms/BulletinBoard/ReactionButtonList";
import { openBulletinBoardAddressModal } from "../../reducers/bulletinBoardAddressModal";
import HyperLinkedText from "../atoms/HyperLinkedText";
import { RootState, AppDispatch } from "../../store/storeType";
import { useAppSelector } from "../../store/hooks";

interface Props {
  thread: Required<RootState["bulletinBoard"]>["thread"];
  archiveFlg: boolean;
  openBulletinBoardAddressModal: typeof openBulletinBoardAddressModal;
  onDownloadThreadFile(bbFileId: number): Promise<BulletinBoardDownloadFileApi.File | undefined>;
  onDelete(bbId: number): void;
  onClickThreadReactionButton: (params: BulletinBoardThreadReactionApi.Request) => void;
  editing: boolean;
  handleCloseModal?: () => void;
  clearCommentStorage: () => void;
  toggleActionMenu: () => void;
  isVisibleReactionDetailPopup: boolean;
  setIsVisibleReactionDetailPopup: (isVisible: boolean) => void;
}

const Component: React.FC<Props> = ({
  thread,
  onDelete,
  onDownloadThreadFile,
  onClickThreadReactionButton,
  archiveFlg,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  openBulletinBoardAddressModal,
  editing,
  handleCloseModal,
  clearCommentStorage,
  toggleActionMenu,
  isVisibleReactionDetailPopup,
  setIsVisibleReactionDetailPopup,
}) => {
  const jobAuth = useAppSelector((state) => state.account.jobAuth);

  const { thread: item } = thread;
  const { postUser } = item;

  const handleClickReaction = useCallback(
    (racType: string) => {
      const isAlreadyReactioned = item.bbRacList.some((bbRacItem) => {
        if (bbRacItem.racType !== racType) {
          return false;
        }
        return bbRacItem.racUser.some((racUserItem) => racUserItem.userId === jobAuth.user.userId);
      });
      onClickThreadReactionButton({
        bbId: item.bbId,
        funcType: isAlreadyReactioned ? 2 : 1,
        racType,
      });
    },
    [item, jobAuth, onClickThreadReactionButton]
  );

  const openAddressModal = () => {
    openBulletinBoardAddressModal({ jobCodes: item.jobCdList });
  };

  return (
    <Container>
      <Header>
        <HeaderSpace />
        {item.editFlg && <EditLabel>*Edited*</EditLabel>}
        <MessagePostedAt value={item.updateTime} jstFlg={thread.jstFlg} />
        <ThreadActionMenu
          bbId={item.bbId}
          postUserJobCd={postUser.jobCd}
          onDelete={onDelete}
          editing={editing}
          archiveFlg={archiveFlg}
          handleCloseModal={handleCloseModal}
          canEditOrShare={false}
          clearCommentStorage={clearCommentStorage}
          toggleActionMenu={toggleActionMenu}
        />
      </Header>
      <PostUser
        userId={postUser.userId}
        appleId={postUser.appleId}
        avatar={postUser.profileTmbImg}
        onAddressClick={openAddressModal}
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

export const BulletinBoardThreadMessageItemMini = connect(null, (dispatch: AppDispatch) =>
  bindActionCreators({ openBulletinBoardAddressModal }, dispatch)
)(Component);

const Container = styled.div`
  padding: 31px 10px 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const EditLabel = styled.div`
  font-size: 13px;
  margin-right: 8px;
`;

const Body = styled.div`
  margin-left: 10px;
`;

const ThreadTitle = styled.div`
  flex: 1;
  font-weight: bold;
  margin: 0 0 10px;
  font-size: 17px;
`;

const HeaderSpace = styled.div`
  flex: 1;
`;

const TagContainer = styled.div`
  display: flex;
  margin: 0 -2px 10px;
`;

const TagCol = styled.div`
  padding: 0 2px;
`;

const ReactionButtonListWrapper = styled.div`
  padding-top: 100px;
  padding-bottom: 34px;
`;
