"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("../../store/hooks");
const media_1 = __importDefault(require("../../styles/media"));
const commonConst_1 = require("../../lib/commonConst");
const validates = __importStar(require("../../lib/validators"));
const account_1 = require("../../reducers/account");
const common_1 = require("../../reducers/common");
const TextInput_1 = __importDefault(require("../atoms/TextInput"));
const ErrorPopup_1 = __importDefault(require("../molecules/ErrorPopup"));
const profile_svg_1 = __importDefault(require("../../assets/images/account/profile.svg"));
const login_bg_jpg_1 = __importDefault(require("../../assets/images/login-bg.jpg"));
const JobAuth = (props) => {
    // iOSから実行される関数を用意(通知メッセージの取得)
    window.iAddNotificationList = (messagesJson) => {
        void dispatch((0, common_1.addNotificationMessages)({ messagesJson }));
    };
    window.iSetBadgeNumber = (badgeNumber) => {
        dispatch((0, common_1.setBadgeNumber)(badgeNumber));
    };
    window.iJobAuthInfo = (jobCd, jobAuthCd) => {
        props.change("jobCd", jobCd);
        props.change("jobAuthCd", jobAuthCd);
    };
    const submitRef = (0, react_1.useRef)(null);
    const account = (0, hooks_1.useAppSelector)((state) => state.account);
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const history = (0, react_router_dom_1.useHistory)();
    const location = (0, react_router_dom_1.useLocation)();
    const dispatch = (0, hooks_1.useAppDispatch)();
    const { user } = account.profile;
    (0, react_1.useEffect)(() => {
        void dispatch((0, account_1.getProfile)());
        if (window.webkit) {
            window.webkit.messageHandlers.userLoginCompleted.postMessage(""); // バックグラウンド再生を有効にする
        }
        if (window.webkit && window.webkit.messageHandlers.getJobAuthInfo) {
            window.webkit.messageHandlers.getJobAuthInfo.postMessage(""); // Job認証情報を要求する
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        // 強制画面遷移
        if (common.isForceGoToError) {
            void dispatch((0, common_1.screenTransition)({ from: location.pathname, to: commonConst_1.Const.PATH_NAME.error }));
            history.push(commonConst_1.Const.PATH_NAME.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [common.isForceGoToError]);
    const handleSubmitKeyPress = (e) => {
        // enterキーを押したときのみ実行
        if (e.key !== "Enter") {
            return;
        }
        const node = submitRef.current;
        if (node) {
            node.focus();
        }
    };
    const submit = (searchParams) => {
        const { jobCd, jobAuthCd } = searchParams;
        if (window.webkit) {
            // iOSからレスポンスされる関数を用意
            window.iLoginModelId = (modelId, terminalCat) => {
                jobAuthenticate(jobCd, jobAuthCd, modelId, terminalCat);
            };
            // デバイス名を取得する関数を実行
            window.webkit.messageHandlers.getLoginModelId.postMessage("");
        }
        else {
            // PCからのアクセス
            jobAuthenticate(jobCd, jobAuthCd, "", "1");
        }
    };
    const jobAuthenticate = (jobCd, jobAuthCd, deviceName, terminalCat) => {
        void dispatch((0, account_1.jobAuth)({
            jobCd,
            jobAuthCd,
            deviceName,
            terminalCat,
            historyPush: () => {
                history.push(commonConst_1.Const.PATH_NAME.home);
            },
        }));
    };
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Form, null,
            react_1.default.createElement("div", null, user.profileImg != null ? react_1.default.createElement(ProfileImg, { src: `data:image/png;base64,${user.profileImg}` }) : react_1.default.createElement(ProfileDefaultUserIcon, null)),
            user.firstName && react_1.default.createElement(WelcomeText, null,
                user.firstName,
                ", Welcome Back"),
            react_1.default.createElement("form", { action: "#", onSubmit: props.handleSubmit(submit) },
                react_1.default.createElement(JobAuthTextFieldGroup, null,
                    react_1.default.createElement(JobGroupTextField, null,
                        react_1.default.createElement(redux_form_1.Field, { width: "100%", name: "jobCd", autoCapitalize: "off", autoComplete: "off", autoFocus: true, component: TextInput_1.default, maxLength: 10, placeholder: "Job Code", onKeyPress: handleSubmitKeyPress, validate: [validates.requiredJobCode, validates.isOkJobCode] })),
                    react_1.default.createElement(redux_form_1.Field, { width: "100%", name: "jobAuthCd", autoCapitalize: "off", component: TextInput_1.default, type: "password", maxLength: 20, placeholder: "Job Auth Code", onKeyPress: handleSubmitKeyPress, validate: [validates.requiredJobAuthCd, validates.isOkJobAuthCd] })),
                react_1.default.createElement(SubmitButtonContainer, null,
                    react_1.default.createElement("button", { type: "submit", ref: submitRef }, "Job Start !"))),
            react_1.default.createElement(ErrorPopup_1.default, { dispatch: dispatch, isError: account.isError, retry: account.retry }),
            common.fetchHeaderInfoResult.retry ? (react_1.default.createElement(ErrorPopup_1.default, { dispatch: dispatch, isError: common.fetchHeaderInfoResult.isError, retry: common.fetchHeaderInfoResult.retry })) : undefined)));
};
const Wrapper = styled_components_1.default.div `
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: ${() => `url('${login_bg_jpg_1.default}')`};
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Form = styled_components_1.default.div `
  width: 360px;
  padding: 60px 50px;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${media_1.default.lessThan("mobile") `
    width: 280px;
    padding: 40px;
  `};
`;
const JobGroupTextField = styled_components_1.default.div `
  margin-bottom: 32px;

  ${media_1.default.lessThan("mobile") `
    margin-bottom: 28px;
  `};
`;
const JobAuthTextFieldGroup = styled_components_1.default.div `
  margin-bottom: 68px;

  ${media_1.default.lessThan("mobile") `
    margin-bottom: 36px;
  `};
`;
const ProfileImg = styled_components_1.default.img `
  width: 154px;
  height: 154px;
  border-radius: 50%;
  margin-bottom: 6px;

  ${media_1.default.lessThan("mobile") `
    width: 120px;
    height: 120px;
  `};
`;
const ProfileDefaultUserIcon = styled_components_1.default.img.attrs({ src: profile_svg_1.default }) `
  width: 154px;
  height: 154px;
  margin-bottom: 6px;

  ${media_1.default.lessThan("mobile") `
    width: 120px;
    height: 120px;
  `};
`;
const WelcomeText = styled_components_1.default.div `
  font-size: 20px;
  color: #222222;
  margin-bottom: 44px;

  ${media_1.default.lessThan("mobile") `
    font-size: 17px;
    margin-bottom: 30px;
  `};
`;
const SubmitButtonContainer = styled_components_1.default.div `
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
exports.default = (0, redux_form_1.reduxForm)({
    form: "jobAuth",
})(JobAuth);
//# sourceMappingURL=JobAuth.js.map