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
const StorageOfUser_1 = require("../../../lib/StorageOfUser");
const validates = __importStar(require("../../../lib/validators"));
const EventListener_1 = __importDefault(require("../../atoms/EventListener"));
const MultipleCreatableInput_1 = __importDefault(require("../../atoms/MultipleCreatableInput"));
const MultipleSelectBox_1 = __importDefault(require("../../atoms/MultipleSelectBox"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const TextArea_1 = __importDefault(require("../../atoms/TextArea"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
const UploadFilesComponent_1 = __importDefault(require("../../molecules/UploadFilesComponent"));
// eslint-disable-next-line import/no-cycle
const Broadcast_1 = require("./Broadcast");
const BroadcastEmail = (props) => {
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
    (0, react_1.useEffect)(() => {
        if (props.isActive) {
            props.change("Mail.ccSenderAddressChecked", StorageOfUser_1.storageOfUser.getBroadcastEmailCCSenderAddressChecked());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isActive]);
    const isReady = () => !!(contentRef.current && otherInputsAreaRef.current && attachmentAreaRef.current);
    const calcTextAreaHeight = () => {
        if (!contentRef.current || !otherInputsAreaRef.current || !attachmentAreaRef.current) {
            return Broadcast_1.DEFAULT_TEXTAREA_HEIGHT;
        }
        const height = contentRef.current.clientHeight - otherInputsAreaRef.current.offsetHeight - attachmentAreaRef.current.offsetHeight - 52;
        return height < Broadcast_1.TEXTAREA_MIN_HEIGHT ? Broadcast_1.DEFAULT_TEXTAREA_HEIGHT : height;
    };
    const { isActive, mailAddressGroupOption, onClickAddressDetail, emailAttachments, onUploadFiles, onRemoveFile, mailAddrGrpIdList, mailAddrList, isForceErrorMailAddrGrpIdList, isForceErrorMailAddrList, onChangeMailAddrGrpIdList, onChangeMailAddrList, onChangeCcSenderAddress, } = props;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Broadcast_1.RightContent, { disabled: false, isPc: isPc, isActive: isActive, ref: contentRef },
        react_1.default.createElement(Broadcast_1.Row, { ref: otherInputsAreaRef },
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "e-mail Address Group"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "Mail.mailAddrGrpIdList", options: mailAddressGroupOption, component: MultipleSelectBox_1.default, validate: mailAddrList.length > 0 ? [validates.unique] : [validates.required, validates.unique], maxValLength: MAIL_ADDRESS_GROUP_ITEM_MAX, isForceError: isForceErrorMailAddrGrpIdList, onChange: onChangeMailAddrGrpIdList }))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "e-mail Additional Address"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "Mail.mailAddrList", component: MultipleCreatableInput_1.default, validate: mailAddrGrpIdList.length > 0
                            ? [validates.isOkEmails, validates.unique]
                            : [validates.required, validates.isOkEmails, validates.unique], filterValue: filterEmailAddress, maxValLength: MAIL_ADDITIONAL_ADDRESS_ITEM_MAX, isForceError: isForceErrorMailAddrList, onChange: onChangeMailAddrList }))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Flex, { alignItems: "flex-end" },
                    react_1.default.createElement(Broadcast_1.Col, { width: 370 },
                        react_1.default.createElement(Broadcast_1.Label, null, "From"),
                        react_1.default.createElement(redux_form_1.Field, { name: "Mail.orgnMailAddr", component: TextInput_1.default, validate: [validates.required], width: 370, disabled: true, maxLength: 100 })),
                    react_1.default.createElement(Broadcast_1.Col, { width: 122 },
                        react_1.default.createElement(Broadcast_1.Label, null, "CC: Sender Address"),
                        react_1.default.createElement(Broadcast_1.CheckBoxContainer, { width: 120, height: 44 },
                            react_1.default.createElement(Broadcast_1.CheckBoxLabel, { htmlFor: "mailCCSenderAddressChecked" },
                                react_1.default.createElement(redux_form_1.Field, { id: "mailCCSenderAddressChecked", name: "Mail.ccSenderAddressChecked", component: "input", type: "checkbox", onChange: onChangeCcSenderAddress })))),
                    react_1.default.createElement(Broadcast_1.Col, { width: 190 },
                        react_1.default.createElement(PrimaryButton_1.default, { text: "Address Detail", type: "button", onClick: onClickAddressDetail, disabled: false })))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "Title"),
                react_1.default.createElement(redux_form_1.Field, { name: "Mail.mailTitle", autoCapitalize: "off", component: TextInput_1.default, width: Broadcast_1.ROW_WIDTH, maxLength: 100 }))),
        react_1.default.createElement(Broadcast_1.Row, null,
            react_1.default.createElement(Broadcast_1.TextAreaContainer, { isPc: isPc, height: textAreaHeight },
                react_1.default.createElement(redux_form_1.Field, { name: "Mail.mailText", component: TextArea_1.default, validate: [validates.required], maxLength: 4000, width: Broadcast_1.ROW_WIDTH, maxWidth: Broadcast_1.ROW_WIDTH, minWidth: Broadcast_1.ROW_WIDTH }))),
        react_1.default.createElement(Broadcast_1.Row, { ref: attachmentAreaRef },
            react_1.default.createElement(UploadFilesComponent_1.default, { channel: "email", uploadedFiles: emailAttachments, onUploadFiles: onUploadFiles, onRemoveFile: onRemoveFile })),
        react_1.default.createElement(EventListener_1.default, { eventHandlers: [
                {
                    target: window,
                    type: "resize",
                    listener: () => setTextAreaHeight(calcTextAreaHeight()),
                    options: false,
                },
            ] })));
};
const ADDRESS_GROUP_TYPE_MAIL = "M";
const MAIL_ADDRESS_GROUP_ITEM_MAX = 4;
const MAIL_ADDITIONAL_ADDRESS_ITEM_MAX = 8;
const filterEmailAddress = (value) => value.slice(0, 100);
const mapStateToProps = (state) => {
    const { account: { master: { adGrps }, }, } = state;
    const mailAddressGroupOption = adGrps
        .filter((adGrp) => adGrp.addrGrpType === ADDRESS_GROUP_TYPE_MAIL)
        .sort((a, b) => a.addrGrpDispSeq - b.addrGrpDispSeq)
        .map((adGrp) => (0, Broadcast_1.createOption)(adGrp.addrGrpId, adGrp.addrGrpCd));
    return {
        mailAddressGroupOption,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(BroadcastEmail);
//# sourceMappingURL=BroadcastEmail.js.map