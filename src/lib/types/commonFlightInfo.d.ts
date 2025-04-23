/* eslint-disable @typescript-eslint/no-unused-vars */
namespace CommonFlightInfo {
  interface Legkey {
    orgDateLcl: string;
    alCd: string;
    fltNo: string;
    casFltNo: string | null;
    skdDepApoCd: string;
    skdArrApoCd: string;
    skdLegSno: number;
  }
  interface DepDlyInfo {
    depDlyTime: number;
    depDlyTimeRsnCd: string;
  }
  namespace Response {
    interface DepInfo {
      etdLcl: string | null;
      tentativeEtdLcl: string | null;
      tentativeEtdCd: string | null;
      atdLcl: string;
      actToLcl: string;
      depDlyInfo: DepDlyInfo[];
      lstDepApoCd: string;
      lstDepApoTimeDiffUtc: number;
      stdLcl: string;
      firstAtdLcl: string;
      returnInLcl: string;
      estReturnInLcl: string;
      depApoSpotNo: string;
      rtrOccurCnt: number;
    }
    interface ArrInfo {
      etaLcl: string | null;
      tentativeEtaLcl: string | null;
      tentativeEtaCd: string | null;
      estBiLcl: string;
      tentativeEstLdLcl: string | null;
      tentativeEstLdCd: string | null;
      estLdLcl: string | null;
      actLdLcl: string | null;
      ataLcl: string;
      lstArrApoCd: string;
      lstArrApoTimeDiffUtc: number;
      staLcl: string;
      arrApoSpotNo: string;
    }
  }
  namespace Request {
    interface DepInfo {
      stdLcl: string | null;
      etdLcl: string | null;
      tentativeEtdLcl: string | null;
      tentativeEtdCd: string | null;
      atdLcl: string;
      actToLcl: string;
      depDlyInfo: DepDlyInfo[];
      firstAtdLcl: string;
      returnInLcl: string;
      estReturnInLcl: string;
    }
    interface ArrInfo {
      staLcl: string | null;
      etaLcl?: string | null;
      tentativeEtaLcl?: string | null;
      tentativeEtaCd?: string | null;
      estBiLcl: string;
      tentativeEstLdLcl: string | null;
      tentativeEstLdCd: string | null;
      estLdLcl: string | null;
      actLdLcl: string;
      ataLcl: string;
    }
    interface DepInfoSpotNo {
      depApoSpotNo: string;
    }
    interface ArrInfoSpotNo {
      arrApoSpotNo: string;
    }
  }
}
