import React from "react";
import styled, { css } from "styled-components";
import RoundButton, { Props } from "./RoundButton";
import Mode from "../../assets/images/icon/icon-mode.svg";

type MyProps = {
  isActiveColor: boolean;
};

const RoundButtonMode: React.FC<Props & MyProps> = (props) => {
  const { onClick, disabled, ...otherProps } = props;
  return (
    <ModeButtonBase onClick={!disabled ? onClick : undefined} disabled={disabled} {...otherProps}>
      <ModeIcon />
      <span className="label">UTC</span>
    </ModeButtonBase>
  );
};

const ModeButtonBase = styled(RoundButton)<{ isActiveColor?: boolean }>`
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
    font-size: 16px;
    color: #fff;
    padding-top: 1px;
  }
`;

const ModeIcon = styled.img.attrs({ src: Mode })`
  width: 26px;
  height: 26px;
`;

export default RoundButtonMode;
