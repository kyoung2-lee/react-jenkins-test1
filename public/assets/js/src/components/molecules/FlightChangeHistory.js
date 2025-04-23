"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const icon_player_png_1 = __importDefault(require("../../assets/images/icon/icon-player.png"));
class FlightChangeHistory extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.flightChangeHistoryScrollRef = this.props.scrollContentRef || react_1.default.createRef();
    }
    componentDidMount() {
        if (this.flightChangeHistoryScrollRef.current) {
            this.flightChangeHistoryScrollRef.current.focus();
        }
    }
    renderHistory(history) {
        return history.map((hist, index) => {
            const regex = /(?<value>.*)(<DLMT>)(?<rmks>.*)/g;
            const afrObject = hist.changeValueAfr ? regex.exec(hist.changeValueAfr) : null;
            const valueAfr = afrObject && afrObject.groups ? afrObject.groups.value : hist.changeValueAfr;
            const valueAfrRmks = afrObject && afrObject.groups ? afrObject.groups.rmks : "";
            const valueBef = hist.changeValueBef;
            const isTwoColumns = valueBef !== null;
            return (
            // eslint-disable-next-line react/no-array-index-key
            react_1.default.createElement("div", { key: index },
                react_1.default.createElement("div", { className: "historyTitle" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "changeItemDispName" }, hist.changeItemDispName)),
                    react_1.default.createElement("span", null, hist.changeBy),
                    react_1.default.createElement("span", null, hist.changeTime && (0, dayjs_1.default)(hist.changeTime.slice(0, 19)).format("YYYY/MM/DD HH:mm[Z]"))),
                isTwoColumns ? (react_1.default.createElement("div", { className: "historyTwoRowsTable" },
                    react_1.default.createElement(PlayerIcon, null),
                    react_1.default.createElement(Table, null,
                        react_1.default.createElement("tbody", null,
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement("td", { className: valueAfrRmks ? "valueAfrTwoLines" : "valueAfr", style: valueAfr || valueBef ? {} : { height: "48px" } }, valueAfr),
                                react_1.default.createElement("td", { className: valueAfrRmks ? "valueBefTwoLines" : "valueBef", style: valueAfr || valueBef ? {} : { height: "48px" } }, valueBef)),
                            !!valueAfrRmks && (react_1.default.createElement("tr", null,
                                react_1.default.createElement("td", { className: "rmksAfr", style: valueAfrRmks ? {} : { height: "42px" } }, valueAfrRmks),
                                react_1.default.createElement("td", null))))))) : (react_1.default.createElement("div", { className: "historyTable" },
                    react_1.default.createElement(Table, null,
                        react_1.default.createElement("tbody", null,
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement("td", { className: "rmksAfr", style: valueAfrRmks ? {} : { height: "42px" } }, valueAfrRmks))))))));
        });
    }
    render() {
        const { flightChangeHistory, scrollContentOnClick } = this.props;
        if (!flightChangeHistory || !flightChangeHistory.history) {
            return react_1.default.createElement(Wrapper, { ref: this.flightChangeHistoryScrollRef, onClick: scrollContentOnClick });
        }
        return (react_1.default.createElement(Wrapper, { ref: this.flightChangeHistoryScrollRef, tabIndex: -1, onClick: scrollContentOnClick },
            flightChangeHistory.history && (react_1.default.createElement(Content, { key: "dividerChangeHistory" },
                react_1.default.createElement("div", { className: "title" }, "Change History"),
                this.renderHistory(flightChangeHistory.history))),
            react_1.default.createElement(BlankContent, null)));
    }
}
exports.default = FlightChangeHistory;
const Wrapper = styled_components_1.default.div `
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const Content = styled_components_1.default.div `
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
const Table = styled_components_1.default.table `
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
const BlankContent = (0, styled_components_1.default)(Content) `
  height: 220px;
  border-top: 1px solid #707070;
`;
const PlayerIcon = styled_components_1.default.img.attrs({ src: icon_player_png_1.default }) `
  width: 15px;
  height: 15px;
  position: absolute;
  right: 0;
  left: 0;
  top: 18px;
  margin: auto;
`;
//# sourceMappingURL=FlightChangeHistory.js.map