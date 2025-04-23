"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const colorStyle_1 = __importStar(require("./colorStyle"));
const darkColor = {
    ...colorStyle_1.default,
    HEADER_GRADIENT: colorStyle_1.isProduction
        ? colorStyle_1.isParallelProduction
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
        ...colorStyle_1.default.button,
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
exports.default = darkColor;
//# sourceMappingURL=colorStyleDark.js.map