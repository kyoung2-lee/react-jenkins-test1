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
require("regenerator-runtime/runtime");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const arraySupport_1 = __importDefault(require("dayjs/plugin/arraySupport"));
const isSameOrAfter_1 = __importDefault(require("dayjs/plugin/isSameOrAfter"));
const isSameOrBefore_1 = __importDefault(require("dayjs/plugin/isSameOrBefore"));
const isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const react_redux_1 = require("react-redux");
const App_1 = __importDefault(require("./components/App"));
const store_1 = __importDefault(require("./store/store"));
// dayjsのGlobal設定
dayjs_1.default.locale("en");
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.extend(customParseFormat_1.default);
dayjs_1.default.extend(duration_1.default);
dayjs_1.default.extend(arraySupport_1.default);
dayjs_1.default.extend(isSameOrAfter_1.default);
dayjs_1.default.extend(isSameOrBefore_1.default);
dayjs_1.default.extend(isBetween_1.default);
// スマホとそれ以外でviewportの設定を変える
const meta = document.createElement("meta");
meta.setAttribute("name", "viewport");
if (navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("Android") > 0) {
    meta.setAttribute("content", "width=device-width,user-scalable=no,maximum-scale=1.0");
}
else {
    meta.setAttribute("content", "width=1024,user-scalable=no,maximum-scale=1.0");
}
document.getElementsByTagName("head")[0].appendChild(meta);
const render = () => {
    ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store_1.default },
        React.createElement(App_1.default, null)), document.getElementById("content"));
};
render();
//# sourceMappingURL=index.js.map