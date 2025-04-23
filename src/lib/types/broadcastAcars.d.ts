/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Broadcast.Acars {
  /** S11105W2_情報発信-ACARS追加API リクエスト */
  export interface SendRequest extends TemplateDetail {
    orgnTtyAddr: string;
    templateId: number | null;
  }
  /** S11105W2_情報発信-ACARS追加API レスポンス */
  export interface SendResponse extends CommonHeaderResponse, Template {}
  /** S11105W4_情報発信-ACARSテンプレート取得API リクエスト */
  export interface FetchTemplateRequest {
    templateId: number;
  }
  /** S11105W4_情報発信-ACARSテンプレート取得API レスポンス */
  export interface FetchTemplateResponse extends CommonHeaderResponse, Template {}
  /** S11105W5_情報発信-ACARSテンプレート追加API リクエスト */
  export interface StoreTemplateRequest extends TemplateDetail {
    templateName: string;
  }
  /** S11105W5_情報発信-ACARSテンプレート追加API レスポンス */
  export interface StoreTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }
  /** S11105W6_情報発信-ACARSテンプレート更新API リクエスト */
  export type UpdateTemplateRequest = Template;
  /** S11105W6_情報発信-ACARSテンプレート更新API レスポンス */
  export interface UpdateTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }

  export interface Template extends TemplateDetail {
    templateId: number;
  }

  export interface TemplateDetail {
    shipNoList: string[];
    uplinkText: string;
    reqAckFlg: boolean;
  }
}
