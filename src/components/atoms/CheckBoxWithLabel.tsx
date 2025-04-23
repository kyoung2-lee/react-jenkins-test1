import React from "react";
import { WrappedFieldProps } from "redux-form";
import styled from "styled-components";
import CheckBoxInput from "./CheckBoxInput";

type Props = WrappedFieldProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    isShowEditedColor?: boolean;
    isShadowOnFocus?: boolean;
    text?: string;
    isPc?: boolean;
    id?: string;
  };

const CheckBoxWithLabel: React.FC<Props> = (props: Props) => {
  const { text, id, ...rest } = props;

  return (
    <CheckBoxDiv>
      <CheckBoxLabel htmlFor={id}>{text}</CheckBoxLabel>
      <CheckBoxInput id={id} {...rest} />
    </CheckBoxDiv>
  );
};

const CheckBoxDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;

  input {
    margin-top: 1px;
  }
  input:disabled {
    opacity: 0.6;
    background: #ebebe4;
    border: 1px solid #346181;
  }
`;

const CheckBoxLabel = styled.label`
  font-size: 12px;
  color: ${(props) => props.theme.color.DEFAULT_FONT_COLOR};
`;

export default CheckBoxWithLabel;
