export interface BaseColorProps {
  WHITE: string;
  HEADER_GRADIENT: string;
  PRIMARY_GRADIENT: string;
  PRIMARY: string;
  PRIMARY_BASE: string;
  DEFAULT_FONT_COLOR: string;
  DEFAULT_FONT_FAMILY: string;
  DEFAULT_FONT_WEIGHT: string;
  FLIGHT_ROW_BACKGROUND_COLOR: string;
  PLACEHOLDER: string;
  pallet: {
    primary: string;
  };
  button: {
    PRIMARY: string;
    PRIMARY_HOVER: string;
    PRIMARY_ACTIVE: string;
    PRIMARY_OFF: string;
    PRIMARY_OFF_HOVER: string;
    SECONDARY: string;
    SECONDARY_HOVER: string;
    SECONDARY_ACTIVE: string;
  };
  border: {
    PRIMARY: string;
    ERROR: string;
  };
  text: {
    CHANGED: string;
  };
  background: {
    DELETED: string;
  };
}

export interface ModeColorProps {
  fis: {
    background: string;
    date: {
      color: string;
      background: string;
      borderColor: string;
    };
    header: {
      background: {
        active: string;
        inactive: string;
      };
    };
    row: {
      background: string;
      box: {
        background: string;
      };
      clickableLabel: {
        color: string;
      };
    };
  };
  filter: {
    color: string;
    boxShadowColor: string;
    button: {
      filtered: string;
    };
  };
  remarks: {
    background: string;
    shadow: string;
  };
}

const ua = navigator.userAgent.toLowerCase();

export const isWindows = (): boolean => ua.indexOf("windows") > -1;
const isMacPc = (): boolean => ua.indexOf("macintosh") > -1 && !("ontouchend" in document);

export const isProduction = ["www.soala.jal.co.jp", "www.soala.crane.jal.biz"].includes(window.location.hostname);
export const isParallelProduction =
  "www.soala.crane.jal.biz".includes(window.location.hostname) && window.location.pathname.startsWith("/v3/");

const FONT_FAMILY_PC_WIN = "'游ゴシック', 'Yu Gothic', Meiryo, メイリオ, sans-serif";
const FONT_FAMILY_PC_MAC = "Avenir, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', sans-serif";
const FONT_FAMILY_DEFAULT = "Avenir, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', Verdana, 'メイリオ', meiryo, sans-serif";

const baseColor: BaseColorProps = {
  WHITE: "#fff",
  HEADER_GRADIENT: isProduction
    ? isParallelProduction
      ? "linear-gradient(to right, #8205D5, #E6E600)"
      : "linear-gradient(to right, rgb(53, 186, 184), rgb(39, 153, 198))"
    : "linear-gradient(to right, #FF2525, #FF3BEF)",
  PRIMARY_GRADIENT: "linear-gradient(to right, rgb(53, 186, 184), rgb(39, 153, 198))",
  PRIMARY: "#346181",
  PRIMARY_BASE: "#fff",
  DEFAULT_FONT_COLOR: "#222",
  DEFAULT_FONT_FAMILY: isWindows() ? FONT_FAMILY_PC_WIN : isMacPc() ? FONT_FAMILY_PC_MAC : FONT_FAMILY_DEFAULT,
  DEFAULT_FONT_WEIGHT: isWindows() ? "600" : "normal",
  FLIGHT_ROW_BACKGROUND_COLOR: "#F6F6F6",
  PLACEHOLDER: "#C9D3D0",
  pallet: {
    primary: "#2FADBD",
  },
  button: {
    PRIMARY: "#346181",
    PRIMARY_HOVER: "#214a67",
    PRIMARY_ACTIVE: "#153e5c",
    PRIMARY_OFF: "#c8d3d0",
    PRIMARY_OFF_HOVER: "#b4bdbb",
    SECONDARY: "#eeeeee",
    SECONDARY_HOVER: "#e4e4e4",
    SECONDARY_ACTIVE: "#d8d8d8",
  },
  border: {
    PRIMARY: "#346181",
    ERROR: "#cc001f",
  },
  text: {
    CHANGED: "#cc001f",
  },
  background: {
    DELETED: "#F8C8DA",
  },
};

export default baseColor;
