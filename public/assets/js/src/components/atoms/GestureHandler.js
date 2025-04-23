"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_hammerjs_1 = __importDefault(require("react-hammerjs"));
const options = {
    recognizers: {
        doubletap: {
            // ダブルタップで画面が拡大縮小しないように、
            // ブラウザより長めにタップの感覚を許容しています。
            interval: 500,
        },
    },
};
const GestureHandler = ({ children, onDoubleTap }) => (react_1.default.createElement(react_hammerjs_1.default, { onDoubleTap: onDoubleTap, options: options },
    react_1.default.createElement("div", null, children)));
exports.default = GestureHandler;
//# sourceMappingURL=GestureHandler.js.map