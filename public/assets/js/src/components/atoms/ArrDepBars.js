"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ArrDepBars = (props) => {
    const { arr, dep, selectedTarget } = props;
    const arrFlt = arr ? (arr.casFltNo ? arr.casFltNo : `${arr.alCd}${arr.fltNo}`) : "";
    const arrSpotNoOrEqp = arr
        ? arr.orgSpotNo || [arr.orgShipNo, arr.orgEqp].filter((v) => !!v).join(" ")
        : "";
    const depFlt = dep ? (dep.casFltNo ? dep.casFltNo : `${dep.alCd}${dep.fltNo}`) : "";
    const depSpotNoOrEqp = dep
        ? dep.orgSpotNo || [dep.orgShipNo, dep.orgEqp].filter((v) => !!v).join(" ")
        : "";
    const triangleWidth = 14;
    const triangleHeight = 40;
    const fullWidth = 344;
    const bar = (arrBar, depBar) => {
        let width = fullWidth / 2 - 4;
        if (arrBar && depBar) {
            width = fullWidth;
        }
        return (react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${width} ${triangleHeight}`, style: { width, height: triangleHeight, left: -2 } },
            react_1.default.createElement("path", { d: `M 0 0 L ${arrBar ? triangleWidth : 0} ${triangleHeight} L ${width - (depBar ? triangleWidth : 0)} ${triangleHeight} L ${width} 0 L 0 0`, stroke: "transparent", fill: "#CBE5E3", strokeWidth: "0" })));
    };
    switch (selectedTarget) {
        case "ARR_DEP_SAME":
            if (arr && dep) {
                return (react_1.default.createElement(Container, null,
                    bar(true, true),
                    react_1.default.createElement(ArrContainer, { flt: arrFlt },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, arrFlt),
                            react_1.default.createElement("span", null,
                                " ",
                                arr.lstDepApoCd,
                                "-",
                                arr.lstArrApoCd)),
                        react_1.default.createElement("div", null, arrSpotNoOrEqp)),
                    react_1.default.createElement(DepContainer, { flt: depFlt },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, depFlt),
                            react_1.default.createElement("span", null,
                                " ",
                                dep.lstDepApoCd,
                                "-",
                                dep.lstArrApoCd)),
                        react_1.default.createElement("div", null, depSpotNoOrEqp))));
            }
            break;
        case "ARR_DEP_DIFF":
            if (arr && dep) {
                return (react_1.default.createElement(Container, null,
                    bar(true, false),
                    react_1.default.createElement(DivisionBar, null),
                    bar(false, true),
                    react_1.default.createElement(ArrContainer, { flt: arrFlt },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, arrFlt),
                            react_1.default.createElement("span", null,
                                " ",
                                arr.lstDepApoCd,
                                "-",
                                arr.lstArrApoCd)),
                        react_1.default.createElement("div", null, arrSpotNoOrEqp)),
                    react_1.default.createElement(DepContainer, { flt: depFlt },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, depFlt),
                            react_1.default.createElement("span", null,
                                " ",
                                dep.lstDepApoCd,
                                "-",
                                dep.lstArrApoCd)),
                        react_1.default.createElement("div", null, depSpotNoOrEqp))));
            }
            break;
        case "ARR":
            if (arr) {
                return (react_1.default.createElement(Container, null,
                    bar(true, false),
                    react_1.default.createElement(ArrContainer, { center: true, flt: arrFlt },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, arrFlt),
                            react_1.default.createElement("span", null,
                                " ",
                                arr.lstDepApoCd,
                                "-",
                                arr.lstArrApoCd)),
                        react_1.default.createElement("div", null, arrSpotNoOrEqp))));
            }
            break;
        case "DEP":
            if (dep) {
                return (react_1.default.createElement(Container, null,
                    bar(false, true),
                    react_1.default.createElement(DepContainer, { center: true, flt: depFlt },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, depFlt),
                            react_1.default.createElement("span", null,
                                " ",
                                dep.lstDepApoCd,
                                "-",
                                dep.lstArrApoCd)),
                        react_1.default.createElement("div", null, depSpotNoOrEqp))));
            }
            break;
        default:
            break;
    }
    return null;
};
const Container = styled_components_1.default.div `
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  margin: 0 11px;
  width: 352px;
  height: 60px;
`;
const DivisionBar = styled_components_1.default.div `
  width: 8px;
  height: 40px;
`;
const ArrContainer = styled_components_1.default.div `
  position: absolute;
  ${(props) => (props.center ? "right: 102px;" : "right: 186px;")}
  width: 167px;
  > span,
  div {
    font-size: 14px;
    font-weight: bold;
    text-align: right;
  }
  > div {
    height: 16px;
    span:first-child {
      font-size: ${({ flt }) => (flt.length > 7 ? 9 : 14)}px;
    }
  }
`;
const DepContainer = styled_components_1.default.div `
  position: absolute;
  ${(props) => (props.center ? "left: 102px;" : "left: 186px;")}
  width: 170px;
  > span,
  div {
    font-size: 14px;
    font-weight: bold;
    text-align: left;
  }
  > div {
    height: 16px;
    span:first-child {
      font-size: ${({ flt }) => (flt.length > 7 ? 9 : 14)}px;
    }
  }
`;
exports.default = ArrDepBars;
//# sourceMappingURL=ArrDepBars.js.map