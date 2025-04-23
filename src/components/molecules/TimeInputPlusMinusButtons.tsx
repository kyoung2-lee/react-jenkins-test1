import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import RoundButtonSmallPlus from "../atoms/RoundButtonSmallPlus";
import RoundButtonSmallMinus from "../atoms/RoundButtonSmallMinus";

interface Props {
  dateTimeValue?: string; // CustomEventを使わない場合は必須
  onClick?: (value: string) => void; // CustomEventを使わない場合は必須
  onClickMinusCustomEvent?: () => void;
  onClickPlusCustomEvent?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  showDisabled?: boolean;
  notFocus?: boolean;
}

const TimeInputPlusMinusButtons: React.FC<Props> = (props) => {
  const { onClick, dateTimeValue, onClickMinusCustomEvent, onClickPlusCustomEvent } = props;

  const calcDateTimeValue = (minutes: number) => {
    if (dateTimeValue) {
      const dayjsValue = dayjs(dateTimeValue);
      if (dayjsValue.isValid()) {
        if (onClick) {
          onClick(dayjsValue.add(minutes, "minute").format("YYYY-MM-DD[T]HH:mm:ss"));
        }
      }
    }
  };

  const handleOnClickMinus = () => {
    if (onClickMinusCustomEvent) {
      onClickMinusCustomEvent();
    } else {
      calcDateTimeValue(-1);
    }
  };

  const handleOnClickPlus = () => {
    if (onClickPlusCustomEvent) {
      onClickPlusCustomEvent();
    } else {
      calcDateTimeValue(1);
    }
  };

  const { children, disabled, showDisabled, notFocus = false } = props;
  const tabIndex = notFocus ? -1 : undefined;
  return (
    <Container>
      <ButtonContainer showDisabled={showDisabled}>
        {showDisabled ? (
          <RoundButtonSmallMinus disabled={disabled} type="button" onClick={handleOnClickMinus} tabIndex={tabIndex} />
        ) : (
          !disabled && <RoundButtonSmallMinus type="button" onClick={handleOnClickMinus} tabIndex={tabIndex} />
        )}
      </ButtonContainer>
      {children}
      <ButtonContainer showDisabled={showDisabled}>
        {showDisabled ? (
          <RoundButtonSmallPlus disabled={disabled} type="button" onClick={handleOnClickPlus} tabIndex={tabIndex} />
        ) : (
          !disabled && <RoundButtonSmallPlus type="button" onClick={handleOnClickPlus} tabIndex={tabIndex} />
        )}
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: flex-end;
`;
const ButtonContainer = styled.div<{ showDisabled?: boolean }>`
  display: flex;
  width: ${({ showDisabled }) => (showDisabled ? 36 : 40)}px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

export default TimeInputPlusMinusButtons;
