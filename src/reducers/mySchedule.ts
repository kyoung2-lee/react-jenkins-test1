import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { AxiosResponse } from "axios";
import { Const } from "../lib/commonConst";
import { storage } from "../lib/storage";
import { WebApi, ApiError } from "../lib/webApi";
import { formatFltNo, getXtaLcl, getXtdLcl, getTimeDateString, getGroundTime, getExcessTime } from "../lib/commonUtil";
import { NotificationCreator } from "../lib/notifications";
import { SoalaMessage } from "../lib/soalaMessages";
import { AppDispatch, RootState } from "../store/storeType";
import { Master } from "./account";
import { getHeaderInfo } from "./common";

// dayjsの設定
dayjs.extend(isBetween);

export interface MyScheduleState {
  timeChartState: MyScheduleApi.StaffAssignInformation;
  fisState: FisState | null;
  dtlSchedule: DetailScheduleState;
  selectedTaskId: number | null;
  timeScale: TimeScale;
  isShowContent: boolean;
  isUpdate: boolean;
  isFetching: boolean;
}

export type DetailScheduleState = MyScheduleApi.TaskInformation & {
  gateNo?: string;
  spotNo?: string;
};

export interface FisState {
  timeLclDayjs: dayjs.Dayjs | null;
  timeLcl: string;
  apoCd: string;
  apoDetail: MyScheduleFisApi.apoDetail; // PUSHでは渡って来ない
  depArrType: "D" | "A" | "";
  fisRow: FisRow | null;
  dispRangeFromLcl: string;
  dispRangeToLcl: string;
  acarsStsList: AcarsStatus.AcarsSts[] | null;
  shipNoToAcarsSts: Record<string, string>;
}

export interface FisRow {
  arrDepCtrl: CommonApi.ArrDepCtrl;
  arr: {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string | null;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    lstOrgApoCd: string;
    intDomCat: string;
    ataLcl: string;
    skdlNonskdlCat: string;
    omAlCd: string;
    isOal: boolean;
    tentativeEstLdLcl: string; // 参考予測着陸時刻 LOCAL
    tentativeEstLdCd: string; // 参考予測着陸時刻コード
    equipment: string; // 機種コード
    shipNextCasFltNo: string; // 次接続便(機材) カジュアル便名
    legCnlFlg: boolean;
  } | null;
  dep: {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string | null;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
    lstLasApoCd: string;
    intDomCat: string;
    atdLcl: string;
    actToLcl: string;
    skdlNonskdlCat: string;
    omAlCd: string;
    isOal: boolean;
    equipment: string; // 機種コード
    shipfromCasFltNo: string; // 前接続便(機材) カジュアル便名
    legCnlFlg: boolean;
  } | null;
  isMask: boolean; // マスク有無
  isCancel: boolean; // キャンセル便
  isDivAtbOrgApo: boolean; // 到着便DIV/ATB（行かなくなった元々の空港） のフラグ
  sortArrDate: string; // Sort用Arr日付
  sortDepDate: string; // Sort用Dep日付
  sortGroupNo: number; // Sort用ArrグループNo（ソート時に使用）
  sortArrGroupNo: number; // Sort用ArrグループNo
  sortDepGroupNo: number; // Sort用DepグループNo
  sortXtaLcl: string; // Sort用XTA
  sortXtdLcl: string; // Sort用XTD
  sortArrFlt: string; // Sort用Arr便名
  sortDepFlt: string; // Sort用Dep便名
  orgXtaLcl: string; // 紐づいている便情報の元々のXTA
  orgXtdLcl: string; // 紐づいている便情報の元々のXTD
  xtaLcl: string; // XTA（Jsonデータ）
  xtdLcl: string; // XTD（Jsonデータ）
  shipNo: string; // SpotNo
  spotNo: string; // スポット番号
  arrSpecialStsesData: SpecialStses; // ARR 特別ステータス
  arrSpecialStsDly: string; // ARR 特別ステータス（日跨りDLY）
  arrSpecialStsSpcUpdateTime: dayjs.Dayjs | null; // ARR 特別ステータス（SPC最終更新日時）
  arrFisFltSts: string; // ARR FIS Status
  arrAcarsFlg: boolean; // ARR ACARSステータス表示フラグ
  arrRmksText: string; // ARR 到着便リマークス
  arrRmksText_label: string; // ARR 到着便リマークスのラベル
  arrStaLcl: string; // ARR STA
  arrAtaLcl: string; // ARR ATA
  arrEtaLdLcl: string; // ARR ETAおよびL/D
  arrEtaLdLcl_label: string; // ARR ETAおよびL/Dのラベル
  arrEtaCd: string; // ARR ETA公開コード
  arrInFltSign: boolean; // ARR 飛行中フラグ
  arrAlCd: string; // ARR 便名（航空会社コード）
  arrFltNo: string; // ARR 便名（便番号）
  arrCasFltNo: string; // ARR 便名（カジュアル便名）
  arrCsSign: boolean; // ARR 便名（C/Sサイン）
  arrOmAlCd: string; // ARR OMコード
  arrOrgApoCd: string; // ARR 始発空港
  arrRefPaxTtlCnt: number | null; // ARR 参照”合計旅客数
  arrRefPaxTtlCnt_label: string; // ARR 参照”合計旅客数のラベル
  arrFromCat: number; // ARR FROM〜表示区分 1:Nomal 2:Cross Icon -1:Err(Not Decided)
  arrFromAlCd: string; // ARR FROM〜表示用 バーチャート共通
  arrFromFltNo: string; // ARR FROM〜表示用 バーチャート共通
  arrFromCasFltNo: string; // ARR FROM〜表示用 バーチャート共通
  arrFromDateLcl: string; // ARR FROM〜表示用
  arrDlyInfo: FisApi.ArrDlyInfo[]; // 到着遅延情報
  depSpecialStsesData: SpecialStses; // DEP 特別ステータス
  depSpecialStsDly: string; // DEP 特別ステータス（日跨りDLY）
  depSpecialStsSpcUpdateTime: dayjs.Dayjs | null; // DEP 特別ステータス（SPC最終更新日時）
  depFisFltSts: string; // DEP FIS Status
  depAcarsFlg: boolean; // DEP ACARSステータス表示フラグ
  depRmksText: string; // DEP 出発便リマークス
  depRmksText_label: string; // DEP 出発便リマークスのラベル
  depStdLcl: string; // DEP STD
  depToLcl: string; // DEP T/O
  depEtdAtdLcl: string; // DEP ETDおよびATD
  depEtdAtdLcl_label: string; // DEP ETDおよびATD のラベル
  depEtdCd: string; // DEP ETD公開コード
  depAlCd: string; // DEP 便名（航空会社コード）
  depFltNo: string; // DEP 便名（便番号）
  depCasFltNo: string; // DEP 便名（カジュアル便名）
  depCsSign: boolean; // DEP 便名（C/Sサイン）
  depOmAlCd: string; // DEP OMコード
  depDstApoCd: string; // DEP 最終目的空港
  depRefPaxTtlCnt: number | null; // DEP 参照”合計旅客数
  depRefPaxTtlCnt_label: string; // DEP 参照”合計旅客数のラベル
  depNextCat: number; // DEP NEXT〜表示区分 1:Nomal 2:Cross Icon -1:Err(Not Decided)
  depNextAlCd: string; // DEP NEXT〜表示用 バーチャート共通
  depNextFltNo: string; // DEP NEXT〜表示用 バーチャート共通
  depNextCasFltNo: string; // DEP NEXT〜表示用 バーチャート共通
  depNextDateLcl: string; // DEP NEXT〜表示用
  depDlyInfo: FisApi.DepDlyInfo[]; // 出発遅延情報
  gndShipNo1: string; // GND SHIP NO
  gndShipNo2: string; // GND SHIP NO
  gndSeatConfCd: string; // GND CONF
  gndWingletFlg: boolean; // GND ウイングレット
  gndSpotNo: string; // GND スポット番号
  gndDepGateNo: string; // GND ゲート番号
  gndDepGateNo_label: string; // GND ゲート番号のラベル
  gndWorkStepFlg: boolean; // GND 作業工程存在フラグ
  gndLstTaskSts: string; // GND 最新標準作業工程状況
  boTime: string; // GND 出発時刻
  gndAcceptanceSts: string; // GND チェックインステータス
  gndBoardingSts: string; // GND ゲートステータス
  gndLsFlg: boolean; // GND ロードシート送信状況
  gndRampFuelLbsWt: string; // GND 搭載燃料量
  gndFuelOrderFlg: boolean; // GND FuelOrderフラグ
  dgtShortFlg: boolean; // DGT Shortフラグ
  estGndTime: string; // 予定地上作業時間
}

export interface SpecialStses {
  specialSts: SpecialSts[];
}

export interface SpecialSts {
  level: string;
  status: string;
  eventStatusFlg: boolean;
  delStatusAtdSetFlg: boolean;
  ntfArrDepCd: string;
  updateTimeUtc: string | null;
}

export type TimeScale = "4" | "8" | "12";

const initialState: MyScheduleState = {
  timeChartState: {
    employeeNumber: "",
    familyName: "",
    firstName: "",
    iataAirport: "",
    workDate: "",
    workStartTime: "",
    workEndTime: "",
    changeNoticeStatus: false,
    changeNotice: "",
    taskInformation: [],
  },
  selectedTaskId: null,
  fisState: null,
  dtlSchedule: {
    taskId: null,
    taskName: "",
    taskStartStatus: false,
    taskEndStatus: false,
    taskClassColor: "",
    taskBackColor: "",
    taskFontColor: "",
    taskStartTime: "",
    taskEndTime: "",
    originDateLocal: "",
    carrierCodeIata: "",
    fltNumber: "",
    casualFltNumber: "",
    skdDepAirportCode: "",
    skdArrAirportCode: "",
    skdLegSerial: 0,
    depArrType: "",
    sameWorkerInformation: [],
    gateNo: "",
    spotNo: "",
  },
  timeScale: storage.terminalCat === Const.TerminalCat.pc ? "8" : "4",
  isShowContent: false,
  isUpdate: false,
  isFetching: false,
};

/**
 * 日時に対し指定時間を加算しxta、xtdと同形式で返す
 */
function getRangeLcl({ targetDate, hours }: { targetDate: string; hours: number | undefined | null }): string {
  if (targetDate && hours !== undefined && hours !== null) {
    // 当時午前０時を取得する
    const apoLcl = dayjs(targetDate);
    const baseDate = dayjs([apoLcl.year(), apoLcl.month(), apoLcl.date()]);
    if (hours < 0) {
      return baseDate.add(hours, "hours").format("YYYY-MM-DDTHH:mm:ss");
    }
    if (hours > 0) {
      return baseDate.add(1, "days").add(hours, "hours").format("YYYY-MM-DDTHH:mm:ss");
    }
    return baseDate.format("YYYY-MM-DDTHH:mm:ss");
  }
  return "";
}

async function getMyScheduleFis(dispatch: AppDispatch, taskInformation: MyScheduleApi.TaskInformation, myApoCd: string, master: Master) {
  try {
    dispatch(fetchStartGetMyScheduleFis());
    let fisState: FisState | null = null;
    let fisRow: FisRow | null = null;
    if (
      taskInformation.originDateLocal &&
      taskInformation.carrierCodeIata &&
      taskInformation.fltNumber &&
      taskInformation.skdArrAirportCode &&
      taskInformation.skdDepAirportCode
    ) {
      // FIS情報取得
      const params: MyScheduleFisApi.Request = {
        apoCd: myApoCd,
        orgDateLcl: taskInformation.originDateLocal,
        alCd: taskInformation.carrierCodeIata,
        fltNo: taskInformation.fltNumber,
        casFltNo: "",
        skdDepApoCd: taskInformation.skdDepAirportCode,
        skdArrApoCd: taskInformation.skdArrAirportCode,
        skdLegSno: taskInformation.skdLegSerial,
        autoReload: false,
        depArrType: taskInformation.depArrType,
      };
      const response: AxiosResponse<MyScheduleFisApi.Response> = await WebApi.getMyScheduleFis(dispatch, params);
      const { fis, timeLcl, apoCd, apoDetail } = response.data;
      const timeLclDayjs = dayjs(timeLcl);

      if (fis.length > 0) {
        const fisRes: MyScheduleFisApi.Fis = { ...fis[0] };
        const newTargetDate = getTimeDateString(timeLcl, "YYYY-MM-DD");

        let acarsStsList: AcarsStatus.AcarsSts[] | null = null;
        let shipNoToAcarsSts: Record<string, string> = {};
        if (fisRes.arrDepCtrl.shipNo) {
          try {
            const responseA: AxiosResponse<AcarsStatus.Response> = await WebApi.getAcarsStatus(dispatch, {
              shipNo: fisRes.arrDepCtrl.shipNo,
            });
            const acarsData = responseA.data;
            acarsStsList = acarsData ? acarsData.acars : null;
            if (acarsStsList) {
              shipNoToAcarsSts = acarsStsList.reduce((a, { shipNo, acarsSts }) => ({ ...a, [shipNo]: acarsSts }), {});
            }
          } catch (err) {
            if (!(err instanceof ApiError && err.response && err.response.status === 404)) {
              throw err;
            }
          }
        }

        let dispRangeFrom: number | null = null;
        let dispRangeTo: number | null = null;
        let dispRangeFromLcl = "";
        let dispRangeToLcl = "";
        if (apoDetail) {
          dispRangeFrom = apoDetail.dispRangeFrom;
          dispRangeTo = apoDetail.dispRangeTo;
          dispRangeFromLcl = getRangeLcl({ targetDate: newTargetDate, hours: dispRangeFrom });
          dispRangeToLcl = getRangeLcl({ targetDate: newTargetDate, hours: dispRangeTo });
        }
        const { depArrType } = taskInformation;
        fisRow = createFisRow(apoCd, fisRes.arrDepCtrl, fisRes.arr, fisRes.dep, dispRangeFromLcl, dispRangeToLcl, master, depArrType);
        fisState = {
          timeLclDayjs,
          timeLcl,
          apoCd,
          apoDetail,
          fisRow,
          depArrType,
          dispRangeFromLcl,
          dispRangeToLcl,
          acarsStsList,
          shipNoToAcarsSts,
        };
      }
    }

    dispatch(
      fetchSuccessGetDtlSchedule({
        selectedTaskId: taskInformation.taskId,
        dtlSchedule: {
          ...{
            ...taskInformation,
            gateNo: fisRow ? fisRow.gndDepGateNo : "",
            spotNo: fisRow ? fisRow.gndSpotNo : "",
          },
        },
        fisState,
      })
    );
  } catch (error) {
    dispatch(fetchFailureGetMyScheduleFis());
  }
}

function getSelectTask(taskInformation: MyScheduleApi.TaskInformation[]) {
  let dtlTask: MyScheduleApi.TaskInformation | undefined;

  // 前回終了時に選択したタスクを選択状態とする。
  if (storage.myScheduleSaveTask) {
    dtlTask = taskInformation.find((sdl) => sdl.taskId === storage.myScheduleSaveTask);
  }

  // 所属する空港のローカル時刻で「現在日時が含まれる」タスクを選択状態とする。
  if (!dtlTask) {
    dtlTask = taskInformation.find((sdl) => dayjs().isBetween(sdl.taskStartTime, sdl.taskEndTime, "minute", "[)"));
  }

  // 「現在日時から開始日時が最も近い未来のタスク」を選択状態とする。
  if (!dtlTask) {
    dtlTask = taskInformation.find((sdl) => dayjs().isBefore(sdl.taskStartTime, "minute"));
  }

  // 初回起動時 or 前回終了したタスクが取得したスケジュールに存在しない
  // かつ、既に終了しているタスクしかない場合は、一番後ろのタスクを選択状態とする。
  if (!dtlTask) {
    dtlTask = taskInformation[taskInformation.length - 1];
  }

  return dtlTask;
}

/**
 * JSONからFisRowのデータを生成する
 */
function createFisRow(
  apoCd: string,
  orgArrDepCtrl: CommonApi.ArrDepCtrl,
  orgArr: MyScheduleFisApi.Arr | undefined,
  orgDep: MyScheduleFisApi.Dep | undefined,
  dispRangeFromLcl: string,
  dispRangeToLcl: string,
  master: Master,
  depArrType: "D" | "A" | ""
): FisRow {
  let isCancel = false;
  let isDivAtbOrgApo = false; // 到着便DIV/ATB（行かなくなった元々の空港） のフラグ
  let orgXtaLcl = "";
  let orgXtdLcl = "";
  let xtaLcl = "";
  let xtdLcl = "";
  let arrFromCat = 0;
  let arrFromAlCd = "";
  let arrFromFltNo = "";
  let arrFromCasFltNo = "";
  let arrFromDateLcl = "";
  let depNextCat = 0;
  let depNextAlCd = "";
  let depNextCasFltNo = "";
  let depNextFltNo = "";
  let depNextDateLcl = "";
  // ////////////////////////////////
  // 元データの編集
  // ////////////////////////////////

  // 元データをコピーしておく
  const arrDepCtrl = { ...orgArrDepCtrl };
  let arr: MyScheduleFisApi.Arr | undefined;
  let dep: MyScheduleFisApi.Dep | undefined;
  if (orgArr) {
    arr = { ...orgArr };
  }
  if (orgDep) {
    dep = { ...orgDep };
  }

  // 物理シリアル（データが正しければ不要だが）
  if (!arrDepCtrl.arrInfoLegPhySno) {
    arr = undefined;
  }
  if (!arrDepCtrl.depInfoLegPhySno) {
    dep = undefined;
  }

  // FIS非表示フラグがFALSEの場合は便が存在しないものとみなす
  if (arr && arr.fisHideFlg) {
    arr = undefined;
  }
  if (dep && dep.fisHideFlg) {
    dep = undefined;
  }

  // ARRキャンセル便
  if (arr && arr.legCnlFlg) {
    isCancel = true;
    // ATAはないもの（非表示）とみなす
    arr.ataLcl = "";
    // DEPのTowing は非表示にする
    arr.shipNextAlCd = "";
    arr.shipNextFltNo = "";
    arr.shipNextOrgDateLcl = "";
  }

  // DEPキャンセル便
  if (dep && dep.legCnlFlg) {
    isCancel = true;
    // T/O はないもの（非表示）とみなす
    dep.actToLcl = "";
    // ARRのTowing は非表示にする
    dep.shipfromAlCd = "";
    dep.shipfromFltNo = "";
    dep.shipfromOrgDateLcl = "";
  }

  // 到着便DIV/ATB（行かなくなった元々の空港）
  if (arr && (arr.divFlg || arr.atbFlg) && apoCd !== arr.lstArrApoCd) {
    isDivAtbOrgApo = true;
    // ATAはないもの（非表示）とみなす
    arr.ataLcl = "";
    // STAがある場合のみ、ETAおよびL/D はないもの（非表示）とみなす
    if (arr.staLcl) {
      arr.actLdLcl = "";
      arr.estLdLcl = "";
      arr.tentativeEtaLcl = "";
      arr.etaLcl = "";
    }
    // DEP はなしにする
    dep = undefined;
    // DEPのTowing は非表示にする
    arr.shipNextAlCd = "";
    arr.shipNextFltNo = "";
    arr.shipNextOrgDateLcl = "";
  }

  // 到着便DIV/ATB（新たに行く事になった空港）
  if (arr && (arr.divFlg || arr.atbFlg) && apoCd === arr.lstArrApoCd) {
    // STAを非表示にする
    arr.staLcl = "";
  }

  // ARR
  if (arr) {
    // XTA取得
    const { ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl } = arr;
    orgXtaLcl = getXtaLcl({ ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl });

    if (depArrType === "A" || (orgXtaLcl >= dispRangeFromLcl && orgXtaLcl <= dispRangeToLcl)) {
      xtaLcl = orgXtaLcl;
    } else {
      // 表示範囲から外れた便は非表示にする
      arrFromCat = 1;
      arrFromAlCd = arr.alCd;
      arrFromFltNo = formatFltNo(arr.fltNo);
      arrFromCasFltNo = arr.casFltNo || "";
      const dateDayjs = dayjs(arr.orgDateLcl, "YYYY-MM-DD");
      if (dateDayjs.isValid()) {
        arrFromDateLcl = dateDayjs.format("DDMMM").toUpperCase();
      }
      arr = undefined;
      xtaLcl = "";
    }
  }
  // DEP
  if (dep) {
    // XTD取得
    const { atdLcl, tentativeEtdLcl, etdLcl, stdLcl } = dep;
    orgXtdLcl = getXtdLcl({ atdLcl, tentativeEtdLcl, etdLcl, stdLcl });

    if (depArrType === "D" || (orgXtdLcl >= dispRangeFromLcl && orgXtdLcl <= dispRangeToLcl)) {
      xtdLcl = orgXtdLcl;
    } else {
      // 表示範囲から外れた便は非表示にする
      depNextCat = 1;
      depNextAlCd = dep.alCd;
      depNextFltNo = formatFltNo(dep.fltNo);
      depNextCasFltNo = dep.casFltNo || "";
      const dateDayjs = dayjs(dep.orgDateLcl, "YYYY-MM-DD");
      if (dateDayjs.isValid()) {
        depNextDateLcl = dateDayjs.format("DDMMM").toUpperCase();
      }
      dep = undefined;
      xtdLcl = "";
    }
  }

  /// ////////////////////////////////
  // FisRowの初期値を設定
  /// ////////////////////////////////
  const fisRow: FisRow = {
    arrDepCtrl /* ここはオリジナルのデータを保持する(いじってはいけない) */,
    arr: arr
      ? {
          orgDateLcl: arr.orgDateLcl,
          alCd: arr.alCd,
          fltNo: arr.fltNo,
          casFltNo: arr.casFltNo ? arr.casFltNo : "",
          skdDepApoCd: arr.skdDepApoCd,
          skdArrApoCd: arr.skdArrApoCd,
          skdLegSno: arr.skdLegSno,
          lstOrgApoCd: arr.lstOrgApoCd,
          intDomCat: arr.intDomCat,
          ataLcl: arr.ataLcl,
          skdlNonskdlCat: arr.skdlNonskdlCat,
          omAlCd: arr.omAlCd,
          isOal: arr.arrInfoCd === "OA2",
          tentativeEstLdLcl: arr.tentativeEstLdLcl,
          tentativeEstLdCd: arr.tentativeEstLdCd,
          equipment: arr.equipment,
          shipNextCasFltNo: arr.shipNextCasFltNo,
          legCnlFlg: arr.legCnlFlg,
        }
      : null,
    dep: dep
      ? {
          orgDateLcl: dep.orgDateLcl,
          alCd: dep.alCd,
          fltNo: dep.fltNo,
          casFltNo: dep.casFltNo ? dep.casFltNo : "",
          skdDepApoCd: dep.skdDepApoCd,
          skdArrApoCd: dep.skdArrApoCd,
          skdLegSno: dep.skdLegSno,
          lstLasApoCd: dep.lstLasApoCd,
          intDomCat: dep.intDomCat,
          atdLcl: dep.atdLcl,
          actToLcl: dep.actToLcl,
          skdlNonskdlCat: dep.skdlNonskdlCat,
          omAlCd: dep.omAlCd,
          isOal: dep.depInfoCd === "OA2",
          equipment: dep.equipment,
          shipfromCasFltNo: dep.shipfromCasFltNo,
          legCnlFlg: dep.legCnlFlg,
        }
      : null,
    isMask: false,
    isCancel,
    isDivAtbOrgApo,
    sortArrDate: "",
    sortDepDate: "",
    sortGroupNo: 0,
    sortArrGroupNo: 0,
    sortDepGroupNo: 0,
    sortXtaLcl: "",
    sortXtdLcl: "",
    sortArrFlt: "",
    sortDepFlt: "",
    orgXtaLcl,
    orgXtdLcl,
    xtaLcl,
    xtdLcl,
    shipNo: arrDepCtrl.shipNo,
    spotNo: arrDepCtrl.spotNo,
    arrSpecialStsesData: { specialSts: [] },
    arrSpecialStsDly: "",
    arrSpecialStsSpcUpdateTime: null,
    arrFisFltSts: "",
    arrAcarsFlg: false,
    arrRmksText: "",
    arrRmksText_label: "",
    arrStaLcl: "",
    arrAtaLcl: "",
    arrEtaLdLcl: "",
    arrEtaLdLcl_label: "",
    arrEtaCd: "",
    arrInFltSign: false,
    arrAlCd: "",
    arrFltNo: "",
    arrCasFltNo: "",
    arrCsSign: false,
    arrOmAlCd: "",
    arrOrgApoCd: "",
    arrRefPaxTtlCnt: null,
    arrRefPaxTtlCnt_label: "",
    arrFromCat,
    arrFromAlCd,
    arrFromFltNo,
    arrFromCasFltNo,
    arrFromDateLcl,
    arrDlyInfo: [],
    depSpecialStsesData: { specialSts: [] },
    depSpecialStsDly: "",
    depSpecialStsSpcUpdateTime: null,
    depFisFltSts: "",
    depAcarsFlg: false,
    depRmksText: "",
    depRmksText_label: "",
    depStdLcl: "",
    depToLcl: "",
    depEtdAtdLcl: "",
    depEtdAtdLcl_label: "",
    depEtdCd: "",
    depAlCd: "",
    depFltNo: "",
    depCasFltNo: "",
    depCsSign: false,
    depOmAlCd: "",
    depDstApoCd: "",
    depRefPaxTtlCnt: null,
    depRefPaxTtlCnt_label: "",
    depNextCat,
    depNextAlCd,
    depNextFltNo,
    depNextCasFltNo,
    depNextDateLcl,
    depDlyInfo: [],
    gndShipNo1: "",
    gndShipNo2: "",
    gndSeatConfCd: "",
    gndWingletFlg: false,
    gndSpotNo: "",
    gndDepGateNo: "",
    gndDepGateNo_label: "",
    gndWorkStepFlg: false,
    gndLstTaskSts: "",
    boTime: "",
    gndAcceptanceSts: "",
    gndBoardingSts: "",
    gndLsFlg: false,
    gndRampFuelLbsWt: "",
    gndFuelOrderFlg: false,
    dgtShortFlg: false,
    estGndTime: "",
  };

  /// ////////////////////////////////
  // FisRowの編集
  /// ////////////////////////////////

  // マスク
  if ((dep && dep.actToLcl) || (arr && arr.ataLcl && !dep)) {
    fisRow.isMask = true;
  }

  // ARR
  if (arr) {
    // 特別ステータス
    if (arr.specialSts) {
      try {
        fisRow.arrSpecialStsesData = JSON.parse(arr.specialSts) as SpecialStses; // 特別ステータスのstringをJsonに変換
        // 到着便DIV/ATB（行かなくなった元々の空港）の場合、到着のSPCは非表示にする
        if (isDivAtbOrgApo) {
          fisRow.arrSpecialStsesData.specialSts = fisRow.arrSpecialStsesData.specialSts.filter(
            (s) => !(s.ntfArrDepCd === "ARR" && s.status === "SPC")
          );
        }
        // 日跨りDLYのステータスを取得する
        const dly = fisRow.arrSpecialStsesData.specialSts.find((s) => s.ntfArrDepCd === "ARR" && s.level === "-1");
        fisRow.arrSpecialStsDly = dly ? dly.status : "";
        // 到着のSPCの最終更新日時を取得する
        fisRow.arrSpecialStsSpcUpdateTime = fisRow.arrSpecialStsesData.specialSts
          .filter((s) => s.ntfArrDepCd === "ARR" && s.status === "SPC" && s.updateTimeUtc)
          .map((s) => dayjs.utc(s.updateTimeUtc))
          .reduce<dayjs.Dayjs | null>((p, c) => (c.isValid() && (!p || c.isAfter(p)) ? c : p), null);
      } catch (err) {
        console.error(err, arr.specialSts);
      }
    }
    // FIS Status
    fisRow.arrFisFltSts = arr.fisFltSts;
    // 到着便リマークス
    fisRow.arrRmksText = arr.rmksText;
    fisRow.arrRmksText_label = "Remarks";
    // STA
    if (arr.staLcl) {
      fisRow.arrStaLcl = dayjs(arr.staLcl).format("HHmm");
    }
    // ATA
    if (arr.ataLcl) {
      fisRow.arrAtaLcl = dayjs(arr.ataLcl).format("HHmm");
    }
    // ETAおよびL/D
    if (arr.actLdLcl) {
      fisRow.arrEtaLdLcl = dayjs(arr.actLdLcl).format("HHmm");
      fisRow.arrEtaLdLcl_label = "L/D";
    } else if (arr.tentativeEstLdLcl) {
      fisRow.arrEtaLdLcl = dayjs(arr.tentativeEstLdLcl).format("HHmm");
      fisRow.arrEtaLdLcl_label = "ETA";
      fisRow.arrEtaCd = arr.tentativeEstLdCd;
    } else if (arr.estLdLcl) {
      fisRow.arrEtaLdLcl = dayjs(arr.estLdLcl).format("HHmm");
      fisRow.arrEtaLdLcl_label = "ETA";
    } else if (arr.tentativeEtaLcl) {
      fisRow.arrEtaLdLcl = dayjs(arr.tentativeEtaLcl).format("HHmm");
      fisRow.arrEtaLdLcl_label = "ETA";
      fisRow.arrEtaCd = arr.tentativeEtaCd;
    } else if (arr.etaLcl) {
      if (arr.etaLcl === arr.staLcl) {
        fisRow.arrEtaLdLcl = "SKD";
      } else {
        fisRow.arrEtaLdLcl = dayjs(arr.etaLcl).format("HHmm");
      }
      fisRow.arrEtaLdLcl_label = "ETA";
    }
    // 飛行中フラグ
    if ((arr.estLdLcl || arr.tentativeEstLdLcl) && !arr.actLdLcl) {
      fisRow.arrInFltSign = true;
    }
    // 便名（航空会社コード）
    fisRow.arrAlCd = arr.alCd;
    if (arr.fltNo) {
      fisRow.arrFltNo = formatFltNo(arr.fltNo);
    }
    // 便名（カジュアル便名）
    if (arr.casFltNo) {
      fisRow.arrCasFltNo = arr.casFltNo;
    }
    // 便名（C/Sサイン）
    if (arr.csCnt > 0) {
      fisRow.arrCsSign = true;
    }
    // OMコード
    if (arr.alCd !== arr.omAlCd) {
      fisRow.arrOmAlCd = arr.omAlCd || "";
    }
    // 始発空港
    if (isCancel) {
      fisRow.arrOrgApoCd = arr.lstDepApoCd;
    } else {
      fisRow.arrOrgApoCd = arr.lstOrgApoCd;
    }
    // 参照合計旅客数
    if (arr.refPaxTtlCnt !== undefined && arr.refPaxTtlCnt !== null) {
      fisRow.arrRefPaxTtlCnt = arr.refPaxTtlCnt;
      fisRow.arrRefPaxTtlCnt_label = "PAX";
    }
  }
  // DEP
  if (dep) {
    // 特別ステータス
    if (dep.specialSts) {
      try {
        fisRow.depSpecialStsesData = JSON.parse(dep.specialSts) as SpecialStses; // 特別ステータスのstringをJsonに変換
        // 日跨りDLYのステータスを取得する
        const dly = fisRow.depSpecialStsesData.specialSts.find((s) => s.ntfArrDepCd === "DEP" && s.level === "-1");
        fisRow.depSpecialStsDly = dly ? dly.status : "";
        // 出発のSPCの最終更新日時を取得する
        fisRow.depSpecialStsSpcUpdateTime = fisRow.depSpecialStsesData.specialSts
          .filter((s) => s.ntfArrDepCd === "DEP" && s.status === "SPC" && s.updateTimeUtc)
          .map((s) => dayjs.utc(s.updateTimeUtc))
          .reduce<dayjs.Dayjs | null>((p, c) => (c.isValid() && (!p || c.isAfter(p)) ? c : p), null);
      } catch (err) {
        console.error(err, dep.specialSts);
      }
    }
    // FIS Status
    fisRow.depFisFltSts = dep.fisFltSts;
    // 出発便リマークス
    fisRow.depRmksText = dep.rmksText;
    fisRow.depRmksText_label = "Remarks";
    // STD
    if (dep.stdLcl) {
      fisRow.depStdLcl = dayjs(dep.stdLcl).format("HHmm");
    }
    // T/O
    if (dep.actToLcl) {
      fisRow.depToLcl = dayjs(dep.actToLcl).format("HHmm");
    }
    // ETDおよびATD
    if (dep.atdLcl) {
      fisRow.depEtdAtdLcl = dayjs(dep.atdLcl).format("HHmm");
      fisRow.depEtdAtdLcl_label = "ATD";
    } else if (dep.tentativeEtdLcl) {
      fisRow.depEtdAtdLcl = dayjs(dep.tentativeEtdLcl).format("HHmm");
      fisRow.depEtdAtdLcl_label = "ETD";
      fisRow.depEtdCd = dep.tentativeEtdCd;
    } else if (dep.etdLcl) {
      if (dep.etdLcl === dep.stdLcl) {
        fisRow.depEtdAtdLcl = "SKD";
      } else {
        fisRow.depEtdAtdLcl = dayjs(dep.etdLcl).format("HHmm");
      }
      fisRow.depEtdAtdLcl_label = "ETD";
    }
    // 便名（航空会社コード）
    fisRow.depAlCd = dep.alCd;
    if (dep.fltNo) {
      fisRow.depFltNo = formatFltNo(dep.fltNo);
    }
    // 便名（カジュアル便名）
    if (dep.casFltNo) {
      fisRow.depCasFltNo = dep.casFltNo;
    }
    // 便名（C/Sサイン）
    if (dep.csCnt > 0) {
      fisRow.depCsSign = true;
    }
    // OMコード
    if (dep.alCd !== dep.omAlCd) {
      fisRow.depOmAlCd = dep.omAlCd || "";
    }
    // 最終目的空港
    if (isCancel) {
      fisRow.depDstApoCd = dep.lstArrApoCd;
    } else {
      fisRow.depDstApoCd = dep.lstLasApoCd;
    }
    // 参照合計旅客数
    if (dep.refPaxTtlCnt !== undefined && dep.refPaxTtlCnt !== null) {
      fisRow.depRefPaxTtlCnt = dep.refPaxTtlCnt;
      fisRow.depRefPaxTtlCnt_label = "PAX";
    }
  }

  // From 表示対象判定（物理シリアルで判断する => 元々紐づいていない時だけ表示する）
  if (
    dep &&
    !arrDepCtrl.arrInfoLegPhySno &&
    arrDepCtrl.depInfoLegPhySno &&
    arrDepCtrl.arrInfoDispCd &&
    (dep.shipfromAlCd || dep.shipfromCasFltNo)
  ) {
    if (arrDepCtrl.arrInfoDispCd === "APO") {
      fisRow.arrFromCat = -1; // Err(CNX Not Decided)
    } else {
      if (arrDepCtrl.arrInfoDispCd === "SPT") {
        fisRow.arrFromCat = 2; // Cross Icon
      } else {
        fisRow.arrFromCat = 1; // Nomal
      }
      fisRow.arrFromAlCd = dep.shipfromAlCd;
      fisRow.arrFromFltNo = formatFltNo(dep.shipfromFltNo);
      fisRow.arrFromCasFltNo = dep.shipfromCasFltNo;
      const dateDayjs = dayjs(dep.shipfromOrgDateLcl, "YYYY-MM-DD");
      if (dateDayjs.isValid()) {
        fisRow.arrFromDateLcl = dateDayjs.format("DDMMM").toUpperCase();
      }
    }
  }

  // Next 表示対象判定（物理シリアルで判断する => 元々紐づいていない時だけ表示する）
  if (
    arr &&
    !arrDepCtrl.depInfoLegPhySno &&
    arrDepCtrl.arrInfoLegPhySno &&
    arrDepCtrl.depInfoDispCd &&
    (arr.shipNextAlCd || arr.shipNextCasFltNo)
  ) {
    if (arrDepCtrl.depInfoDispCd === "APO") {
      fisRow.depNextCat = -1; // Err(CNX Not Decided)
    } else {
      if (arrDepCtrl.depInfoDispCd === "SPT") {
        fisRow.depNextCat = 2; // Cross Icon
      } else {
        fisRow.depNextCat = 1; // Nomal
      }
      fisRow.depNextAlCd = arr.shipNextAlCd;
      fisRow.depNextFltNo = formatFltNo(arr.shipNextFltNo);
      fisRow.depNextCasFltNo = arr.shipNextCasFltNo;
      const dateDayjs = dayjs(arr.shipNextOrgDateLcl, "YYYY-MM-DD");
      if (dateDayjs.isValid()) {
        fisRow.depNextDateLcl = dateDayjs.format("DDMMM").toUpperCase();
      }
    }
  }

  // 発着工程（SHIP NO等の四角の枠）
  if (isCancel) {
    fisRow.gndShipNo2 = "------";
    fisRow.gndSeatConfCd = "---";
    // 裏データも変更
    fisRow.shipNo = "";
  } else {
    // SHIP NO
    if (arrDepCtrl && arrDepCtrl.shipNo) {
      if (arrDepCtrl.shipNo.slice(0, 2) === "JA") {
        fisRow.gndShipNo1 = arrDepCtrl.shipNo.slice(0, 2);
        fisRow.gndShipNo2 = arrDepCtrl.shipNo.slice(2);
      } else {
        fisRow.gndShipNo2 = arrDepCtrl.shipNo;
      }
      // SHIP NOがない場合、EQP(equipment)を格納
    } else if (dep && dep.equipment) {
      fisRow.gndShipNo2 = dep.equipment;
    } else if (arr && arr.equipment) {
      fisRow.gndShipNo2 = arr.equipment;
    }

    // CONF
    if (((fisRow.arr && fisRow.arr.isOal) || (fisRow.dep && fisRow.dep.isOal)) && arrDepCtrl && arrDepCtrl.shipNo) {
      if (dep && dep.equipment) {
        fisRow.gndSeatConfCd = dep.equipment;
      } else if (arr && arr.equipment) {
        fisRow.gndSeatConfCd = arr.equipment;
      }
    } else if (arrDepCtrl.depInfoLegPhySno && dep && dep.seatConfCd) {
      fisRow.gndSeatConfCd = dep.seatConfCd;
    } else if (arr && arr.seatConfCd) {
      fisRow.gndSeatConfCd = arr.seatConfCd;
    }

    // ウィングレット
    if (dep && dep.wingletFlg !== undefined) {
      fisRow.gndWingletFlg = dep.wingletFlg;
    } else if (arr && arr.wingletFlg !== undefined) {
      fisRow.gndWingletFlg = arr.wingletFlg;
    }
  }

  // 発着工程（SHIP NO等 以外）
  if (isCancel || isDivAtbOrgApo) {
    fisRow.gndSpotNo = "-";
    // ゲート番号は出発便が表示されている場合のみ
    if (dep) {
      fisRow.gndDepGateNo_label = "Gate";
      fisRow.gndDepGateNo = "-";
    }
    // 裏データも変更
    fisRow.spotNo = "";
  } else {
    // SPOT NO
    if (arrDepCtrl && arrDepCtrl.spotNo) {
      fisRow.gndSpotNo = arrDepCtrl.spotNo;
    }
    // ゲート番号
    if (dep) {
      fisRow.gndDepGateNo_label = "Gate";
      if (dep.depGateNo) {
        fisRow.gndDepGateNo = dep.depGateNo;
      }
    }
    // 作業工程存在フラグ、最新標準作業工程状況、残り時間
    if (dep) {
      fisRow.gndWorkStepFlg = true;
      if (dep.actToLcl) {
        fisRow.gndLstTaskSts = " - ";
        fisRow.boTime = "";
      } else {
        // 最初の作業工程が終了していたら時間を表示する
        if (dep.workStep) {
          const workStep = dep.workStep.filter((w) => w.workEndFlg);
          if (workStep.length > 0) {
            fisRow.gndLstTaskSts = workStep[workStep.length - 1].workStepShortName;
          }
        }
        fisRow.boTime = dep.tentativeEtdLcl ? dep.tentativeEtdLcl : dep.etdLcl ? dep.etdLcl : dep.stdLcl;
      }
    }
    if (dep) {
      // チェックインステータス
      fisRow.gndAcceptanceSts = dep.acceptanceSts;
      // ゲートステータス
      fisRow.gndBoardingSts = dep.boardingSts;
      // ロードシート送信状況
      fisRow.gndLsFlg = dep.lsFlg;
      // 搭載燃料量、FuelOrderフラグ
      if (dep.rampFuelLbsWt) {
        let gndRampFuelLbsWt = Math.ceil(Number(dep.rampFuelLbsWt) / 100);
        if (gndRampFuelLbsWt % 2 === 1) {
          if (dep.equipment) {
            // 設定を取得（JALグループ便）
            if (fisRow.dep && !fisRow.dep.isOal) {
              // 設定を取得（A350系機種コード）
              const shipTypeDiaCd = dep.equipment;
              const isA350 = master.cdCtrlDtls.some((c) => c.cdCls === "020" && c.cdCat1 === shipTypeDiaCd);
              if (isA350) {
                gndRampFuelLbsWt += 1;
              }
            }
          }
        }
        fisRow.gndRampFuelLbsWt = gndRampFuelLbsWt.toString();
      }
      fisRow.gndFuelOrderFlg = dep.fuelOrderFlg;
    }
  }

  // ACARSステータス表示フラグ
  if (arrDepCtrl.shipNo && !isCancel && !isDivAtbOrgApo) {
    if (arr && !dep) {
      // 到着便のみの場合
      fisRow.arrAcarsFlg = true;
      fisRow.depAcarsFlg = false;
    } else if (!arr && dep) {
      // 出発便のみの場合
      if (!dep.ataLcl) {
        fisRow.arrAcarsFlg = false;
        fisRow.depAcarsFlg = true;
      } else {
        fisRow.arrAcarsFlg = false;
        fisRow.depAcarsFlg = false;
      }
    } else if (arr && dep) {
      // 到着便・出発便ともにある場合
      if (!arr.ataLcl && !dep.atdLcl && !dep.ataLcl) {
        fisRow.arrAcarsFlg = true;
        fisRow.depAcarsFlg = false;
      } else if (arr.ataLcl && !dep.atdLcl && !dep.ataLcl) {
        fisRow.arrAcarsFlg = true;
        fisRow.depAcarsFlg = true;
      } else if (dep.atdLcl && !dep.ataLcl) {
        fisRow.arrAcarsFlg = false;
        fisRow.depAcarsFlg = true;
      } else {
        fisRow.arrAcarsFlg = false;
        fisRow.depAcarsFlg = false;
      }
    }
  }

  // 予定地上作業時間
  if (!(fisRow.xtaLcl && fisRow.xtdLcl)) {
    // XTA、XTDのいずれかが欠けている場合
    fisRow.estGndTime = "";
  } else if (fisRow.dep && fisRow.dep.actToLcl) {
    // 出発便があり、かつT/O済みの場合
    fisRow.estGndTime = "-";
  } else {
    const excessTime = getExcessTime(fisRow.xtaLcl, fisRow.xtdLcl, fisRow.arrDepCtrl.gndTime);
    if (excessTime) {
      // DGTショート時
      fisRow.dgtShortFlg = true;
      fisRow.estGndTime = excessTime;
    } else {
      // 通常時
      fisRow.estGndTime = getGroundTime(fisRow.xtaLcl, fisRow.xtdLcl);
    }
  }

  /// ////////////////////////////=
  // ソート用項目の編集
  /// ////////////////////////////
  // ソート用日付 Arr
  if (fisRow.xtaLcl) {
    fisRow.sortArrDate = dayjs(fisRow.xtaLcl).format("YYYYMMDD");
  } else if (fisRow.xtdLcl) {
    fisRow.sortArrDate = dayjs(fisRow.xtdLcl).format("YYYYMMDD");
  } else {
    fisRow.sortArrDate = "99999999";
  }
  // ソート用日付 Dep
  if (fisRow.xtdLcl) {
    fisRow.sortDepDate = dayjs(fisRow.xtdLcl).format("YYYYMMDD");
  } else if (fisRow.xtaLcl) {
    fisRow.sortDepDate = dayjs(fisRow.xtaLcl).format("YYYYMMDD");
  } else {
    fisRow.sortDepDate = "99999999";
  }
  // ARRグループNo
  if (!fisRow.xtaLcl) {
    // ⑤XTAが無い場合
    fisRow.sortArrGroupNo = 5;
  } else if (arr) {
    if (arr.legCnlFlg || isDivAtbOrgApo) {
      // ④CNL区間、またはDIV/ATBで来なくなった区間
      fisRow.sortArrGroupNo = 4;
    } else if (arr.ataLcl) {
      // ①ATA設定済み
      fisRow.sortArrGroupNo = 1;
    } else if (arr.actLdLcl) {
      // ②L/D設定済み
      fisRow.sortArrGroupNo = 2;
    } else {
      // ③ETAまたはSTA設定済み
      fisRow.sortArrGroupNo = 3;
    }
  }
  // DEPグループNo
  if (!fisRow.xtdLcl) {
    // ⑤XTDが無い場合
    fisRow.sortDepGroupNo = 5;
  } else if (dep) {
    if (dep.legCnlFlg) {
      // ④CNL区間
      fisRow.sortDepGroupNo = 4;
    } else if (dep.actToLcl) {
      // ①T/O設定済み
      fisRow.sortDepGroupNo = 1;
    } else if (dep.atdLcl) {
      // ②ATD設定済み
      fisRow.sortDepGroupNo = 2;
    } else {
      // ③ETDまたはSTD設定済み
      fisRow.sortDepGroupNo = 3;
    }
  }
  // ソート用XTA
  if (fisRow.xtaLcl) {
    fisRow.sortXtaLcl = dayjs(fisRow.xtaLcl).format("YYYYMMDDHHmmss");
  } else if (fisRow.xtdLcl) {
    fisRow.sortXtaLcl = dayjs(fisRow.xtdLcl).format("YYYYMMDDHHmmss");
  } else {
    fisRow.sortXtaLcl = "99999999999999";
  }
  // ソート用XTD
  if (fisRow.xtdLcl) {
    fisRow.sortXtdLcl = dayjs(fisRow.xtdLcl).format("YYYYMMDDHHmmss");
  } else if (fisRow.xtaLcl) {
    fisRow.sortXtdLcl = dayjs(fisRow.xtaLcl).format("YYYYMMDDHHmmss");
  } else {
    fisRow.sortXtdLcl = "99999999999999";
  }
  // ソート用Arr便名
  if (arr && arr.alCd) {
    fisRow.sortArrFlt = `${arr.alCd} `.slice(0, 3) + arr.fltNo;
  } else {
    fisRow.sortArrFlt = "ZZZZZZZ";
  }
  // ソート用Dep便名
  if (dep && dep.alCd) {
    fisRow.sortDepFlt = `${dep.alCd} `.slice(0, 3) + dep.fltNo;
  } else {
    fisRow.sortDepFlt = "ZZZZZZZ";
  }

  return fisRow;
}

/**
 * 1. 開始時間（昇順）
 * 2. 終了時間（昇順）
 * 3. タスク名（昇順）
 * にソートする
 *
 * @param mySchedule
 */
function sortMySchedule(mySchedule: MyScheduleApi.TaskInformation[]) {
  mySchedule.sort((a, b) => {
    // 1.開始時間
    if (dayjs(a.taskStartTime).isBefore(b.taskStartTime)) return -1;
    if (dayjs(a.taskStartTime).isAfter(b.taskStartTime)) return 1;

    // 2.終了時間
    if (dayjs(a.taskEndTime).isAfter(b.taskEndTime)) return -1;
    if (dayjs(a.taskEndTime).isBefore(b.taskEndTime)) return 1;

    // 3.タスク名
    if (a.taskName.toString().toLowerCase() > b.taskName.toString().toLowerCase()) return 1;
    if (a.taskName.toString().toLowerCase() < b.taskName.toString().toLowerCase()) return -1;

    return 0;
  });
  return mySchedule;
}

export function showInfoNoData() {
  return (dispatch: AppDispatch) => {
    NotificationCreator.removeAll({ dispatch });
    NotificationCreator.create({ dispatch, message: SoalaMessage.M30003C() });
  };
}

/**
 * My Schedule画面 データ取得
 * @returns
 */
export const getMyScheduleInfo = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "mySchedule/getMyScheduleInfo",
  async (_arg, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    try {
      dispatch(fetchStartGetMySchedule());

      const { master, jobAuth } = getState().account;
      const params: MyScheduleApi.Get.Request = {
        apoCd: jobAuth.user.myApoCd,
      };

      if (params.apoCd) {
        void dispatch(getHeaderInfo({ apoCd: params.apoCd }));

        const response = await WebApi.getMySchedule(dispatch, params);
        const { staffAssignInformation, commonHeader } = response.data;
        const { taskInformation } = staffAssignInformation;

        if (taskInformation.length === 0 || commonHeader.dataCount === 0) {
          dispatch(fetchSuccessGetMySchedule({ timeChartState: staffAssignInformation }));
          dispatch(showInfoNoData());
        } else {
          const newTaskInformation = sortMySchedule(taskInformation.map((data) => data));
          Object.assign(staffAssignInformation, {
            taskInformation: newTaskInformation,
          });
          dispatch(fetchSuccessGetMySchedule({ timeChartState: staffAssignInformation }));
          await getMyScheduleFis(dispatch, getSelectTask(newTaskInformation), params.apoCd, master);
          dispatch(initLoadEnd());
        }
      } else {
        dispatch(clear());
      }
    } catch (err) {
      dispatch(fetchFailureGetMySchedule());
      console.log(err);
    }
  }
);

// /**
//  * タスク選択処理
//  * @param taskInformation
//  * @returns
//  */
export const changeActiveDetailTask = createAsyncThunk<
  void,
  {
    taskInformation: MyScheduleApi.TaskInformation;
  },
  { dispatch: AppDispatch; state: RootState }
>("mySchedule/changeActiveDetailTask", async (arg, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  const { taskInformation } = arg;
  const { master, jobAuth } = getState().account;
  const { myApoCd } = jobAuth.user;
  await getMyScheduleFis(dispatch, taskInformation, myApoCd, master);
});

/**
 * My Schedule更新
 * @param params
 * @returns
 */
export const updateMyScheduleInfo = createAsyncThunk<
  void,
  {
    params: MyScheduleApi.Post.Request;
  },
  { dispatch: AppDispatch; state: RootState }
>("mySchedule/updateMyScheduleInfo", async (arg, thunkAPI) => {
  const { dispatch, getState } = thunkAPI;
  const { params } = arg;
  try {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(updateStart());
    const { master, jobAuth } = getState().account;
    const { myApoCd } = jobAuth.user;

    // MySchedule情報を更新する。
    const response: AxiosResponse<MyScheduleApi.Post.Response> = await WebApi.postMySchedule(dispatch, params);
    const { staffAssignInformation, commonHeader } = response.data;
    const { taskInformation } = staffAssignInformation;

    if (taskInformation.length === 0 || commonHeader.dataCount === 0) {
      dispatch(fetchSuccessGetMySchedule({ timeChartState: staffAssignInformation }));
      dispatch(updateEnd());
      dispatch(showInfoNoData());
    } else {
      const newTaskInformation = sortMySchedule(taskInformation.map((data) => data));
      Object.assign(staffAssignInformation, {
        taskInformation: newTaskInformation,
      });
      dispatch(fetchSuccessGetMySchedule({ timeChartState: staffAssignInformation }));

      const updateTask = taskInformation.find((task) => task.taskId === params.taskId);
      // 更新対象タスクがレスポンスからなくなった場合、「前回終了時に選択したタスクが取得したスケジュールにない場合、またはシステム初回起動時」のタスク選択制御とする。
      if (!updateTask) {
        await getMyScheduleFis(dispatch, getSelectTask(newTaskInformation), myApoCd, master);
      } else {
        await getMyScheduleFis(dispatch, updateTask, myApoCd, master);
      }
      dispatch(updateEnd());
    }
  } catch (error) {
    console.error(error);
    dispatch(fetchFailureUpdateMySchedule());
  }
});

export const slice = createSlice({
  name: "mySchedule",
  initialState,
  reducers: {
    clear: (state) => {
      storage.myScheduleSaveTask = undefined;
      Object.assign(state, initialState);
    },
    fetchStartGetMySchedule: (state) => {
      Object.assign(state, {
        isFetching: true,
      });
    },
    fetchStartGetMyScheduleFis: (state) => {
      Object.assign(state, {
        isFetching: true,
      });
    },
    fetchSuccessGetDtlSchedule: (
      state,
      action: PayloadAction<{
        selectedTaskId: number | null;
        dtlSchedule: DetailScheduleState;
        fisState: FisState | null;
      }>
    ) => {
      Object.assign(state, {
        selectedTaskId: action.payload.selectedTaskId,
        dtlSchedule: {
          ...state.dtlSchedule,
          ...action.payload.dtlSchedule,
        },
        fisState: action.payload.fisState,
        isFetching: false,
      });
    },
    fetchSuccessGetMySchedule: (
      state,
      action: PayloadAction<{
        timeChartState: MyScheduleApi.StaffAssignInformation;
      }>
    ) => {
      if (action.payload.timeChartState.taskInformation.length === 0) {
        Object.assign(state, {
          timeChartState: {
            ...state.timeChartState,
            ...action.payload.timeChartState,
          },
          fisState: initialState.fisState,
          dtlSchedule: initialState.dtlSchedule,
          selectedTaskId: initialState.selectedTaskId,
          isShowContent: false,
          isFetching: false,
        });
      } else {
        Object.assign(state, {
          timeChartState: {
            ...action.payload.timeChartState,
            taskInformation: action.payload.timeChartState.taskInformation,
          },
          isFetching: false,
        });
      }
    },
    fetchFailureGetMySchedule: (state) => {
      Object.assign(state, {
        isFetching: false,
      });
    },
    fetchFailureUpdateMySchedule: (state) => {
      Object.assign(state, {
        isUpdate: false,
        isFetching: false,
      });
    },
    fetchFailureGetMyScheduleFis: (state) => {
      Object.assign(state, {
        isUpdate: false,
        isFetching: false,
      });
    },
    changeTimeScale: (
      state,
      action: PayloadAction<{
        timeScale: TimeScale;
      }>
    ) => {
      Object.assign(state, {
        timeScale: action.payload.timeScale,
      });
    },
    closeNotice: (state) => {
      Object.assign(state, {
        timeChartState: {
          ...state.timeChartState,
          changeNoticeStatus: false,
        },
      });
    },
    initLoadEnd: (state) => {
      Object.assign(state, {
        isShowContent: true,
      });
    },
    updateStart: (state) => {
      Object.assign(state, {
        isUpdate: true,
      });
    },
    updateEnd: (state) => {
      Object.assign(state, {
        isUpdate: false,
      });
    },
  },
});

export const {
  clear,
  fetchStartGetMySchedule,
  fetchStartGetMyScheduleFis,
  fetchSuccessGetDtlSchedule,
  fetchSuccessGetMySchedule,
  fetchFailureGetMySchedule,
  fetchFailureUpdateMySchedule,
  fetchFailureGetMyScheduleFis,
  changeTimeScale,
  closeNotice,
  initLoadEnd,
  updateStart,
  updateEnd,
} = slice.actions;

export default slice.reducer;
