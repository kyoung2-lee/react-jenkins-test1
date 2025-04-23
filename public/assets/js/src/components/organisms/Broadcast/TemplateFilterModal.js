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
const issueSecurityValidates = __importStar(require("../../../lib/validators/issueSecurityValidator"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const SecondaryButton_1 = __importDefault(require("../../atoms/SecondaryButton"));
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
// eslint-disable-next-line import/no-cycle
const Broadcast_1 = require("./Broadcast");
const TemplateFilterModal = (props) => (react_1.default.createElement(react_modal_1.default, { isOpen: props.isOpen, style: style, onRequestClose: props.onRequestClose },
    react_1.default.createElement(Broadcast_1.Row, { width: 360 },
        react_1.default.createElement(TemplateFilterConditions, null,
            react_1.default.createElement(SearchModalLabel, null, "Keyword"),
            react_1.default.createElement(Broadcast_1.Flex, { position: "center" },
                react_1.default.createElement(SearchModalFieldContainer, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "keyword", autoCapitalize: "off", component: TextInput_1.default, width: 320, maxLength: 100, onKeyPress: props.onKeywordKeyPress, autoFocus: true, isShadowOnFocus: true }))),
            react_1.default.createElement(SearchModalLabel, null, "Send by"),
            react_1.default.createElement(Broadcast_1.Flex, null,
                react_1.default.createElement(SearchModalFieldContainer, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "sendBy", component: SelectBox_1.default, options: Broadcast_1.TEMPLATE_FILTER_SEND_BY, width: 140, validate: [issueSecurityValidates.duplicationEmailAddrGrp], hasBlank: true, isShadowOnFocus: true, componentOnKeyDown: props.onKeywordKeyPress })))),
        react_1.default.createElement(Broadcast_1.ModalButtonGroup, { margin: "25px auto" },
            react_1.default.createElement(SecondaryButton_1.default, { text: "Clear", type: "button", onClick: props.onClickClear }),
            react_1.default.createElement(PrimaryButton_1.default, { text: "Filter", type: "button", onClick: props.onClickFilter })))));
const style = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        width: "360px",
        left: "calc(50% - 200px)",
        padding: 0,
        height: "304px",
        top: "calc(100vh/2 - 250px)",
        border: "none",
        overflow: "visible",
    },
};
const TemplateFilterConditions = styled_components_1.default.div `
  height: 200px;
  overflow: visible;
`;
const SearchModalLabel = styled_components_1.default.div `
  background: #119ac2;
  color: white;
  padding: 4px 20px;
  font-size: 12px;
`;
const SearchModalFieldContainer = styled_components_1.default.div `
  padding: 20px;
`;
exports.default = TemplateFilterModal;
//# sourceMappingURL=TemplateFilterModal.js.map