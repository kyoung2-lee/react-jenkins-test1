"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_hammerjs_1 = __importDefault(require("react-hammerjs"));
const SwipeableCell = (props) => {
    const { deltaX, transitionDuration, onPanStart, onPan, onPanEnd, children, disabled = false } = props;
    if (disabled) {
        return react_1.default.createElement(react_1.default.Fragment, null, children);
    }
    return (react_1.default.createElement(react_hammerjs_1.default, { ...{ onPanStart, onPan, onPanEnd } },
        react_1.default.createElement("div", { style: {
                transform: `translate(${deltaX}px, 0)`,
                transition: `transform ${transitionDuration || 250}ms ease-out 0s`,
            } }, children)));
};
exports.default = SwipeableCell;
//# sourceMappingURL=SwipeableCell.js.map