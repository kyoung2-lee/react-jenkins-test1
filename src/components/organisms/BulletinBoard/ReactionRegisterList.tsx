import React, { MouseEvent, TouchEvent, useCallback, useMemo } from "react";
import isEmpty from "lodash.isempty";
import styled from "styled-components";

import { useAppSelector } from "../../../store/hooks";
import { storage } from "../../../lib/storage";

interface Props {
  thread: BulletinBoardThreadApi.Response | undefined;
  onClickThreadReactionButton: (params: BulletinBoardThreadReactionApi.Request) => void;
  onClickResponseReactionButton: (params: BulletinBoardResponseReactionApi.Request) => void;
  onClickCommentReactionButton: (params: BulletinBoardCommentReactionApi.Request) => void;
}

export const ReactionRegisterList: React.FC<Props> = (props) => {
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const cdCtrlDtls = useAppSelector((state) => state.account.master.cdCtrlDtls);
  const popupStatus = useAppSelector((state) => state.bulletinBoardReactionRegistPopup);
  const { thread, onClickThreadReactionButton, onClickResponseReactionButton, onClickCommentReactionButton } = props;

  const buttonList = useMemo(
    () =>
      cdCtrlDtls
        .filter((item) => item.cdCls === "048")
        .filter((item) => {
          if (!thread) {
            return false;
          }
          if (popupStatus.popupTargetType === "thread") {
            const foundItem = thread.thread.bbRacList.find((bbRacItem) => bbRacItem.racType === item.cdCat1);
            if (!foundItem) {
              return true;
            }
            return foundItem.racUser.every((racUserItem) => racUserItem.userId !== jobAuth.user.userId);
          }
          if (popupStatus.popupTargetType === "response") {
            const foundResponseItem = thread.thread.bbResList.find((bbResItem) => bbResItem.resId === popupStatus.popupTargetId);
            if (!foundResponseItem) {
              return false;
            }
            const foundReactionItem = foundResponseItem?.bbResRacList.find((bbResRacItem) => bbResRacItem.racType === item.cdCat1);
            if (!foundReactionItem) {
              return true;
            }
            return foundReactionItem.racUser.every((racUserItem) => racUserItem.userId !== jobAuth.user.userId);
          }
          if (popupStatus.popupTargetType === "comment") {
            const foundCommentItem = thread.thread.bbCmtList.find((bbCmtItem) => bbCmtItem.cmtId === popupStatus.popupTargetId);
            if (!foundCommentItem) {
              return false;
            }
            const foundReactionItem = foundCommentItem?.bbCmtRacList.find((bbCmtRacItem) => bbCmtRacItem.racType === item.cdCat1);
            if (!foundReactionItem) {
              return true;
            }
            return foundReactionItem.racUser.every((racUserItem) => racUserItem.userId !== jobAuth.user.userId);
          }
          return false;
        })
        .map((item) => ({ racType: item.cdCat1, iconURL: item.txt6 })),
    [jobAuth, thread, cdCtrlDtls, popupStatus]
  );

  const addReaction = useCallback(
    (racType: string) => {
      const { popupTargetType, popupTargetId } = popupStatus;
      const requestCommonParams = { funcType: 1 as BbRacFuncType, racType };
      if (popupTargetType === "thread") {
        onClickThreadReactionButton({
          ...requestCommonParams,
          bbId: popupTargetId,
        });
      } else if (popupTargetType === "response") {
        onClickResponseReactionButton({
          ...requestCommonParams,
          resId: popupTargetId,
        });
      } else if (popupTargetType === "comment") {
        onClickCommentReactionButton({
          ...requestCommonParams,
          cmtId: popupTargetId,
        });
      }
    },
    [popupStatus, onClickThreadReactionButton, onClickResponseReactionButton, onClickCommentReactionButton]
  );

  const handleClickButton = useCallback(
    (racType: string, event: MouseEvent) => {
      if (!storage.isPc) {
        return;
      }
      addReaction(racType);
      event.stopPropagation();
    },
    [addReaction]
  );

  const handleTouchButton = useCallback(
    (racType: string, event: TouchEvent) => {
      if (!storage.isIpad && !storage.isIphone) {
        return;
      }
      addReaction(racType);
      event.stopPropagation();
    },
    [addReaction]
  );

  return !isEmpty(buttonList) ? (
    <Container>
      {buttonList.map((item) => (
        <ReactionRegisterButton
          key={`reactionRegisterButton_${item.racType}`}
          onClickCapture={(event: MouseEvent) => handleClickButton(item.racType, event)}
          onTouchEndCapture={(event: TouchEvent) => handleTouchButton(item.racType, event)}
        >
          <img src={item.iconURL} height={24} alt="" />
        </ReactionRegisterButton>
      ))}
    </Container>
  ) : null;
};

const Container = styled.div`
  display: flex;
  padding: 0 16px;
  align-items: center;
  background-color: rgb(230 230 230 / 80%);
  border: solid 1px #346181;
  border-radius: 4px;
  box-shadow: 3px 3px 6px rgb(0 0 0 /35%);
  height: 48px;
`;

const ReactionRegisterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 0);
  padding: 4px;
  border: none;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:not(:nth-last-child(1)) {
    margin-right: 32px;
  }

  &:hover {
    background: rgb(192 202 208);
  }
`;
