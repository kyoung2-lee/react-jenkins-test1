import React from "react";

import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import Header from "./Header";
import FlightSearchContainer from "../organisms/FlightSearch";
import SPFlightSearch from "../organisms/SmartPhone/SPFlightSearch/SPFlightSearch";

const FlightSearch: React.FC = () => {
  document.title = "Flight Search";
  return (
    <>
      <Header />
      {storage.terminalCat === Const.TerminalCat.iPhone ? <SPFlightSearch /> : <FlightSearchContainer />}
    </>
  );
};

export default FlightSearch;
