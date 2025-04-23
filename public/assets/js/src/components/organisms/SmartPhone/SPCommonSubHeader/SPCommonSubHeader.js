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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../../store/hooks");
const commonUtil_1 = require("../../../../lib/commonUtil");
const commonConst_1 = require("../../../../lib/commonConst");
const common_1 = require("../../../../reducers/common");
const UpdateRmksPopup_1 = __importDefault(require("../../../molecules/UpdateRmksPopup"));
const SPCommonSubHeader = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const [rmksPopupIsOpen, setRmksPopupIsOpen] = (0, react_1.useState)(false);
    const [rmksPopupWidth, setRmksPopupWidth] = (0, react_1.useState)(0);
    const [rmksPopupHeight, setRmksPopupHeight] = (0, react_1.useState)(0);
    const [rmksPopupTop, setRmksPopupTop] = (0, react_1.useState)(0);
    const [rmksPopupLeft, setRmksPopupLeft] = (0, react_1.useState)(0);
    const rmksTextRef = (0, react_1.useRef)(null);
    const isRmksEnabled = () => !!jobAuth.user.myApoCd &&
        jobAuth.user.myApoCd === common.headerInfo.apoCd &&
        (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateAireportRemarks, jobAuth.jobAuth);
    const openRmksPopup = () => {
        const node = rmksTextRef.current;
        if (node) {
            setRmksPopupIsOpen(true);
            setRmksPopupWidth(node.clientWidth);
            setRmksPopupHeight(node.clientHeight);
            setRmksPopupTop(node.getBoundingClientRect().top);
            setRmksPopupLeft(node.getBoundingClientRect().left);
        }
    };
    const closeRmksPopup = () => {
        setRmksPopupIsOpen(false);
    };
    const updateRmks = (text) => {
        if (text.length <= 2048) {
            dispatch((0, common_1.setAirportRemarks)(text));
        }
    };
    const { apoRmksInfo } = common.headerInfo;
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(AptRmksContainer, { ref: rmksTextRef, onClick: openRmksPopup, isEmpty: !apoRmksInfo },
            react_1.default.createElement("div", null, apoRmksInfo || "Airport Remarks")),
        react_1.default.createElement(UpdateRmksPopup_1.default, { isOpen: rmksPopupIsOpen, width: rmksPopupWidth, height: rmksPopupHeight, top: rmksPopupTop, left: rmksPopupLeft, initialRmksText: apoRmksInfo, isSubmitable: isRmksEnabled(), placeholder: "Airport Remarks", onClose: closeRmksPopup, update: updateRmks })));
};
const Wrapper = styled_components_1.default.div `
  padding: 0 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.color.HEADER_GRADIENT};
`;
const AptRmksContainer = styled_components_1.default.div `
  width: 100%;
  max-width: 700px;
  min-height: 56px;
  padding: 6px 10px 5px;
  line-height: 20px;
  border-radius: 1px;
  border: none;
  color: ${(props) => (props.isEmpty ? props.theme.color.PLACEHOLDER : props.theme.color.DEFAULT_FONT_COLOR)};
  background: ${(props) => props.theme.color.WHITE};
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 1px 1px #ccc inset;
  cursor: pointer;
`;
exports.default = SPCommonSubHeader;
//# sourceMappingURL=SPCommonSubHeader.js.map