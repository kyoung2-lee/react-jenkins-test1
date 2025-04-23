import dayjs from "dayjs";
import { Const } from "./commonConst";
import { storage } from "./storage";
import { storageOfUser } from "./StorageOfUser";

/**
 * 端末区分による使用可否を返す
 */
export function terminalFuncCheck(funcId: string): boolean {
  // フェーズによる機能制限
  if (Const.PROJECT_PHASE < 1) {
    switch (funcId) {
      case Const.FUNC_ID.openUserSetting:
      case Const.FUNC_ID.openNotificationList:
        return false;
      default:
        return true;
    }
  }

  // 全機能有効の時は無条件
  if (Const.USE_ALL_FUNC) {
    return true;
  }

  switch (funcId) {
    // メニュー
    case Const.FUNC_ID.openBarChart:
      if (storage.terminalCat === Const.TerminalCat.iPhone) {
        return false;
      }
      break;
    case Const.FUNC_ID.openFis:
      if (storage.terminalCat === Const.TerminalCat.iPhone) {
        return false;
      }
      break;
    case Const.FUNC_ID.openFlightSearch:
      break;
    case Const.FUNC_ID.openAirportIssue:
      if (storage.terminalCat === Const.TerminalCat.iPhone) {
        return false;
      }
      break;
    case Const.FUNC_ID.openUserSetting:
      if (storage.terminalCat === Const.TerminalCat.pc) {
        return false;
      }
      break;
    case Const.FUNC_ID.openNotificationList:
      if (storage.terminalCat === Const.TerminalCat.pc) {
        return false;
      }
      break;
    // サブメニュー
    case Const.FUNC_ID.openOperationTask:
      break;
    case Const.FUNC_ID.openFlightDetail:
      break;
    case Const.FUNC_ID.openShipTransitList:
      break;
    // 機能
    case Const.FUNC_ID.updateAireportRemarks:
      break;
    case Const.FUNC_ID.updateFisAuto:
    case Const.FUNC_ID.updateBarChartAuto:
      if (storage.terminalCat === Const.TerminalCat.iPad || storage.terminalCat === Const.TerminalCat.iPhone) {
        return false;
      }
      break;
    case Const.FUNC_ID.updateOperationTask:
      break;
    case Const.FUNC_ID.updateFlightRemarks:
      break;
    case Const.FUNC_ID.openBroadcast:
    case Const.FUNC_ID.openBroadcastEmail:
    case Const.FUNC_ID.openBroadcastTty:
    case Const.FUNC_ID.openBroadcastAftn:
    case Const.FUNC_ID.openBroadcastAcars:
    case Const.FUNC_ID.openBroadcastNotification:
    case Const.FUNC_ID.openMvtMsg:
    case Const.FUNC_ID.openOalFlightSchedule:
    case Const.FUNC_ID.mySchedule:
      if (storage.isIphone) {
        return false;
      }
      break;
    default:
  }
  return true;
}

/**
 * 権限のチェック
 */
export function funcAuthCheck(funcId: string, jobAuth: JobAuthApi.JobAuth[]): boolean {
  return terminalFuncCheck(funcId) && !!jobAuth.find((auth) => auth.funcId === funcId && auth.authLevel !== "L0");
}

/**
 * 認証切れのチェック
 */
export function isAuthExpired(): boolean {
  const localLoginStamp = storage.loginStamp;
  const sessionLonginStamp = storageOfUser.getLoginStamp();
  return !localLoginStamp || localLoginStamp !== sessionLonginStamp;
}

/**
 * 指定のパスが現在のパスであるか調べる（Component以外で使用する）
 * （Componentでは、props.location.pathnameを使用する）
 */
export function isCurrentPath(pathName: string): boolean {
  const pattern = new RegExp(`${pathName}/?$`);
  if (pattern.test(window.location.pathname)) {
    return true;
  }
  return false;
}

/**
 * iOSアプリの場合に位置情報を取得し実行する（PCはnullを取得）
 */
export function execWithLocationInfo(execFunction: ({ posLat, posLon }: { posLat: string | null; posLon: string | null }) => void) {
  if (window.webkit) {
    // iOSの場合
    // iOSからレスポンスされる関数を用意
    window.iLocation = (posLat: string, posLon: string) => {
      // 位置情報を取得する
      execFunction({ posLat, posLon });
    };
    // 位置情報を取得するiOSアプリの関数を実行
    window.webkit.messageHandlers.getLocation.postMessage("");
  } else {
    // PCの場合
    execFunction({ posLat: null, posLon: null });
  }
}

/**
 * 小文字を大文字に変換
 */
export function toUpperCase(stringValue: string): string {
  if (typeof stringValue !== "string") return "";

  if (!stringValue) {
    return "";
  }
  if ("I".toLowerCase() !== "i") {
    const charCodeZenkakuSmallA = "ａ".charCodeAt(0);
    const charCodeZenkakuBigA = "Ａ".charCodeAt(0);
    const stringReplaced = stringValue.replace(
      /[a-z]/g,
      /* eslint-disable-next-line no-bitwise */
      (lowerCase: string) => String.fromCharCode(lowerCase.charCodeAt(0) & ~32)
    );
    return stringReplaced.replace(/[ａ-ｚ]/g, (lowerCase: string) =>
      String.fromCharCode(lowerCase.charCodeAt(0) + (charCodeZenkakuBigA - charCodeZenkakuSmallA))
    );
  }
  return stringValue.toUpperCase();
}

/**
 * 大文字を小文字に変換
 */
export function toLowerCase(stringValue: string): string {
  if (typeof stringValue !== "string") return "";

  if (!stringValue) {
    return "";
  }
  if ("I".toLowerCase() !== "i") {
    const charCodeZenkakuSmallA = "ａ".charCodeAt(0);
    const charCodeZenkakuBigA = "Ａ".charCodeAt(0);
    /* eslint-disable-next-line no-bitwise */
    const stringReplaced = stringValue.replace(/[A-Z]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) | 32));
    return stringReplaced.replace(/[Ａ-Ｚ]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) + (charCodeZenkakuSmallA - charCodeZenkakuBigA))
    );
  }
  return stringValue.toLowerCase();
}

/**
 * ひらがなをカタカナに変換
 */
export function convertHiraganaToKatakana(string: string): string {
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

/**
 * FISのXTA（Local）を取得する
 */
export function getXtaLcl({
  ataLcl,
  actLdLcl,
  tentativeEstLdLcl,
  estLdLcl,
  tentativeEtaLcl,
  etaLcl,
  staLcl,
}: {
  ataLcl: string | null;
  actLdLcl: string | null;
  tentativeEstLdLcl: string | null;
  estLdLcl: string | null;
  tentativeEtaLcl: string | null;
  etaLcl: string | null;
  staLcl: string | null;
}): string {
  return ataLcl || actLdLcl || tentativeEstLdLcl || estLdLcl || tentativeEtaLcl || etaLcl || staLcl || "";
}

/**
 * FISのXTD（Local）を取得する
 */
export function getXtdLcl({
  atdLcl,
  tentativeEtdLcl,
  etdLcl,
  stdLcl,
}: {
  atdLcl: string | null;
  tentativeEtdLcl: string | null;
  etdLcl: string | null;
  stdLcl: string | null;
}): string {
  return atdLcl || tentativeEtdLcl || etdLcl || stdLcl || "";
}

/**
 * 「出発便XTD - 到着便XTA の時間差（Ground Time）」を算出
 */
export function getGroundTime(xtaLcl: string, xtdLcl: string): string {
  const xtaLclDayjs = dayjs(xtaLcl).second(0).millisecond(0);
  const xtdLclDayjs = dayjs(xtdLcl).second(0).millisecond(0);
  const minutes = xtdLclDayjs.diff(xtaLclDayjs, "m");
  if (minutes > 99 * 60 + 59) return "99:59";
  const hh = padding0(`${Math.floor(minutes / 60)}`, 2);
  const mm = padding0(`${minutes % 60}`, 2);
  return `${hh}:${mm}`;
}

/**
 * 「(XTA＋DGT)-XTD＝超過時間」を算出
 */
export function getExcessTime(xtaLcl: string, xtdLcl: string, dgt: string): string {
  if (!dgt) return "";
  const xtaLclDayjs = dayjs(xtaLcl).second(0).millisecond(0);
  const xtdLclDayjs = dayjs(xtdLcl).second(0).millisecond(0);
  const gndHours = Number(dgt.substring(0, 2));
  const gndMinutes = Number(dgt.substring(2));
  const minutes = xtaLclDayjs.add(gndHours, "h").add(gndMinutes, "m").diff(xtdLclDayjs, "m");
  if (minutes <= 0) return "";
  if (minutes > 9 * 60 + 59) return "9:59";
  const h = padding0(`${Math.floor(minutes / 60)}`, 1);
  const mm = padding0(`${minutes % 60}`, 2);
  return `${h}:${mm}`;
}

/**
 * 便番号を整形する
 * 4桁の場合で、1桁目が0の場合0を削除する
 */
export function formatFltNo(fltNo: string): string {
  if (typeof fltNo !== "string") return "";

  if (fltNo && fltNo.length === 4 && fltNo.substr(0, 1) === "0") {
    return fltNo.slice(1, 4);
  }
  return fltNo;
}

/**
 * FLTをフォーマット変換する
 */
export function formatFlt(inputValue: string): string {
  if (typeof inputValue !== "string") return "";

  let flightNo = inputValue.slice(2, 6);
  // 0パディング
  if (flightNo.length > 0 && inputValue.length < 6 && flightNo.match(/^[0-9]*$/)) {
    const airLineCode = `${inputValue}  `.slice(0, 2);
    flightNo = `0000${flightNo}`.slice(flightNo.length);
    return toUpperCase(airLineCode + flightNo) || "";
  }
  return toUpperCase(inputValue) || "";
}

/**
 * Priority一覧を取得する
 */
export function getPriorities(cdCtrlDtls: MasterApi.CdCtrlDtl[]): { label: string; value: string }[] {
  const priorityCdCtrlDtls = cdCtrlDtls.filter((cd) => cd.cdCls === "005");
  const priorities = [];
  for (let i = 0; i < priorityCdCtrlDtls.length; i++) {
    priorities.push({ label: priorityCdCtrlDtls[i].cdCat1, value: priorityCdCtrlDtls[i].cdCat1 });
  }
  return priorities;
}

/**
 * カレンダー日付の場合、Dayjs型の日付を返す。
 */
export function getDayjsCalDate(date: string | null | undefined, format: string) {
  if (date) {
    const dayjsDate = dayjs(date, format);
    if (dayjsDate.format(format) === date) {
      return dayjsDate;
    }
  }
  return null;
}

/**
 * 任意の日付からYYYY-MM-DD[T]HH:mm:ss形式に変換する
 */
export function getTimeDateString(dateTimeString: string, format: "YYYY-MM-DD[T]HH:mm:ss" | "YYYY-MM-DD"): string {
  // YYYY-MM-DD[T]HH:mm:ssZ形式の場合、端末のタイムゾーンに変換されてしまうので、時差部分を切り取ってフォーマットをかける
  return dayjs(dateTimeString.substring(0, 19)).format(format);
}

/**
 * 任意の日付から時差を最大４桁の整数で取り出す（情報がない場合は端末のタイムゾーン）
 */
export function getTimeDiffUtc(dateTimeString: string): number {
  if (dateTimeString.length > 19) {
    const tzNum = Number(dateTimeString.substring(19).trim().replace(":", ""));
    if (!Number.isNaN(tzNum)) {
      return tzNum;
    }
  }
  return Number(dayjs(dateTimeString.substring(0, 19)).format("Z").replace(":", ""));
}

/**
 * 顔文字を削除する
 */
export function removePictograph(text: string) {
  const ranges = ["\ud83c[\udf00-\udfff]", "\ud83d[\udc00-\ude4f]", "\ud83d[\ude80-\udeff]", "\ud7c9[\ude00-\udeff]", "[\u2600-\u27BF]"];

  const ex = new RegExp(ranges.join("|"), "g");
  return text.replace(ex, "");
}

/**
 * 先頭の文字列のJAを削除する
 */
export function removeJa(text: string) {
  return text && text.replace(/^JA/, "");
}

/**
 * 0パディング
 */
export function padding0(string: string, digits: number): string {
  if (string && (string.length || string.length === 0)) {
    const padding = "0".repeat(digits);
    return (padding + string).slice(string.length);
  }
  return string;
}

/**
 * Unicode(UTF-8)のbase64をデコードする
 * 参考：https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
 */
export function b64DecodeUnicode(str: string) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const last = parts.pop();
    return last && last.split(";").shift();
  }
  return null;
}

/**
 * 数値（数値文字列）を、カンマ区切りの数値文字列に変換する
 */
export function separateWithComma(rawData: string | number | null | undefined): string {
  if (rawData == null) {
    return "";
  }
  if (!`${rawData}`.match(/^\d+$/)) {
    return `${rawData}`;
  }

  return `${rawData}`.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
}

export function keys<O extends object>(o: O) {
  return Object.keys(o) as (keyof O)[];
}

/**
 * オブジェクトが空の場合はfalse, 空でない場合はtrueを返却します。
 * @param obj {Object<any>|undefined}
 * @return {boolean}
 */
export const isObjectNotEmpty = (obj?: object | null): boolean => !!obj && Object.keys(obj).length !== 0;

/**
 * オブジェクトが空の場合はtrue, 空でない場合はfalseを返却します。
 * @param obj {Object<any>|undefined}
 * @return {boolean}
 */
export const isObjectEmpty = (obj?: object | null): boolean => !isObjectNotEmpty(obj);

/**
 * 与えられた配列を一意にします。
 * @param array {Array<unknown>}
 * @return {unknown[]}
 */
export const arrayUnique = (array: unknown[]): unknown[] => [...new Set(array)];

/**
 * 配列の最初の要素を返却します。ない場合はundefinedを返却します。
 * @param array {Array<any>}
 * @return {any|undefined}
 */
export const arrayFirst = <T>(array: T[]): T | undefined => (array.length ? array[0] : undefined);

/**
 * 配列の最後の要素を返却します。ない場合はundefinedを返却します。
 * @param array {Array<any>}
 * @return {any|undefined}
 */
export const arrayLast = <T>(array: T[]): T | undefined => (array.length ? array[array.length - 1] : undefined);

interface ParsedDateTime {
  date: string;
  time: string;
}

/**
 * 時差を含めた日付の形式を返却する
 */
export const parseTimeLcl = ({
  timeLcl,
  timeDiffUtc,
  isLocal,
}: {
  timeLcl: string;
  timeDiffUtc: number | null; // 時差（最大４桁の整数）
  isLocal: boolean; // 空港ローカル日付であるか
}): ParsedDateTime => {
  if (timeLcl) {
    const timeLclDayjs = dayjs(timeLcl);
    let timeDiffString = "";
    if (timeDiffUtc !== null) {
      if (timeDiffUtc === 0) {
        // 0は、±00
        timeDiffString = "\u00b100";
      } else {
        // 時差が１時間刻みの場合は２桁表示、分刻みの場合は４桁表示、
        if (timeDiffUtc % 100 === 0) {
          timeDiffString = `00${Math.abs(Math.trunc(timeDiffUtc / 100))}`.slice(-2);
        } else {
          timeDiffString = `0000${Math.abs(timeDiffUtc)}`.slice(-4);
        }
        if (timeDiffUtc > 0) {
          timeDiffString = `+${timeDiffString}`;
        } else if (timeDiffUtc < 0) {
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

/**
 * DDHHmm形式をYYYY-MM-DDTHH:mmに変換する
 * パラメータ：orgDate：基準日(YYYY-MM-DD形式)、ddhhmmValue変換対象
 * 戻り値："": 入力値なし、null: 入力値不正
 */
export function convertDDHHmmToDate(orgDate: string | undefined | null, ddhhmmValue: string | undefined): string | null {
  if (!orgDate) return "";
  if (!ddhhmmValue) return "";
  if (!ddhhmmValue.match(/^[0-9]*$/)) return null;
  let moOrgDate = dayjs(orgDate);
  if (!moOrgDate.isValid()) return "";
  const moOrgDateTo = dayjs(orgDate).add(15, "day");
  const orgDay = moOrgDate.date();
  const orgDayTo = moOrgDateTo.date();
  const day = Number(ddhhmmValue.slice(0, 2));
  if (orgDay <= orgDayTo) {
    if (!(day < orgDayTo)) {
      moOrgDate = moOrgDate.add(-1, "month");
    }
  } else if (day < orgDayTo) {
    moOrgDate = moOrgDate.add(1, "month");
  }
  const newDate = getDayjsCalDate(moOrgDate.format("YYYYMM") + ddhhmmValue, "YYYYMMDDHHmm");
  if (newDate) {
    return newDate.format("YYYY-MM-DDTHH:mm");
  }
  return null;
}

/**
 * YYMMDD形式をYYYY-MM-DDに変換する
 * パラメータ：yymmddValue変換対象
 * 戻り値："": 入力値なし、null: 入力値不正
 */
export function convertYYMMDDToDate(yymmddValue: string | undefined): string | null {
  if (!yymmddValue) return "";
  const mo = getDayjsCalDate(yymmddValue, "YYMMDD");
  if (mo) {
    return mo.format("YYYY-MM-DD");
  }
  return null;
}

export const smoothScroll = (target: HTMLElement, targetPos: number, duration = 0) => {
  let position = 0;
  let progress = 0;
  const startPos = target.scrollTop;
  if (duration === 0) {
    target.scrollTo(0, startPos + position);
    return;
  }
  const easeOut = (p: number) => p * (2 - p);
  const move = () => {
    progress += 1;
    position = (targetPos - startPos) * easeOut(progress / duration);
    target.scrollTo(0, startPos + position);
    if (Math.abs(position) < Math.abs(targetPos - startPos)) requestAnimationFrame(move);
  };
  requestAnimationFrame(move);
};

export const convertLineFeedCodeToCRLF = (value?: string): string | undefined => (value ? value.split("\n").join("\r\n") : value);

export const convertCRLFCodeToLineFeed = (value?: string): string | undefined => (value ? value.split("\r\n").join("\n") : value);

export const convertTimeToHhmm = (time: number | undefined | null): string =>
  typeof time === "number" ? time.toString().padStart(4, "0") : "";

export const getByte = (value: string): number => encodeURIComponent(value).replace(/%../g, "x").length;

/**
 * 情報発信画面にて、他空港のテンプレートを利用した際、掲示板登録画面・通知画面の
 * ジョブコード 1-nの先頭にログインユーザのジョブコードを挿入するために使用
 */
export const arrangeTemplatesJobIdList = (jobIdList: number[], userJobId: number, templateJobId: number) => {
  if (templateJobId !== userJobId) {
    const newJobIdList = jobIdList.filter((jobId) => jobId !== userJobId && jobId !== templateJobId);
    newJobIdList.unshift(userJobId);
    return newJobIdList;
  }
  return jobIdList;
};

export const removeTtyComment = (value?: string): string | undefined => value?.replace(/;.*/s, "") ?? undefined;
