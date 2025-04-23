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
const react_1 = __importDefault(require("react"));
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const immutable_1 = require("immutable");
const lodash_1 = require("lodash");
const dayjs_1 = __importDefault(require("dayjs"));
const styled_components_1 = __importStar(require("styled-components"));
const react_window_1 = require("react-window");
const react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
const themeLight_1 = __importDefault(require("../../../themes/themeLight"));
const commonUtil_1 = require("../../../lib/commonUtil");
const commonConst_1 = require("../../../lib/commonConst");
const storage_1 = require("../../../lib/storage");
const validates = __importStar(require("../../../lib/validators"));
const fisExports = __importStar(require("../../../reducers/fis"));
const fisFilterModalExports = __importStar(require("../../../reducers/fisFilterModal"));
const ErrorPopup_1 = __importDefault(require("../../molecules/ErrorPopup"));
const FisRow_1 = __importDefault(require("../../molecules/FisRow"));
const InitialPositionButton_1 = __importDefault(require("../../atoms/InitialPositionButton"));
const SearchButton_1 = __importDefault(require("../../atoms/SearchButton"));
const FilterKeyword_1 = __importDefault(require("./FilterKeyword"));
const MultipleFlightMovementModalArr_1 = __importDefault(require("../MultipleFlightMovement/MultipleFlightMovementModalArr"));
const MultipleFlightMovementModalDep_1 = __importDefault(require("../MultipleFlightMovement/MultipleFlightMovementModalDep"));
const icon_search_svg_1 = __importDefault(require("../../../assets/images/icon/icon-search.svg"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _fisDefault, slice: _fisSlice, doQueueFunctionAll, ...fisActions } = fisExports;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _fisFilterModalDefault, slice: _fisFilterModalSlice, ...fisFilterModalActions } = fisFilterModalExports;
class FisTable extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.defaultScrollIndex = 0;
        this.autoSizerRef = react_1.default.createRef();
        this.filetrTextRef = react_1.default.createRef();
        this.centerContentRef = react_1.default.createRef();
        this.doRowAnimation = false;
        this.HEADER_HEIGHT = storage_1.storage.isPc ? 24 : 30;
        this.isFilterTextChanged = false;
        this.updateTimeLclSetTimer = null;
        this.handleFisFilterModal = () => {
            const { resetOthreForm, fisFilterModal } = this.props;
            if (!fisFilterModal.isFiltered) {
                this.props.openFlightSearchModal();
            }
            else {
                resetOthreForm("fisFilterModal");
                // データの初期化が追い付かないので、あえてローカル変数で指定
                const initSearchParams = {
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
        this.handleFilterKeyPress = (e) => {
            // enterキーを押したときのみ実行
            if (e.key !== "Enter") {
                return;
            }
            void this.filterByText(e.target.value);
        };
        this.handleFilterChanged = (e) => {
            const { fisFilterModal: { isFiltered }, } = this.props;
            this.setState({ filteredKeyword: e.target.value });
            if (isFiltered) {
                // フォームを初期化し無条件で検索
                this.isFilterTextChanged = true;
                this.props.resetOthreForm("fisFilterModal");
                void this.filterByText("");
            }
        };
        this.handleFilterOnClick = () => {
            const { fisFilterModal: { isFiltered }, } = this.props;
            if (isFiltered) {
                void this.filterByText("");
            }
            else {
                void this.filterByText(this.state.filteredKeyword);
            }
        };
        // 表示対象日の①の最後の便を一番上の行に表示する
        this.handleScrollToCurrent = () => {
            this.scrollToCurrent(true);
        };
        this.handleArrivalSort = () => {
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
        this.handleDepartureSort = () => {
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
        this.handleTwoColumnMode = () => {
            const { changeSort } = this.props;
            const { isSortArrival, isSortTwoColumnMode } = this.props.fis;
            if (storage_1.storage.isPc) {
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
        this.getDefaultScrollIndex = () => {
            // 当日日付で検索した場合、グループ1の最後をスクロール位置とする
            const firstGroupRows = this.rowsWithDate.filter((d) => { var _a; return !d.isDate && ((_a = d.fis) === null || _a === void 0 ? void 0 : _a.sortGroupNo) === 1 && d.date === (0, dayjs_1.default)(this.props.headerInfo.targetDate).format("YYYYMMDD"); });
            if (firstGroupRows.size > 0) {
                const firstGroupTail = firstGroupRows.get(firstGroupRows.size - 1);
                return this.rowsWithDate.findIndex((d) => d === firstGroupTail);
            }
            // グループ1が存在しない場合は、当日日付の先頭をスクロール位置とする
            const index = this.rowsWithDate.findIndex((d) => !d.isDate && d.date === (0, dayjs_1.default)(this.props.headerInfo.targetDate).format("YYYYMMDD"));
            // 当日日付がない場合は一番上にする
            return index === -1 ? 0 : index;
        };
        this.filterKeyword = (fisFilterModal) => {
            const { searchParams } = fisFilterModal;
            const filterKeyword = new FilterKeyword_1.default(searchParams, this.props.master);
            const filterString = filterKeyword.toString();
            return filterString;
        };
        this.filterByText = async (filterText) => {
            const { changeOthreForm, resetOthreForm, master } = this.props;
            const regex = /(?<token_string>(?:(?<field_name>\w+):)?(?:(?:"(?<quoted_term>.*?)")|(?<term>\S+)))/g;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const matches = [];
            let match = null;
            // 意図的なので許容する
            // eslint-disable-next-line no-cond-assign
            while ((match = regex.exec(filterText)) != null) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                matches.push(match);
            }
            // 検索する前に検索フォームを初期化する
            resetOthreForm("fisFilterModal");
            let dateTimeRadio = "";
            let dateTimeTo = "";
            let dateTimeFrom = "";
            let cnlHideFlg = false;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            await matches.forEach((m) => {
                const { field_name, term } = m.groups;
                const FIELD_NAME = (0, commonUtil_1.toUpperCase)(field_name);
                const TERM = (0, commonUtil_1.toUpperCase)(term);
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
                            }
                            else {
                                inputAls.push(als[i]);
                            }
                        }
                        if (isAll) {
                            changeOthreForm("fisFilterModal", "airLineCodeOALAll", true);
                        }
                        else if (inputAls && inputAls.length && !validates.isOkAls(inputAls)) {
                            changeOthreForm("fisFilterModal", "airLineCodeOAL", (0, lodash_1.uniq)(inputAls).slice(0, 10));
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
                            changeOthreForm("fisFilterModal", "spot", (0, lodash_1.uniq)(spot).slice(0, 10));
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
                        if (term && term.length === 4 && (0, dayjs_1.default)(term, "HHmm").format("HHmm") !== "Invalid date") {
                            dateTimeFrom = (0, dayjs_1.default)(term, "HHmm").format("HHmm");
                        }
                        break;
                    }
                    case "BEFORE": {
                        if (term && term.length === 4 && (0, dayjs_1.default)(term, "HHmm").format("HHmm") !== "Invalid date") {
                            dateTimeTo = (0, dayjs_1.default)(term, "HHmm").format("HHmm");
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
                            changeOthreForm("fisFilterModal", "flightNo", isCasual ? (0, commonUtil_1.toUpperCase)(removedCasualFlgTerm) : (0, commonUtil_1.formatFlt)(removedCasualFlgTerm));
                            changeOthreForm("fisFilterModal", "casualFlg", isCasual);
                        }
                    }
                }
            });
            if (dateTimeRadio && (dateTimeFrom || dateTimeTo)) {
                changeOthreForm("fisFilterModal", "dateTimeRadio", dateTimeRadio);
                if (dateTimeFrom)
                    changeOthreForm("fisFilterModal", "dateTimeFrom", dateTimeFrom);
                if (dateTimeTo)
                    changeOthreForm("fisFilterModal", "dateTimeTo", dateTimeTo);
            }
            changeOthreForm("fisFilterModal", "cnlHideFlg", cnlHideFlg);
            // if (this.filetrTextRef.current) this.filetrTextRef.current.focus();
            this.props.searchFis(this.props.fisFilterModalFormValues);
        };
        this.setStickyDate = (scrollInfo) => {
            if (this.rowsWithDate.isEmpty())
                return; // データがない場合は処理しない
            if (!scrollInfo)
                return;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { scrollOffset } = scrollInfo;
            const autoSizerNode = this.autoSizerRef.current;
            if (autoSizerNode &&
                autoSizerNode.lastElementChild &&
                autoSizerNode.lastElementChild.firstElementChild &&
                autoSizerNode.lastElementChild.firstElementChild.children) {
                const nodes = Array.from(autoSizerNode.lastElementChild.firstElementChild.children);
                let matchNode;
                // マッチしたNodeの中が一番上の位置に着ているか
                let matchNodeTopPosition = false;
                nodes.forEach((node, index) => {
                    const { height } = node.getBoundingClientRect();
                    const top = node.offsetTop;
                    const relativeTop = top - scrollOffset;
                    if (node.dataset.isDate === "true") {
                        if (relativeTop <= 0 && relativeTop >= -(height / 2)) {
                            // 日付行の上半分がTOPに着たら、前の日付にする
                            matchNode = nodes[index - 1];
                            return;
                        }
                        if (-(height / 2) >= relativeTop && relativeTop >= -height) {
                            // 日付行の上半分がTOPに着たら、次の日付にする
                            matchNode = nodes[index + 1];
                            return;
                        }
                    }
                    if (relativeTop < 2 && relativeTop >= -height) {
                        // zoomで縮小されていると2ポイント程度ずれるのでそれを考慮する
                        // TOPにあるFIS行の日付にする
                        matchNode = node;
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
                }
                else if (matchNode) {
                    this.setState({ stickyDate: matchNode.dataset.fisDate });
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
                }
                else {
                    this.setState({ scrollToTopIsVisible: true });
                }
            }
        };
        this.handleScroll = (props) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            this.scrollInfo = props || this.scrollInfo; // scroll情報を保存
            this.setStickyDate(this.scrollInfo);
        };
        this.rowCount = () => this.rowsWithDate.size;
        this.headerRender = () => {
            const { scrollbarWidth } = this.props;
            const { isSortArrival, isSortAsc, isSortNoTowing, isSortTwoColumnMode } = this.props.fis;
            return (react_1.default.createElement(ListHeaderWrapper, { scrollbarWidth: scrollbarWidth },
                react_1.default.createElement(ListHeader, { isPc: storage_1.storage.isPc, isSortArrival: isSortArrival, isSortTwoColumnMode: isSortTwoColumnMode, doAnimation: this.doRowAnimation },
                    react_1.default.createElement("div", { className: isSortArrival && isSortTwoColumnMode ? "headerContentLong" : isSortTwoColumnMode ? "headerContentHide" : "headerContentArr", onClick: this.handleArrivalSort },
                        react_1.default.createElement(SortButton, { height: this.HEADER_HEIGHT, isSortTwoColumnMode: isSortTwoColumnMode, isLeft: true },
                            react_1.default.createElement("div", null),
                            react_1.default.createElement("div", null, "Arrival"),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("div", { className: "SortedArrow" }, isSortArrival ? isSortAsc ? react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faArrowDown }) : react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faArrowDown }) : ""),
                                isSortArrival && isSortNoTowing ? react_1.default.createElement("div", { className: "FlightSign" }, "Flight") : ""))),
                    react_1.default.createElement("div", { className: "centerContent", ref: this.centerContentRef, onClick: this.handleTwoColumnMode },
                        react_1.default.createElement(StationOperationHeader, { isPc: storage_1.storage.isPc, height: this.HEADER_HEIGHT }, "Station Operation")),
                    react_1.default.createElement("div", { className: !isSortArrival && isSortTwoColumnMode ? "headerContentLong" : isSortTwoColumnMode ? "headerContentHide" : "headerContentDep", onClick: this.handleDepartureSort },
                        react_1.default.createElement(SortButton, { height: this.HEADER_HEIGHT, isSortTwoColumnMode: isSortTwoColumnMode, isLeft: false },
                            react_1.default.createElement("div", null),
                            react_1.default.createElement("div", null, "Departure"),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("div", { className: "SortedArrow" }, !isSortArrival ? isSortAsc ? react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faArrowDown }) : react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faArrowDown }) : ""),
                                !isSortArrival && isSortNoTowing ? react_1.default.createElement("div", { className: "FlightSign" }, "Flight") : ""))))));
        };
        this.rowRenderer = ({ index, style }) => {
            const { fis, zoomFis } = this.props;
            const row = this.rowsWithDate.get(index);
            if (!row)
                return null;
            if (row.isDate) {
                return (react_1.default.createElement(Row, { "data-is-date": true, "data-fis-date": row.date, key: index, "data-fis-index": index, style: style },
                    react_1.default.createElement(DateHeader, null,
                        react_1.default.createElement("span", null, (0, dayjs_1.default)(row.date).format("DDMMM").toUpperCase()),
                        react_1.default.createElement("div", null))));
            }
            if (row.fis) {
                return (react_1.default.createElement(Row, { "data-is-date": false, "data-fis-date": row.date, key: index, "data-fis-index": index, style: style },
                    react_1.default.createElement(FisRow_1.default, { isMySchedule: false, selectedApoCd: fis.apoCd, timeDiffUtc: fis.timeDiffUtc, fisRow: row.fis, zoomFis: zoomFis, dispRangeFromLcl: fis.dispRangeFromLcl, dispRangeToLcl: fis.dispRangeToLcl, stationOperationTaskEnabled: this.state.stationOperationTaskEnabled, flightMovementEnabled: this.state.flightMovementEnabled, multipleFlightMovementEnabled: this.state.multipleFlightMovementEnabled, mvtMsgEnabled: this.state.mvtMsgEnabled, flightDetailEnabled: this.state.flightDetailEnabled, flightListEnabled: this.state.flightListEnabled, flightRmksEnabled: this.props.jobAuth.user.myApoCd === this.props.headerInfo.apoCd && this.state.flightRmksEnabled, oalAircraftEnabled: this.state.oalAircraftEnabled, oalPaxEnabled: this.state.oalPaxEnabled, oalPaxStatusEnabled: this.state.oalPaxStatusEnabled, spotNoEnabled: this.state.spotNoEnabled, oalFuelEnabled: this.state.oalFuelEnabled, isSortArrival: fis.isSortArrival, isSortTwoColumnMode: fis.isSortTwoColumnMode, doAnimation: this.doRowAnimation, isDarkMode: this.props.isDarkMode, acarsStatus: this.props.fis.shipNoToAcarsSts[row.fis.shipNo], presentTime: this.state.presentTime })));
            }
            return null;
        };
        this.rowHeight = (index) => (this.includeHeader(index) ? 22 : storage_1.storage.isPc ? 90 : 92);
        // 表示対象日の①の最後の便を一番上の行に表示する
        this.scrollToCurrent = (forceScroll) => {
            this.defaultScrollIndex = this.getDefaultScrollIndex();
            if (forceScroll || !(this.props.isAutoReload && this.props.isSelfScroll)) {
                setTimeout(() => {
                    if (this.virtualList.current) {
                        this.virtualList.current.scrollToItem(this.defaultScrollIndex, "start");
                    }
                }, 1);
            }
        };
        this.includeHeader = (index) => {
            const row = this.rowsWithDate.get(index);
            return row && row.isDate;
        };
        const filteredfisRow = props.filteredFisRows.first();
        this.state = {
            presentTime: props.fis.timeLclDayjs,
            stickyDate: filteredfisRow ? filteredfisRow.date : null,
            scrollToTopIsVisible: false,
            stationOperationTaskEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOperationTask, this.props.jobAuth.jobAuth),
            flightMovementEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalFlightMovement, this.props.jobAuth.jobAuth),
            multipleFlightMovementEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openMultipleFlightMovement, this.props.jobAuth.jobAuth),
            mvtMsgEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openMvtMsg, this.props.jobAuth.jobAuth),
            flightDetailEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, this.props.jobAuth.jobAuth),
            flightListEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openShipTransitList, this.props.jobAuth.jobAuth),
            flightRmksEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateFlightRemarks, this.props.jobAuth.jobAuth),
            oalAircraftEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalAircraft, this.props.jobAuth.jobAuth),
            oalPaxEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalPax, this.props.jobAuth.jobAuth),
            oalFuelEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalFuel, this.props.jobAuth.jobAuth),
            oalPaxStatusEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalPaxStatus, this.props.jobAuth.jobAuth),
            spotNoEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openSpotNo, this.props.jobAuth.jobAuth),
            filteredKeyword: "",
            fisFiletrInputFocused: false,
        };
        this.virtualList = react_1.default.createRef();
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
    shouldComponentUpdate(nextProps) {
        if (nextProps.fis.isSortTwoColumnMode !== this.props.fis.isSortTwoColumnMode) {
            this.doRowAnimation = true;
        }
        if (!this.props.fisFilterModal.isForceFilter && nextProps.fisFilterModal.isForceFilter) {
            this.props.forceFiltered();
            return true;
        }
        // モーダルを開閉した時に、フィルターした結果のFIS配列が変わってなければrenderしない(FIS配列が0件の場合を除く)
        if (nextProps.filteredFisRows.size > 0 &&
            (0, lodash_1.isEqual)(nextProps.filteredFisRows, this.props.filteredFisRows) &&
            this.props.fisFilterModal.modalIsOpen !== nextProps.fisFilterModal.modalIsOpen) {
            return false;
        }
        return true;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.fis.isSortTwoColumnMode !== this.props.fis.isSortTwoColumnMode) {
            // 行のアニメーションが終わった頃にOFFにする
            setTimeout(() => {
                this.doRowAnimation = false;
            }, 500);
        }
        // スケジュールが更新された時 または 対象日が変わった時 または FISの読み込み完了時
        if (prevProps.filteredFisRows !== this.props.filteredFisRows ||
            prevProps.headerInfo.targetDate !== this.props.headerInfo.targetDate ||
            (prevProps.fis.isFetching && !this.props.fis.isFetching && this.props.fis.isFetchSecceeded)) {
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
            }
            else if (this.rowsWithDate.isEmpty()) {
                this.props.showInfoNoData();
            }
        }
        // FISの読み込み完了時
        if (prevProps.fis.isFetching && !this.props.fis.isFetching && this.props.fis.isFetchSecceeded) {
            // 0件時のメッセージ
            if (!this.props.fis.timeLcl) {
                this.props.showInfoNoAirport();
            }
            else if (this.rowsWithDate.isEmpty()) {
                this.props.showInfoNoData();
            }
        }
        const { isAutoReload } = this.props;
        const prevIsAutoReload = prevProps.isAutoReload;
        // 自動更新処理
        if (!prevIsAutoReload && isAutoReload) {
            // 自動更新開始
            if (this.updateTimeLclSetTimer) {
                clearInterval(this.updateTimeLclSetTimer);
            }
            this.updateTimeLclSetTimer = setInterval(() => {
                const { presentTime } = this.state;
                if (presentTime && presentTime.isValid()) {
                    this.setState({ presentTime: presentTime.add(1, "minutes") });
                }
            }, 60000);
            // 切り替え中に飛んできたPUSHデータを処理する
            doQueueFunctionAll();
        }
        else if (this.updateTimeLclSetTimer && prevIsAutoReload && !isAutoReload) {
            // 自動更新終了
            clearInterval(this.updateTimeLclSetTimer);
        }
        // 権限更新
        if (!(0, lodash_1.isEqual)(prevProps.jobAuth, this.props.jobAuth)) {
            this.setState({
                stationOperationTaskEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOperationTask, this.props.jobAuth.jobAuth),
                flightDetailEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openFlightDetail, this.props.jobAuth.jobAuth),
                flightListEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openShipTransitList, this.props.jobAuth.jobAuth),
                flightRmksEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateFlightRemarks, this.props.jobAuth.jobAuth),
                oalAircraftEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalAircraft, this.props.jobAuth.jobAuth),
                oalPaxEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalPax, this.props.jobAuth.jobAuth),
                oalPaxStatusEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalPaxStatus, this.props.jobAuth.jobAuth),
                oalFuelEnabled: (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openOalFuel, this.props.jobAuth.jobAuth),
            });
        }
        if (this.props.fisFilterModal.searchParams !== prevProps.fisFilterModal.searchParams) {
            if (this.isFilterTextChanged) {
                this.isFilterTextChanged = false;
            }
            else {
                this.setState({ filteredKeyword: this.filterKeyword(this.props.fisFilterModal) });
            }
        }
    }
    componentWillUnmount() {
        this.props.mqttDisconnect();
        this.props.dispatch(fisExports.clear());
    }
    createRowsWithDate(filteredFisRows) {
        let rowWithDate = immutable_1.List.of();
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
        const stickyDateDayjs = stickyDate ? (0, dayjs_1.default)(stickyDate, "YYYYMMDD") : null;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Wrapper, { isPc: storage_1.storage.isPc, zoom: zoomFis },
                react_1.default.createElement(react_virtualized_auto_sizer_1.default, null, ({ height, width }) => (react_1.default.createElement("div", { ref: this.autoSizerRef },
                    react_1.default.createElement(ListHeaderArea, { tabIndex: -1, width: width >= commonConst_1.Const.FIS_MIN_WIDTH ? width : commonConst_1.Const.FIS_MIN_WIDTH, height: this.HEADER_HEIGHT }, this.headerRender()),
                    this.rowCount() !== 0 && (react_1.default.createElement(StickyDateHeader, { scrollbarWidth: scrollbarWidth },
                        react_1.default.createElement("span", null, stickyDateDayjs && stickyDateDayjs.isValid() ? stickyDateDayjs.format("DDMMM").toUpperCase() : ""),
                        react_1.default.createElement("div", null))),
                    react_1.default.createElement(react_window_1.VariableSizeList
                    // tabIndex={-1}
                    , { 
                        // tabIndex={-1}
                        ref: this.virtualList, width: width >= commonConst_1.Const.FIS_MIN_WIDTH ? width : commonConst_1.Const.FIS_MIN_WIDTH, height: height - this.HEADER_HEIGHT - 28, itemCount: this.rowCount(), itemSize: this.rowHeight, overscanCount: commonConst_1.Const.FIS_OVERSCAN_ROW_COUNT, style: { outline: "none", overflowX: "hidden", overflowY: "scroll", marginTop: "28px" }, onScroll: this.handleScroll, initialScrollOffset: this.getDefaultScrollIndex() }, this.rowRenderer)))),
                react_1.default.createElement(SearchButtonContainer, { isPc: storage_1.storage.isPc },
                    react_1.default.createElement(SearchButton_1.default, { isFiltered: fisFilterModal.isFiltered, onClick: this.handleFisFilterModal })),
                react_1.default.createElement(InitialPositionButtonContainer, { zoomParent: zoomFis },
                    storage_1.storage.isPc ? (react_1.default.createElement(FisFiletrText, { isPc: storage_1.storage.isPc, focused: this.state.fisFiletrInputFocused, isFiltered: fisFilterModal.isFiltered, keyword: this.state.filteredKeyword },
                        react_1.default.createElement(FisFiletrInput, { ref: this.filetrTextRef, focused: this.state.fisFiletrInputFocused, tabIndex: 10, placeholder: "Filter", onKeyPress: this.handleFilterKeyPress, value: this.state.filteredKeyword, onChange: this.handleFilterChanged, onFocus: () => this.setState({ fisFiletrInputFocused: true }), onBlur: (e) => this.setState({ filteredKeyword: (0, commonUtil_1.removePictograph)(e.target.value), fisFiletrInputFocused: false }) }),
                        react_1.default.createElement(FisFiletrArrow, { onClick: () => {
                                if (this.filetrTextRef.current) {
                                    this.filetrTextRef.current.focus();
                                    this.setState({ fisFiletrInputFocused: true });
                                }
                                this.props.openFlightSearchModal();
                            } },
                            react_1.default.createElement("span", null),
                            react_1.default.createElement("span", null)),
                        react_1.default.createElement(FisFiletrIconBox, { isFiltered: fisFilterModal.isFiltered, onClick: this.handleFilterOnClick },
                            react_1.default.createElement(FisFiletrIcon, null)))) : null,
                    react_1.default.createElement(InitialPositionButton_1.default, { isDisplaying: scrollToTopIsVisible, onClick: this.handleScrollToCurrent })),
                fis.fetchFisResult.retry ? (react_1.default.createElement(ErrorPopup_1.default, { dispatch: dispatch, isError: fis.fetchFisResult.isError, retry: fis.fetchFisResult.retry })) : undefined),
            react_1.default.createElement(styled_components_1.ThemeProvider, { theme: themeLight_1.default },
                react_1.default.createElement(MultipleFlightMovementModalDep_1.default, { filteredFisRows: filteredFisRows, fisCenterContentRef: this.centerContentRef }),
                react_1.default.createElement(MultipleFlightMovementModalArr_1.default, { filteredFisRows: filteredFisRows, fisCenterContentRef: this.centerContentRef }))));
    }
}
const Wrapper = styled_components_1.default.div `
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
const ListHeaderArea = styled_components_1.default.div `
  position: relative;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  overflow: hidden;
`;
const ListHeaderWrapper = styled_components_1.default.div `
  padding-right: ${(props) => props.scrollbarWidth}px;
`;
const showHeaderContentFromHide = (0, styled_components_1.keyframes) `
  0%   { width: 0; max-width: 0; overflow: hidden; }
  100% { width: 33%; max-width: 100%; overflow: hidden; }
`;
const showHeaderContentFromLong = (theme) => (0, styled_components_1.keyframes) `
  0%   { width: 66%; max-width: 100%; overflow: hidden; background: ${theme.color.fis.header.background.inactive} }
  100% { width: 33%; max-width: 100%; overflow: hidden; background: ${theme.color.fis.header.background.active} }
`;
const longHeaderContent = (theme) => (0, styled_components_1.keyframes) `
  0%   { width: 33%; max-width: 100%; overflow: hidden; background: ${theme.color.fis.header.background.active} }
  100% { width: 66%; max-width: 100%; overflow: hidden; background: ${theme.color.fis.header.background.inactive} }
`;
const hideHeaderContent = (0, styled_components_1.keyframes) `
  0%   { width: 33%; max-width: 100%; overflow: hidden; }
  100% { width: 0; max-width: 0; overflow: hidden; }
`;
const ListHeader = styled_components_1.default.div `
  display: flex;
  text-align: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.color.PRIMARY_BASE};
  .headerContentArr {
    background: ${({ theme }) => theme.color.fis.header.background.active};
    ${({ isPc }) => (isPc ? "flex: 1;" : "width: 33%;")};
    ${({ doAnimation, isSortArrival, theme }) => doAnimation
    ? (0, styled_components_1.css) `
            animation: ${isSortArrival ? showHeaderContentFromLong(theme) : showHeaderContentFromHide} 0.3s;
          `
    : ""}
  }
  .headerContentDep {
    background: ${({ theme }) => theme.color.fis.header.background.active};
    ${({ isPc }) => (isPc ? "flex: 1;" : "width: 33%;")};
    ${({ doAnimation, isSortArrival, theme }) => doAnimation
    ? (0, styled_components_1.css) `
            animation: ${!isSortArrival ? showHeaderContentFromLong(theme) : showHeaderContentFromHide} 0.3s;
          `
    : ""}
  }
  .headerContentLong {
    background: ${({ theme }) => theme.color.fis.header.background.inactive};
    width: 66%;
    ${({ doAnimation, theme }) => doAnimation
    ? (0, styled_components_1.css) `
            animation: ${longHeaderContent(theme)} 0.3s;
          `
    : ""};
  }
  .headerContentHide {
    background: ${({ theme }) => theme.color.fis.header.background.active};
    max-width: 0;
    overflow: hidden;
    ${({ doAnimation }) => doAnimation
    ? (0, styled_components_1.css) `
            animation: ${hideHeaderContent} 0.3s;
          `
    : ""}
  }
  .centerContent {
    ${({ isPc }) => (isPc ? "width: 352px;" : "flex: 4;")};
    ${({ isPc }) => (isPc ? "max-width: 352px;" : "")};
    background: ${({ isPc, theme }) => (isPc ? theme.color.fis.header.background.inactive : theme.color.fis.header.background.active)};
  }
  max-width: ${commonConst_1.Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
`;
const StickyDateHeader = styled_components_1.default.div `
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
  max-width: ${commonConst_1.Const.MAX_WIDTH};
  right: ${(props) => props.scrollbarWidth}px;
  left: 0;
  margin: auto;
`;
const DateHeader = styled_components_1.default.div `
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
  max-width: ${commonConst_1.Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
`;
const SortButton = styled_components_1.default.div `
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
const StationOperationHeader = styled_components_1.default.div `
  width: auto;
  line-height: ${({ height }) => `${height}px`};
  border: 1px solid ${(props) => props.theme.color.fis.background};
  border-bottom: none;
  cursor: ${({ isPc }) => (isPc ? "inherit" : "pointer")};
`;
const Row = styled_components_1.default.div ``;
const SearchButtonContainer = styled_components_1.default.div `
  position: absolute;
  right: 44px;
  bottom: 120px;
  display: ${({ isPc }) => (isPc ? "none" : "grid")};
`;
const InitialPositionButtonContainer = styled_components_1.default.div `
  zoom: ${({ zoomParent }) => 100 / zoomParent};
  position: absolute;
  right: 44px;
  bottom: 44px;
  display: flex;
`;
// フィルタボックスの機能は仕様が変わりやすいので引数やコメントを残している
const FisFiletrText = styled_components_1.default.div `
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
const FisFiletrInput = styled_components_1.default.input `
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
const FisFiletrArrow = styled_components_1.default.div `
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
const FisFiletrIconBox = styled_components_1.default.div `
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
const FisFiletrIcon = styled_components_1.default.img.attrs({ src: icon_search_svg_1.default }) `
  height: 16px;
  width: 16px;
`;
exports.default = FisTable;
//# sourceMappingURL=FisTable.js.map