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
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const react_scrollbar_size_1 = __importDefault(require("react-scrollbar-size"));
const hooks_1 = require("../../store/hooks");
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const commonActions = __importStar(require("../../reducers/common"));
const fis_1 = require("../../reducers/fis");
const UpdateRmksPopup_1 = __importDefault(require("../molecules/UpdateRmksPopup"));
const Toggle_1 = __importDefault(require("../atoms/Toggle"));
const RoundButtonReload_1 = __importDefault(require("../atoms/RoundButtonReload"));
const mySchedule_1 = require("../../reducers/mySchedule");
const CommonSubHeader = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const { pathname } = (0, react_router_dom_1.useLocation)();
    const refAptRmks = (0, react_1.useRef)(null);
    const scrollbarWidth = (0, react_scrollbar_size_1.default)().width;
    const fis = (0, hooks_1.useAppSelector)((state) => state.fis);
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const { isAutoReload } = fis.headerSettings;
    const [rmksPopupIsOpen, setRmksPopupIsOpen] = (0, react_1.useState)(false);
    const [rmksPopupWidth, setRmksPopupWidth] = (0, react_1.useState)(0);
    const [rmksPopupHeight, setRmksPopupHeight] = (0, react_1.useState)(0);
    const [rmksPopupTop, setRmksPopupTop] = (0, react_1.useState)(0);
    const [rmksPopupLeft, setRmksPopupLeft] = (0, react_1.useState)(0);
    const isSelectApoMode = pathname === commonConst_1.Const.PATH_NAME.fis || pathname === commonConst_1.Const.PATH_NAME.barChart;
    const isFixedApoMode2 = pathname === commonConst_1.Const.PATH_NAME.mySchedule;
    const isRmksEnabled = () => !!jobAuth.user.myApoCd &&
        jobAuth.user.myApoCd === common.headerInfo.apoCd &&
        (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateAireportRemarks, jobAuth.jobAuth);
    const handleReload = () => {
        const { apoCd, targetDate, isToday } = common.headerInfo;
        if (isSelectApoMode) {
            if (!isAutoReload) {
                void dispatch((0, fis_1.getFisHeaderInfo)({
                    apoCd,
                    targetDate,
                    isToday,
                    beforeApoCd: apoCd,
                    beforeTargetDate: targetDate,
                    isReload: true,
                }));
            }
            // // PUSHテスト用
            // const { getFisRowsFromPush, fis } = this.props;
            // getFisRowsFromPush(fis._getCount);
        }
        else if (pathname === commonConst_1.Const.PATH_NAME.mySchedule) {
            void dispatch((0, mySchedule_1.getMyScheduleInfo)());
        }
    };
    const handleOpenRmksPopup = async () => {
        const { apoCd } = common.headerInfo;
        const openRmksPopup = () => {
            if (refAptRmks.current) {
                setRmksPopupIsOpen(true);
                setRmksPopupWidth(refAptRmks.current.clientWidth);
                setRmksPopupHeight(refAptRmks.current.clientHeight);
                setRmksPopupTop(refAptRmks.current.getBoundingClientRect().top);
                setRmksPopupLeft(refAptRmks.current.getBoundingClientRect().left);
            }
        };
        const closeRmksPopup = () => {
            setRmksPopupIsOpen(false);
        };
        await dispatch(commonActions.getHeaderInfo({ apoCd, openRmksPopup, closeRmksPopup }));
    };
    const handlCloseRmksPopup = (rmksText) => {
        if (common.headerInfo.apoRmksInfo === rmksText) {
            setRmksPopupIsOpen(false);
        }
        else {
            void dispatch(commonActions.showConfirmation({ onClickYes: () => setRmksPopupIsOpen(false) }));
        }
    };
    const handleUpdateRmks = (text) => {
        if (text === common.headerInfo.apoRmksInfo) {
            void dispatch(commonActions.showNotificationAirportRmksNoChange());
        }
        else {
            void dispatch(commonActions.updateAirportRemarks({
                apoCd: jobAuth.user.myApoCd,
                apoRmksInfo: text,
                closeAirportRemarksPopup: () => setRmksPopupIsOpen(false),
            }));
        }
    };
    const { isDarkMode } = props;
    const { apoRmksInfo, apoTimeLcl, apoTimeDiffUtc } = common.headerInfo;
    const { timeLcl, timeDiffUtc, apoCd } = fis;
    const hTimeLcl = apoTimeLcl < timeLcl ? timeLcl : apoTimeLcl;
    const hTimeDiffUtc = apoTimeLcl < timeLcl ? timeDiffUtc : apoTimeDiffUtc;
    const parsedTimeLcl = (0, commonUtil_1.parseTimeLcl)({ timeLcl: hTimeLcl, timeDiffUtc: hTimeDiffUtc, isLocal: !!apoCd });
    const hasAirport = !!apoCd;
    const hasHeaderAirport = !!common.headerInfo.apoCd;
    return (react_1.default.createElement(Wrapper, { scrollbarSize: scrollbarWidth },
        react_1.default.createElement(MainContent, { isBarChart: pathname === commonConst_1.Const.PATH_NAME.barChart },
            react_1.default.createElement(Left, null, isFixedApoMode2 ? (hasHeaderAirport && (react_1.default.createElement(AptRmksContainer, { ref: refAptRmks, onClick: () => {
                    void handleOpenRmksPopup();
                }, isEmpty: !apoRmksInfo },
                react_1.default.createElement("div", null, apoRmksInfo || "Airport Remarks")))) : (react_1.default.createElement(AptRmksContainer, { ref: refAptRmks, onClick: () => {
                    void handleOpenRmksPopup();
                }, isEmpty: !apoRmksInfo },
                react_1.default.createElement("div", null, apoRmksInfo || "Airport Remarks")))),
            react_1.default.createElement(Right, null,
                (0, commonUtil_1.funcAuthCheck)(pathname === commonConst_1.Const.PATH_NAME.fis ? commonConst_1.Const.FUNC_ID.updateFisAuto : commonConst_1.Const.FUNC_ID.updateBarChartAuto, jobAuth.jobAuth) && (react_1.default.createElement(ToggleSwitch, { isPc: storage_1.storage.isPc },
                    react_1.default.createElement("span", null, "Auto"),
                    react_1.default.createElement(Toggle_1.default, { tabIndex: -1, isDarkMode: isDarkMode, checked: isAutoReload, onChange: (checked) => {
                            if (checked) {
                                void dispatch((0, fis_1.getFisHeaderInfoAuto)({ apoCd: common.headerInfo.apoCd, isAddingAuto: true }));
                            }
                            else {
                                void dispatch((0, fis_1.mqttDisconnect)());
                            }
                        } }))),
                !isFixedApoMode2 ? (hasAirport && (react_1.default.createElement(UpdatedTime, { isPc: storage_1.storage.isPc },
                    react_1.default.createElement("span", null, apoCd),
                    react_1.default.createElement("span", null, parsedTimeLcl.date),
                    react_1.default.createElement("span", null, parsedTimeLcl.time)))) : (react_1.default.createElement(react_1.default.Fragment, null, hasHeaderAirport && (react_1.default.createElement(UpdatedTime, { isPc: storage_1.storage.isPc },
                    react_1.default.createElement("span", null, parsedTimeLcl.date),
                    react_1.default.createElement("span", null, parsedTimeLcl.time))))),
                react_1.default.createElement(ModalReloadButtonContainer, { isPc: storage_1.storage.isPc },
                    react_1.default.createElement(RoundButtonReload_1.default, { tabIndex: 10, isFetching: false, disabled: isAutoReload, onClick: handleReload }))),
            react_1.default.createElement(UpdateRmksPopup_1.default, { isOpen: rmksPopupIsOpen, width: rmksPopupWidth, height: rmksPopupHeight, top: rmksPopupTop, left: rmksPopupLeft, initialRmksText: apoRmksInfo, isSubmitable: isRmksEnabled(), placeholder: "Airport Remarks", onClose: handlCloseRmksPopup, update: handleUpdateRmks }))));
};
const Wrapper = styled_components_1.default.div `
  position: relative;
  min-height: 47px;
  padding: 0 0 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.color.HEADER_GRADIENT};
  font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
  z-index: 10; /* 下部コンポーネントの影をかぶらないように上位にする */
`;
const MainContent = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: ${commonConst_1.Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
  padding-bottom: ${({ isBarChart }) => (isBarChart ? "6px" : "10px")};
`;
const Left = styled_components_1.default.div `
  width: 100%;
  display: flex;
`;
const Right = styled_components_1.default.div `
  display: flex;
  align-items: center;
  position: absolute;
  right: 15px;
`;
const AptRmksContainer = styled_components_1.default.div `
  width: 100%;
  max-width: 706px;
  height: 47px;
  margin-left: 1px;
  padding: 3px 7px 3px;
  line-height: 1.4;
  border-radius: 1px;
  border: none;
  color: ${(props) => (props.isEmpty ? props.theme.color.PLACEHOLDER : props.theme.color.DEFAULT_FONT_COLOR)};
  background: ${({ theme }) => theme.color.remarks.background};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-align: start;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
  align-items: flex-start;
  box-shadow: ${({ theme }) => theme.color.remarks.shadow};
  cursor: pointer;
`;
const ToggleSwitch = styled_components_1.default.div `
  margin-top: 3px;
  margin-right: ${({ isPc }) => (isPc ? "16px" : "10px")};
  display: flex;
  align-items: center;

  span {
    margin-right: 4px;
    font-size: 14px;
    color: ${(props) => props.theme.color.PRIMARY_BASE};
  }
`;
const UpdatedTime = styled_components_1.default.div `
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  font-size: ${({ isPc }) => (isPc ? "12px" : "14px")};
  color: ${(props) => props.theme.color.PRIMARY_BASE};
`;
const ModalReloadButtonContainer = styled_components_1.default.div `
  > button {
    width: ${({ isPc }) => (isPc ? 36 : 45)}px;
    height: ${({ isPc }) => (isPc ? 36 : 45)}px;
    border-radius: 23px;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;
exports.default = CommonSubHeader;
//# sourceMappingURL=CommonSubHeader.js.map