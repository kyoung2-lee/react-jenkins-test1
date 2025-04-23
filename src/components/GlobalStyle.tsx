/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import theme from "reapop-theme-wybo";
import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";
import baseColor from "../styles/colorStyle";

const GlobalStyle = createGlobalStyle`
 ${normalize}
  html {
    height: 100%;
  }

  body {
    height: 100%;
    color: ${baseColor.DEFAULT_FONT_COLOR};
    font-family: ${baseColor.DEFAULT_FONT_FAMILY};
    font-weight: ${baseColor.DEFAULT_FONT_WEIGHT};
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
export default GlobalStyle;
