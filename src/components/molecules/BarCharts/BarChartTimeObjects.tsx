import React from "react";
import styled from "styled-components";
import times from "lodash.times";

interface Props {
  cellWidth: number;
  columnsCount: number;
  curfewTimeStartLcl: string;
  curfewTimeEndLcl: string;
}

export default class BarChartTimeObjects extends React.PureComponent<Props> {
  render() {
    const { cellWidth, columnsCount, curfewTimeStartLcl, curfewTimeEndLcl } = this.props;

    // curfew部分を表示する位置を計算する
    const curfewPos: { startPx: number; endPx: number }[] = [];
    if (curfewTimeStartLcl && curfewTimeEndLcl) {
      const curfewStart = Number(curfewTimeStartLcl.substr(0, 2)) + Number(curfewTimeStartLcl.substr(2, 2)) / 60;
      const curfewEnd = Number(curfewTimeEndLcl.substr(0, 2)) + Number(curfewTimeEndLcl.substr(2, 2)) / 60;
      if (!Number.isNaN(curfewStart) && !Number.isNaN(curfewEnd)) {
        let dayStart = curfewStart > curfewEnd ? -1 : 0;
        let dayEnd = 0;
        do {
          curfewPos.push({
            startPx: (curfewStart + dayStart * 24) * cellWidth,
            endPx: (curfewEnd + dayEnd * 24) * cellWidth,
          });
          dayStart += 1;
          dayEnd += 1;
        } while (dayStart < 3);
      }
    }

    return (
      <Container>
        {times(columnsCount).map((index) => (
          <Border key={`border_${index}`} positionX={cellWidth * (index + 1)} />
        ))}
        {curfewPos.map((c, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <CurfewArea key={`curfew_${index}`} startPx={c.startPx} endPx={c.endPx} />
        ))}
      </Container>
    );
  }
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

const Border = styled.span<{ positionX: number }>`
  position: absolute;
  height: 100%;
  width: 0px;
  border-left: thin solid #e0e0e0; /* thinはブラウザの縮小zoomに対応 */
  left: ${({ positionX }) => positionX}px;
  top: 0;
`;

const CurfewArea = styled.span<{ startPx: number; endPx: number }>`
  position: absolute;
  height: 100%;
  width: ${({ startPx, endPx }) => endPx - startPx}px;
  background-color: #000;
  opacity: 0.3;
  left: ${({ startPx }) => startPx}px;
  top: 0;
`;
