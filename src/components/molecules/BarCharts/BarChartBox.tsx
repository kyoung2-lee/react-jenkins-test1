import dayjs from "dayjs";
import React, { useRef } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../../store/hooks";
import { openShipTransitListModal } from "../../../reducers/shipTransitListModals";
import * as fisActions from "../../../reducers/fis";
import { BarChartState, focusDupChart } from "../../../reducers/barChart";
import { openFlightModal } from "../../../reducers/flightModals";
import { fetchFlightDetail } from "../../../reducers/flightContentsFlightDetail";
import { getFlightList, openFlightListModal, FlightListKeys } from "../../../reducers/flightListModals";
import { getBarChartLayout } from "./BarChartModel";
import { fetchStationOperationTask } from "../../../reducers/flightContentsStationOperationTask";
import { ExtFisRow, WorkStatus } from "../../organisms/BarChart/selector";
import BarChartBoxArrOnly from "./BarChartBoxArrOnly";
import BarChartBoxDepOnly from "./BarChartBoxDepOnly";
import BarChartBoxFull from "./BarChartBoxFull";
import { Const } from "../../../lib/commonConst";
import { SpotNoRow, openSpotNumberChild, closeSpotNumberChild } from "../../../reducers/spotNumber";

interface Props {
  isPc: boolean;
  fis: fisActions.FisState;
  // eslint-disable-next-line react/no-unused-prop-types
  barChart: BarChartState;
  extFisRow: ExtFisRow;
  cellWidth: number;
  cellHeight: number;
  rowIndex: number;
  cellIndex: number;
  isOverlap: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  openFlightModal: typeof openFlightModal;
  // eslint-disable-next-line react/no-unused-prop-types
  openShipTransitListModal: typeof openShipTransitListModal;
  // eslint-disable-next-line react/no-unused-prop-types
  openFlightListModal: typeof openFlightListModal;
  // eslint-disable-next-line react/no-unused-prop-types
  getFlightList: typeof getFlightList;
  // eslint-disable-next-line react/no-unused-prop-types
  fetchFlightDetail: typeof fetchFlightDetail;
  // eslint-disable-next-line react/no-unused-prop-types
  fetchStationOperationTask: typeof fetchStationOperationTask;
  // eslint-disable-next-line react/no-unused-prop-types
  focusDupChart: typeof focusDupChart;
  stationOperationTaskEnabled: boolean;
  flightDetailEnabled: boolean;
  flightListEnabled: boolean;
  isSpotChangeMode: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  openSpotNumberChild: typeof openSpotNumberChild;
  // eslint-disable-next-line react/no-unused-prop-types
  closeSpotNumberChild: typeof closeSpotNumberChild;
  spotNoRow: SpotNoRow | undefined;
}

const BarChartBox: React.FC<Props> = (props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const handleFlightDetailList = (extFisRow: ExtFisRow, isDep: boolean) => {
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
    void dispatch(openFlightModal({ flightKey, posRight, tabName }));
    void dispatch(fetchFlightDetail({ flightKey }));
  };

  const handleFlightListModal = () => {
    const { dep, arr, shipNo } = props.extFisRow;
    const flightListKeys: FlightListKeys = {
      selectedApoCd: props.fis.apoCd,
      date: dep ? dayjs(dep.orgDateLcl).format("YYYY-MM-DD") : arr ? dayjs(arr.orgDateLcl).format("YYYY-MM-DD") : "", // 運行基準日
      dateFrom: dep && arr ? dayjs(arr.orgDateLcl).format("YYYY-MM-DD") : "",
      ship: shipNo, // 航空機登録記号
    };

    void dispatch(openFlightListModal({ flightListKeys, posRight: true }));
    void dispatch(getFlightList(flightListKeys));
  };

  const handleStationOperationTaskList = (extFisRow: ExtFisRow) => {
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
    void dispatch(openFlightModal({ flightKey, posRight, tabName }));
    void dispatch(fetchStationOperationTask({ flightKey, isReload: false }));
  };

  // 指定したバーチャートの重なり順を一番上にする
  const handleSwitchTag = () => {
    const { extFisRow } = props;
    dispatch(focusDupChart({ focusArrDepCtrlSeq: extFisRow.arrDepCtrl.seq }));
  };

  // バークリックイベント(SpotChangeMode時のみ)
  const clickBarOfSpotChangeMode = () => {
    const {
      isSpotChangeMode,
      spotNoRow,
      extFisRow: {
        arr,
        dep,
        arrDepCtrl: { seq },
      },
      fis: { dispRangeFromLcl, dispRangeToLcl },
    } = props;

    // Spot Change Mode時のみクリックイベント実行
    if (!isSpotChangeMode) return;

    // 着発どちらもデータが存在しない場合、クリックイベントを実行しない
    if (!arr && !dep) return;

    // バー選択済みチェック
    if (spotNoRow) {
      // 選択済みの場合、選択解除
      const { givenId } = spotNoRow;
      void dispatch(closeSpotNumberChild({ givenId }));
    } else {
      void dispatch(openSpotNumberChild({ seq, isModal: false, dispRangeFromLcl, dispRangeToLcl }));
    }
  };

  // 選択番号テキスト取得
  const getBarSelectedNumberText = () => {
    const { spotNoRow } = props;
    let barText = "";
    barText = spotNoRow ? `#${spotNoRow.givenId.toString()}` : "";
    return barText;
  };

  const {
    isPc,
    extFisRow,
    cellWidth,
    rowIndex,
    cellIndex,
    cellHeight,
    isOverlap,
    stationOperationTaskEnabled,
    flightDetailEnabled,
    flightListEnabled,
    isSpotChangeMode,
    spotNoRow,
  } = props;
  const { groundWorkStatus } = extFisRow;
  const fillColor = groundWorkStatus === WorkStatus.doing ? "#5CDBCE" : groundWorkStatus === WorkStatus.done ? "#DDDDDD" : "#CBE5E3";
  const { width, top, left } = getBarChartLayout({ extFisRow, cellWidth, cellHeight, rowIndex });
  const isSelectedSpotNumber = !!spotNoRow;
  const barText = getBarSelectedNumberText();
  return (
    <ChartWrapper ref={rootRef} id={`bar${rowIndex}:${cellIndex}`} zIndex={extFisRow.zIndex} left={left} top={top}>
      <Chart width={width}>
        {!!extFisRow.xtaLcl && !extFisRow.xtdLcl ? (
          <BarChartBoxArrOnly
            isPc={isPc}
            fillColor={fillColor}
            extFisRow={extFisRow}
            groundWorkStatus={groundWorkStatus}
            width={width}
            isOverlap={isOverlap}
            handleFlightDetailList={handleFlightDetailList}
            handleSwitchTag={handleSwitchTag}
            handleFlightListModal={handleFlightListModal}
            flightDetailEnabled={flightDetailEnabled}
            flightListEnabled={flightListEnabled}
            isSpotChangeMode={isSpotChangeMode}
            isSelectedSpotNumber={isSelectedSpotNumber}
            clickBarOfSpotChangeMode={clickBarOfSpotChangeMode}
            barText={barText}
          />
        ) : !extFisRow.xtaLcl && !!extFisRow.xtdLcl ? (
          <BarChartBoxDepOnly
            isPc={isPc}
            fillColor={fillColor}
            extFisRow={extFisRow}
            groundWorkStatus={groundWorkStatus}
            width={width}
            isOverlap={isOverlap}
            handleFlightDetailList={handleFlightDetailList}
            handleSwitchTag={handleSwitchTag}
            handleFlightListModal={handleFlightListModal}
            handleStationOperationTaskList={handleStationOperationTaskList}
            stationOperationTaskEnabled={stationOperationTaskEnabled}
            flightDetailEnabled={flightDetailEnabled}
            flightListEnabled={flightListEnabled}
            isSpotChangeMode={isSpotChangeMode}
            isSelectedSpotNumber={isSelectedSpotNumber}
            clickBarOfSpotChangeMode={clickBarOfSpotChangeMode}
            barText={barText}
          />
        ) : (
          <BarChartBoxFull
            isPc={isPc}
            fillColor={fillColor}
            extFisRow={extFisRow}
            groundWorkStatus={groundWorkStatus}
            width={width}
            isOverlap={isOverlap}
            handleFlightDetailList={handleFlightDetailList}
            handleSwitchTag={handleSwitchTag}
            handleFlightListModal={handleFlightListModal}
            handleStationOperationTaskList={handleStationOperationTaskList}
            stationOperationTaskEnabled={stationOperationTaskEnabled}
            flightDetailEnabled={flightDetailEnabled}
            flightListEnabled={flightListEnabled}
            isSpotChangeMode={isSpotChangeMode}
            isSelectedSpotNumber={isSelectedSpotNumber}
            clickBarOfSpotChangeMode={clickBarOfSpotChangeMode}
            barText={barText}
          />
        )}
      </Chart>
    </ChartWrapper>
  );
};

const ChartWrapper = styled.div<{ zIndex: number; left: number; top: number }>`
  position: absolute;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  z-index: ${(props) => props.zIndex};
`;
const Chart = styled.div`
  position: absolute;
  min-width: ${(props: { width: number }) => props.width}px;
  height: ${() => Const.BAR_CHART_TRIANGLE_HEIGHT};
  margin-top: 20px;
  z-index: 1;
  transform: translateZ(0);
`;

export default BarChartBox;
