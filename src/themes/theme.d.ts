import "styled-components";
import color from "../styles/colorStyleDark";
import layout from "../styles/layoutStyle";

declare module "styled-components" {
  export interface DefaultTheme {
    color: typeof color;
    layout: typeof layout;
  }
}
