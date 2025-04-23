import React from "react";
import { WrappedFieldProps } from "redux-form";
import styled from "styled-components";

type Props = WrappedFieldProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    isShowEditedColor?: boolean;
    isShadowOnFocus?: boolean;
  };

const CheckBoxInput: React.FC<Props> = (props: Props) => {
  const {
    input,
    disabled,
    isShowEditedColor,
    isShadowOnFocus,
    meta: { dirty },
    ...inputHTMLAttributes
  } = props;

  return (
    <CheckBox
      {...input}
      {...inputHTMLAttributes}
      type="checkbox"
      disabled={!!disabled}
      isShowEditedColor={!!isShowEditedColor}
      dirty={dirty}
      isShadowOnFocus={!!isShadowOnFocus}
    />
  );
};

export const CheckBox = styled.input<{ disabled: boolean; isShowEditedColor?: boolean; dirty?: boolean; isShadowOnFocus?: boolean }>`
  /* margin-right: 6px; */
  appearance: none;
  width: 30px;
  height: 30px;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  background: #fff;
  /* background: ${(props) => (props.isShowEditedColor && props.dirty ? props.theme.color.background.DELETED : "#fff")}; */
  position: relative;
  outline: none;
  opacity: 1;
  &:focus {
    border: 1px solid #2e85c8;
    box-shadow: ${({ isShadowOnFocus }) => (isShadowOnFocus ? "0px 0px 7px #60B7FA" : "unset")};
  }
  &:checked {
    border-color: ${(props) => props.theme.color.PRIMARY};
    background: ${(props) => props.theme.color.PRIMARY};
    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 4px;
      left: 9px;
      width: 9px;
      height: 14px;
      transform: rotate(45deg);
      border-bottom: ${({ disabled }) => (disabled ? "3px solid #222" : "3px solid #fff")};
      border-right: ${({ disabled }) => (disabled ? "3px solid #222" : "3px solid #fff")};
    }
  }
  &:indeterminate,
  &.indeterminate {
    border-color: ${(props) => props.theme.color.PRIMARY};
    background: ${(props) => props.theme.color.PRIMARY};
    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 14px;
      left: 7px;
      width: 16px;
      border-bottom: 2px solid #fff;
    }
  }

  &:disabled {
    border-color: ${(props) => props.theme.color.button.PRIMARY_OFF};
    background: ${(props) => props.theme.color.button.PRIMARY_OFF};
  }
`;

export default CheckBoxInput;
