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
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importDefault(require("react"));
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const soalaMessages_1 = require("../../../lib/soalaMessages");
const validators_1 = require("../../../lib/validators");
const myValidates = __importStar(require("../../../lib/validators/flightMovementValidator"));
const StatusButton_1 = __importDefault(require("../../atoms/StatusButton"));
const SuggestSelectBox_1 = __importDefault(require("../../atoms/SuggestSelectBox"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const arrow_right_svg_1 = __importDefault(require("../../../assets/images/icon/arrow_right.svg"));
//
class IrregularContent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleIrregularStatusClick = (input, value) => {
            const { formValues, dispatch, showMessage, reset } = this.props;
            const editing = formValues && (formValues.irrInfo.lstArrApoCd || formValues.irrInfo.estLd);
            const checked = input.value === value;
            const update = () => {
                reset();
                input.onChange(checked ? "" : value);
            };
            if (editing) {
                void dispatch(showMessage({ message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: update }) }));
            }
            else {
                update();
            }
        };
    }
    static formatToDDHHmm(dateTimeValue) {
        if (dateTimeValue && (0, dayjs_1.default)(dateTimeValue).isValid()) {
            return (0, dayjs_1.default)(dateTimeValue).format("DDHHmm");
        }
        return "";
    }
    getIrregularStatusLabels() {
        const { movementInfo: { arrInfo: { actLdLcl }, depInfo: { actToLcl, atdLcl }, irrSts, }, } = this.props;
        if (!actLdLcl && actToLcl && !irrSts) {
            // 飛行中
            return ["ATB", "DIV"];
        }
        if (!actLdLcl && !actToLcl && atdLcl && !irrSts) {
            // 出発空港Taxing中
            return ["GTB"];
        }
        if (!actLdLcl && !actToLcl && !atdLcl && !irrSts) {
            // 実績未設定
            return ["ATB", "DIV"];
        }
        if (irrSts) {
            if (irrSts === "GTB" && !actLdLcl) {
                // GTB発生時
                return ["GTB CNL"];
            }
            if (irrSts === "ATB" && !actLdLcl) {
                // ATB発生時
                return ["ATB CNL"];
            }
            if (irrSts === "DIV" && !actLdLcl) {
                // DIV発生時
                return ["DIV CNL", "DIV COR"];
            }
        }
        return [];
    }
    getSupplementaryText() {
        const { formValues } = this.props;
        if (formValues) {
            if (formValues.selectedIrrSts === "ATB") {
                return "*for ATB APT";
            }
            if (formValues.selectedIrrSts === "DIV" || formValues.selectedIrrSts === "DIV COR") {
                return "*for DIV APT";
            }
        }
        return "";
    }
    visibleArrApoCd() {
        const { formValues } = this.props;
        return !!formValues && (formValues.selectedIrrSts === "DIV" || formValues.selectedIrrSts === "DIV COR");
    }
    visibleEta() {
        const { formValues } = this.props;
        return (!!formValues &&
            (formValues.selectedIrrSts === "ATB" || formValues.selectedIrrSts === "DIV" || formValues.selectedIrrSts === "DIV COR"));
    }
    render() {
        const { initialValues, airports, formValues, handleDateTimeInputPopup } = this.props;
        const irregularStatusLabels = this.getIrregularStatusLabels();
        const visibleArrApoCd = this.visibleArrApoCd();
        const visibleEta = this.visibleEta();
        const supplementaryText = this.getSupplementaryText();
        return (react_1.default.createElement(Content, null,
            react_1.default.createElement(GroupBox, { marginBottom: "8px" },
                react_1.default.createElement(IrrStatusRow, null,
                    react_1.default.createElement("label", null, "IRR Status")),
                react_1.default.createElement(GroupBoxRow, null,
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(RowColumnItem, { width: "51px" }, initialValues.irrSts)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(RowColumnItem, { marginLeft: "3px" },
                            react_1.default.createElement(ArrowRightIcon, null))),
                    irregularStatusLabels.map((irregularStatusLabel, index) => irregularStatusLabel && (react_1.default.createElement(redux_form_1.Field, { option: { label: irregularStatusLabel, value: irregularStatusLabel }, id: `selectedIrrSts${index}`, name: "selectedIrrSts", height: "40px", marginLeft: "16px", component: StatusButton_1.default, 
                        // eslint-disable-next-line react/no-array-index-key
                        key: index, onClickInput: this.handleIrregularStatusClick }))))),
            (() => {
                if (!visibleArrApoCd && !visibleEta) {
                    return react_1.default.createElement(react_1.default.Fragment, null);
                }
                return (react_1.default.createElement(GroupBox, { paddingTop: "17px", height: visibleArrApoCd && visibleEta ? "168px" : "96px" },
                    visibleArrApoCd ? (react_1.default.createElement(GroupBoxRow, null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("label", null, "DIV APT"),
                            react_1.default.createElement(RowColumnItem, { width: "75px" }, initialValues.arrInfo ? initialValues.arrInfo.orgArrApoCd : "")),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(RowColumnItem, { marginLeft: "3px", marginRight: "24px" },
                                react_1.default.createElement(ArrowRightIcon, null))),
                        react_1.default.createElement(redux_form_1.Field, { name: "irrInfo.lstArrApoCd", width: 80, height: 40, component: SuggestSelectBox_1.default, options: airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd })), maxMenuHeight: 170, isShadowOnFocus: true, isShowEditedColor: true, maxLength: 3, validate: [validators_1.required, validators_1.halfWidthApoCd], isForceError: this.props.getIsForceError("irrInfo.lstArrApoCd"), onChange: this.props.onChange("irrInfo.lstArrApoCd") }))) : null,
                    visibleEta ? (react_1.default.createElement(GroupBoxRow, { marginTop: visibleArrApoCd ? "20px" : undefined },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("label", null, "ETA(L/D)"),
                            react_1.default.createElement(RowColumnItem, { width: "75px" }, initialValues.arrInfo && initialValues.arrInfo.orgEtaLd
                                ? (0, dayjs_1.default)(initialValues.arrInfo.orgEtaLd).format("DDHHmm")
                                : "")),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(RowColumnItem, { marginLeft: "3px", marginRight: "24px" },
                                react_1.default.createElement(ArrowRightIcon, null))),
                        react_1.default.createElement(redux_form_1.Field, { name: "irrInfo.estLd", width: 96, height: 40, component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 17, showKeyboard: handleDateTimeInputPopup((formValues && formValues.irrInfo.estLd) || "", "irrInfo.estLd"), displayValue: IrregularContent.formatToDDHHmm((formValues && formValues.irrInfo.estLd) || ""), maxLength: 6, validate: [validators_1.required, myValidates.rangeMovementDate], isShadowOnFocus: true, isShowEditedColor: true, isForceError: this.props.getIsForceError("irrInfo.estLd"), onChange: this.props.onChange("irrInfo.estLd") }),
                        supplementaryText ? react_1.default.createElement(SupplementaryText, null, supplementaryText) : null)) : null));
            })()));
    }
}
const Content = styled_components_1.default.div `
  padding-top: 8px;
`;
const SupplementaryText = styled_components_1.default.div `
  font-size: 12px;
  margin-left: 8px;
  height: 40px;
  justify-content: center;
`;
const GroupBox = styled_components_1.default.div `
  padding: ${({ paddingTop }) => paddingTop || "10px"} 13px 0 13px;
  margin-bottom: ${({ marginBottom }) => marginBottom || "0"};
  width: 100%;
  height: ${({ height }) => height || "88px"};
  border: 1px solid #222;
  background-color: ${({ pinkColor }) => (pinkColor ? "#E5C7C6" : "#FFF")};
  div::before {
    z-index: 0;
  }
`;
const GroupBoxRow = styled_components_1.default.div `
  display: flex;
  align-items: flex-end;
  margin-top: ${({ marginTop }) => marginTop || "0"};

  > div {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    label {
      font-size: 12px;
    }
  }
`;
const ArrowRightIcon = styled_components_1.default.img.attrs({ src: arrow_right_svg_1.default }) `
  vertical-align: bottom;
`;
const RowColumnItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  height: 40px;
  ${({ width }) => (width ? `width: ${width}` : "")};
  ${({ marginLeft }) => (marginLeft ? `margin-left: ${marginLeft}` : "")};
  ${({ marginRight }) => (marginRight ? `margin-right: ${marginRight}` : "")};
`;
const IrrStatusRow = styled_components_1.default.div `
  font-size: 12px;
  margin-bottom: 2px;
`;
exports.default = IrregularContent;
//# sourceMappingURL=IrregularContent.js.map