import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { CsSign as BaseCsSign } from "../atoms/CsSign";
import FisFltStsLabel from "../atoms/FisFltStsLabel";
import { formatFltNo } from "../../lib/commonUtil";
import { storage } from "../../lib/storage";
import { FlightDetailHeader, FlightHeader } from "../../reducers/flightContents";

interface Props {
  isDetail: boolean;
  isUtc: boolean;
  flightHeader: FlightHeader | FlightDetailHeader | null;
}

export default class FlightModalHeader extends React.Component<Props> {
  render() {
    const { isDetail, isUtc, flightHeader } = this.props;
    const { isPc } = storage;
    let key;
    if (!flightHeader) {
      return <div />;
    }
    if (isDetail) {
      key = flightHeader as FlightDetailHeader;
      const orgDate = isUtc ? key.orgDateUtc : key.orgDateLcl;

      return (
        <DetailHeader onClick={() => {}}>
          {key.fisFltSts ? (
            <FisFltStsLabel isPc={isPc} isDarkMode={false}>
              {key.fisFltSts}
            </FisFltStsLabel>
          ) : (
            <NonFltSts />
          )}
          <Weat>{key.legCnlRsnIataCd}</Weat>
          <DetailHeaderDiv>
            {key.casFltNo ? "" : <AlCd>{key.alCd}</AlCd>}
            <FltNo fontSize={!!key.casFltNo && key.casFltNo.length >= (isUtc && key.openSuffixUtc ? 6 : 7) ? "18" : null}>
              {key.casFltNo ? key.casFltNo : formatFltNo(key.fltNo)}
              {isUtc && key.openSuffixUtc}
            </FltNo>
            <Date>{orgDate && `/${dayjs(orgDate).format("DDMMM").toUpperCase()}`}</Date>
            {key.csCnt > 0 && <CsSign />}
          </DetailHeaderDiv>
        </DetailHeader>
      );
    }
    key = flightHeader as FlightHeader;

    return (
      <Header>
        <HeaderLeft>
          <FltNo fontSize={!!key.casFltNo && key.casFltNo.length >= 7 ? "18" : null}>
            {key.casFltNo ? "" : <AlCd>{key.alCd}</AlCd>}
            {key.casFltNo ? key.casFltNo : formatFltNo(key.fltNo)}
          </FltNo>
          <Date fontSize={!!key.casFltNo && key.casFltNo.length >= 7 ? "18" : null}>
            /{dayjs(key.orgDateLcl).format("DDMMM").toUpperCase()}
          </Date>
          {key.csFlg && <CsSign />}
        </HeaderLeft>
        <HeaderRight>
          {key.lstDepApoCd}-{key.lstArrApoCd}
        </HeaderRight>
      </Header>
    );
  }
}

const NonFltSts = styled.div`
  margin-right: 4px;
  width: 40px;
  height: 22px;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-left: 10px;

  color: white;
  font-size: 23px;
`;

const Weat = styled.div`
  font-size: 16px;
  margin-left: 4px;
  width: 60px;
`;

const DetailHeaderDiv = styled.div`
  display: flex;
  align-items: baseline;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  color: white;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: baseline;
  font-size: 22px;
  margin-right: 18px;
`;

const HeaderRight = styled.div`
  font-size: 20px;
`;

const AlCd = styled.span`
  font-size: 16px;
`;

const CsSign = styled(BaseCsSign)`
  margin-left: 3px;
  align-self: center;
`;

const FltNo = styled.span<{ fontSize?: string | null }>`
  font-size: ${({ fontSize }) => fontSize || "23"}px;
`;

const Date = styled.span<{ fontSize?: string | null }>`
  font-size: ${({ fontSize }) => fontSize || "23"}px;
`;
