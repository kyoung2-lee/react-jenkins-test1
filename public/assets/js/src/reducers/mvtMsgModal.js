"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAvgTaxiVisible = exports.setPrevMvtDepApo = exports.setAvgTaxiTime = exports.updateMvtMsgFailure = exports.updateMvtMsgSuccess = exports.updateMvtMsg = exports.fetchMvtMsgReCalcFailure = exports.fetchMvtMsgFailure = exports.fetchMvtMsgReCalcSuccess = exports.fetchMvtMsgSuccess = exports.fetchMvtMsg = exports.closeMvtMsgModal = exports.slice = exports.serverErrorItems = exports.showMessage = exports.getArrDlyInfo = exports.updateAndSendMvtMsg = exports.reCalcInstruction = exports.openMvtMsgModal = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_1 = require("lodash");
const toolkit_1 = require("@reduxjs/toolkit");
const webApi_1 = require("../lib/webApi");
const commonUtil_1 = require("../lib/commonUtil");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
/**
 * 初期表示
 */
exports.openMvtMsgModal = (0, toolkit_1.createAsyncThunk)("mvtMsgModal/openMvtMsgModal", async (arg, thunkAPI) => {
    const { legKey } = arg;
    const { dispatch, getState } = thunkAPI;
    const { account } = getState();
    const { onlineDbExpDays } = account.master;
    const params = { ...legKey, funcId: "S10603C", onlineDbExpDays, reCalcInstructionFlg: false };
    dispatch(exports.slice.actions.fetchMvtMsg());
    try {
        const response = await webApi_1.WebApi.getMvtMsg(dispatch, params);
        const movementInfo = response.data;
        if (!movementInfo.shipNo) {
            void dispatch((0, exports.showMessage)({
                message: soalaMessages_1.SoalaMessage.M50036C(),
            }));
            throw new Error();
        }
        if (checkMvtForInitArrDlyCalc(movementInfo) && !checkTaxiingTimeExists(movementInfo.taxiingTimeMin)) {
            void dispatch((0, exports.showMessage)({
                message: soalaMessages_1.SoalaMessage.M40022C({}),
            }));
        }
        // 初期表示時のAVG TAXI欄の表示状態を取得
        const { formValues, noArrDlyInfo } = getInitialFormValue(movementInfo, account);
        const avgTaxiVisible = !getInitialAvgTaxiInfoHidden(movementInfo, noArrDlyInfo);
        dispatch((0, exports.setAvgTaxiVisible)({ avgTaxiVisible }));
        dispatch((0, exports.fetchMvtMsgSuccess)({ movementInfo, formValues }));
    }
    catch (err) {
        dispatch((0, exports.fetchMvtMsgFailure)());
    }
});
/**
 * 再計算ボタン押下
 */
exports.reCalcInstruction = (0, toolkit_1.createAsyncThunk)("mvtMsgModal/reCalcInstruction", async (arg, thunkAPI) => {
    const { legKey, callbacks } = arg;
    const { dispatch, getState } = thunkAPI;
    const { account } = getState();
    const { onlineDbExpDays } = account.master;
    const params = { ...legKey, funcId: "S10603C", onlineDbExpDays, reCalcInstructionFlg: true };
    dispatch(exports.slice.actions.fetchMvtMsg());
    try {
        const response = await webApi_1.WebApi.getMvtMsg(dispatch, params, callbacks);
        dispatch((0, exports.fetchMvtMsgReCalcSuccess)({ movementInfo: response.data }));
        return response.data.taxiingTimeMin;
    }
    catch (err) {
        if (err instanceof webApi_1.ApiError) {
            throw err;
        }
        return undefined;
    }
});
/**
 * MVTメッセージ発信＆更新
 */
exports.updateAndSendMvtMsg = (0, toolkit_1.createAsyncThunk)("mvtMsgModal/updateAndSendMvtMsg", async (arg, thunkAPI) => {
    const { formValues, callbacks } = arg;
    const { dispatch, getState } = thunkAPI;
    const { movementInfo, avgTaxiVisible } = getState().mvtMsgModal;
    dispatch((0, exports.updateMvtMsg)());
    notifications_1.NotificationCreator.removeAll({ dispatch });
    if (!movementInfo) {
        dispatch((0, exports.updateMvtMsgFailure)({ updateValidationErrors: [] }));
        return;
    }
    try {
        // API呼び出し
        const param = getPostRequestParams(formValues, movementInfo, avgTaxiVisible);
        await webApi_1.WebApi.postMvtMsg(dispatch, param, callbacks);
        // updateMvtMsgSuccess()はwebApi側で実行する
    }
    catch (err) {
        let updateValidationErrors = [];
        if (err instanceof webApi_1.ApiError && err.response) {
            // 422（バリデーション）エラーの場合、エラーメッセージを表示する
            if (err.response.status === 422) {
                const data = err.response.data || null;
                if (data && data.errors) {
                    data.errors.forEach((error) => {
                        updateValidationErrors = updateValidationErrors.concat(error.errorItems);
                        // メッセージを表示
                        error.errorMessages.forEach((errorText) => {
                            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50029C({ title: "", errorText }) });
                        });
                    });
                    // 赤枠表示する項目を保持する
                    updateValidationErrors = (0, lodash_1.uniq)(updateValidationErrors);
                }
            }
        }
        dispatch((0, exports.updateMvtMsgFailure)({ updateValidationErrors }));
    }
});
/**
 * 便動態発信画面の初期値を取得する
 */
const getInitialFormValue = (mvtMsgInfo, account) => {
    const isDomestic = mvtMsgInfo.intDomCat === "D";
    const formValues = {
        mvtMsgRadioButton: "",
        depInfo: getInitDepInfo(mvtMsgInfo, isDomestic),
        arrInfo: getInitArrInfo(mvtMsgInfo, isDomestic),
        gtbInfo: getInitGtbInfo(mvtMsgInfo),
        atbInfo: getInitAtbInfo(mvtMsgInfo, isDomestic),
        divInfo: getInitDivInfo(mvtMsgInfo, isDomestic),
        msgInfo: getInitMsgInfo(account),
    };
    return setCalcArrDlyInfo(formValues, mvtMsgInfo); // コンポーネント側でも使い回す為、自動計算処理はformValuesを使用する
};
const getInitDepInfo = (mvtMsgInfo, isDomestic) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return ({
        msgFlg: mvtMsgInfo.depMvtMsgFlg,
        cnlCheckBox: false,
        std: convertResponseTime(isDomestic, mvtMsgInfo.stdUtc),
        atd: convertResponseTime(isDomestic, mvtMsgInfo.atdUtc),
        actTo: convertResponseTime(isDomestic, mvtMsgInfo.actToUtc),
        eft: (0, commonUtil_1.convertTimeToHhmm)(mvtMsgInfo.eft),
        depDlyTime1: (0, commonUtil_1.convertTimeToHhmm)((_b = (_a = mvtMsgInfo.depDlyInfo) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.depDlyTime),
        depDlyTime2: (0, commonUtil_1.convertTimeToHhmm)((_d = (_c = mvtMsgInfo.depDlyInfo) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.depDlyTime),
        depDlyTime3: (0, commonUtil_1.convertTimeToHhmm)((_f = (_e = mvtMsgInfo.depDlyInfo) === null || _e === void 0 ? void 0 : _e[2]) === null || _f === void 0 ? void 0 : _f.depDlyTime),
        depDlyRsnCd1: (_j = (_h = (_g = mvtMsgInfo.depDlyInfo) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.depDlyRsnCd) !== null && _j !== void 0 ? _j : "",
        depDlyRsnCd2: (_m = (_l = (_k = mvtMsgInfo.depDlyInfo) === null || _k === void 0 ? void 0 : _k[1]) === null || _l === void 0 ? void 0 : _l.depDlyRsnCd) !== null && _m !== void 0 ? _m : "",
        depDlyRsnCd3: (_q = (_p = (_o = mvtMsgInfo.depDlyInfo) === null || _o === void 0 ? void 0 : _o[2]) === null || _p === void 0 ? void 0 : _p.depDlyRsnCd) !== null && _q !== void 0 ? _q : "",
        takeOffFuel: mvtMsgInfo.takeOffFuel,
    });
};
const getInitArrInfo = (mvtMsgInfo, isDomestic) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return ({
        msgFlg: mvtMsgInfo.arrMvtMsgFlg,
        cnlCheckBox: false,
        sta: mvtMsgInfo.irrSts !== "ATB" && mvtMsgInfo.irrSts !== "DIV" ? convertResponseTime(isDomestic, mvtMsgInfo.staUtc) : "",
        actLd: convertResponseTime(isDomestic, mvtMsgInfo.actLdUtc),
        ata: convertResponseTime(isDomestic, mvtMsgInfo.ataUtc),
        fuelRemain: mvtMsgInfo.fuelRemain || mvtMsgInfo.fuelRemain === 0 ? mvtMsgInfo.fuelRemain.toString() : "",
        arrDlyTime1: (0, commonUtil_1.convertTimeToHhmm)((_b = (_a = mvtMsgInfo.arrDlyInfo) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.arrDlyTime),
        arrDlyTime2: (0, commonUtil_1.convertTimeToHhmm)((_d = (_c = mvtMsgInfo.arrDlyInfo) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.arrDlyTime),
        arrDlyTime3: (0, commonUtil_1.convertTimeToHhmm)((_f = (_e = mvtMsgInfo.arrDlyInfo) === null || _e === void 0 ? void 0 : _e[2]) === null || _f === void 0 ? void 0 : _f.arrDlyTime),
        arrDlyRsnCd1: (_j = (_h = (_g = mvtMsgInfo.arrDlyInfo) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.arrDlyRsnCd) !== null && _j !== void 0 ? _j : "",
        arrDlyRsnCd2: (_m = (_l = (_k = mvtMsgInfo.arrDlyInfo) === null || _k === void 0 ? void 0 : _k[1]) === null || _l === void 0 ? void 0 : _l.arrDlyRsnCd) !== null && _m !== void 0 ? _m : "",
        arrDlyRsnCd3: (_q = (_p = (_o = mvtMsgInfo.arrDlyInfo) === null || _o === void 0 ? void 0 : _o[2]) === null || _p === void 0 ? void 0 : _p.arrDlyRsnCd) !== null && _q !== void 0 ? _q : "",
        windFactor: mvtMsgInfo.windFactor,
    });
};
const getInitGtbInfo = (mvtMsgInfo) => ({
    msgFlg: mvtMsgInfo.irrSts === "GTB",
    cnlCheckBox: false,
});
const getInitAtbInfo = (mvtMsgInfo, isDomestic) => ({
    msgFlg: mvtMsgInfo.irrSts === "ATB",
    cnlCheckBox: false,
    atbEta: convertResponseTime(isDomestic, mvtMsgInfo.irrSts === "ATB" ? (mvtMsgInfo.tentativeEstLdUtc ? mvtMsgInfo.tentativeEstLdUtc : mvtMsgInfo.estLdUtc) : ""),
});
const getInitDivInfo = (mvtMsgInfo, isDomestic) => ({
    msgFlg: mvtMsgInfo.irrSts === "DIV",
    cnlCheckBox: false,
    divEta: convertResponseTime(isDomestic, mvtMsgInfo.irrSts === "DIV" ? (mvtMsgInfo.tentativeEstLdUtc ? mvtMsgInfo.tentativeEstLdUtc : mvtMsgInfo.estLdUtc) : ""),
    lstArrApoCd: mvtMsgInfo.irrSts === "DIV" ? mvtMsgInfo.lstArrApoCd : "",
});
const getInitMsgInfo = (account) => ({
    priority: "QU",
    dtg: getCurrentUtcTimeInDdhhmm(),
    originator: account.jobAuth.user.ttyAddr,
    remarks: "",
    ttyAddressList: [account.jobAuth.user.ttyAddr],
});
/**
 * UTCの現在時刻を取得する。
 */
const getCurrentUtcTimeInDdhhmm = () => {
    const now = new Date();
    return [now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes()].map((num) => num.toString().padStart(2, "0")).join("");
};
const convertResponseTime = (isDomestic, utcTime) => {
    if (!(0, dayjs_1.default)(utcTime).isValid()) {
        return "";
    }
    return isDomestic ? dayjs_1.default.utc(utcTime).tz("Asia/Tokyo").format("YYYY-MM-DDTHH:mm:ss") : utcTime;
};
const convertRequestTime = (isDomestic, time) => {
    if (!(0, dayjs_1.default)(time).isValid()) {
        return "";
    }
    return isDomestic ? dayjs_1.default.tz(time, "Asia/Tokyo").utc().format("YYYY-MM-DDTHH:mm:ss") : time;
};
/** 初期表示時のARR DLY自動計算対象の場合、ARR DLY自動計算結果を設定する */
const setCalcArrDlyInfo = (formValues, mvtMsgInfo) => {
    if (isEligibleInitArrDlyCalc(mvtMsgInfo)) {
        const arrDlyInfo = (0, exports.getArrDlyInfo)(formValues, mvtMsgInfo);
        if (arrDlyInfo) {
            return {
                formValues: {
                    ...formValues,
                    arrInfo: {
                        ...formValues.arrInfo,
                        arrDlyTime1: arrDlyInfo.arrDlyTime1,
                        arrDlyTime2: arrDlyInfo.arrDlyTime2,
                        arrDlyTime3: arrDlyInfo.arrDlyTime3,
                        arrDlyRsnCd1: arrDlyInfo.arrDlyRsnCd1,
                        arrDlyRsnCd2: arrDlyInfo.arrDlyRsnCd2,
                        arrDlyRsnCd3: arrDlyInfo.arrDlyRsnCd3,
                    },
                },
                noArrDlyInfo: false,
            };
        }
    }
    return { formValues, noArrDlyInfo: true };
};
/** 初期表示時のARR DLY計算対象かを取得する */
const isEligibleInitArrDlyCalc = (mvtMsgInfo) => checkMvtForInitArrDlyCalc(mvtMsgInfo) && checkTaxiingTimeExists(mvtMsgInfo.taxiingTimeMin);
/** Taxiing時間を取得できているかを確認する */
const checkTaxiingTimeExists = (taxiingTime) => typeof taxiingTime === "number";
/** 初期表示時のARR DLY計算対象に該当するか動態情報をチェックする */
const checkMvtForInitArrDlyCalc = (mvtMsgInfo) => {
    const { legCreRsnCd, depMvtMsgFlg, arrMvtMsgFlg, staUtc, ataUtc, stdUtc, orgStdUtc, irrSts } = mvtMsgInfo;
    const mvtCondition = depMvtMsgFlg && !arrMvtMsgFlg && irrSts !== "DIV" && irrSts !== "ATB";
    const ataCondition = (0, dayjs_1.default)(ataUtc).isValid();
    const staCondition = (0, dayjs_1.default)(staUtc).isValid();
    const stdCondition = (0, dayjs_1.default)(stdUtc).isValid() || (legCreRsnCd === "RCV" && (0, dayjs_1.default)(orgStdUtc).isValid());
    return mvtCondition && ataCondition && staCondition && stdCondition;
};
/** ARR DLY 自動計算処理 */
const getArrDlyInfo = (formValues, mvtMsgInfo, latestTaxiingTime) => {
    const { depInfo: { std, atd, actTo }, arrInfo: { sta, ata }, } = formValues;
    const { orgAtdUtc, orgStdUtc, orgToUtc, stdUtc, taxiingTimeMin } = mvtMsgInfo;
    const taxiingTime = latestTaxiingTime || taxiingTimeMin;
    if (typeof taxiingTime !== "number")
        return null;
    const moStd = (0, dayjs_1.default)(!(0, dayjs_1.default)(stdUtc).isValid() ? orgStdUtc : std);
    const moAtd = (0, dayjs_1.default)(!(0, dayjs_1.default)(stdUtc).isValid() ? orgAtdUtc : atd);
    const moTo = (0, dayjs_1.default)(!(0, dayjs_1.default)(stdUtc).isValid() ? orgToUtc : actTo);
    const moSta = (0, dayjs_1.default)(sta);
    const moAta = (0, dayjs_1.default)(ata);
    const arrDlyTime = Math.max(0, moAta.diff(moSta, "minute"));
    const roTime = Math.min(arrDlyTime, Math.max(0, moAtd.diff(moStd, "minute")));
    const rdTime = Math.min(arrDlyTime - roTime, Math.max(0, moTo.diff(moAtd, "minute") - taxiingTime));
    const otherDlyTime = Math.max(0, arrDlyTime - roTime - rdTime);
    const arrDlyInfo = {
        arrDlyTime1: "",
        arrDlyTime2: "",
        arrDlyTime3: "",
        arrDlyRsnCd1: "",
        arrDlyRsnCd2: "",
        arrDlyRsnCd3: "",
    };
    if (arrDlyTime > 0) {
        const delayDetails = [];
        if (roTime > 0) {
            const roTimeHhmm = convertMinToHHMM(roTime);
            if (roTimeHhmm > 9959)
                return null;
            delayDetails.push({ code: "RO", time: roTimeHhmm });
        }
        if (rdTime > 0) {
            const rdTimeHhmm = convertMinToHHMM(rdTime);
            if (rdTimeHhmm > 9959)
                return null;
            delayDetails.push({ code: "RD", time: rdTimeHhmm });
        }
        if (otherDlyTime > 0) {
            const otherDlyTimeHhmm = convertMinToHHMM(otherDlyTime);
            if (otherDlyTimeHhmm > 9959)
                return null;
            delayDetails.push({ code: "RQ", time: otherDlyTimeHhmm });
        }
        delayDetails.forEach((detail, index) => {
            arrDlyInfo[`arrDlyTime${index + 1}`] = (0, commonUtil_1.convertTimeToHhmm)(detail.time);
            arrDlyInfo[`arrDlyRsnCd${index + 1}`] = detail.code;
        });
    }
    return arrDlyInfo;
};
exports.getArrDlyInfo = getArrDlyInfo;
/** 初期表示時のAVG TAXI情報の非表示状態を取得する */
const getInitialAvgTaxiInfoHidden = (movementInfo, noArrDlyInfo) => {
    const { depMvtMsgFlg, arrMvtMsgFlg, staUtc, ataUtc, taxiingTimeMin, prevTaxiingTimeMin } = movementInfo;
    const staDayjs = (0, dayjs_1.default)(staUtc);
    const ataDayjs = (0, dayjs_1.default)(ataUtc);
    const noDepMvtMsg = !depMvtMsgFlg;
    const isAtbOrDivCondition = isAtbOrDiv(movementInfo);
    const noLatestTaxiTime = checkMvtForInitArrDlyCalc(movementInfo) ? taxiingTimeMin === null : false;
    const valCondition = !staDayjs.isValid() || !ataDayjs.isValid();
    const noArrDly = valCondition || staDayjs >= ataDayjs;
    const noAutoCalcArrDly = arrMvtMsgFlg && prevTaxiingTimeMin === null;
    return noDepMvtMsg || isAtbOrDivCondition || noLatestTaxiTime || valCondition || noArrDly || noAutoCalcArrDly || noArrDlyInfo;
};
/** ATBもしくはDIV中かどうかを判定する */
const isAtbOrDiv = (movementInfo) => {
    const { irrSts } = movementInfo;
    return irrSts === "ATB" || irrSts === "DIV";
};
/** 分形式をHHmm形式に変換する */
const convertMinToHHMM = (num) => {
    const hours = Math.floor(num / 60);
    const minutes = num % 60;
    return hours * 100 + minutes;
};
/** postリクエストパラメータ生成 */
const getPostRequestParams = (formValues, movementInfo, avgTaxiVisible) => {
    const isDomestic = movementInfo.intDomCat === "D";
    return {
        funcId: "S10603C",
        legKey: movementInfo.legKey,
        actionCd: formValues.mvtMsgRadioButton,
        cnlFlg: getCnlFlg(formValues),
        seatConfCd: movementInfo.seatConfCd,
        ccCnt: movementInfo.ccCnt,
        caCnt: movementInfo.caCnt,
        dhCcCnt: movementInfo.dhCcCnt,
        dhCaCnt: movementInfo.dhCaCnt,
        actPaxTtl: movementInfo.actPaxTtl,
        atdUtc: convertRequestTime(isDomestic, formValues.depInfo.atd),
        actToUtc: convertRequestTime(isDomestic, formValues.depInfo.actTo),
        depDlyInfo: convertToPostDepDlyInfo(formValues),
        eft: movementInfo.eft,
        takeOffFuel: movementInfo.takeOffFuel,
        actLdUtc: convertRequestTime(isDomestic, formValues.arrInfo.actLd),
        ataUtc: convertRequestTime(isDomestic, formValues.arrInfo.ata),
        arrDlyInfo: convertToPostArrDlyInfo(formValues),
        windFactor: formValues.arrInfo.windFactor,
        prevMvtDepApoCd: avgTaxiVisible ? movementInfo.lstDepApoCd : null,
        taxiingTimeMin: avgTaxiVisible ? movementInfo.taxiingTimeMin : null,
        fuelRemain: formValues.arrInfo.fuelRemain ? Number(formValues.arrInfo.fuelRemain) : null,
        estLdUtc: convertRequestTime(isDomestic, formValues.mvtMsgRadioButton === "ATB"
            ? formValues.atbInfo.atbEta
            : formValues.mvtMsgRadioButton === "DIV"
                ? formValues.divInfo.divEta
                : ""),
        lstArrApoCd: formValues.mvtMsgRadioButton === "ATB"
            ? movementInfo.legKey.skdDepApoCd
            : formValues.mvtMsgRadioButton === "DIV"
                ? formValues.divInfo.lstArrApoCd
                : "",
        ttyPriorityCd: formValues.msgInfo.priority,
        dtg: (0, dayjs_1.default)((0, commonUtil_1.convertDDHHmmToDate)(movementInfo.legKey.orgDateLcl, formValues.msgInfo.dtg)).format("YYYY-MM-DDTHH:mm:ss"),
        originator: formValues.msgInfo.originator,
        remarks: formValues.msgInfo.remarks,
        ttyAddrList: formValues.msgInfo.ttyAddressList,
    };
};
const convertToPostDepDlyInfo = (formValue) => {
    const { depInfo } = formValue;
    const depDlyInfo = [];
    if (!depInfo.std || (depInfo.std && depInfo.atd && depInfo.std < depInfo.atd)) {
        if (!Number.isNaN(Number(depInfo.depDlyTime1)) && depInfo.depDlyRsnCd1) {
            depDlyInfo.push({
                depDlyTime: Number(depInfo.depDlyTime1),
                depDlyRsnCd: depInfo.depDlyRsnCd1,
            });
        }
        if (!Number.isNaN(Number(depInfo.depDlyTime2)) && depInfo.depDlyRsnCd2) {
            depDlyInfo.push({
                depDlyTime: Number(depInfo.depDlyTime2),
                depDlyRsnCd: depInfo.depDlyRsnCd2,
            });
        }
        if (!Number.isNaN(Number(depInfo.depDlyTime3)) && depInfo.depDlyRsnCd3) {
            depDlyInfo.push({
                depDlyTime: Number(depInfo.depDlyTime3),
                depDlyRsnCd: depInfo.depDlyRsnCd3,
            });
        }
    }
    depDlyInfo.sort((a, b) => {
        if (a.depDlyTime !== b.depDlyTime) {
            return b.depDlyTime - a.depDlyTime;
        }
        return a.depDlyRsnCd.localeCompare(b.depDlyRsnCd);
    });
    return depDlyInfo;
};
const convertToPostArrDlyInfo = (formValue) => {
    const { arrInfo } = formValue;
    const arrDlyInfo = [];
    if (!arrInfo.sta || (arrInfo.sta && arrInfo.ata && arrInfo.sta < arrInfo.ata)) {
        if (!Number.isNaN(Number(arrInfo.arrDlyTime1)) && arrInfo.arrDlyRsnCd1) {
            arrDlyInfo.push({
                arrDlyTime: Number(arrInfo.arrDlyTime1),
                arrDlyRsnCd: arrInfo.arrDlyRsnCd1,
            });
        }
        if (!Number.isNaN(Number(arrInfo.arrDlyTime2)) && arrInfo.arrDlyRsnCd2) {
            arrDlyInfo.push({
                arrDlyTime: Number(arrInfo.arrDlyTime2),
                arrDlyRsnCd: arrInfo.arrDlyRsnCd2,
            });
        }
        if (!Number.isNaN(Number(arrInfo.arrDlyTime3)) && arrInfo.arrDlyRsnCd3) {
            arrDlyInfo.push({
                arrDlyTime: Number(arrInfo.arrDlyTime3),
                arrDlyRsnCd: arrInfo.arrDlyRsnCd3,
            });
        }
    }
    arrDlyInfo.sort((a, b) => {
        if (a.arrDlyTime !== b.arrDlyTime) {
            return b.arrDlyTime - a.arrDlyTime;
        }
        return a.arrDlyRsnCd.localeCompare(b.arrDlyRsnCd);
    });
    return arrDlyInfo;
};
const getCnlFlg = (formValues) => {
    switch (formValues.mvtMsgRadioButton) {
        case "DEP":
            return formValues.depInfo.cnlCheckBox;
        case "ARR":
            return formValues.arrInfo.cnlCheckBox;
        case "GTB":
            return formValues.gtbInfo.cnlCheckBox;
        case "ATB":
            return formValues.atbInfo.cnlCheckBox;
        case "DIV":
            return formValues.divInfo.cnlCheckBox;
        default:
            return false;
    }
};
exports.showMessage = (0, toolkit_1.createAsyncThunk)("mvtMsgModal/showMessage", (arg, thunkAPI) => {
    const { message } = arg;
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message });
});
/**
 * フォームの項目とサーバーから返却されるエラー項目を紐付ける
 * (フォームの項目): [サーバーの項目, ..]
 */
exports.serverErrorItems = {
    "depInfo.msgFlg": ["depMvtMsgFlg"],
    "depInfo.cnlCheckBox": ["depInfo.cnlCheckBox"],
    "depInfo.std": ["stdUtc"],
    "depInfo.atd": ["atdUtc"],
    "depInfo.actTo": ["actToUtc"],
    "depInfo.eft": ["eft"],
    "depInfo.depDlyTime1": ["depDlyInfo", "depDlyTime"],
    "depInfo.depDlyTime2": ["depDlyInfo", "depDlyTime"],
    "depInfo.depDlyTime3": ["depDlyInfo", "depDlyTime"],
    "depInfo.depDlyRsnCd1": ["depDlyInfo", "depDlyRsnCd"],
    "depInfo.depDlyRsnCd2": ["depDlyInfo", "depDlyRsnCd"],
    "depInfo.depDlyRsnCd3": ["depDlyInfo", "depDlyRsnCd"],
    "depInfo.takeOffFuel": ["takeOffFuel"],
    "arrInfo.msgFlg": ["arrMvtMsgFlg"],
    "arrInfo.cnlCheckBox": ["arrInfo.cnlCheckBox"],
    "arrInfo.sta": ["staUtc"],
    "arrInfo.actLd": ["actLdUtc"],
    "arrInfo.ata": ["ataUtc"],
    "arrInfo.fuelRemain": ["fuelRemain"],
    "arrInfo.arrDlyTime1": ["arrDlyInfo", "arrDlyTime"],
    "arrInfo.arrDlyTime2": ["arrDlyInfo", "arrDlyTime"],
    "arrInfo.arrDlyTime3": ["arrDlyInfo", "arrDlyTime"],
    "arrInfo.arrDlyTime4": ["arrDlyInfo", "arrDlyTime"],
    "arrInfo.arrDlyRsnCd1": ["arrDlyInfo", "arrDlyRsnCd"],
    "arrInfo.arrDlyRsnCd2": ["arrDlyInfo", "arrDlyRsnCd"],
    "arrInfo.arrDlyRsnCd3": ["arrDlyInfo", "arrDlyRsnCd"],
    "arrInfo.arrDlyRsnCd4": ["arrDlyInfo", "arrDlyRsnCd"],
    "arrInfo.avgTaxiApoCd": ["prevMvtDepApoCd", "lstDepApoCd"],
    "arrInfo.avgTaxiTime": ["prevTaxiingTimeMin"],
    "arrInfo.windFactor": ["windFactor"],
    "gtbInfo.msgFlg": ["irrSts"],
    "gtbInfo.cnlCheckBox": ["gtbInfo.cnlCheckBox"],
    "atbInfo.msgFlg": ["irrSts"],
    "atbInfo.cnlCheckBox": ["atbInfo.cnlCheckBox"],
    "atbInfo.atbEta": ["tentativeEstLdUtc", "estLdUtc"],
    "divInfo.msgFlg": ["irrSts"],
    "divInfo.cnlCheckBox": ["divInfo.cnlCheckBox"],
    "divInfo.divEta": ["tentativeEstLdUtc", "estLdUtc"],
    "divInfo.lstArrApoCd": ["lstArrApoCd"],
    "msgInfo.priority": ["priority"],
    "msgInfo.dtg": ["dtg"],
    "msgInfo.originator": ["originator"],
    "msgInfo.remarks": ["remarks"],
    "msgInfo.ttyAddressList": ["ttyAddressList"],
};
const initialState = {
    isOpen: false,
    isFetching: false,
    avgTaxiVisible: false,
    movementInfo: undefined,
    initialFormValue: {
        mvtMsgRadioButton: "",
        depInfo: {
            msgFlg: false,
            cnlCheckBox: false,
            std: "",
            atd: "",
            actTo: "",
            eft: "",
            depDlyTime1: "",
            depDlyTime2: "",
            depDlyTime3: "",
            depDlyRsnCd1: "",
            depDlyRsnCd2: "",
            depDlyRsnCd3: "",
            takeOffFuel: null,
        },
        arrInfo: {
            msgFlg: false,
            cnlCheckBox: false,
            sta: "",
            actLd: "",
            ata: "",
            fuelRemain: "",
            arrDlyTime1: "",
            arrDlyTime2: "",
            arrDlyTime3: "",
            arrDlyRsnCd1: "",
            arrDlyRsnCd2: "",
            arrDlyRsnCd3: "",
            windFactor: "",
        },
        gtbInfo: {
            msgFlg: false,
            cnlCheckBox: false,
        },
        atbInfo: {
            msgFlg: false,
            cnlCheckBox: false,
            atbEta: "",
        },
        divInfo: {
            msgFlg: false,
            cnlCheckBox: false,
            divEta: "",
            lstArrApoCd: "",
        },
        msgInfo: {
            priority: "QU",
            dtg: "",
            originator: "",
            remarks: "",
            ttyAddressList: [],
        },
    },
    updateValidationErrors: [],
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "mvtMsgModal",
    initialState,
    reducers: {
        closeMvtMsgModal: (state) => {
            Object.assign(state, initialState);
        },
        fetchMvtMsg: (state) => {
            state.isOpen = true;
            state.isFetching = true;
        },
        fetchMvtMsgSuccess: (state, action) => {
            const { movementInfo, formValues } = action.payload;
            state.isOpen = true;
            state.isFetching = false;
            state.movementInfo = movementInfo;
            state.initialFormValue = formValues;
            state.updateValidationErrors = [];
        },
        fetchMvtMsgReCalcSuccess: (state, action) => {
            const { movementInfo } = action.payload;
            state.isOpen = true;
            state.isFetching = false;
            if (state.movementInfo) {
                state.movementInfo.taxiingTimeMin = movementInfo.taxiingTimeMin;
                state.movementInfo.prevMvtDepApoCd = state.movementInfo.legKey.skdDepApoCd;
            }
        },
        fetchMvtMsgFailure: (state) => {
            Object.assign(state, initialState);
        },
        fetchMvtMsgReCalcFailure: (state) => {
            state.isFetching = false;
        },
        updateMvtMsg: (state) => {
            state.isFetching = true;
        },
        updateMvtMsgSuccess: (state) => {
            Object.assign(state, initialState);
        },
        updateMvtMsgFailure: (state, action) => {
            const { updateValidationErrors } = action.payload;
            state.isFetching = false;
            state.updateValidationErrors = updateValidationErrors;
        },
        setAvgTaxiTime: (state, action) => {
            const { taxiingTimeMin } = action.payload;
            if (state.movementInfo) {
                state.movementInfo.taxiingTimeMin = taxiingTimeMin;
            }
        },
        setPrevMvtDepApo: (state, action) => {
            const { prevMvtDepApoCd } = action.payload;
            if (state.movementInfo) {
                state.movementInfo.prevMvtDepApoCd = prevMvtDepApoCd;
            }
        },
        setAvgTaxiVisible: (state, action) => {
            const { avgTaxiVisible } = action.payload;
            state.avgTaxiVisible = avgTaxiVisible;
        },
    },
});
_a = exports.slice.actions, exports.closeMvtMsgModal = _a.closeMvtMsgModal, exports.fetchMvtMsg = _a.fetchMvtMsg, exports.fetchMvtMsgSuccess = _a.fetchMvtMsgSuccess, exports.fetchMvtMsgReCalcSuccess = _a.fetchMvtMsgReCalcSuccess, exports.fetchMvtMsgFailure = _a.fetchMvtMsgFailure, exports.fetchMvtMsgReCalcFailure = _a.fetchMvtMsgReCalcFailure, exports.updateMvtMsg = _a.updateMvtMsg, exports.updateMvtMsgSuccess = _a.updateMvtMsgSuccess, exports.updateMvtMsgFailure = _a.updateMvtMsgFailure, exports.setAvgTaxiTime = _a.setAvgTaxiTime, exports.setPrevMvtDepApo = _a.setPrevMvtDepApo, exports.setAvgTaxiVisible = _a.setAvgTaxiVisible;
exports.default = exports.slice.reducer;
//# sourceMappingURL=mvtMsgModal.js.map