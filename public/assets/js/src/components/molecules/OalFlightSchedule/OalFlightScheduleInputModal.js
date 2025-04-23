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
exports.formSubName = exports.formName = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const react_modal_1 = __importDefault(require("react-modal"));
const hooks_1 = require("../../../store/hooks");
const commonUtil_1 = require("../../../lib/commonUtil");
const storage_1 = require("../../../lib/storage");
const notifications_1 = require("../../../lib/notifications");
const validates = __importStar(require("../../../lib/validators"));
// eslint-disable-next-line import/no-cycle
const myValidates = __importStar(require("../../../lib/validators/oalFlightScheduleValidator"));
const dateTimeInputPopup_1 = require("../../../reducers/dateTimeInputPopup");
const oalFlightSchedule_1 = require("../../../reducers/oalFlightSchedule");
const OalFlightScheduleType_1 = require("./OalFlightScheduleType");
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const SuggestSelectBox_1 = __importDefault(require("../../atoms/SuggestSelectBox"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const CheckBoxInput_1 = __importDefault(require("../../atoms/CheckBoxInput"));
const MultipleCreatableInput_1 = __importDefault(require("../../atoms/MultipleCreatableInput"));
const OalFlightScheduleInputModal = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const oalFlightSchedule = (0, hooks_1.useAppSelector)((state) => state.oalFlightSchedule);
    const [isEdited, setIsEdited] = (0, react_1.useState)(false);
    // オープン時の処理
    (0, react_1.useEffect)(() => {
        if (oalFlightSchedule.isOpenInputModal) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const { change, touch } = props;
            const { fltScheduleList, fltScheduleListInitial, inputRowIndex, inputChgType } = oalFlightSchedule;
            if (inputRowIndex !== null) {
                const fltSchedule = fltScheduleList[inputRowIndex];
                const fltScheduleInitial = fltScheduleListInitial[inputRowIndex];
                // 既に編集されている場合、変更を反映する（chgTypeは比較対象にしない）
                const isEditedFltSchedule = JSON.stringify(fltScheduleInitial) !==
                    JSON.stringify({
                        ...fltSchedule,
                        chgType: fltScheduleInitial.chgType,
                    });
                if (isEditedFltSchedule) {
                    // 変更を反映する
                    change(exports.formSubName, { ...fltSchedule, chgType: inputChgType });
                }
                // State初期化
                setIsEdited(false);
                // サーバーのエラーがある場合、タッチさせる
                if (!(0, lodash_isempty_1.default)(fltSchedule.updateValidationErrors)) {
                    const fieldNames = Object.keys(OalFlightScheduleType_1.serverErrorItems).map((fieldName) => `${exports.formSubName}.${fieldName}`);
                    touch(...fieldNames);
                }
                touch(exports.formSubName);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oalFlightSchedule.isOpenInputModal]);
    const getIsForceError = (fieldName) => {
        const { fltSchedule } = props.formValues;
        const errorItems = OalFlightScheduleType_1.serverErrorItems[fieldName];
        if (fltSchedule) {
            for (let xi = 0; xi < errorItems.length; xi++) {
                const includes = fltSchedule.updateValidationErrors.includes(errorItems[xi]);
                if (includes)
                    return true;
            }
        }
        return false;
    };
    const handleDateInputPopup = (yymmddValue, fieldName) => () => {
        const { fltSchedule } = props.formValues;
        if (fltSchedule) {
            const currentValue = (0, commonUtil_1.convertYYMMDDToDate)(yymmddValue) || "";
            const param = {
                valueFormat: "YYYY-MM-DD",
                currentValue,
                defaultSetting: { value: currentValue },
                onEnter: (value) => {
                    const newValue = value ? (0, dayjs_1.default)(value, "YYYY-MM-DD").format("YYMMDD") : "";
                    props.change(`${exports.formSubName}.${fieldName}`, newValue);
                    handleOnChange(fieldName)(newValue);
                },
            };
            dispatch((0, dateTimeInputPopup_1.openDateTimeInputPopup)(param));
        }
    };
    const handleDayTimeInputPopup = (dayTimeValue, fieldName) => () => {
        const { fltSchedule } = props.formValues;
        const param = {
            valueFormat: "DDHHmm",
            currentValue: dayTimeValue || "",
            defaultSetting: { value: dayTimeValue || "" },
            onEnter: (value) => {
                props.change(`${exports.formSubName}.${fieldName}`, value);
                handleOnChange(fieldName)(value);
            },
        };
        if (fltSchedule) {
            dispatch((0, dateTimeInputPopup_1.openDateTimeInputPopup)(param));
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOnChange = (fieldName) => (e) => {
        // 未編集の場合、ChgTypeをOtherに設定する
        const { fltSchedule } = props.formValues;
        const fltScheduleInitial = props.initialValues.fltSchedule;
        let inputValue = null;
        if (typeof e === "string") {
            inputValue = e;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        }
        else if (e && e.target) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            inputValue = e.target.value;
        }
        if (fltSchedule && !fltSchedule.chgType) {
            const chgType = "Other";
            const rowStatus = "Edited";
            props.change(`${exports.formSubName}.chgType`, chgType);
            props.change(`${exports.formSubName}.rowStatus`, rowStatus);
        }
        // casFltFlg, shipが入力されたら入力不可となる項目の値を初期値に戻す
        if ((fieldName === "shipNo" || fieldName === "casFltFlg") && e && fltSchedule && fltScheduleInitial) {
            if (inputValue) {
                if (fltSchedule.onwardFltName || fltSchedule.onwardOrgDate) {
                    props.change(`${exports.formSubName}.onwardFltName`, "");
                    props.change(`${exports.formSubName}.onwardOrgDate`, "");
                }
            }
            else {
                props.change(`${exports.formSubName}.onwardFltName`, fltScheduleInitial.onwardFltName);
                props.change(`${exports.formSubName}.onwardOrgDate`, fltScheduleInitial.onwardOrgDate);
            }
        }
        if ((fieldName === "arrApoCd" || fieldName === "depApoCd") &&
            fltSchedule &&
            fltScheduleInitial &&
            fltScheduleInitial.chgType === "RTE SKD") {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const arrApoCd = fieldName === "arrApoCd" ? e : fltSchedule.arrApoCd;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const depApoCd = fieldName === "depApoCd" ? e : fltSchedule.depApoCd;
            if (arrApoCd === fltScheduleInitial.arrApoCd && depApoCd === fltScheduleInitial.depApoCd) {
                props.change(`${exports.formSubName}.etd`, fltScheduleInitial.etd);
                props.change(`${exports.formSubName}.eta`, fltScheduleInitial.eta);
            }
            else {
                props.change(`${exports.formSubName}.etd`, "");
                props.change(`${exports.formSubName}.eta`, "");
            }
        }
        // フォーマット変換して入れておく
        if (fieldName === "orgDate") {
            props.change(`${exports.formSubName}.orgDateLcl`, (0, commonUtil_1.convertYYMMDDToDate)(inputValue || ""));
        }
        if (fieldName === "onwardOrgDate") {
            props.change(`${exports.formSubName}.onwardOrgDateLcl`, (0, commonUtil_1.convertYYMMDDToDate)(inputValue || ""));
        }
        // 編集済みにする
        if (!isEdited) {
            setIsEdited(true);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOnChangeCsFltNames = (e) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const inputValues = Object.values(e);
        const newCsFltNames = inputValues.slice(0, inputValues.length - 1); // 最後の不要な要素を取り除く
        const fltScheduleInitial = props.initialValues.fltSchedule;
        if (fltScheduleInitial && !(0, lodash_isequal_1.default)(newCsFltNames, fltScheduleInitial.csFltNames)) {
            handleOnChange("csFltNames")(e);
        }
        // 念のため
        if (!isEdited) {
            setIsEdited(true);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldToUpperCase = (fieldName) => (e) => {
        if (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            props.change(`${exports.formSubName}.${fieldName}`, (0, commonUtil_1.toUpperCase)(e.target.value));
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldFltZeroPadding = (fieldName) => (e) => {
        if (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            props.change(`${exports.formSubName}.${fieldName}`, (0, commonUtil_1.formatFlt)(e.target.value));
        }
    };
    const handleKeyPressToUpperCase = (fieldName) => (e) => {
        if (e.key === "Enter") {
            props.change(`${exports.formSubName}.${fieldName}`, (0, commonUtil_1.toUpperCase)(e.target.value));
        }
    };
    const handleKeyPressFltZeroPadding = (fieldName) => (e) => {
        if (e.key === "Enter") {
            props.change(`${exports.formSubName}.${fieldName}`, (0, commonUtil_1.formatFlt)(e.target.value));
        }
    };
    const csFltNamesFormatValues = (values) => values.map((value) => (0, commonUtil_1.formatFlt)(value));
    const modalOnRequestClose = () => {
        const { oalFlightSchedule: { fltScheduleList, inputRowIndex, inputNewRow }, } = props;
        if (inputRowIndex !== null) {
            const formFltSchedule = props.formValues.fltSchedule;
            const orgFltSchedule = fltScheduleList[inputRowIndex];
            const onClose = () => {
                if (formFltSchedule) {
                    if ((formFltSchedule.chgType === "ADD FLT" || formFltSchedule.chgType === "ADD LEG") && inputNewRow) {
                        // 新規に行追加している場合は行削除する
                        dispatch((0, oalFlightSchedule_1.fltListDelete)({ index: inputRowIndex, length: 1 }));
                    }
                }
                dispatch((0, oalFlightSchedule_1.setInputModal)({
                    isOpenInputModal: false,
                    inputRowIndex: null,
                    inputChgType: "",
                    inputNewRow: null,
                }));
                untouchField(dispatch, redux_form_1.untouch, props.formSyncErrors);
            };
            // 値が変更されている場合はメッセージを表示する（rowStatus、chgType、statusは比較対象にしない）
            const isEditedOrgFltSchedule = JSON.stringify(orgFltSchedule) !==
                JSON.stringify({
                    ...formFltSchedule,
                    rowStatus: orgFltSchedule.rowStatus,
                    chgType: orgFltSchedule.chgType,
                    dispStatus: orgFltSchedule.dispStatus,
                });
            if (isEditedOrgFltSchedule) {
                void dispatch((0, oalFlightSchedule_1.showConfirmation)({ onClickYes: onClose }));
            }
            else {
                onClose();
            }
        }
    };
    const { oalFlightSchedule: { isUtc, isOpenInputModal }, apoOptions, flightStsOptions, handleSubmit, formValues, initialValues, legCount, basePosition, zoomPercentageOfList, } = props;
    const zMark = isUtc ? "(Z)" : "";
    const lMark = isUtc ? "(L)" : "";
    const fltSchedule = formValues && formValues.fltSchedule;
    const fltScheduleInitial = initialValues && initialValues.fltSchedule;
    if (!fltSchedule || !fltScheduleInitial) {
        return null;
    }
    const enabled = (0, OalFlightScheduleType_1.getListItemEnabled)(fltSchedule);
    const onwardForceDisabled = (0, oalFlightSchedule_1.getOnwardForceDisabled)(fltSchedule);
    const { isPc } = storage_1.storage;
    const modalWidth = 960;
    const top = basePosition + (legCount * 40 * zoomPercentageOfList) / 100; // 対象FLTの最終LEGの直下に位置させる
    const ModalCustomStyles = {
        overlay: {
            background: "rgba(0, 0, 0, 0.5)",
            overflow: "auto",
            zIndex: 100,
        },
        content: {
            width: `${modalWidth}px`,
            top: `${top}px`,
            left: `calc(50% - ${modalWidth / 2}px)`,
            padding: 0,
            height: "fit-content",
            overflow: "unset",
            backgroundColor: "#fff",
            transition: "opacity 0.25s",
            border: "0px",
            borderRadius: "0px",
        },
    };
    return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpenInputModal, style: ModalCustomStyles, onRequestClose: modalOnRequestClose },
        react_1.default.createElement(FormContainer, { onSubmit: handleSubmit },
            react_1.default.createElement(FormTable, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "chgType" }, "CHG Type"),
                    react_1.default.createElement("div", { className: "casual" }, "Casual"),
                    react_1.default.createElement("div", { className: "flight" }, "Flight"),
                    react_1.default.createElement("div", { className: "date" },
                        "Date",
                        lMark),
                    react_1.default.createElement("div", { className: "domInt" }, "DOM/INT"),
                    react_1.default.createElement("div", { className: "paxCgo" }, "PAX/CGO"),
                    react_1.default.createElement("div", { className: "skdNsk" }, "SKD/NSK")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(ChgTypeColumn, { className: "chgType" }, fltSchedule.chgType),
                    react_1.default.createElement("div", { className: "casual" },
                        react_1.default.createElement(CheckBoxItem, { disabled: !enabled.casFltFlg, dirty: fltSchedule.casFltFlg !== (fltScheduleInitial ? fltScheduleInitial.casFltFlg : false) },
                            react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.casFltFlg`, id: "casFltFlg", component: CheckBoxInput_1.default, checked: fltSchedule.casFltFlg, disabled: !enabled.casFltFlg, onChange: handleOnChange("casFltFlg"), isShadowOnFocus: true, isShowEditedColor: enabled.casFltFlg }),
                            react_1.default.createElement("label", { htmlFor: "casFltFlg" }, "Casual"))),
                    react_1.default.createElement("div", { className: "flight" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.fltName`, width: "100%", type: "text", component: TextInput_1.default, placeholder: "FLT", maxLength: 8, componentOnBlur: fltSchedule.casFltFlg ? fieldToUpperCase("fltName") : fieldFltZeroPadding("fltName"), onKeyPress: fltSchedule.casFltFlg ? handleKeyPressToUpperCase("fltName") : handleKeyPressFltZeroPadding("fltName"), disabled: !enabled.fltName, validate: fltSchedule.casFltFlg
                                ? [validates.required, validates.isOkCasualFlt8]
                                : [validates.required, validates.lengthFlt3, validates.halfWidthFlt], onChange: handleOnChange("fltName"), isForceError: getIsForceError("fltName"), isShadowOnFocus: true, isShowEditedColor: enabled.fltName, autoFocus: enabled.autoFocusColumn === "fltName" })),
                    react_1.default.createElement("div", { className: "date" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.orgDate`, width: "100%", type: "text", component: TextInput_1.default, placeholder: "yymmdd", showKeyboard: isPc ? undefined : handleDateInputPopup(fltSchedule.orgDate, "orgDate"), maxLength: 6, disabled: !enabled.orgDate, displayValue: isPc ? undefined : fltSchedule.orgDate, validate: isPc ? [validates.required, validates.isYYMMDD] : [validates.required], onChange: handleOnChange("orgDate"), isForceError: getIsForceError("orgDate"), isShadowOnFocus: true, isShowEditedColor: enabled.orgDate })),
                    react_1.default.createElement("div", { className: "domInt" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.intDomCat`, width: "100%", component: SelectBox_1.default, placeholder: "D/I", options: [
                                { label: "DOM", value: "D" },
                                { label: "INT", value: "I" },
                            ], hasBlank: true, disabled: !enabled.intDomCat, validate: [validates.required], onSelect: handleOnChange("intDomCat"), isForceError: getIsForceError("intDomCat"), isShadowOnFocus: true, isShowEditedColor: enabled.intDomCat, autoFocus: enabled.autoFocusColumn === "intDomCat" })),
                    react_1.default.createElement("div", { className: "paxCgo" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.paxCgoCat`, width: "100%", component: SelectBox_1.default, placeholder: "P/C", options: [
                                { label: "PAX", value: "PAX" },
                                { label: "CGO", value: "CGO" },
                                { label: "OTR", value: "OTR" },
                            ], hasBlank: true, disabled: !enabled.paxCgoCat, validate: [validates.required], onSelect: handleOnChange("paxCgoCat"), isForceError: getIsForceError("paxCgoCat"), isShadowOnFocus: true, isShowEditedColor: enabled.paxCgoCat })),
                    react_1.default.createElement("div", { className: "skdNsk" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.skdlNonskdlCat`, width: "100%", component: SelectBox_1.default, placeholder: "S/N", options: [
                                { label: "SKD", value: "SKD" },
                                { label: "NSK", value: "NSK" },
                            ], hasBlank: true, disabled: !enabled.skdlNonskdlCat, validate: [validates.required], onSelect: handleOnChange("skdlNonskdlCat"), isForceError: getIsForceError("skdlNonskdlCat"), isShadowOnFocus: true, isShowEditedColor: enabled.skdlNonskdlCat })))),
            react_1.default.createElement(FormTable, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "status" }, "LEG Status"),
                    react_1.default.createElement("div", { className: "dep" }, "DEP"),
                    react_1.default.createElement("div", { className: "arr" }, "ARR"),
                    react_1.default.createElement("div", { className: "std" },
                        "STD",
                        zMark),
                    react_1.default.createElement("div", { className: "etd" },
                        "ETD",
                        zMark),
                    react_1.default.createElement("div", { className: "sta" },
                        "STA",
                        zMark),
                    react_1.default.createElement("div", { className: "eta" },
                        "ETA",
                        zMark),
                    react_1.default.createElement("div", { className: "eqp" }, "EQP"),
                    react_1.default.createElement("div", { className: "ship" }, "SHIP")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(StatusColumn, { className: "status", dirty: fltSchedule.dispStatus !== (fltScheduleInitial ? fltScheduleInitial.dispStatus : ""), lineThrough: fltSchedule.chgType === "RIN" }, fltSchedule.dispStatus),
                    react_1.default.createElement("div", { className: "dep" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.depApoCd`, width: "100%", component: SuggestSelectBox_1.default, placeholder: "DEP", maxLength: 3, maxMenuHeight: 408, options: apoOptions, validate: [validates.required, validates.halfWidthApoCd], disabled: !enabled.depApoCd, onSelect: handleOnChange("depApoCd"), isForceError: getIsForceError("depApoCd"), isShadowOnFocus: true, isShowEditedColor: true, autoFocus: enabled.autoFocusColumn === "depApoCd" })),
                    react_1.default.createElement("div", { className: "arr" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.arrApoCd`, width: "100%", component: SuggestSelectBox_1.default, placeholder: "ARR", maxLength: 3, maxMenuHeight: 408, options: apoOptions, validate: [validates.required, validates.halfWidthApoCd], disabled: !enabled.arrApoCd, onSelect: handleOnChange("arrApoCd"), isForceError: getIsForceError("arrApoCd"), isShadowOnFocus: true, isShowEditedColor: true })),
                    react_1.default.createElement("div", { className: "std" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.std`, width: "100%", type: "text", component: TextInput_1.default, placeholder: "ddhhmm", showKeyboard: isPc ? undefined : handleDayTimeInputPopup(fltSchedule.std, "std"), maxLength: 6, disabled: !enabled.std, validate: [myValidates.requiredStd, myValidates.isDDHHmm], onChange: handleOnChange("std"), isForceError: getIsForceError("std"), isShadowOnFocus: true, isShowEditedColor: true, autoFocus: enabled.autoFocusColumn === "std" })),
                    react_1.default.createElement("div", { className: "etd" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.etd`, width: "100%", type: "text", component: TextInput_1.default, placeholder: "ddhhmm", showKeyboard: isPc ? undefined : handleDayTimeInputPopup(fltSchedule.etd, "etd"), maxLength: 6, disabled: !enabled.etd, validate: [myValidates.requiredEtd, myValidates.isDDHHmm], onChange: handleOnChange("etd"), isForceError: getIsForceError("etd"), isShadowOnFocus: true, isShowEditedColor: true, autoFocus: enabled.autoFocusColumn === "etd" })),
                    react_1.default.createElement("div", { className: "sta" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.sta`, width: "100%", type: "text", component: TextInput_1.default, placeholder: "ddhhmm", showKeyboard: isPc ? undefined : handleDayTimeInputPopup(fltSchedule.sta, "sta"), maxLength: 6, disabled: !enabled.sta, validate: [validates.required, myValidates.isDDHHmm], onChange: handleOnChange("sta"), isForceError: getIsForceError("sta"), isShadowOnFocus: true, isShowEditedColor: true })),
                    react_1.default.createElement("div", { className: "eta" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.eta`, width: "100%", type: "text", component: TextInput_1.default, placeholder: "ddhhmm", showKeyboard: isPc ? undefined : handleDayTimeInputPopup(fltSchedule.eta, "eta"), maxLength: 6, disabled: !enabled.eta, validate: [myValidates.requiredEta, myValidates.isDDHHmm], onChange: handleOnChange("eta"), isForceError: getIsForceError("eta"), isShadowOnFocus: true, isShowEditedColor: true })),
                    react_1.default.createElement("div", { className: "eqp" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.shipTypeIataCd`, width: "100%", type: "text", component: TextInput_1.default, placeholder: "EQP", maxLength: 3, componentOnBlur: fieldToUpperCase("shipTypeIataCd"), onKeyPress: handleKeyPressToUpperCase("shipTypeIataCd"), disabled: !enabled.shipTypeIataCd, validate: [validates.required, validates.isEQP], onChange: handleOnChange("shipTypeIataCd"), isForceError: getIsForceError("shipTypeIataCd"), isShadowOnFocus: true, isShowEditedColor: true })),
                    react_1.default.createElement("div", { className: "ship" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.shipNo`, width: "100%", type: "text", component: TextInput_1.default, placeholder: "SHIP", maxLength: 10, componentOnBlur: fieldToUpperCase("shipNo"), onKeyPress: handleKeyPressToUpperCase("shipNo"), disabled: !enabled.shipNo, validate: [validates.halfWidthShip, validates.lengthShip2], onChange: handleOnChange("shipNo"), isForceError: getIsForceError("shipNo"), isShadowOnFocus: true, isShowEditedColor: true })))),
            react_1.default.createElement(FormTable, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "status" }),
                    react_1.default.createElement("div", { className: "flightSts" }, "Flight Status"),
                    react_1.default.createElement("div", { className: "cnxTo" }, "CNX To"),
                    react_1.default.createElement("div", { className: "date" },
                        "Date",
                        lMark),
                    react_1.default.createElement("div", { className: "hideFlg" }, "Hide Flag"),
                    react_1.default.createElement("div", { className: "codeShareFlight" }, "Code Share Flight")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "status" }),
                    react_1.default.createElement("div", { className: "flightSts" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.svcTypeDiaCd`, width: "100%", component: SelectBox_1.default, placeholder: "STS", options: flightStsOptions, hasBlank: true, disabled: !enabled.svcTypeDiaCd, maxMenuHeight: 490, validate: [validates.required], onChange: handleOnChange("svcTypeDiaCd"), isForceError: getIsForceError("svcTypeDiaCd"), isShadowOnFocus: true, isShowEditedColor: true })),
                    react_1.default.createElement("div", { className: "cnxTo" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.onwardFltName`, width: "100%", type: "text", component: TextInput_1.default, placeholder: "CNX FLT", maxLength: 6, componentOnBlur: fieldFltZeroPadding("onwardFltName"), onKeyPress: handleKeyPressFltZeroPadding("onwardFltName"), disabled: onwardForceDisabled || !enabled.onward, displayValue: onwardForceDisabled ? "" : undefined, validate: onwardForceDisabled ? [] : [myValidates.requiredCnxToPair, validates.lengthFlt3, validates.halfWidthFlt], onChange: handleOnChange("svcTypeDiaCd"), isForceError: getIsForceError("onwardFltName"), isShadowOnFocus: true, isShowEditedColor: true })),
                    react_1.default.createElement("div", { className: "date" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.onwardOrgDate`, width: "100%", type: "text", component: TextInput_1.default, placeholder: "yymmdd", showKeyboard: isPc ? undefined : handleDateInputPopup(fltSchedule.onwardOrgDate, "onwardOrgDate"), maxLength: 6, disabled: onwardForceDisabled || !enabled.onward, displayValue: isPc ? undefined : onwardForceDisabled ? "" : fltSchedule.onwardOrgDate, validate: onwardForceDisabled
                                ? []
                                : isPc && fltSchedule.onwardOrgDate
                                    ? [myValidates.requiredCnxToPair, validates.isYYMMDD]
                                    : [myValidates.requiredCnxToPair], onChange: handleOnChange("onwardOrgDate"), isForceError: getIsForceError("onwardOrgDate"), isShadowOnFocus: true, isShowEditedColor: true })),
                    react_1.default.createElement("div", { className: "hideFlg" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.hideFlgCd`, width: "100%", component: SelectBox_1.default, placeholder: "Hide", options: [
                                { label: "DEP", value: "DEP" },
                                { label: "ARR", value: "ARR" },
                                { label: "BOTH", value: "BOTH" },
                            ], hasBlank: true, disabled: !enabled.hideFlgCd, onSelect: handleOnChange("hideFlgCd"), isForceError: getIsForceError("hideFlgCd"), isShadowOnFocus: true, isShowEditedColor: true })),
                    react_1.default.createElement("div", { className: "codeShareFlight" },
                        react_1.default.createElement(redux_form_1.Field, { name: `${exports.formSubName}.csFltNames`, width: "100%", placeholder: "C/S FLT", disabled: !enabled.csFltNames, component: MultipleCreatableInput_1.default, validate: [myValidates.isOkFlts, validates.unique], formatValues: csFltNamesFormatValues, maxValLength: 20, onChange: handleOnChangeCsFltNames, isForceError: getIsForceError("csFltNames"), isShadowOnFocus: true, isShowEditedColor: true })))),
            react_1.default.createElement(Footer, null,
                react_1.default.createElement(PrimaryButton_1.default, { text: "Enter", disabled: !isEdited, width: "100px" })))));
};
// バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const untouchField = (dispatch, formActionUntouch, formSyncErrors) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const validationErrorsFields = []; // 条件必須の項目はvalidateを持たないため常にtouchedをfalseにする。
    Object.keys(formSyncErrors).forEach((subFormName) => {
        Object.keys(subFormName).forEach((fieldName) => validationErrorsFields.push(`${exports.formSubName}.${fieldName}`));
    });
    // console.log(JSON.stringify(validationErrorsFields));
    if (validationErrorsFields.length) {
        formActionUntouch(...validationErrorsFields);
        notifications_1.NotificationCreator.removeAll({ dispatch });
    }
};
const onSubmit = (_formValues, dispatch, props) => {
    const update = () => {
        const { fltSchedule } = props.formValues;
        const fltScheduleInitial = props.initialValues.fltSchedule;
        const { inputRowIndex } = props.oalFlightSchedule;
        if (fltSchedule && fltScheduleInitial && inputRowIndex !== null) {
            const isNotChanged = JSON.stringify({ ...fltSchedule, rowStatus: "", chgType: "" }) ===
                JSON.stringify({ ...fltScheduleInitial, rowStatus: "", chgType: "" });
            const statusItems = {
                rowStatus: isNotChanged ? "" : "Edited",
                chgType: isNotChanged && fltSchedule.chgType !== "ADD FLT" && fltSchedule.chgType !== "ADD LEG" ? "" : fltSchedule.chgType,
                updateValidationErrors: [],
            };
            const editedFltSchedule = {
                ...fltSchedule,
                ...statusItems,
            };
            dispatch((0, oalFlightSchedule_1.fltListEdit)({ index: inputRowIndex, fltScheduleList: [editedFltSchedule] }));
            // FLT No.の場合、他のLEGも更新
            if (fltSchedule.chgType === "FLT No.") {
                let findedIndex = -1;
                for (;;) {
                    findedIndex = props.oalFlightSchedule.fltScheduleList.findIndex(
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    (f, index) => f.fltIndex === fltSchedule.fltIndex && f.legIndex !== fltSchedule.legIndex && index > findedIndex);
                    if (findedIndex >= 0) {
                        const editedFltSchedule2 = {
                            ...props.oalFlightSchedule.fltScheduleList[findedIndex],
                            ...statusItems,
                            fltName: fltSchedule.fltName,
                        };
                        dispatch((0, oalFlightSchedule_1.fltListEdit)({ index: findedIndex, fltScheduleList: [editedFltSchedule2] }));
                    }
                    else {
                        break;
                    }
                }
                // マルチレグの１行目の場合、他のLEGにFLT情報をコピーする
            }
            else if (fltSchedule.legIndex === 0) {
                let findedIndex = -1;
                for (;;) {
                    findedIndex = props.oalFlightSchedule.fltScheduleList.findIndex(
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    (f, index) => f.fltIndex === fltSchedule.fltIndex && f.legIndex !== fltSchedule.legIndex && index > findedIndex);
                    if (findedIndex >= 0) {
                        const editedFltSchedule2 = {
                            ...props.oalFlightSchedule.fltScheduleList[findedIndex],
                            ...(0, OalFlightScheduleType_1.getFltInfo)(fltSchedule),
                        };
                        dispatch((0, oalFlightSchedule_1.fltListEdit)({ index: findedIndex, fltScheduleList: [editedFltSchedule2] }));
                    }
                    else {
                        break;
                    }
                }
            }
            dispatch((0, oalFlightSchedule_1.setInputModal)({
                isOpenInputModal: false,
                inputRowIndex: null,
                inputChgType: "",
                inputNewRow: null,
            }));
            untouchField(dispatch, redux_form_1.untouch, props.formSyncErrors);
        }
    };
    // props.showMessage(SoalaMessage.M30010C({ onYesButton: update }));
    update();
};
const FormContainer = styled_components_1.default.form `
  width: 100%;
  height: "fit-content";
`;
const FormTable = styled_components_1.default.div `
  > div:nth-child(1) {
    display: flex;
    align-items: center;
    background-color: rgb(39, 153, 198);
    color: #fff;
    height: 26px;
    padding-left: 20px;
    font-size: 12px;
    > div {
      margin-left: 10px;
    }
  }
  > div:nth-child(2) {
    display: flex;
    align-items: center;
    padding: 20px;
    > div {
      margin-left: 10px;
    }
  }
  .chgType {
    width: 100px;
    justify-content: center;
    padding-left: 0;
  }
  .casual {
    width: 100px;
    justify-content: center;
    padding-left: 0;
  }
  .flight {
    width: 112px;
  }
  .date {
    width: 80px;
  }
  .domInt {
    width: 76px;
  }
  .paxCgo {
    width: 76px;
  }
  .skdNsk {
    width: 76px;
  }
  .status {
    width: 100px;
    justify-content: center;
    padding-left: 0;
  }
  .dep,
  .arr {
    width: 90px;
  }
  .std,
  .etd,
  .sta,
  .eta {
    width: 88px;
  }
  .eqp {
    width: 64px;
  }
  .ship {
    width: 120px;
  }
  .flightSts {
    width: 80px;
  }
  .cnxTo {
    width: 112px;
  }
  .hideFlg {
    width: 76px;
  }
  .codeShareFlight {
    display: flex;
    width: 398px;
  }
`;
const ChgTypeColumn = styled_components_1.default.div `
  -webkit-text-stroke: 1px;
  color: ${({ theme }) => theme.color.text.CHANGED};
`;
const StatusColumn = styled_components_1.default.div `
  -webkit-text-stroke: 1px;
  color: ${({ dirty, lineThrough, theme }) => (dirty || lineThrough ? theme.color.text.CHANGED : "#000")};
  text-decoration: ${({ lineThrough }) => (lineThrough ? "line-through" : "none")};
`;
const CheckBoxItem = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 44px;
  background-color: ${({ disabled, dirty, theme }) => (disabled ? "rgba(0,0,0,0)" : dirty ? theme.color.background.DELETED : "#FFF")};
  label {
    margin: 0 5px;
  }
`;
const Footer = styled_components_1.default.div `
  display: flex;
  width: 100%;
  padding: 10px 0 30px 0;
  justify-content: center;
`;
/**
 * コネクト
 */
exports.formName = "oalFlightSchedule";
exports.formSubName = "fltSchedule";
const mapStateToProps = (state) => {
    const formSyncErrors = (0, redux_form_1.getFormSyncErrors)(exports.formName)(state);
    const { fltScheduleListInitial, inputRowIndex, inputChgType, fltScheduleList } = state.oalFlightSchedule;
    // 初期値の設定処理
    let fltScheduleInitial;
    let legCount = 0;
    if (inputRowIndex !== null) {
        fltScheduleInitial = (0, lodash_clonedeep_1.default)(fltScheduleListInitial[inputRowIndex]);
        const { fltIndex } = fltScheduleList[inputRowIndex];
        legCount = fltScheduleList.filter((f) => f.fltIndex === fltIndex).length;
    }
    else {
        fltScheduleInitial = (0, oalFlightSchedule_1.getInitialFormState)({ fltIndex: 0, legIndex: 0 });
    }
    fltScheduleInitial.chgType = inputChgType; // 指定のChgTypeを設定する
    return {
        oalFlightSchedule: state.oalFlightSchedule,
        formSyncErrors,
        formValues: (0, redux_form_1.getFormValues)(exports.formName)(state),
        initialValues: { fltSchedule: fltScheduleInitial },
        legCount,
    };
};
const OalFlightScheduleModalForm = (0, redux_form_1.reduxForm)({
    form: exports.formName,
    onSubmit,
    enableReinitialize: true,
})(OalFlightScheduleInputModal);
exports.default = (0, react_redux_1.connect)(mapStateToProps)(OalFlightScheduleModalForm);
//# sourceMappingURL=OalFlightScheduleInputModal.js.map