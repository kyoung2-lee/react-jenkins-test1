import React from "react";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import CommonHeader from "../organisms/CommonHeader";
import SPCommonHeader from "../organisms/SmartPhone/SPCommonHeader/SPCommonHeader";

const Header: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = false }) =>
  storage.terminalCat === Const.TerminalCat.iPhone ? <SPCommonHeader /> : <CommonHeader isDarkMode={isDarkMode} />;

export default Header;
