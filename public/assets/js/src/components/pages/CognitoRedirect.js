"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Loading_1 = __importDefault(require("../organisms/Loading"));
const CognitoRedirect_1 = __importDefault(require("../organisms/CognitoRedirect"));
const ScreenMask_1 = __importDefault(require("../organisms/ScreenMask"));
const CognitoRedirect = () => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(CognitoRedirect_1.default, null),
    react_1.default.createElement(ScreenMask_1.default, null),
    react_1.default.createElement(Loading_1.default, null)));
exports.default = CognitoRedirect;
//# sourceMappingURL=CognitoRedirect.js.map