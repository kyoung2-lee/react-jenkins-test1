"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const UpdateStatusLabel = (props) => react_1.default.createElement(StatusLabel, { status: props.status }, props.status);
const StatusLabel = styled_components_1.default.div `
  display: ${({ status }) => (status ? "block" : "none")};
  width: 66px;
  height: 24px;
  padding: 5px 0 !important;
  font-size: 12px;
  font-weight: bold;
  line-height: 1.3;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  background-color: ${({ status, theme }) => status === "Edited" ? "#E6B422" : status === "Updated" || status === "Skipped" ? "#76D100" : theme.color.text.CHANGED};
  border-radius: 8px;
  box-sizing: border-box;
`;
exports.default = UpdateStatusLabel;
//# sourceMappingURL=UpdateStatusLabel.js.map