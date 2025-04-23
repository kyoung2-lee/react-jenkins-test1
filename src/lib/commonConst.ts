import dayjs from "dayjs";

/**
 * 定数
 */
export namespace Const {
  export const SPA_VERSION = "3.2.0";
  export const USE_ALL_FUNC = false; // 全ての機能を有効にする
  export const PROJECT_PHASE = 999; // プロジェクトのフェーズ（フェーズによって機能を制限するのに使用する）
  export const FIS_OVERSCAN_ROW_COUNT = 10; // FISのスクロールの事前読込行数
  export const MODAL_LIMIT_COUNT = 9; // 一度に開くモーダルの機能別の最大枚数
  export const MAX_WIDTH = "1600px";
  export const FIS_MIN_WIDTH = 1024; // FISの最小の横幅 px

  export const PATH_NAME: { readonly [key: string]: string } = {
    // URLのPATH
    home: "/",
    error: "/error",
    jobAuth: "/job_auth",
    cognitoAuth: "/cognito_auth",
    cognitoRedirect: "/cognito_redirect",
    profile: "/profile",
    myPage: "/mypage",
    help: "/help",
    barChart: "/bar_chart",
    fis: "/fis",
    flightSearch: "/flight_search",
    issueSecurity: "/issue_security",
    userSetting: "/user_setting",
    notification: "/notification",
    oalFlightSchedule: "/oal_flight_schedule",
    broadcast: "/broadcast",
    bulletinBoard: "/bb",
    mySchedule: "/myschedule",
  };

  // 端末区分
  export enum TerminalCat {
    pc = "1",
    iPad = "2",
    iPhone = "3",
  }

  export const AIRLINES: {
    readonly alCd: string;
    readonly jalGrpFlg: boolean;
    readonly dispSeq: number;
  }[] = [
    {
      alCd: "JL",
      jalGrpFlg: true,
      dispSeq: 1,
    },
    {
      alCd: "NU",
      jalGrpFlg: true,
      dispSeq: 2,
    },
    {
      alCd: "JC",
      jalGrpFlg: true,
      dispSeq: 3,
    },
    {
      alCd: "XM",
      jalGrpFlg: true,
      dispSeq: 4,
    },
    {
      alCd: "HC",
      jalGrpFlg: true,
      dispSeq: 5,
    },
    {
      alCd: "ZG",
      jalGrpFlg: true,
      dispSeq: 6,
    },
  ];

  export const FUNC_ID: { readonly [key: string]: string } = {
    /** 空港リマークス登録機能 */
    updateAireportRemarks: "S10100P1",
    /** 通知一覧画面 */
    openNotificationList: "S10107C",
    /** ユーザー設定画面 */
    openUserSetting: "S10108C",
    /** FIS画面 */
    openFis: "S10201C",
    /** FIS画面-自動更新ON/OFF機能 */
    updateFisAuto: "S10201P1",
    /** 地上作業バーチャート画面 */
    openBarChart: "S10203C",
    /** 地上作業バーチャート画面-自動更新ON/OFF機能 */
    updateBarChartAuto: "S10203P1",
    /** SPOTリマークス更新機能 */
    updateSpotRemarks: "S10701C",
    /** 空港発令・保安情報更新画面 */
    openAirportIssue: "S10206C",
    /** 発着工程情報更新画面 */
    openOperationTask: "S10301C",
    /** 発着工程情報更新画面-工程登録機能 */
    updateOperationTask: "S10301P1",
    /** 便情報詳細画面 */
    openFlightDetail: "S10502C",
    /** 便情報詳細画面-便リマークス登録機能 */
    updateFlightRemarks: "S10502P1",
    /** 便情報一覧画面 */
    openFlightSearch: "S10504C",
    /** 旅客乗継便バーチャート画面 */
    openPaxBarChart: "S10505C",
    /** 機材接続情報画面 */
    openShipTransitList: "S10506C",
    /** SpecialCare画面 */
    openSpecialCare: "S10507C",
    /** 情報発信画面 */
    openBroadcast: "S11100C",
    /** 掲示板画面 */
    openBulletinBoard: "S11101C",
    /** 掲示板登録画面 */
    updateBulletinBoard: "S11102C",
    /** 掲示板登録画面-レス登録機能 */
    updateBulletinBoardRes: "S11102P1",
    /** e-mail送信画面 */
    openBroadcastEmail: "S11103C",
    /** TTY送信画面 */
    openBroadcastTty: "S11104C",
    /** AFTN送信画面 */
    openBroadcastAftn: "S11107C",
    /** ACARS Uplink画面 */
    openBroadcastAcars: "S11105C",
    /** 通知送信画面 */
    openBroadcastNotification: "S11106C",
    /** 掲示板画面-掲示板通知機能 */
    notifyBulletinBoard: "S11101P1",
    /** 他社便スケジュール管理画面 */
    openOalFlightSchedule: "S11301C",
    /** 便動態更新画面 */
    openOalFlightMovement: "S10601C",
    /** 便動態更新画面-更新画面 */
    updateOalFlightMovement: "S10601P1",
    /** イレギュラー管理画面 */
    updateIrregularControl: "S10602C",
    /** 便動態発信画面 */
    openMvtMsg: "S10603C",
    /** 便動態一括更新画面 */
    openMultipleFlightMovement: "S10604C",
    /** 他社便旅客数更新画面 */
    openOalPax: "S11302C",
    /** 他社便機材情報更新画面 */
    openOalAircraft: "S11303C",
    /** 他社便旅客ステータス更新画面 */
    openOalPaxStatus: "S11304C",
    /** SPOT番号更新画面 */
    openSpotNo: "S10702C",
    /** 他社便燃料情報更新画面 */
    openOalFuel: "S11305C",
    /** My Schedule画面 */
    mySchedule: "S10401C",
  };

  // バーチャートの角の三角の大きさ
  export const BAR_CHART_TRIANGLE_WIDTH = 20;
  export const BAR_CHART_TRIANGLE_HEIGHT = 57;

  // コードクラス
  export const CodeClass = {
    BULLETIN_BOARD_CATEGORY: "023",
  };

  // プロフィール画像サイズ
  export const PROFILE_IMG_SIZE = 200;
  // プロフィールサムネール画像サイズ
  export const PROFILE_TMB_IMG_SIZE = 72;

  // メールアドレスの正規表現
  // cf. EmailAddressAttribute.cs
  // https://referencesource.microsoft.com/#System.ComponentModel.DataAnnotations/DataAnnotations/EmailAddressAttribute.cs,54
  export const EMAIL_ADDRESS_REGEX =
    // eslint-disable-next-line no-control-regex
    /^((([a-zA-Z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;

  // 有効期限の最大値
  export const EXPIRY_DATE_MAXIMUM = dayjs("2099-12-31", "YYYY-MM-DD");

  // マスタ取得種別
  export enum MasterGetType {
    AIRLINE = 1,
    AIRPORT = 2,
    NTF = 4,
    SOALA_EVT = 8,
    CD_CTRL_DTL = 16,
    JOB = 32,
    GRP = 64,
    COMM_GRP = 128,
    ADGRP = 256,
    SHIP = 512,
    SPCL_CARE_GRP = 1024,
    SSR = 2048,
    SPCL_LOAD = 4096,
    DLY_RSN = 8196,
    MVT_MSG_REMARKS = 16384,
  }

  // 掲示板添付ファイルのサムネイルに表示する、MIME-Typeの一覧
  export const IMAGE_MIMETYPE_REGEX = /^image\/(png|jpeg|gif|bmp)$/;
}
