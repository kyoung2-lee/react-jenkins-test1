import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import { List } from "immutable";
import cloneDeep from "lodash.clonedeep";
import { ServerConfig } from "../../config/config";
import { Const } from "../lib/commonConst";
import {
  formatFltNo,
  getExcessTime,
  getGroundTime,
  getTimeDateString,
  getTimeDiffUtc,
  getXtaLcl,
  getXtdLcl,
  isAuthExpired,
  isCurrentPath,
} from "../lib/commonUtil";
import { mqtt } from "../lib/IotCore/mqtt";
import { NotificationCreator } from "../lib/notifications";
import { queue } from "../lib/queuing";
import { SoalaMessage } from "../lib/soalaMessages";
import { storage } from "../lib/storage";
import { storageOfUser } from "../lib/StorageOfUser";
import { WebApi } from "../lib/webApi";
import { AppDispatch, RootState } from "../store/storeType";
import { Master, reloadMaster } from "./account";
import { fetchHeaderInfoSuccess, reflectHeaderInfoFromPush, updateHeaderInfoDate } from "./common";
import { FisRow, SpecialStses } from "./fisType";

dayjs.extend(minMax);

export interface FisState {
  headerSettings: HeaderSettings;
  bufferFis: FisApi.Response[];
  arrList: List<FisApi.Arr>;
  depList: List<FisApi.Dep>;
  fisRows: List<FisRow>;
  isFetching: boolean;
  isFetchSecceeded: boolean;
  isSortArrival: boolean;
  isSortAsc: boolean;
  isSortNoTowing: boolean;
  isSortTwoColumnMode: boolean;
  timeStamp: number;
  pullTimeStamp: number;
  apoCd: string;
  timeLclDayjs: dayjs.Dayjs | null;
  timeLcl: string;
  timeDiffUtc: number | null;
  aptRmksText: string;
  targetArea: string;
  dispRangeFrom: number | null; // 表示範囲FROM 時間
  dispRangeTo: number | null; // 表示範囲TO 時間
  dispRangeFromLcl: string; // 表示範囲FROM YYYY-MM-DDTHH:mm:ss 形式
  dispRangeToLcl: string; // 表示範囲TO YYYY-MM-DDTHH:mm:ss 形式
  fisDataRangeFrom: number | null;
  legDataRangeFrom: number | null;
  rwy: {
    LD1: string;
    LD2: string;
    TO1: string;
    TO2: string;
  };
  test_getCount: number; // PUSH通知処理テスト用。本稼働時には不要
  isError: boolean;
  fetchFisResult: Reducer.AsyncResult;
  fetchFisFromPushResult: Reducer.AsyncResult;
  isReload: boolean;
  isApoHasChanged: boolean;
  targetDayDiff: number; // 対象日付からみた本日日付の日数 昨日: -1 本日: 0 翌日: 1となる。
  spotRmksList: SpotRemarksApi.Get.SpotRmks[] | null;
  bufferSpotRmksList: SpotRemarksApi.Get.Response[];
  acarsStsList: AcarsStatus.AcarsSts[] | null;
  bufferAcarsStsList: AcarsStatus.Response[];
  shipNoToAcarsSts: Record<string, string>;
}

export interface HeaderSettings {
  isAutoReload: boolean;
  isSelfScroll: boolean;
}

const initialState: FisState = {
  headerSettings: {
    isAutoReload: false,
    isSelfScroll: false,
  },
  bufferFis: [],
  arrList: List(),
  depList: List(),
  fisRows: List(),
  isFetching: false,
  isFetchSecceeded: false,
  isSortArrival: true,
  isSortAsc: true,
  isSortNoTowing: false,
  isSortTwoColumnMode: false,
  timeStamp: 0,
  pullTimeStamp: 0,
  apoCd: "",
  timeLclDayjs: null,
  timeLcl: "",
  timeDiffUtc: null,
  aptRmksText: "",
  targetArea: "",
  dispRangeFrom: null,
  dispRangeTo: null,
  dispRangeFromLcl: "",
  dispRangeToLcl: "",
  fisDataRangeFrom: null,
  legDataRangeFrom: null,
  rwy: {
    LD1: "",
    LD2: "",
    TO1: "",
    TO2: "",
  },
  test_getCount: 1,
  isError: false,
  fetchFisResult: {
    isError: false,
    retry: null,
  },
  fetchFisFromPushResult: {
    isError: false,
    retry: null,
  },
  isReload: false,
  isApoHasChanged: false,
  targetDayDiff: 0,
  spotRmksList: null,
  bufferSpotRmksList: [],
  acarsStsList: null,
  bufferAcarsStsList: [],
  shipNoToAcarsSts: {},
};

/**
 * JSONからFisRowのデータを生成する
 */
function createFisRow(
  apoCd: string,
  orgArrDepCtrl: CommonApi.ArrDepCtrl,
  orgArr: FisApi.Arr | undefined,
  orgDep: FisApi.Dep | undefined,
  dispRangeFromLcl: string,
  dispRangeToLcl: string,
  master: Master
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
  // const depNextCasFltNo = "";
  let depNextDateLcl = "";
  // /////////////////////////////////
  // 元データの編集
  // /////////////////////////////////

  // 元データをコピーしておく
  const arrDepCtrl = { ...orgArrDepCtrl };
  let arr: FisApi.Arr | undefined;
  let dep: FisApi.Dep | undefined;
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

    if (orgXtaLcl >= dispRangeFromLcl && orgXtaLcl <= dispRangeToLcl) {
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

    if (orgXtdLcl >= dispRangeFromLcl && orgXtdLcl <= dispRangeToLcl) {
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

  // /////////////////////////////////
  // FisRowの初期値を設定
  // /////////////////////////////////
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

  // /////////////////////////////////
  // FisRowの編集
  // /////////////////////////////////

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
    if (!fisRow.isDivAtbOrgApo && (arr.estLdLcl || arr.tentativeEstLdLcl) && !arr.actLdLcl) {
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

  // 到着遅延情報
  if (arr && arr.arrDlyInfo != null && !isCancel && !isDivAtbOrgApo) {
    fisRow.arrDlyInfo = arr.arrDlyInfo;
  }

  // 出発遅延情報
  if (dep && dep.depDlyInfo != null && !isDivAtbOrgApo) {
    fisRow.depDlyInfo = dep.depDlyInfo;
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

  // /////////////////////////////=
  // ソート用項目の編集
  // /////////////////////////////
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

// getCountはPUSH通知処理のテスト用。本稼働時には不要
export const getFisRowsFromPush = createAsyncThunk<void, { getCount: number }, { dispatch: AppDispatch; state: RootState }>(
  "fis/getFisRowsFromPush",
  async (arg, { dispatch, getState }) => {
    const { getCount } = arg;
    if (getCount > 6) {
      return;
    }

    try {
      // console.time('fisPushApi');
      const response = await WebApi.getFisTest(dispatch, {}, getCount);

      // console.timeEnd('fisPushApi');
      const prevTargetDate = getTimeDateString(getState().fis.timeLcl, "YYYY-MM-DD"); // ローカル時間で日替わりを判断する
      const targetDate = getTimeDateString(response.data.timeLcl, "YYYY-MM-DD"); // ローカル時間で日替わりを判断する
      const isDailyUpdate = prevTargetDate < targetDate;
      const { master } = getState().account;

      dispatch(fetchFisFromPushSuccess({ data: response.data, isDailyUpdate, master }));

      // 日付が変わったら対象日付を更新する
      if (isDailyUpdate) {
        dispatch(updateHeaderInfoDate({ targetDate, isToday: true })); // 対象日付に当日を設定
      }
    } catch (err) {
      console.error(err);
    }
  }
);

/**
 * FIS、空港発令情報を取得する
 */
export const getFisHeaderInfo = createAsyncThunk<
  void,
  {
    apoCd: string;
    targetDate: string;
    isToday: boolean;
    beforeApoCd: string;
    beforeTargetDate: string;
    isReload: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>("fis/getFisHeaderInfo", async (arg, { dispatch, getState }) => {
  const { apoCd, targetDate, isToday, beforeApoCd, beforeTargetDate, isReload } = arg;
  storage.switchingAutoReloadOn = false;
  NotificationCreator.removeAll({ dispatch });

  if (apoCd) {
    const { master } = getState().account;
    const isApoHasChanged = apoCd !== beforeApoCd;
    // 空港コードもしくは日付が変更された場合は初期化を実施
    if (beforeApoCd && (apoCd !== beforeApoCd || targetDate !== beforeTargetDate)) {
      dispatch(clearFisTable());
      dispatch(updateHeaderInfoDate({ targetDate: "", isToday: true })); // ヘッダーの日付を初期化
    }

    try {
      dispatch(fetchFis());

      const { data } = await WebApi.getHeader(dispatch, { apoCd });
      dispatch(fetchHeaderInfoSuccess({ data, apoCd }));

      // SPOT番号
      let responseS = null;
      if (isCurrentPath(Const.PATH_NAME.barChart)) {
        responseS = await WebApi.getSpotRemarks(dispatch, { apoCd, spotNo: null });
      }
      const spotData = responseS ? responseS.data : null;

      // ACARSステータス
      let responseA = null;
      if (isCurrentPath(Const.PATH_NAME.fis)) {
        responseA = await WebApi.getAcarsStatus(dispatch, { shipNo: "" });
      }
      const acarsData = responseA ? responseA.data : null;

      const requestDate = isToday ? null : targetDate;
      const responseF = await WebApi.getFis(dispatch, { apoCd, date: requestDate, autoReload: false });
      if (responseF.data.timeLcl) {
        const newTargetDate = requestDate || getTimeDateString(responseF.data.timeLcl, "YYYY-MM-DD");
        dispatch(updateHeaderInfoDate({ targetDate: newTargetDate, isToday }));
        dispatch(
          fetchFisSuccess({
            data: responseF.data,
            spotData,
            acarsData,
            targetDate: newTargetDate,
            isReload,
            isAutoReload: false,
            isApoHasChanged,
            master,
          })
        );
      } else {
        // 空のデータが帰ってきた場合（空港コードが存在しない等）
        dispatch(updateHeaderInfoDate({ targetDate: "", isToday: true }));
        dispatch(
          fetchFisSuccess({
            data: responseF.data,
            spotData,
            acarsData,
            targetDate: "",
            isReload,
            isAutoReload: false,
            isApoHasChanged,
            master,
          })
        );
      }
    } catch (error) {
      dispatch(fetchFisFailure({ error: error as Error }));
    }
  } else {
    dispatch(clear());
  }
});

/**
 * MQTT接続を行い、FIS、空港発令情報を取得する
 */
export const getFisHeaderInfoAuto = createAsyncThunk<
  void,
  { apoCd: string; isAddingAuto: boolean },
  { dispatch: AppDispatch; state: RootState }
>("fis/getFisHeaderInfoAuto", async (arg, { dispatch, getState }) => {
  const { apoCd, isAddingAuto } = arg;
  NotificationCreator.removeAll({ dispatch });

  if (apoCd) {
    if (isAuthExpired()) {
      const id = "getFisHeaderInfoAuto1";
      const onOkButton = () => window.close();
      NotificationCreator.create({ dispatch, id, message: SoalaMessage.M40025C({ onOkButton }) });
      return;
    }
    if (isAddingAuto) {
      const { pageStamp } = storage;
      if (pageStamp) {
        let canAuto = false;
        const { jobAuth } = getState().account.jobAuth;
        if (isCurrentPath(Const.PATH_NAME.barChart)) {
          canAuto = storageOfUser.checkPushCounter({ type: "barChart", pageStamp, jobAuth });
        } else if (isCurrentPath(Const.PATH_NAME.fis)) {
          canAuto = storageOfUser.checkPushCounter({ type: "fis", pageStamp, jobAuth });
        }
        if (!canAuto) {
          const id = "getFisHeaderInfoAuto2";
          NotificationCreator.create({ dispatch, id, message: SoalaMessage.M40026C({}) });
          return;
        }
      }
    }

    try {
      const { master } = getState().account;
      const isApoHasChanged = apoCd !== getState().common.headerInfo.apoCd;

      // MQTT接続時のコールバック
      const callbackOnConnected = async () => {
        try {
          dispatch(fetchFis()); // 自動再接続時に虹が出るように

          // サブスクライブ処理
          await mqtt.fltSubscribe(apoCd);
          await mqtt.apoSubscribe(apoCd);

          if (isCurrentPath(Const.PATH_NAME.barChart)) {
            await mqtt.sptSubscribe(apoCd); // バーチャートのみSPT（空港SPOT情報単位）サブスクライブ
          }

          if (isCurrentPath(Const.PATH_NAME.fis)) {
            await mqtt.astSubscribe(); // fisのみAST（ACARSステータス情報単位）サブスクライブ
          }

          const { data } = await WebApi.getHeader(dispatch, { apoCd });
          dispatch(fetchHeaderInfoSuccess({ data, apoCd }));

          // SPOT番号
          let responseS = null;
          if (isCurrentPath(Const.PATH_NAME.barChart)) {
            responseS = await WebApi.getSpotRemarks(dispatch, { apoCd, spotNo: null });
          }
          const spotData = responseS ? responseS.data : null;

          // ACARSステータス
          let responseA = null;
          if (isCurrentPath(Const.PATH_NAME.fis)) {
            responseA = await WebApi.getAcarsStatus(dispatch, { shipNo: "" });
          }
          const acarsData = responseA ? responseA.data : null;

          const responseF = await WebApi.getFis(dispatch, { apoCd, date: null, autoReload: true });
          if (responseF.data.timeLcl) {
            const newTargetDate = getTimeDateString(responseF.data.timeLcl, "YYYY-MM-DD");
            dispatch(
              fetchFisSuccess({
                data: responseF.data,
                spotData,
                acarsData,
                targetDate: newTargetDate,
                isReload: false,
                isAutoReload: true,
                isApoHasChanged,
                master,
              })
            );
            dispatch(updateHeaderInfoDate({ targetDate: newTargetDate, isToday: true }));
          } else {
            // 空のデータが帰ってきた場合（空港コードが存在しない等）
            dispatch(
              fetchFisSuccess({
                data: responseF.data,
                spotData,
                acarsData,
                targetDate: "",
                isReload: false,
                isAutoReload: true,
                isApoHasChanged,
                master,
              })
            );
            dispatch(updateHeaderInfoDate({ targetDate: "", isToday: true }));
          }
        } catch (error) {
          dispatch(fetchFisFailure({ error: error as Error }));
        }
      };

      // MQTT 接続＆サブスクライブを行う
      const { user } = getState().account.jobAuth;
      await mqtt.connect({
        dispatch,
        user,
        callbacksOnMessageArrived: {
          fis: reflectFisRowsFromPush,
          headerInfo: reflectHeaderInfoFromPush,
          spotRemarks: reflectSpotRemarksFromPush,
          acarsStatus: reflectAcarsStatusFromPush,
          master: reloadMaster,
          daily: null,
        },
        callbackOnConnectionStart: () => {
          storage.switchingAutoReloadOn = true;
          dispatch(fetchFis());
        },
        callbackOnConnected: callbackOnConnected as () => void,
        callbackOnNotConnected: () => dispatch(changeAutoReload({ isAutoReload: false })),
        callbackOnReconnected: () => {
          dispatch(changeAutoReload({ isAutoReload: true }));
        },
        callbackOnDisconnected: () => {
          dispatch(changeAutoReload({ isAutoReload: false }));
          dispatch(clearBufferFis());
        },
      });
    } catch (error) {
      dispatch(fetchFisFailure({ error: error as Error }));
    }
  } else {
    dispatch(clear());
  }
});

/**
 * MQTTのdisconnectを行う
 */
export const mqttDisconnect = createAsyncThunk<void, void, { dispatch: AppDispatch; state: RootState }>(
  "fis/mqttDisconnect",
  async (_, { dispatch, getState }) => {
    let isError = false;
    // MQTT切断
    try {
      await mqtt.disconnect();
    } catch (err) {
      isError = true;
    }

    // 認証切れの場合、画面を閉じる
    if (isAuthExpired()) {
      const id = "mqttDisconnect";
      const onOkButton = () => window.close();
      NotificationCreator.create({ dispatch, id, message: SoalaMessage.M40025C({ onOkButton }) });
      return;
    }
    // 自動更新ONからOFFの場合
    if (getState().fis.headerSettings.isAutoReload) {
      pushCounterDowun(); // PUSH画面数をカウントダウン
    }

    // 自動更新OFFにする
    if (isError) {
      dispatch(mqttUnSubscribeFailure());
    } else {
      dispatch(mqttUnSubscribeSuccess());
    }
  }
);

export const reflectFisRowsFromPush = createAsyncThunk<void, { payload: string }, { dispatch: AppDispatch; state: RootState }>(
  "fis/reflectFisRowsFromPush",
  (arg, { dispatch, getState }) => {
    const { payload } = arg;
    try {
      const pushData: FisApi.Response = JSON.parse(payload) as FisApi.Response;
      // キューに格納
      queue.add(() => {
        const prevTargetDate = getTimeDateString(getState().fis.timeLcl, "YYYY-MM-DD");
        const targetDate = getTimeDateString(pushData.timeLcl, "YYYY-MM-DD");
        const isDailyUpdate = prevTargetDate < targetDate;
        const { master } = getState().account;

        dispatch(fetchFisFromPushSuccess({ data: pushData, isDailyUpdate, master }));

        // 日付が変わったら対象日付を更新する
        if (isDailyUpdate) {
          dispatch(updateHeaderInfoDate({ targetDate, isToday: true })); // 対象日付に当日を設定
        }
      });
      // 自動更新スイッチ中でない場合は即実行する
      if (!storage.switchingAutoReloadOn) {
        queue.runAll();
      }
    } catch (err) {
      if (err instanceof Error) {
        const id = "reflectFisRowsFromPush";
        NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50021C() });
        console.error(`[${err.name}] ${err.message}`);
      }
    }
  }
);

/**
 * MQTTのPUSHメッセージをSPOTリマークスに反映する
 */
export const reflectSpotRemarksFromPush = createAsyncThunk<void, { payload: string }, { dispatch: AppDispatch }>(
  "fis/reflectSpotRemarksFromPush",
  (arg, { dispatch }) => {
    const { payload } = arg;
    try {
      const pushData: SpotRemarksApi.Get.Response = JSON.parse(payload) as SpotRemarksApi.Get.Response;
      queue.add(() => dispatch(fetchSpotRemarksFromPushSuccess({ data: pushData })));
      if (!storage.switchingAutoReloadOn) {
        queue.runAll(); // 自動更新スイッチ中でない場合は即実行する
      }
    } catch (err) {
      if (err instanceof Error) {
        const id = "reflectSpotRemarksFromPush";
        NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50021C() });
        // tslint:disable-next-line:no-console
        console.log(`[${err.name}] ${err.message}`);
      }
    }
  }
);

/**
 * MQTTのPUSHメッセージをACARSステータスに反映する
 */
export const reflectAcarsStatusFromPush = createAsyncThunk<void, { payload: string }, { dispatch: AppDispatch }>(
  "fis/reflectAcarsStatusFromPush",
  (arg, { dispatch }) => {
    const { payload } = arg;
    try {
      const pushData: AcarsStatus.Response = JSON.parse(payload) as AcarsStatus.Response;
      queue.add(() => dispatch(fetchAcarsStatusFromPushSuccess({ data: pushData })));
      if (!storage.switchingAutoReloadOn) {
        queue.runAll(); // 自動更新スイッチ中でない場合は即実行する
      }
    } catch (err) {
      if (err instanceof Error) {
        const id = "reflectAcarsStatusFromPush";
        NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50021C() });
        // tslint:disable-next-line:no-console
        console.log(`[${err.name}] ${err.message}`);
      }
    }
  }
);

/**
 * キューにたまった処理を全て実行する
 */
export function doQueueFunctionAll() {
  queue.runAll();
}

// ストレージの自動更新中の画面を追加する
const pushCounterUp = () => {
  // 認証切れの場合は実施しない
  if (!isAuthExpired()) {
    const { pageStamp } = storage;
    if (pageStamp) {
      if (isCurrentPath(Const.PATH_NAME.barChart)) {
        storageOfUser.addPushCounter({ type: "barChart", pageStamp });
      } else if (isCurrentPath(Const.PATH_NAME.fis)) {
        storageOfUser.addPushCounter({ type: "fis", pageStamp });
      }
    }
  }
};

// ストレージの自動更新中の画面を削除
const pushCounterDowun = () => {
  const { pageStamp } = storage;
  if (pageStamp) {
    if (isCurrentPath(Const.PATH_NAME.barChart)) {
      storageOfUser.removePushCounter({ type: "barChart", pageStamp });
    } else if (isCurrentPath(Const.PATH_NAME.fis)) {
      storageOfUser.removePushCounter({ type: "fis", pageStamp });
    }
  }
};

export const slice = createSlice({
  name: "fis",
  initialState,
  reducers: {
    clear: (state) => {
      storage.switchingAutoReloadOn = false;
      Object.assign(state, initialState);
    },
    clearFisTable: (state) => {
      Object.assign(state, {
        arrList: List(),
        depList: List(),
        fisRows: List(),
        spotRmksList: null,
      });
    },
    fetchFis: (state) => {
      state.isFetching = true;
      state.isFetchSecceeded = false;
    },
    fetchFisSuccess: (
      state,
      action: PayloadAction<{
        data: FisApi.Response;
        spotData: SpotRemarksApi.Get.Response | null;
        acarsData: AcarsStatus.Response | null;
        targetDate: string;
        isAutoReload: boolean;
        isApoHasChanged: boolean;
        isReload: boolean;
        master: Master;
      }>
    ) => {
      const { fis, apoCd, apoDetail } = action.payload.data;
      const { isReload, isAutoReload, spotData, acarsData, targetDate, isApoHasChanged, master } = action.payload;
      const timeLclDayjs = dayjs(action.payload.data.timeLcl);
      const timeLcl = getTimeDateString(action.payload.data.timeLcl, "YYYY-MM-DD[T]HH:mm:ss");
      const timeDiffUtc = getTimeDiffUtc(action.payload.data.timeLcl);
      const spotRmksList = spotData ? spotData.spotRmksList : null;
      const acarsStsList = acarsData ? acarsData.acars : null;

      let targetArea = "";
      let dispRangeFrom: number | null = null;
      let dispRangeTo: number | null = null;
      let dispRangeFromLcl = "";
      let dispRangeToLcl = "";
      let fisDataRangeFrom: number | null = null;
      let legDataRangeFrom: number | null = null;

      // 自動更新ONの場合
      if (!state.headerSettings.isAutoReload && action.payload.isAutoReload) {
        pushCounterUp(); // PUSH画面数をカウントアップ
      }

      if (apoDetail) {
        targetArea = apoDetail.targetArea;
        dispRangeFrom = apoDetail.dispRangeFrom;
        dispRangeTo = apoDetail.dispRangeTo;
        dispRangeFromLcl = getRangeLcl({ targetDate, hours: dispRangeFrom });
        dispRangeToLcl = getRangeLcl({ targetDate, hours: dispRangeTo });
        fisDataRangeFrom = apoDetail.fisDataRangeFrom;
        legDataRangeFrom = apoDetail.legDataRangeFrom;
      }

      let shipNoToAcarsSts: Record<string, string> = {};
      if (acarsStsList) {
        shipNoToAcarsSts = acarsStsList.reduce((a, { shipNo, acarsSts }) => ({ ...a, [shipNo]: acarsSts }), {});
      }

      // Arrをメモリに保持（重複は少ないのでマージせずあえてそのまま、物理シリアルが設定されているものを抽出）
      // console.time('fisFetch arrList');
      const arrList = List.of(...fis.map((f) => f.arr).filter((arr) => arr && arr.legPhySno !== undefined && arr.legPhySno !== null));
      // console.timeEnd('fisFetch arrList');
      // Depをメモリに保持（重複は少ないのでマージせずあえてそのまま、物理シリアルが設定されているものを抽出）
      // console.time('fisFetch depList');
      const depList = List.of(...fis.map((f) => f.dep).filter((dep) => dep && dep.legPhySno !== undefined && dep.legPhySno !== null));
      // console.timeEnd('fisFetch depList');
      // FISデータを生成
      // console.time('fisFetch fisRows');
      const fisRows: List<FisRow> = List.of(
        ...fis.map((f) => createFisRow(apoCd, f.arrDepCtrl, f.arr, f.dep, dispRangeFromLcl, dispRangeToLcl, master))
      );
      // console.timeEnd('fisFetch fisRows');

      storage.switchingAutoReloadOn = false;

      // 対象日付からみた本日日付の日数 昨日: -1 本日: 0 翌日: 1となる。
      const targetDayDiff = dayjs((timeLcl || "").substring(0, 10)).diff(targetDate, "d");
      const timeStamp = Date.now();

      Object.assign(state, {
        headerSettings: {
          ...state.headerSettings,
          isAutoReload,
        },
        isFetching: false,
        isFetchSecceeded: true,
        arrList: arrList || List(),
        depList: depList || List(),
        fisRows,
        timeStamp,
        pullTimeStamp: timeStamp,
        apoCd,
        timeLclDayjs,
        timeLcl,
        timeDiffUtc,
        targetArea,
        dispRangeFrom,
        dispRangeTo,
        dispRangeFromLcl,
        dispRangeToLcl,
        fisDataRangeFrom,
        legDataRangeFrom,
        fetchFisResult: { isError: false, retry: null },
        isReload,
        isApoHasChanged,
        targetDayDiff,
        spotRmksList,
        acarsStsList,
        shipNoToAcarsSts,
      });
    },
    fetchFisFailure: (
      state,
      _action: PayloadAction<{
        error: Error;
      }>
    ) => {
      storage.switchingAutoReloadOn = false;

      Object.assign(state, {
        headerSettings: {
          ...state.headerSettings,
          isAutoReload: false,
          isSelfScroll: false,
        },
        isFetching: false,
        isFetchSecceeded: false,
      });
    },
    changeAutoReload: (
      state,
      action: PayloadAction<{
        isAutoReload: boolean;
      }>
    ) => {
      Object.assign(state, {
        headerSettings: {
          ...state.headerSettings,
          isAutoReload: action.payload.isAutoReload,
          isSelfScroll: false,
        },
        isFetching: false,
        isFetchSecceeded: false,
      });
    },
    fetchFisFromPushSuccess: (
      state,
      action: PayloadAction<{
        data: FisApi.Response;
        isDailyUpdate: boolean;
        master: Master;
      }>
    ) => {
      const { fis, apoCd } = action.payload.data;
      const { isDailyUpdate, master } = action.payload;
      const timeLclDayjs = dayjs(action.payload.data.timeLcl);
      const timeLcl = getTimeDateString(action.payload.data.timeLcl, "YYYY-MM-DD[T]HH:mm:ss");
      const timeDiffUtc = getTimeDiffUtc(action.payload.data.timeLcl);

      let orgArrList: List<FisApi.Arr> = List();
      let orgDepList: List<FisApi.Dep> = List();
      let orgFisRows: List<FisRow> = List();
      let dispRangeFromLcl = "";
      let dispRangeToLcl = "";

      // 元データと空港コードが異なっている または （FIS画面でない かつ バーチャート画面出ない）場合
      if (state.apoCd !== apoCd || (!isCurrentPath(Const.PATH_NAME.fis) && !isCurrentPath(Const.PATH_NAME.barChart))) {
        if (state.apoCd !== apoCd) {
          console.warn("Pushed apo cd is different. disconnecting..");
        } else {
          console.warn("This function is not alloweded. . disconnecting..");
        }

        // MQTTを切断し自動更新をOFFにする
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        mqtt.disconnect();
        Object.assign(state, {
          headerSettings: {
            ...state.headerSettings,
            isAutoReload: false,
            isSelfScroll: false,
          },
        });
        return;
      }

      // /////////////////////
      // 日替わり処理
      // /////////////////////
      if (isDailyUpdate) {
        // 日付が変わったら日替り処理を実行する
        console.log("Daily Update");
        try {
          // 表示範囲FROM、TOを取得
          dispRangeFromLcl = getRangeLcl({ targetDate: timeLcl, hours: state.dispRangeFrom });
          dispRangeToLcl = getRangeLcl({ targetDate: timeLcl, hours: state.dispRangeTo });
          // データ保持範囲（FIS）FROMを取得
          const saveFisFromLcl = getRangeLcl({ targetDate: timeLcl, hours: state.fisDataRangeFrom });
          const saveFisFromDayjs = dayjs(saveFisFromLcl);

          // 全FisRowデータに対して、新しい非表示条件を反映する。
          orgFisRows = (state.fisRows as unknown as List<FisRow>)
            .map((fisRow) => {
              const { arrInfoCd } = fisRow.arrDepCtrl;
              const { depInfoCd } = fisRow.arrDepCtrl;
              const arrPhySno = fisRow.arrDepCtrl.arrInfoLegPhySno;
              const depPhySno = fisRow.arrDepCtrl.depInfoLegPhySno;
              // 非表示になっているもの、これから非表示になるものについて、FisRowを組み直す
              if (
                (arrPhySno && !fisRow.arr) ||
                (depPhySno && !fisRow.dep) ||
                !(fisRow.orgXtaLcl >= dispRangeFromLcl && fisRow.orgXtaLcl <= dispRangeToLcl) ||
                !(fisRow.orgXtdLcl >= dispRangeFromLcl && fisRow.orgXtdLcl <= dispRangeToLcl)
              ) {
                // 存在したらarrList, depListよりデータを取得する
                const arr = (state.arrList as unknown as List<FisApi.Arr>).find(
                  (x) => x.arrInfoCd === arrInfoCd && x.legPhySno === arrPhySno
                );
                const dep = (state.depList as unknown as List<FisApi.Dep>).find(
                  (x) => x.depInfoCd === depInfoCd && x.legPhySno === depPhySno
                );
                // FisRow行を更新する
                const newFisRow = createFisRow(apoCd, fisRow.arrDepCtrl, arr, dep, dispRangeFromLcl, dispRangeToLcl, master);
                return newFisRow;
              }
              return fisRow;
            })
            .filter((x) => {
              // FISからデータ保持期間を外れるデータを削除する
              if (x.orgXtaLcl && x.orgXtdLcl && (saveFisFromDayjs.diff(x.orgXtaLcl) <= 0 || saveFisFromDayjs.diff(x.orgXtdLcl) <= 0))
                return true;
              if (x.orgXtaLcl && saveFisFromDayjs.diff(x.orgXtaLcl) <= 0) return true;
              if (x.orgXtdLcl && saveFisFromDayjs.diff(x.orgXtdLcl) <= 0) return true;
              return false;
            });

          // データ保持範囲（便）FROMを取得
          const saveFltFromLcl = getRangeLcl({ targetDate: timeLcl, hours: state.legDataRangeFrom });
          const saveFltFromDayjs = dayjs(saveFltFromLcl);
          // 到着便情報からデータ保持期間を外れるデータを削除する
          orgArrList = (state.arrList as unknown as List<FisApi.Arr>).filter((arr) => {
            const { ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl } = arr;
            const xta = getXtaLcl({ ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl }) || arr.updateTime; // 全部空だったら更新日付でみる
            if (xta && saveFltFromDayjs.diff(xta) <= 0) return true;
            return false;
          });
          // 出発便情報からデータ保持期間を外れるデータを削除する
          orgDepList = (state.depList as unknown as List<FisApi.Dep>).filter((dep) => {
            const { atdLcl, tentativeEtdLcl, etdLcl, stdLcl } = dep;
            const xtd = getXtdLcl({ atdLcl, tentativeEtdLcl, etdLcl, stdLcl }) || dep.updateTime; // 全部空だったら更新日付でみる
            if (xtd && saveFltFromDayjs.diff(xtd) <= 0) return true;
            return false;
          });
        } catch (err) {
          console.error(err);
          Object.assign(state, {
            isFetching: false,
            isFetchSecceeded: false,
            _getCount: state.test_getCount + 1,
            fetchFisFromPushResult: { isError: false, retry: null },
          });
        }
      } else {
        orgArrList = state.arrList as unknown as List<FisApi.Arr>;
        orgDepList = state.depList as unknown as List<FisApi.Dep>;
        orgFisRows = state.fisRows as unknown as List<FisRow>;
        dispRangeFromLcl = state.dispRangeFromLcl;
        dispRangeToLcl = state.dispRangeToLcl;
      }
      // /////////////////////
      // PUSHデータ反映処理
      // /////////////////////
      // 受信したデータをFISに反映する
      const applyFis = makeApplyFis(state.bufferFis, action.payload.data);
      console.log({ applyFis });
      try {
        // arr -> arrList
        // console.time('fisPushUpdate arrList');
        const arrList = updateArrList(applyFis, orgArrList);
        console.log({ arrList })
        // console.timeEnd('fisPushUpdate arrList');
        // dep -> depList
        // console.time('fisPushUpdate depList');
        const depList = updateDepList(applyFis, orgDepList);
        console.log({ depList });
        // console.timeEnd('fisPushUpdate depList');
        // arrDepCtrl, arr, dep -> fisRows
        // console.time('fisPushUpdate fisRows');
        const fisRows = updateFisRows(apoCd, applyFis, orgFisRows, arrList, depList, dispRangeFromLcl, dispRangeToLcl, master);
        // console.timeEnd('fisPushUpdate fisRows');
        const timeStamp = Date.now();

        // /////////////////////
        // バッファ処理
        // /////////////////////
        const bufferFis = makeBuffer(state.bufferFis, action.payload.data);
        console.log({ bufferFis });

        Object.assign(state, {
          timeStamp,
          arrList,
          depList,
          fisRows,
          apoCd,
          timeLclDayjs,
          timeLcl,
          timeDiffUtc,
          dispRangeFromLcl,
          dispRangeToLcl,
          _getCount: state.test_getCount + 1,
          fetchFisFromPushResult: { isError: false, retry: null },
          bufferFis,
        });
      } catch (err) {
        console.error(err);
        Object.assign(state, {
          isFetching: false,
          isFetchSecceeded: false,
          _getCount: state.test_getCount + 1,
          fetchFisFromPushResult: { isError: false, retry: null },
        });
      }
    },
    fetchSpotRemarksFromPushSuccess: (
      state,
      action: PayloadAction<{
        data: SpotRemarksApi.Get.Response;
      }>
    ) => {
      const { spotRmksList } = action.payload.data;
      const orgSpotRmksList = state.spotRmksList || [];

      // spotRmksListが空の場合は何もしない
      if (!spotRmksList.length) {
        return;
      }

      // 元のデータと異なる空港コードを探す
      const unexpectedApoCd = spotRmksList.map(({ apoCd }) => apoCd).find((apoCd) => apoCd !== state.apoCd);

      // 元データと空港コードが異なるものがある またはバーチャート画面でない場合
      if (unexpectedApoCd || !isCurrentPath(Const.PATH_NAME.barChart)) {
        if (unexpectedApoCd) {
          console.warn("Pushed apo cd is different. disconnecting..");
        } else {
          console.warn("This function is not alloweded. . disconnecting..");
        }

        // MQTTを切断し自動更新をOFFにする
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        mqtt.disconnect();
        Object.assign(state, {
          headerSettings: {
            ...state.headerSettings,
            isAutoReload: false,
            isSelfScroll: false,
          },
        });
      } else {
        const applySpotRmks = makeApplySpotRmks(state.bufferSpotRmksList, action.payload.data);
        const reducerSpotRmks = (list: SpotRemarksApi.Get.SpotRmks[], currentSpotRmks: SpotRemarksApi.Get.SpotRmks) => {
          const { trxId } = currentSpotRmks;
          const index = list.findIndex(
            (spotRmks) => spotRmks.apoCd === currentSpotRmks.apoCd && spotRmks.spotNo === currentSpotRmks.spotNo
          );

          // 更新日時を比較して新しければ反映する
          if (index >= 0 && list[index].updateTime <= currentSpotRmks.updateTime) {
            if (trxId === "D") {
              list.splice(index, 1);
              return list;
            }
            list.splice(index, 1, { ...list[index], ...currentSpotRmks });
            return list; // 元のSPOTリマークスにマージする
          }
          if (index < 0 && (trxId === "A" || trxId === "U")) {
            // 新規追加
            list.push(currentSpotRmks);
            return list;
          }
          return list;
        };
        const bufferSpotRmksList = makeBuffer(state.bufferSpotRmksList, action.payload.data);
        Object.assign(state, {
          spotRmksList: applySpotRmks.reduce(reducerSpotRmks, orgSpotRmksList.slice()),
          bufferSpotRmksList,
        });
      }
    },
    fetchAcarsStatusFromPushSuccess: (
      state,
      action: PayloadAction<{
        data: AcarsStatus.Response;
      }>
    ) => {
      const { acars } = action.payload.data;
      const orgAcarsStsList = state.acarsStsList || [];

      // Acarsが空の場合は何もしない
      if (!acars.length) {
        return;
      }

      // FIS画面でない場合
      if (!isCurrentPath(Const.PATH_NAME.fis)) {
        console.warn("This function is not alloweded. . disconnecting..");

        // MQTTを切断し自動更新をOFFにする
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        mqtt.disconnect();
        Object.assign(state, {
          headerSettings: {
            ...state.headerSettings,
            isAutoReload: false,
            isSelfScroll: false,
          },
        });
      } else {
        const applyAcarsStatus = makeApplyAcarsStatus(state.bufferAcarsStsList, action.payload.data);
        const reducerAcarsSts = (list: AcarsStatus.AcarsSts[], currentAcarsSts: AcarsStatus.AcarsSts) => {
          const { trxId } = currentAcarsSts;
          const index = list.findIndex((acarsSts) => acarsSts.shipNo === currentAcarsSts.shipNo);

          // 更新日時を比較して新しければ反映する
          if (index >= 0 && list[index].updateTime <= currentAcarsSts.updateTime) {
            if (trxId === "D") {
              list.splice(index, 1);
              return list;
            }
            list.splice(index, 1, { ...list[index], ...currentAcarsSts });
            return list; // 元のACARSステータスにマージする
          }
          if (index < 0 && (trxId === "A" || trxId === "U")) {
            // 新規追加
            list.push(currentAcarsSts);
            return list;
          }
          return list;
        };
        const acarsStsList: AcarsStatus.AcarsSts[] | null = applyAcarsStatus.reduce(reducerAcarsSts, orgAcarsStsList.slice());
        const shipNoToAcarsSts: Record<string, string> = acarsStsList.reduce(
          (a, { shipNo, acarsSts }) => ({ ...a, [shipNo]: acarsSts }),
          {}
        );
        const bufferAcarsStsList = makeBuffer(state.bufferAcarsStsList, action.payload.data);
        Object.assign(state, {
          acarsStsList,
          shipNoToAcarsSts,
          bufferAcarsStsList,
        });
      }
    }, //
    mqttUnSubscribeSuccess: (state) => {
      Object.assign(state, {
        headerSettings: {
          ...state.headerSettings,
          isAutoReload: false,
          isSelfScroll: false,
        },
      });
    },
    mqttUnSubscribeFailure: (state) => {
      Object.assign(state, {
        headerSettings: {
          ...state.headerSettings,
          isAutoReload: false,
          isSelfScroll: false,
        },
        isFetching: false,
        isFetchSecceeded: false,
      });
    },
    changeSort: (
      state,
      action: PayloadAction<{
        isSortArrival: boolean;
        isSortAsc: boolean;
        isSortNoTowing: boolean;
        isSortTwoColumnMode: boolean;
      }>
    ) => {
      const { isSortArrival, isSortAsc, isSortNoTowing, isSortTwoColumnMode } = action.payload;

      Object.assign(state, {
        isSortArrival,
        isSortAsc,
        isSortNoTowing,
        isSortTwoColumnMode,
      });
    },
    setSelfScroll: (
      state,
      action: PayloadAction<{
        isSelfScroll: boolean;
      }>
    ) => {
      Object.assign(state, {
        headerSettings: {
          ...state.headerSettings,
          isSelfScroll: action.payload.isSelfScroll,
        },
      });
    },
    clearBufferFis: (state) => {
      Object.assign(state, {
        bufferFis: [],
      });
    },
  },
});

/**
 * 着発関連付け・便情報の変更をFISに反映する
 */
function updateFisRows(
  apoCd: string,
  newFis: FisApi.Fis[],
  orgFisRows: List<FisRow>,
  arrList: List<FisApi.Arr>,
  depList: List<FisApi.Dep>,
  dispRangeFromLcl: string,
  dispRangeToLcl: string,
  master: Master
): List<FisRow> {
  // 着発関連付けをFisRowに反映する（同時に到着データ、出発データもメモリから再取得する）
  const oldestArrDepCtrlUpdateTime = newFis.reduce((prev, current) => {
    if (!current.arrDepCtrl) {
      return prev;
    }
    if (!prev.arrDepCtrl) {
      return current;
    }
    const updateTimePrev = dayjs(prev.arrDepCtrl.updateTime);
    const updateTimeCurrent = dayjs(current.arrDepCtrl.updateTime);
    return updateTimeCurrent.isAfter(updateTimePrev) ? prev : current;
  }).arrDepCtrl?.updateTime;
  const reducer = (list: List<FisRow>, currentFis: FisApi.Fis) => {
    if (currentFis.arrDepCtrl) {
      const index = list.findIndex((fisRow) => fisRow.arrDepCtrl.seq === currentFis.arrDepCtrl.seq);
      const { trxId } = currentFis.arrDepCtrl;
      const findFisRow = list.get(index);
      // 更新日時を比較して新しければ反映する
      // TODO: pullした瞬間古いデータがきたときどうするか？
      if (index >= 0 && findFisRow && oldestArrDepCtrlUpdateTime && oldestArrDepCtrlUpdateTime <= currentFis.arrDepCtrl.updateTime) {
        if (trxId === "D") {
          return list.delete(index);
        }
        Object.assign(findFisRow.arrDepCtrl, currentFis.arrDepCtrl); // 元のarrDepCtrlにマージする
        const arr = arrList.find(
          (x) => x.arrInfoCd === findFisRow.arrDepCtrl.arrInfoCd && x.legPhySno === findFisRow.arrDepCtrl.arrInfoLegPhySno
        );
        const dep = depList.find(
          (x) => x.depInfoCd === findFisRow.arrDepCtrl.depInfoCd && x.legPhySno === findFisRow.arrDepCtrl.depInfoLegPhySno
        );
        const newFisRow = createFisRow(apoCd, findFisRow.arrDepCtrl, arr, dep, dispRangeFromLcl, dispRangeToLcl, master);
        return list.update(index, () => newFisRow);
      }

      if (index < 0 && trxId === "A") {
        // 新規追加
        const arr = arrList.find(
          (x) => x.arrInfoCd === currentFis.arrDepCtrl.arrInfoCd && x.legPhySno === currentFis.arrDepCtrl.arrInfoLegPhySno
        );
        const dep = depList.find(
          (x) => x.depInfoCd === currentFis.arrDepCtrl.depInfoCd && x.legPhySno === currentFis.arrDepCtrl.depInfoLegPhySno
        );
        const newFisRow = createFisRow(apoCd, currentFis.arrDepCtrl, arr, dep, dispRangeFromLcl, dispRangeToLcl, master);
        return list.push(newFisRow);
      }
      console.log(
        `ArrDepCtrl push data is not accepted trxId:${currentFis.arrDepCtrl.trxId} seq:${currentFis.arrDepCtrl.seq} updateTime:${currentFis.arrDepCtrl.updateTime}`
      );
    }
    return list;
  };
  const newFisRows = newFis.reduce(reducer, orgFisRows);

  // 全FisRowデータに対してArr, Depの変更分を反映し返却する
  return newFisRows.map((fisRow) => {
    const { arrInfoCd } = fisRow.arrDepCtrl;
    const { depInfoCd } = fisRow.arrDepCtrl;
    const arrPhySno = fisRow.arrDepCtrl.arrInfoLegPhySno;
    const depPhySno = fisRow.arrDepCtrl.depInfoLegPhySno;
    // 受信データに同じArr, Depのデータがないか調べる
    if (
      newFis.find((f) => (f.arr && arrPhySno ? f.arr.arrInfoCd === arrInfoCd && f.arr.legPhySno === arrPhySno : false)) ||
      newFis.find((f) => (f.dep && depPhySno ? f.dep.depInfoCd === depInfoCd && f.dep.legPhySno === depPhySno : false))
    ) {
      // 存在したらarrList, depListよりデータを取得する
      const arr = arrList.find((x) => x.arrInfoCd === arrInfoCd && x.legPhySno === arrPhySno);
      const dep = depList.find((x) => x.depInfoCd === depInfoCd && x.legPhySno === depPhySno);
      // FisRow行を更新する
      const newFisRow = createFisRow(apoCd, fisRow.arrDepCtrl, arr, dep, dispRangeFromLcl, dispRangeToLcl, master);
      return newFisRow;
    }
    return fisRow;
  });
}
/**
 * 到着便情報の変更をメモリの便情報に反映する
 */
function updateArrList(newFis: FisApi.Fis[], orgArrList: List<FisApi.Arr>) {
  const oldestArrUpdateTime = newFis.reduce((prev, current) => {
    if (!current.arr) {
      return prev;
    }
    if (!prev.arr) {
      return current;
    }
    const updateTimePrev = dayjs(prev.arr.updateTime);
    const updateTimeCurrent = dayjs(current.arr.updateTime);
    return updateTimeCurrent.isAfter(updateTimePrev) ? prev : current;
  }).arr?.updateTime;
  const reducer = (list: List<FisApi.Arr>, currentFis: FisApi.Fis) => {
    if (currentFis.arr) {
      const currentArr = currentFis.arr;
      const { trxId } = currentFis.arr;
      const index = list.findIndex((arr) => arr.arrInfoCd === currentArr.arrInfoCd && arr.legPhySno === currentArr.legPhySno);
      const findArr = list.get(index);
      // 更新日時を比較して新しければ反映する
      // TODO: pullした瞬間古いデータがきたときどうするか？
      if (index >= 0 && findArr && oldestArrUpdateTime && oldestArrUpdateTime <= currentArr.updateTime) {
        if (trxId === "D") {
          // 同じarrInfoCd、legPhySnoが複数存在するので全て削除
          return list.filter((arr) => !(arr.arrInfoCd === currentArr.arrInfoCd && arr.legPhySno === currentArr.legPhySno)); // filterでも遅くなかったのでfilterでやる
        }
        const newWorkStep = mergeWorkStep(currentArr.workStep, findArr.workStep);
        const marged: FisApi.Arr = { ...findArr, ...currentArr, ...{ workStep: newWorkStep } }; // 元のarrにマージする
        return list.update(index, () => marged);
      }
      if (index < 0 && trxId === "A") {
        // 既存のデータがない場合は、"A"のみ追加する（"U"は差分データしか持っていないので）
        return list.push(currentArr);
      }
      console.log(
        `Aep push data is not accepted trxId:${currentFis.arr.trxId} infoCd:${currentFis.arr.arrInfoCd} legPhySno:${currentFis.arr.legPhySno} updateTime:${currentFis.arr.updateTime}`
      );
    }
    return list;
  };

  return newFis.reduce(reducer, orgArrList);
}
/**
 * 出発便情報の変更をメモリの便情報に反映する
 */
function updateDepList(newFis: FisApi.Fis[], orgDepList: List<FisApi.Dep>) {
const oldestDepUpdateTime = newFis.reduce((prev, current) => {
  if (!current.dep) {
    return prev;
  }
  if (!prev.dep) {
    return current;
  }
  const updateTimePrev = dayjs(prev.dep.updateTime);
  const updateTimeCurrent = dayjs(current.dep.updateTime);
  return updateTimeCurrent.isAfter(updateTimePrev) ? prev : current;
}).dep?.updateTime;
  const reducer = (list: List<FisApi.Dep>, currentFis: FisApi.Fis) => {
    console.log({ currentFis });
    if (currentFis.dep) {
      const currentDep = currentFis.dep;
      const { trxId } = currentFis.dep;
      const index = list.findIndex((dep) => dep.depInfoCd === currentDep.depInfoCd && dep.legPhySno === currentDep.legPhySno);
      console.log("updateDepList", {
        findDep: list.filter((dep) => dep.depInfoCd === currentDep.depInfoCd && dep.legPhySno === currentDep.legPhySno),
      });
      const findDep = list.get(index);
      // 更新日時を比較して新しければ反映する
      // TODO: pullした瞬間古いデータがきたときどうするか？
      if (index >= 0 && findDep && oldestDepUpdateTime && oldestDepUpdateTime <= currentDep.updateTime) {
        if (trxId === "D") {
          // 同じdepInfoCd、legPhySnoが複数存在するので全て削除
          return list.filter((dep) => !(dep.depInfoCd === currentDep.depInfoCd && dep.legPhySno === currentDep.legPhySno)); // filterでも遅くなかったのでfilterでやる
        }
        const newWorkStep = mergeWorkStep(currentDep.workStep, findDep.workStep);
        const marged: FisApi.Dep = { ...findDep, ...currentDep, ...{ workStep: newWorkStep } }; // 元のdepにマージする
        return list.update(index, () => marged);
      }
      if (index < 0 && trxId === "A") {
        // 既存のデータがない場合は、"A"のみ追加する（"U"は差分データしか持っていないので）
        return list.push(currentDep);
      }
      console.log(
        `Dep push data is not accepted trxId:${currentFis.dep.trxId} infoCd:${currentFis.dep.depInfoCd} legPhySno${currentFis.dep.legPhySno} updateTime:${currentFis.dep.updateTime}`
      );
    }
    return list;
  };
  return newFis.reduce(reducer, orgDepList);
}

/**
 * 発着工程の変更を反映して新しい配列で返す
 */
function mergeWorkStep(newWorkStep: FisApi.WorkStep[] | undefined | null, orgWorkStep: FisApi.WorkStep[] | null): FisApi.WorkStep[] {
  // Ph1では発着工程は１件のみを想定
  if (newWorkStep && newWorkStep.length > 0) {
    if (
      !orgWorkStep ||
      orgWorkStep.length === 0 ||
      (orgWorkStep && orgWorkStep.length > 0 && orgWorkStep[0].updateTime <= newWorkStep[0].updateTime)
    ) {
      if (newWorkStep[0].trxId === "D") {
        return [];
      }
      return newWorkStep.concat();
    }
    console.log(
      `WorkStep push data is not accepted trxId:${newWorkStep[0].trxId} workStepCd:${newWorkStep[0].workStepCd} updateTime:${newWorkStep[0].updateTime}`
    );
  }
  return orgWorkStep ? orgWorkStep.concat() : [];
}

/**
 * updateTimeの昇順に並び替える
 * @param {FisApi.Response | SpotRemarksApi.Get.Response | AcarsStatus.Response} a
 * @param {FisApi.Response | SpotRemarksApi.Get.Response | AcarsStatus.Response} b
 * @returns
 */
export const sortCreationTime = <T extends FisApi.Response | SpotRemarksApi.Get.Response | AcarsStatus.Response>(a: T, b: T) => {
  const creationTimeA = dayjs(a.commonHeader.messageReference.creatorReference.creationTime);
  const creationTimeB = dayjs(b.commonHeader.messageReference.creatorReference.creationTime);
  return creationTimeA.isSame(creationTimeB) ? 0 : creationTimeA.isBefore(creationTimeB) ? -1 : 1;
};

/**
 * 画面に反映するデータを作成する
 * @param {FisApi.Response[]} buffer
 * @param {FisApi.Fis[]} currentFis
 *
 * @returns {FisApi.Fis[]}
 */
function makeApplyFis(buffer: FisApi.Response[], currentData: FisApi.Response): FisApi.Fis[] {
  // creationTimeを取得
  const creationTime = dayjs(currentData.commonHeader.messageReference.creatorReference.creationTime);
  // バッファデータのうち、受信したデータのcreationTimeよりも後のものを取得する
  // さらに受信したデータを結合しcreationTimeの昇順でソートし、seqが同じデータを返却
  return cloneDeep(buffer)
    .filter((buf) => dayjs(buf.commonHeader.messageReference.creatorReference.creationTime).isSameOrAfter(creationTime))
    .concat(currentData)
    .sort(sortCreationTime)
    .map((aplybuf) => aplybuf.fis)
    .flat()
    .filter((bufferFis) =>
      currentData.fis.filter((currentFis) => {
        if (currentFis.arrDepCtrl?.seq) {
          return bufferFis.arrDepCtrl?.seq === currentFis.arrDepCtrl.seq;
        }
        if (currentFis.arr?.legPhySno) {
          return bufferFis.arr?.legPhySno === currentFis.arr.legPhySno;
        }
        if (currentFis.dep?.legPhySno) {
          return bufferFis.dep?.legPhySno === currentFis.dep.legPhySno;
        }
        return false;
      })
    );
}

/**
 * バッファを作成する。期限切れのものは削除する。
 * @param {(FisApi.Response | SpotRemarksApi.Get.Response | AcarsStatus.Response)[]} buffer
 * @param {FisApi.Response | SpotRemarksApi.Get.Response | AcarsStatus.Response} currentData
 *
 * @returns {(FisApi.Response | SpotRemarksApi.Get.Response | AcarsStatus.Response)[]}
 */
function makeBuffer<T extends FisApi.Response | SpotRemarksApi.Get.Response | AcarsStatus.Response>(buffer: T[], currentData: T): T[] {
  if (!buffer.length) {
    return [currentData];
  }
  // バッファ内の最新のcreationTimeを取得
  const latestCreationTime = dayjs(
    buffer.concat(currentData).reduce((prev, current) => {
      const creationTimePrev = dayjs(prev.commonHeader.messageReference.creatorReference.creationTime);
      const creationTimeCurrent = dayjs(current.commonHeader.messageReference.creatorReference.creationTime);
      return creationTimeCurrent.isAfter(creationTimePrev) ? current : prev;
    }).commonHeader.messageReference.creatorReference.creationTime
  );
  // バッファ内の最新のcreationTimeから規定秒以内の過去データをバッファする
  return buffer
    .concat(currentData)
    .filter((buf) => {
      const creationTimeBuffer = dayjs(buf.commonHeader.messageReference.creatorReference.creationTime);
      return creationTimeBuffer.isSameOrAfter(
        latestCreationTime.subtract(
          ServerConfig.MQTT_KEEP_ALIVE + ServerConfig.MQTT_SESSION_EXPIRY + ServerConfig.BUFFER_INTERVAL,
          "second"
        )
      );
    })
    .sort(sortCreationTime);
}

/**
 * 画面に反映するデータを作成する
 * @param {SpotRemarksApi.Get.Response[]} buffer
 * @param {SpotRemarksApi.Get.Response} currentData
 *
 * @returns {SpotRemarksApi.Get.SpotRmks[]}
 */
function makeApplySpotRmks(buffer: SpotRemarksApi.Get.Response[], currentData: SpotRemarksApi.Get.Response): SpotRemarksApi.Get.SpotRmks[] {
  // 今回画面に反映するデータを作成
  const creationTime = dayjs(currentData.commonHeader.messageReference.creatorReference.creationTime);
  // バッファデータのうち、受信したデータのcreationTimeよりも後のものを取得する
  // さらに受信したデータを結合しcreationTimeの昇順でソートし、apoCdが同じデータを返却
  return cloneDeep(buffer)
    .filter((buf) => dayjs(buf.commonHeader.messageReference.creatorReference.creationTime).isSameOrAfter(creationTime))
    .concat(currentData)
    .sort(sortCreationTime)
    .map((aplybuf) => aplybuf.spotRmksList)
    .flat()
    .filter((spotRmks) => spotRmks.apoCd === currentData.spotRmksList[0]?.apoCd);
}

/**
 * 画面に反映するデータを作成する
 * @param {AcarsStatus.Response[]} buffer
 * @param {AcarsStatus.Response} currentData
 *
 * @returns {AcarsStatus.AcarsSts[]}
 */
function makeApplyAcarsStatus(buffer: AcarsStatus.Response[], currentData: AcarsStatus.Response): AcarsStatus.AcarsSts[] {
  // 今回画面に反映するデータを作成
  const creationTime = dayjs(currentData.commonHeader.messageReference.creatorReference.creationTime);
  // バッファデータのうち、受信したデータのcreationTimeよりも後のものを取得する
  // さらに受信したデータを結合しcreationTimeの昇順でソートして返却
  return cloneDeep(buffer)
    .filter((buf) => dayjs(buf.commonHeader.messageReference.creatorReference.creationTime).isAfter(creationTime))
    .concat(currentData)
    .sort(sortCreationTime)
    .map((aplybuf) => aplybuf.acars)
    .flat();
}

export const {
  clear,
  clearFisTable,
  fetchFis,
  fetchFisSuccess,
  fetchFisFailure,
  changeAutoReload,
  fetchFisFromPushSuccess,
  fetchSpotRemarksFromPushSuccess,
  fetchAcarsStatusFromPushSuccess,
  mqttUnSubscribeSuccess,
  mqttUnSubscribeFailure,
  changeSort,
  setSelfScroll,
  clearBufferFis,
} = slice.actions;

export default slice.reducer;
