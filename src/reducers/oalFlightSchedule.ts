import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import cloneDeep from "lodash.clonedeep";
import map from "lodash.map";
import maxBy from "lodash.maxby";
import minBy from "lodash.minby";
import uniq from "lodash.uniq";
import { AppDispatch, RootState } from "../store/storeType";
import { WebApi, ApiError } from "../lib/webApi";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { convertDDHHmmToDate } from "../lib/commonUtil";
// eslint-disable-next-line import/no-cycle
import { getHeaderInfo } from "./common";
// eslint-disable-next-line import/no-cycle
import { getFltInfo } from "../components/molecules/OalFlightSchedule/OalFlightScheduleType";
import RowStatus = OalFlightScheduleApi.Get.RowStatus;
import FltScheduleListBase = OalFlightScheduleApi.Get.FltScheduleListBase;
import LegList = OalFlightScheduleApi.Get.LegList;

export const showMessage = createAsyncThunk<void, { message: NotificationCreator.Message }, { dispatch: AppDispatch }>(
  "oalFlightSchedule/showMessage",
  (arg, thunkAPI) => {
    const { message } = arg;
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message });
  }
);

export function getInitialFormState({
  fltIndex,
  legIndex,
  rowStatus,
  chgType,
}: {
  fltIndex: number;
  legIndex: number;
  rowStatus?: RowStatus;
  chgType?: ChgType;
}): OalFlightSchedule {
  return {
    isGetData: false,
    fltIndex,
    legIndex,
    rowStatus: rowStatus || "",
    chgType: chgType || "",
    fltName: "",
    onwardFltName: "",
    hideFlgCd: "",
    csList: [],
    csFltNames: [],
    updateValidationErrors: [],
    // --- UTC切り替え用 ---
    orgDate: "",
    std: "",
    etd: "",
    sta: "",
    eta: "",
    onwardOrgDate: "",
    // --- FLT ---
    orgDateLcl: "",
    alCd: "",
    fltNo: "",
    casFltNo: "",
    casFltFlg: false,
    // --- LEG ---
    intDomCat: "",
    skdlNonskdlCat: "",
    paxCgoCat: "",
    dispStatus: "",
    skdLegSno: 0,
    rcvFltOrgLegPhySno: null,
    legPhySno: 0,
    delFlg: false,
    cnlFlg: false,
    depApoCd: "",
    arrApoCd: "",
    stdLcl: "",
    stdUtc: "",
    etdLcl: "",
    etdUtc: "",
    xtdLcl: "",
    xtdUtc: "",
    staLcl: "",
    staUtc: "",
    etaLcl: "",
    etaUtc: "",
    xtaLcl: "",
    xtaUtc: "",
    shipTypeIataCd: "",
    shipNo: "",
    svcTypeDiaCd: "",
    onwardOrgDateLcl: "",
    onwardAlCd: "",
    onwardFltNo: "",
    depFisHideFlg: false,
    arrFisHideFlg: false,
    legSeq: 0,
    legDelFlg: false,
    legCnlFlg: false,
    legCreRsnCd: "",
    legChgRsnCd: "",
    legFixFlg: false,
    legFltRemarks: "",
  };
}

/**
 * 新規の便を追加する
 */
export const fltListInsert = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "oalFlightSchedule/fltListInsert",
  // 新規の便を追加する
  (_arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    // 新規の便を挿入する
    const { fltScheduleList } = getState().oalFlightSchedule;
    const maxIndex = maxBy(fltScheduleList, (f) => f.fltIndex);
    const fltIndex = maxIndex ? maxIndex.fltIndex + 1 : 0;

    const insertState = getInitialFormState({
      fltIndex,
      legIndex: 0,
      rowStatus: "",
      chgType: "ADD FLT",
    });
    const insertStateInitial = getInitialFormState({
      fltIndex,
      legIndex: 0,
    });
    dispatch(fltListSplice({ index: 0, deleteCount: 0, fltScheduleList: [insertState], fltScheduleListInitial: [insertStateInitial] }));
  }
);

/**
 * 既存のFLTにLEGを追加する
 */
export const fltListAddLeg = createAsyncThunk<void, { index: number; chgType: ChgType }, { dispatch: AppDispatch; state: RootState }>(
  "oalFlightSchedule/fltListAddLeg",
  (arg, thunkAPI) => {
    const { index, chgType } = arg;
    const { dispatch, getState } = thunkAPI;
    const { fltScheduleList } = getState().oalFlightSchedule;
    const sameFltValues = fltScheduleList.filter((f) => f.fltIndex === fltScheduleList[index].fltIndex);
    const firstFltValue = sameFltValues.find((f) => f.legIndex === 0);
    const maxLegIndex = maxBy(sameFltValues, (f) => f.legIndex);
    const { fltIndex } = fltScheduleList[index];
    const legIndex = maxLegIndex ? maxLegIndex.legIndex + 1 : 0;
    if (firstFltValue) {
      const insertState = {
        ...getInitialFormState({ fltIndex, legIndex, rowStatus: "", chgType }),
        ...getFltInfo(firstFltValue), // 同便の１行目から便情報をコピーする
      };
      const insertStateInitial = getInitialFormState({ fltIndex, legIndex });
      dispatch(
        fltListSplice({
          index: index + 1,
          deleteCount: 0,
          fltScheduleList: [insertState],
          fltScheduleListInitial: [insertStateInitial],
        })
      );
    }
  }
);

/**
 * 既存のFLTをコピーする
 */
export const fltListCopyFlt = createAsyncThunk<void, { index: number }, { dispatch: AppDispatch; state: RootState }>(
  "oalFlightSchedule/fltListCopyFlt",
  (arg, thunkAPI) => {
    const { index } = arg;
    const { dispatch, getState } = thunkAPI;
    const { fltScheduleList } = getState().oalFlightSchedule;
    const sameFltValues = fltScheduleList.filter((f) => f.fltIndex === fltScheduleList[index].fltIndex);
    const sameFltValuesActive = sameFltValues.filter((f) => f.dispStatus !== "CNL");
    const copiedFirstFltValue = sameFltValues.find((f) => f.legIndex === 0);
    const orgFirstIndex = fltScheduleList.findIndex((f) => f.fltIndex === fltScheduleList[index].fltIndex && f.legIndex === 0);
    if (copiedFirstFltValue && orgFirstIndex >= 0) {
      const maxFltIndex = maxBy(fltScheduleList, (f) => f.fltIndex);
      const fltIndex = maxFltIndex ? maxFltIndex.fltIndex + 1 : 0;
      const insertStates = map(sameFltValuesActive, (f, legIndex) => {
        const formState: OalFlightSchedule = {
          ...getInitialFormState({
            fltIndex,
            legIndex,
            rowStatus: "Edited",
            chgType: "ADD FLT",
          }),
          // 一覧画面の入力不可項目以外の表示項目とその関連情報のみを既存のFLTからコピーする
          onwardFltName: f.onwardFltName,
          hideFlgCd: f.hideFlgCd,
          csList: f.csList,
          csFltNames: f.csFltNames,
          std: f.std,
          sta: f.sta,
          onwardOrgDate: f.onwardOrgDate,
          depApoCd: f.depApoCd,
          arrApoCd: f.arrApoCd,
          stdLcl: f.stdLcl,
          stdUtc: f.stdUtc,
          staLcl: f.staLcl,
          staUtc: f.staUtc,
          shipTypeIataCd: f.shipTypeIataCd,
          shipNo: f.shipNo,
          svcTypeDiaCd: f.svcTypeDiaCd,
          onwardOrgDateLcl: f.onwardOrgDateLcl,
          onwardAlCd: f.onwardAlCd,
          onwardFltNo: f.onwardFltNo,
          depFisHideFlg: f.depFisHideFlg,
          arrFisHideFlg: f.arrFisHideFlg,
          // 同便の１行目から便情報をコピーする
          ...getFltInfo(copiedFirstFltValue),
        };
        return formState;
      });
      const insertOrgStates = insertStates.map((insertState) => {
        const insertInitialState = getInitialFormState({
          fltIndex: insertState.fltIndex,
          legIndex: insertState.legIndex,
        });
        return insertInitialState;
      });
      dispatch(
        fltListSplice({
          index: index + sameFltValues.length,
          deleteCount: 0,
          fltScheduleList: insertStates,
          fltScheduleListInitial: insertOrgStates,
        })
      );
    }
  }
);

export const fltListRemoveLeg = createAsyncThunk<void, { index: number }, { dispatch: AppDispatch; state: RootState }>(
  "oalFlightSchedule/fltListRemoveLeg",
  (arg, thunkAPI) => {
    const { index } = arg;
    const { dispatch, getState } = thunkAPI;
    const { fltScheduleList } = getState().oalFlightSchedule;
    const orgFltSchedule = fltScheduleList[index];
    if (orgFltSchedule.legIndex === 0) {
      // legIndexが0の行が削除される場合、次のFLTを0に設定する。
      const nextFltSchedule = minBy(
        fltScheduleList.filter((f) => f.fltIndex === orgFltSchedule.fltIndex && f.legIndex !== 0),
        (f) => f.legIndex
      );
      if (nextFltSchedule) {
        const nextIndex = fltScheduleList.findIndex(
          (f) => f.fltIndex === orgFltSchedule.fltIndex && f.legIndex === nextFltSchedule.legIndex
        );
        dispatch(fltListEdit({ index: nextIndex, fltScheduleList: [{ ...nextFltSchedule, legIndex: 0 }] }));
      }
    }
    dispatch(fltListDelete({ index, length: 1 }));
  }
);

export const fltListRemoveFlt = createAsyncThunk<void, { index: number }, { dispatch: AppDispatch; state: RootState }>(
  "oalFlightSchedule/fltListRemoveFlt",
  (arg, thunkAPI) => {
    const { index } = arg;
    const { dispatch, getState } = thunkAPI;
    const { fltScheduleList } = getState().oalFlightSchedule;
    const orgFltSchedule = fltScheduleList[index];
    if (orgFltSchedule) {
      const sameFltValues = fltScheduleList.filter((f) => f.fltIndex === orgFltSchedule.fltIndex);
      const delIndex = fltScheduleList.findIndex((f) => f.fltIndex === orgFltSchedule.fltIndex && f.legIndex === 0);
      dispatch(fltListDelete({ index: delIndex, length: sameFltValues.length }));
    }
  }
);

export const showConfirmation = createAsyncThunk<void, { onClickYes: () => void }, { dispatch: AppDispatch }>(
  "oalFlightSchedule/showConfirmation",
  (arg, thunkAPI) => {
    const { onClickYes } = arg;
    const { dispatch } = thunkAPI;
    NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: onClickYes }) });
  }
);

/**
 * 他社便スケジュールを検索する
 */
export const search = createAsyncThunk<void, { oalSearchParams: OalSearchParams }, { dispatch: AppDispatch; state: RootState }>(
  "oalFlightSchedule/search",
  async ({ oalSearchParams }, { dispatch, getState }) => {
    dispatch(slice.actions.fetchOalFlightSchedule());
    NotificationCreator.removeAll({ dispatch });
    const { searchType, dateFrom, dateTo, flt, casualFlg, opeCsFlg, nextToFlg, depApoCd, arrApoCd, alCd, apoCd } = oalSearchParams;
    const onlineDbExpDays = getState().account.master.oalOnlineDbExpDays;
    const params: OalFlightScheduleApi.Get.Request = {
      funcId: "S11301C",
      searchType,
      dateFrom,
      dateTo: searchType === "FLT" ? dateTo : undefined,
      alCd: searchType === "FLT" && !casualFlg ? flt.slice(0, 2) || "" : undefined,
      fltNo: searchType === "FLT" && !casualFlg ? flt.slice(2) || "" : undefined,
      casFltNo: searchType === "FLT" && casualFlg ? flt || "" : undefined,
      casFltFlg: searchType === "FLT" ? casualFlg || false : undefined,
      csSearchFlg: searchType === "FLT" ? opeCsFlg || false : undefined,
      cnxSearchFlg: searchType === "FLT" ? nextToFlg || false : undefined,
      depApoCd: searchType === "LEG" ? depApoCd || "" : undefined,
      arrApoCd: searchType === "LEG" ? arrApoCd || "" : undefined,
      cwAlCd: searchType === "ALAPO" ? alCd || "" : undefined,
      cwAirport: searchType === "ALAPO" ? apoCd || "" : undefined,
      onlineDbExpDays,
    };

    try {
      const MyapoCd = getState().account.jobAuth.user.myApoCd;
      void dispatch(getHeaderInfo({ apoCd: MyapoCd }));
      const response = await WebApi.getOalFlightSchedule(dispatch, params);
      const { isUtc } = getState().oalFlightSchedule;
      const fltScheduleList = convertToFltScheduleListForm(response.data.fltScheduleList, isUtc);
      dispatch(slice.actions.fetchOalFlightScheduleSuccess({ fltScheduleList }));
      if (!fltScheduleList || fltScheduleList.length === 0) {
        NotificationCreator.create({ dispatch, message: SoalaMessage.M30003C() });
      }
    } catch (err) {
      dispatch(slice.actions.fetchOalFlightScheduleFailure({ error: err as Error }));
    }
  }
);

/**
 * APIから取得した他社便スケジュールを画面用に変換する
 */
function convertToFltScheduleListForm(fltScheduleList: OalFlightScheduleApi.Get.FltScheduleList[], isUtc: boolean): OalFlightSchedule[] {
  const list: OalFlightSchedule[] = [];
  if (fltScheduleList) {
    fltScheduleList.forEach((flt, fltIndex) => {
      const { legList, ...fltItems } = flt;
      legList.forEach((leg, legIndex) => {
        const { csList, ...legItems } = leg;
        const csFltNames = csList.map((c) => c.csAlCd + c.csFltNo);
        list.push({
          ...fltItems,
          ...legItems,
          isGetData: true,
          fltIndex,
          legIndex,
          chgType: "",
          fltName: fltItems.casFltFlg ? fltItems.casFltNo || "" : (fltItems.alCd || "") + (fltItems.fltNo || ""),
          orgDate: fltItems.orgDateLcl ? dayjs(fltItems.orgDateLcl).format("YYMMDD") : "", // 常にLOCAL日付を表示する。
          onwardOrgDate: legItems.onwardOrgDateLcl ? dayjs(legItems.onwardOrgDateLcl).format("YYMMDD") : "", // 常にLOCAL日付を表示する。
          onwardFltName: (legItems.onwardAlCd || "") + (legItems.onwardFltNo || ""),
          hideFlgCd:
            legItems.depFisHideFlg && legItems.arrFisHideFlg
              ? "BOTH"
              : legItems.depFisHideFlg
              ? "DEP"
              : legItems.arrFisHideFlg
              ? "ARR"
              : "",
          csList: csList.slice(),
          csFltNames,
          updateValidationErrors: [],
        });
      });
    });
  }
  return setListDateInputValue(list, isUtc);
}

/**
 * 日付項目（UTC切り替えに影響する項目と影響しない項目）を設定する
 */
function setListDateInputValue(fltScheduleList: OalFlightSchedule[], isUtc: boolean): OalFlightSchedule[] {
  if (isUtc) {
    return map(fltScheduleList, (list) => ({
      ...list,
      std: list.stdUtc ? dayjs(list.stdUtc).format("DDHHmm").toUpperCase() : "",
      etd: list.etdUtc ? dayjs(list.etdUtc).format("DDHHmm").toUpperCase() : "",
      sta: list.staUtc ? dayjs(list.staUtc).format("DDHHmm").toUpperCase() : "",
      eta: list.etaUtc ? dayjs(list.etaUtc).format("DDHHmm").toUpperCase() : "",
    }));
  }
  return map(fltScheduleList, (list) => ({
    ...list,
    std: list.stdLcl ? dayjs(list.stdLcl).format("DDHHmm").toUpperCase() : "",
    etd: list.etdLcl ? dayjs(list.etdLcl).format("DDHHmm").toUpperCase() : "",
    sta: list.staLcl ? dayjs(list.staLcl).format("DDHHmm").toUpperCase() : "",
    eta: list.etaLcl ? dayjs(list.etaLcl).format("DDHHmm").toUpperCase() : "",
  }));
}

/**
 * 他社便スケジュールを更新する
 */
export const update = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "oalFlightSchedule/update",
  async (_arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const onlineDbExpDays = getState().account.master.oalOnlineDbExpDays;
    const { fltScheduleList } = getState().oalFlightSchedule;
    const { fltScheduleListInitial } = getState().oalFlightSchedule;
    const { isUtc } = getState().oalFlightSchedule;

    let errorCaused = false;
    dispatch(slice.actions.updateOalFlightSchedule());
    NotificationCreator.removeAll({ dispatch });
    const editedFltIndexs = uniq(fltScheduleList.filter((f) => f.rowStatus === "Edited").map((f) => f.fltIndex));
    try {
      for (let xi = 0; xi < editedFltIndexs.length; xi++) {
        // 同期処理したいのでforeach()ではなくfor文にしている
        const fltIndex = editedFltIndexs[xi];
        const targetOalFlightScheduleList = fltScheduleList.filter((f) => f.fltIndex === fltIndex);
        const targetOalFlightScheduleListInitial = fltScheduleListInitial.filter((f) => f.fltIndex === fltIndex && f.isGetData);
        if (targetOalFlightScheduleList.find((f) => (f.rowStatus === "Error" && f.chgType !== "") || f.rowStatus === "Failed")) continue; // Error（未編集の場合は除く）、Failedが含まれている場合は処理をスキップ
        const editedFltList = convertToPostFltScheduleList(targetOalFlightScheduleList, targetOalFlightScheduleListInitial, isUtc, false);
        const orgEditedFltList = convertToPostFltScheduleList(targetOalFlightScheduleList, targetOalFlightScheduleListInitial, isUtc, true);
        try {
          // API呼び出し前の必須チェック
          let hasValidationErrors = false;
          for (let rowIndex = 0; rowIndex < targetOalFlightScheduleList.length; rowIndex++) {
            const flt = targetOalFlightScheduleList[rowIndex];
            const index = fltScheduleList.findIndex((f) => f.fltIndex === flt.fltIndex && f.legIndex === flt.legIndex);
            if (index >= 0) {
              const fltInitial = fltScheduleListInitial[index];
              const updateValidationErrors = new Set<string>();

              // STDの必須チェック
              // 1-1-1.再就航区間である & 確定区間である & 変更前に値ありの場合：STDの必須チェックを行う
              if (fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && fltInitial.std) {
                if (!flt.std) {
                  updateValidationErrors.add("std");
                }
              }
              // 1-1-2.再就航区間である & 確定区間である & 変更前に値なしの場合：STDもしくはETDがあるかの必須チェックを行う
              if (fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && !fltInitial.std) {
                if (!flt.std && !flt.etd) {
                  updateValidationErrors.add("std");
                }
              }
              // 1-2-2.再就航区間である & 未確定区間である & 区間削除対象でない場合：STDもしくはETDがあるかの必須チェックを行う
              if (fltInitial.rcvFltOrgLegPhySno !== null && !fltInitial.legFixFlg && flt.chgType !== "DEL LEG") {
                if (!flt.std && !flt.etd) {
                  updateValidationErrors.add("std");
                }
              }
              // 2.再就航区間ではない場合：STDの必須チェックを行う
              if (fltInitial.rcvFltOrgLegPhySno === null) {
                if (!flt.std) {
                  updateValidationErrors.add("std");
                }
              }

              // ETDの必須チェック
              // 1.編集タイプが"RTE SKD"である場合：ETDの必須チェックは行わないため、後続の条件文を飛ばす
              if (flt.chgType !== "RTE SKD") {
                // 2-1-1.再就航区間である & 確定区間である & 変更前に値ありの場合：ETDの必須チェックを行う
                if (fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && fltInitial.etd) {
                  if (!flt.etd) {
                    updateValidationErrors.add("etd");
                  }
                }
                // 2-1-2.再就航区間である & 確定区間である & 変更前に値なし場合：STDもしくはETDがあるかの必須チェックを行う
                if (fltInitial.rcvFltOrgLegPhySno !== null && fltInitial.legFixFlg && !fltInitial.etd) {
                  if (!flt.std && !flt.etd) {
                    updateValidationErrors.add("etd");
                  }
                }
                // 2-2-2.再就航区間である & 未確定区間である & 区間削除対象でない場合：STDもしくはETDがあるかの必須チェックを行う
                if (fltInitial.rcvFltOrgLegPhySno !== null && !fltInitial.legFixFlg && flt.chgType !== "DEL LEG") {
                  if (!flt.std && !flt.etd) {
                    updateValidationErrors.add("etd");
                  }
                }
                // 3-1.再就航区間ではない & 変更前に値ありの場合：ETDの必須チェックを行う
                if (fltInitial.rcvFltOrgLegPhySno === null && fltInitial.etd) {
                  if (!flt.etd) {
                    updateValidationErrors.add("etd");
                  }
                }
              }

              // 赤枠表示対象がある場合は、赤枠とメッセージの表示を行う
              if (updateValidationErrors.size) {
                // 該当行のステータスをErrorにし、エラー項目を赤枠にする
                // eslint-disable-next-line @typescript-eslint/await-thenable, no-await-in-loop
                await dispatch(
                  fltListEdit({
                    index,
                    fltScheduleList: [{ ...flt, rowStatus: "Error", updateValidationErrors: [...updateValidationErrors] }],
                  })
                );
                // メッセージを表示
                const title = getSoalaMessageTitle(flt);
                const id = `oalUpdateErrorRequiredInput(${fltIndex}-${rowIndex})`;
                NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50029C({ title, errorText: "Required Input" }) });
                hasValidationErrors = true;
              }
            }
          }

          // 必須チェックで引っ掛かった場合は、APIの呼び出し以降の処理をスキップする
          if (hasValidationErrors) {
            errorCaused = true;
            continue;
          }

          // API呼び出し前に、"Airport Order"エラーの影響で未編集ながら"Error"となっている行の"Error"表示と赤枠を解除する
          for (let rowIndex = 0; rowIndex < targetOalFlightScheduleList.length; rowIndex++) {
            const flt = targetOalFlightScheduleList[rowIndex];
            const index = fltScheduleList.findIndex((f) => f.fltIndex === flt.fltIndex && f.legIndex === flt.legIndex);
            if (index >= 0 && flt.rowStatus === "Error" && flt.chgType === "") {
              // eslint-disable-next-line @typescript-eslint/await-thenable, no-await-in-loop
              await dispatch(fltListEdit({ index, fltScheduleList: [{ ...flt, rowStatus: "", updateValidationErrors: [] }] }));
            }
          }

          // API呼び出し
          // eslint-disable-next-line no-await-in-loop
          const response = await WebApi.postOalFlightSchedule(dispatch, {
            funcId: "S11301C",
            fltScheduleList: editedFltList,
            prevInfo: { fltScheduleList: orgEditedFltList },
            dataOwnerCd: "SOALA",
            onlineDbExpDays,
          });

          // 画面に反映する
          const newFltScheduleList = convertToFltScheduleListForm(response.data.fltScheduleList, isUtc);
          const newFltScheduleListInitial = cloneDeep(newFltScheduleList);

          for (let xj = 0; xj < newFltScheduleList.length; xj++) {
            // 同期処理したいのでforeach()ではなくfor文にしている
            newFltScheduleList[xj].fltIndex = fltIndex;
            newFltScheduleList[xj].updateValidationErrors = [];
            newFltScheduleListInitial[xj].fltIndex = fltIndex;
            // Skippedのメッセージを表示する
            if (newFltScheduleList[xj].rowStatus === "Skipped") {
              const flt = targetOalFlightScheduleList[xj];
              const title = getSoalaMessageTitle(flt);
              const id = `oalUpdateSkipped(${fltIndex}-${xj})`;
              NotificationCreator.create({ dispatch, id, message: SoalaMessage.M30013C({ title }) });
            }
          }
          const currentFltScheduleList = getState().oalFlightSchedule.fltScheduleList; // 取得しなおして最新の挿入位置を取得
          const sameFltValues = currentFltScheduleList.filter((f) => f.fltIndex === fltIndex);
          const targetIndex = currentFltScheduleList.findIndex((f) => f.fltIndex === fltIndex && f.legIndex === 0);
          // eslint-disable-next-line @typescript-eslint/await-thenable, no-await-in-loop
          await dispatch(
            fltListSplice({
              index: targetIndex,
              deleteCount: sameFltValues.length,
              fltScheduleList: newFltScheduleList,
              fltScheduleListInitial: newFltScheduleListInitial,
            })
          );
        } catch (err) {
          errorCaused = true;
          if (err instanceof ApiError && err.response) {
            // 409（コンフリクト）エラーの場合、"Failed"にしてスキップ
            if (err.response.status === 409) {
              const data = (err.response.data as OalFlightScheduleApi.Post.ErrorResponse) || null;
              // await fltScheduleList.forEach(async (f,index) => {
              for (let index = 0; index < fltScheduleList.length; index++) {
                const f = fltScheduleList[index];
                if (f.fltIndex === fltIndex && f.rowStatus === "Edited") {
                  // eslint-disable-next-line @typescript-eslint/await-thenable, no-await-in-loop
                  await dispatch(fltListEdit({ index, fltScheduleList: [{ ...f, rowStatus: "Failed", updateValidationErrors: [] }] }));
                  if (data && data.errors) {
                    const rowIndex = targetOalFlightScheduleList.findIndex((tf) => tf.legIndex === f.legIndex);
                    if (rowIndex >= 0) {
                      const error = data.errors.find((e) => e.rowNo === rowIndex);
                      if (error) {
                        // メッセージを表示
                        const flt = targetOalFlightScheduleList[error.rowNo];
                        const title = getSoalaMessageTitle(flt);
                        const id = `oalUpdateFailed409(${fltIndex}-${error.rowNo})`;
                        NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50031C({ title }) });
                      }
                    }
                  }
                }
              }
              continue;
              // 422（バリデーション）エラーの場合、"Error"にしてエラーメッセージを表示する
            } else if (err.response.status === 422) {
              const data = (err.response.data as OalFlightScheduleApi.Post.ErrorResponse) || null;
              if (data && data.errors) {
                let isProcessed = false;
                // await fltScheduleList.forEach(async (f,index) => {
                for (let index = 0; index < fltScheduleList.length; index++) {
                  const f = fltScheduleList[index];
                  if (f.fltIndex === fltIndex) {
                    const rowIndex = targetOalFlightScheduleList.findIndex((tf) => tf.legIndex === f.legIndex);
                    if (rowIndex >= 0) {
                      const error = data.errors.find((e) => e.rowNo === rowIndex);
                      if (error) {
                        // Editedの場合、エラー対象のLEGはエラーにする
                        if (f.rowStatus === "Edited") {
                          // マルチレグでWrongCombinationのエラーの場合、１区間目の該当項目に赤枠を表示させる
                          if (rowIndex > 0 && !isProcessed) {
                            const findErrorMessages = error.errorMessages.includes("Wrong Combination");
                            const findErrorItems =
                              error.errorItems.includes("paxCgoCat") &&
                              error.errorItems.includes("skdlNonskdlCat") &&
                              error.errorItems.includes("svcTypeDiaCd");
                            if (findErrorMessages && findErrorItems) {
                              const errorParent = data.errors.find((e) => e.rowNo === 0);
                              const updateValidationErrors = ["paxCgoCat", "skdlNonskdlCat"];
                              if (errorParent) {
                                updateValidationErrors.push(...errorParent.errorItems);
                                // eslint-disable-next-line @typescript-eslint/await-thenable, no-await-in-loop
                                await dispatch(
                                  fltListEdit({
                                    index: index - rowIndex,
                                    fltScheduleList: [{ ...fltScheduleList[index - rowIndex], rowStatus: "Error", updateValidationErrors }],
                                  })
                                );
                              } else {
                                // eslint-disable-next-line @typescript-eslint/await-thenable, no-await-in-loop
                                await dispatch(
                                  fltListEdit({
                                    index: index - rowIndex,
                                    fltScheduleList: [{ ...fltScheduleList[index - rowIndex], updateValidationErrors }],
                                  })
                                );
                              }
                              isProcessed = true;
                            }
                          }
                          // 該当行のステータスをErrorにし、エラー項目を赤枠にする
                          // eslint-disable-next-line @typescript-eslint/await-thenable, no-await-in-loop
                          await dispatch(
                            fltListEdit({
                              index,
                              fltScheduleList: [{ ...f, rowStatus: "Error", updateValidationErrors: error.errorItems }],
                            })
                          );
                          // メッセージを表示
                          const flt = targetOalFlightScheduleList[error.rowNo];
                          const title = getSoalaMessageTitle(flt);
                          error.errorMessages.forEach((errorText, errorIndex) => {
                            const id = `oalUpdateError422(${fltIndex}-${error.rowNo}-${errorIndex})`;
                            NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50029C({ title, errorText }) });
                          });
                        } else if (error.errorMessages.includes("Airport Order")) {
                          // Airport Orderのエラーの場合、Editedでない行もエラー表示の対象にする
                          // 該当行のステータスをErrorにし、エラー項目を赤枠にする
                          // eslint-disable-next-line @typescript-eslint/await-thenable, no-await-in-loop
                          await dispatch(
                            fltListEdit({
                              index,
                              fltScheduleList: [{ ...f, rowStatus: "Error", updateValidationErrors: error.errorItems }],
                            })
                          );
                          // メッセージを表示
                          const flt = targetOalFlightScheduleList[error.rowNo];
                          const title = getSoalaMessageTitle(flt);
                          error.errorMessages.forEach((errorText, errorIndex) => {
                            if (errorText === "Airport Order") {
                              const id = `oalUpdateError422(${fltIndex}-${error.rowNo}-${errorIndex})`;
                              NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50029C({ title, errorText }) });
                            }
                          });
                        }
                      }
                    }
                  }
                }
              }
              continue;
            }
          }
          throw err;
        }
      }
      if (errorCaused) {
        NotificationCreator.create({ dispatch, id: "oalUpdateError", message: SoalaMessage.M30012C({}) });
      } else {
        NotificationCreator.create({ dispatch, id: "oalUpdateSuccess", message: SoalaMessage.M30002C() });
      }
      dispatch(slice.actions.updateOalFlightScheduleSuccess());
      const apoCd = getState().account.jobAuth.user.myApoCd;
      void dispatch(getHeaderInfo({ apoCd }));
    } catch (err) {
      dispatch(slice.actions.updateOalFlightScheduleFailure({ error: err as Error }));
    }
  }
);

/**
 * Onwardを入力不可にする条件
 */
export const getOnwardForceDisabled = (fltSchedule: OalFlightSchedule): boolean => !!(fltSchedule.shipNo || fltSchedule.casFltFlg);

/**
 * エラーメッセージのタイトルを作成する
 */
function getSoalaMessageTitle(fltSchedule: OalFlightSchedule): string {
  return `${fltSchedule.fltName}/${fltSchedule.orgDateLcl ? dayjs(fltSchedule.orgDateLcl).format("DDMMM").toUpperCase() : ""} ${
    fltSchedule.depApoCd
  }-${fltSchedule.arrApoCd}`;
}

/**
 * 画面のデータを更新用のデータに変換する
 */
function convertToPostFltScheduleList(
  fltScheduleList: OalFlightSchedule[],
  fltScheduleListInitial: OalFlightSchedule[],
  isUtc: boolean,
  isOrg: boolean
): OalFlightScheduleApi.Post.FltScheduleList[] {
  const legList = isOrg ? fltScheduleListInitial : fltScheduleList;
  if (!legList) return [];
  const flt = legList.find((f) => f.legIndex === 0);
  if (!flt) return [];
  let newlist: OalFlightScheduleApi.Post.FltScheduleList;
  if (isOrg) {
    // 取得時のデータ
    newlist = {
      orgDateLcl: flt.orgDateLcl,
      alCd: flt.alCd,
      fltNo: flt.fltNo,
      casFltNo: flt.casFltNo,
      casFltFlg: flt.casFltFlg,
      utcFlg: isUtc,
      legList: map(legList, (leg, index) => {
        const newLeg: OalFlightScheduleApi.Post.LegList = {
          chgType: "",
          intDomCat: flt.intDomCat,
          paxCgoCat: flt.paxCgoCat,
          skdlNonskdlCat: flt.skdlNonskdlCat,
          skdLegSno: leg.skdLegSno,
          rcvFltOrgLegPhySno: leg.rcvFltOrgLegPhySno,
          legPhySno: leg.legPhySno,
          delFlg: leg.delFlg,
          cnlFlg: leg.cnlFlg,
          depApoCd: leg.depApoCd,
          arrApoCd: leg.arrApoCd,
          std: isUtc ? leg.stdUtc : leg.stdLcl,
          etd: isUtc ? leg.etdUtc : leg.etdLcl,
          sta: isUtc ? leg.staUtc : leg.staLcl,
          eta: isUtc ? leg.etaUtc : leg.etaLcl,
          shipTypeIataCd: leg.shipTypeIataCd,
          shipNo: leg.shipNo,
          svcTypeDiaCd: leg.svcTypeDiaCd,
          onwardOrgDateLcl: leg.onwardOrgDateLcl,
          onwardAlCd: leg.onwardAlCd,
          onwardFltNo: leg.onwardFltNo,
          depFisHideFlg: leg.depFisHideFlg,
          arrFisHideFlg: leg.arrFisHideFlg,
          legSeq: leg.legSeq,
          legDelFlg: leg.legDelFlg,
          legCnlFlg: leg.legCnlFlg,
          legFixFlg: leg.legFixFlg,
          csList: leg.csList,
          rowNo: index,
        };
        return newLeg;
      }),
    };
  } else {
    const getAlCd = (fltName: string) => (fltName ? `${fltName}  `.slice(0, 2) : "");
    const getFltNo = (fltName: string) => (fltName ? fltName.slice(2, 6) : "");
    const delFlg = !!(legList.length === legList.filter((f) => f.chgType === "DEL LEG").length || legList[0].chgType === "DEL FLT");
    const getLegCnlFlg = (leg: OalFlightSchedule) => {
      if (leg.chgType === "CNL") {
        return true;
      }
      if (leg.chgType === "RIN") {
        return false;
      }

      return leg.legCnlFlg;
    };
    // 全ての区間キャンセルフラグがtrueになる場合、trueを設定
    const cnlFlg = legList.length === legList.filter((leg) => getLegCnlFlg(leg)).length;
    // 更新データ
    newlist = {
      orgDateLcl: flt.orgDateLcl || "",
      alCd: flt.casFltFlg ? "" : getAlCd(flt.fltName),
      fltNo: flt.casFltFlg ? "" : getFltNo(flt.fltName),
      casFltNo: flt.casFltFlg ? flt.fltName : "",
      casFltFlg: flt.casFltFlg,
      utcFlg: isUtc,
      legList: map(legList, (leg, index) => {
        let onwardOrgDateLcl: string | null = "";
        let onwardAlCd: string | null = "";
        let onwardFltNo: string | null = "";
        if (getOnwardForceDisabled(leg)) {
          // Onwardが入力不可の場合は、初期値を設定する
          const legInitial = fltScheduleListInitial.filter((f) => f.legIndex === leg.legIndex);
          if (legInitial.length) {
            onwardOrgDateLcl =
              legInitial[0].onwardOrgDateLcl === undefined || legInitial[0].onwardOrgDateLcl === null
                ? null
                : legInitial[0].onwardOrgDateLcl || "";
            onwardAlCd = legInitial[0].onwardAlCd;
            onwardFltNo = legInitial[0].onwardFltNo;
          }
        } else {
          onwardOrgDateLcl = leg.onwardOrgDateLcl === undefined ? null : leg.onwardOrgDateLcl;
          onwardAlCd = getAlCd(leg.onwardFltName);
          onwardFltNo = getFltNo(leg.onwardFltName);
        }
        const newLeg: OalFlightScheduleApi.Post.LegList = {
          chgType: leg.chgType || "Stable",
          intDomCat: flt.intDomCat,
          paxCgoCat: flt.paxCgoCat,
          skdlNonskdlCat: flt.skdlNonskdlCat,
          skdLegSno: leg.skdLegSno,
          rcvFltOrgLegPhySno: leg.rcvFltOrgLegPhySno,
          legPhySno: leg.legPhySno,
          delFlg,
          cnlFlg,
          depApoCd: leg.depApoCd,
          arrApoCd: leg.arrApoCd,
          std: convertDDHHmmToDate(flt.orgDateLcl, leg.std),
          etd: convertDDHHmmToDate(flt.orgDateLcl, leg.etd),
          sta: convertDDHHmmToDate(flt.orgDateLcl, leg.sta),
          eta: convertDDHHmmToDate(flt.orgDateLcl, leg.eta),
          shipTypeIataCd: leg.shipTypeIataCd,
          shipNo: leg.shipNo,
          svcTypeDiaCd: leg.svcTypeDiaCd,
          onwardOrgDateLcl,
          onwardAlCd,
          onwardFltNo,
          depFisHideFlg: !!(leg.hideFlgCd === "BOTH" || leg.hideFlgCd === "DEP"),
          arrFisHideFlg: !!(leg.hideFlgCd === "BOTH" || leg.hideFlgCd === "ARR"),
          legSeq: index + 1,
          legDelFlg: leg.chgType === "DEL LEG" ? true : delFlg,
          legCnlFlg: getLegCnlFlg(leg),
          legFixFlg: leg.legFixFlg,
          csList: leg.csFltNames.reduce((list: OalFlightScheduleApi.Post.CsList[], csFltName: string) => {
            if (csFltName) {
              const orgFlt = leg.csList.find((c) => csFltName === (c.csAlCd || "") + (c.csFltNo || ""));
              list.push({
                csAlCd: getAlCd(csFltName),
                csFltNo: getFltNo(csFltName),
                csSeq: orgFlt ? orgFlt.csSeq : null,
                dispSeq: list.length + 1,
              });
            }
            return list;
          }, []),
          rowNo: index,
        };

        return newLeg;
      }),
    };
  }
  return [newlist];
}

export type ChgType = "" | "CNL" | "RIN" | "SKD TIM" | "RTE SKD" | "ADD LEG" | "DEL LEG" | "Other" | "ADD FLT" | "DEL FLT" | "FLT No.";

export interface OalSearchParams {
  searchType: "FLT" | "LEG" | "ALAPO";
  dateFrom: string;
  dateTo: string;
  opeCsFlg: boolean;
  flt: string;
  depApoCd: string;
  arrApoCd: string;
  casualFlg: boolean;
  nextToFlg: boolean;
  alCd: string;
  apoCd: string;
}

// state
export interface OalFlightScheduleState {
  fltScheduleList: OalFlightSchedule[];
  fltScheduleListInitial: OalFlightSchedule[];
  isUtc: boolean;
  isUpdated: boolean;
  isSearched: boolean;
  isFetching: boolean;
  isOpenInputModal: boolean;
  inputRowIndex: number | null;
  inputChgType: ChgType;
  inputNewRow: boolean | null;
}

export interface OalFlightSchedule extends FltScheduleListBase, LegList {
  isGetData: boolean;
  fltIndex: number;
  legIndex: number;
  chgType: ChgType;
  fltName: string;
  onwardFltName: string;
  hideFlgCd: "" | "DEP" | "ARR" | "BOTH";
  csFltNames: string[];
  updateValidationErrors: string[];
  orgDate?: string;
  std?: string;
  etd?: string;
  sta?: string;
  eta?: string;
  onwardOrgDate?: string;
}

const initialState: OalFlightScheduleState = {
  fltScheduleList: [],
  fltScheduleListInitial: [],
  isUtc: false,
  isSearched: false,
  isUpdated: false,
  isFetching: false,
  isOpenInputModal: false,
  inputRowIndex: null,
  inputChgType: "",
  inputNewRow: null,
};

export const slice = createSlice({
  name: "oalFlightSchedule",
  initialState,
  reducers: {
    clearOalFlightSchedule: (_state) => initialState,
    fetchOalFlightSchedule: (state) => {
      state.isSearched = false;
      state.isFetching = true;
    },
    fetchOalFlightScheduleSuccess: (state, action: PayloadAction<{ fltScheduleList: OalFlightSchedule[] }>) => {
      const { fltScheduleList } = action.payload;
      state.fltScheduleList = fltScheduleList;
      state.fltScheduleListInitial = cloneDeep(fltScheduleList);
      state.isSearched = true;
      state.isFetching = false;
    },
    fetchOalFlightScheduleFailure: (state, _action: PayloadAction<{ error: Error }>) => {
      state.isSearched = true;
      state.isFetching = false;
    },
    updateOalFlightSchedule: (state) => {
      const fltScheduleList = state.fltScheduleList.slice();
      fltScheduleList.forEach((f) => {
        if (f.rowStatus === "Updated" || f.rowStatus === "Skipped") {
          // eslint-disable-next-line no-param-reassign
          f.rowStatus = "";
        }
      });
      state.isUpdated = false;
      state.isFetching = true;
      state.fltScheduleList = fltScheduleList;
    },
    setInputModal: (
      state,
      action: PayloadAction<{ isOpenInputModal: boolean; inputRowIndex: number | null; inputChgType: ChgType; inputNewRow: boolean | null }>
    ) => {
      const { isOpenInputModal, inputRowIndex, inputChgType, inputNewRow } = action.payload;
      state.isOpenInputModal = isOpenInputModal;
      state.inputRowIndex = inputRowIndex;
      state.inputChgType = inputChgType;
      state.inputNewRow = inputNewRow;
    },
    fltListEdit: (state, action: PayloadAction<{ index: number; fltScheduleList: OalFlightSchedule[] }>) => {
      const { index, fltScheduleList } = action.payload;
      const copyFltScheduleList = state.fltScheduleList.slice();
      copyFltScheduleList.splice(index, fltScheduleList.length, ...fltScheduleList);
      state.fltScheduleList = copyFltScheduleList;
    },
    fltListSplice: (
      state,
      action: PayloadAction<{
        index: number;
        deleteCount: number;
        fltScheduleList: OalFlightSchedule[];
        fltScheduleListInitial: OalFlightSchedule[];
      }>
    ) => {
      const { index, deleteCount, fltScheduleList, fltScheduleListInitial } = action.payload;
      const copyFltScheduleList = state.fltScheduleList.slice();
      const copyFltScheduleListInitial = state.fltScheduleListInitial.slice();
      copyFltScheduleList.splice(index, deleteCount, ...fltScheduleList);
      copyFltScheduleListInitial.splice(index, deleteCount, ...fltScheduleListInitial);
      state.fltScheduleList = copyFltScheduleList;
      state.fltScheduleListInitial = copyFltScheduleListInitial;
    },
    fltListDelete: (state, action: PayloadAction<{ index: number; length: number }>) => {
      const { index, length } = action.payload;
      if (length) {
        const copyFltScheduleList = state.fltScheduleList.slice();
        const copyFltScheduleListInitial = state.fltScheduleListInitial.slice();
        copyFltScheduleList.splice(index, length);
        copyFltScheduleListInitial.splice(index, length);
        state.fltScheduleList = copyFltScheduleList;
        state.fltScheduleListInitial = copyFltScheduleListInitial;
      } else {
        state.fltScheduleList = [];
        state.fltScheduleListInitial = [];
      }
    },
    updateOalFlightScheduleSuccess: (state) => {
      state.isUpdated = true;
      state.isFetching = false;
    },
    updateOalFlightScheduleFailure: (state, _action: PayloadAction<{ error: Error }>) => {
      state.isFetching = false;
    },
    switchUtc: (state, action: PayloadAction<{ isUtc: boolean }>) => {
      const { isUtc } = action.payload;
      const fltScheduleListInitial = setListDateInputValue(state.fltScheduleListInitial, isUtc);
      const fltScheduleList = cloneDeep(fltScheduleListInitial);

      state.isUtc = isUtc;
      state.fltScheduleList = fltScheduleList;
      state.fltScheduleListInitial = fltScheduleListInitial;
    },
  },
});

export const { clearOalFlightSchedule, setInputModal, fltListEdit, fltListSplice, fltListDelete, switchUtc } = slice.actions;

export default slice.reducer;
