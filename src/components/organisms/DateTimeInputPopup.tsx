import dayjs from "dayjs";
import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { removePictograph, getDayjsCalDate } from "../../lib/commonUtil";
import { Const } from "../../lib/commonConst";
import { storage } from "../../lib/storage";
import PrimaryButton from "../atoms/PrimaryButton";
import CloseButton from "../atoms/CloseButton";
import DatePickerButton from "../atoms/DatePickerButton";
import KeyboardInputNumber2 from "./KeyboardInputNumber2";
import { DateTimeInputPopupParam, closeDateTimeInputPopup } from "../../reducers/dateTimeInputPopup";
import RawTextInput from "../atoms/RawTextInput";
import { SoalaMessage } from "../../lib/soalaMessages";
import { NotificationCreator } from "../../lib/notifications";

interface State {
  date: string;
  pickerDate: Date | null;
  time: string;
  dateTime: string;
  focus: "date" | "time" | "dateTime";
}

const initialState: State = {
  date: "",
  pickerDate: null,
  time: "",
  dateTime: "",
  focus: "date",
};

const DATE_FORMAT = "YYYY/MM/DD";
const DATE_TIME_FORMAT = "DDHHmm";

const DateTimeInputPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.dateTimeInputPopup.isOpen);
  const param = useAppSelector((state) => state.dateTimeInputPopup.param);

  const dateInputRef = React.useRef<HTMLInputElement>(null);
  const timeInputRef = React.useRef<HTMLInputElement>(null);
  const dateTimeInputRef = React.useRef<HTMLInputElement>(null);
  const basicDate = useRef<dayjs.Dayjs | null>(null);
  const [date, setDate] = useState<State["date"]>(initialState.date);
  const [pickerDate, setPickerDate] = useState<State["pickerDate"]>(initialState.pickerDate);
  const [time, setTime] = useState<State["time"]>(initialState.time);
  const [dateTime, setDateTime] = useState<State["dateTime"]>(initialState.dateTime);
  const [focus, setFocus] = useState<State["focus"]>(initialState.focus);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const defaultIsValue = (defaultSetting: any): defaultSetting is { value: string } => defaultSetting.value !== undefined;

  useEffect(() => {
    const { valueFormat, defaultSetting } = param;

    if (isOpen === true) {
      basicDate.current = null;
      // 画面を開いた時にデフォルトを設定
      if (defaultSetting !== undefined) {
        if (defaultSetting === "DeviceDate") {
          // 端末日付をデフォルトにする
          basicDate.current = dayjs();
        } else if (defaultIsValue(defaultSetting)) {
          // デフォルト指定の場合それをデフォルトにする
          if (defaultSetting.value) {
            basicDate.current = dayjs(defaultSetting.value, valueFormat);
          }
        } else {
          // 空港ローカル日付をデフォルトにする
          const timeDiffUtcHr = Math.trunc(defaultSetting.timeDiffUtc / 100);
          const timeDiffUtcMin = defaultSetting.timeDiffUtc % 100;
          basicDate.current = dayjs(dayjs.utc().add(timeDiffUtcMin, "minute").add(timeDiffUtcHr, "hour").format("YYYY-MM-DD HH:mm:ss"));
        }
      }

      if (valueFormat === "YYYY-MM-DD[T]HH:mm:ss") {
        const nextDate = basicDate.current ? basicDate.current.format(DATE_FORMAT) : "";
        setDate(nextDate);
        setPickerDate(nextDate ? dayjs(nextDate, DATE_FORMAT).toDate() : null);
        setTime("");
        setDateTime("");
        setFocus("time");
      } else if (valueFormat === "YYYY-MM-DD") {
        const nextDate = basicDate.current ? basicDate.current.format(DATE_FORMAT) : "";
        setDate(nextDate);
        setPickerDate(nextDate ? dayjs(nextDate, DATE_FORMAT).toDate() : null);
        setTime("");
        setDateTime("");
        setFocus("date");
      } else if (valueFormat === "DDHHmm") {
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
    if (!basicDate.current) return false;
    if (!param.doTypoCheck) return false;
    if (!date && !time) return false;

    const inputDatetime = dayjs(date + time, `${DATE_FORMAT}HHmm`); // 入力値
    const checkDateTimeMin = dayjs(basicDate.current).subtract(12, "hour").second(0).millisecond(0); // 基準値-12時間
    const checkDateTimeMax = dayjs(basicDate.current).add(12, "hour").second(0).millisecond(0); // 基準値+12時間

    if (inputDatetime.isSameOrAfter(checkDateTimeMin) && inputDatetime.isSameOrBefore(checkDateTimeMax)) {
      return false;
    }
    return true;
  };

  /**
   * 確定値を取得する
   * @returns 入力が正常ならstring（空値を含む） 不正ならundefined
   */
  const getConfirmValue = (): string | undefined => {
    const { valueFormat, unableDelete } = param;
    let dayjsDate: dayjs.Dayjs | null = null;
    if (valueFormat === "YYYY-MM-DD[T]HH:mm:ss") {
      if (!date && !time) {
        return unableDelete ? undefined : "";
      }
      if (!!date.match(/^\d{4}\/\d{2}\/\d{2}$/) && !!time.match(/^\d{4}$/)) {
        dayjsDate = getDayjsCalDate(date + time, `${DATE_FORMAT}HHmm`);
      }
    } else if (valueFormat === "YYYY-MM-DD") {
      if (!date) {
        return unableDelete ? undefined : "";
      }
      if (date.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
        dayjsDate = getDayjsCalDate(date, DATE_FORMAT);
      }
    } else if (valueFormat === "DDHHmm") {
      if (!dateTime) {
        return unableDelete ? undefined : "";
      }
      if (dateTime.match(/^\d{6}$/)) {
        dayjsDate = getDayjsCalDate(dateTime, DATE_TIME_FORMAT);
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
    } else {
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
        NotificationCreator.create({ dispatch, message: SoalaMessage.M40019C({ onYesButton: execute }) });
      } else {
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
        NotificationCreator.create({ dispatch, message: SoalaMessage.M40019C({ onYesButton: execute }) });
      } else {
        execute();
      }
    }
  };

  const onRequestClose = (e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {
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
    dispatch(closeDateTimeInputPopup());
  };

  const handleDatePickerOnChange = (nextPickerDate: Date) => {
    const { valueFormat } = param;
    const nextDate = dayjs(nextPickerDate).format(DATE_FORMAT);
    setDate(nextDate);
    setPickerDate(nextPickerDate);
    setFocus((prevFocus) => (valueFormat === "YYYY-MM-DD[T]HH:mm:ss" ? "time" : prevFocus));
    if (storage.isPc) {
      if (valueFormat === "YYYY-MM-DD[T]HH:mm:ss") {
        if (timeInputRef && timeInputRef.current) {
          timeInputRef.current.focus();
        }
      } else if (valueFormat === "YYYY-MM-DD") {
        if (dateInputRef && dateInputRef.current) {
          dateInputRef.current.focus();
        }
      } else if (dateTimeInputRef && dateTimeInputRef.current) {
        dateTimeInputRef.current.focus();
      }
    }
  };

  const clearDateValue = () => {
    setDate("");
    setPickerDate(null);
    setFocus("date");
    if (storage.isPc) {
      if (dateInputRef && dateInputRef.current) {
        dateInputRef.current.focus();
      }
    }
  };

  const clearTimeValue = () => {
    setTime("");
    setFocus("time");
    if (storage.isPc) {
      if (timeInputRef && timeInputRef.current) {
        timeInputRef.current.focus();
      }
    }
  };

  const clearDateTimeValue = () => {
    setDateTime("");
  };

  const handleDelValue = () => {
    let value: string;
    if (focus === "date") {
      value = date.slice(0, -1);
    } else if (focus === "time") {
      value = time.slice(0, -1);
    } else {
      value = dateTime.slice(0, -1);
    }
    void changeValue(value);
  };

  const handleOnNumKeyDown = (inputValue: string) => {
    let value: string | null = null;
    if (focus === "date") {
      value = date + inputValue;
    } else if (focus === "time") {
      value = time + inputValue;
    } else {
      value = dateTime + inputValue;
    }
    if (value) {
      void changeValue(value);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void changeValue(e.target.value);
  };

  const changeValue = (value: string) => {
    if (focus === "date") {
      if (dateInputRef && dateInputRef.current) {
        const selectPos = dateInputRef.current.selectionStart;
        const onlyNums = value.replace(/[^\d]/g, "");
        let nextDate = "";
        if (onlyNums.length <= 4) {
          nextDate = onlyNums;
        } else if (onlyNums.length <= 6) {
          nextDate = `${onlyNums.slice(0, 4)}/${onlyNums.slice(4)}`;
        } else {
          nextDate = `${onlyNums.slice(0, 4)}/${onlyNums.slice(4, 6)}/${onlyNums.slice(6, 8)}`;
        }

        let nextPickerDate = pickerDate;
        if (!nextDate) {
          nextPickerDate = null;
        } else if (nextDate.length === 10) {
          const dayjsCalDate = getDayjsCalDate(nextDate, DATE_FORMAT);
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
            } else if (selectPos === value.length) {
              addPos = 1;
            }
          }
          dateInputRef.current.selectionStart = selectPos + addPos;
          dateInputRef.current.selectionEnd = selectPos + addPos;
        }
      }
    } else if (focus === "time") {
      const nextTime = value.slice(0, 4);
      setTime(nextTime);
    } else {
      const nextDateTime = value.slice(0, 6);
      setDateTime(nextDateTime);
    }
  };

  const { valueFormat, currentValue, minDate, maxDate, onEnter, onUpdate, customUpdateButtonName } = param;
  const canSubmit = checkCanSubmit();
  const { isPc } = storage;
  const currentValueString = currentValue
    ? dayjs(currentValue, valueFormat).format(valueFormat === "YYYY-MM-DD" ? "YYYY/MM/DD" : "YYYY/MM/DD HH:mm")
    : "";

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <Header>
        <CurrentValue>{currentValueString}</CurrentValue>
        <ArrowRight isPc={isPc}>
          <FontAwesomeIcon icon={faArrowRight} style={{ width: "0.875em" }} />
        </ArrowRight>
      </Header>
      <InputArea valueFormat={valueFormat}>
        <InputTable>
          <tbody>
            {(valueFormat === "YYYY-MM-DD[T]HH:mm:ss" || valueFormat === "YYYY-MM-DD") && (
              <tr>
                <td>Date</td>
                <td>
                  <InputWrapper>
                    <div style={{ position: "relative" }}>
                      <DateInput
                        inputRef={dateInputRef}
                        isPc={isPc}
                        onFocus={() => setFocus("date")}
                        onTouchStart={() => setFocus("date")}
                        onChange={handleOnChange}
                        onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setDate(removePictograph(e.target.value))}
                        value={date}
                        placeholder="yyyymmdd"
                        disabled={storage.terminalCat !== Const.TerminalCat.pc}
                        isShowingShadow={focus === "date"}
                        isFixedFocus={false}
                        terminalCat={storage.terminalCat}
                        maxLength={10}
                        autoFocus={valueFormat === "YYYY-MM-DD" && storage.terminalCat === Const.TerminalCat.pc}
                        onEnter={handleOnKeyEnter}
                      />
                      <DatePickerButton
                        selected={pickerDate}
                        onChange={handleDatePickerOnChange}
                        minDate={minDate}
                        maxDate={maxDate}
                        tabIndex={-1}
                        startOpen={valueFormat === "YYYY-MM-DD"}
                        style={{ position: "absolute", top: "4px", right: "3px", marginRight: "1px" }}
                      />
                    </div>
                    <CloseButton tabIndex={-1} onClick={clearDateValue} style={{ position: "relative", marginLeft: "10px" }} />
                  </InputWrapper>
                </td>
              </tr>
            )}
            {valueFormat === "YYYY-MM-DD[T]HH:mm:ss" && (
              <tr>
                <td>Time</td>
                <td>
                  <InputWrapper>
                    <TimeInput
                      inputRef={timeInputRef}
                      isPc={isPc}
                      onFocus={() => setFocus("time")}
                      onTouchStart={() => setFocus("time")}
                      onChange={handleOnChange}
                      onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setTime(removePictograph(e.target.value))}
                      value={time}
                      placeholder="hhmm"
                      disabled={storage.terminalCat !== Const.TerminalCat.pc}
                      isShowingShadow={focus === "time"}
                      isFixedFocus={false}
                      terminalCat={storage.terminalCat}
                      maxLength={4}
                      autoFocus={storage.terminalCat === Const.TerminalCat.pc}
                      onEnter={handleOnKeyEnter}
                    />
                    <CloseButton tabIndex={-1} onClick={clearTimeValue} style={{ position: "relative", marginLeft: "10px" }} />
                  </InputWrapper>
                </td>
              </tr>
            )}
            {valueFormat === "DDHHmm" && (
              <tr>
                <td>Date&nbsp;&&nbsp;Time</td>
                <td>
                  <InputWrapper>
                    <DateTimeInput
                      inputRef={dateTimeInputRef}
                      isPc={isPc}
                      onFocus={() => setFocus("dateTime")}
                      onTouchStart={() => setFocus("dateTime")}
                      onChange={handleOnChange}
                      onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setTime(removePictograph(e.target.value))}
                      value={dateTime}
                      placeholder="ddhhmm"
                      disabled={storage.terminalCat !== Const.TerminalCat.pc}
                      isShowingShadow={focus === "dateTime"}
                      isFixedFocus={false}
                      terminalCat={storage.terminalCat}
                      maxLength={6}
                      autoFocus={storage.terminalCat === Const.TerminalCat.pc}
                      onEnter={handleOnKeyEnter}
                    />
                    <CloseButton tabIndex={-1} onClick={clearDateTimeValue} style={{ position: "relative", marginLeft: "10px" }} />
                  </InputWrapper>
                </td>
              </tr>
            )}
          </tbody>
        </InputTable>
      </InputArea>
      <Content>
        <KeyboardInputNumber2 onDel={handleDelValue} onNumKeyDown={(value: string) => handleOnNumKeyDown(value)} />
      </Content>
      <Footer>
        {!!onEnter && <PrimaryButton text="Enter" disabled={!canSubmit} onClick={handleOnEnter} />}
        {!!onUpdate && <PrimaryButton text={customUpdateButtonName || "Update"} disabled={!canSubmit} onClick={handleOnUpdate} />}
      </Footer>
    </Modal>
  );
};

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 35px;
  padding: 3px 10px 0;
  background-color: #f0f0f0;
`;

const CurrentValue = styled.div`
  font-size: 17px;
`;

const ArrowRight = styled.div<{ isPc: boolean }>`
  position: absolute;
  margin-left: ${({ isPc }) => (isPc ? "156px" : "150px")};
`;

const InputArea = styled.div<{ valueFormat: DateTimeInputPopupParam["valueFormat"] }>`
  position: "relative";
  display: flex;
  justify-content: center;
  padding: 9px 0 ${({ valueFormat }) => (valueFormat === "YYYY-MM-DD" ? "40px" : "0")};
`;

const InputTable = styled.table`
  tr {
    height: 40px;
    font-size: 18px;
    td:first-child {
      padding-right: 10px;
    }
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const DateInput = styled(RawTextInput)<{ isPc: boolean }>`
  width: ${({ isPc }) => (isPc ? "152px" : "142px")};
  height: 34px;
  font-size: 18px;
  ::placeholder {
    font-size: 16px;
  }
`;

const TimeInput = styled(RawTextInput)<{ isPc: boolean }>`
  width: ${({ isPc }) => (isPc ? "68px" : "64px")};
  height: 34px;
  font-size: 18px;
  ::placeholder {
    font-size: 16px;
  }
`;

const DateTimeInput = styled(RawTextInput)<{ isPc: boolean }>`
  width: ${({ isPc }) => (isPc ? "104px" : "100px")};
  height: 34px;
  font-size: 18px;
  ::placeholder {
    font-size: 16px;
  }
`;

const customStyles: Modal.Styles = {
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

const Content = styled.div`
  position: "relative";
  padding: 10px;
`;

const Footer = styled.div`
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

export default DateTimeInputPopup;
