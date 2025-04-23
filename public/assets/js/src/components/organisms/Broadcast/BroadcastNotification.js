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
const react_redux_1 = require("react-redux");
const redux_form_1 = require("redux-form");
const storage_1 = require("../../../lib/storage");
const validates = __importStar(require("../../../lib/validators"));
const EventListener_1 = __importDefault(require("../../atoms/EventListener"));
const MultipleSelectBox_1 = __importDefault(require("../../atoms/MultipleSelectBox"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const TextArea_1 = __importDefault(require("../../atoms/TextArea"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
// eslint-disable-next-line import/no-cycle
const Broadcast_1 = require("./Broadcast");
const BroadcastNotification = (props) => {
    const contentRef = (0, react_1.useRef)(null);
    const otherInputsAreaRef = (0, react_1.useRef)(null);
    const [textAreaHeight, setTextAreaHeight] = (0, react_1.useState)(Broadcast_1.DEFAULT_TEXTAREA_HEIGHT);
    const [calculated, setCalculated] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!calculated && isReady()) {
            setTextAreaHeight(calcTextAreaHeight());
            setCalculated(true);
        }
    }, [calculated]);
    const isReady = () => !!(contentRef.current && otherInputsAreaRef.current);
    const calcTextAreaHeight = () => {
        if (!contentRef.current || !otherInputsAreaRef.current) {
            return Broadcast_1.DEFAULT_TEXTAREA_HEIGHT;
        }
        const height = contentRef.current.clientHeight - otherInputsAreaRef.current.offsetHeight - 42;
        return height < Broadcast_1.TEXTAREA_MIN_HEIGHT ? Broadcast_1.DEFAULT_TEXTAREA_HEIGHT : height;
    };
    const { isActive, commGrpOption, grpOption, jobOption, onClickAddressDetailButton } = props;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Broadcast_1.RightContent, { disabled: false, isPc: isPc, isActive: isActive, ref: contentRef },
        react_1.default.createElement(Broadcast_1.Row, { ref: otherInputsAreaRef },
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "Communication Group"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(Broadcast_1.Flex, { width: 475 },
                        react_1.default.createElement(redux_form_1.Field, { name: "Notification.commGrpIdList", options: commGrpOption, component: MultipleSelectBox_1.default, validate: [validates.unique], maxValLength: COMMUNICATION_GROUP_ITEM_MAX })),
                    react_1.default.createElement(Broadcast_1.Col, { width: 190 },
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Address Detail", type: "button", onClick: onClickAddressDetailButton })))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "Job Group"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "Notification.jobGrpIdList", options: grpOption, component: MultipleSelectBox_1.default, validate: [validates.unique], maxValLength: JOB_GROUP_ITEM_MAX }))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "Job Code"),
                react_1.default.createElement(redux_form_1.Field, { name: "Notification.jobIdList", component: MultipleSelectBox_1.default, options: jobOption, validate: [validates.required, validates.unique], maxValLength: JOB_CODE_ITEM_MAX })),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "Title"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(Broadcast_1.Flex, { width: 496 },
                        react_1.default.createElement(redux_form_1.Field, { name: "Notification.ntfTitle", autoCapitalize: "off", component: TextInput_1.default, width: 496, maxLength: 300, validate: [validates.required] })),
                    react_1.default.createElement(Broadcast_1.CheckBoxContainer, { width: 200 },
                        react_1.default.createElement(Broadcast_1.CheckBoxLabel, { htmlFor: "soundFlg" },
                            react_1.default.createElement(redux_form_1.Field, { id: "soundFlg", name: "Notification.soundFlg", component: "input", tabIndex: 22, type: "checkbox" }),
                            "Notification Sound"))))),
        react_1.default.createElement(Broadcast_1.Row, null,
            react_1.default.createElement(Broadcast_1.TextAreaContainer, { isPc: isPc, height: textAreaHeight },
                react_1.default.createElement(redux_form_1.Field, { name: "Notification.ntfText", component: TextArea_1.default, width: Broadcast_1.ROW_WIDTH, maxLength: 3200, maxWidth: Broadcast_1.ROW_WIDTH, minWidth: Broadcast_1.ROW_WIDTH, validate: [validates.isOkBroadcastNtf] }))),
        react_1.default.createElement(EventListener_1.default, { eventHandlers: [
                {
                    target: window,
                    type: "resize",
                    listener: () => setTextAreaHeight(calcTextAreaHeight()),
                    options: false,
                },
            ] })));
};
const COMMUNICATION_GROUP_ITEM_MAX = 4;
const JOB_GROUP_ITEM_MAX = 4;
const JOB_CODE_ITEM_MAX = 4;
const mapStateToProps = (state) => {
    const { account: { jobAuth: { user }, master: { jobs, grps, commGrps }, }, } = state;
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
    return {
        commGrpOption,
        grpOption,
        jobOption,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(BroadcastNotification);
//# sourceMappingURL=BroadcastNotification.js.map