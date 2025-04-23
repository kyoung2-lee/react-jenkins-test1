"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const menu_barchart_svg_1 = __importDefault(require("../../assets/images/menu/menu-barchart.svg"));
const menu_fis_svg_1 = __importDefault(require("../../assets/images/menu/menu-fis.svg"));
const menu_mypage_svg_1 = __importDefault(require("../../assets/images/menu/menu-mypage.svg"));
const menu_flight_search_svg_1 = __importDefault(require("../../assets/images/menu/menu-flight-search.svg"));
const menu_issue_svg_1 = __importDefault(require("../../assets/images/menu/menu-issue.svg"));
const menu_setting_svg_1 = __importDefault(require("../../assets/images/menu/menu-setting.svg"));
const menu_help_svg_1 = __importDefault(require("../../assets/images/menu/menu-help.svg"));
const menu_bb_svg_1 = __importDefault(require("../../assets/images/menu/menu-bb.svg"));
const menu_broadcast_svg_1 = __importDefault(require("../../assets/images/menu/menu-broadcast.svg"));
const menu_oal_schedule_svg_1 = __importDefault(require("../../assets/images/menu/menu-oal_schedule.svg"));
const menu_myschedule_svg_1 = __importDefault(require("../../assets/images/menu/menu-myschedule.svg"));
class MenuList extends react_1.default.Component {
    handleOnClickLink(pathName, externalUrl) {
        if (storage_1.storage.isPc) {
            if (pathName) {
                // 新規タブで開く場合、セッションストレージの内容を遷移先に渡す
                localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
            }
            else if (externalUrl) {
                // ホスト（ドメイン名）を取得する
                const result = externalUrl.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/);
                if (result) {
                    if (window.location.host === result[1]) {
                        // ドメイン名が一致する場合、セッションストレージの内容を遷移先に渡す
                        localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
                    }
                }
            }
        }
        const isNewTab = storage_1.storage.isPc;
        this.props.onClickLink(pathName, isNewTab);
    }
    render() {
        const { jobAuth } = this.props;
        const menuList = jobAuth.filter((auth) => auth.dispFlg && auth.funcCat === "1").sort((a, b) => a.dispSeq - b.dispSeq);
        const bookmarkList = jobAuth.filter((auth) => auth.dispFlg && auth.funcCat === "4").sort((a, b) => a.dispSeq - b.dispSeq);
        const linkTarget = storage_1.storage.isPc ? "_blank" : undefined;
        let urlPrefix = "";
        if (storage_1.storage.terminalCat !== commonConst_1.Const.TerminalCat.pc) {
            // ネイティブアプリの方でブラウザを開く処理が行われるようにプレフィックスをつける
            urlPrefix = "app:";
        }
        return (react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(MenuLinks, null,
                menuList.map((menu) => {
                    if ((0, commonUtil_1.funcAuthCheck)(menu.funcId, menuList) === false) {
                        return undefined;
                    }
                    let item = null;
                    switch (menu.funcId) {
                        case commonConst_1.Const.FUNC_ID.openBarChart: // バーチャート
                            item = (react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.barChart, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.barChart, null) },
                                react_1.default.createElement(MenuContainer, null,
                                    react_1.default.createElement(MenuBody, null,
                                        react_1.default.createElement(MenuBarChartIcon, null)),
                                    react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "Barchart"))));
                            break;
                        case commonConst_1.Const.FUNC_ID.openFis: // FIS
                            item = (react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.fis, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.fis, null) },
                                react_1.default.createElement(MenuContainer, null,
                                    react_1.default.createElement(MenuBody, null,
                                        react_1.default.createElement(MenuFISIcon, null)),
                                    react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "FIS"))));
                            break;
                        case commonConst_1.Const.FUNC_ID.openFlightSearch: // 便一覧
                            item = (react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.flightSearch, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.flightSearch, null) },
                                react_1.default.createElement(MenuContainer, null,
                                    react_1.default.createElement(MenuBody, null,
                                        react_1.default.createElement(MenuFlightSearchIcon, null)),
                                    react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "Flight Search"))));
                            break;
                        case commonConst_1.Const.FUNC_ID.openAirportIssue: // 空港発令・保安情報
                            item = (react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.issueSecurity, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.issueSecurity, null) },
                                react_1.default.createElement(MenuContainer, null,
                                    react_1.default.createElement(MenuBody, null,
                                        react_1.default.createElement(MenuIssueIcon, null)),
                                    react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "Airport Issue"))));
                            break;
                        case commonConst_1.Const.FUNC_ID.openUserSetting: // ユーザー設定
                            item = (react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.userSetting, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.userSetting, null) },
                                react_1.default.createElement(MenuContainer, null,
                                    react_1.default.createElement(MenuBody, null,
                                        react_1.default.createElement(MenuSettingIcon, null)),
                                    react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "User Setting"))));
                            break;
                        case commonConst_1.Const.FUNC_ID.openBulletinBoard:
                            item = (react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.bulletinBoard, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.bulletinBoard, null) },
                                react_1.default.createElement(MenuContainer, null,
                                    react_1.default.createElement(MenuBody, null,
                                        react_1.default.createElement(MenuBbIcon, null)),
                                    react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "B.B."))));
                            break;
                        case commonConst_1.Const.FUNC_ID.openBroadcast:
                            item = (react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.broadcast, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.broadcast, null) },
                                react_1.default.createElement(MenuContainer, null,
                                    react_1.default.createElement(MenuBody, null,
                                        react_1.default.createElement(MenuBroadcastIcon, null)),
                                    react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "Broadcast"))));
                            break;
                        case commonConst_1.Const.FUNC_ID.openOalFlightSchedule:
                            item = (react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.oalFlightSchedule, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.oalFlightSchedule, null) },
                                react_1.default.createElement(MenuContainer, null,
                                    react_1.default.createElement(MenuBody, null,
                                        react_1.default.createElement(MenuOalScheduleIcon, null)),
                                    react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "OAL Schedule"))));
                            break;
                        case commonConst_1.Const.FUNC_ID.mySchedule:
                            item = (react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.mySchedule, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.mySchedule, null) },
                                react_1.default.createElement(MenuContainer, null,
                                    react_1.default.createElement(MenuBody, null,
                                        react_1.default.createElement(MenuMyScheduleIcon, null)),
                                    react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "My Schedule"))));
                            break;
                        default:
                            break;
                    }
                    if (item) {
                        return react_1.default.createElement("li", { key: menu.funcId }, item);
                    }
                    return item;
                }),
                react_1.default.createElement("li", null,
                    react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.myPage, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.myPage, null) },
                        react_1.default.createElement(MenuContainer, null,
                            react_1.default.createElement(MenuBody, null,
                                react_1.default.createElement(MenuMyPageIcon, null)),
                            react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "MyPage")))),
                react_1.default.createElement("li", null,
                    react_1.default.createElement(react_router_dom_1.Link, { to: commonConst_1.Const.PATH_NAME.help, target: linkTarget, onClick: () => this.handleOnClickLink(commonConst_1.Const.PATH_NAME.help, null) },
                        react_1.default.createElement(MenuContainer, null,
                            react_1.default.createElement(MenuBody, null,
                                react_1.default.createElement(MenuHelpIcon, null)),
                            react_1.default.createElement(MenuFooter, { className: "menuFooter" }, "Help"))))),
            bookmarkList.length > 0 ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(SepLine, null),
                react_1.default.createElement(BookMarks, null, bookmarkList.map((menu, index) => (
                // eslint-disable-next-line react/no-array-index-key
                react_1.default.createElement("li", { key: index },
                    react_1.default.createElement("a", { 
                        // eslint-disable-next-line no-script-url
                        href: menu.funcDtl ? urlPrefix + menu.funcDtl : "javascript:void(0)", target: "_blank", rel: "noopener noreferrer", onClick: () => this.handleOnClickLink(null, menu.funcDtl) }, menu.funcIcon ? react_1.default.createElement("img", { src: `data:image/png;base64,${menu.funcIcon}`, alt: "" }) : react_1.default.createElement("div", null)),
                    react_1.default.createElement("div", null, menu.funcName))))))) : ("")));
    }
}
const Wrapper = styled_components_1.default.div `
  max-height: inherit;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const MenuBarChartIcon = styled_components_1.default.img.attrs({ src: menu_barchart_svg_1.default }) `
  width: 44.72px;
  height: 45.38px;
`;
const MenuFISIcon = styled_components_1.default.img.attrs({ src: menu_fis_svg_1.default }) `
  width: 51.745px;
  height: 47.862px;
`;
const MenuMyPageIcon = styled_components_1.default.img.attrs({ src: menu_mypage_svg_1.default }) `
  width: 33.962px;
  height: 33.962px;
`;
const MenuFlightSearchIcon = styled_components_1.default.img.attrs({
    src: menu_flight_search_svg_1.default,
}) `
  width: 48.505px;
  height: 45.271px;
`;
const MenuIssueIcon = styled_components_1.default.img.attrs({ src: menu_issue_svg_1.default }) `
  width: 31.61px;
  height: 30.685px;
`;
const MenuSettingIcon = styled_components_1.default.img.attrs({ src: menu_setting_svg_1.default }) `
  width: 33.181px;
  height: 33.036px;
`;
const MenuHelpIcon = styled_components_1.default.img.attrs({ src: menu_help_svg_1.default }) `
  width: 21.698px;
  height: 36.136px;
`;
const MenuBbIcon = styled_components_1.default.img.attrs({ src: menu_bb_svg_1.default }) `
  width: 47px;
  height: 47px;
`;
const MenuBroadcastIcon = styled_components_1.default.img.attrs({ src: menu_broadcast_svg_1.default }) `
  width: 41px;
  height: 41px;
`;
const MenuOalScheduleIcon = styled_components_1.default.img.attrs({ src: menu_oal_schedule_svg_1.default }) `
  width: 52px;
  height: 52px;
`;
const MenuMyScheduleIcon = styled_components_1.default.img.attrs({ src: menu_myschedule_svg_1.default }) `
  width: 50px;
  height: 53px;
`;
const MenuLinks = styled_components_1.default.ul `
  list-style: none;
  padding: 7px;
  margin: 0;
  display: flex;
  flex-wrap: wrap;

  li {
    text-align: center;
    margin: 7px;
    font-size: 14px;
    a {
      display: flex;
      text-decoration: none;
      flex-direction: column;
      align-items: center;
      font-size: 14px;
    }
  }
`;
const MenuContainer = styled_components_1.default.div `
  width: 106px;
  min-height: 106px;
  border-radius: 6px;
  display: flex;
  flex: 1;
  flex-direction: column;
  background: ${(props) => props.theme.color.button.PRIMARY};
  color: ${(props) => props.theme.color.WHITE};
  &:hover {
    background: ${(props) => props.theme.color.button.PRIMARY_HOVER};
    .menuFooter {
      background: #4e7591;
    }
  }
  &:active {
    background: ${(props) => props.theme.color.button.PRIMARY_ACTIVE};
    .menuFooter {
      background: #446d88;
    }
  }
`;
const MenuBody = styled_components_1.default.div `
  flex-basis: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
const MenuFooter = styled_components_1.default.div `
  flex-basis: 27.67px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #60859e;
  border-radius: 0 0 6px 6px;
`;
const BookMarks = (0, styled_components_1.default)(MenuLinks) `
  border-radius: 0px 0px 6px 6px;
  li {
    a {
      img {
        width: 106px;
        height: 106px;
        border-radius: 6px;
        background: ${(props) => props.theme.color.WHITE};
        &:hover {
          opacity: 0.8;
        }
      }
      div {
        width: 106px;
        height: 106px;
        border-radius: 6px;
        border-style: solid;
        border-width: 1px;
        border-color: ${(props) => props.theme.color.button.PRIMARY};
        background: ${(props) => props.theme.color.WHITE};
      }
    }
    > div:last-child {
      line-height: 19px;
      margin-top: 3px;
      color: #666666;
      width: 106px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
const SepLine = styled_components_1.default.hr `
  border-top: 1px solid #c9d3d0;
`;
exports.default = MenuList;
//# sourceMappingURL=MenuList.js.map