import React from "react";
import styled from "styled-components";
import { WorkStatus } from "../organisms/BarChart/selector";

interface Props {
  isPc: boolean;
  groundWorkStatus: WorkStatus;
  onClick: () => void;
}

const BarChartSwitchTag: React.FC<Props> = (props: Props) => {
  const { isPc, groundWorkStatus, onClick } = props;
  const tagColor = groundWorkStatus === WorkStatus.doing ? "#53C5B9" : groundWorkStatus === WorkStatus.done ? "#C7C7C7" : "#B7CECC";
  const tagShadeColor = groundWorkStatus === WorkStatus.doing ? "#419A91" : groundWorkStatus === WorkStatus.done ? "#9B9B9B" : "#8DA19F";
  return (
    <BarChartSwitchTagComponent isPc={isPc} onClick={onClick} tagColor={tagColor} tagShadeColor={tagShadeColor}>
      ▼
    </BarChartSwitchTagComponent>
  );
};

const BarChartSwitchTagComponent = styled.div<{ isPc: boolean; tagColor: string; tagShadeColor: string }>`
  position: absolute;
  cursor: pointer;
  pointer-events: auto;
  top: -19px;
  left: 35px;
  width: 40px;
  height: 22px;
  padding-top: ${(props) => (props.isPc ? "0" : "2px")};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.tagColor};
  color: #fff;
  font-size: 10px;
  font-weight: 100;
  &:after {
    position: absolute;
    content: "";
    top: 0;
    right: -4px;
    border: none;
    border-bottom: solid 19px ${(props) => props.tagShadeColor};
    border-right: solid 4px transparent;
  }
`;

export default BarChartSwitchTag;
