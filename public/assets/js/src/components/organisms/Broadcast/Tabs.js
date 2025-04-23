"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const commonUtil_1 = require("../../../lib/commonUtil");
const storage_1 = require("../../../lib/storage");
const RoundButtonReload_1 = __importDefault(require("../../atoms/RoundButtonReload"));
const Tabs = (props) => {
    const { isBbActive, isEmailActive, isTtyActive, isAftnActive, isNotificationActive, isAcarsActive, onClickBb, onClickEmail, onClickTty, onClickAftn, onClickNotification, onClickAcars, emailDisabled, ttyDisabled, aftnDisabled, notificationDisabled, acarsDisabled, reloadButtonDisabled, onClickReload, isFetching, myApoCd, } = props;
    const { apoTimeLcl, apoTimeDiffUtc } = (0, hooks_1.useAppSelector)((state) => state.common.headerInfo);
    const { canManageBb, canManageEmail, canManageTty, canManageAftn, canManageNotification, canManageAcars } = (0, hooks_1.useAppSelector)((state) => state.broadcast.Broadcast);
    const { isPc } = storage_1.storage;
    const parsedTimeLcl = (0, commonUtil_1.parseTimeLcl)({ timeLcl: apoTimeLcl, timeDiffUtc: apoTimeDiffUtc, isLocal: !!myApoCd });
    return (react_1.default.createElement(TabContainer, null,
        canManageBb ? (react_1.default.createElement(Tab, { isActive: isBbActive, onClick: onClickBb }, "B.B.")) : null,
        canManageEmail ? (react_1.default.createElement(Tab, { isActive: isEmailActive, onClick: onClickEmail, disabled: emailDisabled }, "e-mail")) : null,
        canManageTty ? (react_1.default.createElement(Tab, { isActive: isTtyActive, onClick: onClickTty, disabled: ttyDisabled }, "TTY")) : null,
        canManageAftn ? (react_1.default.createElement(Tab, { isActive: isAftnActive, onClick: onClickAftn, disabled: aftnDisabled }, "AFTN")) : null,
        canManageNotification ? (react_1.default.createElement(Tab, { isActive: isNotificationActive, onClick: onClickNotification, disabled: notificationDisabled, fontSize: 15 }, "Notification")) : null,
        canManageAcars ? (react_1.default.createElement(Tab, { isActive: isAcarsActive, onClick: onClickAcars, disabled: acarsDisabled }, "ACARS")) : null,
        react_1.default.createElement(UpdatedTime, { isPc: isPc },
            react_1.default.createElement("span", null, parsedTimeLcl.date),
            react_1.default.createElement("span", null, parsedTimeLcl.time)),
        reloadButtonDisabled ? null : (react_1.default.createElement(ReloadButtonContainer, { isPc: isPc },
            react_1.default.createElement(RoundButtonReload_1.default, { tabIndex: 10, isFetching: isFetching, disabled: reloadButtonDisabled, onClick: onClickReload })))));
};
const TabContainer = styled_components_1.default.div `
  position: absolute;
  width: 100%;
  z-index: 3;
  display: flex;

  > div:nth-of-type(n + 2) {
    border-left: none;
  }
`;
const Tab = styled_components_1.default.div `
  width: 120px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #595857;
  border-bottom: 1px solid
    ${(props) => (props.isActive && !props.disabled ? "#fff" : props.isActive && props.disabled ? "#C9D3D0" : "#595857")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  background: ${(props) => (props.disabled || !props.isActive ? "#C9D3D0" : "#fff")};
  color: #346181;
  box-shadow: ${(props) => (props.isActive ? "1px -1px 1px rgba(0,0,0,0.1)" : "none")};
  z-index: ${(props) => (props.isActive ? "1" : "0")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "16px")};
`;
const UpdatedTime = styled_components_1.default.div `
  margin: auto;
  margin-right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 14px;
  padding-left: 10px;
`;
const ReloadButtonContainer = styled_components_1.default.div `
  margin: -3px 0 auto 6px;
  > button {
    width: 42px;
    height: 42px;
    border-radius: 23px;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;
exports.default = Tabs;
//# sourceMappingURL=Tabs.js.map