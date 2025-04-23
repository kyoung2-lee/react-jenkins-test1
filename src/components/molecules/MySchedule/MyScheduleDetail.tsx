import dayjs from "dayjs";
import React from "react";
import styled, { css, keyframes } from "styled-components";

import media from "../../../styles/media";
import { smoothScroll } from "../../../lib/commonUtil";
import { storage } from "../../../lib/storage";
import * as myScheduleActions from "../../../reducers/mySchedule";
import { JobAuth } from "../../../reducers/account";
import MyScheduleTaskCard from "./MyScheduleTaskCard";
import CheckIcon from "../../../assets/images/icon/icon-check.svg?component";
import ProfileSvg from "../../../assets/images/account/profile.svg";

type Props = {
  jobAuth: JobAuth;
  selectedTaskId: number | null;
  dtlSchedule: myScheduleActions.DetailScheduleState;
  timeChartState: MyScheduleApi.StaffAssignInformation;
  changeActiveDetailTask: typeof myScheduleActions.changeActiveDetailTask;
  updateMyScheduleInfo: typeof myScheduleActions.updateMyScheduleInfo;
  isUpdate: boolean;
  isShowFis: boolean;
};

type State = {
  doCheckAnimation: boolean;
};

class MyScheduleDetail extends React.Component<Props, State> {
  private myScheduleDetailScrollRef: React.RefObject<HTMLDivElement>;
  private myScheduleDetailCardRef: React.RefObject<HTMLDivElement>;
  private myScheduleDetailWrapRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.myScheduleDetailScrollRef = React.createRef();
    this.myScheduleDetailCardRef = React.createRef();
    this.myScheduleDetailWrapRef = React.createRef();

    this.state = { doCheckAnimation: false };

    this.handleClickTaskFinishButton = this.handleClickTaskFinishButton.bind(this);
    this.handleClickTaskStartButton = this.handleClickTaskStartButton.bind(this);
    this.setScrollContainerPadding = this.setScrollContainerPadding.bind(this);
    this.setPaddingsAndScroll = this.setPaddingsAndScroll.bind(this);
    this.effectScroll = this.effectScroll.bind(this);
  }

  componentDidMount() {
    this.setPaddingsAndScroll();
  }

  componentDidUpdate(prevProps: Props) {
    const { dtlSchedule, isUpdate } = this.props;
    if (prevProps.dtlSchedule !== dtlSchedule) {
      this.setScrollContainerPadding();

      // 詳細タスク-更新
      if (isUpdate) {
        // ステータス更新
        if (
          (!prevProps.dtlSchedule.taskStartStatus && dtlSchedule.taskStartStatus) ||
          (!prevProps.dtlSchedule.taskEndStatus && dtlSchedule.taskEndStatus)
        ) {
          this.setState({ doCheckAnimation: true });
          // チェックアニメーションが終わった頃にOFFにする
          setTimeout(() => {
            this.setState({ doCheckAnimation: false });
          }, 1000);
        }
        // 詳細タスク-変更
      } else {
        this.effectScroll();
        this.setState({ doCheckAnimation: false });
      }
    }
  }

  handleClickTask = (taskState: MyScheduleApi.TaskInformation) => {
    this.props.changeActiveDetailTask({ taskInformation: taskState });
    if (taskState.taskId) {
      storage.myScheduleSaveTask = taskState.taskId;
    }
  };

  handleClickTaskFinishButton = () => {
    const { timeChartState, dtlSchedule, jobAuth } = this.props;
    const { workDate } = timeChartState;
    if (!dtlSchedule.taskId) return;

    this.props.updateMyScheduleInfo({
      params: {
        apoCd: jobAuth.user.myApoCd,
        workDate,
        taskId: dtlSchedule.taskId,
        taskStartStatus: dtlSchedule.taskStartStatus,
        taskEndStatus: !dtlSchedule.taskEndStatus,
      },
    });
  };

  handleClickTaskStartButton = () => {
    const { timeChartState, dtlSchedule, jobAuth } = this.props;
    const { workDate } = timeChartState;
    if (!dtlSchedule.taskId) return;

    this.props.updateMyScheduleInfo({
      params: {
        apoCd: jobAuth.user.myApoCd,
        workDate,
        taskId: dtlSchedule.taskId,
        taskStartStatus: !dtlSchedule.taskStartStatus,
        taskEndStatus: dtlSchedule.taskEndStatus,
      },
    });
  };

  /**
   * 1)詳細カードを詳細部の中央に配置する。
   *   （詳細部 - FIS部）を半分にしたエリアにいくつ小カードが配置できるかを計算し
   *   スクロールエリアに小カード上下に余白をいれることで中央に詳細カードを配置する。
   *
   * 2)方向転換（リサイズ）前の上の余白を取得し、切替を滑らかにする
   *   ①縦から横（スクロールエリアが短くなる場合）: 余白を付け足す際にアニメーションをつける
   *   ②横から縦（スクロールエリアが長くなる場合）: 余白を付け足した後の詳細タスクの位置に一瞬でスクロールすることにより、動いていなかったようにみせる
   */
  setScrollContainerPadding = () => {
    if (!this.myScheduleDetailCardRef.current || !this.myScheduleDetailWrapRef.current || !this.myScheduleDetailScrollRef.current) return;
    const detailCardHeight = this.myScheduleDetailCardRef.current.clientHeight;

    // 詳細カードの上部に表示する小カードの数 = (スクロールエリアの高さ - 詳細カードの高さ - FIS部の高さ) / 小カードの高さ / 2
    let detailUpperCardCount = Math.floor(
      (this.myScheduleDetailWrapRef.current.clientHeight - detailCardHeight - fisAreaHeight) / smallTaskHeight / 2
    );
    // 上の小タスクカードを優先的に表示する。
    if (detailUpperCardCount === 0) detailUpperCardCount = 1;

    // 付け足す上の余白 = 詳細カードの上部に表示する小カードの数 * 小カードの高さ + スクロールエリア最上部padding(20px)
    const newPaddingTop: number = detailUpperCardCount * smallTaskHeight + 20;
    // 付け足す下の余白 = スクロールエリアの高さ - (詳細カードの上部に表示する小カードの数 * 小カードの高さ + 詳細カードの高さ + 詳細カードの下margin(30px) + スクロールエリア最上部padding(20px) + FIS部の高さ(FIS部表示時のみ))
    this.myScheduleDetailScrollRef.current.style.paddingBottom = `${
      this.myScheduleDetailWrapRef.current.clientHeight -
      (detailUpperCardCount * smallTaskHeight + detailCardHeight + 30 + 20 + (this.props.isShowFis ? fisAreaHeight : 0))
    }px`;

    // 方向転換（リサイズ）前の上の余白を取得する
    let prevPaddingTop = 0;
    const { paddingTop } = window.getComputedStyle(this.myScheduleDetailScrollRef.current);
    if (paddingTop) {
      prevPaddingTop = parseInt(paddingTop, 10);
    }
    // ①縦から横（スクロールエリアが短くなる場合）
    if (prevPaddingTop > newPaddingTop) {
      this.myScheduleDetailScrollRef.current.style.transition = "padding-top .3s";
    } else {
      this.myScheduleDetailScrollRef.current.style.transition = "";
    }
    // 上の余白を付け足す
    this.myScheduleDetailScrollRef.current.style.paddingTop = `${newPaddingTop}px`;
    // ②横から縦（スクロールエリアが長くなる場合）
    if (!(prevPaddingTop > newPaddingTop)) {
      this.myScheduleDetailScrollRef.current.scrollTo(
        0,
        this.myScheduleDetailScrollRef.current.scrollTop + (newPaddingTop - prevPaddingTop)
      );
    }
  };

  setPaddingsAndScroll = () => {
    this.setScrollContainerPadding();
    this.effectScroll();
  };

  effectScroll = () => {
    const targetIndex = this.props.timeChartState.taskInformation.findIndex(
      (schedule) => schedule.taskId === this.props.dtlSchedule.taskId
    );
    const scrollPos = smallTaskHeight * targetIndex;
    if (this.myScheduleDetailScrollRef.current) {
      smoothScroll(this.myScheduleDetailScrollRef.current, scrollPos, 30);
    }
  };

  render() {
    const { timeChartState, dtlSchedule, isShowFis, selectedTaskId } = this.props;
    const { doCheckAnimation } = this.state;
    const { isPc } = storage;

    return (
      <Wrapper ref={this.myScheduleDetailWrapRef} isPc={isPc}>
        <ScrollContainer ref={this.myScheduleDetailScrollRef} isShowFis={isShowFis} isPc={isPc}>
          {timeChartState.taskInformation.map((schedule, index) =>
            schedule.taskId !== selectedTaskId ? (
              <TaskBox key={schedule.taskId ? schedule.taskId : index} onClick={() => this.handleClickTask(schedule)} isPc={isPc}>
                <TaskTypeLabel color={schedule.taskClassColor} />
                <MyScheduleTaskCard dtlSchedule={schedule} height={72} isSmallTask />
              </TaskBox>
            ) : (
              <DetailTaskCard key={schedule.taskId ? schedule.taskId : index} ref={this.myScheduleDetailCardRef} isPc={isPc}>
                <ContentWrapper>
                  <TaskTypeLabel color={schedule.taskClassColor} />
                  <TaskContents>
                    <TaskCardWrapper>
                      <MyScheduleTaskCard dtlSchedule={dtlSchedule} doCheckAnimation={doCheckAnimation} />
                    </TaskCardWrapper>
                    <TaskBody>
                      <ProcessBoundary>
                        <div>Process</div>
                        <div>Schedule</div>
                        <div>Actual</div>
                      </ProcessBoundary>
                      <TaskControlContents>
                        <TaskControlRow>
                          <div>
                            <TaskControlButton onClick={this.handleClickTaskStartButton} isExecuted={schedule.taskStartStatus}>
                              Start
                            </TaskControlButton>
                          </div>
                          <div>{dayjs(schedule.taskStartTime).format("HHmm")}</div>
                          <div>
                            {schedule.taskStartStatus && (
                              <AnimateCheckIcon>
                                <CheckIcon />
                              </AnimateCheckIcon>
                            )}
                          </div>
                        </TaskControlRow>
                        <TaskControlRow>
                          <div>
                            <TaskControlButton onClick={this.handleClickTaskFinishButton} isExecuted={schedule.taskEndStatus}>
                              Finish
                            </TaskControlButton>
                          </div>
                          <div>{dayjs(schedule.taskEndTime).format("HHmm")}</div>
                          <div>
                            {schedule.taskEndStatus && (
                              <AnimateCheckIcon>
                                <CheckIcon />
                              </AnimateCheckIcon>
                            )}
                          </div>
                        </TaskControlRow>
                      </TaskControlContents>
                    </TaskBody>
                  </TaskContents>
                  <AssignMember>
                    <MemberScrollContainer isPc={isPc}>
                      {schedule.sameWorkerInformation.map((data) => (
                        <div key={data.employeeNumber}>
                          <div>
                            <ProfileImgIcon src={data.profileImg ? `data:image/png;base64,${data.profileImg}` : ProfileSvg} isPc={isPc} />
                          </div>
                          <AssignMemberName isPc={isPc} title={`${data.firstName} ${data.familyName}`}>
                            <div>{data.firstName}</div>
                            <div> {data.familyName}</div>
                          </AssignMemberName>
                        </div>
                      ))}
                    </MemberScrollContainer>
                  </AssignMember>
                </ContentWrapper>
              </DetailTaskCard>
            )
          )}
        </ScrollContainer>
      </Wrapper>
    );
  }
}

const smallTaskHeight = 104;
const fisAreaHeight = storage.isPc ? 112 : 119;

const Wrapper = styled.div<{ isPc: boolean }>`
  width: 100%;
`;

const ScrollContainer = styled.div<{ isPc: boolean; isShowFis: boolean }>`
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  height: 100%;
`;

const TaskBox = styled.div<{ isPc: boolean }>`
  display: flex;
  width: 360px;
  ${media.greaterThan("desktopM")`width: 420px;`};
  background-color: ${(props) => props.theme.color.WHITE};
  box-shadow: 0px 5px 12px #a9a9a9;
  border: solid 1px #346181;
  margin: 0 auto 30px auto;
  cursor: pointer;
`;

const TaskTypeLabel = styled.div<{ color: string }>`
  min-width: 10px;
  background-color: ${(props) => `rgba(${props.color})`};
`;

const KeyframeDetailShow = keyframes`
  0%   { transform: scale(0.8); opacity: 0;}
  100% { transform: scale(1); opacity: 1; }
`;

const DetailTaskCard = styled.div<{ isPc: boolean }>`
  width: 592px;
  height: 264px;
  box-shadow: 0px 5px 12px #a9a9a9;
  background-color: ${(props) => props.theme.color.WHITE};
  outline: rgb(230, 180, 34) solid 3px;
  margin: 0 auto 30px auto;
  animation: ${KeyframeDetailShow} 0.6s cubic-bezier(0.6, 0, 0, 1.8);
  ${media.greaterThan("desktopM")`width: 710px; height: 312px;`};
  ${media.greaterThan("desktopL")`width: 832px; height: 370px;`};
`;

const AssignMemberName = styled.div<{ isPc: boolean }>`
  display: flex;
  flex-wrap: wrap;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  > div {
    text-overflow: ellipsis;
    overflow: hidden;
    &:first-child {
      margin-right: 5px;
    }
  }
`;

const AssignMember = styled.div`
  padding: 5px 0px 5px 2px;
  width: 222px;
  min-width: 222px;
  background-color: #e4f2f7;
  ${media.greaterThan("desktopM")`width: 288px; min-width: 288px; padding: 10px 0px 10px 20px;`}
  ${media.greaterThan("desktopL")`width: 342px; min-width: 342px;`}
`;

const ContentWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const TaskContents = styled.div`
  width: 100%;
`;

const TaskCardWrapper = styled.div`
  height: 78px;
  ${media.greaterThan("desktopM")`height: 88px;`}
  ${media.greaterThan("desktopL")` height: 102px;`}
`;

const TaskBody = styled.div``;

const ProcessBoundary = styled.div`
  display: flex;
  height: 16px;
  align-items: center;
  background-color: #119ac2;
  padding-left: 48px;
  color: #fff;
  font-size: 12px;
  ${media.greaterThan("desktopM")`padding-left: 54px;`};
  ${media.greaterThan("desktopL")`padding-left: 58px;`};
  > div:nth-child(1) {
    width: 100%;
  }
  > div:nth-child(2) {
    min-width: 95px;
  }
  > div:nth-child(3) {
    min-width: 85px;
    ${media.greaterThan("1024px")`min-width: 70px;`}
    ${media.greaterThan("desktopM")`min-width: 115px;`}
    ${media.greaterThan("desktopL")`min-width: 130px;`};
  }
`;

const TaskControlContents = styled.div`
  padding-left: 48px;
  padding-top: 23px;
  ${media.greaterThan("desktopM")`padding-left: 54px;`};
  ${media.greaterThan("desktopL")`padding-left: 58px;`};
  > div:first-child {
    margin-bottom: 15px;
    ${media.greaterThan("desktopM")`margin-bottom: 30px;`};
  }
`;

const TaskControlRow = styled.div`
  display: flex;
  font-size: 18px;
  align-items: center;

  > div:nth-child(1) {
    width: 100%;
  }

  > div:nth-child(2) {
    min-width: 95px;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  > div:nth-child(3) {
    min-width: 85px;
    ${media.greaterThan("1024px")`min-width: 70px;`};
    ${media.greaterThan("desktopM")`min-width: 115px;`}
    ${media.greaterThan("desktopL")`min-width: 130px;`};
  }
`;

const TaskControlButton = styled.button<{ isExecuted: boolean }>`
  cursor: pointer;
  border-radius: 4px;
  border: solid 1px #fff;
  width: 144px;
  height: 48px;
  color: ${(props) => props.theme.color.WHITE};
  text-align: center;
  line-height: 2.5;
  box-shadow: 4px 3px 5px #aaa;
  ${({ isExecuted }) =>
    isExecuted
      ? `background-color: #C9D3D0;
       color: #000;
      `
      : `background-color: #32BBE5;
       color: #fff;
      `};
  ${media.lessThan("desktopL")`width: 114px;`};
  ${media.lessThan("1023px")`width: 100px;`};
`;

const MemberScrollContainer = styled.div<{ isPc: boolean }>`
  width: 100%;
  height: 100%;
  color: #346181;
  font-size: 18px;
  ${media.lessThan("1365px")`
    font-size: 14px;
    padding: 10px 2px 2px 10px;
  `} overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  > div {
    display: flex;
    align-items: center;
    color: #000000;
    margin-bottom: 16px;
    overflow: hidden;

    > div:first-child {
      margin-right: 10px;
    }
  }
`;

const ProfileImgIcon = styled.img<{ isPc: boolean }>`
  ${({ isPc }) =>
    isPc
      ? css`
          width: 36px;
          height: 36px;
        `
      : css`
          width: 40px;
          height: 40px;
        `};
  border-radius: 50%;
`;

const AnimateCheckIcon = styled.div`
  width: 35px;
  height: 40px;
  .svg-elem-1 {
    fill: #c9d3d0;
    stroke: #c9d3d0;
  }
  .svg-elem-2 {
    fill: #c9d3d0;
    stroke: #c9d3d0;
  }
`;

export default MyScheduleDetail;
