"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const RoundButtonSmallPlus_1 = __importDefault(require("../atoms/RoundButtonSmallPlus"));
const RoundButtonSmallMinus_1 = __importDefault(require("../atoms/RoundButtonSmallMinus"));
const TimeInputPlusMinusButtons = (props) => {
    const { onClick, dateTimeValue, onClickMinusCustomEvent, onClickPlusCustomEvent } = props;
    const calcDateTimeValue = (minutes) => {
        if (dateTimeValue) {
            const dayjsValue = (0, dayjs_1.default)(dateTimeValue);
            if (dayjsValue.isValid()) {
                if (onClick) {
                    onClick(dayjsValue.add(minutes, "minute").format("YYYY-MM-DD[T]HH:mm:ss"));
                }
            }
        }
    };
    const handleOnClickMinus = () => {
        if (onClickMinusCustomEvent) {
            onClickMinusCustomEvent();
        }
        else {
            calcDateTimeValue(-1);
        }
    };
    const handleOnClickPlus = () => {
        if (onClickPlusCustomEvent) {
            onClickPlusCustomEvent();
        }
        else {
            calcDateTimeValue(1);
        }
    };
    const { children, disabled, showDisabled, notFocus = false } = props;
    const tabIndex = notFocus ? -1 : undefined;
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(ButtonContainer, { showDisabled: showDisabled }, showDisabled ? (react_1.default.createElement(RoundButtonSmallMinus_1.default, { disabled: disabled, type: "button", onClick: handleOnClickMinus, tabIndex: tabIndex })) : (!disabled && react_1.default.createElement(RoundButtonSmallMinus_1.default, { type: "button", onClick: handleOnClickMinus, tabIndex: tabIndex }))),
        children,
        react_1.default.createElement(ButtonContainer, { showDisabled: showDisabled }, showDisabled ? (react_1.default.createElement(RoundButtonSmallPlus_1.default, { disabled: disabled, type: "button", onClick: handleOnClickPlus, tabIndex: tabIndex })) : (!disabled && react_1.default.createElement(RoundButtonSmallPlus_1.default, { type: "button", onClick: handleOnClickPlus, tabIndex: tabIndex })))));
};
const Container = styled_components_1.default.div `
  display: flex;
  align-items: flex-end;
`;
const ButtonContainer = styled_components_1.default.div `
  display: flex;
  width: ${({ showDisabled }) => (showDisabled ? 36 : 40)}px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;
exports.default = TimeInputPlusMinusButtons;
//# sourceMappingURL=TimeInputPlusMinusButtons.js.map