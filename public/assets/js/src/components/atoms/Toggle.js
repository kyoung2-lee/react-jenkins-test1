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
const react_1 = __importDefault(require("react"));
const react_switch_1 = __importDefault(require("react-switch"));
const styled_components_1 = __importStar(require("styled-components"));
const colorStyleLight_1 = __importDefault(require("../../styles/colorStyleLight"));
const colorStyleDark_1 = __importDefault(require("../../styles/colorStyleDark"));
class Toggle extends react_1.default.Component {
    render() {
        const { isDarkMode, smallSize, ...switchProps } = this.props;
        const onColor = isDarkMode ? colorStyleDark_1.default.button.PRIMARY : colorStyleLight_1.default.button.PRIMARY;
        const offColor = isDarkMode ? colorStyleDark_1.default.button.PRIMARY_OFF : colorStyleLight_1.default.button.PRIMARY_OFF;
        const handleColor = isDarkMode ? colorStyleDark_1.default.PRIMARY_BASE : colorStyleLight_1.default.PRIMARY_BASE;
        const hoverBgColor = switchProps.checked
            ? isDarkMode
                ? colorStyleDark_1.default.button.PRIMARY_HOVER
                : colorStyleLight_1.default.button.PRIMARY_HOVER
            : isDarkMode
                ? colorStyleDark_1.default.button.PRIMARY_OFF_HOVER
                : colorStyleLight_1.default.button.PRIMARY_OFF_HOVER;
        const handleDiameter = smallSize ? 20 : 24;
        const height = smallSize ? 24 : 28;
        const width = smallSize ? 43 : 50;
        return (react_1.default.createElement(Wrapper, { disabled: switchProps.disabled, hoverBgColor: hoverBgColor },
            react_1.default.createElement(react_switch_1.default, { className: "react-switch", onColor: onColor, offColor: offColor, onHandleColor: handleColor, offHandleColor: handleColor, uncheckedIcon: false, checkedIcon: false, boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.4)", handleDiameter: handleDiameter, height: height, width: width, ...switchProps })));
    }
}
const Wrapper = styled_components_1.default.div `
  ${({ disabled, hoverBgColor }) => {
    if (!disabled) {
        /* カラーテーマを反映するためカラーはcssで指定する */
        return (0, styled_components_1.css) `
        .react-switch:hover {
          .react-switch-bg {
            background: ${hoverBgColor} !important;
          }
        }
      `;
    }
    return null;
}}
`;
exports.default = Toggle;
//# sourceMappingURL=Toggle.js.map