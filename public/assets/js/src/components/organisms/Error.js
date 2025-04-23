"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("../../store/hooks");
const commonConst_1 = require("../../lib/commonConst");
const config_1 = require("../../../config/config");
const common_1 = require("../../reducers/common");
const logo_png_1 = __importDefault(require("../../assets/images/logo.png"));
const login_bg_jpg_1 = __importDefault(require("../../assets/images/login-bg.jpg"));
const Error = () => {
    const location = (0, react_router_dom_1.useLocation)();
    const history = (0, react_router_dom_1.useHistory)();
    const dispatch = (0, hooks_1.useAppDispatch)();
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const submit = () => {
        const { forceGoToErrorPath } = common;
        if (forceGoToErrorPath === commonConst_1.Const.PATH_NAME.jobAuth) {
            window.open(config_1.ServerConfig.USER_LOGIN_URL, "_top");
        }
        else {
            void dispatch((0, common_1.screenTransition)({ from: location.pathname, to: forceGoToErrorPath }));
            history.push(forceGoToErrorPath);
        }
    };
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Form, null,
            react_1.default.createElement(Logo, null),
            react_1.default.createElement(Message, null,
                react_1.default.createElement("p", null, "An error occurred."),
                react_1.default.createElement("p", null, "Please login again.")),
            react_1.default.createElement(SubmitButtonContainer, { onClick: submit, type: "submit" }, common.forceGoToErrorPath === commonConst_1.Const.PATH_NAME.jobAuth ? "Logout" : "Mypage"))));
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
  height: 587px;
  padding: 60px 50px;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
`;
const Message = styled_components_1.default.div `
  font-size: 20px;
  color: #346181;
`;
const SubmitButtonContainer = styled_components_1.default.button `
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
const Logo = styled_components_1.default.img.attrs({ src: logo_png_1.default }) `
  width: 154px;
`;
exports.default = Error;
//# sourceMappingURL=Error.js.map