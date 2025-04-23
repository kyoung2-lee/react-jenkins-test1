import { CognitoIdentityCredentials } from "@aws-sdk/credential-provider-cognito-identity/dist-types/fromCognitoIdentity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { auth } from "aws-iot-device-sdk-v2/dist/browser";
import { ServerConfig } from "../../../config/config";
import { cognitoToken } from "../Cognito/CognitoToken";

interface AWSCognitoCredentialOptions {
  IdentityPoolId: string;
  Region: string;
}

export default class AWSCognitoCredentialsProvider extends auth.CredentialsProvider {
  private options: AWSCognitoCredentialOptions;
  private cachedCredentials?: CognitoIdentityCredentials;

  constructor(options: AWSCognitoCredentialOptions, expire_interval_in_seconds?: number, onError?: () => void) {
    super();
    this.options = options;
    setInterval(() => {
      this.refreshCredentials().catch(() => {
        if (onError) {
          onError();
        }
      });
    }, (expire_interval_in_seconds ?? 3600) * 1000);
  }

  getCredentials(): auth.AWSCredentials {
    return {
      aws_access_id: this.cachedCredentials?.accessKeyId ?? "",
      aws_secret_key: this.cachedCredentials?.secretAccessKey ?? "",
      aws_sts_token: this.cachedCredentials?.sessionToken ?? "",
      aws_region: this.options.Region,
    };
  }

  async refreshCredentials() {
    console.log("refreshCredentials", new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
    const token = await cognitoToken.getToken();
    const idToken = token?.idToken;

    if (!idToken) {
      throw new Error("idtokenが取得できませんでした");
    }
    console.log("refreshCredentials", { idToken });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.cachedCredentials = await fromCognitoIdentityPool({
      identityPoolId: this.options.IdentityPoolId,
      clientConfig: { region: this.options.Region },
      logins: {
        [`cognito-idp.${ServerConfig.AWS_REGION}.amazonaws.com/${ServerConfig.COGNITO_EXTERNAL_USER_POOL_ID}`]: idToken,
      },
      cache: sessionStorage,
    })();
  }
}
