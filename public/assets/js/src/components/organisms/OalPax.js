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
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const TextInput_1 = __importDefault(require("../atoms/TextInput"));
const CommonPopupModal_1 = __importDefault(require("../molecules/CommonPopupModal"));
const oalPax_1 = require("../../reducers/oalPax");
const icon_arrow_down_svg_1 = __importDefault(require("../../assets/images/icon/icon-arrow_down.svg"));
const OalPax = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const oalPax = (0, hooks_1.useAppSelector)((state) => state.oalPax);
    (0, react_1.useEffect)(() => {
        if (!oalPax.isOpen) {
            dispatch((0, redux_form_1.reset)(exports.FORM_NAME));
        }
    }, [dispatch, oalPax.isOpen]);
    const normalizePax = (value) => {
        const onlyNums = value.replace(/[^\d]/g, "");
        if (!onlyNums)
            return "";
        const newValue = Number(onlyNums);
        return String(newValue);
    };
    const handleRequestClose = () => {
        if (props.dirty) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: () => dispatch((0, oalPax_1.closeOalPax)()) }) });
        }
        else {
            dispatch((0, oalPax_1.closeOalPax)());
        }
    };
    const renderOrgTable = () => {
        const { initialValues } = props;
        return (react_1.default.createElement(PassengerTable, null,
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", { className: "cls-cd" },
                    react_1.default.createElement("th", null),
                    react_1.default.createElement("td", null, "F"),
                    react_1.default.createElement("td", null, "C"),
                    react_1.default.createElement("td", null, "W"),
                    react_1.default.createElement("td", null, "Y"))),
            react_1.default.createElement("tbody", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { className: "data-cd" }, "Salable"),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.salableFCnt)),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.salableCCnt)),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.salableWCnt)),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.salableYCnt))),
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { className: "data-cd" }, "Booked"),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.bookedFCnt)),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.bookedCCnt)),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.bookedWCnt)),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.bookedYCnt))),
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { className: "data-cd" }, "Actual"),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.actualFCnt)),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.actualCCnt)),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.actualWCnt)),
                    react_1.default.createElement("td", { className: "cnt" },
                        react_1.default.createElement("span", null, initialValues.actualYCnt))))));
    };
    const renderFormTable = () => (react_1.default.createElement(PassengerTable, null,
        react_1.default.createElement("tbody", null,
            react_1.default.createElement("tr", null,
                react_1.default.createElement("td", { className: "data-cd" }, "Salable"),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "salableFCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true })),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "salableCCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true })),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "salableWCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true })),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "salableYCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true }))),
            react_1.default.createElement("tr", null,
                react_1.default.createElement("td", { className: "data-cd" }, "Booked"),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "bookedFCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true })),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "bookedCCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true })),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "bookedWCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true })),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "bookedYCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true }))),
            react_1.default.createElement("tr", null,
                react_1.default.createElement("td", { className: "data-cd" }, "Actual"),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "actualFCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true })),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "actualCCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true })),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "actualWCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true })),
                react_1.default.createElement("td", { className: "cnt" },
                    react_1.default.createElement(redux_form_1.Field, { name: "actualYCnt", pattern: "\\d*", component: TextInput_1.default, width: 56, height: 40, isShadowOnFocus: true, maxLength: 3, normalize: normalizePax, validate: [validates.lengthPax], isShowEditedColor: true }))))));
    return (react_1.default.createElement(CommonPopupModal_1.default, { flightHeader: oalPax.flightDetailHeader, isOpen: oalPax.isOpen, onRequestClose: handleRequestClose, width: 375, height: 488 },
        react_1.default.createElement(PaxForm, { onSubmit: props.handleSubmit },
            react_1.default.createElement(Box, null,
                renderOrgTable(),
                react_1.default.createElement(DownArrowIcon, null),
                renderFormTable()),
            react_1.default.createElement(FooterContainer, null,
                react_1.default.createElement(PrimaryButton_1.default, { type: "submit", text: "Update", width: "100px", disabled: !props.dirty })))));
};
const PaxForm = styled_components_1.default.form `
  height: 448px;
  text-align: center;
`;
const Box = styled_components_1.default.div `
  background: #f6f6f6;
  border: #222222 1px solid;
  width: 355px;
  height: 352px;
  margin: 8px 10px;
  padding: 16px;
`;
const PassengerTable = styled_components_1.default.table `
  width: 305px;
  margin: auto;
  > tr {
    height: 32px;
  }
  .cls-cd,
  .data-cd {
    font-size: 12px;
  }
  td.cnt {
    font-size: 18px;
    width: 60px;
    > span,
    div {
      width: 56px;
      display: grid;
      place-items: center;
    }

    > span {
      height: 26px;
      margin: 3px;
    }
    > div {
      height: 40px;
      margin: 2px 4px;
    }
    > div input {
      text-align: center;
    }
  }
`;
const DownArrowIcon = styled_components_1.default.img.attrs({ src: icon_arrow_down_svg_1.default }) `
  height: 26px;
  margin: 6px auto 8px;
  fill: ${({ theme }) => theme.color.DEFAULT_FONT_COLOR};
`;
const FooterContainer = styled_components_1.default.div `
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: center;
  align-items: center;
`;
exports.FORM_NAME = "OalPaxModalForm";
const handleSubmitForm = (formParams, dispatch, _props) => {
    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30010C({ onYesButton: () => dispatch((0, oalPax_1.updateOalPax)(formParams)) }) });
};
const OalPaxModalForm = (0, redux_form_1.reduxForm)({
    form: exports.FORM_NAME,
    onSubmit: handleSubmitForm,
    enableReinitialize: true,
})(OalPax);
const mapStateToProps = (state) => {
    const { oalPaxList } = state.oalPax;
    const orgSalableF = oalPaxList.find((pax) => pax.dataCd === "Salable" && pax.paxClsCd === "F");
    const orgSalableC = oalPaxList.find((pax) => pax.dataCd === "Salable" && pax.paxClsCd === "C");
    const orgSalableW = oalPaxList.find((pax) => pax.dataCd === "Salable" && pax.paxClsCd === "W");
    const orgSalableY = oalPaxList.find((pax) => pax.dataCd === "Salable" && pax.paxClsCd === "Y");
    const orgBookedF = oalPaxList.find((pax) => pax.dataCd === "Booked" && pax.paxClsCd === "F");
    const orgBookedC = oalPaxList.find((pax) => pax.dataCd === "Booked" && pax.paxClsCd === "C");
    const orgBookedW = oalPaxList.find((pax) => pax.dataCd === "Booked" && pax.paxClsCd === "W");
    const orgBookedY = oalPaxList.find((pax) => pax.dataCd === "Booked" && pax.paxClsCd === "Y");
    const orgActualF = oalPaxList.find((pax) => pax.dataCd === "Actual" && pax.paxClsCd === "F");
    const orgActualC = oalPaxList.find((pax) => pax.dataCd === "Actual" && pax.paxClsCd === "C");
    const orgActualW = oalPaxList.find((pax) => pax.dataCd === "Actual" && pax.paxClsCd === "W");
    const orgActualY = oalPaxList.find((pax) => pax.dataCd === "Actual" && pax.paxClsCd === "Y");
    const initialValues = {
        salableFCnt: orgSalableF && orgSalableF.cnt !== null ? orgSalableF.cnt.toString() : "",
        salableCCnt: orgSalableC && orgSalableC.cnt !== null ? orgSalableC.cnt.toString() : "",
        salableWCnt: orgSalableW && orgSalableW.cnt !== null ? orgSalableW.cnt.toString() : "",
        salableYCnt: orgSalableY && orgSalableY.cnt !== null ? orgSalableY.cnt.toString() : "",
        bookedFCnt: orgBookedF && orgBookedF.cnt !== null ? orgBookedF.cnt.toString() : "",
        bookedCCnt: orgBookedC && orgBookedC.cnt !== null ? orgBookedC.cnt.toString() : "",
        bookedWCnt: orgBookedW && orgBookedW.cnt !== null ? orgBookedW.cnt.toString() : "",
        bookedYCnt: orgBookedY && orgBookedY.cnt !== null ? orgBookedY.cnt.toString() : "",
        actualFCnt: orgActualF && orgActualF.cnt !== null ? orgActualF.cnt.toString() : "",
        actualCCnt: orgActualC && orgActualC.cnt !== null ? orgActualC.cnt.toString() : "",
        actualWCnt: orgActualW && orgActualW.cnt !== null ? orgActualW.cnt.toString() : "",
        actualYCnt: orgActualY && orgActualY.cnt !== null ? orgActualY.cnt.toString() : "",
    };
    return {
        initialValues,
        formValues: (0, redux_form_1.getFormValues)(exports.FORM_NAME)(state),
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(OalPaxModalForm);
//# sourceMappingURL=OalPax.js.map