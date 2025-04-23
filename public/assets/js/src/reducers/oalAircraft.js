"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFailureDep = exports.targetSelected = exports.closeOalAircraftModal = exports.slice = exports.updateOalAircraft = exports.getSoalaMessageTitle = exports.openOalAircraftModal = exports.getArrDepInfoWithVeiwRange = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const dayjs_1 = __importDefault(require("dayjs"));
const commonUtil_1 = require("../lib/commonUtil");
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const webApi_1 = require("../lib/webApi");
/**
 * FISの表示範囲を考慮してARR、DEPの情報を取り出す
 */
function getArrDepInfoWithVeiwRange({ legArrDepCtrlApiResponse, dispRangeFromLcl, dispRangeToLcl, }) {
    let isArrEmpty = (0, commonUtil_1.isObjectEmpty)(legArrDepCtrlApiResponse.arr); // オブジェクトの空を検出する
    let isDepEmpty = (0, commonUtil_1.isObjectEmpty)(legArrDepCtrlApiResponse.dep); // オブジェクトの空を検出する
    // 親画面の表示範囲外の場合、データを非表示にする。
    if (!isArrEmpty && legArrDepCtrlApiResponse.arr) {
        const { ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl } = legArrDepCtrlApiResponse.arr;
        const orgXtaLcl = (0, commonUtil_1.getXtaLcl)({ ataLcl, actLdLcl, tentativeEstLdLcl, estLdLcl, tentativeEtaLcl, etaLcl, staLcl });
        if (!(orgXtaLcl >= dispRangeFromLcl && orgXtaLcl <= dispRangeToLcl)) {
            isArrEmpty = true;
        }
    }
    if (!isDepEmpty && legArrDepCtrlApiResponse.dep) {
        const { atdLcl, tentativeEtdLcl, etdLcl, stdLcl } = legArrDepCtrlApiResponse.dep;
        const orgXtdLcl = (0, commonUtil_1.getXtdLcl)({ atdLcl, tentativeEtdLcl, etdLcl, stdLcl });
        if (!(orgXtdLcl >= dispRangeFromLcl && orgXtdLcl <= dispRangeToLcl)) {
            isDepEmpty = true;
        }
    }
    const arr = isArrEmpty ? null : legArrDepCtrlApiResponse.arr;
    const dep = isDepEmpty ? null : legArrDepCtrlApiResponse.dep;
    return { arr, dep };
}
exports.getArrDepInfoWithVeiwRange = getArrDepInfoWithVeiwRange;
exports.openOalAircraftModal = (0, toolkit_1.createAsyncThunk)("oalAircraft/openOalAircraftModal", async (arg, thunkAPI) => {
    const { seq, dispRangeFromLcl, dispRangeToLcl } = arg;
    const { dispatch } = thunkAPI;
    dispatch(exports.slice.actions.fetch({ seq }));
    try {
        const param = { seq };
        const callbacks = {
            onNotFoundRecord: () => dispatch((0, exports.closeOalAircraftModal)()),
            onConflict: () => dispatch((0, exports.closeOalAircraftModal)()),
        };
        const response = await webApi_1.WebApi.getLegArrDepCtrl(dispatch, param, callbacks);
        const legArrDepCtrlApiResponse = response.data;
        const { arr, dep } = getArrDepInfoWithVeiwRange({ legArrDepCtrlApiResponse, dispRangeFromLcl, dispRangeToLcl });
        if (!arr && !dep) {
            dispatch(exports.slice.actions.fetchFailure());
            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M40020C({ onOkButton: () => dispatch((0, exports.closeOalAircraftModal)()) }) });
            return;
        }
        dispatch(exports.slice.actions.fetchSuccess({ arr, dep }));
    }
    catch (error) {
        const statusCode = error instanceof webApi_1.ApiError && error.response ? error.response.status : null;
        dispatch(exports.slice.actions.fetchFailure());
        if (statusCode !== 404 && statusCode !== 409) {
            // 404, 409は、メッセージのボタンで閉じるため対象外
            dispatch((0, exports.closeOalAircraftModal)());
        }
    }
});
function getUpdateParams({ legInfo, formitems, }) {
    const oal2Legkey = {
        orgDateLcl: legInfo.orgDateLcl,
        alCd: legInfo.alCd,
        fltNo: legInfo.fltNo,
        casFltNo: legInfo.casFltNo,
        skdDepApoCd: legInfo.skdDepApoCd,
        skdArrApoCd: legInfo.skdArrApoCd,
        skdLegSno: legInfo.skdLegSno,
    };
    return {
        funcId: "S11303C",
        oal2Legkey,
        shipNo: formitems.shipNo.trim(),
        shipTypeIataCd: formitems.eqp.trim(),
        depInfo: null,
        arrInfo: null,
        dataOwnerCd: "SOALA",
    };
}
function getSoalaMessageTitle(legInfo) {
    return `${legInfo.casFltNo ? legInfo.casFltNo : `${legInfo.alCd}${(0, commonUtil_1.formatFltNo)(legInfo.fltNo)}`}/${(0, dayjs_1.default)(legInfo.orgDateLcl)
        .format("DDMMM")
        .toUpperCase()} ${legInfo.lstDepApoCd}-${legInfo.lstArrApoCd}`;
}
exports.getSoalaMessageTitle = getSoalaMessageTitle;
exports.updateOalAircraft = (0, toolkit_1.createAsyncThunk)("oalAircraft/updateOalAircraft", async (arg, thunkAPI) => {
    const formValue = arg;
    const { dispatch, getState } = thunkAPI;
    const { arr, dep, initialFormValues, targetSelect } = getState().oalAircraft;
    const callbacks = {
        onNotFoundRecord: () => dispatch((0, exports.closeOalAircraftModal)()),
    };
    dispatch(exports.slice.actions.resetStatusLabel());
    let hasConflict = false;
    let isDepSucceeded = dep.updateSucceeded;
    let isArrSucceeded = arr.updateSucceeded;
    const depFormitems = formValue.dep;
    const arrFormitems = targetSelect === "ARR_DEP_SAME" ? formValue.dep : formValue.arr;
    const isDepDirty = JSON.stringify(formValue.dep) !== JSON.stringify(initialFormValues.dep);
    const isArrDirty = targetSelect === "ARR_DEP_SAME" ? isDepDirty : JSON.stringify(formValue.arr) !== JSON.stringify(initialFormValues.arr);
    // Arrの更新処理
    if (isArrDirty && arr.legInfo && !arr.updateSucceeded) {
        dispatch(exports.slice.actions.updateArr());
        try {
            const requestParams = getUpdateParams({ legInfo: arr.legInfo, formitems: arrFormitems });
            const response = await webApi_1.WebApi.postOalFlightMovementEqp(dispatch, requestParams, callbacks, false);
            dispatch(exports.slice.actions.updateSuccessArr({ data: response.data, formValue }));
            if (response.data.skippedFlg) {
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30013C({ title: getSoalaMessageTitle(arr.legInfo) }) });
            }
            isArrSucceeded = true;
        }
        catch (error) {
            const statusCode = error instanceof webApi_1.ApiError && error.response ? error.response.status : null;
            dispatch(exports.slice.actions.updateFailureArr({ statusCode }));
            if (statusCode === 409) {
                hasConflict = true;
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50031C({ title: getSoalaMessageTitle(arr.legInfo) }) });
            }
            else {
                return;
            }
        }
    }
    else {
        isArrSucceeded = true;
    }
    // Depの更新処理（ArrDep同値変更の場合はArrの入力値を使用）
    if (isDepDirty && dep.legInfo && !dep.updateSucceeded) {
        dispatch(exports.slice.actions.updateDep());
        try {
            const requestParams = getUpdateParams({ legInfo: dep.legInfo, formitems: depFormitems });
            const response = await webApi_1.WebApi.postOalFlightMovementEqp(dispatch, requestParams, callbacks, false);
            dispatch(exports.slice.actions.updateSuccessDep({ data: response.data, formValue }));
            if (response.data.skippedFlg) {
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30013C({ title: getSoalaMessageTitle(dep.legInfo) }) });
            }
            isDepSucceeded = true;
        }
        catch (error) {
            const statusCode = error instanceof webApi_1.ApiError && error.response ? error.response.status : null;
            dispatch((0, exports.updateFailureDep)({ statusCode }));
            if (statusCode === 409) {
                hasConflict = true;
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50031C({ title: getSoalaMessageTitle(dep.legInfo) }) });
            }
            else {
                return;
            }
        }
    }
    else {
        isDepSucceeded = true;
    }
    if (isArrSucceeded && isDepSucceeded) {
        if (targetSelect === "ARR_DEP_SAME") {
            dispatch(exports.slice.actions.updateSuccessAll(formValue));
        }
        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30002C() });
    }
    else if (hasConflict) {
        notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M30012C({ onOkButton: () => { } }) });
    }
});
const initialState = {
    isOpen: false,
    seq: null,
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
    fetching: false,
    initialFormValues: {
        arr: {
            shipNo: "",
            eqp: "",
        },
        dep: {
            shipNo: "",
            eqp: "",
        },
    },
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "oalAircraft",
    initialState,
    reducers: {
        closeOalAircraftModal: (state) => {
            Object.assign(state, initialState);
        },
        targetSelected: (state, action) => {
            state.targetSelect = action.payload.target;
        },
        fetch: (_state, action) => ({
            ...initialState,
            isOpen: true,
            seq: action.payload.seq,
            fetching: true,
        }),
        fetchSuccess: (state, action) => {
            const { arr, dep } = action.payload;
            state.fetching = false;
            state.targetSelect = arr && !dep ? "ARR" : !arr && dep ? "DEP" : null;
            state.arr = {
                ...initialState.arr,
                legInfo: arr,
            };
            state.dep = {
                ...initialState.dep,
                legInfo: dep,
            };
            state.initialFormValues = {
                arr: {
                    shipNo: arr && arr.shipNo ? arr.shipNo : "",
                    eqp: arr ? arr.shipTypeIataCd : "",
                },
                dep: {
                    shipNo: dep && dep.shipNo ? dep.shipNo : "",
                    eqp: dep ? dep.shipTypeIataCd : "",
                },
            };
        },
        fetchFailure: (state) => {
            state.fetching = false;
        },
        updateArr: (state) => {
            state.arr = {
                ...state.arr,
                statusValue: null,
                updateSucceeded: false,
                hasError: false,
            };
        },
        updateDep: (state) => {
            state.dep = {
                ...state.dep,
                statusValue: null,
                updateSucceeded: false,
                hasError: false,
            };
        },
        updateSuccessArr: (state, action) => {
            // ArrDep同値変更の場合は、initialFormValueを変更しない。（dirtyのまま）
            const initialFormValues = state.targetSelect === "ARR_DEP_SAME"
                ? state.initialFormValues
                : {
                    ...action.payload.formValue,
                    arr: action.payload.formValue.arr,
                    dep: state.initialFormValues.dep,
                };
            state.arr = {
                ...state.arr,
                statusValue: action.payload.data.skippedFlg ? "Skipped" : "Updated",
                updateSucceeded: true,
                hasError: false,
            };
            state.initialFormValues = initialFormValues;
        },
        updateSuccessDep: (state, action) => {
            // ArrDep同値変更の場合は、initialFormValueを変更しない。（dirtyのまま）
            const initialFormValues = state.targetSelect === "ARR_DEP_SAME"
                ? state.initialFormValues
                : {
                    ...action.payload.formValue,
                    arr: state.initialFormValues.arr,
                    dep: action.payload.formValue.dep,
                };
            state.dep = {
                ...state.dep,
                statusValue: action.payload.data.skippedFlg ? "Skipped" : "Updated",
                updateSucceeded: true,
                hasError: false,
            };
            state.initialFormValues = initialFormValues;
        },
        updateSuccessAll: (state, action) => {
            state.initialFormValues = {
                ...action.payload,
            };
        },
        updateFailureArr: (state, action) => {
            state.arr = {
                ...state.arr,
                statusValue: action.payload.statusCode === 409 ? "Failed" : state.arr.statusValue,
                hasError: true,
            };
        },
        updateFailureDep: (state, action) => {
            state.dep = {
                ...state.dep,
                statusValue: action.payload.statusCode === 409 ? "Failed" : state.dep.statusValue,
                hasError: true,
            };
        },
        resetStatusLabel: (state) => {
            state.arr = {
                ...state.arr,
                statusValue: state.arr.statusValue === "Updated" || state.arr.statusValue === "Skipped" ? state.arr.statusValue : null,
            };
            state.dep = {
                ...state.dep,
                statusValue: state.dep.statusValue === "Updated" || state.dep.statusValue === "Skipped" ? state.dep.statusValue : null,
            };
        },
    },
});
_a = exports.slice.actions, exports.closeOalAircraftModal = _a.closeOalAircraftModal, exports.targetSelected = _a.targetSelected, exports.updateFailureDep = _a.updateFailureDep;
exports.default = exports.slice.reducer;
//# sourceMappingURL=oalAircraft.js.map