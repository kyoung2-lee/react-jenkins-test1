import { SoalaMessage } from "../soalaMessages";
import { convertLineFeedCodeToCRLF, getByte, isObjectEmpty, getDayjsCalDate, removeTtyComment } from "../commonUtil";
import { Const } from "../commonConst";
import { SearchParams } from "../../reducers/flightSearch";
import { OalSearchParams } from "../../reducers/oalFlightSchedule";

/** 必須チェック */
export const hasValue = (value: typeValue | boolean): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "boolean") {
    return true;
  }
  return !!String(value).trim();
};

type typeValue = string | number | undefined | null;

/** 特定文字必須チェック 未入力の場合、falseを返す */
// export const hasSpecialValue = (value: string, specialValue: string) => !value || (value.match(new RegExp(specialValue))) ? true : false;
/** 型チェック(半角数字) */
export const isOnlyNumber = (value: typeValue) => !!(value == null || value.toString().match(/^[0-9]*$/));
/** 型チェック(半角英字) */
export const isOnlyAlphabet = (value: typeValue) => !!(value == null || value.toString().match(/^[A-Za-z]*$/));
/** 型チェック(半角英数字) */
export const isOnlyHalfWidth = (value: typeValue) => !!(value == null || value.toString().match(/^[A-Za-z0-9]*$/));
/** 型チェック(半角英数字記号) */
export const isOnlyHalfWidthSymbol = (value: typeValue) => !!(value == null || value.toString().match(/^[ -~]*$/));
/** 型チェック(半角英数字./-()) TTYアドレスに利用できる文字列 */
export const isOnlyHalfWidthTtyAddressSymbol = (value: typeValue) => !!(value == null || value.toString().match(/^[A-Za-z0-9./\-()]*$/));
/** 型チェック(半角英数字!#$%()*+,-./:;=?@[\]^_\n(改行コード) (半角スペース)) TTYに利用できる文字列 */
export const isOnlyHalfWidthTtySymbol = (value: typeValue) =>
  value == null || value.toString().match(/^[A-Za-z0-9./\-()!#$%*+,:=?@[\\\]^_\n ]*$/);
/** 型チェック(ASCII文字コード（半角スペース）〜~+改行のみ) Uplinkに利用できる文字列 */
export const isOnlyUplinkSymbol = (value: typeValue) => !!(value == null || value.toString().match(/^[ -~\r\n]+$/));
/** 文字数チェック */
export const isOkLength = (value: typeValue, length: number) => !!(value == null || value === "" || value.toString().length === length);
/** 文字数チェック（指定桁以上） */
export const isOkLengthOver = (value: typeValue, length: number) => !!(value == null || value === "" || value.toString().length >= length);
/** 文字数チェック（指定桁以下） */
export const isOkLengthLessOrEqual = (value: typeValue, length: number) =>
  !!(value == null || value === "" || value.toString().length <= length);
/** メールアドレス形式かどうか */
export const isEmailAddress = (value: typeValue) => !!(value == null || value === "" || value.toString().match(Const.EMAIL_ADDRESS_REGEX));
/** TTYアドレス形式かどうか */
export const isTtyAddress = (value: typeValue) => isOnlyHalfWidthTtyAddressSymbol(value) && isOkLength(value, 7);
/** Job Code は半角英数字記号で入力してください */
export const isOkJobCode = (value: typeValue) => (!isOnlyHalfWidthSymbol(value) ? SoalaMessage.M50014C : undefined);
/** Notification Title は半角英数字記号で入力してください */
export const isOkNtfTitle = (value: typeValue) => (!isOnlyHalfWidthSymbol(value) ? SoalaMessage.M50014C : undefined);
/** Job Auth Code は半角英数字記号で入力してください */
export const isOkJobAuthCd = (value: typeValue) => (!isOnlyHalfWidthSymbol(value) ? SoalaMessage.M50014C : undefined);
/** メールアドレスの入力は、半角英数字または、-_@.のみを利用し、@を含めて入力してください */
export const isOkEmail = (value: typeValue) => (!isEmailAddress(value) ? SoalaMessage.M50015C : undefined);
/** 発令画面 - メールメッセージ本文は、4000文字以下で入力してください */
export const isOkIssuMailBody = (value: typeValue) => (!isOkLengthLessOrEqual(value, 4000) ? SoalaMessage.M50015C : undefined);
/** TTYアドレスの入力は、半角大文字英字または、./-()のみ利用し、7文字で入力してください */
export const isOkTtyAddress = (value: typeValue) =>
  !isOnlyHalfWidthTtyAddressSymbol(value) || !isOkLength(value, 7) ? SoalaMessage.M50015C : undefined;
/** TTYの入力は、半角大文字英字または、./-() 改行 スペース セミコロンのみ利用してください */
export const isOkTty = (value: string) => {
  const removedComment = removeTtyComment(value);
  return !isOnlyHalfWidthTtySymbol(removedComment) || !isTtyTextByte(removedComment || "") ? SoalaMessage.M50015C : undefined;
};
/** ALは半角英数字かつ２桁で入力してください */
export const isOkAl = (value: typeValue) => (!isOnlyHalfWidth(value) || !isOkLength(value, 2) ? SoalaMessage.M50014C : undefined);
/** カジュアル便の便名はTTYアドレスで入力可能な文字のみ */
export const isOkCasualFlt = (value: string) =>
  !isOnlyHalfWidthTtyAddressSymbol(value) || !isOkLengthLessOrEqual(value, 10) ? SoalaMessage.M50014C : undefined;
/** カジュアル便の便名は8桁以下のTTYアドレスで入力可能な文字のみ */
export const isOkCasualFlt8 = (value: string) =>
  !isOnlyHalfWidthTtyAddressSymbol(value) || !isOkLengthLessOrEqual(value, 8) ? SoalaMessage.M50014C : undefined;
/** Originator(ACARS)の入力は、半角大文字英字または、./-()のみ利用し、7文字で入力してください */
export const halfWidthAcarsOriginator = (value: typeValue) =>
  !isOnlyHalfWidthTtyAddressSymbol(value) || !isOkLength(value, 7) ? SoalaMessage.M50014C : undefined;
/** Uplinkは(ASCII文字コード（半角スペース）〜~+改行のみ)で入力してください */
export const isOkUplink = (value: typeValue) => (!isOnlyUplinkSymbol(value) ? SoalaMessage.M50014C : undefined);
/** SHIPはは4けた以上10けた以下で入力してください */
export const lengthShip = (value: typeValue) =>
  !(isOkLengthOver(value, 4) && isOkLengthLessOrEqual(value, 10)) ? SoalaMessage.M50014C : undefined;
/** SHIPは２けた以上10けた以下で入力してください */
export const lengthShip2 = (value: typeValue) =>
  !(isOkLengthOver(value, 2) && isOkLengthLessOrEqual(value, 10)) ? SoalaMessage.M50014C : undefined;
/** SHIPは半角英数字で入力してください */
export const halfWidthShip = (value: typeValue) => (!isOnlyHalfWidth(value) ? SoalaMessage.M50014C : undefined);
/** SPOTは半角英数字で入力してください */
export const halfWidthSpot = (value: typeValue) => (!isOnlyHalfWidth(value) ? SoalaMessage.M50014C : undefined);
/** FLTは6けた以上で入力してください */
export const lengthFlt = (value: typeValue) => (!isOkLengthOver(value, 6) ? SoalaMessage.M50014C : undefined);
/** FLTは3けた以上６けた以下で入力してください */
export const lengthFlt3 = (value: typeValue) =>
  !(isOkLengthOver(value, 3) && isOkLengthLessOrEqual(value, 6)) ? SoalaMessage.M50014C : undefined;
/** FLTは半角英数字で入力してください */
export const halfWidthFlt = (value: typeValue) => (!isOnlyHalfWidth(value) ? SoalaMessage.M50014C : undefined);
/** casFltNoはTTYで許容される文字列で入力してください */
export const halfWidthCasFlt = (value: typeValue) => (!isOnlyHalfWidthTtyAddressSymbol(value) ? SoalaMessage.M50014C : undefined);
/** TMLは４桁までの半角英数字で入力してください */
export const isTml = (value: typeValue) => (!isOnlyHalfWidth(value) || !isOkLengthLessOrEqual(value, 4) ? SoalaMessage.M50014C : undefined);
/** EQPは3桁の半角英数字で入力してください */
export const isEQP = (value: typeValue) => (!isOnlyHalfWidth(value) || !isOkLength(value, 3) ? SoalaMessage.M50014C : undefined);
/** APOを入力してください */
export const requiredApo = (value: typeValue) => (!hasValue(value) ? SoalaMessage.M50016C : undefined);
/** FLTを入力してください */
export const requiredFlt = (value: typeValue) => (!hasValue(value) ? SoalaMessage.M50016C : undefined);
/** SHIPを入力してください */
export const requiredShip = (value: typeValue) => (!hasValue(value) ? SoalaMessage.M50016C : undefined);
/** Job Codeを入力してください */
export const requiredJobCode = (value: typeValue) => (!hasValue(value) ? SoalaMessage.M50016C : undefined);
/** Job Auth Codeを入力してください */
export const requiredJobAuthCd = (value: typeValue) => (value == null || value.toString().length === 0 ? SoalaMessage.M50016C : undefined);
/** Issue Time(L)を入力してください */
export const requiredIssueTime = (value: typeValue) => (!hasValue(value) ? SoalaMessage.M50016C : undefined);
/** 空港コードは半角英字3文字で入力してください */
export const halfWidthApoCd = (value: typeValue) =>
  !(isOnlyAlphabet(value) && (value == null || value === "" || value.toString().length === 3)) ? SoalaMessage.M50014C : undefined;
/** 旅客人数は半角数字3文字以下で入力してください */
export const lengthPax = (value: typeValue) =>
  !isOnlyNumber(value) || !isOkLengthLessOrEqual(value, 3) ? SoalaMessage.M50014C : undefined;
/** 出発ゲート番号は半角英数字で入力してください */
export const isOkGateNo = (value: typeValue) => (!isOnlyHalfWidth(value) ? SoalaMessage.M50014C : undefined);
/** チェックインステータスは半角英数字かつ２桁で入力してください */
export const isOkCkinSts = (value: typeValue) => (!isOnlyHalfWidth(value) || !isOkLength(value, 2) ? SoalaMessage.M50014C : undefined);
/** ゲートステータスは半角英数字かつ２桁で入力してください */
export const isOkGateSts = (value: typeValue) => (!isOnlyHalfWidth(value) || !isOkLength(value, 2) ? SoalaMessage.M50014C : undefined);
/** SPOTは4けた以下で入力してください */
export const lengthSpot = (value: typeValue) => (!isOkLengthLessOrEqual(value, 4) ? SoalaMessage.M50014C : undefined);
/** 搭載燃料量は半角数字で入力してください */
export const isOkFuelWt = (value: typeValue) => (!isOnlyNumber(value) ? SoalaMessage.M50014C : undefined);
/** 搭載燃料ステータスは半角英字で入力してください */
export const isOkFuelStatus = (value: typeValue) => (!isOnlyAlphabet(value) ? SoalaMessage.M50014C : undefined);
/** KeyWordは30けた以下で入力してください */
export const lengthKeyWord30 = (value: typeValue) => (!isOkLengthLessOrEqual(value, 30) ? SoalaMessage.M50014C : undefined);
/** KeyWordは100けた以下で入力してください */
export const lengthKeyWord100 = (value: typeValue) => (!isOkLengthLessOrEqual(value, 100) ? SoalaMessage.M50014C : undefined);
/** JobCodeは10けた以下で入力してください */
export const lengthJobCd = (value: typeValue) => (!isOkLengthLessOrEqual(value, 10) ? SoalaMessage.M50014C : undefined);

/** 時間はHHmm形式で入力してください */
export const time = (value: typeValue) => {
  if (!hasValue(value)) {
    return undefined;
  }
  if (value && value.toString().match(/^([0-1][0-9]|[2][0-3])[0-5][0-9]$/)) {
    return undefined;
  }
  return SoalaMessage.M50014C;
};
/** 時間はHHmm形式または"SKD"で入力してください */
export const timeOrSkd = (value: typeValue) => {
  if (!hasValue(value)) {
    return undefined;
  }
  if (value && (value === "SKD" || value.toString().match(/^([0-1][0-9]|[2][0-3])[0-5][0-9]$/))) {
    return undefined;
  }
  return SoalaMessage.M50014C;
};
/** 時間はHHmm形式で入力してください */
export const dlyTime = (value: typeValue) => {
  if (!hasValue(value)) {
    return undefined;
  }
  if (value && value.toString().match(/^([0-9][0-9][0-5][0-9]|[0-9][0-5][0-9]|[0-5][0-9]|[0-9])$/)) {
    return undefined;
  }
  return SoalaMessage.M50014C;
};
/** LEG検索の場合、出発空港コードか到着空港コードのどちらかを入力してください */
export const requiredApoCdPair = (_value: string, allValues: SearchParams | OalSearchParams) => {
  if (allValues && allValues.searchType === "LEG" && !allValues.arrApoCd && !allValues.depApoCd) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};
/** ファイル名は120文字以内にしてください */
export const isOkFileName = (value: typeValue) => {
  if (isOkLengthLessOrEqual(value, 120)) {
    return undefined;
  }
  return SoalaMessage.M50033C;
};
/** 送信された画像の形式が不正です */
export const isOkImageFileFormat = async (value: File) => {
  if (!value.type || !value.type.match(Const.IMAGE_MIMETYPE_REGEX)) {
    return true;
  }
  const arrayBuffer = await new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(value);
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error());
  });
  if (typeof arrayBuffer === "string" || arrayBuffer === null) {
    return true;
  }
  const binaryData = Array.from(new Uint8Array(arrayBuffer));
  let checkArray: number[] = [];
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

export const isExpiryDate = (value: typeValue) => {
  // eslint-disable-next-line prefer-regex-literals
  if (value != null && value.toString().match(new RegExp(/^\d{4}-\d{1,2}-\d{1,2}$/)) !== null) {
    const dayjsDate = getDayjsCalDate(value.toString(), "YYYY-MM-DD");
    if (dayjsDate && dayjsDate.isSameOrBefore(Const.EXPIRY_DATE_MAXIMUM)) {
      return undefined;
    }
  }
  return SoalaMessage.M50014C;
};

export const getFormatFromDateInput = (value: typeValue, format: string): string => {
  if (!value) return "";
  const yyyymmdd = value.toString().split(/[-/]/).join("");
  if (yyyymmdd.length !== 8 || !yyyymmdd.match(/^[0-9]*$/)) return "";
  const date = getDayjsCalDate(yyyymmdd, "YYYYMMDD");
  if (!date) return "";
  return date.format(format);
};

export const isDateOrYYYYMMDD = (value: typeValue) => {
  if (!value) {
    return undefined;
  }
  const yyyymmdd = getFormatFromDateInput(value, "YYYYMMDD");
  if (yyyymmdd) {
    return undefined;
  }
  return SoalaMessage.M50014C;
};

export const isYYMMDD = (value: typeValue) =>
  value != null && value.toString().match(/^\d{6}$/) !== null && getDayjsCalDate(value.toString(), "YYMMDD")
    ? undefined
    : SoalaMessage.M50014C;

export const required = (value: string | string[] | number[] | object | undefined | null) => {
  if (!value) {
    return SoalaMessage.M50016C;
  }
  if (Array.isArray(value)) {
    return value.length < 1 ? SoalaMessage.M50016C : undefined;
  }
  if (typeof value === "object") {
    return isObjectEmpty(value) ? SoalaMessage.M50016C : undefined;
  }
  if (!hasValue(value)) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};

export const multiBoxRequired = (values: Array<string | number>) => (!values.length ? SoalaMessage.M50016C : undefined);

export const isOkEmails = (values: string[] | null = []) => {
  if (values === null) {
    return undefined;
  }
  if (!Array.isArray(values)) {
    return SoalaMessage.M50014C;
  }
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (!isEmailAddress(value)) {
      return SoalaMessage.M50014C;
    }
    if (!isOkLengthLessOrEqual(value, 100)) {
      return SoalaMessage.M50014C;
    }
  }
  return undefined;
};

export const isOkTtyAddresses = (values: string[] | null = []) => {
  if (values === null) {
    return undefined;
  }
  if (!Array.isArray(values)) {
    return SoalaMessage.M50014C;
  }
  for (let i = 0; i < values.length; i++) {
    const message = isOkTtyAddress(values[i]);
    if (message) {
      return SoalaMessage.M50014C;
    }
  }
  return undefined;
};

export const isOkBroadcastTtyAddresses = (values: string[] | null = []) => {
  if (values === null) {
    return undefined;
  }
  if (!Array.isArray(values)) {
    return SoalaMessage.M50014C;
  }
  for (let i = 0; i < values.length; i++) {
    const message = isOkBroadcastTtyAddress(values[i]);
    if (message) {
      return SoalaMessage.M50014C;
    }
  }
  return undefined;
};

export const unique = (values: Array<string | number>) =>
  Array.isArray(values) && [...new Set(values)].length === values.length ? undefined : SoalaMessage.M50014C;

export const isOkUnlimitedTextByte = (value: typeValue) =>
  !(value == null || value === "" || isUnlimitedTextByte(value.toString())) ? SoalaMessage.M50014C : undefined;
export const isOkBBComment = (value: typeValue) =>
  !(value == null || value === "" || isPushTextByte(value.toString())) ? SoalaMessage.M50014C : undefined;
export const isOkBroadcastTty = (value = "") => {
  const removedTtyComment = removeTtyComment(value);
  return !isOnlyHalfWidthTtySymbol(removedTtyComment) || !isTtyTextByte(removedTtyComment || "") ? SoalaMessage.M50014C : undefined;
};
export const isOkBroadcastAcars = (value: string) =>
  !isOnlyUplinkSymbol(value) || !isAcarsTextByte(value) ? SoalaMessage.M50014C : undefined;
export const isOkBroadcastNtf = (value: typeValue) =>
  !(value == null || value === "" || isPushTextByte(value.toString())) ? SoalaMessage.M50014C : undefined;
export const isOkBroadcastTtyAddress = (value = "") =>
  !isOnlyHalfWidth(value) || !isOkLength(value, 7) ? SoalaMessage.M50014C : undefined;

const TTY_MESSAGE_MAX_BYTE = 3427;
const isTtyTextByte = (value: string): boolean => getByte(convertLineFeedCodeToCRLF(value) as string) <= TTY_MESSAGE_MAX_BYTE;

const ACARS_MESSAGE_MAX = 2100;
const isAcarsTextByte = (value: string): boolean => getByte(convertLineFeedCodeToCRLF(value) as string) <= ACARS_MESSAGE_MAX;

const PUSH_MESSAGE_MAX_BYTE = 3200;
const isPushTextByte = (value: string): boolean => getByte(convertLineFeedCodeToCRLF(value) as string) <= PUSH_MESSAGE_MAX_BYTE;

const UNLIMITED_MAX_BYTE = 102400;
const isUnlimitedTextByte = (value: string): boolean => getByte(convertLineFeedCodeToCRLF(value) as string) <= UNLIMITED_MAX_BYTE;

export const isOkAls = (values: string[] | null = []) => {
  if (values === null) {
    return undefined;
  }

  if (!Array.isArray(values)) {
    return SoalaMessage.M50014C;
  }

  for (let i = 0; i < values.length; i++) {
    const result = isOkAl(values[i]);
    if (result) {
      return result;
    }
  }

  return undefined;
};

export const lengthSpots = (values: string[] | null = []) => {
  if (values === null) {
    return undefined;
  }
  for (let i = 0; i < values.length; i++) {
    const result = lengthSpot(values[i]);
    if (result) {
      return result;
    }
  }
  return undefined;
};

export const halfWidthSpots = (values: string[] | null = []) => {
  if (values === null) {
    return undefined;
  }
  for (let i = 0; i < values.length; i++) {
    const result = halfWidthSpot(values[i]);
    if (result) {
      return result;
    }
  }
  return undefined;
};
