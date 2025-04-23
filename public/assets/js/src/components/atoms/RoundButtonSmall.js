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
const RoundButtonSmall = (props) => react_1.default.createElement(Button, { type: "button", ...props, isPc: storage_1.storage.isPc });
const Button = styled_components_1.default.button `
  width: 24px;
  height: 24px;
  padding: 0; /* iPad, iPhoneの崩れ防止 */
  outline: none;
  border: 0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${(props) => props.theme.color.button.PRIMARY};
  ${({ disabled, isPc }) => disabled
    ? "opacity: 0.6;"
    : (0, styled_components_1.css) `
          cursor: pointer;
          ${isPc
        ? (0, styled_components_1.css) `
                &:hover,
                &:focus {
                  background: ${(props) => props.theme.color.button.PRIMARY_HOVER};
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
                &:active {
                  background: ${(props) => props.theme.color.button.PRIMARY_ACTIVE};
                }
              `
        : (0, styled_components_1.css) `
                &:active {
                  background: ${(props) => props.theme.color.button.PRIMARY_ACTIVE};
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
              `}
        `}
  svg {
    width: 12px;
    height: 12px;
  }
`;
exports.default = RoundButtonSmall;
//# sourceMappingURL=RoundButtonSmall.js.map