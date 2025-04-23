import React from "react";
import styled, { css, keyframes } from "styled-components";
import dayjs from "dayjs";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Const } from "../../../lib/commonConst";
import { storage } from "../../../lib/storage";
import { funcAuthCheck } from "../../../lib/commonUtil";
import { HeaderInfo } from "../../../reducers/common";
import * as myScheduleExports from "../../../reducers/mySchedule";
import { JobAuth } from "../../../reducers/account";
import FisRow from "../FisRow";

type Props = {
  headerInfo: HeaderInfo;
  fis: myScheduleExports.FisState;
  jobAuth: JobAuth;
};

type State = {
  isTwoColumnMode: boolean;
  isLongColumnArr: boolean;
  selectedColumn: string;
  stationOperationTaskEnabled: boolean; // 発着工程情報更新画面の使用可否
  flightMovementEnabled: boolean; // 便動態更新画面の使用可否
  mvtMsgEnabled: boolean; // 便動態発信画面の使用可否
  flightDetailEnabled: boolean; // 便情報詳細画面の使用可否
  flightListEnabled: boolean; // 機材接続情報画面の使用可否
  flightRmksEnabled: boolean; // 便リマークス更新画面の使用可否
  oalAircraftEnabled: boolean; // 他社便機材情報更新画面の使用可否
  oalPaxEnabled: boolean; // 他社便旅客数更新画面の使用可否
  oalPaxStatusEnabled: boolean; // 他社便旅客ステータス更新画面の使用可否
  spotNoEnabled: boolean; // SPOT番号更新画面の使用可否
  oalFuelEnabled: boolean; // 他社便燃料情報更新画面の使用可否
};

enum selectedColumnType {
  Dep = "D",
  Arr = "A",
}

class MyScheduleFis extends React.Component<Props, State> {
  private HEADER_HEIGHT = storage.isPc ? 24 : 30;

  constructor(props: Props) {
    super(props);

    this.state = {
      isTwoColumnMode: false,
      isLongColumnArr: false,
      selectedColumn: "",
      stationOperationTaskEnabled: funcAuthCheck(Const.FUNC_ID.openOperationTask, this.props.jobAuth.jobAuth),
      flightMovementEnabled: funcAuthCheck(Const.FUNC_ID.openOalFlightMovement, this.props.jobAuth.jobAuth),
      mvtMsgEnabled: funcAuthCheck(Const.FUNC_ID.openMvtMsg, this.props.jobAuth.jobAuth),
      flightDetailEnabled: funcAuthCheck(Const.FUNC_ID.openFlightDetail, this.props.jobAuth.jobAuth),
      flightListEnabled: funcAuthCheck(Const.FUNC_ID.openShipTransitList, this.props.jobAuth.jobAuth),
      flightRmksEnabled: funcAuthCheck(Const.FUNC_ID.updateFlightRemarks, this.props.jobAuth.jobAuth),
      oalAircraftEnabled: funcAuthCheck(Const.FUNC_ID.openOalAircraft, this.props.jobAuth.jobAuth),
      oalPaxEnabled: funcAuthCheck(Const.FUNC_ID.openOalPax, this.props.jobAuth.jobAuth),
      oalFuelEnabled: funcAuthCheck(Const.FUNC_ID.openOalFuel, this.props.jobAuth.jobAuth),
      oalPaxStatusEnabled: funcAuthCheck(Const.FUNC_ID.openOalPaxStatus, this.props.jobAuth.jobAuth),
      spotNoEnabled: funcAuthCheck(Const.FUNC_ID.openSpotNo, this.props.jobAuth.jobAuth),
    };

    this.setArrOrDep = this.setArrOrDep.bind(this);
  }

  componentDidMount() {
    this.setArrOrDep();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.fis.fisRow !== prevProps.fis.fisRow) {
      this.setArrOrDep();
    }
  }

  setArrOrDep = () => {
    if (storage.isPc) return;

    this.setState({
      isTwoColumnMode: true,
      isLongColumnArr: this.props.fis.depArrType === selectedColumnType.Arr,
      selectedColumn: this.props.fis.depArrType,
    });
  };

  handleTwoColumnMode = () => {
    if (storage.isPc || this.state.selectedColumn === "") return;
    const isArr = this.state.selectedColumn === selectedColumnType.Arr;
    this.setState((prevState) => ({
      isTwoColumnMode: !prevState.isTwoColumnMode,
      isLongColumnArr: isArr,
    }));
  };

  handleArrSelected = () => {
    if (storage.isPc || this.state.selectedColumn === selectedColumnType.Arr) return;
    this.setState({
      selectedColumn: selectedColumnType.Arr,
    });
  };

  handleDepSelected = () => {
    if (storage.isPc || this.state.selectedColumn === selectedColumnType.Dep) return;
    this.setState({
      selectedColumn: selectedColumnType.Dep,
    });
  };

  render() {
    const { fis } = this.props;
    const { isTwoColumnMode, isLongColumnArr, selectedColumn } = this.state;
    const { isPc } = storage;
    return (
      <Wrapper>
        <FisHeader isPc={isPc} isLongColumnArr={isLongColumnArr} isTwoColumnMode={isTwoColumnMode} selectedColumn={selectedColumn}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className={
              isLongColumnArr && isTwoColumnMode ? "headerContentLong" : isTwoColumnMode ? "headerContentHide" : "headerContentArr"
            }
            onClick={this.handleArrSelected}
            onKeyUp={() => {}}
          >
            <TwoColumnSwitchBtn height={this.HEADER_HEIGHT} isLeft>
              <div />
              <div>Arrival</div>
              <div>
                {!isPc && selectedColumn === selectedColumnType.Arr && (
                  <>
                    <div className="UnderArrow">
                      <FontAwesomeIcon icon={faArrowDown} />
                    </div>
                    <div className="FlightSign">Flight</div>
                  </>
                )}
              </div>
            </TwoColumnSwitchBtn>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div className="centerContent" onClick={this.handleTwoColumnMode} onKeyUp={() => {}}>
            <StationOperationHeader isPc={isPc} height={this.HEADER_HEIGHT}>
              Station Operation
            </StationOperationHeader>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className={
              !isLongColumnArr && isTwoColumnMode ? "headerContentLong" : isTwoColumnMode ? "headerContentHide" : "headerContentDep"
            }
            onClick={this.handleDepSelected}
            onKeyUp={() => {}}
          >
            <TwoColumnSwitchBtn height={this.HEADER_HEIGHT} isLeft={false}>
              <div />
              <div>Departure</div>
              <div>
                {!isPc && selectedColumn === selectedColumnType.Dep && (
                  <>
                    <div className="UnderArrow">
                      <FontAwesomeIcon icon={faArrowDown} />
                    </div>
                    <div className="FlightSign">Flight</div>
                  </>
                )}
              </div>
            </TwoColumnSwitchBtn>
          </div>
        </FisHeader>
        {fis.fisRow ? (
          <FisRow
            isMySchedule
            selectedApoCd={fis.apoCd}
            timeDiffUtc={null}
            fisRow={fis.fisRow}
            zoomFis={100}
            dispRangeFromLcl={fis.dispRangeFromLcl}
            dispRangeToLcl={fis.dispRangeToLcl}
            stationOperationTaskEnabled={this.state.stationOperationTaskEnabled}
            flightMovementEnabled={this.state.flightMovementEnabled}
            multipleFlightMovementEnabled={false}
            mvtMsgEnabled={this.state.mvtMsgEnabled}
            flightDetailEnabled={this.state.flightDetailEnabled}
            flightListEnabled={this.state.flightListEnabled}
            flightRmksEnabled={this.props.jobAuth.user.myApoCd === this.props.headerInfo.apoCd && this.state.flightRmksEnabled}
            oalAircraftEnabled={this.state.oalAircraftEnabled}
            oalPaxEnabled={this.state.oalPaxEnabled}
            oalPaxStatusEnabled={this.state.oalPaxStatusEnabled}
            spotNoEnabled={this.state.spotNoEnabled}
            oalFuelEnabled={this.state.oalFuelEnabled}
            isSortArrival={isLongColumnArr}
            isSortTwoColumnMode={isTwoColumnMode}
            doAnimation={!isPc}
            isDarkMode={false}
            acarsStatus={fis.shipNoToAcarsSts[fis.fisRow.shipNo]}
            presentTime={fis.timeLclDayjs}
          />
        ) : null}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  max-width: ${Const.MAX_WIDTH};
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
`;

const hideHeaderContent = keyframes`
  0%   { width: 33%; max-width: 100%; overflow: hidden; }
  100% { width: 0; max-width: 0; overflow: hidden; }
`;

const showHeaderContentFromHide = keyframes`
  0%   { width: 0; max-width: 0; overflow: hidden; }
  100% { width: 33%; max-width: 100%; overflow: hidden; }
`;

const showHeaderContentFromLong = keyframes`
  0%   { width: 66%; max-width: 100%; overflow: hidden;}
  100% { width: 33%; max-width: 100%; overflow: hidden;}
`;

const longHeaderContent = keyframes`
  0%   { width: 33%; max-width: 100%; overflow: hidden;}
  100% { width: 66%; max-width: 100%; overflow: hidden;}
`;

const FisHeader = styled.div<{ isPc: boolean; isLongColumnArr: boolean; isTwoColumnMode: boolean; selectedColumn: string }>`
  display: flex;
  text-align: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.color.PRIMARY_BASE};
  .headerContentArr {
    background: ${({ isPc, selectedColumn, theme }) =>
      !isPc && selectedColumn === selectedColumnType.Arr
        ? theme.color.fis.header.background.inactive
        : theme.color.fis.header.background.active};
    ${({ isPc }) => (isPc ? "flex: 1;" : "width: 33%;")};
    ${({ isPc, isLongColumnArr }) =>
      !isPc
        ? css`
            animation: ${isLongColumnArr ? showHeaderContentFromLong : showHeaderContentFromHide} 0.3s;
          `
        : ""};
  }
  .headerContentDep {
    background: ${({ isPc, selectedColumn, theme }) =>
      !isPc && selectedColumn === selectedColumnType.Dep
        ? theme.color.fis.header.background.inactive
        : theme.color.fis.header.background.active};
    ${({ isPc }) => (isPc ? "flex: 1;" : "width: 33%;")};
    ${({ isPc, isLongColumnArr }) =>
      !isPc
        ? css`
            animation: ${!isLongColumnArr ? showHeaderContentFromLong : showHeaderContentFromHide} 0.3s;
          `
        : ""};
  }
  .headerContentLong {
    background: ${({ theme }) => theme.color.fis.header.background.inactive};
    width: 66%;
    animation: ${longHeaderContent} 0.3s;
  }
  .headerContentHide {
    background: ${({ theme }) => theme.color.fis.header.background.active};
    max-width: 0;
    overflow: hidden;
    animation: ${hideHeaderContent} 0.3s;
  }
  .centerContent {
    ${({ isPc }) => (isPc ? "width: 352px;" : "flex: 4;")};
    ${({ isPc }) => (isPc ? "max-width: 352px;" : "")};
    background: ${({ isPc, theme }) => (isPc ? theme.color.fis.header.background.inactive : theme.color.fis.header.background.active)};
  }
  max-width: ${Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
`;

const TwoColumnSwitchBtn = styled.div<{ height: number; isLeft: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => `${height}px`};
  border-top: 1px solid ${(props) => props.theme.color.fis.background};
  ${({ isLeft, theme }) => `${isLeft ? "border-left: " : "border-right: "}1px solid ${theme.color.fis.background}`};
  border-bottom: none;
  cursor: "inherit";
  > div:first-child {
    min-width: 80px;
  }
  > div:last-child {
    min-width: 80px;
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .UnderArrow {
    margin-left: 7px;
    min-width: 15px;
    display: flex;
    align-items: center;
    svg {
      width: 12px;
      height: 12px;
    }
  }
  .FlightSign {
    margin-left: 5px;
    margin-top: 1px;
    position: relative;
    font-size: 12px;
    line-height: 12px;
    /* width: 50px; */
    width: 44px;
    border: solid 1.2px ${(props) => props.theme.color.PRIMARY_BASE};
    border-radius: 5px;
    padding: 1px 2px 1px 2px;
    /* 斜線 */
    /* ::before {
      content: "";
      display: inline-block;
      position: absolute;
      height: 1.2px;
      width: 47.5px;
      top: 6.5px;
      left: 0.3px;
      background-color: #FFF;
      transform:rotate(-17deg) skew(40deg);
    } */
  }
`;

const StationOperationHeader = styled.div<{ isPc: boolean; height: number }>`
  width: auto;
  line-height: ${({ height }) => `${height}px`};
  border: 1px solid ${(props) => props.theme.color.fis.background};
  border-bottom: none;
  cursor: ${({ isPc }) => (isPc ? "inherit" : "pointer")};
`;

export default MyScheduleFis;
