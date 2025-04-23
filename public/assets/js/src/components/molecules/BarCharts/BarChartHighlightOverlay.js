"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIGHLIGHT_OVERLAY_INDEX = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const BarChartModel_1 = require("./BarChartModel");
exports.HIGHLIGHT_OVERLAY_INDEX = 90000;
class BarChartHighlightOverlay extends react_1.default.Component {
    highlightingBarChart() {
        const { fisRowsGroupBySpot, barChartSearch } = this.props;
        let rowIndex = -1;
        let extFisRow;
        fisRowsGroupBySpot.sortedSpots.forEach(({ spotNo: key }, i) => {
            const matchChart = fisRowsGroupBySpot.groupedfisRowsBySpot[key]
                ? fisRowsGroupBySpot.groupedfisRowsBySpot[key].find((chart) => barChartSearch.scrollToScheduleSeq === chart.arrDepCtrl.seq)
                : undefined;
            if (matchChart) {
                rowIndex = i;
                extFisRow = matchChart;
            }
        });
        return { rowIndex, extFisRow };
    }
    render() {
        const { rowIndex, extFisRow } = this.highlightingBarChart();
        if (!extFisRow)
            return react_1.default.createElement("div", null);
        const { cellWidth, cellHeight } = this.props;
        let { width, left } = (0, BarChartModel_1.getBarChartLayout)({ extFisRow, cellWidth, cellHeight, rowIndex });
        const { top } = (0, BarChartModel_1.getBarChartLayout)({ extFisRow, cellWidth, cellHeight, rowIndex });
        const padding = cellWidth * 0.3;
        width += padding;
        const minWidth = 250; // 台形が小さくて内容がはみ出る場合があるので、固定値で考慮してます。
        left -= padding / 2; // 左右にpaddingするため1/2ずらす
        return react_1.default.createElement(Overlay, { size: { height: cellHeight, width: minWidth > width ? minWidth : width }, position: { left, top } });
    }
}
const Overlay = styled_components_1.default.div `
  width: ${(props) => props.size.width}px;
  height: ${(props) => props.size.height}px;
  top: ${(props) => props.position.top}px;
  left: ${(props) => props.position.left}px;
  position: absolute;
  border: 122364px solid black;
  margin-top: -122364px;
  margin-left: -122364px;
  opacity: 0.5;
  box-sizing: content-box;
  z-index: ${() => exports.HIGHLIGHT_OVERLAY_INDEX};
`;
exports.default = BarChartHighlightOverlay;
//# sourceMappingURL=BarChartHighlightOverlay.js.map