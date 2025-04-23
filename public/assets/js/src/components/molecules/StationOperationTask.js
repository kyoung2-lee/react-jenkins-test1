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
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_findindex_1 = __importDefault(require("lodash.findindex"));
const lodash_findlastindex_1 = __importDefault(require("lodash.findlastindex"));
const hooks_1 = require("../../store/hooks");
const ProcessItem_1 = __importDefault(require("./ProcessItem"));
const commonUtil_1 = require("../../lib/commonUtil");
const storage_1 = require("../../lib/storage");
const profile_small_svg_1 = __importDefault(require("../../assets/images/account/profile_small.svg"));
const icon_system_svg_1 = __importDefault(require("../../assets/images/icon/icon-system.svg"));
const profile_small_blue_svg_1 = __importDefault(require("../../assets/images/account/profile_small_blue.svg"));
const arrow_down_svg_1 = __importDefault(require("../../assets/images/icon/arrow_down.svg"));
const StationOperationTask = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const workStepContentRefDefault = (0, react_1.useRef)(null);
    const workStepContentRef = props.workStepContentRef || workStepContentRefDefault;
    const workUserListContentRef = (0, react_1.useRef)(null);
    const processRowRef = (0, react_1.useRef)(null);
    const [isHideFooter, setIsHideFooter] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (workStepContentRef.current) {
            workStepContentRef.current.focus();
        }
        if (processRowRef.current && workStepContentRef.current) {
            processRowRef.current.focus();
            const contentHeight = workStepContentRef.current.clientHeight;
            const rowTop = processRowRef.current.offsetTop;
            const scrollPos = rowTop - contentHeight / 2;
            if (scrollPos > 0) {
                workStepContentRef.current.scrollTo(0, scrollPos);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const focusToWorkStepList = () => {
        if (workStepContentRef.current) {
            workStepContentRef.current.focus();
        }
        props.activeModal();
    };
    const memberListAcordion = () => {
        setIsHideFooter((prevIsHideFooter) => !prevIsHideFooter);
    };
    const focusToWorkUserList = () => {
        if (workUserListContentRef.current) {
            workUserListContentRef.current.focus();
        }
        props.activeModal();
    };
    const getCurrentWorkStepIndex = (workStepList) => {
        const lastIndexOfStandardEndFlg = (0, lodash_findlastindex_1.default)(workStepList, (w) => w.workStepType === "STRD" && w.workEndFlg);
        const currentIndexOfStandard = (0, lodash_findindex_1.default)(workStepList, (w) => w.workStepType === "STRD", lastIndexOfStandardEndFlg + 1);
        return currentIndexOfStandard;
    };
    const handleOpenDateTimeInputPopup = (currentDateTime, onUpdate) => {
        dispatch(props.openDateTimeInputPopup({
            valueFormat: "YYYY-MM-DD[T]HH:mm:ss",
            currentValue: currentDateTime,
            defaultSetting: "DeviceDate",
            onUpdate,
        }));
    };
    const getLocation = (workStepCd, actButtonFlg, // "0":時間手動登録 or 登録クリア(inputTimeがない場合)、"1":時間自動登録、"2":登録クリア
    inputTime) => {
        const { flightKey, updateStationOperationTask } = props;
        // ロケーションを取得し実行する
        (0, commonUtil_1.execWithLocationInfo)(({ posLat, posLon }) => {
            const postStationOperationTask = {
                orgDateLcl: flightKey.orgDateLcl,
                alCd: flightKey.alCd,
                fltNo: flightKey.fltNo,
                casFltNo: flightKey.casFltNo || "",
                skdDepApoCd: flightKey.skdDepApoCd,
                skdArrApoCd: flightKey.skdArrApoCd,
                skdLegSno: flightKey.skdLegSno,
                planUpdateFlg: false,
                oalTblFlg: flightKey.oalTblFlg,
                workStepCd,
                planWorkEndTimeLcl: undefined,
                actWorkEndTimeLcl: actButtonFlg === "0" && inputTime ? (0, dayjs_1.default)(inputTime).format("YYYYMMDDHHmm") : undefined,
                posLat,
                posLon,
                actButtonFlg,
                arrDepCd: "DEP",
            };
            void dispatch(updateStationOperationTask({ flightKey, postStationOperationTask }));
        });
    };
    const getLocationForPlan = (workStepCd, actButtonFlg, // "0":時間手動登録 or 登録クリア(inputTimeがない場合)、"1":時間自動登録、"2":登録クリア
    inputTime) => {
        const { flightKey, updateStationOperationTask } = props;
        // ロケーションを取得し実行する
        (0, commonUtil_1.execWithLocationInfo)(({ posLat, posLon }) => {
            const postStationOperationTask = {
                orgDateLcl: flightKey.orgDateLcl,
                alCd: flightKey.alCd,
                fltNo: flightKey.fltNo,
                casFltNo: flightKey.casFltNo || "",
                skdDepApoCd: flightKey.skdDepApoCd,
                skdArrApoCd: flightKey.skdArrApoCd,
                skdLegSno: flightKey.skdLegSno,
                planUpdateFlg: true,
                oalTblFlg: flightKey.oalTblFlg,
                workStepCd,
                planWorkEndTimeLcl: actButtonFlg === "0" && inputTime ? (0, dayjs_1.default)(inputTime).format("YYYYMMDDHHmm") : undefined,
                actWorkEndTimeLcl: undefined,
                posLat,
                posLon,
                actButtonFlg,
                arrDepCd: "DEP",
            };
            void dispatch(updateStationOperationTask({ flightKey, postStationOperationTask }));
        });
    };
    const { authEnabled, isOnline, stationOperationTask, flightKey } = props;
    const workStepList = stationOperationTask ? stationOperationTask.workStepList : [];
    const currentWorkStepIndex = getCurrentWorkStepIndex(workStepList);
    const endActualTimeIndex = (0, lodash_findlastindex_1.default)(workStepList, (w) => !!w.actWorkEndTimeLcl || w.workAutoEndFlg);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Contents, { isHideFooter: isHideFooter },
            react_1.default.createElement(InnerScroll, { tabIndex: -1, ref: workStepContentRef, onClick: focusToWorkStepList },
                react_1.default.createElement(ProcessBox, null,
                    react_1.default.createElement(SubHeader, { key: `StationOperationTaskSubHeader_${Date.now()}`, onClick: focusToWorkStepList },
                        react_1.default.createElement(ColumnTitle, null,
                            react_1.default.createElement(ActualTitle, null, "Actual"),
                            react_1.default.createElement(PlanTitle, null, "Plan"))),
                    workStepList.map((workStep, index) => {
                        const completed = !!workStep.workEndFlg;
                        const system = !!(workStep.workEndFlg && !workStep.workAutoEndFlg && !workStep.userId);
                        const current = currentWorkStepIndex === index;
                        const timeInputDisabled = !authEnabled || !isOnline;
                        let disabled;
                        let custom = false;
                        let timeInputTextBox = "-";
                        if (workStep.workStepType === "STRD") {
                            disabled = !!(!authEnabled || !isOnline || system);
                            if (!workStep.workAutoEndFlg) {
                                timeInputTextBox = workStep.actWorkEndTimeLcl && (0, dayjs_1.default)(workStep.actWorkEndTimeLcl).format("HHmm");
                            }
                        }
                        else if (workStep.workStepType === "ORGL") {
                            disabled = !authEnabled || !isOnline;
                            custom = true;
                            timeInputTextBox = workStep.actWorkEndTimeLcl && (0, dayjs_1.default)(workStep.actWorkEndTimeLcl).format("HHmm");
                        }
                        return (
                        // eslint-disable-next-line react/no-array-index-key
                        react_1.default.createElement(ProcessRow, { key: index, ref: endActualTimeIndex === index ? processRowRef : undefined },
                            react_1.default.createElement(ProcessCol, { workStepType: workStep.workStepType },
                                react_1.default.createElement(FluidProcessItem, { title: workStep.workStepName.replace("<br>", " "), custom: custom, completed: completed, current: current, disabled: disabled, onClick: disabled
                                        ? undefined
                                        : () => {
                                            const actButtonFlg = completed ? "2" : "1";
                                            getLocation(workStep.workStepCd, actButtonFlg);
                                        } })),
                            workStep.workStepType === "STRD" ? (react_1.default.createElement(PersonFace, null, system ? (react_1.default.createElement(SystemIcon, null)) : completed && !workStep.workAutoEndFlg && workStep.userId ? (workStep.profileImg ? (react_1.default.createElement("img", { src: `data:image/png;base64,${workStep.profileImg}`, alt: "" })) : (react_1.default.createElement(UserIcon, null))) : null)) : (react_1.default.createElement(PersonFace, null, completed ? (workStep.profileImg ? (react_1.default.createElement("img", { src: `data:image/png;base64,${workStep.profileImg}`, alt: "" })) : (react_1.default.createElement(UserIcon, null))) : null)),
                            react_1.default.createElement(ActualCol, null,
                                react_1.default.createElement(TimeInput, { workStepType: workStep.workStepType, disabled: timeInputDisabled, onClick: timeInputDisabled
                                        ? undefined
                                        : () => {
                                            handleOpenDateTimeInputPopup(workStep.actWorkEndTimeLcl, (dateTime) => getLocation(workStep.workStepCd, "0", dateTime));
                                        } }, timeInputTextBox)),
                            react_1.default.createElement(PlanCol, null,
                                react_1.default.createElement(TimeInput, { disabled: !authEnabled || !isOnline || !flightKey.oalTblFlg, onClick: !authEnabled || !isOnline || !flightKey.oalTblFlg
                                        ? undefined
                                        : () => {
                                            handleOpenDateTimeInputPopup(workStep.planWorkEndTimeLcl, (dateTime) => getLocationForPlan(workStep.workStepCd, "0", dateTime));
                                        } }, workStep.planWorkEndTimeLcl ? (0, dayjs_1.default)(workStep.planWorkEndTimeLcl).format("HHmm") : ""))));
                    })))),
        react_1.default.createElement(Footer, null,
            react_1.default.createElement(MemberBox, null,
                react_1.default.createElement(MemberListIcon, null),
                react_1.default.createElement(MemberListTitle, null, "Member"),
                react_1.default.createElement(ArrowBox, { onClick: memberListAcordion },
                    react_1.default.createElement(ArrowDownIcon, { isHideFooter: isHideFooter }))),
            react_1.default.createElement(SliderDox, { isPc: storage_1.storage.isPc, isHideFooter: isHideFooter, tabIndex: -1, onClick: focusToWorkUserList }, stationOperationTask &&
                stationOperationTask.workUserList.map((workUser, index) => (
                // eslint-disable-next-line react/no-array-index-key
                react_1.default.createElement(PersonCol, { key: index },
                    react_1.default.createElement(PersonFaceLarge, null, workUser.profileImg ? react_1.default.createElement("img", { src: `data:image/png;base64,${workUser.profileImg}`, alt: "" }) : react_1.default.createElement(UserIcon, null)),
                    workUser.appleId ? (react_1.default.createElement("a", { href: `facetime://${workUser.appleId}` },
                        react_1.default.createElement(PersonName, null,
                            workUser.firstName,
                            " ",
                            workUser.familyName),
                        react_1.default.createElement(PersonMeta, null, workUser.empNo),
                        react_1.default.createElement(PersonMeta, null,
                            workUser.grpCd,
                            "/",
                            workUser.jobCd))) : (react_1.default.createElement("div", null,
                        react_1.default.createElement(PersonName, null,
                            workUser.firstName,
                            " ",
                            workUser.familyName),
                        react_1.default.createElement(PersonMeta, null, workUser.empNo),
                        react_1.default.createElement(PersonMeta, null,
                            workUser.grpCd,
                            "/",
                            workUser.jobCd))))))))));
};
const SubHeader = styled_components_1.default.div `
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 1;
  padding: 8px 19px 4px 12px;
`;
const Contents = styled_components_1.default.div `
  height: calc(100% - ${({ isHideFooter }) => (isHideFooter ? "25px" : "161px")});
  margin-bottom: 2px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;
/* 行がスクロール枠を満たしていない場合も若干スクロールさせて裏がスクロールしないように */
const InnerScroll = styled_components_1.default.div `
  width: 100%;
  height: calc(100% + 1px);
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  padding-bottom: 105px;
`;
const ProcessRow = styled_components_1.default.div `
  display: flex;
  height: 40px;
  padding: 0 19px 0 12px;
  position: relative;
`;
const ProcessCol = styled_components_1.default.div `
  width: 176px;
`;
const ActualCol = styled_components_1.default.div `
  width: 64px;
  margin-left: 16px;
`;
const FluidProcessItem = (0, styled_components_1.default)(ProcessItem_1.default) `
  height: 100%;
  width: 100%;
  font-size: 17px;
`;
const PersonFace = styled_components_1.default.div `
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 20px;
  position: absolute;
  margin-top: 24px;
  margin-left: 148px;

  img {
    height: 24px;
    width: 24px;
    border-radius: 20px;
    object-fit: contain;
    box-shadow: 2px 2px 4px rgb(0 0 0 / 20%);
  }
`;
const PersonFaceLarge = styled_components_1.default.div `
  width: 50px;
  height: 50px;
  margin-bottom: 4px;
  margin-left: 20px;
  box-shadow: none;

  img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    object-fit: contain;
  }
`;
const TimeInput = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  border: ${(props) => (props.workStepType === "STRD" ? "2px" : "1px")} solid ${(props) => (props.disabled ? "#222222" : "#346181")};
  cursor: ${(props) => (props.disabled ? "inherit" : "pointer")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  padding-top: 1px;
`;
const Footer = styled_components_1.default.div `
  position: absolute;
  background-color: #e4f2f7;
  width: 100%;
  box-shadow: 0px 0px 1px 0px #c9d3d0;

  a {
    color: #346181;
  }
`;
const MemberBox = styled_components_1.default.div `
  display: flex;
  height: 24px;
  padding: 5px 16px 7px 9px;
`;
const MemberListTitle = styled_components_1.default.div `
  width: 275px;
  margin-left: 5px;
  color: #346181;
  font-size: 12px;
  font-weight: bold;
`;
const ArrowBox = styled_components_1.default.div `
  cursor: pointer;
  padding-left: 44px;
`;
const SliderDox = styled_components_1.default.div `
  display: ${({ isHideFooter }) => (isHideFooter ? "none" : "flex")};
  height: 136px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;
const PersonCol = styled_components_1.default.div `
  outline: none;
  text-align: center;
  width: 105px;
  padding: 8px;
  flex-shrink: 0;
  word-break: break-all;
`;
const PersonName = styled_components_1.default.div `
  font-size: 12px;
  word-break: break-all;
  text-align: center;
`;
const PersonMeta = styled_components_1.default.div `
  font-size: 12px;
`;
const UserIcon = styled_components_1.default.img.attrs({ src: profile_small_svg_1.default }) ``;
const SystemIcon = styled_components_1.default.img.attrs({ src: icon_system_svg_1.default }) ``;
const MemberListIcon = styled_components_1.default.img.attrs({ src: profile_small_blue_svg_1.default }) `
  width: 10px;
  height: 10px;
`;
const ArrowDownIcon = styled_components_1.default.img.attrs({ src: arrow_down_svg_1.default }) `
  width: 16px;
  height: 10px;
  margin-bottom: 5px;
  ${({ isHideFooter }) => (isHideFooter ? "transform: rotate(180deg);" : "")};
`;
const ColumnTitle = styled_components_1.default.div `
  display: flex;
`;
const ActualTitle = styled_components_1.default.div `
  font-size: 12px;
  width: 256px;
  border-bottom: 4px solid #cccccc;
  margin-right: 24px;
  padding-left: 8px;
`;
const PlanTitle = styled_components_1.default.div `
  font-size: 12px;
  width: 64px;
  border-bottom: 4px solid #cccccc;
  padding-left: 8px;
`;
const ProcessBox = styled_components_1.default.div `
  > div:nth-child(2) {
    margin-top: 4px;
  }

  > div:nth-child(n + 3) {
    margin-top: 16px;
  }
`;
const PlanCol = styled_components_1.default.div `
  width: 64px;
  margin-left: 24px;
`;
exports.default = StationOperationTask;
//# sourceMappingURL=StationOperationTask.js.map