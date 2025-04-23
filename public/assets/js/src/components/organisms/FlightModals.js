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
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
// import ExternalUrlPopup from "../../molecules/ExternalUrlPopup";
const FlightModal_1 = __importDefault(require("../molecules/FlightModal"));
const flightContents_1 = require("../../reducers/flightContents");
const dateTimeInputPopup_1 = require("../../reducers/dateTimeInputPopup");
const flightModalsActions = __importStar(require("../../reducers/flightModals"));
const flightPaxFromListActions = __importStar(require("../../reducers/flightContentsFlightPaxFrom"));
const flightPaxToListActions = __importStar(require("../../reducers/flightContentsFlightPaxTo"));
const stationOperationTaskActions = __importStar(require("../../reducers/flightContentsStationOperationTask"));
const flightDetailActions = __importStar(require("../../reducers/flightContentsFlightDetail"));
const flightChangeHistoryActions = __importStar(require("../../reducers/flightContentsFlightChangeHistory"));
const flightSpecialCareActions = __importStar(require("../../reducers/flightContentsFlightSpecialCare"));
const flightBulletinBoardActions = __importStar(require("../../reducers/flightContentsBulletinBoard"));
const bulletinBoardResponseEditorModalActions = __importStar(require("../../reducers/bulletinBoardResponseEditorModal"));
const FlightModals = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const master = (0, hooks_1.useAppSelector)((state) => state.account.master);
    const flightModals = (0, hooks_1.useAppSelector)((state) => state.flightModals);
    const flightContents = (0, hooks_1.useAppSelector)((state) => state.flightContents);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [announceToPaxUrl, setAnnounceToPaxUrl] = (0, react_1.useState)("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isAnnounceToPaxOpen, setIsAnnounceToPaxOpen] = (0, react_1.useState)(false);
    const closeModal = (flightModal, e) => {
        if (e) {
            e.stopPropagation();
        }
        void dispatch(flightModalsActions.closeFlightModal({ identifier: flightModal.identifier }));
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const openAnnounceToPax = (url) => {
        setAnnounceToPaxUrl(url);
        setIsAnnounceToPaxOpen(true);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const closeAnnounceToPax = () => {
        setIsAnnounceToPaxOpen(false);
    };
    const handleCloseAll = () => flightModals.modals.forEach((modal) => {
        void dispatch(flightModalsActions.closeFlightModal({ identifier: modal.identifier }));
    });
    return (react_1.default.createElement(Wrapper, null, flightModals.modals.map((modal) => {
        const content = flightContents.contents.find((c) => c.identifier === modal.identifier);
        return (react_1.default.createElement(FlightModal_1.default, { key: `${modal.key}`, common: common, jobAuth: jobAuth, master: master, modal: modal, content: content, saveScroll: flightContents_1.saveScroll, selectTab: flightContents_1.selectTab, toggleUtcMode: flightContents_1.toggleUtcMode, openDateTimeInputPopup: dateTimeInputPopup_1.openDateTimeInputPopup, flightModalsActions: flightModalsActions, flightDetailActions: flightDetailActions, stationOperationTaskActions: stationOperationTaskActions, flightChangeHistoryActions: flightChangeHistoryActions, flightSpecialCareActions: flightSpecialCareActions, flightPaxFromListActions: flightPaxFromListActions, flightPaxToListActions: flightPaxToListActions, flightBulletinBoardActions: flightBulletinBoardActions, bulletinBoardResponseEditorModalActions: bulletinBoardResponseEditorModalActions, dispatch: dispatch, closeModal: closeModal, handleCloseAll: handleCloseAll }));
    })));
};
react_modal_1.default.setAppElement("#content");
const Wrapper = styled_components_1.default.div ``;
exports.default = FlightModals;
//# sourceMappingURL=FlightModals.js.map