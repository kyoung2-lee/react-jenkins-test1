"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTtyComment = exports.arrangeTemplatesJobIdList = exports.getByte = exports.convertTimeToHhmm = exports.convertCRLFCodeToLineFeed = exports.convertLineFeedCodeToCRLF = exports.smoothScroll = exports.convertYYMMDDToDate = exports.convertDDHHmmToDate = exports.parseTimeLcl = exports.arrayLast = exports.arrayFirst = exports.arrayUnique = exports.isObjectEmpty = exports.isObjectNotEmpty = exports.keys = exports.separateWithComma = exports.getCookie = exports.b64DecodeUnicode = exports.padding0 = exports.removeJa = exports.removePictograph = exports.getTimeDiffUtc = exports.getTimeDateString = exports.getDayjsCalDate = exports.getPriorities = exports.formatFlt = exports.formatFltNo = exports.getExcessTime = exports.getGroundTime = exports.getXtdLcl = exports.getXtaLcl = exports.convertHiraganaToKatakana = exports.toLowerCase = exports.toUpperCase = exports.execWithLocationInfo = exports.isCurrentPath = exports.isAuthExpired = exports.funcAuthCheck = exports.terminalFuncCheck = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const commonConst_1 = require("./commonConst");
const storage_1 = require("./storage");
const StorageOfUser_1 = require("./StorageOfUser");
/**
 * 端末区分による使用可否を返す
 */
function terminalFuncCheck(funcId) {
    // フェーズによる機能制限
    if (commonConst_1.Const.PROJECT_PHASE < 1) {
        switch (funcId) {
            case commonConst_1.Const.FUNC_ID.openUserSetting:
            case commonConst_1.Const.FUNC_ID.openNotificationList:
                return false;
            default:
                return true;
        }
    }
    // 全機能有効の時は無条件
    if (commonConst_1.Const.USE_ALL_FUNC) {
        return true;
    }
    switch (funcId) {
        // メニュー
        case commonConst_1.Const.FUNC_ID.openBarChart:
            if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone) {
                return false;
            }
            break;
        case commonConst_1.Const.FUNC_ID.openFis:
            if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone) {
                return false;
            }
            break;
        case commonConst_1.Const.FUNC_ID.openFlightSearch:
            break;
        case commonConst_1.Const.FUNC_ID.openAirportIssue:
            if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone) {
                return false;
            }
            break;
        case commonConst_1.Const.FUNC_ID.openUserSetting:
            if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc) {
                return false;
            }
            break;
        case commonConst_1.Const.FUNC_ID.openNotificationList:
            if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc) {
                return false;
            }
            break;
        // サブメニュー
        case commonConst_1.Const.FUNC_ID.openOperationTask:
            break;
        case commonConst_1.Const.FUNC_ID.openFlightDetail:
            break;
        case commonConst_1.Const.FUNC_ID.openShipTransitList:
            break;
        // 機能
        case commonConst_1.Const.FUNC_ID.updateAireportRemarks:
            break;
        case commonConst_1.Const.FUNC_ID.updateFisAuto:
        case commonConst_1.Const.FUNC_ID.updateBarChartAuto:
            if (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPad || storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone) {
                return false;
            }
            break;
        case commonConst_1.Const.FUNC_ID.updateOperationTask:
            break;
        case commonConst_1.Const.FUNC_ID.updateFlightRemarks:
            break;
        case commonConst_1.Const.FUNC_ID.openBroadcast:
        case commonConst_1.Const.FUNC_ID.openBroadcastEmail:
        case commonConst_1.Const.FUNC_ID.openBroadcastTty:
        case commonConst_1.Const.FUNC_ID.openBroadcastAftn:
        case commonConst_1.Const.FUNC_ID.openBroadcastAcars:
        case commonConst_1.Const.FUNC_ID.openBroadcastNotification:
        case commonConst_1.Const.FUNC_ID.openMvtMsg:
        case commonConst_1.Const.FUNC_ID.openOalFlightSchedule:
        case commonConst_1.Const.FUNC_ID.mySchedule:
            if (storage_1.storage.isIphone) {
                return false;
            }
            break;
        default:
    }
    return true;
}
exports.terminalFuncCheck = terminalFuncCheck;
/**
 * 権限のチェック
 */
function funcAuthCheck(funcId, jobAuth) {
    return terminalFuncCheck(funcId) && !!jobAuth.find((auth) => auth.funcId === funcId && auth.authLevel !== "L0");
}
exports.funcAuthCheck = funcAuthCheck;
/**
 * 認証切れのチェック
 */
function isAuthExpired() {
    const localLoginStamp = storage_1.storage.loginStamp;
    const sessionLonginStamp = StorageOfUser_1.storageOfUser.getLoginStamp();
    return !localLoginStamp || localLoginStamp !== sessionLonginStamp;
}
exports.isAuthExpired = isAuthExpired;
/**
 * 指定のパスが現在のパスであるか調べる（Component以外で使用する）
 * （Componentでは、props.location.pathnameを使用する）
 */
function isCurrentPath(pathName) {
    const pattern = new RegExp(`${pathName}/?$`);
    if (pattern.test(window.location.pathname)) {
        return true;
    }
    return false;
}
exports.isCurrentPath = isCurrentPath;
/**
 * iOSアプリの場合に位置情報を取得し実行する（PCはnullを取得）
 */
function execWithLocationInfo(execFunction) {
    if (window.webkit) {
        // iOSの場合
        // iOSからレスポンスされる関数を用意
        window.iLocation = (posLat, posLon) => {
            // 位置情報を取得する
            execFunction({ posLat, posLon });
        };
        // 位置情報を取得するiOSアプリの関数を実行
        window.webkit.messageHandlers.getLocation.postMessage("");
    }
    else {
        // PCの場合
        execFunction({ posLat: null, posLon: null });
    }
}
exports.execWithLocationInfo = execWithLocationInfo;
/**
 * 小文字を大文字に変換
 */
function toUpperCase(stringValue) {
    if (typeof stringValue !== "string")
        return "";
    if (!stringValue) {
        return "";
    }
    if ("I".toLowerCase() !== "i") {
        const charCodeZenkakuSmallA = "ａ".charCodeAt(0);
        const charCodeZenkakuBigA = "Ａ".charCodeAt(0);
        const stringReplaced = stringValue.replace(/[a-z]/g, 
        /* eslint-disable-next-line no-bitwise */
        (lowerCase) => String.fromCharCode(lowerCase.charCodeAt(0) & ~32));
        return stringReplaced.replace(/[ａ-ｚ]/g, (lowerCase) => String.fromCharCode(lowerCase.charCodeAt(0) + (charCodeZenkakuBigA - charCodeZenkakuSmallA)));
    }
    return stringValue.toUpperCase();
}
exports.toUpperCase = toUpperCase;
/**
 * 大文字を小文字に変換
 */
function toLowerCase(stringValue) {
    if (typeof stringValue !== "string")
        return "";
    if (!stringValue) {
        return "";
    }
    if ("I".toLowerCase() !== "i") {
        const charCodeZenkakuSmallA = "ａ".charCodeAt(0);
        const charCodeZenkakuBigA = "Ａ".charCodeAt(0);
        /* eslint-disable-next-line no-bitwise */
        const stringReplaced = stringValue.replace(/[A-Z]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) | 32));
        return stringReplaced.replace(/[Ａ-Ｚ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + (charCodeZenkakuSmallA - charCodeZenkakuBigA)));
    }
    return stringValue.toLowerCase();
}
exports.toLowerCase = toLowerCase;
/**
 * ひらがなをカタカナに変換
 */
function convertHiraganaToKatakana(string) {
    if (typeof string !== "string") {
        return "";
    }
    if (!string) {
        return "";
    }
    const codePointHiraganaFirst = "ぁ".charCodeAt(0);
    const codePointKatakanaFirst = "ァ".charCodeAt(0);
    return string.replace(/[ぁ-ゖ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + (codePointKatakanaFirst - codePointHiraganaFirst)));
}
exports.convertHiraganaToKatakana = convertHiraganaToKatakana;
/**
 * FISのXTA（Local）を取得する
 */
function getXtaLcl({ ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl, }) {
    return ataLcl || actLdLcl || tentativeEstLdLcl || estLdLcl || tentativeEtaLcl || etaLcl || staLcl || "";
}
exports.getXtaLcl = getXtaLcl;
/**
 * FISのXTD（Local）を取得する
 */
function getXtdLcl({ atdLcl, tentativeEtdLcl, etdLcl, stdLcl, }) {
    return atdLcl || tentativeEtdLcl || etdLcl || stdLcl || "";
}
exports.getXtdLcl = getXtdLcl;
/**
 * 「出発便XTD - 到着便XTA の時間差（Ground Time）」を算出
 */
function getGroundTime(xtaLcl, xtdLcl) {
    const xtaLclDayjs = (0, dayjs_1.default)(xtaLcl).second(0).millisecond(0);
    const xtdLclDayjs = (0, dayjs_1.default)(xtdLcl).second(0).millisecond(0);
    const minutes = xtdLclDayjs.diff(xtaLclDayjs, "m");
    if (minutes > 99 * 60 + 59)
        return "99:59";
    const hh = padding0(`${Math.floor(minutes / 60)}`, 2);
    const mm = padding0(`${minutes % 60}`, 2);
    return `${hh}:${mm}`;
}
exports.getGroundTime = getGroundTime;
/**
 * 「(XTA＋DGT)-XTD＝超過時間」を算出
 */
function getExcessTime(xtaLcl, xtdLcl, dgt) {
    if (!dgt)
        return "";
    const xtaLclDayjs = (0, dayjs_1.default)(xtaLcl).second(0).millisecond(0);
    const xtdLclDayjs = (0, dayjs_1.default)(xtdLcl).second(0).millisecond(0);
    const gndHours = Number(dgt.substring(0, 2));
    const gndMinutes = Number(dgt.substring(2));
    const minutes = xtaLclDayjs.add(gndHours, "h").add(gndMinutes, "m").diff(xtdLclDayjs, "m");
    if (minutes <= 0)
        return "";
    if (minutes > 9 * 60 + 59)
        return "9:59";
    const h = padding0(`${Math.floor(minutes / 60)}`, 1);
    const mm = padding0(`${minutes % 60}`, 2);
    return `${h}:${mm}`;
}
exports.getExcessTime = getExcessTime;
/**
 * 便番号を整形する
 * 4桁の場合で、1桁目が0の場合0を削除する
 */
function formatFltNo(fltNo) {
    if (typeof fltNo !== "string")
        return "";
    if (fltNo && fltNo.length === 4 && fltNo.substr(0, 1) === "0") {
        return fltNo.slice(1, 4);
    }
    return fltNo;
}
exports.formatFltNo = formatFltNo;
/**
 * FLTをフォーマット変換する
 */
function formatFlt(inputValue) {
    if (typeof inputValue !== "string")
        return "";
    let flightNo = inputValue.slice(2, 6);
    // 0パディング
    if (flightNo.length > 0 && inputValue.length < 6 && flightNo.match(/^[0-9]*$/)) {
        const airLineCode = `${inputValue}  `.slice(0, 2);
        flightNo = `0000${flightNo}`.slice(flightNo.length);
        return toUpperCase(airLineCode + flightNo) || "";
    }
    return toUpperCase(inputValue) || "";
}
exports.formatFlt = formatFlt;
/**
 * Priority一覧を取得する
 */
function getPriorities(cdCtrlDtls) {
    const priorityCdCtrlDtls = cdCtrlDtls.filter((cd) => cd.cdCls === "005");
    const priorities = [];
    for (let i = 0; i < priorityCdCtrlDtls.length; i++) {
        priorities.push({ label: priorityCdCtrlDtls[i].cdCat1, value: priorityCdCtrlDtls[i].cdCat1 });
    }
    return priorities;
}
exports.getPriorities = getPriorities;
/**
 * カレンダー日付の場合、Dayjs型の日付を返す。
 */
function getDayjsCalDate(date, format) {
    if (date) {
        const dayjsDate = (0, dayjs_1.default)(date, format);
        if (dayjsDate.format(format) === date) {
            return dayjsDate;
        }
    }
    return null;
}
exports.getDayjsCalDate = getDayjsCalDate;
/**
 * 任意の日付からYYYY-MM-DD[T]HH:mm:ss形式に変換する
 */
function getTimeDateString(dateTimeString, format) {
    // YYYY-MM-DD[T]HH:mm:ssZ形式の場合、端末のタイムゾーンに変換されてしまうので、時差部分を切り取ってフォーマットをかける
    return (0, dayjs_1.default)(dateTimeString.substring(0, 19)).format(format);
}
exports.getTimeDateString = getTimeDateString;
/**
 * 任意の日付から時差を最大４桁の整数で取り出す（情報がない場合は端末のタイムゾーン）
 */
function getTimeDiffUtc(dateTimeString) {
    if (dateTimeString.length > 19) {
        const tzNum = Number(dateTimeString.substring(19).trim().replace(":", ""));
        if (!Number.isNaN(tzNum)) {
            return tzNum;
        }
    }
    return Number((0, dayjs_1.default)(dateTimeString.substring(0, 19)).format("Z").replace(":", ""));
}
exports.getTimeDiffUtc = getTimeDiffUtc;
/**
 * 顔文字を削除する
 */
function removePictograph(text) {
    const ranges = ["\ud83c[\udf00-\udfff]", "\ud83d[\udc00-\ude4f]", "\ud83d[\ude80-\udeff]", "\ud7c9[\ude00-\udeff]", "[\u2600-\u27BF]"];
    const ex = new RegExp(ranges.join("|"), "g");
    return text.replace(ex, "");
}
exports.removePictograph = removePictograph;
/**
 * 先頭の文字列のJAを削除する
 */
function removeJa(text) {
    return text && text.replace(/^JA/, "");
}
exports.removeJa = removeJa;
/**
 * 0パディング
 */
function padding0(string, digits) {
    if (string && (string.length || string.length === 0)) {
        const padding = "0".repeat(digits);
        return (padding + string).slice(string.length);
    }
    return string;
}
exports.padding0 = padding0;
/**
 * Unicode(UTF-8)のbase64をデコードする
 * 参考：https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
 */
function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""));
}
exports.b64DecodeUnicode = b64DecodeUnicode;
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const last = parts.pop();
        return last && last.split(";").shift();
    }
    return null;
}
exports.getCookie = getCookie;
/**
 * 数値（数値文字列）を、カンマ区切りの数値文字列に変換する
 */
function separateWithComma(rawData) {
    if (rawData == null) {
        return "";
    }
    if (!`${rawData}`.match(/^\d+$/)) {
        return `${rawData}`;
    }
    return `${rawData}`.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
}
exports.separateWithComma = separateWithComma;
function keys(o) {
    return Object.keys(o);
}
exports.keys = keys;
/**
 * オブジェクトが空の場合はfalse, 空でない場合はtrueを返却します。
 * @param obj {Object<any>|undefined}
 * @return {boolean}
 */
const isObjectNotEmpty = (obj) => !!obj && Object.keys(obj).length !== 0;
exports.isObjectNotEmpty = isObjectNotEmpty;
/**
 * オブジェクトが空の場合はtrue, 空でない場合はfalseを返却します。
 * @param obj {Object<any>|undefined}
 * @return {boolean}
 */
const isObjectEmpty = (obj) => !(0, exports.isObjectNotEmpty)(obj);
exports.isObjectEmpty = isObjectEmpty;
/**
 * 与えられた配列を一意にします。
 * @param array {Array<unknown>}
 * @return {unknown[]}
 */
const arrayUnique = (array) => [...new Set(array)];
exports.arrayUnique = arrayUnique;
/**
 * 配列の最初の要素を返却します。ない場合はundefinedを返却します。
 * @param array {Array<any>}
 * @return {any|undefined}
 */
const arrayFirst = (array) => (array.length ? array[0] : undefined);
exports.arrayFirst = arrayFirst;
/**
 * 配列の最後の要素を返却します。ない場合はundefinedを返却します。
 * @param array {Array<any>}
 * @return {any|undefined}
 */
const arrayLast = (array) => (array.length ? array[array.length - 1] : undefined);
exports.arrayLast = arrayLast;
/**
 * 時差を含めた日付の形式を返却する
 */
const parseTimeLcl = ({ timeLcl, timeDiffUtc, isLocal, }) => {
    if (timeLcl) {
        const timeLclDayjs = (0, dayjs_1.default)(timeLcl);
        let timeDiffString = "";
        if (timeDiffUtc !== null) {
            if (timeDiffUtc === 0) {
                // 0は、±00
                timeDiffString = "\u00b100";
            }
            else {
                // 時差が１時間刻みの場合は２桁表示、分刻みの場合は４桁表示、
                if (timeDiffUtc % 100 === 0) {
                    timeDiffString = `00${Math.abs(Math.trunc(timeDiffUtc / 100))}`.slice(-2);
                }
                else {
                    timeDiffString = `0000${Math.abs(timeDiffUtc)}`.slice(-4);
                }
                if (timeDiffUtc > 0) {
                    timeDiffString = `+${timeDiffString}`;
                }
                else if (timeDiffUtc < 0) {
                    timeDiffString = `-${timeDiffString}`;
                }
            }
        }
        return {
            date: timeLclDayjs.format("YYYY/MM/DD"),
            time: `${timeLclDayjs.format("HH:mm")}${isLocal ? "L" : ""} ${timeDiffString}`,
        };
    }
    return {
        date: "",
        time: "",
    };
};
exports.parseTimeLcl = parseTimeLcl;
/**
 * DDHHmm形式をYYYY-MM-DDTHH:mmに変換する
 * パラメータ：orgDate：基準日(YYYY-MM-DD形式)、ddhhmmValue変換対象
 * 戻り値："": 入力値なし、null: 入力値不正
 */
function convertDDHHmmToDate(orgDate, ddhhmmValue) {
    if (!orgDate)
        return "";
    if (!ddhhmmValue)
        return "";
    if (!ddhhmmValue.match(/^[0-9]*$/))
        return null;
    let moOrgDate = (0, dayjs_1.default)(orgDate);
    if (!moOrgDate.isValid())
        return "";
    const moOrgDateTo = (0, dayjs_1.default)(orgDate).add(15, "day");
    const orgDay = moOrgDate.date();
    const orgDayTo = moOrgDateTo.date();
    const day = Number(ddhhmmValue.slice(0, 2));
    if (orgDay <= orgDayTo) {
        if (!(day < orgDayTo)) {
            moOrgDate = moOrgDate.add(-1, "month");
        }
    }
    else if (day < orgDayTo) {
        moOrgDate = moOrgDate.add(1, "month");
    }
    const newDate = getDayjsCalDate(moOrgDate.format("YYYYMM") + ddhhmmValue, "YYYYMMDDHHmm");
    if (newDate) {
        return newDate.format("YYYY-MM-DDTHH:mm");
    }
    return null;
}
exports.convertDDHHmmToDate = convertDDHHmmToDate;
/**
 * YYMMDD形式をYYYY-MM-DDに変換する
 * パラメータ：yymmddValue変換対象
 * 戻り値："": 入力値なし、null: 入力値不正
 */
function convertYYMMDDToDate(yymmddValue) {
    if (!yymmddValue)
        return "";
    const mo = getDayjsCalDate(yymmddValue, "YYMMDD");
    if (mo) {
        return mo.format("YYYY-MM-DD");
    }
    return null;
}
exports.convertYYMMDDToDate = convertYYMMDDToDate;
const smoothScroll = (target, targetPos, duration = 0) => {
    let position = 0;
    let progress = 0;
    const startPos = target.scrollTop;
    if (duration === 0) {
        target.scrollTo(0, startPos + position);
        return;
    }
    const easeOut = (p) => p * (2 - p);
    const move = () => {
        progress += 1;
        position = (targetPos - startPos) * easeOut(progress / duration);
        target.scrollTo(0, startPos + position);
        if (Math.abs(position) < Math.abs(targetPos - startPos))
            requestAnimationFrame(move);
    };
    requestAnimationFrame(move);
};
exports.smoothScroll = smoothScroll;
const convertLineFeedCodeToCRLF = (value) => (value ? value.split("\n").join("\r\n") : value);
exports.convertLineFeedCodeToCRLF = convertLineFeedCodeToCRLF;
const convertCRLFCodeToLineFeed = (value) => (value ? value.split("\r\n").join("\n") : value);
exports.convertCRLFCodeToLineFeed = convertCRLFCodeToLineFeed;
const convertTimeToHhmm = (time) => typeof time === "number" ? time.toString().padStart(4, "0") : "";
exports.convertTimeToHhmm = convertTimeToHhmm;
const getByte = (value) => encodeURIComponent(value).replace(/%../g, "x").length;
exports.getByte = getByte;
/**
 * 情報発信画面にて、他空港のテンプレートを利用した際、掲示板登録画面・通知画面の
 * ジョブコード 1-nの先頭にログインユーザのジョブコードを挿入するために使用
 */
const arrangeTemplatesJobIdList = (jobIdList, userJobId, templateJobId) => {
    if (templateJobId !== userJobId) {
        const newJobIdList = jobIdList.filter((jobId) => jobId !== userJobId && jobId !== templateJobId);
        newJobIdList.unshift(userJobId);
        return newJobIdList;
    }
    return jobIdList;
};
exports.arrangeTemplatesJobIdList = arrangeTemplatesJobIdList;
const removeTtyComment = (value) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.replace(/;.*/s, "")) !== null && _a !== void 0 ? _a : undefined; };
exports.removeTtyComment = removeTtyComment;
//# sourceMappingURL=commonUtil.js.map