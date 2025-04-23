import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExtFisRow, WorkStatus } from "../../organisms/BarChart/selector";
import BarChartSwitchTag from "../../atoms/BarChartSwitchTag";
import BarChartShipButton from "../../atoms/BarChartShipButton";
import BarChartSpecialStsLabel from "../../atoms/BarChartSpecialStsLabel";
import Cross from "../../../assets/images/icon/icon-cross.svg";
import FisFltStsLabel from "../../atoms/FisFltStsLabel";
import { CasFltNo } from "./BarChartBoxFull";
import { Const } from "../../../lib/commonConst";
import { storage } from "../../../lib/storage";
import { padding0 } from "../../../lib/commonUtil";

interface Props {
  isPc: boolean;
  extFisRow: ExtFisRow;
  fillColor: string;
  groundWorkStatus: WorkStatus;
  width: number;
  isOverlap: boolean;
  handleFlightDetailList(extFisRow: ExtFisRow, isDep: boolean): void;
  handleSwitchTag(): void;
  handleFlightListModal(): void;
  flightDetailEnabled: boolean;
  flightListEnabled: boolean;
  isSpotChangeMode: boolean;
  isSelectedSpotNumber: boolean;
  clickBarOfSpotChangeMode(): void;
  barText: string;
}

export default class BarChartBoxArrOnly extends React.PureComponent<Props> {
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
      flightDetailEnabled,
      flightListEnabled,
      isSpotChangeMode,
      isSelectedSpotNumber,
      clickBarOfSpotChangeMode,
      barText,
    } = this.props;
    const triangleWidth = Const.BAR_CHART_TRIANGLE_WIDTH;
    const triangleHeight = Const.BAR_CHART_TRIANGLE_HEIGHT;
    let wave = "";
    if (extFisRow.depNextCat === -1) {
      // エラーフラグ（ギザギザ）
      const waveWidth = Const.BAR_CHART_TRIANGLE_HEIGHT / 12;
      wave =
        `L ${width + triangleWidth + waveWidth} ${triangleHeight}` +
        ` L ${width + triangleWidth + waveWidth} ${triangleHeight - waveWidth}` +
        ` L ${width + triangleWidth} ${triangleHeight - waveWidth * 2}` +
        ` L ${width + triangleWidth + waveWidth} ${triangleHeight - waveWidth * 3}` +
        ` L ${width + triangleWidth} ${triangleHeight - waveWidth * 4}` +
        ` L ${width + triangleWidth + waveWidth} ${triangleHeight - waveWidth * 5}` +
        ` L ${width + triangleWidth} ${triangleHeight - waveWidth * 6}` +
        ` L ${width + triangleWidth + waveWidth} ${triangleHeight - waveWidth * 7}` +
        ` L ${width + triangleWidth} ${triangleHeight - waveWidth * 8}` +
        ` L ${width + triangleWidth + waveWidth} ${triangleHeight - waveWidth * 9}` +
        ` L ${width + triangleWidth} ${triangleHeight - waveWidth * 10}` +
        ` L ${width + triangleWidth + waveWidth} ${triangleHeight - waveWidth * 11}` +
        ` L ${width + triangleWidth + waveWidth} 0`;
    }

    const clickable = isSpotChangeMode && (!!extFisRow.arr || !!extFisRow.dep);

    return (
      <Wrapper clickable={clickable}>
        <ArrFlightStatus>
          <FisFltStsLabel isPc={isPc} isDarkMode={false} isBarChart>
            {extFisRow.arrFisFltSts}
          </FisFltStsLabel>
        </ArrFlightStatus>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`-5 0 ${width + triangleWidth + 10} ${triangleHeight + 10}`}
          style={{ width: width + triangleWidth + 15, height: triangleHeight + 10, filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.4))" }}
        >
          <path
            className="chartBody"
            d={`M 0 0 L ${triangleWidth} ${triangleHeight} L ${width + triangleWidth} ${triangleHeight} ${wave} L ${
              width + triangleWidth
            } 0 L 0 0`}
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
              d={`M 0 -3 L ${triangleWidth} ${triangleHeight} L ${width + triangleWidth} ${triangleHeight} ${wave} L ${
                width + triangleWidth
              } 0 L 0 0`}
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
          <> </>
        )}

        <ChartContentWrapper>
          <ChartContent style={{ minWidth: width }} isSpotChangeMode={isSpotChangeMode}>
            {isOverlap && <BarChartSwitchTag isPc={isPc} groundWorkStatus={groundWorkStatus} onClick={handleSwitchTag} />}
            <ArrXTA>:{padding0(`${dayjs(extFisRow.xtaLcl).minute()}`, 2)}</ArrXTA>
            <AirLineCodeContainer>
              <ModalTriggerButton
                style={{ paddingLeft: 0 }}
                onClick={() => handleFlightDetailList(extFisRow, false)}
                isBlack={groundWorkStatus !== WorkStatus.done}
                disabled={!flightDetailEnabled}
              >
                <AirLineCode>
                  {extFisRow.arrCasFltNo ? (
                    <CasFltNo casFltNo={extFisRow.arrCasFltNo}>{extFisRow.arrCasFltNo}</CasFltNo>
                  ) : (
                    <>
                      <small>{extFisRow.arrAlCd}</small>
                      {extFisRow.arrFltNo}
                    </>
                  )}
                </AirLineCode>
                <BarChartSpecialStsLabel isPc={storage.isPc}>{extFisRow.arrSpecialStsDly}</BarChartSpecialStsLabel>
              </ModalTriggerButton>
            </AirLineCodeContainer>
            <SquareContainer>
              <BarChartShipButton
                extFisRow={extFisRow}
                onClick={() => extFisRow.shipNo && handleFlightListModal()}
                disabled={extFisRow.shipNo ? !flightListEnabled : true}
              />
            </SquareContainer>
            {extFisRow.depNextCat > 0 && (
              <ShipNextAlCdArea isBlack={groundWorkStatus !== WorkStatus.done}>
                {extFisRow.depNextCat === 1 && <FontAwesomeIcon icon={faArrowRight} style={{ height: 18, width: "0.875em" }} />}
                {extFisRow.depNextCat === 2 && <CrossIcon />}
                <AirLineCode className="chartBody">
                  {extFisRow.depNextCasFltNo ? (
                    <CasFltNo casFltNo={extFisRow.depNextCasFltNo}>{extFisRow.depNextCasFltNo}</CasFltNo>
                  ) : (
                    <>
                      <small>{extFisRow.depNextAlCd}</small>
                      {extFisRow.depNextFltNo}
                    </>
                  )}
                </AirLineCode>
              </ShipNextAlCdArea>
            )}
          </ChartContent>
        </ChartContentWrapper>
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
    left: ${-Const.BAR_CHART_TRIANGLE_WIDTH - 5}px;
    pointer-events: none;
    > path {
      ${({ clickable }) => (clickable ? "pointer-events: auto; cursor: pointer;" : "pointer-events: auto;")}
    }
  }
`;

const ArrFlightStatus = styled.div`
  position: absolute;
  top: -18px;
  left: -6px;
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
const ArrXTA = styled.div`
  position: absolute;
  bottom: -20px;
  margin-left: 2px;
`;
const AirLineCodeContainer = styled.div`
  position: relative;
`;
const AirLineCode = styled.div`
  font-size: 20px;
  small {
    font-size: 16px;
  }
`;
const ShipNextAlCdArea = styled.div<{ isBlack: boolean }>`
  background: none;
  border: none;
  margin-top: 5px;
  text-align: left;
  color: ${(props) => (props.isBlack ? "#000000" : "#98AFBF")};
  line-height: 0.9;
`;
const ModalTriggerButton = styled.button<{ isBlack: boolean }>`
  ${({ disabled }) => (disabled ? "" : "cursor: pointer;")}
  cursor: pointer;
  background: none;
  border: none;
  text-align: left;
  color: ${(props) => (props.isBlack ? "#000000" : "#98AFBF")};
  padding-top: 3px;
`;
const SquareContainer = styled.div`
  display: flex;
  > div:first-child {
    margin-right: 10px;
  }
`;
const SpotChangeSelectedBoxSvg = styled.svg<{ isActive: boolean }>`
  ${(props) => (props.isActive ? "z-index: 5;" : "z-index: 0;")};
`;
const CrossIcon = styled.img.attrs({ src: Cross })`
  width: 20px;
  height: 18px;
`;
