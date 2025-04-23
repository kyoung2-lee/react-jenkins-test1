"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const ExcessTimeContainer_1 = __importDefault(require("../../atoms/ExcessTimeContainer"));
const storage_1 = require("../../../lib/storage");
class BarChartGndTimeBar extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.start = () => (0, dayjs_1.default)(this.props.extFisRow.xtaLcl).second(0).millisecond(0);
        this.end = () => (0, dayjs_1.default)(this.props.extFisRow.xtdLcl).second(0).millisecond(0);
    }
    // 地上作業終了の目安時間を取得する
    gndTimeEnd() {
        const { extFisRow } = this.props;
        const gndHours = extFisRow.arrDepCtrl.gndTime.substring(0, 2);
        const gndMinutes = extFisRow.arrDepCtrl.gndTime.substring(2);
        const endDateTime = this.start().add(Number(gndHours), "h").add(Number(gndMinutes), "m");
        const maxDateTime = this.end().add(9, "h").add(59, "m");
        return endDateTime.isBefore(maxDateTime) ? endDateTime : maxDateTime;
    }
    // 下バーの長さを取得する
    gndTimeBarWidth() {
        const { barChartWidth } = this.props;
        return (barChartWidth * ((this.gndTimeEnd().unix() - this.start().unix()) / (this.end().unix() - this.start().unix())) +
            2 /* 開始位置がずれているので＋２pxする */);
    }
    render() {
        const { className, extFisRow } = this.props;
        if (!(extFisRow.xtaLcl && extFisRow.xtdLcl))
            return null;
        if (!extFisRow.arrDepCtrl.gndTime)
            return null;
        return (
        // 重なり検知のためにtransform系のCSSプロパティは使わない
        react_1.default.createElement(BarArea, { className: className, isPc: storage_1.storage.isPc },
            react_1.default.createElement(Bar, { width: this.gndTimeBarWidth(), isOver: extFisRow.dgtShortFlg, isPc: storage_1.storage.isPc }),
            extFisRow.dgtShortFlg && (react_1.default.createElement(Time, { isPc: storage_1.storage.isPc },
                react_1.default.createElement(ExcessTimeContainer_1.default, { time: extFisRow.estGndTime })))));
    }
}
exports.default = BarChartGndTimeBar;
const BarArea = styled_components_1.default.div `
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  height: 6px;
`;
const Bar = styled_components_1.default.div `
  width: ${(props) => props.width}px;
  height: 100%;
  background: ${(props) => (props.isOver ? "#E554A6" : "#35BAB8")};
`;
const Time = styled_components_1.default.div `
  margin-left: 5px;
  font-size: 16px;
  ${(props) => (props.isPc ? "" : "font-weight: bold;")}
`;
//# sourceMappingURL=BarChartGndTimeBar.js.map