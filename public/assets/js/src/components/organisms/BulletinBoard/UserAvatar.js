"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAvatar = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
const profile_svg_1 = __importDefault(require("../../../assets/images/account/profile.svg"));
exports.UserAvatar = styled_components_1.default.div `
  width: 36px;
  height: 36px;
  border-radius: 18px;
  margin-right: 5px;
  background-image: url("${(props) => props.src || profile_svg_1.default}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;
//# sourceMappingURL=UserAvatar.js.map