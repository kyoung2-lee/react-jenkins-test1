import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { getFormValues, change, stopSubmit, getFormSubmitErrors, arrayPush, arraySplice, reset } from "redux-form";
import uniq from "lodash.uniq";
import difference from "lodash.difference";
import { AppDispatch, RootState } from "../store/storeType";
import { NotificationCreator } from "../lib/notifications";
import { WebApi, ApiError } from "../lib/webApi";
import { SoalaMessage } from "../lib/soalaMessages";
// eslint-disable-next-line import/no-cycle
import { initDate } from "./common";
import { formatFltNo } from "../lib/commonUtil";
import { Status } from "../components/atoms/UpdateStatusLabel";
// eslint-disable-next-line import/no-cycle
import { formName as formNameArr } from "../components/organisms/MultipleFlightMovement/MultipleFlightMovementModalArr";
// eslint-disable-next-line import/no-cycle
import { formName as formNameDep } from "../components/organisms/MultipleFlightMovement/MultipleFlightMovementModalDep";
import { severErrorItems } from "../components/organisms/FlightMovementModal/FlightMovementType";

export const fetchMultipleFlightMovement = createAsyncThunk<
  void,
  { loadLegList: LoadLeg[]; isDep: boolean },
  { dispatch: AppDispatch; state: RootState }
>("multipleFlightMovement/fetchMultipleFlightMovement", async (arg, thunkAPI) => {
  const { loadLegList, isDep } = arg;
  const { dispatch, getState } = thunkAPI;

  if (
    getState().flightModals.modals.filter((modal) => modal.opened).length +
      getState().flightListModals.modals.filter((modal) => modal.opened).length <=
    0
  ) {
    dispatch(initDate());
  }

  const { apoCd } = isDep ? getState().multipleFlightMovementModals.modalDep : getState().multipleFlightMovementModals.modalArr;
  const formName = isDep ? formNameDep : formNameArr;
  dispatch(slice.actions.fetchMultipleFlightMovementStart({ isDep }));
  dispatch(reset(formName));
  for (let index = 0; index < loadLegList.length; index++) {
    // 同期処理したいのでforeach()ではなくfor文にしている
    const loadLeg = loadLegList[index];
    const { legKey, isOal, arrOrgApoCd, depDstApoCd } = loadLeg;
    const onlineDbExpDays = isOal ? getState().account.master.oalOnlineDbExpDays : getState().account.master.onlineDbExpDays;

    const params: FlightMovementApi.Get.Request = { ...legKey, funcId: "S10604C", onlineDbExpDays };

    try {
      let movementInfo: MovementInfo;
      const onError = () => {
        void dispatch(closeMultipleFlightMovement({ isDep }));
      };
      const callbacks: WebApi.Callbacks = {
        onSystemError: onError,
        onNetworkError: onError,
      };

      if (isOal) {
        // eslint-disable-next-line no-await-in-loop
        const responseOal = await WebApi.getOalFlightMovement(dispatch, params, callbacks);
        const { oal2Legkey, ...responseArg } = responseOal.data;
        movementInfo = { ...responseArg, legkey: oal2Legkey };
      } else {
        // eslint-disable-next-line no-await-in-loop
        const response = await WebApi.getFlightMovement(dispatch, params, callbacks);
        movementInfo = response.data;
      }
      const rowFormValues = convertToMovementInfoForm({ index, isDep, apoCd, movementInfo, isOal, arrOrgApoCd, depDstApoCd });
      const rowStatus = { status: null, updateValidationErrors: [] };
      dispatch(slice.actions.fetchMultipleFlightMovementRow({ isDep, movementInfo, rowFormValues, rowStatus }));
      dispatch(arrayPush(formName, "rows", rowFormValues)); // フォームデータに設定
    } catch (err) {
      if (!(err instanceof ApiError)) {
        console.error((err as Error).message);
        NotificationCreator.create({ dispatch, message: SoalaMessage.M50021C() });
      }
      break;
    }
  }
  dispatch(slice.actions.fetchMultipleFlightMovementEnd({ isDep }));
});

export const closeMultipleFlightMovement = createAsyncThunk<void, { isDep: boolean }, { dispatch: AppDispatch; state: RootState }>(
  "multipleFlightMovement/closeMultipleFlightMovement",
  (arg, thunkAPI) => {
    const { isDep } = arg;
    const { dispatch } = thunkAPI;

    dispatch(slice.actions.close({ isDep }));
    const formName = isDep ? formNameDep : formNameArr;
    // データを時間で差消すのは閉じる際のアニメーションがあるため
    setTimeout(() => {
      dispatch(slice.actions.clearData({ isDep }));
      dispatch(reset(formName));
    }, 300);
  }
);

const checkHHmmFormat = (value: string): boolean => /^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/.test(value);

export const plusMinusEtaLd = createAsyncThunk<void, { rowIndex: number; isPlus: boolean }, { dispatch: AppDispatch; state: RootState }>(
  "multipleFlightMovement/plusMinusEtaLd",
  ({ rowIndex, isPlus }, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { rows } = getFormValues(formNameArr)(getState()) as FormValues;

    const { etaLd } = rows[rowIndex].arrInfo;
    if (checkHHmmFormat(etaLd)) {
      const currentDate = dayjs();
      const dateWithTime = dayjs(`${currentDate.format("YYYY-MM-DD")}T${etaLd.slice(0, 2)}:${etaLd.slice(2, 4)}`);
      if (dateWithTime.isValid()) {
        let count = -1;
        if (isPlus) count = 1;
        dispatch(change(formNameArr, `rows[${rowIndex}].arrInfo.etaLd`, dateWithTime.add(count, "minute").format("HHmm")));
        void dispatch(valueChanged({ isDep: false, rowIndex, fieldName: "arrInfo.etaLd" }));
      }
    }
  }
);

export const plusMinusEtd = createAsyncThunk<void, { rowIndex: number; isPlus: boolean }, { dispatch: AppDispatch; state: RootState }>(
  "multipleFlightMovement/plusMinusEtd",
  ({ rowIndex, isPlus }, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { rows } = getFormValues(formNameDep)(getState()) as FormValues;

    const { etd, std } = rows[rowIndex].depInfo;
    if (etd) {
      const workEtd = etd === "SKD" ? std : etd;
      if (checkHHmmFormat(workEtd)) {
        const currentDate = dayjs();
        const dateWithTime = dayjs(`${currentDate.format("YYYY-MM-DD")}T${workEtd.slice(0, 2)}:${workEtd.slice(2, 4)}`);
        if (dateWithTime.isValid()) {
          let count = -1;
          if (isPlus) count = 1;
          dispatch(change(formNameDep, `rows[${rowIndex}].depInfo.etd`, dateWithTime.add(count, "minute").format("HHmm")));
          void dispatch(valueChanged({ isDep: true, rowIndex, fieldName: "depInfo.etd" }));
        }
      }
    }
  }
);

export const copySkdToEtd = createAsyncThunk<void, { rowIndex: number }, { dispatch: AppDispatch; state: RootState }>(
  "multipleFlightMovement/copySkdToEtd",
  ({ rowIndex }, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(change(formNameDep, `rows[${rowIndex}].depInfo.etd`, "SKD"));
    void dispatch(valueChanged({ isDep: true, rowIndex, fieldName: "depInfo.etd" }));
  }
);

export const valueChanged = createAsyncThunk<
  void,
  { isDep: boolean; rowIndex: number; fieldName: keyof typeof severErrorItems },
  { dispatch: AppDispatch; state: RootState }
>("multipleFlightMovement/valueChanged", ({ isDep, rowIndex, fieldName }, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  const { modalDep, modalArr } = getState().multipleFlightMovementModals;
  const { rows } = getFormValues(isDep ? formNameDep : formNameArr)(getState()) as FormValues;
  const { rows: errorRows } = getFormSubmitErrors(isDep ? formNameDep : formNameArr)(getState()) as { rows: Partial<RowFormValues>[] };

  const modal = isDep ? modalDep : modalArr;

  // サーバーのバリデーションでエラーとなった対象項目の赤枠を消す
  const errorItems = severErrorItems[fieldName];
  const updateValidationErrors = difference(modal.rowStatusList[rowIndex].updateValidationErrors, errorItems);

  if (errorRows && errorRows.length) {
    const fieledErrors = Object.entries(severErrorItems)
      .filter(([_key, values]) => values.some((value) => updateValidationErrors.includes(value)))
      .map(([key, _values]) => key);
    const newErrorRows = [...errorRows];
    newErrorRows[rowIndex] = getNestedProperties(fieledErrors, "Error");

    const errors = {
      rows: newErrorRows,
    };
    dispatch(stopSubmit(isDep ? formNameDep : formNameArr, errors));
  }
  // 変更されている場合は、Editedにする
  let status: Status = null;

  const initialRow = modal.initialFormValues.rows[rowIndex];
  const row = rows[rowIndex];
  if (isDep) {
    if (
      (initialRow.fisFltSts || "") !== (row.fisFltSts || "") ||
      (initialRow.depInfo.etd || "") !== (row.depInfo.etd || "") ||
      (initialRow.depInfo.etdCd || "") !== (row.depInfo.etdCd || "")
    ) {
      status = "Edited";
    }
  } else if (
    (initialRow.fisFltSts || "") !== (row.fisFltSts || "") ||
    (initialRow.arrInfo.etaLd || "") !== (row.arrInfo.etaLd || "") ||
    (initialRow.arrInfo.etaLdCd || "") !== (row.arrInfo.etaLdCd || "")
  ) {
    status = "Edited";
  }

  dispatch(slice.actions.writeMultipleFlightMovementData({ isDep, rowIndex, rowStatus: { status, updateValidationErrors } }));
});

/**
 * エラーメッセージのタイトルを作成する
 */
function getSoalaMessageTitle({ rowFormValues, movementInfo }: { rowFormValues: RowFormValues; movementInfo: MovementInfo }): string {
  const fltName = rowFormValues.casFltNo || (rowFormValues.alCd || "") + (rowFormValues.fltNo || "");
  return `${fltName}/${rowFormValues.orgDay} ${movementInfo.depInfo.lstDepApoCd}-${movementInfo.arrInfo.lstArrApoCd}`;
}

/**
 * 取得APIのレスポンスデータを画面用フォームデータに変換する
 */
function convertToMovementInfoForm({
  index,
  isDep,
  apoCd,
  movementInfo,
  isOal,
  arrOrgApoCd,
  depDstApoCd,
}: {
  index: number;
  isDep: boolean;
  apoCd: string;
  movementInfo: MovementInfo;
  isOal: boolean;
  arrOrgApoCd: string;
  depDstApoCd: string;
}): RowFormValues {
  const { fisFltSts, depInfo, arrInfo, legkey, legCnlFlg, irrSts } = movementInfo;
  const etdLcl = depInfo.tentativeEtdCd ? depInfo.tentativeEtdLcl : depInfo.etdLcl;
  const estLdLcl = arrInfo.tentativeEstLdCd ? arrInfo.tentativeEstLdLcl : arrInfo.estLdLcl;
  const { alCd, fltNo, casFltNo, orgDateLcl } = legkey;

  return {
    rowNo: index,
    timeStamp: Date.now(),
    isOal,
    legCnlFlg,
    isDivAtbOrgApo: !isDep && (irrSts === "DIV" || irrSts === "ATB") && apoCd !== arrInfo.lstArrApoCd,
    alCd,
    fltNo: formatFltNo(fltNo),
    casFltNo,
    orgDay: orgDateLcl ? dayjs(orgDateLcl).format("DD") : "",
    arrOrgApoCd,
    depDstApoCd,
    fisFltSts: fisFltSts || undefined, // SelectBoxでClearするとundefinedになるので初期値もundefinedにする
    depInfo: {
      std: depInfo.stdLcl ? dayjs(depInfo.stdLcl).format("HHmm") : "",
      etd: etdLcl ? dayjs(etdLcl).format("HHmm") : "",
      etdCd: depInfo.tentativeEtdCd || undefined, // SelectBoxでClearするとundefinedになるので初期値もundefinedにする
    },
    arrInfo: {
      sta: movementInfo.irrSts !== "ATB" && movementInfo.irrSts !== "DIV" && arrInfo.staLcl ? dayjs(arrInfo.staLcl).format("HHmm") : "",
      etaLd: estLdLcl ? dayjs(estLdLcl).format("HHmm") : "",
      etaLdCd: arrInfo.tentativeEstLdCd || undefined, // SelectBoxでClearするとundefinedになるので初期値もundefinedにする
    },
  };
}

function formatHHmmToDateTime(HHmm: string, currentDateWithTimeDiff: dayjs.Dayjs) {
  if (!HHmm || HHmm.length !== 4) return "";
  const addDays = currentDateWithTimeDiff.format("HHmm") <= HHmm ? 0 : 1;
  return currentDateWithTimeDiff
    .add(addDays, "day")
    .hour(parseInt(HHmm.slice(0, 2), 10))
    .minute(parseInt(HHmm.slice(2, 4), 10))
    .second(0)
    .format("YYYY-MM-DD[T]HH:mm:ss");
}

/**
 * 画面用フォームデータを更新APIのリクエストのDepInfoに変換する
 */
function convertToPostMovementDepInfo({
  rowFormValues,
  movementInfo,
  currentDateWithTimeDiff,
}: {
  rowFormValues: RowFormValues;
  movementInfo: MovementInfo;
  currentDateWithTimeDiff: dayjs.Dayjs;
}): CommonFlightInfo.Request.DepInfo {
  const { depInfo } = rowFormValues;
  const etd = depInfo.etd === "SKD" ? movementInfo.depInfo.stdLcl : formatHHmmToDateTime(depInfo.etd, currentDateWithTimeDiff);
  return {
    stdLcl: movementInfo.depInfo.stdLcl,
    etdLcl: depInfo.etdCd ? null : etd,
    tentativeEtdLcl: depInfo.etdCd ? etd : null,
    tentativeEtdCd: depInfo.etdCd ? depInfo.etdCd : null,
    atdLcl: movementInfo.depInfo.atdLcl,
    actToLcl: movementInfo.depInfo.actToLcl,
    depDlyInfo: movementInfo.depInfo.depDlyInfo,
    firstAtdLcl: movementInfo.depInfo.firstAtdLcl,
    returnInLcl: movementInfo.depInfo.returnInLcl,
    estReturnInLcl: movementInfo.depInfo.estReturnInLcl,
  };
}

/**
 * 画面用フォームデータを更新APIのリクエストのArrInfoに変換する
 */
function convertToPostMovementArrInfo({
  rowFormValues,
  movementInfo,
  currentDateWithTimeDiff,
}: {
  rowFormValues: RowFormValues;
  movementInfo: MovementInfo;
  currentDateWithTimeDiff: dayjs.Dayjs;
}): CommonFlightInfo.Request.ArrInfo {
  const { arrInfo } = rowFormValues;
  const etaLd = formatHHmmToDateTime(arrInfo.etaLd, currentDateWithTimeDiff);
  return {
    staLcl: movementInfo.arrInfo.staLcl,
    etaLcl: movementInfo.arrInfo.etaLcl,
    tentativeEtaLcl: movementInfo.arrInfo.tentativeEtaLcl,
    tentativeEtaCd: movementInfo.arrInfo.tentativeEtaCd,
    estBiLcl: movementInfo.arrInfo.estBiLcl,
    tentativeEstLdLcl: arrInfo.etaLdCd ? etaLd : null,
    tentativeEstLdCd: arrInfo.etaLdCd ? arrInfo.etaLdCd : null,
    estLdLcl: arrInfo.etaLdCd ? null : etaLd,
    actLdLcl: movementInfo.arrInfo.actLdLcl || "",
    ataLcl: movementInfo.arrInfo.ataLcl,
  };
}

/**
 * ドットで区切られた複数のStringのパスの情報からネストされたオブジェクトを生成する
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedProperties(paths: string[], value: unknown): Record<string, any> {
  return paths.reduce((result, path) => {
    const keys = path.split(".");
    let current = result;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        current[key] = current[key] || {};
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        current = current[key];
      }
    });

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any>);
}

export const updateMultipleFlightMovement = createAsyncThunk<
  void,
  { isDep: boolean; formValues: FormValues },
  { dispatch: AppDispatch; state: RootState }
>("multipleFlightMovement/updateMultipleFlightMovement", async (arg, thunkAPI) => {
  const { isDep, formValues } = arg;
  const { dispatch, getState } = thunkAPI;

  const { movementInfoList, rowStatusList, apoCd, timeDiffUtc } = isDep
    ? getState().multipleFlightMovementModals.modalDep
    : getState().multipleFlightMovementModals.modalArr;

  const currentDateWithTimeDiff = dayjs()
    .utc()
    .add(Math.floor(timeDiffUtc / 100), "hour")
    .add(timeDiffUtc % 100, "minute");

  dispatch(slice.actions.updateOalMultipleFlightMovement({ isDep }));

  let criticalErrorCaused = false;
  let errorCaused = false;
  const errorRows: Partial<RowFormValues>[] = [];
  const formName = isDep ? formNameDep : formNameArr;
  NotificationCreator.removeAll({ dispatch });

  try {
    for (let rowIndex = 0; rowIndex < formValues.rows.length; rowIndex++) {
      const rowFormValues = formValues.rows[rowIndex];
      const movementInfo = movementInfoList[rowIndex];
      const rowStatus = rowStatusList[rowIndex];
      const { isOal, arrOrgApoCd, depDstApoCd } = rowFormValues;
      errorRows.push({});
      if (rowStatus.status !== "Edited") continue;

      const depInfo = isDep ? convertToPostMovementDepInfo({ rowFormValues, movementInfo, currentDateWithTimeDiff }) : null;
      const arrInfo = !isDep ? convertToPostMovementArrInfo({ rowFormValues, movementInfo, currentDateWithTimeDiff }) : null;
      try {
        let newMovementInfo: MovementInfo | null = null;
        if (isOal) {
          // API呼び出し
          // eslint-disable-next-line no-await-in-loop
          const responseOal = await WebApi.postOalFlightMovement(
            dispatch,
            {
              funcId: "S10604C",
              oal2Legkey: movementInfo.legkey,
              fisFltSts: rowFormValues.fisFltSts || "",
              depInfo,
              arrInfo,
              dataOwnerCd: "SOALA",
            },
            undefined,
            false
          );
          const { oal2Legkey, ...responseArg } = responseOal.data;
          newMovementInfo = { ...responseArg, legkey: oal2Legkey };
        } else if (movementInfo.legkey) {
          // API呼び出し
          // eslint-disable-next-line no-await-in-loop
          const response = await WebApi.postFlightMovement(
            dispatch,
            {
              funcId: "S10604C",
              legkey: movementInfo.legkey,
              fisFltSts: rowFormValues.fisFltSts || "",
              depInfo,
              arrInfo,
              dataOwnerCd: "SOALA",
            },
            undefined,
            false
          );
          newMovementInfo = response.data;
        }
        if (newMovementInfo) {
          const newRowFormValues = convertToMovementInfoForm({
            index: rowIndex,
            isDep,
            apoCd,
            movementInfo: newMovementInfo,
            isOal,
            arrOrgApoCd,
            depDstApoCd,
          });
          dispatch(
            slice.actions.writeMultipleFlightMovementData({
              isDep,
              rowIndex,
              movementInfo: newMovementInfo,
              rowFormValues: newRowFormValues,
              rowStatus: { status: "Updated", updateValidationErrors: [] },
            })
          );
          dispatch(arraySplice(formName, "rows", rowIndex, 1, newRowFormValues)); // フォームデータに設定
        }
      } catch (err) {
        let updateValidationErrors: string[] = [];
        if (err instanceof ApiError && err.response) {
          // 409（コンフリクト）エラーの場合、エラーメッセージを表示する
          if (err.response.status === 409) {
            errorCaused = true;
            // メッセージを表示
            const title = getSoalaMessageTitle({ rowFormValues, movementInfo });
            NotificationCreator.create({ dispatch, message: SoalaMessage.M50031C({ title }) });
            dispatch(
              slice.actions.writeMultipleFlightMovementData({
                isDep,
                rowIndex,
                rowStatus: { status: "Failed", updateValidationErrors: [] },
              })
            );
            // 422（バリデーション）エラーの場合、エラーメッセージを表示する
          } else if (err.response.status === 422) {
            errorCaused = true;
            const data = (err.response.data as FlightMovementApi.Post.ErrorResponse) || null;
            if (data && data.errors) {
              const title = getSoalaMessageTitle({ rowFormValues, movementInfo });
              data.errors.forEach((error) => {
                updateValidationErrors = updateValidationErrors.concat(error.errorItems);
                // メッセージを表示
                error.errorMessages.forEach((errorText) => {
                  NotificationCreator.create({ dispatch, message: SoalaMessage.M50029C({ title, errorText }) });
                });
              });
              updateValidationErrors = uniq(updateValidationErrors);
              dispatch(
                slice.actions.writeMultipleFlightMovementData({ isDep, rowIndex, rowStatus: { status: "Error", updateValidationErrors } })
              );
              const fieledErrors = Object.entries(severErrorItems)
                .filter(([_key, values]) => values.some((value) => updateValidationErrors.includes(value)))
                .map(([key, _values]) => key);

              errorRows[rowIndex] = getNestedProperties(fieledErrors, "Error");
            }
          } else {
            criticalErrorCaused = true;
            break;
          }
        } else {
          criticalErrorCaused = true;
          console.error((err as Error).message);
          NotificationCreator.create({ dispatch, message: SoalaMessage.M50021C() });
          break;
        }
      }
    }
    if (!criticalErrorCaused) {
      if (errorCaused) {
        NotificationCreator.create({ dispatch, id: "multipleFlightError", message: SoalaMessage.M30012C({}) });
      } else {
        NotificationCreator.create({ dispatch, id: "multipleFlightSuccess", message: SoalaMessage.M30002C() });
      }
    }
    const errors = {
      rows: errorRows,
    };
    dispatch(stopSubmit(isDep ? formNameDep : formNameArr, errors));
  } catch (err) {
    console.error((err as Error).message);
    NotificationCreator.create({ dispatch, message: SoalaMessage.M50021C() });
  }
  dispatch(slice.actions.updateMultipleFlightMovementEnd({ isDep }));
});

// state
export interface LoadLeg {
  legKey: CommonFlightInfo.Legkey;
  isOal: boolean;
  arrOrgApoCd: string;
  depDstApoCd: string;
}

export interface MultipleFlightMovementModalsState {
  modalArr: MultipleFlightMovementModal;
  modalDep: MultipleFlightMovementModal;
}

export interface MultipleFlightMovementModal {
  focusedAt: Date | null;
  isOpen: boolean;
  isFetching: boolean;
  apoCd: string;
  timeDiffUtc: number;
  selectedLegKey: CommonFlightInfo.Legkey | null;
  movementInfoList: MovementInfo[];
  // formValues: FormValues;
  initialFormValues: FormValues;
  rowStatusList: RowStatus[];
}

export type MovementInfo = FlightMovementApi.Get.Response;

export interface FormValues {
  rows: RowFormValues[];
}

export interface RowStatus {
  status: Status;
  updateValidationErrors: string[];
}

export interface RowFormValues {
  rowNo: number;
  timeStamp: number; // 更新時に値が変わらなくても画面に反映させるため
  isOal: boolean;
  legCnlFlg: boolean;
  isDivAtbOrgApo: boolean;
  alCd: string;
  fltNo: string;
  casFltNo: string | null;
  orgDay: string;
  arrOrgApoCd: string;
  depDstApoCd: string;
  fisFltSts: FisStsType | undefined;
  depInfo: {
    std: string;
    etd: string;
    etdCd: string | undefined;
  };
  arrInfo: {
    sta: string;
    etaLd: string;
    etaLdCd: string | undefined;
  };
}

const modalInitialState: MultipleFlightMovementModal = {
  focusedAt: null,
  isOpen: false,
  isFetching: false,
  apoCd: "",
  timeDiffUtc: 0,
  selectedLegKey: null,
  movementInfoList: [],
  initialFormValues: {
    rows: [],
  },
  rowStatusList: [],
};

const initialState: MultipleFlightMovementModalsState = {
  modalArr: modalInitialState,
  modalDep: modalInitialState,
};

export const slice = createSlice({
  name: "multipleFlightMovementModals",
  initialState,
  reducers: {
    clearMultipleFlightMovement: (state) => {
      state.modalArr = modalInitialState;
      state.modalDep = modalInitialState;
    },
    clearData: (state, action: PayloadAction<{ isDep: boolean }>) => {
      const { isDep } = action.payload;
      if (isDep) {
        state.modalDep = modalInitialState;
      } else {
        state.modalArr = modalInitialState;
      }
    },
    close: (state, action: PayloadAction<{ isDep: boolean }>) => {
      const modal = action.payload.isDep ? state.modalDep : state.modalArr;
      modal.isOpen = false;
    },
    focusToMultipleFlightMovement: (state, action: PayloadAction<{ isDep: boolean }>) => {
      const modal = action.payload.isDep ? state.modalDep : state.modalArr;
      modal.focusedAt = new Date();
    },
    openMultipleFlightMovement: (
      state,
      action: PayloadAction<{ apoCd: string; timeDiffUtc: number; legKey: CommonFlightInfo.Legkey; isDep: boolean }>
    ) => {
      const { apoCd, timeDiffUtc, legKey, isDep } = action.payload;
      if (isDep && state.modalDep && state.modalDep.isOpen) return;
      if (!isDep && state.modalArr && state.modalArr.isOpen) return;

      const newModal: MultipleFlightMovementModal = {
        focusedAt: new Date(),
        isOpen: true,
        isFetching: false,
        apoCd,
        timeDiffUtc,
        selectedLegKey: legKey,
        movementInfoList: [],
        initialFormValues: { rows: [] },
        rowStatusList: [],
      };

      if (isDep) {
        state.modalDep = newModal;
      } else {
        state.modalArr = newModal;
      }
    },
    fetchMultipleFlightMovementStart: (
      state,
      action: PayloadAction<{
        isDep: boolean;
      }>
    ) => {
      const modal = action.payload.isDep ? state.modalDep : state.modalArr;
      modal.isOpen = true;
      modal.isFetching = true;
      modal.movementInfoList = [];
      modal.initialFormValues.rows = [];
      modal.rowStatusList = [];
    },
    fetchMultipleFlightMovementRow: (
      state,
      action: PayloadAction<{
        isDep: boolean;
        movementInfo: MovementInfo;
        rowFormValues: RowFormValues;
        rowStatus: RowStatus;
      }>
    ) => {
      const { movementInfo, rowFormValues, rowStatus } = action.payload;
      const modal = action.payload.isDep ? state.modalDep : state.modalArr;
      modal.movementInfoList.push(movementInfo);
      modal.initialFormValues.rows.push(rowFormValues);
      modal.rowStatusList.push(rowStatus);
    },
    fetchMultipleFlightMovementEnd: (state, action: PayloadAction<{ isDep: boolean }>) => {
      const modal = action.payload.isDep ? state.modalDep : state.modalArr;
      modal.isFetching = false;
    },
    updateOalMultipleFlightMovement: (state, action: PayloadAction<{ isDep: boolean }>) => {
      const modal = action.payload.isDep ? state.modalDep : state.modalArr;
      modal.rowStatusList.forEach((rowStatus) => {
        if (rowStatus.status === "Updated") {
          // eslint-disable-next-line no-param-reassign
          rowStatus.status = null;
        }
      });
    },
    updateMultipleFlightMovementEnd: (state, action: PayloadAction<{ isDep: boolean }>) => {
      const modal = action.payload.isDep ? state.modalDep : state.modalArr;
      modal.isFetching = false;
    },
    writeMultipleFlightMovementData: (
      state,
      action: PayloadAction<{
        isDep: boolean;
        rowIndex: number;
        movementInfo?: MovementInfo;
        rowFormValues?: RowFormValues;
        rowStatus?: RowStatus;
      }>
    ) => {
      const { rowIndex, movementInfo, rowFormValues, rowStatus } = action.payload;
      const modal = action.payload.isDep ? state.modalDep : state.modalArr;
      if (
        rowIndex < modal.movementInfoList.length &&
        rowIndex < modal.initialFormValues.rows.length &&
        rowIndex < modal.rowStatusList.length
      ) {
        if (movementInfo) modal.movementInfoList[rowIndex] = movementInfo;
        if (rowFormValues) modal.initialFormValues.rows[rowIndex] = rowFormValues;
        if (rowStatus) modal.rowStatusList[rowIndex] = rowStatus;
      }
    },
  },
});

export const { clearMultipleFlightMovement, openMultipleFlightMovement, focusToMultipleFlightMovement } = slice.actions;

export default slice.reducer;
