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
const styled_components_1 = __importStar(require("styled-components"));
const media_1 = __importDefault(require("../../../styles/media"));
const commonUtil_1 = require("../../../lib/commonUtil");
const icon_check_svg_component_1 = __importDefault(require("../../../assets/images/icon/icon-check.svg?component"));
class MyScheduleTaskCard extends react_1.default.PureComponent {
    render() {
        const { dtlSchedule, height, isSmallTask, doCheckAnimation } = this.props;
        const isFlightName = dtlSchedule.carrierCodeIata !== "" && dtlSchedule.fltNumber !== "" && dtlSchedule.originDateLocal !== "";
        return (react_1.default.createElement(Container, { height: height },
            react_1.default.createElement("div", null,
                react_1.default.createElement(CheckIconWrapper, null, (dtlSchedule.taskStartStatus || dtlSchedule.taskEndStatus) && (react_1.default.createElement(FadeCheckIcon, { isFinish: dtlSchedule.taskEndStatus, className: doCheckAnimation ? "doRoundAnimation" : "" },
                    react_1.default.createElement(StyledCheckIcon, { className: doCheckAnimation ? "doAnimation" : "" },
                        react_1.default.createElement(icon_check_svg_component_1.default, null))))),
                react_1.default.createElement(ContentWrapper, null,
                    react_1.default.createElement(FirstRow, { isSmallTask: isSmallTask },
                        react_1.default.createElement(TaskName, { title: dtlSchedule.taskName, isFlightName: isFlightName, isSmallTask: isSmallTask }, dtlSchedule.taskName),
                        isFlightName && (react_1.default.createElement("div", null,
                            dtlSchedule.carrierCodeIata,
                            (0, commonUtil_1.formatFltNo)(dtlSchedule.fltNumber),
                            "/",
                            dtlSchedule.originDateLocal.slice(-2)))),
                    react_1.default.createElement(SecondRow, null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, (0, dayjs_1.default)(dtlSchedule.taskStartTime).format("HHmm")),
                            react_1.default.createElement("span", null, " - "),
                            react_1.default.createElement("span", null, (0, dayjs_1.default)(dtlSchedule.taskEndTime).format("HHmm"))),
                        react_1.default.createElement("div", null,
                            dtlSchedule && dtlSchedule.gateNo && (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("span", null, "Gate"),
                                react_1.default.createElement("span", null, dtlSchedule.gateNo),
                                dtlSchedule.spotNo && react_1.default.createElement("span", null, "/"))),
                            dtlSchedule && dtlSchedule.spotNo && (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("span", null, "Spot"),
                                react_1.default.createElement("span", null, dtlSchedule.spotNo)))))))));
    }
}
const Container = styled_components_1.default.div `
  display: flex;
  align-items: center;
  height: ${({ height }) => (height ? `${height}px` : "100%")};

  > div {
    display: flex;
    width: 100%;
  }
`;
const ContentWrapper = styled_components_1.default.div `
  padding-right: 15px;
  width: 100%;
`;
const TaskName = styled_components_1.default.div `
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  ${({ isFlightName, isSmallTask }) => isFlightName
    ? (0, styled_components_1.css) `
          ${isSmallTask
        ? (0, styled_components_1.css) `
                width: 160px;
                ${media_1.default.greaterThan("desktopM") `width: 180px;`}
                ${media_1.default.greaterThan("desktopL") `width: 200px;`}
              `
        : (0, styled_components_1.css) `
                width: 170px;
                ${media_1.default.greaterThan("desktopM") `width: 200px;`}
                ${media_1.default.greaterThan("desktopL") `width: 260px;`}
              `};
        `
    : (0, styled_components_1.css) `
          ${isSmallTask
        ? (0, styled_components_1.css) `
                width: 270px;
                ${media_1.default.greaterThan("desktopM") `width: 325px;`}
              `
        : (0, styled_components_1.css) `
                width: 265px;
                ${media_1.default.greaterThan("desktopM") `width: 320px;`}
                ${media_1.default.greaterThan("desktopL") `width: 370px;`}
              `};
        `};
`;
const FirstRow = styled_components_1.default.div `
  font-size: 24px;
  ${media_1.default.lessThan("1365px") ` font-size: 20px;`} margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
`;
const SecondRow = styled_components_1.default.div `
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
const CheckAnimationKeyframes = (0, styled_components_1.keyframes) `
  0%   { transform: scale(1.0, 1.0) translate(0%, 0%); }
  15%  { transform: scale(0.9, 0.9) translate(0%, 5%); }
  30%  { transform: scale(1.3, 0.8) translate(0%, 10%); }
  50%  { transform: scale(0.8, 1.3) translate(0%, -10%); }
  70%  { transform: scale(1.1, 0.9) translate(0%, 5%); }
  100% { transform: scale(1.0, 1.0) translate(0%, 0%); }
`;
const CheckFadeAnimationkeyframes = (0, styled_components_1.keyframes) `
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
`;
const CheckIconWrapper = styled_components_1.default.div `
  width: 55px;
  ${media_1.default.greaterThan("desktopM") `width: 60px;`}
  ${media_1.default.greaterThan("desktopL") `width: 65px;`}
  height: 100%;
  display: flex;
  justify-content: center;
`;
const FadeCheckIcon = styled_components_1.default.div `
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
const StyledCheckIcon = styled_components_1.default.div `
  width: 32px;
  height: 32px;
  position: absolute;
  top: -2px;
  left: 0px;

  &.doAnimation {
    animation: ${CheckAnimationKeyframes} 0.3s linear 0s both;
  }
`;
exports.default = MyScheduleTaskCard;
//# sourceMappingURL=MyScheduleTaskCard.js.map