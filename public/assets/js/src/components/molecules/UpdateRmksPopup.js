"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const commonUtil_1 = require("../../lib/commonUtil");
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
class UpdateRmksPopup extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.rmksTextPopup = react_1.default.createRef();
        this.handleRmksText = (e) => {
            this.setState({ rmksText: (0, commonUtil_1.removePictograph)(e.target.value) });
        };
        this.onSubmit = () => {
            const { isSubmitable, update } = this.props;
            const { rmksText } = this.state;
            if (isSubmitable) {
                update(rmksText);
            }
        };
        this.state = { rmksText: props.initialRmksText };
        this.handleRmksText = this.handleRmksText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if ((this.props.isOpen && !nextProps.isOpen) || nextProps.initialRmksText !== this.props.initialRmksText) {
            this.setState({ rmksText: nextProps.initialRmksText });
        }
    }
    render() {
        const { isOpen, width, top, left, isSubmitable, placeholder, onClose } = this.props;
        const { rmksText } = this.state;
        const submitButtonHeight = 13 + 44 + 13;
        const textAreaHeight = isSubmitable ? 125 : 125 + submitButtonHeight;
        const modalHeight = 125 + submitButtonHeight + 2;
        return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, style: customStyles(width, modalHeight, top, left), onRequestClose: () => onClose(rmksText), onAfterOpen: () => {
                const currentTextArea = this.rmksTextPopup.current;
                const rmksTextLength = rmksText ? rmksText.length : 0;
                if (currentTextArea) {
                    currentTextArea.value = rmksText;
                }
                // リマークス欄クリック時に、textareaを一番下まで下げる
                if (currentTextArea && isSubmitable) {
                    currentTextArea.setSelectionRange(rmksTextLength, rmksTextLength);
                    currentTextArea.focus();
                    currentTextArea.scrollTop = currentTextArea.scrollHeight;
                }
            } },
            react_1.default.createElement("div", null,
                react_1.default.createElement(TextArea, { ref: this.rmksTextPopup, maxLength: 2048, height: textAreaHeight, onChange: this.handleRmksText, readOnly: !isSubmitable, placeholder: placeholder }),
                isSubmitable && (react_1.default.createElement(ButtonContainer, null,
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Update", onClick: this.onSubmit }))))));
    }
}
react_modal_1.default.setAppElement("#content");
const customStyles = (width, height, top, left) => ({
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 970000000 /* reapop(999999999)の2つ下 */,
    },
    content: {
        position: "absolute",
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
        padding: 0,
        borderRadius: 0,
    },
});
const ButtonContainer = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px 0;
  background: #f6f6f6;
  button {
    width: 100px;
  }
`;
const TextArea = styled_components_1.default.textarea `
  resize: none;
  width: 100%;
  height: ${(props) => `${props.height}px`};
  padding: 4px 6px;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 1px;
  display: block;
  word-wrap: break-word;
  &::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
`;
exports.default = UpdateRmksPopup;
//# sourceMappingURL=UpdateRmksPopup.js.map