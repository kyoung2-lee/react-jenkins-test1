import { SoalaMessage } from "../soalaMessages";
import { convertDDHHmmToDate } from "../commonUtil";
import * as oalFlightScheduleActions from "../../reducers/oalFlightSchedule";
// eslint-disable-next-line import/no-cycle
import { MyProps as SearchProps } from "../../components/molecules/OalFlightSchedule/OalFlightScheduleSearch";
// eslint-disable-next-line import/no-cycle
import { Props as InputModalProps, OalFormValues } from "../../components/molecules/OalFlightSchedule/OalFlightScheduleInputModal";
import * as validates from ".";

/**
 * OalFlightScheduleSearch
 */

/** ALAPO検索の場合、航空会社コードか空港コードのどちらかを入力してください */
export const requiredAlApoCdPair = (_value: string, allValues: oalFlightScheduleActions.OalSearchParams) => {
  if (allValues && allValues.searchType === "ALAPO" && !allValues.alCd && !allValues.apoCd) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};

/** 航空会社コードには自社のコードは入力できない */
export const isOalAlCd = (value: string, _allValues: oalFlightScheduleActions.OalSearchParams, props: SearchProps) => {
  if (props.master.airlines.find((a) => a.alCd === value)) {
    return SoalaMessage.M50014C;
  }
  return undefined;
};

/**
 * OalFlightScheduleInputModal
 */

export const requiredCnxToPair = (_value: string, allValues: OalFormValues) => {
  if (allValues.fltSchedule) {
    if (
      (!allValues.fltSchedule.onwardFltName && allValues.fltSchedule.onwardOrgDate) ||
      (allValues.fltSchedule.onwardFltName && !allValues.fltSchedule.onwardOrgDate)
    ) {
      return SoalaMessage.M50016C;
    }
  }
  return undefined;
};

/** DDHHmmが有効値であるかのチェック */
export const isDDHHmm = (value: string, allValues: OalFormValues) => {
  if (value && allValues.fltSchedule) {
    if (value && value.length !== 6) {
      return SoalaMessage.M50014C;
    }
    if (convertDDHHmmToDate(allValues.fltSchedule.orgDateLcl, value) === null) {
      return SoalaMessage.M50014C;
    }
  }
  return undefined;
};

/** fltの形式であるかのチェック */
export const isOkFlts = (values: string[] | null = []) => {
  if (values === null) {
    return undefined;
  }
  if (!Array.isArray(values)) {
    return SoalaMessage.M50014C;
  }
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const valResult1 = validates.lengthFlt3(value);
    if (valResult1) {
      return valResult1;
    }
    const valResult2 = validates.halfWidthFlt(value);
    if (valResult2) {
      return valResult2;
    }
  }
  return undefined;
};

export const requiredStd = (value: string, allValues: OalFormValues, props: InputModalProps) => {
  const fltInitial = props.initialValues && props.initialValues.fltSchedule;

  // 1-1-1.再就航区間である & 確定区間である & 変更前に値ありの場合：STDの必須チェックを行う
  if (fltInitial && fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && fltInitial.std) {
    if (!value) {
      return SoalaMessage.M50016C;
    }
  }
  // 1-1-2.再就航区間である & 確定区間である & 変更前に値なしの場合：STDもしくはETDがあるかの必須チェックを行う
  if (fltInitial && fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && !fltInitial.std) {
    if (!value && allValues.fltSchedule && !allValues.fltSchedule.etd) {
      return SoalaMessage.M50016C;
    }
  }
  // 1-2-2.再就航区間である & 未確定区間である & 区間削除対象でない場合：STDもしくはETDがあるかの必須チェックを行う
  if (
    fltInitial &&
    fltInitial.rcvFltOrgLegPhySno !== null &&
    !fltInitial.legFixFlg &&
    allValues.fltSchedule &&
    allValues.fltSchedule.chgType !== "DEL LEG"
  ) {
    if (!value && allValues.fltSchedule && !allValues.fltSchedule.etd) {
      return SoalaMessage.M50016C;
    }
  }
  // 2.再就航区間ではない場合：STDの必須チェックを行う
  if (fltInitial && fltInitial.rcvFltOrgLegPhySno === null) {
    if (!value) {
      return SoalaMessage.M50016C;
    }
  }
  return undefined;
};

export const requiredEtd = (value: string, allValues: OalFormValues, props: InputModalProps) => {
  const fltInitial = props.initialValues && props.initialValues.fltSchedule;

  // 1.編集タイプが"RTE SKD"である場合：ETDの必須チェックは行わないため、後続の条件文を飛ばす
  if (allValues.fltSchedule && allValues.fltSchedule.chgType !== "RTE SKD") {
    // 2-1-1.再就航区間である & 確定区間である & 変更前に値ありの場合：ETDの必須チェックを行う
    if (fltInitial && fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && fltInitial.etd) {
      if (!value) {
        return SoalaMessage.M50016C;
      }
    }
    // 2-1-2.再就航区間である & 確定区間である & 変更前に値なし場合：STDもしくはETDがあるかの必須チェックを行う
    if (fltInitial && fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && !fltInitial.etd) {
      if (!value && allValues.fltSchedule && !allValues.fltSchedule.std) {
        return SoalaMessage.M50016C;
      }
    }
    // 2-2-2.再就航区間である & 未確定区間である & 区間削除対象でない場合：STDもしくはETDがあるかの必須チェックを行う
    if (
      fltInitial &&
      fltInitial.rcvFltOrgLegPhySno !== null &&
      !fltInitial.legFixFlg &&
      allValues.fltSchedule &&
      allValues.fltSchedule.chgType !== "DEL LEG"
    ) {
      if (!value && allValues.fltSchedule && !allValues.fltSchedule.std) {
        return SoalaMessage.M50016C;
      }
    }
    // 3-1.再就航区間ではない & 変更前に値ありの場合：ETDの必須チェックを行う
    if (fltInitial && fltInitial.rcvFltOrgLegPhySno === null && fltInitial.etd) {
      if (!value) {
        return SoalaMessage.M50016C;
      }
    }
  }
  return undefined;
};

export const requiredEta = (value: string, allValues: OalFormValues, props: InputModalProps) => {
  const fltInitial = props.initialValues && props.initialValues.fltSchedule;

  // 編集タイプが"RTE SKD"でない & 変更前に値ありの場合：ETAの必須チェックを行う
  if (allValues.fltSchedule && allValues.fltSchedule.chgType !== "RTE SKD" && fltInitial && fltInitial.eta) {
    if (!value) {
      return SoalaMessage.M50016C;
    }
  }

  return undefined;
};
