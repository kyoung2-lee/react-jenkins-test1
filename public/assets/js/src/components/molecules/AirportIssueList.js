"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const storage_1 = require("../../lib/storage");
const commonConst_1 = require("../../lib/commonConst");
const AirportIssueIcon_1 = __importDefault(require("../atoms/AirportIssueIcon"));
const AirportIssueListModal = (props) => {
    const getIssuMessage = (issu, apoCd) => {
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
    return (react_1.default.createElement(IssueListModal, { terminalCat: storage_1.storage.terminalCat },
        react_1.default.createElement(DummyScroll, null,
            react_1.default.createElement(DummyScrollContent, null)),
        react_1.default.createElement(IssueContainerHeader, { isIphone: storage_1.storage.isIphone },
            react_1.default.createElement("div", null, "Issue"),
            react_1.default.createElement("div", null, "Issue Time(L)")),
        react_1.default.createElement(IssueContainerBody, null, issus &&
            terminalUtcDate &&
            issus.map((issu, index) => {
                const icon = (0, AirportIssueIcon_1.default)({ issu, key: issu.issuCd + issu.issuDtlCd, terminalUtcDate });
                const issuMessage = getIssuMessage(issu, apoCd);
                const updateTime = dayjs_1.default.utc(issu.updateTime).add(9, "h").format("YYYY/MM/DD HH:mm"); // JST固定（+9:00）で表示する
                // アイコンが取得できないものは表示しない（表示時間を制御している）
                return icon ? (
                // eslint-disable-next-line react/no-array-index-key
                react_1.default.createElement(IssueContainerRow, { key: index, isIphone: storage_1.storage.isIphone },
                    react_1.default.createElement("div", null, icon),
                    react_1.default.createElement(IssueMessage, null,
                        react_1.default.createElement("div", null, issuMessage.title),
                        react_1.default.createElement("div", null, issuMessage.text),
                        react_1.default.createElement("div", null,
                            updateTime,
                            " updated")),
                    react_1.default.createElement("div", null, issu.issuTime && `${issu.issuTime.substr(0, 2)}:${issu.issuTime.substr(2)}`))) : undefined;
            }))));
};
const IssueListModal = styled_components_1.default.div `
  position: absolute;
  top: calc(
    ${(props) => props.terminalCat === commonConst_1.Const.TerminalCat.pc
    ? `${props.theme.layout.header.default} - 36px`
    : props.terminalCat === commonConst_1.Const.TerminalCat.iPad
        ? `${props.theme.layout.header.tablet} - 36px`
        : `${props.theme.layout.header.tablet} - 46px`}
  );
  margin: 0 auto;
  width: ${(props) => (props.terminalCat === commonConst_1.Const.TerminalCat.iPhone ? "360px" : "390px")};
  left: 0;
  right: 0;
  background: ${(props) => props.theme.color.WHITE};
  box-shadow: 0 0 10px 0 rgba(163, 163, 163, 0.5);
  pointer-events: auto;
`;
const IssueContainer = styled_components_1.default.div `
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
const IssueContainerHeader = (0, styled_components_1.default)(IssueContainer) `
  height: 20px;
  color: #fff;
  background: #2799c6;
`;
const IssueContainerRow = (0, styled_components_1.default)(IssueContainer) `
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
const IssueMessage = styled_components_1.default.div `
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
const IssueContainerBody = styled_components_1.default.div `
  background: #f6f6f6;
  padding-top: 10px;
  padding-bottom: 20px;
`;
const DummyScroll = styled_components_1.default.div `
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
const DummyScrollContent = styled_components_1.default.div `
  height: 101%;
`;
exports.default = AirportIssueListModal;
//# sourceMappingURL=AirportIssueList.js.map