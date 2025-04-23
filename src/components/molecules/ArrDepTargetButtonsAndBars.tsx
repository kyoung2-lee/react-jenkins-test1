import React from "react";
import styled from "styled-components";
import DownArrow from "../../assets/images/icon/icon-arrow_down_bold.svg";
import ArrDepBars, { Props as ArrDepBarsProps } from "../atoms/ArrDepBars";
import ArrDepTargetButtons, { Target } from "../atoms/ArrDepTargetButtons";

type Props = {
  targetButtonsFixed?: boolean;
  onClickTarget: (target: Target) => void;
} & ArrDepBarsProps;

const ArrDepTargetButtonsAndBars = (props: Props) => (
  <Wrapper>
    <ArrDepTargetButtons fixed={props.targetButtonsFixed} selectedTarget={props.selectedTarget} onClickTarget={props.onClickTarget} />
    <ArrDepBars selectedTarget={props.selectedTarget} arr={props.arr} dep={props.dep} />
    {props.selectedTarget ? (
      <IconWrapper>
        <DownArrowIcon />
      </IconWrapper>
    ) : null}
  </Wrapper>
);

const Wrapper = styled.div`
  height: 132px;
`;

const IconWrapper = styled.div`
  text-align: center;
  margin-bottom: -6px;
`;

const DownArrowIcon = styled.img.attrs({ src: DownArrow })`
  position: relative;
  top: -4px;
  width: 18px;
  height: 18px;
  fill: ${({ theme }) => theme.color.DEFAULT_FONT_COLOR};
`;

export default ArrDepTargetButtonsAndBars;
