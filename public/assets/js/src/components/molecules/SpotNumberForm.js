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
const react_1 = __importStar(require("react"));
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const commonUtil_1 = require("../../lib/commonUtil");
const validates = __importStar(require("../../lib/validators"));
const TextInput_1 = __importDefault(require("../atoms/TextInput"));
const ArrDepTargetButtonsAndBars_1 = __importDefault(require("./ArrDepTargetButtonsAndBars"));
const ArrDepUpdateStatus_1 = __importDefault(require("./ArrDepUpdateStatus"));
class SpotNumberForm extends react_1.Component {
    constructor() {
        super(...arguments);
        this.arrSpotRef = react_1.default.createRef();
        this.depSpotRef = react_1.default.createRef();
        this.getBarProps = ({ isDep }) => {
            const legInfo = isDep ? this.props.spotNoRow.dep.legInfo : this.props.spotNoRow.arr.legInfo;
            if (!legInfo)
                return null;
            return {
                alCd: legInfo.alCd,
                fltNo: legInfo.fltNo,
                casFltNo: legInfo.casFltNo,
                lstDepApoCd: legInfo.lstDepApoCd,
                lstArrApoCd: legInfo.lstArrApoCd,
                orgSpotNo: legInfo.spotNo,
            };
        };
        this.changeFieldToUpperCase = (e, fieldName) => {
            if (e) {
                this.props.change(fieldName, (0, commonUtil_1.toUpperCase)(e.target.value));
            }
        };
        this.handleSubmitKeyPress = (e, fieldName) => {
            if (e.key === "Enter") {
                this.props.change(fieldName, (0, commonUtil_1.toUpperCase)(e.target.value));
            }
        };
        this.setForceDirty = (e, field) => {
            var _a;
            const value = e.target.value.toUpperCase();
            const initial = (_a = this.props.spotNoRow[field].legInfo) === null || _a === void 0 ? void 0 : _a.spotNo;
            const payload = {
                givenId: this.props.spotNoRow.givenId,
                isArrDirty: field === "arr" ? value !== initial : undefined,
                isDepDirty: field === "dep" ? value !== initial : undefined,
            };
            this.props.setDirtyForm(payload);
        };
        this.setFormValues = (e, field) => {
            if (this.props.setFormValues == null || this.props.formValues == null)
                return;
            this.props.setFormValues({
                formValues: {
                    ...this.props.formValues,
                    rows: this.props.formValues.rows.map((row, i) => i === this.props.formIndex ? { ...row, [field]: { ...row[field], spotNo: e.target.value.toUpperCase() } } : row),
                },
            });
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.spotNoRow.targetSelect !== this.props.spotNoRow.targetSelect) {
            if (this.props.spotNoRow.targetSelect === "DEP") {
                if (this.depSpotRef.current) {
                    this.depSpotRef.current.focus();
                }
            }
            else if (this.arrSpotRef.current) {
                this.arrSpotRef.current.focus();
            }
        }
    }
    componentWillUnmount() {
        this.props.removeDirtyForm({ givenId: this.props.spotNoRow.givenId });
        if (this.props.removeFormValue != null && this.props.formValues) {
            this.props.removeFormValue({
                givenId: this.props.spotNoRow.givenId,
                formValues: this.props.formValues,
            });
        }
    }
    render() {
        var _a, _b;
        const { spotNoRow: { givenId, targetSelect, arr, dep }, formIndex, onClickTarget, dirtyForms, } = this.props;
        const arrDisabled = targetSelect === "ARR_DEP_SAME" ? arr.updateSucceeded || dep.updateSucceeded : arr.updateSucceeded;
        const depDisabled = dep.updateSucceeded;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            givenId ? (react_1.default.createElement(StatusWrapper, null,
                react_1.default.createElement("label", null,
                    "#",
                    givenId),
                react_1.default.createElement(ArrDepUpdateStatus_1.default, { arrStatus: arr.statusValue, depStatus: dep.statusValue }))) : (react_1.default.createElement(ArrDepUpdateStatus_1.default, { arrStatus: arr.statusValue, depStatus: dep.statusValue })),
            react_1.default.createElement(ArrDepTargetButtonsAndBars_1.default, { targetButtonsFixed: !arr.legInfo || !dep.legInfo || arr.updateSucceeded || dep.updateSucceeded || arr.hasError || dep.hasError, selectedTarget: targetSelect, onClickTarget: onClickTarget, arr: this.getBarProps({ isDep: false }), dep: this.getBarProps({ isDep: true }) }),
            react_1.default.createElement(SpotContainer, { isArrDepBoth: targetSelect === "ARR_DEP_DIFF" },
                formIndex !== null && (targetSelect === "ARR" || targetSelect === "ARR_DEP_SAME" || targetSelect === "ARR_DEP_DIFF") ? (react_1.default.createElement("div", null,
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", null, "SPOT"),
                        react_1.default.createElement(redux_form_1.Field, { innerRef: this.arrSpotRef, name: `rows[${formIndex}].arr.spotNo`, component: TextInput_1.default, width: 96, height: 36, isShadowOnFocus: true, maxLength: 4, isShowEditedColor: true, disabled: arrDisabled, validate: [validates.halfWidthSpot], componentOnBlur: (e) => this.changeFieldToUpperCase(e, `rows[${formIndex}].arr.spotNo`), 
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                            onKeyPress: (e) => this.handleSubmitKeyPress(e, `rows[${formIndex}].arr.spotNo`), props: {
                                handleInputChange: (e) => {
                                    this.setForceDirty(e, "arr");
                                    this.setFormValues(e, "arr");
                                },
                                isForceDirty: (_a = dirtyForms[givenId]) === null || _a === void 0 ? void 0 : _a.arr,
                            } })))) : null,
                formIndex !== null && (targetSelect === "DEP" || targetSelect === "ARR_DEP_DIFF") ? (react_1.default.createElement("div", null,
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", null, "SPOT"),
                        react_1.default.createElement(redux_form_1.Field, { innerRef: this.depSpotRef, name: `rows[${formIndex}].dep.spotNo`, component: TextInput_1.default, width: 96, height: 36, isShadowOnFocus: true, maxLength: 4, isShowEditedColor: true, disabled: depDisabled, validate: [validates.halfWidthSpot], componentOnBlur: (e) => this.changeFieldToUpperCase(e, `rows[${formIndex}].dep.spotNo`), 
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                            onKeyPress: (e) => this.handleSubmitKeyPress(e, `rows[${formIndex}].dep.spotNo`), props: {
                                handleInputChange: (e) => {
                                    this.setForceDirty(e, "dep");
                                    this.setFormValues(e, "dep");
                                },
                                isForceDirty: (_b = dirtyForms[givenId]) === null || _b === void 0 ? void 0 : _b.dep,
                            } })))) : null)));
    }
}
exports.default = SpotNumberForm;
const StatusWrapper = styled_components_1.default.div `
  display: flex;
  > label {
    font-size: 24px;
    color: #8ea6b7;
    margin: 7px 33px auto 15px;
  }
`;
const SpotContainer = styled_components_1.default.div `
  display: flex;
  > div {
    width: ${({ isArrDepBoth }) => (isArrDepBoth ? "50%" : "100%")};
    text-align: left;
    > div {
      width: 96px;
      margin: auto;
      > label {
        font-size: 12px;
      }
    }
  }
`;
//# sourceMappingURL=SpotNumberForm.js.map