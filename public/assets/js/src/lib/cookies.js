"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCookieEmail = exports.getCookieEmail = exports.setCookieEmail = void 0;
const universal_cookie_1 = __importDefault(require("universal-cookie"));
const cookies = new universal_cookie_1.default(null, { path: "/" });
/**
 * ルートドメインを返す（簡易バージョン）※国別ドメインには使えない
 */
const getRootDomain = () => {
    const { hostname } = window.location;
    // IPアドレスの場合はそのまま返す
    if (isIPAddress(hostname)) {
        return hostname;
    }
    const parts = hostname.split(".");
    if (parts.length > 2) {
        return parts.slice(-2).join("."); // 末尾2つを結合
    }
    return hostname; // サブドメインがない場合そのまま返す
};
const isIPAddress = (host) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^\[?[a-fA-F0-9:]+\]?$/;
    return ipv4Regex.test(host) || ipv6Regex.test(host);
};
const setOptions = {
    domain: getRootDomain(),
    path: "/",
};
const setCookieEmail = (email) => cookies.set("email", email, setOptions);
exports.setCookieEmail = setCookieEmail;
const getCookieEmail = () => cookies.get("email");
exports.getCookieEmail = getCookieEmail;
const removeCookieEmail = () => cookies.remove("email", setOptions);
exports.removeCookieEmail = removeCookieEmail;
//# sourceMappingURL=cookies.js.map