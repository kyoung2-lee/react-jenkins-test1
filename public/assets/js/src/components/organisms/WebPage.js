"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const storage_1 = require("../../lib/storage");
const hooks_1 = require("../../store/hooks");
const WebPage = (props) => {
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    return storage_1.storage.isIpad || storage_1.storage.isIphone ? (react_1.default.createElement(ActualWrapper, { hasApo: !!jobAuth.user.myApoCd, isIpad: storage_1.storage.isIpad },
        react_1.default.createElement(TransWrapper, { isIpad: storage_1.storage.isIpad },
            react_1.default.createElement(Content, { src: props.url, scrolling: "yes" })))) : (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Content, { src: props.url, scrolling: "yes" })));
};
// prettierに自動整形させた場合、改行位置の兼ね合いでエラーが出てしまうため、この場所では無効にする
// prettier-ignore
const ActualWrapper = styled_components_1.default.div `
  width: 100vw;
  height: calc(100vh - ${({ theme: { layout: { header, footer } }, hasApo, isIpad }) => isIpad
    ? `${header.tablet}`
    : hasApo
        ? `${header.mobile} - ${footer.mobile}`
        : `${header.statusBar} - ${footer.mobile}`});
`;
const TransWrapper = styled_components_1.default.div `
  width: 100%;
  /* ${({ isIpad }) => isIpad
    ? `height: 125%;
  width: 125%;
  transform: scale(0.8);
  transform-origin: 0 0`
    : "height: 100%"}; */
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;
const Wrapper = styled_components_1.default.div `
  width: 100%;
  height: calc(100vh - ${({ theme }) => `${theme.layout.header.default}`});
  margin: 0 auto;
  overflow: hidden;
`;
const Content = styled_components_1.default.iframe `
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;
exports.default = WebPage;
//# sourceMappingURL=WebPage.js.map