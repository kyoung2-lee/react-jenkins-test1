import dayjs from "dayjs";
import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Field, formValueSelector, InjectedFormProps, reduxForm, submit, FormSubmitHandler } from "redux-form";
import styled, { DefaultTheme } from "styled-components";
import { difference } from "lodash";
import { AppDispatch, RootState } from "../../store/storeType";

import { toUpperCase, funcAuthCheck, formatFlt } from "../../lib/commonUtil";
import { storage } from "../../lib/storage";
import { Const } from "../../lib/commonConst";
import { NotificationCreator } from "../../lib/notifications";
import * as validates from "../../lib/validators";
import { JobAuth, Master } from "../../reducers/account";
import { openDateTimeInputPopup } from "../../reducers/dateTimeInputPopup";
import { openFlightNumberInputPopup } from "../../reducers/flightNumberInputPopup";
import { type openFlightMovementModal } from "../../reducers/flightMovementModal";
import { searchFlight as searchFlightType } from "../../reducers/flightSearch";
import {
  CommonState,
  showNotificationAirportRmksNoChange,
  updateAirportRemarks,
  showConfirmation,
  getHeaderInfo,
} from "../../reducers/common";
import * as flightSearchActions from "../../reducers/flightSearch";
import { type openMvtMsgModal } from "../../reducers/mvtMsgModal";
import PrimaryButton from "../atoms/PrimaryButton";
import RadioButton from "../atoms/RadioButton";
import SelectBox from "../atoms/SelectBox";
import SuggestSelectBox from "../atoms/SuggestSelectBox";
import TextInput from "../atoms/TextInput";
import FlightList from "./FlightList";
import UpdateRmksPopup from "./UpdateRmksPopup";
import MultipleCreatableInput from "../atoms/MultipleCreatableInput";
import CheckBoxWithLabel from "../atoms/CheckBoxWithLabel";
import CheckboxGroup from "../atoms/CheckboxGroup";
import * as myValidates from "../../lib/validators/flightListValidator";

export interface MyProps {
  jobAuth: JobAuth;
  master: Master;
  flightSearch: flightSearchActions.FlightSearchState;
  searchTypeValue: string;
  // eslint-disable-next-line react/no-unused-prop-types
  shipValue: string;
  fltValue: string;
  // eslint-disable-next-line react/no-unused-prop-types
  legDepValue: string;
  dateValue: string;
  dateFromValue: string;
  dateToValue: string;
  innerDateValue: string;
  innerDateFromValue: string;
  innerDateToValue: string;
  // eslint-disable-next-line react/no-unused-prop-types
  searchFlight: typeof searchFlightType;
  openDateTimeInputPopup: typeof openDateTimeInputPopup;
  openFlightNumberInputPopup: typeof openFlightNumberInputPopup;
  openOalFlightMovementModal: typeof openFlightMovementModal;
  getHeaderInfo?: typeof getHeaderInfo;
  handleFlightDetail: (eLeg: FlightsApi.ELegList) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formSyncErrors: any;
  common?: CommonState;
  showNotificationAirportRmksNoChange?: typeof showNotificationAirportRmksNoChange;
  updateAirportRemarks?: typeof updateAirportRemarks;
  handleStationOperationTask?: (eLeg: FlightsApi.ELegList) => void;
  //  showStationOperationTaskList?: (stationOperationTaskKeys: StationOperationTaskKeys) => void;
  showConfirmation?: typeof showConfirmation;
  casFltFlg: boolean;
  dispatch: AppDispatch;
  openMvtMsgModal: typeof openMvtMsgModal;
  trCdList: string[];
  isFetching?: boolean;
}

type Props = MyProps & InjectedFormProps<flightSearchActions.SearchParams, MyProps>;
type AirLines = {
  alCd: string;
  jalGrpFlg: boolean;
  dispSeq: number;
};

const ServerErrorItems = {
  dateFrom: ["dateFrom"],
};

const FlightSearchForm: React.FC<Props> = (props) => {
  const AL_CODE_LIST_ITEM_MAX = 5;
  const { dispatch } = props;
  const rmksTextRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scrollTop, setScrollTop] = useState(0);
  const [rmksPopupIsOpen, setRmksPopupIsOpen] = useState(false);
  const [rmksPopupWidth, setRmksPopupWidth] = useState(0);
  const [rmksPopupHeight, setRmksPopupHeight] = useState(0);
  const [rmksPopupTop, setRmksPopupTop] = useState(0);
  const [rmksPopupLeft, setRmksPopupLeft] = useState(0);
  const [trCdIsEmpty, setTrCdIsEmpty] = useState(false);
  const [fetchValidationErrors, setFetchValidationErrors] = useState<string[]>([]);

  // refFltInput = React.createRef<HTMLInputElement>();

  const filterSortJalGrpAlCd = (airlines: AirLines[]) =>
    airlines.filter((al) => al.jalGrpFlg === true).sort((a, b) => a.dispSeq - b.dispSeq);

  useEffect(() => {
    // 画面を開いた時にデフォルトを設定
    if (!props.dateValue) {
      props.change("date", dayjs().format("YYYY-MM-DD"));
      props.change("dateFrom", dayjs().format("YYYY-MM-DD"));
      props.change("dateTo", dayjs().format("YYYY-MM-DD"));
    }

    if (props.searchTypeValue === "MVT") {
      const targetNode = document.getElementById("jalGrpFlgMvt");
      if (targetNode) {
        const masterAlCd = filterSortJalGrpAlCd(props.master.airlines).map((al) => al.alCd);
        if (!!props.trCdList && props.trCdList.length !== 0 && props.trCdList.length !== masterAlCd.length) {
          // 1つ以上チェック
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          targetNode.indeterminate = true;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          targetNode.checked = false;
          props.change("jalGrpFlgMvt", true);
          setTrCdIsEmpty(false);
        } else if (!!props.trCdList && props.trCdList.length === masterAlCd.length) {
          // 全てチェック
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          targetNode.indeterminate = false;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          targetNode.checked = true;
          props.change("jalGrpFlgMvt", true);
          setTrCdIsEmpty(false);
        } else {
          // チェックなし
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          targetNode.indeterminate = false;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          targetNode.checked = false;
          props.change("jalGrpFlgMvt", false);
          setTrCdIsEmpty(true);
        }
      }
    }
  }, [props]);

  const handleFltKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      props.change("flt", props.casFltFlg ? toUpperCase(e.target.value) : formatFlt(e.target.value));
    }
  };

  const handleDateInputPopup = () => {
    dispatch(
      props.openDateTimeInputPopup({
        valueFormat: "YYYY-MM-DD",
        currentValue: props.innerDateValue,
        onEnter: (value) => props.change("date", value),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onUpdate: async (value: string) => {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await props.change("date", value);
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await props.dispatch(submit("flightSearch"));
        },
        customUpdateButtonName: "Search",
        unableDelete: true,
      })
    );
  };

  const handleDateInputFromPopup = () => {
    dispatch(
      props.openDateTimeInputPopup({
        valueFormat: "YYYY-MM-DD",
        currentValue: props.innerDateFromValue,
        onEnter: (value) => {
          props.change("dateFrom", value);
          setFetchValidationErrors(difference(fetchValidationErrors, ServerErrorItems.dateFrom));
        },
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onUpdate: async (value: string) => {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await props.change("dateFrom", value);
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await props.dispatch(submit("flightSearch"));
        },
        customUpdateButtonName: "Search",
        unableDelete: true,
      })
    );
  };

  const handleDateInputToPopup = () => {
    dispatch(
      props.openDateTimeInputPopup({
        valueFormat: "YYYY-MM-DD",
        currentValue: props.innerDateToValue,
        onEnter: (value) => props.change("dateTo", value),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onUpdate: async (value: string) => {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await props.change("dateTo", value);
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await props.dispatch(submit("flightSearch"));
        },
        customUpdateButtonName: "Search",
        unableDelete: true,
      })
    );
  };

  const handleFlightNumberInputPopup = () => {
    dispatch(
      props.openFlightNumberInputPopup({
        formName: "flightSearch",
        fieldName: "flt",
        currentFlightNumber: props.fltValue,
        executeSubmit: true,
        onEnter: () => {},
        canOnlyAlCd: false,
      })
    );
  };

  const handleJalGrpFlgAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const alCd = filterSortJalGrpAlCd(master.airlines).map((al) => al.alCd);

    if (e.target.checked) {
      props.change("trCdList", alCd);
    } else {
      props.change("trCdList", []);
    }
  };

  const closeRmksPopup = (rmksText: string) => {
    if (props.common && props.common.headerInfo.apoRmksInfo === rmksText) {
      setRmksPopupIsOpen(false);
    } else if (props.showConfirmation) {
      void dispatch(props.showConfirmation({ onClickYes: () => setRmksPopupIsOpen(false) }));
    }
  };

  const openRmksPopup = () => {
    if (props.getHeaderInfo) {
      const apoCd = props.jobAuth.user.myApoCd;
      const open = () => {
        const node = rmksTextRef.current;
        if (node) {
          setRmksPopupIsOpen(true);
          setRmksPopupWidth(node.clientWidth);
          setRmksPopupHeight(node.clientHeight);
          setRmksPopupTop(node.getBoundingClientRect().top);
          setRmksPopupLeft(node.getBoundingClientRect().left);
        }
      };
      const close = () => {
        setRmksPopupIsOpen(false);
      };
      void dispatch(props.getHeaderInfo({ apoCd, openRmksPopup: open, closeRmksPopup: close }));
    }
  };

  const isRmksEnabled = (): boolean => {
    if (props.common) {
      return (
        !!props.jobAuth.user.myApoCd &&
        props.jobAuth.user.myApoCd === props.common.headerInfo.apoCd &&
        funcAuthCheck(Const.FUNC_ID.updateAireportRemarks, props.jobAuth.jobAuth)
      );
    }
    return false;
  };

  const updateRmks = (text: string) => {
    if (props.common && props.showNotificationAirportRmksNoChange && props.updateAirportRemarks) {
      if (text === props.common.headerInfo.apoRmksInfo) {
        void dispatch(props.showNotificationAirportRmksNoChange());
      } else {
        void dispatch(
          props.updateAirportRemarks({
            apoCd: props.jobAuth.user.myApoCd,
            apoRmksInfo: text,
            closeAirportRemarksPopup: () => setRmksPopupIsOpen(false),
          })
        );
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shipToUpperCase = (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      props.change("ship", toUpperCase(e.target.value));
    }
  };

  // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
  const untouchField = () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment
    const { untouch, formSyncErrors } = props;
    const validationErrorsFields: string[] = ["arrApoCd"]; // 条件必須の項目はvalidateを持たないため常にtouchedをfalseにする。
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.keys(formSyncErrors).forEach((key) => validationErrorsFields.push(key));
    if (validationErrorsFields.length) {
      untouch("flightSearch", ...validationErrorsFields);
      NotificationCreator.removeAll({ dispatch: props.dispatch });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fltZeroPadding = (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      props.change("flt", props.casFltFlg ? toUpperCase(e.target.value) : formatFlt(e.target.value));
    }
  };

  const getIsForceError = (fieldName: keyof typeof ServerErrorItems) => {
    const errorItems = ServerErrorItems[fieldName];
    for (let xi = 0; xi < errorItems.length; xi++) {
      const includes = fetchValidationErrors.includes(errorItems[xi]);
      if (includes) return true;
    }
    return false;
  };

  const {
    searchTypeValue,
    dateValue,
    dateFromValue,
    dateToValue,
    master,
    handleSubmit,
    flightSearch,
    handleFlightDetail,
    common,
    jobAuth,
    handleStationOperationTask,
    openOalFlightMovementModal,
    openMvtMsgModal,
  } = props;

  // 初期設定 JLGRP 全チェック
  useEffect(() => {
    const alCd = filterSortJalGrpAlCd(master.airlines).map((al) => al.alCd);
    props.change("trCdList", alCd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // サーバーのエラーがある場合、赤枠を表示させる
    if (!props.flightSearch.isFetching) {
      setFetchValidationErrors(props.flightSearch.fetchValidationErrors);
    }
  }, [props.flightSearch, props.flightSearch.fetchValidationErrors, props.flightSearch.isFetching]);

  const hasApo = !!jobAuth.user.myApoCd;
  const apoRmksInfo = common ? (common.headerInfo ? common.headerInfo.apoRmksInfo : "") : "";

  return (
    <Wrapper>
      <ScrollArea isPc={storage.isPc} isIpad={storage.isIpad} hasApo={hasApo}>
        {hasApo && storage.terminalCat === Const.TerminalCat.iPhone && (
          <AptRmksContainer>
            <AptRmks ref={rmksTextRef} onClick={openRmksPopup} isEmpty={!apoRmksInfo}>
              <div>{apoRmksInfo || "Airport Remarks"}</div>
            </AptRmks>
          </AptRmksContainer>
        )}
        <SearchFormContainer onSubmit={handleSubmit}>
          <SearchTypeRadio>
            <div className="searchTypeRadioContainer">
              <Field
                name="searchType"
                id="searchTypeFLT"
                tabIndex={-1}
                type="radio"
                value="FLT"
                component={RadioButton}
                isShadowOnFocus
                onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
              />
              <label htmlFor="searchTypeFLT">FLT</label>
            </div>
            <div className="searchTypeRadioContainer">
              <Field
                name="searchType"
                id="searchTypeLEG"
                tabIndex={-1}
                type="radio"
                value="LEG"
                component={RadioButton}
                isShadowOnFocus
                onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
              />
              <label htmlFor="searchTypeLEG">LEG</label>
            </div>
            <div className="searchTypeRadioContainer">
              <Field
                name="searchType"
                id="searchTypeSHIP"
                tabIndex={-1}
                type="radio"
                value="SHIP"
                component={RadioButton}
                isShadowOnFocus
                onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
              />
              <label htmlFor="searchTypeSHIP">SHIP</label>
            </div>
            <div className="searchTypeRadioContainer">
              <Field
                name="searchType"
                id="searchTypeAL"
                tabIndex={-1}
                type="radio"
                value="AL"
                component={RadioButton}
                isShadowOnFocus
                onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
              />
              <label htmlFor="searchTypeAL">AL</label>
            </div>
            <div className="searchTypeRadioContainer">
              <Field
                name="searchType"
                id="searchTypeMVT"
                tabIndex={-1}
                type="radio"
                value="MVT"
                component={RadioButton}
                isShadowOnFocus
                onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
              />
              <label htmlFor="searchTypeMVT">
                <span>MVT</span>
                <span>CHK</span>
              </label>
            </div>
          </SearchTypeRadio>
          <SearchContainer>
            <SearchFormContents>
              {searchTypeValue === "FLT" && (
                <FltForm>
                  <Field
                    name="date"
                    tabIndex={-1}
                    component={TextInput}
                    width={68}
                    showKeyboard={handleDateInputPopup}
                    displayValue={dateValue}
                  />
                  <Flt>
                    <Field
                      name="flt"
                      id="flt"
                      tabIndex={0}
                      placeholder="FLT"
                      component={TextInput}
                      width={130}
                      maxLength={10}
                      componentOnBlur={fltZeroPadding}
                      onKeyPress={handleFltKeyPress}
                      validate={
                        props.casFltFlg
                          ? [validates.required, validates.isOkCasualFlt]
                          : [validates.required, validates.lengthFlt3, validates.halfWidthFlt]
                      }
                      showKeyboard={storage.isPc || props.casFltFlg ? undefined : handleFlightNumberInputPopup}
                      isShadowOnFocus
                      autoFocus
                      // innerRef={this.refFltInput}
                    />
                  </Flt>
                  <CasFltCheckBox>
                    <Field
                      name="casFltFlg"
                      id="casFltFlg"
                      // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                      tabIndex={1}
                      component={CheckBoxWithLabel}
                      checked={props.casFltFlg}
                      disabled={false}
                      isShadowOnFocus
                      text="Casual"
                    />
                  </CasFltCheckBox>
                  <SubmitButtonContainer>
                    <PrimaryButton text="Search" tabIndex={-1} />
                  </SubmitButtonContainer>
                </FltForm>
              )}
              {searchTypeValue === "LEG" && (
                <LegFrom>
                  <Field
                    name="date"
                    tabIndex={-1}
                    component={TextInput}
                    width={68}
                    showKeyboard={handleDateInputPopup}
                    isShadowOnFocus
                    displayValue={dateValue}
                  />
                  <Leg>
                    <div>
                      <Field
                        name="depApoCd"
                        tabIndex={0}
                        component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                        placeholder="DEP"
                        options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                        width={77}
                        maxLength={3}
                        validate={[validates.requiredApoCdPair, validates.halfWidthApoCd]}
                        isShadowOnFocus
                        autoFocus
                      />
                      -
                      <Field
                        name="arrApoCd"
                        tabIndex={0}
                        component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                        placeholder="ARR"
                        options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                        width={77}
                        maxLength={3}
                        validate={[validates.requiredApoCdPair, validates.halfWidthApoCd]}
                        isShadowOnFocus
                      />
                    </div>
                  </Leg>
                  <SubmitButtonContainer>
                    <PrimaryButton text="Search" tabIndex={-1} />
                  </SubmitButtonContainer>
                  <LegSecond>
                    <Field
                      name="jalGrpFlg"
                      tabIndex={0}
                      component={SelectBox as "select" & typeof SelectBox}
                      options={[
                        { label: "JL GRP", value: true },
                        { label: "OAL", value: false },
                        { label: "ALL", value: "ALL" },
                      ]}
                      width={86}
                      isShadowOnFocus
                    />
                    <Field
                      name="intDomCat"
                      tabIndex={0}
                      component={SelectBox as "select" & typeof SelectBox}
                      options={[
                        { label: "D/I", value: "D/I" },
                        { label: "DOM", value: "D" },
                        { label: "INT", value: "I" },
                      ]}
                      width={69}
                      isShadowOnFocus
                    />
                  </LegSecond>
                </LegFrom>
              )}
              {searchTypeValue === "SHIP" && (
                <ShipForm>
                  <Field
                    name="date"
                    tabIndex={-1}
                    component={TextInput}
                    width={68}
                    showKeyboard={handleDateInputPopup}
                    isShadowOnFocus
                    displayValue={dateValue}
                  />
                  <Ship>
                    <Field
                      name="ship"
                      tabIndex={0}
                      id="ship"
                      placeholder="SHIP"
                      component={TextInput}
                      maxLength={10}
                      width={130}
                      componentOnBlur={shipToUpperCase}
                      validate={[validates.requiredShip, validates.lengthShip2, validates.halfWidthShip]}
                      isShadowOnFocus
                      autoFocus
                    />
                  </Ship>
                  <SubmitButtonContainer>
                    <PrimaryButton text="Search" tabIndex={-1} />
                  </SubmitButtonContainer>
                </ShipForm>
              )}
              {searchTypeValue === "AL" && (
                <AlForm>
                  <div>
                    <Field
                      name="date"
                      tabIndex={-1}
                      component={TextInput}
                      width={68}
                      showKeyboard={handleDateInputPopup}
                      isShadowOnFocus
                      displayValue={dateValue}
                    />
                    <Leg>
                      <div>
                        <Field
                          name="depApoCd"
                          tabIndex={0}
                          component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                          placeholder="DEP"
                          options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                          width={77}
                          maxLength={3}
                          validate={[validates.halfWidthApoCd]}
                          isShadowOnFocus
                          autoFocus
                        />
                        -
                        <Field
                          name="arrApoCd"
                          tabIndex={0}
                          component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                          placeholder="ARR"
                          options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                          width={77}
                          maxLength={3}
                          validate={[validates.halfWidthApoCd]}
                          isShadowOnFocus
                        />
                      </div>
                    </Leg>
                    <SubmitButtonContainer>
                      <PrimaryButton text="Search" tabIndex={-1} />
                    </SubmitButtonContainer>
                  </div>
                  <AlCdList>
                    <Field
                      name="alCdList"
                      placeholder="AL"
                      component={MultipleCreatableInput}
                      validate={[validates.required, validates.unique, validates.isOkAls]}
                      filterValue={(value: string) => value.slice(0, 2)}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatValues={(values: any[]) => (values as string[]).map((value) => toUpperCase(value))}
                      maxValLength={AL_CODE_LIST_ITEM_MAX}
                    />
                  </AlCdList>
                </AlForm>
              )}
              {searchTypeValue === "MVT" && (
                <MvtChkForm>
                  <MvtChkRowOne>
                    <DateFromTo>
                      <Field
                        name="dateFrom"
                        tabIndex={-1}
                        component={TextInput}
                        width={68}
                        showKeyboard={handleDateInputFromPopup}
                        isShadowOnFocus
                        displayValue={dateFromValue}
                        validate={[myValidates.rangeDateFromDateTo, myValidates.orderDateFromDateTo]}
                        isForceError={getIsForceError("dateFrom")}
                      />
                      -
                      <Field
                        name="dateTo"
                        tabIndex={-1}
                        component={TextInput}
                        width={68}
                        showKeyboard={handleDateInputToPopup}
                        isShadowOnFocus
                        displayValue={dateToValue}
                        validate={[myValidates.rangeDateFromDateTo, myValidates.orderDateFromDateTo]}
                      />
                    </DateFromTo>
                    <IntDomCat>
                      <Field
                        name="intDomCat"
                        tabIndex={0}
                        component={SelectBox as "select" & typeof SelectBox}
                        options={[
                          { label: "D/I", value: "D/I" },
                          { label: "DOM", value: "D" },
                          { label: "INT", value: "I" },
                        ]}
                        width={69}
                        isShadowOnFocus
                      />
                    </IntDomCat>
                    <SubmitButtonContainer>
                      <PrimaryButton text="Search" tabIndex={-1} />
                    </SubmitButtonContainer>
                  </MvtChkRowOne>
                  <MvtChkRowTwo>
                    <DepArr>
                      <Field
                        name="depApoCd"
                        tabIndex={0}
                        component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                        placeholder="DEP"
                        options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                        width={77}
                        maxLength={3}
                        validate={[validates.requiredApoCdPair, validates.halfWidthApoCd]}
                        isShadowOnFocus
                        autoFocus
                      />
                      -
                      <Field
                        name="arrApoCd"
                        tabIndex={0}
                        component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                        placeholder="ARR"
                        options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                        width={77}
                        maxLength={3}
                        validate={[validates.requiredApoCdPair, validates.halfWidthApoCd]}
                        isShadowOnFocus
                      />
                    </DepArr>
                    <MvtSearchTypeRadio>
                      <div className="mvtTypeRadio">
                        <Field
                          name="mvtType"
                          id="mvtTypeBoth"
                          tabIndex={-1}
                          type="radio"
                          value="BOTH"
                          component={RadioButton}
                          isShadowOnFocus
                          onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
                        />
                        <label htmlFor="mvtTypeBoth">
                          <span>BOTH</span>
                        </label>
                      </div>
                      <div className="mvtTypeRadio">
                        <Field
                          name="mvtType"
                          id="mvtTypeDep"
                          tabIndex={-1}
                          type="radio"
                          value="DEP"
                          component={RadioButton}
                          isShadowOnFocus
                          onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
                        />
                        <label htmlFor="mvtTypeDep">
                          <span>DEP</span>
                          <span>MVT</span>
                        </label>
                      </div>
                      <div className="mvtTypeRadio">
                        <Field
                          name="mvtType"
                          id="mvtTypeArr"
                          tabIndex={-1}
                          type="radio"
                          value="ARR"
                          component={RadioButton}
                          isShadowOnFocus
                          onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
                        />
                        <label htmlFor="mvtTypeArr">
                          <span>ARR</span>
                          <span>MVT</span>
                        </label>
                      </div>
                    </MvtSearchTypeRadio>
                  </MvtChkRowTwo>
                  <MvtChkRowThree>
                    <JalGrpContainer trCdIsEmpty={trCdIsEmpty}>
                      <JalGrpLabel htmlFor="jalGrpFlgMvt">
                        <Field
                          name="jalGrpFlgMvt"
                          id="jalGrpFlgMvt"
                          // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                          tabIndex={1}
                          component={CheckBoxWithLabel}
                          disabled={false}
                          isShadowOnFocus
                          onChange={handleJalGrpFlgAll}
                        />
                        <span>JL GRP</span>
                      </JalGrpLabel>
                      <Field
                        name="trCdList"
                        options={filterSortJalGrpAlCd(master.airlines).map((al) => ({ label: al.alCd, value: al.alCd }))}
                        component={CheckboxGroup as "input" & typeof CheckboxGroup}
                        tabIndex={21}
                        validate={[validates.required]}
                      />
                    </JalGrpContainer>
                  </MvtChkRowThree>
                </MvtChkForm>
              )}
            </SearchFormContents>
          </SearchContainer>
        </SearchFormContainer>
        {flightSearch.isSearched && (
          <FlightList
            eLegList={flightSearch.eLegList}
            onFlightDetail={handleFlightDetail}
            selectedFlightIdentifier={flightSearch.selectedFlightIdentifier}
            stationOperationTaskEnabled={funcAuthCheck(Const.FUNC_ID.openOperationTask, jobAuth.jobAuth)}
            onStationOperationTask={handleStationOperationTask}
            openOalFlightMovementModal={openOalFlightMovementModal}
            flightMovementEnabled={funcAuthCheck(Const.FUNC_ID.openOalFlightMovement, jobAuth.jobAuth)}
            flightDetailEnabled={funcAuthCheck(Const.FUNC_ID.openFlightDetail, jobAuth.jobAuth)}
            isModalComponent={false}
            mvtMsgEnabled={funcAuthCheck(Const.FUNC_ID.openMvtMsg, jobAuth.jobAuth)}
            openMvtMsgModal={openMvtMsgModal}
          />
        )}
      </ScrollArea>

      {/* 空港リマークス */}
      <UpdateRmksPopup
        isOpen={rmksPopupIsOpen}
        width={rmksPopupWidth}
        height={rmksPopupHeight}
        top={rmksPopupTop}
        left={rmksPopupLeft}
        initialRmksText={apoRmksInfo}
        isSubmitable={isRmksEnabled()}
        placeholder="Airport Remarks"
        onClose={closeRmksPopup}
        update={updateRmks}
      />
    </Wrapper>
  );
};

const onSubmit: FormSubmitHandler<flightSearchActions.SearchParams, MyProps> = (searchParams, dispatch, props) => {
  const { jobAuth, searchFlight, casFltFlg } = props;

  if (searchParams) {
    const params = searchParams;

    params.flt = casFltFlg ? toUpperCase(params.flt) : formatFlt(params.flt);
    params.ship = toUpperCase(params.ship);
  }

  dispatch(searchFlight({ searchParams, myApoCd: jobAuth.user.myApoCd }));
};

const APT_RMKS_HEIGHT = "66px";
const FOOTER_HEIGHT = "54px";
const PADDING_HEIGHT = "16px";
const headerHeight = (isPc: boolean, isIpad: boolean, header: DefaultTheme["layout"]["header"], hasApo: boolean) =>
  isPc
    ? `${header.default} - ${PADDING_HEIGHT}`
    : isIpad
    ? `${header.tablet} - ${PADDING_HEIGHT}`
    : hasApo
    ? `${header.mobile} - ${FOOTER_HEIGHT}`
    : `${FOOTER_HEIGHT} - ${header.statusBar}`;

const Wrapper = styled.div`
  width: 100%;
`;

const ScrollArea = styled.div<{ isPc: boolean; isIpad: boolean; hasApo: boolean }>`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
  ${({ isPc, isIpad, theme, hasApo }) => `height: calc(100vh - ${headerHeight(isPc, isIpad, theme.layout.header, hasApo)});`}
`;

const SearchFormContainer = styled.form``;

const SearchContainer = styled.div`
  background: #e4f2f7;
  padding: 12x 10px 14px 8px;
`;

const AptRmksContainer = styled.div`
  height: ${APT_RMKS_HEIGHT};
  padding: 0 10px 15px;
  background: ${({ theme }) => theme.color.HEADER_GRADIENT};
`;

const AptRmks = styled.div<{ isEmpty: boolean }>`
  width: 100%;
  height: 100%;
  max-width: 700px;
  padding: 3px 10px 3px;
  line-height: 1.6em;
  border-radius: 1px;
  border: none;
  color: ${(props) => (props.isEmpty ? props.theme.color.PLACEHOLDER : props.theme.color.DEFAULT_FONT_COLOR)};
  background: ${(props) => props.theme.color.WHITE};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-align: start;
  -webkit-box-orient: vertical;
  word-break: break-all;
  overflow: hidden;
  align-items: space-between;
  box-shadow: 0px 0px 1px 1px #ccc inset;
  cursor: pointer;
`;

const SearchTypeRadio = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  margin: 14px auto 12px 8px;
  .searchTypeRadioContainer {
    input[type="radio"] {
      display: none;
    }
    :first-child {
      border: solid #346181;
      border-width: 1px 1px 1px 1px;
    }
    :last-child {
      border: solid #346181;
      border-width: 1px 1px 1px 0px;
    }
    :not(:first-child):not(:last-child) {
      border: solid #346181;
      border-width: 1px 1px 1px 0px;
    }
    width: 71px;
    label {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: pre-line;
      flex-direction: column;
      height: 36px;
      padding: 0px 20px;
      font-size: 16px;
      background: #ffffff 0% 0% no-repeat padding-box;
      letter-spacing: 0px;
      color: #346181;
      opacity: 1;
      span {
        line-height: 14px;
      }
    }
    input:checked + label {
      background: #346181 0% 0% no-repeat padding-box;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }
`;

const SearchFormContents = styled.div`
  padding: 12px 10px 14px 8px;
`;
const FltForm = styled.div`
  display: flex;
`;
const LegFrom = styled.div`
  display: flex;
  flex-wrap: wrap;

  label {
    display: block;
    font-size: 14px;
    color: ${(props) => props.theme.color.PRIMARY};
    margin-bottom: 6px;
  }
`;
const ShipForm = styled.div`
  display: flex;
  label {
    display: block;
    font-size: 14px;
    color: ${(props) => props.theme.color.PRIMARY};
    margin-bottom: 6px;
  }
`;
const Flt = styled.div`
  margin-left: 10px;
`;
const SubmitButtonContainer = styled.div`
  width: 100px;
  margin-left: auto;
`;
const Leg = styled.div`
  margin-left: 10px;
  > div {
    display: flex;
    align-items: center;
    > div:first-child {
      margin-right: 2px;
    }
    > div:last-child {
      margin-left: 2px;
    }
  }
`;
const LegSecond = styled.div`
  display: flex;
  margin-left: 78px;
  margin-top: 11px;
  > div {
    margin-right: 10px;
  }
`;
const Ship = styled.div`
  margin-left: 10px;
`;

const AlForm = styled.div`
  label {
    display: block;
    font-size: 14px;
    color: ${(props) => props.theme.color.PRIMARY};
    margin-bottom: 6px;
  }

  > div:first-child {
    display: flex;
    flex-wrap: wrap;
  }
`;

const MvtChkForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MvtChkRowOne = styled.div`
  display: flex;
`;

const MvtChkRowTwo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DepArr = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

const MvtChkRowThree = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AlCdList = styled.div`
  margin-top: 11px;
`;

const CasFltCheckBox = styled.div`
  margin-left: 6px;
`;

const DateFromTo = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const IntDomCat = styled.div`
  margin-left: 13px;
`;

const MvtSearchTypeRadio = styled.div`
  display: flex;
  margin-left: auto;
  .mvtTypeRadio {
    input[type="radio"] {
      display: none;
    }
    :first-child {
      border: solid #346181;
      border-width: 1px 1px 1px 1px;
    }
    :last-child {
      border: solid #346181;
      border-width: 1px 1px 1px 0px;
    }
    :not(:first-child):not(:last-child) {
      border: solid #346181;
      border-width: 1px 1px 1px 0px;
    }
    label {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: pre-line;
      flex-direction: column;
      height: 36px;
      width: 57px;
      font-size: 16px;
      background: #ffffff 0% 0% no-repeat padding-box;
      letter-spacing: 0px;
      color: #346181;
      opacity: 1;
      span {
        line-height: 14px;
      }
    }
    input:checked + label {
      background: #346181 0% 0% no-repeat padding-box;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }
`;

const CheckboxContainer = styled.div<{ trCdIsEmpty: boolean }>`
  label {
    display: flex;
    align-items: center;
    margin-right: 8px;
    font-size: 17px;
  }
  label:last-child {
    margin: 0px;
  }
  input[type="checkbox"] {
    margin-right: 6px;
    appearance: none;
    width: 30px;
    height: 30px;
    border: 1px solid ${(props) => (props.trCdIsEmpty ? props.theme.color.border.ERROR : props.theme.color.PRIMARY)};
    background: #fff;
    position: relative;
    outline: none;
    &:checked {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
    }
    &:indeterminate {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 14px;
        left: 7px;
        width: 16px;
        border-bottom: 2px solid #fff;
      }
    }
  }
`;

const JalGrpContainer = styled(CheckboxContainer)`
  flex-grow: 1;
  flex-wrap: wrap;
  > div:last-child {
    display: flex;
    flex-wrap: wrap;
    margin-left: 8px;
    label {
      cursor: pointer;
      height: 33px;
      margin-top: 14px;
      text-align: left;
      line-height: 22px;
      font-size: 17px;
      letter-spacing: 0px;
      color: #222222;
      opacity: 1;
    }
  }
`;

const JalGrpLabel = styled.label`
  cursor: pointer;
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
  span {
    text-align: left;
    line-height: 22px;
    font-size: 17px;
    letter-spacing: 0px;
    color: #222222;
    opacity: 1;
  }
`;

const FlightSearchWithForm = reduxForm<flightSearchActions.SearchParams, MyProps>({
  form: "flightSearch",
  onSubmit, // submitをここで設定しないと、ポップアップ入力画面からRemoteSubmitできない。
  shouldValidate: () => true,
  initialValues: {
    searchType: "FLT",
    date: "",
    jalGrpFlg: true,
    intDomCat: "D/I",
    casFltFlg: false,
    ship: "",
    flt: "",
    mvtType: "BOTH",
  },
})(FlightSearchForm);

const selector = formValueSelector("flightSearch");

export default connect((state: RootState) => {
  const searchTypeValue = selector(state, "searchType") as string;
  const shipValue = selector(state, "ship") as string;
  const fltValue = selector(state, "flt") as string;
  const legDepValue = selector(state, "legDep") as string;
  const innerDateValue = selector(state, "date") as string;
  const innerDateFromValue = selector(state, "dateFrom") as string;
  const innerDateToValue = selector(state, "dateTo") as string;
  const date = selector(state, "date") as string;
  const dateFrom = selector(state, "dateFrom") as string;
  const dateTo = selector(state, "dateTo") as string;

  const dateValue = date ? dayjs(date, "YYYY-MM-DD").format("DDMMM").toUpperCase() : "";
  const dateFromValue = dateFrom ? dayjs(dateFrom, "YYYY-MM-DD").format("DDMMM").toUpperCase() : "";
  const dateToValue = dateTo ? dayjs(dateTo, "YYYY-MM-DD").format("DDMMM").toUpperCase() : "";
  const casFltFlg = (selector(state, "casFltFlg") as boolean) || false;
  const alCdList = selector(state, "alCdList") as [];
  const jalGrpFlgMvt = selector(state, "jalGrpFlgMvt") as boolean;
  const trCdList = selector(state, "trCdList") as [];

  return {
    searchTypeValue,
    shipValue,
    fltValue,
    legDepValue,
    dateValue,
    dateFromValue,
    dateToValue,
    innerDateValue,
    innerDateFromValue,
    innerDateToValue,
    casFltFlg,
    alCdList,
    jalGrpFlgMvt,
    trCdList,
  };
})(FlightSearchWithForm);
