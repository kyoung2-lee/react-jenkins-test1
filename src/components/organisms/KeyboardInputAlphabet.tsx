import React from "react";
import styled from "styled-components";
import KeyTop from "../atoms/KeyTop";
import DelIcon from "../../assets/images/icon/icon-del.svg?component";
import KeyTopExecutable from "../atoms/KeyTopExecutable";

interface Props {
  clear: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  handle: (value: string) => void;
}

const KeyboardInputAlphabet: React.FC<Props> = ({ clear, onSubmit, canSubmit, handle }) => (
  <div>
    <Column>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("Q")}>Q</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("W")}>W</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("E")}>E</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("R")}>R</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("T")}>T</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("Y")}>Y</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("U")}>U</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("I")}>I</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("O")}>O</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("P")}>P</KeyTop>
      </KeyAlphabetCol>
    </Column>
    <Column>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("A")}>A</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("S")}>S</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("D")}>D</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("F")}>F</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("G")}>G</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("H")}>H</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("J")}>J</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("K")}>K</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("L")}>L</KeyTop>
      </KeyAlphabetCol>
    </Column>
    <Column>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("Z")}>Z</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("X")}>X</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("C")}>C</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("V")}>V</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("B")}>B</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("N")}>N</KeyTop>
      </KeyAlphabetCol>
      <KeyAlphabetCol>
        <KeyTop input={() => handle("M")}>M</KeyTop>
      </KeyAlphabetCol>
    </Column>
    <Column>
      <KeyBottomCol>
        <DelKey input={clear}>
          <DelIcon />
        </DelKey>
      </KeyBottomCol>
      <KeyBottomCol />
      <KeyBottomCol>{canSubmit ? <GoKey input={onSubmit}>Go</GoKey> : <GoKeyDisable>Go</GoKeyDisable>}</KeyBottomCol>
    </Column>
  </div>
);

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  &:last-child {
    justify-content: space-between;
  }
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

const GoKey = styled(KeyTopExecutable)`
  color: #ffffff;
  font-size: 18px;
  background: #1075e7;
`;

const GoKeyDisable = styled(KeyTopExecutable)`
  font-size: 18px;
`;

const KeyAlphabetCol = styled.div`
  width: 10%;
  padding: 0px 2px 10px;
`;

export default KeyboardInputAlphabet;
