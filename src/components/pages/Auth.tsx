import React from "react";
import NotificationsSystem, { wyboTheme, dismissNotification } from "reapop";
import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import EditRmksPopup from "../organisms/EditRmksPopup";
import FisFilterModal from "../organisms/FisFilterModal";
import FlightListModals from "../organisms/FlightListModals";
import FlightNumberInputPopup from "../organisms/FlightNumberInputPopup";
import Loading from "../organisms/Loading";
import OalPaxModal from "../organisms/OalPax";
import OalPaxStatusModal from "../organisms/OalPaxStatus";
import OalAircraftModal from "../organisms/OalAircraft";
import ScreenMask from "../organisms/ScreenMask";
import ShipTransitListModals from "../organisms/ShipTransitListModals";
import SPCommonFooter from "../organisms/SmartPhone/SPCommonFooter/SPCommonFooter";
import SpotNumberModal from "../organisms/SpotNumberModal";
import SpotNumberModeless from "../organisms/SpotNumberModeless";
import DateTimeInputPopup from "../organisms/DateTimeInputPopup";
import FlightModals from "../organisms/FlightModals";
import Lightbox from "../molecules/Lightbox";
import { BulletinBoardAddressModal } from "../molecules/BulletinBoardAddressModal";
import FlightMovementModal from "../organisms/FlightMovementModal/FlightMovementModal";
import MvtMsgModal from "../organisms/MvtMsgModal";
import OalFuelModal from "../organisms/OalFuel";
import SpotNumberRestrictionPopup from "../organisms/SpotNumberRestrictionPopup";

interface Props {
  children: JSX.Element;
  onClickBb: () => void;
}

const Auth: React.FC<Props> = (props) => {
  const { children, onClickBb } = props;
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications);

  return storage.terminalCat === Const.TerminalCat.iPhone ? (
    <Wrapper>
      {children}
      <SPCommonFooter onClickBb={onClickBb} />
      <FisFilterModal />
      <FlightNumberInputPopup />
      <FlightListModals />
      <ShipTransitListModals />
      <DateTimeInputPopup />
      <EditRmksPopup />
      <Loading />
      {/* TODO NotificationのiPhoneの表示を確認する */}
      <NotificationsSystem
        notifications={notifications}
        dismissNotification={(id) => dispatch(dismissNotification(id))}
        theme={wyboTheme}
        smallScreenBreakpoint={1}
      />
      <ScreenMask />
      <FlightModals />
      <Lightbox />
      <BulletinBoardAddressModal />
      <FlightMovementModal />
    </Wrapper>
  ) : (
    <Wrapper>
      {children}
      <FisFilterModal />
      <FlightNumberInputPopup />
      <FlightListModals />
      <ShipTransitListModals />
      <DateTimeInputPopup />
      <EditRmksPopup />
      <Loading />
      <NotificationsSystem
        notifications={notifications}
        dismissNotification={(id) => dispatch(dismissNotification(id))}
        theme={wyboTheme}
        smallScreenBreakpoint={1}
      />
      <ScreenMask />
      <FlightModals />
      <Lightbox />
      <BulletinBoardAddressModal />
      <FlightMovementModal />
      <MvtMsgModal />
      <OalPaxModal />
      <OalPaxStatusModal />
      <SpotNumberModal />
      <SpotNumberModeless />
      <OalAircraftModal />
      <OalFuelModal />
      <SpotNumberRestrictionPopup />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export default Auth;
