/* eslint-disable @typescript-eslint/no-unused-vars */
declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.svg?component" {
  const component: React.FC;
  export default component;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

/* React-Select 3.0.4 ではまだcreatableを参照できなかったので追加 */
// declare module 'react-select/creatable' {
//   import Creatable from 'react-select/lib/Creatable';
//   export * from 'react-select/lib/Creatable';
//   export default Creatable;
// }
type ConnectDbCat = "O" | "P";
type FisStsType =
  | "CNL"
  | "SKC"
  | "SHP"
  | "ADV"
  | "DLY"
  | "MNT"
  | "FUL"
  | "DOR"
  | "B/O"
  | "GTB"
  | "T/O"
  | "APP"
  | "G/A"
  | "HLD"
  | "ATB"
  | "DIV"
  | "L/D"
  | "B/I"
  | "H/J"
  | ""
  | null;
type IrrStsType = "GTB" | "ATB" | "DIV" | "" | null;
type BbRacFuncType = 1 | 2;

// iOSの呼び出しメソッド
interface IosFunction {
  postMessage(message: unknown): void;
}
interface IosPreviewFile {
  postMessage(message: { fileName: string; dataUri: string }): void;
}
interface MessageHandlers {
  getNotificationList: IosFunction;
  addNotificationListCompleted: IosFunction;
  unreadCountChanged: IosFunction;
  getJobAuthInfo: IosFunction;
  saveJobAuthInfo: IosFunction;
  getLoginUserInfo: IosFunction;
  getLoginModelId: IosFunction;
  getLocation: IosFunction;
  registNotification: IosFunction;
  userLoginCompleted: IosFunction;
  clearLogin: IosFunction;
  debugLog: IosFunction;
  previewFile: IosPreviewFile;
  saveTokenToKeychain: IosFunction;
  saveEmailToKeychain: IosFunction;
  readEmailFromKeychain: IosFunction;
  sendCognitoTokenFromSwift: IosFunction;
  signIn: IosFunction;
  signOut: IosFunction;
  clearKeyChain: IosFunction;
}
interface Webkit {
  messageHandlers: MessageHandlers;
}
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
interface Window {
  webkit: Webkit;
  // iOSの受け取りメソッド
  iLocation: (latitude: string, longitude: string) => void;
  iLoginModelId: (modelId: string, terminalCat: string) => void;
  iLogout: () => void;
  iAddNotificationList: (messagesJson: string) => void;
  iSetBadgeNumber: (badgeNumber: number) => void;
  iJobAuthInfo: (jobCd: string, jobAuthCd: string) => void;
}
