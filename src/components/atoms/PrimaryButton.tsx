import React from "react";
import styled, { css, StyledComponentPropsWithRef } from "styled-components";
import { storage } from "../../lib/storage";

interface Props {
  tabIndex?: number;
  text: string;
  disabled?: boolean;
  icon?: JSX.Element;
  type?: StyledComponentPropsWithRef<typeof Button>["type"];
  className?: string;
  width?: string;
  height?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PrimaryButton: React.FC<Props> = (props) => {
  const { tabIndex, text, icon, type, onClick, disabled, className, width, height } = props;
  return (
    <Button
      className={className}
      tabIndex={tabIndex}
      type={type}
      onClick={onClick}
      disabled={disabled}
      isPc={storage.isPc}
      width={width}
      height={height}
    >
      {icon && icon}
      {icon && <div style={{ width: "4px" }} />}
      {text}
    </Button>
  );
};

const Button = styled.button<{ isPc: typeof storage.isPc; width: string | undefined; height: string | undefined }>`
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "44px"};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.color.button.PRIMARY};
  color: #fff;
  border-radius: 4px;
  padding: 0;
  border: 0;
  font-size: 20px;
  ${({ disabled, theme, isPc }) =>
    disabled
      ? "opacity: 0.6;"
      : css`
          cursor: pointer;
          ${isPc
            ? css`
                &:hover,
                &:focus {
                  background: ${theme.color.button.PRIMARY_HOVER};
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
                &:active {
                  background: ${theme.color.button.PRIMARY_ACTIVE};
                }
              `
            : css`
                &:active {
                  background: ${theme.color.button.PRIMARY_ACTIVE};
                  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
                }
              `}
        `};
`;

export default PrimaryButton;
