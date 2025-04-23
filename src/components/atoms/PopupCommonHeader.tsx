import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";
import { formatFltNo } from "../../lib/commonUtil";
import CloseButton from "./CloseButton";
import { CsSign as BaseCsSign } from "./CsSign";

export interface FlightDetailHeader {
  orgDateLcl: string;
  alCd: string;
  fltNo: string;
  casFltNo: string;
  lstDepApoCd: string;
  lstArrApoCd: string;
  csFlg: boolean;
}

export interface ArrDep {
  orgDateLcl: string;
  alCd: string;
  fltNo: string;
  casFltNo: string;
  csFlg: boolean;
}

export interface Props {
  flightHeader?: FlightDetailHeader | null;
  arr?: ArrDep | null;
  dep?: ArrDep | null;
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PopupCommonHeader: React.FC<Props> = (props: Props) => {
  const { flightHeader = null, arr = null, dep = null, onClose } = props;

  if (flightHeader) {
    return (
      <Header>
        <TitleWrapper>
          <TitleLeft>
            <span>
              <AlCd casFltNo={flightHeader.casFltNo}>{flightHeader.casFltNo ? flightHeader.casFltNo : flightHeader.alCd}</AlCd>
              {flightHeader.casFltNo ? null : formatFltNo(flightHeader.fltNo)}
            </span>
            /{dayjs(flightHeader.orgDateLcl).format("DDMMM").toUpperCase()}
            {flightHeader.csFlg && <CsSign />}
          </TitleLeft>
          <TitleRight>
            {flightHeader.lstDepApoCd}-{flightHeader.lstArrApoCd}
          </TitleRight>
        </TitleWrapper>
        {onClose ? <CloseButton onClick={onClose} /> : null}
      </Header>
    );
  }
  if (arr || dep) {
    return (
      <HeaderArrOrDep>
        <ArrOrDepWrapper>
          <ArrTitle>
            <ArrOrDep>ARR:</ArrOrDep>
            {arr ? (
              <>
                <ArrFltNo casFltNo={arr.casFltNo}>
                  <Flt casFltNo={arr.casFltNo}>{arr.casFltNo ? arr.casFltNo : arr.alCd}</Flt>
                  {arr.casFltNo ? null : formatFltNo(arr.fltNo)}
                </ArrFltNo>
                <ArrOrDepDate>/{dayjs(arr.orgDateLcl).format("DD").toUpperCase()}</ArrOrDepDate>
                {arr.csFlg && <ArrOrDepCsSign />}
              </>
            ) : (
              "-"
            )}
          </ArrTitle>
          <DepTitle>
            <ArrOrDep>DEP:</ArrOrDep>
            {dep ? (
              <>
                <DepFltNo casFltNo={dep.casFltNo}>
                  <Flt casFltNo={dep.casFltNo}>{dep.casFltNo ? dep.casFltNo : dep.alCd}</Flt>
                  {dep.casFltNo ? null : formatFltNo(dep.fltNo)}
                </DepFltNo>
                <ArrOrDepDate>/{dayjs(dep.orgDateLcl).format("DD").toUpperCase()}</ArrOrDepDate>
                {dep.csFlg && <ArrOrDepCsSign />}
              </>
            ) : (
              "-"
            )}
          </DepTitle>
          {onClose ? <CloseButton onClick={onClose} /> : null}
        </ArrOrDepWrapper>
      </HeaderArrOrDep>
    );
  }
  return <Header />;
};

const Header = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 2px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  height: 40px;
  color: ${(props) => props.theme.color.WHITE};
  margin: 0;
  font-size: 23px;
  line-height: 31px;
`;

const HeaderArrOrDep = styled.div`
  display: flex;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  height: 40px;
  color: ${(props) => props.theme.color.WHITE};
  margin: 0;
  font-size: 23px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  color: white;
`;

const TitleLeft = styled.div`
  display: flex;
  align-items: center;
  font-size: 22px;
  margin-right: 18px;
`;

const AlCd = styled.span<{ casFltNo: string | null }>`
  font-size: ${(props) => (props.casFltNo ? ([...props.casFltNo].length >= 7 ? 18 : 22) : 16)}px;
`;

const TitleRight = styled.div`
  font-size: 20px;
`;

const CsSign = styled(BaseCsSign)`
  margin-left: 3px;
`;

const ArrOrDep = styled.div`
  font-size: 12px;
  margin-right: 3px;
`;

const Flt = styled.span<{ casFltNo: string | null }>`
  font-size: ${(props) => (props.casFltNo ? ([...props.casFltNo].length >= 7 ? 15 : 18) : 16)}px;
  ${({ casFltNo }) => (casFltNo ? "" : "margin-right: 3px;")}
`;

const ArrOrDepWrapper = styled.div`
  display: flex;
  color: white;
  line-height: 0.6;
  height: 100%;
  padding-bottom: 14px;
`;

const ArrTitle = styled.div`
  width: 186px;
  display: flex;
  font-size: 20px;
  align-items: flex-end;
  padding-left: 16px;
`;

const DepTitle = styled.div`
  width: 186px;
  display: flex;
  font-size: 20px;
  align-items: flex-end;
`;

const ArrOrDepCsSign = styled(BaseCsSign)`
  margin-bottom: 3px;
  margin-left: 3px;
`;

const ArrFltNo = styled.div<{ casFltNo: string | null }>`
  ${({ casFltNo }) => (casFltNo ? "max-width: 92px;" : "")}
  ${({ casFltNo }) => (casFltNo ? "word-break: break-all;" : "")}
  text-align: right;
`;

const DepFltNo = styled.div<{ casFltNo: string | null }>`
  ${({ casFltNo }) => (casFltNo ? "max-width: 92px;" : "")}
  ${({ casFltNo }) => (casFltNo ? "word-break: break-all;" : "")}
  text-align: right;
`;

const ArrOrDepDate = styled.div`
  font-size: 20px;
`;

export default PopupCommonHeader;
