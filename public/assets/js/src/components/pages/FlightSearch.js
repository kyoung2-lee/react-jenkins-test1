"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const Header_1 = __importDefault(require("./Header"));
const FlightSearch_1 = __importDefault(require("../organisms/FlightSearch"));
const SPFlightSearch_1 = __importDefault(require("../organisms/SmartPhone/SPFlightSearch/SPFlightSearch"));
const FlightSearch = () => {
    document.title = "Flight Search";
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Header_1.default, null),
        storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone ? react_1.default.createElement(SPFlightSearch_1.default, null) : react_1.default.createElement(FlightSearch_1.default, null)));
};
exports.default = FlightSearch;
//# sourceMappingURL=FlightSearch.js.map