import React, { useState, useRef } from "react";
import Modal, { Styles } from "react-modal";
import dayjs from "dayjs";
import styled from "styled-components";
import { useAppDispatch } from "../../store/hooks";

import { funcAuthCheck } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { CommonState } from "../../reducers/common";
import { JobAuth } from "../../reducers/account";
import * as flightListModalsActions from "../../reducers/flightListModals";
import { openFlightModal } from "../../reducers/flightModals";
import { fetchFlightDetail } from "../../reducers/flightContentsFlightDetail";
import DraggableModal from "./DraggableModal";
import FlightList from "./FlightList";

interface Props {
  common: CommonState;
  jobAuth: JobAuth;
  flightListModal: flightListModalsActions.FlightListModal;
  closeModal: (flightListModal: flightListModalsActions.FlightListModal, e: React.MouseEvent<HTMLButtonElement>) => void;
  openFlightModal: typeof openFlightModal;
  fetchFlightDetail: typeof fetchFlightDetail;
  handleActiveModal: (flightListModal: flightListModalsActions.FlightListModal) => void;
  getFlightList: typeof flightListModalsActions.getFlightList;
  flightList?: flightListModalsActions.FlightList;
  isFetching: boolean;
  posRight?: boolean;
}

const FlightListModal: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const flightListContentRef = useRef<HTMLDivElement>(null);
  const [selectedFlightIdentifier, setSelectedFlightIdentifier] = useState("");

  const handleFlightDetail = (eLeg: FlightsApi.ELegList) => {
    const flightKey = {
      myApoCd: props.flightListModal.flightListKeys.selectedApoCd,
      orgDateLcl: eLeg.orgDateLcl,
      alCd: eLeg.alCd,
      fltNo: eLeg.fltNo,
      casFltNo: eLeg.casFltNo,
      skdDepApoCd: eLeg.skdDepApoCd,
      skdArrApoCd: eLeg.skdArrApoCd,
      skdLegSno: eLeg.skdLegSno,
      oalTblFlg: eLeg.oalTblFlg,
    };

    const posRight = false;
    const tabName = "Detail";
    void dispatch(props.openFlightModal({ flightKey, posRight, tabName }));
    void dispatch(props.fetchFlightDetail({ flightKey }));

    setSelectedFlightIdentifier(eLeg.alCd + eLeg.fltNo);
  };

  const getFlightList = () => {
    const { flightListModal } = props;
    focusToFlightList();
    void dispatch(props.getFlightList(flightListModal.flightListKeys));
  };

  const focusToFlightList = () => {
    const { handleActiveModal, flightListModal } = props;
    if (flightListContentRef.current) {
      flightListContentRef.current.focus();
    }
    handleActiveModal(flightListModal);
  };

  const { common, jobAuth, flightListModal, flightList, closeModal, isFetching, posRight } = props;

  return (
    <DraggableModal
      isOpen={flightListModal.opened}
      posRight={posRight}
      style={customStyles((800000000 + Math.round((flightListModal.focusedAt.getTime() - common.initDate.getTime()) / 100)) % 900000000)} // 800..番台でz-indexを設定(精度を下げて有効桁数を増やす為、下2桁を丸める)
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      key={`${flightListModal.key}`}
      title={`${flightListModal.flightListKeys.ship}/${dayjs(flightListModal.flightListKeys.date).format("DDMMM").toUpperCase()}`}
      onFocus={focusToFlightList}
      onReload={getFlightList}
      onClose={(e) => closeModal(flightListModal, e)}
      isFetching={isFetching}
    >
      <ScrollArea>
        {flightList && (
          <FlightList
            scrollContentRef={flightListContentRef}
            scrollContentOnClick={focusToFlightList}
            eLegList={flightList.eLegList}
            onFlightDetail={handleFlightDetail}
            selectedFlightIdentifier={selectedFlightIdentifier}
            flightDetailEnabled={funcAuthCheck(Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth)}
            isModalComponent
          />
        )}
      </ScrollArea>
    </DraggableModal>
  );
};

Modal.setAppElement("#content");

const customStyles = (timestamp9digit: number): Styles => ({
  overlay: {
    background: "transparent",
    pointerEvents: "none",
    zIndex: timestamp9digit,
  },
  content: {
    width: "100%",
    height: "100%",
    left: 0,
    right: 0,
    bottom: 0,
    background: "transparent",
    border: "none",
    pointerEvents: "none",
    padding: 0,
  },
});

const ScrollArea = styled.div`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
  height: 100%;
  margin-top: 2px;
`;

export default FlightListModal;
