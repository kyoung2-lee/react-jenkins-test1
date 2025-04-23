import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import CloseButton from "../atoms/CloseButton";
import { CsSign as BaseCsSign } from "../atoms/CsSign";
import { formatFltNo } from "../../lib/commonUtil";

interface Props {
  mvtMsgHeader: MvtMsgHeader | null;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export type MvtMsgHeader = {
  alCd: string;
  fltNo: string;
  orgDateLcl: string;
  csFlg: boolean;
  lstDepApoCd: string;
  lstArrApoCd: string;
  shipNo: string;
  seatConfCd: string;
  trAlCd: string;
  omAlCd: string;
  ccCnt: number;
  caCnt: number;
  dhCcCnt: number;
  dhCaCnt: number;
  actPaxTtl: number;
};

const FlightLegDetailHeader: React.FC<Props> = (props) => {
  const { mvtMsgHeader, onClose } = props;
  if (!mvtMsgHeader) {
    return <div />;
  }

  return (
    <Header>
      <Text fontSize={22}>
        <Text fontSize={16}>{mvtMsgHeader.alCd}</Text>
        {formatFltNo(mvtMsgHeader.fltNo)}
      </Text>
      <Text fontSize={22}>/{dayjs(mvtMsgHeader.orgDateLcl).format("DDMMM").toUpperCase()}</Text>
      {mvtMsgHeader.csFlg && <CsSign />}
      <Space width={12} />
      <Text fontSize={20}>
        {mvtMsgHeader.lstDepApoCd}-{mvtMsgHeader.lstArrApoCd}
      </Text>
      <Space width={12} />
      <Text fontSize={16}>{mvtMsgHeader.shipNo.slice(0, 2)}</Text>
      <Text fontSize={20}>{mvtMsgHeader.shipNo.slice(2)}</Text>
      <Text fontSize={20}>{mvtMsgHeader.seatConfCd ? `/${mvtMsgHeader.seatConfCd}` : undefined}</Text>
      <Space width={12} />
      <Text fontSize={16}>TR:</Text>
      <Text fontSize={20}>{mvtMsgHeader.trAlCd}</Text>
      <Space width={8} />
      <Text fontSize={16}>OM:</Text>
      <Text fontSize={20}>{mvtMsgHeader.omAlCd}</Text>
      <Space width={typeof mvtMsgHeader.ccCnt === "number" ? 8 : 0} />
      <Text fontSize={16}>{typeof mvtMsgHeader.ccCnt === "number" ? "CC:" : undefined}</Text>
      <Text fontSize={20}>{typeof mvtMsgHeader.ccCnt === "number" ? `${mvtMsgHeader.ccCnt}` : undefined}</Text>
      <Space width={typeof mvtMsgHeader.caCnt === "number" ? 8 : 0} />
      <Text fontSize={16}>{typeof mvtMsgHeader.caCnt === "number" ? "CA:" : undefined}</Text>
      <Text fontSize={20}>{typeof mvtMsgHeader.caCnt === "number" ? `${mvtMsgHeader.caCnt}` : undefined}</Text>
      <Space width={typeof mvtMsgHeader.dhCcCnt === "number" || typeof mvtMsgHeader.dhCaCnt === "number" ? 8 : 0} />
      <Text fontSize={16}>{typeof mvtMsgHeader.dhCcCnt === "number" || typeof mvtMsgHeader.dhCaCnt === "number" ? "DH:" : undefined}</Text>
      <Text fontSize={20}>{typeof mvtMsgHeader.dhCcCnt === "number" ? `${mvtMsgHeader.dhCcCnt}` : undefined}</Text>
      <Text fontSize={20}>{typeof mvtMsgHeader.dhCcCnt === "number" || typeof mvtMsgHeader.dhCaCnt === "number" ? "/" : undefined}</Text>
      <Text fontSize={20}>{typeof mvtMsgHeader.dhCaCnt === "number" ? `${mvtMsgHeader.dhCaCnt}` : undefined}</Text>
      <Space width={typeof mvtMsgHeader.actPaxTtl === "number" ? 8 : 0} />
      <Text fontSize={16}>{typeof mvtMsgHeader.actPaxTtl === "number" ? "PAX:" : undefined}</Text>
      <Text fontSize={20}>{typeof mvtMsgHeader.actPaxTtl === "number" ? `${mvtMsgHeader.actPaxTtl}` : undefined}</Text>
      <CloseButton onClick={onClose} style={{ marginRight: "13px" }} />
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  align-items: baseline;
  color: white;
`;

const Space = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}px;
`;

const Text = styled.span<{ fontSize: number }>`
  font-size: ${({ fontSize }) => fontSize}px;
`;

const CsSign = styled(BaseCsSign)`
  margin-left: 3px;
  align-self: center;
`;

export default FlightLegDetailHeader;
