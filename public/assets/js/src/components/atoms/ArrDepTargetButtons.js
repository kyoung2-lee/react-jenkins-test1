"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const arr_dep_different_svg_1 = __importDefault(require("../../assets/images/icon/arr_dep_different.svg"));
const arr_dep_same_svg_1 = __importDefault(require("../../assets/images/icon/arr_dep_same.svg"));
const arr_only_svg_1 = __importDefault(require("../../assets/images/icon/arr_only.svg"));
const dep_only_svg_1 = __importDefault(require("../../assets/images/icon/dep_only.svg"));
const storage_1 = require("../../lib/storage");
const ArrDepTargetButtons = (props) => {
    const { fixed, selectedTarget, onClickTarget } = props;
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement("label", null, "Target"),
        react_1.default.createElement(ButtonWrapper, null,
            react_1.default.createElement(Button, { type: "button", onClick: () => onClickTarget("ARR_DEP_SAME"), disabled: fixed && selectedTarget !== "ARR_DEP_SAME", isPc: storage_1.storage.isPc, isActive: selectedTarget === "ARR_DEP_SAME" },
                react_1.default.createElement(ArrDepSameIcon, null)),
            react_1.default.createElement(Button, { type: "button", onClick: () => onClickTarget("ARR"), disabled: fixed && selectedTarget !== "ARR", isPc: storage_1.storage.isPc, isActive: selectedTarget === "ARR" },
                react_1.default.createElement(ArrIcon, null)),
            react_1.default.createElement(Button, { type: "button", onClick: () => onClickTarget("DEP"), disabled: fixed && selectedTarget !== "DEP", isPc: storage_1.storage.isPc, isActive: selectedTarget === "DEP" },
                react_1.default.createElement(DepIcon, null)),
            react_1.default.createElement(Button, { type: "button", onClick: () => onClickTarget("ARR_DEP_DIFF"), disabled: fixed && selectedTarget !== "ARR_DEP_DIFF", isPc: storage_1.storage.isPc, isActive: selectedTarget === "ARR_DEP_DIFF" },
                react_1.default.createElement(ArrDepDifferIcon, null)))));
};
const Container = styled_components_1.default.div `
  width: 100%;
  text-align: left;
  padding: 0 11px 10px;
  > label {
    color: #222222;
    font-size: 12px;
    margin: auto 8px;
  }
`;
const ButtonWrapper = styled_components_1.default.div `
  display: flex;
`;
const ArrIcon = styled_components_1.default.img.attrs({ src: arr_only_svg_1.default }) ``;
const DepIcon = styled_components_1.default.img.attrs({ src: dep_only_svg_1.default }) ``;
const ArrDepSameIcon = styled_components_1.default.img.attrs({ src: arr_dep_same_svg_1.default }) ``;
const ArrDepDifferIcon = styled_components_1.default.img.attrs({ src: arr_dep_different_svg_1.default }) ``;
const Button = styled_components_1.default.button `
  width: 80px;
  background: ${({ isActive, theme }) => (isActive ? "#E6B422" : theme.color.button.SECONDARY)};
  height: 32px;
  color: ${(props) => props.theme.color.WHITE};
  border-radius: 4px;
  padding: 0;
  border: solid 1px ${(props) => props.theme.color.PRIMARY};
  font-size: 10px;
  margin: auto 4px;

  ${({ disabled, theme, isPc, isActive }) => disabled
    ? "opacity: 0.6;"
    : `
      cursor: pointer;
      box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
      ${isPc
        ? `
        &:hover, &:focus {
          background: ${isActive ? "#E6B422" : theme.color.button.SECONDARY_HOVER};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
        }
        &:active {
          background: ${isActive ? "#E6B422" : theme.color.button.SECONDARY_ACTIVE};
        }
      `
        : `
        &:active {
          background: ${isActive ? "#E6B422" : theme.color.button.SECONDARY_ACTIVE};
          box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
        }
      `}
  `};
  img {
    width: 64px;
    height: 20px;
    margin: 5px auto;
  }
`;
exports.default = ArrDepTargetButtons;
//# sourceMappingURL=ArrDepTargetButtons.js.map