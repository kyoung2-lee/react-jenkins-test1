/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Broadcast.Bb {
  /** S11102W1_情報発信-掲示板取得API リクエスト */
  export interface FetchRequest {
    bbId: number;
  }
  /** S11102W1_情報発信-掲示板取得API レスポンス */
  export interface FetchResponse extends CommonHeaderResponse, BulletinBoard {}

  export interface BulletinBoard extends TemplateDetail, FlightLegKey {
    bbId: number;
    lstDepApoCd: string;
    lstArrApoCd: string;
    expiryDate: string;
    bbFileList: bbFlile[];
  }
  /** S11102W2_情報発信-掲示板追加API リクエスト */
  export interface SendRequest extends TemplateDetail, FlightLegKey {
    expiryDate: string;
    destinationList: Destination[];
    bbFileList: bbFlileDetail[];
    templateId: number | null;
    posLat: string | null;
    posLon: string | null;
  }
  /** S11102W2_情報発信-掲示板追加API レスポンス */
  export interface SendResponse extends CommonHeaderResponse {
    bbId: number;
  }
  /** S11102W3_情報発信-掲示板更新API リクエスト */
  export interface UpdateRequest extends TemplateDetail, FlightLegKey {
    bbId: number;
    expiryDate: string;
    destinationList: Destination[];
    bbFileList: bbFlileDetail[];
    posLat: string | null;
    posLon: string | null;
  }

  /** S11102W3_情報発信-掲示板更新API レスポンス */
  export interface UpdateResponse extends CommonHeaderResponse {
    bbId: number;
  }
  /** S11102W4_情報発信-掲示板テンプレート取得API リクエスト */
  export interface FetchTemplateRequest {
    templateId: number;
  }
  /** S11102W4_情報発信-掲示板テンプレート取得API レスポンス */
  export interface FetchTemplateResponse extends CommonHeaderResponse, Template {}
  /** S11102W5_情報発信-掲示板テンプレート追加API リクエスト */
  export interface StoreTemplateRequest extends TemplateDetail {
    templateName: string;
  }
  /** S11102W5_情報発信-掲示板テンプレート追加API レスポンス */
  export interface StoreTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }
  /** S11102W6_情報発信-掲示板テンプレート更新API リクエスト */
  export type UpdateTemplateRequest = Template;
  /** S11102W6_情報発信-掲示板テンプレート更新API レスポンス */
  export interface UpdateTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }
  /** S11102W7_情報発信-便区間取得API リクエスト */
  export interface FetchAllFlightLegRequest {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    casFltFlg: boolean;
  }
  /** S11102W7_情報発信-便区間取得API レスポンス */
  export interface FetchAllFlightLegResponse extends CommonHeaderResponse {
    flightLegList: FlightLeg[];
  }

  export interface Template extends TemplateDetail {
    templateId: number;
  }
  export interface TemplateDetail {
    catCdList: string[];
    commGrpIdList: number[];
    jobGrpIdList: number[];
    jobIdList: number[];
    bbTitle: string;
    bbText: string;
  }

  export interface FlightLeg extends FlightLegKey {
    lstDepApoCd: string;
    lstArrApoCd: string;
  }

  export interface FlightLegKey {
    legInfoCd: string;
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
  }

  interface Destination {
    jobId: number;
    jobCd: string;
  }

  interface bbFlile extends bbFlileDetail {
    fileId: number;
  }

  interface bbFlileDetail {
    fileName: string;
    fileObject: string;
    fileTmb: string;
    fileType: string;
  }
}
