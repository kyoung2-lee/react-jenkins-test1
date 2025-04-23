import React from "react";
import styled, { keyframes } from "styled-components";
import dayjs from "dayjs";
import scrollbarSize from "dom-helpers/scrollbarSize";

import media from "../../../styles/media";
import * as myScheduleActions from "../../../reducers/mySchedule";
import InitialPositionButton from "../../atoms/InitialPositionButton";
import { smoothScroll, formatFltNo } from "../../../lib/commonUtil";
import { storage } from "../../../lib/storage";

type Props = {
  contentHeight: number;
  timeScale: myScheduleActions.TimeScale;
  isShowFis: boolean;
  timeChartState: MyScheduleApi.StaffAssignInformation;
  selectedTaskId: number | null;
  changeActiveDetailTask: typeof myScheduleActions.changeActiveDetailTask;
};

type State = {
  stickyDate: string | null;
  currentTime: dayjs.Dayjs;
};

class MyScheduleTimeChart extends React.Component<Props, State> {
  private timer: number | undefined;
  private timeChartExtraView: number;

  scrollRef = React.createRef<HTMLDivElement>();
  timeChartBorderRef = React.createRef<HTMLDivElement>();
  currentBorderRef = React.createRef<HTMLDivElement>();
  taskPlaceLineRef = React.createRef<HTMLDivElement>();
  overlapTaskCardRefs: Record<string, HTMLDivElement | null> = {};

  constructor(props: Props) {
    super(props);

    this.timer = 0;
    this.timeChartExtraView = 6; // ±何時間分タイムチャートを表示するか

    this.state = {
      stickyDate: null,
      currentTime: dayjs(),
    };

    this.onScroll = this.onScroll.bind(this);
    this.advanceTimer = this.advanceTimer.bind(this);
    this.scrollToCurrent = this.scrollToCurrent.bind(this);
    this.createOverlap = this.createOverlap.bind(this);
    this.getGndStartTime = this.getGndStartTime.bind(this);
  }

  componentDidMount() {
    void this.timeChartSettings();
    this.timer = window.setInterval(this.advanceTimer, 1000);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.timeScale !== prevProps.timeScale || this.props.contentHeight !== prevProps.contentHeight) {
      void this.timeChartSettings();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = undefined;
    this.timeChartExtraView = 0;
  }

  handleClickTask(taskState: MyScheduleApi.TaskInformation) {
    this.props.changeActiveDetailTask({ taskInformation: taskState });
    if (taskState.taskId) {
      storage.myScheduleSaveTask = taskState.taskId;
    }
  }

  private setStickyDate = (scrollTop: number) => {
    const { taskInformation } = this.props.timeChartState;
    if (taskInformation.length === 0) return;

    const timeGndNode = this.timeChartBorderRef.current;
    if (timeGndNode && timeGndNode.children) {
      const nodes = Array.from(timeGndNode.children);
      let matchNode: HTMLElement | undefined;
      nodes.forEach((node, index) => {
        const { height } = node.getBoundingClientRect();
        const top = (node as HTMLElement).offsetTop;
        const relativeTop = top - scrollTop - getDateHeaderHeight();

        if ((node as HTMLElement).dataset.isDate === "true") {
          if (relativeTop <= 0 && relativeTop >= -(height / 2)) {
            // 日付行の上半分がTOPに着たら、前の日付にする
            matchNode = nodes[index - 1] as HTMLElement;
            return;
          }
          if (-(height / 2) >= relativeTop && relativeTop >= -height) {
            // 日付行の上半分がTOPに着たら、次の日付にする
            matchNode = nodes[index + 1] as HTMLElement;
          }
        } else if (relativeTop <= 0 && relativeTop >= -height) {
          // TOPにある行の日付にする
          matchNode = node as HTMLElement;
        }
      });

      if (scrollTop === 0) {
        this.setState({ stickyDate: this.getGndStartTime().format("YYYYMMDD") });
      } else if (matchNode) {
        this.setState({ stickyDate: matchNode.dataset.taskDate ? matchNode.dataset.taskDate : null });
      }
    }
  };

  onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    this.setStickyDate(e.currentTarget.scrollTop);
  };

  getIsOverlap(target: HTMLElement, source: HTMLElement) {
    const targetStartPos = target.getBoundingClientRect().top;
    const sourceStartPos = source.getBoundingClientRect().top;
    const sourceFinishPos = source.getBoundingClientRect().bottom;
    return targetStartPos >= sourceStartPos && sourceFinishPos > targetStartPos;
  }

  /**
   * コンテンツ上部に余白が入る場合は
   * 余白を入れる。
   */
  setContentPaddingTop(target: HTMLElement) {
    const CONTENT_PADDING_TOP = 5;
    const textContent = target.lastChild as HTMLElement;
    if (CONTENT_PADDING_TOP + textContent.clientHeight < target.clientHeight) {
      textContent.style.paddingTop = `${CONTENT_PADDING_TOP}px`;
    } else {
      textContent.style.paddingTop = "";
    }
  }

  getGndStartTime(): dayjs.Dayjs {
    const { workStartTime } = this.props.timeChartState;
    return dayjs(workStartTime).clone().add(-this.timeChartExtraView, "hours");
  }

  getLeftTimeCounter() {
    const { workEndTime, workStartTime } = this.props.timeChartState;
    if (!workEndTime || !workStartTime) return 0;
    return dayjs(workEndTime).minute(0).diff(dayjs(workStartTime).minute(0), "hours") + this.timeChartExtraView * 2;
  }

  getTopPos(targetStartTime: dayjs.Dayjs) {
    const { contentHeight, timeChartState, timeScale } = this.props;
    const { workStartTime } = timeChartState;
    const startTime = targetStartTime.clone();

    const gndStartTime = dayjs(workStartTime).subtract(this.timeChartExtraView, "hours");
    const taskStartHourDiff = startTime.minute(0).diff(gndStartTime.clone().minute(0), "hours");
    const taskStartMinutes = targetStartTime.minute();
    const oneHourHeight = getOneHourHeight(contentHeight, timeScale);
    const oneMinuteHeight = oneHourHeight / 60;

    const top = oneHourHeight * taskStartHourDiff + oneMinuteHeight * taskStartMinutes + TIMECHART_PADDING_TOP + 1;
    return top;
  }

  getHeight(sdlState: MyScheduleApi.TaskInformation) {
    const { contentHeight, timeScale } = this.props;
    const workTimeMinutes = dayjs(sdlState.taskEndTime).diff(dayjs(sdlState.taskStartTime), "minutes");
    return (getOneHourHeight(contentHeight, timeScale) / 60) * workTimeMinutes;
  }

  advanceTimer = () => {
    this.setState({ currentTime: dayjs() });
  };

  scrollToCurrent = () => {
    if (!this.currentBorderRef.current) return;
    const targetTop = window.getComputedStyle(this.currentBorderRef.current).top;
    if (this.scrollRef.current && targetTop) {
      const target = (this.props.contentHeight - getDateHeaderHeight()) / 2;
      smoothScroll(this.scrollRef.current, parseInt(targetTop, 10) - target, 30);
    }
  };

  scrollToTarget(sdlKey: number | undefined) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const refKey = `TaskId__${sdlKey}`;
    const target = this.overlapTaskCardRefs[refKey];
    if (!target) return;
    const { top } = window.getComputedStyle(target);

    if (this.scrollRef.current && top) {
      const height = (this.props.contentHeight - getDateHeaderHeight()) / 2;
      smoothScroll(this.scrollRef.current, parseInt(top, 10) - height, 30);
    }
  }

  timeChartSettings() {
    this.createOverlap();
    if (this.props.selectedTaskId) {
      this.scrollToTarget(this.props.selectedTaskId);
    }
  }

  createOverlap() {
    if (!this.taskPlaceLineRef.current) return;
    const container = this.taskPlaceLineRef.current;
    const containerWidth = container.getBoundingClientRect().width;
    const halfWidth = containerWidth / 2;
    const nodes = container.childNodes;

    // 重なり番号を設定する
    nodes.forEach((task, index, list) => {
      const target = task as HTMLElement;
      target.dataset.overlapSeq = "0";
      target.dataset.overlapCnt = "0";

      // 対象のタスクが重なっているタスクを検索
      const overlapCntList: number[] = [];
      list.forEach((tsk, idx) => {
        if (index <= idx) return;
        if (this.getIsOverlap(target, tsk as HTMLElement)) {
          overlapCntList.push(idx);
        }
      });

      // 重複がある場合、横並び番号を更新する
      if (overlapCntList.length > 0) {
        const lastDupIndex = overlapCntList[overlapCntList.length - 1];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        target.dataset.overlapSeq = `${parseInt((nodes[lastDupIndex] as HTMLElement).dataset.overlapSeq!, 10) + 1}`;
      }
    });

    // 横並び件数を設定
    nodes.forEach((task, index, list) => {
      const target = task as HTMLElement;
      const dupList: number[] = [];
      list.forEach((tsk, idx) => {
        // 対象タスク以前のタスクはスキップ
        if (index >= idx) return;
        if (this.getIsOverlap(tsk as HTMLElement, task as HTMLElement)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          dupList.push(parseInt((nodes[idx] as HTMLElement).dataset.overlapSeq!, 10));
        }
      });
      if (dupList.length > 0) {
        // 横並び件数を取得
        const maxoverlapCnt = Math.max(...dupList);
        let count = index;
        let prevCount = -1;
        for (;;) {
          // 一番左のタスクまで横並び件数を更新する
          const updTarget = nodes[count] as HTMLElement;
          // 幅 = タイムチャートの横幅 50%
          updTarget.style.width = `${halfWidth}px`;
          // 左位置 = タイムチャートの横幅 50% / 重複件数 * 重複番数
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          updTarget.style.left = `${(halfWidth / maxoverlapCnt) * parseInt(updTarget.dataset.overlapSeq!, 10)}px`;

          // 一番左のタスク
          if (updTarget.dataset.overlapSeq === "0" && updTarget.dataset.overlapCnt === "0") {
            break;
          }

          // 重複途中のタスク
          updTarget.dataset.overlapCnt = maxoverlapCnt.toString();

          if (count !== index) {
            const currentTask = nodes[count];
            const prevTask = prevCount < 0 ? nodes[count + 1] : nodes[prevCount];
            if (!this.getIsOverlap(prevTask as HTMLElement, currentTask as HTMLElement)) {
              // 1つ前を保存
              prevCount = count + 1;
              count -= 1;
              continue;
            } else {
              prevCount = -1;
            }
          }

          count -= 1;
        }
        // 重複なしタスク or 一番右のタスク
      } else {
        target.dataset.overlapCnt = target.dataset.overlapSeq;
        target.style.left =
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          parseInt(target.dataset.overlapCnt!, 10) > 0
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              `${(halfWidth / parseInt(target.dataset.overlapSeq!, 10)) * parseInt(target.dataset.overlapSeq!, 10)}px`
            : "0px";
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        target.style.width = parseInt(target.dataset.overlapCnt!, 10) > 0 ? `${halfWidth}px` : `${containerWidth}px`;
      }
      this.setContentPaddingTop(target);
    });
  }

  // getHourHeight() {
  //   return (this.refs.TimeChartBorder as HTMLElement).firstElementChild!.clientHeight;
  // }

  render() {
    const { stickyDate } = this.state;
    const { timeChartState, timeScale, isShowFis, contentHeight, selectedTaskId } = this.props;
    const { workStartTime, workEndTime, taskInformation } = timeChartState;

    const leftTimeCounter = this.getLeftTimeCounter();
    const gndStartTime = dayjs(workStartTime).subtract(this.timeChartExtraView, "hours");
    const stickyDateDayjs = stickyDate ? dayjs(stickyDate, "YYYYMMDD") : null;
    const { isPc } = storage;

    return (
      <Wrapper>
        <TimeChartWrapper>
          <StickyHeader isPc={isPc}>
            {stickyDateDayjs && stickyDateDayjs.isValid() ? stickyDateDayjs.format("DDMMM").toUpperCase() : ""}
          </StickyHeader>
          <ScrollContainer ref={this.scrollRef} onScroll={this.onScroll}>
            <TimeChartBorderWrapper>
              <TimeChartBorder ref={this.timeChartBorderRef}>
                {leftTimeCounter &&
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  [...Array(leftTimeCounter)].map((_, index) => {
                    const leftTimeCount = gndStartTime.clone().add(index, "hours");
                    const isMidnight = leftTimeCount.hour() % 24 === 0;
                    return (
                      <Border
                        // eslint-disable-next-line react/no-array-index-key
                        key={`timeBorder_${index}`}
                        data-is-date={isMidnight}
                        data-task-date={leftTimeCount.format("YYYYMMDD")}
                        isMidnight={isMidnight}
                        contentHeight={contentHeight}
                        timeScale={timeScale}
                        isPc={isPc}
                      >
                        {isMidnight ? (
                          // eslint-disable-next-line react/no-array-index-key
                          <CrossDateLine key={index} isPc={isPc}>
                            {leftTimeCount && leftTimeCount.isValid() ? leftTimeCount.format("DDMMM").toUpperCase() : ""}
                          </CrossDateLine>
                        ) : (
                          <BorderLeftTime>
                            {leftTimeCount && leftTimeCount.isValid() ? leftTimeCount.hour().toString().padStart(2, "0") : ""}
                          </BorderLeftTime>
                        )}
                        <HalfHourBorder />
                      </Border>
                    );
                  })}
                {this.state.currentTime.isBetween(
                  dayjs(workStartTime).add(-this.timeChartExtraView, "hours"),
                  dayjs(workEndTime).add(this.timeChartExtraView, "hours")
                ) && <CurrentTimeBorder ref={this.currentBorderRef} top={this.getTopPos(this.state.currentTime)} />}
              </TimeChartBorder>
              <TaskWrapper ref={this.taskPlaceLineRef}>
                {taskInformation.map((sdlState: MyScheduleApi.TaskInformation, index) => {
                  const MAX_HEIGHT_TWO_ROW = storage.isPc ? 40 : 35;
                  const height = this.getHeight(sdlState);
                  const isOneRowDisp = height < MAX_HEIGHT_TWO_ROW;

                  return (
                    <OverlapTaskCard
                      key={sdlState.taskId ? sdlState.taskId : index}
                      ref={(element) => {
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        this.overlapTaskCardRefs[`TaskId__${sdlState.taskId}`] = element;
                      }}
                      isSelected={sdlState.taskId === selectedTaskId}
                      onClick={() => this.handleClickTask(sdlState)}
                      fontColor={sdlState.taskFontColor}
                      backgroundColor={sdlState.taskBackColor}
                      top={this.getTopPos(dayjs(sdlState.taskStartTime))}
                      height={height}
                      timeScale={timeScale}
                      isPc={isPc}
                    >
                      <TaskTypeLabel color={sdlState.taskClassColor} />
                      <TaskContents>
                        <ContentsFirstRow>
                          {`${sdlState.taskName} `}
                          {sdlState.carrierCodeIata &&
                            sdlState.fltNumber &&
                            sdlState.originDateLocal &&
                            `${sdlState.carrierCodeIata}${formatFltNo(sdlState.fltNumber)}/${sdlState.originDateLocal.slice(-2)} `}
                          {isOneRowDisp && `${dayjs(sdlState.taskStartTime).format("HHmm")}-${dayjs(sdlState.taskEndTime).format("HHmm")}`}
                        </ContentsFirstRow>
                        {!isOneRowDisp && (
                          <ContentsSecondRow>{`${dayjs(sdlState.taskStartTime).format("HHmm")}-${dayjs(sdlState.taskEndTime).format(
                            "HHmm"
                          )}`}</ContentsSecondRow>
                        )}
                      </TaskContents>
                    </OverlapTaskCard>
                  );
                })}
              </TaskWrapper>
            </TimeChartBorderWrapper>
          </ScrollContainer>
        </TimeChartWrapper>
        <InitialPositionButtonContainer isShowFis={isShowFis}>
          <InitialPositionButton isDisplaying onClick={this.scrollToCurrent} />
        </InitialPositionButtonContainer>
      </Wrapper>
    );
  }
}

const CURRENT_TIME_BALL_WIDTH = 9;
const TIMECHART_PADDING_TOP = 8;
const CONTENT_PADDING_LEFT = 8;
const CONTENT_MARGIN_RIGHT = 5;

const pcStickyHeaderHeight = 32;
const iPadStickyHeaderHeight = 34;

const getDateHeaderHeight = () => (storage.isPc ? pcStickyHeaderHeight : iPadStickyHeaderHeight);

/**
 * 1時間あたりの高さを取得する。
 */
const getOneHourHeight = (contentHeight: number, timeScale: myScheduleActions.TimeScale) => {
  const dateHeaderHeight = getDateHeaderHeight();
  return (contentHeight - dateHeaderHeight) / parseInt(timeScale, 10);
};

/**
 * ===============================
 * タイムチャート内タスク位置算出方法
 * ===============================
 *
 * 幅(重複なし)：タイムチャートの横幅 100%
 * 幅(重複あり)：タイムチャートの横幅 50%
 *
 * 高さ：(1時間あたりの高さ / 60分) * 開始時刻と終了時刻の差分
 * ※日跨ぎタスクの場合は +日跨ぎラベルの高さ
 *
 * 縦座標：スケジュール表示開始時刻とタスクの開始時刻(時)の差分 * 1時間あたりの高さ + タスクの開始時刻(分) + 8px(タイムチャート上部のpadding) + 1px(アウトライン)
 * ※日跨ぎタスクの場合は +(日跨ぎ日数 * 日跨ぎラベルの高さ)
 *
 * 左座標(重複なし) = 0
 * 左座標(1つの重複) = タイムチャートの横幅 50%
 * 左座標(2つ以上の重複) = タイムチャートの横幅 50% / 重複件数 * 重複番数
 *
 */
const OverlapTaskCard = styled.div<{
  height: number;
  top: number;
  isSelected: boolean; // 選択フラグ
  backgroundColor: string; // 背景色
  fontColor: string; // 文字色
  timeScale: string; // タイムスケール
  isPc: boolean; // PCフラグ
}>`
  height: ${({ height }) => height}px;
  top: ${({ top }) => top}px;
  min-height: 16px;
  min-width: 50%;
  position: absolute;
  display: flex;
  justify-content: flex-start;
  outline: ${({ isSelected }) => (isSelected ? "solid 4px #e6b422" : "solid 1px #346181")};
  z-index: ${({ isSelected }) => (isSelected ? 50 : "")};
  overflow: hidden;
  background-color: ${({ backgroundColor }) => `rgba(${backgroundColor})`};
  color: ${({ fontColor }) => `rgba(${fontColor})`};
  cursor: pointer;
`;

const Wrapper = styled.div`
  position: relative;
  background-color: #f6f6f6;
  height: inherit;
  min-width: 368px;
  ${media.greaterThan("desktopM")` min-width: 544px;`}
  ${media.greaterThan("desktopL")`min-width: 640px;`}
`;

const TimeChartWrapper = styled.div`
  height: inherit;
  width: inherit;
`;

const TaskTypeLabel = styled.div<{ color: string }>`
  min-width: 8px;
  background-color: ${(props) => `rgba(${props.color})`};
`;

const DateHeader = styled.div<{ isPc: boolean }>`
  height: ${getDateHeaderHeight()}px;
  color: #396584;
  display: inline-block;
  text-align: center;
  line-height: 2;
  font-size: 17px;
  background-color: #fff;

  :before,
  :after {
    content: "";
    position: absolute;
    top: 50%;
    display: inline-block;
    width: calc((100% - 100px) / 2);
    height: 3px;
    background-color: #a6bac8;
  }

  :before {
    left: 0;
  }

  :after {
    right: 0;
  }
`;

const StickyHeader = styled(DateHeader)`
  width: calc(100% - ${scrollbarSize()}px);
  margin-right: ${scrollbarSize()}px;
  box-shadow: 0px 10px 10px -5px #cccccc;
  position: relative;
`;

const Border = styled.div<{ isMidnight: boolean; contentHeight: number; timeScale: string; isPc: boolean }>`
  margin: 0px 10px;
  position: relative;
  height: ${({ timeScale, contentHeight }) => `calc((${contentHeight}px - ${getDateHeaderHeight()}px) / ${timeScale})`};

  ${({ isMidnight }) =>
    !isMidnight
      ? `
    :after {
      content: "";
      position: absolute;
      right: 0;
      top: 0px;
      display: inline-block;
      width: calc(100% - 25px);
      height: 1px;
      background-color: #C9D3D0;
    }
  `
      : ""};
`;

const BorderLeftTime = styled.div`
  position: absolute;
  top: -8px;
  min-width: 25px;
`;

const HalfHourBorder = styled.div`
  position: absolute;
  top: 50%;
  height: 1px;
  background-color: #e0e0e0;
  width: calc(100% - 25px);
  left: 25px;
`;

const CrossDateLine = styled(DateHeader)<{ isPc: boolean }>`
  position: absolute;
  top: ${-(getDateHeaderHeight() / 2 + 1)}px;
  left: -10px;
  height: ${getDateHeaderHeight()}px;
  width: calc(100% + 20px);
  box-shadow: none;
  background-color: rgba(999, 999, 999, 0.5);
  z-index: 200;
  :after {
    height: 3px;
  }
`;

const visibleFisContent = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const hiddenFisContent = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(10px); }
  100% { transform: translateY(0px); }
`;

const InitialPositionButtonContainer = styled.div<{ isShowFis: boolean }>`
  position: absolute;
  z-index: 9;
  right: 44px;
  display: flex;
  bottom: 44px;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.6, 0, 0, 1.8);
  animation: ${({ isShowFis }) => (isShowFis ? visibleFisContent : hiddenFisContent)} 0.6s ease-in-out;
`;

const TaskContents = styled.div`
  max-width: calc(100% - ${CONTENT_PADDING_LEFT}px);
  padding-left: ${CONTENT_PADDING_LEFT}px;
  display: flex;
  justify-content: flex-start;
  height: fit-content;
  align-items: center;
  padding-top: 1px;
  flex-wrap: wrap;
  line-height: 1.05;
`;

const ContentsFirstRow = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-right: ${CONTENT_MARGIN_RIGHT}px;
  font-size: 17px;
`;

const ContentsSecondRow = styled.div``;

const ScrollContainer = styled.div`
  display: flex;
  position: relative;
  z-index: 0;
  overflow-y: scroll;

  -webkit-overflow-scrolling: touch;
  height: calc(100% - 32px);
`;

const TimeChartBorderWrapper = styled.div`
  width: 100%;
  position: relative;
  padding-top: ${TIMECHART_PADDING_TOP}px;
`;

const TimeChartBorder = styled.div``;

const TaskWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 25px;
  bottom: 0px;
  margin: auto;
  width: calc(100% - 75px);
`;

/**
 * ======================
 * 現在時刻線 位置算出方法
 * ======================
 *
 * 現在時刻(時) * 1時間分の高さ +
 * 現在時刻(分) * (1時間分の高さ /60(分)) + padding 8px;
 *
 * ※現在時刻 = 画面読み込み時のローカル時刻
 */
const CurrentTimeBorder = styled.div<{ top: number }>`
  position: absolute;
  width: calc(100% - 48px);
  height: 2px;
  background-color: #b8261f;
  top: ${({ top }) => top}px;
  z-index: 100;
  left: 38px;

  &:after {
    content: " ";
    width: ${CURRENT_TIME_BALL_WIDTH}px;
    height: 9px;
    border-radius: 50%;
    background-color: #b8261f;
    position: absolute;
    top: -3px;
    left: -4px;
  }
`;

export default MyScheduleTimeChart;
