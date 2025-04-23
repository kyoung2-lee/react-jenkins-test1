/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Broadcast.Aftn {
  /** S11107W2_AFTN送信画面追加API リクエスト */
  export interface SendRequest {
    priority: string;
    originator: string;
    aftnText: string;
    templateId: number | null;
  }
  /** S11107W2_AFTN送信画面追加API レスポンス */
  export type SendResponse = CommonHeaderResponse;
  /** S11107W4_AFTN送信画面テンプレート取得API リクエスト */
  export interface FetchTemplateRequest {
    templateId: number;
  }
  /** S11107W4_AFTN送信画面テンプレート取得API レスポンス */
  export interface FetchTemplateResponse extends CommonHeaderResponse, Template {}

  /** S11104W5_AFTN送信画面テンプレート追加API リクエスト */
  export interface StoreTemplateRequest extends TemplateDetail {
    templateName: string;
  }
  /** S11104W5_AFTN送信画面テンプレート追加API レスポンス */
  export interface StoreTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }
  /** S11104W6_AFTN送信画面テンプレート更新API リクエスト */
  export type UpdateTemplateRequest = Template;
  /** S11104W6_AFTN送信画面テンプレート更新API レスポンス */
  export interface UpdateTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }

  export interface Template extends TemplateDetail {
    templateId: number;
  }

  export interface TemplateDetail {
    priority: string;
    aftnText: string;
  }
}
