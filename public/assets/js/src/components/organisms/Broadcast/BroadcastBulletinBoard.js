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
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const commonConst_1 = require("../../../lib/commonConst");
const validates = __importStar(require("../../../lib/validators"));
const storage_1 = require("../../../lib/storage");
const EventListener_1 = __importDefault(require("../../atoms/EventListener"));
const MultipleSelectBox_1 = __importDefault(require("../../atoms/MultipleSelectBox"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const TextArea_1 = __importDefault(require("../../atoms/TextArea"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const UploadFilesComponent_1 = __importDefault(require("../../molecules/UploadFilesComponent"));
// eslint-disable-next-line import/no-cycle
const Broadcast_1 = require("./Broadcast");
const BroadcastBulletinBoard = (props) => {
    const contentRef = (0, react_1.useRef)(null);
    const otherInputsAreaRef = (0, react_1.useRef)(null);
    const attachmentAreaRef = (0, react_1.useRef)(null);
    const [textAreaHeight, setTextAreaHeight] = (0, react_1.useState)(Broadcast_1.DEFAULT_TEXTAREA_HEIGHT);
    const [calculated, setCalculated] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!calculated && isReady()) {
            setTextAreaHeight(calcTextAreaHeight());
            setCalculated(true);
        }
    }, [calculated]);
    const isReady = () => !!(contentRef.current && otherInputsAreaRef.current && attachmentAreaRef.current);
    const calcTextAreaHeight = () => {
        if (!contentRef.current || !otherInputsAreaRef.current || !attachmentAreaRef.current) {
            return Broadcast_1.DEFAULT_TEXTAREA_HEIGHT;
        }
        const height = contentRef.current.clientHeight - otherInputsAreaRef.current.offsetHeight - attachmentAreaRef.current.offsetHeight - 52;
        return height < Broadcast_1.TEXTAREA_MIN_HEIGHT ? Broadcast_1.DEFAULT_TEXTAREA_HEIGHT : height;
    };
    const { isActive, categoryOption, commGrpOption, grpOption, jobOption, isFlightLegEnabled, bbFlightLeg, onClickFlightLegField, onClickAddressDetailButton, bbAttachments, onUploadFiles, onRemoveFile, onClickExpiryDateField, displayExpiryDate, } = props;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Broadcast_1.RightContent, { disabled: false, isPc: isPc, isActive: isActive, ref: contentRef },
        react_1.default.createElement(Broadcast_1.Row, { ref: otherInputsAreaRef },
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(Broadcast_1.Col, { width: 450 },
                        react_1.default.createElement(Broadcast_1.Label, null, "Category"),
                        react_1.default.createElement(redux_form_1.Field, { name: "BB.catCdList", options: categoryOption, component: MultipleSelectBox_1.default, validate: [validates.required, validates.unique], maxValLength: CATEGORY_ITEM_MAX, spaceDelimiter: false })),
                    react_1.default.createElement(Broadcast_1.Col, { width: 246 },
                        react_1.default.createElement(Broadcast_1.Label, null, "Flight/LEG"),
                        react_1.default.createElement(redux_form_1.Field, { name: "BB.flightLeg", 
                            // eslint-disable-next-line react/no-unstable-nested-components
                            component: (componentProps) => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                const { error, touched, submitFailed } = componentProps.meta;
                                const hasError = !!error && touched && submitFailed;
                                return (react_1.default.createElement(FlightLegField, { disabled: !isFlightLegEnabled, onClick: onClickFlightLegField, hasError: hasError }, getDisplayFlightLeg(bbFlightLeg)));
                            }, validate: isFlightLegEnabled ? [validates.required] : [] })))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "Communication Group"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(Broadcast_1.Flex, { width: 450 },
                        react_1.default.createElement(redux_form_1.Field, { name: "BB.commGrpIdList", options: commGrpOption, component: MultipleSelectBox_1.default, validate: [validates.unique], maxValLength: COMMUNICATION_GROUP_ITEM_MAX })),
                    react_1.default.createElement(Broadcast_1.Col, { width: 190 },
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Address Detail", type: "button", onClick: onClickAddressDetailButton })))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "Job Group"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "BB.jobGrpIdList", options: grpOption, component: MultipleSelectBox_1.default, validate: [validates.unique], maxValLength: JOB_GROUP_ITEM_MAX }))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "Job Code"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "BB.jobIdList", options: jobOption, component: MultipleSelectBox_1.default, validate: [validates.required, validates.unique], maxValLength: JOB_CODE_ITEM_MAX }))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(Broadcast_1.Col, { width: 514 },
                        react_1.default.createElement(Broadcast_1.Label, null, "Title"),
                        react_1.default.createElement(redux_form_1.Field, { name: "BB.bbTitle", autoCapitalize: "off", component: TextInput_1.default, validate: [validates.required], width: 514, maxLength: 300 })),
                    react_1.default.createElement(Broadcast_1.Col, { width: 182 },
                        react_1.default.createElement(Broadcast_1.Label, null, "Expiry Date"),
                        react_1.default.createElement(redux_form_1.Field, { name: "BB.expiryDate", autoCapitalize: "off", component: TextInput_1.default, width: 182, maxLength: 10, validate: [validates.required, validates.isExpiryDate], showKeyboard: onClickExpiryDateField, displayValue: displayExpiryDate, isShadowOnFocus: true }))))),
        react_1.default.createElement(Broadcast_1.Row, null,
            react_1.default.createElement(Broadcast_1.TextAreaContainer, { isPc: isPc, height: textAreaHeight },
                react_1.default.createElement(redux_form_1.Field, { name: "BB.bbText", component: TextArea_1.default, maxLength: 102400, width: "100%", maxWidth: "100%", minWidth: "100%", validate: [validates.isOkUnlimitedTextByte] }))),
        react_1.default.createElement(Broadcast_1.Row, { marginBottom: 0, ref: attachmentAreaRef },
            react_1.default.createElement(UploadFilesComponent_1.default, { channel: "bb", uploadedFiles: bbAttachments, onUploadFiles: onUploadFiles, onRemoveFile: onRemoveFile })),
        react_1.default.createElement(EventListener_1.default, { eventHandlers: [
                {
                    target: window,
                    type: "resize",
                    listener: () => setTextAreaHeight(calcTextAreaHeight()),
                    options: false,
                },
            ] })));
};
const FlightLegField = styled_components_1.default.div `
  background-color: ${(props) => (props.disabled ? "#EBEBE4" : "#FFF")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  width: 100%;
  height: 44px;
  line-height: 44px;
  padding: 0 8px 0 6px;
  border: 1px solid ${(props) => (props.hasError ? props.theme.color.border.ERROR : "#346181")};
  border-radius: 1px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;
const CATEGORY_ITEM_MAX = 3;
const COMMUNICATION_GROUP_ITEM_MAX = 4;
const JOB_GROUP_ITEM_MAX = 4;
const JOB_CODE_ITEM_MAX = 4;
const getDisplayFlightLeg = (flightLeg) => {
    if (flightLeg.orgDateLcl) {
        const orgDateLclDayjs = (0, dayjs_1.default)(flightLeg.orgDateLcl);
        const depApoCd = flightLeg.lstDepApoCd || "";
        const arrApoCd = flightLeg.lstArrApoCd || "";
        if (orgDateLclDayjs.isValid() && flightLeg.alCd) {
            return `${flightLeg.alCd}${flightLeg.fltNo}/${orgDateLclDayjs.format("DDMMM").toUpperCase()} ${depApoCd}-${arrApoCd}`;
        }
        if (orgDateLclDayjs.isValid() && flightLeg.casFltNo) {
            return `${flightLeg.casFltNo}/${orgDateLclDayjs.format("DDMMM").toUpperCase()} ${depApoCd}-${arrApoCd}`;
        }
        return "";
    }
    return "";
};
const mapStateToProps = (state) => {
    const { account: { jobAuth: { user }, master: { cdCtrlDtls, commGrps, grps, jobs }, }, broadcast, } = state;
    const { isFlightLegEnabled } = broadcast.BulletinBoard;
    const categoryOption = cdCtrlDtls
        .filter((cdCtrlDtl) => cdCtrlDtl.cdCls === commonConst_1.Const.CodeClass.BULLETIN_BOARD_CATEGORY)
        .sort((code1, code2) => code1.num1 - code2.num1)
        .map((cdCtrlDtl) => (0, Broadcast_1.createOption)(cdCtrlDtl.cdCat1, cdCtrlDtl.txt1, false, cdCtrlDtl.cd1));
    const commGrpOption = commGrps
        .slice()
        .sort((a, b) => a.commGrpDispSeq - b.commGrpDispSeq)
        .map((commGrp) => (0, Broadcast_1.createOption)(commGrp.commGrpId, commGrp.commGrpCd));
    const userGrp = grps.filter((grp) => grp.grpId === user.grpId);
    const otherGrps = grps.filter((grp) => grp.grpId !== user.grpId).sort((a, b) => a.grpDispSeq - b.grpDispSeq);
    const grpOption = userGrp.concat(otherGrps).map((grp) => (0, Broadcast_1.createOption)(grp.grpId, grp.grpCd));
    const userJobGrps = jobs.filter((grp) => grp.grpId === user.grpId).sort((a, b) => (a.jobCd < b.jobCd ? -1 : 1));
    const otherJobGrps = jobs.filter((grp) => grp.grpId !== user.grpId).sort((a, b) => (a.jobCd < b.jobCd ? -1 : 1));
    const jobOption = userJobGrps.concat(otherJobGrps).map((job) => (0, Broadcast_1.createOption)(job.jobId, job.jobCd, job.jobCd === user.jobCd));
    const expiryDate = (0, Broadcast_1.selector)(state, "BB.expiryDate");
    const displayExpiryDate = expiryDate.replace(/-/g, "/");
    return {
        categoryOption,
        commGrpOption,
        isFlightLegEnabled,
        grpOption,
        jobOption,
        displayExpiryDate,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(BroadcastBulletinBoard);
//# sourceMappingURL=BroadcastBulletinBoard.js.map