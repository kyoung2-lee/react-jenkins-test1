"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Header_1 = __importDefault(require("./Header"));
const IssueSecurity_1 = __importDefault(require("../organisms/IssueSecurity"));
const IssueSecurity = () => {
    document.title = "Airport Issue";
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Header_1.default, null),
        react_1.default.createElement(IssueSecurity_1.default, null)));
};
exports.default = IssueSecurity;
//# sourceMappingURL=IssueSecurity.js.map