import React from "react";
import styled, { css } from "styled-components";
import { storage } from "../../lib/storage";

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const RoundButtonSmall: React.FC<Props> = (props) => <Button type="button" {...props} isPc={storage.isPc} />;

const Button = styled.button<{ disabled?: boolean; isPc: boolean }>`
  width: 24px;
  height: 24px;
  padding: 0; /* iPad, iPhoneの崩れ防止 */
  outline: none;
  border: 0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${(props) => props.theme.color.button.PRIMARY};
  ${({ disabled, isPc }) =>
    disabled
      ? "opacity: 0.6;"
      : css`
          cursor: pointer;
          ${isPc
            ? css`
                &:hover,
                &:focus {
                  background: ${(props) => props.theme.color.button.PRIMARY_HOVER};
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
                &:active {
                  background: ${(props) => props.theme.color.button.PRIMARY_ACTIVE};
                }
              `
            : css`
                &:active {
                  background: ${(props) => props.theme.color.button.PRIMARY_ACTIVE};
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
              `}
        `}
  svg {
    width: 12px;
    height: 12px;
  }
`;

export default RoundButtonSmall;
