"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const dayjs_1 = __importDefault(require("dayjs"));
const PrimaryButton_1 = __importDefault(require("../atoms/PrimaryButton"));
const TimeInputPanel = (props) => {
    const handleOnClickCurrent = () => {
        const { onClick, timeDiff } = props;
        const timeDiffUtcHr = Math.trunc(timeDiff / 100);
        const timeDiffUtcMin = timeDiff % 100;
        if (onClick) {
            onClick(dayjs_1.default.utc().second(0).add(timeDiffUtcMin, "minute").add(timeDiffUtcHr, "hour").format("YYYY-MM-DD[T]HH:mm:ss"));
        }
    };
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(PrimaryButton_1.default, { type: "button", text: "Current", width: props.width || "88px", height: props.height || "44px", onClick: handleOnClickCurrent, disabled: props.disabled })));
};
const Container = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
exports.default = TimeInputPanel;
//# sourceMappingURL=TimeInputPanel.js.map