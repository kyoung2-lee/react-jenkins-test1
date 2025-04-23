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
const react_1 = __importDefault(require("react"));
const dayjs_1 = __importDefault(require("dayjs"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importStar(require("styled-components"));
const layoutStyle_1 = __importDefault(require("../../../styles/layoutStyle"));
const myScheduleExports = __importStar(require("../../../reducers/mySchedule"));
const MyScheduleTimeChart_1 = __importDefault(require("../../molecules/MySchedule/MyScheduleTimeChart"));
const MyScheduleDetail_1 = __importDefault(require("../../molecules/MySchedule/MyScheduleDetail"));
const MyScheduleFis_1 = __importDefault(require("../../molecules/MySchedule/MyScheduleFis"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const commonConst_1 = require("../../../lib/commonConst");
const storage_1 = require("../../../lib/storage");
const icon_clock_skeleton_svg_component_1 = __importDefault(require("../../../assets/images/icon/icon-clock-skeleton.svg?component"));
const media_1 = __importDefault(require("../../../styles/media"));
const icon_fis_select_target_popup_svg_1 = __importDefault(require("../../../assets/images/icon/icon-fis-select-target-popup.svg"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _myScheduleDefault, slice: _myScheduleSlice, ...myScheduleActions } = myScheduleExports;
class MySchedule extends react_1.default.Component {
    constructor(props) {
        super(props);
        /**
         * pcリサイズ・iPad回転時の対応
         */
        this.addEventHandlerOrientationAndResize = () => {
            if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPad) {
                window.addEventListener("orientationchange", this.onResize);
            }
            else {
                window.onresize = this.onResize;
            }
        };
        this.resizeMyScheduleContainerHeight = () => {
            if (!this.myScheduleHeaderRef.current)
                return;
            const height = this.myScheduleHeaderRef.current.clientHeight;
            const commonHeader = storage_1.storage.isPc ? parseInt(layoutStyle_1.default.header.default, 10) : parseInt(layoutStyle_1.default.header.tablet, 10) + 57;
            const vh = window.innerHeight;
            const fisHeight = this.fisRowRef.current ? this.fisRowRef.current.clientHeight : 0;
            this.setState({ myScheduleContainerHeight: vh - (height + commonHeader + fisHeight) });
        };
        this.onResize = () => {
            if (this.timer !== undefined)
                clearTimeout(this.timer);
            this.timer = setTimeout(this.childResizeFuncs, 200);
        };
        this.childResizeFuncs = () => {
            if (!this.timeChartRef.current || !this.detailRef.current)
                return;
            this.resizeMyScheduleContainerHeight();
            void this.timeChartRef.current.timeChartSettings();
            this.detailRef.current.setPaddingsAndScroll();
        };
        this.openTimeScaleModal = () => {
            this.setState({ isTimeScaleModalActive: true });
        };
        this.selectTimeScale = (e) => {
            this.setState({ selectedTimeScale: e.target.value });
        };
        this.submitTimeScale = () => {
            this.setState({ isTimeScaleModalActive: false });
            this.props.changeTimeScale({ timeScale: this.state.selectedTimeScale });
        };
        this.handleClickUpdOkButton = () => {
            this.props.closeNotice();
        };
        this.closeTimeScaleModal = () => {
            // this.setState({ isTimeScaleModalActive: false, selectedTimeScale: this.state.selectedTimeScale }); // 元コード
            // this.setState((prevState) => ({ isTimeScaleModalActive: false, selectedTimeScale: prevState.selectedTimeScale })); // 推測される用途コード
            this.setState({ isTimeScaleModalActive: false });
        };
        this.timeChartRef = react_1.default.createRef();
        this.detailRef = react_1.default.createRef();
        this.myScheduleHeaderRef = react_1.default.createRef();
        this.fisRowRef = react_1.default.createRef();
        this.timer = undefined;
        this.state = {
            selectedTimeScale: props.myScheduleState.timeScale,
            isTimeScaleModalActive: false,
            myScheduleContainerHeight: 0,
        };
        this.openTimeScaleModal = this.openTimeScaleModal.bind(this);
        this.closeTimeScaleModal = this.closeTimeScaleModal.bind(this);
        this.selectTimeScale = this.selectTimeScale.bind(this);
        this.submitTimeScale = this.submitTimeScale.bind(this);
        this.handleClickUpdOkButton = this.handleClickUpdOkButton.bind(this);
        this.addEventHandlerOrientationAndResize = this.addEventHandlerOrientationAndResize.bind(this);
        this.onResize = this.onResize.bind(this);
        this.childResizeFuncs = this.childResizeFuncs.bind(this);
    }
    componentDidMount() {
        this.props.getMyScheduleInfo();
        this.addEventHandlerOrientationAndResize();
        this.resizeMyScheduleContainerHeight();
    }
    componentDidUpdate(prevProps) {
        if (this.props.myScheduleState.fisState !== prevProps.myScheduleState.fisState) {
            this.resizeMyScheduleContainerHeight();
        }
        if (this.props.myScheduleState.timeChartState !== prevProps.myScheduleState.timeChartState) {
            if (this.timeChartRef.current) {
                void this.timeChartRef.current.timeChartSettings();
            }
        }
    }
    componentWillUnmount() {
        window.onresize = null;
        window.removeEventListener("orientationchange", this.onResize);
        this.timer = undefined;
    }
    render() {
        const { changeActiveDetailTask, updateMyScheduleInfo, myScheduleState, jobAuth } = this.props;
        const { timeScale, fisState, isShowContent, timeChartState, selectedTaskId } = myScheduleState;
        const { isTimeScaleModalActive } = this.state;
        const workStartTime = (0, dayjs_1.default)(timeChartState.workStartTime);
        const workEndTime = (0, dayjs_1.default)(timeChartState.workEndTime);
        const { isPc } = storage_1.storage;
        return (react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(MyScheduleHeader, { isPc: isPc, ref: this.myScheduleHeaderRef },
                react_1.default.createElement(LeftSideHeader, null,
                    react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(icon_clock_skeleton_svg_component_1.default, null),
                        `${timeScale}h`,
                        react_1.default.createElement(SelectAirPortIcon, { onClick: this.openTimeScaleModal }))),
                react_1.default.createElement(RightSideHeader, null, timeChartState.workStartTime && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("div", null, "My Schedule:\u3000"),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(SdlDateDDMMM, null, workStartTime.format("DDMMM").toLocaleUpperCase()),
                        react_1.default.createElement("span", null, workStartTime.format("HH:mm")),
                        "L",
                        react_1.default.createElement(SdlConcat, null, "-"),
                        (0, dayjs_1.default)(workEndTime).hour(0).minute(0).diff((0, dayjs_1.default)(workStartTime).hour(0).minute(0), "days") > 0 && (react_1.default.createElement(SdlDateDDMMM, null, workEndTime.format("DDMMM").toLocaleUpperCase())),
                        react_1.default.createElement("span", null, workEndTime.format("HH:mm")),
                        "L"))))),
            react_1.default.createElement(MyScheduleContainer, null,
                react_1.default.createElement(MyScheduleContents, { height: this.state.myScheduleContainerHeight },
                    isShowContent && (react_1.default.createElement(MyScheduleTimeChart_1.default, { ref: this.timeChartRef, timeScale: timeScale, timeChartState: timeChartState, selectedTaskId: selectedTaskId, isShowFis: !!myScheduleState.fisState, changeActiveDetailTask: changeActiveDetailTask, contentHeight: this.state.myScheduleContainerHeight })),
                    isShowContent && (react_1.default.createElement(MyScheduleDetail_1.default, { ref: this.detailRef, jobAuth: jobAuth, selectedTaskId: myScheduleState.selectedTaskId, timeChartState: myScheduleState.timeChartState, dtlSchedule: myScheduleState.dtlSchedule, changeActiveDetailTask: changeActiveDetailTask, updateMyScheduleInfo: updateMyScheduleInfo, isUpdate: myScheduleState.isUpdate, isShowFis: !!myScheduleState.fisState }))),
                fisState && fisState.fisRow && (react_1.default.createElement(FisWrapper, { ref: this.fisRowRef },
                    react_1.default.createElement(MyScheduleFis_1.default, { jobAuth: this.props.jobAuth, headerInfo: this.props.headerInfo, fis: fisState })))),
            react_1.default.createElement(react_modal_1.default, { isOpen: timeChartState.changeNoticeStatus, style: updConfirmPopupStyles },
                react_1.default.createElement(UpdTextTitle, null, "Your Assign has been changed!"),
                react_1.default.createElement(UpdTextsWrapper, null, timeChartState.changeNotice),
                react_1.default.createElement(UpdateButtonWrapper, null,
                    react_1.default.createElement(PrimaryButton_1.default, { text: "OK", type: "button", onClick: this.handleClickUpdOkButton }))),
            react_1.default.createElement(react_modal_1.default, { isOpen: isTimeScaleModalActive, style: customModalStyles, onRequestClose: this.closeTimeScaleModal },
                react_1.default.createElement(TimeScaleWrapper, null,
                    react_1.default.createElement(TimeScaleTitle, null, "Time Scale"),
                    react_1.default.createElement(TimeScaleRadioButtons, null,
                        !isPc && (react_1.default.createElement(RadioButtonWrapper, null,
                            react_1.default.createElement(RadioButton, { id: "4h", value: "4", type: "radio", onChange: this.selectTimeScale, checked: this.state.selectedTimeScale === "4" }),
                            react_1.default.createElement("label", { htmlFor: "4h" }, "4h"))),
                        react_1.default.createElement(RadioButtonWrapper, null,
                            react_1.default.createElement(RadioButton, { id: "8h", value: "8", type: "radio", onChange: this.selectTimeScale, checked: this.state.selectedTimeScale === "8" }),
                            react_1.default.createElement("label", { htmlFor: "8h" }, "8h")),
                        isPc && (react_1.default.createElement(RadioButtonWrapper, null,
                            react_1.default.createElement(RadioButton, { id: "12h", value: "12", type: "radio", onChange: this.selectTimeScale, checked: this.state.selectedTimeScale === "12" }),
                            react_1.default.createElement("label", { htmlFor: "12h" }, "12h")))),
                    react_1.default.createElement(SubmitWrapper, { isPc: isPc },
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Search", type: "button", onClick: this.submitTimeScale }))))));
    }
}
const customModalStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        position: "absolute",
        width: "190px",
        height: "152px",
        padding: "9px 12px",
        top: "130px",
        left: "10px",
        right: "unset",
        bottom: "unset",
        margin: "auto",
        borderRadius: "1px",
        border: "1px solid rgb(204, 204, 204)",
        background: "#fff",
        overflow: "auto",
        outline: "none",
    },
};
const updConfirmPopupStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        position: "absolute",
        width: "400px",
        height: "420px",
        padding: "9px 12px",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        margin: "auto",
        borderRadius: "1px",
        border: "1px solid rgb(204, 204, 204)",
        background: "#fff",
        overflow: "auto",
        outline: "none",
        fontFamily: "Verdana",
        fontWeight: 500,
    },
};
const Wrapper = styled_components_1.default.div `
  background-color: #eeeeee;
`;
const MyScheduleContainer = styled_components_1.default.div `
  background-color: #c9d3d0;
  width: 100%;
  max-width: ${commonConst_1.Const.MAX_WIDTH};
  margin: auto;
  overflow: hidden;
`;
const MyScheduleHeader = styled_components_1.default.div `
  display: flex;
  height: 32px;
  background: linear-gradient(to right, rgb(53, 186, 184), rgb(39, 153, 198));

  > div {
    ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
  }
`;
const SelectAirPortIcon = styled_components_1.default.img.attrs({
    src: icon_fis_select_target_popup_svg_1.default,
}) `
  cursor: pointer;
  width: 19px;
  height: 13px;
  margin-bottom: 5px;
`;
const LeftSideHeader = styled_components_1.default.div `
  min-width: 640px;
  ${media_1.default.greaterThan("desktopL") `
    min-width: calc(640px + 160px);
  `};
  ${media_1.default.lessThan("desktopL") `
    min-width: 543px;
  `};
  ${media_1.default.lessThan("desktopM") `
    min-width: 369px;
  `};
  border-bottom: none;
  padding-bottom: 2px;
  padding-left: 11px;
  border-right: none;
  color: #fff;
  background: transparent;
  display: flex;
  align-items: flex-end;
  font-size: 20px;
  svg {
    width: 15px;
    margin-right: 2px;
    margin-bottom: 5px;
  }
`;
const RightSideHeader = styled_components_1.default.div `
  width: 100%;
  background: transparent;
  color: ${(props) => props.theme.color.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  > div:first-child {
    font-size: 20px;
  }
`;
const SdlDateDDMMM = styled_components_1.default.span `
  margin-right: 5px;
`;
const SdlConcat = styled_components_1.default.span `
  margin: 0px 5px 0px 5px;
`;
const TimeScaleWrapper = styled_components_1.default.form `
  display: flex;
  flex-direction: column;
`;
const TimeScaleTitle = styled_components_1.default.div `
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 19px;
`;
const TimeScaleRadioButtons = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 20px;
`;
const RadioButtonWrapper = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const RadioButton = styled_components_1.default.input `
  margin-right: 5px;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #346181;
  background: #fff;
  position: relative;
  outline: none;
  &:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
  &:checked {
    border-color: #346181;
    background: #346181;
  }
  &:checked:before {
    content: "";
    display: block;
    position: absolute;
    top: 6px;
    left: 6px;
    width: 10.5px;
    height: 10.5px;
    background: #fff;
    border-radius: 50%;
  }
`;
const SubmitWrapper = styled_components_1.default.div `
  width: 100px;
  align-self: center;
  button {
    ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
  }
`;
const MyScheduleContents = styled_components_1.default.div `
  position: relative;
  display: flex;
  overflow: hidden;
  height: ${({ height }) => `${height || 0}px`};
`;
const visibleFisContent = (0, styled_components_1.keyframes) `
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;
const FisWrapper = styled_components_1.default.div `
  box-shadow: 0 0px 10px 0 rgba(0, 0, 0, 0.3);
  animation: ${visibleFisContent} 0.6s ease-in-out;
  animation-direction: reverse;
`;
const UpdTextsWrapper = styled_components_1.default.p `
  width: 100%;
  height: 260px;
  overflow-y: auto;
  padding: 0px 50px 0px 50px;
  white-space: pre-wrap;
  line-height: 1.2;
  -webkit-overflow-scrolling: touch;
`;
const UpdateButtonWrapper = styled_components_1.default.div `
  width: 100px;
  height: 44px;
  margin: 0 auto;
`;
const UpdTextTitle = styled_components_1.default.div `
  text-align: center;
  padding: 20px;
`;
exports.default = MySchedule;
//# sourceMappingURL=MySchedule.js.map