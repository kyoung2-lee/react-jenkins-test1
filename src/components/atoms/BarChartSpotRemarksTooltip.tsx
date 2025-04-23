import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface Props {
  isActiveSpotTooltip: boolean;
  remarks: string;
  remarksLabelId: string;
  leftSideGridRef: React.RefObject<HTMLInputElement>;
}

const BarChartSpotRemarksTooltip: React.FC<Props> = (props: Props) => {
  const [tooltipTop, setTooltipTop] = useState(0);

  useEffect(() => {
    const { isActiveSpotTooltip, remarksLabelId, leftSideGridRef } = props;

    // 表示の場合は処理を行う
    // 高さ調整でstateが変更され、componentDidUpdateがループするためフラグ制御
    if (isActiveSpotTooltip) {
      // SPOT番号表示Grid 高さ取得
      let gridHeight = 0;
      if (leftSideGridRef.current) {
        gridHeight = leftSideGridRef.current.getBoundingClientRect().height;
      }

      // SPOTリマークスLabel TOP位置取得
      const remarksLabelElement = document.getElementById(remarksLabelId);
      const remarksTop = remarksLabelElement ? remarksLabelElement.getBoundingClientRect().top : 0;

      // render後にTooltipの高さ取得し、位置セット
      const tooltipElement = document.getElementById("remarksToolTip") ? document.getElementById("remarksToolTip") : null;
      const tooltipHeight = tooltipElement ? tooltipElement.clientHeight : 0;
      if (remarksTop <= gridHeight / 2 + tooltipHeight) {
        // Grid上部RemarksのTooltip位置
        setTooltipTop(remarksTop - 40 - 5);
      } else {
        // Grid下部RemarksのTooltip位置
        setTooltipTop(remarksTop - 40 + 10 - tooltipHeight);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isActiveSpotTooltip]);

  const { isActiveSpotTooltip, remarks } = props;
  return (
    <RemarksToolTip id="remarksToolTip" isActiveSpotTooltip={isActiveSpotTooltip} tooltipTop={tooltipTop}>
      {remarks}
    </RemarksToolTip>
  );
};

// transition-delayを有効にするため、opacity, visibilityで表示制御しています。
const RemarksToolTip = styled.div<{ isActiveSpotTooltip: boolean; tooltipTop: number }>`
  ${({ isActiveSpotTooltip }) =>
    isActiveSpotTooltip
      ? `
      opacity: 1;
      visibility: visible;
      transition-delay: 300ms;
    `
      : `
      opacity: 0;
      visibility: hidden;
  `};

  ${({ tooltipTop }) => (tooltipTop ? `top: ${tooltipTop}px;` : `top: ${tooltipTop}px;`)};

  position: absolute;
  overflow-wrap: break-word;
  left: 68px;
  width: 326px;
  z-index: 3;
  background: #fff;
  box-shadow: 2px 3px 9px rgba(0, 0, 0, 0.35);
  font-size: 14px;
  text-align: left;
  padding: 10px 5px 10px 10px;
  padding-right: 7px;
  display: inline-block;
  line-height: 1.3;
`;

export default BarChartSpotRemarksTooltip;
