import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";
import { List } from "immutable";
import getIssueIcon from "../atoms/AirportIssueIcon";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";

interface Props {
  onClick?: ((event: React.MouseEvent<HTMLDivElement>) => void) | undefined;
  issus: HeaderInfoApi.Issu[];
  terminalUtcDate: dayjs.Dayjs | null;
  numberOfDisplay: number;
}

interface State {
  overflow: boolean;
  issus: List<HeaderInfoApi.Issu>;
}

class MovableAirportIcons extends React.Component<Props, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  private scrollAnimationInterval: number | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      overflow: false,
      issus: this.propsToIssuState(props.issus),
    };
  }

  componentDidMount() {
    this.scrollAnimationInterval = window.setInterval(() => {
      const { issus } = this.state;

      if (this.containerRef.current) {
        const parentNode: Element = this.containerRef.current;
        const lastChild = parentNode.lastElementChild;
        if (!lastChild) return;

        if (lastChild.getBoundingClientRect().right > parentNode.getBoundingClientRect().right) {
          // Fixed level icon (first child). Move second icon to last icon.
          const current = issus.skip(1).first();
          if (current) {
            const dequeued = issus.splice(1, 1);
            this.setState({ issus: dequeued.push(current) });
          }
        }
      }
    }, 1000);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    // ヘッダー情報が更新されたらstateも作り直す
    this.setState({
      issus: this.propsToIssuState(nextProps.issus),
    });
  }

  componentWillUnmount() {
    if (this.scrollAnimationInterval) {
      window.clearTimeout(this.scrollAnimationInterval);
    }
  }

  private propsToIssuState(issus: HeaderInfoApi.Issu[]): List<HeaderInfoApi.Issu> {
    return issus ? List.of(...issus) : List.of();
  }

  render() {
    const { onClick, terminalUtcDate, numberOfDisplay = 4 } = this.props;
    const { issus } = this.state;
    let sizeOfIcon = 44;
    let marginOfIcons = 10;
    let marginTop = 0;
    let marginLeft = 10;
    if (storage.terminalCat === Const.TerminalCat.iPad) {
      sizeOfIcon = 61;
      marginOfIcons = 14;
      marginTop = 0;
      marginLeft = 10;
    } else if (storage.terminalCat === Const.TerminalCat.iPhone) {
      sizeOfIcon = 39;
      marginOfIcons = 8;
      marginTop = 0;
      marginLeft = 0;
    }

    return (
      <AirportIcons
        ref={this.containerRef}
        onClick={onClick}
        numberOfDisplay={numberOfDisplay}
        sizeOfIcon={sizeOfIcon}
        marginOfIcons={marginOfIcons}
        marginTop={marginTop}
        marginLeft={marginLeft}
      >
        {issus && issus.map((issu) => getIssueIcon({ issu, key: issu.issuCd + issu.issuDtlCd, terminalUtcDate }))}
      </AirportIcons>
    );
  }
}

const AirportIcons = styled.div<{
  numberOfDisplay: number;
  sizeOfIcon: number;
  marginOfIcons: number;
  marginTop: number;
  marginLeft: number;
}>`
  display: block; /* flexにすると初回の表示が崩れるので注意 */
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  height: ${({ sizeOfIcon }) => sizeOfIcon + 3 + 6}px;
  max-width: ${({ numberOfDisplay, sizeOfIcon, marginOfIcons }) => numberOfDisplay * (sizeOfIcon + marginOfIcons) - 2}px;
  margin-top: ${({ marginTop }) => marginTop}px;
  margin-left: ${({ marginLeft }) => marginLeft}px;
  padding-top: 3px; /* ドロップシャドウのための余白 */
  > img {
    margin-right: ${({ marginOfIcons }) => marginOfIcons}px;
    width: ${({ sizeOfIcon }) => sizeOfIcon}px;
    height: ${({ sizeOfIcon }) => sizeOfIcon + 6}px;
    padding-bottom: 6px;
    filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.7));
    :nth-of-type(n + ${({ numberOfDisplay }) => numberOfDisplay + 1}) {
      visibility: hidden; /* ドロップシャドーの見切れを完全に消すため見えないアイコンは非表示 */
    }
  }
`;

export default MovableAirportIcons;
