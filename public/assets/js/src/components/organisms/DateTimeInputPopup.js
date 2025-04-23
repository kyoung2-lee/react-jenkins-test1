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
const styled_components_1 = __importDefault(require("styled-components"));
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const hooks_1 = require("../../store/hooks");
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const CloseButton_1 = __importDefault(require("../atoms/CloseButton"));
const DatePickerButton_1 = __importDefault(require("../atoms/DatePickerButton"));
const KeyboardInputNumber2_1 = __importDefault(require("./KeyboardInputNumber2"));
const dateTimeInputPopup_1 = require("../../reducers/dateTimeInputPopup");
const RawTextInput_1 = __importDefault(require("../atoms/RawTextInput"));
const soalaMessages_1 = require("../../lib/soalaMessages");
const notifications_1 = require("../../lib/notifications");
const initialState = {
    date: "",
    pickerDate: null,
    time: "",
    dateTime: "",
    focus: "date",
};
const DATE_FORMAT = "YYYY/MM/DD";
const DATE_TIME_FORMAT = "DDHHmm";
const DateTimeInputPopup = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const isOpen = (0, hooks_1.useAppSelector)((state) => state.dateTimeInputPopup.isOpen);
    const param = (0, hooks_1.useAppSelector)((state) => state.dateTimeInputPopup.param);
    const dateInputRef = react_1.default.useRef(null);
    const timeInputRef = react_1.default.useRef(null);
    const dateTimeInputRef = react_1.default.useRef(null);
    const basicDate = (0, react_1.useRef)(null);
    const [date, setDate] = (0, react_1.useState)(initialState.date);
    const [pickerDate, setPickerDate] = (0, react_1.useState)(initialState.pickerDate);
    const [time, setTime] = (0, react_1.useState)(initialState.time);
    const [dateTime, setDateTime] = (0, react_1.useState)(initialState.dateTime);
    const [focus, setFocus] = (0, react_1.useState)(initialState.focus);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const defaultIsValue = (defaultSetting) => defaultSetting.value !== undefined;
    (0, react_1.useEffect)(() => {
        const { valueFormat, defaultSetting } = param;
        if (isOpen === true) {
            basicDate.current = null;
            // 画面を開いた時にデフォルトを設定
            if (defaultSetting !== undefined) {
                if (defaultSetting === "DeviceDate") {
                    // 端末日付をデフォルトにする
                    basicDate.current = (0, dayjs_1.default)();
                }
                else if (defaultIsValue(defaultSetting)) {
                    // デフォルト指定の場合それをデフォルトにする
                    if (defaultSetting.value) {
                        basicDate.current = (0, dayjs_1.default)(defaultSetting.value, valueFormat);
                    }
                }
                else {
                    // 空港ローカル日付をデフォルトにする
                    const timeDiffUtcHr = Math.trunc(defaultSetting.timeDiffUtc / 100);
                    const timeDiffUtcMin = defaultSetting.timeDiffUtc % 100;
                    basicDate.current = (0, dayjs_1.default)(dayjs_1.default.utc().add(timeDiffUtcMin, "minute").add(timeDiffUtcHr, "hour").format("YYYY-MM-DD HH:mm:ss"));
                }
            }
            if (valueFormat === "YYYY-MM-DD[T]HH:mm:ss") {
                const nextDate = basicDate.current ? basicDate.current.format(DATE_FORMAT) : "";
                setDate(nextDate);
                setPickerDate(nextDate ? (0, dayjs_1.default)(nextDate, DATE_FORMAT).toDate() : null);
                setTime("");
                setDateTime("");
                setFocus("time");
            }
            else if (valueFormat === "YYYY-MM-DD") {
                const nextDate = basicDate.current ? basicDate.current.format(DATE_FORMAT) : "";
                setDate(nextDate);
                setPickerDate(nextDate ? (0, dayjs_1.default)(nextDate, DATE_FORMAT).toDate() : null);
                setTime("");
                setDateTime("");
                setFocus("date");
            }
            else if (valueFormat === "DDHHmm") {
                const nextDateTime = basicDate.current ? basicDate.current.format(DATE_TIME_FORMAT) : "";
                setDate("");
                setPickerDate(null);
                setTime("");
                setDateTime(nextDateTime);
                setFocus("dateTime");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);
    /**
     * 入力値がある場合、誤入力のチェックを行う
     * ポップアップ初期表示時の初期値を基準値とし、基準値-12時間 <= 入力値 >= 基準値+12時間の範囲でなければワーニングを表示
     * @returns boolean
     */
    const typoCheck = () => {
        if (!basicDate.current)
            return false;
        if (!param.doTypoCheck)
            return false;
        if (!date && !time)
            return false;
        const inputDatetime = (0, dayjs_1.default)(date + time, `${DATE_FORMAT}HHmm`); // 入力値
        const checkDateTimeMin = (0, dayjs_1.default)(basicDate.current).subtract(12, "hour").second(0).millisecond(0); // 基準値-12時間
        const checkDateTimeMax = (0, dayjs_1.default)(basicDate.current).add(12, "hour").second(0).millisecond(0); // 基準値+12時間
        if (inputDatetime.isSameOrAfter(checkDateTimeMin) && inputDatetime.isSameOrBefore(checkDateTimeMax)) {
            return false;
        }
        return true;
    };
    /**
     * 確定値を取得する
     * @returns 入力が正常ならstring（空値を含む） 不正ならundefined
     */
    const getConfirmValue = () => {
        const { valueFormat, unableDelete } = param;
        let dayjsDate = null;
        if (valueFormat === "YYYY-MM-DD[T]HH:mm:ss") {
            if (!date && !time) {
                return unableDelete ? undefined : "";
            }
            if (!!date.match(/^\d{4}\/\d{2}\/\d{2}$/) && !!time.match(/^\d{4}$/)) {
                dayjsDate = (0, commonUtil_1.getDayjsCalDate)(date + time, `${DATE_FORMAT}HHmm`);
            }
        }
        else if (valueFormat === "YYYY-MM-DD") {
            if (!date) {
                return unableDelete ? undefined : "";
            }
            if (date.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
                dayjsDate = (0, commonUtil_1.getDayjsCalDate)(date, DATE_FORMAT);
            }
        }
        else if (valueFormat === "DDHHmm") {
            if (!dateTime) {
                return unableDelete ? undefined : "";
            }
            if (dateTime.match(/^\d{6}$/)) {
                dayjsDate = (0, commonUtil_1.getDayjsCalDate)(dateTime, DATE_TIME_FORMAT);
            }
        }
        if (dayjsDate) {
            return dayjsDate.format(valueFormat);
        }
        return undefined;
    };
    const handleOnKeyEnter = () => {
        if (param.onEnter) {
            handleOnEnter();
        }
        else {
            handleOnUpdate();
        }
    };
    const handleOnEnter = () => {
        const { onEnter } = param;
        if (checkCanSubmit() && onEnter) {
            const value = getConfirmValue();
            const msgFlg = typoCheck();
            const execute = () => {
                onEnter(value || "");
                closeModal();
            };
            if (msgFlg) {
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40019C({ onYesButton: execute }) });
            }
            else {
                execute();
            }
        }
    };
    const handleOnUpdate = () => {
        const { onUpdate } = param;
        if (checkCanSubmit() && onUpdate) {
            const value = getConfirmValue();
            const msgFlg = typoCheck();
            const execute = () => {
                onUpdate(value || "");
                closeModal();
            };
            if (msgFlg) {
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40019C({ onYesButton: execute }) });
            }
            else {
                execute();
            }
        }
    };
    const onRequestClose = (e) => {
        e.stopPropagation();
        closeModal();
    };
    const checkCanSubmit = () => {
        const { customValidate } = param;
        const value = getConfirmValue();
        if (value !== undefined) {
            if (customValidate) {
                return customValidate(value);
            }
            return true;
        }
        return false;
    };
    const closeModal = () => {
        setDate(initialState.date);
        setPickerDate(initialState.pickerDate);
        setTime(initialState.time);
        setDateTime(initialState.dateTime);
        setFocus(initialState.focus);
        dispatch((0, dateTimeInputPopup_1.closeDateTimeInputPopup)());
    };
    const handleDatePickerOnChange = (nextPickerDate) => {
        const { valueFormat } = param;
        const nextDate = (0, dayjs_1.default)(nextPickerDate).format(DATE_FORMAT);
        setDate(nextDate);
        setPickerDate(nextPickerDate);
        setFocus((prevFocus) => (valueFormat === "YYYY-MM-DD[T]HH:mm:ss" ? "time" : prevFocus));
        if (storage_1.storage.isPc) {
            if (valueFormat === "YYYY-MM-DD[T]HH:mm:ss") {
                if (timeInputRef && timeInputRef.current) {
                    timeInputRef.current.focus();
                }
            }
            else if (valueFormat === "YYYY-MM-DD") {
                if (dateInputRef && dateInputRef.current) {
                    dateInputRef.current.focus();
                }
            }
            else if (dateTimeInputRef && dateTimeInputRef.current) {
                dateTimeInputRef.current.focus();
            }
        }
    };
    const clearDateValue = () => {
        setDate("");
        setPickerDate(null);
        setFocus("date");
        if (storage_1.storage.isPc) {
            if (dateInputRef && dateInputRef.current) {
                dateInputRef.current.focus();
            }
        }
    };
    const clearTimeValue = () => {
        setTime("");
        setFocus("time");
        if (storage_1.storage.isPc) {
            if (timeInputRef && timeInputRef.current) {
                timeInputRef.current.focus();
            }
        }
    };
    const clearDateTimeValue = () => {
        setDateTime("");
    };
    const handleDelValue = () => {
        let value;
        if (focus === "date") {
            value = date.slice(0, -1);
        }
        else if (focus === "time") {
            value = time.slice(0, -1);
        }
        else {
            value = dateTime.slice(0, -1);
        }
        void changeValue(value);
    };
    const handleOnNumKeyDown = (inputValue) => {
        let value = null;
        if (focus === "date") {
            value = date + inputValue;
        }
        else if (focus === "time") {
            value = time + inputValue;
        }
        else {
            value = dateTime + inputValue;
        }
        if (value) {
            void changeValue(value);
        }
    };
    const handleOnChange = (e) => {
        void changeValue(e.target.value);
    };
    const changeValue = (value) => {
        if (focus === "date") {
            if (dateInputRef && dateInputRef.current) {
                const selectPos = dateInputRef.current.selectionStart;
                const onlyNums = value.replace(/[^\d]/g, "");
                let nextDate = "";
                if (onlyNums.length <= 4) {
                    nextDate = onlyNums;
                }
                else if (onlyNums.length <= 6) {
                    nextDate = `${onlyNums.slice(0, 4)}/${onlyNums.slice(4)}`;
                }
                else {
                    nextDate = `${onlyNums.slice(0, 4)}/${onlyNums.slice(4, 6)}/${onlyNums.slice(6, 8)}`;
                }
                let nextPickerDate = pickerDate;
                if (!nextDate) {
                    nextPickerDate = null;
                }
                else if (nextDate.length === 10) {
                    const dayjsCalDate = (0, commonUtil_1.getDayjsCalDate)(nextDate, DATE_FORMAT);
                    if (dayjsCalDate) {
                        nextPickerDate = dayjsCalDate.toDate();
                    }
                }
                const oldDate = nextDate;
                setDate(nextDate);
                setPickerDate(nextPickerDate);
                // カーソル位置を元に戻す
                if (selectPos !== null) {
                    let addPos = 0;
                    if (selectPos === 5 || selectPos === 8) {
                        if (oldDate.length < nextDate.length) {
                            addPos = 1;
                        }
                        else if (selectPos === value.length) {
                            addPos = 1;
                        }
                    }
                    dateInputRef.current.selectionStart = selectPos + addPos;
                    dateInputRef.current.selectionEnd = selectPos + addPos;
                }
            }
        }
        else if (focus === "time") {
            const nextTime = value.slice(0, 4);
            setTime(nextTime);
        }
        else {
            const nextDateTime = value.slice(0, 6);
            setDateTime(nextDateTime);
        }
    };
    const { valueFormat, currentValue, minDate, maxDate, onEnter, onUpdate, customUpdateButtonName } = param;
    const canSubmit = checkCanSubmit();
    const { isPc } = storage_1.storage;
    const currentValueString = currentValue
        ? (0, dayjs_1.default)(currentValue, valueFormat).format(valueFormat === "YYYY-MM-DD" ? "YYYY/MM/DD" : "YYYY/MM/DD HH:mm")
        : "";
    return (react_1.default.createElement(react_modal_1.default, { isOpen: isOpen, onRequestClose: onRequestClose, style: customStyles },
        react_1.default.createElement(Header, null,
            react_1.default.createElement(CurrentValue, null, currentValueString),
            react_1.default.createElement(ArrowRight, { isPc: isPc },
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faArrowRight, style: { width: "0.875em" } }))),
        react_1.default.createElement(InputArea, { valueFormat: valueFormat },
            react_1.default.createElement(InputTable, null,
                react_1.default.createElement("tbody", null,
                    (valueFormat === "YYYY-MM-DD[T]HH:mm:ss" || valueFormat === "YYYY-MM-DD") && (react_1.default.createElement("tr", null,
                        react_1.default.createElement("td", null, "Date"),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(InputWrapper, null,
                                react_1.default.createElement("div", { style: { position: "relative" } },
                                    react_1.default.createElement(DateInput, { inputRef: dateInputRef, isPc: isPc, onFocus: () => setFocus("date"), onTouchStart: () => setFocus("date"), onChange: handleOnChange, onBlur: (e) => setDate((0, commonUtil_1.removePictograph)(e.target.value)), value: date, placeholder: "yyyymmdd", disabled: storage_1.storage.terminalCat !== commonConst_1.Const.TerminalCat.pc, isShowingShadow: focus === "date", isFixedFocus: false, terminalCat: storage_1.storage.terminalCat, maxLength: 10, autoFocus: valueFormat === "YYYY-MM-DD" && storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc, onEnter: handleOnKeyEnter }),
                                    react_1.default.createElement(DatePickerButton_1.default, { selected: pickerDate, onChange: handleDatePickerOnChange, minDate: minDate, maxDate: maxDate, tabIndex: -1, startOpen: valueFormat === "YYYY-MM-DD", style: { position: "absolute", top: "4px", right: "3px", marginRight: "1px" } })),
                                react_1.default.createElement(CloseButton_1.default, { tabIndex: -1, onClick: clearDateValue, style: { position: "relative", marginLeft: "10px" } }))))),
                    valueFormat === "YYYY-MM-DD[T]HH:mm:ss" && (react_1.default.createElement("tr", null,
                        react_1.default.createElement("td", null, "Time"),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(InputWrapper, null,
                                react_1.default.createElement(TimeInput, { inputRef: timeInputRef, isPc: isPc, onFocus: () => setFocus("time"), onTouchStart: () => setFocus("time"), onChange: handleOnChange, onBlur: (e) => setTime((0, commonUtil_1.removePictograph)(e.target.value)), value: time, placeholder: "hhmm", disabled: storage_1.storage.terminalCat !== commonConst_1.Const.TerminalCat.pc, isShowingShadow: focus === "time", isFixedFocus: false, terminalCat: storage_1.storage.terminalCat, maxLength: 4, autoFocus: storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc, onEnter: handleOnKeyEnter }),
                                react_1.default.createElement(CloseButton_1.default, { tabIndex: -1, onClick: clearTimeValue, style: { position: "relative", marginLeft: "10px" } }))))),
                    valueFormat === "DDHHmm" && (react_1.default.createElement("tr", null,
                        react_1.default.createElement("td", null, "Date\u00A0&\u00A0Time"),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(InputWrapper, null,
                                react_1.default.createElement(DateTimeInput, { inputRef: dateTimeInputRef, isPc: isPc, onFocus: () => setFocus("dateTime"), onTouchStart: () => setFocus("dateTime"), onChange: handleOnChange, onBlur: (e) => setTime((0, commonUtil_1.removePictograph)(e.target.value)), value: dateTime, placeholder: "ddhhmm", disabled: storage_1.storage.terminalCat !== commonConst_1.Const.TerminalCat.pc, isShowingShadow: focus === "dateTime", isFixedFocus: false, terminalCat: storage_1.storage.terminalCat, maxLength: 6, autoFocus: storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc, onEnter: handleOnKeyEnter }),
                                react_1.default.createElement(CloseButton_1.default, { tabIndex: -1, onClick: clearDateTimeValue, style: { position: "relative", marginLeft: "10px" } })))))))),
        react_1.default.createElement(Content, null,
            react_1.default.createElement(KeyboardInputNumber2_1.default, { onDel: handleDelValue, onNumKeyDown: (value) => handleOnNumKeyDown(value) })),
        react_1.default.createElement(Footer, null,
            !!onEnter && react_1.default.createElement(PrimaryButton_1.default, { text: "Enter", disabled: !canSubmit, onClick: handleOnEnter }),
            !!onUpdate && react_1.default.createElement(PrimaryButton_1.default, { text: customUpdateButtonName || "Update", disabled: !canSubmit, onClick: handleOnUpdate }))));
};
const Header = styled_components_1.default.div `
  position: relative;
  display: flex;
  align-items: center;
  height: 35px;
  padding: 3px 10px 0;
  background-color: #f0f0f0;
`;
const CurrentValue = styled_components_1.default.div `
  font-size: 17px;
`;
const ArrowRight = styled_components_1.default.div `
  position: absolute;
  margin-left: ${({ isPc }) => (isPc ? "156px" : "150px")};
`;
const InputArea = styled_components_1.default.div `
  position: "relative";
  display: flex;
  justify-content: center;
  padding: 9px 0 ${({ valueFormat }) => (valueFormat === "YYYY-MM-DD" ? "40px" : "0")};
`;
const InputTable = styled_components_1.default.table `
  tr {
    height: 40px;
    font-size: 18px;
    td:first-child {
      padding-right: 10px;
    }
  }
`;
const InputWrapper = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const DateInput = (0, styled_components_1.default)(RawTextInput_1.default) `
  width: ${({ isPc }) => (isPc ? "152px" : "142px")};
  height: 34px;
  font-size: 18px;
  ::placeholder {
    font-size: 16px;
  }
`;
const TimeInput = (0, styled_components_1.default)(RawTextInput_1.default) `
  width: ${({ isPc }) => (isPc ? "68px" : "64px")};
  height: 34px;
  font-size: 18px;
  ::placeholder {
    font-size: 16px;
  }
`;
const DateTimeInput = (0, styled_components_1.default)(RawTextInput_1.default) `
  width: ${({ isPc }) => (isPc ? "104px" : "100px")};
  height: 34px;
  font-size: 18px;
  ::placeholder {
    font-size: 16px;
  }
`;
const customStyles = {
    overlay: {
        zIndex: 999999990 /* reapop(999999999)の下 */,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    content: {
        position: "static",
        width: "370px",
        padding: 0,
    },
};
const Content = styled_components_1.default.div `
  position: "relative";
  padding: 10px;
`;
const Footer = styled_components_1.default.div `
  position: "relative";
  display: flex;
  justify-content: space-around;
  padding: 10px 40px;
  background-color: #f0f0f0;
  button {
    height: 38px;
    min-width: 96px;
    width: unset;
    padding: 0 14px;
  }
`;
exports.default = DateTimeInputPopup;
//# sourceMappingURL=DateTimeInputPopup.js.map