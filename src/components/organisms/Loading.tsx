import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store/hooks";
import LoadingFetchAnimation from "../../assets/images/loading.gif";

/**
 * Preloaders (codepen.io) :
 * https://codepen.io/ahdigital/pen/prXBzN
 */
const Loading: React.FC = () => {
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isShowLoadingImage, setIsShowLoadingImage] = useState(false);

  const accountIsFetching = useAppSelector((state) => state.account.isFetching);
  const fisIsFetching = useAppSelector((state) => state.fis.isFetching);
  const flightSearchIsFetching = useAppSelector((state) => state.flightSearch.isFetching);
  const issueSecurityIsFetching = useAppSelector((state) => state.issueSecurity.isFetching);
  const userSettingIsFetching = useAppSelector((state) => state.userSetting.isFetching);
  const broadcastFetchingAll = useAppSelector((state) => state.broadcast.Broadcast.fetchingAll);
  const broadcastBulletinBoardFetchingBb = useAppSelector((state) => state.broadcast.BulletinBoard.fetchingBb);
  const broadcastBulletinBoardFetchingAllFlightLeg = useAppSelector((state) => state.broadcast.BulletinBoard.fetchingAllFlightLeg);
  const broadcastBulletinBoardFetching = useAppSelector((state) => state.broadcast.BulletinBoard.fetching);
  const broadcastEmailFetching = useAppSelector((state) => state.broadcast.Email.fetching);
  const broadcastTtyFetching = useAppSelector((state) => state.broadcast.Tty.fetching);
  const broadcastAcarsFetching = useAppSelector((state) => state.broadcast.Acars.fetching);
  const broadcastNotificationFetching = useAppSelector((state) => state.broadcast.Notification.fetching);
  const oalFlightScheduleIsFetching = useAppSelector((state) => state.oalFlightSchedule.isFetching);
  const bulletinBoardIsFetchingThreads = useAppSelector((state) => state.bulletinBoard.isFetchingThreads);
  const myScheduleIsFetching = useAppSelector((state) => state.mySchedule.isFetching);

  useEffect(() => {
    setIsShowLoading(accountIsFetching);
  }, [accountIsFetching]);

  useEffect(() => {
    setIsShowLoadingImage(
      fisIsFetching ||
        flightSearchIsFetching ||
        issueSecurityIsFetching ||
        userSettingIsFetching ||
        broadcastFetchingAll ||
        broadcastBulletinBoardFetchingBb ||
        broadcastBulletinBoardFetchingAllFlightLeg ||
        broadcastBulletinBoardFetching ||
        broadcastEmailFetching ||
        broadcastTtyFetching ||
        broadcastAcarsFetching ||
        broadcastNotificationFetching ||
        oalFlightScheduleIsFetching ||
        bulletinBoardIsFetchingThreads ||
        myScheduleIsFetching
    );
  }, [
    broadcastAcarsFetching,
    broadcastBulletinBoardFetching,
    broadcastBulletinBoardFetchingAllFlightLeg,
    broadcastBulletinBoardFetchingBb,
    broadcastEmailFetching,
    broadcastFetchingAll,
    broadcastNotificationFetching,
    broadcastTtyFetching,
    bulletinBoardIsFetchingThreads,
    fisIsFetching,
    flightSearchIsFetching,
    issueSecurityIsFetching,
    oalFlightScheduleIsFetching,
    userSettingIsFetching,
    myScheduleIsFetching,
  ]);

  if (isShowLoading) {
    return (
      <LoadingJobAuthWrapper>
        <Preloader>
          <span className="line line-1" />
          <span className="line line-2" />
          <span className="line line-3" />
          <span className="line line-4" />
          <span className="line line-5" />
          <span className="line line-6" />
          <span className="line line-7" />
          <span className="line line-8" />
          <span className="line line-9" />
          <div>Loading</div>
        </Preloader>
      </LoadingJobAuthWrapper>
    );
  }
  if (isShowLoadingImage) {
    return (
      <LoadingFetchWrapper>
        <LoadingContainer>
          <img src={LoadingFetchAnimation} alt="" />
        </LoadingContainer>
      </LoadingFetchWrapper>
    );
  }
  return <div />;
};

/* ログイン画面 */
const LoadingJobAuthWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999999999;
  background: rgba(0, 0, 0, 0.8);
`;
const Preloader = styled.div`
  position: absolute;
  top: calc(50% - (45px + 34px + 5px + 5px) / 2);
  right: 0;
  left: 0;
  margin: auto;
  width: 300px;
  height: 0;
  text-align: center;

  > div {
    color: #fff;
    margin: 5px 0;
    text-transform: uppercase;
    font-size: 30px;
    letter-spacing: 2px;
  }

  > .line {
    width: 3px;
    height: 45px;
    background: #fff;
    margin: 0 9px;
    display: inline-block;
    animation: customOpacity 1000ms infinite ease-in-out;
  }

  > .line-1 {
    animation-delay: 800ms;
  }
  > .line-2 {
    animation-delay: 600ms;
  }
  > .line-3 {
    animation-delay: 400ms;
  }
  > .line-4 {
    animation-delay: 200ms;
  }
  > .line-6 {
    animation-delay: 200ms;
  }
  > .line-7 {
    animation-delay: 400ms;
  }
  > .line-8 {
    animation-delay: 600ms;
  }
  > .line-9 {
    animation-delay: 800ms;
  }

  @keyframes customOpacity {
    0% {
      opacity: 1;
      height: 45px;
    }
    50% {
      opacity: 0;
      height: 45px;
    }
    100% {
      opacity: 1;
      height: 45px;
    }
  }
`;

/* FIS画面、便情報一覧画面 */
const LoadingFetchWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999999;
  background: rgba(0, 0, 0, 0.5);
`;
const LoadingContainer = styled.div`
  width: 240px;
  height: 184px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
  }
`;

export default Loading;
