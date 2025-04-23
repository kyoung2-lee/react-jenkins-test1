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
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../store/hooks");
const commonUtil_1 = require("../../lib/commonUtil");
const commonConst_1 = require("../../lib/commonConst");
const storage_1 = require("../../lib/storage");
const validates = __importStar(require("../../lib/validators"));
const KeyTop_1 = __importDefault(require("../atoms/KeyTop"));
const KeyboardInputNumber_1 = __importDefault(require("./KeyboardInputNumber"));
const KeyboardInputAlphabet_1 = __importDefault(require("./KeyboardInputAlphabet"));
const flightNumberInputPopup_1 = require("../../reducers/flightNumberInputPopup");
const icon_keybord_svg_component_1 = __importDefault(require("../../assets/images/icon/icon-keybord.svg?component"));
const icon_enter_svg_component_1 = __importDefault(require("../../assets/images/icon/icon-enter.svg?component"));
const KeyTopExecutable_1 = __importDefault(require("../atoms/KeyTopExecutable"));
const RawTextInput_1 = __importDefault(require("../atoms/RawTextInput"));
const initialState = {
    flightNo: "",
    isAlphabetKeybord: false,
};
const FlightNumberInputPopup = () => {
    const dispatch = (0, hooks_1.useAppDispatch)();
    const flightNumberInputPopup = (0, hooks_1.useAppSelector)((state) => state.flightNumberInputPopup);
    const [flightNo, setFlightNo] = (0, react_1.useState)(initialState.flightNo);
    const [isAlphabetKeybord, setIsAlphabetKeybord] = (0, react_1.useState)(initialState.isAlphabetKeybord);
    // eslint-disable-next-line @typescript-eslint/require-await
    const onEnter = async () => {
        const { formName, fieldName } = flightNumberInputPopup;
        const formatedFligntNo = (0, commonUtil_1.formatFlt)(flightNo);
        dispatch((0, redux_form_1.change)(formName, fieldName, formatedFligntNo));
        flightNumberInputPopup.onEnter();
        await closeModal();
    };
    const onSubmit = async () => {
        const { formName, executeSubmit } = flightNumberInputPopup;
        await onEnter();
        if (executeSubmit) {
            dispatch((0, redux_form_1.submit)(formName));
        }
        await closeModal();
    };
    const onRequestClose = async (e) => {
        e.stopPropagation();
        await closeModal();
    };
    // eslint-disable-next-line react/sort-comp
    const checkCanSubmit = () => {
        const { canOnlyAlCd } = flightNumberInputPopup;
        return validates.hasValue(flightNo) && validates.isOnlyHalfWidth(flightNo) && canOnlyAlCd ? flightNo.length >= 2 : flightNo.length >= 3;
    };
    // eslint-disable-next-line @typescript-eslint/require-await
    const closeModal = async () => {
        setFlightNo(initialState.flightNo);
        setIsAlphabetKeybord(initialState.isAlphabetKeybord);
        dispatch((0, flightNumberInputPopup_1.closeFlightNumberInputPopup)());
    };
    const clearFlightNo = () => {
        setFlightNo(flightNo.slice(0, -1));
    };
    // eslint-disable-next-line react/sort-comp
    const handleAirLineCode = (airLineCode) => {
        setFlightNo(airLineCode);
    };
    const handleButtomInputFlightNo = (inputString) => {
        setFlightNoState(flightNo + inputString);
    };
    const setFlightNoState = (nextFlightNo) => {
        const maxLength = 6;
        if (nextFlightNo.length <= maxLength) {
            setFlightNo(nextFlightNo);
        }
    };
    const switchKeybord = () => {
        setIsAlphabetKeybord((prevIsAlphabetKeybord) => !prevIsAlphabetKeybord);
    };
    const canSubmit = checkCanSubmit();
    return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    react_1.default.createElement(react_modal_1.default, { isOpen: flightNumberInputPopup.isOpen, onRequestClose: onRequestClose, style: customStyles },
        react_1.default.createElement("div", null,
            react_1.default.createElement(Header, null,
                react_1.default.createElement(SwitchBottom, { input: switchKeybord }, isAlphabetKeybord ? "123" : "abc"),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(RawTextInput_1.default, { value: flightNo, onChange: (e) => setFlightNoState(e.target.value), onBlur: (e) => setFlightNoState((0, commonUtil_1.removePictograph)(e.target.value)), placeholder: "FLT", maxLength: 6, disabled: storage_1.storage.terminalCat !== commonConst_1.Const.TerminalCat.pc, isShowingShadow: true, isFixedFocus: true, terminalCat: storage_1.storage.terminalCat, autoFocus: storage_1.storage.terminalCat === commonConst_1.Const.TerminalCat.pc, 
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onEnter: onEnter })),
                canSubmit ? (
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                react_1.default.createElement(EnterBottom, { input: onEnter },
                    react_1.default.createElement(icon_enter_svg_component_1.default, null))) : (react_1.default.createElement(DisabledEnterBottom, null,
                    react_1.default.createElement(icon_enter_svg_component_1.default, null))),
                react_1.default.createElement(CloseBottom, { input: closeModal },
                    react_1.default.createElement(icon_keybord_svg_component_1.default, null))),
            react_1.default.createElement(TopColumn, null, commonConst_1.Const.AIRLINES.map((al) => (react_1.default.createElement(AirLineCodeKeyTop, { key: al.alCd, input: () => {
                    void handleAirLineCode(al.alCd);
                } }, al.alCd)))),
            react_1.default.createElement(Content, null, isAlphabetKeybord ? (react_1.default.createElement(KeyboardInputAlphabet_1.default
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            , { 
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit: onSubmit, clear: clearFlightNo, canSubmit: canSubmit, handle: (value) => handleButtomInputFlightNo(value) })) : (react_1.default.createElement(KeyboardInputNumber_1.default
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            , { 
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit: onSubmit, clear: clearFlightNo, canSubmit: canSubmit, handle: (value) => handleButtomInputFlightNo(value) }))))));
};
react_modal_1.default.setAppElement("#content");
const customStyles = {
    overlay: {
        zIndex: 999999990 /* reapop(999999999)の下 */,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    content: {
        position: "static",
        width: "370px",
        padding: 0,
    },
};
const Header = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #c9d3d0;
  padding: 10px;
  background-color: #f0f0f0;
`;
const CloseBottom = (0, styled_components_1.default)(KeyTopExecutable_1.default) `
  width: 50px;
  background: #abb3bb;
  padding: 9px 5px 5px 5px;

  svg {
    width: 50px;
    .a {
      fill: #222;
    }
    .b,
    .c {
      fill: none;
    }
    .c {
      stroke: #222;
    }
    .d {
      stroke: none;
    }
  }
`;
const EnterBottom = (0, styled_components_1.default)(KeyTopExecutable_1.default) `
  width: 50px;
  background: #1075e7;

  svg {
    width: 15px;
    .a {
      fill: none;
      stroke: #fff;
      stroke-width: 2px;
    }
  }
`;
const DisabledEnterBottom = (0, styled_components_1.default)(KeyTopExecutable_1.default) `
  width: 50px;

  svg {
    width: 15px;
    .a {
      fill: none;
      stroke: #fff;
      stroke-width: 2px;
      stroke: #000;
    }
  }
`;
const SwitchBottom = (0, styled_components_1.default)(KeyTop_1.default) `
  font-size: 18px;
  width: 50px;
  background: #abb3bb;
`;
const Content = styled_components_1.default.div `
  padding: 10px;
  background-color: #c8c8c8;
`;
const TopColumn = styled_components_1.default.div `
  width: 100%;
  padding: 10px 10px 0 10px;
  display: flex;
  justify-content: space-between;
  background-color: #c8c8c8;
`;
const AirLineCodeKeyTop = (0, styled_components_1.default)(KeyTop_1.default) `
  width: 50px;
  font-size: 22px;

  &:last-child {
    margin-bottom: 0;
  }
`;
exports.default = FlightNumberInputPopup;
//# sourceMappingURL=FlightNumberInputPopup.js.map