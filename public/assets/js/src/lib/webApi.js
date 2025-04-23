"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebApi = exports.ApiError = void 0;
const axios_1 = __importDefault(require("axios"));
const commonConst_1 = require("./commonConst");
const commonUtil_1 = require("./commonUtil");
const storage_1 = require("./storage");
const notifications_1 = require("./notifications");
const soalaMessages_1 = require("./soalaMessages");
// eslint-disable-next-line import/no-cycle
const common_1 = require("../reducers/common");
const config_1 = require("../../config/config");
class ApiError extends Error {
    constructor(message, response) {
        super(message);
        this.message = message;
        this.response = response;
        this.name = "Api Error";
    }
}
exports.ApiError = ApiError;
/**
 * API通信を行う
 */
var WebApi;
(function (WebApi) {
    const TIME_OUT = 30000;
    const notificationIds = {
        errNetwork: "webapi_network_error",
        err401: "webapi_401_error",
        err403: "webapi_403_error",
        err405: "webapi_405_error",
        err500: "webapi_500_error",
        err512: "webapi_512_error",
        err513: "webapi_513_error",
        errOther: "webapi_other_error",
    };
    let Endpoints;
    (function (Endpoints) {
        Endpoints.JOB_AUTH = { url: "/Others/Job/Auth", interfaceId: { post: "S10101W3" } };
        Endpoints.JOB_PROFILE = { url: "/Others/Job/Profile", interfaceId: { get: "S10101W2" } };
        Endpoints.MASTER = { url: "/Others/Master", interfaceId: { get: "S10101W4" } };
        Endpoints.LOGOUT = { url: "/Others/Logout", interfaceId: { post: "S10100W4" } };
        Endpoints.MQTT_SERVER = { url: "/Others/MqttServer", interfaceId: { get: "S10100WA" } }; // TODO: API設計書が用意されていない
        Endpoints.HEADER = { url: "/Others/Header", interfaceId: { get: "S10100W1" } };
        Endpoints.AIRPORT_REMARKS = { url: "/Others/AirportRemarks", interfaceId: { post: "S10100W2" } };
        Endpoints.NOTIFICATION_SETTING = { url: "/Others/NotificationSetting", interfaceId: { get: "S10100W3" } };
        Endpoints.USER_NOTIFICATION = {
            url: "/Others/UserNotification",
            interfaceId: { get: "S10108W1", post: "S10108W2" },
        };
        Endpoints.PROFILE_PICTURE = { url: "/Others/ProfilePicture", interfaceId: { post: "S10100W5" } };
        Endpoints.FLIGHT_REMARKS = { url: "/Others/FlightRemarks", interfaceId: { post: "S10100W6" } };
        Endpoints.ADDRESS_MAIL = { url: "/Others/Address/Mail/Search", interfaceId: { post: "S10100W7" } };
        Endpoints.ADDRESS_TTY = { url: "/Others/Address/Tty/Search", interfaceId: { post: "S10100W8" } };
        Endpoints.ADDRESS_JOB = { url: "/Others/Address/Job/Search", interfaceId: { post: "S10100W9" } };
        Endpoints.FIS = { url: "/Fis", interfaceId: { get: "S10201W1" } };
        Endpoints.SPOT_REMARKS = { url: "/SpotRemarks", interfaceId: { get: "S10701W1", post: "S10701W2" } };
        Endpoints.AIRPORT_ISSUE = { url: "/AirportIssue", interfaceId: { get: "S10206W1", post: "S10206W4" } };
        Endpoints.TTY_ADDRESS_SEARCH = { url: "/AirportIssue/TtyAddress/Search", interfaceId: { get: "S10206W2" } };
        Endpoints.MAIL_ADDRESS_SEARCH = { url: "/AirportIssue/MailAddress/Search", interfaceId: { get: "S10206W3" } };
        Endpoints.AIRPORT_ISSUE_TEMPLATE = { url: "/AirportIssue/Template", interfaceId: { post: "S10206W5" } };
        Endpoints.WORK_STEP = { url: "/FlightDetail/WorkStep", interfaceId: { get: "S10301W1", post: "S10301W2" } };
        Endpoints.FLIGHT_DETAIL = { url: "/FlightDetail", interfaceId: { get: "S10502W1" } };
        Endpoints.FLIGHT_LIST = { url: "/FlightList", interfaceId: { get: "S10504W1" } };
        Endpoints.FLIGHT_HISTORY = { url: "/FlightDetail/History", interfaceId: { get: "S10502W2" } };
        Endpoints.FLIGHT_SPECIAL_CARE = { url: "/FlightDetail/SpecialCare", interfaceId: { get: "S10502W3" } };
        Endpoints.FLIGHT_PAX_FROM = { url: "/FlightDetail/Pax/From", interfaceId: { get: "S10505W1" } };
        Endpoints.FLIGHT_PAX_TO = { url: "/FlightDetail/Pax/To", interfaceId: { get: "S10505W2" } };
        Endpoints.BROADCAST_TEMPLATE = { url: "/broadcast/template", interfaceId: { get: "S11100W1" } };
        Endpoints.BROADCAST_TEMPLATE_UPDATE = { url: "/broadcast/template/update", interfaceId: { post: "S11100W2" } };
        Endpoints.BROADCAST_TEMPLATE_DELETE = { url: "/broadcast/template/delete/", interfaceId: { post: "S11100W3" } };
        Endpoints.BROADCAST_BB = { url: "/broadcast/bulletinboard", interfaceId: { get: "S11102W1", post: "S11102W2" } };
        Endpoints.BROADCAST_BB_UPDATE = { url: "/broadcast/bulletinboard/update", interfaceId: { post: "S11102W3" } };
        Endpoints.BROADCAST_BB_TEMPLATE = {
            url: "/broadcast/bulletinboard/template",
            interfaceId: { get: "S11102W4", post: "S11102W5" },
        };
        Endpoints.BROADCAST_BB_TEMPLATE_UPDATE = {
            url: "/broadcast/bulletinboard/template/update",
            interfaceId: { post: "S11102W6" },
        };
        Endpoints.BROADCAST_BB_FLIGHT_LEG = {
            url: "/broadcast/bulletinboard/flightleg",
            interfaceId: { get: "S11102W7" },
        };
        Endpoints.BROADCAST_BB_FLIGHT_START = {
            url: "/broadcast/bulletinboard/flight",
            interfaceId: { post: "S11102W8" },
        };
        Endpoints.BROADCAST_EMAIL = { url: "/broadcast/mail", interfaceId: { post: "S11103W2" } };
        Endpoints.BROADCAST_EMAIL_TEMPLATE = {
            url: "/broadcast/mail/template",
            interfaceId: { get: "S11103W4", post: "S11103W5" },
        };
        Endpoints.BROADCAST_EMAIL_TEMPLATE_UPDATE = {
            url: "/broadcast/mail/template/update",
            interfaceId: { post: "S11103W6" },
        };
        Endpoints.BROADCAST_TTY = { url: "/broadcast/tty", interfaceId: { post: "S11104W2" } };
        Endpoints.BROADCAST_TTY_TEMPLATE = {
            url: "/broadcast/tty/template",
            interfaceId: { get: "S11104W4", post: "S11104W5" },
        };
        Endpoints.BROADCAST_TTY_TEMPLATE_UPDATE = {
            url: "/broadcast/tty/template/update",
            interfaceId: { post: "S11104W6" },
        };
        Endpoints.BROADCAST_AFTN = { url: "/broadcast/aftn", interfaceId: { post: "S11107W2" } };
        Endpoints.BROADCAST_AFTN_TEMPLATE = {
            url: "/broadcast/aftn/template",
            interfaceId: { get: "S11107W4", post: "S11107W5" },
        };
        Endpoints.BROADCAST_AFTN_TEMPLATE_UPDATE = {
            url: "/broadcast/aftn/template/update",
            interfaceId: { post: "S11107W6" },
        };
        Endpoints.BROADCAST_ACARS = { url: "/broadcast/acars", interfaceId: { post: "S11105W2" } };
        Endpoints.BROADCAST_ACARS_TEMPLATE = {
            url: "/broadcast/acars/template",
            interfaceId: { get: "S11105W4", post: "S11105W5" },
        };
        Endpoints.BROADCAST_ACARS_TEMPLATE_UPDATE = {
            url: "/broadcast/acars/template/update",
            interfaceId: { post: "S11105W6" },
        };
        Endpoints.BROADCAST_NTF = { url: "/broadcast/notification", interfaceId: { post: "S11106W2" } };
        Endpoints.BROADCAST_NTF_TEMPLATE = {
            url: "/broadcast/notification/template",
            interfaceId: { get: "S11106W4", post: "S11106W5" },
        };
        Endpoints.BROADCAST_NTF_TEMPLATE_UPDATE = {
            url: "/broadcast/notification/template/update",
            interfaceId: { post: "S11106W6" },
        };
        Endpoints.BB_THREADS = { url: "/bulletinboard/threads", interfaceId: { get: "S11101W1" } };
        Endpoints.BB_THREAD = { url: "/bulletinboard/thread", interfaceId: { get: "S11101W2" } };
        Endpoints.BB_COMMENT = { url: "/bulletinboard/comment", interfaceId: { post: "S11101W3" } };
        Endpoints.BB_COMMENT_UPDATE = { url: "/bulletinboard/comment/update", interfaceId: { post: "S11101W4" } };
        Endpoints.BB_COMMENT_DELETE = { url: "/bulletinboard/comment/delete", interfaceId: { post: "S11101W5" } };
        Endpoints.BB_RESPONSE = { url: "/bulletinboard/response", interfaceId: { post: "S11101W6" } };
        Endpoints.BB_RESPONSE_UPDATE = { url: "/bulletinboard/response/update", interfaceId: { post: "S11101W7" } };
        Endpoints.BB_RESPONSE_DELETE = { url: "/bulletinboard/response/delete", interfaceId: { post: "S11101W8" } };
        Endpoints.BB_THREAD_DELETE = { url: "/bulletinboard/thread/delete", interfaceId: { post: "S11101W9" } };
        Endpoints.BB_THREAD_FILE = { url: "/bulletinboard/thread/file", interfaceId: { get: "S11101WA" } };
        Endpoints.BB_THREADS_FLIGHT = { url: "/bulletinboard/threads/flight", interfaceId: { get: "S11101WB" } };
        Endpoints.BB_THREAD_REACTION = { url: "/bulletinboard/thread/reaction", interfaceId: { post: "S11101WC" } };
        Endpoints.BB_RESPONSE_REACTION = { url: "/bulletinboard/response/reaction", interfaceId: { post: "S11101WD" } };
        Endpoints.BB_COMMENT_REACTION = { url: "/bulletinboard/comment/reaction", interfaceId: { post: "S11101WE" } };
        Endpoints.OAL_FLIGHT_SCHEDULE = { url: "/OalFlightSchedule", interfaceId: { get: "S11301W1" } };
        Endpoints.OAL_FLIGHT_SCHEDULE_UPDATE = { url: "/OalFlightScheduleUpdate", interfaceId: { post: "S11301W2" } };
        Endpoints.OAL_FLIGHT_MOVEMENT = { url: "/OalFlightMovement", interfaceId: { get: "S11400W1" } };
        Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE = { url: "/OalFlightMovementUpdate", interfaceId: { post: "S10100WB1" } };
        Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE_SPOT = {
            url: "/OalFlightMovementUpdate",
            interfaceId: { post: "S10100WB2" },
        };
        Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE_EQP = {
            url: "/OalFlightMovementUpdate",
            interfaceId: { post: "S10100WB3" },
        };
        Endpoints.FLIGHT_MOVEMENT = { url: "/FlightMovement", interfaceId: { get: "S10601W2" } };
        Endpoints.FLIGHT_MOVEMENT_UPDATE = { url: "/FlightMovementUpdate", interfaceId: { post: "S10100WF1" } };
        Endpoints.FLIGHT_MOVEMENT_UPDATE_SPOT = { url: "/FlightMovementUpdate", interfaceId: { post: "S10100WF2" } };
        Endpoints.SPOT_NUMBER_RESTRICTION_CHECK = { url: "/SpotNumber/restriction/check", interfaceId: { post: "S10702W1" } };
        Endpoints.OAL_FLIGHT_IRREGULAR_UPDATE = { url: "/OalFlightIrrUpdate", interfaceId: { post: "S10602W2" } };
        Endpoints.OAL_PAX = { url: "/OalPax", interfaceId: { get: "S11302W1", post: "S11302W2" } };
        Endpoints.OAL_PAX_STATUS = { url: "/OalPaxStatus", interfaceId: { get: "S11304W1", post: "S11304W2" } };
        Endpoints.LEG_ARR_DEP_CTRL = { url: "/LegArrdepCtrl", interfaceId: { get: "S10100WE" } };
        Endpoints.OAL_FUEL = { url: "/OalFuel", interfaceId: { get: "S11305W1", post: "S11305W2" } };
        Endpoints.MYSCHEDULE = { url: "/MySchedule", interfaceId: { get: "S10401W1", post: "S10401W2" } };
        Endpoints.MYSCHEDULE_FIS = { url: "/MySchedule/Fis", interfaceId: { get: "S10401W3" } };
        Endpoints.ACARS_STATUS = { url: "/AcarsStatus", interfaceId: { get: "S10100WH" } };
        Endpoints.MVT_MSG = { url: "/MvtMsg", interfaceId: { get: "S10603W1" } };
        Endpoints.MVT_MSG_UPDATE = { url: "/MvtMsgUpdate", interfaceId: { post: "S10603W2" } };
    })(Endpoints || (Endpoints = {}));
    function getHeader(dispatch, params) {
        const { url, interfaceId } = Endpoints.HEADER;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getHeader = getHeader;
    function postAirportRemarks(dispatch, params) {
        const { url, interfaceId } = Endpoints.AIRPORT_REMARKS;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postAirportRemarks = postAirportRemarks;
    function getUserNotification(dispatch) {
        const { url, interfaceId } = Endpoints.USER_NOTIFICATION;
        return sendRequest("get", url, interfaceId.get, {}, dispatch);
    }
    WebApi.getUserNotification = getUserNotification;
    function getNotificationSetting(dispatch) {
        const { url, interfaceId } = Endpoints.NOTIFICATION_SETTING;
        return sendRequest("get", url, interfaceId.get, {}, dispatch);
    }
    WebApi.getNotificationSetting = getNotificationSetting;
    function postUserNotification(dispatch, params) {
        const { url, interfaceId } = Endpoints.USER_NOTIFICATION;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postUserNotification = postUserNotification;
    function postLogout() {
        const { url, interfaceId } = Endpoints.LOGOUT;
        return sendRequest("post", url, interfaceId.post, {}, null);
    }
    WebApi.postLogout = postLogout;
    function postProfilePicture(dispatch, params) {
        const { url, interfaceId } = Endpoints.PROFILE_PICTURE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postProfilePicture = postProfilePicture;
    function postFlightRemarks(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.FLIGHT_REMARKS;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postFlightRemarks = postFlightRemarks;
    function getJobProfile(dispatch) {
        const { url, interfaceId } = Endpoints.JOB_PROFILE;
        return sendRequest("get", url, interfaceId.get, {}, dispatch);
    }
    WebApi.getJobProfile = getJobProfile;
    function postJobAuth(dispatch, params) {
        const { url, interfaceId } = Endpoints.JOB_AUTH;
        return sendRequest("post", url, interfaceId.post, params, dispatch);
    }
    WebApi.postJobAuth = postJobAuth;
    function getMaster(dispatch, params) {
        const { url, interfaceId } = Endpoints.MASTER;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getMaster = getMaster;
    function postAddressMail(dispatch, params) {
        const { url, interfaceId } = Endpoints.ADDRESS_MAIL;
        return sendRequest("post", url, interfaceId.post, params, dispatch);
    }
    WebApi.postAddressMail = postAddressMail;
    function postAddressTty(dispatch, params) {
        const { url, interfaceId } = Endpoints.ADDRESS_TTY;
        return sendRequest("post", url, interfaceId.post, params, dispatch);
    }
    WebApi.postAddressTty = postAddressTty;
    function postAddressJob(dispatch, params) {
        const { url, interfaceId } = Endpoints.ADDRESS_JOB;
        return sendRequest("post", url, interfaceId.post, params, dispatch);
    }
    WebApi.postAddressJob = postAddressJob;
    function getMqttServer(dispatch) {
        const { url, interfaceId } = Endpoints.MQTT_SERVER;
        return sendRequest("get", url, interfaceId.get, {}, dispatch);
    }
    WebApi.getMqttServer = getMqttServer;
    function getFis(dispatch, params) {
        const { url, interfaceId } = Endpoints.FIS;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getFis = getFis;
    function getFisTest(dispatch, params = {}, count) {
        return sendRequest("get", `/flightschedule/${count}`, "", params, dispatch);
    }
    WebApi.getFisTest = getFisTest;
    function getSpotRemarks(dispatch, params) {
        const { url, interfaceId } = Endpoints.SPOT_REMARKS;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getSpotRemarks = getSpotRemarks;
    function postSpotRemarks(dispatch, params) {
        const { url, interfaceId } = Endpoints.SPOT_REMARKS;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postSpotRemarks = postSpotRemarks;
    function getAirportIssue(dispatch, params) {
        const { url, interfaceId } = Endpoints.AIRPORT_ISSUE;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getAirportIssue = getAirportIssue;
    function postAirportIssue(dispatch, params) {
        const { url, interfaceId } = Endpoints.AIRPORT_ISSUE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postAirportIssue = postAirportIssue;
    function postAirportIssueTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.AIRPORT_ISSUE_TEMPLATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postAirportIssueTemplate = postAirportIssueTemplate;
    function getWorkStep(dispatch, params) {
        const { url, interfaceId } = Endpoints.WORK_STEP;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getWorkStep = getWorkStep;
    function postWorkStep(dispatch, params) {
        const { url, interfaceId } = Endpoints.WORK_STEP;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postWorkStep = postWorkStep;
    function getFlightDetail(dispatch, params, messages) {
        const { url, interfaceId } = Endpoints.FLIGHT_DETAIL;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, undefined, messages);
    }
    WebApi.getFlightDetail = getFlightDetail;
    function getFlightList(dispatch, params) {
        const { url, interfaceId } = Endpoints.FLIGHT_LIST;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getFlightList = getFlightList;
    function getFlightHistory(dispatch, params) {
        const { url, interfaceId } = Endpoints.FLIGHT_HISTORY;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getFlightHistory = getFlightHistory;
    function getFlightSpecialCare(dispatch, params) {
        const { url, interfaceId } = Endpoints.FLIGHT_SPECIAL_CARE;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getFlightSpecialCare = getFlightSpecialCare;
    function getFlightPaxFrom(dispatch, params) {
        const { url, interfaceId } = Endpoints.FLIGHT_PAX_FROM;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getFlightPaxFrom = getFlightPaxFrom;
    function getFlightPaxTo(dispatch, params) {
        const { url, interfaceId } = Endpoints.FLIGHT_PAX_TO;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getFlightPaxTo = getFlightPaxTo;
    function getBroadcastTemplates(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_TEMPLATE;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getBroadcastTemplates = getBroadcastTemplates;
    function postBroadcastTemplateName(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BROADCAST_TEMPLATE_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBroadcastTemplateName = postBroadcastTemplateName;
    function postBroadcastTemplateDelete(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BROADCAST_TEMPLATE_DELETE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBroadcastTemplateDelete = postBroadcastTemplateDelete;
    function getBroadcastBb(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BROADCAST_BB;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, callbacks);
    }
    WebApi.getBroadcastBb = getBroadcastBb;
    function postBroadcastBb(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_BB;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastBb = postBroadcastBb;
    function postBroadcastBbUpdate(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BROADCAST_BB_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBroadcastBbUpdate = postBroadcastBbUpdate;
    function getBroadcastBbTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_BB_TEMPLATE;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getBroadcastBbTemplate = getBroadcastBbTemplate;
    function postBroadcastBbTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_BB_TEMPLATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastBbTemplate = postBroadcastBbTemplate;
    function postBroadcastBbTemplateUpdate(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BROADCAST_BB_TEMPLATE_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBroadcastBbTemplateUpdate = postBroadcastBbTemplateUpdate;
    function getBroadcastFlightLeg(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_BB_FLIGHT_LEG;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getBroadcastFlightLeg = getBroadcastFlightLeg;
    function postBroadcastFlightStart(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_BB_FLIGHT_START;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastFlightStart = postBroadcastFlightStart;
    function postBroadcastEmail(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_EMAIL;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastEmail = postBroadcastEmail;
    function getBroadcastEmailTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_EMAIL_TEMPLATE;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getBroadcastEmailTemplate = getBroadcastEmailTemplate;
    function postBroadcastEmailTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_EMAIL_TEMPLATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastEmailTemplate = postBroadcastEmailTemplate;
    function postBroadcastEmailTemplateUpdate(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BROADCAST_EMAIL_TEMPLATE_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBroadcastEmailTemplateUpdate = postBroadcastEmailTemplateUpdate;
    function postBroadcastTty(dispatch, params, isShowSuccessMessage = true, isShowErrorMessage = true) {
        const { url, interfaceId } = Endpoints.BROADCAST_TTY;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, undefined, undefined, isShowSuccessMessage, isShowErrorMessage);
    }
    WebApi.postBroadcastTty = postBroadcastTty;
    function getBroadcastTtyTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_TTY_TEMPLATE;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getBroadcastTtyTemplate = getBroadcastTtyTemplate;
    function postBroadcastTtyTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_TTY_TEMPLATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastTtyTemplate = postBroadcastTtyTemplate;
    function postBroadcastTtyTemplateUpdate(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BROADCAST_TTY_TEMPLATE_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBroadcastTtyTemplateUpdate = postBroadcastTtyTemplateUpdate;
    function postBroadcastAftn(dispatch, params, isShowSuccessMessage = true) {
        const { url, interfaceId } = Endpoints.BROADCAST_AFTN;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, undefined, undefined, isShowSuccessMessage);
    }
    WebApi.postBroadcastAftn = postBroadcastAftn;
    function getBroadcastAftnTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_AFTN_TEMPLATE;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getBroadcastAftnTemplate = getBroadcastAftnTemplate;
    function postBroadcastAftnTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_AFTN_TEMPLATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastAftnTemplate = postBroadcastAftnTemplate;
    function postBroadcastAftnTemplateUpdate(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BROADCAST_AFTN_TEMPLATE_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBroadcastAftnTemplateUpdate = postBroadcastAftnTemplateUpdate;
    function postBroadcastAcars(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_ACARS;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastAcars = postBroadcastAcars;
    function getBroadcastAcarsTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_ACARS_TEMPLATE;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getBroadcastAcarsTemplate = getBroadcastAcarsTemplate;
    function postBroadcastAcarsTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_ACARS_TEMPLATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastAcarsTemplate = postBroadcastAcarsTemplate;
    function postBroadcastAcarsTemplateUpdate(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BROADCAST_ACARS_TEMPLATE_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBroadcastAcarsTemplateUpdate = postBroadcastAcarsTemplateUpdate;
    function postBroadcastNtf(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_NTF;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastNtf = postBroadcastNtf;
    function getBroadcastNtfTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_NTF_TEMPLATE;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getBroadcastNtfTemplate = getBroadcastNtfTemplate;
    function postBroadcastNtfTemplate(dispatch, params) {
        const { url, interfaceId } = Endpoints.BROADCAST_NTF_TEMPLATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postBroadcastNtfTemplate = postBroadcastNtfTemplate;
    function postBroadcastNtfTemplateUpdate(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BROADCAST_NTF_TEMPLATE_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBroadcastNtfTemplateUpdate = postBroadcastNtfTemplateUpdate;
    function getBulletinBoardTheads(dispatch, params) {
        const { url, interfaceId } = Endpoints.BB_THREADS;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getBulletinBoardTheads = getBulletinBoardTheads;
    function getBulletinBoardThead(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BB_THREAD;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, callbacks);
    }
    WebApi.getBulletinBoardThead = getBulletinBoardThead;
    function postBulletinBoardComment(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BB_COMMENT;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBulletinBoardComment = postBulletinBoardComment;
    function postBulletinBoardCommentUpdate(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BB_COMMENT_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBulletinBoardCommentUpdate = postBulletinBoardCommentUpdate;
    function postBulletinBoardCommentDelete(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BB_COMMENT_DELETE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBulletinBoardCommentDelete = postBulletinBoardCommentDelete;
    function postBulletinBoardResponse(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BB_RESPONSE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBulletinBoardResponse = postBulletinBoardResponse;
    function postBulletinBoardResponseUpdate(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BB_RESPONSE_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBulletinBoardResponseUpdate = postBulletinBoardResponseUpdate;
    function postBulletinBoardResponseDelete(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BB_RESPONSE_DELETE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBulletinBoardResponseDelete = postBulletinBoardResponseDelete;
    function postBulletinBoardThreadDelete(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BB_THREAD_DELETE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postBulletinBoardThreadDelete = postBulletinBoardThreadDelete;
    function getBulletinBoardTheadFile(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.BB_THREAD_FILE;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, callbacks);
    }
    WebApi.getBulletinBoardTheadFile = getBulletinBoardTheadFile;
    function getBulletinBoardTheadsFlight(dispatch, params, messages) {
        const { url, interfaceId } = Endpoints.BB_THREADS_FLIGHT;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, undefined, messages);
    }
    WebApi.getBulletinBoardTheadsFlight = getBulletinBoardTheadsFlight;
    function postBulletinBoardThreadReaction(dispatch, params) {
        const { url, interfaceId } = Endpoints.BB_THREAD_REACTION;
        return sendRequest("post", url, interfaceId.post, params, dispatch, false, undefined, undefined, true, false // エラー表示は抑制する仕様
        );
    }
    WebApi.postBulletinBoardThreadReaction = postBulletinBoardThreadReaction;
    function postBulletinBoardResponseReaction(dispatch, params) {
        const { url, interfaceId } = Endpoints.BB_RESPONSE_REACTION;
        return sendRequest("post", url, interfaceId.post, params, dispatch, false, undefined, undefined, true, false // エラー表示は抑制する仕様
        );
    }
    WebApi.postBulletinBoardResponseReaction = postBulletinBoardResponseReaction;
    function postBulletinBoardCommentReaction(dispatch, params) {
        const { url, interfaceId } = Endpoints.BB_COMMENT_REACTION;
        return sendRequest("post", url, interfaceId.post, params, dispatch, false, undefined, undefined, true, false // エラー表示は抑制する仕様
        );
    }
    WebApi.postBulletinBoardCommentReaction = postBulletinBoardCommentReaction;
    function getOalFlightSchedule(dispatch, params) {
        const { url, interfaceId } = Endpoints.OAL_FLIGHT_SCHEDULE;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false);
    }
    WebApi.getOalFlightSchedule = getOalFlightSchedule;
    function postOalFlightSchedule(dispatch, params) {
        const { url, interfaceId } = Endpoints.OAL_FLIGHT_SCHEDULE_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, undefined, undefined, false);
    }
    WebApi.postOalFlightSchedule = postOalFlightSchedule;
    function getFlightMovement(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.FLIGHT_MOVEMENT;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, callbacks);
    }
    WebApi.getFlightMovement = getFlightMovement;
    function postFlightMovement(dispatch, params, callbacks, isShowSuccessMessage = true) {
        const { url, interfaceId } = Endpoints.FLIGHT_MOVEMENT_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks, undefined, isShowSuccessMessage);
    }
    WebApi.postFlightMovement = postFlightMovement;
    function getOalFlightMovement(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.OAL_FLIGHT_MOVEMENT;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, callbacks);
    }
    WebApi.getOalFlightMovement = getOalFlightMovement;
    function postOalFlightMovement(dispatch, params, callbacks, isShowSuccessMessage = true) {
        const { url, interfaceId } = Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks, undefined, isShowSuccessMessage);
    }
    WebApi.postOalFlightMovement = postOalFlightMovement;
    function postFlightMovementSpot(dispatch, params, callbacks, isShowSuccessMessage = true) {
        const { url, interfaceId } = Endpoints.FLIGHT_MOVEMENT_UPDATE_SPOT;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks, undefined, isShowSuccessMessage);
    }
    WebApi.postFlightMovementSpot = postFlightMovementSpot;
    function postOalFlightMovementSpot(dispatch, params, callbacks, isShowSuccessMessage = true) {
        const { url, interfaceId } = Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE_SPOT;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks, undefined, isShowSuccessMessage);
    }
    WebApi.postOalFlightMovementSpot = postOalFlightMovementSpot;
    function postSpotNumberRestrictionCheck(dispatch, params) {
        const { url, interfaceId } = Endpoints.SPOT_NUMBER_RESTRICTION_CHECK;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, {}, undefined, false);
    }
    WebApi.postSpotNumberRestrictionCheck = postSpotNumberRestrictionCheck;
    function postOalFlightMovementEqp(dispatch, params, callbacks, isShowSuccessMessage = true) {
        const { url, interfaceId } = Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE_EQP;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks, undefined, isShowSuccessMessage);
    }
    WebApi.postOalFlightMovementEqp = postOalFlightMovementEqp;
    function postOalFlightIrregularUpdate(dispatch, params, callbacks, isShowSuccessMessage = true) {
        const { url, interfaceId } = Endpoints.OAL_FLIGHT_IRREGULAR_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks, undefined, isShowSuccessMessage);
    }
    WebApi.postOalFlightIrregularUpdate = postOalFlightIrregularUpdate;
    function getOalPax(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.OAL_PAX;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, callbacks);
    }
    WebApi.getOalPax = getOalPax;
    function postOalPax(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.OAL_PAX;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postOalPax = postOalPax;
    function getOalPaxStatus(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.OAL_PAX_STATUS;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, callbacks);
    }
    WebApi.getOalPaxStatus = getOalPaxStatus;
    function postOalPaxStatus(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.OAL_PAX_STATUS;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postOalPaxStatus = postOalPaxStatus;
    function getLegArrDepCtrl(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.LEG_ARR_DEP_CTRL;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, callbacks);
    }
    WebApi.getLegArrDepCtrl = getLegArrDepCtrl;
    function getOalFuel(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.OAL_FUEL;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, callbacks);
    }
    WebApi.getOalFuel = getOalFuel;
    function postOalFuel(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.OAL_FUEL;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks);
    }
    WebApi.postOalFuel = postOalFuel;
    function getMySchedule(dispatch, params) {
        const { url, interfaceId } = Endpoints.MYSCHEDULE;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false);
    }
    WebApi.getMySchedule = getMySchedule;
    function getMyScheduleFis(dispatch, params) {
        const { url, interfaceId } = Endpoints.MYSCHEDULE_FIS;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false);
    }
    WebApi.getMyScheduleFis = getMyScheduleFis;
    function postMySchedule(dispatch, params) {
        const { url, interfaceId } = Endpoints.MYSCHEDULE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true);
    }
    WebApi.postMySchedule = postMySchedule;
    function getAcarsStatus(dispatch, params) {
        const { url, interfaceId } = Endpoints.ACARS_STATUS;
        return sendRequest("get", url, interfaceId.get, params, dispatch);
    }
    WebApi.getAcarsStatus = getAcarsStatus;
    function get(dispatch, params, url) {
        return sendRequest("get", url, undefined, params, dispatch);
    }
    WebApi.get = get;
    function post(dispatch, params, url) {
        return sendRequest("post", url, undefined, params, dispatch);
    }
    WebApi.post = post;
    function getMvtMsg(dispatch, params, callbacks) {
        const { url, interfaceId } = Endpoints.MVT_MSG;
        return sendRequest("get", url, interfaceId.get, params, dispatch, false, callbacks);
    }
    WebApi.getMvtMsg = getMvtMsg;
    function postMvtMsg(dispatch, params, callbacks, isShowSuccessMessage = true) {
        const { url, interfaceId } = Endpoints.MVT_MSG_UPDATE;
        return sendRequest("post", url, interfaceId.post, params, dispatch, true, callbacks, undefined, isShowSuccessMessage);
    }
    WebApi.postMvtMsg = postMvtMsg;
    /**
     * WebApi共通のリクエスト
     */
    function sendRequest(method, url, interfaceId = "", params, dispatch, isUpdate = false, callbacks, messages, isShowSuccessMessage = true, isShowErrorMessage = true) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return new Promise((resolve, reject) => {
            const id = new Date().getTime().toString();
            if (dispatch) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                dispatch((0, common_1.showMask)());
                if (isUpdate) {
                    notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M30001C() });
                }
            }
            const headers = {};
            let requestData;
            let requestParams;
            const { token } = storage_1.storage;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const jobAuthResponse = JSON.parse(storage_1.storage.jobAuthResponse || "{}");
            const connectServer = Object.keys(jobAuthResponse).length === 0 || (jobAuthResponse.user && jobAuthResponse.user.commonSiteFlg === false)
                ? config_1.ServerConfig.API_SERVER_PRIORITY
                : config_1.ServerConfig.API_SERVER_COMMON;
            if (url === Endpoints.JOB_PROFILE.url || url === Endpoints.JOB_AUTH.url) {
                const sessionId = (0, commonUtil_1.getCookie)("X-Session-Id");
                if (sessionId) {
                    headers["X-Session-Id"] = sessionId;
                }
                else if (dispatch) {
                    // cookieからSessionIDが取得できなかった場合、APIでエラーになるのでリクエストしない
                    if (process.env.NODE_ENV !== "development") {
                        // 開発環境を除く
                        dispatch((0, common_1.hideMask)());
                        notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M50021C() });
                        // eslint-disable-next-line no-promise-executor-return
                        return reject();
                    }
                }
            }
            else if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
            if (method === "post") {
                requestData = params;
            }
            else {
                requestParams = params;
            }
            headers["X-Interface-Id"] = interfaceId;
            // リクエストconfig作成
            const config = {
                method,
                data: requestData,
                params: requestParams,
                url: connectServer + url,
                timeout: TIME_OUT,
                headers,
                validateStatus(status) {
                    // 503のみリトライ対象とする
                    return status !== 503;
                },
            };
            // eslint-disable-next-line no-promise-executor-return
            const sleepByPromise = (milSec) => new Promise((resolve1) => setTimeout(resolve1, milSec));
            const sleepRequest = async (milSec) => {
                await sleepByPromise(milSec);
                return axios_1.default.request(config);
            };
            const execLogout = () => {
                if (dispatch)
                    void dispatch((0, common_1.logout)());
            };
            // eslint-disable-next-line no-promise-executor-return
            return (axios_1.default
                .request(config)
                // リトライ処理
                .catch(() => sleepRequest(500))
                .catch(() => sleepRequest(1000))
                .catch(() => sleepRequest(1500))
                // エラーハンドリング
                .catch((err) => {
                if (err.response) {
                    throw new ApiError("ERROR API_SERVER BUSY", err.response);
                }
                throw new ApiError("ERROR NETWORK", null);
            })
                .then((response) => {
                switch (response.status) {
                    case 200:
                        return response;
                    case 400:
                        throw new ApiError("ERROR BAD REQUEST", response);
                    case 401:
                        throw new ApiError("ERROR UNAUTHORIZED", response);
                    case 403:
                        throw new ApiError("ERROR FORBIDDEN", response);
                    case 404:
                        throw new ApiError("ERROR NOT FOUND", response);
                    case 405:
                        throw new ApiError("ERROR METHOD NOT ALLOWED", response);
                    case 409:
                        throw new ApiError("ERROR CONFLICT", response);
                    case 422:
                        throw new ApiError("ERROR VALIDATION", response);
                    case 512:
                        throw new ApiError("ERROR API_SERVER DB", response);
                    case 513:
                        throw new ApiError("ERROR API_SERVER MQ", response);
                    case 514:
                        throw new ApiError("ERROR API_SERVER INTERNAL", response);
                    case 523:
                        throw new ApiError("ERROR LOCKED", response);
                    case 591:
                        throw new ApiError("ERROR OCCURED IN RIVOR", response);
                    default:
                        throw new ApiError("ERROR API_SERVER UNKNOWN", response);
                }
            })
                // 通知表示
                .then((response) => {
                var _a, _b;
                if (!dispatch) {
                    return resolve(response);
                }
                if (isUpdate) {
                    if (!isShowSuccessMessage) {
                        notifications_1.NotificationCreator.remove({ dispatch, id });
                    }
                    else if (interfaceId === Endpoints.OAL_FLIGHT_IRREGULAR_UPDATE.interfaceId.post && callbacks && callbacks.onSuccess) {
                        notifications_1.NotificationCreator.create({
                            dispatch,
                            id,
                            message: soalaMessages_1.SoalaMessage.M30011C({
                                onYesButton: callbacks.onSuccess,
                            }),
                        });
                    }
                    else if (interfaceId === Endpoints.MVT_MSG_UPDATE.interfaceId.post) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                        if ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.conditions) === null || _b === void 0 ? void 0 : _b.includes("tty_not_sent")) {
                            notifications_1.NotificationCreator.create({
                                dispatch,
                                id,
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                                message: soalaMessages_1.SoalaMessage.M30014C({ onOkButton: callbacks === null || callbacks === void 0 ? void 0 : callbacks.onSuccess, condition: "TTY not sent" }),
                            });
                        }
                        else {
                            if (callbacks === null || callbacks === void 0 ? void 0 : callbacks.onSuccess) {
                                callbacks.onSuccess();
                            }
                            notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M30002C() });
                        }
                    }
                    else {
                        notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M30002C() });
                    }
                }
                if (interfaceId === Endpoints.FLIGHT_LIST.interfaceId.get &&
                    response.data &&
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    response.data.eLegList &&
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    response.data.eLegList.length === 0) {
                    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30003C() });
                }
                dispatch((0, common_1.hideMask)());
                return resolve(response);
            })
                .catch((err) => {
                if (!dispatch) {
                    return reject(err);
                }
                dispatch((0, common_1.hideMask)());
                // #15985でAFTN送信時に同じ内容をTTYでも送信するという要件が入ったが、TTY送信は補助的要素で必達ではないため、
                // isShowErrorMessageで切り分けを行って通常のエラー表示は抑制し、呼び出し元に警告メッセージの表示を委譲する。
                if (!isShowErrorMessage) {
                    notifications_1.NotificationCreator.remove({ dispatch, id });
                    return reject(err);
                }
                const statusCode = err.response ? err.response.status : null;
                // ネットワークエラー
                if (statusCode === null || statusCode === 0) {
                    notifications_1.NotificationCreator.createWithOneMessage({
                        dispatch,
                        currentId: id,
                        newId: notificationIds.errNetwork,
                        message: soalaMessages_1.SoalaMessage.M50013C({
                            onYesButton: () => {
                                if (callbacks && callbacks.onNetworkError)
                                    callbacks.onNetworkError();
                            },
                            onNoButton: execLogout,
                        }),
                    });
                    return reject(err);
                }
                const data = err.response && err.response.data ? err.response.data : { type: "" };
                const errorType = data.type && data.type.toLowerCase();
                // APIのエラー
                switch (statusCode) {
                    case 400: // パラメータエラー
                        notifications_1.NotificationCreator.create({
                            dispatch,
                            id,
                            message: soalaMessages_1.SoalaMessage.M50001C({
                                statusCode,
                                onOkButton: execLogout,
                            }),
                        });
                        return reject(err);
                    case 401: // 認証エラー
                        switch (interfaceId) {
                            case Endpoints.JOB_AUTH.interfaceId.post:
                                // ログイン画面
                                if (errorType === "session") {
                                    // A	処理中断（ログイン遷移）
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M50002C({ statusCode, onOkButton: execLogout }),
                                    });
                                }
                                else {
                                    // ID PASSWORD不正
                                    notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M50004C({ statusCode }) });
                                }
                                return reject(err);
                            default:
                                notifications_1.NotificationCreator.createWithOneMessage({
                                    dispatch,
                                    currentId: id,
                                    newId: notificationIds.err401,
                                    message: soalaMessages_1.SoalaMessage.M50003C({ statusCode, onOkButton: execLogout }),
                                });
                                return reject(err);
                        }
                    case 403: // アカウントロック(通常は起こり得ない) または 参照権限なし
                        switch (interfaceId) {
                            case Endpoints.BROADCAST_BB_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_EMAIL_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_TTY_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_AFTN_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_NTF_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_ACARS_TEMPLATE.interfaceId.get:
                                notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M40015C({}) });
                                return reject(err);
                            case Endpoints.BROADCAST_BB.interfaceId.get:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M40015C({ onOkButton: () => dispatch((0, common_1.forceGoTo)({ path: commonConst_1.Const.PATH_NAME.bulletinBoard })) }),
                                });
                                return reject(err);
                            case Endpoints.BROADCAST_BB_TEMPLATE.interfaceId.post:
                            case Endpoints.BROADCAST_EMAIL_TEMPLATE.interfaceId.post:
                            case Endpoints.BROADCAST_TTY_TEMPLATE.interfaceId.post:
                            case Endpoints.BROADCAST_AFTN_TEMPLATE.interfaceId.post:
                            case Endpoints.BROADCAST_NTF_TEMPLATE.interfaceId.post:
                            case Endpoints.BROADCAST_ACARS_TEMPLATE.interfaceId.post:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M40016C({ onOkButton: () => { } }),
                                });
                                return reject(err);
                            case Endpoints.BB_THREAD.interfaceId.get:
                            case Endpoints.BB_COMMENT.interfaceId.post:
                            case Endpoints.BB_COMMENT_UPDATE.interfaceId.post:
                            case Endpoints.BB_COMMENT_DELETE.interfaceId.post:
                            case Endpoints.BB_RESPONSE.interfaceId.post:
                            case Endpoints.BB_THREAD_FILE.interfaceId.get:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M40015C({ onOkButton: callbacks && callbacks.onForbidden }),
                                });
                                return reject(err);
                            default:
                                notifications_1.NotificationCreator.createWithOneMessage({
                                    dispatch,
                                    currentId: id,
                                    newId: notificationIds.err403,
                                    message: soalaMessages_1.SoalaMessage.M50006C({ statusCode, onOkButton: execLogout }),
                                });
                                return reject(err);
                        }
                    case 404: // 該当レコードなし
                        switch (interfaceId) {
                            case Endpoints.JOB_AUTH.interfaceId.post:
                            case Endpoints.JOB_PROFILE.interfaceId.get:
                                // 該当レコードなし（失敗）ログアウト
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M50007C({ statusCode, onOkButton: execLogout }),
                                });
                                return reject(err);
                            case Endpoints.HEADER.interfaceId.get:
                                notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M30007C() });
                                return reject(err);
                            case Endpoints.BROADCAST_BB.interfaceId.get:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M40013C({
                                        item: "thread",
                                        onOkButton: () => dispatch((0, common_1.forceGoTo)({ path: commonConst_1.Const.PATH_NAME.bulletinBoard })),
                                    }),
                                });
                                return reject(err);
                            case Endpoints.FLIGHT_DETAIL.interfaceId.get:
                            case Endpoints.BB_THREADS_FLIGHT.interfaceId.get:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: (messages && messages[statusCode]) ||
                                        soalaMessages_1.SoalaMessage.M50007C({
                                            statusCode,
                                            onOkButton: () => {
                                                dispatch((0, common_1.forceGoTo)({ path: commonConst_1.Const.PATH_NAME.myPage }));
                                                void dispatch((0, common_1.closeAllDraggableModals)());
                                            },
                                        }),
                                });
                                return reject(err);
                            case Endpoints.AIRPORT_REMARKS.interfaceId.post:
                            case Endpoints.WORK_STEP.interfaceId.get:
                            case Endpoints.WORK_STEP.interfaceId.post:
                            case Endpoints.PROFILE_PICTURE.interfaceId.post:
                            case Endpoints.BB_THREADS.interfaceId.get:
                            case Endpoints.FLIGHT_HISTORY.interfaceId.get:
                            case Endpoints.FLIGHT_SPECIAL_CARE.interfaceId.get:
                            case Endpoints.FLIGHT_PAX_FROM.interfaceId.get:
                            case Endpoints.FLIGHT_PAX_TO.interfaceId.get:
                            case Endpoints.SPOT_REMARKS.interfaceId.get:
                            case Endpoints.SPOT_REMARKS.interfaceId.post:
                            case Endpoints.MYSCHEDULE.interfaceId.get:
                            case Endpoints.MYSCHEDULE.interfaceId.post:
                            case Endpoints.MYSCHEDULE_FIS.interfaceId.get:
                                // 該当レコードなし（失敗）Mypageへ遷移
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M50007C({
                                        statusCode,
                                        onOkButton: () => {
                                            dispatch((0, common_1.forceGoTo)({ path: commonConst_1.Const.PATH_NAME.myPage }));
                                            void dispatch((0, common_1.closeAllDraggableModals)());
                                        },
                                    }),
                                });
                                return reject(err);
                            case Endpoints.MVT_MSG.interfaceId.get:
                                if (errorType === "pastdb") {
                                    // 該当データなし（過去DB参照）
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M40023C({}),
                                    });
                                    return reject(err);
                                }
                                // 該当レコードなし（失敗）Mypageへ遷移
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M50007C({
                                        statusCode,
                                        onOkButton: () => {
                                            dispatch((0, common_1.forceGoTo)({ path: commonConst_1.Const.PATH_NAME.myPage }));
                                            void dispatch((0, common_1.closeAllDraggableModals)());
                                            if (callbacks && callbacks.onNotFoundRecord) {
                                                callbacks.onNotFoundRecord();
                                            }
                                        },
                                    }),
                                });
                                return reject(err);
                            case Endpoints.FLIGHT_MOVEMENT.interfaceId.get:
                            case Endpoints.FLIGHT_MOVEMENT_UPDATE.interfaceId.post:
                            case Endpoints.FLIGHT_MOVEMENT_UPDATE_SPOT.interfaceId.post:
                            case Endpoints.FLIGHT_REMARKS.interfaceId.post:
                            case Endpoints.OAL_PAX.interfaceId.get:
                            case Endpoints.OAL_PAX.interfaceId.post:
                            case Endpoints.OAL_PAX_STATUS.interfaceId.get:
                            case Endpoints.OAL_PAX_STATUS.interfaceId.post:
                            case Endpoints.OAL_FUEL.interfaceId.get:
                            case Endpoints.OAL_FUEL.interfaceId.post:
                            case Endpoints.OAL_FLIGHT_MOVEMENT.interfaceId.get:
                            case Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE.interfaceId.post:
                            case Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE_SPOT.interfaceId.post:
                            case Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE_EQP.interfaceId.post:
                            case Endpoints.OAL_FLIGHT_IRREGULAR_UPDATE.interfaceId.post:
                            case Endpoints.MVT_MSG_UPDATE.interfaceId.post:
                                // 該当レコードなし（失敗）Mypageへ遷移
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M50007C({
                                        statusCode,
                                        onOkButton: () => {
                                            dispatch((0, common_1.forceGoTo)({ path: commonConst_1.Const.PATH_NAME.myPage }));
                                            void dispatch((0, common_1.closeAllDraggableModals)());
                                            if (callbacks && callbacks.onNotFoundRecord) {
                                                callbacks.onNotFoundRecord();
                                            }
                                        },
                                    }),
                                });
                                return reject(err);
                            case Endpoints.ACARS_STATUS.interfaceId.get:
                                if (!params.shipNo) {
                                    // 全件取得時に該当レコードなし（失敗）Mypageへ遷移
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M50007C({
                                            statusCode,
                                            onOkButton: () => {
                                                dispatch((0, common_1.forceGoTo)({ path: commonConst_1.Const.PATH_NAME.myPage }));
                                                void dispatch((0, common_1.closeAllDraggableModals)());
                                                if (callbacks && callbacks.onNotFoundRecord) {
                                                    callbacks.onNotFoundRecord();
                                                }
                                            },
                                        }),
                                    });
                                }
                                return reject(err);
                            case Endpoints.BB_THREAD_DELETE.interfaceId.post:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                                });
                                return reject(err);
                            case Endpoints.FLIGHT_LIST.interfaceId.get:
                            case Endpoints.BROADCAST_BB_FLIGHT_LEG.interfaceId.get:
                            case Endpoints.OAL_FLIGHT_SCHEDULE.interfaceId.get:
                                // 該当レコードなし（0件）
                                notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M30003C() });
                                dispatch((0, common_1.hideMask)());
                                return resolve(err.response);
                            case Endpoints.BROADCAST_BB_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_EMAIL_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_TTY_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_AFTN_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_NTF_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_ACARS_TEMPLATE.interfaceId.get:
                            case Endpoints.BROADCAST_BB_TEMPLATE_UPDATE.interfaceId.post:
                            case Endpoints.BROADCAST_EMAIL_TEMPLATE_UPDATE.interfaceId.post:
                            case Endpoints.BROADCAST_TTY_TEMPLATE_UPDATE.interfaceId.post:
                            case Endpoints.BROADCAST_AFTN_TEMPLATE_UPDATE.interfaceId.post:
                            case Endpoints.BROADCAST_NTF_TEMPLATE_UPDATE.interfaceId.post:
                            case Endpoints.BROADCAST_ACARS_TEMPLATE_UPDATE.interfaceId.post:
                            case Endpoints.BROADCAST_TEMPLATE_UPDATE.interfaceId.post:
                                // 該当レコードなし
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M40013C({ item: "template", onOkButton: callbacks && callbacks.onNotFoundTemplate }),
                                });
                                return reject(err);
                            case Endpoints.BROADCAST_BB_UPDATE.interfaceId.post:
                            case Endpoints.BB_THREAD.interfaceId.get:
                                // 該当レコードなし
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    message: soalaMessages_1.SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                                });
                                return reject(err);
                            case Endpoints.BB_COMMENT.interfaceId.post:
                            case Endpoints.BB_RESPONSE.interfaceId.post:
                                if (errorType === "thread") {
                                    // スレッドが存在しない場合
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                                    });
                                }
                                else {
                                    notifications_1.NotificationCreator.remove({ dispatch, id });
                                }
                                return reject(err);
                            case Endpoints.BB_COMMENT_UPDATE.interfaceId.post:
                                if (errorType === "thread") {
                                    // スレッドが存在しない場合
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                                    });
                                }
                                else {
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M40013C({ item: "comment", onOkButton: callbacks && callbacks.onNotFoundComment }),
                                    });
                                }
                                return reject(err);
                            case Endpoints.BB_RESPONSE_UPDATE.interfaceId.post:
                                if (errorType === "thread") {
                                    // スレッドが存在しない場合
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                                    });
                                }
                                else {
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M40013C({ item: "res.", onOkButton: callbacks && callbacks.onNotFoundRes }),
                                    });
                                }
                                return reject(err);
                            case Endpoints.BB_COMMENT_DELETE.interfaceId.post:
                                if (errorType === "thread") {
                                    // スレッドが存在しない場合
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                                    });
                                }
                                else {
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M40013C({ item: "comment", onOkButton: callbacks && callbacks.onNotFoundComment }),
                                    });
                                }
                                return reject(err);
                            case Endpoints.BB_RESPONSE_DELETE.interfaceId.post:
                                if (errorType === "thread") {
                                    // スレッドが存在しない場合
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                                    });
                                }
                                else {
                                    notifications_1.NotificationCreator.create({
                                        dispatch,
                                        id,
                                        message: soalaMessages_1.SoalaMessage.M40013C({ item: "res.", onOkButton: callbacks && callbacks.onNotFoundRes }),
                                    });
                                }
                                return reject(err);
                            case Endpoints.BB_THREAD_FILE.interfaceId.get:
                                notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M50024C() });
                                return reject(err);
                            case Endpoints.BROADCAST_TEMPLATE_DELETE.interfaceId.post:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M40013C({ item: "template", onOkButton: callbacks && callbacks.onNotFoundTemplate }),
                                });
                                return reject(err);
                            case Endpoints.LEG_ARR_DEP_CTRL.interfaceId.get:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M40020C({ onOkButton: callbacks && callbacks.onNotFoundRecord }),
                                });
                                return reject(err);
                            default:
                                // メッセージ削除
                                notifications_1.NotificationCreator.remove({ dispatch, id });
                                return reject(err);
                        }
                    case 405: // 権限なしエラー
                        if (errorType === "apocd") {
                            // 所属空港のチェックの場合、ログアウトしない
                            notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M50025C({}) });
                        }
                        else if (interfaceId === Endpoints.BROADCAST_BB.interfaceId.get) {
                            notifications_1.NotificationCreator.create({
                                dispatch,
                                id,
                                message: soalaMessages_1.SoalaMessage.M40015C({ onOkButton: callbacks && callbacks.onNotAllowed }),
                            });
                        }
                        else {
                            notifications_1.NotificationCreator.createWithOneMessage({
                                dispatch,
                                currentId: id,
                                newId: notificationIds.err405,
                                message: soalaMessages_1.SoalaMessage.M50008C({ statusCode, onOkButton: execLogout }),
                            });
                        }
                        return reject(err);
                    case 409: // コンフリクト
                        switch (interfaceId) {
                            case Endpoints.OAL_PAX.interfaceId.post:
                            case Endpoints.OAL_PAX_STATUS.interfaceId.post:
                            case Endpoints.OAL_FUEL.interfaceId.post:
                            case Endpoints.MVT_MSG_UPDATE.interfaceId.post:
                                notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M50031C({}) });
                                return reject(err);
                            case Endpoints.OAL_PAX.interfaceId.get:
                            case Endpoints.OAL_PAX_STATUS.interfaceId.get:
                            case Endpoints.LEG_ARR_DEP_CTRL.interfaceId.get:
                            case Endpoints.OAL_FUEL.interfaceId.get:
                            case Endpoints.FLIGHT_MOVEMENT.interfaceId.get:
                            case Endpoints.OAL_FLIGHT_MOVEMENT.interfaceId.get:
                            case Endpoints.MVT_MSG.interfaceId.get:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M40020C({ onOkButton: callbacks && callbacks.onNotFoundRecord }),
                                });
                                return reject(err);
                            default:
                                // メッセージ削除
                                notifications_1.NotificationCreator.remove({ dispatch, id });
                                return reject(err);
                        }
                    case 422: // バリデーション
                        // メッセージ削除
                        notifications_1.NotificationCreator.remove({ dispatch, id });
                        return reject(err);
                    case 500: // その他のエラー
                        switch (interfaceId) {
                            case Endpoints.ADDRESS_JOB.interfaceId.post:
                            case Endpoints.ADDRESS_MAIL.interfaceId.post:
                            case Endpoints.ADDRESS_TTY.interfaceId.post:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M50010C({
                                        statusCode,
                                        onYesButton: () => {
                                            void dispatch((0, common_1.closeDetailModal)());
                                        },
                                        onNoButton: execLogout,
                                    }),
                                });
                                return reject(err);
                            default:
                                notifications_1.NotificationCreator.createWithOneMessage({
                                    dispatch,
                                    currentId: id,
                                    newId: notificationIds.err500,
                                    message: soalaMessages_1.SoalaMessage.M50010C({
                                        statusCode,
                                        onYesButton: callbacks && callbacks.onSystemError,
                                        onNoButton: execLogout,
                                    }),
                                });
                                return reject(err);
                        }
                    case 512: // DB関連でエラー
                        switch (interfaceId) {
                            case Endpoints.ADDRESS_JOB.interfaceId.post:
                            case Endpoints.ADDRESS_MAIL.interfaceId.post:
                            case Endpoints.ADDRESS_TTY.interfaceId.post:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M50011C({
                                        statusCode,
                                        onYesButton: () => {
                                            void dispatch((0, common_1.closeDetailModal)());
                                        },
                                        onNoButton: execLogout,
                                    }),
                                });
                                return reject(err);
                            default:
                                notifications_1.NotificationCreator.createWithOneMessage({
                                    dispatch,
                                    currentId: id,
                                    newId: notificationIds.err512,
                                    message: soalaMessages_1.SoalaMessage.M50011C({
                                        statusCode,
                                        onYesButton: callbacks && callbacks.onSystemError,
                                        onNoButton: execLogout,
                                    }),
                                });
                                return reject(err);
                        }
                    case 513: // MQ関連でエラー
                        switch (interfaceId) {
                            case Endpoints.ADDRESS_JOB.interfaceId.post:
                            case Endpoints.ADDRESS_MAIL.interfaceId.post:
                            case Endpoints.ADDRESS_TTY.interfaceId.post:
                                notifications_1.NotificationCreator.create({
                                    dispatch,
                                    id,
                                    message: soalaMessages_1.SoalaMessage.M50012C({
                                        statusCode,
                                        onYesButton: () => {
                                            void dispatch((0, common_1.closeDetailModal)());
                                        },
                                        onNoButton: execLogout,
                                    }),
                                });
                                return reject(err);
                            default:
                                notifications_1.NotificationCreator.createWithOneMessage({
                                    dispatch,
                                    currentId: id,
                                    newId: notificationIds.err513,
                                    message: soalaMessages_1.SoalaMessage.M50012C({
                                        statusCode,
                                        onYesButton: callbacks && callbacks.onSystemError,
                                        onNoButton: execLogout,
                                    }),
                                });
                                return reject(err);
                        }
                    case 591: // RIVOR関連でエラー
                        if (interfaceId === Endpoints.WORK_STEP.interfaceId.post) {
                            notifications_1.NotificationCreator.create({
                                dispatch,
                                id,
                                message: soalaMessages_1.SoalaMessage.M40021C({ onOkButton: () => { } }),
                            });
                            return reject(err);
                        }
                    // eslint-disable-next-line no-fallthrough
                    default: // その他の予期せぬステータス、403 アカウントロック(起こり得ないのでその他扱いとする)
                        notifications_1.NotificationCreator.createWithOneMessage({
                            dispatch,
                            currentId: id,
                            newId: notificationIds.errOther,
                            message: soalaMessages_1.SoalaMessage.M50010C({ statusCode, onNoButton: execLogout }),
                        });
                        return reject(err);
                }
            }));
        });
    }
    WebApi.sendRequest = sendRequest;
})(WebApi = exports.WebApi || (exports.WebApi = {}));
//# sourceMappingURL=webApi.js.map