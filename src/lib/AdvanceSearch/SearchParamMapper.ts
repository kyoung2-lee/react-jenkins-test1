import { Validator } from "redux-form";
import { FormParams as BulletinBoardFormParam } from "../../components/organisms/BulletinBoard/ThreadFilterModal";
// eslint-disable-next-line import/no-cycle
import { TEMPLATE_FILTER_SEND_BY } from "../../components/organisms/Broadcast/Broadcast";
import { Master } from "../../reducers/account";
import { toUpperCase } from "../commonUtil";
import { Const } from "../commonConst";
import {
  isOnlyHalfWidthSymbol,
  lengthKeyWord30,
  lengthKeyWord100,
  lengthJobCd,
  isDateOrYYYYMMDD,
  getFormatFromDateInput,
} from "../validators";

export namespace SearchParamMapper {
  export interface MappingField {
    default: boolean; // テキスト検索でkey:を必要としない
    searchKey: string;
    defalutValue: unknown; // FormParamのデフォルト値
    validate?: Validator[];
    storeToStringValue?(value: unknown): string;
    restoreToFormValue?(chip: string): unknown;
    formatToRequestValue?(value: unknown): unknown;
  }

  export type Mapper<T extends string | number | symbol> = Record<T, MappingField>;

  /**
   * 情報発信用
   */
  export const getBroadcastMapper = (): Mapper<keyof Broadcast.TemplateFilterConditions> => {
    const getSendByObject = (value?: string) => {
      if (!value) return null;
      const upperValue = toUpperCase(value);
      const sendBy = TEMPLATE_FILTER_SEND_BY.find((s) => toUpperCase(s.label) === upperValue || toUpperCase(s.value) === upperValue);
      return sendBy;
    };

    return {
      keyword: {
        default: true,
        searchKey: "key",
        defalutValue: "",
        validate: [lengthKeyWord100],
      },
      sendBy: {
        default: false,
        searchKey: "by",
        defalutValue: "",
        storeToStringValue: (value?: string) => {
          const sendBy = getSendByObject(value);
          return sendBy ? sendBy.label : "";
        },
        restoreToFormValue: (value?: string) => {
          const sendBy = getSendByObject(value);
          return sendBy ? sendBy.value : "";
        },
        formatToRequestValue: (value?: string) => {
          const sendBy = getSendByObject(value);
          return sendBy ? sendBy.value : "";
        },
      },
    };
  };
  /**
   * 掲示板用
   */
  export const getBulletinBoardMapper = (cdCtrlDtls: Master["cdCtrlDtls"]): Mapper<keyof BulletinBoardFormParam> => {
    const categories = cdCtrlDtls
      .filter((code) => code.cdCls === Const.CodeClass.BULLETIN_BOARD_CATEGORY)
      .map((cat) => ({
        label: cat.txt1,
        value: cat.cdCat1,
      }));

    return {
      keyword: {
        default: true,
        searchKey: "key",
        defalutValue: "",
        validate: [lengthKeyWord30],
      },
      from: {
        default: false,
        searchKey: "from",
        defalutValue: "",
        validate: [lengthJobCd],
        storeToStringValue: (v: string) => (v && isOnlyHalfWidthSymbol(v) ? v.toUpperCase() : ""),
        restoreToFormValue: (v: string) => (v && isOnlyHalfWidthSymbol(v) ? v.toUpperCase() : ""),
        formatToRequestValue: (v: string) => (v && isOnlyHalfWidthSymbol(v) ? v.toUpperCase() : ""),
      },
      to: {
        default: false,
        searchKey: "to",
        defalutValue: "",
        validate: [lengthJobCd],
        storeToStringValue: (v: string) => (v && isOnlyHalfWidthSymbol(v) ? v.toUpperCase() : ""),
        restoreToFormValue: (v: string) => (v && isOnlyHalfWidthSymbol(v) ? v.toUpperCase() : ""),
        formatToRequestValue: (v: string) => (v && isOnlyHalfWidthSymbol(v) ? v.toUpperCase() : ""),
      },
      catCdList: {
        default: false,
        searchKey: "cat",
        defalutValue: [],
        storeToStringValue: (a: Array<{ value: string }> | null) =>
          a
            ? a
                .map((v) => {
                  const category = categories.find((cat) => cat.value === v.value);
                  return category ? category.label.split(" ").join("") : null;
                })
                .filter((v) => v)
                .join(",")
            : "",
        restoreToFormValue: (value?: string): Array<{ value: string } | null> =>
          value
            ? value
                .split(",")
                .map((mapValue) => {
                  if (!mapValue) return null;
                  const category = categories.find((cat) => cat.label.split(" ").join("").toUpperCase() === mapValue.toUpperCase());
                  return category ? { value: category.value } : null;
                })
                .filter((v) => v)
            : [],
        formatToRequestValue: (a: Array<{ value: string }> | null) => (a ? a.map((v) => v.value) : null),
      },
      archiveDateLcl: {
        default: false,
        searchKey: "date",
        defalutValue: "",
        validate: [isDateOrYYYYMMDD],
        storeToStringValue: (value?: string) => getFormatFromDateInput(value, "YYYY/MM/DD"),
        restoreToFormValue: (value?: string) => getFormatFromDateInput(value, "YYYY/MM/DD"),
        formatToRequestValue: (value?: string) => getFormatFromDateInput(value, "YYYY-MM-DD"),
      },
    };
  };
}
