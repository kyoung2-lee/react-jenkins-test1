"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ScreenMask_1 = __importDefault(require("../organisms/ScreenMask"));
const Loading_1 = __importDefault(require("../organisms/Loading"));
const CognitoAuth_1 = __importDefault(require("../organisms/CognitoAuth"));
const CognitoAuth = () => (react_1.default.createElement(Wrapper, null,
    react_1.default.createElement(CognitoAuth_1.default, null),
    react_1.default.createElement(ScreenMask_1.default, null),
    react_1.default.createElement(Loading_1.default, null)));
const Wrapper = styled_components_1.default.div `
  background: #fff;
`;
exports.default = CognitoAuth;
//# sourceMappingURL=CognitoAuth.js.map