"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const soalaMessages_1 = require("../../../lib/soalaMessages");
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const notifications_1 = require("../../../lib/notifications");
class BarChartUpdateRmksPopup extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.rmksTextRef = react_1.default.createRef();
        this.onSubmit = () => {
            const { isSubmitable, update } = this.props;
            const { rmksText } = this.state;
            if (isSubmitable) {
                update(rmksText);
            }
        };
        this.handleRmksText = (e) => {
            if (this.props.initialRmksText === e.target.value) {
                this.setState({ isEdited: false });
            }
            else {
                this.setState({ isEdited: true });
            }
            this.setState({ rmksText: e.target.value });
        };
        this.modalConfirm = () => {
            const { isEdited } = this.state;
            if (isEdited) {
                notifications_1.NotificationCreator.create({
                    dispatch: this.props.dispatch,
                    message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: () => this.modalClose() }),
                });
            }
            else {
                this.modalClose();
            }
        };
        this.state = {
            rmksText: props.initialRmksText,
            isEdited: false,
        };
        this.handleRmksText = this.handleRmksText.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.modalConfirm = this.modalConfirm.bind(this);
        this.modalClose = this.modalClose.bind(this);
    }
    // UNSAFE_componentWillReceiveProps(nextProps: Props) {
    //   if ((this.props.isOpen && !nextProps.isOpen) || nextProps.initialRmksText !== this.props.initialRmksText) {
    //     this.setState({ rmksText: nextProps.initialRmksText });
    //     this.setState({ isEdited: false });
    //   }
    // }
    componentDidUpdate(prevProps) {
        if ((prevProps.isOpen && !this.props.isOpen) || this.props.initialRmksText !== prevProps.initialRmksText) {
            this.setState({ rmksText: this.props.initialRmksText });
            this.setState({ isEdited: false });
        }
    }
    modalClose() {
        this.setState({ isEdited: false });
        this.props.onClose();
    }
    render() {
        const { isOpen, left, initialSpotNo, isSubmitable, placeholder } = this.props;
        const { rmksText } = this.state;
        const headerHeight = 40;
        const submitButtonHeight = 70;
        const modalHeight = isSubmitable ? 328 : 328 - submitButtonHeight + 25;
        const modalWidth = 375;
        const modalTop = (window.innerHeight - modalHeight) / 2;
        const spotNoDisplay = initialSpotNo || "XXX";
        return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, style: customStyles(modalWidth, modalHeight, modalTop, left), onRequestClose: this.modalConfirm, onAfterOpen: () => {
                const currentTextArea = this.rmksTextRef.current;
                if (currentTextArea) {
                    currentTextArea.value = rmksText;
                }
                // リマークス欄クリック時に、textareaを一番下まで下げる
                if (currentTextArea && isSubmitable) {
                    const rmksTextLength = rmksText ? rmksText.length : 0;
                    currentTextArea.setSelectionRange(rmksTextLength, rmksTextLength);
                    currentTextArea.scrollTop = currentTextArea.scrollHeight;
                    currentTextArea.focus();
                }
            } },
            react_1.default.createElement(Header, { className: "handle", width: modalWidth, height: headerHeight },
                react_1.default.createElement(Flex, { alignItems: "baseline" },
                    react_1.default.createElement(TitleLabel, null, "SPOT"),
                    react_1.default.createElement(TitleSpotNo, null, spotNoDisplay))),
            react_1.default.createElement(BodyDiv, null,
                react_1.default.createElement(TextArea, { ref: this.rmksTextRef, maxLength: 200, onChange: this.handleRmksText, isEdited: this.state.isEdited, readOnly: !isSubmitable, placeholder: placeholder }),
                isSubmitable && (react_1.default.createElement(ButtonContainer, null,
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Update", onClick: this.onSubmit, disabled: !this.state.isEdited }))))));
    }
}
react_modal_1.default.setAppElement("#content");
const Header = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  width: ${(props) => `${props.width}px`};
  min-height: ${(props) => `${props.height}px`};
  height: ${(props) => `${props.height}px`};
`;
const Flex = styled_components_1.default.div `
  display: flex;
  align-items: ${(props) => props.alignItems || "center"};
`;
const TitleLabel = styled_components_1.default.h1 `
  color: ${(props) => props.theme.color.WHITE};
  margin: 0;
  padding-right: 8px;
  font-size: 12px;
`;
const TitleSpotNo = styled_components_1.default.h2 `
  color: ${(props) => props.theme.color.WHITE};
  margin: 0;
  font-size: 20px;
`;
const customStyles = (width, height, top, left) => ({
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 970000000 /* reapop(999999999)の2つ下 */,
    },
    content: {
        background: " #f6f6f6",
        border: "none",
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
const BodyDiv = styled_components_1.default.div `
  padding: 24px 23px 0px 24px;
`;
const TextArea = styled_components_1.default.textarea `
  font-size: 14px;
  color: ${({ isEdited, theme }) => (isEdited ? theme.color.text.CHANGED : "#000")};
  resize: none;
  justify-content: center;
  width: 100%;
  height: 184px;
  margin-bottom: 5px;
  padding: 7px 7px;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 1px;
  display: block;
  word-wrap: break-word;
  &::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
`;
exports.default = BarChartUpdateRmksPopup;
//# sourceMappingURL=BarChartUpdateRmksPopup.js.map