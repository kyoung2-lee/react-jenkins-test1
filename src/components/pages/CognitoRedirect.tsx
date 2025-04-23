import React from "react";
import Loading from "../organisms/Loading";
import CognitoRedirectContainer from "../organisms/CognitoRedirect";
import ScreenMask from "../organisms/ScreenMask";

const CognitoRedirect = () => (
  <>
    <CognitoRedirectContainer />
    <ScreenMask />
    <Loading />
  </>
);

export default CognitoRedirect;
