/* eslint-disable import/no-cycle */
import { Middleware } from "redux";
import loggerMiddleware from "redux-logger";
import { configureStore, combineReducers, isImmutableDefault } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { reducer as form } from "redux-form";
import { reducer as notifications } from "reapop";

import formErrors from "./middlewares/formErrors";
import common from "../reducers/common";
import account from "../reducers/account";
import address from "../reducers/address";
import dateTimeInputPopup from "../reducers/dateTimeInputPopup";
import editRmksPopup from "../reducers/editRmksPopup";
import airportRemarksPopup from "../reducers/airportRemarksPopup";
import flightNumberInputPopup from "../reducers/flightNumberInputPopup";
import fis from "../reducers/fis";
import fisFilterModal from "../reducers/fisFilterModal";
import barChart from "../reducers/barChart";
import barChartSearch from "../reducers/barChartSearch";
import broadcast from "../reducers/broadcast";
import flightSearch from "../reducers/flightSearch";
import flightListModals from "../reducers/flightListModals";
import shipTransitListModals from "../reducers/shipTransitListModals";
import userSetting from "../reducers/userSetting";
import issueSecurity from "../reducers/issueSecurity";
import bulletinBoard from "../reducers/bulletinBoard";
import flightModals from "../reducers/flightModals";
import flightContents from "../reducers/flightContents";
import lightbox from "../reducers/lightbox";
import flightMovementModal from "../reducers/flightMovementModal";
import multipleFlightMovementModals from "../reducers/multipleFlightMovementModals";
import mvtMsgModal from "../reducers/mvtMsgModal";
import oalFlightSchedule from "../reducers/oalFlightSchedule";
import bulletinBoardResponseEditorModal from "../reducers/bulletinBoardResponseEditorModal";
import bulletinBoardAddressModal from "../reducers/bulletinBoardAddressModal";
import bulletinBoardReactionRegistPopup from "../reducers/bulletinBoardReactionRegistPopup";
import flightBulletinBoard from "../reducers/flightBulletinBoard";
import oalAircraft from "../reducers/oalAircraft";
import oalPax from "../reducers/oalPax";
import oalPaxStatus from "../reducers/oalPaxStatus";
import spotNumber from "../reducers/spotNumber";
import oalFuel from "../reducers/oalFuel";
import spotFilterModal from "../reducers/spotFilterModal";
import storageOfUser from "../reducers/storageOfUser";
import mySchedule from "../reducers/mySchedule";
import spotNumberRestrictionPopup from "../reducers/spotNumberRestrictionPopup";

// notificationsのためにcombineReducersを使用した
const reducer = combineReducers({
  form,
  notifications: notifications(),
  common,
  account,
  address,
  dateTimeInputPopup,
  editRmksPopup,
  airportRemarksPopup,
  flightNumberInputPopup,
  fis,
  fisFilterModal,
  barChart,
  barChartSearch,
  broadcast,
  flightSearch,
  flightListModals,
  shipTransitListModals,
  userSetting,
  issueSecurity,
  bulletinBoard,
  bulletinBoardResponseEditorModal,
  bulletinBoardAddressModal,
  bulletinBoardReactionRegistPopup,
  flightModals,
  flightContents,
  lightbox,
  flightMovementModal,
  multipleFlightMovementModals,
  mvtMsgModal,
  oalFlightSchedule,
  flightBulletinBoard,
  oalAircraft,
  oalPax,
  oalPaxStatus,
  spotNumber,
  oalFuel,
  spotFilterModal,
  storageOfUser,
  mySchedule,
  spotNumberRestrictionPopup,
});

const middleware: Middleware[] = [thunk, formErrors];
// redux-logger を開発環境でのみ使用する
if (process.env.NODE_ENV === "development") {
  middleware.push(loggerMiddleware as Middleware);
}

// react-dropzoneで使われるFileオブジェクトは、内容が変更されていなくても変更されたと認識されることがあるため、不変性チェックの対象外とする
const isImmutable = (value: unknown): boolean => isImmutableDefault(value) || value instanceof File;

const getConfigureStore = () =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: {
          isImmutable,
        },
        serializableCheck: false,
      }).concat(middleware),
  });

const store = getConfigureStore();

export default store;
