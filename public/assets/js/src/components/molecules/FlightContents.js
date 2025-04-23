"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flightModalTabInfo = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const notifications_1 = require("../../lib/notifications");
const soalaMessages_1 = require("../../lib/soalaMessages");
const CommonSlideTab_1 = __importDefault(require("./CommonSlideTab"));
const FlightPaxFrom_1 = __importDefault(require("./FlightPaxFrom"));
const StationOperationTask_1 = __importDefault(require("./StationOperationTask"));
const FlightDetail_1 = __importDefault(require("./FlightDetail"));
const FlightChangeHistory_1 = __importDefault(require("./FlightChangeHistory"));
const FlightSpecialCare_1 = __importDefault(require("./FlightSpecialCare"));
const FlightPaxTo_1 = __importDefault(require("./FlightPaxTo"));
const FlightBulletinBoard_1 = __importDefault(require("./FlightBulletinBoard"));
const RoundButtonMode_1 = __importDefault(require("../atoms/RoundButtonMode"));
const RoundButtonReload_1 = __importDefault(require("../atoms/RoundButtonReload"));
// 便詳細モードレス画面のタブ情報
exports.flightModalTabInfo = [
    {
        name: "PaxFrom",
        funcId: commonConst_1.Const.FUNC_ID.openPaxBarChart,
        isOalValid: false,
        isPastDbValid: false,
        isReloadable: false,
        reloadButtonBottomHeight: -1,
    },
    {
        name: "B.B.",
        funcId: commonConst_1.Const.FUNC_ID.openBulletinBoard,
        isOalValid: true,
        isPastDbValid: true,
        isReloadable: false,
        reloadButtonBottomHeight: -1,
    },
    {
        name: "Task",
        funcId: commonConst_1.Const.FUNC_ID.openOperationTask,
        isOalValid: true,
        isPastDbValid: true,
        isReloadable: true,
        reloadButtonBottomHeight: null,
    },
    {
        name: "Detail",
        funcId: commonConst_1.Const.FUNC_ID.openFlightDetail,
        isOalValid: true,
        isPastDbValid: true,
        isReloadable: true,
        reloadButtonBottomHeight: 50,
    },
    {
        name: "Care",
        funcId: commonConst_1.Const.FUNC_ID.openSpecialCare,
        isOalValid: false,
        isPastDbValid: true,
        isReloadable: true,
        reloadButtonBottomHeight: 50,
    },
    {
        name: "History",
        funcId: commonConst_1.Const.FUNC_ID.openFlightDetail,
        isOalValid: true,
        isPastDbValid: true,
        isReloadable: true,
        reloadButtonBottomHeight: 50,
    },
    {
        name: "PaxTo",
        funcId: commonConst_1.Const.FUNC_ID.openPaxBarChart,
        isOalValid: false,
        isPastDbValid: false,
        isReloadable: false,
        reloadButtonBottomHeight: -1,
    },
];
//
// FISで表示していたモーダルをまとめてタブで表示するComponentです。
// Componentを疎結合にするため、Headerの更新はタブコンテンツとなるComponentのpropsに関数を渡して、
// Headerの更新に必要なデータを受け取り、描画するようにしています。
//
const FlightContents = (props) => {
    const { dispatch } = props;
    const handleFocus = () => {
        const { flightModalsActions, scrollContentRef, content, saveScroll } = props;
        if (scrollContentRef.current) {
            scrollContentRef.current.focus();
            if (content) {
                dispatch(saveScroll({ identifier: content.identifier, scrollTop: scrollContentRef.current.scrollTop }));
            }
        }
        dispatch(flightModalsActions.focusFlightModalAction({ identifier: content.identifier }));
    };
    const handleReload = () => {
        const { content } = props;
        if (!content) {
            return;
        }
        handleFocus();
        const { flightKey, bulletinBoard } = content;
        const isReload = true;
        switch (content.currentTabName) {
            case "Detail": {
                const { fetchFlightDetail } = props.flightDetailActions;
                void dispatch(fetchFlightDetail({ flightKey, isReload }));
                break;
            }
            case "PaxFrom": {
                const { fetchFlightPaxFrom } = props.flightPaxFromListActions;
                void dispatch(fetchFlightPaxFrom({ flightKey, isReload }));
                break;
            }
            case "PaxTo": {
                const { fetchFlightPaxTo } = props.flightPaxToListActions;
                void dispatch(fetchFlightPaxTo({ flightKey, isReload }));
                break;
            }
            case "B.B.": {
                const { fetchFlightThreadsAll } = props.flightBulletinBoardActions;
                const bbId = bulletinBoard && bulletinBoard.currentBbId ? bulletinBoard.currentBbId : null;
                void dispatch(fetchFlightThreadsAll({ flightKey, bbId, isReload, isNeedScroll: true }));
                break;
            }
            case "Care": {
                const { fetchFlightSpecialCare } = props.flightSpecialCareActions;
                void dispatch(fetchFlightSpecialCare({ flightKey, isReload }));
                break;
            }
            case "Task": {
                const { fetchStationOperationTask } = props.stationOperationTaskActions;
                void dispatch(fetchStationOperationTask({ flightKey, isReload }));
                break;
            }
            case "History": {
                const { fetchFlightChangeHistory } = props.flightChangeHistoryActions;
                void dispatch(fetchFlightChangeHistory({ flightKey, isReload }));
                break;
            }
            default:
                break;
        }
    };
    const handleUtc = () => {
        const { content, toggleUtcMode } = props;
        const { identifier, isUtc } = content || { identifier: "", isUtc: false };
        dispatch(toggleUtcMode({ identifier, isUtc: !isUtc }));
        handleFocus();
    };
    const updateFlightRmksDep = (rmksText, closeRmksPopup) => {
        const { content, flightDetailActions } = props;
        const { flightDetail } = content || { flightDetail: undefined };
        if (flightDetail && flightDetail.dep && flightDetail.dep.depRmksText === rmksText) {
            void dispatch(flightDetailActions.showNotificationFlightRmksNoChange());
        }
        else {
            updateFlightRmks(rmksText, "DEP", closeRmksPopup);
        }
    };
    const updateFlightRmksArr = (rmksText, closeRmksPopup) => {
        const { content, flightDetailActions } = props;
        const { flightDetail } = content || { flightDetail: undefined };
        if (flightDetail && flightDetail.arr && flightDetail.arr.arrRmksText === rmksText) {
            void dispatch(flightDetailActions.showNotificationFlightRmksNoChange());
        }
        else {
            updateFlightRmks(rmksText, "ARR", closeRmksPopup);
        }
    };
    const changeTab = (tabName) => {
        const { content, selectTab, flightDetailActions, stationOperationTaskActions, flightChangeHistoryActions, flightSpecialCareActions, flightPaxFromListActions, flightPaxToListActions, flightBulletinBoardActions, isBbEditing, setBbEditing, } = props;
        const { flightKey } = content;
        const isReload = false;
        const onChangeTab = () => {
            dispatch(selectTab({ identifier: content.identifier, tabName }));
            switch (tabName) {
                case "Detail":
                    void dispatch(flightDetailActions.fetchFlightDetail({ flightKey, isReload }));
                    break;
                case "PaxFrom":
                    void dispatch(flightPaxFromListActions.fetchFlightPaxFrom({ flightKey, isReload }));
                    break;
                case "PaxTo":
                    void dispatch(flightPaxToListActions.fetchFlightPaxTo({ flightKey, isReload }));
                    break;
                case "B.B.":
                    void dispatch(flightBulletinBoardActions.fetchFlightThreadsAll({ flightKey, bbId: null, isReload }));
                    break;
                case "Care":
                    void dispatch(flightSpecialCareActions.fetchFlightSpecialCare({ flightKey, isReload }));
                    break;
                case "Task":
                    void dispatch(stationOperationTaskActions.fetchStationOperationTask({ flightKey, isReload }));
                    break;
                case "History":
                    void dispatch(flightChangeHistoryActions.fetchFlightChangeHistory({ flightKey, isReload }));
                    break;
                default:
            }
            handleFocus();
        };
        if (isBbEditing) {
            notifications_1.NotificationCreator.create({
                dispatch,
                message: soalaMessages_1.SoalaMessage.M40012C({
                    onYesButton: () => {
                        if (setBbEditing) {
                            setBbEditing(false);
                        }
                        onChangeTab();
                    },
                }),
            });
        }
        else {
            onChangeTab();
        }
    };
    const updateFlightRmks = (rmksText, rmksTypeCd, closeRmksPopup) => {
        const { flightDetailActions } = props;
        const { flightKey } = props.content;
        void dispatch(flightDetailActions.updateFlightRmks({ flightKey, rmksTypeCd, rmksText, closeRmksPopup }));
    };
    const { scrollContentRef, content, jobAuth, master, openDateTimeInputPopup, handleCloseModal, setBbEditing, isBbEditing, handleCloseAll, } = props;
    const { focusFlightModalAction } = props.flightModalsActions;
    const { showConfirmation, fetchFlightDetail } = props.flightDetailActions;
    const { fetchFlightThreadsAll, fetchFlightThreadsDetailless, fetchFlightThread, startThread } = props.flightBulletinBoardActions;
    const { updateStationOperationTask } = props.stationOperationTaskActions;
    const { closeBulletinBoardResponseModal } = props.bulletinBoardResponseEditorModalActions;
    const { identifier, currentTabName, isFetching, flightKey, flightDetail, bulletinBoard, stationOperationTask, flightSpecialCare, flightChangeHistory, flightPaxFrom, flightPaxTo, } = content;
    const tabInfo = exports.flightModalTabInfo.find((i) => i.name === currentTabName);
    if (!tabInfo) {
        return react_1.default.createElement(Container, null);
    }
    const { name: tabName, isReloadable, reloadButtonBottomHeight } = tabInfo;
    const tabs = exports.flightModalTabInfo
        .filter((item) => (0, commonUtil_1.funcAuthCheck)(item.funcId, jobAuth.jobAuth) &&
        (!content.flightKey.oalTblFlg || item.isOalValid) &&
        (content.connectDbCat === "O" || item.isPastDbValid))
        .map((item) => ({ name: item.name, enabled: true }));
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(Tab, { onClick: handleFocus },
            react_1.default.createElement(CommonSlideTab_1.default, { tabs: tabs, currentTabName: tabInfo.name, onClickTab: changeTab })),
        react_1.default.createElement(TabContent, null,
            tabName === "Detail" && flightDetail ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(FlightDetail_1.default, { flightDetail: flightDetail, flightKey: flightKey, jobAuth: jobAuth, master: master, isUtc: content.isUtc, connectDbCat: content.connectDbCat, scrollContentRef: scrollContentRef, scrollContentOnClick: handleFocus, fetchFlightDetail: fetchFlightDetail, updateFlightRmksDep: updateFlightRmksDep, updateFlightRmksArr: updateFlightRmksArr, showConfirmation: showConfirmation }),
                react_1.default.createElement(ModeButtonContainer, null,
                    react_1.default.createElement(RoundButtonMode_1.default, { isActiveColor: content.isUtc, onClick: handleUtc })))) : (react_1.default.createElement("div", null)),
            tabName === "PaxFrom" && content.connectDbCat === "O" && flightPaxFrom ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(FlightPaxFrom_1.default, { flightPaxFrom: flightPaxFrom, scrollContentRef: scrollContentRef, scrollContentOnClick: handleFocus }))) : (react_1.default.createElement("div", null)),
            tabName === "PaxTo" && content.connectDbCat === "O" && flightPaxTo ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(FlightPaxTo_1.default, { flightPaxTo: flightPaxTo, scrollContentRef: scrollContentRef, scrollContentOnClick: handleFocus }))) : (react_1.default.createElement("div", null)),
            tabName === "B.B." && bulletinBoard ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(FlightBulletinBoard_1.default, { flightKey: flightKey, bulletinBoard: bulletinBoard, fetchFlightThreadsAll: fetchFlightThreadsAll, fetchFlightThreadsDetailless: fetchFlightThreadsDetailless, fetchFlightThread: fetchFlightThread, startThread: startThread, jobAuth: jobAuth, closeBulletinBoardResponseModal: closeBulletinBoardResponseModal, isFetching: isFetching, onReload: handleReload, dispatch: dispatch, handleCloseModal: handleCloseModal, setBbEditing: setBbEditing, isBbEditing: isBbEditing, handleCloseAll: handleCloseAll }))) : (react_1.default.createElement("div", null)),
            tabName === "Care" && flightSpecialCare ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(FlightSpecialCare_1.default, { flightSpecialCare: flightSpecialCare, master: master, scrollContentRef: scrollContentRef, scrollContentOnClick: handleFocus }))) : (react_1.default.createElement("div", null)),
            tabName === "Task" && stationOperationTask ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(StationOperationTask_1.default, { workStepContentRef: scrollContentRef, flightKey: flightKey, stationOperationTask: stationOperationTask, updateStationOperationTask: updateStationOperationTask, activeModal: () => dispatch(focusFlightModalAction({ identifier })), openDateTimeInputPopup: openDateTimeInputPopup, authEnabled: (stationOperationTask.flight.lstDepApoCd === jobAuth.user.myApoCd || jobAuth.user.myApoCd === null) &&
                        (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateOperationTask, jobAuth.jobAuth), isOnline: content.connectDbCat === "O" }))) : (react_1.default.createElement("div", null)),
            tabName === "History" && flightChangeHistory ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(FlightChangeHistory_1.default, { flightChangeHistory: flightChangeHistory, scrollContentRef: scrollContentRef, scrollContentOnClick: handleFocus }))) : (react_1.default.createElement("div", null)),
            isReloadable && reloadButtonBottomHeight !== undefined && (react_1.default.createElement(ModalReloadButtonContainer, { bottomHeight: reloadButtonBottomHeight, tabName: tabName },
                react_1.default.createElement(RoundButtonReload_1.default, { isFetching: isFetching, disabled: false, onClick: handleReload }))))));
};
const Container = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Tab = styled_components_1.default.div ``;
const TabContent = styled_components_1.default.div `
  position: relative;
  flex: 1;
  /* ヘッダーを除いたモードレス高さ - 表示画面切り替え高さ */
  height: calc(100% - 36px);
`;
const ModeButtonContainer = styled_components_1.default.div `
  position: absolute;
  right: 10px;
  bottom: 125px;
  z-index: 1;
`;
const ModalReloadButtonContainer = styled_components_1.default.div `
  position: absolute;
  right: 10px;
  ${({ bottomHeight }) => (bottomHeight !== null ? `bottom: ${bottomHeight}px;` : "")};
  margin-top: ${({ tabName }) => (tabName === "Task" ? "-95px" : "-55px")};
  z-index: 1;
`;
exports.default = FlightContents;
//# sourceMappingURL=FlightContents.js.map