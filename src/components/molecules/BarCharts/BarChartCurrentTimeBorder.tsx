import React from "react";
import styled from "styled-components";

interface Props {
  position: number;
}
export default class BarChartCurrentTimeBorder extends React.Component<Props> {
  render() {
    if (this.props.position < 0) {
      return "";
    }
    return <Border left={this.props.position} />;
  }
}

const Border = styled.div<{ left: number }>`
  position: absolute;
  top: 0;
  z-index: 99999;
  bottom: 0;
  left: ${({ left }) => left}px;
  width: 0px;
  border-left: thin solid #b8261f; /* thinはブラウザの縮小zoomに対応 */
`;
