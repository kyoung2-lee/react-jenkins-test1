import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import uniq from "lodash.uniq";
import { AppDispatch, RootState } from "../store/storeType";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { WebApi, ApiError } from "../lib/webApi";
import { convertTimeToHhmm } from "../lib/commonUtil";

export const openFlightMovementModal = createAsyncThunk<
  void,
  { legKey: CommonFlightInfo.Legkey; isDep: boolean },
  { dispatch: AppDispatch; state: RootState }
>("flightMovementModal/openFlightMovmentModal", async (arg, thunkAPI) => {
  const { legKey, isDep } = arg;
  const { dispatch, getState } = thunkAPI;
  const { eLegList } = getState().flightSearch;
  const { fisRows } = getState().fis;
  const { fisState } = getState().mySchedule;

  let isOal = false;
  if (eLegList.length > 0) {
    isOal = eLegList.find((el) => el.alCd === legKey.alCd && el.fltNo === legKey.fltNo)?.oalTblFlg ?? isOal;
  } else if (fisRows.size > 0) {
    isOal =
      (isDep
        ? fisRows.find((fis) => fis.dep?.alCd === legKey.alCd && fis.dep.fltNo === legKey.fltNo)?.dep?.isOal
        : fisRows.find((fis) => fis.arr?.alCd === legKey.alCd && fis.arr.fltNo === legKey.fltNo)?.arr?.isOal) ?? isOal;
  } else if (fisState?.fisRow) {
    isOal = (isDep ? fisState.fisRow.dep?.isOal : fisState.fisRow.arr?.isOal) ?? isOal;
  }
  const onlineDbExpDays = isOal ? getState().account.master.oalOnlineDbExpDays : getState().account.master.onlineDbExpDays;
  const params: LegKey = { ...legKey, funcId: "S10601C", onlineDbExpDays };

  dispatch(slice.actions.fetchFlightMovement({ isDep }));
  try {
    // 便リマークスは、便詳細APIで取得している
    let movementInfo: MovementInfo;
    if (isOal) {
      // eslint-disable-next-line no-await-in-loop
      const responseOal = await WebApi.getOalFlightMovement(dispatch, params);
      const { oal2Legkey, ...responseArg } = responseOal.data;
      movementInfo = { ...responseArg, legkey: oal2Legkey };
    } else {
      // eslint-disable-next-line no-await-in-loop
      const response = await WebApi.getFlightMovement(dispatch, params);
      movementInfo = response.data;
    }
    const formValue = convertToMovementInfoForm(movementInfo);
    dispatch(fetchFlightMovementSuccess({ movementInfo, formValue, isDep, isOal }));
  } catch (err) {
    dispatch(fetchFlightMovementFailure());
  }
});

/**
 * 取得APIのレスポンスデータを画面用フォームデータに変換する
 */
function convertToMovementInfoForm(movementInfo: MovementInfo): FormValue {
  return {
    fisFltSts: movementInfo.fisFltSts,
    irrSts: movementInfo.irrSts,
    depInfo: {
      std: movementInfo.depInfo.stdLcl,
      etd: (movementInfo.depInfo.tentativeEtdCd ? movementInfo.depInfo.tentativeEtdLcl : movementInfo.depInfo.etdLcl) || "",
      etdCd: movementInfo.depInfo.tentativeEtdCd || "",
      atd: movementInfo.depInfo.atdLcl,
      depDlyRsnCd1: movementInfo.depInfo.depDlyInfo?.[0]?.depDlyTimeRsnCd ?? "",
      depDlyRsnCd2: movementInfo.depInfo.depDlyInfo?.[1]?.depDlyTimeRsnCd ?? "",
      depDlyRsnCd3: movementInfo.depInfo.depDlyInfo?.[2]?.depDlyTimeRsnCd ?? "",
      // depDlyRsnCd4: movementInfo.depInfo.depDlyInfo?.[3]?.depDlyTimeRsnCd ?? "",
      depDlyTime1: convertTimeToHhmm(movementInfo.depInfo.depDlyInfo?.[0]?.depDlyTime),
      depDlyTime2: convertTimeToHhmm(movementInfo.depInfo.depDlyInfo?.[1]?.depDlyTime),
      depDlyTime3: convertTimeToHhmm(movementInfo.depInfo.depDlyInfo?.[2]?.depDlyTime),
      // depDlyTime4: convertTimeToHhmm(movementInfo.depInfo.depDlyInfo?.[3]?.depDlyTime),
      toTime: movementInfo.depInfo.actToLcl,
      estimateReturnIn: movementInfo.depInfo.estReturnInLcl,
      returnIn: movementInfo.depInfo.returnInLcl,
      firstBo: movementInfo.depInfo.firstAtdLcl,
      depApoSpotNo: movementInfo.depInfo.depApoSpotNo,
    },
    arrInfo: {
      sta: movementInfo.arrInfo.staLcl,
      eta: (movementInfo.arrInfo.tentativeEtaCd ? movementInfo.arrInfo.tentativeEtaLcl : movementInfo.arrInfo.etaLcl) || "",
      etaCd: movementInfo.arrInfo.tentativeEtaCd || "",
      etaLd: (movementInfo.arrInfo.tentativeEstLdCd ? movementInfo.arrInfo.tentativeEstLdLcl : movementInfo.arrInfo.estLdLcl) || "",
      etaLdCd: movementInfo.arrInfo.tentativeEstLdCd || "",
      etaLdTaxing: movementInfo.arrInfo.estBiLcl,
      ldTime: movementInfo.arrInfo.actLdLcl || "",
      ata: movementInfo.arrInfo.ataLcl,
      arrApoSpotNo: movementInfo.arrInfo.arrApoSpotNo,
      orgArrApoCd: movementInfo.irrSts === "DIV" ? movementInfo.arrInfo.lstArrApoCd : "",
      orgEtaLd: movementInfo.irrSts === "DIV" ? movementInfo.arrInfo.estLdLcl || "" : "",
    },
    selectedIrrSts: "",
    irrInfo: {
      estLd: "",
      lstArrApoCd: "",
    },
  };
}

/**
 * 画面用フォームデータを更新APIのリクエストのDepInfoに変換する
 */
function convertToPostMovementDepInfo(formValue: FormValue): CommonFlightInfo.Request.DepInfo {
  const { depInfo } = formValue;
  const depDlyInfo: CommonFlightInfo.DepDlyInfo[] = [];
  if (!depInfo.std || (depInfo.std && depInfo.atd && depInfo.std < depInfo.atd)) {
    if (!Number.isNaN(Number(depInfo.depDlyTime1)) && depInfo.depDlyRsnCd1) {
      depDlyInfo.push({
        depDlyTime: Number(depInfo.depDlyTime1),
        depDlyTimeRsnCd: depInfo.depDlyRsnCd1,
      });
    }
    if (!Number.isNaN(Number(depInfo.depDlyTime2)) && depInfo.depDlyRsnCd2) {
      depDlyInfo.push({
        depDlyTime: Number(depInfo.depDlyTime2),
        depDlyTimeRsnCd: depInfo.depDlyRsnCd2,
      });
    }
    if (!Number.isNaN(Number(depInfo.depDlyTime3)) && depInfo.depDlyRsnCd3) {
      depDlyInfo.push({
        depDlyTime: Number(depInfo.depDlyTime3),
        depDlyTimeRsnCd: depInfo.depDlyRsnCd3,
      });
    }
    // if (!Number.isNaN(Number(depInfo.depDlyTime4)) && depInfo.depDlyRsnCd4) {
    //   depDlyInfo.push({
    //     depDlyTime: Number(depInfo.depDlyTime4),
    //     depDlyTimeRsnCd: depInfo.depDlyRsnCd4,
    //   });
    // }
  }
  depDlyInfo.sort((a, b) => {
    if (a.depDlyTime !== b.depDlyTime) {
      return b.depDlyTime - a.depDlyTime;
    }
    return a.depDlyTimeRsnCd.localeCompare(b.depDlyTimeRsnCd);
  });

  return {
    stdLcl: depInfo.std,
    etdLcl: depInfo.etdCd ? null : depInfo.etd,
    tentativeEtdLcl: depInfo.etdCd ? depInfo.etd : null,
    tentativeEtdCd: depInfo.etdCd ? depInfo.etdCd : null,
    atdLcl: depInfo.atd,
    actToLcl: depInfo.toTime,
    depDlyInfo,
    firstAtdLcl: depInfo.firstBo,
    returnInLcl: depInfo.returnIn,
    estReturnInLcl: depInfo.estimateReturnIn,
  };
}

/**
 * 画面用フォームデータを更新APIのリクエストのArrInfoに変換する
 */
function convertToPostMovementArrInfo(formValue: FormValue, isAtbOrDiv: boolean): CommonFlightInfo.Request.ArrInfo {
  const { arrInfo } = formValue;
  const partialArrInfo = {
    staLcl: arrInfo.sta,
    estBiLcl: arrInfo.etaLdTaxing,
    tentativeEstLdLcl: arrInfo.etaLdCd ? arrInfo.etaLd : null,
    tentativeEstLdCd: arrInfo.etaLdCd ? arrInfo.etaLdCd : null,
    estLdLcl: arrInfo.etaLdCd ? null : arrInfo.etaLd,
    actLdLcl: arrInfo.ldTime,
    ataLcl: arrInfo.ata,
  };
  const fullArrInfo = {
    ...partialArrInfo,
    etaLcl: arrInfo.etaCd ? null : arrInfo.eta,
    tentativeEtaLcl: arrInfo.etaCd ? arrInfo.eta : null,
    tentativeEtaCd: arrInfo.etaCd ? arrInfo.etaCd : null,
  };
  // API側の都合上、ATB・DIVの場合には、etaLcl・tentativeEtaLcl・tentativeEtaCdを受け渡さないようにする（#15798）
  return isAtbOrDiv ? partialArrInfo : fullArrInfo;
}

/**
 * 画面用フォームデータをイレギュラー情報更新APIのリクエストのirrStsに変換する
 */
function convertToPostIrregularIrrSts(formValue: FormValue): IrrStsType {
  if (formValue.selectedIrrSts === "DIV" || formValue.selectedIrrSts === "DIV COR") {
    return "DIV";
  }
  if (formValue.selectedIrrSts === "ATB" || formValue.selectedIrrSts === "GTB") {
    return formValue.selectedIrrSts;
  }

  return null;
}

export const showMessage = createAsyncThunk<void, { message: NotificationCreator.Message }, { dispatch: AppDispatch }>(
  "flightMovementModal/showMessage",
  (arg, thunkAPI) => {
    const { message } = arg;
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message });
  }
);

/**
 * 他社便動態情報を更新する
 */
export const updateFlightMovement = createAsyncThunk<
  void,
  { formValue: FormValue; callbacks?: WebApi.Callbacks },
  { dispatch: AppDispatch; state: RootState }
>("flightMovementModal/updateFlightMovement", async (arg, thunkAPI) => {
  const { formValue, callbacks } = arg;
  const { dispatch, getState } = thunkAPI;
  const { isDep, isOal, movementInfo } = getState().flightMovementModal;
  const isAtbOrDiv = movementInfo?.irrSts === "ATB" || movementInfo?.irrSts === "DIV";
  dispatch(slice.actions.updateOalFlightMovement());
  NotificationCreator.removeAll({ dispatch });
  if (!movementInfo) {
    dispatch(updateFlightMovementFailure({ updateValidationErrors: [] }));
    return;
  }
  try {
    const depInfo = isDep ? convertToPostMovementDepInfo(formValue) : null;
    const arrInfo = !isDep ? convertToPostMovementArrInfo(formValue, isAtbOrDiv) : null;

    if (isOal) {
      // API呼び出し
      await WebApi.postOalFlightMovement(
        dispatch,
        {
          funcId: "S10601P1",
          oal2Legkey: movementInfo.legkey,
          fisFltSts: formValue.fisFltSts || "",
          depInfo,
          arrInfo,
          dataOwnerCd: "SOALA",
        },
        callbacks
      );
    } else {
      // API呼び出し
      await WebApi.postFlightMovement(
        dispatch,
        {
          funcId: "S10601P1",
          legkey: movementInfo.legkey,
          fisFltSts: formValue.fisFltSts || "",
          depInfo,
          arrInfo,
          dataOwnerCd: "SOALA",
        },
        callbacks
      );
    }
    dispatch(updateFlightMovementSuccess());
  } catch (err) {
    let updateValidationErrors: string[] = [];
    if (err instanceof ApiError && err.response) {
      // 409（コンフリクト）エラーの場合、エラーメッセージを表示する
      if (err.response.status === 409) {
        NotificationCreator.create({ dispatch, message: SoalaMessage.M50031C({}) });
        // 422（バリデーション）エラーの場合、エラーメッセージを表示する
      } else if (err.response.status === 422) {
        const data = (err.response.data as FlightMovementApi.Post.ErrorResponse) || null;
        if (data && data.errors) {
          data.errors.forEach((error) => {
            updateValidationErrors = updateValidationErrors.concat(error.errorItems);
            // メッセージを表示
            error.errorMessages.forEach((errorText) => {
              NotificationCreator.create({ dispatch, message: SoalaMessage.M50029C({ title: "", errorText }) });
            });
          });
          updateValidationErrors = uniq(updateValidationErrors);
        }
      }
    }
    dispatch(updateFlightMovementFailure({ updateValidationErrors }));
  }
});

export const updateFlightIrregular = createAsyncThunk<
  void,
  { formValue: FormValue; callbacks?: WebApi.Callbacks },
  { dispatch: AppDispatch; state: RootState }
>("flightMovementModal/updateFlightIrregular", async (arg, thunkAPI) => {
  const { formValue, callbacks } = arg;
  const { dispatch, getState } = thunkAPI;
  const { movementInfo, isOal } = getState().flightMovementModal;
  dispatch(slice.actions.updateOalFlightMovement());
  NotificationCreator.removeAll({ dispatch });
  if (!movementInfo) {
    dispatch(updateFlightMovementFailure({ updateValidationErrors: [] }));
    return;
  }
  try {
    if (isOal) {
      await WebApi.postOalFlightIrregularUpdate(
        dispatch,
        {
          funcId: "S10602C",
          oal2Legkey: movementInfo.legkey,
          irrSts: convertToPostIrregularIrrSts(formValue),
          arrInfo: {
            estLdLcl: formValue.irrInfo.estLd || null,
            lstArrApoCd: formValue.irrInfo.lstArrApoCd || null,
          },
          dataOwnerCd: "SOALA",
        },
        callbacks
      );

      dispatch(updateFlightMovementSuccess());
    }
  } catch (err) {
    let updateValidationErrors: string[] = [];
    if (err instanceof ApiError && err.response) {
      // 409（コンフリクト）エラーの場合、エラーメッセージを表示する
      if (err.response.status === 409) {
        NotificationCreator.create({ dispatch, message: SoalaMessage.M50031C({}) });
        // 422（バリデーション）エラーの場合、エラーメッセージを表示する
      } else if (err.response.status === 422) {
        const data = (err.response.data as OalFlightIrregularUpdateApi.Post.ErrorResponse) || null;
        if (data && data.errors) {
          data.errors.forEach((error) => {
            updateValidationErrors = updateValidationErrors.concat(error.errorItems);
            // メッセージを表示
            error.errorMessages.forEach((errorText) => {
              NotificationCreator.create({ dispatch, message: SoalaMessage.M50029C({ title: "", errorText }) });
            });
          });
          updateValidationErrors = uniq(updateValidationErrors);
        }
      }
    }
    dispatch(updateFlightMovementFailure({ updateValidationErrors }));
  }
});

// state
export interface FlightMovementModalState {
  isOpen: boolean;
  isFetching: boolean;
  movementInfo: MovementInfo | undefined;
  initialFormValue: FormValue;
  isDep: boolean | undefined;
  updateValidationErrors: string[];
  isOal: boolean | undefined;
}

export type LegKey = OalFlightMovementApi.Get.Request;
export type MovementInfo = FlightMovementApi.Get.Response;
export type SelectedIrrStsType = "GTB" | "GTB CNL" | "ATB" | "DIV" | "DIV CNL" | "DIV COR" | "ATB CNL" | "" | null;

export interface FormValue {
  fisFltSts: FisStsType;
  irrSts: IrrStsType;
  depInfo: {
    std: string;
    etd: string;
    etdCd: string;
    atd: string;
    depDlyTime1: string;
    depDlyTime2: string;
    depDlyTime3: string;
    // depDlyTime4: string;
    depDlyRsnCd1: string;
    depDlyRsnCd2: string;
    depDlyRsnCd3: string;
    // depDlyRsnCd4: string;
    toTime: string;
    estimateReturnIn: string;
    returnIn: string;
    firstBo: string;
    depApoSpotNo: string;
  };
  arrInfo: {
    sta: string;
    eta: string;
    etaCd: string;
    etaLd: string;
    etaLdCd: string;
    etaLdTaxing: string;
    ldTime: string;
    ata: string;
    arrApoSpotNo: string;
    orgArrApoCd: string;
    orgEtaLd: string;
  };
  selectedIrrSts: SelectedIrrStsType;
  irrInfo: {
    estLd: string;
    lstArrApoCd: string;
  };
}

const initialState: FlightMovementModalState = {
  isOpen: false,
  isFetching: false,
  movementInfo: undefined,
  initialFormValue: {
    fisFltSts: "",
    irrSts: "",
    depInfo: {
      std: "",
      etd: "",
      etdCd: "",
      atd: "",
      depDlyTime1: "",
      depDlyTime2: "",
      depDlyTime3: "",
      // depDlyTime4: "",
      depDlyRsnCd1: "",
      depDlyRsnCd2: "",
      depDlyRsnCd3: "",
      // depDlyRsnCd4: "",
      toTime: "",
      estimateReturnIn: "",
      returnIn: "",
      firstBo: "",
      depApoSpotNo: "",
    },
    arrInfo: {
      sta: "",
      eta: "",
      etaCd: "",
      etaLd: "",
      etaLdCd: "",
      etaLdTaxing: "",
      ldTime: "",
      ata: "",
      arrApoSpotNo: "",
      orgArrApoCd: "",
      orgEtaLd: "",
    },
    selectedIrrSts: "",
    irrInfo: {
      estLd: "",
      lstArrApoCd: "",
    },
  },
  isDep: undefined,
  updateValidationErrors: [],
  isOal: undefined,
};

export const slice = createSlice({
  name: "flightMovementModal",
  initialState,
  reducers: {
    closeFlightMovementModal: (state) => {
      Object.assign(state, initialState);
    },
    fetchFlightMovement: (state, action: PayloadAction<{ isDep: boolean }>) => {
      const { isDep } = action.payload;
      state.isOpen = true;
      state.isFetching = true;
      state.isDep = isDep;
    },
    fetchFlightMovementSuccess: (
      state,
      action: PayloadAction<{
        movementInfo: MovementInfo;
        formValue: FormValue;
        isDep: boolean;
        isOal: boolean;
      }>
    ) => {
      const { movementInfo, formValue, isDep, isOal } = action.payload;

      state.isOpen = true;
      state.isFetching = false;
      state.movementInfo = movementInfo;
      state.initialFormValue = formValue;
      state.isDep = isDep;
      state.updateValidationErrors = [];
      state.isOal = isOal;
    },
    fetchFlightMovementFailure: (state) => {
      Object.assign(state, initialState);
    },
    updateOalFlightMovement: (state) => {
      state.isFetching = true;
    },
    updateFlightMovementSuccess: (state) => {
      Object.assign(state, initialState);
    },
    updateFlightMovementFailure: (state, action: PayloadAction<{ updateValidationErrors: string[] }>) => {
      const { updateValidationErrors } = action.payload;
      state.isFetching = false;
      state.updateValidationErrors = updateValidationErrors;
    },
  },
});

export const {
  closeFlightMovementModal,
  fetchFlightMovementSuccess,
  fetchFlightMovementFailure,
  updateFlightMovementSuccess,
  updateFlightMovementFailure,
} = slice.actions;

export default slice.reducer;
