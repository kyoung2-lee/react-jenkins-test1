import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

// import ExternalUrlPopup from "../../molecules/ExternalUrlPopup";
import FlightModal from "../molecules/FlightModal";
import { saveScroll, selectTab, toggleUtcMode } from "../../reducers/flightContents";
import { openDateTimeInputPopup } from "../../reducers/dateTimeInputPopup";
import * as flightModalsActions from "../../reducers/flightModals";
import * as flightPaxFromListActions from "../../reducers/flightContentsFlightPaxFrom";
import * as flightPaxToListActions from "../../reducers/flightContentsFlightPaxTo";
import * as stationOperationTaskActions from "../../reducers/flightContentsStationOperationTask";
import * as flightDetailActions from "../../reducers/flightContentsFlightDetail";
import * as flightChangeHistoryActions from "../../reducers/flightContentsFlightChangeHistory";
import * as flightSpecialCareActions from "../../reducers/flightContentsFlightSpecialCare";
import * as flightBulletinBoardActions from "../../reducers/flightContentsBulletinBoard";
import * as bulletinBoardResponseEditorModalActions from "../../reducers/bulletinBoardResponseEditorModal";

const FlightModals: React.FC = () => {
  const dispatch = useAppDispatch();
  const common = useAppSelector((state) => state.common);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const master = useAppSelector((state) => state.account.master);
  const flightModals = useAppSelector((state) => state.flightModals);
  const flightContents = useAppSelector((state) => state.flightContents);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [announceToPaxUrl, setAnnounceToPaxUrl] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAnnounceToPaxOpen, setIsAnnounceToPaxOpen] = useState(false);

  const closeModal = (flightModal: flightModalsActions.FlightModal, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.stopPropagation();
    }
    void dispatch(flightModalsActions.closeFlightModal({ identifier: flightModal.identifier }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openAnnounceToPax = (url: string) => {
    setAnnounceToPaxUrl(url);
    setIsAnnounceToPaxOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const closeAnnounceToPax = () => {
    setIsAnnounceToPaxOpen(false);
  };

  const handleCloseAll = () =>
    flightModals.modals.forEach((modal) => {
      void dispatch(flightModalsActions.closeFlightModal({ identifier: modal.identifier }));
    });

  return (
    <Wrapper>
      {flightModals.modals.map((modal) => {
        const content = flightContents.contents.find((c) => c.identifier === modal.identifier);

        return (
          <FlightModal
            key={`${modal.key}`}
            common={common}
            jobAuth={jobAuth}
            master={master}
            modal={modal}
            content={content}
            saveScroll={saveScroll}
            selectTab={selectTab}
            toggleUtcMode={toggleUtcMode}
            openDateTimeInputPopup={openDateTimeInputPopup}
            flightModalsActions={flightModalsActions}
            flightDetailActions={flightDetailActions}
            stationOperationTaskActions={stationOperationTaskActions}
            flightChangeHistoryActions={flightChangeHistoryActions}
            flightSpecialCareActions={flightSpecialCareActions}
            flightPaxFromListActions={flightPaxFromListActions}
            flightPaxToListActions={flightPaxToListActions}
            flightBulletinBoardActions={flightBulletinBoardActions}
            bulletinBoardResponseEditorModalActions={bulletinBoardResponseEditorModalActions}
            dispatch={dispatch}
            closeModal={closeModal}
            handleCloseAll={handleCloseAll}
          />
        );
      })}

      {/* <ExternalUrlPopup
        isOpen={this.state.isAnnounceToPaxOpen}
        url={this.state.announceToPaxUrl}
        onClose={this.closeAnnounceToPax}
      /> */}
    </Wrapper>
  );
};

Modal.setAppElement("#content");

const Wrapper = styled.div``;

export default FlightModals;
