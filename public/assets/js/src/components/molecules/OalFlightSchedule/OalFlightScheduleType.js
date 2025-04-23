"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFltInfo = exports.getMenuVisible = exports.getListItemEnabled = exports.serverErrorItems = void 0;
exports.serverErrorItems = {
    casFltFlg: ["casFltFlg"],
    fltName: ["alCd", "fltNo", "casFltNo"],
    orgDate: ["orgDateLcl"],
    intDomCat: ["intDomCat"],
    paxCgoCat: ["paxCgoCat"],
    skdlNonskdlCat: ["skdlNonskdlCat"],
    depApoCd: ["depApoCd"],
    arrApoCd: ["arrApoCd"],
    std: ["std"],
    etd: ["etd"],
    sta: ["sta"],
    eta: ["eta"],
    shipTypeIataCd: ["shipTypeIataCd"],
    shipNo: ["shipNo"],
    svcTypeDiaCd: ["svcTypeDiaCd"],
    onwardFltName: ["onwardAlCd", "onwardFltNo"],
    onwardOrgDate: ["onwardOrgDateLcl"],
    hideFlgCd: ["depFisHideFlg", "arrFisHideFlg"],
    csFltNames: ["csList"],
};
const getListItemEnabled = (fltSchedule) => {
    const listItemEnabled = {
        casFltFlg: false,
        fltName: false,
        orgDate: false,
        intDomCat: false,
        paxCgoCat: false,
        skdlNonskdlCat: false,
        depApoCd: false,
        arrApoCd: false,
        std: false,
        etd: false,
        sta: false,
        eta: false,
        shipTypeIataCd: false,
        shipNo: false,
        svcTypeDiaCd: false,
        onward: false,
        hideFlgCd: false,
        csFltNames: false,
        autoFocusColumn: null,
    };
    switch (fltSchedule.chgType) {
        case "SKD TIM":
            listItemEnabled.intDomCat = true;
            listItemEnabled.paxCgoCat = true;
            listItemEnabled.skdlNonskdlCat = true;
            listItemEnabled.std = true;
            listItemEnabled.sta = true;
            listItemEnabled.shipTypeIataCd = true;
            listItemEnabled.shipNo = true;
            listItemEnabled.svcTypeDiaCd = true;
            listItemEnabled.onward = true;
            listItemEnabled.hideFlgCd = true;
            listItemEnabled.csFltNames = true;
            listItemEnabled.autoFocusColumn = fltSchedule.legIndex > 0 ? "std" : "intDomCat";
            break;
        case "RTE SKD":
            listItemEnabled.intDomCat = true;
            listItemEnabled.paxCgoCat = true;
            listItemEnabled.skdlNonskdlCat = true;
            listItemEnabled.depApoCd = true;
            listItemEnabled.arrApoCd = true;
            listItemEnabled.std = true;
            listItemEnabled.sta = true;
            listItemEnabled.shipTypeIataCd = true;
            listItemEnabled.shipNo = true;
            listItemEnabled.svcTypeDiaCd = true;
            listItemEnabled.onward = true;
            listItemEnabled.hideFlgCd = true;
            listItemEnabled.csFltNames = true;
            listItemEnabled.autoFocusColumn = fltSchedule.legIndex > 0 ? "depApoCd" : "intDomCat";
            break;
        case "ADD LEG":
        case "ADD FLT":
            listItemEnabled.casFltFlg = true;
            listItemEnabled.fltName = true;
            listItemEnabled.orgDate = true;
            listItemEnabled.intDomCat = true;
            listItemEnabled.paxCgoCat = true;
            listItemEnabled.skdlNonskdlCat = true;
            listItemEnabled.depApoCd = true;
            listItemEnabled.arrApoCd = true;
            listItemEnabled.std = true;
            listItemEnabled.sta = true;
            listItemEnabled.shipTypeIataCd = true;
            listItemEnabled.shipNo = true;
            listItemEnabled.svcTypeDiaCd = true;
            listItemEnabled.onward = true;
            listItemEnabled.hideFlgCd = true;
            listItemEnabled.csFltNames = true;
            listItemEnabled.autoFocusColumn = fltSchedule.legIndex > 0 ? "depApoCd" : "fltName";
            break;
        case "DEL LEG":
        case "DEL FLT":
            break;
        case "FLT No.":
            listItemEnabled.fltName = true;
            listItemEnabled.autoFocusColumn = "fltName";
            break;
        default:
            listItemEnabled.intDomCat = true;
            listItemEnabled.paxCgoCat = true;
            listItemEnabled.skdlNonskdlCat = true;
            listItemEnabled.etd = true;
            listItemEnabled.eta = true;
            listItemEnabled.shipTypeIataCd = true;
            listItemEnabled.shipNo = true;
            listItemEnabled.svcTypeDiaCd = true;
            listItemEnabled.onward = true;
            listItemEnabled.hideFlgCd = !(fltSchedule.chgType === "CNL" || fltSchedule.chgType === "RIN");
            listItemEnabled.csFltNames = true;
            listItemEnabled.autoFocusColumn = fltSchedule.legIndex > 0 ? "etd" : "intDomCat";
            break;
    }
    // マルチレグの２行目以降
    if (fltSchedule.legIndex > 0) {
        switch (fltSchedule.chgType) {
            case "DEL FLT":
            case "FLT No.":
                break;
            default:
                listItemEnabled.casFltFlg = false;
                listItemEnabled.fltName = false;
                listItemEnabled.orgDate = false;
                listItemEnabled.intDomCat = false;
                listItemEnabled.paxCgoCat = false;
                listItemEnabled.skdlNonskdlCat = false;
                break;
        }
    }
    return listItemEnabled;
};
exports.getListItemEnabled = getListItemEnabled;
const getMenuVisible = (index, fltScheduleList) => {
    const menuVisible = {
        edit: false,
        cnl: false,
        rin: false,
        skdTim: false,
        rteSkd: false,
        undoLeg: false,
        addLeg: false,
        removeLeg: false,
        deleteLeg: false,
        separator: false,
        copy: false,
        fltNo: false,
        undoFlt: false,
        removeFlt: false,
        deleteFlt: false,
        fltEnabled: true,
        cnlEnabled: true,
    };
    const { fltIndex } = fltScheduleList[index];
    const legCnt = fltScheduleList.filter((f) => f.fltIndex === fltIndex).length;
    let dispStatus;
    let editedIndex;
    let hasDispStatus;
    let activeFltIndex;
    switch (fltScheduleList[index].chgType) {
        case "":
            dispStatus = fltScheduleList[index].dispStatus || "";
            editedIndex = fltScheduleList.filter((f) => f.fltIndex === fltIndex).findIndex((f) => f.chgType !== "");
            menuVisible.fltEnabled = editedIndex < 0;
            menuVisible.cnlEnabled = !(fltScheduleList[index].rcvFltOrgLegPhySno !== null && fltScheduleList[index].legFixFlg === false);
            menuVisible.edit = true;
            switch (dispStatus) {
                case "":
                    hasDispStatus = fltScheduleList
                        .filter((f) => f.fltIndex === fltIndex)
                        .some((f) => ["DIV", "ATB", "Actual"].includes(f.dispStatus));
                    menuVisible.cnl = true;
                    menuVisible.skdTim = true;
                    menuVisible.rteSkd = true;
                    menuVisible.addLeg = true;
                    menuVisible.deleteLeg = true;
                    menuVisible.separator = true;
                    menuVisible.copy = true;
                    menuVisible.fltNo = !hasDispStatus;
                    menuVisible.deleteFlt = !hasDispStatus;
                    break;
                case "Actual":
                case "DIV":
                case "ATB":
                    menuVisible.skdTim = true;
                    menuVisible.addLeg = true;
                    menuVisible.separator = true;
                    menuVisible.copy = true;
                    break;
                case "CNL":
                    activeFltIndex = fltScheduleList.findIndex((f) => f.fltIndex === fltIndex && f.dispStatus !== "CNL");
                    if (activeFltIndex >= 0) {
                        menuVisible.rin = true;
                        menuVisible.skdTim = true;
                        menuVisible.addLeg = true;
                        menuVisible.deleteLeg = true;
                        menuVisible.separator = true;
                        menuVisible.copy = true;
                        menuVisible.fltNo = true;
                        menuVisible.deleteFlt = true;
                    }
                    else {
                        menuVisible.rin = true;
                        menuVisible.skdTim = true;
                        menuVisible.deleteLeg = true;
                        menuVisible.separator = true;
                        menuVisible.deleteFlt = true;
                    }
                    break;
                default:
                    break;
            }
            break;
        case "ADD FLT":
            menuVisible.edit = true;
            menuVisible.addLeg = true;
            menuVisible.removeLeg = true;
            menuVisible.separator = true;
            menuVisible.removeFlt = true;
            break;
        case "ADD LEG":
            menuVisible.edit = true;
            menuVisible.removeLeg = true;
            menuVisible.addLeg = true;
            break;
        case "DEL FLT":
            menuVisible.undoFlt = true;
            break;
        case "FLT No.":
            menuVisible.edit = true;
            menuVisible.undoFlt = true;
            break;
        case "CNL":
            menuVisible.edit = true;
            menuVisible.undoLeg = true;
            break;
        case "DEL LEG":
            menuVisible.undoLeg = true;
            menuVisible.addLeg = true;
            break;
        case "Other":
        case "SKD TIM":
        case "RTE SKD":
        case "RIN":
            menuVisible.edit = true;
            menuVisible.undoLeg = true;
            menuVisible.addLeg = true;
            break;
        default:
            break;
    }
    // 区間の最大登録数を20件とする
    if (legCnt >= 20) {
        menuVisible.addLeg = false;
    }
    return menuVisible;
};
exports.getMenuVisible = getMenuVisible;
const getFltInfo = (fltSchedule) => ({
    orgDateLcl: fltSchedule.orgDateLcl,
    alCd: fltSchedule.alCd,
    fltNo: fltSchedule.fltNo,
    casFltNo: fltSchedule.casFltNo,
    casFltFlg: fltSchedule.casFltFlg,
    orgDate: fltSchedule.orgDate,
    fltName: fltSchedule.fltName,
    intDomCat: fltSchedule.intDomCat,
    skdlNonskdlCat: fltSchedule.skdlNonskdlCat,
    paxCgoCat: fltSchedule.paxCgoCat,
});
exports.getFltInfo = getFltInfo;
//# sourceMappingURL=OalFlightScheduleType.js.map