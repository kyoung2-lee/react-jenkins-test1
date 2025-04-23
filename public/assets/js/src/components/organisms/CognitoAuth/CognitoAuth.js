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
exports.CognitoAuth = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_router_dom_1 = require("react-router-dom");
const CongitoExternalUserLogin_1 = __importDefault(require("./CongitoExternalUserLogin"));
const login_bg_jpg_1 = __importDefault(require("../../../assets/images/login-bg.jpg"));
const media_1 = __importDefault(require("../../../styles/media"));
const commonConst_1 = require("../../../lib/commonConst");
const CognitoInternalUserLogin_1 = __importDefault(require("./CognitoInternalUserLogin"));
const CognitoAuth = (_props) => {
    const history = (0, react_router_dom_1.useHistory)();
    const [passwordChageParams, setPasswordChangeParams] = (0, react_1.useState)({
        isFirstLogin: false,
        user: null,
        userAttr: null,
    });
    const callbackLogin = {
        onSuccess: () => {
            history.push(commonConst_1.Const.PATH_NAME.jobAuth);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newPasswordRequired: (cognitoUser, userAttributes) => {
            setPasswordChangeParams({
                isFirstLogin: true,
                user: cognitoUser,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                userAttr: userAttributes,
            });
        },
    };
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Form, null,
            react_1.default.createElement(CognitoInternalUserLogin_1.default, null)),
        react_1.default.createElement(Form, null,
            react_1.default.createElement(CongitoExternalUserLogin_1.default, { callbackLogin: callbackLogin }))));
};
exports.CognitoAuth = CognitoAuth;
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
  margin: 0 10px;
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
//# sourceMappingURL=CognitoAuth.js.map