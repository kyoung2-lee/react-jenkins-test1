import { createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { RootState, AppDispatch } from "../store/storeType";
import { formatFltNo, toUpperCase } from "../lib/commonUtil";
import { WebApi } from "../lib/webApi";
import {
  calculatePaxFromMinTime,
  MODAL_MAIN_AREA_WIDTH,
  MODAL_MAIN_AREA_CELL_WIDTH,
  MODAL_DISP_MILLISECONDS_PER_CELL,
  MODAL_DISP_MILLISECONDS,
  PAX_FLIGHT_MINIMUM_FROM,
  MODAL_MAIN_AREA_AIRPLANE_WIDTH,
} from "../lib/Pax";
import { closeFlightModalAction } from "./flightModals";
// eslint-disable-next-line import/no-cycle
import { getIdentifier, FlightKey, removeFlightContent, startFetching, failureFetching, applyFlightPaxFrom } from "./flightContents";

export const fetchFlightPaxFrom = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    isReload?: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsFlightPaxFrom/fetchFlightPaxFrom", async (arg, thunkAPI) => {
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
  const identifier = getIdentifier(flightKey);
  dispatch(startFetching({ identifier }));

  try {
    const response = await WebApi.getFlightPaxFrom(dispatch, params);
    const processedState = createPaxFromList(response.data);
    dispatch(applyFlightPaxFrom({ flightKey, flightPaxFrom: processedState }));
  } catch (err) {
    if (!isReload) {
      // 旅客乗継便バーチャート画面表示に失敗した場合、旅客乗継便バーチャート画面を閉じる
      dispatch(closeFlightModalAction({ identifier }));
      dispatch(removeFlightContent({ identifier }));
    }
    dispatch(failureFetching({ identifier }));
  }
});

export interface FlightPaxFromListState {
  // 便詳細モードレス ヘッダー、過去DBフラグ (便詳細モードレスの共通項目)
  flight: CommonApi.Flight;
  connectDbCat: ConnectDbCat;
  // 乗継便ヘッダー(FROM)における、自便区間出発Gate、出発日、出発時刻
  myFlightDepGateNo: string;
  myFlightXtdLclDate: string;
  myFlightXtdLclTime: string;
  // 時刻表示欄、乗継便情報セルの左方向のoffset(単位px)、timeLclのUNIX Time(単位ms)、最小時間のUNIX Time(単位ms)
  timeBarOffsetLeft: number;
  timeLclMillis: number;
  minTimeMillis: number;
  // timeLclが表示範囲内かのフラグ、時刻表示欄に表示する時刻文字列リスト
  timeLclIsInBound: boolean;
  timeBarIndicators: string[];
  // 乗継便情報
  intoData: FlightPaxFromIntoData[];
}

export interface FlightPaxFromIntoData {
  // 便情報
  alCd: string;
  fltNo: string;
  arrSpotNo: string;
  arrAptCd: string;
  // 乗継便到着日付、時刻、UNIX Time(単位ms)
  xtaLclDate: string;
  xtaLclTime: string;
  xtaLclMillis: number;
  // 飛行機アイコンとその左横の線の、表示領域横幅
  paxLineBarWidth: number;
  // 乗継旅客人数(大人小児、幼児)、乗継遅れフラグ、乗継残り時間
  adltAndChlds: number;
  infts: number;
  isLazy: boolean;
  durationAbsoluteTime: string;
  // XTA LOCAL 未取得フラグ
  isUnknownXtaLcl: boolean;
}

const createPaxFromList = (responseData: FlightPaxFromApi.Response): FlightPaxFromListState => {
  const initialState: FlightPaxFromListState = {
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
  const initialIntoDatum: FlightPaxFromIntoData = {
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

  const dayjsMyFlightXtdLcl = dayjs(responseData.paxFromHeader.xtdLcl);
  const dayjsTimeLcl = dayjs(responseData.timeLcl);
  const timeLclMillis = dayjsTimeLcl.valueOf();
  const minTime = calculatePaxFromMinTime(responseData.paxFromHeader.xtdLcl);
  const minTimeMillis = minTime.valueOf();
  // 最小時間 minTime の正時からの経過ミリ秒を取得する
  const minTimeMinSecMillis = minTime.diff(minTime.startOf("hour"));
  let timeLclIsInBound = timeLclMillis >= minTimeMillis;
  timeLclIsInBound = timeLclIsInBound && timeLclMillis <= minTimeMillis + MODAL_DISP_MILLISECONDS;

  const processedState: FlightPaxFromListState = {
    ...initialState,
    myFlightDepGateNo: responseData.paxFromHeader.depGateNo,
    myFlightXtdLclDate: toUpperCase(dayjsMyFlightXtdLcl.format("DDMMM")),
    myFlightXtdLclTime: dayjsMyFlightXtdLcl.format("HH:mm"),
    timeBarOffsetLeft: (minTimeMinSecMillis / MODAL_DISP_MILLISECONDS_PER_CELL) * MODAL_MAIN_AREA_CELL_WIDTH,
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

    const dayjsXtaLcl = dayjs(intoDatum.xtaLocalTs);
    const isUnknownXtaLcl = !intoDatum.xtaLocalTs || !dayjsXtaLcl.isValid();

    let xtaLclMillis;
    let paxLineBarWidth;
    let xtdxtaDuration;
    let durationHours;
    let durationMinutes;
    if (!isUnknownXtaLcl) {
      // 飛行機アイコンとその左横の線の、表示領域横幅を取得
      xtaLclMillis = dayjsXtaLcl.valueOf();
      paxLineBarWidth = ((xtaLclMillis - minTimeMillis) / MODAL_DISP_MILLISECONDS) * MODAL_MAIN_AREA_WIDTH;
      paxLineBarWidth = Math.min(Math.max(paxLineBarWidth, PAX_FLIGHT_MINIMUM_FROM), MODAL_MAIN_AREA_WIDTH);

      const xtdxtaDiff = dayjsMyFlightXtdLcl.diff(dayjsXtaLcl);
      xtdxtaDuration = dayjs.duration(xtdxtaDiff);
      const durationAbs = dayjs.duration(Math.abs(xtdxtaDiff));
      durationHours =
        durationAbs.asHours() >= 100 ? `${Math.floor(durationAbs.asHours())}` : `00${Math.floor(durationAbs.asHours())}`.slice(-2);
      durationMinutes = `00${durationAbs.minutes()}`.slice(-2);
    } else {
      // 飛行機アイコンの表示位置を、飛行機アイコンの中心が自身の表示欄の左から 3 / 4 の位置に合うよう設置する
      paxLineBarWidth = MODAL_MAIN_AREA_CELL_WIDTH * 3 + MODAL_MAIN_AREA_AIRPLANE_WIDTH / 2;

      xtaLclMillis = 0;
      xtdxtaDuration = dayjs.duration(0);
      durationHours = "00";
      durationMinutes = "00";
    }

    const adltPaxNumbers = Number.isNaN(Number.parseInt(intoDatum.bordAdltCnt, 10)) ? 0 : Number.parseInt(intoDatum.bordAdltCnt, 10);
    const chldPaxNumbers = Number.isNaN(Number.parseInt(intoDatum.bordChldCnt, 10)) ? 0 : Number.parseInt(intoDatum.bordChldCnt, 10);
    const inftPaxNumbers = Number.isNaN(Number.parseInt(intoDatum.bordInftCnt, 10)) ? 0 : Number.parseInt(intoDatum.bordInftCnt, 10);

    const processedIntoDatum: FlightPaxFromIntoData = {
      ...initialIntoDatum,
      alCd: intoDatum.airlineCd,
      fltNo: formatFltNo(intoDatum.fltSerNo),
      arrSpotNo: intoDatum.actArrSpot,
      arrAptCd: intoDatum.arrAptCd,
      xtaLclDate: toUpperCase(dayjsXtaLcl.format("DDMMM")),
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
