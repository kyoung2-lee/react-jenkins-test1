"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const uuid_1 = require("uuid");
const clip_white_svg_1 = __importDefault(require("../../assets/images/icon/clip_white.svg"));
const UploadFileButton = (props) => {
    const { disabled, onChange } = props;
    const id = (0, uuid_1.v4)();
    return (react_1.default.createElement(FileInputContainer, { htmlFor: id, disabled: disabled },
        react_1.default.createElement(ClipIcon, null),
        !disabled && react_1.default.createElement("input", { type: "file", id: id, multiple: true, onChange: onChange })));
};
const ClipIcon = styled_components_1.default.img.attrs({ src: clip_white_svg_1.default }) ``;
const FileInputContainer = styled_components_1.default.label `
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #346181;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

  input {
    position: absolute;
    opacity: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
  ${({ disabled, theme }) => disabled
    ? "opacity: 0.6;"
    : `
      cursor: pointer;
      &:hover {
        background: ${theme.color.button.PRIMARY_HOVER};
      }
      &:active {
        background: ${theme.color.button.PRIMARY_ACTIVE};
      }
  `};
`;
exports.default = UploadFileButton;
//# sourceMappingURL=UploadFileButton.js.map