import isEqual from "lodash.isequal";
import cloneDeep from "lodash.clonedeep";
import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { usePrevious } from "../../../store/hooks";
import * as fisActions from "../../../reducers/fis";
import BarChartBox from "./BarChartBox";
import { openFlightModal } from "../../../reducers/flightModals";
import { getFlightList, openFlightListModal } from "../../../reducers/flightListModals";
import { fetchFlightDetail } from "../../../reducers/flightContentsFlightDetail";
import { fetchStationOperationTask } from "../../../reducers/flightContentsStationOperationTask";
import { openShipTransitListModal } from "../../../reducers/shipTransitListModals";
import { BarChartState, focusDupChart } from "../../../reducers/barChart";
import { ExtFisRow } from "../../organisms/BarChart/selector";
import { storage } from "../../../lib/storage";
import { SpotNumberState, openSpotNumberChild, closeSpotNumberChild } from "../../../reducers/spotNumber";

interface Props {
  fis: fisActions.FisState;
  cellHeight: number;
  cellWidth: number;
  groupedFisRowsWithIndex: { extFisRows: ExtFisRow[]; rowIndex: number }[];
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
  barChart: BarChartState;
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
  spotNumber: SpotNumberState;
}

const BarGrid: React.FC<Props> = (props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [overlapFlg, setOverlapFlg] = useState<boolean[][]>([]);
  const prevGroupedFisRowsWithIndex = usePrevious(props.groupedFisRowsWithIndex);

  useEffect(() => {
    detectOverlap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEqual(prevGroupedFisRowsWithIndex, props.groupedFisRowsWithIndex)) {
      detectOverlap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.groupedFisRowsWithIndex]);

  const getIsOverlap = (rowIndex: number, cellIndex: number): boolean => (overlapFlg[rowIndex] ? overlapFlg[rowIndex][cellIndex] : false);

  // BarChartの重なりを判定する
  const detectOverlap = () => {
    const { groupedFisRowsWithIndex } = props;
    const rootNode = rootRef.current; /* getElementByIdにしたので使わなくなった */
    if (!rootNode) return;
    // const newOverlapFlg: boolean[][] = [];  //[rowIndex][cellIndex]
    const newOverlapFlg = cloneDeep(overlapFlg); // [rowIndex][cellIndex]

    // 行ごとに重なりの判定処理を行う
    groupedFisRowsWithIndex.forEach((row) => {
      newOverlapFlg[row.rowIndex] = [];
      const barPos: [number, number][] = []; // [左端の座標][右端の座標]の配列
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
      newOverlapFlg[row.rowIndex] = new Array(barPos.length).fill(false) as boolean[];
      barPos.forEach((pos, index) => {
        for (let i = index + 1; i < barPos.length; i++) {
          if (!(barPos[i][1] < pos[0] || pos[1] < barPos[i][0])) {
            newOverlapFlg[row.rowIndex][index] = true;
            newOverlapFlg[row.rowIndex][i] = true;
          }
        }
      });
    });
    if (!isEqual(newOverlapFlg, overlapFlg)) {
      setOverlapFlg(newOverlapFlg);
    }
  };

  const {
    fis,
    barChart,
    cellWidth,
    cellHeight,
    groupedFisRowsWithIndex,
    stationOperationTaskEnabled,
    flightDetailEnabled,
    flightListEnabled,
    isSpotChangeMode,
    spotNumber,
  } = props;

  if (groupedFisRowsWithIndex.length === 0) return null;
  const { isPc } = storage;

  return (
    <Wrapper ref={rootRef}>
      {groupedFisRowsWithIndex.map((spotRow) => {
        const { extFisRows } = spotRow;
        const { rowIndex } = spotRow;
        return extFisRows.map((extFisRow, cellIndex) => {
          const spotNoRow = spotNumber.spotNoRows.find((r) => r.seq === extFisRow.arrDepCtrl.seq);
          return (
            <BarChartBox
              key={extFisRow.arrDepCtrl.seq}
              isPc={isPc}
              fis={fis}
              barChart={barChart}
              cellHeight={cellHeight}
              extFisRow={extFisRow}
              cellWidth={cellWidth}
              rowIndex={rowIndex}
              cellIndex={cellIndex}
              isOverlap={getIsOverlap(rowIndex, cellIndex)}
              openFlightModal={openFlightModal}
              openShipTransitListModal={openShipTransitListModal}
              openFlightListModal={openFlightListModal}
              getFlightList={getFlightList}
              fetchFlightDetail={fetchFlightDetail}
              fetchStationOperationTask={fetchStationOperationTask}
              focusDupChart={focusDupChart}
              stationOperationTaskEnabled={stationOperationTaskEnabled}
              flightDetailEnabled={flightDetailEnabled}
              flightListEnabled={flightListEnabled}
              isSpotChangeMode={isSpotChangeMode}
              openSpotNumberChild={openSpotNumberChild}
              closeSpotNumberChild={closeSpotNumberChild}
              spotNoRow={spotNoRow}
            />
          );
        });
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default BarGrid;
