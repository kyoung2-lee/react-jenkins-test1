import React from "react";
import { Field } from "redux-form";
import { useAppDispatch } from "../../../store/hooks";
import { SoalaMessage } from "../../../lib/soalaMessages";
import { FieldName, MvtValue, showMessage } from "../../../reducers/mvtMsgModal";
import RadioButton from "../../atoms/RadioButton";
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
  gtbDisabled: boolean;
  changeValue: (fieldName: FieldName) => (value: unknown) => void;
  onChangeRadioButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkHasDiffInMsgSetting: (formName: MvtValue) => boolean;
  initializeMsgSetting: (formName: MvtValue) => void;
};

const MvtMsgGtbContainer: React.FC<Props> = (props) => {
  const { movementInfo, gtbDisabled, changeValue, onChangeRadioButton, checkHasDiffInMsgSetting, initializeMsgSetting } = props;
  const GTB: MvtValue = "GTB";
  const dispatch = useAppDispatch();

  /** ラジオボタンの活性状態を取得する */
  const radioButtonEnabled = () => isDepTaxiing() || isGtb();

  /** キャンセルチェックボックスの非活性状態を取得する */
  const cnlCheckBoxDisabled = () => {
    const { actLdUtc } = movementInfo;
    return GTB !== movementInfo.irrSts || !!actLdUtc || gtbDisabled;
  };

  /** 出発空港Taxiing中かどうかを判定する */
  const isDepTaxiing = () => {
    const { actLdUtc, actToUtc, atdUtc, irrSts } = movementInfo;
    return !actLdUtc && !actToUtc && !!atdUtc && !irrSts;
  };

  /** GTB中かどうかを判定する */
  const isGtb = () => {
    const { actLdUtc, irrSts } = movementInfo;
    return !actLdUtc && irrSts === "GTB";
  };

  /** キャンセルチェックボックス押下時の処理 */
  const onChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      // 送信設定共通入力欄で変更があるか確認して分岐
      if (checkHasDiffInMsgSetting(GTB)) {
        void dispatch(
          showMessage({
            message: SoalaMessage.M40012C({
              onYesButton: () => {
                initializeMsgSetting(GTB);
              },
              // キャンセルチェックボックスを元に戻す
              onNoButton: () => changeValue("gtbInfo.cnlCheckBox")(false),
            }),
          })
        );
      } else {
        initializeMsgSetting(GTB);
      }
    }
  };

  return (
    <IrregularContent width={308} marginRight>
      <Row width={178} marginBottom={8}>
        <Flex>
          <Space width={8} />
          <Col width={24}>{GTB === movementInfo.irrSts && <MvtMsgFlgIconSvg />}</Col>
          <Space width={4} />
          <Col width={76}>
            <Field
              name="mvtMsgRadioButton"
              id={`${GTB}RadioButton`}
              tabIndex={0}
              type="radio"
              value={GTB}
              component={RadioButton}
              isShadowOnFocus
              onChange={onChangeRadioButton}
              disabled={!radioButtonEnabled()}
            />
            <ComponentLabel htmlFor={`${GTB}RadioButton`} disabled={!radioButtonEnabled()}>
              {GTB}
            </ComponentLabel>
          </Col>
          <Space width={7} />
          <Col width={59}>
            <CheckBoxLabel htmlFor="gtbInfo.cnlCheckBox" disabled={gtbDisabled} checkBoxDisabled={cnlCheckBoxDisabled()}>
              CNL
              <Field
                id="gtbInfo.cnlCheckBox"
                name="gtbInfo.cnlCheckBox"
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
              <Label disabled={gtbDisabled}>From</Label>
              <LabelItem disabled={gtbDisabled}>{movementInfo.lstDepApoCd}</LabelItem>
            </Col>
            <Col width={16}>
              <Space isDummyLabel width={16} />
              <Flex width={16} position="center">
                <LabelItem disabled={gtbDisabled}>-</LabelItem>
              </Flex>
            </Col>
            <Col width={42}>
              <Label disabled={gtbDisabled}>To</Label>
              <LabelItem disabled={gtbDisabled}>{movementInfo.lstDepApoCd}</LabelItem>
            </Col>
          </Flex>
          <Col width={96} />
        </Flex>
      </Row>
    </IrregularContent>
  );
};

export default MvtMsgGtbContainer;
