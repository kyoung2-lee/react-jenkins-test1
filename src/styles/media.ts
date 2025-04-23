import { generateMedia } from "styled-media-query";
import { Const } from "../lib/commonConst";

const customMedia = generateMedia({
  desktopL: Const.MAX_WIDTH,
  desktopM: "1366px",
  "1365px": "1365px",
  "1024px": "1024px",
  "1023px": "1023px",
  desktopS: "992px",
  tablet: "768px",
  mobile: "576px",
});

export default customMedia;
