"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_uniq_1 = __importDefault(require("lodash.uniq"));
const hooks_1 = require("../../store/hooks");
const issueSecurityExports = __importStar(require("../../reducers/issueSecurity"));
const issueSecurity_1 = require("../../reducers/issueSecurity");
const account_1 = require("../../reducers/account");
const icon_issue_dic_svg_1 = __importDefault(require("../../assets/images/icon/icon-issue_dic.svg"));
const icon_issue_rwy_svg_1 = __importDefault(require("../../assets/images/icon/icon-issue_rwy.svg"));
const icon_issue_sec_svg_1 = __importDefault(require("../../assets/images/icon/icon-issue_sec.svg"));
const icon_issue_ssp_svg_1 = __importDefault(require("../../assets/images/icon/icon-issue_ssp.svg"));
const icon_issue_sww_svg_1 = __importDefault(require("../../assets/images/icon/icon-issue_sww.svg"));
const icon_issue_tsw_svg_1 = __importDefault(require("../../assets/images/icon/icon-issue_tsw.svg"));
const validates = __importStar(require("../../lib/validators"));
const myValidates = __importStar(require("../../lib/validators/issueSecurityValidator"));
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const soalaMessages_1 = require("../../lib/soalaMessages");
const notifications_1 = require("../../lib/notifications");
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const RadioButton_1 = __importDefault(require("../atoms/RadioButton"));
const SelectBox_1 = __importDefault(require("../atoms/SelectBox"));
const TextArea_1 = __importDefault(require("../atoms/TextArea"));
const TextInput_1 = __importDefault(require("../atoms/TextInput"));
const ToggleInput_1 = __importDefault(require("../atoms/ToggleInput"));
const CloseButton_1 = __importDefault(require("../atoms/CloseButton"));
const UploadFilesComponent_1 = __importDefault(require("../molecules/UploadFilesComponent"));
const MultipleCreatableInput_1 = __importDefault(require("../atoms/MultipleCreatableInput"));
const MultipleSelectBox_1 = __importDefault(require("../atoms/MultipleSelectBox"));
const MAIL_ADDRESS_GROUP_ITEM_MAX = 4;
const MAIL_ADDITIONAL_ADDRESS_ITEM_MAX = 8;
const TTY_ADDRESS_GROUP_ITEM_MAX = 4;
const TTY_ADDITIONAL_ADDRESS_ITEM_MAX = 100;
const FORM_NAME = "issueSecurity";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _issueSecurityDefault, slice: _issueSecuritySlice, ...issueSecurityActions } = issueSecurityExports;
const IssueSecurity = (props) => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const [isForceErrorMailAddrGrpList, setIsForceErrorMailAddrGrpList] = (0, react_1.useState)(false);
    const [isForceErrorTtyAddrGrpList, setIsForceErrorTtyAddrGrpList] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const componentDidMount = async () => {
            await dispatch((0, account_1.reloadMaster)({
                user: props.jobAuthUser,
                // eslint-disable-next-line no-bitwise
                masterGetType: commonConst_1.Const.MasterGetType.COMM_GRP | commonConst_1.Const.MasterGetType.ADGRP,
            }));
            void dispatch((0, issueSecurity_1.getAirportIssue)({ apoCd: props.jobAuthUser.myApoCd }));
            dispatch((0, issueSecurity_1.setCheckHasDifference)({ data: setCheckHasDifferenceData }));
            change("mailCCSenderAddressChecked", storage_1.storage.airPortIssueEmailCCSenderAddressChecked);
            change("ttyCCSenderAddressChecked", storage_1.storage.airPortIssueTtyCCSenderAddressChecked);
        };
        void componentDidMount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        const { apoTimeLcl } = props.headerInfo;
        props.change("issuTime", apoTimeLcl ? (0, dayjs_1.default)(apoTimeLcl).format("HHmm") : "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headerInfo.apoTimeLcl]);
    const setCheckHasDifferenceData = () => {
        const { issuCdValue, issuDtlCdValue } = props;
        const currentParams = createAirportIssueRequestParams(false);
        const initialParams = getTemplate(issuCdValue, issuDtlCdValue);
        return checkHasDifference(currentParams, initialParams);
    };
    const openEmailModal = () => {
        const { formValues } = props;
        const targetFields = ["mailAddrList", "mailAddrGrpList"];
        const hasError = showValidationError(targetFields, true);
        if (!hasError) {
            const mailAddrGrpIdList = formValues.mailAddrGrpList || [];
            const mailAddrList = getMailAddrList(true);
            notifications_1.NotificationCreator.removeAll({ dispatch });
            void dispatch((0, issueSecurity_1.getMailAddress)({ params: { mailAddrGrpIdList, mailAddrList } }));
        }
    };
    /**
     * 対象のFieldsのエラーをメッセージIDの重複を省いてreapopを表示する
     * また、エラーがあるかどうかをbooleanで返す
     */
    const showValidationError = (targetFields, isTamplate) => {
        const { formSyncErrors, formValues } = props;
        const targetErrorFields = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messageObject = [];
        const mailFlg = formValues.mailFlg || false;
        const ttyFlg = formValues.ttyFlg || false;
        for (let i = 0; i < targetFields.length; i++) {
            const fildName = targetFields[i];
            const messageFunction = formSyncErrors[fildName];
            if (messageFunction) {
                let item = "";
                if (fildName.match(/^mail.*|^orgnMail.*|^email.*/)) {
                    if (!mailFlg)
                        continue;
                    item = "email";
                }
                else if (fildName.match(/^tty.*|^orgnTty.*/)) {
                    if (!ttyFlg)
                        continue;
                    item = "TTY";
                }
                if (isTamplate &&
                    fildName.match(/^mailAddr.*|^ttyAddr.*/) &&
                    !(Array.isArray(formValues[fildName]) && formValues[fildName].length > 0)) {
                    continue;
                }
                targetErrorFields.push(fildName);
                // ワーニングの重複確認
                const hasDate = messageObject.some((target, j) => {
                    if (target.messageFunction === messageFunction) {
                        // itemの重複確認
                        const hasSameType = messageObject[j].items.some((targetType) => targetType === item);
                        if (!hasSameType) {
                            if (item === "email") {
                                messageObject[j].items.unshift(item);
                            }
                            else if (item === "TTY") {
                                messageObject[j].items.push(item);
                            }
                        }
                        return true;
                    }
                    return false;
                });
                if (!hasDate) {
                    messageObject.push({ messageFunction, items: [item] });
                }
            }
        }
        // submitエラーとして対象のFieldをsubmitFailed状態にする(赤くする)
        void dispatch((0, issueSecurity_1.submitFailedField)({ fields: targetErrorFields }));
        for (let i = 0; i < messageObject.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { messageFunction, items } = messageObject[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            void dispatch((0, issueSecurity_1.showMessage)({ message: messageFunction({ items }) }));
        }
        const hasError = !!messageObject.length;
        return hasError;
    };
    const openTtyModal = () => {
        const { formValues } = props;
        const targetFields = ["ttyAddrList", "ttyAddrGrpList"];
        const hasError = showValidationError(targetFields, true);
        if (!hasError) {
            const ttyAddrGrpIdList = formValues.ttyAddrGrpList || [];
            const ttyAddrList = getTtyAddrList(true);
            notifications_1.NotificationCreator.removeAll({ dispatch });
            void dispatch((0, issueSecurity_1.getTtyAddress)({ params: { ttyAddrGrpIdList, ttyAddrList } }));
        }
    };
    const handleTab = (tab) => {
        props.change("tab", tab);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyPress = (values) => values.map((value) => (0, commonUtil_1.toUpperCase)(value));
    /** IssuCd変更時、修正中の場合内容破棄確認をして入力内容を初期化 */
    const onChangeIssuCd = (prevIssuCdValue) => {
        if (prevIssuCdValue) {
            const currentParams = createAirportIssueRequestParams(false);
            const initialParams = getTemplate(prevIssuCdValue, props.issuDtlCdValue);
            const hasDifference = checkHasDifference(currentParams, initialParams);
            if (hasDifference) {
                void dispatch((0, issueSecurity_1.showMessage)({
                    message: soalaMessages_1.SoalaMessage.M40003C({
                        onYesButton: () => {
                            resetAllIssuDtlCd();
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useTemplate();
                        },
                        onNoButton: () => props.change("issuCd", prevIssuCdValue),
                    }),
                }));
            }
            else {
                // 差分がない場合(未修正)
                resetAllIssuDtlCd();
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useTemplate();
            }
        }
        else {
            // prevIssuCdValueがない場合(初回)
            resetAllIssuDtlCd();
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useTemplate();
        }
    };
    const resetAllIssuDtlCd = () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change } = props;
        change("SWW", "");
        change("TSW", "");
        change("DIC", "");
        change("RCL", "");
        change("SSP", "");
        change("SEC", "");
    };
    /** IssuDtlCd変更時、修正中の場合内容破棄確認をして選択したIssuDtlCdのテンプレートを利用 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onChangeIssuDtlCd = (e, prevIssuDtlCd) => {
        if (e) {
            const { issuCdValue } = props;
            if (prevIssuDtlCd) {
                const currentParams = createAirportIssueRequestParams(false);
                const initialParams = getTemplate(issuCdValue, prevIssuDtlCd);
                const hasDifference = checkHasDifference(currentParams, initialParams);
                if (hasDifference) {
                    void dispatch((0, issueSecurity_1.showMessage)({
                        message: soalaMessages_1.SoalaMessage.M40003C({
                            // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-unsafe-member-access
                            onYesButton: () => useTemplate(e.target.name, e.target.value),
                            onNoButton: () => props.change(issuCdValue, prevIssuDtlCd),
                        }),
                    }));
                }
                else {
                    // 差分がない場合(未修正)
                    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-unsafe-member-access
                    useTemplate(e.target.name, e.target.value);
                }
            }
            else {
                // prevIssuDtlCdがない場合(初回)
                // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-unsafe-member-access
                useTemplate(e.target.name, e.target.value);
            }
        }
    };
    const onChangeMailAddrGrpList = () => {
        setIsForceErrorMailAddrGrpList(false);
    };
    const onChangeTtyAddrGrpList = () => {
        setIsForceErrorTtyAddrGrpList(false);
    };
    const useTemplate = (issuCd, issuDtlCd) => {
        useTemplateEmail(issuCd, issuDtlCd);
        useTemplateTty(issuCd, issuDtlCd);
    };
    const useTemplateEmail = (issuCd, issuDtlCd, isExclusionSendType) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change } = props;
        const template = getTemplate(issuCd, issuDtlCd);
        setIsForceErrorMailAddrGrpList(false);
        change("mailTitl", template.mailTitl || "");
        change("mailText", template.mailText || "");
        change("emailFile", []);
        // Swich切り替えの場合は、mailFlgとttyFlgをテンプレートで初期化しない
        if (!isExclusionSendType) {
            change("mailFlg", !!template.mailFlg || false);
        }
        const selectMailAddrGrpList = props.issueSecurity.airportIssue.mailAddrGrpList;
        const mailAddrGrpList = (0, lodash_uniq_1.default)((template.mailAddrGrpList || [])
            .map((mailAddrGrp) => mailAddrGrp !== undefined && selectMailAddrGrpList.some((o) => o.value === String(mailAddrGrp)) ? `${mailAddrGrp}` : null)
            .filter((mailAddrGrp) => !!mailAddrGrp));
        const mailAddrList = (0, lodash_uniq_1.default)((template.mailAddrList || []).filter((mailAddr) => !!mailAddr));
        change("mailAddrGrpList", mailAddrGrpList);
        change("mailAddrList", mailAddrList);
    };
    const useTemplateTty = (issuCd, issuDtlCd, isExclusionSendType) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change, jobAuthUser: { ttyAddr }, } = props;
        const template = getTemplate(issuCd, issuDtlCd);
        // Swich切り替えの場合は、mailFlgとttyFlgをテンプレートで初期化しない
        if (!isExclusionSendType) {
            change("ttyFlg", !!template.ttyFlg || false);
        }
        setIsForceErrorTtyAddrGrpList(false);
        change("ttyText", template.ttyText || "");
        const selectPriorities = (0, commonUtil_1.getPriorities)(props.master.cdCtrlDtls);
        change("ttyPriorityCd", selectPriorities.some((o) => o.value === template.ttyPriorityCd) ? template.ttyPriorityCd : "");
        change("orgnTtyAddr", ttyAddr);
        const selectTtyAddrGrpList = props.issueSecurity.airportIssue.ttyAddrGrpList;
        const ttyAddrGrpList = (0, lodash_uniq_1.default)((template.ttyAddrGrpList || [])
            .map((ttyAddrGrp) => ttyAddrGrp !== undefined && selectTtyAddrGrpList.some((o) => o.value === String(ttyAddrGrp)) ? `${ttyAddrGrp}` : null)
            .filter((ttyAddrGrp) => !!ttyAddrGrp));
        const ttyAddrList = (0, lodash_uniq_1.default)((template.ttyAddrList || []).filter((addr) => !!addr));
        change("ttyAddrGrpList", ttyAddrGrpList);
        change("ttyAddrList", ttyAddrList);
    };
    const saveTemplate = () => {
        const { formValues } = props;
        const allFields = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const formKey of Object.keys(formValues)) {
            allFields.push(formKey);
        }
        const targetFields = allFields.filter((field) => field !== "issuTime");
        const hasError = showValidationError(targetFields, true);
        if (!hasError) {
            const mailFlg = formValues.mailFlg || false;
            const ttyFlg = formValues.ttyFlg || false;
            const issueType = mailFlg && !ttyFlg ? '"e-mail"' : !mailFlg && ttyFlg ? '"TTY"' : "";
            const palams = {
                apoCd: props.jobAuthUser.myApoCd,
                issuCd: formValues.issuCd || "",
                issuDtlCd: props.issuDtlCdValue,
                mailFlg,
                ttyFlg,
                mailAddrGrpList: mailFlg ? formValues.mailAddrGrpList || [] : undefined,
                mailAddrList: mailFlg ? formValues.mailAddrList || [] : undefined,
                mailTitl: mailFlg ? formValues.mailTitl : undefined,
                mailText: mailFlg ? formValues.mailText : undefined,
                ttyAddrGrpList: ttyFlg ? formValues.ttyAddrGrpList || [] : undefined,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ttyAddrList: ttyFlg ? formValues.ttyAddrList || [] : undefined,
                ttyPriorityCd: ttyFlg ? formValues.ttyPriorityCd : undefined,
                ttyText: ttyFlg ? formValues.ttyText : undefined,
            };
            notifications_1.NotificationCreator.removeAll({ dispatch });
            void dispatch((0, issueSecurity_1.showMessage)({
                message: soalaMessages_1.SoalaMessage.M30004C({
                    issueType,
                    onYesButton: () => {
                        void dispatch((0, issueSecurity_1.saveTemplate)(palams));
                    },
                }),
            }));
        }
    };
    const getIssuMailFileList = (emailFiles) => {
        const issuMailFileList = [];
        if (emailFiles) {
            for (let i = 0; i < emailFiles.length; i++) {
                issuMailFileList.push({
                    issuMailFileName: emailFiles[i].fileName,
                    issuMailFile: emailFiles[i].object,
                });
            }
            return issuMailFileList.length ? issuMailFileList : undefined;
        }
        return undefined;
    };
    const updateSendAirportIssue = () => {
        const { formValues, formSyncErrors } = props;
        const allFields = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const formKey of Object.keys(formValues)) {
            allFields.push(formKey);
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const formKey of Object.keys(formSyncErrors)) {
            allFields.push(formKey);
        }
        const hasError = showValidationError(allFields, false);
        if (!hasError) {
            const { jobAuthUser, issueSecurity } = props;
            if (formValues.issuCd && formValues.issuTime) {
                const palams = createAirportIssueRequestParams(true);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                palams.issuMailFileList = getIssuMailFileList(formValues.emailFile);
                const lastLiqest = issueSecurity.lastUpdateSendAirportIssueRequest;
                const hasChange = checkHasDifference(palams, lastLiqest);
                notifications_1.NotificationCreator.removeAll({ dispatch });
                const onYesButton = async () => {
                    const { mailFlg, ttyFlg } = palams;
                    if (mailFlg) {
                        const mailAddrGrpIdList = palams.mailAddrGrpList || [];
                        const mailAddrList = palams.mailAddrList || [];
                        setIsForceErrorMailAddrGrpList(false);
                        const res = await dispatch((0, issueSecurity_1.getMailAddress)({ params: { mailAddrGrpIdList, mailAddrList }, showModal: false })).unwrap();
                        if (res && res.mailAddrList) {
                            if (res.mailAddrList.length === 0) {
                                setIsForceErrorMailAddrGrpList(true);
                                props.touch(FORM_NAME, "mailAddrGrpList");
                                void dispatch((0, issueSecurity_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M50034C({}) }));
                                return;
                            }
                        }
                        else {
                            return;
                        }
                    }
                    if (ttyFlg) {
                        const ttyAddrGrpIdList = palams.ttyAddrGrpList || [];
                        const ttyAddrList = palams.ttyAddrList || [];
                        setIsForceErrorTtyAddrGrpList(false);
                        const res = await dispatch((0, issueSecurity_1.getTtyAddress)({ params: { ttyAddrGrpIdList, ttyAddrList }, showModal: false })).unwrap();
                        if (res && res.ttyAddrList) {
                            if (res.ttyAddrList.length === 0) {
                                setIsForceErrorTtyAddrGrpList(true);
                                props.touch(FORM_NAME, "ttyAddrGrpList");
                                void dispatch((0, issueSecurity_1.showMessage)({ message: soalaMessages_1.SoalaMessage.M50034C({}) }));
                                return;
                            }
                        }
                        else {
                            return;
                        }
                    }
                    void dispatch((0, issueSecurity_1.updateSendAirportIssue)({ params: palams, apoCd: jobAuthUser.myApoCd }));
                };
                if (hasChange) {
                    void dispatch((0, issueSecurity_1.showMessage)({
                        message: soalaMessages_1.SoalaMessage.M30005C({
                            onYesButton: () => {
                                void onYesButton();
                            },
                        }),
                    }));
                }
                else {
                    void dispatch((0, issueSecurity_1.showMessage)({
                        message: soalaMessages_1.SoalaMessage.M30006C({
                            onYesButton: () => {
                                void onYesButton();
                            },
                        }),
                    }));
                }
            }
        }
    };
    /** リクエストパラメーターの形式のオブジェクトの差分の有無を確認 */
    const checkHasDifference = (currentParams, initialParams, exclusions = []) => {
        if (!currentParams && !initialParams) {
            // 比較対象のどちらもない場合、差分なし
            return false;
        }
        if (props.emailFileValue.length) {
            // 添付ファイルがある場合、差分あり
            return true;
        }
        if (currentParams && initialParams) {
            let hasChange = false;
            // eslint-disable-next-line no-restricted-syntax
            for (const palamKey of Object.keys(currentParams)) {
                const isExclusions = exclusions.some((exclusion) => exclusion === palamKey);
                if (isExclusions) {
                    // 対象外(isExclusion)のものは差分が確認をしない
                }
                else if (palamKey === "issuCd" || palamKey === "issuDtlCd" || palamKey === "issuTime") {
                    // issuCd issuDtlCd issuTimeの差分は確認しない
                }
                else if (toString.call(currentParams[palamKey]) === "[object Array]") {
                    // 配列の場合、for分で中の差分の確認
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    for (let i = 0; i < currentParams[palamKey].length; i++) {
                        if (!initialParams[palamKey] ||
                            (currentParams[palamKey] &&
                                initialParams[palamKey] &&
                                // eslint-disable-next-line eqeqeq
                                currentParams[palamKey][i] != initialParams[palamKey][i])) {
                            hasChange = true;
                            break;
                        }
                    }
                }
                else if (currentParams[palamKey] === undefined &&
                    initialParams[palamKey] &&
                    initialParams[palamKey].length === 0) {
                    // 空の配列とundefinedは同じと扱い、差分はないものとする
                    // eslint-disable-next-line eqeqeq
                }
                else if (currentParams[palamKey] != initialParams[palamKey]) {
                    // undefined と nullを同じとして扱う
                    // 差分を確認
                    hasChange = true;
                }
            }
            return hasChange;
        }
        // currentParamsとinitialParamsのどちらかのみ存在する場合、差分あり
        return true;
    };
    /** テンプレートをAirportIssueのリクエストパラメーター形式で取得 */
    const getTemplate = (issuCd, issuDtlCd) => {
        const { formValues, jobAuthUser: { myApoCd, mailAddr, ttyAddr }, issueSecurity: { airportIssue }, } = props;
        let issuTemplate;
        if (airportIssue && airportIssue.issuTemplateList) {
            issuTemplate =
                airportIssue.issuTemplateList.find((template) => template.issuCd === issuCd && template.issuDtlCd === issuDtlCd) || undefined;
        }
        return {
            apoCd: myApoCd,
            issuCd,
            issuDtlCd,
            issuTime: formValues && formValues.issuTime ? formValues.issuTime : "",
            mailFlg: issuTemplate && issuTemplate.mailFlg ? issuTemplate.mailFlg : false,
            ttyFlg: issuTemplate && issuTemplate.ttyFlg ? issuTemplate.ttyFlg : false,
            mailAddrGrpList: issuTemplate && issuTemplate.mailAddrGrpList ? issuTemplate.mailAddrGrpList : undefined,
            mailAddrList: issuTemplate && issuTemplate.mailAddrList ? issuTemplate.mailAddrList : undefined,
            orgnMailAddr: mailAddr,
            mailTitl: issuTemplate && issuTemplate.mailTitl ? issuTemplate.mailTitl : undefined,
            mailText: issuTemplate && issuTemplate.mailText ? issuTemplate.mailText : undefined,
            issuMailFileList: undefined,
            ttyAddrGrpList: issuTemplate && issuTemplate.ttyAddrGrpList ? issuTemplate.ttyAddrGrpList : undefined,
            ttyAddrList: issuTemplate && issuTemplate.ttyAddrList ? issuTemplate.ttyAddrList : undefined,
            ttyPriorityCd: issuTemplate && (issuTemplate.ttyPriorityCd || issuTemplate.ttyPriorityCd === "") ? issuTemplate.ttyPriorityCd : "QU",
            orgnTtyAddr: ttyAddr,
            ttyText: issuTemplate && issuTemplate.ttyText ? issuTemplate.ttyText : undefined,
        };
    };
    const createAirportIssueRequestParams = (ccIncluded) => {
        const { formValues } = props;
        return {
            apoCd: props.jobAuthUser.myApoCd,
            issuCd: formValues.issuCd || "",
            issuDtlCd: props.issuDtlCdValue,
            issuTime: formValues.issuTime || "",
            mailFlg: formValues.mailFlg || false,
            ttyFlg: formValues.ttyFlg || false,
            mailAddrGrpList: formValues.mailAddrGrpList || [],
            mailAddrList: getMailAddrList(ccIncluded),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            orgnMailAddr: formValues.orgnMailAddr,
            mailTitl: formValues.mailTitl,
            mailText: formValues.mailText,
            issuMailFileList: undefined,
            ttyAddrGrpList: formValues.ttyAddrGrpList || [],
            ttyAddrList: getTtyAddrList(ccIncluded),
            ttyPriorityCd: formValues.ttyPriorityCd,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            orgnTtyAddr: formValues.orgnTtyAddr,
            ttyText: (0, commonUtil_1.removeTtyComment)((0, commonUtil_1.convertLineFeedCodeToCRLF)(formValues.ttyText)),
        };
    };
    const confirmationSwich = (fieldName) => {
        const isEmail = fieldName === "mailFlg";
        const swichFlg = isEmail ? props.mailFlgValue : props.ttyFlgValue;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change } = props;
        const changeSwitch = () => {
            change(fieldName, !swichFlg);
            const { issuCdValue, issuDtlCdValue } = props;
            if (isEmail) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useTemplateEmail(issuCdValue, issuDtlCdValue, true);
            }
            else {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useTemplateTty(issuCdValue, issuDtlCdValue, true);
            }
        };
        if (swichFlg) {
            const { issuCdValue, issuDtlCdValue } = props;
            const currentParams = createAirportIssueRequestParams(false);
            const initialParams = getTemplate(issuCdValue, issuDtlCdValue);
            const exclusions = ["mailFlg", "ttyFlg"];
            Array.prototype.push.apply(exclusions, isEmail
                ? ["ttyAddrGrpList", "ttyAddrList", "ttyPriorityCd", "orgnTtyAddr", "ttyText"] // メールの場合は、TTYに関する項目の修正中確認を除外
                : ["mailAddrGrpList", "mailAddrList", "mailTitl", "mailText", "issuMailFileList"] // TTYの場合は、メールに関する項目の修正中確認を除外
            );
            const hasDifference = checkHasDifference(currentParams, initialParams, exclusions);
            if (hasDifference) {
                void dispatch((0, issueSecurity_1.showMessage)({
                    message: soalaMessages_1.SoalaMessage.M40004C({
                        onYesButton: changeSwitch,
                    }),
                }));
            }
            else {
                changeSwitch();
            }
        }
        else {
            changeSwitch();
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shipToUpperCase = (e) => {
        if (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            props.change(e.target.name, (0, commonUtil_1.toUpperCase)(e.target.value));
        }
    };
    const handleHideEmailModal = () => dispatch((0, issueSecurity_1.hideEmailModal)());
    const handleHideTtyModal = () => dispatch((0, issueSecurity_1.hideTtyModal)());
    const getMailAddrList = (ccIncluded) => {
        const { jobAuthUser: { mailAddr }, formValues: { mailAddrList, mailCCSenderAddressChecked }, } = props;
        const to = mailAddrList !== null && mailAddrList !== void 0 ? mailAddrList : [];
        const cc = mailCCSenderAddressChecked ? [mailAddr] : [];
        return ccIncluded ? [...new Set([...cc, ...to])] : to;
    };
    const getTtyAddrList = (ccIncluded) => {
        const { jobAuthUser: { ttyAddr }, formValues: { ttyAddrList, ttyCCSenderAddressChecked }, } = props;
        const to = ttyAddrList !== null && ttyAddrList !== void 0 ? ttyAddrList : [];
        const cc = ttyCCSenderAddressChecked ? [ttyAddr] : [];
        return ccIncluded ? [...new Set([...cc, ...to])] : to;
    };
    const onChangeMailCcSenderAddress = () => {
        const { mailCCSenderAddressChecked } = props.formValues;
        storage_1.storage.airPortIssueEmailCCSenderAddressChecked = !mailCCSenderAddressChecked;
    };
    const onChangeTtyCcSenderAddress = () => {
        const { ttyCCSenderAddressChecked } = props.formValues;
        storage_1.storage.airPortIssueTtyCCSenderAddressChecked = !ttyCCSenderAddressChecked;
    };
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    master, issuCdValue, emailFileValue, change, tabValue, mailFlgValue, ttyFlgValue, issueSecurity, issuDtlCdValue, } = props;
    const { isEmailModalActive, isTtyModalActive, mailAddrList, ttyAddrList, airportIssue } = issueSecurity;
    const { mailAddrGrpList, ttyAddrGrpList } = airportIssue;
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Form, { isPc: storage_1.storage.isPc },
            react_1.default.createElement(Left, null,
                react_1.default.createElement(ListHeader, null, "Issue"),
                react_1.default.createElement(ListContainer, { className: "issuCdListContainer" },
                    react_1.default.createElement(List, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "issuCd", id: "issuCdSWW", component: RadioButton_1.default, type: "radio", value: "SWW", onChange: () => onChangeIssuCd(props.issuCdValue) }),
                        react_1.default.createElement("label", { htmlFor: "issuCdSWW" }, "Strong Wind"),
                        react_1.default.createElement(IssueSwwIcon, null)),
                    react_1.default.createElement(List, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "issuCd", id: "issuCdTSW", component: RadioButton_1.default, type: "radio", value: "TSW", onChange: () => onChangeIssuCd(props.issuCdValue) }),
                        react_1.default.createElement("label", { htmlFor: "issuCdTSW" }, "Thunder Storm"),
                        react_1.default.createElement(IssueTswIcon, null)),
                    react_1.default.createElement(List, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "issuCd", id: "issuCdDIC", component: RadioButton_1.default, type: "radio", value: "DIC", onChange: () => onChangeIssuCd(props.issuCdValue) }),
                        react_1.default.createElement("label", { htmlFor: "issuCdDIC" }, "De-Icing Only"),
                        react_1.default.createElement(IssueDicIcom, null)),
                    react_1.default.createElement(List, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "issuCd", id: "issuCdRCL", component: RadioButton_1.default, type: "radio", value: "RCL", onChange: () => onChangeIssuCd(props.issuCdValue) }),
                        react_1.default.createElement("label", { htmlFor: "issuCdRCL" }, "Runway Close"),
                        react_1.default.createElement(IssueRwyIcon, null)),
                    react_1.default.createElement(List, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "issuCd", id: "issuCdSSP", component: RadioButton_1.default, type: "radio", value: "SSP", onChange: () => onChangeIssuCd(props.issuCdValue) }),
                        react_1.default.createElement("label", { htmlFor: "issuCdSSP" }, "LVP/LVPD"),
                        react_1.default.createElement(IssueSspIcon, null)),
                    react_1.default.createElement(List, null,
                        react_1.default.createElement(redux_form_1.Field, { name: "issuCd", id: "issuCdSEC", component: RadioButton_1.default, type: "radio", value: "SEC", onChange: () => onChangeIssuCd(props.issuCdValue) }),
                        react_1.default.createElement("label", { htmlFor: "issuCdSEC" }, "Security Level"),
                        react_1.default.createElement(IssueSecIcon, null))),
                react_1.default.createElement(ListContainer, { style: { flex: 1, overflow: "auto" } },
                    issuCdValue === "SWW" && (react_1.default.createElement(SubList, null,
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "SWW", id: "WAR", component: RadioButton_1.default, type: "radio", value: "WAR", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "WAR" }, "Warning")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "SWW", id: "CD1", component: RadioButton_1.default, type: "radio", value: "CD1", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "CD1" }, "Condition 1")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "SWW", id: "CD2", component: RadioButton_1.default, type: "radio", value: "CD2", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "CD2" }, "Condition 2")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "SWW", id: "CD3", component: RadioButton_1.default, type: "radio", value: "CD3", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "CD3" }, "Condition 3")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "SWW", id: "CNL", component: RadioButton_1.default, type: "radio", value: "CNL", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "CNL" }, "CNL")))),
                    issuCdValue === "TSW" && (react_1.default.createElement(SubList, null,
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "TSW", id: "WAR", component: RadioButton_1.default, type: "radio", value: "WAR", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "WAR" }, "Warning")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "TSW", id: "CD1", component: RadioButton_1.default, type: "radio", value: "CD1", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "CD1" }, "Condition 1")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "TSW", id: "CD2", component: RadioButton_1.default, type: "radio", value: "CD2", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "CD2" }, "Condition 2")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "TSW", id: "CNL", component: RadioButton_1.default, type: "radio", value: "CNL", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "CNL" }, "CNL")))),
                    issuCdValue === "DIC" && (react_1.default.createElement(SubList, null,
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "DIC", id: "ON", component: RadioButton_1.default, type: "radio", value: "ON", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "ON" }, "ON")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "DIC", id: "OFF", component: RadioButton_1.default, type: "radio", value: "OFF", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "OFF" }, "OFF")))),
                    issuCdValue === "RCL" && (react_1.default.createElement(SubList, null,
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "RCL", id: "ON", component: RadioButton_1.default, type: "radio", value: "ON", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "ON" }, "ON")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "RCL", id: "OFF", component: RadioButton_1.default, type: "radio", value: "OFF", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "OFF" }, "OFF")))),
                    issuCdValue === "SSP" && (react_1.default.createElement(SubList, null,
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "SSP", id: "ON", component: RadioButton_1.default, type: "radio", value: "ON", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "ON" }, "ON")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "SSP", id: "OFF", component: RadioButton_1.default, type: "radio", value: "OFF", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "OFF" }, "OFF")))),
                    issuCdValue === "SEC" && (react_1.default.createElement(SubList, null,
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "SEC", id: "LV1", component: RadioButton_1.default, type: "radio", value: "LV1", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "LV1" }, "Level 1")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "SEC", id: "LV2", component: RadioButton_1.default, type: "radio", value: "LV2", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "LV2" }, "Level 2")),
                        react_1.default.createElement(List, null,
                            react_1.default.createElement(redux_form_1.Field, { name: "SEC", id: "LV3", component: RadioButton_1.default, type: "radio", value: "LV3", 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange: (e) => onChangeIssuDtlCd(e, props.issuDtlCdValue) }),
                            react_1.default.createElement("label", { htmlFor: "LV3" }, "Level 3"))))),
                react_1.default.createElement(ListHeader, null, "Send Type"),
                react_1.default.createElement(ListContainer, null,
                    react_1.default.createElement(SendType, { disabled: !issuDtlCdValue },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("label", { htmlFor: "mailFlg" }, "e-mail"),
                            react_1.default.createElement(redux_form_1.Field, { name: "mailFlg", id: "mailFlg", component: ToggleInput_1.default, confirmation: () => confirmationSwich("mailFlg"), disabled: !issuDtlCdValue })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("label", { htmlFor: "ttyFlg" }, "TTY"),
                            react_1.default.createElement(redux_form_1.Field, { name: "ttyFlg", id: "ttyFlg", component: ToggleInput_1.default, confirmation: () => confirmationSwich("ttyFlg"), disabled: !issuDtlCdValue }))))),
            react_1.default.createElement(Right, null,
                react_1.default.createElement(RightContainer, { ttyIsActive: tabValue === "TTY" },
                    react_1.default.createElement(TabContainer, null,
                        react_1.default.createElement(Tab, { isActive: tabValue === "e-mail", onClick: () => handleTab("e-mail"), disabled: !mailFlgValue }, "e-mail"),
                        react_1.default.createElement(Tab, { isActive: tabValue === "TTY", onClick: () => handleTab("TTY"), disabled: !ttyFlgValue }, "TTY")),
                    react_1.default.createElement(RightContent, { disabled: !mailFlgValue, ttyIsActive: false, isPc: storage_1.storage.isPc, isActive: tabValue === "e-mail" },
                        react_1.default.createElement(Row, null,
                            react_1.default.createElement(FormTitle, null, "e-mail Address Group"),
                            react_1.default.createElement(redux_form_1.Field, { name: "mailAddrGrpList", options: mailAddrGrpList, component: MultipleSelectBox_1.default, disabled: !mailFlgValue, validate: [myValidates.requireEmailAddress, myValidates.unique], maxValLength: MAIL_ADDRESS_GROUP_ITEM_MAX, isForceError: mailFlgValue && isForceErrorMailAddrGrpList, onChange: onChangeMailAddrGrpList })),
                        react_1.default.createElement(Row, null,
                            react_1.default.createElement(FormTitle, null, "e-mail Additional Address"),
                            react_1.default.createElement(redux_form_1.Field, { name: "mailAddrList", component: MultipleCreatableInput_1.default, disabled: !mailFlgValue, validate: [myValidates.requireEmailAddress, myValidates.isOkEmails, myValidates.unique], filterValue: filterEmailAddress, maxValLength: MAIL_ADDITIONAL_ADDRESS_ITEM_MAX })),
                        react_1.default.createElement(RowFlex, null,
                            react_1.default.createElement(From, null,
                                react_1.default.createElement(FormTitle, null, "From"),
                                react_1.default.createElement(redux_form_1.Field, { name: "orgnMailAddr", component: TextInput_1.default, width: 370, disabled: true, maxLength: 100, validate: [validates.required] })),
                            react_1.default.createElement(CCSenderAddressCheckBoxContainer, null,
                                react_1.default.createElement(FormTitle, null, "CC: Sender Address"),
                                react_1.default.createElement(CheckBoxContainer, null,
                                    react_1.default.createElement(redux_form_1.Field, { name: "mailCCSenderAddressChecked", component: "input", type: "checkbox", disabled: !mailFlgValue, onChange: onChangeMailCcSenderAddress }))),
                            react_1.default.createElement(AddressDetailButtonContainer, null,
                                react_1.default.createElement(PrimaryButton_1.default, { text: "Address Detail", type: "button", onClick: openEmailModal, disabled: !mailFlgValue }))),
                        react_1.default.createElement(Row, null,
                            react_1.default.createElement(FormTitle, null, "Title"),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(redux_form_1.Field, { name: "mailTitl", component: TextInput_1.default, width: 724, disabled: !mailFlgValue, maxLength: 100 }))),
                        react_1.default.createElement(Row, null,
                            react_1.default.createElement(TextAreaContainer, { isPc: storage_1.storage.isPc, isTty: false },
                                react_1.default.createElement(redux_form_1.Field, { name: "mailText", component: TextArea_1.default, width: 724, disabled: !mailFlgValue, maxLength: 4000, maxWidth: 724, minWidth: 724, validate: [validates.required, validates.isOkIssuMailBody] }))),
                        react_1.default.createElement(UploadFilesComponent_1.default, { disabled: !mailFlgValue, channel: "email", uploadedFiles: emailFileValue, onUploadFiles: (uploadFiles) => change("emailFile", [...emailFileValue, ...uploadFiles]), onRemoveFile: (index) => change("emailFile", Array.from(emailFileValue).filter((_, i) => i !== index)) })),
                    react_1.default.createElement(RightContent, { disabled: !ttyFlgValue, ttyIsActive: true, isPc: storage_1.storage.isPc, isActive: tabValue === "TTY" },
                        react_1.default.createElement(Row, null,
                            react_1.default.createElement(FormTitle, null, "TTY Address Group"),
                            react_1.default.createElement(redux_form_1.Field, { name: "ttyAddrGrpList", options: ttyAddrGrpList, component: MultipleSelectBox_1.default, disabled: !ttyFlgValue, validate: [myValidates.requireTtyAddress, myValidates.unique], maxValLength: TTY_ADDRESS_GROUP_ITEM_MAX, isForceError: ttyFlgValue && isForceErrorTtyAddrGrpList, onChange: onChangeTtyAddrGrpList, fontFamily: 'Consolas, "Courier New", Courier, Monaco, monospace' })),
                        react_1.default.createElement(Row, null,
                            react_1.default.createElement(FormTitle, null, "TTY Additional Address"),
                            react_1.default.createElement(redux_form_1.Field, { name: "ttyAddrList", component: MultipleCreatableInput_1.default, disabled: !ttyFlgValue, validate: [myValidates.requireTtyAddress, myValidates.isOkTtyAddresses, myValidates.unique], filterValue: filterTtyAddress, formatValues: handleKeyPress, maxValLength: TTY_ADDITIONAL_ADDRESS_ITEM_MAX, fontFamily: 'Consolas, "Courier New", Courier, Monaco, monospace' })),
                        react_1.default.createElement(RowFlex, null,
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(FormLabel, { htmlFor: "ttyPriorityCd" }, "Priority"),
                                react_1.default.createElement(redux_form_1.Field, { name: "ttyPriorityCd", component: SelectBox_1.default, options: (0, commonUtil_1.getPriorities)(props.master.cdCtrlDtls), width: 70, disabled: !ttyFlgValue, hasBlank: true, validate: [validates.required] })),
                            react_1.default.createElement(Originator, null,
                                react_1.default.createElement(FormLabel, { htmlFor: "orgnTtyAddr" }, "Originator"),
                                react_1.default.createElement(redux_form_1.Field, { name: "orgnTtyAddr", component: TextInput_1.default, width: 140, disabled: !ttyFlgValue, maxLength: 7, componentOnBlur: shipToUpperCase, validate: [validates.required, validates.isOkTtyAddress] })),
                            react_1.default.createElement(CCSenderAddressCheckBoxContainer, null,
                                react_1.default.createElement(FormLabel, { htmlFor: "ttyCCSenderAddressChecked" }, "CC: Sender Address"),
                                react_1.default.createElement(CheckBoxContainer, null,
                                    react_1.default.createElement(redux_form_1.Field, { name: "ttyCCSenderAddressChecked", component: "input", type: "checkbox", disabled: !ttyFlgValue, onChange: onChangeTtyCcSenderAddress }))),
                            react_1.default.createElement(AddressDetailButtonContainer, null,
                                react_1.default.createElement(PrimaryButton_1.default, { text: "Address Detail", type: "button", onClick: openTtyModal, disabled: !ttyFlgValue }))),
                        react_1.default.createElement(Row, null,
                            react_1.default.createElement(Ruler, { isPc: storage_1.storage.isPc }, "....+....1....+....2....+....3....+....4....+....5....+....6....+....7")),
                        react_1.default.createElement(Row, null,
                            react_1.default.createElement(TextAreaContainer, { isPc: storage_1.storage.isPc, isTty: true },
                                react_1.default.createElement(redux_form_1.Field, { name: "ttyText", component: TextArea_1.default, width: 724, disabled: !ttyFlgValue, maxLength: 4000, maxWidth: 724, minWidth: 724, maxRowLength: 69, componentOnBlur: shipToUpperCase, validate: [validates.required, validates.isOkTty] }))))),
                react_1.default.createElement(RightFooter, null,
                    react_1.default.createElement(ButtonContainer, null,
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Template Save", type: "button", onClick: saveTemplate, disabled: !issuDtlCdValue })),
                    react_1.default.createElement(IssueTime, null,
                        react_1.default.createElement("label", { htmlFor: "issuTime" }, "Issue Time(L)"),
                        react_1.default.createElement(redux_form_1.Field, { name: "issuTime", id: "issuTime", component: TextInput_1.default, width: 80, type: "number", maxLength: 4, disabled: !issuDtlCdValue, validate: [validates.requiredIssueTime, validates.time] })),
                    react_1.default.createElement(ButtonContainer, null,
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Update & Send", type: "button", onClick: updateSendAirportIssue, disabled: !issuDtlCdValue })))),
            react_1.default.createElement(react_modal_1.default, { isOpen: isEmailModalActive, style: emailModalStyles, onRequestClose: handleHideEmailModal },
                react_1.default.createElement(ModalHeader, null,
                    react_1.default.createElement("div", null, "e-mail Address Detail"),
                    react_1.default.createElement(CloseButton_1.default, { onClick: handleHideEmailModal })),
                react_1.default.createElement(AddressDetailContainer, { isPc: storage_1.storage.isPc }, mailAddrList && mailAddrList.map((mailAddr) => react_1.default.createElement(EmailDetail, { key: mailAddr }, mailAddr)))),
            react_1.default.createElement(react_modal_1.default, { isOpen: isTtyModalActive, style: ttyModalStyles, onRequestClose: handleHideTtyModal },
                react_1.default.createElement(ModalHeader, null,
                    react_1.default.createElement("div", null, "TTY Address Detail"),
                    react_1.default.createElement(CloseButton_1.default, { onClick: handleHideTtyModal })),
                react_1.default.createElement(AddressDetailContainer, { isPc: storage_1.storage.isPc }, ttyAddrList && ttyAddrList.map((ttyAddr) => react_1.default.createElement(TtyDetail, { key: ttyAddr }, ttyAddr)))))));
};
const emailModalStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        width: "766px",
        left: "calc(50% - 315px)",
        padding: 0,
        height: "calc(100vh - 80px)",
    },
};
const ttyModalStyles = {
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        zIndex: 10,
    },
    content: {
        width: "646px",
        left: "calc(50% - 315px)",
        padding: 0,
        height: "calc(100vh - 80px)",
    },
};
const Wrapper = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  background: #f6f6f6;
`;
const Form = styled_components_1.default.form `
  width: 1024px;
  height: calc(100vh - ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)});
  display: flex;
  justify-content: center;
  background: #fff;
`;
const Left = styled_components_1.default.div `
  width: 218px;
  margin: 10px;
  border-top: 1px solid #595857;
  display: flex;
  flex-flow: column nowrap;
`;
const ListHeader = styled_components_1.default.div `
  height: 24px;
  background: #e4f2f7;
  border: 1px solid #595857;
  border-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;
const ListContainer = styled_components_1.default.div `
  border: 1px solid #595857;
  border-top: 0;
  padding: 5px 0;
`;
const List = styled_components_1.default.div `
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;

  label {
    margin-right: auto;
    font-size: 17px;
  }
`;
const SubList = styled_components_1.default.div `
  padding-left: 24px;
`;
const SendType = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  padding: 16px 16px;

  > div {
    display: flex;
    align-items: center;
    label {
      margin-right: 6px;
      font-size: 12px;
    }
  }
  ${({ disabled }) => (disabled ? "opacity: 0.6;" : "")};
`;
const Right = styled_components_1.default.div `
  width: 760px;
  margin-right: 10px;
  display: flex;
  flex-flow: column nowrap;
`;
const RightContainer = styled_components_1.default.div `
  position: relative;
  padding-top: 10px;
  flex: 1;
  -webkit-overflow-scrolling: touch;
`;
const TabContainer = styled_components_1.default.div `
  position: absolute;
  width: 100%;
  z-index: 3;
  display: flex;

  > div:first-child {
    border-right: none;
  }
`;
const Tab = styled_components_1.default.div `
  width: 120px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #595857;
  border-bottom: 1px solid
    ${(props) => (props.isActive && !props.disabled ? "#fff" : props.isActive && props.disabled ? "#C9D3D0" : "#595857")};
  background: ${(props) => (props.disabled ? "#C9D3D0" : "transparent")};
  box-shadow: ${(props) => (props.isActive ? "1px -1px 1px rgba(0,0,0,0.1)" : "none")};
  z-index: ${(props) => (props.isActive ? "1" : "0")};
`;
const RightContent = styled_components_1.default.div `
  position: absolute;
  top: 54px;
  z-index: ${({ isActive }) => (isActive ? "2" : "1")};
  width: 100%;
  height: calc(
    100vh - ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} - 10px - 44px - 16px - 44px
  );
  overflow: auto;
  padding: 10px 16px;
  margin-top: -1px;
  border: 1px solid #595857;
  background: ${(props) => (props.disabled ? "#C9D3D0" : "#FFF")};
`;
const Ruler = styled_components_1.default.span `
  font-family: Consolas, "Courier New", Courier, Monaco, monospace;
  font-size: 16px;
  line-height: 1.2;
  margin-left: ${({ isPc }) => (isPc ? "7px" : "10px")};
`;
const Row = styled_components_1.default.div `
  margin-bottom: 9px;
`;
const RowFlex = (0, styled_components_1.default)(Row) `
  display: flex;
  justify-content: space-between;
`;
const FormTitle = styled_components_1.default.div `
  margin-bottom: 3px;
  font-size: 12px;
`;
const FormLabel = styled_components_1.default.label `
  display: block;
  margin-bottom: 3px;
  font-size: 12px;
`;
const From = styled_components_1.default.div `
  margin-right: 0px;
`;
const CCSenderAddressCheckBoxContainer = styled_components_1.default.div `
  margin-left: 12px;
  margin-right: auto;
`;
const ButtonContainer = styled_components_1.default.div `
  width: 200px;
  align-self: flex-end;
`;
const AddressDetailButtonContainer = styled_components_1.default.div `
  width: 190px;
  align-self: flex-end;
`;
const TextAreaContainer = styled_components_1.default.div `
  textarea {
    height: 204px;
    padding: 10px 6px;
    ${({ isTty }) => (isTty ? "font-family: Consolas, 'Courier New', Courier, Monaco, monospace;" : "")}
  }
`;
const Originator = styled_components_1.default.div `
  margin-left: 12px;
`;
const CheckBoxContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
  line-height: 44px;
  height: 44px;
  font-size: 17px;
  cursor: pointer;
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
  input[type="checkbox"] {
    margin-right: 6px;
    appearance: none;
    width: 30px;
    height: 30px;
    border: 1px solid ${(props) => props.theme.color.PRIMARY};
    position: relative;
    outline: none;
    &:checked {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 4px;
        left: 9px;
        width: 9px;
        height: 14px;
        transform: rotate(45deg);
        border-bottom: 2px solid #fff;
        border-right: 2px solid #fff;
      }
    }
    &:disabled {
      opacity: 0.6;
      &:not(:checked) {
        background: #ebebe4;
      }
    }
  }
`;
const RightFooter = styled_components_1.default.div `
  height: 44px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;
const IssueTime = styled_components_1.default.div `
  margin-left: auto;
  margin-right: 12px;
  display: flex;
  align-items: center;

  label {
    margin-right: 7px;
    font-size: 12px;
  }
`;
const ModalHeader = styled_components_1.default.div `
  padding: 16px;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    font-size: 12px;
  }
`;
const AddressDetailContainer = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-left: ${({ isPc }) => (isPc ? 11 : 22)}px;
  overflow-y: scroll;
  height: calc(100vh - 80px - 41px - 16px);
`;
const EmailDetail = styled_components_1.default.div `
  width: 350px;
  height: 44px;
  padding: 0 8px;
  margin: 5px;
  display: flex;
  align-items: center;
  font-size: 17px;
  background: #f6f6f6;
  border-radius: 1px;
  border: 1px solid #c9d3d0;
`;
const TtyDetail = (0, styled_components_1.default)(EmailDetail) `
  margin: 5px;
  width: 140px;
`;
const Icon = styled_components_1.default.img `
  width: 36px;
  height: 36px;
`;
const IssueDicIcom = (0, styled_components_1.default)(Icon).attrs({ src: icon_issue_dic_svg_1.default }) ``;
const IssueRwyIcon = (0, styled_components_1.default)(Icon).attrs({ src: icon_issue_rwy_svg_1.default }) ``;
const IssueSecIcon = (0, styled_components_1.default)(Icon).attrs({ src: icon_issue_sec_svg_1.default }) ``;
const IssueSspIcon = (0, styled_components_1.default)(Icon).attrs({ src: icon_issue_ssp_svg_1.default }) ``;
const IssueSwwIcon = (0, styled_components_1.default)(Icon).attrs({ src: icon_issue_sww_svg_1.default }) ``;
const IssueTswIcon = (0, styled_components_1.default)(Icon).attrs({ src: icon_issue_tsw_svg_1.default }) ``;
const issueSecurityWithForm = (0, redux_form_1.reduxForm)({
    form: FORM_NAME,
})(IssueSecurity);
const filterEmailAddress = (value) => value.replace(/(?!.*([A-Za-z0-9-_@.])).*/, "").slice(0, 100);
const filterTtyAddress = (value) => {
    const replaced = value.replace(/(?!.*([a-zA-Z]|[0-9]|\.|\/|-|\(|\))).*/, "");
    return replaced.slice(0, 7);
};
const selector = (0, redux_form_1.formValueSelector)("issueSecurity");
const mapStateToProps = (state) => {
    const issuCdValue = selector(state, "issuCd");
    const issuDtlCdValue = issuCdValue ? selector(state, issuCdValue) : "";
    const mailFlgValue = selector(state, "mailFlg");
    const ttyFlgValue = selector(state, "ttyFlg");
    const emailFileValue = selector(state, "emailFile");
    const tabValue = selector(state, "tab");
    const { apoTimeLcl } = state.common.headerInfo;
    return {
        master: state.account.master,
        jobAuthUser: state.account.jobAuth.user,
        issueSecurity: state.issueSecurity,
        formValues: (0, redux_form_1.getFormValues)("issueSecurity")(state),
        formSyncErrors: (0, redux_form_1.getFormSyncErrors)("issueSecurity")(state),
        headerInfo: state.common.headerInfo,
        issuCdValue,
        emailFileValue,
        tabValue,
        mailFlgValue,
        ttyFlgValue,
        issuDtlCdValue,
        initialValues: {
            issuCd: "",
            ttyPriorityCd: "QU",
            emailFile: [],
            tab: "e-mail",
            mailFlg: false,
            ttyFlg: false,
            mailAddrList: [],
            ttyAddrList: [],
            orgnMailAddr: state.account.jobAuth.user.mailAddr,
            orgnTtyAddr: state.account.jobAuth.user.ttyAddr,
            issuTime: apoTimeLcl ? (0, dayjs_1.default)(apoTimeLcl).format("HHmm") : "",
        },
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(issueSecurityWithForm);
//# sourceMappingURL=IssueSecurity.js.map