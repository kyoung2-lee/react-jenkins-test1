import dayjs from "dayjs";
import { isEqual } from "lodash";
import React, { useState, useEffect } from "react";
import { Field } from "redux-form";
import { useAppDispatch } from "../../../store/hooks";
import { SoalaMessage } from "../../../lib/soalaMessages";
import * as validates from "../../../lib/validators";
import * as myValidates from "../../../lib/validators/mvtMsgValidator";
import { FormValue, FieldName, MvtValue, showMessage } from "../../../reducers/mvtMsgModal";
import RadioButton from "../../atoms/RadioButton";
import TextInput from "../../atoms/TextInput";
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
  atbDisabled: boolean;
  changeValue: (fieldName: FieldName) => (value: unknown) => void;
  checkHasDiffInForm: (formName: MvtValue) => boolean;
  initializeMvtForm: (formName: MvtValue, isCnlCheckBox?: boolean) => void;
  handleDateTimeInputPopup: (value: string | undefined, fieldName: FieldName) => () => void;
  handleOnChange: (fieldName: FieldName) => () => void;
  getIsForceError: (fieldName: FieldName) => boolean;
  onChangeRadioButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const MvtMsgAtbContainer: React.FC<Props> = (props) => {
  const {
    movementInfo,
    formValues,
    atbDisabled,
    changeValue,
    checkHasDiffInForm,
    initializeMvtForm,
    handleDateTimeInputPopup,
    handleOnChange,
    getIsForceError,
    onChangeRadioButton,
  } = props;
  const dispatch = useAppDispatch();
  const [isCancel, setIsCancel] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);

  const ATB: MvtValue = "ATB";

  /** Cancelチェックボックスを初期化する */
  useEffect(() => {
    if (!atbDisabled) {
      setIsCancel(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atbDisabled]);

  /** バリデーションの為、入力項目の活性状態を管理する */
  useEffect(() => {
    setIsInputActive(!(formValues.atbInfo.cnlCheckBox || !isEqual(formValues.mvtMsgRadioButton, ATB)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.mvtMsgRadioButton, formValues.atbInfo.cnlCheckBox]);

  /** キャンセルチェックボックス押下時の処理 */
  const onChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      // 自フォーム内で変更があるか確認して分岐
      if (checkHasDiffInForm(ATB)) {
        void dispatch(
          showMessage({
            message: SoalaMessage.M40012C({
              onYesButton: () => {
                initializeMvtForm(ATB, true);
                setIsCancel(checked);
              },
              // キャンセルチェックボックスを元に戻す
              onNoButton: () => changeValue("atbInfo.cnlCheckBox")(false),
            }),
          })
        );
      } else {
        initializeMvtForm(ATB, true);
        setIsCancel(checked);
      }
    } else {
      setIsCancel(checked);
    }
  };

  /** ラジオボタンの活性状態を取得する */
  const radioButtonEnabled = () => isFlight() || isAtb();

  /** キャンセルチェックボックスの非活性状態を取得する */
  const cnlCheckBoxDisabled = () => {
    const { actLdUtc } = movementInfo;
    return ATB !== movementInfo.irrSts || !!actLdUtc || atbDisabled;
  };

  /** 飛行中かどうかを判定する */
  const isFlight = () => {
    const { actLdUtc, actToUtc, irrSts } = movementInfo;
    return !actLdUtc && !!actToUtc && !irrSts;
  };

  /** ATB中かどうかを判定する */
  const isAtb = () => {
    const { actLdUtc, irrSts } = movementInfo;
    return !actLdUtc && irrSts === "ATB";
  };

  /** DDHHmm形式に変換する */
  const formatToDDHHmm = (dateTimeValue: string) => {
    if (dateTimeValue && dayjs(dateTimeValue).isValid()) {
      return dayjs(dateTimeValue).format("DDHHmm");
    }
    return "";
  };

  const isDomestic = movementInfo.intDomCat === "D";
  const timeModeMark = isDomestic ? "(L)" : "(Z)";

  return (
    <IrregularContent width={308} marginRight>
      <Row width={178} marginBottom={8}>
        <Flex>
          <Space width={8} />
          <Col width={24}>{ATB === movementInfo.irrSts && <MvtMsgFlgIconSvg />}</Col>
          <Space width={4} />
          <Col width={76}>
            <Field
              name="mvtMsgRadioButton"
              id={`${ATB}RadioButton`}
              tabIndex={0}
              type="radio"
              value={ATB}
              component={RadioButton}
              isShadowOnFocus
              onChange={onChangeRadioButton}
              disabled={!radioButtonEnabled()}
            />
            <ComponentLabel htmlFor={`${ATB}RadioButton`} disabled={!radioButtonEnabled()}>
              {ATB}
            </ComponentLabel>
          </Col>
          <Space width={7} />
          <Col width={59}>
            <CheckBoxLabel htmlFor="atbInfo.cnlCheckBox" disabled={atbDisabled} checkBoxDisabled={cnlCheckBoxDisabled()}>
              CNL
              <Field
                id="atbInfo.cnlCheckBox"
                name="atbInfo.cnlCheckBox"
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
      <Row width={288} padding="0px 20px 0px 36px">
        <Flex>
          <Flex width={100}>
            <Col width={42}>
              <Label disabled={atbDisabled}>From</Label>
              <LabelItem disabled={atbDisabled}>{movementInfo.lstDepApoCd}</LabelItem>
            </Col>
            <Col width={16}>
              <Space isDummyLabel width={16} />
              <Flex width={16} position="center">
                <LabelItem disabled={atbDisabled}>-</LabelItem>
              </Flex>
            </Col>
            <Col width={42}>
              <Label disabled={atbDisabled}>To</Label>
              <LabelItem disabled={atbDisabled}>{movementInfo.lstDepApoCd}</LabelItem>
            </Col>
          </Flex>
          <Col width={96}>
            <Label disabled={atbDisabled || isAtb()}>ETA(L/D){timeModeMark}</Label>
            <Field
              name="atbInfo.atbEta"
              width={96}
              height={40}
              type="text"
              component={TextInput}
              placeholder="ddhhmm"
              fontSizeOfPlaceholder={18}
              showKeyboard={handleDateTimeInputPopup(formValues.atbInfo.atbEta, "atbInfo.atbEta")}
              displayValue={formatToDDHHmm(formValues.atbInfo.atbEta)}
              maxLength={6}
              validate={isInputActive ? [validates.required, myValidates.rangeMovementDate] : undefined}
              onChange={handleOnChange("atbInfo.atbEta")}
              isForceError={getIsForceError("atbInfo.atbEta")}
              isShadowOnFocus
              isShowEditedColor
              disabled={isCancel || atbDisabled || isAtb()}
            />
          </Col>
        </Flex>
      </Row>
    </IrregularContent>
  );
};

export default MvtMsgAtbContainer;
