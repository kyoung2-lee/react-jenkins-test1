import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Modal from "react-modal";
import { useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import { Const } from "../../../../lib/commonConst";

import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import * as commonActions from "../../../../reducers/common";
import MovableAirportIcons from "../../../molecules/MovableAirportIcons";
import AirportIssueListModal from "../../../molecules/AirportIssueList";

import iconRwyArrSvg from "../../../../assets/images/icon/icon-rwy-arr.svg";
import iconRwyDepSvg from "../../../../assets/images/icon/icon-rwy-dep.svg";

const SPCommonHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const history = useHistory();

  const common = useAppSelector((state) => state.common);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);

  const [isIssueListActive, setIsIssueListActive] = useState(false);

  useEffect(() => {
    const apoCd = jobAuth.user.myApoCd;
    void dispatch(commonActions.getHeaderInfo({ apoCd }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 強制エラー画面への遷移
  useEffect(() => {
    if (common.isForceGoToError) {
      dispatch(commonActions.screenTransitionError());
      history.push(Const.PATH_NAME.error);
    }
  }, [common.isForceGoToError, dispatch, history]);

  // 強制画面遷移
  useEffect(() => {
    if (common.forceGoToPath) {
      void dispatch(commonActions.screenTransition({ from: pathname, to: common.forceGoToPath }));
      history.push(common.forceGoToPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [common.forceGoToPath, dispatch, history]);

  const renderRunway = (index: number, label: string) => [index === 0 ? "" : "/", <span key={label}>{label}</span>];

  const openIssueListModal = () => {
    setIsIssueListActive(true);
  };

  const closeIssueListModal = () => {
    setIsIssueListActive(false);
  };

  const { apoCd, usingRwy, issu, terminalUtcDate, apoTimeLcl } = common.headerInfo;
  const ldRwys = usingRwy ? usingRwy.filter((data) => data.rwyToLdCat === "LD" && !!data.rwyNo).slice(0, 2) : [];
  const toRwys = usingRwy ? usingRwy.filter((data) => data.rwyToLdCat === "TO" && !!data.rwyNo).slice(0, 2) : [];
  const hasAirport = !!jobAuth.user.myApoCd;
  const dayjsTimeLcl = apoTimeLcl ? dayjs(apoTimeLcl) : null;

  return (
    <Wrapper hasAirport={hasAirport}>
      <Left>
        <Airport>{apoCd}</Airport>
        <RWY>
          {hasAirport && (
            <div>
              <RwyArrIcon />
              {ldRwys.map((ldRwy, index) => renderRunway(index, ldRwy.rwyNo))}
            </div>
          )}
          {hasAirport && (
            <div>
              <RwyDepIcon />
              {toRwys.map((toRwy, index) => renderRunway(index, toRwy.rwyNo))}
            </div>
          )}
        </RWY>
        {hasAirport && (
          <MovableAirportIcons
            onClick={openIssueListModal}
            issus={issu}
            terminalUtcDate={common.headerInfo.terminalUtcDate}
            numberOfDisplay={3}
          />
        )}
      </Left>
      <UpdatedTime hasAirport={hasAirport}>
        <div>{dayjsTimeLcl && dayjsTimeLcl.format("MM/DD")}</div>
        <div>{dayjsTimeLcl && `${dayjsTimeLcl.format("HH:mm")}${hasAirport ? " L" : ""}`}</div>
      </UpdatedTime>

      {/* 発令一覧モーダル */}
      <ModalWithAnimation isOpen={isIssueListActive} style={customStyles} onRequestClose={closeIssueListModal}>
        <AirportIssueListModal issus={issu} apoCd={apoCd} terminalUtcDate={terminalUtcDate} />
      </ModalWithAnimation>
    </Wrapper>
  );
};

const customStyles: Modal.Styles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 990000000 /* reapop(999999999)の下、フッターの上 */,
  },
  content: {
    padding: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "transparent",
    border: "none",
    pointerEvents: "none",
  },
};

// モバイルの場合は、ステータスバーの分だけヘッダーを厚くする
const Wrapper = styled.div<{ hasAirport: boolean }>`
  padding: ${({ hasAirport }) => (hasAirport ? "18px" : "22px")} 10px 0px 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ hasAirport, theme: { layout, color } }) => `
      color: ${color.PRIMARY_BASE};
      background: ${color.HEADER_GRADIENT};
      min-height: ${hasAirport ? layout.header.mobile : layout.header.moblieSlim};
  `};
`;
const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Airport = styled.div`
  width: 70px;
  font-size: 24px;
  line-height: 25px;
  text-align: center;
`;

const RWY = styled.div`
  width: 100px;
`;

const ModalWithAnimation = styled(Modal)`
  opacity: 0;
  position: absolute;
  top: -100px;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &.ReactModal__Content--after-open {
    opacity: 1;
    top: 0;
    transition: all 300ms;
  }

  &.ReactModal__Content--before-close {
    opacity: 0;
    transition: opacity 300ms;
  }
`;

const RwyArrIcon = styled.img.attrs({ src: iconRwyArrSvg })`
  width: 15px;
  height: 17px;
  vertical-align: bottom;
`;
const RwyDepIcon = styled.img.attrs({ src: iconRwyDepSvg })`
  position: relative;
  right: -2px;
  width: 15px;
  height: 17px;
  vertical-align: bottom;
`;

const UpdatedTime = styled.div<{ hasAirport: boolean }>`
  display: flex;
  flex-direction: ${({ hasAirport }) => (hasAirport ? "column" : "row")};
  align-items: flex-end;
  font-size: 14px;
  color: #fff;
  > div {
    margin-left: ${({ hasAirport }) => (hasAirport ? "0" : "6px")};
  }
`;

export default SPCommonHeader;
