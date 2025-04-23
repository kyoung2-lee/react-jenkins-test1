"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.focusToMultipleFlightMovement = exports.openMultipleFlightMovement = exports.clearMultipleFlightMovement = exports.slice = exports.updateMultipleFlightMovement = exports.valueChanged = exports.copySkdToEtd = exports.plusMinusEtd = exports.plusMinusEtaLd = exports.closeMultipleFlightMovement = exports.fetchMultipleFlightMovement = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const dayjs_1 = __importDefault(require("dayjs"));
const redux_form_1 = require("redux-form");
const lodash_uniq_1 = __importDefault(require("lodash.uniq"));
const lodash_difference_1 = __importDefault(require("lodash.difference"));
const notifications_1 = require("../lib/notifications");
const webApi_1 = require("../lib/webApi");
const soalaMessages_1 = require("../lib/soalaMessages");
// eslint-disable-next-line import/no-cycle
const common_1 = require("./common");
const commonUtil_1 = require("../lib/commonUtil");
// eslint-disable-next-line import/no-cycle
const MultipleFlightMovementModalArr_1 = require("../components/organisms/MultipleFlightMovement/MultipleFlightMovementModalArr");
// eslint-disable-next-line import/no-cycle
const MultipleFlightMovementModalDep_1 = require("../components/organisms/MultipleFlightMovement/MultipleFlightMovementModalDep");
const FlightMovementType_1 = require("../components/organisms/FlightMovementModal/FlightMovementType");
exports.fetchMultipleFlightMovement = (0, toolkit_1.createAsyncThunk)("multipleFlightMovement/fetchMultipleFlightMovement", async (arg, thunkAPI) => {
    const { loadLegList, isDep } = arg;
    const { dispatch, getState } = thunkAPI;
    if (getState().flightModals.modals.filter((modal) => modal.opened).length +
        getState().flightListModals.modals.filter((modal) => modal.opened).length <=
        0) {
        dispatch((0, common_1.initDate)());
    }
    const { apoCd } = isDep ? getState().multipleFlightMovementModals.modalDep : getState().multipleFlightMovementModals.modalArr;
    const formName = isDep ? MultipleFlightMovementModalDep_1.formName : MultipleFlightMovementModalArr_1.formName;
    dispatch(exports.slice.actions.fetchMultipleFlightMovementStart({ isDep }));
    dispatch((0, redux_form_1.reset)(formName));
    for (let index = 0; index < loadLegList.length; index++) {
        // 同期処理したいのでforeach()ではなくfor文にしている
        const loadLeg = loadLegList[index];
        const { legKey, isOal, arrOrgApoCd, depDstApoCd } = loadLeg;
        const onlineDbExpDays = isOal ? getState().account.master.oalOnlineDbExpDays : getState().account.master.onlineDbExpDays;
        const params = { ...legKey, funcId: "S10604C", onlineDbExpDays };
        try {
            let movementInfo;
            const onError = () => {
                void dispatch((0, exports.closeMultipleFlightMovement)({ isDep }));
            };
            const callbacks = {
                onSystemError: onError,
                onNetworkError: onError,
            };
            if (isOal) {
                // eslint-disable-next-line no-await-in-loop
                const responseOal = await webApi_1.WebApi.getOalFlightMovement(dispatch, params, callbacks);
                const { oal2Legkey, ...responseArg } = responseOal.data;
                movementInfo = { ...responseArg, legkey: oal2Legkey };
            }
            else {
                // eslint-disable-next-line no-await-in-loop
                const response = await webApi_1.WebApi.getFlightMovement(dispatch, params, callbacks);
                movementInfo = response.data;
            }
            const rowFormValues = convertToMovementInfoForm({ index, isDep, apoCd, movementInfo, isOal, arrOrgApoCd, depDstApoCd });
            const rowStatus = { status: null, updateValidationErrors: [] };
            dispatch(exports.slice.actions.fetchMultipleFlightMovementRow({ isDep, movementInfo, rowFormValues, rowStatus }));
            dispatch((0, redux_form_1.arrayPush)(formName, "rows", rowFormValues)); // フォームデータに設定
        }
        catch (err) {
            if (!(err instanceof webApi_1.ApiError)) {
                console.error(err.message);
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50021C() });
            }
            break;
        }
    }
    dispatch(exports.slice.actions.fetchMultipleFlightMovementEnd({ isDep }));
});
exports.closeMultipleFlightMovement = (0, toolkit_1.createAsyncThunk)("multipleFlightMovement/closeMultipleFlightMovement", (arg, thunkAPI) => {
    const { isDep } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.close({ isDep }));
    const formName = isDep ? MultipleFlightMovementModalDep_1.formName : MultipleFlightMovementModalArr_1.formName;
    // データを時間で差消すのは閉じる際のアニメーションがあるため
    setTimeout(() => {
        dispatch(exports.slice.actions.clearData({ isDep }));
        dispatch((0, redux_form_1.reset)(formName));
    }, 300);
});
const checkHHmmFormat = (value) => /^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/.test(value);
exports.plusMinusEtaLd = (0, toolkit_1.createAsyncThunk)("multipleFlightMovement/plusMinusEtaLd", ({ rowIndex, isPlus }, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { rows } = (0, redux_form_1.getFormValues)(MultipleFlightMovementModalArr_1.formName)(getState());
    const { etaLd } = rows[rowIndex].arrInfo;
    if (checkHHmmFormat(etaLd)) {
        const currentDate = (0, dayjs_1.default)();
        const dateWithTime = (0, dayjs_1.default)(`${currentDate.format("YYYY-MM-DD")}T${etaLd.slice(0, 2)}:${etaLd.slice(2, 4)}`);
        if (dateWithTime.isValid()) {
            let count = -1;
            if (isPlus)
                count = 1;
            dispatch((0, redux_form_1.change)(MultipleFlightMovementModalArr_1.formName, `rows[${rowIndex}].arrInfo.etaLd`, dateWithTime.add(count, "minute").format("HHmm")));
            void dispatch((0, exports.valueChanged)({ isDep: false, rowIndex, fieldName: "arrInfo.etaLd" }));
        }
    }
});
exports.plusMinusEtd = (0, toolkit_1.createAsyncThunk)("multipleFlightMovement/plusMinusEtd", ({ rowIndex, isPlus }, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { rows } = (0, redux_form_1.getFormValues)(MultipleFlightMovementModalDep_1.formName)(getState());
    const { etd, std } = rows[rowIndex].depInfo;
    if (etd) {
        const workEtd = etd === "SKD" ? std : etd;
        if (checkHHmmFormat(workEtd)) {
            const currentDate = (0, dayjs_1.default)();
            const dateWithTime = (0, dayjs_1.default)(`${currentDate.format("YYYY-MM-DD")}T${workEtd.slice(0, 2)}:${workEtd.slice(2, 4)}`);
            if (dateWithTime.isValid()) {
                let count = -1;
                if (isPlus)
                    count = 1;
                dispatch((0, redux_form_1.change)(MultipleFlightMovementModalDep_1.formName, `rows[${rowIndex}].depInfo.etd`, dateWithTime.add(count, "minute").format("HHmm")));
                void dispatch((0, exports.valueChanged)({ isDep: true, rowIndex, fieldName: "depInfo.etd" }));
            }
        }
    }
});
exports.copySkdToEtd = (0, toolkit_1.createAsyncThunk)("multipleFlightMovement/copySkdToEtd", ({ rowIndex }, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch((0, redux_form_1.change)(MultipleFlightMovementModalDep_1.formName, `rows[${rowIndex}].depInfo.etd`, "SKD"));
    void dispatch((0, exports.valueChanged)({ isDep: true, rowIndex, fieldName: "depInfo.etd" }));
});
exports.valueChanged = (0, toolkit_1.createAsyncThunk)("multipleFlightMovement/valueChanged", ({ isDep, rowIndex, fieldName }, thunkAPI) => {
    const { dispatch, getState } = thunkAPI;
    const { modalDep, modalArr } = getState().multipleFlightMovementModals;
    const { rows } = (0, redux_form_1.getFormValues)(isDep ? MultipleFlightMovementModalDep_1.formName : MultipleFlightMovementModalArr_1.formName)(getState());
    const { rows: errorRows } = (0, redux_form_1.getFormSubmitErrors)(isDep ? MultipleFlightMovementModalDep_1.formName : MultipleFlightMovementModalArr_1.formName)(getState());
    const modal = isDep ? modalDep : modalArr;
    // サーバーのバリデーションでエラーとなった対象項目の赤枠を消す
    const errorItems = FlightMovementType_1.severErrorItems[fieldName];
    const updateValidationErrors = (0, lodash_difference_1.default)(modal.rowStatusList[rowIndex].updateValidationErrors, errorItems);
    if (errorRows && errorRows.length) {
        const fieledErrors = Object.entries(FlightMovementType_1.severErrorItems)
            .filter(([_key, values]) => values.some((value) => updateValidationErrors.includes(value)))
            .map(([key, _values]) => key);
        const newErrorRows = [...errorRows];
        newErrorRows[rowIndex] = getNestedProperties(fieledErrors, "Error");
        const errors = {
            rows: newErrorRows,
        };
        dispatch((0, redux_form_1.stopSubmit)(isDep ? MultipleFlightMovementModalDep_1.formName : MultipleFlightMovementModalArr_1.formName, errors));
    }
    // 変更されている場合は、Editedにする
    let status = null;
    const initialRow = modal.initialFormValues.rows[rowIndex];
    const row = rows[rowIndex];
    if (isDep) {
        if ((initialRow.fisFltSts || "") !== (row.fisFltSts || "") ||
            (initialRow.depInfo.etd || "") !== (row.depInfo.etd || "") ||
            (initialRow.depInfo.etdCd || "") !== (row.depInfo.etdCd || "")) {
            status = "Edited";
        }
    }
    else if ((initialRow.fisFltSts || "") !== (row.fisFltSts || "") ||
        (initialRow.arrInfo.etaLd || "") !== (row.arrInfo.etaLd || "") ||
        (initialRow.arrInfo.etaLdCd || "") !== (row.arrInfo.etaLdCd || "")) {
        status = "Edited";
    }
    dispatch(exports.slice.actions.writeMultipleFlightMovementData({ isDep, rowIndex, rowStatus: { status, updateValidationErrors } }));
});
/**
 * エラーメッセージのタイトルを作成する
 */
function getSoalaMessageTitle({ rowFormValues, movementInfo }) {
    const fltName = rowFormValues.casFltNo || (rowFormValues.alCd || "") + (rowFormValues.fltNo || "");
    return `${fltName}/${rowFormValues.orgDay} ${movementInfo.depInfo.lstDepApoCd}-${movementInfo.arrInfo.lstArrApoCd}`;
}
/**
 * 取得APIのレスポンスデータを画面用フォームデータに変換する
 */
function convertToMovementInfoForm({ index, isDep, apoCd, movementInfo, isOal, arrOrgApoCd, depDstApoCd, }) {
    const { fisFltSts, depInfo, arrInfo, legkey, legCnlFlg, irrSts } = movementInfo;
    const etdLcl = depInfo.tentativeEtdCd ? depInfo.tentativeEtdLcl : depInfo.etdLcl;
    const estLdLcl = arrInfo.tentativeEstLdCd ? arrInfo.tentativeEstLdLcl : arrInfo.estLdLcl;
    const { alCd, fltNo, casFltNo, orgDateLcl } = legkey;
    return {
        rowNo: index,
        timeStamp: Date.now(),
        isOal,
        legCnlFlg,
        isDivAtbOrgApo: !isDep && (irrSts === "DIV" || irrSts === "ATB") && apoCd !== arrInfo.lstArrApoCd,
        alCd,
        fltNo: (0, commonUtil_1.formatFltNo)(fltNo),
        casFltNo,
        orgDay: orgDateLcl ? (0, dayjs_1.default)(orgDateLcl).format("DD") : "",
        arrOrgApoCd,
        depDstApoCd,
        fisFltSts: fisFltSts || undefined,
        depInfo: {
            std: depInfo.stdLcl ? (0, dayjs_1.default)(depInfo.stdLcl).format("HHmm") : "",
            etd: etdLcl ? (0, dayjs_1.default)(etdLcl).format("HHmm") : "",
            etdCd: depInfo.tentativeEtdCd || undefined, // SelectBoxでClearするとundefinedになるので初期値もundefinedにする
        },
        arrInfo: {
            sta: movementInfo.irrSts !== "ATB" && movementInfo.irrSts !== "DIV" && arrInfo.staLcl ? (0, dayjs_1.default)(arrInfo.staLcl).format("HHmm") : "",
            etaLd: estLdLcl ? (0, dayjs_1.default)(estLdLcl).format("HHmm") : "",
            etaLdCd: arrInfo.tentativeEstLdCd || undefined, // SelectBoxでClearするとundefinedになるので初期値もundefinedにする
        },
    };
}
function formatHHmmToDateTime(HHmm, currentDateWithTimeDiff) {
    if (!HHmm || HHmm.length !== 4)
        return "";
    const addDays = currentDateWithTimeDiff.format("HHmm") <= HHmm ? 0 : 1;
    return currentDateWithTimeDiff
        .add(addDays, "day")
        .hour(parseInt(HHmm.slice(0, 2), 10))
        .minute(parseInt(HHmm.slice(2, 4), 10))
        .second(0)
        .format("YYYY-MM-DD[T]HH:mm:ss");
}
/**
 * 画面用フォームデータを更新APIのリクエストのDepInfoに変換する
 */
function convertToPostMovementDepInfo({ rowFormValues, movementInfo, currentDateWithTimeDiff, }) {
    const { depInfo } = rowFormValues;
    const etd = depInfo.etd === "SKD" ? movementInfo.depInfo.stdLcl : formatHHmmToDateTime(depInfo.etd, currentDateWithTimeDiff);
    return {
        stdLcl: movementInfo.depInfo.stdLcl,
        etdLcl: depInfo.etdCd ? null : etd,
        tentativeEtdLcl: depInfo.etdCd ? etd : null,
        tentativeEtdCd: depInfo.etdCd ? depInfo.etdCd : null,
        atdLcl: movementInfo.depInfo.atdLcl,
        actToLcl: movementInfo.depInfo.actToLcl,
        depDlyInfo: movementInfo.depInfo.depDlyInfo,
        firstAtdLcl: movementInfo.depInfo.firstAtdLcl,
        returnInLcl: movementInfo.depInfo.returnInLcl,
        estReturnInLcl: movementInfo.depInfo.estReturnInLcl,
    };
}
/**
 * 画面用フォームデータを更新APIのリクエストのArrInfoに変換する
 */
function convertToPostMovementArrInfo({ rowFormValues, movementInfo, currentDateWithTimeDiff, }) {
    const { arrInfo } = rowFormValues;
    const etaLd = formatHHmmToDateTime(arrInfo.etaLd, currentDateWithTimeDiff);
    return {
        staLcl: movementInfo.arrInfo.staLcl,
        etaLcl: movementInfo.arrInfo.etaLcl,
        tentativeEtaLcl: movementInfo.arrInfo.tentativeEtaLcl,
        tentativeEtaCd: movementInfo.arrInfo.tentativeEtaCd,
        estBiLcl: movementInfo.arrInfo.estBiLcl,
        tentativeEstLdLcl: arrInfo.etaLdCd ? etaLd : null,
        tentativeEstLdCd: arrInfo.etaLdCd ? arrInfo.etaLdCd : null,
        estLdLcl: arrInfo.etaLdCd ? null : etaLd,
        actLdLcl: movementInfo.arrInfo.actLdLcl || "",
        ataLcl: movementInfo.arrInfo.ataLcl,
    };
}
/**
 * ドットで区切られた複数のStringのパスの情報からネストされたオブジェクトを生成する
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedProperties(paths, value) {
    return paths.reduce((result, path) => {
        const keys = path.split(".");
        let current = result;
        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                current[key] = current[key] || {};
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                current = current[key];
            }
        });
        return result;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {});
}
exports.updateMultipleFlightMovement = (0, toolkit_1.createAsyncThunk)("multipleFlightMovement/updateMultipleFlightMovement", async (arg, thunkAPI) => {
    const { isDep, formValues } = arg;
    const { dispatch, getState } = thunkAPI;
    const { movementInfoList, rowStatusList, apoCd, timeDiffUtc } = isDep
        ? getState().multipleFlightMovementModals.modalDep
        : getState().multipleFlightMovementModals.modalArr;
    const currentDateWithTimeDiff = (0, dayjs_1.default)()
        .utc()
        .add(Math.floor(timeDiffUtc / 100), "hour")
        .add(timeDiffUtc % 100, "minute");
    dispatch(exports.slice.actions.updateOalMultipleFlightMovement({ isDep }));
    let criticalErrorCaused = false;
    let errorCaused = false;
    const errorRows = [];
    const formName = isDep ? MultipleFlightMovementModalDep_1.formName : MultipleFlightMovementModalArr_1.formName;
    notifications_1.NotificationCreator.removeAll({ dispatch });
    try {
        for (let rowIndex = 0; rowIndex < formValues.rows.length; rowIndex++) {
            const rowFormValues = formValues.rows[rowIndex];
            const movementInfo = movementInfoList[rowIndex];
            const rowStatus = rowStatusList[rowIndex];
            const { isOal, arrOrgApoCd, depDstApoCd } = rowFormValues;
            errorRows.push({});
            if (rowStatus.status !== "Edited")
                continue;
            const depInfo = isDep ? convertToPostMovementDepInfo({ rowFormValues, movementInfo, currentDateWithTimeDiff }) : null;
            const arrInfo = !isDep ? convertToPostMovementArrInfo({ rowFormValues, movementInfo, currentDateWithTimeDiff }) : null;
            try {
                let newMovementInfo = null;
                if (isOal) {
                    // API呼び出し
                    // eslint-disable-next-line no-await-in-loop
                    const responseOal = await webApi_1.WebApi.postOalFlightMovement(dispatch, {
                        funcId: "S10604C",
                        oal2Legkey: movementInfo.legkey,
                        fisFltSts: rowFormValues.fisFltSts || "",
                        depInfo,
                        arrInfo,
                        dataOwnerCd: "SOALA",
                    }, undefined, false);
                    const { oal2Legkey, ...responseArg } = responseOal.data;
                    newMovementInfo = { ...responseArg, legkey: oal2Legkey };
                }
                else if (movementInfo.legkey) {
                    // API呼び出し
                    // eslint-disable-next-line no-await-in-loop
                    const response = await webApi_1.WebApi.postFlightMovement(dispatch, {
                        funcId: "S10604C",
                        legkey: movementInfo.legkey,
                        fisFltSts: rowFormValues.fisFltSts || "",
                        depInfo,
                        arrInfo,
                        dataOwnerCd: "SOALA",
                    }, undefined, false);
                    newMovementInfo = response.data;
                }
                if (newMovementInfo) {
                    const newRowFormValues = convertToMovementInfoForm({
                        index: rowIndex,
                        isDep,
                        apoCd,
                        movementInfo: newMovementInfo,
                        isOal,
                        arrOrgApoCd,
                        depDstApoCd,
                    });
                    dispatch(exports.slice.actions.writeMultipleFlightMovementData({
                        isDep,
                        rowIndex,
                        movementInfo: newMovementInfo,
                        rowFormValues: newRowFormValues,
                        rowStatus: { status: "Updated", updateValidationErrors: [] },
                    }));
                    dispatch((0, redux_form_1.arraySplice)(formName, "rows", rowIndex, 1, newRowFormValues)); // フォームデータに設定
                }
            }
            catch (err) {
                let updateValidationErrors = [];
                if (err instanceof webApi_1.ApiError && err.response) {
                    // 409（コンフリクト）エラーの場合、エラーメッセージを表示する
                    if (err.response.status === 409) {
                        errorCaused = true;
                        // メッセージを表示
                        const title = getSoalaMessageTitle({ rowFormValues, movementInfo });
                        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50031C({ title }) });
                        dispatch(exports.slice.actions.writeMultipleFlightMovementData({
                            isDep,
                            rowIndex,
                            rowStatus: { status: "Failed", updateValidationErrors: [] },
                        }));
                        // 422（バリデーション）エラーの場合、エラーメッセージを表示する
                    }
                    else if (err.response.status === 422) {
                        errorCaused = true;
                        const data = err.response.data || null;
                        if (data && data.errors) {
                            const title = getSoalaMessageTitle({ rowFormValues, movementInfo });
                            data.errors.forEach((error) => {
                                updateValidationErrors = updateValidationErrors.concat(error.errorItems);
                                // メッセージを表示
                                error.errorMessages.forEach((errorText) => {
                                    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50029C({ title, errorText }) });
                                });
                            });
                            updateValidationErrors = (0, lodash_uniq_1.default)(updateValidationErrors);
                            dispatch(exports.slice.actions.writeMultipleFlightMovementData({ isDep, rowIndex, rowStatus: { status: "Error", updateValidationErrors } }));
                            const fieledErrors = Object.entries(FlightMovementType_1.severErrorItems)
                                .filter(([_key, values]) => values.some((value) => updateValidationErrors.includes(value)))
                                .map(([key, _values]) => key);
                            errorRows[rowIndex] = getNestedProperties(fieledErrors, "Error");
                        }
                    }
                    else {
                        criticalErrorCaused = true;
                        break;
                    }
                }
                else {
                    criticalErrorCaused = true;
                    console.error(err.message);
                    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50021C() });
                    break;
                }
            }
        }
        if (!criticalErrorCaused) {
            if (errorCaused) {
                notifications_1.NotificationCreator.create({ dispatch, id: "multipleFlightError", message: soalaMessages_1.SoalaMessage.M30012C({}) });
            }
            else {
                notifications_1.NotificationCreator.create({ dispatch, id: "multipleFlightSuccess", message: soalaMessages_1.SoalaMessage.M30002C() });
            }
        }
        const errors = {
            rows: errorRows,
        };
        dispatch((0, redux_form_1.stopSubmit)(isDep ? MultipleFlightMovementModalDep_1.formName : MultipleFlightMovementModalArr_1.formName, errors));
    }
    catch (err) {
        console.error(err.message);
        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50021C() });
    }
    dispatch(exports.slice.actions.updateMultipleFlightMovementEnd({ isDep }));
});
const modalInitialState = {
    focusedAt: null,
    isOpen: false,
    isFetching: false,
    apoCd: "",
    timeDiffUtc: 0,
    selectedLegKey: null,
    movementInfoList: [],
    initialFormValues: {
        rows: [],
    },
    rowStatusList: [],
};
const initialState = {
    modalArr: modalInitialState,
    modalDep: modalInitialState,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "multipleFlightMovementModals",
    initialState,
    reducers: {
        clearMultipleFlightMovement: (state) => {
            state.modalArr = modalInitialState;
            state.modalDep = modalInitialState;
        },
        clearData: (state, action) => {
            const { isDep } = action.payload;
            if (isDep) {
                state.modalDep = modalInitialState;
            }
            else {
                state.modalArr = modalInitialState;
            }
        },
        close: (state, action) => {
            const modal = action.payload.isDep ? state.modalDep : state.modalArr;
            modal.isOpen = false;
        },
        focusToMultipleFlightMovement: (state, action) => {
            const modal = action.payload.isDep ? state.modalDep : state.modalArr;
            modal.focusedAt = new Date();
        },
        openMultipleFlightMovement: (state, action) => {
            const { apoCd, timeDiffUtc, legKey, isDep } = action.payload;
            if (isDep && state.modalDep && state.modalDep.isOpen)
                return;
            if (!isDep && state.modalArr && state.modalArr.isOpen)
                return;
            const newModal = {
                focusedAt: new Date(),
                isOpen: true,
                isFetching: false,
                apoCd,
                timeDiffUtc,
                selectedLegKey: legKey,
                movementInfoList: [],
                initialFormValues: { rows: [] },
                rowStatusList: [],
            };
            if (isDep) {
                state.modalDep = newModal;
            }
            else {
                state.modalArr = newModal;
            }
        },
        fetchMultipleFlightMovementStart: (state, action) => {
            const modal = action.payload.isDep ? state.modalDep : state.modalArr;
            modal.isOpen = true;
            modal.isFetching = true;
            modal.movementInfoList = [];
            modal.initialFormValues.rows = [];
            modal.rowStatusList = [];
        },
        fetchMultipleFlightMovementRow: (state, action) => {
            const { movementInfo, rowFormValues, rowStatus } = action.payload;
            const modal = action.payload.isDep ? state.modalDep : state.modalArr;
            modal.movementInfoList.push(movementInfo);
            modal.initialFormValues.rows.push(rowFormValues);
            modal.rowStatusList.push(rowStatus);
        },
        fetchMultipleFlightMovementEnd: (state, action) => {
            const modal = action.payload.isDep ? state.modalDep : state.modalArr;
            modal.isFetching = false;
        },
        updateOalMultipleFlightMovement: (state, action) => {
            const modal = action.payload.isDep ? state.modalDep : state.modalArr;
            modal.rowStatusList.forEach((rowStatus) => {
                if (rowStatus.status === "Updated") {
                    // eslint-disable-next-line no-param-reassign
                    rowStatus.status = null;
                }
            });
        },
        updateMultipleFlightMovementEnd: (state, action) => {
            const modal = action.payload.isDep ? state.modalDep : state.modalArr;
            modal.isFetching = false;
        },
        writeMultipleFlightMovementData: (state, action) => {
            const { rowIndex, movementInfo, rowFormValues, rowStatus } = action.payload;
            const modal = action.payload.isDep ? state.modalDep : state.modalArr;
            if (rowIndex < modal.movementInfoList.length &&
                rowIndex < modal.initialFormValues.rows.length &&
                rowIndex < modal.rowStatusList.length) {
                if (movementInfo)
                    modal.movementInfoList[rowIndex] = movementInfo;
                if (rowFormValues)
                    modal.initialFormValues.rows[rowIndex] = rowFormValues;
                if (rowStatus)
                    modal.rowStatusList[rowIndex] = rowStatus;
            }
        },
    },
});
_a = exports.slice.actions, exports.clearMultipleFlightMovement = _a.clearMultipleFlightMovement, exports.openMultipleFlightMovement = _a.openMultipleFlightMovement, exports.focusToMultipleFlightMovement = _a.focusToMultipleFlightMovement;
exports.default = exports.slice.reducer;
//# sourceMappingURL=multipleFlightMovementModals.js.map