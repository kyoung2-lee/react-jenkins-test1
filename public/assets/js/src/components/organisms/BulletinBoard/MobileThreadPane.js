"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileThreadPane = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const AdvanceSearch_1 = require("../../molecules/AdvanceSearch");
const MobileThreadItem_1 = require("./MobileThreadItem");
const ThreadCategoryTabView_1 = require("./ThreadCategoryTabView");
const Component = (props) => {
    const isActivedThread = (threadId) => threadId === props.currentThreadId;
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(Header, null,
            react_1.default.createElement(AdvanceSearch_1.AdvanceSearch, { placeholder: "Search", filtering: props.filtering, onClickAdvanceSearchFormButton: props.onOpenFilterModal, searchStringParam: props.searchStringParam, onSubmit: props.onSubmitFilter, onChange: props.onChangeFilterString })),
        react_1.default.createElement(ThreadCategoryTabView_1.ThreadCategoryTabView, { threads: props.threads, onRenderContent: (threads) => threads.map((thread) => (react_1.default.createElement(MobileThreadItem_1.MobileThreadItem, { active: isActivedThread(thread.bbId), key: `thread_${thread.bbId}`, onClick: props.onSelectThread, jstFlg: props.jstFlg, ...thread }))), editing: props.editing })));
};
exports.MobileThreadPane = (0, react_redux_1.connect)()(Component);
const Container = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  flex-basis: 320px;
  width: 320px;
  padding: 0px 0px 10px 7px;
  flex: 1;
`;
const Header = styled_components_1.default.div `
  display: flex;
  height: 60px;
  align-items: center;
  padding-right: 10px;
`;
//# sourceMappingURL=MobileThreadPane.js.map