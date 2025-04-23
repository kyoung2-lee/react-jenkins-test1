import React from "react";
import Header from "./Header";
import WebPageContainer from "../organisms/WebPage";
import { ServerConfig } from "../../../config/config";

const MyPage: React.FC = () => {
  document.title = "SOALA";
  return (
    <>
      <Header />
      <WebPageContainer url={ServerConfig.MYPAGE_URL} />
    </>
  );
};

export default MyPage;
