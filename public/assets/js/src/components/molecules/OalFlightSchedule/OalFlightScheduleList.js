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
exports.formFieldName = exports.formName = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const react_modal_1 = __importDefault(require("react-modal"));
const hooks_1 = require("../../../store/hooks");
const commonUtil_1 = require("../../../lib/commonUtil");
const storage_1 = require("../../../lib/storage");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const oalFlightSchedule_1 = require("../../../reducers/oalFlightSchedule");
const OalFlightScheduleInputModal_1 = __importDefault(require("./OalFlightScheduleInputModal"));
const OalFlightScheduleType_1 = require("./OalFlightScheduleType");
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const CheckBoxInput_1 = require("../../atoms/CheckBoxInput");
const icon_fis_select_target_popup_svg_1 = __importDefault(require("../../../assets/images/icon/icon-fis-select-target-popup.svg"));
exports.formName = "OalFlightScheduleList";
exports.formFieldName = "fltScheduleList";
const OalFlightScheduleList = (props) => {
    const scrollAreaRef = (0, react_1.useRef)(null);
    const defaultScrollPosition = (0, react_1.useRef)(0);
    const dispatch = (0, hooks_1.useAppDispatch)();
    const oalFlightSchedule = (0, hooks_1.useAppSelector)((state) => state.oalFlightSchedule);
    const [isMenuOpen, setIsMenuOpen] = (0, react_1.useState)(false);
    const [menuPos, setMenuPos] = (0, react_1.useState)({ top: 0, right: 0 });
    const [selectedMenuIndex, setSelectedMenuIndex] = (0, react_1.useState)(null);
    const [selectedFltIndex, setSelectedFltIndex] = (0, react_1.useState)(null);
    const [menuVisible, setMenuVisible] = (0, react_1.useState)(null);
    const [scrollFooterHeight, setScrollFooterHeight] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        window.addEventListener("resize", setScrollHeight);
        setScrollHeight();
        return () => {
            window.removeEventListener("resize", setScrollHeight);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (oalFlightSchedule.isSearched) {
            setSelectedMenuIndex(null);
            setSelectedFltIndex(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oalFlightSchedule.isSearched]);
    (0, react_1.useEffect)(() => {
        // モーダルを開く際にスクロールする
        if (oalFlightSchedule.isOpenInputModal) {
            defaultScrollPosition.current = 0;
            if (scrollAreaRef.current) {
                if (props.oalFlightScheduleState.inputRowIndex !== null) {
                    const fltSchedule = props.oalFlightScheduleState.fltScheduleList[props.oalFlightScheduleState.inputRowIndex];
                    const firstLegIndex = props.oalFlightScheduleState.fltScheduleList.findIndex((f) => f.fltIndex === fltSchedule.fltIndex);
                    const position = firstLegIndex * 40;
                    if (firstLegIndex >= 0) {
                        defaultScrollPosition.current = scrollAreaRef.current.scrollTop;
                        (0, commonUtil_1.smoothScroll)(scrollAreaRef.current, position, 10);
                    }
                }
            }
        }
        else if (!oalFlightSchedule.isOpenInputModal) {
            if (scrollAreaRef.current) {
                (0, commonUtil_1.smoothScroll)(scrollAreaRef.current, defaultScrollPosition.current, 10);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oalFlightSchedule.isOpenInputModal]);
    const setScrollHeight = () => {
        if (scrollAreaRef.current) {
            setScrollFooterHeight(scrollAreaRef.current.clientHeight - 60);
        }
    };
    const getIsForceError = (fieldName, fltSchedule) => {
        const errorItems = OalFlightScheduleType_1.serverErrorItems[fieldName];
        if (fltSchedule) {
            for (let xi = 0; xi < errorItems.length; xi++) {
                const includes = fltSchedule.updateValidationErrors.includes(errorItems[xi]);
                if (includes)
                    return true;
            }
        }
        return false;
    };
    const handleOpenMenu = (index) => () => {
        const row = document.getElementById(`fltRow_${index}`);
        if (row) {
            const menu = row.getElementsByClassName("menu");
            if (menu.length > 0) {
                const menuRect = menu[0].getBoundingClientRect();
                const { top, right } = menuRect;
                const isMenuVisible = (0, OalFlightScheduleType_1.getMenuVisible)(index, props.oalFlightScheduleState.fltScheduleList);
                const selectFltIndex = props.oalFlightScheduleState.fltScheduleList[index].fltIndex;
                setIsMenuOpen(true);
                setMenuPos({ top, right });
                setSelectedMenuIndex(index);
                setSelectedFltIndex(selectFltIndex);
                setMenuVisible(isMenuVisible);
            }
        }
    };
    const editRowFromInitialValue = (updateItem, isAllLeg) => {
        if (selectedMenuIndex !== null) {
            if (props.oalFlightScheduleState.fltScheduleListInitial[selectedMenuIndex]) {
                const newFltSchedule = {
                    ...props.oalFlightScheduleState.fltScheduleListInitial[selectedMenuIndex],
                    ...updateItem,
                };
                dispatch((0, oalFlightSchedule_1.fltListEdit)({ index: selectedMenuIndex, fltScheduleList: [newFltSchedule] }));
                // 他のLEGも初期値に更新
                if (isAllLeg) {
                    let findedIndex = -1;
                    for (;;) {
                        findedIndex = props.oalFlightScheduleState.fltScheduleListInitial.findIndex(
                        // eslint-disable-next-line @typescript-eslint/no-loop-func
                        (f, index) => f.fltIndex === newFltSchedule.fltIndex && f.legIndex !== newFltSchedule.legIndex && index > findedIndex);
                        if (findedIndex >= 0) {
                            const newFltSchedule2 = {
                                ...props.oalFlightScheduleState.fltScheduleListInitial[findedIndex],
                                ...updateItem,
                            };
                            dispatch((0, oalFlightSchedule_1.fltListEdit)({ index: findedIndex, fltScheduleList: [newFltSchedule2] }));
                        }
                        else {
                            break;
                        }
                    }
                    // マルチレグの１行目の場合、他のLEGにFLT情報をコピーする
                }
                else if (newFltSchedule.legIndex === 0) {
                    let findedIndex = -1;
                    for (;;) {
                        findedIndex = props.oalFlightScheduleState.fltScheduleList.findIndex(
                        // eslint-disable-next-line @typescript-eslint/no-loop-func
                        (f, index) => f.fltIndex === newFltSchedule.fltIndex && f.legIndex !== newFltSchedule.legIndex && index > findedIndex);
                        if (findedIndex >= 0) {
                            const newFltSchedule2 = {
                                ...props.oalFlightScheduleState.fltScheduleList[findedIndex],
                                ...(0, OalFlightScheduleType_1.getFltInfo)(newFltSchedule),
                            };
                            dispatch((0, oalFlightSchedule_1.fltListEdit)({ index: findedIndex, fltScheduleList: [newFltSchedule2] }));
                        }
                        else {
                            break;
                        }
                    }
                }
                setIsMenuOpen(false);
            }
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuEdit = (_e) => {
        if (selectedMenuIndex !== null) {
            const fltSchedule = props.oalFlightScheduleState.fltScheduleList[selectedMenuIndex];
            dispatch((0, oalFlightSchedule_1.setInputModal)({
                isOpenInputModal: true,
                inputRowIndex: selectedMenuIndex,
                inputChgType: fltSchedule.chgType || "Other",
                inputNewRow: null,
            }));
            setIsMenuOpen(false);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuCnl = (_e) => {
        editRowFromInitialValue({
            rowStatus: "Edited",
            chgType: "CNL",
            dispStatus: "CNL",
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuRin = (_e) => {
        editRowFromInitialValue({
            rowStatus: "Edited",
            chgType: "RIN",
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuSkdTim = (_e) => {
        dispatch((0, oalFlightSchedule_1.setInputModal)({
            isOpenInputModal: true,
            inputRowIndex: selectedMenuIndex,
            inputChgType: "SKD TIM",
            inputNewRow: null,
        }));
        setIsMenuOpen(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuRteSkd = (_e) => {
        dispatch((0, oalFlightSchedule_1.setInputModal)({
            isOpenInputModal: true,
            inputRowIndex: selectedMenuIndex,
            inputChgType: "RTE SKD",
            inputNewRow: null,
        }));
        setIsMenuOpen(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuUndoLeg = (_e) => {
        editRowFromInitialValue({});
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuAddLeg = (_e) => {
        if (selectedMenuIndex !== null) {
            const { fltScheduleList } = props.oalFlightScheduleState;
            const chageType = fltScheduleList[selectedMenuIndex].chgType === "ADD FLT" ? "ADD FLT" : "ADD LEG";
            void dispatch((0, oalFlightSchedule_1.fltListAddLeg)({ index: selectedMenuIndex || 0, chgType: chageType }));
            dispatch((0, oalFlightSchedule_1.setInputModal)({
                isOpenInputModal: true,
                inputRowIndex: selectedMenuIndex + 1,
                inputChgType: chageType,
                inputNewRow: true,
            }));
            setIsMenuOpen(false);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuRemoveLeg = (_e) => {
        void dispatch((0, oalFlightSchedule_1.fltListRemoveLeg)({ index: selectedMenuIndex || 0 }));
        setIsMenuOpen(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuDeleteLeg = (_e) => {
        editRowFromInitialValue({
            rowStatus: "Edited",
            chgType: "DEL LEG",
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuCopy = (_e) => {
        void dispatch((0, oalFlightSchedule_1.fltListCopyFlt)({ index: selectedMenuIndex || 0 }));
        setIsMenuOpen(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuFltNo = (_e) => {
        dispatch((0, oalFlightSchedule_1.setInputModal)({
            isOpenInputModal: true,
            inputRowIndex: selectedMenuIndex,
            inputChgType: "FLT No.",
            inputNewRow: null,
        }));
        setIsMenuOpen(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuUndoFlt = (_e) => {
        editRowFromInitialValue({}, true);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuRemoveFlt = (_e) => {
        void dispatch((0, oalFlightSchedule_1.fltListRemoveFlt)({ index: selectedMenuIndex || 0 }));
        setIsMenuOpen(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickMenuDeleteFlt = (_e) => {
        editRowFromInitialValue({
            rowStatus: "Edited",
            chgType: "DEL FLT",
        }, true);
    };
    const inputModalOnRequestClose = () => {
        setIsMenuOpen(false);
    };
    const oalFlightScheduleListUpdate = () => {
        const search = () => dispatch((0, oalFlightSchedule_1.update)());
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        void dispatch((0, oalFlightSchedule_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M30010C({ onYesButton: search }) }));
    };
    const renderFlexPartOfFlights = (fltSchedule, fltScheduleInitial, enabled) => (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "domInt" }, fltSchedule.legIndex === 0 && (react_1.default.createElement(TextColumn, { disabled: !enabled.intDomCat, value: fltSchedule.intDomCat, valueOrg: fltScheduleInitial.intDomCat, isError: getIsForceError("intDomCat", fltSchedule) }, fltSchedule.intDomCat === "D" ? "DOM" : fltSchedule.intDomCat === "I" ? "INT" : ""))),
        react_1.default.createElement("div", { className: "paxCgo" }, fltSchedule.legIndex === 0 && (react_1.default.createElement(TextColumn, { disabled: !enabled.paxCgoCat, value: fltSchedule.paxCgoCat, valueOrg: fltScheduleInitial.paxCgoCat, isError: getIsForceError("paxCgoCat", fltSchedule) }, fltSchedule.paxCgoCat))),
        react_1.default.createElement("div", { className: "skdNsk" }, fltSchedule.legIndex === 0 && (react_1.default.createElement(TextColumn, { disabled: !enabled.skdlNonskdlCat, value: fltSchedule.skdlNonskdlCat, valueOrg: fltScheduleInitial.skdlNonskdlCat, isError: getIsForceError("skdlNonskdlCat", fltSchedule) }, fltSchedule.skdlNonskdlCat))),
        react_1.default.createElement(StatusColumn, { className: "status", dirty: fltSchedule.dispStatus !== (fltScheduleInitial ? fltScheduleInitial.dispStatus : ""), lineThrough: fltSchedule.chgType === "RIN" }, fltSchedule.dispStatus),
        react_1.default.createElement("div", { className: "dep" },
            react_1.default.createElement(TextColumn, { disabled: !enabled.depApoCd, value: fltSchedule.depApoCd, valueOrg: fltScheduleInitial.depApoCd, isError: getIsForceError("depApoCd", fltSchedule) }, fltSchedule.depApoCd))));
    const renderFlights = () => {
        const { oalFlightScheduleState: { fltScheduleList, fltScheduleListInitial }, } = props;
        return (react_1.default.createElement(react_1.default.Fragment, null, fltScheduleList &&
            fltScheduleList.map((fltSchedule, index) => {
                const fltScheduleInitial = fltScheduleListInitial[index];
                const enabled = (0, OalFlightScheduleType_1.getListItemEnabled)(fltScheduleList[index]);
                const onwardForceDisabled = (0, oalFlightSchedule_1.getOnwardForceDisabled)(fltScheduleList[index]);
                return (react_1.default.createElement(TableRow
                // eslint-disable-next-line react/no-array-index-key
                , { 
                    // eslint-disable-next-line react/no-array-index-key
                    key: `${index}`, id: `fltRow_${index}`, tabIndex: 0, isFocused: selectedFltIndex === fltScheduleList[index].fltIndex },
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("div", { className: "rowStatus" }, fltSchedule.rowStatus && react_1.default.createElement(StyledLabel, { rowStatus: fltSchedule.rowStatus }, fltSchedule.rowStatus)),
                        react_1.default.createElement("div", { className: "menu", onClick: handleOpenMenu(index), tabIndex: 0, onKeyUp: () => { } },
                            react_1.default.createElement(MenuIcon, null)),
                        react_1.default.createElement(ChgTypeColumn, { className: "chgType" }, fltSchedule.chgType),
                        react_1.default.createElement("div", { className: "casual" }, fltSchedule.legIndex === 0 && (react_1.default.createElement(CheckBoxItem, { disabled: !enabled.casFltFlg, dirty: fltSchedule.casFltFlg !== (fltScheduleInitial ? fltScheduleInitial.casFltFlg : false) },
                            react_1.default.createElement(CheckBoxInput_1.CheckBox, { type: "checkbox", checked: fltSchedule.casFltFlg, disabled: true })))),
                        react_1.default.createElement("div", { className: "flight" }, fltSchedule.legIndex === 0 && (react_1.default.createElement(TextColumn, { disabled: !enabled.fltName, value: fltSchedule.fltName, valueOrg: fltScheduleInitial.fltName, isError: getIsForceError("fltName", fltSchedule) }, fltSchedule.fltName))),
                        react_1.default.createElement("div", { className: "date" }, fltSchedule.legIndex === 0 && (react_1.default.createElement(TextColumn, { disabled: !enabled.orgDate, value: fltSchedule.orgDate, valueOrg: fltScheduleInitial.orgDate, isError: getIsForceError("orgDate", fltSchedule) }, fltSchedule.orgDateLcl ? (0, dayjs_1.default)(fltSchedule.orgDateLcl).format("DDMMM").toUpperCase() : ""))),
                        storage_1.storage.isPc && renderFlexPartOfFlights(fltSchedule, fltScheduleInitial, enabled)),
                    react_1.default.createElement("td", null,
                        !storage_1.storage.isPc && renderFlexPartOfFlights(fltSchedule, fltScheduleInitial, enabled),
                        react_1.default.createElement("div", { className: "arr" },
                            react_1.default.createElement(TextColumn, { disabled: !enabled.arrApoCd, value: fltSchedule.arrApoCd, valueOrg: fltScheduleInitial.arrApoCd, isError: getIsForceError("arrApoCd", fltSchedule) }, fltSchedule.arrApoCd)),
                        react_1.default.createElement("div", { className: "std" },
                            react_1.default.createElement(TextColumn, { disabled: !enabled.std, value: fltSchedule.std, valueOrg: fltScheduleInitial.std, isError: getIsForceError("std", fltSchedule) }, fltSchedule.std)),
                        react_1.default.createElement("div", { className: "etd" },
                            react_1.default.createElement(TextColumn, { disabled: !enabled.etd, value: fltSchedule.etd, valueOrg: fltScheduleInitial.etd, isError: getIsForceError("etd", fltSchedule) }, fltSchedule.etd)),
                        react_1.default.createElement("div", { className: "sta" },
                            react_1.default.createElement(TextColumn, { disabled: !enabled.sta, value: fltSchedule.sta, valueOrg: fltScheduleInitial.sta, isError: getIsForceError("sta", fltSchedule) }, fltSchedule.sta)),
                        react_1.default.createElement("div", { className: "eta" },
                            react_1.default.createElement(TextColumn, { disabled: !enabled.eta, value: fltSchedule.eta, valueOrg: fltScheduleInitial.eta, isError: getIsForceError("eta", fltSchedule) }, fltSchedule.eta)),
                        react_1.default.createElement("div", { className: "eqp" },
                            react_1.default.createElement(TextColumn, { disabled: !enabled.shipTypeIataCd, value: fltSchedule.shipTypeIataCd, valueOrg: fltScheduleInitial.shipTypeIataCd, isError: getIsForceError("shipTypeIataCd", fltSchedule) }, fltSchedule.shipTypeIataCd)),
                        react_1.default.createElement("div", { className: "ship" },
                            react_1.default.createElement(TextColumn, { disabled: !enabled.shipNo, value: fltSchedule.shipNo, valueOrg: fltScheduleInitial.shipNo, isError: getIsForceError("shipNo", fltSchedule) }, fltSchedule.shipNo)),
                        react_1.default.createElement("div", { className: "flightSts" },
                            react_1.default.createElement(TextColumn, { disabled: !enabled.svcTypeDiaCd, value: fltSchedule.svcTypeDiaCd, valueOrg: fltScheduleInitial.svcTypeDiaCd, isError: getIsForceError("svcTypeDiaCd", fltSchedule) }, fltSchedule.svcTypeDiaCd)),
                        react_1.default.createElement("div", { className: "cnxTo" },
                            react_1.default.createElement(TextColumn, { disabled: onwardForceDisabled || !enabled.onward, value: fltSchedule.onwardFltName, valueOrg: fltScheduleInitial.onwardFltName, isError: getIsForceError("onwardFltName", fltSchedule) }, onwardForceDisabled ? "" : fltSchedule.onwardFltName)),
                        react_1.default.createElement("div", { className: "date" },
                            react_1.default.createElement(TextColumn, { disabled: onwardForceDisabled || !enabled.onward, value: fltSchedule.onwardOrgDate, valueOrg: fltScheduleInitial.onwardOrgDate, isError: getIsForceError("onwardOrgDate", fltSchedule) }, onwardForceDisabled
                                ? ""
                                : fltSchedule.onwardOrgDateLcl
                                    ? (0, dayjs_1.default)(fltSchedule.onwardOrgDateLcl).format("DDMMM").toUpperCase()
                                    : "")),
                        react_1.default.createElement("div", { className: "hideFlg" },
                            react_1.default.createElement(TextColumn, { disabled: !enabled.hideFlgCd, value: fltSchedule.hideFlgCd, valueOrg: fltScheduleInitial.hideFlgCd, isError: getIsForceError("hideFlgCd", fltSchedule) }, fltSchedule.hideFlgCd)),
                        react_1.default.createElement("div", { className: "codeShareFlight" },
                            react_1.default.createElement(TextColumnAny, { disabled: !enabled.csFltNames, 
                                // eslint-disable-next-line react/no-array-index-key
                                key: index, value: fltSchedule.csFltNames, valueOrg: fltScheduleInitial.csFltNames, isError: getIsForceError("csFltNames", fltSchedule) }, fltSchedule.csFltNames.map((flt, csFltNamesIndex) => (
                            // eslint-disable-next-line react/no-array-index-key
                            react_1.default.createElement("div", { key: csFltNamesIndex }, flt))))))));
            })));
    };
    const { oalFlightScheduleState: { isUtc }, apoOptions, flightStsOptions, } = props;
    const zMark = isUtc ? "(Z)" : "";
    const lMark = isUtc ? "(L)" : "";
    return (
    // eslint-disable-next-line jsx-a11y/tabindex-no-positive
    react_1.default.createElement(ListContainer, { tabIndex: 200 },
        menuVisible && (react_1.default.createElement(react_modal_1.default, { isOpen: isMenuOpen, style: menuCustomStyles(menuPos.top, menuPos.right), onRequestClose: inputModalOnRequestClose },
            react_1.default.createElement(MenuContainer, { menuTop: menuPos.top, menuRight: menuPos.right },
                menuVisible.edit && react_1.default.createElement(MenuItem, { onClick: handleClickMenuEdit }, "Edit"),
                menuVisible.edit && react_1.default.createElement(Separator, null),
                menuVisible.cnl && (react_1.default.createElement(MenuItem, { disabled: !menuVisible.cnlEnabled, onClick: menuVisible.cnlEnabled ? handleClickMenuCnl : undefined }, "CNL")),
                menuVisible.rin && react_1.default.createElement(MenuItem, { onClick: handleClickMenuRin }, "RIN"),
                menuVisible.skdTim && react_1.default.createElement(MenuItem, { onClick: handleClickMenuSkdTim }, "Schedule Time Change"),
                menuVisible.rteSkd && react_1.default.createElement(MenuItem, { onClick: handleClickMenuRteSkd }, "Route Schedule Change"),
                menuVisible.undoLeg && react_1.default.createElement(MenuItem, { onClick: handleClickMenuUndoLeg }, "Undo (LEG)"),
                menuVisible.addLeg && react_1.default.createElement(MenuItem, { onClick: handleClickMenuAddLeg }, "Add (LEG)"),
                menuVisible.removeLeg && react_1.default.createElement(MenuItem, { onClick: handleClickMenuRemoveLeg }, "Remove (LEG)"),
                menuVisible.deleteLeg && react_1.default.createElement(MenuItem, { onClick: handleClickMenuDeleteLeg }, "Delete (LEG)"),
                menuVisible.separator && react_1.default.createElement(Separator, null),
                menuVisible.copy && (react_1.default.createElement(MenuItem, { disabled: !menuVisible.fltEnabled, onClick: menuVisible.fltEnabled ? handleClickMenuCopy : undefined }, "Copy")),
                menuVisible.fltNo && (react_1.default.createElement(MenuItem, { disabled: !menuVisible.fltEnabled, onClick: menuVisible.fltEnabled ? handleClickMenuFltNo : undefined }, "FLT No. Change")),
                menuVisible.undoFlt && (react_1.default.createElement(MenuItem, { disabled: !menuVisible.fltEnabled, onClick: menuVisible.fltEnabled ? handleClickMenuUndoFlt : undefined }, "Undo (FLT)")),
                menuVisible.removeFlt && (react_1.default.createElement(MenuItem, { disabled: !menuVisible.fltEnabled, onClick: menuVisible.fltEnabled ? handleClickMenuRemoveFlt : undefined }, "Remove (FLT)")),
                menuVisible.deleteFlt && (react_1.default.createElement(MenuItem, { disabled: !menuVisible.fltEnabled, onClick: menuVisible.fltEnabled ? handleClickMenuDeleteFlt : undefined }, "Delete (FLT)"))))),
        react_1.default.createElement(OalFlightScheduleInputModal_1.default, { apoOptions: apoOptions, flightStsOptions: flightStsOptions, basePosition: scrollAreaRef.current ? scrollAreaRef.current.getBoundingClientRect().top : 0, zoomPercentageOfList: zoomPercentage }),
        react_1.default.createElement(ScrollArea, { ref: scrollAreaRef },
            react_1.default.createElement(StickyTable, { footerHeight: scrollFooterHeight },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement(TableRow, null,
                        react_1.default.createElement("th", null,
                            react_1.default.createElement("div", { className: "rowStatus" }),
                            react_1.default.createElement("div", { className: "menu" }, "Menu"),
                            react_1.default.createElement("div", { className: "chgType" }, "CHG Type"),
                            react_1.default.createElement("div", { className: "casual" }, "Casual"),
                            react_1.default.createElement("div", { className: "flight" }, "Flight"),
                            react_1.default.createElement("div", { className: "date" },
                                "Date",
                                lMark),
                            storage_1.storage.isPc && (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("div", { className: "domInt" }, "DOM/INT"),
                                react_1.default.createElement("div", { className: "paxCgo" }, "PAX/CGO"),
                                react_1.default.createElement("div", { className: "skdNsk" }, "SKD/NSK"),
                                react_1.default.createElement("div", { className: "status" }, "Status"),
                                react_1.default.createElement("div", { className: "dep" }, "DEP")))),
                        react_1.default.createElement("th", null,
                            !storage_1.storage.isPc && (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("div", { className: "domInt" }, "DOM/INT"),
                                react_1.default.createElement("div", { className: "paxCgo" }, "PAX/CGO"),
                                react_1.default.createElement("div", { className: "skdNsk" }, "SKD/NSK"),
                                react_1.default.createElement("div", { className: "status" }, "Status"),
                                react_1.default.createElement("div", { className: "dep" }, "DEP"))),
                            react_1.default.createElement("div", { className: "arr" }, "ARR"),
                            react_1.default.createElement("div", { className: "std" },
                                "STD",
                                zMark),
                            react_1.default.createElement("div", { className: "etd" },
                                "ETD",
                                zMark),
                            react_1.default.createElement("div", { className: "sta" },
                                "STA",
                                zMark),
                            react_1.default.createElement("div", { className: "eta" },
                                "ETA",
                                zMark),
                            react_1.default.createElement("div", { className: "eqp" }, "EQP"),
                            react_1.default.createElement("div", { className: "ship" }, "SHIP"),
                            react_1.default.createElement("div", { className: "flightSts" }, "FlightSTS"),
                            react_1.default.createElement("div", { className: "cnxTo" }, "CNX To"),
                            react_1.default.createElement("div", { className: "date" },
                                "Date",
                                lMark),
                            react_1.default.createElement("div", { className: "hideFlg" }, "Hide Flag"),
                            react_1.default.createElement("div", { className: "codeShareFlight" }, "Code Share Flight")))),
                react_1.default.createElement("tbody", null, renderFlights()),
                react_1.default.createElement("tfoot", null,
                    react_1.default.createElement("tr", null)))),
        react_1.default.createElement(Footer, null,
            react_1.default.createElement(PrimaryButton_1.default, { text: "Update", tabIndex: -1, disabled: !props.isEdited, onClick: oalFlightScheduleListUpdate }))));
};
const zoomPercentage = 90;
const ListContainer = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  zoom: ${zoomPercentage}%;
`;
const ScrollArea = styled_components_1.default.div `
  position: relative;
  overflow: scroll;
  width: 100%;
  height: calc(100% - 64px);
`;
const Footer = styled_components_1.default.div `
  display: flex;
  width: 100%;
  height: 64px;
  align-items: center;
  justify-content: center;
  button {
    width: 100px;
  }
`;
const StickyTable = styled_components_1.default.table `
  border-collapse: collapse;
  border-spacing: 0;
  thead {
    /* ChromeとiOSに対応するためtheadとtrでstickyの指定が必要 */
    position: sticky; /* 縦スクロール時に固定する */
    top: 0px;
    z-index: 20; /* tbody内のセルより手前に表示する */
    > tr {
      height: 22px;
      position: sticky; /* 縦スクロール時に固定する */
      top: 0px;
      z-index: 20; /* tbody内のセルより手前に表示する */
      > th:first-child {
        /* 横スクロール時に固定する */
        position: sticky;
        left: 0;
        z-index: 21;
      }
      > th {
        padding: 0;
        border: solid #fff 1px;
        > div {
          /* text-align: center; */
          background-color: rgb(39, 153, 198);
          color: #fff;
        }
        .codeShareFlight {
          /* text-align: left; */
        }
      }
    }
  }
  tbody {
    tr {
      height: 40px;
      z-index: 10;
      > td:first-child {
        /* 横スクロール時に固定する */
        position: sticky;
        left: 0;
        z-index: 11;
      }
      > td {
        padding: 0;
        border: solid #fff 1px;
      }
    }
  }
  tfoot {
    tr {
      height: ${({ footerHeight }) => `${footerHeight}px`};
    }
  }
`;
const TableRow = styled_components_1.default.tr `
  display: flex;
  align-self: center;
  > th {
    font-size: 12px;
    display: flex;
    font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
    > div {
      display: flex; /* 上下中央に配置するため */
      overflow: visible;
      min-width: 80px;
      align-items: center;
      justify-content: flex-start;
      padding-left: 6px;
    }
  }
  > td {
    font-size: 18px;
    display: flex;
    font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
    > div {
      background-color: #eee;
      display: flex; /* 上下中央に配置するため */
      overflow: visible;
      min-width: 80px;
      align-items: center;
      justify-content: flex-start;
      > div {
        padding-left: 6px;
      }
    }
    .rowStatus {
      background-color: #fff;
    }
    .menu {
      cursor: pointer;
      background-color: #fff;
    }
    .chgType,
    .casual,
    .flight,
    .date:nth-child(6),
    .domInt,
    .paxCgo,
    .skdNsk {
      background-color: ${({ isFocused }) => (isFocused ? "#CEE2E2" : "#EEE")};
    }
  }
  > td:nth-child(2) {
    font-size: 18px;
    > div {
      background-color: #eee;
    }
  }
  .rowStatus {
    width: 70px;
    justify-content: center;
    padding-left: 0;
  }
  .menu {
    width: 44px;
    justify-content: center;
    padding-left: 0;
  }
  .chgType {
    width: 100px;
  }
  .casual {
    width: 44px;
    justify-content: center;
    padding-left: 0;
  }
  .flight {
    width: 112px;
  }
  .date {
    width: 80px;
  }
  .domInt {
    width: 76px;
  }
  .paxCgo {
    width: 76px;
  }
  .skdNsk {
    width: 76px;
  }
  .status {
    width: 70px;
  }
  .dep,
  .arr {
    width: 80px;
  }
  .std,
  .etd,
  .sta,
  .eta {
    width: 88px;
  }
  .tml {
    width: 88px;
  }
  .eqp {
    width: 64px;
  }
  .ship {
    width: 120px;
  }
  .flightSts {
    width: 80px;
  }
  .cnxTo {
    width: 112px;
  }
  .hideFlg {
    width: 64px;
  }
  .codeShareFlight {
    display: flex;
    width: 1600px;
    > div {
      display: flex;
      width: 100%;
      > div {
        display: flex;
        min-width: 80px;
        padding-left: 6px;
      }
    }
  }
`;
const ChgTypeColumn = styled_components_1.default.div `
  -webkit-text-stroke: 1px;
  color: ${({ theme }) => theme.color.text.CHANGED};
  padding-left: 6px;
`;
const StatusColumn = styled_components_1.default.div `
  -webkit-text-stroke: 1px;
  color: ${({ dirty, lineThrough, theme }) => (dirty || lineThrough ? theme.color.text.CHANGED : "#000")};
  text-decoration: ${({ lineThrough }) => (lineThrough ? "line-through" : "none")};
  padding-left: 6px;
`;
const CheckBoxItem = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  background-color: ${({ disabled, dirty, theme }) => (disabled ? "rgba(0,0,0,0)" : dirty ? theme.color.background.DELETED : "#FFF")};
  input {
    transform: scale(0.6);
  }
`;
const TextColumn = styled_components_1.default.div `
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${({ value, valueOrg, theme }) => (value === valueOrg ? "#000" : theme.color.text.CHANGED)};
  -webkit-text-fill-color: ${({ value, valueOrg, theme }) => (value === valueOrg ? "#000" : theme.color.text.CHANGED)};
  background-color: ${({ disabled, value, valueOrg, theme }) => disabled ? "rgba(0,0,0,0)" : !value && valueOrg ? theme.color.background.DELETED : "#FFF"};
  border: ${(props) => (props.isError ? `1px solid ${props.theme.color.border.ERROR}` : "unset")};
  text-align: center;
`;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextColumnAny = styled_components_1.default.div `
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${({ value, valueOrg, theme }) => ((0, lodash_isequal_1.default)(value, valueOrg) ? "#000" : theme.color.text.CHANGED)};
  -webkit-text-fill-color: ${({ value, valueOrg, theme }) => ((0, lodash_isequal_1.default)(value, valueOrg) ? "#000" : theme.color.text.CHANGED)};
  background-color: ${({ disabled, value, valueOrg, theme }) => disabled ? "rgba(0,0,0,0)" : (0, lodash_isempty_1.default)(value) && !(0, lodash_isempty_1.default)(valueOrg) ? theme.color.background.DELETED : "#FFF"};
  border: ${(props) => (props.isError ? `1px solid ${props.theme.color.border.ERROR}` : "unset")};
  text-align: center;
`;
const StyledLabel = styled_components_1.default.div `
  display: block;
  width: 66px;
  height: 24px;
  padding: 5px 0 !important;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.color.DEFAULT_FONT_WEIGHT};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  background-color: ${({ rowStatus, theme }) => rowStatus === "Edited" ? "#E6B422" : rowStatus === "Updated" || rowStatus === "Skipped" ? "#76D100" : theme.color.text.CHANGED};
  border-radius: 8px;
  box-sizing: border-box;
`;
const MenuIcon = styled_components_1.default.img.attrs({ src: icon_fis_select_target_popup_svg_1.default }) `
  width: 19px;
  height: 13px;
`;
const menuCustomStyles = (menuTop, menuRight) => ({
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 970000000 /* reapop(999999999)の2つ下 */,
    },
    content: {
        position: "absolute",
        width: "238px",
        height: "fit-content",
        top: `${menuTop}px`,
        left: `${menuRight}px`,
        padding: 0,
        backgroundColor: "#fff",
        borderRadius: "5px",
        transition: "opacity 0.25s",
        display: "inline-block",
    },
});
const MenuContainer = styled_components_1.default.div `
  margin: 8px 16px;
  /* &::after {
    content: "";
    position: fixed;
    top: ${({ menuTop }) => `${menuTop + 10}px`};
    left: ${({ menuRight }) => `${menuRight - 10}px`};
    border: 8px solid transparent;
    border-right: 12px solid #fff;
  } */
`;
const MenuItem = styled_components_1.default.div `
  color: #346181;
  user-select: none;
  cursor: ${({ disabled }) => (disabled ? "inherit" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  padding: 8px 8px;
  display: flex;
  align-items: center;
`;
const Separator = styled_components_1.default.div `
  height: 0;
  border-bottom: 2px solid #eee;
`;
const mapStateToProps = (state) => ({
    oalFlightScheduleState: state.oalFlightSchedule,
});
exports.default = (0, react_redux_1.connect)(mapStateToProps)(OalFlightScheduleList);
//# sourceMappingURL=OalFlightScheduleList.js.map