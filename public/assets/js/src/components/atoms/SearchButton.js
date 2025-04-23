"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const search_svg_component_1 = __importDefault(require("../../assets/images/icon/search.svg?component"));
const SearchButton = (props) => {
    const { isFiltered, onClick } = props;
    return (react_1.default.createElement(SearchButtonBase, { isFiltered: isFiltered, onClick: onClick },
        react_1.default.createElement(search_svg_component_1.default, null)));
};
const SearchButtonBase = styled_components_1.default.div `
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

  svg {
    width: 26px;
    height: 26px;
    path {
      fill: ${(props) => props.theme.color.PRIMARY_BASE};
    }
  }
`;
exports.default = SearchButton;
//# sourceMappingURL=SearchButton.js.map