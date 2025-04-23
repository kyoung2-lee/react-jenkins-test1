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
const redux_form_1 = require("redux-form");
const lodash_1 = require("lodash");
const hooks_1 = require("../../../store/hooks");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const validates = __importStar(require("../../../lib/validators"));
const myValidates = __importStar(require("../../../lib/validators/mvtMsgValidator"));
const mvtMsgModal_1 = require("../../../reducers/mvtMsgModal");
const RadioButton_1 = __importDefault(require("../../atoms/RadioButton"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const SuggestSelectBox_1 = __importDefault(require("../../atoms/SuggestSelectBox"));
// eslint-disable-next-line import/no-cycle
const MvtMsgModal_1 = require("../../organisms/MvtMsgModal");
const MvtMsgDivContainer = (props) => {
    const { movementInfo, formValues, initialValues, divDisabled, checkHasDiffInForm, initializeMvtForm, changeValue, handleDateTimeInputPopup, handleOnChange, getIsForceError, onChangeRadioButton, } = props;
    const dispatch = (0, hooks_1.useAppDispatch)();
    const { airports } = (0, hooks_1.useAppSelector)((state) => state.account.master);
    const prevDivApoCd = (0, hooks_1.usePrevious)(formValues.divInfo.lstArrApoCd);
    const [isCancel, setIsCancel] = (0, react_1.useState)(false);
    const [etaDisabled, setEtaDisabled] = (0, react_1.useState)(true);
    const [isInputActive, setIsInputActive] = (0, react_1.useState)(false);
    const DIV = "DIV";
    /** Cancelチェックボックスを初期化する */
    (0, react_1.useEffect)(() => {
        if (!divDisabled) {
            setIsCancel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [divDisabled]);
    /** ETAの活性状態を制御する */
    (0, react_1.useEffect)(() => {
        var _a, _b;
        if (!(0, lodash_1.isEqual)(formValues.divInfo.lstArrApoCd, (_a = initialValues.divInfo) === null || _a === void 0 ? void 0 : _a.lstArrApoCd)) {
            // DIV先空港が初期値から変更されている場合、ETAを活性化
            setEtaDisabled(false);
        }
        else if (!(0, lodash_1.isEqual)(formValues.divInfo.divEta, (_b = initialValues.divInfo) === null || _b === void 0 ? void 0 : _b.divEta)) {
            // DIV先空港が初期値と同じかつETAが変更されている場合、編集内容破棄の確認
            void dispatch((0, mvtMsgModal_1.showMessage)({
                message: soalaMessages_1.SoalaMessage.M40012C({
                    onYesButton: () => {
                        var _a;
                        changeValue("divInfo.divEta")((_a = initialValues.divInfo) === null || _a === void 0 ? void 0 : _a.divEta);
                        setEtaDisabled(true);
                    },
                    // DIV先空港を元に戻す
                    onNoButton: () => changeValue("divInfo.lstArrApoCd")(prevDivApoCd),
                }),
            }));
        }
        else {
            setEtaDisabled(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues.divInfo.lstArrApoCd]);
    /** バリデーション要否判定の為、入力項目の活性状態を管理する */
    (0, react_1.useEffect)(() => {
        setIsInputActive(!(formValues.divInfo.cnlCheckBox || !(0, lodash_1.isEqual)(formValues.mvtMsgRadioButton, DIV)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues.mvtMsgRadioButton, formValues.divInfo.cnlCheckBox]);
    /** キャンセルチェックボックス押下時の処理 */
    const onChangeCheckBox = (event) => {
        const { checked } = event.target;
        if (checked) {
            // 自フォーム内で変更があるか確認して分岐
            if (checkHasDiffInForm(DIV)) {
                void dispatch((0, mvtMsgModal_1.showMessage)({
                    message: soalaMessages_1.SoalaMessage.M40012C({
                        onYesButton: () => {
                            initializeMvtForm(DIV, true);
                            setIsCancel(checked);
                        },
                        // キャンセルチェックボックスを元に戻す
                        onNoButton: () => changeValue("divInfo.cnlCheckBox")(false),
                    }),
                }));
            }
            else {
                initializeMvtForm(DIV, true);
                setIsCancel(checked);
            }
        }
        else {
            setIsCancel(checked);
        }
    };
    /** ラジオボタンの活性状態を取得する */
    const radioButtonEnabled = () => isFlight() || isDiv();
    /** キャンセルチェックボックスの非活性状態を取得する */
    const cnlCheckBoxDisabled = () => {
        const { actLdUtc } = movementInfo;
        return DIV !== movementInfo.irrSts || !!actLdUtc || divDisabled;
    };
    /** 飛行中かどうかを判定する */
    const isFlight = () => {
        const { actLdUtc, actToUtc, irrSts } = movementInfo;
        return !actLdUtc && !!actToUtc && !irrSts;
    };
    /** DIV中かどうかを判定する */
    const isDiv = () => {
        const { actLdUtc, irrSts } = movementInfo;
        return !actLdUtc && irrSts === "DIV";
    };
    /** 文字列のdatetimeをDDHHmm形式に変換する */
    const formatToDDHHmm = (dateTimeValue) => {
        if (dateTimeValue && (0, dayjs_1.default)(dateTimeValue).isValid()) {
            return (0, dayjs_1.default)(dateTimeValue).format("DDHHmm");
        }
        return "";
    };
    const isDomestic = movementInfo.intDomCat === "D";
    const timeModeMark = isDomestic ? "(L)" : "(Z)";
    return (react_1.default.createElement(MvtMsgModal_1.IrregularContent, { width: 318 },
        react_1.default.createElement(MvtMsgModal_1.Row, { width: 178, marginBottom: 8 },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 24 }, DIV === movementInfo.irrSts && react_1.default.createElement(MvtMsgModal_1.MvtMsgFlgIconSvg, null)),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 76 },
                    react_1.default.createElement(redux_form_1.Field, { name: "mvtMsgRadioButton", id: `${DIV}RadioButton`, tabIndex: 0, type: "radio", value: DIV, component: RadioButton_1.default, isShadowOnFocus: true, onChange: onChangeRadioButton, disabled: !radioButtonEnabled() }),
                    react_1.default.createElement(MvtMsgModal_1.ComponentLabel, { htmlFor: `${DIV}RadioButton`, disabled: !radioButtonEnabled() }, DIV)),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 7 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 59 },
                    react_1.default.createElement(MvtMsgModal_1.CheckBoxLabel, { htmlFor: "divInfo.cnlCheckBox", disabled: divDisabled, checkBoxDisabled: cnlCheckBoxDisabled() },
                        "CNL",
                        react_1.default.createElement(redux_form_1.Field, { id: "divInfo.cnlCheckBox", name: "divInfo.cnlCheckBox", component: "input", tabIndex: 0, type: "checkbox", disabled: cnlCheckBoxDisabled(), onChange: onChangeCheckBox }))))),
        react_1.default.createElement(MvtMsgModal_1.Row, { width: 288, padding: "0px 0px 0px 36px" },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 139 },
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 42 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: divDisabled }, "From"),
                        react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: divDisabled }, movementInfo.lstDepApoCd)),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 16 },
                        react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 16 }),
                        react_1.default.createElement(MvtMsgModal_1.Flex, { width: 16, position: "center" },
                            react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: divDisabled }, "-"))),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 72 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: divDisabled }, "To"),
                        react_1.default.createElement(redux_form_1.Field, { name: "divInfo.lstArrApoCd", width: 72, height: 40, component: SuggestSelectBox_1.default, options: airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), maxMenuHeight: 170, isShadowOnFocus: true, isShowEditedColor: true, maxLength: 3, validate: isInputActive ? [validates.required, validates.halfWidthApoCd, myValidates.divApo] : undefined, isForceError: getIsForceError("divInfo.lstArrApoCd"), onChange: changeValue("divInfo.lstArrApoCd"), disabled: isCancel || divDisabled }))),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 96 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: divDisabled },
                        "ETA(L/D)",
                        timeModeMark),
                    react_1.default.createElement(redux_form_1.Field, { name: "divInfo.divEta", width: 96, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 18, showKeyboard: handleDateTimeInputPopup(formValues.divInfo.divEta, "divInfo.divEta"), displayValue: formatToDDHHmm(formValues.divInfo.divEta), maxLength: 6, validate: isInputActive ? [validates.required, myValidates.rangeMovementDate] : undefined, onChange: handleOnChange("divInfo.divEta"), isForceError: getIsForceError("divInfo.divEta"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || divDisabled || etaDisabled }))))));
};
exports.default = MvtMsgDivContainer;
//# sourceMappingURL=MvtMsgDivContainer.js.map