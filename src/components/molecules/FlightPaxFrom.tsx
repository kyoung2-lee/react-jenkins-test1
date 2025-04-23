import React from "react";
import styled from "styled-components";
import Ship from "../../assets/images/icon/ship.svg";

import { FlightPaxFromListState } from "../../reducers/flightContentsFlightPaxFrom";
import {
  MODAL_FLIGHT_AREA_WIDTH,
  MODAL_MAIN_AREA_WIDTH,
  MODAL_MAIN_AREA_CELL_WIDTH,
  MODAL_DISP_MILLISECONDS,
  PAX_ROW_HEIGHT,
} from "../../lib/Pax";

interface Props {
  flightPaxFrom: FlightPaxFromListState;
  scrollContentRef?: React.RefObject<HTMLDivElement>;

  scrollContentOnClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

const FIGURE_SPACE_CHARACTER = "\u2007";

export default class FlightPaxFrom extends React.PureComponent<Props> {
  private mainContentRef: React.RefObject<HTMLDivElement>;
  private readonly paxLineMetaContainerClassName = "PaxLineMetaContainer";

  constructor(props: Props) {
    super(props);

    this.mainContentRef = this.props.scrollContentRef || React.createRef<HTMLDivElement>();
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

  private adjustPaxLineMetaContainer = () => {
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
      const paxLineContainer = paxLineMetaContainer.parentElement as HTMLDivElement;
      const paxLineBarContainer = paxLineContainer.firstElementChild as HTMLDivElement;
      const paxLineBarContainerRect = paxLineBarContainer.getBoundingClientRect();
      const metaContainerFirstChild = paxLineMetaContainer.firstElementChild as HTMLDivElement;
      const metaContainerFirstChildRect = metaContainerFirstChild.getBoundingClientRect();
      const metaContainerLastChild = paxLineMetaContainer.lastChild as HTMLDivElement;
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
      const flightGridContainer = paxLineContainer.parentElement as HTMLDivElement;
      const rightMaximum = flightGridContainer.getBoundingClientRect().right;
      const paxLineBarContainerRight = paxLineBarContainerRect.right;
      if (paxLineBarContainerRight > rightMaximum - 3) {
        paxLineMetaContainer.style.marginRight = `${paxLineBarContainerRight - (rightMaximum - 3)}px`;
        continue;
      }
      paxLineMetaContainer.style.marginRight = "";
    }
  };

  render() {
    const { flightPaxFrom, scrollContentOnClick } = this.props;
    if (!flightPaxFrom) {
      return <div />;
    }
    const { flight } = flightPaxFrom;

    // timeLclのminTimeからの経過時刻(単位ms)
    const timeLclFromMinTimeMillis = flightPaxFrom.timeLclMillis - flightPaxFrom.minTimeMillis;
    // 現在時刻線の左端からのpx
    const currentTimeBarLeft = MODAL_MAIN_AREA_WIDTH * (timeLclFromMinTimeMillis / MODAL_DISP_MILLISECONDS);

    const adltAndChldsTotal = flightPaxFrom.intoData.reduce((p, c) => p + c.adltAndChlds, 0);
    const infantTotal = flightPaxFrom.intoData.reduce((p, c) => p + c.infts, 0);

    return (
      <Wrapper>
        <Header onClick={scrollContentOnClick}>
          <HeaderLeft>
            <HeaderApoCd>{flight.lstDepApoCd}</HeaderApoCd>
            <HeaderGateText>Gate</HeaderGateText>
            <HeaderGateNo>{flightPaxFrom.myFlightDepGateNo || FIGURE_SPACE_CHARACTER}</HeaderGateNo>
          </HeaderLeft>
          <HeaderRight>
            <HeaderDepDate>{flightPaxFrom.myFlightXtdLclDate}</HeaderDepDate>
            <HeaderDepTime>{flightPaxFrom.myFlightXtdLclTime}</HeaderDepTime>
          </HeaderRight>
        </Header>
        <MainContentHeader onClick={scrollContentOnClick}>
          <ArrFltTextComponent>ARR FLT</ArrFltTextComponent>
          <MainContentHeaderShadowing>
            <TimeGridContainer>
              {flightPaxFrom.timeBarIndicators.map((timeBarIndicator, timeCellIndex) => (
                <TimeCell
                  // eslint-disable-next-line react/no-array-index-key
                  key={`time-${timeCellIndex}`}
                  left={flightPaxFrom.timeBarOffsetLeft * -1 + MODAL_MAIN_AREA_CELL_WIDTH * timeCellIndex}
                >
                  {timeBarIndicator}
                </TimeCell>
              ))}
            </TimeGridContainer>
            <CnxTextComponent>CNX</CnxTextComponent>
          </MainContentHeaderShadowing>
          {flightPaxFrom.timeLclIsInBound && <PaxCurrentTimeBall left={currentTimeBarLeft} />}
        </MainContentHeader>
        <MainContent tabIndex={-1} ref={this.mainContentRef} onClick={scrollContentOnClick}>
          {flightPaxFrom.intoData.map((intoDatum, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <MainContentRow key={`intoData-${index}`}>
              <FlightInfo>
                <FlightInfoRow>
                  <FlightInfoAlCd>{intoDatum.alCd}</FlightInfoAlCd>
                  <FlightInfoFltNo>{intoDatum.fltNo}</FlightInfoFltNo>
                </FlightInfoRow>
                {intoDatum.isUnknownXtaLcl ? (
                  <div>{FIGURE_SPACE_CHARACTER}</div>
                ) : intoDatum.arrAptCd === flight.lstDepApoCd ? (
                  <SpotInfoRow>
                    <SpotTextComponent>Spot</SpotTextComponent>
                    <SpotNo>{intoDatum.arrSpotNo || FIGURE_SPACE_CHARACTER}</SpotNo>
                  </SpotInfoRow>
                ) : (
                  <AlterAptCd>{intoDatum.arrAptCd}</AlterAptCd>
                )}
              </FlightInfo>
              <FlightGridContainer>
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                {[...Array(5)].map((_, gridCellIndex) => (
                  <FlightGridCell
                    // eslint-disable-next-line react/no-array-index-key
                    key={`fltGridCell-${gridCellIndex}`}
                    left={flightPaxFrom.timeBarOffsetLeft * -1 + MODAL_MAIN_AREA_CELL_WIDTH * gridCellIndex}
                    width={MODAL_MAIN_AREA_CELL_WIDTH}
                  />
                ))}
                <PaxLazyArea key={`paxLazyArea-${intoDatum.alCd}${intoDatum.fltNo}`} width={MODAL_MAIN_AREA_CELL_WIDTH} />
                <PaxLineContainer width={intoDatum.paxLineBarWidth}>
                  <PaxLineBarContainer>
                    <PaxLineBar />
                    <PaxLineShip />
                  </PaxLineBarContainer>
                  <PaxLineMetaContainer className={this.paxLineMetaContainerClassName}>
                    {!intoDatum.isUnknownXtaLcl ? (
                      <>
                        {intoDatum.xtaLclDate !== flightPaxFrom.myFlightXtdLclDate && (
                          <PaxLineShipTag>{intoDatum.xtaLclDate}</PaxLineShipTag>
                        )}
                        <PaxLineEndTime>{intoDatum.xtaLclTime}</PaxLineEndTime>
                      </>
                    ) : (
                      <PaxLineShipTag>Unknown</PaxLineShipTag>
                    )}
                  </PaxLineMetaContainer>
                </PaxLineContainer>
              </FlightGridContainer>
              <CnxInfo>
                <PaxNumberRow>
                  <PaxNumberRowSpan>
                    <AdltAndChldNumber>{intoDatum.adltAndChlds}</AdltAndChldNumber>
                    {!!intoDatum.infts && (
                      <>
                        <OperandPlus>+</OperandPlus>
                        <InftNumber>{intoDatum.infts > 99 ? "XX" : intoDatum.infts}</InftNumber>
                      </>
                    )}
                  </PaxNumberRowSpan>
                </PaxNumberRow>
                {!intoDatum.isUnknownXtaLcl ? (
                  <PaxTimeRow lazy={intoDatum.isLazy}>
                    {intoDatum.isLazy && "-"}
                    {intoDatum.durationAbsoluteTime}
                  </PaxTimeRow>
                ) : (
                  <PaxTimeRow lazy={false}>{FIGURE_SPACE_CHARACTER}</PaxTimeRow>
                )}
              </CnxInfo>
            </MainContentRow>
          ))}
          <LastMainContentRow items={flightPaxFrom.intoData.length}>
            <LastFlightInfo />
            <LastFlightGridContainer />
          </LastMainContentRow>
          {flightPaxFrom.timeLclIsInBound && (
            <PaxCurrentTimeBar key="paxCurrentTimeBar" left={currentTimeBarLeft} items={flightPaxFrom.intoData.length} />
          )}
        </MainContent>
        <FlightFooter>
          <FooterLabel>CNX PAX Total</FooterLabel>
          <FooterValue>{adltAndChldsTotal}</FooterValue>
          {!!infantTotal && (
            <>
              <FooterLabelSmall>+Infant</FooterLabelSmall>
              <FooterValueSmall>{infantTotal}</FooterValueSmall>
            </>
          )}
        </FlightFooter>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  z-index: 1;
`;

const Header = styled.div`
  background-color: #cbe5e3;
  padding: 4px 10px 2px 10px;
  display: flex;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: baseline;
  flex: 1;
`;

const HeaderApoCd = styled.div`
  font-size: 20px;
`;

const HeaderGateText = styled.div`
  font-size: 12px;
  margin-left: 4px;
`;

const HeaderGateNo = styled.div`
  font-size: 20px;
  margin-left: 2px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: baseline;
`;

const HeaderDepDate = styled.div`
  font-size: 16px;
`;

const HeaderDepTime = styled.div`
  font-size: 20px;
  margin-left: 3px;
`;

const MainContentHeader = styled.div`
  display: flex;
  position: relative;
`;

const MainContentHeaderTitle = styled.div`
  background-color: #2799c6;
  color: #fff;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 0;
  height: 19px;
`;

const ArrFltTextComponent = styled(MainContentHeaderTitle)`
  flex-basis: 100px;
  border-right: solid 1px #fff;
  z-index: 12;
`;

const MainContentHeaderShadowing = styled.div`
  display: flex;
  flex: 1;
  box-shadow: 0 9px 6px -6px rgba(0, 0, 0, 0.25);
  z-index: 11;
`;

const TimeGridContainer = styled.div`
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

const TimeCell = styled(MainContentHeaderTitle)<{ left: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  padding-left: 1px;
  align-items: flex-end;
  font-size: 11px;
`;

const CnxTextComponent = styled(MainContentHeaderTitle)`
  flex-basis: 67px;
  border-left: solid 1px #fff;
  z-index: 12;
`;

const MainContent = styled.div`
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

const MainContentRow = styled.div`
  display: flex;
`;

const FlightFooter = styled.div`
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

const FooterLabel = styled.div`
  font-size: 12px;
`;

const FooterValue = styled.div`
  font-size: 22px;
  margin-left: 7px;
`;

const FooterLabelSmall = styled.div`
  font-size: 10px;
  margin-left: 12px;
`;

const FooterValueSmall = styled.div`
  font-size: 20px;
  margin-left: 6px;
`;

/* Left Column */

const FlightInfo = styled.div`
  background: rgb(255, 255, 255);
  height: ${PAX_ROW_HEIGHT}px;
  border-bottom: 1px solid #98afbf;
  flex-basis: 100px;
  padding: 8px 0 6px 10px;
  z-index: 2;
`;

const FlightInfoRow = styled.div`
  display: flex;
  align-items: baseline;
`;

const FlightInfoAlCd = styled.div`
  font-size: 12px;
`;

const FlightInfoFltNo = styled.div`
  font-size: 16px;
`;

const SpotInfoRow = styled.div`
  display: flex;
  align-items: baseline;
  margin-left: 1px;
`;

const SpotTextComponent = styled.div`
  font-size: 10px;
`;

const SpotNo = styled.div`
  margin-left: 2px;
  font-size: 16px;
`;

const AlterAptCd = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

/* Center Column */

const FlightGridContainer = styled.div`
  position: relative;
  flex: 1;
  box-shadow: 9px 0 6px -6px rgba(0, 0, 0, 0.2) inset;
`;

const FlightGridCell = styled.div<{ left: number; width: number }>`
  position: absolute;
  left: ${(props) => props.left}px;
  width: ${(props) => props.width}px;
  height: ${PAX_ROW_HEIGHT}px;
  border-left: solid 1px #e6e6e6;
  border-bottom: solid 1px #98afbf;
`;

const PaxLazyArea = styled.div<{ width: number }>`
  position: absolute;
  top: 0;
  right: 0;
  width: ${(props) => props.width}px;
  height: ${PAX_ROW_HEIGHT}px;
  background-color: rgba(184, 38, 31, 0.2);
`;

const PaxLineContainer = styled.div<{ width: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => props.width}px;
  padding: 8px 0 0;
`;

const PaxLineBarContainer = styled.div`
  width: 100%;
  height: 20px;
  padding: 0 10px 0 0;
  position: relative;
`;

const PaxLineBar = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(126, 193, 207, 0.6);
`;

const PaxLineShip = styled.img.attrs({ src: Ship })`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
`;

const PaxLineShipTag = styled.span`
  background-color: #707070;
  padding: 2px 4px;
  color: #fff;
  font-size: 11px;
  border-radius: 2px;
  margin-right: 2px;
`;

const PaxLineMetaContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 2px;
`;

const PaxLineEndTime = styled.div`
  font-size: 14px;
`;

/* Right Column */

const CnxInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: rgb(255, 255, 255);
  height: ${PAX_ROW_HEIGHT}px;
  border-left: solid 1px #98afbf;
  border-bottom: solid 1px #98afbf;
  flex-basis: 67px;
  padding: 0;
  z-index: 2;
`;

const PaxNumberRow = styled.div`
  display: flex;
  justify-content: center;
`;

const PaxNumberRowSpan = styled.span``;

const AdltAndChldNumber = styled.span`
  font-size: 16px;
`;

const OperandPlus = styled.span`
  font-size: 10px;
  margin-left: 2px;
`;

const InftNumber = styled.span`
  font-size: 14px;
`;

const PaxTimeRow = styled.div<{ lazy: boolean }>`
  display: flex;
  justify-content: center;
  ${(props) => props.lazy && "color: #b8261f;"};
`;

/* Final Row */

const LastMainContentRow = styled.div<{ items: number }>`
  display: flex;
  height: 100%;
  max-height: calc(100% - ${(props) => props.items * PAX_ROW_HEIGHT}px + 1px); /* 1pxはバウンススクロールさせるため */
`;

const LastFlightInfo = styled(FlightInfo)`
  height: 100%;
  border: none;
`;

const LastFlightGridContainer = styled(FlightGridContainer)``;

/* Current Time */
const PaxCurrentTimeBall = styled.div<{ left: number }>`
  position: absolute;
  left: ${(props) => props.left + MODAL_FLIGHT_AREA_WIDTH - (9 - 1) / 2}px;
  top: 14px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #e6b422;
  z-index: 21;
`;

const PaxCurrentTimeBar = styled.div<{ left: number; items: number }>`
  position: absolute;
  top: 0;
  left: ${(props) => props.left + MODAL_FLIGHT_AREA_WIDTH}px;
  width: 1px;
  height: ${(props) => props.items * PAX_ROW_HEIGHT}px;
  min-height: 100%;
  background-color: #e6b422;
  z-index: 21;
`;
