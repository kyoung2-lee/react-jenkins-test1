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
class TextArea extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.refText = react_1.default.createRef();
        this.donePaste = false;
        this.handleOnChange = (event) => {
            const e = event;
            if (!this.refText.current)
                return;
            const { input, maxRows, maxRowLength, maxLength, maxLengthCRLFCheck } = this.props;
            const selectPos = this.refText.current.selectionStart;
            let needDiscardInput = false;
            if (maxRowLength || maxRows) {
                let values = e.target.value.split(/\n/);
                // コピー＆ペーストの処理
                if (this.donePaste) {
                    this.donePaste = false;
                    // 行毎の最大入力可能文字数で折り返す
                    if (maxRowLength) {
                        values = values.reduce((pre, cur) => {
                            let rowValue = cur;
                            while (maxRowLength < rowValue.length) {
                                pre.push(rowValue.slice(0, maxRowLength));
                                rowValue = rowValue.slice(maxRowLength);
                            }
                            pre.push(rowValue);
                            return pre;
                        }, []);
                    }
                    // 改行をCRLFに展開した文字列が最大文字数に収まるように切り詰める
                    if (maxLengthCRLFCheck && !!maxLength) {
                        values = values.reduce((pre, cur) => {
                            const preLength = (0, commonUtil_1.convertLineFeedCodeToCRLF)(`${pre.join("\n")}\n`).length;
                            if (preLength < maxLength) {
                                pre.push(cur.slice(0, Math.min(cur.length, maxLength - preLength)));
                            }
                            return pre;
                        }, []);
                    }
                    // 最大入力行数まで入力可能
                    if (maxRows && maxRows < values.length) {
                        values = values.slice(0, maxRows);
                    }
                    // 編集内容を反映
                    const newValue = values.join("\n");
                    e.target.value = newValue;
                    // 直接入力した場合の処理
                }
                else {
                    const existsOverRowLength = !!maxRowLength && !!values.find((v) => maxRowLength < v.length);
                    const existsOverMaxRows = !!maxRows && maxRows < values.length;
                    if (existsOverRowLength || existsOverMaxRows) {
                        needDiscardInput = true;
                    }
                }
            }
            // 最大文字数のチェックを改行コードをCRLFに変換したものに対し行う
            if (maxLengthCRLFCheck && !!maxLength && maxLength < (0, commonUtil_1.convertLineFeedCodeToCRLF)(e.target.value).length) {
                needDiscardInput = true;
            }
            if (needDiscardInput) {
                // 入力を無効にする
                e.target.value = input.value;
                input.onChange(e);
                // カーソル位置を元に戻す
                this.refText.current.selectionStart = selectPos - 1;
                this.refText.current.selectionEnd = selectPos - 1;
                return;
            }
            input.onChange(e);
        };
        this.handleOnPaste = (_e) => {
            this.donePaste = true;
        };
    }
    render() {
        const { id, input, width, height, maxWidth, minWidth, placeholder, disabled, onClick, maxLength, maxRowLength, readOnly, componentOnBlur = () => { }, 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        meta: { error, touched, submitFailed }, isForceError, isShadowOnFocus, } = this.props;
        return (react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(Text, { ref: this.refText, id: id, ...input, width: width, height: height, maxWidth: maxWidth, minWidth: minWidth, placeholder: placeholder, onClick: onClick, disabled: disabled, onChange: this.handleOnChange, onPaste: this.handleOnPaste, maxLength: maxLength, maxRowLength: maxRowLength, readOnly: readOnly, onBlur: (event) => {
                    const e = event;
                    e.target.value = (0, commonUtil_1.removePictograph)(e.target.value);
                    input.onChange(e);
                    componentOnBlur(e);
                }, isError: (!!error && touched && submitFailed) || (!!isForceError && touched), isShadowOnFocus: isShadowOnFocus })));
    }
}
const Wrapper = styled_components_1.default.div `
  position: relative;
`;
const Text = styled_components_1.default.textarea `
  background: ${({ disabled }) => (disabled ? "#EBEBE4" : "#FFF")};
  width: ${({ width }) => (typeof width === "number" ? `${width}px` : width)};
  height: ${({ height }) => (height ? (typeof height === "number" ? `${height}px` : height) : "44px")};
  max-width: ${({ maxWidth = "none" }) => (typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth)};
  min-width: ${({ minWidth = "none" }) => (typeof minWidth === "number" ? `${minWidth}px` : minWidth)};
  padding: 10px 6px;
  border: 1px solid ${(props) => (props.isError ? props.theme.color.border.ERROR : props.theme.color.border.PRIMARY)};
  border-radius: 1px;
  appearance: none;
  ${(props) => props.isShadowOnFocus
    ? (0, styled_components_1.css) `
          &:focus {
            border: 1px solid ${props.isError ? props.theme.color.border.ERROR : "#2e85c8"};
            box-shadow: 0px 0px 7px #60b7fa;
          }
        `
    : null}
  &::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
  ${({ disabled }) => (disabled ? "opacity: 0.6;" : "")};
  ${({ maxRowLength }) => maxRowLength
    ? `
    font-size: 16px;
    line-height: 1.2;
  `
    : ""}
`;
exports.default = TextArea;
//# sourceMappingURL=TextArea.js.map