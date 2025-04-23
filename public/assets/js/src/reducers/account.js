"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setZoomBarChart = exports.setZoomFis = exports.setDisplayMode = exports.fetchUpdateProfilePictureSuccess = exports.slice = exports.setPinpointNotification = exports.updateProfilePicture = exports.reloadMaster = exports.jobAuth = exports.getProfile = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const redux_form_1 = require("redux-form");
const webApi_1 = require("../lib/webApi");
const commonUtil_1 = require("../lib/commonUtil");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const commonConst_1 = require("../lib/commonConst");
const storage_1 = require("../lib/storage");
const StorageOfUser_1 = require("../lib/StorageOfUser");
const initialState = {
    profile: {
        user: {
            familyName: "",
            firstName: "",
            companyCd: "",
            deptCd: "",
            profileImg: "",
        },
    },
    jobAuth: {
        info: { token: "" },
        user: {
            userId: "",
            jobCd: "",
            jobName: "",
            mailAddr: "",
            ttyAddr: "",
            grpId: 0,
            grpCd: "",
            grpName: "",
            myApoCd: "",
            familyName: "",
            firstName: "",
            companyCd: "",
            deptCd: "",
            profileImg: "",
            bbAdminFlg: false,
            commonSiteFlg: false,
        },
        jobAuth: [],
    },
    master: {
        airlines: [],
        airports: [],
        ntfInfo: {
            ntf: [],
            soalaEvt: [],
            airportNtfList: [],
            flightNoNtfList: [],
            legNtfList: [],
        },
        cdCtrlDtls: [],
        jobs: [],
        grps: [],
        commGrps: [],
        adGrps: [],
        ships: [],
        spclCareGrps: [],
        ssrs: [],
        spclLoads: [],
        dlyRsns: [],
        mvtMsgRmks: [],
        onlineDbExpDays: 0,
        oalOnlineDbExpDays: 0,
        mvtDateRangeLimit: 0,
    },
    isFetching: false,
    isError: false,
    isDarkMode: true,
    zoomFis: 100,
    zoomBarChart: 100,
    retry: () => null,
};
// 新規タブで開いている場合、親タブのセッションストレージをローカルストレージ経由でコピーする
if (!sessionStorage.length) {
    const sessionData = localStorage.getItem("sessionStorage"); // 親タブからローカルストレージに一時的に格納される
    if (sessionData) {
        const data = JSON.parse(sessionData);
        Object.keys(data).forEach((key) => {
            if (key === storage_1.storage.storageKey.jobAuthResponse ||
                key === storage_1.storage.storageKey.masterResponse ||
                key === storage_1.storage.storageKey.token ||
                key === storage_1.storage.storageKey.terminalCat ||
                key === storage_1.storage.storageKey.loginStamp ||
                key === storage_1.storage.storageKey.cognitoLoginType ||
                key === storage_1.storage.storageKey.cognitoToken ||
                key.indexOf(storage_1.storage.storageKey.cognitoIdentityServiceProvider) === 0) {
                sessionStorage.setItem(key, data[key]);
            }
        });
    }
    storage_1.storage.pageStamp = Date.now();
}
localStorage.removeItem("sessionStorage"); // 最後に削除する
//  Storageにデータがある場合は初期値に設定
if (storage_1.storage.jobAuthResponse) {
    const jobAuthResponse = JSON.parse(storage_1.storage.jobAuthResponse);
    initialState.jobAuth = {
        info: jobAuthResponse.info,
        user: jobAuthResponse.user,
        jobAuth: jobAuthResponse.jobAuth,
    };
    StorageOfUser_1.storageOfUser.init({
        userId: jobAuthResponse.user.userId,
    });
}
//  Storageにデータがある場合は初期値に設定
if (storage_1.storage.masterResponse) {
    const masterResponse = JSON.parse(storage_1.storage.masterResponse);
    initialState.master = {
        ...masterResponse,
    };
}
//  Storageにデータがある場合は初期値に設定
if (storage_1.storage.displayMode) {
    initialState.isDarkMode = storage_1.storage.displayMode === "darkMode";
}
//  Storageにデータがある場合は初期値に設定
if (storage_1.storage.zoomFis) {
    initialState.zoomFis = storage_1.storage.zoomFis;
}
//  Storageにデータがある場合は初期値に設定
if (storage_1.storage.zoomBarChart) {
    initialState.zoomBarChart = storage_1.storage.zoomBarChart;
}
exports.getProfile = (0, toolkit_1.createAsyncThunk)("account/getProfile", async (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.fetchProfile());
    try {
        const response = await webApi_1.WebApi.getJobProfile(dispatch);
        const { data } = response;
        dispatch(exports.slice.actions.fetchProfileSuccess({ data }));
    }
    catch (err) {
        dispatch(exports.slice.actions.fetchProfileFailure({ error: err, retry: () => (0, exports.getProfile)() }));
    }
});
exports.jobAuth = (0, toolkit_1.createAsyncThunk)("account/jobAuth", async (arg, thunkAPI) => {
    const { jobCd, jobAuthCd, deviceName, terminalCat, historyPush } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.postJobAuth());
    notifications_1.NotificationCreator.removeAll({ dispatch });
    try {
        // Job認証
        const responseJobAuth = await webApi_1.WebApi.postJobAuth(dispatch, { jobCd, jobAuthCd, deviceName });
        // storageOfUserの初期化
        const { userId } = responseJobAuth.data.user;
        StorageOfUser_1.storageOfUser.init({ userId });
        // ストレージに保存
        storage_1.storage.jobAuthResponse = JSON.stringify(responseJobAuth.data);
        storage_1.storage.token = responseJobAuth.data.info.token;
        storage_1.storage.terminalCat = terminalCat;
        const timeStamp = Date.now();
        storage_1.storage.loginStamp = timeStamp;
        StorageOfUser_1.storageOfUser.saveLoginStamp({ timeStamp });
        StorageOfUser_1.storageOfUser.initPushCounter();
        // iOSアプリにJob認証情報を保存する
        if (window.webkit && window.webkit.messageHandlers.saveJobAuthInfo) {
            window.webkit.messageHandlers.saveJobAuthInfo.postMessage({ jobCd, jobAuthCd });
        }
        // Master取得
        const master = await getMasterFromApi(dispatch, responseJobAuth.data.user);
        // 通知設定をPinpointに登録
        if ((0, commonUtil_1.terminalFuncCheck)(commonConst_1.Const.FUNC_ID.openNotificationList) && // 端末の使用制限チェック
            (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openNotificationList, responseJobAuth.data.jobAuth) // 権限のチェック
        ) {
            // 通知設定取得
            const responseNotify = await webApi_1.WebApi.getNotificationSetting(dispatch);
            // Pinpointに登録
            setPinpointNotification(responseNotify.data);
        }
        else {
            // 権限がない場合は、通知は無視する
            setPinpointNotification(null);
        }
        dispatch(exports.slice.actions.postJobAuthSuccess({ jobAuthData: responseJobAuth.data, masterData: master }));
        historyPush(); // 画面遷移
    }
    catch (err) {
        dispatch((0, redux_form_1.change)("jobAuth", "jobAuthCd", ""));
        dispatch(exports.slice.actions.postJobAuthFailure());
    }
});
// マスターを再取得する
exports.reloadMaster = (0, toolkit_1.createAsyncThunk)("account/reloadMaster", async (arg, thunkAPI) => {
    const { user, masterGetType = 0 } = arg;
    const { dispatch } = thunkAPI;
    try {
        // Master取得
        const master = await getMasterFromApi(dispatch, user, masterGetType);
        dispatch(exports.slice.actions.fetchMasterSuccess({ masterData: master }));
    }
    catch (err) {
        // empty
    }
});
exports.updateProfilePicture = (0, toolkit_1.createAsyncThunk)("account/updateProfilePicture", async (arg, thunkAPI) => {
    const { profile, closeEditImageModal } = arg;
    const { dispatch } = thunkAPI;
    try {
        const response = await webApi_1.WebApi.postProfilePicture(dispatch, profile);
        dispatch((0, exports.fetchUpdateProfilePictureSuccess)({ profileImg: response.data.profile }));
        if (storage_1.storage.jobAuthResponse) {
            const jobAuthResponse = JSON.parse(storage_1.storage.jobAuthResponse);
            jobAuthResponse.user.profileImg = response.data.profile;
            storage_1.storage.jobAuthResponse = JSON.stringify(jobAuthResponse);
        }
        closeEditImageModal();
    }
    catch (err) {
        // empty
    }
});
// pinpointに通知設定を行う
function setPinpointNotification(notifyList) {
    if (window.webkit)
        window.webkit.messageHandlers.registNotification.postMessage(notifyList ? JSON.stringify(notifyList) : "");
}
exports.setPinpointNotification = setPinpointNotification;
exports.slice = (0, toolkit_1.createSlice)({
    name: "account",
    initialState,
    reducers: {
        fetchProfile: (state) => {
            state.isFetching = true;
        },
        fetchProfileSuccess: (state, action) => {
            const { data } = action.payload;
            state.profile = {
                user: data.user,
            };
            state.isFetching = false;
            state.isError = false;
            state.retry = () => null;
        },
        fetchProfileFailure: (state, _action) => {
            state.isFetching = false;
        },
        fetchMasterSuccess: (state, action) => {
            const { masterData } = action.payload;
            state.master = masterData;
        },
        postJobAuth: (state) => {
            state.isFetching = true;
        },
        postJobAuthSuccess: (state, action) => {
            const { jobAuthData, masterData } = action.payload;
            state.jobAuth = {
                info: jobAuthData.info,
                user: jobAuthData.user,
                jobAuth: jobAuthData.jobAuth,
            };
            state.master = masterData;
            state.isFetching = false;
        },
        postJobAuthFailure: (state) => {
            state.isFetching = false;
        },
        fetchUpdateProfilePictureSuccess: (state, action) => {
            const { profileImg } = action.payload;
            state.jobAuth = {
                ...state.jobAuth,
                user: {
                    ...state.jobAuth.user,
                    profileImg,
                },
            };
        },
        setDisplayMode: (state, action) => {
            const { displayMode } = action.payload;
            storage_1.storage.displayMode = displayMode;
            state.isDarkMode = displayMode === "darkMode";
        },
        setZoomFis: (state, action) => {
            const { zoom } = action.payload;
            storage_1.storage.zoomFis = zoom;
            state.zoomFis = zoom;
        },
        setZoomBarChart: (state, action) => {
            const { zoom } = action.payload;
            storage_1.storage.zoomBarChart = zoom;
            state.zoomBarChart = zoom;
        },
    },
});
async function getMasterFromApi(dispatch, user, masterGetType = 0) {
    // Master取得
    const responseMaster = await webApi_1.WebApi.getMaster(dispatch, { masterGetType });
    // 被マージ対象の既存マスタの取得
    let master = { ...initialState.master };
    if (storage_1.storage.masterResponse) {
        try {
            master = JSON.parse(storage_1.storage.masterResponse);
        }
        catch (e) {
            // empty
        }
    }
    master = { ...master, ...convertMasterResponseToMaster(responseMaster.data, user) };
    // 通知を取得する
    if (responseMaster.data.ntfInfo && responseMaster.data.ntfInfo.ntf) {
        const airportNtfList = [];
        const flightNoNtfList = [];
        const legNtfList = [];
        responseMaster.data.ntfInfo.ntf
            .filter((ntf) => ntf.ntfTypeCd === "APO")
            .forEach((data) => {
            airportNtfList.push({ value: data.ntfCd, label: data.dispName });
        });
        responseMaster.data.ntfInfo.ntf
            .filter((ntf) => ntf.ntfTypeCd === "FLT")
            .forEach((data) => {
            flightNoNtfList.push({ value: data.ntfCd, label: data.dispName });
        });
        responseMaster.data.ntfInfo.ntf
            .filter((ntf) => ntf.ntfTypeCd === "LEG")
            .forEach((data) => {
            legNtfList.push({ value: data.ntfCd, label: data.dispName });
        });
        master = {
            ...master,
            ntfInfo: {
                ntf: responseMaster.data.ntfInfo.ntf,
                soalaEvt: responseMaster.data.ntfInfo.soalaEvt || master.ntfInfo.soalaEvt,
                airportNtfList,
                flightNoNtfList,
                legNtfList,
            },
        };
    }
    if (responseMaster.data.cdCtrlDtl) {
        // オンラインDB有効期限日数を取得する(自社便)
        const Code011 = responseMaster.data.cdCtrlDtl.find((cd) => cd.cdCls === "011" && cd.cdCat1 === "ONLINE_DB_EXP_DAYS");
        if (Code011) {
            master.onlineDbExpDays = Code011.num1;
        }
        else {
            console.error("Could not get onlineDbExpDays(Code:011).");
            const id = "getMasterFromApi";
            notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M50021C() });
        }
        // オンラインDB有効期限日数を取得する(他社便)
        const Code033 = responseMaster.data.cdCtrlDtl.find((cd) => cd.cdCls === "033" && cd.cdCat1 === "ONLINE_DB_EXP_DAYS");
        if (Code033) {
            master.oalOnlineDbExpDays = Code033.num1;
        }
        else {
            console.error("Could not get onlineDbExpDays(Code:033).");
            const id = "getMasterFromApi";
            notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M50021C() });
        }
        const Code050 = responseMaster.data.cdCtrlDtl.find((cd) => cd.cdCls === "050" && cd.cdCat1 === "MvtSearch");
        if (Code050) {
            master.mvtDateRangeLimit = Code050.num1;
        }
        else {
            console.error("Could not get onlineDbExpDays(Code:050).");
            const id = "getMasterFromApi";
            notifications_1.NotificationCreator.create({ dispatch, id, message: soalaMessages_1.SoalaMessage.M50021C() });
        }
    }
    storage_1.storage.masterResponse = JSON.stringify(master);
    return master;
}
// 所属空港を空港リストの１行目に配置する
function editAirports(airports, myApoCd) {
    if (myApoCd) {
        const newAirports = [{ apoCd: myApoCd, dispSeq: 0 }].concat(airports);
        const index = newAirports.findIndex((a, x) => x !== 0 && a.apoCd === myApoCd);
        if (index >= 0) {
            newAirports.splice(index, 1);
        }
        return newAirports;
    }
    return airports;
}
// MasterApi.Response を、Partial<Master> オブジェクトに変換する
function convertMasterResponseToMaster(masterResponse, user) {
    return {
        ...(masterResponse.airline !== undefined ? { airlines: masterResponse.airline } : {}),
        ...(masterResponse.airport !== undefined ? { airports: editAirports(masterResponse.airport, user.myApoCd) } : {}),
        ...(masterResponse.cdCtrlDtl !== undefined ? { cdCtrlDtls: masterResponse.cdCtrlDtl } : {}),
        ...(masterResponse.job !== undefined ? { jobs: masterResponse.job } : {}),
        ...(masterResponse.grp !== undefined ? { grps: masterResponse.grp } : {}),
        ...(masterResponse.commGrp !== undefined ? { commGrps: masterResponse.commGrp } : {}),
        ...(masterResponse.adGrp !== undefined ? { adGrps: masterResponse.adGrp } : {}),
        ...(masterResponse.ship !== undefined ? { ships: masterResponse.ship } : {}),
        ...(masterResponse.spclCareGrp !== undefined ? { spclCareGrps: masterResponse.spclCareGrp } : {}),
        ...(masterResponse.ssr !== undefined ? { ssrs: masterResponse.ssr } : {}),
        ...(masterResponse.spclLoad !== undefined ? { spclLoads: masterResponse.spclLoad } : {}),
        ...(masterResponse.dlyRsn !== undefined ? { dlyRsns: masterResponse.dlyRsn } : {}),
        ...(masterResponse.mvtMsgRmks !== undefined ? { mvtMsgRmks: masterResponse.mvtMsgRmks } : {}),
    };
}
_a = exports.slice.actions, exports.fetchUpdateProfilePictureSuccess = _a.fetchUpdateProfilePictureSuccess, exports.setDisplayMode = _a.setDisplayMode, exports.setZoomFis = _a.setZoomFis, exports.setZoomBarChart = _a.setZoomBarChart;
exports.default = exports.slice.reducer;
//# sourceMappingURL=account.js.map