"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
class StatusButton extends react_1.default.Component {
    render() {
        const { width, height, marginLeft, tabIndex, input, option: { value, label }, id = "", } = this.props;
        const { name } = input;
        const inputValue = input.value;
        const checked = inputValue === value;
        return (react_1.default.createElement(Wrapper, { checked: checked, width: width, height: height, marginLeft: marginLeft },
            react_1.default.createElement("label", { htmlFor: id },
                react_1.default.createElement("input", { id: id, type: "radio", name: name, tabIndex: tabIndex, value: value, onClick: () => this.props.onClickInput(input, value) }),
                react_1.default.createElement("span", null, label))));
    }
}
const Wrapper = styled_components_1.default.div `
  ${({ width }) => (width ? `width: ${width};` : "")}
  ${({ height }) => (height ? `height: ${height};` : "")}
  margin-left: ${({ marginLeft }) => marginLeft || "0px"};
  background-color: ${({ checked }) => (checked ? "#E6B422" : "#EEEEEE")};
  color: ${({ checked }) => (checked ? "#FFFFFF" : "#346181")};
  border-radius: 4px;
  padding: 0;
  border: 1px solid #346181;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  > label {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 12px;
    cursor: pointer;
    > input {
      position: absolute;
      clip: rect(0, 0, 0, 0);
    }
    > span {
      font-size: 18px;
    }
  }
`;
exports.default = StatusButton;
//# sourceMappingURL=StatusButton.js.map