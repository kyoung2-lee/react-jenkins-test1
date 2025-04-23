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
const dayjs_1 = __importDefault(require("dayjs"));
const react_modal_1 = __importDefault(require("react-modal"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const commonConst_1 = require("../../../../lib/commonConst");
const hooks_1 = require("../../../../store/hooks");
const commonActions = __importStar(require("../../../../reducers/common"));
const MovableAirportIcons_1 = __importDefault(require("../../../molecules/MovableAirportIcons"));
const AirportIssueList_1 = __importDefault(require("../../../molecules/AirportIssueList"));
const icon_rwy_arr_svg_1 = __importDefault(require("../../../../assets/images/icon/icon-rwy-arr.svg"));
const icon_rwy_dep_svg_1 = __importDefault(require("../../../../assets/images/icon/icon-rwy-dep.svg"));
const SPCommonHeader = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const { pathname } = (0, react_router_dom_1.useLocation)();
    const history = (0, react_router_dom_1.useHistory)();
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const [isIssueListActive, setIsIssueListActive] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const apoCd = jobAuth.user.myApoCd;
        void dispatch(commonActions.getHeaderInfo({ apoCd }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 強制エラー画面への遷移
    (0, react_1.useEffect)(() => {
        if (common.isForceGoToError) {
            dispatch(commonActions.screenTransitionError());
            history.push(commonConst_1.Const.PATH_NAME.error);
        }
    }, [common.isForceGoToError, dispatch, history]);
    // 強制画面遷移
    (0, react_1.useEffect)(() => {
        if (common.forceGoToPath) {
            void dispatch(commonActions.screenTransition({ from: pathname, to: common.forceGoToPath }));
            history.push(common.forceGoToPath);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [common.forceGoToPath, dispatch, history]);
    const renderRunway = (index, label) => [index === 0 ? "" : "/", react_1.default.createElement("span", { key: label }, label)];
    const openIssueListModal = () => {
        setIsIssueListActive(true);
    };
    const closeIssueListModal = () => {
        setIsIssueListActive(false);
    };
    const { apoCd, usingRwy, issu, terminalUtcDate, apoTimeLcl } = common.headerInfo;
    const ldRwys = usingRwy ? usingRwy.filter((data) => data.rwyToLdCat === "LD" && !!data.rwyNo).slice(0, 2) : [];
    const toRwys = usingRwy ? usingRwy.filter((data) => data.rwyToLdCat === "TO" && !!data.rwyNo).slice(0, 2) : [];
    const hasAirport = !!jobAuth.user.myApoCd;
    const dayjsTimeLcl = apoTimeLcl ? (0, dayjs_1.default)(apoTimeLcl) : null;
    return (react_1.default.createElement(Wrapper, { hasAirport: hasAirport },
        react_1.default.createElement(Left, null,
            react_1.default.createElement(Airport, null, apoCd),
            react_1.default.createElement(RWY, null,
                hasAirport && (react_1.default.createElement("div", null,
                    react_1.default.createElement(RwyArrIcon, null),
                    ldRwys.map((ldRwy, index) => renderRunway(index, ldRwy.rwyNo)))),
                hasAirport && (react_1.default.createElement("div", null,
                    react_1.default.createElement(RwyDepIcon, null),
                    toRwys.map((toRwy, index) => renderRunway(index, toRwy.rwyNo))))),
            hasAirport && (react_1.default.createElement(MovableAirportIcons_1.default, { onClick: openIssueListModal, issus: issu, terminalUtcDate: common.headerInfo.terminalUtcDate, numberOfDisplay: 3 }))),
        react_1.default.createElement(UpdatedTime, { hasAirport: hasAirport },
            react_1.default.createElement("div", null, dayjsTimeLcl && dayjsTimeLcl.format("MM/DD")),
            react_1.default.createElement("div", null, dayjsTimeLcl && `${dayjsTimeLcl.format("HH:mm")}${hasAirport ? " L" : ""}`)),
        react_1.default.createElement(ModalWithAnimation, { isOpen: isIssueListActive, style: customStyles, onRequestClose: closeIssueListModal },
            react_1.default.createElement(AirportIssueList_1.default, { issus: issu, apoCd: apoCd, terminalUtcDate: terminalUtcDate }))));
};
const customStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 990000000 /* reapop(999999999)の下、フッターの上 */,
    },
    content: {
        padding: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "transparent",
        border: "none",
        pointerEvents: "none",
    },
};
// モバイルの場合は、ステータスバーの分だけヘッダーを厚くする
const Wrapper = styled_components_1.default.div `
  padding: ${({ hasAirport }) => (hasAirport ? "18px" : "22px")} 10px 0px 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ hasAirport, theme: { layout, color } }) => `
      color: ${color.PRIMARY_BASE};
      background: ${color.HEADER_GRADIENT};
      min-height: ${hasAirport ? layout.header.mobile : layout.header.moblieSlim};
  `};
`;
const Left = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const Airport = styled_components_1.default.div `
  width: 70px;
  font-size: 24px;
  line-height: 25px;
  text-align: center;
`;
const RWY = styled_components_1.default.div `
  width: 100px;
`;
const ModalWithAnimation = (0, styled_components_1.default)(react_modal_1.default) `
  opacity: 0;
  position: absolute;
  top: -100px;
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &.ReactModal__Content--after-open {
    opacity: 1;
    top: 0;
    transition: all 300ms;
  }

  &.ReactModal__Content--before-close {
    opacity: 0;
    transition: opacity 300ms;
  }
`;
const RwyArrIcon = styled_components_1.default.img.attrs({ src: icon_rwy_arr_svg_1.default }) `
  width: 15px;
  height: 17px;
  vertical-align: bottom;
`;
const RwyDepIcon = styled_components_1.default.img.attrs({ src: icon_rwy_dep_svg_1.default }) `
  position: relative;
  right: -2px;
  width: 15px;
  height: 17px;
  vertical-align: bottom;
`;
const UpdatedTime = styled_components_1.default.div `
  display: flex;
  flex-direction: ${({ hasAirport }) => (hasAirport ? "column" : "row")};
  align-items: flex-end;
  font-size: 14px;
  color: #fff;
  > div {
    margin-left: ${({ hasAirport }) => (hasAirport ? "0" : "6px")};
  }
`;
exports.default = SPCommonHeader;
//# sourceMappingURL=SPCommonHeader.js.map