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
const react_1 = __importStar(require("react"));
const react_scrollbar_size_1 = __importDefault(require("react-scrollbar-size"));
const styled_components_1 = require("styled-components");
const Header_1 = __importDefault(require("./Header"));
const hooks_1 = require("../../store/hooks");
const storage_1 = require("../../lib/storage");
const StorageOfUser_1 = require("../../lib/StorageOfUser");
const CommonSubHeader_1 = __importDefault(require("../organisms/CommonSubHeader"));
const FisTable_1 = __importDefault(require("../organisms/FisTable"));
const themeDark_1 = __importDefault(require("../../themes/themeDark"));
const themeLight_1 = __importDefault(require("../../themes/themeLight"));
const { isPc } = storage_1.storage;
const Fis = () => {
    const apoCd = (0, hooks_1.useAppSelector)((state) => state.common.headerInfo.apoCd);
    const isDarkMode = (0, hooks_1.useAppSelector)((state) => state.account.isDarkMode);
    const scrollbarWidth = (0, react_scrollbar_size_1.default)().width;
    // ストレージの自動更新中の画面を削除
    const pushCounterDowun = () => {
        const { pageStamp } = storage_1.storage;
        if (pageStamp) {
            StorageOfUser_1.storageOfUser.removePushCounter({ type: "fis", pageStamp });
        }
    };
    (0, react_1.useEffect)(() => {
        // ブラウザクローズ時、自動更新中の画面を削除
        if (isPc)
            window.addEventListener("beforeunload", pushCounterDowun); // イベントを追加
        return () => {
            if (isPc)
                window.removeEventListener("beforeunload", pushCounterDowun); // イベントを削除
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (apoCd) {
            document.title = `FIS - ${apoCd}`;
        }
        else {
            document.title = "FIS";
        }
    }, [apoCd]);
    return (react_1.default.createElement(styled_components_1.ThemeProvider, { theme: isPc && isDarkMode ? themeDark_1.default : themeLight_1.default },
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Header_1.default, { isDarkMode: isPc && isDarkMode }),
            isPc ? null : react_1.default.createElement(CommonSubHeader_1.default, { isDarkMode: isPc && isDarkMode }),
            react_1.default.createElement(FisTable_1.default, { isDarkMode: isPc && isDarkMode, scrollbarWidth: scrollbarWidth }))));
};
exports.default = Fis;
//# sourceMappingURL=Fis.js.map