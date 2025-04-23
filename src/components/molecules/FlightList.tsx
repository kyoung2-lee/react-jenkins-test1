import React from "react";
import styled from "styled-components";
import FlightSearchResult from "./FlightSearchResult";
import FlightListHeader from "../atoms/FlightListHeader";
import { type openFlightMovementModal } from "../../reducers/flightMovementModal";
import { type openMvtMsgModal } from "../../reducers/mvtMsgModal";

interface Props {
  eLegList: FlightsApi.ELegList[];
  scrollContentRef?: React.RefObject<HTMLDivElement>;
  scrollContentOnClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  onFlightDetail: (eLeg: FlightsApi.ELegList) => void;
  selectedFlightIdentifier: string;
  stationOperationTaskEnabled?: boolean;
  onStationOperationTask?: (eLeg: FlightsApi.ELegList) => void;
  openOalFlightMovementModal?: typeof openFlightMovementModal;
  flightMovementEnabled?: boolean;
  flightDetailEnabled?: boolean;
  isModalComponent: boolean;
  mvtMsgEnabled?: boolean;
  openMvtMsgModal?: typeof openMvtMsgModal;
}

class FlightList extends React.Component<Props> {
  private flightListScrollRef: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.flightListScrollRef = this.props.scrollContentRef || React.createRef<HTMLDivElement>();
  }

  render() {
    const {
      eLegList,
      scrollContentOnClick,
      onFlightDetail,
      selectedFlightIdentifier,
      onStationOperationTask,
      stationOperationTaskEnabled,
      openOalFlightMovementModal,
      flightMovementEnabled,
      flightDetailEnabled,
      isModalComponent,
      mvtMsgEnabled,
      openMvtMsgModal,
    } = this.props;

    return (
      <Wrapper>
        <ScrollContents tabIndex={-1} ref={this.flightListScrollRef} onClick={scrollContentOnClick}>
          <FlightListHeader totalNumber={eLegList.length} />
          <FlightListTable>
            <tbody>
              {eLegList.map((eLeg, i) => (
                <FlightSearchResult
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  eLeg={eLeg}
                  onFlightDetail={onFlightDetail}
                  selectedFlightIdentifier={selectedFlightIdentifier}
                  stationOperationTaskEnabled={stationOperationTaskEnabled}
                  onStationOperationTask={onStationOperationTask}
                  openOalFlightMovementModal={openOalFlightMovementModal}
                  flightMovementEnabled={flightMovementEnabled}
                  flightDetailEnabled={flightDetailEnabled}
                  isModalComponent={isModalComponent}
                  mvtMsgEnabled={mvtMsgEnabled}
                  openMvtMsgModal={openMvtMsgModal}
                />
              ))}
            </tbody>
          </FlightListTable>
        </ScrollContents>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: auto;
`;

const ScrollContents = styled.div`
  width: 100%;
  height: 100%;
`;

const FlightListTable = styled.table`
  width: calc(100% - 4px);
  margin-left: 2px;
  margin-top: -4px;
  border-spacing: 0 8px;
  tbody {
    vertical-align: top;
  }
  tbody > tr > td:nth-child(1) {
    width: 80px;
  }
  tbody > tr > td:nth-child(2) {
    width: 120px;
  }
  tbody > tr > td:nth-child(3) {
    width: 105px;
  }
`;

export default FlightList;
