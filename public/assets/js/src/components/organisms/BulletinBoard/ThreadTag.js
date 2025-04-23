"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadTag = exports.Component = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const commonConst_1 = require("../../../lib/commonConst");
const Component = ({ text, cdCtrlDtls }) => {
    const category = () => {
        const matches = cdCtrlDtls.filter((code) => code.cdCls === commonConst_1.Const.CodeClass.BULLETIN_BOARD_CATEGORY && code.cdCat1 === text);
        if (matches.length > 0) {
            return { value: matches[0].txt1, color: matches[0].cd1 };
        }
        return { value: text, color: "#888" };
    };
    const cat = category();
    return react_1.default.createElement(Tag, { themeColor: cat.color }, cat.value);
};
exports.Component = Component;
exports.ThreadTag = (0, react_redux_1.connect)((state) => ({ cdCtrlDtls: state.account.master.cdCtrlDtls }))(exports.Component);
const Tag = styled_components_1.default.span `
  display: inline-flex;
  background-color: ${(props) => props.themeColor};
  color: #fff;
  font-size: 15px;
  padding: 2px 4px;
  border-radius: 4px;
`;
//# sourceMappingURL=ThreadTag.js.map