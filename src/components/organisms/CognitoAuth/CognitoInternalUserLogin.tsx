import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { nanoid } from "nanoid";
import PrimaryButton from "../../atoms/PrimaryButton";
import media from "../../../styles/media";
import { getCookieEmail } from "../../../lib/cookies";
import { cognitoToken } from "../../../lib/Cognito/CognitoToken";
import { Const } from "../../../lib/commonConst";
import { ServerConfig } from "../../../../config/config";

const CognitoInternalUserLogin: React.FC = () => {
  const history = useHistory();
  const handleClickLogin = async () => {
    const email = getCookieEmail();
    const idToken = await cognitoToken.getDecodedIdToken();
    if (!email || !idToken) {
      // cookieにメールアドレスがない or 未ログイン
      redirectInternalUserLoginEndpoint();
      return;
    }
    const tokenEmail = idToken?.email;
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
    history.push(Const.PATH_NAME.jobAuth);
  };

  const redirectInternalUserLoginEndpoint = () => {
    const state = nanoid();
    localStorage.setItem("state", state);
    const redirectUri = `${window.location.origin}${ServerConfig.BASE_ROUTE}${Const.PATH_NAME.cognitoRedirect}`;
    const params = {
      client_id: ServerConfig.COGNITO_APP_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "aws.cognito.signin.user.admin openid",
      state,
      identity_provider: ServerConfig.COGNITO_INTERNAL_USER_IDP,
    };
    console.log({ params });
    const urlSearchParam = new URLSearchParams(params).toString();
    const signInUrl = `${ServerConfig.COGNITO_INTERNAL_USER_LOGIN_ENDPOINT}/?${urlSearchParam}`;
    if (window.webkit) {
      window.webkit.messageHandlers.signIn.postMessage(signInUrl);
      return;
    }
    window.location.href = signInUrl;
  };

  return (
    <>
      <Title>Internal User</Title>
      <LoginButtonContainer>
        <PrimaryButton
          text="Login"
          onClick={() => {
            void handleClickLogin();
          }}
        />
      </LoginButtonContainer>
    </>
  );
};

const Title = styled.div`
  font-size: 20px;
  color: #222222;
  margin-bottom: 44px;

  ${media.lessThan("mobile")`
    font-size: 17px;
    margin-bottom: 30px;
  `};
`;

const LoginButtonContainer = styled.div`
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

export default CognitoInternalUserLogin;
