import dayjs from "dayjs";
import { SoalaMessage } from "../soalaMessages";
import { FormValue, FieldName } from "../../reducers/mvtMsgModal";
// eslint-disable-next-line import/no-cycle
import { MyProps } from "../../components/organisms/MvtMsgModal";
import { isOkLengthOver, isOkLengthLessOrEqual, isOnlyNumber, isOnlyHalfWidth, isTtyAddress, hasValue } from ".";
import { convertDDHHmmToDate, convertLineFeedCodeToCRLF, getByte } from "../commonUtil";

/** DIV先の空港に最新到着空港もしくは予定出発空港を指定した場合エラー */
export const divApo = (value: string, _allValues: FormValue, { mvtMsgModal: { movementInfo } }: MyProps) => {
  const { lstDepApoCd, legKey: { skdArrApoCd = "" } = {} } = movementInfo ?? {};

  if (value === lstDepApoCd || value === skdArrApoCd) {
    return () => SoalaMessage.M50030C({ errorText: "DIV APO" });
  }

  return undefined;
};

/** 出発遅延時間が設定されている場合、出発遅延理由は必須入力 */
export const requiredDepDlyRsnCd = (value: string, allValues: FormValue, _props: MyProps, name: FieldName) => {
  const num = name.match(/\d+/);
  if (num && !value) {
    if (
      (num[0] === "1" && allValues.depInfo.depDlyTime1) ||
      (num[0] === "2" && allValues.depInfo.depDlyTime2) ||
      (num[0] === "3" && allValues.depInfo.depDlyTime3)
    ) {
      return SoalaMessage.M50016C;
    }
  }
  return undefined;
};

/** 出発遅延理由が設定されている場合、出発遅延時間は必須入力 */
export const requiredDepDlyTime = (value: string, allValues: FormValue, _props: MyProps, name: string) => {
  const num = name.match(/\d+/);
  if (num && !value) {
    if (
      (num[0] === "1" && allValues.depInfo.depDlyRsnCd1) ||
      (num[0] === "2" && allValues.depInfo.depDlyRsnCd2) ||
      (num[0] === "3" && allValues.depInfo.depDlyRsnCd3)
    ) {
      return SoalaMessage.M50016C;
    }
  }
  return undefined;
};

/** 到着遅延時間が設定されている場合、到着遅延理由は必須入力 */
export const requiredArrDlyRsnCd = (value: string, allValues: FormValue, _props: MyProps, name: FieldName) => {
  const num = name.match(/\d+/);
  if (num && !value) {
    if (
      (num[0] === "1" && allValues.arrInfo.arrDlyTime1) ||
      (num[0] === "2" && allValues.arrInfo.arrDlyTime2) ||
      (num[0] === "3" && allValues.arrInfo.arrDlyTime3)
    ) {
      return SoalaMessage.M50016C;
    }
  }
  return undefined;
};

/** 到着遅延理由が設定されている場合、到着遅延時間は必須入力 */
export const requiredArrDlyTime = (value: string, allValues: FormValue, _props: MyProps, name: string) => {
  const num = name.match(/\d+/);
  if (num && !value) {
    if (
      (num[0] === "1" && allValues.arrInfo.arrDlyRsnCd1) ||
      (num[0] === "2" && allValues.arrInfo.arrDlyRsnCd2) ||
      (num[0] === "3" && allValues.arrInfo.arrDlyRsnCd3)
    ) {
      return SoalaMessage.M50016C;
    }
  }
  return undefined;
};

/** [運航基準日＋15日後－1ヶ月]、[運航基準日＋14日後] の範囲を取得 */
export const getAvailableDateRange = (orgDate: string): { minDateDayjs: dayjs.Dayjs; maxDateDayjs: dayjs.Dayjs } | null => {
  const minDateDayjs = dayjs(orgDate).add(15, "day").add(-1, "month");
  const maxDateDayjs = dayjs(orgDate).add(14, "day");
  if (minDateDayjs.isValid() && maxDateDayjs.isValid()) {
    return { minDateDayjs, maxDateDayjs };
  }
  return null;
};

/** [運航基準日＋15日後－1ヶ月] ≦ 入力値 ≦ [運航基準日＋14日後] の範囲になければエラー */
export const rangeMovementDate = (value: string, _allValues: FormValue, props: MyProps) => {
  const { movementInfo } = props.mvtMsgModal;
  if (movementInfo && value) {
    const dateDayjs = dayjs(value).hour(0).minute(0).second(0).millisecond(0);
    const dateRange = getAvailableDateRange(movementInfo.legKey.orgDateLcl);
    if (dateDayjs.isValid() && dateRange) {
      if (dateDayjs.isSameOrAfter(dateRange.minDateDayjs) && dateDayjs.isSameOrBefore(dateRange.maxDateDayjs)) {
        return undefined;
      }
    }
    return SoalaMessage.M50032C;
  }
  return undefined;
};

/** STDが設定済かつ[遅延時間1-4の合計] <> [ATD - STD]の場合エラー */
export const matchDepDlyTime = (value: string, allValues: FormValue, _props: MyProps, _name: FieldName) => {
  if (allValues.depInfo.std && allValues.depInfo.atd && allValues.depInfo.std < allValues.depInfo.atd) {
    const moStd = dayjs(allValues.depInfo.std);
    const moAtd = dayjs(allValues.depInfo.atd);
    const diffMinutes = moAtd.diff(moStd, "minute");
    const sumDlyMinutes =
      getMinutesFromHhmm(allValues.depInfo.depDlyTime1) +
      getMinutesFromHhmm(allValues.depInfo.depDlyTime2) +
      getMinutesFromHhmm(allValues.depInfo.depDlyTime3);
    if (value && diffMinutes !== sumDlyMinutes) {
      return () => SoalaMessage.M50030C({ errorText: "DLY Time mismatch" });
    }
  }
  return undefined;
};

/** STAが設定済かつ[遅延時間1-4の合計] <> [ATA - STA]の場合エラー */
export const matchArrDlyTime = (value: string, allValues: FormValue, _props: MyProps, _name: FieldName) => {
  if (allValues.arrInfo.sta && allValues.arrInfo.ata && allValues.arrInfo.sta < allValues.arrInfo.ata) {
    const moSta = dayjs(allValues.arrInfo.sta);
    const moAta = dayjs(allValues.arrInfo.ata);
    const diffMinutes = moAta.diff(moSta, "minute");
    const sumDlyMinutes =
      getMinutesFromHhmm(allValues.arrInfo.arrDlyTime1) +
      getMinutesFromHhmm(allValues.arrInfo.arrDlyTime2) +
      getMinutesFromHhmm(allValues.arrInfo.arrDlyTime3);
    if (value && diffMinutes !== sumDlyMinutes) {
      return () => SoalaMessage.M50030C({ errorText: "DLY Time mismatch" });
    }
  }
  return undefined;
};

/** ATDが設定済かつT/Oが設定済かつ ATD > T/O の場合エラー */
export const orderAtdTo = (_value: string, allValues: FormValue) => {
  if (allValues.depInfo.atd && allValues.depInfo.actTo && allValues.depInfo.atd > allValues.depInfo.actTo) {
    return () => SoalaMessage.M50030C({ errorText: "Time Order" });
  }
  return undefined;
};

/** T/Oが設定済かつL/Dが設定済かつ T/O ≦ L/D でない場合エラー */
export const orderToLd = (_value: string, allValues: FormValue) => {
  if (allValues.depInfo.actTo && allValues.arrInfo.actLd && allValues.depInfo.actTo > allValues.arrInfo.actLd) {
    return () => SoalaMessage.M50030C({ errorText: "Time Order" });
  }
  return undefined;
};

/** L/Dが設定済かつATAが設定済かつ L/D ≦ ATA でない場合エラー */
export const orderLdAta = (_value: string, allValues: FormValue) => {
  if (allValues.arrInfo.actLd && allValues.arrInfo.ata && allValues.arrInfo.actLd > allValues.arrInfo.ata) {
    return () => SoalaMessage.M50030C({ errorText: "Time Order" });
  }
  return undefined;
};

/** fuelRemainが1桁～6桁の半角数字でない場合エラー */
export const isFuelRemain = (value: string) =>
  !(isOkLengthOver(value, 1) && isOkLengthLessOrEqual(value, 6) && isOnlyNumber(value)) ? SoalaMessage.M50014C : undefined;

/** windFactorが‘ P '又は‘ M '＋ 0～300の数字でない場合エラー */
export const isWindFactor = (value: string) => {
  if (!hasValue(value)) return undefined;
  const regex = /^(P|M)\d{1,3}$/;
  if (regex.test(value) && isOnlyHalfWidth(value)) {
    const numberPart = parseInt(value.substring(1), 10);
    if (numberPart >= 0 && numberPart <= 300) {
      return undefined;
    }
  }
  return SoalaMessage.M50014C;
};

/** D.T.G.はDDhhmm形式で入力してください */
export const isDtg = (value: string, _allValues: FormValue, { mvtMsgModal: { movementInfo } }: MyProps) => {
  if (value && value.length !== 6) {
    return SoalaMessage.M50014C;
  }
  // 必須チェックは別で行う為、形式チェックのみ行う
  if (convertDDHHmmToDate(movementInfo?.legKey.orgDateLcl, value) === null) {
    return SoalaMessage.M50014C;
  }
  return undefined;
};

/** TTYアドレスの入力は、半角大文字英字または、./-()のみ利用し、7文字で入力してください */
export const isOkTtyAddress = (value: string) => (!isTtyAddress(value) ? SoalaMessage.M50014C : undefined);

/** REMARKSの入力は、半角大文字英字または、./-() のみ利用し58文字以内で入力してください */
export const isOkTty = (value: string) =>
  !isOnlyHalfWidthTtyRemarksSymbol(value) || !isTtyTextByte(value) ? SoalaMessage.M50014C : undefined;

const MESSAGE_REMARKS_MAX_BYTE = 58;

const isTtyTextByte = (value: string): boolean => getByte(convertLineFeedCodeToCRLF(value) as string) <= MESSAGE_REMARKS_MAX_BYTE;

const isOnlyHalfWidthTtyRemarksSymbol = (value: string) => !!(value == null || value.toString().match(/^[A-Z0-9./\-() ]*$/));

const getMinutesFromHhmm = (value: string) => {
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
