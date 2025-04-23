import React from "react";
import styled, { StyledComponentPropsWithRef } from "styled-components";
import { storage } from "../../lib/storage";

interface Props {
  tabIndex?: number;
  text: string;
  disabled?: boolean;
  icon?: JSX.Element;
  type?: StyledComponentPropsWithRef<typeof Button>["type"];
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

class SecondaryButton extends React.Component<Props> {
  render() {
    const { tabIndex, text, icon, type, onClick, disabled } = this.props;
    return (
      <Button tabIndex={tabIndex} type={type} onClick={onClick} disabled={disabled} isPc={storage.isPc}>
        {icon}
        {text}
      </Button>
    );
  }
}

const Button = styled.button<{ isPc: typeof storage.isPc }>`
  width: 100%;
  background: ${(props) => props.theme.color.button.SECONDARY};
  height: 44px;
  color: ${(props) => props.theme.color.PRIMARY};
  border-radius: 4px;
  padding: 0;
  border: solid 2px ${(props) => props.theme.color.PRIMARY};
  font-size: 20px;

  ${({ disabled, theme, isPc }) =>
    disabled
      ? "opacity: 0.6;"
      : `
      cursor: pointer;
      ${
        isPc
          ? `
        &:hover, &:focus {
          background: ${theme.color.button.SECONDARY_HOVER};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
        }
        &:active {
          background: ${theme.color.button.SECONDARY_ACTIVE};
        }
      `
          : `
        &:active {
          background: ${theme.color.button.SECONDARY_ACTIVE};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
        }
      `
      }
  `};

  svg {
    width: 10px;
    height: 10px;
    margin-right: 4px;
    path {
      fill: ${(props) => props.theme.color.WHITE};
    }
  }
`;

export default SecondaryButton;
