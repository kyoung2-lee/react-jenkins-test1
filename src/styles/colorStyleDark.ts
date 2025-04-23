import baseColor, { BaseColorProps, ModeColorProps, isProduction, isParallelProduction } from "./colorStyle";

const darkColor: BaseColorProps & ModeColorProps = {
  ...baseColor,
  HEADER_GRADIENT: isProduction
    ? isParallelProduction
      ? "linear-gradient(to right, #8205D5, #E6E600)"
      : "linear-gradient(to right, rgb(42, 148, 147), rgba(31, 122, 158))"
    : "linear-gradient(to right, #FF2525, #FF3BEF)",
  PRIMARY_GRADIENT: "linear-gradient(to right, rgb(42, 148, 147), rgba(31, 122, 158))",
  PRIMARY: "#1b435e",
  PRIMARY_BASE: "#FFFFFF",
  DEFAULT_FONT_COLOR: "#FFFFFF",
  DEFAULT_FONT_WEIGHT: "500",
  PLACEHOLDER: "#98AFBF",
  button: {
    ...baseColor.button,
    PRIMARY: "#1b435e",
    PRIMARY_HOVER: "#0d3047",
    PRIMARY_ACTIVE: "#051f30",
    PRIMARY_OFF: "#aab3b0",
    PRIMARY_OFF_HOVER: "#95a19e",
  },
  fis: {
    background: "#000000",
    date: {
      color: "#5DC7C6",
      background: "#000000",
      borderColor: "#4C5860",
    },
    header: {
      background: {
        active: "#1B435E",
        inactive: "#1C7488",
      },
    },
    row: {
      background: "#08121A",
      box: {
        background: "#151e26",
      },
      clickableLabel: {
        color: "#637482",
      },
    },
  },
  filter: {
    color: "#222222",
    boxShadowColor: "rgba(224,232,238,0.4)",
    button: {
      filtered: "#E6B422",
    },
  },
  remarks: {
    background: "#0B1A25",
    shadow: "none",
  },
};

export default darkColor;
