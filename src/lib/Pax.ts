import dayjs from "dayjs";

export const calculatePaxFromMinTime = (paxFromXtdLcl: string) => dayjs(paxFromXtdLcl).subtract(3, "hour");

export const calculatePaxToMinTime = (paxToXtaLcl: string) => dayjs(paxToXtaLcl).subtract(1, "hour");

// モーダル全体の横幅、乗継便情報表示欄の横幅、乗継旅客情報表示欄の横幅(ともに単位px)
export const MODAL_ENTIRE_WIDTH = 375;
export const MODAL_FLIGHT_AREA_WIDTH = 100;
export const MODAL_PAX_AREA_WIDTH = 67;
// 飛行機アイコン表示欄の横幅、同表示欄のセルの横幅(ともに単位px)
export const MODAL_MAIN_AREA_WIDTH = MODAL_ENTIRE_WIDTH - MODAL_FLIGHT_AREA_WIDTH - MODAL_PAX_AREA_WIDTH;
export const MODAL_MAIN_AREA_CELL_WIDTH = MODAL_MAIN_AREA_WIDTH / 4;

// 飛行機アイコン表示欄セルの単位時間、飛行機アイコン表示欄の単位時間(ともに単位ms)
export const MODAL_DISP_MILLISECONDS_PER_CELL = 60 * 60 * 1000;
export const MODAL_DISP_MILLISECONDS = MODAL_DISP_MILLISECONDS_PER_CELL * 4;

// 乗継便情報の行の高さ、乗継便バーチャートFrom、To画面の飛行機アイコン線の最小幅(ともに単位px)
export const PAX_ROW_HEIGHT = 52;
export const PAX_FLIGHT_MINIMUM_FROM = 45;
export const PAX_FLIGHT_MINIMUM_TO = PAX_FLIGHT_MINIMUM_FROM;

// 飛行機アイコンの横幅(単位px)
export const MODAL_MAIN_AREA_AIRPLANE_WIDTH = 20;
