import React from "react";
import styled, { css } from "styled-components";
import RoundButton, { Props } from "./RoundButton";
import PlusIcon from "../../assets/images/icon/plus.svg?component";

const RoundButtonPlusFlt: React.FC<Props> = (props) => {
  const { onClick, disabled, ...otherProps } = props;
  return (
    <PlusButtonBase onClick={!disabled ? onClick : undefined} disabled={!!disabled} {...otherProps}>
      <PlusIcon />
      <span className="label">FLT</span>
    </PlusButtonBase>
  );
};

const PlusButtonBase = styled(RoundButton)<{ disabled: boolean }>`
  ${({ scale }) => (scale ? `transform: scale(${scale})` : undefined)};
  background-color: ${(props) => props.theme.color.button.PRIMARY};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  ${({ disabled }) =>
    !disabled
      ? css`
          cursor: pointer;
          &:hover,
          &:focus {
            background: ${(props) => props.theme.color.button.PRIMARY_HOVER};
          }
          &:active {
            background: ${(props) => props.theme.color.button.PRIMARY_ACTIVE};
          }
        `
      : undefined}
  .label {
    font-size: 16px;
    color: #fff;
    padding-top: 1px;
  }
  svg {
    fill: #fff;
    padding: 1px;
  }
`;

export default RoundButtonPlusFlt;
