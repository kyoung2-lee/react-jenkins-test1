import React from "react";
import Header from "./Header";
import WebPageContainer from "../organisms/WebPage";
import { ServerConfig } from "../../../config/config";

const Help: React.FC = () => {
  document.title = "Help";
  return (
    <>
      <Header />
      <WebPageContainer url={ServerConfig.HELP_URL} />
    </>
  );
};

export default Help;
