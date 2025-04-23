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
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const flightListModalsActions = __importStar(require("../../reducers/flightListModals"));
const flightModals_1 = require("../../reducers/flightModals");
const flightContentsFlightDetail_1 = require("../../reducers/flightContentsFlightDetail");
const ErrorPopup_1 = __importDefault(require("../molecules/ErrorPopup"));
const FlightListModal_1 = __importDefault(require("../molecules/FlightListModal"));
const FlightListModals = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const flightListModals = (0, hooks_1.useAppSelector)((state) => state.flightListModals);
    // eslint-disable-next-line react/sort-comp
    const closeModal = (flightListModal, e) => {
        e.stopPropagation();
        dispatch(flightListModalsActions.closeFlightListModal(flightListModal));
    };
    const handleActiveModal = (flightListModal) => {
        dispatch(flightListModalsActions.focusFlightListModal(flightListModal));
    };
    return (react_1.default.createElement(Wrapper, null,
        flightListModals.modals.map((modal) => (react_1.default.createElement(FlightListModal_1.default, { key: `${modal.key}`, common: common, jobAuth: jobAuth, posRight: modal.posRight, flightListModal: modal, closeModal: closeModal, handleActiveModal: handleActiveModal, getFlightList: flightListModalsActions.getFlightList, flightList: modal.lists, openFlightModal: flightModals_1.openFlightModal, fetchFlightDetail: flightContentsFlightDetail_1.fetchFlightDetail, isFetching: modal.isFetching }))),
        flightListModals.retry ? (react_1.default.createElement(ErrorPopup_1.default, { dispatch: dispatch, isError: flightListModals.isError, retry: flightListModals.retry })) : undefined));
};
react_modal_1.default.setAppElement("#content");
const Wrapper = styled_components_1.default.div ``;
exports.default = FlightListModals;
//# sourceMappingURL=FlightListModals.js.map