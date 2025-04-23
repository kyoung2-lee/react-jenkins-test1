"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const redux_form_1 = require("redux-form");
const styled_components_1 = __importDefault(require("styled-components"));
const SelectBox_1 = __importDefault(require("../../atoms/SelectBox"));
const TemplateJobcodeSearch = (props) => {
    const { onChangeJobCode, jobOption } = props;
    const selectBoxProps = {
        options: jobOption,
        isSearchable: true,
        placeholder: "Job Code",
        width: 137,
        maxMenuHeight: 408,
        maxLength: 10,
        tabIndex: 0,
    };
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(redux_form_1.Field, { name: "templateJobCd", component: SelectBox_1.default, props: selectBoxProps, onChange: (_, newValue) => onChangeJobCode(newValue) })));
};
const Container = styled_components_1.default.div `
  width: fit-content;
  z-index: 2; /*テンプレートソート切り替えボタンよりも上に選択肢を表示するため*/
  cursor: pointer;
`;
exports.default = TemplateJobcodeSearch;
//# sourceMappingURL=TemplateJobCodeSearch.js.map