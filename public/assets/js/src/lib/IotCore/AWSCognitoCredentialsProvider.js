"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const credential_providers_1 = require("@aws-sdk/credential-providers");
const browser_1 = require("aws-iot-device-sdk-v2/dist/browser");
const config_1 = require("../../../config/config");
const CognitoToken_1 = require("../Cognito/CognitoToken");
class AWSCognitoCredentialsProvider extends browser_1.auth.CredentialsProvider {
    constructor(options, expire_interval_in_seconds, onError) {
        super();
        this.options = options;
        setInterval(() => {
            this.refreshCredentials().catch(() => {
                if (onError) {
                    onError();
                }
            });
        }, (expire_interval_in_seconds !== null && expire_interval_in_seconds !== void 0 ? expire_interval_in_seconds : 3600) * 1000);
    }
    getCredentials() {
        var _a, _b, _c, _d, _e, _f;
        return {
            aws_access_id: (_b = (_a = this.cachedCredentials) === null || _a === void 0 ? void 0 : _a.accessKeyId) !== null && _b !== void 0 ? _b : "",
            aws_secret_key: (_d = (_c = this.cachedCredentials) === null || _c === void 0 ? void 0 : _c.secretAccessKey) !== null && _d !== void 0 ? _d : "",
            aws_sts_token: (_f = (_e = this.cachedCredentials) === null || _e === void 0 ? void 0 : _e.sessionToken) !== null && _f !== void 0 ? _f : "",
            aws_region: this.options.Region,
        };
    }
    async refreshCredentials() {
        console.log("refreshCredentials", new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
        const token = await CognitoToken_1.cognitoToken.getToken();
        const idToken = token === null || token === void 0 ? void 0 : token.idToken;
        if (!idToken) {
            throw new Error("idtokenが取得できませんでした");
        }
        console.log("refreshCredentials", { idToken });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        this.cachedCredentials = await (0, credential_providers_1.fromCognitoIdentityPool)({
            identityPoolId: this.options.IdentityPoolId,
            clientConfig: { region: this.options.Region },
            logins: {
                [`cognito-idp.${config_1.ServerConfig.AWS_REGION}.amazonaws.com/${config_1.ServerConfig.COGNITO_EXTERNAL_USER_POOL_ID}`]: idToken,
            },
            cache: sessionStorage,
        })();
    }
}
exports.default = AWSCognitoCredentialsProvider;
//# sourceMappingURL=AWSCognitoCredentialsProvider.js.map