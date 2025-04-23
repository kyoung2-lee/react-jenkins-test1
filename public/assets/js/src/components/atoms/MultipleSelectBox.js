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
const react_select_1 = __importStar(require("react-select"));
const lodash_uniq_1 = __importDefault(require("lodash.uniq"));
const colorStyle_1 = __importDefault(require("../../styles/colorStyle"));
const commonUtil_1 = require("../../lib/commonUtil");
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
    Input,
};
class MultipleSelectBox extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.refSelect = react_1.default.createRef();
        this.container = (base) => ({
            ...base,
            width: this.props.width || "100%",
            minHeight: this.props.height || 44,
            fontFamily: this.props.fontFamily,
            fontSize: this.props.fontSize,
            fontWeight: this.props.fontWeight,
        });
        this.control = (base) => ({
            ...base,
            width: this.props.width || "100%",
            display: "flex",
            minHeight: this.props.height || 44,
            padding: "0 0 0 6px",
            border: `1px solid ${this.isError ? colorStyle_1.default.border.ERROR : colorStyle_1.default.border.PRIMARY}`,
            boxShadow: "none",
            borderRadius: 1,
            opacity: this.props.disabled ? 0.6 : 1,
            background: this.props.disabled ? "#EBEBE4" : colorStyle_1.default.WHITE,
            "&:hover": {
                border: `1px solid ${this.isError ? colorStyle_1.default.border.ERROR : colorStyle_1.default.border.PRIMARY}`,
            },
        });
        this.option = (base) => ({
            ...base,
            height: 32,
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
        this.menuList = (providedStyles) => ({
            ...providedStyles,
            paddingTop: 0,
            paddingBottom: 0,
            color: "#000",
        });
        this.clearIndicator = (clearIndicator) => ({
            ...clearIndicator,
            color: "#4198C9",
        });
        this.dropdownIndicator = (dropdownIndicator) => ({
            ...dropdownIndicator,
            color: "#4198C9",
        });
        this.parseValue = () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { value } = this.props.input;
            if (!value) {
                return [];
            }
            return value
                .map((v) => this.props.options.find((o) => o.value === v))
                .sort((a) => (a && a.isFixed ? -1 : 1));
        };
        this.handleChange = (values, action, previous) => {
            if (action.action === "select-option" && this.props.maxValLength) {
                if (previous.length >= this.props.maxValLength) {
                    return;
                }
            }
            if (action.action === "pop-value" && action.removedValue && action.removedValue.isFixed) {
                return;
            }
            let next = values;
            if (action.action === "clear") {
                next = this.props.options.filter((option) => !!option.isFixed && !!previous.filter((p) => p === option.value).length);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            this.props.input.onChange(next ? next.map((value) => value.value) : []);
        };
        this.handleInputChange = (inputValue, _action) => {
            this.setState({ inputValue });
        };
        this.handlePaste = (event) => {
            const { state: { inputValue }, props: { maxValLength, 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            input: { onChange, value }, spaceDelimiter = true, }, } = this;
            event.preventDefault();
            const clipboard = event.clipboardData.getData("Text").trim();
            if (!clipboard) {
                return;
            }
            // スペースを入力値として許容する項目もあるため、スペースを区切り文字として使うかをpropsで選択させる
            const delimiter = spaceDelimiter ? /[ \t\r\n,]+/ : /[\t\r\n,]+/;
            const values = clipboard
                .split(delimiter)
                .map((v) => {
                const option = this.props.options.find((o) => o.label === v.trim());
                return option ? option.value : null;
            })
                .filter((v) => v !== null);
            if (inputValue) {
                // 入力中の文字列が有効な値の場合、ペーストする値の先頭に加えておく
                const option = this.props.options.find((o) => (o.label ? o.label === inputValue : false));
                if (option) {
                    values.unshift(option.value);
                }
                if (this.refSelect.current) {
                    // 入力中の文字列をクリアする
                    this.refSelect.current.select.onInputChange("", { action: "set-value" });
                }
            }
            const next = (0, lodash_uniq_1.default)([...value, ...values]).slice(0, maxValLength);
            onChange(next);
        };
        // 項目をxボタンで削除した場合に枠の一部が残ってしまう問題があったが、「transform: 'translateZ(0)'」を付けることで解消
        this.multiValue = (base, value) => value.data.isFixed
            ? { ...base, backgroundColor: "gray", border: "1px solid gray", fontSize: "20px", borderRadius: "2px", transform: "translateZ(0)" }
            : value.data.color
                ? {
                    ...base,
                    backgroundColor: value.data.color,
                    color: "#FFF",
                    border: `1px solid ${value.data.color}`,
                    fontSize: "20px",
                    borderRadius: "2px",
                    transform: "translateZ(0)",
                }
                : {
                    ...base,
                    backgroundColor: "#FFF",
                    border: "1px solid #707070",
                    fontSize: "20px",
                    borderRadius: "2px",
                    transform: "translateZ(0)",
                };
        this.multiValueLabel = (base, value) => value.data.isFixed ? { ...base, color: "white", paddingRight: 6 } : value.data.color ? { ...base, color: "#FFF" } : base;
        this.multiValueRemove = (base, value) => value.data.isFixed ? { ...base, display: "none" } : base;
        this.valueContainer = (base) => ({ ...base, padding: "2px 0 2px" });
        this.placeholderStyle = (placeholder) => ({
            ...placeholder,
            color: colorStyle_1.default.PLACEHOLDER,
        });
        this.isClearable = () => this.parseValue().some((v) => v && !v.isFixed);
        this.searchOnlyByLabel = (option, rawInput) => (0, commonUtil_1.toLowerCase)(option.label).includes((0, commonUtil_1.toLowerCase)(rawInput));
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
        const { container, control, option, theme, menu, menuList, multiValue, multiValueLabel, multiValueRemove, valueContainer, clearIndicator, dropdownIndicator, placeholderStyle, } = this;
        const { 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        input: { name, value }, options, closeMenuOnSelect = true, placeholder = "", noOptionsMessage = () => null, disabled = false, } = this.props;
        const optionsLabelIsset = !!options && options.length > 0 && options[0].label !== undefined;
        return (react_1.default.createElement(react_select_1.default, { ...{
                name,
                options,
                closeMenuOnSelect,
                placeholder,
                noOptionsMessage,
            }, ref: this.refSelect, components: components, onChange: (values, action) => this.handleChange(values, action, value), onInputChange: this.handleInputChange, onPaste: this.handlePaste, value: this.parseValue(), theme: theme, styles: {
                container,
                control,
                option,
                menu,
                menuList,
                multiValue,
                multiValueLabel,
                multiValueRemove,
                valueContainer,
                clearIndicator,
                dropdownIndicator,
                placeholder: placeholderStyle,
            }, isDisabled: disabled, isMulti: true, isClearable: this.isClearable(), ...(optionsLabelIsset ? { filterOption: this.searchOnlyByLabel } : {}) }));
    }
}
exports.default = MultipleSelectBox;
//# sourceMappingURL=MultipleSelectBox.js.map