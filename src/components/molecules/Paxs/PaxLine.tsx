import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { PAX_FLIGHT_MINIMUM_FROM, PAX_FLIGHT_MINIMUM_TO } from "../../../lib/Pax";
import shipColorIcon from "../../../assets/images/icon/ship.svg";

interface Props {
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  minTime: dayjs.Dayjs;
  cellWidth: number;
  gridWidth: number;
  directionTo?: boolean;
  orgDateLcl: dayjs.Dayjs;
}

export class PaxLine extends React.PureComponent<Props> {
  private readonly metaContainerRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const metaContainer = this.metaContainerRef.current;
    if (!metaContainer) return;

    const left = (metaContainer.firstElementChild as HTMLDivElement).offsetLeft;

    if (left < 0) {
      metaContainer.style.marginRight = `${left - 3}px`;
      return;
    }

    const container = metaContainer.parentElement as HTMLDivElement;
    const containerWidth = container.getBoundingClientRect().width;
    const lastMetaElm = metaContainer.lastElementChild as HTMLDivElement;
    const right = lastMetaElm.offsetLeft + lastMetaElm.offsetWidth;

    if (right > containerWidth) {
      metaContainer.style.marginLeft = `${containerWidth - right - 3}px`;
    }
  }

  private normalizedWidth = (width: number) => {
    const { directionTo, cellWidth } = this.props;
    const paxLineWidth = cellWidth * 4;

    if (width > paxLineWidth) {
      return paxLineWidth;
    }

    if (directionTo) {
      // paxToの処理
      if (width < PAX_FLIGHT_MINIMUM_TO) {
        return PAX_FLIGHT_MINIMUM_TO;
      }
    } else if (width < PAX_FLIGHT_MINIMUM_FROM) {
      // paxFromの処理
      return PAX_FLIGHT_MINIMUM_FROM;
    }

    return width;
  };

  private position = () => {
    const { startTime, minTime, endTime } = this.props;

    const startMinDuration = dayjs.duration(startTime.diff(minTime));
    const endStartDuration = dayjs.duration(endTime.diff(startTime));

    const left = startMinDuration.asHours() * this.props.cellWidth;
    const width = endStartDuration.asHours() * this.props.cellWidth;
    const normalizedLeft =
      left < 0 ? 0 : left > this.props.gridWidth - PAX_FLIGHT_MINIMUM_TO ? this.props.gridWidth - PAX_FLIGHT_MINIMUM_TO : left;
    const normalizedWidth = this.normalizedWidth(width);

    return { left: normalizedLeft, width: normalizedWidth };
  };

  private isVisibledFlightScheduleDate = () => {
    const { startTime, endTime, directionTo, orgDateLcl } = this.props;
    const comparingOrgDateLcl = directionTo ? startTime : endTime;
    return orgDateLcl.format("YYYY-MM-DD") !== comparingOrgDateLcl.format("YYYY-MM-DD");
  };

  render() {
    const { startTime, endTime, directionTo } = this.props;
    const { left, width } = this.position();

    return (
      <Container left={left} width={width}>
        <LineContainer directionTo={directionTo}>
          <Line />
          <Ship directionTo={directionTo} />
        </LineContainer>
        <MetaContainer directionTo={directionTo} ref={this.metaContainerRef}>
          {this.isVisibledFlightScheduleDate() && <ShipTag>{(directionTo ? startTime : endTime).format("DDMMM").toUpperCase()}</ShipTag>}
          <EndTime>{directionTo ? startTime.format("HH:mm") : endTime.format("HH:mm")}</EndTime>
        </MetaContainer>
      </Container>
    );
  }
}

const Container = styled.div<{ left: number; width: number }>`
  position: absolute;
  top: 0;
  left: ${(props) => props.left}px;
  width: ${(props) => props.width}px;
  padding: 8px 0 0;
`;

const LineContainer = styled.div<{ directionTo?: boolean }>`
  width: 100%;
  height: 20px;
  padding: ${(props) => (props.directionTo ? "0 0 0 10px" : "0 10px 0 0")};
  position: relative;
`;

const Line = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(126, 193, 207, 0.6);
`;

const Ship = styled.img.attrs({ src: shipColorIcon })<{
  directionTo?: boolean;
}>`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  ${(props) => (props.directionTo ? "left: 0;" : "right: 0;")};
`;

const ShipTag = styled.span`
  background-color: #707070;
  padding: 2px 4px;
  color: #fff;
  font-size: 11px;
  border-radius: 2px;
  margin-right: 2px;
`;

const MetaContainer = styled.div<{ directionTo?: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.directionTo ? "flex-start" : "flex-end")};
  align-items: center;
  padding-top: 2px;
`;

const EndTime = styled.div`
  font-size: 14px;
`;
