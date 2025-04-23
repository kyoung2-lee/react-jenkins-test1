"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_isarray_1 = __importDefault(require("lodash.isarray"));
const notifications_1 = require("../../lib/notifications");
const SET_SUBMIT_FAILED = "@@redux-form/SET_SUBMIT_FAILED";
const formErrors = (store) => (next) => (action) => {
    switch (action.type) {
        // バリデーション通知の表示
        case SET_SUBMIT_FAILED: {
            const { form: forms = {}, notifications = [] } = store.getState();
            if (notifications.length) {
                notifications_1.NotificationCreator.removeAll({ dispatch: store.dispatch });
            }
            // バリデーションエラーから通知用のMessage関数を抽出する関数
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const collectMessageFunctions = (syncErrors) => {
                const functions = [];
                // フィールド毎にMessage関数を取り出す
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                Object.keys(syncErrors).forEach((fieldName) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    const error = syncErrors[fieldName];
                    if (toString.call(error) === "[object Function]") {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        functions.push(error);
                    }
                    else if (toString.call(error) === "[object Object]") {
                        const collectedFunctions = collectMessageFunctions(error); // 再帰の呼び出し
                        Array.prototype.push.apply(functions, collectedFunctions);
                    }
                    else if ((0, lodash_isarray_1.default)(error)) {
                        error.forEach((errorSub) => {
                            if (errorSub) {
                                const collectedFunctions = collectMessageFunctions(errorSub); // 再帰の呼び出し
                                Array.prototype.push.apply(functions, collectedFunctions);
                            }
                        });
                    }
                });
                // return _.uniq(functions);  //重複を削除 ※格納されたオブジェクトによって挙動が変わるので削除
                return functions.length > 0 ? [functions[0]] : []; // １メッセージだけ取り出し
            };
            // フォーム毎のsyncErrorからMessageを取り出し通知を表示する
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const targetForm = action.meta.form;
            // issueSecurityは、バリデーションエラーを独自に表示しているため除外
            if (targetForm !== "issueSecurity") {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const form = forms[targetForm];
                if (form) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const { syncErrors = {} } = form;
                    // Messageを取り出し通知を表示する
                    collectMessageFunctions(syncErrors).forEach((messageFunction) => {
                        notifications_1.NotificationCreator.create({ dispatch: store.dispatch, message: messageFunction() });
                    });
                }
            }
            return next(action);
        }
        default: {
            return next(action);
        }
    }
};
exports.default = formErrors;
//# sourceMappingURL=formErrors.js.map