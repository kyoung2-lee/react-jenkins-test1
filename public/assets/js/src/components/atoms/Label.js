"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Label = ({ children, isPc }) => (react_1.default.createElement(DefaultLabel, { isPc: isPc }, children));
const DefaultLabel = styled_components_1.default.div `
  height: 14px;
  padding-top: ${({ isPc }) => (isPc ? "1px" : "2px")};
  background: #595857;
  border-radius: 3px;
  min-width: 28px;
  font-size: 10px;
  color: #fff;
  text-align: center;
`;
exports.default = Label;
//# sourceMappingURL=Label.js.map