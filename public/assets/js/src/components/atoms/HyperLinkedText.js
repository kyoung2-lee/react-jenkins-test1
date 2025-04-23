"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_string_replace_1 = __importDefault(require("react-string-replace"));
const storage_1 = require("../../lib/storage");
const HyperLinkedText = (props) => {
    const regUrl = /((?:ftp|http)[s]*:\/\/[^.]+\.[^ \n]+)/g;
    return (react_1.default.createElement(react_1.default.Fragment, null, storage_1.storage.isPc
        ? (0, react_string_replace_1.default)([props.children], regUrl, (match, i) => (react_1.default.createElement("a", { key: i, href: match, target: "_blank", rel: "noopener noreferrer" }, match)))
        : (0, react_string_replace_1.default)([props.children], regUrl, (match, i) => (react_1.default.createElement("a", { key: i, href: `app:${match}`, target: "_blank", rel: "noopener noreferrer" }, match)))));
};
exports.default = HyperLinkedText;
//# sourceMappingURL=HyperLinkedText.js.map