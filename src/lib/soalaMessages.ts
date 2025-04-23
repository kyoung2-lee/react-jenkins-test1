import { NotificationCreator } from "./notifications";

export namespace SoalaMessage {
  export type Message = NotificationCreator.Message;

  /**
   * Update Status | being updated...
   */
  export function M30001C(): Message {
    return {
      type: "updated",
      title: "Update Status",
      message: "The data is being updated...",
    };
  }
  /**
   * Update Status | successfully completed
   */
  export function M30002C(): Message {
    return {
      type: "success",
      title: "Update Status",
      message: "The data update has been successfully completed.",
      dismissAfter: 3000,
    };
  }
  /**
   * No Data Found | no data to display
   */
  export function M30003C(): Message {
    return {
      type: "info",
      title: "No Data Found",
      message: "There is no data to display.",
      dismissAfter: 3000,
    };
  }
  /**
   * Issue Security | save the template?
   */
  export function M30004C({
    issueType,
    onYesButton,
    onNoButton,
  }: {
    issueType: string;
    onYesButton?: () => void;
    onNoButton?: () => void;
  }): Message {
    return {
      type: "default",
      title: "",
      message: `Are you sure you want to save the ${issueType} template?`,
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Issue Security | send this Issue?
   */
  export function M30005C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "default",
      title: "",
      message: "Are you sure you want to send this Issue?",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Issue Security | send this Issue? There is no change
   */
  export function M30006C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "default",
      title: "",
      message: "Are you sure you want to send this Issue? There is no change from what has been previously sent.",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * No Data Found | Input Airport cannot be found.
   */
  export function M30007C(): Message {
    return {
      type: "info",
      title: "No Data Found",
      message: "Input Airport cannot be found.",
      dismissAfter: 3000,
    };
  }
  /**
   * Are you sure you want to send this message?
   */
  export function M30008C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "default",
      title: "",
      message: "Are you sure you want to send this message?",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Are you sure you want to update?
   */
  export function M30010C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "default",
      title: "",
      message: "Are you sure you want to update?",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Do you want to move to "OAL Schedule" for setting up a recovery flight?
   */
  export function M30011C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "default",
      title: "Recovery flight setting",
      message: 'Do you want to move to "OAL Schedule" for setting up a recovery flight?',
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * In case of "Error", correct the input value. If "Failed", try searching again.
   */
  export function M30012C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "success",
      title: "Process Completed",
      message: 'In case of "Error", correct the input value. If "Failed", try searching again.',
      ok: true,
      onOkButton,
    };
  }
  /**
   * Update was skipped because it has already been changed with this input.
   */
  export function M30013C({ onOkButton, title }: { onOkButton?: () => void; title?: string }): Message {
    return {
      type: "info",
      title: title || "",
      message: "Update was skipped because it has already been changed with this input.",
      ok: true,
      onOkButton,
    };
  }
  /**
   *  Update Status | successfully completed with condition
   */
  export function M30014C({ onOkButton, condition }: { onOkButton?: () => void; condition: string }): Message {
    return {
      type: "success",
      title: "Update Status",
      message: `The data update has been successfully completed ${condition}.`,
      ok: true,
      onOkButton,
    };
  }
  /**
   * Are you sure you want to close ?
   */
  export function M40001C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "If you close this page, changes are discards. Are you sure you want to close?",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * there was no change
   */
  export function M40002C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "No updated, there was no change.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * Issue Security | change the Issue code? changes will be discards
   */
  export function M40003C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "Are you sure you want to change the Issue code? If you change the Issue, changes will be discards.",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Issue Security | turn off the Send Type? changes will be discards
   */
  export function M40004C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "Are you sure to turn off the Send Type? If you turn off the Send Type, changes will be discards.",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Multiple auto reload warning
   */
  export function M40005C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "Multiple auto reload is not allowed",
      message: "This window going to be closed.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * Issue Security | turn off The Send type? changes will be discards
   */
  export function M40006C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "Are you sure you want to change? If you change the Issue, changes will be discards.",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Auto Reload Stopped | Network error has occurred
   */
  export function M40007C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "Auto reload has stopped",
      message: "Network error has occurred. Do you want to restart?",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Auto Reload Stopped | the server has been changed
   */
  export function M40008C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "Auto reload has stopped",
      message: "The current server has been changed. Do you want to restart?",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * required to reload
   */
  export function M40009C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "This client is required to be reloaded.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * Master data update
   */
  export function M40010C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "Master data will be updated.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * Are you sure you want to reload? If you do it
   */
  export function M40011C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "Are you sure you want to reload? If you do it, edits will be discards.",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Are you sure you want to change? If you do it
   */
  export function M40012C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "Are you sure you want to change? If you do it, edits will be discards.",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * has been deleted.
   */
  export function M40013C({ item, onOkButton }: { item: string; onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: `This ${item} has been deleted.`,
      ok: true,
      onOkButton,
    };
  }
  /**
   * Are you sure you want to delete
   */
  export function M40014C({ item, onYesButton, onNoButton }: { item: string; onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: `Are you sure you want to delete this ${item}?`,
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * This thread has been removed from your reference.
   */
  export function M40015C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "This thread has been removed from your reference.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * You have exceeded the maximum number of registrations.
   */
  export function M40016C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "You have exceeded the maximum number of registrations.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * Are you sure you want to search? If you do it, edits will be discards.
   */
  export function M40017C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "Are you sure you want to search? If you do it, edits will be discards.",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Are you sure you want to change? If you do it, sub-screens will be closed all.
   */
  export function M40018C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "Are you sure you want to change? If you do it, sub-screens will be closed all.",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Are you sure you want to change? Please check the input date.
   */
  export function M40019C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "Are you sure you want to change? Please check the input date.",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * The status of this flight has changed. Press the reload button to check for the latest information.
   */
  export function M40020C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: "The status of this flight has changed. Press the reload button to check for the latest information.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * Unexpected error occurred in RIVOR. Please contact system center.
   */
  export function M40021C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "Successfully completed only SOALA",
      message: "Unexpected error occurred in RIVOR. Please contact system center.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * Please check "Average Departure Taxiing Time Table".
   */
  export function M40022C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "ARR DLY Calculation Error",
      message: 'Please check "Average Departure Taxiing Time Table".',
      ok: true,
      onOkButton,
    };
  }
  /**
   * The date is beyond the update range.
   */
  export function M40023C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "Schedule Date out-of-range",
      message: "The date is beyond the update range.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * AFTN was sent successfully, but transfer to TTY failed.
   */
  export function M40024C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "TTY send error",
      message: "AFTN was sent successfully, but transfer to TTY failed.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * The session of this page has been logged out. This window going to be closed.
   */
  export function M40025C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "Already logged out",
      message: "The session of this page has been logged out. This window going to be closed.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * Exceeds the maximum number of auto reload page.
   */
  export function M40026C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "Already opened of auto reload",
      message: "Exceeds the maximum number of auto reload page.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * The "start line flight" is not found. Please slect another one.
   */
  export function M40027C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "warning",
      title: "",
      message: 'The "start line flight" is not found. Please slect another one.',
      ok: true,
      onOkButton,
    };
  }
  /**
   * System Error | 400
   */
  export function M50001C({ statusCode, onOkButton }: { statusCode: string | number | number; onOkButton?: () => void }): Message {
    return {
      type: "error",
      title: "System Error",
      message: `An unexpected error occurred. Please try again.  ${statusCode ? `(Code:${statusCode})` : ""}`,
      ok: true,
      onOkButton,
    };
  }
  /**
   * System Error | 401
   */
  export function M50002C({ statusCode, onOkButton }: { statusCode: string | number; onOkButton?: () => void }): Message {
    return {
      type: "error",
      title: "System Error",
      message: `An unexpected error occurred. Please login again. ${statusCode ? `(Code:${statusCode})` : ""}`,
      ok: true,
      onOkButton,
    };
  }
  /**
   * SystemError | 401
   */
  export function M50003C({ statusCode, onOkButton }: { statusCode: string | number; onOkButton?: () => void }): Message {
    return {
      type: "error",
      title: "System Error",
      message: `An unexpected error occurred. Please login again. ${statusCode ? `(Code:${statusCode})` : ""}`,
      ok: true,
      onOkButton,
    };
  }
  /**
   * Authentication Error | Job
   */
  export function M50004C({ statusCode }: { statusCode: string | number }): Message {
    return {
      type: "error",
      title: "Authentication Error",
      message: `Job Group or Job Auth Code is incorrect. Re-enter and try again. ${statusCode ? `(Code:${statusCode})` : ""}`,
    };
  }
  /**
   * Authentication Error | User
   */
  export function M50005C({ statusCode }: { statusCode: string | number }): Message {
    return {
      type: "error",
      title: "Authentication Error",
      message: `User ID or Password is incorrect. Re-enter and try again. ${statusCode ? `(Code:${statusCode})` : ""}`,
    };
  }
  /**
   * Authentication Error | Locked
   */
  export function M50006C({ statusCode, onOkButton }: { statusCode: string | number; onOkButton?: () => void }): Message {
    return {
      type: "error",
      title: "Authentication Error",
      message: `Your account has been locked. Please contact your system administrator. ${statusCode ? `(Code:${statusCode})` : ""}`,
      ok: true,
      onOkButton,
    };
  }
  /**
   * System Error | An unexpected error occurred
   */
  export function M50007C({ statusCode, onOkButton }: { statusCode: string | number; onOkButton?: () => void }): Message {
    return {
      type: "error",
      title: "System Error",
      message: `An unexpected error occurred. Please try again. ${statusCode ? `(Code:${statusCode})` : ""}`,
      ok: true,
      onOkButton,
    };
  }
  /**
   * Method Not Allowed
   */
  export function M50008C({ statusCode, onOkButton }: { statusCode: string | number; onOkButton?: () => void }): Message {
    return {
      type: "error",
      title: "Method Not Allowed",
      message: `This function requires user authority. Please login again. ${statusCode ? `(Code:${statusCode})` : ""}`,
      ok: true,
      onOkButton,
    };
  }
  /**
   * Logged in Another Device
   */
  export function M50009C({
    statusCode,
    onYesButton,
    onNoButton,
  }: {
    statusCode: string | number;
    onYesButton?: () => void;
    onNoButton?: () => void;
  }): Message {
    return {
      type: "error",
      title: "Logged in Another Device",
      message: `Though another device will be logged out forcefully, will you continue to log in? ${
        statusCode ? `(Code:${statusCode})` : ""
      }`,
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * System Error | 500
   */
  export function M50010C({
    statusCode,
    onYesButton,
    onNoButton,
  }: {
    statusCode: string | number;
    onYesButton?: () => void;
    onNoButton?: () => void;
  }): Message {
    return {
      type: "error",
      title: "System Error",
      message: `An unexpected error occurred. Do you want to try again? ${statusCode ? `(Code:${statusCode})` : ""}`,
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * System Error | 512
   */
  export function M50011C({
    statusCode,
    onYesButton,
    onNoButton,
  }: {
    statusCode: string | number;
    onYesButton?: () => void;
    onNoButton?: () => void;
  }): Message {
    return {
      type: "error",
      title: "System Error",
      message: `An unexpected error occurred. Do you want to try again? ${statusCode ? `(Code:${statusCode})` : ""}`,
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * System Error | 513
   */
  export function M50012C({
    statusCode,
    onYesButton,
    onNoButton,
  }: {
    statusCode: string | number;
    onYesButton?: () => void;
    onNoButton?: () => void;
  }): Message {
    return {
      type: "error",
      title: "System Error",
      message: `An unexpected error occurred. Do you want to try again? ${statusCode ? `(Code:${statusCode})` : ""}`,
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Network Error | Network error has occurred
   */
  export function M50013C({ onYesButton, onNoButton }: { onYesButton?: () => void; onNoButton?: () => void }): Message {
    return {
      type: "error",
      title: "Network Error",
      message: "Network error has occurred. Do you want to try again?",
      yes: true,
      no: true,
      onYesButton,
      onNoButton,
    };
  }
  /**
   * Data Format Error
   */
  export function M50014C(): Message {
    return {
      type: "error",
      title: "Data Format Error",
      message: "Please check the input and try again.",
      dismissAfter: 3000,
    };
  }
  /**
   * Data Format Error | Issue
   */
  export function M50015C({ items }: { items: string[] }): Message {
    return {
      type: "error",
      title: "Data Format Error",
      message: `Please check the input and try again.${items && items.length > 0 ? ` (${items.join(",")})` : ""}`,
      dismissAfter: 3000,
    };
  }
  /**
   * Required Input Error
   */
  export function M50016C(): Message {
    return {
      type: "error",
      title: "Required Input Error",
      message: "Please enter the required items and try again.",
      dismissAfter: 3000,
    };
  }
  /**
   * Required Input Error | Issue
   */
  export function M50017C({ items }: { items: string[] }): Message {
    return {
      type: "error",
      title: "Required Input Error",
      message: `Please enter the required items and try again.${items && items.length > 0 ? ` (${items.join(",")})` : ""}`,
      dismissAfter: 3000,
    };
  }
  /**
   * File Size Error
   */
  export function M50018C(): Message {
    return {
      type: "error",
      title: "File Size Error",
      message: "Files can be selected up to 5 MB.",
      dismissAfter: 3000,
    };
  }
  /**
   * Duplication Input Error
   */
  export function M50019C(): Message {
    return {
      type: "error",
      title: "Duplication Input Error",
      message: "Please do not duplicate with dupliable incoming items.",
      dismissAfter: 3000,
    };
  }
  /**
   * Duplication Input Error | Issue
   */
  export function M50020C({ items }: { items: string[] }): Message {
    return {
      type: "error",
      title: "Duplication Input Error",
      message: `Please do not duplicate with dupliable incoming items.${items && items.length > 0 ? ` (${items.join(",")})` : ""}`,
      dismissAfter: 3000,
    };
  }
  /**
   * System Error | Other
   */
  export function M50021C(): Message {
    return {
      type: "error",
      title: "System Error",
      message: "An unexpected error occurred.",
      dismissAfter: 5000,
    };
  }
  /**
   * System Error | MQTT connect
   */
  export function M50022C(): Message {
    return {
      type: "error",
      title: "System Error",
      message: "The connection to the server failed.",
    };
  }
  /**
   * No Data Found | 404
   */
  export function M50024C(): Message {
    return {
      type: "error",
      title: "No Data Found",
      message: "The file does not exist. It should be deleted.",
      dismissAfter: 5000,
    };
  }
  /**
   * Method Not Allowed | user authority
   */
  export function M50025C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "error",
      title: "Method Not Allowed",
      message: "This function requires user authority. Please reload and try again.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * File Format Error | Unrecognized file type
   */
  export function M50026C(): Message {
    return {
      type: "error",
      title: "File Format Error",
      message: "Unrecognized file type",
      dismissAfter: 3000,
    };
  }
  /**
   * バリデーションエラー | 422
   */
  export function M50029C({ title, errorText, onOkButton }: { title: string; errorText: string; onOkButton?: () => void }): Message {
    return {
      type: "error",
      title,
      message: `Please correct the input value. <br>Error reason: "${errorText}"`,
      ok: true,
      onOkButton,
    };
  }
  /**
   * バリデーションエラー（汎用）
   */
  export function M50030C({ errorText, onOkButton }: { errorText: string; onOkButton?: () => void }): Message {
    return {
      type: "error",
      title: "Input Error",
      message: `Please correct the input value. <br>Error reason: "${errorText}"`,
      ok: true,
      onOkButton,
    };
  }
  /**
   * コンフリクトエラー | 409
   */
  export function M50031C({ title, onOkButton }: { title?: string; onOkButton?: () => void }): Message {
    return {
      type: "error",
      title: title || "",
      message: "Conflict occurred during the update. Please search the flight again.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * Please check the input and try again.
   */
  export function M50032C(): Message {
    return {
      type: "error",
      title: "Out-of-range value",
      message: "Please check the input and try again.",
      dismissAfter: 3000,
    };
  }
  /**
   * File Name Error
   */
  export function M50033C(): Message {
    return {
      type: "error",
      title: "File Name Error",
      message: "The file name is too long. It have to be 120 characters or less.",
      dismissAfter: 3000,
    };
  }
  /**
   * No address specified Error
   */
  export function M50034C({ onOkButton }: { onOkButton?: () => void }): Message {
    return {
      type: "error",
      title: "No address specified",
      message: "Please check the address group.",
      ok: true,
      onOkButton,
    };
  }
  /**
   * Required Input Error
   */
  export function M50035C(): Message {
    return {
      type: "error",
      title: "Required Input Error",
      message: '"EFT" is required. Please check FPM.',
      dismissAfter: 3000,
    };
  }
  /**
   * SHIP ASGN Required
   */
  export function M50036C(): Message {
    return {
      type: "error",
      title: "SHIP ASGN Required",
      message: '"SHIP" is required. Please check STELA.',
      dismissAfter: 3000,
    };
  }
}
