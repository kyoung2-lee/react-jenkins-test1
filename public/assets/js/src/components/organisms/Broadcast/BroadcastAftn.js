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
const hooks_1 = require("../../../store/hooks");
const commonUtil_1 = require("../../../lib/commonUtil");
const validates = __importStar(require("../../../lib/validators"));
const myValidates = __importStar(require("../../../lib/validators/broadcastValidator"));
const storage_1 = require("../../../lib/storage");
const EventListener_1 = __importDefault(require("../../atoms/EventListener"));
const SuggestSelectBox_1 = __importDefault(require("../../atoms/SuggestSelectBox"));
const TextArea_1 = __importDefault(require("../../atoms/TextArea"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
// eslint-disable-next-line import/no-cycle
const Broadcast_1 = require("./Broadcast");
const soalaMessages_1 = require("../../../lib/soalaMessages");
const BroadcastAftn = (props) => {
    const contentRef = (0, react_1.useRef)(null);
    const otherInputsAreaRef = (0, react_1.useRef)(null);
    const dispatch = (0, hooks_1.useAppDispatch)();
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
    const { isActive, priorityOption } = props;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Broadcast_1.RightContent, { disabled: false, isPc: isPc, isActive: isActive, ref: contentRef },
        react_1.default.createElement(Broadcast_1.Row, { ref: otherInputsAreaRef },
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(Broadcast_1.Flex, { width: 222 },
                        react_1.default.createElement(Broadcast_1.Col, { width: 70 },
                            react_1.default.createElement(Broadcast_1.Label, null, "Priority"),
                            react_1.default.createElement(redux_form_1.Field, { name: "Aftn.priority", component: SuggestSelectBox_1.default, validate: [validates.required, myValidates.isPriority], options: priorityOption, width: 70, maxLength: 2, hasBlank: true })),
                        react_1.default.createElement(Broadcast_1.Col, { width: 140 },
                            react_1.default.createElement(Broadcast_1.Label, null, "Originator"),
                            react_1.default.createElement(redux_form_1.Field, { name: "Aftn.originator", component: TextInput_1.default, width: 140, maxLength: 7, componentOnBlur: handleBlur, validate: [validates.isOkBroadcastTtyAddress, validates.required] }))))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Ruler, { isPc: isPc }, "....+....1....+....2....+....3....+....4....+....5....+....6....+....7"))),
        react_1.default.createElement(Broadcast_1.Row, null,
            react_1.default.createElement(Broadcast_1.TextAreaContainerFixed, { isPc: isPc, height: textAreaHeight },
                react_1.default.createElement(redux_form_1.Field, { name: "Aftn.aftnText", component: TextArea_1.default, width: Broadcast_1.ROW_WIDTH, maxLength: 4000, maxLengthCRLFCheck: true, maxWidth: Broadcast_1.ROW_WIDTH, minWidth: Broadcast_1.ROW_WIDTH, maxRowLength: 69, componentOnBlur: handleBlur, validate: [validates.required, isOkBroadcastAftn] }))),
        react_1.default.createElement(EventListener_1.default, { eventHandlers: [
                {
                    target: window,
                    type: "resize",
                    listener: () => setTextAreaHeight(calcTextAreaHeight()),
                    options: false,
                },
            ] })));
};
const mapStateToProps = (state) => {
    const { account: { master: { cdCtrlDtls }, }, } = state;
    const priorityOption = (0, commonUtil_1.getPriorities)(cdCtrlDtls);
    return {
        priorityOption,
    };
};
const isOkBroadcastAftn = (value = "") => {
    const removedComment = (0, commonUtil_1.removeTtyComment)(value);
    return !isAftnTextPattern(removedComment) || !isAftnTextBytes(removedComment) ? soalaMessages_1.SoalaMessage.M50014C : undefined;
};
const matchAddress = "(SS|DD|FF|GG|KK)( [A-Z0-9]{8}){1,7}";
const matchNewLine = "(\r\n|\n)";
const matchSender = "([0][1-9]|[12][0-9]|3[0-1])([01][0-9]|2[0-3])([0-5][0-9]) ([A-Z0-9]{8})";
const matchText = "[A-Z0-9 .()+*\\-/,_?:@'=\\\\%:#\r\n]*$";
const aftnTextPattern = `^(${matchAddress}${matchNewLine}){1,8}${matchSender}${matchNewLine}${matchText}`;
const isAftnTextPattern = (value) => !!(value != null && value.toString().match(new RegExp(aftnTextPattern)));
// aftnTextの本文のみ抽出
const matchNonTextPattern = `^(${matchAddress}${matchNewLine}){1,8}${matchSender}${matchNewLine}`;
const aftnText = (value) => (value != null ? value.toString().replace(new RegExp(matchNonTextPattern), "") : "");
const isAftnTextBytes = (value) => !!(aftnText(value) != null &&
    aftnText(value)
        .replace(/\r\n|\n/g, "")
        .match(/^.{1,1800}$/));
exports.default = (0, react_redux_1.connect)(mapStateToProps)(BroadcastAftn);
//# sourceMappingURL=BroadcastAftn.js.map