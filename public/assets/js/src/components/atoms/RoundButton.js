"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const RoundButton = (props) => react_1.default.createElement(Button, { ...props });
const Button = styled_components_1.default.button `
  ${({ scale }) => (scale ? `transform: scale(${scale})` : undefined)};
  width: 60px;
  height: 60px;
  outline: none;
  background: ${(props) => props.theme.color.button.PRIMARY};
  border: 2px solid ${(props) => props.theme.color.PRIMARY_BASE};
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
    color: ${(props) => props.theme.color.PRIMARY_BASE};
  }
`;
exports.default = RoundButton;
//# sourceMappingURL=RoundButton.js.map