"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const storage_1 = require("../../lib/storage");
const icon_close_svg_1 = __importDefault(require("../../assets/images/icon/icon-close.svg"));
const CloseButton = (props) => (react_1.default.createElement(Button, { type: "button", tabIndex: props.tabIndex, className: props.className, onClick: props.onClick, isIphone: storage_1.storage.isIphone, isIpad: storage_1.storage.isIpad, style: props.style },
    react_1.default.createElement("img", { src: icon_close_svg_1.default, alt: "" })));
const Button = styled_components_1.default.button `
  position: absolute;
  background: initial;
  top: 0;
  right: 0;
  height: ${({ isIphone }) => (isIphone ? "40px" : "34px")};
  width: ${({ isIphone }) => (isIphone ? "40px" : "34px")};
  padding: ${({ isIphone }) => (isIphone ? "10px" : "7px")};
  margin: ${({ isIphone }) => (isIphone ? "0" : "3px")};
  outline: none;
  border: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  > img {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
  }
`;
exports.default = CloseButton;
//# sourceMappingURL=CloseButton.js.map