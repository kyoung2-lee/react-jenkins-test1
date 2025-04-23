import React, { useState, useEffect, useRef } from "react";
import useScrollbarSize from "react-scrollbar-size";
import isEqual from "lodash.isequal";
import dayjs from "dayjs";
import Modal from "react-modal";
import {
  AutoSizer,
  Grid,
  defaultCellRangeRenderer,
  GridCellRangeProps,
  GridCellProps,
  //  OverscanIndicesGetterParams,
  ScrollParams,
  ScrollSync,
} from "react-virtualized";
import styled, { keyframes, css } from "styled-components";

import { useAppDispatch, useAppSelector, usePrevious } from "../../../store/hooks";
import { WebApi } from "../../../lib/webApi";
import fisRowsGroupBySpotSelector, { ExtFisRow } from "./selector";
import { NotificationCreator } from "../../../lib/notifications";
import { funcAuthCheck, isCurrentPath } from "../../../lib/commonUtil";
import { Const } from "../../../lib/commonConst";
import { storage } from "../../../lib/storage";
import headerClockIconSvg from "../../../assets/images/icon/icon-clock-skeleton.svg";
import { focusDupChart, resetFocusDupChart, updateSpotRemarks, updateSpotChangeMode } from "../../../reducers/barChart";
import * as fisActions from "../../../reducers/fis";
import { showInfoNoAirport } from "../../../reducers/fisFilterModal";
import { openFlightModal, closeFlightModal } from "../../../reducers/flightModals";
import { fetchFlightDetail } from "../../../reducers/flightContentsFlightDetail";
import { getFlightList, openFlightListModal, closeFlightListModal } from "../../../reducers/flightListModals";
import * as barChartSearchActions from "../../../reducers/barChartSearch";
import { openShipTransitListModal } from "../../../reducers/shipTransitListModals";
import { fetchStationOperationTask } from "../../../reducers/flightContentsStationOperationTask";
import PrimaryButton from "../../atoms/PrimaryButton";
import BarChartHighlightOverlay from "../../molecules/BarCharts/BarChartHighlightOverlay";
import BarChartSearch from "../../molecules/BarCharts/BarChartSearch";
import ErrorPopup from "../../molecules/ErrorPopup";
import BarChartGrid from "../../molecules/BarCharts/BarChartGrid";
import BarChartCurrentTimeBorder from "../../molecules/BarCharts/BarChartCurrentTimeBorder";
import BarChartTimeObjects from "../../molecules/BarCharts/BarChartTimeObjects";
import SearchButton from "../../atoms/SearchButton";
import layoutStyle from "../../../styles/layoutStyle";
import SpotFilterIcon from "../../../assets/images/icon/icon-filter.svg?component";
import BarChartSpotRemarksTooltip from "../../atoms/BarChartSpotRemarksTooltip";
import BarChartUpdateRmksPopup from "../../molecules/BarCharts/BarChartUpdateRmksPopup";
import RoundButtonSpot from "../../atoms/RoundButtonSpot";
import { openSpotNumberChild, closeSpotNumberChild, closeSpotNumberAll } from "../../../reducers/spotNumber";
import { SoalaMessage } from "../../../lib/soalaMessages";
import SpotFilterModal from "../../molecules/BarCharts/SpotFilterModal";
import { openSpotFilterModal } from "../../../reducers/spotFilterModal";
import { RadioButtonStyled } from "../../atoms/RadioButton";

import iconFisSelectTargetPopupSvg from "../../../assets/images/icon/icon-fis-select-target-popup.svg";
import iconScrollLeftSvg from "../../../assets/images/icon/icon-scroll-left.svg";

const CELL_HEIGHT = 92;
const LEFT_HEADER_CELL_WIDTH = 72;

const BarChart: React.FC = () => {
  const dispatch = useAppDispatch();
  const scrollbarHeight = useScrollbarSize().height;

  const fisRowsGroupBySpot = useAppSelector(fisRowsGroupBySpotSelector);
  const barChart = useAppSelector((state) => state.barChart);
  const fis = useAppSelector((state) => state.fis);
  const isAutoReload = useAppSelector((state) => state.fis.headerSettings.isAutoReload);
  const barChartSearch = useAppSelector((state) => state.barChartSearch);
  const headerInfo = useAppSelector((state) => state.common.headerInfo);
  const jobAuth = useAppSelector((state) => state.account.jobAuth);
  const zoomBarChart = useAppSelector((state) => state.account.zoomBarChart);
  const isSelfScroll = useAppSelector((state) => state.fis.headerSettings.isSelfScroll);
  const common = useAppSelector((state) => state.common);
  const spotNumber = useAppSelector((state) => state.spotNumber);
  const flightModals = useAppSelector((state) => state.flightModals);
  const flightListModals = useAppSelector((state) => state.flightListModals);

  const [isTimeScaleModalActive, setIsTimeScaleModalActive] = useState(false);
  const [selectedTimeScale, setSelectedTimeScale] = useState<"2" | "4" | "8" | null>(null);
  const [timeScale, setTimeScale] = useState<"2" | "4" | "8" | null>(null);
  const [scrollToCurrentIsVisible, setScrollToCurrentIsVisible] = useState(false);
  const [stationOperationTaskEnabled, setStationOperationTaskEnabled] = useState(
    funcAuthCheck(Const.FUNC_ID.openOperationTask, jobAuth.jobAuth)
  );
  const [flightDetailEnabled, setFlightDetailEnabled] = useState(funcAuthCheck(Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth));
  const [flightListEnabled, setFlightListEnabled] = useState(funcAuthCheck(Const.FUNC_ID.openShipTransitList, jobAuth.jobAuth));
  const [roundButtonSpotEnabled, setRoundButtonSpotEnabled] = useState(funcAuthCheck(Const.FUNC_ID.openSpotNo, jobAuth.jobAuth));
  const [scrollToColumnCurrent, setScrollToColumnCurrent] = useState(0);
  const [isScrollingToCurrent, setIsScrollingToCurrent] = useState(false);
  const [isActiveSpotTooltip, setIsActiveSpotTooltip] = useState(false);
  const [spotRemarksText, setSpotRemarksText] = useState("");
  const [spotRemarksLabelId, setSpotRemarksLabelId] = useState("");
  const [isActiveSpotRemarksModal, setIsActiveSpotRemarksModal] = useState(false);
  const [modalSpotNo, setModalSpotNo] = useState("");
  const [modalRemarks, setModalRemarks] = useState("");

  const leftSideGridRef = useRef<HTMLInputElement>(null);
  const mainGridRef = useRef<Grid | null>(null);
  const gridForceUpdating = useRef<boolean>(false);
  const scrollLeftRef = useRef<number | null>(null);
  const columnWidth = useRef(0);
  const currentDatePosition = useRef(-1);
  const rightAreaWidth = useRef(0);
  const rowStartIndex = useRef(0);
  const rowStopIndex = useRef(0);
  const columnStartIndex = useRef(0);
  const columnStopIndex = useRef(0);
  const visibleRowsResult = useRef<{ extFisRows: ExtFisRow[]; rowIndex: number }[]>([]);

  const prevIsSpotChangeMode = usePrevious(barChart.isSpotChangeMode);
  const prevTimeLcl = usePrevious(fis.timeLcl);
  const prevJobAuth = usePrevious(jobAuth);

  useEffect(() => {
    void (async () => {
      await dispatch(
        fisActions.getFisHeaderInfo({
          apoCd: jobAuth.user.myApoCd,
          targetDate: "",
          isToday: true,
          beforeApoCd: "",
          beforeTargetDate: "",
          isReload: false,
        })
      );
      // 現在時刻に戻るボタンの表示制御に問題が出るためコメントアウト
      // scrollToCurrentTime(false);
    })();

    return () => {
      dispatch(fisActions.clear());
      // 画面が変わったら重なりの優先度を初期化する
      dispatch(resetFocusDupChart());
      // 画面が変わったらSpotChangeModeを解除する
      dispatch(closeSpotNumberAll());
      dispatch(updateSpotChangeMode(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isScrollingToCurrent) {
      setIsScrollingToCurrent(false);
    }
  }, [isScrollingToCurrent]);

  // 自動更新または日替わりの場合の自動スクロール処理
  useEffect(() => {
    /* headerのtargetDateはタイミングが違うので見ない */
    if (
      isAutoReload ||
      (!!prevTimeLcl && !!fis.timeLcl && dayjs(prevTimeLcl).format("YYYYMMDD") !== dayjs(fis.timeLcl).format("YYYYMMDD"))
    ) {
      scrollToCurrentTime(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fis.timeLcl]);

  // FISの読み込み完了時
  useEffect(() => {
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
        void dispatch(showInfoNoAirport());
      } else if (fis.fisRows.isEmpty()) {
        void dispatch(barChartSearchActions.showInfoNoData());
      }
      // タイムスケールのデフォルトを設定
      if (fis.isApoHasChanged) {
        const defTimeScale = storage.isPc ? (fis.targetArea === "JP" ? "4" : "8") : fis.targetArea === "JP" ? "2" : "4";
        setSelectedTimeScale(defTimeScale);
        setTimeScale(defTimeScale);
      }
      setScrollToCurrentVisible();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fis.isFetching]);

  // 自動更新時、バーチャートを更新
  useEffect(() => {
    if (isAutoReload) {
      updateBarchartComponent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fis.timeStamp, headerInfo.curfewTimeStartLcl, headerInfo.curfewTimeEndLcl]);

  // タグを選択された時、バーチャートを更新
  useEffect(() => {
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
  useEffect(() => {
    if (isAutoReload) {
      fisActions.doQueueFunctionAll();
    }
  }, [isAutoReload]);

  // 権限更新
  useEffect(() => {
    if (!isEqual(prevJobAuth, jobAuth)) {
      setStationOperationTaskEnabled(funcAuthCheck(Const.FUNC_ID.openOperationTask, jobAuth.jobAuth));
      setFlightDetailEnabled(funcAuthCheck(Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth));
      setFlightListEnabled(funcAuthCheck(Const.FUNC_ID.openShipTransitList, jobAuth.jobAuth));
      setRoundButtonSpotEnabled(funcAuthCheck(Const.FUNC_ID.openSpotNo, jobAuth.jobAuth));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobAuth]);

  // 次回の便検索が同じ行・同じ列でもスクロールされるようにundefinedにしておく
  useEffect(() => {
    if (barChartSearch.scrollToRow !== undefined) {
      dispatch(barChartSearchActions.searchBarChartDefault());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barChartSearch.scrollToRow]);

  const scrollToCurrentTime = (forceScroll: boolean) => {
    // targetDayDiff は、昨日: -1 本日: 0 翌日: 1となる。
    if (forceScroll || !(isAutoReload && isSelfScroll)) {
      setIsScrollingToCurrent(true);
    }
    if (fis.targetDayDiff >= -1 && fis.targetDayDiff <= 1) {
      const dayjsTimeLcl = dayjs(fis.timeLcl);
      const scrollToHour = dayjsTimeLcl.hour() + 24 + dayjsTimeLcl.minute() / 60;
      setScrollToColumnCurrent(scrollToHour);
    } else {
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

  const handleScroll = (onScroll: (scrollParams: ScrollParams) => void, scrollParams: ScrollParams) => {
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
        dispatch(closeSpotNumberAll());
        dispatch(updateSpotChangeMode(false));
      };

      if (spotNumber.isOpen) {
        NotificationCreator.create({
          dispatch,
          message: SoalaMessage.M40018C({
            onYesButton: closeModalAndOffSpotChangeMode,
          }),
        });
      } else {
        closeModalAndOffSpotChangeMode();
      }
    } else {
      // flightModals Open Check
      const isOpenFlightModal = flightModals.modals.some((flightModal) => flightModal.opened);
      // flightListModals Open Check
      const isOpenFlightListModal = flightListModals.modals.some((flightListModal) => flightListModal.opened);

      // SpotChangeMode ON
      if (isOpenFlightModal || isOpenFlightListModal) {
        NotificationCreator.create({
          dispatch,
          message: SoalaMessage.M40018C({
            onYesButton: closeModalAndOnSpotChangeMode,
          }),
        });
      } else {
        dispatch(updateSpotChangeMode(true));
      }
    }
  };

  const closeModalAndOnSpotChangeMode = () => {
    // flightModals Close
    flightModals.modals.forEach((flightModal) => {
      const { identifier } = flightModal;
      void dispatch(closeFlightModal({ identifier }));
    });

    // flightListModals Close
    flightListModals.modals.forEach((flightListModal) => {
      dispatch(closeFlightListModal(flightListModal));
    });

    dispatch(updateSpotChangeMode(true));
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

  const openSpotRemarksTooltip = (remarks: string, newSpotRemarksLabelId: string) => {
    if (remarks && storage.isPc) {
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

  const openSpotRemarksModal = async (spotNo: string) => {
    if (!isCurrentPath(Const.PATH_NAME.barChart)) return;

    // PCの場合、更新権限が無ければポップアップを開かない
    if (storage.isPc && !isSpotRemarksSubmitEnabled) return;

    // 最新データをAPIから取得(async)
    try {
      const response = await WebApi.getSpotRemarks(dispatch, { apoCd: headerInfo.apoCd, spotNo });
      const targetSpotData = response.data.spotRmksList.find((v) => v.spotNo === spotNo);
      setIsActiveSpotRemarksModal(true);
      setModalSpotNo(targetSpotData ? targetSpotData.spotNo : spotNo);
      setModalRemarks(targetSpotData ? targetSpotData.spotRmks : "");
    } catch (err) {
      // 何もしない
    }
  };

  const closeSpotRemarksModal = () => {
    setIsActiveSpotRemarksModal(false);
    setModalSpotNo("");
    setModalRemarks("");
  };

  const isSpotRemarksSubmitEnabled =
    !!jobAuth.user.myApoCd &&
    jobAuth.user.myApoCd === common.headerInfo.apoCd &&
    funcAuthCheck(Const.FUNC_ID.updateSpotRemarks, jobAuth.jobAuth);

  const updateSpotRemarksModal = (spotRmks: string) => {
    const { apoCd } = headerInfo;
    void dispatch(updateSpotRemarks({ apoCd, spotNo: modalSpotNo, spotRmks, closeSpotRemarksModal }));
  };

  const selectTimeScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedTimeScale(e.target.value as "2" | "4" | "8");
    }
  };

  const submitTimeScale = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { apoCd, targetDate, isToday } = headerInfo;

    if (fis.headerSettings.isAutoReload) {
      void dispatch(fisActions.getFisHeaderInfoAuto({ apoCd, isAddingAuto: false }));
    } else {
      void dispatch(
        fisActions.getFisHeaderInfo({
          apoCd,
          targetDate,
          isToday,
          beforeApoCd: apoCd,
          beforeTargetDate: targetDate,
          isReload: false,
        })
      );
    }
    setTimeScale(selectedTimeScale);
    setIsTimeScaleModalActive(false);
    scrollToCurrentTime(false);
  };

  const leftSideHeaderCellRenderer = ({ key, style }: GridCellProps) => (
    <LeftSideHeaderCell key={`${key}-lshc`} style={style} isPc={storage.isPc} onClick={openTimeScaleModal}>
      {timeScale ? (
        <>
          <HeaderClockIcon />
          {`${timeScale}h`}
          <SelectAirPortIcon />
        </>
      ) : (
        ""
      )}
    </LeftSideHeaderCell>
  );

  const leftSideCellRenderer = ({ key, rowIndex, style }: GridCellProps) => {
    const keyName = fisRowsGroupBySpot.sortedSpots[rowIndex].spotNo || "XXX";
    const remarksText = fisRowsGroupBySpot.sortedSpots[rowIndex].spotRmks;
    return (
      <LeftSideCell
        key={`${key}-lsc`}
        style={style}
        spotRemarksDisabled={storage.isPc && !isSpotRemarksSubmitEnabled}
        onMouseOver={() => openSpotRemarksTooltip(remarksText, `cellremarks-${rowIndex}`)}
        onMouseLeave={closeSpotRemarksTooltip}
        onClick={() => {
          void openSpotRemarksModal(fisRowsGroupBySpot.sortedSpots[rowIndex].spotNo);
        }}
      >
        <div>{keyName}</div>
        <LeftSideCellRemarks id={`cellremarks-${rowIndex}`}>{remarksText || ""}</LeftSideCellRemarks>
      </LeftSideCell>
    );
  };

  const headDateRenderer = ({ columnIndex, key, style }: GridCellProps) => (
    <HeaderCell key={`${key}-hd`} style={style} isPc={storage.isPc}>
      <HeaderDate>{columnIndex >= 0 && columnIndex <= 2 ? fisRowsGroupBySpot.info.headerDateLabel[columnIndex] : ""}</HeaderDate>
    </HeaderCell>
  );

  const headCellRenderer = ({ columnIndex, key, style }: GridCellProps) => (
    <HeaderCell key={`${key}-hc`} style={style} isPc={storage.isPc}>
      <HeaderCellHour>{`0${columnIndex % 24}:00`.slice(-5)}</HeaderCellHour>
    </HeaderCell>
  );

  const handleOpenSpotFilterModal = () => {
    if (fisRowsGroupBySpot.noFisData) {
      return;
    }
    const { spotNoList } = fisRowsGroupBySpot;
    dispatch(openSpotFilterModal({ spotNoList }));
  };

  // 表示領域にあるチャートのみ抽出する
  const getVisibleRows = (
    visibleRowStartIndex: number,
    visibleRowStopIndex: number,
    _scrollLeft: number,
    visibleWidth: number,
    cellWidth: number
  ): { extFisRows: ExtFisRow[]; rowIndex: number }[] => {
    const newColumnStartIndex = Math.floor(_scrollLeft / cellWidth);
    const newColumnStopIndex = Math.ceil((_scrollLeft + visibleWidth) / cellWidth) - 1;

    if (
      !gridForceUpdating.current /* ForceUpdate時は処理を行う */ &&
      !fis.headerSettings.isAutoReload /* 自動更新時は処理を行う */ &&
      rowStartIndex.current === visibleRowStartIndex &&
      rowStopIndex.current === visibleRowStopIndex &&
      columnStartIndex.current === newColumnStartIndex &&
      columnStopIndex.current === newColumnStopIndex
    ) {
      return visibleRowsResult.current;
    }
    gridForceUpdating.current = false;

    columnStartIndex.current = newColumnStartIndex;
    columnStopIndex.current = newColumnStopIndex;
    rowStartIndex.current = visibleRowStartIndex;
    rowStopIndex.current = visibleRowStopIndex;

    const visibleSpots = fisRowsGroupBySpot.sortedSpots.slice(visibleRowStartIndex, visibleRowStopIndex + 1);

    const wVisibleRows = visibleSpots.reduce((visibleRows: { extFisRows: ExtFisRow[]; rowIndex: number }[], { spotNo: currentSpot }) => {
      const rowIndex = fisRowsGroupBySpot.sortedSpots.findIndex((v) => v.spotNo === currentSpot);
      const extFisRows = fisRowsGroupBySpot.groupedfisRowsBySpot[currentSpot]
        ? fisRowsGroupBySpot.groupedfisRowsBySpot[currentSpot].filter(
            (schedule) =>
              schedule.columnStartIndex - 1 <= newColumnStopIndex &&
              schedule.columnStopIndex + 1 >= newColumnStartIndex /* 少し余分に読み込むため±１行う */
          )
        : [];
      return [...visibleRows, { extFisRows, rowIndex }];
    }, []);
    visibleRowsResult.current = wVisibleRows;
    return visibleRowsResult.current;
  };

  const cellRangeRenderer = (gridCellRangePropsps: GridCellRangeProps) => {
    const children = defaultCellRangeRenderer(gridCellRangePropsps);
    const { start: visibleRowStartIndex, stop: visibleRowStopIndex } = gridCellRangePropsps.visibleRowIndices;
    children.push(
      // 時間区切り線、Curfew
      <BarChartTimeObjects
        key="timeBorder"
        cellWidth={columnWidth.current}
        columnsCount={72}
        curfewTimeStartLcl={headerInfo.curfewTimeStartLcl}
        curfewTimeEndLcl={headerInfo.curfewTimeEndLcl}
      />
    );
    children.push(
      <BarChartGrid
        key="bargrid"
        fis={fis}
        barChart={barChart}
        groupedFisRowsWithIndex={getVisibleRows(
          visibleRowStartIndex,
          visibleRowStopIndex,
          scrollLeftRef.current || 0,
          rightAreaWidth.current,
          columnWidth.current
        )}
        cellHeight={CELL_HEIGHT}
        cellWidth={columnWidth.current}
        openFlightModal={openFlightModal}
        openShipTransitListModal={openShipTransitListModal}
        openFlightListModal={openFlightListModal}
        getFlightList={getFlightList}
        fetchFlightDetail={fetchFlightDetail}
        fetchStationOperationTask={fetchStationOperationTask}
        focusDupChart={focusDupChart}
        stationOperationTaskEnabled={stationOperationTaskEnabled}
        flightDetailEnabled={flightDetailEnabled}
        flightListEnabled={flightListEnabled}
        isSpotChangeMode={barChart.isSpotChangeMode}
        openSpotNumberChild={openSpotNumberChild}
        closeSpotNumberChild={closeSpotNumberChild}
        spotNumber={spotNumber}
      />
    );
    children.push(
      // 当日日付線
      <BarChartCurrentTimeBorder key="currentTimeBorder" position={currentDatePosition.current} />
    );
    children.push(
      <BarChartHighlightOverlay
        key="overlay"
        cellWidth={columnWidth.current}
        cellHeight={CELL_HEIGHT}
        fisRowsGroupBySpot={fisRowsGroupBySpot}
        barChartSearch={barChartSearch}
      />
    );
    return children;
  };

  const cellRenderer = ({ key, style }: GridCellProps) => <MainCell key={`${key}-c`} style={style} />;

  const { scrollToRow, scrollToColumn, filterlingRowColumns } = barChartSearch;
  const filterling = filterlingRowColumns.length !== 0;

  return (
    <>
      <BarChartSearch
        appDispatch={dispatch}
        barChartSearch={barChartSearch}
        fisPullTimeStamp={fis.pullTimeStamp}
        fisRowsGroupBySpot={fisRowsGroupBySpot}
        timeScale={timeScale}
      />
      <HeaderSpotChangeMode isSpotChangeMode={barChart.isSpotChangeMode} prevIsSpotChangeMode={prevIsSpotChangeMode || false}>
        SPOT Change Mode
      </HeaderSpotChangeMode>
      <Wrapper zoom={zoomBarChart}>
        <HeaderBackground />
        <ScrollSync>
          {({ onScroll, scrollLeft, scrollTop }) => (
            <AutoSizer>
              {({ width, height }) => {
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
                } else if (scrollToColumn !== undefined) {
                  const margin = timeScale === "8" ? -1 : timeScale === "4" ? -0.5 : 0.25;
                  scrollLeftWork = (scrollToColumn + margin) * columnWidth.current;
                }
                const currentTimeBallLeft = LEFT_HEADER_CELL_WIDTH + newCurrentDatePosition - scrollLeftWork;

                return (
                  <GridWrapper ref={leftSideGridRef}>
                    <LeftSideHeaderCellWrapper>
                      {storage.isPc && (
                        <BarChartSpotRemarksTooltip
                          isActiveSpotTooltip={isActiveSpotTooltip}
                          remarks={spotRemarksText}
                          remarksLabelId={spotRemarksLabelId}
                          leftSideGridRef={leftSideGridRef}
                        />
                      )}
                      {!!fis.apoCd && (
                        <Grid
                          cellRenderer={leftSideHeaderCellRenderer}
                          rowHeight={40}
                          columnWidth={LEFT_HEADER_CELL_WIDTH}
                          width={LEFT_HEADER_CELL_WIDTH}
                          height={40}
                          rowCount={1}
                          columnCount={1}
                          timeScale={timeScale}
                        />
                      )}
                    </LeftSideHeaderCellWrapper>
                    <LeftSideHeaderWrapper isFilterling={filterling}>
                      <div>
                        <SpotFilterIconDiv
                          onClick={handleOpenSpotFilterModal}
                          filtering={fisRowsGroupBySpot.filteringSpotNo}
                          disabled={fisRowsGroupBySpot.noFisData}
                          isFilterling={filterling}
                        >
                          <SpotFilterIcon />
                          <SpotFilterLabel isFilterling={filterling}>Filter</SpotFilterLabel>
                        </SpotFilterIconDiv>
                        <SpotFilterBottomSpace />
                        <Grid
                          cellRenderer={leftSideCellRenderer}
                          columnWidth={LEFT_HEADER_CELL_WIDTH}
                          columnCount={1}
                          height={height - scrollbarHeight - 40}
                          rowHeight={CELL_HEIGHT}
                          rowCount={fisRowsGroupBySpot.sortedSpots.length}
                          scrollTop={scrollTop}
                          width={LEFT_HEADER_CELL_WIDTH}
                          style={{ overflowY: "hidden", paddingBottom: scrollbarHeight }}
                          // overscanIndicesGetter={overscanIndicesGetter}
                        />
                      </div>
                    </LeftSideHeaderWrapper>
                    <RightSideWrapper>
                      <div>
                        <HeaderCellWrapper width={width}>
                          {!!fis.apoCd && (
                            <>
                              <Grid
                                cellRenderer={headDateRenderer}
                                columnCount={3}
                                columnWidth={columnWidth.current * 24}
                                rowCount={1}
                                rowHeight={20}
                                width={rightAreaWidth.current}
                                height={20}
                                scrollLeft={scrollLeftWork}
                                overscanColumnCount={0} // オーバースキャンにとりあえず0を設定しています
                              />
                              <Grid
                                cellRenderer={headCellRenderer}
                                columnCount={72}
                                columnWidth={columnWidth.current}
                                rowCount={1}
                                rowHeight={20}
                                width={rightAreaWidth.current}
                                height={20}
                                scrollLeft={scrollLeftWork}
                                overscanColumnCount={0} // オーバースキャンにとりあえず0を設定しています
                              />
                            </>
                          )}
                        </HeaderCellWrapper>
                        <MainCellWrapper>
                          {!!fis.apoCd && (
                            <Grid
                              ref={mainGridRef}
                              onScroll={(params: ScrollParams) => handleScroll(onScroll, params)}
                              cellRenderer={cellRenderer}
                              cellRangeRenderer={cellRangeRenderer}
                              columnCount={1}
                              columnWidth={columnWidth.current * 72}
                              rowCount={fisRowsGroupBySpot.sortedSpots.length}
                              rowHeight={CELL_HEIGHT}
                              width={rightAreaWidth.current}
                              height={height - scrollbarHeight - 40}
                              scrollToRow={scrollToRow}
                              scrollToAlignment={filterling ? "auto" : "start"} // ハイライト時だけ左端じゃみにくいのでautoにしてます。
                              scrollLeft={scrollLeftWork}
                              // overscanIndicesGetter={overscanIndicesGetter}
                              overscanColumnCount={0} // オーバースキャンにとりあえず0を設定しています
                            />
                          )}
                        </MainCellWrapper>
                        {currentDatePosition.current - scrollLeftWork > 0 &&
                          currentTimeBallLeft < window.innerWidth - CURRENT_TIME_BALL_WIDTH / 2 && (
                            <CurrentTimeBall left={currentTimeBallLeft} />
                          )}
                      </div>
                    </RightSideWrapper>
                  </GridWrapper>
                );
              }}
            </AutoSizer>
          )}
        </ScrollSync>

        {/* タイムスケール選択モーダル */}
        <Modal isOpen={isTimeScaleModalActive} onRequestClose={closeTimeScaleModal} style={customModalStyles}>
          <TimeScaleWrapper>
            <TimeScaleTitle>Time Scale</TimeScaleTitle>
            <TimeScaleRadioButtons>
              {!storage.isPc && (
                <RadioButtonWrapper>
                  <RadioButtonStyled
                    isShadowOnFocus
                    id="2h"
                    value="2"
                    type="radio"
                    onChange={selectTimeScale}
                    checked={selectedTimeScale === "2"}
                  />
                  <label htmlFor="2h">2h</label>
                </RadioButtonWrapper>
              )}
              <RadioButtonWrapper>
                <RadioButtonStyled
                  isShadowOnFocus
                  id="4h"
                  value="4"
                  type="radio"
                  onChange={selectTimeScale}
                  checked={selectedTimeScale === "4"}
                />
                <label htmlFor="4h">4h</label>
              </RadioButtonWrapper>
              {storage.isPc && (
                <RadioButtonWrapper>
                  <RadioButtonStyled
                    isShadowOnFocus
                    id="8h"
                    value="8"
                    type="radio"
                    onChange={selectTimeScale}
                    checked={selectedTimeScale === "8"}
                  />
                  <label htmlFor="8h">8h</label>
                </RadioButtonWrapper>
              )}
            </TimeScaleRadioButtons>
            <SubmitWrapper isPc={storage.isPc}>
              <PrimaryButton text="Search" onClick={submitTimeScale} />
            </SubmitWrapper>
          </TimeScaleWrapper>
        </Modal>

        <SpotFilterModal />

        {/* Spotリマークスポップアップ */}
        <BarChartUpdateRmksPopup
          isOpen={isActiveSpotRemarksModal}
          left={90}
          initialSpotNo={modalSpotNo}
          initialRmksText={modalRemarks}
          isSubmitable={isSpotRemarksSubmitEnabled}
          placeholder="SPOT Remarks"
          onClose={closeSpotRemarksModal}
          update={updateSpotRemarksModal}
          dispatch={dispatch}
        />
        <ButtonArea zoom={zoomBarChart}>
          {roundButtonSpotEnabled && (
            <RoundButtonSpotContainer>
              <RoundButtonSpot isActiveColor={barChart.isSpotChangeMode} onClick={handleOnClickRoundButtonSpot} />
            </RoundButtonSpotContainer>
          )}
          <SearchButtonContainer>
            <SearchButton isFiltered={filterling} onClick={handleSearchButton} />
          </SearchButtonContainer>
          <InitialPositionButtonContainer>
            {scrollToCurrentIsVisible ? <InitialPositionButton onClick={handleScrollToCurrentTime} /> : null}
          </InitialPositionButtonContainer>
        </ButtonArea>
        {fis.fetchFisResult.retry ? (
          <ErrorPopup dispatch={dispatch} isError={fis.fetchFisResult.isError} retry={fis.fetchFisResult.retry} />
        ) : undefined}
      </Wrapper>
    </>
  );
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

const customModalStyles: Modal.Styles = {
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
    top: `calc(40px + ${storage.isPc ? layoutStyle.header.default : `${COMMON_SUB_HEADER_HEIGHT} + ${layoutStyle.header.tablet}`})`,
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

const Wrapper = styled.div<{ zoom: number }>`
  zoom: ${({ zoom }) => zoom / 100};
  width: 100%;
  height: 100%;
  position: relative;
`;
const HeaderBackground = styled.div`
  position: absolute;
  width: 100%;
  top: -1px; /* iPadでメインヘッダーとの間に細い白線が出ることがあるのでその差を埋める */
  height: 41px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
`;

const GridWrapper = styled.div`
  position: relative;
`;
const LeftSideHeaderCellWrapper = styled.div`
  position: absolute;
  text-align: center;
`;
const LeftSideHeaderWrapper = styled.div<{ isFilterling: boolean }>`
  position: absolute;
  top: 40px;
  text-align: center;
  line-height: 92px;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  .ReactVirtualized__Grid__innerScrollContainer {
    min-height: 100% !important;
    max-height: auto !important;
    ${(props) =>
      props.isFilterling
        ? css`
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

const RightSideWrapper = styled.div`
  position: relative;
`;

const HeaderCellWrapper = styled.div<{ width: number }>`
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
const MainCellWrapper = styled.div`
  position: relative;
  left: ${LEFT_HEADER_CELL_WIDTH}px;
  .ReactVirtualized__Grid__innerScrollContainer {
    min-height: 100% !important;
    max-height: auto !important;
  }
`;
const HeaderCell = styled.div<{ isPc: boolean }>`
  color: #fff;
  font-weight: 100;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
`;
const HeaderDate = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #eded88;
  text-align: left;
  margin-right: 3px;
  position: sticky;
  left: 0;
`;
const HeaderCellHour = styled.div`
  padding-bottom: 2px;
  font-size: 14px;
`;
const MainCell = styled.div`
  &:nth-child(odd) {
    background: #f6f6f6;
  }
  &:nth-child(even) {
    background: #eeeeee;
  }
`;
const LeftSideCell = styled.div<{ spotRemarksDisabled: boolean }>`
  ${({ spotRemarksDisabled }) => (spotRemarksDisabled ? "cursor: default;" : "cursor: pointer;")}
  font-size: 20px;
  &:nth-child(odd) {
    background: #f6f6f6;
  }
  &:nth-child(even) {
    background: #eeeeee;
  }
`;

const LeftSideCellRemarks = styled.div`
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

const SpotFilterIconDiv = styled.div<{ filtering?: boolean; disabled?: boolean; isFilterling: boolean }>`
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
    ${({ isFilterling, filtering, disabled }) =>
      isFilterling ? (filtering && !disabled ? "fill: #735a11;" : "fill: #1a3040;") : filtering && !disabled ? "fill: #E6B422;" : ""};
  }
  .outside {
    ${({ isFilterling }) => (isFilterling ? "fill: #7f7f7f;" : "")};
  }
`;

const SpotFilterLabel = styled.div<{ isFilterling: boolean }>`
  ${({ isFilterling }) => (isFilterling ? "color: #7f7f7f" : "color: #FFFFFF")};
  font-size: 12px;
  position: absolute;
  width: 72px;
  height: 25.5px;
  text-align: center;
  line-height: 1.8;
`;

const SpotFilterBottomSpace = styled.div`
  /* フィルターボタンの真下に置いてクリック不可の領域を作る */
  position: absolute;
  top: 30px;
  width: 72px;
  height: 6px;
  z-index: 1;
`;

const LeftSideHeaderCell = styled.div<{ isPc: boolean }>`
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
const SelectAirPortIcon = styled.img.attrs({ src: iconFisSelectTargetPopupSvg })`
  cursor: pointer;
  width: 19px;
  height: 13px;
  margin-bottom: 5px;
`;

const TimeScaleWrapper = styled.form`
  display: flex;
  flex-direction: column;
`;

const TimeScaleTitle = styled.div`
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 19px;
`;

const TimeScaleRadioButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 20px;
`;

const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SubmitWrapper = styled.div<{ isPc: boolean }>`
  width: 100px;
  align-self: center;
  button {
    ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
  }
`;

const CURRENT_TIME_BALL_WIDTH = 9;

const CurrentTimeBall = styled.div<{ left: number }>`
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

const ButtonArea = styled.div<{ zoom: number }>`
  zoom: ${({ zoom }) => 100 / zoom};
`;

const RoundButtonSpotContainer = styled.div`
  position: fixed;
  right: 44px;
  bottom: 196px;
`;

const SearchButtonContainer = styled.div`
  position: fixed;
  right: 44px;
  bottom: 120px;
`;

const InitialPositionButtonContainer = styled.div`
  position: fixed;
  right: 44px;
  bottom: 44px;
`;

const InitialPositionButton = styled.img.attrs({ src: iconScrollLeftSvg })`
  height: 60px;
  width: 60px;
  border-radius: 30px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.33);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const HeaderSpotChangeMode = styled.div<{ isSpotChangeMode: boolean; prevIsSpotChangeMode: boolean }>`
  width: 100%;
  ${({ isSpotChangeMode, prevIsSpotChangeMode }) =>
    !isSpotChangeMode && !prevIsSpotChangeMode
      ? css`
          visibility: hidden;
          height: 0px;
        `
      : isSpotChangeMode
      ? css`
          animation: ${showHeaderContentFromLong()} 0.3s;
          height: 20px;
        `
      : css`
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

const HeaderClockIcon = styled.img.attrs({ src: headerClockIconSvg })`
  height: 13px;
  width: 15px;
  margin-right: 2px;
  margin-bottom: 5px;
`;

const showHeaderContentFromLong = () => keyframes`
  0% { height: 0px; }
  100% { height: 20px; }
`;

const showHeaderContentFromHide = () => keyframes`
  0% { height: 20px; }
  100% { height: 0px; }
`;

export default BarChart;
