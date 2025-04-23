/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Broadcast.Email {
  /** S11103W2_情報発信-e-mail追加API リクエスト */
  export interface SendRequest {
    mailAddrList: string[];
    orgnMailAddr: string;
    mailTitle: string;
    mailText: string;
    mailFileList: MailFile[];
    templateId: number | null;
  }
  /** S11103W2_情報発信-e-mail追加API レスポンス */
  export type SendResponse = CommonHeaderResponse;
  /** S11103W4_情報発信-e-mailテンプレート取得API リクエスト */
  export interface FetchTemplateRequest {
    templateId: number;
  }
  /** S11103W4_情報発信-e-mailテンプレート取得API レスポンス */
  export interface FetchTemplateResponse extends CommonHeaderResponse, Template {}
  /** S11103W5_情報発信-e-mailテンプレート追加API リクエスト */
  export interface StoreTemplateRequest extends TemplateDetail {
    templateName: string;
  }
  /** S11103W5_情報発信-e-mailテンプレート追加API レスポンス */
  export interface StoreTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }
  /** S11103W6_情報発信-e-mailテンプレート更新API リクエスト */
  export type UpdateTemplateRequest = Template;
  /** S11103W6_情報発信-e-mailテンプレート更新API レスポンス */
  export interface UpdateTemplateResponse extends CommonHeaderResponse {
    templateId: number;
  }

  export interface Template extends TemplateDetail {
    templateId: number;
  }

  export interface TemplateDetail {
    mailAddrGrpIdList: number[];
    mailAddrList: string[];
    mailTitle: string;
    mailText: string;
  }

  interface MailFile {
    fileName: string;
    fileObject: string;
  }
}
