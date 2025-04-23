import dayjs from "dayjs";
import { SoalaMessage } from "../soalaMessages";
// eslint-disable-next-line import/no-cycle
import { MyProps, FormValue } from "../../components/organisms/FlightMovementModal/FlightMovementModal";
import { severErrorItems } from "../../components/organisms/FlightMovementModal/FlightMovementType";

type nameType = keyof typeof severErrorItems;
/**
下記条件のいずれかに一致した場合、ATDは必須入力π
・T/Oが設定されている
・IRRステータス="GTB"かつReturn Inが未設定
・STDが未設定の条件下で、遅延情報（出発遅延時間1-3、出発遅延理由1-3）が入力されている
*/
export const requiredATD = (value: string, allValues: FormValue, props: MyProps) => {
  if (props.flightMovementModal.movementInfo) {
    const { irrSts } = props.flightMovementModal.movementInfo;
    if (!value) {
      if (
        allValues.depInfo.toTime ||
        (irrSts === "GTB" && !allValues.depInfo.returnIn) ||
        (!allValues.depInfo.std &&
          ((allValues.depInfo.depDlyTime1 && allValues.depInfo.depDlyRsnCd1) ||
            (allValues.depInfo.depDlyTime2 && allValues.depInfo.depDlyRsnCd2) ||
            (allValues.depInfo.depDlyTime3 && allValues.depInfo.depDlyRsnCd3)))
      ) {
        return SoalaMessage.M50016C;
      }
    }
  }
  return undefined;
};

/** ETD公開コードが設定されている場合、ETDは必須入力 */
export const requiredEtd = (value: string, allValues: FormValue) => {
  if (!value && allValues.depInfo.etdCd) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};

/** ETA公開コードが設定されている場合、ETAは必須入力 */
export const requiredEta = (value: string, allValues: FormValue) => {
  if (!value && allValues.arrInfo.etaCd) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};

/** ETA(L/D)公開コードが設定されている場合、ETA(L/D)は必須入力 */
export const requiredEtaLd = (value: string, allValues: FormValue) => {
  if (!value && allValues.arrInfo.etaLdCd) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};

/** 出発遅延時間が設定されている場合、出発遅延理由は必須入力 */
export const requiredDepDlyRsnCd = (value: string, allValues: FormValue, _props: MyProps, name: nameType) => {
  const num = name.match(/\d+/);
  if (num && !value) {
    if (
      (num[0] === "1" && allValues.depInfo.depDlyTime1) ||
      (num[0] === "2" && allValues.depInfo.depDlyTime2) ||
      (num[0] === "3" && allValues.depInfo.depDlyTime3)
      // || num[0] === "4" && allValues.depInfo.depDlyTime4
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
      // || num[0] === "4" && allValues.depInfo.depDlyRsnCd4
    ) {
      return SoalaMessage.M50016C;
    }
  }
  return undefined;
};

/** ATAが設定されている場合、L/Dは必須入力 */
export const requiredLd = (value: string, allValues: FormValue) => {
  if (!value && allValues.arrInfo.ata) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};

/** STAが設定されていない場合、ETAは必須入力 */
export const requiredEtaWithoutSta = (value: string, allValues: FormValue) => {
  if (!value && !allValues.arrInfo.sta) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};

/** STDが設定されていない場合、ETDは必須入力 */
export const requiredEtdWithoutStd = (value: string, allValues: FormValue) => {
  if (!value && !allValues.depInfo.std) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};

export const requiredReturnIn = (value: string, allValues: FormValue) => {
  if (!value && (allValues.depInfo.toTime || allValues.arrInfo.ldTime || allValues.arrInfo.ata)) {
    return SoalaMessage.M50016C;
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
  const { movementInfo } = props.flightMovementModal;
  if (movementInfo && value) {
    const dateDayjs = dayjs(value).hour(0).minute(0).second(0).millisecond(0);
    const dateRange = getAvailableDateRange(movementInfo.legkey.orgDateLcl);
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
export const matchDepDlyTime = (value: string, allValues: FormValue, _props: MyProps, _name: nameType) => {
  if (allValues.depInfo.std && allValues.depInfo.atd && allValues.depInfo.std < allValues.depInfo.atd) {
    const moStd = dayjs(allValues.depInfo.std);
    const moAtd = dayjs(allValues.depInfo.atd);
    const diffMinuts = moAtd.diff(moStd, "minute");
    const sumDlyMinuts =
      getMinutsFromHhmm(allValues.depInfo.depDlyTime1) +
      getMinutsFromHhmm(allValues.depInfo.depDlyTime2) +
      getMinutsFromHhmm(allValues.depInfo.depDlyTime3);
    // + getMinutsFromHhmm(allValues.depInfo.depDlyTime4);
    if (value && diffMinuts !== sumDlyMinuts) {
      return () => SoalaMessage.M50030C({ errorText: "DLY Time mismatch" });
    }
  }
  return undefined;
};

const getMinutsFromHhmm = (value: string) => {
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
export const orderAtdTo = (_value: string, allValues: FormValue) => {
  if (allValues.depInfo.atd && allValues.depInfo.toTime && allValues.depInfo.atd > allValues.depInfo.toTime) {
    return () => SoalaMessage.M50030C({ errorText: "Time Order" });
  }
  return undefined;
};

/** ReturnIn > T/O の場合エラー */
export const orderReturnInTo = (_value: string, allValues: FormValue) => {
  if (allValues.depInfo.returnIn && allValues.depInfo.toTime && allValues.depInfo.returnIn > allValues.depInfo.toTime) {
    return () => SoalaMessage.M50030C({ errorText: "Time Order" });
  }
  return undefined;
};

/** L/Dが設定済かつATAが設定済かつ L/D > ATA の場合エラー */
export const orderLdAta = (_value: string, allValues: FormValue) => {
  if (allValues.arrInfo.ldTime && allValues.arrInfo.ata && allValues.arrInfo.ldTime > allValues.arrInfo.ata) {
    return () => SoalaMessage.M50030C({ errorText: "Time Order" });
  }
  return undefined;
};
