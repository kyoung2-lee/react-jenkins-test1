import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import { storage } from "../../lib/storage";
import { Const } from "../../lib/commonConst";
import getIssueIcon from "../atoms/AirportIssueIcon";

interface Props {
  issus: HeaderInfoApi.Issu[];
  apoCd: string;
  terminalUtcDate: dayjs.Dayjs | null;
}

const AirportIssueListModal: React.FC<Props> = (props) => {
  const getIssuMessage = (issu: HeaderInfoApi.Issu, apoCd: string): { title: string; text: string } => {
    let title = "";
    let text = "";
    switch (issu.issuCd) {
      case "SEC":
        title = "Security Level Change";
        switch (issu.issuDtlCd) {
          case "LV1":
            text = `${apoCd}/Level Ⅰ`;
            break;
          case "LV2":
            text = `${apoCd}/Level Ⅱ`;
            break;
          case "LV3":
            text = `${apoCd}/Level Ⅲ`;
            break;
          default:
            break;
        }
        break;
      case "SWW":
        title = "Strong Wind Warning";
        switch (issu.issuDtlCd) {
          case "WAR":
            text = `${apoCd} Issued`;
            break;
          case "CD1":
            text = `${apoCd}/Cond1 Issued`;
            break;
          case "CD2":
            text = `${apoCd}/Cond2 Issued`;
            break;
          case "CD3":
            text = `${apoCd}/Cond3 Issued`;
            break;
          case "CNL":
            text = `${apoCd}/Canceled`;
            break;
          default:
            break;
        }
        break;
      case "TSW":
        title = "Thunder Storm Warning";
        switch (issu.issuDtlCd) {
          case "WAR":
            text = `${apoCd} Issued`;
            break;
          case "CD1":
            text = `${apoCd}/Cond1 Issued`;
            break;
          case "CD2":
            text = `${apoCd}/Cond2 Issued`;
            break;
          case "CNL":
            text = `${apoCd}/Canceled`;
            break;
          default:
            break;
        }
        break;
      case "DIC":
        title = "De-Icing Only";
        switch (issu.issuDtlCd) {
          case "ON":
            text = `${apoCd}/De-Icing Only Issued`;
            break;
          default:
            break;
        }
        break;
      case "RCL":
        title = "Runway Close";
        switch (issu.issuDtlCd) {
          case "ON":
            text = `${apoCd}/Runway Closed`;
            break;
          default:
            break;
        }
        break;
      case "SSP":
        title = "LVP/LVPD";
        switch (issu.issuDtlCd) {
          case "ON":
            text = `${apoCd}/LVP/LVPD Issued`;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    return { title, text };
  };

  const { issus, apoCd, terminalUtcDate } = props;

  return (
    <IssueListModal terminalCat={storage.terminalCat}>
      <DummyScroll>
        <DummyScrollContent />
      </DummyScroll>
      <IssueContainerHeader isIphone={storage.isIphone}>
        <div>Issue</div>
        <div>Issue Time(L)</div>
      </IssueContainerHeader>
      <IssueContainerBody>
        {issus &&
          terminalUtcDate &&
          issus.map((issu, index) => {
            const icon = getIssueIcon({ issu, key: issu.issuCd + issu.issuDtlCd, terminalUtcDate });
            const issuMessage = getIssuMessage(issu, apoCd);
            const updateTime = dayjs.utc(issu.updateTime).add(9, "h").format("YYYY/MM/DD HH:mm"); // JST固定（+9:00）で表示する
            // アイコンが取得できないものは表示しない（表示時間を制御している）
            return icon ? (
              // eslint-disable-next-line react/no-array-index-key
              <IssueContainerRow key={index} isIphone={storage.isIphone}>
                <div>{icon}</div>
                <IssueMessage>
                  <div>{issuMessage.title}</div>
                  <div>{issuMessage.text}</div>
                  <div>{updateTime} updated</div>
                </IssueMessage>
                <div>{issu.issuTime && `${issu.issuTime.substr(0, 2)}:${issu.issuTime.substr(2)}`}</div>
              </IssueContainerRow>
            ) : undefined;
          })}
      </IssueContainerBody>
    </IssueListModal>
  );
};

const IssueListModal = styled.div<{ terminalCat?: Const.TerminalCat | null }>`
  position: absolute;
  top: calc(
    ${(props) =>
      props.terminalCat === Const.TerminalCat.pc
        ? `${props.theme.layout.header.default} - 36px`
        : props.terminalCat === Const.TerminalCat.iPad
        ? `${props.theme.layout.header.tablet} - 36px`
        : `${props.theme.layout.header.tablet} - 46px`}
  );
  margin: 0 auto;
  width: ${(props) => (props.terminalCat === Const.TerminalCat.iPhone ? "360px" : "390px")};
  left: 0;
  right: 0;
  background: ${(props) => props.theme.color.WHITE};
  box-shadow: 0 0 10px 0 rgba(163, 163, 163, 0.5);
  pointer-events: auto;
`;

const IssueContainer = styled.div<{ isIphone: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: ${({ isIphone }) => (isIphone ? "30px" : "36px")};
  padding-right: ${({ isIphone }) => (isIphone ? "20px" : "30px")};
  font-size: 12px;
  font-weight: 500;
  > div {
    flex: 1 1 auto;
    text-align: left;
    word-break: break-all;
  }
  > div:last-child {
    flex: 0 0 84px;
    text-align: center;
  }
`;

const IssueContainerHeader = styled(IssueContainer)`
  height: 20px;
  color: #fff;
  background: #2799c6;
`;

const IssueContainerRow = styled(IssueContainer)`
  margin-top: 10px;
  > div:first-child {
    background-color: #2799c6;
    flex: 0 0 56px;
    height: 56px;
    margin-right: 14px;
    padding: 10px;
    border-radius: 1px;
  }
  > div:last-child {
    font-size: 20px;
    font-weight: 600;
  }
`;

const IssueMessage = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    font-weight: 600;
  }
  > div:last-child {
    padding-top: 7px;
    font-weight: 500;
  }
`;

const IssueContainerBody = styled.div`
  background: #f6f6f6;
  padding-top: 10px;
  padding-bottom: 20px;
`;

const DummyScroll = styled.div`
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const DummyScrollContent = styled.div`
  height: 101%;
`;

export default AirportIssueListModal;
