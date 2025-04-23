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
const icon_reload_png_1 = __importDefault(require("../../assets/images/icon/icon-reload.png"));
const icon_reload_disable_svg_1 = __importDefault(require("../../assets/images/icon/icon-reload-disable.svg"));
const RoundButtonReload = (props) => {
    const { isFetching, disabled } = props;
    return (react_1.default.createElement(ReloadButton, { type: "button", ...props }, !disabled ? react_1.default.createElement(ReloadIcon, { isFetching: isFetching }) : react_1.default.createElement(DisabledReloadIcon, null)));
};
const ReloadButton = (0, styled_components_1.default)(RoundButton_1.default) `
  ${(props) => props.disabled
    ? (0, styled_components_1.css) `
          background: #c9d3d0;
          cursor: auto;
          border: none;
        `
    : (0, styled_components_1.css) `
          &:focus {
            background: ${props.theme.color.button.PRIMARY_HOVER};
          }
          &:hover {
            background: ${props.theme.color.button.PRIMARY_HOVER};
          }
          &:active {
            background: ${props.theme.color.button.PRIMARY_ACTIVE};
          }
        `};
`;
const spin = (0, styled_components_1.keyframes) `
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;
const ReloadIcon = styled_components_1.default.img.attrs({ src: icon_reload_png_1.default }) `
  width: 32.73px;
  height: 32.73px;
  ${(props) => props.isFetching
    ? (0, styled_components_1.css) `
          animation: ${spin} 2s linear infinite;
        `
    : ""};
`;
const DisabledReloadIcon = styled_components_1.default.img.attrs({
    src: icon_reload_disable_svg_1.default,
}) `
  width: 24px;
  height: 24px;
`;
exports.default = RoundButtonReload;
//# sourceMappingURL=RoundButtonReload.js.map