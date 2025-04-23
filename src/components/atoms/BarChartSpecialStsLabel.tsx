import React from "react";
import styled from "styled-components";

interface Props {
  isPc: boolean;
  children: React.ReactNode;
}

const BarChartSpecialStsLabel: React.FC<Props> = (props: Props) => {
  const { isPc, children } = props;
  return children ? <SpecialStsLabel isPc={isPc}>{children}</SpecialStsLabel> : null;
};

const SpecialStsLabel = styled.div<{ isPc: boolean }>`
  margin: auto;
  width: fit-content;
  padding: 0.15em 0.4em 0em;
  font-size: ${({ isPc }) => (isPc ? "13px" : "14px")};
  color: #fff;
  background: rgb(57, 65, 72);
  border-radius: 3px;
`;

export default BarChartSpecialStsLabel;
