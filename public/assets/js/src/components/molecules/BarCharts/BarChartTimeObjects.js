"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const lodash_times_1 = __importDefault(require("lodash.times"));
class BarChartTimeObjects extends react_1.default.PureComponent {
    render() {
        const { cellWidth, columnsCount, curfewTimeStartLcl, curfewTimeEndLcl } = this.props;
        // curfew部分を表示する位置を計算する
        const curfewPos = [];
        if (curfewTimeStartLcl && curfewTimeEndLcl) {
            const curfewStart = Number(curfewTimeStartLcl.substr(0, 2)) + Number(curfewTimeStartLcl.substr(2, 2)) / 60;
            const curfewEnd = Number(curfewTimeEndLcl.substr(0, 2)) + Number(curfewTimeEndLcl.substr(2, 2)) / 60;
            if (!Number.isNaN(curfewStart) && !Number.isNaN(curfewEnd)) {
                let dayStart = curfewStart > curfewEnd ? -1 : 0;
                let dayEnd = 0;
                do {
                    curfewPos.push({
                        startPx: (curfewStart + dayStart * 24) * cellWidth,
                        endPx: (curfewEnd + dayEnd * 24) * cellWidth,
                    });
                    dayStart += 1;
                    dayEnd += 1;
                } while (dayStart < 3);
            }
        }
        return (react_1.default.createElement(Container, null,
            (0, lodash_times_1.default)(columnsCount).map((index) => (react_1.default.createElement(Border, { key: `border_${index}`, positionX: cellWidth * (index + 1) }))),
            curfewPos.map((c, index) => (
            // eslint-disable-next-line react/no-array-index-key
            react_1.default.createElement(CurfewArea, { key: `curfew_${index}`, startPx: c.startPx, endPx: c.endPx })))));
    }
}
exports.default = BarChartTimeObjects;
const Container = styled_components_1.default.div `
  height: 100%;
  width: 100%;
  position: relative;
`;
const Border = styled_components_1.default.span `
  position: absolute;
  height: 100%;
  width: 0px;
  border-left: thin solid #e0e0e0; /* thinはブラウザの縮小zoomに対応 */
  left: ${({ positionX }) => positionX}px;
  top: 0;
`;
const CurfewArea = styled_components_1.default.span `
  position: absolute;
  height: 100%;
  width: ${({ startPx, endPx }) => endPx - startPx}px;
  background-color: #000;
  opacity: 0.3;
  left: ${({ startPx }) => startPx}px;
  top: 0;
`;
//# sourceMappingURL=BarChartTimeObjects.js.map