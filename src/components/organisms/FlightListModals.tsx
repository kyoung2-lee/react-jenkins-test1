import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import * as flightListModalsActions from "../../reducers/flightListModals";
import { openFlightModal } from "../../reducers/flightModals";
import { fetchFlightDetail } from "../../reducers/flightContentsFlightDetail";
import ErrorPopup from "../molecules/ErrorPopup";
import FlightListModal from "../molecules/FlightListModal";

const FlightListModals: React.FC = () => {
  const dispatch = useAppDispatch();
  const common = useAppSelector((state) => state.common);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const flightListModals = useAppSelector((state) => state.flightListModals);

  // eslint-disable-next-line react/sort-comp
  const closeModal = (flightListModal: flightListModalsActions.FlightListModal, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(flightListModalsActions.closeFlightListModal(flightListModal));
  };

  const handleActiveModal = (flightListModal: flightListModalsActions.FlightListModal) => {
    dispatch(flightListModalsActions.focusFlightListModal(flightListModal));
  };

  return (
    <Wrapper>
      {flightListModals.modals.map((modal) => (
        <FlightListModal
          key={`${modal.key}`}
          common={common}
          jobAuth={jobAuth}
          posRight={modal.posRight}
          flightListModal={modal}
          closeModal={closeModal}
          handleActiveModal={handleActiveModal}
          getFlightList={flightListModalsActions.getFlightList}
          flightList={modal.lists}
          openFlightModal={openFlightModal}
          fetchFlightDetail={fetchFlightDetail}
          isFetching={modal.isFetching}
        />
      ))}

      {flightListModals.retry ? (
        <ErrorPopup dispatch={dispatch} isError={flightListModals.isError} retry={flightListModals.retry} />
      ) : undefined}
    </Wrapper>
  );
};

Modal.setAppElement("#content");

const Wrapper = styled.div``;

export default FlightListModals;
