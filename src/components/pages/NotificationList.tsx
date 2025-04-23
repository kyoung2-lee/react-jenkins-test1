import React from "react";
import Header from "./Header";
import NotificationListContainer from "../organisms/NotificationList";

const NotificationList: React.FC = () => {
  document.title = "Notification";
  return (
    <>
      <Header />
      <NotificationListContainer />
    </>
  );
};

export default NotificationList;
