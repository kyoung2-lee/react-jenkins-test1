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
exports.selector = exports.CheckBoxLabel = exports.CheckBoxContainer = exports.ModalButtonGroup = exports.Ruler = exports.TextAreaContainerFixed = exports.TextAreaContainer = exports.Label = exports.Col = exports.Flex = exports.Row = exports.RightContent = exports.createOption = exports.TEMPLATE_FILTER_SEND_BY = exports.ROW_WIDTH = exports.TEXTAREA_MIN_HEIGHT = exports.DEFAULT_TEXTAREA_HEIGHT = exports.FORM_NAME = void 0;
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const lodash_orderby_1 = __importDefault(require("lodash.orderby"));
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const storage_1 = require("../../../lib/storage");
const StorageOfUser_1 = require("../../../lib/StorageOfUser");
const commonConst_1 = require("../../../lib/commonConst");
const commonUtil_1 = require("../../../lib/commonUtil");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const validates = __importStar(require("../../../lib/validators"));
const account_1 = require("../../../reducers/account");
const addressActions = __importStar(require("../../../reducers/address"));
// eslint-disable-next-line import/no-cycle
const broadcastActions = __importStar(require("../../../reducers/broadcast"));
const acarsActions = __importStar(require("../../../reducers/broadcastAcars"));
const bulletinBoardActions = __importStar(require("../../../reducers/broadcastBulletinBoard"));
const emailActions = __importStar(require("../../../reducers/broadcastEmail"));
const notificationActions = __importStar(require("../../../reducers/broadcastNotification"));
const ttyActions = __importStar(require("../../../reducers/broadcastTty"));
const aftnActions = __importStar(require("../../../reducers/broadcastAftn"));
const common_1 = require("../../../reducers/common");
const dateTimeInputPopup_1 = require("../../../reducers/dateTimeInputPopup");
const EventListener_1 = __importDefault(require("../../atoms/EventListener"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const SecondaryButton_1 = __importDefault(require("../../atoms/SecondaryButton"));
const UploadFilesComponent_1 = require("../../molecules/UploadFilesComponent");
// eslint-disable-next-line import/no-cycle
const BroadcastAcars_1 = __importDefault(require("./BroadcastAcars"));
// eslint-disable-next-line import/no-cycle
const BroadcastBulletinBoard_1 = __importDefault(require("./BroadcastBulletinBoard"));
// eslint-disable-next-line import/no-cycle
const BroadcastEmail_1 = __importDefault(require("./BroadcastEmail"));
// eslint-disable-next-line import/no-cycle
const BroadcastNotification_1 = __importDefault(require("./BroadcastNotification"));
// eslint-disable-next-line import/no-cycle
const BroadcastTty_1 = __importDefault(require("./BroadcastTty"));
// eslint-disable-next-line import/no-cycle
const BroadcastAftn_1 = __importDefault(require("./BroadcastAftn"));
const DetailModal_1 = __importDefault(require("./DetailModal"));
// eslint-disable-next-line import/no-cycle
const FlightLegSearchModal_1 = __importDefault(require("./FlightLegSearchModal"));
const Tabs_1 = __importDefault(require("./Tabs"));
const TemplateJobCodeSearch_1 = __importDefault(require("./TemplateJobCodeSearch"));
const TemplateFilter_1 = __importDefault(require("./TemplateFilter"));
// eslint-disable-next-line import/no-cycle
const TemplateFilterModal_1 = __importDefault(require("./TemplateFilterModal"));
const TemplateList_1 = __importDefault(require("./TemplateList"));
// eslint-disable-next-line import/no-cycle
const TemplateNameEditModal_1 = __importDefault(require("./TemplateNameEditModal"));
const SearchParamConverter_1 = require("../../../lib/AdvanceSearch/SearchParamConverter");
// eslint-disable-next-line import/no-cycle
const SearchParamMapper_1 = require("../../../lib/AdvanceSearch/SearchParamMapper");
exports.FORM_NAME = "broadcast";
exports.DEFAULT_TEXTAREA_HEIGHT = 310;
exports.TEXTAREA_MIN_HEIGHT = 100;
exports.ROW_WIDTH = 706;
const BB_FIELDS = [
    "catCdList",
    "flightLeg",
    "commGrpIdList",
    "jobGrpIdList",
    "jobIdList",
    "bbTitle",
    "expiryDate",
    "bbText",
    "attachments",
];
const MAIL_FIELDS = ["mailAddrGrpIdList", "mailAddrList", "orgnMailAddr", "mailTitle", "mailText", "attachments"];
const TTY_FIELDS = ["ttyAddrGrpIdList", "ttyAddrList", "ttyPriorityCd", "orgnTtyAddr", "ttyText"];
const AFTN_FIELDS = ["priority", "originator", "aftnText"];
const ACARS_FIELDS = ["shipNoList", "orgnTtyAddr", "uplinkText", "reqAckFlg"];
const NOTIFICATION_FIELDS = ["commGrpIdList", "jobGrpIdList", "jobIdList", "ntfTitle", "ntfText", "soundFlg"];
const CATEGORY_CODE_FLIGHT = "FLIGHT";
exports.TEMPLATE_FILTER_SEND_BY = [
    { label: "B.B.", value: "BB" },
    { label: "e-mail", value: "MAIL" },
    { label: "TTY", value: "TTY" },
    { label: "AFTN", value: "AFTN" },
    { label: "Notification", value: "NTF" },
    { label: "ACARS", value: "ACARS" },
];
const styles = {
    jobCodeModal: {
        overlay: {
            background: "rgba(0, 0, 0, 0.5)",
            overflow: "auto",
            zIndex: 10,
        },
        content: {
            width: "646px",
            left: "calc(50% - 315px)",
            padding: 20,
            height: "calc(100vh - 80px)",
            overflow: "hidden",
        },
    },
    emailModal: {
        overlay: {
            background: "rgba(0, 0, 0, 0.5)",
            overflow: "auto",
            zIndex: 10,
        },
        content: {
            width: "798px",
            left: "calc(50% - 382px)",
            padding: 20,
            height: "calc(100vh - 80px)",
            overflow: "hidden",
        },
    },
    ttyAddressModal: {
        overlay: {
            background: "rgba(0, 0, 0, 0.5)",
            overflow: "hidden",
            zIndex: 10,
        },
        content: {
            width: "665px",
            left: "calc(50% - 330px)",
            padding: 20,
            height: "calc(100vh - 80px)",
            overflow: "hidden",
        },
    },
};
var FilterTabName;
(function (FilterTabName) {
    FilterTabName["name"] = "Name";
    FilterTabName["recently"] = "Recently";
})(FilterTabName || (FilterTabName = {}));
var TabName;
(function (TabName) {
    TabName["bb"] = "B.B.";
    TabName["email"] = "e-mail";
    TabName["tty"] = "TTY";
    TabName["aftn"] = "AFTN";
    TabName["acars"] = "ACARS";
    TabName["notification"] = "Notification";
})(TabName || (TabName = {}));
const getOrderCondition = (tabName) => {
    switch (tabName) {
        case FilterTabName.name:
            return { sortKey: "name", order: "asc" };
        case FilterTabName.recently:
            return { sortKey: "recentlyTime", order: "desc" };
        default:
            return { sortKey: "name", order: "asc" };
    }
};
const getFormKey = (tabName) => {
    switch (tabName) {
        case TabName.bb:
            return "BB";
        case TabName.email:
            return "Mail";
        case TabName.tty:
            return "Tty";
        case TabName.aftn:
            return "Aftn";
        case TabName.notification:
            return "Notification";
        case TabName.acars:
            return "Acars";
        default:
            return null;
    }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createOption = (value, label, isFixed, color) => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    value,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    label: label || value,
    isFixed: isFixed || false,
    color,
});
exports.createOption = createOption;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isBlank = (value) => {
    if (typeof value === "undefined")
        return true;
    if (typeof value === "boolean" || typeof value === "number")
        return false;
    if (typeof value === "string")
        return !value;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (typeof value === "object")
        return Array.isArray(value) ? value.length === 0 : (0, commonUtil_1.isObjectEmpty)(value);
    // symbol, functionはformValueで考慮しない
    return true;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapEmptyValueToNull = (object) => {
    const obj = { ...object };
    Object.keys(obj).forEach((key) => {
        if (obj[key] === "") {
            obj[key] = null;
        }
    });
    return obj;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const omit = (object, keys) => keys.reduce((o, k) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [k]: _omitted, ...rest } = o;
    return rest;
}, object);
const Broadcast = (props) => {
    const searchParamConverter = (0, react_1.useRef)(new SearchParamConverter_1.SearchParamConverter({ mapper: SearchParamMapper_1.SearchParamMapper.getBroadcastMapper() }));
    // const master = useAppSelector((state) => state.account.master);
    const jobAuthUser = (0, hooks_1.useAppSelector)((state) => state.account.jobAuth.user);
    // const broadcast = useAppSelector((state) => state.broadcast);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const formValues = (0, hooks_1.useAppSelector)((state) => (0, redux_form_1.getFormValues)(exports.FORM_NAME)(state));
    const formSyncErrors = (0, hooks_1.useAppSelector)((state) => (0, redux_form_1.getFormSyncErrors)(exports.FORM_NAME)(state));
    // const headerInfo = useAppSelector((state) => state.common.headerInfo);
    // const flightNumberInputPopup = useAppSelector((state) => state.flightNumberInputPopup);
    const prevProps = (0, hooks_1.usePrevious)(props);
    const dispatch = (0, hooks_1.useAppDispatch)();
    const history = (0, react_router_dom_1.useHistory)();
    const [filter, setFilter] = (0, react_1.useState)("");
    const [template, setTemplate] = (0, react_1.useState)({
        id: 0,
        type: "",
        jobCd: jobAuthUser.jobCd,
    });
    // const [isEdit, setIsEdit] = useState(false);
    const [initial, setInitial] = (0, react_1.useState)(null);
    const [needMergeFormValuesIntoTemplate, setNeedMergeFormValuesIntoTemplate] = (0, react_1.useState)(false);
    const [registeredTemplateName, setRegisteredTemplateName] = (0, react_1.useState)("");
    const [isForceErrorMailAddrGrpIdList, setIsForceErrorMailAddrGrpIdList] = (0, react_1.useState)(false);
    const [isForceErrorTtyAddrGrpIdList, setIsForceErrorTtyAddrGrpIdList] = (0, react_1.useState)(false);
    const [isForceErrorMailAddrList, setIsForceErrorMailAddrList] = (0, react_1.useState)(false);
    const [isForceErrorTtyAddrList, setIsForceErrorTtyAddrList] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const { jobAuth, bbId, archiveFlg } = props;
        dispatch(broadcastActions.funcAuthCheck({ jobAuth }));
        void (async () => {
            const { COMM_GRP, ADGRP, SHIP } = commonConst_1.Const.MasterGetType;
            // eslint-disable-next-line no-bitwise
            await dispatch((0, account_1.reloadMaster)({ user: jobAuthUser, masterGetType: props.tabName !== TabName.acars ? COMM_GRP | ADGRP : SHIP }));
            if (bbId && archiveFlg !== undefined) {
                void dispatch(bulletinBoardActions.fetchBulletinBoard({ bbId, archiveFlg, callbacks: { onNotAllowed: () => transition() } }));
            }
            const jobId = getJobId(jobAuthUser.jobCd);
            if (jobId && !isBbEdit()) {
                void dispatch(broadcastActions.fetchAllTemplate({
                    params: { jobId },
                    sort: getOrderCondition(FilterTabName.name),
                }));
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, hooks_1.useDidUpdateEffect)(() => {
        const { canManageBb, canManageEmail } = props;
        if ((!canManageBb && isEditMode()) || (!canManageEmail && isEmailShare())) {
            transition();
        }
    }, [props.canManageBb, props.canManageEmail]);
    (0, react_1.useEffect)(() => {
        if (prevProps !== null && !prevProps.newBbId && props.newBbId) {
            transition(props.newBbId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.newBbId]);
    (0, react_1.useEffect)(() => {
        if (prevProps !== null) {
            handleTemplateNameEdit(prevProps.isOpenTemplateNameEditModal, props.isOpenTemplateNameEditModal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isOpenTemplateNameEditModal]);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { bbCategories, isFlightLegEnabled, change } = props;
        if (prevProps !== null) {
            const hasFlightInBbCategory = bbCategories.includes(CATEGORY_CODE_FLIGHT);
            if (hasFlightInBbCategory && !isFlightLegEnabled) {
                dispatch(bulletinBoardActions.enableFlight());
            }
            else if (!hasFlightInBbCategory && isFlightLegEnabled) {
                change("BB.flightLeg", {});
                dispatch(bulletinBoardActions.disableFlight());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.bbCategories, props.isFlightLegEnabled]);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { fetchingAllFlightLeg, flightLegs, change } = props;
        if (prevProps !== null) {
            if (prevProps.fetchingAllFlightLeg && !fetchingAllFlightLeg && flightLegs && flightLegs.length === 1) {
                change("BB.flightLeg", (0, commonUtil_1.arrayFirst)(flightLegs));
                dispatch(bulletinBoardActions.closeFlightLegSearchModal());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fetchingAllFlightLeg, props.flightLegs]);
    (0, react_1.useEffect)(() => {
        if (prevProps !== null) {
            const { fetchingBulletinBoard } = props;
            applyBulletinBoardTemplate(prevProps.fetchingBulletinBoard, fetchingBulletinBoard);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fetchingBulletinBoard]);
    (0, react_1.useEffect)(() => {
        if (prevProps !== null) {
            const { fetchingEmail } = props;
            applyEmailTemplate(prevProps.fetchingEmail, fetchingEmail);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fetchingEmail]);
    (0, react_1.useEffect)(() => {
        if (prevProps !== null) {
            const { fetchingTty } = props;
            applyTtyTemplate(prevProps.fetchingTty, fetchingTty);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fetchingTty]);
    (0, react_1.useEffect)(() => {
        if (prevProps !== null) {
            const { fetchingAftn } = props;
            applyAftnTemplate(prevProps.fetchingAftn, fetchingAftn);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fetchingAftn]);
    (0, react_1.useEffect)(() => {
        if (prevProps !== null) {
            const { fetchingNotification } = props;
            applyNotificationTemplate(prevProps.fetchingNotification, fetchingNotification);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fetchingNotification]);
    (0, react_1.useEffect)(() => {
        if (prevProps !== null) {
            const { fetchingAcars } = props;
            applyAcarsTemplate(prevProps.fetchingAcars, fetchingAcars);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fetchingAcars]);
    (0, react_1.useEffect)(() => {
        if (prevProps !== null) {
            const { fetchingBb } = props;
            applyBb(prevProps.fetchingBb, fetchingBb);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fetchingBb]);
    (0, react_1.useEffect)(() => {
        const { loadingTemplate } = props;
        if (prevProps !== null && !prevProps.loadingTemplate && loadingTemplate) {
            void dispatch((0, common_1.getHeaderInfo)({ apoCd: jobAuthUser.myApoCd }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.loadingTemplate, jobAuthUser.myApoCd]);
    const transition = (bbId) => {
        let path = commonConst_1.Const.PATH_NAME.bulletinBoard;
        if (bbId) {
            path = `${commonConst_1.Const.PATH_NAME.bulletinBoard}?bbId=${bbId}`;
        }
        else if (props.bbId) {
            path = `${commonConst_1.Const.PATH_NAME.bulletinBoard}?bbId=${props.bbId}`;
        }
        history.push(path);
    };
    const handleTemplateNameEdit = (prev, next) => {
        if (!prev && next) {
            setRegisteredTemplateName(props.templateName);
        }
        if (prev && !next) {
            setRegisteredTemplateName("");
        }
    };
    const applyBulletinBoardTemplate = (prev, next) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change, bulletinBoardTemplate, bbAttachments, bbFlightLeg, bbExpiryDate, initialValues, expiryDateInitialValue } = props;
        if (prev && !next && (0, commonUtil_1.isObjectNotEmpty)(bulletinBoardTemplate)) {
            change("tabName", TabName.bb);
            change("BB.templateId", bulletinBoardTemplate.templateId);
            change("BB.catCdList", bulletinBoardTemplate.catCdList);
            change("BB.commGrpIdList", bulletinBoardTemplate.commGrpIdList);
            change("BB.jobGrpIdList", bulletinBoardTemplate.jobGrpIdList);
            change("BB.jobIdList", bulletinBoardTemplate.jobIdList);
            change("BB.bbTitle", bulletinBoardTemplate.bbTitle);
            change("BB.bbText", bulletinBoardTemplate.bbText);
            change("BB.attachments", 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            needMergeFormValuesIntoTemplate ? bbAttachments : initialValues.BB ? initialValues.BB.attachments : []);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            let nextFlightLegValue = initialValues.BB ? initialValues.BB.flightLeg : {};
            if (bulletinBoardTemplate.catCdList.some((category) => category === CATEGORY_CODE_FLIGHT) && needMergeFormValuesIntoTemplate) {
                nextFlightLegValue = bbFlightLeg;
            }
            change("BB.flightLeg", nextFlightLegValue);
            change("BB.expiryDate", needMergeFormValuesIntoTemplate
                ? bbExpiryDate
                : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    initialValues.BB
                        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            initialValues.BB.expiryDate
                        : expiryDateInitialValue);
            setNeedMergeFormValuesIntoTemplate(false);
            setInitial({
                ...getInitialValue(TabName.bb),
                templateId: bulletinBoardTemplate.templateId,
                catCdList: bulletinBoardTemplate.catCdList,
                commGrpIdList: bulletinBoardTemplate.commGrpIdList,
                jobGrpIdList: bulletinBoardTemplate.jobGrpIdList,
                jobIdList: bulletinBoardTemplate.jobIdList,
                bbTitle: bulletinBoardTemplate.bbTitle,
                bbText: bulletinBoardTemplate.bbText,
            });
        }
    };
    const handleClickExpiryDate = () => {
        const onEnter = (value) => {
            props.change("BB.expiryDate", value);
        };
        const apoTimeLclDayjs = (0, dayjs_1.default)(props.apoTimeLcl);
        const currentTimeLcl = apoTimeLclDayjs && apoTimeLclDayjs.isValid() ? apoTimeLclDayjs.startOf("day") : (0, dayjs_1.default)().startOf("day");
        const customValidate = (value) => {
            if (value) {
                const dayjsCalDate = (0, commonUtil_1.getDayjsCalDate)(value, "YYYY-MM-DD");
                if (dayjsCalDate) {
                    if (dayjsCalDate.isSameOrAfter(currentTimeLcl) && dayjsCalDate.isSameOrBefore(commonConst_1.Const.EXPIRY_DATE_MAXIMUM)) {
                        return true;
                    }
                }
            }
            return false;
        };
        dispatch((0, dateTimeInputPopup_1.openDateTimeInputPopup)({
            valueFormat: "YYYY-MM-DD",
            currentValue: props.bbExpiryDate,
            onEnter,
            customValidate,
            unableDelete: true,
            minDate: currentTimeLcl.toDate(),
            maxDate: commonConst_1.Const.EXPIRY_DATE_MAXIMUM.toDate(),
        }));
    };
    const applyEmailTemplate = (prev, next) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change, emailTemplate, emailAttachments, initialValues } = props;
        if (prev && !next && (0, commonUtil_1.isObjectNotEmpty)(emailTemplate)) {
            change("tabName", TabName.email);
            change("Mail.templateId", emailTemplate.templateId);
            change("Mail.mailAddrGrpIdList", emailTemplate.mailAddrGrpIdList);
            change("Mail.mailAddrList", emailTemplate.mailAddrList.length ? emailTemplate.mailAddrList : []);
            change("Mail.mailTitle", emailTemplate.mailTitle);
            change("Mail.mailText", emailTemplate.mailText);
            change("Mail.attachments", 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            needMergeFormValuesIntoTemplate ? emailAttachments : initialValues.Mail ? initialValues.Mail.attachments : []);
            setNeedMergeFormValuesIntoTemplate(false);
            setIsForceErrorMailAddrGrpIdList(false);
            setIsForceErrorMailAddrList(false);
            setInitial({
                ...getInitialValue(TabName.email),
                templateId: emailTemplate.templateId,
                mailAddrGrpIdList: emailTemplate.mailAddrGrpIdList,
                mailAddrList: emailTemplate.mailAddrList.length ? emailTemplate.mailAddrList : [],
                mailTitle: emailTemplate.mailTitle,
                mailText: emailTemplate.mailText,
            });
        }
    };
    const applyTtyTemplate = (prev, next) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { ttyTemplate, change } = props;
        if (prev && !next && (0, commonUtil_1.isObjectNotEmpty)(ttyTemplate)) {
            change("tabName", TabName.tty);
            change("Tty.templateId", ttyTemplate.templateId);
            change("Tty.ttyAddrGrpIdList", ttyTemplate.ttyAddrGrpIdList);
            change("Tty.ttyAddrList", ttyTemplate.ttyAddrList.length ? ttyTemplate.ttyAddrList : []);
            change("Tty.ttyPriorityCd", ttyTemplate.ttyPriorityCd);
            change("Tty.ttyText", ttyTemplate.ttyText);
            setNeedMergeFormValuesIntoTemplate(false);
            setIsForceErrorTtyAddrGrpIdList(false);
            setIsForceErrorTtyAddrList(false);
            setInitial({
                ...getInitialValue(TabName.tty),
                templateId: ttyTemplate.templateId,
                ttyAddrGrpIdList: ttyTemplate.ttyAddrGrpIdList,
                ttyAddrList: ttyTemplate.ttyAddrList.length ? ttyTemplate.ttyAddrList : [],
                ttyPriorityCd: ttyTemplate.ttyPriorityCd,
                ttyText: ttyTemplate.ttyText,
            });
        }
    };
    const applyAftnTemplate = (prev, next) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { aftnTemplate, change } = props;
        if (prev && !next && (0, commonUtil_1.isObjectNotEmpty)(aftnTemplate)) {
            change("tabName", TabName.aftn);
            change("Aftn.templateId", aftnTemplate.templateId);
            change("Aftn.priority", aftnTemplate.priority);
            change("Aftn.aftnText", aftnTemplate.aftnText);
            setNeedMergeFormValuesIntoTemplate(false);
            setInitial({
                ...getInitialValue(TabName.aftn),
                templateId: aftnTemplate.templateId,
                priority: aftnTemplate.priority,
                aftnText: aftnTemplate.aftnText,
            });
        }
    };
    const applyNotificationTemplate = (prev, next) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change, notificationTemplate } = props;
        if (prev && !next && (0, commonUtil_1.isObjectNotEmpty)(notificationTemplate)) {
            change("tabName", TabName.notification);
            change("Notification.templateId", notificationTemplate.templateId);
            change("Notification.commGrpIdList", notificationTemplate.commGrpIdList);
            change("Notification.jobGrpIdList", notificationTemplate.jobGrpIdList);
            change("Notification.jobIdList", notificationTemplate.jobIdList);
            change("Notification.ntfTitle", notificationTemplate.ntfTitle);
            change("Notification.ntfText", notificationTemplate.ntfText);
            change("Notification.soundFlg", notificationTemplate.soundFlg);
            setNeedMergeFormValuesIntoTemplate(false);
            setInitial({
                ...getInitialValue(TabName.notification),
                templateId: notificationTemplate.templateId,
                commGrpIdList: notificationTemplate.commGrpIdList,
                jobGrpIdList: notificationTemplate.jobGrpIdList,
                jobIdList: notificationTemplate.jobIdList,
                ntfTitle: notificationTemplate.ntfTitle,
                ntfText: notificationTemplate.ntfText,
                soundFlg: notificationTemplate.soundFlg,
            });
        }
    };
    const applyAcarsTemplate = (prev, next) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change, acarsTemplate } = props;
        if (prev && !next && (0, commonUtil_1.isObjectNotEmpty)(acarsTemplate)) {
            change("tabName", TabName.acars);
            change("Acars.templateId", acarsTemplate.templateId);
            change("Acars.shipNoList", acarsTemplate.shipNoList);
            change("Acars.uplinkText", acarsTemplate.uplinkText);
            change("Acars.reqAckFlg", acarsTemplate.reqAckFlg);
            setNeedMergeFormValuesIntoTemplate(false);
            setInitial({
                ...getInitialValue(TabName.acars),
                templateId: acarsTemplate.templateId,
                shipNoList: acarsTemplate.shipNoList,
                uplinkText: acarsTemplate.uplinkText,
                reqAckFlg: acarsTemplate.reqAckFlg,
            });
        }
    };
    const applyBb = (prev, next) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change, detail, expiryDateInitialValue, initialValues } = props;
        if (prev && !next && (0, commonUtil_1.isObjectNotEmpty)(detail)) {
            if (isBbEdit() || isBbShare()) {
                change("tabName", TabName.bb);
                change("BB.catCdList", detail.catCdList);
                change("BB.bbTitle", detail.bbTitle);
                change("BB.bbText", detail.bbText);
                change("BB.expiryDate", expiryDateInitialValue);
                const flightLeg = detail.catCdList.includes(CATEGORY_CODE_FLIGHT)
                    ? {
                        legInfoCd: detail.legInfoCd,
                        orgDateLcl: detail.orgDateLcl,
                        alCd: detail.alCd,
                        fltNo: detail.fltNo,
                        casFltNo: detail.casFltNo,
                        skdDepApoCd: detail.skdDepApoCd,
                        skdArrApoCd: detail.skdArrApoCd,
                        skdLegSno: detail.skdLegSno,
                        lstDepApoCd: detail.lstDepApoCd,
                        lstArrApoCd: detail.lstArrApoCd,
                    }
                    : {};
                change("BB.flightLeg", flightLeg);
                const attachments = detail.bbFileList.map((file) => ({
                    fileName: file.fileName,
                    type: file.fileType,
                    object: file.fileObject,
                    thumbnail: file.fileTmb,
                    id: file.fileId,
                    file: (0, UploadFilesComponent_1.makeFile)(file.fileObject, file.fileName, file.fileType, (0, dayjs_1.default)().unix()),
                }));
                change("BB.attachments", attachments);
                if (isBbEdit()) {
                    change("BB.commGrpIdList", detail.commGrpIdList);
                    change("BB.jobGrpIdList", detail.jobGrpIdList);
                    change("BB.jobIdList", detail.jobIdList);
                    change("BB.expiryDate", detail.expiryDate);
                    setInitial({
                        ...getInitialValue(TabName.bb),
                        commGrpIdList: detail.commGrpIdList,
                        jobGrpIdList: detail.jobGrpIdList,
                        jobIdList: detail.jobIdList,
                        catCdList: detail.catCdList,
                        bbTitle: detail.bbTitle,
                        bbText: detail.bbText,
                        expiryDate: detail.expiryDate,
                        flightLeg,
                        attachments,
                    });
                }
                else {
                    // B.B. Share
                    change("BB.commGrpIdList", []);
                    change("BB.jobGrpIdList", []);
                    change("BB.jobIdList", initialValues.BB ? initialValues.BB.jobIdList : []);
                    setInitial({
                        ...getInitialValue(TabName.bb),
                        catCdList: detail.catCdList,
                        bbTitle: detail.bbTitle,
                        bbText: detail.bbText,
                        flightLeg,
                        attachments,
                    });
                }
            }
            else if (isEmailShare()) {
                change("tabName", TabName.email);
                change("Mail.mailAddrGrpIdList", []);
                change("Mail.mailAddrList", []);
                change("Mail.mailTitle", detail.bbTitle);
                change("Mail.mailText", detail.bbText);
                const attachments = detail.bbFileList.map((file) => ({
                    fileName: file.fileName,
                    type: file.fileType,
                    object: (0, UploadFilesComponent_1.removeBase64Type)(file.fileObject),
                    thumbnail: "",
                    id: file.fileId,
                    file: (0, UploadFilesComponent_1.makeFile)(file.fileObject, file.fileName, file.fileType, (0, dayjs_1.default)().unix()),
                }));
                change("Mail.attachments", attachments);
                setIsForceErrorMailAddrGrpIdList(false);
                setIsForceErrorMailAddrList(false);
                setInitial({
                    ...getInitialValue(TabName.email),
                    mailTitle: detail.bbTitle,
                    mailText: detail.bbText,
                    attachments,
                });
                setIsForceErrorMailAddrGrpIdList(false);
                setIsForceErrorMailAddrList(false);
                setInitial({});
            }
        }
    };
    const isName = () => props.filterTabName === FilterTabName.name;
    const isRecently = () => props.filterTabName === FilterTabName.recently;
    const isBb = () => props.tabName === TabName.bb;
    const isEmail = () => props.tabName === TabName.email;
    const isTty = () => props.tabName === TabName.tty;
    const isAftn = () => props.tabName === TabName.aftn;
    const isAcars = () => props.tabName === TabName.acars;
    const isNotification = () => props.tabName === TabName.notification;
    const isEdited = () => {
        const { tabName } = props;
        const key = getFormKey(tabName);
        const omitKeys = isEmail() ? ["ccSenderAddressChecked"] : isTty() ? ["ccSenderAddressChecked", "divisionSendingChecked"] : [];
        if (!template.id && !isBbEdit()) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            return !!key && !(0, lodash_isequal_1.default)(omit(formValues[key], omitKeys), omit(getInitialValue(), omitKeys));
        }
        return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        !!key && !!initial && !(0, lodash_isequal_1.default)(mapEmptyValueToNull(omit(formValues[key], omitKeys)), mapEmptyValueToNull(omit(initial, omitKeys))));
    };
    const isBbEdit = () => !!props.bbId && props.from === "edit";
    const isBbShare = () => !!props.bbId && props.from === "bbShare";
    const isEmailShare = () => !!props.bbId && props.from === "emailShare";
    const isEditMode = () => isBbEdit();
    const getInitialValue = (name) => {
        const { initialValues } = props;
        const tabName = name || props.tabName;
        switch (tabName) {
            case TabName.bb:
                return initialValues.BB;
            case TabName.email:
                return initialValues.Mail;
            case TabName.tty:
                return initialValues.Tty;
            case TabName.aftn:
                return initialValues.Aftn;
            case TabName.notification:
                return initialValues.Notification;
            case TabName.acars:
                return initialValues.Acars;
            default:
                return {};
        }
    };
    const handleChangeTab = async (changeTabName, disabled) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { tabName, change } = props;
        if (disabled || tabName === changeTabName) {
            return;
        }
        const changeTab = async () => {
            clearForm();
            if (changeTabName !== TabName.acars) {
                // eslint-disable-next-line no-bitwise
                await dispatch((0, account_1.reloadMaster)({ user: jobAuthUser, masterGetType: commonConst_1.Const.MasterGetType.COMM_GRP | commonConst_1.Const.MasterGetType.ADGRP }));
            }
            else {
                await dispatch((0, account_1.reloadMaster)({ user: jobAuthUser, masterGetType: commonConst_1.Const.MasterGetType.SHIP }));
            }
            change("tabName", changeTabName);
            void dispatch(broadcastActions.clearSubmitFailedFields());
        };
        if (isEdited()) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40012C({
                onYesButton: () => {
                    void changeTab();
                },
            })));
        }
        else {
            await changeTab();
        }
    };
    const handleClickReload = async () => {
        if (isEdited()) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40011C({
                onYesButton: () => {
                    void reload();
                },
            })));
        }
        else {
            await reload();
        }
    };
    const reload = async () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { filterTabName, tabName, change } = props;
        if (isBbEdit()) {
            const { bbId, archiveFlg } = props;
            if (bbId && archiveFlg !== undefined) {
                void dispatch(bulletinBoardActions.fetchBulletinBoard({ bbId, archiveFlg }));
                void dispatch((0, common_1.getHeaderInfo)({ apoCd: jobAuthUser.myApoCd }));
            }
        }
        else {
            void clearForm(true);
            clearValidation();
            change("tabName", tabName);
            change("filterTabName", filterTabName);
            const jobId = getJobId(props.templateJobCd);
            if (jobId) {
                await dispatch(broadcastActions.fetchAllTemplate({
                    params: {
                        jobId,
                        ...searchParamConverter.current.getRequestParam(),
                    },
                    sort: getOrderCondition(filterTabName),
                }));
            }
            if (template.type !== "") {
                void applyTemplate(template.id, template.type, template.jobCd);
            }
        }
    };
    const handleChangeJobCode = (newJobCd) => {
        if (newJobCd === props.templateJobCd) {
            return;
        }
        if (isEdited()) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40012C({
                onYesButton: () => {
                    handleApplySearch(newJobCd);
                    clearForm();
                    clearValidation();
                    setTemplate({
                        id: 0,
                        type: "",
                        jobCd: newJobCd,
                    });
                },
                onNoButton: () => revertJobCd(props.templateJobCd),
            })));
        }
        else {
            handleApplySearch(newJobCd);
            clearForm();
            clearValidation();
            setTemplate({
                id: 0,
                type: "",
                jobCd: newJobCd,
            });
        }
    };
    const handleApplySearch = (newJobCd) => {
        const { filterTabName } = props;
        const jobId = getJobId(newJobCd);
        if (jobId) {
            void dispatch(broadcastActions.fetchAllTemplate({
                params: {
                    jobId,
                    ...searchParamConverter.current.getRequestParam(),
                },
                sort: getOrderCondition(filterTabName),
            }));
        }
    };
    const getJobId = (jobCd) => { var _a; return (_a = props.jobMap.get(jobCd)) !== null && _a !== void 0 ? _a : null; };
    const revertJobCd = (prevJobCd) => {
        props.change("templateJobCd", prevJobCd);
    };
    const handleClickFilterTab = (tabName) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { filterTabName, change, templates } = props;
        if (filterTabName === tabName) {
            return;
        }
        change("filterTabName", tabName);
        const { sortKey, order } = getOrderCondition(tabName);
        dispatch(broadcastActions.sortTemplates({ templates, sortKey, order }));
    };
    const handleClickFlightLegField = () => {
        const { isFlightLegEnabled } = props;
        if (!isFlightLegEnabled) {
            return;
        }
        dispatch(bulletinBoardActions.openFlightLegSearchModal());
    };
    const handleCloseSaveAsModal = () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change, templateName } = props;
        const close = () => {
            dispatch(broadcastActions.closeSaveAsModal());
            change("templateName", "");
        };
        if (templateName) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40001C({ onYesButton: close })));
        }
        else {
            close();
        }
    };
    const handleCloseSearchFilterModal = () => {
        dispatch(broadcastActions.closeSearchFilterModal());
    };
    const handleClickFlightLegButton = (flightLeg) => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { change } = props;
        change("BB.flightLeg", flightLeg);
    };
    const handleClickTemplate = (id, type) => {
        if (isEdited()) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40012C({
                onYesButton: () => {
                    void applyTemplate(id, type, props.templateJobCd);
                },
            })));
        }
        else {
            void applyTemplate(id, type, props.templateJobCd);
        }
    };
    const applyTemplate = async (templateId, type, templateJobCd) => {
        const { filterTabName, canManageBb, canManageEmail, canManageTty, canManageAftn, canManageAcars, canManageNotification } = props;
        let tmp;
        switch (type) {
            case "BB":
                if (!canManageBb) {
                    return;
                }
                tmp = await dispatch(bulletinBoardActions.fetchBulletinBoardTemplate({
                    templateId,
                    templateJobId: getJobId(templateJobCd),
                    userJobId: getJobId(jobAuthUser.jobCd),
                })).unwrap();
                break;
            case "MAIL":
                if (!canManageEmail) {
                    return;
                }
                tmp = await dispatch(emailActions.fetchEmailTemplate({ templateId })).unwrap();
                break;
            case "TTY":
                if (!canManageTty) {
                    return;
                }
                tmp = await dispatch(ttyActions.fetchTtyTemplate({ templateId })).unwrap();
                break;
            case "AFTN":
                if (!canManageAftn) {
                    return;
                }
                tmp = await dispatch(aftnActions.fetchAftnTemplate({ templateId })).unwrap();
                break;
            case "NTF":
                if (!canManageNotification) {
                    return;
                }
                tmp = await dispatch(notificationActions.fetchNotificationTemplate({
                    templateId,
                    templateJobId: getJobId(templateJobCd),
                    userJobId: getJobId(jobAuthUser.jobCd),
                })).unwrap();
                break;
            case "ACARS":
                if (!canManageAcars) {
                    return;
                }
                tmp = await dispatch(acarsActions.fetchAcarsTemplate({ templateId })).unwrap();
                break;
            default:
                tmp = null;
                break;
        }
        if (tmp) {
            setTemplate({
                id: tmp.templateId,
                type,
                jobCd: templateJobCd,
            });
        }
        else {
            const jobId = getJobId(props.templateJobCd);
            if (jobId) {
                await dispatch(broadcastActions.fetchAllTemplate({
                    params: {
                        jobId,
                        ...searchParamConverter.current.getRequestParam(),
                    },
                    sort: getOrderCondition(filterTabName),
                }));
            }
            void clearForm();
        }
    };
    const isApplyingOtherJobCdTemplate = () => props.templateJobCd !== jobAuthUser.jobCd;
    const handleFilterKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            return handleApplyFilter();
        }
        return undefined;
    };
    const handleApplyFilter = () => {
        if (isEdited()) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40012C({
                onYesButton: () => {
                    void applyFilter();
                },
            })));
        }
        else {
            void applyFilter();
        }
    };
    const applyFilter = async () => {
        const res = (await filterTemplateFromString(filter));
        if (!res) {
            return;
        }
        if (template.type !== "") {
            void applyTemplate(template.id, template.type, template.jobCd);
        }
        else {
            void clearForm();
        }
    };
    const handleClickTemplateFilter = () => dispatch(broadcastActions.openSearchFilterModal());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChangeFilter = (e) => {
        const { isTemplateFiltered } = props;
        if (isTemplateFiltered && isEdited()) {
            // 非同期でイベントプロパティを参照できるように、事前に変数にセット
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const { value } = e.target;
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40012C({
                onYesButton: () => {
                    void editFilter(value);
                    // フォームクリア
                    if (template.type !== "") {
                        void applyTemplate(template.id, template.type, template.jobCd);
                    }
                    else {
                        void clearForm();
                    }
                    // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
                    clearValidation();
                },
            })));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            void editFilter(e.target.value);
        }
    };
    const editFilter = async (value) => {
        const { isTemplateFiltered, filterTabName } = props;
        setFilter(value);
        if (!isTemplateFiltered) {
            return;
        }
        // フィルタをクリア
        searchParamConverter.current.applyStringParam("");
        const formParam = searchParamConverter.current.getFormParam(true);
        Object.keys(formParam).forEach((k) => {
            props.change(String(k), formParam[k]);
        });
        const jobId = getJobId(props.templateJobCd);
        if (jobId) {
            await dispatch(broadcastActions.fetchAllTemplate({
                params: {
                    jobId,
                    ...searchParamConverter.current.getRequestParam(),
                },
                sort: getOrderCondition(filterTabName),
            }));
        }
        dispatch(broadcastActions.clearTemplateFilter());
        if (template.type !== "") {
            void applyTemplate(template.id, template.type, template.jobCd);
        }
        else {
            void clearForm();
        }
    };
    const handleClearFilter = () => {
        if (props.isTemplateFiltered && isEdited()) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40012C({
                onYesButton: () => {
                    void clearFilter();
                },
            })));
        }
        else {
            void clearFilter();
        }
    };
    const clearFilter = async () => {
        const { isTemplateFiltered, filterTabName } = props;
        // フィルタをクリア
        searchParamConverter.current.applyStringParam("");
        const formParam = searchParamConverter.current.getFormParam(true);
        Object.keys(formParam).forEach((k) => {
            props.change(String(k), formParam[k]);
        });
        setFilter("");
        if (!isTemplateFiltered) {
            return;
        }
        const jobId = getJobId(props.templateJobCd);
        if (jobId) {
            await dispatch(broadcastActions.fetchAllTemplate({
                params: {
                    jobId,
                    ...searchParamConverter.current.getRequestParam(),
                },
                sort: getOrderCondition(filterTabName),
            }));
        }
        dispatch(broadcastActions.clearTemplateFilter());
        if (template.type !== "") {
            void applyTemplate(template.id, template.type, template.jobCd);
        }
        else {
            void clearForm();
        }
    };
    const handleSubmitTemplate = () => {
        const { tabName, bbTemplateId, mailTemplateId, ttyTemplateId, aftnTemplateId, notificationTemplateId, acarsTemplateId, canManageBb, canManageEmail, canManageTty, canManageAftn, canManageAcars, canManageNotification, } = props;
        if (showValidationErrors(true)) {
            return;
        }
        switch (tabName) {
            case TabName.bb:
                if (!canManageBb) {
                    return;
                }
                if (bbTemplateId) {
                    void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M30004C({
                        issueType: "B.B.",
                        onYesButton: () => {
                            void updateBbTemplate().then((res) => {
                                if (res) {
                                    setNeedMergeFormValuesIntoTemplate(true);
                                    void applyFilter();
                                }
                            });
                        },
                    })));
                }
                else {
                    dispatch(broadcastActions.openSaveAsModal());
                }
                break;
            case TabName.email:
                if (!canManageEmail) {
                    return;
                }
                if (mailTemplateId) {
                    void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M30004C({
                        issueType: "e-mail",
                        onYesButton: () => {
                            void updateEmailTemplate().then((res) => {
                                if (res) {
                                    setNeedMergeFormValuesIntoTemplate(true);
                                    void applyFilter();
                                }
                            });
                        },
                    })));
                }
                else {
                    dispatch(broadcastActions.openSaveAsModal());
                }
                break;
            case TabName.tty:
                if (!canManageTty) {
                    return;
                }
                if (ttyTemplateId) {
                    void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M30004C({
                        issueType: "TTY",
                        onYesButton: () => {
                            void updateTtyTemplate().then((res) => {
                                if (res) {
                                    setNeedMergeFormValuesIntoTemplate(true);
                                    void applyFilter();
                                }
                            });
                        },
                    })));
                }
                else {
                    dispatch(broadcastActions.openSaveAsModal());
                }
                break;
            case TabName.aftn:
                if (!canManageAftn) {
                    return;
                }
                if (aftnTemplateId) {
                    void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M30004C({
                        issueType: "AFTN",
                        onYesButton: () => {
                            void updateAftnTemplate().then((res) => {
                                if (res) {
                                    setNeedMergeFormValuesIntoTemplate(true);
                                    void applyFilter();
                                }
                            });
                        },
                    })));
                }
                else {
                    dispatch(broadcastActions.openSaveAsModal());
                }
                break;
            case TabName.notification:
                if (!canManageNotification) {
                    return;
                }
                if (notificationTemplateId) {
                    void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M30004C({
                        issueType: "Notification",
                        onYesButton: () => {
                            void updateNotificationTemplate().then((res) => {
                                if (res) {
                                    setNeedMergeFormValuesIntoTemplate(true);
                                    void applyFilter();
                                }
                            });
                        },
                    })));
                }
                else {
                    dispatch(broadcastActions.openSaveAsModal());
                }
                break;
            case TabName.acars:
                if (!canManageAcars) {
                    return;
                }
                if (acarsTemplateId) {
                    void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M30004C({
                        issueType: "Acars",
                        onYesButton: () => {
                            void updateAcarsTemplate().then((res) => {
                                if (res) {
                                    setNeedMergeFormValuesIntoTemplate(true);
                                    void applyFilter();
                                }
                            });
                        },
                    })));
                }
                else {
                    dispatch(broadcastActions.openSaveAsModal());
                }
                break;
            default:
                break;
        }
    };
    const handleSubmitNewTemplate = () => {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { tabName, change, canManageBb, canManageEmail, canManageTty, canManageAftn, canManageAcars, canManageNotification, filterTabName, } = props;
        if (showTemplateNameValidationError()) {
            return;
        }
        void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M30004C({
            issueType: tabName,
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onYesButton: async () => {
                let storeTemplateResponse;
                switch (tabName) {
                    case TabName.bb:
                        if (!canManageBb) {
                            dispatch(broadcastActions.closeSaveAsModal());
                            return;
                        }
                        storeTemplateResponse = (await handleSubmitNewBbTemplate());
                        break;
                    case TabName.email:
                        if (!canManageEmail) {
                            dispatch(broadcastActions.closeSaveAsModal());
                            return;
                        }
                        storeTemplateResponse = (await handleSubmitNewEmailTemplate());
                        break;
                    case TabName.tty:
                        if (!canManageTty) {
                            dispatch(broadcastActions.closeSaveAsModal());
                            return;
                        }
                        storeTemplateResponse = (await handleSubmitNewTtyTemplate());
                        break;
                    case TabName.aftn:
                        if (!canManageAftn) {
                            dispatch(broadcastActions.closeSaveAsModal());
                            return;
                        }
                        storeTemplateResponse = (await handleSubmitNewAftnTemplate());
                        break;
                    case TabName.notification:
                        if (!canManageNotification) {
                            dispatch(broadcastActions.closeSaveAsModal());
                            return;
                        }
                        storeTemplateResponse = (await handleSubmitNewNotificationTemplate());
                        break;
                    case TabName.acars:
                        if (!canManageAcars) {
                            dispatch(broadcastActions.closeSaveAsModal());
                            return;
                        }
                        storeTemplateResponse = (await handleSubmitNewAcarsTemplate());
                        break;
                    default:
                        break;
                }
                if (storeTemplateResponse && storeTemplateResponse.templateId) {
                    const storedTemplateId = storeTemplateResponse.templateId;
                    // フィルタをクリア
                    searchParamConverter.current.applyStringParam("");
                    const formParam = searchParamConverter.current.getFormParam(true);
                    Object.keys(formParam).forEach((k) => {
                        props.change(String(k), formParam[k]);
                    });
                    setFilter("");
                    const jobId = getJobId(props.templateJobCd);
                    let fetchAllTemplateResponse = null;
                    if (jobId) {
                        fetchAllTemplateResponse = await dispatch(broadcastActions.fetchAllTemplate({
                            params: {
                                jobId,
                                ...searchParamConverter.current.getRequestParam(),
                            },
                            sort: getOrderCondition(filterTabName),
                        })).unwrap();
                    }
                    dispatch(broadcastActions.clearTemplateFilter());
                    if (fetchAllTemplateResponse) {
                        const storedTemplate = (0, commonUtil_1.arrayFirst)(fetchAllTemplateResponse.templateList.filter((tmp) => tmp.templateId === storedTemplateId));
                        if (storedTemplate) {
                            setNeedMergeFormValuesIntoTemplate(true);
                            void applyTemplate(storedTemplate.templateId, storedTemplate.broadcastType, jobAuthUser.jobCd);
                        }
                    }
                    dispatch(broadcastActions.closeSaveAsModal());
                    change("templateName", "");
                }
            },
        })));
    };
    const updateBbTemplate = async () => {
        const { bb: { templateId, catCdList, commGrpIdList, jobGrpIdList, jobIdList, bbTitle, bbText }, bbFlightLeg: { legInfoCd }, } = props;
        const params = {
            templateId,
            catCdList,
            legInfoCd,
            commGrpIdList,
            jobGrpIdList,
            jobIdList,
            bbTitle,
            bbText,
        };
        return dispatch(bulletinBoardActions.updateBulletinBoardTemplate({
            params,
            callbacks: {
                onNotFoundTemplate: () => {
                    handleNotFoundUpdateTemplate();
                },
            },
        }));
    };
    const updateEmailTemplate = async () => {
        const { mail: { templateId, mailAddrGrpIdList, mailAddrList, mailTitle, mailText }, } = props;
        return dispatch(emailActions.updateEmailTemplate({
            params: {
                templateId,
                mailAddrGrpIdList,
                mailAddrList,
                mailTitle,
                mailText,
            },
            callbacks: {
                onNotFoundTemplate: () => {
                    handleNotFoundUpdateTemplate();
                },
            },
        }));
    };
    const updateTtyTemplate = async () => {
        const { tty: { templateId, ttyAddrGrpIdList, ttyAddrList, ttyPriorityCd, ttyText }, } = props;
        return dispatch(ttyActions.updateTtyTemplate({
            params: {
                templateId,
                ttyAddrGrpIdList,
                ttyAddrList,
                ttyPriorityCd,
                ttyText: (0, commonUtil_1.convertLineFeedCodeToCRLF)(ttyText),
            },
            callbacks: {
                onNotFoundTemplate: () => {
                    handleNotFoundUpdateTemplate();
                },
            },
        }));
    };
    const updateAftnTemplate = async () => {
        const { aftn: { templateId, priority, aftnText }, } = props;
        return dispatch(aftnActions.updateAftnTemplate({
            params: {
                templateId,
                priority,
                aftnText: (0, commonUtil_1.convertLineFeedCodeToCRLF)(aftnText),
            },
            callbacks: {
                onNotFoundTemplate: () => {
                    handleNotFoundUpdateTemplate();
                },
            },
        }));
    };
    const updateNotificationTemplate = async () => {
        const { notification: { templateId, commGrpIdList, jobGrpIdList, jobIdList, ntfTitle, ntfText, soundFlg }, } = props;
        return dispatch(notificationActions.updateNotificationTemplate({
            params: {
                templateId,
                commGrpIdList,
                jobGrpIdList,
                jobIdList,
                ntfTitle,
                ntfText,
                soundFlg,
            },
            callbacks: {
                onNotFoundTemplate: () => {
                    handleNotFoundUpdateTemplate();
                },
            },
        }));
    };
    const updateAcarsTemplate = async () => {
        const { acars: { templateId, shipNoList, uplinkText, reqAckFlg }, } = props;
        return dispatch(acarsActions.updateAcarsTemplate({
            params: {
                templateId,
                shipNoList,
                uplinkText: (0, commonUtil_1.convertLineFeedCodeToCRLF)(uplinkText),
                reqAckFlg,
            },
            callbacks: {
                onNotFoundTemplate: () => {
                    handleNotFoundUpdateTemplate();
                },
            },
        }));
    };
    const handleNotFoundUpdateTemplate = () => {
        const { filterTabName } = props;
        setTemplate({ id: 0, type: "", jobCd: jobAuthUser.jobCd });
        setInitial(null);
        const jobId = getJobId(props.templateJobCd);
        if (jobId) {
            void dispatch(broadcastActions.fetchAllTemplate({
                params: {
                    jobId,
                    ...searchParamConverter.current.getRequestParam(),
                },
                sort: getOrderCondition(filterTabName),
            }));
        }
    };
    const handleSubmitNewBbTemplate = async () => {
        const { templateName, bb: { catCdList, commGrpIdList, jobGrpIdList, jobIdList, bbTitle, bbText }, } = props;
        return dispatch(bulletinBoardActions.storeBulletinBoardTemplate({
            templateName,
            catCdList,
            commGrpIdList,
            jobGrpIdList,
            jobIdList,
            bbTitle,
            bbText,
        })).unwrap();
    };
    const handleSubmitNewEmailTemplate = async () => {
        const { templateName, mail: { mailAddrGrpIdList, mailAddrList, mailTitle, mailText }, } = props;
        return dispatch(emailActions.storeEmailTemplate({
            templateName,
            mailAddrGrpIdList,
            mailAddrList,
            mailTitle,
            mailText,
        })).unwrap();
    };
    const handleSubmitNewTtyTemplate = async () => {
        const { templateName, tty: { ttyAddrGrpIdList, ttyAddrList, ttyPriorityCd, ttyText }, } = props;
        return dispatch(ttyActions.storeTtyTemplate({
            templateName,
            ttyAddrGrpIdList,
            ttyAddrList,
            ttyPriorityCd,
            ttyText: (0, commonUtil_1.convertLineFeedCodeToCRLF)(ttyText),
        })).unwrap();
    };
    const handleSubmitNewAftnTemplate = async () => {
        const { templateName, aftn: { priority, aftnText }, } = props;
        return dispatch(aftnActions.storeAftnTemplate({
            templateName,
            priority,
            aftnText: (0, commonUtil_1.convertLineFeedCodeToCRLF)(aftnText),
        })).unwrap();
    };
    const handleSubmitNewNotificationTemplate = async () => {
        const { templateName, notification: { commGrpIdList, jobGrpIdList, jobIdList, ntfTitle, ntfText, soundFlg }, } = props;
        return dispatch(notificationActions.storeNotificationTemplate({
            templateName,
            commGrpIdList,
            jobGrpIdList,
            jobIdList,
            ntfTitle,
            ntfText,
            soundFlg,
        })).unwrap();
    };
    const handleSubmitNewAcarsTemplate = async () => {
        const { templateName, acars: { shipNoList, uplinkText, reqAckFlg }, } = props;
        return dispatch(acarsActions.storeAcarsTemplate({
            templateName,
            shipNoList,
            uplinkText: (0, commonUtil_1.convertLineFeedCodeToCRLF)(uplinkText),
            reqAckFlg,
        })).unwrap();
    };
    const applyModalFilter = async () => {
        const { keyword, sendBy } = props;
        const apply = async () => {
            const res = (await filterTemplateFromForm(keyword, sendBy));
            if (!res) {
                return;
            }
            if (template.type !== "") {
                void applyTemplate(template.id, template.type, template.jobCd);
            }
            else {
                void clearForm();
            }
            dispatch(broadcastActions.closeSearchFilterModal());
        };
        if (isEdited()) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40012C({
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onYesButton: async () => {
                    await apply();
                },
            })));
        }
        else {
            await apply();
        }
    };
    const filterTemplateFromString = async (flt) => {
        const { filterTabName } = props;
        searchParamConverter.current.applyStringParam(flt);
        const errorMessages = searchParamConverter.current.applyStringParam(flt);
        if (errorMessages.length) {
            void dispatch(broadcastActions.showMessage(errorMessages[0]));
            setFilter(flt);
            return undefined;
        }
        const jobId = getJobId(props.templateJobCd);
        let res = null;
        if (jobId) {
            res = await dispatch(broadcastActions.fetchAllTemplate({
                params: {
                    jobId,
                    ...searchParamConverter.current.getRequestParam(true),
                },
                sort: getOrderCondition(filterTabName),
            })).unwrap();
        }
        if (res) {
            const stringParam = searchParamConverter.current.getStringParam();
            setFilter(stringParam);
            const formParam = searchParamConverter.current.getFormParam(true);
            Object.keys(formParam).forEach((k) => {
                props.change(String(k), formParam[k]);
            });
            if (stringParam) {
                dispatch(broadcastActions.applyTemplateFilter());
            }
            else {
                dispatch(broadcastActions.clearTemplateFilter());
            }
        }
        return res;
    };
    const filterTemplateFromForm = async (keyword, sendBy) => {
        const { filterTabName } = props;
        const formParam = { keyword, sendBy };
        searchParamConverter.current.applyFormParam(formParam);
        const jobId = getJobId(props.templateJobCd);
        let res = null;
        if (jobId) {
            res = await dispatch(broadcastActions.fetchAllTemplate({
                params: {
                    jobId,
                    ...searchParamConverter.current.getRequestParam(true),
                },
                sort: getOrderCondition(filterTabName),
            })).unwrap();
        }
        if (res) {
            const stringParam = searchParamConverter.current.getStringParam();
            setFilter(stringParam);
            const param = searchParamConverter.current.getFormParam(true);
            Object.keys(param).forEach((k) => {
                props.change(String(k), param[k]);
            });
            if (stringParam) {
                dispatch(broadcastActions.applyTemplateFilter());
            }
            else {
                dispatch(broadcastActions.clearTemplateFilter());
            }
        }
        return res;
    };
    const fetchAllMailAddressList = async () => {
        const { mail: { mailAddrGrpIdList, mailAddrList, orgnMailAddr, ccSenderAddressChecked }, } = props;
        const res = await dispatch(addressActions.fetchAllMailAddressList({
            mailAddrGrpIdList,
            mailAddrList: ccSenderAddressChecked ? [...new Set([orgnMailAddr, ...mailAddrList])] : mailAddrList,
        })).unwrap();
        return res;
    };
    const fetchAllTtyAddressList = async () => {
        const { tty: { ttyAddrGrpIdList, ttyAddrList }, } = props;
        const res = await dispatch(addressActions.fetchAllTtyAddressList({
            ttyAddrGrpIdList,
            ttyAddrList,
        })).unwrap();
        return res;
    };
    const handleClickSend = () => {
        const { tabName, canManageBb, canManageEmail, canManageTty, canManageAftn, canManageAcars, canManageNotification } = props;
        if (showValidationErrors()) {
            return;
        }
        void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M30008C({
            onYesButton: () => {
                switch (tabName) {
                    case TabName.bb:
                        if (!canManageBb) {
                            return;
                        }
                        if (isBbEdit()) {
                            void handleUpdateBb();
                        }
                        else {
                            void handleSendBb();
                        }
                        break;
                    case TabName.email:
                        if (!canManageEmail) {
                            return;
                        }
                        void handleSendEmail();
                        break;
                    case TabName.tty:
                        if (!canManageTty) {
                            return;
                        }
                        void handleSendTty();
                        break;
                    case TabName.aftn:
                        if (!canManageAftn) {
                            return;
                        }
                        void handleSendAftn();
                        break;
                    case TabName.notification:
                        if (!canManageNotification) {
                            return;
                        }
                        void handleSendNotification();
                        break;
                    case TabName.acars:
                        if (!canManageAcars) {
                            return;
                        }
                        void handleSendAcars();
                        break;
                    default:
                        break;
                }
            },
        })));
    };
    const handleSendBb = async () => {
        const { bb: { catCdList, commGrpIdList, jobGrpIdList, jobIdList, expiryDate, bbTitle, bbText, attachments }, bbFlightLeg: { legInfoCd, orgDateLcl, alCd, fltNo, casFltNo, skdDepApoCd, skdArrApoCd, skdLegSno }, bbTemplateId, } = props;
        const hasErrors = showValidationErrors();
        if (!hasErrors) {
            const jobAddrListRes = await dispatch(addressActions.fetchAllJobCodeAddressList({
                commGrpIdList,
                jobGrpIdList,
                jobIdList,
            })).unwrap();
            if (jobAddrListRes) {
                // ロケーションを取得し実行する
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                (0, commonUtil_1.execWithLocationInfo)(async ({ posLat, posLon }) => {
                    const params = {
                        catCdList,
                        legInfoCd,
                        orgDateLcl,
                        alCd,
                        fltNo,
                        casFltNo,
                        skdDepApoCd,
                        skdArrApoCd,
                        skdLegSno,
                        commGrpIdList,
                        jobGrpIdList,
                        jobIdList,
                        bbTitle,
                        bbText,
                        expiryDate,
                        destinationList: jobAddrListRes.jobList,
                        bbFileList: attachments.map(({ fileName, type, object, thumbnail }) => ({
                            fileName,
                            fileType: type,
                            fileObject: object,
                            fileTmb: thumbnail,
                        })),
                        templateId: bbTemplateId,
                        posLat,
                        posLon,
                    };
                    await dispatch(bulletinBoardActions.sendBulletinBoard(params));
                });
            }
        }
    };
    const handleUpdateBb = async () => {
        const { bbId, bb: { catCdList, commGrpIdList, jobGrpIdList, jobIdList, expiryDate, bbTitle, bbText, attachments }, bbFlightLeg: { legInfoCd, orgDateLcl, alCd, fltNo, casFltNo, skdDepApoCd, skdArrApoCd, skdLegSno }, } = props;
        const hasErrors = showValidationErrors();
        if (!hasErrors && bbId && isBbEdit()) {
            const jobAddrListRes = await dispatch(addressActions.fetchAllJobCodeAddressList({
                commGrpIdList,
                jobGrpIdList,
                jobIdList,
            })).unwrap();
            if (jobAddrListRes && jobAddrListRes.jobList) {
                // ロケーションを取得し実行する
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                (0, commonUtil_1.execWithLocationInfo)(async ({ posLat, posLon }) => {
                    const jobList = jobAddrListRes.jobList;
                    const params = {
                        bbId,
                        catCdList,
                        legInfoCd,
                        orgDateLcl,
                        alCd,
                        fltNo,
                        casFltNo,
                        skdDepApoCd,
                        skdArrApoCd,
                        skdLegSno,
                        commGrpIdList,
                        jobGrpIdList,
                        jobIdList,
                        expiryDate,
                        destinationList: jobList,
                        bbTitle,
                        bbText,
                        bbFileList: attachments.map(({ fileName, type, object, thumbnail }) => ({
                            fileName,
                            fileType: type,
                            fileObject: object,
                            fileTmb: thumbnail,
                        })),
                        posLat,
                        posLon,
                    };
                    const res = await dispatch(bulletinBoardActions.updateBulletinBoard({
                        params,
                        callbacks: {
                            onNotFoundThread: () => history.push(commonConst_1.Const.PATH_NAME.bulletinBoard),
                        },
                    })).unwrap();
                    if (res) {
                        transition();
                    }
                });
            }
        }
    };
    const handleSendEmail = async () => {
        const { mail: { orgnMailAddr, mailTitle, mailText, attachments }, mailTemplateId, } = props;
        const hasErrors = showValidationErrors();
        if (!hasErrors && orgnMailAddr) {
            setIsForceErrorMailAddrGrpIdList(false);
            setIsForceErrorMailAddrList(false);
            const res = await fetchAllMailAddressList();
            if (res && res.mailAddrList) {
                if (res.mailAddrList.length === 0) {
                    setIsForceErrorMailAddrGrpIdList(true);
                    props.touch(exports.FORM_NAME, "Mail.mailAddrGrpIdList");
                    void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M50034C({})));
                }
                else {
                    await dispatch(emailActions.sendEmail({
                        mailAddrList: res.mailAddrList,
                        orgnMailAddr,
                        mailTitle,
                        mailText,
                        mailFileList: attachments.map(({ fileName, object }) => ({ fileName, fileObject: object })),
                        templateId: mailTemplateId,
                    }));
                }
            }
        }
    };
    const handleSendTty = async () => {
        const { tty: { ttyPriorityCd, orgnTtyAddr, ttyText, ccSenderAddressChecked, divisionSendingChecked }, ttyTemplateId, } = props;
        const hasErrors = showValidationErrors();
        if (!hasErrors) {
            setIsForceErrorTtyAddrGrpIdList(false);
            setIsForceErrorTtyAddrList(false);
            const res = await fetchAllTtyAddressList();
            if (res && res.ttyAddrList) {
                if (res.ttyAddrList.length === 0) {
                    setIsForceErrorTtyAddrGrpIdList(true);
                    props.touch(exports.FORM_NAME, "Tty.ttyAddrGrpIdList");
                    void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M50034C({})));
                }
                else {
                    await dispatch(ttyActions.sendTty({
                        ttyAddrList: res.ttyAddrList,
                        ttyPriorityCd,
                        orgnTtyAddr,
                        orgnTtyAddrFwFlg: ccSenderAddressChecked,
                        ttyAddrDivideFlg: divisionSendingChecked,
                        ttyText: (0, commonUtil_1.convertLineFeedCodeToCRLF)((0, commonUtil_1.removeTtyComment)(ttyText)),
                        templateId: ttyTemplateId,
                    }));
                }
            }
        }
    };
    const handleSendAftn = async () => {
        const { aftn: { priority, originator, aftnText }, aftnTemplateId, } = props;
        const hasErrors = showValidationErrors();
        if (!hasErrors) {
            await dispatch(aftnActions.sendAftn({
                priority,
                originator,
                aftnText: (0, commonUtil_1.convertLineFeedCodeToCRLF)((0, commonUtil_1.removeTtyComment)(aftnText)),
                templateId: aftnTemplateId,
            }));
        }
    };
    const handleSendNotification = async () => {
        const { notification: { commGrpIdList, jobGrpIdList, jobIdList, ntfTitle, ntfText, soundFlg }, notificationTemplateId, } = props;
        const hasErrors = showValidationErrors();
        if (!hasErrors) {
            const res = await dispatch(addressActions.fetchAllJobCodeAddressList({
                commGrpIdList,
                jobGrpIdList,
                jobIdList,
            })).unwrap();
            if (res && res.jobList) {
                const jobList = res.jobList;
                await dispatch(notificationActions.sendNotification({
                    jobCdList: jobList.map((job) => job.jobCd),
                    ntfTitle,
                    ntfText,
                    soundFlg,
                    templateId: notificationTemplateId,
                }));
            }
        }
    };
    const handleSendAcars = async () => {
        const { acars: { shipNoList, uplinkText, orgnTtyAddr, reqAckFlg }, acarsTemplateId, } = props;
        const hasErrors = showValidationErrors();
        if (!hasErrors && orgnTtyAddr) {
            await dispatch(acarsActions.sendAcars({
                shipNoList,
                orgnTtyAddr,
                uplinkText: (0, commonUtil_1.convertLineFeedCodeToCRLF)(uplinkText),
                reqAckFlg,
                templateId: acarsTemplateId,
            }));
        }
    };
    const handleClickClear = () => {
        if (isEdited()) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40012C({
                onYesButton: () => {
                    void clearForm(true);
                    // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
                    clearValidation();
                },
            })));
        }
        else {
            void clearForm(true);
        }
    };
    const clearForm = (needApplyTemplate = false) => {
        [TabName.bb, TabName.email, TabName.tty, TabName.aftn, TabName.notification, TabName.acars].forEach((name) => {
            const key = getFormKey(name);
            if (key) {
                props.change(key, getInitialValue(name));
            }
        });
        if (needApplyTemplate && template.id && template.type !== "") {
            void applyTemplate(template.id, template.type, template.jobCd);
        }
        else {
            setTemplate({ id: 0, type: "", jobCd: jobAuthUser.jobCd });
            setInitial(null);
            setIsForceErrorMailAddrGrpIdList(false);
            setIsForceErrorMailAddrList(false);
            setIsForceErrorTtyAddrGrpIdList(false);
            setIsForceErrorTtyAddrList(false);
        }
    };
    const clearValidation = () => {
        const { tabName } = props;
        const key = getFormKey(tabName);
        // フィールド情報取得
        let fields = [];
        switch (tabName) {
            case TabName.bb:
                fields = BB_FIELDS;
                break;
            case TabName.email:
                fields = MAIL_FIELDS;
                break;
            case TabName.tty:
                fields = TTY_FIELDS;
                break;
            case TabName.aftn:
                fields = AFTN_FIELDS;
                break;
            case TabName.notification:
                fields = NOTIFICATION_FIELDS;
                break;
            case TabName.acars:
                fields = ACARS_FIELDS;
                break;
            default:
                break;
        }
        // バリデーションエラーのFieldのtouchedをfalseにして、フォームの赤線を解除
        fields.forEach((field) => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            props.untouch(`${key}.${field}`);
        });
    };
    const handleTemplateNameKeyPress = (e) => {
        if (e.key === "Enter")
            handleSubmitNewTemplate();
    };
    const handleKeywordKeyPress = (e) => {
        if (e.key === "Enter")
            void applyModalFilter();
    };
    const handleTemplateNameEditKeyPress = (e) => {
        if (e.key === "Enter")
            void handleSubmitTemplateName();
    };
    const getBroadcastType = () => {
        const { broadcastType } = props;
        switch (broadcastType) {
            case "BB":
                return "B.B.";
            case "MAIL":
                return "e-mail";
            case "TTY":
                return "TTY";
            case "AFTN":
                return "AFTN";
            case "NTF":
                return "Notification";
            case "ACARS":
                return "ACARS";
            default:
                return broadcastType;
        }
    };
    const handleSubmitTemplateName = async () => {
        const { templateId, templateName, filterTabName } = props;
        if (showTemplateNameValidationError()) {
            return;
        }
        const closeAndClearModal = () => {
            dispatch(broadcastActions.closeTemplateNameEditModal());
            clearTemplateNameEditModal();
        };
        await dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M30004C({
            issueType: getBroadcastType(),
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onYesButton: async () => {
                const res = await dispatch(broadcastActions.updateTemplateName({
                    params: { templateId, templateName },
                    callbacks: {
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onNotFoundTemplate: async () => {
                            // 名前変更しようとしたテンプレートが存在しなかった場合の、エラーハンドリング
                            if (templateId === template.id) {
                                const jobId = getJobId(props.templateJobCd);
                                if (jobId) {
                                    await dispatch(broadcastActions.fetchAllTemplate({
                                        params: {
                                            jobId,
                                            ...searchParamConverter.current.getRequestParam(),
                                        },
                                        sort: getOrderCondition(filterTabName),
                                    }));
                                }
                                clearForm();
                            }
                            else {
                                void applyFilter();
                            }
                            closeAndClearModal();
                        },
                    },
                })).unwrap();
                if (res) {
                    void applyFilter();
                    closeAndClearModal();
                }
            },
        })));
    };
    const handleDeleteTemplate = async (templateId) => {
        const { filterTabName } = props;
        await dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40014C({
            item: "template",
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onYesButton: async () => {
                const res = await dispatch(broadcastActions.destroyTemplate({
                    params: { templateId },
                    callbacks: {
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onNotFoundTemplate: async () => {
                            // 削除しようとしたテンプレートが存在しなかった場合の、エラーハンドリング
                            if (template.type === "" || template.id !== templateId) {
                                await filterTemplateFromString(filter);
                            }
                            else {
                                const jobId = getJobId(props.templateJobCd);
                                if (jobId) {
                                    await dispatch(broadcastActions.fetchAllTemplate({
                                        params: {
                                            jobId,
                                            ...searchParamConverter.current.getRequestParam(),
                                        },
                                        sort: getOrderCondition(filterTabName),
                                    }));
                                }
                                // テンプレートなしの編集中に変更
                                setTemplate({ id: 0, type: "", jobCd: jobAuthUser.jobCd });
                                setInitial({ ...getInitialValue() });
                            }
                        },
                    },
                })).unwrap();
                if (res) {
                    if (template.type === "" || template.id !== templateId) {
                        // do nothing.
                    }
                    else {
                        const jobId = getJobId(props.templateJobCd);
                        if (jobId) {
                            await dispatch(broadcastActions.fetchAllTemplate({
                                params: {
                                    jobId,
                                    ...searchParamConverter.current.getRequestParam(),
                                },
                                sort: getOrderCondition(filterTabName),
                            }));
                        }
                        // テンプレートなしの編集中に変更
                        setTemplate({ id: 0, type: "", jobCd: jobAuthUser.jobCd });
                        setInitial({ ...getInitialValue() });
                    }
                }
            },
        })));
    };
    const handleClickTemplateNameEdit = (id, name, type) => {
        props.change("templateId", id);
        props.change("templateName", name);
        props.change("broadcastType", type);
        dispatch(broadcastActions.openTemplateNameEditModal());
    };
    const handleCloseTemplateNameEditModal = () => {
        const { templateName } = props;
        const close = () => {
            dispatch(broadcastActions.closeTemplateNameEditModal());
            clearTemplateNameEditModal();
        };
        if (registeredTemplateName !== templateName) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40001C({ onYesButton: close })));
        }
        else {
            close();
        }
    };
    const clearTemplateNameEditModal = () => {
        props.change("templateId", "");
        props.change("templateName", "");
        props.change("broadcastType", "");
    };
    const showValidationErrors = (isTemplateSave = false) => {
        if (isTemplateSave) {
            return false;
        }
        const { tabName } = props;
        let target = "";
        let fields = [];
        switch (tabName) {
            case TabName.bb:
                target = "BB";
                fields = BB_FIELDS;
                break;
            case TabName.email:
                target = "Mail";
                fields = MAIL_FIELDS;
                break;
            case TabName.tty:
                target = "Tty";
                fields = TTY_FIELDS;
                break;
            case TabName.aftn:
                target = "Aftn";
                fields = AFTN_FIELDS;
                break;
            case TabName.notification:
                target = "Notification";
                fields = NOTIFICATION_FIELDS;
                break;
            case TabName.acars:
                target = "Acars";
                fields = ACARS_FIELDS;
                break;
            default:
                break;
        }
        const errorFields = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessages = [];
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const formErrors = formSyncErrors;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (isTemplateSave && formValues && formValues[target]) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                const formValue = formValues[target][field];
                if (isBlank(formValue)) {
                    continue;
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            const messageFunction = formErrors && formErrors[target] && formErrors[target][field];
            if (messageFunction) {
                errorFields.push(`${target}.${field}`);
                if (!existsErrorMessages(errorMessages, messageFunction)) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    errorMessages.push({ messageFunction });
                }
            }
        }
        if (errorFields.length > 0) {
            void dispatch(broadcastActions.submitFailedField(errorFields));
        }
        for (let i = 0; i < errorMessages.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { messageFunction } = errorMessages[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
            void dispatch(broadcastActions.showMessage(messageFunction()));
        }
        return !!errorMessages.length;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existsErrorMessages = (errorMessages, messageFunction) => 
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    errorMessages.filter((errorMessage) => errorMessage.messageFunction.name === messageFunction.name).length > 0;
    const showTemplateNameValidationError = () => {
        const formErrors = formSyncErrors;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        const messageFunction = formErrors.templateName;
        if (messageFunction) {
            void dispatch(broadcastActions.submitFailedField(["templateName"]));
            return true;
        }
        return false;
    };
    const handleClickCancel = () => {
        if (isEdited()) {
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M40012C({
                onYesButton: () => transition(),
            })));
        }
        else {
            transition();
        }
    };
    const handleClickSaveAs = () => {
        if (showValidationErrors(true)) {
            return;
        }
        dispatch(broadcastActions.openSaveAsModal());
    };
    const handleClickTtyAddressDetailButton = async () => {
        const { tty: { ttyAddrList }, } = props;
        if (ttyAddrList.length !== (0, commonUtil_1.arrayUnique)(ttyAddrList).length) {
            setIsForceErrorTtyAddrList(true);
            props.touch(exports.FORM_NAME, "Tty.ttyAddrList");
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M50020C({ items: ttyAddrList })));
            return;
        }
        if (ttyAddrList.filter((address) => !validates.isTtyAddress(address)).length) {
            setIsForceErrorTtyAddrList(true);
            props.touch(exports.FORM_NAME, "Tty.ttyAddrList");
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M50014C()));
            return;
        }
        await fetchAllTtyAddressList();
        dispatch(ttyActions.openTtyAddressDetailModal());
    };
    const handleClickBbAddressDetailButton = () => {
        const { bbCommGrpIdList, bbJobGrpIdList, bbJobIdList } = props;
        dispatch(bulletinBoardActions.openBbAddressDetailModal());
        void dispatch(addressActions.fetchAllJobCodeAddressList({
            commGrpIdList: bbCommGrpIdList,
            jobGrpIdList: bbJobGrpIdList,
            jobIdList: bbJobIdList,
        }));
    };
    const handleClickMailAddressDetailButton = async () => {
        const { mailAddrList } = props;
        if (mailAddrList.length !== (0, commonUtil_1.arrayUnique)(mailAddrList).length) {
            setIsForceErrorMailAddrList(true);
            props.touch(exports.FORM_NAME, "Mail.mailAddrList");
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M50020C({ items: mailAddrList })));
            return;
        }
        if (mailAddrList.filter((address) => !validates.isEmailAddress(address)).length) {
            setIsForceErrorMailAddrList(true);
            props.touch(exports.FORM_NAME, "Mail.mailAddrList");
            void dispatch(broadcastActions.showMessage(soalaMessages_1.SoalaMessage.M50014C()));
            return;
        }
        await fetchAllMailAddressList();
        dispatch(emailActions.openMailAddressDetailModal());
    };
    const handleClickNtfAddressDetailButton = () => {
        const { ntfCommGrpIdList, ntfJobGrpIdList, ntfJobIdList } = props;
        dispatch(notificationActions.openNotificationAddressDetailModal());
        void dispatch(addressActions.fetchAllJobCodeAddressList({
            commGrpIdList: ntfCommGrpIdList,
            jobGrpIdList: ntfJobGrpIdList,
            jobIdList: ntfJobIdList,
        }));
    };
    const handleChangeMailAddrGrpIdList = () => {
        setIsForceErrorMailAddrGrpIdList(false);
    };
    const handleChangeMailAddrList = () => {
        setIsForceErrorMailAddrList(false);
    };
    const handleChangeEmailCcSenderAddress = () => {
        const { ccSenderAddressChecked } = props.mail;
        StorageOfUser_1.storageOfUser.setBroadcastEmailCCSenderAddressChecked({ checked: !ccSenderAddressChecked });
    };
    const handleChangeTtyCcSenderAddress = () => {
        const { ccSenderAddressChecked } = props.tty;
        StorageOfUser_1.storageOfUser.setBroadcastTtyCCSenderAddressChecked({ checked: !ccSenderAddressChecked });
    };
    const handleChangeTtyDivisionSending = () => {
        const { divisionSendingChecked } = props.tty;
        StorageOfUser_1.storageOfUser.setBroadcastTtyDivisionSendingChecked({ checked: !divisionSendingChecked });
    };
    const handleChangeTtyAddrGrpIdList = () => {
        setIsForceErrorTtyAddrGrpIdList(false);
    };
    const handleChangeTtyAddrList = () => {
        setIsForceErrorTtyAddrList(false);
    };
    const handleCloseFlightLegSearchModal = () => dispatch(bulletinBoardActions.closeFlightLegSearchModal());
    const handleCloseMailAddressDetailModal = () => dispatch(emailActions.closeMailAddressDetailModal());
    const handleCloseBbAddressDetailModal = () => dispatch(bulletinBoardActions.closeBbAddressDetailModal());
    const handleCloseTtyAddressDetailModal = () => dispatch(ttyActions.closeTtyAddressDetailModal());
    const handleCloseNotificationAddressDetailModal = () => dispatch(notificationActions.closeNotificationAddressDetailModal());
    const renderModals = () => {
        const { addressJobCdList, ttyAddrDetails, mailAddrDetails, isOpenSaveAsModal, isOpenFlightLegSearchModal, isOpenSearchFilterModal, isOpenTemplateNameEditModal, isOpenBbAddressDetailModal, isOpenMailAddressDetailModal, isOpenTtyAddressDetailModal, isOpenNotificationAddressDetailModal, } = props;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(TemplateFilterModal_1.default, { isOpen: isOpenSearchFilterModal, onRequestClose: handleCloseSearchFilterModal, onKeywordKeyPress: handleKeywordKeyPress, onClickClear: handleClearFilter, 
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClickFilter: applyModalFilter }),
            react_1.default.createElement(TemplateNameEditModal_1.default, { isOpen: isOpenSaveAsModal, onRequestClose: handleCloseSaveAsModal, onTemplateNameKeyPress: handleTemplateNameKeyPress, onClickCancel: handleCloseSaveAsModal, onClickSave: handleSubmitNewTemplate }),
            react_1.default.createElement(TemplateNameEditModal_1.default, { isOpen: isOpenTemplateNameEditModal, onRequestClose: handleCloseTemplateNameEditModal, onTemplateNameKeyPress: handleTemplateNameEditKeyPress, onClickCancel: handleCloseTemplateNameEditModal, 
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClickSave: handleSubmitTemplateName }),
            react_1.default.createElement(FlightLegSearchModal_1.default, { isOpen: isOpenFlightLegSearchModal, onClickFlightLeg: handleClickFlightLegButton, handleClose: handleCloseFlightLegSearchModal }),
            react_1.default.createElement(DetailModal_1.default, { header: "Job Code Detail", style: styles.jobCodeModal, isOpen: isOpenBbAddressDetailModal, onRequestClose: handleCloseBbAddressDetailModal, isPc: storage_1.storage.isPc, data: addressJobCdList, 
                // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                DetailComponent: (prop) => react_1.default.createElement(JobCodeDetail, { key: prop.row }, prop.row) }),
            react_1.default.createElement(DetailModal_1.default, { header: "e-mail Address Detail", style: styles.emailModal, isOpen: isOpenMailAddressDetailModal, onRequestClose: handleCloseMailAddressDetailModal, isPc: storage_1.storage.isPc, data: mailAddrDetails, 
                // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                DetailComponent: (prop) => react_1.default.createElement(EmailDetail, { key: prop.row }, prop.row) }),
            react_1.default.createElement(DetailModal_1.default, { header: "TTY Address Detail", style: styles.ttyAddressModal, isOpen: isOpenTtyAddressDetailModal, onRequestClose: handleCloseTtyAddressDetailModal, isPc: storage_1.storage.isPc, data: ttyAddrDetails, 
                // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                DetailComponent: (prop) => react_1.default.createElement(TtyDetail, { key: prop.row }, prop.row) }),
            react_1.default.createElement(DetailModal_1.default, { header: "Job Code Detail", style: styles.jobCodeModal, isOpen: isOpenNotificationAddressDetailModal, onRequestClose: handleCloseNotificationAddressDetailModal, isPc: storage_1.storage.isPc, data: addressJobCdList, 
                // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                DetailComponent: (prop) => react_1.default.createElement(JobCodeDetail, { key: prop.row }, prop.row) })));
    };
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { loading, bbAttachments, canManageBb, canManageEmail, canManageTty, canManageAftn, canManageAcars, canManageNotification, emailAttachments, mailAddrGrpIdList, mailAddrList, ttyAddrGrpIdList, ttyAddrList, isTemplateFiltered, change, } = props;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Wrapper, null,
        react_1.default.createElement(Form, { isPc: isPc },
            isEditMode() ? null : (react_1.default.createElement(Left, null,
                react_1.default.createElement(TemplateJobCodeSearch_1.default, { onChangeJobCode: handleChangeJobCode, jobOption: props.jobOptionForTemplate }),
                react_1.default.createElement(TemplateFilter_1.default, { onFilterKeyPress: handleFilterKeyPress, onChangeFilter: handleChangeFilter, filter: filter, onClickTemplateFilter: handleClickTemplateFilter, applyFilter: () => (isTemplateFiltered ? handleClearFilter() : handleApplyFilter()), isNameActive: isName(), onClickNameFilterTab: () => handleClickFilterTab(FilterTabName.name), isRecentlyActive: isRecently(), onClickRecentlyFilterTab: () => handleClickFilterTab(FilterTabName.recently) }),
                react_1.default.createElement(TemplateList_1.default, { id: template.id, onClickEdit: handleClickTemplateNameEdit, 
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClickDelete: handleDeleteTemplate, onClickTemplate: handleClickTemplate }))),
            react_1.default.createElement(Right, null,
                react_1.default.createElement(RightContainer, null,
                    react_1.default.createElement(Tabs_1.default, { isBbActive: isBb(), isEmailActive: isEmail(), isTtyActive: isTty(), isAftnActive: isAftn(), isNotificationActive: isNotification(), isAcarsActive: isAcars(), 
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClickBb: () => handleChangeTab(TabName.bb, false), 
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClickEmail: () => handleChangeTab(TabName.email, isEditMode()), 
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClickTty: () => handleChangeTab(TabName.tty, isEditMode()), 
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClickAftn: () => handleChangeTab(TabName.aftn, isEditMode()), 
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClickNotification: () => handleChangeTab(TabName.notification, isEditMode()), 
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClickAcars: () => handleChangeTab(TabName.acars, isEditMode()), emailDisabled: isEditMode(), ttyDisabled: isEditMode(), aftnDisabled: isEditMode(), notificationDisabled: isEditMode(), acarsDisabled: isEditMode(), reloadButtonDisabled: isEditMode(), 
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClickReload: handleClickReload, isFetching: loading, myApoCd: jobAuthUser.myApoCd }),
                    canManageBb && (react_1.default.createElement(BroadcastBulletinBoard_1.default, { isActive: isBb(), bbFlightLeg: props.bbFlightLeg, bbAttachments: bbAttachments, onClickFlightLegField: handleClickFlightLegField, onClickAddressDetailButton: handleClickBbAddressDetailButton, onUploadFiles: (uploadFiles) => props.change("BB.attachments", [...bbAttachments, ...uploadFiles]), onRemoveFile: (index) => props.change("BB.attachments", Array.from(bbAttachments).filter((_, i) => i !== index)), onClickExpiryDateField: handleClickExpiryDate })),
                    !isBbEdit() && canManageEmail && (react_1.default.createElement(BroadcastEmail_1.default, { isActive: isEmail(), 
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClickAddressDetail: handleClickMailAddressDetailButton, emailAttachments: emailAttachments, onUploadFiles: (uploadFiles) => props.change("Mail.attachments", [...emailAttachments, ...uploadFiles]), onRemoveFile: (index) => props.change("Mail.attachments", Array.from(emailAttachments).filter((_, i) => i !== index)), mailAddrGrpIdList: mailAddrGrpIdList, mailAddrList: mailAddrList, isForceErrorMailAddrGrpIdList: isForceErrorMailAddrGrpIdList, isForceErrorMailAddrList: isForceErrorMailAddrList, onChangeMailAddrGrpIdList: handleChangeMailAddrGrpIdList, onChangeMailAddrList: handleChangeMailAddrList, onChangeCcSenderAddress: handleChangeEmailCcSenderAddress, change: change })),
                    !isBbEdit() && canManageTty && (react_1.default.createElement(BroadcastTty_1.default, { isActive: isTty(), 
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClickAddressDetailButton: handleClickTtyAddressDetailButton, ttyAddrGrpIdList: ttyAddrGrpIdList, ttyAddrList: ttyAddrList, isForceErrorTtyAddrGrpIdList: isForceErrorTtyAddrGrpIdList, isForceErrorTtyAddrList: isForceErrorTtyAddrList, onChangeTtyAddrGrpIdList: handleChangeTtyAddrGrpIdList, onChangeTtyAddrList: handleChangeTtyAddrList, onChangeCcSenderAddress: handleChangeTtyCcSenderAddress, onChangeDivisionSending: handleChangeTtyDivisionSending, change: change })),
                    !isBbEdit() && canManageAftn && react_1.default.createElement(BroadcastAftn_1.default, { isActive: isAftn() }),
                    !isBbEdit() && canManageAcars && react_1.default.createElement(BroadcastAcars_1.default, { isActive: isAcars() }),
                    !isBbEdit() && canManageNotification && (react_1.default.createElement(BroadcastNotification_1.default, { isActive: isNotification(), onClickAddressDetailButton: handleClickNtfAddressDetailButton }))),
                react_1.default.createElement(RightFooter, null,
                    react_1.default.createElement(FooterButtonGroup, null, isEditMode() || isApplyingOtherJobCdTemplate() ? null : (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Save As", type: "button", onClick: handleClickSaveAs }),
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Save", type: "button", onClick: handleSubmitTemplate, disabled: !template.id })))),
                    react_1.default.createElement(FooterButtonGroup, null,
                        isEditMode() ? (react_1.default.createElement(SecondaryButton_1.default, { text: "Cancel", type: "button", onClick: handleClickCancel })) : (react_1.default.createElement(SecondaryButton_1.default, { text: "Clear", type: "button", onClick: handleClickClear })),
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Send", type: "button", onClick: handleClickSend })))),
            renderModals()),
        react_1.default.createElement(EventListener_1.default, { eventHandlers: [
                { target: window, type: "dragover", listener: (e) => e.preventDefault(), options: false },
                {
                    target: window,
                    type: "drop",
                    listener: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    },
                    options: false,
                },
            ] })));
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
`;
const Left = styled_components_1.default.div `
  width: 270px;
  padding: 10px;
  display: flex;
  flex-flow: column nowrap;
`;
const Right = styled_components_1.default.div `
  width: 746px;
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
exports.RightContent = styled_components_1.default.div `
  position: absolute;
  top: 54px;
  z-index: ${({ isActive }) => (isActive ? "2" : "1")};
  width: 100%;
  height: calc(
    100vh - ${({ isPc, theme }) => (isPc ? theme.layout.header.default : theme.layout.header.tablet)} - 10px - 44px - 16px - 44px
  );
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px 16px;
  margin-top: -1px;
  border: 1px solid #595857;
  background: ${(props) => (props.disabled ? "#C9D3D0" : "#FFF")};
`;
const Forms = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
`;
exports.Row = styled_components_1.default.div `
  width: ${(props) => props.width || exports.ROW_WIDTH}px;
  margin-bottom: ${(props) => (props.marginBottom === undefined ? "9px" : props.marginBottom)};
`;
exports.Flex = styled_components_1.default.div `
  display: flex;
  justify-content: ${(props) => props.position || "space-between"};
  align-items: ${(props) => props.alignItems || "center"};
  width: ${(props) => (props.width ? `${props.width}px` : "auto")};
`;
exports.Col = (0, styled_components_1.default)(Forms) `
  width: ${(props) => props.width}px;
`;
exports.Label = styled_components_1.default.div `
  margin-bottom: 3px;
  font-size: 12px;
  width: 100%;
`;
exports.TextAreaContainer = styled_components_1.default.div `
  width: 100%;
  textarea {
    min-height: ${(props) => props.height || 170}px;
    padding: 10px 6px;
  }
`;
exports.TextAreaContainerFixed = styled_components_1.default.div `
  width: 100%;
  textarea {
    min-height: ${(props) => props.height || 170}px;
    padding: 10px 6px;
    font-family: Consolas, "Courier New", Courier, Monaco, monospace;
  }
`;
exports.Ruler = styled_components_1.default.span `
  font-family: Consolas, "Courier New", Courier, Monaco, monospace;
  font-size: 16px;
  line-height: 1.2;
  margin-left: ${({ isPc }) => (isPc ? "7px" : "10px")};
`;
exports.ModalButtonGroup = styled_components_1.default.div `
  display: flex;
  width: 75%;
  margin: ${(props) => props.margin || "25px auto"};
  justify-content: space-around;
  > button {
    align-self: flex-end;
    width: 120px;
  }
`;
exports.CheckBoxContainer = (0, styled_components_1.default)(exports.Col) `
  align-self: flex-end;
  ${({ height }) => (height !== undefined ? `height: ${height}px;` : "")}
`;
exports.CheckBoxLabel = styled_components_1.default.label `
  display: flex;
  align-items: center;
  line-height: 44px;
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
    background: #fff;
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
    &:indeterminate {
      border-color: ${(props) => props.theme.color.PRIMARY};
      background: ${(props) => props.theme.color.PRIMARY};
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 14px;
        left: 7px;
        width: 16px;
        border-bottom: 2px solid #fff;
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
const FooterButtonGroup = styled_components_1.default.div `
  display: flex;
  width: 300px;
  justify-content: space-around;
  > button {
    align-self: flex-end;
    width: 120px;
  }
`;
const JobCodeDetail = styled_components_1.default.div `
  width: 168px;
  min-height: 44px;
  padding: 8px;
  margin: 5px 10px;
  display: flex;
  align-items: center;
  font-size: 17px;
  background: #f6f6f6;
  border-radius: 1px;
  border: 1px solid #c9d3d0;
  text-align: left;
  overflow: hidden;
  overflow-wrap: break-word;
  word-break: break-all;
`;
const EmailDetail = (0, styled_components_1.default)(JobCodeDetail) `
  width: 338px;
`;
const TtyDetail = (0, styled_components_1.default)(JobCodeDetail) `
  margin: 5px;
  width: 136px;
`;
exports.selector = (0, redux_form_1.formValueSelector)(exports.FORM_NAME);
const mapStateToProps = (state) => {
    const { common: { headerInfo: { apoTimeLcl }, }, account: { jobAuth: { user, jobAuth }, master: { jobs, cdCtrlDtls }, }, broadcast, } = state;
    const { Broadcast: { canManageBb, canManageEmail, canManageTty, canManageAftn, canManageNotification, canManageAcars, isOpenSaveAsModal, isOpenSearchFilterModal, isTemplateFiltered, templates, isOpenTemplateNameEditModal, fetchingAll, }, BulletinBoard: { flightLegs, isFlightLegEnabled, isOpenFlightLegSearchModal, fetchingAllFlightLeg, isOpenBbAddressDetailModal, detail, newBbId, }, Email: { isOpenMailAddressDetailModal }, Tty: { isOpenTtyAddressDetailModal }, Notification: { isOpenNotificationAddressDetailModal }, } = broadcast;
    const userJobResult = jobs.find(({ jobCd }) => jobCd === user.jobCd);
    const jobIdList = userJobResult ? [userJobResult.jobId] : [];
    const expiryDateInitialValue = apoTimeLcl ? (0, dayjs_1.default)(apoTimeLcl).add(2, "day").format("YYYY-MM-DD") : "";
    const initialValues = {
        templateJobCd: user.jobCd,
        filterTabName: FilterTabName.name,
        tabName: canManageBb
            ? TabName.bb
            : canManageEmail
                ? TabName.email
                : canManageTty
                    ? TabName.tty
                    : canManageAftn
                        ? TabName.aftn
                        : canManageNotification
                            ? TabName.notification
                            : canManageAcars
                                ? TabName.acars
                                : null,
        keyword: "",
        isFlightLegEnabled: false,
        BB: {
            catCdList: [],
            commGrpIdList: [],
            jobGrpIdList: [],
            jobIdList,
            bbTitle: "",
            bbText: "",
            flightLeg: {},
            attachments: [],
            expiryDate: expiryDateInitialValue,
        },
        Mail: {
            mailAddrGrpIdList: [],
            mailAddrList: [],
            orgnMailAddr: user.mailAddr,
            mailTitle: "",
            mailText: "",
            attachments: [],
        },
        Tty: {
            ttyAddrGrpIdList: [],
            ttyAddrList: [],
            ttyPriorityCd: "QU",
            orgnTtyAddr: user.ttyAddr,
            ttyText: "",
        },
        Aftn: {
            priority: "QU",
            originator: user.ttyAddr,
            aftnText: "",
        },
        Notification: {
            commGrpIdList: [],
            jobGrpIdList: [],
            jobIdList,
            ntfTitle: "",
            ntfText: "",
            soundFlg: true,
        },
        Acars: {
            shipNoList: [],
            orgnTtyAddr: user.ttyAddr,
            uplinkText: "",
            reqAckFlg: false,
        },
    };
    const jobOption = jobs.map((job) => (0, exports.createOption)(job.jobId, job.jobCd, job.jobCd === user.jobCd));
    const addressJobList = state.address.jobList;
    const jobOptionForTemplate = jobs.map((job) => ({ value: job.jobCd, label: job.jobCd }));
    const jobMap = jobs.reduce((result, job) => result.set(job.jobCd, job.jobId), new Map());
    return {
        jobAuthUser: user,
        apoTimeLcl,
        jobAuth,
        cdCtrlDtls,
        canManageBb,
        canManageEmail,
        canManageTty,
        canManageAftn,
        canManageNotification,
        canManageAcars,
        jobOption,
        jobOptionForTemplate,
        jobMap,
        initialValues,
        loading: fetchingAll ||
            broadcast.BulletinBoard.fetchingBb ||
            broadcast.BulletinBoard.fetching ||
            broadcast.BulletinBoard.fetchingAllFlightLeg ||
            broadcast.Email.fetching ||
            broadcast.Tty.fetching ||
            broadcast.Aftn.fetching ||
            broadcast.Acars.fetching ||
            broadcast.Notification.fetching,
        loadingTemplate: fetchingAll ||
            broadcast.BulletinBoard.fetching ||
            broadcast.Email.fetching ||
            broadcast.Tty.fetching ||
            broadcast.Aftn.fetching ||
            broadcast.Acars.fetching ||
            broadcast.Notification.fetching,
        bulletinBoardTemplate: broadcast.BulletinBoard.template,
        emailTemplate: broadcast.Email.template,
        ttyTemplate: broadcast.Tty.template,
        aftnTemplate: broadcast.Aftn.template,
        notificationTemplate: broadcast.Notification.template,
        acarsTemplate: broadcast.Acars.template,
        isOpenSaveAsModal,
        isOpenFlightLegSearchModal,
        isOpenSearchFilterModal,
        isOpenTemplateNameEditModal,
        isOpenFlightNumberInputPopup: state.flightNumberInputPopup.isOpen,
        isOpenBbAddressDetailModal,
        isOpenMailAddressDetailModal,
        isOpenTtyAddressDetailModal,
        isOpenNotificationAddressDetailModal,
        addressJobCdList: (0, lodash_orderby_1.default)(addressJobList.map((job) => job.jobCd)),
        flightLegs,
        isFlightLegEnabled,
        isTemplateFiltered,
        fetchingAllFlightLeg,
        fetchingBulletinBoard: broadcast.BulletinBoard.fetching,
        fetchingEmail: broadcast.Email.fetching,
        fetchingTty: broadcast.Tty.fetching,
        fetchingAftn: broadcast.Aftn.fetching,
        fetchingNotification: broadcast.Notification.fetching,
        fetchingAcars: broadcast.Acars.fetching,
        fetchingBb: broadcast.BulletinBoard.fetchingBb,
        templateJobCd: (0, exports.selector)(state, "templateJobCd"),
        filterTabName: (0, exports.selector)(state, "filterTabName"),
        tabName: (0, exports.selector)(state, "tabName"),
        bbAttachments: (0, exports.selector)(state, "BB.attachments"),
        emailAttachments: (0, exports.selector)(state, "Mail.attachments"),
        bbCommGrpIdList: (0, exports.selector)(state, "BB.commGrpIdList"),
        bbJobGrpIdList: (0, exports.selector)(state, "BB.jobGrpIdList"),
        bbJobIdList: (0, exports.selector)(state, "BB.jobIdList"),
        templates,
        keyword: (0, exports.selector)(state, "keyword"),
        sendBy: (0, exports.selector)(state, "sendBy"),
        alCd: (0, exports.selector)(state, "alCd") || "",
        bbFlightLeg: (0, exports.selector)(state, "BB.flightLeg") || {},
        bbCategories: (0, exports.selector)(state, "BB.catCdList") || [],
        mailAddrGrpIdList: (0, exports.selector)(state, "Mail.mailAddrGrpIdList") || [],
        mailAddrList: (0, exports.selector)(state, "Mail.mailAddrList") || [],
        orgnMailAddr: (0, exports.selector)(state, "Mail.orgnMailAddr"),
        ttyAddrGrpIdList: (0, exports.selector)(state, "Tty.ttyAddrGrpIdList") || [],
        ttyAddrList: (0, exports.selector)(state, "Tty.ttyAddrList") || [],
        ntfCommGrpIdList: (0, exports.selector)(state, "Notification.commGrpIdList") || [],
        ntfJobGrpIdList: (0, exports.selector)(state, "Notification.jobGrpIdList") || [],
        ntfJobIdList: (0, exports.selector)(state, "Notification.jobIdList") || [],
        templateName: (0, exports.selector)(state, "templateName") || "",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        bb: (0, exports.selector)(state, "BB") || {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        mail: (0, exports.selector)(state, "Mail") || {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tty: (0, exports.selector)(state, "Tty") || {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        aftn: (0, exports.selector)(state, "Aftn") || {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        notification: (0, exports.selector)(state, "Notification") || {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        acars: (0, exports.selector)(state, "Acars") || {},
        templateId: (0, exports.selector)(state, "templateId"),
        bbTemplateId: (0, exports.selector)(state, "BB.templateId") || null,
        mailTemplateId: (0, exports.selector)(state, "Mail.templateId") || null,
        ttyTemplateId: (0, exports.selector)(state, "Tty.templateId") || null,
        aftnTemplateId: (0, exports.selector)(state, "Aftn.templateId") || null,
        notificationTemplateId: (0, exports.selector)(state, "Notification.templateId") || null,
        acarsTemplateId: (0, exports.selector)(state, "Acars.templateId") || null,
        displayDate: (0, exports.selector)(state, "displayDate") || "",
        detail: detail,
        ttyAddrDetails: (0, lodash_orderby_1.default)(state.address.ttyAddrList),
        mailAddrDetails: (0, lodash_orderby_1.default)(state.address.mailAddrList),
        newBbId,
        bbExpiryDate: (0, exports.selector)(state, "BB.expiryDate") || "",
        expiryDateInitialValue,
        broadcastType: (0, exports.selector)(state, "broadcastType") || "",
    };
};
const BroadcastForm = (0, redux_form_1.reduxForm)({
    form: exports.FORM_NAME,
    enableReinitialize: true,
})(Broadcast);
exports.default = (0, react_redux_1.connect)(mapStateToProps)(BroadcastForm);
//# sourceMappingURL=Broadcast.js.map