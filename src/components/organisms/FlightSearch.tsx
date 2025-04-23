import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getFormSyncErrors } from "redux-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import FlightSearchForm from "../molecules/FlightSearchForm";
import { openFlightNumberInputPopup } from "../../reducers/flightNumberInputPopup";
import { openFlightMovementModal } from "../../reducers/flightMovementModal";
import * as flightSearchActions from "../../reducers/flightSearch";
import { saveScroll, selectTab, toggleUtcMode, addFlightContent, getIdentifier, FlightKey, Content } from "../../reducers/flightContents";
import { openDateTimeInputPopup } from "../../reducers/dateTimeInputPopup";
import * as flightModalsActions from "../../reducers/flightModals";
import * as flightDetailActions from "../../reducers/flightContentsFlightDetail";
import * as stationOperationTaskActions from "../../reducers/flightContentsStationOperationTask";
import * as flightChangeHistoryActions from "../../reducers/flightContentsFlightChangeHistory";
import * as flightSpecialCareActions from "../../reducers/flightContentsFlightSpecialCare";
import * as flightPaxFromListActions from "../../reducers/flightContentsFlightPaxFrom";
import * as flightPaxToListActions from "../../reducers/flightContentsFlightPaxTo";
import * as flightBulletinBoardActions from "../../reducers/flightContentsBulletinBoard";
import * as bulletinBoardResponseEditorModalActions from "../../reducers/bulletinBoardResponseEditorModal";
import { openMvtMsgModal } from "../../reducers/mvtMsgModal";
import FlightModalHeader from "../molecules/FlightModalHeader";
import FlightContents from "../molecules/FlightContents";

const FlightSearch: React.FC = () => {
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const flightContents = useAppSelector((state) => state.flightContents);
  const flightSearch = useAppSelector((state) => state.flightSearch);
  const common = useAppSelector((state) => state.common);
  const master = useAppSelector((state) => state.account.master);
  const formSyncErrors = useAppSelector((state) => getFormSyncErrors("flightSearch")(state));

  const [content, setContent] = useState<Content | undefined>(undefined);

  useEffect(() => {
    setContent(flightContents.contents.find((c) => c.identifier === flightSearch.selectedFlightIdentifier));
  }, [flightContents.contents, flightSearch.selectedFlightIdentifier]);

  const handleFlightDetailList = (eLeg: FlightsApi.ELegList) => {
    const flightKey: FlightKey = {
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
    const selectedFlightIdentifier = getIdentifier(flightKey);
    const isReload = true;

    dispatch(flightSearchActions.openFlightDetail({ selectedFlightIdentifier }));
    dispatch(addFlightContent({ flightKey, tabName: "Detail", removeAll: true }));
    void dispatch(flightDetailActions.fetchFlightDetail({ flightKey, isReload }));
  };

  const getHeader = (cont: Content | undefined) => {
    if (!cont || !cont.flightHeader) {
      return <div />;
    }
    const isDetail = cont.currentTabName === "Detail";
    const { isUtc } = cont;
    const { flightHeader } = cont;
    return <FlightModalHeader isDetail={isDetail} isUtc={isUtc} flightHeader={flightHeader} />;
  };

  const flightDetailHeader = getHeader(content);

  return (
    <Wrapper>
      <LeftColumn>
        <FlightSearchForm
          jobAuth={jobAuth}
          master={master}
          flightSearch={flightSearch}
          searchFlight={flightSearchActions.searchFlight}
          openDateTimeInputPopup={openDateTimeInputPopup}
          openFlightNumberInputPopup={openFlightNumberInputPopup}
          openOalFlightMovementModal={openFlightMovementModal}
          formSyncErrors={formSyncErrors}
          handleFlightDetail={handleFlightDetailList}
          openMvtMsgModal={openMvtMsgModal}
        />
      </LeftColumn>

      {content ? (
        <RightColumn>
          <FlightHeader>{flightDetailHeader}</FlightHeader>
          <RightScrollArea>
            <FlightContents
              scrollContentRef={scrollContentRef}
              common={common}
              jobAuth={jobAuth}
              master={master}
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
            />
          </RightScrollArea>
        </RightColumn>
      ) : (
        <DefaultColumn />
      )}
    </Wrapper>
  );
};

// prettierに自動整形させた場合、改行位置の兼ね合いでエラーが出てしまうため、この場所では無効にする
// prettier-ignore
const Wrapper = styled.div`
  min-height: calc(100vh - ${props => (storage.terminalCat === Const.TerminalCat.pc ? props.theme.layout.header.default : props.theme.layout.header.tablet)});
  width: 778px;
  margin: 0 auto;
  padding: 8px 8px 0 8px;
  display: flex;
  justify-content: space-between;
  background: #fff;
`;
const DefaultColumn = styled.div`
  width: 375px;
`;
const LeftColumn = styled(DefaultColumn)`
  height: calc(
    100vh -
      ${(props) => (storage.terminalCat === Const.TerminalCat.pc ? props.theme.layout.header.default : props.theme.layout.header.tablet)} -
      8px
  );
  overflow-y: hidden;
`;
const RightColumn = styled(DefaultColumn)`
  height: calc(
    100vh -
      ${(props) => (storage.terminalCat === Const.TerminalCat.pc ? props.theme.layout.header.default : props.theme.layout.header.tablet)} -
      16px
  );
  box-shadow: -1px 1px 3px rgba(0, 0, 0, 0.3);
`;
const RightScrollArea = styled.div`
  height: calc(100% - 40px);
`;

const FlightHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  min-height: 40px;
  height: 40px;
`;

export default FlightSearch;
