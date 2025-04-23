"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const BarChartStationOperationTaskButton = (props) => {
    const { extFisRow, onClick, disabled } = props;
    return extFisRow.gndWorkStepFlg ? (react_1.default.createElement(Square, { isTookOff: !!extFisRow.depToLcl },
        react_1.default.createElement(SquareContent, { onClick: () => onClick(extFisRow), disabled: disabled },
            react_1.default.createElement("div", null, extFisRow.gndLstTaskSts)))) : (react_1.default.createElement(SquareArea, null));
};
const SquareContent = styled_components_1.default.button `
  ${({ disabled }) => (disabled ? "" : "cursor: pointer;")}
  font-size: 18px;
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
`;
const SquareArea = styled_components_1.default.div `
  position: relative;
  top: 0px;
  width: 36px;
  height: 40px;
`;
const Square = (0, styled_components_1.default)(SquareArea) `
  display: inline-block;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;
exports.default = BarChartStationOperationTaskButton;
//# sourceMappingURL=BarChartStationOperationTaskButton.js.map