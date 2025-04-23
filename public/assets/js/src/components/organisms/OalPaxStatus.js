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
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const TextInput_1 = __importDefault(require("../atoms/TextInput"));
const CommonPopupModal_1 = __importDefault(require("../molecules/CommonPopupModal"));
const oalPaxStatus_1 = require("../../reducers/oalPaxStatus");
const arrow_right_svg_1 = __importDefault(require("../../assets/images/icon/arrow_right.svg"));
const OalPaxStatus = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    (0, react_1.useEffect)(() => {
        // 閉じたらフォームの入力値をクリアする
        if (!props.oalPaxStatus.isOpen) {
            dispatch((0, redux_form_1.reset)(exports.FORM_NAME));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.oalPaxStatus.isOpen]);
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
        const { dirty } = props;
        if (dirty) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: () => dispatch((0, oalPaxStatus_1.closeOalPaxStatusModal)()) }) });
        }
        else {
            dispatch((0, oalPaxStatus_1.closeOalPaxStatusModal)());
        }
    };
    const { handleSubmit, dirty, oalPaxStatus } = props;
    return (react_1.default.createElement(CommonPopupModal_1.default, { flightHeader: oalPaxStatus.flightDetailHeader, isOpen: oalPaxStatus.isOpen, onRequestClose: handleRequestClose, height: 392 },
        react_1.default.createElement("form", { onSubmit: handleSubmit },
            react_1.default.createElement(GroupBox, null,
                react_1.default.createElement(GroupBoxRow, { marginTop: "0" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", null, "Gate"),
                        react_1.default.createElement(RowColumnItem, { width: "73px" }, oalPaxStatus.depGateNo)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(RowColumnItem, null,
                            react_1.default.createElement(ArrowRightIcon, null))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(redux_form_1.Field, { name: "depGateNo", type: "string", component: TextInput_1.default, width: 88, height: 40, autoFocus: oalPaxStatus.forcusInputName === "depGateNo", isShadowOnFocus: true, maxLength: 4, componentOnBlur: (e) => changeFieldToUpperCase(e, "depGateNo"), 
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
                            onKeyPress: (e) => handleSubmitKeyPress(e, "depGateNo"), validate: [validates.isOkGateNo], isShowEditedColor: true })))),
            react_1.default.createElement(GroupBox, null,
                react_1.default.createElement(GroupBoxRow, { marginTop: "0" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", null, "Ck-in Status"),
                        react_1.default.createElement(RowColumnItem, { width: "73px" }, oalPaxStatus.acceptanceSts)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(RowColumnItem, null,
                            react_1.default.createElement(ArrowRightIcon, null))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(redux_form_1.Field, { name: "acceptanceSts", type: "string", component: TextInput_1.default, width: 64, height: 40, autoFocus: oalPaxStatus.forcusInputName === "acceptanceSts", isShadowOnFocus: true, maxLength: 2, componentOnBlur: (e) => changeFieldToUpperCase(e, "acceptanceSts"), 
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
                            onKeyPress: (e) => handleSubmitKeyPress(e, "acceptanceSts"), validate: [validates.isOkCkinSts], isShowEditedColor: true }))),
                react_1.default.createElement(GroupBoxRow, { marginTop: "19px" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", null, "Gate Status"),
                        react_1.default.createElement(RowColumnItem, { width: "73px" }, oalPaxStatus.boardingSts)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(RowColumnItem, null,
                            react_1.default.createElement(ArrowRightIcon, null))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(redux_form_1.Field, { name: "boardingSts", type: "string", component: TextInput_1.default, width: 64, height: 40, autoFocus: oalPaxStatus.forcusInputName === "boardingSts", isShadowOnFocus: true, maxLength: 2, componentOnBlur: (e) => changeFieldToUpperCase(e, "boardingSts"), 
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
                            onKeyPress: (e) => handleSubmitKeyPress(e, "boardingSts"), validate: [validates.isOkGateSts], isShowEditedColor: true })))),
            react_1.default.createElement(FooterContainer, null,
                react_1.default.createElement(PrimaryButton_1.default, { type: "submit", text: "Update", width: "100px", disabled: !dirty })))));
};
const GroupBox = styled_components_1.default.div `
  background: #f6f6f6;
  border: #222222 1px solid;
  margin: 8px 10px 0;
  padding: 19px 22px 15px;
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
  margin-right: 24px;
`;
const FooterContainer = styled_components_1.default.div `
  display: flex;
  width: 100%;
  height: 88px;
  justify-content: center;
  align-items: center;
`;
exports.FORM_NAME = "oalPaxStatusForm";
const handleSubmitForm = (formValues, dispatch, _props) => {
    notifications_1.NotificationCreator.create({
        dispatch,
        message: soalaMessages_1.SoalaMessage.M30010C({
            onYesButton: () => {
                void dispatch((0, oalPaxStatus_1.updateOalPaxStatus)(formValues));
            },
        }),
    });
};
const OalPaxStatusModalForm = (0, redux_form_1.reduxForm)({
    form: exports.FORM_NAME,
    onSubmit: handleSubmitForm,
    enableReinitialize: true,
})(OalPaxStatus);
const mapStateToProps = (state) => {
    const orgDepGateNo = state.oalPaxStatus.depGateNo || "";
    const orgAcceptanceSts = state.oalPaxStatus.acceptanceSts || "";
    const orgBoardingSts = state.oalPaxStatus.boardingSts || "";
    const { oalPaxStatus } = state;
    const initialValues = {
        depGateNo: orgDepGateNo ? orgDepGateNo.substring(0, 4) : "",
        acceptanceSts: orgAcceptanceSts || "",
        boardingSts: orgBoardingSts || "",
    };
    return {
        initialValues,
        formValues: (0, redux_form_1.getFormValues)(exports.FORM_NAME)(state),
        orgDepGateNo,
        orgAcceptanceSts,
        orgBoardingSts,
        oalPaxStatus,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(OalPaxStatusModalForm);
//# sourceMappingURL=OalPaxStatus.js.map