"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const gear_svg_component_1 = __importDefault(require("../../../assets/images/icon/gear.svg?component"));
const trash_svg_component_1 = __importDefault(require("../../../assets/images/icon/trash.svg?component"));
const storage_1 = require("../../../lib/storage");
const SwipeableCell_1 = __importDefault(require("../../atoms/SwipeableCell"));
const Template = (props) => {
    const { id, disabled, isEditable, isDeletable, onClickEdit, onClickDelete, onClickTemplate, isActive, name, type } = props;
    const { isPc } = storage_1.storage;
    const sendBy = convertTypeToSendBy(type);
    if (isPc) {
        return (react_1.default.createElement(TemplatePanel, { isPc: isPc },
            react_1.default.createElement(Tools, { className: "tools" },
                react_1.default.createElement(TemplateEditButton, { isPc: isPc, onClick: () => onClickEdit(id, name, type), disabled: !isEditable },
                    react_1.default.createElement(gear_svg_component_1.default, null)),
                react_1.default.createElement(TemplateEditButton, { isPc: isPc, onClick: () => onClickDelete(id), disabled: !isDeletable },
                    react_1.default.createElement(trash_svg_component_1.default, null))),
            react_1.default.createElement(TemplateComponent, { onClick: () => !disabled && onClickTemplate(id, type), isActive: isActive, disabled: disabled },
                react_1.default.createElement(TemplateNameComponent, null, name),
                react_1.default.createElement(TemplateTypeComponent, null, sendBy))));
    }
    const { deltaX, onPanStart, onPan, onPanEnd } = props;
    return (react_1.default.createElement(TemplatePanel, null,
        react_1.default.createElement(TemplateEditContainer, { onClick: () => onClickEdit(id, name, type), disabled: !isEditable },
            react_1.default.createElement(TemplateEditButton, { isPc: isPc },
                react_1.default.createElement(gear_svg_component_1.default, null))),
        react_1.default.createElement(TemplateTrashContainer, { onClick: () => onClickDelete(id), disabled: !isDeletable },
            react_1.default.createElement(TemplateEditButton, { isPc: isPc },
                react_1.default.createElement(trash_svg_component_1.default, null))),
        react_1.default.createElement(SwipeableCell_1.default, { deltaX: deltaX, onPanStart: onPanStart, onPan: onPan, onPanEnd: onPanEnd, disabled: !isDeletable },
            react_1.default.createElement(TemplateComponent, { onClick: () => !disabled && onClickTemplate(id, type), isActive: isActive, disabled: disabled },
                react_1.default.createElement(TemplateNameComponent, null, name),
                react_1.default.createElement(TemplateTypeComponent, null, sendBy)))));
};
const convertTypeToSendBy = (type) => {
    switch (type) {
        case "BB":
            return "B.B.";
        case "MAIL":
            return "e-mail";
        case "TTY":
            return "TTY";
        case "ACARS":
            return "ACARS";
        case "NTF":
            return "Notification";
        default:
            return type;
    }
};
const TemplatePanel = styled_components_1.default.div `
  position: relative;
  background: #346181;
  cursor: pointer;
  ${(props) => (props.isPc ? "&:hover .tools { display: inline-block; }" : "")}
`;
const Tools = styled_components_1.default.div `
  display: none;
  float: right;
  color: black;
  line-height: 40px;
  > div {
    display: inline-block;
    cursor: pointer;
  }
`;
const TemplateEditButton = styled_components_1.default.div `
  display: ${(props) => (props.disabled ? "none!important" : "inline-block")};
  vertical-align: middle;
  line-height: 0;
  text-align: center;
  height: ${(props) => (props.isPc ? 36 : 42)}px;
  width: ${(props) => (props.isPc ? 36 : 42)}px;
  margin-right: 5px;
  padding: ${(props) => (props.isPc ? 6 : 9)}px;
  cursor: pointer;
  &:hover {
    cursor: pointer;
    ${(props) => (props.isPc ? "border-radius: 50%; background: #EEEEEE;" : "")}
  }
  > svg {
    fill: ${(props) => (props.isPc ? "#346181" : "#FFFFFF")};
  }
`;
const TemplateComponent = styled_components_1.default.div `
  border: ${(props) => (props.isActive && !props.disabled ? "1px solid #F9A825" : "1px solid #346181")};
  padding: 5px 10px;
  background: ${(props) => (props.disabled ? "#EBEBE4" : "#FFFFFF")};
  ${(props) => (props.disabled ? "> div { opacity: .6; }" : "")}
`;
const TemplateNameComponent = styled_components_1.default.div `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
`;
const TemplateTypeComponent = styled_components_1.default.div `
  color: #969696;
  font-size: 12px;
  margin-top: 2px;
  font-size: 11px;
`;
const TemplateEditContainer = styled_components_1.default.div `
  display: ${(props) => (props.disabled ? "none" : "table")};
  position: absolute;
  width: 72px;
  color: white;
  text-align: center;
  height: 42px;
`;
const TemplateTrashContainer = styled_components_1.default.div `
  display: ${(props) => (props.disabled ? "none" : "table")};
  position: absolute;
  width: 72px;
  color: white;
  text-align: center;
  height: 42px;
  right: 0;
`;
exports.default = Template;
//# sourceMappingURL=Template.js.map