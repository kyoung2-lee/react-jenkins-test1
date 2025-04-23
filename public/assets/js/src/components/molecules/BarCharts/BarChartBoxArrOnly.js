"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const selector_1 = require("../../organisms/BarChart/selector");
const BarChartSwitchTag_1 = __importDefault(require("../../atoms/BarChartSwitchTag"));
const BarChartShipButton_1 = __importDefault(require("../../atoms/BarChartShipButton"));
const BarChartSpecialStsLabel_1 = __importDefault(require("../../atoms/BarChartSpecialStsLabel"));
const icon_cross_svg_1 = __importDefault(require("../../../assets/images/icon/icon-cross.svg"));
const FisFltStsLabel_1 = __importDefault(require("../../atoms/FisFltStsLabel"));
const BarChartBoxFull_1 = require("./BarChartBoxFull");
const commonConst_1 = require("../../../lib/commonConst");
const storage_1 = require("../../../lib/storage");
const commonUtil_1 = require("../../../lib/commonUtil");
class BarChartBoxArrOnly extends react_1.default.PureComponent {
    render() {
        const { isPc, fillColor, extFisRow, groundWorkStatus, width, isOverlap, handleFlightDetailList, handleSwitchTag, handleFlightListModal, flightDetailEnabled, flightListEnabled, isSpotChangeMode, isSelectedSpotNumber, clickBarOfSpotChangeMode, barText, } = this.props;
        const triangleWidth = commonConst_1.Const.BAR_CHART_TRIANGLE_WIDTH;
        const triangleHeight = commonConst_1.Const.BAR_CHART_TRIANGLE_HEIGHT;
        let wave = "";
        if (extFisRow.depNextCat === -1) {
            // エラーフラグ（ギザギザ）
            const waveWidth = commonConst_1.Const.BAR_CHART_TRIANGLE_HEIGHT / 12;
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
        return (react_1.default.createElement(Wrapper, { clickable: clickable },
            react_1.default.createElement(ArrFlightStatus, null,
                react_1.default.createElement(FisFltStsLabel_1.default, { isPc: isPc, isDarkMode: false, isBarChart: true }, extFisRow.arrFisFltSts)),
            react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: `-5 0 ${width + triangleWidth + 10} ${triangleHeight + 10}`, style: { width: width + triangleWidth + 15, height: triangleHeight + 10, filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.4))" } },
                react_1.default.createElement("path", { className: "chartBody", d: `M 0 0 L ${triangleWidth} ${triangleHeight} L ${width + triangleWidth} ${triangleHeight} ${wave} L ${width + triangleWidth} 0 L 0 0`, stroke: "transparent", fill: fillColor, strokeWidth: "0", onClick: clickBarOfSpotChangeMode })),
            isSelectedSpotNumber ? (react_1.default.createElement(SpotChangeSelectedBoxSvg, { isActive: isSelectedSpotNumber, xmlns: "http://www.w3.org/2000/svg", viewBox: `-5 -2.5 ${width + triangleWidth + 10} ${triangleHeight + 10}`, style: { width: width + triangleWidth + 15, height: triangleHeight + 10, filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.4))" } },
                react_1.default.createElement("path", { className: "chartBody", d: `M 0 -3 L ${triangleWidth} ${triangleHeight} L ${width + triangleWidth} ${triangleHeight} ${wave} L ${width + triangleWidth} 0 L 0 0`, stroke: "#EA6512", strokeWidth: "5", fill: "rgba(234, 101, 18, 0.6)", onClick: clickBarOfSpotChangeMode }),
                react_1.default.createElement("text", { x: width / 2, y: triangleHeight / 2 + 10, fontSize: "30", fill: "#fff", style: { pointerEvents: "none" } }, barText))) : (react_1.default.createElement(react_1.default.Fragment, null, " ")),
            react_1.default.createElement(ChartContentWrapper, null,
                react_1.default.createElement(ChartContent, { style: { minWidth: width }, isSpotChangeMode: isSpotChangeMode },
                    isOverlap && react_1.default.createElement(BarChartSwitchTag_1.default, { isPc: isPc, groundWorkStatus: groundWorkStatus, onClick: handleSwitchTag }),
                    react_1.default.createElement(ArrXTA, null,
                        ":",
                        (0, commonUtil_1.padding0)(`${(0, dayjs_1.default)(extFisRow.xtaLcl).minute()}`, 2)),
                    react_1.default.createElement(AirLineCodeContainer, null,
                        react_1.default.createElement(ModalTriggerButton, { style: { paddingLeft: 0 }, onClick: () => handleFlightDetailList(extFisRow, false), isBlack: groundWorkStatus !== selector_1.WorkStatus.done, disabled: !flightDetailEnabled },
                            react_1.default.createElement(AirLineCode, null, extFisRow.arrCasFltNo ? (react_1.default.createElement(BarChartBoxFull_1.CasFltNo, { casFltNo: extFisRow.arrCasFltNo }, extFisRow.arrCasFltNo)) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("small", null, extFisRow.arrAlCd),
                                extFisRow.arrFltNo))),
                            react_1.default.createElement(BarChartSpecialStsLabel_1.default, { isPc: storage_1.storage.isPc }, extFisRow.arrSpecialStsDly))),
                    react_1.default.createElement(SquareContainer, null,
                        react_1.default.createElement(BarChartShipButton_1.default, { extFisRow: extFisRow, onClick: () => extFisRow.shipNo && handleFlightListModal(), disabled: extFisRow.shipNo ? !flightListEnabled : true })),
                    extFisRow.depNextCat > 0 && (react_1.default.createElement(ShipNextAlCdArea, { isBlack: groundWorkStatus !== selector_1.WorkStatus.done },
                        extFisRow.depNextCat === 1 && react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faArrowRight, style: { height: 18, width: "0.875em" } }),
                        extFisRow.depNextCat === 2 && react_1.default.createElement(CrossIcon, null),
                        react_1.default.createElement(AirLineCode, { className: "chartBody" }, extFisRow.depNextCasFltNo ? (react_1.default.createElement(BarChartBoxFull_1.CasFltNo, { casFltNo: extFisRow.depNextCasFltNo }, extFisRow.depNextCasFltNo)) : (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("small", null, extFisRow.depNextAlCd),
                            extFisRow.depNextFltNo)))))))));
    }
}
exports.default = BarChartBoxArrOnly;
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
const ChartContentWrapper = styled_components_1.default.div `
  position: absolute;
  top: 0;
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
const ShipNextAlCdArea = styled_components_1.default.div `
  background: none;
  border: none;
  margin-top: 5px;
  text-align: left;
  color: ${(props) => (props.isBlack ? "#000000" : "#98AFBF")};
  line-height: 0.9;
`;
const ModalTriggerButton = styled_components_1.default.button `
  ${({ disabled }) => (disabled ? "" : "cursor: pointer;")}
  cursor: pointer;
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
const SpotChangeSelectedBoxSvg = styled_components_1.default.svg `
  ${(props) => (props.isActive ? "z-index: 5;" : "z-index: 0;")};
`;
const CrossIcon = styled_components_1.default.img.attrs({ src: icon_cross_svg_1.default }) `
  width: 20px;
  height: 18px;
`;
//# sourceMappingURL=BarChartBoxArrOnly.js.map