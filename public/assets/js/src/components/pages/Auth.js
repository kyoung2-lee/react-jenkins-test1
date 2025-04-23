"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const reapop_1 = __importStar(require("reapop"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const EditRmksPopup_1 = __importDefault(require("../organisms/EditRmksPopup"));
const FisFilterModal_1 = __importDefault(require("../organisms/FisFilterModal"));
const FlightListModals_1 = __importDefault(require("../organisms/FlightListModals"));
const FlightNumberInputPopup_1 = __importDefault(require("../organisms/FlightNumberInputPopup"));
const Loading_1 = __importDefault(require("../organisms/Loading"));
const OalPax_1 = __importDefault(require("../organisms/OalPax"));
const OalPaxStatus_1 = __importDefault(require("../organisms/OalPaxStatus"));
const OalAircraft_1 = __importDefault(require("../organisms/OalAircraft"));
const ScreenMask_1 = __importDefault(require("../organisms/ScreenMask"));
const ShipTransitListModals_1 = __importDefault(require("../organisms/ShipTransitListModals"));
const SPCommonFooter_1 = __importDefault(require("../organisms/SmartPhone/SPCommonFooter/SPCommonFooter"));
const SpotNumberModal_1 = __importDefault(require("../organisms/SpotNumberModal"));
const SpotNumberModeless_1 = __importDefault(require("../organisms/SpotNumberModeless"));
const DateTimeInputPopup_1 = __importDefault(require("../organisms/DateTimeInputPopup"));
const FlightModals_1 = __importDefault(require("../organisms/FlightModals"));
const Lightbox_1 = __importDefault(require("../molecules/Lightbox"));
const BulletinBoardAddressModal_1 = require("../molecules/BulletinBoardAddressModal");
const FlightMovementModal_1 = __importDefault(require("../organisms/FlightMovementModal/FlightMovementModal"));
const MvtMsgModal_1 = __importDefault(require("../organisms/MvtMsgModal"));
const OalFuel_1 = __importDefault(require("../organisms/OalFuel"));
const SpotNumberRestrictionPopup_1 = __importDefault(require("../organisms/SpotNumberRestrictionPopup"));
const Auth = (props) => {
    const { children, onClickBb } = props;
    const dispatch = (0, hooks_1.useAppDispatch)();
    const notifications = (0, hooks_1.useAppSelector)((state) => state.notifications);
    return storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone ? (react_1.default.createElement(Wrapper, null,
        children,
        react_1.default.createElement(SPCommonFooter_1.default, { onClickBb: onClickBb }),
        react_1.default.createElement(FisFilterModal_1.default, null),
        react_1.default.createElement(FlightNumberInputPopup_1.default, null),
        react_1.default.createElement(FlightListModals_1.default, null),
        react_1.default.createElement(ShipTransitListModals_1.default, null),
        react_1.default.createElement(DateTimeInputPopup_1.default, null),
        react_1.default.createElement(EditRmksPopup_1.default, null),
        react_1.default.createElement(Loading_1.default, null),
        react_1.default.createElement(reapop_1.default, { notifications: notifications, dismissNotification: (id) => dispatch((0, reapop_1.dismissNotification)(id)), theme: reapop_1.wyboTheme, smallScreenBreakpoint: 1 }),
        react_1.default.createElement(ScreenMask_1.default, null),
        react_1.default.createElement(FlightModals_1.default, null),
        react_1.default.createElement(Lightbox_1.default, null),
        react_1.default.createElement(BulletinBoardAddressModal_1.BulletinBoardAddressModal, null),
        react_1.default.createElement(FlightMovementModal_1.default, null))) : (react_1.default.createElement(Wrapper, null,
        children,
        react_1.default.createElement(FisFilterModal_1.default, null),
        react_1.default.createElement(FlightNumberInputPopup_1.default, null),
        react_1.default.createElement(FlightListModals_1.default, null),
        react_1.default.createElement(ShipTransitListModals_1.default, null),
        react_1.default.createElement(DateTimeInputPopup_1.default, null),
        react_1.default.createElement(EditRmksPopup_1.default, null),
        react_1.default.createElement(Loading_1.default, null),
        react_1.default.createElement(reapop_1.default, { notifications: notifications, dismissNotification: (id) => dispatch((0, reapop_1.dismissNotification)(id)), theme: reapop_1.wyboTheme, smallScreenBreakpoint: 1 }),
        react_1.default.createElement(ScreenMask_1.default, null),
        react_1.default.createElement(FlightModals_1.default, null),
        react_1.default.createElement(Lightbox_1.default, null),
        react_1.default.createElement(BulletinBoardAddressModal_1.BulletinBoardAddressModal, null),
        react_1.default.createElement(FlightMovementModal_1.default, null),
        react_1.default.createElement(MvtMsgModal_1.default, null),
        react_1.default.createElement(OalPax_1.default, null),
        react_1.default.createElement(OalPaxStatus_1.default, null),
        react_1.default.createElement(SpotNumberModal_1.default, null),
        react_1.default.createElement(SpotNumberModeless_1.default, null),
        react_1.default.createElement(OalAircraft_1.default, null),
        react_1.default.createElement(OalFuel_1.default, null),
        react_1.default.createElement(SpotNumberRestrictionPopup_1.default, null)));
};
const Wrapper = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  height: 100%;
`;
exports.default = Auth;
//# sourceMappingURL=Auth.js.map