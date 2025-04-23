"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const CommonHeader_1 = __importDefault(require("../organisms/CommonHeader"));
const SPCommonHeader_1 = __importDefault(require("../organisms/SmartPhone/SPCommonHeader/SPCommonHeader"));
const Header = ({ isDarkMode = false }) => storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone ? react_1.default.createElement(SPCommonHeader_1.default, null) : react_1.default.createElement(CommonHeader_1.default, { isDarkMode: isDarkMode });
exports.default = Header;
//# sourceMappingURL=Header.js.map