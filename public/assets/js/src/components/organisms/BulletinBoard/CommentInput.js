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
exports.CommentInput = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const hooks_1 = require("../../../store/hooks");
const send_svg_component_1 = __importDefault(require("../../../assets/images/icon/send.svg?component"));
const storage_1 = require("../../../lib/storage");
const validates = __importStar(require("../../../lib/validators"));
const soalaMessages_1 = require("../../../lib/soalaMessages");
const bulletinBoard_1 = require("../../../reducers/bulletinBoard");
const UserAvatar_1 = require("./UserAvatar");
const InputButton_1 = __importDefault(require("../../atoms/InputButton"));
const Component = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const textAreaRef = (0, react_1.useRef)();
    const [isError, setIsError] = (0, react_1.useState)(false);
    const prevSelectedBBCmtId = (0, hooks_1.usePrevious)(props.selectedBBCmtId);
    (0, react_1.useEffect)(() => {
        if ((!prevSelectedBBCmtId && !!props.selectedBBCmtId) || (props.selectedBBCmtId && prevSelectedBBCmtId !== props.selectedBBCmtId)) {
            // 編集モードになった時にフォーカスを当てる
            if (textAreaRef.current) {
                textAreaRef.current.focus();
                textAreaRef.current.setSelectionRange(props.text.length, props.text.length);
            }
        }
        else if (!!prevSelectedBBCmtId && !props.selectedBBCmtId) {
            // 編集モードをキャンセルされたらフォーカスを外す
            if (textAreaRef.current) {
                textAreaRef.current.blur();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prevSelectedBBCmtId, props.selectedBBCmtId]);
    (0, react_1.useEffect)(() => {
        if (textAreaRef.current) {
            resizeTextArea(textAreaRef.current);
        }
    }, [props.text]);
    (0, react_1.useEffect)(() => {
        if (isError) {
            setIsError(false);
        }
    }, [isError, props.bbId, props.selectedBBCmtId, props.updateTime, props.disabled]);
    const setTextAreaRef = (element) => {
        textAreaRef.current = element;
        // 親にもRefを渡す
        if (props.setTextAreaRef) {
            props.setTextAreaRef(element);
        }
    };
    const resizeTextArea = (elm) => {
        const element = elm;
        element.style.height = "auto";
        element.style.height = `${elm.scrollHeight}px`;
    };
    const change = (e) => {
        setIsError(false);
        const text = e.target.value;
        resizeTextArea(e.currentTarget);
        props.onChangeText(props.bbId, text);
    };
    const handleKeyDown = (e) => {
        if (e.keyCode === 13 && e.ctrlKey)
            submit();
    };
    const submit = () => {
        if (!props.submitable) {
            return;
        }
        if (hasValidationErrors()) {
            setIsError(true);
            void dispatch((0, bulletinBoard_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M50016C() }));
            return;
        }
        const errMessage = validates.isOkBBComment(props.text);
        if (errMessage) {
            setIsError(true);
            void dispatch((0, bulletinBoard_1.showMessage)({ message: errMessage() }));
            return;
        }
        props.onSubmit(props.bbId);
    };
    const hasValidationErrors = () => !props.text || !props.text.trim();
    const insertFixedPhrase = (text) => {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
        document.execCommand("insertText", false, text);
    };
    const fixComment = props.cdCtrlDtls
        .filter((code) => code.cdCls === "028")
        .sort((a, b) => a.num1 - b.num1)
        .map((code) => ({
        name: storage_1.storage.isIphone ? code.txt3 : code.txt2,
        text: code.txt1,
    }));
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Container, null,
            react_1.default.createElement(UserAvatar_1.UserAvatar, { src: props.profileImg }),
            react_1.default.createElement(CommentInputContainer, null,
                react_1.default.createElement(TextareaContainer, { disabled: props.disabled, isError: isError },
                    react_1.default.createElement(Textarea, { ref: setTextAreaRef, placeholder: "Comment", rows: 1, onChange: change, value: props.text, disabled: props.disabled, onKeyDown: handleKeyDown, maxLength: 3200 }))),
            react_1.default.createElement(SendButtonCol, null,
                react_1.default.createElement(SendButton, { onClick: submit, disabled: !props.submitable }))),
        fixComment.length > 0 && (react_1.default.createElement(InputButtonContainer, null, fixComment.map((c, i) => (
        // eslint-disable-next-line react/no-array-index-key
        react_1.default.createElement(InputButton_1.default, { key: i, text: c.name, onClick: () => insertFixedPhrase(c.text) })))))));
};
exports.CommentInput = (0, react_redux_1.connect)((state) => ({
    cdCtrlDtls: state.account.master.cdCtrlDtls,
}))(Component);
const Container = styled_components_1.default.div `
  display: flex;
  flex: 1;
  align-items: center;
  position: relative;
`;
const CommentInputContainer = styled_components_1.default.div `
  flex: 1;
`;
const InputButtonContainer = styled_components_1.default.div `
  margin-top: 12px;
  margin-right: 24px;
  padding: 0 10px;
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: flex-end;
  position: relative;
  > button {
    margin-left: 10px;
  }
  > button:first-child {
    margin-left: 0;
  }
`;
const TextareaContainer = styled_components_1.default.div `
  border: 1px solid ${(props) => (props.isError ? props.theme.color.border.ERROR : "#346181")};
  border-radius: 20px;
  flex: 1;
  align-items: flex-end;
  display: flex;
  padding: 8px 3px;
  // min-width: ${storage_1.storage.isIphone ? "250px" : "530px"};
  ${({ disabled }) => (disabled ? "opacity: 0.6;" : "")};
  background: ${({ disabled }) => (disabled ? "#EBEBE4" : "#FFF")};
`;
const Textarea = styled_components_1.default.textarea `
  height: 100%;
  flex: 1;
  max-height: 100px;
  padding-left: 10px;
  border: none;
  background: transparent;
  resize: none;
  ::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
`;
const SendButtonCol = styled_components_1.default.div `
  margin-left: 10px;
`;
const SendButton = (0, styled_components_1.default)(send_svg_component_1.default) `
  width: 24px;
  height: 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  fill: ${(props) => (props.disabled ? "#aaa" : "#46627f")};
`;
//# sourceMappingURL=CommentInput.js.map