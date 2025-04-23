/* eslint-disable @typescript-eslint/no-unused-vars */
namespace MasterApi {
  interface Request {
    masterGetType: number;
  }

  interface Response {
    commonHeader: CommonApi.CommonHeader;
    airline?: Airline[];
    airport?: Airport[];
    ntfInfo?: NtfInfo;
    cdCtrlDtl?: CdCtrlDtl[];
    job?: Job[];
    grp?: Grp[];
    commGrp?: CommGrp[];
    adGrp?: AdGrp[];
    ship?: Ship[];
    spclCareGrp?: SpclCareGrp[];
    ssr?: Ssr[];
    spclLoad?: SpclLoad[];
    dlyRsn?: DlyRsn[];
    mvtMsgRmks?: MvtMsgRmk[];
  }

  interface Airline {
    alCd: string;
    jalGrpFlg: boolean;
    dispSeq: number;
  }

  interface Airport {
    apoCd: string;
    dispSeq: number;
  }

  interface NtfInfo {
    ntf?: Ntf[];
    soalaEvt?: SoalaEvt[];
  }

  interface Ntf {
    ntfCd: string;
    ntfTypeCd: string;
    dispName: string;
    dispSeq: number;
    awsEventCd: string;
  }

  interface SoalaEvt {
    eventCd: string;
    eventName: string;
    ntfIcon: string;
  }

  interface CdCtrlDtl {
    cdCls: string;
    cdCat1: string;
    cdCat2: string;
    cd1: string;
    cd2: string;
    cd3: string;
    cd4: string;
    cd5: string;
    num1: number;
    num2: number;
    num3: number;
    num4: number;
    num5: number;
    flg1: bool;
    flg2: bool;
    flg3: bool;
    flg4: bool;
    flg5: bool;
    date1: string;
    date2: string;
    date3: string;
    date4: string;
    date5: string;
    txt1: string;
    txt2: string;
    txt3: string;
    txt4: string;
    txt5: string;
    txt6: string;
  }

  interface Job {
    jobId: number;
    jobCd: string;
    grpId: number;
  }

  interface Grp {
    grpId: number;
    grpCd: string;
    grpDispSeq: number;
  }

  interface CommGrp {
    commGrpId: number;
    commGrpCd: string;
    commGrpDispSeq: number;
  }

  interface AdGrp {
    addrGrpId: number;
    addrGrpCd: string;
    addrGrpType: string;
    addrGrpDispSeq: number;
  }

  interface Ship {
    shipNo: string;
  }

  interface SpclCareGrp {
    spclCareGrpId: number;
    spclCareGrpName: string;
    spclCareGrpIcon: string;
  }

  interface Ssr {
    ssrCd: string;
    ssrCdInfo: string;
  }

  interface SpclLoad {
    spclLoadCd: string;
    spclLoadCdInfo: string;
  }

  interface DlyRsn {
    dlyRsnJalCd: string;
    arrDepCd: string;
    dispSeq: number;
  }

  interface MvtMsgRmk {
    mvtMsgRmks: string;
    dispSeq: number;
  }
}
