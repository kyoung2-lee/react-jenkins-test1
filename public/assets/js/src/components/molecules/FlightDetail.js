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
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const lodash_chunk_1 = __importDefault(require("lodash.chunk"));
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const blade_svg_1 = __importDefault(require("../../assets/images/icon/blade.svg"));
const UpdateRmksPopup_1 = __importDefault(require("./UpdateRmksPopup"));
const _1_BO_animated_png_1 = __importDefault(require("../../assets/images/flight_detail/1.BO_animated.png"));
const _2_BC_png_1 = __importDefault(require("../../assets/images/flight_detail/2.BC.png"));
const _3_DOR_png_1 = __importDefault(require("../../assets/images/flight_detail/3.DOR.png"));
const _4_DEP_TAXI_png_1 = __importDefault(require("../../assets/images/flight_detail/4.DEP_TAXI.png"));
const _5_TakeOff_png_1 = __importDefault(require("../../assets/images/flight_detail/5.TakeOff.png"));
const _6_IN_FLT_png_1 = __importDefault(require("../../assets/images/flight_detail/6.IN_FLT.png"));
const _7_APP_animated_png_1 = __importDefault(require("../../assets/images/flight_detail/7.APP_animated.png"));
const _8_ARR_TAXI_png_1 = __importDefault(require("../../assets/images/flight_detail/8.ARR_TAXI.png"));
const _9_ATA_png_1 = __importDefault(require("../../assets/images/flight_detail/9.ATA.png"));
const FlightDetail = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const flightDetailScrollRefDefault = (0, react_1.useRef)(null);
    const flightDetailScrollRef = props.scrollContentRef || flightDetailScrollRefDefault;
    const depRmksTextRef = (0, react_1.useRef)(null);
    const arrRmksTextRef = (0, react_1.useRef)(null);
    const [depRmksTextModalIsOpen, setDepRmksTextModalIsOpen] = (0, react_1.useState)(false);
    const [arrRmksTextModalIsOpen, setArrRmksTextModalIsOpen] = (0, react_1.useState)(false);
    const [rmksTextModalWidth, setRmksTextModalWidth] = (0, react_1.useState)(0);
    const [rmksTextModalHeight, setRmksTextModalHeight] = (0, react_1.useState)(0);
    const [rmksTextModalTop, setRmksTextModalTop] = (0, react_1.useState)(0);
    const [rmksTextModalLeft, setRmksTextModalLeft] = (0, react_1.useState)(0);
    const { isPc, isIpad } = storage_1.storage;
    (0, react_1.useEffect)(() => {
        if (flightDetailScrollRef.current) {
            flightDetailScrollRef.current.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getEta = (isUtc, flightDetail) => {
        if (isUtc) {
            if (flightDetail.arr.tentativeEstLdUtc) {
                return flightDetail.arr.tentativeEstLdUtc;
            }
            if (flightDetail.arr.estLdUtc) {
                return flightDetail.arr.estLdUtc;
            }
            if (flightDetail.arr.tentativeEtaUtc) {
                return flightDetail.arr.tentativeEtaUtc;
            }
            if (flightDetail.arr.etaUtc && flightDetail.arr.etaUtc === flightDetail.arr.staUtc) {
                return "SKD";
            }
            return flightDetail.arr.etaUtc;
        }
        if (flightDetail.arr.tentativeEstLdLcl) {
            return flightDetail.arr.tentativeEstLdLcl;
        }
        if (flightDetail.arr.estLdLcl) {
            return flightDetail.arr.estLdLcl;
        }
        if (flightDetail.arr.tentativeEtaLcl) {
            return flightDetail.arr.tentativeEtaLcl;
        }
        if (flightDetail.arr.etaLcl && flightDetail.arr.etaLcl === flightDetail.arr.staLcl) {
            return "SKD";
        }
        return flightDetail.arr.etaLcl;
    };
    const getTentativeEtaCd = (isUtc, flightDetail) => {
        if (isUtc) {
            if (flightDetail.arr.tentativeEstLdUtc) {
                return flightDetail.arr.tentativeEstLdCd;
            }
            if (!flightDetail.arr.estLdUtc && flightDetail.arr.tentativeEtaUtc) {
                return flightDetail.arr.tentativeEtaCd;
            }
            return "";
        }
        if (flightDetail.arr.tentativeEstLdLcl) {
            return flightDetail.arr.tentativeEstLdCd;
        }
        if (!flightDetail.arr.estLdLcl && flightDetail.arr.tentativeEtaLcl) {
            return flightDetail.arr.tentativeEtaCd;
        }
        return "";
    };
    const getCurrentWorkStepSeq = (standardWorkStep) => {
        let currentWorkStepSeq = -1;
        for (let i = 0; i < standardWorkStep.length; i++) {
            if (standardWorkStep[i].workEndFlg) {
                currentWorkStepSeq = standardWorkStep[i].workStepSeq + 1;
            }
        }
        return currentWorkStepSeq;
    };
    const openDepRmksText = () => {
        if (isRmksEnabled(props.flightDetail.dep.lstDepApoCd)) {
            const { flightKey } = props;
            const openRmksPopup = () => {
                const nodeDepRmksText = depRmksTextRef.current;
                const nodeWrapper = flightDetailScrollRef.current;
                if (nodeDepRmksText && nodeWrapper) {
                    const nodeDepRmksTextTop = nodeDepRmksText.getBoundingClientRect().top;
                    const nodeWrapperTop = nodeWrapper.getBoundingClientRect().top;
                    setDepRmksTextModalIsOpen(true);
                    setRmksTextModalWidth(nodeDepRmksText.clientWidth);
                    setRmksTextModalHeight(nodeDepRmksText.clientHeight);
                    setRmksTextModalTop(nodeDepRmksTextTop < nodeWrapperTop || !isPc ? nodeWrapperTop : nodeDepRmksTextTop);
                    setRmksTextModalLeft(nodeDepRmksText.getBoundingClientRect().left);
                }
            };
            const closeRmksPopup = () => {
                setDepRmksTextModalIsOpen(false);
            };
            void dispatch(props.fetchFlightDetail({ flightKey, isReload: true, openRmksPopup, closeRmksPopup }));
        }
    };
    const openArrRmksText = () => {
        if (isRmksEnabled(props.flightDetail.arr.lstArrApoCd)) {
            const { flightKey } = props;
            const openRmksPopup = () => {
                const nodeArrRmksText = arrRmksTextRef.current;
                const nodeWrapper = flightDetailScrollRef.current;
                if (nodeArrRmksText && nodeWrapper) {
                    const nodeArrRmksTextTop = nodeArrRmksText.getBoundingClientRect().top;
                    const nodeWrapperTop = nodeWrapper.getBoundingClientRect().top;
                    setArrRmksTextModalIsOpen(true);
                    setRmksTextModalWidth(nodeArrRmksText.clientWidth);
                    setRmksTextModalHeight(nodeArrRmksText.clientHeight);
                    setRmksTextModalTop(nodeArrRmksTextTop < nodeWrapperTop || !isPc ? nodeWrapperTop : nodeArrRmksTextTop);
                    setRmksTextModalLeft(nodeArrRmksText.getBoundingClientRect().left);
                }
            };
            const closeRmksPopup = () => {
                setDepRmksTextModalIsOpen(false);
            };
            void dispatch(props.fetchFlightDetail({ flightKey, isReload: true, openRmksPopup, closeRmksPopup }));
        }
    };
    const closeDepRmksText = (rmksText) => {
        if (props.flightDetail.dep.depRmksText === rmksText) {
            setDepRmksTextModalIsOpen(false);
        }
        else {
            void dispatch(props.showConfirmation({
                onClickYes: () => {
                    setDepRmksTextModalIsOpen(false);
                },
            }));
        }
    };
    const closeArrRmksText = (rmksText) => {
        if (props.flightDetail.arr.arrRmksText === rmksText) {
            setArrRmksTextModalIsOpen(false);
        }
        else {
            void dispatch(props.showConfirmation({
                onClickYes: () => {
                    setArrRmksTextModalIsOpen(false);
                },
            }));
        }
    };
    const isRmksEnabled = (apoCd) => props.connectDbCat === "O" &&
        props.jobAuth.user.myApoCd === apoCd &&
        (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateFlightRemarks, props.jobAuth.jobAuth);
    const { flightDetail, flightKey, master, isUtc, scrollContentOnClick } = props;
    if (!flightDetail) {
        return react_1.default.createElement(Wrapper, { ref: flightDetailScrollRef, onClick: scrollContentOnClick });
    }
    let announceToPaxUrl = "";
    if (flightDetail && flightDetail.dep && flightDetail.flight) {
        // マスタデータから、際内区分とデバイス区分を基にして、遷移先のベースURLを取得します
        const intDom = flightDetail.flight.intDomCat === "D" ? "DOM" : "INT";
        const terminalCatCode = isPc ? "PC" : isIpad ? "IPAD" : "IPHONE";
        const targetCdCtrlDtl013 = master.cdCtrlDtls.find((e) => e.cdCls === "013" && e.cdCat1 === `${intDom}.${terminalCatCode}`);
        if (targetCdCtrlDtl013) {
            const { txt1, txt2, txt3, txt4, txt5 } = targetCdCtrlDtl013;
            const urlTemplate = (txt1 !== null && txt1 !== void 0 ? txt1 : "") + (txt2 !== null && txt2 !== void 0 ? txt2 : "") + (txt3 !== null && txt3 !== void 0 ? txt3 : "") + (txt4 !== null && txt4 !== void 0 ? txt4 : "") + (txt5 !== null && txt5 !== void 0 ? txt5 : "");
            // マスタデータから、ICAO航空会社コードを取得します
            const alCdCtrlDtl012 = master.cdCtrlDtls.find((e) => e.cdCls === "012" && e.cdCat1 === flightDetail.flight.alCd);
            // URLのパラメータを設定
            const icaoAirlineCode = alCdCtrlDtl012 ? alCdCtrlDtl012.cd1 : ""; // 航空会社コード（３レター）
            const airlineCode = flightDetail.flight.alCd; // 航空会社コード（２レター）
            const trCode = flightDetail.flight.trAlCd; // 運送会社コード（２レター）
            const flightNo = flightDetail.flight.fltNo; // 便番号
            const depDate = (0, dayjs_1.default)(flightDetail.dep.stdLcl, "YYYY-MM-DDTHH:mm:ss").isValid()
                ? (0, dayjs_1.default)(flightDetail.dep.stdLcl, "YYYY-MM-DDTHH:mm:ss").format("YYYYMMDD")
                : ""; // STD LOCAL（YYYYMMDD形式）
            const variables = { icaoAirlineCode, airlineCode, trCode, flightNo, depDate };
            announceToPaxUrl = urlTemplate.replace(/{(.*?)}/g, (_, key) => variables[key] || `{${key}}`);
        }
    }
    // JAL便判定用
    const airline = master.airlines.find((al) => al.alCd === flightDetail.flight.alCd);
    const jalGrpFlg = airline ? airline.jalGrpFlg : false;
    const edctStatusSign = flightDetail.flight.actEdctUtc ? "Assign" : flightDetail.flight.estEdctUtc ? "Expect" : "";
    const edct = isUtc
        ? flightDetail.flight.actEdctUtc || flightDetail.flight.estEdctUtc
        : flightDetail.flight.actEdctLcl || flightDetail.flight.estEdctLcl;
    const eobt = isUtc
        ? flightDetail.flight.actEdctUtc && flightDetail.flight.actEobtUtc
            ? flightDetail.flight.actEobtUtc
            : ""
        : flightDetail.flight.actEdctLcl && flightDetail.flight.actEobtLcl
            ? flightDetail.flight.actEobtLcl
            : "";
    const edctAndEft = isUtc
        ? flightDetail.dep.sumActEdctUtcAndEftMin || flightDetail.dep.sumEstEdctUtcAndEftMin
        : flightDetail.dep.sumActEdctLclAndEftMin || flightDetail.dep.sumEstEdctLclAndEftMin;
    const std = isUtc ? flightDetail.dep.stdUtc : flightDetail.dep.stdLcl;
    const etd = isUtc
        ? flightDetail.dep.tentativeEtdUtc
            ? flightDetail.dep.tentativeEtdUtc
            : flightDetail.dep.etdUtc && flightDetail.dep.etdUtc === flightDetail.dep.stdUtc
                ? "SKD"
                : flightDetail.dep.etdUtc
        : flightDetail.dep.tentativeEtdLcl
            ? flightDetail.dep.tentativeEtdLcl
            : flightDetail.dep.etdLcl && flightDetail.dep.etdLcl === flightDetail.dep.stdLcl
                ? "SKD"
                : flightDetail.dep.etdLcl;
    // tentativeEtdをみてtentativeEtdCdが表示するべきか判定
    const tentativeEtdCd = isUtc
        ? flightDetail.dep.tentativeEtdUtc
            ? flightDetail.dep.tentativeEtdCd
            : ""
        : flightDetail.dep.tentativeEtdLcl
            ? flightDetail.dep.tentativeEtdCd
            : "";
    const tentativeEtaCd = getTentativeEtaCd(isUtc, flightDetail);
    const atd = isUtc ? flightDetail.dep.atdUtc : flightDetail.dep.atdLcl;
    const actTo = isUtc ? flightDetail.dep.actToUtc : flightDetail.dep.actToLcl;
    const sta = isUtc ? flightDetail.arr.staUtc : flightDetail.arr.staLcl;
    const eta = getEta(isUtc, flightDetail);
    const actLd = isUtc ? flightDetail.arr.actLdUtc : flightDetail.arr.actLdLcl;
    const ata = isUtc ? flightDetail.arr.ataUtc : flightDetail.arr.ataLcl;
    const currentWorkStepSeq = flightDetail.dep.workStep ? getCurrentWorkStepSeq(flightDetail.dep.workStep) : -1;
    // Announce to PAX 表示用
    const paramIsExist = flightDetail.flight.trAlCd != null &&
        flightDetail.flight.trAlCd.length > 0 &&
        flightDetail.flight.fltNo != null &&
        flightDetail.flight.fltNo.length > 0 &&
        (flightDetail.dep.atdLcl || flightDetail.dep.etdLcl || flightDetail.dep.stdLcl);
    const targetCdCtrlDtl = master.cdCtrlDtls.find((e) => e.cdCls === "012" && e.cdCat1 === flightDetail.flight.trAlCd);
    const depDlyRsnCd = flightDetail && flightDetail.dep && flightDetail.dep.depDlyRsnCd ? flightDetail.dep.depDlyRsnCd : [];
    const depDlyTime = flightDetail && flightDetail.dep && flightDetail.dep.depDlyTime ? flightDetail.dep.depDlyTime : [];
    const hasDepDly = !!(depDlyRsnCd.length && depDlyTime.length);
    const arrDlyRsnCd = flightDetail && flightDetail.arr && flightDetail.arr.arrDlyRsnCd ? flightDetail.arr.arrDlyRsnCd : [];
    const arrDlyTime = flightDetail && flightDetail.arr && flightDetail.arr.arrDlyTime ? flightDetail.arr.arrDlyTime : [];
    const hasArrDly = !!(arrDlyRsnCd.length && arrDlyTime.length);
    const FlightStatusImage = ata ? (react_1.default.createElement(FlightStatusImageAta, null)) : actLd && !ata ? (react_1.default.createElement(FlightStatusImageAppTaxi, null)) : actTo && !actLd && flightDetail.flight.fisFltSts === "APP" ? (react_1.default.createElement(FlightStatusImageApp, null)) : actTo && !actLd && flightDetail.flight.fisFltSts === "T/O" ? (react_1.default.createElement(FlightStatusImageTakeOff, null)) : actTo && !actLd ? (react_1.default.createElement(FlightStatusImageInFlt, null)) : atd && !actTo ? (react_1.default.createElement(FlightStatusImageDepTaxi, null)) : !atd && (flightDetail.flight.fisFltSts === "DOR" || flightDetail.flight.fisFltSts === "ENG") ? (react_1.default.createElement(FlightStatusImageDor, null)) : !atd && flightDetail.dep.boardingSts === "BC" ? (react_1.default.createElement(FlightStatusImageBc, null)) : !atd && flightDetail.dep.boardingSts === "BO" ? (react_1.default.createElement(FlightStatusImageBo, null)) : ("");
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Wrapper, { key: "flightDetailContent", ref: flightDetailScrollRef, tabIndex: -1, onClick: scrollContentOnClick },
            react_1.default.createElement(Content1, null,
                react_1.default.createElement(HeaderTable, null,
                    react_1.default.createElement("tbody", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", { key: `FlightDetailThShipConfEqp_${Date.now()}` }, "SHIP/CONF/EQP"),
                            react_1.default.createElement("td", { className: "text_center" }, flightDetail.flight.shipNo),
                            react_1.default.createElement("td", { className: "text_center" }, flightDetail.flight.seatConfCd),
                            react_1.default.createElement("td", { className: "text_center" },
                                flightDetail.flight.equipment,
                                flightDetail.flight.wingletFlg && react_1.default.createElement(BladeIcon, null))),
                        (flightDetail.flight.mayrtnFlg || flightDetail.flight.maydivFlg) && (react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "MDC/MRC"),
                            react_1.default.createElement("td", { colSpan: 3 },
                                react_1.default.createElement("div", { className: "tdContent" },
                                    flightDetail.flight.maydivFlg && (react_1.default.createElement("span", { className: "label", style: { marginRight: "2px" } }, "MDC")),
                                    flightDetail.flight.maydivFlg && (react_1.default.createElement("span", { style: { fontSize: "15px" } }, flightDetail.flight.maydivApoCd ? flightDetail.flight.maydivApoCd.join("/") : "")),
                                    flightDetail.flight.mayrtnFlg && (react_1.default.createElement("span", { className: "label", style: { marginLeft: "7px" } }, "MRC")))))),
                        (flightDetail.flight.divFlg || flightDetail.flight.atbFlg || flightDetail.flight.gtbFlg) && (react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "DIV/ATB/GTB"),
                            react_1.default.createElement("td", { colSpan: 3 },
                                react_1.default.createElement("div", { className: "tdContent" },
                                    flightDetail.flight.divFlg && (react_1.default.createElement(react_1.default.Fragment, null,
                                        react_1.default.createElement("span", { className: "label" },
                                            "DIV\u25B6",
                                            flightDetail.arr.lstArrApoCd))),
                                    flightDetail.flight.atbFlg && (react_1.default.createElement(react_1.default.Fragment, null,
                                        react_1.default.createElement("span", { className: "label" }, "ATB"))),
                                    flightDetail.flight.gtbFlg && (react_1.default.createElement(react_1.default.Fragment, null,
                                        react_1.default.createElement("span", { className: "label" }, "GTB")))))))))),
            react_1.default.createElement(Content2, null,
                react_1.default.createElement("div", { className: "taskMonitor" },
                    react_1.default.createElement("div", { className: "taskMonitorRow1" }, !!flightDetail.dep.workStep &&
                        flightDetail.dep.workStep
                            .filter((ws) => ws.fisDispFlg)
                            .map((step, index) => {
                            const complete = step.workEndFlg;
                            const current = currentWorkStepSeq === step.workStepSeq;
                            return (react_1.default.createElement("svg", { width: "60", height: "50", viewBox: current ? "0 -4 67 47" : "0 -8 67 47", stroke: complete ? "#222222" : current ? "none" : "#2799c6", style: { zIndex: flightDetail.dep.workStep && flightDetail.dep.workStep.length - index }, key: step.workStepSeq },
                                react_1.default.createElement("polygon", { points: current ? "0,0 54,0 66,22 54,44 0,44" : "0,0 54,0 66,18 54,36 0,36", fill: complete ? "#c9d3d0" : current ? "#32bbe5" : "#ffffff" }),
                                react_1.default.createElement("text", { x: "28", y: current ? 16 : 22, fontSize: "12", fontFamily: "Avenir", fontWeight: current ? 500 : 300, fill: complete ? "#222222" : current ? "#ffffff" : "#2799c6", stroke: "none", textAnchor: "middle" }, step.workStepName.split("<br>").map((word, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                react_1.default.createElement("tspan", { x: "30", y: current ? 19 + i * 15 : 16 + i * 13, key: i }, word))))));
                        })),
                    react_1.default.createElement("div", { className: "taskMonitorRow2" },
                        react_1.default.createElement("table", null,
                            react_1.default.createElement("tbody", null,
                                react_1.default.createElement("tr", null,
                                    react_1.default.createElement("th", null, "PLN"),
                                    flightKey.oalTblFlg ? (flightDetail.dep.workStep && flightDetail.dep.workStep.length ? (flightDetail.dep.workStep
                                        .filter((ws) => ws.fisDispFlg)
                                        .map((step) => {
                                        const plan = isUtc ? step.planWorkEndTimeUtc : step.planWorkEndTimeLcl;
                                        return react_1.default.createElement("td", { key: step.workStepSeq }, plan ? (0, dayjs_1.default)(plan).format("HHmm") : "");
                                    })) : (react_1.default.createElement(react_1.default.Fragment, null,
                                        react_1.default.createElement("td", null),
                                        react_1.default.createElement("td", null),
                                        react_1.default.createElement("td", null),
                                        react_1.default.createElement("td", null),
                                        react_1.default.createElement("td", null),
                                        react_1.default.createElement("td", null)))) : (react_1.default.createElement(react_1.default.Fragment, null,
                                        react_1.default.createElement("td", null, "-"),
                                        react_1.default.createElement("td", null, "-"),
                                        react_1.default.createElement("td", null, "-"),
                                        react_1.default.createElement("td", null, "-"),
                                        react_1.default.createElement("td", null, "-"),
                                        react_1.default.createElement("td", null, "-")))),
                                react_1.default.createElement("tr", null,
                                    react_1.default.createElement("th", null, "ACT"),
                                    flightDetail.dep.workStep && flightDetail.dep.workStep.length ? (flightDetail.dep.workStep
                                        .filter((ws) => ws.fisDispFlg)
                                        .map((step) => {
                                        const act = isUtc ? step.actWorkEndTimeUtc : step.actWorkEndTimeLcl;
                                        return react_1.default.createElement("td", { key: step.workStepSeq }, act ? (0, dayjs_1.default)(act).format("HHmm") : step.workAutoEndFlg ? "-" : "");
                                    })) : (react_1.default.createElement(react_1.default.Fragment, null,
                                        react_1.default.createElement("td", null),
                                        react_1.default.createElement("td", null),
                                        react_1.default.createElement("td", null),
                                        react_1.default.createElement("td", null),
                                        react_1.default.createElement("td", null),
                                        react_1.default.createElement("td", null))))))))),
            react_1.default.createElement(Content3, null,
                react_1.default.createElement(Table, null,
                    react_1.default.createElement("colgroup", null,
                        react_1.default.createElement("col", null),
                        react_1.default.createElement("col", null),
                        react_1.default.createElement("col", null),
                        react_1.default.createElement("col", null),
                        react_1.default.createElement("col", null),
                        react_1.default.createElement("col", null)),
                    react_1.default.createElement("tbody", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "Ck-in"),
                            react_1.default.createElement("td", { className: "text_center" }, flightDetail.dep.acceptanceSts),
                            react_1.default.createElement("th", null, "Gate"),
                            react_1.default.createElement("td", { className: "text_center" }, flightDetail.dep.boardingSts),
                            react_1.default.createElement("th", null, "WB"),
                            react_1.default.createElement("td", { className: "text_center" }, flightDetail.dep.lsFlg && "WB")),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "Fuel"),
                            react_1.default.createElement("td", { colSpan: 5 },
                                react_1.default.createElement("div", { className: "tdContent" },
                                    (0, commonUtil_1.separateWithComma)(flightDetail.dep.rampFuelLbsWt),
                                    flightDetail.dep.fuelOrderFlg && react_1.default.createElement(SquareS, null, "S"))))))),
            react_1.default.createElement(ContentDivider, null),
            react_1.default.createElement(FlightStatusContent, { marginBottom: FlightStatusImage ? 13 : 5 }, FlightStatusImage),
            react_1.default.createElement(Content4, { isPc: isPc },
                react_1.default.createElement("div", { className: "title" },
                    react_1.default.createElement("div", { className: "apoCd" },
                        react_1.default.createElement("small", null, "DEP"),
                        flightDetail.dep.lstDepApoCd),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("small", null, "Spot"),
                        flightDetail.dep.depApoSpotNo),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("small", null, "Gate"),
                        flightDetail.dep.depGateNo),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("small", null, "EFT"),
                        flightDetail.dep.eftMin &&
                            `00${Math.floor(flightDetail.dep.eftMin / 60)}`.slice(-2) + `00${flightDetail.dep.eftMin % 60}`.slice(-2))),
                react_1.default.createElement(Table, null,
                    react_1.default.createElement("tbody", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "STD"),
                            react_1.default.createElement("th", null,
                                "ETD",
                                tentativeEtdCd && react_1.default.createElement("span", { className: "tentativeCd" }, tentativeEtdCd)),
                            react_1.default.createElement("th", null, "ATD"),
                            react_1.default.createElement("th", null, "T/O")),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", null, std && (0, dayjs_1.default)(std).format("DDHHmm")),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("div", null, etd === "SKD" ? "SKD" : etd && (0, dayjs_1.default)(etd).format("DDHHmm"))),
                            react_1.default.createElement("td", null, atd && (0, dayjs_1.default)(atd).format("DDHHmm")),
                            react_1.default.createElement("td", null, actTo && (0, dayjs_1.default)(actTo).format("DDHHmm"))),
                        edctStatusSign && (react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", { colSpan: 4 }, "ATC Flow Control"))),
                        edctStatusSign && (react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", { colSpan: 4, className: "left" },
                                edctStatusSign && react_1.default.createElement(AtcStyledLabel, null, edctStatusSign),
                                eobt && (react_1.default.createElement(AtcColumn, null,
                                    react_1.default.createElement("label", null, "EOBT"),
                                    (0, dayjs_1.default)(eobt).format("HHmm"))),
                                edct && (react_1.default.createElement(AtcColumn, null,
                                    react_1.default.createElement("label", null, "EDCT"),
                                    (0, dayjs_1.default)(edct).format("HHmm"))),
                                edctAndEft && (react_1.default.createElement(AtcColumn, null,
                                    react_1.default.createElement("label", null, "EDCT+EFT"),
                                    (0, dayjs_1.default)(edctAndEft).format("HHmm")))))),
                        hasDepDly && (react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", { colSpan: 3 }, "DLY Time/Reason"))),
                        hasDepDly && (react_1.default.createElement("tr", null, (() => {
                            const dlyList = [];
                            for (let i = 0; i < 3; i++) {
                                if (depDlyTime[i]) {
                                    dlyList.push(react_1.default.createElement("td", { key: i },
                                        `0000${depDlyTime[i]}`.slice(-4),
                                        depDlyRsnCd[i] || ""));
                                }
                                else {
                                    dlyList.push(react_1.default.createElement("td", { key: i }));
                                }
                            }
                            return dlyList;
                        })())))),
                react_1.default.createElement(RmksText, { enabled: isRmksEnabled(flightDetail.dep.lstDepApoCd), ref: depRmksTextRef, onClick: openDepRmksText }, flightDetail.dep.depRmksText ? flightDetail.dep.depRmksText : react_1.default.createElement(PlaceHolder, null, "DEP Flight Remarks"))),
            react_1.default.createElement(Content5, { isPc: isPc },
                react_1.default.createElement("div", { className: "title" },
                    react_1.default.createElement("div", { className: "apoCd" },
                        react_1.default.createElement("small", null, "ARR"),
                        flightDetail.arr.lstArrApoCd),
                    react_1.default.createElement("div", { className: "spot" },
                        react_1.default.createElement("small", null, "Spot"),
                        flightDetail.arr.arrApoSpotNo),
                    (flightDetail.flight.atbFlg || flightDetail.flight.divFlg) && (react_1.default.createElement("div", { className: "originalStation" },
                        react_1.default.createElement("small", null, "Original"),
                        react_1.default.createElement("span", null, flightDetail.arr.skdArrApoCd),
                        sta && (0, dayjs_1.default)(sta).isValid() && (0, dayjs_1.default)(sta).format("HHmm")))),
                react_1.default.createElement(Table, null,
                    react_1.default.createElement("tbody", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "STA"),
                            react_1.default.createElement("th", null,
                                "ETA",
                                tentativeEtaCd && react_1.default.createElement("span", { className: "tentativeCd" }, tentativeEtaCd)),
                            react_1.default.createElement("th", null, "L/D"),
                            react_1.default.createElement("th", null, "ATA")),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", null, flightDetail.flight.atbFlg || flightDetail.flight.divFlg ? "" : sta && (0, dayjs_1.default)(sta).format("DDHHmm")),
                            react_1.default.createElement("td", null, eta === "SKD" ? "SKD" : eta && (0, dayjs_1.default)(eta).format("DDHHmm")),
                            react_1.default.createElement("td", null, actLd && (0, dayjs_1.default)(actLd).format("DDHHmm")),
                            react_1.default.createElement("td", null, ata && (0, dayjs_1.default)(ata).format("DDHHmm"))),
                        hasArrDly && (react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", { colSpan: 3 }, "DLY Time/Reason"))),
                        hasArrDly && (react_1.default.createElement("tr", null, (() => {
                            const dlyList = [];
                            for (let i = 0; i < 3; i++) {
                                if (arrDlyTime[i]) {
                                    dlyList.push(react_1.default.createElement("td", { key: i },
                                        `0000${arrDlyTime[i]}`.slice(-4),
                                        arrDlyRsnCd[i] || ""));
                                }
                                else {
                                    dlyList.push(react_1.default.createElement("td", { key: i }));
                                }
                            }
                            return dlyList;
                        })())))),
                react_1.default.createElement(RmksText, { enabled: isRmksEnabled(flightDetail.arr.lstArrApoCd), ref: arrRmksTextRef, onClick: openArrRmksText }, flightDetail.arr.arrRmksText ? flightDetail.arr.arrRmksText : react_1.default.createElement(PlaceHolder, null, "ARR Flight Remarks"))),
            react_1.default.createElement(ContentDivider, null),
            react_1.default.createElement(Content6, null,
                react_1.default.createElement("div", { className: "title" }, "Passenger Information"),
                react_1.default.createElement(Table, null,
                    react_1.default.createElement("tbody", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null),
                            react_1.default.createElement("th", null, "F"),
                            react_1.default.createElement("th", null, "C/J"),
                            react_1.default.createElement("th", null, "Y"),
                            react_1.default.createElement("th", null, "Total"),
                            react_1.default.createElement("th", null, "INFT")),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", { className: "tdHead" }, "Salable"),
                            react_1.default.createElement("td", null, flightDetail.pax.salable.fCls),
                            react_1.default.createElement("td", null, flightDetail.pax.salable.cCls === null && flightDetail.pax.salable.jCls === null
                                ? ""
                                : flightDetail.pax.salable.cCls + flightDetail.pax.salable.jCls),
                            react_1.default.createElement("td", null, flightDetail.pax.salable.yCls),
                            react_1.default.createElement("td", null, flightDetail.pax.salable.fCls === null &&
                                flightDetail.pax.salable.cCls === null &&
                                flightDetail.pax.salable.jCls === null &&
                                flightDetail.pax.salable.yCls === null
                                ? ""
                                : flightDetail.pax.salable.total),
                            react_1.default.createElement("td", null, "-")),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", { className: "tdHead" }, "Booked"),
                            react_1.default.createElement("td", null, flightDetail.pax.booked.fCls),
                            react_1.default.createElement("td", null, flightDetail.pax.booked.cCls === null && flightDetail.pax.booked.jCls === null
                                ? ""
                                : flightDetail.pax.booked.cCls + flightDetail.pax.booked.jCls),
                            react_1.default.createElement("td", null, flightDetail.pax.booked.yCls),
                            react_1.default.createElement("td", null, flightDetail.pax.booked.fCls === null &&
                                flightDetail.pax.booked.cCls === null &&
                                flightDetail.pax.booked.jCls === null &&
                                flightDetail.pax.booked.yCls === null
                                ? ""
                                : flightDetail.pax.booked.total),
                            react_1.default.createElement("td", null, "-")),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", { className: "tdHead" }, "Actual"),
                            react_1.default.createElement("td", null, flightDetail.pax.actual.fCls),
                            react_1.default.createElement("td", null, flightDetail.pax.actual.cCls === null && flightDetail.pax.actual.jCls === null
                                ? ""
                                : flightDetail.pax.actual.cCls + flightDetail.pax.actual.jCls),
                            react_1.default.createElement("td", null, flightDetail.pax.actual.yCls),
                            react_1.default.createElement("td", null, flightDetail.pax.actual.fCls === null &&
                                flightDetail.pax.actual.cCls === null &&
                                flightDetail.pax.actual.jCls === null &&
                                flightDetail.pax.actual.yCls === null
                                ? ""
                                : flightDetail.pax.actual.total),
                            react_1.default.createElement("td", null, flightDetail.pax.actual.inft && `+${flightDetail.pax.actual.inft}`)))),
                paramIsExist &&
                    flightDetail.flight.paxCgoCat === "PAX" &&
                    jalGrpFlg === true &&
                    (flightDetail.flight.svcTypeDiaCd === "OPEN" ||
                        flightDetail.flight.svcTypeDiaCd === "CHTR" ||
                        flightDetail.flight.svcTypeDiaCd === "PFRY") &&
                    (flightDetail.flight.intDomCat !== "D" || targetCdCtrlDtl ? (isPc ? (react_1.default.createElement("a", { 
                        // eslint-disable-next-line no-script-url
                        href: announceToPaxUrl || "javascript:void(0)", target: "_blank", rel: "noopener noreferrer", className: "announceToPax" },
                        "Announce to PAX",
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faBullhorn })))) : (
                    // iOSアプリのブラウザで開く
                    react_1.default.createElement("a", { 
                        // eslint-disable-next-line no-script-url
                        href: announceToPaxUrl ? `app:${announceToPaxUrl}` : "javascript:void(0)", target: "_blank", rel: "noopener noreferrer", className: "announceToPax" },
                        "Announce to PAX",
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faBullhorn })))
                    // ポップアップで開く場合 ＊一応ソースを残した
                    // <div className="announceToPax" onClick={() => this.props.openAnnounceToPax(announceToPaxUrl)}>
                    //   Announce to PAX<div><FontAwesomeIcon icon={faBullhorn} /></div>
                    // </div>
                    )) : (""))),
            react_1.default.createElement(ContentDivider, null),
            react_1.default.createElement(Content7, null,
                react_1.default.createElement("div", { className: "title" }, "Crew Information"),
                react_1.default.createElement("div", { className: "heading" },
                    react_1.default.createElement("div", { className: "colorHeading" }, "Cockpit Crew"),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("small", null, "Total"),
                        flightDetail.crew.ccCnt === null && flightDetail.crew.asCrewTtlCnt === null
                            ? ""
                            : flightDetail.crew.ccCnt + flightDetail.crew.asCrewTtlCnt),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("small", null, "D/H"),
                        flightDetail.crew.dhCcCnt),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("small", null, "CAT(FLT)"),
                        flightDetail.crew.fltWqCd)),
                react_1.default.createElement(Table, null,
                    react_1.default.createElement("tbody", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "PIC"),
                            react_1.default.createElement("td", { colSpan: 3 },
                                flightDetail.crew.pic.familyName,
                                " ",
                                flightDetail.crew.pic.initialName)),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "from"),
                            react_1.default.createElement("td", null, flightDetail.crew.pic.crewfromFltNo /* null + null = 0  になるので気をつける */ &&
                                (flightDetail.crew.pic.crewfromAlCd || "") +
                                    (0, commonUtil_1.formatFltNo)(flightDetail.crew.pic.crewfromFltNo) +
                                    (flightDetail.crew.pic.crewfromOrgDateLcl ? `/${(0, dayjs_1.default)(flightDetail.crew.pic.crewfromOrgDateLcl).format("DD")}` : "")),
                            react_1.default.createElement("th", null, "to"),
                            react_1.default.createElement("td", null, flightDetail.crew.pic.crewnextFltNo /* null + null = 0  になるので気をつける */ &&
                                (flightDetail.crew.pic.crewnextAlCd || "") +
                                    (0, commonUtil_1.formatFltNo)(flightDetail.crew.pic.crewnextFltNo) +
                                    (flightDetail.crew.pic.crewnextOrgDateLcl ? `/${(0, dayjs_1.default)(flightDetail.crew.pic.crewnextOrgDateLcl).format("DD")}` : ""))))),
                react_1.default.createElement("div", { className: "heading" },
                    react_1.default.createElement("div", { className: "colorHeading" }, "Cabin Crew"),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("small", null, "Total"),
                        flightDetail.crew.caCnt),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("small", null, "D/H"),
                        flightDetail.crew.dhCaCnt)),
                react_1.default.createElement(Table, null,
                    react_1.default.createElement("tbody", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "CF"),
                            react_1.default.createElement("td", { colSpan: 3 },
                                flightDetail.crew.cf.familyName,
                                " ",
                                flightDetail.crew.cf.initialName)),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "from"),
                            react_1.default.createElement("td", null, flightDetail.crew.cf.crewfromFltNo /* null + null = 0  になるので気をつける */ &&
                                (flightDetail.crew.cf.crewfromAlCd || "") +
                                    (0, commonUtil_1.formatFltNo)(flightDetail.crew.cf.crewfromFltNo) +
                                    (flightDetail.crew.cf.crewfromOrgDateLcl ? `/${(0, dayjs_1.default)(flightDetail.crew.cf.crewfromOrgDateLcl).format("DD")}` : "")),
                            react_1.default.createElement("th", null, "to"),
                            react_1.default.createElement("td", null, flightDetail.crew.cf.crewnextFltNo /* null + null = 0  になるので気をつける */ &&
                                (flightDetail.crew.cf.crewnextAlCd || "") +
                                    (0, commonUtil_1.formatFltNo)(flightDetail.crew.cf.crewnextFltNo) +
                                    (flightDetail.crew.cf.crewnextOrgDateLcl ? `/${(0, dayjs_1.default)(flightDetail.crew.cf.crewnextOrgDateLcl).format("DD")}` : ""))))),
                !!(flightDetail.crew && flightDetail.crew.other && flightDetail.crew.other.length) && [
                    react_1.default.createElement("div", { key: "scheduleCrewOtherHeading", className: "heading" },
                        react_1.default.createElement("div", { className: "colorHeading" }, "Other")),
                    react_1.default.createElement(Table, { key: "scheduleCrewOtherTable" },
                        react_1.default.createElement("tbody", null, flightDetail.crew.other.map((oth, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        react_1.default.createElement(react_1.default.Fragment, { key: index },
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement("th", null, "Code"),
                                react_1.default.createElement("td", null, oth.otherCrewCat === "P"
                                    ? "As Pax"
                                    : oth.otherCrewCat === "C"
                                        ? "As Crew"
                                        : oth.otherCrewCat === "N"
                                            ? "None"
                                            : ""),
                                react_1.default.createElement("th", null, "Total"),
                                react_1.default.createElement("td", null, oth.otherCrewCnt)),
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement("td", { colSpan: 4, className: "text" }, oth.otherCrewInfo))))))),
                ]),
            react_1.default.createElement(ContentDivider, null),
            react_1.default.createElement(Content8, null,
                react_1.default.createElement("div", { className: "title" }, "Other Information"),
                react_1.default.createElement(Table, null,
                    react_1.default.createElement("tbody", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "DOM/INT"),
                            react_1.default.createElement("th", null, "PAX/CGO"),
                            react_1.default.createElement("th", null, "SKD/NSK"),
                            react_1.default.createElement("th", null, "FlightSTS")),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", null, flightDetail.flight.intDomCat === "D" ? "DOM" : flightDetail.flight.intDomCat === "I" ? "INT" : ""),
                            react_1.default.createElement("td", null, flightDetail.flight.paxCgoCat === "PAX"
                                ? "PAX"
                                : flightDetail.flight.paxCgoCat === "CGO"
                                    ? "CGO"
                                    : flightDetail.flight.paxCgoCat === "OTR"
                                        ? "OTR"
                                        : ""),
                            react_1.default.createElement("td", null, flightDetail.flight.skdlNonskdlCat),
                            react_1.default.createElement("td", null, flightDetail.flight.svcTypeDiaCd)),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "TR"),
                            react_1.default.createElement("th", null, "PI"),
                            react_1.default.createElement("th", null, "SU"),
                            react_1.default.createElement("th", null, "OM")),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", null, flightDetail.flight.trAlCd),
                            react_1.default.createElement("td", null, flightDetail.flight.ccEmprAlCd),
                            react_1.default.createElement("td", null, flightDetail.flight.caEmprAlCd),
                            react_1.default.createElement("td", null, flightDetail.flight.omAlCd)))),
                react_1.default.createElement(Table, null,
                    react_1.default.createElement("tbody", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", { colSpan: 4 }, "Code Share Flight")),
                        (() => {
                            const cs = flightDetail.flight.cs && flightDetail.flight.cs.length > 0 ? flightDetail.flight.cs : [{ csAlCd: "", csFltNo: "" }]; // 少なくともダミーの空データ１件を入れる
                            return (0, lodash_chunk_1.default)(cs, 4)
                                .slice(0, 5)
                                .map((codeShares, i // 最大5行
                            ) => (
                            // eslint-disable-next-line react/no-array-index-key
                            react_1.default.createElement("tr", { key: i }, (() => {
                                const csList = [];
                                for (let j = 0; j < 4; j++) {
                                    if (codeShares[j]) {
                                        csList.push(
                                        // eslint-disable-next-line react/no-array-index-key
                                        react_1.default.createElement("td", { key: `${i}-${j}` },
                                            codeShares[j].csAlCd,
                                            (0, commonUtil_1.formatFltNo)(codeShares[j].csFltNo)));
                                    }
                                    else {
                                        // eslint-disable-next-line react/no-array-index-key
                                        csList.push(react_1.default.createElement("td", { key: `${i}-${j}` }));
                                    }
                                }
                                return csList;
                            })())));
                        })()))),
            react_1.default.createElement(BlankContent, null)),
        react_1.default.createElement(UpdateRmksPopup_1.default, { key: "flightDetailDepRmksPopup", isOpen: depRmksTextModalIsOpen, width: rmksTextModalWidth, height: rmksTextModalHeight, top: rmksTextModalTop, left: rmksTextModalLeft, initialRmksText: flightDetail.dep.depRmksText, isSubmitable: isRmksEnabled(flightDetail.dep.lstDepApoCd), placeholder: "DEP Flight Remarks", onClose: closeDepRmksText, update: (RmksText) => props.updateFlightRmksDep(RmksText, () => setDepRmksTextModalIsOpen(false)) }),
        react_1.default.createElement(UpdateRmksPopup_1.default, { key: "flightDetailArrRmksPopup", isOpen: arrRmksTextModalIsOpen, width: rmksTextModalWidth, height: rmksTextModalHeight, top: rmksTextModalTop, left: rmksTextModalLeft, initialRmksText: flightDetail.arr.arrRmksText, isSubmitable: isRmksEnabled(flightDetail.arr.lstArrApoCd), placeholder: "ARR Flight Remarks", onClose: closeArrRmksText, update: (RmksText) => props.updateFlightRmksArr(RmksText, () => setArrRmksTextModalIsOpen(false)) })));
};
const Wrapper = styled_components_1.default.div `
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const Content = styled_components_1.default.div `
  padding: 0 10px;
`;
const Content1 = (0, styled_components_1.default)(Content) `
  margin-top: 12px;
  margin-bottom: 6px;
`;
const Table = styled_components_1.default.table `
  width: 100%;
  border-collapse: collapse;

  tr {
    height: 24px;
  }

  th {
    width: 120px;
    padding: 5px;
    font-size: 12px;
    font-weight: normal;
    text-align: left;
    color: #fff;
    background: #2799c6;
    border: 1px solid #595857;
    white-space: nowrap;
  }

  td {
    width: 25%;
    padding: 5px;
    font-size: 17px;
    border: 1px solid #595857;

    .tdContent {
      display: flex;
      align-items: baseline;
    }

    .label {
      &:first-child {
        margin-left: 0;
      }
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding: 2px 4px 0px 4px;
      background: #595857;
      color: #fff;
      font-size: 15px;
      border-radius: 3px;
    }

    span {
      margin-right: 4px;
    }
  }

  td.text_center {
    text-align: center;
  }
`;
const HeaderTable = (0, styled_components_1.default)(Table) `
  table-layout: fixed;
`;
const BladeIcon = styled_components_1.default.img.attrs({ src: blade_svg_1.default }) `
  width: 11px;
  height: 9px;
`;
const Content2 = (0, styled_components_1.default)(Content) `
  margin-bottom: 6px;

  .title {
    color: #32bbe5;
  }

  .taskMonitor {
    border: 1px solid #595857;

    .taskMonitorRow1 {
      padding-left: 11px;
      height: 55px;
      display: flex;

      svg {
        margin-left: -4px;
        &:first-child {
          margin-left: 0;
        }
      }
    }

    .taskMonitorRow2 {
      table {
        width: 100%;
        border-collapse: collapse;
      }

      tr {
        height: 20px;
      }

      th {
        width: 15px;
        font-size: 11px;
        color: #222222;
        font-weight: normal;
      }

      td {
        width: 54px;
        text-align: center;
      }
    }
  }
`;
const Content3 = (0, styled_components_1.default)(Content) `
  margin-bottom: 10px;
  table {
    table-layout: fixed;
  }

  col {
    width: 55px;
  }

  th {
    text-align: center;
  }
`;
const SquareS = styled_components_1.default.div `
  display: inline-block;
  width: 15px;
  height: 16px;
  text-align: center;
  font-size: 14px;
  color: #000;
  border-radius: 4px;
  border: 1px solid #000;
  margin-left: 2px;
  align-self: center;
`;
const ContentDivider = styled_components_1.default.div `
  height: 6px;
  margin-bottom: 8px;
  background: #2fadbd;
`;
const FlightStatusContent = (0, styled_components_1.default)(Content) `
  padding-top: 2px;
  margin-bottom: ${({ marginBottom }) => marginBottom}px; /* 直下文字フォントの上部スペースと合わせて16pxにする */
  img {
    width: 100%;
    border: 1px solid #595857;
    vertical-align: bottom;
  }
`;
const FlightStatusImageBo = styled_components_1.default.img.attrs({ src: _1_BO_animated_png_1.default }) ``;
const FlightStatusImageBc = styled_components_1.default.img.attrs({ src: _2_BC_png_1.default }) ``;
const FlightStatusImageDor = styled_components_1.default.img.attrs({ src: _3_DOR_png_1.default }) ``;
const FlightStatusImageDepTaxi = styled_components_1.default.img.attrs({ src: _4_DEP_TAXI_png_1.default }) ``;
const FlightStatusImageTakeOff = styled_components_1.default.img.attrs({ src: _5_TakeOff_png_1.default }) ``;
const FlightStatusImageInFlt = styled_components_1.default.img.attrs({ src: _6_IN_FLT_png_1.default }) ``;
const FlightStatusImageApp = styled_components_1.default.img.attrs({ src: _7_APP_animated_png_1.default }) ``;
const FlightStatusImageAppTaxi = styled_components_1.default.img.attrs({ src: _8_ARR_TAXI_png_1.default }) ``;
const FlightStatusImageAta = styled_components_1.default.img.attrs({ src: _9_ATA_png_1.default }) ``;
const Content4 = (0, styled_components_1.default)(Content) `
  margin-bottom: 13px;

  .title {
    display: flex;
    align-items: baseline;
    line-height: 1;
    margin-bottom: ${({ isPc }) => (isPc ? 3 : 1)}px;

    small {
      font-size: 12px;
      margin-right: 4px;
    }

    .apoCd {
      color: #2fadbd;
      font-size: 24px;
    }

    > div {
      width: 25%;
      font-size: 17px;
      margin-right: 7px;
    }
  }

  table {
    margin-bottom: 10px;

    th,
    td {
      text-align: center;
      vertical-align: top;
    }

    td.left {
      text-align: left;
      padding-right: 0;
    }

    .tentativeCd {
      padding: 1px 2px 0;
      background: #595857;
      color: #fff;
      font-size: 11px;
      border-radius: 2px;
      margin-left: 2px;
    }
  }
`;
const RmksText = styled_components_1.default.div `
  padding: 7px 10px;
  border: 1px solid #346181;
  word-wrap: break-word;
  white-space: pre-wrap;
  box-shadow: 0px 0px 2px 2px #ccc ${(props) => (props.enabled ? "inset" : "none")};
  cursor: ${(props) => (props.enabled ? "pointer" : "auto")};
`;
const PlaceHolder = styled_components_1.default.div `
  padding: 0px 10px;
  color: ${(props) => props.theme.color.PLACEHOLDER};
`;
const Content5 = (0, styled_components_1.default)(Content4) `
  margin-bottom: 16px;
  .title {
    .originalStation {
      width: 50%;
      span {
        margin-right: 3px;
      }
    }
  }
`;
const Content6 = (0, styled_components_1.default)(Content) `
  padding: 0;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;

  .title {
    padding: 0 10px;
    color: #2fadbd;
    font-size: 20px;
    margin-bottom: 3px; /* baselineから7px分 */
  }

  table {
    th {
      padding: 0 0px;
      border: none;
      text-align: center;
      min-width: 60px;
      &:last-child {
        min-width: 70px;
      }
    }
    td {
      padding: 5px;
      border: none;
      text-align: center;
      &:last-child {
        min-width: 70px;
        text-align: center;
      }
    }

    .tdHead {
      padding: 0 10px;
      font-size: 12px;
      text-align: left;
    }

    tr {
      height: 28px;
      border-bottom: 1px solid #595857;
      &:first-child {
        height: 22px;
        border: none;
      }
    }
  }

  .announceToPax {
    margin: 15px 10px 0;
    display: flex;
    font-size: 20px;
    color: ${(props) => props.theme.color.PRIMARY};
    align-self: center;
    text-decoration: underline;

    > div {
      margin-left: 10px;
    }
  }
`;
const Content7 = (0, styled_components_1.default)(Content) `
  .title {
    color: #2fadbd;
    font-size: 20px;
    margin-bottom: 7px;
  }

  th {
    text-align: center;
  }

  .heading {
    font-size: 18px;
    display: flex;
    margin-bottom: 4px;

    > div {
      margin-right: 7px;
    }

    .colorHeading {
      color: #32bbe5;
    }

    small {
      font-size: 12px;
      margin-right: 4px;
    }
  }

  table {
    margin-bottom: 12px;
    :last-child {
      margin-bottom: 14px;
    }

    th {
      width: 60px;
      height: 24px;
    }

    td {
      min-width: 119px;
      height: 24px;
    }

    td.text {
      padding: 5px;
      word-break: break-all;
    }
  }
`;
const Content8 = (0, styled_components_1.default)(Content) `
  .title {
    color: #2fadbd;
    font-size: 20px;
    margin-bottom: 3px; /* baselineから7px分 */
  }

  table {
    &:last-child {
      margin-bottom: 14px;
      th {
        border-top: none;
        width: 80px;
      }
      td {
        padding: 0 3px;
      }
    }

    th {
      padding: 0 4px;
      text-align: center;
    }
    td {
      width: 25%;
      padding: 0 2px;
      text-align: center;
    }
  }
`;
const BlankContent = (0, styled_components_1.default)(Content) `
  height: 220px;
  border-top: 1px solid #707070;
`;
const AtcStyledLabel = styled_components_1.default.div `
  display: inline-block;
  min-width: 40px;
  padding: 0.1em 0.25em 0.1em;
  font-size: 17px;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  background-color: #595857;
  border-color: #595857;
  border-width: 2px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
`;
const AtcColumn = styled_components_1.default.div `
  display: inline-block;
  text-align: left;
  margin-left: 6px;
  label {
    font-size: 12px;
    margin-right: 2px;
  }
`;
exports.default = FlightDetail;
//# sourceMappingURL=FlightDetail.js.map