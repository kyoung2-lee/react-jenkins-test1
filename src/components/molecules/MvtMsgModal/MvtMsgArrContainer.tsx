import dayjs from "dayjs";
import { isEqual } from "lodash";
import React, { useState, useEffect } from "react";
import { Field, Normalizer } from "redux-form";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { SoalaMessage } from "../../../lib/soalaMessages";
import * as validates from "../../../lib/validators";
import * as myValidates from "../../../lib/validators/mvtMsgValidator";
import {
  ArrDlyInfoKey,
  FormValue,
  FieldName,
  MvtValue,
  getArrDlyInfo,
  reCalcInstruction,
  showMessage,
  setAvgTaxiTime,
  setAvgTaxiVisible,
  setPrevMvtDepApo,
  closeMvtMsgModal,
  fetchMvtMsgReCalcFailure,
} from "../../../reducers/mvtMsgModal";
import PrimaryButton from "../../atoms/PrimaryButton";
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
  mvtMsgModalIsOpen: boolean;
  arrDisabled: boolean;
  avgTaxiVisible: boolean;
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

const MvtMsgArrContainer: React.FC<Props> = (props) => {
  const {
    movementInfo,
    formValues,
    arrDisabled,
    avgTaxiVisible,
    mvtMsgModalIsOpen,
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
  const ARR: MvtValue = "ARR";
  const dispatch = useAppDispatch();
  const master = useAppSelector((state) => state.account.master);
  const [hasAta, setHasAta] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);
  const [calcBtnFlg, setCalcBtnFlg] = useState(false);
  const [isDlyDisabled, setIsDlyDisabled] = useState(false);
  const [avgTaxiInfo, setAvgTaxiInfo] = useState("");
  const [initAvgTaxiInfo, setInitAvgTaxiInfo] = useState("");
  const [initAvgTaxiVisible, setInitAvgTaxiVisible] = useState(false);
  const [initProcessed, setInitProcessed] = useState(false);

  /** 初期表示時の処理 */
  useEffect(() => {
    if (mvtMsgModalIsOpen) {
      const { arrMvtMsgFlg, legCreRsnCd, prevTaxiingTimeMin, prevMvtDepApoCd, orgLstDepApoCd, lstDepApoCd, taxiingTimeMin } = movementInfo;

      // 初期表示時点のavgTaxiVisibleを保持しておく
      setInitAvgTaxiVisible(avgTaxiVisible);

      const hasPrevTaxiInfo = typeof prevTaxiingTimeMin === "number" && !!prevMvtDepApoCd;
      const apoCd = !arrMvtMsgFlg ? (legCreRsnCd === "RCV" ? orgLstDepApoCd : lstDepApoCd) : hasPrevTaxiInfo ? prevMvtDepApoCd : null;
      const time = !arrMvtMsgFlg ? taxiingTimeMin : hasPrevTaxiInfo ? prevTaxiingTimeMin : null;

      if (!arrMvtMsgFlg && hasPrevTaxiInfo) {
        dispatch(setAvgTaxiTime({ taxiingTimeMin: prevTaxiingTimeMin }));
      }
      const timeStr = time?.toString();
      const avgTaxiInfoStr = !!apoCd && !!timeStr ? `${apoCd}/${timeStr}` : "";

      setInitAvgTaxiInfo(avgTaxiInfoStr); // ラジオボタン変更時の初期化の条件に使用する為の値を保持する
      setAvgTaxiInfo(avgTaxiInfoStr); // 表示する値を保持する
      setInitProcessed(true);
    } else {
      setInitProcessed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mvtMsgModalIsOpen]);

  /** AVG TAXI欄に表示する値をセットする */
  useEffect(() => {
    if (calcBtnFlg && !arrDisabled) {
      // ARR DLY再計算ボタン押下時の処理
      const { lstDepApoCd, taxiingTimeMin, legCreRsnCd, orgLstDepApoCd } = movementInfo;
      if (taxiingTimeMin !== null) {
        const apoCd = legCreRsnCd === "RCV" ? orgLstDepApoCd : lstDepApoCd;
        const time = taxiingTimeMin.toString();
        setAvgTaxiInfo(`${apoCd}/${time}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movementInfo.taxiingTimeMin, movementInfo.prevMvtDepApoCd]);

  /** formValues以外の状態を初期化する */
  useEffect(() => {
    if (!arrDisabled) {
      setIsCancel(false);
      setCalcBtnFlg(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrDisabled]);

  /** AVG TAXI情報を初期化する */
  useEffect(() => {
    if (initProcessed && arrDisabled) {
      setAvgTaxiInfo(initAvgTaxiInfo);
      const taxiingTimeMin = parseInt(initAvgTaxiInfo.slice(initAvgTaxiInfo.indexOf("/") + 1), 10);
      const prevMvtDepApoCd = initAvgTaxiInfo.split("/")[0];
      dispatch(setAvgTaxiTime({ taxiingTimeMin }));
      dispatch(setPrevMvtDepApo({ prevMvtDepApoCd }));
      dispatch(setAvgTaxiVisible({ avgTaxiVisible: initAvgTaxiVisible }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrDisabled]);

  /** ARR DLY 再計算ボタンの活性状態判定の為、ATAの有無を管理する */
  useEffect(() => {
    if (formValues.arrInfo.ata) {
      setHasAta(true);
    } else {
      setHasAta(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.arrInfo.ata]);

  /** バリデーション要否判定の為、入力項目の活性状態を管理する */
  useEffect(() => {
    setIsInputActive(!(formValues.arrInfo.cnlCheckBox || !isEqual(formValues.mvtMsgRadioButton, ARR)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.mvtMsgRadioButton, formValues.arrInfo.cnlCheckBox]);

  /** 実績値によって遅延情報の入力項目の非活性状態を制御する */
  useEffect(() => {
    const { sta, ata } = formValues.arrInfo;
    if (!sta) {
      setIsDlyDisabled(false);
    } else {
      setIsDlyDisabled(!ata || sta >= ata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.arrInfo.sta, formValues.arrInfo.ata]);

  /** 遅延情報欄が実績値により非活性化する場合、遅延情報を全て空欄にする */
  useEffect(() => {
    if (!arrDisabled && !isCancel && isDlyDisabled) {
      initArrDlyInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDlyDisabled]);

  /** ARR DLYマニュアル変更処理 */
  const handleOnChangeArrDly = (fieldName: FieldName) => () => {
    dispatch(setAvgTaxiVisible({ avgTaxiVisible: false }));
    handleOnChange(fieldName)();
  };

  /** 到着遅延情報欄を初期化する */
  const initArrDlyInfo = () => {
    changeValue("arrInfo.arrDlyTime1")("");
    changeValue("arrInfo.arrDlyTime2")("");
    changeValue("arrInfo.arrDlyTime3")("");
    changeValue("arrInfo.arrDlyRsnCd1")("");
    changeValue("arrInfo.arrDlyRsnCd2")("");
    changeValue("arrInfo.arrDlyRsnCd3")("");
    dispatch(setAvgTaxiVisible({ avgTaxiVisible: false }));
  };

  /** キャンセルチェックボックス押下時の処理 */
  const onChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      // 自フォーム内もしくは送信設定共通入力欄で変更があるか確認して分岐
      if (checkHasDiffInForm(ARR) || checkHasDiffInMsgSetting(ARR)) {
        void dispatch(
          showMessage({
            message: SoalaMessage.M40012C({
              onYesButton: () => {
                initializeMvtForm(ARR, true);
                initializeMsgSetting(ARR);
                setIsCancel(checked);
              },
              // キャンセルチェックボックスを元に戻す
              onNoButton: () => changeValue("arrInfo.cnlCheckBox")(false),
            }),
          })
        );
      } else {
        initializeMvtForm(ARR, true);
        initializeMsgSetting(ARR);
        setIsCancel(checked);
      }
    } else {
      setIsCancel(checked);
    }
  };

  /** ARR DLY 再計算ボタン押下処理 */
  const handleOnClickCalclate = async () => {
    setCalcBtnFlg(true);
    const { legKey } = movementInfo;
    const callbacks = {
      onNotFoundRecord: () => dispatch(closeMvtMsgModal()),
      onNetworkError: () => dispatch(fetchMvtMsgReCalcFailure()),
    };
    const latestTaxiingTime = await dispatch(reCalcInstruction({ legKey, callbacks })).unwrap();
    try {
      if (typeof latestTaxiingTime === "number") {
        const arrDlyInfo = getArrDlyInfo(formValues, movementInfo, latestTaxiingTime);
        if (arrDlyInfo) {
          (Object.keys(arrDlyInfo) as ArrDlyInfoKey[]).forEach((key) => changeValue(`arrInfo.${key}`)(arrDlyInfo[key]));
          dispatch(setAvgTaxiVisible({ avgTaxiVisible: true }));
        } else {
          initArrDlyInfo();
        }
      } else {
        void dispatch(
          showMessage({
            message: SoalaMessage.M40022C({}),
          })
        );
      }
    } catch (err) {
      // 何もしない
    }
  };

  /** ラジオボタンの活性状態を取得する */
  const radioButtonEnabled = () => {
    const { depMvtMsgFlg, arrMvtMsgFlg } = movementInfo;
    return (depMvtMsgFlg && !arrMvtMsgFlg) || arrMvtMsgFlg;
  };

  /** 非編集項目からARR DLY再計算ボタンの非活性状態を取得する */
  const getArrDlyCalcBtnDisabledFromNonEditable = () => {
    const { depMvtMsgFlg, irrSts, staUtc, stdUtc, legCreRsnCd, orgStdUtc } = movementInfo;
    const irrCondition = irrSts === "ATB" || irrSts === "DIV";
    const staCondition = !dayjs(staUtc).isValid();
    const rcvFltLegCondition = !(dayjs(stdUtc).isValid() || (legCreRsnCd === "RCV" && dayjs(orgStdUtc).isValid()));
    return !depMvtMsgFlg || irrCondition || staCondition || rcvFltLegCondition;
  };

  const formatToDDHHmm = (dateTimeValue: string) => {
    if (dateTimeValue && dayjs(dateTimeValue).isValid()) {
      return dayjs(dateTimeValue).format("DDHHmm");
    }
    return "";
  };

  const normalizeFuel: Normalizer = (value: string) => {
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!onlyNums) return "";
    const newValue = Number(onlyNums);
    return String(newValue);
  };

  const normalizeWindFactor: Normalizer = (value: string) => {
    const onlyUpperCaseLettersAndNums = value.toUpperCase().replace(/[^PM0-9]/g, "");
    if (!onlyUpperCaseLettersAndNums) return "";
    return onlyUpperCaseLettersAndNums;
  };

  const normalizeTime: Normalizer = (value: string) => {
    const onlyNums = value.replace(/[^\d]/g, "");
    return onlyNums;
  };

  const arrDlyRsnOption: OptionType[] = master.dlyRsns
    ? master.dlyRsns
        .filter((d) => d.arrDepCd === "ARR")
        .sort((a, b) => a.dispSeq - b.dispSeq)
        .map((d) => ({ label: d.dlyRsnJalCd, value: d.dlyRsnJalCd }))
    : [];

  const isDomestic = movementInfo.intDomCat === "D";
  const timeModeMark = isDomestic ? "(L)" : "(Z)";

  return (
    <Content>
      <Row marginBottom={9} padding="0px 8px 0px 0px">
        <Flex>
          <Space width={8} />
          <Col width={24}>
            <Space isDummyLabel width={24} />
            {movementInfo.arrMvtMsgFlg && <MvtMsgFlgIconSvg />}
          </Col>
          <Space width={4} />
          <Col width={76}>
            <Space isDummyLabel width={76} />
            <Field
              name="mvtMsgRadioButton"
              id={`${ARR}RadioButton`}
              tabIndex={0}
              type="radio"
              value={ARR}
              isShadowOnFocus
              component={RadioButton}
              onChange={onChangeRadioButton}
              disabled={!radioButtonEnabled()}
            />
            <ComponentLabel htmlFor={`${ARR}RadioButton`} disabled={!radioButtonEnabled()}>
              {ARR}
            </ComponentLabel>
          </Col>
          <Space width={7} />
          <Col width={59}>
            <Space isDummyLabel width={59} />
            <CheckBoxLabel
              htmlFor="arrInfo.cnlCheckBox"
              disabled={arrDisabled}
              checkBoxDisabled={!movementInfo.arrMvtMsgFlg || arrDisabled}
            >
              CNL
              <Field
                id="arrInfo.cnlCheckBox"
                name="arrInfo.cnlCheckBox"
                component="input"
                tabIndex={0}
                type="checkbox"
                disabled={!movementInfo.arrMvtMsgFlg || arrDisabled}
                onChange={onChangeCheckBox}
              />
            </CheckBoxLabel>
          </Col>
          <Space width={22} />
          <Col width={64}>
            <Label disabled={arrDisabled}>STA{timeModeMark}</Label>
            <LabelItem disabled={arrDisabled}>{formatToDDHHmm(formValues.arrInfo.sta)}</LabelItem>
          </Col>
          <Space width={10} />
          <Flex width={280}>
            <Col width={168}>
              <TimeInputPlusMinusButtons
                showDisabled
                dateTimeValue={formValues.arrInfo.actLd}
                onClick={changeValue("arrInfo.actLd")}
                disabled={isCancel || arrDisabled}
              >
                <Col width={96}>
                  <Label disabled={arrDisabled}>L/D{timeModeMark}</Label>
                  <Field
                    name="arrInfo.actLd"
                    width={96}
                    height={40}
                    type="text"
                    component={TextInput}
                    placeholder="ddhhmm"
                    fontSizeOfPlaceholder={18}
                    showKeyboard={handleDateTimeInputPopup(formValues.arrInfo.actLd, "arrInfo.actLd")}
                    displayValue={formatToDDHHmm(formValues.arrInfo.actLd)}
                    maxLength={6}
                    validate={
                      isInputActive
                        ? [validates.required, myValidates.orderToLd, myValidates.orderLdAta, myValidates.rangeMovementDate]
                        : undefined
                    }
                    onChange={handleOnChange("arrInfo.actLd")}
                    isForceError={getIsForceError("arrInfo.actLd")}
                    isShadowOnFocus
                    isShowEditedColor
                    disabled={isCancel || arrDisabled}
                  />
                </Col>
              </TimeInputPlusMinusButtons>
            </Col>
            <Col width={100}>
              <Space isDummyLabel width={100} />
              <TimeInputPanel
                dateTimeValue={formValues.arrInfo.actLd}
                timeDiff={isDomestic ? 900 : 0}
                onClick={changeValue("arrInfo.actLd")}
                width="100px"
                height="40px"
                disabled={isCancel || arrDisabled}
              />
            </Col>
          </Flex>
          <Space width={8} />
          <Flex width={280}>
            <Col width={168}>
              <TimeInputPlusMinusButtons
                showDisabled
                dateTimeValue={formValues.arrInfo.ata}
                onClick={changeValue("arrInfo.ata")}
                disabled={isCancel || arrDisabled}
              >
                <Col width={96}>
                  <Label disabled={arrDisabled}>ATA{timeModeMark}</Label>
                  <Field
                    name="arrInfo.ata"
                    width={96}
                    height={40}
                    type="text"
                    component={TextInput}
                    placeholder="ddhhmm"
                    fontSizeOfPlaceholder={18}
                    showKeyboard={handleDateTimeInputPopup(formValues.arrInfo.ata, "arrInfo.ata")}
                    displayValue={formatToDDHHmm(formValues.arrInfo.ata)}
                    maxLength={6}
                    validate={isInputActive ? [validates.required, myValidates.orderLdAta, myValidates.rangeMovementDate] : undefined}
                    isForceError={getIsForceError("arrInfo.ata")}
                    isShadowOnFocus
                    isShowEditedColor
                    disabled={isCancel || arrDisabled}
                  />
                </Col>
              </TimeInputPlusMinusButtons>
            </Col>
            <Col width={100}>
              <Space isDummyLabel width={100} />
              <TimeInputPanel
                dateTimeValue={formValues.arrInfo.ata}
                timeDiff={isDomestic ? 900 : 0}
                onClick={changeValue("arrInfo.ata")}
                width="100px"
                height="40px"
                disabled={isCancel || arrDisabled}
              />
            </Col>
          </Flex>
          <Space width={18} />
          <Col width={84}>
            <Label disabled={arrDisabled}>RF</Label>
            <Field
              name="arrInfo.fuelRemain"
              width={84}
              height={40}
              pattern="\d*"
              component={TextInput}
              normalize={normalizeFuel}
              maxLength={6}
              validate={isInputActive ? [myValidates.isFuelRemain] : undefined}
              onChange={handleOnChange("arrInfo.fuelRemain")}
              isForceError={getIsForceError("arrInfo.fuelRemain")}
              isShadowOnFocus
              isShowEditedColor
              disabled={isCancel || arrDisabled}
            />
          </Col>
        </Flex>
      </Row>
      <Row padding="0px 10px 0px 36px">
        <Flex>
          <Flex width={100}>
            <Col width={42}>
              <Label disabled={arrDisabled}>From</Label>
              <LabelItem disabled={arrDisabled}>{movementInfo.lstDepApoCd}</LabelItem>
            </Col>
            <Col width={16}>
              <Space isDummyLabel width={16} />
              <Flex width={16} position="center">
                <LabelItem disabled={arrDisabled}>-</LabelItem>
              </Flex>
            </Col>
            <Col width={42}>
              <Label disabled={arrDisabled}>To</Label>
              <LabelItem disabled={arrDisabled}>{movementInfo.lstArrApoCd}</LabelItem>
            </Col>
          </Flex>
          <Space width={64} />
          <Col width={436}>
            <Label disabled={arrDisabled}>ARR DLY Time/Reason ---------------------------------------------------------</Label>
            <Flex>
              <Field
                name="arrInfo.arrDlyTime1"
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
                    ? [myValidates.requiredArrDlyTime, validates.dlyTime, myValidates.matchArrDlyTime]
                    : undefined
                }
                onChange={handleOnChangeArrDly("arrInfo.arrDlyTime1")}
                isForceError={getIsForceError("arrInfo.arrDlyTime1")}
                isShadowOnFocus
                isShowEditedColor
                disabled={isCancel || arrDisabled || isDlyDisabled}
              />
              <Space width={4} />
              <Field
                name="arrInfo.arrDlyRsnCd1"
                width={64}
                height={40}
                component={SelectBox}
                options={arrDlyRsnOption}
                validate={isInputActive && !isDlyDisabled ? [myValidates.requiredArrDlyRsnCd] : undefined}
                maxMenuHeight={136}
                onChange={handleOnChangeArrDly("arrInfo.arrDlyRsnCd1")}
                isForceError={getIsForceError("arrInfo.arrDlyRsnCd1")}
                hasBlank
                isShadowOnFocus
                isShowEditedColor
                isSearchable
                disabled={isCancel || arrDisabled || isDlyDisabled}
              />
              <Space width={8} />
              <Field
                name="arrInfo.arrDlyTime2"
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
                    ? [myValidates.requiredArrDlyTime, validates.dlyTime, myValidates.matchArrDlyTime]
                    : undefined
                }
                onChange={handleOnChangeArrDly("arrInfo.arrDlyTime2")}
                isForceError={getIsForceError("arrInfo.arrDlyTime2")}
                isShadowOnFocus
                isShowEditedColor
                disabled={isCancel || arrDisabled || isDlyDisabled}
              />
              <Space width={4} />
              <Field
                name="arrInfo.arrDlyRsnCd2"
                width={64}
                height={40}
                component={SelectBox}
                options={arrDlyRsnOption}
                validate={isInputActive && !isDlyDisabled ? [myValidates.requiredArrDlyRsnCd] : undefined}
                maxMenuHeight={136}
                onChange={handleOnChangeArrDly("arrInfo.arrDlyRsnCd2")}
                isForceError={getIsForceError("arrInfo.arrDlyRsnCd2")}
                hasBlank
                isShadowOnFocus
                isShowEditedColor
                isSearchable
                disabled={isCancel || arrDisabled || isDlyDisabled}
              />
              <Space width={8} />
              <Field
                name="arrInfo.arrDlyTime3"
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
                    ? [myValidates.requiredArrDlyTime, validates.dlyTime, myValidates.matchArrDlyTime]
                    : undefined
                }
                onChange={handleOnChangeArrDly("arrInfo.arrDlyTime3")}
                isForceError={getIsForceError("arrInfo.arrDlyTime3")}
                isShadowOnFocus
                isShowEditedColor
                disabled={isCancel || arrDisabled || isDlyDisabled}
              />
              <Space width={4} />
              <Field
                name="arrInfo.arrDlyRsnCd3"
                width={64}
                height={40}
                component={SelectBox}
                options={arrDlyRsnOption}
                validate={isInputActive && !isDlyDisabled ? [myValidates.requiredArrDlyRsnCd] : undefined}
                maxMenuHeight={136}
                onChange={handleOnChangeArrDly("arrInfo.arrDlyRsnCd3")}
                isForceError={getIsForceError("arrInfo.arrDlyRsnCd3")}
                hasBlank
                isShadowOnFocus
                isShowEditedColor
                isSearchable
                disabled={isCancel || arrDisabled || isDlyDisabled}
              />
            </Flex>
          </Col>
          <Space width={12} />
          <Flex width={306} position="flex-start">
            <Col width={80}>
              <Label disabled={arrDisabled}>AVG TAXI</Label>
              {avgTaxiVisible ? <LabelItem disabled={arrDisabled}>{avgTaxiInfo}</LabelItem> : <LabelItem />}
            </Col>
            <Space width={14} />
            <Col width={112}>
              <Space isDummyLabel width={112} />
              <PrimaryButton
                type="button"
                text="Calculate"
                width="112px"
                height="40px"
                onClick={() => {
                  void handleOnClickCalclate();
                }}
                disabled={getArrDlyCalcBtnDisabledFromNonEditable() || !hasAta || isCancel || arrDisabled || isDlyDisabled}
              />
            </Col>
            <Space width={18} />
            <Col width={70}>
              <Label disabled={arrDisabled}>WF</Label>
              <Field
                name="arrInfo.windFactor"
                width={70}
                height={40}
                pattern="[A-Za-z0-9]*"
                component={TextInput}
                normalize={normalizeWindFactor}
                maxLength={4}
                validate={isInputActive ? [myValidates.isWindFactor] : undefined}
                onChange={handleOnChange("arrInfo.windFactor")}
                isForceError={getIsForceError("arrInfo.windFactor")}
                isShadowOnFocus
                isShowEditedColor
                disabled={isCancel || arrDisabled}
              />
            </Col>
          </Flex>
        </Flex>
      </Row>
    </Content>
  );
};

export default MvtMsgArrContainer;
