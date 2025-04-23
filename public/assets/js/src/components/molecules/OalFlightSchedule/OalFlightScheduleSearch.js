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
const dayjs_1 = __importDefault(require("dayjs"));
const query_string_1 = __importDefault(require("query-string"));
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const commonUtil_1 = require("../../../lib/commonUtil");
const storage_1 = require("../../../lib/storage");
const validates = __importStar(require("../../../lib/validators"));
// eslint-disable-next-line import/no-cycle
const myValidates = __importStar(require("../../../lib/validators/oalFlightScheduleValidator"));
const soalaMessages_1 = require("../../../lib/soalaMessages");
const common_1 = require("../../../reducers/common");
const dateTimeInputPopup_1 = require("../../../reducers/dateTimeInputPopup");
const oalFlightSchedule_1 = require("../../../reducers/oalFlightSchedule");
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const RadioButton_1 = __importDefault(require("../../atoms/RadioButton"));
const SuggestSelectBox_1 = __importDefault(require("../../atoms/SuggestSelectBox"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const ToggleInput_1 = __importDefault(require("../../atoms/ToggleInput"));
const CheckBoxInput_1 = __importDefault(require("../../atoms/CheckBoxInput"));
const OalFlightScheduleSearch = (props) => {
    const dateToLastValue = (0, react_1.useRef)("");
    const fltRef = (0, react_1.useRef)(null);
    const depApoCdRef = (0, react_1.useRef)(null);
    const alCdRef = (0, react_1.useRef)(null);
    const dispatch = (0, hooks_1.useAppDispatch)();
    const [dateToEnabled, setDateToEnabled] = (0, react_1.useState)(true);
    const [casualCheckBoxEnabled, setCasualCheckBoxEnabled] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (window.location.search) {
            const qs = query_string_1.default.parse(window.location.search);
            if (qs.flt && qs.dateFrom) {
                void onSubmit(props.initialValues, dispatch, props);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
    const untouchField = () => {
        const validationErrorsFields = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(props.formSyncErrors)) {
            validationErrorsFields.push(key);
        }
        if (validationErrorsFields.length) {
            props.untouch(formName, ...validationErrorsFields);
            void dispatch((0, common_1.removeAllNotification)());
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFltOnBlur = (e) => {
        if (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            props.change("flt", props.casualFlg ? (0, commonUtil_1.toUpperCase)(e.target.value) : (0, commonUtil_1.formatFlt)(e.target.value));
        }
    };
    const handleFltOnKeyPress = (e) => {
        if (e.key === "Enter") {
            props.change("flt", props.casualFlg ? (0, commonUtil_1.toUpperCase)(e.target.value) : (0, commonUtil_1.formatFlt)(e.target.value));
        }
    };
    const handleDateFromInputPopup = () => {
        const onEnter = (value) => {
            props.change("dateFrom", value);
            // setItemoutで行わないとfocusが効かない
            setTimeout(() => {
                switch (props.searchTypeValue) {
                    case "FLT":
                        if (fltRef.current)
                            fltRef.current.focus();
                        break;
                    case "LEG":
                        if (depApoCdRef.current)
                            depApoCdRef.current.focus();
                        break;
                    case "ALAPO":
                        if (alCdRef.current)
                            alCdRef.current.focus();
                        break;
                    default:
                        break;
                }
            }, 1);
        };
        const onUpdate = async (value) => {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await props.change("dateFrom", value);
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await dispatch((0, redux_form_1.submit)(formName));
        };
        const param = {
            valueFormat: "YYYY-MM-DD",
            currentValue: props.innerDateFromValue,
            defaultSetting: { value: props.innerDateFromValue },
            onEnter,
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onUpdate,
            customUpdateButtonName: "Search",
        };
        dispatch((0, dateTimeInputPopup_1.openDateTimeInputPopup)(param));
    };
    const handleDateToInputPopup = () => {
        const onEnter = (value) => {
            props.change("dateTo", value);
            // setTimeoutで行わないとfocusが効かない
            setTimeout(() => {
                if (props.searchTypeValue === "FLT" && fltRef.current) {
                    fltRef.current.focus();
                }
            }, 1);
        };
        const onUpdate = async (value) => {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await props.change("dateTo", value);
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await dispatch((0, redux_form_1.submit)(formName));
        };
        const param = {
            valueFormat: "YYYY-MM-DD",
            currentValue: props.innerDateToValue,
            defaultSetting: { value: props.innerDateToValue },
            onEnter,
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onUpdate,
            customUpdateButtonName: "Search",
        };
        dispatch((0, dateTimeInputPopup_1.openDateTimeInputPopup)(param));
    };
    const handleOpeCsConfirmation = (checked) => {
        props.change("opeCsFlg", checked);
        if (checked) {
            props.change("casualFlg", false);
            setCasualCheckBoxEnabled(false);
        }
        else {
            setCasualCheckBoxEnabled(true);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCnxToOnChange = (event) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (event.target.checked) {
            dateToLastValue.current = props.innerDateToValue;
            props.change("dateTo", "");
            setDateToEnabled(false);
        }
        else {
            props.change("dateTo", dateToLastValue.current);
            setDateToEnabled(true);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const alToUpperCase = (e) => {
        if (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            props.change("alCd", (0, commonUtil_1.toUpperCase)(e.target.value));
        }
    };
    const { searchTypeValue, dateFromValue, dateToValue, handleSubmit, apoOptions } = props;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(SearchFormContainer, { isPc: isPc, onSubmit: handleSubmit },
            react_1.default.createElement(SearchTypeDiv, { isPc: isPc },
                react_1.default.createElement(redux_form_1.Field, { name: "searchType", id: "searchTypeFLT", 
                    // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                    tabIndex: 1, type: "radio", value: "FLT", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField(), autoFocus: true }),
                react_1.default.createElement("label", { htmlFor: "searchTypeFLT" }, "FLT"),
                react_1.default.createElement(redux_form_1.Field, { name: "searchType", id: "searchTypeLEG", 
                    // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                    tabIndex: 2, type: "radio", value: "LEG", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField() }),
                react_1.default.createElement("label", { htmlFor: "searchTypeLEG" }, "LEG"),
                react_1.default.createElement(redux_form_1.Field, { name: "searchType", id: "searchTypeALAPO", 
                    // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                    tabIndex: 3, type: "radio", value: "ALAPO", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField() }),
                react_1.default.createElement("label", { htmlFor: "searchTypeALAPO" },
                    "Handling",
                    react_1.default.createElement("br", null),
                    "Flight")),
            searchTypeValue === "FLT" && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(FromToDiv, { isPc: isPc },
                    react_1.default.createElement(redux_form_1.Field, { name: "dateFrom", tabIndex: -1, placeholder: "Date", component: TextInput_1.default, width: 68, showKeyboard: handleDateFromInputPopup, validate: [validates.required], displayValue: dateFromValue }),
                    "-",
                    react_1.default.createElement(redux_form_1.Field, { name: "dateTo", tabIndex: -1, placeholder: "Date", component: TextInput_1.default, width: 68, showKeyboard: handleDateToInputPopup, disabled: !dateToEnabled, displayValue: dateToValue })),
                react_1.default.createElement(OpeCsDiv, null,
                    react_1.default.createElement("label", { htmlFor: "opeCsFlg" }, "OPE"),
                    react_1.default.createElement(redux_form_1.Field, { name: "opeCsFlg", id: "opeCsFlg", component: ToggleInput_1.default, confirmation: handleOpeCsConfirmation, smallSize: true, 
                        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                        tabIndex: 10 }),
                    react_1.default.createElement("label", { htmlFor: "opeCsFlg" }, "C/S")),
                react_1.default.createElement(InputDiv, { isPc: isPc },
                    react_1.default.createElement(redux_form_1.Field, { innerRef: fltRef, name: "flt", id: "flt", 
                        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                        tabIndex: 20, placeholder: "FLT", component: TextInput_1.default, width: 120, maxLength: 8, componentOnBlur: handleFltOnBlur, onKeyPress: handleFltOnKeyPress, validate: props.casualFlg
                            ? [validates.requiredFlt, validates.isOkCasualFlt8]
                            : [validates.requiredFlt, validates.lengthFlt3, validates.halfWidthFlt], isShadowOnFocus: true })),
                react_1.default.createElement(CheckBoxDiv, { isPc: isPc },
                    react_1.default.createElement("label", { htmlFor: "casualFlg" }, "Casual"),
                    react_1.default.createElement(redux_form_1.Field, { name: "casualFlg", id: "casualFlg", component: CheckBoxInput_1.default, 
                        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                        tabIndex: 30, checked: props.casualFlg, disabled: !casualCheckBoxEnabled, isShadowOnFocus: true })),
                react_1.default.createElement(CheckBoxDiv, { isPc: isPc },
                    isPc ? (react_1.default.createElement("label", { htmlFor: "nextToFlg" }, "Show Next FLT")) : (react_1.default.createElement("label", { htmlFor: "nextToFlg" },
                        "Show",
                        react_1.default.createElement("br", null),
                        "Next FLT")),
                    react_1.default.createElement(redux_form_1.Field, { name: "nextToFlg", id: "nextToFlg", component: CheckBoxInput_1.default, 
                        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                        tabIndex: 40, checked: props.nextToFlg, onChange: handleCnxToOnChange, isShadowOnFocus: true })),
                react_1.default.createElement(SubmitButtonContainer, { isPc: isPc },
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Search", tabIndex: -1 })))),
            searchTypeValue === "LEG" && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(InputDiv, { isPc: isPc },
                    react_1.default.createElement(redux_form_1.Field, { name: "dateFrom", tabIndex: -1, placeholder: "Date", component: TextInput_1.default, width: 68, showKeyboard: handleDateFromInputPopup, isShadowOnFocus: true, validate: [validates.required], displayValue: dateFromValue })),
                react_1.default.createElement(FromToDiv, { isPc: isPc },
                    react_1.default.createElement(redux_form_1.Field, { innerRef: depApoCdRef, name: "depApoCd", 
                        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                        tabIndex: 10, component: SuggestSelectBox_1.default, placeholder: "DEP", options: apoOptions, width: 77, maxLength: 3, validate: [validates.requiredApoCdPair, validates.halfWidthApoCd], isShadowOnFocus: true }),
                    "-",
                    react_1.default.createElement(redux_form_1.Field, { name: "arrApoCd", 
                        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                        tabIndex: 20, component: SuggestSelectBox_1.default, placeholder: "ARR", options: apoOptions, width: 77, maxLength: 3, validate: [validates.requiredApoCdPair, validates.halfWidthApoCd], isShadowOnFocus: true })),
                react_1.default.createElement(SubmitButtonContainer, { isPc: isPc },
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Search", tabIndex: -1 })))),
            searchTypeValue === "ALAPO" && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(InputDiv, { isPc: isPc },
                    react_1.default.createElement(redux_form_1.Field, { name: "dateFrom", tabIndex: -1, placeholder: "Date", component: TextInput_1.default, width: 68, showKeyboard: handleDateFromInputPopup, isShadowOnFocus: true, validate: [validates.required], displayValue: dateFromValue })),
                react_1.default.createElement(InputDiv, { isPc: isPc },
                    react_1.default.createElement(redux_form_1.Field, { innerRef: alCdRef, name: "alCd", 
                        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                        tabIndex: 10, id: "alCd", placeholder: "AL", component: TextInput_1.default, maxLength: 2, width: 60, componentOnBlur: alToUpperCase, validate: [myValidates.requiredAlApoCdPair, validates.isOkAl, myValidates.isOalAlCd], isShadowOnFocus: true })),
                react_1.default.createElement(InputDiv, { isPc: isPc },
                    react_1.default.createElement(redux_form_1.Field, { name: "apoCd", 
                        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                        tabIndex: 20, component: SuggestSelectBox_1.default, placeholder: "APO", options: apoOptions, width: 77, maxLength: 3, validate: [myValidates.requiredAlApoCdPair, validates.halfWidthApoCd], isShadowOnFocus: true })),
                react_1.default.createElement(SubmitButtonContainer, { isPc: isPc },
                    react_1.default.createElement(PrimaryButton_1.default, { text: "Search", tabIndex: -1 })))))));
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = (searchParams, dispatch, props) => {
    if (searchParams) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign, @typescript-eslint/no-unsafe-argument
        searchParams.flt = (0, commonUtil_1.toUpperCase)(searchParams.flt);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign, @typescript-eslint/no-unsafe-argument
        searchParams.alCd = (0, commonUtil_1.toUpperCase)(searchParams.alCd);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const searchOalFlightSchedule = () => dispatch((0, oalFlightSchedule_1.search)({ oalSearchParams: searchParams }));
    if (props.isEdited) {
        dispatch((0, oalFlightSchedule_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M40017C({ onYesButton: searchOalFlightSchedule }) }));
    }
    else {
        searchOalFlightSchedule();
    }
};
const Wrapper = styled_components_1.default.div `
  width: 100%;
`;
const SearchFormContainer = styled_components_1.default.form `
  height: 60px;
  padding-left: ${({ isPc }) => (isPc ? "20px" : "16px")};
  padding-right: ${({ isPc }) => (isPc ? "20px" : "10px")};
  display: flex;
  align-items: center;
  background: #e4f2f7;
  > label {
    display: block;
    font-size: 14px;
    color: ${(props) => props.theme.color.PRIMARY};
    /* margin-bottom: 6px; */
  }
`;
const SearchTypeDiv = styled_components_1.default.div `
  display: flex;
  align-items: center;
  > label {
    font-size: 18px;
    line-height: 1.3;
    margin-right: ${({ isPc }) => (isPc ? "20px" : "6px")};
  }
  > label:last-child {
    font-size: 16px;
    line-height: inherit;
    margin-right: 0;
  }
`;
const FromToDiv = styled_components_1.default.div `
  z-index: 100;
  display: flex;
  align-items: center;
  margin-left: ${({ isPc }) => (isPc ? "20px" : "14px")};
  > div:first-child {
    margin-right: 2px;
  }
  > div:last-child {
    margin-left: 2px;
  }
`;
const OpeCsDiv = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-left: 14px;
  > div {
    margin: 0 4px;
  }
`;
const InputDiv = styled_components_1.default.div `
  z-index: 100;
  display: flex;
  align-items: center;
  margin-left: ${({ isPc }) => (isPc ? "20px" : "14px")};
`;
const CheckBoxDiv = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-left: ${({ isPc }) => (isPc ? "16px" : "12px")};
  > label {
    margin-right: 4px;
  }
`;
const SubmitButtonContainer = styled_components_1.default.div `
  width: 100px;
  margin-left: ${({ isPc }) => (isPc ? "26px" : "14px")};
`;
/// ////////////////////////
// コネクト
/// ////////////////////////
const formName = "oalFlightScheduleSearch";
const defaultInitialValues = {
    searchType: "FLT",
    dateFrom: "",
    dateTo: "",
    opeCsFlg: false,
    flt: "",
    depApoCd: "",
    arrApoCd: "",
    casualFlg: false,
    nextToFlg: false,
    alCd: "",
    apoCd: "",
};
const mapStateToProps = (state) => {
    const formSyncErrors = (0, redux_form_1.getFormSyncErrors)(formName)(state);
    const searchTypeValue = (0, redux_form_1.formValueSelector)(formName)(state, "searchType");
    const innerDateFromValue = (0, redux_form_1.formValueSelector)(formName)(state, "dateFrom");
    const workDateFrom = (0, redux_form_1.formValueSelector)(formName)(state, "dateFrom");
    const dateFromValue = workDateFrom ? (0, dayjs_1.default)(workDateFrom, "YYYY-MM-DD").format("DDMMM").toUpperCase() : "";
    const innerDateToValue = (0, redux_form_1.formValueSelector)(formName)(state, "dateTo");
    const workDateTo = (0, redux_form_1.formValueSelector)(formName)(state, "dateTo");
    const dateToValue = workDateTo ? (0, dayjs_1.default)(workDateTo, "YYYY-MM-DD").format("DDMMM").toUpperCase() : "";
    const casualFlg = (0, redux_form_1.formValueSelector)(formName)(state, "casualFlg");
    const nextToFlg = (0, redux_form_1.formValueSelector)(formName)(state, "nextToFlg");
    const initialValues = defaultInitialValues;
    if (window.location.search) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const qs = query_string_1.default.parse(window.location.search);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (qs.flt && qs.dateFrom) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            initialValues.flt = qs.flt;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            initialValues.dateFrom = qs.dateFrom;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (qs.casualFlg === "true") {
                initialValues.casualFlg = true;
            }
        }
    }
    return {
        oalFlightScheduleState: state.oalFlightSchedule,
        master: state.account.master,
        formSyncErrors,
        searchTypeValue,
        dateFromValue,
        innerDateFromValue,
        dateToValue,
        innerDateToValue,
        casualFlg,
        nextToFlg,
        initialValues,
    };
};
const OalFlightScheduleSearchForm = (0, redux_form_1.reduxForm)({
    form: formName,
    onSubmit,
    shouldValidate: () => true,
})(OalFlightScheduleSearch);
exports.default = (0, react_redux_1.connect)(mapStateToProps)(OalFlightScheduleSearchForm);
//# sourceMappingURL=OalFlightScheduleSearch.js.map