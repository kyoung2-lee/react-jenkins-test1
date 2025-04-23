"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
class BarChartCurrentTimeBorder extends react_1.default.Component {
    render() {
        if (this.props.position < 0) {
            return "";
        }
        return react_1.default.createElement(Border, { left: this.props.position });
    }
}
exports.default = BarChartCurrentTimeBorder;
const Border = styled_components_1.default.div `
  position: absolute;
  top: 0;
  z-index: 99999;
  bottom: 0;
  left: ${({ left }) => left}px;
  width: 0px;
  border-left: thin solid #b8261f; /* thinはブラウザの縮小zoomに対応 */
`;
//# sourceMappingURL=BarChartCurrentTimeBorder.js.map