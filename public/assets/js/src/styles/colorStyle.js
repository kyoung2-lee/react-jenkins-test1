"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isParallelProduction = exports.isProduction = exports.isWindows = void 0;
const ua = navigator.userAgent.toLowerCase();
const isWindows = () => ua.indexOf("windows") > -1;
exports.isWindows = isWindows;
const isMacPc = () => ua.indexOf("macintosh") > -1 && !("ontouchend" in document);
exports.isProduction = ["www.soala.jal.co.jp", "www.soala.crane.jal.biz"].includes(window.location.hostname);
exports.isParallelProduction = "www.soala.crane.jal.biz".includes(window.location.hostname) && window.location.pathname.startsWith("/v3/");
const FONT_FAMILY_PC_WIN = "'游ゴシック', 'Yu Gothic', Meiryo, メイリオ, sans-serif";
const FONT_FAMILY_PC_MAC = "Avenir, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', sans-serif";
const FONT_FAMILY_DEFAULT = "Avenir, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', Verdana, 'メイリオ', meiryo, sans-serif";
const baseColor = {
    WHITE: "#fff",
    HEADER_GRADIENT: exports.isProduction
        ? exports.isParallelProduction
            ? "linear-gradient(to right, #8205D5, #E6E600)"
            : "linear-gradient(to right, rgb(53, 186, 184), rgb(39, 153, 198))"
        : "linear-gradient(to right, #FF2525, #FF3BEF)",
    PRIMARY_GRADIENT: "linear-gradient(to right, rgb(53, 186, 184), rgb(39, 153, 198))",
    PRIMARY: "#346181",
    PRIMARY_BASE: "#fff",
    DEFAULT_FONT_COLOR: "#222",
    DEFAULT_FONT_FAMILY: (0, exports.isWindows)() ? FONT_FAMILY_PC_WIN : isMacPc() ? FONT_FAMILY_PC_MAC : FONT_FAMILY_DEFAULT,
    DEFAULT_FONT_WEIGHT: (0, exports.isWindows)() ? "600" : "normal",
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
exports.default = baseColor;
//# sourceMappingURL=colorStyle.js.map