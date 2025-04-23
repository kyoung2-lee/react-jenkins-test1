import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ServerConfig } from "../../../config/config";
import { removeCookieEmail } from "../cookies";
import { storage } from "../storage";
import { storageOfUser } from "../StorageOfUser";

type IdToken = {
  email: string;
};

export const LOGINI_TYPE_INTERNAL = "internal" as const;
export const LOGINI_TYPE_EXTERNAL = "external" as const;

type CognitoTokens = {
  id_token: string;
  access_token: string;
  refresh_token: string;
};

class CognitoToken {
  private getCurrentExternalUser = (): CognitoUser | null => {
    const userPool = new CognitoUserPool({
      UserPoolId: ServerConfig.COGNITO_EXTERNAL_USER_POOL_ID,
      ClientId: ServerConfig.COGNITO_APP_CLIENT_ID,
      Storage: sessionStorage,
    });
    return userPool.getCurrentUser();
  };

  private getExternalUserSession = (): Promise<CognitoUserSession | null> =>
    new Promise((resolve, reject) => {
      const cognitoUser = this.getCurrentExternalUser();
      if (!cognitoUser) {
        resolve(null);
        return;
      }
      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
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
        cognitoUser.refreshSession(
          new CognitoRefreshToken({
            RefreshToken: session.getRefreshToken().getToken(),
          }),
          (error: Error, refreshedSession: CognitoUserSession) => {
            if (err) {
              reject(new Error(error.message || JSON.stringify(error)));
              return;
            }
            resolve(refreshedSession);
          }
        );
      });
    });

  private refreshToken = async (): Promise<CognitoTokens | null> => {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      console.error("Error Refresh Toekn is Emptry");
      return null;
    }
    console.log("internal user token refresh");
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", ServerConfig.COGNITO_APP_CLIENT_ID);
    params.append("refresh_token", refreshToken);
    try {
      const response = await axios.post<CognitoTokens>(ServerConfig.COGNITO_INTERNAL_USER_TOKEN_ENDPOINT, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("New Access Token", { data: response.data });

      if (window.webkit) {
        window.webkit.messageHandlers.saveTokenToKeychain.postMessage(JSON.stringify(response?.data ?? {}));
      }

      return response.data;
    } catch (error) {
      console.error("Error Refreshing Token", { error });
      return null;
    }
  };

  private isTokenExpired = (internalUser: CognitoUserSession) => {
    const decodedToken = jwtDecode(internalUser.getIdToken().getJwtToken());
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp + 300 < currentTime;
  };

  private getInternalUser = (): CognitoUserSession => {
    const cognitoTokenString = storage.cognitoToken;
    try {
      if (cognitoTokenString) {
        const cognitoToken = JSON.parse(cognitoTokenString) as CognitoTokens;
        return new CognitoUserSession({
          IdToken: new CognitoIdToken({ IdToken: cognitoToken.id_token }),
          AccessToken: new CognitoAccessToken({
            AccessToken: cognitoToken.access_token,
          }),
          RefreshToken: new CognitoRefreshToken({
            RefreshToken: cognitoToken.refresh_token,
          }),
        });
      }
    } catch (e) {
      console.error(e);
    }
    return new CognitoUserSession({
      IdToken: new CognitoIdToken({ IdToken: "" }),
      AccessToken: new CognitoAccessToken({ AccessToken: "" }),
      RefreshToken: new CognitoRefreshToken({ RefreshToken: "" }),
    });
  };

  private getInternalUserSession = async (): Promise<CognitoUserSession> => {
    const internalUser = this.getInternalUser();
    try {
      const isExpired = this.isTokenExpired(internalUser);
      if (!isExpired) {
        return internalUser;
      }
      const newToken = await this.refreshToken();
      if (newToken) {
        return new CognitoUserSession({
          IdToken: new CognitoIdToken({ IdToken: newToken.id_token }),
          AccessToken: new CognitoAccessToken({
            AccessToken: newToken.access_token,
          }),
          RefreshToken: new CognitoRefreshToken({
            RefreshToken: newToken.refresh_token,
          }),
        });
      }
    } catch (e) {
      console.error(e);
    }
    return new CognitoUserSession({
      IdToken: new CognitoIdToken({ IdToken: "" }),
      AccessToken: new CognitoAccessToken({ AccessToken: "" }),
      RefreshToken: new CognitoRefreshToken({ RefreshToken: "" }),
    });
  };

  getLoginType = () => storage.cognitoLoginType ?? "";

  getSession = async () => {
    const loginType = this.getLoginType();
    if (loginType === LOGINI_TYPE_EXTERNAL) {
      const sessiion = await this.getExternalUserSession();
      return sessiion;
    }
    if (loginType === LOGINI_TYPE_INTERNAL) {
      return this.getInternalUserSession();
    }
    return null;
  };

  getDecodedIdToken = async () => {
    const session = await this.getSession();
    if (!session) {
      return null;
    }
    try {
      const idToken = jwtDecode<IdToken>(session.getIdToken().getJwtToken());
      return idToken;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  getToken = async () => {
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
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  getDecodedAccessToken = async () => {
    const session = await this.getSession();
    if (!session) {
      return null;
    }
    try {
      return jwtDecode(session.getAccessToken().getJwtToken());
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  getRefreshToken = async () => {
    const session = await this.getSession();
    if (!session) {
      return null;
    }
    try {
      return session.getRefreshToken().getToken();
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  logout = (isIos?: boolean) => {
    console.log("cognitoToken.logout");
    const loginType = this.getLoginType();
    removeCookieEmail();
    if (loginType === LOGINI_TYPE_EXTERNAL) {
      const cognitoUser = this.getCurrentExternalUser();
      if (cognitoUser) {
        cognitoUser.signOut();
        storage.cognitoLoginType = null;
        if (window.webkit) {
          window.webkit.messageHandlers.signOut.postMessage("");
        }
      }
      this.clearStorage(isIos);
      window.open(ServerConfig.USER_LOGIN_URL, "_self"); // TODO: ログアウト後の遷移先 cognitoのログイン画面に変わる？
      return;
    }
    if (loginType === LOGINI_TYPE_INTERNAL) {
      storage.cognitoToken = null;
      storage.cognitoLoginType = null;
      const params = {
        client_id: ServerConfig.COGNITO_APP_CLIENT_ID,
        logout_uri: window.webkit
          ? `${window.location.origin}${ServerConfig.COGNITO_INTERNAL_USER_LOGOUT_REDIRECT_PATH_IOS}`
          : `${window.location.origin}${ServerConfig.COGNITO_INTERNAL_USER_LOGOUT_REDIRECT_PATH}`,
      };
      const urlSearchParam = new URLSearchParams(params).toString();
      const logoutUrl = `${ServerConfig.COGNITO_INTERNAL_USER_LOGOUT_ENDPOINT}?${urlSearchParam}`;
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

  clearSessionStorage = () => {
    const cognitoUser = this.getCurrentExternalUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    } else {
      storage.cognitoToken = null;
    }
    storage.cognitoLoginType = null;
  };

  clearStorage = (isIos?: boolean) => {
    if (isIos) {
      storage.clear();
    } else {
      storage.clear();
      storageOfUser.clearLoginStamp();
      storageOfUser.initPushCounter();
    }
  };
}

export const cognitoToken = new CognitoToken();
