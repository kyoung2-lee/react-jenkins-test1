"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnd = exports.updateStart = exports.initLoadEnd = exports.closeNotice = exports.changeTimeScale = exports.fetchFailureGetMyScheduleFis = exports.fetchFailureUpdateMySchedule = exports.fetchFailureGetMySchedule = exports.fetchSuccessGetMySchedule = exports.fetchSuccessGetDtlSchedule = exports.fetchStartGetMyScheduleFis = exports.fetchStartGetMySchedule = exports.clear = exports.slice = exports.updateMyScheduleInfo = exports.changeActiveDetailTask = exports.getMyScheduleInfo = exports.showInfoNoData = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const dayjs_1 = __importDefault(require("dayjs"));
const isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
const commonConst_1 = require("../lib/commonConst");
const storage_1 = require("../lib/storage");
const webApi_1 = require("../lib/webApi");
const commonUtil_1 = require("../lib/commonUtil");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const common_1 = require("./common");
// dayjsの設定
dayjs_1.default.extend(isBetween_1.default);
const initialState = {
    timeChartState: {
        employeeNumber: "",
        familyName: "",
        firstName: "",
        iataAirport: "",
        workDate: "",
        workStartTime: "",
        workEndTime: "",
        changeNoticeStatus: false,
        changeNotice: "",
        taskInformation: [],
    },
    selectedTaskId: null,
    fisState: null,
    dtlSchedule: {
        taskId: null,
        taskName: "",
        taskStartStatus: false,
        taskEndStatus: false,
        taskClassColor: "",
        taskBackColor: "",
        taskFontColor: "",
        taskStartTime: "",
        taskEndTime: "",
        originDateLocal: "",
        carrierCodeIata: "",
        fltNumber: "",
        casualFltNumber: "",
        skdDepAirportCode: "",
        skdArrAirportCode: "",
        skdLegSerial: 0,
        depArrType: "",
        sameWorkerInformation: [],
        gateNo: "",
        spotNo: "",
    },
    timeScale: storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc ? "8" : "4",
    isShowContent: false,
    isUpdate: false,
    isFetching: false,
};
/**
 * 日時に対し指定時間を加算しxta、xtdと同形式で返す
 */
function getRangeLcl({ targetDate, hours }) {
    if (targetDate && hours !== undefined && hours !== null) {
        // 当時午前０時を取得する
        const apoLcl = (0, dayjs_1.default)(targetDate);
        const baseDate = (0, dayjs_1.default)([apoLcl.year(), apoLcl.month(), apoLcl.date()]);
        if (hours < 0) {
            return baseDate.add(hours, "hours").format("YYYY-MM-DDTHH:mm:ss");
        }
        if (hours > 0) {
            return baseDate.add(1, "days").add(hours, "hours").format("YYYY-MM-DDTHH:mm:ss");
        }
        return baseDate.format("YYYY-MM-DDTHH:mm:ss");
    }
    return "";
}
async function getMyScheduleFis(dispatch, taskInformation, myApoCd, master) {
    try {
        dispatch((0, exports.fetchStartGetMyScheduleFis)());
        let fisState = null;
        let fisRow = null;
        if (taskInformation.originDateLocal &&
            taskInformation.carrierCodeIata &&
            taskInformation.fltNumber &&
            taskInformation.skdArrAirportCode &&
            taskInformation.skdDepAirportCode) {
            // FIS情報取得
            const params = {
                apoCd: myApoCd,
                orgDateLcl: taskInformation.originDateLocal,
                alCd: taskInformation.carrierCodeIata,
                fltNo: taskInformation.fltNumber,
                casFltNo: "",
                skdDepApoCd: taskInformation.skdDepAirportCode,
                skdArrApoCd: taskInformation.skdArrAirportCode,
                skdLegSno: taskInformation.skdLegSerial,
                autoReload: false,
                depArrType: taskInformation.depArrType,
            };
            const response = await webApi_1.WebApi.getMyScheduleFis(dispatch, params);
            const { fis, timeLcl, apoCd, apoDetail } = response.data;
            const timeLclDayjs = (0, dayjs_1.default)(timeLcl);
            if (fis.length > 0) {
                const fisRes = { ...fis[0] };
                const newTargetDate = (0, commonUtil_1.getTimeDateString)(timeLcl, "YYYY-MM-DD");
                let acarsStsList = null;
                let shipNoToAcarsSts = {};
                if (fisRes.arrDepCtrl.shipNo) {
                    try {
                        const responseA = await webApi_1.WebApi.getAcarsStatus(dispatch, {
                            shipNo: fisRes.arrDepCtrl.shipNo,
                        });
                        const acarsData = responseA.data;
                        acarsStsList = acarsData ? acarsData.acars : null;
                        if (acarsStsList) {
                            shipNoToAcarsSts = acarsStsList.reduce((a, { shipNo, acarsSts }) => ({ ...a, [shipNo]: acarsSts }), {});
                        }
                    }
                    catch (err) {
                        if (!(err instanceof webApi_1.ApiError && err.response && err.response.status === 404)) {
                            throw err;
                        }
                    }
                }
                let dispRangeFrom = null;
                let dispRangeTo = null;
                let dispRangeFromLcl = "";
                let dispRangeToLcl = "";
                if (apoDetail) {
                    dispRangeFrom = apoDetail.dispRangeFrom;
                    dispRangeTo = apoDetail.dispRangeTo;
                    dispRangeFromLcl = getRangeLcl({ targetDate: newTargetDate, hours: dispRangeFrom });
                    dispRangeToLcl = getRangeLcl({ targetDate: newTargetDate, hours: dispRangeTo });
                }
                const { depArrType } = taskInformation;
                fisRow = createFisRow(apoCd, fisRes.arrDepCtrl, fisRes.arr, fisRes.dep, dispRangeFromLcl, dispRangeToLcl, master, depArrType);
                fisState = {
                    timeLclDayjs,
                    timeLcl,
                    apoCd,
                    apoDetail,
                    fisRow,
                    depArrType,
                    dispRangeFromLcl,
                    dispRangeToLcl,
                    acarsStsList,
                    shipNoToAcarsSts,
                };
            }
        }
        dispatch((0, exports.fetchSuccessGetDtlSchedule)({
            selectedTaskId: taskInformation.taskId,
            dtlSchedule: {
                ...{
                    ...taskInformation,
                    gateNo: fisRow ? fisRow.gndDepGateNo : "",
                    spotNo: fisRow ? fisRow.gndSpotNo : "",
                },
            },
            fisState,
        }));
    }
    catch (error) {
        dispatch((0, exports.fetchFailureGetMyScheduleFis)());
    }
}
function getSelectTask(taskInformation) {
    let dtlTask;
    // 前回終了時に選択したタスクを選択状態とする。
    if (storage_1.storage.myScheduleSaveTask) {
        dtlTask = taskInformation.find((sdl) => sdl.taskId === storage_1.storage.myScheduleSaveTask);
    }
    // 所属する空港のローカル時刻で「現在日時が含まれる」タスクを選択状態とする。
    if (!dtlTask) {
        dtlTask = taskInformation.find((sdl) => (0, dayjs_1.default)().isBetween(sdl.taskStartTime, sdl.taskEndTime, "minute", "[)"));
    }
    // 「現在日時から開始日時が最も近い未来のタスク」を選択状態とする。
    if (!dtlTask) {
        dtlTask = taskInformation.find((sdl) => (0, dayjs_1.default)().isBefore(sdl.taskStartTime, "minute"));
    }
    // 初回起動時 or 前回終了したタスクが取得したスケジュールに存在しない
    // かつ、既に終了しているタスクしかない場合は、一番後ろのタスクを選択状態とする。
    if (!dtlTask) {
        dtlTask = taskInformation[taskInformation.length - 1];
    }
    return dtlTask;
}
/**
 * JSONからFisRowのデータを生成する
 */
function createFisRow(apoCd, orgArrDepCtrl, orgArr, orgDep, dispRangeFromLcl, dispRangeToLcl, master, depArrType) {
    let isCancel = false;
    let isDivAtbOrgApo = false; // 到着便DIV/ATB（行かなくなった元々の空港） のフラグ
    let orgXtaLcl = "";
    let orgXtdLcl = "";
    let xtaLcl = "";
    let xtdLcl = "";
    let arrFromCat = 0;
    let arrFromAlCd = "";
    let arrFromFltNo = "";
    let arrFromCasFltNo = "";
    let arrFromDateLcl = "";
    let depNextCat = 0;
    let depNextAlCd = "";
    let depNextCasFltNo = "";
    let depNextFltNo = "";
    let depNextDateLcl = "";
    // ////////////////////////////////
    // 元データの編集
    // ////////////////////////////////
    // 元データをコピーしておく
    const arrDepCtrl = { ...orgArrDepCtrl };
    let arr;
    let dep;
    if (orgArr) {
        arr = { ...orgArr };
    }
    if (orgDep) {
        dep = { ...orgDep };
    }
    // 物理シリアル（データが正しければ不要だが）
    if (!arrDepCtrl.arrInfoLegPhySno) {
        arr = undefined;
    }
    if (!arrDepCtrl.depInfoLegPhySno) {
        dep = undefined;
    }
    // FIS非表示フラグがFALSEの場合は便が存在しないものとみなす
    if (arr && arr.fisHideFlg) {
        arr = undefined;
    }
    if (dep && dep.fisHideFlg) {
        dep = undefined;
    }
    // ARRキャンセル便
    if (arr && arr.legCnlFlg) {
        isCancel = true;
        // ATAはないもの（非表示）とみなす
        arr.ataLcl = "";
        // DEPのTowing は非表示にする
        arr.shipNextAlCd = "";
        arr.shipNextFltNo = "";
        arr.shipNextOrgDateLcl = "";
    }
    // DEPキャンセル便
    if (dep && dep.legCnlFlg) {
        isCancel = true;
        // T/O はないもの（非表示）とみなす
        dep.actToLcl = "";
        // ARRのTowing は非表示にする
        dep.shipfromAlCd = "";
        dep.shipfromFltNo = "";
        dep.shipfromOrgDateLcl = "";
    }
    // 到着便DIV/ATB（行かなくなった元々の空港）
    if (arr && (arr.divFlg || arr.atbFlg) && apoCd !== arr.lstArrApoCd) {
        isDivAtbOrgApo = true;
        // ATAはないもの（非表示）とみなす
        arr.ataLcl = "";
        // STAがある場合のみ、ETAおよびL/D はないもの（非表示）とみなす
        if (arr.staLcl) {
            arr.actLdLcl = "";
            arr.estLdLcl = "";
            arr.tentativeEtaLcl = "";
            arr.etaLcl = "";
        }
        // DEP はなしにする
        dep = undefined;
        // DEPのTowing は非表示にする
        arr.shipNextAlCd = "";
        arr.shipNextFltNo = "";
        arr.shipNextOrgDateLcl = "";
    }
    // 到着便DIV/ATB（新たに行く事になった空港）
    if (arr && (arr.divFlg || arr.atbFlg) && apoCd === arr.lstArrApoCd) {
        // STAを非表示にする
        arr.staLcl = "";
    }
    // ARR
    if (arr) {
        // XTA取得
        const { ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl } = arr;
        orgXtaLcl = (0, commonUtil_1.getXtaLcl)({ ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl });
        if (depArrType === "A" || (orgXtaLcl >= dispRangeFromLcl && orgXtaLcl <= dispRangeToLcl)) {
            xtaLcl = orgXtaLcl;
        }
        else {
            // 表示範囲から外れた便は非表示にする
            arrFromCat = 1;
            arrFromAlCd = arr.alCd;
            arrFromFltNo = (0, commonUtil_1.formatFltNo)(arr.fltNo);
            arrFromCasFltNo = arr.casFltNo || "";
            const dateDayjs = (0, dayjs_1.default)(arr.orgDateLcl, "YYYY-MM-DD");
            if (dateDayjs.isValid()) {
                arrFromDateLcl = dateDayjs.format("DDMMM").toUpperCase();
            }
            arr = undefined;
            xtaLcl = "";
        }
    }
    // DEP
    if (dep) {
        // XTD取得
        const { atdLcl, tentativeEtdLcl, etdLcl, stdLcl } = dep;
        orgXtdLcl = (0, commonUtil_1.getXtdLcl)({ atdLcl, tentativeEtdLcl, etdLcl, stdLcl });
        if (depArrType === "D" || (orgXtdLcl >= dispRangeFromLcl && orgXtdLcl <= dispRangeToLcl)) {
            xtdLcl = orgXtdLcl;
        }
        else {
            // 表示範囲から外れた便は非表示にする
            depNextCat = 1;
            depNextAlCd = dep.alCd;
            depNextFltNo = (0, commonUtil_1.formatFltNo)(dep.fltNo);
            depNextCasFltNo = dep.casFltNo || "";
            const dateDayjs = (0, dayjs_1.default)(dep.orgDateLcl, "YYYY-MM-DD");
            if (dateDayjs.isValid()) {
                depNextDateLcl = dateDayjs.format("DDMMM").toUpperCase();
            }
            dep = undefined;
            xtdLcl = "";
        }
    }
    /// ////////////////////////////////
    // FisRowの初期値を設定
    /// ////////////////////////////////
    const fisRow = {
        arrDepCtrl /* ここはオリジナルのデータを保持する(いじってはいけない) */,
        arr: arr
            ? {
                orgDateLcl: arr.orgDateLcl,
                alCd: arr.alCd,
                fltNo: arr.fltNo,
                casFltNo: arr.casFltNo ? arr.casFltNo : "",
                skdDepApoCd: arr.skdDepApoCd,
                skdArrApoCd: arr.skdArrApoCd,
                skdLegSno: arr.skdLegSno,
                lstOrgApoCd: arr.lstOrgApoCd,
                intDomCat: arr.intDomCat,
                ataLcl: arr.ataLcl,
                skdlNonskdlCat: arr.skdlNonskdlCat,
                omAlCd: arr.omAlCd,
                isOal: arr.arrInfoCd === "OA2",
                tentativeEstLdLcl: arr.tentativeEstLdLcl,
                tentativeEstLdCd: arr.tentativeEstLdCd,
                equipment: arr.equipment,
                shipNextCasFltNo: arr.shipNextCasFltNo,
                legCnlFlg: arr.legCnlFlg,
            }
            : null,
        dep: dep
            ? {
                orgDateLcl: dep.orgDateLcl,
                alCd: dep.alCd,
                fltNo: dep.fltNo,
                casFltNo: dep.casFltNo ? dep.casFltNo : "",
                skdDepApoCd: dep.skdDepApoCd,
                skdArrApoCd: dep.skdArrApoCd,
                skdLegSno: dep.skdLegSno,
                lstLasApoCd: dep.lstLasApoCd,
                intDomCat: dep.intDomCat,
                atdLcl: dep.atdLcl,
                actToLcl: dep.actToLcl,
                skdlNonskdlCat: dep.skdlNonskdlCat,
                omAlCd: dep.omAlCd,
                isOal: dep.depInfoCd === "OA2",
                equipment: dep.equipment,
                shipfromCasFltNo: dep.shipfromCasFltNo,
                legCnlFlg: dep.legCnlFlg,
            }
            : null,
        isMask: false,
        isCancel,
        isDivAtbOrgApo,
        sortArrDate: "",
        sortDepDate: "",
        sortGroupNo: 0,
        sortArrGroupNo: 0,
        sortDepGroupNo: 0,
        sortXtaLcl: "",
        sortXtdLcl: "",
        sortArrFlt: "",
        sortDepFlt: "",
        orgXtaLcl,
        orgXtdLcl,
        xtaLcl,
        xtdLcl,
        shipNo: arrDepCtrl.shipNo,
        spotNo: arrDepCtrl.spotNo,
        arrSpecialStsesData: { specialSts: [] },
        arrSpecialStsDly: "",
        arrSpecialStsSpcUpdateTime: null,
        arrFisFltSts: "",
        arrAcarsFlg: false,
        arrRmksText: "",
        arrRmksText_label: "",
        arrStaLcl: "",
        arrAtaLcl: "",
        arrEtaLdLcl: "",
        arrEtaLdLcl_label: "",
        arrEtaCd: "",
        arrInFltSign: false,
        arrAlCd: "",
        arrFltNo: "",
        arrCasFltNo: "",
        arrCsSign: false,
        arrOmAlCd: "",
        arrOrgApoCd: "",
        arrRefPaxTtlCnt: null,
        arrRefPaxTtlCnt_label: "",
        arrFromCat,
        arrFromAlCd,
        arrFromFltNo,
        arrFromCasFltNo,
        arrFromDateLcl,
        arrDlyInfo: [],
        depSpecialStsesData: { specialSts: [] },
        depSpecialStsDly: "",
        depSpecialStsSpcUpdateTime: null,
        depFisFltSts: "",
        depAcarsFlg: false,
        depRmksText: "",
        depRmksText_label: "",
        depStdLcl: "",
        depToLcl: "",
        depEtdAtdLcl: "",
        depEtdAtdLcl_label: "",
        depEtdCd: "",
        depAlCd: "",
        depFltNo: "",
        depCasFltNo: "",
        depCsSign: false,
        depOmAlCd: "",
        depDstApoCd: "",
        depRefPaxTtlCnt: null,
        depRefPaxTtlCnt_label: "",
        depNextCat,
        depNextAlCd,
        depNextFltNo,
        depNextCasFltNo,
        depNextDateLcl,
        depDlyInfo: [],
        gndShipNo1: "",
        gndShipNo2: "",
        gndSeatConfCd: "",
        gndWingletFlg: false,
        gndSpotNo: "",
        gndDepGateNo: "",
        gndDepGateNo_label: "",
        gndWorkStepFlg: false,
        gndLstTaskSts: "",
        boTime: "",
        gndAcceptanceSts: "",
        gndBoardingSts: "",
        gndLsFlg: false,
        gndRampFuelLbsWt: "",
        gndFuelOrderFlg: false,
        dgtShortFlg: false,
        estGndTime: "",
    };
    /// ////////////////////////////////
    // FisRowの編集
    /// ////////////////////////////////
    // マスク
    if ((dep && dep.actToLcl) || (arr && arr.ataLcl && !dep)) {
        fisRow.isMask = true;
    }
    // ARR
    if (arr) {
        // 特別ステータス
        if (arr.specialSts) {
            try {
                fisRow.arrSpecialStsesData = JSON.parse(arr.specialSts); // 特別ステータスのstringをJsonに変換
                // 到着便DIV/ATB（行かなくなった元々の空港）の場合、到着のSPCは非表示にする
                if (isDivAtbOrgApo) {
                    fisRow.arrSpecialStsesData.specialSts = fisRow.arrSpecialStsesData.specialSts.filter((s) => !(s.ntfArrDepCd === "ARR" && s.status === "SPC"));
                }
                // 日跨りDLYのステータスを取得する
                const dly = fisRow.arrSpecialStsesData.specialSts.find((s) => s.ntfArrDepCd === "ARR" && s.level === "-1");
                fisRow.arrSpecialStsDly = dly ? dly.status : "";
                // 到着のSPCの最終更新日時を取得する
                fisRow.arrSpecialStsSpcUpdateTime = fisRow.arrSpecialStsesData.specialSts
                    .filter((s) => s.ntfArrDepCd === "ARR" && s.status === "SPC" && s.updateTimeUtc)
                    .map((s) => dayjs_1.default.utc(s.updateTimeUtc))
                    .reduce((p, c) => (c.isValid() && (!p || c.isAfter(p)) ? c : p), null);
            }
            catch (err) {
                console.error(err, arr.specialSts);
            }
        }
        // FIS Status
        fisRow.arrFisFltSts = arr.fisFltSts;
        // 到着便リマークス
        fisRow.arrRmksText = arr.rmksText;
        fisRow.arrRmksText_label = "Remarks";
        // STA
        if (arr.staLcl) {
            fisRow.arrStaLcl = (0, dayjs_1.default)(arr.staLcl).format("HHmm");
        }
        // ATA
        if (arr.ataLcl) {
            fisRow.arrAtaLcl = (0, dayjs_1.default)(arr.ataLcl).format("HHmm");
        }
        // ETAおよびL/D
        if (arr.actLdLcl) {
            fisRow.arrEtaLdLcl = (0, dayjs_1.default)(arr.actLdLcl).format("HHmm");
            fisRow.arrEtaLdLcl_label = "L/D";
        }
        else if (arr.tentativeEstLdLcl) {
            fisRow.arrEtaLdLcl = (0, dayjs_1.default)(arr.tentativeEstLdLcl).format("HHmm");
            fisRow.arrEtaLdLcl_label = "ETA";
            fisRow.arrEtaCd = arr.tentativeEstLdCd;
        }
        else if (arr.estLdLcl) {
            fisRow.arrEtaLdLcl = (0, dayjs_1.default)(arr.estLdLcl).format("HHmm");
            fisRow.arrEtaLdLcl_label = "ETA";
        }
        else if (arr.tentativeEtaLcl) {
            fisRow.arrEtaLdLcl = (0, dayjs_1.default)(arr.tentativeEtaLcl).format("HHmm");
            fisRow.arrEtaLdLcl_label = "ETA";
            fisRow.arrEtaCd = arr.tentativeEtaCd;
        }
        else if (arr.etaLcl) {
            if (arr.etaLcl === arr.staLcl) {
                fisRow.arrEtaLdLcl = "SKD";
            }
            else {
                fisRow.arrEtaLdLcl = (0, dayjs_1.default)(arr.etaLcl).format("HHmm");
            }
            fisRow.arrEtaLdLcl_label = "ETA";
        }
        // 飛行中フラグ
        if ((arr.estLdLcl || arr.tentativeEstLdLcl) && !arr.actLdLcl) {
            fisRow.arrInFltSign = true;
        }
        // 便名（航空会社コード）
        fisRow.arrAlCd = arr.alCd;
        if (arr.fltNo) {
            fisRow.arrFltNo = (0, commonUtil_1.formatFltNo)(arr.fltNo);
        }
        // 便名（カジュアル便名）
        if (arr.casFltNo) {
            fisRow.arrCasFltNo = arr.casFltNo;
        }
        // 便名（C/Sサイン）
        if (arr.csCnt > 0) {
            fisRow.arrCsSign = true;
        }
        // OMコード
        if (arr.alCd !== arr.omAlCd) {
            fisRow.arrOmAlCd = arr.omAlCd || "";
        }
        // 始発空港
        if (isCancel) {
            fisRow.arrOrgApoCd = arr.lstDepApoCd;
        }
        else {
            fisRow.arrOrgApoCd = arr.lstOrgApoCd;
        }
        // 参照合計旅客数
        if (arr.refPaxTtlCnt !== undefined && arr.refPaxTtlCnt !== null) {
            fisRow.arrRefPaxTtlCnt = arr.refPaxTtlCnt;
            fisRow.arrRefPaxTtlCnt_label = "PAX";
        }
    }
    // DEP
    if (dep) {
        // 特別ステータス
        if (dep.specialSts) {
            try {
                fisRow.depSpecialStsesData = JSON.parse(dep.specialSts); // 特別ステータスのstringをJsonに変換
                // 日跨りDLYのステータスを取得する
                const dly = fisRow.depSpecialStsesData.specialSts.find((s) => s.ntfArrDepCd === "DEP" && s.level === "-1");
                fisRow.depSpecialStsDly = dly ? dly.status : "";
                // 出発のSPCの最終更新日時を取得する
                fisRow.depSpecialStsSpcUpdateTime = fisRow.depSpecialStsesData.specialSts
                    .filter((s) => s.ntfArrDepCd === "DEP" && s.status === "SPC" && s.updateTimeUtc)
                    .map((s) => dayjs_1.default.utc(s.updateTimeUtc))
                    .reduce((p, c) => (c.isValid() && (!p || c.isAfter(p)) ? c : p), null);
            }
            catch (err) {
                console.error(err, dep.specialSts);
            }
        }
        // FIS Status
        fisRow.depFisFltSts = dep.fisFltSts;
        // 出発便リマークス
        fisRow.depRmksText = dep.rmksText;
        fisRow.depRmksText_label = "Remarks";
        // STD
        if (dep.stdLcl) {
            fisRow.depStdLcl = (0, dayjs_1.default)(dep.stdLcl).format("HHmm");
        }
        // T/O
        if (dep.actToLcl) {
            fisRow.depToLcl = (0, dayjs_1.default)(dep.actToLcl).format("HHmm");
        }
        // ETDおよびATD
        if (dep.atdLcl) {
            fisRow.depEtdAtdLcl = (0, dayjs_1.default)(dep.atdLcl).format("HHmm");
            fisRow.depEtdAtdLcl_label = "ATD";
        }
        else if (dep.tentativeEtdLcl) {
            fisRow.depEtdAtdLcl = (0, dayjs_1.default)(dep.tentativeEtdLcl).format("HHmm");
            fisRow.depEtdAtdLcl_label = "ETD";
            fisRow.depEtdCd = dep.tentativeEtdCd;
        }
        else if (dep.etdLcl) {
            if (dep.etdLcl === dep.stdLcl) {
                fisRow.depEtdAtdLcl = "SKD";
            }
            else {
                fisRow.depEtdAtdLcl = (0, dayjs_1.default)(dep.etdLcl).format("HHmm");
            }
            fisRow.depEtdAtdLcl_label = "ETD";
        }
        // 便名（航空会社コード）
        fisRow.depAlCd = dep.alCd;
        if (dep.fltNo) {
            fisRow.depFltNo = (0, commonUtil_1.formatFltNo)(dep.fltNo);
        }
        // 便名（カジュアル便名）
        if (dep.casFltNo) {
            fisRow.depCasFltNo = dep.casFltNo;
        }
        // 便名（C/Sサイン）
        if (dep.csCnt > 0) {
            fisRow.depCsSign = true;
        }
        // OMコード
        if (dep.alCd !== dep.omAlCd) {
            fisRow.depOmAlCd = dep.omAlCd || "";
        }
        // 最終目的空港
        if (isCancel) {
            fisRow.depDstApoCd = dep.lstArrApoCd;
        }
        else {
            fisRow.depDstApoCd = dep.lstLasApoCd;
        }
        // 参照合計旅客数
        if (dep.refPaxTtlCnt !== undefined && dep.refPaxTtlCnt !== null) {
            fisRow.depRefPaxTtlCnt = dep.refPaxTtlCnt;
            fisRow.depRefPaxTtlCnt_label = "PAX";
        }
    }
    // From 表示対象判定（物理シリアルで判断する => 元々紐づいていない時だけ表示する）
    if (dep &&
        !arrDepCtrl.arrInfoLegPhySno &&
        arrDepCtrl.depInfoLegPhySno &&
        arrDepCtrl.arrInfoDispCd &&
        (dep.shipfromAlCd || dep.shipfromCasFltNo)) {
        if (arrDepCtrl.arrInfoDispCd === "APO") {
            fisRow.arrFromCat = -1; // Err(CNX Not Decided)
        }
        else {
            if (arrDepCtrl.arrInfoDispCd === "SPT") {
                fisRow.arrFromCat = 2; // Cross Icon
            }
            else {
                fisRow.arrFromCat = 1; // Nomal
            }
            fisRow.arrFromAlCd = dep.shipfromAlCd;
            fisRow.arrFromFltNo = (0, commonUtil_1.formatFltNo)(dep.shipfromFltNo);
            fisRow.arrFromCasFltNo = dep.shipfromCasFltNo;
            const dateDayjs = (0, dayjs_1.default)(dep.shipfromOrgDateLcl, "YYYY-MM-DD");
            if (dateDayjs.isValid()) {
                fisRow.arrFromDateLcl = dateDayjs.format("DDMMM").toUpperCase();
            }
        }
    }
    // Next 表示対象判定（物理シリアルで判断する => 元々紐づいていない時だけ表示する）
    if (arr &&
        !arrDepCtrl.depInfoLegPhySno &&
        arrDepCtrl.arrInfoLegPhySno &&
        arrDepCtrl.depInfoDispCd &&
        (arr.shipNextAlCd || arr.shipNextCasFltNo)) {
        if (arrDepCtrl.depInfoDispCd === "APO") {
            fisRow.depNextCat = -1; // Err(CNX Not Decided)
        }
        else {
            if (arrDepCtrl.depInfoDispCd === "SPT") {
                fisRow.depNextCat = 2; // Cross Icon
            }
            else {
                fisRow.depNextCat = 1; // Nomal
            }
            fisRow.depNextAlCd = arr.shipNextAlCd;
            fisRow.depNextFltNo = (0, commonUtil_1.formatFltNo)(arr.shipNextFltNo);
            fisRow.depNextCasFltNo = arr.shipNextCasFltNo;
            const dateDayjs = (0, dayjs_1.default)(arr.shipNextOrgDateLcl, "YYYY-MM-DD");
            if (dateDayjs.isValid()) {
                fisRow.depNextDateLcl = dateDayjs.format("DDMMM").toUpperCase();
            }
        }
    }
    // 発着工程（SHIP NO等の四角の枠）
    if (isCancel) {
        fisRow.gndShipNo2 = "------";
        fisRow.gndSeatConfCd = "---";
        // 裏データも変更
        fisRow.shipNo = "";
    }
    else {
        // SHIP NO
        if (arrDepCtrl && arrDepCtrl.shipNo) {
            if (arrDepCtrl.shipNo.slice(0, 2) === "JA") {
                fisRow.gndShipNo1 = arrDepCtrl.shipNo.slice(0, 2);
                fisRow.gndShipNo2 = arrDepCtrl.shipNo.slice(2);
            }
            else {
                fisRow.gndShipNo2 = arrDepCtrl.shipNo;
            }
            // SHIP NOがない場合、EQP(equipment)を格納
        }
        else if (dep && dep.equipment) {
            fisRow.gndShipNo2 = dep.equipment;
        }
        else if (arr && arr.equipment) {
            fisRow.gndShipNo2 = arr.equipment;
        }
        // CONF
        if (((fisRow.arr && fisRow.arr.isOal) || (fisRow.dep && fisRow.dep.isOal)) && arrDepCtrl && arrDepCtrl.shipNo) {
            if (dep && dep.equipment) {
                fisRow.gndSeatConfCd = dep.equipment;
            }
            else if (arr && arr.equipment) {
                fisRow.gndSeatConfCd = arr.equipment;
            }
        }
        else if (arrDepCtrl.depInfoLegPhySno && dep && dep.seatConfCd) {
            fisRow.gndSeatConfCd = dep.seatConfCd;
        }
        else if (arr && arr.seatConfCd) {
            fisRow.gndSeatConfCd = arr.seatConfCd;
        }
        // ウィングレット
        if (dep && dep.wingletFlg !== undefined) {
            fisRow.gndWingletFlg = dep.wingletFlg;
        }
        else if (arr && arr.wingletFlg !== undefined) {
            fisRow.gndWingletFlg = arr.wingletFlg;
        }
    }
    // 発着工程（SHIP NO等 以外）
    if (isCancel || isDivAtbOrgApo) {
        fisRow.gndSpotNo = "-";
        // ゲート番号は出発便が表示されている場合のみ
        if (dep) {
            fisRow.gndDepGateNo_label = "Gate";
            fisRow.gndDepGateNo = "-";
        }
        // 裏データも変更
        fisRow.spotNo = "";
    }
    else {
        // SPOT NO
        if (arrDepCtrl && arrDepCtrl.spotNo) {
            fisRow.gndSpotNo = arrDepCtrl.spotNo;
        }
        // ゲート番号
        if (dep) {
            fisRow.gndDepGateNo_label = "Gate";
            if (dep.depGateNo) {
                fisRow.gndDepGateNo = dep.depGateNo;
            }
        }
        // 作業工程存在フラグ、最新標準作業工程状況、残り時間
        if (dep) {
            fisRow.gndWorkStepFlg = true;
            if (dep.actToLcl) {
                fisRow.gndLstTaskSts = " - ";
                fisRow.boTime = "";
            }
            else {
                // 最初の作業工程が終了していたら時間を表示する
                if (dep.workStep) {
                    const workStep = dep.workStep.filter((w) => w.workEndFlg);
                    if (workStep.length > 0) {
                        fisRow.gndLstTaskSts = workStep[workStep.length - 1].workStepShortName;
                    }
                }
                fisRow.boTime = dep.tentativeEtdLcl ? dep.tentativeEtdLcl : dep.etdLcl ? dep.etdLcl : dep.stdLcl;
            }
        }
        if (dep) {
            // チェックインステータス
            fisRow.gndAcceptanceSts = dep.acceptanceSts;
            // ゲートステータス
            fisRow.gndBoardingSts = dep.boardingSts;
            // ロードシート送信状況
            fisRow.gndLsFlg = dep.lsFlg;
            // 搭載燃料量、FuelOrderフラグ
            if (dep.rampFuelLbsWt) {
                let gndRampFuelLbsWt = Math.ceil(Number(dep.rampFuelLbsWt) / 100);
                if (gndRampFuelLbsWt % 2 === 1) {
                    if (dep.equipment) {
                        // 設定を取得（JALグループ便）
                        if (fisRow.dep && !fisRow.dep.isOal) {
                            // 設定を取得（A350系機種コード）
                            const shipTypeDiaCd = dep.equipment;
                            const isA350 = master.cdCtrlDtls.some((c) => c.cdCls === "020" && c.cdCat1 === shipTypeDiaCd);
                            if (isA350) {
                                gndRampFuelLbsWt += 1;
                            }
                        }
                    }
                }
                fisRow.gndRampFuelLbsWt = gndRampFuelLbsWt.toString();
            }
            fisRow.gndFuelOrderFlg = dep.fuelOrderFlg;
        }
    }
    // ACARSステータス表示フラグ
    if (arrDepCtrl.shipNo && !isCancel && !isDivAtbOrgApo) {
        if (arr && !dep) {
            // 到着便のみの場合
            fisRow.arrAcarsFlg = true;
            fisRow.depAcarsFlg = false;
        }
        else if (!arr && dep) {
            // 出発便のみの場合
            if (!dep.ataLcl) {
                fisRow.arrAcarsFlg = false;
                fisRow.depAcarsFlg = true;
            }
            else {
                fisRow.arrAcarsFlg = false;
                fisRow.depAcarsFlg = false;
            }
        }
        else if (arr && dep) {
            // 到着便・出発便ともにある場合
            if (!arr.ataLcl && !dep.atdLcl && !dep.ataLcl) {
                fisRow.arrAcarsFlg = true;
                fisRow.depAcarsFlg = false;
            }
            else if (arr.ataLcl && !dep.atdLcl && !dep.ataLcl) {
                fisRow.arrAcarsFlg = true;
                fisRow.depAcarsFlg = true;
            }
            else if (dep.atdLcl && !dep.ataLcl) {
                fisRow.arrAcarsFlg = false;
                fisRow.depAcarsFlg = true;
            }
            else {
                fisRow.arrAcarsFlg = false;
                fisRow.depAcarsFlg = false;
            }
        }
    }
    // 予定地上作業時間
    if (!(fisRow.xtaLcl && fisRow.xtdLcl)) {
        // XTA、XTDのいずれかが欠けている場合
        fisRow.estGndTime = "";
    }
    else if (fisRow.dep && fisRow.dep.actToLcl) {
        // 出発便があり、かつT/O済みの場合
        fisRow.estGndTime = "-";
    }
    else {
        const excessTime = (0, commonUtil_1.getExcessTime)(fisRow.xtaLcl, fisRow.xtdLcl, fisRow.arrDepCtrl.gndTime);
        if (excessTime) {
            // DGTショート時
            fisRow.dgtShortFlg = true;
            fisRow.estGndTime = excessTime;
        }
        else {
            // 通常時
            fisRow.estGndTime = (0, commonUtil_1.getGroundTime)(fisRow.xtaLcl, fisRow.xtdLcl);
        }
    }
    /// ////////////////////////////=
    // ソート用項目の編集
    /// ////////////////////////////
    // ソート用日付 Arr
    if (fisRow.xtaLcl) {
        fisRow.sortArrDate = (0, dayjs_1.default)(fisRow.xtaLcl).format("YYYYMMDD");
    }
    else if (fisRow.xtdLcl) {
        fisRow.sortArrDate = (0, dayjs_1.default)(fisRow.xtdLcl).format("YYYYMMDD");
    }
    else {
        fisRow.sortArrDate = "99999999";
    }
    // ソート用日付 Dep
    if (fisRow.xtdLcl) {
        fisRow.sortDepDate = (0, dayjs_1.default)(fisRow.xtdLcl).format("YYYYMMDD");
    }
    else if (fisRow.xtaLcl) {
        fisRow.sortDepDate = (0, dayjs_1.default)(fisRow.xtaLcl).format("YYYYMMDD");
    }
    else {
        fisRow.sortDepDate = "99999999";
    }
    // ARRグループNo
    if (!fisRow.xtaLcl) {
        // ⑤XTAが無い場合
        fisRow.sortArrGroupNo = 5;
    }
    else if (arr) {
        if (arr.legCnlFlg || isDivAtbOrgApo) {
            // ④CNL区間、またはDIV/ATBで来なくなった区間
            fisRow.sortArrGroupNo = 4;
        }
        else if (arr.ataLcl) {
            // ①ATA設定済み
            fisRow.sortArrGroupNo = 1;
        }
        else if (arr.actLdLcl) {
            // ②L/D設定済み
            fisRow.sortArrGroupNo = 2;
        }
        else {
            // ③ETAまたはSTA設定済み
            fisRow.sortArrGroupNo = 3;
        }
    }
    // DEPグループNo
    if (!fisRow.xtdLcl) {
        // ⑤XTDが無い場合
        fisRow.sortDepGroupNo = 5;
    }
    else if (dep) {
        if (dep.legCnlFlg) {
            // ④CNL区間
            fisRow.sortDepGroupNo = 4;
        }
        else if (dep.actToLcl) {
            // ①T/O設定済み
            fisRow.sortDepGroupNo = 1;
        }
        else if (dep.atdLcl) {
            // ②ATD設定済み
            fisRow.sortDepGroupNo = 2;
        }
        else {
            // ③ETDまたはSTD設定済み
            fisRow.sortDepGroupNo = 3;
        }
    }
    // ソート用XTA
    if (fisRow.xtaLcl) {
        fisRow.sortXtaLcl = (0, dayjs_1.default)(fisRow.xtaLcl).format("YYYYMMDDHHmmss");
    }
    else if (fisRow.xtdLcl) {
        fisRow.sortXtaLcl = (0, dayjs_1.default)(fisRow.xtdLcl).format("YYYYMMDDHHmmss");
    }
    else {
        fisRow.sortXtaLcl = "99999999999999";
    }
    // ソート用XTD
    if (fisRow.xtdLcl) {
        fisRow.sortXtdLcl = (0, dayjs_1.default)(fisRow.xtdLcl).format("YYYYMMDDHHmmss");
    }
    else if (fisRow.xtaLcl) {
        fisRow.sortXtdLcl = (0, dayjs_1.default)(fisRow.xtaLcl).format("YYYYMMDDHHmmss");
    }
    else {
        fisRow.sortXtdLcl = "99999999999999";
    }
    // ソート用Arr便名
    if (arr && arr.alCd) {
        fisRow.sortArrFlt = `${arr.alCd} `.slice(0, 3) + arr.fltNo;
    }
    else {
        fisRow.sortArrFlt = "ZZZZZZZ";
    }
    // ソート用Dep便名
    if (dep && dep.alCd) {
        fisRow.sortDepFlt = `${dep.alCd} `.slice(0, 3) + dep.fltNo;
    }
    else {
        fisRow.sortDepFlt = "ZZZZZZZ";
    }
    return fisRow;
}
/**
 * 1. 開始時間（昇順）
 * 2. 終了時間（昇順）
 * 3. タスク名（昇順）
 * にソートする
 *
 * @param mySchedule
 */
function sortMySchedule(mySchedule) {
    mySchedule.sort((a, b) => {
        // 1.開始時間
        if ((0, dayjs_1.default)(a.taskStartTime).isBefore(b.taskStartTime))
            return -1;
        if ((0, dayjs_1.default)(a.taskStartTime).isAfter(b.taskStartTime))
            return 1;
        // 2.終了時間
        if ((0, dayjs_1.default)(a.taskEndTime).isAfter(b.taskEndTime))
            return -1;
        if ((0, dayjs_1.default)(a.taskEndTime).isBefore(b.taskEndTime))
            return 1;
        // 3.タスク名
        if (a.taskName.toString().toLowerCase() > b.taskName.toString().toLowerCase())
            return 1;
        if (a.taskName.toString().toLowerCase() < b.taskName.toString().toLowerCase())
            return -1;
        return 0;
    });
    return mySchedule;
}
function showInfoNoData() {
    return (dispatch) => {
        notifications_1.NotificationCreator.removeAll({ dispatch });
        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30003C() });
    };
}
exports.showInfoNoData = showInfoNoData;
/**
 * My Schedule画面 データ取得
 * @returns
 */
exports.getMyScheduleInfo = (0, toolkit_1.createAsyncThunk)("mySchedule/getMyScheduleInfo", async (_arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    try {
        dispatch((0, exports.fetchStartGetMySchedule)());
        const { master, jobAuth } = getState().account;
        const params = {
            apoCd: jobAuth.user.myApoCd,
        };
        if (params.apoCd) {
            void dispatch((0, common_1.getHeaderInfo)({ apoCd: params.apoCd }));
            const response = await webApi_1.WebApi.getMySchedule(dispatch, params);
            const { staffAssignInformation, commonHeader } = response.data;
            const { taskInformation } = staffAssignInformation;
            if (taskInformation.length === 0 || commonHeader.dataCount === 0) {
                dispatch((0, exports.fetchSuccessGetMySchedule)({ timeChartState: staffAssignInformation }));
                dispatch(showInfoNoData());
            }
            else {
                const newTaskInformation = sortMySchedule(taskInformation.map((data) => data));
                Object.assign(staffAssignInformation, {
                    taskInformation: newTaskInformation,
                });
                dispatch((0, exports.fetchSuccessGetMySchedule)({ timeChartState: staffAssignInformation }));
                await getMyScheduleFis(dispatch, getSelectTask(newTaskInformation), params.apoCd, master);
                dispatch((0, exports.initLoadEnd)());
            }
        }
        else {
            dispatch((0, exports.clear)());
        }
    }
    catch (err) {
        dispatch((0, exports.fetchFailureGetMySchedule)());
        console.log(err);
    }
});
// /**
//  * タスク選択処理
//  * @param taskInformation
//  * @returns
//  */
exports.changeActiveDetailTask = (0, toolkit_1.createAsyncThunk)("mySchedule/changeActiveDetailTask", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { taskInformation } = arg;
    const { master, jobAuth } = getState().account;
    const { myApoCd } = jobAuth.user;
    await getMyScheduleFis(dispatch, taskInformation, myApoCd, master);
});
/**
 * My Schedule更新
 * @param params
 * @returns
 */
exports.updateMyScheduleInfo = (0, toolkit_1.createAsyncThunk)("mySchedule/updateMyScheduleInfo", async (arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { params } = arg;
    try {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await dispatch((0, exports.updateStart)());
        const { master, jobAuth } = getState().account;
        const { myApoCd } = jobAuth.user;
        // MySchedule情報を更新する。
        const response = await webApi_1.WebApi.postMySchedule(dispatch, params);
        const { staffAssignInformation, commonHeader } = response.data;
        const { taskInformation } = staffAssignInformation;
        if (taskInformation.length === 0 || commonHeader.dataCount === 0) {
            dispatch((0, exports.fetchSuccessGetMySchedule)({ timeChartState: staffAssignInformation }));
            dispatch((0, exports.updateEnd)());
            dispatch(showInfoNoData());
        }
        else {
            const newTaskInformation = sortMySchedule(taskInformation.map((data) => data));
            Object.assign(staffAssignInformation, {
                taskInformation: newTaskInformation,
            });
            dispatch((0, exports.fetchSuccessGetMySchedule)({ timeChartState: staffAssignInformation }));
            const updateTask = taskInformation.find((task) => task.taskId === params.taskId);
            // 更新対象タスクがレスポンスからなくなった場合、「前回終了時に選択したタスクが取得したスケジュールにない場合、またはシステム初回起動時」のタスク選択制御とする。
            if (!updateTask) {
                await getMyScheduleFis(dispatch, getSelectTask(newTaskInformation), myApoCd, master);
            }
            else {
                await getMyScheduleFis(dispatch, updateTask, myApoCd, master);
            }
            dispatch((0, exports.updateEnd)());
        }
    }
    catch (error) {
        console.error(error);
        dispatch((0, exports.fetchFailureUpdateMySchedule)());
    }
});
exports.slice = (0, toolkit_1.createSlice)({
    name: "mySchedule",
    initialState,
    reducers: {
        clear: (state) => {
            storage_1.storage.myScheduleSaveTask = undefined;
            Object.assign(state, initialState);
        },
        fetchStartGetMySchedule: (state) => {
            Object.assign(state, {
                isFetching: true,
            });
        },
        fetchStartGetMyScheduleFis: (state) => {
            Object.assign(state, {
                isFetching: true,
            });
        },
        fetchSuccessGetDtlSchedule: (state, action) => {
            Object.assign(state, {
                selectedTaskId: action.payload.selectedTaskId,
                dtlSchedule: {
                    ...state.dtlSchedule,
                    ...action.payload.dtlSchedule,
                },
                fisState: action.payload.fisState,
                isFetching: false,
            });
        },
        fetchSuccessGetMySchedule: (state, action) => {
            if (action.payload.timeChartState.taskInformation.length === 0) {
                Object.assign(state, {
                    timeChartState: {
                        ...state.timeChartState,
                        ...action.payload.timeChartState,
                    },
                    fisState: initialState.fisState,
                    dtlSchedule: initialState.dtlSchedule,
                    selectedTaskId: initialState.selectedTaskId,
                    isShowContent: false,
                    isFetching: false,
                });
            }
            else {
                Object.assign(state, {
                    timeChartState: {
                        ...action.payload.timeChartState,
                        taskInformation: action.payload.timeChartState.taskInformation,
                    },
                    isFetching: false,
                });
            }
        },
        fetchFailureGetMySchedule: (state) => {
            Object.assign(state, {
                isFetching: false,
            });
        },
        fetchFailureUpdateMySchedule: (state) => {
            Object.assign(state, {
                isUpdate: false,
                isFetching: false,
            });
        },
        fetchFailureGetMyScheduleFis: (state) => {
            Object.assign(state, {
                isUpdate: false,
                isFetching: false,
            });
        },
        changeTimeScale: (state, action) => {
            Object.assign(state, {
                timeScale: action.payload.timeScale,
            });
        },
        closeNotice: (state) => {
            Object.assign(state, {
                timeChartState: {
                    ...state.timeChartState,
                    changeNoticeStatus: false,
                },
            });
        },
        initLoadEnd: (state) => {
            Object.assign(state, {
                isShowContent: true,
            });
        },
        updateStart: (state) => {
            Object.assign(state, {
                isUpdate: true,
            });
        },
        updateEnd: (state) => {
            Object.assign(state, {
                isUpdate: false,
            });
        },
    },
});
_a = exports.slice.actions, exports.clear = _a.clear, exports.fetchStartGetMySchedule = _a.fetchStartGetMySchedule, exports.fetchStartGetMyScheduleFis = _a.fetchStartGetMyScheduleFis, exports.fetchSuccessGetDtlSchedule = _a.fetchSuccessGetDtlSchedule, exports.fetchSuccessGetMySchedule = _a.fetchSuccessGetMySchedule, exports.fetchFailureGetMySchedule = _a.fetchFailureGetMySchedule, exports.fetchFailureUpdateMySchedule = _a.fetchFailureUpdateMySchedule, exports.fetchFailureGetMyScheduleFis = _a.fetchFailureGetMyScheduleFis, exports.changeTimeScale = _a.changeTimeScale, exports.closeNotice = _a.closeNotice, exports.initLoadEnd = _a.initLoadEnd, exports.updateStart = _a.updateStart, exports.updateEnd = _a.updateEnd;
exports.default = exports.slice.reducer;
//# sourceMappingURL=mySchedule.js.map