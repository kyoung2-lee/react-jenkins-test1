"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFlightPaxTo = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const dayjs_1 = __importDefault(require("dayjs"));
const commonUtil_1 = require("../lib/commonUtil");
const webApi_1 = require("../lib/webApi");
const Pax_1 = require("../lib/Pax");
const flightModals_1 = require("./flightModals");
// eslint-disable-next-line import/no-cycle
const flightContents_1 = require("./flightContents");
exports.fetchFlightPaxTo = (0, toolkit_1.createAsyncThunk)("flightContentsFlightPaxTo/fetchFlightPaxTo", async (arg, thunkAPI) => {
    const { flightKey, isReload } = arg;
    const { dispatch, getState } = thunkAPI;
    const { onlineDbExpDays } = getState().account.master;
    const params = {
        orgDateLcl: flightKey.orgDateLcl,
        alCd: flightKey.alCd,
        fltNo: flightKey.fltNo,
        skdDepApoCd: flightKey.skdDepApoCd,
        skdArrApoCd: flightKey.skdArrApoCd,
        skdLegSno: flightKey.skdLegSno,
        onlineDbExpDays,
    };
    const identifier = (0, flightContents_1.getIdentifier)(flightKey);
    dispatch((0, flightContents_1.startFetching)({ identifier }));
    try {
        const response = await webApi_1.WebApi.getFlightPaxTo(dispatch, params);
        const processedState = createPaxToList(response.data);
        dispatch((0, flightContents_1.applyFlightPaxTo)({ flightKey, flightPaxTo: processedState }));
    }
    catch (err) {
        if (!isReload) {
            // 旅客乗継便バーチャート画面表示に失敗した場合、旅客乗継便バーチャート画面を閉じる
            dispatch((0, flightModals_1.closeFlightModalAction)({ identifier }));
            dispatch((0, flightContents_1.removeFlightContent)({ identifier }));
        }
        dispatch((0, flightContents_1.failureFetching)({ identifier }));
    }
});
const createPaxToList = (responseData) => {
    const initialState = {
        flight: responseData.flight,
        connectDbCat: responseData.connectDbCat,
        myFlightArrSpotNo: "",
        myFlightXtaLclDate: "",
        myFlightXtaLclTime: "",
        timeBarOffsetLeft: 0,
        timeLclMillis: 0,
        minTimeMillis: 0,
        timeLclIsInBound: false,
        timeBarIndicators: [],
        ontoData: [],
    };
    const initialOntoDatum = {
        alCd: "",
        fltNo: "",
        depGateNo: "",
        depAptCd: "",
        xtdLclDate: "",
        xtdLclTime: "",
        xtdLclMillis: 0,
        paxLineBarWidth: 0,
        adltAndChlds: 0,
        infts: 0,
        isLazy: false,
        durationAbsoluteTime: "",
        isUnknownXtdLcl: false,
    };
    const dayjsMyFlightXtaLcl = (0, dayjs_1.default)(responseData.paxToHeader.xtaLcl);
    const dayjsTimeLcl = (0, dayjs_1.default)(responseData.timeLcl);
    const timeLclMillis = dayjsTimeLcl.valueOf();
    const minTime = (0, Pax_1.calculatePaxToMinTime)(responseData.paxToHeader.xtaLcl);
    const minTimeMillis = minTime.valueOf();
    // 最小時間 minTime の正時からの経過ミリ秒を取得する
    const minTimeMinSecMillis = minTime.diff(minTime.startOf("hour"));
    let timeLclIsInBound = timeLclMillis >= minTimeMillis;
    timeLclIsInBound = timeLclIsInBound && timeLclMillis <= minTimeMillis + Pax_1.MODAL_DISP_MILLISECONDS;
    const processedState = {
        ...initialState,
        myFlightArrSpotNo: responseData.paxToHeader.arrApoSpotNo,
        myFlightXtaLclDate: (0, commonUtil_1.toUpperCase)(dayjsMyFlightXtaLcl.format("DDMMM")),
        myFlightXtaLclTime: dayjsMyFlightXtaLcl.format("HH:mm"),
        timeBarOffsetLeft: (minTimeMinSecMillis / Pax_1.MODAL_DISP_MILLISECONDS_PER_CELL) * Pax_1.MODAL_MAIN_AREA_CELL_WIDTH,
        timeLclMillis,
        minTimeMillis,
        timeLclIsInBound,
        // 最小時間の分に応じてセルを左にずらすため、時刻文字列の最初は最小時間の正時とする
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timeBarIndicators: [...Array(5)].map((_, index) => minTime.add(index, "hour").format("HH:00")),
    };
    responseData.ontoData.forEach((ontoDatum) => {
        if (ontoDatum.cnlId === "X") {
            return;
        }
        const dayjsXtdLcl = (0, dayjs_1.default)(ontoDatum.xtdLocalTs);
        const isUnknownXtdLcl = !ontoDatum.xtdLocalTs || !dayjsXtdLcl.isValid();
        let xtdLclMillis;
        let paxLineBarWidth;
        let xtdxtaDuration;
        let durationHours;
        let durationMinutes;
        if (!isUnknownXtdLcl) {
            // 飛行機アイコンとその右横の線の、表示領域横幅を取得
            xtdLclMillis = dayjsXtdLcl.valueOf();
            paxLineBarWidth = Pax_1.MODAL_MAIN_AREA_WIDTH - ((xtdLclMillis - minTimeMillis) / Pax_1.MODAL_DISP_MILLISECONDS) * Pax_1.MODAL_MAIN_AREA_WIDTH;
            paxLineBarWidth = Math.min(Math.max(paxLineBarWidth, Pax_1.PAX_FLIGHT_MINIMUM_TO), Pax_1.MODAL_MAIN_AREA_WIDTH);
            const xtdxtaDiff = dayjsXtdLcl.diff(dayjsMyFlightXtaLcl);
            console.log("xtdxtaDiff", xtdxtaDiff);
            xtdxtaDuration = dayjs_1.default.duration(xtdxtaDiff);
            const durationAbs = dayjs_1.default.duration(Math.abs(xtdxtaDiff));
            durationHours =
                durationAbs.asHours() >= 100 ? `${Math.floor(durationAbs.asHours())}` : `00${Math.floor(durationAbs.asHours())}`.slice(-2);
            durationMinutes = `00${durationAbs.minutes()}`.slice(-2);
        }
        else {
            // 飛行機アイコンの表示位置を、飛行機アイコンの中心が自身の表示欄の右から 3 / 4 の位置に合うよう設置する
            paxLineBarWidth = Pax_1.MODAL_MAIN_AREA_CELL_WIDTH * 3 + Pax_1.MODAL_MAIN_AREA_AIRPLANE_WIDTH / 2;
            xtdLclMillis = 0;
            xtdxtaDuration = dayjs_1.default.duration(0);
            durationHours = "00";
            durationMinutes = "00";
        }
        const adltPaxNumbers = Number.isNaN(Number.parseInt(ontoDatum.bordAdltCnt, 10)) ? 0 : Number.parseInt(ontoDatum.bordAdltCnt, 10);
        const chldPaxNumbers = Number.isNaN(Number.parseInt(ontoDatum.bordChldCnt, 10)) ? 0 : Number.parseInt(ontoDatum.bordChldCnt, 10);
        const inftPaxNumbers = Number.isNaN(Number.parseInt(ontoDatum.bordInftCnt, 10)) ? 0 : Number.parseInt(ontoDatum.bordInftCnt, 10);
        const processedOntoDatum = {
            ...initialOntoDatum,
            alCd: ontoDatum.airlineCd,
            fltNo: (0, commonUtil_1.formatFltNo)(ontoDatum.fltSerNo),
            depGateNo: ontoDatum.depGate,
            depAptCd: ontoDatum.depAptCd,
            xtdLclDate: (0, commonUtil_1.toUpperCase)(dayjsXtdLcl.format("DDMMM")),
            xtdLclTime: dayjsXtdLcl.format("HH:mm"),
            xtdLclMillis,
            paxLineBarWidth,
            adltAndChlds: adltPaxNumbers + chldPaxNumbers,
            infts: inftPaxNumbers,
            isLazy: xtdxtaDuration.asMilliseconds() < 0,
            durationAbsoluteTime: `${durationHours}:${durationMinutes}`,
            isUnknownXtdLcl,
        };
        processedState.ontoData = [...processedState.ontoData, processedOntoDatum];
    });
    return processedState;
};
//# sourceMappingURL=flightContentsFlightPaxTo.js.map