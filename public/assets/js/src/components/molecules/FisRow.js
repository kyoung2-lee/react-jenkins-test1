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
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const oalAircraft_1 = require("../../reducers/oalAircraft");
const oalPax_1 = require("../../reducers/oalPax");
const oalPaxStatus_1 = require("../../reducers/oalPaxStatus");
const media_1 = __importDefault(require("../../styles/media"));
const colorStyle_1 = require("../../styles/colorStyle");
const blade_svg_component_1 = __importDefault(require("../../assets/images/icon/blade.svg?component"));
const icon_cross_svg_component_1 = __importDefault(require("../../assets/images/icon/icon-cross.svg?component"));
const storage_1 = require("../../lib/storage");
const commonConst_1 = require("../../lib/commonConst");
const commonUtil_1 = require("../../lib/commonUtil");
const flightListModals_1 = require("../../reducers/flightListModals");
const flightModals_1 = require("../../reducers/flightModals");
const flightContentsFlightDetail_1 = require("../../reducers/flightContentsFlightDetail");
const flightContentsStationOperationTask_1 = require("../../reducers/flightContentsStationOperationTask");
const flightMovementModal_1 = require("../../reducers/flightMovementModal");
const multipleFlightMovementModals_1 = require("../../reducers/multipleFlightMovementModals");
const mvtMsgModal_1 = require("../../reducers/mvtMsgModal");
const editRmksPopup_1 = require("../../reducers/editRmksPopup");
const spotNumber_1 = require("../../reducers/spotNumber");
const oalFuel_1 = require("../../reducers/oalFuel");
const SpecialStatuses_1 = __importDefault(require("./SpecialStatuses"));
const CsSign_1 = require("../atoms/CsSign");
const ExcessTimeContainer_1 = __importDefault(require("../atoms/ExcessTimeContainer"));
const FisFltStsLabel_1 = __importStar(require("../atoms/FisFltStsLabel"));
const icon_remarks_svg_1 = __importDefault(require("../../assets/images/icon/icon-remarks.svg"));
const icon_remarks_dark_svg_1 = __importDefault(require("../../assets/images/icon/icon-remarks-dark.svg"));
const icon_plane_png_1 = __importDefault(require("../../assets/images/icon/icon-plane.png"));
const icon_plane_animation_png_1 = __importDefault(require("../../assets/images/icon/icon-plane-animation.png"));
const icon_plane_dark_png_1 = __importDefault(require("../../assets/images/icon/icon-plane-dark.png"));
const icon_plane_dark_animation_png_1 = __importDefault(require("../../assets/images/icon/icon-plane-dark-animation.png"));
const FisRow = (props) => {
    const { isMySchedule, selectedApoCd, timeDiffUtc, fisRow, dispRangeFromLcl, dispRangeToLcl, stationOperationTaskEnabled, flightMovementEnabled, multipleFlightMovementEnabled, mvtMsgEnabled, flightDetailEnabled, flightListEnabled, flightRmksEnabled, oalAircraftEnabled, oalPaxEnabled, spotNoEnabled, oalPaxStatusEnabled, oalFuelEnabled, isSortArrival, isSortTwoColumnMode, isDarkMode, acarsStatus, presentTime, } = props;
    const isArrDepOal = (fisRow.arr && fisRow.arr.isOal) || (fisRow.dep && fisRow.dep.isOal) || false;
    const isDivAtbOrgApoWork = isMySchedule ? false : fisRow.isDivAtbOrgApo;
    const dispatch = (0, hooks_1.useAppDispatch)();
    const arrRmksTextRef = (0, react_1.useRef)(null);
    const depRmksTextRef = (0, react_1.useRef)(null);
    const clickCountRef = (0, react_1.useRef)(0);
    const mvtClickCountRef = (0, react_1.useRef)(0);
    const isWindowsFlag = (0, react_1.useMemo)(() => (0, colorStyle_1.isWindows)(), []);
    const isPc = (0, react_1.useMemo)(() => storage_1.storage.isPc, []);
    const arrStsColor = (0, react_1.useMemo)(() => (fisRow.arrFisFltSts ? (0, FisFltStsLabel_1.getLabelColor)({ fltSts: fisRow.arrFisFltSts, isDarkMode, isArr: true }).statusColor : ""), [fisRow.arrFisFltSts, isDarkMode]);
    const depStsColor = (0, react_1.useMemo)(() => (fisRow.depFisFltSts ? (0, FisFltStsLabel_1.getLabelColor)({ fltSts: fisRow.depFisFltSts, isDarkMode, isArr: false }).statusColor : ""), [fisRow.depFisFltSts, isDarkMode]);
    const handleFlightListModal = () => {
        if (flightListEnabled) {
            const { dep, arr } = fisRow;
            const flightListKeys = {
                selectedApoCd,
                date: dep && arr
                    ? (0, dayjs_1.default)(dep.orgDateLcl).format("YYYY-MM-DD")
                    : dep
                        ? (0, dayjs_1.default)(dep.orgDateLcl).format("YYYY-MM-DD")
                        : arr
                            ? (0, dayjs_1.default)(arr.orgDateLcl).format("YYYY-MM-DD")
                            : "",
                dateFrom: dep && arr ? (0, dayjs_1.default)(arr.orgDateLcl).format("YYYY-MM-DD") : "",
                ship: fisRow.shipNo, // 航空機登録記号
            };
            void dispatch((0, flightListModals_1.openFlightListModal)({ flightListKeys }));
            void dispatch((0, flightListModals_1.getFlightList)(flightListKeys));
        }
    };
    const handleClickPaxBox = (isDep) => {
        const flight = isDep ? fisRow.dep : fisRow.arr;
        if (!oalPaxEnabled || !flight || !flight.isOal || isDivAtbOrgApoWork)
            return;
        const flightKey = {
            orgDateLcl: flight.orgDateLcl,
            alCd: flight.alCd,
            fltNo: flight.fltNo,
            casFltNo: flight.casFltNo || "",
            skdDepApoCd: flight.skdDepApoCd,
            skdArrApoCd: flight.skdArrApoCd,
            skdLegSno: flight.skdLegSno,
        };
        void dispatch((0, oalPax_1.openOalPaxModal)(flightKey));
    };
    const handleClickPaxStatusBox = (forcusInputName) => {
        if (!oalPaxStatusEnabled || !fisRow.dep || !fisRow.dep.isOal || fisRow.isCancel)
            return;
        const flightKey = {
            orgDateLcl: fisRow.dep.orgDateLcl,
            alCd: fisRow.dep.alCd,
            fltNo: fisRow.dep.fltNo,
            casFltNo: fisRow.dep.casFltNo || "",
            skdDepApoCd: fisRow.dep.skdDepApoCd,
            skdArrApoCd: fisRow.dep.skdArrApoCd,
            skdLegSno: fisRow.dep.skdLegSno,
        };
        void dispatch((0, oalPaxStatus_1.openOalPaxStatusModal)({ forcusInputName, flightKey }));
    };
    const handleClickOalFuelModal = () => {
        if (fisRow.isCancel || !oalFuelEnabled)
            return;
        const { dep } = fisRow;
        if (!dep || !dep.isOal)
            return;
        const flightKey = {
            orgDateLcl: dep.orgDateLcl,
            alCd: dep.alCd,
            fltNo: dep.fltNo,
            casFltNo: dep.casFltNo || "",
            skdDepApoCd: dep.skdDepApoCd,
            skdArrApoCd: dep.skdArrApoCd,
            skdLegSno: dep.skdLegSno,
        };
        void dispatch((0, oalFuel_1.openOalFuelModal)(flightKey));
    };
    const handleFlightDetailList = (isDep) => () => {
        if (!flightDetailEnabled)
            return;
        const flight = isDep ? fisRow.dep : fisRow.arr;
        if (!flight)
            return;
        const flightKey = {
            myApoCd: selectedApoCd,
            orgDateLcl: flight.orgDateLcl,
            alCd: flight.alCd,
            fltNo: flight.fltNo,
            casFltNo: flight.casFltNo,
            skdDepApoCd: flight.skdDepApoCd,
            skdArrApoCd: flight.skdArrApoCd,
            skdLegSno: flight.skdLegSno,
            oalTblFlg: flight.isOal,
        };
        const posRight = !isDep;
        const tabName = "Detail";
        void dispatch((0, flightModals_1.openFlightModal)({ flightKey, posRight, tabName }));
        void dispatch((0, flightContentsFlightDetail_1.fetchFlightDetail)({ flightKey }));
    };
    const handleClickSpotNumber = () => {
        if (!spotNoEnabled || fisRow.isCancel || isDivAtbOrgApoWork)
            return;
        void dispatch((0, spotNumber_1.openSpotNumberChild)({ seq: fisRow.arrDepCtrl.seq, isModal: true, dispRangeFromLcl, dispRangeToLcl }));
    };
    const handleStationOperationTaskList = () => {
        if (!stationOperationTaskEnabled || !fisRow.dep) {
            return;
        }
        if (!stationOperationTaskEnabled || !fisRow.dep) {
            return;
        }
        const flightKey = {
            myApoCd: selectedApoCd,
            orgDateLcl: fisRow.dep.orgDateLcl,
            alCd: fisRow.dep.alCd,
            fltNo: fisRow.dep.fltNo,
            casFltNo: fisRow.dep.casFltNo,
            skdDepApoCd: fisRow.dep.skdDepApoCd,
            skdArrApoCd: fisRow.dep.skdArrApoCd,
            skdLegSno: fisRow.dep.skdLegSno,
            oalTblFlg: fisRow.dep.isOal,
        };
        const posRight = false;
        const tabName = "Task";
        void dispatch((0, flightModals_1.openFlightModal)({ flightKey, posRight, tabName }));
        void dispatch((0, flightContentsStationOperationTask_1.fetchStationOperationTask)({ flightKey }));
    };
    const handleFlightMovementOnSingleOrDoubleClick = (isDep) => {
        mvtClickCountRef.current += 1;
        if (mvtClickCountRef.current < 2) {
            setTimeout(() => {
                if (mvtClickCountRef.current > 1) {
                    if (!fisRow.isCancel && !isDivAtbOrgApoWork) {
                        handleMvtMsgModal(isDep);
                    }
                }
                else if (!isDivAtbOrgApoWork) {
                    handleFlightMovement(isDep);
                }
                mvtClickCountRef.current = 0;
            }, 350);
        }
    };
    const handleFlightMovement = (isDep) => {
        if (!flightMovementEnabled)
            return;
        const flight = isDep ? fisRow.dep : fisRow.arr;
        if (!flight)
            return;
        const legKey = {
            orgDateLcl: flight.orgDateLcl,
            alCd: flight.alCd,
            fltNo: flight.fltNo,
            casFltNo: flight.casFltNo || "",
            skdDepApoCd: flight.skdDepApoCd,
            skdArrApoCd: flight.skdArrApoCd,
            skdLegSno: flight.skdLegSno,
        };
        void dispatch((0, flightMovementModal_1.openFlightMovementModal)({ legKey, isDep }));
    };
    const handleMvtMsgModal = (isDep) => {
        if (!mvtMsgEnabled)
            return;
        const flight = isDep ? fisRow.dep : fisRow.arr;
        if (!flight)
            return;
        if (flight.isOal)
            return;
        const legKey = {
            orgDateLcl: flight.orgDateLcl,
            alCd: flight.alCd,
            fltNo: flight.fltNo,
            skdDepApoCd: flight.skdDepApoCd,
            skdArrApoCd: flight.skdArrApoCd,
            skdLegSno: flight.skdLegSno,
        };
        void dispatch((0, mvtMsgModal_1.openMvtMsgModal)({ legKey }));
    };
    const handleMultipleFlightMovement = (isDep) => {
        const flight = isDep ? fisRow.dep : fisRow.arr;
        if (isMySchedule)
            return;
        if (!flight)
            return;
        if (!fisRow.isCancel && !isDivAtbOrgApoWork && multipleFlightMovementEnabled && timeDiffUtc !== null) {
            const legKey = {
                orgDateLcl: flight.orgDateLcl,
                alCd: flight.alCd,
                fltNo: flight.fltNo,
                casFltNo: flight.casFltNo || "",
                skdDepApoCd: flight.skdDepApoCd,
                skdArrApoCd: flight.skdArrApoCd,
                skdLegSno: flight.skdLegSno,
            };
            dispatch((0, multipleFlightMovementModals_1.openMultipleFlightMovement)({ apoCd: selectedApoCd, timeDiffUtc, legKey, isDep }));
        }
    };
    const handleOnSingleOrDoubleClick = () => {
        clickCountRef.current += 1;
        if (clickCountRef.current < 2) {
            setTimeout(() => {
                if (clickCountRef.current > 1) {
                    if (isArrDepOal && !fisRow.isCancel && !isDivAtbOrgApoWork) {
                        handleOpenOalAircraftModal();
                    }
                }
                else if (fisRow.shipNo && !fisRow.isCancel && !isDivAtbOrgApoWork) {
                    handleFlightListModal();
                }
                clickCountRef.current = 0;
            }, 350);
        }
    };
    const handleOpenOalAircraftModal = () => {
        if (!oalAircraftEnabled)
            return;
        const { seq } = fisRow.arrDepCtrl;
        void dispatch((0, oalAircraft_1.openOalAircraftModal)({ seq, dispRangeFromLcl, dispRangeToLcl }));
    };
    const handleEditRmksPopUp = (isDep) => () => {
        if (flightRmksEnabled) {
            const flight = isDep ? fisRow.dep : fisRow.arr;
            if (isDivAtbOrgApoWork)
                return;
            const width = 380;
            let top;
            if (isMySchedule) {
                top = isPc ? window.innerHeight - 239 - 150 : 100;
            }
            else {
                top = isPc ? 0 : 100;
            }
            let left = 0;
            if (isDep) {
                const nodeRmksText = depRmksTextRef.current;
                if (nodeRmksText) {
                    left = (nodeRmksText.getBoundingClientRect().right * props.zoomFis) / 100 - width;
                }
            }
            else {
                const nodeRmksText = arrRmksTextRef.current;
                if (nodeRmksText) {
                    left = (nodeRmksText.getBoundingClientRect().left * props.zoomFis) / 100;
                }
            }
            if (flight) {
                const flightDetailKey = {
                    myApoCd: selectedApoCd,
                    orgDateLcl: flight.orgDateLcl,
                    alCd: flight.alCd,
                    fltNo: flight.fltNo,
                    casFltNo: flight.casFltNo,
                    skdDepApoCd: flight.skdDepApoCd,
                    skdArrApoCd: flight.skdArrApoCd,
                    skdLegSno: flight.skdLegSno,
                    oalTblFlg: flight.isOal,
                };
                void dispatch((0, editRmksPopup_1.openEditRmksPopup)({
                    flightDetailKey,
                    mode: isDep ? "DEP" : "ARR",
                    position: {
                        width,
                        top,
                        left,
                    },
                }));
            }
        }
    };
    const planeElement = (0, react_1.useMemo)(() => {
        const isAnimation = fisRow.arrFisFltSts === "APP";
        const PlaneIcon = isDarkMode ? (isAnimation ? PlaneDarkA : PlaneDark) : isAnimation ? PlaneA : Plane;
        return (react_1.default.createElement(PlaneIconBox, { isPc: isPc },
            react_1.default.createElement(PlaneIcon, null)));
    }, [fisRow.arrFisFltSts, isDarkMode, isPc]);
    const arrDlyInfoText = (0, react_1.useMemo)(() => {
        const dlyList = [];
        fisRow.arrDlyInfo.slice(0, 3).forEach((dlyInfo) => {
            var _a;
            if (typeof (dlyInfo === null || dlyInfo === void 0 ? void 0 : dlyInfo.arrDlyTime) === "number") {
                dlyList.push(`${(0, commonUtil_1.padding0)(dlyInfo.arrDlyTime.toString(), 4)}${(_a = dlyInfo.arrDlyRsnCd) !== null && _a !== void 0 ? _a : ""}`);
            }
        });
        return dlyList.join("/");
    }, [fisRow.arrDlyInfo]);
    const depDlyInfoText = (0, react_1.useMemo)(() => {
        const dlyList = [];
        fisRow.depDlyInfo.slice(0, 3).forEach((dlyInfo) => {
            var _a;
            if (typeof (dlyInfo === null || dlyInfo === void 0 ? void 0 : dlyInfo.depDlyTime) === "number") {
                dlyList.push(`${(0, commonUtil_1.padding0)(dlyInfo.depDlyTime.toString(), 4)}${(_a = dlyInfo.depDlyRsnCd) !== null && _a !== void 0 ? _a : ""}`);
            }
        });
        return dlyList.join("/");
    }, [fisRow.depDlyInfo]);
    const isSpcAccent = (spcUpdateTime) => {
        if (spcUpdateTime && presentTime && presentTime.diff(spcUpdateTime, "minute", true) <= 10) {
            return true;
        }
        return false;
    };
    const isSpotNoAccent = () => {
        const spcUpdateTime = !fisRow.depSpecialStsSpcUpdateTime || fisRow.depSpecialStsSpcUpdateTime.isBefore(fisRow.arrSpecialStsSpcUpdateTime)
            ? fisRow.arrSpecialStsSpcUpdateTime
            : fisRow.depSpecialStsSpcUpdateTime;
        if (!fisRow.isCancel &&
            !fisRow.isDivAtbOrgApo &&
            spcUpdateTime &&
            presentTime &&
            presentTime.diff(spcUpdateTime, "minute", true) <= 10) {
            return true;
        }
        return false;
    };
    return (react_1.default.createElement(FlightRow, { isPc: isPc, isMask: fisRow.isMask, isSortArrival: isSortArrival, isSortTwoColumnMode: isSortTwoColumnMode, doAnimation: props.doAnimation },
        react_1.default.createElement("div", { className: isSortArrival && isSortTwoColumnMode ? "flightContentLong" : isSortTwoColumnMode ? "flightContentHide" : "flightContentArr" }, fisRow.arr ? (react_1.default.createElement(Arrival, { isPc: isPc },
            (isPc || isSortTwoColumnMode) && (react_1.default.createElement(react_1.default.Fragment, null,
                isMySchedule ? (react_1.default.createElement(RmksContainerOriginal, { ref: arrRmksTextRef, isPc: isPc, isSortTwoColumnMode: isSortTwoColumnMode, flightRmksEnabled: flightRmksEnabled && !isDivAtbOrgApoWork, onClick: handleEditRmksPopUp(false) },
                    react_1.default.createElement("div", null, fisRow.arrRmksText_label),
                    react_1.default.createElement("div", null, fisRow.arrRmksText))) : (react_1.default.createElement(RmksColumn, { isPc: isPc, isSortTwoColumnMode: isSortTwoColumnMode },
                    react_1.default.createElement(RmksContainer, { ref: arrRmksTextRef, flightRmksEnabled: flightRmksEnabled && !isDivAtbOrgApoWork, onClick: handleEditRmksPopUp(false) },
                        react_1.default.createElement("div", null, fisRow.arrRmksText)),
                    react_1.default.createElement(DlyInfo, null, arrDlyInfoText))),
                react_1.default.createElement(SpaceBoxWide, { adjustWidth: isSortTwoColumnMode ? -16 : 0 }))),
            react_1.default.createElement(TimeColumn, { isPc: isPc, isArr: true, isSortTwoColumnMode: isSortTwoColumnMode, paxBoxClickable: oalPaxEnabled && fisRow.arr && fisRow.arr.isOal && !isDivAtbOrgApoWork },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "PaxBox", onClick: () => handleClickPaxBox(false), onKeyUp: () => { } }, fisRow.arr.isOal && fisRow.arrRefPaxTtlCnt === null ? (react_1.default.createElement(ClickableLabel, { className: "PaxLabel", isPc: isPc }, "PAX")) : (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("div", null, fisRow.arrRefPaxTtlCnt_label),
                        react_1.default.createElement("div", null, fisRow.arrRefPaxTtlCnt)))),
                    react_1.default.createElement(SpaceBox, null),
                    react_1.default.createElement(TimeArea, { enabled: (!isDivAtbOrgApoWork && flightMovementEnabled) ||
                            (!fisRow.arr.isOal && !fisRow.isCancel && !isDivAtbOrgApoWork && mvtMsgEnabled) ||
                            (!fisRow.isCancel && !isDivAtbOrgApoWork && !isMySchedule && multipleFlightMovementEnabled), onClick: () => handleFlightMovementOnSingleOrDoubleClick(false), onContextMenu: (e) => {
                            e.preventDefault();
                            handleMultipleFlightMovement(false);
                        } },
                        react_1.default.createElement("div", { className: "TimeBox" },
                            react_1.default.createElement("div", null, fisRow.arrStaLcl && "STA"),
                            react_1.default.createElement("div", null, fisRow.arrStaLcl)),
                        react_1.default.createElement(SpaceBox, null),
                        react_1.default.createElement("div", { className: "TimeBox" },
                            react_1.default.createElement("div", null,
                                fisRow.arrEtaLdLcl_label,
                                fisRow.arrEtaCd && (react_1.default.createElement(Tetantive, { isPc: isPc, isDarkMode: isDarkMode }, fisRow.arrEtaCd))),
                            react_1.default.createElement("div", null, fisRow.arrEtaLdLcl)),
                        react_1.default.createElement(SpaceBox, null),
                        react_1.default.createElement("div", { className: "TimeBox" },
                            react_1.default.createElement("div", null, fisRow.arrAtaLcl && "ATA"),
                            react_1.default.createElement("div", null, fisRow.arrAtaLcl || (fisRow.arrInFltSign && planeElement))))),
                react_1.default.createElement(SpecialStatuses_1.default, { specialStses: fisRow.arrSpecialStsesData, arrDepCd: "ARR", width: isPc ? "214px" : "224", isPc: isPc, isDarkMode: isDarkMode, isSpcAccent: isSpcAccent(fisRow.arrSpecialStsSpcUpdateTime) })),
            react_1.default.createElement(BasicInfoColumn, { isPc: isPc, isArr: true, enabled: flightDetailEnabled, onClick: handleFlightDetailList(false) },
                react_1.default.createElement(FltStsContainer, null,
                    fisRow.arrRmksText ? isDarkMode ? react_1.default.createElement(RemarksIconDark, null) : react_1.default.createElement(RemarksIcon, null) : react_1.default.createElement(NonRemarksIcon, null),
                    acarsStatus ? (react_1.default.createElement(AcarsStsLabel, { isVisible: fisRow.arrAcarsFlg, isWindowsFlag: isWindowsFlag }, acarsStatus)) : (react_1.default.createElement(AcarsStsLabel, { isVisible: false, isWindowsFlag: isWindowsFlag })),
                    fisRow.arrFisFltSts ? (react_1.default.createElement(FisFltStsLabelBox, { isDep: false },
                        react_1.default.createElement(FisFltStsLabel_1.default, { isPc: isPc, isDarkMode: isDarkMode }, fisRow.arrFisFltSts))) : (react_1.default.createElement(NonFltSts, null))),
                react_1.default.createElement(AirLineCode, { isPc: isPc, casFltNo: fisRow.arrCasFltNo || "" },
                    fisRow.arrCasFltNo ? (react_1.default.createElement("span", { className: "casFltNo" }, fisRow.arrCasFltNo)) : (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("span", null, fisRow.arrAlCd),
                        fisRow.arrFltNo)),
                    fisRow.arrCsSign && react_1.default.createElement(CsSign, null)),
                react_1.default.createElement(ApoInfo, { isPc: isPc, isDarkMode: isDarkMode, isDep: false },
                    react_1.default.createElement("div", { className: "om" }, fisRow.arrOmAlCd),
                    react_1.default.createElement("div", { className: "apo" }, fisRow.arrOrgApoCd))))) : (!!fisRow.arrFromCat && (react_1.default.createElement(FromNextInfo, null,
            fisRow.arrFromCat > 0 && (react_1.default.createElement("div", null, `From ${fisRow.arrFromCasFltNo ? fisRow.arrFromCasFltNo : fisRow.arrFromAlCd + fisRow.arrFromFltNo}${fisRow.arrFromDateLcl ? `/${fisRow.arrFromDateLcl}` : ""}`)),
            fisRow.arrFromCat === 2 && react_1.default.createElement(CrossIcon, null),
            fisRow.arrFromCat === -1 && react_1.default.createElement("div", null, "CNX Not Decided"))))),
        react_1.default.createElement("div", { className: "stationOperationContent" },
            react_1.default.createElement(StatusBoundaryLeft, { color: arrStsColor }),
            react_1.default.createElement(StationOperation, { isPc: isPc, stationOperationShipEnabled: (fisRow.shipNo && !fisRow.isCancel && !isDivAtbOrgApoWork && flightListEnabled) ||
                    (!fisRow.isCancel && !isDivAtbOrgApoWork && isArrDepOal && oalAircraftEnabled), stationOperationTaskEnabled: stationOperationTaskEnabled && fisRow.gndWorkStepFlg, paxStatusClickable: oalPaxStatusEnabled && fisRow.dep && fisRow.dep.isOal && !fisRow.isCancel, stationOperationSpotEnabled: spotNoEnabled && !fisRow.isCancel && !isDivAtbOrgApoWork, oalFuelClickable: oalFuelEnabled && fisRow.dep && fisRow.dep.isOal && !fisRow.isCancel },
                react_1.default.createElement("div", { className: "stationOperationSpot" },
                    react_1.default.createElement(SpotNoLabel, { onClick: handleClickSpotNumber, onKeyUp: () => { }, isDarkMode: isDarkMode, isAccent: isSpotNoAccent() }, fisRow.gndSpotNo),
                    react_1.default.createElement("div", { className: "stationOperationGate", onClick: () => handleClickPaxStatusBox("depGateNo"), onKeyUp: () => { } },
                        react_1.default.createElement("span", null, fisRow.gndDepGateNo_label),
                        fisRow.gndDepGateNo)),
                react_1.default.createElement("div", { className: "stationOperationShip stationOperationBox", onClick: () => handleOnSingleOrDoubleClick(), onKeyUp: () => { } },
                    react_1.default.createElement("div", null,
                        fisRow.gndShipNo1 && react_1.default.createElement("span", null, fisRow.gndShipNo1),
                        fisRow.gndShipNo2),
                    react_1.default.createElement("div", null,
                        fisRow.gndSeatConfCd,
                        fisRow.gndWingletFlg && react_1.default.createElement(BladeIcon, null))),
                react_1.default.createElement("div", { className: "stationOperationStatusFuelBox" },
                    react_1.default.createElement("div", { className: "stationOperationStatus" },
                        fisRow.dep && fisRow.dep.isOal && !fisRow.gndAcceptanceSts && !fisRow.gndBoardingSts ? (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(ClickableLabel, { className: "AcceptanceSts StatusLabel", isPc: isPc, onClick: () => handleClickPaxStatusBox("acceptanceSts") }, "Status"),
                            react_1.default.createElement("div", { className: "BoardingSts StatusLabel", onClick: () => handleClickPaxStatusBox("boardingSts"), onKeyUp: () => { } }))) : (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("div", { className: "AcceptanceSts", onClick: () => handleClickPaxStatusBox("acceptanceSts"), onKeyUp: () => { } }, fisRow.gndAcceptanceSts),
                            react_1.default.createElement("div", { className: "BoardingSts", onClick: () => handleClickPaxStatusBox("boardingSts"), onKeyUp: () => { } }, fisRow.gndBoardingSts))),
                        react_1.default.createElement("div", { className: "LsFlg" }, fisRow.gndLsFlg && "WB")),
                    react_1.default.createElement("div", { className: "stationOperationFuel", onClick: handleClickOalFuelModal, onKeyUp: () => { } }, fisRow.dep && fisRow.dep.isOal && !fisRow.gndRampFuelLbsWt ? (react_1.default.createElement(ClickableLabel, { isPc: isPc }, "Fuel")) : (react_1.default.createElement(react_1.default.Fragment, null,
                        fisRow.gndRampFuelLbsWt && react_1.default.createElement("span", null, "Fuel"),
                        fisRow.gndRampFuelLbsWt,
                        fisRow.gndRampFuelLbsWt && fisRow.gndFuelOrderFlg && (react_1.default.createElement(SquareS, { isPc: isPc, isDarkMode: isDarkMode }, "S")))))),
                fisRow.gndWorkStepFlg ? (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                react_1.default.createElement("div", { className: "stationOperationTask stationOperationBox", onClick: handleStationOperationTaskList, onKeyUp: () => { } },
                    react_1.default.createElement("div", null, fisRow.gndLstTaskSts),
                    fisRow.dgtShortFlg ? (react_1.default.createElement(ExcessTimeBox, { isPc: isPc, isDarkMode: isDarkMode },
                        react_1.default.createElement(ExcessTimeContainer_1.default, { time: fisRow.estGndTime }))) : (react_1.default.createElement("div", null, fisRow.estGndTime)))) : (react_1.default.createElement("div", { className: "stationOperationTask" }))),
            react_1.default.createElement(StatusBoundaryRight, { color: depStsColor })),
        react_1.default.createElement("div", { className: !isSortArrival && isSortTwoColumnMode ? "flightContentLong" : isSortTwoColumnMode ? "flightContentHide" : "flightContentDep" }, fisRow.dep ? (react_1.default.createElement(Departure, { isPc: isPc },
            react_1.default.createElement(BasicInfoColumn, { isPc: isPc, isArr: false, enabled: flightDetailEnabled, onClick: handleFlightDetailList(true) },
                react_1.default.createElement(FltStsContainer, null,
                    fisRow.depFisFltSts ? (react_1.default.createElement(FisFltStsLabelBox, { isDep: true },
                        react_1.default.createElement(FisFltStsLabel_1.default, { isPc: isPc, isDarkMode: isDarkMode }, fisRow.depFisFltSts))) : (react_1.default.createElement(NonFltSts, null)),
                    acarsStatus ? (react_1.default.createElement(AcarsStsLabel, { isVisible: fisRow.depAcarsFlg, isWindowsFlag: isWindowsFlag }, acarsStatus)) : (react_1.default.createElement(AcarsStsLabel, { isVisible: false, isWindowsFlag: isWindowsFlag })),
                    fisRow.depRmksText && (isDarkMode ? react_1.default.createElement(RemarksIconDark, null) : react_1.default.createElement(RemarksIcon, null))),
                react_1.default.createElement(AirLineCode, { isPc: isPc, casFltNo: fisRow.depCasFltNo || "" },
                    fisRow.depCasFltNo ? (react_1.default.createElement("span", { className: "casFltNo" }, fisRow.depCasFltNo)) : (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("span", null, fisRow.depAlCd),
                        fisRow.depFltNo)),
                    fisRow.depCsSign && react_1.default.createElement(CsSign, null)),
                react_1.default.createElement(ApoInfo, { isPc: isPc, isDarkMode: isDarkMode, isDep: true },
                    react_1.default.createElement("div", { className: "apo" }, fisRow.depDstApoCd),
                    react_1.default.createElement("div", { className: "om" }, fisRow.depOmAlCd))),
            react_1.default.createElement(TimeColumn, { isPc: isPc, isArr: false, isSortTwoColumnMode: isSortTwoColumnMode, paxBoxClickable: oalPaxEnabled && fisRow.dep && fisRow.dep.isOal },
                react_1.default.createElement("div", null,
                    react_1.default.createElement(TimeArea, { enabled: flightMovementEnabled ||
                            (!fisRow.dep.isOal && !fisRow.isCancel && mvtMsgEnabled) ||
                            (!fisRow.isCancel && multipleFlightMovementEnabled), onClick: () => handleFlightMovementOnSingleOrDoubleClick(true), onContextMenu: (e) => {
                            e.preventDefault();
                            handleMultipleFlightMovement(true);
                        } },
                        react_1.default.createElement("div", { className: "TimeBox" },
                            react_1.default.createElement("div", null, fisRow.depStdLcl ? "STD" : ""),
                            react_1.default.createElement("div", null, fisRow.depStdLcl)),
                        react_1.default.createElement(SpaceBox, null),
                        react_1.default.createElement("div", { className: "TimeBox" },
                            react_1.default.createElement("div", null,
                                fisRow.depEtdAtdLcl_label,
                                fisRow.depEtdCd && (react_1.default.createElement(Tetantive, { isPc: isPc, isDarkMode: isDarkMode }, fisRow.depEtdCd))),
                            react_1.default.createElement("div", null, fisRow.depEtdAtdLcl)),
                        react_1.default.createElement(SpaceBox, null),
                        react_1.default.createElement("div", { className: "TimeBox" },
                            react_1.default.createElement("div", null, fisRow.depToLcl && "T/O"),
                            react_1.default.createElement("div", null, fisRow.depToLcl))),
                    react_1.default.createElement(SpaceBox, null),
                    react_1.default.createElement("div", { className: "PaxBox", onClick: () => handleClickPaxBox(true), onKeyUp: () => { } }, fisRow.dep.isOal && fisRow.depRefPaxTtlCnt === null ? (react_1.default.createElement(ClickableLabel, { className: "PaxLabel", isPc: isPc }, "PAX")) : (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("div", null, fisRow.depRefPaxTtlCnt_label),
                        react_1.default.createElement("div", null, fisRow.depRefPaxTtlCnt))))),
                react_1.default.createElement(SpecialStatuses_1.default, { specialStses: fisRow.depSpecialStsesData, arrDepCd: "DEP", width: isPc ? "214px" : "224px", isPc: isPc, isDarkMode: isDarkMode, isSpcAccent: isSpcAccent(fisRow.depSpecialStsSpcUpdateTime) })),
            (isPc || isSortTwoColumnMode) && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(SpaceBoxWide, { adjustWidth: isSortTwoColumnMode ? -16 : 0 }),
                isMySchedule ? (react_1.default.createElement(RmksContainerOriginal, { ref: depRmksTextRef, isPc: isPc, isSortTwoColumnMode: isSortTwoColumnMode, flightRmksEnabled: flightRmksEnabled, onClick: handleEditRmksPopUp(true) },
                    react_1.default.createElement("div", null, fisRow.depRmksText_label),
                    react_1.default.createElement("div", null, fisRow.depRmksText))) : (react_1.default.createElement(RmksColumn, { isPc: isPc, isSortTwoColumnMode: isSortTwoColumnMode },
                    react_1.default.createElement(RmksContainer, { ref: depRmksTextRef, flightRmksEnabled: flightRmksEnabled, onClick: handleEditRmksPopUp(true) },
                        react_1.default.createElement("div", null, fisRow.depRmksText)),
                    react_1.default.createElement(DlyInfo, null, depDlyInfoText))))))) : (!!fisRow.depNextCat && (react_1.default.createElement(FromNextInfo, null,
            fisRow.depNextCat > 0 && (react_1.default.createElement("div", null, `Next ${fisRow.depNextCasFltNo ? fisRow.depNextCasFltNo : fisRow.depNextAlCd + fisRow.depNextFltNo}${fisRow.depNextDateLcl ? `/${fisRow.depNextDateLcl}` : ""}`)),
            fisRow.depNextCat === 2 && react_1.default.createElement(CrossIcon, null),
            fisRow.depNextCat === -1 && react_1.default.createElement("div", null, "CNX Not Decided")))))));
};
const SpaceBox = styled_components_1.default.div `
  min-width: 14px;
  height: 100%;
`;
const SpaceBoxWide = styled_components_1.default.div `
  min-width: ${({ adjustWidth }) => `${26 + adjustWidth}px`};
  height: 100%;
`;
const showFlightContentFromHide = (0, styled_components_1.keyframes) `
  0%   { width: 0; max-width: 0; overflow: hidden; }
  100% { width: 33%; max-width: 100%; overflow: hidden; }
`;
const showFlightContentFromLong = (0, styled_components_1.keyframes) `
  0%   { width: 66%; max-width: 100%; overflow: hidden; }
  100% { width: 33%; max-width: 100%; overflow: hidden; }
`;
const longFlightContent = (0, styled_components_1.keyframes) `
  0%   { width: 33%; max-width: 100%; overflow: hidden; }
  100% { width: 66%; max-width: 100%; overflow: hidden; }
`;
const hideFlightContent = (0, styled_components_1.keyframes) `
  0%   { width: 33%; max-width: 100%; overflow: hidden; }
  100% { width: 0; max-width: 0; overflow: hidden; }
`;
const FlightRow = styled_components_1.default.div `
  height: ${({ isPc }) => (isPc ? "86px" : "88px")};
  max-width: ${commonConst_1.Const.MAX_WIDTH};
  margin-right: auto;
  margin-left: auto;
  background: ${({ theme }) => theme.color.fis.row.background};
  display: flex;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.DEFAULT_FONT_COLOR};

  > div {
    opacity: ${({ isMask }) => (isMask ? 0.42 : 1)};
  }
  .flightContentArr {
    ${({ isPc }) => (isPc ? "width: calc((100% - 352px) /2);" : "width: 33%;")};
    ${({ doAnimation, isSortArrival }) => doAnimation
    ? (0, styled_components_1.css) `
            animation: ${isSortArrival ? showFlightContentFromLong : showFlightContentFromHide} 0.3s;
          `
    : ""}
  }
  .flightContentDep {
    ${({ isPc }) => (isPc ? "width: calc((100% - 352px) /2);" : "width: 33%;")};
    ${({ doAnimation, isSortArrival }) => doAnimation
    ? (0, styled_components_1.css) `
            animation: ${!isSortArrival ? showFlightContentFromLong : showFlightContentFromHide} 0.3s;
          `
    : ""}
  }
  .flightContentLong {
    width: 66%;
    ${({ doAnimation }) => doAnimation
    ? (0, styled_components_1.css) `
            animation: ${longFlightContent} 0.3s;
          `
    : ""}
  }
  .flightContentHide {
    max-width: 0;
    overflow: hidden;
    ${({ doAnimation }) => doAnimation
    ? (0, styled_components_1.css) `
            animation: ${hideFlightContent} 0.3s;
          `
    : ""}
  }
  .stationOperationContent {
    width: ${({ isPc }) => (isPc ? "352px" : "34%")};
    padding: 0;
    margin: 0;
    opacity: ${({ isMask }) => (isMask ? 0.42 : 1)};
    max-width: ${({ isPc }) => (isPc ? "352px" : "")};
    display: flex;
    align-items: stretch;
    justify-content: space-between;
  }
`;
const Arrival = styled_components_1.default.div `
  padding-top: ${({ isPc }) => (isPc ? "8px" : "10px")};
  padding-right: 12px;
  padding-left: 10px;
  display: flex;
  justify-content: flex-end;
`;
const Departure = styled_components_1.default.div `
  padding-top: ${({ isPc }) => (isPc ? "8px" : "10px")};
  padding-right: 10px;
  padding-left: 12px;
  display: flex;
  justify-content: flex-start;
`;
const RmksColumn = styled_components_1.default.div `
  height: 73px;
  width: 100%;
  display: ${({ isSortTwoColumnMode }) => (isSortTwoColumnMode ? "flex" : "none")};
  ${media_1.default.greaterThan("desktopM") `display: flex;`}
  flex-direction: column;
  justify-content: space-between;
`;
const RmksContainer = styled_components_1.default.div `
  flex: 1 1 auto;
  width: 100%;
  cursor: ${({ flightRmksEnabled }) => (flightRmksEnabled ? "pointer" : "auto")};
  > div {
    word-break: break-word;
    font-size: 15px;
    line-height: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    white-space: normal;
    overflow: hidden;
  }
`;
const DlyInfo = styled_components_1.default.div `
  width: 100%;
  word-break: break-word;
  font-size: 15px;
  line-height: 18px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  white-space: normal;
  overflow: hidden;
`;
const RmksContainerOriginal = styled_components_1.default.div `
  height: 61px;
  width: 100%;
  word-break: break-word;
  cursor: ${({ flightRmksEnabled }) => (flightRmksEnabled ? "pointer" : "auto")};
  display: ${({ isSortTwoColumnMode }) => (isSortTwoColumnMode ? "block" : "none")};
  ${media_1.default.greaterThan("desktopM") `display: block;`}

  > div:first-child {
    font-size: ${({ isPc }) => (isPc ? "10px" : "12px")};
    margin-top: ${({ isPc }) => (isPc ? "4px" : "2px")};
    margin-bottom: 4px;
  }
  > div:last-child {
    font-size: ${({ isPc }) => (isPc ? "14px" : "14px")};
    line-height: 1.2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    white-space: normal;
    height: ${({ isPc }) => (isPc ? "48px" : "48px")};
    overflow: hidden;
  }
`;
const TimeColumn = styled_components_1.default.div `
  height: ${({ isPc }) => (isPc ? "68px" : "72px")};
  min-width: ${({ isPc, isSortTwoColumnMode }) => (isPc ? "212px" : isSortTwoColumnMode ? "226px" : "226px")};
  flex-direction: column;
  justify-content: flex-end;
  ${({ isPc, isArr, isSortTwoColumnMode }) => !isPc && isArr
    ? isSortTwoColumnMode
        ? "position:relative; left:12px;"
        : "position:relative; left:10px;"
    : ""}; /* iPadの場合は、空間が空きすぎるので左側を右にずらす */
  > div:first-child {
    display: flex;
    height: 46px;
    padding-top: ${({ isPc }) => (isPc ? "4px" : "0px")};
  }
  .TimeBox,
  .PaxBox {
    > div:first-child {
      display: flex;
      align-items: center;
      font-size: ${({ isPc }) => (isPc ? "10px" : "12px")};
      height: ${({ isPc }) => (isPc ? "18px" : "20px")};
    }
    > div:last-child {
      margin-top: 1px;
      font-size: ${({ isPc }) => (isPc ? "20px" : "20px")};
    }
  }
  .TimeBox {
    width: ${({ isPc }) => (isPc ? "42px" : "45px")};
    min-width: ${({ isPc }) => (isPc ? "42px" : "45px")};
  }
  .PaxBox {
    width: ${({ isPc }) => (isPc ? "32px" : "35px")};
    min-width: ${({ isPc }) => (isPc ? "32px" : "35px")};
    cursor: ${({ paxBoxClickable }) => (paxBoxClickable ? "pointer" : "auto")};
    > .PaxLabel {
      pointer-events: none;
      position: relative;
      top: 50%;
    }
  }
`;
const TimeArea = styled_components_1.default.div `
  display: flex;
  width: 100%;
  cursor: ${({ enabled }) => (enabled ? "pointer" : "auto")};
  user-select: none;
`;
const ClickableLabel = styled_components_1.default.div `
  color: ${({ theme }) => `${theme.color.fis.row.clickableLabel.color}`} !important;
  font-size: 13px !important;
  font-weight: ${({ isPc }) => (isPc ? "600" : "normal")} !important;
  width: 35px;
`;
const BasicInfoColumn = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: ${({ isArr }) => (isArr ? "flex-end" : "flex-start")};
  min-width: ${({ isPc }) => (isPc ? "104px" : "98px")};
  cursor: ${({ enabled }) => (enabled ? "pointer" : "auto")};
  > div::nth-child(3) {
    font-size: 50px;
    height: 19px;
    border: thin solid #0f0;
  }
  > div:last-child {
    font-size: ${({ isPc }) => (isPc ? "16px" : "17px")};
    height: 19px;
  }
`;
const FltStsContainer = styled_components_1.default.div `
  display: flex;
  min-width: 50px;
  min-height: 22px;
  align-items: center;
  > *:first-child {
    margin-right: 3px;
  }
`;
const FisFltStsLabelBox = styled_components_1.default.div `
  display: flex;
  width: 49px;
  > div:first-child {
    ${({ isDep }) => `${isDep ? "margin-right: auto" : "margin-left: auto"}`};
  }
`;
const NonFltSts = styled_components_1.default.div `
  width: 49px;
  height: 20px;
`;
const AirLineCode = styled_components_1.default.div `
  position: relative;
  top: 2px;
  font-size: ${({ isPc }) => (isPc ? "26px" : "28px")};
  height: 33px;
  line-height: 33px;
  display: flex;
  align-items: center;
  span:first-of-type {
    margin-top: ${({ isPc }) => (isPc ? "6px" : "9px")};
    font-size: ${({ isPc }) => (isPc ? "16px" : "17px")};
  }
  img {
    width: 8px;
    height: 8px;
    margin: 0 2px;
  }
  span.casFltNo {
    margin-top: 0;
    font-size: ${({ isPc, casFltNo }) => isPc
    ? casFltNo.length > 8
        ? "12px"
        : casFltNo.length > 6
            ? "14px"
            : "22px"
    : casFltNo.length > 8
        ? "13px"
        : casFltNo.length > 6
            ? "15px"
            : "23px"};
  }
`;
const ApoInfo = styled_components_1.default.div `
  display: flex;
  justify-content: ${({ isDep }) => (isDep ? "flex-start" : "flex-end")};
  align-items: baseline;
  .apo {
    min-width: 48px;
    text-align: ${({ isDep }) => (isDep ? "left" : "right")};
  }
  .om {
    margin: 0 2px 0 0;
    font-size: ${({ isPc }) => (isPc ? "14px" : "15px")};
    font-style: oblique;
    font-weight: 600;
    font-family: ${({ isPc }) => isPc ? "'メイリオ', meiryo, Avenir, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', sans-serif" : "inherit"};
    -webkit-text-stroke: ${({ isPc, isDarkMode }) => (isPc ? (isDarkMode ? "0.2px" : "0.5px") : "0")};
  }
`;
const StatusBoundaryLeft = styled_components_1.default.div `
  min-width: 6px;
  background-color: ${({ color }) => color || "none"};
  border-left: ${({ color, theme }) => (color ? "0px" : `2px solid ${theme.color.fis.row.box.background}`)};
  box-sizing: border-box;
`;
const StatusBoundaryRight = styled_components_1.default.div `
  min-width: 6px;
  background-color: ${({ color }) => color || "none"};
  border-right: ${({ color, theme }) => (color ? "0px" : `2px solid ${theme.color.fis.row.box.background}`)};
  box-sizing: border-box;
`;
const StationOperation = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ isPc }) => (isPc ? "0 4px 0 4px" : "0 3px 0 3px")};

  .stationOperationBox {
    padding: 6px 0 0;
    border-radius: 2px;
    background: #fff;
    text-align: center;
    font-size: ${({ isPc }) => (isPc ? "20px" : "20px")};
    line-height: 27px;
    background: ${({ theme }) => theme.color.fis.row.box.background};
  }
  .stationOperationShip {
    width: 82px;
    height: 61px;
    padding-top: 8px;
    user-select: none;
    ${({ stationOperationShipEnabled }) => stationOperationShipEnabled
    ? `
        cursor: pointer;
      `
    : `
        cursor: auto;
        &.stationOperationBox {
          box-shadow: none;
        }
    `};
    > div {
      height: 25px;
      line-height: 24px;
    }
    margin-right: ${({ isPc }) => (isPc ? "5px" : "2px")};
    span {
      font-size: ${({ isPc }) => (isPc ? "15px" : "16px")};
    }
  }
  .stationOperationTask {
    min-width: ${({ isPc }) => (isPc ? "61px" : "56px")};
    height: 61px;
    cursor: ${({ stationOperationTaskEnabled }) => (stationOperationTaskEnabled ? "pointer" : "auto")};
    > div {
      height: 25px;
      line-height: 25px;
    }
  }
  .stationOperationSpot,
  .stationOperationStatusFuelBox {
    height: 61px;
    padding-top: 6px;
    font-size: ${({ isPc }) => (isPc ? "20px" : "20px")};
    > div {
      height: 27px;
      line-height: 27px;
    }
    > div:last-child {
      align-items: baseline;
    }
    span {
      margin-right: 6px;
      font-size: ${({ isPc }) => (isPc ? "10px" : "12px")};
    }
    > div:nth-child(2) span {
      margin-right: ${({ isPc }) => (isPc ? "3px" : "2px")};
    }
  }
  .stationOperationSpot {
    width: ${({ isPc }) => (isPc ? "68px" : "74px")};
    overflow: visible;
    cursor: ${({ stationOperationSpotEnabled }) => (stationOperationSpotEnabled ? "pointer" : "auto")};
    > div:first-child {
      font-size: ${({ isPc }) => (isPc ? "26px" : "28px")};
    }
  }
  .stationOperationGate,
  .AcceptanceSts,
  .BoardingSts {
    cursor: ${({ paxStatusClickable }) => (paxStatusClickable ? "pointer" : "auto")};
  }
  .stationOperationFuel {
    cursor: ${({ oalFuelClickable }) => (oalFuelClickable ? "pointer" : "auto")};
  }
  .stationOperationStatus {
    min-width: ${({ isPc }) => (isPc ? "112px" : "110px")};
    .StatusLabel {
      &.AcceptanceSts,
      &.BoardingSts {
        height: 100%;
        vertical-align: top;
      }
    }
  }
  .AcceptanceSts,
  .BoardingSts,
  .LsFlg {
    display: inline-block;
    min-width: 35px;
  }
  .AcceptanceSts,
  .BoardingSts {
    margin-right: ${({ isPc }) => (isPc ? "3px" : "2px")};
  }
  .LsFlg {
    margin-right: 1px;
  }
`;
const ExcessTimeBox = styled_components_1.default.div `
  ${({ isPc, isDarkMode }) => (isPc ? (isDarkMode ? "font-weight: 600;" : "") : "font-weight: 500;")};
`;
const Tetantive = styled_components_1.default.div `
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  top: ${({ isPc }) => (isPc ? "0px" : "-1px")};
  margin-left: 3px;
  padding: ${({ isPc }) => (isPc ? "0.3em 0.35em 0.2em" : "0.25em 0.3em 0.1em")};
  font-weight: 600;
  /* FISステイタス(FisFltStsLabel)のデフォルトと同じ色 */
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFF" : "#000")};
  background-color: ${({ isDarkMode }) => (isDarkMode ? "rgb(57,65,72)" : "rgb(197,197,197)")};
  border-radius: 3px;
`;
const SquareS = styled_components_1.default.div `
  display: inline-block;
  padding: ${({ isPc }) => (isPc ? "5px 3px 3px" : "4px 3px 2px")};
  line-height: ${({ isPc }) => (isPc ? "16px" : "18px")};
  text-align: center;
  font-size: ${({ isPc }) => (isPc ? "20px" : "20px")};
  font-weight: 600;
  /* FISステイタス(FisFltStsLabel)のデフォルトと同じ色 */
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFF" : "#000")};
  background-color: ${({ isDarkMode }) => (isDarkMode ? "rgb(57,65,72)" : "rgb(197,197,197)")};
  border-radius: 4px;
  margin-left: 3px;
  align-self: center;
`;
const BladeIcon = (0, styled_components_1.default)(blade_svg_component_1.default) `
  width: 11px;
  height: 9px;
  fill: ${({ theme }) => theme.color.DEFAULT_FONT_COLOR};
`;
const Plane = styled_components_1.default.img.attrs({ src: icon_plane_png_1.default }) ``;
const PlaneA = styled_components_1.default.img.attrs({ src: icon_plane_animation_png_1.default }) ``;
const PlaneDark = styled_components_1.default.img.attrs({ src: icon_plane_dark_png_1.default }) ``;
const PlaneDarkA = styled_components_1.default.img.attrs({ src: icon_plane_dark_animation_png_1.default }) ``;
const PlaneIconBox = styled_components_1.default.div `
  margin: 0;
  padding: 0;
  img {
    margin-top: ${({ isPc }) => (isPc ? "-4px" : "-8px")};
    width: ${({ isPc }) => (isPc ? "26px" : "31px")};
  }
`;
const FromNextInfo = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
const CsSign = (0, styled_components_1.default)(CsSign_1.CsSign) `
  margin-top: 1px;
  width: 8px;
  height: 8px;
  background: #f4f085;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 50%;
  position: absolute;
  right: -10px;
  top: 10px;
`;
const RemarksIcon = styled_components_1.default.img.attrs({ src: icon_remarks_svg_1.default }) `
  width: 18px;
  height: 14px;
`;
const RemarksIconDark = styled_components_1.default.img.attrs({ src: icon_remarks_dark_svg_1.default }) `
  width: 18px;
  height: 14px;
`;
const NonRemarksIcon = styled_components_1.default.div `
  min-width: 18px;
`;
const CrossIcon = (0, styled_components_1.default)(icon_cross_svg_component_1.default).attrs({ viewBox: "0 0 360 360" }) `
  height: 30px;
  fill: ${({ theme }) => theme.color.DEFAULT_FONT_COLOR};
`;
const AcarsStsLabel = styled_components_1.default.div `
  display: inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  border-radius: 50%;
  border: 1px solid #b5bdc3;
  align-self: center;
  margin-right: 3px;
  ${({ isVisible }) => `${isVisible ? "" : "visibility: hidden"}`};
  background-color: #000;
  padding-top: ${({ isWindowsFlag }) => `${isWindowsFlag ? "0.15em" : "0.11em"}`};
  ${({ isWindowsFlag }) => `${isWindowsFlag ? "font-family: Meiryo, 'メイリオ', '游ゴシック', 'Yu Gothic', sans-serif" : ""}`};
`;
const SpotNoLabel = styled_components_1.default.div `
  ${({ isDarkMode, isAccent }) => {
    if (isAccent) {
        return isDarkMode ? "color: #EAA812;" : "color: #E67112;";
    }
    return "";
}};
  ${({ isDarkMode, isAccent }) => (isAccent && isDarkMode ? "font-weight: 600;" : "")};
`;
exports.default = FisRow;
//# sourceMappingURL=FisRow.js.map