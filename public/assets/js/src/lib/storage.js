"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const commonConst_1 = require("./commonConst");
/**
 * Storageへのアクセス
 */
class Storage {
    constructor() {
        this.DisplayMode = {
            lightMode: "0",
            darkMode: "1",
        };
    }
    get storageKey() {
        return {
            token: "token",
            terminalCat: "terminalCat",
            loginStamp: "loginStamp",
            pageStamp: "pageStamp",
            masterResponse: "masterResponse",
            jobAuthResponse: "jobAuthResponse",
            displayMode: "displayMode",
            zoomFis: "zoomFis",
            zoomBarChart: "zoomBarChart",
            switchingAutoReloadOn: "switchingAutoReloadOn",
            myScheduleSaveTask: "myScheduleSaveTask",
            broadcastEmailCCSenderAddressChecked: "broadcastEmailCCSenderAddressChecked",
            broadcastTtyCCSenderAddressChecked: "broadcastTtyCCSenderAddressChecked",
            airPortIssueEmailCCSenderAddressChecked: "airPortIssueEmailCCSenderAddressChecked",
            airPortIssueTtyCCSenderAddressChecked: "airPortIssueTtyCCSenderAddressChecked",
            takeOffTimeMaint: "takeOffTimeMaint",
            cognitoLoginType: "cognitoLoginType",
            cognitoToken: "cognitoToken",
            cognitoIdentityServiceProvider: "CognitoIdentityServiceProvider",
        };
    }
    // 全てクリア
    clear() {
        sessionStorage.clear();
    }
    // アクセストークン
    get token() {
        return sessionStorage.getItem(this.storageKey.token);
    }
    set token(value) {
        if (value) {
            sessionStorage.setItem(this.storageKey.token, value);
        }
        else {
            sessionStorage.removeItem(this.storageKey.token);
        }
    }
    // 端末区分
    get terminalCat() {
        const value = sessionStorage.getItem(this.storageKey.terminalCat);
        if (value) {
            return value;
        }
        return null;
    }
    set terminalCat(value) {
        if (value) {
            sessionStorage.setItem(this.storageKey.terminalCat, value);
        }
        else {
            sessionStorage.removeItem(this.storageKey.terminalCat);
        }
    }
    get isPc() {
        return this.terminalCat === commonConst_1.Const.TerminalCat.pc;
    }
    get isIpad() {
        return this.terminalCat === commonConst_1.Const.TerminalCat.iPad;
    }
    get isIphone() {
        return this.terminalCat === commonConst_1.Const.TerminalCat.iPhone;
    }
    // ログイン時のタイムスタンプ
    get loginStamp() {
        const value = sessionStorage.getItem(this.storageKey.loginStamp);
        if (value) {
            return value ? parseInt(value, 10) : null;
        }
        return null;
    }
    set loginStamp(value) {
        if (value) {
            sessionStorage.setItem(this.storageKey.loginStamp, String(value));
        }
        else {
            sessionStorage.removeItem(this.storageKey.loginStamp);
        }
    }
    // 新規タブOPEN時のタイムスタンプ
    get pageStamp() {
        const value = sessionStorage.getItem(this.storageKey.pageStamp);
        if (value) {
            return value ? parseInt(value, 10) : null;
        }
        return null;
    }
    set pageStamp(value) {
        if (value) {
            sessionStorage.setItem(this.storageKey.pageStamp, String(value));
        }
        else {
            sessionStorage.removeItem(this.storageKey.pageStamp);
        }
    }
    // マスタAPIのレスポンスデータ
    get masterResponse() {
        return sessionStorage.getItem(this.storageKey.masterResponse);
    }
    set masterResponse(value) {
        if (value) {
            sessionStorage.setItem(this.storageKey.masterResponse, value);
        }
        else {
            sessionStorage.removeItem(this.storageKey.masterResponse);
        }
    }
    // ジョブ権限APIのレスポンスデータ
    get jobAuthResponse() {
        return sessionStorage.getItem(this.storageKey.jobAuthResponse);
    }
    set jobAuthResponse(value) {
        if (value) {
            sessionStorage.setItem(this.storageKey.jobAuthResponse, value);
        }
        else {
            sessionStorage.removeItem(this.storageKey.jobAuthResponse);
        }
    }
    // 画面モード
    get displayMode() {
        const value = localStorage.getItem(this.storageKey.displayMode);
        if (value === this.DisplayMode.lightMode) {
            return "lightMode";
        }
        if (value === this.DisplayMode.darkMode) {
            return "darkMode";
        }
        return null;
    }
    set displayMode(value) {
        if (value === "lightMode") {
            localStorage.setItem(this.storageKey.displayMode, this.DisplayMode.lightMode);
        }
        else if (value === "darkMode") {
            localStorage.setItem(this.storageKey.displayMode, this.DisplayMode.darkMode);
        }
        else {
            localStorage.removeItem(this.storageKey.displayMode);
        }
    }
    // ZOOM（FIS）
    get zoomFis() {
        const value = localStorage.getItem(this.storageKey.zoomFis);
        const zoom = Number(value);
        if (Number.isNaN(zoom) || !zoom) {
            return 100;
        }
        return zoom;
    }
    set zoomFis(value) {
        localStorage.setItem(this.storageKey.zoomFis, String(value));
    }
    // ZOOM（BarChart）
    get zoomBarChart() {
        const value = localStorage.getItem(this.storageKey.zoomBarChart);
        const zoom = Number(value);
        if (Number.isNaN(zoom) || !zoom) {
            return 100;
        }
        return zoom;
    }
    set zoomBarChart(value) {
        localStorage.setItem(this.storageKey.zoomBarChart, String(value));
    }
    // 自動更新をONに切り替え中
    get switchingAutoReloadOn() {
        let checked = false;
        const value = sessionStorage.getItem(this.storageKey.switchingAutoReloadOn);
        if (value && value === "1") {
            checked = true;
        }
        return checked;
    }
    set switchingAutoReloadOn(checked) {
        sessionStorage.setItem(this.storageKey.switchingAutoReloadOn, checked ? "1" : "0");
    }
    // MySchedule画面 選択中タスク
    get myScheduleSaveTask() {
        const value = localStorage.getItem(this.storageKey.myScheduleSaveTask);
        if (value) {
            return parseInt(value, 10);
        }
        return undefined;
    }
    set myScheduleSaveTask(key) {
        if (key) {
            localStorage.setItem(this.storageKey.myScheduleSaveTask, key.toString());
        }
        else {
            localStorage.removeItem(this.storageKey.myScheduleSaveTask);
        }
    }
    // CC: Sender Address (空港発令-e-mail送信画面)
    get airPortIssueEmailCCSenderAddressChecked() {
        let checked = true;
        const value = localStorage.getItem(this.storageKey.airPortIssueEmailCCSenderAddressChecked);
        if (value && value === "0") {
            checked = false;
        }
        return checked;
    }
    set airPortIssueEmailCCSenderAddressChecked(checked) {
        localStorage.setItem(this.storageKey.airPortIssueEmailCCSenderAddressChecked, checked ? "1" : "0");
    }
    // CC: Sender Address (空港発令-TTY送信画面)
    get airPortIssueTtyCCSenderAddressChecked() {
        let checked = true;
        const value = localStorage.getItem(this.storageKey.airPortIssueTtyCCSenderAddressChecked);
        if (value && value === "0") {
            checked = false;
        }
        return checked;
    }
    set airPortIssueTtyCCSenderAddressChecked(checked) {
        localStorage.setItem(this.storageKey.airPortIssueTtyCCSenderAddressChecked, checked ? "1" : "0");
    }
    // JALG便でT/Oした後の出発系時刻の編集可否（便動態更新画面）
    // UIは用意せずデベロッパーツールなどで直接値を設定することが前提なため、getのみを定義
    get takeOffTimeMaint() {
        let checked = false;
        const value = localStorage.getItem(this.storageKey.takeOffTimeMaint);
        if (value && value === "1") {
            checked = true;
        }
        return checked;
    }
    set cognitoLoginType(loginType) {
        if (loginType) {
            sessionStorage.setItem(this.storageKey.cognitoLoginType, loginType);
        }
        else {
            sessionStorage.removeItem(this.storageKey.cognitoLoginType);
        }
    }
    get cognitoLoginType() {
        return sessionStorage.getItem(this.storageKey.cognitoLoginType);
    }
    set cognitoToken(token) {
        if (token) {
            sessionStorage.setItem(this.storageKey.cognitoToken, token);
        }
        else {
            sessionStorage.removeItem(this.storageKey.cognitoToken);
        }
    }
    get cognitoToken() {
        return sessionStorage.getItem(this.storageKey.cognitoToken);
    }
    getExternalUserTokenForIos() {
        let tokens = {};
        [...Array(window.sessionStorage.length).keys()].forEach((index) => {
            const key = window.sessionStorage.key(index);
            if ((key === null || key === void 0 ? void 0 : key.indexOf(this.storageKey.cognitoIdentityServiceProvider)) === 0 || key === this.storageKey.cognitoLoginType) {
                const item = sessionStorage.getItem(key);
                if (item) {
                    tokens = Object.assign(tokens, {
                        [key]: sessionStorage.getItem(key),
                    });
                }
            }
        });
        return tokens;
    }
}
exports.storage = new Storage();
//# sourceMappingURL=storage.js.map