import React from "react";
import styled from "styled-components";
import ScreenMask from "../organisms/ScreenMask";
import Loading from "../organisms/Loading";
import CognitoAuthContainer from "../organisms/CognitoAuth";

const CognitoAuth = () => (
  <Wrapper>
    <CognitoAuthContainer />
    <ScreenMask />
    <Loading />
  </Wrapper>
);

const Wrapper = styled.div`
  background: #fff;
`;

export default CognitoAuth;
