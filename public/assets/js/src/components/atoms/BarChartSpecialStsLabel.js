"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const BarChartSpecialStsLabel = (props) => {
    const { isPc, children } = props;
    return children ? react_1.default.createElement(SpecialStsLabel, { isPc: isPc }, children) : null;
};
const SpecialStsLabel = styled_components_1.default.div `
  margin: auto;
  width: fit-content;
  padding: 0.15em 0.4em 0em;
  font-size: ${({ isPc }) => (isPc ? "13px" : "14px")};
  color: #fff;
  background: rgb(57, 65, 72);
  border-radius: 3px;
`;
exports.default = BarChartSpecialStsLabel;
//# sourceMappingURL=BarChartSpecialStsLabel.js.map