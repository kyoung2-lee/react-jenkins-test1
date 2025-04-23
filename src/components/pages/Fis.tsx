import React, { useEffect } from "react";
import useScrollbarSize from "react-scrollbar-size";
import { ThemeProvider } from "styled-components";
import Header from "./Header";
import { useAppSelector } from "../../store/hooks";
import { storage } from "../../lib/storage";
import { storageOfUser } from "../../lib/StorageOfUser";
import CommonSubHeader from "../organisms/CommonSubHeader";
import FisTable from "../organisms/FisTable";
import darkTheme from "../../themes/themeDark";
import lightTheme from "../../themes/themeLight";

const { isPc } = storage;

const Fis: React.FC = () => {
  const apoCd = useAppSelector((state) => state.common.headerInfo.apoCd);
  const isDarkMode = useAppSelector((state) => state.account.isDarkMode);
  const scrollbarWidth = useScrollbarSize().width;

  // ストレージの自動更新中の画面を削除
  const pushCounterDowun = () => {
    const { pageStamp } = storage;
    if (pageStamp) {
      storageOfUser.removePushCounter({ type: "fis", pageStamp });
    }
  };

  useEffect(() => {
    // ブラウザクローズ時、自動更新中の画面を削除
    if (isPc) window.addEventListener("beforeunload", pushCounterDowun); // イベントを追加
    return () => {
      if (isPc) window.removeEventListener("beforeunload", pushCounterDowun); // イベントを削除
    };
  }, []);

  useEffect(() => {
    if (apoCd) {
      document.title = `FIS - ${apoCd}`;
    } else {
      document.title = "FIS";
    }
  }, [apoCd]);

  return (
    <ThemeProvider theme={isPc && isDarkMode ? darkTheme : lightTheme}>
      <>
        <Header isDarkMode={isPc && isDarkMode} />
        {isPc ? null : <CommonSubHeader isDarkMode={isPc && isDarkMode} />}
        <FisTable isDarkMode={isPc && isDarkMode} scrollbarWidth={scrollbarWidth} />
      </>
    </ThemeProvider>
  );
};

export default Fis;
