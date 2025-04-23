"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusLabel = void 0;
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../../store/hooks");
const UpdateStatusLabel_1 = __importDefault(require("../../atoms/UpdateStatusLabel"));
const StatusLabel = (props) => {
    const { rowStatusList } = (0, hooks_1.useAppSelector)((state) => props.isDep ? state.multipleFlightMovementModals.modalDep : state.multipleFlightMovementModals.modalArr);
    return react_1.default.createElement(UpdateStatusLabel_1.default, { status: rowStatusList[props.rowIndex].status });
};
exports.StatusLabel = StatusLabel;
//# sourceMappingURL=MultipleFlightMovementRowStatus.js.map