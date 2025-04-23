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
exports.ResponseEditorModal = void 0;
const react_1 = __importStar(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const soalaMessages_1 = require("../../../lib/soalaMessages");
const validates = __importStar(require("../../../lib/validators"));
const hooks_1 = require("../../../store/hooks");
const bulletinBoard_1 = require("../../../reducers/bulletinBoard");
const bulletinBoardResponseEditorModal_1 = require("../../../reducers/bulletinBoardResponseEditorModal");
const commonUtil_1 = require("../../../lib/commonUtil");
const storage_1 = require("../../../lib/storage");
const TextArea_1 = __importDefault(require("../../atoms/TextArea"));
const Component = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const prevResponse = (0, hooks_1.usePrevious)(props.response);
    (0, react_1.useEffect)(() => {
        if (props.response !== prevResponse) {
            props.change("title", props.response ? props.response.title : "");
            props.change("text", props.response ? props.response.text : "");
        }
        else if (!props.opened) {
            props.reset();
        }
    }, [prevResponse, props]);
    const submitable = () => {
        const { formValues, response } = props;
        const { title: initialTitle, text: initialText } = response || { title: "", text: "" };
        const { title, text } = formValues;
        if (!(text || "").trim()) {
            return false;
        }
        if (!response) {
            return true;
        }
        return (title || "") !== (initialTitle || "") || (text || "") !== (initialText || "");
    };
    const edited = () => {
        const { formValues, response } = props;
        const { title: initialTitle, text: initialText } = response || { title: "", text: "" };
        const { title, text } = formValues;
        if (!response) {
            return !!title || !!text;
        }
        return (title || "") !== (initialTitle || "") || (text || "") !== (initialText || "");
    };
    const submit = (values) => {
        if (!submitable())
            return;
        if (!isNew()) {
            updateResponse(values);
            return;
        }
        createResponse(values);
    };
    const close = () => {
        if (edited()) {
            void dispatch((0, bulletinBoard_1.showMessage)({
                message: soalaMessages_1.SoalaMessage.M40001C({
                    onYesButton: () => dispatch((0, bulletinBoardResponseEditorModal_1.closeBulletinBoardResponseModal)()),
                }),
            }));
        }
        else {
            dispatch((0, bulletinBoardResponseEditorModal_1.closeBulletinBoardResponseModal)());
        }
    };
    const createResponse = (values) => {
        const { bbId, onCreateResponse } = props;
        if (!bbId)
            return;
        // ロケーションを取得し実行する
        (0, commonUtil_1.execWithLocationInfo)(({ posLat, posLon }) => {
            onCreateResponse({ bbId, resTitle: values.title, resText: values.text, posLat, posLon });
        });
    };
    const updateResponse = (values) => {
        const { response, onUpdateResponse } = props;
        if (!response)
            return;
        const resId = response.id;
        const resTitle = values.title;
        const resText = values.text;
        // ロケーションを取得し実行する
        (0, commonUtil_1.execWithLocationInfo)(({ posLat, posLon }) => {
            onUpdateResponse({ resId, resTitle, resText, posLat, posLon });
        });
    };
    const isNew = () => !props.response;
    const customStyles = () => ({
        overlay: {
            background: "rgba(0, 0, 0, 0.5)",
            overflow: "auto",
            zIndex: 999999990 /* reapop(999999999)の下 */,
        },
        content: {
            borderRadius: "0",
            border: "none",
            width: storage_1.storage.isIphone ? "100%" : "1012px",
            top: storage_1.storage.isIphone ? 0 : "calc(50% - 200px)",
            left: 0,
            right: 0,
            bottom: "auto",
            margin: "22px auto",
            padding: "0",
        },
    });
    const { opened, handleSubmit } = props;
    return (react_1.default.createElement(react_modal_1.default, { isOpen: opened, onRequestClose: close, style: customStyles() },
        react_1.default.createElement("form", { onSubmit: handleSubmit(submit) },
            react_1.default.createElement(Content, null,
                react_1.default.createElement(Header, null, "Response"),
                react_1.default.createElement(InputRow, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "title", component: TextInput_1.default, width: "100%", placeholder: "Title", autoFocus: true, maxLength: 300 })),
                react_1.default.createElement(InputRow, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "text", component: TextArea_1.default, width: "100%", height: 150, validate: [validates.required, validates.isOkUnlimitedTextByte] })),
                react_1.default.createElement(SubmitRow, null,
                    react_1.default.createElement(PrimaryButton_1.default, { disabled: !submitable(), text: "Update", type: "submit" }))))));
};
const Form = (0, redux_form_1.reduxForm)({
    form: "bulletinBoardResponseEditorModal",
    initialValues: { title: "", text: "" },
})(Component);
const selector = (0, redux_form_1.formValueSelector)("bulletinBoardResponseEditorModal");
exports.ResponseEditorModal = (0, react_redux_1.connect)((state) => ({
    ...state.bulletinBoardResponseEditorModal,
    formValues: selector(state, "title", "text"),
}))(Form);
const Content = styled_components_1.default.div `
  background-color: #f6f6f6;
  overflow-x: hidden;
  padding: 16px 24px;
`;
const InputRow = styled_components_1.default.div `
  margin-bottom: 4px;
`;
const Header = styled_components_1.default.p `
  font-size: 14px;
  margin: 0 0 4px 0;
`;
const SubmitRow = styled_components_1.default.div `
  margin: auto;
  width: 100px;
`;
//# sourceMappingURL=ResponseEditorModal.js.map