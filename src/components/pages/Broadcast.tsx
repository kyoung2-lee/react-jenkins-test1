import queryString from "query-string";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import BroadcastContainer from "../organisms/Broadcast/Broadcast";

interface ParsedQuery {
  id?: string;
  archive?: boolean;
  from?: string;
}

const Broadcast: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Broadcast";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const qs = queryString.parse(location.search, { parseBooleans: true }) as ParsedQuery;
  // eslint-disable-next-line no-restricted-globals
  const bbId = isFinite(Number(qs.id)) ? Number(qs.id) : undefined;
  const archiveFlg = qs.archive;
  const from = qs.from as React.ComponentProps<typeof BroadcastContainer>["from"];
  return (
    <>
      <Header />
      <BroadcastContainer {...{ bbId, archiveFlg, from }} />
    </>
  );
};

export default Broadcast;
