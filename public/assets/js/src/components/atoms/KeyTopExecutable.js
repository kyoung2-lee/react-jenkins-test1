"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const storage_1 = require("../../lib/storage");
const commonConst_1 = require("../../lib/commonConst");
const KeyTopExecutable = (props) => {
    const { input } = props;
    return react_1.default.createElement(KeyBottonExecutable, { onClick: () => input && input(), terminalCat: storage_1.storage.terminalCat, ...props });
};
const KeyBottonExecutable = styled_components_1.default.div `
  display: flex;
  padding: 2px 0 0 0;
  outline: none;
  cursor: pointer;
  height: 44px;
  width: 100%;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 5px;
  color: #222222;
  font-size: 28px;
  box-shadow: 2px 2px 4px #abb3bb;
  background-color: #ffffff;

  ${({ terminalCat }) => terminalCat === commonConst_1.Const.TerminalCat.pc
    ? `&:hover {
    opacity: 0.8;
  }`
    : ""}
`;
exports.default = KeyTopExecutable;
//# sourceMappingURL=KeyTopExecutable.js.map