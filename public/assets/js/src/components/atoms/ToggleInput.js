"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Toggle_1 = __importDefault(require("./Toggle"));
const ToggleInput = (props) => {
    const { input, confirmation, tabIndex, disabled, smallSize } = props;
    return (react_1.default.createElement(Toggle_1.default, { checked: !!input.value, onChange: (checked) => {
            if (confirmation) {
                confirmation(checked);
            }
            else {
                input.onChange(checked);
            }
        }, tabIndex: tabIndex, disabled: disabled, smallSize: smallSize }));
};
exports.default = ToggleInput;
//# sourceMappingURL=ToggleInput.js.map