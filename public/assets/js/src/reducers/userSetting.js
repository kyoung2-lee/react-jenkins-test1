"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCheckHasDifference = exports.clearUserSetting = exports.slice = exports.checkUserSettingFuncAuth = exports.showMessage = exports.setFltNtfFrom = exports.setApoNtfFrom = exports.updateUserSetting = exports.getUserSetting = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const redux_form_1 = require("redux-form");
const webApi_1 = require("../lib/webApi");
const account_1 = require("./account");
const notifications_1 = require("../lib/notifications");
const commonUtil_1 = require("../lib/commonUtil");
const commonConst_1 = require("../lib/commonConst");
// eslint-disable-next-line import/no-cycle
const UserSetting_1 = require("../components/organisms/UserSetting");
exports.getUserSetting = (0, toolkit_1.createAsyncThunk)("userSettings/getUserSetting", async (_arg, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.fetchUserSetting());
    try {
        // ユーザー設定取得
        const response = await webApi_1.WebApi.getUserNotification(dispatch);
        setFrom(response.data, dispatch);
        dispatch(exports.slice.actions.fetchUserSettingSuccess(response.data));
    }
    catch (err) {
        dispatch(exports.slice.actions.fetchUserSettingFailure({ error: err }));
    }
});
exports.updateUserSetting = (0, toolkit_1.createAsyncThunk)("userSetting/updateUserSetting", async (arg, thunkAPI) => {
    const userSettingWithForm = arg;
    const { dispatch, getState } = thunkAPI;
    const { jobAuth } = getState().account;
    // 同一行の入力値で必須の項目に値が入っている行をリクエストパラメータに追加する
    const apoNtfList = [];
    if (userSettingWithForm.apoNtfList) {
        userSettingWithForm.apoNtfList.forEach(({ apoCode, eventCode }) => {
            if (apoCode && eventCode) {
                apoNtfList.push({
                    apoCode,
                    eventCode,
                    apoNtfOrder: apoNtfList.length,
                });
            }
        });
    }
    // 同一行の入力値で必須の項目に値が入っている行をリクエストパラメータに追加する
    const fltNtfList = [];
    if (userSettingWithForm.fltNtfList) {
        userSettingWithForm.fltNtfList.forEach(({ type, triggerDep = "", triggerArr = "", fltEventCode, legEventCode, trigger }) => {
            if ((type === "FLT" || type === "CAS") && trigger && fltEventCode) {
                fltNtfList.push({
                    type,
                    trigger,
                    eventCode: fltEventCode,
                    fltNtfOrder: fltNtfList.length,
                });
            }
            else if (type === "LEG" && (triggerDep || triggerArr) && legEventCode) {
                fltNtfList.push({
                    type,
                    trigger: `${triggerDep}-${triggerArr}`,
                    eventCode: legEventCode,
                    fltNtfOrder: fltNtfList.length,
                });
            }
        });
    }
    const params = {
        grpNtfFlg: true,
        apoNtfFlg: userSettingWithForm.apoNtfFlg,
        apoNtfList,
        fltNtfFlg: userSettingWithForm.fltNtfFlg,
        fltNtfList,
        bbNtfFlg: userSettingWithForm.bbNtfFlg,
        cmtNtfFlg: userSettingWithForm.cmtNtfFlg,
        myskdlNtfFlg: userSettingWithForm.myskdlNtfFlg,
    };
    notifications_1.NotificationCreator.removeAll({ dispatch });
    dispatch(exports.slice.actions.fetchUserSetting());
    try {
        // ユーザー設定登録
        const response = await webApi_1.WebApi.postUserNotification(dispatch, params);
        // fromの初期化(submit後、バリデーションエラー表示しないため)
        dispatch((0, redux_form_1.reset)(UserSetting_1.FORM_NAME));
        // 登録後、取得した値をformに適応
        setFrom(response.data, dispatch);
        // 通知設定をPinpointに登録
        if ((0, commonUtil_1.terminalFuncCheck)(commonConst_1.Const.FUNC_ID.openNotificationList) && // 端末の使用制限チェック
            (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.openNotificationList, jobAuth.jobAuth) // 権限のチェック
        ) {
            // 通知設定取得
            const responseNotify = await webApi_1.WebApi.getNotificationSetting(dispatch);
            (0, account_1.setPinpointNotification)(responseNotify.data);
        }
        else {
            // 権限がない場合は、通知は無視する
            (0, account_1.setPinpointNotification)(null);
        }
        dispatch(exports.slice.actions.fetchUserSettingSuccess(response.data));
    }
    catch (err) {
        dispatch(exports.slice.actions.fetchUserSettingFailure({ error: err }));
    }
});
function setFrom(userSetting, dispatch) {
    if (userSetting) {
        dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, "apoNtfFlg", userSetting.apoNtfFlg));
        dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, "grpNtfFlg", userSetting.grpNtfFlg));
        dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, "fltNtfFlg", userSetting.fltNtfFlg));
        dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, "bbNtfFlg", userSetting.bbNtfFlg));
        dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, "cmtNtfFlg", userSetting.cmtNtfFlg));
        dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, "myskdlNtfFlg", userSetting.myskdlNtfFlg));
        if (userSetting.apoNtfList) {
            setApoNtfFrom(userSetting.apoNtfList, dispatch);
        }
        if (userSetting.fltNtfList) {
            setFltNtfFrom(userSetting.fltNtfList, dispatch);
        }
    }
}
function setApoNtfFrom(apoNtfList, dispatch) {
    apoNtfList.forEach((apoNtf, index) => {
        dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, `apoNtfList[][${index}][apoCode]`, apoNtf.apoCode));
        dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, `apoNtfList[][${index}][eventCode]`, apoNtf.eventCode));
    });
}
exports.setApoNtfFrom = setApoNtfFrom;
function setFltNtfFrom(fltNtfList, dispatch) {
    fltNtfList.forEach((fltNtf, index) => {
        dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, `fltNtfList[][${index}][type]`, fltNtf.type));
        if (fltNtf.type === "FLT" || fltNtf.type === "CAS") {
            dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, `fltNtfList[][${index}][trigger]`, fltNtf.trigger));
            dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, `fltNtfList[][${index}][fltEventCode]`, fltNtf.eventCode));
        }
        else if (fltNtf.type === "LEG" && fltNtf.trigger) {
            dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, `fltNtfList[][${index}][triggerDep]`, fltNtf.trigger.split("-")[0]));
            dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, `fltNtfList[][${index}][triggerArr]`, fltNtf.trigger.split("-")[1]));
            dispatch((0, redux_form_1.change)(UserSetting_1.FORM_NAME, `fltNtfList[][${index}][legEventCode]`, fltNtf.eventCode));
        }
    });
}
exports.setFltNtfFrom = setFltNtfFrom;
exports.showMessage = (0, toolkit_1.createAsyncThunk)("userSetting/showMessage", (arg, thunkAPI) => {
    const { message } = arg;
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message });
});
exports.checkUserSettingFuncAuth = (0, toolkit_1.createAsyncThunk)("userSetting/checkUserSettingFuncAuth", (arg, thunkAPI) => {
    const { jobAuth } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.userSettingFuncAuthCheck({ jobAuth }));
});
const initialState = {
    isFetching: false,
    grpNtfFlg: false,
    apoNtfFlg: false,
    apoNtfList: [],
    fltNtfFlg: false,
    fltNtfList: [],
    bbNtfFlg: true,
    cmtNtfFlg: true,
    myskdlNtfFlg: false,
    isError: false,
    isCleared: false,
    checkHasDifference: () => false,
    canNotifyBulletinBoard: false,
    canNotifyMySchedule: false,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "userSetting",
    initialState,
    reducers: {
        clearUserSetting: (state) => {
            Object.assign(state, initialState, { isCleared: true });
        },
        fetchUserSetting: (state) => {
            state.isFetching = true;
            state.isCleared = false;
        },
        fetchUserSettingSuccess: (state, action) => {
            const { grpNtfFlg, apoNtfFlg, apoNtfList = [], fltNtfFlg, fltNtfList = [], bbNtfFlg, cmtNtfFlg, myskdlNtfFlg } = action.payload;
            state.grpNtfFlg = grpNtfFlg;
            state.apoNtfFlg = apoNtfFlg;
            state.apoNtfList = apoNtfList;
            state.fltNtfFlg = fltNtfFlg;
            state.fltNtfList = fltNtfList;
            state.bbNtfFlg = bbNtfFlg;
            state.cmtNtfFlg = cmtNtfFlg;
            state.myskdlNtfFlg = myskdlNtfFlg;
            state.isFetching = false;
            state.isError = false;
        },
        fetchUserSettingFailure: (state, _action) => {
            state.isFetching = false;
            state.isError = true;
        },
        setCheckHasDifference: (state, action) => {
            state.checkHasDifference = action.payload;
        },
        userSettingFuncAuthCheck: (state, action) => {
            state.canNotifyBulletinBoard = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.notifyBulletinBoard, action.payload.jobAuth);
            state.canNotifyMySchedule = (0, commonUtil_1.funcAuthCheck)(commonConst_1.Const.FUNC_ID.mySchedule, action.payload.jobAuth);
        },
    },
});
_a = exports.slice.actions, exports.clearUserSetting = _a.clearUserSetting, exports.setCheckHasDifference = _a.setCheckHasDifference;
exports.default = exports.slice.reducer;
//# sourceMappingURL=userSetting.js.map