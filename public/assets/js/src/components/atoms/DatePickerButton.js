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
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_datepicker_1 = __importDefault(require("react-datepicker"));
require("react-datepicker/dist/react-datepicker.css");
const icon_calender_svg_1 = __importDefault(require("../../assets/images/icon/icon-calender.svg"));
class DatePickerButton extends react_1.Component {
    render() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line react/no-unstable-nested-components, react/prop-types
        const CustomInput = (0, react_1.forwardRef)(({ onClick }, _ref) => (
        // eslint-disable-next-line react/no-this-in-sfc, @typescript-eslint/no-unsafe-assignment
        react_1.default.createElement(Button, { type: "button", tabIndex: this.props.tabIndex, onClick: onClick, size: this.props.size },
            react_1.default.createElement("img", { src: icon_calender_svg_1.default, alt: "" }))));
        return (react_1.default.createElement(DatePickerWrapper, { style: this.props.style },
            react_1.default.createElement(react_datepicker_1.default, { selected: this.props.selected, onChange: this.props.onChange, customInput: react_1.default.createElement(CustomInput, null), minDate: this.props.minDate, maxDate: this.props.maxDate, startOpen: this.props.startOpen })));
    }
}
const DatePickerWrapper = styled_components_1.default.div `
  .react-datepicker-popper {
    transform-origin: left top;
    transform: translate3d(26px, 26px, 0px) scale(1.15) !important;
  }
  .react-datepicker__triangle {
    left: 66px !important;
    transform: translate(113px, 0px) !important;
  }
  .react-datepicker {
    font-family: ${({ theme }) => theme.color.DEFAULT_FONT_FAMILY};
    font-size: 16px;
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    font-size: 16px;
  }
  .react-datepicker__header {
    border-bottom: none;
  }
  .react-datepicker__navigation-icon {
    &::before {
      border-color: ${({ theme }) => theme.color.button.PRIMARY};
    }
    &:hover::before {
      border-color: ${({ theme }) => theme.color.button.PRIMARY_HOVER};
    }
  }
  .react-datepicker__day {
    color: ${({ theme }) => theme.color.PRIMARY};
  }
  .react-datepicker__day--disabled {
    color: #ccc;
  }
  .react-datepicker__day--selected {
    background-color: #e6b422; // 基本色
    opacity: 1;
    color: #fff;
    &.react-datepicker__day--disabled {
      background-color: #e9ca6e;
    }
    &:hover {
      background-color: #dbaa18;
    }
    &:hover.react-datepicker__day--disabled {
      background-color: #e9ca6e;
    }
  }
  .react-datepicker__day--today:not(.react-datepicker__day--selected) {
    border-radius: 0.3em;
    font-weight: unset;
    background-color: ${({ theme }) => theme.color.button.PRIMARY};
    opacity: 0.4;
    color: #fff;
    &:hover:not(.react-datepicker__day--disabled) {
      background-color: ${({ theme }) => theme.color.button.PRIMARY};
      opacity: 0.5;
    }
  }
  .react-datepicker__day--keyboard-selected:not(.react-datepicker__day--today) {
    background-color: unset;
    &:hover {
      background-color: unset;
    }
  }
`;
const Button = styled_components_1.default.button `
  padding: 0;
  width: ${({ size }) => `${size || "26"}px`};
  height: ${({ size }) => `${size || "26"}px`};
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
  > img {
    width: 100%;
    height: 100%;
  }
`;
exports.default = DatePickerButton;
//# sourceMappingURL=DatePickerButton.js.map