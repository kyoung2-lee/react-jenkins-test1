"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
class FlightSpecialCare extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.extractSpclCareGrpFromId = (spclCareGrpId) => {
            const { spclCareGrps } = this.props.master;
            const extractedGrp = spclCareGrps.find((grp) => grp.spclCareGrpId === spclCareGrpId);
            return {
                icon: extractedGrp ? extractedGrp.spclCareGrpIcon : "",
                name: extractedGrp ? extractedGrp.spclCareGrpName : "",
            };
        };
        this.extractExplanationFromSpclLoadCode = (spclLoadCode) => {
            const { spclLoads } = this.props.master;
            const extractedSpclLoad = spclLoads.find((element) => element.spclLoadCd === spclLoadCode);
            return extractedSpclLoad ? extractedSpclLoad.spclLoadCdInfo : "";
        };
        this.extractExplanationFromSsrCode = (ssrCode) => {
            const { ssrs } = this.props.master;
            const extractedSsr = ssrs.find((element) => element.ssrCd === ssrCode);
            return extractedSsr ? extractedSsr.ssrCdInfo : "";
        };
        this.flightSpecialCareScrollRef = this.props.scrollContentRef || react_1.default.createRef();
    }
    componentDidMount() {
        if (this.flightSpecialCareScrollRef.current) {
            this.flightSpecialCareScrollRef.current.focus();
        }
    }
    render() {
        const { flightSpecialCare, scrollContentOnClick } = this.props;
        if (!flightSpecialCare) {
            return react_1.default.createElement(Wrapper, { ref: this.flightSpecialCareScrollRef, onClick: scrollContentOnClick });
        }
        let spclPaxRcvDateTime;
        let spclLoadRcvDateTime;
        if (flightSpecialCare.spclPaxRcvDateTime) {
            const spclPaxRcvDateTimeDayjs = (0, dayjs_1.default)(flightSpecialCare.spclPaxRcvDateTime);
            spclPaxRcvDateTime = spclPaxRcvDateTimeDayjs.isValid() ? spclPaxRcvDateTimeDayjs.format("YYYY/MM/DD HH:mm") : "-----------------";
        }
        else {
            spclPaxRcvDateTime = "-----------------";
        }
        if (flightSpecialCare.spclLoadRcvDateTime) {
            const spclLoadRcvDateTimeDayjs = (0, dayjs_1.default)(flightSpecialCare.spclLoadRcvDateTime);
            spclLoadRcvDateTime = spclLoadRcvDateTimeDayjs.isValid() ? spclLoadRcvDateTimeDayjs.format("YYYY/MM/DD HH:mm") : "-----------------";
        }
        else {
            spclLoadRcvDateTime = "-----------------";
        }
        return (react_1.default.createElement(Wrapper, { ref: this.flightSpecialCareScrollRef, tabIndex: -1, onClick: scrollContentOnClick },
            react_1.default.createElement(Title, null, "Special Care Information"),
            react_1.default.createElement(Body, null,
                react_1.default.createElement(PaxContainer, null,
                    react_1.default.createElement(SubHeader, null,
                        react_1.default.createElement("div", null, "PAX SSR"),
                        react_1.default.createElement("div", null, "Person"),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("div", null, "Explanation"),
                            react_1.default.createElement("div", null, spclPaxRcvDateTime))),
                    react_1.default.createElement(PaxContent, null, flightSpecialCare.spclPaxGrp.map((spclPaxGrpElement) => {
                        const extractedGrp = this.extractSpclCareGrpFromId(spclPaxGrpElement.spclCareGrpId);
                        return (react_1.default.createElement("div", { key: spclPaxGrpElement.spclCareGrpId },
                            react_1.default.createElement(SpclCareHeader, null,
                                react_1.default.createElement(SpclCareIcon, { src: extractedGrp.icon }),
                                react_1.default.createElement(SpclCareName, null, extractedGrp.name)),
                            react_1.default.createElement(SpclCareBorder, null),
                            react_1.default.createElement(SpclPaxContainer, null, spclPaxGrpElement.spclPax.map((spclPaxElement, spclPaxIndex) => {
                                const { ssrCode, peopleNumber } = spclPaxElement;
                                const spclPaxExplanation = this.extractExplanationFromSsrCode(ssrCode);
                                return (
                                // eslint-disable-next-line react/no-array-index-key
                                react_1.default.createElement(SpclPaxRow, { key: `${ssrCode}_${spclPaxIndex}` },
                                    react_1.default.createElement("div", null, ssrCode),
                                    react_1.default.createElement(NumberCol, { value: `${peopleNumber}` }, peopleNumber),
                                    react_1.default.createElement("div", null, spclPaxExplanation)));
                            }))));
                    }))),
                react_1.default.createElement(CgoContainer, null,
                    react_1.default.createElement(SubHeader, null,
                        react_1.default.createElement("div", null, "CGO S/L"),
                        react_1.default.createElement("div", null),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("div", null, "Explanation"),
                            react_1.default.createElement("div", null, spclLoadRcvDateTime))),
                    react_1.default.createElement(CgoContent, null, flightSpecialCare.spclLoadGrp.map((spclLoadGrpElement) => {
                        const extractedGrp = this.extractSpclCareGrpFromId(spclLoadGrpElement.spclCareGrpId);
                        return (react_1.default.createElement("div", { key: spclLoadGrpElement.spclCareGrpId },
                            react_1.default.createElement(SpclCareHeader, null,
                                react_1.default.createElement(SpclCareIcon, { src: extractedGrp.icon }),
                                react_1.default.createElement(SpclCareName, null, extractedGrp.name)),
                            react_1.default.createElement(SpclCareBorder, null),
                            react_1.default.createElement(SpclLoadContainer, null, spclLoadGrpElement.spclLoad.map((spclLoadElement, spclLoadIndex) => {
                                const { spclLoadCode, totalLoad } = spclLoadElement;
                                const spclLoadExplanation = this.extractExplanationFromSpclLoadCode(spclLoadCode);
                                return (
                                // eslint-disable-next-line react/no-array-index-key
                                react_1.default.createElement(SpclLoadRow, { key: `${spclLoadCode}_${spclLoadIndex}` },
                                    react_1.default.createElement("div", null, spclLoadCode),
                                    react_1.default.createElement(NumberCol, { value: totalLoad }, totalLoad),
                                    react_1.default.createElement("div", null, spclLoadExplanation)));
                            }))));
                    }))))));
    }
}
const Wrapper = styled_components_1.default.div `
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Title = styled_components_1.default.div `
  font-size: 20px;
  color: ${(props) => props.theme.color.pallet.primary};
  margin: 11px 0 9px 10px;
`;
const Body = styled_components_1.default.div `
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const PaxContainer = styled_components_1.default.div ``;
const SubHeader = styled_components_1.default.div `
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
const PaxContent = styled_components_1.default.div `
  padding: 10px 16px 16px 16px;
`;
const SpclCareHeader = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const SpclCareIcon = styled_components_1.default.img.attrs((props) => ({
    src: props.src,
})) `
  width: 24px;
  height: 24px;
`;
const SpclCareName = styled_components_1.default.span `
  font-size: 14px;
  margin-left: 4px;
`;
const SpclCareBorder = styled_components_1.default.div `
  height: 3px;
  margin: 3px 0;
  background-color: #ccc;
  border-radius: 1px;
`;
const SpclPaxContainer = styled_components_1.default.div `
  margin: 11px 0 18px 8px;
`;
const SpclPaxRow = styled_components_1.default.div `
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
const NumberCol = styled_components_1.default.div `
  flex-basis: 80px;
  font-size: 17px;
  text-align: right;
  padding-right: 20px;
  overflow: hidden;
`;
const CgoContainer = styled_components_1.default.div ``;
const CgoContent = (0, styled_components_1.default)(PaxContent) `
  padding-bottom: 130px;
`;
const SpclLoadContainer = (0, styled_components_1.default)(SpclPaxContainer) ``;
const SpclLoadRow = (0, styled_components_1.default)(SpclPaxRow) ``;
exports.default = FlightSpecialCare;
//# sourceMappingURL=FlightSpecialCare.js.map