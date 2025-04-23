"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const lodash_uniq_1 = __importDefault(require("lodash.uniq"));
const hooks_1 = require("../../store/hooks");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const oalFlightSchedule_1 = require("../../reducers/oalFlightSchedule");
const OalFlightScheduleSearch_1 = __importDefault(require("../molecules/OalFlightSchedule/OalFlightScheduleSearch"));
const OalFlightScheduleList_1 = __importDefault(require("../molecules/OalFlightSchedule/OalFlightScheduleList"));
const RoundButtonMode_1 = __importDefault(require("../atoms/RoundButtonMode"));
const RoundButtonPlusFlt_1 = __importDefault(require("../atoms/RoundButtonPlusFlt"));
const OalFlightSchedule = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const oalFlightScheduleState = (0, hooks_1.useAppSelector)((state) => state.oalFlightSchedule);
    const master = (0, hooks_1.useAppSelector)((state) => state.account.master);
    const isEdited = () => {
        const { fltScheduleList } = oalFlightScheduleState;
        const editedFltIndexes = (0, lodash_uniq_1.default)(fltScheduleList.filter((flt) => flt.rowStatus === "Edited").map((f) => f.fltIndex));
        return editedFltIndexes.some((fltIndex) => !fltScheduleList.some((f) => f.fltIndex === fltIndex && ((f.rowStatus === "Error" && f.chgType !== "") || f.rowStatus === "Failed")));
    };
    const isAllUpdated = () => {
        if (oalFlightScheduleState.fltScheduleList.find((f) => !!f.rowStatus && f.rowStatus !== "Updated" && f.rowStatus !== "Skipped")) {
            return false;
        }
        return true;
    };
    const handleClickAdd = async () => {
        await dispatch((0, oalFlightSchedule_1.fltListInsert)());
        dispatch((0, oalFlightSchedule_1.setInputModal)({ isOpenInputModal: true, inputRowIndex: 0, inputChgType: "ADD FLT", inputNewRow: true }));
    };
    const handleClickMode = () => {
        dispatch((0, oalFlightSchedule_1.switchUtc)({ isUtc: !oalFlightScheduleState.isUtc }));
    };
    const apoOptions = master.airports.map((airport) => ({ value: airport.apoCd, label: airport.apoCd }));
    const flightStsOptions = master.cdCtrlDtls
        .filter((c) => c.cdCls === "029")
        .sort((a, b) => a.num1 - b.num1)
        .map((c) => ({ value: c.cdCat1, label: c.cdCat1 }));
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(ModeButtonContainer, { isPc: storage_1.storage.isPc },
            react_1.default.createElement(RoundButtonPlusFlt_1.default, { onClick: () => {
                    void handleClickAdd();
                }, tabIndex: 100 }),
            react_1.default.createElement(RoundButtonMode_1.default, { isActiveColor: oalFlightScheduleState.isUtc, onClick: handleClickMode, disabled: !isAllUpdated(), tabIndex: 110 })),
        react_1.default.createElement(exports.Content, { disabled: false, isPc: storage_1.storage.isPc, isActive: true },
            react_1.default.createElement(OalFlightScheduleSearch_1.default, { apoOptions: apoOptions, isEdited: isEdited() }),
            react_1.default.createElement(ListContainer, { isPc: storage_1.storage.isPc },
                react_1.default.createElement(OalFlightScheduleList_1.default, { apoOptions: apoOptions, flightStsOptions: flightStsOptions, isEdited: isEdited() })))));
};
const Wrapper = styled_components_1.default.div `
  width: 100%;
  max-width: ${commonConst_1.Const.MAX_WIDTH};
  min-width: 100vw;
  overflow-x: auto;
  overflow-y: hidden;
  margin: 0 auto;
  padding: 52px 8px 0 8px;
  background-color: #fff;
  font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
`;
const ModeButtonContainer = styled_components_1.default.div `
  position: absolute;
  display: flex;
  top: calc(${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} + 5px);
  right: 100px;
  z-index: 4;
  transform-origin: top right;
  transform: scale(0.7);
  button {
    margin-left: 14px;
  }
`;
exports.Content = styled_components_1.default.div `
  position: relative;
  z-index: ${({ isActive }) => (isActive ? "2" : "1")};
  width: 100%;
  height: calc(100vh - ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} - 44px - 16px);
  overflow-x: hidden;
  overflow-y: auto;
  padding: 6px 6px 0 6px;
  margin-top: -1px;
  border: 1px solid #595857;
  background: ${(props) => (props.disabled ? "#C9D3D0" : "#FFF")};
`;
const ListContainer = styled_components_1.default.div `
  margin-top: 4px;
  width: 100%;
  height: calc(
    100vh - ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} - 44px - 16px - 60px - 6px - 8px
  );
`;
exports.default = OalFlightSchedule;
//# sourceMappingURL=OalFlightSchedule.js.map