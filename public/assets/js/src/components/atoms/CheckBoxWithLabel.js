"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const CheckBoxInput_1 = __importDefault(require("./CheckBoxInput"));
const CheckBoxWithLabel = (props) => {
    const { text, id, ...rest } = props;
    return (react_1.default.createElement(CheckBoxDiv, null,
        react_1.default.createElement(CheckBoxLabel, { htmlFor: id }, text),
        react_1.default.createElement(CheckBoxInput_1.default, { id: id, ...rest })));
};
const CheckBoxDiv = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;

  input {
    margin-top: 1px;
  }
  input:disabled {
    opacity: 0.6;
    background: #ebebe4;
    border: 1px solid #346181;
  }
`;
const CheckBoxLabel = styled_components_1.default.label `
  font-size: 12px;
  color: ${(props) => props.theme.color.DEFAULT_FONT_COLOR};
`;
exports.default = CheckBoxWithLabel;
//# sourceMappingURL=CheckBoxWithLabel.js.map