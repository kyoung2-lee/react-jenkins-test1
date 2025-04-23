"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.draggableModal = void 0;
const react_1 = __importDefault(require("react"));
const react_draggable_1 = __importDefault(require("react-draggable"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const GestureHandler_1 = __importDefault(require("../atoms/GestureHandler"));
const CloseButton_1 = __importDefault(require("../atoms/CloseButton"));
const storage_1 = require("../../lib/storage");
const commonConst_1 = require("../../lib/commonConst");
const RoundButtonReload_1 = __importDefault(require("../atoms/RoundButtonReload"));
class DraggableModal extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.modalWidth = 375;
        this.deviceTopMargin = storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone ? 54 : 5;
        this.offsetX = storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone ? 0 : 10;
        this.offsetY = storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc ? 5 : storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPad ? 5 + 22 : 22 + 15;
        this.headHeight = 40;
        this.handleMinimize = (e) => {
            if (storage_1.storage.isPc) {
                this.setState((prevState) => ({ isMinimize: !prevState.isMinimize }));
                e.preventDefault();
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.handleStop = (_e, position) => {
            // モーダルが画面からはみ出さないようにする
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            let { x, y } = position;
            const Ymin = 0;
            const Ymax = window.innerHeight - this.headHeight; // 60はヘッダの高さ
            const Xmin = 60 - this.modalWidth; // 60は指の大きさ
            const Xmax = window.innerWidth - 60; // 60は指の大きさ
            if (y < Ymin)
                y = Ymin;
            if (y > Ymax)
                y = Ymax;
            if (x < Xmin)
                x = Xmin;
            if (x > Xmax)
                x = Xmax;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            this.setState({ position: { x, y } });
            // このモーダルに、フォーカスを合わせる
            this.props.onFocus();
        };
        // 最小化状態で閉じられたモードレスを、非最小化状態で開くようにする
        this.handleOnOpen = () => {
            if (this.state.isMinimize) {
                this.setState({ isMinimize: false });
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        exports.draggableModal = this;
        const { offsetX, offsetY, modalWidth } = this;
        // 最初に開く位置を指定
        let x;
        let y;
        if (this.props.posRight) {
            y = offsetY;
            x = window.innerWidth - modalWidth - offsetX;
        }
        else {
            y = offsetY;
            x = this.offsetX;
        }
        this.state = {
            isMinimize: false,
            position: { x, y },
        };
        this.handleMinimize = this.handleMinimize.bind(this);
        this.handleStop = this.handleStop.bind(this);
    }
    render() {
        const { children, onFocus, title, header, reloadButtonBottomHeight, onReload, onClose = () => { }, isFetching, showCloseButton = true, ...modalProps } = this.props;
        const { modalWidth, deviceTopMargin, offsetY, headHeight } = this;
        const { isMinimize } = this.state;
        const bodyHeight = `calc(100vh - ${headHeight + offsetY + deviceTopMargin}px)`;
        return (react_1.default.createElement(ModalWithAnimation, { terminalCat: storage_1.storage.terminalCat, ...modalProps, isOpen: modalProps.isOpen, onAfterOpen: this.handleOnOpen, closeTimeoutMS: 300 },
            react_1.default.createElement(react_draggable_1.default, { handle: ".handle", position: this.state.position, disabled: !storage_1.storage.isPc, onStart: onFocus, onStop: this.handleStop },
                react_1.default.createElement(Content, { width: modalWidth },
                    react_1.default.createElement(GestureHandler_1.default, { onDoubleTap: this.handleMinimize },
                        react_1.default.createElement(Header, { className: "handle", headHeight: headHeight },
                            header || react_1.default.createElement(Title, null, title),
                            showCloseButton ? react_1.default.createElement(CloseButton_1.default, { onClick: onClose }) : null)),
                    react_1.default.createElement(Body, { terminalCat: storage_1.storage.terminalCat, isMinimize: isMinimize, height: bodyHeight },
                        children,
                        onReload && (react_1.default.createElement(ModalReloadButtonContainer, { bottomHeight: reloadButtonBottomHeight || 60 },
                            react_1.default.createElement(RoundButtonReload_1.default, { isFetching: isFetching, disabled: false, onClick: onReload }))))))));
    }
}
const ModalWithAnimation = (0, styled_components_1.default)(react_modal_1.default) `
  opacity: 0;
  position: absolute;
  top: ${({ terminalCat }) => (terminalCat === commonConst_1.Const.TerminalCat.iPhone ? "100vh" : "-100px")};
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &.ReactModal__Content--after-open {
    opacity: 1;
    top: 0;
    transition: all 300ms;
  }

  &.ReactModal__Content--before-close {
    opacity: 0;
    top: ${({ terminalCat }) => (terminalCat === commonConst_1.Const.TerminalCat.iPhone ? "100vh" : "-100px")};
    transition: all 300ms;
  }

  /* .react-draggable {
    height: 100%;
  } */
`;
const Content = styled_components_1.default.div `
  width: ${(props) => props.width}px;
  pointer-events: all;
  background: #fff;
  box-shadow: 1px 1px 50px rgba(0, 0, 0, 0.8);
  position: absolute;
`;
const Header = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  min-height: ${(props) => props.headHeight}px;
  height: ${(props) => props.headHeight}px;
`;
const Title = styled_components_1.default.div `
  color: ${(props) => props.theme.color.WHITE};
  margin: 0;
  font-size: 23px;
  line-height: 31px;
`;
const ModalReloadButtonContainer = styled_components_1.default.div `
  position: fixed;
  right: 10px;
  bottom: ${(props) => props.bottomHeight}px;
  margin-top: -55px;
  z-index: 1;
`;
const Body = styled_components_1.default.div `
  /* position: relative; */
  height: ${(props) => (props.isMinimize ? "0" : props.height)};
  ${(props) => props.terminalCat === commonConst_1.Const.TerminalCat.pc && "transition: height 0.2s linear;"};
  * {
    ${(props) => props.isMinimize && "display: none !important;"};
  }
`;
exports.default = DraggableModal;
//# sourceMappingURL=DraggableModal.js.map