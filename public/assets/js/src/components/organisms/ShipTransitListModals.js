"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_draggable_1 = __importDefault(require("react-draggable"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const shipTransitListModals_1 = require("../../reducers/shipTransitListModals");
const ShipTransitListModals = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const shipTransitListModals = (0, hooks_1.useAppSelector)((state) => state.shipTransitListModals);
    const closeModal = (shipTransitListModal, e) => {
        e.stopPropagation();
        dispatch((0, shipTransitListModals_1.closeShipTransitListModal)(shipTransitListModal));
    };
    const handleActiveModal = (shipTransitListModal) => {
        dispatch((0, shipTransitListModals_1.focusShipTransitListModal)(shipTransitListModal));
    };
    return (react_1.default.createElement(Wrapper, null, shipTransitListModals.modals.map((shipTransitListModal) => (react_1.default.createElement(react_modal_1.default, { isOpen: true, style: customStyles(shipTransitListModal.focusedAt.getTime() % 1000000000), shouldCloseOnOverlayClick: false, shouldCloseOnEsc: false, key: `${shipTransitListModal.alCd}${shipTransitListModal.fltNo}` },
        react_1.default.createElement("div", null,
            react_1.default.createElement(react_draggable_1.default, null,
                react_1.default.createElement(ShipTransitList, { onClick: () => handleActiveModal(shipTransitListModal) },
                    react_1.default.createElement(Header, null,
                        react_1.default.createElement("div", null,
                            "SHIP\u4E57\u7D99\u60C5\u5831\u30EA\u30B9\u30C8 ",
                            shipTransitListModal.alCd,
                            shipTransitListModal.fltNo),
                        react_1.default.createElement("button", { onClick: (e) => closeModal(shipTransitListModal, e) }, "x")),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(TransitListTable, null,
                            react_1.default.createElement("thead", null,
                                react_1.default.createElement("tr", null,
                                    react_1.default.createElement("th", null, "Flight"),
                                    react_1.default.createElement("th", null, "Departure"),
                                    react_1.default.createElement("th", null),
                                    react_1.default.createElement("th", null, "Arrival"),
                                    react_1.default.createElement("th", null))),
                            react_1.default.createElement("tbody", null,
                                react_1.default.createElement("tr", null,
                                    react_1.default.createElement("td", null,
                                        react_1.default.createElement("div", null, "JL277"),
                                        react_1.default.createElement("div", null, "B/I")),
                                    react_1.default.createElement("td", null, "HND"),
                                    react_1.default.createElement("td", null,
                                        react_1.default.createElement("div", null, "0740"),
                                        react_1.default.createElement("div", null, "0753")),
                                    react_1.default.createElement("td", null, "IZO"),
                                    react_1.default.createElement("td", null,
                                        react_1.default.createElement("div", null, "0905"),
                                        react_1.default.createElement("div", null, "0900"))),
                                react_1.default.createElement("tr", null,
                                    react_1.default.createElement("td", null,
                                        react_1.default.createElement("div", null, "JL277"),
                                        react_1.default.createElement("div", null, "B/I")),
                                    react_1.default.createElement("td", null, "HND"),
                                    react_1.default.createElement("td", null,
                                        react_1.default.createElement("div", null, "0740"),
                                        react_1.default.createElement("div", null, "0753")),
                                    react_1.default.createElement("td", null, "IZO"),
                                    react_1.default.createElement("td", null,
                                        react_1.default.createElement("div", null, "0905"),
                                        react_1.default.createElement("div", null, "0900"))))))))))))));
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "transparent",
        border: "none",
        pointerEvents: "none",
    },
});
const Wrapper = styled_components_1.default.div ``;
const ShipTransitList = styled_components_1.default.div `
  width: 500px;
  height: 500px;
  pointer-events: all;
  background: #fff;
  border: 1px solid;
`;
const Header = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  background: #ccc;
`;
const TransitListTable = styled_components_1.default.table `
  width: 100%;
  border-collapse: collapse;

  th {
    font-size: 12px;
  }
  tbody {
    vertical-align: top;
    tr {
      background: #eee;
      border: 1px solid #ccc;
      td {
        padding-right: 20px;
      }
    }
  }
`;
exports.default = ShipTransitListModals;
//# sourceMappingURL=ShipTransitListModals.js.map