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
exports.ThreadCategoryTabView = void 0;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importStar(require("styled-components"));
const react_redux_1 = require("react-redux");
const lodash_intersection_1 = __importDefault(require("lodash.intersection"));
const plus_svg_component_1 = __importDefault(require("../../../assets/images/icon/plus.svg?component"));
const commonUtil_1 = require("../../../lib/commonUtil");
const commonConst_1 = require("../../../lib/commonConst");
const storage_1 = require("../../../lib/storage");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const hooks_1 = require("../../../store/hooks");
const bulletinBoard_1 = require("../../../reducers/bulletinBoard");
const EventListener_1 = __importDefault(require("../../atoms/EventListener"));
var TabName;
(function (TabName) {
    TabName["Star"] = "\u2605";
    TabName["Private"] = "Private";
    TabName["Public"] = "Public";
    TabName["Flight"] = "Flight";
})(TabName || (TabName = {}));
const Component = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const history = (0, react_router_dom_1.useHistory)();
    const [activeTab, setActiveTab] = (0, react_1.useState)("Star");
    const [windowHeight, setWindowHeight] = (0, react_1.useState)(window.innerHeight);
    const categories = (() => props.cdCtrlDtls
        .filter((c) => c.cdCls === commonConst_1.Const.CodeClass.BULLETIN_BOARD_CATEGORY)
        .map((c) => ({
        value: c.cdCat1,
        group: c.cdCat2,
    }))
        .reduce((p, c) => ({ ...p, [c.group]: [...(p[c.group] || []), c.value] }), {}))();
    const categoriesStar = (() => props.cdCtrlDtls.filter((c) => c.cdCls === commonConst_1.Const.CodeClass.BULLETIN_BOARD_CATEGORY && c.num2 > 0).map((c) => c.cdCat1))();
    const changeTab = (tabName) => {
        setActiveTab(tabName);
        filteredThreads(tabName);
    };
    const filteredThreads = (tabName) => {
        if (!props.threads)
            return [];
        const { threadList } = props.threads;
        switch (tabName) {
            case "Star":
                // スターのカテゴリをもつスレッドを抽出
                return threadList.filter((item) => (0, lodash_intersection_1.default)(item.catCdList, categoriesStar).length > 0);
            case "Flight":
                // 同カテゴリをもつスレッドを抽出
                return threadList.filter((item) => (0, lodash_intersection_1.default)(item.catCdList, categories.FLIGHT).length > 0);
            case "Public":
                // 同カテゴリをもつスレッドを抽出
                return threadList.filter((item) => (0, lodash_intersection_1.default)(item.catCdList, categories.PUBLIC).length > 0);
            case "Private":
                // FLIGHTとPUBLICのカテゴリを持っていないスレッドを抽出
                return threadList.filter((item) => (0, lodash_intersection_1.default)(item.catCdList, [...categories.FLIGHT, ...categories.PUBLIC]).length === 0);
            default:
                return [];
        }
    };
    const renderContent = () => props.onRenderContent(filteredThreads(activeTab));
    const addBB = () => {
        if (!creatable())
            return;
        if (props.editing) {
            void dispatch((0, bulletinBoard_1.showMessage)({
                message: soalaMessages_1.SoalaMessage.M40012C({
                    onYesButton: () => openBb(),
                }),
            }));
        }
        else {
            openBb();
        }
    };
    const openBb = () => history.push("/broadcast?from=new");
    const creatable = () => (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateBulletinBoard, props.jobAuth.jobAuth) && !storage_1.storage.isIphone;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(Tab, { isPc: isPc },
            react_1.default.createElement(AddTabButton, { onClick: addBB, disabled: !creatable() },
                react_1.default.createElement(plus_svg_component_1.default, null)),
            Object.entries(TabName).map(([key, value]) => (react_1.default.createElement(TabItem, { key: key, active: activeTab === key, onClick: () => changeTab(key) }, value)))),
        react_1.default.createElement(ThreadList, { isPc: isPc, windowHeight: windowHeight }, renderContent()),
        react_1.default.createElement(EventListener_1.default, { eventHandlers: [
                {
                    target: window,
                    type: "resize",
                    listener: () => setWindowHeight(window.innerHeight),
                },
                {
                    target: window,
                    type: "orientationchange",
                    listener: () => setWindowHeight(window.innerHeight),
                },
            ] })));
};
exports.ThreadCategoryTabView = (0, react_redux_1.connect)((state) => ({
    cdCtrlDtls: state.account.master.cdCtrlDtls,
    jobAuth: state.account.jobAuth,
}))(Component);
const Container = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const Tab = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-right: ${({ isPc }) => (isPc ? "0px" : "10px")};
`;
const TabItem = styled_components_1.default.div `
  user-select: none;
  flex: 1;
  padding: 8px 0;
  text-align: center;
  color: ${(props) => props.theme.color.PRIMARY};
  cursor: pointer;
  ${(props) => props.active &&
    `
    background-color: #fff;
    border-bottom: 2px solid ${props.theme.color.PRIMARY};
    color: ${props.theme.color.PRIMARY};
  `};
`;
const AddTabButton = styled_components_1.default.button `
  flex-basis: 40px;
  color: red;
  border: none;
  background-color: transparent;
  outline: none;
  svg {
    fill: ${(props) => (props.disabled ? "#aaa" : "#346181")};
    width: 20px;
    height: 20px;
  }

  ${(props) => !props.disabled &&
    (0, styled_components_1.css) `
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    `};
`;
const ThreadList = styled_components_1.default.div `
  max-height: ${(props) => props.windowHeight - (props.isPc ? 167 : 209)}px;
  flex: 1;
  flex-basis: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding-right: ${({ isPc }) => (isPc ? "0px" : "7px")};
`;
//# sourceMappingURL=ThreadCategoryTabView.js.map