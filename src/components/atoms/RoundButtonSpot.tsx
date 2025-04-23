import React from "react";
import styled, { css } from "styled-components";
import RoundButton, { Props } from "./RoundButton";
import Cross from "../../assets/images/icon/icon-cross.svg?component";

type MyProps = {
  isActiveColor: boolean;
};

const RoundButtonSpot: React.FC<Props & MyProps> = (props) => {
  const { onClick, disabled, ...otherProps } = props;
  return (
    <SpotButtonBase onClick={!disabled ? onClick : undefined} disabled={disabled} {...otherProps}>
      <span className="label">SPOT</span>
      <CrossIcon />
    </SpotButtonBase>
  );
};

const SpotButtonBase = styled(RoundButton)<{ isActiveColor?: boolean }>`
  background-color: ${(props) => (props.isActiveColor ? "#e6b422" : props.theme.color.button.PRIMARY)};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  ${({ disabled, isActiveColor, theme }) =>
    !disabled
      ? css`
          cursor: pointer;
          &:hover,
          &:focus {
            background: ${isActiveColor ? "#dbab1f" : theme.color.button.PRIMARY_HOVER};
          }
          &:active {
            background: ${isActiveColor ? "#cea120" : theme.color.button.PRIMARY_ACTIVE};
          }
        `
      : undefined}
  .label {
    font-size: 14px;
    color: #fff;
    font-weight: normal;
    position: absolute;
    top: 10px;
  }
  svg {
    width: 27px;
    height: 27px;
  }
`;

const CrossIcon = styled(Cross).attrs({ viewBox: "0 0 360 360" })`
  fill: #fff;
  position: absolute;
  top: 24px;
`;
export default RoundButtonSpot;
