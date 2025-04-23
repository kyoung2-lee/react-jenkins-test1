"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ExcessTime = (props) => (react_1.default.createElement(Container, null,
    react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "10", height: "13", viewBox: "-0.471 -1.5 9.529 11.5" },
        react_1.default.createElement("path", { d: "M5-8,9.526-.151H.469Z", transform: "translate(-0.469 8.003)", fill: "#e554a6" })),
    react_1.default.createElement("div", null, props.time)));
const Container = styled_components_1.default.div `
  display: inline-flex;
  align-items: center;
  color: #e554a6;

  svg {
    margin-right: 2px;
  }
`;
exports.default = ExcessTime;
//# sourceMappingURL=ExcessTimeContainer.js.map