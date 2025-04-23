import dayjs from "dayjs";
import { SearchParams } from "src/reducers/flightSearch";
import { type MyProps } from "src/components/molecules/FlightSearchForm";
import { SoalaMessage } from "../soalaMessages";

const dateOrder = () => SoalaMessage.M50030C({ errorText: "Date Order" });

// dateFromとdateToの差を確認
export const rangeDateFromDateTo = (_value: string, allValues: SearchParams, props: MyProps) => {
  const from = dayjs(allValues.dateFrom);
  const to = dayjs(allValues.dateTo);
  const diffDays = to.diff(from, "day");
  // Code050.num1 以上の場合
  if (diffDays >= props.master.mvtDateRangeLimit) {
    return SoalaMessage.M50032C;
  }
  return undefined;
};

// dateFromがdateToより未来の場合、dateToがdateFromより過去の場合
export const orderDateFromDateTo = (_value: string, allValues: SearchParams) => {
  const from = dayjs(allValues.dateFrom);
  const to = dayjs(allValues.dateTo);
  if (from.isAfter(to)) {
    return dateOrder;
  }
  return undefined;
};
