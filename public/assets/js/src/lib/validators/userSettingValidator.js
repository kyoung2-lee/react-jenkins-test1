"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicationValusSameRowFlt = exports.duplicationValusSameRowApo = exports.requiredSameRowFlt = exports.requiredSameRowApo = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
const soalaMessages_1 = require("../soalaMessages");
/** 他空港通知設定の同一行をに入力値がある場合、項目を入力してください */
const requiredSameRowApo = (value, allValues, _props, name) => {
    if (value) {
        return undefined;
    }
    const regex = /(?<ntfListType>[a-zA-Z]*)\[\]\[(?<index>\d*)\]\[(?<event>[a-zA-Z]*)\]/gm;
    const macth = regex.exec(name);
    // 対象のFildNameがallValuesに存在するか確認
    if (macth && macth.groups) {
        const { ntfListType, index } = macth.groups;
        // 対象のFildNameがallValuesに存在するか確認
        if (allValues[ntfListType] && allValues[ntfListType][index]) {
            const fields = allValues[ntfListType][index];
            // 対象のFildNameが存在する同一行にデータが存在するか確認
            // データが存在する場合、バリデーションエラーを返却
            const hasValue = Object.keys(fields).some((fieldKey) => !!fields[fieldKey]);
            if (hasValue) {
                return soalaMessages_1.SoalaMessage.M50016C;
            }
        }
    }
    return undefined;
};
exports.requiredSameRowApo = requiredSameRowApo;
/** 便通知設定の同一行をに入力値がある場合、項目を入力してください */
const requiredSameRowFlt = (value, allValues, _props, name) => {
    if (value) {
        return undefined;
    }
    const regex = /(?<ntfListType>[a-zA-Z]*)\[\]\[(?<index>\d*)\]\[(?<event>[a-zA-Z]*)\]/gm;
    const macth = regex.exec(name);
    // 対象のFildNameがallValuesに存在するか確認
    if (macth && macth.groups) {
        const { ntfListType, index, event } = macth.groups;
        // 対象のFildNameがallValuesに存在するか確認
        if (allValues[ntfListType] && allValues[ntfListType][index]) {
            const isApoCd = event === "triggerDep" || event === "triggerArr"; // バリデート検証対象項目が空港コード入力項目か確認
            const fields = allValues[ntfListType][index];
            let hasValue = false;
            // 対象のFildNameが存在する同一行にデータが存在するか確認
            // データが存在する場合、バリデーションエラーを返却
            let hasTriggerApoCd = false;
            Object.keys(fields).forEach((fieldKey) => {
                if (fields[fieldKey]) {
                    // fltNtfListの場合、typeに応じて必須確認する項目を除外する
                    if (fields.type === "FLT" && fieldKey === "triggerArr") {
                        hasValue = false;
                        hasTriggerApoCd = true;
                    }
                    else if (fields.type === "FLT" && fieldKey === "triggerDep") {
                        hasValue = false;
                        hasTriggerApoCd = true;
                    }
                    else if (fields.type === "LEG" && fieldKey === "trigger") {
                        hasValue = false;
                    }
                    else {
                        hasValue = true;
                    }
                    if (isApoCd) {
                        // 空港コード入力項目に値があることの確認
                        if (fields.type === "LEG" && fieldKey === "triggerArr") {
                            hasTriggerApoCd = true;
                        }
                        else if (fields.type === "LEG" && fieldKey === "triggerDep") {
                            hasTriggerApoCd = true;
                        }
                    }
                }
            });
            if (isApoCd && hasValue && !hasTriggerApoCd) {
                return soalaMessages_1.SoalaMessage.M50016C;
            }
            if (!isApoCd && hasValue) {
                return soalaMessages_1.SoalaMessage.M50016C;
            }
        }
    }
    return undefined;
};
exports.requiredSameRowFlt = requiredSameRowFlt;
/** 重複する他空港通知設定内容を設定しないでください */
const duplicationValusSameRowApo = (value, allValues, _props, name) => {
    // 入力値がない場合、チェックをしない
    if (!value) {
        return undefined;
    }
    const regex = /(?<ntfListType>[a-zA-Z]*)\[\]\[(?<index>\d*)\]\[(?<event>[a-zA-Z]*)\]/gm;
    const macth = regex.exec(name);
    // 対象のFildNameがallValuesに存在するか確認
    if (macth && macth.groups) {
        const { ntfListType, index } = macth.groups;
        // 対象のFildNameがallValuesに存在するか確認
        if (allValues[ntfListType] && allValues[ntfListType][index]) {
            // 条件に応じて必要な項目のみを抽出
            const valusString = JSON.stringify(allValues[ntfListType][index]);
            // 対象のFildNameが存在する同一行と全て同じ値があるか確認
            for (let i = 0; i < allValues[ntfListType].length; i++) {
                if (index !== String(i)) {
                    const targetValusString = JSON.stringify(allValues[ntfListType][i]);
                    if (valusString === targetValusString) {
                        return soalaMessages_1.SoalaMessage.M50019C;
                    }
                }
            }
        }
    }
    return undefined;
};
exports.duplicationValusSameRowApo = duplicationValusSameRowApo;
/** 重複する便通知設定内容を設定しないでください */
const duplicationValusSameRowFlt = (value, allValues, _props, name) => {
    // 入力値がない場合、チェックをしない
    if (!value) {
        return undefined;
    }
    const regex = /(?<ntfListType>[a-zA-Z]*)\[\]\[(?<index>\d*)\]\[(?<event>[a-zA-Z]*)\]/gm;
    const macth = regex.exec(name);
    // 対象のFildNameがallValuesに存在するか確認
    if (macth && macth.groups) {
        const { ntfListType, index } = macth.groups;
        // 対象のFildNameがallValuesに存在するか確認
        if (allValues[ntfListType] && allValues[ntfListType][index]) {
            // 条件に応じて必要な項目のみを抽出
            let valusString = "";
            if (allValues[ntfListType].type === "FLT") {
                const { type, trigger, fltEventCode } = allValues[ntfListType][index];
                valusString = JSON.stringify({ type, trigger, fltEventCode });
            }
            else if (allValues[ntfListType].type === "LEG") {
                const { type, triggerDep, triggerArr, legEventCode } = allValues[ntfListType][index];
                valusString = JSON.stringify({ type, triggerDep, triggerArr, legEventCode });
            }
            else {
                valusString = JSON.stringify(allValues[ntfListType][index]);
            }
            // 対象のFildNameが存在する同一行と全て同じ値があるか確認
            for (let i = 0; i < allValues[ntfListType].length; i++) {
                if (index !== String(i)) {
                    let targetValusString = "";
                    // 条件に応じて必要な項目のみを抽出
                    if (allValues[ntfListType].type === "FLT") {
                        const { type, trigger, fltEventCode } = allValues[ntfListType][i];
                        targetValusString = JSON.stringify({ type, trigger, fltEventCode });
                    }
                    else if (allValues[ntfListType].type === "LEG") {
                        const { type, triggerDep, triggerArr, legEventCode } = allValues[ntfListType][i];
                        targetValusString = JSON.stringify({ type, triggerDep, triggerArr, legEventCode });
                    }
                    else {
                        targetValusString = JSON.stringify(allValues[ntfListType][i]);
                    }
                    if (valusString === targetValusString) {
                        return soalaMessages_1.SoalaMessage.M50019C;
                    }
                }
            }
        }
    }
    return undefined;
};
exports.duplicationValusSameRowFlt = duplicationValusSameRowFlt;
//# sourceMappingURL=userSettingValidator.js.map