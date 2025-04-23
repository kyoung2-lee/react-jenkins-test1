/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, MiddlewareAPI, Action } from "redux";
import { FormAction } from "redux-form";
import isArray from "lodash.isarray";
import { RootState } from "../storeType";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";

const SET_SUBMIT_FAILED = "@@redux-form/SET_SUBMIT_FAILED";

const formErrors = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: Action & FormAction) => {
  switch (action.type) {
    // バリデーション通知の表示
    case SET_SUBMIT_FAILED: {
      const { form: forms = {}, notifications = [] } = store.getState();

      if (notifications.length) {
        NotificationCreator.removeAll({ dispatch: store.dispatch });
      }

      // バリデーションエラーから通知用のMessage関数を抽出する関数
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const collectMessageFunctions = (syncErrors: any): (() => SoalaMessage.Message)[] => {
        const functions: (() => SoalaMessage.Message)[] = [];
        // フィールド毎にMessage関数を取り出す
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.keys(syncErrors).forEach((fieldName) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const error = syncErrors[fieldName];
          if (toString.call(error) === "[object Function]") {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            functions.push(error);
          } else if (toString.call(error) === "[object Object]") {
            const collectedFunctions = collectMessageFunctions(error); // 再帰の呼び出し
            Array.prototype.push.apply(functions, collectedFunctions);
          } else if (isArray(error)) {
            error.forEach((errorSub: any) => {
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
            NotificationCreator.create({ dispatch: store.dispatch, message: messageFunction() });
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

export default formErrors;
