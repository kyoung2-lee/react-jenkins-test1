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
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const RoundButton_1 = __importDefault(require("./RoundButton"));
const icon_cross_svg_component_1 = __importDefault(require("../../assets/images/icon/icon-cross.svg?component"));
const RoundButtonSpot = (props) => {
    const { onClick, disabled, ...otherProps } = props;
    return (react_1.default.createElement(SpotButtonBase, { onClick: !disabled ? onClick : undefined, disabled: disabled, ...otherProps },
        react_1.default.createElement("span", { className: "label" }, "SPOT"),
        react_1.default.createElement(CrossIcon, null)));
};
const SpotButtonBase = (0, styled_components_1.default)(RoundButton_1.default) `
  background-color: ${(props) => (props.isActiveColor ? "#e6b422" : props.theme.color.button.PRIMARY)};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  ${({ disabled, isActiveColor, theme }) => !disabled
    ? (0, styled_components_1.css) `
          cursor: pointer;
          &:hover,
          &:focus {
            background: ${isActiveColor ? "#dbab1f" : theme.color.button.PRIMARY_HOVER};
          }
          &:active {
            background: ${isActiveColor ? "#cea120" : theme.color.button.PRIMARY_ACTIVE};
          }
        `
    : undefined}
  .label {
    font-size: 14px;
    color: #fff;
    font-weight: normal;
    position: absolute;
    top: 10px;
  }
  svg {
    width: 27px;
    height: 27px;
  }
`;
const CrossIcon = (0, styled_components_1.default)(icon_cross_svg_component_1.default).attrs({ viewBox: "0 0 360 360" }) `
  fill: #fff;
  position: absolute;
  top: 24px;
`;
exports.default = RoundButtonSpot;
//# sourceMappingURL=RoundButtonSpot.js.map