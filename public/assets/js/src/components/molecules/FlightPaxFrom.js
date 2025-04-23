"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ship_svg_1 = __importDefault(require("../../assets/images/icon/ship.svg"));
const Pax_1 = require("../../lib/Pax");
const FIGURE_SPACE_CHARACTER = "\u2007";
class FlightPaxFrom extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.paxLineMetaContainerClassName = "PaxLineMetaContainer";
        this.adjustPaxLineMetaContainer = () => {
            const mainContent = this.mainContentRef.current;
            if (!mainContent) {
                return;
            }
            const paxLineMetaContainers = mainContent.getElementsByClassName(this.paxLineMetaContainerClassName);
            // eslint-disable-next-line no-restricted-syntax
            for (const paxLineMetaContainer of paxLineMetaContainers) {
                if (!(paxLineMetaContainer instanceof HTMLDivElement)) {
                    continue;
                }
                // PaxLineContainerが左に寄りすぎていた場合、MetaContainerの全部が見えるように右に寄せる
                const paxLineContainer = paxLineMetaContainer.parentElement;
                const paxLineBarContainer = paxLineContainer.firstElementChild;
                const paxLineBarContainerRect = paxLineBarContainer.getBoundingClientRect();
                const metaContainerFirstChild = paxLineMetaContainer.firstElementChild;
                const metaContainerFirstChildRect = metaContainerFirstChild.getBoundingClientRect();
                const metaContainerLastChild = paxLineMetaContainer.lastChild;
                const metaContainerLastChildRect = metaContainerLastChild.getBoundingClientRect();
                // MetaContainer配下の要素の、全体の長さ
                const metaContainerChildrenWidth = metaContainerLastChildRect.right - metaContainerFirstChildRect.left;
                // 飛行機アイコン線の長さ
                const paxLineBarContainerWidth = paxLineBarContainerRect.width;
                if (metaContainerChildrenWidth > paxLineBarContainerWidth - 3) {
                    paxLineMetaContainer.style.marginRight = `${paxLineBarContainerWidth - metaContainerChildrenWidth - 3}px`;
                    continue;
                }
                // PaxLineContainerが右に寄りすぎていた場合、MetaContainerを左に寄せて右余白を確保する
                const flightGridContainer = paxLineContainer.parentElement;
                const rightMaximum = flightGridContainer.getBoundingClientRect().right;
                const paxLineBarContainerRight = paxLineBarContainerRect.right;
                if (paxLineBarContainerRight > rightMaximum - 3) {
                    paxLineMetaContainer.style.marginRight = `${paxLineBarContainerRight - (rightMaximum - 3)}px`;
                    continue;
                }
                paxLineMetaContainer.style.marginRight = "";
            }
        };
        this.mainContentRef = this.props.scrollContentRef || react_1.default.createRef();
    }
    componentDidMount() {
        const mainContent = this.mainContentRef.current;
        if (!mainContent) {
            return;
        }
        mainContent.focus();
        this.adjustPaxLineMetaContainer();
    }
    componentDidUpdate() {
        this.adjustPaxLineMetaContainer();
    }
    render() {
        const { flightPaxFrom, scrollContentOnClick } = this.props;
        if (!flightPaxFrom) {
            return react_1.default.createElement("div", null);
        }
        const { flight } = flightPaxFrom;
        // timeLclのminTimeからの経過時刻(単位ms)
        const timeLclFromMinTimeMillis = flightPaxFrom.timeLclMillis - flightPaxFrom.minTimeMillis;
        // 現在時刻線の左端からのpx
        const currentTimeBarLeft = Pax_1.MODAL_MAIN_AREA_WIDTH * (timeLclFromMinTimeMillis / Pax_1.MODAL_DISP_MILLISECONDS);
        const adltAndChldsTotal = flightPaxFrom.intoData.reduce((p, c) => p + c.adltAndChlds, 0);
        const infantTotal = flightPaxFrom.intoData.reduce((p, c) => p + c.infts, 0);
        return (react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(Header, { onClick: scrollContentOnClick },
                react_1.default.createElement(HeaderLeft, null,
                    react_1.default.createElement(HeaderApoCd, null, flight.lstDepApoCd),
                    react_1.default.createElement(HeaderGateText, null, "Gate"),
                    react_1.default.createElement(HeaderGateNo, null, flightPaxFrom.myFlightDepGateNo || FIGURE_SPACE_CHARACTER)),
                react_1.default.createElement(HeaderRight, null,
                    react_1.default.createElement(HeaderDepDate, null, flightPaxFrom.myFlightXtdLclDate),
                    react_1.default.createElement(HeaderDepTime, null, flightPaxFrom.myFlightXtdLclTime))),
            react_1.default.createElement(MainContentHeader, { onClick: scrollContentOnClick },
                react_1.default.createElement(ArrFltTextComponent, null, "ARR FLT"),
                react_1.default.createElement(MainContentHeaderShadowing, null,
                    react_1.default.createElement(TimeGridContainer, null, flightPaxFrom.timeBarIndicators.map((timeBarIndicator, timeCellIndex) => (react_1.default.createElement(TimeCell
                    // eslint-disable-next-line react/no-array-index-key
                    , { 
                        // eslint-disable-next-line react/no-array-index-key
                        key: `time-${timeCellIndex}`, left: flightPaxFrom.timeBarOffsetLeft * -1 + Pax_1.MODAL_MAIN_AREA_CELL_WIDTH * timeCellIndex }, timeBarIndicator)))),
                    react_1.default.createElement(CnxTextComponent, null, "CNX")),
                flightPaxFrom.timeLclIsInBound && react_1.default.createElement(PaxCurrentTimeBall, { left: currentTimeBarLeft })),
            react_1.default.createElement(MainContent, { tabIndex: -1, ref: this.mainContentRef, onClick: scrollContentOnClick },
                flightPaxFrom.intoData.map((intoDatum, index) => (
                // eslint-disable-next-line react/no-array-index-key
                react_1.default.createElement(MainContentRow, { key: `intoData-${index}` },
                    react_1.default.createElement(FlightInfo, null,
                        react_1.default.createElement(FlightInfoRow, null,
                            react_1.default.createElement(FlightInfoAlCd, null, intoDatum.alCd),
                            react_1.default.createElement(FlightInfoFltNo, null, intoDatum.fltNo)),
                        intoDatum.isUnknownXtaLcl ? (react_1.default.createElement("div", null, FIGURE_SPACE_CHARACTER)) : intoDatum.arrAptCd === flight.lstDepApoCd ? (react_1.default.createElement(SpotInfoRow, null,
                            react_1.default.createElement(SpotTextComponent, null, "Spot"),
                            react_1.default.createElement(SpotNo, null, intoDatum.arrSpotNo || FIGURE_SPACE_CHARACTER))) : (react_1.default.createElement(AlterAptCd, null, intoDatum.arrAptCd))),
                    react_1.default.createElement(FlightGridContainer, null,
                        [...Array(5)].map((_, gridCellIndex) => (react_1.default.createElement(FlightGridCell
                        // eslint-disable-next-line react/no-array-index-key
                        , { 
                            // eslint-disable-next-line react/no-array-index-key
                            key: `fltGridCell-${gridCellIndex}`, left: flightPaxFrom.timeBarOffsetLeft * -1 + Pax_1.MODAL_MAIN_AREA_CELL_WIDTH * gridCellIndex, width: Pax_1.MODAL_MAIN_AREA_CELL_WIDTH }))),
                        react_1.default.createElement(PaxLazyArea, { key: `paxLazyArea-${intoDatum.alCd}${intoDatum.fltNo}`, width: Pax_1.MODAL_MAIN_AREA_CELL_WIDTH }),
                        react_1.default.createElement(PaxLineContainer, { width: intoDatum.paxLineBarWidth },
                            react_1.default.createElement(PaxLineBarContainer, null,
                                react_1.default.createElement(PaxLineBar, null),
                                react_1.default.createElement(PaxLineShip, null)),
                            react_1.default.createElement(PaxLineMetaContainer, { className: this.paxLineMetaContainerClassName }, !intoDatum.isUnknownXtaLcl ? (react_1.default.createElement(react_1.default.Fragment, null,
                                intoDatum.xtaLclDate !== flightPaxFrom.myFlightXtdLclDate && (react_1.default.createElement(PaxLineShipTag, null, intoDatum.xtaLclDate)),
                                react_1.default.createElement(PaxLineEndTime, null, intoDatum.xtaLclTime))) : (react_1.default.createElement(PaxLineShipTag, null, "Unknown"))))),
                    react_1.default.createElement(CnxInfo, null,
                        react_1.default.createElement(PaxNumberRow, null,
                            react_1.default.createElement(PaxNumberRowSpan, null,
                                react_1.default.createElement(AdltAndChldNumber, null, intoDatum.adltAndChlds),
                                !!intoDatum.infts && (react_1.default.createElement(react_1.default.Fragment, null,
                                    react_1.default.createElement(OperandPlus, null, "+"),
                                    react_1.default.createElement(InftNumber, null, intoDatum.infts > 99 ? "XX" : intoDatum.infts))))),
                        !intoDatum.isUnknownXtaLcl ? (react_1.default.createElement(PaxTimeRow, { lazy: intoDatum.isLazy },
                            intoDatum.isLazy && "-",
                            intoDatum.durationAbsoluteTime)) : (react_1.default.createElement(PaxTimeRow, { lazy: false }, FIGURE_SPACE_CHARACTER)))))),
                react_1.default.createElement(LastMainContentRow, { items: flightPaxFrom.intoData.length },
                    react_1.default.createElement(LastFlightInfo, null),
                    react_1.default.createElement(LastFlightGridContainer, null)),
                flightPaxFrom.timeLclIsInBound && (react_1.default.createElement(PaxCurrentTimeBar, { key: "paxCurrentTimeBar", left: currentTimeBarLeft, items: flightPaxFrom.intoData.length }))),
            react_1.default.createElement(FlightFooter, null,
                react_1.default.createElement(FooterLabel, null, "CNX PAX Total"),
                react_1.default.createElement(FooterValue, null, adltAndChldsTotal),
                !!infantTotal && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(FooterLabelSmall, null, "+Infant"),
                    react_1.default.createElement(FooterValueSmall, null, infantTotal))))));
    }
}
exports.default = FlightPaxFrom;
const Wrapper = styled_components_1.default.div `
  position: relative;
  height: 100%;
  z-index: 1;
`;
const Header = styled_components_1.default.div `
  background-color: #cbe5e3;
  padding: 4px 10px 2px 10px;
  display: flex;
`;
const HeaderLeft = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
  flex: 1;
`;
const HeaderApoCd = styled_components_1.default.div `
  font-size: 20px;
`;
const HeaderGateText = styled_components_1.default.div `
  font-size: 12px;
  margin-left: 4px;
`;
const HeaderGateNo = styled_components_1.default.div `
  font-size: 20px;
  margin-left: 2px;
`;
const HeaderRight = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
`;
const HeaderDepDate = styled_components_1.default.div `
  font-size: 16px;
`;
const HeaderDepTime = styled_components_1.default.div `
  font-size: 20px;
  margin-left: 3px;
`;
const MainContentHeader = styled_components_1.default.div `
  display: flex;
  position: relative;
`;
const MainContentHeaderTitle = styled_components_1.default.div `
  background-color: #2799c6;
  color: #fff;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 0;
  height: 19px;
`;
const ArrFltTextComponent = (0, styled_components_1.default)(MainContentHeaderTitle) `
  flex-basis: 100px;
  border-right: solid 1px #fff;
  z-index: 12;
`;
const MainContentHeaderShadowing = styled_components_1.default.div `
  display: flex;
  flex: 1;
  box-shadow: 0 9px 6px -6px rgba(0, 0, 0, 0.25);
  z-index: 11;
`;
const TimeGridContainer = styled_components_1.default.div `
  position: relative;
  flex: 1;
  background-color: #2799c6;
  color: #fff;
  height: 19px;

  .ReactVirtualized__Grid {
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
const TimeCell = (0, styled_components_1.default)(MainContentHeaderTitle) `
  position: absolute;
  left: ${(props) => props.left}px;
  padding-left: 1px;
  align-items: flex-end;
  font-size: 11px;
`;
const CnxTextComponent = (0, styled_components_1.default)(MainContentHeaderTitle) `
  flex-basis: 67px;
  border-left: solid 1px #fff;
  z-index: 12;
`;
const MainContent = styled_components_1.default.div `
  position: relative;
  overflow-y: scroll;
  padding-bottom: 32px;
  /* ヘッダー、切り替えを除いたモードレス高さ - 乗継便ヘッダー高さ - 時刻表示欄高さ */
  height: calc(100% - 29px - 19px);
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const MainContentRow = styled_components_1.default.div `
  display: flex;
`;
const FlightFooter = styled_components_1.default.div `
  position: absolute;
  bottom: 0;
  height: 32px;
  width: 100%;
  z-index: 30;
  background-color: #cbe5e3;
  display: flex;
  justify-content: center;
  align-items: baseline;
  padding: 5px 0 0;
`;
const FooterLabel = styled_components_1.default.div `
  font-size: 12px;
`;
const FooterValue = styled_components_1.default.div `
  font-size: 22px;
  margin-left: 7px;
`;
const FooterLabelSmall = styled_components_1.default.div `
  font-size: 10px;
  margin-left: 12px;
`;
const FooterValueSmall = styled_components_1.default.div `
  font-size: 20px;
  margin-left: 6px;
`;
/* Left Column */
const FlightInfo = styled_components_1.default.div `
  background: rgb(255, 255, 255);
  height: ${Pax_1.PAX_ROW_HEIGHT}px;
  border-bottom: 1px solid #98afbf;
  flex-basis: 100px;
  padding: 8px 0 6px 10px;
  z-index: 2;
`;
const FlightInfoRow = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
`;
const FlightInfoAlCd = styled_components_1.default.div `
  font-size: 12px;
`;
const FlightInfoFltNo = styled_components_1.default.div `
  font-size: 16px;
`;
const SpotInfoRow = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
  margin-left: 1px;
`;
const SpotTextComponent = styled_components_1.default.div `
  font-size: 10px;
`;
const SpotNo = styled_components_1.default.div `
  margin-left: 2px;
  font-size: 16px;
`;
const AlterAptCd = styled_components_1.default.div `
  font-size: 14px;
  font-weight: bold;
`;
/* Center Column */
const FlightGridContainer = styled_components_1.default.div `
  position: relative;
  flex: 1;
  box-shadow: 9px 0 6px -6px rgba(0, 0, 0, 0.2) inset;
`;
const FlightGridCell = styled_components_1.default.div `
  position: absolute;
  left: ${(props) => props.left}px;
  width: ${(props) => props.width}px;
  height: ${Pax_1.PAX_ROW_HEIGHT}px;
  border-left: solid 1px #e6e6e6;
  border-bottom: solid 1px #98afbf;
`;
const PaxLazyArea = styled_components_1.default.div `
  position: absolute;
  top: 0;
  right: 0;
  width: ${(props) => props.width}px;
  height: ${Pax_1.PAX_ROW_HEIGHT}px;
  background-color: rgba(184, 38, 31, 0.2);
`;
const PaxLineContainer = styled_components_1.default.div `
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => props.width}px;
  padding: 8px 0 0;
`;
const PaxLineBarContainer = styled_components_1.default.div `
  width: 100%;
  height: 20px;
  padding: 0 10px 0 0;
  position: relative;
`;
const PaxLineBar = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  background-color: rgba(126, 193, 207, 0.6);
`;
const PaxLineShip = styled_components_1.default.img.attrs({ src: ship_svg_1.default }) `
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
`;
const PaxLineShipTag = styled_components_1.default.span `
  background-color: #707070;
  padding: 2px 4px;
  color: #fff;
  font-size: 11px;
  border-radius: 2px;
  margin-right: 2px;
`;
const PaxLineMetaContainer = styled_components_1.default.div `
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 2px;
`;
const PaxLineEndTime = styled_components_1.default.div `
  font-size: 14px;
`;
/* Right Column */
const CnxInfo = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: rgb(255, 255, 255);
  height: ${Pax_1.PAX_ROW_HEIGHT}px;
  border-left: solid 1px #98afbf;
  border-bottom: solid 1px #98afbf;
  flex-basis: 67px;
  padding: 0;
  z-index: 2;
`;
const PaxNumberRow = styled_components_1.default.div `
  display: flex;
  justify-content: center;
`;
const PaxNumberRowSpan = styled_components_1.default.span ``;
const AdltAndChldNumber = styled_components_1.default.span `
  font-size: 16px;
`;
const OperandPlus = styled_components_1.default.span `
  font-size: 10px;
  margin-left: 2px;
`;
const InftNumber = styled_components_1.default.span `
  font-size: 14px;
`;
const PaxTimeRow = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  ${(props) => props.lazy && "color: #b8261f;"};
`;
/* Final Row */
const LastMainContentRow = styled_components_1.default.div `
  display: flex;
  height: 100%;
  max-height: calc(100% - ${(props) => props.items * Pax_1.PAX_ROW_HEIGHT}px + 1px); /* 1pxはバウンススクロールさせるため */
`;
const LastFlightInfo = (0, styled_components_1.default)(FlightInfo) `
  height: 100%;
  border: none;
`;
const LastFlightGridContainer = (0, styled_components_1.default)(FlightGridContainer) ``;
/* Current Time */
const PaxCurrentTimeBall = styled_components_1.default.div `
  position: absolute;
  left: ${(props) => props.left + Pax_1.MODAL_FLIGHT_AREA_WIDTH - (9 - 1) / 2}px;
  top: 14px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #e6b422;
  z-index: 21;
`;
const PaxCurrentTimeBar = styled_components_1.default.div `
  position: absolute;
  top: 0;
  left: ${(props) => props.left + Pax_1.MODAL_FLIGHT_AREA_WIDTH}px;
  width: 1px;
  height: ${(props) => props.items * Pax_1.PAX_ROW_HEIGHT}px;
  min-height: 100%;
  background-color: #e6b422;
  z-index: 21;
`;
//# sourceMappingURL=FlightPaxFrom.js.map