import React from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import { Field, formValueSelector, InjectedFormProps, reduxForm, FormState, FormSubmitHandler } from "redux-form";
import styled from "styled-components";

import * as validates from "../../../lib/validators";
import * as myValidates from "../../../lib/validators/fisFilterModalValidator";
import { toUpperCase, formatFlt } from "../../../lib/commonUtil";
import { storage } from "../../../lib/storage";
import { RootState } from "../../../store/storeType";
import { openFlightNumberInputPopup } from "../../../reducers/flightNumberInputPopup";
import { removeAllNotification } from "../../../reducers/common";
import * as fisFilterModalExports from "../../../reducers/fisFilterModal";
import { SearchParams } from "../../../reducers/fisFilterModal";
import { Master } from "../../../reducers/account";
import CheckboxGroup from "../../atoms/CheckboxGroup";
import CheckBoxInput from "../../atoms/CheckBoxInput";
import CheckBoxWithLabel from "../../atoms/CheckBoxWithLabel";
import SelectBox from "../../atoms/SelectBox";
import SuggestSelectBox from "../../atoms/SuggestSelectBox";
import TextInput from "../../atoms/TextInput";
import PrimaryButton from "../../atoms/PrimaryButton";
import SecondaryButton from "../../atoms/SecondaryButton";
import MultipleCreatableInput from "../../atoms/MultipleCreatableInput";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _default, slice, ...fisFilterModalActions } = fisFilterModalExports;

type MyProps = typeof fisFilterModalActions & {
  fisFilterModal: fisFilterModalExports.FisFilterModalState;
  master: Master;
  formValues: SearchParams;
  formSyncErrors: Partial<SearchParams>;
  // eslint-disable-next-line react/no-unused-prop-types
  fisFilterModalForm: FormState; // componentWillReceivePropsでformの変更を検知するために必要
  flightNoValue: string;
  casualFlgValue: boolean;
  openFlightNumberInputPopup: typeof openFlightNumberInputPopup;
  // eslint-disable-next-line react/no-unused-prop-types
  removeAllNotification: typeof removeAllNotification; // 使用されているが警告が出る
};

type Props = MyProps & InjectedFormProps<SearchParams, MyProps>;

class FisFilterModal extends React.Component<Props> {
  componentDidUpdate(nextProps: Props) {
    const { formValues } = nextProps;
    const targetNode = document.getElementById("airLineCodeJALGRP");
    const targetNodeOAL = document.getElementById("airLineCodeOALAll");

    if (targetNode && formValues && formValues.airLineCode) {
      const jalGrpValues = this.jalGrpAirLineCodes().map((al) => formValues.airLineCode.includes(al.alCd));

      if (jalGrpValues.every((a) => a === true)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        targetNode.indeterminate = false;
        this.props.change("airLineCodeJALGRP", true);
      } else if (jalGrpValues.some((a) => a === true)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        targetNode.indeterminate = true;
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        targetNode.indeterminate = false;
        this.props.change("airLineCodeJALGRP", false);
      }
    }

    if (targetNodeOAL && formValues && formValues.airLineCodeOAL) {
      if (formValues.airLineCodeOAL.length) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        targetNodeOAL.indeterminate = true;
        this.props.change("airLineCodeOALAll", false);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        targetNodeOAL.indeterminate = false;
      }
    }
  }

  // JALGRPチェックボックスを押した時の動作
  handleJalGrp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formValues } = this.props;
    const { checked } = e.target;
    const jalGrpCodes = this.jalGrpAirLineCodes().map((al) => al.alCd);
    const currentAirLineCode = formValues && formValues.airLineCode ? formValues.airLineCode : [];

    const changeValue = checked
      ? [...currentAirLineCode, ...jalGrpCodes] // trueの場合: JALGRP全てにチェックを入れる
      : currentAirLineCode.filter((alc) => !jalGrpCodes.includes(alc)); // falseの場合: JALGRP全てのチェックを外す

    this.props.change("airLineCode", changeValue);
  };

  handleOAL = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formValues } = this.props;
    const { checked } = e.target;

    if (checked && formValues.airLineCodeOAL && formValues.airLineCodeOAL.length) {
      this.props.change("airLineCodeOAL", []);
    }
  };

  handleFlightNumberInputPopup = () => {
    this.props.openFlightNumberInputPopup({
      formName: "fisFilterModal",
      fieldName: "flightNo",
      currentFlightNumber: this.props.flightNoValue,
      executeSubmit: true,
      onEnter: this.unfilter,
      canOnlyAlCd: true,
    });
  };

  handleDateTime = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    if (e && e.target && !e.target.value) {
      this.props.change("dateTimeFrom", "");
      this.props.change("dateTimeTo", "");
    }
  };

  reset = () => {
    const targetNode = document.getElementById("airLineCodeJALGRP");
    if (targetNode) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      targetNode.indeterminate = false;
    }
    const targetNodeOAL = document.getElementById("airLineCodeOALAll");
    if (targetNodeOAL) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      targetNodeOAL.indeterminate = false;
    }
    untouchField(this.props);
    this.props.reset();
    this.unfilter();
  };

  unfilter = () => {
    if (this.props.fisFilterModal.isFiltered) {
      this.props.searchFis({
        airLineCode: [],
        airLineCodeJALGRP: false,
        airLineCodeOALAll: false,
        airLineCodeOAL: [],
        flightNo: "",
        airport: "",
        ship: "",
        spot: [],
        dateTimeRadio: "",
        dateTimeFrom: "",
        dateTimeTo: "",
        domOrInt: "",
        skdOrNsk: "",
        casualFlg: false,
        cnlHideFlg: false,
      });
    }
  };

  fltZeroPadding = (e: React.FocusEvent<HTMLInputElement> | undefined) => {
    if (e) {
      this.props.change("flightNo", this.props.casualFlgValue ? toUpperCase(e.target.value) : formatFlt(e.target.value));
    }
  };

  shipToUpperCase = (e: React.FocusEvent<HTMLInputElement> | undefined) => {
    if (e) {
      this.props.change("ship", toUpperCase(e.target.value));
    }
  };

  jalGrpAirLineCodes() {
    return this.props.master.airlines.filter((al) => al.jalGrpFlg);
  }

  render() {
    const { handleSubmit, master, formValues, formSyncErrors, casualFlgValue } = this.props;
    const { modalIsOpen } = this.props.fisFilterModal;

    return (
      <Wrapper>
        <Modal isOpen={modalIsOpen} onRequestClose={() => onCloseFlightSearchModal(this.props)} style={customStyles}>
          <form onSubmit={handleSubmit} onChange={this.unfilter}>
            <AirportRow>
              <div>
                <InputLabel>Airport</InputLabel>
                <AirportContainer>
                  <Field
                    name="airport"
                    component={SuggestSelectBox as "select" & typeof SuggestSelectBox}
                    tabIndex={10}
                    placeholder="APO"
                    maxLength={3}
                    options={master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }))}
                    width={76}
                    validate={[validates.halfWidthApoCd]}
                    autoFocus
                    onSelect={this.unfilter}
                    isShadowOnFocus
                  />
                </AirportContainer>
              </div>
              <div>
                <FlightNoContainer>
                  <div>
                    <InputLabel>Flight</InputLabel>
                    <Field
                      name="flightNo"
                      id="flightNo"
                      component={TextInput}
                      placeholder="FLT"
                      tabIndex={10}
                      width={128}
                      maxLength={10}
                      componentOnBlur={this.fltZeroPadding}
                      validate={casualFlgValue ? [validates.isOkCasualFlt] : [validates.lengthFlt3, validates.halfWidthFlt]}
                      showKeyboard={storage.isPc || this.props.casualFlgValue ? undefined : this.handleFlightNumberInputPopup}
                      isShadowOnFocus
                    />
                  </div>
                  <CasualFlgContainer>
                    <Field
                      name="casualFlg"
                      id="casual-Flg"
                      text="Casual"
                      component={CheckBoxWithLabel}
                      checked={casualFlgValue}
                      tabIndex={10}
                      isShadowOnFocus
                    />
                  </CasualFlgContainer>
                </FlightNoContainer>
              </div>
              <div>
                <InputLabel>SHIP</InputLabel>
                <ShipContainer>
                  <Field
                    name="ship"
                    id="ship"
                    component={TextInput}
                    tabIndex={10}
                    placeholder="SHIP"
                    width={128}
                    maxLength={10}
                    componentOnBlur={this.shipToUpperCase}
                    validate={[validates.lengthShip2, validates.halfWidthShip]}
                    isShadowOnFocus
                  />
                </ShipContainer>
              </div>
              <div>
                <InputLabel>DOM/INT</InputLabel>
                <IntDomCatContainer>
                  <Field
                    name="domOrInt"
                    component={SelectBox as "select" & typeof SelectBox}
                    tabIndex={10}
                    placeholder="D/I"
                    options={[
                      { label: "DOM", value: "D" },
                      { label: "INT", value: "I" },
                    ]}
                    width={76}
                    hasBlank
                    isShadowOnFocus
                  />
                </IntDomCatContainer>
              </div>
              <div>
                <InputLabel>SKD/NSK</InputLabel>
                <SkdNskContainer>
                  <Field
                    name="skdOrNsk"
                    component={SelectBox as "select" & typeof SelectBox}
                    tabIndex={10}
                    placeholder="S/N"
                    options={[
                      { label: "SKD", value: "SKD" },
                      { label: "NSK", value: "NSK" },
                    ]}
                    width={76}
                    hasBlank
                    isShadowOnFocus
                  />
                </SkdNskContainer>
              </div>
              <div>
                <InputLabel>Time Range (DEP or ARR)</InputLabel>
                <DateTimeContainer>
                  <Field
                    name="dateTimeRadio"
                    component={SelectBox as "select" & typeof SelectBox}
                    tabIndex={10}
                    placeholder="D/A"
                    options={[
                      { label: "DEP", value: "DEP" },
                      { label: "ARR", value: "ARR" },
                    ]}
                    onChange={this.handleDateTime}
                    width={76}
                    hasBlank
                    isShadowOnFocus
                  />
                  <Field
                    name="dateTimeFrom"
                    type="number"
                    component={TextInput}
                    tabIndex={10}
                    placeholder="hhmm"
                    width={72}
                    maxLength={4}
                    disabled={formValues && !formValues.dateTimeRadio}
                    validate={[validates.time, myValidates.requiredTime]}
                    isShadowOnFocus
                  />
                  <div className="line">-</div>
                  <Field
                    name="dateTimeTo"
                    type="number"
                    component={TextInput}
                    tabIndex={10}
                    placeholder="hhmm"
                    width={72}
                    maxLength={4}
                    disabled={formValues && !formValues.dateTimeRadio}
                    validate={[validates.time]}
                    isForceError={formSyncErrors && formSyncErrors.dateTimeFrom}
                    isShadowOnFocus
                  />
                </DateTimeContainer>
              </div>
              <div>
                <InputLabel>CNL Flight</InputLabel>
                <CnlHideFlgContainer>
                  <CnlHideFlgLabel htmlFor="cnlHideFlg">
                    <Field name="cnlHideFlg" tabIndex={10} component={CheckBoxInput} type="checkbox" />
                    hide
                  </CnlHideFlgLabel>
                </CnlHideFlgContainer>
              </div>
            </AirportRow>
            <SpotRow>
              <div>
                <InputLabel>SPOT</InputLabel>
                <SpotContainer>
                  <Field
                    name="spot"
                    placeholder="SPOT"
                    component={MultipleCreatableInput as "select" & typeof MultipleCreatableInput}
                    tabIndex={10}
                    width={968}
                    filterValue={(value: string) => value.slice(0, 4)}
                    formatValues={(values: string[]) => values.map((value) => toUpperCase(value))}
                    maxValLength={10}
                    validate={[validates.lengthSpots, validates.halfWidthSpots]}
                    isShadowOnFocus
                  />
                </SpotContainer>
              </div>
            </SpotRow>
            <AirLineRow>
              <div>
                <InputLabel>Airline</InputLabel>
                <AirLineContainer>
                  <JalGrpContainer>
                    <JalGrpLabel htmlFor="airLineCodeJALGRP">
                      <Field
                        name="airLineCodeJALGRP"
                        id="airLineCodeJALGRP"
                        tabIndex={20}
                        component="input"
                        type="checkbox"
                        onChange={this.handleJalGrp}
                      />
                      JL GRP
                    </JalGrpLabel>
                    <Field
                      name="airLineCode"
                      options={master.airlines.map((al) => ({ label: al.alCd, value: al.alCd }))}
                      component={CheckboxGroup as "input" & typeof CheckboxGroup}
                      tabIndex={21}
                    />
                  </JalGrpContainer>
                  <OalContainer>
                    <OalLabel htmlFor="airLineCodeOALAll">
                      <Field
                        name="airLineCodeOALAll"
                        id="airLineCodeOALAll"
                        component="input"
                        tabIndex={22}
                        type="checkbox"
                        onChange={this.handleOAL}
                      />
                      OAL
                    </OalLabel>
                    <Field
                      name="airLineCodeOAL"
                      placeholder=""
                      component={MultipleCreatableInput as "select" & typeof MultipleCreatableInput}
                      tabIndex={23}
                      width={400}
                      filterValue={(value: string) => value.slice(0, 2)}
                      formatValues={(values: string[]) => values.map((value) => toUpperCase(value))}
                      maxValLength={10}
                      disabled={formValues && formValues.airLineCodeOALAll}
                      validate={[validates.isOkAls]}
                      isShadowOnFocus
                    />
                  </OalContainer>
                </AirLineContainer>
              </div>
            </AirLineRow>
            <ButtonRow>
              <ButtonContainer>
                <SecondaryButton text="Clear" type="button" onClick={this.reset} />
              </ButtonContainer>
              <ButtonContainer>
                <PrimaryButton text="Filter" type="submit" />
              </ButtonContainer>
            </ButtonRow>
          </form>
        </Modal>
      </Wrapper>
    );
  }
}

const submit: FormSubmitHandler<SearchParams, MyProps> = (searchParams, _dispatch, props) => {
  if (searchParams) {
    const params = searchParams;
    if (params.casualFlg) {
      params.flightNo = toUpperCase(params.flightNo);
    } else {
      params.flightNo = formatFlt(params.flightNo);
    }
    params.ship = toUpperCase(params.ship);
    props.searchFis(params);
    onCloseFlightSearchModal(props as unknown as Props);
  }
};

const onCloseFlightSearchModal = (props: Props) => {
  untouchField(props);
  props.closeFlightSearchModal();
};

// バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
const untouchField = (props: Props) => {
  const validationErrorsFields = ["dateTimeTo", ...Object.keys(props.formSyncErrors).map((key) => key)]; // 条件必須の項目はvalidateを持たないため常にtouchedをfalseにする。
  if (validationErrorsFields.length) {
    props.untouch("flightSearch", ...validationErrorsFields);
    props.removeAllNotification();
  }
};

const customStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    borderRadius: "0",
    border: "none",
    width: "1008px",
    height: "340px",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: "22px auto",
    padding: "0",
  },
};

const Wrapper = styled.div``;

const AirportRow = styled.div`
  display: flex;
  margin: 24px 20px 12px 20px;
`;

const SpotRow = styled.div`
  display: flex;
  margin: 12px 20px 12px 20px;
`;

const AirLineRow = styled.div`
  display: flex;
  margin: 12px 20px 18px 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 18px;
  margin-bottom: 20px;
`;

const CheckboxContainer = styled.div`
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
    border: 1px solid ${(props) => props.theme.color.PRIMARY};
    background: #fff;
    position: relative;
    outline: none;
    &:checked {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 4px;
        left: 9px;
        width: 9px;
        height: 14px;
        transform: rotate(45deg);
        border-bottom: 2px solid #fff;
        border-right: 2px solid #fff;
      }
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
  > div:last-child {
    display: flex;
    flex-wrap: wrap;
    margin-left: 8px;
    margin-top: 14px;
  }
`;

const OalContainer = styled(CheckboxContainer)`
  display: flex;
  align-items: start;
  flex-grow: 0;
  width: 476px;
  > div:last-child {
    margin-top: -6px;
  }
`;

const CnlHideFlgContainer = styled(CheckboxContainer)`
  display: flex;
  align-items: center;
  height: 44px;
`;

const InputLabel = styled.div`
  width: 100%;
  height: 16px;
  font-weight: bold;
  text-align: left;
  line-height: 16px;
  font-size: 12px;
`;

const CnlHideFlgLabel = styled.label`
  width: 108px;
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
`;

const JalGrpLabel = styled.label`
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
`;

const OalLabel = styled.label`
  width: 71px;
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
`;

const IntDomCatContainer = styled.div`
  margin-right: 16px;
`;
const SkdNskContainer = styled.div`
  margin-right: 16px;
`;

const AirportContainer = styled.div`
  margin-right: 16px;
`;
const ShipContainer = styled.div`
  margin-right: 16px;
`;
const SpotContainer = styled.div``;
const DateTimeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  > div:first-child {
    margin-right: 12px;
  }
  .line {
    width: 8px;
    margin: 0;
    text-align: center;
    color: #999999;
  }
  input {
    padding: 0 9px 0 6px;
  }
`;
const FlightNoContainer = styled.div`
  display: flex;
  align-items: end;
  margin-right: 12px;
`;

const AirLineContainer = styled.div`
  display: flex;
  width: 968px;
  justify-content: space-between;
`;

const CasualFlgContainer = styled.div`
  width: 40px;
  text-align: center;
  margin-left: 4px;
  label {
    font-size: 12px;
  }
`;

const ButtonContainer = styled.div`
  width: 100px;
  margin: 0 44px;
`;

const FisFilterModalWithForm = reduxForm<SearchParams, MyProps>({
  form: "fisFilterModal",
  onSubmit: submit, // submitをここで設定しないと、ポップアップ入力画面からRemoteSubmitできない。
  initialValues: { dateTimeRadio: "", flightNo: "", ship: "" },
})(FisFilterModal);

const selector = formValueSelector("fisFilterModal");

export default connect((state: RootState) => {
  const flightNoValue = selector(state, "flightNo") as string;
  const casualFlgValue = (selector(state, "casualFlg") as boolean | undefined) || false;

  return { flightNoValue, casualFlgValue };
})(FisFilterModalWithForm);
