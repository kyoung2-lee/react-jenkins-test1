"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadFilterModal = void 0;
const react_1 = __importDefault(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const hooks_1 = require("../../../store/hooks");
const validators_1 = require("../../../lib/validators");
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const SecondaryButton_1 = __importDefault(require("../../atoms/SecondaryButton"));
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const commonConst_1 = require("../../../lib/commonConst");
const dateTimeInputPopup_1 = require("../../../reducers/dateTimeInputPopup");
const Component = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const reset = () => {
        props.reset();
    };
    const categories = () => props.cdCtrlDtls
        .filter((code) => code.cdCls === commonConst_1.Const.CodeClass.BULLETIN_BOARD_CATEGORY)
        .sort((code1, code2) => code1.num1 - code2.num1)
        .map((cat) => ({
        label: cat.txt1,
        value: cat.cdCat1,
        color: cat.cd1,
    }));
    const submit = () => {
        props.onSubmit();
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blurFrom = (e) => {
        if (!e)
            return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        props.change("from", String(e.target.value).toUpperCase());
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blurTo = (e) => {
        if (!e)
            return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        props.change("to", String(e.target.value).toUpperCase());
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blurArchiveDateLcl = (e) => {
        if (!e)
            return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        const formattedDate = (0, validators_1.getFormatFromDateInput)(e.target.value, "YYYY/MM/DD");
        if (formattedDate) {
            props.change("archiveDateLcl", formattedDate);
        }
    };
    const handleDateInputPopup = () => {
        dispatch((0, dateTimeInputPopup_1.openDateTimeInputPopup)({
            valueFormat: "YYYY-MM-DD",
            currentValue: props.innerArchiveDateLclValue,
            onEnter: (value) => props.change("archiveDateLcl", (0, validators_1.getFormatFromDateInput)(value, "YYYY/MM/DD")),
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onUpdate: async (value) => {
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await props.change("archiveDateLcl", (0, validators_1.getFormatFromDateInput)(value, "YYYY/MM/DD"));
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await submit();
            },
            customUpdateButtonName: "Filter",
        }));
    };
    const normalizeFromTo = (value) => (value ? [...value].filter((c) => (0, validators_1.isOnlyHalfWidthSymbol)(c)).join("") : "");
    const { isOpen, onRequestClose, handleSubmit } = props;
    return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, onRequestClose: onRequestClose, style: customStyles },
        react_1.default.createElement("form", { onSubmit: handleSubmit(submit) },
            react_1.default.createElement(Grid, null,
                react_1.default.createElement(HeaderRow, null,
                    react_1.default.createElement(Col, null,
                        react_1.default.createElement(Label, null, "Keyword"))),
                react_1.default.createElement(InputRow, null,
                    react_1.default.createElement(Col, null,
                        react_1.default.createElement(InputGroup, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "keyword", component: TextInput_1.default, width: "100%", autoFocus: true, isShadowOnFocus: true, maxLength: 30 })))),
                react_1.default.createElement(HeaderRow, null,
                    react_1.default.createElement(Col, null,
                        react_1.default.createElement(Label, null, "Category"))),
                react_1.default.createElement(InputRow, null,
                    react_1.default.createElement(Col, null,
                        react_1.default.createElement(InputGroup, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "catCdList", isMulti: true, component: SelectBox_1.default, width: "100%", options: categories(), isShadowOnFocus: true })))),
                react_1.default.createElement(HeaderRow, null,
                    react_1.default.createElement(Col, null,
                        react_1.default.createElement(Label, null, "From")),
                    react_1.default.createElement(Col, null,
                        react_1.default.createElement(Label, null, "To"))),
                react_1.default.createElement(InputRow, null,
                    react_1.default.createElement(Col, null,
                        react_1.default.createElement(InputGroup, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "from", component: TextInput_1.default, width: "100%", isShadowOnFocus: true, componentOnBlur: blurFrom, maxLength: 10, normalize: normalizeFromTo }))),
                    react_1.default.createElement(Col, null,
                        react_1.default.createElement(InputGroup, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "to", component: TextInput_1.default, width: "100%", isShadowOnFocus: true, componentOnBlur: blurTo, maxLength: 10, normalize: normalizeFromTo })))),
                react_1.default.createElement(HeaderRow, null,
                    react_1.default.createElement(Col, null,
                        react_1.default.createElement(Label, null, "Archive"))),
                react_1.default.createElement(InputRow, null,
                    react_1.default.createElement(Col, null,
                        react_1.default.createElement(InputGroup, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "archiveDateLcl", component: TextInput_1.default, width: 114, showKeyboard: handleDateInputPopup, isShadowOnFocus: true, componentOnBlur: blurArchiveDateLcl, maxLength: 10, placeholder: "yyyymmdd", validate: [validators_1.isDateOrYYYYMMDD] })))),
                react_1.default.createElement(SubmitRow, null,
                    react_1.default.createElement(SubmitCol, null,
                        react_1.default.createElement(SecondaryButton_1.default, { text: "Clear", type: "button", onClick: reset })),
                    react_1.default.createElement(SubmitCol, null,
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Filter", type: "submit" })))))));
};
const Form = (0, redux_form_1.reduxForm)({
    form: "bulletinBoardThreadFilterModal",
    initialValues: { keyword: "" },
})(Component);
const selector = (0, redux_form_1.formValueSelector)("bulletinBoardThreadFilterModal");
const mapStateToProps = (state) => ({
    cdCtrlDtls: state.account.master.cdCtrlDtls,
    innerArchiveDateLclValue: selector(state, "archiveDateLcl"),
});
const enhancer = (0, react_redux_1.connect)(mapStateToProps);
exports.ThreadFilterModal = enhancer(Form);
const customStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        borderRadius: "0",
        border: "none",
        maxWidth: "400px",
        top: 0,
        left: 0,
        right: 0,
        bottom: "auto",
        margin: "22px auto",
        padding: "0",
    },
};
const Grid = styled_components_1.default.div `
  background-color: #f6f6f6;
  overflow-x: hidden;
`;
const Row = styled_components_1.default.div `
  display: flex;
  margin: 0 -10px;
`;
const InputRow = (0, styled_components_1.default)(Row) `
  padding: 0 25px;
`;
const HeaderRow = (0, styled_components_1.default)(InputRow) `
  background: #119ac2;
`;
const SubmitRow = (0, styled_components_1.default)(Row) `
  padding: 0 60px;
  margin-bottom: 20px;
`;
const Col = styled_components_1.default.div `
  position: relative;
  flex: 1;
  padding: 0 10px;
`;
const SubmitCol = (0, styled_components_1.default)(Col) `
  padding: 0 15px;
`;
const Label = styled_components_1.default.label `
  display: block;
  padding: 5px 0;
  font-size: 12px;
  color: #fff;
`;
const InputGroup = styled_components_1.default.div `
  padding: 25px 0;
`;
//# sourceMappingURL=ThreadFilterModal.js.map