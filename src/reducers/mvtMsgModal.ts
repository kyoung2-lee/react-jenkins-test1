import dayjs from "dayjs";
import { uniq } from "lodash";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store/storeType";
import { ApiError, WebApi } from "../lib/webApi";
import { convertDDHHmmToDate, convertTimeToHhmm } from "../lib/commonUtil";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { AccountState } from "./account";

/**
 * 初期表示
 */
export const openMvtMsgModal = createAsyncThunk<void, { legKey: MvtMsgApi.LegKey }, { dispatch: AppDispatch; state: RootState }>(
  "mvtMsgModal/openMvtMsgModal",
  async (arg, thunkAPI) => {
    const { legKey } = arg;
    const { dispatch, getState } = thunkAPI;
    const { account } = getState();
    const { onlineDbExpDays } = account.master;
    const params: RequestParams = { ...legKey, funcId: "S10603C", onlineDbExpDays, reCalcInstructionFlg: false };
    dispatch(slice.actions.fetchMvtMsg());
    try {
      const response = await WebApi.getMvtMsg(dispatch, params);
      const movementInfo = response.data;
      if (!movementInfo.shipNo) {
        void dispatch(
          showMessage({
            message: SoalaMessage.M50036C(),
          })
        );
        throw new Error();
      }
      if (checkMvtForInitArrDlyCalc(movementInfo) && !checkTaxiingTimeExists(movementInfo.taxiingTimeMin)) {
        void dispatch(
          showMessage({
            message: SoalaMessage.M40022C({}),
          })
        );
      }
      // 初期表示時のAVG TAXI欄の表示状態を取得
      const { formValues, noArrDlyInfo } = getInitialFormValue(movementInfo, account);
      const avgTaxiVisible = !getInitialAvgTaxiInfoHidden(movementInfo, noArrDlyInfo);
      dispatch(setAvgTaxiVisible({ avgTaxiVisible }));
      dispatch(fetchMvtMsgSuccess({ movementInfo, formValues }));
    } catch (err) {
      dispatch(fetchMvtMsgFailure());
    }
  }
);

/**
 * 再計算ボタン押下
 */
export const reCalcInstruction = createAsyncThunk<
  number | null | undefined,
  { legKey: MvtMsgApi.LegKey; callbacks?: WebApi.Callbacks },
  { dispatch: AppDispatch; state: RootState }
>("mvtMsgModal/reCalcInstruction", async (arg, thunkAPI) => {
  const { legKey, callbacks } = arg;
  const { dispatch, getState } = thunkAPI;
  const { account } = getState();
  const { onlineDbExpDays } = account.master;
  const params: RequestParams = { ...legKey, funcId: "S10603C", onlineDbExpDays, reCalcInstructionFlg: true };
  dispatch(slice.actions.fetchMvtMsg());
  try {
    const response = await WebApi.getMvtMsg(dispatch, params, callbacks);
    dispatch(fetchMvtMsgReCalcSuccess({ movementInfo: response.data }));
    return response.data.taxiingTimeMin;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    return undefined;
  }
});

/**
 * MVTメッセージ発信＆更新
 */
export const updateAndSendMvtMsg = createAsyncThunk<
  void,
  { formValues: FormValue; callbacks?: WebApi.Callbacks },
  { dispatch: AppDispatch; state: RootState }
>("mvtMsgModal/updateAndSendMvtMsg", async (arg, thunkAPI) => {
  const { formValues, callbacks } = arg;
  const { dispatch, getState } = thunkAPI;
  const { movementInfo, avgTaxiVisible } = getState().mvtMsgModal;
  dispatch(updateMvtMsg());
  NotificationCreator.removeAll({ dispatch });
  if (!movementInfo) {
    dispatch(updateMvtMsgFailure({ updateValidationErrors: [] }));
    return;
  }
  try {
    // API呼び出し
    const param = getPostRequestParams(formValues, movementInfo, avgTaxiVisible);
    await WebApi.postMvtMsg(dispatch, param, callbacks);
    // updateMvtMsgSuccess()はwebApi側で実行する
  } catch (err) {
    let updateValidationErrors: string[] = [];
    if (err instanceof ApiError && err.response) {
      // 422（バリデーション）エラーの場合、エラーメッセージを表示する
      if (err.response.status === 422) {
        const data = (err.response.data as FlightMovementApi.Post.ErrorResponse) || null;
        if (data && data.errors) {
          data.errors.forEach((error) => {
            updateValidationErrors = updateValidationErrors.concat(error.errorItems);
            // メッセージを表示
            error.errorMessages.forEach((errorText) => {
              NotificationCreator.create({ dispatch, message: SoalaMessage.M50029C({ title: "", errorText }) });
            });
          });
          // 赤枠表示する項目を保持する
          updateValidationErrors = uniq(updateValidationErrors);
        }
      }
    }
    dispatch(updateMvtMsgFailure({ updateValidationErrors }));
  }
});

/**
 * 便動態発信画面の初期値を取得する
 */
const getInitialFormValue = (mvtMsgInfo: MvtMsgApi.Get.Response, account: AccountState): InitFormValueInfo => {
  const isDomestic = mvtMsgInfo.intDomCat === "D";
  const formValues: FormValue = {
    mvtMsgRadioButton: "",
    depInfo: getInitDepInfo(mvtMsgInfo, isDomestic),
    arrInfo: getInitArrInfo(mvtMsgInfo, isDomestic),
    gtbInfo: getInitGtbInfo(mvtMsgInfo),
    atbInfo: getInitAtbInfo(mvtMsgInfo, isDomestic),
    divInfo: getInitDivInfo(mvtMsgInfo, isDomestic),
    msgInfo: getInitMsgInfo(account),
  };
  return setCalcArrDlyInfo(formValues, mvtMsgInfo); // コンポーネント側でも使い回す為、自動計算処理はformValuesを使用する
};

const getInitDepInfo = (mvtMsgInfo: MvtMsgApi.Get.Response, isDomestic: boolean): DepInfo => ({
  msgFlg: mvtMsgInfo.depMvtMsgFlg,
  cnlCheckBox: false,
  std: convertResponseTime(isDomestic, mvtMsgInfo.stdUtc),
  atd: convertResponseTime(isDomestic, mvtMsgInfo.atdUtc),
  actTo: convertResponseTime(isDomestic, mvtMsgInfo.actToUtc),
  eft: convertTimeToHhmm(mvtMsgInfo.eft),
  depDlyTime1: convertTimeToHhmm(mvtMsgInfo.depDlyInfo?.[0]?.depDlyTime),
  depDlyTime2: convertTimeToHhmm(mvtMsgInfo.depDlyInfo?.[1]?.depDlyTime),
  depDlyTime3: convertTimeToHhmm(mvtMsgInfo.depDlyInfo?.[2]?.depDlyTime),
  depDlyRsnCd1: mvtMsgInfo.depDlyInfo?.[0]?.depDlyRsnCd ?? "",
  depDlyRsnCd2: mvtMsgInfo.depDlyInfo?.[1]?.depDlyRsnCd ?? "",
  depDlyRsnCd3: mvtMsgInfo.depDlyInfo?.[2]?.depDlyRsnCd ?? "",
  takeOffFuel: mvtMsgInfo.takeOffFuel,
});

const getInitArrInfo = (mvtMsgInfo: MvtMsgApi.Get.Response, isDomestic: boolean): ArrInfo => ({
  msgFlg: mvtMsgInfo.arrMvtMsgFlg,
  cnlCheckBox: false,
  sta: mvtMsgInfo.irrSts !== "ATB" && mvtMsgInfo.irrSts !== "DIV" ? convertResponseTime(isDomestic, mvtMsgInfo.staUtc) : "",
  actLd: convertResponseTime(isDomestic, mvtMsgInfo.actLdUtc),
  ata: convertResponseTime(isDomestic, mvtMsgInfo.ataUtc),
  fuelRemain: mvtMsgInfo.fuelRemain || mvtMsgInfo.fuelRemain === 0 ? mvtMsgInfo.fuelRemain.toString() : "",
  arrDlyTime1: convertTimeToHhmm(mvtMsgInfo.arrDlyInfo?.[0]?.arrDlyTime),
  arrDlyTime2: convertTimeToHhmm(mvtMsgInfo.arrDlyInfo?.[1]?.arrDlyTime),
  arrDlyTime3: convertTimeToHhmm(mvtMsgInfo.arrDlyInfo?.[2]?.arrDlyTime),
  arrDlyRsnCd1: mvtMsgInfo.arrDlyInfo?.[0]?.arrDlyRsnCd ?? "",
  arrDlyRsnCd2: mvtMsgInfo.arrDlyInfo?.[1]?.arrDlyRsnCd ?? "",
  arrDlyRsnCd3: mvtMsgInfo.arrDlyInfo?.[2]?.arrDlyRsnCd ?? "",
  windFactor: mvtMsgInfo.windFactor,
});

const getInitGtbInfo = (mvtMsgInfo: MvtMsgApi.Get.Response): GtbInfo => ({
  msgFlg: mvtMsgInfo.irrSts === "GTB",
  cnlCheckBox: false,
});

const getInitAtbInfo = (mvtMsgInfo: MvtMsgApi.Get.Response, isDomestic: boolean): AtbInfo => ({
  msgFlg: mvtMsgInfo.irrSts === "ATB",
  cnlCheckBox: false,
  atbEta: convertResponseTime(
    isDomestic,
    mvtMsgInfo.irrSts === "ATB" ? (mvtMsgInfo.tentativeEstLdUtc ? mvtMsgInfo.tentativeEstLdUtc : mvtMsgInfo.estLdUtc) : ""
  ),
});

const getInitDivInfo = (mvtMsgInfo: MvtMsgApi.Get.Response, isDomestic: boolean): DivInfo => ({
  msgFlg: mvtMsgInfo.irrSts === "DIV",
  cnlCheckBox: false,
  divEta: convertResponseTime(
    isDomestic,
    mvtMsgInfo.irrSts === "DIV" ? (mvtMsgInfo.tentativeEstLdUtc ? mvtMsgInfo.tentativeEstLdUtc : mvtMsgInfo.estLdUtc) : ""
  ),
  lstArrApoCd: mvtMsgInfo.irrSts === "DIV" ? mvtMsgInfo.lstArrApoCd : "",
});

const getInitMsgInfo = (account: AccountState): MsgInfo => ({
  priority: "QU",
  dtg: getCurrentUtcTimeInDdhhmm(),
  originator: account.jobAuth.user.ttyAddr,
  remarks: "",
  ttyAddressList: [account.jobAuth.user.ttyAddr],
});

/**
 * UTCの現在時刻を取得する。
 */
const getCurrentUtcTimeInDdhhmm = (): string => {
  const now = new Date();
  return [now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes()].map((num) => num.toString().padStart(2, "0")).join("");
};

const convertResponseTime = (isDomestic: boolean, utcTime: string): string => {
  if (!dayjs(utcTime).isValid()) {
    return "";
  }
  return isDomestic ? dayjs.utc(utcTime).tz("Asia/Tokyo").format("YYYY-MM-DDTHH:mm:ss") : utcTime;
};

const convertRequestTime = (isDomestic: boolean, time: string): string => {
  if (!dayjs(time).isValid()) {
    return "";
  }
  return isDomestic ? dayjs.tz(time, "Asia/Tokyo").utc().format("YYYY-MM-DDTHH:mm:ss") : time;
};

/** 初期表示時のARR DLY自動計算対象の場合、ARR DLY自動計算結果を設定する */
const setCalcArrDlyInfo = (formValues: FormValue, mvtMsgInfo: MvtMsgApi.Get.Response): InitFormValueInfo => {
  if (isEligibleInitArrDlyCalc(mvtMsgInfo)) {
    const arrDlyInfo = getArrDlyInfo(formValues, mvtMsgInfo);
    if (arrDlyInfo) {
      return {
        formValues: {
          ...formValues,
          arrInfo: {
            ...formValues.arrInfo,
            arrDlyTime1: arrDlyInfo.arrDlyTime1,
            arrDlyTime2: arrDlyInfo.arrDlyTime2,
            arrDlyTime3: arrDlyInfo.arrDlyTime3,
            arrDlyRsnCd1: arrDlyInfo.arrDlyRsnCd1,
            arrDlyRsnCd2: arrDlyInfo.arrDlyRsnCd2,
            arrDlyRsnCd3: arrDlyInfo.arrDlyRsnCd3,
          },
        },
        noArrDlyInfo: false,
      };
    }
  }
  return { formValues, noArrDlyInfo: true };
};

/** 初期表示時のARR DLY計算対象かを取得する */
const isEligibleInitArrDlyCalc = (mvtMsgInfo: MvtMsgApi.Get.Response) =>
  checkMvtForInitArrDlyCalc(mvtMsgInfo) && checkTaxiingTimeExists(mvtMsgInfo.taxiingTimeMin);

/** Taxiing時間を取得できているかを確認する */
const checkTaxiingTimeExists = (taxiingTime: number | null | undefined) => typeof taxiingTime === "number";

/** 初期表示時のARR DLY計算対象に該当するか動態情報をチェックする */
const checkMvtForInitArrDlyCalc = (mvtMsgInfo: MvtMsgApi.Get.Response) => {
  const { legCreRsnCd, depMvtMsgFlg, arrMvtMsgFlg, staUtc, ataUtc, stdUtc, orgStdUtc, irrSts } = mvtMsgInfo;
  const mvtCondition = depMvtMsgFlg && !arrMvtMsgFlg && irrSts !== "DIV" && irrSts !== "ATB";
  const ataCondition = dayjs(ataUtc).isValid();
  const staCondition = dayjs(staUtc).isValid();
  const stdCondition = dayjs(stdUtc).isValid() || (legCreRsnCd === "RCV" && dayjs(orgStdUtc).isValid());
  return mvtCondition && ataCondition && staCondition && stdCondition;
};

/** ARR DLY 自動計算処理 */
export const getArrDlyInfo = (
  formValues: FormValue,
  mvtMsgInfo: MvtMsgApi.Get.Response,
  latestTaxiingTime?: number | null
): Record<ArrDlyInfoKey, string> | null => {
  const {
    depInfo: { std, atd, actTo },
    arrInfo: { sta, ata },
  } = formValues;
  const { orgAtdUtc, orgStdUtc, orgToUtc, stdUtc, taxiingTimeMin } = mvtMsgInfo;

  const taxiingTime = latestTaxiingTime || taxiingTimeMin;
  if (typeof taxiingTime !== "number") return null;

  const moStd = dayjs(!dayjs(stdUtc).isValid() ? orgStdUtc : std);
  const moAtd = dayjs(!dayjs(stdUtc).isValid() ? orgAtdUtc : atd);
  const moTo = dayjs(!dayjs(stdUtc).isValid() ? orgToUtc : actTo);
  const moSta = dayjs(sta);
  const moAta = dayjs(ata);

  const arrDlyTime = Math.max(0, moAta.diff(moSta, "minute"));
  const roTime = Math.min(arrDlyTime, Math.max(0, moAtd.diff(moStd, "minute")));
  const rdTime = Math.min(arrDlyTime - roTime, Math.max(0, moTo.diff(moAtd, "minute") - taxiingTime));
  const otherDlyTime = Math.max(0, arrDlyTime - roTime - rdTime);

  const arrDlyInfo: Record<ArrDlyInfoKey, string> = {
    arrDlyTime1: "",
    arrDlyTime2: "",
    arrDlyTime3: "",
    arrDlyRsnCd1: "",
    arrDlyRsnCd2: "",
    arrDlyRsnCd3: "",
  };

  if (arrDlyTime > 0) {
    const delayDetails: {
      code: string;
      time: number;
    }[] = [];

    if (roTime > 0) {
      const roTimeHhmm = convertMinToHHMM(roTime);
      if (roTimeHhmm > 9959) return null;
      delayDetails.push({ code: "RO", time: roTimeHhmm });
    }

    if (rdTime > 0) {
      const rdTimeHhmm = convertMinToHHMM(rdTime);
      if (rdTimeHhmm > 9959) return null;
      delayDetails.push({ code: "RD", time: rdTimeHhmm });
    }

    if (otherDlyTime > 0) {
      const otherDlyTimeHhmm = convertMinToHHMM(otherDlyTime);
      if (otherDlyTimeHhmm > 9959) return null;
      delayDetails.push({ code: "RQ", time: otherDlyTimeHhmm });
    }

    delayDetails.forEach((detail, index) => {
      arrDlyInfo[`arrDlyTime${index + 1}` as ArrDlyInfoKey] = convertTimeToHhmm(detail.time);
      arrDlyInfo[`arrDlyRsnCd${index + 1}` as ArrDlyInfoKey] = detail.code;
    });
  }
  return arrDlyInfo;
};

/** 初期表示時のAVG TAXI情報の非表示状態を取得する */
const getInitialAvgTaxiInfoHidden = (movementInfo: MvtMsgApi.Get.Response, noArrDlyInfo: boolean) => {
  const { depMvtMsgFlg, arrMvtMsgFlg, staUtc, ataUtc, taxiingTimeMin, prevTaxiingTimeMin } = movementInfo;

  const staDayjs = dayjs(staUtc);
  const ataDayjs = dayjs(ataUtc);

  const noDepMvtMsg = !depMvtMsgFlg;
  const isAtbOrDivCondition = isAtbOrDiv(movementInfo);
  const noLatestTaxiTime = checkMvtForInitArrDlyCalc(movementInfo) ? taxiingTimeMin === null : false;
  const valCondition = !staDayjs.isValid() || !ataDayjs.isValid();
  const noArrDly = valCondition || staDayjs >= ataDayjs;
  const noAutoCalcArrDly = arrMvtMsgFlg && prevTaxiingTimeMin === null;

  return noDepMvtMsg || isAtbOrDivCondition || noLatestTaxiTime || valCondition || noArrDly || noAutoCalcArrDly || noArrDlyInfo;
};

/** ATBもしくはDIV中かどうかを判定する */
const isAtbOrDiv = (movementInfo: MvtMsgApi.Get.Response) => {
  const { irrSts } = movementInfo;
  return irrSts === "ATB" || irrSts === "DIV";
};

/** 分形式をHHmm形式に変換する */
const convertMinToHHMM = (num: number): number => {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return hours * 100 + minutes;
};

/** postリクエストパラメータ生成 */
const getPostRequestParams = (
  formValues: FormValue,
  movementInfo: MvtMsgApi.Get.Response,
  avgTaxiVisible: boolean
): MvtMsgApi.Post.Request => {
  const isDomestic = movementInfo.intDomCat === "D";
  return {
    funcId: "S10603C",
    legKey: movementInfo.legKey,
    actionCd: formValues.mvtMsgRadioButton,
    cnlFlg: getCnlFlg(formValues),
    seatConfCd: movementInfo.seatConfCd,
    ccCnt: movementInfo.ccCnt,
    caCnt: movementInfo.caCnt,
    dhCcCnt: movementInfo.dhCcCnt,
    dhCaCnt: movementInfo.dhCaCnt,
    actPaxTtl: movementInfo.actPaxTtl,
    atdUtc: convertRequestTime(isDomestic, formValues.depInfo.atd),
    actToUtc: convertRequestTime(isDomestic, formValues.depInfo.actTo),
    depDlyInfo: convertToPostDepDlyInfo(formValues),
    eft: movementInfo.eft,
    takeOffFuel: movementInfo.takeOffFuel,
    actLdUtc: convertRequestTime(isDomestic, formValues.arrInfo.actLd),
    ataUtc: convertRequestTime(isDomestic, formValues.arrInfo.ata),
    arrDlyInfo: convertToPostArrDlyInfo(formValues),
    windFactor: formValues.arrInfo.windFactor,
    prevMvtDepApoCd: avgTaxiVisible ? movementInfo.lstDepApoCd : null,
    taxiingTimeMin: avgTaxiVisible ? movementInfo.taxiingTimeMin : null,
    fuelRemain: formValues.arrInfo.fuelRemain ? Number(formValues.arrInfo.fuelRemain) : null,
    estLdUtc: convertRequestTime(
      isDomestic,
      formValues.mvtMsgRadioButton === "ATB"
        ? formValues.atbInfo.atbEta
        : formValues.mvtMsgRadioButton === "DIV"
        ? formValues.divInfo.divEta
        : ""
    ),
    lstArrApoCd:
      formValues.mvtMsgRadioButton === "ATB"
        ? movementInfo.legKey.skdDepApoCd
        : formValues.mvtMsgRadioButton === "DIV"
        ? formValues.divInfo.lstArrApoCd
        : "",
    ttyPriorityCd: formValues.msgInfo.priority,
    dtg: dayjs(convertDDHHmmToDate(movementInfo.legKey.orgDateLcl, formValues.msgInfo.dtg)).format("YYYY-MM-DDTHH:mm:ss"),
    originator: formValues.msgInfo.originator,
    remarks: formValues.msgInfo.remarks,
    ttyAddrList: formValues.msgInfo.ttyAddressList,
  };
};

const convertToPostDepDlyInfo = (formValue: FormValue) => {
  const { depInfo } = formValue;
  const depDlyInfo: MvtMsgApi.DepDlyInfo[] = [];
  if (!depInfo.std || (depInfo.std && depInfo.atd && depInfo.std < depInfo.atd)) {
    if (!Number.isNaN(Number(depInfo.depDlyTime1)) && depInfo.depDlyRsnCd1) {
      depDlyInfo.push({
        depDlyTime: Number(depInfo.depDlyTime1),
        depDlyRsnCd: depInfo.depDlyRsnCd1,
      });
    }
    if (!Number.isNaN(Number(depInfo.depDlyTime2)) && depInfo.depDlyRsnCd2) {
      depDlyInfo.push({
        depDlyTime: Number(depInfo.depDlyTime2),
        depDlyRsnCd: depInfo.depDlyRsnCd2,
      });
    }
    if (!Number.isNaN(Number(depInfo.depDlyTime3)) && depInfo.depDlyRsnCd3) {
      depDlyInfo.push({
        depDlyTime: Number(depInfo.depDlyTime3),
        depDlyRsnCd: depInfo.depDlyRsnCd3,
      });
    }
  }
  depDlyInfo.sort((a, b) => {
    if (a.depDlyTime !== b.depDlyTime) {
      return b.depDlyTime - a.depDlyTime;
    }
    return a.depDlyRsnCd.localeCompare(b.depDlyRsnCd);
  });
  return depDlyInfo;
};

const convertToPostArrDlyInfo = (formValue: FormValue) => {
  const { arrInfo } = formValue;
  const arrDlyInfo: MvtMsgApi.ArrDlyInfo[] = [];
  if (!arrInfo.sta || (arrInfo.sta && arrInfo.ata && arrInfo.sta < arrInfo.ata)) {
    if (!Number.isNaN(Number(arrInfo.arrDlyTime1)) && arrInfo.arrDlyRsnCd1) {
      arrDlyInfo.push({
        arrDlyTime: Number(arrInfo.arrDlyTime1),
        arrDlyRsnCd: arrInfo.arrDlyRsnCd1,
      });
    }
    if (!Number.isNaN(Number(arrInfo.arrDlyTime2)) && arrInfo.arrDlyRsnCd2) {
      arrDlyInfo.push({
        arrDlyTime: Number(arrInfo.arrDlyTime2),
        arrDlyRsnCd: arrInfo.arrDlyRsnCd2,
      });
    }
    if (!Number.isNaN(Number(arrInfo.arrDlyTime3)) && arrInfo.arrDlyRsnCd3) {
      arrDlyInfo.push({
        arrDlyTime: Number(arrInfo.arrDlyTime3),
        arrDlyRsnCd: arrInfo.arrDlyRsnCd3,
      });
    }
  }
  arrDlyInfo.sort((a, b) => {
    if (a.arrDlyTime !== b.arrDlyTime) {
      return b.arrDlyTime - a.arrDlyTime;
    }
    return a.arrDlyRsnCd.localeCompare(b.arrDlyRsnCd);
  });
  return arrDlyInfo;
};

const getCnlFlg = (formValues: FormValue) => {
  switch (formValues.mvtMsgRadioButton) {
    case "DEP":
      return formValues.depInfo.cnlCheckBox;
    case "ARR":
      return formValues.arrInfo.cnlCheckBox;
    case "GTB":
      return formValues.gtbInfo.cnlCheckBox;
    case "ATB":
      return formValues.atbInfo.cnlCheckBox;
    case "DIV":
      return formValues.divInfo.cnlCheckBox;
    default:
      return false;
  }
};

export const showMessage = createAsyncThunk<void, { message: NotificationCreator.Message }, { dispatch: AppDispatch }>(
  "mvtMsgModal/showMessage",
  (arg, thunkAPI) => {
    const { message } = arg;
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message });
  }
);

// state
export type MvtMsgModalState = {
  isOpen: boolean;
  isFetching: boolean;
  avgTaxiVisible: boolean;
  movementInfo: MvtMsgInfo | undefined;
  initialFormValue: FormValue;
  updateValidationErrors: string[];
};

export type RequestParams = MvtMsgApi.Get.Request;
export type MvtMsgInfo = MvtMsgApi.Get.Response;

export type MvtValue = "DEP" | "ARR" | "GTB" | "ATB" | "DIV" | "";
export type ArrDlyInfoKey = "arrDlyTime1" | "arrDlyTime2" | "arrDlyTime3" | "arrDlyRsnCd1" | "arrDlyRsnCd2" | "arrDlyRsnCd3";

export type FieldName = keyof typeof serverErrorItems;

/**
 * フォームの項目とサーバーから返却されるエラー項目を紐付ける
 * (フォームの項目): [サーバーの項目, ..]
 */
export const serverErrorItems = {
  "depInfo.msgFlg": ["depMvtMsgFlg"],
  "depInfo.cnlCheckBox": ["depInfo.cnlCheckBox"],
  "depInfo.std": ["stdUtc"],
  "depInfo.atd": ["atdUtc"],
  "depInfo.actTo": ["actToUtc"],
  "depInfo.eft": ["eft"],
  "depInfo.depDlyTime1": ["depDlyInfo", "depDlyTime"],
  "depInfo.depDlyTime2": ["depDlyInfo", "depDlyTime"],
  "depInfo.depDlyTime3": ["depDlyInfo", "depDlyTime"],
  "depInfo.depDlyRsnCd1": ["depDlyInfo", "depDlyRsnCd"],
  "depInfo.depDlyRsnCd2": ["depDlyInfo", "depDlyRsnCd"],
  "depInfo.depDlyRsnCd3": ["depDlyInfo", "depDlyRsnCd"],
  "depInfo.takeOffFuel": ["takeOffFuel"],
  "arrInfo.msgFlg": ["arrMvtMsgFlg"],
  "arrInfo.cnlCheckBox": ["arrInfo.cnlCheckBox"],
  "arrInfo.sta": ["staUtc"],
  "arrInfo.actLd": ["actLdUtc"],
  "arrInfo.ata": ["ataUtc"],
  "arrInfo.fuelRemain": ["fuelRemain"],
  "arrInfo.arrDlyTime1": ["arrDlyInfo", "arrDlyTime"],
  "arrInfo.arrDlyTime2": ["arrDlyInfo", "arrDlyTime"],
  "arrInfo.arrDlyTime3": ["arrDlyInfo", "arrDlyTime"],
  "arrInfo.arrDlyTime4": ["arrDlyInfo", "arrDlyTime"],
  "arrInfo.arrDlyRsnCd1": ["arrDlyInfo", "arrDlyRsnCd"],
  "arrInfo.arrDlyRsnCd2": ["arrDlyInfo", "arrDlyRsnCd"],
  "arrInfo.arrDlyRsnCd3": ["arrDlyInfo", "arrDlyRsnCd"],
  "arrInfo.arrDlyRsnCd4": ["arrDlyInfo", "arrDlyRsnCd"],
  "arrInfo.avgTaxiApoCd": ["prevMvtDepApoCd", "lstDepApoCd"],
  "arrInfo.avgTaxiTime": ["prevTaxiingTimeMin"],
  "arrInfo.windFactor": ["windFactor"],
  "gtbInfo.msgFlg": ["irrSts"],
  "gtbInfo.cnlCheckBox": ["gtbInfo.cnlCheckBox"],
  "atbInfo.msgFlg": ["irrSts"],
  "atbInfo.cnlCheckBox": ["atbInfo.cnlCheckBox"],
  "atbInfo.atbEta": ["tentativeEstLdUtc", "estLdUtc"],
  "divInfo.msgFlg": ["irrSts"],
  "divInfo.cnlCheckBox": ["divInfo.cnlCheckBox"],
  "divInfo.divEta": ["tentativeEstLdUtc", "estLdUtc"],
  "divInfo.lstArrApoCd": ["lstArrApoCd"],
  "msgInfo.priority": ["priority"],
  "msgInfo.dtg": ["dtg"],
  "msgInfo.originator": ["originator"],
  "msgInfo.remarks": ["remarks"],
  "msgInfo.ttyAddressList": ["ttyAddressList"],
};

export type FormValue = {
  mvtMsgRadioButton: MvtValue;
  depInfo: DepInfo;
  arrInfo: ArrInfo;
  gtbInfo: GtbInfo;
  atbInfo: AtbInfo;
  divInfo: DivInfo;
  msgInfo: MsgInfo;
};

type DepInfo = {
  msgFlg: boolean;
  cnlCheckBox: boolean;
  std: string;
  atd: string;
  actTo: string;
  eft: string;
  depDlyTime1: string;
  depDlyTime2: string;
  depDlyTime3: string;
  depDlyRsnCd1: string;
  depDlyRsnCd2: string;
  depDlyRsnCd3: string;
  takeOffFuel: number | null;
};

type ArrInfo = {
  msgFlg: boolean;
  cnlCheckBox: boolean;
  sta: string;
  actLd: string;
  ata: string;
  fuelRemain: string;
  arrDlyTime1: string;
  arrDlyTime2: string;
  arrDlyTime3: string;
  arrDlyRsnCd1: string;
  arrDlyRsnCd2: string;
  arrDlyRsnCd3: string;
  windFactor: string;
};

type GtbInfo = {
  msgFlg: boolean;
  cnlCheckBox: boolean;
};

type AtbInfo = {
  msgFlg: boolean;
  cnlCheckBox: boolean;
  atbEta: string;
};
type DivInfo = {
  msgFlg: boolean;
  cnlCheckBox: boolean;
  divEta: string;
  lstArrApoCd: string;
};

type MsgInfo = {
  priority: string;
  dtg: string;
  originator: string;
  remarks: string;
  ttyAddressList: string[];
};

type InitFormValueInfo = {
  formValues: FormValue;
  noArrDlyInfo: boolean;
};

const initialState: MvtMsgModalState = {
  isOpen: false,
  isFetching: false,
  avgTaxiVisible: false,
  movementInfo: undefined,
  initialFormValue: {
    mvtMsgRadioButton: "",
    depInfo: {
      msgFlg: false,
      cnlCheckBox: false,
      std: "",
      atd: "",
      actTo: "",
      eft: "",
      depDlyTime1: "",
      depDlyTime2: "",
      depDlyTime3: "",
      depDlyRsnCd1: "",
      depDlyRsnCd2: "",
      depDlyRsnCd3: "",
      takeOffFuel: null,
    },
    arrInfo: {
      msgFlg: false,
      cnlCheckBox: false,
      sta: "",
      actLd: "",
      ata: "",
      fuelRemain: "",
      arrDlyTime1: "",
      arrDlyTime2: "",
      arrDlyTime3: "",
      arrDlyRsnCd1: "",
      arrDlyRsnCd2: "",
      arrDlyRsnCd3: "",
      windFactor: "",
    },
    gtbInfo: {
      msgFlg: false,
      cnlCheckBox: false,
    },
    atbInfo: {
      msgFlg: false,
      cnlCheckBox: false,
      atbEta: "",
    },
    divInfo: {
      msgFlg: false,
      cnlCheckBox: false,
      divEta: "",
      lstArrApoCd: "",
    },
    msgInfo: {
      priority: "QU",
      dtg: "",
      originator: "",
      remarks: "",
      ttyAddressList: [],
    },
  },
  updateValidationErrors: [],
};

export const slice = createSlice({
  name: "mvtMsgModal",
  initialState,
  reducers: {
    closeMvtMsgModal: (state) => {
      Object.assign(state, initialState);
    },
    fetchMvtMsg: (state) => {
      state.isOpen = true;
      state.isFetching = true;
    },
    fetchMvtMsgSuccess: (state, action: PayloadAction<{ movementInfo: MvtMsgApi.Get.Response; formValues: FormValue }>) => {
      const { movementInfo, formValues } = action.payload;
      state.isOpen = true;
      state.isFetching = false;
      state.movementInfo = movementInfo;
      state.initialFormValue = formValues;
      state.updateValidationErrors = [];
    },
    fetchMvtMsgReCalcSuccess: (state, action: PayloadAction<{ movementInfo: MvtMsgApi.Get.Response }>) => {
      const { movementInfo } = action.payload;
      state.isOpen = true;
      state.isFetching = false;
      if (state.movementInfo) {
        state.movementInfo.taxiingTimeMin = movementInfo.taxiingTimeMin;
        state.movementInfo.prevMvtDepApoCd = state.movementInfo.legKey.skdDepApoCd;
      }
    },
    fetchMvtMsgFailure: (state) => {
      Object.assign(state, initialState);
    },
    fetchMvtMsgReCalcFailure: (state) => {
      state.isFetching = false;
    },
    updateMvtMsg: (state) => {
      state.isFetching = true;
    },
    updateMvtMsgSuccess: (state) => {
      Object.assign(state, initialState);
    },
    updateMvtMsgFailure: (state, action: PayloadAction<{ updateValidationErrors: string[] }>) => {
      const { updateValidationErrors } = action.payload;
      state.isFetching = false;
      state.updateValidationErrors = updateValidationErrors;
    },
    setAvgTaxiTime: (state, action: PayloadAction<{ taxiingTimeMin: number }>) => {
      const { taxiingTimeMin } = action.payload;
      if (state.movementInfo) {
        state.movementInfo.taxiingTimeMin = taxiingTimeMin;
      }
    },
    setPrevMvtDepApo: (state, action: PayloadAction<{ prevMvtDepApoCd: string }>) => {
      const { prevMvtDepApoCd } = action.payload;
      if (state.movementInfo) {
        state.movementInfo.prevMvtDepApoCd = prevMvtDepApoCd;
      }
    },
    setAvgTaxiVisible: (state, action: PayloadAction<{ avgTaxiVisible: boolean }>) => {
      const { avgTaxiVisible } = action.payload;
      state.avgTaxiVisible = avgTaxiVisible;
    },
  },
});

export const {
  closeMvtMsgModal,
  fetchMvtMsg,
  fetchMvtMsgSuccess,
  fetchMvtMsgReCalcSuccess,
  fetchMvtMsgFailure,
  fetchMvtMsgReCalcFailure,
  updateMvtMsg,
  updateMvtMsgSuccess,
  updateMvtMsgFailure,
  setAvgTaxiTime,
  setPrevMvtDepApo,
  setAvgTaxiVisible,
} = slice.actions;

export default slice.reducer;
