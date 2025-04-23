import dayjs from "dayjs";
import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import {
  Field,
  InjectedFormProps,
  reduxForm,
  getFormValues,
  getFormSyncErrors,
  FormErrors,
  Normalizer,
  submit,
  FormSubmitHandler,
} from "redux-form";
import styled from "styled-components";
import difference from "lodash.difference";

import { RootState } from "../../../store/storeType";
import { useAppDispatch, usePrevious } from "../../../store/hooks";
import {
  FlightMovementModalState,
  FormValue,
  closeFlightMovementModal,
  showMessage,
  updateFlightIrregular,
  updateFlightMovement,
} from "../../../reducers/flightMovementModal";
import { openDateTimeInputPopup } from "../../../reducers/dateTimeInputPopup";
import { JobAuth, Master } from "../../../reducers/account";
import { funcAuthCheck } from "../../../lib/commonUtil";
import { Const } from "../../../lib/commonConst";
import { storage } from "../../../lib/storage";
import * as validates from "../../../lib/validators";
// eslint-disable-next-line import/no-cycle
import * as myValidates from "../../../lib/validators/flightMovementValidator";
import { SoalaMessage } from "../../../lib/soalaMessages";
import PrimaryButton from "../../atoms/PrimaryButton";
import SelectBox, { OptionType } from "../../atoms/SelectBox";
import TextInput from "../../atoms/TextInput";
import TimeInputPanel from "../../molecules/TimeInputPanel";
import TimeInputPlusMinusButtons from "../../molecules/TimeInputPlusMinusButtons";
import FlightModalHeader from "../../molecules/FlightModalHeader";
import { FlightHeader } from "../../../reducers/flightContents";
import CommonSlideTab from "../../molecules/CommonSlideTab";
import { severErrorItems, getfisStsOptions } from "./FlightMovementType";
import DraggableModal, { draggableModal } from "../../molecules/DraggableModal";
// eslint-disable-next-line import/no-cycle
import IrregularContent from "../../molecules/FlightMovementModal/IrregularContent";
import { ServerConfig } from "../../../../config/config";
import { forceGoTo } from "../../../reducers/common";
import ArrowRightIconSvg from "../../../assets/images/icon/arrow_right.svg";

export { FormValue } from "../../../reducers/flightMovementModal";

export type MyProps = {
  flightMovementModal: FlightMovementModalState;
  jobAuth: JobAuth;
  master: Master;
  formValues: FormValue | undefined;
  // eslint-disable-next-line react/no-unused-prop-types
  formSyncErrors: FormErrors<FormData>;
};

type Props = MyProps & InjectedFormProps<FormValue, MyProps>;

const FlightMovementModal: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const prevIsOpen = usePrevious(props.flightMovementModal.isOpen);
  const prevMovementInfo = usePrevious(props.flightMovementModal.movementInfo);
  const prevFormValues = usePrevious(props.formValues);

  const tabNames = {
    emergency: "Emergency",
    depMvt: "DEP MVT",
    arrMvt: "ARR MVT",
    irregular: "Irregular",
  };

  const tabsDev = (irregularEnabled: boolean): { name: string; enabled: boolean }[] => [
    { name: tabNames.emergency, enabled: true },
    { name: tabNames.depMvt, enabled: true },
    { name: tabNames.irregular, enabled: irregularEnabled },
  ];

  const tabsArr = (irregularEnabled: boolean): { name: string; enabled: boolean }[] => [
    { name: tabNames.emergency, enabled: true },
    { name: tabNames.arrMvt, enabled: true },
    { name: tabNames.irregular, enabled: irregularEnabled },
  ];

  const [tabs, setTabs] = useState<{ name: string; enabled: boolean }[]>(
    props.flightMovementModal.isDep === undefined ? [] : props.flightMovementModal.isDep ? tabsDev(true) : tabsArr(true)
  );
  const [currentTabName, setCurrentTabName] = useState<string>(
    props.flightMovementModal.isDep === undefined || tabs[0] === undefined
      ? ""
      : tabs[0].name === tabNames.emergency
      ? tabs[1].name
      : tabs[0].name
  );
  const [updateValidationErrors, setUpdateValidationErrors] = useState<string[]>([]);

  // eslint-disable-next-line react/sort-comp
  const headerHeight = 40;

  // イレギュラー管理画面の更新権限なし、またはJAL GRP便の場合はイレギュラータブを表示しない
  const tabsDevNoIrregular = () => [
    { name: tabNames.emergency, enabled: true },
    { name: tabNames.depMvt, enabled: true },
  ];

  const tabsArrNoIrregular = () => [
    { name: tabNames.emergency, enabled: true },
    { name: tabNames.arrMvt, enabled: true },
  ];

  // 参照モード(便動態更新画面の更新権限なし、またはキャンセル便)の場合はEmergencyタブ、イレギュラータブを表示しない
  const tabsDevRefMode = () => [{ name: tabNames.depMvt, enabled: true }];

  const tabsArrRefMode = () => [{ name: tabNames.arrMvt, enabled: true }];

  const tentativeOptions = [
    { label: "MNR", value: "MNR" },
    { label: "TTV", value: "TTV" },
    { label: "UNK", value: "UNK" },
  ];

  const hasGtbReturnIn = useMemo(
    () => props.flightMovementModal.isOpen && props.formValues?.fisFltSts === "GTB" && !!props.formValues?.depInfo.returnIn,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.formValues?.depInfo.returnIn, props.flightMovementModal.isOpen]
  );

  const getIsRefMode = (jobAuth: JobAuthApi.JobAuth[], movementInfo: FlightMovementModalState["movementInfo"]) =>
    !funcAuthCheck(Const.FUNC_ID.updateOalFlightMovement, jobAuth) ||
    !movementInfo ||
    movementInfo.legCnlFlg ||
    movementInfo.connectDbCat === "P";

  // useEffect(() => {
  //   const { formValues } = props;
  //   if (formValues?.fisFltSts === "GTB") {
  //     //      setIsGtbReturnIn(!!formValues?.depInfo.returnIn);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.formValues?.depInfo.returnIn]);

  useEffect(() => {
    if (!props.flightMovementModal.isOpen && prevIsOpen) {
      setTabs([]);
    } else if (!prevMovementInfo && props.flightMovementModal.movementInfo) {
      const { movementInfo } = props.flightMovementModal;
      const isRefMode = getIsRefMode(props.jobAuth.jobAuth, movementInfo);

      if (isRefMode) {
        // 参照モード(便動態更新画面の更新権限なし、またはキャンセル便)の場合
        setTabs(props.flightMovementModal.isDep ? tabsDevRefMode() : tabsArrRefMode());
      } else if (!funcAuthCheck(Const.FUNC_ID.updateIrregularControl, props.jobAuth.jobAuth) || !props.flightMovementModal.isOal) {
        // イレギュラー管理画面の更新権限なし、またはJAL GRP便の場合
        setTabs(props.flightMovementModal.isDep ? tabsDevNoIrregular() : tabsArrNoIrregular());
      } else {
        let irregularEnabled = true;
        if (props.flightMovementModal.movementInfo && props.flightMovementModal.movementInfo.arrInfo.actLdLcl) {
          irregularEnabled = false;
        }
        setTabs(props.flightMovementModal.isDep ? tabsDev(irregularEnabled) : tabsArr(irregularEnabled));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.flightMovementModal.isOpen, props.flightMovementModal.movementInfo]);

  useEffect(() => {
    if (tabs[0] === undefined) {
      setCurrentTabName("");
    } else {
      setCurrentTabName(tabs[0] === undefined ? "" : tabs[0].name === tabNames.emergency ? tabs[1].name : tabs[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  useEffect(() => {
    // ATDをブランクにした場合は、連動して遅延情報もブランクにする
    if (prevFormValues && prevFormValues.depInfo.atd && props.formValues && !props.formValues.depInfo.atd) {
      props.change("depInfo.depDlyTime1", "");
      props.change("depInfo.depDlyTime2", "");
      props.change("depInfo.depDlyTime3", "");
      props.change("depInfo.depDlyRsnCd1", "");
      props.change("depInfo.depDlyRsnCd2", "");
      props.change("depInfo.depDlyRsnCd3", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.formValues]);

  useEffect(() => {
    // サーバーのエラーがある場合、赤枠を表示させる
    if (!props.flightMovementModal.isFetching) {
      setUpdateValidationErrors(props.flightMovementModal.updateValidationErrors);
      //       if (!_.isEmpty(this.props.flightMovementModal.updateValidationErrors)) {
      //         const fieldNames = Object.keys(severErrorItems);
      // //        this.props.touch(...fieldNames);
      //       }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.flightMovementModal.isFetching]);

  useEffect(() => {
    if (hasGtbReturnIn) {
      props.change("depInfo.atd", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGtbReturnIn]);

  // // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
  // untouchField = () => {
  //   const { untouch, formSyncErrors } = this.props;
  //   const validationErrorsFields: string[] = []; // 条件必須の項目はvalidateを持たないため常にtouchedをfalseにする。
  //   Object.keys(formSyncErrors).forEach(subFormName => {
  //     Object.keys(subFormName).forEach(fieldName => validationErrorsFields.push(fieldName))
  //   })
  //   // console.log(JSON.stringify(validationErrorsFields));
  //   if (validationErrorsFields.length) {
  //     untouch(...validationErrorsFields);
  //   }
  // }

  const closeModal = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<Element>) => {
    e.stopPropagation();
    const close = () => {
      dispatch(closeFlightMovementModal());
    };
    if (props.dirty) {
      void dispatch(showMessage({ message: SoalaMessage.M40001C({ onYesButton: close }) }));
    } else {
      close();
    }
  };

  const getIsForceError = (fieldName: keyof typeof severErrorItems) => {
    const errorItems = severErrorItems[fieldName];
    for (let xi = 0; xi < errorItems.length; xi++) {
      const includes = updateValidationErrors.includes(errorItems[xi]);
      if (includes) return true;
    }
    return false;
  };

  const handleOnClickChange = (tabName: string) => {
    const changeTab = () => {
      setCurrentTabName(tabName);
      props.reset();
    };

    if (props.dirty) {
      void dispatch(showMessage({ message: SoalaMessage.M40001C({ onYesButton: changeTab }) }));
    } else {
      changeTab();
    }
  };

  const handleOnClickSkdToEtd = () => {
    const { initialValues } = props;
    if (initialValues && initialValues.depInfo) {
      const fieldName = "depInfo.etd";
      props.change(fieldName, initialValues.depInfo.std);
      handleOnChange(fieldName)();
    }
  };

  const handleOnClickSkdToEta = () => {
    const { initialValues } = props;
    if (initialValues && initialValues.arrInfo) {
      const fieldName = "arrInfo.eta";
      props.change(fieldName, initialValues.arrInfo.sta);
      handleOnChange(fieldName)();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changeValue = (fieldName: keyof typeof severErrorItems) => (value: any) => {
    props.change(fieldName, value);
    handleOnChange(fieldName)();
  };

  const handleDateTimeInputPopup = (value: string | undefined, fieldName: keyof typeof severErrorItems) => () => {
    const { movementInfo } = props.flightMovementModal;
    const timeDiffUtc = movementInfo
      ? props.flightMovementModal.isDep
        ? movementInfo.depInfo.lstDepApoTimeDiffUtc
        : movementInfo.arrInfo.lstArrApoTimeDiffUtc
      : -9;
    const dateRange = movementInfo ? myValidates.getAvailableDateRange(movementInfo.legkey.orgDateLcl) : null;
    dispatch(
      openDateTimeInputPopup({
        valueFormat: "YYYY-MM-DD[T]HH:mm:ss",
        currentValue: value || "",
        defaultSetting: value ? { value } : { timeDiffUtc },
        onEnter: changeValue(fieldName),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onUpdate: async (dateTime) => {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await changeValue(fieldName)(dateTime);
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await dispatch(submit(formName));
        },
        doTypoCheck: true,
        minDate: dateRange ? dateRange.minDateDayjs.toDate() : undefined,
        maxDate: dateRange ? dateRange.maxDateDayjs.toDate() : undefined,
      })
    );
  };

  const handleOnChange = (fieldName: keyof typeof severErrorItems) => () => {
    // サーバーのバリデーションでエラーとなった対象項目の赤枠を消す
    const errorItems = severErrorItems[fieldName];
    setUpdateValidationErrors(difference(updateValidationErrors, errorItems));
  };

  const formatToDDHHmm = (dateTimeValue: string) => {
    if (dateTimeValue && dayjs(dateTimeValue).isValid()) {
      return dayjs(dateTimeValue).format("DDHHmm");
    }
    return "";
  };

  const calculateContentHeight = (isRefMode: boolean) => {
    if (draggableModal && storage.isIphone) {
      const draggableModalHeight = draggableModal.headHeight + draggableModal.offsetY + draggableModal.deviceTopMargin;

      if (currentTabName === "Irregular") {
        return `calc(100vh - ${draggableModalHeight}px - 36px - 88px - 8px)`;
      }
      if (isRefMode) {
        return `calc(100vh - ${draggableModalHeight}px - 36px)`;
      }

      return `calc(100vh - ${draggableModalHeight}px - 36px - 88px)`;
    }

    return currentTabName === "Irregular" ? "272px" : currentTabName === "Emergency" ? "405px" : "534px";
  };

  const normalizeTime: Normalizer = (value: string) => {
    const onlyNums = value.replace(/[^\d]/g, "");
    return onlyNums;
  };

  const getContent = () => {
    const { flightMovementModal, master, formValues, handleSubmit, initialValues, dirty, jobAuth } = props;
    const { movementInfo } = flightMovementModal;
    const depDlyRsnOption: OptionType[] = master.dlyRsns
      ? master.dlyRsns
          .filter((d) => d.arrDepCd === "DEP")
          .sort((a, b) => a.dispSeq - b.dispSeq)
          .map((d) => ({ label: d.dlyRsnJalCd, value: d.dlyRsnJalCd }))
      : [];
    const isRefMode = getIsRefMode(jobAuth.jobAuth, movementInfo);
    const contentHeight = calculateContentHeight(isRefMode);
    const ddhhmmWidth = 92;
    const isIrregular = currentTabName === tabNames.irregular;
    const isEmergency = currentTabName === tabNames.emergency;
    const isJalGrpAfterTo = !storage.takeOffTimeMaint && !flightMovementModal.isOal && !!movementInfo?.depInfo.actToLcl;
    const fisOptions = movementInfo ? getfisStsOptions(movementInfo.fisFltSts, isEmergency, flightMovementModal.isOal) : [];

    return (
      <>
        <CommonSlideTab currentTabName={currentTabName} tabs={tabs} onClickTab={handleOnClickChange} />
        <FormContent onSubmit={handleSubmit}>
          <TabContent isIphone={storage.isIphone} height={contentHeight} isIrregular={isIrregular}>
            {movementInfo && formValues && (
              <ScrollContent>
                {currentTabName === tabNames.depMvt && initialValues.depInfo ? (
                  <>
                    <GroupBox>
                      <GroupBoxRow marginTop="0">
                        <HoSpacePlusMinusButton />
                        <LabelContainer>
                          <label>FIS Status</label>
                          <RowColumnItem width="70px">{initialValues.fisFltSts}</RowColumnItem>
                        </LabelContainer>
                        <div>
                          <RowColumnItem>
                            <ArrowRightIcon />
                          </RowColumnItem>
                        </div>
                        <Field
                          name="fisFltSts"
                          width={74}
                          height={40}
                          component={SelectBox}
                          options={fisOptions}
                          disabled={isRefMode}
                          hasBlank
                          disabledSimpleColor={isRefMode}
                          maxMenuHeight={350}
                          onChange={handleOnChange("fisFltSts")}
                          isForceError={getIsForceError("fisFltSts")}
                          isShadowOnFocus
                          isShowEditedColor
                          autoFocus
                        />
                      </GroupBoxRow>
                    </GroupBox>
                    <GroupBox>
                      <GroupBoxRow marginTop="0">
                        <HoSpacePlusMinusButton />
                        <LabelContainer>
                          <label>STD</label>
                          <RowColumnItem width={ddhhmmWidth}>{formatToDDHHmm(initialValues.depInfo.std)}</RowColumnItem>
                        </LabelContainer>
                      </GroupBoxRow>
                      <GroupBoxRow marginTop="4px">
                        <TimeInputPlusMinusButtons
                          dateTimeValue={formValues.depInfo.etd}
                          disabled={isRefMode}
                          onClick={changeValue("depInfo.etd")}
                        >
                          <LabelContainer>
                            <label>ETD</label>
                            <Field
                              name="depInfo.etd"
                              width={ddhhmmWidth}
                              height={40}
                              type="text"
                              component={TextInput}
                              placeholder="ddhhmm"
                              fontSizeOfPlaceholder={17}
                              showKeyboard={handleDateTimeInputPopup(formValues.depInfo.etd, "depInfo.etd")}
                              displayValue={formatToDDHHmm(formValues.depInfo.etd)}
                              maxLength={6}
                              disabled={isRefMode}
                              disabledSimpleColor={isRefMode}
                              validate={[myValidates.requiredEtdWithoutStd, myValidates.requiredEtd, myValidates.rangeMovementDate]}
                              onChange={handleOnChange("depInfo.etd")}
                              isForceError={getIsForceError("depInfo.etd")}
                              isShadowOnFocus
                              isShowEditedColor
                            />
                          </LabelContainer>
                        </TimeInputPlusMinusButtons>
                        <HoSpaceS />
                        <div style={{ width: "64px" }}>
                          {!isRefMode && <PrimaryButton type="button" text="SKD" height="40px" onClick={handleOnClickSkdToEtd} />}
                        </div>
                        <HoSpaceM />
                        <LabelContainer>
                          <label>M/T/U</label>
                          <Field
                            name="depInfo.etdCd"
                            width={74}
                            height={40}
                            component={SelectBox}
                            options={tentativeOptions}
                            disabled={isRefMode}
                            disabledSimpleColor={isRefMode}
                            hasBlank
                            onChange={handleOnChange("depInfo.etdCd")}
                            isForceError={getIsForceError("depInfo.etdCd")}
                            isShadowOnFocus
                            isShowEditedColor
                          />
                        </LabelContainer>
                      </GroupBoxRow>
                      <GroupBoxRow>
                        <TimeInputPlusMinusButtons
                          dateTimeValue={formValues.depInfo.atd}
                          disabled={isRefMode || isJalGrpAfterTo || hasGtbReturnIn}
                          onClick={changeValue("depInfo.atd")}
                        >
                          <LabelContainer>
                            <label>ATD</label>
                            <Field
                              name="depInfo.atd"
                              width={ddhhmmWidth}
                              height={40}
                              type="text"
                              component={TextInput}
                              placeholder="ddhhmm"
                              fontSizeOfPlaceholder={17}
                              showKeyboard={handleDateTimeInputPopup(formValues.depInfo.atd, "depInfo.atd")}
                              displayValue={formatToDDHHmm(formValues.depInfo.atd)}
                              maxLength={6}
                              disabled={isRefMode || isJalGrpAfterTo || hasGtbReturnIn}
                              disabledSimpleColor={isRefMode}
                              validate={[myValidates.requiredATD, myValidates.rangeMovementDate, myValidates.orderAtdTo]}
                              onChange={handleOnChange("depInfo.atd")}
                              isForceError={getIsForceError("depInfo.atd")}
                              isShadowOnFocus
                              isShowEditedColor
                              isShowEditedDeletedColor={hasGtbReturnIn}
                            />
                          </LabelContainer>
                        </TimeInputPlusMinusButtons>
                        <HoSpaceS />
                        <div>
                          {!isRefMode && !isJalGrpAfterTo && !hasGtbReturnIn && (
                            <TimeInputPanel
                              dateTimeValue={formValues.depInfo.atd}
                              timeDiff={movementInfo.depInfo.lstDepApoTimeDiffUtc}
                              onClick={changeValue("depInfo.atd")}
                              height="40px"
                            />
                          )}
                        </div>
                      </GroupBoxRow>
                      {(!formValues.depInfo.std ||
                        (formValues.depInfo.std && formValues.depInfo.atd && formValues.depInfo.std < formValues.depInfo.atd)) && (
                        <>
                          <GroupBoxRow>
                            <HoSpacePlusMinusButton />
                            <LabelContainer>
                              <label>DLY Time/Reason</label>
                              <GroupBoxRowInRow>
                                <Field
                                  name="depInfo.depDlyTime1"
                                  width={68}
                                  height={40}
                                  type="text"
                                  component={TextInput}
                                  placeholder="hhmm"
                                  maxLength={4}
                                  pattern="\d*"
                                  disabled={isRefMode || isJalGrpAfterTo}
                                  disabledSimpleColor={isRefMode}
                                  normalize={normalizeTime}
                                  validate={[myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime]}
                                  onChange={handleOnChange("depInfo.depDlyTime1")}
                                  isForceError={getIsForceError("depInfo.depDlyTime1")}
                                  isShadowOnFocus
                                  isShowEditedColor
                                />
                                <HoSpaceS />
                                <Field
                                  name="depInfo.depDlyRsnCd1"
                                  width={60}
                                  height={40}
                                  component={SelectBox}
                                  options={depDlyRsnOption}
                                  disabled={isRefMode || isJalGrpAfterTo}
                                  disabledSimpleColor={isRefMode}
                                  validate={myValidates.requiredDepDlyRsnCd}
                                  maxMenuHeight={136}
                                  onChange={handleOnChange("depInfo.depDlyRsnCd1")}
                                  isForceError={getIsForceError("depInfo.depDlyRsnCd1")}
                                  hasBlank
                                  isShadowOnFocus
                                  isShowEditedColor
                                  isSearchable
                                />
                              </GroupBoxRowInRow>
                            </LabelContainer>
                            <HoSpaceL />
                            <div>
                              <GroupBoxRowInRow>
                                <Field
                                  name="depInfo.depDlyTime2"
                                  width={68}
                                  height={40}
                                  type="text"
                                  component={TextInput}
                                  placeholder="hhmm"
                                  maxLength={4}
                                  pattern="\d*"
                                  disabled={isRefMode || isJalGrpAfterTo}
                                  disabledSimpleColor={isRefMode}
                                  normalize={normalizeTime}
                                  validate={[myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime]}
                                  onChange={handleOnChange("depInfo.depDlyTime2")}
                                  isForceError={getIsForceError("depInfo.depDlyTime2")}
                                  isShadowOnFocus
                                  isShowEditedColor
                                />
                                <HoSpaceS />
                                <Field
                                  name="depInfo.depDlyRsnCd2"
                                  width={60}
                                  height={40}
                                  component={SelectBox}
                                  options={depDlyRsnOption}
                                  disabled={isRefMode || isJalGrpAfterTo}
                                  disabledSimpleColor={isRefMode}
                                  validate={myValidates.requiredDepDlyRsnCd}
                                  maxMenuHeight={136}
                                  onChange={handleOnChange("depInfo.depDlyRsnCd2")}
                                  isForceError={getIsForceError("depInfo.depDlyRsnCd2")}
                                  hasBlank
                                  isShadowOnFocus
                                  isShowEditedColor
                                  isSearchable
                                />
                              </GroupBoxRowInRow>
                            </div>
                          </GroupBoxRow>
                          <GroupBoxRow marginTop="8px">
                            <HoSpacePlusMinusButton />
                            <div>
                              <GroupBoxRowInRow>
                                <Field
                                  name="depInfo.depDlyTime3"
                                  width={68}
                                  height={40}
                                  type="text"
                                  component={TextInput}
                                  placeholder="hhmm"
                                  maxLength={4}
                                  pattern="\d*"
                                  disabled={isRefMode || isJalGrpAfterTo}
                                  disabledSimpleColor={isRefMode}
                                  normalize={normalizeTime}
                                  validate={[myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime]}
                                  onChange={handleOnChange("depInfo.depDlyTime3")}
                                  isForceError={getIsForceError("depInfo.depDlyTime3")}
                                  isShadowOnFocus
                                  isShowEditedColor
                                />
                                <HoSpaceS />
                                <Field
                                  name="depInfo.depDlyRsnCd3"
                                  width={60}
                                  height={40}
                                  component={SelectBox}
                                  options={depDlyRsnOption}
                                  disabled={isRefMode || isJalGrpAfterTo}
                                  disabledSimpleColor={isRefMode}
                                  validate={myValidates.requiredDepDlyRsnCd}
                                  maxMenuHeight={136}
                                  onChange={handleOnChange("depInfo.depDlyRsnCd3")}
                                  isForceError={getIsForceError("depInfo.depDlyRsnCd3")}
                                  hasBlank
                                  isShadowOnFocus
                                  isShowEditedColor
                                  isSearchable
                                />
                              </GroupBoxRowInRow>
                            </div>
                            <HoSpaceL />
                            {/* <div> */}
                            {/*  <GroupBoxRowInRow> */}
                            {/*    <Field */}
                            {/*      name={"depInfo.depDlyTime4"} */}
                            {/*      width={68} */}
                            {/*      height={40} */}
                            {/*      type="text" */}
                            {/*      component={TextInput} */}
                            {/*      placeholder="hhmm" */}
                            {/*      maxLength={4} */}
                            {/*      pattern="\d*" */}
                            {/*      disabled={isRefMode} */}
                            {/*      disabledSimpleColor={isRefMode} */}
                            {/*      normalize={ this.normalizeTime } */}
                            {/*      validate={[myValidates.requiredDepDlyTime, validates.time, myValidates.matchDepDlyTime]} */}
                            {/*      onChange={this.handleOnChange("depInfo.depDlyTime4")} */}
                            {/*      isForceError={this.getIsForceError("depInfo.depDlyTime4")} */}
                            {/*      isShadowOnFocus */}
                            {/*      isShowEditedColor */}
                            {/*    /> */}
                            {/*    <HoSpaceS /> */}
                            {/*    <Field */}
                            {/*      name={"depInfo.depDlyRsnCd4"} */}
                            {/*      width={64} */}
                            {/*      height={40} */}
                            {/*      component={SelectBox} */}
                            {/*      options={depDlyRsnOption} */}
                            {/*      disabled={isRefMode} */}
                            {/*      disabledSimpleColor={isRefMode} */}
                            {/*      validate={myValidates.requiredDepDlyRsnCd} */}
                            {/*      maxMenuHeight={136} */}
                            {/*      onChange={this.handleOnChange("depInfo.depDlyRsnCd4")} */}
                            {/*      isForceError={this.getIsForceError("depInfo.depDlyRsnCd4")} */}
                            {/*      hasBlank */}
                            {/*      isShadowOnFocus */}
                            {/*      isShowEditedColor */}
                            {/*      isSearchable */}
                            {/*    /> */}
                            {/*  </GroupBoxRowInRow> */}
                            {/* </div> */}
                          </GroupBoxRow>
                        </>
                      )}
                      <GroupBoxRow>
                        <TimeInputPlusMinusButtons
                          dateTimeValue={formValues.depInfo.toTime}
                          disabled={isRefMode || isJalGrpAfterTo || movementInfo.irrSts === "GTB"}
                          onClick={changeValue("depInfo.toTime")}
                        >
                          <LabelContainer>
                            <label>T/O</label>
                            <Field
                              name="depInfo.toTime"
                              width={ddhhmmWidth}
                              height={40}
                              type="text"
                              component={TextInput}
                              placeholder="ddhhmm"
                              fontSizeOfPlaceholder={17}
                              showKeyboard={handleDateTimeInputPopup(formValues.depInfo.toTime, "depInfo.toTime")}
                              displayValue={formatToDDHHmm(formValues.depInfo.toTime)}
                              maxLength={6}
                              disabled={isRefMode || isJalGrpAfterTo || movementInfo.irrSts === "GTB"}
                              disabledSimpleColor={isRefMode}
                              validate={[myValidates.rangeMovementDate, myValidates.orderAtdTo, myValidates.orderReturnInTo]}
                              onChange={handleOnChange("depInfo.toTime")}
                              isForceError={getIsForceError("depInfo.toTime")}
                              isShadowOnFocus
                              isShowEditedColor
                            />
                          </LabelContainer>
                        </TimeInputPlusMinusButtons>
                        <HoSpaceS />
                        <div>
                          {!isRefMode && !isJalGrpAfterTo && !(movementInfo.irrSts === "GTB") && (
                            <TimeInputPanel
                              dateTimeValue={formValues.depInfo.toTime}
                              timeDiff={movementInfo.depInfo.lstDepApoTimeDiffUtc}
                              onClick={changeValue("depInfo.toTime")}
                              height="40px"
                            />
                          )}
                        </div>
                      </GroupBoxRow>
                    </GroupBox>
                    {movementInfo.depInfo.rtrOccurCnt > 0 && (
                      <GroupBox pinkColor>
                        <GroupBoxRow marginTop="0">
                          <TimeInputPlusMinusButtons
                            dateTimeValue={formValues.depInfo.estimateReturnIn}
                            disabled={isRefMode}
                            onClick={changeValue("depInfo.estimateReturnIn")}
                          >
                            <LabelContainer>
                              <label style={{ width: ddhhmmWidth }}>Estimated Return In</label>
                              <Field
                                name="depInfo.estimateReturnIn"
                                width={ddhhmmWidth}
                                height={40}
                                type="text"
                                component={TextInput}
                                placeholder="ddhhmm"
                                fontSizeOfPlaceholder={17}
                                showKeyboard={handleDateTimeInputPopup(formValues.depInfo.estimateReturnIn, "depInfo.estimateReturnIn")}
                                displayValue={formatToDDHHmm(formValues.depInfo.estimateReturnIn)}
                                maxLength={6}
                                disabled={isRefMode}
                                disabledSimpleColor={isRefMode}
                                validate={[myValidates.rangeMovementDate]}
                                onChange={handleOnChange("depInfo.estimateReturnIn")}
                                isForceError={getIsForceError("depInfo.estimateReturnIn")}
                                isShadowOnFocus
                                isShowEditedColor
                              />
                            </LabelContainer>
                          </TimeInputPlusMinusButtons>
                          <HoSpaceS />
                          <TimeInputPlusMinusButtons
                            dateTimeValue={formValues.depInfo.firstBo}
                            disabled={isRefMode}
                            onClick={changeValue("depInfo.firstBo")}
                          >
                            <LabelContainer>
                              <label>1st B/O</label>
                              <Field
                                name="depInfo.firstBo"
                                width={ddhhmmWidth}
                                height={40}
                                type="text"
                                component={TextInput}
                                placeholder="ddhhmm"
                                fontSizeOfPlaceholder={17}
                                showKeyboard={handleDateTimeInputPopup(formValues.depInfo.firstBo, "depInfo.firstBo")}
                                displayValue={formatToDDHHmm(formValues.depInfo.firstBo)}
                                maxLength={6}
                                disabled={isRefMode}
                                disabledSimpleColor={isRefMode}
                                validate={[myValidates.rangeMovementDate]}
                                onChange={handleOnChange("depInfo.firstBo")}
                                isForceError={getIsForceError("depInfo.firstBo")}
                                isShadowOnFocus
                                isShowEditedColor
                              />
                            </LabelContainer>
                          </TimeInputPlusMinusButtons>
                        </GroupBoxRow>
                        <GroupBoxRow>
                          <TimeInputPlusMinusButtons
                            dateTimeValue={formValues.depInfo.returnIn}
                            disabled={isRefMode}
                            onClick={changeValue("depInfo.returnIn")}
                          >
                            <LabelContainer>
                              <label>Return In</label>
                              <Field
                                name="depInfo.returnIn"
                                width={ddhhmmWidth}
                                height={40}
                                type="text"
                                component={TextInput}
                                placeholder="ddhhmm"
                                fontSizeOfPlaceholder={17}
                                showKeyboard={handleDateTimeInputPopup(formValues.depInfo.returnIn, "depInfo.returnIn")}
                                displayValue={formatToDDHHmm(formValues.depInfo.returnIn)}
                                maxLength={6}
                                disabled={isRefMode}
                                disabledSimpleColor={isRefMode}
                                validate={[myValidates.requiredReturnIn, myValidates.rangeMovementDate, myValidates.orderReturnInTo]}
                                onChange={handleOnChange("depInfo.returnIn")}
                                isForceError={getIsForceError("depInfo.returnIn")}
                                isShadowOnFocus
                                isShowEditedColor
                              />
                            </LabelContainer>
                          </TimeInputPlusMinusButtons>
                          <HoSpaceS />
                          <div>
                            {!isRefMode && (
                              <TimeInputPanel
                                dateTimeValue={formValues.depInfo.returnIn}
                                timeDiff={movementInfo.depInfo.lstDepApoTimeDiffUtc}
                                onClick={changeValue("depInfo.returnIn")}
                                height="40px"
                              />
                            )}
                          </div>
                        </GroupBoxRow>
                      </GroupBox>
                    )}
                  </>
                ) : currentTabName === tabNames.arrMvt && initialValues.arrInfo ? (
                  <>
                    <GroupBox>
                      <GroupBoxRow marginTop="0">
                        <HoSpacePlusMinusButton />
                        <LabelContainer>
                          <label>FIS Status</label>
                          <RowColumnItem width="70px">{initialValues.fisFltSts}</RowColumnItem>
                        </LabelContainer>
                        <div>
                          <RowColumnItem>
                            <ArrowRightIcon />
                          </RowColumnItem>
                        </div>
                        <Field
                          name="fisFltSts"
                          width={74}
                          height={40}
                          component={SelectBox}
                          options={fisOptions}
                          disabled={isRefMode}
                          hasBlank
                          disabledSimpleColor={isRefMode}
                          maxMenuHeight={350}
                          onChange={handleOnChange("fisFltSts")}
                          isForceError={getIsForceError("fisFltSts")}
                          isShadowOnFocus
                          isShowEditedColor
                          autoFocus
                        />
                      </GroupBoxRow>
                    </GroupBox>
                    <GroupBox>
                      <GroupBoxRow marginTop="0">
                        <HoSpacePlusMinusButton />
                        <LabelContainer>
                          <label>STA</label>
                          <RowColumnItem width={ddhhmmWidth}>
                            {movementInfo.irrSts !== "ATB" && movementInfo.irrSts !== "DIV"
                              ? formatToDDHHmm(initialValues.arrInfo.sta)
                              : ""}
                          </RowColumnItem>
                        </LabelContainer>
                      </GroupBoxRow>
                      <GroupBoxRow marginTop="4px">
                        <TimeInputPlusMinusButtons
                          dateTimeValue={formValues.arrInfo.eta}
                          disabled={isRefMode || movementInfo.irrSts === "ATB" || movementInfo.irrSts === "DIV"}
                          onClick={changeValue("arrInfo.eta")}
                        >
                          <LabelContainer>
                            <label>ETA</label>
                            <Field
                              name="arrInfo.eta"
                              width={ddhhmmWidth}
                              height={40}
                              type="text"
                              component={TextInput}
                              placeholder="Before DEP"
                              fontSizeOfPlaceholder={14}
                              showKeyboard={handleDateTimeInputPopup(formValues.arrInfo.eta, "arrInfo.eta")}
                              displayValue={formatToDDHHmm(formValues.arrInfo.eta)}
                              maxLength={6}
                              disabled={isRefMode || movementInfo.irrSts === "ATB" || movementInfo.irrSts === "DIV"}
                              disabledSimpleColor={isRefMode}
                              validate={[myValidates.requiredEtaWithoutSta, myValidates.requiredEta, myValidates.rangeMovementDate]}
                              onChange={handleOnChange("arrInfo.eta")}
                              isForceError={getIsForceError("arrInfo.eta")}
                              isShadowOnFocus
                              isShowEditedColor
                            />
                          </LabelContainer>
                        </TimeInputPlusMinusButtons>
                        <HoSpaceS />
                        <div style={{ width: "64px" }}>
                          {!isRefMode && movementInfo.irrSts !== "ATB" && movementInfo.irrSts !== "DIV" && (
                            <PrimaryButton type="button" text="SKD" height="40px" onClick={handleOnClickSkdToEta} />
                          )}
                        </div>
                        <HoSpaceM />
                        <LabelContainer>
                          <label>M/T/U</label>
                          <Field
                            name="arrInfo.etaCd"
                            width={74}
                            height={40}
                            component={SelectBox}
                            options={tentativeOptions}
                            disabled={isRefMode || movementInfo.irrSts === "ATB" || movementInfo.irrSts === "DIV"}
                            disabledSimpleColor={isRefMode}
                            hasBlank
                            onChange={handleOnChange("arrInfo.etaCd")}
                            isForceError={getIsForceError("arrInfo.etaCd")}
                            isShadowOnFocus
                            isShowEditedColor
                          />
                        </LabelContainer>
                      </GroupBoxRow>
                      <GroupBoxRow>
                        <TimeInputPlusMinusButtons
                          dateTimeValue={formValues.arrInfo.etaLd}
                          disabled={isRefMode}
                          onClick={changeValue("arrInfo.etaLd")}
                        >
                          <LabelContainer>
                            <label>ETA(L/D)</label>
                            <Field
                              name="arrInfo.etaLd"
                              width={ddhhmmWidth}
                              height={40}
                              type="text"
                              component={TextInput}
                              placeholder="After DEP"
                              fontSizeOfPlaceholder={14}
                              showKeyboard={handleDateTimeInputPopup(formValues.arrInfo.etaLd, "arrInfo.etaLd")}
                              displayValue={formatToDDHHmm(formValues.arrInfo.etaLd)}
                              maxLength={6}
                              disabled={isRefMode}
                              disabledSimpleColor={isRefMode}
                              validate={[myValidates.requiredEtaLd, myValidates.rangeMovementDate]}
                              onChange={handleOnChange("arrInfo.etaLd")}
                              isForceError={getIsForceError("arrInfo.etaLd")}
                              isShadowOnFocus
                              isShowEditedColor
                            />
                          </LabelContainer>
                        </TimeInputPlusMinusButtons>
                        <HoSpaceC width={84} />
                        <LabelContainer>
                          <label>M/T/U</label>
                          <Field
                            name="arrInfo.etaLdCd"
                            width={74}
                            height={40}
                            component={SelectBox}
                            options={tentativeOptions}
                            disabled={isRefMode}
                            disabledSimpleColor={isRefMode}
                            hasBlank
                            onChange={handleOnChange("arrInfo.etaLdCd")}
                            isForceError={getIsForceError("arrInfo.etaLdCd")}
                            isShadowOnFocus
                            isShowEditedColor
                          />
                        </LabelContainer>
                      </GroupBoxRow>
                      <GroupBoxRow>
                        <TimeInputPlusMinusButtons
                          dateTimeValue={formValues.arrInfo.etaLdTaxing}
                          disabled={isRefMode}
                          onClick={changeValue("arrInfo.etaLdTaxing")}
                        >
                          <LabelContainer>
                            <label style={{ width: ddhhmmWidth }}>ETA(L/D)+Taxing</label>
                            <Field
                              name="arrInfo.etaLdTaxing"
                              width={ddhhmmWidth}
                              height={40}
                              type="text"
                              component={TextInput}
                              placeholder="ddhhmm"
                              fontSizeOfPlaceholder={17}
                              showKeyboard={handleDateTimeInputPopup(formValues.arrInfo.etaLdTaxing, "arrInfo.etaLdTaxing")}
                              displayValue={formatToDDHHmm(formValues.arrInfo.etaLdTaxing)}
                              maxLength={6}
                              disabled={isRefMode}
                              disabledSimpleColor={isRefMode}
                              validate={[myValidates.rangeMovementDate]}
                              onChange={handleOnChange("arrInfo.etaLdTaxing")}
                              isForceError={getIsForceError("arrInfo.etaLdTaxing")}
                              isShadowOnFocus
                              isShowEditedColor
                            />
                          </LabelContainer>
                        </TimeInputPlusMinusButtons>
                      </GroupBoxRow>
                      <GroupBoxRow>
                        <TimeInputPlusMinusButtons
                          dateTimeValue={formValues.arrInfo.ldTime}
                          disabled={isRefMode}
                          onClick={changeValue("arrInfo.ldTime")}
                        >
                          <LabelContainer>
                            <label>L/D</label>
                            <Field
                              name="arrInfo.ldTime"
                              width={ddhhmmWidth}
                              height={40}
                              type="text"
                              component={TextInput}
                              placeholder="ddhhmm"
                              fontSizeOfPlaceholder={17}
                              showKeyboard={handleDateTimeInputPopup(formValues.arrInfo.ldTime, "arrInfo.ldTime")}
                              displayValue={formatToDDHHmm(formValues.arrInfo.ldTime)}
                              maxLength={6}
                              disabled={isRefMode}
                              disabledSimpleColor={isRefMode}
                              validate={[myValidates.requiredLd, myValidates.rangeMovementDate, myValidates.orderLdAta]}
                              onChange={handleOnChange("arrInfo.ldTime")}
                              isForceError={getIsForceError("arrInfo.ldTime")}
                              isShadowOnFocus
                              isShowEditedColor
                            />
                          </LabelContainer>
                        </TimeInputPlusMinusButtons>
                        <HoSpaceS />
                        <div>
                          {!isRefMode && (
                            <TimeInputPanel
                              dateTimeValue={formValues.arrInfo.ldTime}
                              timeDiff={movementInfo.arrInfo.lstArrApoTimeDiffUtc}
                              onClick={changeValue("arrInfo.ldTime")}
                              height="40px"
                            />
                          )}
                        </div>
                      </GroupBoxRow>
                      <GroupBoxRow>
                        <TimeInputPlusMinusButtons
                          dateTimeValue={formValues.arrInfo.ata}
                          disabled={isRefMode}
                          onClick={changeValue("arrInfo.ata")}
                        >
                          <LabelContainer>
                            <label>ATA</label>
                            <Field
                              name="arrInfo.ata"
                              width={ddhhmmWidth}
                              height={40}
                              type="text"
                              component={TextInput}
                              placeholder="ddhhmm"
                              fontSizeOfPlaceholder={17}
                              showKeyboard={handleDateTimeInputPopup(formValues.arrInfo.ata, "arrInfo.ata")}
                              displayValue={formatToDDHHmm(formValues.arrInfo.ata)}
                              maxLength={6}
                              disabled={isRefMode}
                              disabledSimpleColor={isRefMode}
                              validate={[myValidates.rangeMovementDate, myValidates.orderLdAta]}
                              onChange={handleOnChange("arrInfo.ata")}
                              isForceError={getIsForceError("arrInfo.ata")}
                              isShadowOnFocus
                              isShowEditedColor
                            />
                          </LabelContainer>
                        </TimeInputPlusMinusButtons>
                        <HoSpaceS />
                        <div>
                          {!isRefMode && (
                            <TimeInputPanel
                              dateTimeValue={formValues.arrInfo.ata}
                              timeDiff={movementInfo.arrInfo.lstArrApoTimeDiffUtc}
                              onClick={changeValue("arrInfo.ata")}
                              height="40px"
                            />
                          )}
                        </div>
                      </GroupBoxRow>
                    </GroupBox>
                  </>
                ) : isIrregular ? (
                  <IrregularContent
                    initialValues={initialValues}
                    airports={master.airports}
                    movementInfo={movementInfo}
                    formName={formName}
                    formValues={formValues}
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    reset={props.reset}
                    showMessage={showMessage}
                    getIsForceError={getIsForceError}
                    onChange={handleOnChange}
                    handleDateTimeInputPopup={handleDateTimeInputPopup}
                    dispatch={dispatch}
                  />
                ) : currentTabName === tabNames.emergency && (initialValues.arrInfo || initialValues.depInfo) ? (
                  <EmergencyContent>
                    <EmergencyRow>Emergency</EmergencyRow>
                    <FisStatusRow>
                      <GroupBoxRow marginTop="0">
                        <LabelContainer>
                          <label>FIS Status</label>
                          <RowColumnItem width="70px">{initialValues.fisFltSts}</RowColumnItem>
                        </LabelContainer>
                        <div>
                          <RowColumnItem>
                            <ArrowRightIcon />
                          </RowColumnItem>
                        </div>
                        <Field
                          name="fisFltSts"
                          width={74}
                          height={40}
                          component={SelectBox}
                          options={fisOptions}
                          disabled={isRefMode}
                          disabledSimpleColor={isRefMode}
                          maxMenuHeight={350}
                          onChange={handleOnChange("fisFltSts")}
                          isForceError={getIsForceError("fisFltSts")}
                          isShadowOnFocus
                          isShowEditedColor
                          autoFocus
                        />
                      </GroupBoxRow>
                    </FisStatusRow>
                    <ChangeToHJRow>Change to H/J</ChangeToHJRow>
                  </EmergencyContent>
                ) : undefined}
              </ScrollContent>
            )}
          </TabContent>
          {isRefMode ? undefined : (
            <SubmitButtonContainer>
              <PrimaryButton type="submit" text="Update" width="100px" disabled={!dirty} />
            </SubmitButtonContainer>
          )}
        </FormContent>
      </>
    );
  };

  const { flightMovementModal } = props;
  const { movementInfo } = flightMovementModal;
  let flightHeader: FlightHeader | undefined;
  if (movementInfo) {
    const { orgDateLcl, alCd, fltNo, casFltNo } = movementInfo.legkey;
    flightHeader = {
      orgDateLcl,
      alCd,
      fltNo,
      casFltNo: casFltNo || "",
      lstDepApoCd: movementInfo.depInfo.lstDepApoCd,
      lstArrApoCd: movementInfo.arrInfo.lstArrApoCd,
      csFlg: movementInfo.csCnt > 0,
    };
  }
  if (storage.isIphone) {
    return (
      <DraggableModal
        isOpen={flightMovementModal.isOpen}
        style={customStylesI}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        key="OalFlightMovement"
        header={flightHeader ? <FlightModalHeader isDetail={false} isUtc={false} flightHeader={flightHeader} /> : undefined}
        onFocus={() => {}}
        onClose={closeModal}
        isFetching={flightMovementModal.isFetching}
      >
        {getContent()}
      </DraggableModal>
    );
  }
  return (
    <Modal isOpen={flightMovementModal.isOpen} onRequestClose={closeModal} style={customStyles}>
      <Header headerHeight={headerHeight}>
        {flightHeader && <FlightModalHeader isDetail={false} isUtc={false} flightHeader={flightHeader} />}
      </Header>
      {getContent()}
    </Modal>
  );
};

const onSubmit: FormSubmitHandler<FormValue, MyProps> = (formValue, dispatch, props) => {
  if (!props.dirty) return;

  const onNotFoundRecord = () => dispatch(closeFlightMovementModal());
  if (formValue.selectedIrrSts) {
    const update = () => {
      if (
        !storage.isIphone &&
        (formValue.selectedIrrSts === "DIV" || formValue.selectedIrrSts === "DIV COR" || formValue.selectedIrrSts === "ATB")
      ) {
        const callbacks = {
          onSuccess: () => {
            if (props.flightMovementModal.movementInfo) {
              const { casFltNo, alCd, fltNo, orgDateLcl } = props.flightMovementModal.movementInfo.legkey;
              const flt = casFltNo || alCd + fltNo;
              const dateFrom = dayjs(orgDateLcl).format("YYYY-MM-DD");
              const casualFlg = !!casFltNo;

              const path = `${Const.PATH_NAME.oalFlightSchedule}?flt=${flt}&dateFrom=${dateFrom}&casualFlg=${casualFlg.toString()}`;
              if (storage.isPc) {
                window.open(`${ServerConfig.BASE_ROUTE}${path}`, "_blank");
              } else {
                dispatch(forceGoTo({ path }));
              }
            }
          },
          onNotFoundRecord,
        };

        dispatch(updateFlightIrregular({ formValue, callbacks }));
      } else {
        dispatch(updateFlightIrregular({ formValue, callbacks: { onNotFoundRecord } }));
      }
    };

    dispatch(showMessage({ message: SoalaMessage.M30010C({ onYesButton: update }) }));
  } else {
    const { initialValues, formValues } = props;
    const update = () => {
      dispatch(updateFlightMovement({ formValue, callbacks: { onNotFoundRecord } }));
    };
    if (formValues && formValues.fisFltSts === "H/J" && initialValues && initialValues.fisFltSts !== "H/J") {
      dispatch(showMessage({ message: SoalaMessage.M30010C({ onYesButton: update }) }));
    } else {
      update();
    }
  }
};

const customStyles: Modal.Styles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 970000000 /* reapop(999999999)の2つ下 */,
  },
  content: {
    position: "relative",
    width: "375px",
    height: "fit-content",
    top: storage.isPc ? "calc((100vh - 698px) / 2)" : "5%",
    left: 0,
    right: 0,
    bottom: 0,
    margin: "auto",
    padding: 0,
    border: "none",
    borderRadius: 0,
  },
};

const customStylesI: Modal.Styles = {
  overlay: {
    background: "transparent",
    pointerEvents: "none",
    zIndex: 960000000 /* reapop(999999999)の3つ下 */,
  },
  content: {
    width: "100%",
    height: "100%",
    left: 0,
    right: 0,
    bottom: 0,
    background: "transparent",
    border: "none",
    pointerEvents: "none",
    padding: 0,
  },
};

const Header = styled.div<{ headerHeight: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  min-height: ${(props) => props.headerHeight}px;
  height: ${(props) => props.headerHeight}px;
`;
const FormContent = styled.form`
  font-size: 18px;
`;
const TabContent = styled.div<{ isIphone: boolean; height?: string; isIrregular?: boolean }>`
  padding: 0 10px;
  height: ${({ height }) => height};
  overflow-y: ${({ isIrregular }) => (isIrregular ? "visible" : "scroll")};
  ::-webkit-scrollbar {
    display: none;
  }
`;
const ScrollContent = styled.div``;
const EmergencyContent = styled.div`
  margin: 1px -9px;
  padding: 0;
  width: 373px;
  height: 403px;
  border: 9px solid #08121a;
  background-color: #e8ff00;
`;
const GroupBox = styled.div<{ pinkColor?: boolean }>`
  margin: 8px 0;
  padding: 12px 4px;
  width: 100%;
  border: 1px solid #222;
  background-color: ${({ pinkColor }) => (pinkColor ? "#E5C7C6" : "#F6F6F6")};
`;
const GroupBoxRow = styled.div<{ marginTop?: string }>`
  display: flex;
  align-items: flex-end;
  margin-top: ${({ marginTop }) => marginTop || "16px"};
`;
const GroupBoxRowInRow = styled.div`
  display: flex;
  align-items: flex-end;
`;
const RowColumnItem = styled.div<{ width?: string | number }>`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: ${({ width }) => width};
`;
const EmergencyRow = styled.div`
  margin-top: 66px;
  font-size: 50px;
  font-weight: bold;
  line-height: 64px;
  height: 64px;
  text-align: center;
`;
const FisStatusRow = styled.div`
  margin-top: 33px;
  display: flex;
  justify-content: center;
  width: 100%;
`;
const ChangeToHJRow = styled.div`
  margin-top: 40px;
  font-size: 40px;
  font-weight: bold;
  line-height: 52px;
  height: 52px;
  text-align: center;
`;
const HoSpaceL = styled.div`
  height: 100%;
  width: 24px;
`;
const HoSpaceM = styled.div`
  height: 100%;
  width: 16px;
`;
const HoSpaceS = styled.div`
  height: 100%;
  width: 4px;
`;
const HoSpaceC = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}px;
`;
const HoSpacePlusMinusButton = styled.div`
  height: 100%;
  width: 40px;
`;
const SubmitButtonContainer = styled.div`
  display: flex;
  width: 100%;
  height: 88px;
  justify-content: center;
  align-items: center;
`;
const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  label {
    font-size: 12px;
    white-space: nowrap;
    overflow: visible;
  }
`;

const ArrowRightIcon = styled.img.attrs({ src: ArrowRightIconSvg })`
  vertical-align: bottom;
  margin: 0 34px 0 8px;
`;

/// ////////////////////////
// コネクト
/// ////////////////////////
const formName = "flightMovement";

const FlightMovementModalWithForm = reduxForm<FormValue, MyProps>({
  form: formName,
  onSubmit, // submitをここで設定しないと、ポップアップ入力画面からRemoteSubmitできない。
  enableReinitialize: true,
})(FlightMovementModal);

export default connect((state: RootState) => ({
  flightMovementModal: state.flightMovementModal,
  jobAuth: state.account.jobAuth,
  master: state.account.master,
  initialValues: state.flightMovementModal.initialFormValue,
  formValues: getFormValues(formName)(state) as MyProps["formValues"],
  formSyncErrors: getFormSyncErrors(formName)(state),
}))(FlightMovementModalWithForm);
