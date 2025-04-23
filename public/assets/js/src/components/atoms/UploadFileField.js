"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dropzone_1 = __importDefault(require("react-dropzone"));
const styled_components_1 = __importDefault(require("styled-components"));
const clip_prime_svg_1 = __importDefault(require("../../assets/images/icon/clip_prime.svg"));
const DEFAULT_TEXT = "Click & Select or Drop files here.";
const UploadFileField = (props) => {
    const { style = {}, disabled = false, onDrop, text, accept } = props;
    const styles = {
        dropZone: {
            width: "auto",
            height: "auto",
            lineHeight: "40px",
            color: "#346181",
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: "#346181",
            borderRadius: 5,
            textAlign: "center",
            padding: 5,
            cursor: disabled ? "inherit" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        active: {
            borderStyle: "solid",
            backgroundColor: "#eee",
            borderWidth: 2,
            borderRadius: 5,
        },
        reject: {
            borderStyle: "solid",
            backgroundColor: "#fdd",
            borderWidth: 2,
            borderRadius: 5,
        },
    };
    return (react_1.default.createElement(react_dropzone_1.default, { activeStyle: { ...styles.active, ...style }, rejectStyle: styles.reject, style: styles.dropZone, disabled: disabled, onDrop: onDrop, accept: accept || "" },
        react_1.default.createElement(ClipIcon, null),
        react_1.default.createElement(Text, null, text || DEFAULT_TEXT)));
};
const ClipIcon = styled_components_1.default.img.attrs({ src: clip_prime_svg_1.default }) ``;
const Text = styled_components_1.default.div `
  margin-left: 5px;
  display: inline;
`;
exports.default = UploadFileField;
//# sourceMappingURL=UploadFileField.js.map