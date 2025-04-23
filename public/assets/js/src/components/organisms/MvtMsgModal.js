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
exports.LabelItem = exports.CheckBoxLabel = exports.ComponentLabel = exports.MvtMsgFlgIconSvg = exports.IrregularContent = exports.Space = exports.Label = exports.Col = exports.Row = exports.Flex = exports.Content = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_1 = require("lodash");
const react_1 = __importStar(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importStar(require("styled-components"));
const lodash_difference_1 = __importDefault(require("lodash.difference"));
const notifications_1 = require("../../lib/notifications");
const soalaMessages_1 = require("../../lib/soalaMessages");
const storage_1 = require("../../lib/storage");
const hooks_1 = require("../../store/hooks");
// eslint-disable-next-line import/no-cycle
const myValidates = __importStar(require("../../lib/validators/mvtMsgValidator"));
const dateTimeInputPopup_1 = require("../../reducers/dateTimeInputPopup");
const mvtMsgModal_1 = require("../../reducers/mvtMsgModal");
const mvt_msg_flg_svg_1 = __importDefault(require("../../assets/images/icon/mvt_msg_flg.svg"));
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const FlightLegDetailHeader_1 = __importDefault(require("../molecules/FlightLegDetailHeader"));
// eslint-disable-next-line import/no-cycle
const MvtMsgDepContainer_1 = __importDefault(require("../molecules/MvtMsgModal/MvtMsgDepContainer"));
// eslint-disable-next-line import/no-cycle
const MvtMsgArrContainer_1 = __importDefault(require("../molecules/MvtMsgModal/MvtMsgArrContainer"));
// eslint-disable-next-line import/no-cycle
const MvtMsgGtbContainer_1 = __importDefault(require("../molecules/MvtMsgModal/MvtMsgGtbContainer"));
// eslint-disable-next-line import/no-cycle
const MvtMsgAtbContainer_1 = __importDefault(require("../molecules/MvtMsgModal/MvtMsgAtbContainer"));
// eslint-disable-next-line import/no-cycle
const MvtMsgDivContainer_1 = __importDefault(require("../molecules/MvtMsgModal/MvtMsgDivContainer"));
// eslint-disable-next-line import/no-cycle
const MvtMsgCommonContainer_1 = __importDefault(require("../molecules/MvtMsgModal/MvtMsgCommonContainer"));
const MvtMsgModal = (props) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { mvtMsgModal, formValues, initialValues, handleSubmit, change, untouch } = props;
    const { movementInfo } = mvtMsgModal;
    const dispatch = (0, hooks_1.useAppDispatch)();
    const [updateValidationErrors, setUpdateValidationErrors] = (0, react_1.useState)([]);
    const [currentRadioButtonValue, setCurrentRadioButtonValue] = (0, react_1.useState)("");
    const [divDisabled, setDivDisabled] = (0, react_1.useState)(true);
    const [depDisabled, setDepDisabled] = (0, react_1.useState)(true);
    const [arrDisable, setArrDisabled] = (0, react_1.useState)(true);
    const [gtbDisabled, setGtbDisabled] = (0, react_1.useState)(true);
    const [atbDisabled, setAtbDisabled] = (0, react_1.useState)(true);
    /** 入力項目の変更状態を検知してUpdate&Sendボタンを制御する */
    const submitBtnEnabled = (0, react_1.useMemo)(() => {
        var _a;
        if (!formValues || !movementInfo)
            return false;
        const { mvtMsgRadioButton, atbInfo, divInfo } = formValues;
        const { actLdUtc, actToUtc, irrSts } = movementInfo;
        switch (mvtMsgRadioButton) {
            case "DEP":
            case "ARR":
            case "GTB":
                return true;
            case "ATB":
                if (!actLdUtc && actToUtc && !irrSts) {
                    //  [L/D]値なし、かつ、[T/O]値あり、かつ、イレギュラーではない
                    return true;
                }
                if (!actLdUtc && irrSts === "ATB" && atbInfo.cnlCheckBox) {
                    //  ATB中、かつ、[L/D]値なし
                    return true;
                }
                // それ以外
                return false;
            case "DIV":
                // ラジオボタンONかつ入力項目（DIV先空港）変更有りもしくはキャンセルチェックボックスON
                return !(0, lodash_1.isEqual)(divInfo.lstArrApoCd, (_a = initialValues.divInfo) === null || _a === void 0 ? void 0 : _a.lstArrApoCd) || divInfo.cnlCheckBox;
            default:
                return false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues]);
    (0, react_1.useEffect)(() => {
        if (mvtMsgModal.isOpen)
            resetForm();
    }, [mvtMsgModal.isOpen]);
    (0, react_1.useEffect)(() => {
        // サーバーのエラーがある場合、赤枠を表示させる
        if (!mvtMsgModal.isFetching) {
            setUpdateValidationErrors(mvtMsgModal.updateValidationErrors);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mvtMsgModal.isFetching]);
    /** ラジオボタン押下処理 */
    const onChangeRadioButton = (event) => {
        const newValue = event.target.value;
        const prevValue = currentRadioButtonValue;
        if (prevValue) {
            // mvtフォーム内で変更があるか確認して分岐
            if (checkHasDiffInForm(prevValue) || checkHasDiffInMsgSetting(prevValue)) {
                void dispatch((0, mvtMsgModal_1.showMessage)({
                    message: soalaMessages_1.SoalaMessage.M40012C({
                        onYesButton: () => {
                            changeRadioButtonValue(prevValue, newValue);
                        },
                        // 選択ラジオボタンを元に戻す
                        onNoButton: () => change("mvtMsgRadioButton", prevValue),
                    }),
                }));
            }
            else {
                changeRadioButtonValue(prevValue, newValue);
            }
        }
        else {
            // ラジオボタン初回押下時
            changeRadioButtonValue(prevValue, newValue);
        }
    };
    /** ラジオボタン変更処理 */
    const changeRadioButtonValue = (prevValue, newValue) => {
        untouchField();
        if (prevValue) {
            initializeMvtForm(prevValue);
        }
        change("mvtMsgRadioButton", newValue);
        setCurrentRadioButtonValue(newValue);
        initializeMsgSetting(newValue);
        switch (newValue) {
            case "DEP":
                setDepDisabled(false);
                break;
            case "ARR":
                setArrDisabled(false);
                break;
            case "GTB":
                setGtbDisabled(false);
                break;
            case "ATB":
                setAtbDisabled(false);
                break;
            case "DIV":
                setDivDisabled(false);
                break;
            default:
                break;
        }
    };
    // 入力項目のtouchedをfalseにして、バリデーションエラーの赤線を解除
    const untouchField = () => {
        const inputFields = [
            "depInfo.atd",
            "depInfo.actTo",
            "depInfo.depDlyTime1",
            "depInfo.depDlyTime2",
            "depInfo.depDlyTime3",
            "depInfo.depDlyRsnCd1",
            "depInfo.depDlyRsnCd2",
            "depInfo.depDlyRsnCd3",
            "arrInfo.actLd",
            "arrInfo.ata",
            "arrInfo.fuelRemain",
            "arrInfo.arrDlyTime1",
            "arrInfo.arrDlyTime2",
            "arrInfo.arrDlyTime3",
            "arrInfo.arrDlyTime4",
            "arrInfo.arrDlyRsnCd1",
            "arrInfo.arrDlyRsnCd2",
            "arrInfo.arrDlyRsnCd3",
            "arrInfo.arrDlyRsnCd4",
            "arrInfo.windFactor",
            "atbInfo.atbEta",
            "divInfo.divEta",
            "divInfo.lstArrApoCd",
            "msgInfo.priority",
            "msgInfo.dtg",
            "msgInfo.originator",
            "msgInfo.remarks",
            "msgInfo.ttyAddressList",
        ];
        untouch(formName, ...inputFields);
        notifications_1.NotificationCreator.removeAll({ dispatch });
    };
    /** ソフトウェアキーボード（カレンダー日時入力用）を出す */
    const handleDateTimeInputPopup = (value, fieldName) => () => {
        const isDomestic = (movementInfo === null || movementInfo === void 0 ? void 0 : movementInfo.intDomCat) === "D";
        const nowDate = isDomestic ? (0, dayjs_1.default)().tz("Asia/Tokyo").format("YYYY-MM-DDTHH:mm:ss") : dayjs_1.default.utc().format("YYYY-MM-DDTHH:mm:ss");
        const dateRange = movementInfo ? myValidates.getAvailableDateRange(movementInfo.legKey.orgDateLcl) : null;
        const isAtbCorrect = fieldName === "atbInfo.atbEta" && (movementInfo === null || movementInfo === void 0 ? void 0 : movementInfo.irrSts) === "ATB" && !movementInfo.actLdUtc;
        dispatch((0, dateTimeInputPopup_1.openDateTimeInputPopup)({
            valueFormat: "YYYY-MM-DD[T]HH:mm:ss",
            currentValue: value || "",
            defaultSetting: value ? { value } : { value: nowDate },
            onEnter: changeValue(fieldName),
            onUpdate: isAtbCorrect
                ? undefined
                : async (dateTime) => {
                    // eslint-disable-next-line @typescript-eslint/await-thenable
                    await changeValue(fieldName)(dateTime);
                    // eslint-disable-next-line @typescript-eslint/await-thenable
                    await dispatch((0, redux_form_1.submit)(formName));
                },
            doTypoCheck: true,
            minDate: dateRange ? dateRange.minDateDayjs.toDate() : undefined,
            maxDate: dateRange ? dateRange.maxDateDayjs.toDate() : undefined,
        }));
    };
    const changeValue = (fieldName) => (value) => {
        change(fieldName, value);
        handleOnChange(fieldName)();
    };
    const handleOnChange = (fieldName) => () => {
        // サーバーのバリデーションでエラーとなった対象項目の赤枠を消す
        const errorItems = mvtMsgModal_1.serverErrorItems[fieldName];
        setUpdateValidationErrors((0, lodash_difference_1.default)(updateValidationErrors, errorItems));
    };
    const resetForm = () => {
        setCurrentRadioButtonValue("");
        setDepDisabled(true);
        setArrDisabled(true);
        setGtbDisabled(true);
        setAtbDisabled(true);
        setDivDisabled(true);
    };
    const closeModal = (e) => {
        e.stopPropagation();
        const close = () => {
            dispatch((0, mvtMsgModal_1.closeMvtMsgModal)());
        };
        const formNames = ["DEP", "ARR", "GTB", "ATB", "DIV"];
        const formName = formValues === null || formValues === void 0 ? void 0 : formValues.mvtMsgRadioButton;
        if (formName && (formNames.some(checkHasDiffInForm) || checkHasDiffInMsgSetting(formName))) {
            void dispatch((0, mvtMsgModal_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: close }) }));
        }
        else {
            close();
        }
    };
    const getIsForceError = (fieldName) => {
        const errorItems = mvtMsgModal_1.serverErrorItems[fieldName];
        for (let xi = 0; xi < errorItems.length; xi++) {
            const includes = updateValidationErrors.includes(errorItems[xi]);
            if (includes)
                return true;
        }
        return false;
    };
    /** 指定した動態情報を初期化する */
    const initializeMvtForm = (formName, isCnlCheckBox) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        switch (formName) {
            case "DEP":
                change("depInfo.atd", (_a = initialValues.depInfo) === null || _a === void 0 ? void 0 : _a.atd);
                change("depInfo.actTo", (_b = initialValues.depInfo) === null || _b === void 0 ? void 0 : _b.actTo);
                change("depInfo.depDlyTime1", (_c = initialValues.depInfo) === null || _c === void 0 ? void 0 : _c.depDlyTime1);
                change("depInfo.depDlyTime2", (_d = initialValues.depInfo) === null || _d === void 0 ? void 0 : _d.depDlyTime2);
                change("depInfo.depDlyTime3", (_e = initialValues.depInfo) === null || _e === void 0 ? void 0 : _e.depDlyTime3);
                change("depInfo.depDlyRsnCd1", (_f = initialValues.depInfo) === null || _f === void 0 ? void 0 : _f.depDlyRsnCd1);
                change("depInfo.depDlyRsnCd2", (_g = initialValues.depInfo) === null || _g === void 0 ? void 0 : _g.depDlyRsnCd2);
                change("depInfo.depDlyRsnCd3", (_h = initialValues.depInfo) === null || _h === void 0 ? void 0 : _h.depDlyRsnCd3);
                if (!isCnlCheckBox) {
                    change("depInfo.cnlCheckBox", false);
                    setDepDisabled(true);
                }
                break;
            case "ARR":
                change("arrInfo.actLd", (_j = initialValues.arrInfo) === null || _j === void 0 ? void 0 : _j.actLd);
                change("arrInfo.ata", (_k = initialValues.arrInfo) === null || _k === void 0 ? void 0 : _k.ata);
                change("arrInfo.fuelRemain", (_l = initialValues.arrInfo) === null || _l === void 0 ? void 0 : _l.fuelRemain);
                change("arrInfo.arrDlyTime1", (_m = initialValues.arrInfo) === null || _m === void 0 ? void 0 : _m.arrDlyTime1);
                change("arrInfo.arrDlyTime2", (_o = initialValues.arrInfo) === null || _o === void 0 ? void 0 : _o.arrDlyTime2);
                change("arrInfo.arrDlyTime3", (_p = initialValues.arrInfo) === null || _p === void 0 ? void 0 : _p.arrDlyTime3);
                change("arrInfo.arrDlyRsnCd1", (_q = initialValues.arrInfo) === null || _q === void 0 ? void 0 : _q.arrDlyRsnCd1);
                change("arrInfo.arrDlyRsnCd2", (_r = initialValues.arrInfo) === null || _r === void 0 ? void 0 : _r.arrDlyRsnCd2);
                change("arrInfo.arrDlyRsnCd3", (_s = initialValues.arrInfo) === null || _s === void 0 ? void 0 : _s.arrDlyRsnCd3);
                change("arrInfo.windFactor", (_t = initialValues.arrInfo) === null || _t === void 0 ? void 0 : _t.windFactor);
                if (!isCnlCheckBox) {
                    change("arrInfo.cnlCheckBox", false);
                    setArrDisabled(true);
                }
                break;
            case "GTB":
                if (!isCnlCheckBox) {
                    change("gtbInfo.cnlCheckBox", false);
                    setGtbDisabled(true);
                }
                break;
            case "ATB":
                change("atbInfo.atbEta", (_u = initialValues.atbInfo) === null || _u === void 0 ? void 0 : _u.atbEta);
                if (!isCnlCheckBox) {
                    change("atbInfo.cnlCheckBox", false);
                    setAtbDisabled(true);
                }
                break;
            case "DIV":
                change("divInfo.lstArrApoCd", (_v = initialValues.divInfo) === null || _v === void 0 ? void 0 : _v.lstArrApoCd);
                change("divInfo.divEta", (_w = initialValues.divInfo) === null || _w === void 0 ? void 0 : _w.divEta);
                if (!isCnlCheckBox) {
                    change("divInfo.cnlCheckBox", false);
                    setDivDisabled(true);
                }
                break;
            default:
                break;
        }
    };
    /** 指定された動態情報に基づいて送信設定共通入力欄を初期化する */
    const initializeMsgSetting = (formName) => {
        var _a, _b, _c, _d;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        change("msgInfo.priority", (_a = initialValues.msgInfo) === null || _a === void 0 ? void 0 : _a.priority);
        change("msgInfo.dtg", (_b = initialValues.msgInfo) === null || _b === void 0 ? void 0 : _b.dtg);
        change("msgInfo.originator", (_c = initialValues.msgInfo) === null || _c === void 0 ? void 0 : _c.originator);
        change("msgInfo.remarks", (_d = initialValues.msgInfo) === null || _d === void 0 ? void 0 : _d.remarks);
        change("msgInfo.ttyAddressList", getInitTtyAddrList(formName));
    };
    /** 指定した動態情報に変更があるかチェックする */
    const checkHasDiffInForm = (formName) => {
        if (formValues) {
            switch (formName) {
                case "DEP":
                    return !(0, lodash_1.isEqual)(formValues.depInfo, initialValues.depInfo);
                case "ARR":
                    return !(0, lodash_1.isEqual)(formValues.arrInfo, initialValues.arrInfo);
                case "GTB":
                    return !(0, lodash_1.isEqual)(formValues.gtbInfo, initialValues.gtbInfo);
                case "ATB":
                    return !(0, lodash_1.isEqual)(formValues.atbInfo, initialValues.atbInfo);
                case "DIV":
                    return !(0, lodash_1.isEqual)(formValues.divInfo, initialValues.divInfo);
                default:
                    return false;
            }
        }
        return false;
    };
    /** 送信設定共通入力欄に変更があるかチェックする */
    const checkHasDiffInMsgSetting = (formName) => {
        if (formValues && ["DEP", "ARR", "GTB", "ATB", "DIV"].includes(formName)) {
            const { msgInfo } = formValues;
            const { ttyAddressList, priority, dtg, originator, remarks } = msgInfo;
            const initialValueProps = initialValues.msgInfo;
            const isSameTtyAddr = (0, lodash_1.isEqual)(ttyAddressList, getInitTtyAddrList(formName));
            const isSamePriority = (0, lodash_1.isEqual)(priority, initialValueProps === null || initialValueProps === void 0 ? void 0 : initialValueProps.priority);
            const isSameDtg = (0, lodash_1.isEqual)(dtg, initialValueProps === null || initialValueProps === void 0 ? void 0 : initialValueProps.dtg);
            const isSameOriginator = (0, lodash_1.isEqual)(originator, initialValueProps === null || initialValueProps === void 0 ? void 0 : initialValueProps.originator);
            const isSameRemarks = (0, lodash_1.isEqual)(remarks, initialValueProps === null || initialValueProps === void 0 ? void 0 : initialValueProps.remarks);
            return !(isSameTtyAddr && isSamePriority && isSameDtg && isSameOriginator && isSameRemarks);
        }
        return false;
    };
    /** 着発区分「DEP」「ARR」双方のTTYアドレスリストを取得する */
    const getDepArrMvtTtyAddrList = () => {
        if (!movementInfo) {
            return [];
        }
        const { depMvtTtyAddrList, arrMvtTtyAddrList } = movementInfo;
        const depArrMvtTtyAddrList = [...new Set([...depMvtTtyAddrList, ...arrMvtTtyAddrList])];
        return depArrMvtTtyAddrList;
    };
    /** 指定した動態情報のTTYアドレスリストの初期値を取得する */
    const getInitTtyAddrList = (formName) => {
        const msgInfo = initialValues === null || initialValues === void 0 ? void 0 : initialValues.msgInfo;
        let ttyAddrList;
        switch (formName) {
            case "DEP":
                ttyAddrList = movementInfo === null || movementInfo === void 0 ? void 0 : movementInfo.depMvtTtyAddrList;
                break;
            case "ARR":
                ttyAddrList = movementInfo === null || movementInfo === void 0 ? void 0 : movementInfo.arrMvtTtyAddrList;
                break;
            case "GTB":
            case "ATB":
            case "DIV":
                ttyAddrList = getDepArrMvtTtyAddrList();
                break;
            default:
                return [];
        }
        if (!msgInfo || !ttyAddrList)
            return [];
        // tty address listの先頭にoriginatorをセットし、一意のtty address listを返す
        return [...new Set([msgInfo.originator, ...ttyAddrList])];
    };
    const mvtMsgHeader = movementInfo
        ? {
            alCd: movementInfo.legKey.alCd,
            fltNo: movementInfo.legKey.fltNo,
            orgDateLcl: movementInfo.legKey.orgDateLcl,
            csFlg: movementInfo.csCnt > 0,
            lstDepApoCd: movementInfo.lstDepApoCd,
            lstArrApoCd: movementInfo.lstArrApoCd,
            shipNo: movementInfo.shipNo,
            seatConfCd: movementInfo.seatConfCd,
            trAlCd: movementInfo.trAlCd,
            omAlCd: movementInfo.omAlCd,
            ccCnt: movementInfo.ccCnt,
            caCnt: movementInfo.caCnt,
            dhCcCnt: movementInfo.dhCcCnt,
            dhCaCnt: movementInfo.dhCaCnt,
            actPaxTtl: movementInfo.actPaxTtl,
        }
        : undefined;
    return (react_1.default.createElement(react_modal_1.default, { isOpen: mvtMsgModal.isOpen, onRequestClose: closeModal, style: customStyles },
        react_1.default.createElement(Header, { headerHeight: 40 }, mvtMsgHeader && react_1.default.createElement(FlightLegDetailHeader_1.default, { mvtMsgHeader: mvtMsgHeader, onClose: closeModal })),
        react_1.default.createElement(FormContent, { onSubmit: handleSubmit }, movementInfo && formValues && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(GroupBox, { height: 408, color: "#FFF", border: true },
                react_1.default.createElement(MvtMsgDepContainer_1.default, { depDisabled: depDisabled, movementInfo: movementInfo, changeValue: changeValue, checkHasDiffInForm: checkHasDiffInForm, checkHasDiffInMsgSetting: checkHasDiffInMsgSetting, initializeMvtForm: initializeMvtForm, initializeMsgSetting: initializeMsgSetting, getIsForceError: getIsForceError, formValues: formValues, handleDateTimeInputPopup: handleDateTimeInputPopup, handleOnChange: handleOnChange, onChangeRadioButton: onChangeRadioButton }),
                react_1.default.createElement(MvtMsgArrContainer_1.default, { arrDisabled: arrDisable, movementInfo: movementInfo, formValues: formValues, mvtMsgModalIsOpen: mvtMsgModal.isOpen, avgTaxiVisible: mvtMsgModal.avgTaxiVisible, changeValue: changeValue, checkHasDiffInForm: checkHasDiffInForm, checkHasDiffInMsgSetting: checkHasDiffInMsgSetting, initializeMvtForm: initializeMvtForm, initializeMsgSetting: initializeMsgSetting, getIsForceError: getIsForceError, handleDateTimeInputPopup: handleDateTimeInputPopup, handleOnChange: handleOnChange, onChangeRadioButton: onChangeRadioButton }),
                react_1.default.createElement(GroupBox, { height: 112, color: "#FFF", irr: true },
                    react_1.default.createElement(MvtMsgGtbContainer_1.default, { gtbDisabled: gtbDisabled, movementInfo: movementInfo, changeValue: changeValue, onChangeRadioButton: onChangeRadioButton, checkHasDiffInMsgSetting: checkHasDiffInMsgSetting, initializeMsgSetting: initializeMsgSetting }),
                    react_1.default.createElement(MvtMsgAtbContainer_1.default, { atbDisabled: atbDisabled, movementInfo: movementInfo, formValues: formValues, changeValue: changeValue, checkHasDiffInForm: checkHasDiffInForm, initializeMvtForm: initializeMvtForm, getIsForceError: getIsForceError, handleDateTimeInputPopup: handleDateTimeInputPopup, handleOnChange: handleOnChange, onChangeRadioButton: onChangeRadioButton }),
                    react_1.default.createElement(MvtMsgDivContainer_1.default, { divDisabled: divDisabled, movementInfo: movementInfo, formValues: formValues, initialValues: initialValues, changeValue: changeValue, checkHasDiffInForm: checkHasDiffInForm, initializeMvtForm: initializeMvtForm, getIsForceError: getIsForceError, handleDateTimeInputPopup: handleDateTimeInputPopup, handleOnChange: handleOnChange, onChangeRadioButton: onChangeRadioButton }))),
            react_1.default.createElement(MvtMsgCommonContainer_1.default, { formName: formName, formValues: formValues, change: change }),
            react_1.default.createElement(SubmitButtonContainer, null,
                react_1.default.createElement(PrimaryButton_1.default, { type: "submit", text: "Update & Send", width: "200px", disabled: !submitBtnEnabled })))))));
};
const onSubmit = (formValues, dispatch, _props) => {
    const onSuccess = () => dispatch((0, mvtMsgModal_1.updateMvtMsgSuccess)());
    const onNotFoundRecord = () => dispatch((0, mvtMsgModal_1.closeMvtMsgModal)());
    const update = () => {
        dispatch((0, mvtMsgModal_1.updateAndSendMvtMsg)({ formValues, callbacks: { onSuccess, onNotFoundRecord } }));
    };
    if (formValues.mvtMsgRadioButton === "DEP" && !formValues.depInfo.cnlCheckBox && !formValues.depInfo.eft) {
        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50035C() });
        return;
    }
    dispatch((0, mvtMsgModal_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M30010C({ onYesButton: update }) }));
};
const customStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 970000000 /* reapop(999999999)の2つ下 */,
    },
    content: {
        position: storage_1.storage.isPc ? "absolute" : "relative",
        width: "1000px",
        height: "740px",
        top: storage_1.storage.isPc ? 0 : "3%",
        left: 0,
        right: 0,
        bottom: 0,
        margin: "auto",
        padding: 0,
        border: "none",
        borderRadius: 0,
        overflow: "visible",
    },
};
const FormContent = styled_components_1.default.form `
  font-size: 18px;
  padding: 0px 12px;
  box-sizing: border-box;
`;
const Header = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  min-height: ${(props) => props.headerHeight}px;
  height: ${(props) => props.headerHeight}px;
`;
const GroupBox = styled_components_1.default.div `
  padding: ${({ irr }) => (irr ? "none" : "0px 12px")};
  margin: 8px 0px;
  width: 100%;
  height: ${({ height }) => height}px;
  border: ${({ border }) => (border ? "1px solid #222" : "none")};
  box-sizing: border-box;
  background-color: ${({ color }) => color};
`;
exports.Content = styled_components_1.default.div `
  padding: ${({ isMsg }) => (isMsg ? "10px 23px 0px 12px" : "6px 0px 0px 0px")};
  margin: 8px 0px;
  width: 100%;
  height: ${({ isMsg }) => (isMsg ? 204 : 132)}px;
  border: 1px solid #222;
  box-sizing: border-box;
  background-color: #f6f6f6;
`;
exports.Flex = styled_components_1.default.div `
  display: flex;
  justify-content: ${(props) => props.position || "space-between"};
  align-items: ${(props) => props.alignItems || "center"};
  width: ${(props) => (props.width ? `${props.width}px` : "auto")};
`;
exports.Row = styled_components_1.default.div `
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  margin-bottom: ${(props) => { var _a; return (_a = props.marginBottom) !== null && _a !== void 0 ? _a : 0; }}px;
  padding: ${(props) => { var _a; return (_a = props.padding) !== null && _a !== void 0 ? _a : "0"; }};
  align-items: center;
`;
exports.Col = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
`;
exports.Label = styled_components_1.default.div `
  display: flex;
  align-items: flex-end;
  font-size: 12px;
  opacity: ${({ disabled }) => (disabled ? "0.6" : "inherit")};
  width: 100%;
  height: 14px;
`;
exports.Space = styled_components_1.default.div `
  height: ${(props) => (props.isDummyLabel ? "14px" : "100%")};
  width: ${(props) => props.width}px;
`;
exports.IrregularContent = styled_components_1.default.div `
  padding-top: 12px;
  margin-right: ${({ marginRight }) => (marginRight ? 8 : 0)}px;
  float: left;
  width: ${({ width }) => width}px;
  height: 100%;
  border: 1px solid #222;
  box-sizing: border-box;
  background-color: #e5c7c6;
`;
exports.MvtMsgFlgIconSvg = styled_components_1.default.img.attrs({ src: mvt_msg_flg_svg_1.default }) ``;
exports.ComponentLabel = styled_components_1.default.label `
  font-size: 22px;
  opacity: ${({ disabled }) => (disabled ? "0.6" : "inherit")};
  line-height: 25px;
`;
exports.CheckBoxLabel = styled_components_1.default.label `
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  ${(props) => (0, styled_components_1.css) `
    ${props.disabled &&
    `
      cursor: default;
      opacity: 0.6;
      `}
    ${!props.disabled &&
    props.checkBoxDisabled &&
    `
      cursor: default;
      `}
  `}
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
  input[type="checkbox"] {
    margin-left: 4px;
    appearance: none;
    width: 30px;
    height: 30px;
    border: 1px solid ${(props) => props.theme.color.PRIMARY};
    background: ${({ disabled, checkBoxDisabled }) => (disabled || checkBoxDisabled ? "#EBEBE4" : "#FFF")};
    position: relative;
    cursor: pointer;
    outline: none;
    ${(props) => (0, styled_components_1.css) `
      ${props.disabled &&
    `
      pointer-events: none;
      `}
      ${!props.disabled &&
    props.checkBoxDisabled &&
    `
      pointer-events: none;
      opacity: 0.6;
      `}
    `}
    &:checked {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 4px;
        left: 9px;
        width: 9px;
        height: 14px;
        transform: rotate(45deg);
        border-bottom: 2px solid #fff;
        border-right: 2px solid #fff;
      }
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
exports.LabelItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 1px;
  opacity: ${({ disabled }) => (disabled ? "0.6" : "inherit")};
`;
const SubmitButtonContainer = styled_components_1.default.div `
  display: flex;
  margin: 12px 0px;
  width: 100%;
  height: 44px;
  justify-content: center;
  align-items: center;
`;
/// ////////////////////////
// コネクト
/// ////////////////////////
const formName = "mvtMsg";
const MvtMsgModalForm = (0, redux_form_1.reduxForm)({
    form: formName,
    onSubmit,
    enableReinitialize: true,
})(MvtMsgModal);
exports.default = (0, react_redux_1.connect)((state) => ({
    mvtMsgModal: state.mvtMsgModal,
    initialValues: state.mvtMsgModal.initialFormValue,
    formValues: (0, redux_form_1.getFormValues)(formName)(state),
    formSyncErrors: (0, redux_form_1.getFormSyncErrors)(formName)(state),
}))(MvtMsgModalForm);
//# sourceMappingURL=MvtMsgModal.js.map