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
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const lodash_1 = require("lodash");
const commonUtil_1 = require("../../lib/commonUtil");
const storage_1 = require("../../lib/storage");
const commonConst_1 = require("../../lib/commonConst");
const notifications_1 = require("../../lib/notifications");
const validates = __importStar(require("../../lib/validators"));
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const RadioButton_1 = __importDefault(require("../atoms/RadioButton"));
const SelectBox_1 = __importDefault(require("../atoms/SelectBox"));
const SuggestSelectBox_1 = __importDefault(require("../atoms/SuggestSelectBox"));
const TextInput_1 = __importDefault(require("../atoms/TextInput"));
const FlightList_1 = __importDefault(require("./FlightList"));
const UpdateRmksPopup_1 = __importDefault(require("./UpdateRmksPopup"));
const MultipleCreatableInput_1 = __importDefault(require("../atoms/MultipleCreatableInput"));
const CheckBoxWithLabel_1 = __importDefault(require("../atoms/CheckBoxWithLabel"));
const CheckboxGroup_1 = __importDefault(require("../atoms/CheckboxGroup"));
const myValidates = __importStar(require("../../lib/validators/flightListValidator"));
const ServerErrorItems = {
    dateFrom: ["dateFrom"],
};
const FlightSearchForm = (props) => {
    const AL_CODE_LIST_ITEM_MAX = 5;
    const { dispatch } = props;
    const rmksTextRef = (0, react_1.useRef)(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [scrollTop, setScrollTop] = (0, react_1.useState)(0);
    const [rmksPopupIsOpen, setRmksPopupIsOpen] = (0, react_1.useState)(false);
    const [rmksPopupWidth, setRmksPopupWidth] = (0, react_1.useState)(0);
    const [rmksPopupHeight, setRmksPopupHeight] = (0, react_1.useState)(0);
    const [rmksPopupTop, setRmksPopupTop] = (0, react_1.useState)(0);
    const [rmksPopupLeft, setRmksPopupLeft] = (0, react_1.useState)(0);
    const [trCdIsEmpty, setTrCdIsEmpty] = (0, react_1.useState)(false);
    const [fetchValidationErrors, setFetchValidationErrors] = (0, react_1.useState)([]);
    // refFltInput = React.createRef<HTMLInputElement>();
    const filterSortJalGrpAlCd = (airlines) => airlines.filter((al) => al.jalGrpFlg === true).sort((a, b) => a.dispSeq - b.dispSeq);
    (0, react_1.useEffect)(() => {
        // 画面を開いた時にデフォルトを設定
        if (!props.dateValue) {
            props.change("date", (0, dayjs_1.default)().format("YYYY-MM-DD"));
            props.change("dateFrom", (0, dayjs_1.default)().format("YYYY-MM-DD"));
            props.change("dateTo", (0, dayjs_1.default)().format("YYYY-MM-DD"));
        }
        if (props.searchTypeValue === "MVT") {
            const targetNode = document.getElementById("jalGrpFlgMvt");
            if (targetNode) {
                const masterAlCd = filterSortJalGrpAlCd(props.master.airlines).map((al) => al.alCd);
                if (!!props.trCdList && props.trCdList.length !== 0 && props.trCdList.length !== masterAlCd.length) {
                    // 1つ以上チェック
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    targetNode.indeterminate = true;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    targetNode.checked = false;
                    props.change("jalGrpFlgMvt", true);
                    setTrCdIsEmpty(false);
                }
                else if (!!props.trCdList && props.trCdList.length === masterAlCd.length) {
                    // 全てチェック
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    targetNode.indeterminate = false;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    targetNode.checked = true;
                    props.change("jalGrpFlgMvt", true);
                    setTrCdIsEmpty(false);
                }
                else {
                    // チェックなし
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    targetNode.indeterminate = false;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    targetNode.checked = false;
                    props.change("jalGrpFlgMvt", false);
                    setTrCdIsEmpty(true);
                }
            }
        }
    }, [props]);
    const handleFltKeyPress = (e) => {
        if (e.key === "Enter") {
            props.change("flt", props.casFltFlg ? (0, commonUtil_1.toUpperCase)(e.target.value) : (0, commonUtil_1.formatFlt)(e.target.value));
        }
    };
    const handleDateInputPopup = () => {
        dispatch(props.openDateTimeInputPopup({
            valueFormat: "YYYY-MM-DD",
            currentValue: props.innerDateValue,
            onEnter: (value) => props.change("date", value),
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onUpdate: async (value) => {
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await props.change("date", value);
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await props.dispatch((0, redux_form_1.submit)("flightSearch"));
            },
            customUpdateButtonName: "Search",
            unableDelete: true,
        }));
    };
    const handleDateInputFromPopup = () => {
        dispatch(props.openDateTimeInputPopup({
            valueFormat: "YYYY-MM-DD",
            currentValue: props.innerDateFromValue,
            onEnter: (value) => {
                props.change("dateFrom", value);
                setFetchValidationErrors((0, lodash_1.difference)(fetchValidationErrors, ServerErrorItems.dateFrom));
            },
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onUpdate: async (value) => {
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await props.change("dateFrom", value);
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await props.dispatch((0, redux_form_1.submit)("flightSearch"));
            },
            customUpdateButtonName: "Search",
            unableDelete: true,
        }));
    };
    const handleDateInputToPopup = () => {
        dispatch(props.openDateTimeInputPopup({
            valueFormat: "YYYY-MM-DD",
            currentValue: props.innerDateToValue,
            onEnter: (value) => props.change("dateTo", value),
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onUpdate: async (value) => {
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await props.change("dateTo", value);
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await props.dispatch((0, redux_form_1.submit)("flightSearch"));
            },
            customUpdateButtonName: "Search",
            unableDelete: true,
        }));
    };
    const handleFlightNumberInputPopup = () => {
        dispatch(props.openFlightNumberInputPopup({
            formName: "flightSearch",
            fieldName: "flt",
            currentFlightNumber: props.fltValue,
            executeSubmit: true,
            onEnter: () => { },
            canOnlyAlCd: false,
        }));
    };
    const handleJalGrpFlgAll = (e) => {
        const alCd = filterSortJalGrpAlCd(master.airlines).map((al) => al.alCd);
        if (e.target.checked) {
            props.change("trCdList", alCd);
        }
        else {
            props.change("trCdList", []);
        }
    };
    const closeRmksPopup = (rmksText) => {
        if (props.common && props.common.headerInfo.apoRmksInfo === rmksText) {
            setRmksPopupIsOpen(false);
        }
        else if (props.showConfirmation) {
            void dispatch(props.showConfirmation({ onClickYes: () => setRmksPopupIsOpen(false) }));
        }
    };
    const openRmksPopup = () => {
        if (props.getHeaderInfo) {
            const apoCd = props.jobAuth.user.myApoCd;
            const open = () => {
                const node = rmksTextRef.current;
                if (node) {
                    setRmksPopupIsOpen(true);
                    setRmksPopupWidth(node.clientWidth);
                    setRmksPopupHeight(node.clientHeight);
                    setRmksPopupTop(node.getBoundingClientRect().top);
                    setRmksPopupLeft(node.getBoundingClientRect().left);
                }
            };
            const close = () => {
                setRmksPopupIsOpen(false);
            };
            void dispatch(props.getHeaderInfo({ apoCd, openRmksPopup: open, closeRmksPopup: close }));
        }
    };
    const isRmksEnabled = () => {
        if (props.common) {
            return (!!props.jobAuth.user.myApoCd &&
                props.jobAuth.user.myApoCd === props.common.headerInfo.apoCd &&
                (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateAireportRemarks, props.jobAuth.jobAuth));
        }
        return false;
    };
    const updateRmks = (text) => {
        if (props.common && props.showNotificationAirportRmksNoChange && props.updateAirportRemarks) {
            if (text === props.common.headerInfo.apoRmksInfo) {
                void dispatch(props.showNotificationAirportRmksNoChange());
            }
            else {
                void dispatch(props.updateAirportRemarks({
                    apoCd: props.jobAuth.user.myApoCd,
                    apoRmksInfo: text,
                    closeAirportRemarksPopup: () => setRmksPopupIsOpen(false),
                }));
            }
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shipToUpperCase = (e) => {
        if (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            props.change("ship", (0, commonUtil_1.toUpperCase)(e.target.value));
        }
    };
    // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
    const untouchField = () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment
        const { untouch, formSyncErrors } = props;
        const validationErrorsFields = ["arrApoCd"]; // 条件必須の項目はvalidateを持たないため常にtouchedをfalseにする。
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.keys(formSyncErrors).forEach((key) => validationErrorsFields.push(key));
        if (validationErrorsFields.length) {
            untouch("flightSearch", ...validationErrorsFields);
            notifications_1.NotificationCreator.removeAll({ dispatch: props.dispatch });
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fltZeroPadding = (e) => {
        if (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            props.change("flt", props.casFltFlg ? (0, commonUtil_1.toUpperCase)(e.target.value) : (0, commonUtil_1.formatFlt)(e.target.value));
        }
    };
    const getIsForceError = (fieldName) => {
        const errorItems = ServerErrorItems[fieldName];
        for (let xi = 0; xi < errorItems.length; xi++) {
            const includes = fetchValidationErrors.includes(errorItems[xi]);
            if (includes)
                return true;
        }
        return false;
    };
    const { searchTypeValue, dateValue, dateFromValue, dateToValue, master, handleSubmit, flightSearch, handleFlightDetail, common, jobAuth, handleStationOperationTask, openOalFlightMovementModal, openMvtMsgModal, } = props;
    // 初期設定 JLGRP 全チェック
    (0, react_1.useEffect)(() => {
        const alCd = filterSortJalGrpAlCd(master.airlines).map((al) => al.alCd);
        props.change("trCdList", alCd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        // サーバーのエラーがある場合、赤枠を表示させる
        if (!props.flightSearch.isFetching) {
            setFetchValidationErrors(props.flightSearch.fetchValidationErrors);
        }
    }, [props.flightSearch, props.flightSearch.fetchValidationErrors, props.flightSearch.isFetching]);
    const hasApo = !!jobAuth.user.myApoCd;
    const apoRmksInfo = common ? (common.headerInfo ? common.headerInfo.apoRmksInfo : "") : "";
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(ScrollArea, { isPc: storage_1.storage.isPc, isIpad: storage_1.storage.isIpad, hasApo: hasApo },
            hasApo && storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone && (react_1.default.createElement(AptRmksContainer, null,
                react_1.default.createElement(AptRmks, { ref: rmksTextRef, onClick: openRmksPopup, isEmpty: !apoRmksInfo },
                    react_1.default.createElement("div", null, apoRmksInfo || "Airport Remarks")))),
            react_1.default.createElement(SearchFormContainer, { onSubmit: handleSubmit },
                react_1.default.createElement(SearchTypeRadio, null,
                    react_1.default.createElement("div", { className: "searchTypeRadioContainer" },
                        react_1.default.createElement(redux_form_1.Field, { name: "searchType", id: "searchTypeFLT", tabIndex: -1, type: "radio", value: "FLT", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField() }),
                        react_1.default.createElement("label", { htmlFor: "searchTypeFLT" }, "FLT")),
                    react_1.default.createElement("div", { className: "searchTypeRadioContainer" },
                        react_1.default.createElement(redux_form_1.Field, { name: "searchType", id: "searchTypeLEG", tabIndex: -1, type: "radio", value: "LEG", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField() }),
                        react_1.default.createElement("label", { htmlFor: "searchTypeLEG" }, "LEG")),
                    react_1.default.createElement("div", { className: "searchTypeRadioContainer" },
                        react_1.default.createElement(redux_form_1.Field, { name: "searchType", id: "searchTypeSHIP", tabIndex: -1, type: "radio", value: "SHIP", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField() }),
                        react_1.default.createElement("label", { htmlFor: "searchTypeSHIP" }, "SHIP")),
                    react_1.default.createElement("div", { className: "searchTypeRadioContainer" },
                        react_1.default.createElement(redux_form_1.Field, { name: "searchType", id: "searchTypeAL", tabIndex: -1, type: "radio", value: "AL", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField() }),
                        react_1.default.createElement("label", { htmlFor: "searchTypeAL" }, "AL")),
                    react_1.default.createElement("div", { className: "searchTypeRadioContainer" },
                        react_1.default.createElement(redux_form_1.Field, { name: "searchType", id: "searchTypeMVT", tabIndex: -1, type: "radio", value: "MVT", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField() }),
                        react_1.default.createElement("label", { htmlFor: "searchTypeMVT" },
                            react_1.default.createElement("span", null, "MVT"),
                            react_1.default.createElement("span", null, "CHK")))),
                react_1.default.createElement(SearchContainer, null,
                    react_1.default.createElement(SearchFormContents, null,
                        searchTypeValue === "FLT" && (react_1.default.createElement(FltForm, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "date", tabIndex: -1, component: TextInput_1.default, width: 68, showKeyboard: handleDateInputPopup, displayValue: dateValue }),
                            react_1.default.createElement(Flt, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "flt", id: "flt", tabIndex: 0, placeholder: "FLT", component: TextInput_1.default, width: 130, maxLength: 10, componentOnBlur: fltZeroPadding, onKeyPress: handleFltKeyPress, validate: props.casFltFlg
                                        ? [validates.required, validates.isOkCasualFlt]
                                        : [validates.required, validates.lengthFlt3, validates.halfWidthFlt], showKeyboard: storage_1.storage.isPc || props.casFltFlg ? undefined : handleFlightNumberInputPopup, isShadowOnFocus: true, autoFocus: true })),
                            react_1.default.createElement(CasFltCheckBox, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "casFltFlg", id: "casFltFlg", 
                                    // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                                    tabIndex: 1, component: CheckBoxWithLabel_1.default, checked: props.casFltFlg, disabled: false, isShadowOnFocus: true, text: "Casual" })),
                            react_1.default.createElement(SubmitButtonContainer, null,
                                react_1.default.createElement(PrimaryButton_1.default, { text: "Search", tabIndex: -1 })))),
                        searchTypeValue === "LEG" && (react_1.default.createElement(LegFrom, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "date", tabIndex: -1, component: TextInput_1.default, width: 68, showKeyboard: handleDateInputPopup, isShadowOnFocus: true, displayValue: dateValue }),
                            react_1.default.createElement(Leg, null,
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement(redux_form_1.Field, { name: "depApoCd", tabIndex: 0, component: SuggestSelectBox_1.default, placeholder: "DEP", options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 77, maxLength: 3, validate: [validates.requiredApoCdPair, validates.halfWidthApoCd], isShadowOnFocus: true, autoFocus: true }),
                                    "-",
                                    react_1.default.createElement(redux_form_1.Field, { name: "arrApoCd", tabIndex: 0, component: SuggestSelectBox_1.default, placeholder: "ARR", options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 77, maxLength: 3, validate: [validates.requiredApoCdPair, validates.halfWidthApoCd], isShadowOnFocus: true }))),
                            react_1.default.createElement(SubmitButtonContainer, null,
                                react_1.default.createElement(PrimaryButton_1.default, { text: "Search", tabIndex: -1 })),
                            react_1.default.createElement(LegSecond, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "jalGrpFlg", tabIndex: 0, component: SelectBox_1.default, options: [
                                        { label: "JL GRP", value: true },
                                        { label: "OAL", value: false },
                                        { label: "ALL", value: "ALL" },
                                    ], width: 86, isShadowOnFocus: true }),
                                react_1.default.createElement(redux_form_1.Field, { name: "intDomCat", tabIndex: 0, component: SelectBox_1.default, options: [
                                        { label: "D/I", value: "D/I" },
                                        { label: "DOM", value: "D" },
                                        { label: "INT", value: "I" },
                                    ], width: 69, isShadowOnFocus: true })))),
                        searchTypeValue === "SHIP" && (react_1.default.createElement(ShipForm, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "date", tabIndex: -1, component: TextInput_1.default, width: 68, showKeyboard: handleDateInputPopup, isShadowOnFocus: true, displayValue: dateValue }),
                            react_1.default.createElement(Ship, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "ship", tabIndex: 0, id: "ship", placeholder: "SHIP", component: TextInput_1.default, maxLength: 10, width: 130, componentOnBlur: shipToUpperCase, validate: [validates.requiredShip, validates.lengthShip2, validates.halfWidthShip], isShadowOnFocus: true, autoFocus: true })),
                            react_1.default.createElement(SubmitButtonContainer, null,
                                react_1.default.createElement(PrimaryButton_1.default, { text: "Search", tabIndex: -1 })))),
                        searchTypeValue === "AL" && (react_1.default.createElement(AlForm, null,
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(redux_form_1.Field, { name: "date", tabIndex: -1, component: TextInput_1.default, width: 68, showKeyboard: handleDateInputPopup, isShadowOnFocus: true, displayValue: dateValue }),
                                react_1.default.createElement(Leg, null,
                                    react_1.default.createElement("div", null,
                                        react_1.default.createElement(redux_form_1.Field, { name: "depApoCd", tabIndex: 0, component: SuggestSelectBox_1.default, placeholder: "DEP", options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 77, maxLength: 3, validate: [validates.halfWidthApoCd], isShadowOnFocus: true, autoFocus: true }),
                                        "-",
                                        react_1.default.createElement(redux_form_1.Field, { name: "arrApoCd", tabIndex: 0, component: SuggestSelectBox_1.default, placeholder: "ARR", options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 77, maxLength: 3, validate: [validates.halfWidthApoCd], isShadowOnFocus: true }))),
                                react_1.default.createElement(SubmitButtonContainer, null,
                                    react_1.default.createElement(PrimaryButton_1.default, { text: "Search", tabIndex: -1 }))),
                            react_1.default.createElement(AlCdList, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "alCdList", placeholder: "AL", component: MultipleCreatableInput_1.default, validate: [validates.required, validates.unique, validates.isOkAls], filterValue: (value) => value.slice(0, 2), 
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    formatValues: (values) => values.map((value) => (0, commonUtil_1.toUpperCase)(value)), maxValLength: AL_CODE_LIST_ITEM_MAX })))),
                        searchTypeValue === "MVT" && (react_1.default.createElement(MvtChkForm, null,
                            react_1.default.createElement(MvtChkRowOne, null,
                                react_1.default.createElement(DateFromTo, null,
                                    react_1.default.createElement(redux_form_1.Field, { name: "dateFrom", tabIndex: -1, component: TextInput_1.default, width: 68, showKeyboard: handleDateInputFromPopup, isShadowOnFocus: true, displayValue: dateFromValue, validate: [myValidates.rangeDateFromDateTo, myValidates.orderDateFromDateTo], isForceError: getIsForceError("dateFrom") }),
                                    "-",
                                    react_1.default.createElement(redux_form_1.Field, { name: "dateTo", tabIndex: -1, component: TextInput_1.default, width: 68, showKeyboard: handleDateInputToPopup, isShadowOnFocus: true, displayValue: dateToValue, validate: [myValidates.rangeDateFromDateTo, myValidates.orderDateFromDateTo] })),
                                react_1.default.createElement(IntDomCat, null,
                                    react_1.default.createElement(redux_form_1.Field, { name: "intDomCat", tabIndex: 0, component: SelectBox_1.default, options: [
                                            { label: "D/I", value: "D/I" },
                                            { label: "DOM", value: "D" },
                                            { label: "INT", value: "I" },
                                        ], width: 69, isShadowOnFocus: true })),
                                react_1.default.createElement(SubmitButtonContainer, null,
                                    react_1.default.createElement(PrimaryButton_1.default, { text: "Search", tabIndex: -1 }))),
                            react_1.default.createElement(MvtChkRowTwo, null,
                                react_1.default.createElement(DepArr, null,
                                    react_1.default.createElement(redux_form_1.Field, { name: "depApoCd", tabIndex: 0, component: SuggestSelectBox_1.default, placeholder: "DEP", options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 77, maxLength: 3, validate: [validates.requiredApoCdPair, validates.halfWidthApoCd], isShadowOnFocus: true, autoFocus: true }),
                                    "-",
                                    react_1.default.createElement(redux_form_1.Field, { name: "arrApoCd", tabIndex: 0, component: SuggestSelectBox_1.default, placeholder: "ARR", options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 77, maxLength: 3, validate: [validates.requiredApoCdPair, validates.halfWidthApoCd], isShadowOnFocus: true })),
                                react_1.default.createElement(MvtSearchTypeRadio, null,
                                    react_1.default.createElement("div", { className: "mvtTypeRadio" },
                                        react_1.default.createElement(redux_form_1.Field, { name: "mvtType", id: "mvtTypeBoth", tabIndex: -1, type: "radio", value: "BOTH", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField() }),
                                        react_1.default.createElement("label", { htmlFor: "mvtTypeBoth" },
                                            react_1.default.createElement("span", null, "BOTH"))),
                                    react_1.default.createElement("div", { className: "mvtTypeRadio" },
                                        react_1.default.createElement(redux_form_1.Field, { name: "mvtType", id: "mvtTypeDep", tabIndex: -1, type: "radio", value: "DEP", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField() }),
                                        react_1.default.createElement("label", { htmlFor: "mvtTypeDep" },
                                            react_1.default.createElement("span", null, "DEP"),
                                            react_1.default.createElement("span", null, "MVT"))),
                                    react_1.default.createElement("div", { className: "mvtTypeRadio" },
                                        react_1.default.createElement(redux_form_1.Field, { name: "mvtType", id: "mvtTypeArr", tabIndex: -1, type: "radio", value: "ARR", component: RadioButton_1.default, isShadowOnFocus: true, onClick: () => untouchField() }),
                                        react_1.default.createElement("label", { htmlFor: "mvtTypeArr" },
                                            react_1.default.createElement("span", null, "ARR"),
                                            react_1.default.createElement("span", null, "MVT"))))),
                            react_1.default.createElement(MvtChkRowThree, null,
                                react_1.default.createElement(JalGrpContainer, { trCdIsEmpty: trCdIsEmpty },
                                    react_1.default.createElement(JalGrpLabel, { htmlFor: "jalGrpFlgMvt" },
                                        react_1.default.createElement(redux_form_1.Field, { name: "jalGrpFlgMvt", id: "jalGrpFlgMvt", 
                                            // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                                            tabIndex: 1, component: CheckBoxWithLabel_1.default, disabled: false, isShadowOnFocus: true, onChange: handleJalGrpFlgAll }),
                                        react_1.default.createElement("span", null, "JL GRP")),
                                    react_1.default.createElement(redux_form_1.Field, { name: "trCdList", options: filterSortJalGrpAlCd(master.airlines).map((al) => ({ label: al.alCd, value: al.alCd })), component: CheckboxGroup_1.default, tabIndex: 21, validate: [validates.required] })))))))),
            flightSearch.isSearched && (react_1.default.createElement(FlightList_1.default, { eLegList: flightSearch.eLegList, onFlightDetail: handleFlightDetail, selectedFlightIdentifier: flightSearch.selectedFlightIdentifier, stationOperationTaskEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOperationTask, jobAuth.jobAuth), onStationOperationTask: handleStationOperationTask, openOalFlightMovementModal: openOalFlightMovementModal, flightMovementEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalFlightMovement, jobAuth.jobAuth), flightDetailEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth), isModalComponent: false, mvtMsgEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openMvtMsg, jobAuth.jobAuth), openMvtMsgModal: openMvtMsgModal }))),
        react_1.default.createElement(UpdateRmksPopup_1.default, { isOpen: rmksPopupIsOpen, width: rmksPopupWidth, height: rmksPopupHeight, top: rmksPopupTop, left: rmksPopupLeft, initialRmksText: apoRmksInfo, isSubmitable: isRmksEnabled(), placeholder: "Airport Remarks", onClose: closeRmksPopup, update: updateRmks })));
};
const onSubmit = (searchParams, dispatch, props) => {
    const { jobAuth, searchFlight, casFltFlg } = props;
    if (searchParams) {
        const params = searchParams;
        params.flt = casFltFlg ? (0, commonUtil_1.toUpperCase)(params.flt) : (0, commonUtil_1.formatFlt)(params.flt);
        params.ship = (0, commonUtil_1.toUpperCase)(params.ship);
    }
    dispatch(searchFlight({ searchParams, myApoCd: jobAuth.user.myApoCd }));
};
const APT_RMKS_HEIGHT = "66px";
const FOOTER_HEIGHT = "54px";
const PADDING_HEIGHT = "16px";
const headerHeight = (isPc, isIpad, header, hasApo) => isPc
    ? `${header.default} - ${PADDING_HEIGHT}`
    : isIpad
        ? `${header.tablet} - ${PADDING_HEIGHT}`
        : hasApo
            ? `${header.mobile} - ${FOOTER_HEIGHT}`
            : `${FOOTER_HEIGHT} - ${header.statusBar}`;
const Wrapper = styled_components_1.default.div `
  width: 100%;
`;
const ScrollArea = styled_components_1.default.div `
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
  ${({ isPc, isIpad, theme, hasApo }) => `height: calc(100vh - ${headerHeight(isPc, isIpad, theme.layout.header, hasApo)});`}
`;
const SearchFormContainer = styled_components_1.default.form ``;
const SearchContainer = styled_components_1.default.div `
  background: #e4f2f7;
  padding: 12x 10px 14px 8px;
`;
const AptRmksContainer = styled_components_1.default.div `
  height: ${APT_RMKS_HEIGHT};
  padding: 0 10px 15px;
  background: ${({ theme }) => theme.color.HEADER_GRADIENT};
`;
const AptRmks = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  max-width: 700px;
  padding: 3px 10px 3px;
  line-height: 1.6em;
  border-radius: 1px;
  border: none;
  color: ${(props) => (props.isEmpty ? props.theme.color.PLACEHOLDER : props.theme.color.DEFAULT_FONT_COLOR)};
  background: ${(props) => props.theme.color.WHITE};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-align: start;
  -webkit-box-orient: vertical;
  word-break: break-all;
  overflow: hidden;
  align-items: space-between;
  box-shadow: 0px 0px 1px 1px #ccc inset;
  cursor: pointer;
`;
const SearchTypeRadio = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: left;
  margin: 14px auto 12px 8px;
  .searchTypeRadioContainer {
    input[type="radio"] {
      display: none;
    }
    :first-child {
      border: solid #346181;
      border-width: 1px 1px 1px 1px;
    }
    :last-child {
      border: solid #346181;
      border-width: 1px 1px 1px 0px;
    }
    :not(:first-child):not(:last-child) {
      border: solid #346181;
      border-width: 1px 1px 1px 0px;
    }
    width: 71px;
    label {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: pre-line;
      flex-direction: column;
      height: 36px;
      padding: 0px 20px;
      font-size: 16px;
      background: #ffffff 0% 0% no-repeat padding-box;
      letter-spacing: 0px;
      color: #346181;
      opacity: 1;
      span {
        line-height: 14px;
      }
    }
    input:checked + label {
      background: #346181 0% 0% no-repeat padding-box;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }
`;
const SearchFormContents = styled_components_1.default.div `
  padding: 12px 10px 14px 8px;
`;
const FltForm = styled_components_1.default.div `
  display: flex;
`;
const LegFrom = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;

  label {
    display: block;
    font-size: 14px;
    color: ${(props) => props.theme.color.PRIMARY};
    margin-bottom: 6px;
  }
`;
const ShipForm = styled_components_1.default.div `
  display: flex;
  label {
    display: block;
    font-size: 14px;
    color: ${(props) => props.theme.color.PRIMARY};
    margin-bottom: 6px;
  }
`;
const Flt = styled_components_1.default.div `
  margin-left: 10px;
`;
const SubmitButtonContainer = styled_components_1.default.div `
  width: 100px;
  margin-left: auto;
`;
const Leg = styled_components_1.default.div `
  margin-left: 10px;
  > div {
    display: flex;
    align-items: center;
    > div:first-child {
      margin-right: 2px;
    }
    > div:last-child {
      margin-left: 2px;
    }
  }
`;
const LegSecond = styled_components_1.default.div `
  display: flex;
  margin-left: 78px;
  margin-top: 11px;
  > div {
    margin-right: 10px;
  }
`;
const Ship = styled_components_1.default.div `
  margin-left: 10px;
`;
const AlForm = styled_components_1.default.div `
  label {
    display: block;
    font-size: 14px;
    color: ${(props) => props.theme.color.PRIMARY};
    margin-bottom: 6px;
  }

  > div:first-child {
    display: flex;
    flex-wrap: wrap;
  }
`;
const MvtChkForm = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const MvtChkRowOne = styled_components_1.default.div `
  display: flex;
`;
const MvtChkRowTwo = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const DepArr = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;
const MvtChkRowThree = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
`;
const AlCdList = styled_components_1.default.div `
  margin-top: 11px;
`;
const CasFltCheckBox = styled_components_1.default.div `
  margin-left: 6px;
`;
const DateFromTo = styled_components_1.default.div `
  display: flex;
  align-items: center;
  gap: 2px;
`;
const IntDomCat = styled_components_1.default.div `
  margin-left: 13px;
`;
const MvtSearchTypeRadio = styled_components_1.default.div `
  display: flex;
  margin-left: auto;
  .mvtTypeRadio {
    input[type="radio"] {
      display: none;
    }
    :first-child {
      border: solid #346181;
      border-width: 1px 1px 1px 1px;
    }
    :last-child {
      border: solid #346181;
      border-width: 1px 1px 1px 0px;
    }
    :not(:first-child):not(:last-child) {
      border: solid #346181;
      border-width: 1px 1px 1px 0px;
    }
    label {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: pre-line;
      flex-direction: column;
      height: 36px;
      width: 57px;
      font-size: 16px;
      background: #ffffff 0% 0% no-repeat padding-box;
      letter-spacing: 0px;
      color: #346181;
      opacity: 1;
      span {
        line-height: 14px;
      }
    }
    input:checked + label {
      background: #346181 0% 0% no-repeat padding-box;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }
`;
const CheckboxContainer = styled_components_1.default.div `
  label {
    display: flex;
    align-items: center;
    margin-right: 8px;
    font-size: 17px;
  }
  label:last-child {
    margin: 0px;
  }
  input[type="checkbox"] {
    margin-right: 6px;
    appearance: none;
    width: 30px;
    height: 30px;
    border: 1px solid ${(props) => (props.trCdIsEmpty ? props.theme.color.border.ERROR : props.theme.color.PRIMARY)};
    background: #fff;
    position: relative;
    outline: none;
    &:checked {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
    }
    &:indeterminate {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 14px;
        left: 7px;
        width: 16px;
        border-bottom: 2px solid #fff;
      }
    }
  }
`;
const JalGrpContainer = (0, styled_components_1.default)(CheckboxContainer) `
  flex-grow: 1;
  flex-wrap: wrap;
  > div:last-child {
    display: flex;
    flex-wrap: wrap;
    margin-left: 8px;
    label {
      cursor: pointer;
      height: 33px;
      margin-top: 14px;
      text-align: left;
      line-height: 22px;
      font-size: 17px;
      letter-spacing: 0px;
      color: #222222;
      opacity: 1;
    }
  }
`;
const JalGrpLabel = styled_components_1.default.label `
  cursor: pointer;
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
  span {
    text-align: left;
    line-height: 22px;
    font-size: 17px;
    letter-spacing: 0px;
    color: #222222;
    opacity: 1;
  }
`;
const FlightSearchWithForm = (0, redux_form_1.reduxForm)({
    form: "flightSearch",
    onSubmit,
    shouldValidate: () => true,
    initialValues: {
        searchType: "FLT",
        date: "",
        jalGrpFlg: true,
        intDomCat: "D/I",
        casFltFlg: false,
        ship: "",
        flt: "",
        mvtType: "BOTH",
    },
})(FlightSearchForm);
const selector = (0, redux_form_1.formValueSelector)("flightSearch");
exports.default = (0, react_redux_1.connect)((state) => {
    const searchTypeValue = selector(state, "searchType");
    const shipValue = selector(state, "ship");
    const fltValue = selector(state, "flt");
    const legDepValue = selector(state, "legDep");
    const innerDateValue = selector(state, "date");
    const innerDateFromValue = selector(state, "dateFrom");
    const innerDateToValue = selector(state, "dateTo");
    const date = selector(state, "date");
    const dateFrom = selector(state, "dateFrom");
    const dateTo = selector(state, "dateTo");
    const dateValue = date ? (0, dayjs_1.default)(date, "YYYY-MM-DD").format("DDMMM").toUpperCase() : "";
    const dateFromValue = dateFrom ? (0, dayjs_1.default)(dateFrom, "YYYY-MM-DD").format("DDMMM").toUpperCase() : "";
    const dateToValue = dateTo ? (0, dayjs_1.default)(dateTo, "YYYY-MM-DD").format("DDMMM").toUpperCase() : "";
    const casFltFlg = selector(state, "casFltFlg") || false;
    const alCdList = selector(state, "alCdList");
    const jalGrpFlgMvt = selector(state, "jalGrpFlgMvt");
    const trCdList = selector(state, "trCdList");
    return {
        searchTypeValue,
        shipValue,
        fltValue,
        legDepValue,
        dateValue,
        dateFromValue,
        dateToValue,
        innerDateValue,
        innerDateFromValue,
        innerDateToValue,
        casFltFlg,
        alCdList,
        jalGrpFlgMvt,
        trCdList,
    };
})(FlightSearchWithForm);
//# sourceMappingURL=FlightSearchForm.js.map