import React from "react";
import NotificationsSystem, { wyboTheme, dismissNotification } from "reapop";
import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import ScreenMask from "../organisms/ScreenMask";
import Loading from "../organisms/Loading";
import JobAuthContainer from "../organisms/JobAuth";

const JobAuth = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications);

  return (
    <Wrapper>
      <JobAuthContainer />
      {/* TODO NotificationのiPhoneの表示を確認する */}
      <NotificationsSystem
        notifications={notifications}
        dismissNotification={(id) => dispatch(dismissNotification(id))}
        theme={wyboTheme}
        smallScreenBreakpoint={1}
      />
      <ScreenMask />
      <Loading />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #fff;
`;

export default JobAuth;
