"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Header_1 = __importDefault(require("./Header"));
const MySchedule_1 = __importDefault(require("../organisms/MySchedule"));
const CommonSubHeader_1 = __importDefault(require("../organisms/CommonSubHeader"));
const storage_1 = require("../../lib/storage");
const { isPc } = storage_1.storage;
class MySchedule extends react_1.default.Component {
    render() {
        document.title = "My Schedule";
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Header_1.default, { isDarkMode: false }),
            isPc ? null : react_1.default.createElement(CommonSubHeader_1.default, { isDarkMode: false }),
            react_1.default.createElement(MySchedule_1.default, null)));
    }
}
exports.default = MySchedule;
//# sourceMappingURL=MySchedule.js.map