"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_select_1 = require("react-select");
const creatable_1 = __importDefault(require("react-select/creatable"));
const commonUtil_1 = require("../../lib/commonUtil");
const colorStyle_1 = __importDefault(require("../../styles/colorStyle"));
class SuggestSelectBox extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.optionHeight = 34;
        this.doFocusOnUpdated = false;
        this.isFocusOut = false;
        this.handleChange = (inputValue, actionMeta) => {
            // console.log("handleChange inputValue:" + inputValue + "action: " + actionMeta.action);
            this.doFocusOnUpdated = true;
            const value = inputValue ? (0, commonUtil_1.removePictograph)(inputValue.value.replace(/ /, "").toUpperCase()) : "";
            this.props.input.onChange(value);
            if (inputValue &&
                this.props.onSelect &&
                (actionMeta.action === "create-option" || actionMeta.action === "select-option" || actionMeta.action === "clear")) {
                if (value !== this.props.input.value) {
                    this.props.onSelect(value);
                }
            }
        };
        this.handleInputChange = (_inputValue, _inputActionMeta) => {
            //  console.log("handleInputChange value: " + inputValue + "action: " +inputActionMeta.action);
        };
        this.handleFocus = () => {
            // console.log("handleFocus");
            this.isFocusOut = false;
        };
        this.handleBlur = () => {
            if (this.selectRef.current) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const { inputValue } = this.selectRef.current.state;
                if (inputValue) {
                    const value = (0, commonUtil_1.removePictograph)(inputValue.replace(/ /, "").toUpperCase());
                    this.props.input.onChange(value);
                    if (this.props.onSelect) {
                        if (value !== this.props.input.value) {
                            this.props.onSelect(value);
                        }
                    }
                }
            }
            this.isFocusOut = true;
        };
        this.handleMenuOpen = () => { };
        this.handleMenuClose = () => { };
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleMenuOpen = this.handleMenuOpen.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.selectRef = props.innerRef || react_1.default.createRef();
    }
    componentDidUpdate() {
        if (this.isFocusOut) {
            return;
        }
        if (this.doFocusOnUpdated || this.props.autoFocus) {
            if (this.selectRef.current) {
                this.selectRef.current.focus();
            }
            this.doFocusOnUpdated = false;
        }
    }
    componentWillUnmount() {
        this.isFocusOut = false;
    }
    render() {
        const { tabIndex, options, width, height, input, maxLength, 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        meta: { error, touched, submitFailed, dirty }, isForceError, isShadowOnFocus, isShowEditedColor, placeholder = "", disabled = false, autoFocus = false, maxMenuHeight, } = this.props;
        let mergedOptions = [];
        if (input.value && !options.some((e) => e.label === input.value)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            mergedOptions = [{ value: "", label: "" }, { value: input.value, label: input.value }, ...options];
        }
        else {
            mergedOptions = [{ value: "", label: "" }, ...options];
        }
        const customFilter = (0, react_select_1.createFilter)({
            matchFrom: "start",
        });
        // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-explicit-any
        const Input = (props) => react_1.default.createElement(react_select_1.components.Input, { ...props, maxLength: maxLength });
        // eslint-disable-next-line react/no-unstable-nested-components
        const SingleValue = ({ children, ...props }) => (react_1.default.createElement(react_select_1.components.SingleValue, { ...props }, children || react_1.default.createElement("span", { className: "placeholder" }, placeholder)));
        // eslint-disable-next-line react/no-unstable-nested-components
        const DropdownIndicator = (props) => (react_1.default.createElement(react_select_1.components.DropdownIndicator, { ...props },
            react_1.default.createElement("div", null)));
        // eslint-disable-next-line react/no-unstable-nested-components
        const ClearIndicator = () => react_1.default.createElement(react_1.default.Fragment, null);
        // eslint-disable-next-line react/no-unstable-nested-components
        const IndicatorSeparator = () => react_1.default.createElement(react_1.default.Fragment, null);
        const customStyles = {
            container: (providedStyles, _state) => ({
                ...providedStyles,
                width,
            }),
            control: (_providedStyles, state) => ({
                display: "flex",
                height: height || 44,
                border: (error && touched && submitFailed) || (isForceError && touched)
                    ? `1px solid ${colorStyle_1.default.border.ERROR}`
                    : isShadowOnFocus && state.isFocused
                        ? "1px solid #2e85c8"
                        : `1px solid ${colorStyle_1.default.border.PRIMARY}`,
                boxShadow: isShadowOnFocus && state.isFocused ? "0px 0px 7px #60B7FA" : "none",
                borderRadius: 1,
                opacity: state.isDisabled ? 0.6 : 1,
                background: isShowEditedColor
                    ? state.isDisabled
                        ? "#EBEBE4"
                        : dirty && !input.value
                            ? colorStyle_1.default.background.DELETED
                            : "#FFF"
                    : state.isDisabled
                        ? "#EBEBE4"
                        : "#FFF",
                "> div": {
                    ":first-of-type": {
                        paddingLeft: 6,
                    },
                },
            }),
            option: (providedStyles, state) => ({
                ...providedStyles,
                height: this.optionHeight,
                color: state.isDisabled ? "#000" : providedStyles.color,
            }),
            dropdownIndicator: (providedStyles, state) => ({
                ...providedStyles,
                width: 20,
                height: "100%",
                padding: 0,
                justifyContent: "center",
                alignItems: "center",
                "> div": !state.isDisabled
                    ? {
                        marginBottom: 3,
                        padding: 0,
                        width: 7,
                        height: 7,
                        borderRight: "2px solid #289ac6",
                        borderBottom: "2px solid #289ac6",
                        transform: "rotate(45deg)",
                    }
                    : {},
                "&:hover > div": !state.isDisabled
                    ? {
                        borderRightColor: "hsl(0,0%,60%)",
                        borderBottomColor: "hsl(0,0%,60%)",
                    }
                    : {},
            }),
            placeholder: (providedStyles) => ({
                ...providedStyles,
                color: colorStyle_1.default.PLACEHOLDER,
            }),
            singleValue: (providedStyles, _state) => ({
                ...providedStyles,
                color: isShowEditedColor ? (dirty ? colorStyle_1.default.text.CHANGED : "#000") : "#000",
                overflow: "visible",
                ".placeholder": {
                    color: colorStyle_1.default.PLACEHOLDER,
                },
            }),
            menu: (providedStyles) => ({
                ...providedStyles,
                marginTop: 0,
                marginBottom: 0,
            }),
            menuList: (providedStyles) => ({
                ...providedStyles,
                paddingTop: 0,
                paddingBottom: 0,
                color: "#000",
            }),
        };
        return (react_1.default.createElement(creatable_1.default, { ref: this.selectRef, tabIndex: String(tabIndex), components: { Input, SingleValue, ClearIndicator, DropdownIndicator, IndicatorSeparator }, styles: customStyles, options: mergedOptions, filterOption: customFilter, placeholder: placeholder, isClearable: true, isDisabled: disabled, autoFocus: autoFocus, formatCreateLabel: (value) => (0, commonUtil_1.removePictograph)(value.replace(/ /, "").toUpperCase()), value: mergedOptions.filter(({ value }) => value === input.value), onChange: this.handleChange, onInputChange: this.handleInputChange, onMenuOpen: this.handleMenuOpen, onMenuClose: this.handleMenuClose, onFocus: this.handleFocus, onBlur: this.handleBlur, blurInputOnSelect: false, closeMenuOnScroll: true, maxMenuHeight: maxMenuHeight || this.optionHeight * 7 }));
    }
}
exports.default = SuggestSelectBox;
//# sourceMappingURL=SuggestSelectBox.js.map