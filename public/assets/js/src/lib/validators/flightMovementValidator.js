"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderLdAta = exports.orderReturnInTo = exports.orderAtdTo = exports.matchDepDlyTime = exports.rangeMovementDate = exports.getAvailableDateRange = exports.requiredReturnIn = exports.requiredEtdWithoutStd = exports.requiredEtaWithoutSta = exports.requiredLd = exports.requiredDepDlyTime = exports.requiredDepDlyRsnCd = exports.requiredEtaLd = exports.requiredEta = exports.requiredEtd = exports.requiredATD = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const soalaMessages_1 = require("../soalaMessages");
/**
下記条件のいずれかに一致した場合、ATDは必須入力π
・T/Oが設定されている
・IRRステータス="GTB"かつReturn Inが未設定
・STDが未設定の条件下で、遅延情報（出発遅延時間1-3、出発遅延理由1-3）が入力されている
*/
const requiredATD = (value, allValues, props) => {
    if (props.flightMovementModal.movementInfo) {
        const { irrSts } = props.flightMovementModal.movementInfo;
        if (!value) {
            if (allValues.depInfo.toTime ||
                (irrSts === "GTB" && !allValues.depInfo.returnIn) ||
                (!allValues.depInfo.std &&
                    ((allValues.depInfo.depDlyTime1 && allValues.depInfo.depDlyRsnCd1) ||
                        (allValues.depInfo.depDlyTime2 && allValues.depInfo.depDlyRsnCd2) ||
                        (allValues.depInfo.depDlyTime3 && allValues.depInfo.depDlyRsnCd3)))) {
                return soalaMessages_1.SoalaMessage.M50016C;
            }
        }
    }
    return undefined;
};
exports.requiredATD = requiredATD;
/** ETD公開コードが設定されている場合、ETDは必須入力 */
const requiredEtd = (value, allValues) => {
    if (!value && allValues.depInfo.etdCd) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredEtd = requiredEtd;
/** ETA公開コードが設定されている場合、ETAは必須入力 */
const requiredEta = (value, allValues) => {
    if (!value && allValues.arrInfo.etaCd) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredEta = requiredEta;
/** ETA(L/D)公開コードが設定されている場合、ETA(L/D)は必須入力 */
const requiredEtaLd = (value, allValues) => {
    if (!value && allValues.arrInfo.etaLdCd) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredEtaLd = requiredEtaLd;
/** 出発遅延時間が設定されている場合、出発遅延理由は必須入力 */
const requiredDepDlyRsnCd = (value, allValues, _props, name) => {
    const num = name.match(/\d+/);
    if (num && !value) {
        if ((num[0] === "1" && allValues.depInfo.depDlyTime1) ||
            (num[0] === "2" && allValues.depInfo.depDlyTime2) ||
            (num[0] === "3" && allValues.depInfo.depDlyTime3)
        // || num[0] === "4" && allValues.depInfo.depDlyTime4
        ) {
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
            (num[0] === "3" && allValues.depInfo.depDlyRsnCd3)
        // || num[0] === "4" && allValues.depInfo.depDlyRsnCd4
        ) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    return undefined;
};
exports.requiredDepDlyTime = requiredDepDlyTime;
/** ATAが設定されている場合、L/Dは必須入力 */
const requiredLd = (value, allValues) => {
    if (!value && allValues.arrInfo.ata) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredLd = requiredLd;
/** STAが設定されていない場合、ETAは必須入力 */
const requiredEtaWithoutSta = (value, allValues) => {
    if (!value && !allValues.arrInfo.sta) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredEtaWithoutSta = requiredEtaWithoutSta;
/** STDが設定されていない場合、ETDは必須入力 */
const requiredEtdWithoutStd = (value, allValues) => {
    if (!value && !allValues.depInfo.std) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredEtdWithoutStd = requiredEtdWithoutStd;
const requiredReturnIn = (value, allValues) => {
    if (!value && (allValues.depInfo.toTime || allValues.arrInfo.ldTime || allValues.arrInfo.ata)) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredReturnIn = requiredReturnIn;
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
    const { movementInfo } = props.flightMovementModal;
    if (movementInfo && value) {
        const dateDayjs = (0, dayjs_1.default)(value).hour(0).minute(0).second(0).millisecond(0);
        const dateRange = (0, exports.getAvailableDateRange)(movementInfo.legkey.orgDateLcl);
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
        const diffMinuts = moAtd.diff(moStd, "minute");
        const sumDlyMinuts = getMinutsFromHhmm(allValues.depInfo.depDlyTime1) +
            getMinutsFromHhmm(allValues.depInfo.depDlyTime2) +
            getMinutsFromHhmm(allValues.depInfo.depDlyTime3);
        // + getMinutsFromHhmm(allValues.depInfo.depDlyTime4);
        if (value && diffMinuts !== sumDlyMinuts) {
            return () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "DLY Time mismatch" });
        }
    }
    return undefined;
};
exports.matchDepDlyTime = matchDepDlyTime;
const getMinutsFromHhmm = (value) => {
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
/** ATDが設定済かつT/Oが設定済かつ ATD > T/O の場合エラー */
const orderAtdTo = (_value, allValues) => {
    if (allValues.depInfo.atd && allValues.depInfo.toTime && allValues.depInfo.atd > allValues.depInfo.toTime) {
        return () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "Time Order" });
    }
    return undefined;
};
exports.orderAtdTo = orderAtdTo;
/** ReturnIn > T/O の場合エラー */
const orderReturnInTo = (_value, allValues) => {
    if (allValues.depInfo.returnIn && allValues.depInfo.toTime && allValues.depInfo.returnIn > allValues.depInfo.toTime) {
        return () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "Time Order" });
    }
    return undefined;
};
exports.orderReturnInTo = orderReturnInTo;
/** L/Dが設定済かつATAが設定済かつ L/D > ATA の場合エラー */
const orderLdAta = (_value, allValues) => {
    if (allValues.arrInfo.ldTime && allValues.arrInfo.ata && allValues.arrInfo.ldTime > allValues.arrInfo.ata) {
        return () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "Time Order" });
    }
    return undefined;
};
exports.orderLdAta = orderLdAta;
//# sourceMappingURL=flightMovementValidator.js.map