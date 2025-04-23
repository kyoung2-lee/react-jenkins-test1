"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterInput = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const icon_search_svg_1 = __importDefault(require("../../assets/images/icon/icon-search.svg"));
const FilterInput = (props) => {
    const { tabIndex, placeholder, handleKeyPress, handleChange, value, handleClick, handleSubmit, filtering } = props;
    return (react_1.default.createElement(Filter, null,
        react_1.default.createElement(Input, { tabIndex: tabIndex || 0, placeholder: placeholder, onKeyPress: handleKeyPress, onChange: handleChange, value: value }),
        react_1.default.createElement(OpenSearchFormButton, { type: "button", onClick: handleClick },
            react_1.default.createElement(OpenSearchFormButtonContent, null),
            react_1.default.createElement(OpenSearchFormButtonWhiteContent, null)),
        react_1.default.createElement(SubmitButton, { type: "button", onClick: handleSubmit, filtering: filtering },
            react_1.default.createElement(SubmitButtonContent, null))));
};
exports.FilterInput = FilterInput;
const Filter = styled_components_1.default.div `
  display: flex;
  align-items: center;
  border: 1px ${(props) => props.theme.color.PRIMARY} solid;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  width: 100%;
  height: 30px;
`;
const Input = styled_components_1.default.input `
  width: calc(100% - 70px);
  line-height: normal; /* safariでテキストを上下中央にする */
  height: 30px;
  margin-left: 6px;
  background: #ffffff;
  border: none;
  flex-basis: auto;
  &::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
`;
const OpenSearchFormButton = styled_components_1.default.button `
  flex-basis: 30px;
  width: 30px;
  height: 100%;
  cursor: pointer;
  display: block;
  outline: none;
  border: none;
  position: relative;
  background-color: transparent;
  padding: 0;

  &:hover {
    span {
      border-top-color: #346181;
    }
  }
`;
const OpenSearchFormButtonContent = styled_components_1.default.span `
  position: absolute;
  border-top: 11px solid #346181;
  border-right: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid transparent;
  top: 10px;
  right: 7px;
  width: 0;
  height: 0;
`;
const OpenSearchFormButtonWhiteContent = styled_components_1.default.span `
  position: absolute;
  border-top: 8px solid #ffffff;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid transparent;
  top: 11px;
  right: 9px;
  width: 0;
  height: 0;
`;
const SubmitButton = styled_components_1.default.button `
  outline: none;
  border: none;
  cursor: pointer;
  flex-basis: 40px;
  height: 100%;
  background-color: ${(props) => (props.filtering ? "#ED8E01" : props.theme.color.PRIMARY)};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${(props) => (props.filtering ? "#ED8E01" : props.theme.color.button.PRIMARY_HOVER)};
  }
`;
const SubmitButtonContent = styled_components_1.default.img.attrs({
    src: icon_search_svg_1.default,
}) `
  width: 20px;
  color: #fff;
`;
//# sourceMappingURL=FilterInput.js.map