import React, { useEffect } from "react";
import Header from "./Header";
import { useAppSelector } from "../../store/hooks";
import { storage } from "../../lib/storage";
import { storageOfUser } from "../../lib/StorageOfUser";
import BarChartContainer from "../organisms/BarChart/BarChart";
import CommonSubHeader from "../organisms/CommonSubHeader";

const { isPc } = storage;

const BarChart: React.FC = () => {
  const apoCd = useAppSelector((state) => state.common.headerInfo.apoCd);

  // ストレージの自動更新中の画面を削除
  const pushCounterDowun = () => {
    const { pageStamp } = storage;
    if (pageStamp) {
      storageOfUser.removePushCounter({ type: "barChart", pageStamp });
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
      document.title = `Barchart - ${apoCd}`;
    } else {
      document.title = "Barchart";
    }
  }, [apoCd]);

  return (
    <>
      <Header />
      {storage.isPc ? null : <CommonSubHeader isDarkMode={false} />}
      <BarChartContainer />
    </>
  );
};

export default BarChart;
