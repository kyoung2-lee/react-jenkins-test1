"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const CsSign_1 = require("../atoms/CsSign");
const FisFltStsLabel_1 = __importDefault(require("../atoms/FisFltStsLabel"));
const commonUtil_1 = require("../../lib/commonUtil");
const storage_1 = require("../../lib/storage");
class FlightModalHeader extends react_1.default.Component {
    render() {
        const { isDetail, isUtc, flightHeader } = this.props;
        const { isPc } = storage_1.storage;
        let key;
        if (!flightHeader) {
            return react_1.default.createElement("div", null);
        }
        if (isDetail) {
            key = flightHeader;
            const orgDate = isUtc ? key.orgDateUtc : key.orgDateLcl;
            return (react_1.default.createElement(DetailHeader, { onClick: () => { } },
                key.fisFltSts ? (react_1.default.createElement(FisFltStsLabel_1.default, { isPc: isPc, isDarkMode: false }, key.fisFltSts)) : (react_1.default.createElement(NonFltSts, null)),
                react_1.default.createElement(Weat, null, key.legCnlRsnIataCd),
                react_1.default.createElement(DetailHeaderDiv, null,
                    key.casFltNo ? "" : react_1.default.createElement(AlCd, null, key.alCd),
                    react_1.default.createElement(FltNo, { fontSize: !!key.casFltNo && key.casFltNo.length >= (isUtc && key.openSuffixUtc ? 6 : 7) ? "18" : null },
                        key.casFltNo ? key.casFltNo : (0, commonUtil_1.formatFltNo)(key.fltNo),
                        isUtc && key.openSuffixUtc),
                    react_1.default.createElement(Date, null, orgDate && `/${(0, dayjs_1.default)(orgDate).format("DDMMM").toUpperCase()}`),
                    key.csCnt > 0 && react_1.default.createElement(CsSign, null))));
        }
        key = flightHeader;
        return (react_1.default.createElement(Header, null,
            react_1.default.createElement(HeaderLeft, null,
                react_1.default.createElement(FltNo, { fontSize: !!key.casFltNo && key.casFltNo.length >= 7 ? "18" : null },
                    key.casFltNo ? "" : react_1.default.createElement(AlCd, null, key.alCd),
                    key.casFltNo ? key.casFltNo : (0, commonUtil_1.formatFltNo)(key.fltNo)),
                react_1.default.createElement(Date, { fontSize: !!key.casFltNo && key.casFltNo.length >= 7 ? "18" : null },
                    "/",
                    (0, dayjs_1.default)(key.orgDateLcl).format("DDMMM").toUpperCase()),
                key.csFlg && react_1.default.createElement(CsSign, null)),
            react_1.default.createElement(HeaderRight, null,
                key.lstDepApoCd,
                "-",
                key.lstArrApoCd)));
    }
}
exports.default = FlightModalHeader;
const NonFltSts = styled_components_1.default.div `
  margin-right: 4px;
  width: 40px;
  height: 22px;
`;
const DetailHeader = styled_components_1.default.div `
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-left: 10px;

  color: white;
  font-size: 23px;
`;
const Weat = styled_components_1.default.div `
  font-size: 16px;
  margin-left: 4px;
  width: 60px;
`;
const DetailHeaderDiv = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
`;
const Header = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
  color: white;
`;
const HeaderLeft = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
  font-size: 22px;
  margin-right: 18px;
`;
const HeaderRight = styled_components_1.default.div `
  font-size: 20px;
`;
const AlCd = styled_components_1.default.span `
  font-size: 16px;
`;
const CsSign = (0, styled_components_1.default)(CsSign_1.CsSign) `
  margin-left: 3px;
  align-self: center;
`;
const FltNo = styled_components_1.default.span `
  font-size: ${({ fontSize }) => fontSize || "23"}px;
`;
const Date = styled_components_1.default.span `
  font-size: ${({ fontSize }) => fontSize || "23"}px;
`;
//# sourceMappingURL=FlightModalHeader.js.map