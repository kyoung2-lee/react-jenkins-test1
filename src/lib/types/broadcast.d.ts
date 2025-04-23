/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Broadcast {
  export interface CommonHeaderResponse {
    commonHeader: CommonApi.CommonHeader;
  }

  export type TemplateSortKey = "name" | "recentlyTime";

  export type TemplateOrder = "asc" | "desc";

  export interface FetchAllTemplateSort {
    sortKey: TemplateSortKey;
    order: TemplateOrder;
  }

  /** S11100W1_情報発信-テンプレート一覧取得API リクエスト */
  export interface FetchAllTemplateRequest {
    jobId: number;
    keyword?: string;
    sendBy?: string;
  }

  export type TemplateFilterConditions = Omit<FetchAllTemplateRequest, "jobId">;

  /** S11100W1_情報発信-テンプレート一覧取得API レスポンス */
  export interface FetchAllTemplateResponse extends CommonHeaderResponse {
    templateList: Template[];
  }
  /** S11100W2_情報発信-テンプレート名更新API リクエスト */
  export interface UpdateTemplateNameRequest {
    templateId: number;
    templateName: string;
  }
  /** S11100W2_情報発信-テンプレート名更新API レスポンス */
  export interface UpdateTemplateNameResponse extends CommonHeaderResponse {
    templateId: number;
  }
  /** S11100W3_情報発信-テンプレート削除API リクエスト */
  export interface DeleteTemplateRequest {
    templateId: number;
  }

  export interface Template {
    templateId: number;
    templateName: string;
    broadcastType: BroadcastType;
    recentlyTime: string;
  }

  export type BroadcastType = "BB" | "MAIL" | "TTY" | "AFTN" | "NTF" | "ACARS";
}
