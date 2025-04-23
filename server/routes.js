const fs = require("fs");
const fsPromises = require("fs/promises");

const APP_VERSION = { url: "/Others/appversion" };

const JOB_AUTH = { url: "/Others/Job/Auth", interfaceId: { post: "S10101W3" } };
const JOB_PROFILE = { url: "/Others/Job/Profile", interfaceId: { get: "S10101W2" } };
const MASTER = { url: "/Others/Master", interfaceId: { get: "S10101W4" } };
const LOGOUT = { url: "/Others/Logout", interfaceId: { post: "S10100W4" } };
const MQTT_SERVER = { url: "/Others/MqttServer", interfaceId: { get: "S10100WA" } };
const HEADER = { url: "/Others/Header", interfaceId: { get: "S10100W1" } };
const AIRPORT_REMARKS = { url: "/Others/AirportRemarks", interfaceId: { post: "S10100W2" } };
const NOTIFICATION_SETTING = { url: "/Others/NotificationSetting", interfaceId: { get: "S10100W3" } };
const USER_NOTIFICATION = { url: "/Others/UserNotification", interfaceId: { get: "S10108W1", post: "S10108W2" } };
const PROFILE_PICTURE = { url: "/Others/ProfilePicture", interfaceId: { post: "S10100W5" } };
const FLIGHT_REMARKS = { url: "/Others/FlightRemarks", interfaceId: { post: "S10100W6" } };
const ADDRESS_MAIL = { url: "/Others/Address/Mail/Search", interfaceId: { post: "S10100W7" } };
const ADDRESS_TTY = { url: "/Others/Address/Tty/Search", interfaceId: { post: "S10100W8" } };
const ADDRESS_JOB = { url: "/Others/Address/Job/Search", interfaceId: { post: "S10100W9" } };
const FIS = { url: "/Fis", interfaceId: { get: "S10201W1" } };
const SPOT_REMARKS = { url: "/SpotRemarks", interfaceId: { get: "S10701W1", post: "S10701W2" } };
const AIRPORT_ISSUE = { url: "/AirportIssue", interfaceId: { get: "S10206W1", post: "S10206W4" } };
const TTY_ADDRESS_SEARCH = { url: "/AirportIssue/TtyAddress/Search", interfaceId: { get: "S10206W2" } };
const MAIL_ADDRESS_SEARCH = { url: "/AirportIssue/MailAddress/Search", interfaceId: { get: "S10206W3" } };
const AIRPORT_ISSUE_TEMPLATE = { url: "/AirportIssue/Template", interfaceId: { post: "S10206W5" } };
const WORK_STEP = { url: "/FlightDetail/WorkStep", interfaceId: { get: "S10301W1", post: "S10301W2" } };
const FLIGHT_DETAIL = { url: "/FlightDetail", interfaceId: { get: "S10502W1" } };
const FLIGHT_LIST = { url: "/FlightList", interfaceId: { get: "S10504W1" } };
const FLIGHT_HISTORY = { url: "/FlightDetail/History", interfaceId: { get: "S10502W2" } };
const FLIGHT_SPECIAL_CARE = { url: "/FlightDetail/SpecialCare", interfaceId: { get: "S10502W3" } };
const FLIGHT_PAX_FROM = { url: "/FlightDetail/Pax/From", interfaceId: { get: "S10505W1" } };
const FLIGHT_PAX_TO = { url: "/FlightDetail/Pax/To", interfaceId: { get: "S10505W2" } };
const BROADCAST_TEMPLATE = { url: "/broadcast/template", interfaceId: { get: "S11100W1" } };
const BROADCAST_TEMPLATE_UPDATE = { url: "/broadcast/template/update", interfaceId: { post: "S11100W2" } };
const BROADCAST_TEMPLATE_DELETE = { url: "/broadcast/template/delete/", interfaceId: { post: "S11100W3" } };
const BROADCAST_BB = { url: "/broadcast/bulletinboard", interfaceId: { get: "S11102W1", post: "S11102W2" } };
const BROADCAST_BB_UPDATE = { url: "/broadcast/bulletinboard/update", interfaceId: { post: "S11102W3" } };
const BROADCAST_BB_TEMPLATE = { url: "/broadcast/bulletinboard/template", interfaceId: { get: "S11102W4", post: "S11102W5" } };
const BROADCAST_BB_TEMPLATE_UPDATE = { url: "/broadcast/bulletinboard/template/update", interfaceId: { post: "S11102W6" } };
const BROADCAST_BB_FLIGHT_LEG = { url: "/broadcast/bulletinboard/flightleg", interfaceId: { get: "S11102W7" } };
const BROADCAST_BB_FLIGHT_START = { url: "/broadcast/bulletinboard/flight", interfaceId: { post: "S11102W8" } };
const BROADCAST_EMAIL = { url: "/broadcast/mail", interfaceId: { post: "S11103W2" } };
const BROADCAST_EMAIL_TEMPLATE = { url: "/broadcast/mail/template", interfaceId: { get: "S11103W4", post: "S11103W5" } };
const BROADCAST_EMAIL_TEMPLATE_UPDATE = { url: "/broadcast/mail/template/update", interfaceId: { post: "S11103W6" } };
const BROADCAST_TTY = { url: "/broadcast/tty", interfaceId: { post: "S11104W2" } };
const BROADCAST_TTY_TEMPLATE = { url: "/broadcast/tty/template", interfaceId: { get: "S11104W4", post: "S11104W5" } };
const BROADCAST_TTY_TEMPLATE_UPDATE = { url: "/broadcast/tty/template/update", interfaceId: { post: "S11104W6" } };
const BROADCAST_AFTN = { url: "/broadcast/aftn", interfaceId: { post: "S11107W2" } };
const BROADCAST_AFTN_TEMPLATE = { url: "/broadcast/aftn/template", interfaceId: { get: "S11107W4", post: "S11107W5" } };
const BROADCAST_AFTN_TEMPLATE_UPDATE = { url: "/broadcast/aftn/template/update", interfaceId: { post: "S11107W6" } };
const BROADCAST_ACARS = { url: "/broadcast/acars", interfaceId: { post: "S11105W2" } };
const BROADCAST_ACARS_TEMPLATE = { url: "/broadcast/acars/template", interfaceId: { get: "S11105W4", post: "S11105W5" } };
const BROADCAST_ACARS_TEMPLATE_UPDATE = { url: "/broadcast/acars/template/update", interfaceId: { post: "S11105W6" } };
const BROADCAST_NTF = { url: "/broadcast/notification", interfaceId: { post: "S11106W2" } };
const BROADCAST_NTF_TEMPLATE = { url: "/broadcast/notification/template", interfaceId: { get: "S11106W4", post: "S11106W5" } };
const BROADCAST_NTF_TEMPLATE_UPDATE = { url: "/broadcast/notification/template/update", interfaceId: { post: "S11106W6" } };
const BB_THREADS = { url: "/bulletinboard/threads", interfaceId: { get: "S11101W1" } };
const BB_THREAD = { url: "/bulletinboard/thread", interfaceId: { get: "S11101W2" } };
const BB_COMMENT = { url: "/bulletinboard/comment", interfaceId: { post: "S11101W3" } };
const BB_COMMENT_UPDATE = { url: "/bulletinboard/comment/update", interfaceId: { post: "S11101W4" } };
const BB_COMMENT_DELETE = { url: "/bulletinboard/comment/delete", interfaceId: { post: "S11101W5" } };
const BB_RESPONSE = { url: "/bulletinboard/response", interfaceId: { post: "S11101W6" } };
const BB_RESPONSE_UPDATE = { url: "/bulletinboard/response/update", interfaceId: { post: "S11101W7" } };
const BB_RESPONSE_DELETE = { url: "/bulletinboard/response/delete", interfaceId: { post: "S11101W8" } };
const BB_THREAD_DELETE = { url: "/bulletinboard/thread/delete", interfaceId: { post: "S11101W9" } };
const BB_THREAD_FILE = { url: "/bulletinboard/thread/file", interfaceId: { get: "S11101WA" } };
const BB_THREADS_FLIGHT = { url: "/bulletinboard/threads/flight", interfaceId: { get: "S11101WB" } };
const BB_THREAD_REACTION = { url: "/bulletinboard/thread/reaction", interfaceId: { post: "S11101WC" } };
const BB_RESPONSE_REACTION = { url: "/bulletinboard/response/reaction", interfaceId: { post: "S11101WD" } };
const BB_COMMENT_REACTION = { url: "/bulletinboard/comment/reaction", interfaceId: { post: "S11101WE" } };
const OAL_FLIGHT_SCHEDULE = { url: "/OalFlightSchedule", interfaceId: { get: "S11301W1" } };
const OAL_FLIGHT_SCHEDULE_UPDATE = { url: "/OalFlightScheduleUpdate", interfaceId: { post: "S11301W2" } };
const OAL_FLIGHT_MOVEMENT = { url: "/OalFlightMovement", interfaceId: { get: "S11400W1" } };
const OAL_FLIGHT_MOVEMENT_UPDATE = { url: "/OalFlightMovementUpdate", interfaceId: { post: "S10100WB1" } };
const FLIGHT_MOVEMENT = { url: "/FlightMovement", interfaceId: { get: "S10601W2" } };
const FLIGHT_MOVEMENT_UPDATE = { url: "/FlightMovementUpdate", interfaceId: { post: "S10100WF" } };
const FLIGHT_IRREGULAR_UPDATE = { url: "/FlightIrrUpdate", interfaceId: { post: "S10602W1" } };
const OAL_FLIGHT_IRREGULAR_UPDATE = { url: "/OalFlightIrrUpdate", interfaceId: { post: "S10602W2" } };
const MVT_MSG = { url: "/MvtMsg", interfaceId: { get: "S10603W1" } };
const MVT_MSG_UPDATE = { url: "/MvtMsgUpdate", interfaceId: { get: "S10603W2" } };
const OAL_PAX = { url: "/OalPax", interfaceId: { get: "S11302W1", post: "S11302W2" } };
const OAL_PAX_STATUS = { url: "/OalPaxStatus", interfaceId: { get: "S11304W1", post: "S11304W2" } };
const LEG_ARR_DEP_CTRL = { url: "/LegArrdepCtrl", interfaceId: { get: "S10100WE" } };
const OAL_FUEL = { url: "/OalFuel", interfaceId: { get: "S11305W1", post: "S11305W2" } };
const MYSCHEDULE = { url: "/MySchedule", interfaceId: { get: "S10401W1", post: "S10401W2" } };
const MYSCHEDULE_FIS = { url: "/MySchedule/Fis", interfaceId: { get: "S10401W3" } };
const ACARS_STATUS = { url: "/AcarsStatus", interfaceId: { get: "S10100WH" } };
const SPOT_NUMBER_RESTRICTION_CHECK = { url: "/SpotNumber/restriction/check", interfaceId: { post: "S10702W1" } };

const sleepByPromise = (milSec) => {
  return new Promise((resolve) => setTimeout(resolve, milSec));
};

const logger = fs.createWriteStream("./server/log.txt");

const writeLog = (chunk, outputDate = true) => {
  const date = new Date();
  const dateString = (date.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  }) + "." + date.getMilliseconds() + "   ").slice(0, 23);
  const message = outputDate ? `${dateString} ${chunk}` : chunk;
  logger.write(message + "\n");
  console.log(message);
};

const fileExists = async (filepath) => {
  try {
    const exists = !!(await fsPromises.lstat(filepath));
    writeLog(`fileChecking ${filepath} ${exists ? "[exists]" : "[not exists]"}`);
    return exists;
  } catch (e) {
    writeLog(`fileChecking ${filepath} [not exists]`);
    return false;
  }
};

writeLog("Start");

const customPropsGET = {
  counter: 0, // レスポンスの配列位置を保持する
  configFile: "./server/routesConfigGet.json",
};
const customPropsPOST = {
  counter: 0, // レスポンスの配列位置を保持する
  configFile: "./server/routesConfigPost.json",
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
/**
 * レスポンス実行処理
 */
const doResponse = async (req, res, fileName, editResponse = (response) => response) => {
  // await sleepByPromise(10000)

  // リクエストのログを出力
  writeLog("-----------------", false);
  writeLog("request " + req.method + " " + req.route.path);
  writeLog("[params]\n" + JSON.stringify(req.params, getCircularReplacer(), 2), false);
  writeLog("[query]\n" + JSON.stringify(req.query, getCircularReplacer(), 2), false);
  writeLog("[body]\n" + JSON.stringify(req.body, getCircularReplacer(), 2), false);

  try {
    // レスポンスをカスタマイズする処理
    const customProps = req.method == "GET" ? customPropsGET : req.method == "POST" ? customPropsPOST : { counter: 0, configFile: "" };
    const configJson = await fsPromises.readFile(customProps.configFile, "utf8");
    const config = JSON.parse(configJson);
    const customResponseCount = Number(config.customResponseCount) || 0;
    var statusCode = 200;
    if (customResponseCount && config.responseDataList && config.responseDataList.length) {
      customProps.counter += 1;
      if (customProps.counter > customResponseCount || customProps.counter > config.responseDataList.length) {
        customProps.counter = 1;
      }
      const responseData = config.responseDataList[customProps.counter - 1];
      if (responseData && responseData.statusCode) {
        statusCode = responseData.statusCode;
        if (responseData.responsefileName !== null) {
          //カスタムのレスポンスが設定されていれば、それを優先する。
          fileName = responseData.responsefileName;
          editResponse = (response) => response; // レスポンスがカスタムの場合は編集しない
        } else if (statusCode === 200) {
          //200の場合で、カスタムのレスポンスが未設定の場合、レスポンスの変更なし
        } else if (statusCode !== 200 && !!fileName) {
          //200以外で、カスタムのレスポンスが未設定の場合、「通常のファイル名+ステータスコード」のファイルが存在すれば、それをレスポンスとする。
          const splitedFileName = fileName.split(".");
          const extension = splitedFileName[1] ? "." + splitedFileName[1] : "";
          const errorFileName = `${splitedFileName[0]}${statusCode}${extension}`;
          const exists = await fileExists(`./data/${errorFileName}`);
          fileName = exists ? errorFileName : "";
          editResponse = (response) => response; // レスポンスがカスタムの場合は編集しない
        } else {
          //上記に当てはまらない場合、レスポンスなしとする
          fileName = "";
          editResponse = (response) => response; // レスポンスがカスタムの場合は編集しない
        }
        writeLog(`Custom(${customProps.counter}) ${req.method} ${req.path}`);
        writeLog(`          ${statusCode} file:${fileName}`);
      }
    } else {
      customProps.counter = 0;
    }

    // レスポンスの処理
    if (fileName) {
      try {
        const data = await fsPromises.readFile(`./data/${fileName}`, "utf8");
        res.statusCode = statusCode;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS");
        // res.setHeader("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");
        // res.setHeader("Access-control-Allow-Credentials", "true");
        res.setHeader("Cache-Control", "no-cache");
        const response = JSON.parse(data);
        res.json(editResponse(response));
      } catch (e) {
        writeLog(e.message);
        res.statusCode = 404;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "no-cache");
        res.end();
        //throw e;
      }
    } else {
      res.statusCode = statusCode;
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "no-cache");
      res.end();
    }
  } catch (e) {
    writeLog(e.message);
    res.statusCode = 500;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    res.end();
  }
};

const routes = (app) => {
  app.get("/", (req, res) => {
    fs.readFile("./public/index.html", "utf8", (err, html) => {
      res.send(html);
      if (err) console.error(err);
    });
  });
  app.get(APP_VERSION.url, (req, res) => {
    doResponse(req, res, "appVersion.json");
  });
  app.post(JOB_AUTH.url, (req, res) => {
    doResponse(req, res, "jobAuth.json");
  });
  app.get(JOB_PROFILE.url, (req, res) => {
    doResponse(req, res, "jobProfile.json");
  });
  app.get(MASTER.url, (req, res) => {
    doResponse(req, res, "master.json");
  });
  app.post(LOGOUT.url, (req, res) => {
    doResponse(req, res, "logout.json");
  });
  app.get(MQTT_SERVER.url, (req, res) => {
    doResponse(req, res, "mqttserver.json");
  });
  app.get(HEADER.url, (req, res) => {
    doResponse(req, res, "headerInfo.json");
  });
  app.post(AIRPORT_REMARKS.url, (req, res) => {
    doResponse(req, res, "airportRemarksUpdate.json");
  });
  app.get(NOTIFICATION_SETTING.url, (req, res) => {
    doResponse(req, res, "notificationsetting.json");
  });
  app.get(USER_NOTIFICATION.url, (req, res) => {
    doResponse(req, res, "usersetting.json");
  });
  app.post(USER_NOTIFICATION.url, (req, res) => {
    doResponse(req, res, "usersettingUpdate.json");
  });
  app.post(PROFILE_PICTURE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, profile: req.body.profile });
    doResponse(req, res, "profilePicture.json", editResponse);
  });
  app.post(FLIGHT_REMARKS.url, (req, res) => {
    doResponse(req, res, "flightRemarksUpdate.json");
  });
  app.post(ADDRESS_TTY.url, (req, res) => {
    doResponse(req, res, "address/ttyAddressList.json");
  });
  app.post(ADDRESS_MAIL.url, (req, res) => {
    doResponse(req, res, "address/mailAddressList.json");
  });
  app.post(ADDRESS_JOB.url, (req, res) => {
    doResponse(req, res, "address/jobCobeAddressList.json");
  });
  app.get(FIS.url, (req, res) => {
    doResponse(req, res, "fis/fis.json");
  });
  app.get(SPOT_REMARKS.url, (req, res) => {
    doResponse(req, res, "spotRemarks.json");
  });
  app.post(SPOT_REMARKS.url, (req, res) => {
    doResponse(req, res, "spotRemarksUpdate.json");
  });
  app.get(AIRPORT_ISSUE.url, (req, res) => {
    doResponse(req, res, "airportIssue.json");
  });
  app.post(AIRPORT_ISSUE.url, (req, res) => {
    doResponse(req, res, "airportIssuePost.json");
  });
  app.post(TTY_ADDRESS_SEARCH.url, (req, res) => {
    doResponse(req, res, "airportIssueTtyAddress.json");
  });
  app.post(MAIL_ADDRESS_SEARCH.url, (req, res) => {
    doResponse(req, res, "airportIssueMailAddress.json");
  });
  app.post(AIRPORT_ISSUE_TEMPLATE.url, (req, res) => {
    doResponse(req, res, "airportIssueTemplate.json");
  });
  app.get(WORK_STEP.url, (req, res) => {
    doResponse(req, res, "workStep.json");
  });
  app.post(WORK_STEP.url, (req, res) => {
    doResponse(req, res, "workStepUpdate.json");
  });
  app.get(FLIGHT_DETAIL.url, (req, res) => {
    doResponse(req, res, "flightDetail.json");
  });
  app.get(FLIGHT_LIST.url, (req, res) => {
    doResponse(req, res, "flightList.json");
  });
  app.get(FLIGHT_HISTORY.url, (req, res) => {
    doResponse(req, res, "flightChangeHistory.json");
  });
  app.get(FLIGHT_SPECIAL_CARE.url, (req, res) => {
    doResponse(req, res, "flightSpecialCare.json");
  });
  app.get(FLIGHT_PAX_FROM.url, (req, res) => {
    doResponse(req, res, "flightPaxFrom.json");
  });
  app.get(FLIGHT_PAX_TO.url, (req, res) => {
    doResponse(req, res, "flightPaxTo.json");
  });
  app.get(BROADCAST_TEMPLATE.url, (req, res) => {
    doResponse(req, res, "broadcast/templateAll.json");
  });
  app.post(BROADCAST_TEMPLATE_UPDATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.body.templateId) });
    doResponse(req, res, "broadcast/updateTemplateName.json", editResponse);
  });
  app.post(BROADCAST_TEMPLATE_DELETE.url, (req, res) => {
    doResponse(req, res);
  });
  app.get(BROADCAST_BB.url, (req, res) => {
    const editResponse = (response) => ({ ...response, bbId: parseInt(req.query.bbId) });
    doResponse(req, res, "broadcast/BB/bulletinboard.json", editResponse);
  });
  app.post(BROADCAST_BB.url, (req, res) => {
    doResponse(req, res, "broadcast/BB/bulletinboardPost.json");
  });
  app.post(BROADCAST_BB_UPDATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, bbId: parseInt(req.body.bbId) });
    doResponse(req, res, "broadcast/BB/updateBb.json", editResponse);
  });
  app.get(BROADCAST_BB_TEMPLATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.query.templateId) });
    doResponse(req, res, "broadcast/BB/template.json", editResponse);
  });
  app.post(BROADCAST_BB_TEMPLATE.url, (req, res) => {
    doResponse(req, res, "broadcast/BB/templatePost.json");
  });
  app.post(BROADCAST_BB_TEMPLATE_UPDATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.body.templateId) });
    doResponse(req, res, "broadcast/BB/updateTemplate.json", editResponse);
  });
  app.get(BROADCAST_BB_FLIGHT_LEG.url, (req, res) => {
    doResponse(req, res, "broadcast/BB/flightleg.json");
  });
  app.post(BROADCAST_BB_FLIGHT_START.url, (req, res) => {
    doResponse(req, res, "bulletinBoard/broadcastFlight.json");
  });
  app.post(BROADCAST_EMAIL.url, (req, res) => {
    doResponse(req, res);
  });
  app.get(BROADCAST_EMAIL_TEMPLATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.query.templateId) });
    doResponse(req, res, "broadcast/Email/template.json", editResponse);
  });
  app.post(BROADCAST_EMAIL_TEMPLATE.url, (req, res) => {
    doResponse(req, res, "broadcast/Email/templatePost.json");
  });
  app.post(BROADCAST_EMAIL_TEMPLATE_UPDATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.body.templateId) });
    doResponse(req, res, "broadcast/Email/updateTemplate.json", editResponse);
  });
  app.post(BROADCAST_TTY.url, (req, res) => {
    doResponse(req, res);
  });
  app.get(BROADCAST_TTY_TEMPLATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.query.templateId) });
    doResponse(req, res, "broadcast/Tty/template.json", editResponse);
  });
  app.post(BROADCAST_TTY_TEMPLATE.url, (req, res) => {
    doResponse(req, res, "broadcast/Tty/templatePost.json");
  });
  app.post(BROADCAST_TTY_TEMPLATE_UPDATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.body.templateId) });
    doResponse(req, res, "broadcast/Tty/updateTemplate.json", editResponse);
  });
  app.post(BROADCAST_AFTN.url, (req, res) => {
    doResponse(req, res);
  });
  app.get(BROADCAST_AFTN_TEMPLATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.query.templateId) });
    doResponse(req, res, "broadcast/Aftn/template.json", editResponse);
  });
  app.post(BROADCAST_AFTN_TEMPLATE.url, (req, res) => {
    doResponse(req, res, "broadcast/Aftn/templatePost.json");
  });
  app.post(BROADCAST_AFTN_TEMPLATE_UPDATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.body.templateId) });
    doResponse(req, res, "broadcast/Aftn/updateTemplate.json", editResponse);
  });
  app.post(BROADCAST_ACARS.url, (req, res) => {
    doResponse(req, res);
  });
  app.get(BROADCAST_ACARS_TEMPLATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.query.templateId) });
    doResponse(req, res, "broadcast/Acars/template.json", editResponse);
  });
  app.post(BROADCAST_ACARS_TEMPLATE.url, (req, res) => {
    doResponse(req, res, "broadcast/Acars/templatePost.json");
  });
  app.post(BROADCAST_ACARS_TEMPLATE_UPDATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.body.templateId) });
    doResponse(req, res, "broadcast/Acars/updateTemplate.json", editResponse);
  });
  app.post(BROADCAST_NTF.url, (req, res) => {
    doResponse(req, res);
  });
  app.get(BROADCAST_NTF_TEMPLATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.query.templateId) });
    doResponse(req, res, "broadcast/Notification/template.json", editResponse);
  });
  app.post(BROADCAST_NTF_TEMPLATE.url, (req, res) => {
    doResponse(req, res, "broadcast/Notification/templatePost.json");
  });
  app.post(BROADCAST_NTF_TEMPLATE_UPDATE.url, (req, res) => {
    const editResponse = (response) => ({ ...response, templateId: parseInt(req.body.templateId) });
    doResponse(req, res, "broadcast/Notification/storeTemplate.json", editResponse);
  });
  app.get(BB_THREADS.url, (req, res) => {
    doResponse(req, res, "bulletinBoard/threads.json");
  });
  app.get(BB_THREAD.url, (req, res) => {
    const editResponse = (response) => ({ ...response, thread: { ...response.thread, bbId: parseInt(req.query.bbId) } });
    doResponse(req, res, "bulletinBoard/thread.json", editResponse);
  });
  app.post(BB_COMMENT.url, (req, res) => {
    doResponse(req, res, "bulletinBoard/bulletinBoardAddComment.json");
  });
  app.post(BB_COMMENT_UPDATE.url, (req, res) => {
    doResponse(req, res, "bulletinBoard/bulletinBoardUpdateComment.json");
  });
  app.post(BB_COMMENT_DELETE.url, (req, res) => {
    doResponse(req, res);
  });
  app.post(BB_RESPONSE.url, (req, res) => {
    doResponse(req, res, "bulletinBoard/bulletinBoardAddResponse.json");
  });
  app.post(BB_RESPONSE_UPDATE.url, (req, res) => {
    doResponse(req, res, "bulletinBoard/bulletinBoardUpdateResponse.json");
  });
  app.post(BB_RESPONSE_DELETE.url, (req, res) => {
    doResponse(req, res);
  });
  app.post(BB_THREAD_DELETE.url, (req, res) => {
    doResponse(req, res);
  });
  app.post(BB_THREAD_REACTION.url, (req, res) => {
    const editResponse = (response) => ({ ...response, bbId: parseInt(req.body.bbId) });
    doResponse(req, res, "bulletinBoard/bulletinBoardThreadReaction.json", editResponse);
  });
  app.post(BB_RESPONSE_REACTION.url, (req, res) => {
    const editResponse = (response) => ({ ...response, resId: parseInt(req.body.resId) });
    doResponse(req, res, "bulletinBoard/bulletinBoardResponseReaction.json", editResponse);
  });
  app.post(BB_COMMENT_REACTION.url, (req, res) => {
    const editResponse = (response) => ({ ...response, cmtId: parseInt(req.body.cmtId) });
    doResponse(req, res, "bulletinBoard/bulletinBoardCommentReaction.json", editResponse);
  });
  app.get(BB_THREAD_FILE.url, (req, res) => {
    doResponse(req, res, "bulletinBoard/bulletinBoardDownloadFile.json");
  });
  app.get(BB_THREADS_FLIGHT.url, (req, res) => {
    doResponse(req, res, "bulletinBoard/flightThreads.json");
  });
  app.get(OAL_FLIGHT_SCHEDULE.url, (req, res) => {
    doResponse(req, res, "oalFlightSchedule.json");
  });
  app.post(OAL_FLIGHT_SCHEDULE_UPDATE.url, (req, res) => {
    doResponse(req, res, "oalFlightScheduleUpdate.json");
  });
  app.get(FLIGHT_MOVEMENT.url, (req, res) => {
    doResponse(req, res, "flightMovement.json");
  });
  app.post(FLIGHT_MOVEMENT_UPDATE.url, (req, res) => {
    doResponse(req, res, "flightMovementUpdate.json");
  });
  app.get(OAL_FLIGHT_MOVEMENT.url, (req, res) => {
    doResponse(req, res, "oalFlightMovement.json");
  });
  app.get(MVT_MSG.url, (req, res) => {
    doResponse(req, res, "mvtMsg/mvtMsg.json");
  });
  app.post(MVT_MSG_UPDATE.url, (req, res) => {
    doResponse(req, res, "mvtMsg/mvtMsgUpdate.json");
  });
  app.post(OAL_FLIGHT_MOVEMENT_UPDATE.url, (req, res) => {
    doResponse(req, res, "oalFlightMovementUpdate.json");
  });
  app.post(FLIGHT_IRREGULAR_UPDATE.url, (req, res) => {
    doResponse(req, res, "flightIrrUpdate.json");
  });
  app.post(OAL_FLIGHT_IRREGULAR_UPDATE.url, (req, res) => {
    doResponse(req, res, "oalFlightIrrUpdate.json");
  });
  app.get(OAL_PAX.url, (req, res) => {
    doResponse(req, res, "oalPax.json");
  });
  app.post(OAL_PAX.url, (req, res) => {
    doResponse(req, res, "oalPaxUpdate.json");
  });
  app.get(OAL_PAX_STATUS.url, (req, res) => {
    doResponse(req, res, "oalPaxStatus.json");
  });
  app.post(OAL_PAX_STATUS.url, (req, res) => {
    doResponse(req, res, "oalPaxStatusUpdate.json");
  });
  app.get(LEG_ARR_DEP_CTRL.url, (req, res) => {
    doResponse(req, res, "legArrDepCtrl.json");
  });
  app.get(OAL_FUEL.url, (req, res) => {
    doResponse(req, res, "oalFuel.json");
  });
  app.post(OAL_FUEL.url, (req, res) => {
    doResponse(req, res, "oalFuelUpdate.json");
  });
  app.get(MYSCHEDULE.url, (req, res) => {
    doResponse(req, res, "mySchedule/mySchedule.json");
  });
  app.post(MYSCHEDULE.url, (req, res) => {
    doResponse(req, res, "mySchedule/myScheduleUpdate.json");
  });
  app.get(MYSCHEDULE_FIS.url, (req, res) => {
    doResponse(req, res, "mySchedule/fis.json");
  });
  app.get(ACARS_STATUS.url, (req, res) => {
    doResponse(req, res, "acarsStatus.json");
  });
  app.post(SPOT_NUMBER_RESTRICTION_CHECK.url, (req, res) => {
    doResponse(req, res, "SpotNumberRestrictionCheck.json");
  });
};

module.exports = routes;
