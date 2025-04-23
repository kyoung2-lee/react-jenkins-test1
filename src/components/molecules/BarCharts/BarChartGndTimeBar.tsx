import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { ExtFisRow } from "../../organisms/BarChart/selector";
import ExcessTimeContainer from "../../atoms/ExcessTimeContainer";
import { storage } from "../../../lib/storage";

interface Props {
  className: string;
  extFisRow: ExtFisRow;
  barChartWidth: number;
}

export default class BarChartGndTimeBar extends React.Component<Props> {
  private start = () => dayjs(this.props.extFisRow.xtaLcl).second(0).millisecond(0);
  private end = () => dayjs(this.props.extFisRow.xtdLcl).second(0).millisecond(0);

  // 地上作業終了の目安時間を取得する
  private gndTimeEnd() {
    const { extFisRow } = this.props;
    const gndHours = extFisRow.arrDepCtrl.gndTime.substring(0, 2);
    const gndMinutes = extFisRow.arrDepCtrl.gndTime.substring(2);
    const endDateTime = this.start().add(Number(gndHours), "h").add(Number(gndMinutes), "m");
    const maxDateTime = this.end().add(9, "h").add(59, "m");
    return endDateTime.isBefore(maxDateTime) ? endDateTime : maxDateTime;
  }

  // 下バーの長さを取得する
  private gndTimeBarWidth() {
    const { barChartWidth } = this.props;
    return (
      barChartWidth * ((this.gndTimeEnd().unix() - this.start().unix()) / (this.end().unix() - this.start().unix())) +
      2 /* 開始位置がずれているので＋２pxする */
    );
  }

  render() {
    const { className, extFisRow } = this.props;
    if (!(extFisRow.xtaLcl && extFisRow.xtdLcl)) return null;
    if (!extFisRow.arrDepCtrl.gndTime) return null;

    return (
      // 重なり検知のためにtransform系のCSSプロパティは使わない
      <BarArea className={className} isPc={storage.isPc}>
        <Bar width={this.gndTimeBarWidth()} isOver={extFisRow.dgtShortFlg} isPc={storage.isPc} />
        {extFisRow.dgtShortFlg && (
          <Time isPc={storage.isPc}>
            <ExcessTimeContainer time={extFisRow.estGndTime} />
          </Time>
        )}
      </BarArea>
    );
  }
}

const BarArea = styled.div<{ isPc: boolean }>`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  height: 6px;
`;

const Bar = styled.div<{ width: number; isOver: boolean; isPc: boolean }>`
  width: ${(props) => props.width}px;
  height: 100%;
  background: ${(props) => (props.isOver ? "#E554A6" : "#35BAB8")};
`;

const Time = styled.div<{ isPc: boolean }>`
  margin-left: 5px;
  font-size: 16px;
  ${(props) => (props.isPc ? "" : "font-weight: bold;")}
`;
