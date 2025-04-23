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
// import "react-select/dist/react-select.css";
require("react-virtualized/styles.css");
const react_1 = __importStar(require("react"));
const root_1 = require("react-hot-loader/root");
// import { Provider } from "react-redux";
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importStar(require("styled-components"));
const commonConst_1 = require("../lib/commonConst");
const commonUtil_1 = require("../lib/commonUtil");
const storage_1 = require("../lib/storage");
const config_1 = require("../../config/config");
const themeLight_1 = __importDefault(require("../themes/themeLight"));
const GlobalStyle_1 = __importDefault(require("./GlobalStyle"));
const hooks_1 = require("../store/hooks");
const Auth_1 = __importDefault(require("./pages/Auth"));
const BarChart_1 = __importDefault(require("./pages/BarChart"));
const Broadcast_1 = __importDefault(require("./pages/Broadcast"));
const Fis_1 = __importDefault(require("./pages/Fis"));
const FlightSearch_1 = __importDefault(require("./pages/FlightSearch"));
const Help_1 = __importDefault(require("./pages/Help"));
const Error_1 = __importDefault(require("./pages/Error"));
const JobAuth_1 = __importDefault(require("./pages/JobAuth"));
const IssueSecurity_1 = __importDefault(require("./pages/IssueSecurity"));
const MyPage_1 = __importDefault(require("./pages/MyPage"));
const NotificationList_1 = __importDefault(require("./pages/NotificationList"));
const Profile_1 = __importDefault(require("./pages/Profile"));
const UserSetting_1 = __importDefault(require("./pages/UserSetting"));
const BulletinBoard_1 = require("./pages/BulletinBoard");
const OalFlightSchedule_1 = __importDefault(require("./pages/OalFlightSchedule"));
const MySchedule_1 = __importDefault(require("./pages/MySchedule"));
const CognitoAuthenticated_1 = __importDefault(require("./pages/CognitoAuthenticated"));
const CognitoRedirect_1 = __importDefault(require("./pages/CognitoRedirect"));
const CognitoAuth_1 = __importDefault(require("./pages/CognitoAuth"));
const App = () => {
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const [reloadBb, setReloadBb] = (0, react_1.useState)(undefined);
    const handleClickBb = () => {
        if (reloadBb) {
            reloadBb();
        }
    };
    return (react_1.default.createElement(styled_components_1.ThemeProvider, { theme: themeLight_1.default },
        react_1.default.createElement(GlobalStyle_1.default, null),
        react_1.default.createElement(react_router_dom_1.BrowserRouter, { basename: config_1.ServerConfig.BASE_ROUTE },
            react_1.default.createElement(Wrapper, { terminalCat: storage_1.storage.terminalCat },
                react_1.default.createElement(react_router_dom_1.Switch, null,
                    react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: commonConst_1.Const.PATH_NAME.cognitoAuth, component: CognitoAuth_1.default }),
                    react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: commonConst_1.Const.PATH_NAME.cognitoRedirect, component: CognitoRedirect_1.default }),
                    react_1.default.createElement(CognitoAuthenticated_1.default, null,
                        react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: commonConst_1.Const.PATH_NAME.jobAuth, component: JobAuth_1.default }),
                        react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: commonConst_1.Const.PATH_NAME.error, component: Error_1.default }),
                        !jobAuth.info.token && react_1.default.createElement(react_router_dom_1.Redirect, { to: commonConst_1.Const.PATH_NAME.jobAuth }),
                        react_1.default.createElement(Auth_1.default, { onClickBb: handleClickBb },
                            react_1.default.createElement(react_router_dom_1.Switch, null,
                                react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: commonConst_1.Const.PATH_NAME.home, component: MyPage_1.default }),
                                react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: commonConst_1.Const.PATH_NAME.profile, component: Profile_1.default }),
                                react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: commonConst_1.Const.PATH_NAME.myPage, component: MyPage_1.default }),
                                react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: commonConst_1.Const.PATH_NAME.help, component: Help_1.default }),
                                react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: commonConst_1.Const.PATH_NAME.bulletinBoard, render: (props) => react_1.default.createElement(BulletinBoard_1.BulletinBoard, { ...props, setReloadBb: (func) => setReloadBb((_prev) => func) }) }),
                                jobAuth.jobAuth.map((menu) => {
                                    if ((0, commonUtil_1.funcAuthCheck)(menu.funcId, jobAuth.jobAuth) === false) {
                                        return undefined;
                                    }
                                    switch (menu.funcId) {
                                        case commonConst_1.Const.FUNC_ID.openBarChart:
                                            return react_1.default.createElement(react_router_dom_1.Route, { key: menu.funcId, exact: true, path: commonConst_1.Const.PATH_NAME.barChart, component: BarChart_1.default });
                                        case commonConst_1.Const.FUNC_ID.openFis:
                                            return react_1.default.createElement(react_router_dom_1.Route, { key: menu.funcId, exact: true, path: commonConst_1.Const.PATH_NAME.fis, component: Fis_1.default });
                                        case commonConst_1.Const.FUNC_ID.openFlightSearch:
                                            return react_1.default.createElement(react_router_dom_1.Route, { key: menu.funcId, exact: true, path: commonConst_1.Const.PATH_NAME.flightSearch, component: FlightSearch_1.default });
                                        case commonConst_1.Const.FUNC_ID.openAirportIssue:
                                            return react_1.default.createElement(react_router_dom_1.Route, { key: menu.funcId, exact: true, path: commonConst_1.Const.PATH_NAME.issueSecurity, component: IssueSecurity_1.default });
                                        case commonConst_1.Const.FUNC_ID.openUserSetting:
                                            return react_1.default.createElement(react_router_dom_1.Route, { key: menu.funcId, exact: true, path: commonConst_1.Const.PATH_NAME.userSetting, component: UserSetting_1.default });
                                        case commonConst_1.Const.FUNC_ID.openNotificationList:
                                            return react_1.default.createElement(react_router_dom_1.Route, { key: menu.funcId, exact: true, path: commonConst_1.Const.PATH_NAME.notification, component: NotificationList_1.default });
                                        case commonConst_1.Const.FUNC_ID.openBroadcast:
                                            return react_1.default.createElement(react_router_dom_1.Route, { key: menu.funcId, exact: true, path: commonConst_1.Const.PATH_NAME.broadcast, component: Broadcast_1.default });
                                        case commonConst_1.Const.FUNC_ID.openOalFlightSchedule:
                                            return react_1.default.createElement(react_router_dom_1.Route, { key: menu.funcId, exact: true, path: commonConst_1.Const.PATH_NAME.oalFlightSchedule, component: OalFlightSchedule_1.default });
                                        case commonConst_1.Const.FUNC_ID.mySchedule:
                                            return react_1.default.createElement(react_router_dom_1.Route, { key: menu.funcId, exact: true, path: commonConst_1.Const.PATH_NAME.mySchedule, component: MySchedule_1.default });
                                        default:
                                            return undefined;
                                    }
                                })))))))));
};
const Wrapper = styled_components_1.default.div `
  background: #f6f6f6;
  min-width: ${({ terminalCat }) => (terminalCat === commonConst_1.Const.TerminalCat.pc ? "1024px" : "100%")};
  height: 100%;
`;
exports.default = (0, root_1.hot)(App);
//# sourceMappingURL=App.js.map