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
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const Label_1 = __importDefault(require("../atoms/Label"));
const FisFltStsLabel_1 = __importDefault(require("../atoms/FisFltStsLabel"));
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const SpecialStatuses_1 = __importDefault(require("./SpecialStatuses"));
const flightContents_1 = require("../../reducers/flightContents");
const icon_plane_svg_1 = __importDefault(require("../../assets/images/icon/icon-plane.svg"));
const MvtMsgModal_1 = require("../organisms/MvtMsgModal");
const FlightSearchResult = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const isPc = (0, react_1.useMemo)(() => storage_1.storage.isPc, []);
    const [clickCount, setClickCount] = (0, react_1.useState)(0);
    const latestClickCount = (0, hooks_1.useLatest)(clickCount);
    const handleFlightDetail = (e) => {
        const { eLeg, onFlightDetail, flightDetailEnabled } = props;
        if (!flightDetailEnabled) {
            return;
        }
        onFlightDetail(eLeg);
        // 便詳細画面を呼び出す際に、機材接続情報画面へのフォーカスを合わせないようにするため
        e.stopPropagation();
    };
    const handleStationOperationTask = (e) => {
        const { eLeg, onStationOperationTask, stationOperationTaskEnabled } = props;
        if (stationOperationTaskEnabled && onStationOperationTask) {
            onStationOperationTask(eLeg);
        }
        // 便詳細画面を呼び出す際に、機材接続情報画面へのフォーカスを合わせないようにするため
        e.stopPropagation();
    };
    const isSelected = (selectedFlightIdentifier) => {
        const { eLeg } = props;
        return selectedFlightIdentifier === (0, flightContents_1.getIdentifier)({ ...eLeg, myApoCd: "" });
    };
    const handleFlightMovement = (isDep) => (e) => {
        setClickCount(clickCount + 1);
        const { eLeg, flightMovementEnabled, openOalFlightMovementModal, isModalComponent, mvtMsgEnabled, openMvtMsgModal } = props;
        // 機材接続情報画面以外の場合は、便情報詳細画面が開かないようにする
        if (!isModalComponent) {
            e.stopPropagation();
        }
        setTimeout(() => {
            if (latestClickCount.current >= 2) {
                // 2回以上タップで便動態発信画面を開く
                setClickCount(0);
                if (!mvtMsgEnabled)
                    return;
                if (eLeg.oalTblFlg)
                    return;
                if (eLeg.fisFltSts === "CNL")
                    return;
                if (!openMvtMsgModal)
                    return;
                const legKey = {
                    orgDateLcl: eLeg.orgDateLcl,
                    alCd: eLeg.alCd,
                    fltNo: eLeg.fltNo,
                    skdDepApoCd: eLeg.skdDepApoCd,
                    skdArrApoCd: eLeg.skdArrApoCd,
                    skdLegSno: eLeg.skdLegSno,
                };
                void dispatch(openMvtMsgModal({ legKey }));
            }
            else if (latestClickCount.current === 1) {
                // 1回タップで便動態更新画面を開く
                setClickCount(0);
                if (!flightMovementEnabled)
                    return;
                if (!openOalFlightMovementModal)
                    return;
                const legKey = {
                    orgDateLcl: eLeg.orgDateLcl,
                    alCd: eLeg.alCd,
                    fltNo: eLeg.fltNo,
                    casFltNo: eLeg.casFltNo || "",
                    skdDepApoCd: eLeg.skdDepApoCd,
                    skdArrApoCd: eLeg.skdArrApoCd,
                    skdLegSno: eLeg.skdLegSno,
                };
                void dispatch(openOalFlightMovementModal({ legKey, isDep }));
            }
        }, 350);
    };
    const getEta = () => {
        const { eLeg } = props;
        if (eLeg.ataLcl) {
            return (0, dayjs_1.default)(eLeg.ataLcl).format("HHmm");
        }
        if (eLeg.actLdLcl) {
            return (0, dayjs_1.default)(eLeg.actLdLcl).format("HHmm");
        }
        if (eLeg.tentativeEstLdLcl) {
            return (0, dayjs_1.default)(eLeg.tentativeEstLdLcl).format("HHmm");
        }
        if (eLeg.estLdLcl) {
            return (0, dayjs_1.default)(eLeg.estLdLcl).format("HHmm");
        }
        if (eLeg.tentativeEtaLcl) {
            return (0, dayjs_1.default)(eLeg.tentativeEtaLcl).format("HHmm");
        }
        if (eLeg.etaLcl && eLeg.etaLcl === eLeg.staLcl) {
            return "SKD";
        }
        if (eLeg.etaLcl) {
            return (0, dayjs_1.default)(eLeg.etaLcl).format("HHmm");
        }
        return "";
    };
    const getTentativeEtaCd = () => {
        const { eLeg } = props;
        if (!eLeg.ataLcl && !eLeg.actLdLcl) {
            if (eLeg.tentativeEstLdLcl) {
                return eLeg.tentativeEstLdCd;
            }
            if (!eLeg.estLdLcl && eLeg.tentativeEtaLcl) {
                return eLeg.tentativeEtaCd;
            }
        }
        return "";
    };
    const { eLeg, selectedFlightIdentifier, stationOperationTaskEnabled, flightMovementEnabled, flightDetailEnabled, isModalComponent, mvtMsgEnabled, } = props;
    const tentativeEtaCd = getTentativeEtaCd();
    const eta = getEta();
    const timeColumnEnabled = flightMovementEnabled || (isModalComponent && flightDetailEnabled) || (mvtMsgEnabled && !eLeg.oalTblFlg && eLeg.fisFltSts !== "CNL");
    return (react_1.default.createElement(Wrapper, { isSelected: isSelected(selectedFlightIdentifier), onClick: handleFlightDetail, enabled: !!flightDetailEnabled },
        react_1.default.createElement(Flight, null,
            eLeg.casFltNo ? (react_1.default.createElement(RowCenter, null,
                react_1.default.createElement(CasFlight, { length: eLeg.casFltNo.length }, eLeg.casFltNo))) : (react_1.default.createElement(Row, null,
                react_1.default.createElement(FlightAlCd, null, eLeg.alCd),
                react_1.default.createElement(FlightNumber, null, (0, commonUtil_1.formatFltNo)(eLeg.fltNo)),
                eLeg.csCount !== 0 && react_1.default.createElement(CsSign, null))),
            react_1.default.createElement(RowCenter, null, eLeg.fisFltSts ? (react_1.default.createElement(FisFltStsLabel_1.default, { isPc: isPc, isDarkMode: false }, eLeg.fisFltSts)) : (eLeg.estLdLcl || eLeg.tentativeEstLdLcl) && !eLeg.actLdLcl ? (react_1.default.createElement(PlaneIcon, null)) : (""))),
        react_1.default.createElement(Col, null,
            react_1.default.createElement(SubCol1, null,
                react_1.default.createElement(Row, null,
                    react_1.default.createElement(Airport, null, eLeg.skdDepApoCd),
                    react_1.default.createElement(TimeColumn, { enabled: timeColumnEnabled, onClick: handleFlightMovement(true) }, eLeg.stdLcl ? (0, dayjs_1.default)(eLeg.stdLcl).format("HHmm") : "\u00A0")),
                react_1.default.createElement(Row, null,
                    react_1.default.createElement(TimeLabelWrapper, null,
                        react_1.default.createElement(Estimate, null, eLeg.atdLcl ? "ATD" : eLeg.etdLcl || eLeg.tentativeEtdLcl ? "ETD" : ""),
                        react_1.default.createElement(TentativeCdWrapper, null, !eLeg.atdLcl && eLeg.tentativeEtdLcl && eLeg.tentativeEtdCd && !eLeg.depMvtSentFlg && (react_1.default.createElement(Label_1.default, { isPc: isPc }, eLeg.tentativeEtdCd))),
                        eLeg.depMvtSentFlg && (react_1.default.createElement(MvtMsgFlgIconWrapper, null,
                            react_1.default.createElement(MvtMsgFlgIcon, null)))),
                    react_1.default.createElement(TimeColumn, { enabled: timeColumnEnabled, onClick: handleFlightMovement(true) }, eLeg.atdLcl
                        ? (0, dayjs_1.default)(eLeg.atdLcl).format("HHmm")
                        : eLeg.tentativeEtdLcl
                            ? (0, dayjs_1.default)(eLeg.tentativeEtdLcl).format("HHmm")
                            : eLeg.etdLcl && eLeg.etdLcl === eLeg.stdLcl
                                ? "SKD"
                                : eLeg.etdLcl
                                    ? (0, dayjs_1.default)(eLeg.etdLcl).format("HHmm")
                                    : ""))),
            react_1.default.createElement(SubCol2, null,
                react_1.default.createElement(Row, null,
                    react_1.default.createElement(Airport, null, eLeg.lstArrApoCd),
                    react_1.default.createElement(TimeColumn, { enabled: timeColumnEnabled, onClick: handleFlightMovement(false) }, eLeg.staLcl && eLeg.skdArrApoCd === eLeg.lstArrApoCd ? (0, dayjs_1.default)(eLeg.staLcl).format("HHmm") : "\u00A0")),
                react_1.default.createElement(Row, null,
                    react_1.default.createElement(TimeLabelWrapper, null,
                        react_1.default.createElement(Estimate, null, eLeg.ataLcl
                            ? "ATA"
                            : eLeg.actLdLcl
                                ? "L/D"
                                : eLeg.tentativeEstLdLcl || eLeg.estLdLcl || eLeg.tentativeEtaLcl || eLeg.etaLcl
                                    ? "ETA"
                                    : ""),
                        react_1.default.createElement(TentativeCdWrapper, null, tentativeEtaCd && !eLeg.arrMvtSentFlg ? react_1.default.createElement(Label_1.default, { isPc: isPc }, tentativeEtaCd) : ""),
                        eLeg.arrMvtSentFlg && (react_1.default.createElement(MvtMsgFlgIconWrapper, null,
                            react_1.default.createElement(MvtMsgFlgIcon, null)))),
                    react_1.default.createElement(TimeColumn, { enabled: timeColumnEnabled, onClick: handleFlightMovement(false) }, eta || ""))),
            eLeg.specialStses && eLeg.specialStses.specialSts.length > 0 && (react_1.default.createElement(SpecialStatusDiv, null,
                react_1.default.createElement(SpecialStatuses_1.default, { specialStses: eLeg.specialStses, arrDepCd: "", width: "224px", isPc: isPc, isDarkMode: false })))),
        storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.iPhone ? (react_1.default.createElement(Col, null,
            react_1.default.createElement(Row, null,
                react_1.default.createElement(StationOperationTask, { onClick: handleStationOperationTask, enabled: !!stationOperationTaskEnabled },
                    react_1.default.createElement("div", null, eLeg.actToLcl ? "-" : eLeg.lstWorkStepShortName))))) : (react_1.default.createElement(Col, null))));
};
const SubCol1 = styled_components_1.default.div `
  display: table-cell;
  min-width: 114px;
`;
const SubCol2 = styled_components_1.default.div `
  display: table-cell;
  min-width: 114px;
`;
const Wrapper = styled_components_1.default.tr `
  background: ${(props) => props.theme.color.FLIGHT_ROW_BACKGROUND_COLOR};
  outline: ${(props) => (props.isSelected ? "2px solid #E6B422" : `2px solid ${props.theme.color.FLIGHT_ROW_BACKGROUND_COLOR}`)};
  cursor: ${({ enabled }) => (enabled ? "pointer" : "auto")};
`;
const Flight = styled_components_1.default.td `
  padding: 10px 0 6px 8px;
  min-width: 80px;
`;
const FlightAlCd = styled_components_1.default.span `
  font-size: 14px;
`;
const FlightNumber = styled_components_1.default.span `
  font-size: 18px;
  line-height: 26px;
  padding-top: 2px;
`;
const CasFlight = styled_components_1.default.span `
  word-break: break-all;
  font-size: ${({ length }) => (length && length > 5 ? "14" : "15")}px;
  line-height: 1;
`;
const CsSign = styled_components_1.default.div `
  align-self: center;
  margin-top: 1px;
  margin-left: 2px;
  width: 8px;
  height: 8px;
  background: #f4f085;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 50%;
`;
const Airport = styled_components_1.default.span `
  width: 58px;
`;
const TimeColumn = styled_components_1.default.div `
  width: 52px;
  height: 100%;
  font-size: 20px;
  line-height: 27px;
  cursor: ${({ enabled }) => (enabled ? "pointer" : "auto")};
  user-select: none;
`;
const TimeLabelWrapper = styled_components_1.default.div `
  display: flex;
  align-self: center;
  width: 58px;
  font-size: 18px;
`;
const Estimate = styled_components_1.default.div `
  font-size: 12px;
`;
const TentativeCdWrapper = styled_components_1.default.div `
  padding-left: 2px;
`;
const MvtMsgFlgIconWrapper = styled_components_1.default.div `
  margin-left: auto;
  line-height: 12px;
  padding-right: 4px;
`;
const MvtMsgFlgIcon = (0, styled_components_1.default)(MvtMsgModal_1.MvtMsgFlgIconSvg) `
  height: 16px;
  width: 16px;
`;
const SpecialStatusDiv = styled_components_1.default.div `
  font-size: 16px;
  color: #98afbf;
  margin-top: -8px;
  margin-bottom: 11px;
  span {
    font-size: 12px;
    margin-right: 10px;
  }
`;
const Row = styled_components_1.default.div `
  display: flex;
  align-items: baseline;
  height: 26px;
`;
const RowCenter = (0, styled_components_1.default)(Row) `
  align-items: center;
`;
const Col = styled_components_1.default.td `
  font-size: 18px;
`;
const PlaneIcon = styled_components_1.default.img.attrs({ src: icon_plane_svg_1.default }) `
  margin-left: 9px;
  width: 25px;
  height: 20px;
`;
const StationOperationTask = styled_components_1.default.div `
  height: 48px;
  width: 48px;
  margin: auto;
  margin-top: 10px;
  margin-left: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  background: #fff;
  font-size: 20px;
  line-height: 27px;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  cursor: ${(props) => (props.enabled ? "pointer" : "auto")};
`;
exports.default = FlightSearchResult;
//# sourceMappingURL=FlightSearchResult.js.map