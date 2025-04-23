"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getfisStsOptions = exports.severErrorItems = void 0;
/**
 * フォームの項目とサーバーから返却されるエラー項目を紐付ける
 * (フォームの項目): [サーバーの項目, ..]
 */
exports.severErrorItems = {
    fisFltSts: ["fisFltSts"],
    irrSts: ["irrSts"],
    "depInfo.etd": ["etdLcl", "tentativeEtdLcl"],
    "depInfo.etdCd": ["tentativeEtdCd"],
    "depInfo.atd": ["atdLcl"],
    "depInfo.depDlyTime1": ["depDlyInfo", "depDlyTime"],
    "depInfo.depDlyTime2": ["depDlyInfo", "depDlyTime"],
    "depInfo.depDlyTime3": ["depDlyInfo", "depDlyTime"],
    // "depInfo.depDlyTime4": ["depDlyInfo", "depDlyTime"],
    "depInfo.depDlyRsnCd1": ["depDlyInfo", "depDlyTimeRsnCd"],
    "depInfo.depDlyRsnCd2": ["depDlyInfo", "depDlyTimeRsnCd"],
    "depInfo.depDlyRsnCd3": ["depDlyInfo", "depDlyTimeRsnCd"],
    // "depInfo.depDlyRsnCd4": ["depDlyInfo", "depDlyTimeRsnCd"],
    "depInfo.toTime": ["actToLcl"],
    "depInfo.estimateReturnIn": ["estReturnInLcl"],
    "depInfo.returnIn": ["returnInLcl"],
    "depInfo.firstBo": ["firstAtdLcl"],
    "arrInfo.eta": ["etaLcl", "tentativeEtaLcl"],
    "arrInfo.etaCd": ["tentativeEtaCd"],
    "arrInfo.etaLd": ["estLdLcl", "tentativeEstLdLcl"],
    "arrInfo.etaLdCd": ["tentativeEstLdCd"],
    "arrInfo.etaLdTaxing": ["estBiLcl"],
    "arrInfo.ldTime": ["actLdLcl"],
    "arrInfo.ata": ["ataLcl"],
    "irrInfo.estLd": ["estLdLcl"],
    "irrInfo.lstArrApoCd": ["lstArrApoCd"],
};
const getfisStsOptions = (fisFltSts, isEmergency, isOal) => {
    let options = [];
    if (isEmergency) {
        options.push({ label: "H/J", value: "H/J" });
    }
    else {
        options.push({ label: "ADV", value: "ADV" }, { label: "DLY", value: "DLY" }, { label: "MNT", value: "MNT" }, { label: "FUL", value: "FUL" }, { label: "DOR", value: "DOR" });
        if (!isOal) {
            options.push({ label: "ENG", value: "ENG" });
        }
        options.push({ label: "APP", value: "APP" }, { label: "G/A", value: "G/A" }, { label: "HLD", value: "HLD" });
    }
    // 現在のステータスを先頭に追加
    options = options.filter((o) => o.value !== fisFltSts);
    options.unshift({ label: fisFltSts || "", value: fisFltSts || "" }); // 選択されるようにfisFltStsがnullの場合は空文字に変換
    // 空白行を追加
    if (!isEmergency && fisFltSts) {
        options.unshift({ label: "", value: "" });
    }
    return options;
};
exports.getfisStsOptions = getfisStsOptions;
//# sourceMappingURL=FlightMovementType.js.map