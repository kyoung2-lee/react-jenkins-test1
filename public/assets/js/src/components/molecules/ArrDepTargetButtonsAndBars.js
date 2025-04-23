"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const icon_arrow_down_bold_svg_1 = __importDefault(require("../../assets/images/icon/icon-arrow_down_bold.svg"));
const ArrDepBars_1 = __importDefault(require("../atoms/ArrDepBars"));
const ArrDepTargetButtons_1 = __importDefault(require("../atoms/ArrDepTargetButtons"));
const ArrDepTargetButtonsAndBars = (props) => (react_1.default.createElement(Wrapper, null,
    react_1.default.createElement(ArrDepTargetButtons_1.default, { fixed: props.targetButtonsFixed, selectedTarget: props.selectedTarget, onClickTarget: props.onClickTarget }),
    react_1.default.createElement(ArrDepBars_1.default, { selectedTarget: props.selectedTarget, arr: props.arr, dep: props.dep }),
    props.selectedTarget ? (react_1.default.createElement(IconWrapper, null,
        react_1.default.createElement(DownArrowIcon, null))) : null));
const Wrapper = styled_components_1.default.div `
  height: 132px;
`;
const IconWrapper = styled_components_1.default.div `
  text-align: center;
  margin-bottom: -6px;
`;
const DownArrowIcon = styled_components_1.default.img.attrs({ src: icon_arrow_down_bold_svg_1.default }) `
  position: relative;
  top: -4px;
  width: 18px;
  height: 18px;
  fill: ${({ theme }) => theme.color.DEFAULT_FONT_COLOR};
`;
exports.default = ArrDepTargetButtonsAndBars;
//# sourceMappingURL=ArrDepTargetButtonsAndBars.js.map