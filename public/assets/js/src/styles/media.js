"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styled_media_query_1 = require("styled-media-query");
const commonConst_1 = require("../lib/commonConst");
const customMedia = (0, styled_media_query_1.generateMedia)({
    desktopL: commonConst_1.Const.MAX_WIDTH,
    desktopM: "1366px",
    "1365px": "1365px",
    "1024px": "1024px",
    "1023px": "1023px",
    desktopS: "992px",
    tablet: "768px",
    mobile: "576px",
});
exports.default = customMedia;
//# sourceMappingURL=media.js.map