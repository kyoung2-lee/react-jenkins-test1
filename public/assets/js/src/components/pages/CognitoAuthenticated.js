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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const commonConst_1 = require("../../lib/commonConst");
const CognitoToken_1 = require("../../lib/Cognito/CognitoToken");
const CognitoAuthenticated = (props) => {
    const history = (0, react_router_dom_1.useHistory)();
    const { pathname } = window.location;
    const { children } = props;
    const [existsToken, setExistsToken] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const checkAuth = async () => {
            if (window.webkit) {
                setExistsToken(true);
                return;
            }
            const token = await CognitoToken_1.cognitoToken.getToken();
            if (!token) {
                setExistsToken(false);
                console.error("Cognito authentication is required。");
                history.push(commonConst_1.Const.PATH_NAME.cognitoAuth);
                return;
            }
            setExistsToken(true);
        };
        void checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);
    return existsToken ? react_1.default.createElement(react_1.default.Fragment, null, children) : null;
};
exports.default = CognitoAuthenticated;
//# sourceMappingURL=CognitoAuthenticated.js.map