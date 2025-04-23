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
const lodash_1 = require("lodash");
const react_1 = __importStar(require("react"));
const redux_form_1 = require("redux-form");
const hooks_1 = require("../../../store/hooks");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const validates = __importStar(require("../../../lib/validators"));
const myValidates = __importStar(require("../../../lib/validators/mvtMsgValidator"));
const mvtMsgModal_1 = require("../../../reducers/mvtMsgModal");
const RadioButton_1 = __importDefault(require("../../atoms/RadioButton"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const TimeInputPlusMinusButtons_1 = __importDefault(require("../TimeInputPlusMinusButtons"));
const TimeInputPanel_1 = __importDefault(require("../TimeInputPanel"));
// eslint-disable-next-line import/no-cycle
const MvtMsgModal_1 = require("../../organisms/MvtMsgModal");
const MvtMsgDepContainer = (props) => {
    const { movementInfo, formValues, depDisabled, changeValue, checkHasDiffInForm, checkHasDiffInMsgSetting, initializeMvtForm, initializeMsgSetting, handleDateTimeInputPopup, handleOnChange, getIsForceError, onChangeRadioButton, } = props;
    const DEP = "DEP";
    const dispatch = (0, hooks_1.useAppDispatch)();
    const master = (0, hooks_1.useAppSelector)((state) => state.account.master);
    const [isCancel, setIsCancel] = (0, react_1.useState)(false);
    const [isDlyDisabled, setIsDlyDisabled] = (0, react_1.useState)(false);
    /** バリデーション要否判定の為、入力項目の活性状態を管理する */
    const isInputActive = (0, react_1.useMemo)(() => !(formValues.depInfo.cnlCheckBox || !(0, lodash_1.isEqual)(formValues.mvtMsgRadioButton, DEP)), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formValues.mvtMsgRadioButton, formValues.depInfo.cnlCheckBox]);
    /** 実績値によって遅延情報の入力項目の非活性状態を制御する */
    (0, react_1.useEffect)(() => {
        const { std, atd } = formValues.depInfo;
        if (!std) {
            setIsDlyDisabled(false);
        }
        else {
            setIsDlyDisabled(!atd || std >= atd);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues.depInfo.std, formValues.depInfo.atd]);
    /** 遅延情報欄が実績値により非活性化する場合、遅延情報を全て空欄にする */
    (0, react_1.useEffect)(() => {
        if (!depDisabled && !isCancel && isDlyDisabled) {
            changeValue("depInfo.depDlyTime1")("");
            changeValue("depInfo.depDlyTime2")("");
            changeValue("depInfo.depDlyTime3")("");
            changeValue("depInfo.depDlyRsnCd1")("");
            changeValue("depInfo.depDlyRsnCd2")("");
            changeValue("depInfo.depDlyRsnCd3")("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDlyDisabled]);
    /** Cancelチェックボックスを初期化する */
    (0, react_1.useEffect)(() => {
        if (!depDisabled) {
            setIsCancel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depDisabled]);
    /** キャンセルチェックボックスの活性状態を取得する */
    const cnlCheckBoxEnabled = () => {
        const { depMvtMsgFlg, actLdUtc, irrSts } = movementInfo;
        return depMvtMsgFlg && !irrSts && !actLdUtc;
    };
    const formatToDDHHmm = (dateTimeValue) => {
        if (dateTimeValue && (0, dayjs_1.default)(dateTimeValue).isValid()) {
            return (0, dayjs_1.default)(dateTimeValue).format("DDHHmm");
        }
        return "";
    };
    const normalizeTime = (value) => {
        const onlyNums = value.replace(/[^\d]/g, "");
        return onlyNums;
    };
    const depDlyRsnOption = master.dlyRsns
        ? master.dlyRsns
            .filter((d) => d.arrDepCd === "DEP")
            .sort((a, b) => a.dispSeq - b.dispSeq)
            .map((d) => ({ label: d.dlyRsnJalCd, value: d.dlyRsnJalCd }))
        : [];
    /** キャンセルチェックボックス押下時の処理 */
    const onChangeCheckBox = (event) => {
        const { checked } = event.target;
        if (checked) {
            // 自フォーム内もしくは送信設定共通入力欄で変更があるか確認して分岐
            if (checkHasDiffInForm(DEP) || checkHasDiffInMsgSetting(DEP)) {
                void dispatch((0, mvtMsgModal_1.showMessage)({
                    message: soalaMessages_1.SoalaMessage.M40012C({
                        onYesButton: () => {
                            initializeMvtForm(DEP, true);
                            initializeMsgSetting(DEP);
                            setIsCancel(checked);
                        },
                        // キャンセルチェックボックスを元に戻す
                        onNoButton: () => changeValue("depInfo.cnlCheckBox")(false),
                    }),
                }));
            }
            else {
                initializeMvtForm(DEP, true);
                initializeMsgSetting(DEP);
                setIsCancel(checked);
            }
        }
        else {
            setIsCancel(checked);
        }
    };
    const isDomestic = movementInfo.intDomCat === "D";
    const timeModeMark = isDomestic ? "(L)" : "(Z)";
    return (react_1.default.createElement(MvtMsgModal_1.Content, null,
        react_1.default.createElement(MvtMsgModal_1.Row, { marginBottom: 9, padding: "0px 8px 0px 0px" },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 24 },
                    react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 24 }),
                    movementInfo.depMvtMsgFlg && react_1.default.createElement(MvtMsgModal_1.MvtMsgFlgIconSvg, null)),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 76 },
                    react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 76 }),
                    react_1.default.createElement(redux_form_1.Field, { name: "mvtMsgRadioButton", id: `${DEP}RadioButton`, tabIndex: 0, type: "radio", value: DEP, component: RadioButton_1.default, onChange: onChangeRadioButton, isShadowOnFocus: true }),
                    react_1.default.createElement(MvtMsgModal_1.ComponentLabel, { htmlFor: `${DEP}RadioButton` }, DEP)),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 7 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 59 },
                    react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 59 }),
                    react_1.default.createElement(MvtMsgModal_1.CheckBoxLabel, { htmlFor: "depInfo.cnlCheckBox", disabled: depDisabled, checkBoxDisabled: depDisabled || !cnlCheckBoxEnabled() },
                        "CNL",
                        react_1.default.createElement(redux_form_1.Field, { id: "depInfo.cnlCheckBox", name: "depInfo.cnlCheckBox", component: "input", tabIndex: 0, type: "checkbox", disabled: depDisabled || !cnlCheckBoxEnabled(), onChange: onChangeCheckBox }))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 22 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 64 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: depDisabled },
                        "STD",
                        timeModeMark),
                    react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: depDisabled }, formatToDDHHmm(formValues.depInfo.std))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 10 }),
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 280 },
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 168 },
                        react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { showDisabled: true, dateTimeValue: formValues.depInfo.atd, onClick: changeValue("depInfo.atd"), disabled: isCancel || depDisabled },
                            react_1.default.createElement(MvtMsgModal_1.Col, { width: 96 },
                                react_1.default.createElement(MvtMsgModal_1.Label, { disabled: depDisabled },
                                    "ATD",
                                    timeModeMark),
                                react_1.default.createElement(redux_form_1.Field, { name: "depInfo.atd", width: 96, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 18, showKeyboard: handleDateTimeInputPopup(formValues.depInfo.atd, "depInfo.atd"), displayValue: formatToDDHHmm(formValues.depInfo.atd), maxLength: 6, validate: isInputActive ? [validates.required, myValidates.rangeMovementDate, myValidates.orderAtdTo] : undefined, onChange: handleOnChange("depInfo.atd"), isForceError: getIsForceError("depInfo.atd"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || depDisabled })))),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 100 },
                        react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 100 }),
                        react_1.default.createElement(TimeInputPanel_1.default, { dateTimeValue: formValues.depInfo.atd, timeDiff: isDomestic ? 900 : 0, onClick: changeValue("depInfo.atd"), width: "100px", height: "40px", disabled: isCancel || depDisabled }))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 280 },
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 168 },
                        react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { showDisabled: true, dateTimeValue: formValues.depInfo.actTo, onClick: changeValue("depInfo.actTo"), disabled: isCancel || depDisabled },
                            react_1.default.createElement(MvtMsgModal_1.Col, { width: 96 },
                                react_1.default.createElement(MvtMsgModal_1.Label, { disabled: depDisabled },
                                    "T/O",
                                    timeModeMark),
                                react_1.default.createElement(redux_form_1.Field, { name: "depInfo.actTo", width: 96, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 18, showKeyboard: handleDateTimeInputPopup(formValues.depInfo.actTo, "depInfo.actTo"), displayValue: formatToDDHHmm(formValues.depInfo.actTo), maxLength: 6, validate: isInputActive
                                        ? [validates.required, myValidates.rangeMovementDate, myValidates.orderAtdTo, myValidates.orderToLd]
                                        : undefined, onChange: handleOnChange("depInfo.actTo"), isForceError: getIsForceError("depInfo.actTo"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || depDisabled })))),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 100 },
                        react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 100 }),
                        react_1.default.createElement(TimeInputPanel_1.default, { dateTimeValue: formValues.depInfo.actTo, timeDiff: isDomestic ? 900 : 0, onClick: changeValue("depInfo.actTo"), width: "100px", height: "40px", disabled: isCancel || depDisabled }))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 18 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 84 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: depDisabled }, "EFT"),
                    react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: depDisabled }, formValues.depInfo.eft)))),
        react_1.default.createElement(MvtMsgModal_1.Row, { padding: "0px 10px 0px 36px" },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 100 },
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 42 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: depDisabled }, "From"),
                        react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: depDisabled }, movementInfo.lstDepApoCd)),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 16 },
                        react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 16 }),
                        react_1.default.createElement(MvtMsgModal_1.Flex, { width: 16, position: "center" },
                            react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: depDisabled }, "-"))),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 42 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: depDisabled }, "To"),
                        react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: depDisabled }, movementInfo.lstArrApoCd))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 64 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 436 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: depDisabled }, "DEP DLY Time/Reason ---------------------------------------------------------"),
                    react_1.default.createElement(MvtMsgModal_1.Flex, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyTime1", width: 72, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", maxLength: 4, pattern: "\\d*", normalize: normalizeTime, validate: isInputActive && !isDlyDisabled
                                ? [myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime]
                                : undefined, onChange: handleOnChange("depInfo.depDlyTime1"), isForceError: getIsForceError("depInfo.depDlyTime1"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || depDisabled || isDlyDisabled }),
                        react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyRsnCd1", width: 64, height: 40, component: SelectBox_1.default, options: depDlyRsnOption, validate: isInputActive && !isDlyDisabled ? [myValidates.requiredDepDlyRsnCd] : undefined, maxMenuHeight: 136, onChange: handleOnChange("depInfo.depDlyRsnCd1"), isForceError: getIsForceError("depInfo.depDlyRsnCd1"), hasBlank: true, isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true, disabled: isCancel || depDisabled || isDlyDisabled }),
                        react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyTime2", width: 72, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", maxLength: 4, pattern: "\\d*", normalize: normalizeTime, validate: isInputActive && !isDlyDisabled
                                ? [myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime]
                                : undefined, onChange: handleOnChange("depInfo.depDlyTime2"), isForceError: getIsForceError("depInfo.depDlyTime2"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || depDisabled || isDlyDisabled }),
                        react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyRsnCd2", width: 64, height: 40, component: SelectBox_1.default, options: depDlyRsnOption, validate: isInputActive && !isDlyDisabled ? [myValidates.requiredDepDlyRsnCd] : undefined, maxMenuHeight: 136, onChange: handleOnChange("depInfo.depDlyRsnCd2"), isForceError: getIsForceError("depInfo.depDlyRsnCd2"), hasBlank: true, isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true, disabled: isCancel || depDisabled || isDlyDisabled }),
                        react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyTime3", width: 72, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", maxLength: 4, pattern: "\\d*", normalize: normalizeTime, validate: isInputActive && !isDlyDisabled
                                ? [myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime]
                                : undefined, onChange: handleOnChange("depInfo.depDlyTime3"), isForceError: getIsForceError("depInfo.depDlyTime3"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || depDisabled || isDlyDisabled }),
                        react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyRsnCd3", width: 64, height: 40, component: SelectBox_1.default, options: depDlyRsnOption, validate: isInputActive && !isDlyDisabled ? [myValidates.requiredDepDlyRsnCd] : undefined, maxMenuHeight: 136, onChange: handleOnChange("depInfo.depDlyRsnCd3"), isForceError: getIsForceError("depInfo.depDlyRsnCd3"), hasBlank: true, isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true, disabled: isCancel || depDisabled || isDlyDisabled }))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 12 }),
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 306, position: "flex-start" },
                    react_1.default.createElement(MvtMsgModal_1.Space, { width: 212 }),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 64 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: depDisabled }, "TOF"),
                        react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: depDisabled }, movementInfo.takeOffFuel)))))));
};
exports.default = MvtMsgDepContainer;
//# sourceMappingURL=MvtMsgDepContainer.js.map