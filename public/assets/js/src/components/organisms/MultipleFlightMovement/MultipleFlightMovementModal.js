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
exports.onSubmit = exports.MultipleFlightMovementModal = void 0;
const react_1 = __importStar(require("react"));
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const react_scrollbar_size_1 = __importDefault(require("react-scrollbar-size"));
const lodash_findindex_1 = __importDefault(require("lodash.findindex"));
const hooks_1 = require("../../../store/hooks");
const notifications_1 = require("../../../lib/notifications");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const storage_1 = require("../../../lib/storage");
const StorageOfUser_1 = require("../../../lib/StorageOfUser");
const validates = __importStar(require("../../../lib/validators"));
// eslint-disable-next-line import/no-cycle
const MultipleFlightMovementValidator_1 = require("../../../lib/validators/MultipleFlightMovementValidator");
const layoutStyle_1 = __importDefault(require("../../../styles/layoutStyle"));
const RoundButtonReload_1 = __importDefault(require("../../atoms/RoundButtonReload"));
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const RawTextInput_1 = __importDefault(require("../../atoms/RawTextInput"));
const TimeInputPlusMinusButtons_1 = __importDefault(require("../../molecules/TimeInputPlusMinusButtons"));
const multipleFlightMovementModals_1 = require("../../../reducers/multipleFlightMovementModals");
const DraggableModalFree_1 = __importDefault(require("../../molecules/DraggableModalFree"));
const FreeModalHeader_1 = __importDefault(require("../../molecules/FreeModalHeader"));
const MultipleFlightMovementRowStatus_1 = require("./MultipleFlightMovementRowStatus");
const FlightMovementType_1 = require("../FlightMovementModal/FlightMovementType");
const MultipleFlightMovementModal = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const common = (0, hooks_1.useAppSelector)((state) => state.common);
    const formContentRef = (0, react_1.useRef)(null);
    const [isBbEditing, setIsBbEditing] = (0, react_1.useState)(false);
    const [modalWidth, setModalWidth] = (0, react_1.useState)(0);
    const [flightLinesSubmited, setFlightLinesSubmited] = (0, react_1.useState)(false);
    const [displayFlightLines, setDisplayFlightLines] = (0, react_1.useState)("5");
    const [initialDisplayFlightLines, setInitialDisplayFlightLines] = (0, react_1.useState)("5");
    const [loadDisplayFlight, setLoadDisplayFlight] = (0, react_1.useState)(false);
    const [resizeFlg, setResizeFlg] = (0, react_1.useState)(false);
    const scrollbarWidth = (0, react_scrollbar_size_1.default)().width;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { change, isDep, modal: { isOpen, selectedLegKey, isFetching }, } = props;
    const tentativeOptions = (0, react_1.useMemo)(() => [
        { label: "MNR", value: "MNR" },
        { label: "TTV", value: "TTV" },
        { label: "UNK", value: "UNK" },
    ], []);
    const leftPosition = (0, react_1.useMemo)(() => {
        if (resizeFlg)
            setResizeFlg(false);
        if (props.fisCenterContentRef.current) {
            const centerContentWidth = props.fisCenterContentRef.current.getBoundingClientRect().width;
            const centerContentLeft = props.fisCenterContentRef.current.getBoundingClientRect().left;
            if (isDep) {
                return centerContentLeft + centerContentWidth - modalWidth;
            }
            return centerContentLeft;
        }
        return 0;
    }, [isDep, modalWidth, props.fisCenterContentRef, resizeFlg]);
    (0, react_1.useEffect)(() => {
        // 上下ボタンで特定のフィールドをフォーカス移動する処理
        const handleKeyDown = (event) => {
            const form = formContentRef.current;
            if (form) {
                const currentFocus = document.activeElement;
                if (currentFocus && /\bmainField\b/.test(currentFocus.className)) {
                    const fields = form.querySelectorAll(".mainField");
                    const currentIndex = Array.from(fields).indexOf(currentFocus);
                    if (event.key === "ArrowUp") {
                        if (currentIndex >= 1) {
                            fields[currentIndex - 1].focus();
                            fields[currentIndex - 1].select(); // 全選択
                        }
                        event.preventDefault();
                    }
                    else if (event.key === "ArrowDown") {
                        if (currentIndex < fields.length - 1) {
                            fields[currentIndex + 1].focus();
                            fields[currentIndex + 1].select(); // 全選択
                        }
                        event.preventDefault();
                    }
                }
            }
        };
        let resizeTimeout;
        // デバウンスを使ってリサイズが完了したイベントを補足
        const triggerResize = () => {
            clearTimeout(resizeTimeout); // すでにタイマーがセットされていたらクリア
            resizeTimeout = setTimeout(() => {
                setResizeFlg(true);
            }, 200); // 200ms 後にリサイズが完了したとみなす
        };
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", triggerResize);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", triggerResize);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            // 便区間表示件数の取得
            const storageDisplayFlightLines = StorageOfUser_1.storageOfUser.getDisplayFlightLines({ isDep });
            setDisplayFlightLines(storageDisplayFlightLines ? storageDisplayFlightLines.toString() : "5");
            setInitialDisplayFlightLines(storageDisplayFlightLines ? storageDisplayFlightLines.toString() : "5");
            setLoadDisplayFlight(true); // displayFlightLinesが反映されてからデータ読み込みを行いたい為
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);
    (0, react_1.useEffect)(() => {
        if (loadDisplayFlight) {
            loadFlightData();
            setLoadDisplayFlight(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadDisplayFlight]);
    (0, react_1.useEffect)(() => {
        setModalWidth((isDep ? 690 : 624) + scrollbarWidth);
    }, [isDep, scrollbarWidth]);
    // FIS画面に表示されている便区間を取得する
    const getFisFlightData = (0, react_1.useCallback)(() => {
        if (!selectedLegKey)
            return null;
        const fligntLines = Number(displayFlightLines);
        if (Number.isNaN(fligntLines))
            return null;
        const loadLegList = [];
        let rowIndex = props.filteredFisRows.findIndex((r) => {
            const legData = isDep ? r.fis.dep : r.fis.arr;
            if (legData) {
                return (legData.orgDateLcl === selectedLegKey.orgDateLcl &&
                    legData.alCd === selectedLegKey.alCd &&
                    legData.fltNo === selectedLegKey.fltNo &&
                    legData.casFltNo === selectedLegKey.casFltNo &&
                    legData.skdDepApoCd === selectedLegKey.skdDepApoCd &&
                    legData.skdArrApoCd === selectedLegKey.skdArrApoCd &&
                    legData.skdLegSno === selectedLegKey.skdLegSno);
            }
            return false;
        });
        if (rowIndex < 0) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40027C({}) });
            return null;
        }
        const fisArray = props.filteredFisRows.toArray();
        while (fligntLines > 0 && loadLegList.length < fligntLines) {
            rowIndex = (0, lodash_findindex_1.default)(fisArray, (r) => {
                if (isDep && r.fis.dep) {
                    return r.fis.dep.legCnlFlg === false;
                }
                if (!isDep && r.fis.arr) {
                    return r.fis.arr.legCnlFlg === false && r.fis.isDivAtbOrgApo === false;
                }
                return false;
            }, rowIndex);
            if (rowIndex < 0) {
                break;
            }
            else {
                const legData = isDep ? fisArray[rowIndex].fis.dep : fisArray[rowIndex].fis.arr;
                if (legData) {
                    const { orgDateLcl, alCd, fltNo, casFltNo, skdDepApoCd, skdArrApoCd, skdLegSno, isOal } = legData;
                    const { arrOrgApoCd, depDstApoCd } = fisArray[rowIndex].fis;
                    loadLegList.push({
                        legKey: {
                            orgDateLcl,
                            alCd,
                            fltNo,
                            casFltNo: casFltNo || "",
                            skdDepApoCd,
                            skdArrApoCd,
                            skdLegSno,
                        },
                        isOal,
                        arrOrgApoCd,
                        depDstApoCd,
                    });
                }
                rowIndex += 1;
            }
        }
        return loadLegList;
    }, [dispatch, displayFlightLines, isDep, props.filteredFisRows, selectedLegKey]);
    // データ読み込み
    const loadFlightData = () => {
        const loadLegList = getFisFlightData();
        if (loadLegList) {
            void dispatch((0, multipleFlightMovementModals_1.fetchMultipleFlightMovement)({ loadLegList, isDep })).then(() => {
                const form = formContentRef.current;
                if (form) {
                    const fields = form.querySelectorAll(".mainField");
                    if (fields.length > 0) {
                        fields[0].focus();
                        fields[0].select(); // 全選択
                    }
                }
            });
        }
    };
    const handleFocus = () => {
        dispatch((0, multipleFlightMovementModals_1.focusToMultipleFlightMovement)({ isDep }));
    };
    const handleClose = (e) => {
        if (e) {
            e.stopPropagation();
        }
        const executeClose = () => {
            void dispatch((0, multipleFlightMovementModals_1.closeMultipleFlightMovement)({ isDep }));
        };
        if (props.rowStatusList.find((s) => s.status === "Edited" || s.status === "Error" || s.status === "Failed")) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: executeClose }) });
        }
        else {
            executeClose();
        }
    };
    const headerElement = (0, react_1.useMemo)(() => react_1.default.createElement(FreeModalHeader_1.default, { legkey: props.modal.selectedLegKey, isDep: isDep }), [props.modal.selectedLegKey, isDep]);
    const handleClickClose = (e) => {
        if (e) {
            e.stopPropagation();
        }
        const onClose = () => {
            setIsBbEditing(false);
            handleClose(e);
        };
        if (isBbEditing) {
            notifications_1.NotificationCreator.create({
                dispatch,
                message: soalaMessages_1.SoalaMessage.M40012C({ onYesButton: onClose }),
            });
        }
        else {
            onClose();
        }
    };
    const handleOnChange = (0, react_1.useCallback)(({ rowIndex, fieldName }) => () => {
        // formの値が反映された後に実行する
        setTimeout(() => {
            void dispatch((0, multipleFlightMovementModals_1.valueChanged)({ isDep, rowIndex, fieldName }));
        }, 10);
    }, [dispatch, isDep]);
    const correctToUpperValue = (0, react_1.useCallback)(({ e, fullFieldName }) => {
        if (e) {
            const upperValue = e.target.value.toUpperCase();
            if (upperValue !== e.target.value) {
                change(fullFieldName, upperValue);
            }
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const checkDisplayFlightLines = (0, react_1.useCallback)((value) => {
        if (!value) {
            return -1;
        }
        const checkedValue = Number(value);
        if (Number.isNaN(checkedValue) || !(checkedValue >= 1 && checkedValue <= 20)) {
            return -2;
        }
        return checkedValue;
    }, []);
    const handleReload = () => {
        const checkedValue = checkDisplayFlightLines(displayFlightLines);
        setFlightLinesSubmited(true);
        if (checkedValue === -1) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50016C() });
            return;
        }
        if (checkedValue < 0) {
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50032C() });
            return;
        }
        const executeLoadData = () => {
            setFlightLinesSubmited(false);
            // ストレージへの保存
            StorageOfUser_1.storageOfUser.saveDisplayFlightLines({ isDep, displayFlightLines: checkedValue });
            // 初期値の設定
            setInitialDisplayFlightLines(checkedValue.toString());
            // データ読み込み
            loadFlightData();
        };
        if (props.rowStatusList.find((s) => s.status === "Edited" || s.status === "Error" || s.status === "Failed")) {
            notifications_1.NotificationCreator.create({
                dispatch,
                message: soalaMessages_1.SoalaMessage.M40011C({ onYesButton: executeLoadData }),
            });
        }
        else {
            executeLoadData();
        }
    };
    const renderRowsArr = (0, react_1.useCallback)((fp) => (react_1.default.createElement(react_1.default.Fragment, null, fp.fields.map((rowName, rowIndex) => {
        const initialValue = props.initialValues.rows[rowIndex];
        const fisOptions = initialValue ? (0, FlightMovementType_1.getfisStsOptions)(initialValue.fisFltSts, false, initialValue.isOal) : [];
        return (react_1.default.createElement(RowArr, { key: initialValue.rowNo },
            react_1.default.createElement("div", null,
                react_1.default.createElement(MultipleFlightMovementRowStatus_1.StatusLabel, { isDep: false, rowIndex: rowIndex })),
            react_1.default.createElement("div", null,
                react_1.default.createElement(AirLineCode, { casFltNo: initialValue.casFltNo },
                    initialValue.casFltNo ? (react_1.default.createElement("span", { className: "casFltNo" }, initialValue.casFltNo)) : (react_1.default.createElement("span", null, initialValue.alCd + initialValue.fltNo)),
                    `/${initialValue.orgDay}`)),
            react_1.default.createElement("div", null, initialValue.arrOrgApoCd),
            react_1.default.createElement("div", null,
                react_1.default.createElement(redux_form_1.Field, { name: `${rowName}.fisFltSts`, width: "100%", height: 40, component: SelectBox_1.default, options: fisOptions, disabled: initialValue.legCnlFlg || initialValue.isDivAtbOrgApo, hasBlank: true, maxMenuHeight: 350, onSelect: handleOnChange({ rowIndex, fieldName: "fisFltSts" }), isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true })),
            react_1.default.createElement("div", null, initialValue.arrInfo.sta),
            react_1.default.createElement("div", null,
                react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { onClickPlusCustomEvent: () => {
                        void dispatch((0, multipleFlightMovementModals_1.plusMinusEtaLd)({ rowIndex, isPlus: true }));
                    }, onClickMinusCustomEvent: () => {
                        void dispatch((0, multipleFlightMovementModals_1.plusMinusEtaLd)({ rowIndex, isPlus: false }));
                    }, disabled: initialValue.legCnlFlg || initialValue.isDivAtbOrgApo, showDisabled: true, notFocus: true },
                    react_1.default.createElement(redux_form_1.Field, { className: "mainField", name: `${rowName}.arrInfo.etaLd`, width: 58, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", fontSizeOfPlaceholder: 14, maxLength: 4, disabled: initialValue.legCnlFlg || initialValue.isDivAtbOrgApo, validate: [MultipleFlightMovementValidator_1.requiredEtaLd, validates.time], componentOnBlur: (e) => {
                            correctToUpperValue({ e, fullFieldName: `${rowName}.arrInfo.etaLd` });
                        }, handleInputChange: handleOnChange({ rowIndex, fieldName: "arrInfo.etaLd" }), isShadowOnFocus: true, isShowEditedColor: true }))),
            react_1.default.createElement("div", null,
                react_1.default.createElement(redux_form_1.Field, { name: `${rowName}.arrInfo.etaLdCd`, width: "100%", height: 40, component: SelectBox_1.default, options: tentativeOptions, disabled: initialValue.legCnlFlg || initialValue.isDivAtbOrgApo, hasBlank: true, onSelect: handleOnChange({ rowIndex, fieldName: "arrInfo.etaLdCd" }), isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true }))));
    }))), [correctToUpperValue, dispatch, handleOnChange, props.initialValues.rows, tentativeOptions]);
    const renderRowsDep = (0, react_1.useCallback)((fp) => (react_1.default.createElement(react_1.default.Fragment, null, fp.fields.map((rowName, rowIndex) => {
        const initialValue = props.initialValues.rows[rowIndex];
        const fisOptions = (0, FlightMovementType_1.getfisStsOptions)(initialValue.fisFltSts, false, initialValue.isOal);
        return (react_1.default.createElement(RowDep, { key: initialValue.rowNo },
            react_1.default.createElement("div", null,
                react_1.default.createElement(MultipleFlightMovementRowStatus_1.StatusLabel, { isDep: true, rowIndex: rowIndex })),
            react_1.default.createElement("div", null,
                react_1.default.createElement(AirLineCode, { casFltNo: initialValue.casFltNo },
                    initialValue.casFltNo ? (react_1.default.createElement("span", { className: "casFltNo" }, initialValue.casFltNo)) : (react_1.default.createElement("span", null, initialValue.alCd + initialValue.fltNo)),
                    `/${initialValue.orgDay}`)),
            react_1.default.createElement("div", null, initialValue.depDstApoCd),
            react_1.default.createElement("div", null,
                react_1.default.createElement(redux_form_1.Field, { name: `${rowName}.fisFltSts`, width: "100%", height: 40, component: SelectBox_1.default, options: fisOptions, disabled: initialValue.legCnlFlg, hasBlank: true, maxMenuHeight: 350, onSelect: handleOnChange({ rowIndex, fieldName: "fisFltSts" }), isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true })),
            react_1.default.createElement("div", null, initialValue.depInfo.std),
            react_1.default.createElement("div", null,
                react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { onClickPlusCustomEvent: () => {
                        void dispatch((0, multipleFlightMovementModals_1.plusMinusEtd)({ rowIndex, isPlus: true }));
                    }, onClickMinusCustomEvent: () => {
                        void dispatch((0, multipleFlightMovementModals_1.plusMinusEtd)({ rowIndex, isPlus: false }));
                    }, disabled: initialValue.legCnlFlg, showDisabled: true, notFocus: true },
                    react_1.default.createElement(redux_form_1.Field, { className: "mainField", name: `${rowName}.depInfo.etd`, width: 58, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", fontSizeOfPlaceholder: 14, maxLength: 4, disabled: initialValue.legCnlFlg, validate: !initialValue.depInfo.std ? [MultipleFlightMovementValidator_1.requiredEtd, validates.time] : [MultipleFlightMovementValidator_1.requiredEtd, validates.timeOrSkd], componentOnBlur: (e) => {
                            correctToUpperValue({ e, fullFieldName: `${rowName}.depInfo.etd` });
                        }, handleInputChange: handleOnChange({ rowIndex, fieldName: "depInfo.etd" }), isShadowOnFocus: true, isShowEditedColor: true }))),
            react_1.default.createElement("div", null,
                react_1.default.createElement(PrimaryButton_1.default, { type: "button", text: "SKD", height: "40px", disabled: initialValue.legCnlFlg || !initialValue.depInfo.std, onClick: () => {
                        void dispatch((0, multipleFlightMovementModals_1.copySkdToEtd)({ rowIndex }));
                    }, tabIndex: -1 })),
            react_1.default.createElement("div", null,
                react_1.default.createElement(redux_form_1.Field, { name: `${rowName}.depInfo.etdCd`, width: "100%", height: 40, component: SelectBox_1.default, options: tentativeOptions, disabled: initialValue.legCnlFlg, hasBlank: true, onSelect: handleOnChange({ rowIndex, fieldName: "depInfo.etdCd" }), isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true }))));
    }))), [correctToUpperValue, dispatch, handleOnChange, props.initialValues.rows, tentativeOptions]);
    return (react_1.default.createElement(react_1.default.Fragment, null, props.modal.focusedAt ? (react_1.default.createElement(DraggableModalFree_1.default, { isOpen: props.modal.isOpen, style: customStyles((800000000 + Math.round((props.modal.focusedAt.getTime() - common.initDate.getTime()) / 100)) % 900000000), header: headerElement, onFocus: handleFocus, onClose: handleClickClose, width: modalWidth, height: 100, top: (storage_1.storage.isPc ? parseInt(layoutStyle_1.default.header.default, 10) : parseInt(layoutStyle_1.default.header.tablet, 10)) + 24 + 28, left: leftPosition },
        react_1.default.createElement(Container, null,
            react_1.default.createElement(FormContent, { onSubmit: props.handleSubmit, ref: formContentRef, autoComplete: "off" },
                !isDep ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(SubHeaderArr, null,
                        react_1.default.createElement("div", null),
                        react_1.default.createElement("div", null, "Flight"),
                        react_1.default.createElement("div", null, "ORG"),
                        react_1.default.createElement("div", null, "Status"),
                        react_1.default.createElement("div", null, "STA"),
                        react_1.default.createElement("div", null, "ETA(L/D)"),
                        react_1.default.createElement("div", null, "M/T/U")),
                    react_1.default.createElement(ScrollArea, { displayFlightLines: Number(initialDisplayFlightLines) },
                        react_1.default.createElement(redux_form_1.FieldArray, { name: "rows", component: renderRowsArr })))) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(SubHeaderDep, null,
                        react_1.default.createElement("div", null),
                        react_1.default.createElement("div", null, "Flight"),
                        react_1.default.createElement("div", null, "DST"),
                        react_1.default.createElement("div", null, "Status"),
                        react_1.default.createElement("div", null, "STD"),
                        react_1.default.createElement("div", null, "ETD"),
                        react_1.default.createElement("div", null),
                        react_1.default.createElement("div", null, "M/T/U")),
                    react_1.default.createElement(ScrollArea, { displayFlightLines: Number(initialDisplayFlightLines) },
                        react_1.default.createElement(redux_form_1.FieldArray, { name: "rows", component: renderRowsDep })))),
                react_1.default.createElement(Footer, null,
                    react_1.default.createElement(PrimaryButton_1.default, { type: "submit", text: "Update", width: "110px", disabled: !props.rowStatusList.find((s) => s.status === "Edited") }),
                    react_1.default.createElement(FlightLineArea, null,
                        react_1.default.createElement("div", null,
                            "Display Flight",
                            react_1.default.createElement("br", null),
                            "lines(max20)"),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(FlightLineInput, { value: displayFlightLines, onChange: (e) => {
                                    if (e.target.value) {
                                        const value = Number(e.target.value);
                                        if (!Number.isNaN(value)) {
                                            setDisplayFlightLines(Math.abs(value).toString());
                                        }
                                    }
                                    else {
                                        setDisplayFlightLines("");
                                    }
                                }, maxLength: 2, type: "text", disabled: false, isShadowOnFocus: true, isFixedFocus: false, isDirty: displayFlightLines !== initialDisplayFlightLines, isForceError: flightLinesSubmited && checkDisplayFlightLines(displayFlightLines) < 0, terminalCat: storage_1.storage.terminalCat })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(RoundButtonReload_1.default, { scale: 0.7, isFetching: isFetching, onClick: handleReload })))))))) : (react_1.default.createElement(react_1.default.Fragment, null))));
};
exports.MultipleFlightMovementModal = MultipleFlightMovementModal;
const customStyles = (timestamp9digit) => ({
    overlay: {
        background: "transparent",
        pointerEvents: "none",
        zIndex: timestamp9digit,
    },
    content: {
        width: "100%",
        height: "100%",
        left: 0,
        right: 0,
        bottom: 0,
        background: "transparent",
        border: "none",
        pointerEvents: "none",
        padding: 0,
    },
});
const Container = styled_components_1.default.div ``;
const FormContent = styled_components_1.default.form `
  font-size: 18px;
`;
const SubHeader = styled_components_1.default.div `
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  background: #2799c6;
  font-size: 12px;
  color: #fff;
  height: 20px;
  margin-top: 8px;
`;
const SubHeaderArr = (0, styled_components_1.default)(SubHeader) `
  > div:nth-child(1) {
    flex-basis: 81px;
  }
  > div:nth-child(2) {
    flex-basis: 113px;
  }
  > div:nth-child(3) {
    flex-basis: 57px;
  }
  > div:nth-child(4) {
    margin: 0 7px;
    padding-left: 4px;
    flex-basis: 74px;
  }
  > div:nth-child(5) {
    flex-basis: 53px;
  }
  > div:nth-child(6) {
    padding: 0 40px;
    flex-basis: 138px;
  }
  > div:nth-child(7) {
    margin: 0 7px;
    padding-left: 4px;
    flex-basis: 74px;
  }
`;
const SubHeaderDep = (0, styled_components_1.default)(SubHeader) `
  > div:nth-child(1) {
    flex-basis: 81px;
  }
  > div:nth-child(2) {
    flex-basis: 113px;
  }
  > div:nth-child(3) {
    flex-basis: 57px;
  }
  > div:nth-child(4) {
    margin: 0 7px;
    padding-left: 4px;
    flex-basis: 74px;
  }
  > div:nth-child(5) {
    flex-basis: 53px;
  }
  > div:nth-child(6) {
    padding: 0 40px;
    flex-basis: 138px;
  }
  > div:nth-child(7) {
    margin: 0 4px;
    flex-basis: 64px;
  }
  > div:nth-child(8) {
    margin: 0 7px;
    padding-left: 4px;
    flex-basis: 74px;
  }
`;
const ScrollArea = styled_components_1.default.div `
  padding: 8px 0 calc(48px * 2) 0;
  overflow-y: auto;
  min-height: calc(48px * 5 + 8px);
  max-height: calc(48px * 12 + 8px);
  height: ${({ displayFlightLines }) => `calc(48px * ${displayFlightLines + 2} + 8px)`};
`;
const Row = styled_components_1.default.div `
  display: flex;
  height: 48px;
  align-items: center;
`;
const RowArr = (0, styled_components_1.default)(Row) `
  > div:nth-child(1) {
    flex-basis: 81px;
    display: flex;
    justify-content: center;
  }
  > div:nth-child(2) {
    flex-basis: 113px;
  }
  > div:nth-child(3) {
    flex-basis: 57px;
  }
  > div:nth-child(4) {
    margin: 0 7px;
    flex-basis: 74px;
  }
  > div:nth-child(5) {
    flex-basis: 53px;
  }
  > div:nth-child(6) {
    flex-basis: 138px;
  }
  > div:nth-child(7) {
    margin: 0 7px;
    flex-basis: 74px;
  }
`;
const RowDep = (0, styled_components_1.default)(Row) `
  > div:nth-child(1) {
    flex-basis: 81px;
    display: flex;
    justify-content: center;
  }
  > div:nth-child(2) {
    flex-basis: 113px;
  }
  > div:nth-child(3) {
    flex-basis: 57px;
  }
  > div:nth-child(4) {
    margin: 0 7px;
    flex-basis: 74px;
  }
  > div:nth-child(5) {
    flex-basis: 53px;
  }
  > div:nth-child(6) {
    flex-basis: 138px;
  }
  > div:nth-child(7) {
    margin: 0 4px;
    flex-basis: 64px;
  }
  > div:nth-child(8) {
    margin: 0 7px;
    flex-basis: 74px;
  }
`;
const AirLineCode = styled_components_1.default.div `
  span.casFltNo {
    ${({ casFltNo }) => (casFltNo && casFltNo.length > 8 ? "font-size: 12px" : casFltNo && casFltNo.length > 6 ? "font-size: 14px" : "")};
  }
`;
const Footer = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  padding-top: 6px;
  height: 67px;
  width: 100%;
`;
const FlightLineArea = styled_components_1.default.div `
  position: absolute;
  display: flex;
  justify-content: flex-end;
  padding-right: 50px;
  align-items: center;
  height: 44px;
  width: 100%;
  pointer-events: none;
  > div {
    pointer-events: auto;
  }
  > div:nth-child(1) {
    font-size: 12px;
    padding-right: 8px;
    line-height: 15px;
  }
`;
const FlightLineInput = (0, styled_components_1.default)(RawTextInput_1.default) `
  width: 40px;
  height: 40px;
  font-size: 18px;
  text-align: right;
`;
const onSubmit = (formValues, dispatch, props) => {
    if (!props.rowStatusList.find((s) => s.status === "Edited"))
        return;
    const { isDep } = props;
    dispatch((0, multipleFlightMovementModals_1.updateMultipleFlightMovement)({ isDep, formValues }));
};
exports.onSubmit = onSubmit;
exports.default = exports.MultipleFlightMovementModal;
//# sourceMappingURL=MultipleFlightMovementModal.js.map