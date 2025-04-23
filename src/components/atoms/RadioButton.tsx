import React from "react";
import { WrappedFieldProps } from "redux-form";
import styled, { css } from "styled-components";

type Props = WrappedFieldProps & {
  id?: string;
  tabIndex?: number;
  value: string;
  type: string;
  isShadowOnFocus?: boolean;
  onClick?: () => void;
  innerRef?: React.RefObject<HTMLInputElement>;
  autoFocus?: boolean;
  disabled?: boolean;
};

const RadioButton = (props: Props) => {
  const { id, tabIndex, input, isShadowOnFocus, onClick, innerRef, autoFocus, disabled } = props;
  return (
    <RadioButtonStyled
      ref={innerRef}
      type="radio"
      id={id}
      tabIndex={tabIndex}
      onClick={onClick}
      {...input}
      isShadowOnFocus={isShadowOnFocus}
      autoFocus={autoFocus}
      disabled={disabled}
    />
  );
};

export const RadioButtonStyled = styled.input<{ isShadowOnFocus?: boolean; disabled?: boolean }>`
  margin-right: 5px;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #346181;
  background: ${({ disabled }) => (disabled ? "#EBEBE4" : "#FFF")};
  position: relative;
  outline: none;
  ${({ disabled }) => (disabled ? "opacity: 0.6;" : "")}
  ${({ isShadowOnFocus }) =>
    isShadowOnFocus
      ? css`
          &:focus {
            border: 1px solid #2e85c8;
            box-shadow: 0px 0px 7px #60b7fa;
          }
        `
      : null}
  &:checked {
    border-color: #346181;
    background: #346181;
  }
  &:checked:before {
    content: "";
    display: block;
    position: absolute;
    top: 6px;
    left: 6px;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
  }
`;

export default RadioButton;
