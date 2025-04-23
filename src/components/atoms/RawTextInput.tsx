import React from "react";
import styled, { css } from "styled-components";
import { Const } from "../../lib/commonConst";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled: boolean;
  isShadowOnFocus?: boolean;
  isShowingShadow?: boolean;
  isFixedFocus: boolean;
  isDirty?: boolean;
  isForceError?: boolean;
  terminalCat: Const.TerminalCat | null;
  onEnter?: () => void;
};

class RawTextInput extends React.Component<Props> {
  refInput: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.refInput = props.inputRef || React.createRef<HTMLInputElement>();
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  focus() {
    if (this.refInput.current) {
      this.refInput.current.focus();
    }
  }

  render() {
    const { onEnter, terminalCat, disabled, isShadowOnFocus, isShowingShadow, isDirty, isForceError, ...inputProps } = this.props;
    return (
      <Wrapper>
        <Input
          ref={this.refInput}
          {...inputProps}
          terminalCat={terminalCat}
          disabled={disabled}
          isShadowOnFocus={isShadowOnFocus}
          isShowingShadow={isShowingShadow}
          isDirty={isDirty}
          isError={isForceError}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (onEnter && e.keyCode === 13) {
              onEnter();
            }
          }}
          onBlur={() => {
            if (this.refInput.current && this.props.isFixedFocus) {
              this.refInput.current.focus(); /* 他にフォーカスさせない */
            }
          }}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled.input<{
  terminalCat: Const.TerminalCat | null;
  isShadowOnFocus?: boolean;
  isShowingShadow?: boolean;
  isDirty?: boolean;
  isError?: boolean;
}>`
  ${({ terminalCat }) => (terminalCat !== Const.TerminalCat.pc ? "padding-top: 5px;" : "")}
  padding-left: 6px;
  padding-right: 6px;
  height: 44px;
  color: ${(props) => (props.isDirty ? props.theme.color.text.CHANGED : "#000")};
  font-size: 20px;
  border: 1px solid ${(props) => (props.isError ? props.theme.color.border.ERROR : props.theme.color.border.PRIMARY)};
  border-radius: 0;
  width: 148px;
  appearance: none;
  -webkit-appearance: none;
  ::placeholder {
    ${({ terminalCat }) => (terminalCat !== Const.TerminalCat.pc ? "padding-top: 3px;" : "")};
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ${(props) => {
    if (props.disabled) {
      return css`
        opacity: 1;
        background-color: #fff;
        cursor: text;
      `;
    }
    return null;
  }}
  ${(props) => {
    if (props.isShowingShadow) {
      return css`
        border: 1px solid #2e85c8;
        box-shadow: 0px 0px 7px #60b7fa;
      `;
    }
    if (props.isShadowOnFocus) {
      return css`
        &:focus {
          border: 1px solid #2e85c8;
          box-shadow: 0px 0px 7px #60b7fa;
        }
      `;
    }
    return null;
  }};
`;

export default RawTextInput;
