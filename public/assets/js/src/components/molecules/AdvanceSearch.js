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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvanceSearch = void 0;
const react_1 = __importStar(require("react"));
const hooks_1 = require("../../store/hooks");
const FilterInput_1 = require("../atoms/FilterInput");
const AdvanceSearch = (props) => {
    const [filterString, setFilterString] = (0, react_1.useState)(String(props.searchStringParam));
    const prevSearchStringParam = (0, hooks_1.usePrevious)(props.searchStringParam);
    const latestProps = (0, hooks_1.useLatest)(props);
    const latestFilterString = (0, hooks_1.useLatest)(filterString);
    (0, react_1.useEffect)(() => {
        if (props.filtering) {
            setFilterString(String(props.searchStringParam));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.filtering]);
    (0, react_1.useEffect)(() => {
        if (prevSearchStringParam !== props.searchStringParam) {
            setFilterString(String(props.searchStringParam));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.searchStringParam]);
    const onChangeFilterString = (e) => {
        const fltString = e.currentTarget.value;
        props.onChange(fltString, () => setFilterString(fltString));
    };
    const submit = () => {
        props.onSubmit(props.filtering ? "" : filterString, () => adjustFilterString());
    };
    const handleClickAdvanceSearchFormButton = () => {
        props.onClickAdvanceSearchFormButton(filterString);
    };
    const handleFilterKeyPress = (e) => {
        if (e.key === "Enter") {
            props.onSubmit(filterString, () => adjustFilterString());
        }
    };
    // フィルタ検索実行時の検索条件が全て不正確なものであり、検索条件整式後に検索文字列が空となる場合に、
    // componentDidUpdateが呼び出されないことによる searchStringParam と filterString の齟齬を無くすための対応
    const adjustFilterString = () => {
        if (!latestProps.current.filtering && !latestProps.current.searchStringParam && !!latestFilterString.current) {
            setFilterString("");
        }
    };
    return (react_1.default.createElement(FilterInput_1.FilterInput, { placeholder: props.placeholder, handleKeyPress: handleFilterKeyPress, handleChange: onChangeFilterString, value: filterString, handleClick: handleClickAdvanceSearchFormButton, handleSubmit: submit, filtering: props.filtering }));
};
exports.AdvanceSearch = AdvanceSearch;
//# sourceMappingURL=AdvanceSearch.js.map