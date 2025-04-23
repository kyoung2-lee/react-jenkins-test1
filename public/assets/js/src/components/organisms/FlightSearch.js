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
const redux_form_1 = require("redux-form");
const hooks_1 = require("../../store/hooks");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const FlightSearchForm_1 = __importDefault(require("../molecules/FlightSearchForm"));
const flightNumberInputPopup_1 = require("../../reducers/flightNumberInputPopup");
const flightMovementModal_1 = require("../../reducers/flightMovementModal");
const flightSearchActions = __importStar(require("../../reducers/flightSearch"));
const flightContents_1 = require("../../reducers/flightContents");
const dateTimeInputPopup_1 = require("../../reducers/dateTimeInputPopup");
const flightModalsActions = __importStar(require("../../reducers/flightModals"));
const flightDetailActions = __importStar(require("../../reducers/flightContentsFlightDetail"));
const stationOperationTaskActions = __importStar(require("../../reducers/flightContentsStationOperationTask"));
const flightChangeHistoryActions = __importStar(require("../../reducers/flightContentsFlightChangeHistory"));
const flightSpecialCareActions = __importStar(require("../../reducers/flightContentsFlightSpecialCare"));
const flightPaxFromListActions = __importStar(require("../../reducers/flightContentsFlightPaxFrom"));
const flightPaxToListActions = __importStar(require("../../reducers/flightContentsFlightPaxTo"));
const flightBulletinBoardActions = __importStar(require("../../reducers/flightContentsBulletinBoard"));
const bulletinBoardResponseEditorModalActions = __importStar(require("../../reducers/bulletinBoardResponseEditorModal"));
const mvtMsgModal_1 = require("../../reducers/mvtMsgModal");
const FlightModalHeader_1 = __importDefault(require("../molecules/FlightModalHeader"));
const FlightContents_1 = __importDefault(require("../molecules/FlightContents"));
const FlightSearch = () => {
    const scrollContentRef = (0, react_1.useRef)(null);
    const dispatch = (0, hooks_1.useAppDispatch)();
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const flightContents = (0, hooks_1.useAppSelector)((state) => state.flightContents);
    const flightSearch = (0, hooks_1.useAppSelector)((state) => state.flightSearch);
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const master = (0, hooks_1.useAppSelector)((state) => state.account.master);
    const formSyncErrors = (0, hooks_1.useAppSelector)((state) => (0, redux_form_1.getFormSyncErrors)("flightSearch")(state));
    const [content, setContent] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        setContent(flightContents.contents.find((c) => c.identifier === flightSearch.selectedFlightIdentifier));
    }, [flightContents.contents, flightSearch.selectedFlightIdentifier]);
    const handleFlightDetailList = (eLeg) => {
        const flightKey = {
            myApoCd: jobAuth.user.myApoCd,
            orgDateLcl: eLeg.orgDateLcl,
            alCd: eLeg.alCd,
            fltNo: eLeg.fltNo,
            casFltNo: eLeg.casFltNo,
            skdDepApoCd: eLeg.skdDepApoCd,
            skdArrApoCd: eLeg.skdArrApoCd,
            skdLegSno: eLeg.skdLegSno,
            oalTblFlg: eLeg.oalTblFlg,
        };
        const selectedFlightIdentifier = (0, flightContents_1.getIdentifier)(flightKey);
        const isReload = true;
        dispatch(flightSearchActions.openFlightDetail({ selectedFlightIdentifier }));
        dispatch((0, flightContents_1.addFlightContent)({ flightKey, tabName: "Detail", removeAll: true }));
        void dispatch(flightDetailActions.fetchFlightDetail({ flightKey, isReload }));
    };
    const getHeader = (cont) => {
        if (!cont || !cont.flightHeader) {
            return react_1.default.createElement("div", null);
        }
        const isDetail = cont.currentTabName === "Detail";
        const { isUtc } = cont;
        const { flightHeader } = cont;
        return react_1.default.createElement(FlightModalHeader_1.default, { isDetail: isDetail, isUtc: isUtc, flightHeader: flightHeader });
    };
    const flightDetailHeader = getHeader(content);
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(LeftColumn, null,
            react_1.default.createElement(FlightSearchForm_1.default, { jobAuth: jobAuth, master: master, flightSearch: flightSearch, searchFlight: flightSearchActions.searchFlight, openDateTimeInputPopup: dateTimeInputPopup_1.openDateTimeInputPopup, openFlightNumberInputPopup: flightNumberInputPopup_1.openFlightNumberInputPopup, openOalFlightMovementModal: flightMovementModal_1.openFlightMovementModal, formSyncErrors: formSyncErrors, handleFlightDetail: handleFlightDetailList, openMvtMsgModal: mvtMsgModal_1.openMvtMsgModal })),
        content ? (react_1.default.createElement(RightColumn, null,
            react_1.default.createElement(FlightHeader, null, flightDetailHeader),
            react_1.default.createElement(RightScrollArea, null,
                react_1.default.createElement(FlightContents_1.default, { scrollContentRef: scrollContentRef, common: common, jobAuth: jobAuth, master: master, content: content, saveScroll: flightContents_1.saveScroll, selectTab: flightContents_1.selectTab, toggleUtcMode: flightContents_1.toggleUtcMode, openDateTimeInputPopup: dateTimeInputPopup_1.openDateTimeInputPopup, flightModalsActions: flightModalsActions, flightDetailActions: flightDetailActions, stationOperationTaskActions: stationOperationTaskActions, flightChangeHistoryActions: flightChangeHistoryActions, flightSpecialCareActions: flightSpecialCareActions, flightPaxFromListActions: flightPaxFromListActions, flightPaxToListActions: flightPaxToListActions, flightBulletinBoardActions: flightBulletinBoardActions, bulletinBoardResponseEditorModalActions: bulletinBoardResponseEditorModalActions, dispatch: dispatch })))) : (react_1.default.createElement(DefaultColumn, null))));
};
// prettierに自動整形させた場合、改行位置の兼ね合いでエラーが出てしまうため、この場所では無効にする
// prettier-ignore
const Wrapper = styled_components_1.default.div `
  min-height: calc(100vh - ${props => (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc ? props.theme.layout.header.default : props.theme.layout.header.tablet)});
  width: 778px;
  margin: 0 auto;
  padding: 8px 8px 0 8px;
  display: flex;
  justify-content: space-between;
  background: #fff;
`;
const DefaultColumn = styled_components_1.default.div `
  width: 375px;
`;
const LeftColumn = (0, styled_components_1.default)(DefaultColumn) `
  height: calc(
    100vh -
      ${(props) => (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc ? props.theme.layout.header.default : props.theme.layout.header.tablet)} -
      8px
  );
  overflow-y: hidden;
`;
const RightColumn = (0, styled_components_1.default)(DefaultColumn) `
  height: calc(
    100vh -
      ${(props) => (storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc ? props.theme.layout.header.default : props.theme.layout.header.tablet)} -
      16px
  );
  box-shadow: -1px 1px 3px rgba(0, 0, 0, 0.3);
`;
const RightScrollArea = styled_components_1.default.div `
  height: calc(100% - 40px);
`;
const FlightHeader = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  min-height: 40px;
  height: 40px;
`;
exports.default = FlightSearch;
//# sourceMappingURL=FlightSearch.js.map