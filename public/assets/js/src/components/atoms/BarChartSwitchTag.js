"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const selector_1 = require("../organisms/BarChart/selector");
const BarChartSwitchTag = (props) => {
    const { isPc, groundWorkStatus, onClick } = props;
    const tagColor = groundWorkStatus === selector_1.WorkStatus.doing ? "#53C5B9" : groundWorkStatus === selector_1.WorkStatus.done ? "#C7C7C7" : "#B7CECC";
    const tagShadeColor = groundWorkStatus === selector_1.WorkStatus.doing ? "#419A91" : groundWorkStatus === selector_1.WorkStatus.done ? "#9B9B9B" : "#8DA19F";
    return (react_1.default.createElement(BarChartSwitchTagComponent, { isPc: isPc, onClick: onClick, tagColor: tagColor, tagShadeColor: tagShadeColor }, "\u25BC"));
};
const BarChartSwitchTagComponent = styled_components_1.default.div `
  position: absolute;
  cursor: pointer;
  pointer-events: auto;
  top: -19px;
  left: 35px;
  width: 40px;
  height: 22px;
  padding-top: ${(props) => (props.isPc ? "0" : "2px")};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.tagColor};
  color: #fff;
  font-size: 10px;
  font-weight: 100;
  &:after {
    position: absolute;
    content: "";
    top: 0;
    right: -4px;
    border: none;
    border-bottom: solid 19px ${(props) => props.tagShadeColor};
    border-right: solid 4px transparent;
  }
`;
exports.default = BarChartSwitchTag;
//# sourceMappingURL=BarChartSwitchTag.js.map