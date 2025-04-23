import { createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { RootState, AppDispatch } from "../store/storeType";
import { formatFltNo, toUpperCase } from "../lib/commonUtil";
import { WebApi } from "../lib/webApi";
import {
  calculatePaxToMinTime,
  MODAL_MAIN_AREA_WIDTH,
  MODAL_MAIN_AREA_CELL_WIDTH,
  MODAL_DISP_MILLISECONDS_PER_CELL,
  MODAL_DISP_MILLISECONDS,
  PAX_FLIGHT_MINIMUM_TO,
  MODAL_MAIN_AREA_AIRPLANE_WIDTH,
} from "../lib/Pax";
import { closeFlightModalAction } from "./flightModals";
// eslint-disable-next-line import/no-cycle
import { getIdentifier, FlightKey, removeFlightContent, startFetching, failureFetching, applyFlightPaxTo } from "./flightContents";

export const fetchFlightPaxTo = createAsyncThunk<
  void,
  {
    flightKey: FlightKey;
    isReload?: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>("flightContentsFlightPaxTo/fetchFlightPaxTo", async (arg, thunkAPI) => {
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
    const response = await WebApi.getFlightPaxTo(dispatch, params);
    const processedState = createPaxToList(response.data);
    dispatch(applyFlightPaxTo({ flightKey, flightPaxTo: processedState }));
  } catch (err) {
    if (!isReload) {
      // 旅客乗継便バーチャート画面表示に失敗した場合、旅客乗継便バーチャート画面を閉じる
      dispatch(closeFlightModalAction({ identifier }));
      dispatch(removeFlightContent({ identifier }));
    }
    dispatch(failureFetching({ identifier }));
  }
});

export interface FlightPaxToListState {
  // 便詳細モードレス ヘッダー、過去DBフラグ (便詳細モードレスの共通項目)
  flight: CommonApi.Flight;
  connectDbCat: ConnectDbCat;
  // 乗継便ヘッダー(TO)における、自便区間到着Spot、到着日、到着時刻
  myFlightArrSpotNo: string;
  myFlightXtaLclDate: string;
  myFlightXtaLclTime: string;
  // 時刻表示欄、乗継便情報セルの左方向のoffset(単位px)、timeLclのUNIX Time(単位ms)、最小時間のUNIX Time(単位ms)
  timeBarOffsetLeft: number;
  timeLclMillis: number;
  minTimeMillis: number;
  // timeLclが表示範囲内かのフラグ、時刻表示欄に表示する時刻文字列リスト
  timeLclIsInBound: boolean;
  timeBarIndicators: string[];
  // 乗継便情報
  ontoData: FlightPaxToOntoData[];
}

export interface FlightPaxToOntoData {
  // 便情報
  alCd: string;
  fltNo: string;
  depGateNo: string;
  depAptCd: string;
  // 乗継便出発日付、時刻、UNIX Time(単位ms)
  xtdLclDate: string;
  xtdLclTime: string;
  xtdLclMillis: number;
  // 飛行機アイコンとその右横の線の、表示領域横幅
  paxLineBarWidth: number;
  // 乗継旅客人数(大人小児、幼児)、乗継遅れフラグ、乗継残り時間
  adltAndChlds: number;
  infts: number;
  isLazy: boolean;
  durationAbsoluteTime: string;
  // XTD LOCAL 未取得フラグ
  isUnknownXtdLcl: boolean;
}

const createPaxToList = (responseData: FlightPaxToApi.Response): FlightPaxToListState => {
  const initialState: FlightPaxToListState = {
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
  const initialOntoDatum: FlightPaxToOntoData = {
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

  const dayjsMyFlightXtaLcl = dayjs(responseData.paxToHeader.xtaLcl);
  const dayjsTimeLcl = dayjs(responseData.timeLcl);
  const timeLclMillis = dayjsTimeLcl.valueOf();
  const minTime = calculatePaxToMinTime(responseData.paxToHeader.xtaLcl);
  const minTimeMillis = minTime.valueOf();
  // 最小時間 minTime の正時からの経過ミリ秒を取得する
  const minTimeMinSecMillis = minTime.diff(minTime.startOf("hour"));
  let timeLclIsInBound = timeLclMillis >= minTimeMillis;
  timeLclIsInBound = timeLclIsInBound && timeLclMillis <= minTimeMillis + MODAL_DISP_MILLISECONDS;

  const processedState: FlightPaxToListState = {
    ...initialState,
    myFlightArrSpotNo: responseData.paxToHeader.arrApoSpotNo,
    myFlightXtaLclDate: toUpperCase(dayjsMyFlightXtaLcl.format("DDMMM")),
    myFlightXtaLclTime: dayjsMyFlightXtaLcl.format("HH:mm"),
    timeBarOffsetLeft: (minTimeMinSecMillis / MODAL_DISP_MILLISECONDS_PER_CELL) * MODAL_MAIN_AREA_CELL_WIDTH,
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
    const dayjsXtdLcl = dayjs(ontoDatum.xtdLocalTs);
    const isUnknownXtdLcl = !ontoDatum.xtdLocalTs || !dayjsXtdLcl.isValid();

    let xtdLclMillis;
    let paxLineBarWidth;
    let xtdxtaDuration;
    let durationHours;
    let durationMinutes;
    if (!isUnknownXtdLcl) {
      // 飛行機アイコンとその右横の線の、表示領域横幅を取得
      xtdLclMillis = dayjsXtdLcl.valueOf();
      paxLineBarWidth = MODAL_MAIN_AREA_WIDTH - ((xtdLclMillis - minTimeMillis) / MODAL_DISP_MILLISECONDS) * MODAL_MAIN_AREA_WIDTH;
      paxLineBarWidth = Math.min(Math.max(paxLineBarWidth, PAX_FLIGHT_MINIMUM_TO), MODAL_MAIN_AREA_WIDTH);

      const xtdxtaDiff = dayjsXtdLcl.diff(dayjsMyFlightXtaLcl);
      console.log("xtdxtaDiff", xtdxtaDiff);
      xtdxtaDuration = dayjs.duration(xtdxtaDiff);
      const durationAbs = dayjs.duration(Math.abs(xtdxtaDiff));
      durationHours =
        durationAbs.asHours() >= 100 ? `${Math.floor(durationAbs.asHours())}` : `00${Math.floor(durationAbs.asHours())}`.slice(-2);
      durationMinutes = `00${durationAbs.minutes()}`.slice(-2);
    } else {
      // 飛行機アイコンの表示位置を、飛行機アイコンの中心が自身の表示欄の右から 3 / 4 の位置に合うよう設置する
      paxLineBarWidth = MODAL_MAIN_AREA_CELL_WIDTH * 3 + MODAL_MAIN_AREA_AIRPLANE_WIDTH / 2;

      xtdLclMillis = 0;
      xtdxtaDuration = dayjs.duration(0);
      durationHours = "00";
      durationMinutes = "00";
    }

    const adltPaxNumbers = Number.isNaN(Number.parseInt(ontoDatum.bordAdltCnt, 10)) ? 0 : Number.parseInt(ontoDatum.bordAdltCnt, 10);
    const chldPaxNumbers = Number.isNaN(Number.parseInt(ontoDatum.bordChldCnt, 10)) ? 0 : Number.parseInt(ontoDatum.bordChldCnt, 10);
    const inftPaxNumbers = Number.isNaN(Number.parseInt(ontoDatum.bordInftCnt, 10)) ? 0 : Number.parseInt(ontoDatum.bordInftCnt, 10);

    const processedOntoDatum: FlightPaxToOntoData = {
      ...initialOntoDatum,
      alCd: ontoDatum.airlineCd,
      fltNo: formatFltNo(ontoDatum.fltSerNo),
      depGateNo: ontoDatum.depGate,
      depAptCd: ontoDatum.depAptCd,
      xtdLclDate: toUpperCase(dayjsXtdLcl.format("DDMMM")),
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
