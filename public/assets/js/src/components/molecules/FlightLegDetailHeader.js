"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const CloseButton_1 = __importDefault(require("../atoms/CloseButton"));
const CsSign_1 = require("../atoms/CsSign");
const commonUtil_1 = require("../../lib/commonUtil");
const FlightLegDetailHeader = (props) => {
    const { mvtMsgHeader, onClose } = props;
    if (!mvtMsgHeader) {
        return react_1.default.createElement("div", null);
    }
    return (react_1.default.createElement(Header, null,
        react_1.default.createElement(Text, { fontSize: 22 },
            react_1.default.createElement(Text, { fontSize: 16 }, mvtMsgHeader.alCd),
            (0, commonUtil_1.formatFltNo)(mvtMsgHeader.fltNo)),
        react_1.default.createElement(Text, { fontSize: 22 },
            "/",
            (0, dayjs_1.default)(mvtMsgHeader.orgDateLcl).format("DDMMM").toUpperCase()),
        mvtMsgHeader.csFlg && react_1.default.createElement(CsSign, null),
        react_1.default.createElement(Space, { width: 12 }),
        react_1.default.createElement(Text, { fontSize: 20 },
            mvtMsgHeader.lstDepApoCd,
            "-",
            mvtMsgHeader.lstArrApoCd),
        react_1.default.createElement(Space, { width: 12 }),
        react_1.default.createElement(Text, { fontSize: 16 }, mvtMsgHeader.shipNo.slice(0, 2)),
        react_1.default.createElement(Text, { fontSize: 20 }, mvtMsgHeader.shipNo.slice(2)),
        react_1.default.createElement(Text, { fontSize: 20 }, mvtMsgHeader.seatConfCd ? `/${mvtMsgHeader.seatConfCd}` : undefined),
        react_1.default.createElement(Space, { width: 12 }),
        react_1.default.createElement(Text, { fontSize: 16 }, "TR:"),
        react_1.default.createElement(Text, { fontSize: 20 }, mvtMsgHeader.trAlCd),
        react_1.default.createElement(Space, { width: 8 }),
        react_1.default.createElement(Text, { fontSize: 16 }, "OM:"),
        react_1.default.createElement(Text, { fontSize: 20 }, mvtMsgHeader.omAlCd),
        react_1.default.createElement(Space, { width: typeof mvtMsgHeader.ccCnt === "number" ? 8 : 0 }),
        react_1.default.createElement(Text, { fontSize: 16 }, typeof mvtMsgHeader.ccCnt === "number" ? "CC:" : undefined),
        react_1.default.createElement(Text, { fontSize: 20 }, typeof mvtMsgHeader.ccCnt === "number" ? `${mvtMsgHeader.ccCnt}` : undefined),
        react_1.default.createElement(Space, { width: typeof mvtMsgHeader.caCnt === "number" ? 8 : 0 }),
        react_1.default.createElement(Text, { fontSize: 16 }, typeof mvtMsgHeader.caCnt === "number" ? "CA:" : undefined),
        react_1.default.createElement(Text, { fontSize: 20 }, typeof mvtMsgHeader.caCnt === "number" ? `${mvtMsgHeader.caCnt}` : undefined),
        react_1.default.createElement(Space, { width: typeof mvtMsgHeader.dhCcCnt === "number" || typeof mvtMsgHeader.dhCaCnt === "number" ? 8 : 0 }),
        react_1.default.createElement(Text, { fontSize: 16 }, typeof mvtMsgHeader.dhCcCnt === "number" || typeof mvtMsgHeader.dhCaCnt === "number" ? "DH:" : undefined),
        react_1.default.createElement(Text, { fontSize: 20 }, typeof mvtMsgHeader.dhCcCnt === "number" ? `${mvtMsgHeader.dhCcCnt}` : undefined),
        react_1.default.createElement(Text, { fontSize: 20 }, typeof mvtMsgHeader.dhCcCnt === "number" || typeof mvtMsgHeader.dhCaCnt === "number" ? "/" : undefined),
        react_1.default.createElement(Text, { fontSize: 20 }, typeof mvtMsgHeader.dhCaCnt === "number" ? `${mvtMsgHeader.dhCaCnt}` : undefined),
        react_1.default.createElement(Space, { width: typeof mvtMsgHeader.actPaxTtl === "number" ? 8 : 0 }),
        react_1.default.createElement(Text, { fontSize: 16 }, typeof mvtMsgHeader.actPaxTtl === "number" ? "PAX:" : undefined),
        react_1.default.createElement(Text, { fontSize: 20 }, typeof mvtMsgHeader.actPaxTtl === "number" ? `${mvtMsgHeader.actPaxTtl}` : undefined),
        react_1.default.createElement(CloseButton_1.default, { onClick: onClose, style: { marginRight: "13px" } })));
};
const Header = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
  color: white;
`;
const Space = styled_components_1.default.div `
  height: 100%;
  width: ${({ width }) => width}px;
`;
const Text = styled_components_1.default.span `
  font-size: ${({ fontSize }) => fontSize}px;
`;
const CsSign = (0, styled_components_1.default)(CsSign_1.CsSign) `
  margin-left: 3px;
  align-self: center;
`;
exports.default = FlightLegDetailHeader;
//# sourceMappingURL=FlightLegDetailHeader.js.map