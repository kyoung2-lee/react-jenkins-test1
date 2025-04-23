import React from "react";
import { getFormSyncErrors } from "redux-form";
import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import FlightSearchForm from "../../../molecules/FlightSearchForm";
import { openDateTimeInputPopup } from "../../../../reducers/dateTimeInputPopup";
import * as commonActions from "../../../../reducers/common";
import { openFlightModal } from "../../../../reducers/flightModals";
import { fetchFlightDetail } from "../../../../reducers/flightContentsFlightDetail";
import { fetchStationOperationTask } from "../../../../reducers/flightContentsStationOperationTask";

import { openFlightNumberInputPopup } from "../../../../reducers/flightNumberInputPopup";
import * as flightSearchActions from "../../../../reducers/flightSearch";
// import ExternalUrlPopup from "../../../molecules/ExternalUrlPopup";
import { getIdentifier } from "../../../../reducers/flightContents";
import { openFlightMovementModal } from "../../../../reducers/flightMovementModal";
import { openMvtMsgModal } from "../../../../reducers/mvtMsgModal";

const SPFlightSearch: React.FC = () => {
  const dispatch = useAppDispatch();

  const common = useAppSelector((state) => state.common);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const master = useAppSelector((state) => state.account.master);
  const flightSearch = useAppSelector((state) => state.flightSearch);
  const formSyncErrors = useAppSelector((state) => getFormSyncErrors("flightSearch")(state));

  // const [announceToPaxUrl, setAnnounceToPaxUrl] = useState("");
  // const [isAnnounceToPaxOpen, setIsAnnounceToPaxOpen] = useState(false);

  // const openAnnounceToPax = (url: string) => {
  //   setAnnounceToPaxUrl(url);
  //   setIsAnnounceToPaxOpen(true);
  // };

  // const closeAnnounceToPax = () => {
  //   setIsAnnounceToPaxOpen(false);
  // };

  const handleFlightDetail = (eLeg: FlightsApi.ELegList) => {
    const flightKey = {
      myApoCd: jobAuth.user.myApoCd,
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

    // 便詳細モーダルを開くときに、便一覧のstoreにselectedFlightNoを書き込む
    dispatch(flightSearchActions.openFlightDetail({ selectedFlightIdentifier: getIdentifier(flightKey) }));
    void dispatch(openFlightModal({ flightKey, posRight, tabName }));
    void dispatch(fetchFlightDetail({ flightKey }));
  };

  const handleStationOperationTask = (eLeg: FlightsApi.ELegList) => {
    const flightKey = {
      myApoCd: jobAuth.user.myApoCd,
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
    const tabName = "Task";
    dispatch(flightSearchActions.openFlightDetail({ selectedFlightIdentifier: getIdentifier(flightKey) }));
    void dispatch(openFlightModal({ flightKey, posRight, tabName }));
    void dispatch(fetchStationOperationTask({ flightKey }));
  };

  return (
    <Wrapper>
      <FlightSearchForm
        jobAuth={jobAuth}
        master={master}
        flightSearch={flightSearch}
        searchFlight={flightSearchActions.searchFlight}
        openDateTimeInputPopup={openDateTimeInputPopup}
        openFlightNumberInputPopup={openFlightNumberInputPopup}
        getHeaderInfo={commonActions.getHeaderInfo}
        formSyncErrors={formSyncErrors}
        handleFlightDetail={handleFlightDetail}
        common={common}
        showNotificationAirportRmksNoChange={commonActions.showNotificationAirportRmksNoChange}
        updateAirportRemarks={commonActions.updateAirportRemarks}
        handleStationOperationTask={handleStationOperationTask}
        showConfirmation={flightSearchActions.showConfirmation}
        openOalFlightMovementModal={openFlightMovementModal}
        openMvtMsgModal={openMvtMsgModal}
      />

      {/* <ExternalUrlPopup isOpen={isAnnounceToPaxOpen} url={announceToPaxUrl} onClose={closeAnnounceToPax} /> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  background: #fff;
`;

export default SPFlightSearch;
