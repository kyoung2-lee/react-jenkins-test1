"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const commonUtil_1 = require("../../lib/commonUtil");
const blade_svg_1 = __importDefault(require("../../assets/images/icon/blade.svg"));
const BarChartShipButton = (props) => {
    const { extFisRow, onClick, disabled } = props;
    return (react_1.default.createElement(ShipContent, { onClick: onClick, disabled: disabled },
        react_1.default.createElement("div", null,
            (0, commonUtil_1.removeJa)(extFisRow.gndShipNo1),
            extFisRow.gndShipNo2),
        react_1.default.createElement("div", null,
            extFisRow.gndSeatConfCd || "-",
            extFisRow.gndWingletFlg && react_1.default.createElement(BladeIcon, null))));
};
const ShipContent = styled_components_1.default.button `
  ${({ disabled }) => disabled
    ? ""
    : `
    cursor: pointer;
  `}
  padding-top: 0px;
  font-size: 16px;
  background: none;
  color: #346181;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > div:first-child {
    font-size: 20px;
  }
  > div:nth-child(2) {
    display: flex;
  }
  img {
    margin-top: 5px;
    width: 11px;
    height: 9px;
  }
`;
const BladeIcon = styled_components_1.default.img.attrs({ src: blade_svg_1.default }) ``;
exports.default = BarChartShipButton;
//# sourceMappingURL=BarChartShipButton.js.map