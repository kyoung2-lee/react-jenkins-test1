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
const notifications_1 = require("../../lib/notifications");
const soalaMessages_1 = require("../../lib/soalaMessages");
const validates = __importStar(require("../../lib/validators"));
const oalFuel_1 = require("../../reducers/oalFuel");
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const TextInput_1 = __importDefault(require("../atoms/TextInput"));
const CommonPopupModal_1 = __importDefault(require("../molecules/CommonPopupModal"));
const arrow_right_svg_1 = __importDefault(require("../../assets/images/icon/arrow_right.svg"));
const OalFuel = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const oalFuel = (0, hooks_1.useAppSelector)((state) => state.oalFuel);
    (0, react_1.useEffect)(() => {
        if (!oalFuel.isOpen) {
            dispatch((0, redux_form_1.reset)(exports.FORM_NAME));
        }
    }, [dispatch, oalFuel.isOpen]);
    const normalizeFuelWt = (value) => {
        const onlyNums = value.replace(/[^\d]/g, "");
        if (!onlyNums)
            return "";
        const newValue = Number(onlyNums);
        return String(newValue);
    };
    const formatFuelStatus = (e) => {
        if (e && e.target.value !== null) {
            props.change(e.target.name, e.target.value.toUpperCase());
        }
    };
    const handleSubmitKeyPress = (e) => {
        if (e && e.target.value !== null && e.key === "Enter") {
            props.change(e.target.name, e.target.value.toUpperCase());
        }
    };
    const handleRequestClose = () => {
        if (props.dirty) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: () => dispatch((0, oalFuel_1.closeOalFuel)()) }) });
        }
        else {
            dispatch((0, oalFuel_1.closeOalFuel)());
        }
    };
    const { handleSubmit, dirty, initialValues } = props;
    return (react_1.default.createElement(CommonPopupModal_1.default, { width: 375, height: 296, isOpen: oalFuel.isOpen, onRequestClose: handleRequestClose, flightHeader: oalFuel.flightDetailHeader },
        react_1.default.createElement("form", { onSubmit: handleSubmit },
            react_1.default.createElement(GroupBox, null,
                react_1.default.createElement(GroupBoxRow, { marginTop: "0" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", null, "Fuel"),
                        react_1.default.createElement(RowColumnItem, { width: "70px" }, oalFuel.rampFuelWt)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(RowColumnItem, null,
                            react_1.default.createElement(ArrowRightIcon, null))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(redux_form_1.Field, { name: "rampFuelWt", pattern: "\\d*", component: TextInput_1.default, width: 72, height: 40, autoFocus: true, isShadowOnFocus: true, maxLength: 4, normalize: normalizeFuelWt, validate: [validates.isOkFuelWt], isShowEditedColor: true }))),
                react_1.default.createElement(GroupBoxRow, { marginTop: "19px" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", null, "Fuel Status"),
                        react_1.default.createElement(RowColumnItem, { width: "70px" }, initialValues.rampFuelCat)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(RowColumnItem, null,
                            react_1.default.createElement(ArrowRightIcon, null))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(redux_form_1.Field, { name: "rampFuelCat", component: TextInput_1.default, width: 40, height: 40, isShadowOnFocus: true, maxLength: 1, componentOnBlur: formatFuelStatus, onKeyPress: handleSubmitKeyPress, validate: [validates.isOkFuelStatus], isShowEditedColor: true })))),
            react_1.default.createElement(FooterContainer, null,
                react_1.default.createElement(PrimaryButton_1.default, { type: "submit", text: "Update", width: "110px", disabled: !dirty })))));
};
const GroupBox = styled_components_1.default.div `
  background: #f6f6f6;
  border: #615e5e 1px solid;
  width: 355px;
  height: 160px;
  margin: 8px 10px 0px 10px;
  padding: 19px 22px 16px;
  font-size: 18px;
`;
const GroupBoxRow = styled_components_1.default.div `
  display: flex;
  align-items: flex-end;
  margin-top: ${({ marginTop }) => marginTop || "16px"};
  > div {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    label {
      font-size: 12px;
    }
  }
`;
const RowColumnItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  height: 40px;
  min-width: ${({ width }) => width};
  font-size: 18px;
`;
const ArrowRightIcon = styled_components_1.default.img.attrs({ src: arrow_right_svg_1.default }) `
  vertical-align: bottom;
  margin: 0 30px 0 10px;
`;
const FooterContainer = styled_components_1.default.div `
  display: flex;
  width: 100%;
  height: 88px;
  justify-content: center;
  align-items: center;
`;
exports.FORM_NAME = "OalFuelModalForm";
const handleSubmitForm = (formParams, dispatch, _props) => {
    notifications_1.NotificationCreator.create({
        dispatch,
        message: soalaMessages_1.SoalaMessage.M30010C({
            onYesButton: () => {
                void dispatch((0, oalFuel_1.updateOalFuel)(formParams));
            },
        }),
    });
};
const OalFuelModalForm = (0, redux_form_1.reduxForm)({
    form: exports.FORM_NAME,
    onSubmit: handleSubmitForm,
    enableReinitialize: true,
})(OalFuel);
const mapStateToProps = (state) => {
    const initialValues = {
        rampFuelWt: state.oalFuel.rampFuelWt || "",
        rampFuelCat: state.oalFuel.rampFuelCat || "",
    };
    return {
        initialValues,
        formValues: (0, redux_form_1.getFormValues)(exports.FORM_NAME)(state),
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(OalFuelModalForm);
//# sourceMappingURL=OalFuel.js.map