"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
class ErrorPopup extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onSubmit = () => {
            const { retry } = this.props;
            retry();
        };
        this.onSubmit = this.onSubmit.bind(this);
        // eslint-disable-next-line react/no-unused-state
        this.state = { time: "" };
    }
    render() {
        const { isError } = this.props;
        return (react_1.default.createElement(react_modal_1.default, { isOpen: isError, style: customStyles },
            react_1.default.createElement("div", null,
                react_1.default.createElement(Header, null,
                    react_1.default.createElement("div", null, "\u60C5\u5831\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F")),
                react_1.default.createElement(Content, null,
                    react_1.default.createElement(PrimaryButton_1.default, { text: "\u30EA\u30C8\u30E9\u30A4", onClick: this.onSubmit })))));
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
        width: "370px",
    },
};
const Header = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 40px;
  margin: -20px -20px 9px;
  border-bottom: 1px solid #c9d3d0;
`;
const Content = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
`;
exports.default = ErrorPopup;
//# sourceMappingURL=ErrorPopup.js.map