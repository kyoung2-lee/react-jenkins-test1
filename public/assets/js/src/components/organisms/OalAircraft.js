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
exports.FORM_NAME = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const commonUtil_1 = require("../../lib/commonUtil");
const notifications_1 = require("../../lib/notifications");
const soalaMessages_1 = require("../../lib/soalaMessages");
const validates = __importStar(require("../../lib/validators"));
const oalAircraft_1 = require("../../reducers/oalAircraft");
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const TextInput_1 = __importDefault(require("../atoms/TextInput"));
const CommonPopupModal_1 = __importDefault(require("../molecules/CommonPopupModal"));
const ArrDepTargetButtonsAndBars_1 = __importDefault(require("../molecules/ArrDepTargetButtonsAndBars"));
const ArrDepUpdateStatus_1 = __importDefault(require("../molecules/ArrDepUpdateStatus"));
const OalAircraft = (props) => {
    const arrShipNoRef = (0, react_1.useRef)(null);
    const depShipNoRef = (0, react_1.useRef)(null);
    const oalAircraftState = (0, hooks_1.useAppSelector)((state) => state.oalAircraft);
    const prevTargetSelect = (0, hooks_1.usePrevious)(oalAircraftState.targetSelect);
    const dispatch = (0, hooks_1.useAppDispatch)();
    const [arrDisabled, setArrDisabled] = (0, react_1.useState)(false);
    const [depDisabled, setDepDisabled] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setArrDisabled(oalAircraftState.targetSelect === "ARR_DEP_SAME"
            ? oalAircraftState.arr.updateSucceeded || oalAircraftState.dep.updateSucceeded
            : oalAircraftState.arr.updateSucceeded);
        setDepDisabled(oalAircraftState.dep.updateSucceeded);
    }, [oalAircraftState.arr.updateSucceeded, oalAircraftState.dep.updateSucceeded, oalAircraftState.targetSelect]);
    (0, react_1.useEffect)(() => {
        if (prevTargetSelect !== oalAircraftState.targetSelect) {
            if (oalAircraftState.targetSelect === "DEP" || oalAircraftState.targetSelect === "ARR_DEP_SAME") {
                if (depShipNoRef.current) {
                    depShipNoRef.current.focus();
                }
            }
            else if (arrShipNoRef.current) {
                arrShipNoRef.current.focus();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oalAircraftState.targetSelect]);
    const changeFieldToUpperCase = (e, fieldName) => {
        if (e) {
            props.change(fieldName, (0, commonUtil_1.toUpperCase)(e.target.value));
        }
    };
    const handleSubmitKeyPress = (e, fieldName) => {
        if (e.key === "Enter") {
            props.change(fieldName, (0, commonUtil_1.toUpperCase)(e.target.value));
        }
    };
    const handleRequestClose = () => {
        if (props.dirty) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: () => dispatch((0, oalAircraft_1.closeOalAircraftModal)()) }) });
        }
        else {
            dispatch((0, oalAircraft_1.closeOalAircraftModal)());
        }
    };
    const handleClickTarget = (target) => {
        if (props.dirty && target !== oalAircraftState.targetSelect) {
            const onYesButton = () => {
                props.reset();
                dispatch((0, oalAircraft_1.targetSelected)({ target }));
            };
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40012C({ onYesButton }) });
        }
        else {
            dispatch((0, oalAircraft_1.targetSelected)({ target }));
        }
    };
    const getHeaderInfo = ({ isDep }) => {
        const legInfo = isDep ? oalAircraftState.dep.legInfo : oalAircraftState.arr.legInfo;
        if (!legInfo)
            return null;
        return {
            orgDateLcl: legInfo.orgDateLcl,
            alCd: legInfo.alCd,
            fltNo: legInfo.fltNo,
            casFltNo: legInfo.casFltNo,
            csFlg: legInfo.csFlg,
        };
    };
    const getBarProps = ({ isDep }) => {
        const legInfo = isDep ? oalAircraftState.dep.legInfo : oalAircraftState.arr.legInfo;
        if (!legInfo)
            return null;
        return {
            alCd: legInfo.alCd,
            fltNo: legInfo.fltNo,
            casFltNo: legInfo.casFltNo,
            lstDepApoCd: legInfo.lstDepApoCd,
            lstArrApoCd: legInfo.lstArrApoCd,
            orgShipNo: legInfo.shipNo || "",
            orgEqp: legInfo.shipTypeIataCd,
        };
    };
    return (react_1.default.createElement(CommonPopupModal_1.default, { isOpen: oalAircraftState.isOpen, onRequestClose: handleRequestClose, height: 440, arr: getHeaderInfo({ isDep: false }), dep: getHeaderInfo({ isDep: true }) },
        react_1.default.createElement(EqpForm, { onSubmit: props.handleSubmit },
            react_1.default.createElement("div", null,
                react_1.default.createElement(ArrDepUpdateStatus_1.default, { arrStatus: oalAircraftState.arr.statusValue, depStatus: oalAircraftState.dep.statusValue }),
                react_1.default.createElement(ArrDepTargetButtonsAndBars_1.default, { targetButtonsFixed: !oalAircraftState.arr.legInfo ||
                        !oalAircraftState.dep.legInfo ||
                        oalAircraftState.arr.updateSucceeded ||
                        oalAircraftState.dep.updateSucceeded ||
                        oalAircraftState.arr.hasError ||
                        oalAircraftState.dep.hasError, selectedTarget: oalAircraftState.targetSelect, onClickTarget: handleClickTarget, arr: getBarProps({ isDep: false }), dep: getBarProps({ isDep: true }) }),
                react_1.default.createElement(EqpBox, null,
                    oalAircraftState.targetSelect === "ARR" || oalAircraftState.targetSelect === "ARR_DEP_DIFF" ? (react_1.default.createElement(ArrDepGroupBox, { isArrDepBoth: oalAircraftState.targetSelect === "ARR_DEP_DIFF" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(GroupBoxRow, null,
                                react_1.default.createElement("label", null, "SHIP"),
                                react_1.default.createElement(redux_form_1.Field, { innerRef: arrShipNoRef, name: "arr.shipNo", component: TextInput_1.default, width: 144, height: 40, disabled: arrDisabled, isShadowOnFocus: true, maxLength: 10, componentOnBlur: (e) => changeFieldToUpperCase(e, "arr.shipNo"), onKeyPress: (e) => handleSubmitKeyPress(e, "arr.shipNo"), validate: [validates.lengthShip, validates.halfWidthShip], isShowEditedColor: true })),
                            react_1.default.createElement(GroupBoxRow, null,
                                react_1.default.createElement("label", null, "EQP"),
                                react_1.default.createElement(redux_form_1.Field, { name: "arr.eqp", component: TextInput_1.default, width: 72, height: 40, disabled: arrDisabled, isShadowOnFocus: true, maxLength: 3, componentOnBlur: (e) => changeFieldToUpperCase(e, "arr.eqp"), onKeyPress: (e) => handleSubmitKeyPress(e, "arr.eqp"), validate: [validates.required, validates.isEQP], isShowEditedColor: true }))))) : null,
                    oalAircraftState.targetSelect === "DEP" ||
                        oalAircraftState.targetSelect === "ARR_DEP_SAME" ||
                        oalAircraftState.targetSelect === "ARR_DEP_DIFF" ? (react_1.default.createElement(ArrDepGroupBox, { isArrDepBoth: oalAircraftState.targetSelect === "ARR_DEP_DIFF" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(GroupBoxRow, null,
                                react_1.default.createElement("label", null, "SHIP"),
                                react_1.default.createElement(redux_form_1.Field, { innerRef: depShipNoRef, name: "dep.shipNo", component: TextInput_1.default, width: 144, height: 40, disabled: depDisabled, isShadowOnFocus: true, maxLength: 10, componentOnBlur: (e) => changeFieldToUpperCase(e, "dep.shipNo"), onKeyPress: (e) => handleSubmitKeyPress(e, "dep.shipNo"), validate: [validates.lengthShip, validates.halfWidthShip], isShowEditedColor: true })),
                            react_1.default.createElement(GroupBoxRow, null,
                                react_1.default.createElement("label", null, "EQP"),
                                react_1.default.createElement(redux_form_1.Field, { name: "dep.eqp", component: TextInput_1.default, width: 72, height: 40, disabled: depDisabled, isShadowOnFocus: true, maxLength: 3, componentOnBlur: (e) => changeFieldToUpperCase(e, "dep.eqp"), onKeyPress: (e) => handleSubmitKeyPress(e, "dep.eqp"), validate: [validates.required, validates.isEQP], isShowEditedColor: true }))))) : null)),
            react_1.default.createElement(FooterContainer, null,
                react_1.default.createElement(PrimaryButton_1.default, { type: "submit", text: "Update", width: "100px", disabled: !props.dirty })))));
};
const EqpForm = styled_components_1.default.form `
  text-align: center;
  font-size: 18px;
  > div:first-child {
    background-color: #f6f6f6;
    height: 320px;
  }
`;
const EqpBox = styled_components_1.default.div `
  height: 130px;
  width: 100%;
  display: flex;
`;
const ArrDepGroupBox = styled_components_1.default.div `
  width: calc(100% / ${({ isArrDepBoth }) => (isArrDepBoth ? 2 : 1)});
  > div {
    margin: auto;
    width: 144px;
  }
`;
const GroupBoxRow = styled_components_1.default.div `
  margin-bottom: 8px;
  text-align: left;
  label {
    font-size: 12px;
  }
`;
const FooterContainer = styled_components_1.default.div `
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -3px 3px #dfdfdf;
`;
exports.FORM_NAME = "oalAircraft";
const handleSubmitForm = (formValues, dispatch) => {
    notifications_1.NotificationCreator.create({
        dispatch,
        message: soalaMessages_1.SoalaMessage.M30010C({
            onYesButton: () => {
                void dispatch((0, oalAircraft_1.updateOalAircraft)(formValues));
            },
        }),
    });
};
const OalAircraftModalForm = (0, redux_form_1.reduxForm)({
    form: exports.FORM_NAME,
    onSubmit: handleSubmitForm,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
})(OalAircraft);
const mapStateToProps = (state) => ({
    initialValues: state.oalAircraft.initialFormValues,
    formValues: (0, redux_form_1.getFormValues)(exports.FORM_NAME)(state),
});
exports.default = (0, react_redux_1.connect)(mapStateToProps)(OalAircraftModalForm);
//# sourceMappingURL=OalAircraft.js.map