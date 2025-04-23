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
const dayjs_1 = __importDefault(require("dayjs"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const DraggableModal_1 = __importDefault(require("./DraggableModal"));
const FlightList_1 = __importDefault(require("./FlightList"));
const FlightListModal = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const flightListContentRef = (0, react_1.useRef)(null);
    const [selectedFlightIdentifier, setSelectedFlightIdentifier] = (0, react_1.useState)("");
    const handleFlightDetail = (eLeg) => {
        const flightKey = {
            myApoCd: props.flightListModal.flightListKeys.selectedApoCd,
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
        void dispatch(props.openFlightModal({ flightKey, posRight, tabName }));
        void dispatch(props.fetchFlightDetail({ flightKey }));
        setSelectedFlightIdentifier(eLeg.alCd + eLeg.fltNo);
    };
    const getFlightList = () => {
        const { flightListModal } = props;
        focusToFlightList();
        void dispatch(props.getFlightList(flightListModal.flightListKeys));
    };
    const focusToFlightList = () => {
        const { handleActiveModal, flightListModal } = props;
        if (flightListContentRef.current) {
            flightListContentRef.current.focus();
        }
        handleActiveModal(flightListModal);
    };
    const { common, jobAuth, flightListModal, flightList, closeModal, isFetching, posRight } = props;
    return (react_1.default.createElement(DraggableModal_1.default, { isOpen: flightListModal.opened, posRight: posRight, style: customStyles((800000000 + Math.round((flightListModal.focusedAt.getTime() - common.initDate.getTime()) / 100)) % 900000000), shouldCloseOnOverlayClick: false, shouldCloseOnEsc: false, key: `${flightListModal.key}`, title: `${flightListModal.flightListKeys.ship}/${(0, dayjs_1.default)(flightListModal.flightListKeys.date).format("DDMMM").toUpperCase()}`, onFocus: focusToFlightList, onReload: getFlightList, onClose: (e) => closeModal(flightListModal, e), isFetching: isFetching },
        react_1.default.createElement(ScrollArea, null, flightList && (react_1.default.createElement(FlightList_1.default, { scrollContentRef: flightListContentRef, scrollContentOnClick: focusToFlightList, eLegList: flightList.eLegList, onFlightDetail: handleFlightDetail, selectedFlightIdentifier: selectedFlightIdentifier, flightDetailEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth), isModalComponent: true })))));
};
react_modal_1.default.setAppElement("#content");
const customStyles = (timestamp9digit) => ({
    overlay: {
        background: "transparent",
        pointerEvents: "none",
        zIndex: timestamp9digit,
    },
    content: {
        width: "100%",
        height: "100%",
        left: 0,
        right: 0,
        bottom: 0,
        background: "transparent",
        border: "none",
        pointerEvents: "none",
        padding: 0,
    },
});
const ScrollArea = styled_components_1.default.div `
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
  height: 100%;
  margin-top: 2px;
`;
exports.default = FlightListModal;
//# sourceMappingURL=FlightListModal.js.map