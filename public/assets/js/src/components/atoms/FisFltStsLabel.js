"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelColor = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const FisFltStsLabel = ({ children, isPc, isDarkMode, isBarChart = false, }) => {
    const labelColor = (0, exports.getLabelColor)({ fltSts: children, isDarkMode, isBarChart });
    if (children) {
        return (react_1.default.createElement(StyledLabel, { isPc: isPc, isBarChart: isBarChart, labelColor: labelColor }, children));
    }
    return null;
};
const black = "#000";
const white = "#FFF";
const getLabelColor = ({ fltSts, isDarkMode, isBarChart = false, isArr, }) => {
    // PCの場合、黒字は極太にする
    switch (fltSts) {
        case "B/O":
            if (isDarkMode) {
                return {
                    color: black,
                    backgroundColor: "rgb(61,204,0)",
                    borderColor: "rgb(61,204,0)",
                    statusColor: isArr === undefined || !isArr ? "rgb(61,204,0)" : "", // green(dark)
                };
            }
            return {
                color: white,
                backgroundColor: "rgb(54,179,0)",
                borderColor: "rgb(54,179,0)",
                statusColor: isArr === undefined || !isArr ? "rgb(54,179,0)" : "", // green
            };
        case "L/D":
            if (isDarkMode) {
                return {
                    color: black,
                    backgroundColor: "rgb(61,204,0)",
                    borderColor: "rgb(61,204,0)",
                    statusColor: isArr === undefined || isArr ? "rgb(61,204,0)" : "", // green(dark)
                };
            }
            return {
                color: white,
                backgroundColor: "rgb(54,179,0)",
                borderColor: "rgb(54,179,0)",
                statusColor: isArr === undefined || isArr ? "rgb(54,179,0)" : "", // green
            };
        case "T/O":
            if (isDarkMode) {
                return {
                    color: black,
                    backgroundColor: "rgb(0,204,255)",
                    borderColor: "rgb(0,204,255)",
                    statusColor: isArr === undefined || !isArr ? "rgb(0,204,255)" : "", // skyblue(dark)
                };
            }
            return {
                color: white,
                backgroundColor: "rgb(20,167,204)",
                borderColor: "rgb(20,167,204)",
                statusColor: isArr === undefined || !isArr ? "rgb(20,167,204)" : "", // skyblue
            };
        case "APP":
            if (isDarkMode) {
                return {
                    color: black,
                    backgroundColor: "rgb(0,204,255)",
                    borderColor: "rgb(0,204,255)",
                    statusColor: isArr === undefined || isArr ? "rgb(0,204,255)" : "", // skyblue(dark)
                };
            }
            return {
                color: white,
                backgroundColor: "rgb(20,167,204)",
                borderColor: "rgb(20,167,204)",
                statusColor: isArr === undefined || isArr ? "rgb(20,167,204)" : "", // skyblue
            };
        case "HLD":
        case "ADV":
        case "DLY":
        case "MNT":
            if (isDarkMode) {
                return {
                    color: black,
                    backgroundColor: "rgb(234,168,18)",
                    borderColor: "rgb(234,168,18)",
                    statusColor: "rgb(234,168,18)", // orange(dark)
                };
            }
            return {
                color: white,
                backgroundColor: "rgb(230,166,18)",
                borderColor: "rgb(230,166,18)",
                statusColor: "rgb(230,166,18)", // orange
            };
        case "CNL":
            return {
                color: white,
                backgroundColor: "rgb(113,8,25)",
                borderColor: "rgb(217,25,0)",
                statusColor: "rgb(113,8,25)", // dark red
            };
        case "G/A":
        case "GTB":
        case "ATB":
        case "DVT":
        case "DIV":
            return {
                color: white,
                backgroundColor: "rgb(217,25,0)",
                borderColor: "rgb(217,25,0)",
                statusColor: "rgb(217,25,0)", // red
            };
        case "H/J":
            if (isDarkMode) {
                return {
                    color: black,
                    backgroundColor: "rgb(232,255,0)",
                    borderColor: "rgb(232,255,0)",
                    statusColor: "rgb(232,255,0)", // yellow
                };
            }
            return {
                color: "rgb(232,255,0)",
                backgroundColor: "#000",
                borderColor: "#000",
                statusColor: "#000",
            };
        default:
            if (isDarkMode) {
                return {
                    color: white,
                    backgroundColor: "rgb(57,65,72)",
                    borderColor: "rgb(57,65,72)",
                    statusColor: "",
                };
            }
            if (isBarChart) {
                return {
                    color: white,
                    backgroundColor: "rgb(57,65,72)",
                    borderColor: "rgb(57,65,72)",
                    statusColor: "",
                };
            }
            return {
                color: black,
                backgroundColor: "rgb(197,197,197)",
                borderColor: "rgb(197,197,197)",
                statusColor: "",
            };
    }
};
exports.getLabelColor = getLabelColor;
const StyledLabel = styled_components_1.default.div `
  display: block;
  min-width: ${({ isBarChart }) => (isBarChart ? "36px" : "40px")};
  padding: ${({ isBarChart }) => (isBarChart ? ".05em .25em .05em" : ".1em .25em .1em")};
  font-size: ${({ isBarChart }) => (isBarChart ? "14px" : "15px")};
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  //vertical-align: baseline;
  ${({ isPc, labelColor }) => (isPc && labelColor.color === black ? "-webkit-text-stroke: 1px" : "")};
  color: ${({ labelColor }) => labelColor.color};
  background-color: ${({ labelColor }) => labelColor.backgroundColor};
  border-color: ${({ labelColor }) => labelColor.borderColor};
  border-width: ${({ isBarChart }) => (isBarChart ? "1px" : "2px")};
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
`;
exports.default = FisFltStsLabel;
//# sourceMappingURL=FisFltStsLabel.js.map