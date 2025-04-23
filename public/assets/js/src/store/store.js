"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_logger_1 = __importDefault(require("redux-logger"));
const toolkit_1 = require("@reduxjs/toolkit");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const redux_form_1 = require("redux-form");
const reapop_1 = require("reapop");
const formErrors_1 = __importDefault(require("./middlewares/formErrors"));
const common_1 = __importDefault(require("../reducers/common"));
const account_1 = __importDefault(require("../reducers/account"));
const address_1 = __importDefault(require("../reducers/address"));
const dateTimeInputPopup_1 = __importDefault(require("../reducers/dateTimeInputPopup"));
const editRmksPopup_1 = __importDefault(require("../reducers/editRmksPopup"));
const airportRemarksPopup_1 = __importDefault(require("../reducers/airportRemarksPopup"));
const flightNumberInputPopup_1 = __importDefault(require("../reducers/flightNumberInputPopup"));
const fis_1 = __importDefault(require("../reducers/fis"));
const fisFilterModal_1 = __importDefault(require("../reducers/fisFilterModal"));
const barChart_1 = __importDefault(require("../reducers/barChart"));
const barChartSearch_1 = __importDefault(require("../reducers/barChartSearch"));
const broadcast_1 = __importDefault(require("../reducers/broadcast"));
const flightSearch_1 = __importDefault(require("../reducers/flightSearch"));
const flightListModals_1 = __importDefault(require("../reducers/flightListModals"));
const shipTransitListModals_1 = __importDefault(require("../reducers/shipTransitListModals"));
const userSetting_1 = __importDefault(require("../reducers/userSetting"));
const issueSecurity_1 = __importDefault(require("../reducers/issueSecurity"));
const bulletinBoard_1 = __importDefault(require("../reducers/bulletinBoard"));
const flightModals_1 = __importDefault(require("../reducers/flightModals"));
const flightContents_1 = __importDefault(require("../reducers/flightContents"));
const lightbox_1 = __importDefault(require("../reducers/lightbox"));
const flightMovementModal_1 = __importDefault(require("../reducers/flightMovementModal"));
const multipleFlightMovementModals_1 = __importDefault(require("../reducers/multipleFlightMovementModals"));
const mvtMsgModal_1 = __importDefault(require("../reducers/mvtMsgModal"));
const oalFlightSchedule_1 = __importDefault(require("../reducers/oalFlightSchedule"));
const bulletinBoardResponseEditorModal_1 = __importDefault(require("../reducers/bulletinBoardResponseEditorModal"));
const bulletinBoardAddressModal_1 = __importDefault(require("../reducers/bulletinBoardAddressModal"));
const bulletinBoardReactionRegistPopup_1 = __importDefault(require("../reducers/bulletinBoardReactionRegistPopup"));
const flightBulletinBoard_1 = __importDefault(require("../reducers/flightBulletinBoard"));
const oalAircraft_1 = __importDefault(require("../reducers/oalAircraft"));
const oalPax_1 = __importDefault(require("../reducers/oalPax"));
const oalPaxStatus_1 = __importDefault(require("../reducers/oalPaxStatus"));
const spotNumber_1 = __importDefault(require("../reducers/spotNumber"));
const oalFuel_1 = __importDefault(require("../reducers/oalFuel"));
const spotFilterModal_1 = __importDefault(require("../reducers/spotFilterModal"));
const storageOfUser_1 = __importDefault(require("../reducers/storageOfUser"));
const mySchedule_1 = __importDefault(require("../reducers/mySchedule"));
const spotNumberRestrictionPopup_1 = __importDefault(require("../reducers/spotNumberRestrictionPopup"));
// notificationsのためにcombineReducersを使用した
const reducer = (0, toolkit_1.combineReducers)({
    form: redux_form_1.reducer,
    notifications: (0, reapop_1.reducer)(),
    common: common_1.default,
    account: account_1.default,
    address: address_1.default,
    dateTimeInputPopup: dateTimeInputPopup_1.default,
    editRmksPopup: editRmksPopup_1.default,
    airportRemarksPopup: airportRemarksPopup_1.default,
    flightNumberInputPopup: flightNumberInputPopup_1.default,
    fis: fis_1.default,
    fisFilterModal: fisFilterModal_1.default,
    barChart: barChart_1.default,
    barChartSearch: barChartSearch_1.default,
    broadcast: broadcast_1.default,
    flightSearch: flightSearch_1.default,
    flightListModals: flightListModals_1.default,
    shipTransitListModals: shipTransitListModals_1.default,
    userSetting: userSetting_1.default,
    issueSecurity: issueSecurity_1.default,
    bulletinBoard: bulletinBoard_1.default,
    bulletinBoardResponseEditorModal: bulletinBoardResponseEditorModal_1.default,
    bulletinBoardAddressModal: bulletinBoardAddressModal_1.default,
    bulletinBoardReactionRegistPopup: bulletinBoardReactionRegistPopup_1.default,
    flightModals: flightModals_1.default,
    flightContents: flightContents_1.default,
    lightbox: lightbox_1.default,
    flightMovementModal: flightMovementModal_1.default,
    multipleFlightMovementModals: multipleFlightMovementModals_1.default,
    mvtMsgModal: mvtMsgModal_1.default,
    oalFlightSchedule: oalFlightSchedule_1.default,
    flightBulletinBoard: flightBulletinBoard_1.default,
    oalAircraft: oalAircraft_1.default,
    oalPax: oalPax_1.default,
    oalPaxStatus: oalPaxStatus_1.default,
    spotNumber: spotNumber_1.default,
    oalFuel: oalFuel_1.default,
    spotFilterModal: spotFilterModal_1.default,
    storageOfUser: storageOfUser_1.default,
    mySchedule: mySchedule_1.default,
    spotNumberRestrictionPopup: spotNumberRestrictionPopup_1.default,
});
const middleware = [redux_thunk_1.default, formErrors_1.default];
// redux-logger を開発環境でのみ使用する
if (process.env.NODE_ENV === "development") {
    middleware.push(redux_logger_1.default);
}
// react-dropzoneで使われるFileオブジェクトは、内容が変更されていなくても変更されたと認識されることがあるため、不変性チェックの対象外とする
const isImmutable = (value) => (0, toolkit_1.isImmutableDefault)(value) || value instanceof File;
const getConfigureStore = () => (0, toolkit_1.configureStore)({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: {
            isImmutable,
        },
        serializableCheck: false,
    }).concat(middleware),
});
const store = getConfigureStore();
exports.default = store;
//# sourceMappingURL=store.js.map