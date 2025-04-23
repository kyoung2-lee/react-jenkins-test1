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
const react_scrollbar_size_1 = __importDefault(require("react-scrollbar-size"));
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const dayjs_1 = __importDefault(require("dayjs"));
const react_modal_1 = __importDefault(require("react-modal"));
const react_virtualized_1 = require("react-virtualized");
const styled_components_1 = __importStar(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const webApi_1 = require("../../../lib/webApi");
const selector_1 = __importDefault(require("./selector"));
const notifications_1 = require("../../../lib/notifications");
const commonUtil_1 = require("../../../lib/commonUtil");
const commonConst_1 = require("../../../lib/commonConst");
const storage_1 = require("../../../lib/storage");
const icon_clock_skeleton_svg_1 = __importDefault(require("../../../assets/images/icon/icon-clock-skeleton.svg"));
const barChart_1 = require("../../../reducers/barChart");
const fisActions = __importStar(require("../../../reducers/fis"));
const fisFilterModal_1 = require("../../../reducers/fisFilterModal");
const flightModals_1 = require("../../../reducers/flightModals");
const flightContentsFlightDetail_1 = require("../../../reducers/flightContentsFlightDetail");
const flightListModals_1 = require("../../../reducers/flightListModals");
const barChartSearchActions = __importStar(require("../../../reducers/barChartSearch"));
const shipTransitListModals_1 = require("../../../reducers/shipTransitListModals");
const flightContentsStationOperationTask_1 = require("../../../reducers/flightContentsStationOperationTask");
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const BarChartHighlightOverlay_1 = __importDefault(require("../../molecules/BarCharts/BarChartHighlightOverlay"));
const BarChartSearch_1 = __importDefault(require("../../molecules/BarCharts/BarChartSearch"));
const ErrorPopup_1 = __importDefault(require("../../molecules/ErrorPopup"));
const BarChartGrid_1 = __importDefault(require("../../molecules/BarCharts/BarChartGrid"));
const BarChartCurrentTimeBorder_1 = __importDefault(require("../../molecules/BarCharts/BarChartCurrentTimeBorder"));
const BarChartTimeObjects_1 = __importDefault(require("../../molecules/BarCharts/BarChartTimeObjects"));
const SearchButton_1 = __importDefault(require("../../atoms/SearchButton"));
const layoutStyle_1 = __importDefault(require("../../../styles/layoutStyle"));
const icon_filter_svg_component_1 = __importDefault(require("../../../assets/images/icon/icon-filter.svg?component"));
const BarChartSpotRemarksTooltip_1 = __importDefault(require("../../atoms/BarChartSpotRemarksTooltip"));
const BarChartUpdateRmksPopup_1 = __importDefault(require("../../molecules/BarCharts/BarChartUpdateRmksPopup"));
const RoundButtonSpot_1 = __importDefault(require("../../atoms/RoundButtonSpot"));
const spotNumber_1 = require("../../../reducers/spotNumber");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const SpotFilterModal_1 = __importDefault(require("../../molecules/BarCharts/SpotFilterModal"));
const spotFilterModal_1 = require("../../../reducers/spotFilterModal");
const RadioButton_1 = require("../../atoms/RadioButton");
const icon_fis_select_target_popup_svg_1 = __importDefault(require("../../../assets/images/icon/icon-fis-select-target-popup.svg"));
const icon_scroll_left_svg_1 = __importDefault(require("../../../assets/images/icon/icon-scroll-left.svg"));
const CELL_HEIGHT = 92;
const LEFT_HEADER_CELL_WIDTH = 72;
const BarChart = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const scrollbarHeight = (0, react_scrollbar_size_1.default)().height;
    const fisRowsGroupBySpot = (0, hooks_1.useAppSelector)(selector_1.default);
    const barChart = (0, hooks_1.useAppSelector)((state) => state.barChart);
    const fis = (0, hooks_1.useAppSelector)((state) => state.fis);
    const isAutoReload = (0, hooks_1.useAppSelector)((state) => state.fis.headerSettings.isAutoReload);
    const barChartSearch = (0, hooks_1.useAppSelector)((state) => state.barChartSearch);
    const headerInfo = (0, hooks_1.useAppSelector)((state) => state.common.headerInfo);
    const jobAuth = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth);
    const zoomBarChart = (0, hooks_1.useAppSelector)((state) => state.account.zoomBarChart);
    const isSelfScroll = (0, hooks_1.useAppSelector)((state) => state.fis.headerSettings.isSelfScroll);
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const spotNumber = (0, hooks_1.useAppSelector)((state) => state.spotNumber);
    const flightModals = (0, hooks_1.useAppSelector)((state) => state.flightModals);
    const flightListModals = (0, hooks_1.useAppSelector)((state) => state.flightListModals);
    const [isTimeScaleModalActive, setIsTimeScaleModalActive] = (0, react_1.useState)(false);
    const [selectedTimeScale, setSelectedTimeScale] = (0, react_1.useState)(null);
    const [timeScale, setTimeScale] = (0, react_1.useState)(null);
    const [scrollToCurrentIsVisible, setScrollToCurrentIsVisible] = (0, react_1.useState)(false);
    const [stationOperationTaskEnabled, setStationOperationTaskEnabled] = (0, react_1.useState)((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOperationTask, jobAuth.jobAuth));
    const [flightDetailEnabled, setFlightDetailEnabled] = (0, react_1.useState)((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth));
    const [flightListEnabled, setFlightListEnabled] = (0, react_1.useState)((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openShipTransitList, jobAuth.jobAuth));
    const [roundButtonSpotEnabled, setRoundButtonSpotEnabled] = (0, react_1.useState)((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openSpotNo, jobAuth.jobAuth));
    const [scrollToColumnCurrent, setScrollToColumnCurrent] = (0, react_1.useState)(0);
    const [isScrollingToCurrent, setIsScrollingToCurrent] = (0, react_1.useState)(false);
    const [isActiveSpotTooltip, setIsActiveSpotTooltip] = (0, react_1.useState)(false);
    const [spotRemarksText, setSpotRemarksText] = (0, react_1.useState)("");
    const [spotRemarksLabelId, setSpotRemarksLabelId] = (0, react_1.useState)("");
    const [isActiveSpotRemarksModal, setIsActiveSpotRemarksModal] = (0, react_1.useState)(false);
    const [modalSpotNo, setModalSpotNo] = (0, react_1.useState)("");
    const [modalRemarks, setModalRemarks] = (0, react_1.useState)("");
    const leftSideGridRef = (0, react_1.useRef)(null);
    const mainGridRef = (0, react_1.useRef)(null);
    const gridForceUpdating = (0, react_1.useRef)(false);
    const scrollLeftRef = (0, react_1.useRef)(null);
    const columnWidth = (0, react_1.useRef)(0);
    const currentDatePosition = (0, react_1.useRef)(-1);
    const rightAreaWidth = (0, react_1.useRef)(0);
    const rowStartIndex = (0, react_1.useRef)(0);
    const rowStopIndex = (0, react_1.useRef)(0);
    const columnStartIndex = (0, react_1.useRef)(0);
    const columnStopIndex = (0, react_1.useRef)(0);
    const visibleRowsResult = (0, react_1.useRef)([]);
    const prevIsSpotChangeMode = (0, hooks_1.usePrevious)(barChart.isSpotChangeMode);
    const prevTimeLcl = (0, hooks_1.usePrevious)(fis.timeLcl);
    const prevJobAuth = (0, hooks_1.usePrevious)(jobAuth);
    (0, react_1.useEffect)(() => {
        void (async () => {
            await dispatch(fisActions.getFisHeaderInfo({
                apoCd: jobAuth.user.myApoCd,
                targetDate: "",
                isToday: true,
                beforeApoCd: "",
                beforeTargetDate: "",
                isReload: false,
            }));
            // 現在時刻に戻るボタンの表示制御に問題が出るためコメントアウト
            // scrollToCurrentTime(false);
        })();
        return () => {
            dispatch(fisActions.clear());
            // 画面が変わったら重なりの優先度を初期化する
            dispatch((0, barChart_1.resetFocusDupChart)());
            // 画面が変わったらSpotChangeModeを解除する
            dispatch((0, spotNumber_1.closeSpotNumberAll)());
            dispatch((0, barChart_1.updateSpotChangeMode)(false));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        if (isScrollingToCurrent) {
            setIsScrollingToCurrent(false);
        }
    }, [isScrollingToCurrent]);
    // 自動更新または日替わりの場合の自動スクロール処理
    (0, react_1.useEffect)(() => {
        /* headerのtargetDateはタイミングが違うので見ない */
        if (isAutoReload ||
            (!!prevTimeLcl && !!fis.timeLcl && (0, dayjs_1.default)(prevTimeLcl).format("YYYYMMDD") !== (0, dayjs_1.default)(fis.timeLcl).format("YYYYMMDD"))) {
            scrollToCurrentTime(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fis.timeLcl]);
    // FISの読み込み完了時
    (0, react_1.useEffect)(() => {
        if (!fis.isFetching && fis.isFetchSecceeded) {
            // バーチャートを更新する
            if (mainGridRef && mainGridRef.current) {
                gridForceUpdating.current = true;
                mainGridRef.current.forceUpdate();
            }
            // 自動スクロールの判断
            if (!fis.isReload) {
                scrollToCurrentTime(false);
            }
            // 0件のメッセージ
            if (!fis.timeLcl) {
                void dispatch((0, fisFilterModal_1.showInfoNoAirport)());
            }
            else if (fis.fisRows.isEmpty()) {
                void dispatch(barChartSearchActions.showInfoNoData());
            }
            // タイムスケールのデフォルトを設定
            if (fis.isApoHasChanged) {
                const defTimeScale = storage_1.storage.isPc ? (fis.targetArea === "JP" ? "4" : "8") : fis.targetArea === "JP" ? "2" : "4";
                setSelectedTimeScale(defTimeScale);
                setTimeScale(defTimeScale);
            }
            setScrollToCurrentVisible();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fis.isFetching]);
    // 自動更新時、バーチャートを更新
    (0, react_1.useEffect)(() => {
        if (isAutoReload) {
            updateBarchartComponent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fis.timeStamp, headerInfo.curfewTimeStartLcl, headerInfo.curfewTimeEndLcl]);
    // タグを選択された時、バーチャートを更新
    (0, react_1.useEffect)(() => {
        updateBarchartComponent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [barChart.focusArrDepCtrlSeq]);
    const updateBarchartComponent = () => {
        if (mainGridRef && mainGridRef.current) {
            gridForceUpdating.current = true;
            mainGridRef.current.forceUpdate();
        }
        setScrollToCurrentVisible();
    };
    // 自動更新の切り替え中に飛んできたPUSHデータを処理する
    (0, react_1.useEffect)(() => {
        if (isAutoReload) {
            fisActions.doQueueFunctionAll();
        }
    }, [isAutoReload]);
    // 権限更新
    (0, react_1.useEffect)(() => {
        if (!(0, lodash_isequal_1.default)(prevJobAuth, jobAuth)) {
            setStationOperationTaskEnabled((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOperationTask, jobAuth.jobAuth));
            setFlightDetailEnabled((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth));
            setFlightListEnabled((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openShipTransitList, jobAuth.jobAuth));
            setRoundButtonSpotEnabled((0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openSpotNo, jobAuth.jobAuth));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobAuth]);
    // 次回の便検索が同じ行・同じ列でもスクロールされるようにundefinedにしておく
    (0, react_1.useEffect)(() => {
        if (barChartSearch.scrollToRow !== undefined) {
            dispatch(barChartSearchActions.searchBarChartDefault());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [barChartSearch.scrollToRow]);
    const scrollToCurrentTime = (forceScroll) => {
        // targetDayDiff は、昨日: -1 本日: 0 翌日: 1となる。
        if (forceScroll || !(isAutoReload && isSelfScroll)) {
            setIsScrollingToCurrent(true);
        }
        if (fis.targetDayDiff >= -1 && fis.targetDayDiff <= 1) {
            const dayjsTimeLcl = (0, dayjs_1.default)(fis.timeLcl);
            const scrollToHour = dayjsTimeLcl.hour() + 24 + dayjsTimeLcl.minute() / 60;
            setScrollToColumnCurrent(scrollToHour);
        }
        else {
            setScrollToColumnCurrent(30); // 午前6時にスクロールする
        }
    };
    const handleScrollToCurrentTime = () => {
        scrollToCurrentTime(true);
    };
    const handleSearchButton = () => {
        dispatch(barChartSearchActions.toggleBarChartSearchDialog());
        dispatch(barChartSearchActions.clearSearchBarChart());
    };
    const handleScroll = (onScroll, scrollParams) => {
        scrollLeftRef.current = scrollParams.scrollLeft;
        onScroll(scrollParams);
        // スクロール時に行う動作があれば書く
        // 現在時刻に戻るボタンの表示条件
        setScrollToCurrentVisible();
    };
    const handleOnClickRoundButtonSpot = () => {
        if (barChart.isSpotChangeMode) {
            // SpotChangeMode OFF
            const closeModalAndOffSpotChangeMode = () => {
                dispatch((0, spotNumber_1.closeSpotNumberAll)());
                dispatch((0, barChart_1.updateSpotChangeMode)(false));
            };
            if (spotNumber.isOpen) {
                notifications_1.NotificationCreator.create({
                    dispatch,
                    message: soalaMessages_1.SoalaMessage.M40018C({
                        onYesButton: closeModalAndOffSpotChangeMode,
                    }),
                });
            }
            else {
                closeModalAndOffSpotChangeMode();
            }
        }
        else {
            // flightModals Open Check
            const isOpenFlightModal = flightModals.modals.some((flightModal) => flightModal.opened);
            // flightListModals Open Check
            const isOpenFlightListModal = flightListModals.modals.some((flightListModal) => flightListModal.opened);
            // SpotChangeMode ON
            if (isOpenFlightModal || isOpenFlightListModal) {
                notifications_1.NotificationCreator.create({
                    dispatch,
                    message: soalaMessages_1.SoalaMessage.M40018C({
                        onYesButton: closeModalAndOnSpotChangeMode,
                    }),
                });
            }
            else {
                dispatch((0, barChart_1.updateSpotChangeMode)(true));
            }
        }
    };
    const closeModalAndOnSpotChangeMode = () => {
        // flightModals Close
        flightModals.modals.forEach((flightModal) => {
            const { identifier } = flightModal;
            void dispatch((0, flightModals_1.closeFlightModal)({ identifier }));
        });
        // flightListModals Close
        flightListModals.modals.forEach((flightListModal) => {
            dispatch((0, flightListModals_1.closeFlightListModal)(flightListModal));
        });
        dispatch((0, barChart_1.updateSpotChangeMode)(true));
    };
    const setScrollToCurrentVisible = () => {
        // 現在時刻に戻るボタンの表示条件
        if (scrollLeftRef.current !== null) {
            const datePosition = scrollToColumnCurrent * columnWidth.current;
            const margin = timeScale === "8" ? -2 : timeScale === "4" ? -1 : -0.5;
            const returnPosition = datePosition + margin * columnWidth.current;
            const visible = !(scrollLeftRef.current > returnPosition - 30 && scrollLeftRef.current < returnPosition + 30);
            if (visible !== scrollToCurrentIsVisible) {
                // 無限ループ防止
                setScrollToCurrentIsVisible(visible);
            }
        }
    };
    const openTimeScaleModal = () => {
        setIsTimeScaleModalActive(true);
    };
    const closeTimeScaleModal = () => {
        setIsTimeScaleModalActive(false);
        setSelectedTimeScale(timeScale);
    };
    const openSpotRemarksTooltip = (remarks, newSpotRemarksLabelId) => {
        if (remarks && storage_1.storage.isPc) {
            setIsActiveSpotTooltip(true);
            setSpotRemarksText(remarks);
            setSpotRemarksLabelId(newSpotRemarksLabelId);
        }
    };
    const closeSpotRemarksTooltip = () => {
        if (isActiveSpotTooltip) {
            setIsActiveSpotTooltip(false);
            setSpotRemarksText("");
            setSpotRemarksLabelId("");
        }
    };
    const openSpotRemarksModal = async (spotNo) => {
        if (!(0, commonUtil_1.isCurrentPath)(commonConst_1.Const.PATH_NAME.barChart))
            return;
        // PCの場合、更新権限が無ければポップアップを開かない
        if (storage_1.storage.isPc && !isSpotRemarksSubmitEnabled)
            return;
        // 最新データをAPIから取得(async)
        try {
            const response = await webApi_1.WebApi.getSpotRemarks(dispatch, { apoCd: headerInfo.apoCd, spotNo });
            const targetSpotData = response.data.spotRmksList.find((v) => v.spotNo === spotNo);
            setIsActiveSpotRemarksModal(true);
            setModalSpotNo(targetSpotData ? targetSpotData.spotNo : spotNo);
            setModalRemarks(targetSpotData ? targetSpotData.spotRmks : "");
        }
        catch (err) {
            // 何もしない
        }
    };
    const closeSpotRemarksModal = () => {
        setIsActiveSpotRemarksModal(false);
        setModalSpotNo("");
        setModalRemarks("");
    };
    const isSpotRemarksSubmitEnabled = !!jobAuth.user.myApoCd &&
        jobAuth.user.myApoCd === common.headerInfo.apoCd &&
        (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateSpotRemarks, jobAuth.jobAuth);
    const updateSpotRemarksModal = (spotRmks) => {
        const { apoCd } = headerInfo;
        void dispatch((0, barChart_1.updateSpotRemarks)({ apoCd, spotNo: modalSpotNo, spotRmks, closeSpotRemarksModal }));
    };
    const selectTimeScale = (e) => {
        if (e.target.value) {
            setSelectedTimeScale(e.target.value);
        }
    };
    const submitTimeScale = (e) => {
        e.preventDefault();
        const { apoCd, targetDate, isToday } = headerInfo;
        if (fis.headerSettings.isAutoReload) {
            void dispatch(fisActions.getFisHeaderInfoAuto({ apoCd, isAddingAuto: false }));
        }
        else {
            void dispatch(fisActions.getFisHeaderInfo({
                apoCd,
                targetDate,
                isToday,
                beforeApoCd: apoCd,
                beforeTargetDate: targetDate,
                isReload: false,
            }));
        }
        setTimeScale(selectedTimeScale);
        setIsTimeScaleModalActive(false);
        scrollToCurrentTime(false);
    };
    const leftSideHeaderCellRenderer = ({ key, style }) => (react_1.default.createElement(LeftSideHeaderCell, { key: `${key}-lshc`, style: style, isPc: storage_1.storage.isPc, onClick: openTimeScaleModal }, timeScale ? (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(HeaderClockIcon, null),
        `${timeScale}h`,
        react_1.default.createElement(SelectAirPortIcon, null))) : ("")));
    const leftSideCellRenderer = ({ key, rowIndex, style }) => {
        const keyName = fisRowsGroupBySpot.sortedSpots[rowIndex].spotNo || "XXX";
        const remarksText = fisRowsGroupBySpot.sortedSpots[rowIndex].spotRmks;
        return (react_1.default.createElement(LeftSideCell, { key: `${key}-lsc`, style: style, spotRemarksDisabled: storage_1.storage.isPc && !isSpotRemarksSubmitEnabled, onMouseOver: () => openSpotRemarksTooltip(remarksText, `cellremarks-${rowIndex}`), onMouseLeave: closeSpotRemarksTooltip, onClick: () => {
                void openSpotRemarksModal(fisRowsGroupBySpot.sortedSpots[rowIndex].spotNo);
            } },
            react_1.default.createElement("div", null, keyName),
            react_1.default.createElement(LeftSideCellRemarks, { id: `cellremarks-${rowIndex}` }, remarksText || "")));
    };
    const headDateRenderer = ({ columnIndex, key, style }) => (react_1.default.createElement(HeaderCell, { key: `${key}-hd`, style: style, isPc: storage_1.storage.isPc },
        react_1.default.createElement(HeaderDate, null, columnIndex >= 0 && columnIndex <= 2 ? fisRowsGroupBySpot.info.headerDateLabel[columnIndex] : "")));
    const headCellRenderer = ({ columnIndex, key, style }) => (react_1.default.createElement(HeaderCell, { key: `${key}-hc`, style: style, isPc: storage_1.storage.isPc },
        react_1.default.createElement(HeaderCellHour, null, `0${columnIndex % 24}:00`.slice(-5))));
    const handleOpenSpotFilterModal = () => {
        if (fisRowsGroupBySpot.noFisData) {
            return;
        }
        const { spotNoList } = fisRowsGroupBySpot;
        dispatch((0, spotFilterModal_1.openSpotFilterModal)({ spotNoList }));
    };
    // 表示領域にあるチャートのみ抽出する
    const getVisibleRows = (visibleRowStartIndex, visibleRowStopIndex, _scrollLeft, visibleWidth, cellWidth) => {
        const newColumnStartIndex = Math.floor(_scrollLeft / cellWidth);
        const newColumnStopIndex = Math.ceil((_scrollLeft + visibleWidth) / cellWidth) - 1;
        if (!gridForceUpdating.current /* ForceUpdate時は処理を行う */ &&
            !fis.headerSettings.isAutoReload /* 自動更新時は処理を行う */ &&
            rowStartIndex.current === visibleRowStartIndex &&
            rowStopIndex.current === visibleRowStopIndex &&
            columnStartIndex.current === newColumnStartIndex &&
            columnStopIndex.current === newColumnStopIndex) {
            return visibleRowsResult.current;
        }
        gridForceUpdating.current = false;
        columnStartIndex.current = newColumnStartIndex;
        columnStopIndex.current = newColumnStopIndex;
        rowStartIndex.current = visibleRowStartIndex;
        rowStopIndex.current = visibleRowStopIndex;
        const visibleSpots = fisRowsGroupBySpot.sortedSpots.slice(visibleRowStartIndex, visibleRowStopIndex + 1);
        const wVisibleRows = visibleSpots.reduce((visibleRows, { spotNo: currentSpot }) => {
            const rowIndex = fisRowsGroupBySpot.sortedSpots.findIndex((v) => v.spotNo === currentSpot);
            const extFisRows = fisRowsGroupBySpot.groupedfisRowsBySpot[currentSpot]
                ? fisRowsGroupBySpot.groupedfisRowsBySpot[currentSpot].filter((schedule) => schedule.columnStartIndex - 1 <= newColumnStopIndex &&
                    schedule.columnStopIndex + 1 >= newColumnStartIndex /* 少し余分に読み込むため±１行う */)
                : [];
            return [...visibleRows, { extFisRows, rowIndex }];
        }, []);
        visibleRowsResult.current = wVisibleRows;
        return visibleRowsResult.current;
    };
    const cellRangeRenderer = (gridCellRangePropsps) => {
        const children = (0, react_virtualized_1.defaultCellRangeRenderer)(gridCellRangePropsps);
        const { start: visibleRowStartIndex, stop: visibleRowStopIndex } = gridCellRangePropsps.visibleRowIndices;
        children.push(
        // 時間区切り線、Curfew
        react_1.default.createElement(BarChartTimeObjects_1.default, { key: "timeBorder", cellWidth: columnWidth.current, columnsCount: 72, curfewTimeStartLcl: headerInfo.curfewTimeStartLcl, curfewTimeEndLcl: headerInfo.curfewTimeEndLcl }));
        children.push(react_1.default.createElement(BarChartGrid_1.default, { key: "bargrid", fis: fis, barChart: barChart, groupedFisRowsWithIndex: getVisibleRows(visibleRowStartIndex, visibleRowStopIndex, scrollLeftRef.current || 0, rightAreaWidth.current, columnWidth.current), cellHeight: CELL_HEIGHT, cellWidth: columnWidth.current, openFlightModal: flightModals_1.openFlightModal, openShipTransitListModal: shipTransitListModals_1.openShipTransitListModal, openFlightListModal: flightListModals_1.openFlightListModal, getFlightList: flightListModals_1.getFlightList, fetchFlightDetail: flightContentsFlightDetail_1.fetchFlightDetail, fetchStationOperationTask: flightContentsStationOperationTask_1.fetchStationOperationTask, focusDupChart: barChart_1.focusDupChart, stationOperationTaskEnabled: stationOperationTaskEnabled, flightDetailEnabled: flightDetailEnabled, flightListEnabled: flightListEnabled, isSpotChangeMode: barChart.isSpotChangeMode, openSpotNumberChild: spotNumber_1.openSpotNumberChild, closeSpotNumberChild: spotNumber_1.closeSpotNumberChild, spotNumber: spotNumber }));
        children.push(
        // 当日日付線
        react_1.default.createElement(BarChartCurrentTimeBorder_1.default, { key: "currentTimeBorder", position: currentDatePosition.current }));
        children.push(react_1.default.createElement(BarChartHighlightOverlay_1.default, { key: "overlay", cellWidth: columnWidth.current, cellHeight: CELL_HEIGHT, fisRowsGroupBySpot: fisRowsGroupBySpot, barChartSearch: barChartSearch }));
        return children;
    };
    const cellRenderer = ({ key, style }) => react_1.default.createElement(MainCell, { key: `${key}-c`, style: style });
    const { scrollToRow, scrollToColumn, filterlingRowColumns } = barChartSearch;
    const filterling = filterlingRowColumns.length !== 0;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(BarChartSearch_1.default, { appDispatch: dispatch, barChartSearch: barChartSearch, fisPullTimeStamp: fis.pullTimeStamp, fisRowsGroupBySpot: fisRowsGroupBySpot, timeScale: timeScale }),
        react_1.default.createElement(HeaderSpotChangeMode, { isSpotChangeMode: barChart.isSpotChangeMode, prevIsSpotChangeMode: prevIsSpotChangeMode || false }, "SPOT Change Mode"),
        react_1.default.createElement(Wrapper, { zoom: zoomBarChart },
            react_1.default.createElement(HeaderBackground, null),
            react_1.default.createElement(react_virtualized_1.ScrollSync, null, ({ onScroll, scrollLeft, scrollTop }) => (react_1.default.createElement(react_virtualized_1.AutoSizer, null, ({ width, height }) => {
                rightAreaWidth.current = width - LEFT_HEADER_CELL_WIDTH;
                columnWidth.current = timeScale ? rightAreaWidth.current / ((Number(timeScale) * 100) / zoomBarChart) : 0;
                // 当日日付線の位置を計算
                // targetDayDiff: -1 昨日, 0 当日, 1 翌日
                let newCurrentDatePosition = -1;
                if (fis.targetDayDiff >= -1 && fis.targetDayDiff <= 1) {
                    newCurrentDatePosition =
                        ((fis.targetDayDiff + 1) * 24 + fisRowsGroupBySpot.info.timeLclHours + fisRowsGroupBySpot.info.timeLclMinutes / 60) *
                            columnWidth.current;
                }
                currentDatePosition.current = newCurrentDatePosition;
                // X軸のスクロール位置を設定
                let scrollLeftWork = scrollLeft;
                if (isScrollingToCurrent) {
                    const margin = timeScale === "8" ? -2 : timeScale === "4" ? -1 : -0.5;
                    scrollLeftWork = newCurrentDatePosition + margin * columnWidth.current;
                }
                else if (scrollToColumn !== undefined) {
                    const margin = timeScale === "8" ? -1 : timeScale === "4" ? -0.5 : 0.25;
                    scrollLeftWork = (scrollToColumn + margin) * columnWidth.current;
                }
                const currentTimeBallLeft = LEFT_HEADER_CELL_WIDTH + newCurrentDatePosition - scrollLeftWork;
                return (react_1.default.createElement(GridWrapper, { ref: leftSideGridRef },
                    react_1.default.createElement(LeftSideHeaderCellWrapper, null,
                        storage_1.storage.isPc && (react_1.default.createElement(BarChartSpotRemarksTooltip_1.default, { isActiveSpotTooltip: isActiveSpotTooltip, remarks: spotRemarksText, remarksLabelId: spotRemarksLabelId, leftSideGridRef: leftSideGridRef })),
                        !!fis.apoCd && (react_1.default.createElement(react_virtualized_1.Grid, { cellRenderer: leftSideHeaderCellRenderer, rowHeight: 40, columnWidth: LEFT_HEADER_CELL_WIDTH, width: LEFT_HEADER_CELL_WIDTH, height: 40, rowCount: 1, columnCount: 1, timeScale: timeScale }))),
                    react_1.default.createElement(LeftSideHeaderWrapper, { isFilterling: filterling },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(SpotFilterIconDiv, { onClick: handleOpenSpotFilterModal, filtering: fisRowsGroupBySpot.filteringSpotNo, disabled: fisRowsGroupBySpot.noFisData, isFilterling: filterling },
                                react_1.default.createElement(icon_filter_svg_component_1.default, null),
                                react_1.default.createElement(SpotFilterLabel, { isFilterling: filterling }, "Filter")),
                            react_1.default.createElement(SpotFilterBottomSpace, null),
                            react_1.default.createElement(react_virtualized_1.Grid, { cellRenderer: leftSideCellRenderer, columnWidth: LEFT_HEADER_CELL_WIDTH, columnCount: 1, height: height - scrollbarHeight - 40, rowHeight: CELL_HEIGHT, rowCount: fisRowsGroupBySpot.sortedSpots.length, scrollTop: scrollTop, width: LEFT_HEADER_CELL_WIDTH, style: { overflowY: "hidden", paddingBottom: scrollbarHeight } }))),
                    react_1.default.createElement(RightSideWrapper, null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(HeaderCellWrapper, { width: width }, !!fis.apoCd && (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(react_virtualized_1.Grid, { cellRenderer: headDateRenderer, columnCount: 3, columnWidth: columnWidth.current * 24, rowCount: 1, rowHeight: 20, width: rightAreaWidth.current, height: 20, scrollLeft: scrollLeftWork, overscanColumnCount: 0 }),
                                react_1.default.createElement(react_virtualized_1.Grid, { cellRenderer: headCellRenderer, columnCount: 72, columnWidth: columnWidth.current, rowCount: 1, rowHeight: 20, width: rightAreaWidth.current, height: 20, scrollLeft: scrollLeftWork, overscanColumnCount: 0 })))),
                            react_1.default.createElement(MainCellWrapper, null, !!fis.apoCd && (react_1.default.createElement(react_virtualized_1.Grid, { ref: mainGridRef, onScroll: (params) => handleScroll(onScroll, params), cellRenderer: cellRenderer, cellRangeRenderer: cellRangeRenderer, columnCount: 1, columnWidth: columnWidth.current * 72, rowCount: fisRowsGroupBySpot.sortedSpots.length, rowHeight: CELL_HEIGHT, width: rightAreaWidth.current, height: height - scrollbarHeight - 40, scrollToRow: scrollToRow, scrollToAlignment: filterling ? "auto" : "start", scrollLeft: scrollLeftWork, 
                                // overscanIndicesGetter={overscanIndicesGetter}
                                overscanColumnCount: 0 }))),
                            currentDatePosition.current - scrollLeftWork > 0 &&
                                currentTimeBallLeft < window.innerWidth - CURRENT_TIME_BALL_WIDTH / 2 && (react_1.default.createElement(CurrentTimeBall, { left: currentTimeBallLeft }))))));
            }))),
            react_1.default.createElement(react_modal_1.default, { isOpen: isTimeScaleModalActive, onRequestClose: closeTimeScaleModal, style: customModalStyles },
                react_1.default.createElement(TimeScaleWrapper, null,
                    react_1.default.createElement(TimeScaleTitle, null, "Time Scale"),
                    react_1.default.createElement(TimeScaleRadioButtons, null,
                        !storage_1.storage.isPc && (react_1.default.createElement(RadioButtonWrapper, null,
                            react_1.default.createElement(RadioButton_1.RadioButtonStyled, { isShadowOnFocus: true, id: "2h", value: "2", type: "radio", onChange: selectTimeScale, checked: selectedTimeScale === "2" }),
                            react_1.default.createElement("label", { htmlFor: "2h" }, "2h"))),
                        react_1.default.createElement(RadioButtonWrapper, null,
                            react_1.default.createElement(RadioButton_1.RadioButtonStyled, { isShadowOnFocus: true, id: "4h", value: "4", type: "radio", onChange: selectTimeScale, checked: selectedTimeScale === "4" }),
                            react_1.default.createElement("label", { htmlFor: "4h" }, "4h")),
                        storage_1.storage.isPc && (react_1.default.createElement(RadioButtonWrapper, null,
                            react_1.default.createElement(RadioButton_1.RadioButtonStyled, { isShadowOnFocus: true, id: "8h", value: "8", type: "radio", onChange: selectTimeScale, checked: selectedTimeScale === "8" }),
                            react_1.default.createElement("label", { htmlFor: "8h" }, "8h")))),
                    react_1.default.createElement(SubmitWrapper, { isPc: storage_1.storage.isPc },
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Search", onClick: submitTimeScale })))),
            react_1.default.createElement(SpotFilterModal_1.default, null),
            react_1.default.createElement(BarChartUpdateRmksPopup_1.default, { isOpen: isActiveSpotRemarksModal, left: 90, initialSpotNo: modalSpotNo, initialRmksText: modalRemarks, isSubmitable: isSpotRemarksSubmitEnabled, placeholder: "SPOT Remarks", onClose: closeSpotRemarksModal, update: updateSpotRemarksModal, dispatch: dispatch }),
            react_1.default.createElement(ButtonArea, { zoom: zoomBarChart },
                roundButtonSpotEnabled && (react_1.default.createElement(RoundButtonSpotContainer, null,
                    react_1.default.createElement(RoundButtonSpot_1.default, { isActiveColor: barChart.isSpotChangeMode, onClick: handleOnClickRoundButtonSpot }))),
                react_1.default.createElement(SearchButtonContainer, null,
                    react_1.default.createElement(SearchButton_1.default, { isFiltered: filterling, onClick: handleSearchButton })),
                react_1.default.createElement(InitialPositionButtonContainer, null, scrollToCurrentIsVisible ? react_1.default.createElement(InitialPositionButton, { onClick: handleScrollToCurrentTime }) : null)),
            fis.fetchFisResult.retry ? (react_1.default.createElement(ErrorPopup_1.default, { dispatch: dispatch, isError: fis.fetchFisResult.isError, retry: fis.fetchFisResult.retry })) : undefined)));
};
// @see https://github.com/bvaughn/react-virtualized/blob/master/docs/Grid.md#overscanindicesgetter
// function overscanIndicesGetter({
//   cellCount, // Number of rows or columns in the current axis
//   overscanCellsCount, // Maximum number of cells to over-render in either direction
//   startIndex, // Begin of range of visible cells
//   stopIndex, // End of range of visible cells
// }: OverscanIndicesGetterParams) {
//   return {
//     overscanStartIndex: Math.max(0, startIndex - overscanCellsCount - 2),
//     overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount + 1),
//   };
// }
const COMMON_SUB_HEADER_HEIGHT = "47px";
const customModalStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        position: "absolute",
        width: "207px",
        height: "152px",
        padding: "9px 12px",
        top: `calc(40px + ${storage_1.storage.isPc ? layoutStyle_1.default.header.default : `${COMMON_SUB_HEADER_HEIGHT} + ${layoutStyle_1.default.header.tablet}`})`,
        left: "10px",
        right: "unset",
        bottom: "unset",
        margin: "auto",
        borderRadius: "1px",
        border: "1px solid rgb(204, 204, 204)",
        background: "#fff",
        overflow: "auto",
        outline: "none",
    },
};
const Wrapper = styled_components_1.default.div `
  zoom: ${({ zoom }) => zoom / 100};
  width: 100%;
  height: 100%;
  position: relative;
`;
const HeaderBackground = styled_components_1.default.div `
  position: absolute;
  width: 100%;
  top: -1px; /* iPadでメインヘッダーとの間に細い白線が出ることがあるのでその差を埋める */
  height: 41px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
`;
const GridWrapper = styled_components_1.default.div `
  position: relative;
`;
const LeftSideHeaderCellWrapper = styled_components_1.default.div `
  position: absolute;
  text-align: center;
`;
const LeftSideHeaderWrapper = styled_components_1.default.div `
  position: absolute;
  top: 40px;
  text-align: center;
  line-height: 92px;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  .ReactVirtualized__Grid__innerScrollContainer {
    min-height: 100% !important;
    max-height: auto !important;
    ${(props) => props.isFilterling
    ? (0, styled_components_1.css) `
            &:after {
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              background: rgba(0, 0, 0, 0.5);
              z-index: 2;
            }
          `
    : ""};
  }
`;
const RightSideWrapper = styled_components_1.default.div `
  position: relative;
`;
const HeaderCellWrapper = styled_components_1.default.div `
  width: ${(props) => props.width - LEFT_HEADER_CELL_WIDTH}px;
  position: relative;
  left: ${LEFT_HEADER_CELL_WIDTH}px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;

  .ReactVirtualized__Grid {
    overflow-x: hidden !important;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .ReactVirtualized__Grid__innerScrollContainer {
    overflow: visible !important; /* 日付のStickyを効かせるため */
  }
`;
const MainCellWrapper = styled_components_1.default.div `
  position: relative;
  left: ${LEFT_HEADER_CELL_WIDTH}px;
  .ReactVirtualized__Grid__innerScrollContainer {
    min-height: 100% !important;
    max-height: auto !important;
  }
`;
const HeaderCell = styled_components_1.default.div `
  color: #fff;
  font-weight: 100;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
`;
const HeaderDate = styled_components_1.default.div `
  font-size: 16px;
  font-weight: bold;
  color: #eded88;
  text-align: left;
  margin-right: 3px;
  position: sticky;
  left: 0;
`;
const HeaderCellHour = styled_components_1.default.div `
  padding-bottom: 2px;
  font-size: 14px;
`;
const MainCell = styled_components_1.default.div `
  &:nth-child(odd) {
    background: #f6f6f6;
  }
  &:nth-child(even) {
    background: #eeeeee;
  }
`;
const LeftSideCell = styled_components_1.default.div `
  ${({ spotRemarksDisabled }) => (spotRemarksDisabled ? "cursor: default;" : "cursor: pointer;")}
  font-size: 20px;
  &:nth-child(odd) {
    background: #f6f6f6;
  }
  &:nth-child(even) {
    background: #eeeeee;
  }
`;
const LeftSideCellRemarks = styled_components_1.default.div `
  position: absolute;
  top: 55px;
  font-size: 12px;
  line-height: 40px;
  height: 40px;
  width: 55px;
  left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const SpotFilterIconDiv = styled_components_1.default.div `
  z-index: 1;
  position: absolute;
  width: 72px;
  height: 30px;
  text-align: left;
  ${({ isFilterling, disabled }) => (isFilterling ? "pointer-events: none;" : disabled ? "opacity: 0.6" : "cursor: pointer")};

  > svg {
    position: absolute;
  }

  .inside {
    ${({ isFilterling, filtering, disabled }) => isFilterling ? (filtering && !disabled ? "fill: #735a11;" : "fill: #1a3040;") : filtering && !disabled ? "fill: #E6B422;" : ""};
  }
  .outside {
    ${({ isFilterling }) => (isFilterling ? "fill: #7f7f7f;" : "")};
  }
`;
const SpotFilterLabel = styled_components_1.default.div `
  ${({ isFilterling }) => (isFilterling ? "color: #7f7f7f" : "color: #FFFFFF")};
  font-size: 12px;
  position: absolute;
  width: 72px;
  height: 25.5px;
  text-align: center;
  line-height: 1.8;
`;
const SpotFilterBottomSpace = styled_components_1.default.div `
  /* フィルターボタンの真下に置いてクリック不可の領域を作る */
  position: absolute;
  top: 30px;
  width: 72px;
  height: 6px;
  z-index: 1;
`;
const LeftSideHeaderCell = styled_components_1.default.div `
  cursor: pointer;
  border-bottom: none;
  padding-bottom: 2px;
  border-right: none;
  color: #fff;
  ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 20px;
`;
const SelectAirPortIcon = styled_components_1.default.img.attrs({ src: icon_fis_select_target_popup_svg_1.default }) `
  cursor: pointer;
  width: 19px;
  height: 13px;
  margin-bottom: 5px;
`;
const TimeScaleWrapper = styled_components_1.default.form `
  display: flex;
  flex-direction: column;
`;
const TimeScaleTitle = styled_components_1.default.div `
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 19px;
`;
const TimeScaleRadioButtons = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 20px;
`;
const RadioButtonWrapper = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const SubmitWrapper = styled_components_1.default.div `
  width: 100px;
  align-self: center;
  button {
    ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
  }
`;
const CURRENT_TIME_BALL_WIDTH = 9;
const CurrentTimeBall = styled_components_1.default.div `
  position: absolute;
  top: 35px;
  z-index: 1;
  left: ${({ left }) => left}px;

  &:after {
    content: " ";
    width: ${CURRENT_TIME_BALL_WIDTH}px;
    height: 9px;
    border-radius: 50%;
    background-color: #b8261f;
    position: absolute;
    left: -4px;
  }
`;
const ButtonArea = styled_components_1.default.div `
  zoom: ${({ zoom }) => 100 / zoom};
`;
const RoundButtonSpotContainer = styled_components_1.default.div `
  position: fixed;
  right: 44px;
  bottom: 196px;
`;
const SearchButtonContainer = styled_components_1.default.div `
  position: fixed;
  right: 44px;
  bottom: 120px;
`;
const InitialPositionButtonContainer = styled_components_1.default.div `
  position: fixed;
  right: 44px;
  bottom: 44px;
`;
const InitialPositionButton = styled_components_1.default.img.attrs({ src: icon_scroll_left_svg_1.default }) `
  height: 60px;
  width: 60px;
  border-radius: 30px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.33);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const HeaderSpotChangeMode = styled_components_1.default.div `
  width: 100%;
  ${({ isSpotChangeMode, prevIsSpotChangeMode }) => !isSpotChangeMode && !prevIsSpotChangeMode
    ? (0, styled_components_1.css) `
          visibility: hidden;
          height: 0px;
        `
    : isSpotChangeMode
        ? (0, styled_components_1.css) `
          animation: ${showHeaderContentFromLong()} 0.3s;
          height: 20px;
        `
        : (0, styled_components_1.css) `
          animation: ${showHeaderContentFromHide()} 0.3s;
          height: 0px;
        `}
  background: #EA6512;
  font-size: 12px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const HeaderClockIcon = styled_components_1.default.img.attrs({ src: icon_clock_skeleton_svg_1.default }) `
  height: 13px;
  width: 15px;
  margin-right: 2px;
  margin-bottom: 5px;
`;
const showHeaderContentFromLong = () => (0, styled_components_1.keyframes) `
  0% { height: 0px; }
  100% { height: 20px; }
`;
const showHeaderContentFromHide = () => (0, styled_components_1.keyframes) `
  0% { height: 20px; }
  100% { height: 0px; }
`;
exports.default = BarChart;
//# sourceMappingURL=BarChart.js.map