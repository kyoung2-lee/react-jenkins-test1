import React, { MouseEvent, TouchEvent, useCallback, useMemo, useRef, useState } from "react";
import isEmpty from "lodash.isempty";
import styled from "styled-components";

import { useAppSelector } from "../../../store/hooks";
import { storage } from "../../../lib/storage";

interface Props {
  popupTargetType: "thread" | "response" | "commentMine" | "commentOthers";
  reactionList: BulletinBoardThreadApi.Reaction[];
  onClickReaction: (racType: string) => Promise<void> | void;
  isButtonActive: boolean;
  isVisibleReactionDetailPopup: boolean;
  setIsVisibleReactionDetailPopup: (isVisible: boolean) => void;
}

export const ReactionButtonList: React.FC<Props> = ({
  popupTargetType,
  reactionList,
  onClickReaction,
  isButtonActive,
  isVisibleReactionDetailPopup,
  setIsVisibleReactionDetailPopup,
}) => {
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const cdCtrlDtls = useAppSelector((state) => state.account.master.cdCtrlDtls);
  // B.B. 画面から開いているか、便カテゴリの小ウィンドウから開いているかを判別するために使う
  // どちらか一方からのみ掲示板画面を開いているという想定のため、両方から開いている場合には別の対処をする必要がある
  const bulletinBoardThread = useAppSelector((state) => state.bulletinBoard.thread?.thread);
  const flightContents = useAppSelector((state) => state.flightContents.contents);

  const timeoutLongTapReactionButton = useRef<NodeJS.Timeout | null>(null);
  const [showingRacType, setShowingRacType] = useState<string | null>(null);
  const [, setLongTapTriggered] = useState(false);

  const reactionListDisplaying = useMemo(() => {
    const reactionCodeList = cdCtrlDtls.filter((item) => item.cdCls === "048").map((item) => item.cdCat1);
    return reactionList
      .concat()
      .sort((a, b) => {
        const leftCodeFoundIndex = reactionCodeList.indexOf(a.racType);
        const rightCodeFoundIndex = reactionCodeList.indexOf(b.racType);
        return leftCodeFoundIndex > rightCodeFoundIndex ? 1 : -1;
      })
      .filter((item) => item.racCount > 0 && !isEmpty(item.racUser));
  }, [cdCtrlDtls, reactionList]);

  const currentReactionDetailData = useMemo(
    () => reactionList.find((item) => item.racType === showingRacType),
    [reactionList, showingRacType]
  );

  const currentReactedByUserListString = useMemo(() => {
    if (!currentReactionDetailData) {
      return "";
    }
    const top10UserList = currentReactionDetailData.racUser.filter((_, index) => index < 10);
    const top10UserListString = top10UserList
      .map((item) => (item.userId === jobAuth.user.userId ? "YOU" : `${item.firstName} ${item.familyName}`))
      .join(", ");
    return currentReactionDetailData.racCount > 10
      ? `${top10UserListString} and ${currentReactionDetailData.racCount - 10} others.`
      : top10UserListString;
  }, [currentReactionDetailData, jobAuth]);

  const screenOpeningFrom = useMemo(() => {
    if (bulletinBoardThread) {
      return "B.B.Screen";
    }
    if (flightContents.find((item) => item.bulletinBoard?.thread?.thread)) {
      return "B.B.MiniScreen";
    }
    return "";
  }, [bulletinBoardThread, flightContents]);

  const reactionDetailLeftOffset = useMemo(() => {
    if (screenOpeningFrom === "B.B.Screen" && !storage.isIphone) {
      return 0;
    }
    if (popupTargetType === "thread") {
      return screenOpeningFrom === "B.B.Screen" ? -28 : -19;
    }
    if (popupTargetType === "response" || popupTargetType === "commentOthers") {
      return screenOpeningFrom === "B.B.Screen" ? -11 : -9;
    }
    if (popupTargetType === "commentMine") {
      return screenOpeningFrom === "B.B.Screen" ? -33 : -31;
    }
    return 0;
  }, [popupTargetType, screenOpeningFrom]);

  const fetchIconDataURL = useCallback(
    (racType: string) => cdCtrlDtls.find((item) => item.cdCls === "048" && item.cdCat1 === racType)?.txt6 ?? "",
    [cdCtrlDtls]
  );

  const checkReactioningByMe = useCallback(
    (racType: string) => {
      const reactionData = reactionList.find((item) => item.racType === racType);
      if (!reactionData) {
        return false;
      }
      return reactionData.racUser.some((item) => item.userId === jobAuth.user.userId);
    },
    [jobAuth, reactionList]
  );

  const preventDefaultOnTouch = useCallback((event: Event) => {
    if (!storage.isIpad && !storage.isIphone) {
      return;
    }
    if (event instanceof TouchEvent && event.touches.length < 2) {
      event.preventDefault();
    }
  }, []);

  const handleClickReactionButton = useCallback(
    (racType: string, event: MouseEvent) => {
      if (!storage.isPc || !isButtonActive) {
        return;
      }
      void onClickReaction(racType);
      event.stopPropagation();
    },
    [isButtonActive, onClickReaction]
  );

  const handleLongTapReactionButton = useCallback(
    (racType: string) => {
      if (!storage.isIpad && !storage.isIphone) {
        return;
      }
      setShowingRacType(racType);
      setIsVisibleReactionDetailPopup(true);
    },
    [setIsVisibleReactionDetailPopup]
  );

  const handleTouchReactionButton = useCallback(
    (racType: string, event: TouchEvent) => {
      if (!storage.isIpad && !storage.isIphone) {
        return;
      }
      event.target.addEventListener("touchend", preventDefaultOnTouch, { passive: false });
      timeoutLongTapReactionButton.current = setTimeout(() => {
        handleLongTapReactionButton(racType);
        setLongTapTriggered(true);
      }, 600);
      event.stopPropagation();
    },
    [handleLongTapReactionButton, preventDefaultOnTouch]
  );

  const handleTouchEndReactionButton = useCallback(
    (racType: string, event: TouchEvent) => {
      if (!storage.isIpad && !storage.isIphone) {
        return;
      }
      if (timeoutLongTapReactionButton.current) {
        clearTimeout(timeoutLongTapReactionButton.current);
      }
      setLongTapTriggered((longTapTriggered) => {
        if (!longTapTriggered && isButtonActive) {
          void onClickReaction(racType);
        }
        return false;
      });
      event.target.removeEventListener("touchend", preventDefaultOnTouch);
      event.stopPropagation();
    },
    [isButtonActive, onClickReaction, preventDefaultOnTouch]
  );

  const handleMouseOverReactionButton = useCallback(
    (racType?: string) => {
      if (!storage.isPc) {
        return;
      }
      if (racType) {
        setShowingRacType(racType);
      }
      setIsVisibleReactionDetailPopup(true);
    },
    [setIsVisibleReactionDetailPopup]
  );

  const handleMouseOutReactionButton = useCallback(() => {
    if (!storage.isPc) {
      return;
    }
    setIsVisibleReactionDetailPopup(false);
  }, [setIsVisibleReactionDetailPopup]);

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

  return isEmpty(reactionListDisplaying) ? (
    <div />
  ) : (
    <Container>
      <ListContainer>
        {reactionListDisplaying.map((item) => (
          <ReactionButton
            key={`ReactionButton_${item.racType}`}
            disabled={!isButtonActive}
            reactioningByMe={checkReactioningByMe(item.racType)}
            isButtonActive={isButtonActive}
            onClickCapture={(event) => handleClickReactionButton(item.racType, event)}
            onTouchStart={(event) => handleTouchReactionButton(item.racType, event)}
            onTouchEnd={(event) => handleTouchEndReactionButton(item.racType, event)}
            onMouseOver={() => handleMouseOverReactionButton(item.racType)}
            onMouseOut={handleMouseOutReactionButton}
          >
            <img src={fetchIconDataURL(item.racType)} height={24} alt="" />
            <ReactionCounter>{item.racCount}</ReactionCounter>
          </ReactionButton>
        ))}
      </ListContainer>
      <ReactionDetailContainer
        isVisible={isVisibleReactionDetailPopup}
        onMouseOver={() => handleMouseOverReactionButton()}
        onMouseOut={handleMouseOutReactionButton}
        onTouchStart={touchStopPropagationHandler}
        onTouchEnd={touchStopPropagationHandler}
        onClick={clickStopPropagationHandler}
        style={{ left: reactionDetailLeftOffset }}
      >
        <ReactionDetailHeader>
          <img src={fetchIconDataURL(currentReactionDetailData?.racType ?? "")} height={28} alt="" />
          <ReactionDetailReactedByString>Reacted by</ReactionDetailReactedByString>
        </ReactionDetailHeader>
        <ReactionDetailUserList>{currentReactedByUserListString}</ReactionDetailUserList>
      </ReactionDetailContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const ListContainer = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  margin-bottom: -8px;
`;

const ReactionButton = styled.button<{ reactioningByMe: boolean; isButtonActive: boolean }>`
  position: relative;
  display: flex;
  border: solid 1px ${({ isButtonActive }) => (isButtonActive ? "#346181" : "#222222")};
  background-color: ${({ reactioningByMe }) => (reactioningByMe ? "#CBF3F2" : "#E4F3F2")};
  border-radius: 4px;
  align-items: center;
  height: 40px;
  padding: 0 8px;
  white-space: nowrap;
  margin-bottom: 8px;

  color: #000000;

  &:not(:nth-last-child(1)) {
    margin-right: 8px;
  }
  & > :not(:nth-last-child(1)) {
    margin-right: 4px;
  }

  ${({ isButtonActive }) =>
    isButtonActive
      ? `
  &:hover,
  &:active {
    cursor: pointer;
  }
`
      : ""}

  &:hover {
    &:after {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  ${({ isButtonActive }) =>
    isButtonActive
      ? `
  &:active {
    &:after {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
`
      : ""}
`;

const ReactionCounter = styled.div`
  font-size: 20px;
`;

const ReactionDetailContainer = styled.div<{ isVisible: boolean }>`
  position: absolute;
  bottom: 40px;
  padding: 12px 16px 20px 16px;
  margin-bottom: 28px;
  background-color: #ffffff;
  border: solid 1px #333333;
  border-radius: 4px;
  box-shadow: 1px 1px 4px 0px #999999;
  width: 352px;
  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  transition: visibility 0.1s, opacity 0.1s;
  z-index: 2;
`;

const ReactionDetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;

  & > :not(:nth-last-child(1)) {
    margin-right: 8px;
  }
`;

const ReactionDetailReactedByString = styled.div`
  font-size: 16px;
`;

const ReactionDetailUserList = styled.div`
  margin-top: 4px;
  font-size: 16px;
  line-height: 21px;
`;
