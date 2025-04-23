"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Header_1 = __importDefault(require("./Header"));
const OalFlightSchedule_1 = __importDefault(require("../organisms/OalFlightSchedule"));
const OalFlightSchedule = () => {
    document.title = "OAL Schedule";
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Header_1.default, null),
        react_1.default.createElement(OalFlightSchedule_1.default, null)));
};
exports.default = OalFlightSchedule;
//# sourceMappingURL=OalFlightSchedule.js.map