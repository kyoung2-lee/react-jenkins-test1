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
exports.ThreadItem = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const ThreadTag_1 = require("./ThreadTag");
const MessagePostedAt_1 = require("./MessagePostedAt");
const ThreadItem = ({ active, onClick, ...thread }) => (react_1.default.createElement(Container, { active: active, onClick: () => onClick && onClick(thread.bbId) },
    react_1.default.createElement(Header, null,
        react_1.default.createElement(Title, null, thread.jobCd),
        react_1.default.createElement(PostedAt, { value: thread.updateTime, jstFlg: thread.jstFlg })),
    react_1.default.createElement(Content, null, thread.bbTitle),
    react_1.default.createElement(TagContainer, null, thread.catCdList.map((tag) => (react_1.default.createElement(TagCol, { key: tag },
        react_1.default.createElement(ThreadTag_1.ThreadTag, { text: tag })))))));
exports.ThreadItem = ThreadItem;
const Container = styled_components_1.default.div `
  cursor: pointer;
  background-color: #fff;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  padding: 10px;
  margin-bottom: 8px;
  margin-right: 3px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.22);
  ${(props) => props.active &&
    (0, styled_components_1.css) `
      border: 2px solid #eaa812;
      padding: 9px;
    `};
`;
const Header = styled_components_1.default.div `
  display: flex;
`;
const PostedAt = (0, styled_components_1.default)(MessagePostedAt_1.MessagePostedAt) `
  flex: 1;
  text-align: right;
  margin: 0;
  font-size: 13px;
`;
const Title = styled_components_1.default.p `
  margin: 0 0 5px;
  font-weight: bold;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Content = styled_components_1.default.p `
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
  font-size: 17px;
  color: #222222;
`;
const TagContainer = styled_components_1.default.div `
  display: flex;
  margin: 0 -2px;
`;
const TagCol = styled_components_1.default.div `
  padding: 0 2px;
`;
//# sourceMappingURL=ThreadItem.js.map