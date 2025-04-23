import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import { ServerConfig } from "../../../config/config";
import { LOGINI_TYPE_EXTERNAL, cognitoToken } from "./CognitoToken";
import { storage } from "../storage";

type Callback = {
  onSuccess?: (result: CognitoUserSession) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFailure?: (err: any) => void;
  newPasswordRequired?: (
    cognitoUser: CognitoUser,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userAttributes: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requiredAttributes: any
  ) => void;
};

class ExternalUserLogin {
  getUserPool = () =>
    new CognitoUserPool({
      UserPoolId: ServerConfig.COGNITO_EXTERNAL_USER_POOL_ID,
      ClientId: ServerConfig.COGNITO_APP_CLIENT_ID,
      Storage: sessionStorage,
    });

  onSuccessLogin = (result: CognitoUserSession, callback?: Callback) => {
    storage.cognitoLoginType = LOGINI_TYPE_EXTERNAL;
    this.sendToIosExternalUserToken();
    if (callback?.onSuccess) {
      callback.onSuccess(result);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFailureLogin = (error: any, callback?: Callback) => {
    console.log("NG, signIn:onFailure");
    if (callback?.onFailure) {
      callback.onFailure(error);
    }
  };

  newPasswordRequiredLogin = (
    user: CognitoUser,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userAttributes: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requiredAttributes: any,
    callback?: Callback
  ) => {
    /** userAttributesにemailがあるとエラーになるため削除する */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment
    const { email, ...rest } = userAttributes;
    if (callback?.newPasswordRequired) {
      callback.newPasswordRequired(user, rest, requiredAttributes);
    }
  };

  sendToIosExternalUserToken = () => {
    if (window.webkit) {
      window.webkit.messageHandlers.saveTokenToKeychain.postMessage(JSON.stringify(storage.getExternalUserTokenForIos()));
    }
  };

  attemptLogin = (username: string, password: string, callback?: Callback) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.getUserPool(),
      Storage: sessionStorage,
    });
    cognitoToken.clearSessionStorage();
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: CognitoUserSession) => {
        void this.onSuccessLogin(result, callback);
      },
      onFailure: (err) => this.onFailureLogin(err, callback),
      newPasswordRequired: (userAttributes, requiredAttributes) =>
        this.newPasswordRequiredLogin(cognitoUser, userAttributes, requiredAttributes, callback),
    });
  };

  completeNewPasswordChallenge = (
    newPassword: string,
    user: CognitoUser,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userAttribute: any,
    callback?: Callback
  ) => {
    user.completeNewPasswordChallenge(newPassword, userAttribute, {
      onSuccess: (result: CognitoUserSession) => {
        void this.onSuccessLogin(result, callback);
      },
      onFailure: (err) => this.onFailureLogin(err, callback),
      newPasswordRequired: (userAttributes, requiredAttributes) =>
        this.newPasswordRequiredLogin(user, userAttributes, requiredAttributes, callback),
    });
  };
}

export const externalUserLogin = new ExternalUserLogin();
