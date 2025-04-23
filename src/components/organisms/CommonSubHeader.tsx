import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import useScrollbarSize from "react-scrollbar-size";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { funcAuthCheck, parseTimeLcl } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import * as commonActions from "../../reducers/common";
import { getFisHeaderInfo, getFisHeaderInfoAuto, mqttDisconnect } from "../../reducers/fis";
import UpdateRmksPopup from "../molecules/UpdateRmksPopup";
import Toggle from "../atoms/Toggle";
import RoundButtonReload from "../atoms/RoundButtonReload";
import { getMyScheduleInfo } from "../../reducers/mySchedule";

type Props = {
  isDarkMode: boolean;
};

const CommonSubHeader: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const refAptRmks = useRef<HTMLDivElement>(null);
  const scrollbarWidth = useScrollbarSize().width;

  const fis = useAppSelector((state) => state.fis);
  const common = useAppSelector((state) => state.common);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const { isAutoReload } = fis.headerSettings;

  const [rmksPopupIsOpen, setRmksPopupIsOpen] = useState(false);
  const [rmksPopupWidth, setRmksPopupWidth] = useState(0);
  const [rmksPopupHeight, setRmksPopupHeight] = useState(0);
  const [rmksPopupTop, setRmksPopupTop] = useState(0);
  const [rmksPopupLeft, setRmksPopupLeft] = useState(0);

  const isSelectApoMode = pathname === Const.PATH_NAME.fis || pathname === Const.PATH_NAME.barChart;
  const isFixedApoMode2 = pathname === Const.PATH_NAME.mySchedule;

  const isRmksEnabled = (): boolean =>
    !!jobAuth.user.myApoCd &&
    jobAuth.user.myApoCd === common.headerInfo.apoCd &&
    funcAuthCheck(Const.FUNC_ID.updateAireportRemarks, jobAuth.jobAuth);

  const handleReload = () => {
    const { apoCd, targetDate, isToday } = common.headerInfo;
    if (isSelectApoMode) {
      if (!isAutoReload) {
        void dispatch(
          getFisHeaderInfo({
            apoCd,
            targetDate,
            isToday,
            beforeApoCd: apoCd,
            beforeTargetDate: targetDate,
            isReload: true,
          })
        );
      }
      // // PUSHテスト用
      // const { getFisRowsFromPush, fis } = this.props;
      // getFisRowsFromPush(fis._getCount);
    } else if (pathname === Const.PATH_NAME.mySchedule) {
      void dispatch(getMyScheduleInfo());
    }
  };

  const handleOpenRmksPopup = async () => {
    const { apoCd } = common.headerInfo;
    const openRmksPopup = () => {
      if (refAptRmks.current) {
        setRmksPopupIsOpen(true);
        setRmksPopupWidth(refAptRmks.current.clientWidth);
        setRmksPopupHeight(refAptRmks.current.clientHeight);
        setRmksPopupTop(refAptRmks.current.getBoundingClientRect().top);
        setRmksPopupLeft(refAptRmks.current.getBoundingClientRect().left);
      }
    };
    const closeRmksPopup = () => {
      setRmksPopupIsOpen(false);
    };
    await dispatch(commonActions.getHeaderInfo({ apoCd, openRmksPopup, closeRmksPopup }));
  };

  const handlCloseRmksPopup = (rmksText: string) => {
    if (common.headerInfo.apoRmksInfo === rmksText) {
      setRmksPopupIsOpen(false);
    } else {
      void dispatch(commonActions.showConfirmation({ onClickYes: () => setRmksPopupIsOpen(false) }));
    }
  };

  const handleUpdateRmks = (text: string) => {
    if (text === common.headerInfo.apoRmksInfo) {
      void dispatch(commonActions.showNotificationAirportRmksNoChange());
    } else {
      void dispatch(
        commonActions.updateAirportRemarks({
          apoCd: jobAuth.user.myApoCd,
          apoRmksInfo: text,
          closeAirportRemarksPopup: () => setRmksPopupIsOpen(false),
        })
      );
    }
  };

  const { isDarkMode } = props;
  const { apoRmksInfo, apoTimeLcl, apoTimeDiffUtc } = common.headerInfo;
  const { timeLcl, timeDiffUtc, apoCd } = fis;
  const hTimeLcl = apoTimeLcl < timeLcl ? timeLcl : apoTimeLcl;
  const hTimeDiffUtc = apoTimeLcl < timeLcl ? timeDiffUtc : apoTimeDiffUtc;
  const parsedTimeLcl = parseTimeLcl({ timeLcl: hTimeLcl, timeDiffUtc: hTimeDiffUtc, isLocal: !!apoCd });
  const hasAirport = !!apoCd;
  const hasHeaderAirport = !!common.headerInfo.apoCd;

  return (
    <Wrapper scrollbarSize={scrollbarWidth}>
      <MainContent isBarChart={pathname === Const.PATH_NAME.barChart}>
        <Left>
          {isFixedApoMode2 ? (
            hasHeaderAirport && (
              <AptRmksContainer
                ref={refAptRmks}
                onClick={() => {
                  void handleOpenRmksPopup();
                }}
                isEmpty={!apoRmksInfo}
              >
                <div>{apoRmksInfo || "Airport Remarks"}</div>
              </AptRmksContainer>
            )
          ) : (
            <AptRmksContainer
              ref={refAptRmks}
              onClick={() => {
                void handleOpenRmksPopup();
              }}
              isEmpty={!apoRmksInfo}
            >
              <div>{apoRmksInfo || "Airport Remarks"}</div>
            </AptRmksContainer>
          )}
        </Left>
        <Right>
          {funcAuthCheck(
            pathname === Const.PATH_NAME.fis ? Const.FUNC_ID.updateFisAuto : Const.FUNC_ID.updateBarChartAuto,
            jobAuth.jobAuth
          ) && (
            <ToggleSwitch isPc={storage.isPc}>
              <span>Auto</span>
              <Toggle
                tabIndex={-1}
                isDarkMode={isDarkMode}
                checked={isAutoReload}
                onChange={(checked) => {
                  if (checked) {
                    void dispatch(getFisHeaderInfoAuto({ apoCd: common.headerInfo.apoCd, isAddingAuto: true }));
                  } else {
                    void dispatch(mqttDisconnect());
                  }
                }}
              />
            </ToggleSwitch>
          )}
          {!isFixedApoMode2 ? (
            hasAirport && (
              <UpdatedTime isPc={storage.isPc}>
                <span>{apoCd}</span>
                <span>{parsedTimeLcl.date}</span>
                <span>{parsedTimeLcl.time}</span>
              </UpdatedTime>
            )
          ) : (
            <>
              {hasHeaderAirport && (
                <UpdatedTime isPc={storage.isPc}>
                  <span>{parsedTimeLcl.date}</span>
                  <span>{parsedTimeLcl.time}</span>
                </UpdatedTime>
              )}
            </>
          )}
          <ModalReloadButtonContainer isPc={storage.isPc}>
            <RoundButtonReload tabIndex={10} isFetching={false} disabled={isAutoReload} onClick={handleReload} />
          </ModalReloadButtonContainer>
        </Right>

        <UpdateRmksPopup
          isOpen={rmksPopupIsOpen}
          width={rmksPopupWidth}
          height={rmksPopupHeight}
          top={rmksPopupTop}
          left={rmksPopupLeft}
          initialRmksText={apoRmksInfo}
          isSubmitable={isRmksEnabled()}
          placeholder="Airport Remarks"
          onClose={handlCloseRmksPopup}
          update={handleUpdateRmks}
        />
      </MainContent>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ scrollbarSize: number }>`
  position: relative;
  min-height: 47px;
  padding: 0 0 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.color.HEADER_GRADIENT};
  font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
  z-index: 10; /* 下部コンポーネントの影をかぶらないように上位にする */
`;
const MainContent = styled.div<{ isBarChart: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: ${Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
  padding-bottom: ${({ isBarChart }) => (isBarChart ? "6px" : "10px")};
`;
const Left = styled.div`
  width: 100%;
  display: flex;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 15px;
`;
const AptRmksContainer = styled.div<{ isEmpty: boolean }>`
  width: 100%;
  max-width: 706px;
  height: 47px;
  margin-left: 1px;
  padding: 3px 7px 3px;
  line-height: 1.4;
  border-radius: 1px;
  border: none;
  color: ${(props) => (props.isEmpty ? props.theme.color.PLACEHOLDER : props.theme.color.DEFAULT_FONT_COLOR)};
  background: ${({ theme }) => theme.color.remarks.background};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-align: start;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
  align-items: flex-start;
  box-shadow: ${({ theme }) => theme.color.remarks.shadow};
  cursor: pointer;
`;

const ToggleSwitch = styled.div<{ isPc: boolean }>`
  margin-top: 3px;
  margin-right: ${({ isPc }) => (isPc ? "16px" : "10px")};
  display: flex;
  align-items: center;

  span {
    margin-right: 4px;
    font-size: 14px;
    color: ${(props) => props.theme.color.PRIMARY_BASE};
  }
`;

const UpdatedTime = styled.div<{ isPc: boolean }>`
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  font-size: ${({ isPc }) => (isPc ? "12px" : "14px")};
  color: ${(props) => props.theme.color.PRIMARY_BASE};
`;

const ModalReloadButtonContainer = styled.div<{ isPc: boolean }>`
  > button {
    width: ${({ isPc }) => (isPc ? 36 : 45)}px;
    height: ${({ isPc }) => (isPc ? 36 : 45)}px;
    border-radius: 23px;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

export default CommonSubHeader;
