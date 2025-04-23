import dayjs from "dayjs";
import queryString from "query-string";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  Field,
  formValueSelector,
  InjectedFormProps,
  reduxForm,
  getFormSyncErrors,
  FormErrors,
  submit,
  FormSubmitHandler,
  DecoratedFormProps,
} from "redux-form";
import styled from "styled-components";
import CreatableSelect from "react-select/creatable";

import { useAppDispatch } from "../../../store/hooks";
import { RootState } from "../../../store/storeType";
import { toUpperCase, formatFlt } from "../../../lib/commonUtil";
import { storage } from "../../../lib/storage";
import * as validates from "../../../lib/validators";
// eslint-disable-next-line import/no-cycle
import * as myValidates from "../../../lib/validators/oalFlightScheduleValidator";
import { SoalaMessage } from "../../../lib/soalaMessages";
import { Master } from "../../../reducers/account";
import { removeAllNotification } from "../../../reducers/common";
import { openDateTimeInputPopup, DateTimeInputPopupParam } from "../../../reducers/dateTimeInputPopup";
import { OalFlightScheduleState, OalSearchParams, search, showMessage } from "../../../reducers/oalFlightSchedule";
import PrimaryButton from "../../atoms/PrimaryButton";
import RadioButton from "../../atoms/RadioButton";
import SuggestSelectBox, { OptionType as SuOptionType } from "../../atoms/SuggestSelectBox";
import TextInput from "../../atoms/TextInput";
import ToggleInput from "../../atoms/ToggleInput";
import CheckBoxInput from "../../atoms/CheckBoxInput";

export type MyProps = SearchStateProps & {
  apoOptions: SuOptionType[];
  // eslint-disable-next-line react/no-unused-prop-types
  isEdited: boolean;
};

type Props = MyProps & InjectedFormProps<OalSearchParams, MyProps>;

const OalFlightScheduleSearch: React.FC<Props> = (props) => {
  const dateToLastValue = useRef<string>("");
  const fltRef = useRef<HTMLInputElement>(null);
  const depApoCdRef = useRef<CreatableSelect<SuOptionType>>(null);
  const alCdRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const [dateToEnabled, setDateToEnabled] = useState(true);
  const [casualCheckBoxEnabled, setCasualCheckBoxEnabled] = useState(true);

  useEffect(() => {
    if (window.location.search) {
      const qs = queryString.parse(window.location.search);
      if (qs.flt && qs.dateFrom) {
        void onSubmit(props.initialValues, dispatch, props as unknown as DecoratedFormProps<OalSearchParams, MyProps, string>);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
  const untouchField = () => {
    const validationErrorsFields: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(props.formSyncErrors)) {
      validationErrorsFields.push(key);
    }
    if (validationErrorsFields.length) {
      props.untouch(formName, ...validationErrorsFields);
      void dispatch(removeAllNotification());
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFltOnBlur = (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      props.change("flt", props.casualFlg ? toUpperCase(e.target.value) : formatFlt(e.target.value));
    }
  };

  const handleFltOnKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      props.change("flt", props.casualFlg ? toUpperCase(e.target.value) : formatFlt(e.target.value));
    }
  };

  const handleDateFromInputPopup = () => {
    const onEnter = (value: string) => {
      props.change("dateFrom", value);
      // setItemoutで行わないとfocusが効かない
      setTimeout(() => {
        switch (props.searchTypeValue) {
          case "FLT":
            if (fltRef.current) fltRef.current.focus();
            break;
          case "LEG":
            if (depApoCdRef.current) depApoCdRef.current.focus();
            break;
          case "ALAPO":
            if (alCdRef.current) alCdRef.current.focus();
            break;
          default:
            break;
        }
      }, 1);
    };
    const onUpdate = async (value: string) => {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await props.change("dateFrom", value);
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await dispatch(submit(formName));
    };
    const param: DateTimeInputPopupParam = {
      valueFormat: "YYYY-MM-DD",
      currentValue: props.innerDateFromValue,
      defaultSetting: { value: props.innerDateFromValue },
      onEnter,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onUpdate,
      customUpdateButtonName: "Search",
    };
    dispatch(openDateTimeInputPopup(param));
  };

  const handleDateToInputPopup = () => {
    const onEnter = (value: string) => {
      props.change("dateTo", value);
      // setTimeoutで行わないとfocusが効かない
      setTimeout(() => {
        if (props.searchTypeValue === "FLT" && fltRef.current) {
          fltRef.current.focus();
        }
      }, 1);
    };
    const onUpdate = async (value: string) => {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await props.change("dateTo", value);
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await dispatch(submit(formName));
    };
    const param: DateTimeInputPopupParam = {
      valueFormat: "YYYY-MM-DD",
      currentValue: props.innerDateToValue,
      defaultSetting: { value: props.innerDateToValue },
      onEnter,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onUpdate,
      customUpdateButtonName: "Search",
    };
    dispatch(openDateTimeInputPopup(param));
  };

  const handleOpeCsConfirmation = (checked: boolean) => {
    props.change("opeCsFlg", checked);
    if (checked) {
      props.change("casualFlg", false);
      setCasualCheckBoxEnabled(false);
    } else {
      setCasualCheckBoxEnabled(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCnxToOnChange = (event: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (event.target.checked) {
      dateToLastValue.current = props.innerDateToValue;
      props.change("dateTo", "");
      setDateToEnabled(false);
    } else {
      props.change("dateTo", dateToLastValue.current);
      setDateToEnabled(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const alToUpperCase = (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      props.change("alCd", toUpperCase(e.target.value));
    }
  };

  const { searchTypeValue, dateFromValue, dateToValue, handleSubmit, apoOptions } = props;

  const { isPc } = storage;
  return (
    <Wrapper>
      <SearchFormContainer isPc={isPc} onSubmit={handleSubmit}>
        <SearchTypeDiv isPc={isPc}>
          <Field
            name="searchType"
            id="searchTypeFLT"
            // eslint-disable-next-line jsx-a11y/tabindex-no-positive
            tabIndex={1}
            type="radio"
            value="FLT"
            component={RadioButton}
            isShadowOnFocus
            onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
            autoFocus
          />
          <label htmlFor="searchTypeFLT">FLT</label>
          <Field
            name="searchType"
            id="searchTypeLEG"
            // eslint-disable-next-line jsx-a11y/tabindex-no-positive
            tabIndex={2}
            type="radio"
            value="LEG"
            component={RadioButton}
            isShadowOnFocus
            onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
          />
          <label htmlFor="searchTypeLEG">LEG</label>
          <Field
            name="searchType"
            id="searchTypeALAPO"
            // eslint-disable-next-line jsx-a11y/tabindex-no-positive
            tabIndex={3}
            type="radio"
            value="ALAPO"
            component={RadioButton}
            isShadowOnFocus
            onClick={() => untouchField()} /* アロー関数にしないとなぜかラジオボタンが効かなくなる */
          />
          <label htmlFor="searchTypeALAPO">
            Handling
            <br />
            Flight
          </label>
        </SearchTypeDiv>
        {searchTypeValue === "FLT" && (
          <>
            <FromToDiv isPc={isPc}>
              <Field
                name="dateFrom"
                tabIndex={-1}
                placeholder="Date"
                component={TextInput}
                width={68}
                showKeyboard={handleDateFromInputPopup}
                validate={[validates.required]}
                displayValue={dateFromValue}
              />
              -
              <Field
                name="dateTo"
                tabIndex={-1}
                placeholder="Date"
                component={TextInput}
                width={68}
                showKeyboard={handleDateToInputPopup}
                disabled={!dateToEnabled}
                displayValue={dateToValue}
              />
            </FromToDiv>
            <OpeCsDiv>
              <label htmlFor="opeCsFlg">OPE</label>
              <Field
                name="opeCsFlg"
                id="opeCsFlg"
                component={ToggleInput}
                confirmation={handleOpeCsConfirmation}
                smallSize
                // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                tabIndex={10}
              />
              <label htmlFor="opeCsFlg">C/S</label>
            </OpeCsDiv>
            <InputDiv isPc={isPc}>
              <Field
                innerRef={fltRef}
                name="flt"
                id="flt"
                // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                tabIndex={20}
                placeholder="FLT"
                component={TextInput}
                width={120}
                maxLength={8}
                componentOnBlur={handleFltOnBlur}
                onKeyPress={handleFltOnKeyPress}
                validate={
                  props.casualFlg
                    ? [validates.requiredFlt, validates.isOkCasualFlt8]
                    : [validates.requiredFlt, validates.lengthFlt3, validates.halfWidthFlt]
                }
                isShadowOnFocus
              />
            </InputDiv>
            <CheckBoxDiv isPc={isPc}>
              <label htmlFor="casualFlg">Casual</label>
              <Field
                name="casualFlg"
                id="casualFlg"
                component={CheckBoxInput}
                // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                tabIndex={30}
                checked={props.casualFlg}
                disabled={!casualCheckBoxEnabled}
                isShadowOnFocus
              />
            </CheckBoxDiv>
            <CheckBoxDiv isPc={isPc}>
              {isPc ? (
                <label htmlFor="nextToFlg">Show Next FLT</label>
              ) : (
                <label htmlFor="nextToFlg">
                  Show
                  <br />
                  Next FLT
                </label>
              )}
              <Field
                name="nextToFlg"
                id="nextToFlg"
                component={CheckBoxInput}
                // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                tabIndex={40}
                checked={props.nextToFlg}
                onChange={handleCnxToOnChange}
                isShadowOnFocus
              />
            </CheckBoxDiv>
            <SubmitButtonContainer isPc={isPc}>
              <PrimaryButton text="Search" tabIndex={-1} />
            </SubmitButtonContainer>
          </>
        )}
        {searchTypeValue === "LEG" && (
          <>
            <InputDiv isPc={isPc}>
              <Field
                name="dateFrom"
                tabIndex={-1}
                placeholder="Date"
                component={TextInput}
                width={68}
                showKeyboard={handleDateFromInputPopup}
                isShadowOnFocus
                validate={[validates.required]}
                displayValue={dateFromValue}
              />
            </InputDiv>
            <FromToDiv isPc={isPc}>
              <Field
                innerRef={depApoCdRef}
                name="depApoCd"
                // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                tabIndex={10}
                component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                placeholder="DEP"
                options={apoOptions}
                width={77}
                maxLength={3}
                validate={[validates.requiredApoCdPair, validates.halfWidthApoCd]}
                isShadowOnFocus
              />
              -
              <Field
                name="arrApoCd"
                // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                tabIndex={20}
                component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                placeholder="ARR"
                options={apoOptions}
                width={77}
                maxLength={3}
                validate={[validates.requiredApoCdPair, validates.halfWidthApoCd]}
                isShadowOnFocus
              />
            </FromToDiv>
            <SubmitButtonContainer isPc={isPc}>
              <PrimaryButton text="Search" tabIndex={-1} />
            </SubmitButtonContainer>
          </>
        )}
        {searchTypeValue === "ALAPO" && (
          <>
            <InputDiv isPc={isPc}>
              <Field
                name="dateFrom"
                tabIndex={-1}
                placeholder="Date"
                component={TextInput}
                width={68}
                showKeyboard={handleDateFromInputPopup}
                isShadowOnFocus
                validate={[validates.required]}
                displayValue={dateFromValue}
              />
            </InputDiv>
            <InputDiv isPc={isPc}>
              <Field
                innerRef={alCdRef}
                name="alCd"
                // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                tabIndex={10}
                id="alCd"
                placeholder="AL"
                component={TextInput}
                maxLength={2}
                width={60}
                componentOnBlur={alToUpperCase}
                validate={[myValidates.requiredAlApoCdPair, validates.isOkAl, myValidates.isOalAlCd]}
                isShadowOnFocus
              />
            </InputDiv>
            <InputDiv isPc={isPc}>
              <Field
                name="apoCd"
                // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                tabIndex={20}
                component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                placeholder="APO"
                options={apoOptions}
                width={77}
                maxLength={3}
                validate={[myValidates.requiredAlApoCdPair, validates.halfWidthApoCd]}
                isShadowOnFocus
              />
            </InputDiv>
            <SubmitButtonContainer isPc={isPc}>
              <PrimaryButton text="Search" tabIndex={-1} />
            </SubmitButtonContainer>
          </>
        )}
      </SearchFormContainer>
    </Wrapper>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit: FormSubmitHandler<OalSearchParams, MyProps> = (searchParams, dispatch, props) => {
  if (searchParams) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign, @typescript-eslint/no-unsafe-argument
    searchParams.flt = toUpperCase(searchParams.flt);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign, @typescript-eslint/no-unsafe-argument
    searchParams.alCd = toUpperCase(searchParams.alCd);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const searchOalFlightSchedule = () => dispatch(search({ oalSearchParams: searchParams }));

  if (props.isEdited) {
    dispatch(showMessage({ message: SoalaMessage.M40017C({ onYesButton: searchOalFlightSchedule }) }));
  } else {
    searchOalFlightSchedule();
  }
};

const Wrapper = styled.div`
  width: 100%;
`;

const SearchFormContainer = styled.form<{ isPc: boolean }>`
  height: 60px;
  padding-left: ${({ isPc }) => (isPc ? "20px" : "16px")};
  padding-right: ${({ isPc }) => (isPc ? "20px" : "10px")};
  display: flex;
  align-items: center;
  background: #e4f2f7;
  > label {
    display: block;
    font-size: 14px;
    color: ${(props) => props.theme.color.PRIMARY};
    /* margin-bottom: 6px; */
  }
`;

const SearchTypeDiv = styled.div<{ isPc: boolean }>`
  display: flex;
  align-items: center;
  > label {
    font-size: 18px;
    line-height: 1.3;
    margin-right: ${({ isPc }) => (isPc ? "20px" : "6px")};
  }
  > label:last-child {
    font-size: 16px;
    line-height: inherit;
    margin-right: 0;
  }
`;

const FromToDiv = styled.div<{ isPc: boolean }>`
  z-index: 100;
  display: flex;
  align-items: center;
  margin-left: ${({ isPc }) => (isPc ? "20px" : "14px")};
  > div:first-child {
    margin-right: 2px;
  }
  > div:last-child {
    margin-left: 2px;
  }
`;

const OpeCsDiv = styled.div`
  display: flex;
  align-items: center;
  margin-left: 14px;
  > div {
    margin: 0 4px;
  }
`;

const InputDiv = styled.div<{ isPc: boolean }>`
  z-index: 100;
  display: flex;
  align-items: center;
  margin-left: ${({ isPc }) => (isPc ? "20px" : "14px")};
`;

const CheckBoxDiv = styled.div<{ isPc: boolean }>`
  display: flex;
  align-items: center;
  margin-left: ${({ isPc }) => (isPc ? "16px" : "12px")};
  > label {
    margin-right: 4px;
  }
`;

const SubmitButtonContainer = styled.div<{ isPc: boolean }>`
  width: 100px;
  margin-left: ${({ isPc }) => (isPc ? "26px" : "14px")};
`;

/// ////////////////////////
// コネクト
/// ////////////////////////
const formName = "oalFlightScheduleSearch";

interface SearchStateProps {
  // eslint-disable-next-line react/no-unused-prop-types
  oalFlightScheduleState: OalFlightScheduleState;
  // eslint-disable-next-line react/no-unused-prop-types
  master: Master;
  formSyncErrors: FormErrors<FormData>;
  searchTypeValue: "FLT" | "LEG" | "ALAPO";
  dateFromValue: string;
  innerDateFromValue: string;
  dateToValue: string;
  innerDateToValue: string;
  casualFlg: boolean;
  nextToFlg: boolean;
  initialValues: OalSearchParams;
}

const defaultInitialValues: OalSearchParams = {
  searchType: "FLT",
  dateFrom: "",
  dateTo: "",
  opeCsFlg: false,
  flt: "",
  depApoCd: "",
  arrApoCd: "",
  casualFlg: false,
  nextToFlg: false,
  alCd: "",
  apoCd: "",
};

interface Query {
  flt: string;
  dateFrom: string;
  casualFlg?: string;
}

const mapStateToProps = (state: RootState): SearchStateProps => {
  const formSyncErrors = getFormSyncErrors(formName)(state);
  const searchTypeValue = formValueSelector(formName)(state, "searchType") as "FLT" | "LEG" | "ALAPO";
  const innerDateFromValue = formValueSelector(formName)(state, "dateFrom") as string;
  const workDateFrom = formValueSelector(formName)(state, "dateFrom") as string;
  const dateFromValue = workDateFrom ? dayjs(workDateFrom, "YYYY-MM-DD").format("DDMMM").toUpperCase() : "";
  const innerDateToValue = formValueSelector(formName)(state, "dateTo") as string;
  const workDateTo = formValueSelector(formName)(state, "dateTo") as string;
  const dateToValue = workDateTo ? dayjs(workDateTo, "YYYY-MM-DD").format("DDMMM").toUpperCase() : "";
  const casualFlg = formValueSelector(formName)(state, "casualFlg") as boolean;
  const nextToFlg = formValueSelector(formName)(state, "nextToFlg") as boolean;
  const initialValues = defaultInitialValues;

  if (window.location.search) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qs: Query | any = queryString.parse(window.location.search);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (qs.flt && qs.dateFrom) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      initialValues.flt = qs.flt;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      initialValues.dateFrom = qs.dateFrom;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (qs.casualFlg === "true") {
        initialValues.casualFlg = true;
      }
    }
  }

  return {
    oalFlightScheduleState: state.oalFlightSchedule,
    master: state.account.master,
    formSyncErrors,
    searchTypeValue,
    dateFromValue,
    innerDateFromValue,
    dateToValue,
    innerDateToValue,
    casualFlg,
    nextToFlg,
    initialValues,
  };
};

const OalFlightScheduleSearchForm = reduxForm<OalSearchParams, MyProps>({
  form: formName,
  onSubmit, // submitをここで設定しないと、ポップアップ入力画面からRemoteSubmitできない。
  shouldValidate: () => true,
})(OalFlightScheduleSearch);

export default connect(mapStateToProps)(OalFlightScheduleSearchForm);
