"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const InternalUserLogin_1 = require("../../lib/Cognito/InternalUserLogin");
const commonConst_1 = require("../../lib/commonConst");
const CognitoRedirect = () => {
    const history = (0, react_router_dom_1.useHistory)();
    const query = (0, react_router_dom_1.useLocation)().search;
    (0, react_1.useEffect)(() => {
        const getCognitoToken = async () => {
            const isSuccess = await InternalUserLogin_1.internalUserLogin.getCognitoToken(query);
            history.push(isSuccess ? commonConst_1.Const.PATH_NAME.jobAuth : commonConst_1.Const.PATH_NAME.cognitoAuth);
        };
        void getCognitoToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
};
exports.default = CognitoRedirect;
//# sourceMappingURL=CognitoRedirect.js.map