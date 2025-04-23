import React from "react";
import dayjs from "dayjs";
import styled, { css, keyframes } from "styled-components";
import media from "../../../styles/media";
import { formatFltNo } from "../../../lib/commonUtil";
import * as myScheduleActions from "../../../reducers/mySchedule";
import CheckIcon from "../../../assets/images/icon/icon-check.svg?component";

type Props = {
  dtlSchedule: myScheduleActions.DetailScheduleState;
  isSmallTask?: boolean;
  doCheckAnimation?: boolean;
  height?: number;
};

class MyScheduleTaskCard extends React.PureComponent<Props> {
  render() {
    const { dtlSchedule, height, isSmallTask, doCheckAnimation } = this.props;
    const isFlightName = dtlSchedule.carrierCodeIata !== "" && dtlSchedule.fltNumber !== "" && dtlSchedule.originDateLocal !== "";

    return (
      <Container height={height}>
        <div>
          <CheckIconWrapper>
            {(dtlSchedule.taskStartStatus || dtlSchedule.taskEndStatus) && (
              <FadeCheckIcon isFinish={dtlSchedule.taskEndStatus} className={doCheckAnimation ? "doRoundAnimation" : ""}>
                <StyledCheckIcon className={doCheckAnimation ? "doAnimation" : ""}>
                  <CheckIcon />
                </StyledCheckIcon>
              </FadeCheckIcon>
            )}
          </CheckIconWrapper>
          <ContentWrapper>
            <FirstRow isSmallTask={isSmallTask}>
              <TaskName title={dtlSchedule.taskName} isFlightName={isFlightName} isSmallTask={isSmallTask}>
                {dtlSchedule.taskName}
              </TaskName>
              {isFlightName && (
                <div>
                  {dtlSchedule.carrierCodeIata}
                  {formatFltNo(dtlSchedule.fltNumber)}/{dtlSchedule.originDateLocal.slice(-2)}
                </div>
              )}
            </FirstRow>
            <SecondRow>
              <div>
                <span>{dayjs(dtlSchedule.taskStartTime).format("HHmm")}</span>
                <span> - </span>
                <span>{dayjs(dtlSchedule.taskEndTime).format("HHmm")}</span>
              </div>
              <div>
                {dtlSchedule && dtlSchedule.gateNo && (
                  <>
                    <span>Gate</span>
                    <span>{dtlSchedule.gateNo}</span>
                    {dtlSchedule.spotNo && <span>/</span>}
                  </>
                )}
                {dtlSchedule && dtlSchedule.spotNo && (
                  <>
                    <span>Spot</span>
                    <span>{dtlSchedule.spotNo}</span>
                  </>
                )}
              </div>
            </SecondRow>
          </ContentWrapper>
        </div>
      </Container>
    );
  }
}

const Container = styled.div<{ height?: number }>`
  display: flex;
  align-items: center;
  height: ${({ height }) => (height ? `${height}px` : "100%")};

  > div {
    display: flex;
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  padding-right: 15px;
  width: 100%;
`;

const TaskName = styled.div<{ isFlightName: boolean; isSmallTask?: boolean }>`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  ${({ isFlightName, isSmallTask }) =>
    isFlightName
      ? css`
          ${isSmallTask
            ? css`
                width: 160px;
                ${media.greaterThan("desktopM")`width: 180px;`}
                ${media.greaterThan("desktopL")`width: 200px;`}
              `
            : css`
                width: 170px;
                ${media.greaterThan("desktopM")`width: 200px;`}
                ${media.greaterThan("desktopL")`width: 260px;`}
              `};
        `
      : css`
          ${isSmallTask
            ? css`
                width: 270px;
                ${media.greaterThan("desktopM")`width: 325px;`}
              `
            : css`
                width: 265px;
                ${media.greaterThan("desktopM")`width: 320px;`}
                ${media.greaterThan("desktopL")`width: 370px;`}
              `};
        `};
`;

const FirstRow = styled.div<{ isSmallTask?: boolean }>`
  font-size: 24px;
  ${media.lessThan("1365px")` font-size: 20px;`} margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  justify-content: space-between;

  > div:nth-child(2) {
    > span:nth-child(1),
    > span:nth-child(4) {
      font-size: 12px;
    }
  }
`;

const CheckAnimationKeyframes = keyframes`
  0%   { transform: scale(1.0, 1.0) translate(0%, 0%); }
  15%  { transform: scale(0.9, 0.9) translate(0%, 5%); }
  30%  { transform: scale(1.3, 0.8) translate(0%, 10%); }
  50%  { transform: scale(0.8, 1.3) translate(0%, -10%); }
  70%  { transform: scale(1.1, 0.9) translate(0%, 5%); }
  100% { transform: scale(1.0, 1.0) translate(0%, 0%); }
`;

const CheckFadeAnimationkeyframes = keyframes`
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
`;

const CheckIconWrapper = styled.div`
  width: 55px;
  ${media.greaterThan("desktopM")`width: 60px;`}
  ${media.greaterThan("desktopL")`width: 65px;`}
  height: 100%;
  display: flex;
  justify-content: center;
`;

const FadeCheckIcon = styled.div<{ isFinish: boolean }>`
  position: relative;
  width: 30px;
  border-radius: 50%;
  height: 30px;
  background-color: ${({ isFinish }) => (isFinish ? "#DDD" : "#5CDBCE")};

  &.doRoundAnimation {
    &::before {
      content: "";
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      opacity: 0.8;
      top: 50%;
      left: 50%;
      right: 50%;
      transform: translate(-50%, -50%);
      background-color: ${({ isFinish }) => (isFinish ? "#DDD" : "#5CDBCE")};
      animation: ${CheckFadeAnimationkeyframes} 0.5s linear 0.4s both;
    }
  }

  .svg-elem-1 {
    fill: ${({ isFinish }) => (isFinish ? "#85A0B3" : "#FFF")};
    stroke: ${({ isFinish }) => (isFinish ? "#DDD" : "#5CDBCE")};
  }
  .svg-elem-2 {
    fill: ${({ isFinish }) => (isFinish ? "#85A0B3" : "#FFF")};
  }
`;

const StyledCheckIcon = styled.div`
  width: 32px;
  height: 32px;
  position: absolute;
  top: -2px;
  left: 0px;

  &.doAnimation {
    animation: ${CheckAnimationKeyframes} 0.3s linear 0s both;
  }
`;

export default MyScheduleTaskCard;
