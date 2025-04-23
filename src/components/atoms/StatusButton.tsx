import React from "react";
import { WrappedFieldInputProps, WrappedFieldProps } from "redux-form";
import styled from "styled-components";

type Props = WrappedFieldProps & {
  width?: string;
  height?: string;
  marginLeft?: string;
  tabIndex?: number;
  option: { label: string; value: string };
  id: string;
  onClickInput: (input: WrappedFieldInputProps, value: string) => void;
};

class StatusButton extends React.Component<Props> {
  render() {
    const {
      width,
      height,
      marginLeft,
      tabIndex,
      input,
      option: { value, label },
      id = "",
    } = this.props;
    const { name } = input;
    const inputValue = input.value as unknown;
    const checked = inputValue === value;

    return (
      <Wrapper checked={checked} width={width} height={height} marginLeft={marginLeft}>
        <label htmlFor={id}>
          <input id={id} type="radio" name={name} tabIndex={tabIndex} value={value} onClick={() => this.props.onClickInput(input, value)} />
          <span>{label}</span>
        </label>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div<{ width?: string; height?: string; marginLeft?: string; checked: boolean }>`
  ${({ width }) => (width ? `width: ${width};` : "")}
  ${({ height }) => (height ? `height: ${height};` : "")}
  margin-left: ${({ marginLeft }) => marginLeft || "0px"};
  background-color: ${({ checked }) => (checked ? "#E6B422" : "#EEEEEE")};
  color: ${({ checked }) => (checked ? "#FFFFFF" : "#346181")};
  border-radius: 4px;
  padding: 0;
  border: 1px solid #346181;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  > label {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 12px;
    cursor: pointer;
    > input {
      position: absolute;
      clip: rect(0, 0, 0, 0);
    }
    > span {
      font-size: 18px;
    }
  }
`;

export default StatusButton;
