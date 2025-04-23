"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const ScreenMask = () => {
    const isOpen = (0, hooks_1.useAppSelector)((state) => !!state.common.displayMaskNumber || false);
    if (isOpen) {
        return react_1.default.createElement(Mask, null);
    }
    return null;
};
// z-indexをreapopより小さく指定
const Mask = styled_components_1.default.div `
  position: ${(props) => (props.isNotFullScreen ? "absolute" : "fixed")};
  z-index: 999999998;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`;
exports.default = ScreenMask;
//# sourceMappingURL=ScreenMask.js.map