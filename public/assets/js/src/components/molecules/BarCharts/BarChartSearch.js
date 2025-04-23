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
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const lodash_flatten_1 = __importDefault(require("lodash.flatten"));
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const commonUtil_1 = require("../../../lib/commonUtil");
const storage_1 = require("../../../lib/storage");
const validates = __importStar(require("../../../lib/validators"));
const notifications_1 = require("../../../lib/notifications");
const flightNumberInputPopup_1 = require("../../../reducers/flightNumberInputPopup");
const barChartSearch_1 = require("../../../reducers/barChartSearch");
const RadioButton_1 = __importDefault(require("../../atoms/RadioButton"));
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const CheckBoxWithLabel_1 = __importDefault(require("../../atoms/CheckBoxWithLabel"));
let barChartSearchSelf = null;
class BarChartSearch extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleNextFilter = () => {
            const { flightNoValue, shipNoValue, filterRadioValue, dateMonth } = this.props;
            if (filterRadioValue === "flightNo") {
                this.onScrollToRowChangeFlightNo(flightNoValue, dateMonth, true);
            }
            else {
                this.onScrollToRowChangeShip(shipNoValue, true);
            }
        };
        this.handlePrevFilter = () => {
            const { flightNoValue, shipNoValue, filterRadioValue, dateMonth } = this.props;
            if (filterRadioValue === "flightNo") {
                this.onScrollToRowChangeFlightNo(flightNoValue, dateMonth, false);
            }
            else {
                this.onScrollToRowChangeShip(shipNoValue, false);
            }
        };
        this.handleCloseButton = () => {
            this.props.appDispatch((0, barChartSearch_1.toggleBarChartSearchDialog)());
            this.props.appDispatch((0, barChartSearch_1.clearSearchBarChart)());
        };
        this.handleFlightNumberInputPopup = () => {
            this.props.appDispatch((0, flightNumberInputPopup_1.openFlightNumberInputPopup)({
                formName: "barChartSearch",
                fieldName: "flightNo",
                currentFlightNumber: this.props.flightNoValue,
                executeSubmit: true,
                onEnter: () => { },
                canOnlyAlCd: false,
            }));
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.handleFilterRadioChange = (e) => {
            this.untouchField();
            if (e) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (e.target.value === "flightNo") {
                    this.setState({ searchedShipNo: "" });
                }
                else {
                    this.setState({ searchedFltNo: "", searchedDateMonth: "" });
                }
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.handleFlightOnBlur = (e) => {
            if (e) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                this.props.change("flightNo", this.props.casFltFlg ? (0, commonUtil_1.toUpperCase)(e.target.value) : (0, commonUtil_1.formatFlt)(e.target.value));
            }
        };
        this.onScrollToRowChangeShip = (shipNo, isNext) => {
            const { fisRowsGroupBySpot, barChartSearch, fisPullTimeStamp } = this.props;
            const { searchedShipNo, searchedFisPullTimeStamp } = this.state;
            if (this.props.filterRadioValue !== "ship") {
                return;
            }
            // 検索ワードが変更されていない場合 または 再検索されていない場合
            if (searchedShipNo &&
                barChartSearch.filterlingRowColumns.length !== 0 &&
                searchedShipNo.endsWith(shipNo) &&
                searchedFisPullTimeStamp === fisPullTimeStamp) {
                if (isNext) {
                    this.props.appDispatch((0, barChartSearch_1.searchBarChartNext)());
                }
                else {
                    this.props.appDispatch((0, barChartSearch_1.searchBarChartPrev)());
                }
                return;
            }
            // 検索に一致するバーチャートの行と列を配列で返す
            const rowColumns = (0, lodash_flatten_1.default)(fisRowsGroupBySpot.sortedSpots.map(({ spotNo }, row) => {
                const filteredSchedules = fisRowsGroupBySpot.groupedfisRowsBySpot[spotNo].filter((schedule) => schedule.shipNo && schedule.shipNo.endsWith(shipNo));
                return this.highlightRowColumns(filteredSchedules, row);
            }));
            if (rowColumns.length === 0) {
                this.props.appDispatch((0, barChartSearch_1.clearSearchBarChart)());
                void this.props.appDispatch((0, barChartSearch_1.showInfoNoData)());
                return;
            }
            const currentFilterlingIndex = isNext ? 0 : rowColumns.length - 1;
            this.props.appDispatch((0, barChartSearch_1.searchBarChart)({
                filterlingRowColumns: rowColumns,
                currentFilterlingIndex,
                scrollToRow: rowColumns[currentFilterlingIndex].row,
                scrollToColumn: rowColumns[currentFilterlingIndex].column,
                scrollToScheduleSeq: rowColumns[currentFilterlingIndex].scheduleSeq,
            }));
            this.setState({ searchedShipNo: shipNo, searchedFisPullTimeStamp: fisPullTimeStamp });
        };
        this.onScrollToRowChangeFlightNo = (flightNo, dateMonth, isNext) => {
            const { fisRowsGroupBySpot, barChartSearch, fisPullTimeStamp, casFltFlg } = this.props;
            const { searchedFltNo, searchedDateMonth, searchedFisPullTimeStamp, searchedCasFltFlg } = this.state;
            if (this.props.filterRadioValue !== "flightNo") {
                return;
            }
            // 検索ワードが変更されていない場合 または 再検索されていない場合
            if (searchedFltNo &&
                barChartSearch.filterlingRowColumns.length !== 0 &&
                searchedFltNo === flightNo &&
                searchedDateMonth === dateMonth &&
                searchedFisPullTimeStamp === fisPullTimeStamp &&
                searchedCasFltFlg === casFltFlg) {
                if (isNext) {
                    this.props.appDispatch((0, barChartSearch_1.searchBarChartNext)());
                }
                else {
                    this.props.appDispatch((0, barChartSearch_1.searchBarChartPrev)());
                }
                return;
            }
            // 検索に一致するバーチャートの行と列を配列で返す
            const rowColumns = (0, lodash_flatten_1.default)(fisRowsGroupBySpot.sortedSpots.map((spot, row) => {
                const filteredSchedules = fisRowsGroupBySpot.groupedfisRowsBySpot[spot.spotNo].filter((schedule) => {
                    if (schedule.arr &&
                        (casFltFlg ? schedule.arr.casFltNo === flightNo : schedule.arr.alCd + (0, commonUtil_1.padding0)(schedule.arr.fltNo, 4) === flightNo)) {
                        if (dateMonth) {
                            if ((0, dayjs_1.default)(schedule.arr.orgDateLcl).format("YYYYMMDD") === dateMonth) {
                                return true;
                            }
                        }
                        else {
                            return true;
                        }
                    }
                    if (schedule.dep &&
                        (casFltFlg ? schedule.dep.casFltNo === flightNo : schedule.dep.alCd + (0, commonUtil_1.padding0)(schedule.dep.fltNo, 4) === flightNo)) {
                        if (dateMonth) {
                            if ((0, dayjs_1.default)(schedule.dep.orgDateLcl).format("YYYYMMDD") === dateMonth) {
                                return true;
                            }
                        }
                        else {
                            return true;
                        }
                    }
                    return false;
                });
                return this.highlightRowColumns(filteredSchedules, row);
            }));
            if (rowColumns.length === 0) {
                this.props.appDispatch((0, barChartSearch_1.clearSearchBarChart)());
                void this.props.appDispatch((0, barChartSearch_1.showInfoNoData)());
                return;
            }
            const currentFilterlingIndex = isNext ? 0 : rowColumns.length - 1;
            this.props.appDispatch((0, barChartSearch_1.searchBarChart)({
                filterlingRowColumns: rowColumns,
                currentFilterlingIndex,
                scrollToRow: rowColumns[currentFilterlingIndex].row,
                scrollToColumn: rowColumns[currentFilterlingIndex].column,
                scrollToScheduleSeq: rowColumns[currentFilterlingIndex].scheduleSeq,
            }));
            this.setState({
                searchedFltNo: flightNo,
                searchedDateMonth: dateMonth,
                searchedFisPullTimeStamp: fisPullTimeStamp,
                searchedCasFltFlg: casFltFlg,
            });
        };
        this.handleFlightNoKeyPress = (e) => {
            if (e.key === "Enter") {
                this.props.change("flightNo", this.props.casFltFlg ? (0, commonUtil_1.toUpperCase)(e.target.value) : (0, commonUtil_1.formatFlt)(e.target.value));
            }
        };
        this.dateValues = () => {
            let start = (0, dayjs_1.default)().add(3, "day");
            const end = (0, dayjs_1.default)().subtract(6, "day");
            const daySelectList = [{ label: "", value: "" }];
            while (start.diff(end) >= 0) {
                daySelectList.push({
                    label: start.format("DDMMM").toUpperCase(),
                    value: start.format("YYYYMMDD"),
                });
                start = start.add(-1, "day");
            }
            return daySelectList;
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.shipToUpperCase = (e) => {
            if (e) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                this.props.change("shipNo", (0, commonUtil_1.toUpperCase)(e.target.value));
            }
        };
        this.state = {
            searchedFltNo: "",
            searchedDateMonth: "",
            searchedShipNo: "",
            searchedFisPullTimeStamp: 0,
            searchedCasFltFlg: false,
        };
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        barChartSearchSelf = this;
        this.onScrollToRowChangeFlightNo = this.onScrollToRowChangeFlightNo.bind(this);
        this.onScrollToRowChangeShip = this.onScrollToRowChangeShip.bind(this);
        this.handleNextFilter = this.handleNextFilter.bind(this);
        this.handlePrevFilter = this.handlePrevFilter.bind(this);
        this.handleCloseButton = this.handleCloseButton.bind(this);
        this.handleFlightNumberInputPopup = this.handleFlightNumberInputPopup.bind(this);
        this.handleFilterRadioChange = this.handleFilterRadioChange.bind(this);
        this.handleFlightOnBlur = this.handleFlightOnBlur.bind(this);
        this.shipToUpperCase = this.shipToUpperCase.bind(this);
    }
    componentDidUpdate(prevProps) {
        // 閉じたら項目とメッセージの状態をクリアする
        if (prevProps.barChartSearch.dialogIsVisible === true && this.props.barChartSearch.dialogIsVisible === false) {
            this.untouchField();
        }
    }
    highlightRowColumns(schedules, row) {
        return schedules
            .sort((a, b) => (a.xtaLcl || a.xtdLcl > b.xtaLcl || b.xtdLcl ? -1 : 1))
            .map((schedule) => {
            let column = schedule.columnStartIndex;
            // バーが前に行き過ぎないようにスペースを開ける
            if (this.props.timeScale === "4" || this.props.timeScale === "8") {
                if (schedule.columnStartMinuts < 30 && column > 0) {
                    column -= 0.5;
                }
            }
            else if (schedule.columnStartMinuts < 15 && column > 0) {
                column -= 0.25;
            }
            return {
                row,
                column,
                scheduleSeq: schedule.arrDepCtrl.seq,
            };
        });
    }
    // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
    untouchField() {
        const { untouch, appDispatch } = this.props;
        untouch("flightNo", "shipNo");
        notifications_1.NotificationCreator.removeAll({ dispatch: appDispatch });
    }
    render() {
        const { filterRadioValue, handleSubmit } = this.props;
        return (react_1.default.createElement(Container, null, this.props.barChartSearch.dialogIsVisible ? (react_1.default.createElement(WrapperForm, { onSubmit: handleSubmit, isPc: storage_1.storage.isPc },
            react_1.default.createElement(LeftColumn, null,
                react_1.default.createElement(FlightNo, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "filterRadio", id: "filterRadioFlightNo", type: "radio", value: "flightNo", component: RadioButton_1.default, isShadowOnFocus: true, onChange: this.handleFilterRadioChange }),
                    react_1.default.createElement(Label, { htmlFor: "filterRadioFlightNo" }, "FLT"),
                    react_1.default.createElement(FlightNoContainer, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "flightNo", id: "flightNo", component: TextInput_1.default, disabled: filterRadioValue !== "flightNo", width: 128, maxLength: 10, componentOnBlur: this.handleFlightOnBlur, onKeyPress: this.handleFlightNoKeyPress, validate: filterRadioValue === "flightNo"
                                ? this.props.casFltFlg
                                    ? [validates.required, validates.isOkCasualFlt]
                                    : [validates.requiredFlt, validates.lengthFlt3, validates.halfWidthFlt]
                                : undefined, showKeyboard: storage_1.storage.isPc || this.props.casFltFlg ? undefined : this.handleFlightNumberInputPopup, isShadowOnFocus: true, placeholder: "FLT" })),
                    react_1.default.createElement(CasFltCheckBox, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "casFltFlg", id: "casFltFlg", component: CheckBoxWithLabel_1.default, checked: this.props.casFltFlg, disabled: filterRadioValue !== "flightNo", isShadowOnFocus: true, text: "Casual" })),
                    react_1.default.createElement(DateMonthContainer, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "dateMonth", component: SelectBox_1.default, isShadowOnFocus: true, options: this.dateValues(), width: 90, disabled: filterRadioValue !== "flightNo", maxMenuHeight: 500, placeholder: "Date" }))),
                react_1.default.createElement(Ship, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "filterRadio", id: "filterRadioShip", type: "radio", value: "ship", component: RadioButton_1.default, isShadowOnFocus: true, onChange: this.handleFilterRadioChange }),
                    react_1.default.createElement(Label, { htmlFor: "filterRadioShip" }, "SHIP"),
                    react_1.default.createElement(ShipNoContainer, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "shipNo", id: "shipNo", component: TextInput_1.default, isShadowOnFocus: true, width: 128, componentOnBlur: this.shipToUpperCase, disabled: filterRadioValue !== "ship", validate: filterRadioValue === "ship" ? validates.requiredShip : undefined, placeholder: "SHIP" })))),
            react_1.default.createElement(RightColumn, null,
                react_1.default.createElement(ArrowButton, { onClick: handleSubmit(this.handlePrevFilter) },
                    react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faChevronUp, size: "2x", style: { width: "0.875em" } })),
                react_1.default.createElement(ArrowButton, { onClick: handleSubmit(this.handleNextFilter) },
                    react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faChevronDown, size: "2x", style: { width: "0.875em" } })),
                react_1.default.createElement(CloseButton, { onClick: this.handleCloseButton },
                    react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faTimes, size: "2x", style: { width: "0.875em" } }))))) : null));
    }
}
const submit = (searchParams, _dispatch, props) => {
    const { flightNo, filterRadio } = searchParams;
    if (barChartSearchSelf) {
        if (filterRadio === "flightNo") {
            barChartSearchSelf.onScrollToRowChangeFlightNo(flightNo, props.dateMonth, true);
        }
        else {
            barChartSearchSelf.onScrollToRowChangeShip(flightNo, true);
        }
    }
};
const Container = styled_components_1.default.div `
  position: relative;
`;
const WrapperForm = styled_components_1.default.form `
  position: absolute;
  top: ${({ isPc }) => (isPc ? "-54px" : "-56px")};
  width: 100%;
  height: 56px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  background: #e4f2f7;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.6);
  z-index: 10;
`;
const LeftColumn = styled_components_1.default.div `
  display: flex;
`;
const RightColumn = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const FlightNo = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const FlightNoContainer = styled_components_1.default.div `
  margin-left: 9px;
`;
const DateMonthContainer = styled_components_1.default.div `
  margin-left: 20px;
`;
const Ship = styled_components_1.default.div `
  margin-left: 72px;
  display: flex;
  align-items: center;
`;
const ShipNoContainer = styled_components_1.default.div `
  margin-left: 9px;
`;
const Label = styled_components_1.default.label `
  margin-left: 6px;
`;
const ArrowButton = styled_components_1.default.button `
  margin-right: 40px;
  border: none;
  background: none;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
  }
`;
const CloseButton = styled_components_1.default.button `
  border: none;
  background: none;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
  }
`;
const CasFltCheckBox = styled_components_1.default.div `
  margin-left: 14px;
`;
const barChartSearchWithForm = (0, redux_form_1.reduxForm)({
    form: "barChartSearch",
    onSubmit: submit,
    initialValues: { filterRadio: "flightNo", casFltFlg: false },
})(BarChartSearch);
const selector = (0, redux_form_1.formValueSelector)("barChartSearch");
exports.default = (0, react_redux_1.connect)((state) => {
    const filterRadioValue = selector(state, "filterRadio");
    const flightNoValue = selector(state, "flightNo");
    const dateMonth = selector(state, "dateMonth");
    const shipNoValue = selector(state, "shipNo");
    const casFltFlg = selector(state, "casFltFlg") || false;
    return { filterRadioValue, flightNoValue, dateMonth, shipNoValue, casFltFlg };
})(barChartSearchWithForm);
//# sourceMappingURL=BarChartSearch.js.map