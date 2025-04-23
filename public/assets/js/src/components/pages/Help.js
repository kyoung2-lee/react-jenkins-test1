"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Header_1 = __importDefault(require("./Header"));
const WebPage_1 = __importDefault(require("../organisms/WebPage"));
const config_1 = require("../../../config/config");
const Help = () => {
    document.title = "Help";
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Header_1.default, null),
        react_1.default.createElement(WebPage_1.default, { url: config_1.ServerConfig.HELP_URL })));
};
exports.default = Help;
//# sourceMappingURL=Help.js.map