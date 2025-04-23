/* eslint-disable @typescript-eslint/no-unused-vars */
namespace AirportIssue {
  export interface Request {
    apoCd: string;
  }

  export interface RequestPost extends IssuTemplate {
    issuTime: string;
    issuMailFileList?: IssuMailFileList[];
    orgnMailAddr?: string;
    orgnTtyAddr?: string;
    [x: string]: unknown;
  }

  export interface ResponsePost {
    commonHeader: CommonApi.CommonHeader;
  }

  export interface Response {
    commonHeader: CommonApi.CommonHeader;
    now: string;
    mailAddrGrpList: AddrGrpList[];
    ttyAddrGrpList: AddrGrpList[];
    issuTemplateList: IssuTemplate[];
  }

  export interface AddrGrpList {
    addrGrpId: number;
    addrGrpCd: string;
    addrGrpType: string;
    addrGrpDispSeq: number;
  }

  export interface IssuTemplate {
    apoCd: string;
    issuCd?: string;
    issuDtlCd?: string;
    mailFlg: boolean;
    ttyFlg: boolean;
    mailAddrGrpList?: number[];
    mailAddrList?: string[];
    mailTitl?: string;
    mailText?: string;
    ttyAddrGrpList?: number[];
    ttyAddrList?: string[];
    ttyPriorityCd?: string;
    ttyText?: string;
  }

  export interface IssuTemplateResponse {
    commonHeader: CommonApi.CommonHeader;
    issu: IssuTemplate;
  }

  export interface IssuMailFileList {
    issuMailFileName: string;
    issuMailFile: string;
  }
}
