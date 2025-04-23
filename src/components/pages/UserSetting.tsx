import React from "react";
import Header from "./Header";
import UserSettingContainer from "../organisms/UserSetting";

const UserSetting: React.FC = () => {
  document.title = "User Setting";
  return (
    <>
      <Header />
      <UserSettingContainer />
    </>
  );
};

export default UserSetting;
