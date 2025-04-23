"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const barChart_1 = require("../../../reducers/barChart");
const flightModals_1 = require("../../../reducers/flightModals");
const flightContentsFlightDetail_1 = require("../../../reducers/flightContentsFlightDetail");
const flightListModals_1 = require("../../../reducers/flightListModals");
const BarChartModel_1 = require("./BarChartModel");
const flightContentsStationOperationTask_1 = require("../../../reducers/flightContentsStationOperationTask");
const selector_1 = require("../../organisms/BarChart/selector");
const BarChartBoxArrOnly_1 = __importDefault(require("./BarChartBoxArrOnly"));
const BarChartBoxDepOnly_1 = __importDefault(require("./BarChartBoxDepOnly"));
const BarChartBoxFull_1 = __importDefault(require("./BarChartBoxFull"));
const commonConst_1 = require("../../../lib/commonConst");
const spotNumber_1 = require("../../../reducers/spotNumber");
const BarChartBox = (props) => {
    const rootRef = (0, react_1.useRef)(null);
    const dispatch = (0, hooks_1.useAppDispatch)();
    const handleFlightDetailList = (extFisRow, isDep) => {
        const { dep, arr } = extFisRow;
        const flight = isDep ? dep : arr;
        if (!flight) {
            return;
        }
        const flightKey = {
            myApoCd: props.fis.apoCd,
            orgDateLcl: flight.orgDateLcl,
            alCd: flight.alCd,
            fltNo: flight.fltNo,
            casFltNo: flight.casFltNo,
            skdDepApoCd: flight.skdDepApoCd,
            skdArrApoCd: flight.skdArrApoCd,
            skdLegSno: flight.skdLegSno,
            oalTblFlg: flight.isOal,
        };
        const posRight = true;
        const tabName = "Detail";
        void dispatch((0, flightModals_1.openFlightModal)({ flightKey, posRight, tabName }));
        void dispatch((0, flightContentsFlightDetail_1.fetchFlightDetail)({ flightKey }));
    };
    const handleFlightListModal = () => {
        const { dep, arr, shipNo } = props.extFisRow;
        const flightListKeys = {
            selectedApoCd: props.fis.apoCd,
            date: dep ? (0, dayjs_1.default)(dep.orgDateLcl).format("YYYY-MM-DD") : arr ? (0, dayjs_1.default)(arr.orgDateLcl).format("YYYY-MM-DD") : "",
            dateFrom: dep && arr ? (0, dayjs_1.default)(arr.orgDateLcl).format("YYYY-MM-DD") : "",
            ship: shipNo, // 航空機登録記号
        };
        void dispatch((0, flightListModals_1.openFlightListModal)({ flightListKeys, posRight: true }));
        void dispatch((0, flightListModals_1.getFlightList)(flightListKeys));
    };
    const handleStationOperationTaskList = (extFisRow) => {
        if (!extFisRow.dep) {
            return;
        }
        const flightKey = {
            myApoCd: props.fis.apoCd,
            orgDateLcl: extFisRow.dep.orgDateLcl,
            alCd: extFisRow.dep.alCd,
            fltNo: extFisRow.dep.fltNo,
            casFltNo: extFisRow.dep.casFltNo,
            skdDepApoCd: extFisRow.dep.skdDepApoCd,
            skdArrApoCd: extFisRow.dep.skdArrApoCd,
            skdLegSno: extFisRow.dep.skdLegSno,
            oalTblFlg: extFisRow.dep.isOal,
        };
        const posRight = true;
        const tabName = "Task";
        void dispatch((0, flightModals_1.openFlightModal)({ flightKey, posRight, tabName }));
        void dispatch((0, flightContentsStationOperationTask_1.fetchStationOperationTask)({ flightKey, isReload: false }));
    };
    // 指定したバーチャートの重なり順を一番上にする
    const handleSwitchTag = () => {
        const { extFisRow } = props;
        dispatch((0, barChart_1.focusDupChart)({ focusArrDepCtrlSeq: extFisRow.arrDepCtrl.seq }));
    };
    // バークリックイベント(SpotChangeMode時のみ)
    const clickBarOfSpotChangeMode = () => {
        const { isSpotChangeMode, spotNoRow, extFisRow: { arr, dep, arrDepCtrl: { seq }, }, fis: { dispRangeFromLcl, dispRangeToLcl }, } = props;
        // Spot Change Mode時のみクリックイベント実行
        if (!isSpotChangeMode)
            return;
        // 着発どちらもデータが存在しない場合、クリックイベントを実行しない
        if (!arr && !dep)
            return;
        // バー選択済みチェック
        if (spotNoRow) {
            // 選択済みの場合、選択解除
            const { givenId } = spotNoRow;
            void dispatch((0, spotNumber_1.closeSpotNumberChild)({ givenId }));
        }
        else {
            void dispatch((0, spotNumber_1.openSpotNumberChild)({ seq, isModal: false, dispRangeFromLcl, dispRangeToLcl }));
        }
    };
    // 選択番号テキスト取得
    const getBarSelectedNumberText = () => {
        const { spotNoRow } = props;
        let barText = "";
        barText = spotNoRow ? `#${spotNoRow.givenId.toString()}` : "";
        return barText;
    };
    const { isPc, extFisRow, cellWidth, rowIndex, cellIndex, cellHeight, isOverlap, stationOperationTaskEnabled, flightDetailEnabled, flightListEnabled, isSpotChangeMode, spotNoRow, } = props;
    const { groundWorkStatus } = extFisRow;
    const fillColor = groundWorkStatus === selector_1.WorkStatus.doing ? "#5CDBCE" : groundWorkStatus === selector_1.WorkStatus.done ? "#DDDDDD" : "#CBE5E3";
    const { width, top, left } = (0, BarChartModel_1.getBarChartLayout)({ extFisRow, cellWidth, cellHeight, rowIndex });
    const isSelectedSpotNumber = !!spotNoRow;
    const barText = getBarSelectedNumberText();
    return (react_1.default.createElement(ChartWrapper, { ref: rootRef, id: `bar${rowIndex}:${cellIndex}`, zIndex: extFisRow.zIndex, left: left, top: top },
        react_1.default.createElement(Chart, { width: width }, !!extFisRow.xtaLcl && !extFisRow.xtdLcl ? (react_1.default.createElement(BarChartBoxArrOnly_1.default, { isPc: isPc, fillColor: fillColor, extFisRow: extFisRow, groundWorkStatus: groundWorkStatus, width: width, isOverlap: isOverlap, handleFlightDetailList: handleFlightDetailList, handleSwitchTag: handleSwitchTag, handleFlightListModal: handleFlightListModal, flightDetailEnabled: flightDetailEnabled, flightListEnabled: flightListEnabled, isSpotChangeMode: isSpotChangeMode, isSelectedSpotNumber: isSelectedSpotNumber, clickBarOfSpotChangeMode: clickBarOfSpotChangeMode, barText: barText })) : !extFisRow.xtaLcl && !!extFisRow.xtdLcl ? (react_1.default.createElement(BarChartBoxDepOnly_1.default, { isPc: isPc, fillColor: fillColor, extFisRow: extFisRow, groundWorkStatus: groundWorkStatus, width: width, isOverlap: isOverlap, handleFlightDetailList: handleFlightDetailList, handleSwitchTag: handleSwitchTag, handleFlightListModal: handleFlightListModal, handleStationOperationTaskList: handleStationOperationTaskList, stationOperationTaskEnabled: stationOperationTaskEnabled, flightDetailEnabled: flightDetailEnabled, flightListEnabled: flightListEnabled, isSpotChangeMode: isSpotChangeMode, isSelectedSpotNumber: isSelectedSpotNumber, clickBarOfSpotChangeMode: clickBarOfSpotChangeMode, barText: barText })) : (react_1.default.createElement(BarChartBoxFull_1.default, { isPc: isPc, fillColor: fillColor, extFisRow: extFisRow, groundWorkStatus: groundWorkStatus, width: width, isOverlap: isOverlap, handleFlightDetailList: handleFlightDetailList, handleSwitchTag: handleSwitchTag, handleFlightListModal: handleFlightListModal, handleStationOperationTaskList: handleStationOperationTaskList, stationOperationTaskEnabled: stationOperationTaskEnabled, flightDetailEnabled: flightDetailEnabled, flightListEnabled: flightListEnabled, isSpotChangeMode: isSpotChangeMode, isSelectedSpotNumber: isSelectedSpotNumber, clickBarOfSpotChangeMode: clickBarOfSpotChangeMode, barText: barText })))));
};
const ChartWrapper = styled_components_1.default.div `
  position: absolute;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  z-index: ${(props) => props.zIndex};
`;
const Chart = styled_components_1.default.div `
  position: absolute;
  min-width: ${(props) => props.width}px;
  height: ${() => commonConst_1.Const.BAR_CHART_TRIANGLE_HEIGHT};
  margin-top: 20px;
  z-index: 1;
  transform: translateZ(0);
`;
exports.default = BarChartBox;
//# sourceMappingURL=BarChartBox.js.map