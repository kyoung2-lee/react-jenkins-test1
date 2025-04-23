"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const commonUtil_1 = require("../../lib/commonUtil");
const CloseButton_1 = __importDefault(require("./CloseButton"));
const CsSign_1 = require("./CsSign");
const PopupCommonHeader = (props) => {
    const { flightHeader = null, arr = null, dep = null, onClose } = props;
    if (flightHeader) {
        return (react_1.default.createElement(Header, null,
            react_1.default.createElement(TitleWrapper, null,
                react_1.default.createElement(TitleLeft, null,
                    react_1.default.createElement("span", null,
                        react_1.default.createElement(AlCd, { casFltNo: flightHeader.casFltNo }, flightHeader.casFltNo ? flightHeader.casFltNo : flightHeader.alCd),
                        flightHeader.casFltNo ? null : (0, commonUtil_1.formatFltNo)(flightHeader.fltNo)),
                    "/",
                    (0, dayjs_1.default)(flightHeader.orgDateLcl).format("DDMMM").toUpperCase(),
                    flightHeader.csFlg && react_1.default.createElement(CsSign, null)),
                react_1.default.createElement(TitleRight, null,
                    flightHeader.lstDepApoCd,
                    "-",
                    flightHeader.lstArrApoCd)),
            onClose ? react_1.default.createElement(CloseButton_1.default, { onClick: onClose }) : null));
    }
    if (arr || dep) {
        return (react_1.default.createElement(HeaderArrOrDep, null,
            react_1.default.createElement(ArrOrDepWrapper, null,
                react_1.default.createElement(ArrTitle, null,
                    react_1.default.createElement(ArrOrDep, null, "ARR:"),
                    arr ? (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(ArrFltNo, { casFltNo: arr.casFltNo },
                            react_1.default.createElement(Flt, { casFltNo: arr.casFltNo }, arr.casFltNo ? arr.casFltNo : arr.alCd),
                            arr.casFltNo ? null : (0, commonUtil_1.formatFltNo)(arr.fltNo)),
                        react_1.default.createElement(ArrOrDepDate, null,
                            "/",
                            (0, dayjs_1.default)(arr.orgDateLcl).format("DD").toUpperCase()),
                        arr.csFlg && react_1.default.createElement(ArrOrDepCsSign, null))) : ("-")),
                react_1.default.createElement(DepTitle, null,
                    react_1.default.createElement(ArrOrDep, null, "DEP:"),
                    dep ? (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(DepFltNo, { casFltNo: dep.casFltNo },
                            react_1.default.createElement(Flt, { casFltNo: dep.casFltNo }, dep.casFltNo ? dep.casFltNo : dep.alCd),
                            dep.casFltNo ? null : (0, commonUtil_1.formatFltNo)(dep.fltNo)),
                        react_1.default.createElement(ArrOrDepDate, null,
                            "/",
                            (0, dayjs_1.default)(dep.orgDateLcl).format("DD").toUpperCase()),
                        dep.csFlg && react_1.default.createElement(ArrOrDepCsSign, null))) : ("-")),
                onClose ? react_1.default.createElement(CloseButton_1.default, { onClick: onClose }) : null)));
    }
    return react_1.default.createElement(Header, null);
};
const Header = styled_components_1.default.div `
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
const HeaderArrOrDep = styled_components_1.default.div `
  display: flex;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  height: 40px;
  color: ${(props) => props.theme.color.WHITE};
  margin: 0;
  font-size: 23px;
`;
const TitleWrapper = styled_components_1.default.div `
  display: flex;
  align-items: center;
  color: white;
`;
const TitleLeft = styled_components_1.default.div `
  display: flex;
  align-items: center;
  font-size: 22px;
  margin-right: 18px;
`;
const AlCd = styled_components_1.default.span `
  font-size: ${(props) => (props.casFltNo ? ([...props.casFltNo].length >= 7 ? 18 : 22) : 16)}px;
`;
const TitleRight = styled_components_1.default.div `
  font-size: 20px;
`;
const CsSign = (0, styled_components_1.default)(CsSign_1.CsSign) `
  margin-left: 3px;
`;
const ArrOrDep = styled_components_1.default.div `
  font-size: 12px;
  margin-right: 3px;
`;
const Flt = styled_components_1.default.span `
  font-size: ${(props) => (props.casFltNo ? ([...props.casFltNo].length >= 7 ? 15 : 18) : 16)}px;
  ${({ casFltNo }) => (casFltNo ? "" : "margin-right: 3px;")}
`;
const ArrOrDepWrapper = styled_components_1.default.div `
  display: flex;
  color: white;
  line-height: 0.6;
  height: 100%;
  padding-bottom: 14px;
`;
const ArrTitle = styled_components_1.default.div `
  width: 186px;
  display: flex;
  font-size: 20px;
  align-items: flex-end;
  padding-left: 16px;
`;
const DepTitle = styled_components_1.default.div `
  width: 186px;
  display: flex;
  font-size: 20px;
  align-items: flex-end;
`;
const ArrOrDepCsSign = (0, styled_components_1.default)(CsSign_1.CsSign) `
  margin-bottom: 3px;
  margin-left: 3px;
`;
const ArrFltNo = styled_components_1.default.div `
  ${({ casFltNo }) => (casFltNo ? "max-width: 92px;" : "")}
  ${({ casFltNo }) => (casFltNo ? "word-break: break-all;" : "")}
  text-align: right;
`;
const DepFltNo = styled_components_1.default.div `
  ${({ casFltNo }) => (casFltNo ? "max-width: 92px;" : "")}
  ${({ casFltNo }) => (casFltNo ? "word-break: break-all;" : "")}
  text-align: right;
`;
const ArrOrDepDate = styled_components_1.default.div `
  font-size: 20px;
`;
exports.default = PopupCommonHeader;
//# sourceMappingURL=PopupCommonHeader.js.map