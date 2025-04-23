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
const reapop_1 = __importStar(require("reapop"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const ScreenMask_1 = __importDefault(require("../organisms/ScreenMask"));
const Loading_1 = __importDefault(require("../organisms/Loading"));
const JobAuth_1 = __importDefault(require("../organisms/JobAuth"));
const JobAuth = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const notifications = (0, hooks_1.useAppSelector)((state) => state.notifications);
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(JobAuth_1.default, null),
        react_1.default.createElement(reapop_1.default, { notifications: notifications, dismissNotification: (id) => dispatch((0, reapop_1.dismissNotification)(id)), theme: reapop_1.wyboTheme, smallScreenBreakpoint: 1 }),
        react_1.default.createElement(ScreenMask_1.default, null),
        react_1.default.createElement(Loading_1.default, null)));
};
const Wrapper = styled_components_1.default.div `
  background: #fff;
`;
exports.default = JobAuth;
//# sourceMappingURL=JobAuth.js.map