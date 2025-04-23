"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoToken = exports.LOGINI_TYPE_EXTERNAL = exports.LOGINI_TYPE_INTERNAL = void 0;
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const axios_1 = __importDefault(require("axios"));
const jwt_decode_1 = require("jwt-decode");
const config_1 = require("../../../config/config");
const cookies_1 = require("../cookies");
const storage_1 = require("../storage");
const StorageOfUser_1 = require("../StorageOfUser");
exports.LOGINI_TYPE_INTERNAL = "internal";
exports.LOGINI_TYPE_EXTERNAL = "external";
class CognitoToken {
    constructor() {
        this.getCurrentExternalUser = () => {
            const userPool = new amazon_cognito_identity_js_1.CognitoUserPool({
                UserPoolId: config_1.ServerConfig.COGNITO_EXTERNAL_USER_POOL_ID,
                ClientId: config_1.ServerConfig.COGNITO_APP_CLIENT_ID,
                Storage: sessionStorage,
            });
            return userPool.getCurrentUser();
        };
        this.getExternalUserSession = () => new Promise((resolve, reject) => {
            const cognitoUser = this.getCurrentExternalUser();
            if (!cognitoUser) {
                resolve(null);
                return;
            }
            cognitoUser.getSession((err, session) => {
                if (err) {
                    reject(err.message || JSON.stringify(err));
                    return;
                }
                if (!session) {
                    reject(new Error("CognitoUserSession is Empty"));
                    return;
                }
                if (session.isValid()) {
                    resolve(session);
                    return;
                }
                console.log("external user token refresh");
                cognitoUser.refreshSession(new amazon_cognito_identity_js_1.CognitoRefreshToken({
                    RefreshToken: session.getRefreshToken().getToken(),
                }), (error, refreshedSession) => {
                    if (err) {
                        reject(new Error(error.message || JSON.stringify(error)));
                        return;
                    }
                    resolve(refreshedSession);
                });
            });
        });
        this.refreshToken = async () => {
            var _a;
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) {
                console.error("Error Refresh Toekn is Emptry");
                return null;
            }
            console.log("internal user token refresh");
            const params = new URLSearchParams();
            params.append("grant_type", "refresh_token");
            params.append("client_id", config_1.ServerConfig.COGNITO_APP_CLIENT_ID);
            params.append("refresh_token", refreshToken);
            try {
                const response = await axios_1.default.post(config_1.ServerConfig.COGNITO_INTERNAL_USER_TOKEN_ENDPOINT, params, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                console.log("New Access Token", { data: response.data });
                if (window.webkit) {
                    window.webkit.messageHandlers.saveTokenToKeychain.postMessage(JSON.stringify((_a = response === null || response === void 0 ? void 0 : response.data) !== null && _a !== void 0 ? _a : {}));
                }
                return response.data;
            }
            catch (error) {
                console.error("Error Refreshing Token", { error });
                return null;
            }
        };
        this.isTokenExpired = (internalUser) => {
            const decodedToken = (0, jwt_decode_1.jwtDecode)(internalUser.getIdToken().getJwtToken());
            if (!decodedToken || !decodedToken.exp) {
                return true;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            return decodedToken.exp + 300 < currentTime;
        };
        this.getInternalUser = () => {
            const cognitoTokenString = storage_1.storage.cognitoToken;
            try {
                if (cognitoTokenString) {
                    const cognitoToken = JSON.parse(cognitoTokenString);
                    return new amazon_cognito_identity_js_1.CognitoUserSession({
                        IdToken: new amazon_cognito_identity_js_1.CognitoIdToken({ IdToken: cognitoToken.id_token }),
                        AccessToken: new amazon_cognito_identity_js_1.CognitoAccessToken({
                            AccessToken: cognitoToken.access_token,
                        }),
                        RefreshToken: new amazon_cognito_identity_js_1.CognitoRefreshToken({
                            RefreshToken: cognitoToken.refresh_token,
                        }),
                    });
                }
            }
            catch (e) {
                console.error(e);
            }
            return new amazon_cognito_identity_js_1.CognitoUserSession({
                IdToken: new amazon_cognito_identity_js_1.CognitoIdToken({ IdToken: "" }),
                AccessToken: new amazon_cognito_identity_js_1.CognitoAccessToken({ AccessToken: "" }),
                RefreshToken: new amazon_cognito_identity_js_1.CognitoRefreshToken({ RefreshToken: "" }),
            });
        };
        this.getInternalUserSession = async () => {
            const internalUser = this.getInternalUser();
            try {
                const isExpired = this.isTokenExpired(internalUser);
                if (!isExpired) {
                    return internalUser;
                }
                const newToken = await this.refreshToken();
                if (newToken) {
                    return new amazon_cognito_identity_js_1.CognitoUserSession({
                        IdToken: new amazon_cognito_identity_js_1.CognitoIdToken({ IdToken: newToken.id_token }),
                        AccessToken: new amazon_cognito_identity_js_1.CognitoAccessToken({
                            AccessToken: newToken.access_token,
                        }),
                        RefreshToken: new amazon_cognito_identity_js_1.CognitoRefreshToken({
                            RefreshToken: newToken.refresh_token,
                        }),
                    });
                }
            }
            catch (e) {
                console.error(e);
            }
            return new amazon_cognito_identity_js_1.CognitoUserSession({
                IdToken: new amazon_cognito_identity_js_1.CognitoIdToken({ IdToken: "" }),
                AccessToken: new amazon_cognito_identity_js_1.CognitoAccessToken({ AccessToken: "" }),
                RefreshToken: new amazon_cognito_identity_js_1.CognitoRefreshToken({ RefreshToken: "" }),
            });
        };
        this.getLoginType = () => { var _a; return (_a = storage_1.storage.cognitoLoginType) !== null && _a !== void 0 ? _a : ""; };
        this.getSession = async () => {
            const loginType = this.getLoginType();
            if (loginType === exports.LOGINI_TYPE_EXTERNAL) {
                const sessiion = await this.getExternalUserSession();
                return sessiion;
            }
            if (loginType === exports.LOGINI_TYPE_INTERNAL) {
                return this.getInternalUserSession();
            }
            return null;
        };
        this.getDecodedIdToken = async () => {
            const session = await this.getSession();
            if (!session) {
                return null;
            }
            try {
                const idToken = (0, jwt_decode_1.jwtDecode)(session.getIdToken().getJwtToken());
                return idToken;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        };
        this.getToken = async () => {
            const session = await this.getSession();
            if (!session) {
                return null;
            }
            try {
                const accessToken = session.getAccessToken().getJwtToken();
                const idToken = session.getIdToken().getJwtToken();
                const refreshToken = session.getRefreshToken().getToken();
                return {
                    accessToken,
                    idToken,
                    refreshToken,
                };
            }
            catch (e) {
                console.error(e);
                return null;
            }
        };
        this.getDecodedAccessToken = async () => {
            const session = await this.getSession();
            if (!session) {
                return null;
            }
            try {
                return (0, jwt_decode_1.jwtDecode)(session.getAccessToken().getJwtToken());
            }
            catch (e) {
                console.error(e);
                return null;
            }
        };
        this.getRefreshToken = async () => {
            const session = await this.getSession();
            if (!session) {
                return null;
            }
            try {
                return session.getRefreshToken().getToken();
            }
            catch (e) {
                console.error(e);
                return null;
            }
        };
        this.logout = (isIos) => {
            console.log("cognitoToken.logout");
            const loginType = this.getLoginType();
            (0, cookies_1.removeCookieEmail)();
            if (loginType === exports.LOGINI_TYPE_EXTERNAL) {
                const cognitoUser = this.getCurrentExternalUser();
                if (cognitoUser) {
                    cognitoUser.signOut();
                    storage_1.storage.cognitoLoginType = null;
                    if (window.webkit) {
                        window.webkit.messageHandlers.signOut.postMessage("");
                    }
                }
                this.clearStorage(isIos);
                window.open(config_1.ServerConfig.USER_LOGIN_URL, "_self"); // TODO: ログアウト後の遷移先 cognitoのログイン画面に変わる？
                return;
            }
            if (loginType === exports.LOGINI_TYPE_INTERNAL) {
                storage_1.storage.cognitoToken = null;
                storage_1.storage.cognitoLoginType = null;
                const params = {
                    client_id: config_1.ServerConfig.COGNITO_APP_CLIENT_ID,
                    logout_uri: window.webkit
                        ? `${window.location.origin}${config_1.ServerConfig.COGNITO_INTERNAL_USER_LOGOUT_REDIRECT_PATH_IOS}`
                        : `${window.location.origin}${config_1.ServerConfig.COGNITO_INTERNAL_USER_LOGOUT_REDIRECT_PATH}`,
                };
                const urlSearchParam = new URLSearchParams(params).toString();
                const logoutUrl = `${config_1.ServerConfig.COGNITO_INTERNAL_USER_LOGOUT_ENDPOINT}?${urlSearchParam}`;
                this.clearStorage(isIos);
                if (window.webkit) {
                    window.webkit.messageHandlers.signOut.postMessage(logoutUrl);
                    return;
                }
                window.location.href = logoutUrl;
                // return;
            }
            // TODO: SignInしていない場合
        };
        this.clearSessionStorage = () => {
            const cognitoUser = this.getCurrentExternalUser();
            if (cognitoUser) {
                cognitoUser.signOut();
            }
            else {
                storage_1.storage.cognitoToken = null;
            }
            storage_1.storage.cognitoLoginType = null;
        };
        this.clearStorage = (isIos) => {
            if (isIos) {
                storage_1.storage.clear();
            }
            else {
                storage_1.storage.clear();
                StorageOfUser_1.storageOfUser.clearLoginStamp();
                StorageOfUser_1.storageOfUser.initPushCounter();
            }
        };
    }
}
exports.cognitoToken = new CognitoToken();
//# sourceMappingURL=CognitoToken.js.map