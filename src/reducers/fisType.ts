import dayjs from "dayjs";

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
