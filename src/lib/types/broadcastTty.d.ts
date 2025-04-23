/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Broadcast.Tty {
  /** S11104W2_情報発信-TTY送信追加API リクエスト */
  export interface SendRequest {
    ttyAddrList: string[];
    ttyPriorityCd: string;
    orgnTtyAddr: string;
    orgnTtyAddrFwFlg?: boolean;
    ttyAddrDivideFlg?: boolean;
    ttyText: string;
    templateId: number | null;
  }
  /** S11104W2_情報発信-TTY送信追加API レスポンス */
  export type SendResponse = CommonHeaderResponse;
  /** S11104W4_情報発信-TTY送信テンプレート取得API リクエスト */
  export interface FetchTemplateRequest {
    templateId: number;
  }
  /** S11104W4_情報発信-TTY送信テンプレート取得API レスポンス */
  export interface FetchTemplateResponse extends CommonHeaderResponse, Template {}
  /** S11104W5_情報発信-TTY送信テンプレート追加API リクエスト */
  export interface StoreTemplateRequest extends TemplateDetail {
    templateName: string;
  }
  /** S11104W5_情報発信-TTY送信テンプレート追加API レスポンス */
  export interface StoreTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }
  /** S11104W6_情報発信-TTY送信テンプレート更新API リクエスト */
  export type UpdateTemplateRequest = Template;
  /** S11104W6_情報発信-TTY送信テンプレート更新API レスポンス */
  export interface UpdateTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }

  export interface Template extends TemplateDetail {
    templateId: number;
  }

  export interface TemplateDetail {
    ttyAddrGrpIdList: number[];
    ttyAddrList: string[];
    ttyPriorityCd: string;
    ttyText: string;
  }
}
