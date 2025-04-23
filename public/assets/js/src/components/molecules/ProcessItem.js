"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ProcessItem = (props) => {
    const { title, ...containerProps } = props;
    if (props.custom) {
        if (props.completed) {
            return react_1.default.createElement(CompletedCustomContainer, { ...containerProps }, title);
        }
        return react_1.default.createElement(WaitingCustomContainer, { ...containerProps }, title);
    }
    if (props.completed) {
        return react_1.default.createElement(CompletedContainer, { ...containerProps }, title);
    }
    if (props.current) {
        return react_1.default.createElement(CurrentContainer, { ...containerProps }, title);
    }
    return react_1.default.createElement(WaitingContainer, { ...containerProps }, title);
};
const WaitingContainer = styled_components_1.default.div `
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  font-size: 20px;

  color: #32bbe5;
  border: 1px solid #32bbe5;
  background-color: #fff;

  box-shadow: ${(props) => (props.disabled ? "none" : "2px 2px 4px rgba(0, 0, 0, 0.2)")};
  cursor: ${(props) => (props.disabled ? "inherit" : "pointer")};
  opacity: ${(props) => (props.disabled ? "0.8" : "1")};

  &:hover {
    opacity: 0.8;
  }
`;
const CompletedContainer = (0, styled_components_1.default)(WaitingContainer) `
  color: ${(props) => props.theme.color.DEFAULT_FONT_COLOR};
  border: 1px solid #fff;
  background-color: #c9d3d0;
`;
const CurrentContainer = (0, styled_components_1.default)(WaitingContainer) `
  color: #fff;
  border: 1px solid #fff;
  background-color: #32bbe5;
`;
const CompletedCustomContainer = (0, styled_components_1.default)(WaitingContainer) `
  color: ${(props) => props.theme.color.DEFAULT_FONT_COLOR};
  border: 1px solid #346181;
  background-color: #c9d3d0;
`;
const WaitingCustomContainer = (0, styled_components_1.default)(WaitingContainer) `
  color: ${(props) => props.theme.color.DEFAULT_FONT_COLOR};
  border: 1px solid #346181;
  background-color: #fff;
`;
exports.default = ProcessItem;
//# sourceMappingURL=ProcessItem.js.map