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
const react_1 = __importStar(require("react"));
const react_draggable_1 = __importDefault(require("react-draggable"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const GestureHandler_1 = __importDefault(require("../atoms/GestureHandler"));
const CloseButton_1 = __importDefault(require("../atoms/CloseButton"));
const storage_1 = require("../../lib/storage");
const commonConst_1 = require("../../lib/commonConst");
const DraggableModalFree = (props) => {
    const { children, onFocus, header, onClose = () => { }, showCloseButton = true, width, height, top, left, ...modalProps } = props;
    const headHeight = 40;
    const bodyHeight = `${height - headHeight}px)`;
    const [isMinimize, setIsMinimize] = (0, react_1.useState)(false);
    const [position, setPosition] = (0, react_1.useState)({
        x: Math.floor(left),
        y: top !== undefined ? top : Math.floor((window.innerHeight - height) / 2), // topが設定されていなければ画面の中央
    });
    const handleMinimize = (0, react_1.useCallback)((e) => {
        if (storage_1.storage.isPc) {
            setIsMinimize(!isMinimize);
            e.preventDefault();
        }
    }, [isMinimize]);
    const handleStop = (_e, data) => {
        // モーダルが画面からはみ出さないようにする
        let { x, y } = data;
        const Ymin = 0;
        const Ymax = window.innerHeight - headHeight; // 60はヘッダの高さ
        const Xmin = 60 - props.width; // 60は指の大きさ
        const Xmax = window.innerWidth - 60; // 60は指の大きさ
        if (y < Ymin)
            y = Ymin;
        if (y > Ymax)
            y = Ymax;
        if (x < Xmin)
            x = Xmin;
        if (x > Xmax)
            x = Xmax;
        setPosition({ x, y });
        // このモーダルに、フォーカスを合わせる
        props.onFocus();
    };
    // 最小化状態で閉じられたモードレスを、非最小化状態で開くようにする
    const handleOnOpen = (0, react_1.useCallback)(() => {
        if (isMinimize) {
            setIsMinimize(false);
        }
    }, [isMinimize]);
    return (react_1.default.createElement(ModalWithAnimation, { terminalCat: storage_1.storage.terminalCat, shouldCloseOnOverlayClick: false, shouldCloseOnEsc: false, onAfterOpen: handleOnOpen, closeTimeoutMS: 300, ...modalProps, isOpen: modalProps.isOpen },
        react_1.default.createElement(react_draggable_1.default, { handle: ".handle", position: position, disabled: !storage_1.storage.isPc, onStart: onFocus, onStop: handleStop },
            react_1.default.createElement(Content, { width: width },
                react_1.default.createElement(GestureHandler_1.default, { onDoubleTap: handleMinimize },
                    react_1.default.createElement(Header, { className: "handle", headHeight: headHeight },
                        header,
                        showCloseButton ? react_1.default.createElement(CloseButton_1.default, { onClick: onClose }) : null)),
                react_1.default.createElement(Body, { terminalCat: storage_1.storage.terminalCat, isMinimize: isMinimize, height: bodyHeight }, children)))));
};
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
const Body = styled_components_1.default.div `
  height: ${(props) => (props.isMinimize ? "0" : props.height)};
  ${(props) => props.terminalCat === commonConst_1.Const.TerminalCat.pc && "transition: height 0.2s linear;"};
  * {
    ${(props) => props.isMinimize && "display: none !important;"};
  }
`;
exports.default = DraggableModalFree;
//# sourceMappingURL=DraggableModalFree.js.map