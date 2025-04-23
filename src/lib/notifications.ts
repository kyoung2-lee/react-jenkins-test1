import { Notification, Status, notify, dismissNotification, dismissNotifications } from "reapop";
// eslint-disable-next-line import/no-cycle
import { showMask, hideMask } from "../reducers/common";
import { AppDispatch } from "../store/storeType";

export namespace NotificationCreator {
  let maskedIds: string[] = []; // 同一IDでマスクが２重にかからないようにする

  /**
   * メッセージを全て削除
   */
  export function removeAll({ dispatch }: { dispatch: AppDispatch }) {
    if (maskedIds.length > 0) {
      dispatch(hideMask());
    }
    maskedIds = [];
    dispatch(dismissNotifications());
  }

  /**
   * ID指定でメッセージを削除
   */
  export function remove({ dispatch, id }: { dispatch: AppDispatch; id: string }) {
    // マスクがかかっている場合は外す
    if (maskedIds.find((v) => v === id)) {
      maskedIds = maskedIds.filter((v) => v !== id);
      dispatch(hideMask());
    }
    dispatch(dismissNotification(id));
  }

  export type NotificationType = Notification;

  export interface Message {
    type: "default" | "updated" | "success" | "info" | "warning" | "error";
    title: string;
    message: string;
    dismissAfter?: number; // 未指定(buttonなし)：クリックで消せる
    ok?: boolean;
    yes?: boolean;
    no?: boolean;
    onOkButton?: () => void;
    onYesButton?: () => void;
    onNoButton?: () => void;
    onClose?: () => void;
  }

  /**
   * メッセージを表示
   */
  export function create({ dispatch, id, message }: { dispatch: AppDispatch; id?: string; message: Message }) {
    let status: Status = "none";
    switch (message.type) {
      case "updated":
        status = "loading";
        break;
      case "success":
        status = "success";
        break;
      case "info":
        status = "info";
        break;
      case "warning":
        status = "warning";
        break;
      case "error":
        status = "error";
        break;
      default:
        break;
    }

    let dismissible = true;
    let closeButton = false;
    if (message.ok || message.yes || message.no) {
      dismissible = false;
      closeButton = true;
    }

    const buttons: { name: string; primary: boolean; onClick(): void }[] = [];

    if (message.ok) {
      buttons.push({
        name: "OK",
        primary: true,
        onClick: () => {
          if (id) maskedIds = maskedIds.filter((v) => v !== id);
          dispatch(hideMask());
          if (message.onOkButton) {
            message.onOkButton();
          }
        },
      });
    } else if (message.yes) {
      buttons.push({
        name: "YES",
        primary: true,
        onClick: () => {
          if (id) maskedIds = maskedIds.filter((v) => v !== id);
          dispatch(hideMask());
          if (message.onYesButton) {
            message.onYesButton();
          }
        },
      });
    }

    if (message.no) {
      buttons.push({
        name: "NO",
        primary: false,
        onClick: () => {
          if (id) maskedIds = maskedIds.filter((v) => v !== id);
          dispatch(hideMask());
          if (message.onNoButton) {
            message.onNoButton();
          }
        },
      });
    }

    if (buttons.length > 0) {
      if (id) {
        // 同じメッセージが存在しない時だけマスクをかける
        if (!maskedIds.find((v) => v === id)) {
          maskedIds.push(String(id));
          dispatch(showMask());
        }
      } else {
        // idが指定されていない時もマスクをかける
        dispatch(showMask());
      }
      if (document.activeElement) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        document.activeElement.blur(); // 連打防止のために focus out.
      }
    }

    const notification: Partial<Notification> = {
      id,
      title: message.title,
      message: message.message,
      status,
      position: "bottom-center",
      dismissible,
      dismissAfter: message.dismissAfter || 0,
      closeButton,
      buttons,
      allowHTML: true,
    };
    dispatch(notify(notification));
  }

  /**
   * 同じメッセージが重ならないように１つのメッセージで表示する（チラつく場合があるので多用しない）
   */
  export function createWithOneMessage({
    dispatch,
    currentId,
    newId,
    message,
  }: {
    dispatch: AppDispatch;
    currentId?: string;
    newId: string;
    message: Message;
  }) {
    if (currentId === undefined) {
      NotificationCreator.removeAll({ dispatch });
    } else {
      NotificationCreator.remove({ dispatch, id: currentId });
    }
    NotificationCreator.create({ dispatch, id: newId, message });
  }
}
