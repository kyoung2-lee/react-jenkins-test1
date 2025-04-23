"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const RoundButtonSmall_1 = __importDefault(require("./RoundButtonSmall"));
const plus_svg_component_1 = __importDefault(require("../../assets/images/icon/plus.svg?component"));
const RoundButtonSmallPlus = (props) => {
    const { onClick, disabled, ...otherProps } = props;
    return (react_1.default.createElement(ButtonBase, { onClick: !disabled ? onClick : undefined, disabled: disabled, ...otherProps },
        react_1.default.createElement(plus_svg_component_1.default, null)));
};
const ButtonBase = (0, styled_components_1.default)(RoundButtonSmall_1.default) `
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  svg {
    fill: #fff;
  }
`;
exports.default = RoundButtonSmallPlus;
//# sourceMappingURL=RoundButtonSmallPlus.js.map