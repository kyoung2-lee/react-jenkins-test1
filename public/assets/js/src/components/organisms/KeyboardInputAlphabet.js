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
const KeyboardInputAlphabet = ({ clear, onSubmit, canSubmit, handle }) => (react_1.default.createElement("div", null,
    react_1.default.createElement(Column, null,
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("Q") }, "Q")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("W") }, "W")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("E") }, "E")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("R") }, "R")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("T") }, "T")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("Y") }, "Y")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("U") }, "U")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("I") }, "I")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("O") }, "O")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("P") }, "P"))),
    react_1.default.createElement(Column, null,
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("A") }, "A")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("S") }, "S")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("D") }, "D")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("F") }, "F")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("G") }, "G")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("H") }, "H")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("J") }, "J")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("K") }, "K")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("L") }, "L"))),
    react_1.default.createElement(Column, null,
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("Z") }, "Z")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("X") }, "X")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("C") }, "C")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("V") }, "V")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("B") }, "B")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("N") }, "N")),
        react_1.default.createElement(KeyAlphabetCol, null,
            react_1.default.createElement(KeyTop_1.default, { input: () => handle("M") }, "M"))),
    react_1.default.createElement(Column, null,
        react_1.default.createElement(KeyBottomCol, null,
            react_1.default.createElement(DelKey, { input: clear },
                react_1.default.createElement(icon_del_svg_component_1.default, null))),
        react_1.default.createElement(KeyBottomCol, null),
        react_1.default.createElement(KeyBottomCol, null, canSubmit ? react_1.default.createElement(GoKey, { input: onSubmit }, "Go") : react_1.default.createElement(GoKeyDisable, null, "Go")))));
const Column = styled_components_1.default.div `
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  &:last-child {
    justify-content: space-between;
  }
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
  background: #1075e7;
`;
const GoKeyDisable = (0, styled_components_1.default)(KeyTopExecutable_1.default) `
  font-size: 18px;
`;
const KeyAlphabetCol = styled_components_1.default.div `
  width: 10%;
  padding: 0px 2px 10px;
`;
exports.default = KeyboardInputAlphabet;
//# sourceMappingURL=KeyboardInputAlphabet.js.map