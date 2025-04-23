import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { formatFltNo } from "../../lib/commonUtil";

interface Props {
  legkey: CommonFlightInfo.Legkey | null;
  isDep: boolean;
}

const FreeModalHeader: React.FC<Props> = (props) => {
  const { legkey, isDep } = props;
  if (!legkey) {
    return <div />;
  }
  return (
    <Header>
      <HeaderLeft>
        <Label>Start line:</Label>
        <FltNo>
          {legkey.casFltNo ? "" : <AlCd>{legkey.alCd}</AlCd>}
          {legkey.casFltNo ? legkey.casFltNo : formatFltNo(legkey.fltNo)}
        </FltNo>
        <Date>/{dayjs(legkey.orgDateLcl).format("DDMMM").toUpperCase()}</Date>
      </HeaderLeft>
      <HeaderRight>{isDep ? "DEP" : "ARR"}</HeaderRight>
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  width: 100%;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: baseline;
  font-size: 18px;
  margin-left: 16px;
`;

const HeaderRight = styled.div`
  font-size: 20px;
  margin-right: 46px;
`;

const Label = styled.span`
  font-size: 16px;
  margin-right: 4px;
`;

const AlCd = styled.span`
  font-size: 16px;
`;

const FltNo = styled.span<{ fontSize?: string | null }>`
  font-size: ${({ fontSize }) => fontSize || "23"}px;
`;

const Date = styled.span<{ fontSize?: string | null }>`
  font-size: ${({ fontSize }) => fontSize || "23"}px;
`;

export default FreeModalHeader;
