"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredTime = void 0;
const soalaMessages_1 = require("../soalaMessages");
/** Time Rangeを選択している場合、どちらかの時刻を入力してください */
const requiredTime = (_value, allValues) => {
    if (allValues && allValues.dateTimeRadio && !allValues.dateTimeFrom && !allValues.dateTimeTo) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredTime = requiredTime;
//# sourceMappingURL=fisFilterModalValidator.js.map