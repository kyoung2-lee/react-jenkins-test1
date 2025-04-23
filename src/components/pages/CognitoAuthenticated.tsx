import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Const } from "../../lib/commonConst";
import { cognitoToken } from "../../lib/Cognito/CognitoToken";

interface Props {
  children: (false | JSX.Element)[];
}

const CognitoAuthenticated: React.FC<Props> = (props) => {
  const history = useHistory();
  const { pathname } = window.location;
  const { children } = props;
  const [existsToken, setExistsToken] = useState<boolean | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      if (window.webkit) {
        setExistsToken(true);
        return;
      }
      const token = await cognitoToken.getToken();
      if (!token) {
        setExistsToken(false);
        console.error("Cognito authentication is required。");
        history.push(Const.PATH_NAME.cognitoAuth);
        return;
      }
      setExistsToken(true);
    };
    void checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return existsToken ? <>{children}</> : null;
};

export default CognitoAuthenticated;
