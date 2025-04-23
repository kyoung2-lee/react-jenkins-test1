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
const storage_1 = require("../../lib/storage");
const PrimaryButton = (props) => {
    const { tabIndex, text, icon, type, onClick, disabled, className, width, height } = props;
    return (react_1.default.createElement(Button, { className: className, tabIndex: tabIndex, type: type, onClick: onClick, disabled: disabled, isPc: storage_1.storage.isPc, width: width, height: height },
        icon && icon,
        icon && react_1.default.createElement("div", { style: { width: "4px" } }),
        text));
};
const Button = styled_components_1.default.button `
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "44px"};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.color.button.PRIMARY};
  color: #fff;
  border-radius: 4px;
  padding: 0;
  border: 0;
  font-size: 20px;
  ${({ disabled, theme, isPc }) => disabled
    ? "opacity: 0.6;"
    : (0, styled_components_1.css) `
          cursor: pointer;
          ${isPc
        ? (0, styled_components_1.css) `
                &:hover,
                &:focus {
                  background: ${theme.color.button.PRIMARY_HOVER};
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
                &:active {
                  background: ${theme.color.button.PRIMARY_ACTIVE};
                }
              `
        : (0, styled_components_1.css) `
                &:active {
                  background: ${theme.color.button.PRIMARY_ACTIVE};
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
              `}
        `};
`;
exports.default = PrimaryButton;
//# sourceMappingURL=PrimaryButton.js.map