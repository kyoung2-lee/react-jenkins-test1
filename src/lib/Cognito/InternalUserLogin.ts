import axios from "axios";
import qs from "qs";
import { ServerConfig } from "../../../config/config";
import { cognitoToken, LOGINI_TYPE_INTERNAL } from "./CognitoToken";
import { setCookieEmail } from "../cookies";
import { storage } from "../storage";
import { Const } from "../commonConst";

/**
 * Azure AD認証画面からのリダイレクト画面で、クエリパラメータに設定された認可コードを使用して内部ユーザー情報を取得する
 */
class InternalUserLogin {
  getCognitoToken = async (queryString: string) => {
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
    const redirectUri = `${window.location.origin}${ServerConfig.BASE_ROUTE}${Const.PATH_NAME.cognitoRedirect}`;
    // Cognitoトークン取得
    try {
      const response = await axios({
        method: "post",
        url: ServerConfig.COGNITO_INTERNAL_USER_TOKEN_ENDPOINT,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          grant_type: "authorization_code",
          client_id: ServerConfig.COGNITO_APP_CLIENT_ID,
          scope: "aws.cognito.signin.user.admin",
          redirect_uri: redirectUri,
          code,
        }),
      });
      cognitoToken.clearSessionStorage();
      storage.cognitoLoginType = LOGINI_TYPE_INTERNAL;
      storage.cognitoToken = JSON.stringify(response?.data ?? {});
      const idToken = await cognitoToken.getDecodedIdToken();
      if (idToken?.email) {
        setCookieEmail(idToken.email);
        if (window.webkit) {
          window.webkit.messageHandlers.saveEmailToKeychain.postMessage(idToken.email);
        }
      }
      this.sendToIosInternallUserToken();
      return true;
    } catch (e) {
      console.error(e);
      cognitoToken.logout();
      return false;
    }
  };

  sendToIosInternallUserToken = () => {
    let tokens = {};
    [...Array(window.sessionStorage.length).keys()].forEach((index: number) => {
      const key = window.sessionStorage.key(index);
      if (key === storage.storageKey.cognitoToken || key === storage.storageKey.cognitoLoginType) {
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

export const internalUserLogin = new InternalUserLogin();
