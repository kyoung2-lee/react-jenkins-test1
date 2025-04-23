"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOkTtyAddresses = exports.isOkEmails = exports.requireTtyAddress = exports.requireEmailAddress = exports.unique = exports.duplicationTtyAddrGrp = exports.duplicationTtyAddr = exports.duplicationEmailAddrGrp = exports.duplicationEmail = exports.isNoDuplication = void 0;
const soalaMessages_1 = require("../soalaMessages");
const validates = __importStar(require("."));
/** 重複チェック */
const isNoDuplication = (value, values) => values.some((targetValu) => targetValu === value);
exports.isNoDuplication = isNoDuplication;
/** 重複するmailAddrを入力しないでください */
const duplicationEmail = (value, allValues, _props, name) => {
    const values = getFromListValu(allValues, "mailAddr", 8, name);
    return values && (0, exports.isNoDuplication)(value, values) ? soalaMessages_1.SoalaMessage.M50020C : undefined;
};
exports.duplicationEmail = duplicationEmail;
/** 重複するmailAddrGrpを入力しないでください */
const duplicationEmailAddrGrp = (value, allValues, _props, name) => {
    const values = getFromListValu(allValues, "mailAddrGrp", 4, name);
    return values && (0, exports.isNoDuplication)(value, values) ? soalaMessages_1.SoalaMessage.M50020C : undefined;
};
exports.duplicationEmailAddrGrp = duplicationEmailAddrGrp;
/** 重複するttyAddrを入力しないでください */
const duplicationTtyAddr = (value, allValues, _props, name) => {
    const values = getFromListValu(allValues, "ttyAddr", 8, name);
    return values && (0, exports.isNoDuplication)(value, values) ? soalaMessages_1.SoalaMessage.M50020C : undefined;
};
exports.duplicationTtyAddr = duplicationTtyAddr;
/** 重複するttyAddrGrpを入力しないでください */
const duplicationTtyAddrGrp = (value, allValues, _props, name) => {
    const values = getFromListValu(allValues, "ttyAddrGrp", 4, name);
    return values && (0, exports.isNoDuplication)(value, values) ? soalaMessages_1.SoalaMessage.M50020C : undefined;
};
exports.duplicationTtyAddrGrp = duplicationTtyAddrGrp;
/** 重複する値を入力しないでください */
const unique = (value, _allValues, _props, _name) => {
    const valResult = validates.unique(value);
    if (valResult) {
        return soalaMessages_1.SoalaMessage.M50020C;
    }
    return undefined;
};
exports.unique = unique;
/** 発令フォームデータから対象の一覧を取得する処理 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFromListValu = (values, fieldType, length, name) => {
    const listValue = [];
    for (let i = 0; i < length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const value = values[`${fieldType}${i + 1}`];
        if (value && name !== `${fieldType}${i + 1}`) {
            listValue.push(value);
        }
    }
    return listValue;
};
/* Email宛先の必須チェック */
const requireEmailAddress = (_value, allValues) => requireAddress(allValues, [{ field: "mailAddrList" }, { field: "mailAddrGrpList" }]);
exports.requireEmailAddress = requireEmailAddress;
/* Tty宛先の必須チェック */
const requireTtyAddress = (_value, allValues) => requireAddress(allValues, [{ field: "ttyAddrList" }, { field: "ttyAddrGrpList" }]);
exports.requireTtyAddress = requireTtyAddress;
/* Tty宛先の必須チェック共通 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requireAddress = (allValues, items) => {
    for (let i = 0; i < items.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const value = allValues[`${items[i].field}`];
        if (Array.isArray(value) && value.length > 0)
            return undefined;
    }
    return soalaMessages_1.SoalaMessage.M50016C;
};
const isOkEmails = (values = []) => {
    const valResult = validates.isOkEmails(values);
    if (valResult) {
        return soalaMessages_1.SoalaMessage.M50015C;
    }
    return undefined;
};
exports.isOkEmails = isOkEmails;
const isOkTtyAddresses = (values = []) => {
    const valResult = validates.isOkTtyAddresses(values);
    if (valResult) {
        return soalaMessages_1.SoalaMessage.M50015C;
    }
    return undefined;
};
exports.isOkTtyAddresses = isOkTtyAddresses;
//# sourceMappingURL=issueSecurityValidator.js.map