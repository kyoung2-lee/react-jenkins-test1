"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const icon_scroll_top_svg_1 = __importDefault(require("../../assets/images/icon/icon-scroll-top.svg"));
const InitialPositionButton = (props) => {
    const { isDisplaying, onClick } = props;
    return isDisplaying ? (react_1.default.createElement(ScrollToTopIconContainer, { onClick: onClick },
        react_1.default.createElement(ScrollTopIcon, null))) : (react_1.default.createElement(DummyContainer, null));
};
const ScrollToTopIconContainer = styled_components_1.default.div `
  width: 60px;
  height: 60px;
  background: ${(props) => (props.isFiltered ? "#eda63c" : props.theme.color.PRIMARY)};
  border: 2px solid ${(props) => props.theme.color.PRIMARY_BASE};
  border-radius: 30px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.33);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.isFiltered ? "#ED8E01" : props.theme.color.button.PRIMARY_HOVER)};
  }
  &:active {
    background: ${(props) => (props.isFiltered ? "#B57913" : props.theme.color.button.PRIMARY_ACTIVE)};
  }
`;
const ScrollTopIcon = styled_components_1.default.img.attrs({ src: icon_scroll_top_svg_1.default }) `
  width: 30px;
  height: 20.46px;
  margin-top: 5px;
  fill: ${(props) => props.theme.color.PRIMARY_BASE};
`;
const DummyContainer = styled_components_1.default.div `
  width: 60px;
  height: 60px;
  pointer-events: none;
`;
exports.default = InitialPositionButton;
//# sourceMappingURL=InitialPositionButton.js.map