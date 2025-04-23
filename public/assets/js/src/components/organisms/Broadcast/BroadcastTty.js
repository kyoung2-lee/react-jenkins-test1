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
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const storage_1 = require("../../../lib/storage");
const StorageOfUser_1 = require("../../../lib/StorageOfUser");
const commonUtil_1 = require("../../../lib/commonUtil");
const validates = __importStar(require("../../../lib/validators"));
const myValidates = __importStar(require("../../../lib/validators/broadcastValidator"));
const EventListener_1 = __importDefault(require("../../atoms/EventListener"));
const MultipleCreatableInput_1 = __importDefault(require("../../atoms/MultipleCreatableInput"));
const MultipleSelectBox_1 = __importDefault(require("../../atoms/MultipleSelectBox"));
const PrimaryButton_1 = __importDefault(require("../../atoms/PrimaryButton"));
const SuggestSelectBox_1 = __importDefault(require("../../atoms/SuggestSelectBox"));
const TextArea_1 = __importDefault(require("../../atoms/TextArea"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
// eslint-disable-next-line import/no-cycle
const Broadcast_1 = require("./Broadcast");
const BroadcastTty = (props) => {
    const contentRef = (0, react_1.useRef)(null);
    const otherInputsAreaRef = (0, react_1.useRef)(null);
    const dispatch = (0, hooks_1.useAppDispatch)();
    const [textAreaHeight, setTextAreaHeight] = (0, react_1.useState)(Broadcast_1.DEFAULT_TEXTAREA_HEIGHT);
    const [calculated, setCalculated] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (props.isActive) {
            props.change("Tty.ccSenderAddressChecked", StorageOfUser_1.storageOfUser.getBroadcastTtyCCSenderAddressChecked());
            props.change("Tty.divisionSendingChecked", StorageOfUser_1.storageOfUser.getBroadcastTtyDivisionSendingChecked());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isActive]);
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
    const handleKeyPress = (values) => values.map((value) => (0, commonUtil_1.toUpperCase)(value));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBlur = (e) => {
        if (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            toUpperCase(e.target.name, e.target.value);
        }
    };
    const toUpperCase = (fieldName, value) => {
        dispatch((0, redux_form_1.change)(Broadcast_1.FORM_NAME, fieldName, (0, commonUtil_1.toUpperCase)(value)));
    };
    const { isActive, ttyAddressGroupOption, ttyPriorityCdOption, onClickAddressDetailButton, ttyAddrGrpIdList, ttyAddrList, isForceErrorTtyAddrGrpIdList, isForceErrorTtyAddrList, onChangeTtyAddrGrpIdList, onChangeTtyAddrList, onChangeCcSenderAddress, onChangeDivisionSending, } = props;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Broadcast_1.RightContent, { disabled: false, isPc: isPc, isActive: isActive, ref: contentRef },
        react_1.default.createElement(Broadcast_1.Row, { ref: otherInputsAreaRef },
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "TTY Address Group"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "Tty.ttyAddrGrpIdList", options: ttyAddressGroupOption, component: MultipleSelectBox_1.default, validate: ttyAddrList.length > 0 ? [validates.unique] : [validates.unique, validates.required], maxValLength: TTY_ADDRESS_GROUP_ITEM_MAX, isForceError: isForceErrorTtyAddrGrpIdList, onChange: onChangeTtyAddrGrpIdList, fontFamily: 'Consolas, "Courier New", Courier, Monaco, monospace' }))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "TTY Additional Address"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "Tty.ttyAddrList", component: MultipleCreatableInput_1.default, validate: ttyAddrGrpIdList.length > 0
                            ? [validates.isOkBroadcastTtyAddresses]
                            : [validates.isOkBroadcastTtyAddresses, validates.required], filterValue: filterTtyAddress, formatValues: handleKeyPress, maxValLength: TTY_ADDITIONAL_ADDRESS_ITEM_MAX, isForceError: isForceErrorTtyAddrList, fontFamily: 'Consolas, "Courier New", Courier, Monaco, monospace', onChange: onChangeTtyAddrList }))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Flex, { alignItems: "flex-end" },
                    react_1.default.createElement(Broadcast_1.Col, { width: 70 },
                        react_1.default.createElement(Broadcast_1.Label, null, "Priority"),
                        react_1.default.createElement(redux_form_1.Field, { name: "Tty.ttyPriorityCd", component: SuggestSelectBox_1.default, validate: [validates.required, myValidates.isPriority], options: ttyPriorityCdOption, width: 70, maxLength: 2, hasBlank: true })),
                    react_1.default.createElement(Broadcast_1.Col, { width: 140 },
                        react_1.default.createElement(Broadcast_1.Label, null, "Originator"),
                        react_1.default.createElement(redux_form_1.Field, { name: "Tty.orgnTtyAddr", component: TextInput_1.default, width: 140, maxLength: 7, componentOnBlur: handleBlur, validate: [validates.isOkBroadcastTtyAddress, validates.required] })),
                    react_1.default.createElement(Broadcast_1.Col, { width: 270 },
                        react_1.default.createElement("div", { style: { width: "130px" } },
                            react_1.default.createElement(Broadcast_1.Label, null, "CC: Sender Address"),
                            react_1.default.createElement(Broadcast_1.CheckBoxContainer, { width: 120, height: 44 },
                                react_1.default.createElement(Broadcast_1.CheckBoxLabel, { htmlFor: "ttyCCSenderAddressChecked" },
                                    react_1.default.createElement(redux_form_1.Field, { id: "ttyCCSenderAddressChecked", name: "Tty.ccSenderAddressChecked", component: "input", type: "checkbox", onChange: onChangeCcSenderAddress })))),
                        react_1.default.createElement("div", { style: { width: "130px", marginLeft: "5px" } },
                            react_1.default.createElement(Broadcast_1.Label, null, "Division Sending"),
                            react_1.default.createElement(Broadcast_1.CheckBoxContainer, { width: 120, height: 44 },
                                react_1.default.createElement(Broadcast_1.CheckBoxLabel, { htmlFor: "ttyDivisionSendingChecked" },
                                    react_1.default.createElement(redux_form_1.Field, { id: "ttyDivisionSendingChecked", name: "Tty.divisionSendingChecked", component: "input", type: "checkbox", onChange: onChangeDivisionSending }))))),
                    react_1.default.createElement(Broadcast_1.Col, { width: 190 },
                        react_1.default.createElement(TtyAddressDetailButton, null,
                            react_1.default.createElement(PrimaryButton_1.default, { text: "Address Detail", type: "button", onClick: onClickAddressDetailButton, disabled: false }))))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Ruler, { isPc: isPc }, "....+....1....+....2....+....3....+....4....+....5....+....6....+....7"))),
        react_1.default.createElement(Broadcast_1.Row, null,
            react_1.default.createElement(Broadcast_1.TextAreaContainerFixed, { isPc: isPc, height: textAreaHeight },
                react_1.default.createElement(redux_form_1.Field, { name: "Tty.ttyText", component: TextArea_1.default, width: Broadcast_1.ROW_WIDTH, maxLength: 4000, maxLengthCRLFCheck: true, maxWidth: Broadcast_1.ROW_WIDTH, minWidth: Broadcast_1.ROW_WIDTH, maxRowLength: 69, componentOnBlur: handleBlur, validate: [validates.required, validates.isOkBroadcastTty] }))),
        react_1.default.createElement(EventListener_1.default, { eventHandlers: [
                {
                    target: window,
                    type: "resize",
                    listener: () => setTextAreaHeight(calcTextAreaHeight()),
                    options: false,
                },
            ] })));
};
const TtyAddressDetailButton = styled_components_1.default.div `
  position: relative;
  width: 100%;
`;
const ADDRESS_GROUP_TYPE_TTY = "T";
const TTY_ADDRESS_GROUP_ITEM_MAX = 4;
const TTY_ADDITIONAL_ADDRESS_ITEM_MAX = 100;
const filterTtyAddress = (value) => value.slice(0, 7);
const mapStateToProps = (state) => {
    const { account: { master: { cdCtrlDtls, adGrps }, }, } = state;
    const ttyAddressGroupOption = adGrps
        .filter((adGrp) => adGrp.addrGrpType === ADDRESS_GROUP_TYPE_TTY)
        .sort((a, b) => a.addrGrpDispSeq - b.addrGrpDispSeq)
        .map((adGrp) => (0, Broadcast_1.createOption)(adGrp.addrGrpId, adGrp.addrGrpCd));
    const ttyPriorityCdOption = (0, commonUtil_1.getPriorities)(cdCtrlDtls);
    return {
        ttyAddressGroupOption,
        ttyPriorityCdOption,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(BroadcastTty);
//# sourceMappingURL=BroadcastTty.js.map