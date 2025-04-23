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
exports.requiredEta = exports.requiredEtd = exports.requiredStd = exports.isOkFlts = exports.isDDHHmm = exports.requiredCnxToPair = exports.isOalAlCd = exports.requiredAlApoCdPair = void 0;
const soalaMessages_1 = require("../soalaMessages");
const commonUtil_1 = require("../commonUtil");
const validates = __importStar(require("."));
/**
 * OalFlightScheduleSearch
 */
/** ALAPO検索の場合、航空会社コードか空港コードのどちらかを入力してください */
const requiredAlApoCdPair = (_value, allValues) => {
    if (allValues && allValues.searchType === "ALAPO" && !allValues.alCd && !allValues.apoCd) {
        return soalaMessages_1.SoalaMessage.M50016C;
    }
    return undefined;
};
exports.requiredAlApoCdPair = requiredAlApoCdPair;
/** 航空会社コードには自社のコードは入力できない */
const isOalAlCd = (value, _allValues, props) => {
    if (props.master.airlines.find((a) => a.alCd === value)) {
        return soalaMessages_1.SoalaMessage.M50014C;
    }
    return undefined;
};
exports.isOalAlCd = isOalAlCd;
/**
 * OalFlightScheduleInputModal
 */
const requiredCnxToPair = (_value, allValues) => {
    if (allValues.fltSchedule) {
        if ((!allValues.fltSchedule.onwardFltName && allValues.fltSchedule.onwardOrgDate) ||
            (allValues.fltSchedule.onwardFltName && !allValues.fltSchedule.onwardOrgDate)) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    return undefined;
};
exports.requiredCnxToPair = requiredCnxToPair;
/** DDHHmmが有効値であるかのチェック */
const isDDHHmm = (value, allValues) => {
    if (value && allValues.fltSchedule) {
        if (value && value.length !== 6) {
            return soalaMessages_1.SoalaMessage.M50014C;
        }
        if ((0, commonUtil_1.convertDDHHmmToDate)(allValues.fltSchedule.orgDateLcl, value) === null) {
            return soalaMessages_1.SoalaMessage.M50014C;
        }
    }
    return undefined;
};
exports.isDDHHmm = isDDHHmm;
/** fltの形式であるかのチェック */
const isOkFlts = (values = []) => {
    if (values === null) {
        return undefined;
    }
    if (!Array.isArray(values)) {
        return soalaMessages_1.SoalaMessage.M50014C;
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
exports.isOkFlts = isOkFlts;
const requiredStd = (value, allValues, props) => {
    const fltInitial = props.initialValues && props.initialValues.fltSchedule;
    // 1-1-1.再就航区間である & 確定区間である & 変更前に値ありの場合：STDの必須チェックを行う
    if (fltInitial && fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && fltInitial.std) {
        if (!value) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    // 1-1-2.再就航区間である & 確定区間である & 変更前に値なしの場合：STDもしくはETDがあるかの必須チェックを行う
    if (fltInitial && fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && !fltInitial.std) {
        if (!value && allValues.fltSchedule && !allValues.fltSchedule.etd) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    // 1-2-2.再就航区間である & 未確定区間である & 区間削除対象でない場合：STDもしくはETDがあるかの必須チェックを行う
    if (fltInitial &&
        fltInitial.rcvFltOrgLegPhySno !== null &&
        !fltInitial.legFixFlg &&
        allValues.fltSchedule &&
        allValues.fltSchedule.chgType !== "DEL LEG") {
        if (!value && allValues.fltSchedule && !allValues.fltSchedule.etd) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    // 2.再就航区間ではない場合：STDの必須チェックを行う
    if (fltInitial && fltInitial.rcvFltOrgLegPhySno === null) {
        if (!value) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    return undefined;
};
exports.requiredStd = requiredStd;
const requiredEtd = (value, allValues, props) => {
    const fltInitial = props.initialValues && props.initialValues.fltSchedule;
    // 1.編集タイプが"RTE SKD"である場合：ETDの必須チェックは行わないため、後続の条件文を飛ばす
    if (allValues.fltSchedule && allValues.fltSchedule.chgType !== "RTE SKD") {
        // 2-1-1.再就航区間である & 確定区間である & 変更前に値ありの場合：ETDの必須チェックを行う
        if (fltInitial && fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && fltInitial.etd) {
            if (!value) {
                return soalaMessages_1.SoalaMessage.M50016C;
            }
        }
        // 2-1-2.再就航区間である & 確定区間である & 変更前に値なし場合：STDもしくはETDがあるかの必須チェックを行う
        if (fltInitial && fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && !fltInitial.etd) {
            if (!value && allValues.fltSchedule && !allValues.fltSchedule.std) {
                return soalaMessages_1.SoalaMessage.M50016C;
            }
        }
        // 2-2-2.再就航区間である & 未確定区間である & 区間削除対象でない場合：STDもしくはETDがあるかの必須チェックを行う
        if (fltInitial &&
            fltInitial.rcvFltOrgLegPhySno !== null &&
            !fltInitial.legFixFlg &&
            allValues.fltSchedule &&
            allValues.fltSchedule.chgType !== "DEL LEG") {
            if (!value && allValues.fltSchedule && !allValues.fltSchedule.std) {
                return soalaMessages_1.SoalaMessage.M50016C;
            }
        }
        // 3-1.再就航区間ではない & 変更前に値ありの場合：ETDの必須チェックを行う
        if (fltInitial && fltInitial.rcvFltOrgLegPhySno === null && fltInitial.etd) {
            if (!value) {
                return soalaMessages_1.SoalaMessage.M50016C;
            }
        }
    }
    return undefined;
};
exports.requiredEtd = requiredEtd;
const requiredEta = (value, allValues, props) => {
    const fltInitial = props.initialValues && props.initialValues.fltSchedule;
    // 編集タイプが"RTE SKD"でない & 変更前に値ありの場合：ETAの必須チェックを行う
    if (allValues.fltSchedule && allValues.fltSchedule.chgType !== "RTE SKD" && fltInitial && fltInitial.eta) {
        if (!value) {
            return soalaMessages_1.SoalaMessage.M50016C;
        }
    }
    return undefined;
};
exports.requiredEta = requiredEta;
//# sourceMappingURL=oalFlightScheduleValidator.js.map