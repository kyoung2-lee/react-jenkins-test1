import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import PrimaryButton from "../atoms/PrimaryButton";

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  dateTimeValue: string;
  timeDiff: number; // 時差（時間と分のhhmm形式）
  onClick: (value: string) => void;
  width?: string;
  height?: string;
  disabled?: boolean;
}

const TimeInputPanel: React.FC<Props> = (props) => {
  const handleOnClickCurrent = () => {
    const { onClick, timeDiff } = props;
    const timeDiffUtcHr = Math.trunc(timeDiff / 100);
    const timeDiffUtcMin = timeDiff % 100;
    if (onClick) {
      onClick(dayjs.utc().second(0).add(timeDiffUtcMin, "minute").add(timeDiffUtcHr, "hour").format("YYYY-MM-DD[T]HH:mm:ss"));
    }
  };

  return (
    <Container>
      <PrimaryButton
        type="button"
        text="Current"
        width={props.width || "88px"}
        height={props.height || "44px"}
        onClick={handleOnClickCurrent}
        disabled={props.disabled}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

export default TimeInputPanel;
