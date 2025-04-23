import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import { FlightChangeHistory as FlightChangeHistoryState } from "../../reducers/flightContents";
import Player from "../../assets/images/icon/icon-player.png";

interface Props {
  flightChangeHistory: FlightChangeHistoryState;
  scrollContentRef?: React.RefObject<HTMLDivElement>;
  scrollContentOnClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

export default class FlightChangeHistory extends React.Component<Props> {
  private flightChangeHistoryScrollRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.flightChangeHistoryScrollRef = this.props.scrollContentRef || React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    if (this.flightChangeHistoryScrollRef.current) {
      this.flightChangeHistoryScrollRef.current.focus();
    }
  }

  renderHistory(history: FlightChangeHistoryApi.History[]) {
    return history.map((hist, index) => {
      const regex = /(?<value>.*)(<DLMT>)(?<rmks>.*)/g;
      const afrObject: RegExpExecArray | null = hist.changeValueAfr ? regex.exec(hist.changeValueAfr) : null;
      const valueAfr = afrObject && afrObject.groups ? afrObject.groups.value : hist.changeValueAfr;
      const valueAfrRmks = afrObject && afrObject.groups ? afrObject.groups.rmks : "";
      const valueBef = hist.changeValueBef;
      const isTwoColumns = valueBef !== null;
      return (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <div className="historyTitle">
            <div>
              <span className="changeItemDispName">{hist.changeItemDispName}</span>
            </div>
            <span>{hist.changeBy}</span>
            <span>{hist.changeTime && dayjs(hist.changeTime.slice(0, 19)).format("YYYY/MM/DD HH:mm[Z]")}</span>
          </div>
          {isTwoColumns ? (
            <div className="historyTwoRowsTable">
              <PlayerIcon />
              <Table>
                <tbody>
                  <tr>
                    <td className={valueAfrRmks ? "valueAfrTwoLines" : "valueAfr"} style={valueAfr || valueBef ? {} : { height: "48px" }}>
                      {valueAfr}
                    </td>
                    <td className={valueAfrRmks ? "valueBefTwoLines" : "valueBef"} style={valueAfr || valueBef ? {} : { height: "48px" }}>
                      {valueBef}
                    </td>
                  </tr>
                  {!!valueAfrRmks && (
                    <tr>
                      <td className="rmksAfr" style={valueAfrRmks ? {} : { height: "42px" }}>
                        {valueAfrRmks}
                      </td>
                      <td />
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="historyTable">
              <Table>
                <tbody>
                  <tr>
                    <td className="rmksAfr" style={valueAfrRmks ? {} : { height: "42px" }}>
                      {valueAfrRmks}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </div>
      );
    });
  }

  render() {
    const { flightChangeHistory, scrollContentOnClick } = this.props;

    if (!flightChangeHistory || !flightChangeHistory.history) {
      return <Wrapper ref={this.flightChangeHistoryScrollRef} onClick={scrollContentOnClick} />;
    }

    return (
      <Wrapper ref={this.flightChangeHistoryScrollRef} tabIndex={-1} onClick={scrollContentOnClick}>
        {flightChangeHistory.history && (
          <Content key="dividerChangeHistory">
            <div className="title">Change History</div>
            {this.renderHistory(flightChangeHistory.history)}
          </Content>
        )}
        <BlankContent />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Content = styled.div`
  padding: 0;

  .title {
    padding: 0 10px;
    color: #2fadbd;
    font-size: 20px;
    margin-top: 13px;
    margin-bottom: 3px; /* baselineから7px分 */
  }

  .historyTitle {
    min-height: 28px;
    padding: 8px 5px 4px 8px;
    background: #e4f2f7;
    border-top: 1px solid #707070;
    font-size: 17px;
    word-wrap: break-word;
    text-align: right;

    div {
      text-align: left;
      margin-bottom: -5px;
    }

    > span {
      font-size: 12px;
      word-break: break-all;
      margin-right: 5px;
    }
  }

  .historyTwoRowsTable {
    position: relative;
    overflow: hidden;

    table {
      td {
        vertical-align: top;
        border: none;
        word-break: break-all;
        font-size: 12px;
        &:nth-child(2) {
          background: #f6f6f6;
        }
      }

      .valueAfr {
        font-size: 16px;
        padding: 15px 11px 11px 10px;
      }

      .valueBef {
        color: #98afbf;
        font-size: 16px;
        padding: 15px 11px 11px 16px;
      }

      .valueAfrTwoLines {
        font-size: 16px;
        padding: 15px 11px 7px 10px;
      }

      .valueBefTwoLines {
        color: #98afbf;
        font-size: 16px;
        padding: 15px 11px 7px 16px;
      }

      .rmksAfr {
        font-size: 14px;
        padding: 2px 11px 12px 10px;
      }
    }
  }

  .historyTable {
    position: relative;

    table {
      td {
        vertical-align: top;
        border: none;
        word-break: break-all;
        font-size: 12px;
        &:nth-child(2) {
          background: #f6f6f6;
        }
      }

      .rmksAfr {
        font-size: 14px;
        padding: 15px 11px 10px 10px;
      }
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr {
    height: 24px;
  }

  th {
    width: 120px;
    padding: 5px;
    font-size: 12px;
    font-weight: normal;
    text-align: left;
    color: #fff;
    background: #2799c6;
    border: 1px solid #595857;
    white-space: nowrap;
  }

  td {
    width: 25%;
    padding: 5px;
    font-size: 17px;
    border: 1px solid #595857;

    .tdContent {
      display: flex;
      align-items: baseline;
    }

    .label {
      &:first-child {
        margin-left: 0;
      }
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding: 2px 4px 0px 4px;
      background: #595857;
      color: #fff;
      font-size: 15px;
      border-radius: 3px;
    }

    span {
      margin-right: 4px;
    }
  }

  td.text_center {
    text-align: center;
  }
`;

const BlankContent = styled(Content)`
  height: 220px;
  border-top: 1px solid #707070;
`;

const PlayerIcon = styled.img.attrs({ src: Player })`
  width: 15px;
  height: 15px;
  position: absolute;
  right: 0;
  left: 0;
  top: 18px;
  margin: auto;
`;
