"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODAL_MAIN_AREA_AIRPLANE_WIDTH = exports.PAX_FLIGHT_MINIMUM_TO = exports.PAX_FLIGHT_MINIMUM_FROM = exports.PAX_ROW_HEIGHT = exports.MODAL_DISP_MILLISECONDS = exports.MODAL_DISP_MILLISECONDS_PER_CELL = exports.MODAL_MAIN_AREA_CELL_WIDTH = exports.MODAL_MAIN_AREA_WIDTH = exports.MODAL_PAX_AREA_WIDTH = exports.MODAL_FLIGHT_AREA_WIDTH = exports.MODAL_ENTIRE_WIDTH = exports.calculatePaxToMinTime = exports.calculatePaxFromMinTime = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const calculatePaxFromMinTime = (paxFromXtdLcl) => (0, dayjs_1.default)(paxFromXtdLcl).subtract(3, "hour");
exports.calculatePaxFromMinTime = calculatePaxFromMinTime;
const calculatePaxToMinTime = (paxToXtaLcl) => (0, dayjs_1.default)(paxToXtaLcl).subtract(1, "hour");
exports.calculatePaxToMinTime = calculatePaxToMinTime;
// モーダル全体の横幅、乗継便情報表示欄の横幅、乗継旅客情報表示欄の横幅(ともに単位px)
exports.MODAL_ENTIRE_WIDTH = 375;
exports.MODAL_FLIGHT_AREA_WIDTH = 100;
exports.MODAL_PAX_AREA_WIDTH = 67;
// 飛行機アイコン表示欄の横幅、同表示欄のセルの横幅(ともに単位px)
exports.MODAL_MAIN_AREA_WIDTH = exports.MODAL_ENTIRE_WIDTH - exports.MODAL_FLIGHT_AREA_WIDTH - exports.MODAL_PAX_AREA_WIDTH;
exports.MODAL_MAIN_AREA_CELL_WIDTH = exports.MODAL_MAIN_AREA_WIDTH / 4;
// 飛行機アイコン表示欄セルの単位時間、飛行機アイコン表示欄の単位時間(ともに単位ms)
exports.MODAL_DISP_MILLISECONDS_PER_CELL = 60 * 60 * 1000;
exports.MODAL_DISP_MILLISECONDS = exports.MODAL_DISP_MILLISECONDS_PER_CELL * 4;
// 乗継便情報の行の高さ、乗継便バーチャートFrom、To画面の飛行機アイコン線の最小幅(ともに単位px)
exports.PAX_ROW_HEIGHT = 52;
exports.PAX_FLIGHT_MINIMUM_FROM = 45;
exports.PAX_FLIGHT_MINIMUM_TO = exports.PAX_FLIGHT_MINIMUM_FROM;
// 飛行機アイコンの横幅(単位px)
exports.MODAL_MAIN_AREA_AIRPLANE_WIDTH = 20;
//# sourceMappingURL=Pax.js.map