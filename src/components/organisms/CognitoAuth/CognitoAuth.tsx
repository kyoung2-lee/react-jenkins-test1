import React, { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import CognitoExternalUserLogin, { CallbackLogin } from "./CongitoExternalUserLogin";
import loginBgJpg from "../../../assets/images/login-bg.jpg";
import media from "../../../styles/media";
import { Const } from "../../../lib/commonConst";
import CognitoInternalUserLogin from "./CognitoInternalUserLogin";

type PasswordChageParams = {
  isFirstLogin: boolean;
  user: CognitoUser | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userAttr: any;
};

type Props = {
  //
};

export const CognitoAuth = (_props: Props) => {
  const history = useHistory();
  const [passwordChageParams, setPasswordChangeParams] = useState<PasswordChageParams>({
    isFirstLogin: false,
    user: null,
    userAttr: null,
  });
  const callbackLogin: CallbackLogin = {
    onSuccess: () => {
      history.push(Const.PATH_NAME.jobAuth);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newPasswordRequired: (cognitoUser: CognitoUser, userAttributes: any) => {
      setPasswordChangeParams({
        isFirstLogin: true,
        user: cognitoUser,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        userAttr: userAttributes,
      });
    },
  };
  return (
    <Wrapper>
      <Form>
        <CognitoInternalUserLogin />
      </Form>
      <Form>
        <CognitoExternalUserLogin callbackLogin={callbackLogin} />
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: ${() => `url('${loginBgJpg}')`};
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Form = styled.div`
  width: 360px;
  padding: 60px 50px;
  margin: 0 10px;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${media.lessThan("mobile")`
    width: 280px;
    padding: 40px;
  `};
`;
