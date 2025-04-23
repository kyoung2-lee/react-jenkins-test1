import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });

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

const isIPAddress = (host: string) => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^\[?[a-fA-F0-9:]+\]?$/;
  return ipv4Regex.test(host) || ipv6Regex.test(host);
};

const setOptions = {
  domain: getRootDomain(),
  path: "/",
};

export const setCookieEmail = (email: string) => cookies.set("email", email, setOptions);

export const getCookieEmail = () => cookies.get("email") as string;

export const removeCookieEmail = () => cookies.remove("email", setOptions);
