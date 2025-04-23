import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExtFisRow, WorkStatus } from "../../organisms/BarChart/selector";
import { Const } from "../../../lib/commonConst";
import { storage } from "../../../lib/storage";
import { padding0 } from "../../../lib/commonUtil";
import BarChartSwitchTag from "../../atoms/BarChartSwitchTag";
import BarChartStationOperationTaskButton from "../../atoms/BarChartStationOperationTaskButton";
import BarChartShipButton from "../../atoms/BarChartShipButton";
import BarChartSpecialStsLabel from "../../atoms/BarChartSpecialStsLabel";
import Cross from "../../../assets/images/icon/icon-cross.svg";
import FisFltStsLabel from "../../atoms/FisFltStsLabel";
import { CasFltNo } from "./BarChartBoxFull";

interface Props {
  isPc: boolean;
  fillColor: string;
  extFisRow: ExtFisRow;
  groundWorkStatus: WorkStatus;
  width: number;
  isOverlap: boolean;
  handleFlightDetailList(extFisRow: ExtFisRow, isDep: boolean): void;
  handleSwitchTag(): void;
  handleFlightListModal(): void;
  handleStationOperationTaskList(extFisRow: ExtFisRow): void;
  stationOperationTaskEnabled: boolean;
  flightDetailEnabled: boolean;
  flightListEnabled: boolean;
  isSpotChangeMode: boolean;
  isSelectedSpotNumber: boolean;
  clickBarOfSpotChangeMode(): void;
  barText: string;
}

export default class BarChartBoxDepOnly extends React.PureComponent<Props> {
  render() {
    const {
      isPc,
      fillColor,
      extFisRow,
      groundWorkStatus,
      width,
      isOverlap,
      handleFlightDetailList,
      handleSwitchTag,
      handleFlightListModal,
      handleStationOperationTaskList,
      stationOperationTaskEnabled,
      flightDetailEnabled,
      flightListEnabled,
      isSpotChangeMode,
      isSelectedSpotNumber,
      clickBarOfSpotChangeMode,
      barText,
    } = this.props;
    const triangleWidth = Const.BAR_CHART_TRIANGLE_WIDTH;
    const triangleHeight = Const.BAR_CHART_TRIANGLE_HEIGHT;

    const isBlackFontColorOnSvg = groundWorkStatus !== WorkStatus.done;

    let wave = "";
    if (extFisRow.arrFromCat === -1) {
      // エラーフラグ（ギザギザ）
      const waveWidth = Const.BAR_CHART_TRIANGLE_HEIGHT / 12;
      wave =
        `L ${-waveWidth} ${0}` +
        ` L ${-waveWidth} ${waveWidth}` +
        ` L ${0} ${waveWidth * 2}` +
        ` L ${-waveWidth} ${waveWidth * 3}` +
        ` L ${0} ${waveWidth * 4}` +
        ` L ${-waveWidth} ${waveWidth * 5}` +
        ` L ${0} ${waveWidth * 6}` +
        ` L ${-waveWidth} ${waveWidth * 7}` +
        ` L ${0} ${waveWidth * 8}` +
        ` L ${-waveWidth} ${waveWidth * 9}` +
        ` L ${0} ${waveWidth * 10}` +
        ` L ${-waveWidth} ${waveWidth * 11}` +
        ` L ${-waveWidth} ${triangleHeight}`;
    }

    const clickable = isSpotChangeMode && (!!extFisRow.arr || !!extFisRow.dep);

    return (
      <Wrapper clickable={clickable}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`-5 0 ${width + triangleWidth + 10} ${triangleHeight + 10}`}
          style={{ width: width + triangleWidth + 15, height: triangleHeight + 10, filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.4))" }}
        >
          <path
            className="chartBody"
            d={`M 0 0 ${wave} L 0 ${triangleHeight} L ${width} ${triangleHeight} L ${width + triangleWidth} 0 L 0 0`}
            stroke="transparent"
            fill={fillColor}
            strokeWidth="0"
            onClick={clickBarOfSpotChangeMode}
          />
        </svg>

        {/* Spot Change Mode Bar選択時BOX */}
        {isSelectedSpotNumber ? (
          <SpotChangeSelectedBoxSvg
            isActive={isSelectedSpotNumber}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`-5 -2.5 ${width + triangleWidth + 10} ${triangleHeight + 10}`}
            style={{ width: width + triangleWidth + 15, height: triangleHeight + 10, filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.4))" }}
          >
            <path
              className="chartBody"
              d={`M 0 -3 ${wave} L 0 ${triangleHeight} L ${width} ${triangleHeight} L ${width + triangleWidth} 0 L 0 0`}
              stroke="#EA6512"
              strokeWidth="5"
              fill="rgba(234, 101, 18, 0.6)"
              onClick={clickBarOfSpotChangeMode}
            />
            <text x={width / 2} y={triangleHeight / 2 + 10} fontSize="30" fill="#fff" style={{ pointerEvents: "none" }}>
              {barText}
            </text>
          </SpotChangeSelectedBoxSvg>
        ) : (
          <></>
        )}

        <ChartContentWrapper>
          <ChartContent style={{ minWidth: width }} isSpotChangeMode={isSpotChangeMode}>
            {isOverlap && <BarChartSwitchTag isPc={isPc} groundWorkStatus={groundWorkStatus} onClick={handleSwitchTag} />}
            {extFisRow.arrFromCat > 0 && (
              <ShipfromAlCdArea isBlack={isBlackFontColorOnSvg}>
                <AirLineCode>
                  {extFisRow.arrFromCasFltNo ? (
                    <CasFltNo casFltNo={extFisRow.arrFromCasFltNo}>{extFisRow.arrFromCasFltNo}</CasFltNo>
                  ) : (
                    <>
                      <small>{extFisRow.arrFromAlCd}</small>
                      {extFisRow.arrFromFltNo}
                    </>
                  )}
                </AirLineCode>
                {extFisRow.arrFromCat === 1 && <FontAwesomeIcon icon={faArrowRight} style={{ height: 18, width: "0.875em" }} />}
                {extFisRow.arrFromCat === 2 && <CrossIcon />}
              </ShipfromAlCdArea>
            )}
            <SquareContainer>
              <BarChartShipButton
                extFisRow={extFisRow}
                onClick={() => extFisRow.shipNo && handleFlightListModal()}
                disabled={extFisRow.shipNo ? !flightListEnabled : true}
              />
              <BarChartStationOperationTaskButton
                extFisRow={extFisRow}
                onClick={handleStationOperationTaskList}
                disabled={!stationOperationTaskEnabled}
              />
            </SquareContainer>
            <ModalTriggerButton
              isBlack={isBlackFontColorOnSvg}
              onClick={() => handleFlightDetailList(extFisRow, true)}
              disabled={!flightDetailEnabled}
            >
              <AirLineCode className="chartBody">
                {extFisRow.depCasFltNo ? (
                  <CasFltNo casFltNo={extFisRow.depCasFltNo}>{extFisRow.depCasFltNo}</CasFltNo>
                ) : (
                  <>
                    <small>{extFisRow.depAlCd}</small>
                    {extFisRow.depFltNo}
                  </>
                )}
              </AirLineCode>
              <BarChartSpecialStsLabel isPc={storage.isPc}>{extFisRow.depSpecialStsDly}</BarChartSpecialStsLabel>
            </ModalTriggerButton>
            <DepXTD width={width}>:{padding0(`${dayjs(extFisRow.xtdLcl).minute()}`, 2)}</DepXTD>
          </ChartContent>
        </ChartContentWrapper>
        <DepFlightStatus>
          <FisFltStsLabel isPc={isPc} isDarkMode={false} isBarChart>
            {extFisRow.depFisFltSts}
          </FisFltStsLabel>
        </DepFlightStatus>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div<{ clickable: boolean }>`
  height: ${() => Const.BAR_CHART_TRIANGLE_HEIGHT}px;
  background-color: transparent;
  position: relative;
  ${({ clickable }) => (clickable ? "pointer-events: none;" : "")}
  > svg {
    position: absolute;
    left: -5px;
    pointer-events: none;
    > path {
      ${({ clickable }) => (clickable ? "pointer-events: auto; cursor: pointer;" : "pointer-events: auto;")}
    }
  }
`;
const DepFlightStatus = styled.div`
  position: absolute;
  top: -18px;
  right: -10px;
`;
const ChartContentWrapper = styled.div`
  position: absolute;
  top: 0;
`;
const ChartContent = styled.div<{ isSpotChangeMode: boolean }>`
  position: relative;
  height: 54px;
  padding-top: 6px;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  ${({ isSpotChangeMode }) => (isSpotChangeMode ? "pointer-events: none;" : "pointer-events: auto;")}
`;
const AirLineCode = styled.div`
  font-size: 20px;
  small {
    font-size: 16px;
  }
`;
const ShipfromAlCdArea = styled.div<{ isBlack: boolean }>`
  background: none;
  border: none;
  text-align: left;
  color: ${(props) => (props.isBlack ? "#000000" : "#98AFBF")};
  padding-top: 3px;
  margin-left: 5px;
`;
const ModalTriggerButton = styled.button<{ isBlack: boolean }>`
  ${({ disabled }) => (disabled ? "" : "cursor: pointer;")}
  background: none;
  border: none;
  text-align: left;
  color: ${(props) => (props.isBlack ? "#000000" : "#98AFBF")};
  padding-top: 3px;
  margin-left: 5px;
`;
const SquareContainer = styled.div`
  display: flex;
  > div:first-child {
    margin-right: 10px;
  }
`;
const DepXTD = styled.div<{ width: number }>`
  position: absolute;
  bottom: -20px;
  margin-left: ${(props) => `calc(${props.width}px - 20px)`};
`;
const SpotChangeSelectedBoxSvg = styled.svg<{ isActive: boolean }>`
  ${(props) => (props.isActive ? "z-index: 5;" : "z-index: 0;")};
`;
const CrossIcon = styled.img.attrs({ src: Cross })`
  width: 20px;
  height: 18px;
`;
