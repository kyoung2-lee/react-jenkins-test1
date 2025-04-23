import { CognitoUser } from "amazon-cognito-identity-js";
import React, { useRef } from "react";
import { Field, FormSubmitHandler, InjectedFormProps, reduxForm } from "redux-form";
import styled from "styled-components";
import { externalUserLogin } from "../../../lib/Cognito/ExternalUserLogin";
import TextInput from "../../atoms/TextInput";
import media from "../../../styles/media";

interface FormValue {
  email: string;
  password: string;
}

export type CallbackLogin = {
  onSuccess: () => void;
  newPasswordRequired: (cognitoUser: CognitoUser, userAttributes: any) => void;
};

type MyProps = {
  callbackLogin: CallbackLogin;
};

type Props = MyProps & InjectedFormProps<FormValue, MyProps>;

const CognitoExternalUserLogin: React.FC<Props> = (props) => {
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleSubmitKeyPress = (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => {
    // enterキーを押したときのみ実行
    if (e.key !== "Enter") {
      return;
    }
    const node = submitRef.current;
    if (node) {
      node.focus();
    }
  };

  return (
    <>
      <Title>External User</Title>
      <form onSubmit={props.handleSubmit}>
        <TextFieldGroup>
          <TextField>
            <Field
              width="100%"
              name="email"
              autoCapitalize="off"
              autoComplete="off"
              autoFocus
              component={TextInput}
              maxLength={99}
              onKeyPress={handleSubmitKeyPress}
              placeholder="Email"
            />
          </TextField>
          <TextField>
            <Field
              width="100%"
              name="password"
              autoCapitalize="off"
              autoComplete="off"
              autoFocus
              component={TextInput}
              type="password"
              maxLength={99}
              onKeyPress={handleSubmitKeyPress}
              placeholder="Password"
            />
          </TextField>
          {/* <Input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required /> */}
        </TextFieldGroup>
        <SubmitButtonContainer>
          <button type="submit" ref={submitRef}>
            Login
          </button>
        </SubmitButtonContainer>
      </form>
    </>
  );
};

const onSubmit: FormSubmitHandler<FormValue, MyProps> = (formValues, _dispatch, props) => {
  const { email, password } = formValues;
  externalUserLogin.attemptLogin(email, password, props.callbackLogin);
};

export default reduxForm<FormValue, MyProps>({
  form: "CognitoExternalUserLoginForm",
  onSubmit,
  enableReinitialize: true,
})(CognitoExternalUserLogin);

const Title = styled.div`
  font-size: 20px;
  color: #222222;
  margin-bottom: 44px;

  ${media.lessThan("mobile")`
    font-size: 17px;
    margin-bottom: 30px;
  `};
`;

const TextFieldGroup = styled.div`
  margin-bottom: 68px;

  ${media.lessThan("mobile")`
    margin-bottom: 36px;
  `};
`;

const TextField = styled.div`
  margin-bottom: 32px;

  ${media.lessThan("mobile")`
    margin-bottom: 28px;
  `};
`;

const SubmitButtonContainer = styled.div`
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
