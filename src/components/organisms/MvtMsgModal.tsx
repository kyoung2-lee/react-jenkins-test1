import dayjs from "dayjs";
import { isEqual } from "lodash";
import React, { useEffect, useState, useMemo } from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import { reduxForm, InjectedFormProps, getFormValues, getFormSyncErrors, submit, FormSubmitHandler } from "redux-form";
import styled, { css } from "styled-components";
import difference from "lodash.difference";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import { storage } from "../../lib/storage";
import { RootState } from "../../store/storeType";
import { useAppDispatch } from "../../store/hooks";
// eslint-disable-next-line import/no-cycle
import * as myValidates from "../../lib/validators/mvtMsgValidator";
import { openDateTimeInputPopup } from "../../reducers/dateTimeInputPopup";
import {
  FormValue,
  FieldName,
  serverErrorItems,
  MvtMsgModalState,
  showMessage,
  closeMvtMsgModal,
  updateAndSendMvtMsg,
  MvtValue,
  updateMvtMsgSuccess,
} from "../../reducers/mvtMsgModal";
import MvtMsgFlgIcon from "../../assets/images/icon/mvt_msg_flg.svg";
import PrimaryButton from "../atoms/PrimaryButton";
import FlightLegDetailHeader, { MvtMsgHeader } from "../molecules/FlightLegDetailHeader";
// eslint-disable-next-line import/no-cycle
import MvtMsgDepContainer from "../molecules/MvtMsgModal/MvtMsgDepContainer";
// eslint-disable-next-line import/no-cycle
import MvtMsgArrContainer from "../molecules/MvtMsgModal/MvtMsgArrContainer";
// eslint-disable-next-line import/no-cycle
import MvtMsgGtbContainer from "../molecules/MvtMsgModal/MvtMsgGtbContainer";
// eslint-disable-next-line import/no-cycle
import MvtMsgAtbContainer from "../molecules/MvtMsgModal/MvtMsgAtbContainer";
// eslint-disable-next-line import/no-cycle
import MvtMsgDivContainer from "../molecules/MvtMsgModal/MvtMsgDivContainer";
// eslint-disable-next-line import/no-cycle
import MvtMsgCommonContainer from "../molecules/MvtMsgModal/MvtMsgCommonContainer";

export type MyProps = {
  mvtMsgModal: MvtMsgModalState;
  formValues: FormValue | undefined;
};

type Props = MyProps & InjectedFormProps<FormValue, MyProps>;

const MvtMsgModal: React.FC<Props> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { mvtMsgModal, formValues, initialValues, handleSubmit, change, untouch } = props;
  const { movementInfo } = mvtMsgModal;
  const dispatch = useAppDispatch();
  const [updateValidationErrors, setUpdateValidationErrors] = useState<string[]>([]);
  const [currentRadioButtonValue, setCurrentRadioButtonValue] = useState<MvtValue>("");
  const [divDisabled, setDivDisabled] = useState(true);
  const [depDisabled, setDepDisabled] = useState(true);
  const [arrDisable, setArrDisabled] = useState(true);
  const [gtbDisabled, setGtbDisabled] = useState(true);
  const [atbDisabled, setAtbDisabled] = useState(true);

  /** 入力項目の変更状態を検知してUpdate&Sendボタンを制御する */
  const submitBtnEnabled = useMemo(() => {
    if (!formValues || !movementInfo) return false;
    const { mvtMsgRadioButton, atbInfo, divInfo } = formValues;
    const { actLdUtc, actToUtc, irrSts } = movementInfo;
    switch (mvtMsgRadioButton) {
      case "DEP":
      case "ARR":
      case "GTB":
        return true;
      case "ATB":
        if (!actLdUtc && actToUtc && !irrSts) {
          //  [L/D]値なし、かつ、[T/O]値あり、かつ、イレギュラーではない
          return true;
        }
        if (!actLdUtc && irrSts === "ATB" && atbInfo.cnlCheckBox) {
          //  ATB中、かつ、[L/D]値なし
          return true;
        }
        // それ以外
        return false;
      case "DIV":
        // ラジオボタンONかつ入力項目（DIV先空港）変更有りもしくはキャンセルチェックボックスON
        return !isEqual(divInfo.lstArrApoCd, initialValues.divInfo?.lstArrApoCd) || divInfo.cnlCheckBox;
      default:
        return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  useEffect(() => {
    if (mvtMsgModal.isOpen) resetForm();
  }, [mvtMsgModal.isOpen]);

  useEffect(() => {
    // サーバーのエラーがある場合、赤枠を表示させる
    if (!mvtMsgModal.isFetching) {
      setUpdateValidationErrors(mvtMsgModal.updateValidationErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mvtMsgModal.isFetching]);

  /** ラジオボタン押下処理 */
  const onChangeRadioButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value as MvtValue;
    const prevValue = currentRadioButtonValue;
    if (prevValue) {
      // mvtフォーム内で変更があるか確認して分岐
      if (checkHasDiffInForm(prevValue) || checkHasDiffInMsgSetting(prevValue)) {
        void dispatch(
          showMessage({
            message: SoalaMessage.M40012C({
              onYesButton: () => {
                changeRadioButtonValue(prevValue, newValue);
              },
              // 選択ラジオボタンを元に戻す
              onNoButton: () => change("mvtMsgRadioButton", prevValue),
            }),
          })
        );
      } else {
        changeRadioButtonValue(prevValue, newValue);
      }
    } else {
      // ラジオボタン初回押下時
      changeRadioButtonValue(prevValue, newValue);
    }
  };

  /** ラジオボタン変更処理 */
  const changeRadioButtonValue = (prevValue: MvtValue | null, newValue: MvtValue) => {
    untouchField();
    if (prevValue) {
      initializeMvtForm(prevValue);
    }
    change("mvtMsgRadioButton", newValue);
    setCurrentRadioButtonValue(newValue);
    initializeMsgSetting(newValue);
    switch (newValue) {
      case "DEP":
        setDepDisabled(false);
        break;
      case "ARR":
        setArrDisabled(false);
        break;
      case "GTB":
        setGtbDisabled(false);
        break;
      case "ATB":
        setAtbDisabled(false);
        break;
      case "DIV":
        setDivDisabled(false);
        break;
      default:
        break;
    }
  };

  // 入力項目のtouchedをfalseにして、バリデーションエラーの赤線を解除
  const untouchField = () => {
    const inputFields: FieldName[] = [
      "depInfo.atd",
      "depInfo.actTo",
      "depInfo.depDlyTime1",
      "depInfo.depDlyTime2",
      "depInfo.depDlyTime3",
      "depInfo.depDlyRsnCd1",
      "depInfo.depDlyRsnCd2",
      "depInfo.depDlyRsnCd3",
      "arrInfo.actLd",
      "arrInfo.ata",
      "arrInfo.fuelRemain",
      "arrInfo.arrDlyTime1",
      "arrInfo.arrDlyTime2",
      "arrInfo.arrDlyTime3",
      "arrInfo.arrDlyTime4",
      "arrInfo.arrDlyRsnCd1",
      "arrInfo.arrDlyRsnCd2",
      "arrInfo.arrDlyRsnCd3",
      "arrInfo.arrDlyRsnCd4",
      "arrInfo.windFactor",
      "atbInfo.atbEta",
      "divInfo.divEta",
      "divInfo.lstArrApoCd",
      "msgInfo.priority",
      "msgInfo.dtg",
      "msgInfo.originator",
      "msgInfo.remarks",
      "msgInfo.ttyAddressList",
    ];
    untouch(formName, ...inputFields);
    NotificationCreator.removeAll({ dispatch });
  };

  /** ソフトウェアキーボード（カレンダー日時入力用）を出す */
  const handleDateTimeInputPopup = (value: string | undefined, fieldName: FieldName) => () => {
    const isDomestic = movementInfo?.intDomCat === "D";
    const nowDate = isDomestic ? dayjs().tz("Asia/Tokyo").format("YYYY-MM-DDTHH:mm:ss") : dayjs.utc().format("YYYY-MM-DDTHH:mm:ss");
    const dateRange = movementInfo ? myValidates.getAvailableDateRange(movementInfo.legKey.orgDateLcl) : null;
    const isAtbCorrect = fieldName === "atbInfo.atbEta" && movementInfo?.irrSts === "ATB" && !movementInfo.actLdUtc;
    dispatch(
      openDateTimeInputPopup({
        valueFormat: "YYYY-MM-DD[T]HH:mm:ss",
        currentValue: value || "",
        defaultSetting: value ? { value } : { value: nowDate },
        onEnter: changeValue(fieldName),
        onUpdate: isAtbCorrect
          ? undefined
          : async (dateTime) => {
              // eslint-disable-next-line @typescript-eslint/await-thenable
              await changeValue(fieldName)(dateTime);
              // eslint-disable-next-line @typescript-eslint/await-thenable
              await dispatch(submit(formName));
            },
        doTypoCheck: true,
        minDate: dateRange ? dateRange.minDateDayjs.toDate() : undefined,
        maxDate: dateRange ? dateRange.maxDateDayjs.toDate() : undefined,
      })
    );
  };

  const changeValue = (fieldName: FieldName) => (value: unknown) => {
    change(fieldName, value);
    handleOnChange(fieldName)();
  };

  const handleOnChange = (fieldName: FieldName) => () => {
    // サーバーのバリデーションでエラーとなった対象項目の赤枠を消す
    const errorItems = serverErrorItems[fieldName];
    setUpdateValidationErrors(difference(updateValidationErrors, errorItems));
  };

  const resetForm = () => {
    setCurrentRadioButtonValue("");
    setDepDisabled(true);
    setArrDisabled(true);
    setGtbDisabled(true);
    setAtbDisabled(true);
    setDivDisabled(true);
  };

  const closeModal = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<Element>) => {
    e.stopPropagation();
    const close = () => {
      dispatch(closeMvtMsgModal());
    };
    const formNames: MvtValue[] = ["DEP", "ARR", "GTB", "ATB", "DIV"];
    const formName = formValues?.mvtMsgRadioButton;
    if (formName && (formNames.some(checkHasDiffInForm) || checkHasDiffInMsgSetting(formName))) {
      void dispatch(showMessage({ message: SoalaMessage.M40001C({ onYesButton: close }) }));
    } else {
      close();
    }
  };

  const getIsForceError = (fieldName: FieldName) => {
    const errorItems = serverErrorItems[fieldName];
    for (let xi = 0; xi < errorItems.length; xi++) {
      const includes = updateValidationErrors.includes(errorItems[xi]);
      if (includes) return true;
    }
    return false;
  };

  /** 指定した動態情報を初期化する */
  const initializeMvtForm = (formName: MvtValue, isCnlCheckBox?: boolean) => {
    switch (formName) {
      case "DEP":
        change("depInfo.atd", initialValues.depInfo?.atd);
        change("depInfo.actTo", initialValues.depInfo?.actTo);
        change("depInfo.depDlyTime1", initialValues.depInfo?.depDlyTime1);
        change("depInfo.depDlyTime2", initialValues.depInfo?.depDlyTime2);
        change("depInfo.depDlyTime3", initialValues.depInfo?.depDlyTime3);
        change("depInfo.depDlyRsnCd1", initialValues.depInfo?.depDlyRsnCd1);
        change("depInfo.depDlyRsnCd2", initialValues.depInfo?.depDlyRsnCd2);
        change("depInfo.depDlyRsnCd3", initialValues.depInfo?.depDlyRsnCd3);
        if (!isCnlCheckBox) {
          change("depInfo.cnlCheckBox", false);
          setDepDisabled(true);
        }
        break;
      case "ARR":
        change("arrInfo.actLd", initialValues.arrInfo?.actLd);
        change("arrInfo.ata", initialValues.arrInfo?.ata);
        change("arrInfo.fuelRemain", initialValues.arrInfo?.fuelRemain);
        change("arrInfo.arrDlyTime1", initialValues.arrInfo?.arrDlyTime1);
        change("arrInfo.arrDlyTime2", initialValues.arrInfo?.arrDlyTime2);
        change("arrInfo.arrDlyTime3", initialValues.arrInfo?.arrDlyTime3);
        change("arrInfo.arrDlyRsnCd1", initialValues.arrInfo?.arrDlyRsnCd1);
        change("arrInfo.arrDlyRsnCd2", initialValues.arrInfo?.arrDlyRsnCd2);
        change("arrInfo.arrDlyRsnCd3", initialValues.arrInfo?.arrDlyRsnCd3);
        change("arrInfo.windFactor", initialValues.arrInfo?.windFactor);
        if (!isCnlCheckBox) {
          change("arrInfo.cnlCheckBox", false);
          setArrDisabled(true);
        }
        break;
      case "GTB":
        if (!isCnlCheckBox) {
          change("gtbInfo.cnlCheckBox", false);
          setGtbDisabled(true);
        }
        break;
      case "ATB":
        change("atbInfo.atbEta", initialValues.atbInfo?.atbEta);
        if (!isCnlCheckBox) {
          change("atbInfo.cnlCheckBox", false);
          setAtbDisabled(true);
        }
        break;
      case "DIV":
        change("divInfo.lstArrApoCd", initialValues.divInfo?.lstArrApoCd);
        change("divInfo.divEta", initialValues.divInfo?.divEta);
        if (!isCnlCheckBox) {
          change("divInfo.cnlCheckBox", false);
          setDivDisabled(true);
        }
        break;
      default:
        break;
    }
  };

  /** 指定された動態情報に基づいて送信設定共通入力欄を初期化する */
  const initializeMsgSetting = (formName: MvtValue) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    change("msgInfo.priority", initialValues.msgInfo?.priority);
    change("msgInfo.dtg", initialValues.msgInfo?.dtg);
    change("msgInfo.originator", initialValues.msgInfo?.originator);
    change("msgInfo.remarks", initialValues.msgInfo?.remarks);
    change("msgInfo.ttyAddressList", getInitTtyAddrList(formName));
  };

  /** 指定した動態情報に変更があるかチェックする */
  const checkHasDiffInForm = (formName: MvtValue) => {
    if (formValues) {
      switch (formName) {
        case "DEP":
          return !isEqual(formValues.depInfo, initialValues.depInfo);
        case "ARR":
          return !isEqual(formValues.arrInfo, initialValues.arrInfo);
        case "GTB":
          return !isEqual(formValues.gtbInfo, initialValues.gtbInfo);
        case "ATB":
          return !isEqual(formValues.atbInfo, initialValues.atbInfo);
        case "DIV":
          return !isEqual(formValues.divInfo, initialValues.divInfo);
        default:
          return false;
      }
    }
    return false;
  };

  /** 送信設定共通入力欄に変更があるかチェックする */
  const checkHasDiffInMsgSetting = (formName: MvtValue) => {
    if (formValues && ["DEP", "ARR", "GTB", "ATB", "DIV"].includes(formName)) {
      const { msgInfo } = formValues;
      const { ttyAddressList, priority, dtg, originator, remarks } = msgInfo;
      const initialValueProps = initialValues.msgInfo;

      const isSameTtyAddr = isEqual(ttyAddressList, getInitTtyAddrList(formName));
      const isSamePriority = isEqual(priority, initialValueProps?.priority);
      const isSameDtg = isEqual(dtg, initialValueProps?.dtg);
      const isSameOriginator = isEqual(originator, initialValueProps?.originator);
      const isSameRemarks = isEqual(remarks, initialValueProps?.remarks);

      return !(isSameTtyAddr && isSamePriority && isSameDtg && isSameOriginator && isSameRemarks);
    }
    return false;
  };

  /** 着発区分「DEP」「ARR」双方のTTYアドレスリストを取得する */
  const getDepArrMvtTtyAddrList = () => {
    if (!movementInfo) {
      return [];
    }
    const { depMvtTtyAddrList, arrMvtTtyAddrList } = movementInfo;
    const depArrMvtTtyAddrList: string[] = [...new Set([...depMvtTtyAddrList, ...arrMvtTtyAddrList])];
    return depArrMvtTtyAddrList;
  };

  /** 指定した動態情報のTTYアドレスリストの初期値を取得する */
  const getInitTtyAddrList = (formName: MvtValue) => {
    const msgInfo = initialValues?.msgInfo;
    let ttyAddrList: string[] | undefined;
    switch (formName) {
      case "DEP":
        ttyAddrList = movementInfo?.depMvtTtyAddrList;
        break;
      case "ARR":
        ttyAddrList = movementInfo?.arrMvtTtyAddrList;
        break;
      case "GTB":
      case "ATB":
      case "DIV":
        ttyAddrList = getDepArrMvtTtyAddrList();
        break;
      default:
        return [];
    }

    if (!msgInfo || !ttyAddrList) return [];

    // tty address listの先頭にoriginatorをセットし、一意のtty address listを返す
    return [...new Set([msgInfo.originator, ...ttyAddrList])];
  };

  const mvtMsgHeader: MvtMsgHeader | undefined = movementInfo
    ? {
        alCd: movementInfo.legKey.alCd,
        fltNo: movementInfo.legKey.fltNo,
        orgDateLcl: movementInfo.legKey.orgDateLcl,
        csFlg: movementInfo.csCnt > 0,
        lstDepApoCd: movementInfo.lstDepApoCd,
        lstArrApoCd: movementInfo.lstArrApoCd,
        shipNo: movementInfo.shipNo,
        seatConfCd: movementInfo.seatConfCd,
        trAlCd: movementInfo.trAlCd,
        omAlCd: movementInfo.omAlCd,
        ccCnt: movementInfo.ccCnt,
        caCnt: movementInfo.caCnt,
        dhCcCnt: movementInfo.dhCcCnt,
        dhCaCnt: movementInfo.dhCaCnt,
        actPaxTtl: movementInfo.actPaxTtl,
      }
    : undefined;

  return (
    <Modal isOpen={mvtMsgModal.isOpen} onRequestClose={closeModal} style={customStyles}>
      <Header headerHeight={40}>{mvtMsgHeader && <FlightLegDetailHeader mvtMsgHeader={mvtMsgHeader} onClose={closeModal} />}</Header>
      <FormContent onSubmit={handleSubmit}>
        {movementInfo && formValues && (
          <>
            <GroupBox height={408} color="#FFF" border>
              <MvtMsgDepContainer
                depDisabled={depDisabled}
                movementInfo={movementInfo}
                changeValue={changeValue}
                checkHasDiffInForm={checkHasDiffInForm}
                checkHasDiffInMsgSetting={checkHasDiffInMsgSetting}
                initializeMvtForm={initializeMvtForm}
                initializeMsgSetting={initializeMsgSetting}
                getIsForceError={getIsForceError}
                formValues={formValues}
                handleDateTimeInputPopup={handleDateTimeInputPopup}
                handleOnChange={handleOnChange}
                onChangeRadioButton={onChangeRadioButton}
              />
              <MvtMsgArrContainer
                arrDisabled={arrDisable}
                movementInfo={movementInfo}
                formValues={formValues}
                mvtMsgModalIsOpen={mvtMsgModal.isOpen}
                avgTaxiVisible={mvtMsgModal.avgTaxiVisible}
                changeValue={changeValue}
                checkHasDiffInForm={checkHasDiffInForm}
                checkHasDiffInMsgSetting={checkHasDiffInMsgSetting}
                initializeMvtForm={initializeMvtForm}
                initializeMsgSetting={initializeMsgSetting}
                getIsForceError={getIsForceError}
                handleDateTimeInputPopup={handleDateTimeInputPopup}
                handleOnChange={handleOnChange}
                onChangeRadioButton={onChangeRadioButton}
              />
              <GroupBox height={112} color="#FFF" irr>
                <MvtMsgGtbContainer
                  gtbDisabled={gtbDisabled}
                  movementInfo={movementInfo}
                  changeValue={changeValue}
                  onChangeRadioButton={onChangeRadioButton}
                  checkHasDiffInMsgSetting={checkHasDiffInMsgSetting}
                  initializeMsgSetting={initializeMsgSetting}
                />
                <MvtMsgAtbContainer
                  atbDisabled={atbDisabled}
                  movementInfo={movementInfo}
                  formValues={formValues}
                  changeValue={changeValue}
                  checkHasDiffInForm={checkHasDiffInForm}
                  initializeMvtForm={initializeMvtForm}
                  getIsForceError={getIsForceError}
                  handleDateTimeInputPopup={handleDateTimeInputPopup}
                  handleOnChange={handleOnChange}
                  onChangeRadioButton={onChangeRadioButton}
                />
                <MvtMsgDivContainer
                  divDisabled={divDisabled}
                  movementInfo={movementInfo}
                  formValues={formValues}
                  initialValues={initialValues}
                  changeValue={changeValue}
                  checkHasDiffInForm={checkHasDiffInForm}
                  initializeMvtForm={initializeMvtForm}
                  getIsForceError={getIsForceError}
                  handleDateTimeInputPopup={handleDateTimeInputPopup}
                  handleOnChange={handleOnChange}
                  onChangeRadioButton={onChangeRadioButton}
                />
              </GroupBox>
            </GroupBox>
            <MvtMsgCommonContainer formName={formName} formValues={formValues} change={change} />
            <SubmitButtonContainer>
              <PrimaryButton type="submit" text="Update & Send" width="200px" disabled={!submitBtnEnabled} />
            </SubmitButtonContainer>
          </>
        )}
      </FormContent>
    </Modal>
  );
};

const onSubmit: FormSubmitHandler<FormValue, MyProps> = (formValues, dispatch, _props) => {
  const onSuccess = () => dispatch(updateMvtMsgSuccess());
  const onNotFoundRecord = () => dispatch(closeMvtMsgModal());
  const update = () => {
    dispatch(updateAndSendMvtMsg({ formValues, callbacks: { onSuccess, onNotFoundRecord } }));
  };
  if (formValues.mvtMsgRadioButton === "DEP" && !formValues.depInfo.cnlCheckBox && !formValues.depInfo.eft) {
    NotificationCreator.create({ dispatch, message: SoalaMessage.M50035C() });
    return;
  }
  dispatch(showMessage({ message: SoalaMessage.M30010C({ onYesButton: update }) }));
};

const customStyles: Modal.Styles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 970000000 /* reapop(999999999)の2つ下 */,
  },
  content: {
    position: storage.isPc ? "absolute" : "relative",
    width: "1000px",
    height: "740px",
    top: storage.isPc ? 0 : "3%",
    left: 0,
    right: 0,
    bottom: 0,
    margin: "auto",
    padding: 0,
    border: "none",
    borderRadius: 0,
    overflow: "visible",
  },
};

const FormContent = styled.form`
  font-size: 18px;
  padding: 0px 12px;
  box-sizing: border-box;
`;

const Header = styled.div<{ headerHeight: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
  background: ${(props) => props.theme.color.PRIMARY_GRADIENT};
  position: relative;
  min-height: ${(props) => props.headerHeight}px;
  height: ${(props) => props.headerHeight}px;
`;

const GroupBox = styled.div<{ height: number; color: string; border?: boolean; irr?: boolean }>`
  padding: ${({ irr }) => (irr ? "none" : "0px 12px")};
  margin: 8px 0px;
  width: 100%;
  height: ${({ height }) => height}px;
  border: ${({ border }) => (border ? "1px solid #222" : "none")};
  box-sizing: border-box;
  background-color: ${({ color }) => color};
`;

export const Content = styled.div<{ isMsg?: boolean }>`
  padding: ${({ isMsg }) => (isMsg ? "10px 23px 0px 12px" : "6px 0px 0px 0px")};
  margin: 8px 0px;
  width: 100%;
  height: ${({ isMsg }) => (isMsg ? 204 : 132)}px;
  border: 1px solid #222;
  box-sizing: border-box;
  background-color: #f6f6f6;
`;

export const Flex = styled.div<{ width?: number; position?: string; alignItems?: string }>`
  display: flex;
  justify-content: ${(props) => props.position || "space-between"};
  align-items: ${(props) => props.alignItems || "center"};
  width: ${(props) => (props.width ? `${props.width}px` : "auto")};
`;

export const Row = styled.div<{ marginBottom?: number; width?: number; padding?: string }>`
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  margin-bottom: ${(props) => props.marginBottom ?? 0}px;
  padding: ${(props) => props.padding ?? "0"};
  align-items: center;
`;

export const Col = styled.div<{ width?: number }>`
  display: flex;
  flex-wrap: wrap;
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
`;

export const Label = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: flex-end;
  font-size: 12px;
  opacity: ${({ disabled }) => (disabled ? "0.6" : "inherit")};
  width: 100%;
  height: 14px;
`;

export const Space = styled.div<{ width: number; isDummyLabel?: boolean }>`
  height: ${(props) => (props.isDummyLabel ? "14px" : "100%")};
  width: ${(props) => props.width}px;
`;

export const IrregularContent = styled.div<{ width: number; marginRight?: boolean }>`
  padding-top: 12px;
  margin-right: ${({ marginRight }) => (marginRight ? 8 : 0)}px;
  float: left;
  width: ${({ width }) => width}px;
  height: 100%;
  border: 1px solid #222;
  box-sizing: border-box;
  background-color: #e5c7c6;
`;

export const MvtMsgFlgIconSvg = styled.img.attrs({ src: MvtMsgFlgIcon })``;

export const ComponentLabel = styled.label<{ disabled?: boolean }>`
  font-size: 22px;
  opacity: ${({ disabled }) => (disabled ? "0.6" : "inherit")};
  line-height: 25px;
`;

export const CheckBoxLabel = styled.label<{ disabled?: boolean; checkBoxDisabled?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  ${(props) => css`
    ${props.disabled &&
    `
      cursor: default;
      opacity: 0.6;
      `}
    ${!props.disabled &&
    props.checkBoxDisabled &&
    `
      cursor: default;
      `}
  `}
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
  input[type="checkbox"] {
    margin-left: 4px;
    appearance: none;
    width: 30px;
    height: 30px;
    border: 1px solid ${(props) => props.theme.color.PRIMARY};
    background: ${({ disabled, checkBoxDisabled }) => (disabled || checkBoxDisabled ? "#EBEBE4" : "#FFF")};
    position: relative;
    cursor: pointer;
    outline: none;
    ${(props) => css`
      ${props.disabled &&
      `
      pointer-events: none;
      `}
      ${!props.disabled &&
      props.checkBoxDisabled &&
      `
      pointer-events: none;
      opacity: 0.6;
      `}
    `}
    &:checked {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 4px;
        left: 9px;
        width: 9px;
        height: 14px;
        transform: rotate(45deg);
        border-bottom: 2px solid #fff;
        border-right: 2px solid #fff;
      }
    }
    &:indeterminate {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 14px;
        left: 7px;
        width: 16px;
        border-bottom: 2px solid #fff;
      }
    }
  }
`;

export const LabelItem = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 1px;
  opacity: ${({ disabled }) => (disabled ? "0.6" : "inherit")};
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  margin: 12px 0px;
  width: 100%;
  height: 44px;
  justify-content: center;
  align-items: center;
`;

/// ////////////////////////
// コネクト
/// ////////////////////////
const formName = "mvtMsg";

const MvtMsgModalForm = reduxForm<FormValue, MyProps>({
  form: formName,
  onSubmit, // submitをここで設定しないと、ポップアップ入力画面からRemoteSubmitできない。
  enableReinitialize: true,
})(MvtMsgModal);

export default connect((state: RootState) => ({
  mvtMsgModal: state.mvtMsgModal,
  initialValues: state.mvtMsgModal.initialFormValue,
  formValues: getFormValues(formName)(state) as MyProps["formValues"],
  formSyncErrors: getFormSyncErrors(formName)(state),
}))(MvtMsgModalForm);
