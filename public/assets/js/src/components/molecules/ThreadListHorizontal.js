"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const VerticalScroller_1 = require("./VerticalScroller");
const profile_svg_1 = __importDefault(require("../../assets/images/account/profile.svg"));
const ThreadListHorizontal = (props) => {
    const { threads, onSelectThread, currentThreadId } = props;
    return (react_1.default.createElement(VerticalScroller_1.VerticalScroller, null,
        react_1.default.createElement(ThreadListContent, null, threads.threads.map((thread) => (react_1.default.createElement(ThreadListCol, { key: `thread#${thread.bbId}` },
            react_1.default.createElement(ThreadListItem, { onClick: () => onSelectThread(thread.bbId), active: currentThreadId === thread.bbId },
                react_1.default.createElement(ThreadListIcon, { src: thread.profileTmbImg && `data:image/png;base64,${thread.profileTmbImg}` }),
                react_1.default.createElement(ThreadListTitle, null, thread.bbTitle))))))));
};
const ThreadListContent = styled_components_1.default.div `
  display: flex;
  height: 46px;
  align-items: center;
  padding: 5px 6px;
`;
const ThreadListCol = styled_components_1.default.div `
  padding: 0 4px;
`;
const ThreadListItem = styled_components_1.default.div `
  display: flex;
  width: 120px;
  height: 36px;
  padding: 0 6px;
  align-items: center;
  background-color: #fff;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  user-select: none;
  ${(props) => props.active && "border: 1px solid #EAA812"};
`;
const ThreadListTitle = styled_components_1.default.div `
  flex: 1;
  font-size: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const ThreadListIcon = styled_components_1.default.div `
  width: 28px;
  height: 28px;
  margin-right: 4px;
  border-radius: 14px;
  background-image: url("${(props) => props.src || profile_svg_1.default}");
  background-size: cover;
  background-position: center;
`;
exports.default = ThreadListHorizontal;
//# sourceMappingURL=ThreadListHorizontal.js.map