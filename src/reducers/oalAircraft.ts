import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { AppDispatch, RootState } from "../store/storeType";
import { Status } from "../components/atoms/UpdateStatusLabel";
import { formatFltNo, isObjectEmpty, getXtaLcl, getXtdLcl } from "../lib/commonUtil";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { WebApi, ApiError } from "../lib/webApi";

/**
 * FISの表示範囲を考慮してARR、DEPの情報を取り出す
 */
export function getArrDepInfoWithVeiwRange({
  legArrDepCtrlApiResponse,
  dispRangeFromLcl,
  dispRangeToLcl,
}: {
  legArrDepCtrlApiResponse: LegArrDepCtrlApi.Response;
  dispRangeFromLcl: string;
  dispRangeToLcl: string;
}): { arr: LegArrDepCtrlApi.Arr | null; dep: LegArrDepCtrlApi.Dep | null } {
  let isArrEmpty = isObjectEmpty(legArrDepCtrlApiResponse.arr); // オブジェクトの空を検出する
  let isDepEmpty = isObjectEmpty(legArrDepCtrlApiResponse.dep); // オブジェクトの空を検出する

  // 親画面の表示範囲外の場合、データを非表示にする。
  if (!isArrEmpty && legArrDepCtrlApiResponse.arr) {
    const { ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl } = legArrDepCtrlApiResponse.arr;
    const orgXtaLcl = getXtaLcl({ ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl });
    if (!(orgXtaLcl >= dispRangeFromLcl && orgXtaLcl <= dispRangeToLcl)) {
      isArrEmpty = true;
    }
  }
  if (!isDepEmpty && legArrDepCtrlApiResponse.dep) {
    const { atdLcl, tentativeEtdLcl, etdLcl, stdLcl } = legArrDepCtrlApiResponse.dep;
    const orgXtdLcl = getXtdLcl({ atdLcl, tentativeEtdLcl, etdLcl, stdLcl });
    if (!(orgXtdLcl >= dispRangeFromLcl && orgXtdLcl <= dispRangeToLcl)) {
      isDepEmpty = true;
    }
  }
  const arr = isArrEmpty ? null : legArrDepCtrlApiResponse.arr;
  const dep = isDepEmpty ? null : legArrDepCtrlApiResponse.dep;
  return { arr, dep };
}

export const openOalAircraftModal = createAsyncThunk<
  void,
  { seq: number; dispRangeFromLcl: string; dispRangeToLcl: string },
  { dispatch: AppDispatch; state: RootState }
>("oalAircraft/openOalAircraftModal", async (arg, thunkAPI) => {
  const { seq, dispRangeFromLcl, dispRangeToLcl } = arg;
  const { dispatch } = thunkAPI;

  dispatch(slice.actions.fetch({ seq }));
  try {
    const param: LegArrDepCtrlApi.Request = { seq };
    const callbacks: WebApi.Callbacks = {
      onNotFoundRecord: () => dispatch(closeOalAircraftModal()),
      onConflict: () => dispatch(closeOalAircraftModal()),
    };
    const response = await WebApi.getLegArrDepCtrl(dispatch, param, callbacks);

    const legArrDepCtrlApiResponse = response.data;
    const { arr, dep } = getArrDepInfoWithVeiwRange({ legArrDepCtrlApiResponse, dispRangeFromLcl, dispRangeToLcl });
    if (!arr && !dep) {
      dispatch(slice.actions.fetchFailure());
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40020C({ onOkButton: () => dispatch(closeOalAircraftModal()) }) });
      return;
    }
    dispatch(slice.actions.fetchSuccess({ arr, dep }));
  } catch (error) {
    const statusCode = error instanceof ApiError && error.response ? error.response.status : null;
    dispatch(slice.actions.fetchFailure());
    if (statusCode !== 404 && statusCode !== 409) {
      // 404, 409は、メッセージのボタンで閉じるため対象外
      dispatch(closeOalAircraftModal());
    }
  }
});

function getUpdateParams({
  legInfo,
  formitems,
}: {
  legInfo: LegArrDepCtrlApi.ArrDep;
  formitems: FormItems;
}): OalFlightMovementApi.Post.RequestOalAircraft {
  const oal2Legkey: CommonFlightInfo.Legkey = {
    orgDateLcl: legInfo.orgDateLcl,
    alCd: legInfo.alCd,
    fltNo: legInfo.fltNo,
    casFltNo: legInfo.casFltNo,
    skdDepApoCd: legInfo.skdDepApoCd,
    skdArrApoCd: legInfo.skdArrApoCd,
    skdLegSno: legInfo.skdLegSno,
  };

  return {
    funcId: "S11303C",
    oal2Legkey,
    shipNo: formitems.shipNo.trim(),
    shipTypeIataCd: formitems.eqp.trim(),
    depInfo: null,
    arrInfo: null,
    dataOwnerCd: "SOALA",
  };
}

export function getSoalaMessageTitle(legInfo: LegArrDepCtrlApi.ArrDep) {
  return `${legInfo.casFltNo ? legInfo.casFltNo : `${legInfo.alCd}${formatFltNo(legInfo.fltNo)}`}/${dayjs(legInfo.orgDateLcl)
    .format("DDMMM")
    .toUpperCase()} ${legInfo.lstDepApoCd}-${legInfo.lstArrApoCd}`;
}

export const updateOalAircraft = createAsyncThunk<void, FormValues, { dispatch: AppDispatch; state: RootState }>(
  "oalAircraft/updateOalAircraft",
  async (arg, thunkAPI) => {
    const formValue = arg;
    const { dispatch, getState } = thunkAPI;
    const { arr, dep, initialFormValues, targetSelect } = getState().oalAircraft;
    const callbacks: WebApi.Callbacks = {
      onNotFoundRecord: () => dispatch(closeOalAircraftModal()),
    };
    dispatch(slice.actions.resetStatusLabel());
    let hasConflict = false;
    let isDepSucceeded = dep.updateSucceeded;
    let isArrSucceeded = arr.updateSucceeded;
    const depFormitems = formValue.dep;
    const arrFormitems = targetSelect === "ARR_DEP_SAME" ? formValue.dep : formValue.arr;
    const isDepDirty = JSON.stringify(formValue.dep) !== JSON.stringify(initialFormValues.dep);
    const isArrDirty =
      targetSelect === "ARR_DEP_SAME" ? isDepDirty : JSON.stringify(formValue.arr) !== JSON.stringify(initialFormValues.arr);
    // Arrの更新処理
    if (isArrDirty && arr.legInfo && !arr.updateSucceeded) {
      dispatch(slice.actions.updateArr());
      try {
        const requestParams = getUpdateParams({ legInfo: arr.legInfo, formitems: arrFormitems });
        const response = await WebApi.postOalFlightMovementEqp(dispatch, requestParams, callbacks, false);
        dispatch(slice.actions.updateSuccessArr({ data: response.data, formValue }));
        if (response.data.skippedFlg) {
          NotificationCreator.create({ dispatch, message: SoalaMessage.M30013C({ title: getSoalaMessageTitle(arr.legInfo) }) });
        }
        isArrSucceeded = true;
      } catch (error) {
        const statusCode = error instanceof ApiError && error.response ? error.response.status : null;
        dispatch(slice.actions.updateFailureArr({ statusCode }));
        if (statusCode === 409) {
          hasConflict = true;
          NotificationCreator.create({ dispatch, message: SoalaMessage.M50031C({ title: getSoalaMessageTitle(arr.legInfo) }) });
        } else {
          return;
        }
      }
    } else {
      isArrSucceeded = true;
    }
    // Depの更新処理（ArrDep同値変更の場合はArrの入力値を使用）
    if (isDepDirty && dep.legInfo && !dep.updateSucceeded) {
      dispatch(slice.actions.updateDep());
      try {
        const requestParams = getUpdateParams({ legInfo: dep.legInfo, formitems: depFormitems });
        const response = await WebApi.postOalFlightMovementEqp(dispatch, requestParams, callbacks, false);
        dispatch(slice.actions.updateSuccessDep({ data: response.data, formValue }));
        if (response.data.skippedFlg) {
          NotificationCreator.create({ dispatch, message: SoalaMessage.M30013C({ title: getSoalaMessageTitle(dep.legInfo) }) });
        }
        isDepSucceeded = true;
      } catch (error) {
        const statusCode = error instanceof ApiError && error.response ? error.response.status : null;
        dispatch(updateFailureDep({ statusCode }));
        if (statusCode === 409) {
          hasConflict = true;
          NotificationCreator.create({ dispatch, message: SoalaMessage.M50031C({ title: getSoalaMessageTitle(dep.legInfo) }) });
        } else {
          return;
        }
      }
    } else {
      isDepSucceeded = true;
    }

    if (isArrSucceeded && isDepSucceeded) {
      if (targetSelect === "ARR_DEP_SAME") {
        dispatch(slice.actions.updateSuccessAll(formValue));
      }
      NotificationCreator.create({ dispatch, message: SoalaMessage.M30002C() });
    } else if (hasConflict) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M30012C({ onOkButton: () => {} }) });
    }
  }
);

export interface OalAircraftState {
  isOpen: boolean;
  seq: number | null;
  targetSelect: Target;
  arr: {
    legInfo: LegArrDepCtrlApi.ArrDep | null;
    statusValue: Status;
    updateSucceeded: boolean;
    hasError: boolean;
  };
  dep: {
    legInfo: LegArrDepCtrlApi.ArrDep | null;
    statusValue: Status;
    updateSucceeded: boolean;
    hasError: boolean;
  };
  fetching: boolean;
  initialFormValues: FormValues;
}

export type Target = "ARR_DEP_SAME" | "ARR" | "DEP" | "ARR_DEP_DIFF" | null;

export interface FormValues {
  arr: FormItems;
  dep: FormItems;
}

interface FormItems {
  shipNo: string;
  eqp: string;
}

const initialState: OalAircraftState = {
  isOpen: false,
  seq: null,
  targetSelect: null,
  arr: {
    legInfo: null,
    statusValue: null,
    updateSucceeded: false,
    hasError: false,
  },
  dep: {
    legInfo: null,
    statusValue: null,
    updateSucceeded: false,
    hasError: false,
  },
  fetching: false,
  initialFormValues: {
    arr: {
      shipNo: "",
      eqp: "",
    },
    dep: {
      shipNo: "",
      eqp: "",
    },
  },
};

export const slice = createSlice({
  name: "oalAircraft",
  initialState,
  reducers: {
    closeOalAircraftModal: (state) => {
      Object.assign(state, initialState);
    },
    targetSelected: (state, action: PayloadAction<{ target: Target }>) => {
      state.targetSelect = action.payload.target;
    },
    fetch: (_state, action: PayloadAction<{ seq: number }>) => ({
      ...initialState,
      isOpen: true,
      seq: action.payload.seq,
      fetching: true,
    }),
    fetchSuccess: (state, action: PayloadAction<{ arr: LegArrDepCtrlApi.Arr | null; dep: LegArrDepCtrlApi.Dep | null }>) => {
      const { arr, dep } = action.payload;
      state.fetching = false;
      state.targetSelect = arr && !dep ? "ARR" : !arr && dep ? "DEP" : null;
      state.arr = {
        ...initialState.arr,
        legInfo: arr,
      };
      state.dep = {
        ...initialState.dep,
        legInfo: dep,
      };
      state.initialFormValues = {
        arr: {
          shipNo: arr && arr.shipNo ? arr.shipNo : "",
          eqp: arr ? arr.shipTypeIataCd : "",
        },
        dep: {
          shipNo: dep && dep.shipNo ? dep.shipNo : "",
          eqp: dep ? dep.shipTypeIataCd : "",
        },
      };
    },
    fetchFailure: (state) => {
      state.fetching = false;
    },
    updateArr: (state) => {
      state.arr = {
        ...state.arr,
        statusValue: null,
        updateSucceeded: false,
        hasError: false,
      };
    },
    updateDep: (state) => {
      state.dep = {
        ...state.dep,
        statusValue: null,
        updateSucceeded: false,
        hasError: false,
      };
    },
    updateSuccessArr: (state, action: PayloadAction<{ data: OalFlightMovementApi.Post.Response; formValue: FormValues }>) => {
      // ArrDep同値変更の場合は、initialFormValueを変更しない。（dirtyのまま）
      const initialFormValues =
        state.targetSelect === "ARR_DEP_SAME"
          ? state.initialFormValues
          : {
              ...action.payload.formValue, // 参照を変えるためここでも展開
              arr: action.payload.formValue.arr,
              dep: state.initialFormValues.dep,
            };

      state.arr = {
        ...state.arr,
        statusValue: action.payload.data.skippedFlg ? "Skipped" : "Updated",
        updateSucceeded: true,
        hasError: false,
      };
      state.initialFormValues = initialFormValues;
    },
    updateSuccessDep: (state, action: PayloadAction<{ data: OalFlightMovementApi.Post.Response; formValue: FormValues }>) => {
      // ArrDep同値変更の場合は、initialFormValueを変更しない。（dirtyのまま）
      const initialFormValues =
        state.targetSelect === "ARR_DEP_SAME"
          ? state.initialFormValues
          : {
              ...action.payload.formValue, // 参照を変えるためここでも展開
              arr: state.initialFormValues.arr,
              dep: action.payload.formValue.dep,
            };
      state.dep = {
        ...state.dep,
        statusValue: action.payload.data.skippedFlg ? "Skipped" : "Updated",
        updateSucceeded: true,
        hasError: false,
      };
      state.initialFormValues = initialFormValues;
    },
    updateSuccessAll: (state, action: PayloadAction<FormValues>) => {
      state.initialFormValues = {
        ...action.payload,
      };
    },
    updateFailureArr: (state, action: PayloadAction<{ statusCode: number | null }>) => {
      state.arr = {
        ...state.arr,
        statusValue: action.payload.statusCode === 409 ? "Failed" : state.arr.statusValue,
        hasError: true,
      };
    },
    updateFailureDep: (state, action: PayloadAction<{ statusCode: number | null }>) => {
      state.dep = {
        ...state.dep,
        statusValue: action.payload.statusCode === 409 ? "Failed" : state.dep.statusValue,
        hasError: true,
      };
    },
    resetStatusLabel: (state) => {
      state.arr = {
        ...state.arr,
        statusValue: state.arr.statusValue === "Updated" || state.arr.statusValue === "Skipped" ? state.arr.statusValue : null,
      };
      state.dep = {
        ...state.dep,
        statusValue: state.dep.statusValue === "Updated" || state.dep.statusValue === "Skipped" ? state.dep.statusValue : null,
      };
    },
  },
});

export const { closeOalAircraftModal, targetSelected, updateFailureDep } = slice.actions;

export default slice.reducer;
