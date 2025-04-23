"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadPane = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const AdvanceSearch_1 = require("../../molecules/AdvanceSearch");
const ThreadItem_1 = require("./ThreadItem");
const ThreadCategoryTabView_1 = require("./ThreadCategoryTabView");
const storage_1 = require("../../../lib/storage");
const Component = (props) => {
    const isActivedThread = (threadId) => threadId === props.currentThreadId;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Container, { isPc: isPc },
        react_1.default.createElement(Header, { isPc: isPc },
            react_1.default.createElement(AdvanceSearch_1.AdvanceSearch, { placeholder: "Search", filtering: props.filtering, onClickAdvanceSearchFormButton: props.onOpenFilterModal, searchStringParam: props.searchStringParam, onSubmit: props.onSubmitFilter, onChange: props.onChangeFilterString })),
        react_1.default.createElement(ThreadCategoryTabView_1.ThreadCategoryTabView, { threads: props.threads, onRenderContent: (threads) => threads.map((thread) => (react_1.default.createElement(ThreadItem_1.ThreadItem, { active: isActivedThread(thread.bbId), key: `thread_${thread.bbId}`, onClick: props.onSelectThread, ...thread, jstFlg: props.jstFlg }))), editing: props.editing })));
};
exports.ThreadPane = (0, react_redux_1.connect)()(Component);
const Container = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  flex-basis: 380px;
  width: 380px;
  padding: ${({ isPc }) => (isPc ? "0 5px 10px 10px" : "0 0 10px 10px")};
`;
const Header = styled_components_1.default.div `
  display: flex;
  height: 60px;
  padding-right: ${({ isPc }) => (isPc ? "0px" : "10px")};
  align-items: center;
`;
//# sourceMappingURL=ThreadPane.js.map