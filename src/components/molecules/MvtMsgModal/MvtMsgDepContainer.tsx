import dayjs from "dayjs";
import { isEqual } from "lodash";
import React, { useEffect, useState, useMemo } from "react";
import { Field, Normalizer } from "redux-form";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { SoalaMessage } from "../../../lib/soalaMessages";
import * as validates from "../../../lib/validators";
import * as myValidates from "../../../lib/validators/mvtMsgValidator";
import { FormValue, FieldName, MvtValue, showMessage } from "../../../reducers/mvtMsgModal";
import RadioButton from "../../atoms/RadioButton";
import TextInput from "../../atoms/TextInput";
import SelectBox, { OptionType } from "../../atoms/SelectBox";
import TimeInputPlusMinusButtons from "../TimeInputPlusMinusButtons";
import TimeInputPanel from "../TimeInputPanel";

// eslint-disable-next-line import/no-cycle
import {
  Content,
  CheckBoxLabel,
  Col,
  ComponentLabel,
  Flex,
  Label,
  MvtMsgFlgIconSvg,
  Row,
  Space,
  LabelItem,
} from "../../organisms/MvtMsgModal";

type Props = {
  movementInfo: MvtMsgApi.Get.Response;
  formValues: FormValue;
  depDisabled?: boolean;
  changeValue: (fieldName: FieldName) => (value: unknown) => void;
  checkHasDiffInForm: (formName: MvtValue) => boolean;
  checkHasDiffInMsgSetting: (formName: MvtValue) => boolean;
  initializeMvtForm: (formName: MvtValue, isCnlCheckBox?: boolean) => void;
  initializeMsgSetting: (formName: MvtValue) => void;
  handleDateTimeInputPopup: (value: string | undefined, fieldName: FieldName) => () => void;
  handleOnChange: (fieldName: FieldName) => () => void;
  getIsForceError: (fieldName: FieldName) => boolean;
  onChangeRadioButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const MvtMsgDepContainer: React.FC<Props> = (props) => {
  const {
    movementInfo,
    formValues,
    depDisabled,
    changeValue,
    checkHasDiffInForm,
    checkHasDiffInMsgSetting,
    initializeMvtForm,
    initializeMsgSetting,
    handleDateTimeInputPopup,
    handleOnChange,
    getIsForceError,
    onChangeRadioButton,
  } = props;
  const DEP: MvtValue = "DEP";
  const dispatch = useAppDispatch();
  const master = useAppSelector((state) => state.account.master);
  const [isCancel, setIsCancel] = useState(false);
  const [isDlyDisabled, setIsDlyDisabled] = useState(false);

  /** バリデーション要否判定の為、入力項目の活性状態を管理する */
  const isInputActive = useMemo(
    () => !(formValues.depInfo.cnlCheckBox || !isEqual(formValues.mvtMsgRadioButton, DEP)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formValues.mvtMsgRadioButton, formValues.depInfo.cnlCheckBox]
  );

  /** 実績値によって遅延情報の入力項目の非活性状態を制御する */
  useEffect(() => {
    const { std, atd } = formValues.depInfo;
    if (!std) {
      setIsDlyDisabled(false);
    } else {
      setIsDlyDisabled(!atd || std >= atd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.depInfo.std, formValues.depInfo.atd]);

  /** 遅延情報欄が実績値により非活性化する場合、遅延情報を全て空欄にする */
  useEffect(() => {
    if (!depDisabled && !isCancel && isDlyDisabled) {
      changeValue("depInfo.depDlyTime1")("");
      changeValue("depInfo.depDlyTime2")("");
      changeValue("depInfo.depDlyTime3")("");
      changeValue("depInfo.depDlyRsnCd1")("");
      changeValue("depInfo.depDlyRsnCd2")("");
      changeValue("depInfo.depDlyRsnCd3")("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDlyDisabled]);

  /** Cancelチェックボックスを初期化する */
  useEffect(() => {
    if (!depDisabled) {
      setIsCancel(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depDisabled]);

  /** キャンセルチェックボックスの活性状態を取得する */
  const cnlCheckBoxEnabled = () => {
    const { depMvtMsgFlg, actLdUtc, irrSts } = movementInfo;
    return depMvtMsgFlg && !irrSts && !actLdUtc;
  };

  const formatToDDHHmm = (dateTimeValue: string) => {
    if (dateTimeValue && dayjs(dateTimeValue).isValid()) {
      return dayjs(dateTimeValue).format("DDHHmm");
    }
    return "";
  };

  const normalizeTime: Normalizer = (value: string) => {
    const onlyNums = value.replace(/[^\d]/g, "");
    return onlyNums;
  };

  const depDlyRsnOption: OptionType[] = master.dlyRsns
    ? master.dlyRsns
        .filter((d) => d.arrDepCd === "DEP")
        .sort((a, b) => a.dispSeq - b.dispSeq)
        .map((d) => ({ label: d.dlyRsnJalCd, value: d.dlyRsnJalCd }))
    : [];

  /** キャンセルチェックボックス押下時の処理 */
  const onChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      // 自フォーム内もしくは送信設定共通入力欄で変更があるか確認して分岐
      if (checkHasDiffInForm(DEP) || checkHasDiffInMsgSetting(DEP)) {
        void dispatch(
          showMessage({
            message: SoalaMessage.M40012C({
              onYesButton: () => {
                initializeMvtForm(DEP, true);
                initializeMsgSetting(DEP);
                setIsCancel(checked);
              },
              // キャンセルチェックボックスを元に戻す
              onNoButton: () => changeValue("depInfo.cnlCheckBox")(false),
            }),
          })
        );
      } else {
        initializeMvtForm(DEP, true);
        initializeMsgSetting(DEP);
        setIsCancel(checked);
      }
    } else {
      setIsCancel(checked);
    }
  };

  const isDomestic = movementInfo.intDomCat === "D";
  const timeModeMark = isDomestic ? "(L)" : "(Z)";

  return (
    <Content>
      <Row marginBottom={9} padding="0px 8px 0px 0px">
        <Flex>
          <Space width={8} />
          <Col width={24}>
            <Space isDummyLabel width={24} />
            {movementInfo.depMvtMsgFlg && <MvtMsgFlgIconSvg />}
          </Col>
          <Space width={4} />
          <Col width={76}>
            <Space isDummyLabel width={76} />
            <Field
              name="mvtMsgRadioButton"
              id={`${DEP}RadioButton`}
              tabIndex={0}
              type="radio"
              value={DEP}
              component={RadioButton}
              onChange={onChangeRadioButton}
              isShadowOnFocus
            />
            <ComponentLabel htmlFor={`${DEP}RadioButton`}>{DEP}</ComponentLabel>
          </Col>
          <Space width={7} />
          <Col width={59}>
            <Space isDummyLabel width={59} />
            <CheckBoxLabel htmlFor="depInfo.cnlCheckBox" disabled={depDisabled} checkBoxDisabled={depDisabled || !cnlCheckBoxEnabled()}>
              CNL
              <Field
                id="depInfo.cnlCheckBox"
                name="depInfo.cnlCheckBox"
                component="input"
                tabIndex={0}
                type="checkbox"
                disabled={depDisabled || !cnlCheckBoxEnabled()}
                onChange={onChangeCheckBox}
              />
            </CheckBoxLabel>
          </Col>
          <Space width={22} />
          <Col width={64}>
            <Label disabled={depDisabled}>STD{timeModeMark}</Label>
            <LabelItem disabled={depDisabled}>{formatToDDHHmm(formValues.depInfo.std)}</LabelItem>
          </Col>
          <Space width={10} />
          <Flex width={280}>
            <Col width={168}>
              <TimeInputPlusMinusButtons
                showDisabled
                dateTimeValue={formValues.depInfo.atd}
                onClick={changeValue("depInfo.atd")}
                disabled={isCancel || depDisabled}
              >
                <Col width={96}>
                  <Label disabled={depDisabled}>ATD{timeModeMark}</Label>
                  <Field
                    name="depInfo.atd"
                    width={96}
                    height={40}
                    type="text"
                    component={TextInput}
                    placeholder="ddhhmm"
                    fontSizeOfPlaceholder={18}
                    showKeyboard={handleDateTimeInputPopup(formValues.depInfo.atd, "depInfo.atd")}
                    displayValue={formatToDDHHmm(formValues.depInfo.atd)}
                    maxLength={6}
                    validate={isInputActive ? [validates.required, myValidates.rangeMovementDate, myValidates.orderAtdTo] : undefined}
                    onChange={handleOnChange("depInfo.atd")}
                    isForceError={getIsForceError("depInfo.atd")}
                    isShadowOnFocus
                    isShowEditedColor
                    disabled={isCancel || depDisabled}
                  />
                </Col>
              </TimeInputPlusMinusButtons>
            </Col>
            <Col width={100}>
              <Space isDummyLabel width={100} />
              <TimeInputPanel
                dateTimeValue={formValues.depInfo.atd}
                timeDiff={isDomestic ? 900 : 0}
                onClick={changeValue("depInfo.atd")}
                width="100px"
                height="40px"
                disabled={isCancel || depDisabled}
              />
            </Col>
          </Flex>
          <Space width={8} />
          <Flex width={280}>
            <Col width={168}>
              <TimeInputPlusMinusButtons
                showDisabled
                dateTimeValue={formValues.depInfo.actTo}
                onClick={changeValue("depInfo.actTo")}
                disabled={isCancel || depDisabled}
              >
                <Col width={96}>
                  <Label disabled={depDisabled}>T/O{timeModeMark}</Label>
                  <Field
                    name="depInfo.actTo"
                    width={96}
                    height={40}
                    type="text"
                    component={TextInput}
                    placeholder="ddhhmm"
                    fontSizeOfPlaceholder={18}
                    showKeyboard={handleDateTimeInputPopup(formValues.depInfo.actTo, "depInfo.actTo")}
                    displayValue={formatToDDHHmm(formValues.depInfo.actTo)}
                    maxLength={6}
                    validate={
                      isInputActive
                        ? [validates.required, myValidates.rangeMovementDate, myValidates.orderAtdTo, myValidates.orderToLd]
                        : undefined
                    }
                    onChange={handleOnChange("depInfo.actTo")}
                    isForceError={getIsForceError("depInfo.actTo")}
                    isShadowOnFocus
                    isShowEditedColor
                    disabled={isCancel || depDisabled}
                  />
                </Col>
              </TimeInputPlusMinusButtons>
            </Col>
            <Col width={100}>
              <Space isDummyLabel width={100} />
              <TimeInputPanel
                dateTimeValue={formValues.depInfo.actTo}
                timeDiff={isDomestic ? 900 : 0}
                onClick={changeValue("depInfo.actTo")}
                width="100px"
                height="40px"
                disabled={isCancel || depDisabled}
              />
            </Col>
          </Flex>
          <Space width={18} />
          <Col width={84}>
            <Label disabled={depDisabled}>EFT</Label>
            <LabelItem disabled={depDisabled}>{formValues.depInfo.eft}</LabelItem>
          </Col>
        </Flex>
      </Row>
      <Row padding="0px 10px 0px 36px">
        <Flex>
          <Flex width={100}>
            <Col width={42}>
              <Label disabled={depDisabled}>From</Label>
              <LabelItem disabled={depDisabled}>{movementInfo.lstDepApoCd}</LabelItem>
            </Col>
            <Col width={16}>
              <Space isDummyLabel width={16} />
              <Flex width={16} position="center">
                <LabelItem disabled={depDisabled}>-</LabelItem>
              </Flex>
            </Col>
            <Col width={42}>
              <Label disabled={depDisabled}>To</Label>
              <LabelItem disabled={depDisabled}>{movementInfo.lstArrApoCd}</LabelItem>
            </Col>
          </Flex>
          <Space width={64} />
          <Col width={436}>
            <Label disabled={depDisabled}>DEP DLY Time/Reason ---------------------------------------------------------</Label>
            <Flex>
              <Field
                name="depInfo.depDlyTime1"
                width={72}
                height={40}
                type="text"
                component={TextInput}
                placeholder="hhmm"
                maxLength={4}
                pattern="\d*"
                normalize={normalizeTime}
                validate={
                  isInputActive && !isDlyDisabled
                    ? [myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime]
                    : undefined
                }
                onChange={handleOnChange("depInfo.depDlyTime1")}
                isForceError={getIsForceError("depInfo.depDlyTime1")}
                isShadowOnFocus
                isShowEditedColor
                disabled={isCancel || depDisabled || isDlyDisabled}
              />
              <Space width={4} />
              <Field
                name="depInfo.depDlyRsnCd1"
                width={64}
                height={40}
                component={SelectBox}
                options={depDlyRsnOption}
                validate={isInputActive && !isDlyDisabled ? [myValidates.requiredDepDlyRsnCd] : undefined}
                maxMenuHeight={136}
                onChange={handleOnChange("depInfo.depDlyRsnCd1")}
                isForceError={getIsForceError("depInfo.depDlyRsnCd1")}
                hasBlank
                isShadowOnFocus
                isShowEditedColor
                isSearchable
                disabled={isCancel || depDisabled || isDlyDisabled}
              />
              <Space width={8} />
              <Field
                name="depInfo.depDlyTime2"
                width={72}
                height={40}
                type="text"
                component={TextInput}
                placeholder="hhmm"
                maxLength={4}
                pattern="\d*"
                normalize={normalizeTime}
                validate={
                  isInputActive && !isDlyDisabled
                    ? [myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime]
                    : undefined
                }
                onChange={handleOnChange("depInfo.depDlyTime2")}
                isForceError={getIsForceError("depInfo.depDlyTime2")}
                isShadowOnFocus
                isShowEditedColor
                disabled={isCancel || depDisabled || isDlyDisabled}
              />
              <Space width={4} />
              <Field
                name="depInfo.depDlyRsnCd2"
                width={64}
                height={40}
                component={SelectBox}
                options={depDlyRsnOption}
                validate={isInputActive && !isDlyDisabled ? [myValidates.requiredDepDlyRsnCd] : undefined}
                maxMenuHeight={136}
                onChange={handleOnChange("depInfo.depDlyRsnCd2")}
                isForceError={getIsForceError("depInfo.depDlyRsnCd2")}
                hasBlank
                isShadowOnFocus
                isShowEditedColor
                isSearchable
                disabled={isCancel || depDisabled || isDlyDisabled}
              />
              <Space width={8} />
              <Field
                name="depInfo.depDlyTime3"
                width={72}
                height={40}
                type="text"
                component={TextInput}
                placeholder="hhmm"
                maxLength={4}
                pattern="\d*"
                normalize={normalizeTime}
                validate={
                  isInputActive && !isDlyDisabled
                    ? [myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime]
                    : undefined
                }
                onChange={handleOnChange("depInfo.depDlyTime3")}
                isForceError={getIsForceError("depInfo.depDlyTime3")}
                isShadowOnFocus
                isShowEditedColor
                disabled={isCancel || depDisabled || isDlyDisabled}
              />
              <Space width={4} />
              <Field
                name="depInfo.depDlyRsnCd3"
                width={64}
                height={40}
                component={SelectBox}
                options={depDlyRsnOption}
                validate={isInputActive && !isDlyDisabled ? [myValidates.requiredDepDlyRsnCd] : undefined}
                maxMenuHeight={136}
                onChange={handleOnChange("depInfo.depDlyRsnCd3")}
                isForceError={getIsForceError("depInfo.depDlyRsnCd3")}
                hasBlank
                isShadowOnFocus
                isShowEditedColor
                isSearchable
                disabled={isCancel || depDisabled || isDlyDisabled}
              />
            </Flex>
          </Col>
          <Space width={12} />
          <Flex width={306} position="flex-start">
            <Space width={212} />
            <Col width={64}>
              <Label disabled={depDisabled}>TOF</Label>
              <LabelItem disabled={depDisabled}>{movementInfo.takeOffFuel}</LabelItem>
            </Col>
          </Flex>
        </Flex>
      </Row>
    </Content>
  );
};

export default MvtMsgDepContainer;
