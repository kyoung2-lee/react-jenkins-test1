import axios, { AxiosResponse, AxiosError } from "axios";
import { AppDispatch } from "../store/storeType";
import { Const } from "./commonConst";
import { getCookie } from "./commonUtil";
import { storage } from "./storage";
import { NotificationCreator } from "./notifications";
import { SoalaMessage } from "./soalaMessages";
// eslint-disable-next-line import/no-cycle
import { showMask, hideMask, logout, forceGoTo, closeDetailModal, closeAllDraggableModals } from "../reducers/common";
import { ServerConfig } from "../../config/config";

export class ApiError extends Error {
  public name = "Api Error";
  constructor(public message: string, public response: AxiosResponse | null) {
    super(message);
  }
}

export interface Messages {
  [key: number]: SoalaMessage.Message;
}

/**
 * API通信を行う
 */
export namespace WebApi {
  const TIME_OUT = 30000;

  type Endpoint = {
    url: string;
    interfaceId: {
      get: string;
      post: string;
    };
  };
  type EndpointG = {
    url: string;
    interfaceId: {
      get: string;
    };
  };
  type EndpointP = {
    url: string;
    interfaceId: {
      post: string;
    };
  };

  export type Callbacks = {
    onSystemError?: () => void;
    onNetworkError?: () => void;
    onForbidden?: () => void;
    onNotFoundRecord?: () => void;
    onNotFoundThread?: () => void;
    onNotFoundRes?: () => void;
    onNotFoundComment?: () => void;
    onNotFoundTemplate?: () => void;
    onNotAllowed?: () => void;
    onSuccess?: () => void;
    onConflict?: () => void;
  };

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

  namespace Endpoints {
    export const JOB_AUTH: EndpointP = { url: "/Others/Job/Auth", interfaceId: { post: "S10101W3" } };
    export const JOB_PROFILE: EndpointG = { url: "/Others/Job/Profile", interfaceId: { get: "S10101W2" } };
    export const MASTER: EndpointG = { url: "/Others/Master", interfaceId: { get: "S10101W4" } };
    export const LOGOUT: EndpointP = { url: "/Others/Logout", interfaceId: { post: "S10100W4" } };
    export const MQTT_SERVER: EndpointG = { url: "/Others/MqttServer", interfaceId: { get: "S10100WA" } }; // TODO: API設計書が用意されていない
    export const HEADER: EndpointG = { url: "/Others/Header", interfaceId: { get: "S10100W1" } };
    export const AIRPORT_REMARKS: EndpointP = { url: "/Others/AirportRemarks", interfaceId: { post: "S10100W2" } };
    export const NOTIFICATION_SETTING: EndpointG = { url: "/Others/NotificationSetting", interfaceId: { get: "S10100W3" } };
    export const USER_NOTIFICATION: Endpoint = {
      url: "/Others/UserNotification",
      interfaceId: { get: "S10108W1", post: "S10108W2" },
    };
    export const PROFILE_PICTURE: EndpointP = { url: "/Others/ProfilePicture", interfaceId: { post: "S10100W5" } };
    export const FLIGHT_REMARKS: EndpointP = { url: "/Others/FlightRemarks", interfaceId: { post: "S10100W6" } };
    export const ADDRESS_MAIL: EndpointP = { url: "/Others/Address/Mail/Search", interfaceId: { post: "S10100W7" } };
    export const ADDRESS_TTY: EndpointP = { url: "/Others/Address/Tty/Search", interfaceId: { post: "S10100W8" } };
    export const ADDRESS_JOB: EndpointP = { url: "/Others/Address/Job/Search", interfaceId: { post: "S10100W9" } };
    export const FIS: EndpointG = { url: "/Fis", interfaceId: { get: "S10201W1" } };
    export const SPOT_REMARKS: Endpoint = { url: "/SpotRemarks", interfaceId: { get: "S10701W1", post: "S10701W2" } };
    export const AIRPORT_ISSUE: Endpoint = { url: "/AirportIssue", interfaceId: { get: "S10206W1", post: "S10206W4" } };
    export const TTY_ADDRESS_SEARCH: EndpointG = { url: "/AirportIssue/TtyAddress/Search", interfaceId: { get: "S10206W2" } };
    export const MAIL_ADDRESS_SEARCH: EndpointG = { url: "/AirportIssue/MailAddress/Search", interfaceId: { get: "S10206W3" } };
    export const AIRPORT_ISSUE_TEMPLATE: EndpointP = { url: "/AirportIssue/Template", interfaceId: { post: "S10206W5" } };
    export const WORK_STEP: Endpoint = { url: "/FlightDetail/WorkStep", interfaceId: { get: "S10301W1", post: "S10301W2" } };
    export const FLIGHT_DETAIL: EndpointG = { url: "/FlightDetail", interfaceId: { get: "S10502W1" } };
    export const FLIGHT_LIST: EndpointG = { url: "/FlightList", interfaceId: { get: "S10504W1" } };
    export const FLIGHT_HISTORY: EndpointG = { url: "/FlightDetail/History", interfaceId: { get: "S10502W2" } };
    export const FLIGHT_SPECIAL_CARE: EndpointG = { url: "/FlightDetail/SpecialCare", interfaceId: { get: "S10502W3" } };
    export const FLIGHT_PAX_FROM: EndpointG = { url: "/FlightDetail/Pax/From", interfaceId: { get: "S10505W1" } };
    export const FLIGHT_PAX_TO: EndpointG = { url: "/FlightDetail/Pax/To", interfaceId: { get: "S10505W2" } };
    export const BROADCAST_TEMPLATE: EndpointG = { url: "/broadcast/template", interfaceId: { get: "S11100W1" } };
    export const BROADCAST_TEMPLATE_UPDATE: EndpointP = { url: "/broadcast/template/update", interfaceId: { post: "S11100W2" } };
    export const BROADCAST_TEMPLATE_DELETE: EndpointP = { url: "/broadcast/template/delete/", interfaceId: { post: "S11100W3" } };
    export const BROADCAST_BB: Endpoint = { url: "/broadcast/bulletinboard", interfaceId: { get: "S11102W1", post: "S11102W2" } };
    export const BROADCAST_BB_UPDATE: EndpointP = { url: "/broadcast/bulletinboard/update", interfaceId: { post: "S11102W3" } };
    export const BROADCAST_BB_TEMPLATE: Endpoint = {
      url: "/broadcast/bulletinboard/template",
      interfaceId: { get: "S11102W4", post: "S11102W5" },
    };
    export const BROADCAST_BB_TEMPLATE_UPDATE: EndpointP = {
      url: "/broadcast/bulletinboard/template/update",
      interfaceId: { post: "S11102W6" },
    };
    export const BROADCAST_BB_FLIGHT_LEG: EndpointG = {
      url: "/broadcast/bulletinboard/flightleg",
      interfaceId: { get: "S11102W7" },
    };
    export const BROADCAST_BB_FLIGHT_START: EndpointP = {
      url: "/broadcast/bulletinboard/flight",
      interfaceId: { post: "S11102W8" },
    };
    export const BROADCAST_EMAIL: EndpointP = { url: "/broadcast/mail", interfaceId: { post: "S11103W2" } };
    export const BROADCAST_EMAIL_TEMPLATE: Endpoint = {
      url: "/broadcast/mail/template",
      interfaceId: { get: "S11103W4", post: "S11103W5" },
    };
    export const BROADCAST_EMAIL_TEMPLATE_UPDATE: EndpointP = {
      url: "/broadcast/mail/template/update",
      interfaceId: { post: "S11103W6" },
    };
    export const BROADCAST_TTY: EndpointP = { url: "/broadcast/tty", interfaceId: { post: "S11104W2" } };
    export const BROADCAST_TTY_TEMPLATE: Endpoint = {
      url: "/broadcast/tty/template",
      interfaceId: { get: "S11104W4", post: "S11104W5" },
    };
    export const BROADCAST_TTY_TEMPLATE_UPDATE: EndpointP = {
      url: "/broadcast/tty/template/update",
      interfaceId: { post: "S11104W6" },
    };
    export const BROADCAST_AFTN: EndpointP = { url: "/broadcast/aftn", interfaceId: { post: "S11107W2" } };
    export const BROADCAST_AFTN_TEMPLATE: Endpoint = {
      url: "/broadcast/aftn/template",
      interfaceId: { get: "S11107W4", post: "S11107W5" },
    };
    export const BROADCAST_AFTN_TEMPLATE_UPDATE: EndpointP = {
      url: "/broadcast/aftn/template/update",
      interfaceId: { post: "S11107W6" },
    };
    export const BROADCAST_ACARS: EndpointP = { url: "/broadcast/acars", interfaceId: { post: "S11105W2" } };
    export const BROADCAST_ACARS_TEMPLATE: Endpoint = {
      url: "/broadcast/acars/template",
      interfaceId: { get: "S11105W4", post: "S11105W5" },
    };
    export const BROADCAST_ACARS_TEMPLATE_UPDATE: EndpointP = {
      url: "/broadcast/acars/template/update",
      interfaceId: { post: "S11105W6" },
    };
    export const BROADCAST_NTF: EndpointP = { url: "/broadcast/notification", interfaceId: { post: "S11106W2" } };
    export const BROADCAST_NTF_TEMPLATE: Endpoint = {
      url: "/broadcast/notification/template",
      interfaceId: { get: "S11106W4", post: "S11106W5" },
    };
    export const BROADCAST_NTF_TEMPLATE_UPDATE: EndpointP = {
      url: "/broadcast/notification/template/update",
      interfaceId: { post: "S11106W6" },
    };
    export const BB_THREADS: EndpointG = { url: "/bulletinboard/threads", interfaceId: { get: "S11101W1" } };
    export const BB_THREAD: EndpointG = { url: "/bulletinboard/thread", interfaceId: { get: "S11101W2" } };
    export const BB_COMMENT: EndpointP = { url: "/bulletinboard/comment", interfaceId: { post: "S11101W3" } };
    export const BB_COMMENT_UPDATE: EndpointP = { url: "/bulletinboard/comment/update", interfaceId: { post: "S11101W4" } };
    export const BB_COMMENT_DELETE: EndpointP = { url: "/bulletinboard/comment/delete", interfaceId: { post: "S11101W5" } };
    export const BB_RESPONSE: EndpointP = { url: "/bulletinboard/response", interfaceId: { post: "S11101W6" } };
    export const BB_RESPONSE_UPDATE: EndpointP = { url: "/bulletinboard/response/update", interfaceId: { post: "S11101W7" } };
    export const BB_RESPONSE_DELETE: EndpointP = { url: "/bulletinboard/response/delete", interfaceId: { post: "S11101W8" } };
    export const BB_THREAD_DELETE: EndpointP = { url: "/bulletinboard/thread/delete", interfaceId: { post: "S11101W9" } };
    export const BB_THREAD_FILE: EndpointG = { url: "/bulletinboard/thread/file", interfaceId: { get: "S11101WA" } };
    export const BB_THREADS_FLIGHT: EndpointG = { url: "/bulletinboard/threads/flight", interfaceId: { get: "S11101WB" } };
    export const BB_THREAD_REACTION = { url: "/bulletinboard/thread/reaction", interfaceId: { post: "S11101WC" } };
    export const BB_RESPONSE_REACTION = { url: "/bulletinboard/response/reaction", interfaceId: { post: "S11101WD" } };
    export const BB_COMMENT_REACTION = { url: "/bulletinboard/comment/reaction", interfaceId: { post: "S11101WE" } };
    export const OAL_FLIGHT_SCHEDULE: EndpointG = { url: "/OalFlightSchedule", interfaceId: { get: "S11301W1" } };
    export const OAL_FLIGHT_SCHEDULE_UPDATE: EndpointP = { url: "/OalFlightScheduleUpdate", interfaceId: { post: "S11301W2" } };
    export const OAL_FLIGHT_MOVEMENT: EndpointG = { url: "/OalFlightMovement", interfaceId: { get: "S11400W1" } };
    export const OAL_FLIGHT_MOVEMENT_UPDATE: EndpointP = { url: "/OalFlightMovementUpdate", interfaceId: { post: "S10100WB1" } };
    export const OAL_FLIGHT_MOVEMENT_UPDATE_SPOT: EndpointP = {
      url: "/OalFlightMovementUpdate",
      interfaceId: { post: "S10100WB2" },
    };
    export const OAL_FLIGHT_MOVEMENT_UPDATE_EQP: EndpointP = {
      url: "/OalFlightMovementUpdate",
      interfaceId: { post: "S10100WB3" },
    };
    export const FLIGHT_MOVEMENT: EndpointG = { url: "/FlightMovement", interfaceId: { get: "S10601W2" } };
    export const FLIGHT_MOVEMENT_UPDATE: EndpointP = { url: "/FlightMovementUpdate", interfaceId: { post: "S10100WF1" } };
    export const FLIGHT_MOVEMENT_UPDATE_SPOT: EndpointP = { url: "/FlightMovementUpdate", interfaceId: { post: "S10100WF2" } };
    export const SPOT_NUMBER_RESTRICTION_CHECK: EndpointP = { url: "/SpotNumber/restriction/check", interfaceId: { post: "S10702W1" } };
    export const OAL_FLIGHT_IRREGULAR_UPDATE: EndpointP = { url: "/OalFlightIrrUpdate", interfaceId: { post: "S10602W2" } };
    export const OAL_PAX: Endpoint = { url: "/OalPax", interfaceId: { get: "S11302W1", post: "S11302W2" } };
    export const OAL_PAX_STATUS: Endpoint = { url: "/OalPaxStatus", interfaceId: { get: "S11304W1", post: "S11304W2" } };
    export const LEG_ARR_DEP_CTRL: EndpointG = { url: "/LegArrdepCtrl", interfaceId: { get: "S10100WE" } };
    export const OAL_FUEL: Endpoint = { url: "/OalFuel", interfaceId: { get: "S11305W1", post: "S11305W2" } };
    export const MYSCHEDULE: Endpoint = { url: "/MySchedule", interfaceId: { get: "S10401W1", post: "S10401W2" } };
    export const MYSCHEDULE_FIS: EndpointG = { url: "/MySchedule/Fis", interfaceId: { get: "S10401W3" } };
    export const ACARS_STATUS: EndpointG = { url: "/AcarsStatus", interfaceId: { get: "S10100WH" } };
    export const MVT_MSG: EndpointG = { url: "/MvtMsg", interfaceId: { get: "S10603W1" } };
    export const MVT_MSG_UPDATE: EndpointP = { url: "/MvtMsgUpdate", interfaceId: { post: "S10603W2" } };
  }

  export function getHeader(dispatch: AppDispatch, params: HeaderInfoApi.Request) {
    const { url, interfaceId } = Endpoints.HEADER;
    return sendRequest<HeaderInfoApi.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function postAirportRemarks(dispatch: AppDispatch, params: UpdateAirportRemarksApi.Request) {
    const { url, interfaceId } = Endpoints.AIRPORT_REMARKS;
    return sendRequest<UpdateAirportRemarksApi.Response>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function getUserNotification(dispatch: AppDispatch) {
    const { url, interfaceId } = Endpoints.USER_NOTIFICATION;
    return sendRequest<UserSettingApi.Response>("get", url, interfaceId.get, {}, dispatch);
  }
  export function getNotificationSetting(dispatch: AppDispatch) {
    const { url, interfaceId } = Endpoints.NOTIFICATION_SETTING;
    return sendRequest<NotificationSettingApi.Response>("get", url, interfaceId.get, {}, dispatch);
  }
  export function postUserNotification(dispatch: AppDispatch, params: UserSettingApi.Request) {
    const { url, interfaceId } = Endpoints.USER_NOTIFICATION;
    return sendRequest<UserSettingApi.Response>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postLogout() {
    const { url, interfaceId } = Endpoints.LOGOUT;
    return sendRequest<AxiosResponse>("post", url, interfaceId.post, {}, null);
  }
  export function postProfilePicture(dispatch: AppDispatch, params: ProfilePictureApi.Request) {
    const { url, interfaceId } = Endpoints.PROFILE_PICTURE;
    return sendRequest<ProfilePictureApi.Response>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postFlightRemarks(dispatch: AppDispatch, params: FlightRmksApi.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.FLIGHT_REMARKS;
    return sendRequest<FlightRmksApi.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function getJobProfile(dispatch: AppDispatch) {
    const { url, interfaceId } = Endpoints.JOB_PROFILE;
    return sendRequest<ProfileApi.Response>("get", url, interfaceId.get, {}, dispatch);
  }
  export function postJobAuth(dispatch: AppDispatch, params: JobAuthApi.Request) {
    const { url, interfaceId } = Endpoints.JOB_AUTH;
    return sendRequest<JobAuthApi.Response>("post", url, interfaceId.post, params, dispatch);
  }
  export function getMaster(dispatch: AppDispatch, params: MasterApi.Request) {
    const { url, interfaceId } = Endpoints.MASTER;
    return sendRequest<MasterApi.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function postAddressMail(dispatch: AppDispatch, params: AddressMailApi.Request) {
    const { url, interfaceId } = Endpoints.ADDRESS_MAIL;
    return sendRequest<AddressMailApi.Response>("post", url, interfaceId.post, params, dispatch);
  }
  export function postAddressTty(dispatch: AppDispatch, params: AddressTtyApi.Request) {
    const { url, interfaceId } = Endpoints.ADDRESS_TTY;
    return sendRequest<AddressTtyApi.Response>("post", url, interfaceId.post, params, dispatch);
  }
  export function postAddressJob(dispatch: AppDispatch, params: AddressJobApi.Request) {
    const { url, interfaceId } = Endpoints.ADDRESS_JOB;
    return sendRequest<AddressJobApi.Response>("post", url, interfaceId.post, params, dispatch);
  }
  export function getMqttServer(dispatch: AppDispatch) {
    const { url, interfaceId } = Endpoints.MQTT_SERVER;
    return sendRequest<MqttServerApi.Response>("get", url, interfaceId.get, {}, dispatch);
  }
  export function getFis(dispatch: AppDispatch, params: FisApi.Request) {
    const { url, interfaceId } = Endpoints.FIS;
    return sendRequest<FisApi.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function getFisTest(dispatch: AppDispatch, params = {}, count: number) {
    return sendRequest<FisApi.Response>("get", `/flightschedule/${count}`, "", params, dispatch);
  }
  export function getSpotRemarks(dispatch: AppDispatch, params: SpotRemarksApi.Get.Request) {
    const { url, interfaceId } = Endpoints.SPOT_REMARKS;
    return sendRequest<SpotRemarksApi.Get.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function postSpotRemarks(dispatch: AppDispatch, params: SpotRemarksApi.Post.Request) {
    const { url, interfaceId } = Endpoints.SPOT_REMARKS;
    return sendRequest<SpotRemarksApi.Post.Response>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function getAirportIssue(dispatch: AppDispatch, params: AirportIssue.Request) {
    const { url, interfaceId } = Endpoints.AIRPORT_ISSUE;
    return sendRequest<AirportIssue.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function postAirportIssue(dispatch: AppDispatch, params: AirportIssue.RequestPost) {
    const { url, interfaceId } = Endpoints.AIRPORT_ISSUE;
    return sendRequest<AirportIssue.ResponsePost>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postAirportIssueTemplate(dispatch: AppDispatch, params: AirportIssue.IssuTemplate) {
    const { url, interfaceId } = Endpoints.AIRPORT_ISSUE_TEMPLATE;
    return sendRequest<AirportIssue.IssuTemplateResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function getWorkStep(dispatch: AppDispatch, params: StationOperationTaskApi.Request) {
    const { url, interfaceId } = Endpoints.WORK_STEP;
    return sendRequest<StationOperationTaskApi.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function postWorkStep(dispatch: AppDispatch, params: StationOperationTaskApi.RequestPost) {
    const { url, interfaceId } = Endpoints.WORK_STEP;
    return sendRequest<StationOperationTaskApi.Response>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function getFlightDetail(dispatch: AppDispatch, params: FlightDetailApi.Request, messages?: Messages) {
    const { url, interfaceId } = Endpoints.FLIGHT_DETAIL;
    return sendRequest<FlightDetailApi.Response>("get", url, interfaceId.get, params, dispatch, false, undefined, messages);
  }
  export function getFlightList(dispatch: AppDispatch, params: FlightsApi.Request) {
    const { url, interfaceId } = Endpoints.FLIGHT_LIST;
    return sendRequest<FlightsApi.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function getFlightHistory(dispatch: AppDispatch, params: FlightChangeHistoryApi.Request) {
    const { url, interfaceId } = Endpoints.FLIGHT_HISTORY;
    return sendRequest<FlightChangeHistoryApi.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function getFlightSpecialCare(dispatch: AppDispatch, params: FlightSpecialCareApi.Request) {
    const { url, interfaceId } = Endpoints.FLIGHT_SPECIAL_CARE;
    return sendRequest<FlightSpecialCareApi.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function getFlightPaxFrom(dispatch: AppDispatch, params: FlightPaxFromApi.Request) {
    const { url, interfaceId } = Endpoints.FLIGHT_PAX_FROM;
    return sendRequest<FlightPaxFromApi.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function getFlightPaxTo(dispatch: AppDispatch, params: FlightPaxToApi.Request) {
    const { url, interfaceId } = Endpoints.FLIGHT_PAX_TO;
    return sendRequest<FlightPaxToApi.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function getBroadcastTemplates(dispatch: AppDispatch, params: Broadcast.FetchAllTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_TEMPLATE;
    return sendRequest<Broadcast.FetchAllTemplateResponse>("get", url, interfaceId.get, params, dispatch);
  }
  export function postBroadcastTemplateName(dispatch: AppDispatch, params: Broadcast.UpdateTemplateNameRequest, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.BROADCAST_TEMPLATE_UPDATE;
    return sendRequest<Broadcast.UpdateTemplateNameResponse>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBroadcastTemplateDelete(dispatch: AppDispatch, params: Broadcast.DeleteTemplateRequest, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.BROADCAST_TEMPLATE_DELETE;
    return sendRequest<Broadcast.CommonHeaderResponse>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function getBroadcastBb(dispatch: AppDispatch, params: Broadcast.Bb.FetchRequest, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.BROADCAST_BB;
    return sendRequest<Broadcast.Bb.FetchResponse>("get", url, interfaceId.get, params, dispatch, false, callbacks);
  }
  export function postBroadcastBb(dispatch: AppDispatch, params: Broadcast.Bb.SendRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_BB;
    return sendRequest<Broadcast.Bb.SendResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postBroadcastBbUpdate(dispatch: AppDispatch, params: Broadcast.Bb.UpdateRequest, callbacks: Callbacks) {
    const { url, interfaceId } = Endpoints.BROADCAST_BB_UPDATE;
    return sendRequest<Broadcast.Bb.UpdateResponse>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function getBroadcastBbTemplate(dispatch: AppDispatch, params: Broadcast.Bb.FetchTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_BB_TEMPLATE;
    return sendRequest<Broadcast.Bb.FetchTemplateResponse>("get", url, interfaceId.get, params, dispatch);
  }
  export function postBroadcastBbTemplate(dispatch: AppDispatch, params: Broadcast.Bb.StoreTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_BB_TEMPLATE;
    return sendRequest<Broadcast.Bb.StoreTemplateResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postBroadcastBbTemplateUpdate(dispatch: AppDispatch, params: Broadcast.Bb.UpdateTemplateRequest, callbacks: Callbacks) {
    const { url, interfaceId } = Endpoints.BROADCAST_BB_TEMPLATE_UPDATE;
    return sendRequest<Broadcast.Bb.UpdateTemplateResponse>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function getBroadcastFlightLeg(dispatch: AppDispatch, params: Broadcast.Bb.FetchAllFlightLegRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_BB_FLIGHT_LEG;
    return sendRequest<Broadcast.Bb.FetchAllFlightLegResponse>("get", url, interfaceId.get, params, dispatch);
  }
  export function postBroadcastFlightStart(dispatch: AppDispatch, params: BroadcastBbFlightApi.Request) {
    const { url, interfaceId } = Endpoints.BROADCAST_BB_FLIGHT_START;
    return sendRequest<BroadcastBbFlightApi.Response>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postBroadcastEmail(dispatch: AppDispatch, params: Broadcast.Email.SendRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_EMAIL;
    return sendRequest<Broadcast.Email.SendResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function getBroadcastEmailTemplate(dispatch: AppDispatch, params: Broadcast.Email.FetchTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_EMAIL_TEMPLATE;
    return sendRequest<Broadcast.Email.FetchTemplateResponse>("get", url, interfaceId.get, params, dispatch);
  }
  export function postBroadcastEmailTemplate(dispatch: AppDispatch, params: Broadcast.Email.StoreTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_EMAIL_TEMPLATE;
    return sendRequest<Broadcast.Email.StoreTemplateResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postBroadcastEmailTemplateUpdate(
    dispatch: AppDispatch,
    params: Broadcast.Email.UpdateTemplateRequest,
    callbacks: Callbacks
  ) {
    const { url, interfaceId } = Endpoints.BROADCAST_EMAIL_TEMPLATE_UPDATE;
    return sendRequest<Broadcast.Email.UpdateTemplateResponse>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBroadcastTty(
    dispatch: AppDispatch,
    params: Broadcast.Tty.SendRequest,
    isShowSuccessMessage = true,
    isShowErrorMessage = true
  ) {
    const { url, interfaceId } = Endpoints.BROADCAST_TTY;
    return sendRequest<Broadcast.Tty.SendResponse>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      true,
      undefined,
      undefined,
      isShowSuccessMessage,
      isShowErrorMessage
    );
  }
  export function getBroadcastTtyTemplate(dispatch: AppDispatch, params: Broadcast.Tty.FetchTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_TTY_TEMPLATE;
    return sendRequest<Broadcast.Tty.FetchTemplateResponse>("get", url, interfaceId.get, params, dispatch);
  }
  export function postBroadcastTtyTemplate(dispatch: AppDispatch, params: Broadcast.Tty.StoreTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_TTY_TEMPLATE;
    return sendRequest<Broadcast.Tty.StoreTemplateResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postBroadcastTtyTemplateUpdate(dispatch: AppDispatch, params: Broadcast.Tty.UpdateTemplateRequest, callbacks: Callbacks) {
    const { url, interfaceId } = Endpoints.BROADCAST_TTY_TEMPLATE_UPDATE;
    return sendRequest<Broadcast.Tty.UpdateTemplateResponse>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBroadcastAftn(dispatch: AppDispatch, params: Broadcast.Aftn.SendRequest, isShowSuccessMessage = true) {
    const { url, interfaceId } = Endpoints.BROADCAST_AFTN;
    return sendRequest<Broadcast.Aftn.SendResponse>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      true,
      undefined,
      undefined,
      isShowSuccessMessage
    );
  }
  export function getBroadcastAftnTemplate(dispatch: AppDispatch, params: Broadcast.Aftn.FetchTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_AFTN_TEMPLATE;
    return sendRequest<Broadcast.Aftn.FetchTemplateResponse>("get", url, interfaceId.get, params, dispatch);
  }
  export function postBroadcastAftnTemplate(dispatch: AppDispatch, params: Broadcast.Aftn.StoreTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_AFTN_TEMPLATE;
    return sendRequest<Broadcast.Aftn.StoreTemplateResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postBroadcastAftnTemplateUpdate(
    dispatch: AppDispatch,
    params: Broadcast.Aftn.UpdateTemplateRequest,
    callbacks: Callbacks
  ) {
    const { url, interfaceId } = Endpoints.BROADCAST_AFTN_TEMPLATE_UPDATE;
    return sendRequest<Broadcast.Aftn.UpdateTemplateResponse>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBroadcastAcars(dispatch: AppDispatch, params: Broadcast.Acars.SendRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_ACARS;
    return sendRequest<Broadcast.Acars.SendResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function getBroadcastAcarsTemplate(dispatch: AppDispatch, params: Broadcast.Acars.FetchTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_ACARS_TEMPLATE;
    return sendRequest<Broadcast.Acars.FetchTemplateResponse>("get", url, interfaceId.get, params, dispatch);
  }
  export function postBroadcastAcarsTemplate(dispatch: AppDispatch, params: Broadcast.Acars.StoreTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_ACARS_TEMPLATE;
    return sendRequest<Broadcast.Acars.StoreTemplateResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postBroadcastAcarsTemplateUpdate(
    dispatch: AppDispatch,
    params: Broadcast.Acars.UpdateTemplateRequest,
    callbacks: Callbacks
  ) {
    const { url, interfaceId } = Endpoints.BROADCAST_ACARS_TEMPLATE_UPDATE;
    return sendRequest<Broadcast.Acars.UpdateTemplateResponse>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBroadcastNtf(dispatch: AppDispatch, params: Broadcast.Ntf.SendRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_NTF;
    return sendRequest<Broadcast.Ntf.SendResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function getBroadcastNtfTemplate(dispatch: AppDispatch, params: Broadcast.Ntf.FetchTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_NTF_TEMPLATE;
    return sendRequest<Broadcast.Ntf.FetchTemplateResponse>("get", url, interfaceId.get, params, dispatch);
  }
  export function postBroadcastNtfTemplate(dispatch: AppDispatch, params: Broadcast.Ntf.StoreTemplateRequest) {
    const { url, interfaceId } = Endpoints.BROADCAST_NTF_TEMPLATE;
    return sendRequest<Broadcast.Ntf.StoreTemplateResponse>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function postBroadcastNtfTemplateUpdate(dispatch: AppDispatch, params: Broadcast.Ntf.UpdateTemplateRequest, callbacks: Callbacks) {
    const { url, interfaceId } = Endpoints.BROADCAST_NTF_TEMPLATE_UPDATE;
    return sendRequest<Broadcast.Ntf.UpdateTemplateResponse>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function getBulletinBoardTheads(dispatch: AppDispatch, params: BulletinBoardThreadsApi.Request) {
    const { url, interfaceId } = Endpoints.BB_THREADS;
    return sendRequest<BulletinBoardThreadsApi.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function getBulletinBoardThead(dispatch: AppDispatch, params: BulletinBoardThreadApi.Request, callbacks: Callbacks) {
    const { url, interfaceId } = Endpoints.BB_THREAD;
    return sendRequest<BulletinBoardThreadApi.Response>("get", url, interfaceId.get, params, dispatch, false, callbacks);
  }
  export function postBulletinBoardComment(dispatch: AppDispatch, params: BulletinBoardAddComment.Request, callbacks: Callbacks) {
    const { url, interfaceId } = Endpoints.BB_COMMENT;
    return sendRequest<BulletinBoardAddComment.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBulletinBoardCommentUpdate(dispatch: AppDispatch, params: BulletinBoardUpdateComment.Request, callbacks: Callbacks) {
    const { url, interfaceId } = Endpoints.BB_COMMENT_UPDATE;
    return sendRequest<BulletinBoardUpdateComment.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBulletinBoardCommentDelete(dispatch: AppDispatch, params: BulletinBoardDeleteComment.Request, callbacks: Callbacks) {
    const { url, interfaceId } = Endpoints.BB_COMMENT_DELETE;
    return sendRequest<BulletinBoardDeleteComment.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBulletinBoardResponse(dispatch: AppDispatch, params: BulletinBoardAddResponse.Request, callbacks: Callbacks) {
    const { url, interfaceId } = Endpoints.BB_RESPONSE;
    return sendRequest<BulletinBoardAddResponse.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBulletinBoardResponseUpdate(
    dispatch: AppDispatch,
    params: BulletinBoardUpdateResponse.Request,
    callbacks: Callbacks
  ) {
    const { url, interfaceId } = Endpoints.BB_RESPONSE_UPDATE;
    return sendRequest<BulletinBoardUpdateResponse.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBulletinBoardResponseDelete(
    dispatch: AppDispatch,
    params: BulletinBoardDeleteResponse.Request,
    callbacks: Callbacks
  ) {
    const { url, interfaceId } = Endpoints.BB_RESPONSE_DELETE;
    return sendRequest<BulletinBoardDeleteResponse.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function postBulletinBoardThreadDelete(dispatch: AppDispatch, params: BulletinBoardDeleteThread.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.BB_THREAD_DELETE;
    return sendRequest<BulletinBoardDeleteThread.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function getBulletinBoardTheadFile(dispatch: AppDispatch, params: BulletinBoardDownloadFileApi.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.BB_THREAD_FILE;
    return sendRequest<BulletinBoardDownloadFileApi.Response>("get", url, interfaceId.get, params, dispatch, false, callbacks);
  }
  export function getBulletinBoardTheadsFlight(dispatch: AppDispatch, params: BulletinBoardThreadFlightApi.Request, messages?: Messages) {
    const { url, interfaceId } = Endpoints.BB_THREADS_FLIGHT;
    return sendRequest<BulletinBoardThreadFlightApi.Response>("get", url, interfaceId.get, params, dispatch, false, undefined, messages);
  }
  export function postBulletinBoardThreadReaction(dispatch: AppDispatch, params: BulletinBoardThreadReactionApi.Request) {
    const { url, interfaceId } = Endpoints.BB_THREAD_REACTION;
    return sendRequest<BulletinBoardThreadReactionApi.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      false,
      undefined,
      undefined,
      true,
      false // エラー表示は抑制する仕様
    );
  }
  export function postBulletinBoardResponseReaction(dispatch: AppDispatch, params: BulletinBoardResponseReactionApi.Request) {
    const { url, interfaceId } = Endpoints.BB_RESPONSE_REACTION;
    return sendRequest<BulletinBoardResponseReactionApi.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      false,
      undefined,
      undefined,
      true,
      false // エラー表示は抑制する仕様
    );
  }
  export function postBulletinBoardCommentReaction(dispatch: AppDispatch, params: BulletinBoardCommentReactionApi.Request) {
    const { url, interfaceId } = Endpoints.BB_COMMENT_REACTION;
    return sendRequest<BulletinBoardCommentReactionApi.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      false,
      undefined,
      undefined,
      true,
      false // エラー表示は抑制する仕様
    );
  }
  export function getOalFlightSchedule(dispatch: AppDispatch, params: OalFlightScheduleApi.Get.Request) {
    const { url, interfaceId } = Endpoints.OAL_FLIGHT_SCHEDULE;
    return sendRequest<OalFlightScheduleApi.Get.Response>("get", url, interfaceId.get, params, dispatch, false);
  }
  export function postOalFlightSchedule(dispatch: AppDispatch, params: OalFlightScheduleApi.Post.Request) {
    const { url, interfaceId } = Endpoints.OAL_FLIGHT_SCHEDULE_UPDATE;
    return sendRequest<OalFlightScheduleApi.Post.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      true,
      undefined,
      undefined,
      false
    );
  }
  export function getFlightMovement(dispatch: AppDispatch, params: FlightMovementApi.Get.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.FLIGHT_MOVEMENT;
    return sendRequest<FlightMovementApi.Get.Response>("get", url, interfaceId.get, params, dispatch, false, callbacks);
  }
  export function postFlightMovement(
    dispatch: AppDispatch,
    params: FlightMovementApi.Post.Request,
    callbacks?: Callbacks,
    isShowSuccessMessage = true
  ) {
    const { url, interfaceId } = Endpoints.FLIGHT_MOVEMENT_UPDATE;
    return sendRequest<FlightMovementApi.Post.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      true,
      callbacks,
      undefined,
      isShowSuccessMessage
    );
  }
  export function getOalFlightMovement(dispatch: AppDispatch, params: OalFlightMovementApi.Get.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.OAL_FLIGHT_MOVEMENT;
    return sendRequest<OalFlightMovementApi.Get.Response>("get", url, interfaceId.get, params, dispatch, false, callbacks);
  }
  export function postOalFlightMovement(
    dispatch: AppDispatch,
    params: OalFlightMovementApi.Post.Request,
    callbacks?: Callbacks,
    isShowSuccessMessage = true
  ) {
    const { url, interfaceId } = Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE;
    return sendRequest<OalFlightMovementApi.Post.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      true,
      callbacks,
      undefined,
      isShowSuccessMessage
    );
  }
  export function postFlightMovementSpot(
    dispatch: AppDispatch,
    params: FlightMovementApi.Post.RequestSpotNo,
    callbacks?: Callbacks,
    isShowSuccessMessage = true
  ) {
    const { url, interfaceId } = Endpoints.FLIGHT_MOVEMENT_UPDATE_SPOT;
    return sendRequest<FlightMovementApi.Post.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      true,
      callbacks,
      undefined,
      isShowSuccessMessage
    );
  }
  export function postOalFlightMovementSpot(
    dispatch: AppDispatch,
    params: OalFlightMovementApi.Post.RequestSpotNo,
    callbacks?: Callbacks,
    isShowSuccessMessage = true
  ) {
    const { url, interfaceId } = Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE_SPOT;
    return sendRequest<OalFlightMovementApi.Post.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      true,
      callbacks,
      undefined,
      isShowSuccessMessage
    );
  }
  export function postSpotNumberRestrictionCheck(dispatch: AppDispatch, params: SpotNumberRestrictionCheckApi.Request) {
    const { url, interfaceId } = Endpoints.SPOT_NUMBER_RESTRICTION_CHECK;
    return sendRequest<SpotNumberRestrictionCheckApi.Response>("post", url, interfaceId.post, params, dispatch, true, {}, undefined, false);
  }
  export function postOalFlightMovementEqp(
    dispatch: AppDispatch,
    params: OalFlightMovementApi.Post.RequestOalAircraft,
    callbacks?: Callbacks,
    isShowSuccessMessage = true
  ) {
    const { url, interfaceId } = Endpoints.OAL_FLIGHT_MOVEMENT_UPDATE_EQP;
    return sendRequest<OalFlightMovementApi.Post.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      true,
      callbacks,
      undefined,
      isShowSuccessMessage
    );
  }
  export function postOalFlightIrregularUpdate(
    dispatch: AppDispatch,
    params: OalFlightIrregularUpdateApi.Post.Request,
    callbacks?: Callbacks,
    isShowSuccessMessage = true
  ) {
    const { url, interfaceId } = Endpoints.OAL_FLIGHT_IRREGULAR_UPDATE;
    return sendRequest<OalFlightIrregularUpdateApi.Post.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      true,
      callbacks,
      undefined,
      isShowSuccessMessage
    );
  }
  export function getOalPax(dispatch: AppDispatch, params: OalPaxApi.Get.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.OAL_PAX;
    return sendRequest<OalPaxApi.Get.Response>("get", url, interfaceId.get, params, dispatch, false, callbacks);
  }
  export function postOalPax(dispatch: AppDispatch, params: OalPaxApi.Post.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.OAL_PAX;
    return sendRequest<OalPaxApi.Post.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function getOalPaxStatus(dispatch: AppDispatch, params: OalPaxStatusApi.Get.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.OAL_PAX_STATUS;
    return sendRequest<OalPaxStatusApi.Get.Response>("get", url, interfaceId.get, params, dispatch, false, callbacks);
  }
  export function postOalPaxStatus(dispatch: AppDispatch, params: OalPaxStatusApi.Post.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.OAL_PAX_STATUS;
    return sendRequest<OalPaxStatusApi.Post.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function getLegArrDepCtrl(dispatch: AppDispatch, params: LegArrDepCtrlApi.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.LEG_ARR_DEP_CTRL;
    return sendRequest<LegArrDepCtrlApi.Response>("get", url, interfaceId.get, params, dispatch, false, callbacks);
  }
  export function getOalFuel(dispatch: AppDispatch, params: OalFuelApi.Get.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.OAL_FUEL;
    return sendRequest<OalFuelApi.Get.Response>("get", url, interfaceId.get, params, dispatch, false, callbacks);
  }
  export function postOalFuel(dispatch: AppDispatch, params: OalFuelApi.Post.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.OAL_FUEL;
    return sendRequest<OalFuelApi.Post.Response>("post", url, interfaceId.post, params, dispatch, true, callbacks);
  }
  export function getMySchedule(dispatch: AppDispatch, params: MyScheduleApi.Get.Request) {
    const { url, interfaceId } = Endpoints.MYSCHEDULE;
    return sendRequest<MyScheduleApi.Get.Response>("get", url, interfaceId.get, params, dispatch, false);
  }
  export function getMyScheduleFis(dispatch: AppDispatch, params: MyScheduleFisApi.Request) {
    const { url, interfaceId } = Endpoints.MYSCHEDULE_FIS;
    return sendRequest<MyScheduleFisApi.Response>("get", url, interfaceId.get, params, dispatch, false);
  }
  export function postMySchedule(dispatch: AppDispatch, params: MyScheduleApi.Post.Request) {
    const { url, interfaceId } = Endpoints.MYSCHEDULE;
    return sendRequest<MyScheduleApi.Post.Response>("post", url, interfaceId.post, params, dispatch, true);
  }
  export function getAcarsStatus(dispatch: AppDispatch, params: AcarsStatus.Request) {
    const { url, interfaceId } = Endpoints.ACARS_STATUS;
    return sendRequest<AcarsStatus.Response>("get", url, interfaceId.get, params, dispatch);
  }
  export function get<P, R>(dispatch: AppDispatch, params: P, url: string) {
    return sendRequest<R>("get", url, undefined, params, dispatch);
  }
  export function post<P, R>(dispatch: AppDispatch, params: P, url: string) {
    return sendRequest<R>("post", url, undefined, params, dispatch);
  }
  export function getMvtMsg(dispatch: AppDispatch, params: MvtMsgApi.Get.Request, callbacks?: Callbacks) {
    const { url, interfaceId } = Endpoints.MVT_MSG;
    return sendRequest<MvtMsgApi.Get.Response>("get", url, interfaceId.get, params, dispatch, false, callbacks);
  }
  export function postMvtMsg(dispatch: AppDispatch, params: MvtMsgApi.Post.Request, callbacks?: Callbacks, isShowSuccessMessage = true) {
    const { url, interfaceId } = Endpoints.MVT_MSG_UPDATE;
    return sendRequest<MvtMsgApi.Post.Response>(
      "post",
      url,
      interfaceId.post,
      params,
      dispatch,
      true,
      callbacks,
      undefined,
      isShowSuccessMessage
    );
  }
  /**
   * WebApi共通のリクエスト
   */
  export function sendRequest<T>(
    method: "post" | "get",
    url: string,
    interfaceId = "",
    params: unknown,
    dispatch: AppDispatch | null,
    isUpdate = false,
    callbacks?: Callbacks,
    messages?: Messages,
    isShowSuccessMessage = true,
    isShowErrorMessage = true
  ) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return new Promise<AxiosResponse<T>>((resolve, reject) => {
      const id = new Date().getTime().toString();
      if (dispatch) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        dispatch(showMask());
        if (isUpdate) {
          NotificationCreator.create({ dispatch, id, message: SoalaMessage.M30001C() });
        }
      }

      const headers: Record<string, string> = {};
      let requestData;
      let requestParams;

      const { token } = storage;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const jobAuthResponse: JobAuthApi.Response = JSON.parse(storage.jobAuthResponse || "{}");
      const connectServer =
        Object.keys(jobAuthResponse).length === 0 || (jobAuthResponse.user && jobAuthResponse.user.commonSiteFlg === false)
          ? ServerConfig.API_SERVER_PRIORITY
          : ServerConfig.API_SERVER_COMMON;
      if (url === Endpoints.JOB_PROFILE.url || url === Endpoints.JOB_AUTH.url) {
        const sessionId = getCookie("X-Session-Id");
        if (sessionId) {
          headers["X-Session-Id"] = sessionId;
        } else if (dispatch) {
          // cookieからSessionIDが取得できなかった場合、APIでエラーになるのでリクエストしない
          if (process.env.NODE_ENV !== "development") {
            // 開発環境を除く
            dispatch(hideMask());
            NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50021C() });
            // eslint-disable-next-line no-promise-executor-return
            return reject();
          }
        }
      } else if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      if (method === "post") {
        requestData = params;
      } else {
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
        validateStatus(status: number) {
          // 503のみリトライ対象とする
          return status !== 503;
        },
      };

      // eslint-disable-next-line no-promise-executor-return
      const sleepByPromise = (milSec: number) => new Promise((resolve1) => setTimeout(resolve1, milSec));

      const sleepRequest = async (milSec: number): Promise<AxiosResponse> => {
        await sleepByPromise(milSec);
        return axios.request(config);
      };

      const execLogout = () => {
        if (dispatch) void dispatch(logout());
      };
      // eslint-disable-next-line no-promise-executor-return
      return (
        axios
          .request(config)
          // リトライ処理
          .catch(() => sleepRequest(500))
          .catch(() => sleepRequest(1000))
          .catch(() => sleepRequest(1500))

          // エラーハンドリング
          .catch((err: AxiosError) => {
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
            if (!dispatch) {
              return resolve(response);
            }

            if (isUpdate) {
              if (!isShowSuccessMessage) {
                NotificationCreator.remove({ dispatch, id });
              } else if (interfaceId === Endpoints.OAL_FLIGHT_IRREGULAR_UPDATE.interfaceId.post && callbacks && callbacks.onSuccess) {
                NotificationCreator.create({
                  dispatch,
                  id,
                  message: SoalaMessage.M30011C({
                    onYesButton: callbacks.onSuccess,
                  }),
                });
              } else if (interfaceId === Endpoints.MVT_MSG_UPDATE.interfaceId.post) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                if (response.data?.conditions?.includes("tty_not_sent")) {
                  NotificationCreator.create({
                    dispatch,
                    id,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    message: SoalaMessage.M30014C({ onOkButton: callbacks?.onSuccess, condition: "TTY not sent" }),
                  });
                } else {
                  if (callbacks?.onSuccess) {
                    callbacks.onSuccess();
                  }
                  NotificationCreator.create({ dispatch, id, message: SoalaMessage.M30002C() });
                }
              } else {
                NotificationCreator.create({ dispatch, id, message: SoalaMessage.M30002C() });
              }
            }
            if (
              interfaceId === Endpoints.FLIGHT_LIST.interfaceId.get &&
              response.data &&
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              response.data.eLegList &&
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              response.data.eLegList.length === 0
            ) {
              NotificationCreator.create({ dispatch, message: SoalaMessage.M30003C() });
            }
            dispatch(hideMask());
            return resolve(response);
          })
          .catch((err: AxiosError) => {
            if (!dispatch) {
              return reject(err);
            }
            dispatch(hideMask());

            // #15985でAFTN送信時に同じ内容をTTYでも送信するという要件が入ったが、TTY送信は補助的要素で必達ではないため、
            // isShowErrorMessageで切り分けを行って通常のエラー表示は抑制し、呼び出し元に警告メッセージの表示を委譲する。
            if (!isShowErrorMessage) {
              NotificationCreator.remove({ dispatch, id });
              return reject(err);
            }

            const statusCode = err.response ? err.response.status : null;

            // ネットワークエラー
            if (statusCode === null || statusCode === 0) {
              NotificationCreator.createWithOneMessage({
                dispatch,
                currentId: id,
                newId: notificationIds.errNetwork,
                message: SoalaMessage.M50013C({
                  onYesButton: () => {
                    if (callbacks && callbacks.onNetworkError) callbacks.onNetworkError();
                  },
                  onNoButton: execLogout,
                }),
              });
              return reject(err);
            }

            const data: { type: string } = err.response && err.response.data ? (err.response.data as { type: string }) : { type: "" };
            const errorType = data.type && data.type.toLowerCase();

            // APIのエラー
            switch (statusCode) {
              case 400: // パラメータエラー
                NotificationCreator.create({
                  dispatch,
                  id,
                  message: SoalaMessage.M50001C({
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
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M50002C({ statusCode, onOkButton: execLogout }),
                      });
                    } else {
                      // ID PASSWORD不正
                      NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50004C({ statusCode }) });
                    }
                    return reject(err);
                  default:
                    NotificationCreator.createWithOneMessage({
                      dispatch,
                      currentId: id,
                      newId: notificationIds.err401,
                      message: SoalaMessage.M50003C({ statusCode, onOkButton: execLogout }),
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
                    NotificationCreator.create({ dispatch, id, message: SoalaMessage.M40015C({}) });
                    return reject(err);
                  case Endpoints.BROADCAST_BB.interfaceId.get:
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M40015C({ onOkButton: () => dispatch(forceGoTo({ path: Const.PATH_NAME.bulletinBoard })) }),
                    });
                    return reject(err);
                  case Endpoints.BROADCAST_BB_TEMPLATE.interfaceId.post:
                  case Endpoints.BROADCAST_EMAIL_TEMPLATE.interfaceId.post:
                  case Endpoints.BROADCAST_TTY_TEMPLATE.interfaceId.post:
                  case Endpoints.BROADCAST_AFTN_TEMPLATE.interfaceId.post:
                  case Endpoints.BROADCAST_NTF_TEMPLATE.interfaceId.post:
                  case Endpoints.BROADCAST_ACARS_TEMPLATE.interfaceId.post:
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M40016C({ onOkButton: () => {} }),
                    });
                    return reject(err);
                  case Endpoints.BB_THREAD.interfaceId.get:
                  case Endpoints.BB_COMMENT.interfaceId.post:
                  case Endpoints.BB_COMMENT_UPDATE.interfaceId.post:
                  case Endpoints.BB_COMMENT_DELETE.interfaceId.post:
                  case Endpoints.BB_RESPONSE.interfaceId.post:
                  case Endpoints.BB_THREAD_FILE.interfaceId.get:
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M40015C({ onOkButton: callbacks && callbacks.onForbidden }),
                    });
                    return reject(err);
                  default:
                    NotificationCreator.createWithOneMessage({
                      dispatch,
                      currentId: id,
                      newId: notificationIds.err403,
                      message: SoalaMessage.M50006C({ statusCode, onOkButton: execLogout }),
                    });
                    return reject(err);
                }
              case 404: // 該当レコードなし
                switch (interfaceId) {
                  case Endpoints.JOB_AUTH.interfaceId.post:
                  case Endpoints.JOB_PROFILE.interfaceId.get:
                    // 該当レコードなし（失敗）ログアウト
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M50007C({ statusCode, onOkButton: execLogout }),
                    });
                    return reject(err);
                  case Endpoints.HEADER.interfaceId.get:
                    NotificationCreator.create({ dispatch, id, message: SoalaMessage.M30007C() });
                    return reject(err);
                  case Endpoints.BROADCAST_BB.interfaceId.get:
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M40013C({
                        item: "thread",
                        onOkButton: () => dispatch(forceGoTo({ path: Const.PATH_NAME.bulletinBoard })),
                      }),
                    });
                    return reject(err);
                  case Endpoints.FLIGHT_DETAIL.interfaceId.get:
                  case Endpoints.BB_THREADS_FLIGHT.interfaceId.get:
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message:
                        (messages && messages[statusCode]) ||
                        SoalaMessage.M50007C({
                          statusCode,
                          onOkButton: () => {
                            dispatch(forceGoTo({ path: Const.PATH_NAME.myPage }));
                            void dispatch(closeAllDraggableModals());
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
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M50007C({
                        statusCode,
                        onOkButton: () => {
                          dispatch(forceGoTo({ path: Const.PATH_NAME.myPage }));
                          void dispatch(closeAllDraggableModals());
                        },
                      }),
                    });
                    return reject(err);
                  case Endpoints.MVT_MSG.interfaceId.get:
                    if (errorType === "pastdb") {
                      // 該当データなし（過去DB参照）
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M40023C({}),
                      });
                      return reject(err);
                    }
                    // 該当レコードなし（失敗）Mypageへ遷移
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M50007C({
                        statusCode,
                        onOkButton: () => {
                          dispatch(forceGoTo({ path: Const.PATH_NAME.myPage }));
                          void dispatch(closeAllDraggableModals());
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
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M50007C({
                        statusCode,
                        onOkButton: () => {
                          dispatch(forceGoTo({ path: Const.PATH_NAME.myPage }));
                          void dispatch(closeAllDraggableModals());
                          if (callbacks && callbacks.onNotFoundRecord) {
                            callbacks.onNotFoundRecord();
                          }
                        },
                      }),
                    });
                    return reject(err);
                  case Endpoints.ACARS_STATUS.interfaceId.get:
                    if (!(params as AcarsStatus.Request).shipNo) {
                      // 全件取得時に該当レコードなし（失敗）Mypageへ遷移
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M50007C({
                          statusCode,
                          onOkButton: () => {
                            dispatch(forceGoTo({ path: Const.PATH_NAME.myPage }));
                            void dispatch(closeAllDraggableModals());
                            if (callbacks && callbacks.onNotFoundRecord) {
                              callbacks.onNotFoundRecord();
                            }
                          },
                        }),
                      });
                    }
                    return reject(err);
                  case Endpoints.BB_THREAD_DELETE.interfaceId.post:
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                    });
                    return reject(err);
                  case Endpoints.FLIGHT_LIST.interfaceId.get:
                  case Endpoints.BROADCAST_BB_FLIGHT_LEG.interfaceId.get:
                  case Endpoints.OAL_FLIGHT_SCHEDULE.interfaceId.get:
                    // 該当レコードなし（0件）
                    NotificationCreator.create({ dispatch, id, message: SoalaMessage.M30003C() });
                    dispatch(hideMask());
                    return resolve(err.response as AxiosResponse<T, unknown>);
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
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M40013C({ item: "template", onOkButton: callbacks && callbacks.onNotFoundTemplate }),
                    });
                    return reject(err);
                  case Endpoints.BROADCAST_BB_UPDATE.interfaceId.post:
                  case Endpoints.BB_THREAD.interfaceId.get:
                    // 該当レコードなし
                    NotificationCreator.create({
                      dispatch,
                      message: SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                    });
                    return reject(err);
                  case Endpoints.BB_COMMENT.interfaceId.post:
                  case Endpoints.BB_RESPONSE.interfaceId.post:
                    if (errorType === "thread") {
                      // スレッドが存在しない場合
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                      });
                    } else {
                      NotificationCreator.remove({ dispatch, id });
                    }
                    return reject(err);
                  case Endpoints.BB_COMMENT_UPDATE.interfaceId.post:
                    if (errorType === "thread") {
                      // スレッドが存在しない場合
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                      });
                    } else {
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M40013C({ item: "comment", onOkButton: callbacks && callbacks.onNotFoundComment }),
                      });
                    }
                    return reject(err);
                  case Endpoints.BB_RESPONSE_UPDATE.interfaceId.post:
                    if (errorType === "thread") {
                      // スレッドが存在しない場合
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                      });
                    } else {
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M40013C({ item: "res.", onOkButton: callbacks && callbacks.onNotFoundRes }),
                      });
                    }
                    return reject(err);
                  case Endpoints.BB_COMMENT_DELETE.interfaceId.post:
                    if (errorType === "thread") {
                      // スレッドが存在しない場合
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                      });
                    } else {
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M40013C({ item: "comment", onOkButton: callbacks && callbacks.onNotFoundComment }),
                      });
                    }
                    return reject(err);
                  case Endpoints.BB_RESPONSE_DELETE.interfaceId.post:
                    if (errorType === "thread") {
                      // スレッドが存在しない場合
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M40013C({ item: "thread", onOkButton: callbacks && callbacks.onNotFoundThread }),
                      });
                    } else {
                      NotificationCreator.create({
                        dispatch,
                        id,
                        message: SoalaMessage.M40013C({ item: "res.", onOkButton: callbacks && callbacks.onNotFoundRes }),
                      });
                    }
                    return reject(err);
                  case Endpoints.BB_THREAD_FILE.interfaceId.get:
                    NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50024C() });
                    return reject(err);
                  case Endpoints.BROADCAST_TEMPLATE_DELETE.interfaceId.post:
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M40013C({ item: "template", onOkButton: callbacks && callbacks.onNotFoundTemplate }),
                    });
                    return reject(err);
                  case Endpoints.LEG_ARR_DEP_CTRL.interfaceId.get:
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M40020C({ onOkButton: callbacks && callbacks.onNotFoundRecord }),
                    });
                    return reject(err);
                  default:
                    // メッセージ削除
                    NotificationCreator.remove({ dispatch, id });
                    return reject(err);
                }
              case 405: // 権限なしエラー
                if (errorType === "apocd") {
                  // 所属空港のチェックの場合、ログアウトしない
                  NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50025C({}) });
                } else if (interfaceId === Endpoints.BROADCAST_BB.interfaceId.get) {
                  NotificationCreator.create({
                    dispatch,
                    id,
                    message: SoalaMessage.M40015C({ onOkButton: callbacks && callbacks.onNotAllowed }),
                  });
                } else {
                  NotificationCreator.createWithOneMessage({
                    dispatch,
                    currentId: id,
                    newId: notificationIds.err405,
                    message: SoalaMessage.M50008C({ statusCode, onOkButton: execLogout }),
                  });
                }
                return reject(err);
              case 409: // コンフリクト
                switch (interfaceId) {
                  case Endpoints.OAL_PAX.interfaceId.post:
                  case Endpoints.OAL_PAX_STATUS.interfaceId.post:
                  case Endpoints.OAL_FUEL.interfaceId.post:
                  case Endpoints.MVT_MSG_UPDATE.interfaceId.post:
                    NotificationCreator.create({ dispatch, id, message: SoalaMessage.M50031C({}) });
                    return reject(err);
                  case Endpoints.OAL_PAX.interfaceId.get:
                  case Endpoints.OAL_PAX_STATUS.interfaceId.get:
                  case Endpoints.LEG_ARR_DEP_CTRL.interfaceId.get:
                  case Endpoints.OAL_FUEL.interfaceId.get:
                  case Endpoints.FLIGHT_MOVEMENT.interfaceId.get:
                  case Endpoints.OAL_FLIGHT_MOVEMENT.interfaceId.get:
                  case Endpoints.MVT_MSG.interfaceId.get:
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M40020C({ onOkButton: callbacks && callbacks.onNotFoundRecord }),
                    });
                    return reject(err);
                  default:
                    // メッセージ削除
                    NotificationCreator.remove({ dispatch, id });
                    return reject(err);
                }
              case 422: // バリデーション
                // メッセージ削除
                NotificationCreator.remove({ dispatch, id });
                return reject(err);
              case 500: // その他のエラー
                switch (interfaceId) {
                  case Endpoints.ADDRESS_JOB.interfaceId.post:
                  case Endpoints.ADDRESS_MAIL.interfaceId.post:
                  case Endpoints.ADDRESS_TTY.interfaceId.post:
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M50010C({
                        statusCode,
                        onYesButton: () => {
                          void dispatch(closeDetailModal());
                        },
                        onNoButton: execLogout,
                      }),
                    });
                    return reject(err);
                  default:
                    NotificationCreator.createWithOneMessage({
                      dispatch,
                      currentId: id,
                      newId: notificationIds.err500,
                      message: SoalaMessage.M50010C({
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
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M50011C({
                        statusCode,
                        onYesButton: () => {
                          void dispatch(closeDetailModal());
                        },
                        onNoButton: execLogout,
                      }),
                    });
                    return reject(err);
                  default:
                    NotificationCreator.createWithOneMessage({
                      dispatch,
                      currentId: id,
                      newId: notificationIds.err512,
                      message: SoalaMessage.M50011C({
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
                    NotificationCreator.create({
                      dispatch,
                      id,
                      message: SoalaMessage.M50012C({
                        statusCode,
                        onYesButton: () => {
                          void dispatch(closeDetailModal());
                        },
                        onNoButton: execLogout,
                      }),
                    });
                    return reject(err);
                  default:
                    NotificationCreator.createWithOneMessage({
                      dispatch,
                      currentId: id,
                      newId: notificationIds.err513,
                      message: SoalaMessage.M50012C({
                        statusCode,
                        onYesButton: callbacks && callbacks.onSystemError,
                        onNoButton: execLogout,
                      }),
                    });
                    return reject(err);
                }
              case 591: // RIVOR関連でエラー
                if (interfaceId === Endpoints.WORK_STEP.interfaceId.post) {
                  NotificationCreator.create({
                    dispatch,
                    id,
                    message: SoalaMessage.M40021C({ onOkButton: () => {} }),
                  });
                  return reject(err);
                }
              // eslint-disable-next-line no-fallthrough
              default: // その他の予期せぬステータス、403 アカウントロック(起こり得ないのでその他扱いとする)
                NotificationCreator.createWithOneMessage({
                  dispatch,
                  currentId: id,
                  newId: notificationIds.errOther,
                  message: SoalaMessage.M50010C({ statusCode, onNoButton: execLogout }),
                });
                return reject(err);
            }
          })
      );
    });
  }
}
