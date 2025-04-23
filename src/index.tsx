import "regenerator-runtime/runtime";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import arraySupport from "dayjs/plugin/arraySupport";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import store from "./store/store";

// dayjsのGlobal設定
dayjs.locale("en");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(arraySupport);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

// スマホとそれ以外でviewportの設定を変える
const meta = document.createElement("meta");
meta.setAttribute("name", "viewport");

if (navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("Android") > 0) {
  meta.setAttribute("content", "width=device-width,user-scalable=no,maximum-scale=1.0");
} else {
  meta.setAttribute("content", "width=1024,user-scalable=no,maximum-scale=1.0");
}

document.getElementsByTagName("head")[0].appendChild(meta);

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("content")
  );
};

render();
