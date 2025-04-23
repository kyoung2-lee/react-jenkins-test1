import React from "react";
import Header from "./Header";
import IssueSecurityContainer from "../organisms/IssueSecurity";

const IssueSecurity: React.FC = () => {
  document.title = "Airport Issue";
  return (
    <>
      <Header />
      <IssueSecurityContainer />
    </>
  );
};

export default IssueSecurity;
