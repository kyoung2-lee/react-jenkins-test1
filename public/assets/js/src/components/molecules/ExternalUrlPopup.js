"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
class ExternalUrlPopup extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onSubmit = () => {
            const { onClose } = this.props;
            onClose();
        };
        this.onSubmit = this.onSubmit.bind(this);
    }
    render() {
        const { isOpen, url } = this.props;
        return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, style: customStyles },
            react_1.default.createElement(Frame, null,
                react_1.default.createElement(Content, { src: url })),
            react_1.default.createElement(Footer, null,
                react_1.default.createElement(PrimaryButton_1.default, { text: "Close", onClick: this.onSubmit }))));
    }
}
react_modal_1.default.setAppElement("#content");
const customStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999999, // 最大値
    },
    content: {
        position: "static",
        width: "100%",
        height: "100%",
    },
};
const Frame = styled_components_1.default.div `
  width: 100%;
  height: calc(100vh - 84px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid #c9d3d0;
`;
const Content = styled_components_1.default.iframe `
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;
const Footer = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
`;
exports.default = ExternalUrlPopup;
//# sourceMappingURL=ExternalUrlPopup.js.map