import React from "react";
import styled from "styled-components";

interface ContainerProps {
  disabled?: boolean;
  custom?: boolean;
  completed?: boolean;
  current?: boolean;
  onClick?: () => void;
}

type Props = {
  title: string;
} & ContainerProps;

const ProcessItem: React.FC<Props> = (props) => {
  const { title, ...containerProps } = props;

  if (props.custom) {
    if (props.completed) {
      return <CompletedCustomContainer {...containerProps}>{title}</CompletedCustomContainer>;
    }
    return <WaitingCustomContainer {...containerProps}>{title}</WaitingCustomContainer>;
  }
  if (props.completed) {
    return <CompletedContainer {...containerProps}>{title}</CompletedContainer>;
  }
  if (props.current) {
    return <CurrentContainer {...containerProps}>{title}</CurrentContainer>;
  }
  return <WaitingContainer {...containerProps}>{title}</WaitingContainer>;
};

const WaitingContainer = styled.div<ContainerProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  font-size: 20px;

  color: #32bbe5;
  border: 1px solid #32bbe5;
  background-color: #fff;

  box-shadow: ${(props) => (props.disabled ? "none" : "2px 2px 4px rgba(0, 0, 0, 0.2)")};
  cursor: ${(props) => (props.disabled ? "inherit" : "pointer")};
  opacity: ${(props) => (props.disabled ? "0.8" : "1")};

  &:hover {
    opacity: 0.8;
  }
`;

const CompletedContainer = styled(WaitingContainer)`
  color: ${(props) => props.theme.color.DEFAULT_FONT_COLOR};
  border: 1px solid #fff;
  background-color: #c9d3d0;
`;

const CurrentContainer = styled(WaitingContainer)`
  color: #fff;
  border: 1px solid #fff;
  background-color: #32bbe5;
`;

const CompletedCustomContainer = styled(WaitingContainer)`
  color: ${(props) => props.theme.color.DEFAULT_FONT_COLOR};
  border: 1px solid #346181;
  background-color: #c9d3d0;
`;

const WaitingCustomContainer = styled(WaitingContainer)`
  color: ${(props) => props.theme.color.DEFAULT_FONT_COLOR};
  border: 1px solid #346181;
  background-color: #fff;
`;

export default ProcessItem;
