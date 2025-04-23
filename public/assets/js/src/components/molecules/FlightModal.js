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
const notifications_1 = require("../../lib/notifications");
const soalaMessages_1 = require("../../lib/soalaMessages");
const DraggableModal_1 = __importDefault(require("./DraggableModal"));
const FlightModalHeader_1 = __importDefault(require("./FlightModalHeader"));
const FlightContents_1 = __importDefault(require("./FlightContents"));
//
// FISで表示していたモーダルをまとめてタブで表示するComponentです。
// Componentを疎結合にするため、Headerの更新はタブコンテンツとなるComponentのpropsに関数を渡して、
// Headerの更新に必要なデータを受け取り、描画するようにしています。
//
const FlightModal = (props) => {
    const { dispatch } = props;
    const scrollContentRef = (0, react_1.useRef)(null);
    const [isBbEditing, setIsBbEditing] = (0, react_1.useState)(false);
    const handleFocus = () => {
        const { flightModalsActions, modal, content, saveScroll } = props;
        if (scrollContentRef.current) {
            scrollContentRef.current.focus();
            if (content) {
                dispatch(saveScroll({ identifier: content.identifier, scrollTop: scrollContentRef.current.scrollTop }));
            }
        }
        dispatch(flightModalsActions.focusFlightModalAction({ identifier: modal.key }));
    };
    const handleClose = (flightModal, e) => {
        // this.setState({ currentIndex: undefined });
        props.closeModal(flightModal, e);
    };
    const getHeader = () => {
        const { content } = props;
        if (!content || !content.flightHeader) {
            return react_1.default.createElement("div", null);
        }
        const isDetail = content.currentTabName === "Detail";
        const { isUtc } = content;
        const { flightHeader } = content;
        return react_1.default.createElement(FlightModalHeader_1.default, { isDetail: isDetail, isUtc: isUtc, flightHeader: flightHeader });
    };
    const handleClickClose = (e) => {
        if (e) {
            e.stopPropagation();
        }
        const onClose = () => {
            setIsBbEditing(false);
            handleClose(props.modal, e);
        };
        if (isBbEditing) {
            notifications_1.NotificationCreator.create({
                dispatch,
                message: soalaMessages_1.SoalaMessage.M40012C({ onYesButton: onClose }),
            });
        }
        else {
            onClose();
        }
    };
    const { common, jobAuth, master, modal, content, saveScroll, selectTab, toggleUtcMode, openDateTimeInputPopup, flightModalsActions, flightDetailActions, stationOperationTaskActions, flightChangeHistoryActions, flightSpecialCareActions, flightPaxFromListActions, flightPaxToListActions, flightBulletinBoardActions, bulletinBoardResponseEditorModalActions, handleCloseAll, } = props;
    return (react_1.default.createElement(DraggableModal_1.default, { isOpen: modal.opened, style: customStyles((800000000 + Math.round((modal.focusedAt.getTime() - common.initDate.getTime()) / 100)) % 900000000), shouldCloseOnOverlayClick: false, shouldCloseOnEsc: false, posRight: modal.posRight, key: `${modal.key}`, header: getHeader(), onFocus: handleFocus, 
        // onReload={}
        onClose: handleClickClose, isFetching: content ? content.isFetching : false }, content ? (react_1.default.createElement(FlightContents_1.default, { scrollContentRef: scrollContentRef, common: common, jobAuth: jobAuth, master: master, content: content, saveScroll: saveScroll, selectTab: selectTab, toggleUtcMode: toggleUtcMode, openDateTimeInputPopup: openDateTimeInputPopup, flightModalsActions: flightModalsActions, flightDetailActions: flightDetailActions, stationOperationTaskActions: stationOperationTaskActions, flightChangeHistoryActions: flightChangeHistoryActions, flightSpecialCareActions: flightSpecialCareActions, flightPaxFromListActions: flightPaxFromListActions, flightPaxToListActions: flightPaxToListActions, flightBulletinBoardActions: flightBulletinBoardActions, bulletinBoardResponseEditorModalActions: bulletinBoardResponseEditorModalActions, dispatch: dispatch, handleCloseModal: () => handleClose(modal), setBbEditing: setIsBbEditing, isBbEditing: isBbEditing, handleCloseAll: handleCloseAll })) : (react_1.default.createElement("div", null))));
};
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
exports.default = FlightModal;
//# sourceMappingURL=FlightModal.js.map