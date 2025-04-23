import React from "react";
import styled from "styled-components";
import { useLocation, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Const } from "../../lib/commonConst";
import { ServerConfig } from "../../../config/config";
import { screenTransition } from "../../reducers/common";
import logoPng from "../../assets/images/logo.png";
import loginBgJpg from "../../assets/images/login-bg.jpg";

const Error: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const common = useAppSelector((state) => state.common);

  const submit = () => {
    const { forceGoToErrorPath } = common;
    if (forceGoToErrorPath === Const.PATH_NAME.jobAuth) {
      window.open(ServerConfig.USER_LOGIN_URL, "_top");
    } else {
      void dispatch(screenTransition({ from: location.pathname, to: forceGoToErrorPath }));
      history.push(forceGoToErrorPath);
    }
  };

  return (
    <Wrapper>
      <Form>
        <Logo />
        <Message>
          <p>An error occurred.</p>
          <p>Please login again.</p>
        </Message>
        <SubmitButtonContainer onClick={submit} type="submit">
          {common.forceGoToErrorPath === Const.PATH_NAME.jobAuth ? "Logout" : "Mypage"}
        </SubmitButtonContainer>
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
  height: 587px;
  padding: 60px 50px;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
`;
const Message = styled.div`
  font-size: 20px;
  color: #346181;
`;
const SubmitButtonContainer = styled.button`
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
`;
const Logo = styled.img.attrs({ src: logoPng })`
  width: 154px;
`;

export default Error;
