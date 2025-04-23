"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lengthKeyWord30 = exports.isOkFuelStatus = exports.isOkFuelWt = exports.lengthSpot = exports.isOkGateSts = exports.isOkCkinSts = exports.isOkGateNo = exports.lengthPax = exports.halfWidthApoCd = exports.requiredIssueTime = exports.requiredJobAuthCd = exports.requiredJobCode = exports.requiredShip = exports.requiredFlt = exports.requiredApo = exports.isEQP = exports.isTml = exports.halfWidthCasFlt = exports.halfWidthFlt = exports.lengthFlt3 = exports.lengthFlt = exports.halfWidthSpot = exports.halfWidthShip = exports.lengthShip2 = exports.lengthShip = exports.isOkUplink = exports.halfWidthAcarsOriginator = exports.isOkCasualFlt8 = exports.isOkCasualFlt = exports.isOkAl = exports.isOkTty = exports.isOkTtyAddress = exports.isOkIssuMailBody = exports.isOkEmail = exports.isOkJobAuthCd = exports.isOkNtfTitle = exports.isOkJobCode = exports.isTtyAddress = exports.isEmailAddress = exports.isOkLengthLessOrEqual = exports.isOkLengthOver = exports.isOkLength = exports.isOnlyUplinkSymbol = exports.isOnlyHalfWidthTtySymbol = exports.isOnlyHalfWidthTtyAddressSymbol = exports.isOnlyHalfWidthSymbol = exports.isOnlyHalfWidth = exports.isOnlyAlphabet = exports.isOnlyNumber = exports.hasValue = void 0;
exports.halfWidthSpots = exports.lengthSpots = exports.isOkAls = exports.isOkBroadcastTtyAddress = exports.isOkBroadcastNtf = exports.isOkBroadcastAcars = exports.isOkBroadcastTty = exports.isOkBBComment = exports.isOkUnlimitedTextByte = exports.unique = exports.isOkBroadcastTtyAddresses = exports.isOkTtyAddresses = exports.isOkEmails = exports.multiBoxRequired = exports.required = exports.isYYMMDD = exports.isDateOrYYYYMMDD = exports.getFormatFromDateInput = exports.isExpiryDate = exports.isOkImageFileFormat = exports.isOkFileName = exports.requiredApoCdPair = exports.dlyTime = exports.timeOrSkd = exports.time = exports.lengthJobCd = exports.lengthKeyWord100 = void 0;
const soalaMessages_1 = require("../soalaMessages");
const commonUtil_1 = require("../commonUtil");
const commonConst_1 = require("../commonConst");
/** 必須チェック */
const hasValue = (value) => {
    if (value === null || value === undefined) {
        return false;
    }
    if (typeof value === "boolean") {
        return true;
    }
    return !!String(value).trim();
};
exports.hasValue = hasValue;
/** 特定文字必須チェック 未入力の場合、falseを返す */
// export const hasSpecialValue = (value: string, specialValue: string) => !value || (value.match(new RegExp(specialValue))) ? true : false;
/** 型チェック(半角数字) */
const isOnlyNumber = (value) => !!(value == null || value.toString().match(/^[0-9]*$/));
exports.isOnlyNumber = isOnlyNumber;
/** 型チェック(半角英字) */
const isOnlyAlphabet = (value) => !!(value == null || value.toString().match(/^[A-Za-z]*$/));
exports.isOnlyAlphabet = isOnlyAlphabet;
/** 型チェック(半角英数字) */
const isOnlyHalfWidth = (value) => !!(value == null || value.toString().match(/^[A-Za-z0-9]*$/));
exports.isOnlyHalfWidth = isOnlyHalfWidth;
/** 型チェック(半角英数字記号) */
const isOnlyHalfWidthSymbol = (value) => !!(value == null || value.toString().match(/^[ -~]*$/));
exports.isOnlyHalfWidthSymbol = isOnlyHalfWidthSymbol;
/** 型チェック(半角英数字./-()) TTYアドレスに利用できる文字列 */
const isOnlyHalfWidthTtyAddressSymbol = (value) => !!(value == null || value.toString().match(/^[A-Za-z0-9./\-()]*$/));
exports.isOnlyHalfWidthTtyAddressSymbol = isOnlyHalfWidthTtyAddressSymbol;
/** 型チェック(半角英数字!#$%()*+,-./:;=?@[\]^_\n(改行コード) (半角スペース)) TTYに利用できる文字列 */
const isOnlyHalfWidthTtySymbol = (value) => value == null || value.toString().match(/^[A-Za-z0-9./\-()!#$%*+,:=?@[\\\]^_\n ]*$/);
exports.isOnlyHalfWidthTtySymbol = isOnlyHalfWidthTtySymbol;
/** 型チェック(ASCII文字コード（半角スペース）〜~+改行のみ) Uplinkに利用できる文字列 */
const isOnlyUplinkSymbol = (value) => !!(value == null || value.toString().match(/^[ -~\r\n]+$/));
exports.isOnlyUplinkSymbol = isOnlyUplinkSymbol;
/** 文字数チェック */
const isOkLength = (value, length) => !!(value == null || value === "" || value.toString().length === length);
exports.isOkLength = isOkLength;
/** 文字数チェック（指定桁以上） */
const isOkLengthOver = (value, length) => !!(value == null || value === "" || value.toString().length >= length);
exports.isOkLengthOver = isOkLengthOver;
/** 文字数チェック（指定桁以下） */
const isOkLengthLessOrEqual = (value, length) => !!(value == null || value === "" || value.toString().length <= length);
exports.isOkLengthLessOrEqual = isOkLengthLessOrEqual;
/** メールアドレス形式かどうか */
const isEmailAddress = (value) => !!(value == null || value === "" || value.toString().match(commonConst_1.Const.EMAIL_ADDRESS_REGEX));
exports.isEmailAddress = isEmailAddress;
/** TTYアドレス形式かどうか */
const isTtyAddress = (value) => (0, exports.isOnlyHalfWidthTtyAddressSymbol)(value) && (0, exports.isOkLength)(value, 7);
exports.isTtyAddress = isTtyAddress;
/** Job Code は半角英数字記号で入力してください */
const isOkJobCode = (value) => (!(0, exports.isOnlyHalfWidthSymbol)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkJobCode = isOkJobCode;
/** Notification Title は半角英数字記号で入力してください */
const isOkNtfTitle = (value) => (!(0, exports.isOnlyHalfWidthSymbol)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkNtfTitle = isOkNtfTitle;
/** Job Auth Code は半角英数字記号で入力してください */
const isOkJobAuthCd = (value) => (!(0, exports.isOnlyHalfWidthSymbol)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkJobAuthCd = isOkJobAuthCd;
/** メールアドレスの入力は、半角英数字または、-_@.のみを利用し、@を含めて入力してください */
const isOkEmail = (value) => (!(0, exports.isEmailAddress)(value) ? soalaMessages_1.SoalaMessage.M50015C : undefined);
exports.isOkEmail = isOkEmail;
/** 発令画面 - メールメッセージ本文は、4000文字以下で入力してください */
const isOkIssuMailBody = (value) => (!(0, exports.isOkLengthLessOrEqual)(value, 4000) ? soalaMessages_1.SoalaMessage.M50015C : undefined);
exports.isOkIssuMailBody = isOkIssuMailBody;
/** TTYアドレスの入力は、半角大文字英字または、./-()のみ利用し、7文字で入力してください */
const isOkTtyAddress = (value) => !(0, exports.isOnlyHalfWidthTtyAddressSymbol)(value) || !(0, exports.isOkLength)(value, 7) ? soalaMessages_1.SoalaMessage.M50015C : undefined;
exports.isOkTtyAddress = isOkTtyAddress;
/** TTYの入力は、半角大文字英字または、./-() 改行 スペース セミコロンのみ利用してください */
const isOkTty = (value) => {
    const removedComment = (0, commonUtil_1.removeTtyComment)(value);
    return !(0, exports.isOnlyHalfWidthTtySymbol)(removedComment) || !isTtyTextByte(removedComment || "") ? soalaMessages_1.SoalaMessage.M50015C : undefined;
};
exports.isOkTty = isOkTty;
/** ALは半角英数字かつ２桁で入力してください */
const isOkAl = (value) => (!(0, exports.isOnlyHalfWidth)(value) || !(0, exports.isOkLength)(value, 2) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkAl = isOkAl;
/** カジュアル便の便名はTTYアドレスで入力可能な文字のみ */
const isOkCasualFlt = (value) => !(0, exports.isOnlyHalfWidthTtyAddressSymbol)(value) || !(0, exports.isOkLengthLessOrEqual)(value, 10) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.isOkCasualFlt = isOkCasualFlt;
/** カジュアル便の便名は8桁以下のTTYアドレスで入力可能な文字のみ */
const isOkCasualFlt8 = (value) => !(0, exports.isOnlyHalfWidthTtyAddressSymbol)(value) || !(0, exports.isOkLengthLessOrEqual)(value, 8) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.isOkCasualFlt8 = isOkCasualFlt8;
/** Originator(ACARS)の入力は、半角大文字英字または、./-()のみ利用し、7文字で入力してください */
const halfWidthAcarsOriginator = (value) => !(0, exports.isOnlyHalfWidthTtyAddressSymbol)(value) || !(0, exports.isOkLength)(value, 7) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.halfWidthAcarsOriginator = halfWidthAcarsOriginator;
/** Uplinkは(ASCII文字コード（半角スペース）〜~+改行のみ)で入力してください */
const isOkUplink = (value) => (!(0, exports.isOnlyUplinkSymbol)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkUplink = isOkUplink;
/** SHIPはは4けた以上10けた以下で入力してください */
const lengthShip = (value) => !((0, exports.isOkLengthOver)(value, 4) && (0, exports.isOkLengthLessOrEqual)(value, 10)) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.lengthShip = lengthShip;
/** SHIPは２けた以上10けた以下で入力してください */
const lengthShip2 = (value) => !((0, exports.isOkLengthOver)(value, 2) && (0, exports.isOkLengthLessOrEqual)(value, 10)) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.lengthShip2 = lengthShip2;
/** SHIPは半角英数字で入力してください */
const halfWidthShip = (value) => (!(0, exports.isOnlyHalfWidth)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.halfWidthShip = halfWidthShip;
/** SPOTは半角英数字で入力してください */
const halfWidthSpot = (value) => (!(0, exports.isOnlyHalfWidth)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.halfWidthSpot = halfWidthSpot;
/** FLTは6けた以上で入力してください */
const lengthFlt = (value) => (!(0, exports.isOkLengthOver)(value, 6) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.lengthFlt = lengthFlt;
/** FLTは3けた以上６けた以下で入力してください */
const lengthFlt3 = (value) => !((0, exports.isOkLengthOver)(value, 3) && (0, exports.isOkLengthLessOrEqual)(value, 6)) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.lengthFlt3 = lengthFlt3;
/** FLTは半角英数字で入力してください */
const halfWidthFlt = (value) => (!(0, exports.isOnlyHalfWidth)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.halfWidthFlt = halfWidthFlt;
/** casFltNoはTTYで許容される文字列で入力してください */
const halfWidthCasFlt = (value) => (!(0, exports.isOnlyHalfWidthTtyAddressSymbol)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.halfWidthCasFlt = halfWidthCasFlt;
/** TMLは４桁までの半角英数字で入力してください */
const isTml = (value) => (!(0, exports.isOnlyHalfWidth)(value) || !(0, exports.isOkLengthLessOrEqual)(value, 4) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isTml = isTml;
/** EQPは3桁の半角英数字で入力してください */
const isEQP = (value) => (!(0, exports.isOnlyHalfWidth)(value) || !(0, exports.isOkLength)(value, 3) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isEQP = isEQP;
/** APOを入力してください */
const requiredApo = (value) => (!(0, exports.hasValue)(value) ? soalaMessages_1.SoalaMessage.M50016C : undefined);
exports.requiredApo = requiredApo;
/** FLTを入力してください */
const requiredFlt = (value) => (!(0, exports.hasValue)(value) ? soalaMessages_1.SoalaMessage.M50016C : undefined);
exports.requiredFlt = requiredFlt;
/** SHIPを入力してください */
const requiredShip = (value) => (!(0, exports.hasValue)(value) ? soalaMessages_1.SoalaMessage.M50016C : undefined);
exports.requiredShip = requiredShip;
/** Job Codeを入力してください */
const requiredJobCode = (value) => (!(0, exports.hasValue)(value) ? soalaMessages_1.SoalaMessage.M50016C : undefined);
exports.requiredJobCode = requiredJobCode;
/** Job Auth Codeを入力してください */
const requiredJobAuthCd = (value) => (value == null || value.toString().length === 0 ? soalaMessages_1.SoalaMessage.M50016C : undefined);
exports.requiredJobAuthCd = requiredJobAuthCd;
/** Issue Time(L)を入力してください */
const requiredIssueTime = (value) => (!(0, exports.hasValue)(value) ? soalaMessages_1.SoalaMessage.M50016C : undefined);
exports.requiredIssueTime = requiredIssueTime;
/** 空港コードは半角英字3文字で入力してください */
const halfWidthApoCd = (value) => !((0, exports.isOnlyAlphabet)(value) && (value == null || value === "" || value.toString().length === 3)) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.halfWidthApoCd = halfWidthApoCd;
/** 旅客人数は半角数字3文字以下で入力してください */
const lengthPax = (value) => !(0, exports.isOnlyNumber)(value) || !(0, exports.isOkLengthLessOrEqual)(value, 3) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.lengthPax = lengthPax;
/** 出発ゲート番号は半角英数字で入力してください */
const isOkGateNo = (value) => (!(0, exports.isOnlyHalfWidth)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkGateNo = isOkGateNo;
/** チェックインステータスは半角英数字かつ２桁で入力してください */
const isOkCkinSts = (value) => (!(0, exports.isOnlyHalfWidth)(value) || !(0, exports.isOkLength)(value, 2) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkCkinSts = isOkCkinSts;
/** ゲートステータスは半角英数字かつ２桁で入力してください */
const isOkGateSts = (value) => (!(0, exports.isOnlyHalfWidth)(value) || !(0, exports.isOkLength)(value, 2) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkGateSts = isOkGateSts;
/** SPOTは4けた以下で入力してください */
const lengthSpot = (value) => (!(0, exports.isOkLengthLessOrEqual)(value, 4) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.lengthSpot = lengthSpot;
/** 搭載燃料量は半角数字で入力してください */
const isOkFuelWt = (value) => (!(0, exports.isOnlyNumber)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkFuelWt = isOkFuelWt;
/** 搭載燃料ステータスは半角英字で入力してください */
const isOkFuelStatus = (value) => (!(0, exports.isOnlyAlphabet)(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.isOkFuelStatus = isOkFuelStatus;
/** KeyWordは30けた以下で入力してください */
const lengthKeyWord30 = (value) => (!(0, exports.isOkLengthLessOrEqual)(value, 30) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.lengthKeyWord30 = lengthKeyWord30;
/** KeyWordは100けた以下で入力してください */
const lengthKeyWord100 = (value) => (!(0, exports.isOkLengthLessOrEqual)(value, 100) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.lengthKeyWord100 = lengthKeyWord100;
/** JobCodeは10けた以下で入力してください */
const lengthJobCd = (value) => (!(0, exports.isOkLengthLessOrEqual)(value, 10) ? soalaMessages_1.SoalaMessage.M50014C : undefined);
exports.lengthJobCd = lengthJobCd;
/** 時間はHHmm形式で入力してください */
const time = (value) => {
    if (!(0, exports.hasValue)(value)) {
        return undefined;
    }
    if (value && value.toString().match(/^([0-1][0-9]|[2][0-3])[0-5][0-9]$/)) {
        return undefined;
    }
    return soalaMessages_1.SoalaMessage.M50014C;
};
exports.time = time;
/** 時間はHHmm形式または"SKD"で入力してください */
const timeOrSkd = (value) => {
    if (!(0, exports.hasValue)(value)) {
        return undefined;
    }
    if (value && (value === "SKD" || value.toString().match(/^([0-1][0-9]|[2][0-3])[0-5][0-9]$/))) {
        return undefined;
    }
    return soalaMessages_1.SoalaMessage.M50014C;
};
exports.timeOrSkd = timeOrSkd;
/** 時間はHHmm形式で入力してください */
const dlyTime = (value) => {
    if (!(0, exports.hasValue)(value)) {
        return undefined;
    }
    if (value && value.toString().match(/^([0-9][0-9][0-5][0-9]|[0-9][0-5][0-9]|[0-5][0-9]|[0-9])$/)) {
        return undefined;
    }
    return soalaMessages_1.SoalaMessage.M50014C;
};
exports.dlyTime = dlyTime;
/** LEG検索の場合、出発空港コードか到着空港コードのどちらかを入力してください */
const requiredApoCdPair = (_value, allValues) => {
    if (allValues && allValues.searchType === "LEG" && !allValues.arrApoCd && !allValues.depApoCd) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredApoCdPair = requiredApoCdPair;
/** ファイル名は120文字以内にしてください */
const isOkFileName = (value) => {
    if ((0, exports.isOkLengthLessOrEqual)(value, 120)) {
        return undefined;
    }
    return soalaMessages_1.SoalaMessage.M50033C;
};
exports.isOkFileName = isOkFileName;
/** 送信された画像の形式が不正です */
const isOkImageFileFormat = async (value) => {
    if (!value.type || !value.type.match(commonConst_1.Const.IMAGE_MIMETYPE_REGEX)) {
        return true;
    }
    const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(value);
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error());
    });
    if (typeof arrayBuffer === "string" || arrayBuffer === null) {
        return true;
    }
    const binaryData = Array.from(new Uint8Array(arrayBuffer));
    let checkArray = [];
    let checkResult = true;
    switch (value.type) {
        case "image/png":
            // \x89PNG\x0D\x0A\x1A\x0A
            checkArray = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
            checkResult = checkArray.every((_, index) => checkArray[index] === binaryData[index]);
            break;
        case "image/jpeg":
            // \xFF\xD8
            checkArray = [0xff, 0xd8];
            checkResult = checkArray.every((_, index) => checkArray[index] === binaryData[index]);
            break;
        case "image/gif":
            // GIF87a or GIF89a
            checkArray = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61];
            checkResult = checkArray.every((_, index) => checkArray[index] === binaryData[index]);
            checkArray = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
            checkResult = checkResult || checkArray.every((_, index) => checkArray[index] === binaryData[index]);
            break;
        case "image/bmp":
            // BM
            checkArray = [0x42, 0x4d];
            checkResult = checkArray.every((_, index) => checkArray[index] === binaryData[index]);
            break;
        default:
            break;
    }
    return checkResult;
};
exports.isOkImageFileFormat = isOkImageFileFormat;
const isExpiryDate = (value) => {
    // eslint-disable-next-line prefer-regex-literals
    if (value != null && value.toString().match(new RegExp(/^\d{4}-\d{1,2}-\d{1,2}$/)) !== null) {
        const dayjsDate = (0, commonUtil_1.getDayjsCalDate)(value.toString(), "YYYY-MM-DD");
        if (dayjsDate && dayjsDate.isSameOrBefore(commonConst_1.Const.EXPIRY_DATE_MAXIMUM)) {
            return undefined;
        }
    }
    return soalaMessages_1.SoalaMessage.M50014C;
};
exports.isExpiryDate = isExpiryDate;
const getFormatFromDateInput = (value, format) => {
    if (!value)
        return "";
    const yyyymmdd = value.toString().split(/[-/]/).join("");
    if (yyyymmdd.length !== 8 || !yyyymmdd.match(/^[0-9]*$/))
        return "";
    const date = (0, commonUtil_1.getDayjsCalDate)(yyyymmdd, "YYYYMMDD");
    if (!date)
        return "";
    return date.format(format);
};
exports.getFormatFromDateInput = getFormatFromDateInput;
const isDateOrYYYYMMDD = (value) => {
    if (!value) {
        return undefined;
    }
    const yyyymmdd = (0, exports.getFormatFromDateInput)(value, "YYYYMMDD");
    if (yyyymmdd) {
        return undefined;
    }
    return soalaMessages_1.SoalaMessage.M50014C;
};
exports.isDateOrYYYYMMDD = isDateOrYYYYMMDD;
const isYYMMDD = (value) => value != null && value.toString().match(/^\d{6}$/) !== null && (0, commonUtil_1.getDayjsCalDate)(value.toString(), "YYMMDD")
    ? undefined
    : soalaMessages_1.SoalaMessage.M50014C;
exports.isYYMMDD = isYYMMDD;
const required = (value) => {
    if (!value) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    if (Array.isArray(value)) {
        return value.length < 1 ? soalaMessages_1.SoalaMessage.M50016C : undefined;
    }
    if (typeof value === "object") {
        return (0, commonUtil_1.isObjectEmpty)(value) ? soalaMessages_1.SoalaMessage.M50016C : undefined;
    }
    if (!(0, exports.hasValue)(value)) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.required = required;
const multiBoxRequired = (values) => (!values.length ? soalaMessages_1.SoalaMessage.M50016C : undefined);
exports.multiBoxRequired = multiBoxRequired;
const isOkEmails = (values = []) => {
    if (values === null) {
        return undefined;
    }
    if (!Array.isArray(values)) {
        return soalaMessages_1.SoalaMessage.M50014C;
    }
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (!(0, exports.isEmailAddress)(value)) {
            return soalaMessages_1.SoalaMessage.M50014C;
        }
        if (!(0, exports.isOkLengthLessOrEqual)(value, 100)) {
            return soalaMessages_1.SoalaMessage.M50014C;
        }
    }
    return undefined;
};
exports.isOkEmails = isOkEmails;
const isOkTtyAddresses = (values = []) => {
    if (values === null) {
        return undefined;
    }
    if (!Array.isArray(values)) {
        return soalaMessages_1.SoalaMessage.M50014C;
    }
    for (let i = 0; i < values.length; i++) {
        const message = (0, exports.isOkTtyAddress)(values[i]);
        if (message) {
            return soalaMessages_1.SoalaMessage.M50014C;
        }
    }
    return undefined;
};
exports.isOkTtyAddresses = isOkTtyAddresses;
const isOkBroadcastTtyAddresses = (values = []) => {
    if (values === null) {
        return undefined;
    }
    if (!Array.isArray(values)) {
        return soalaMessages_1.SoalaMessage.M50014C;
    }
    for (let i = 0; i < values.length; i++) {
        const message = (0, exports.isOkBroadcastTtyAddress)(values[i]);
        if (message) {
            return soalaMessages_1.SoalaMessage.M50014C;
        }
    }
    return undefined;
};
exports.isOkBroadcastTtyAddresses = isOkBroadcastTtyAddresses;
const unique = (values) => Array.isArray(values) && [...new Set(values)].length === values.length ? undefined : soalaMessages_1.SoalaMessage.M50014C;
exports.unique = unique;
const isOkUnlimitedTextByte = (value) => !(value == null || value === "" || isUnlimitedTextByte(value.toString())) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.isOkUnlimitedTextByte = isOkUnlimitedTextByte;
const isOkBBComment = (value) => !(value == null || value === "" || isPushTextByte(value.toString())) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.isOkBBComment = isOkBBComment;
const isOkBroadcastTty = (value = "") => {
    const removedTtyComment = (0, commonUtil_1.removeTtyComment)(value);
    return !(0, exports.isOnlyHalfWidthTtySymbol)(removedTtyComment) || !isTtyTextByte(removedTtyComment || "") ? soalaMessages_1.SoalaMessage.M50014C : undefined;
};
exports.isOkBroadcastTty = isOkBroadcastTty;
const isOkBroadcastAcars = (value) => !(0, exports.isOnlyUplinkSymbol)(value) || !isAcarsTextByte(value) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.isOkBroadcastAcars = isOkBroadcastAcars;
const isOkBroadcastNtf = (value) => !(value == null || value === "" || isPushTextByte(value.toString())) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.isOkBroadcastNtf = isOkBroadcastNtf;
const isOkBroadcastTtyAddress = (value = "") => !(0, exports.isOnlyHalfWidth)(value) || !(0, exports.isOkLength)(value, 7) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
exports.isOkBroadcastTtyAddress = isOkBroadcastTtyAddress;
const TTY_MESSAGE_MAX_BYTE = 3427;
const isTtyTextByte = (value) => (0, commonUtil_1.getByte)((0, commonUtil_1.convertLineFeedCodeToCRLF)(value)) <= TTY_MESSAGE_MAX_BYTE;
const ACARS_MESSAGE_MAX = 2100;
const isAcarsTextByte = (value) => (0, commonUtil_1.getByte)((0, commonUtil_1.convertLineFeedCodeToCRLF)(value)) <= ACARS_MESSAGE_MAX;
const PUSH_MESSAGE_MAX_BYTE = 3200;
const isPushTextByte = (value) => (0, commonUtil_1.getByte)((0, commonUtil_1.convertLineFeedCodeToCRLF)(value)) <= PUSH_MESSAGE_MAX_BYTE;
const UNLIMITED_MAX_BYTE = 102400;
const isUnlimitedTextByte = (value) => (0, commonUtil_1.getByte)((0, commonUtil_1.convertLineFeedCodeToCRLF)(value)) <= UNLIMITED_MAX_BYTE;
const isOkAls = (values = []) => {
    if (values === null) {
        return undefined;
    }
    if (!Array.isArray(values)) {
        return soalaMessages_1.SoalaMessage.M50014C;
    }
    for (let i = 0; i < values.length; i++) {
        const result = (0, exports.isOkAl)(values[i]);
        if (result) {
            return result;
        }
    }
    return undefined;
};
exports.isOkAls = isOkAls;
const lengthSpots = (values = []) => {
    if (values === null) {
        return undefined;
    }
    for (let i = 0; i < values.length; i++) {
        const result = (0, exports.lengthSpot)(values[i]);
        if (result) {
            return result;
        }
    }
    return undefined;
};
exports.lengthSpots = lengthSpots;
const halfWidthSpots = (values = []) => {
    if (values === null) {
        return undefined;
    }
    for (let i = 0; i < values.length; i++) {
        const result = (0, exports.halfWidthSpot)(values[i]);
        if (result) {
            return result;
        }
    }
    return undefined;
};
exports.halfWidthSpots = halfWidthSpots;
//# sourceMappingURL=index.js.map