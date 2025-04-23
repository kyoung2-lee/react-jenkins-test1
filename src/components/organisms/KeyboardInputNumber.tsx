import React from "react";
import styled from "styled-components";
import KeyTop from "../atoms/KeyTop";
import DelIcon from "../../assets/images/icon/icon-del.svg?component";
import KeyTopExecutable from "../atoms/KeyTopExecutable";
import { storage } from "../../lib/storage";

interface Props {
  clear: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  handle: (value: string) => void;
}

const KeyboardInputNumber: React.FC<Props> = ({ clear, onSubmit, canSubmit, handle }) => (
  <Column>
    <KeyCol>
      <KeyTop input={() => handle("7")}>7</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => handle("8")}>8</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => handle("9")}>9</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => handle("4")}>4</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => handle("5")}>5</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => handle("6")}>6</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => handle("1")}>1</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => handle("2")}>2</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => handle("3")}>3</KeyTop>
    </KeyCol>
    <KeyBottomCol>
      <DelKey input={clear}>
        <DelIcon />
      </DelKey>
    </KeyBottomCol>
    <KeyBottomCol>
      <KeyTop input={() => handle("0")}>0</KeyTop>
    </KeyBottomCol>
    <KeyBottomCol>
      {canSubmit ? (
        <GoKey input={onSubmit} isPc={storage.isPc}>
          Go
        </GoKey>
      ) : (
        <GoKeyDisable isPc={storage.isPc}>Go</GoKeyDisable>
      )}
    </KeyBottomCol>
  </Column>
);

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const KeyCol = styled.div`
  width: 108px;
  padding-bottom: 10px;
`;

const KeyBottomCol = styled.div`
  width: 108px;
`;

const DelKey = styled(KeyTop)`
  color: #222222;
  background: #abb3bb;

  svg {
    width: 30px;
    .a {
      fill: none;
    }
    .b,
    .d {
      fill: #222;
    }
    .c,
    .d {
      stroke: none;
    }
  }
`;

const GoKey = styled(KeyTopExecutable)<{ isPc: boolean }>`
  color: #ffffff;
  font-size: 18px;
  ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
  background: #1075e7;
`;

const GoKeyDisable = styled(KeyTopExecutable)<{ isPc: boolean }>`
  font-size: 18px;
  ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
`;

export default KeyboardInputNumber;
