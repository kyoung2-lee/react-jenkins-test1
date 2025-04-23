import React from "react";
import { Dispatch } from "redux";
import { reset as resetType } from "redux-form";
import { change as ChangeOthreForm } from "redux-form/lib/actions";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List } from "immutable";
import { isEqual, uniq } from "lodash";
import dayjs from "dayjs";
import styled, { keyframes, css, DefaultTheme, ThemeProvider } from "styled-components";
import { VariableSizeList, ListOnScrollProps, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import lightTheme from "../../../themes/themeLight";
import { funcAuthCheck, removePictograph, toUpperCase, formatFlt } from "../../../lib/commonUtil";
import { Const } from "../../../lib/commonConst";
import { storage } from "../../../lib/storage";
import * as validates from "../../../lib/validators";
import * as fisExports from "../../../reducers/fis";
import { FisRow as FisRowType } from "../../../reducers/fisType";
import * as fisFilterModalExports from "../../../reducers/fisFilterModal";
import { SearchParams } from "../../../reducers/fisFilterModal";
import { HeaderInfo } from "../../../reducers/common";
import { JobAuth, Master } from "../../../reducers/account";
import ErrorPopup from "../../molecules/ErrorPopup";
import FisRow from "../../molecules/FisRow";
import InitialPositionButton from "../../atoms/InitialPositionButton";
import SearchButton from "../../atoms/SearchButton";
import FilterKeyword from "./FilterKeyword";
import MultipleFlightMovementModalArr from "../MultipleFlightMovement/MultipleFlightMovementModalArr";
import MultipleFlightMovementModalDep from "../MultipleFlightMovement/MultipleFlightMovementModalDep";

import iconSearchSvg from "../../../assets/images/icon/icon-search.svg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _fisDefault, slice: _fisSlice, doQueueFunctionAll, ...fisActions } = fisExports;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _fisFilterModalDefault, slice: _fisFilterModalSlice, ...fisFilterModalActions } = fisFilterModalExports;

type Props = typeof fisActions &
  typeof fisFilterModalActions & {
    dispatch: Dispatch;
    isDarkMode: boolean;
    scrollbarWidth: number;
    headerInfo: HeaderInfo;
    fis: fisExports.FisState;
    jobAuth: JobAuth;
    master: Master;
    zoomFis: number;
    isAutoReload: boolean;
    isSelfScroll: boolean;
    filteredFisRows: List<{ date: string; fis: FisRowType }>;
    fisFilterModal: fisFilterModalExports.FisFilterModalState;
    fisFilterModalFormValues: SearchParams;
    resetOthreForm: typeof resetType;
    changeOthreForm: typeof ChangeOthreForm;
  };

interface State {
  presentTime: dayjs.Dayjs | null;
  stickyDate: string | null;
  scrollToTopIsVisible: boolean;
  stationOperationTaskEnabled: boolean; // 発着工程情報更新画面の使用可否
  flightMovementEnabled: boolean; // 便動態更新画面の使用可否
  multipleFlightMovementEnabled: boolean; // 便動態一括更新画面の使用可否
  mvtMsgEnabled: boolean; // 便動態発信画面の使用可否
  flightDetailEnabled: boolean; // 便情報詳細画面の使用可否
  flightListEnabled: boolean; // 機材接続情報画面の使用可否
  flightRmksEnabled: boolean; // 便リマークス更新画面の使用可否
  oalAircraftEnabled: boolean; // 他社便機材情報更新画面の使用可否
  oalPaxEnabled: boolean; // 他社便旅客数更新画面の使用可否
  oalPaxStatusEnabled: boolean; // 他社便旅客ステータス更新画面の使用可否
  spotNoEnabled: boolean; // SPOT番号更新画面の使用可否
  oalFuelEnabled: boolean; // 他社便燃料情報更新画面の使用可否
  filteredKeyword: string;
  fisFiletrInputFocused: boolean;
}

class FisTable extends React.Component<Props, State> {
  private virtualList: React.RefObject<VariableSizeList>;
  private rowsWithDate: List<{ date: string; fis?: FisRowType; isDate: boolean }>;
  private defaultScrollIndex = 0;
  private scrollInfo?: ListOnScrollProps;

  autoSizerRef = React.createRef<HTMLDivElement>();
  filetrTextRef = React.createRef<HTMLInputElement>();
  centerContentRef = React.createRef<HTMLInputElement>();
  doRowAnimation = false;
  private HEADER_HEIGHT = storage.isPc ? 24 : 30;
  isFilterTextChanged = false;
  updateTimeLclSetTimer: number | null = null;

  constructor(props: Props) {
    super(props);
    const filteredfisRow = props.filteredFisRows.first();
    this.state = {
      presentTime: props.fis.timeLclDayjs,
      stickyDate: filteredfisRow ? filteredfisRow.date : null,
      scrollToTopIsVisible: false,
      stationOperationTaskEnabled: funcAuthCheck(Const.FUNC_ID.openOperationTask, this.props.jobAuth.jobAuth),
      flightMovementEnabled: funcAuthCheck(Const.FUNC_ID.openOalFlightMovement, this.props.jobAuth.jobAuth),
      multipleFlightMovementEnabled: funcAuthCheck(Const.FUNC_ID.openMultipleFlightMovement, this.props.jobAuth.jobAuth),
      mvtMsgEnabled: funcAuthCheck(Const.FUNC_ID.openMvtMsg, this.props.jobAuth.jobAuth),
      flightDetailEnabled: funcAuthCheck(Const.FUNC_ID.openFlightDetail, this.props.jobAuth.jobAuth),
      flightListEnabled: funcAuthCheck(Const.FUNC_ID.openShipTransitList, this.props.jobAuth.jobAuth),
      flightRmksEnabled: funcAuthCheck(Const.FUNC_ID.updateFlightRemarks, this.props.jobAuth.jobAuth),
      oalAircraftEnabled: funcAuthCheck(Const.FUNC_ID.openOalAircraft, this.props.jobAuth.jobAuth),
      oalPaxEnabled: funcAuthCheck(Const.FUNC_ID.openOalPax, this.props.jobAuth.jobAuth),
      oalFuelEnabled: funcAuthCheck(Const.FUNC_ID.openOalFuel, this.props.jobAuth.jobAuth),
      oalPaxStatusEnabled: funcAuthCheck(Const.FUNC_ID.openOalPaxStatus, this.props.jobAuth.jobAuth),
      spotNoEnabled: funcAuthCheck(Const.FUNC_ID.openSpotNo, this.props.jobAuth.jobAuth),
      filteredKeyword: "",
      fisFiletrInputFocused: false,
    };
    this.virtualList = React.createRef();
    this.rowsWithDate = this.createRowsWithDate(props.filteredFisRows);
  }

  componentDidMount() {
    this.props.getFisHeaderInfo({
      apoCd: this.props.jobAuth.user.myApoCd,
      targetDate: "",
      isToday: true,
      beforeApoCd: "",
      beforeTargetDate: "",
      isReload: false,
    });
  }

  shouldComponentUpdate(nextProps: Props) {
    if (nextProps.fis.isSortTwoColumnMode !== this.props.fis.isSortTwoColumnMode) {
      this.doRowAnimation = true;
    }

    if (!this.props.fisFilterModal.isForceFilter && nextProps.fisFilterModal.isForceFilter) {
      this.props.forceFiltered();
      return true;
    }

    // モーダルを開閉した時に、フィルターした結果のFIS配列が変わってなければrenderしない(FIS配列が0件の場合を除く)
    if (
      nextProps.filteredFisRows.size > 0 &&
      isEqual(nextProps.filteredFisRows, this.props.filteredFisRows) &&
      this.props.fisFilterModal.modalIsOpen !== nextProps.fisFilterModal.modalIsOpen
    ) {
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.fis.isSortTwoColumnMode !== this.props.fis.isSortTwoColumnMode) {
      // 行のアニメーションが終わった頃にOFFにする
      window.setTimeout(() => {
        this.doRowAnimation = false;
      }, 500);
    }

    // スケジュールが更新された時 または 対象日が変わった時 または FISの読み込み完了時
    if (
      prevProps.filteredFisRows !== this.props.filteredFisRows ||
      prevProps.headerInfo.targetDate !== this.props.headerInfo.targetDate ||
      (prevProps.fis.isFetching && !this.props.fis.isFetching && this.props.fis.isFetchSecceeded)
    ) {
      this.rowsWithDate = this.createRowsWithDate(this.props.filteredFisRows);
      // 行の高さを再計算する（しないとスクロールするまで高さがずれたままになります）
      if (this.virtualList.current) {
        this.virtualList.current.resetAfterIndex(1);
      }

      void this.scrollToCurrent(false);
      this.setStickyDate(this.scrollInfo);
      this.setState({ presentTime: this.props.fis.timeLclDayjs });
    }
    // FISフィルター実行時
    if (!prevProps.fisFilterModal.isSubmit && this.props.fisFilterModal.isSubmit) {
      // 0件時のメッセージ
      this.props.checkedFisRowsLength();
      if (!this.props.fis.timeLcl) {
        this.props.showInfoNoAirport();
      } else if (this.rowsWithDate.isEmpty()) {
        this.props.showInfoNoData();
      }
    }
    // FISの読み込み完了時
    if (prevProps.fis.isFetching && !this.props.fis.isFetching && this.props.fis.isFetchSecceeded) {
      // 0件時のメッセージ
      if (!this.props.fis.timeLcl) {
        this.props.showInfoNoAirport();
      } else if (this.rowsWithDate.isEmpty()) {
        this.props.showInfoNoData();
      }
    }
    const { isAutoReload } = this.props;
    const prevIsAutoReload = prevProps.isAutoReload;
    // 自動更新処理
    if (!prevIsAutoReload && isAutoReload) {
      // 自動更新開始
      if (this.updateTimeLclSetTimer) {
        window.clearInterval(this.updateTimeLclSetTimer);
      }
      this.updateTimeLclSetTimer = window.setInterval(() => {
        const { presentTime } = this.state;
        if (presentTime && presentTime.isValid()) {
          this.setState({ presentTime: presentTime.add(1, "minutes") });
        }
      }, 60000);
      // 切り替え中に飛んできたPUSHデータを処理する
      doQueueFunctionAll();
    } else if (this.updateTimeLclSetTimer && prevIsAutoReload && !isAutoReload) {
      // 自動更新終了
      window.clearInterval(this.updateTimeLclSetTimer);
    }
    // 権限更新
    if (!isEqual(prevProps.jobAuth, this.props.jobAuth)) {
      this.setState({
        stationOperationTaskEnabled: funcAuthCheck(Const.FUNC_ID.openOperationTask, this.props.jobAuth.jobAuth),
        flightDetailEnabled: funcAuthCheck(Const.FUNC_ID.openFlightDetail, this.props.jobAuth.jobAuth),
        flightListEnabled: funcAuthCheck(Const.FUNC_ID.openShipTransitList, this.props.jobAuth.jobAuth),
        flightRmksEnabled: funcAuthCheck(Const.FUNC_ID.updateFlightRemarks, this.props.jobAuth.jobAuth),
        oalAircraftEnabled: funcAuthCheck(Const.FUNC_ID.openOalAircraft, this.props.jobAuth.jobAuth),
        oalPaxEnabled: funcAuthCheck(Const.FUNC_ID.openOalPax, this.props.jobAuth.jobAuth),
        oalPaxStatusEnabled: funcAuthCheck(Const.FUNC_ID.openOalPaxStatus, this.props.jobAuth.jobAuth),
        oalFuelEnabled: funcAuthCheck(Const.FUNC_ID.openOalFuel, this.props.jobAuth.jobAuth),
      });
    }

    if (this.props.fisFilterModal.searchParams !== prevProps.fisFilterModal.searchParams) {
      if (this.isFilterTextChanged) {
        this.isFilterTextChanged = false;
      } else {
        this.setState({ filteredKeyword: this.filterKeyword(this.props.fisFilterModal) });
      }
    }
  }

  componentWillUnmount() {
    this.props.mqttDisconnect();
    this.props.dispatch(fisExports.clear());
  }

  handleFisFilterModal = () => {
    const { resetOthreForm, fisFilterModal } = this.props;
    if (!fisFilterModal.isFiltered) {
      this.props.openFlightSearchModal();
    } else {
      resetOthreForm("fisFilterModal");

      // データの初期化が追い付かないので、あえてローカル変数で指定
      const initSearchParams: fisFilterModalExports.SearchParams = {
        airLineCode: [],
        airLineCodeJALGRP: false,
        airLineCodeOALAll: false,
        airLineCodeOAL: [],
        flightNo: "",
        airport: "",
        ship: "",
        spot: [],
        dateTimeRadio: "",
        dateTimeFrom: "",
        dateTimeTo: "",
        domOrInt: "",
        skdOrNsk: "",
        casualFlg: false,
        cnlHideFlg: false,
      };
      this.props.searchFis(initSearchParams);
    }
  };

  handleFilterKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
    // enterキーを押したときのみ実行
    if (e.key !== "Enter") {
      return;
    }
    void this.filterByText(e.target.value);
  };

  handleFilterChanged = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
    const {
      fisFilterModal: { isFiltered },
    } = this.props;
    this.setState({ filteredKeyword: e.target.value });
    if (isFiltered) {
      // フォームを初期化し無条件で検索
      this.isFilterTextChanged = true;
      this.props.resetOthreForm("fisFilterModal");
      void this.filterByText("");
    }
  };

  handleFilterOnClick = () => {
    const {
      fisFilterModal: { isFiltered },
    } = this.props;
    if (isFiltered) {
      void this.filterByText("");
    } else {
      void this.filterByText(this.state.filteredKeyword);
    }
  };

  // 表示対象日の①の最後の便を一番上の行に表示する
  handleScrollToCurrent = () => {
    this.scrollToCurrent(true);
  };

  handleArrivalSort = () => {
    const { changeSort } = this.props;
    const { isSortArrival, isSortNoTowing, isSortTwoColumnMode } = this.props.fis;

    if (isSortTwoColumnMode) {
      return;
    }

    // 昇順固定
    changeSort({
      isSortArrival: true,
      isSortAsc: true,
      isSortNoTowing: !isSortArrival ? false : !isSortNoTowing,
      isSortTwoColumnMode,
    });
  };

  handleDepartureSort = () => {
    const { changeSort } = this.props;
    const { isSortArrival, isSortNoTowing, isSortTwoColumnMode } = this.props.fis;

    if (isSortTwoColumnMode) {
      return;
    }

    // 昇順固定
    changeSort({
      isSortArrival: false,
      isSortAsc: true,
      isSortNoTowing: isSortArrival ? false : !isSortNoTowing,
      isSortTwoColumnMode,
    });
  };

  handleTwoColumnMode = () => {
    const { changeSort } = this.props;
    const { isSortArrival, isSortTwoColumnMode } = this.props.fis;

    if (storage.isPc) {
      return;
    }

    // 昇順固定
    changeSort({
      isSortArrival,
      isSortAsc: true,
      isSortNoTowing: true,
      isSortTwoColumnMode: !isSortTwoColumnMode,
    });
  };

  // 初期表示するFIS行のindex
  getDefaultScrollIndex = () => {
    // 当日日付で検索した場合、グループ1の最後をスクロール位置とする
    const firstGroupRows = this.rowsWithDate.filter(
      (d) => !d.isDate && d.fis?.sortGroupNo === 1 && d.date === dayjs(this.props.headerInfo.targetDate).format("YYYYMMDD")
    );
    if (firstGroupRows.size > 0) {
      const firstGroupTail = firstGroupRows.get(firstGroupRows.size - 1);
      return this.rowsWithDate.findIndex((d) => d === firstGroupTail);
    }
    // グループ1が存在しない場合は、当日日付の先頭をスクロール位置とする
    const index = this.rowsWithDate.findIndex((d) => !d.isDate && d.date === dayjs(this.props.headerInfo.targetDate).format("YYYYMMDD"));
    // 当日日付がない場合は一番上にする
    return index === -1 ? 0 : index;
  };

  filterKeyword = (fisFilterModal: fisFilterModalExports.FisFilterModalState) => {
    const { searchParams } = fisFilterModal;
    const filterKeyword = new FilterKeyword(searchParams, this.props.master);
    const filterString = filterKeyword.toString();

    return filterString;
  };

  filterByText = async (filterText: string) => {
    const { changeOthreForm, resetOthreForm, master } = this.props;
    const regex = /(?<token_string>(?:(?<field_name>\w+):)?(?:(?:"(?<quoted_term>.*?)")|(?<term>\S+)))/g;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matches: any | null = [];
    let match = null;

    // 意図的なので許容する
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(filterText)) != null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      matches.push(match);
    }

    // 検索する前に検索フォームを初期化する
    resetOthreForm("fisFilterModal");

    let dateTimeRadio: fisFilterModalExports.DateTimeRadio = "";
    let dateTimeTo = "";
    let dateTimeFrom = "";
    let cnlHideFlg = false;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await matches.forEach((m: { groups: { field_name: string; term: string; quoted_term: string } }) => {
      const { field_name, term } = m.groups;
      const FIELD_NAME = toUpperCase(field_name);
      const TERM = toUpperCase(term);
      let isCangedFlt = false;

      switch (FIELD_NAME) {
        case "AL": {
          const inputAls = [];
          const als = TERM ? TERM.split("/") : [];
          for (let i = 0; i < als.length; i++) {
            for (let j = 0; j < master.airlines.length; j++) {
              if (als[i] === master.airlines[j].alCd) {
                inputAls.push(als[i]);
                break;
              }
            }
          }
          if (inputAls && inputAls.length) {
            changeOthreForm("fisFilterModal", "airLineCode", inputAls);
          }
          break;
        }
        case "OAL": {
          const inputAls = [];
          let isAll = false;
          const als = TERM ? TERM.split("/") : [];
          for (let i = 0; i < als.length; i++) {
            if (als[i] === "ALL") {
              isAll = true;
            } else {
              inputAls.push(als[i]);
            }
          }
          if (isAll) {
            changeOthreForm("fisFilterModal", "airLineCodeOALAll", true);
          } else if (inputAls && inputAls.length && !validates.isOkAls(inputAls)) {
            changeOthreForm("fisFilterModal", "airLineCodeOAL", uniq(inputAls).slice(0, 10));
          }
          break;
        }
        case "APO": {
          if (!validates.halfWidthApoCd(TERM)) {
            changeOthreForm("fisFilterModal", "airport", TERM);
          }
          break;
        }
        case "SHIP": {
          if (validates.isOnlyHalfWidth(TERM)) {
            changeOthreForm("fisFilterModal", "ship", TERM);
          }
          break;
        }
        case "SPOT": {
          const spot = TERM ? TERM.split("/") : [];
          if (!validates.lengthSpots(spot) && !validates.halfWidthSpots(spot)) {
            changeOthreForm("fisFilterModal", "spot", uniq(spot).slice(0, 10));
          }
          break;
        }
        case "IS": {
          switch (TERM) {
            case "DEP":
            case "ARR": {
              dateTimeRadio = TERM;
              break;
            }
            case "DOM": {
              changeOthreForm("fisFilterModal", "domOrInt", "D");
              break;
            }
            case "INT": {
              changeOthreForm("fisFilterModal", "domOrInt", "I");
              break;
            }
            case "SKD": {
              changeOthreForm("fisFilterModal", "skdOrNsk", "SKD");
              break;
            }
            case "NSK": {
              changeOthreForm("fisFilterModal", "skdOrNsk", "NSK");
              break;
            }
            default:
          }
          break;
        }
        case "AFTER": {
          if (term && term.length === 4 && dayjs(term, "HHmm").format("HHmm") !== "Invalid date") {
            dateTimeFrom = dayjs(term, "HHmm").format("HHmm");
          }
          break;
        }
        case "BEFORE": {
          if (term && term.length === 4 && dayjs(term, "HHmm").format("HHmm") !== "Invalid date") {
            dateTimeTo = dayjs(term, "HHmm").format("HHmm");
          }
          break;
        }
        case "CNL": {
          if (TERM && TERM === "HIDE") {
            cnlHideFlg = true;
          }
          break;
        }
        case "FLT":
        default: {
          let isCasual = false;
          let removedCasualFlgTerm = TERM;
          if (TERM.slice(0, 1) === "*") {
            isCasual = true;
            removedCasualFlgTerm = TERM.slice(1);
          }
          if (!isCangedFlt && validates.isOnlyHalfWidth(removedCasualFlgTerm)) {
            isCangedFlt = true;
            changeOthreForm("fisFilterModal", "flightNo", isCasual ? toUpperCase(removedCasualFlgTerm) : formatFlt(removedCasualFlgTerm));
            changeOthreForm("fisFilterModal", "casualFlg", isCasual);
          }
        }
      }
    });
    if (dateTimeRadio && (dateTimeFrom || dateTimeTo)) {
      changeOthreForm("fisFilterModal", "dateTimeRadio", dateTimeRadio);
      if (dateTimeFrom) changeOthreForm("fisFilterModal", "dateTimeFrom", dateTimeFrom);
      if (dateTimeTo) changeOthreForm("fisFilterModal", "dateTimeTo", dateTimeTo);
    }
    changeOthreForm("fisFilterModal", "cnlHideFlg", cnlHideFlg);

    // if (this.filetrTextRef.current) this.filetrTextRef.current.focus();
    this.props.searchFis(this.props.fisFilterModalFormValues);
  };

  private setStickyDate = (scrollInfo?: ListOnScrollProps) => {
    if (this.rowsWithDate.isEmpty()) return; // データがない場合は処理しない
    if (!scrollInfo) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { scrollOffset } = scrollInfo;

    const autoSizerNode = this.autoSizerRef.current;
    if (
      autoSizerNode &&
      autoSizerNode.lastElementChild &&
      autoSizerNode.lastElementChild.firstElementChild &&
      autoSizerNode.lastElementChild.firstElementChild.children
    ) {
      const nodes = Array.from(autoSizerNode.lastElementChild.firstElementChild.children);

      let matchNode: HTMLElement | undefined;
      // マッチしたNodeの中が一番上の位置に着ているか
      let matchNodeTopPosition = false;

      nodes.forEach((node, index) => {
        const { height } = node.getBoundingClientRect();
        const top = (node as HTMLElement).offsetTop;
        const relativeTop = top - scrollOffset;
        if ((node as HTMLElement).dataset.isDate === "true") {
          if (relativeTop <= 0 && relativeTop >= -(height / 2)) {
            // 日付行の上半分がTOPに着たら、前の日付にする
            matchNode = nodes[index - 1] as HTMLElement;
            return;
          }
          if (-(height / 2) >= relativeTop && relativeTop >= -height) {
            // 日付行の上半分がTOPに着たら、次の日付にする
            matchNode = nodes[index + 1] as HTMLElement;
            return;
          }
        }
        if (relativeTop < 2 && relativeTop >= -height) {
          // zoomで縮小されていると2ポイント程度ずれるのでそれを考慮する
          // TOPにあるFIS行の日付にする
          matchNode = node as HTMLElement;
          matchNodeTopPosition = relativeTop >= 0 && relativeTop < 2;
          // eslint-disable-next-line no-useless-return
          return;
        }
      });

      if (scrollOffset === 0) {
        // 行がレンダリングされる前にonScrollされる事がある。
        // scrollTopが0の場合に起きやすいので一旦、0の場合だけ考慮しておきます。
        // 更新された直後とかもレンダリングされる前に呼ばれる

        const filteredfisRow = this.props.filteredFisRows.first();
        this.setState({ stickyDate: filteredfisRow ? filteredfisRow.date : null });
      } else if (matchNode) {
        this.setState({ stickyDate: matchNode.dataset.fisDate as string });
      }

      // const firstScrollNode = nodes.find((node) => (node as HTMLElement).dataset.fisIndex === String(this.defaultScrollIndex));
      if (matchNode && matchNode.dataset.fisIndex === String(this.defaultScrollIndex) && matchNodeTopPosition) {
        this.setState({ scrollToTopIsVisible: false });
        // TODO できれば実装したい
        // } else if (
        //   firstScrollNode &&
        //   scrollHeight !== undefined &&
        //   clientHeight !== undefined &&
        //   scrollHeight - clientHeight < (firstScrollNode as HTMLElement).offsetTop
        // ) {
        //   // どれほど下にスクロールしても初期表示行にたどり着けない場合、初期位置ボタンを非表示にしておく。
        //   this.setState({ scrollToTopIsVisible: false });
      } else {
        this.setState({ scrollToTopIsVisible: true });
      }
    }
  };

  private handleScroll = (props: ListOnScrollProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.scrollInfo = props || this.scrollInfo; // scroll情報を保存
    this.setStickyDate(this.scrollInfo);
  };

  rowCount = () => this.rowsWithDate.size;

  headerRender = () => {
    const { scrollbarWidth } = this.props;
    const { isSortArrival, isSortAsc, isSortNoTowing, isSortTwoColumnMode } = this.props.fis;

    return (
      <ListHeaderWrapper scrollbarWidth={scrollbarWidth}>
        <ListHeader
          isPc={storage.isPc}
          isSortArrival={isSortArrival}
          isSortTwoColumnMode={isSortTwoColumnMode}
          doAnimation={this.doRowAnimation}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className={
              isSortArrival && isSortTwoColumnMode ? "headerContentLong" : isSortTwoColumnMode ? "headerContentHide" : "headerContentArr"
            }
            onClick={this.handleArrivalSort}
          >
            <SortButton height={this.HEADER_HEIGHT} isSortTwoColumnMode={isSortTwoColumnMode} isLeft>
              <div />
              <div>Arrival</div>
              <div>
                <div className="SortedArrow">
                  {isSortArrival ? isSortAsc ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowDown} /> : ""}
                </div>
                {isSortArrival && isSortNoTowing ? <div className="FlightSign">Flight</div> : ""}
              </div>
            </SortButton>
          </div>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div className="centerContent" ref={this.centerContentRef} onClick={this.handleTwoColumnMode}>
            <StationOperationHeader isPc={storage.isPc} height={this.HEADER_HEIGHT}>
              Station Operation
            </StationOperationHeader>
          </div>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className={
              !isSortArrival && isSortTwoColumnMode ? "headerContentLong" : isSortTwoColumnMode ? "headerContentHide" : "headerContentDep"
            }
            onClick={this.handleDepartureSort}
          >
            <SortButton height={this.HEADER_HEIGHT} isSortTwoColumnMode={isSortTwoColumnMode} isLeft={false}>
              <div />
              <div>Departure</div>
              <div>
                <div className="SortedArrow">
                  {!isSortArrival ? isSortAsc ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowDown} /> : ""}
                </div>
                {!isSortArrival && isSortNoTowing ? <div className="FlightSign">Flight</div> : ""}
              </div>
            </SortButton>
          </div>
        </ListHeader>
      </ListHeaderWrapper>
    );
  };

  rowRenderer = ({ index, style }: ListChildComponentProps) => {
    const { fis, zoomFis } = this.props;

    const row = this.rowsWithDate.get(index);

    if (!row) return null;

    if (row.isDate) {
      return (
        <Row data-is-date data-fis-date={row.date} key={index} data-fis-index={index} style={style}>
          <DateHeader>
            <span>{dayjs(row.date).format("DDMMM").toUpperCase()}</span>
            <div />
          </DateHeader>
        </Row>
      );
    }
    if (row.fis) {
      return (
        <Row data-is-date={false} data-fis-date={row.date} key={index} data-fis-index={index} style={style}>
          <FisRow
            isMySchedule={false}
            selectedApoCd={fis.apoCd}
            timeDiffUtc={fis.timeDiffUtc}
            fisRow={row.fis}
            zoomFis={zoomFis}
            dispRangeFromLcl={fis.dispRangeFromLcl}
            dispRangeToLcl={fis.dispRangeToLcl}
            stationOperationTaskEnabled={this.state.stationOperationTaskEnabled}
            flightMovementEnabled={this.state.flightMovementEnabled}
            multipleFlightMovementEnabled={this.state.multipleFlightMovementEnabled}
            mvtMsgEnabled={this.state.mvtMsgEnabled}
            flightDetailEnabled={this.state.flightDetailEnabled}
            flightListEnabled={this.state.flightListEnabled}
            flightRmksEnabled={this.props.jobAuth.user.myApoCd === this.props.headerInfo.apoCd && this.state.flightRmksEnabled}
            oalAircraftEnabled={this.state.oalAircraftEnabled}
            oalPaxEnabled={this.state.oalPaxEnabled}
            oalPaxStatusEnabled={this.state.oalPaxStatusEnabled}
            spotNoEnabled={this.state.spotNoEnabled}
            oalFuelEnabled={this.state.oalFuelEnabled}
            isSortArrival={fis.isSortArrival}
            isSortTwoColumnMode={fis.isSortTwoColumnMode}
            doAnimation={this.doRowAnimation}
            isDarkMode={this.props.isDarkMode}
            acarsStatus={this.props.fis.shipNoToAcarsSts[row.fis.shipNo]}
            presentTime={this.state.presentTime}
          />
        </Row>
      );
    }
    return null;
  };

  rowHeight = (index: number) => (this.includeHeader(index) ? 22 : storage.isPc ? 90 : 92);

  // 表示対象日の①の最後の便を一番上の行に表示する
  scrollToCurrent = (forceScroll: boolean) => {
    this.defaultScrollIndex = this.getDefaultScrollIndex();
    if (forceScroll || !(this.props.isAutoReload && this.props.isSelfScroll)) {
      setTimeout(() => {
        if (this.virtualList.current) {
          this.virtualList.current.scrollToItem(this.defaultScrollIndex, "start");
        }
      }, 1);
    }
  };

  includeHeader = (index: number) => {
    const row = this.rowsWithDate.get(index);
    return row && row.isDate;
  };

  createRowsWithDate(filteredFisRows: List<{ date: string; fis: FisRowType }>) {
    let rowWithDate = List.of<{ date: string; fis?: FisRowType; isDate: boolean }>();

    for (let i = 0; i < filteredFisRows.size; i++) {
      const row = filteredFisRows.get(i);
      const prevRow = filteredFisRows.get(i - 1);

      if (row && prevRow) {
        if (i !== 0 && row.date !== prevRow.date) {
          rowWithDate = rowWithDate.push({ date: row.date, isDate: true });
        }
        rowWithDate = rowWithDate.push({ ...row, isDate: false });
      }
    }

    return rowWithDate;
  }

  render() {
    const { dispatch, scrollbarWidth, fis, fisFilterModal, zoomFis, filteredFisRows } = this.props;
    const { scrollToTopIsVisible, stickyDate } = this.state;
    const stickyDateDayjs = stickyDate ? dayjs(stickyDate, "YYYYMMDD") : null;
    return (
      <>
        <Wrapper isPc={storage.isPc} zoom={zoomFis}>
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => (
              <div ref={this.autoSizerRef}>
                <ListHeaderArea
                  tabIndex={-1}
                  width={width >= Const.FIS_MIN_WIDTH ? width : Const.FIS_MIN_WIDTH}
                  height={this.HEADER_HEIGHT}
                >
                  {this.headerRender()}
                </ListHeaderArea>
                {this.rowCount() !== 0 && (
                  <StickyDateHeader scrollbarWidth={scrollbarWidth}>
                    <span>{stickyDateDayjs && stickyDateDayjs.isValid() ? stickyDateDayjs.format("DDMMM").toUpperCase() : ""}</span>
                    <div />
                  </StickyDateHeader>
                )}
                <VariableSizeList
                  // tabIndex={-1}
                  ref={this.virtualList}
                  width={width >= Const.FIS_MIN_WIDTH ? width : Const.FIS_MIN_WIDTH}
                  height={height - this.HEADER_HEIGHT - 28} // height - ソート用ヘッダーの高さ(PC or iPad) - 日付固定ヘッダーの高さ
                  itemCount={this.rowCount()}
                  itemSize={this.rowHeight}
                  overscanCount={Const.FIS_OVERSCAN_ROW_COUNT}
                  style={{ outline: "none", overflowX: "hidden", overflowY: "scroll", marginTop: "28px" }}
                  onScroll={this.handleScroll}
                  initialScrollOffset={this.getDefaultScrollIndex()}
                >
                  {this.rowRenderer}
                </VariableSizeList>
              </div>
            )}
          </AutoSizer>
          <SearchButtonContainer isPc={storage.isPc}>
            <SearchButton isFiltered={fisFilterModal.isFiltered} onClick={this.handleFisFilterModal} />
          </SearchButtonContainer>
          <InitialPositionButtonContainer zoomParent={zoomFis}>
            {storage.isPc ? (
              <FisFiletrText
                isPc={storage.isPc}
                focused={this.state.fisFiletrInputFocused}
                isFiltered={fisFilterModal.isFiltered}
                keyword={this.state.filteredKeyword}
              >
                <FisFiletrInput
                  ref={this.filetrTextRef}
                  focused={this.state.fisFiletrInputFocused}
                  tabIndex={10}
                  placeholder="Filter"
                  onKeyPress={this.handleFilterKeyPress}
                  value={this.state.filteredKeyword}
                  onChange={this.handleFilterChanged}
                  onFocus={() => this.setState({ fisFiletrInputFocused: true })}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                    this.setState({ filteredKeyword: removePictograph(e.target.value), fisFiletrInputFocused: false })
                  }
                />
                <FisFiletrArrow
                  onClick={() => {
                    if (this.filetrTextRef.current) {
                      this.filetrTextRef.current.focus();
                      this.setState({ fisFiletrInputFocused: true });
                    }
                    this.props.openFlightSearchModal();
                  }}
                >
                  <span />
                  <span />
                </FisFiletrArrow>
                <FisFiletrIconBox isFiltered={fisFilterModal.isFiltered} onClick={this.handleFilterOnClick}>
                  <FisFiletrIcon />
                </FisFiletrIconBox>
              </FisFiletrText>
            ) : null}
            <InitialPositionButton isDisplaying={scrollToTopIsVisible} onClick={this.handleScrollToCurrent} />
          </InitialPositionButtonContainer>
          {fis.fetchFisResult.retry ? (
            <ErrorPopup dispatch={dispatch} isError={fis.fetchFisResult.isError} retry={fis.fetchFisResult.retry} />
          ) : undefined}
        </Wrapper>
        <ThemeProvider theme={lightTheme}>
          <MultipleFlightMovementModalDep filteredFisRows={filteredFisRows} fisCenterContentRef={this.centerContentRef} />
          <MultipleFlightMovementModalArr filteredFisRows={filteredFisRows} fisCenterContentRef={this.centerContentRef} />
        </ThemeProvider>
      </>
    );
  }
}

const Wrapper = styled.div<{ isPc: boolean; zoom: number }>`
  zoom: ${({ zoom }) => zoom / 100};
  width: 100%;
  min-width: 100vw;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  margin-right: auto;
  margin-left: auto;
  background-color: ${({ theme }) => theme.color.fis.background};
  font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
`;

const ListHeaderArea = styled.div<{ height: number; width: number }>`
  position: relative;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  overflow: hidden;
`;

const ListHeaderWrapper = styled.div<{ scrollbarWidth: number }>`
  padding-right: ${(props) => props.scrollbarWidth}px;
`;

const showHeaderContentFromHide = keyframes`
  0%   { width: 0; max-width: 0; overflow: hidden; }
  100% { width: 33%; max-width: 100%; overflow: hidden; }
`;

const showHeaderContentFromLong = (theme: DefaultTheme) => keyframes`
  0%   { width: 66%; max-width: 100%; overflow: hidden; background: ${theme.color.fis.header.background.inactive} }
  100% { width: 33%; max-width: 100%; overflow: hidden; background: ${theme.color.fis.header.background.active} }
`;

const longHeaderContent = (theme: DefaultTheme) => keyframes`
  0%   { width: 33%; max-width: 100%; overflow: hidden; background: ${theme.color.fis.header.background.active} }
  100% { width: 66%; max-width: 100%; overflow: hidden; background: ${theme.color.fis.header.background.inactive} }
`;

const hideHeaderContent = keyframes`
  0%   { width: 33%; max-width: 100%; overflow: hidden; }
  100% { width: 0; max-width: 0; overflow: hidden; }
`;

const ListHeader = styled.div<{ isPc: boolean; isSortArrival: boolean; isSortTwoColumnMode: boolean; doAnimation: boolean }>`
  display: flex;
  text-align: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.color.PRIMARY_BASE};
  .headerContentArr {
    background: ${({ theme }) => theme.color.fis.header.background.active};
    ${({ isPc }) => (isPc ? "flex: 1;" : "width: 33%;")};
    ${({ doAnimation, isSortArrival, theme }) =>
      doAnimation
        ? css`
            animation: ${isSortArrival ? showHeaderContentFromLong(theme) : showHeaderContentFromHide} 0.3s;
          `
        : ""}
  }
  .headerContentDep {
    background: ${({ theme }) => theme.color.fis.header.background.active};
    ${({ isPc }) => (isPc ? "flex: 1;" : "width: 33%;")};
    ${({ doAnimation, isSortArrival, theme }) =>
      doAnimation
        ? css`
            animation: ${!isSortArrival ? showHeaderContentFromLong(theme) : showHeaderContentFromHide} 0.3s;
          `
        : ""}
  }
  .headerContentLong {
    background: ${({ theme }) => theme.color.fis.header.background.inactive};
    width: 66%;
    ${({ doAnimation, theme }) =>
      doAnimation
        ? css`
            animation: ${longHeaderContent(theme)} 0.3s;
          `
        : ""};
  }
  .headerContentHide {
    background: ${({ theme }) => theme.color.fis.header.background.active};
    max-width: 0;
    overflow: hidden;
    ${({ doAnimation }) =>
      doAnimation
        ? css`
            animation: ${hideHeaderContent} 0.3s;
          `
        : ""}
  }
  .centerContent {
    ${({ isPc }) => (isPc ? "width: 352px;" : "flex: 4;")};
    ${({ isPc }) => (isPc ? "max-width: 352px;" : "")};
    background: ${({ isPc, theme }) => (isPc ? theme.color.fis.header.background.inactive : theme.color.fis.header.background.active)};
  }
  max-width: ${Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
`;

const StickyDateHeader = styled.div<{ scrollbarWidth: number }>`
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: ${({ theme }) => theme.color.fis.date.background};
  color: ${({ theme }) => theme.color.fis.date.color};
  position: absolute;
  > span {
    background: ${({ theme }) => theme.color.fis.date.background};
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    width: 84px;
    margin: auto;
  }
  > div {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.color.fis.date.borderColor};
    position: absolute;
    top: 13px;
    z-index: 0;
  }
  max-width: ${Const.MAX_WIDTH};
  right: ${(props) => props.scrollbarWidth}px;
  left: 0;
  margin: auto;
`;
const DateHeader = styled.div`
  width: 100%;
  height: 28px;
  margin-top: -5px;
  margin-bottom: 0px;
  text-align: center;
  background: ${({ theme }) => theme.color.fis.date.background};
  color: ${({ theme }) => theme.color.fis.date.color};
  position: relative;
  display: flex;
  align-items: center;
  > span {
    background: ${({ theme }) => theme.color.fis.date.background};
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    width: 84px;
    margin: auto;
  }
  > div {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.color.fis.date.borderColor};
    position: absolute;
    top: 12px;
    z-index: 0;
  }
  max-width: ${Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
`;

const SortButton = styled.div<{ height: number; isSortTwoColumnMode: boolean; isLeft: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => `${height}px`};
  border-top: 1px solid ${(props) => props.theme.color.fis.background};
  ${({ isLeft, theme }) => `${isLeft ? "border-left: " : "border-right: "}1px solid ${theme.color.fis.background}`};
  border-bottom: none;
  cursor: ${({ isSortTwoColumnMode }) => (!isSortTwoColumnMode ? "pointer" : "inherit")};
  > div:first-child {
    min-width: 80px;
  }
  > div:last-child {
    min-width: 80px;
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .SortedArrow {
    margin-left: 7px;
    min-width: 15px;
    display: flex;
    align-items: center;
    svg {
      width: 12px;
      height: 12px;
    }
  }
  .FlightSign {
    margin-left: 5px;
    margin-top: 1px;
    position: relative;
    font-size: 12px;
    line-height: 12px;
    /* width: 50px; */
    width: 44px;
    border: solid 1.2px ${(props) => props.theme.color.PRIMARY_BASE};
    border-radius: 5px;
    padding: 1px 2px 1px 2px;
    /* 斜線 */
    /* ::before {
      content: "";
      display: inline-block;
      position: absolute;
      height: 1.2px;
      width: 47.5px;
      top: 6.5px;
      left: 0.3px;
      background-color: #FFF;
      transform:rotate(-17deg) skew(40deg);
    } */
  }
`;
const StationOperationHeader = styled.div<{ isPc: boolean; height: number }>`
  width: auto;
  line-height: ${({ height }) => `${height}px`};
  border: 1px solid ${(props) => props.theme.color.fis.background};
  border-bottom: none;
  cursor: ${({ isPc }) => (isPc ? "inherit" : "pointer")};
`;

const Row = styled.div``;

const SearchButtonContainer = styled.div<{ isPc: boolean }>`
  position: absolute;
  right: 44px;
  bottom: 120px;
  display: ${({ isPc }) => (isPc ? "none" : "grid")};
`;

const InitialPositionButtonContainer = styled.div<{ zoomParent: number }>`
  zoom: ${({ zoomParent }) => 100 / zoomParent};
  position: absolute;
  right: 44px;
  bottom: 44px;
  display: flex;
`;

// フィルタボックスの機能は仕様が変わりやすいので引数やコメントを残している
const FisFiletrText = styled.div<{ isPc: boolean; focused: boolean; isFiltered: boolean; keyword: string }>`
  box-sizing: content-box;
  display: ${({ isPc }) => (isPc ? "flex" : "none")};
  height: 26px;
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.color.PRIMARY_BASE};
  position: relative;
  margin-right: 36px;
  margin-top: auto;
  margin-bottom: auto;
  backdrop-filter: blur(5px);
  box-shadow: 3px 3px 6px ${({ theme }) => theme.color.filter.boxShadowColor};
  opacity: ${({ focused, keyword }) => (focused || !!keyword ? "1" : ".4")};
  &:hover {
    opacity: 1;
  }
`;

const FisFiletrInput = styled.input<{ focused: boolean }>`
  line-height: normal; /* safariでテキストを上下中央にする */
  width: 360px;
  max-width: 500px;
  margin-left: 6px;
  background-color: transparent;
  font-size: 15px;
  color: ${({ focused, theme }) => (focused ? theme.color.filter.color : "#000")};
  border: none;
  &::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
`;

const FisFiletrArrow = styled.div`
  width: 30px;
  cursor: pointer;
  display: flex;
  span:nth-child(1) {
    position: absolute;
    top: 8px;
    right: 41px;
    width: 0;
    height: 0;
    border-top: 11px solid ${({ theme }) => theme.color.PRIMARY};
    border-right: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid transparent;
  }
  span:nth-child(2) {
    position: absolute;
    top: 9px;
    right: 43px;
    width: 0;
    height: 0;
    border-top: 8px solid ${({ theme }) => theme.color.PRIMARY_BASE};
    border-right: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid transparent;
  }
`;

const FisFiletrIconBox = styled.div<{ isFiltered: boolean }>`
  position: absolute;
  cursor: pointer;
  right: 0;
  height: 100%;
  width: 34px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ isFiltered, theme }) => (isFiltered ? theme.color.filter.button.filtered : theme.color.PRIMARY)};
`;

const FisFiletrIcon = styled.img.attrs({ src: iconSearchSvg })`
  height: 16px;
  width: 16px;
`;

export default FisTable;
