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
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const RadioButton_1 = __importDefault(require("../../atoms/RadioButton"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const TimeInputPlusMinusButtons_1 = __importDefault(require("../TimeInputPlusMinusButtons"));
const TimeInputPanel_1 = __importDefault(require("../TimeInputPanel"));
// eslint-disable-next-line import/no-cycle
const MvtMsgModal_1 = require("../../organisms/MvtMsgModal");
const MvtMsgArrContainer = (props) => {
    const { movementInfo, formValues, arrDisabled, avgTaxiVisible, mvtMsgModalIsOpen, changeValue, checkHasDiffInForm, checkHasDiffInMsgSetting, initializeMvtForm, initializeMsgSetting, handleDateTimeInputPopup, handleOnChange, getIsForceError, onChangeRadioButton, } = props;
    const ARR = "ARR";
    const dispatch = (0, hooks_1.useAppDispatch)();
    const master = (0, hooks_1.useAppSelector)((state) => state.account.master);
    const [hasAta, setHasAta] = (0, react_1.useState)(false);
    const [isCancel, setIsCancel] = (0, react_1.useState)(false);
    const [isInputActive, setIsInputActive] = (0, react_1.useState)(false);
    const [calcBtnFlg, setCalcBtnFlg] = (0, react_1.useState)(false);
    const [isDlyDisabled, setIsDlyDisabled] = (0, react_1.useState)(false);
    const [avgTaxiInfo, setAvgTaxiInfo] = (0, react_1.useState)("");
    const [initAvgTaxiInfo, setInitAvgTaxiInfo] = (0, react_1.useState)("");
    const [initAvgTaxiVisible, setInitAvgTaxiVisible] = (0, react_1.useState)(false);
    const [initProcessed, setInitProcessed] = (0, react_1.useState)(false);
    /** 初期表示時の処理 */
    (0, react_1.useEffect)(() => {
        if (mvtMsgModalIsOpen) {
            const { arrMvtMsgFlg, legCreRsnCd, prevTaxiingTimeMin, prevMvtDepApoCd, orgLstDepApoCd, lstDepApoCd, taxiingTimeMin } = movementInfo;
            // 初期表示時点のavgTaxiVisibleを保持しておく
            setInitAvgTaxiVisible(avgTaxiVisible);
            const hasPrevTaxiInfo = typeof prevTaxiingTimeMin === "number" && !!prevMvtDepApoCd;
            const apoCd = !arrMvtMsgFlg ? (legCreRsnCd === "RCV" ? orgLstDepApoCd : lstDepApoCd) : hasPrevTaxiInfo ? prevMvtDepApoCd : null;
            const time = !arrMvtMsgFlg ? taxiingTimeMin : hasPrevTaxiInfo ? prevTaxiingTimeMin : null;
            if (!arrMvtMsgFlg && hasPrevTaxiInfo) {
                dispatch((0, mvtMsgModal_1.setAvgTaxiTime)({ taxiingTimeMin: prevTaxiingTimeMin }));
            }
            const timeStr = time === null || time === void 0 ? void 0 : time.toString();
            const avgTaxiInfoStr = !!apoCd && !!timeStr ? `${apoCd}/${timeStr}` : "";
            setInitAvgTaxiInfo(avgTaxiInfoStr); // ラジオボタン変更時の初期化の条件に使用する為の値を保持する
            setAvgTaxiInfo(avgTaxiInfoStr); // 表示する値を保持する
            setInitProcessed(true);
        }
        else {
            setInitProcessed(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mvtMsgModalIsOpen]);
    /** AVG TAXI欄に表示する値をセットする */
    (0, react_1.useEffect)(() => {
        if (calcBtnFlg && !arrDisabled) {
            // ARR DLY再計算ボタン押下時の処理
            const { lstDepApoCd, taxiingTimeMin, legCreRsnCd, orgLstDepApoCd } = movementInfo;
            if (taxiingTimeMin !== null) {
                const apoCd = legCreRsnCd === "RCV" ? orgLstDepApoCd : lstDepApoCd;
                const time = taxiingTimeMin.toString();
                setAvgTaxiInfo(`${apoCd}/${time}`);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movementInfo.taxiingTimeMin, movementInfo.prevMvtDepApoCd]);
    /** formValues以外の状態を初期化する */
    (0, react_1.useEffect)(() => {
        if (!arrDisabled) {
            setIsCancel(false);
            setCalcBtnFlg(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrDisabled]);
    /** AVG TAXI情報を初期化する */
    (0, react_1.useEffect)(() => {
        if (initProcessed && arrDisabled) {
            setAvgTaxiInfo(initAvgTaxiInfo);
            const taxiingTimeMin = parseInt(initAvgTaxiInfo.slice(initAvgTaxiInfo.indexOf("/") + 1), 10);
            const prevMvtDepApoCd = initAvgTaxiInfo.split("/")[0];
            dispatch((0, mvtMsgModal_1.setAvgTaxiTime)({ taxiingTimeMin }));
            dispatch((0, mvtMsgModal_1.setPrevMvtDepApo)({ prevMvtDepApoCd }));
            dispatch((0, mvtMsgModal_1.setAvgTaxiVisible)({ avgTaxiVisible: initAvgTaxiVisible }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrDisabled]);
    /** ARR DLY 再計算ボタンの活性状態判定の為、ATAの有無を管理する */
    (0, react_1.useEffect)(() => {
        if (formValues.arrInfo.ata) {
            setHasAta(true);
        }
        else {
            setHasAta(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues.arrInfo.ata]);
    /** バリデーション要否判定の為、入力項目の活性状態を管理する */
    (0, react_1.useEffect)(() => {
        setIsInputActive(!(formValues.arrInfo.cnlCheckBox || !(0, lodash_1.isEqual)(formValues.mvtMsgRadioButton, ARR)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues.mvtMsgRadioButton, formValues.arrInfo.cnlCheckBox]);
    /** 実績値によって遅延情報の入力項目の非活性状態を制御する */
    (0, react_1.useEffect)(() => {
        const { sta, ata } = formValues.arrInfo;
        if (!sta) {
            setIsDlyDisabled(false);
        }
        else {
            setIsDlyDisabled(!ata || sta >= ata);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues.arrInfo.sta, formValues.arrInfo.ata]);
    /** 遅延情報欄が実績値により非活性化する場合、遅延情報を全て空欄にする */
    (0, react_1.useEffect)(() => {
        if (!arrDisabled && !isCancel && isDlyDisabled) {
            initArrDlyInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDlyDisabled]);
    /** ARR DLYマニュアル変更処理 */
    const handleOnChangeArrDly = (fieldName) => () => {
        dispatch((0, mvtMsgModal_1.setAvgTaxiVisible)({ avgTaxiVisible: false }));
        handleOnChange(fieldName)();
    };
    /** 到着遅延情報欄を初期化する */
    const initArrDlyInfo = () => {
        changeValue("arrInfo.arrDlyTime1")("");
        changeValue("arrInfo.arrDlyTime2")("");
        changeValue("arrInfo.arrDlyTime3")("");
        changeValue("arrInfo.arrDlyRsnCd1")("");
        changeValue("arrInfo.arrDlyRsnCd2")("");
        changeValue("arrInfo.arrDlyRsnCd3")("");
        dispatch((0, mvtMsgModal_1.setAvgTaxiVisible)({ avgTaxiVisible: false }));
    };
    /** キャンセルチェックボックス押下時の処理 */
    const onChangeCheckBox = (event) => {
        const { checked } = event.target;
        if (checked) {
            // 自フォーム内もしくは送信設定共通入力欄で変更があるか確認して分岐
            if (checkHasDiffInForm(ARR) || checkHasDiffInMsgSetting(ARR)) {
                void dispatch((0, mvtMsgModal_1.showMessage)({
                    message: soalaMessages_1.SoalaMessage.M40012C({
                        onYesButton: () => {
                            initializeMvtForm(ARR, true);
                            initializeMsgSetting(ARR);
                            setIsCancel(checked);
                        },
                        // キャンセルチェックボックスを元に戻す
                        onNoButton: () => changeValue("arrInfo.cnlCheckBox")(false),
                    }),
                }));
            }
            else {
                initializeMvtForm(ARR, true);
                initializeMsgSetting(ARR);
                setIsCancel(checked);
            }
        }
        else {
            setIsCancel(checked);
        }
    };
    /** ARR DLY 再計算ボタン押下処理 */
    const handleOnClickCalclate = async () => {
        setCalcBtnFlg(true);
        const { legKey } = movementInfo;
        const callbacks = {
            onNotFoundRecord: () => dispatch((0, mvtMsgModal_1.closeMvtMsgModal)()),
            onNetworkError: () => dispatch((0, mvtMsgModal_1.fetchMvtMsgReCalcFailure)()),
        };
        const latestTaxiingTime = await dispatch((0, mvtMsgModal_1.reCalcInstruction)({ legKey, callbacks })).unwrap();
        try {
            if (typeof latestTaxiingTime === "number") {
                const arrDlyInfo = (0, mvtMsgModal_1.getArrDlyInfo)(formValues, movementInfo, latestTaxiingTime);
                if (arrDlyInfo) {
                    Object.keys(arrDlyInfo).forEach((key) => changeValue(`arrInfo.${key}`)(arrDlyInfo[key]));
                    dispatch((0, mvtMsgModal_1.setAvgTaxiVisible)({ avgTaxiVisible: true }));
                }
                else {
                    initArrDlyInfo();
                }
            }
            else {
                void dispatch((0, mvtMsgModal_1.showMessage)({
                    message: soalaMessages_1.SoalaMessage.M40022C({}),
                }));
            }
        }
        catch (err) {
            // 何もしない
        }
    };
    /** ラジオボタンの活性状態を取得する */
    const radioButtonEnabled = () => {
        const { depMvtMsgFlg, arrMvtMsgFlg } = movementInfo;
        return (depMvtMsgFlg && !arrMvtMsgFlg) || arrMvtMsgFlg;
    };
    /** 非編集項目からARR DLY再計算ボタンの非活性状態を取得する */
    const getArrDlyCalcBtnDisabledFromNonEditable = () => {
        const { depMvtMsgFlg, irrSts, staUtc, stdUtc, legCreRsnCd, orgStdUtc } = movementInfo;
        const irrCondition = irrSts === "ATB" || irrSts === "DIV";
        const staCondition = !(0, dayjs_1.default)(staUtc).isValid();
        const rcvFltLegCondition = !((0, dayjs_1.default)(stdUtc).isValid() || (legCreRsnCd === "RCV" && (0, dayjs_1.default)(orgStdUtc).isValid()));
        return !depMvtMsgFlg || irrCondition || staCondition || rcvFltLegCondition;
    };
    const formatToDDHHmm = (dateTimeValue) => {
        if (dateTimeValue && (0, dayjs_1.default)(dateTimeValue).isValid()) {
            return (0, dayjs_1.default)(dateTimeValue).format("DDHHmm");
        }
        return "";
    };
    const normalizeFuel = (value) => {
        const onlyNums = value.replace(/[^\d]/g, "");
        if (!onlyNums)
            return "";
        const newValue = Number(onlyNums);
        return String(newValue);
    };
    const normalizeWindFactor = (value) => {
        const onlyUpperCaseLettersAndNums = value.toUpperCase().replace(/[^PM0-9]/g, "");
        if (!onlyUpperCaseLettersAndNums)
            return "";
        return onlyUpperCaseLettersAndNums;
    };
    const normalizeTime = (value) => {
        const onlyNums = value.replace(/[^\d]/g, "");
        return onlyNums;
    };
    const arrDlyRsnOption = master.dlyRsns
        ? master.dlyRsns
            .filter((d) => d.arrDepCd === "ARR")
            .sort((a, b) => a.dispSeq - b.dispSeq)
            .map((d) => ({ label: d.dlyRsnJalCd, value: d.dlyRsnJalCd }))
        : [];
    const isDomestic = movementInfo.intDomCat === "D";
    const timeModeMark = isDomestic ? "(L)" : "(Z)";
    return (react_1.default.createElement(MvtMsgModal_1.Content, null,
        react_1.default.createElement(MvtMsgModal_1.Row, { marginBottom: 9, padding: "0px 8px 0px 0px" },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 24 },
                    react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 24 }),
                    movementInfo.arrMvtMsgFlg && react_1.default.createElement(MvtMsgModal_1.MvtMsgFlgIconSvg, null)),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 76 },
                    react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 76 }),
                    react_1.default.createElement(redux_form_1.Field, { name: "mvtMsgRadioButton", id: `${ARR}RadioButton`, tabIndex: 0, type: "radio", value: ARR, isShadowOnFocus: true, component: RadioButton_1.default, onChange: onChangeRadioButton, disabled: !radioButtonEnabled() }),
                    react_1.default.createElement(MvtMsgModal_1.ComponentLabel, { htmlFor: `${ARR}RadioButton`, disabled: !radioButtonEnabled() }, ARR)),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 7 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 59 },
                    react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 59 }),
                    react_1.default.createElement(MvtMsgModal_1.CheckBoxLabel, { htmlFor: "arrInfo.cnlCheckBox", disabled: arrDisabled, checkBoxDisabled: !movementInfo.arrMvtMsgFlg || arrDisabled },
                        "CNL",
                        react_1.default.createElement(redux_form_1.Field, { id: "arrInfo.cnlCheckBox", name: "arrInfo.cnlCheckBox", component: "input", tabIndex: 0, type: "checkbox", disabled: !movementInfo.arrMvtMsgFlg || arrDisabled, onChange: onChangeCheckBox }))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 22 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 64 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: arrDisabled },
                        "STA",
                        timeModeMark),
                    react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: arrDisabled }, formatToDDHHmm(formValues.arrInfo.sta))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 10 }),
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 280 },
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 168 },
                        react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { showDisabled: true, dateTimeValue: formValues.arrInfo.actLd, onClick: changeValue("arrInfo.actLd"), disabled: isCancel || arrDisabled },
                            react_1.default.createElement(MvtMsgModal_1.Col, { width: 96 },
                                react_1.default.createElement(MvtMsgModal_1.Label, { disabled: arrDisabled },
                                    "L/D",
                                    timeModeMark),
                                react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.actLd", width: 96, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 18, showKeyboard: handleDateTimeInputPopup(formValues.arrInfo.actLd, "arrInfo.actLd"), displayValue: formatToDDHHmm(formValues.arrInfo.actLd), maxLength: 6, validate: isInputActive
                                        ? [validates.required, myValidates.orderToLd, myValidates.orderLdAta, myValidates.rangeMovementDate]
                                        : undefined, onChange: handleOnChange("arrInfo.actLd"), isForceError: getIsForceError("arrInfo.actLd"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || arrDisabled })))),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 100 },
                        react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 100 }),
                        react_1.default.createElement(TimeInputPanel_1.default, { dateTimeValue: formValues.arrInfo.actLd, timeDiff: isDomestic ? 900 : 0, onClick: changeValue("arrInfo.actLd"), width: "100px", height: "40px", disabled: isCancel || arrDisabled }))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 280 },
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 168 },
                        react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { showDisabled: true, dateTimeValue: formValues.arrInfo.ata, onClick: changeValue("arrInfo.ata"), disabled: isCancel || arrDisabled },
                            react_1.default.createElement(MvtMsgModal_1.Col, { width: 96 },
                                react_1.default.createElement(MvtMsgModal_1.Label, { disabled: arrDisabled },
                                    "ATA",
                                    timeModeMark),
                                react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.ata", width: 96, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 18, showKeyboard: handleDateTimeInputPopup(formValues.arrInfo.ata, "arrInfo.ata"), displayValue: formatToDDHHmm(formValues.arrInfo.ata), maxLength: 6, validate: isInputActive ? [validates.required, myValidates.orderLdAta, myValidates.rangeMovementDate] : undefined, isForceError: getIsForceError("arrInfo.ata"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || arrDisabled })))),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 100 },
                        react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 100 }),
                        react_1.default.createElement(TimeInputPanel_1.default, { dateTimeValue: formValues.arrInfo.ata, timeDiff: isDomestic ? 900 : 0, onClick: changeValue("arrInfo.ata"), width: "100px", height: "40px", disabled: isCancel || arrDisabled }))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 18 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 84 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: arrDisabled }, "RF"),
                    react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.fuelRemain", width: 84, height: 40, pattern: "\\d*", component: TextInput_1.default, normalize: normalizeFuel, maxLength: 6, validate: isInputActive ? [myValidates.isFuelRemain] : undefined, onChange: handleOnChange("arrInfo.fuelRemain"), isForceError: getIsForceError("arrInfo.fuelRemain"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || arrDisabled })))),
        react_1.default.createElement(MvtMsgModal_1.Row, { padding: "0px 10px 0px 36px" },
            react_1.default.createElement(MvtMsgModal_1.Flex, null,
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 100 },
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 42 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: arrDisabled }, "From"),
                        react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: arrDisabled }, movementInfo.lstDepApoCd)),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 16 },
                        react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 16 }),
                        react_1.default.createElement(MvtMsgModal_1.Flex, { width: 16, position: "center" },
                            react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: arrDisabled }, "-"))),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 42 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: arrDisabled }, "To"),
                        react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: arrDisabled }, movementInfo.lstArrApoCd))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 64 }),
                react_1.default.createElement(MvtMsgModal_1.Col, { width: 436 },
                    react_1.default.createElement(MvtMsgModal_1.Label, { disabled: arrDisabled }, "ARR DLY Time/Reason ---------------------------------------------------------"),
                    react_1.default.createElement(MvtMsgModal_1.Flex, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.arrDlyTime1", width: 72, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", maxLength: 4, pattern: "\\d*", normalize: normalizeTime, validate: isInputActive && !isDlyDisabled
                                ? [myValidates.requiredArrDlyTime, validates.dlyTime, myValidates.matchArrDlyTime]
                                : undefined, onChange: handleOnChangeArrDly("arrInfo.arrDlyTime1"), isForceError: getIsForceError("arrInfo.arrDlyTime1"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || arrDisabled || isDlyDisabled }),
                        react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                        react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.arrDlyRsnCd1", width: 64, height: 40, component: SelectBox_1.default, options: arrDlyRsnOption, validate: isInputActive && !isDlyDisabled ? [myValidates.requiredArrDlyRsnCd] : undefined, maxMenuHeight: 136, onChange: handleOnChangeArrDly("arrInfo.arrDlyRsnCd1"), isForceError: getIsForceError("arrInfo.arrDlyRsnCd1"), hasBlank: true, isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true, disabled: isCancel || arrDisabled || isDlyDisabled }),
                        react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                        react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.arrDlyTime2", width: 72, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", maxLength: 4, pattern: "\\d*", normalize: normalizeTime, validate: isInputActive && !isDlyDisabled
                                ? [myValidates.requiredArrDlyTime, validates.dlyTime, myValidates.matchArrDlyTime]
                                : undefined, onChange: handleOnChangeArrDly("arrInfo.arrDlyTime2"), isForceError: getIsForceError("arrInfo.arrDlyTime2"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || arrDisabled || isDlyDisabled }),
                        react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                        react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.arrDlyRsnCd2", width: 64, height: 40, component: SelectBox_1.default, options: arrDlyRsnOption, validate: isInputActive && !isDlyDisabled ? [myValidates.requiredArrDlyRsnCd] : undefined, maxMenuHeight: 136, onChange: handleOnChangeArrDly("arrInfo.arrDlyRsnCd2"), isForceError: getIsForceError("arrInfo.arrDlyRsnCd2"), hasBlank: true, isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true, disabled: isCancel || arrDisabled || isDlyDisabled }),
                        react_1.default.createElement(MvtMsgModal_1.Space, { width: 8 }),
                        react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.arrDlyTime3", width: 72, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", maxLength: 4, pattern: "\\d*", normalize: normalizeTime, validate: isInputActive && !isDlyDisabled
                                ? [myValidates.requiredArrDlyTime, validates.dlyTime, myValidates.matchArrDlyTime]
                                : undefined, onChange: handleOnChangeArrDly("arrInfo.arrDlyTime3"), isForceError: getIsForceError("arrInfo.arrDlyTime3"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || arrDisabled || isDlyDisabled }),
                        react_1.default.createElement(MvtMsgModal_1.Space, { width: 4 }),
                        react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.arrDlyRsnCd3", width: 64, height: 40, component: SelectBox_1.default, options: arrDlyRsnOption, validate: isInputActive && !isDlyDisabled ? [myValidates.requiredArrDlyRsnCd] : undefined, maxMenuHeight: 136, onChange: handleOnChangeArrDly("arrInfo.arrDlyRsnCd3"), isForceError: getIsForceError("arrInfo.arrDlyRsnCd3"), hasBlank: true, isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true, disabled: isCancel || arrDisabled || isDlyDisabled }))),
                react_1.default.createElement(MvtMsgModal_1.Space, { width: 12 }),
                react_1.default.createElement(MvtMsgModal_1.Flex, { width: 306, position: "flex-start" },
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 80 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: arrDisabled }, "AVG TAXI"),
                        avgTaxiVisible ? react_1.default.createElement(MvtMsgModal_1.LabelItem, { disabled: arrDisabled }, avgTaxiInfo) : react_1.default.createElement(MvtMsgModal_1.LabelItem, null)),
                    react_1.default.createElement(MvtMsgModal_1.Space, { width: 14 }),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 112 },
                        react_1.default.createElement(MvtMsgModal_1.Space, { isDummyLabel: true, width: 112 }),
                        react_1.default.createElement(PrimaryButton_1.default, { type: "button", text: "Calculate", width: "112px", height: "40px", onClick: () => {
                                void handleOnClickCalclate();
                            }, disabled: getArrDlyCalcBtnDisabledFromNonEditable() || !hasAta || isCancel || arrDisabled || isDlyDisabled })),
                    react_1.default.createElement(MvtMsgModal_1.Space, { width: 18 }),
                    react_1.default.createElement(MvtMsgModal_1.Col, { width: 70 },
                        react_1.default.createElement(MvtMsgModal_1.Label, { disabled: arrDisabled }, "WF"),
                        react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.windFactor", width: 70, height: 40, pattern: "[A-Za-z0-9]*", component: TextInput_1.default, normalize: normalizeWindFactor, maxLength: 4, validate: isInputActive ? [myValidates.isWindFactor] : undefined, onChange: handleOnChange("arrInfo.windFactor"), isForceError: getIsForceError("arrInfo.windFactor"), isShadowOnFocus: true, isShowEditedColor: true, disabled: isCancel || arrDisabled })))))));
};
exports.default = MvtMsgArrContainer;
//# sourceMappingURL=MvtMsgArrContainer.js.map