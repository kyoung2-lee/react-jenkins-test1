import React from "react";

import Header from "./Header";
import MyScheduleContainer from "../organisms/MySchedule";
import CommonSubHeader from "../organisms/CommonSubHeader";
import { storage } from "../../lib/storage";

const { isPc } = storage;
class MySchedule extends React.Component {
  render() {
    document.title = "My Schedule";
    return (
      <>
        <Header isDarkMode={false} />
        {isPc ? null : <CommonSubHeader isDarkMode={false} />}
        <MyScheduleContainer />
      </>
    );
  }
}

export default MySchedule;
