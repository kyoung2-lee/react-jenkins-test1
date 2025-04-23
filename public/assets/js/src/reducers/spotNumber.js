"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFormValue = exports.setFormValues = exports.removeDirtyForm = exports.setDirtyForm = exports.targetSelected = exports.closeSpotNumberAll = exports.slice = exports.checkSpotNumberRestriction = exports.updateSpotNumbers = exports.openSpotNumberChild = exports.closeSpotNumberChild = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const redux_form_1 = require("redux-form");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const webApi_1 = require("../lib/webApi");
const oalAircraft_1 = require("./oalAircraft");
// eslint-disable-next-line import/no-cycle
const SpotNumberModal_1 = require("../components/organisms/SpotNumberModal");
function isRowDirty(givenId, formValues, initialValues) {
    if (formValues.rows && initialValues.rows) {
        const formIndex = formValues.rows.findIndex((r) => r.givenId === givenId);
        if (formIndex >= 0 && JSON.stringify(formValues.rows[formIndex]) !== JSON.stringify(initialValues.rows[formIndex])) {
            return true;
        }
    }
    return false;
}
exports.closeSpotNumberChild = (0, toolkit_1.createAsyncThunk)("spotNumber/closeSpotNumberChild", (arg, thunkAPI) => {
    const { givenId } = arg;
    const { dispatch, getState } = thunkAPI;
    const { spotNoRows, initialFormValues } = getState().spotNumber;
    const { values: formValues } = getState().form[SpotNumberModal_1.FORM_NAME];
    const index = spotNoRows.findIndex((r) => r.givenId === givenId);
    const formIndex = formValues.rows.findIndex((r) => r.givenId === givenId);
    if (index < 0)
        return;
    const close = () => {
        if (formIndex >= 0) {
            dispatch((0, redux_form_1.arrayRemove)(SpotNumberModal_1.FORM_NAME, FIELD_NAME, formIndex)); // フォームデータを削除
        }
        dispatch(exports.slice.actions.closeSpotNumberSelected({ givenId, rowFormValues: formValues.rows }));
    };
    if (isRowDirty(givenId, formValues, initialFormValues)) {
        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40001C({ onYesButton: close }) });
    }
    else {
        close();
    }
});
exports.openSpotNumberChild = (0, toolkit_1.createAsyncThunk)("spotNumber/openSpotNumberChild", async (arg, thunkAPI) => {
    const { seq, isModal, dispRangeFromLcl, dispRangeToLcl } = arg;
    const { dispatch, getState } = thunkAPI;
    const { cdCtrlDtls } = getState().account.master;
    const { spotNoRows } = getState().spotNumber;
    const { fisRows } = getState().fis; // isOalを取得するために、fisを取得する (FIS画面, 地上作業バーチャート画面 SPOT番号更新用)
    const { fisState } = getState().mySchedule; // isOalを取得するために、fisを取得する (MySchedule画面 SPOT番号更新用)
    // isOalを参照するために、seqをキーにしてfisからfisRowを取得する
    // MySchedule の場合は fisRowsが空のため、mySchedule.fisState.fisRowを取得する
    const fisRow = fisRows.size > 0 ? fisRows.find(({ arrDepCtrl }) => arrDepCtrl.seq === seq) : fisState === null || fisState === void 0 ? void 0 : fisState.fisRow;
    const targetCdCtrlDtl038 = cdCtrlDtls.find((e) => e.cdCls === "038" && e.cdCat1 === "SPOT_NO_CHILD_MAX");
    const maxSelected = targetCdCtrlDtl038 ? targetCdCtrlDtl038.num1 : 1;
    // 上限値まで選択されていた場合、選択不可
    if (spotNoRows.length >= maxSelected) {
        return;
    }
    // 現在の選択番号最大値を取得
    const givenId = isModal ? 0 : spotNoRows.reduce((maxGivenId, spotNoRow) => Math.max(spotNoRow.givenId, maxGivenId), 0) + 1;
    dispatch(exports.slice.actions.fetchSpotNumber({ seq, givenId, isModal, fisRow }));
    try {
        const param = { seq };
        const callbacks = {
            onNotFoundRecord: () => dispatch(exports.slice.actions.closeSpotNumberSelected({ givenId })),
            onConflict: () => dispatch(exports.slice.actions.closeSpotNumberSelected({ givenId })),
        };
        const response = await webApi_1.WebApi.getLegArrDepCtrl(dispatch, param, callbacks);
        const legArrDepCtrlApiResponse = response.data;
        const { arr, dep } = (0, oalAircraft_1.getArrDepInfoWithVeiwRange)({ legArrDepCtrlApiResponse, dispRangeFromLcl, dispRangeToLcl });
        if (!arr && !dep) {
            dispatch(exports.slice.actions.fetchSpotNumberFailure());
            notifications_1.NotificationCreator.create({
                dispatch,
                message: soalaMessages_1.SoalaMessage.M40020C({ onOkButton: () => dispatch(exports.slice.actions.closeSpotNumberSelected({ givenId })) }),
            });
            return;
        }
        // フォームのデータ
        const rowFormValues = {
            givenId,
            arr: {
                spotNo: (arr && arr.spotNo) || "", // nullの場合、空文字を設定しフォームと初期値を合わせる
            },
            dep: {
                spotNo: (dep && dep.spotNo) || "", // nullの場合、空文字を設定しフォームの初期値と合わせる
            },
        };
        dispatch((0, redux_form_1.arrayPush)(SpotNumberModal_1.FORM_NAME, FIELD_NAME, rowFormValues)); // フォームデータに設定
        dispatch(exports.slice.actions.fetchSpotNumberSuccess({ givenId, arr, dep, rowFormValues }));
    }
    catch (error) {
        const statusCode = error instanceof webApi_1.ApiError && error.response ? error.response.status : null;
        dispatch(exports.slice.actions.fetchSpotNumberFailure());
        if (statusCode !== 404 && statusCode !== 409) {
            dispatch(exports.slice.actions.closeSpotNumberSelected({ givenId }));
        }
    }
});
function getOalUpdateParams({ legInfo, formitems, isDep, }) {
    const oal2Legkey = {
        orgDateLcl: legInfo.orgDateLcl,
        alCd: legInfo.alCd,
        fltNo: legInfo.fltNo,
        casFltNo: legInfo.casFltNo,
        skdDepApoCd: legInfo.skdDepApoCd,
        skdArrApoCd: legInfo.skdArrApoCd,
        skdLegSno: legInfo.skdLegSno,
    };
    const depInfo = isDep ? { depApoSpotNo: formitems.spotNo } : null;
    const arrInfo = !isDep ? { arrApoSpotNo: formitems.spotNo } : null;
    return {
        funcId: "S10702C",
        oal2Legkey,
        depInfo,
        arrInfo,
        dataOwnerCd: "SOALA",
    };
}
function getUpdateParams({ legInfo, formitems, isDep, }) {
    const legkey = {
        orgDateLcl: legInfo.orgDateLcl,
        alCd: legInfo.alCd,
        fltNo: legInfo.fltNo,
        casFltNo: legInfo.casFltNo,
        skdDepApoCd: legInfo.skdDepApoCd,
        skdArrApoCd: legInfo.skdArrApoCd,
        skdLegSno: legInfo.skdLegSno,
    };
    const depInfo = isDep ? { depApoSpotNo: formitems.spotNo } : null;
    const arrInfo = !isDep ? { arrApoSpotNo: formitems.spotNo } : null;
    return {
        funcId: "S10702C",
        legkey,
        depInfo,
        arrInfo,
        dataOwnerCd: "SOALA",
    };
}
exports.updateSpotNumbers = (0, toolkit_1.createAsyncThunk)("spotNumber/updateSpotNumbers", async (arg, thunkAPI) => {
    var _a, _b;
    const formValues = arg;
    const { dispatch, getState } = thunkAPI;
    const { spotNoRows, initialFormValues, dirtyForms } = getState().spotNumber;
    dispatch(exports.slice.actions.updateSpotNumberStart());
    let hasConflict = false;
    let hasError = false;
    for (let index = 0; index < formValues.rows.length; index++) {
        // 同期処理したいのでforeach()ではなくfor文にしている
        const rowFormValues = formValues.rows[index];
        const rowInitialFormValues = initialFormValues.rows.find((r) => r.givenId === rowFormValues.givenId);
        if (!rowInitialFormValues)
            continue;
        const spotNoRow = spotNoRows.find((r) => r.givenId === rowFormValues.givenId);
        if (!spotNoRow)
            continue;
        const { givenId, arr, dep, targetSelect, isOalArr, isOalDep } = spotNoRow;
        const callbacks = {
            onNotFoundRecord: () => dispatch(exports.slice.actions.closeSpotNumberAll()),
        };
        dispatch(exports.slice.actions.resetStatusLabel({ givenId }));
        let isArrSucceeded = arr.updateSucceeded;
        let isDepSucceeded = dep.updateSucceeded;
        // Arrの更新処理
        const isArrDirty = (_a = dirtyForms[spotNoRow.givenId]) === null || _a === void 0 ? void 0 : _a.arr;
        if (isArrDirty && arr.legInfo && !arr.updateSucceeded) {
            dispatch(exports.slice.actions.updateSpotNumberArr({ givenId }));
            try {
                if (isOalArr) {
                    // 他社便
                    const requestParams = getOalUpdateParams({ legInfo: arr.legInfo, formitems: rowFormValues.arr, isDep: false });
                    // eslint-disable-next-line no-await-in-loop
                    const response = await webApi_1.WebApi.postOalFlightMovementSpot(dispatch, requestParams, callbacks, false);
                    dispatch(exports.slice.actions.updateSpotNumberSuccessArr({ givenId, data: response.data, rowFormValues }));
                    if (response.data.skippedFlg) {
                        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30013C({ title: (0, oalAircraft_1.getSoalaMessageTitle)(arr.legInfo) }) });
                    }
                }
                else {
                    // 自社便
                    const requestParams = getUpdateParams({ legInfo: arr.legInfo, formitems: rowFormValues.arr, isDep: false });
                    // eslint-disable-next-line no-await-in-loop
                    const response = await webApi_1.WebApi.postFlightMovementSpot(dispatch, requestParams, callbacks, false);
                    dispatch(exports.slice.actions.updateSpotNumberSuccessArr({ givenId, data: response.data, rowFormValues }));
                    if (response.data.skippedFlg) {
                        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30013C({ title: (0, oalAircraft_1.getSoalaMessageTitle)(arr.legInfo) }) });
                    }
                }
                isArrSucceeded = true;
                dispatch(exports.slice.actions.setDirtyForm({ givenId, isArrDirty: false, isDepDirty: undefined }));
            }
            catch (error) {
                const statusCode = error instanceof webApi_1.ApiError && error.response ? error.response.status : null;
                dispatch(exports.slice.actions.updateSpotNumberFailureArr({ givenId, statusCode, rowFormValues }));
                if (statusCode === 409) {
                    hasConflict = true;
                    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50031C({ title: (0, oalAircraft_1.getSoalaMessageTitle)(arr.legInfo) }) });
                }
                else {
                    return;
                }
            }
        }
        else {
            isArrSucceeded = true;
            dispatch(exports.slice.actions.setDirtyForm({ givenId, isArrDirty: false, isDepDirty: undefined }));
        }
        // Depの更新処理（ArrDep同値変更の場合はArrの入力値を使用）
        const depFormitems = targetSelect === "ARR_DEP_SAME" ? rowFormValues.arr : rowFormValues.dep;
        const isDepDirty = targetSelect === "ARR_DEP_SAME" ? isArrDirty : (_b = dirtyForms[spotNoRow.givenId]) === null || _b === void 0 ? void 0 : _b.dep;
        if (isDepDirty && dep.legInfo && !dep.updateSucceeded) {
            dispatch(exports.slice.actions.updateSpotNumberDep({ givenId }));
            try {
                if (isOalDep) {
                    // 他社便
                    const requestParams = getOalUpdateParams({ legInfo: dep.legInfo, formitems: depFormitems, isDep: true });
                    // eslint-disable-next-line no-await-in-loop
                    const response = await webApi_1.WebApi.postOalFlightMovementSpot(dispatch, requestParams, callbacks, false);
                    dispatch(exports.slice.actions.updateSpotNumberSuccessDep({ givenId, data: response.data, rowFormValues }));
                    if (response.data.skippedFlg) {
                        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30013C({ title: (0, oalAircraft_1.getSoalaMessageTitle)(dep.legInfo) }) });
                    }
                }
                else {
                    // 自社便
                    const requestParams = getUpdateParams({ legInfo: dep.legInfo, formitems: depFormitems, isDep: true });
                    // eslint-disable-next-line no-await-in-loop
                    const response = await webApi_1.WebApi.postFlightMovementSpot(dispatch, requestParams, callbacks, false);
                    dispatch(exports.slice.actions.updateSpotNumberSuccessDep({ givenId, data: response.data, rowFormValues }));
                    if (response.data.skippedFlg) {
                        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30013C({ title: (0, oalAircraft_1.getSoalaMessageTitle)(dep.legInfo) }) });
                    }
                }
                isDepSucceeded = true;
                dispatch(exports.slice.actions.setDirtyForm({ givenId, isArrDirty: undefined, isDepDirty: false }));
            }
            catch (error) {
                const statusCode = error instanceof webApi_1.ApiError && error.response ? error.response.status : null;
                dispatch(exports.slice.actions.updateSpotNumberFailureDep({ givenId, statusCode, rowFormValues }));
                if (statusCode === 409) {
                    hasConflict = true;
                    notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50031C({ title: (0, oalAircraft_1.getSoalaMessageTitle)(dep.legInfo) }) });
                }
                else {
                    return;
                }
            }
        }
        else {
            isDepSucceeded = true;
            dispatch(exports.slice.actions.setDirtyForm({ givenId, isArrDirty: undefined, isDepDirty: false }));
        }
        if (isArrSucceeded && isDepSucceeded) {
            if (targetSelect === "ARR_DEP_SAME") {
                dispatch(exports.slice.actions.updateSpotNumberSuccessAll({ givenId, rowFormValues }));
            }
        }
        else {
            hasError = true;
        }
    }
    dispatch(exports.slice.actions.updateSpotNumberEnd());
    if (!hasError) {
        dispatch(exports.slice.actions.resetDirtyForms());
        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30002C() });
    }
    else if (hasConflict) {
        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30012C({ onOkButton: () => { } }) });
    }
});
exports.checkSpotNumberRestriction = (0, toolkit_1.createAsyncThunk)("spotNumber/checkSpotNumberRestriction", async (arg, thunkAPI) => {
    var _a, _b;
    const formValues = arg;
    const { dispatch, getState } = thunkAPI;
    const { spotNoRows, initialFormValues, dirtyForms } = getState().spotNumber;
    const legInfos = [];
    for (let index = 0; index < formValues.rows.length; index++) {
        // 同期処理したいのでforeach()ではなくfor文にしている
        const rowFormValues = formValues.rows[index];
        const rowInitialFormValues = initialFormValues.rows.find((r) => r.givenId === rowFormValues.givenId);
        if (!rowInitialFormValues)
            continue;
        const spotNoRow = spotNoRows.find((r) => r.givenId === rowFormValues.givenId);
        if (!spotNoRow)
            continue;
        const { arr, dep, targetSelect, isOalArr, isOalDep } = spotNoRow;
        const requestLegInfo = { arr: null, dep: null };
        // Arrの更新処理
        const isArrDirty = (_a = dirtyForms[spotNoRow.givenId]) === null || _a === void 0 ? void 0 : _a.arr;
        if (isArrDirty && arr.legInfo && !arr.updateSucceeded) {
            if (isOalArr) {
                // 他社便
                const requestParams = getOalUpdateParams({ legInfo: arr.legInfo, formitems: rowFormValues.arr, isDep: false });
                if (requestParams.arrInfo) {
                    requestLegInfo.arr = {
                        ...requestParams.oal2Legkey,
                        oalTblFlg: true,
                        spotNo: requestParams.arrInfo.arrApoSpotNo,
                    };
                }
            }
            else {
                // 自社便
                const requestParams = getUpdateParams({ legInfo: arr.legInfo, formitems: rowFormValues.arr, isDep: false });
                if (requestParams.arrInfo) {
                    requestLegInfo.arr = {
                        ...requestParams.legkey,
                        oalTblFlg: false,
                        spotNo: requestParams.arrInfo.arrApoSpotNo,
                    };
                }
            }
        }
        // Depの更新処理（ArrDep同値変更の場合はArrの入力値を使用）
        const depFormitems = targetSelect === "ARR_DEP_SAME" ? rowFormValues.arr : rowFormValues.dep;
        const isDepDirty = targetSelect === "ARR_DEP_SAME" ? isArrDirty : (_b = dirtyForms[spotNoRow.givenId]) === null || _b === void 0 ? void 0 : _b.dep;
        if (isDepDirty && dep.legInfo && !dep.updateSucceeded) {
            if (isOalDep) {
                // 他社便
                const requestParams = getOalUpdateParams({ legInfo: dep.legInfo, formitems: depFormitems, isDep: true });
                if (requestParams.depInfo) {
                    requestLegInfo.dep = {
                        ...requestParams.oal2Legkey,
                        oalTblFlg: true,
                        spotNo: requestParams.depInfo.depApoSpotNo,
                    };
                }
            }
            else {
                // 自社便
                const requestParams = getUpdateParams({ legInfo: dep.legInfo, formitems: depFormitems, isDep: true });
                if (requestParams.depInfo) {
                    requestLegInfo.dep = {
                        ...requestParams.legkey,
                        oalTblFlg: false,
                        spotNo: requestParams.depInfo.depApoSpotNo,
                    };
                }
            }
        }
        if (requestLegInfo.arr != null || requestLegInfo.dep != null) {
            legInfos.push(requestLegInfo);
        }
    }
    // APIの呼び出しと成型処理
    if (legInfos.length >= 0) {
        const requestParams = {
            funcId: "S10702C",
            legInfo: legInfos,
        };
        const response = await webApi_1.WebApi.postSpotNumberRestrictionCheck(dispatch, requestParams);
        return response.data.legInfo
            .map(({ arr, dep }) => {
            var _a, _b, _c, _d;
            var _e, _f, _g, _h;
            const responseLegInfo = { arr: null, dep: null };
            if (arr &&
                (arr.status === "2" ||
                    (arr.status === "0" &&
                        (arr.spotRstShipTypeInfo ||
                            (arr.spotRstTimeInfo && arr.spotRstTimeInfo.length > 0) ||
                            (arr.spotCombRstShipTypeInfo && arr.spotCombRstShipTypeInfo.length > 0))))) {
                responseLegInfo.arr = {
                    ...arr,
                };
                if (arr.lstArrApoCd == null || arr.lstDepApoCd == null) {
                    const foundSpotNoRow = spotNoRows.find((spotNoRow) => spotNoRow.arr.legInfo &&
                        arr.orgDateLcl.substring(0, 10) === spotNoRow.arr.legInfo.orgDateLcl.substring(0, 10) && // フォーマットが時刻付きと時刻なしで混ざるため日付部分のみを比較
                        arr.alCd === spotNoRow.arr.legInfo.alCd &&
                        arr.fltNo === spotNoRow.arr.legInfo.fltNo &&
                        arr.casFltNo === spotNoRow.arr.legInfo.casFltNo &&
                        arr.skdDepApoCd === spotNoRow.arr.legInfo.skdDepApoCd &&
                        arr.skdArrApoCd === spotNoRow.arr.legInfo.skdArrApoCd &&
                        arr.skdLegSno === spotNoRow.arr.legInfo.skdLegSno);
                    if (foundSpotNoRow === null || foundSpotNoRow === void 0 ? void 0 : foundSpotNoRow.arr.legInfo) {
                        (_a = (_e = responseLegInfo.arr).lstArrApoCd) !== null && _a !== void 0 ? _a : (_e.lstArrApoCd = foundSpotNoRow.arr.legInfo.lstArrApoCd);
                        (_b = (_f = responseLegInfo.arr).lstDepApoCd) !== null && _b !== void 0 ? _b : (_f.lstDepApoCd = foundSpotNoRow.arr.legInfo.lstDepApoCd);
                    }
                }
            }
            if (dep &&
                (dep.status === "2" ||
                    (dep.status === "0" &&
                        (dep.spotRstShipTypeInfo ||
                            (dep.spotRstTimeInfo && dep.spotRstTimeInfo.length > 0) ||
                            (dep.spotCombRstShipTypeInfo && dep.spotCombRstShipTypeInfo.length > 0))))) {
                responseLegInfo.dep = {
                    ...dep,
                };
                if (dep.lstArrApoCd == null || dep.lstDepApoCd == null) {
                    const foundSpotNoRow = spotNoRows.find((spotNoRow) => spotNoRow.dep.legInfo &&
                        dep.orgDateLcl.substring(0, 10) === spotNoRow.dep.legInfo.orgDateLcl.substring(0, 10) && // フォーマットが時刻付きと時刻なしで混ざるため日付部分のみを比較
                        dep.alCd === spotNoRow.dep.legInfo.alCd &&
                        dep.fltNo === spotNoRow.dep.legInfo.fltNo &&
                        dep.casFltNo === spotNoRow.dep.legInfo.casFltNo &&
                        dep.skdDepApoCd === spotNoRow.dep.legInfo.skdDepApoCd &&
                        dep.skdArrApoCd === spotNoRow.dep.legInfo.skdArrApoCd &&
                        dep.skdLegSno === spotNoRow.dep.legInfo.skdLegSno);
                    if (foundSpotNoRow === null || foundSpotNoRow === void 0 ? void 0 : foundSpotNoRow.dep.legInfo) {
                        (_c = (_g = responseLegInfo.dep).lstArrApoCd) !== null && _c !== void 0 ? _c : (_g.lstArrApoCd = foundSpotNoRow.dep.legInfo.lstArrApoCd);
                        (_d = (_h = responseLegInfo.dep).lstDepApoCd) !== null && _d !== void 0 ? _d : (_h.lstDepApoCd = foundSpotNoRow.dep.legInfo.lstDepApoCd);
                    }
                }
            }
            return responseLegInfo;
        })
            .filter((v) => v.arr != null || v.dep != null);
    }
    return [];
});
const FIELD_NAME = "rows";
const initialState = {
    formValues: { rows: [] },
    isModal: true,
    isOpen: false,
    fetching: false,
    spotNoRows: [],
    initialFormValues: { rows: [] },
    dirtyForms: {},
};
const spotNoRowInitialValue = {
    seq: -1,
    givenId: 0,
    targetSelect: null,
    arr: {
        legInfo: null,
        statusValue: null,
        updateSucceeded: false,
        hasError: false,
    },
    dep: {
        legInfo: null,
        statusValue: null,
        updateSucceeded: false,
        hasError: false,
    },
    isOalArr: true,
    isOalDep: true,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "spotNumber",
    initialState,
    reducers: {
        closeSpotNumberAll: (state) => {
            Object.assign(state, initialState, { initialFormValues: { rows: [] } } // これをしないと参照が残ってしまう
            );
        },
        closeSpotNumberSelected: (state, action) => {
            const spotNoRows = state.spotNoRows.slice();
            if (spotNoRows.length > 1) {
                const { givenId, rowFormValues } = action.payload;
                const index = state.spotNoRows.findIndex((r) => r.givenId === givenId);
                const formIndex = state.initialFormValues.rows.findIndex((r) => r.givenId === givenId);
                const { initialFormValues } = state; // Formの値に影響を与えないように参照をコピーする
                if (index >= 0) {
                    spotNoRows.splice(index, 1);
                }
                if (formIndex >= 0) {
                    initialFormValues.rows.splice(formIndex, 1);
                }
                state.fetching = false;
                state.spotNoRows = spotNoRows;
                const formValues = rowFormValues === null || rowFormValues === void 0 ? void 0 : rowFormValues.filter((value) => value.givenId !== givenId);
                state.initialFormValues =
                    formValues == null
                        ? initialFormValues
                        : {
                            ...initialFormValues,
                            rows: initialFormValues.rows.map((row, i) => ({
                                ...row,
                                arr: { ...row.arr, spotNo: formValues[i].arr.spotNo },
                                dep: { ...row.dep, spotNo: formValues[i].dep.spotNo },
                            })),
                        };
            }
            else {
                Object.assign(state, initialState, { initialFormValues: { rows: [] } } // これをしないと参照が残ってしまう
                );
            }
        },
        targetSelected: (state, action) => {
            const { givenId } = action.payload;
            const index = state.spotNoRows.findIndex((r) => r.givenId === givenId);
            if (index < 0)
                return;
            const spotNoRows = state.spotNoRows.slice();
            spotNoRows.splice(index, 1, {
                ...state.spotNoRows[index],
                targetSelect: action.payload.target,
            });
            state.spotNoRows = spotNoRows;
        },
        fetchSpotNumber: (state, action) => {
            var _a, _b;
            const { seq, givenId, isModal, fisRow } = action.payload;
            state.isModal = isModal;
            state.isOpen = true;
            state.fetching = true;
            state.spotNoRows = [
                ...state.spotNoRows,
                {
                    ...spotNoRowInitialValue,
                    seq,
                    givenId,
                    isOalArr: !!((_a = fisRow === null || fisRow === void 0 ? void 0 : fisRow.arr) === null || _a === void 0 ? void 0 : _a.isOal),
                    isOalDep: !!((_b = fisRow === null || fisRow === void 0 ? void 0 : fisRow.dep) === null || _b === void 0 ? void 0 : _b.isOal),
                },
            ];
        },
        fetchSpotNumberSuccess: (state, action) => {
            const { givenId, arr, dep, rowFormValues } = action.payload;
            const index = state.spotNoRows.findIndex((r) => r.givenId === givenId);
            if (index < 0)
                return;
            const initialFormValues = state.spotNoRows.length > 1
                ? {
                    rows: state.initialFormValues.rows.map((row, i) => {
                        var _a, _b, _c, _d;
                        return ({
                            ...row,
                            arr: { ...row.arr, spotNo: (_b = (_a = state.formValues.rows[i]) === null || _a === void 0 ? void 0 : _a.arr.spotNo) !== null && _b !== void 0 ? _b : row.arr.spotNo },
                            dep: { ...row.dep, spotNo: (_d = (_c = state.formValues.rows[i]) === null || _c === void 0 ? void 0 : _c.dep.spotNo) !== null && _d !== void 0 ? _d : row.dep.spotNo },
                        });
                    }),
                } // Formの値に影響を与えないように参照をコピーする
                : { rows: [] }; // 最初にinitialValuesの書き換えがされない場合があるので、初期値を設定（ModelessのあとModalを開くなど）
            initialFormValues.rows.push(rowFormValues);
            const spotNoRows = state.spotNoRows.slice();
            spotNoRows.splice(index, 1, {
                ...spotNoRows[index],
                targetSelect: arr && !dep ? "ARR" : !arr && dep ? "DEP" : null,
                arr: {
                    ...spotNoRowInitialValue.arr,
                    legInfo: arr,
                },
                dep: {
                    ...spotNoRowInitialValue.dep,
                    legInfo: dep,
                },
            });
            state.fetching = false;
            state.spotNoRows = spotNoRows;
            state.initialFormValues = initialFormValues;
            state.formValues = initialFormValues;
        },
        fetchSpotNumberFailure: (state) => {
            state.fetching = false;
        },
        updateSpotNumberStart: (_state) => { },
        updateSpotNumberEnd: (_state) => { },
        updateSpotNumberArr: (state, action) => {
            const index = state.spotNoRows.findIndex((r) => r.givenId === action.payload.givenId);
            if (index < 0)
                return;
            const spotNoRows = state.spotNoRows.slice();
            spotNoRows.splice(index, 1, {
                ...spotNoRows[index],
                arr: {
                    ...spotNoRows[index].arr,
                    statusValue: null,
                    updateSucceeded: false,
                    hasError: false,
                },
            });
            state.spotNoRows = spotNoRows;
        },
        updateSpotNumberDep: (state, action) => {
            const index = state.spotNoRows.findIndex((r) => r.givenId === action.payload.givenId);
            if (index < 0)
                return;
            const spotNoRows = state.spotNoRows.slice();
            spotNoRows.splice(index, 1, {
                ...spotNoRows[index],
                dep: {
                    ...spotNoRows[index].dep,
                    statusValue: null,
                    updateSucceeded: false,
                    hasError: false,
                },
            });
            state.spotNoRows = spotNoRows;
        },
        updateSpotNumberSuccessArr: (state, action) => {
            const { givenId } = action.payload;
            const index = state.spotNoRows.findIndex((r) => r.givenId === givenId);
            const formIndex = state.initialFormValues.rows.findIndex((r) => r.givenId === givenId);
            if (index < 0)
                return;
            // ArrDep同値変更の場合は、initialFormValueを変更しない。（dirtyのまま）
            const { initialFormValues } = state; // Formの値に影響を与えないように参照をコピーする
            if (formIndex >= 0 && state.spotNoRows[index].targetSelect !== "ARR_DEP_SAME") {
                initialFormValues.rows[formIndex] = {
                    ...action.payload.rowFormValues,
                    arr: action.payload.rowFormValues.arr,
                    dep: initialFormValues.rows[formIndex].dep,
                };
            }
            const spotNoRows = state.spotNoRows.slice();
            spotNoRows.splice(index, 1, {
                ...spotNoRows[index],
                arr: {
                    ...spotNoRows[index].arr,
                    statusValue: action.payload.data.skippedFlg ? "Skipped" : "Updated",
                    updateSucceeded: true,
                    hasError: false,
                },
            });
            state.spotNoRows = spotNoRows;
            state.initialFormValues = initialFormValues;
        },
        updateSpotNumberSuccessDep: (state, action) => {
            const { givenId } = action.payload;
            const index = state.spotNoRows.findIndex((r) => r.givenId === givenId);
            const formIndex = state.initialFormValues.rows.findIndex((r) => r.givenId === givenId);
            if (index < 0)
                return;
            // ArrDep同値変更の場合は、initialFormValueを変更しない。（dirtyのまま）
            const { initialFormValues } = state; // Formの値に影響を与えないように参照をコピーする
            if (formIndex >= 0 && state.spotNoRows[index].targetSelect !== "ARR_DEP_SAME") {
                initialFormValues.rows[formIndex] = {
                    ...action.payload.rowFormValues,
                    arr: initialFormValues.rows[formIndex].arr,
                    dep: action.payload.rowFormValues.dep,
                };
            }
            const spotNoRows = state.spotNoRows.slice();
            spotNoRows.splice(index, 1, {
                ...spotNoRows[index],
                dep: {
                    ...spotNoRows[index].dep,
                    statusValue: action.payload.data.skippedFlg ? "Skipped" : "Updated",
                    updateSucceeded: true,
                    hasError: false,
                },
            });
            state.spotNoRows = spotNoRows;
            state.initialFormValues = initialFormValues;
        },
        updateSpotNumberSuccessAll: (state, action) => {
            const { givenId } = action.payload;
            const index = state.spotNoRows.findIndex((r) => r.givenId === givenId);
            const formIndex = state.initialFormValues.rows.findIndex((r) => r.givenId === givenId);
            if (index < 0)
                return;
            const { initialFormValues } = state; // Formの値に影響を与えないように参照をコピーする
            if (formIndex >= 0 && state.spotNoRows[index].targetSelect === "ARR_DEP_SAME") {
                initialFormValues.rows[formIndex] = {
                    ...action.payload.rowFormValues,
                };
            }
            state.initialFormValues = initialFormValues;
        },
        updateSpotNumberFailureArr: (state, action) => {
            const index = state.spotNoRows.findIndex((r) => r.givenId === action.payload.givenId);
            if (index < 0)
                return;
            const spotNoRows = state.spotNoRows.slice();
            spotNoRows.splice(index, 1, {
                ...spotNoRows[index],
                arr: {
                    ...spotNoRows[index].arr,
                    statusValue: action.payload.statusCode === 409 ? "Failed" : spotNoRows[index].arr.statusValue,
                    hasError: true,
                },
            });
            state.spotNoRows = spotNoRows;
            state.initialFormValues = {
                ...state.initialFormValues,
                rows: state.initialFormValues.rows.map((row) => row.givenId === action.payload.givenId ? { ...row, arr: { ...row.arr, spotNo: action.payload.rowFormValues.arr.spotNo } } : row),
            };
        },
        updateSpotNumberFailureDep: (state, action) => {
            const index = state.spotNoRows.findIndex((r) => r.givenId === action.payload.givenId);
            if (index < 0)
                return;
            const spotNoRows = state.spotNoRows.slice();
            spotNoRows.splice(index, 1, {
                ...spotNoRows[index],
                dep: {
                    ...spotNoRows[index].dep,
                    statusValue: action.payload.statusCode === 409 ? "Failed" : state.spotNoRows[index].dep.statusValue,
                    hasError: true,
                },
            });
            state.spotNoRows = spotNoRows;
            state.initialFormValues = {
                ...state.initialFormValues,
                rows: state.initialFormValues.rows.map((row) => row.givenId === action.payload.givenId ? { ...row, dep: { ...row.dep, spotNo: action.payload.rowFormValues.dep.spotNo } } : row),
            };
        },
        resetStatusLabel: (state, action) => {
            const index = state.spotNoRows.findIndex((r) => r.givenId === action.payload.givenId);
            if (index < 0)
                return;
            const spotNoRows = state.spotNoRows.slice();
            spotNoRows.splice(index, 1, {
                ...spotNoRows[index],
                arr: {
                    ...spotNoRows[index].arr,
                    statusValue: state.spotNoRows[index].arr.statusValue === "Updated" || state.spotNoRows[index].arr.statusValue === "Skipped"
                        ? state.spotNoRows[index].arr.statusValue
                        : null,
                },
                dep: {
                    ...spotNoRows[index].dep,
                    statusValue: state.spotNoRows[index].dep.statusValue === "Updated" || state.spotNoRows[index].dep.statusValue === "Skipped"
                        ? state.spotNoRows[index].dep.statusValue
                        : null,
                },
            });
            state.spotNoRows = spotNoRows;
        },
        setFormValues: (state, action) => {
            state.formValues = action.payload.formValues;
        },
        removeFormValue: (state, action) => {
            state.formValues = {
                ...action.payload.formValues,
                rows: action.payload.formValues.rows.filter(({ givenId }) => givenId !== action.payload.givenId),
            };
        },
        setDirtyForm: (state, action) => {
            var _a, _b;
            const { givenId, isArrDirty, isDepDirty } = action.payload;
            state.dirtyForms = {
                ...state.dirtyForms,
                [givenId]: {
                    arr: isArrDirty !== null && isArrDirty !== void 0 ? isArrDirty : (_a = state.dirtyForms[givenId]) === null || _a === void 0 ? void 0 : _a.arr,
                    dep: isDepDirty !== null && isDepDirty !== void 0 ? isDepDirty : (_b = state.dirtyForms[givenId]) === null || _b === void 0 ? void 0 : _b.dep,
                },
            };
        },
        removeDirtyForm: (state, action) => {
            const { givenId } = action.payload;
            delete state.dirtyForms[givenId];
        },
        resetDirtyForms: (state) => {
            state.dirtyForms = initialState.dirtyForms;
        },
    },
});
_a = exports.slice.actions, exports.closeSpotNumberAll = _a.closeSpotNumberAll, exports.targetSelected = _a.targetSelected, exports.setDirtyForm = _a.setDirtyForm, exports.removeDirtyForm = _a.removeDirtyForm, exports.setFormValues = _a.setFormValues, exports.removeFormValue = _a.removeFormValue;
exports.default = exports.slice.reducer;
//# sourceMappingURL=spotNumber.js.map