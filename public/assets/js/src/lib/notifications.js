"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCreator = void 0;
const reapop_1 = require("reapop");
// eslint-disable-next-line import/no-cycle
const common_1 = require("../reducers/common");
var NotificationCreator;
(function (NotificationCreator) {
    let maskedIds = []; // 同一IDでマスクが２重にかからないようにする
    /**
     * メッセージを全て削除
     */
    function removeAll({ dispatch }) {
        if (maskedIds.length > 0) {
            dispatch((0, common_1.hideMask)());
        }
        maskedIds = [];
        dispatch((0, reapop_1.dismissNotifications)());
    }
    NotificationCreator.removeAll = removeAll;
    /**
     * ID指定でメッセージを削除
     */
    function remove({ dispatch, id }) {
        // マスクがかかっている場合は外す
        if (maskedIds.find((v) => v === id)) {
            maskedIds = maskedIds.filter((v) => v !== id);
            dispatch((0, common_1.hideMask)());
        }
        dispatch((0, reapop_1.dismissNotification)(id));
    }
    NotificationCreator.remove = remove;
    /**
     * メッセージを表示
     */
    function create({ dispatch, id, message }) {
        let status = "none";
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
        const buttons = [];
        if (message.ok) {
            buttons.push({
                name: "OK",
                primary: true,
                onClick: () => {
                    if (id)
                        maskedIds = maskedIds.filter((v) => v !== id);
                    dispatch((0, common_1.hideMask)());
                    if (message.onOkButton) {
                        message.onOkButton();
                    }
                },
            });
        }
        else if (message.yes) {
            buttons.push({
                name: "YES",
                primary: true,
                onClick: () => {
                    if (id)
                        maskedIds = maskedIds.filter((v) => v !== id);
                    dispatch((0, common_1.hideMask)());
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
                    if (id)
                        maskedIds = maskedIds.filter((v) => v !== id);
                    dispatch((0, common_1.hideMask)());
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
                    dispatch((0, common_1.showMask)());
                }
            }
            else {
                // idが指定されていない時もマスクをかける
                dispatch((0, common_1.showMask)());
            }
            if (document.activeElement) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                document.activeElement.blur(); // 連打防止のために focus out.
            }
        }
        const notification = {
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
        dispatch((0, reapop_1.notify)(notification));
    }
    NotificationCreator.create = create;
    /**
     * 同じメッセージが重ならないように１つのメッセージで表示する（チラつく場合があるので多用しない）
     */
    function createWithOneMessage({ dispatch, currentId, newId, message, }) {
        if (currentId === undefined) {
            NotificationCreator.removeAll({ dispatch });
        }
        else {
            NotificationCreator.remove({ dispatch, id: currentId });
        }
        NotificationCreator.create({ dispatch, id: newId, message });
    }
    NotificationCreator.createWithOneMessage = createWithOneMessage;
})(NotificationCreator = exports.NotificationCreator || (exports.NotificationCreator = {}));
//# sourceMappingURL=notifications.js.map