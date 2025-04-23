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
const react_modal_1 = __importDefault(require("react-modal"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const lodash_difference_1 = __importDefault(require("lodash.difference"));
const hooks_1 = require("../../../store/hooks");
const flightMovementModal_1 = require("../../../reducers/flightMovementModal");
const dateTimeInputPopup_1 = require("../../../reducers/dateTimeInputPopup");
const commonUtil_1 = require("../../../lib/commonUtil");
const commonConst_1 = require("../../../lib/commonConst");
const storage_1 = require("../../../lib/storage");
const validates = __importStar(require("../../../lib/validators"));
// eslint-disable-next-line import/no-cycle
const myValidates = __importStar(require("../../../lib/validators/flightMovementValidator"));
const soalaMessages_1 = require("../../../lib/soalaMessages");
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const TimeInputPanel_1 = __importDefault(require("../../molecules/TimeInputPanel"));
const TimeInputPlusMinusButtons_1 = __importDefault(require("../../molecules/TimeInputPlusMinusButtons"));
const FlightModalHeader_1 = __importDefault(require("../../molecules/FlightModalHeader"));
const CommonSlideTab_1 = __importDefault(require("../../molecules/CommonSlideTab"));
const FlightMovementType_1 = require("./FlightMovementType");
const DraggableModal_1 = __importStar(require("../../molecules/DraggableModal"));
// eslint-disable-next-line import/no-cycle
const IrregularContent_1 = __importDefault(require("../../molecules/FlightMovementModal/IrregularContent"));
const config_1 = require("../../../../config/config");
const common_1 = require("../../../reducers/common");
const arrow_right_svg_1 = __importDefault(require("../../../assets/images/icon/arrow_right.svg"));
const FlightMovementModal = (props) => {
    var _a;
    const dispatch = (0, hooks_1.useAppDispatch)();
    const prevIsOpen = (0, hooks_1.usePrevious)(props.flightMovementModal.isOpen);
    const prevMovementInfo = (0, hooks_1.usePrevious)(props.flightMovementModal.movementInfo);
    const prevFormValues = (0, hooks_1.usePrevious)(props.formValues);
    const tabNames = {
        emergency: "Emergency",
        depMvt: "DEP MVT",
        arrMvt: "ARR MVT",
        irregular: "Irregular",
    };
    const tabsDev = (irregularEnabled) => [
        { name: tabNames.emergency, enabled: true },
        { name: tabNames.depMvt, enabled: true },
        { name: tabNames.irregular, enabled: irregularEnabled },
    ];
    const tabsArr = (irregularEnabled) => [
        { name: tabNames.emergency, enabled: true },
        { name: tabNames.arrMvt, enabled: true },
        { name: tabNames.irregular, enabled: irregularEnabled },
    ];
    const [tabs, setTabs] = (0, react_1.useState)(props.flightMovementModal.isDep === undefined ? [] : props.flightMovementModal.isDep ? tabsDev(true) : tabsArr(true));
    const [currentTabName, setCurrentTabName] = (0, react_1.useState)(props.flightMovementModal.isDep === undefined || tabs[0] === undefined
        ? ""
        : tabs[0].name === tabNames.emergency
            ? tabs[1].name
            : tabs[0].name);
    const [updateValidationErrors, setUpdateValidationErrors] = (0, react_1.useState)([]);
    // eslint-disable-next-line react/sort-comp
    const headerHeight = 40;
    // イレギュラー管理画面の更新権限なし、またはJAL GRP便の場合はイレギュラータブを表示しない
    const tabsDevNoIrregular = () => [
        { name: tabNames.emergency, enabled: true },
        { name: tabNames.depMvt, enabled: true },
    ];
    const tabsArrNoIrregular = () => [
        { name: tabNames.emergency, enabled: true },
        { name: tabNames.arrMvt, enabled: true },
    ];
    // 参照モード(便動態更新画面の更新権限なし、またはキャンセル便)の場合はEmergencyタブ、イレギュラータブを表示しない
    const tabsDevRefMode = () => [{ name: tabNames.depMvt, enabled: true }];
    const tabsArrRefMode = () => [{ name: tabNames.arrMvt, enabled: true }];
    const tentativeOptions = [
        { label: "MNR", value: "MNR" },
        { label: "TTV", value: "TTV" },
        { label: "UNK", value: "UNK" },
    ];
    const hasGtbReturnIn = (0, react_1.useMemo)(() => { var _a, _b; return props.flightMovementModal.isOpen && ((_a = props.formValues) === null || _a === void 0 ? void 0 : _a.fisFltSts) === "GTB" && !!((_b = props.formValues) === null || _b === void 0 ? void 0 : _b.depInfo.returnIn); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [(_a = props.formValues) === null || _a === void 0 ? void 0 : _a.depInfo.returnIn, props.flightMovementModal.isOpen]);
    const getIsRefMode = (jobAuth, movementInfo) => !(0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateOalFlightMovement, jobAuth) ||
        !movementInfo ||
        movementInfo.legCnlFlg ||
        movementInfo.connectDbCat === "P";
    // useEffect(() => {
    //   const { formValues } = props;
    //   if (formValues?.fisFltSts === "GTB") {
    //     //      setIsGtbReturnIn(!!formValues?.depInfo.returnIn);
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props.formValues?.depInfo.returnIn]);
    (0, react_1.useEffect)(() => {
        if (!props.flightMovementModal.isOpen && prevIsOpen) {
            setTabs([]);
        }
        else if (!prevMovementInfo && props.flightMovementModal.movementInfo) {
            const { movementInfo } = props.flightMovementModal;
            const isRefMode = getIsRefMode(props.jobAuth.jobAuth, movementInfo);
            if (isRefMode) {
                // 参照モード(便動態更新画面の更新権限なし、またはキャンセル便)の場合
                setTabs(props.flightMovementModal.isDep ? tabsDevRefMode() : tabsArrRefMode());
            }
            else if (!(0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.updateIrregularControl, props.jobAuth.jobAuth) || !props.flightMovementModal.isOal) {
                // イレギュラー管理画面の更新権限なし、またはJAL GRP便の場合
                setTabs(props.flightMovementModal.isDep ? tabsDevNoIrregular() : tabsArrNoIrregular());
            }
            else {
                let irregularEnabled = true;
                if (props.flightMovementModal.movementInfo && props.flightMovementModal.movementInfo.arrInfo.actLdLcl) {
                    irregularEnabled = false;
                }
                setTabs(props.flightMovementModal.isDep ? tabsDev(irregularEnabled) : tabsArr(irregularEnabled));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.flightMovementModal.isOpen, props.flightMovementModal.movementInfo]);
    (0, react_1.useEffect)(() => {
        if (tabs[0] === undefined) {
            setCurrentTabName("");
        }
        else {
            setCurrentTabName(tabs[0] === undefined ? "" : tabs[0].name === tabNames.emergency ? tabs[1].name : tabs[0].name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs]);
    (0, react_1.useEffect)(() => {
        // ATDをブランクにした場合は、連動して遅延情報もブランクにする
        if (prevFormValues && prevFormValues.depInfo.atd && props.formValues && !props.formValues.depInfo.atd) {
            props.change("depInfo.depDlyTime1", "");
            props.change("depInfo.depDlyTime2", "");
            props.change("depInfo.depDlyTime3", "");
            props.change("depInfo.depDlyRsnCd1", "");
            props.change("depInfo.depDlyRsnCd2", "");
            props.change("depInfo.depDlyRsnCd3", "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.formValues]);
    (0, react_1.useEffect)(() => {
        // サーバーのエラーがある場合、赤枠を表示させる
        if (!props.flightMovementModal.isFetching) {
            setUpdateValidationErrors(props.flightMovementModal.updateValidationErrors);
            //       if (!_.isEmpty(this.props.flightMovementModal.updateValidationErrors)) {
            //         const fieldNames = Object.keys(severErrorItems);
            // //        this.props.touch(...fieldNames);
            //       }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.flightMovementModal.isFetching]);
    (0, react_1.useEffect)(() => {
        if (hasGtbReturnIn) {
            props.change("depInfo.atd", "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasGtbReturnIn]);
    // // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
    // untouchField = () => {
    //   const { untouch, formSyncErrors } = this.props;
    //   const validationErrorsFields: string[] = []; // 条件必須の項目はvalidateを持たないため常にtouchedをfalseにする。
    //   Object.keys(formSyncErrors).forEach(subFormName => {
    //     Object.keys(subFormName).forEach(fieldName => validationErrorsFields.push(fieldName))
    //   })
    //   // console.log(JSON.stringify(validationErrorsFields));
    //   if (validationErrorsFields.length) {
    //     untouch(...validationErrorsFields);
    //   }
    // }
    const closeModal = (e) => {
        e.stopPropagation();
        const close = () => {
            dispatch((0, flightMovementModal_1.closeFlightMovementModal)());
        };
        if (props.dirty) {
            void dispatch((0, flightMovementModal_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: close }) }));
        }
        else {
            close();
        }
    };
    const getIsForceError = (fieldName) => {
        const errorItems = FlightMovementType_1.severErrorItems[fieldName];
        for (let xi = 0; xi < errorItems.length; xi++) {
            const includes = updateValidationErrors.includes(errorItems[xi]);
            if (includes)
                return true;
        }
        return false;
    };
    const handleOnClickChange = (tabName) => {
        const changeTab = () => {
            setCurrentTabName(tabName);
            props.reset();
        };
        if (props.dirty) {
            void dispatch((0, flightMovementModal_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: changeTab }) }));
        }
        else {
            changeTab();
        }
    };
    const handleOnClickSkdToEtd = () => {
        const { initialValues } = props;
        if (initialValues && initialValues.depInfo) {
            const fieldName = "depInfo.etd";
            props.change(fieldName, initialValues.depInfo.std);
            handleOnChange(fieldName)();
        }
    };
    const handleOnClickSkdToEta = () => {
        const { initialValues } = props;
        if (initialValues && initialValues.arrInfo) {
            const fieldName = "arrInfo.eta";
            props.change(fieldName, initialValues.arrInfo.sta);
            handleOnChange(fieldName)();
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeValue = (fieldName) => (value) => {
        props.change(fieldName, value);
        handleOnChange(fieldName)();
    };
    const handleDateTimeInputPopup = (value, fieldName) => () => {
        const { movementInfo } = props.flightMovementModal;
        const timeDiffUtc = movementInfo
            ? props.flightMovementModal.isDep
                ? movementInfo.depInfo.lstDepApoTimeDiffUtc
                : movementInfo.arrInfo.lstArrApoTimeDiffUtc
            : -9;
        const dateRange = movementInfo ? myValidates.getAvailableDateRange(movementInfo.legkey.orgDateLcl) : null;
        dispatch((0, dateTimeInputPopup_1.openDateTimeInputPopup)({
            valueFormat: "YYYY-MM-DD[T]HH:mm:ss",
            currentValue: value || "",
            defaultSetting: value ? { value } : { timeDiffUtc },
            onEnter: changeValue(fieldName),
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onUpdate: async (dateTime) => {
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await changeValue(fieldName)(dateTime);
                // eslint-disable-next-line @typescript-eslint/await-thenable
                await dispatch((0, redux_form_1.submit)(formName));
            },
            doTypoCheck: true,
            minDate: dateRange ? dateRange.minDateDayjs.toDate() : undefined,
            maxDate: dateRange ? dateRange.maxDateDayjs.toDate() : undefined,
        }));
    };
    const handleOnChange = (fieldName) => () => {
        // サーバーのバリデーションでエラーとなった対象項目の赤枠を消す
        const errorItems = FlightMovementType_1.severErrorItems[fieldName];
        setUpdateValidationErrors((0, lodash_difference_1.default)(updateValidationErrors, errorItems));
    };
    const formatToDDHHmm = (dateTimeValue) => {
        if (dateTimeValue && (0, dayjs_1.default)(dateTimeValue).isValid()) {
            return (0, dayjs_1.default)(dateTimeValue).format("DDHHmm");
        }
        return "";
    };
    const calculateContentHeight = (isRefMode) => {
        if (DraggableModal_1.draggableModal && storage_1.storage.isIphone) {
            const draggableModalHeight = DraggableModal_1.draggableModal.headHeight + DraggableModal_1.draggableModal.offsetY + DraggableModal_1.draggableModal.deviceTopMargin;
            if (currentTabName === "Irregular") {
                return `calc(100vh - ${draggableModalHeight}px - 36px - 88px - 8px)`;
            }
            if (isRefMode) {
                return `calc(100vh - ${draggableModalHeight}px - 36px)`;
            }
            return `calc(100vh - ${draggableModalHeight}px - 36px - 88px)`;
        }
        return currentTabName === "Irregular" ? "272px" : currentTabName === "Emergency" ? "405px" : "534px";
    };
    const normalizeTime = (value) => {
        const onlyNums = value.replace(/[^\d]/g, "");
        return onlyNums;
    };
    const getContent = () => {
        const { flightMovementModal, master, formValues, handleSubmit, initialValues, dirty, jobAuth } = props;
        const { movementInfo } = flightMovementModal;
        const depDlyRsnOption = master.dlyRsns
            ? master.dlyRsns
                .filter((d) => d.arrDepCd === "DEP")
                .sort((a, b) => a.dispSeq - b.dispSeq)
                .map((d) => ({ label: d.dlyRsnJalCd, value: d.dlyRsnJalCd }))
            : [];
        const isRefMode = getIsRefMode(jobAuth.jobAuth, movementInfo);
        const contentHeight = calculateContentHeight(isRefMode);
        const ddhhmmWidth = 92;
        const isIrregular = currentTabName === tabNames.irregular;
        const isEmergency = currentTabName === tabNames.emergency;
        const isJalGrpAfterTo = !storage_1.storage.takeOffTimeMaint && !flightMovementModal.isOal && !!(movementInfo === null || movementInfo === void 0 ? void 0 : movementInfo.depInfo.actToLcl);
        const fisOptions = movementInfo ? (0, FlightMovementType_1.getfisStsOptions)(movementInfo.fisFltSts, isEmergency, flightMovementModal.isOal) : [];
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(CommonSlideTab_1.default, { currentTabName: currentTabName, tabs: tabs, onClickTab: handleOnClickChange }),
            react_1.default.createElement(FormContent, { onSubmit: handleSubmit },
                react_1.default.createElement(TabContent, { isIphone: storage_1.storage.isIphone, height: contentHeight, isIrregular: isIrregular }, movementInfo && formValues && (react_1.default.createElement(ScrollContent, null, currentTabName === tabNames.depMvt && initialValues.depInfo ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(GroupBox, null,
                        react_1.default.createElement(GroupBoxRow, { marginTop: "0" },
                            react_1.default.createElement(HoSpacePlusMinusButton, null),
                            react_1.default.createElement(LabelContainer, null,
                                react_1.default.createElement("label", null, "FIS Status"),
                                react_1.default.createElement(RowColumnItem, { width: "70px" }, initialValues.fisFltSts)),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(RowColumnItem, null,
                                    react_1.default.createElement(ArrowRightIcon, null))),
                            react_1.default.createElement(redux_form_1.Field, { name: "fisFltSts", width: 74, height: 40, component: SelectBox_1.default, options: fisOptions, disabled: isRefMode, hasBlank: true, disabledSimpleColor: isRefMode, maxMenuHeight: 350, onChange: handleOnChange("fisFltSts"), isForceError: getIsForceError("fisFltSts"), isShadowOnFocus: true, isShowEditedColor: true, autoFocus: true }))),
                    react_1.default.createElement(GroupBox, null,
                        react_1.default.createElement(GroupBoxRow, { marginTop: "0" },
                            react_1.default.createElement(HoSpacePlusMinusButton, null),
                            react_1.default.createElement(LabelContainer, null,
                                react_1.default.createElement("label", null, "STD"),
                                react_1.default.createElement(RowColumnItem, { width: ddhhmmWidth }, formatToDDHHmm(initialValues.depInfo.std)))),
                        react_1.default.createElement(GroupBoxRow, { marginTop: "4px" },
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.depInfo.etd, disabled: isRefMode, onClick: changeValue("depInfo.etd") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", null, "ETD"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "depInfo.etd", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 17, showKeyboard: handleDateTimeInputPopup(formValues.depInfo.etd, "depInfo.etd"), displayValue: formatToDDHHmm(formValues.depInfo.etd), maxLength: 6, disabled: isRefMode, disabledSimpleColor: isRefMode, validate: [myValidates.requiredEtdWithoutStd, myValidates.requiredEtd, myValidates.rangeMovementDate], onChange: handleOnChange("depInfo.etd"), isForceError: getIsForceError("depInfo.etd"), isShadowOnFocus: true, isShowEditedColor: true }))),
                            react_1.default.createElement(HoSpaceS, null),
                            react_1.default.createElement("div", { style: { width: "64px" } }, !isRefMode && react_1.default.createElement(PrimaryButton_1.default, { type: "button", text: "SKD", height: "40px", onClick: handleOnClickSkdToEtd })),
                            react_1.default.createElement(HoSpaceM, null),
                            react_1.default.createElement(LabelContainer, null,
                                react_1.default.createElement("label", null, "M/T/U"),
                                react_1.default.createElement(redux_form_1.Field, { name: "depInfo.etdCd", width: 74, height: 40, component: SelectBox_1.default, options: tentativeOptions, disabled: isRefMode, disabledSimpleColor: isRefMode, hasBlank: true, onChange: handleOnChange("depInfo.etdCd"), isForceError: getIsForceError("depInfo.etdCd"), isShadowOnFocus: true, isShowEditedColor: true }))),
                        react_1.default.createElement(GroupBoxRow, null,
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.depInfo.atd, disabled: isRefMode || isJalGrpAfterTo || hasGtbReturnIn, onClick: changeValue("depInfo.atd") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", null, "ATD"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "depInfo.atd", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 17, showKeyboard: handleDateTimeInputPopup(formValues.depInfo.atd, "depInfo.atd"), displayValue: formatToDDHHmm(formValues.depInfo.atd), maxLength: 6, disabled: isRefMode || isJalGrpAfterTo || hasGtbReturnIn, disabledSimpleColor: isRefMode, validate: [myValidates.requiredATD, myValidates.rangeMovementDate, myValidates.orderAtdTo], onChange: handleOnChange("depInfo.atd"), isForceError: getIsForceError("depInfo.atd"), isShadowOnFocus: true, isShowEditedColor: true, isShowEditedDeletedColor: hasGtbReturnIn }))),
                            react_1.default.createElement(HoSpaceS, null),
                            react_1.default.createElement("div", null, !isRefMode && !isJalGrpAfterTo && !hasGtbReturnIn && (react_1.default.createElement(TimeInputPanel_1.default, { dateTimeValue: formValues.depInfo.atd, timeDiff: movementInfo.depInfo.lstDepApoTimeDiffUtc, onClick: changeValue("depInfo.atd"), height: "40px" })))),
                        (!formValues.depInfo.std ||
                            (formValues.depInfo.std && formValues.depInfo.atd && formValues.depInfo.std < formValues.depInfo.atd)) && (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(GroupBoxRow, null,
                                react_1.default.createElement(HoSpacePlusMinusButton, null),
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", null, "DLY Time/Reason"),
                                    react_1.default.createElement(GroupBoxRowInRow, null,
                                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyTime1", width: 68, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", maxLength: 4, pattern: "\\d*", disabled: isRefMode || isJalGrpAfterTo, disabledSimpleColor: isRefMode, normalize: normalizeTime, validate: [myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime], onChange: handleOnChange("depInfo.depDlyTime1"), isForceError: getIsForceError("depInfo.depDlyTime1"), isShadowOnFocus: true, isShowEditedColor: true }),
                                        react_1.default.createElement(HoSpaceS, null),
                                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyRsnCd1", width: 60, height: 40, component: SelectBox_1.default, options: depDlyRsnOption, disabled: isRefMode || isJalGrpAfterTo, disabledSimpleColor: isRefMode, validate: myValidates.requiredDepDlyRsnCd, maxMenuHeight: 136, onChange: handleOnChange("depInfo.depDlyRsnCd1"), isForceError: getIsForceError("depInfo.depDlyRsnCd1"), hasBlank: true, isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true }))),
                                react_1.default.createElement(HoSpaceL, null),
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement(GroupBoxRowInRow, null,
                                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyTime2", width: 68, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", maxLength: 4, pattern: "\\d*", disabled: isRefMode || isJalGrpAfterTo, disabledSimpleColor: isRefMode, normalize: normalizeTime, validate: [myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime], onChange: handleOnChange("depInfo.depDlyTime2"), isForceError: getIsForceError("depInfo.depDlyTime2"), isShadowOnFocus: true, isShowEditedColor: true }),
                                        react_1.default.createElement(HoSpaceS, null),
                                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyRsnCd2", width: 60, height: 40, component: SelectBox_1.default, options: depDlyRsnOption, disabled: isRefMode || isJalGrpAfterTo, disabledSimpleColor: isRefMode, validate: myValidates.requiredDepDlyRsnCd, maxMenuHeight: 136, onChange: handleOnChange("depInfo.depDlyRsnCd2"), isForceError: getIsForceError("depInfo.depDlyRsnCd2"), hasBlank: true, isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true })))),
                            react_1.default.createElement(GroupBoxRow, { marginTop: "8px" },
                                react_1.default.createElement(HoSpacePlusMinusButton, null),
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement(GroupBoxRowInRow, null,
                                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyTime3", width: 68, height: 40, type: "text", component: TextInput_1.default, placeholder: "hhmm", maxLength: 4, pattern: "\\d*", disabled: isRefMode || isJalGrpAfterTo, disabledSimpleColor: isRefMode, normalize: normalizeTime, validate: [myValidates.requiredDepDlyTime, validates.dlyTime, myValidates.matchDepDlyTime], onChange: handleOnChange("depInfo.depDlyTime3"), isForceError: getIsForceError("depInfo.depDlyTime3"), isShadowOnFocus: true, isShowEditedColor: true }),
                                        react_1.default.createElement(HoSpaceS, null),
                                        react_1.default.createElement(redux_form_1.Field, { name: "depInfo.depDlyRsnCd3", width: 60, height: 40, component: SelectBox_1.default, options: depDlyRsnOption, disabled: isRefMode || isJalGrpAfterTo, disabledSimpleColor: isRefMode, validate: myValidates.requiredDepDlyRsnCd, maxMenuHeight: 136, onChange: handleOnChange("depInfo.depDlyRsnCd3"), isForceError: getIsForceError("depInfo.depDlyRsnCd3"), hasBlank: true, isShadowOnFocus: true, isShowEditedColor: true, isSearchable: true }))),
                                react_1.default.createElement(HoSpaceL, null)))),
                        react_1.default.createElement(GroupBoxRow, null,
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.depInfo.toTime, disabled: isRefMode || isJalGrpAfterTo || movementInfo.irrSts === "GTB", onClick: changeValue("depInfo.toTime") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", null, "T/O"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "depInfo.toTime", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 17, showKeyboard: handleDateTimeInputPopup(formValues.depInfo.toTime, "depInfo.toTime"), displayValue: formatToDDHHmm(formValues.depInfo.toTime), maxLength: 6, disabled: isRefMode || isJalGrpAfterTo || movementInfo.irrSts === "GTB", disabledSimpleColor: isRefMode, validate: [myValidates.rangeMovementDate, myValidates.orderAtdTo, myValidates.orderReturnInTo], onChange: handleOnChange("depInfo.toTime"), isForceError: getIsForceError("depInfo.toTime"), isShadowOnFocus: true, isShowEditedColor: true }))),
                            react_1.default.createElement(HoSpaceS, null),
                            react_1.default.createElement("div", null, !isRefMode && !isJalGrpAfterTo && !(movementInfo.irrSts === "GTB") && (react_1.default.createElement(TimeInputPanel_1.default, { dateTimeValue: formValues.depInfo.toTime, timeDiff: movementInfo.depInfo.lstDepApoTimeDiffUtc, onClick: changeValue("depInfo.toTime"), height: "40px" }))))),
                    movementInfo.depInfo.rtrOccurCnt > 0 && (react_1.default.createElement(GroupBox, { pinkColor: true },
                        react_1.default.createElement(GroupBoxRow, { marginTop: "0" },
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.depInfo.estimateReturnIn, disabled: isRefMode, onClick: changeValue("depInfo.estimateReturnIn") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", { style: { width: ddhhmmWidth } }, "Estimated Return In"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "depInfo.estimateReturnIn", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 17, showKeyboard: handleDateTimeInputPopup(formValues.depInfo.estimateReturnIn, "depInfo.estimateReturnIn"), displayValue: formatToDDHHmm(formValues.depInfo.estimateReturnIn), maxLength: 6, disabled: isRefMode, disabledSimpleColor: isRefMode, validate: [myValidates.rangeMovementDate], onChange: handleOnChange("depInfo.estimateReturnIn"), isForceError: getIsForceError("depInfo.estimateReturnIn"), isShadowOnFocus: true, isShowEditedColor: true }))),
                            react_1.default.createElement(HoSpaceS, null),
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.depInfo.firstBo, disabled: isRefMode, onClick: changeValue("depInfo.firstBo") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", null, "1st B/O"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "depInfo.firstBo", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 17, showKeyboard: handleDateTimeInputPopup(formValues.depInfo.firstBo, "depInfo.firstBo"), displayValue: formatToDDHHmm(formValues.depInfo.firstBo), maxLength: 6, disabled: isRefMode, disabledSimpleColor: isRefMode, validate: [myValidates.rangeMovementDate], onChange: handleOnChange("depInfo.firstBo"), isForceError: getIsForceError("depInfo.firstBo"), isShadowOnFocus: true, isShowEditedColor: true })))),
                        react_1.default.createElement(GroupBoxRow, null,
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.depInfo.returnIn, disabled: isRefMode, onClick: changeValue("depInfo.returnIn") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", null, "Return In"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "depInfo.returnIn", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 17, showKeyboard: handleDateTimeInputPopup(formValues.depInfo.returnIn, "depInfo.returnIn"), displayValue: formatToDDHHmm(formValues.depInfo.returnIn), maxLength: 6, disabled: isRefMode, disabledSimpleColor: isRefMode, validate: [myValidates.requiredReturnIn, myValidates.rangeMovementDate, myValidates.orderReturnInTo], onChange: handleOnChange("depInfo.returnIn"), isForceError: getIsForceError("depInfo.returnIn"), isShadowOnFocus: true, isShowEditedColor: true }))),
                            react_1.default.createElement(HoSpaceS, null),
                            react_1.default.createElement("div", null, !isRefMode && (react_1.default.createElement(TimeInputPanel_1.default, { dateTimeValue: formValues.depInfo.returnIn, timeDiff: movementInfo.depInfo.lstDepApoTimeDiffUtc, onClick: changeValue("depInfo.returnIn"), height: "40px" })))))))) : currentTabName === tabNames.arrMvt && initialValues.arrInfo ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(GroupBox, null,
                        react_1.default.createElement(GroupBoxRow, { marginTop: "0" },
                            react_1.default.createElement(HoSpacePlusMinusButton, null),
                            react_1.default.createElement(LabelContainer, null,
                                react_1.default.createElement("label", null, "FIS Status"),
                                react_1.default.createElement(RowColumnItem, { width: "70px" }, initialValues.fisFltSts)),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(RowColumnItem, null,
                                    react_1.default.createElement(ArrowRightIcon, null))),
                            react_1.default.createElement(redux_form_1.Field, { name: "fisFltSts", width: 74, height: 40, component: SelectBox_1.default, options: fisOptions, disabled: isRefMode, hasBlank: true, disabledSimpleColor: isRefMode, maxMenuHeight: 350, onChange: handleOnChange("fisFltSts"), isForceError: getIsForceError("fisFltSts"), isShadowOnFocus: true, isShowEditedColor: true, autoFocus: true }))),
                    react_1.default.createElement(GroupBox, null,
                        react_1.default.createElement(GroupBoxRow, { marginTop: "0" },
                            react_1.default.createElement(HoSpacePlusMinusButton, null),
                            react_1.default.createElement(LabelContainer, null,
                                react_1.default.createElement("label", null, "STA"),
                                react_1.default.createElement(RowColumnItem, { width: ddhhmmWidth }, movementInfo.irrSts !== "ATB" && movementInfo.irrSts !== "DIV"
                                    ? formatToDDHHmm(initialValues.arrInfo.sta)
                                    : ""))),
                        react_1.default.createElement(GroupBoxRow, { marginTop: "4px" },
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.arrInfo.eta, disabled: isRefMode || movementInfo.irrSts === "ATB" || movementInfo.irrSts === "DIV", onClick: changeValue("arrInfo.eta") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", null, "ETA"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.eta", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "Before DEP", fontSizeOfPlaceholder: 14, showKeyboard: handleDateTimeInputPopup(formValues.arrInfo.eta, "arrInfo.eta"), displayValue: formatToDDHHmm(formValues.arrInfo.eta), maxLength: 6, disabled: isRefMode || movementInfo.irrSts === "ATB" || movementInfo.irrSts === "DIV", disabledSimpleColor: isRefMode, validate: [myValidates.requiredEtaWithoutSta, myValidates.requiredEta, myValidates.rangeMovementDate], onChange: handleOnChange("arrInfo.eta"), isForceError: getIsForceError("arrInfo.eta"), isShadowOnFocus: true, isShowEditedColor: true }))),
                            react_1.default.createElement(HoSpaceS, null),
                            react_1.default.createElement("div", { style: { width: "64px" } }, !isRefMode && movementInfo.irrSts !== "ATB" && movementInfo.irrSts !== "DIV" && (react_1.default.createElement(PrimaryButton_1.default, { type: "button", text: "SKD", height: "40px", onClick: handleOnClickSkdToEta }))),
                            react_1.default.createElement(HoSpaceM, null),
                            react_1.default.createElement(LabelContainer, null,
                                react_1.default.createElement("label", null, "M/T/U"),
                                react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.etaCd", width: 74, height: 40, component: SelectBox_1.default, options: tentativeOptions, disabled: isRefMode || movementInfo.irrSts === "ATB" || movementInfo.irrSts === "DIV", disabledSimpleColor: isRefMode, hasBlank: true, onChange: handleOnChange("arrInfo.etaCd"), isForceError: getIsForceError("arrInfo.etaCd"), isShadowOnFocus: true, isShowEditedColor: true }))),
                        react_1.default.createElement(GroupBoxRow, null,
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.arrInfo.etaLd, disabled: isRefMode, onClick: changeValue("arrInfo.etaLd") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", null, "ETA(L/D)"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.etaLd", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "After DEP", fontSizeOfPlaceholder: 14, showKeyboard: handleDateTimeInputPopup(formValues.arrInfo.etaLd, "arrInfo.etaLd"), displayValue: formatToDDHHmm(formValues.arrInfo.etaLd), maxLength: 6, disabled: isRefMode, disabledSimpleColor: isRefMode, validate: [myValidates.requiredEtaLd, myValidates.rangeMovementDate], onChange: handleOnChange("arrInfo.etaLd"), isForceError: getIsForceError("arrInfo.etaLd"), isShadowOnFocus: true, isShowEditedColor: true }))),
                            react_1.default.createElement(HoSpaceC, { width: 84 }),
                            react_1.default.createElement(LabelContainer, null,
                                react_1.default.createElement("label", null, "M/T/U"),
                                react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.etaLdCd", width: 74, height: 40, component: SelectBox_1.default, options: tentativeOptions, disabled: isRefMode, disabledSimpleColor: isRefMode, hasBlank: true, onChange: handleOnChange("arrInfo.etaLdCd"), isForceError: getIsForceError("arrInfo.etaLdCd"), isShadowOnFocus: true, isShowEditedColor: true }))),
                        react_1.default.createElement(GroupBoxRow, null,
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.arrInfo.etaLdTaxing, disabled: isRefMode, onClick: changeValue("arrInfo.etaLdTaxing") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", { style: { width: ddhhmmWidth } }, "ETA(L/D)+Taxing"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.etaLdTaxing", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 17, showKeyboard: handleDateTimeInputPopup(formValues.arrInfo.etaLdTaxing, "arrInfo.etaLdTaxing"), displayValue: formatToDDHHmm(formValues.arrInfo.etaLdTaxing), maxLength: 6, disabled: isRefMode, disabledSimpleColor: isRefMode, validate: [myValidates.rangeMovementDate], onChange: handleOnChange("arrInfo.etaLdTaxing"), isForceError: getIsForceError("arrInfo.etaLdTaxing"), isShadowOnFocus: true, isShowEditedColor: true })))),
                        react_1.default.createElement(GroupBoxRow, null,
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.arrInfo.ldTime, disabled: isRefMode, onClick: changeValue("arrInfo.ldTime") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", null, "L/D"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.ldTime", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 17, showKeyboard: handleDateTimeInputPopup(formValues.arrInfo.ldTime, "arrInfo.ldTime"), displayValue: formatToDDHHmm(formValues.arrInfo.ldTime), maxLength: 6, disabled: isRefMode, disabledSimpleColor: isRefMode, validate: [myValidates.requiredLd, myValidates.rangeMovementDate, myValidates.orderLdAta], onChange: handleOnChange("arrInfo.ldTime"), isForceError: getIsForceError("arrInfo.ldTime"), isShadowOnFocus: true, isShowEditedColor: true }))),
                            react_1.default.createElement(HoSpaceS, null),
                            react_1.default.createElement("div", null, !isRefMode && (react_1.default.createElement(TimeInputPanel_1.default, { dateTimeValue: formValues.arrInfo.ldTime, timeDiff: movementInfo.arrInfo.lstArrApoTimeDiffUtc, onClick: changeValue("arrInfo.ldTime"), height: "40px" })))),
                        react_1.default.createElement(GroupBoxRow, null,
                            react_1.default.createElement(TimeInputPlusMinusButtons_1.default, { dateTimeValue: formValues.arrInfo.ata, disabled: isRefMode, onClick: changeValue("arrInfo.ata") },
                                react_1.default.createElement(LabelContainer, null,
                                    react_1.default.createElement("label", null, "ATA"),
                                    react_1.default.createElement(redux_form_1.Field, { name: "arrInfo.ata", width: ddhhmmWidth, height: 40, type: "text", component: TextInput_1.default, placeholder: "ddhhmm", fontSizeOfPlaceholder: 17, showKeyboard: handleDateTimeInputPopup(formValues.arrInfo.ata, "arrInfo.ata"), displayValue: formatToDDHHmm(formValues.arrInfo.ata), maxLength: 6, disabled: isRefMode, disabledSimpleColor: isRefMode, validate: [myValidates.rangeMovementDate, myValidates.orderLdAta], onChange: handleOnChange("arrInfo.ata"), isForceError: getIsForceError("arrInfo.ata"), isShadowOnFocus: true, isShowEditedColor: true }))),
                            react_1.default.createElement(HoSpaceS, null),
                            react_1.default.createElement("div", null, !isRefMode && (react_1.default.createElement(TimeInputPanel_1.default, { dateTimeValue: formValues.arrInfo.ata, timeDiff: movementInfo.arrInfo.lstArrApoTimeDiffUtc, onClick: changeValue("arrInfo.ata"), height: "40px" }))))))) : isIrregular ? (react_1.default.createElement(IrregularContent_1.default, { initialValues: initialValues, airports: master.airports, movementInfo: movementInfo, formName: formName, formValues: formValues, 
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    reset: props.reset, showMessage: flightMovementModal_1.showMessage, getIsForceError: getIsForceError, onChange: handleOnChange, handleDateTimeInputPopup: handleDateTimeInputPopup, dispatch: dispatch })) : currentTabName === tabNames.emergency && (initialValues.arrInfo || initialValues.depInfo) ? (react_1.default.createElement(EmergencyContent, null,
                    react_1.default.createElement(EmergencyRow, null, "Emergency"),
                    react_1.default.createElement(FisStatusRow, null,
                        react_1.default.createElement(GroupBoxRow, { marginTop: "0" },
                            react_1.default.createElement(LabelContainer, null,
                                react_1.default.createElement("label", null, "FIS Status"),
                                react_1.default.createElement(RowColumnItem, { width: "70px" }, initialValues.fisFltSts)),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(RowColumnItem, null,
                                    react_1.default.createElement(ArrowRightIcon, null))),
                            react_1.default.createElement(redux_form_1.Field, { name: "fisFltSts", width: 74, height: 40, component: SelectBox_1.default, options: fisOptions, disabled: isRefMode, disabledSimpleColor: isRefMode, maxMenuHeight: 350, onChange: handleOnChange("fisFltSts"), isForceError: getIsForceError("fisFltSts"), isShadowOnFocus: true, isShowEditedColor: true, autoFocus: true }))),
                    react_1.default.createElement(ChangeToHJRow, null, "Change to H/J"))) : undefined))),
                isRefMode ? undefined : (react_1.default.createElement(SubmitButtonContainer, null,
                    react_1.default.createElement(PrimaryButton_1.default, { type: "submit", text: "Update", width: "100px", disabled: !dirty }))))));
    };
    const { flightMovementModal } = props;
    const { movementInfo } = flightMovementModal;
    let flightHeader;
    if (movementInfo) {
        const { orgDateLcl, alCd, fltNo, casFltNo } = movementInfo.legkey;
        flightHeader = {
            orgDateLcl,
            alCd,
            fltNo,
            casFltNo: casFltNo || "",
            lstDepApoCd: movementInfo.depInfo.lstDepApoCd,
            lstArrApoCd: movementInfo.arrInfo.lstArrApoCd,
            csFlg: movementInfo.csCnt > 0,
        };
    }
    if (storage_1.storage.isIphone) {
        return (react_1.default.createElement(DraggableModal_1.default, { isOpen: flightMovementModal.isOpen, style: customStylesI, shouldCloseOnOverlayClick: false, shouldCloseOnEsc: false, key: "OalFlightMovement", header: flightHeader ? react_1.default.createElement(FlightModalHeader_1.default, { isDetail: false, isUtc: false, flightHeader: flightHeader }) : undefined, onFocus: () => { }, onClose: closeModal, isFetching: flightMovementModal.isFetching }, getContent()));
    }
    return (react_1.default.createElement(react_modal_1.default, { isOpen: flightMovementModal.isOpen, onRequestClose: closeModal, style: customStyles },
        react_1.default.createElement(Header, { headerHeight: headerHeight }, flightHeader && react_1.default.createElement(FlightModalHeader_1.default, { isDetail: false, isUtc: false, flightHeader: flightHeader })),
        getContent()));
};
const onSubmit = (formValue, dispatch, props) => {
    if (!props.dirty)
        return;
    const onNotFoundRecord = () => dispatch((0, flightMovementModal_1.closeFlightMovementModal)());
    if (formValue.selectedIrrSts) {
        const update = () => {
            if (!storage_1.storage.isIphone &&
                (formValue.selectedIrrSts === "DIV" || formValue.selectedIrrSts === "DIV COR" || formValue.selectedIrrSts === "ATB")) {
                const callbacks = {
                    onSuccess: () => {
                        if (props.flightMovementModal.movementInfo) {
                            const { casFltNo, alCd, fltNo, orgDateLcl } = props.flightMovementModal.movementInfo.legkey;
                            const flt = casFltNo || alCd + fltNo;
                            const dateFrom = (0, dayjs_1.default)(orgDateLcl).format("YYYY-MM-DD");
                            const casualFlg = !!casFltNo;
                            const path = `${commonConst_1.Const.PATH_NAME.oalFlightSchedule}?flt=${flt}&dateFrom=${dateFrom}&casualFlg=${casualFlg.toString()}`;
                            if (storage_1.storage.isPc) {
                                window.open(`${config_1.ServerConfig.BASE_ROUTE}${path}`, "_blank");
                            }
                            else {
                                dispatch((0, common_1.forceGoTo)({ path }));
                            }
                        }
                    },
                    onNotFoundRecord,
                };
                dispatch((0, flightMovementModal_1.updateFlightIrregular)({ formValue, callbacks }));
            }
            else {
                dispatch((0, flightMovementModal_1.updateFlightIrregular)({ formValue, callbacks: { onNotFoundRecord } }));
            }
        };
        dispatch((0, flightMovementModal_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M30010C({ onYesButton: update }) }));
    }
    else {
        const { initialValues, formValues } = props;
        const update = () => {
            dispatch((0, flightMovementModal_1.updateFlightMovement)({ formValue, callbacks: { onNotFoundRecord } }));
        };
        if (formValues && formValues.fisFltSts === "H/J" && initialValues && initialValues.fisFltSts !== "H/J") {
            dispatch((0, flightMovementModal_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M30010C({ onYesButton: update }) }));
        }
        else {
            update();
        }
    }
};
const customStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 970000000 /* reapop(999999999)の2つ下 */,
    },
    content: {
        position: "relative",
        width: "375px",
        height: "fit-content",
        top: storage_1.storage.isPc ? "calc((100vh - 698px) / 2)" : "5%",
        left: 0,
        right: 0,
        bottom: 0,
        margin: "auto",
        padding: 0,
        border: "none",
        borderRadius: 0,
    },
};
const customStylesI = {
    overlay: {
        background: "transparent",
        pointerEvents: "none",
        zIndex: 960000000 /* reapop(999999999)の3つ下 */,
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
};
const Header = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  min-height: ${(props) => props.headerHeight}px;
  height: ${(props) => props.headerHeight}px;
`;
const FormContent = styled_components_1.default.form `
  font-size: 18px;
`;
const TabContent = styled_components_1.default.div `
  padding: 0 10px;
  height: ${({ height }) => height};
  overflow-y: ${({ isIrregular }) => (isIrregular ? "visible" : "scroll")};
  ::-webkit-scrollbar {
    display: none;
  }
`;
const ScrollContent = styled_components_1.default.div ``;
const EmergencyContent = styled_components_1.default.div `
  margin: 1px -9px;
  padding: 0;
  width: 373px;
  height: 403px;
  border: 9px solid #08121a;
  background-color: #e8ff00;
`;
const GroupBox = styled_components_1.default.div `
  margin: 8px 0;
  padding: 12px 4px;
  width: 100%;
  border: 1px solid #222;
  background-color: ${({ pinkColor }) => (pinkColor ? "#E5C7C6" : "#F6F6F6")};
`;
const GroupBoxRow = styled_components_1.default.div `
  display: flex;
  align-items: flex-end;
  margin-top: ${({ marginTop }) => marginTop || "16px"};
`;
const GroupBoxRowInRow = styled_components_1.default.div `
  display: flex;
  align-items: flex-end;
`;
const RowColumnItem = styled_components_1.default.div `
  display: flex;
  align-items: center;
  height: 40px;
  min-width: ${({ width }) => width};
`;
const EmergencyRow = styled_components_1.default.div `
  margin-top: 66px;
  font-size: 50px;
  font-weight: bold;
  line-height: 64px;
  height: 64px;
  text-align: center;
`;
const FisStatusRow = styled_components_1.default.div `
  margin-top: 33px;
  display: flex;
  justify-content: center;
  width: 100%;
`;
const ChangeToHJRow = styled_components_1.default.div `
  margin-top: 40px;
  font-size: 40px;
  font-weight: bold;
  line-height: 52px;
  height: 52px;
  text-align: center;
`;
const HoSpaceL = styled_components_1.default.div `
  height: 100%;
  width: 24px;
`;
const HoSpaceM = styled_components_1.default.div `
  height: 100%;
  width: 16px;
`;
const HoSpaceS = styled_components_1.default.div `
  height: 100%;
  width: 4px;
`;
const HoSpaceC = styled_components_1.default.div `
  height: 100%;
  width: ${({ width }) => width}px;
`;
const HoSpacePlusMinusButton = styled_components_1.default.div `
  height: 100%;
  width: 40px;
`;
const SubmitButtonContainer = styled_components_1.default.div `
  display: flex;
  width: 100%;
  height: 88px;
  justify-content: center;
  align-items: center;
`;
const LabelContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  label {
    font-size: 12px;
    white-space: nowrap;
    overflow: visible;
  }
`;
const ArrowRightIcon = styled_components_1.default.img.attrs({ src: arrow_right_svg_1.default }) `
  vertical-align: bottom;
  margin: 0 34px 0 8px;
`;
/// ////////////////////////
// コネクト
/// ////////////////////////
const formName = "flightMovement";
const FlightMovementModalWithForm = (0, redux_form_1.reduxForm)({
    form: formName,
    onSubmit,
    enableReinitialize: true,
})(FlightMovementModal);
exports.default = (0, react_redux_1.connect)((state) => ({
    flightMovementModal: state.flightMovementModal,
    jobAuth: state.account.jobAuth,
    master: state.account.master,
    initialValues: state.flightMovementModal.initialFormValue,
    formValues: (0, redux_form_1.getFormValues)(formName)(state),
    formSyncErrors: (0, redux_form_1.getFormSyncErrors)(formName)(state),
}))(FlightMovementModalWithForm);
//# sourceMappingURL=FlightMovementModal.js.map