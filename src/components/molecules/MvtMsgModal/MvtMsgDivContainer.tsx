import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { Field } from "redux-form";
import { isEqual } from "lodash";
import { useAppSelector, useAppDispatch, usePrevious } from "../../../store/hooks";
import { SoalaMessage } from "../../../lib/soalaMessages";
import * as validates from "../../../lib/validators";
import * as myValidates from "../../../lib/validators/mvtMsgValidator";
import { FormValue, FieldName, MvtValue, showMessage } from "../../../reducers/mvtMsgModal";
import RadioButton from "../../atoms/RadioButton";
import TextInput from "../../atoms/TextInput";
import SuggestSelectBox from "../../atoms/SuggestSelectBox";
// eslint-disable-next-line import/no-cycle
import {
  CheckBoxLabel,
  Col,
  ComponentLabel,
  Flex,
  IrregularContent,
  Label,
  MvtMsgFlgIconSvg,
  Row,
  Space,
  LabelItem,
} from "../../organisms/MvtMsgModal";

type Props = {
  movementInfo: MvtMsgApi.Get.Response;
  formValues: FormValue;
  initialValues: Partial<FormValue>;
  divDisabled: boolean;
  checkHasDiffInForm: (formName: MvtValue) => boolean;
  initializeMvtForm: (formName: MvtValue, isCnlCheckBox?: boolean) => void;
  changeValue: (fieldName: FieldName) => (value: unknown) => void;
  handleDateTimeInputPopup: (value: string | undefined, fieldName: FieldName) => () => void;
  handleOnChange: (fieldName: FieldName) => () => void;
  getIsForceError: (fieldName: FieldName) => boolean;
  onChangeRadioButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const MvtMsgDivContainer: React.FC<Props> = (props) => {
  const {
    movementInfo,
    formValues,
    initialValues,
    divDisabled,
    checkHasDiffInForm,
    initializeMvtForm,
    changeValue,
    handleDateTimeInputPopup,
    handleOnChange,
    getIsForceError,
    onChangeRadioButton,
  } = props;
  const dispatch = useAppDispatch();
  const { airports } = useAppSelector((state) => state.account.master);
  const prevDivApoCd = usePrevious(formValues.divInfo.lstArrApoCd);
  const [isCancel, setIsCancel] = useState(false);
  const [etaDisabled, setEtaDisabled] = useState(true);
  const [isInputActive, setIsInputActive] = useState(false);
  const DIV: MvtValue = "DIV";

  /** Cancelチェックボックスを初期化する */
  useEffect(() => {
    if (!divDisabled) {
      setIsCancel(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divDisabled]);

  /** ETAの活性状態を制御する */
  useEffect(() => {
    if (!isEqual(formValues.divInfo.lstArrApoCd, initialValues.divInfo?.lstArrApoCd)) {
      // DIV先空港が初期値から変更されている場合、ETAを活性化
      setEtaDisabled(false);
    } else if (!isEqual(formValues.divInfo.divEta, initialValues.divInfo?.divEta)) {
      // DIV先空港が初期値と同じかつETAが変更されている場合、編集内容破棄の確認
      void dispatch(
        showMessage({
          message: SoalaMessage.M40012C({
            onYesButton: () => {
              changeValue("divInfo.divEta")(initialValues.divInfo?.divEta);
              setEtaDisabled(true);
            },
            // DIV先空港を元に戻す
            onNoButton: () => changeValue("divInfo.lstArrApoCd")(prevDivApoCd),
          }),
        })
      );
    } else {
      setEtaDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.divInfo.lstArrApoCd]);

  /** バリデーション要否判定の為、入力項目の活性状態を管理する */
  useEffect(() => {
    setIsInputActive(!(formValues.divInfo.cnlCheckBox || !isEqual(formValues.mvtMsgRadioButton, DIV)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.mvtMsgRadioButton, formValues.divInfo.cnlCheckBox]);

  /** キャンセルチェックボックス押下時の処理 */
  const onChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      // 自フォーム内で変更があるか確認して分岐
      if (checkHasDiffInForm(DIV)) {
        void dispatch(
          showMessage({
            message: SoalaMessage.M40012C({
              onYesButton: () => {
                initializeMvtForm(DIV, true);
                setIsCancel(checked);
              },
              // キャンセルチェックボックスを元に戻す
              onNoButton: () => changeValue("divInfo.cnlCheckBox")(false),
            }),
          })
        );
      } else {
        initializeMvtForm(DIV, true);
        setIsCancel(checked);
      }
    } else {
      setIsCancel(checked);
    }
  };

  /** ラジオボタンの活性状態を取得する */
  const radioButtonEnabled = () => isFlight() || isDiv();

  /** キャンセルチェックボックスの非活性状態を取得する */
  const cnlCheckBoxDisabled = () => {
    const { actLdUtc } = movementInfo;
    return DIV !== movementInfo.irrSts || !!actLdUtc || divDisabled;
  };

  /** 飛行中かどうかを判定する */
  const isFlight = () => {
    const { actLdUtc, actToUtc, irrSts } = movementInfo;
    return !actLdUtc && !!actToUtc && !irrSts;
  };

  /** DIV中かどうかを判定する */
  const isDiv = () => {
    const { actLdUtc, irrSts } = movementInfo;
    return !actLdUtc && irrSts === "DIV";
  };

  /** 文字列のdatetimeをDDHHmm形式に変換する */
  const formatToDDHHmm = (dateTimeValue: string) => {
    if (dateTimeValue && dayjs(dateTimeValue).isValid()) {
      return dayjs(dateTimeValue).format("DDHHmm");
    }
    return "";
  };

  const isDomestic = movementInfo.intDomCat === "D";
  const timeModeMark = isDomestic ? "(L)" : "(Z)";

  return (
    <IrregularContent width={318}>
      <Row width={178} marginBottom={8}>
        <Flex>
          <Space width={8} />
          <Col width={24}>{DIV === movementInfo.irrSts && <MvtMsgFlgIconSvg />}</Col>
          <Space width={4} />
          <Col width={76}>
            <Field
              name="mvtMsgRadioButton"
              id={`${DIV}RadioButton`}
              tabIndex={0}
              type="radio"
              value={DIV}
              component={RadioButton}
              isShadowOnFocus
              onChange={onChangeRadioButton}
              disabled={!radioButtonEnabled()}
            />
            <ComponentLabel htmlFor={`${DIV}RadioButton`} disabled={!radioButtonEnabled()}>
              {DIV}
            </ComponentLabel>
          </Col>
          <Space width={7} />
          <Col width={59}>
            <CheckBoxLabel htmlFor="divInfo.cnlCheckBox" disabled={divDisabled} checkBoxDisabled={cnlCheckBoxDisabled()}>
              CNL
              <Field
                id="divInfo.cnlCheckBox"
                name="divInfo.cnlCheckBox"
                component="input"
                tabIndex={0}
                type="checkbox"
                disabled={cnlCheckBoxDisabled()}
                onChange={onChangeCheckBox}
              />
            </CheckBoxLabel>
          </Col>
        </Flex>
      </Row>
      <Row width={288} padding="0px 0px 0px 36px">
        <Flex>
          <Flex width={139}>
            <Col width={42}>
              <Label disabled={divDisabled}>From</Label>
              <LabelItem disabled={divDisabled}>{movementInfo.lstDepApoCd}</LabelItem>
            </Col>
            <Col width={16}>
              <Space isDummyLabel width={16} />
              <Flex width={16} position="center">
                <LabelItem disabled={divDisabled}>-</LabelItem>
              </Flex>
            </Col>
            <Col width={72}>
              <Label disabled={divDisabled}>To</Label>
              <Field
                name="divInfo.lstArrApoCd"
                width={72}
                height={40}
                component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                options={airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                maxMenuHeight={170}
                isShadowOnFocus
                isShowEditedColor
                maxLength={3}
                validate={isInputActive ? [validates.required, validates.halfWidthApoCd, myValidates.divApo] : undefined}
                isForceError={getIsForceError("divInfo.lstArrApoCd")}
                onChange={changeValue("divInfo.lstArrApoCd")}
                disabled={isCancel || divDisabled}
              />
            </Col>
          </Flex>
          <Col width={96}>
            <Label disabled={divDisabled}>ETA(L/D){timeModeMark}</Label>
            <Field
              name="divInfo.divEta"
              width={96}
              height={40}
              type="text"
              component={TextInput}
              placeholder="ddhhmm"
              fontSizeOfPlaceholder={18}
              showKeyboard={handleDateTimeInputPopup(formValues.divInfo.divEta, "divInfo.divEta")}
              displayValue={formatToDDHHmm(formValues.divInfo.divEta)}
              maxLength={6}
              validate={isInputActive ? [validates.required, myValidates.rangeMovementDate] : undefined}
              onChange={handleOnChange("divInfo.divEta")}
              isForceError={getIsForceError("divInfo.divEta")}
              isShadowOnFocus
              isShowEditedColor
              disabled={isCancel || divDisabled || etaDisabled}
            />
          </Col>
        </Flex>
      </Row>
    </IrregularContent>
  );
};

export default MvtMsgDivContainer;
