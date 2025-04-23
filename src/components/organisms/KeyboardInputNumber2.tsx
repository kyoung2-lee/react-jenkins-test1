import React from "react";
import styled from "styled-components";
import KeyTop from "../atoms/KeyTopWhite";
import DelIcon from "../../assets/images/icon/icon-del.svg?component";

interface Props {
  onDel: () => void;
  onNumKeyDown: (value: string) => void;
}

const KeyboardInputNumber: React.FC<Props> = ({ onDel, onNumKeyDown }) => (
  <Column>
    <KeyCol>
      <KeyTop input={() => onNumKeyDown("7")}>7</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => onNumKeyDown("8")}>8</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => onNumKeyDown("9")}>9</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => onNumKeyDown("4")}>4</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => onNumKeyDown("5")}>5</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => onNumKeyDown("6")}>6</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => onNumKeyDown("1")}>1</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => onNumKeyDown("2")}>2</KeyTop>
    </KeyCol>
    <KeyCol>
      <KeyTop input={() => onNumKeyDown("3")}>3</KeyTop>
    </KeyCol>
    <KeyBottomCol />
    <KeyBottomCol>
      <KeyTop input={() => onNumKeyDown("0")}>0</KeyTop>
    </KeyBottomCol>
    <KeyBottomCol>
      <DelKey input={onDel}>
        <DelIcon />
      </DelKey>
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
  svg {
    width: 30px;
    .a {
      fill: ${(props) => props.theme.color.button.PRIMARY};
    }
    .b {
      fill: #fff;
    }
  }
`;

export default KeyboardInputNumber;
