import React from "react";
import styled from "styled-components";
import { storage } from "../../lib/storage";
import { Const } from "../../lib/commonConst";

interface Props {
  input?: () => void;
  children: React.ReactNode;
}

const KeyTopExecutable: React.FC<Props> = (props) => {
  const { input } = props;
  return <KeyBottonExecutable onClick={() => input && input()} terminalCat={storage.terminalCat} {...props} />;
};

const KeyBottonExecutable = styled.div<{ enter?: boolean; terminalCat: string | null }>`
  display: flex;
  padding: 2px 0 0 0;
  outline: none;
  cursor: pointer;
  height: 44px;
  width: 100%;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 5px;
  color: #222222;
  font-size: 28px;
  box-shadow: 2px 2px 4px #abb3bb;
  background-color: #ffffff;

  ${({ terminalCat }) =>
    terminalCat === Const.TerminalCat.pc
      ? `&:hover {
    opacity: 0.8;
  }`
      : ""}
`;

export default KeyTopExecutable;
