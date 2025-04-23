"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const dayjs_1 = __importDefault(require("dayjs"));
const styled_components_1 = __importDefault(require("styled-components"));
const apo_sww_0_svg_1 = __importDefault(require("../../assets/images/status/apo_sww_0.svg"));
const apo_sww_1_svg_1 = __importDefault(require("../../assets/images/status/apo_sww_1.svg"));
const apo_sww_2_svg_1 = __importDefault(require("../../assets/images/status/apo_sww_2.svg"));
const apo_sww_3_svg_1 = __importDefault(require("../../assets/images/status/apo_sww_3.svg"));
const apo_sww_cnl_svg_1 = __importDefault(require("../../assets/images/status/apo_sww_cnl.svg"));
const apo_tsw_0_svg_1 = __importDefault(require("../../assets/images/status/apo_tsw_0.svg"));
const apo_tsw_1_svg_1 = __importDefault(require("../../assets/images/status/apo_tsw_1.svg"));
const apo_tsw_2_svg_1 = __importDefault(require("../../assets/images/status/apo_tsw_2.svg"));
const apo_tsw_cnl_svg_1 = __importDefault(require("../../assets/images/status/apo_tsw_cnl.svg"));
const apo_dic_svg_1 = __importDefault(require("../../assets/images/status/apo_dic.svg"));
const apo_rcl_svg_1 = __importDefault(require("../../assets/images/status/apo_rcl.svg"));
const apo_ssp_svg_1 = __importDefault(require("../../assets/images/status/apo_ssp.svg"));
const apo_sec_1_svg_1 = __importDefault(require("../../assets/images/status/apo_sec_1.svg"));
const apo_sec_2_svg_1 = __importDefault(require("../../assets/images/status/apo_sec_2.svg"));
const apo_sec_3_svg_1 = __importDefault(require("../../assets/images/status/apo_sec_3.svg"));
// Nullを返却したいのでComponentではなくfunctionにした
function getIssueIcon({ issu, key, terminalUtcDate }) {
    let utcDate = null;
    switch (issu.issuCd) {
        case "SEC":
            switch (issu.issuDtlCd) {
                case "LV1":
                    return react_1.default.createElement(ApoIconSec1, { key: key });
                case "LV2":
                    return react_1.default.createElement(ApoIconSec2, { key: key });
                case "LV3":
                    return react_1.default.createElement(ApoIconSec3, { key: key });
                default:
                    return "";
            }
        case "SWW":
            switch (issu.issuDtlCd) {
                case "WAR":
                    return react_1.default.createElement(ApoIconSww0, { key: key });
                case "CD1":
                    return react_1.default.createElement(ApoIconSww1, { key: key });
                case "CD2":
                    return react_1.default.createElement(ApoIconSww2, { key: key });
                case "CD3":
                    return react_1.default.createElement(ApoIconSww3, { key: key });
                case "CNL":
                    // 24時間だけ表示する
                    utcDate = dayjs_1.default.utc(issu.updateTime);
                    if (terminalUtcDate && terminalUtcDate.diff(utcDate, "hour") >= 24) {
                        return "";
                    }
                    return react_1.default.createElement(ApoIconSwwCnl, { key: key });
                default:
                    return "";
            }
        case "TSW":
            switch (issu.issuDtlCd) {
                case "WAR":
                    return react_1.default.createElement(ApoIconTsw0, { key: key });
                case "CD1":
                    return react_1.default.createElement(ApoIconTsw1, { key: key });
                case "CD2":
                    return react_1.default.createElement(ApoIconTsw2, { key: key });
                case "CNL":
                    // 24時間だけ表示する
                    utcDate = dayjs_1.default.utc(issu.updateTime);
                    if (terminalUtcDate && terminalUtcDate.diff(utcDate, "hour") >= 24) {
                        return "";
                    }
                    return react_1.default.createElement(ApoIconTswCnl, { key: key });
                default:
                    return "";
            }
        case "DIC":
            switch (issu.issuDtlCd) {
                case "ON":
                    return react_1.default.createElement(ApoIconDic, { key: key });
                default:
                    return "";
            }
        case "RCL":
            switch (issu.issuDtlCd) {
                case "ON":
                    return react_1.default.createElement(ApoIconRcl, { key: key });
                default:
                    return "";
            }
        case "SSP":
            switch (issu.issuDtlCd) {
                case "ON":
                    return react_1.default.createElement(ApoIconSsp, { key: key });
                default:
                    return "";
            }
        default:
            return "";
    }
}
const ApoIconSww0 = styled_components_1.default.img.attrs({ src: apo_sww_0_svg_1.default }) ``;
const ApoIconSww1 = styled_components_1.default.img.attrs({ src: apo_sww_1_svg_1.default }) ``;
const ApoIconSww2 = styled_components_1.default.img.attrs({ src: apo_sww_2_svg_1.default }) ``;
const ApoIconSww3 = styled_components_1.default.img.attrs({ src: apo_sww_3_svg_1.default }) ``;
const ApoIconSwwCnl = styled_components_1.default.img.attrs({ src: apo_sww_cnl_svg_1.default }) ``;
const ApoIconTsw0 = styled_components_1.default.img.attrs({ src: apo_tsw_0_svg_1.default }) ``;
const ApoIconTsw1 = styled_components_1.default.img.attrs({ src: apo_tsw_1_svg_1.default }) ``;
const ApoIconTsw2 = styled_components_1.default.img.attrs({ src: apo_tsw_2_svg_1.default }) ``;
const ApoIconTswCnl = styled_components_1.default.img.attrs({ src: apo_tsw_cnl_svg_1.default }) ``;
const ApoIconDic = styled_components_1.default.img.attrs({ src: apo_dic_svg_1.default }) ``;
const ApoIconRcl = styled_components_1.default.img.attrs({ src: apo_rcl_svg_1.default }) ``;
const ApoIconSsp = styled_components_1.default.img.attrs({ src: apo_ssp_svg_1.default }) ``;
const ApoIconSec1 = styled_components_1.default.img.attrs({ src: apo_sec_1_svg_1.default }) ``;
const ApoIconSec2 = styled_components_1.default.img.attrs({ src: apo_sec_2_svg_1.default }) ``;
const ApoIconSec3 = styled_components_1.default.img.attrs({ src: apo_sec_3_svg_1.default }) ``;
exports.default = getIssueIcon;
//# sourceMappingURL=AirportIssueIcon.js.map