import React from "react";
import styled from "styled-components";
import { storage } from "../../lib/storage";
import closeIcon from "../../assets/images/icon/icon-close.svg";

interface Props {
  tabIndex?: number;
  className?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

const CloseButton: React.FC<Props> = (props: Props) => (
  <Button
    type="button"
    tabIndex={props.tabIndex}
    className={props.className}
    onClick={props.onClick}
    isIphone={storage.isIphone}
    isIpad={storage.isIpad}
    style={props.style}
  >
    <img src={closeIcon} alt="" />
  </Button>
);

const Button = styled.button<{ isIphone: boolean; isIpad: boolean }>`
  position: absolute;
  background: initial;
  top: 0;
  right: 0;
  height: ${({ isIphone }) => (isIphone ? "40px" : "34px")};
  width: ${({ isIphone }) => (isIphone ? "40px" : "34px")};
  padding: ${({ isIphone }) => (isIphone ? "10px" : "7px")};
  margin: ${({ isIphone }) => (isIphone ? "0" : "3px")};
  outline: none;
  border: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  > img {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
  }
`;

export default CloseButton;
