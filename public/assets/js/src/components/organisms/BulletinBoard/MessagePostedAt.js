"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagePostedAt = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const MessagePostedAt = ({ value, className, jstFlg }) => (react_1.default.createElement(Time, { className: className },
    (0, dayjs_1.default)(value).format("YYYY/MM/DD HH:mm"),
    jstFlg ? "" : "L"));
exports.MessagePostedAt = MessagePostedAt;
const Time = styled_components_1.default.time `
  display: block;
  margin-right: 20px;
  font-size: 13px;
`;
//# sourceMappingURL=MessagePostedAt.js.map