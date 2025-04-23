import React from "react";
import styled from "styled-components";

export type Props = {
  scale?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const RoundButton: React.FC<Props> = (props) => <Button {...props} />;

const Button = styled.button<{ scale?: number }>`
  ${({ scale }) => (scale ? `transform: scale(${scale})` : undefined)};
  width: 60px;
  height: 60px;
  outline: none;
  background: ${(props) => props.theme.color.button.PRIMARY};
  border: 2px solid ${(props) => props.theme.color.PRIMARY_BASE};
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
    color: ${(props) => props.theme.color.PRIMARY_BASE};
  }
`;

export default RoundButton;
