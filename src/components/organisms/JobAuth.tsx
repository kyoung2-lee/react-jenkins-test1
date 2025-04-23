import React, { useEffect, useRef } from "react";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import styled from "styled-components";
import { useLocation, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import media from "../../styles/media";
import { Const } from "../../lib/commonConst";
import * as validates from "../../lib/validators";
import { getProfile, jobAuth } from "../../reducers/account";
import { screenTransition, addNotificationMessages, setBadgeNumber } from "../../reducers/common";
import TextInput from "../atoms/TextInput";
import ErrorPopup from "../molecules/ErrorPopup";
import profileColorSvg from "../../assets/images/account/profile.svg";
import loginBgJpg from "../../assets/images/login-bg.jpg";

const JobAuth: React.FC<InjectedFormProps<SearchParams>> = (props) => {
  // iOSから実行される関数を用意(通知メッセージの取得)
  window.iAddNotificationList = (messagesJson: string) => {
    void dispatch(addNotificationMessages({ messagesJson }));
  };
  window.iSetBadgeNumber = (badgeNumber: number) => {
    dispatch(setBadgeNumber(badgeNumber));
  };
  window.iJobAuthInfo = (jobCd: string, jobAuthCd: string) => {
    props.change("jobCd", jobCd);
    props.change("jobAuthCd", jobAuthCd);
  };

  const submitRef = useRef<HTMLButtonElement>(null);

  const account = useAppSelector((state) => state.account);
  const common = useAppSelector((state) => state.common);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { user } = account.profile;

  useEffect(() => {
    void dispatch(getProfile());
    if (window.webkit) {
      window.webkit.messageHandlers.userLoginCompleted.postMessage(""); // バックグラウンド再生を有効にする
    }
    if (window.webkit && window.webkit.messageHandlers.getJobAuthInfo) {
      window.webkit.messageHandlers.getJobAuthInfo.postMessage(""); // Job認証情報を要求する
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 強制画面遷移
    if (common.isForceGoToError) {
      void dispatch(screenTransition({ from: location.pathname, to: Const.PATH_NAME.error }));
      history.push(Const.PATH_NAME.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [common.isForceGoToError]);

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

  const submit = (searchParams: SearchParams) => {
    const { jobCd, jobAuthCd } = searchParams;
    if (window.webkit) {
      // iOSからレスポンスされる関数を用意
      window.iLoginModelId = (modelId, terminalCat) => {
        jobAuthenticate(jobCd, jobAuthCd, modelId, terminalCat);
      };
      // デバイス名を取得する関数を実行
      window.webkit.messageHandlers.getLoginModelId.postMessage("");
    } else {
      // PCからのアクセス
      jobAuthenticate(jobCd, jobAuthCd, "", "1");
    }
  };

  const jobAuthenticate = (jobCd: string, jobAuthCd: string, deviceName: string, terminalCat: string) => {
    void dispatch(
      jobAuth({
        jobCd,
        jobAuthCd,
        deviceName,
        terminalCat,
        historyPush: () => {
          history.push(Const.PATH_NAME.home);
        },
      })
    );
  };

  return (
    <Wrapper>
      <Form>
        <div>{user.profileImg != null ? <ProfileImg src={`data:image/png;base64,${user.profileImg}`} /> : <ProfileDefaultUserIcon />}</div>
        {user.firstName && <WelcomeText>{user.firstName}, Welcome Back</WelcomeText>}
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <form action="#" onSubmit={props.handleSubmit(submit)}>
          <JobAuthTextFieldGroup>
            <JobGroupTextField>
              <Field
                width="100%"
                name="jobCd"
                autoCapitalize="off"
                autoComplete="off"
                autoFocus
                component={TextInput}
                maxLength={10}
                placeholder="Job Code"
                onKeyPress={handleSubmitKeyPress}
                validate={[validates.requiredJobCode, validates.isOkJobCode]}
              />
            </JobGroupTextField>
            <Field
              width="100%"
              name="jobAuthCd"
              autoCapitalize="off"
              component={TextInput}
              type="password"
              maxLength={20}
              placeholder="Job Auth Code"
              onKeyPress={handleSubmitKeyPress}
              validate={[validates.requiredJobAuthCd, validates.isOkJobAuthCd]}
            />
          </JobAuthTextFieldGroup>
          <SubmitButtonContainer>
            <button type="submit" ref={submitRef}>
              Job Start !
            </button>
          </SubmitButtonContainer>
        </form>

        <ErrorPopup dispatch={dispatch} isError={account.isError} retry={account.retry} />
        {common.fetchHeaderInfoResult.retry ? (
          <ErrorPopup dispatch={dispatch} isError={common.fetchHeaderInfoResult.isError} retry={common.fetchHeaderInfoResult.retry} />
        ) : undefined}
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
const JobGroupTextField = styled.div`
  margin-bottom: 32px;

  ${media.lessThan("mobile")`
    margin-bottom: 28px;
  `};
`;
const JobAuthTextFieldGroup = styled.div`
  margin-bottom: 68px;

  ${media.lessThan("mobile")`
    margin-bottom: 36px;
  `};
`;
const ProfileImg = styled.img`
  width: 154px;
  height: 154px;
  border-radius: 50%;
  margin-bottom: 6px;

  ${media.lessThan("mobile")`
    width: 120px;
    height: 120px;
  `};
`;
const ProfileDefaultUserIcon = styled.img.attrs({ src: profileColorSvg })`
  width: 154px;
  height: 154px;
  margin-bottom: 6px;

  ${media.lessThan("mobile")`
    width: 120px;
    height: 120px;
  `};
`;
const WelcomeText = styled.div`
  font-size: 20px;
  color: #222222;
  margin-bottom: 44px;

  ${media.lessThan("mobile")`
    font-size: 17px;
    margin-bottom: 30px;
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

interface SearchParams {
  jobCd: string;
  jobAuthCd: string;
}

export default reduxForm<SearchParams>({
  form: "jobAuth",
})(JobAuth);
