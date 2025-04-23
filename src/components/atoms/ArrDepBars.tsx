import React from "react";
import styled from "styled-components";

export type SelectedTarget = "ARR_DEP_SAME" | "ARR" | "DEP" | "ARR_DEP_DIFF" | null;
export interface Props {
  selectedTarget: SelectedTarget;
  arr?: SpotInfo | EqpInfo | null;
  dep?: SpotInfo | EqpInfo | null;
}

interface LegInfo {
  alCd: string;
  fltNo: string;
  casFltNo: string;
  lstDepApoCd: string;
  lstArrApoCd: string;
}

export interface SpotInfo extends LegInfo {
  orgSpotNo: string;
}

export interface EqpInfo extends LegInfo {
  orgShipNo: string;
  orgEqp: string;
}

const ArrDepBars: React.FC<Props> = (props: Props) => {
  const { arr, dep, selectedTarget } = props;

  const arrFlt = arr ? (arr.casFltNo ? arr.casFltNo : `${arr.alCd}${arr.fltNo}`) : "";

  const arrSpotNoOrEqp = arr
    ? (arr as SpotInfo).orgSpotNo || [(arr as EqpInfo).orgShipNo, (arr as EqpInfo).orgEqp].filter((v) => !!v).join(" ")
    : "";

  const depFlt = dep ? (dep.casFltNo ? dep.casFltNo : `${dep.alCd}${dep.fltNo}`) : "";

  const depSpotNoOrEqp = dep
    ? (dep as SpotInfo).orgSpotNo || [(dep as EqpInfo).orgShipNo, (dep as EqpInfo).orgEqp].filter((v) => !!v).join(" ")
    : "";

  const triangleWidth = 14;
  const triangleHeight = 40;
  const fullWidth = 344;
  const bar = (arrBar: boolean, depBar: boolean) => {
    let width = fullWidth / 2 - 4;
    if (arrBar && depBar) {
      width = fullWidth;
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${triangleHeight}`}
        style={{ width, height: triangleHeight, left: -2 }}
      >
        <path
          d={`M 0 0 L ${arrBar ? triangleWidth : 0} ${triangleHeight} L ${
            width - (depBar ? triangleWidth : 0)
          } ${triangleHeight} L ${width} 0 L 0 0`}
          stroke="transparent"
          fill="#CBE5E3"
          strokeWidth="0"
        />
      </svg>
    );
  };

  switch (selectedTarget) {
    case "ARR_DEP_SAME":
      if (arr && dep) {
        return (
          <Container>
            {bar(true, true)}
            <ArrContainer flt={arrFlt}>
              <div>
                <span>{arrFlt}</span>
                <span>
                  {" "}
                  {arr.lstDepApoCd}-{arr.lstArrApoCd}
                </span>
              </div>
              <div>{arrSpotNoOrEqp}</div>
            </ArrContainer>
            <DepContainer flt={depFlt}>
              <div>
                <span>{depFlt}</span>
                <span>
                  {" "}
                  {dep.lstDepApoCd}-{dep.lstArrApoCd}
                </span>
              </div>
              <div>{depSpotNoOrEqp}</div>
            </DepContainer>
          </Container>
        );
      }
      break;
    case "ARR_DEP_DIFF":
      if (arr && dep) {
        return (
          <Container>
            {bar(true, false)}
            <DivisionBar />
            {bar(false, true)}
            <ArrContainer flt={arrFlt}>
              <div>
                <span>{arrFlt}</span>
                <span>
                  {" "}
                  {arr.lstDepApoCd}-{arr.lstArrApoCd}
                </span>
              </div>
              <div>{arrSpotNoOrEqp}</div>
            </ArrContainer>
            <DepContainer flt={depFlt}>
              <div>
                <span>{depFlt}</span>
                <span>
                  {" "}
                  {dep.lstDepApoCd}-{dep.lstArrApoCd}
                </span>
              </div>
              <div>{depSpotNoOrEqp}</div>
            </DepContainer>
          </Container>
        );
      }
      break;
    case "ARR":
      if (arr) {
        return (
          <Container>
            {bar(true, false)}
            <ArrContainer center flt={arrFlt}>
              <div>
                <span>{arrFlt}</span>
                <span>
                  {" "}
                  {arr.lstDepApoCd}-{arr.lstArrApoCd}
                </span>
              </div>
              <div>{arrSpotNoOrEqp}</div>
            </ArrContainer>
          </Container>
        );
      }
      break;
    case "DEP":
      if (dep) {
        return (
          <Container>
            {bar(false, true)}
            <DepContainer center flt={depFlt}>
              <div>
                <span>{depFlt}</span>
                <span>
                  {" "}
                  {dep.lstDepApoCd}-{dep.lstArrApoCd}
                </span>
              </div>
              <div>{depSpotNoOrEqp}</div>
            </DepContainer>
          </Container>
        );
      }
      break;
    default:
      break;
  }
  return null;
};

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  margin: 0 11px;
  width: 352px;
  height: 60px;
`;

const DivisionBar = styled.div`
  width: 8px;
  height: 40px;
`;

const ArrContainer = styled.div<{ center?: boolean; flt: string }>`
  position: absolute;
  ${(props) => (props.center ? "right: 102px;" : "right: 186px;")}
  width: 167px;
  > span,
  div {
    font-size: 14px;
    font-weight: bold;
    text-align: right;
  }
  > div {
    height: 16px;
    span:first-child {
      font-size: ${({ flt }) => (flt.length > 7 ? 9 : 14)}px;
    }
  }
`;

const DepContainer = styled.div<{ center?: boolean; flt: string }>`
  position: absolute;
  ${(props) => (props.center ? "left: 102px;" : "left: 186px;")}
  width: 170px;
  > span,
  div {
    font-size: 14px;
    font-weight: bold;
    text-align: left;
  }
  > div {
    height: 16px;
    span:first-child {
      font-size: ${({ flt }) => (flt.length > 7 ? 9 : 14)}px;
    }
  }
`;

export default ArrDepBars;
