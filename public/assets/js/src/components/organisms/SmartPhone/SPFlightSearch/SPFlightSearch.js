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
const react_1 = __importDefault(require("react"));
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../../store/hooks");
const FlightSearchForm_1 = __importDefault(require("../../../molecules/FlightSearchForm"));
const dateTimeInputPopup_1 = require("../../../../reducers/dateTimeInputPopup");
const commonActions = __importStar(require("../../../../reducers/common"));
const flightModals_1 = require("../../../../reducers/flightModals");
const flightContentsFlightDetail_1 = require("../../../../reducers/flightContentsFlightDetail");
const flightContentsStationOperationTask_1 = require("../../../../reducers/flightContentsStationOperationTask");
const flightNumberInputPopup_1 = require("../../../../reducers/flightNumberInputPopup");
const flightSearchActions = __importStar(require("../../../../reducers/flightSearch"));
// import ExternalUrlPopup from "../../../molecules/ExternalUrlPopup";
const flightContents_1 = require("../../../../reducers/flightContents");
const flightMovementModal_1 = require("../../../../reducers/flightMovementModal");
const mvtMsgModal_1 = require("../../../../reducers/mvtMsgModal");
const SPFlightSearch = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const master = (0, hooks_1.useAppSelector)((state) => state.account.master);
    const flightSearch = (0, hooks_1.useAppSelector)((state) => state.flightSearch);
    const formSyncErrors = (0, hooks_1.useAppSelector)((state) => (0, redux_form_1.getFormSyncErrors)("flightSearch")(state));
    // const [announceToPaxUrl, setAnnounceToPaxUrl] = useState("");
    // const [isAnnounceToPaxOpen, setIsAnnounceToPaxOpen] = useState(false);
    // const openAnnounceToPax = (url: string) => {
    //   setAnnounceToPaxUrl(url);
    //   setIsAnnounceToPaxOpen(true);
    // };
    // const closeAnnounceToPax = () => {
    //   setIsAnnounceToPaxOpen(false);
    // };
    const handleFlightDetail = (eLeg) => {
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
        const posRight = false;
        const tabName = "Detail";
        // 便詳細モーダルを開くときに、便一覧のstoreにselectedFlightNoを書き込む
        dispatch(flightSearchActions.openFlightDetail({ selectedFlightIdentifier: (0, flightContents_1.getIdentifier)(flightKey) }));
        void dispatch((0, flightModals_1.openFlightModal)({ flightKey, posRight, tabName }));
        void dispatch((0, flightContentsFlightDetail_1.fetchFlightDetail)({ flightKey }));
    };
    const handleStationOperationTask = (eLeg) => {
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
        const posRight = false;
        const tabName = "Task";
        dispatch(flightSearchActions.openFlightDetail({ selectedFlightIdentifier: (0, flightContents_1.getIdentifier)(flightKey) }));
        void dispatch((0, flightModals_1.openFlightModal)({ flightKey, posRight, tabName }));
        void dispatch((0, flightContentsStationOperationTask_1.fetchStationOperationTask)({ flightKey }));
    };
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(FlightSearchForm_1.default, { jobAuth: jobAuth, master: master, flightSearch: flightSearch, searchFlight: flightSearchActions.searchFlight, openDateTimeInputPopup: dateTimeInputPopup_1.openDateTimeInputPopup, openFlightNumberInputPopup: flightNumberInputPopup_1.openFlightNumberInputPopup, getHeaderInfo: commonActions.getHeaderInfo, formSyncErrors: formSyncErrors, handleFlightDetail: handleFlightDetail, common: common, showNotificationAirportRmksNoChange: commonActions.showNotificationAirportRmksNoChange, updateAirportRemarks: commonActions.updateAirportRemarks, handleStationOperationTask: handleStationOperationTask, showConfirmation: flightSearchActions.showConfirmation, openOalFlightMovementModal: flightMovementModal_1.openFlightMovementModal, openMvtMsgModal: mvtMsgModal_1.openMvtMsgModal })));
};
const Wrapper = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  background: #fff;
`;
exports.default = SPFlightSearch;
//# sourceMappingURL=SPFlightSearch.js.map