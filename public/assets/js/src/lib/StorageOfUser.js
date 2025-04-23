"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageOfUser = exports.StorageOfUser = void 0;
const crypto_1 = require("crypto");
const dayjs_1 = __importDefault(require("dayjs"));
const commonConst_1 = require("./commonConst");
/**
 * ユーザー設定管理クラス
 */
class StorageOfUser {
    constructor() {
        this.key = "";
        this.KEY_PREFIX = "soalaUser:";
    }
    /**
     * ローカルストレージに保存するデータのKey名を生成
     */
    createKey(userId) {
        const hashText = (0, crypto_1.createHash)("sha256").update(userId).digest("hex"); // SHA-256のハッシュ値に変換
        return this.KEY_PREFIX + hashText;
    }
    /**
     * ローカルストレージからユーザー設定値を読み込み
     */
    loadUserData() {
        if (this.key) {
            const userData = localStorage.getItem(this.key);
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    }
    /**
     * ローカルストレージにユーザー設定値を保存
     */
    saveUserData(userData) {
        if (this.key) {
            const userDataWork = userData;
            userDataWork.updateTime = (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss");
            localStorage.setItem(this.key, JSON.stringify(userDataWork));
        }
    }
    /**
     * 初期化
     */
    init({ userId }) {
        // ローカルストレージに保存するキー名をセット
        this.key = this.createKey(userId);
    }
    /**
     * ログイン時のタイムスタンプを取得する
     */
    getLoginStamp() {
        const userData = this.loadUserData();
        if (userData && userData.loginStamp) {
            return userData.loginStamp;
        }
        return null;
    }
    /**
     * ログイン時のタイムスタンプを保存する
     */
    saveLoginStamp({ timeStamp }) {
        const userData = this.loadUserData();
        this.saveUserData({
            ...userData,
            loginStamp: timeStamp,
        });
    }
    /**
     * ログイン時のタイムスタンプをクリアする
     */
    clearLoginStamp() {
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
    initPushCounter() {
        const userData = this.loadUserData();
        this.saveUserData({
            ...userData,
            pCnt: { f: [], b: [] },
        });
    }
    /**
     * PUSH画面が開けるかチェックをする
     */
    checkPushCounter({ type, pageStamp, jobAuth }) {
        const userData = this.loadUserData();
        if (userData && userData.pCnt) {
            const { f, b } = userData.pCnt;
            if (type === "fis") {
                let levelCnt = 1;
                // authLevelが"L1"の場合は１画面、"L2"の場合は２画面開ける
                const auth = jobAuth.find((ja) => ja.funcId === commonConst_1.Const.FUNC_ID.updateFisAuto);
                if (auth) {
                    levelCnt = parseInt(auth.authLevel.slice(1), 10);
                    if (Number.isNaN(levelCnt))
                        levelCnt = 1;
                }
                if (f.includes(pageStamp) || f.length < levelCnt)
                    return true;
            }
            else if (type === "barChart") {
                if (b.includes(pageStamp) || b.length < 1)
                    return true;
            }
            return false;
        }
        return true;
    }
    /**
     * PUSH画面を追加する
     */
    addPushCounter({ type, pageStamp }) {
        const userData = this.loadUserData();
        if (userData && userData.pCnt) {
            const { f, b } = userData.pCnt;
            if (type === "fis") {
                if (!f.includes(pageStamp))
                    f.push(pageStamp);
            }
            else if (type === "barChart") {
                if (!b.includes(pageStamp))
                    b.push(pageStamp);
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
    removePushCounter({ type, pageStamp }) {
        const userData = this.loadUserData();
        if (userData && userData.pCnt) {
            let { f, b } = userData.pCnt;
            if (type === "fis") {
                f = userData.pCnt.f.filter((stamp) => stamp !== pageStamp);
            }
            else if (type === "barChart") {
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
    getHiddenSpotNoList({ apoCd }) {
        const userData = this.loadUserData();
        const filterSpotNo = userData ? userData.filterSpotNo : null;
        if (filterSpotNo) {
            const apo = filterSpotNo.apo.find((val) => val.apoCd === apoCd);
            if (apo && apo.hiddenSpotNo) {
                return apo.hiddenSpotNo;
            }
        }
        return [];
    }
    /**
     * SPOT番号フィルタ設定を保存
     */
    saveFilterSpotNo({ apoCd, hiddenSpotNo }) {
        const userData = this.loadUserData();
        let filterSpotNo = userData ? userData.filterSpotNo : null;
        if (filterSpotNo && filterSpotNo.apo) {
            if (filterSpotNo.apo.find((apo) => apo.apoCd === apoCd)) {
                filterSpotNo.apo = filterSpotNo.apo.map((apo) => {
                    if (apo.apoCd === apoCd) {
                        return { apoCd, hiddenSpotNo };
                    }
                    return apo;
                });
            }
            else {
                filterSpotNo.apo.push({ apoCd, hiddenSpotNo });
            }
        }
        else {
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
    saveDisplayFlightLines({ isDep, displayFlightLines }) {
        const userData = this.loadUserData();
        let arr;
        let dep;
        if (userData) {
            if (userData.displayFlightLines) {
                arr = userData.displayFlightLines.arr;
                dep = userData.displayFlightLines.dep;
            }
            if (isDep) {
                dep = displayFlightLines;
            }
            else {
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
    getDisplayFlightLines({ isDep }) {
        const userData = this.loadUserData();
        if (userData && userData.displayFlightLines) {
            return isDep ? userData.displayFlightLines.dep : userData.displayFlightLines.arr;
        }
        return undefined;
    }
    /**
     * CC: Sender Address (情報発信-e-mail送信画面) を取得
     */
    getBroadcastEmailCCSenderAddressChecked() {
        var _a;
        const userData = this.loadUserData();
        return (_a = userData === null || userData === void 0 ? void 0 : userData.broadcastEmailCCSenderAddressChecked) !== null && _a !== void 0 ? _a : true;
    }
    /**
    // CC: Sender Address (情報発信-e-mail送信画面) を保存
     */
    setBroadcastEmailCCSenderAddressChecked({ checked }) {
        const userData = this.loadUserData();
        this.saveUserData({
            ...userData,
            broadcastEmailCCSenderAddressChecked: checked,
        });
    }
    /**
     * CC: Sender Address (情報発信-TTY送信画面) を取得
     */
    getBroadcastTtyCCSenderAddressChecked() {
        var _a;
        const userData = this.loadUserData();
        return (_a = userData === null || userData === void 0 ? void 0 : userData.broadcastTtyCCSenderAddressChecked) !== null && _a !== void 0 ? _a : true;
    }
    /**
    // CC: Sender Address (情報発信-TTY送信画面) を保存
     */
    setBroadcastTtyCCSenderAddressChecked({ checked }) {
        const userData = this.loadUserData();
        this.saveUserData({
            ...userData,
            broadcastTtyCCSenderAddressChecked: checked,
        });
    }
    /**
     * Division Sending (情報発信-TTY送信画面) を取得
     */
    getBroadcastTtyDivisionSendingChecked() {
        var _a;
        const userData = this.loadUserData();
        return (_a = userData === null || userData === void 0 ? void 0 : userData.broadcastTtyDivisionSendingChecked) !== null && _a !== void 0 ? _a : false;
    }
    /**
     * Division Sending (情報発信-TTY送信画面) を保存
     */
    setBroadcastTtyDivisionSendingChecked({ checked }) {
        const userData = this.loadUserData();
        this.saveUserData({
            ...userData,
            broadcastTtyDivisionSendingChecked: checked,
        });
    }
    /**
     * ユーザー設定を全削除
     */
    remove() {
        if (this.key) {
            localStorage.removeItem(this.key);
        }
    }
}
exports.StorageOfUser = StorageOfUser;
exports.storageOfUser = new StorageOfUser();
//# sourceMappingURL=StorageOfUser.js.map