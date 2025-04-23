"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const KeyTopWhite_1 = __importDefault(require("../atoms/KeyTopWhite"));
const icon_del_svg_component_1 = __importDefault(require("../../assets/images/icon/icon-del.svg?component"));
const KeyboardInputNumber = ({ onDel, onNumKeyDown }) => (react_1.default.createElement(Column, null,
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTopWhite_1.default, { input: () => onNumKeyDown("7") }, "7")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTopWhite_1.default, { input: () => onNumKeyDown("8") }, "8")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTopWhite_1.default, { input: () => onNumKeyDown("9") }, "9")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTopWhite_1.default, { input: () => onNumKeyDown("4") }, "4")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTopWhite_1.default, { input: () => onNumKeyDown("5") }, "5")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTopWhite_1.default, { input: () => onNumKeyDown("6") }, "6")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTopWhite_1.default, { input: () => onNumKeyDown("1") }, "1")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTopWhite_1.default, { input: () => onNumKeyDown("2") }, "2")),
    react_1.default.createElement(KeyCol, null,
        react_1.default.createElement(KeyTopWhite_1.default, { input: () => onNumKeyDown("3") }, "3")),
    react_1.default.createElement(KeyBottomCol, null),
    react_1.default.createElement(KeyBottomCol, null,
        react_1.default.createElement(KeyTopWhite_1.default, { input: () => onNumKeyDown("0") }, "0")),
    react_1.default.createElement(KeyBottomCol, null,
        react_1.default.createElement(DelKey, { input: onDel },
            react_1.default.createElement(icon_del_svg_component_1.default, null)))));
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
const DelKey = (0, styled_components_1.default)(KeyTopWhite_1.default) `
  svg {
    width: 30px;
    .a {
      fill: ${(props) => props.theme.color.button.PRIMARY};
    }
    .b {
      fill: #fff;
    }
  }
`;
exports.default = KeyboardInputNumber;
//# sourceMappingURL=KeyboardInputNumber2.js.map