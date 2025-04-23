import { SoalaMessage } from "../soalaMessages";
import * as validates from ".";

/** 重複チェック */
export const isNoDuplication = (value: string, values: string[]) => values.some((targetValu) => targetValu === value);

/** 重複するmailAddrを入力しないでください */
export const duplicationEmail = (value: string, allValues: unknown, _props: unknown, name: string) => {
  const values = getFromListValu(allValues, "mailAddr", 8, name);
  return values && isNoDuplication(value, values) ? SoalaMessage.M50020C : undefined;
};
/** 重複するmailAddrGrpを入力しないでください */
export const duplicationEmailAddrGrp = (value: string, allValues: unknown, _props: unknown, name: string) => {
  const values = getFromListValu(allValues, "mailAddrGrp", 4, name);
  return values && isNoDuplication(value, values) ? SoalaMessage.M50020C : undefined;
};
/** 重複するttyAddrを入力しないでください */
export const duplicationTtyAddr = (value: string, allValues: unknown, _props: unknown, name: string) => {
  const values = getFromListValu(allValues, "ttyAddr", 8, name);
  return values && isNoDuplication(value, values) ? SoalaMessage.M50020C : undefined;
};
/** 重複するttyAddrGrpを入力しないでください */
export const duplicationTtyAddrGrp = (value: string, allValues: unknown, _props: unknown, name: string) => {
  const values = getFromListValu(allValues, "ttyAddrGrp", 4, name);
  return values && isNoDuplication(value, values) ? SoalaMessage.M50020C : undefined;
};
/** 重複する値を入力しないでください */
export const unique = (value: Array<string | number>, _allValues: unknown, _props: unknown, _name: string) => {
  const valResult = validates.unique(value);
  if (valResult) {
    return SoalaMessage.M50020C;
  }
  return undefined;
};

/** 発令フォームデータから対象の一覧を取得する処理 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFromListValu = (values: any, fieldType: string, length: number, name: string) => {
  const listValue: string[] = [];
  for (let i = 0; i < length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const value = values[`${fieldType}${i + 1}`] as string;
    if (value && name !== `${fieldType}${i + 1}`) {
      listValue.push(value);
    }
  }
  return listValue;
};

/* Email宛先の必須チェック */
export const requireEmailAddress = (_value: unknown, allValues: unknown) =>
  requireAddress(allValues, [{ field: "mailAddrList" }, { field: "mailAddrGrpList" }]);

/* Tty宛先の必須チェック */
export const requireTtyAddress = (_value: unknown, allValues: unknown) =>
  requireAddress(allValues, [{ field: "ttyAddrList" }, { field: "ttyAddrGrpList" }]);

/* Tty宛先の必須チェック共通 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requireAddress = (allValues: any, items: { field: string }[]) => {
  for (let i = 0; i < items.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const value = allValues[`${items[i].field}`] as string;
    if (Array.isArray(value) && value.length > 0) return undefined;
  }
  return SoalaMessage.M50016C;
};

export const isOkEmails = (values: string[] | null = []) => {
  const valResult = validates.isOkEmails(values);
  if (valResult) {
    return SoalaMessage.M50015C;
  }
  return undefined;
};

export const isOkTtyAddresses = (values: string[] | null = []) => {
  const valResult = validates.isOkTtyAddresses(values);
  if (valResult) {
    return SoalaMessage.M50015C;
  }
  return undefined;
};
