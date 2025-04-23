import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../store/hooks";
import { parseTimeLcl } from "../../../lib/commonUtil";
import { storage } from "../../../lib/storage";
import RoundButtonReload from "../../atoms/RoundButtonReload";

interface Props {
  isBbActive: boolean;
  isEmailActive: boolean;
  isTtyActive: boolean;
  isAftnActive: boolean;
  isNotificationActive: boolean;
  isAcarsActive: boolean;
  onClickBb: () => void;
  onClickEmail: () => void;
  onClickTty: () => void;
  onClickAftn: () => void;
  onClickNotification: () => void;
  onClickAcars: () => void;
  emailDisabled: boolean;
  ttyDisabled: boolean;
  aftnDisabled: boolean;
  notificationDisabled: boolean;
  acarsDisabled: boolean;
  reloadButtonDisabled: boolean;
  onClickReload: () => void;
  isFetching: boolean;
  myApoCd: string;
}

const Tabs: React.FC<Props> = (props) => {
  const {
    isBbActive,
    isEmailActive,
    isTtyActive,
    isAftnActive,
    isNotificationActive,
    isAcarsActive,
    onClickBb,
    onClickEmail,
    onClickTty,
    onClickAftn,
    onClickNotification,
    onClickAcars,
    emailDisabled,
    ttyDisabled,
    aftnDisabled,
    notificationDisabled,
    acarsDisabled,
    reloadButtonDisabled,
    onClickReload,
    isFetching,
    myApoCd,
  } = props;

  const { apoTimeLcl, apoTimeDiffUtc } = useAppSelector((state) => state.common.headerInfo);
  const { canManageBb, canManageEmail, canManageTty, canManageAftn, canManageNotification, canManageAcars } = useAppSelector(
    (state) => state.broadcast.Broadcast
  );

  const { isPc } = storage;
  const parsedTimeLcl = parseTimeLcl({ timeLcl: apoTimeLcl, timeDiffUtc: apoTimeDiffUtc, isLocal: !!myApoCd });

  return (
    <TabContainer>
      {canManageBb ? (
        <Tab isActive={isBbActive} onClick={onClickBb}>
          B.B.
        </Tab>
      ) : null}
      {canManageEmail ? (
        <Tab isActive={isEmailActive} onClick={onClickEmail} disabled={emailDisabled}>
          e-mail
        </Tab>
      ) : null}
      {canManageTty ? (
        <Tab isActive={isTtyActive} onClick={onClickTty} disabled={ttyDisabled}>
          TTY
        </Tab>
      ) : null}
      {canManageAftn ? (
        <Tab isActive={isAftnActive} onClick={onClickAftn} disabled={aftnDisabled}>
          AFTN
        </Tab>
      ) : null}
      {canManageNotification ? (
        <Tab isActive={isNotificationActive} onClick={onClickNotification} disabled={notificationDisabled} fontSize={15}>
          Notification
        </Tab>
      ) : null}
      {canManageAcars ? (
        <Tab isActive={isAcarsActive} onClick={onClickAcars} disabled={acarsDisabled}>
          ACARS
        </Tab>
      ) : null}
      <UpdatedTime isPc={isPc}>
        <span>{parsedTimeLcl.date}</span>
        <span>{parsedTimeLcl.time}</span>
      </UpdatedTime>
      {reloadButtonDisabled ? null : (
        <ReloadButtonContainer isPc={isPc}>
          <RoundButtonReload tabIndex={10} isFetching={isFetching} disabled={reloadButtonDisabled} onClick={onClickReload} />
        </ReloadButtonContainer>
      )}
    </TabContainer>
  );
};

const TabContainer = styled.div`
  position: absolute;
  width: 100%;
  z-index: 3;
  display: flex;

  > div:nth-of-type(n + 2) {
    border-left: none;
  }
`;

const Tab = styled.div<{ isActive: boolean; disabled?: boolean; fontSize?: number }>`
  width: 120px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #595857;
  border-bottom: 1px solid
    ${(props) => (props.isActive && !props.disabled ? "#fff" : props.isActive && props.disabled ? "#C9D3D0" : "#595857")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  background: ${(props) => (props.disabled || !props.isActive ? "#C9D3D0" : "#fff")};
  color: #346181;
  box-shadow: ${(props) => (props.isActive ? "1px -1px 1px rgba(0,0,0,0.1)" : "none")};
  z-index: ${(props) => (props.isActive ? "1" : "0")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "16px")};
`;

const UpdatedTime = styled.div<{ isPc: boolean }>`
  margin: auto;
  margin-right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 14px;
  padding-left: 10px;
`;

const ReloadButtonContainer = styled.div<{ isPc: boolean }>`
  margin: -3px 0 auto 6px;
  > button {
    width: 42px;
    height: 42px;
    border-radius: 23px;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

export default Tabs;
