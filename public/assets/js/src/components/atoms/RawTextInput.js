"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const commonConst_1 = require("../../lib/commonConst");
class RawTextInput extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.refInput = props.inputRef || react_1.default.createRef();
    }
    // eslint-disable-next-line react/no-unused-class-component-methods
    focus() {
        if (this.refInput.current) {
            this.refInput.current.focus();
        }
    }
    render() {
        const { onEnter, terminalCat, disabled, isShadowOnFocus, isShowingShadow, isDirty, isForceError, ...inputProps } = this.props;
        return (react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(Input, { ref: this.refInput, ...inputProps, terminalCat: terminalCat, disabled: disabled, isShadowOnFocus: isShadowOnFocus, isShowingShadow: isShowingShadow, isDirty: isDirty, isError: isForceError, onKeyDown: (e) => {
                    if (onEnter && e.keyCode === 13) {
                        onEnter();
                    }
                }, onBlur: () => {
                    if (this.refInput.current && this.props.isFixedFocus) {
                        this.refInput.current.focus(); /* 他にフォーカスさせない */
                    }
                } })));
    }
}
const Wrapper = styled_components_1.default.div `
  position: relative;
`;
const Input = styled_components_1.default.input `
  ${({ terminalCat }) => (terminalCat !== commonConst_1.Const.TerminalCat.pc ? "padding-top: 5px;" : "")}
  padding-left: 6px;
  padding-right: 6px;
  height: 44px;
  color: ${(props) => (props.isDirty ? props.theme.color.text.CHANGED : "#000")};
  font-size: 20px;
  border: 1px solid ${(props) => (props.isError ? props.theme.color.border.ERROR : props.theme.color.border.PRIMARY)};
  border-radius: 0;
  width: 148px;
  appearance: none;
  -webkit-appearance: none;
  ::placeholder {
    ${({ terminalCat }) => (terminalCat !== commonConst_1.Const.TerminalCat.pc ? "padding-top: 3px;" : "")};
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ${(props) => {
    if (props.disabled) {
        return (0, styled_components_1.css) `
        opacity: 1;
        background-color: #fff;
        cursor: text;
      `;
    }
    return null;
}}
  ${(props) => {
    if (props.isShowingShadow) {
        return (0, styled_components_1.css) `
        border: 1px solid #2e85c8;
        box-shadow: 0px 0px 7px #60b7fa;
      `;
    }
    if (props.isShadowOnFocus) {
        return (0, styled_components_1.css) `
        &:focus {
          border: 1px solid #2e85c8;
          box-shadow: 0px 0px 7px #60b7fa;
        }
      `;
    }
    return null;
}};
`;
exports.default = RawTextInput;
//# sourceMappingURL=RawTextInput.js.map