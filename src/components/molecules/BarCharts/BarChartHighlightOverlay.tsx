import React from "react";
import styled from "styled-components";
import { getBarChartLayout } from "./BarChartModel";
import { BarChartSearchState } from "../../../reducers/barChartSearch";
// eslint-disable-next-line import/no-cycle
import { FisRowsGroupBySpotState, ExtFisRow } from "../../organisms/BarChart/selector";

interface Props {
  fisRowsGroupBySpot: FisRowsGroupBySpotState;
  barChartSearch: BarChartSearchState;
  cellWidth: number;
  cellHeight: number;
}

export const HIGHLIGHT_OVERLAY_INDEX = 90000;

class BarChartHighlightOverlay extends React.Component<Props> {
  private highlightingBarChart() {
    const { fisRowsGroupBySpot, barChartSearch } = this.props;
    let rowIndex = -1;
    let extFisRow: ExtFisRow | undefined;

    fisRowsGroupBySpot.sortedSpots.forEach(({ spotNo: key }, i) => {
      const matchChart = fisRowsGroupBySpot.groupedfisRowsBySpot[key]
        ? fisRowsGroupBySpot.groupedfisRowsBySpot[key].find((chart) => barChartSearch.scrollToScheduleSeq === chart.arrDepCtrl.seq)
        : undefined;

      if (matchChart) {
        rowIndex = i;
        extFisRow = matchChart;
      }
    });
    return { rowIndex, extFisRow };
  }

  render() {
    const { rowIndex, extFisRow } = this.highlightingBarChart();
    if (!extFisRow) return <div />;

    const { cellWidth, cellHeight } = this.props;
    let { width, left } = getBarChartLayout({ extFisRow, cellWidth, cellHeight, rowIndex });
    const { top } = getBarChartLayout({ extFisRow, cellWidth, cellHeight, rowIndex });

    const padding = cellWidth * 0.3;
    width += padding;
    const minWidth = 250; // 台形が小さくて内容がはみ出る場合があるので、固定値で考慮してます。
    left -= padding / 2; // 左右にpaddingするため1/2ずらす

    return <Overlay size={{ height: cellHeight, width: minWidth > width ? minWidth : width }} position={{ left, top }} />;
  }
}

const Overlay = styled.div<{ size: { width: number; height: number }; position: { left: number; top: number } }>`
  width: ${(props) => props.size.width}px;
  height: ${(props) => props.size.height}px;
  top: ${(props) => props.position.top}px;
  left: ${(props) => props.position.left}px;
  position: absolute;
  border: 122364px solid black;
  margin-top: -122364px;
  margin-left: -122364px;
  opacity: 0.5;
  box-sizing: content-box;
  z-index: ${() => HIGHLIGHT_OVERLAY_INDEX};
`;

export default BarChartHighlightOverlay;
