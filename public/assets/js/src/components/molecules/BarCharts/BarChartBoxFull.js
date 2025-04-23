"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasFltNo = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const selector_1 = require("../../organisms/BarChart/selector");
const BarChartGndTimeBar_1 = __importDefault(require("./BarChartGndTimeBar"));
const commonConst_1 = require("../../../lib/commonConst");
const storage_1 = require("../../../lib/storage");
const commonUtil_1 = require("../../../lib/commonUtil");
const BarChartSwitchTag_1 = __importDefault(require("../../atoms/BarChartSwitchTag"));
const BarChartStationOperationTaskButton_1 = __importDefault(require("../../atoms/BarChartStationOperationTaskButton"));
const BarChartShipButton_1 = __importDefault(require("../../atoms/BarChartShipButton"));
const BarChartSpecialStsLabel_1 = __importDefault(require("../../atoms/BarChartSpecialStsLabel"));
const FisFltStsLabel_1 = __importDefault(require("../../atoms/FisFltStsLabel"));
class BarChartBoxFullOnly extends react_1.default.PureComponent {
    render() {
        const { isPc, fillColor, extFisRow, groundWorkStatus, width, isOverlap, handleFlightDetailList, handleSwitchTag, handleFlightListModal, handleStationOperationTaskList, stationOperationTaskEnabled, flightDetailEnabled, flightListEnabled, isSpotChangeMode, isSelectedSpotNumber, clickBarOfSpotChangeMode, barText, } = this.props;
        const triangleWidth = commonConst_1.Const.BAR_CHART_TRIANGLE_WIDTH;
        const triangleHeight = commonConst_1.Const.BAR_CHART_TRIANGLE_HEIGHT;
        const clickable = isSpotChangeMode && (!!extFisRow.arr || !!extFisRow.dep);
        return (react_1.default.createElement(Wrapper, { clickable: clickable },
            react_1.default.createElement(ArrFlightStatus, null,
                react_1.default.createElement(FisFltStsLabel_1.default, { isPc: isPc, isDarkMode: false, isBarChart: true }, extFisRow.arrFisFltSts)),
            react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: `-5 0 ${width + triangleWidth * 2 + 10} ${triangleHeight + 10}`, style: { width: width + triangleWidth * 2 + 15, height: triangleHeight + 10, filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.4))" } },
                react_1.default.createElement("path", { className: "chartBody", d: `M 0 0 L ${triangleWidth} ${triangleHeight} L ${width + triangleWidth} ${triangleHeight} L ${width + triangleWidth * 2} 0 L 0 0`, stroke: "transparent", fill: fillColor, strokeWidth: "0", onClick: clickBarOfSpotChangeMode })),
            isSelectedSpotNumber ? (react_1.default.createElement(SpotChangeSelectedBoxSvg, { isActive: isSelectedSpotNumber, xmlns: "http://www.w3.org/2000/svg", viewBox: `-5 -2.5 ${width + triangleWidth * 2 + 10} ${triangleHeight + 10}`, style: { width: width + triangleWidth * 2 + 15, height: triangleHeight + 10 } },
                react_1.default.createElement("path", { className: "chartBody", d: `M 0 -3 L ${triangleWidth} ${triangleHeight} L ${width + triangleWidth} ${triangleHeight} L ${width + triangleWidth * 2} 0 L 0 0`, stroke: "#EA6512", strokeWidth: "5", fill: "rgba(234, 101, 18, 0.6)", onClick: clickBarOfSpotChangeMode }),
                react_1.default.createElement("text", { x: width / 2, y: triangleHeight / 2 + 10, fontSize: "30", fill: "#fff", style: { pointerEvents: "none" } }, barText))) : (react_1.default.createElement(react_1.default.Fragment, null)),
            react_1.default.createElement(ChartContentWrapper, null,
                react_1.default.createElement(ChartContent, { style: { minWidth: width }, isSpotChangeMode: isSpotChangeMode },
                    isOverlap && react_1.default.createElement(BarChartSwitchTag_1.default, { isPc: isPc, groundWorkStatus: groundWorkStatus, onClick: handleSwitchTag }),
                    react_1.default.createElement(ArrXTA, null,
                        ":",
                        (0, commonUtil_1.padding0)(`${(0, dayjs_1.default)(extFisRow.xtaLcl).minute()}`, 2)),
                    react_1.default.createElement(AirLineCodeContainer, null,
                        react_1.default.createElement(ModalTriggerButton, { style: { paddingLeft: 0 }, onClick: () => handleFlightDetailList(extFisRow, false), isBlack: groundWorkStatus !== selector_1.WorkStatus.done, disabled: !flightDetailEnabled },
                            react_1.default.createElement(AirLineCode, null, extFisRow.arrCasFltNo ? (react_1.default.createElement(exports.CasFltNo, { casFltNo: extFisRow.arrCasFltNo }, extFisRow.arrCasFltNo)) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("small", null, extFisRow.arrAlCd),
                                extFisRow.arrFltNo))),
                            react_1.default.createElement(BarChartSpecialStsLabel_1.default, { isPc: storage_1.storage.isPc }, extFisRow.arrSpecialStsDly))),
                    react_1.default.createElement(SquareContainer, null,
                        react_1.default.createElement(BarChartShipButton_1.default, { extFisRow: extFisRow, onClick: () => extFisRow.shipNo && handleFlightListModal(), disabled: extFisRow.shipNo ? !flightListEnabled : true }),
                        react_1.default.createElement(BarChartStationOperationTaskButton_1.default, { extFisRow: extFisRow, onClick: handleStationOperationTaskList, disabled: !stationOperationTaskEnabled })),
                    react_1.default.createElement(ModalTriggerButton, { style: { paddingRight: 0 }, isBlack: groundWorkStatus !== selector_1.WorkStatus.done, onClick: () => handleFlightDetailList(extFisRow, true), disabled: !flightDetailEnabled },
                        react_1.default.createElement(AirLineCode, { className: "chartBody" }, extFisRow.depCasFltNo ? (react_1.default.createElement(exports.CasFltNo, { casFltNo: extFisRow.depCasFltNo }, extFisRow.depCasFltNo)) : (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("small", null, extFisRow.depAlCd),
                            extFisRow.depFltNo))),
                        react_1.default.createElement(BarChartSpecialStsLabel_1.default, { isPc: storage_1.storage.isPc }, extFisRow.depSpecialStsDly)),
                    react_1.default.createElement(DepXTD, { width: width },
                        ":",
                        (0, commonUtil_1.padding0)(`${(0, dayjs_1.default)(extFisRow.xtdLcl).minute()}`, 2)))),
            react_1.default.createElement(DepFlightStatus, null,
                react_1.default.createElement(FisFltStsLabel_1.default, { isPc: isPc, isDarkMode: false, isBarChart: true }, extFisRow.depFisFltSts)),
            groundWorkStatus !== selector_1.WorkStatus.done && react_1.default.createElement(BarChartGndTimeBar_1.default, { className: "chartBody", extFisRow: extFisRow, barChartWidth: width })));
    }
}
exports.default = BarChartBoxFullOnly;
const Wrapper = styled_components_1.default.div `
  height: ${() => commonConst_1.Const.BAR_CHART_TRIANGLE_HEIGHT}px;
  background-color: transparent;
  position: relative;
  ${({ clickable }) => (clickable ? "pointer-events: none;" : "")}
  > svg {
    position: absolute;
    left: ${-commonConst_1.Const.BAR_CHART_TRIANGLE_WIDTH - 5}px;
    pointer-events: none;
    > path {
      ${({ clickable }) => (clickable ? "pointer-events: auto; cursor: pointer;" : "pointer-events: auto;")}
    }
  }
`;
const ArrFlightStatus = styled_components_1.default.div `
  position: absolute;
  top: -18px;
  left: -6px;
`;
const DepFlightStatus = styled_components_1.default.div `
  position: absolute;
  top: -18px;
  right: -10px;
`;
const ChartContentWrapper = styled_components_1.default.div `
  position: absolute;
  top: 0;
  margin-left: 0px;
`;
const ChartContent = styled_components_1.default.div `
  position: relative;
  height: 54px;
  padding-top: 6px;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  ${({ isSpotChangeMode }) => (isSpotChangeMode ? "pointer-events: none;" : "pointer-events: auto;")}
`;
const ArrXTA = styled_components_1.default.div `
  position: absolute;
  bottom: -20px;
  margin-left: 2px;
`;
const AirLineCodeContainer = styled_components_1.default.div `
  position: relative;
`;
const AirLineCode = styled_components_1.default.div `
  font-size: 20px;
  small {
    font-size: 16px;
  }
`;
const ModalTriggerButton = styled_components_1.default.button `
  ${({ disabled }) => (disabled ? "" : "cursor: pointer;")}
  background: none;
  border: none;
  text-align: left;
  color: ${(props) => (props.isBlack ? "#000000" : "#98AFBF")};
  padding-top: 3px;
`;
const SquareContainer = styled_components_1.default.div `
  display: flex;
  > div:first-child {
    margin-right: 10px;
  }
`;
const DepXTD = styled_components_1.default.div `
  position: absolute;
  bottom: -20px;
  margin-left: ${(props) => `calc(${props.width}px - 20px)`};
`;
const SpotChangeSelectedBoxSvg = styled_components_1.default.svg `
  ${(props) => (props.isActive ? "z-index: 5;" : "z-index: 0;")};
`;
exports.CasFltNo = styled_components_1.default.div `
  font-size: ${(props) => (props.casFltNo && props.casFltNo.length >= 6 ? "14px" : "18px")};
  ${(props) => (props.casFltNo && props.casFltNo.length >= 6 ? "word-break: break-all;" : "")};
  padding-top: 2px;
  line-height: 1;
`;
//# sourceMappingURL=BarChartBoxFull.js.map