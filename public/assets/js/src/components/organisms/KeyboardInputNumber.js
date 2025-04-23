"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const KeyTop_1 = __importDefault(require("../atoms/KeyTop"));
const icon_del_svg_component_1 = __importDefault(require("../../assets/images/icon/icon-del.svg?component"));
const KeyTopExecutable_1 = __importDefault(require("../atoms/KeyTopExecutable"));
const storage_1 = require("../../lib/storage");
const KeyboardInputNumber = ({ clear, onSubmit, canSubmit, handle }) => (react_1.default.createElement(Column, null,
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTop_1.default, { input: () => handle("7") }, "7")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTop_1.default, { input: () => handle("8") }, "8")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTop_1.default, { input: () => handle("9") }, "9")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTop_1.default, { input: () => handle("4") }, "4")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTop_1.default, { input: () => handle("5") }, "5")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTop_1.default, { input: () => handle("6") }, "6")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTop_1.default, { input: () => handle("1") }, "1")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTop_1.default, { input: () => handle("2") }, "2")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTop_1.default, { input: () => handle("3") }, "3")),
    react_1.default.createElement(KeyBottomCol, null,
        react_1.default.createElement(DelKey, { input: clear },
            react_1.default.createElement(icon_del_svg_component_1.default, null))),
    react_1.default.createElement(KeyBottomCol, null,
        react_1.default.createElement(KeyTop_1.default, { input: () => handle("0") }, "0")),
    react_1.default.createElement(KeyBottomCol, null, canSubmit ? (react_1.default.createElement(GoKey, { input: onSubmit, isPc: storage_1.storage.isPc }, "Go")) : (react_1.default.createElement(GoKeyDisable, { isPc: storage_1.storage.isPc }, "Go")))));
const Column = styled_components_1.default.div `
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
const KeyCol = styled_components_1.default.div `
  width: 108px;
  padding-bottom: 10px;
`;
const KeyBottomCol = styled_components_1.default.div `
  width: 108px;
`;
const DelKey = (0, styled_components_1.default)(KeyTop_1.default) `
  color: #222222;
  background: #abb3bb;

  svg {
    width: 30px;
    .a {
      fill: none;
    }
    .b,
    .d {
      fill: #222;
    }
    .c,
    .d {
      stroke: none;
    }
  }
`;
const GoKey = (0, styled_components_1.default)(KeyTopExecutable_1.default) `
  color: #ffffff;
  font-size: 18px;
  ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
  background: #1075e7;
`;
const GoKeyDisable = (0, styled_components_1.default)(KeyTopExecutable_1.default) `
  font-size: 18px;
  ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
`;
exports.default = KeyboardInputNumber;
//# sourceMappingURL=KeyboardInputNumber.js.map