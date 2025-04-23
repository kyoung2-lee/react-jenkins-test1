import React from "react";
import styled, { css, StyledComponentPropsWithRef } from "styled-components";
import { storage } from "../../lib/storage";

interface Props {
  tabIndex?: number;
  text: string;
  disabled?: boolean;
  type?: StyledComponentPropsWithRef<typeof Button>["type"];
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const InputButton: React.FC<Props> = (props) => {
  const { tabIndex, text, type, onClick, disabled } = props;
  return (
    <Button tabIndex={tabIndex} type={type} onClick={onClick} disabled={disabled} isPc={storage.isPc}>
      {text}
    </Button>
  );
};

const Button = styled.button<{ isPc: typeof storage.isPc }>`
  min-width: 44px;
  min-height: 40px;
  background: #fff;
  color: ${(props) => props.theme.color.PRIMARY};
  border-radius: 4px;
  padding: 4px;
  border: solid 1px ${(props) => props.theme.color.border.PRIMARY};
  font-size: 13px;

  ${({ disabled, isPc }) =>
    disabled
      ? css`
          opacity: 0.6;
        `
      : css`
          cursor: pointer;
          ${isPc
            ? css`
                &:hover,
                &:focus {
                  background: #eeeeee;
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
                &:active {
                  background: #e2e2e2;
                }
              `
            : css`
                &:active {
                  background: #e2e2e2;
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
              `}
        `};
`;

export default InputButton;
