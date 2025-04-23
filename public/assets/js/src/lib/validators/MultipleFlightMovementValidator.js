"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredEtd = exports.requiredEtaLd = void 0;
const soalaMessages_1 = require("../soalaMessages");
/** ETA(L/D)公開コードが設定されている場合、ETA(L/D)は必須入力 */
const requiredEtaLd = (value, allValues, _props, name) => {
    const match = name.match(/rows\[(\d+)\]/);
    const rowIndex = match ? parseInt(match[1], 10) : null;
    if (!allValues.rows || !allValues.rows.length || rowIndex === null)
        return undefined;
    const row = allValues.rows[rowIndex];
    if (!value && row.arrInfo.etaLdCd) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredEtaLd = requiredEtaLd;
/** ETD公開コードが設定されている場合、ETDは必須入力 */
const requiredEtd = (value, allValues, _props, name) => {
    const match = name.match(/rows\[(\d+)\]/);
    const rowIndex = match ? parseInt(match[1], 10) : null;
    if (!allValues.rows || !allValues.rows.length || rowIndex === null)
        return undefined;
    const row = allValues.rows[rowIndex];
    if (!value && (row.depInfo.etdCd || !row.depInfo.std)) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredEtd = requiredEtd;
//# sourceMappingURL=MultipleFlightMovementValidator.js.map