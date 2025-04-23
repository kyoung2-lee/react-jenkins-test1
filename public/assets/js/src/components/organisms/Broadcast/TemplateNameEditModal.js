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
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const validates = __importStar(require("../../../lib/validators"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
// eslint-disable-next-line import/no-cycle
const Broadcast_1 = require("./Broadcast");
const TemplateNameEditModal = (props) => (react_1.default.createElement(react_modal_1.default, { isOpen: props.isOpen, style: style, onRequestClose: props.onRequestClose },
    react_1.default.createElement(ModalBody, null,
        react_1.default.createElement(Broadcast_1.Row, null,
            react_1.default.createElement(ModalHeader, null, "Template Name"),
            react_1.default.createElement(redux_form_1.Field, { name: "templateName", autoCapitalize: "off", autoFocus: true, component: TextInput_1.default, width: "100%", maxLength: 50, validate: [validates.required], onKeyPress: props.onTemplateNameKeyPress }),
            react_1.default.createElement(Broadcast_1.ModalButtonGroup, null,
                react_1.default.createElement(PrimaryButton_1.default, { text: "Save", type: "button", onClick: props.onClickSave }))))));
const style = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        width: "500px",
        left: "calc(50% - 250px)",
        padding: 0,
        height: "220px",
        top: "calc(100vh/2 - 150px)",
        overflow: "hidden",
    },
};
const ModalBody = styled_components_1.default.div `
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ModalHeader = styled_components_1.default.div `
  margin: 15px 0;
`;
exports.default = TemplateNameEditModal;
//# sourceMappingURL=TemplateNameEditModal.js.map