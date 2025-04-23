"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hooks_1 = require("../../../store/hooks");
const FilterInput_1 = require("../../atoms/FilterInput");
const TemplateFilter = (props) => {
    const { onFilterKeyPress, onChangeFilter, filter, onClickTemplateFilter, applyFilter, isNameActive, onClickNameFilterTab, isRecentlyActive, onClickRecentlyFilterTab, } = props;
    const isTemplateFiltered = (0, hooks_1.useAppSelector)((state) => state.broadcast.Broadcast.isTemplateFiltered);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(FilterTextContainer, null,
            react_1.default.createElement(FilterInput_1.FilterInput, { placeholder: "Filter", handleKeyPress: onFilterKeyPress, handleChange: onChangeFilter, value: filter, handleClick: onClickTemplateFilter, handleSubmit: applyFilter, filtering: isTemplateFiltered })),
        react_1.default.createElement(FilterTabContainer, null,
            react_1.default.createElement(FilterTabs, null,
                react_1.default.createElement(FilterTab, { isActive: isNameActive, onClick: onClickNameFilterTab }, "Name"),
                react_1.default.createElement(FilterTab, { isActive: isRecentlyActive, onClick: onClickRecentlyFilterTab }, "Recently")))));
};
const FilterTextContainer = styled_components_1.default.div `
  margin-top: 12px;
  height: 32px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const FilterTabContainer = styled_components_1.default.div `
  margin-top: 7px;
  height: 40px;
`;
const FilterTabs = styled_components_1.default.div `
  width: 100%;
  z-index: 3;
  display: flex;
  height: 40px;
  > div:first-child {
    border-right: none;
  }
`;
const FilterTab = styled_components_1.default.div `
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  margin: 0 5px;
  border-bottom: ${(props) => (props.isActive ? "2px solid #346181" : "transparent")};
  z-index: ${(props) => (props.isActive ? "1" : "0")};
  color: #346181;
  background: ${(props) => (props.isActive ? "#fff" : "transparent")};
  cursor: pointer;
  font-size: 16px;
`;
exports.default = TemplateFilter;
//# sourceMappingURL=TemplateFilter.js.map