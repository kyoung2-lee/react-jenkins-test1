import { faChevronDown, faChevronUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import flatten from "lodash.flatten";
import dayjs from "dayjs";
import React from "react";
import { connect } from "react-redux";
import { Field, FormSubmitHandler, formValueSelector, InjectedFormProps, reduxForm } from "redux-form";
import styled from "styled-components";

import { AppDispatch } from "../../../store/storeType";
import { padding0, toUpperCase, formatFlt } from "../../../lib/commonUtil";
import { storage } from "../../../lib/storage";
import * as validates from "../../../lib/validators";
import { NotificationCreator } from "../../../lib/notifications";
import { ExtFisRow, FisRowsGroupBySpotState } from "../../organisms/BarChart/selector";
import { openFlightNumberInputPopup } from "../../../reducers/flightNumberInputPopup";
import {
  clearSearchBarChart,
  BarChartSearchState,
  searchBarChart,
  searchBarChartNext,
  searchBarChartPrev,
  toggleBarChartSearchDialog,
  showInfoNoData,
} from "../../../reducers/barChartSearch";
import RadioButton from "../../atoms/RadioButton";
import SelectBox from "../../atoms/SelectBox";
import TextInput from "../../atoms/TextInput";

import CheckBoxWithLabel from "../../atoms/CheckBoxWithLabel";

interface MyProps {
  appDispatch: AppDispatch;
  barChartSearch: BarChartSearchState;
  fisPullTimeStamp: number;
  fisRowsGroupBySpot: FisRowsGroupBySpotState;
  filterRadioValue: string;
  flightNoValue: string;
  dateMonth: string;
  shipNoValue: string;
  timeScale: "2" | "4" | "8" | null;
  casFltFlg: boolean;
}

type Props = MyProps & InjectedFormProps<SearchParams, MyProps>;

interface State {
  searchedFltNo: string;
  searchedDateMonth: string;
  searchedShipNo: string;
  searchedFisPullTimeStamp: number;
  searchedCasFltFlg: boolean;
}

let barChartSearchSelf: BarChartSearch | null = null;

class BarChartSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
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

  componentDidUpdate(prevProps: Props) {
    // 閉じたら項目とメッセージの状態をクリアする
    if (prevProps.barChartSearch.dialogIsVisible === true && this.props.barChartSearch.dialogIsVisible === false) {
      this.untouchField();
    }
  }

  handleNextFilter = () => {
    const { flightNoValue, shipNoValue, filterRadioValue, dateMonth } = this.props;

    if (filterRadioValue === "flightNo") {
      this.onScrollToRowChangeFlightNo(flightNoValue, dateMonth, true);
    } else {
      this.onScrollToRowChangeShip(shipNoValue, true);
    }
  };

  handlePrevFilter = () => {
    const { flightNoValue, shipNoValue, filterRadioValue, dateMonth } = this.props;

    if (filterRadioValue === "flightNo") {
      this.onScrollToRowChangeFlightNo(flightNoValue, dateMonth, false);
    } else {
      this.onScrollToRowChangeShip(shipNoValue, false);
    }
  };

  handleCloseButton = () => {
    this.props.appDispatch(toggleBarChartSearchDialog());
    this.props.appDispatch(clearSearchBarChart());
  };

  handleFlightNumberInputPopup = () => {
    this.props.appDispatch(
      openFlightNumberInputPopup({
        formName: "barChartSearch",
        fieldName: "flightNo",
        currentFlightNumber: this.props.flightNoValue,
        executeSubmit: true,
        onEnter: () => {},
        canOnlyAlCd: false,
      })
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFilterRadioChange = (e: React.ChangeEvent<any> | undefined) => {
    this.untouchField();
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.target.value === "flightNo") {
        this.setState({ searchedShipNo: "" });
      } else {
        this.setState({ searchedFltNo: "", searchedDateMonth: "" });
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFlightOnBlur = (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      this.props.change("flightNo", this.props.casFltFlg ? toUpperCase(e.target.value) : formatFlt(e.target.value));
    }
  };

  onScrollToRowChangeShip = (shipNo: string, isNext: boolean) => {
    const { fisRowsGroupBySpot, barChartSearch, fisPullTimeStamp } = this.props;
    const { searchedShipNo, searchedFisPullTimeStamp } = this.state;

    if (this.props.filterRadioValue !== "ship") {
      return;
    }

    // 検索ワードが変更されていない場合 または 再検索されていない場合
    if (
      searchedShipNo &&
      barChartSearch.filterlingRowColumns.length !== 0 &&
      searchedShipNo.endsWith(shipNo) &&
      searchedFisPullTimeStamp === fisPullTimeStamp
    ) {
      if (isNext) {
        this.props.appDispatch(searchBarChartNext());
      } else {
        this.props.appDispatch(searchBarChartPrev());
      }

      return;
    }

    // 検索に一致するバーチャートの行と列を配列で返す
    const rowColumns = flatten(
      fisRowsGroupBySpot.sortedSpots.map(({ spotNo }, row) => {
        const filteredSchedules = fisRowsGroupBySpot.groupedfisRowsBySpot[spotNo].filter(
          (schedule) => schedule.shipNo && schedule.shipNo.endsWith(shipNo)
        );
        return this.highlightRowColumns(filteredSchedules, row);
      })
    );

    if (rowColumns.length === 0) {
      this.props.appDispatch(clearSearchBarChart());
      void this.props.appDispatch(showInfoNoData());
      return;
    }

    const currentFilterlingIndex = isNext ? 0 : rowColumns.length - 1;

    this.props.appDispatch(
      searchBarChart({
        filterlingRowColumns: rowColumns,
        currentFilterlingIndex,
        scrollToRow: rowColumns[currentFilterlingIndex].row,
        scrollToColumn: rowColumns[currentFilterlingIndex].column,
        scrollToScheduleSeq: rowColumns[currentFilterlingIndex].scheduleSeq,
      })
    );

    this.setState({ searchedShipNo: shipNo, searchedFisPullTimeStamp: fisPullTimeStamp });
  };

  onScrollToRowChangeFlightNo = (flightNo: string, dateMonth: string, isNext: boolean) => {
    const { fisRowsGroupBySpot, barChartSearch, fisPullTimeStamp, casFltFlg } = this.props;
    const { searchedFltNo, searchedDateMonth, searchedFisPullTimeStamp, searchedCasFltFlg } = this.state;

    if (this.props.filterRadioValue !== "flightNo") {
      return;
    }

    // 検索ワードが変更されていない場合 または 再検索されていない場合
    if (
      searchedFltNo &&
      barChartSearch.filterlingRowColumns.length !== 0 &&
      searchedFltNo === flightNo &&
      searchedDateMonth === dateMonth &&
      searchedFisPullTimeStamp === fisPullTimeStamp &&
      searchedCasFltFlg === casFltFlg
    ) {
      if (isNext) {
        this.props.appDispatch(searchBarChartNext());
      } else {
        this.props.appDispatch(searchBarChartPrev());
      }

      return;
    }

    // 検索に一致するバーチャートの行と列を配列で返す
    const rowColumns = flatten(
      fisRowsGroupBySpot.sortedSpots.map((spot, row) => {
        const filteredSchedules = fisRowsGroupBySpot.groupedfisRowsBySpot[spot.spotNo].filter((schedule) => {
          if (
            schedule.arr &&
            (casFltFlg ? schedule.arr.casFltNo === flightNo : schedule.arr.alCd + padding0(schedule.arr.fltNo, 4) === flightNo)
          ) {
            if (dateMonth) {
              if (dayjs(schedule.arr.orgDateLcl).format("YYYYMMDD") === dateMonth) {
                return true;
              }
            } else {
              return true;
            }
          }

          if (
            schedule.dep &&
            (casFltFlg ? schedule.dep.casFltNo === flightNo : schedule.dep.alCd + padding0(schedule.dep.fltNo, 4) === flightNo)
          ) {
            if (dateMonth) {
              if (dayjs(schedule.dep.orgDateLcl).format("YYYYMMDD") === dateMonth) {
                return true;
              }
            } else {
              return true;
            }
          }

          return false;
        });

        return this.highlightRowColumns(filteredSchedules, row);
      })
    );

    if (rowColumns.length === 0) {
      this.props.appDispatch(clearSearchBarChart());
      void this.props.appDispatch(showInfoNoData());
      return;
    }

    const currentFilterlingIndex = isNext ? 0 : rowColumns.length - 1;

    this.props.appDispatch(
      searchBarChart({
        filterlingRowColumns: rowColumns,
        currentFilterlingIndex,
        scrollToRow: rowColumns[currentFilterlingIndex].row,
        scrollToColumn: rowColumns[currentFilterlingIndex].column,
        scrollToScheduleSeq: rowColumns[currentFilterlingIndex].scheduleSeq,
      })
    );

    this.setState({
      searchedFltNo: flightNo,
      searchedDateMonth: dateMonth,
      searchedFisPullTimeStamp: fisPullTimeStamp,
      searchedCasFltFlg: casFltFlg,
    });
  };

  handleFlightNoKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      this.props.change("flightNo", this.props.casFltFlg ? toUpperCase(e.target.value) : formatFlt(e.target.value));
    }
  };

  dateValues = () => {
    let start = dayjs().add(3, "day");
    const end = dayjs().subtract(6, "day");
    const daySelectList: { label: string; value: string }[] = [{ label: "", value: "" }];

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
  shipToUpperCase = (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      this.props.change("shipNo", toUpperCase(e.target.value));
    }
  };

  highlightRowColumns(schedules: ExtFisRow[], row: number) {
    return schedules
      .sort((a, b) => (a.xtaLcl || a.xtdLcl > b.xtaLcl || b.xtdLcl ? -1 : 1))
      .map((schedule) => {
        let column = schedule.columnStartIndex;
        // バーが前に行き過ぎないようにスペースを開ける
        if (this.props.timeScale === "4" || this.props.timeScale === "8") {
          if (schedule.columnStartMinuts < 30 && column > 0) {
            column -= 0.5;
          }
        } else if (schedule.columnStartMinuts < 15 && column > 0) {
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
    NotificationCreator.removeAll({ dispatch: appDispatch });
  }

  render() {
    const { filterRadioValue, handleSubmit } = this.props;

    return (
      <Container>
        {this.props.barChartSearch.dialogIsVisible ? (
          <WrapperForm onSubmit={handleSubmit} isPc={storage.isPc}>
            <LeftColumn>
              <FlightNo>
                <Field
                  name="filterRadio"
                  id="filterRadioFlightNo"
                  type="radio"
                  value="flightNo"
                  component={RadioButton}
                  isShadowOnFocus
                  onChange={this.handleFilterRadioChange}
                />
                <Label htmlFor="filterRadioFlightNo">FLT</Label>
                <FlightNoContainer>
                  <Field
                    name="flightNo"
                    id="flightNo"
                    component={TextInput}
                    disabled={filterRadioValue !== "flightNo"}
                    width={128}
                    maxLength={10}
                    componentOnBlur={this.handleFlightOnBlur}
                    onKeyPress={this.handleFlightNoKeyPress}
                    validate={
                      filterRadioValue === "flightNo"
                        ? this.props.casFltFlg
                          ? [validates.required, validates.isOkCasualFlt]
                          : [validates.requiredFlt, validates.lengthFlt3, validates.halfWidthFlt]
                        : undefined
                    }
                    showKeyboard={storage.isPc || this.props.casFltFlg ? undefined : this.handleFlightNumberInputPopup}
                    isShadowOnFocus
                    placeholder="FLT"
                  />
                </FlightNoContainer>
                <CasFltCheckBox>
                  <Field
                    name="casFltFlg"
                    id="casFltFlg"
                    component={CheckBoxWithLabel}
                    checked={this.props.casFltFlg}
                    disabled={filterRadioValue !== "flightNo"}
                    isShadowOnFocus
                    text="Casual"
                  />
                </CasFltCheckBox>
                <DateMonthContainer>
                  <Field
                    name="dateMonth"
                    component={SelectBox as "select" & typeof SelectBox}
                    isShadowOnFocus
                    options={this.dateValues()}
                    width={90}
                    disabled={filterRadioValue !== "flightNo"}
                    maxMenuHeight={500}
                    placeholder="Date"
                  />
                </DateMonthContainer>
              </FlightNo>
              <Ship>
                <Field
                  name="filterRadio"
                  id="filterRadioShip"
                  type="radio"
                  value="ship"
                  component={RadioButton}
                  isShadowOnFocus
                  onChange={this.handleFilterRadioChange}
                />
                <Label htmlFor="filterRadioShip">SHIP</Label>
                <ShipNoContainer>
                  <Field
                    name="shipNo"
                    id="shipNo"
                    component={TextInput}
                    isShadowOnFocus
                    width={128}
                    componentOnBlur={this.shipToUpperCase}
                    disabled={filterRadioValue !== "ship"}
                    validate={filterRadioValue === "ship" ? validates.requiredShip : undefined}
                    placeholder="SHIP"
                  />
                </ShipNoContainer>
              </Ship>
            </LeftColumn>
            <RightColumn>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
              <ArrowButton onClick={handleSubmit(this.handlePrevFilter)}>
                <FontAwesomeIcon icon={faChevronUp} size="2x" style={{ width: "0.875em" }} />
              </ArrowButton>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
              <ArrowButton onClick={handleSubmit(this.handleNextFilter)}>
                <FontAwesomeIcon icon={faChevronDown} size="2x" style={{ width: "0.875em" }} />
              </ArrowButton>
              <CloseButton onClick={this.handleCloseButton}>
                <FontAwesomeIcon icon={faTimes} size="2x" style={{ width: "0.875em" }} />
              </CloseButton>
            </RightColumn>
          </WrapperForm>
        ) : null}
      </Container>
    );
  }
}

const submit: FormSubmitHandler<SearchParams, MyProps> = (searchParams, _dispatch, props) => {
  const { flightNo, filterRadio } = searchParams;

  if (barChartSearchSelf) {
    if (filterRadio === "flightNo") {
      barChartSearchSelf.onScrollToRowChangeFlightNo(flightNo, props.dateMonth, true);
    } else {
      barChartSearchSelf.onScrollToRowChangeShip(flightNo, true);
    }
  }
};

const Container = styled.div`
  position: relative;
`;
const WrapperForm = styled.form<{ isPc: boolean }>`
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
const LeftColumn = styled.div`
  display: flex;
`;
const RightColumn = styled.div`
  display: flex;
  align-items: center;
`;
const FlightNo = styled.div`
  display: flex;
  align-items: center;
`;
const FlightNoContainer = styled.div`
  margin-left: 9px;
`;
const DateMonthContainer = styled.div`
  margin-left: 20px;
`;
const Ship = styled.div`
  margin-left: 72px;
  display: flex;
  align-items: center;
`;

const ShipNoContainer = styled.div`
  margin-left: 9px;
`;
const Label = styled.label`
  margin-left: 6px;
`;
const ArrowButton = styled.button`
  margin-right: 40px;
  border: none;
  background: none;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
  }
`;
const CloseButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const CasFltCheckBox = styled.div`
  margin-left: 14px;
`;

export interface SearchParams {
  filterRadio: string;
  flightNo: string;
  dateMonth: string;
  shipNo: string;
  casFltFlg: boolean;
}

const barChartSearchWithForm = reduxForm<SearchParams, MyProps>({
  form: "barChartSearch",
  onSubmit: submit, // submitをここで設定しないと、ポップアップ入力画面からRemoteSubmitできない。
  initialValues: { filterRadio: "flightNo", casFltFlg: false },
})(BarChartSearch);

const selector = formValueSelector("barChartSearch");

export default connect((state: Props) => {
  const filterRadioValue = selector(state, "filterRadio") as string;
  const flightNoValue = selector(state, "flightNo") as string;
  const dateMonth = selector(state, "dateMonth") as string;
  const shipNoValue = selector(state, "shipNo") as string;
  const casFltFlg = (selector(state, "casFltFlg") as boolean) || false;
  return { filterRadioValue, flightNoValue, dateMonth, shipNoValue, casFltFlg };
})(barChartSearchWithForm);
