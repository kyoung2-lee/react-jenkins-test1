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
const storage_1 = require("../../../lib/storage");
const commonUtil_1 = require("../../../lib/commonUtil");
const validates = __importStar(require("../../../lib/validators"));
const EventListener_1 = __importDefault(require("../../atoms/EventListener"));
const MultipleSelectBox_1 = __importDefault(require("../../atoms/MultipleSelectBox"));
const TextArea_1 = __importDefault(require("../../atoms/TextArea"));
const TextInput_1 = __importDefault(require("../../atoms/TextInput"));
// eslint-disable-next-line import/no-cycle
const Broadcast_1 = require("./Broadcast");
const BroadcastAcars = (props) => {
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
    const toUpperCase = (e) => {
        if (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dispatch((0, redux_form_1.change)(Broadcast_1.FORM_NAME, e.target.name, (0, commonUtil_1.toUpperCase)(e.target.value)));
        }
    };
    const { isActive, shipOption } = props;
    const { isPc } = storage_1.storage;
    return (react_1.default.createElement(Broadcast_1.RightContent, { disabled: false, isPc: isPc, isActive: isActive, ref: contentRef },
        react_1.default.createElement(Broadcast_1.Row, { ref: otherInputsAreaRef },
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "SHIP"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "Acars.shipNoList", options: shipOption, component: MultipleSelectBox_1.default, validate: [validates.required, validates.unique], maxValLength: SHIP_ITEM_MAX }))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Label, null, "Originator"),
                react_1.default.createElement(Broadcast_1.Flex, null,
                    react_1.default.createElement(redux_form_1.Field, { name: "Acars.orgnTtyAddr", autoCapitalize: "off", component: TextInput_1.default, width: 140, maxLength: 7, componentOnBlur: toUpperCase, validate: [validates.required, validates.isOkBroadcastTtyAddress] }))),
            react_1.default.createElement(Broadcast_1.Row, null,
                react_1.default.createElement(Broadcast_1.Ruler, { isPc: isPc }, "....+....1....+....2....+....3....+....4"))),
        react_1.default.createElement(Broadcast_1.Flex, null,
            react_1.default.createElement(Broadcast_1.Flex, { width: 410 },
                react_1.default.createElement(Broadcast_1.TextAreaContainerFixed, { isPc: isPc, height: textAreaHeight },
                    react_1.default.createElement(redux_form_1.Field, { name: "Acars.uplinkText", component: TextArea_1.default, width: 410, maxLength: 2100, maxLengthCRLFCheck: true, maxRowLength: 40, maxRows: 50, maxWidth: 410, minWidth: 410, componentOnBlur: toUpperCase, validate: [validates.required, validates.isOkBroadcastAcars] }))),
            react_1.default.createElement(Broadcast_1.CheckBoxContainer, { width: 280 },
                react_1.default.createElement(Broadcast_1.CheckBoxLabel, { htmlFor: "acarsReqAckFlg" },
                    react_1.default.createElement(redux_form_1.Field, { name: "Acars.reqAckFlg", id: "acarsReqAckFlg", component: "input", tabIndex: 22, type: "checkbox" }),
                    "REQ ACK"))),
        react_1.default.createElement(EventListener_1.default, { eventHandlers: [
                {
                    target: window,
                    type: "resize",
                    listener: () => setTextAreaHeight(calcTextAreaHeight()),
                    options: false,
                },
            ] })));
};
const SHIP_ITEM_MAX = 8;
const mapStateToProps = (state) => {
    const { account: { master: { ships }, }, } = state;
    const shipOption = ships.map((ship) => (0, Broadcast_1.createOption)(ship.shipNo));
    return {
        shipOption,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(BroadcastAcars);
//# sourceMappingURL=BroadcastAcars.js.map