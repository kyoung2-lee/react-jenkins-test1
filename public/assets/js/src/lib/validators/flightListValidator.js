"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDateFromDateTo = exports.rangeDateFromDateTo = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const soalaMessages_1 = require("../soalaMessages");
const dateOrder = () => soalaMessages_1.SoalaMessage.M50030C({ errorText: "Date Order" });
// dateFromとdateToの差を確認
const rangeDateFromDateTo = (_value, allValues, props) => {
    const from = (0, dayjs_1.default)(allValues.dateFrom);
    const to = (0, dayjs_1.default)(allValues.dateTo);
    const diffDays = to.diff(from, "day");
    // Code050.num1 以上の場合
    if (diffDays >= props.master.mvtDateRangeLimit) {
        return soalaMessages_1.SoalaMessage.M50032C;
    }
    return undefined;
};
exports.rangeDateFromDateTo = rangeDateFromDateTo;
// dateFromがdateToより未来の場合、dateToがdateFromより過去の場合
const orderDateFromDateTo = (_value, allValues) => {
    const from = (0, dayjs_1.default)(allValues.dateFrom);
    const to = (0, dayjs_1.default)(allValues.dateTo);
    if (from.isAfter(to)) {
        return dateOrder;
    }
    return undefined;
};
exports.orderDateFromDateTo = orderDateFromDateTo;
//# sourceMappingURL=flightListValidator.js.map