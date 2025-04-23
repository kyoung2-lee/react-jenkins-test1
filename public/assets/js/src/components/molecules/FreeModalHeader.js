"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const commonUtil_1 = require("../../lib/commonUtil");
const FreeModalHeader = (props) => {
    const { legkey, isDep } = props;
    if (!legkey) {
        return react_1.default.createElement("div", null);
    }
    return (react_1.default.createElement(Header, null,
        react_1.default.createElement(HeaderLeft, null,
            react_1.default.createElement(Label, null, "Start line:"),
            react_1.default.createElement(FltNo, null,
                legkey.casFltNo ? "" : react_1.default.createElement(AlCd, null, legkey.alCd),
                legkey.casFltNo ? legkey.casFltNo : (0, commonUtil_1.formatFltNo)(legkey.fltNo)),
            react_1.default.createElement(Date, null,
                "/",
                (0, dayjs_1.default)(legkey.orgDateLcl).format("DDMMM").toUpperCase())),
        react_1.default.createElement(HeaderRight, null, isDep ? "DEP" : "ARR")));
};
const Header = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  width: 100%;
`;
const HeaderLeft = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
  font-size: 18px;
  margin-left: 16px;
`;
const HeaderRight = styled_components_1.default.div `
  font-size: 20px;
  margin-right: 46px;
`;
const Label = styled_components_1.default.span `
  font-size: 16px;
  margin-right: 4px;
`;
const AlCd = styled_components_1.default.span `
  font-size: 16px;
`;
const FltNo = styled_components_1.default.span `
  font-size: ${({ fontSize }) => fontSize || "23"}px;
`;
const Date = styled_components_1.default.span `
  font-size: ${({ fontSize }) => fontSize || "23"}px;
`;
exports.default = FreeModalHeader;
//# sourceMappingURL=FreeModalHeader.js.map