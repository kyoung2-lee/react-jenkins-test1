"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFlightPaxFrom = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const dayjs_1 = __importDefault(require("dayjs"));
const commonUtil_1 = require("../lib/commonUtil");
const webApi_1 = require("../lib/webApi");
const Pax_1 = require("../lib/Pax");
const flightModals_1 = require("./flightModals");
// eslint-disable-next-line import/no-cycle
const flightContents_1 = require("./flightContents");
exports.fetchFlightPaxFrom = (0, toolkit_1.createAsyncThunk)("flightContentsFlightPaxFrom/fetchFlightPaxFrom", async (arg, thunkAPI) => {
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
        const response = await webApi_1.WebApi.getFlightPaxFrom(dispatch, params);
        const processedState = createPaxFromList(response.data);
        dispatch((0, flightContents_1.applyFlightPaxFrom)({ flightKey, flightPaxFrom: processedState }));
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
const createPaxFromList = (responseData) => {
    const initialState = {
        flight: responseData.flight,
        connectDbCat: responseData.connectDbCat,
        myFlightDepGateNo: "",
        myFlightXtdLclDate: "",
        myFlightXtdLclTime: "",
        timeBarOffsetLeft: 0,
        timeLclMillis: 0,
        minTimeMillis: 0,
        timeLclIsInBound: false,
        timeBarIndicators: [],
        intoData: [],
    };
    const initialIntoDatum = {
        alCd: "",
        fltNo: "",
        arrSpotNo: "",
        arrAptCd: "",
        xtaLclDate: "",
        xtaLclTime: "",
        xtaLclMillis: 0,
        paxLineBarWidth: 0,
        adltAndChlds: 0,
        infts: 0,
        isLazy: false,
        durationAbsoluteTime: "",
        isUnknownXtaLcl: false,
    };
    const dayjsMyFlightXtdLcl = (0, dayjs_1.default)(responseData.paxFromHeader.xtdLcl);
    const dayjsTimeLcl = (0, dayjs_1.default)(responseData.timeLcl);
    const timeLclMillis = dayjsTimeLcl.valueOf();
    const minTime = (0, Pax_1.calculatePaxFromMinTime)(responseData.paxFromHeader.xtdLcl);
    const minTimeMillis = minTime.valueOf();
    // 最小時間 minTime の正時からの経過ミリ秒を取得する
    const minTimeMinSecMillis = minTime.diff(minTime.startOf("hour"));
    let timeLclIsInBound = timeLclMillis >= minTimeMillis;
    timeLclIsInBound = timeLclIsInBound && timeLclMillis <= minTimeMillis + Pax_1.MODAL_DISP_MILLISECONDS;
    const processedState = {
        ...initialState,
        myFlightDepGateNo: responseData.paxFromHeader.depGateNo,
        myFlightXtdLclDate: (0, commonUtil_1.toUpperCase)(dayjsMyFlightXtdLcl.format("DDMMM")),
        myFlightXtdLclTime: dayjsMyFlightXtdLcl.format("HH:mm"),
        timeBarOffsetLeft: (minTimeMinSecMillis / Pax_1.MODAL_DISP_MILLISECONDS_PER_CELL) * Pax_1.MODAL_MAIN_AREA_CELL_WIDTH,
        timeLclMillis,
        minTimeMillis,
        timeLclIsInBound,
        // 最小時間の分に応じてセルを左にずらすため、時刻文字列の最初は最小時間の正時とする
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timeBarIndicators: [...Array(5)].map((_, index) => minTime.add(index, "hour").format("HH:00")),
    };
    responseData.intoData.forEach((intoDatum) => {
        if (intoDatum.cnlId === "X") {
            return;
        }
        const dayjsXtaLcl = (0, dayjs_1.default)(intoDatum.xtaLocalTs);
        const isUnknownXtaLcl = !intoDatum.xtaLocalTs || !dayjsXtaLcl.isValid();
        let xtaLclMillis;
        let paxLineBarWidth;
        let xtdxtaDuration;
        let durationHours;
        let durationMinutes;
        if (!isUnknownXtaLcl) {
            // 飛行機アイコンとその左横の線の、表示領域横幅を取得
            xtaLclMillis = dayjsXtaLcl.valueOf();
            paxLineBarWidth = ((xtaLclMillis - minTimeMillis) / Pax_1.MODAL_DISP_MILLISECONDS) * Pax_1.MODAL_MAIN_AREA_WIDTH;
            paxLineBarWidth = Math.min(Math.max(paxLineBarWidth, Pax_1.PAX_FLIGHT_MINIMUM_FROM), Pax_1.MODAL_MAIN_AREA_WIDTH);
            const xtdxtaDiff = dayjsMyFlightXtdLcl.diff(dayjsXtaLcl);
            xtdxtaDuration = dayjs_1.default.duration(xtdxtaDiff);
            const durationAbs = dayjs_1.default.duration(Math.abs(xtdxtaDiff));
            durationHours =
                durationAbs.asHours() >= 100 ? `${Math.floor(durationAbs.asHours())}` : `00${Math.floor(durationAbs.asHours())}`.slice(-2);
            durationMinutes = `00${durationAbs.minutes()}`.slice(-2);
        }
        else {
            // 飛行機アイコンの表示位置を、飛行機アイコンの中心が自身の表示欄の左から 3 / 4 の位置に合うよう設置する
            paxLineBarWidth = Pax_1.MODAL_MAIN_AREA_CELL_WIDTH * 3 + Pax_1.MODAL_MAIN_AREA_AIRPLANE_WIDTH / 2;
            xtaLclMillis = 0;
            xtdxtaDuration = dayjs_1.default.duration(0);
            durationHours = "00";
            durationMinutes = "00";
        }
        const adltPaxNumbers = Number.isNaN(Number.parseInt(intoDatum.bordAdltCnt, 10)) ? 0 : Number.parseInt(intoDatum.bordAdltCnt, 10);
        const chldPaxNumbers = Number.isNaN(Number.parseInt(intoDatum.bordChldCnt, 10)) ? 0 : Number.parseInt(intoDatum.bordChldCnt, 10);
        const inftPaxNumbers = Number.isNaN(Number.parseInt(intoDatum.bordInftCnt, 10)) ? 0 : Number.parseInt(intoDatum.bordInftCnt, 10);
        const processedIntoDatum = {
            ...initialIntoDatum,
            alCd: intoDatum.airlineCd,
            fltNo: (0, commonUtil_1.formatFltNo)(intoDatum.fltSerNo),
            arrSpotNo: intoDatum.actArrSpot,
            arrAptCd: intoDatum.arrAptCd,
            xtaLclDate: (0, commonUtil_1.toUpperCase)(dayjsXtaLcl.format("DDMMM")),
            xtaLclTime: dayjsXtaLcl.format("HH:mm"),
            xtaLclMillis,
            paxLineBarWidth,
            adltAndChlds: adltPaxNumbers + chldPaxNumbers,
            infts: inftPaxNumbers,
            isLazy: xtdxtaDuration.asMilliseconds() < 0,
            durationAbsoluteTime: `${durationHours}:${durationMinutes}`,
            isUnknownXtaLcl,
        };
        processedState.intoData = [...processedState.intoData, processedIntoDatum];
    });
    return processedState;
};
//# sourceMappingURL=flightContentsFlightPaxFrom.js.map