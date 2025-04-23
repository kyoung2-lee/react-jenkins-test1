"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkStatus = void 0;
const lodash_groupby_1 = __importDefault(require("lodash.groupby"));
const lodash_uniqby_1 = __importDefault(require("lodash.uniqby"));
const toolkit_1 = require("@reduxjs/toolkit");
const dayjs_1 = __importDefault(require("dayjs"));
// eslint-disable-next-line import/no-cycle
const BarChartHighlightOverlay_1 = require("../../molecules/BarCharts/BarChartHighlightOverlay");
var WorkStatus;
(function (WorkStatus) {
    WorkStatus[WorkStatus["waiting"] = 0] = "waiting";
    WorkStatus[WorkStatus["doing"] = 1] = "doing";
    WorkStatus[WorkStatus["done"] = 2] = "done";
})(WorkStatus = exports.WorkStatus || (exports.WorkStatus = {}));
const fisSelector = (state) => state.fis;
const headerInfoSelector = (state) => state.common.headerInfo;
const barChartSelector = (state) => state.barChart;
const barChartSearchSelector = (state) => state.barChartSearch;
const storageOfUserSelector = (state) => state.storageOfUser;
const fisRowsGroupBySpotSelector = (0, toolkit_1.createSelector)([fisSelector, headerInfoSelector, barChartSelector, barChartSearchSelector, storageOfUserSelector], (fis, headerInfo, barChart, barChartSearch, storageOfUser) => {
    const targetDateDayjs = (0, dayjs_1.default)(headerInfo.targetDate);
    const { hiddenSpotNoList } = storageOfUser;
    const filteredFisRows = fis.fisRows
        .filter((f) => !f.isCancel && !f.isDivAtbOrgApo && (f.xtaLcl || f.xtdLcl))
        .map((fisRow) => {
        // 各FisRowのカラム領域を計算する
        const columnStartDayjs = fisRow.xtaLcl
            ? (0, dayjs_1.default)(fisRow.xtaLcl)
            : (0, dayjs_1.default)(fisRow.xtdLcl).subtract(120, "m"); /* 固定で２マスに設定（ブラウザの幅によって変動する） */
        const columnStartIndex = (1 - targetDateDayjs.diff(columnStartDayjs.format("YYYY-MM-DD"), "d")) * 24 + columnStartDayjs.hour();
        const columnStopDayjs = fisRow.xtdLcl
            ? (0, dayjs_1.default)(fisRow.xtdLcl)
            : (0, dayjs_1.default)(fisRow.xtaLcl).add(120, "m"); /* 固定で２マスに設定（ブラウザの幅によって変動する） */
        const columnStopIndex = (1 - targetDateDayjs.diff(columnStopDayjs.format("YYYY-MM-DD"), "d")) * 24 + columnStopDayjs.hour();
        const groundWorkStatus = getGroundWorkStatus(fisRow);
        const zIndex = getZIndex({ groundWorkStatus, headerInfo, fisRow, fis, barChart, barChartSearch });
        // バーの位置、幅の計算に使用
        const minutesOfWidth = (0, dayjs_1.default)(fisRow.xtdLcl).diff((0, dayjs_1.default)(fisRow.xtaLcl), "minute");
        const flightTimeDayjs = (0, dayjs_1.default)(fisRow.xtaLcl || fisRow.xtdLcl);
        const flightDayDiff = 1 - targetDateDayjs.diff((0, dayjs_1.default)([flightTimeDayjs.year(), flightTimeDayjs.month(), flightTimeDayjs.date()]), "d");
        return {
            ...fisRow,
            columnStartIndex,
            columnStopIndex,
            columnStartMinuts: columnStartDayjs.minute(),
            chartRowIndex: 0,
            groundWorkStatus,
            zIndex,
            minutesOfWidth,
            flightTimeDayjs,
            flightDayDiff,
        };
    });
    // Spot一覧の作成
    const fisRowsGroupBySpot = (0, lodash_groupby_1.default)(filteredFisRows.toArray(), (f) => (f.arrDepCtrl.spotNo ? f.arrDepCtrl.spotNo : ""));
    // ///////////////////////////////////
    // spotRemarksListの型に成形し、マージ
    // ///////////////////////////////////
    // 空港SPOT管理マスタで、SPOT非表示フラグが立っているものは除外する
    const visibleSpotRmksList = (fis.spotRmksList || []).filter(({ hideFlg }) => !hideFlg);
    // SPOT非表示フラグが立っている場合にも、登録されているSPOTリマークスは使いたいため、変換表を作って参照できるようにしておく
    const spotNoToSpotRmks = (fis.spotRmksList || []).reduce((s, { spotNo, spotRmks }) => ({ ...s, [spotNo]: spotRmks }), {});
    const groupedSpots = Object.keys(fisRowsGroupBySpot).map((spotNo) => ({
        spotNo,
        dispSeq: null,
        hideFlg: null,
        spotRmks: spotNoToSpotRmks[spotNo] || "",
    }));
    const uniqueSpots = (0, lodash_uniqby_1.default)(visibleSpotRmksList.concat(groupedSpots), "spotNo");
    // SortedSpot[] の型に合わせてセット
    const wSortedSpots = getSortedSpots(uniqueSpots);
    const sortedSpots = wSortedSpots.filter((f) => !hiddenSpotNoList.includes(f.spotNo));
    const spotNoList = wSortedSpots.map((spot) => spot.spotNo);
    const groupedfisRowsBySpot = {};
    sortedSpots.forEach(({ spotNo }, index) => {
        const fisRows = (fisRowsGroupBySpot[spotNo] || []).map((fisRow) => {
            const newFisRow = fisRow;
            newFisRow.chartRowIndex = index;
            return newFisRow;
        });
        groupedfisRowsBySpot[spotNo] = fisRows;
    });
    // ヘッダの日付のラベル
    let headerDateLabel = [];
    if (targetDateDayjs.isValid()) {
        headerDateLabel[0] = targetDateDayjs.clone().subtract(1, "day").format("DDMMM").toUpperCase();
        headerDateLabel[1] = targetDateDayjs.format("DDMMM").toUpperCase();
        headerDateLabel[2] = targetDateDayjs.clone().add(1, "day").format("DDMMM").toUpperCase();
    }
    else {
        headerDateLabel = ["", "", ""];
    }
    const timeLclHours = (0, dayjs_1.default)(fis.timeLcl).hour();
    const timeLclMinutes = (0, dayjs_1.default)(fis.timeLcl).minute();
    const info = {
        headerDateLabel,
        timeLclHours,
        timeLclMinutes,
    };
    const noFisData = Object.keys(fisRowsGroupBySpot).length === 0;
    const filteringSpotNo = hiddenSpotNoList.length > 0;
    return { sortedSpots, groupedfisRowsBySpot, info, spotNoList, noFisData, filteringSpotNo };
});
const getSortedSpots = (fisRowsGroupBySpot) => fisRowsGroupBySpot.slice().sort((a, b) => {
    // 参考：hideFlg=trueのSPOT番号は、この時点で入ってこない
    //       マスタ登録されていないが、存在するものがnullになっている
    const aIndex = a.hideFlg === false && !!a.dispSeq ? a.dispSeq : null;
    const bIndex = b.hideFlg === false && !!b.dispSeq ? b.dispSeq : null;
    if (aIndex !== bIndex) {
        if (!aIndex)
            return 1;
        if (!bIndex)
            return -1;
        return aIndex - bIndex;
    }
    // SPOT番号でソート
    // 未定義の場合は一番下にする
    if (!b.spotNo)
        return -1;
    if (!a.spotNo)
        return 1;
    let aSep = a.spotNo.match(/^(\d+)(.*)/); /* 先頭が数値 */
    if (!aSep) {
        aSep = a.spotNo.match(/^(\D+)(.*)/); /* 先頭が数値以外 */
    }
    let bSep = b.spotNo.match(/^(\d+)(.*)/); /* 先頭が数値 */
    if (!bSep) {
        bSep = b.spotNo.match(/^(\D+)(.*)/); /* 先頭が数値以外 */
    }
    if (!bSep)
        return -1;
    if (!aSep)
        return 1;
    if (aSep[1] && bSep[1]) {
        if (Number(aSep[1]) === Number(bSep[1]) || aSep[1] === bSep[1]) {
            if (aSep[2] && bSep[2]) {
                if (Math.abs(Number(aSep[2])) < Math.abs(Number(bSep[2]))) {
                    return -1;
                }
                if (Math.abs(Number(aSep[2])) > Math.abs(Number(bSep[2]))) {
                    return 1;
                }
                if (aSep[2] < bSep[2]) {
                    return -1;
                }
                if (aSep[2] > bSep[2]) {
                    return 1;
                }
                return 0;
            }
            if (aSep[2] && !bSep[2]) {
                return 1;
            }
            if (!aSep[2] && bSep[2]) {
                return -1;
            }
            return 0;
        }
        if (Number(aSep[1]) < Number(bSep[1])) {
            return -1;
        }
        if (Number(aSep[1]) > Number(bSep[1])) {
            return 1;
        }
        if (aSep[1] < bSep[1]) {
            return -1;
        }
        if (aSep[1] > bSep[1]) {
            return 1;
        }
        return 0;
    }
    if (aSep[1] && !bSep[1]) {
        return -1;
    }
    if (!aSep[1] && bSep[1]) {
        return 1;
    }
    return 0;
});
/**
 * 地上作業の状況を取得する
 * waiting: 作業前、doing: 作業中、done: 作業終了
 */
const getGroundWorkStatus = (fisRow) => {
    if (fisRow.xtdLcl) {
        // 出発便があり、かつT/O済みの場合
        if (fisRow.dep && fisRow.dep.actToLcl) {
            return WorkStatus.done;
        }
        // 到着済または地上作業中の場合
        if (fisRow.arrAtaLcl || fisRow.gndLstTaskSts) {
            return WorkStatus.doing;
        }
        // 出発便なし、かつ到着済の場合
    }
    else if (fisRow.arrAtaLcl) {
        return WorkStatus.done;
    }
    return WorkStatus.waiting;
};
/**
 * 重なりの優先順位付け
 */
const getZIndex = ({ groundWorkStatus, headerInfo, fisRow, fis, barChart, barChartSearch, }) => {
    // DUP選択: 40000番台
    // 作業中: 30000番台
    // 作業開始前: 20000番台
    // 作業終了: 10000番台
    // 現在時刻に近い: 4桁目で現在時間との距離を表現(3日分しか表示しないので4桁は超えない想定)
    let zIndex = 0;
    if (barChartSearch.scrollToScheduleSeq === fisRow.arrDepCtrl.seq) {
        zIndex = BarChartHighlightOverlay_1.HIGHLIGHT_OVERLAY_INDEX + 1;
    }
    else if (barChart.focusArrDepCtrlSeq === fisRow.arrDepCtrl.seq) {
        zIndex = 40000;
    }
    else if (groundWorkStatus === WorkStatus.doing) {
        zIndex = 30000;
    }
    else if (groundWorkStatus === WorkStatus.waiting) {
        zIndex = 20000;
    }
    else {
        // groundWorkStatus === done
        zIndex = 10000;
    }
    // 対象空港の現在日付と表示対象日が違う場合は、現在時刻は考慮しない。
    if ((0, dayjs_1.default)(fis.timeLcl).format("YYYY-MM-DD") !== headerInfo.targetDate)
        return zIndex;
    const currentTime = (0, dayjs_1.default)(headerInfo.targetDate).minute((0, dayjs_1.default)().minute()).hour((0, dayjs_1.default)().hour());
    return zIndex + 9999 - Math.abs(currentTime.diff((0, dayjs_1.default)(fisRow.xtaLcl || fisRow.xtdLcl), "minute"));
};
exports.default = fisRowsGroupBySpotSelector;
//# sourceMappingURL=selector.js.map