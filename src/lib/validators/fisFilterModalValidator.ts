import { SoalaMessage } from "../soalaMessages";
import { SearchParams } from "../../reducers/fisFilterModal";

/** Time Rangeを選択している場合、どちらかの時刻を入力してください */
export const requiredTime = (_value: string, allValues: SearchParams) => {
  if (allValues && allValues.dateTimeRadio && !allValues.dateTimeFrom && !allValues.dateTimeTo) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};
