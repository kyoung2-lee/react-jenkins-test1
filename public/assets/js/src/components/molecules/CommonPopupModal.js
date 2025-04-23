"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const PopupCommonHeader_1 = __importDefault(require("../atoms/PopupCommonHeader"));
class CommonPopupModal extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {},
        };
    }
    UNSAFE_componentWillMount() {
        const { width, height, ...modalProps } = this.props;
        this.setState({ style: modalProps.style || modalStyle(width, height) });
    }
    componentWillUnmount() {
        this.setState({ style: {} });
    }
    render() {
        const { children, width, flightHeader = null, arr = null, dep = null, ...modalProps } = this.props;
        return (react_1.default.createElement(react_modal_1.default, { ...modalProps, style: this.state.style },
            react_1.default.createElement(Content, { width: width },
                react_1.default.createElement(PopupCommonHeader_1.default, { flightHeader: flightHeader, arr: arr, dep: dep }),
                children)));
    }
}
react_modal_1.default.setAppElement("#content");
const modalStyle = (width, height) => ({
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 970000000 /* reapop(999999999)の2つ下 */,
    },
    content: {
        borderRadius: "0",
        border: "none",
        width: `${width || 375}px`,
        maxHeight: `${height || 0}px`,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: "auto",
        padding: "0",
        overflow: "hidden",
    },
});
const Content = styled_components_1.default.div `
  width: ${(props) => props.width || 375}px;
  pointer-events: all;
  background: #fff;
  position: absolute;
`;
exports.default = CommonPopupModal;
//# sourceMappingURL=CommonPopupModal.js.map