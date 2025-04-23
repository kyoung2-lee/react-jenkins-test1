import { createHash } from "crypto";
import dayjs from "dayjs";
import { Const } from "./commonConst";

/**
 * ユーザー設定
 */
interface UserData {
  updateTime?: string;
  loginStamp?: number;
  pCnt?: PCnt;
  filterSpotNo?: FilterSpotNo;
  displayFlightLines?: DisplayFlightLines;
  broadcastEmailCCSenderAddressChecked?: boolean;
  broadcastTtyCCSenderAddressChecked?: boolean;
  broadcastTtyDivisionSendingChecked?: boolean;
}

/**
 * 自動更新中の画面
 */
interface PCnt {
  f: number[];
  b: number[];
}

/**
 * SPOT番号フィルタ設定
 */
interface FilterSpotNo {
  apo: Apo[];
}

/**
 * SPOT番号フィルタ設定の空港情報
 */
interface Apo {
  apoCd: string;
  hiddenSpotNo: string[];
}

/**
 * 便区間表示件数
 */
interface DisplayFlightLines {
  arr?: number;
  dep?: number;
}

/**
 * ユーザー設定管理クラス
 */
export class StorageOfUser {
  private key = "";
  private KEY_PREFIX = "soalaUser:";

  /**
   * ローカルストレージに保存するデータのKey名を生成
   */
  private createKey(userId: string): string {
    const hashText = createHash("sha256").update(userId).digest("hex"); // SHA-256のハッシュ値に変換
    return this.KEY_PREFIX + hashText;
  }

  /**
   * ローカルストレージからユーザー設定値を読み込み
   */
  private loadUserData(): UserData | null {
    if (this.key) {
      const userData = localStorage.getItem(this.key);
      return userData ? (JSON.parse(userData) as UserData) : null;
    }
    return null;
  }

  /**
   * ローカルストレージにユーザー設定値を保存
   */
  private saveUserData(userData: UserData): void {
    if (this.key) {
      const userDataWork = userData;
      userDataWork.updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      localStorage.setItem(this.key, JSON.stringify(userDataWork));
    }
  }

  /**
   * 初期化
   */
  init({ userId }: { userId: string }): void {
    // ローカルストレージに保存するキー名をセット
    this.key = this.createKey(userId);
  }

  /**
   * ログイン時のタイムスタンプを取得する
   */
  getLoginStamp(): number | null {
    const userData = this.loadUserData();
    if (userData && userData.loginStamp) {
      return userData.loginStamp;
    }
    return null;
  }

  /**
   * ログイン時のタイムスタンプを保存する
   */
  saveLoginStamp({ timeStamp }: { timeStamp: number }): void {
    const userData = this.loadUserData();
    this.saveUserData({
      ...userData,
      loginStamp: timeStamp,
    });
  }

  /**
   * ログイン時のタイムスタンプをクリアする
   */
  clearLoginStamp(): void {
    const userData = this.loadUserData();
    const loginStamp = undefined;
    this.saveUserData({
      ...userData,
      loginStamp,
    });
  }

  /**
   * PUSH画面数を初期化する
   */
  initPushCounter(): void {
    const userData = this.loadUserData();
    this.saveUserData({
      ...userData,
      pCnt: { f: [], b: [] },
    });
  }

  /**
   * PUSH画面が開けるかチェックをする
   */
  checkPushCounter({ type, pageStamp, jobAuth }: { type: "fis" | "barChart"; pageStamp: number; jobAuth: JobAuthApi.JobAuth[] }): boolean {
    const userData = this.loadUserData();
    if (userData && userData.pCnt) {
      const { f, b } = userData.pCnt;
      if (type === "fis") {
        let levelCnt = 1;
        // authLevelが"L1"の場合は１画面、"L2"の場合は２画面開ける
        const auth = jobAuth.find((ja) => ja.funcId === Const.FUNC_ID.updateFisAuto);
        if (auth) {
          levelCnt = parseInt(auth.authLevel.slice(1), 10);
          if (Number.isNaN(levelCnt)) levelCnt = 1;
        }
        if (f.includes(pageStamp) || f.length < levelCnt) return true;
      } else if (type === "barChart") {
        if (b.includes(pageStamp) || b.length < 1) return true;
      }
      return false;
    }
    return true;
  }

  /**
   * PUSH画面を追加する
   */
  addPushCounter({ type, pageStamp }: { type: "fis" | "barChart"; pageStamp: number }): void {
    const userData = this.loadUserData();
    if (userData && userData.pCnt) {
      const { f, b } = userData.pCnt;
      if (type === "fis") {
        if (!f.includes(pageStamp)) f.push(pageStamp);
      } else if (type === "barChart") {
        if (!b.includes(pageStamp)) b.push(pageStamp);
      }
      this.saveUserData({
        ...userData,
        pCnt: { f, b },
      });
    }
  }

  /**
   * PUSH画面を削除する
   */
  removePushCounter({ type, pageStamp }: { type: "fis" | "barChart"; pageStamp: number }): void {
    const userData = this.loadUserData();
    if (userData && userData.pCnt) {
      let { f, b } = userData.pCnt;
      if (type === "fis") {
        f = userData.pCnt.f.filter((stamp) => stamp !== pageStamp);
      } else if (type === "barChart") {
        b = userData.pCnt.b.filter((stamp) => stamp !== pageStamp);
      }
      this.saveUserData({
        ...userData,
        pCnt: { f, b },
      });
    }
  }

  /**
   * 非表示スポット番号の一覧を取得
   */
  getHiddenSpotNoList({ apoCd }: { apoCd: string }): Apo["hiddenSpotNo"] {
    const userData = this.loadUserData();
    const filterSpotNo = userData ? userData.filterSpotNo : null;

    if (filterSpotNo) {
      const apo: Apo | undefined = filterSpotNo.apo.find((val: Apo) => val.apoCd === apoCd);

      if (apo && apo.hiddenSpotNo) {
        return apo.hiddenSpotNo;
      }
    }

    return [];
  }

  /**
   * SPOT番号フィルタ設定を保存
   */
  saveFilterSpotNo({ apoCd, hiddenSpotNo }: { apoCd: string; hiddenSpotNo: string[] }): void {
    const userData = this.loadUserData();
    let filterSpotNo = userData ? userData.filterSpotNo : null;

    if (filterSpotNo && filterSpotNo.apo) {
      if (filterSpotNo.apo.find((apo: Apo) => apo.apoCd === apoCd)) {
        filterSpotNo.apo = filterSpotNo.apo.map((apo: Apo) => {
          if (apo.apoCd === apoCd) {
            return { apoCd, hiddenSpotNo };
          }

          return apo;
        });
      } else {
        filterSpotNo.apo.push({ apoCd, hiddenSpotNo });
      }
    } else {
      filterSpotNo = {
        apo: [{ apoCd, hiddenSpotNo }],
      };
    }
    if (userData) {
      userData.filterSpotNo = filterSpotNo;
      this.saveUserData(userData);
    }
  }

  /**
   * 便区間表示件数を保存する
   */
  saveDisplayFlightLines({ isDep, displayFlightLines }: { isDep: boolean; displayFlightLines: number }): void {
    const userData = this.loadUserData();
    let arr: number | undefined;
    let dep: number | undefined;
    if (userData) {
      if (userData.displayFlightLines) {
        arr = userData.displayFlightLines.arr;
        dep = userData.displayFlightLines.dep;
      }
      if (isDep) {
        dep = displayFlightLines;
      } else {
        arr = displayFlightLines;
      }
      this.saveUserData({
        ...userData,
        displayFlightLines: { arr, dep },
      });
    }
  }

  /**
   * 便区間表示件数を取得する
   */
  getDisplayFlightLines({ isDep }: { isDep: boolean }): number | undefined {
    const userData = this.loadUserData();
    if (userData && userData.displayFlightLines) {
      return isDep ? userData.displayFlightLines.dep : userData.displayFlightLines.arr;
    }
    return undefined;
  }

  /**
   * CC: Sender Address (情報発信-e-mail送信画面) を取得
   */
  getBroadcastEmailCCSenderAddressChecked(): boolean {
    const userData = this.loadUserData();
    return userData?.broadcastEmailCCSenderAddressChecked ?? true;
  }

  /**
  // CC: Sender Address (情報発信-e-mail送信画面) を保存
   */
  setBroadcastEmailCCSenderAddressChecked({ checked }: { checked: boolean }): void {
    const userData = this.loadUserData();
    this.saveUserData({
      ...userData,
      broadcastEmailCCSenderAddressChecked: checked,
    });
  }

  /**
   * CC: Sender Address (情報発信-TTY送信画面) を取得
   */
  getBroadcastTtyCCSenderAddressChecked(): boolean {
    const userData = this.loadUserData();
    return userData?.broadcastTtyCCSenderAddressChecked ?? true;
  }

  /**
  // CC: Sender Address (情報発信-TTY送信画面) を保存
   */
  setBroadcastTtyCCSenderAddressChecked({ checked }: { checked: boolean }): void {
    const userData = this.loadUserData();
    this.saveUserData({
      ...userData,
      broadcastTtyCCSenderAddressChecked: checked,
    });
  }

  /**
   * Division Sending (情報発信-TTY送信画面) を取得
   */
  getBroadcastTtyDivisionSendingChecked(): boolean {
    const userData = this.loadUserData();
    return userData?.broadcastTtyDivisionSendingChecked ?? false;
  }

  /**
   * Division Sending (情報発信-TTY送信画面) を保存
   */
  setBroadcastTtyDivisionSendingChecked({ checked }: { checked: boolean }): void {
    const userData = this.loadUserData();
    this.saveUserData({
      ...userData,
      broadcastTtyDivisionSendingChecked: checked,
    });
  }

  /**
   * ユーザー設定を全削除
   */
  remove(): void {
    if (this.key) {
      localStorage.removeItem(this.key);
    }
  }
}

export const storageOfUser = new StorageOfUser();
