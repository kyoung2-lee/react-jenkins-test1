"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const storage_1 = require("../../lib/storage");
class SecondaryButton extends react_1.default.Component {
    render() {
        const { tabIndex, text, icon, type, onClick, disabled } = this.props;
        return (react_1.default.createElement(Button, { tabIndex: tabIndex, type: type, onClick: onClick, disabled: disabled, isPc: storage_1.storage.isPc },
            icon,
            text));
    }
}
const Button = styled_components_1.default.button `
  width: 100%;
  background: ${(props) => props.theme.color.button.SECONDARY};
  height: 44px;
  color: ${(props) => props.theme.color.PRIMARY};
  border-radius: 4px;
  padding: 0;
  border: solid 2px ${(props) => props.theme.color.PRIMARY};
  font-size: 20px;

  ${({ disabled, theme, isPc }) => disabled
    ? "opacity: 0.6;"
    : `
      cursor: pointer;
      ${isPc
        ? `
        &:hover, &:focus {
          background: ${theme.color.button.SECONDARY_HOVER};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
        }
        &:active {
          background: ${theme.color.button.SECONDARY_ACTIVE};
        }
      `
        : `
        &:active {
          background: ${theme.color.button.SECONDARY_ACTIVE};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
        }
      `}
  `};

  svg {
    width: 10px;
    height: 10px;
    margin-right: 4px;
    path {
      fill: ${(props) => props.theme.color.WHITE};
    }
  }
`;
exports.default = SecondaryButton;
//# sourceMappingURL=SecondaryButton.js.map