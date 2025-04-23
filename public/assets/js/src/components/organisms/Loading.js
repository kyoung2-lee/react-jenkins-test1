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
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const loading_gif_1 = __importDefault(require("../../assets/images/loading.gif"));
/**
 * Preloaders (codepen.io) :
 * https://codepen.io/ahdigital/pen/prXBzN
 */
const Loading = () => {
    const [isShowLoading, setIsShowLoading] = (0, react_1.useState)(false);
    const [isShowLoadingImage, setIsShowLoadingImage] = (0, react_1.useState)(false);
    const accountIsFetching = (0, hooks_1.useAppSelector)((state) => state.account.isFetching);
    const fisIsFetching = (0, hooks_1.useAppSelector)((state) => state.fis.isFetching);
    const flightSearchIsFetching = (0, hooks_1.useAppSelector)((state) => state.flightSearch.isFetching);
    const issueSecurityIsFetching = (0, hooks_1.useAppSelector)((state) => state.issueSecurity.isFetching);
    const userSettingIsFetching = (0, hooks_1.useAppSelector)((state) => state.userSetting.isFetching);
    const broadcastFetchingAll = (0, hooks_1.useAppSelector)((state) => state.broadcast.Broadcast.fetchingAll);
    const broadcastBulletinBoardFetchingBb = (0, hooks_1.useAppSelector)((state) => state.broadcast.BulletinBoard.fetchingBb);
    const broadcastBulletinBoardFetchingAllFlightLeg = (0, hooks_1.useAppSelector)((state) => state.broadcast.BulletinBoard.fetchingAllFlightLeg);
    const broadcastBulletinBoardFetching = (0, hooks_1.useAppSelector)((state) => state.broadcast.BulletinBoard.fetching);
    const broadcastEmailFetching = (0, hooks_1.useAppSelector)((state) => state.broadcast.Email.fetching);
    const broadcastTtyFetching = (0, hooks_1.useAppSelector)((state) => state.broadcast.Tty.fetching);
    const broadcastAcarsFetching = (0, hooks_1.useAppSelector)((state) => state.broadcast.Acars.fetching);
    const broadcastNotificationFetching = (0, hooks_1.useAppSelector)((state) => state.broadcast.Notification.fetching);
    const oalFlightScheduleIsFetching = (0, hooks_1.useAppSelector)((state) => state.oalFlightSchedule.isFetching);
    const bulletinBoardIsFetchingThreads = (0, hooks_1.useAppSelector)((state) => state.bulletinBoard.isFetchingThreads);
    const myScheduleIsFetching = (0, hooks_1.useAppSelector)((state) => state.mySchedule.isFetching);
    (0, react_1.useEffect)(() => {
        setIsShowLoading(accountIsFetching);
    }, [accountIsFetching]);
    (0, react_1.useEffect)(() => {
        setIsShowLoadingImage(fisIsFetching ||
            flightSearchIsFetching ||
            issueSecurityIsFetching ||
            userSettingIsFetching ||
            broadcastFetchingAll ||
            broadcastBulletinBoardFetchingBb ||
            broadcastBulletinBoardFetchingAllFlightLeg ||
            broadcastBulletinBoardFetching ||
            broadcastEmailFetching ||
            broadcastTtyFetching ||
            broadcastAcarsFetching ||
            broadcastNotificationFetching ||
            oalFlightScheduleIsFetching ||
            bulletinBoardIsFetchingThreads ||
            myScheduleIsFetching);
    }, [
        broadcastAcarsFetching,
        broadcastBulletinBoardFetching,
        broadcastBulletinBoardFetchingAllFlightLeg,
        broadcastBulletinBoardFetchingBb,
        broadcastEmailFetching,
        broadcastFetchingAll,
        broadcastNotificationFetching,
        broadcastTtyFetching,
        bulletinBoardIsFetchingThreads,
        fisIsFetching,
        flightSearchIsFetching,
        issueSecurityIsFetching,
        oalFlightScheduleIsFetching,
        userSettingIsFetching,
        myScheduleIsFetching,
    ]);
    if (isShowLoading) {
        return (react_1.default.createElement(LoadingJobAuthWrapper, null,
            react_1.default.createElement(Preloader, null,
                react_1.default.createElement("span", { className: "line line-1" }),
                react_1.default.createElement("span", { className: "line line-2" }),
                react_1.default.createElement("span", { className: "line line-3" }),
                react_1.default.createElement("span", { className: "line line-4" }),
                react_1.default.createElement("span", { className: "line line-5" }),
                react_1.default.createElement("span", { className: "line line-6" }),
                react_1.default.createElement("span", { className: "line line-7" }),
                react_1.default.createElement("span", { className: "line line-8" }),
                react_1.default.createElement("span", { className: "line line-9" }),
                react_1.default.createElement("div", null, "Loading"))));
    }
    if (isShowLoadingImage) {
        return (react_1.default.createElement(LoadingFetchWrapper, null,
            react_1.default.createElement(LoadingContainer, null,
                react_1.default.createElement("img", { src: loading_gif_1.default, alt: "" }))));
    }
    return react_1.default.createElement("div", null);
};
/* ログイン画面 */
const LoadingJobAuthWrapper = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999999999;
  background: rgba(0, 0, 0, 0.8);
`;
const Preloader = styled_components_1.default.div `
  position: absolute;
  top: calc(50% - (45px + 34px + 5px + 5px) / 2);
  right: 0;
  left: 0;
  margin: auto;
  width: 300px;
  height: 0;
  text-align: center;

  > div {
    color: #fff;
    margin: 5px 0;
    text-transform: uppercase;
    font-size: 30px;
    letter-spacing: 2px;
  }

  > .line {
    width: 3px;
    height: 45px;
    background: #fff;
    margin: 0 9px;
    display: inline-block;
    animation: customOpacity 1000ms infinite ease-in-out;
  }

  > .line-1 {
    animation-delay: 800ms;
  }
  > .line-2 {
    animation-delay: 600ms;
  }
  > .line-3 {
    animation-delay: 400ms;
  }
  > .line-4 {
    animation-delay: 200ms;
  }
  > .line-6 {
    animation-delay: 200ms;
  }
  > .line-7 {
    animation-delay: 400ms;
  }
  > .line-8 {
    animation-delay: 600ms;
  }
  > .line-9 {
    animation-delay: 800ms;
  }

  @keyframes customOpacity {
    0% {
      opacity: 1;
      height: 45px;
    }
    50% {
      opacity: 0;
      height: 45px;
    }
    100% {
      opacity: 1;
      height: 45px;
    }
  }
`;
/* FIS画面、便情報一覧画面 */
const LoadingFetchWrapper = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999999;
  background: rgba(0, 0, 0, 0.5);
`;
const LoadingContainer = styled_components_1.default.div `
  width: 240px;
  height: 184px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
  }
`;
exports.default = Loading;
//# sourceMappingURL=Loading.js.map