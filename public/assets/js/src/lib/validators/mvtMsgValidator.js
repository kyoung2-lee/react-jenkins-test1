"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOkTty = exports.isOkTtyAddress = exports.isDtg = exports.isWindFactor = exports.isFuelRemain = exports.orderLdAta = exports.orderToLd = exports.orderAtdTo = exports.matchArrDlyTime = exports.matchDepDlyTime = exports.rangeMovementDate = exports.getAvailableDateRange = exports.requiredArrDlyTime = exports.requiredArrDlyRsnCd = exports.requiredDepDlyTime = exports.requiredDepDlyRsnCd = exports.divApo = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const soalaMessages_1 = require("../soalaMessages");
const _1 = require(".");
const commonUtil_1 = require("../commonUtil");
/** DIV先の空港に最新到着空港もしくは予定出発空港を指定した場合エラー */
const divApo = (value, _allValues, { mvtMsgModal: { movementInfo } }) => {
    const { lstDepApoCd, legKey: { skdArrApoCd = "" } = {} } = movementInfo !== null && movementInfo !== void 0 ? movementInfo : {};
    if (value === lstDepApoCd || value === skdArrApoCd) {
        return () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "DIV APO" });
    }
    return undefined;
};
exports.divApo = divApo;
/** 出発遅延時間が設定されている場合、出発遅延理由は必須入力 */
const requiredDepDlyRsnCd = (value, allValues, _props, name) => {
    const num = name.match(/\d+/);
    if (num && !value) {
        if ((num[0] === "1" && allValues.depInfo.depDlyTime1) ||
            (num[0] === "2" && allValues.depInfo.depDlyTime2) ||
            (num[0] === "3" && allValues.depInfo.depDlyTime3)) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    return undefined;
};
exports.requiredDepDlyRsnCd = requiredDepDlyRsnCd;
/** 出発遅延理由が設定されている場合、出発遅延時間は必須入力 */
const requiredDepDlyTime = (value, allValues, _props, name) => {
    const num = name.match(/\d+/);
    if (num && !value) {
        if ((num[0] === "1" && allValues.depInfo.depDlyRsnCd1) ||
            (num[0] === "2" && allValues.depInfo.depDlyRsnCd2) ||
            (num[0] === "3" && allValues.depInfo.depDlyRsnCd3)) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    return undefined;
};
exports.requiredDepDlyTime = requiredDepDlyTime;
/** 到着遅延時間が設定されている場合、到着遅延理由は必須入力 */
const requiredArrDlyRsnCd = (value, allValues, _props, name) => {
    const num = name.match(/\d+/);
    if (num && !value) {
        if ((num[0] === "1" && allValues.arrInfo.arrDlyTime1) ||
            (num[0] === "2" && allValues.arrInfo.arrDlyTime2) ||
            (num[0] === "3" && allValues.arrInfo.arrDlyTime3)) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    return undefined;
};
exports.requiredArrDlyRsnCd = requiredArrDlyRsnCd;
/** 到着遅延理由が設定されている場合、到着遅延時間は必須入力 */
const requiredArrDlyTime = (value, allValues, _props, name) => {
    const num = name.match(/\d+/);
    if (num && !value) {
        if ((num[0] === "1" && allValues.arrInfo.arrDlyRsnCd1) ||
            (num[0] === "2" && allValues.arrInfo.arrDlyRsnCd2) ||
            (num[0] === "3" && allValues.arrInfo.arrDlyRsnCd3)) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    return undefined;
};
exports.requiredArrDlyTime = requiredArrDlyTime;
/** [運航基準日＋15日後－1ヶ月]、[運航基準日＋14日後] の範囲を取得 */
const getAvailableDateRange = (orgDate) => {
    const minDateDayjs = (0, dayjs_1.default)(orgDate).add(15, "day").add(-1, "month");
    const maxDateDayjs = (0, dayjs_1.default)(orgDate).add(14, "day");
    if (minDateDayjs.isValid() && maxDateDayjs.isValid()) {
        return { minDateDayjs, maxDateDayjs };
    }
    return null;
};
exports.getAvailableDateRange = getAvailableDateRange;
/** [運航基準日＋15日後－1ヶ月] ≦ 入力値 ≦ [運航基準日＋14日後] の範囲になければエラー */
const rangeMovementDate = (value, _allValues, props) => {
    const { movementInfo } = props.mvtMsgModal;
    if (movementInfo && value) {
        const dateDayjs = (0, dayjs_1.default)(value).hour(0).minute(0).second(0).millisecond(0);
        const dateRange = (0, exports.getAvailableDateRange)(movementInfo.legKey.orgDateLcl);
        if (dateDayjs.isValid() && dateRange) {
            if (dateDayjs.isSameOrAfter(dateRange.minDateDayjs) && dateDayjs.isSameOrBefore(dateRange.maxDateDayjs)) {
                return undefined;
            }
        }
        return soalaMessages_1.SoalaMessage.M50032C;
    }
    return undefined;
};
exports.rangeMovementDate = rangeMovementDate;
/** STDが設定済かつ[遅延時間1-4の合計] <> [ATD - STD]の場合エラー */
const matchDepDlyTime = (value, allValues, _props, _name) => {
    if (allValues.depInfo.std && allValues.depInfo.atd && allValues.depInfo.std < allValues.depInfo.atd) {
        const moStd = (0, dayjs_1.default)(allValues.depInfo.std);
        const moAtd = (0, dayjs_1.default)(allValues.depInfo.atd);
        const diffMinutes = moAtd.diff(moStd, "minute");
        const sumDlyMinutes = getMinutesFromHhmm(allValues.depInfo.depDlyTime1) +
            getMinutesFromHhmm(allValues.depInfo.depDlyTime2) +
            getMinutesFromHhmm(allValues.depInfo.depDlyTime3);
        if (value && diffMinutes !== sumDlyMinutes) {
            return () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "DLY Time mismatch" });
        }
    }
    return undefined;
};
exports.matchDepDlyTime = matchDepDlyTime;
/** STAが設定済かつ[遅延時間1-4の合計] <> [ATA - STA]の場合エラー */
const matchArrDlyTime = (value, allValues, _props, _name) => {
    if (allValues.arrInfo.sta && allValues.arrInfo.ata && allValues.arrInfo.sta < allValues.arrInfo.ata) {
        const moSta = (0, dayjs_1.default)(allValues.arrInfo.sta);
        const moAta = (0, dayjs_1.default)(allValues.arrInfo.ata);
        const diffMinutes = moAta.diff(moSta, "minute");
        const sumDlyMinutes = getMinutesFromHhmm(allValues.arrInfo.arrDlyTime1) +
            getMinutesFromHhmm(allValues.arrInfo.arrDlyTime2) +
            getMinutesFromHhmm(allValues.arrInfo.arrDlyTime3);
        if (value && diffMinutes !== sumDlyMinutes) {
            return () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "DLY Time mismatch" });
        }
    }
    return undefined;
};
exports.matchArrDlyTime = matchArrDlyTime;
/** ATDが設定済かつT/Oが設定済かつ ATD > T/O の場合エラー */
const orderAtdTo = (_value, allValues) => {
    if (allValues.depInfo.atd && allValues.depInfo.actTo && allValues.depInfo.atd > allValues.depInfo.actTo) {
        return () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "Time Order" });
    }
    return undefined;
};
exports.orderAtdTo = orderAtdTo;
/** T/Oが設定済かつL/Dが設定済かつ T/O ≦ L/D でない場合エラー */
const orderToLd = (_value, allValues) => {
    if (allValues.depInfo.actTo && allValues.arrInfo.actLd && allValues.depInfo.actTo > allValues.arrInfo.actLd) {
        return () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "Time Order" });
    }
    return undefined;
};
exports.orderToLd = orderToLd;
/** L/Dが設定済かつATAが設定済かつ L/D ≦ ATA でない場合エラー */
const orderLdAta = (_value, allValues) => {
    if (allValues.arrInfo.actLd && allValues.arrInfo.ata && allValues.arrInfo.actLd > allValues.arrInfo.ata) {
        return () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "Time Order" });
    }
    return undefined;
};
exports.orderLdAta = orderLdAta;
/** fuelRemainが1桁～6桁の半角数字でない場合エラー */
const isFuelRemain = (value) => !((0, _1.isOkLengthOver)(value, 1) && (0, _1.isOkLengthLessOrEqual)(value, 6) && (0, _1.isOnlyNumber)(value)) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.isFuelRemain = isFuelRemain;
/** windFactorが‘ P '又は‘ M '＋ 0～300の数字でない場合エラー */
const isWindFactor = (value) => {
    if (!(0, _1.hasValue)(value))
        return undefined;
    const regex = /^(P|M)\d{1,3}$/;
    if (regex.test(value) && (0, _1.isOnlyHalfWidth)(value)) {
        const numberPart = parseInt(value.substring(1), 10);
        if (numberPart >= 0 && numberPart <= 300) {
            return undefined;
        }
    }
    return soalaMessages_1.SoalaMessage.M50014C;
};
exports.isWindFactor = isWindFactor;
/** D.T.G.はDDhhmm形式で入力してください */
const isDtg = (value, _allValues, { mvtMsgModal: { movementInfo } }) => {
    if (value && value.length !== 6) {
        return soalaMessages_1.SoalaMessage.M50014C;
    }
    // 必須チェックは別で行う為、形式チェックのみ行う
    if ((0, commonUtil_1.convertDDHHmmToDate)(movementInfo === null || movementInfo === void 0 ? void 0 : movementInfo.legKey.orgDateLcl, value) === null) {
        return soalaMessages_1.SoalaMessage.M50014C;
    }
    return undefined;
};
exports.isDtg = isDtg;
/** TTYアドレスの入力は、半角大文字英字または、./-()のみ利用し、7文字で入力してください */
const isOkTtyAddress = (value) => (!(0, _1.isTtyAddress)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkTtyAddress = isOkTtyAddress;
/** REMARKSの入力は、半角大文字英字または、./-() のみ利用し58文字以内で入力してください */
const isOkTty = (value) => !isOnlyHalfWidthTtyRemarksSymbol(value) || !isTtyTextByte(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.isOkTty = isOkTty;
const MESSAGE_REMARKS_MAX_BYTE = 58;
const isTtyTextByte = (value) => (0, commonUtil_1.getByte)((0, commonUtil_1.convertLineFeedCodeToCRLF)(value)) <= MESSAGE_REMARKS_MAX_BYTE;
const isOnlyHalfWidthTtyRemarksSymbol = (value) => !!(value == null || value.toString().match(/^[A-Z0-9./\-() ]*$/));
const getMinutesFromHhmm = (value) => {
    const formatValue = value.length !== 0 ? `0000${value}`.slice(-4) : value;
    if (formatValue.length === 4) {
        const hours = Number(formatValue.substring(0, 2));
        const minutes = Number(formatValue.substring(2));
        if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
            return hours * 60 + minutes;
        }
    }
    return 0;
};
//# sourceMappingURL=mvtMsgValidator.js.map