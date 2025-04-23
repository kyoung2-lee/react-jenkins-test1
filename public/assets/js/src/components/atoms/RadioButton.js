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
exports.RadioButtonStyled = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const RadioButton = (props) => {
    const { id, tabIndex, input, isShadowOnFocus, onClick, innerRef, autoFocus, disabled } = props;
    return (react_1.default.createElement(exports.RadioButtonStyled, { ref: innerRef, type: "radio", id: id, tabIndex: tabIndex, onClick: onClick, ...input, isShadowOnFocus: isShadowOnFocus, autoFocus: autoFocus, disabled: disabled }));
};
exports.RadioButtonStyled = styled_components_1.default.input `
  margin-right: 5px;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #346181;
  background: ${({ disabled }) => (disabled ? "#EBEBE4" : "#FFF")};
  position: relative;
  outline: none;
  ${({ disabled }) => (disabled ? "opacity: 0.6;" : "")}
  ${({ isShadowOnFocus }) => isShadowOnFocus
    ? (0, styled_components_1.css) `
          &:focus {
            border: 1px solid #2e85c8;
            box-shadow: 0px 0px 7px #60b7fa;
          }
        `
    : null}
  &:checked {
    border-color: #346181;
    background: #346181;
  }
  &:checked:before {
    content: "";
    display: block;
    position: absolute;
    top: 6px;
    left: 6px;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
  }
`;
exports.default = RadioButton;
//# sourceMappingURL=RadioButton.js.map