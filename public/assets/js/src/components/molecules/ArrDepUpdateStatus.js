"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const UpdateStatusLabel_1 = __importDefault(require("../atoms/UpdateStatusLabel"));
const ArrDepUpdateStatus = (props) => {
    const { arrStatus, depStatus } = props;
    return (react_1.default.createElement(Wrapper, null,
        arrStatus ? (react_1.default.createElement(StatusBox, null,
            react_1.default.createElement("span", null, "ARR:"),
            react_1.default.createElement(UpdateStatusLabel_1.default, { status: arrStatus }))) : (react_1.default.createElement(StatusBox, null)),
        depStatus ? (react_1.default.createElement(StatusBox, null,
            react_1.default.createElement("span", null, "DEP:"),
            react_1.default.createElement(UpdateStatusLabel_1.default, { status: depStatus }))) : (react_1.default.createElement(StatusBox, null))));
};
const Wrapper = styled_components_1.default.div `
  height: 34px;
  padding-top: 10px;
  display: flex;
  justify-content: center;
`;
const StatusBox = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  width: 116px;
  > span {
    vertical-align: middle;
    font-size: 12px;
    color: #8ea6b7;
    padding-right: 2px;
  }
`;
exports.default = ArrDepUpdateStatus;
//# sourceMappingURL=ArrDepUpdateStatus.js.map