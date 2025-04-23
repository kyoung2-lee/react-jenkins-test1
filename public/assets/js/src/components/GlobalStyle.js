"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import theme from "reapop-theme-wybo";
const styled_components_1 = require("styled-components");
const styled_normalize_1 = require("styled-normalize");
const colorStyle_1 = __importDefault(require("../styles/colorStyle"));
const GlobalStyle = (0, styled_components_1.createGlobalStyle) `
 ${styled_normalize_1.normalize}
  html {
    height: 100%;
  }

  body {
    height: 100%;
    color: ${colorStyle_1.default.DEFAULT_FONT_COLOR};
    font-family: ${colorStyle_1.default.DEFAULT_FONT_FAMILY};
    font-weight: ${colorStyle_1.default.DEFAULT_FONT_WEIGHT};
  }

  *, *:before, *:after {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      -o-box-sizing: border-box;
      -ms-box-sizing: border-box;
      box-sizing: border-box;
  }

  *:focus {
    outline: none;
  }

  input {
    &[type=text], &[type=email], &[type=password], &[type=number], &[type=submit] {
      -webkit-appearance: none;
    }
    font-family: inherit;
    font-weight: inherit;
  }

  textarea {
    -webkit-appearance: none;
    font-family: inherit;
    font-weight: inherit;
  }

  button {
    font-family: inherit;
    font-weight: inherit;
  }

  .reapop__container {
    z-index: 999999999 !important;
  }
`;
exports.default = GlobalStyle;
//# sourceMappingURL=GlobalStyle.js.map