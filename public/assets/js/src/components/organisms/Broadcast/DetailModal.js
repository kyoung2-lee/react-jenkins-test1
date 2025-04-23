"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const CloseButton_1 = __importDefault(require("../../atoms/CloseButton"));
const DetailModal = (props) => {
    const { isOpen, style, onRequestClose, header, data, DetailComponent } = props;
    return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, style: style, onRequestClose: onRequestClose },
        react_1.default.createElement(ModalHeader, null,
            react_1.default.createElement("div", null, header),
            react_1.default.createElement(CloseButton_1.default, { onClick: onRequestClose })),
        react_1.default.createElement(AddressDetailContainer, null, data.map((row) => (react_1.default.createElement(DetailComponent, { key: row, row: row }))))));
};
const ModalHeader = styled_components_1.default.div `
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    font-size: 12px;
  }
`;
const AddressDetailContainer = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 0 22px;
  margin: 0 -11px;
  max-height: calc(100vh - 140px);
  overflow-y: scroll;
`;
exports.default = DetailModal;
//# sourceMappingURL=DetailModal.js.map