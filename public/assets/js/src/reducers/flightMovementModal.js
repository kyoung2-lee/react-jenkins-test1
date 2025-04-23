"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFlightMovementFailure = exports.updateFlightMovementSuccess = exports.fetchFlightMovementFailure = exports.fetchFlightMovementSuccess = exports.closeFlightMovementModal = exports.slice = exports.updateFlightIrregular = exports.updateFlightMovement = exports.showMessage = exports.openFlightMovementModal = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const lodash_uniq_1 = __importDefault(require("lodash.uniq"));
const notifications_1 = require("../lib/notifications");
const soalaMessages_1 = require("../lib/soalaMessages");
const webApi_1 = require("../lib/webApi");
const commonUtil_1 = require("../lib/commonUtil");
exports.openFlightMovementModal = (0, toolkit_1.createAsyncThunk)("flightMovementModal/openFlightMovmentModal", async (arg, thunkAPI) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { legKey, isDep } = arg;
    const { dispatch, getState } = thunkAPI;
    const { eLegList } = getState().flightSearch;
    const { fisRows } = getState().fis;
    const { fisState } = getState().mySchedule;
    let isOal = false;
    if (eLegList.length > 0) {
        isOal = (_b = (_a = eLegList.find((el) => el.alCd === legKey.alCd && el.fltNo === legKey.fltNo)) === null || _a === void 0 ? void 0 : _a.oalTblFlg) !== null && _b !== void 0 ? _b : isOal;
    }
    else if (fisRows.size > 0) {
        isOal =
            (_g = (isDep
                ? (_d = (_c = fisRows.find((fis) => { var _a; return ((_a = fis.dep) === null || _a === void 0 ? void 0 : _a.alCd) === legKey.alCd && fis.dep.fltNo === legKey.fltNo; })) === null || _c === void 0 ? void 0 : _c.dep) === null || _d === void 0 ? void 0 : _d.isOal
                : (_f = (_e = fisRows.find((fis) => { var _a; return ((_a = fis.arr) === null || _a === void 0 ? void 0 : _a.alCd) === legKey.alCd && fis.arr.fltNo === legKey.fltNo; })) === null || _e === void 0 ? void 0 : _e.arr) === null || _f === void 0 ? void 0 : _f.isOal)) !== null && _g !== void 0 ? _g : isOal;
    }
    else if (fisState === null || fisState === void 0 ? void 0 : fisState.fisRow) {
        isOal = (_k = (isDep ? (_h = fisState.fisRow.dep) === null || _h === void 0 ? void 0 : _h.isOal : (_j = fisState.fisRow.arr) === null || _j === void 0 ? void 0 : _j.isOal)) !== null && _k !== void 0 ? _k : isOal;
    }
    const onlineDbExpDays = isOal ? getState().account.master.oalOnlineDbExpDays : getState().account.master.onlineDbExpDays;
    const params = { ...legKey, funcId: "S10601C", onlineDbExpDays };
    dispatch(exports.slice.actions.fetchFlightMovement({ isDep }));
    try {
        // 便リマークスは、便詳細APIで取得している
        let movementInfo;
        if (isOal) {
            // eslint-disable-next-line no-await-in-loop
            const responseOal = await webApi_1.WebApi.getOalFlightMovement(dispatch, params);
            const { oal2Legkey, ...responseArg } = responseOal.data;
            movementInfo = { ...responseArg, legkey: oal2Legkey };
        }
        else {
            // eslint-disable-next-line no-await-in-loop
            const response = await webApi_1.WebApi.getFlightMovement(dispatch, params);
            movementInfo = response.data;
        }
        const formValue = convertToMovementInfoForm(movementInfo);
        dispatch((0, exports.fetchFlightMovementSuccess)({ movementInfo, formValue, isDep, isOal }));
    }
    catch (err) {
        dispatch((0, exports.fetchFlightMovementFailure)());
    }
});
/**
 * 取得APIのレスポンスデータを画面用フォームデータに変換する
 */
function convertToMovementInfoForm(movementInfo) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return {
        fisFltSts: movementInfo.fisFltSts,
        irrSts: movementInfo.irrSts,
        depInfo: {
            std: movementInfo.depInfo.stdLcl,
            etd: (movementInfo.depInfo.tentativeEtdCd ? movementInfo.depInfo.tentativeEtdLcl : movementInfo.depInfo.etdLcl) || "",
            etdCd: movementInfo.depInfo.tentativeEtdCd || "",
            atd: movementInfo.depInfo.atdLcl,
            depDlyRsnCd1: (_c = (_b = (_a = movementInfo.depInfo.depDlyInfo) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.depDlyTimeRsnCd) !== null && _c !== void 0 ? _c : "",
            depDlyRsnCd2: (_f = (_e = (_d = movementInfo.depInfo.depDlyInfo) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.depDlyTimeRsnCd) !== null && _f !== void 0 ? _f : "",
            depDlyRsnCd3: (_j = (_h = (_g = movementInfo.depInfo.depDlyInfo) === null || _g === void 0 ? void 0 : _g[2]) === null || _h === void 0 ? void 0 : _h.depDlyTimeRsnCd) !== null && _j !== void 0 ? _j : "",
            // depDlyRsnCd4: movementInfo.depInfo.depDlyInfo?.[3]?.depDlyTimeRsnCd ?? "",
            depDlyTime1: (0, commonUtil_1.convertTimeToHhmm)((_l = (_k = movementInfo.depInfo.depDlyInfo) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.depDlyTime),
            depDlyTime2: (0, commonUtil_1.convertTimeToHhmm)((_o = (_m = movementInfo.depInfo.depDlyInfo) === null || _m === void 0 ? void 0 : _m[1]) === null || _o === void 0 ? void 0 : _o.depDlyTime),
            depDlyTime3: (0, commonUtil_1.convertTimeToHhmm)((_q = (_p = movementInfo.depInfo.depDlyInfo) === null || _p === void 0 ? void 0 : _p[2]) === null || _q === void 0 ? void 0 : _q.depDlyTime),
            // depDlyTime4: convertTimeToHhmm(movementInfo.depInfo.depDlyInfo?.[3]?.depDlyTime),
            toTime: movementInfo.depInfo.actToLcl,
            estimateReturnIn: movementInfo.depInfo.estReturnInLcl,
            returnIn: movementInfo.depInfo.returnInLcl,
            firstBo: movementInfo.depInfo.firstAtdLcl,
            depApoSpotNo: movementInfo.depInfo.depApoSpotNo,
        },
        arrInfo: {
            sta: movementInfo.arrInfo.staLcl,
            eta: (movementInfo.arrInfo.tentativeEtaCd ? movementInfo.arrInfo.tentativeEtaLcl : movementInfo.arrInfo.etaLcl) || "",
            etaCd: movementInfo.arrInfo.tentativeEtaCd || "",
            etaLd: (movementInfo.arrInfo.tentativeEstLdCd ? movementInfo.arrInfo.tentativeEstLdLcl : movementInfo.arrInfo.estLdLcl) || "",
            etaLdCd: movementInfo.arrInfo.tentativeEstLdCd || "",
            etaLdTaxing: movementInfo.arrInfo.estBiLcl,
            ldTime: movementInfo.arrInfo.actLdLcl || "",
            ata: movementInfo.arrInfo.ataLcl,
            arrApoSpotNo: movementInfo.arrInfo.arrApoSpotNo,
            orgArrApoCd: movementInfo.irrSts === "DIV" ? movementInfo.arrInfo.lstArrApoCd : "",
            orgEtaLd: movementInfo.irrSts === "DIV" ? movementInfo.arrInfo.estLdLcl || "" : "",
        },
        selectedIrrSts: "",
        irrInfo: {
            estLd: "",
            lstArrApoCd: "",
        },
    };
}
/**
 * 画面用フォームデータを更新APIのリクエストのDepInfoに変換する
 */
function convertToPostMovementDepInfo(formValue) {
    const { depInfo } = formValue;
    const depDlyInfo = [];
    if (!depInfo.std || (depInfo.std && depInfo.atd && depInfo.std < depInfo.atd)) {
        if (!Number.isNaN(Number(depInfo.depDlyTime1)) && depInfo.depDlyRsnCd1) {
            depDlyInfo.push({
                depDlyTime: Number(depInfo.depDlyTime1),
                depDlyTimeRsnCd: depInfo.depDlyRsnCd1,
            });
        }
        if (!Number.isNaN(Number(depInfo.depDlyTime2)) && depInfo.depDlyRsnCd2) {
            depDlyInfo.push({
                depDlyTime: Number(depInfo.depDlyTime2),
                depDlyTimeRsnCd: depInfo.depDlyRsnCd2,
            });
        }
        if (!Number.isNaN(Number(depInfo.depDlyTime3)) && depInfo.depDlyRsnCd3) {
            depDlyInfo.push({
                depDlyTime: Number(depInfo.depDlyTime3),
                depDlyTimeRsnCd: depInfo.depDlyRsnCd3,
            });
        }
        // if (!Number.isNaN(Number(depInfo.depDlyTime4)) && depInfo.depDlyRsnCd4) {
        //   depDlyInfo.push({
        //     depDlyTime: Number(depInfo.depDlyTime4),
        //     depDlyTimeRsnCd: depInfo.depDlyRsnCd4,
        //   });
        // }
    }
    depDlyInfo.sort((a, b) => {
        if (a.depDlyTime !== b.depDlyTime) {
            return b.depDlyTime - a.depDlyTime;
        }
        return a.depDlyTimeRsnCd.localeCompare(b.depDlyTimeRsnCd);
    });
    return {
        stdLcl: depInfo.std,
        etdLcl: depInfo.etdCd ? null : depInfo.etd,
        tentativeEtdLcl: depInfo.etdCd ? depInfo.etd : null,
        tentativeEtdCd: depInfo.etdCd ? depInfo.etdCd : null,
        atdLcl: depInfo.atd,
        actToLcl: depInfo.toTime,
        depDlyInfo,
        firstAtdLcl: depInfo.firstBo,
        returnInLcl: depInfo.returnIn,
        estReturnInLcl: depInfo.estimateReturnIn,
    };
}
/**
 * 画面用フォームデータを更新APIのリクエストのArrInfoに変換する
 */
function convertToPostMovementArrInfo(formValue, isAtbOrDiv) {
    const { arrInfo } = formValue;
    const partialArrInfo = {
        staLcl: arrInfo.sta,
        estBiLcl: arrInfo.etaLdTaxing,
        tentativeEstLdLcl: arrInfo.etaLdCd ? arrInfo.etaLd : null,
        tentativeEstLdCd: arrInfo.etaLdCd ? arrInfo.etaLdCd : null,
        estLdLcl: arrInfo.etaLdCd ? null : arrInfo.etaLd,
        actLdLcl: arrInfo.ldTime,
        ataLcl: arrInfo.ata,
    };
    const fullArrInfo = {
        ...partialArrInfo,
        etaLcl: arrInfo.etaCd ? null : arrInfo.eta,
        tentativeEtaLcl: arrInfo.etaCd ? arrInfo.eta : null,
        tentativeEtaCd: arrInfo.etaCd ? arrInfo.etaCd : null,
    };
    // API側の都合上、ATB・DIVの場合には、etaLcl・tentativeEtaLcl・tentativeEtaCdを受け渡さないようにする（#15798）
    return isAtbOrDiv ? partialArrInfo : fullArrInfo;
}
/**
 * 画面用フォームデータをイレギュラー情報更新APIのリクエストのirrStsに変換する
 */
function convertToPostIrregularIrrSts(formValue) {
    if (formValue.selectedIrrSts === "DIV" || formValue.selectedIrrSts === "DIV COR") {
        return "DIV";
    }
    if (formValue.selectedIrrSts === "ATB" || formValue.selectedIrrSts === "GTB") {
        return formValue.selectedIrrSts;
    }
    return null;
}
exports.showMessage = (0, toolkit_1.createAsyncThunk)("flightMovementModal/showMessage", (arg, thunkAPI) => {
    const { message } = arg;
    const { dispatch } = thunkAPI;
    notifications_1.NotificationCreator.create({ dispatch, message });
});
/**
 * 他社便動態情報を更新する
 */
exports.updateFlightMovement = (0, toolkit_1.createAsyncThunk)("flightMovementModal/updateFlightMovement", async (arg, thunkAPI) => {
    const { formValue, callbacks } = arg;
    const { dispatch, getState } = thunkAPI;
    const { isDep, isOal, movementInfo } = getState().flightMovementModal;
    const isAtbOrDiv = (movementInfo === null || movementInfo === void 0 ? void 0 : movementInfo.irrSts) === "ATB" || (movementInfo === null || movementInfo === void 0 ? void 0 : movementInfo.irrSts) === "DIV";
    dispatch(exports.slice.actions.updateOalFlightMovement());
    notifications_1.NotificationCreator.removeAll({ dispatch });
    if (!movementInfo) {
        dispatch((0, exports.updateFlightMovementFailure)({ updateValidationErrors: [] }));
        return;
    }
    try {
        const depInfo = isDep ? convertToPostMovementDepInfo(formValue) : null;
        const arrInfo = !isDep ? convertToPostMovementArrInfo(formValue, isAtbOrDiv) : null;
        if (isOal) {
            // API呼び出し
            await webApi_1.WebApi.postOalFlightMovement(dispatch, {
                funcId: "S10601P1",
                oal2Legkey: movementInfo.legkey,
                fisFltSts: formValue.fisFltSts || "",
                depInfo,
                arrInfo,
                dataOwnerCd: "SOALA",
            }, callbacks);
        }
        else {
            // API呼び出し
            await webApi_1.WebApi.postFlightMovement(dispatch, {
                funcId: "S10601P1",
                legkey: movementInfo.legkey,
                fisFltSts: formValue.fisFltSts || "",
                depInfo,
                arrInfo,
                dataOwnerCd: "SOALA",
            }, callbacks);
        }
        dispatch((0, exports.updateFlightMovementSuccess)());
    }
    catch (err) {
        let updateValidationErrors = [];
        if (err instanceof webApi_1.ApiError && err.response) {
            // 409（コンフリクト）エラーの場合、エラーメッセージを表示する
            if (err.response.status === 409) {
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50031C({}) });
                // 422（バリデーション）エラーの場合、エラーメッセージを表示する
            }
            else if (err.response.status === 422) {
                const data = err.response.data || null;
                if (data && data.errors) {
                    data.errors.forEach((error) => {
                        updateValidationErrors = updateValidationErrors.concat(error.errorItems);
                        // メッセージを表示
                        error.errorMessages.forEach((errorText) => {
                            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50029C({ title: "", errorText }) });
                        });
                    });
                    updateValidationErrors = (0, lodash_uniq_1.default)(updateValidationErrors);
                }
            }
        }
        dispatch((0, exports.updateFlightMovementFailure)({ updateValidationErrors }));
    }
});
exports.updateFlightIrregular = (0, toolkit_1.createAsyncThunk)("flightMovementModal/updateFlightIrregular", async (arg, thunkAPI) => {
    const { formValue, callbacks } = arg;
    const { dispatch, getState } = thunkAPI;
    const { movementInfo, isOal } = getState().flightMovementModal;
    dispatch(exports.slice.actions.updateOalFlightMovement());
    notifications_1.NotificationCreator.removeAll({ dispatch });
    if (!movementInfo) {
        dispatch((0, exports.updateFlightMovementFailure)({ updateValidationErrors: [] }));
        return;
    }
    try {
        if (isOal) {
            await webApi_1.WebApi.postOalFlightIrregularUpdate(dispatch, {
                funcId: "S10602C",
                oal2Legkey: movementInfo.legkey,
                irrSts: convertToPostIrregularIrrSts(formValue),
                arrInfo: {
                    estLdLcl: formValue.irrInfo.estLd || null,
                    lstArrApoCd: formValue.irrInfo.lstArrApoCd || null,
                },
                dataOwnerCd: "SOALA",
            }, callbacks);
            dispatch((0, exports.updateFlightMovementSuccess)());
        }
    }
    catch (err) {
        let updateValidationErrors = [];
        if (err instanceof webApi_1.ApiError && err.response) {
            // 409（コンフリクト）エラーの場合、エラーメッセージを表示する
            if (err.response.status === 409) {
                notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50031C({}) });
                // 422（バリデーション）エラーの場合、エラーメッセージを表示する
            }
            else if (err.response.status === 422) {
                const data = err.response.data || null;
                if (data && data.errors) {
                    data.errors.forEach((error) => {
                        updateValidationErrors = updateValidationErrors.concat(error.errorItems);
                        // メッセージを表示
                        error.errorMessages.forEach((errorText) => {
                            notifications_1.NotificationCreator.create({ dispatch, message: soalaMessages_1.SoalaMessage.M50029C({ title: "", errorText }) });
                        });
                    });
                    updateValidationErrors = (0, lodash_uniq_1.default)(updateValidationErrors);
                }
            }
        }
        dispatch((0, exports.updateFlightMovementFailure)({ updateValidationErrors }));
    }
});
const initialState = {
    isOpen: false,
    isFetching: false,
    movementInfo: undefined,
    initialFormValue: {
        fisFltSts: "",
        irrSts: "",
        depInfo: {
            std: "",
            etd: "",
            etdCd: "",
            atd: "",
            depDlyTime1: "",
            depDlyTime2: "",
            depDlyTime3: "",
            // depDlyTime4: "",
            depDlyRsnCd1: "",
            depDlyRsnCd2: "",
            depDlyRsnCd3: "",
            // depDlyRsnCd4: "",
            toTime: "",
            estimateReturnIn: "",
            returnIn: "",
            firstBo: "",
            depApoSpotNo: "",
        },
        arrInfo: {
            sta: "",
            eta: "",
            etaCd: "",
            etaLd: "",
            etaLdCd: "",
            etaLdTaxing: "",
            ldTime: "",
            ata: "",
            arrApoSpotNo: "",
            orgArrApoCd: "",
            orgEtaLd: "",
        },
        selectedIrrSts: "",
        irrInfo: {
            estLd: "",
            lstArrApoCd: "",
        },
    },
    isDep: undefined,
    updateValidationErrors: [],
    isOal: undefined,
};
exports.slice = (0, toolkit_1.createSlice)({
    name: "flightMovementModal",
    initialState,
    reducers: {
        closeFlightMovementModal: (state) => {
            Object.assign(state, initialState);
        },
        fetchFlightMovement: (state, action) => {
            const { isDep } = action.payload;
            state.isOpen = true;
            state.isFetching = true;
            state.isDep = isDep;
        },
        fetchFlightMovementSuccess: (state, action) => {
            const { movementInfo, formValue, isDep, isOal } = action.payload;
            state.isOpen = true;
            state.isFetching = false;
            state.movementInfo = movementInfo;
            state.initialFormValue = formValue;
            state.isDep = isDep;
            state.updateValidationErrors = [];
            state.isOal = isOal;
        },
        fetchFlightMovementFailure: (state) => {
            Object.assign(state, initialState);
        },
        updateOalFlightMovement: (state) => {
            state.isFetching = true;
        },
        updateFlightMovementSuccess: (state) => {
            Object.assign(state, initialState);
        },
        updateFlightMovementFailure: (state, action) => {
            const { updateValidationErrors } = action.payload;
            state.isFetching = false;
            state.updateValidationErrors = updateValidationErrors;
        },
    },
});
_a = exports.slice.actions, exports.closeFlightMovementModal = _a.closeFlightMovementModal, exports.fetchFlightMovementSuccess = _a.fetchFlightMovementSuccess, exports.fetchFlightMovementFailure = _a.fetchFlightMovementFailure, exports.updateFlightMovementSuccess = _a.updateFlightMovementSuccess, exports.updateFlightMovementFailure = _a.updateFlightMovementFailure;
exports.default = exports.slice.reducer;
//# sourceMappingURL=flightMovementModal.js.map