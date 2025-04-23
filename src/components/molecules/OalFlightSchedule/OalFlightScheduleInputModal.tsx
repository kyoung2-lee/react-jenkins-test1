import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Field, InjectedFormProps, reduxForm, getFormValues, getFormSyncErrors, FormErrors, FormSubmitHandler, untouch } from "redux-form";
import styled from "styled-components";
import dayjs from "dayjs";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import cloneDeep from "lodash.clonedeep";
import Modal from "react-modal";

import { AppDispatch, RootState } from "../../../store/storeType";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toUpperCase, formatFlt, convertYYMMDDToDate } from "../../../lib/commonUtil";
import { storage } from "../../../lib/storage";
import { NotificationCreator } from "../../../lib/notifications";
import * as validates from "../../../lib/validators";
// eslint-disable-next-line import/no-cycle
import * as myValidates from "../../../lib/validators/oalFlightScheduleValidator";
import { openDateTimeInputPopup, DateTimeInputPopupParam } from "../../../reducers/dateTimeInputPopup";
import * as oalFlightScheduleActions from "../../../reducers/oalFlightSchedule";
import {
  OalFlightSchedule,
  getOnwardForceDisabled,
  getInitialFormState,
  ChgType,
  showConfirmation,
  setInputModal,
  fltListDelete,
  fltListEdit,
} from "../../../reducers/oalFlightSchedule";
import { getListItemEnabled, serverErrorItems, getFltInfo, FieldName } from "./OalFlightScheduleType";
import PrimaryButton from "../../atoms/PrimaryButton";
import SelectBox, { OptionType } from "../../atoms/SelectBox";
import SuggestSelectBox, { OptionType as SuOptionType } from "../../atoms/SuggestSelectBox";
import TextInput from "../../atoms/TextInput";
import CheckBoxInput from "../../atoms/CheckBoxInput";
import MultipleCreatableInput from "../../atoms/MultipleCreatableInput";
import RowStatus = OalFlightScheduleApi.Get.RowStatus;

type MyProps = InputStateProps & {
  apoOptions: SuOptionType[];
  flightStsOptions: OptionType[];
  basePosition: number;
  zoomPercentageOfList: number;
};

export type Props = MyProps & InjectedFormProps<InputlParams, MyProps>;

const OalFlightScheduleInputModal: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const oalFlightSchedule = useAppSelector((state) => state.oalFlightSchedule);
  const [isEdited, setIsEdited] = useState(false);

  // オープン時の処理
  useEffect(() => {
    if (oalFlightSchedule.isOpenInputModal) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { change, touch } = props;
      const { fltScheduleList, fltScheduleListInitial, inputRowIndex, inputChgType } = oalFlightSchedule;
      if (inputRowIndex !== null) {
        const fltSchedule = fltScheduleList[inputRowIndex];
        const fltScheduleInitial = fltScheduleListInitial[inputRowIndex];
        // 既に編集されている場合、変更を反映する（chgTypeは比較対象にしない）
        const isEditedFltSchedule =
          JSON.stringify(fltScheduleInitial) !==
          JSON.stringify({
            ...fltSchedule,
            chgType: fltScheduleInitial.chgType,
          });
        if (isEditedFltSchedule) {
          // 変更を反映する
          change(formSubName, { ...fltSchedule, chgType: inputChgType });
        }
        // State初期化
        setIsEdited(false);
        // サーバーのエラーがある場合、タッチさせる
        if (!isEmpty(fltSchedule.updateValidationErrors)) {
          const fieldNames = Object.keys(serverErrorItems).map((fieldName) => `${formSubName}.${fieldName}`);
          touch(...fieldNames);
        }
        touch(formSubName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oalFlightSchedule.isOpenInputModal]);

  const getIsForceError = (fieldName: FieldName) => {
    const { fltSchedule } = props.formValues;
    const errorItems = serverErrorItems[fieldName];
    if (fltSchedule) {
      for (let xi = 0; xi < errorItems.length; xi++) {
        const includes = fltSchedule.updateValidationErrors.includes(errorItems[xi]);
        if (includes) return true;
      }
    }
    return false;
  };

  const handleDateInputPopup = (yymmddValue: string | undefined, fieldName: FieldName) => () => {
    const { fltSchedule } = props.formValues;
    if (fltSchedule) {
      const currentValue = convertYYMMDDToDate(yymmddValue) || "";
      const param: DateTimeInputPopupParam = {
        valueFormat: "YYYY-MM-DD",
        currentValue,
        defaultSetting: { value: currentValue },
        onEnter: (value) => {
          const newValue = value ? dayjs(value, "YYYY-MM-DD").format("YYMMDD") : "";
          props.change(`${formSubName}.${fieldName}`, newValue);
          handleOnChange(fieldName)(newValue);
        },
      };
      dispatch(openDateTimeInputPopup(param));
    }
  };

  const handleDayTimeInputPopup = (dayTimeValue: string | undefined, fieldName: FieldName) => () => {
    const { fltSchedule } = props.formValues;
    const param: DateTimeInputPopupParam = {
      valueFormat: "DDHHmm",
      currentValue: dayTimeValue || "",
      defaultSetting: { value: dayTimeValue || "" },
      onEnter: (value) => {
        props.change(`${formSubName}.${fieldName}`, value);
        handleOnChange(fieldName)(value);
      },
    };
    if (fltSchedule) {
      dispatch(openDateTimeInputPopup(param));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnChange = (fieldName: FieldName) => (e?: any | string) => {
    // 未編集の場合、ChgTypeをOtherに設定する
    const { fltSchedule } = props.formValues;
    const fltScheduleInitial = props.initialValues.fltSchedule;
    let inputValue: string | null = null;
    if (typeof e === "string") {
      inputValue = e;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (e && e.target) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      inputValue = e.target.value as string;
    }

    if (fltSchedule && !fltSchedule.chgType) {
      const chgType: ChgType = "Other";
      const rowStatus: RowStatus = "Edited";
      props.change(`${formSubName}.chgType`, chgType);
      props.change(`${formSubName}.rowStatus`, rowStatus);
    }
    // casFltFlg, shipが入力されたら入力不可となる項目の値を初期値に戻す
    if ((fieldName === "shipNo" || fieldName === "casFltFlg") && e && fltSchedule && fltScheduleInitial) {
      if (inputValue) {
        if (fltSchedule.onwardFltName || fltSchedule.onwardOrgDate) {
          props.change(`${formSubName}.onwardFltName`, "");
          props.change(`${formSubName}.onwardOrgDate`, "");
        }
      } else {
        props.change(`${formSubName}.onwardFltName`, fltScheduleInitial.onwardFltName);
        props.change(`${formSubName}.onwardOrgDate`, fltScheduleInitial.onwardOrgDate);
      }
    }
    if (
      (fieldName === "arrApoCd" || fieldName === "depApoCd") &&
      fltSchedule &&
      fltScheduleInitial &&
      fltScheduleInitial.chgType === "RTE SKD"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const arrApoCd = fieldName === "arrApoCd" ? e : fltSchedule.arrApoCd;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const depApoCd = fieldName === "depApoCd" ? e : fltSchedule.depApoCd;
      if (arrApoCd === fltScheduleInitial.arrApoCd && depApoCd === fltScheduleInitial.depApoCd) {
        props.change(`${formSubName}.etd`, fltScheduleInitial.etd);
        props.change(`${formSubName}.eta`, fltScheduleInitial.eta);
      } else {
        props.change(`${formSubName}.etd`, "");
        props.change(`${formSubName}.eta`, "");
      }
    }
    // フォーマット変換して入れておく
    if (fieldName === "orgDate") {
      props.change(`${formSubName}.orgDateLcl`, convertYYMMDDToDate(inputValue || ""));
    }
    if (fieldName === "onwardOrgDate") {
      props.change(`${formSubName}.onwardOrgDateLcl`, convertYYMMDDToDate(inputValue || ""));
    }
    // 編集済みにする
    if (!isEdited) {
      setIsEdited(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnChangeCsFltNames = (e?: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const inputValues = Object.values(e);
    const newCsFltNames = inputValues.slice(0, inputValues.length - 1); // 最後の不要な要素を取り除く
    const fltScheduleInitial = props.initialValues.fltSchedule;
    if (fltScheduleInitial && !isEqual(newCsFltNames, fltScheduleInitial.csFltNames)) {
      handleOnChange("csFltNames")(e);
    }
    // 念のため
    if (!isEdited) {
      setIsEdited(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldToUpperCase = (fieldName: string) => (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      props.change(`${formSubName}.${fieldName}`, toUpperCase(e.target.value));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldFltZeroPadding = (fieldName: string) => (e: React.FocusEvent<any> | undefined) => {
    if (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      props.change(`${formSubName}.${fieldName}`, formatFlt(e.target.value));
    }
  };

  const handleKeyPressToUpperCase =
    (fieldName: string) => (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        props.change(`${formSubName}.${fieldName}`, toUpperCase(e.target.value));
      }
    };

  const handleKeyPressFltZeroPadding =
    (fieldName: string) => (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        props.change(`${formSubName}.${fieldName}`, formatFlt(e.target.value));
      }
    };

  const csFltNamesFormatValues = (values: string[]) => values.map((value: string) => formatFlt(value));

  const modalOnRequestClose = () => {
    const {
      oalFlightSchedule: { fltScheduleList, inputRowIndex, inputNewRow },
    } = props;
    if (inputRowIndex !== null) {
      const formFltSchedule = props.formValues.fltSchedule;
      const orgFltSchedule = fltScheduleList[inputRowIndex];
      const onClose = () => {
        if (formFltSchedule) {
          if ((formFltSchedule.chgType === "ADD FLT" || formFltSchedule.chgType === "ADD LEG") && inputNewRow) {
            // 新規に行追加している場合は行削除する
            dispatch(fltListDelete({ index: inputRowIndex, length: 1 }));
          }
        }
        dispatch(
          setInputModal({
            isOpenInputModal: false,
            inputRowIndex: null,
            inputChgType: "",
            inputNewRow: null,
          })
        );
        untouchField(dispatch, untouch, props.formSyncErrors);
      };
      // 値が変更されている場合はメッセージを表示する（rowStatus、chgType、statusは比較対象にしない）
      const isEditedOrgFltSchedule =
        JSON.stringify(orgFltSchedule) !==
        JSON.stringify({
          ...formFltSchedule,
          rowStatus: orgFltSchedule.rowStatus,
          chgType: orgFltSchedule.chgType,
          dispStatus: orgFltSchedule.dispStatus,
        });
      if (isEditedOrgFltSchedule) {
        void dispatch(showConfirmation({ onClickYes: onClose }));
      } else {
        onClose();
      }
    }
  };

  const {
    oalFlightSchedule: { isUtc, isOpenInputModal },
    apoOptions,
    flightStsOptions,
    handleSubmit,
    formValues,
    initialValues,
    legCount,
    basePosition,
    zoomPercentageOfList,
  } = props;
  const zMark = isUtc ? "(Z)" : "";
  const lMark = isUtc ? "(L)" : "";
  const fltSchedule = formValues && formValues.fltSchedule;
  const fltScheduleInitial = initialValues && initialValues.fltSchedule;
  if (!fltSchedule || !fltScheduleInitial) {
    return null;
  }
  const enabled = getListItemEnabled(fltSchedule);
  const onwardForceDisabled = getOnwardForceDisabled(fltSchedule);
  const { isPc } = storage;

  const modalWidth = 960;

  const top = basePosition + (legCount * 40 * zoomPercentageOfList) / 100; // 対象FLTの最終LEGの直下に位置させる
  const ModalCustomStyles = {
    overlay: {
      background: "rgba(0, 0, 0, 0.5)",
      overflow: "auto",
      zIndex: 100,
    },
    content: {
      width: `${modalWidth}px`,
      top: `${top}px`,
      left: `calc(50% - ${modalWidth / 2}px)`,
      padding: 0,
      height: "fit-content",
      overflow: "unset",
      backgroundColor: "#fff",
      transition: "opacity 0.25s",
      border: "0px",
      borderRadius: "0px",
    },
  };

  return (
    <Modal isOpen={isOpenInputModal} style={ModalCustomStyles} onRequestClose={modalOnRequestClose}>
      <FormContainer onSubmit={handleSubmit}>
        <FormTable>
          <div>
            <div className="chgType">CHG Type</div>
            <div className="casual">Casual</div>
            <div className="flight">Flight</div>
            <div className="date">Date{lMark}</div>
            <div className="domInt">DOM/INT</div>
            <div className="paxCgo">PAX/CGO</div>
            <div className="skdNsk">SKD/NSK</div>
          </div>
          <div>
            <ChgTypeColumn className="chgType">{fltSchedule.chgType}</ChgTypeColumn>
            <div className="casual">
              <CheckBoxItem
                disabled={!enabled.casFltFlg}
                dirty={fltSchedule.casFltFlg !== (fltScheduleInitial ? fltScheduleInitial.casFltFlg : false)}
              >
                <Field
                  name={`${formSubName}.casFltFlg`}
                  id="casFltFlg"
                  component={CheckBoxInput}
                  checked={fltSchedule.casFltFlg}
                  disabled={!enabled.casFltFlg}
                  onChange={handleOnChange("casFltFlg")}
                  isShadowOnFocus
                  isShowEditedColor={enabled.casFltFlg}
                />
                <label htmlFor="casFltFlg">Casual</label>
              </CheckBoxItem>
            </div>
            <div className="flight">
              <Field
                name={`${formSubName}.fltName`}
                width="100%"
                type="text"
                component={TextInput}
                placeholder="FLT"
                maxLength={8}
                componentOnBlur={fltSchedule.casFltFlg ? fieldToUpperCase("fltName") : fieldFltZeroPadding("fltName")}
                onKeyPress={fltSchedule.casFltFlg ? handleKeyPressToUpperCase("fltName") : handleKeyPressFltZeroPadding("fltName")}
                disabled={!enabled.fltName}
                validate={
                  fltSchedule.casFltFlg
                    ? [validates.required, validates.isOkCasualFlt8]
                    : [validates.required, validates.lengthFlt3, validates.halfWidthFlt]
                }
                onChange={handleOnChange("fltName")}
                isForceError={getIsForceError("fltName")}
                isShadowOnFocus
                isShowEditedColor={enabled.fltName}
                autoFocus={enabled.autoFocusColumn === "fltName"}
              />
            </div>
            <div className="date">
              <Field
                name={`${formSubName}.orgDate`}
                width="100%"
                type="text"
                component={TextInput}
                placeholder="yymmdd"
                showKeyboard={isPc ? undefined : handleDateInputPopup(fltSchedule.orgDate, "orgDate")}
                maxLength={6}
                disabled={!enabled.orgDate}
                displayValue={isPc ? undefined : fltSchedule.orgDate}
                validate={isPc ? [validates.required, validates.isYYMMDD] : [validates.required]}
                onChange={handleOnChange("orgDate")}
                isForceError={getIsForceError("orgDate")}
                isShadowOnFocus
                isShowEditedColor={enabled.orgDate}
              />
            </div>
            <div className="domInt">
              <Field
                name={`${formSubName}.intDomCat`}
                width="100%"
                component={SelectBox}
                placeholder="D/I"
                options={[
                  { label: "DOM", value: "D" },
                  { label: "INT", value: "I" },
                ]}
                hasBlank
                disabled={!enabled.intDomCat}
                validate={[validates.required]}
                onSelect={handleOnChange("intDomCat")}
                isForceError={getIsForceError("intDomCat")}
                isShadowOnFocus
                isShowEditedColor={enabled.intDomCat}
                autoFocus={enabled.autoFocusColumn === "intDomCat"}
              />
            </div>
            <div className="paxCgo">
              <Field
                name={`${formSubName}.paxCgoCat`}
                width="100%"
                component={SelectBox}
                placeholder="P/C"
                options={[
                  { label: "PAX", value: "PAX" },
                  { label: "CGO", value: "CGO" },
                  { label: "OTR", value: "OTR" },
                ]}
                hasBlank
                disabled={!enabled.paxCgoCat}
                validate={[validates.required]}
                onSelect={handleOnChange("paxCgoCat")}
                isForceError={getIsForceError("paxCgoCat")}
                isShadowOnFocus
                isShowEditedColor={enabled.paxCgoCat}
              />
            </div>
            <div className="skdNsk">
              <Field
                name={`${formSubName}.skdlNonskdlCat`}
                width="100%"
                component={SelectBox}
                placeholder="S/N"
                options={[
                  { label: "SKD", value: "SKD" },
                  { label: "NSK", value: "NSK" },
                ]}
                hasBlank
                disabled={!enabled.skdlNonskdlCat}
                validate={[validates.required]}
                onSelect={handleOnChange("skdlNonskdlCat")}
                isForceError={getIsForceError("skdlNonskdlCat")}
                isShadowOnFocus
                isShowEditedColor={enabled.skdlNonskdlCat}
              />
            </div>
          </div>
        </FormTable>
        <FormTable>
          <div>
            <div className="status">LEG Status</div>
            <div className="dep">DEP</div>
            <div className="arr">ARR</div>
            <div className="std">STD{zMark}</div>
            <div className="etd">ETD{zMark}</div>
            <div className="sta">STA{zMark}</div>
            <div className="eta">ETA{zMark}</div>
            <div className="eqp">EQP</div>
            <div className="ship">SHIP</div>
          </div>
          <div>
            <StatusColumn
              className="status"
              dirty={fltSchedule.dispStatus !== (fltScheduleInitial ? fltScheduleInitial.dispStatus : "")}
              lineThrough={fltSchedule.chgType === "RIN"}
            >
              {fltSchedule.dispStatus}
            </StatusColumn>
            <div className="dep">
              <Field
                name={`${formSubName}.depApoCd`}
                width="100%"
                component={SuggestSelectBox}
                placeholder="DEP"
                maxLength={3}
                maxMenuHeight={408}
                options={apoOptions}
                validate={[validates.required, validates.halfWidthApoCd]}
                disabled={!enabled.depApoCd}
                onSelect={handleOnChange("depApoCd")}
                isForceError={getIsForceError("depApoCd")}
                isShadowOnFocus
                isShowEditedColor
                autoFocus={enabled.autoFocusColumn === "depApoCd"}
              />
            </div>
            <div className="arr">
              <Field
                name={`${formSubName}.arrApoCd`}
                width="100%"
                component={SuggestSelectBox}
                placeholder="ARR"
                maxLength={3}
                maxMenuHeight={408}
                options={apoOptions}
                validate={[validates.required, validates.halfWidthApoCd]}
                disabled={!enabled.arrApoCd}
                onSelect={handleOnChange("arrApoCd")}
                isForceError={getIsForceError("arrApoCd")}
                isShadowOnFocus
                isShowEditedColor
              />
            </div>
            <div className="std">
              <Field
                name={`${formSubName}.std`}
                width="100%"
                type="text"
                component={TextInput}
                placeholder="ddhhmm"
                showKeyboard={isPc ? undefined : handleDayTimeInputPopup(fltSchedule.std, "std")}
                maxLength={6}
                disabled={!enabled.std}
                validate={[myValidates.requiredStd, myValidates.isDDHHmm]}
                onChange={handleOnChange("std")}
                isForceError={getIsForceError("std")}
                isShadowOnFocus
                isShowEditedColor
                autoFocus={enabled.autoFocusColumn === "std"}
              />
            </div>
            <div className="etd">
              <Field
                name={`${formSubName}.etd`}
                width="100%"
                type="text"
                component={TextInput}
                placeholder="ddhhmm"
                showKeyboard={isPc ? undefined : handleDayTimeInputPopup(fltSchedule.etd, "etd")}
                maxLength={6}
                disabled={!enabled.etd}
                validate={[myValidates.requiredEtd, myValidates.isDDHHmm]}
                onChange={handleOnChange("etd")}
                isForceError={getIsForceError("etd")}
                isShadowOnFocus
                isShowEditedColor
                autoFocus={enabled.autoFocusColumn === "etd"}
              />
            </div>
            <div className="sta">
              <Field
                name={`${formSubName}.sta`}
                width="100%"
                type="text"
                component={TextInput}
                placeholder="ddhhmm"
                showKeyboard={isPc ? undefined : handleDayTimeInputPopup(fltSchedule.sta, "sta")}
                maxLength={6}
                disabled={!enabled.sta}
                validate={[validates.required, myValidates.isDDHHmm]}
                onChange={handleOnChange("sta")}
                isForceError={getIsForceError("sta")}
                isShadowOnFocus
                isShowEditedColor
              />
            </div>
            <div className="eta">
              <Field
                name={`${formSubName}.eta`}
                width="100%"
                type="text"
                component={TextInput}
                placeholder="ddhhmm"
                showKeyboard={isPc ? undefined : handleDayTimeInputPopup(fltSchedule.eta, "eta")}
                maxLength={6}
                disabled={!enabled.eta}
                validate={[myValidates.requiredEta, myValidates.isDDHHmm]}
                onChange={handleOnChange("eta")}
                isForceError={getIsForceError("eta")}
                isShadowOnFocus
                isShowEditedColor
              />
            </div>
            <div className="eqp">
              <Field
                name={`${formSubName}.shipTypeIataCd`}
                width="100%"
                type="text"
                component={TextInput}
                placeholder="EQP"
                maxLength={3}
                componentOnBlur={fieldToUpperCase("shipTypeIataCd")}
                onKeyPress={handleKeyPressToUpperCase("shipTypeIataCd")}
                disabled={!enabled.shipTypeIataCd}
                validate={[validates.required, validates.isEQP]}
                onChange={handleOnChange("shipTypeIataCd")}
                isForceError={getIsForceError("shipTypeIataCd")}
                isShadowOnFocus
                isShowEditedColor
              />
            </div>
            <div className="ship">
              <Field
                name={`${formSubName}.shipNo`}
                width="100%"
                type="text"
                component={TextInput}
                placeholder="SHIP"
                maxLength={10}
                componentOnBlur={fieldToUpperCase("shipNo")}
                onKeyPress={handleKeyPressToUpperCase("shipNo")}
                disabled={!enabled.shipNo}
                validate={[validates.halfWidthShip, validates.lengthShip2]}
                onChange={handleOnChange("shipNo")}
                isForceError={getIsForceError("shipNo")}
                isShadowOnFocus
                isShowEditedColor
              />
            </div>
          </div>
        </FormTable>
        <FormTable>
          <div>
            <div className="status" />
            <div className="flightSts">Flight Status</div>
            <div className="cnxTo">CNX To</div>
            <div className="date">Date{lMark}</div>
            <div className="hideFlg">Hide Flag</div>
            <div className="codeShareFlight">Code Share Flight</div>
          </div>
          <div>
            <div className="status" />
            <div className="flightSts">
              <Field
                name={`${formSubName}.svcTypeDiaCd`}
                width="100%"
                component={SelectBox}
                placeholder="STS"
                options={flightStsOptions}
                hasBlank
                disabled={!enabled.svcTypeDiaCd}
                maxMenuHeight={490}
                validate={[validates.required]}
                onChange={handleOnChange("svcTypeDiaCd")}
                isForceError={getIsForceError("svcTypeDiaCd")}
                isShadowOnFocus
                isShowEditedColor
              />
            </div>
            <div className="cnxTo">
              <Field
                name={`${formSubName}.onwardFltName`}
                width="100%"
                type="text"
                component={TextInput}
                placeholder="CNX FLT"
                maxLength={6}
                componentOnBlur={fieldFltZeroPadding("onwardFltName")}
                onKeyPress={handleKeyPressFltZeroPadding("onwardFltName")}
                disabled={onwardForceDisabled || !enabled.onward}
                displayValue={onwardForceDisabled ? "" : undefined}
                validate={onwardForceDisabled ? [] : [myValidates.requiredCnxToPair, validates.lengthFlt3, validates.halfWidthFlt]}
                onChange={handleOnChange("svcTypeDiaCd")}
                isForceError={getIsForceError("onwardFltName")}
                isShadowOnFocus
                isShowEditedColor
              />
            </div>
            <div className="date">
              <Field
                name={`${formSubName}.onwardOrgDate`}
                width="100%"
                type="text"
                component={TextInput}
                placeholder="yymmdd"
                showKeyboard={isPc ? undefined : handleDateInputPopup(fltSchedule.onwardOrgDate, "onwardOrgDate")}
                maxLength={6}
                disabled={onwardForceDisabled || !enabled.onward}
                displayValue={isPc ? undefined : onwardForceDisabled ? "" : fltSchedule.onwardOrgDate}
                validate={
                  onwardForceDisabled
                    ? []
                    : isPc && fltSchedule.onwardOrgDate
                    ? [myValidates.requiredCnxToPair, validates.isYYMMDD]
                    : [myValidates.requiredCnxToPair]
                }
                onChange={handleOnChange("onwardOrgDate")}
                isForceError={getIsForceError("onwardOrgDate")}
                isShadowOnFocus
                isShowEditedColor
              />
            </div>
            <div className="hideFlg">
              <Field
                name={`${formSubName}.hideFlgCd`}
                width="100%"
                component={SelectBox}
                placeholder="Hide"
                options={[
                  { label: "DEP", value: "DEP" },
                  { label: "ARR", value: "ARR" },
                  { label: "BOTH", value: "BOTH" },
                ]}
                hasBlank
                disabled={!enabled.hideFlgCd}
                onSelect={handleOnChange("hideFlgCd")}
                isForceError={getIsForceError("hideFlgCd")}
                isShadowOnFocus
                isShowEditedColor
              />
            </div>
            <div className="codeShareFlight">
              <Field
                name={`${formSubName}.csFltNames`}
                width="100%"
                placeholder="C/S FLT"
                disabled={!enabled.csFltNames}
                component={MultipleCreatableInput}
                validate={[myValidates.isOkFlts, validates.unique]}
                formatValues={csFltNamesFormatValues}
                maxValLength={20}
                onChange={handleOnChangeCsFltNames}
                isForceError={getIsForceError("csFltNames")}
                isShadowOnFocus
                isShowEditedColor
              />
            </div>
          </div>
        </FormTable>
        <Footer>
          <PrimaryButton
            text="Enter"
            disabled={!isEdited}
            width="100px"
            // disabled={!(dirty || this.state.isEdited)} // dirtyは２回目の入力で上手くいかない時がある（初期値の投入方法が問題？）
          />
        </Footer>
      </FormContainer>
    </Modal>
  );
};

// バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const untouchField = (
  dispatch: AppDispatch,
  formActionUntouch: (...field: string[]) => void,
  formSyncErrors: FormErrors<FormData, string>
) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const validationErrorsFields: string[] = []; // 条件必須の項目はvalidateを持たないため常にtouchedをfalseにする。
  Object.keys(formSyncErrors).forEach((subFormName) => {
    Object.keys(subFormName).forEach((fieldName) => validationErrorsFields.push(`${formSubName}.${fieldName}`));
  });
  // console.log(JSON.stringify(validationErrorsFields));
  if (validationErrorsFields.length) {
    formActionUntouch(...validationErrorsFields);
    NotificationCreator.removeAll({ dispatch });
  }
};

const onSubmit: FormSubmitHandler<OalFlightSchedule, MyProps> = (_formValues, dispatch, props) => {
  const update = () => {
    const { fltSchedule } = props.formValues;
    const fltScheduleInitial = props.initialValues.fltSchedule;
    const { inputRowIndex } = props.oalFlightSchedule;
    if (fltSchedule && fltScheduleInitial && inputRowIndex !== null) {
      const isNotChanged =
        JSON.stringify({ ...fltSchedule, rowStatus: "", chgType: "" }) ===
        JSON.stringify({ ...fltScheduleInitial, rowStatus: "", chgType: "" });
      const statusItems = {
        rowStatus: isNotChanged ? "" : ("Edited" as RowStatus),
        chgType: isNotChanged && fltSchedule.chgType !== "ADD FLT" && fltSchedule.chgType !== "ADD LEG" ? "" : fltSchedule.chgType,
        updateValidationErrors: [],
      };
      const editedFltSchedule: OalFlightSchedule = {
        ...fltSchedule,
        ...statusItems,
      };
      dispatch(fltListEdit({ index: inputRowIndex, fltScheduleList: [editedFltSchedule] }));
      // FLT No.の場合、他のLEGも更新
      if (fltSchedule.chgType === "FLT No.") {
        let findedIndex = -1;
        for (;;) {
          findedIndex = props.oalFlightSchedule.fltScheduleList.findIndex(
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            (f, index) => f.fltIndex === fltSchedule.fltIndex && f.legIndex !== fltSchedule.legIndex && index > findedIndex
          );
          if (findedIndex >= 0) {
            const editedFltSchedule2: OalFlightSchedule = {
              ...props.oalFlightSchedule.fltScheduleList[findedIndex],
              ...statusItems,
              fltName: fltSchedule.fltName,
            };
            dispatch(fltListEdit({ index: findedIndex, fltScheduleList: [editedFltSchedule2] }));
          } else {
            break;
          }
        }
        // マルチレグの１行目の場合、他のLEGにFLT情報をコピーする
      } else if (fltSchedule.legIndex === 0) {
        let findedIndex = -1;
        for (;;) {
          findedIndex = props.oalFlightSchedule.fltScheduleList.findIndex(
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            (f, index) => f.fltIndex === fltSchedule.fltIndex && f.legIndex !== fltSchedule.legIndex && index > findedIndex
          );
          if (findedIndex >= 0) {
            const editedFltSchedule2: OalFlightSchedule = {
              ...props.oalFlightSchedule.fltScheduleList[findedIndex],
              ...getFltInfo(fltSchedule),
            };
            dispatch(fltListEdit({ index: findedIndex, fltScheduleList: [editedFltSchedule2] }));
          } else {
            break;
          }
        }
      }
      dispatch(
        setInputModal({
          isOpenInputModal: false,
          inputRowIndex: null,
          inputChgType: "",
          inputNewRow: null,
        })
      );

      untouchField(dispatch, untouch, props.formSyncErrors);
    }
  };
  // props.showMessage(SoalaMessage.M30010C({ onYesButton: update }));
  update();
};

const FormContainer = styled.form`
  width: 100%;
  height: "fit-content";
`;

const FormTable = styled.div`
  > div:nth-child(1) {
    display: flex;
    align-items: center;
    background-color: rgb(39, 153, 198);
    color: #fff;
    height: 26px;
    padding-left: 20px;
    font-size: 12px;
    > div {
      margin-left: 10px;
    }
  }
  > div:nth-child(2) {
    display: flex;
    align-items: center;
    padding: 20px;
    > div {
      margin-left: 10px;
    }
  }
  .chgType {
    width: 100px;
    justify-content: center;
    padding-left: 0;
  }
  .casual {
    width: 100px;
    justify-content: center;
    padding-left: 0;
  }
  .flight {
    width: 112px;
  }
  .date {
    width: 80px;
  }
  .domInt {
    width: 76px;
  }
  .paxCgo {
    width: 76px;
  }
  .skdNsk {
    width: 76px;
  }
  .status {
    width: 100px;
    justify-content: center;
    padding-left: 0;
  }
  .dep,
  .arr {
    width: 90px;
  }
  .std,
  .etd,
  .sta,
  .eta {
    width: 88px;
  }
  .eqp {
    width: 64px;
  }
  .ship {
    width: 120px;
  }
  .flightSts {
    width: 80px;
  }
  .cnxTo {
    width: 112px;
  }
  .hideFlg {
    width: 76px;
  }
  .codeShareFlight {
    display: flex;
    width: 398px;
  }
`;

const ChgTypeColumn = styled.div`
  -webkit-text-stroke: 1px;
  color: ${({ theme }) => theme.color.text.CHANGED};
`;

const StatusColumn = styled.div<{ dirty: boolean; lineThrough: boolean }>`
  -webkit-text-stroke: 1px;
  color: ${({ dirty, lineThrough, theme }) => (dirty || lineThrough ? theme.color.text.CHANGED : "#000")};
  text-decoration: ${({ lineThrough }) => (lineThrough ? "line-through" : "none")};
`;

const CheckBoxItem = styled.div<{ disabled: boolean; dirty: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 44px;
  background-color: ${({ disabled, dirty, theme }) => (disabled ? "rgba(0,0,0,0)" : dirty ? theme.color.background.DELETED : "#FFF")};
  label {
    margin: 0 5px;
  }
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 0 30px 0;
  justify-content: center;
`;

/**
 * コネクト
 */
export const formName = "oalFlightSchedule";
export const formSubName = "fltSchedule";
export type OalFormValues = { fltSchedule: OalFlightSchedule | undefined };

interface InputStateProps {
  oalFlightSchedule: oalFlightScheduleActions.OalFlightScheduleState;
  formSyncErrors: FormErrors<FormData>;
  formValues: OalFormValues;
  initialValues: OalFormValues;
  legCount: number;
}

const mapStateToProps = (state: RootState): InputStateProps => {
  const formSyncErrors = getFormSyncErrors(formName)(state);
  const { fltScheduleListInitial, inputRowIndex, inputChgType, fltScheduleList } = state.oalFlightSchedule;
  // 初期値の設定処理
  let fltScheduleInitial: OalFlightSchedule | undefined;
  let legCount = 0;
  if (inputRowIndex !== null) {
    fltScheduleInitial = cloneDeep(fltScheduleListInitial[inputRowIndex]);

    const { fltIndex } = fltScheduleList[inputRowIndex];
    legCount = fltScheduleList.filter((f) => f.fltIndex === fltIndex).length;
  } else {
    fltScheduleInitial = getInitialFormState({ fltIndex: 0, legIndex: 0 });
  }

  fltScheduleInitial.chgType = inputChgType; // 指定のChgTypeを設定する
  return {
    oalFlightSchedule: state.oalFlightSchedule,
    formSyncErrors,
    formValues: getFormValues(formName)(state) as OalFormValues,
    initialValues: { fltSchedule: fltScheduleInitial },
    legCount,
  };
};

type InputlParams = OalFlightSchedule;

const OalFlightScheduleModalForm = reduxForm<InputlParams, MyProps>({
  form: formName,
  onSubmit, // submitをここで設定しないと、ポップアップ入力画面からRemoteSubmitできない。
  enableReinitialize: true,
})(OalFlightScheduleInputModal);

export default connect(mapStateToProps)(OalFlightScheduleModalForm);
