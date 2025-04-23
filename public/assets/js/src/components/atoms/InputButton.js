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
const InputButton = (props) => {
    const { tabIndex, text, type, onClick, disabled } = props;
    return (react_1.default.createElement(Button, { tabIndex: tabIndex, type: type, onClick: onClick, disabled: disabled, isPc: storage_1.storage.isPc }, text));
};
const Button = styled_components_1.default.button `
  min-width: 44px;
  min-height: 40px;
  background: #fff;
  color: ${(props) => props.theme.color.PRIMARY};
  border-radius: 4px;
  padding: 4px;
  border: solid 1px ${(props) => props.theme.color.border.PRIMARY};
  font-size: 13px;

  ${({ disabled, isPc }) => disabled
    ? (0, styled_components_1.css) `
          opacity: 0.6;
        `
    : (0, styled_components_1.css) `
          cursor: pointer;
          ${isPc
        ? (0, styled_components_1.css) `
                &:hover,
                &:focus {
                  background: #eeeeee;
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
                &:active {
                  background: #e2e2e2;
                }
              `
        : (0, styled_components_1.css) `
                &:active {
                  background: #e2e2e2;
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
              `}
        `};
`;
exports.default = InputButton;
//# sourceMappingURL=InputButton.js.map