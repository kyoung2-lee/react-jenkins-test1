"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsSign = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
exports.CsSign = styled_components_1.default.span `
  width: 8px;
  height: 8px;
  background: #f4f085;
  border: 1px solid ${(props) => props.theme.color.PRIMARY};
  border-radius: 50%;
  display: inline-block;
`;
//# sourceMappingURL=CsSign.js.map