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
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_1 = __importStar(require("react"));
const hooks_1 = require("../../../store/hooks");
const BarChartBox_1 = __importDefault(require("./BarChartBox"));
const flightModals_1 = require("../../../reducers/flightModals");
const flightListModals_1 = require("../../../reducers/flightListModals");
const flightContentsFlightDetail_1 = require("../../../reducers/flightContentsFlightDetail");
const flightContentsStationOperationTask_1 = require("../../../reducers/flightContentsStationOperationTask");
const shipTransitListModals_1 = require("../../../reducers/shipTransitListModals");
const barChart_1 = require("../../../reducers/barChart");
const storage_1 = require("../../../lib/storage");
const spotNumber_1 = require("../../../reducers/spotNumber");
const BarGrid = (props) => {
    const rootRef = (0, react_1.useRef)(null);
    const [overlapFlg, setOverlapFlg] = (0, react_1.useState)([]);
    const prevGroupedFisRowsWithIndex = (0, hooks_1.usePrevious)(props.groupedFisRowsWithIndex);
    (0, react_1.useEffect)(() => {
        detectOverlap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        if (!(0, lodash_isequal_1.default)(prevGroupedFisRowsWithIndex, props.groupedFisRowsWithIndex)) {
            detectOverlap();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.groupedFisRowsWithIndex]);
    const getIsOverlap = (rowIndex, cellIndex) => (overlapFlg[rowIndex] ? overlapFlg[rowIndex][cellIndex] : false);
    // BarChartの重なりを判定する
    const detectOverlap = () => {
        const { groupedFisRowsWithIndex } = props;
        const rootNode = rootRef.current; /* getElementByIdにしたので使わなくなった */
        if (!rootNode)
            return;
        // const newOverlapFlg: boolean[][] = [];  //[rowIndex][cellIndex]
        const newOverlapFlg = (0, lodash_clonedeep_1.default)(overlapFlg); // [rowIndex][cellIndex]
        // 行ごとに重なりの判定処理を行う
        groupedFisRowsWithIndex.forEach((row) => {
            newOverlapFlg[row.rowIndex] = [];
            const barPos = []; // [左端の座標][右端の座標]の配列
            // 行内に存在する、各バーの大きさを取得する
            row.extFisRows.forEach((_, cellIndex) => {
                barPos[cellIndex] = [0, 0];
                // 対象のバーを取得する
                const barNode = document.getElementById(`bar${row.rowIndex}:${cellIndex}`);
                if (barNode) {
                    // 大きさに影響する要素だけ抜き出し、バーの両端の座標を取得する。
                    const bodies = barNode.getElementsByClassName("chartBody");
                    if (bodies.length) {
                        const bodyArray = Array.from(bodies);
                        bodyArray.forEach((body) => {
                            const rect = body.getBoundingClientRect();
                            if (barPos[cellIndex][0] === 0 || rect.left < barPos[cellIndex][0]) {
                                barPos[cellIndex][0] = rect.left;
                            }
                            if (barPos[cellIndex][1] === 0 || rect.right > barPos[cellIndex][1]) {
                                barPos[cellIndex][1] = rect.right;
                            }
                        });
                    }
                }
            });
            // 重なり判定
            newOverlapFlg[row.rowIndex] = new Array(barPos.length).fill(false);
            barPos.forEach((pos, index) => {
                for (let i = index + 1; i < barPos.length; i++) {
                    if (!(barPos[i][1] < pos[0] || pos[1] < barPos[i][0])) {
                        newOverlapFlg[row.rowIndex][index] = true;
                        newOverlapFlg[row.rowIndex][i] = true;
                    }
                }
            });
        });
        if (!(0, lodash_isequal_1.default)(newOverlapFlg, overlapFlg)) {
            setOverlapFlg(newOverlapFlg);
        }
    };
    const { fis, barChart, cellWidth, cellHeight, groupedFisRowsWithIndex, stationOperationTaskEnabled, flightDetailEnabled, flightListEnabled, isSpotChangeMode, spotNumber, } = props;
    if (groupedFisRowsWithIndex.length === 0)
        return null;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Wrapper, { ref: rootRef }, groupedFisRowsWithIndex.map((spotRow) => {
        const { extFisRows } = spotRow;
        const { rowIndex } = spotRow;
        return extFisRows.map((extFisRow, cellIndex) => {
            const spotNoRow = spotNumber.spotNoRows.find((r) => r.seq === extFisRow.arrDepCtrl.seq);
            return (react_1.default.createElement(BarChartBox_1.default, { key: extFisRow.arrDepCtrl.seq, isPc: isPc, fis: fis, barChart: barChart, cellHeight: cellHeight, extFisRow: extFisRow, cellWidth: cellWidth, rowIndex: rowIndex, cellIndex: cellIndex, isOverlap: getIsOverlap(rowIndex, cellIndex), openFlightModal: flightModals_1.openFlightModal, openShipTransitListModal: shipTransitListModals_1.openShipTransitListModal, openFlightListModal: flightListModals_1.openFlightListModal, getFlightList: flightListModals_1.getFlightList, fetchFlightDetail: flightContentsFlightDetail_1.fetchFlightDetail, fetchStationOperationTask: flightContentsStationOperationTask_1.fetchStationOperationTask, focusDupChart: barChart_1.focusDupChart, stationOperationTaskEnabled: stationOperationTaskEnabled, flightDetailEnabled: flightDetailEnabled, flightListEnabled: flightListEnabled, isSpotChangeMode: isSpotChangeMode, openSpotNumberChild: spotNumber_1.openSpotNumberChild, closeSpotNumberChild: spotNumber_1.closeSpotNumberChild, spotNoRow: spotNoRow }));
        });
    })));
};
const Wrapper = styled_components_1.default.div `
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
exports.default = BarGrid;
//# sourceMappingURL=BarChartGrid.js.map