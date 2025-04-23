import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { internalUserLogin } from "../../lib/Cognito/InternalUserLogin";
import { Const } from "../../lib/commonConst";

const CognitoRedirect: React.FC = () => {
  const history = useHistory();
  const query = useLocation().search;

  useEffect(() => {
    const getCognitoToken = async () => {
      const isSuccess = await internalUserLogin.getCognitoToken(query);
      history.push(isSuccess ? Const.PATH_NAME.jobAuth : Const.PATH_NAME.cognitoAuth);
    };
    void getCognitoToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default CognitoRedirect;
