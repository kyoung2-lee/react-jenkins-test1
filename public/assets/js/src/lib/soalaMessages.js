"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoalaMessage = void 0;
var SoalaMessage;
(function (SoalaMessage) {
    /**
     * Update Status | being updated...
     */
    function M30001C() {
        return {
            type: "updated",
            title: "Update Status",
            message: "The data is being updated...",
        };
    }
    SoalaMessage.M30001C = M30001C;
    /**
     * Update Status | successfully completed
     */
    function M30002C() {
        return {
            type: "success",
            title: "Update Status",
            message: "The data update has been successfully completed.",
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M30002C = M30002C;
    /**
     * No Data Found | no data to display
     */
    function M30003C() {
        return {
            type: "info",
            title: "No Data Found",
            message: "There is no data to display.",
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M30003C = M30003C;
    /**
     * Issue Security | save the template?
     */
    function M30004C({ issueType, onYesButton, onNoButton, }) {
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
    SoalaMessage.M30004C = M30004C;
    /**
     * Issue Security | send this Issue?
     */
    function M30005C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M30005C = M30005C;
    /**
     * Issue Security | send this Issue? There is no change
     */
    function M30006C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M30006C = M30006C;
    /**
     * No Data Found | Input Airport cannot be found.
     */
    function M30007C() {
        return {
            type: "info",
            title: "No Data Found",
            message: "Input Airport cannot be found.",
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M30007C = M30007C;
    /**
     * Are you sure you want to send this message?
     */
    function M30008C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M30008C = M30008C;
    /**
     * Are you sure you want to update?
     */
    function M30010C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M30010C = M30010C;
    /**
     * Do you want to move to "OAL Schedule" for setting up a recovery flight?
     */
    function M30011C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M30011C = M30011C;
    /**
     * In case of "Error", correct the input value. If "Failed", try searching again.
     */
    function M30012C({ onOkButton }) {
        return {
            type: "success",
            title: "Process Completed",
            message: 'In case of "Error", correct the input value. If "Failed", try searching again.',
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M30012C = M30012C;
    /**
     * Update was skipped because it has already been changed with this input.
     */
    function M30013C({ onOkButton, title }) {
        return {
            type: "info",
            title: title || "",
            message: "Update was skipped because it has already been changed with this input.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M30013C = M30013C;
    /**
     *  Update Status | successfully completed with condition
     */
    function M30014C({ onOkButton, condition }) {
        return {
            type: "success",
            title: "Update Status",
            message: `The data update has been successfully completed ${condition}.`,
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M30014C = M30014C;
    /**
     * Are you sure you want to close ?
     */
    function M40001C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40001C = M40001C;
    /**
     * there was no change
     */
    function M40002C({ onOkButton }) {
        return {
            type: "warning",
            title: "",
            message: "No updated, there was no change.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40002C = M40002C;
    /**
     * Issue Security | change the Issue code? changes will be discards
     */
    function M40003C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40003C = M40003C;
    /**
     * Issue Security | turn off the Send Type? changes will be discards
     */
    function M40004C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40004C = M40004C;
    /**
     * Multiple auto reload warning
     */
    function M40005C({ onOkButton }) {
        return {
            type: "warning",
            title: "Multiple auto reload is not allowed",
            message: "This window going to be closed.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40005C = M40005C;
    /**
     * Issue Security | turn off The Send type? changes will be discards
     */
    function M40006C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40006C = M40006C;
    /**
     * Auto Reload Stopped | Network error has occurred
     */
    function M40007C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40007C = M40007C;
    /**
     * Auto Reload Stopped | the server has been changed
     */
    function M40008C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40008C = M40008C;
    /**
     * required to reload
     */
    function M40009C({ onOkButton }) {
        return {
            type: "warning",
            title: "",
            message: "This client is required to be reloaded.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40009C = M40009C;
    /**
     * Master data update
     */
    function M40010C({ onOkButton }) {
        return {
            type: "warning",
            title: "",
            message: "Master data will be updated.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40010C = M40010C;
    /**
     * Are you sure you want to reload? If you do it
     */
    function M40011C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40011C = M40011C;
    /**
     * Are you sure you want to change? If you do it
     */
    function M40012C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40012C = M40012C;
    /**
     * has been deleted.
     */
    function M40013C({ item, onOkButton }) {
        return {
            type: "warning",
            title: "",
            message: `This ${item} has been deleted.`,
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40013C = M40013C;
    /**
     * Are you sure you want to delete
     */
    function M40014C({ item, onYesButton, onNoButton }) {
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
    SoalaMessage.M40014C = M40014C;
    /**
     * This thread has been removed from your reference.
     */
    function M40015C({ onOkButton }) {
        return {
            type: "warning",
            title: "",
            message: "This thread has been removed from your reference.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40015C = M40015C;
    /**
     * You have exceeded the maximum number of registrations.
     */
    function M40016C({ onOkButton }) {
        return {
            type: "warning",
            title: "",
            message: "You have exceeded the maximum number of registrations.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40016C = M40016C;
    /**
     * Are you sure you want to search? If you do it, edits will be discards.
     */
    function M40017C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40017C = M40017C;
    /**
     * Are you sure you want to change? If you do it, sub-screens will be closed all.
     */
    function M40018C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40018C = M40018C;
    /**
     * Are you sure you want to change? Please check the input date.
     */
    function M40019C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M40019C = M40019C;
    /**
     * The status of this flight has changed. Press the reload button to check for the latest information.
     */
    function M40020C({ onOkButton }) {
        return {
            type: "warning",
            title: "",
            message: "The status of this flight has changed. Press the reload button to check for the latest information.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40020C = M40020C;
    /**
     * Unexpected error occurred in RIVOR. Please contact system center.
     */
    function M40021C({ onOkButton }) {
        return {
            type: "warning",
            title: "Successfully completed only SOALA",
            message: "Unexpected error occurred in RIVOR. Please contact system center.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40021C = M40021C;
    /**
     * Please check "Average Departure Taxiing Time Table".
     */
    function M40022C({ onOkButton }) {
        return {
            type: "warning",
            title: "ARR DLY Calculation Error",
            message: 'Please check "Average Departure Taxiing Time Table".',
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40022C = M40022C;
    /**
     * The date is beyond the update range.
     */
    function M40023C({ onOkButton }) {
        return {
            type: "warning",
            title: "Schedule Date out-of-range",
            message: "The date is beyond the update range.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40023C = M40023C;
    /**
     * AFTN was sent successfully, but transfer to TTY failed.
     */
    function M40024C({ onOkButton }) {
        return {
            type: "warning",
            title: "TTY send error",
            message: "AFTN was sent successfully, but transfer to TTY failed.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40024C = M40024C;
    /**
     * The session of this page has been logged out. This window going to be closed.
     */
    function M40025C({ onOkButton }) {
        return {
            type: "warning",
            title: "Already logged out",
            message: "The session of this page has been logged out. This window going to be closed.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40025C = M40025C;
    /**
     * Exceeds the maximum number of auto reload page.
     */
    function M40026C({ onOkButton }) {
        return {
            type: "warning",
            title: "Already opened of auto reload",
            message: "Exceeds the maximum number of auto reload page.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40026C = M40026C;
    /**
     * The "start line flight" is not found. Please slect another one.
     */
    function M40027C({ onOkButton }) {
        return {
            type: "warning",
            title: "",
            message: 'The "start line flight" is not found. Please slect another one.',
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M40027C = M40027C;
    /**
     * System Error | 400
     */
    function M50001C({ statusCode, onOkButton }) {
        return {
            type: "error",
            title: "System Error",
            message: `An unexpected error occurred. Please try again.  ${statusCode ? `(Code:${statusCode})` : ""}`,
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50001C = M50001C;
    /**
     * System Error | 401
     */
    function M50002C({ statusCode, onOkButton }) {
        return {
            type: "error",
            title: "System Error",
            message: `An unexpected error occurred. Please login again. ${statusCode ? `(Code:${statusCode})` : ""}`,
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50002C = M50002C;
    /**
     * SystemError | 401
     */
    function M50003C({ statusCode, onOkButton }) {
        return {
            type: "error",
            title: "System Error",
            message: `An unexpected error occurred. Please login again. ${statusCode ? `(Code:${statusCode})` : ""}`,
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50003C = M50003C;
    /**
     * Authentication Error | Job
     */
    function M50004C({ statusCode }) {
        return {
            type: "error",
            title: "Authentication Error",
            message: `Job Group or Job Auth Code is incorrect. Re-enter and try again. ${statusCode ? `(Code:${statusCode})` : ""}`,
        };
    }
    SoalaMessage.M50004C = M50004C;
    /**
     * Authentication Error | User
     */
    function M50005C({ statusCode }) {
        return {
            type: "error",
            title: "Authentication Error",
            message: `User ID or Password is incorrect. Re-enter and try again. ${statusCode ? `(Code:${statusCode})` : ""}`,
        };
    }
    SoalaMessage.M50005C = M50005C;
    /**
     * Authentication Error | Locked
     */
    function M50006C({ statusCode, onOkButton }) {
        return {
            type: "error",
            title: "Authentication Error",
            message: `Your account has been locked. Please contact your system administrator. ${statusCode ? `(Code:${statusCode})` : ""}`,
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50006C = M50006C;
    /**
     * System Error | An unexpected error occurred
     */
    function M50007C({ statusCode, onOkButton }) {
        return {
            type: "error",
            title: "System Error",
            message: `An unexpected error occurred. Please try again. ${statusCode ? `(Code:${statusCode})` : ""}`,
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50007C = M50007C;
    /**
     * Method Not Allowed
     */
    function M50008C({ statusCode, onOkButton }) {
        return {
            type: "error",
            title: "Method Not Allowed",
            message: `This function requires user authority. Please login again. ${statusCode ? `(Code:${statusCode})` : ""}`,
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50008C = M50008C;
    /**
     * Logged in Another Device
     */
    function M50009C({ statusCode, onYesButton, onNoButton, }) {
        return {
            type: "error",
            title: "Logged in Another Device",
            message: `Though another device will be logged out forcefully, will you continue to log in? ${statusCode ? `(Code:${statusCode})` : ""}`,
            yes: true,
            no: true,
            onYesButton,
            onNoButton,
        };
    }
    SoalaMessage.M50009C = M50009C;
    /**
     * System Error | 500
     */
    function M50010C({ statusCode, onYesButton, onNoButton, }) {
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
    SoalaMessage.M50010C = M50010C;
    /**
     * System Error | 512
     */
    function M50011C({ statusCode, onYesButton, onNoButton, }) {
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
    SoalaMessage.M50011C = M50011C;
    /**
     * System Error | 513
     */
    function M50012C({ statusCode, onYesButton, onNoButton, }) {
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
    SoalaMessage.M50012C = M50012C;
    /**
     * Network Error | Network error has occurred
     */
    function M50013C({ onYesButton, onNoButton }) {
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
    SoalaMessage.M50013C = M50013C;
    /**
     * Data Format Error
     */
    function M50014C() {
        return {
            type: "error",
            title: "Data Format Error",
            message: "Please check the input and try again.",
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50014C = M50014C;
    /**
     * Data Format Error | Issue
     */
    function M50015C({ items }) {
        return {
            type: "error",
            title: "Data Format Error",
            message: `Please check the input and try again.${items && items.length > 0 ? ` (${items.join(",")})` : ""}`,
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50015C = M50015C;
    /**
     * Required Input Error
     */
    function M50016C() {
        return {
            type: "error",
            title: "Required Input Error",
            message: "Please enter the required items and try again.",
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50016C = M50016C;
    /**
     * Required Input Error | Issue
     */
    function M50017C({ items }) {
        return {
            type: "error",
            title: "Required Input Error",
            message: `Please enter the required items and try again.${items && items.length > 0 ? ` (${items.join(",")})` : ""}`,
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50017C = M50017C;
    /**
     * File Size Error
     */
    function M50018C() {
        return {
            type: "error",
            title: "File Size Error",
            message: "Files can be selected up to 5 MB.",
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50018C = M50018C;
    /**
     * Duplication Input Error
     */
    function M50019C() {
        return {
            type: "error",
            title: "Duplication Input Error",
            message: "Please do not duplicate with dupliable incoming items.",
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50019C = M50019C;
    /**
     * Duplication Input Error | Issue
     */
    function M50020C({ items }) {
        return {
            type: "error",
            title: "Duplication Input Error",
            message: `Please do not duplicate with dupliable incoming items.${items && items.length > 0 ? ` (${items.join(",")})` : ""}`,
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50020C = M50020C;
    /**
     * System Error | Other
     */
    function M50021C() {
        return {
            type: "error",
            title: "System Error",
            message: "An unexpected error occurred.",
            dismissAfter: 5000,
        };
    }
    SoalaMessage.M50021C = M50021C;
    /**
     * System Error | MQTT connect
     */
    function M50022C() {
        return {
            type: "error",
            title: "System Error",
            message: "The connection to the server failed.",
        };
    }
    SoalaMessage.M50022C = M50022C;
    /**
     * No Data Found | 404
     */
    function M50024C() {
        return {
            type: "error",
            title: "No Data Found",
            message: "The file does not exist. It should be deleted.",
            dismissAfter: 5000,
        };
    }
    SoalaMessage.M50024C = M50024C;
    /**
     * Method Not Allowed | user authority
     */
    function M50025C({ onOkButton }) {
        return {
            type: "error",
            title: "Method Not Allowed",
            message: "This function requires user authority. Please reload and try again.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50025C = M50025C;
    /**
     * File Format Error | Unrecognized file type
     */
    function M50026C() {
        return {
            type: "error",
            title: "File Format Error",
            message: "Unrecognized file type",
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50026C = M50026C;
    /**
     * バリデーションエラー | 422
     */
    function M50029C({ title, errorText, onOkButton }) {
        return {
            type: "error",
            title,
            message: `Please correct the input value. <br>Error reason: "${errorText}"`,
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50029C = M50029C;
    /**
     * バリデーションエラー（汎用）
     */
    function M50030C({ errorText, onOkButton }) {
        return {
            type: "error",
            title: "Input Error",
            message: `Please correct the input value. <br>Error reason: "${errorText}"`,
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50030C = M50030C;
    /**
     * コンフリクトエラー | 409
     */
    function M50031C({ title, onOkButton }) {
        return {
            type: "error",
            title: title || "",
            message: "Conflict occurred during the update. Please search the flight again.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50031C = M50031C;
    /**
     * Please check the input and try again.
     */
    function M50032C() {
        return {
            type: "error",
            title: "Out-of-range value",
            message: "Please check the input and try again.",
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50032C = M50032C;
    /**
     * File Name Error
     */
    function M50033C() {
        return {
            type: "error",
            title: "File Name Error",
            message: "The file name is too long. It have to be 120 characters or less.",
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50033C = M50033C;
    /**
     * No address specified Error
     */
    function M50034C({ onOkButton }) {
        return {
            type: "error",
            title: "No address specified",
            message: "Please check the address group.",
            ok: true,
            onOkButton,
        };
    }
    SoalaMessage.M50034C = M50034C;
    /**
     * Required Input Error
     */
    function M50035C() {
        return {
            type: "error",
            title: "Required Input Error",
            message: '"EFT" is required. Please check FPM.',
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50035C = M50035C;
    /**
     * SHIP ASGN Required
     */
    function M50036C() {
        return {
            type: "error",
            title: "SHIP ASGN Required",
            message: '"SHIP" is required. Please check STELA.',
            dismissAfter: 3000,
        };
    }
    SoalaMessage.M50036C = M50036C;
})(SoalaMessage = exports.SoalaMessage || (exports.SoalaMessage = {}));
//# sourceMappingURL=soalaMessages.js.map