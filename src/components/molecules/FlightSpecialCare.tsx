import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import { FlightSpecialCare as FlightSpecialCareState } from "../../reducers/flightContents";
import { Master } from "../../reducers/account";

interface Props {
  flightSpecialCare: FlightSpecialCareState;
  master: Master;
  scrollContentRef?: React.RefObject<HTMLDivElement>;

  scrollContentOnClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

class FlightSpecialCare extends React.Component<Props> {
  private flightSpecialCareScrollRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.flightSpecialCareScrollRef = this.props.scrollContentRef || React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    if (this.flightSpecialCareScrollRef.current) {
      this.flightSpecialCareScrollRef.current.focus();
    }
  }

  extractSpclCareGrpFromId = (spclCareGrpId: number): { icon: string; name: string } => {
    const { spclCareGrps } = this.props.master;
    const extractedGrp = spclCareGrps.find((grp) => grp.spclCareGrpId === spclCareGrpId);
    return {
      icon: extractedGrp ? extractedGrp.spclCareGrpIcon : "",
      name: extractedGrp ? extractedGrp.spclCareGrpName : "",
    };
  };

  extractExplanationFromSpclLoadCode = (spclLoadCode: string): string => {
    const { spclLoads } = this.props.master;
    const extractedSpclLoad = spclLoads.find((element) => element.spclLoadCd === spclLoadCode);
    return extractedSpclLoad ? extractedSpclLoad.spclLoadCdInfo : "";
  };

  extractExplanationFromSsrCode = (ssrCode: string): string => {
    const { ssrs } = this.props.master;
    const extractedSsr = ssrs.find((element) => element.ssrCd === ssrCode);
    return extractedSsr ? extractedSsr.ssrCdInfo : "";
  };

  render() {
    const { flightSpecialCare, scrollContentOnClick } = this.props;
    if (!flightSpecialCare) {
      return <Wrapper ref={this.flightSpecialCareScrollRef} onClick={scrollContentOnClick} />;
    }

    let spclPaxRcvDateTime;
    let spclLoadRcvDateTime;
    if (flightSpecialCare.spclPaxRcvDateTime) {
      const spclPaxRcvDateTimeDayjs = dayjs(flightSpecialCare.spclPaxRcvDateTime);
      spclPaxRcvDateTime = spclPaxRcvDateTimeDayjs.isValid() ? spclPaxRcvDateTimeDayjs.format("YYYY/MM/DD HH:mm") : "-----------------";
    } else {
      spclPaxRcvDateTime = "-----------------";
    }
    if (flightSpecialCare.spclLoadRcvDateTime) {
      const spclLoadRcvDateTimeDayjs = dayjs(flightSpecialCare.spclLoadRcvDateTime);
      spclLoadRcvDateTime = spclLoadRcvDateTimeDayjs.isValid() ? spclLoadRcvDateTimeDayjs.format("YYYY/MM/DD HH:mm") : "-----------------";
    } else {
      spclLoadRcvDateTime = "-----------------";
    }

    return (
      <Wrapper ref={this.flightSpecialCareScrollRef} tabIndex={-1} onClick={scrollContentOnClick}>
        <Title>Special Care Information</Title>
        <Body>
          <PaxContainer>
            <SubHeader>
              <div>PAX SSR</div>
              <div>Person</div>
              <div>
                <div>Explanation</div>
                <div>{spclPaxRcvDateTime}</div>
              </div>
            </SubHeader>
            <PaxContent>
              {flightSpecialCare.spclPaxGrp.map((spclPaxGrpElement) => {
                const extractedGrp = this.extractSpclCareGrpFromId(spclPaxGrpElement.spclCareGrpId);
                return (
                  <div key={spclPaxGrpElement.spclCareGrpId}>
                    <SpclCareHeader>
                      <SpclCareIcon src={extractedGrp.icon} />
                      <SpclCareName>{extractedGrp.name}</SpclCareName>
                    </SpclCareHeader>
                    <SpclCareBorder />
                    <SpclPaxContainer>
                      {spclPaxGrpElement.spclPax.map((spclPaxElement, spclPaxIndex) => {
                        const { ssrCode, peopleNumber } = spclPaxElement;
                        const spclPaxExplanation = this.extractExplanationFromSsrCode(ssrCode);
                        return (
                          // eslint-disable-next-line react/no-array-index-key
                          <SpclPaxRow key={`${ssrCode}_${spclPaxIndex}`}>
                            <div>{ssrCode}</div>
                            <NumberCol value={`${peopleNumber}`}>{peopleNumber}</NumberCol>
                            <div>{spclPaxExplanation}</div>
                          </SpclPaxRow>
                        );
                      })}
                    </SpclPaxContainer>
                  </div>
                );
              })}
            </PaxContent>
          </PaxContainer>
          <CgoContainer>
            <SubHeader>
              <div>CGO S/L</div>
              <div />
              <div>
                <div>Explanation</div>
                <div>{spclLoadRcvDateTime}</div>
              </div>
            </SubHeader>
            <CgoContent>
              {flightSpecialCare.spclLoadGrp.map((spclLoadGrpElement) => {
                const extractedGrp = this.extractSpclCareGrpFromId(spclLoadGrpElement.spclCareGrpId);
                return (
                  <div key={spclLoadGrpElement.spclCareGrpId}>
                    <SpclCareHeader>
                      <SpclCareIcon src={extractedGrp.icon} />
                      <SpclCareName>{extractedGrp.name}</SpclCareName>
                    </SpclCareHeader>
                    <SpclCareBorder />
                    <SpclLoadContainer>
                      {spclLoadGrpElement.spclLoad.map((spclLoadElement, spclLoadIndex) => {
                        const { spclLoadCode, totalLoad } = spclLoadElement;
                        const spclLoadExplanation = this.extractExplanationFromSpclLoadCode(spclLoadCode);
                        return (
                          // eslint-disable-next-line react/no-array-index-key
                          <SpclLoadRow key={`${spclLoadCode}_${spclLoadIndex}`}>
                            <div>{spclLoadCode}</div>
                            <NumberCol value={totalLoad}>{totalLoad}</NumberCol>
                            <div>{spclLoadExplanation}</div>
                          </SpclLoadRow>
                        );
                      })}
                    </SpclLoadContainer>
                  </div>
                );
              })}
            </CgoContent>
          </CgoContainer>
        </Body>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 20px;
  color: ${(props) => props.theme.color.pallet.primary};
  margin: 11px 0 9px 10px;
`;

const Body = styled.div`
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const PaxContainer = styled.div``;

const SubHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  background: #2799c6;
  font-size: 12px;
  color: #fff;
  height: 20px;
  padding-left: 24px;
  padding-right: 10px;

  > div:nth-child(1) {
    flex-basis: 60px;
  }

  > div:nth-child(2) {
    flex-basis: 80px;
    text-align: right;
    padding-right: 20px;
  }

  > div:nth-child(3) {
    display: flex;
    flex-basis: 200px;
    justify-content: space-between;
  }
`;

const PaxContent = styled.div`
  padding: 10px 16px 16px 16px;
`;

const SpclCareHeader = styled.div`
  display: flex;
  align-items: center;
`;

const SpclCareIcon = styled.img.attrs((props: { src: string }) => ({
  src: props.src,
}))`
  width: 24px;
  height: 24px;
`;

const SpclCareName = styled.span`
  font-size: 14px;
  margin-left: 4px;
`;

const SpclCareBorder = styled.div`
  height: 3px;
  margin: 3px 0;
  background-color: #ccc;
  border-radius: 1px;
`;

const SpclPaxContainer = styled.div`
  margin: 11px 0 18px 8px;
`;

const SpclPaxRow = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;

  > div:nth-child(1) {
    flex-basis: 60px;
    font-size: 17px;
  }

  > div:nth-child(3) {
    flex-basis: 188px;
    font-size: 12px;
  }
`;

const NumberCol = styled.div<{ value: string }>`
  flex-basis: 80px;
  font-size: 17px;
  text-align: right;
  padding-right: 20px;
  overflow: hidden;
`;

const CgoContainer = styled.div``;

const CgoContent = styled(PaxContent)`
  padding-bottom: 130px;
`;

const SpclLoadContainer = styled(SpclPaxContainer)``;

const SpclLoadRow = styled(SpclPaxRow)``;

export default FlightSpecialCare;
