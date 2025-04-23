import baseColor, { BaseColorProps, ModeColorProps } from "./colorStyle";

const lightColor: BaseColorProps & ModeColorProps = {
  ...baseColor,
  fis: {
    background: "#fff",
    date: {
      background: "#fff",
      color: "#346181",
      borderColor: "#98AFBF",
    },
    header: {
      background: {
        active: "#346181",
        inactive: "#28A5C2",
      },
    },
    row: {
      background: "#f6f6f6",
      box: {
        background: "#eaeaea",
      },
      clickableLabel: {
        color: "#94AABB",
      },
    },
  },
  filter: {
    color: "#222222",
    boxShadowColor: "rgba(34,34,34,0.4)",
    button: {
      filtered: "#E6B422",
    },
  },
  remarks: {
    background: "#fff",
    shadow: "0px 0px 1px 1px #ccc inset",
  },
};

export default lightColor;
