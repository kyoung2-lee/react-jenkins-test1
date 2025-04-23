import React from "react";
import Header from "./Header";
import OalFlightScheduleContainer from "../organisms/OalFlightSchedule";

const OalFlightSchedule: React.FC = () => {
  document.title = "OAL Schedule";
  return (
    <>
      <Header />
      <OalFlightScheduleContainer />
    </>
  );
};

export default OalFlightSchedule;
