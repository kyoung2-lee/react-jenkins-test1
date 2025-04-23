"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_router_dom_1 = require("react-router-dom");
const nanoid_1 = require("nanoid");
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const media_1 = __importDefault(require("../../../styles/media"));
const cookies_1 = require("../../../lib/cookies");
const CognitoToken_1 = require("../../../lib/Cognito/CognitoToken");
const commonConst_1 = require("../../../lib/commonConst");
const config_1 = require("../../../../config/config");
const CognitoInternalUserLogin = () => {
    const history = (0, react_router_dom_1.useHistory)();
    const handleClickLogin = async () => {
        const email = (0, cookies_1.getCookieEmail)();
        const idToken = await CognitoToken_1.cognitoToken.getDecodedIdToken();
        if (!email || !idToken) {
            // cookieにメールアドレスがない or 未ログイン
            redirectInternalUserLoginEndpoint();
            return;
        }
        const tokenEmail = idToken === null || idToken === void 0 ? void 0 : idToken.email;
        if (email !== tokenEmail) {
            // cookieのメールアドレスとトークンのメールアドレスが異なる
            redirectInternalUserLoginEndpoint();
            return;
        }
        console.log({
            idTokenEmail: tokenEmail,
            cookieEmail: email,
            message: "トークンのメールアドレスとキーチェーンのメールアドレスが同一",
        });
        history.push(commonConst_1.Const.PATH_NAME.jobAuth);
    };
    const redirectInternalUserLoginEndpoint = () => {
        const state = (0, nanoid_1.nanoid)();
        localStorage.setItem("state", state);
        const redirectUri = `${window.location.origin}${config_1.ServerConfig.BASE_ROUTE}${commonConst_1.Const.PATH_NAME.cognitoRedirect}`;
        const params = {
            client_id: config_1.ServerConfig.COGNITO_APP_CLIENT_ID,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "aws.cognito.signin.user.admin openid",
            state,
            identity_provider: config_1.ServerConfig.COGNITO_INTERNAL_USER_IDP,
        };
        console.log({ params });
        const urlSearchParam = new URLSearchParams(params).toString();
        const signInUrl = `${config_1.ServerConfig.COGNITO_INTERNAL_USER_LOGIN_ENDPOINT}/?${urlSearchParam}`;
        if (window.webkit) {
            window.webkit.messageHandlers.signIn.postMessage(signInUrl);
            return;
        }
        window.location.href = signInUrl;
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Title, null, "Internal User"),
        react_1.default.createElement(LoginButtonContainer, null,
            react_1.default.createElement(PrimaryButton_1.default, { text: "Login", onClick: () => {
                    void handleClickLogin();
                } }))));
};
const Title = styled_components_1.default.div `
  font-size: 20px;
  color: #222222;
  margin-bottom: 44px;

  ${media_1.default.lessThan("mobile") `
    font-size: 17px;
    margin-bottom: 30px;
  `};
`;
const LoginButtonContainer = styled_components_1.default.div `
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
exports.default = CognitoInternalUserLogin;
//# sourceMappingURL=CognitoInternalUserLogin.js.map