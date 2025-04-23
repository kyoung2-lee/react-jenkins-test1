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
const creatable_1 = __importDefault(require("react-select/creatable"));
const react_select_1 = require("react-select");
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const colorStyle_1 = __importDefault(require("../../styles/colorStyle"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Input = (props) => {
    const { Input: DefaultInput } = react_select_1.components;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const { onPaste } = props.selectProps;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return react_1.default.createElement(DefaultInput, { ...props, onPaste: onPaste });
};
const components = {
    ...react_select_1.components,
    DropdownIndicator: null,
    Input,
};
const createOption = (value) => ({
    label: value,
    value,
});
class MultipleCreatableInput extends react_1.Component {
    constructor(props) {
        super(props);
        this.entered = false;
        this.container = (base, _state) => ({
            ...base,
            width: this.props.width || "100%",
            maxHeight: this.props.maxHeight,
            minHeight: "44px",
            border: "none",
            fontFamily: this.props.fontFamily,
            fontSize: this.props.fontSize,
            fontWeight: this.props.fontWeight,
        });
        this.control = (base, state) => {
            const borderStyle = `1px solid ${this.isError ? colorStyle_1.default.border.ERROR : this.props.isShadowOnFocus && state.isFocused ? "#2e85c8" : colorStyle_1.default.border.PRIMARY}`;
            return {
                ...base,
                width: "100%",
                height: "100%",
                padding: "0 8px 0 6px",
                border: borderStyle,
                boxShadow: this.props.isShadowOnFocus && state.isFocused ? "0px 0px 7px #60B7FA" : "none",
                "&:hover": { border: borderStyle },
                borderRadius: "1px",
                minHeight: "42px",
                opacity: this.props.disabled ? 0.6 : 1,
                background: this.props.disabled
                    ? "#EBEBE4"
                    : this.props.isShowEditedColor && this.props.meta.dirty && (0, lodash_isempty_1.default)(this.props.input.value)
                        ? colorStyle_1.default.background.DELETED
                        : colorStyle_1.default.WHITE,
                overflowY: "auto",
            };
        };
        this.option = (base) => ({
            ...base,
            height: 34,
            color: this.props.disabled ? "#000" : base.color,
        });
        this.theme = (theme) => ({
            ...theme,
            borderRadius: 1,
            colors: {
                ...theme.colors,
                primary: "#346181",
            },
        });
        this.menu = (menu) => ({
            ...menu,
            marginTop: 0,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.handleChange = (value, action, jobCode, previous) => {
            if (action.action === "select-option" && this.props.maxValLength) {
                if (previous.length >= this.props.maxValLength) {
                    return;
                }
            }
            if (action.action === "pop-value" && action.removedValue && action.removedValue.label === jobCode) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            let next = value;
            if (action.action === "clear") {
                next = previous.filter((v) => v.label === jobCode);
            }
            this.props.input.onChange(next ? next.map((v) => v.value) : []);
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.handleInputChange = (inputValue, action, previous) => {
            if (action.action === "input-change") {
                if (previous.length >= this.props.maxValLength || this.entered) {
                    return;
                }
            }
            const { filterValue } = this.props;
            if (action.action !== "input-blur" && action.action !== "menu-close") {
                this.setState({ inputValue: filterValue ? filterValue(inputValue) : inputValue });
            }
        };
        this.handleKeyDown = (event) => {
            const { state: { inputValue }, props: { maxValLength, formatValues, 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            input: { onChange, value }, }, } = this;
            if (this.entered && event.key !== "Enter" && event.key !== "Tab") {
                this.entered = false;
            }
            if (!inputValue)
                return;
            switch (event.key) {
                case "Enter":
                case "Tab": {
                    this.setState({ inputValue: "" });
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    let next = [...new Set([...value, inputValue])];
                    next = formatValues ? formatValues(next) : next;
                    next = [...new Set(next)];
                    if (maxValLength >= next.length) {
                        onChange(next);
                    }
                    this.entered = true;
                    event.preventDefault();
                    break;
                }
                default:
                    break;
            }
        };
        this.handlePaste = (event) => {
            const { state: { inputValue }, props: { maxValLength, formatValues, 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            input: { onChange, value }, filterValue, }, } = this;
            event.preventDefault();
            const clipboard = event.clipboardData.getData("Text").trim();
            if (!clipboard) {
                return;
            }
            const values = clipboard
                .split(/[\s,]+/)
                .map((v) => v.trim())
                .map((v) => (filterValue ? filterValue(v) : v))
                .filter((v) => v);
            this.setState({ inputValue: "" });
            let next = [
                ...new Set(!this.entered && !!inputValue ? [...value, inputValue, ...values] : [...value, ...values]),
            ];
            next = formatValues ? formatValues(next) : next;
            next = [...new Set(next)].slice(0, maxValLength);
            onChange(next);
            this.entered = true;
        };
        this.parseValue = (value) => {
            if (!value) {
                return [];
            }
            return value.map((v) => createOption(v));
        };
        // 項目をxボタンで削除した場合に枠の一部が残ってしまう問題があったが、「transform: 'translateZ(0)'」を付けることで解消
        this.multiValue = (base, value) => value.data.label === this.props.initialJobCd
            ? { ...base, backgroundColor: "gray", fontSize: "20px", borderRadius: "2px" }
            : {
                ...base,
                backgroundColor: "#FFF",
                border: "1px solid rgb(84, 84, 84)",
                fontSize: "20px",
                borderRadius: "2px",
                transform: "translateZ(0)",
            };
        this.multiValueLabel = (base, value) => value.data.label === this.props.initialJobCd
            ? {
                ...base,
                color: "white",
                paddingRight: 6,
            }
            : {
                ...base,
                color: this.props.isShowEditedColor && this.props.meta.dirty ? colorStyle_1.default.text.CHANGED : base.color,
            };
        this.multiValueRemove = (base, value) => value.data.label === this.props.initialJobCd ? { ...base, display: "none" } : base;
        this.valueContainer = (base) => ({ ...base, padding: "2px 0 2px" });
        this.clearIndicator = (clearIndicator) => ({
            ...clearIndicator,
            color: "#4198C9",
        });
        this.dropdownIndicator = (dropdownIndicator) => ({
            ...dropdownIndicator,
            color: "#4198C9",
        });
        this.placeholderStyle = (placeholder) => ({
            ...placeholder,
            color: colorStyle_1.default.PLACEHOLDER,
        });
        this.onComponentBlur = (event, values) => {
            const { state: { inputValue }, props: { maxValLength, formatValues, componentOnBlur, input: { onChange }, }, } = this;
            if (componentOnBlur) {
                componentOnBlur(event, values);
            }
            if (inputValue) {
                let next = [...new Set([...(values || []), inputValue])];
                next = formatValues ? formatValues(next) : next;
                next = [...new Set(next)];
                if (maxValLength >= next.length) {
                    onChange(next);
                    this.setState({ inputValue: "" });
                }
            }
            event.preventDefault();
        };
        this.state = {
            inputValue: "",
        };
    }
    get isError() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { error, touched, submitFailed } = this.props.meta;
        const { isForceError } = this.props;
        return (!!error && touched && submitFailed) || (isForceError && touched);
    }
    render() {
        const { container, control, option, theme, menu, multiValue, multiValueLabel, multiValueRemove, valueContainer, clearIndicator, dropdownIndicator, placeholderStyle, } = this;
        const { inputValue } = this.state;
        const { 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        input: { name, value }, placeholder = "", disabled = false, initialJobCd, autoFocus, tabIndex, } = this.props;
        return (react_1.default.createElement(creatable_1.default, { ...{ name, placeholder }, 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            value: this.parseValue(value), components: components, tabIndex: tabIndex === undefined ? tabIndex : String(tabIndex), theme: theme, styles: {
                container,
                control,
                option,
                menu,
                multiValue,
                multiValueLabel,
                multiValueRemove,
                valueContainer,
                clearIndicator,
                dropdownIndicator,
                placeholder: placeholderStyle,
            }, inputValue: inputValue, isClearable: true, isMulti: true, menuIsOpen: false, autoFocus: autoFocus, 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onChange: (values, action) => this.handleChange(values, action, initialJobCd, this.parseValue(value)), 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onInputChange: (newValue, action) => this.handleInputChange(newValue, action, this.parseValue(value)), onKeyDown: this.handleKeyDown, isDisabled: disabled, 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onBlur: (e) => this.onComponentBlur(e, value), onPaste: this.handlePaste }));
    }
}
exports.default = MultipleCreatableInput;
//# sourceMappingURL=MultipleCreatableInput.js.map