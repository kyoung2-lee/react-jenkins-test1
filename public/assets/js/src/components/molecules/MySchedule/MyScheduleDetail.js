"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const media_1 = __importDefault(require("../../../styles/media"));
const commonUtil_1 = require("../../../lib/commonUtil");
const storage_1 = require("../../../lib/storage");
const MyScheduleTaskCard_1 = __importDefault(require("./MyScheduleTaskCard"));
const icon_check_svg_component_1 = __importDefault(require("../../../assets/images/icon/icon-check.svg?component"));
const profile_svg_1 = __importDefault(require("../../../assets/images/account/profile.svg"));
class MyScheduleDetail extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleClickTask = (taskState) => {
            this.props.changeActiveDetailTask({ taskInformation: taskState });
            if (taskState.taskId) {
                storage_1.storage.myScheduleSaveTask = taskState.taskId;
            }
        };
        this.handleClickTaskFinishButton = () => {
            const { timeChartState, dtlSchedule, jobAuth } = this.props;
            const { workDate } = timeChartState;
            if (!dtlSchedule.taskId)
                return;
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
        this.handleClickTaskStartButton = () => {
            const { timeChartState, dtlSchedule, jobAuth } = this.props;
            const { workDate } = timeChartState;
            if (!dtlSchedule.taskId)
                return;
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
        this.setScrollContainerPadding = () => {
            if (!this.myScheduleDetailCardRef.current || !this.myScheduleDetailWrapRef.current || !this.myScheduleDetailScrollRef.current)
                return;
            const detailCardHeight = this.myScheduleDetailCardRef.current.clientHeight;
            // 詳細カードの上部に表示する小カードの数 = (スクロールエリアの高さ - 詳細カードの高さ - FIS部の高さ) / 小カードの高さ / 2
            let detailUpperCardCount = Math.floor((this.myScheduleDetailWrapRef.current.clientHeight - detailCardHeight - fisAreaHeight) / smallTaskHeight / 2);
            // 上の小タスクカードを優先的に表示する。
            if (detailUpperCardCount === 0)
                detailUpperCardCount = 1;
            // 付け足す上の余白 = 詳細カードの上部に表示する小カードの数 * 小カードの高さ + スクロールエリア最上部padding(20px)
            const newPaddingTop = detailUpperCardCount * smallTaskHeight + 20;
            // 付け足す下の余白 = スクロールエリアの高さ - (詳細カードの上部に表示する小カードの数 * 小カードの高さ + 詳細カードの高さ + 詳細カードの下margin(30px) + スクロールエリア最上部padding(20px) + FIS部の高さ(FIS部表示時のみ))
            this.myScheduleDetailScrollRef.current.style.paddingBottom = `${this.myScheduleDetailWrapRef.current.clientHeight -
                (detailUpperCardCount * smallTaskHeight + detailCardHeight + 30 + 20 + (this.props.isShowFis ? fisAreaHeight : 0))}px`;
            // 方向転換（リサイズ）前の上の余白を取得する
            let prevPaddingTop = 0;
            const { paddingTop } = window.getComputedStyle(this.myScheduleDetailScrollRef.current);
            if (paddingTop) {
                prevPaddingTop = parseInt(paddingTop, 10);
            }
            // ①縦から横（スクロールエリアが短くなる場合）
            if (prevPaddingTop > newPaddingTop) {
                this.myScheduleDetailScrollRef.current.style.transition = "padding-top .3s";
            }
            else {
                this.myScheduleDetailScrollRef.current.style.transition = "";
            }
            // 上の余白を付け足す
            this.myScheduleDetailScrollRef.current.style.paddingTop = `${newPaddingTop}px`;
            // ②横から縦（スクロールエリアが長くなる場合）
            if (!(prevPaddingTop > newPaddingTop)) {
                this.myScheduleDetailScrollRef.current.scrollTo(0, this.myScheduleDetailScrollRef.current.scrollTop + (newPaddingTop - prevPaddingTop));
            }
        };
        this.setPaddingsAndScroll = () => {
            this.setScrollContainerPadding();
            this.effectScroll();
        };
        this.effectScroll = () => {
            const targetIndex = this.props.timeChartState.taskInformation.findIndex((schedule) => schedule.taskId === this.props.dtlSchedule.taskId);
            const scrollPos = smallTaskHeight * targetIndex;
            if (this.myScheduleDetailScrollRef.current) {
                (0, commonUtil_1.smoothScroll)(this.myScheduleDetailScrollRef.current, scrollPos, 30);
            }
        };
        this.myScheduleDetailScrollRef = react_1.default.createRef();
        this.myScheduleDetailCardRef = react_1.default.createRef();
        this.myScheduleDetailWrapRef = react_1.default.createRef();
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
    componentDidUpdate(prevProps) {
        const { dtlSchedule, isUpdate } = this.props;
        if (prevProps.dtlSchedule !== dtlSchedule) {
            this.setScrollContainerPadding();
            // 詳細タスク-更新
            if (isUpdate) {
                // ステータス更新
                if ((!prevProps.dtlSchedule.taskStartStatus && dtlSchedule.taskStartStatus) ||
                    (!prevProps.dtlSchedule.taskEndStatus && dtlSchedule.taskEndStatus)) {
                    this.setState({ doCheckAnimation: true });
                    // チェックアニメーションが終わった頃にOFFにする
                    setTimeout(() => {
                        this.setState({ doCheckAnimation: false });
                    }, 1000);
                }
                // 詳細タスク-変更
            }
            else {
                this.effectScroll();
                this.setState({ doCheckAnimation: false });
            }
        }
    }
    render() {
        const { timeChartState, dtlSchedule, isShowFis, selectedTaskId } = this.props;
        const { doCheckAnimation } = this.state;
        const { isPc } = storage_1.storage;
        return (react_1.default.createElement(Wrapper, { ref: this.myScheduleDetailWrapRef, isPc: isPc },
            react_1.default.createElement(ScrollContainer, { ref: this.myScheduleDetailScrollRef, isShowFis: isShowFis, isPc: isPc }, timeChartState.taskInformation.map((schedule, index) => schedule.taskId !== selectedTaskId ? (react_1.default.createElement(TaskBox, { key: schedule.taskId ? schedule.taskId : index, onClick: () => this.handleClickTask(schedule), isPc: isPc },
                react_1.default.createElement(TaskTypeLabel, { color: schedule.taskClassColor }),
                react_1.default.createElement(MyScheduleTaskCard_1.default, { dtlSchedule: schedule, height: 72, isSmallTask: true }))) : (react_1.default.createElement(DetailTaskCard, { key: schedule.taskId ? schedule.taskId : index, ref: this.myScheduleDetailCardRef, isPc: isPc },
                react_1.default.createElement(ContentWrapper, null,
                    react_1.default.createElement(TaskTypeLabel, { color: schedule.taskClassColor }),
                    react_1.default.createElement(TaskContents, null,
                        react_1.default.createElement(TaskCardWrapper, null,
                            react_1.default.createElement(MyScheduleTaskCard_1.default, { dtlSchedule: dtlSchedule, doCheckAnimation: doCheckAnimation })),
                        react_1.default.createElement(TaskBody, null,
                            react_1.default.createElement(ProcessBoundary, null,
                                react_1.default.createElement("div", null, "Process"),
                                react_1.default.createElement("div", null, "Schedule"),
                                react_1.default.createElement("div", null, "Actual")),
                            react_1.default.createElement(TaskControlContents, null,
                                react_1.default.createElement(TaskControlRow, null,
                                    react_1.default.createElement("div", null,
                                        react_1.default.createElement(TaskControlButton, { onClick: this.handleClickTaskStartButton, isExecuted: schedule.taskStartStatus }, "Start")),
                                    react_1.default.createElement("div", null, (0, dayjs_1.default)(schedule.taskStartTime).format("HHmm")),
                                    react_1.default.createElement("div", null, schedule.taskStartStatus && (react_1.default.createElement(AnimateCheckIcon, null,
                                        react_1.default.createElement(icon_check_svg_component_1.default, null))))),
                                react_1.default.createElement(TaskControlRow, null,
                                    react_1.default.createElement("div", null,
                                        react_1.default.createElement(TaskControlButton, { onClick: this.handleClickTaskFinishButton, isExecuted: schedule.taskEndStatus }, "Finish")),
                                    react_1.default.createElement("div", null, (0, dayjs_1.default)(schedule.taskEndTime).format("HHmm")),
                                    react_1.default.createElement("div", null, schedule.taskEndStatus && (react_1.default.createElement(AnimateCheckIcon, null,
                                        react_1.default.createElement(icon_check_svg_component_1.default, null)))))))),
                    react_1.default.createElement(AssignMember, null,
                        react_1.default.createElement(MemberScrollContainer, { isPc: isPc }, schedule.sameWorkerInformation.map((data) => (react_1.default.createElement("div", { key: data.employeeNumber },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(ProfileImgIcon, { src: data.profileImg ? `data:image/png;base64,${data.profileImg}` : profile_svg_1.default, isPc: isPc })),
                            react_1.default.createElement(AssignMemberName, { isPc: isPc, title: `${data.firstName} ${data.familyName}` },
                                react_1.default.createElement("div", null, data.firstName),
                                react_1.default.createElement("div", null,
                                    " ",
                                    data.familyName))))))))))))));
    }
}
const smallTaskHeight = 104;
const fisAreaHeight = storage_1.storage.isPc ? 112 : 119;
const Wrapper = styled_components_1.default.div `
  width: 100%;
`;
const ScrollContainer = styled_components_1.default.div `
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  height: 100%;
`;
const TaskBox = styled_components_1.default.div `
  display: flex;
  width: 360px;
  ${media_1.default.greaterThan("desktopM") `width: 420px;`};
  background-color: ${(props) => props.theme.color.WHITE};
  box-shadow: 0px 5px 12px #a9a9a9;
  border: solid 1px #346181;
  margin: 0 auto 30px auto;
  cursor: pointer;
`;
const TaskTypeLabel = styled_components_1.default.div `
  min-width: 10px;
  background-color: ${(props) => `rgba(${props.color})`};
`;
const KeyframeDetailShow = (0, styled_components_1.keyframes) `
  0%   { transform: scale(0.8); opacity: 0;}
  100% { transform: scale(1); opacity: 1; }
`;
const DetailTaskCard = styled_components_1.default.div `
  width: 592px;
  height: 264px;
  box-shadow: 0px 5px 12px #a9a9a9;
  background-color: ${(props) => props.theme.color.WHITE};
  outline: rgb(230, 180, 34) solid 3px;
  margin: 0 auto 30px auto;
  animation: ${KeyframeDetailShow} 0.6s cubic-bezier(0.6, 0, 0, 1.8);
  ${media_1.default.greaterThan("desktopM") `width: 710px; height: 312px;`};
  ${media_1.default.greaterThan("desktopL") `width: 832px; height: 370px;`};
`;
const AssignMemberName = styled_components_1.default.div `
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
const AssignMember = styled_components_1.default.div `
  padding: 5px 0px 5px 2px;
  width: 222px;
  min-width: 222px;
  background-color: #e4f2f7;
  ${media_1.default.greaterThan("desktopM") `width: 288px; min-width: 288px; padding: 10px 0px 10px 20px;`}
  ${media_1.default.greaterThan("desktopL") `width: 342px; min-width: 342px;`}
`;
const ContentWrapper = styled_components_1.default.div `
  display: flex;
  height: 100%;
`;
const TaskContents = styled_components_1.default.div `
  width: 100%;
`;
const TaskCardWrapper = styled_components_1.default.div `
  height: 78px;
  ${media_1.default.greaterThan("desktopM") `height: 88px;`}
  ${media_1.default.greaterThan("desktopL") ` height: 102px;`}
`;
const TaskBody = styled_components_1.default.div ``;
const ProcessBoundary = styled_components_1.default.div `
  display: flex;
  height: 16px;
  align-items: center;
  background-color: #119ac2;
  padding-left: 48px;
  color: #fff;
  font-size: 12px;
  ${media_1.default.greaterThan("desktopM") `padding-left: 54px;`};
  ${media_1.default.greaterThan("desktopL") `padding-left: 58px;`};
  > div:nth-child(1) {
    width: 100%;
  }
  > div:nth-child(2) {
    min-width: 95px;
  }
  > div:nth-child(3) {
    min-width: 85px;
    ${media_1.default.greaterThan("1024px") `min-width: 70px;`}
    ${media_1.default.greaterThan("desktopM") `min-width: 115px;`}
    ${media_1.default.greaterThan("desktopL") `min-width: 130px;`};
  }
`;
const TaskControlContents = styled_components_1.default.div `
  padding-left: 48px;
  padding-top: 23px;
  ${media_1.default.greaterThan("desktopM") `padding-left: 54px;`};
  ${media_1.default.greaterThan("desktopL") `padding-left: 58px;`};
  > div:first-child {
    margin-bottom: 15px;
    ${media_1.default.greaterThan("desktopM") `margin-bottom: 30px;`};
  }
`;
const TaskControlRow = styled_components_1.default.div `
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
    ${media_1.default.greaterThan("1024px") `min-width: 70px;`};
    ${media_1.default.greaterThan("desktopM") `min-width: 115px;`}
    ${media_1.default.greaterThan("desktopL") `min-width: 130px;`};
  }
`;
const TaskControlButton = styled_components_1.default.button `
  cursor: pointer;
  border-radius: 4px;
  border: solid 1px #fff;
  width: 144px;
  height: 48px;
  color: ${(props) => props.theme.color.WHITE};
  text-align: center;
  line-height: 2.5;
  box-shadow: 4px 3px 5px #aaa;
  ${({ isExecuted }) => isExecuted
    ? `background-color: #C9D3D0;
       color: #000;
      `
    : `background-color: #32BBE5;
       color: #fff;
      `};
  ${media_1.default.lessThan("desktopL") `width: 114px;`};
  ${media_1.default.lessThan("1023px") `width: 100px;`};
`;
const MemberScrollContainer = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  color: #346181;
  font-size: 18px;
  ${media_1.default.lessThan("1365px") `
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
const ProfileImgIcon = styled_components_1.default.img `
  ${({ isPc }) => isPc
    ? (0, styled_components_1.css) `
          width: 36px;
          height: 36px;
        `
    : (0, styled_components_1.css) `
          width: 40px;
          height: 40px;
        `};
  border-radius: 50%;
`;
const AnimateCheckIcon = styled_components_1.default.div `
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
exports.default = MyScheduleDetail;
//# sourceMappingURL=MyScheduleDetail.js.map