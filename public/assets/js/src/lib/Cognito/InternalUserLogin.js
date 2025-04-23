"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalUserLogin = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const config_1 = require("../../../config/config");
const CognitoToken_1 = require("./CognitoToken");
const cookies_1 = require("../cookies");
const storage_1 = require("../storage");
const commonConst_1 = require("../commonConst");
/**
 * Azure AD認証画面からのリダイレクト画面で、クエリパラメータに設定された認可コードを使用して内部ユーザー情報を取得する
 */
class InternalUserLogin {
    constructor() {
        this.getCognitoToken = async (queryString) => {
            var _a;
            const query = new URLSearchParams(queryString);
            const code = query.get("code");
            if (!code) {
                console.warn("query string 'code' is empty");
                return false;
            }
            const state = localStorage.getItem("state");
            localStorage.removeItem("state");
            if (query.get("state") !== state) {
                console.error("state does not match");
                return false;
            }
            const redirectUri = `${window.location.origin}${config_1.ServerConfig.BASE_ROUTE}${commonConst_1.Const.PATH_NAME.cognitoRedirect}`;
            // Cognitoトークン取得
            try {
                const response = await (0, axios_1.default)({
                    method: "post",
                    url: config_1.ServerConfig.COGNITO_INTERNAL_USER_TOKEN_ENDPOINT,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data: qs_1.default.stringify({
                        grant_type: "authorization_code",
                        client_id: config_1.ServerConfig.COGNITO_APP_CLIENT_ID,
                        scope: "aws.cognito.signin.user.admin",
                        redirect_uri: redirectUri,
                        code,
                    }),
                });
                CognitoToken_1.cognitoToken.clearSessionStorage();
                storage_1.storage.cognitoLoginType = CognitoToken_1.LOGINI_TYPE_INTERNAL;
                storage_1.storage.cognitoToken = JSON.stringify((_a = response === null || response === void 0 ? void 0 : response.data) !== null && _a !== void 0 ? _a : {});
                const idToken = await CognitoToken_1.cognitoToken.getDecodedIdToken();
                if (idToken === null || idToken === void 0 ? void 0 : idToken.email) {
                    (0, cookies_1.setCookieEmail)(idToken.email);
                    if (window.webkit) {
                        window.webkit.messageHandlers.saveEmailToKeychain.postMessage(idToken.email);
                    }
                }
                this.sendToIosInternallUserToken();
                return true;
            }
            catch (e) {
                console.error(e);
                CognitoToken_1.cognitoToken.logout();
                return false;
            }
        };
        this.sendToIosInternallUserToken = () => {
            let tokens = {};
            [...Array(window.sessionStorage.length).keys()].forEach((index) => {
                const key = window.sessionStorage.key(index);
                if (key === storage_1.storage.storageKey.cognitoToken || key === storage_1.storage.storageKey.cognitoLoginType) {
                    tokens = Object.assign(tokens, {
                        [key]: sessionStorage.getItem(key),
                    });
                }
            });
            if (window.webkit) {
                window.webkit.messageHandlers.saveTokenToKeychain.postMessage(JSON.stringify(tokens));
            }
        };
    }
}
exports.internalUserLogin = new InternalUserLogin();
//# sourceMappingURL=InternalUserLogin.js.map