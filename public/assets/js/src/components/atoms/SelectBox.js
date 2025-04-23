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
const react_select_1 = __importStar(require("react-select"));
const colorStyle_1 = __importDefault(require("../../styles/colorStyle"));
const SelectBox = (props) => {
    const optionHeight = 34;
    const selectRef = (0, react_1.useRef)(null);
    const [doFocusOnUpdated, setDoFocusOnUpdated] = (0, react_1.useState)(false);
    const { tabIndex, options, width, height, input, 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    meta: { error, touched, submitFailed, dirty }, isForceError, isShadowOnFocus, isShowEditedColor, menuWidth, menuLeft, placeholder = "", hasBlank = false, disabled = false, disabledSimpleColor = false, isSearchable = false, maxMenuHeight, isMulti, autoFocus, fontFamily, fontSize, fontWeight, } = props;
    (0, react_1.useEffect)(() => {
        if (doFocusOnUpdated) {
            if (selectRef.current) {
                selectRef.current.focus();
            }
            setDoFocusOnUpdated(false);
        }
    }, [doFocusOnUpdated]);
    const handleChange = (inputValue, actionMeta) => {
        setDoFocusOnUpdated(true);
        if (isMulti) {
            input.onChange(inputValue);
        }
        else if (inputValue) {
            const { value } = inputValue;
            input.onChange(value);
        }
        else {
            input.onChange("");
        }
        if (props.onSelect) {
            if (actionMeta.action === "select-option" && inputValue.value !== input.value) {
                props.onSelect();
            }
            else if (actionMeta.action === "clear" && input.value) {
                props.onSelect();
            }
        }
    };
    const handleKeyDown = (e) => {
        if (props.componentOnKeyDown && selectRef.current && !selectRef.current.state.menuIsOpen && e.key === "Enter") {
            props.componentOnKeyDown(e);
        }
    };
    let mergedOptions;
    if (hasBlank && (options.length === 0 || (options.length > 0 && options[0].label !== ""))) {
        mergedOptions = [{ value: "", label: "" }, ...options];
    }
    else {
        mergedOptions = options;
    }
    const customFilter = (0, react_select_1.createFilter)({
        matchFrom: "start",
    });
    // eslint-disable-next-line react/no-unstable-nested-components
    const SingleValue = ({ children, ...selectProps }) => (react_1.default.createElement(react_select_1.components.SingleValue, { ...selectProps }, children || react_1.default.createElement("span", { className: "placeholder" }, placeholder)));
    // eslint-disable-next-line react/no-unstable-nested-components
    const DropdownIndicator = (selectProps) => (react_1.default.createElement(react_select_1.components.DropdownIndicator, { ...selectProps },
        react_1.default.createElement("div", null)));
    // eslint-disable-next-line react/no-unstable-nested-components
    const ClearIndicator = () => react_1.default.createElement(react_1.default.Fragment, null);
    // eslint-disable-next-line react/no-unstable-nested-components
    const IndicatorSeparator = () => react_1.default.createElement(react_1.default.Fragment, null);
    const customStyles = {
        container: (providedStyles, _state) => ({
            ...providedStyles,
            width,
            fontFamily,
            fontSize,
            fontWeight,
        }),
        control: (_providedStyles, state) => ({
            display: "flex",
            minHeight: height || 44,
            border: state.isDisabled && disabledSimpleColor
                ? "1px solid #222222"
                : (error && touched && submitFailed) || (isForceError && touched)
                    ? `1px solid ${colorStyle_1.default.border.ERROR}`
                    : isShadowOnFocus && state.isFocused
                        ? "1px solid #2e85c8"
                        : `1px solid ${colorStyle_1.default.border.PRIMARY}`,
            boxShadow: isShadowOnFocus && state.isFocused ? "0px 0px 7px #60B7FA" : "none",
            borderRadius: 1,
            opacity: state.isDisabled && !disabledSimpleColor ? 0.6 : 1,
            background: isShowEditedColor
                ? state.isDisabled && !disabledSimpleColor
                    ? "#EBEBE4"
                    : dirty && !input.value
                        ? colorStyle_1.default.background.DELETED
                        : "#FFF"
                : state.isDisabled && !disabledSimpleColor
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
            height: optionHeight,
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
        multiValue: (providedStyles, { data }) => ({
            ...providedStyles,
            backgroundColor: data.color,
            color: data.color ? "#FFF" : providedStyles.color,
        }),
        multiValueLabel: (providedStyles) => ({
            ...providedStyles,
            color: "#fff",
        }),
        menu: (providedStyles) => ({
            ...providedStyles,
            marginTop: 0,
            marginBottom: 0,
            width: menuWidth || providedStyles.width,
            left: menuLeft || providedStyles.left,
        }),
        menuList: (providedStyles) => ({
            ...providedStyles,
            paddingTop: 0,
            paddingBottom: 0,
            color: "#000",
        }),
    };
    const currentValue = mergedOptions.filter(({ value }) => isMulti
        ? typeof input.value === "object" &&
            input.value.filter((iv) => iv.value === value).length > 0
        : value === input.value);
    return (react_1.default.createElement(react_select_1.default, { ref: selectRef, isMulti: isMulti, tabIndex: String(tabIndex), components: { SingleValue, ClearIndicator, DropdownIndicator, IndicatorSeparator }, styles: customStyles, options: mergedOptions, filterOption: customFilter, placeholder: placeholder, isSearchable: isSearchable, isClearable: !!hasBlank, isDisabled: disabled, value: currentValue, onChange: handleChange, blurInputOnSelect: false, closeMenuOnScroll: true, maxMenuHeight: maxMenuHeight || optionHeight * 7, onKeyDown: handleKeyDown, onFocus: props.onFocus, noOptionsMessage: () => null, autoFocus: autoFocus }));
};
exports.default = SelectBox;
//# sourceMappingURL=SelectBox.js.map