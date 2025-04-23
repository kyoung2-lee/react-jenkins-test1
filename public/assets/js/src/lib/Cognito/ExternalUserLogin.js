"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.externalUserLogin = void 0;
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const config_1 = require("../../../config/config");
const CognitoToken_1 = require("./CognitoToken");
const storage_1 = require("../storage");
class ExternalUserLogin {
    constructor() {
        this.getUserPool = () => new amazon_cognito_identity_js_1.CognitoUserPool({
            UserPoolId: config_1.ServerConfig.COGNITO_EXTERNAL_USER_POOL_ID,
            ClientId: config_1.ServerConfig.COGNITO_APP_CLIENT_ID,
            Storage: sessionStorage,
        });
        this.onSuccessLogin = (result, callback) => {
            storage_1.storage.cognitoLoginType = CognitoToken_1.LOGINI_TYPE_EXTERNAL;
            this.sendToIosExternalUserToken();
            if (callback === null || callback === void 0 ? void 0 : callback.onSuccess) {
                callback.onSuccess(result);
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.onFailureLogin = (error, callback) => {
            console.log("NG, signIn:onFailure");
            if (callback === null || callback === void 0 ? void 0 : callback.onFailure) {
                callback.onFailure(error);
            }
        };
        this.newPasswordRequiredLogin = (user, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userAttributes, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requiredAttributes, callback) => {
            /** userAttributesにemailがあるとエラーになるため削除する */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment
            const { email, ...rest } = userAttributes;
            if (callback === null || callback === void 0 ? void 0 : callback.newPasswordRequired) {
                callback.newPasswordRequired(user, rest, requiredAttributes);
            }
        };
        this.sendToIosExternalUserToken = () => {
            if (window.webkit) {
                window.webkit.messageHandlers.saveTokenToKeychain.postMessage(JSON.stringify(storage_1.storage.getExternalUserTokenForIos()));
            }
        };
        this.attemptLogin = (username, password, callback) => {
            const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails({
                Username: username,
                Password: password,
            });
            const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser({
                Username: username,
                Pool: this.getUserPool(),
                Storage: sessionStorage,
            });
            CognitoToken_1.cognitoToken.clearSessionStorage();
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    void this.onSuccessLogin(result, callback);
                },
                onFailure: (err) => this.onFailureLogin(err, callback),
                newPasswordRequired: (userAttributes, requiredAttributes) => this.newPasswordRequiredLogin(cognitoUser, userAttributes, requiredAttributes, callback),
            });
        };
        this.completeNewPasswordChallenge = (newPassword, user, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userAttribute, callback) => {
            user.completeNewPasswordChallenge(newPassword, userAttribute, {
                onSuccess: (result) => {
                    void this.onSuccessLogin(result, callback);
                },
                onFailure: (err) => this.onFailureLogin(err, callback),
                newPasswordRequired: (userAttributes, requiredAttributes) => this.newPasswordRequiredLogin(user, userAttributes, requiredAttributes, callback),
            });
        };
    }
}
exports.externalUserLogin = new ExternalUserLogin();
//# sourceMappingURL=ExternalUserLogin.js.map