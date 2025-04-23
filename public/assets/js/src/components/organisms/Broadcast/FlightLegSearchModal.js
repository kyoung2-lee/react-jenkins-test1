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
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const commonUtil_1 = require("../../../lib/commonUtil");
const storage_1 = require("../../../lib/storage");
const validates = __importStar(require("../../../lib/validators"));
const broadcastBulletinBoard_1 = require("../../../reducers/broadcastBulletinBoard");
// eslint-disable-next-line import/no-cycle
const broadcastFlightLegSearch_1 = require("../../../reducers/broadcastFlightLegSearch");
const dateTimeInputPopup_1 = require("../../../reducers/dateTimeInputPopup");
const flightNumberInputPopup_1 = require("../../../reducers/flightNumberInputPopup");
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const CheckBoxWithLabel_1 = __importDefault(require("../../atoms/CheckBoxWithLabel"));
const flightLegKey = (flightLeg) => `${flightLeg.orgDateLcl}-${flightLeg.alCd}-${flightLeg.fltNo}-${flightLeg.casFltNo}-${flightLeg.skdDepApoCd}-${flightLeg.skdArrApoCd}-${flightLeg.skdLegSno}`;
const FLIGHT_LEG_FIELDS = ["fltNo", "date", "casFltFlg"];
const FlightLegSearchModal = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    (0, react_1.useEffect)(() => {
        if (!isOpen) {
            void dispatch((0, broadcastFlightLegSearch_1.resetFlightLegForm)());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isOpen]);
    const displayDate = () => (0, dayjs_1.default)(props.date, "YYYY-MM-DD").format("DDMMM").toUpperCase();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    const formatFltNo = (e) => (e ? props.change("fltNo", (0, commonUtil_1.formatFlt)(e.target.value)) : () => { });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatCasFltNo = (e) => 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    e ? props.change("fltNo", e.target.value.toUpperCase()) : () => { };
    const clearFltNo = () => props.change("fltNo", "");
    const handleFlightNumberInputPopup = () => {
        clearFltNo();
        dispatch((0, flightNumberInputPopup_1.openFlightNumberInputPopup)({
            formName: exports.FORM_NAME,
            fieldName: "fltNo",
            currentFlightNumber: props.fltNo,
            executeSubmit: true,
            onEnter: () => { },
            canOnlyAlCd: false,
        }));
    };
    const handleDateTimeInputPopup = () => {
        dispatch((0, dateTimeInputPopup_1.openDateTimeInputPopup)({
            valueFormat: "YYYY-MM-DD",
            currentValue: props.date,
            onEnter: (value) => props.change("date", value),
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onUpdate: async (value) => {
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await props.change("date", value);
                await dispatch((0, broadcastFlightLegSearch_1.submitFlightLegForm)());
            },
            customUpdateButtonName: "Search",
            unableDelete: true,
        }));
    };
    const handleFltNoKeyPress = (e) => {
        if (e.key === "Enter") {
            props.change("fltNo", (0, commonUtil_1.formatFlt)(e.target.value));
        }
    };
    const handleClose = () => {
        clearFltNo();
        props.handleClose();
    };
    const { isOpen, flightLegs, onClickFlightLeg, handleSubmit } = props;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, style: modalStyle, onRequestClose: handleClose },
        react_1.default.createElement("form", { onSubmit: handleSubmit },
            react_1.default.createElement(ModalHeader, null,
                react_1.default.createElement(Row, { width: 706 },
                    react_1.default.createElement(Flex, null,
                        react_1.default.createElement(Flex, { width: 254 },
                            react_1.default.createElement(redux_form_1.Field, { name: "date", tabIndex: -1, component: TextInput_1.default, width: 68, showKeyboard: handleDateTimeInputPopup, validate: [validates.required], isShadowOnFocus: true, displayValue: displayDate() }),
                            react_1.default.createElement(redux_form_1.Field, { name: "fltNo", id: "fltNo", tabIndex: 0, placeholder: "FLT", component: TextInput_1.default, width: 124, maxLength: 10, onKeyPress: handleFltNoKeyPress, showKeyboard: isPc ? undefined : handleFlightNumberInputPopup, validate: props.casFltFlg
                                    ? [validates.requiredFlt, validates.halfWidthCasFlt]
                                    : [validates.requiredFlt, validates.lengthFlt3, validates.halfWidthFlt], componentOnBlur: props.casFltFlg ? formatCasFltNo : formatFltNo, isShadowOnFocus: true, autoFocus: true }),
                            react_1.default.createElement(redux_form_1.Field, { name: "casFltFlg", id: "casFltFlg", tabIndex: 1, component: CheckBoxWithLabel_1.default, checked: props.casFltFlg, disabled: false, isShadowOnFocus: true, text: "Casual" })),
                        react_1.default.createElement(Col, { width: 120 },
                            react_1.default.createElement(PrimaryButton_1.default, { text: "Search", type: "submit" }))))),
            react_1.default.createElement(ModalBody, null,
                react_1.default.createElement(Row, { width: 424 }, flightLegs.map((flightLeg) => (0, commonUtil_1.isObjectNotEmpty)(flightLeg) ? (react_1.default.createElement(Flex, { position: "center", key: flightLegKey(flightLeg) },
                    react_1.default.createElement(Col, { width: 150 },
                        react_1.default.createElement(LegButton, { type: "button", onClick: () => {
                                onClickFlightLeg(flightLeg);
                                handleClose();
                            }, isPc: storage_1.storage.isPc },
                            flightLeg.lstDepApoCd,
                            "-",
                            flightLeg.lstArrApoCd)))) : null))))));
};
const onSubmit = (params, dispatch, props) => {
    const { date, fltNo, casFltFlg, formSyncErrors } = props;
    const formattedFlt = (params && params.fltNo) || fltNo;
    if (storage_1.storage.isPc && showFlightLegSearchValidationError(formSyncErrors, dispatch)) {
        return;
    }
    dispatch((0, broadcastBulletinBoard_1.fetchAllBulletinBoardFlightLeg)({
        orgDateLcl: date,
        alCd: casFltFlg ? "" : formattedFlt.slice(0, 2),
        fltNo: casFltFlg ? "" : formattedFlt.slice(2),
        casFltNo: casFltFlg ? formattedFlt : "",
        casFltFlg,
    }));
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
const showFlightLegSearchValidationError = (formSyncErrors, dispatch) => {
    const formErrors = formSyncErrors;
    const errorFields = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorMessages = [];
    for (let i = 0; i < FLIGHT_LEG_FIELDS.length; i++) {
        const field = FLIGHT_LEG_FIELDS[i];
        if (formErrors) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            const messageFunction = formErrors[field];
            if (messageFunction) {
                errorFields.push(field);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                errorMessages.push({ messageFunction });
            }
        }
    }
    dispatch((0, broadcastFlightLegSearch_1.flightLegSubmitFailedField)({ fields: errorFields }));
    return !!errorMessages.length;
};
const ModalHeader = styled_components_1.default.div `
  padding: 20px 20px 24px 20px;
  background: #f6f6f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Row = styled_components_1.default.div `
  margin: 0;
  width: ${(props) => props.width}px;
`;
const Flex = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.position || "space-between"};
  width: ${(props) => (props.width ? `${props.width}px` : "auto")};
`;
const Col = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  width: ${(props) => props.width}px;
`;
const ModalBody = styled_components_1.default.div `
  overflow-y: scroll;
  overflow-x: hidden;
  height: 187px;
  > div > div {
    margin: 26px;
  }
`;
const modalStyle = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        width: "426px",
        left: "calc(50% - 200px)",
        padding: 0,
        height: "280px",
        top: "calc(100vh/2 - 140px)",
        overflow: "hidden",
    },
};
const LegButton = styled_components_1.default.button `
  width: 100%;
  background: ${(props) => props.theme.color.WHITE};
  height: 44px;
  color: ${(props) => props.theme.color.DEFAULT_FONT_COLOR};
  padding: 0;
  border: solid 1px ${(props) => props.theme.color.PRIMARY};
  font-size: 17px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);

  ${({ theme, isPc }) => `
      cursor: pointer;
      ${isPc
    ? `
        &:hover, &:focus {
          background: ${theme.color.FLIGHT_ROW_BACKGROUND_COLOR};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
        }
        &:active {
          background: ${theme.color.FLIGHT_ROW_BACKGROUND_COLOR};
        }
      `
    : `
        &:active {
          background: ${theme.color.FLIGHT_ROW_BACKGROUND_COLOR};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
        }
      `}
  `};
`;
exports.FORM_NAME = "flightLegSearchForm";
const FlightLegSearchForm = (0, redux_form_1.reduxForm)({
    form: exports.FORM_NAME,
    onSubmit,
    enableReinitialize: true,
})(FlightLegSearchModal);
const selector = (0, redux_form_1.formValueSelector)(exports.FORM_NAME);
const mapStateToProps = (state) => {
    const { common: { headerInfo: { apoTimeLcl }, }, broadcast: { BulletinBoard: { flightLegs }, }, } = state;
    const date = (apoTimeLcl ? (0, dayjs_1.default)(apoTimeLcl) : (0, dayjs_1.default)()).format("YYYY-MM-DD");
    const initialValues = {
        date,
    };
    return {
        // eslint-disable-next-line react/no-unused-prop-types
        initialValues,
        flightLegs,
        // eslint-disable-next-line react/no-unused-prop-types
        formValues: (0, redux_form_1.getFormValues)(exports.FORM_NAME)(state),
        // eslint-disable-next-line react/no-unused-prop-types
        formSyncErrors: (0, redux_form_1.getFormSyncErrors)(exports.FORM_NAME)(state),
        date: (selector(state, "date") || ""),
        fltNo: (selector(state, "fltNo") || ""),
        casFltFlg: (selector(state, "casFltFlg") || false),
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(FlightLegSearchForm);
//# sourceMappingURL=FlightLegSearchModal.js.map