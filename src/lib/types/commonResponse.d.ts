/* eslint-disable @typescript-eslint/no-unused-vars */
namespace CommonApi {
  interface CommonHeader {
    interfaceIdentifier: string;
    messageReference: MessageReference;
    messageFormatVersion: string;
    dataCount: number;
    apiVersion: string;
  }

  interface MessageReference {
    creatorReference: CreatorReference;
  }

  interface CreatorReference {
    creationTime: string;
    receiverSystem: string;
    senderSystem: string;
  }

  interface Flight {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string;
    lstDepApoCd: string;
    lstArrApoCd: string;
    csFlg: boolean;
  }

  interface ArrDepCtrl {
    trxId: string;
    seq: number;
    updateTime: string;
    apoCd: string;
    stdDate: string;
    arrInfoCd: "JAL" | "OA2" | null;
    arrInfoLegPhySno: number;
    arrInfoDispCd: string;
    depInfoCd: "JAL" | "OA2" | null;
    depInfoLegPhySno: number;
    depInfoDispCd: string;
    shipNo: string;
    spotNo: string;
    gndTime: string; // 地上作業経過時間(hhmm)
  }
}
