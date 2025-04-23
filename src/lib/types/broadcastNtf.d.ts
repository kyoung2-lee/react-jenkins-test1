/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Broadcast.Ntf {
  /** S11106W2_情報発信-通知送信追加API リクエスト */
  export interface SendRequest {
    jobCdList: string[];
    ntfTitle: string;
    ntfText: string;
    soundFlg: boolean;
    templateId: number | null;
  }
  /** S11106W2_情報発信-通知送信追加API レスポンス */
  export type SendResponse = CommonHeaderResponse;
  /** S11106W4_情報発信-通知送信テンプレート取得API リクエスト */
  export interface FetchTemplateRequest {
    templateId: number;
  }
  /** S11106W4_情報発信-通知送信テンプレート取得API レスポンス */
  export interface FetchTemplateResponse extends CommonHeaderResponse, Template {}
  /** S11106W5_情報発信-通知送信テンプレート追加API リクエスト */
  export interface StoreTemplateRequest extends TemplateDetail {
    templateName: string;
  }
  /** S11106W5_情報発信-通知送信テンプレート追加API レスポンス */
  export interface StoreTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }
  /** S11106W6_情報発信-通知送信テンプレート更新API リクエスト */
  export type UpdateTemplateRequest = Template;
  /** S11106W6_情報発信-通知送信テンプレート更新API レスポンス */
  export interface UpdateTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }

  export interface Template extends TemplateDetail {
    templateId: number;
  }

  export interface TemplateDetail {
    commGrpIdList: number[];
    jobGrpIdList: number[];
    jobIdList: number[];
    ntfTitle: string;
    ntfText: string;
    soundFlg: boolean;
  }
}
