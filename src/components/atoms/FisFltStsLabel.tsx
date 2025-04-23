import React from "react";
import styled from "styled-components";

const FisFltStsLabel: React.FC<{ children: React.ReactNode; isPc: boolean; isDarkMode: boolean; isBarChart?: boolean }> = ({
  children,
  isPc,
  isDarkMode,
  isBarChart = false,
}) => {
  const labelColor = getLabelColor({ fltSts: children as string, isDarkMode, isBarChart });
  if (children) {
    return (
      <StyledLabel isPc={isPc} isBarChart={isBarChart} labelColor={labelColor}>
        {children}
      </StyledLabel>
    );
  }
  return null;
};

type LabelColorType = {
  color: string;
  backgroundColor: string;
  borderColor: string;
  statusColor: string; // FIS境界のバーの色
};

const black = "#000";
const white = "#FFF";

export const getLabelColor = ({
  fltSts,
  isDarkMode,
  isBarChart = false,
  isArr,
}: {
  fltSts: string;
  isDarkMode: boolean;
  isBarChart?: boolean;
  isArr?: boolean;
}): LabelColorType => {
  // PCの場合、黒字は極太にする
  switch (fltSts) {
    case "B/O":
      if (isDarkMode) {
        return {
          color: black,
          backgroundColor: "rgb(61,204,0)", // green(dark)
          borderColor: "rgb(61,204,0)", // green(dark)
          statusColor: isArr === undefined || !isArr ? "rgb(61,204,0)" : "", // green(dark)
        };
      }
      return {
        color: white,
        backgroundColor: "rgb(54,179,0)", // green
        borderColor: "rgb(54,179,0)", // green
        statusColor: isArr === undefined || !isArr ? "rgb(54,179,0)" : "", // green
      };

    case "L/D":
      if (isDarkMode) {
        return {
          color: black,
          backgroundColor: "rgb(61,204,0)", // green(dark)
          borderColor: "rgb(61,204,0)", // green(dark)
          statusColor: isArr === undefined || isArr ? "rgb(61,204,0)" : "", // green(dark)
        };
      }
      return {
        color: white,
        backgroundColor: "rgb(54,179,0)", // green
        borderColor: "rgb(54,179,0)", // green
        statusColor: isArr === undefined || isArr ? "rgb(54,179,0)" : "", // green
      };

    case "T/O":
      if (isDarkMode) {
        return {
          color: black,
          backgroundColor: "rgb(0,204,255)", // skyblue(dark)
          borderColor: "rgb(0,204,255)", // skyblue(dark)
          statusColor: isArr === undefined || !isArr ? "rgb(0,204,255)" : "", // skyblue(dark)
        };
      }
      return {
        color: white,
        backgroundColor: "rgb(20,167,204)", // skyblue
        borderColor: "rgb(20,167,204)", // skyblue
        statusColor: isArr === undefined || !isArr ? "rgb(20,167,204)" : "", // skyblue
      };

    case "APP":
      if (isDarkMode) {
        return {
          color: black,
          backgroundColor: "rgb(0,204,255)", // skyblue(dark)
          borderColor: "rgb(0,204,255)", // skyblue(dark)
          statusColor: isArr === undefined || isArr ? "rgb(0,204,255)" : "", // skyblue(dark)
        };
      }
      return {
        color: white,
        backgroundColor: "rgb(20,167,204)", // skyblue
        borderColor: "rgb(20,167,204)", // skyblue
        statusColor: isArr === undefined || isArr ? "rgb(20,167,204)" : "", // skyblue
      };

    case "HLD":
    case "ADV":
    case "DLY":
    case "MNT":
      if (isDarkMode) {
        return {
          color: black,
          backgroundColor: "rgb(234,168,18)", // orange(dark)
          borderColor: "rgb(234,168,18)", // orange(dark)
          statusColor: "rgb(234,168,18)", // orange(dark)
        };
      }
      return {
        color: white,
        backgroundColor: "rgb(230,166,18)", // orange
        borderColor: "rgb(230,166,18)", // orange
        statusColor: "rgb(230,166,18)", // orange
      };

    case "CNL":
      return {
        color: white,
        backgroundColor: "rgb(113,8,25)", // dark red
        borderColor: "rgb(217,25,0)", // red
        statusColor: "rgb(113,8,25)", // dark red
      };
    case "G/A":
    case "GTB":
    case "ATB":
    case "DVT":
    case "DIV":
      return {
        color: white,
        backgroundColor: "rgb(217,25,0)", // red
        borderColor: "rgb(217,25,0)", // red
        statusColor: "rgb(217,25,0)", // red
      };
    case "H/J":
      if (isDarkMode) {
        return {
          color: black,
          backgroundColor: "rgb(232,255,0)", // yellow
          borderColor: "rgb(232,255,0)", // yellow
          statusColor: "rgb(232,255,0)", // yellow
        };
      }
      return {
        color: "rgb(232,255,0)", // yellow
        backgroundColor: "#000",
        borderColor: "#000",
        statusColor: "#000",
      };

    default:
      if (isDarkMode) {
        return {
          color: white,
          backgroundColor: "rgb(57,65,72)", // dark gray
          borderColor: "rgb(57,65,72)", // dark gray
          statusColor: "",
        };
      }
      if (isBarChart) {
        return {
          color: white,
          backgroundColor: "rgb(57,65,72)", // dark gray
          borderColor: "rgb(57,65,72)", // dark gray
          statusColor: "",
        };
      }
      return {
        color: black,
        backgroundColor: "rgb(197,197,197)", // light gray
        borderColor: "rgb(197,197,197)", // light gray
        statusColor: "",
      };
  }
};

const StyledLabel = styled.div<{ isPc: boolean; isBarChart: boolean; labelColor: LabelColorType }>`
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

export default FisFltStsLabel;
