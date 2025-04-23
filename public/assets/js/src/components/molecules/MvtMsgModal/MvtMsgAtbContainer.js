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
// eslint-disable-next-line import/no-cycle
const MvtMsgModal_1 = require("../../organisms/MvtMsgModal");
const MvtMsgAtbContainer = (props) => {
    const { movementInfo, formValues, atbDisabled, changeValue, checkHasDiffInForm, initializeMvtForm, handleDateTimeInputPopup, handleOnChange, getIsForceError, onChangeRadioButton, } = props;
    const dispatch = (0, hooks_1.useAppDispatch)();
    const [isCancel, setIsCancel] = (0, react_1.useState)(false);
    const [isInputActive, setIsInputActive] = (0, react_1.useState)(false);
    const ATB = "ATB";
    /** Cancelチェックボックスを初期化する */
    (0, react_1.useEffect)(() => {
        if (!atbDisabled) {
            setIsCancel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [atbDisabled]);
    /** バリデーションの為、入力項目の活性状態を管理する */
    (0, react_1.useEffect)(() => {
        setIsInputActive(!(formValues.atbInfo.cnlCheckBox || !(0, lodash_1.isEqual)(formValues.mvtMsgRadioButton, ATB)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues.mvtMsgRadioButton, formValues.atbInfo.cnlCheckBox]);
    /** キャンセルチェックボックス押下時の処理 */
    const onChangeCheckBox = (event) => {
        const { checked } = event.target;
        if (checked) {
            // 自フォーム内で変更があるか確認して分岐
            if (checkHasDiffInForm(ATB)) {
                void dispatch((0, mvtMsgModal_1.showMessage)({
                    message: soalaMessages_1.SoalaMessage.M40012C({
                        onYesButton: () => {
                            initializeMvtForm(ATB, true);
                            setIsCancel(checked);
                        },
                        // キャンセルチェックボックスを元に戻す
                        onNoButton: () => changeValue("atbInfo.cnlCheckBox")(false),
                    }),
                }));
            }
            else {
                initializeMvtForm(ATB, true);
                setIsCancel(checked);
            }
        }
        else {
            setIsCancel(checked);
        }
    };
    /** ラジオボタンの活性状態を取得する */
    const radioButtonEnabled = () => isFlight() || isAtb();
    /** キャンセルチェックボックスの非活性状態を取得する */
    const cnlCheckBoxDisabled = () => {
        const { actLdUtc } = movementInfo;
        return ATB !== movementInfo.irrSts || !!actLdUtc || atbDisabled;
    };
    /** 飛行中かどうかを判定する */
    const isFlight = () => {
        const { actLdUtc, actToUtc, irrSts } = movementInfo;
        return !actLdUtc && !!actToUtc && !irrSts;
    };
    /** ATB中かどうかを判定する */
    const isAtb = () => {
        const { actLdUtc, irrSts } = movementInfo;
        return !actLdUtc && irrSts === "ATB";
    };
    /** DDHHmm形式に変換する */
    const formatToDDHHmm = (dateTimeValue) => {
        if (dateTimeValue && (0, dayjs_1.default)(dateTimeValue).isValid()) {
            return (0, dayjs_1.default)(dateTimeValue).format("DDHHmm");
        }
        return "";
    };
    const isDomestic = movementInfo.intDomCat === "D";
    const timeModeMark = isDomestic ? "(L)" : "(Z)";
    return (react_1.default.createElement(MvtMsgModal_1.IrregularContent, { width: 308, marginRight: true },
        react_1.default.createElement(MvtMsgModal_1.Row, { width: 178, marginBottom: 8 },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 24 }, ATB === movementInfo.irrSts && react_1.default.createElement(MvtMsgModal_1.MvtMsgFlgIconSvg, null)),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 76 },
                    react_1.default.createElement(redux_form_1.Field, { name: "mvtMsgRadioButton", id: `${ATB}RadioButton`, tabIndex: 0, type: "radio", value: ATB, component: RadioButton_1.default, isShadowOnFocus: true, onChange: onChangeRadioButton, disabled: !radioButtonEnabled() }),
                    react_1.default.createElement(MvtMsgModal_1.ComponentLabel, { htmlFor: `${ATB}RadioButton`, disabled: !radioButtonEnabled() }, ATB)),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 7 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 59 },
                    react_1.default.createElement(MvtMsgModal_1.CheckBoxLabel, { htmlFor: "atbInfo.cnlCheckBox", disabled: atbDisabled, checkBoxDisabled: cnlCheckBoxDisabled() },
                        "CNL",
                        react_1.default.createElement(redux_form_1.Field, { id: "atbInfo.cnlCheckBox", name: "atbInfo.cnlCheckBox", component: "input", tabIndex: 0, type: "checkbox", disabled: cnlCheckBoxDisabled(), onChange: onChangeCheckBox }))))),
        react_1.default.createElement(MvtMsgModal_1.Row, { width: 288, padding: "0px 20px 0px 36px" },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 100 },
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 42 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: atbDisabled }, "From"),
                        react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: atbDisabled }, movementInfo.lstDepApoCd)),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 16 },
                        react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 16 }),
                        react_1.default.createElement(MvtMsgModal_1.Flex, { width: 16, position: "center" },
                            react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: atbDisabled }, "-"))),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 42 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: atbDisabled }, "To"),
                        react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: atbDisabled }, movementInfo.lstDepApoCd))),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 96 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: atbDisabled || isAtb() },
                        "ETA(L/D)",
                        timeModeMark),
                    react_1.default.createElement(redux_form_1.Field, { name: "atbInfo.atbEta", width: 96, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 18, showKeyboard: handleDateTimeInputPopup(formValues.atbInfo.atbEta, "atbInfo.atbEta"), displayValue: formatToDDHHmm(formValues.atbInfo.atbEta), maxLength: 6, validate: isInputActive ? [validates.required, myValidates.rangeMovementDate] : undefined, onChange: handleOnChange("atbInfo.atbEta"), isForceError: getIsForceError("atbInfo.atbEta"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || atbDisabled || isAtb() }))))));
};
exports.default = MvtMsgAtbContainer;
//# sourceMappingURL=MvtMsgAtbContainer.js.map