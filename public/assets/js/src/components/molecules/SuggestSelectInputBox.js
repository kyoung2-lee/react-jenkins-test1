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
exports.SuggestSelectInputBox = void 0;
const react_1 = __importStar(require("react"));
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const storage_1 = require("../../lib/storage");
const commonConst_1 = require("../../lib/commonConst");
const TextInput_1 = __importDefault(require("../atoms/TextInput"));
const SuggestSelectInputBox = (props) => {
    /**
     * 選択肢のリストの表示状態
     */
    const [isOptionListOpened, setIsOptionListOpened] = react_1.default.useState(false);
    /**
     * テキストボックスの要素
     */
    const textbox = react_1.default.useRef(null);
    /**
     * テキストボックス内のドロップダウンボタンの要素
     */
    const dropdownIndicator = react_1.default.useRef(null);
    /**
     * ラベルの重複を除いた選択肢
     */
    const deduplicatedOptions = props.options.reduce((acc, cur) => (acc.some(({ label }) => label === cur.label) ? acc : [...acc, cur]), []);
    const dispatch = (0, hooks_1.useAppDispatch)();
    /**
     * 入力に応じて選択肢を絞り込む
     */
    const filterOptions = (value = props.value) => deduplicatedOptions.filter((option) => option.label.includes(value.toUpperCase()));
    /**
     * テキストボックス外をクリックした時は選択肢リストを非表示にする
     */
    const handleClickOutside = (0, react_1.useCallback)((e) => {
        var _a, _b;
        const isInsideClick = ((_a = textbox.current) === null || _a === void 0 ? void 0 : _a.contains(e.target)) || ((_b = dropdownIndicator.current) === null || _b === void 0 ? void 0 : _b.contains(e.target));
        if (isInsideClick)
            return;
        setIsOptionListOpened(false);
    }, []);
    /**
     * リストから選択時、値を更新する
     */
    const onSelectOptionItem = (e, devices, label) => {
        if (!devices.some((device) => device === storage_1.storage.terminalCat))
            return;
        e.preventDefault();
        e.stopPropagation();
        if (props.disabled)
            return;
        dispatch((0, redux_form_1.change)(props.formName, props.fieldName, label));
        setIsOptionListOpened(false);
    };
    react_1.default.useEffect(() => {
        document.addEventListener(storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc ? "click" : "touchstart", handleClickOutside);
        return () => {
            document.removeEventListener(storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc ? "click" : "touchstart", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(redux_form_1.Field, { component: TextInput_1.default, disabled: props.disabled, fontFamily: props.fontFamily, fontSize: props.fontSize, fontWeight: props.fontWeight, height: props.height, maxLength: props.maxLength, name: props.fieldName, validate: props.validate, width: props.width, componentOnBlur: props.componentOnBlur, onKeyPress: props.onKeyPress, props: {
                innerRef: textbox,
                input: {
                    value: props.value,
                    onChange: (e) => {
                        const { value } = e.target;
                        const normalizeValue = props.normalize ? props.normalize(value) : value;
                        dispatch((0, redux_form_1.change)(props.formName, props.fieldName, normalizeValue));
                        if (filterOptions(e.target.value).length) {
                            setIsOptionListOpened(true);
                        }
                    },
                },
                onClick: () => {
                    setIsOptionListOpened((isOpened) => !isOpened);
                },
                onKeyDown: () => {
                    setIsOptionListOpened(false);
                },
            } }),
        react_1.default.createElement(DropdownIndicator, { ref: dropdownIndicator, onClick: (e) => {
                var _a;
                e.preventDefault();
                if (props.disabled)
                    return;
                setIsOptionListOpened((isOpened) => !isOpened);
                (_a = textbox.current) === null || _a === void 0 ? void 0 : _a.focus();
            }, isDisabled: props.disabled }),
        react_1.default.createElement(OptionWrapper, { isOpened: isOptionListOpened, fontFamily: props.fontFamily, isDisabled: props.disabled }, [{ label: "" }, ...filterOptions()].map(({ label }) => (react_1.default.createElement("li", { key: label },
            react_1.default.createElement(OptionItemWrapper, { onMouseDown: (e) => onSelectOptionItem(e, [commonConst_1.Const.TerminalCat.pc], label), onTouchEnd: (e) => onSelectOptionItem(e, [commonConst_1.Const.TerminalCat.iPad, commonConst_1.Const.TerminalCat.iPhone], label), type: "button", isSelected: label === props.value }, label)))))));
};
exports.SuggestSelectInputBox = SuggestSelectInputBox;
const Wrapper = styled_components_1.default.div `
  position: relative;
`;
const DropdownIndicator = styled_components_1.default.div `
  appearance: none;
  background-color: white;
  border: none;
  bottom: 1px;
  content: "";
  display: ${({ isDisabled }) => (isDisabled ? "none" : "block")};
  position: absolute;
  right: 1px;
  top: 1px;
  width: 20px;
  z-index: 1;
  &::after {
    border-bottom: 2px solid #289ac6;
    border-right: 2px solid #289ac6;
    content: "";
    height: 7px;
    pointer-events: none;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: rotate(45deg);
    translate: 50% -50%;
    width: 7px;
    z-index: 2;
  }
  &:hover::after {
    border-bottom-color: hsl(0, 0%, 60%);
    border-right-color: hsl(0, 0%, 60%);
  }
`;
const OptionWrapper = styled_components_1.default.ul `
  background: white;
  border-radius: 5px;
  border: 1px solid #c8c8c8;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  display: ${({ isDisabled, isOpened }) => (!isDisabled && isOpened ? "block" : "none")};
  font-family: ${({ fontFamily }) => fontFamily !== null && fontFamily !== void 0 ? fontFamily : "transparent"};
  left: 0;
  list-style: none;
  margin: 0;
  max-height: 200px;
  overflow: auto;
  padding: 0;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 1;
`;
const OptionItemWrapper = styled_components_1.default.button `
  appearance: none;
  background: ${({ isSelected }) => (isSelected ? "#2684ff" : "transparent")};
  border: none;
  color: ${({ isSelected }) => (isSelected ? "#ffffff" : "#000000")};
  min-height: 38px;
  overflow: hidden;
  padding: 6px;
  text-align: left;
  width: 100%;
  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? "#2684ff" : "#deebff")};
    color: ${({ isSelected }) => (isSelected ? "#ffffff" : "#000000")};
  }
`;
//# sourceMappingURL=SuggestSelectInputBox.js.map