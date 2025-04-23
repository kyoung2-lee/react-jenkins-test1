"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const validates = __importStar(require("../../../lib/validators"));
const myValidates = __importStar(require("../../../lib/validators/fisFilterModalValidator"));
const commonUtil_1 = require("../../../lib/commonUtil");
const storage_1 = require("../../../lib/storage");
const fisFilterModalExports = __importStar(require("../../../reducers/fisFilterModal"));
const CheckboxGroup_1 = __importDefault(require("../../atoms/CheckboxGroup"));
const CheckBoxInput_1 = __importDefault(require("../../atoms/CheckBoxInput"));
const CheckBoxWithLabel_1 = __importDefault(require("../../atoms/CheckBoxWithLabel"));
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const SuggestSelectBox_1 = __importDefault(require("../../atoms/SuggestSelectBox"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const SecondaryButton_1 = __importDefault(require("../../atoms/SecondaryButton"));
const MultipleCreatableInput_1 = __importDefault(require("../../atoms/MultipleCreatableInput"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _default, slice, ...fisFilterModalActions } = fisFilterModalExports;
class FisFilterModal extends react_1.default.Component {
    constructor() {
        super(...arguments);
        // JALGRPチェックボックスを押した時の動作
        this.handleJalGrp = (e) => {
            const { formValues } = this.props;
            const { checked } = e.target;
            const jalGrpCodes = this.jalGrpAirLineCodes().map((al) => al.alCd);
            const currentAirLineCode = formValues && formValues.airLineCode ? formValues.airLineCode : [];
            const changeValue = checked
                ? [...currentAirLineCode, ...jalGrpCodes] // trueの場合: JALGRP全てにチェックを入れる
                : currentAirLineCode.filter((alc) => !jalGrpCodes.includes(alc)); // falseの場合: JALGRP全てのチェックを外す
            this.props.change("airLineCode", changeValue);
        };
        this.handleOAL = (e) => {
            const { formValues } = this.props;
            const { checked } = e.target;
            if (checked && formValues.airLineCodeOAL && formValues.airLineCodeOAL.length) {
                this.props.change("airLineCodeOAL", []);
            }
        };
        this.handleFlightNumberInputPopup = () => {
            this.props.openFlightNumberInputPopup({
                formName: "fisFilterModal",
                fieldName: "flightNo",
                currentFlightNumber: this.props.flightNoValue,
                executeSubmit: true,
                onEnter: this.unfilter,
                canOnlyAlCd: true,
            });
        };
        this.handleDateTime = (e) => {
            if (e && e.target && !e.target.value) {
                this.props.change("dateTimeFrom", "");
                this.props.change("dateTimeTo", "");
            }
        };
        this.reset = () => {
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
        this.unfilter = () => {
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
        this.fltZeroPadding = (e) => {
            if (e) {
                this.props.change("flightNo", this.props.casualFlgValue ? (0, commonUtil_1.toUpperCase)(e.target.value) : (0, commonUtil_1.formatFlt)(e.target.value));
            }
        };
        this.shipToUpperCase = (e) => {
            if (e) {
                this.props.change("ship", (0, commonUtil_1.toUpperCase)(e.target.value));
            }
        };
    }
    componentDidUpdate(nextProps) {
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
            }
            else if (jalGrpValues.some((a) => a === true)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                targetNode.indeterminate = true;
            }
            else {
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
            }
            else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                targetNodeOAL.indeterminate = false;
            }
        }
    }
    jalGrpAirLineCodes() {
        return this.props.master.airlines.filter((al) => al.jalGrpFlg);
    }
    render() {
        const { handleSubmit, master, formValues, formSyncErrors, casualFlgValue } = this.props;
        const { modalIsOpen } = this.props.fisFilterModal;
        return (react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(react_modal_1.default, { isOpen: modalIsOpen, onRequestClose: () => onCloseFlightSearchModal(this.props), style: customStyles },
                react_1.default.createElement("form", { onSubmit: handleSubmit, onChange: this.unfilter },
                    react_1.default.createElement(AirportRow, null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(InputLabel, null, "Airport"),
                            react_1.default.createElement(AirportContainer, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "airport", component: SuggestSelectBox_1.default, tabIndex: 10, placeholder: "APO", maxLength: 3, options: master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), width: 76, validate: [validates.halfWidthApoCd], autoFocus: true, onSelect: this.unfilter, isShadowOnFocus: true }))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(FlightNoContainer, null,
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement(InputLabel, null, "Flight"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "flightNo", id: "flightNo", component: TextInput_1.default, placeholder: "FLT", tabIndex: 10, width: 128, maxLength: 10, componentOnBlur: this.fltZeroPadding, validate: casualFlgValue ? [validates.isOkCasualFlt] : [validates.lengthFlt3, validates.halfWidthFlt], showKeyboard: storage_1.storage.isPc || this.props.casualFlgValue ? undefined : this.handleFlightNumberInputPopup, isShadowOnFocus: true })),
                                react_1.default.createElement(CasualFlgContainer, null,
                                    react_1.default.createElement(redux_form_1.Field, { name: "casualFlg", id: "casual-Flg", text: "Casual", component: CheckBoxWithLabel_1.default, checked: casualFlgValue, tabIndex: 10, isShadowOnFocus: true })))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(InputLabel, null, "SHIP"),
                            react_1.default.createElement(ShipContainer, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "ship", id: "ship", component: TextInput_1.default, tabIndex: 10, placeholder: "SHIP", width: 128, maxLength: 10, componentOnBlur: this.shipToUpperCase, validate: [validates.lengthShip2, validates.halfWidthShip], isShadowOnFocus: true }))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(InputLabel, null, "DOM/INT"),
                            react_1.default.createElement(IntDomCatContainer, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "domOrInt", component: SelectBox_1.default, tabIndex: 10, placeholder: "D/I", options: [
                                        { label: "DOM", value: "D" },
                                        { label: "INT", value: "I" },
                                    ], width: 76, hasBlank: true, isShadowOnFocus: true }))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(InputLabel, null, "SKD/NSK"),
                            react_1.default.createElement(SkdNskContainer, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "skdOrNsk", component: SelectBox_1.default, tabIndex: 10, placeholder: "S/N", options: [
                                        { label: "SKD", value: "SKD" },
                                        { label: "NSK", value: "NSK" },
                                    ], width: 76, hasBlank: true, isShadowOnFocus: true }))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(InputLabel, null, "Time Range (DEP or ARR)"),
                            react_1.default.createElement(DateTimeContainer, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "dateTimeRadio", component: SelectBox_1.default, tabIndex: 10, placeholder: "D/A", options: [
                                        { label: "DEP", value: "DEP" },
                                        { label: "ARR", value: "ARR" },
                                    ], onChange: this.handleDateTime, width: 76, hasBlank: true, isShadowOnFocus: true }),
                                react_1.default.createElement(redux_form_1.Field, { name: "dateTimeFrom", type: "number", component: TextInput_1.default, tabIndex: 10, placeholder: "hhmm", width: 72, maxLength: 4, disabled: formValues && !formValues.dateTimeRadio, validate: [validates.time, myValidates.requiredTime], isShadowOnFocus: true }),
                                react_1.default.createElement("div", { className: "line" }, "-"),
                                react_1.default.createElement(redux_form_1.Field, { name: "dateTimeTo", type: "number", component: TextInput_1.default, tabIndex: 10, placeholder: "hhmm", width: 72, maxLength: 4, disabled: formValues && !formValues.dateTimeRadio, validate: [validates.time], isForceError: formSyncErrors && formSyncErrors.dateTimeFrom, isShadowOnFocus: true }))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(InputLabel, null, "CNL Flight"),
                            react_1.default.createElement(CnlHideFlgContainer, null,
                                react_1.default.createElement(CnlHideFlgLabel, { htmlFor: "cnlHideFlg" },
                                    react_1.default.createElement(redux_form_1.Field, { name: "cnlHideFlg", tabIndex: 10, component: CheckBoxInput_1.default, type: "checkbox" }),
                                    "hide")))),
                    react_1.default.createElement(SpotRow, null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(InputLabel, null, "SPOT"),
                            react_1.default.createElement(SpotContainer, null,
                                react_1.default.createElement(redux_form_1.Field, { name: "spot", placeholder: "SPOT", component: MultipleCreatableInput_1.default, tabIndex: 10, width: 968, filterValue: (value) => value.slice(0, 4), formatValues: (values) => values.map((value) => (0, commonUtil_1.toUpperCase)(value)), maxValLength: 10, validate: [validates.lengthSpots, validates.halfWidthSpots], isShadowOnFocus: true })))),
                    react_1.default.createElement(AirLineRow, null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(InputLabel, null, "Airline"),
                            react_1.default.createElement(AirLineContainer, null,
                                react_1.default.createElement(JalGrpContainer, null,
                                    react_1.default.createElement(JalGrpLabel, { htmlFor: "airLineCodeJALGRP" },
                                        react_1.default.createElement(redux_form_1.Field, { name: "airLineCodeJALGRP", id: "airLineCodeJALGRP", tabIndex: 20, component: "input", type: "checkbox", onChange: this.handleJalGrp }),
                                        "JL GRP"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "airLineCode", options: master.airlines.map((al) => ({ label: al.alCd, value: al.alCd })), component: CheckboxGroup_1.default, tabIndex: 21 })),
                                react_1.default.createElement(OalContainer, null,
                                    react_1.default.createElement(OalLabel, { htmlFor: "airLineCodeOALAll" },
                                        react_1.default.createElement(redux_form_1.Field, { name: "airLineCodeOALAll", id: "airLineCodeOALAll", component: "input", tabIndex: 22, type: "checkbox", onChange: this.handleOAL }),
                                        "OAL"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "airLineCodeOAL", placeholder: "", component: MultipleCreatableInput_1.default, tabIndex: 23, width: 400, filterValue: (value) => value.slice(0, 2), formatValues: (values) => values.map((value) => (0, commonUtil_1.toUpperCase)(value)), maxValLength: 10, disabled: formValues && formValues.airLineCodeOALAll, validate: [validates.isOkAls], isShadowOnFocus: true }))))),
                    react_1.default.createElement(ButtonRow, null,
                        react_1.default.createElement(ButtonContainer, null,
                            react_1.default.createElement(SecondaryButton_1.default, { text: "Clear", type: "button", onClick: this.reset })),
                        react_1.default.createElement(ButtonContainer, null,
                            react_1.default.createElement(PrimaryButton_1.default, { text: "Filter", type: "submit" })))))));
    }
}
const submit = (searchParams, _dispatch, props) => {
    if (searchParams) {
        const params = searchParams;
        if (params.casualFlg) {
            params.flightNo = (0, commonUtil_1.toUpperCase)(params.flightNo);
        }
        else {
            params.flightNo = (0, commonUtil_1.formatFlt)(params.flightNo);
        }
        params.ship = (0, commonUtil_1.toUpperCase)(params.ship);
        props.searchFis(params);
        onCloseFlightSearchModal(props);
    }
};
const onCloseFlightSearchModal = (props) => {
    untouchField(props);
    props.closeFlightSearchModal();
};
// バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
const untouchField = (props) => {
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
const Wrapper = styled_components_1.default.div ``;
const AirportRow = styled_components_1.default.div `
  display: flex;
  margin: 24px 20px 12px 20px;
`;
const SpotRow = styled_components_1.default.div `
  display: flex;
  margin: 12px 20px 12px 20px;
`;
const AirLineRow = styled_components_1.default.div `
  display: flex;
  margin: 12px 20px 18px 20px;
`;
const ButtonRow = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  margin-top: 18px;
  margin-bottom: 20px;
`;
const CheckboxContainer = styled_components_1.default.div `
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
const JalGrpContainer = (0, styled_components_1.default)(CheckboxContainer) `
  flex-grow: 1;
  > div:last-child {
    display: flex;
    flex-wrap: wrap;
    margin-left: 8px;
    margin-top: 14px;
  }
`;
const OalContainer = (0, styled_components_1.default)(CheckboxContainer) `
  display: flex;
  align-items: start;
  flex-grow: 0;
  width: 476px;
  > div:last-child {
    margin-top: -6px;
  }
`;
const CnlHideFlgContainer = (0, styled_components_1.default)(CheckboxContainer) `
  display: flex;
  align-items: center;
  height: 44px;
`;
const InputLabel = styled_components_1.default.div `
  width: 100%;
  height: 16px;
  font-weight: bold;
  text-align: left;
  line-height: 16px;
  font-size: 12px;
`;
const CnlHideFlgLabel = styled_components_1.default.label `
  width: 108px;
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
`;
const JalGrpLabel = styled_components_1.default.label `
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
`;
const OalLabel = styled_components_1.default.label `
  width: 71px;
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
`;
const IntDomCatContainer = styled_components_1.default.div `
  margin-right: 16px;
`;
const SkdNskContainer = styled_components_1.default.div `
  margin-right: 16px;
`;
const AirportContainer = styled_components_1.default.div `
  margin-right: 16px;
`;
const ShipContainer = styled_components_1.default.div `
  margin-right: 16px;
`;
const SpotContainer = styled_components_1.default.div ``;
const DateTimeContainer = styled_components_1.default.div `
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
const FlightNoContainer = styled_components_1.default.div `
  display: flex;
  align-items: end;
  margin-right: 12px;
`;
const AirLineContainer = styled_components_1.default.div `
  display: flex;
  width: 968px;
  justify-content: space-between;
`;
const CasualFlgContainer = styled_components_1.default.div `
  width: 40px;
  text-align: center;
  margin-left: 4px;
  label {
    font-size: 12px;
  }
`;
const ButtonContainer = styled_components_1.default.div `
  width: 100px;
  margin: 0 44px;
`;
const FisFilterModalWithForm = (0, redux_form_1.reduxForm)({
    form: "fisFilterModal",
    onSubmit: submit,
    initialValues: { dateTimeRadio: "", flightNo: "", ship: "" },
})(FisFilterModal);
const selector = (0, redux_form_1.formValueSelector)("fisFilterModal");
exports.default = (0, react_redux_1.connect)((state) => {
    const flightNoValue = selector(state, "flightNo");
    const casualFlgValue = selector(state, "casualFlg") || false;
    return { flightNoValue, casualFlgValue };
})(FisFilterModalWithForm);
//# sourceMappingURL=FisFilterModal.js.map