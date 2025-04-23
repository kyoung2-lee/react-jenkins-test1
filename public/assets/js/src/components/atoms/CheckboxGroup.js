"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const CheckBoxInput_1 = require("./CheckBoxInput");
const CheckboxGroup = (props) => {
    const { tabIndex, options, input } = props;
    const { name, onChange } = input;
    const inputValue = input.value;
    const checkboxes = options.map(({ label, value }, index) => {
        const handleChange = (event) => {
            const arr = [...inputValue];
            if (event && event.target.checked) {
                arr.push(value);
            }
            else {
                arr.splice(arr.indexOf(value), 1);
            }
            return onChange(arr);
        };
        const checked = inputValue.includes(value);
        const indexConst = index;
        return (react_1.default.createElement("label", { key: `checkbox-${indexConst}` },
            react_1.default.createElement(CheckBoxInput_1.CheckBox, { type: "checkbox", name: `${name}[${indexConst}]`, tabIndex: tabIndex, value: value, checked: checked, onChange: handleChange, disabled: false, isShowEditedColor: false, dirty: false, isShadowOnFocus: true }),
            react_1.default.createElement("span", null, label)));
    });
    return react_1.default.createElement(Wrapper, null, checkboxes);
};
const Wrapper = styled_components_1.default.div `
  > label {
    margin-right: 20px;
  }
`;
exports.default = CheckboxGroup;
//# sourceMappingURL=CheckboxGroup.js.map