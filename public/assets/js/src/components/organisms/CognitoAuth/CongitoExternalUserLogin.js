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
const ExternalUserLogin_1 = require("../../../lib/Cognito/ExternalUserLogin");
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const media_1 = __importDefault(require("../../../styles/media"));
const CognitoExternalUserLogin = (props) => {
    const submitRef = (0, react_1.useRef)(null);
    const handleSubmitKeyPress = (e) => {
        // enterキーを押したときのみ実行
        if (e.key !== "Enter") {
            return;
        }
        const node = submitRef.current;
        if (node) {
            node.focus();
        }
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Title, null, "External User"),
        react_1.default.createElement("form", { onSubmit: props.handleSubmit },
            react_1.default.createElement(TextFieldGroup, null,
                react_1.default.createElement(TextField, null,
                    react_1.default.createElement(redux_form_1.Field, { width: "100%", name: "email", autoCapitalize: "off", autoComplete: "off", autoFocus: true, component: TextInput_1.default, maxLength: 99, onKeyPress: handleSubmitKeyPress, placeholder: "Email" })),
                react_1.default.createElement(TextField, null,
                    react_1.default.createElement(redux_form_1.Field, { width: "100%", name: "password", autoCapitalize: "off", autoComplete: "off", autoFocus: true, component: TextInput_1.default, type: "password", maxLength: 99, onKeyPress: handleSubmitKeyPress, placeholder: "Password" }))),
            react_1.default.createElement(SubmitButtonContainer, null,
                react_1.default.createElement("button", { type: "submit", ref: submitRef }, "Login")))));
};
const onSubmit = (formValues, _dispatch, props) => {
    const { email, password } = formValues;
    ExternalUserLogin_1.externalUserLogin.attemptLogin(email, password, props.callbackLogin);
};
exports.default = (0, redux_form_1.reduxForm)({
    form: "CognitoExternalUserLoginForm",
    onSubmit,
    enableReinitialize: true,
})(CognitoExternalUserLogin);
const Title = styled_components_1.default.div `
  font-size: 20px;
  color: #222222;
  margin-bottom: 44px;

  ${media_1.default.lessThan("mobile") `
    font-size: 17px;
    margin-bottom: 30px;
  `};
`;
const TextFieldGroup = styled_components_1.default.div `
  margin-bottom: 68px;

  ${media_1.default.lessThan("mobile") `
    margin-bottom: 36px;
  `};
`;
const TextField = styled_components_1.default.div `
  margin-bottom: 32px;

  ${media_1.default.lessThan("mobile") `
    margin-bottom: 28px;
  `};
`;
const SubmitButtonContainer = styled_components_1.default.div `
  button {
    width: 100%;
    height: 48px;
    background: ${(props) => props.theme.color.PRIMARY};
    border-radius: 4px;
    border: none;
    color: #fff;
    cursor: pointer;
    &:hover {
      background: ${(props) => props.theme.color.button.PRIMARY_HOVER};
    }
    &:active {
      background: ${(props) => props.theme.color.button.PRIMARY_ACTIVE};
    }
  }
`;
//# sourceMappingURL=CongitoExternalUserLogin.js.map