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
const commonUtil_1 = require("../../lib/commonUtil");
const TextInput = (props) => {
    const { id, className, type, input, width, height, placeholder, fontSizeOfPlaceholder, disabled = false, disabledSimpleColor = false, isShowEditedDeletedColor = false, maxLength, tabIndex, componentOnBlur = () => { }, 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    meta: { error, touched, submitFailed, dirty }, isForceDirty, isForceError, isShadowOnFocus, isShowEditedColor, showKeyboard, autoCapitalize, autoComplete, autoFocus, onKeyPress = () => { }, innerRef, displayValue, pattern, fontFamily, fontSize, fontWeight, handleInputChange, onBlur, onClick, onFocus, onKeyDown, } = props;
    return (react_1.default.createElement(Wrapper, { onClick: () => {
            if (!disabled && showKeyboard) {
                showKeyboard();
            }
        }, displayValue: displayValue, paramDisabled: disabled, disabledSimpleColor: disabledSimpleColor, isShowEditedColor: isShowEditedColor, isShowEditedDeletedColor: isShowEditedDeletedColor, dirty: isForceDirty !== null && isForceDirty !== void 0 ? isForceDirty : dirty },
        react_1.default.createElement(Text, { ref: innerRef, type: type || "text", id: id, className: className, ...input, autoCapitalize: autoCapitalize, autoComplete: autoComplete, autoFocus: autoFocus, width: width, height: height, placeholder: placeholder, fontSizeOfPlaceholder: fontSizeOfPlaceholder, disabled: disabled, paramDisabled: disabled, disabledSimpleColor: disabledSimpleColor, isShowEditedDeletedColor: isShowEditedDeletedColor, keyboard: !!showKeyboard, maxLength: maxLength, readOnly: disabled || !!showKeyboard, tabIndex: tabIndex, pattern: pattern, onBlur: (e) => {
                if (onBlur) {
                    onBlur(e);
                }
                const event = e;
                const value = (0, commonUtil_1.removePictograph)(event.target.value);
                event.target.value = value; // この処理は必ず行わないとChromeでオートコンプリート入力した際に自動で変化した背景色が元に戻らない
                if (event.target.value !== value) {
                    input.onChange(event);
                }
                componentOnBlur(event);
            }, onChange: (e) => {
                const event = e;
                if (maxLength && event.target.value.length > maxLength) {
                    event.target.value = event.target.value.slice(0, maxLength);
                }
                if (type === "number" && maxLength) {
                    if (event.target.value.length <= maxLength) {
                        input.onChange(event);
                    }
                }
                else {
                    input.onChange(event);
                }
                if (handleInputChange != null) {
                    handleInputChange(e);
                }
            }, onClick: onClick, onFocus: onFocus, onKeyDown: onKeyDown, isError: (!!error && touched && submitFailed) || (touched && !!isForceError), isShadowOnFocus: isShadowOnFocus, isShowEditedColor: isShowEditedColor, onKeyPress: onKeyPress, dirty: isForceDirty !== null && isForceDirty !== void 0 ? isForceDirty : dirty, inputValue: input.value, fontFamily: fontFamily, fontSize: fontSize, fontWeight: fontWeight })));
};
const Wrapper = styled_components_1.default.div `
  position: relative;
  ${({ displayValue, paramDisabled, disabledSimpleColor, isShowEditedDeletedColor, dirty, isShowEditedColor, theme }) => displayValue !== undefined
    ? (0, styled_components_1.css) `
           {
            opacity: ${paramDisabled && !disabledSimpleColor && !isShowEditedDeletedColor ? 0.6 : 1};
          }
          input {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
            cursor: ${paramDisabled ? "unset" : "text"};
          }
          &:before {
            content: "${displayValue}";
            position: absolute;
            color: ${isShowEditedColor ? (dirty ? theme.color.text.CHANGED : "#000") : "#000"};
            background-color: transparent;
            top: 50%;
            left: 8px;
            line-height: 20px;
            margin-top: -9px;
            width: 58px;
            pointer-events: none;
          }
        `
    : (0, styled_components_1.css) `
           {
            opacity: ${paramDisabled && !disabledSimpleColor && !isShowEditedDeletedColor ? 0.6 : 1};
          }
        `}
`;
const Text = styled_components_1.default.input `
  color: ${({ isShowEditedColor, dirty, theme }) => (isShowEditedColor ? (dirty ? theme.color.text.CHANGED : "#000") : "#000")};
  -webkit-text-fill-color: ${({ isShowEditedColor, dirty, theme }) => isShowEditedColor ? (dirty ? theme.color.text.CHANGED : "#000") : "#000"};
  background-color: ${({ paramDisabled, disabledSimpleColor, isShowEditedDeletedColor, isShowEditedColor, dirty, inputValue, theme }) => isShowEditedColor
    ? paramDisabled && !disabledSimpleColor
        ? isShowEditedDeletedColor && dirty && !inputValue
            ? theme.color.background.DELETED
            : "#EBEBE4"
        : dirty && !inputValue
            ? theme.color.background.DELETED
            : "#FFF"
    : paramDisabled
        ? "#EBEBE4"
        : "#FFF"};
  width: ${({ width }) => (typeof width === "number" ? `${width}px` : width)};
  height: ${({ height }) => (height ? (typeof height === "number" ? `${height}px` : height) : "44px")};
  line-height: normal; /* safariでテキストを上下中央にする */
  padding: 0 8px 0 6px;
  border: ${(props) => props.paramDisabled && props.disabledSimpleColor
    ? "1px solid #222222"
    : props.paramDisabled && props.isShowEditedDeletedColor
        ? "1px solid rgba(52, 97, 129, 0.6)"
        : props.isError
            ? `1px solid ${props.theme.color.border.ERROR}`
            : `1px solid ${props.theme.color.border.PRIMARY}`};
  border-radius: 1px;
  background-clip: padding-box;
  appearance: none;
  ${({ fontFamily }) => (fontFamily ? `font-family: ${fontFamily};` : "")}
  ${({ fontSize }) => (fontSize ? `font-size: ${fontSize}px;` : "")}
  ${({ fontWeight }) => (fontWeight ? `font-weight: ${fontWeight};` : "")}
  ${(props) => props.isShadowOnFocus
    ? (0, styled_components_1.css) `
          &:focus {
            border: 1px solid ${props.isError ? props.theme.color.border.ERROR : "#2e85c8"};
            box-shadow: 0px 0px 7px #60b7fa;
          }
        `
    : null}
  &::placeholder {
    color: ${({ theme }) => theme.color.PLACEHOLDER};
    -webkit-text-fill-color: ${({ theme }) => theme.color.PLACEHOLDER};
    overflow: visible;
    ${({ fontSizeOfPlaceholder }) => (fontSizeOfPlaceholder ? `font-size: ${fontSizeOfPlaceholder}px` : "")}
  }
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
exports.default = TextInput;
//# sourceMappingURL=TextInput.js.map